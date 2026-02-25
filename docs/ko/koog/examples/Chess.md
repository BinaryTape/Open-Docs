# Koog 프레임워크를 활용한 AI 체스 플레이어 구축하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb
){ .md-button }

이 튜토리얼에서는 Koog 프레임워크를 사용하여 지능형 체스 플레이 에이전트를 구축하는 방법을 보여줍니다. 도구 통합, 에이전트 전략, 메모리 최적화 및 대화형 AI 의사 결정 등 핵심 개념을 살펴보겠습니다.

## 학습 내용

- 복잡한 게임을 위한 도메인별 데이터 구조 모델링 방법
- 에이전트가 환경과 상호 작용하기 위해 사용할 수 있는 커스텀 도구 제작
- 메모리 관리를 포함한 효율적인 에이전트 전략 구현
- 선택지 선택 기능을 갖춘 대화형 AI 시스템 구축
- 턴제 게임을 위한 에이전트 성능 최적화

## 설정

먼저, Koog 프레임워크를 임포트하고 개발 환경을 설정합니다.

```kotlin
%useLatestDescriptors
%use koog
```

## 체스 도메인 모델링

견고한 도메인 모델을 만드는 것은 모든 게임 AI에 필수적입니다. 체스에서는 플레이어, 기물(piece) 및 그들 사이의 관계를 표현해야 합니다. 먼저 핵심 데이터 구조를 정의해 보겠습니다.

### 핵심 열거형(Enums) 및 타입

```kotlin
enum class Player {
    White, Black, None;

    fun opponent(): Player = when (this) {
        White -> Black
        Black -> White
        None -> throw IllegalArgumentException("No opponent for None player")
    }
}

enum class PieceType(val id: Char) {
    King('K'), Queen('Q'), Rook('R'),
    Bishop('B'), Knight('N'), Pawn('P'), None('*');

    companion object {
        fun fromId(id: String): PieceType {
            require(id.length == 1) { "Invalid piece id: $id" }

            return entries.first { it.id == id.single() }
        }
    }
}

enum class Side {
    King, Queen
}
```

`Player` 열거형은 체스의 양측을 나타내며, 플레이어 간의 전환을 쉽게 해주는 `opponent()` 메서드를 가집니다. `PieceType` 열거형은 각 체스 기물을 표준 표기법 문자에 매핑하여 체스 수(move)를 쉽게 파싱할 수 있게 합니다.

`Side` 열거형은 킹사이드(kingside)와 퀸사이드(queenside) 캐슬링 움직임을 구분하는 데 도움을 줍니다.

### 기물 및 위치 모델링

```kotlin
data class Piece(val pieceType: PieceType, val player: Player) {
    init {
        require((pieceType == PieceType.None) == (player == Player.None)) {
            "Invalid piece: $pieceType $player"
        }
    }

    fun toChar(): Char = when (player) {
        Player.White -> pieceType.id.uppercaseChar()
        Player.Black -> pieceType.id.lowercaseChar()
        Player.None -> pieceType.id
    }

    fun isNone(): Boolean = pieceType == PieceType.None

    companion object {
        val None = Piece(PieceType.None, Player.None)
    }
}

data class Position(val row: Int, val col: Char) {
    init {
        require(row in 1..8 && col in 'a'..'h') { "Invalid position: $col$row" }
    }

    constructor(position: String) : this(
        position[1].digitToIntOrNull() ?: throw IllegalArgumentException("Incorrect position: $position"),
        position[0],
    ) {
        require(position.length == 2) { "Invalid position: $position" }
    }
}

class ChessBoard {
    private val backRow = listOf(
        PieceType.Rook, PieceType.Knight, PieceType.Bishop,
        PieceType.Queen, PieceType.King,
        PieceType.Bishop, PieceType.Knight, PieceType.Rook
    )

    private val board: List<MutableList<Piece>> = listOf(
        backRow.map { Piece(it, Player.Black) }.toMutableList(),
        List(8) { Piece(PieceType.Pawn, Player.Black) }.toMutableList(),
        List(8) { Piece.None }.toMutableList(),
        List(8) { Piece.None }.toMutableList(),
        List(8) { Piece.None }.toMutableList(),
        List(8) { Piece.None }.toMutableList(),
        List(8) { Piece(PieceType.Pawn, Player.White) }.toMutableList(),
        backRow.map { Piece(it, Player.White) }.toMutableList()
    )

    override fun toString(): String = board
        .withIndex().joinToString("
") { (index, row) ->
            "${8 - index} ${row.map { it.toChar() }.joinToString(" ")}"
        } + "
  a b c d e f g h"

    fun getPiece(position: Position): Piece = board[8 - position.row][position.col - 'a']
    fun setPiece(position: Position, piece: Piece) {
        board[8 - position.row][position.col - 'a'] = piece
    }
}
```

