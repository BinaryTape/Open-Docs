# Koog 프레임워크로 AI 체스 플레이어 구축하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb
){ .md-button }

이 튜토리얼은 Koog 프레임워크를 사용하여 지능형 체스 플레이 에이전트를 구축하는 방법을 보여줍니다. 도구 통합, 에이전트 전략, 메모리 최적화 및 상호작용형 AI 의사 결정을 포함한 주요 개념을 탐구합니다.

## 학습 목표

- 복잡한 게임을 위한 도메인별 데이터 구조를 모델링하는 방법
- 에이전트가 환경과 상호작용하는 데 사용할 수 있는 사용자 지정 도구 만들기
- 메모리 관리를 통한 효율적인 에이전트 전략 구현
- 선택 기능이 있는 상호작용형 AI 시스템 구축
- 턴제 게임을 위한 에이전트 성능 최적화

## 설정

먼저 Koog 프레임워크를 임포트하고 개발 환경을 설정해 보겠습니다.

```kotlin
%useLatestDescriptors
%use koog
```

## 체스 도메인 모델링

견고한 도메인 모델을 만드는 것은 모든 게임 AI에 필수적입니다. 체스에서는 플레이어, 말(piece) 및 이들 간의 관계를 나타내야 합니다. 핵심 데이터 구조를 정의하는 것부터 시작하겠습니다.

### 핵심 열거형 및 유형

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

`Player` 열거형은 체스의 두 진영을 나타내며, 플레이어 간의 손쉬운 전환을 위한 `opponent()` 메서드를 포함합니다. `PieceType` 열거형은 각 체스 말을 표준 표기 문자(notation character)에 매핑하여 체스 수(move)를 쉽게 파싱할 수 있도록 합니다.

`Side` 열거형은 킹 사이드와 퀸 사이드 캐슬링 수를 구분하는 데 도움이 됩니다.

### 말(Piece) 및 위치 모델링

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

`Piece` 데이터 클래스는 말 유형을 소유자와 결합하며, 시각적 표현에서 백 말을 대문자로, 흑 말을 소문자로 사용합니다. `Position` 클래스는 내장된 유효성 검사를 통해 체스 좌표(예: "e4")를 캡슐화합니다.

## 게임 상태 관리

### ChessBoard 구현

`ChessBoard` 클래스는 8x8 그리드와 말 위치를 관리합니다. 주요 설계 결정은 다음과 같습니다.

-   **내부 표현**: 효율적인 접근 및 수정을 위해 변경 가능한 리스트(mutable list)의 리스트를 사용
-   **시각적 표시**: `toString()` 메서드는 랭크 숫자와 파일 문자가 포함된 명확한 ASCII 표현을 제공합니다
-   **위치 매핑**: 체스 표기법(a1-h8)과 내부 배열 인덱스 간의 변환

### ChessGame 로직

```kotlin
/**
 * Simple chess game without checks for valid moves.
 * Stores a correct state of the board if the entered moves are valid
 */
class ChessGame {
    private val board: ChessBoard = ChessBoard()
    private var currentPlayer: Player = Player.White
    val moveNotation: String = """
        0-0 - short castle
        0-0-0 - long castle
        <piece>-<from>-<to> - usual move. e.g. p-e2-e4
        <piece>-<from>-<to>-<promotion> - promotion move. e.g. p-e7-e8-q.
        Piece names:
            p - pawn
            n - knight
            b - bishop
            r - rook
            q - queen
            k - king
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

                require(PieceType.fromId(piece) == PieceType.Pawn) { "Only pawn can be promoted" }

                usualMove(Position(from), Position(to))
                board.setPiece(Position(to), Piece(PieceType.fromId(promotion), currentPlayer))
            }

            else -> throw IllegalArgumentException("Invalid move: $move")
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
            // the move is en passant
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

`ChessGame` 클래스는 게임 로직을 조정하고 상태를 유지합니다. 주목할 만한 기능은 다음과 같습니다.

-   **수 표기법 지원**: 일반 수, 캐슬링(0-0, 0-0-0) 및 폰 승급을 위한 표준 체스 표기법을 허용합니다
-   **특별 수 처리**: 앙파상(en passant) 잡기 및 캐슬링 로직을 구현합니다
-   **턴 관리**: 각 수 이후 플레이어 간에 자동으로 교대합니다
-   **유효성 검사**: 수의 합법성을 검사하지는 않지만(AI가 유효한 수를 둘 것으로 신뢰), 수 파싱 및 상태 업데이트를 올바르게 처리합니다

`moveNotation` 문자열은 AI 에이전트에게 허용되는 수 형식에 대한 명확한 문서를 제공합니다.

## Koog 프레임워크와 통합하기

### 사용자 지정 도구 만들기

```kotlin
import kotlinx.serialization.Serializable

