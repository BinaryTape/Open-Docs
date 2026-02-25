# 使用 Koog 架構打造 AI 西洋棋玩家

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb
){ .md-button }

本教學示範如何使用 Koog 架構建置一個智慧西洋棋代理程式。我們將探索關鍵概念，包括工具整合、代理程式策略、記憶體優化以及互動式 AI 決策。

## 你將學到什麼

- 如何為複雜遊戲建立領域特定的資料結構模型
- 建立自訂工具，讓代理程式可用於與環境互動
- 實作具備記憶體管理的效率代理程式策略
- 打造具備選項選取功能的互動式 AI 系統
- 針對回合制遊戲優化代理程式效能

## 設定

首先，讓我們匯入 Koog 架構並設定開發環境：

```kotlin
%useLatestDescriptors
%use koog
```

## 西洋棋領域建模

為任何遊戲 AI 建立健全的領域模型都至關重要。在西洋棋中，我們需要表示玩家、棋子及其關係。讓我們從定義核心資料結構開始：

### 核心列舉與型別

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

`Player` 列舉代表西洋棋的雙方，並具備一個 `opponent()` 方法，以便在玩家之間輕鬆切換。`PieceType` 列舉將每個棋子對應到其標準表示法字元，從而能夠輕鬆剖析西洋棋步。

`Side` 列舉有助於區分王翼入堡 (kingside castling) 與后翼入堡 (queenside castling) 移動。

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

`Piece` 資料類別將棋子型別與其擁有者結合，在視覺表示中使用大寫字母代表白棋，小寫字母代表黑棋。`Position` 類別封裝了西洋棋座標（例如 「e4」）並內建驗證。

## 遊戲狀態管理

### ChessBoard 實作

`ChessBoard` 類別管理 8×8 網格與棋子位置。關鍵設計決策包括：

- **內部表示法**：使用可變清單的清單 (list of mutable lists) 以進行有效率的存取與修改
- **視覺化顯示**：`toString()` 方法提供清晰的 ASCII 表示法，包含列數 (rank numbers) 與行字母 (file letters)
- **位置對應**：在西洋棋表示法 (a1-h8) 與內部陣列索引之間進行轉換

### ChessGame 邏輯

```kotlin
/**
 * 簡易西洋棋遊戲，不檢查移動是否合法。
 * 如果輸入的移動有效，則儲存棋盤的正確狀態
 */
class ChessGame {
    private val board: ChessBoard = ChessBoard()
    private var currentPlayer: Player = Player.White
    val moveNotation: String = """
        0-0 - 短入堡
        0-0-0 - 長入堡
        <piece>-<from>-<to> - 一般移動。例如：p-e2-e4
        <piece>-<from>-<to>-<promotion> - 升變移動。例如：p-e7-e8-q。
        棋子名稱：
            p - 兵 (pawn)
            n - 馬 (knight)
            b - 象 (bishop)
            r - 車 (rook)
            q - 后 (queen)
            k - 王 (king)
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

                require(PieceType.fromId(piece) == PieceType.Pawn) { "只有兵可以升變" }

                usualMove(Position(from), Position(to))
                board.setPiece(Position(to), Piece(PieceType.fromId(promotion), currentPlayer))
            }

            else -> throw IllegalArgumentException("無效的移動：$move")
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
            // 該移動為吃過路兵 (en passant)
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

`ChessGame` 類別協調遊戲邏輯並維持狀態。顯著特性包括：

- **移動表示法支援**：接受一般移動、入堡 (0-0, 0-0-0) 以及兵升變的標準西洋棋表示法
- **特殊移動處理**：實作吃過路兵 (en passant) 捕捉與入堡邏輯
- **回合管理**：在每次移動後自動交替玩家
- **驗證**：雖然它不驗證移動的合法性（信任 AI 會做出合法的移動），但它能正確處理移動剖析與狀態更新

`moveNotation` 字串為 AI 代理程式提供了關於可接受移動格式的清晰文件。

## 與 Koog 架構整合

### 建立自訂工具

```kotlin
import kotlinx.serialization.Serializable