`Piece` 데이터 클래스는 기물 타입과 소유자를 결합하며, 시각적 표현에서 백색 기물은 대문자, 흑색 기물은 소문자를 사용합니다. `Position` 클래스는 유효성 검사 기능이 내장된 체스 좌표(예: "e4")를 캡슐화합니다.

## 게임 상태 관리

### ChessBoard 구현

`ChessBoard` 클래스는 8×8 그리드와 기물 위치를 관리합니다. 주요 설계 결정은 다음과 같습니다:

- **내부 표현**: 효율적인 액세스 및 수정을 위해 가변 리스트의 리스트(list of mutable lists)를 사용합니다.
- **시각적 표시**: `toString()` 메서드는 랭크(rank) 숫자와 파일(file) 문자가 포함된 명확한 ASCII 표현을 제공합니다.
- **위치 매핑**: 체스 표기법(a1-h8)과 내부 배열 인덱스 간의 변환을 수행합니다.

### ChessGame 로직

```kotlin
/**
 * 유효한 수에 대한 검사가 없는 간단한 체스 게임입니다.
 * 입력된 수가 유효하다면 보드의 올바른 상태를 저장합니다.
 */
class ChessGame {
    private val board: ChessBoard = ChessBoard()
    private var currentPlayer: Player = Player.White
    val moveNotation: String = """
        0-0 - 짧은 캐슬링(short castle)
        0-0-0 - 긴 캐슬링(long castle)
        <piece>-<from>-<to> - 일반적인 수. 예: p-e2-e4
        <piece>-<from>-<to>-<promotion> - 프로모션 수. 예: p-e7-e8-q.
        기물 이름:
            p - 폰(pawn)
            n - 나이트(knight)
            b - 비숍(bishop)
            r - 룩(rook)
            q - 퀸(queen)
            k - 킹(king)
    """.trimIndent()

    fun move(move: String) {
        when {
            move == "0-0" -> castleMove(Side.King)
            move == "0-0-0" -> castleMove(Side.Queen)
            move.split("-").size == 3 -> {
                val (_, from, to) = move.split("-")
                usualMove(Position(from), Position(to))
            }

            move.split("-").size == 4 -> {
                val (piece, from, to, promotion) = move.split("-")

                require(PieceType.fromId(piece) == PieceType.Pawn) { "폰만 프로모션될 수 있습니다." }

                usualMove(Position(from), Position(to))
                board.setPiece(Position(to), Piece(PieceType.fromId(promotion), currentPlayer))
            }

            else -> throw IllegalArgumentException("유효하지 않은 수: $move")
        }

        updateCurrentPlayer()
    }

    fun getBoard(): String = board.toString()
    fun currentPlayer(): String = currentPlayer.name.lowercase()

    private fun updateCurrentPlayer() {
        currentPlayer = currentPlayer.opponent()
    }

    private fun usualMove(from: Position, to: Position) {
        if (board.getPiece(from).pieceType == PieceType.Pawn && from.col != to.col && board.getPiece(to).isNone()) {
            // 앙파상(en passant) 수인 경우
            board.setPiece(Position(from.row, to.col), Piece.None)
        }

        movePiece(from, to)
    }

    private fun castleMove(side: Side) {
        val row = if (currentPlayer == Player.White) 1 else 8
        val kingFrom = Position(row, 'e')
        val (rookFrom, kingTo, rookTo) = if (side == Side.King) {
            Triple(Position(row, 'h'), Position(row, 'g'), Position(row, 'f'))
        } else {
            Triple(Position(row, 'a'), Position(row, 'c'), Position(row, 'd'))
        }

        movePiece(kingFrom, kingTo)
        movePiece(rookFrom, rookTo)
    }

    private fun movePiece(from: Position, to: Position) {
        board.setPiece(to, board.getPiece(from))
        board.setPiece(from, Piece.None)
    }
}
```

