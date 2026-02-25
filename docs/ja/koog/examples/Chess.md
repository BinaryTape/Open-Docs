# Koogフレームワークを使用したAIチェスプレイヤーの構築

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Chess.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Chess.ipynb
){ .md-button }

このチュートリアルでは、Koogフレームワークを使用してインテリジェントなチェス対戦エージェントを構築する方法を説明します。ツールの統合、エージェント戦略、メモリの最適化、およびインタラクティブなAIの意思決定といった主要な概念について学びます。

## 学べること

- 複雑なゲームのためのドメイン固有のデータ構造をモデリングする方法
- エージェントが環境と対話するために使用できるカスタムツールの作成方法
- メモリ管理を伴う効率的なエージェント戦略の実装方法
- 選択肢の選別機能を備えたインタラクティブなAIシステムの構築方法
- ターン制ゲームにおけるエージェントのパフォーマンスの最適化

## セットアップ

まず、Koogフレームワークをインポートし、開発環境をセットアップしましょう。

```kotlin
%useLatestDescriptors
%use koog
```

## チェスドメインのモデリング

堅牢なドメインモデルを作成することは、あらゆるゲームAIにとって不可欠です。チェスでは、プレイヤー、駒、およびそれらの関係を表現する必要があります。まず、コアとなるデータ構造を定義することから始めましょう。

### コアとなる列挙型と型

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

`Player` 列挙型はチェスの2つの陣営を表し、プレイヤーを簡単に切り替えるための `opponent()` メソッドを備えています。`PieceType` 列挙型は、各チェスの駒を標準的な記法（Standard Notation）の文字に対応させ、チェスの指し手の解析を容易にします。

`Side` 列挙型は、キングサイドとクイーンサイドのキャスリングを区別するのに役立ちます。

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

`Piece` データクラスは、駒のタイプと所有者を組み合わせたものです。視覚的な表現として、白の駒には大文字、黒の駒には小文字を使用します。`Position` クラスは、バリデーション機能を内蔵し、チェスの座標（例: "e4"）をカプセル化します。

## ゲーム状態の管理

### ChessBoard の実装

`ChessBoard` クラスは、8×8のグリッドと駒の位置を管理します。主な設計上の決定事項は以下の通りです：

- **内部表現**: 効率的なアクセスと変更のために、可変リストのリスト（List of Mutable Lists）を使用します。
- **視覚的表示**: `toString()` メソッドは、ランク（Rank：段）番号とファイル（File：列）文字を含む明確なASCII表現を提供します。
- **位置のマッピング**: チェスの記法（a1-h8）と内部配列のインデックスの間で変換を行います。

### ChessGame のロジック

```kotlin
/**
 * 有効な指し手のチェックを行わないシンプルなチェスゲーム。
 * 入力された指し手が有効な場合、ボードの正しい状態を保存します。
 */
class ChessGame {
    private val board: ChessBoard = ChessBoard()
    private var currentPlayer: Player = Player.White
    val moveNotation: String = """
        0-0 - ショートキャスリング
        0-0-0 - ロングキャスリング
        <piece>-<from>-<to> - 通常の指し手。例: p-e2-e4
        <piece>-<from>-<to>-<promotion> - 昇格（プロモーション）。例: p-e7-e8-q。
        駒の名前:
            p - ポーン (pawn)
            n - ナイト (knight)
            b - ビショップ (bishop)
            r - ルーク (rook)
            q - クイーン (queen)
            k - キング (king)
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

                require(PieceType.fromId(piece) == PieceType.Pawn) { "ポーンのみが昇格可能です" }

                usualMove(Position(from), Position(to))
                board.setPiece(Position(to), Piece(PieceType.fromId(promotion), currentPlayer))
            }

            else -> throw IllegalArgumentException("無効な指し手: $move")
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
            // アンパッサン (en passant) の処理
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

`ChessGame` クラスはゲームロジックを統括し、状態を維持します。注目すべき機能は以下の通りです：

- **指し手記法のサポート**: 通常の指し手、キャスリング（0-0, 0-0-0）、ポーンの昇格に対して標準的なチェス記法を受け付けます。
- **特殊な指し手の処理**: アンパッサンによるキャプチャとキャスリングのロジックを実装しています。
- **ターン管理**: 各指し手の後、プレイヤーを自動的に交互に切り替えます。
- **バリデーション**: 指し手の合法性は検証しません（AIが有効な指し手を選択することを信頼します）が、指し手の解析と状態の更新を正しく行います。

`moveNotation` 文字列は、許容される指し手の形式についてAIエージェントに明確なドキュメントを提供します。

## Koogフレームワークとの統合

### カスタムツールの作成

```kotlin
import kotlinx.serialization.Serializable

