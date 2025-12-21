# 使用 Koog 框架构建 AI 国际象棋玩家

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb
){ .md-button }

本教程演示如何使用 Koog 框架构建一个智能国际象棋对弈代理。我们将探索关键概念，包括工具集成、代理策略、内存优化和交互式 AI 决策。

## 您将学到什么

- 如何为复杂游戏建模领域特有的数据结构
- 创建代理可用于与环境交互的自定义工具
- 实现带内存管理的有效代理策略
- 构建具有选择能力（choice selection capabilities）的交互式 AI 系统
- 优化回合制游戏中的代理性能

## 设置

首先，让我们导入 Koog 框架并设置开发环境：

```kotlin
%useLatestDescriptors
%use koog
```

## 建模国际象棋领域

创建健壮的领域模型对于任何游戏 AI 都至关重要。在国际象棋中，我们需要表示玩家、棋子及其关系。让我们从定义核心数据结构开始：

### 核心枚举和类型

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

`Player` 枚举表示国际象棋中的两方，并带有一个 `opponent()` 方法，方便玩家之间切换。`PieceType` 枚举将每个国际象棋棋子映射到其标准符号字符，从而便于解析国际象棋走法。

`Side` 枚举有助于区分王翼和后翼易位走法。

### 棋子和位置建模

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

`Piece` 数据类将棋子类型与其所有者结合起来，在可视化表示中，白棋使用大写字母，黑棋使用小写字母。`Position` 类封装了国际象棋坐标（例如，“e4”），并内置了验证功能。

## 游戏状态管理

### ChessBoard 实现

`ChessBoard` 类管理 8×8 的棋盘格和棋子位置。关键设计决策包括：

- **内部表示**：使用 `List` 的可变 `List` 进行高效访问和修改
- **可视化显示**：`toString()` 方法提供清晰的 ASCII 表示，带有等级数字和文件字母
- **位置映射**：在国际象棋记法（a1-h8）和内部数组索引之间进行转换

### ChessGame 逻辑

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

`ChessGame` 类协调游戏逻辑并维护状态。显著特性包括：

- **走法记法支持**：接受标准国际象棋记法，用于常规走法、易位（0-0, 0-0-0）和兵的升变
- **特殊走法处理**：实现吃过路兵（en passant）和易位逻辑
- **回合管理**：每次走法后自动在玩家之间交替
- **验证**：虽然它不验证走法的合法性（信任 AI 会做出有效走法），但它正确处理走法解析和状态更新

`moveNotation` 字符串为 AI 代理提供了可接受走法格式的清晰文档。

## 与 Koog 框架集成

### 创建自定义工具

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

`Move` 工具展示了 Koog 框架的工具集成模式：

1. **扩展 SimpleTool**：继承基本工具功能，带类型安全的实参处理
2. **可序列化实参**：使用 Kotlin 序列化定义工具的输入形参
3. **丰富文档**：`ToolDescriptor` 为 LLM 提供关于工具目的和形参的详细信息
4. **构造函数形参**：将 `argsSerializer` 和 `descriptor` 传递给构造函数
5. **执行逻辑**：`execute` 方法处理实际的走法执行并提供格式化反馈

关键设计方面：
- **上下文注入**：工具接收 `ChessGame` 实例，允许其修改游戏状态
- **反馈循环**：返回当前棋盘状态并提示下一位玩家，保持对话流畅
- **错误处理**：依赖游戏类进行走法验证和错误报告

## 代理策略设计

### 内存优化技术

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

`nodeTrimHistory` 函数为国际象棋游戏实现了一个关键的优化。由于国际象棋局面主要由当前棋盘状态而非完整的走法历史决定，我们可以通过仅保留以下内容来显著减少 token 使用：

1. **系统提示**：包含代理的核心指令和行为准则
2. **最新消息**：最新的棋盘状态和游戏上下文

这种方法：
- **减少 Token 消耗**：防止对话历史呈指数级增长
- **保持上下文**：保留重要的游戏状态信息
- **提高性能**：使用更短的提示进行更快处理
- **支持长局游戏**：允许延长游戏而不会触及 token 限制

国际象棋策略展示了 Koog 基于图的代理架构：

**节点类型：**
- `nodeCallLLM`：处理输入并生成响应/工具调用
- `nodeExecuteTool`：使用提供的形参执行 Move 工具
- `nodeTrimHistory`：如上所述优化对话记忆
- `nodeSendToolResult`：将工具执行结果发送回 LLM

**控制流：**
- **线性路径**：开始 → LLM 请求 → 工具执行 → 历史裁剪 → 发送结果
- **决策点**：LLM 响应可以结束对话或触发另一个工具调用
- **内存管理**：每次工具执行后进行历史裁剪