`ChessGame` 클래스는 게임 로직을 조율하고 상태를 유지합니다. 주목할 만한 기능은 다음과 같습니다:

- **이동 표기법 지원**: 일반적인 이동, 캐슬링(0-0, 0-0-0), 폰 프로모션을 위한 표준 체스 표기법을 수용합니다.
- **특수 이동 처리**: 앙파상 캡처 및 캐슬링 로직을 구현합니다.
- **턴 관리**: 각 이동 후 플레이어를 자동으로 교체합니다.
- **검증**: 이동의 합법성을 검증하지는 않지만(AI가 유효한 수를 둘 것이라고 믿음), 이동 파싱 및 상태 업데이트를 올바르게 처리합니다.

`moveNotation` 문자열은 허용되는 이동 형식에 대해 AI 에이전트에게 명확한 문서를 제공합니다.

## Koog 프레임워크와 통합

### 커스텀 도구 만들기

```kotlin
import kotlinx.serialization.Serializable

class Move(val game: ChessGame) : SimpleTool<Move.Args>(
    argsSerializer = Args.serializer(),
    descriptor = ToolDescriptor(
        name = "move",
        description = "다음 표기법에 따라 기물을 이동합니다:
${game.moveNotation}",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "notation",
                description = "이동할 기물의 표기법",
                type = ToolParameterType.String,
            )
        )
    )
) {
    @Serializable
    data class Args(val notation: String) : ToolArgs

    override suspend fun execute(args: Args): String {
        game.move(args.notation)
        println(game.getBoard())
        println("-----------------")
        return "현재 게임 상태:
${game.getBoard()}
${game.currentPlayer()}의 차례입니다! 수를 두세요!"
    }
}
```

`Move` 도구는 Koog 프레임워크의 도구 통합 패턴을 보여줍니다.

1. **SimpleTool 확장**: 타입 안전한 인자 처리를 통해 기본적인 도구 기능을 상속합니다.
2. **직렬화 가능한 인자**: Kotlin 직렬화를 사용하여 도구의 입력 파라미터를 정의합니다.
3. **풍부한 문서화**: `ToolDescriptor`는 LLM에게 도구의 목적과 파라미터에 대한 상세 정보를 제공합니다.
4. **생성자 파라미터**: `argsSerializer`와 `descriptor`를 생성자에 전달합니다.
5. **실행 로직**: `execute` 메서드는 실제 이동 실행을 처리하고 형식화된 피드백을 제공합니다.

주요 설계 측면:
- **컨텍스트 주입**: 도구는 `ChessGame` 인스턴스를 수신하여 게임 상태를 수정할 수 있습니다.
- **피드백 루프**: 현재 보드 상태를 반환하고 다음 플레이어를 촉구하여 대화 흐름을 유지합니다.
- **오류 처리**: 이동 검증 및 오류 보고는 게임 클래스에 의존합니다.

## 에이전트 전략 설계

### 메모리 최적화 기법

```kotlin
import ai.koog.agents.core.environment.ReceivedToolResult

/**
 * 체스 위치는 (거의) 보드 상태에 의해 완전히 정의되므로,
 * LLM의 히스토리를 시스템 프롬프트와 마지막 이동만 포함하도록 다듬을 수 있습니다.
 */
inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.nodeTrimHistory(
    name: String? = null
): AIAgentNodeDelegate<T, T> = node(name) { result ->
    llm.writeSession {
        rewritePrompt { prompt ->
            val messages = prompt.messages

            prompt.copy(messages = listOf(messages.first(), messages.last()))
        }
    }

    result
}

val strategy = strategy<String, String>("chess_strategy") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendToolResult("nodeSendToolResult")
    val nodeTrimHistory by nodeTrimHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeTrimHistory)
    edge(nodeTrimHistory forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}
```

`nodeTrimHistory` 함수는 체스 게임을 위한 중요한 최적화를 구현합니다. 체스 위치는 전체 이동 기록보다는 현재 보드 상태에 의해 크게 결정되기 때문에, 다음과 같은 항목만 유지함으로써 토큰 사용량을 크게 줄일 수 있습니다.

