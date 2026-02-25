# 使用 Koog 框架构建 AI 国际象棋玩家

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb
){ .md-button }

本教程演示了如何使用 Koog 框架构建一个智能国际象棋智能体。我们将探讨关键概念，包括工具集成、智能体策略、内存优化以及交互式 AI 决策。

## 你将学到

- 如何为复杂游戏建模领域专用数据结构
- 创建智能体可用于与环境交互的自定义工具
- 实现带有内存管理的的高效智能体策略
- 构建具有选项选择功能的交互式 AI 系统
- 针对回合制游戏优化智能体性能

## 设置

首先，让我们导入 Koog 框架并设置开发环境：

```kotlin
%useLatestDescriptors
%use koog
```

## 建模国际象棋领域

对于任何游戏 AI 来说，创建一个强大的领域模型都是必不可少的。在国际象棋中，我们需要表示玩家、棋子及其关系。让我们从定义核心数据结构开始：

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

`Player` 枚举表示国际象棋中的双方，并提供一个 `opponent()` 方法用于在玩家之间轻松切换。`PieceType` 枚举将每个棋子映射到其标准记谱法字符，从而可以轻松解析国际象棋着法。

`Side` 枚举有助于区分王翼和后翼的易位动作。

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

`Piece` 数据类将棋子类型与其所有者结合在一起，在视觉表示中，白方棋子使用大写字母，黑方棋子使用小写字母。`Position` 类封装了国际象棋坐标（例如 "e4"），并内置了验证功能。

## 游戏状态管理

### ChessBoard 实现

`ChessBoard` 类管理 8×8 网格和棋子位置。关键的设计决策包括：

- **内部表示**：使用可变列表的列表以实现高效的访问和修改。
- **视觉显示**：`toString()` 方法提供了一个清晰的 ASCII 表示，带有行号和列字母。
- **位置映射**：在国际象棋记谱法 (a1-h8) 和内部数组索引之间进行转换。

### ChessGame 逻辑

```kotlin
/**
 * 简单的国际象棋游戏，不检查有效着法。
 * 如果输入的着法有效，则存储正确的棋盘状态
 */
class ChessGame {
    private val board: ChessBoard = ChessBoard()
    private var currentPlayer: Player = Player.White
    val moveNotation: String = """
        0-0 - 短易位
        0-0-0 - 长易位
        <piece>-<from>-<to> - 常规着法。例如 p-e2-e4
        <piece>-<from>-<to>-<promotion> - 升变着法。例如 p-e7-e8-q。
        棋子名称：
            p - 兵 (pawn)
            n - 马 (knight)
            b - 象 (bishop)
            r - 车 (rook)
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
            // 该着法为吃过路兵 (en passant)
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

`ChessGame` 类编排游戏逻辑并维护状态。显著特点包括：

- **着法记谱支持**：接受常规着法、王车易位 (0-0, 0-0-0) 和兵升变的标准国际象棋记谱。
- **特殊着法处理**：实现了吃过路兵捕捉和王车易位逻辑。
- **回合管理**：在每次移动后自动在玩家之间轮换。
- **验证**：虽然它不验证着法的合法性（信任 AI 会做出有效的移动），但它能正确处理着法解析和状态更新。

`moveNotation` 字符串为 AI 智能体提供了关于可接受着法格式的清晰文档。

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

1. **继承 SimpleTool**：继承了基本的工具功能，具有类型安全的参数处理。
2. **可序列化实参**：使用 Kotlin 序列化来定义工具的输入参数。
3. **丰富的文档**：`ToolDescriptor` 为 LLM 提供了关于工具用途和参数的详细信息。
4. **构造函数参数**：将 `argsSerializer` 和 `descriptor` 传递给构造函数。
5. **执行逻辑**：`execute` 方法处理实际的着法执行并提供格式化的反馈。

关键设计方面：
- **上下文注入**：工具接收 `ChessGame` 实例，允许其修改游戏状态。
- **反馈循环**：返回当前的棋盘状态并提示下一位玩家，从而维持对话流。
- **错误处理**：依赖游戏类进行着法验证和错误报告。

## 智能体策略设计

### 内存优化技术

```kotlin
import ai.koog.agents.core.environment.ReceivedToolResult

