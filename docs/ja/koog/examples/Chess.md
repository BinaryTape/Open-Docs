# KoogフレームワークでAIチェスプレイヤーを構築する

[:material-github: GitHubで開く](https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb){ .md-button }

このチュートリアルでは、Koogフレームワークを使用して知的なチェスAIエージェントを構築する方法を説明します。ツール連携、エージェント戦略、メモリ最適化、インタラクティブなAI意思決定といった主要な概念を探求します。

## 学ぶこと

- 複雑なゲームのドメイン固有のデータ構造をモデル化する方法
- エージェントが環境とやり取りするために使用できるカスタムツールの作成
- メモリ管理を伴う効率的なエージェント戦略の実装
- 選択機能を持つインタラクティブなAIシステムの構築
- ターン制ゲームにおけるエージェントのパフォーマンス最適化

## セットアップ

まず、Koogフレームワークをインポートし、開発環境をセットアップしましょう。

```kotlin
%useLatestDescriptors
%use koog
```

## チェスのドメインをモデリングする

堅牢なドメインモデルの作成は、あらゆるゲームAIにとって不可欠です。チェスでは、プレイヤー、駒、およびそれらの関係を表現する必要があります。まず、コアとなるデータ構造を定義することから始めましょう。

### コアな列挙型と型

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

`Player`列挙型はチェスの2つの陣営を表し、プレイヤー間を簡単に切り替えるための`opponent()`メソッドを備えています。`PieceType`列挙型は、各チェスの駒をその標準表記文字にマッピングし、チェスの動きの簡単な解析を可能にします。

`Side`列挙型は、キングサイドとクイーンサイドのキャスリング（王の入城）の動きを区別するのに役立ちます。

### 駒と位置のモデリング

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

`Piece`データクラスは駒のタイプとその所有者を組み合わせ、視覚表現では白い駒には大文字、黒い駒には小文字を使用します。`Position`クラスは、組み込みの検証機能を備えたチェスの座標（例:「e4」）をカプセル化します。

## ゲームの状態管理

### ChessBoardの実装

`ChessBoard`クラスは、8x8のグリッドと駒の位置を管理します。主要な設計上の決定事項は以下の通りです。

-   **内部表現**: 効率的なアクセスと変更のために、可変リストのリストを使用
-   **視覚表示**: `toString()`メソッドは、段（ランク）の数字と筋（ファイル）の文字を伴う明確なASCII表現を提供
-   **位置のマッピング**: チェス表記（a1-h8）と内部配列インデックス間の変換

### ChessGameのロジック

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

`ChessGame`クラスは、ゲームロジックを調整し、状態を維持します。特筆すべき機能は以下の通りです。

-   **棋譜表記のサポート**: 通常の動き、キャスリング（0-0、0-0-0）、ポーンの昇格など、標準的なチェス表記を受け入れます
-   **特殊な動きの処理**: アンパッサン（通過中の捕獲）とキャスリングのロジックを実装します
-   **ターンの管理**: 各手番後にプレイヤー間を自動的に切り替えます
-   **検証**: 動きの合法性を検証しない（AIが有効な動きをすると信頼する）ものの、動きの解析と状態の更新を正しく処理します

`moveNotation`文字列は、AIエージェントが許容する動きの形式について明確なドキュメントを提供します。

## Koogフレームワークとの連携

### カスタムツールの作成

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

`Move`ツールは、Koogフレームワークのツール連携パターンを示しています。

1.  **`SimpleTool`を拡張**: 型安全な引数処理で基本的なツール機能を継承
2.  **シリアライズ可能な引数**: Kotlinシリアライゼーションを使用してツールの入力パラメータを定義
3.  **豊富なドキュメント**: `ToolDescriptor`は、ツールの目的とパラメータに関する詳細な情報をLLMに提供
4.  **コンストラクターパラメーター**: `argsSerializer`と`descriptor`をコンストラクターに渡します
5.  **実行ロジック**: `execute`メソッドは、実際の動きの実行を処理し、フォーマットされたフィードバックを提供