1. **시스템 프롬프트(System Prompt)**: 에이전트의 핵심 지침과 행동 가이드를 포함합니다.
2. **최신 메시지(Latest Message)**: 가장 최근의 보드 상태와 게임 컨텍스트를 포함합니다.

이 접근 방식의 장점은 다음과 같습니다:
- **토큰 소비 감소**: 대화 기록의 기하급수적인 증가를 방지합니다.
- **컨텍스트 유지**: 필수적인 게임 상태 정보를 보존합니다.
- **성능 향상**: 짧은 프롬프트로 처리 속도가 빨라집니다.
- **장기 게임 가능**: 토큰 제한에 걸리지 않고 장시간 게임을 진행할 수 있습니다.

체스 전략은 Koog의 그래프 기반 에이전트 아키텍처를 보여줍니다:

**노드 타입:**
- `nodeCallLLM`: 입력을 처리하고 응답/도구 호출을 생성합니다.
- `nodeExecuteTool`: 제공된 파라미터로 Move 도구를 실행합니다.
- `nodeTrimHistory`: 위에서 설명한 대로 대화 메모리를 최적화합니다.
- `nodeSendToolResult`: 도구 실행 결과를 다시 LLM으로 보냅니다.

**제어 흐름:**
- **선형 경로**: 시작 → LLM 요청 → 도구 실행 → 히스토리 정리 → 결과 전송
- **의사 결정 지점**: LLM 응답은 대화를 종료하거나 다른 도구 호출을 트리거할 수 있습니다.
- **메모리 관리**: 각 도구 실행 후에 히스토리 정리가 발생합니다.

이 전략은 대화의 일관성을 유지하면서 효율적이고 상태가 유지되는 게임 플레이를 보장합니다.

### AI 에이전트 설정

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

이 섹션에서는 OpenAI 실행기(executor)를 초기화합니다. `simpleOpenAIExecutor`는 환경 변수에서 가져온 API 키를 사용하여 OpenAI API에 대한 연결을 생성합니다.

**구성 참고 사항:**
- OpenAI API 키를 `OPENAI_API_KEY` 환경 변수에 저장하세요.
- 실행기는 인증 및 API 통신을 자동으로 처리합니다.
- 다양한 LLM 제공업체를 위해 다른 실행기 타입을 사용할 수 있습니다.

### 에이전트 조립

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