class Move(val game: ChessGame) : SimpleTool<Move.Args>(
    argsSerializer = Args.serializer(),
    descriptor = ToolDescriptor(
        name = "move",
        description = "次の記法に従って駒を動かします:
${game.moveNotation}",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "notation",
                description = "動かす駒の記法",
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
        return "現在のゲームの状態:
${game.getBoard()}
次は ${game.currentPlayer()} の番です！指し手を決めてください！"
    }
}
```

`Move` ツールは、Koogフレームワークのツール統合パターンを示しています：

1. **SimpleTool を継承**: 型安全な引数処理を備えた基本的なツール機能を継承します。
2. **シリアライズ可能な引数**: ツールの入力パラメータを定義するために Kotlin serialization を使用します。
3. **豊富なドキュメント**: `ToolDescriptor` は、ツールの目的とパラメータに関する詳細な情報をLLMに提供します。
4. **コンストラクタパラメータ**: `argsSerializer` と `descriptor` をコンストラクタに渡します。
5. **実行ロジック**: `execute` メソッドは、実際の指し手の実行を処理し、フォーマットされたフィードバックを提供します。

設計のポイント：
- **コンテキストの注入**: ツールは `ChessGame` インスタンスを受け取り、ゲームの状態を変更できるようにします。
- **フィードバックループ**: 現在のボードの状態を返し、次のプレイヤーを促すことで、対話の流れを維持します。
- **エラー処理**: 指し手のバリデーションとエラー報告はゲームクラスに依存します。

## エージェント戦略の設計

### メモリ最適化手法

```kotlin
import ai.koog.agents.core.environment.ReceivedToolResult

/**
 * チェスの局面は（ほぼ）完全にボードの状態によって定義されるため、
 * LLMの履歴をシステムプロンプトと最後の指し手のみにトリミングできます。
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

`nodeTrimHistory` 関数は、チェスゲームにとって重要な最適化を実装しています。チェスの局面は、指し手の全履歴よりも現在のボード状態によって大きく決定されるため、以下の内容のみを保持することで、トークンの使用量を大幅に削減できます。

1. **システムプロンプト**: エージェントの主要な指示と動作ガイドラインが含まれます。
2. **最新のメッセージ**: 最新のボード状態とゲームのコンテキストが含まれます。

このアプローチのメリット：
- **トークン消費の削減**: 会話履歴の指数関数的な増大を防ぎます。
- **コンテキストの維持**: 不可欠なゲーム状態情報を保持します。
- **パフォーマンスの向上**: プロンプトが短くなることで処理が高速化されます。
- **長時間のゲームを可能に**: トークン制限に達することなく、長時間の対局が可能になります。

このチェス戦略は、Koogのグラフベースのエージェントアーキテクチャを示しています：

**ノードの種類:**
- `nodeCallLLM`: 入力を処理し、レスポンスまたはツール呼び出しを生成します。
- `nodeExecuteTool`: 指定されたパラメータで `Move` ツールを実行します。
- `nodeTrimHistory`: 上記のように会話メモリを最適化します。
- `nodeSendToolResult`: ツールの実行結果をLLMに返します。

**コントロールフロー:**
- **線形パス**: 開始 → LLMリクエスト → ツール実行 → 履歴トリミング → 結果送信
- **分岐点**: LLMのレスポンスは、会話を終了するか、別のツール呼び出しをトリガーするかのいずれかになります。
- **メモリ管理**: 履歴のトリミングは、各ツール実行後に行われます。

この戦略により、会話の整合性を維持しながら、効率的でステートフルなゲームプレイが保証されます。

### AIエージェントのセットアップ

```kotlin
val baseExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))
```

このセクションでは、OpenAIエグゼキュータを初期化します。`simpleOpenAIExecutor` は、環境変数から取得したAPIキーを使用してOpenAIのAPIへの接続を作成します。

**構成に関する注意:**
- OpenAI APIキーを `OPENAI_API_KEY` 環境変数に保存してください。
- エグゼキュータは、認証とAPI通信を自動的に処理します。
- さまざまなLLMプロバイダー向けに異なる種類のエグゼキュータが用意されています。

### エージェントの組み立て

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

// システムプロンプトとツールレジストリを使用してチャットエージェントを作成する
val agent = AIAgent(
    executor = baseExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            あなたはチェスをプレイするエージェントです。
            "Your move!" というメッセージに対して、常に指し手を提案しなければなりません。

            ハルシネーション（もっともらしい嘘）をしないでください！！！
            反則の手（Illegal moves）を指さないでください！！！
            投了（Resignation）またはチェックメイト（Checkmate）の場合のみ、メッセージを送信できます！！！
        """.trimMargin(),
    temperature = 0.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
)
```

ここでは、すべてのコンポーネントを機能的なチェス対戦エージェントとして組み立てます。

**主な構成:**

- **モデルの選択**: 高品質なチェスプレイのために `OpenAIModels.Chat.O3Mini` を使用。
- **Temperature**: 決定論的で戦略的な指し手のために 0.0 に設定。
- **システムプロンプト**: 合法的な指し手と適切な振る舞いを強調するように注意深く作成された指示。
- **ツールレジストリ**: エージェントに `Move` ツールへのアクセスを提供。
- **最大反復回数 (Max Iterations)**: 終局まで対局できるように 200 に設定。

**システムプロンプトの設計:**
- 指し手を提案する責任を強調。
- ハルシネーションと反則の手を禁止。
- メッセージ送信を投了またはチェックメイトの宣言のみに制限。
- ゲームに特化した、集中した動作を生成。

### 基本エージェントの実行

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
    1 R N B Q K B n r
      a b c d e f g h
    -----------------
    ... (中略) ...
    The execution was interrupted

この基本エージェントは自律的に動作し、自動的に指し手を選択します。ゲームの出力には、AIが自分自身と対局する際の指し手のシーケンスとボードの状態が表示されます。

## 高度な機能：インタラクティブな選択肢の選別

次のセクションでは、ユーザーが複数のAI生成された指し手から選択することで、AIの意思決定プロセスに参加できる、より洗練されたアプローチを紹介します。

### カスタム選択肢選別戦略

```kotlin
import ai.koog.agents.core.feature.choice.ChoiceSelectionStrategy

/**
 * `AskUserChoiceStrategy` を使用すると、ユーザーは言語モデルによって提示された
 * オプションのリストからインタラクティブに選択肢を選択できます。
 * この戦略は、プロンプトと選択肢を表示し、選択された内容を決定するために
 * ユーザーの入力を読み取るカスタマイズ可能なメソッドを使用します。
 *
 * @property promptShowToUser 与えられた `Prompt` をフォーマットしてユーザーに表示する関数。
 * @property choiceShowToUser 与えられた `LLMChoice` をフォーマットしてユーザーに提示する関数。
 * @property print ユーザーにメッセージを表示する責任を持つ関数（例：プロンプトやフィードバックの表示）。
 * @property read ユーザーの入力をキャプチャする関数。
 */