class Move(val game: ChessGame) : SimpleTool<Move.Args>(
    argsSerializer = Args.serializer(),
    descriptor = ToolDescriptor(
        name = "move",
        description = "Moves a piece according to the notation:
${game.moveNotation}",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "notation",
                description = "The notation of the piece to move",
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
        return "Current state of the game:
${game.getBoard()}
${game.currentPlayer()} to move! Make the move!"
    }
}
```

`Move` 도구는 Koog 프레임워크의 도구 통합 패턴을 보여줍니다.

1.  **SimpleTool 확장**: 타입 안전 인자(argument) 처리와 함께 기본 도구 기능을 상속합니다
2.  **직렬화 가능한 인자**: Kotlin 직렬화를 사용하여 도구의 입력 매개변수를 정의합니다
3.  **풍부한 문서화**: `ToolDescriptor`는 도구의 목적과 매개변수에 대한 자세한 정보를 LLM에 제공합니다
4.  **생성자 매개변수**: `argsSerializer`와 `descriptor`를 생성자에 전달합니다
5.  **실행 로직**: `execute` 메서드는 실제 수 실행을 처리하고 형식화된 피드백을 제공합니다

주요 설계 측면:
-   **컨텍스트 주입**: 도구는 `ChessGame` 인스턴스를 받아 게임 상태를 수정할 수 있습니다
-   **피드백 루프**: 현재 보드 상태를 반환하고 다음 플레이어에게 프롬프트를 표시하여 대화 흐름을 유지합니다
-   **오류 처리**: 수 유효성 검사 및 오류 보고를 위해 게임 클래스에 의존합니다

## 에이전트 전략 설계

### 메모리 최적화 기술

```kotlin
import ai.koog.agents.core.environment.ReceivedToolResult

