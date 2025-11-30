# 使用 Koog 框架建構 AI 國際象棋玩家

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb
){ .md-button }

本教學示範如何使用 Koog 框架建構一個智慧的國際象棋對弈代理。我們將探索關鍵概念，包括工具整合、代理策略、記憶體最佳化和互動式 AI 決策。

## 您將學到什麼

- 如何為複雜遊戲建模領域專屬資料結構
- 建立代理可用於與環境互動的自訂工具
- 實作具備記憶體管理的高效代理策略
- 建構具備選擇能力的互動式 AI 系統
- 最佳化回合制遊戲的代理性能

## 設定

首先，讓我們匯入 Koog 框架並設定我們的開發環境：

```kotlin
%useLatestDescriptors
%use koog
```

## 建模國際象棋領域

建立穩健的領域模型對於任何遊戲 AI 都至關重要。在國際象棋中，我們需要表示玩家、棋子及其關係。讓我們先定義我們的核心資料結構：

### 核心列舉與類型

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

`Player` 列舉表示國際象棋中的兩方，帶有 `opponent()` 方法以便於在玩家之間切換。`PieceType` 列舉將每個棋子映射到其標準記譜字元，以便於解析國際象棋走法。

`Side` 列舉有助於區分王翼和后翼的王車易位走法。

### 棋子與位置建模

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

`Piece` 資料類別將棋子類型與其擁有者結合，在視覺表示中使用大寫字母表示白方棋子，小寫字母表示黑方棋子。`Position` 類別封裝了國際象棋座標 (例如 "e4") 並具備內建驗證功能。

## 遊戲狀態管理

### ChessBoard 實作

`ChessBoard` 類別管理 8x8 格線和棋子位置。主要設計決策包括：

- **內部表示法**：使用可變列表的列表以實現高效存取和修改
- **視覺顯示**：`toString()` 方法提供清晰的 ASCII 表示法，包含橫列號碼和直行字母
- **位置映射**：在國際象棋記譜法 (a1-h8) 和內部陣列索引之間轉換

### ChessGame 邏輯

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

`ChessGame` 類別協調遊戲邏輯並維護狀態。值得注意的功能包括：

- **走法記譜法支援**：接受標準國際象棋記譜法用於一般走法、王車易位 (0-0, 0-0-0) 和兵的升變
- **特殊走法處理**：實作吃過路兵 (en passant) 和王車易位邏輯
- **回合管理**：每次走法後自動在玩家之間輪流
- **驗證**：雖然它不驗證走法合法性 (相信 AI 會做出合法走法)，但它會正確處理走法解析和狀態更新

`moveNotation` 字串為 AI 代理提供了關於可接受走法格式的清晰文件。

## 與 Koog 框架整合

### 建立自訂工具

```kotlin
import kotlinx.serialization.Serializable

class Move(val game: ChessGame) : SimpleTool<Move.Args>() {
    @Serializable
    data class Args(val notation: String) : ToolArgs

    override val argsSerializer = Args.serializer()

    override val descriptor = ToolDescriptor(
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

    override suspend fun doExecute(args: Args): String {
        game.move(args.notation)
        println(game.getBoard())
        println("-----------------")
        return "Current state of the game:
${game.getBoard()}
${game.currentPlayer()} to move! Make the move!"
    }
}
```

`Move` 工具展示了 Koog 框架的工具整合模式：

1.  **擴展 SimpleTool**：繼承基本的工具功能，具備類型安全引數處理
2.  **可序列化引數**：使用 Kotlin 序列化定義工具的輸入參數
3.  **豐富的文件**：`ToolDescriptor` 為 LLM 提供了關於工具目的和參數的詳細資訊
4.  **執行邏輯**：`doExecute` 方法處理實際走法執行並提供格式化的回饋

關鍵設計方面：
- **上下文注入**：工具接收 `ChessGame` 實例，允許其修改遊戲狀態
- **回饋迴圈**：返回當前棋盤狀態並提示下一個玩家，維持對話流程
- **錯誤處理**：依賴遊戲類別進行走法驗證和錯誤報告

## 代理策略設計

### 記憶體最佳化技術

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

    edge(nodeStart forwardTo nodeCallLLLL)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeTrimHistory)
    edge(nodeTrimHistory forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}