class Move(val game: ChessGame) : SimpleTool<Move.Args>(
    argsSerializer = Args.serializer(),
    descriptor = ToolDescriptor(
        name = "move",
        description = "根據表示法移動棋子：
${game.moveNotation}",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "notation",
                description = "要移動棋子的表示法",
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
        return "目前遊戲狀態：
${game.getBoard()}
輪到 ${game.currentPlayer()} 移動！請出招！"
    }
}
```

`Move` 工具展示了 Koog 架構的工具整合模式：

1. **擴充 SimpleTool**：繼承基礎工具功能與型別安全的引數處理
2. **可序列化引數**：使用 Kotlin 序列化來定義工具的輸入參數
3. **豐富的文件說明**：`ToolDescriptor` 為 LLM 提供關於工具用途與參數的詳細資訊
4. **建構函式參數**：將 `argsSerializer` 與 `descriptor` 傳遞給建構函式
5. **執行邏輯**：`execute` 方法處理實際的移動執行並提供格式化的回饋

關鍵設計面向：
- **內容主體注入**：工具接收 `ChessGame` 執行個體，使其能修改遊戲狀態
- **回饋迴圈**：傳回目前的棋盤狀態並提示下一位玩家，維持對話流
- **錯誤處理**：依賴遊戲類別進行移動驗證與錯誤回報

## 代理程式策略設計

### 記憶體優化技術

```kotlin
import ai.koog.agents.core.environment.ReceivedToolResult