// 시스템 프롬프트와 도구 레지스트리를 사용하여 채팅 에이전트 생성
val agent = AIAgent(
    executor = baseExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            당신은 체스를 두는 에이전트입니다.
            "당신의 차례입니다!" 메시지에 응답하여 항상 수를 제안해야 합니다.

            환각(HALLUCINATE)을 일으키지 마세요!!!
            규칙에 어긋나는 수(ILLEGAL MOVES)를 두지 마세요!!!
            기권이나 체크메이트인 경우에만 메시지를 보낼 수 있습니다!!!
        """.trimMargin(),
    temperature = 0.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
)
```

여기서는 모든 컴포넌트를 기능적인 체스 플레이 에이전트로 조립합니다.

**주요 구성:**

- **모델 선택**: 고품질 체스 플레이를 위해 `OpenAIModels.Chat.O3Mini`를 사용합니다.
- **Temperature**: 결정론적이고 전략적인 이동을 위해 0.0으로 설정합니다.
- **시스템 프롬프트**: 합법적인 이동과 올바른 행동을 강조하는 세심하게 작성된 지침입니다.
- **도구 레지스트리**: 에이전트에게 Move 도구에 대한 액세스 권한을 제공합니다.
- **최대 반복 횟수(Max Iterations)**: 완전한 게임 진행을 위해 200으로 설정합니다.

**시스템 프롬프트 설계:**
- 이동 제안 책임 강조
- 환각 및 규칙 위반 금지
- 메시지 전송을 기권 또는 체크메이트 선언으로 제한
- 집중된 게임 중심 행동 유도

### 기본 에이전트 실행

```kotlin
import kotlinx.coroutines.runBlocking

println("체스 게임이 시작되었습니다!")

val initialMessage = "시작 위치는 ${game.getBoard()}입니다. 백의 차례입니다!"

runBlocking {
    agent.run(initialMessage)
}
```

    체스 게임이 시작되었습니다!
    8 r n b q k b n r
    7 p p p p p p p p
    6 * * * * * * * *
    5 * * * * * * * *
    4 * * * * P * * *
    3 * * * * * * * *
    2 P P P P * P P P
    1 R N B Q K B n R
      a b c d e f g h
    -----------------
    8 r n b q k b n r
    7 p p p p * p p p
    6 * * * * * * * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * * * *
    2 P P P P * P P P
    1 R N B Q K B N R
      a b c d e f g h
    -----------------
    8 r n b q k b n r
    7 p p p p * p p p
    6 * * * * * * * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * N * *
    2 P P P P * P P P
    1 R N B Q K B * R
      a b c d e f g h
    -----------------
    8 r n b q k b * r
    7 p p p p * p p p
    6 * * * * * n * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * N * *
    2 P P P P * P P P
    1 R N B Q K B * R
      a b c d e f g h
    -----------------
    8 r n b q k b * r
    7 p p p p * p p p
    6 * * * * * n * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * N * * N * *
    2 P P P P * P P P
    1 R * B Q K B * R
      a b c d e f g h
    -----------------

    실행이 중단되었습니다.

이 기본 에이전트는 자율적으로 플레이하며 자동으로 수를 둡니다. 게임 출력은 AI가 자신과 대결할 때의 일련의 이동과 보드 상태를 보여줍니다.

## 고급 기능: 대화형 선택지 선택

다음 섹션에서는 사용자가 AI가 생성한 여러 이동 중에서 하나를 선택하여 AI의 의사 결정 프로세스에 참여할 수 있는 보다 정교한 접근 방식을 보여줍니다.

### 커스텀 선택지 선택 전략

```kotlin
import ai.koog.agents.core.feature.choice.ChoiceSelectionStrategy

/**
 * `AskUserChoiceStrategy`는 사용자가 언어 모델이 제시한 옵션 리스트에서
 * 상호 작용하며 선택지를 선택할 수 있게 합니다. 이 전략은 프롬프트와 선택지를 표시하고
 * 선택된 항목을 결정하기 위해 사용자 입력을 읽는 커스터마이징 가능한 메서드를 사용합니다.
 *
 * @property promptShowToUser 주어진 `Prompt`를 형식화하여 사용자에게 보여주는 함수입니다.
 * @property choiceShowToUser 주어진 `LLMChoice`를 형식화하여 사용자에게 표현하는 함수입니다.
 * @property print 프롬프트나 피드백을 보여주는 등 사용자에게 메시지를 표시하는 역할을 담당하는 함수입니다.
 * @property read 사용자 입력을 캡처하는 함수입니다.
 */
class AskUserChoiceSelectionStrategy(
    private val promptShowToUser: (Prompt) -> String = { "현재 프롬프트: $it" },
    private val choiceShowToUser: (LLMChoice) -> String = { "$it" },
    private val print: (String) -> Unit = ::println,
    private val read: () -> String? = ::readlnOrNull
) : ChoiceSelectionStrategy {
    override suspend fun choose(prompt: Prompt, choices: List<LLMChoice>): LLMChoice {
        print(promptShowToUser(prompt))

        print("사용 가능한 LLM 선택지")

        choices.withIndex().forEach { (index, choice) ->
            print("선택지 번호 ${index + 1}: ${choiceShowToUser(choice)}")
        }

        var choiceNumber = ask(choices.size)
        while (choiceNumber == null) {
            print("유효하지 않은 응답입니다.")
            choiceNumber = ask(choices.size)
        }

        return choices[choiceNumber - 1]
    }

    private fun ask(numChoices: Int): Int? {
        print("선택지를 선택해 주세요. 1에서 $numChoices 사이의 숫자를 입력하세요: ")

        return read()?.toIntOrNull()?.takeIf { it in 1..numChoices }
    }
}
```

`AskUserChoiceSelectionStrategy`는 Koog의 `ChoiceSelectionStrategy` 인터페이스를 구현하여 AI 의사 결정에 인간이 참여할 수 있도록 합니다.

**주요 기능:**
- **커스터마이징 가능한 표시**: 프롬프트 및 선택지 형식을 지정을 위한 함수
- **대화형 입력**: 사용자 상호 작용을 위해 표준 입출력 사용
- **유효성 검사**: 사용자 입력이 유효한 범위 내에 있는지 확인
- **유연한 I/O**: 다양한 환경을 위해 구성 가능한 출력 및 입력 함수

**사용 사례:**
- 게임 플레이에서의 인간-AI 협업
- AI 의사 결정 투명성 및 설명 가능성
- 교육 및 디버깅 시나리오
- 교육용 데모

### 선택지 선택이 포함된 강화된 전략

```kotlin
inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.nodeTrimHistory(
    name: String? = null
): AIAgentNodeDelegate<T, T> = node(name) { result ->
    llm.writeSession {
        rewritePrompt { prompt ->
            val messages = prompt.messages

            prompt.copy(messages = listOf(messages.first(), messages.last()))
        }
    }

    result
}

val strategy = strategy<String, String>("chess_strategy") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendToolResult("nodeSendToolResult")
    val nodeTrimHistory by nodeTrimHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeTrimHistory)
    edge(nodeTrimHistory forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}

val askChoiceStrategy = AskUserChoiceSelectionStrategy(promptShowToUser = { prompt ->
    val lastMessage = prompt.messages.last()
    if (lastMessage is Message.Tool.Call) {
        lastMessage.content
    } else {
        ""
    }
})
```

```kotlin
val promptExecutor = PromptExecutorWithChoiceSelection(baseExecutor, askChoiceStrategy)
```

첫 번째 대화형 접근 방식은 `PromptExecutorWithChoiceSelection`을 사용하며, 이는 기본 실행기를 선택지 선택 기능으로 래핑합니다. 커스텀 표시 함수는 도구 호출에서 이동 정보를 추출하여 AI가 무엇을 하려는지 사용자에게 보여줍니다.

**아키텍처 변경:**
- **래핑된 실행기**: `PromptExecutorWithChoiceSelection`은 모든 기본 실행기에 선택 기능을 추가합니다.
- **컨텍스트 인식 표시**: 전체 프롬프트 대신 마지막 도구 호출 내용을 보여줍니다.
- **높은 Temperature**: 더 다양한 이동 옵션을 위해 1.0으로 높였습니다.

### 고급 전략: 수동 선택지 선택

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

val agent = AIAgent(
    executor = promptExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            당신은 체스를 두는 에이전트입니다.
            "당신의 차례입니다!" 메시지에 응답하여 항상 수를 제안해야 합니다.

            환각(HALLUCINATE)을 일으키지 마세요!!!
            규칙에 어긋나는 수(ILLEGAL MOVES)를 두지 마세요!!!
            기권이나 체크메이트인 경우에만 메시지를 보낼 수 있습니다!!!
        """.trimMargin(),
    temperature = 1.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
    numberOfChoices = 3,
)
```

고급 전략은 선택지 선택을 에이전트의 실행 그래프에 직접 통합합니다.

**새로운 노드:**
- `nodeLLMSendResultsMultipleChoices`: 여러 LLM 선택지를 동시에 처리합니다.
- `nodeSelectLLMChoice`: 선택지 선택 전략을 워크플로우에 통합합니다.

**강화된 제어 흐름:**
- 도구 결과는 여러 선택지를 지원하기 위해 리스트로 래핑됩니다.
- 선택된 경로로 계속 진행하기 전에 사용자 선택이 발생합니다.
- 선택된 선택지는 래핑이 해제되어 일반적인 흐름을 따라 계속됩니다.

**장점:**
- **더 강력한 제어**: 에이전트 워크플로우와 세밀한 통합
- **유연성**: 다른 에이전트 기능과 결합 가능
- **투명성**: 사용자가 AI가 고려 중인 사항을 정확히 볼 수 있음

### 대화형 에이전트 실행

```kotlin
println("체스 게임이 시작되었습니다!")