此策略确保了高效、有状态的游戏玩法，同时保持对话连贯性。

### 设置 AI 代理

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

本节初始化我们的 OpenAI 执行器。`simpleOpenAIExecutor` 使用您环境变量中的 API 密钥创建与 OpenAI API 的连接。

**配置说明：**
- 将您的 OpenAI API 密钥存储在 `OPENAI_API_KEY` 环境变量中
- 执行器自动处理身份验证和 API 通信
- 适用于各种 LLM 提供商的不同执行器类型

### 代理组装

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

在这里，我们将所有组件组装成一个功能齐全的国际象棋对弈代理：

**关键配置：**

- **模型选择**：使用 `OpenAIModels.Chat.O3Mini` 进行高质量国际象棋对弈
- **Temperature**：设置为 0.0 以实现确定性的策略性走法
- **系统提示**：精心设计的指令，强调合法走法和适当行为
- **工具注册表**：为代理提供对 Move 工具的访问
- **最大迭代次数**：设置为 200 以允许完成游戏

**系统提示设计：**
- 强调走法提议的职责
- 禁止胡言乱语和非法走法
- 将消息发送限制为仅投降或将死声明
- 创建专注的、以游戏为导向的行为

### 运行基本代理

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

这个基本代理自主对弈，自动走子。游戏输出显示了 AI 自我对弈时的走法序列和棋盘状态。

## 高级特性：交互式选择

接下来的部分演示了一种更复杂的方法，用户可以通过从多个 AI 生成的走法中进行选择来参与 AI 的决策过程。

### 自定义选择策略

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

`AskUserChoiceSelectionStrategy` 实现了 Koog 的 `ChoiceSelectionStrategy` 接口，以实现在 AI 决策中人类的参与：

**关键特性：**
- **可定制的显示**：用于格式化提示和选项的函数
- **交互式输入**：使用标准输入/输出进行用户交互
- **验证**：确保用户输入在有效范围内
- **灵活的 I/O**：可配置的打印和读取函数，适用于不同环境

**用例：**
- 游戏中人机协作
- AI 决策透明度和可解释性
- 训练和调试场景
- 教育演示

### 带选择功能的增强策略

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

第一个交互式方法使用 `PromptExecutorWithChoiceSelection`，它将基础执行器与选择功能进行了封装。自定义显示函数从工具调用中提取走法信息，以向用户展示 AI 想要做什么。

**架构变更：**
- **封装的执行器**：`PromptExecutorWithChoiceSelection` 为任何基础执行器添加选择功能
- **上下文感知显示**：显示最后一次工具调用内容而非完整提示
- **更高的 Temperature**：增加到 1.0 以获取更多样化的走法选项

### 高级策略：手动选择

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

高级策略将选择集成直接到代理的执行图：

**新节点：**
- `nodeLLMSendResultsMultipleChoices`：同时处理多个 LLM 选项
- `nodeSelectLLMChoice`：将选择策略集成到工作流中

**增强的控制流：**
- 工具结果被封装在列表中以支持多个选项
- 用户选择发生在继续选定路径之前
- 所选选项被解封并继续正常流程

**优势：**
- **更大的控制力**：与代理工作流进行细粒度集成
- **灵活性**：可与其他代理特性结合使用
- **透明度**：用户清晰了解 AI 正在考虑的内容

### 运行交互式代理

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

交互式示例展示了用户如何引导 AI 的决策过程。在输出中，您可以看到：

1. **多个选项**：AI 生成 3 个不同的走法选项
2. **用户选择**：用户输入数字 1-3 来选择他们偏好的走法
3. **游戏继续**：所选走法被执行，游戏继续

## 结论

本教程演示了使用 Koog 框架构建智能代理的几个关键方面：

### 主要收获

1. **领域建模**：良好结构化的数据模型对于复杂应用程序至关重要
2. **工具集成**：自定义工具使代理能够有效地与外部系统交互
3. **内存管理**：策略性历史裁剪优化了长时间交互的性能
4. **策略图**：Koog 基于图的方法提供了灵活的控制流
5. **交互式 AI**：选项选择实现了人机协作和透明度

### 探索的框架特性

- ✅ 自定义工具创建和集成
- ✅ 代理策略设计和基于图的控制流
- ✅ 内存优化技术
- ✅ 交互式选择
- ✅ 多 LLM 响应处理
- ✅ 有状态的游戏管理

Koog 框架为构建能够处理复杂、多回合交互，同时保持效率和透明度的复杂 AI 代理奠定了基础。