/**
 * 西洋棋位置（幾乎）完全由棋盤狀態定義，
 * 因此我們可以修整 LLM 的歷程記錄，僅包含系統提示與最後一步。
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

`nodeTrimHistory` 函式為西洋棋遊戲實作了一項關鍵優化。由於西洋棋位置主要由目前的棋盤狀態而非完整的移動歷程決定，我們可以透過僅保留以下內容來顯著減少權杖 (token) 使用量：

1. **系統提示**：包含代理程式的核心指示與行為準則
2. **最新訊息**：最近的棋盤狀態與遊戲背景資訊

這種方法：
- **減少權杖消耗**：防止對話歷程呈指數級增長
- **保持背景資訊**：保留必要的遊戲狀態資訊
- **提升效能**：透過更短的提示實現更快的處理
- **支援長時間遊戲**：允許進行長時間對弈而不會觸及權杖限制

西洋棋策略展示了 Koog 以圖 (graph) 為基礎的代理程式架構：

**節點型別：**
- `nodeCallLLM`：處理輸入並產生回應／工具呼叫
- `nodeExecuteTool`：使用提供的參數執行 `Move` 工具
- `nodeTrimHistory`：如上所述優化對話記憶體
- `nodeSendToolResult`：將工具執行結果傳回給 LLM

**控制流程：**
- **線性路徑**：開始 → LLM 請求 → 工具執行 → 歷程記錄修整 → 傳送結果
- **決策點**：LLM 回應可以結束對話或觸發另一個工具呼叫
- **記憶體管理**：歷程記錄修整會在每次工具執行後發生

此策略確保了高效、具備狀態的遊戲過程，同時維持對話連貫性。

### 設定 AI 代理程式

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

此部分初始化我們的 OpenAI 執行器。`simpleOpenAIExecutor` 會使用環境變數中的 API 金鑰建立與 OpenAI API 的連線。

**配置說明：**
- 將您的 OpenAI API 金鑰儲存在 `OPENAI_API_KEY` 環境變數中
- 執行器會自動處理驗證與 API 通訊
- 可針對不同的 LLM 提供者使用不同的執行器型別

### 代理程式組合

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

// 建立一個具備系統提示與工具儲存庫的聊天代理程式
val agent = AIAgent(
    executor = baseExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            你是一位玩西洋棋的代理程式。
            你應始終針對 "Your move!" 訊息提議一個移動。

            請勿產生幻覺！！！
            請勿做出違規移動！！！
            只有在認輸或將死時才可傳送訊息！！！
        """.trimMargin(),
    temperature = 0.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
)
```

在此我們將所有組件組合成一個功能齊全的西洋棋代理程式：

**關鍵配置：**

- **模型選擇**：使用 `OpenAIModels.Chat.O3Mini` 以獲得高品質的下棋表現
- **溫度 (Temperature)**：設定為 0.0 以獲得確定性、戰略性的移動
- **系統提示**：精心設計的指示，強調合法移動與正確行為
- **工具儲存庫**：讓代理程式可以存取 `Move` 工具
- **最大反覆運算次數**：設定為 200 以允許完成整場遊戲

**系統提示設計：**
- 強調提議移動的責任
- 禁止產生幻覺與違規移動
- 將傳訊限制在僅限認輸或宣告將死
- 建立專注於遊戲的行為

### 執行基本代理程式

```kotlin
import kotlinx.coroutines.runBlocking

println("西洋棋遊戲開始！")

val initialMessage = "起始位置為 ${game.getBoard()}。白棋請出招！"

runBlocking {
    agent.run(initialMessage)
}
```

    西洋棋遊戲開始！
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

    執行已中斷

這個基本代理程式會自主運作，自動進行移動。遊戲輸出顯示了 AI 自我對弈時的一系列移動與棋盤狀態。

## 進階功能：互動式選項選取

接下來的章節展示了一種更複雜的方法，使用者可以透過從多個 AI 產生的移動中進行選擇，參與 AI 的決策過程。

### 自訂選項選取策略

```kotlin
import ai.koog.agents.core.feature.choice.ChoiceSelectionStrategy

/**
 * `AskUserChoiceStrategy` 允許使用者互動式地從語言模型呈現的選項清單中選取一個選項。
 * 該策略使用可自訂的方法來顯示提示與選項，並讀取使用者輸入以決定選取的選項。
 *
 * @property promptShowToUser 一個將指定的 `Prompt` 格式化並顯示給使用者的函式。
 * @property choiceShowToUser 一個將指定的 `LLMChoice` 格式化並呈現給使用者的函式。
 * @property print 負責將訊息顯示給使用者的函式，例如用於顯示提示或回饋。
 * @property read 用於擷取使用者輸入的函式。
 */