val initialMessage = "시작 위치는 ${game.getBoard()}입니다. 백의 차례입니다!"

runBlocking {
    agent.run(initialMessage)
}
```

    체스 게임이 시작되었습니다!
    
    사용 가능한 LLM 선택지
    선택지 번호 1: [Call(id=call_K46Upz7XoBIG5RchDh7bZE8F, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    선택지 번호 2: [Call(id=call_zJ6OhoCHrVHUNnKaxZkOhwoU, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    선택지 번호 3: [Call(id=call_nwX6ZMJ3F5AxiNUypYlI4BH4, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    선택지를 선택해 주세요. 1에서 3 사이의 숫자를 입력하세요: 
    8 r n b q k b n r
    7 p p p p p p p p
    6 * * * * * * * *
    5 * * * * * * * *
    4 * * * * P * * *
    3 * * * * * * * *
    2 P P P P * P P P
    1 R N B Q K B N R
      a b c d e f g h
    -----------------
    
    사용 가능한 LLM 선택지
    선택지 번호 1: [Call(id=call_2V93GXOcIe0fAjUAIFEk9h5S, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    선택지 번호 2: [Call(id=call_INM59xRzKMFC1w8UAV74l9e1, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    선택지 번호 3: [Call(id=call_r4QoiTwn0F3jizepHH5ia8BU, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    선택지를 선택해 주세요. 1에서 3 사이의 숫자를 입력하세요: 
    8 r n b q k b n r
    7 p p p p * p p p
    6 * * * * * * * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * * * *
    2 P P P P * P P P
    1 R N B Q K B N R
      a b c d e f g h
    -----------------
    
    사용 가능한 LLM 선택지
    선택지 번호 1: [Call(id=call_f9XTizn41svcrtvnmkCfpSUQ, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    선택지 번호 2: [Call(id=call_c0Dfce5RcSbN3cOOm5ESYriK, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    선택지 번호 3: [Call(id=call_Lr4Mdro1iolh0fDyAwZsutrW, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    선택지를 선택해 주세요. 1에서 3 사이의 숫자를 입력하세요: 
    8 r n b q k b n r
    7 p p p p * p p p
    6 * * * * * * * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * N * *
    2 P P P P * P P P
    1 R N B Q K B * R
      a b c d e f g h
    -----------------

    실행이 중단되었습니다.

```kotlin
import ai.koog.agents.core.feature.choice.nodeLLMSendResultsMultipleChoices
import ai.koog.agents.core.feature.choice.nodeSelectLLMChoice

inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.nodeTrimHistory(
    name: String? = null
): AIAgentNodeDelegate<T, T> = node(name) { result ->
    llm.writeSession {
        rewritePrompt { prompt ->
            val messages = prompt.messages

            prompt.copy(messages = listOf(messages.first(), messages.last()))
        }
    }

    result
}

val strategy = strategy<String, String>("chess_strategy") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendResultsMultipleChoices("nodeSendToolResult")
    val nodeSelectLLMChoice by nodeSelectLLMChoice(askChoiceStrategy, "chooseLLMChoice")
    val nodeTrimHistory by nodeTrimHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeTrimHistory)
    edge(nodeTrimHistory forwardTo nodeSendToolResult transformed { listOf(it) })
    edge(nodeSendToolResult forwardTo nodeSelectLLMChoice)
    edge(nodeSelectLLMChoice forwardTo nodeFinish transformed { it.first() } onAssistantMessage { true })
    edge(nodeSelectLLMChoice forwardTo nodeExecuteTool transformed { it.first() } onToolCall { true })
}
```

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

val agent = AIAgent(
    executor = baseExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            당신은 체스를 두는 에이전트입니다.
            "당신의 차례입니다!" 메시지에 응답하여 항상 수를 제안해야 합니다.

            환각(HALLUCINATE)을 일으키지 마세요!!!
            규칙에 어긋나는 수(ILLEGAL MOVES)를 두지 마세요!!!
            기권이나 체크메이트인 경우에만 메시지를 보낼 수 있습니다!!!
        """.trimMargin(),
    temperature = 1.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
    numberOfChoices = 3,
)
```