主要な設計側面:

-   **コンテキストインジェクション**: ツールは`ChessGame`インスタンスを受け取り、ゲームの状態を変更可能
-   **フィードバックループ**: 現在の盤面状態を返し、次のプレイヤーを促すことで、会話の流れを維持
-   **エラー処理**: 動きの検証とエラー報告のためにゲームクラスに依存

## エージェント戦略の設計

### メモリ最適化技術

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

`nodeTrimHistory`関数は、チェスゲームにとって重要な最適化を実装しています。チェスの局面は、完全な動きの履歴ではなく、現在の盤面状態によって主に決定されるため、以下の要素のみを保持することで、トークン使用量を大幅に削減できます。

1.  **システムプロンプト**: エージェントのコアな指示と行動ガイドラインを含む
2.  **最新のメッセージ**: 最新の盤面状態とゲームコンテキスト

このアプローチは以下の特徴を持ちます。

-   **トークン消費量の削減**: 会話履歴の指数関数的な増加を防ぐ
-   **コンテキストの維持**: 重要なゲーム状態情報を保持する
-   **パフォーマンスの向上**: 短いプロンプトで処理が高速化
-   **長いゲームを可能にする**: トークン制限に達することなく、長時間のゲームプレイを可能にする

このチェス戦略は、Koogのグラフベースのエージェントアーキテクチャを示しています。

**ノードタイプ:**

-   `nodeCallLLM`: 入力を処理し、応答/ツール呼び出しを生成する
-   `nodeExecuteTool`: 提供されたパラメータでMoveツールを実行する
-   `nodeTrimHistory`: 上記の通り会話メモリを最適化する
-   `nodeSendToolResult`: ツール実行結果をLLMに送り返す

**制御フロー:**

-   **線形パス**: 開始 → LLMリクエスト → ツール実行 → 履歴トリミング → 結果送信
-   **決定点**: LLMの応答は、会話を終了させるか、別のツール呼び出しをトリガーするかのいずれか
-   **メモリ管理**: 各ツール実行後に履歴トリミングが行われる

この戦略により、効率的でステートフルなゲームプレイが保証され、会話の一貫性も維持されます。

### AIエージェントのセットアップ

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

このセクションでは、OpenAIエグゼキュータを初期化します。`simpleOpenAIExecutor`は、環境変数から取得したAPIキーを使用して、OpenAIのAPIへの接続を作成します。

**設定に関する注意点:**

-   OpenAI APIキーを`OPENAI_API_KEY`環境変数に格納してください。
-   エグゼキュータは認証とAPI通信を自動的に処理します。
-   さまざまなLLMプロバイダー向けに異なるエグゼキュータタイプが利用可能です。

### エージェントの組み立て

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

ここでは、すべてのコンポーネントを機能的なチェスAIエージェントとして組み立てます。

**主要な設定:**

-   **モデルの選択**: 高品質なチェスプレイのために`OpenAIModels.Chat.O3Mini`を使用
-   **温度**: 決定論的で戦略的な動きのために0.0に設定
-   **システムプロンプト**: 合法的な動きと適切な行動を強調するよう慎重に作成された指示
-   **ツールレジストリ**: エージェントにMoveツールへのアクセスを提供する
-   **最大イテレーション**: 完全なゲームを可能にするために200に設定

**システムプロンプトの設計:**

-   動きの提案責任を強調する
-   ハルシネーションと違法な動きを禁止する
-   メッセージを投了またはチェックメイトの宣言のみに制限する
-   焦点を絞った、ゲーム志向の行動を作成する

### 基本的なエージェントの実行

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

この基本的なエージェントは自律的にプレイし、自動的に動きを行います。ゲーム出力は、AIがAI自身と対戦する際の動きのシーケンスと盤面状態を示します。

## 高度な機能：インタラクティブな選択

次のセクションでは、ユーザーが複数のAIが生成した動きの中から選択することで、AIの意思決定プロセスに参加できる、より洗練されたアプローチを示します。