/**
 * Chess position is (almost) completely defined by the board state,
 * So we can trim the history of the LLM to only contain the system prompt and the last move.
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

`nodeTrimHistory` 함수는 체스 게임에 중요한 최적화를 구현합니다. 체스 위치는 전체 수 기록보다는 현재 보드 상태에 의해 크게 결정되므로, 다음 항목만 유지하여 토큰 사용량을 크게 줄일 수 있습니다.

1.  **시스템 프롬프트**: 에이전트의 핵심 지침과 행동 가이드라인을 포함합니다
2.  **최신 메시지**: 가장 최근의 보드 상태 및 게임 컨텍스트

이 접근 방식은 다음을 제공합니다.
-   **토큰 소비 감소**: 대화 기록의 기하급수적 증가를 방지합니다
-   **컨텍스트 유지**: 필수 게임 상태 정보를 보존합니다
-   **성능 향상**: 더 짧은 프롬프트로 더 빠른 처리
-   **장기 게임 가능**: 토큰 제한에 도달하지 않고 확장된 게임 플레이를 허용합니다

체스 전략은 Koog의 그래프 기반 에이전트 아키텍처를 보여줍니다.

**노드 유형:**
-   `nodeCallLLM`: 입력을 처리하고 응답/도구 호출을 생성합니다
-   `nodeExecuteTool`: 제공된 매개변수로 Move 도구를 실행합니다
-   `nodeTrimHistory`: 위에서 설명한 대로 대화 메모리를 최적화합니다
-   `nodeSendToolResult`: 도구 실행 결과를 LLM에 다시 보냅니다

**제어 흐름:**
-   **선형 경로**: 시작 → LLM 요청 → 도구 실행 → 기록 정리 → 결과 전송
-   **결정 지점**: LLM 응답은 대화를 종료하거나 다른 도구 호출을 트리거할 수 있습니다
-   **메모리 관리**: 각 도구 실행 후에 기록 정리가 발생합니다

이 전략은 대화의 일관성을 유지하면서 효율적이고 상태를 유지하는 게임 플레이를 보장합니다.

### AI 에이전트 설정

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

이 섹션에서는 OpenAI 실행기(executor)를 초기화합니다. `simpleOpenAIExecutor`는 환경 변수의 API 키를 사용하여 OpenAI의 API에 대한 연결을 생성합니다.

**구성 참고 사항:**
-   `OPENAI_API_KEY` 환경 변수에 OpenAI API 키를 저장합니다
-   실행기는 인증 및 API 통신을 자동으로 처리합니다
-   다양한 LLM 공급자를 위한 여러 실행기 유형을 사용할 수 있습니다

### 에이전트 조립

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

// Create a chat agent with a system prompt and the tool registry
val agent = AIAgent(
    executor = baseExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            You are an agent who plays chess.
            You should always propose a move in response to the "Your move!" message.

            DO NOT HALLUCINATE!!!
            DO NOT PLAY ILLEGAL MOVES!!!
            YOU CAN SEND A MESSAGE ONLY IF IT IS A RESIGNATION OR A CHECKMATE!!!
        """.trimMargin(),
    temperature = 0.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
)
```

여기에서는 모든 구성 요소를 기능적인 체스 플레이 에이전트로 조립합니다.

**주요 구성:**

-   **모델 선택**: 고품질 체스 플레이를 위해 `OpenAIModels.Chat.O3Mini` 사용
-   **온도**: 결정론적이고 전략적인 수를 위해 0.0으로 설정
-   **시스템 프롬프트**: 합법적인 수와 적절한 행동을 강조하는 신중하게 작성된 지침
-   **도구 레지스트리**: 에이전트에 Move 도구에 대한 액세스를 제공합니다
-   **최대 반복**: 전체 게임을 허용하기 위해 200으로 설정

**시스템 프롬프트 설계:**
-   수 제안 책임 강조
-   환각 및 불법 수 금지
-   메시징을 항복 또는 체크메이트 선언으로만 제한
-   집중된 게임 중심 행동 생성

### 기본 에이전트 실행

```kotlin
import kotlinx.coroutines.runBlocking

println("Chess Game started!")

val initialMessage = "Starting position is ${game.getBoard()}. White to move!"

runBlocking {
    agent.run(initialMessage)
}
```

    Chess Game started!
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

    The execution was interrupted

이 기본 에이전트는 자율적으로 플레이하며 수를 자동으로 둡니다. 게임 출력은 AI가 스스로 플레이할 때의 수의 순서와 보드 상태를 보여줍니다.

## 고급 기능: 상호작용형 선택(Choice Selection)

다음 섹션에서는 사용자가 여러 AI 생성 수 중에서 선택하여 AI의 의사 결정 과정에 참여할 수 있는 보다 정교한 접근 방식을 보여줍니다.

### 사용자 지정 선택 전략

```kotlin
import ai.koog.agents.core.feature.choice.ChoiceSelectionStrategy

/**
 * `AskUserChoiceStrategy` allows users to interactively select a choice from a list of options
 * presented by a language model. The strategy uses customizable methods to display the prompt
 * and choices and read user input to determine the selected choice.
 *
 * @property promptShowToUser A function that formats and displays a given `Prompt` to the user.
 * @property choiceShowToUser A function that formats and represents a given `LLMChoice` to the user.
 * @property print A function responsible for displaying messages to the user, e.g., for showing prompts or feedback.
 * @property read A function to capture user input.
 */