```kotlin
println("체스 게임이 시작되었습니다!")

val initialMessage = "시작 위치는 ${game.getBoard()}입니다. 백의 차례입니다!"

runBlocking {
    agent.run(initialMessage)
}
```

    체스 게임이 시작되었습니다!
    8 r n b q k b n r
    7 p p p p p p p p
    6 * * * * * * * *
    5 * * * * * * * *
    4 * * * * P * * *
    3 * * * * * * * *
    2 P P P P * P P P
    1 R N B Q K B N R
      a b c d e f g h
    -----------------
    
    사용 가능한 LLM 선택지
    선택지 번호 1: [Call(id=call_gqMIar0z11CyUl5nup3zbutj, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    선택지 번호 2: [Call(id=call_6niUGnZPPJILRFODIlJsCKax, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    선택지 번호 3: [Call(id=call_q1b8ZmIBph0EoVaU3Ic9A09j, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    선택지를 선택해 주세요. 1에서 3 사이의 숫자를 입력하세요: 
    8 r n b q k b n r
    7 p p p p * p p p
    6 * * * * * * * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * * * *
    2 P P P P * P P P
    1 R N B Q K B N R
      a b c d e f g h
    -----------------
    
    사용 가능한 LLM 선택지
    선택지 번호 1: [Call(id=call_pdBIX7MVi82MyWwawTm1Q2ef, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    선택지 번호 2: [Call(id=call_oygsPHaiAW5OM6pxhXhtazgp, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    선택지 번호 3: [Call(id=call_GJTEsZ8J8cqOKZW4Tx54RqCh, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    선택지를 선택해 주세요. 1에서 3 사이의 숫자를 입력하세요: 
    8 r n b q k b n r
    7 p p p p * p p p
    6 * * * * * * * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * N * *
    2 P P P P * P P P
    1 R N B Q K B * R
      a b c d e f g h
    -----------------
    
    사용 가능한 LLM 선택지
    선택지 번호 1: [Call(id=call_5C7HdlTU4n3KdXcyNogE4rGb, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    선택지 번호 2: [Call(id=call_EjCcyeMLQ88wMa5yh3vmeJ2w, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    선택지 번호 3: [Call(id=call_NBMMSwmFIa8M6zvfbPw85NKh, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    선택지를 선택해 주세요. 1에서 3 사이의 숫자를 입력하세요: 
    8 r n b q k b * r
    7 p p p p * p p p
    6 * * * * * n * *
    5 * * * * p * * *
    4 * * * * P * * *
    3 * * * * * N * *
    2 P P P P * P P P
    1 R N B Q K B * R
      a b c d e f g h
    -----------------

    실행이 중단되었습니다.

대화형 예시는 사용자가 AI의 의사 결정 프로세스를 어떻게 안내할 수 있는지 보여줍니다. 출력 결과에서 다음을 확인할 수 있습니다:

1. **다중 선택지**: AI가 3가지 다른 이동 옵션을 생성합니다.
2. **사용자 선택**: 사용자가 선호하는 수를 두기 위해 1-3 사이의 숫자를 입력합니다.
3. **게임 계속**: 선택한 수가 실행되고 게임이 계속됩니다.

## 결론

이 튜토리얼은 Koog 프레임워크를 사용하여 지능형 에이전트를 구축하는 몇 가지 핵심 측면을 보여주었습니다.

### 핵심 요약

1. **도메인 모델링**: 복잡한 애플리케이션에는 잘 구조화된 데이터 모델이 필수적입니다.
2. **도구 통합**: 커스텀 도구를 통해 에이전트가 외부 시스템과 효과적으로 상호 작용할 수 있습니다.
3. **메모리 관리**: 전략적인 히스토리 정리는 장기적인 상호 작용에서 성능을 최적화합니다.
4. **전략 그래프**: Koog의 그래프 기반 접근 방식은 유연한 제어 흐름을 제공합니다.
5. **대화형 AI**: 선택지 선택 기능은 인간-AI 협업과 투명성을 가능하게 합니다.

### 살펴본 프레임워크 기능

- ✅ 커스텀 도구 생성 및 통합
- ✅ 에이전트 전략 설계 및 그래프 기반 제어 흐름
- ✅ 메모리 최적화 기법
- ✅ 대화형 선택지 선택
- ✅ 다중 LLM 응답 처리
- ✅ 상태 유지 게임 관리

Koog 프레임워크는 효율성과 투명성을 유지하면서 복잡하고 다회전(multi-turn)인 상호 작용을 처리할 수 있는 정교한 AI 에이전트를 구축하기 위한 토대를 제공합니다.