```

`nodeTrimHistory` 函數實作了國際象棋遊戲的一項關鍵最佳化。由於國際象棋的位置主要由當前棋盤狀態而非完整的走法歷史決定，因此我們可以透過僅保留以下內容來顯著減少 Token 使用量：

1.  **系統提示**：包含代理的核心指令和行為準則
2.  **最新訊息**：最新的棋盤狀態和遊戲上下文

這種方法：
- **減少 Token 消耗**：防止對話歷史的指數增長
- **維護上下文**：保留基本的遊戲狀態資訊
- **提升效能**：更短的提示，處理速度更快
- **啟用長時間遊戲**：允許長時間對弈而不會達到 Token 限制

國際象棋策略展示了 Koog 的基於圖的代理架構：

**節點類型：**
- `nodeCallLLM`：處理輸入並產生回應/工具呼叫
- `nodeExecuteTool`：使用提供的參數執行 `Move` 工具
- `nodeTrimHistory`：如上所述最佳化對話記憶體
- `nodeSendToolResult`：將工具執行結果傳送回 LLM

**控制流程：**
- **線性路徑**：開始 → LLM 請求 → 工具執行 → 歷史修剪 → 傳送結果
- **決策點**：LLM 回應可以結束對話或觸發另一個工具呼叫
- **記憶體管理**：每次工具執行後都會進行歷史修剪

此策略確保了高效、有狀態的遊戲體驗，同時保持對話連貫性。

### 設定 AI 代理

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

此部分初始化我們的 OpenAI 執行器。`simpleOpenAIExecutor` 使用您的環境變數中的 API 金鑰建立與 OpenAI API 的連線。

**設定說明：**
- 將您的 OpenAI API 金鑰儲存在 `OPENAI_API_KEY` 環境變數中
- 執行器會自動處理身分驗證和 API 通訊
- 不同的執行器類型適用於各種 LLM 提供者

### 代理組裝

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

在這裡，我們將所有元件組裝成一個功能性的國際象棋對弈代理：

**關鍵設定：**

- **模型選擇**：使用 `OpenAIModels.Chat.O3Mini` 進行高品質國際象棋對弈
- **溫度**：設定為 0.0 以實現確定性、策略性的走法
- **系統提示**：精心設計的指令，強調合法走法和適當行為
- **工具註冊中心**：為代理提供了對 `Move` 工具的存取權限
- **最大迭代次數**：設定為 200 以允許完成遊戲

**系統提示設計：**
- 強調走法提議的責任
- 禁止幻覺和非法走法
- 限制訊息僅用於認輸或將死宣告
- 建立專注於遊戲的行為

### 執行基本代理

```kotlin
import kotlinx.coroutines.runBlocking

println("Chess Game started!")

val initialMessage = "Starting position is ${game.getBoard()}. White to move!"

runBlocking {
    agent.run(initialMessage)
}
```

```text
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
```

這個基本代理會自主對弈，自動進行走法。遊戲輸出顯示了 AI 自我對弈時的走法序列和棋盤狀態。

## 進階功能：互動式選擇

以下部分將示範一種更複雜的方法，使用者可以透過從多個 AI 生成的走法中進行選擇來參與 AI 的決策過程。

### 自訂選擇策略

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

`AskUserChoiceSelectionStrategy` 實作了 Koog 的 `ChoiceSelectionStrategy` 介面，以啟用人類參與 AI 決策：

**主要功能：**
- **可自訂顯示**：用於格式化提示和選項的函數
- **互動式輸入**：使用標準輸入/輸出進行使用者互動
- **驗證**：確保使用者輸入在有效範圍內
- **彈性輸入/輸出**：適用於不同環境的可設定列印和讀取函數

**使用案例：**
- 遊戲中的人機協作
- AI 決策透明度和可解釋性
- 訓練和除錯場景
- 教育示範

### 具備選擇功能的強化策略

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

    edge(nodeStart forwardTo nodeCallLLLL)
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

第一個互動式方法使用 `PromptExecutorWithChoiceSelection`，它將基本執行器與選擇功能包裝在一起。自訂顯示函數從工具呼叫中提取走法資訊，以向使用者顯示 AI 想要做什麼。

**架構變更：**
- **包裝執行器**：`PromptExecutorWithChoiceSelection` 為任何基本執行器添加了選擇功能
- **上下文感知顯示**：顯示上次工具呼叫的內容，而不是完整的提示
- **更高的溫度**：提高到 1.0 以獲得更多樣的走法選項

### 進階策略：手動選擇

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

進階策略將選擇功能直接整合到代理的執行圖中：

**新節點：**
- `nodeLLMSendResultsMultipleChoices`：同時處理多個 LLM 選項
- `nodeSelectLLMChoice`：將選擇策略整合到工作流程中

**強化控制流程：**
- 工具結果被包裝在列表中以支援多個選項
- 在繼續執行所選路徑之前會進行使用者選擇
- 選定的選項被解包並繼續正常流程

**優點：**
- **更大的控制**：與代理工作流程的細粒度整合
- **彈性**：可以與其他代理功能結合
- **透明度**：使用者確切看到 AI 正在考慮什麼

### 執行互動式代理

```kotlin
println("Chess Game started!")

val initialMessage = "Starting position is ${game.getBoard()}. White to move!"

runBlocking {
    agent.run(initialMessage)
}
```

```text
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
```

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

```text
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
```

互動式範例展示了使用者如何引導 AI 的決策過程。在輸出中，您可以看到：

1.  **多個選項**：AI 生成 3 個不同的走法選項
2.  **使用者選擇**：使用者輸入數字 1-3 來選擇他們偏好的走法
3.  **遊戲繼續**：選定的走法被執行，遊戲繼續

## 結論

本教學示範了使用 Koog 框架建構智慧代理的幾個關鍵方面：

### 主要收穫

1.  **領域建模**：結構良好的資料模型對於複雜應用程式至關重要
2.  **工具整合**：自訂工具使代理能夠有效地與外部系統互動
3.  **記憶體管理**：策略性歷史修剪可最佳化長時間互動的效能
4.  **策略圖**：Koog 的基於圖的方法提供彈性的控制流程
5.  **互動式 AI**：選擇功能實現人機協作和透明度

### 探索的框架功能

- ✅ 自訂工具的建立與整合
- ✅ 代理策略設計與基於圖的控制流程
- ✅ 記憶體最佳化技術
- ✅ 互動式選擇
- ✅ 多個 LLM 回應處理
- ✅ 有狀態的遊戲管理

Koog 框架為建構精密的 AI 代理奠定了基礎，這些代理能夠處理複雜、多回合的互動，同時保持效率和透明度。