class AskUserChoiceSelectionStrategy(
    private val promptShowToUser: (Prompt) -> String = { "現在のプロンプト: $it" },
    private val choiceShowToUser: (LLMChoice) -> String = { "$it" },
    private val print: (String) -> Unit = ::println,
    private val read: () -> String? = ::readlnOrNull
) : ChoiceSelectionStrategy {
    override suspend fun choose(prompt: Prompt, choices: List<LLMChoice>): LLMChoice {
        print(promptShowToUser(prompt))

        print("利用可能なLLMの選択肢")

        choices.withIndex().forEach { (index, choice) ->
            print("選択肢番号 ${index + 1}: ${choiceShowToUser(choice)}")
        }

        var choiceNumber = ask(choices.size)
        while (choiceNumber == null) {
            print("無効な回答です。")
            choiceNumber = ask(choices.size)
        }

        return choices[choiceNumber - 1]
    }

    private fun ask(numChoices: Int): Int? {
        print("選択肢を選んでください。1 から $numChoices の間の数字を入力してください: ")

        return read()?.toIntOrNull()?.takeIf { it in 1..numChoices }
    }
}
```

`AskUserChoiceSelectionStrategy` は、Koog の `ChoiceSelectionStrategy` インターフェースを実装し、AIの意思決定への人間の参加を可能にします。

**主な機能:**
- **カスタマイズ可能な表示**: プロンプトと選択肢をフォーマットするための関数。
- **インタラクティブな入力**: ユーザーとの対話に標準入出力を使用。
- **バリデーション**: ユーザーの入力が有効な範囲内にあることを保証。
- **柔軟なI/O**: さまざまな環境向けに構成可能な print および read 関数。

**ユースケース:**
- ゲームプレイにおける人間とAIのコラボレーション。
- AIの意思決定の透明性と説明責任。
- トレーニングおよびデバッグのシナリオ。
- 教育的なデモンストレーション。

### 選択肢選別を備えた強化された戦略

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

最初のインタラクティブなアプローチでは、ベースとなるエグゼキュータを選択肢選別機能でラップする `PromptExecutorWithChoiceSelection` を使用します。カスタム表示関数はツール呼び出しから指し手情報を抽出し、AIが何をしようとしているかをユーザーに示します。

**アーキテクチャの変更:**
- **ラップされたエグゼキュータ**: `PromptExecutorWithChoiceSelection` は、任意のベースエグゼキュータに選択肢機能を追加します。
- **コンテキストを考慮した表示**: 完全なプロンプトではなく、最後のツール呼び出しの内容を表示します。
- **より高い Temperature**: より多様な指し手のオプションを生成するために 1.0 に引き上げられました。

### 高度な戦略：手動による選択肢選別

```kotlin
val game = ChessGame()
val toolRegistry = ToolRegistry { tools(listOf(Move(game))) }