### カスタム選択戦略

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

`AskUserChoiceSelectionStrategy`は、Koogの`ChoiceSelectionStrategy`インターフェースを実装し、AIの意思決定における人間の参加を可能にします。

**主要な機能:**

-   **カスタマイズ可能な表示**: プロンプトと選択肢のフォーマットを行う関数
-   **インタラクティブな入力**: ユーザー対話のための標準入出力を使用
-   **検証**: ユーザー入力が有効な範囲内であることを保証する
-   **柔軟なI/O**: さまざまな環境に対応する構成可能なprintおよびread関数

**ユースケース:**

-   ゲームプレイにおける人間とAIの協調
-   AIの意思決定の透明性と説明可能性
-   トレーニングおよびデバッグシナリオ
-   教育的なデモンストレーション

### 選択機能で強化された戦略

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

最初のインタラクティブなアプローチでは、基本エグゼキュータを選択機能でラップする`PromptExecutorWithChoiceSelection`を使用します。カスタム表示関数は、ツール呼び出しから動きの情報を抽出し、AIが何をしたいのかをユーザーに示します。

**アーキテクチャの変更点:**

-   **ラップされたエグゼキュータ**: `PromptExecutorWithChoiceSelection`は、あらゆる基本エグゼキュータに選択機能を追加する
-   **コンテキストを認識する表示**: フルプロンプトの代わりに最後のツール呼び出しの内容を表示する
-   **高い温度**: より多様な動きの選択肢のために1.0に増加

### 高度な戦略：手動による選択

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

高度な戦略では、選択機能をエージェントの実行グラフに直接統合します。

**新しいノード:**

-   `nodeLLMSendResultsMultipleChoices`: 複数のLLM選択肢を同時に処理する
-   `nodeSelectLLMChoice`: 選択戦略をワークフローに統合する

**強化された制御フロー:**

-   ツール結果は、複数の選択肢をサポートするためにリストにラップされる
-   ユーザー選択が行われる前に、選択されたパスに進む
-   選択された選択肢はアンラップされ、通常のフローを通じて継続される

**利点:**

-   **より高い制御**: エージェントのワークフローとのきめ細かな統合
-   **柔軟性**: 他のエージェント機能と組み合わせ可能
-   **透明性**: ユーザーはAIが何を検討しているかを正確に確認できる

### インタラクティブなエージェントの実行

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

インタラクティブな例は、ユーザーがAIの意思決定プロセスをどのようにガイドできるかを示しています。出力では、以下を確認できます。

1.  **複数の選択肢**: AIは3つの異なる動きの選択肢を生成する
2.  **ユーザーの選択**: ユーザーは1～3の数字を入力して、希望する動きを選択する
3.  **ゲームの継続**: 選択された動きが実行され、ゲームが続行される

## 結論

このチュートリアルでは、Koogフレームワークでインテリジェントなエージェントを構築するためのいくつかの主要な側面を示しました。

### 主要なポイント

1.  **ドメインモデリング**: 適切に構造化されたデータモデルは、複雑なアプリケーションにとって極めて重要です
2.  **ツール連携**: カスタムツールにより、エージェントは外部システムと効果的にやり取りできます
3.  **メモリ管理**: 戦略的な履歴トリミングは、長時間のインタラクションのパフォーマンスを最適化します
4.  **戦略グラフ**: Koogのグラフベースのアプローチは、柔軟な制御フローを提供します
5.  **インタラクティブAI**: 選択機能により、人間とAIの協調と透明性が可能になります

### 探求したフレームワークの機能

-   ✅ カスタムツールの作成と連携
-   ✅ エージェント戦略の設計とグラフベースの制御フロー
-   ✅ メモリ最適化技術
-   ✅ インタラクティブな選択
-   ✅ 複数のLLM応答の処理
-   ✅ ステートフルなゲーム管理

Koogフレームワークは、効率性と透明性を維持しながら、複雑な多ターン対話を処理できる洗練されたAIエージェントを構築するための基盤を提供します。