class AskUserChoiceSelectionStrategy(
    private val promptShowToUser: (Prompt) -> String = { "Current prompt: $it" },
    private val choiceShowToUser: (LLMChoice) -> String = { "$it" },
    private val print: (String) -> Unit = ::println,
    private val read: () -> String? = ::readlnOrNull
) : ChoiceSelectionStrategy {
    override suspend fun choose(prompt: Prompt, choices: List<LLMChoice>): LLMChoice {
        print(promptShowToUser(prompt))

        print("Available LLM choices")

        choices.withIndex().forEach { (index, choice) ->
            print("Choice number ${index + 1}: ${choiceShowToUser(choice)}")
        }

        var choiceNumber = ask(choices.size)
        while (choiceNumber == null) {
            print("Invalid response.")
            choiceNumber = ask(choices.size)
        }

        return choices[choiceNumber - 1]
    }

    private fun ask(numChoices: Int): Int? {
        print("Please choose a choice. Enter a number between 1 and $numChoices: ")

        return read()?.toIntOrNull()?.takeIf { it in 1..numChoices }
    }
}
```

`AskUserChoiceSelectionStrategy`는 AI 의사 결정에 인간의 참여를 가능하게 하기 위해 Koog의 `ChoiceSelectionStrategy` 인터페이스를 구현합니다.

**주요 기능:**
-   **사용자 지정 가능한 표시**: 프롬프트와 선택을 서식 지정하는 함수
-   **상호작용형 입력**: 사용자 상호작용을 위해 표준 입/출력을 사용
-   **유효성 검사**: 사용자 입력이 유효한 범위 내에 있는지 확인
-   **유연한 I/O**: 다양한 환경을 위한 구성 가능한 print 및 read 함수

**사용 사례:**
-   게임 플레이에서의 인간-AI 협업
-   AI 의사 결정 투명성 및 설명 가능성
-   훈련 및 디버깅 시나리오
-   교육용 시연

### 선택 기능이 강화된 전략

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

첫 번째 상호작용형 접근 방식은 `PromptExecutorWithChoiceSelection`을 사용하며, 이는 기본 실행기를 선택 기능으로 래핑합니다. 사용자 지정 표시 함수는 도구 호출에서 수 정보를 추출하여 AI가 무엇을 하려는지 사용자에게 보여줍니다.

**아키텍처 변경:**
-   **래핑된 실행기**: `PromptExecutorWithChoiceSelection`은 모든 기본 실행기에 선택 기능을 추가합니다
-   **컨텍스트 인식 표시**: 전체 프롬프트 대신 마지막 도구 호출 내용을 보여줍니다
-   **더 높은 온도**: 더 다양한 수 옵션을 위해 1.0으로 증가

### 고급 전략: 수동 선택

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

val agent = AIAgent(
    executor = promptExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            You are an agent who plays chess.
            You should always propose a move in response to the "Your move!" message.

            DO NOT HALLUCINATE!!!
            DO NOT PLAY ILLEGAL MOVES!!!
            YOU CAN SEND A MESSAGE ONLY IF IT IS A RESIGNATION OR A CHECKMATE!!!
        """.trimMargin(),
    temperature = 1.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
    numberOfChoices = 3,
)
```

고급 전략은 선택을 에이전트의 실행 그래프에 직접 통합합니다.

**새로운 노드:**
-   `nodeLLMSendResultsMultipleChoices`: 여러 LLM 선택을 동시에 처리합니다
-   `nodeSelectLLMChoice`: 선택 전략을 워크플로에 통합합니다

**향상된 제어 흐름:**
-   도구 결과는 여러 선택을 지원하기 위해 리스트로 래핑됩니다
-   사용자 선택은 선택된 경로를 계속 진행하기 전에 발생합니다
-   선택된 선택은 래핑이 해제되고 일반적인 흐름을 통해 계속됩니다

**장점:**
-   **더 큰 제어**: 에이전트 워크플로와 세분화된 통합
-   **유연성**: 다른 에이전트 기능과 결합 가능
-   **투명성**: 사용자는 AI가 무엇을 고려하는지 정확히 볼 수 있습니다

### 상호작용형 에이전트 실행