val agent = AIAgent(
    executor = promptExecutor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.O3Mini,
    systemPrompt = """
            あなたはチェスをプレイするエージェントです。
            "Your move!" というメッセージに対して、常に指し手を提案しなければなりません。

            ハルシネーションをしないでください！！！
            反則の手を指さないでください！！！
            投了またはチェックメイトの場合のみ、メッセージを送信できます！！！
        """.trimMargin(),
    temperature = 1.0,
    toolRegistry = toolRegistry,
    maxIterations = 200,
    numberOfChoices = 3,
)
```

高度な戦略では、エージェントの実行グラフに選択肢選別を直接統合します。

**新しいノード:**
- `nodeLLMSendResultsMultipleChoices`: 複数のLLMの選択肢を同時に処理します。
- `nodeSelectLLMChoice`: 選択肢選別戦略をワークフローに統合します。

**強化されたコントロールフロー:**
- ツールの結果は、複数の選択肢をサポートするためにリストにラップされます。
- 選択されたパスに進む前に、ユーザーによる選択が行われます。
- 選択された選択肢はラップを解除され、通常のフローを継続します。

**メリット:**
- **きめ細かな制御**: エージェントのワークフローとの密接な統合。
- **柔軟性**: 他のエージェント機能と組み合わせることが可能。
- **透明性**: ユーザーはAIが何を検討しているかを正確に把握できます。

### インタラクティブエージェントの実行

```kotlin
println("Chess Game started!")

val initialMessage = "Starting position is ${game.getBoard()}. White to move!"

runBlocking {
    agent.run(initialMessage)
}
```

    Chess Game started!
    
    利用可能なLLMの選択肢
    選択肢番号 1: [Call(id=call_K46Upz7XoBIG5RchDh7bZE8F, tool=move, content={"notation": "p-e2-e4"}, ...)]
    選択肢番号 2: [Call(id=call_zJ6OhoCHrVHUNnKaxZkOhwoU, tool=move, content={"notation": "p-e2-e4"}, ...)]
    選択肢番号 3: [Call(id=call_nwX6ZMJ3F5AxiNUypYlI4BH4, tool=move, content={"notation": "p-e2-e4"}, ...)]
    選択肢を選んでください。1 から 3 の間の数字を入力してください: 1
    ... (対局の進行) ...
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
            あなたはチェスをプレイするエージェントです。
            "Your move!" というメッセージに対して、常に指し手を提案しなければなりません。

            ハルシネーションをしないでください！！！
            反則の手を指さないでください！！！
            投了またはチェックメイトの場合のみ、メッセージを送信できます！！！
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

インタラクティブな例は、ユーザーがAIの意思決定プロセスをどのようにガイドできるかを示しています。出力では以下のことが確認できます：

1. **複数の選択肢**: AIが3つの異なる指し手のオプションを生成します。
2. **ユーザーによる選択**: ユーザーが1〜3の数字を入力して、好みの指し手を選択します。
3. **ゲームの継続**: 選択された指し手が実行され、ゲームが続行されます。

## 結論

このチュートリアルでは、Koogフレームワークを使用してインテリジェントなエージェントを構築する際のいくつかの重要な側面を実演しました：

### 主な学習ポイント

1. **ドメインモデリング**: 複雑なアプリケーションには、適切に構造化されたデータモデルが不可欠です。
2. **ツールの統合**: カスタムツールにより、エージェントは外部システムと効果的に対話できるようになります。
3. **メモリ管理**: 戦略的な履歴のトリミングにより、長時間の対話におけるパフォーマンスが最適化されます。
4. **戦略グラフ**: Koogのグラフベースのアプローチは、柔軟なコントロールフローを提供します。
5. **インタラクティブAI**: 選択肢の選別により、人間とAIのコラボレーションと透明性が実現します。

### 探索したフレームワークの機能

- ✅ カスタムツールの作成と統合
- ✅ エージェント戦略の設計とグラフベースのコントロールフロー
- ✅ メモリ最適化手法
- ✅ インタラクティブな選択肢の選別
- ✅ 複数のLLMレスポンスの処理
- ✅ ステートフルなゲーム管理

Koogフレームワークは、効率性と透明性を維持しながら、複雑でマルチターンの対話を処理できる洗練されたAIエージェントを構築するための基盤を提供します。