class AskUserChoiceSelectionStrategy(
    private val promptShowToUser: (Prompt) -> String = { "目前提示：$it" },
    private val choiceShowToUser: (LLMChoice) -> String = { "$it" },
    private val print: (String) -> Unit = ::println,
    private val read: () -> String? = ::readlnOrNull
) : ChoiceSelectionStrategy {
    override suspend fun choose(prompt: Prompt, choices: List<LLMChoice>): LLMChoice {
        print(promptShowToUser(prompt))

        print("可用的 LLM 選項")

        choices.withIndex().forEach { (index, choice) ->
            print("選項編號 ${index + 1}：${choiceShowToUser(choice)}")
        }

        var choiceNumber = ask(choices.size)
        while (choiceNumber == null) {
            print("無效的回應。")
            choiceNumber = ask(choices.size)
        }

        return choices[choiceNumber - 1]
    }

    private fun ask(numChoices: Int): Int? {
        print("請選擇一個選項。請輸入 1 到 $numChoices 之間的數字：")

        return read()?.toIntOrNull()?.takeIf { it in 1..numChoices }
    }
}
```

`AskUserChoiceSelectionStrategy` 實作了 Koog 的 `ChoiceSelectionStrategy` 介面，以實現人工參與 AI 決策：

**關鍵特性：**
- **可自訂顯示**：用於格式化提示與選項的函式
- **互動式輸入**：使用標準輸入／輸出進行使用者互動
- **驗證**：確保使用者輸入在有效範圍內
- **彈性的 I/O**：可針對不同環境配置列印與讀取函式

**使用案例：**
- 遊戲過程中的人機協作
- AI 決策的透明度與可解釋性
- 訓練與偵錯情境
- 教學示範

### 具備選項選取的增強型策略

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

第一種互動式方法使用 `PromptExecutorWithChoiceSelection`，它將基礎執行器封裝起來並具備選項選取功能。自訂顯示函式會從工具呼叫中擷取移動資訊，向使用者顯示 AI 想要執行的動作。

**架構變動：**
- **封裝的執行器**：`PromptExecutorWithChoiceSelection` 為任何基礎執行器新增選項功能
- **背景感知顯示**：顯示最後一個工具呼叫內容而非完整提示
- **較高溫度 (Temperature)**：增加至 1.0 以獲得更多樣化的移動選項

### 進階策略：手動選項選取

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

val agent = AIAgent(
    executor = promptExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            你是一位玩西洋棋的代理程式。
            你應始終針對 "Your move!" 訊息提議一個移動。

            請勿產生幻覺！！！
            請勿做出違規移動！！！
            只有在認輸或將死時才可傳送訊息！！！
        """.trimMargin(),
    temperature = 1.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
    numberOfChoices = 3,
)
```

進階策略將選項選取直接整合到代理程式的執行圖中：

**新節點：**
- `nodeLLMSendResultsMultipleChoices`：同時處理多個 LLM 選項
- `nodeSelectLLMChoice`：將選項選取策略整合到工作流程中

**增強型控制流程：**
- 工具結果被封裝在清單中以支援多個選項
- 使用者選取會在繼續選定路徑之前發生
- 選定的選項會被解封裝並透過正常流程繼續執行

**優點：**
- **更大的控制權**：與代理程式工作流程進行細粒度整合
- **靈活性**：可與其他代理程式特性結合
- **透明度**：使用者能確切看到 AI 正在考慮的內容

### 執行互動式代理程式