```kotlin
println("Chess Game started!")

val initialMessage = "Starting position is ${game.getBoard()}. White to move!"

runBlocking {
    agent.run(initialMessage)
}
```

    Chess Game started!
    
    Available LLM choices
    Choice number 1: [Call(id=call_K46Upz7XoBIG5RchDh7bZE8F, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    Choice number 2: [Call(id=call_zJ6OhoCHrVHUNnKaxZkOhwoU, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    Choice number 3: [Call(id=call_nwX6ZMJ3F5AxiNUypYlI4BH4, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    Please choose a choice. Enter a number between 1 and 3: 
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
    
    Available LLM choices
    Choice number 1: [Call(id=call_2V93GXOcIe0fAjUAIFEk9h5S, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    Choice number 2: [Call(id=call_INM59xRzKMFC1w8UAV74l9e1, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    Choice number 3: [Call(id=call_r4QoiTwn0F3jizepHH5ia8BU, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    Please choose a choice. Enter a number between 1 and 3: 
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
    
    Available LLM choices
    Choice number 1: [Call(id=call_f9XTizn41svcrtvnmkCfpSUQ, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    Choice number 2: [Call(id=call_c0Dfce5RcSbN3cOOm5ESYriK, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    Choice number 3: [Call(id=call_Lr4Mdro1iolh0fDyAwZsutrW, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    Please choose a choice. Enter a number between 1 and 3: 
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

    The execution was interrupted

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
            You are an agent who plays chess.
            You should always propose a move in response to the "Your move!" message.

            DO NOT HALLUCINATE!!!
            DO NOT PLAY ILLEGAL MOVES!!!
            YOU CAN SEND A MESSAGE ONLY IF IT IS A RESIGNATION OR A CHECKMATE!!!
        """.trimMargin(),
    temperature = 1.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
    numberOfChoices = 3,
)
```

```kotlin
println("Chess Game started!")

val initialMessage = "Starting position is ${game.getBoard()}. White to move!"

runBlocking {
    agent.run(initialMessage)
}
```

    Chess Game started!
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
    
    Available LLM choices
    Choice number 1: [Call(id=call_gqMIar0z11CyUl5nup3zbutj, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    Choice number 2: [Call(id=call_6niUGnZPPJILRFODIlJsCKax, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    Choice number 3: [Call(id=call_q1b8ZmIBph0EoVaU3Ic9A09j, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    Please choose a choice. Enter a number between 1 and 3: 
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
    
    Available LLM choices
    Choice number 1: [Call(id=call_pdBIX7MVi82MyWwawTm1Q2ef, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    Choice number 2: [Call(id=call_oygsPHaiAW5OM6pxhXhtazgp, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    Choice number 3: [Call(id=call_GJTEsZ8J8cqOKZW4Tx54RqCh, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    Please choose a choice. Enter a number between 1 and 3: 
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
    
    Available LLM choices
    Choice number 1: [Call(id=call_5C7HdlTU4n3KdXcyNogE4rGb, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    Choice number 2: [Call(id=call_EjCcyeMLQ88wMa5yh3vmeJ2w, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    Choice number 3: [Call(id=call_NBMMSwmFIa8M6zvfbPw85NKh, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    Please choose a choice. Enter a number between 1 and 3: 
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

    The execution was interrupted

상호작용형 예시는 사용자가 AI의 의사 결정 과정을 어떻게 안내할 수 있는지 보여줍니다. 출력에서 다음을 확인할 수 있습니다.

1.  **여러 선택**: AI는 3가지 다른 수 옵션을 생성합니다
2.  **사용자 선택**: 사용자는 선호하는 수를 선택하기 위해 1-3번을 입력합니다
3.  **게임 계속**: 선택된 수가 실행되고 게임이 계속됩니다

## 결론

이 튜토리얼은 Koog 프레임워크로 지능형 에이전트를 구축하는 여러 핵심 측면을 보여줍니다.

### 주요 내용

1.  **도메인 모델링**: 잘 구조화된 데이터 모델은 복잡한 애플리케이션에 필수적입니다
2.  **도구 통합**: 사용자 지정 도구는 에이전트가 외부 시스템과 효과적으로 상호작용할 수 있도록 합니다
3.  **메모리 관리**: 전략적인 기록 정리(history trimming)는 장기적인 상호작용에 대한 성능을 최적화합니다
4.  **전략 그래프**: Koog의 그래프 기반 접근 방식은 유연한 제어 흐름을 제공합니다
5.  **상호작용형 AI**: 선택 기능은 인간-AI 협업 및 투명성을 가능하게 합니다

### 탐색된 프레임워크 기능

-   ✅ 사용자 지정 도구 생성 및 통합
-   ✅ 에이전트 전략 설계 및 그래프 기반 제어 흐름
-   ✅ 메모리 최적화 기술
-   ✅ 상호작용형 선택(choice selection)
-   ✅ 다중 LLM 응답 처리
-   ✅ 상태를 유지하는 게임 관리

Koog 프레임워크는 효율성과 투명성을 유지하면서 복잡하고 여러 턴에 걸친 상호작용을 처리할 수 있는 정교한 AI 에이전트를 구축하기 위한 기반을 제공합니다.