/**
 * 国际象棋的位置（几乎）完全由棋盘状态决定，
 * 因此我们可以修剪 LLM 的历史记录，使其仅包含系统提示词和最后一次着法。
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

`nodeTrimHistory` 函数为国际象棋游戏实现了一项至关重要的优化。由于国际象棋的位置在很大程度上取决于当前的棋盘状态，而不是完整的着法历史，我们可以通过仅保留以下内容来显著减少 Token 使用量：

1. **系统提示词 (System Prompt)**：包含智能体的核心指令和行为指南。
2. **最新消息**：最近的棋盘状态和游戏上下文。

这种方法：
- **减少 Token 消耗**：防止对话历史呈指数级增长。
- **维持上下文**：保留必要的游戏状态信息。
- **提高性能**：使用更短的提示词处理速度更快。
- **支持长局游戏**：允许进行超长游戏而不会触及 Token 限制。

国际象棋策略展示了 Koog 基于图的智能体架构：

**节点类型：**
- `nodeCallLLM`：处理输入并生成响应/工具调用。
- `nodeExecuteTool`：使用提供的参数执行 Move 工具。
- `nodeTrimHistory`：如上所述优化对话内存。
- `nodeSendToolResult`：将工具执行结果发送回 LLM。

**控制流：**
- **线性路径**：开始 → LLM 请求 → 工具执行 → 历史记录修剪 → 发送结果。
- **决策点**：LLM 响应既可以结束对话，也可以触发另一个工具调用。
- **内存管理**：每次工具执行后都会进行历史记录修剪。

这种策略确保了高效、有状态的游戏进行，同时保持了对话的连贯性。

### 设置 AI 智能体

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

本节初始化我们的 OpenAI 执行器。`simpleOpenAIExecutor` 使用环境变量中的 API 密钥创建与 OpenAI API 的连接。

**配置说明：**
- 将你的 OpenAI API 密钥存储在 `OPENAI_API_KEY` 环境变量中。
- 执行器会自动处理身份验证和 API 通信。
- 可针对不同的 LLM 提供商使用不同的执行器类型。

### 智能体组装

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

// 创建一个带有系统提示词和工具库的聊天智能体
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

在这里，我们将所有组件组装成一个功能齐全的国际象棋智能体：

**关键配置：**

- **模型选择**：使用 `OpenAIModels.Chat.O3Mini` 以获得高质量的棋局表现。
- **温度 (Temperature)**：设置为 0.0 以获得确定性的战略着法。
- **系统提示词**：精心设计的指令，强调合法着法和规范行为。
- **工具库 (Tool Registry)**：为智能体提供访问 Move 工具的权限。
- **最大迭代次数**：设置为 200 以允许完成完整游戏。

**系统提示词设计：**
- 强调提议着法的责任。
- 禁止幻觉和非法着法。
- 将消息传递限制为仅限认输或宣布将死。
- 创建专注、以游戏为导向的行为。

### 运行基础智能体

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
    1 R N B Q K B n R
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

    执行已中断

这个基础智能体是自主运行的，会自动进行移动。游戏输出显示了 AI 在与自己对弈时的着法序列和棋盘状态。

## 高级功能：交互式选项选择

接下来的章节演示了一种更复杂的方法，用户可以通过从多个 AI 生成的着法中进行选择，参与到 AI 的决策过程中。

### 自定义选项选择策略

```kotlin
import ai.koog.agents.core.feature.choice.ChoiceSelectionStrategy

/**
 * `AskUserChoiceStrategy` 允许用户交互式地从语言模型呈现的选项列表中选择一个选项。
 * 该策略使用可自定义的方法来显示提示词和选项，并读取用户输入以确定所选选项。
 *
 * @property promptShowToUser 一个函数，用于格式化并向用户显示给定的 `Prompt`。
 * @property choiceShowToUser 一个函数，用于格式化并向用户展示给定的 `LLMChoice`。
 * @property print 一个负责向用户显示消息的函数，例如用于显示提示词或反馈。
 * @property read 一个用于捕获用户输入的函数。
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

`AskUserChoiceSelectionStrategy` 实现了 Koog 的 `ChoiceSelectionStrategy` 接口，以启用人工参与 AI 决策：

**关键特性：**
- **可自定义显示**：用于格式化提示词和选项的函数。
- **交互式输入**：使用标准输入/输出进行用户交互。
- **验证**：确保用户输入在有效范围内。
- **灵活的 I/O**：可配置的打印和读取函数，适用于不同环境。

**使用场景：**
- 游戏进行中的人机协作。
- AI 决策的透明度和可解释性。
- 训练和调试场景。
- 教学演示。

### 带有选项选择的增强策略

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

第一种交互式方法使用 `PromptExecutorWithChoiceSelection`，它用选项选择功能封装了基础执行器。自定义显示函数从工具调用中提取着法信息，向用户展示 AI 想要执行的操作。

**架构变化：**
- **封装的执行器**：`PromptExecutorWithChoiceSelection` 为任何基础执行器添加了选项功能。
- **上下文感知显示**：显示最后一个工具调用的内容，而不是完整的提示词。
- **更高的温度**：增加到 1.0 以获得更多样化的着法选项。

### 高级策略：手动选项选择

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

高级策略将选项选择直接集成到智能体的执行图中：

**新节点：**
- `nodeLLMSendResultsMultipleChoices`：同时处理多个 LLM 选项。
- `nodeSelectLLMChoice`：将选项选择策略集成到工作流中。

**增强的控制流：**
- 工具结果被包装在列表中以支持多个选项。
- 在继续选择的路径之前进行用户选择。
- 所选选项被解包并继续正常流程。

**优势：**
- **更强的控制力**：与智能体工作流的细粒度集成。
- **灵活性**：可以与其他智能体功能结合使用。
- **透明度**：用户可以清楚地看到 AI 正在考虑的内容。

### 运行交互式智能体

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

    执行已中断

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

    执行已中断

交互式示例展示了用户如何引导 AI 的决策过程。在输出中，你可以看到：

1. **多个选项**：AI 生成 3 个不同的着法选项。
2. **用户选择**：用户输入数字 1-3 来选择他们喜欢的着法。
3. **游戏继续**：执行所选着法，游戏继续进行。

## 结论

本教程演示了使用 Koog 框架构建智能智能体的几个关键方面：

### 关键要点

1. **领域建模**：结构良好的数据模型对于复杂应用至关重要。
2. **工具集成**：自定义工具使智能体能够有效地与外部系统交互。
3. **内存管理**：战略性的历史记录修剪优化了长对话的性能。
4. **策略图**：Koog 基于图的方法提供了灵活的控制流。
5. **交互式 AI**：选项选择实现了人机协作和透明度。

### 探索的框架特性

- ✅ 自定义工具创建与集成
- ✅ 智能体策略设计与基于图的控制流
- ✅ 内存优化技术
- ✅ 交互式选项选择
- ✅ 处理多个 LLM 响应
- ✅ 有状态的游戏管理

Koog 框架为构建复杂的 AI 智能体提供了基础，这些智能体可以处理复杂的、多轮的交互，同时保持高效和透明。