```kotlin
println("西洋棋遊戲開始！")

val initialMessage = "起始位置為 ${game.getBoard()}。白棋請出招！"

runBlocking {
    agent.run(initialMessage)
}
```

    西洋棋遊戲開始！
    
    可用的 LLM 選項
    選項編號 1：[Call(id=call_K46Upz7XoBIG5RchDh7bZE8F, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    選項編號 2：[Call(id=call_zJ6OhoCHrVHUNnKaxZkOhwoU, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    選項編號 3：[Call(id=call_nwX6ZMJ3F5AxiNUypYlI4BH4, tool=move, content={"notation": "p-e2-e4"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:40.368252Z, totalTokensCount=773, inputTokensCount=315, outputTokensCount=458, additionalInfo={}))]
    請選擇一個選項。請輸入 1 到 3 之間的數字： 
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
    
    可用的 LLM 選項
    選項編號 1：[Call(id=call_2V93GXOcIe0fAjUAIFEk9h5S, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    選項編號 2：[Call(id=call_INM59xRzKMFC1w8UAV74l9e1, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    選項編號 3：[Call(id=call_r4QoiTwn0F3jizepHH5ia8BU, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:47.949303Z, totalTokensCount=1301, inputTokensCount=341, outputTokensCount=960, additionalInfo={}))]
    請選擇一個選項。請輸入 1 到 3 之間的數字： 
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
    
    可用的 LLM 選項
    選項編號 1：[Call(id=call_f9XTizn41svcrtvnmkCfpSUQ, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    選項編號 2：[Call(id=call_c0Dfce5RcSbN3cOOm5ESYriK, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    選項編號 3：[Call(id=call_Lr4Mdro1iolh0fDyAwZsutrW, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:17:55.467712Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    請選擇一個選項。請輸入 1 到 3 之間的數字： 
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

    執行已中斷

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
            你是一位玩西洋棋的代理程式。
            你應始終針對 "Your move!" 訊息提議一個移動。

            請勿產生幻覺！！！
            請勿做出違規移動！！！
            只有在認輸或將死時才可傳送訊息！！！
        """.trimMargin(),
    temperature = 1.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
    numberOfChoices = 3,
)
```

```kotlin
println("西洋棋遊戲開始！")

val initialMessage = "起始位置為 ${game.getBoard()}。白棋請出招！"

runBlocking {
    agent.run(initialMessage)
}
```

    西洋棋遊戲開始！
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
    
    可用的 LLM 選項
    選項編號 1：[Call(id=call_gqMIar0z11CyUl5nup3zbutj, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    選項編號 2：[Call(id=call_6niUGnZPPJILRFODIlJsCKax, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    選項編號 3：[Call(id=call_q1b8ZmIBph0EoVaU3Ic9A09j, tool=move, content={"notation": "p-e7-e5"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:17.313548Z, totalTokensCount=917, inputTokensCount=341, outputTokensCount=576, additionalInfo={}))]
    請選擇一個選項。請輸入 1 到 3 之間的數字： 
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
    
    可用的 LLM 選項
    選項編號 1：[Call(id=call_pdBIX7MVi82MyWwawTm1Q2ef, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    選項編號 2：[Call(id=call_oygsPHaiAW5OM6pxhXhtazgp, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    選項編號 3：[Call(id=call_GJTEsZ8J8cqOKZW4Tx54RqCh, tool=move, content={"notation": "n-g1-f3"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:24.505344Z, totalTokensCount=1237, inputTokensCount=341, outputTokensCount=896, additionalInfo={}))]
    請選擇一個選項。請輸入 1 到 3 之間的數字： 
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
    
    可用的 LLM 選項
    選項編號 1：[Call(id=call_5C7HdlTU4n3KdXcyNogE4rGb, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    選項編號 2：[Call(id=call_EjCcyeMLQ88wMa5yh3vmeJ2w, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    選項編號 3：[Call(id=call_NBMMSwmFIa8M6zvfbPw85NKh, tool=move, content={"notation": "n-g8-f6"}, metaInfo=ResponseMetaInfo(timestamp=2025-08-18T21:18:34.646667Z, totalTokensCount=1621, inputTokensCount=341, outputTokensCount=1280, additionalInfo={}))]
    請選擇一個選項。請輸入 1 到 3 之間的數字： 
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

    執行已中斷

互動式範例顯示了使用者如何引導 AI 的決策過程。在輸出中，您可以看到：

1. **多個選項**：AI 產生了 3 個不同的移動選項
2. **使用者選取**：使用者輸入數字 1-3 以選擇其偏好的移動
3. **遊戲繼續**：選定的移動被執行，遊戲繼續進行

## 結論

本教學示範了使用 Koog 架構建置智慧代理程式的幾個關鍵面向：

### 關鍵要點

1. **領域建模**：結構良好的資料模型對於複雜應用程式至關重要
2. **工具整合**：自訂工具讓代理程式能有效地與外部系統互動
3. **記憶體管理**：戰略性的歷程記錄修整可優化長時間互動的效能
4. **策略圖**：Koog 以圖為基礎的方法提供了靈活的控制流程
5. **互動式 AI**：選項選取支援人機協作與透明度

### 已探索的架構特性

- ✅ 自訂工具建立與整合
- ✅ 代理程式策略設計與以圖為基礎的控制流程
- ✅ 記憶體優化技術
- ✅ 互動式選項選取
- ✅ 多個 LLM 回應處理
- ✅ 具備狀態的遊戲管理

Koog 架構為建置複雜的 AI 代理程式奠定了基礎，這些代理程式能處理複雜、多回合的互動，同時維持效率與透明度。