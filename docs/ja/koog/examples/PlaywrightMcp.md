# Playwright MCPとKoogを使用してブラウザを操作する

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

このノートブックでは、KoogエージェントをPlaywrightのModel Context Protocol (MCP) サーバーに接続し、実際のブラウザを操作して「jetbrains.comを開き、Cookieを承諾し、ツールバーのAIセクションをクリックする」というタスクを完了させます。

ここでは、公開や再利用が可能な、最小限かつ現実的なエージェントとツールのセットアップに焦点を当て、シンプルで再現性のある構成を維持します。

```kotlin
%useLatestDescriptors
%use koog

```

## 前提条件
- 環境変数としてエクスポートされたOpenAI APIキー：`OPENAI_API_KEY`
- PATHで利用可能なNode.jsおよびnpx
- `%use koog` を介してKoogが利用可能なKotlin Jupyter notebook環境

ヒント：Playwright MCPサーバーをヘッドフルモード（headful mode）で実行すると、ブラウザがステップを自動化する様子を観察できます。

## 1) OpenAI APIキーの提供
`OPENAI_API_KEY` 環境変数からAPIキーを読み取ります。これにより、シークレットがノートブック内に残るのを防ぎます。

```kotlin
// 環境変数からAPIキーを取得する
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) Start the Playwright MCP server
`npx` を使用して、ローカルでPlaywrightのMCPサーバーを起動します。デフォルトでは、Koogから接続可能なSSEエンドポイントが公開されます。

```kotlin
// npx経由でPlaywright MCPサーバーを起動する
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) Koogからの接続とエージェントの実行
OpenAIエグゼキュータ（executor）を使用した最小限のKoog `AIAgent` を構築し、そのツールレジストリ（tool registry）でSSE経由のMCPサーバーを指定します。その後、厳密にツール経由でブラウザタスクを完了するよう指示します。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    println("Connecting to Playwright MCP server...")
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931/sse")
    )
    println("Successfully connected to Playwright MCP server")

    // エージェントの作成
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiToken),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = toolRegistry,
    )

    val request = "Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar"
    println("Sending request: $request")

    agent.run(
        request + ". " +
            "You can only call tools. Use the Playwright tools to complete this task."
    )
}

```

## 4) MCPプロセスの終了
実行の最後には、必ず外部プロセスをクリーンアップしてください。

```kotlin
// Playwright MCPプロセスのシャットダウン
println("Closing connection to Playwright MCP server")
process.destroy()

```

## トラブルシューティング
- エージェントが接続できない場合は、MCPサーバーが `http://localhost:8931` で実行されているか確認してください。
- ブラウザが表示されない場合は、Playwrightがインストールされており、システム上でブラウザを起動できる状態であることを確認してください。
- OpenAIから認証エラーが返される場合は、`OPENAI_API_KEY` 環境変数を再確認してください。

## 次のステップ
- 別のウェブサイトやフローを試してみてください。MCPサーバーは豊富なPlaywrightツールを公開しています。
- LLMモデルを入れ替えたり、Koogエージェントにさらにツールを追加したりしてみてください。
- このフローをアプリに統合したり、ノートブックをドキュメントとして公開したりしてみてください。