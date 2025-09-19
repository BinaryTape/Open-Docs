# Playwright MCP と Koog でブラウザを操作する

[:material-github: GitHub で開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb をダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

このノートブックでは、Koog エージェントを Playwright の Model Context Protocol (MCP) サーバーに接続し、実際のブラウザを操作してタスクを完了させます。具体的には、jetbrains.com を開き、Cookie を承認し、ツールバーの AI セクションをクリックします。

物事をシンプルかつ再現性のあるものにし、公開して再利用できる、最小限ながらも現実的なエージェントとツールのセットアップに焦点を当てます。

```kotlin
%useLatestDescriptors
%use koog

```

## 前提条件
- 環境変数としてエクスポートされた OpenAI API キー: `OPENAI_API_KEY`
- PATH に Node.js および npx が利用可能であること
- `%use koog` 経由で Koog が利用可能な Kotlin Jupyter ノートブック環境

ヒント: Playwright MCP サーバーをヘッドフルモードで実行すると、ブラウザがステップを自動化する様子を確認できます。

## 1) OpenAI API キーを提供する
`OPENAI_API_KEY` 環境変数から API キーを読み取ります。これにより、機密情報がノートブックから除外されます。

```kotlin
// 環境変数からAPIキーを取得
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) Playwright MCP サーバーを起動する
`npx` を使用して、Playwright の MCP サーバーをローカルで起動します。デフォルトでは、Koog から接続できる SSE エンドポイントが公開されます。

```kotlin
// npx 経由で Playwright MCP サーバーを起動
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) Koog から接続し、エージェントを実行する
OpenAI エグゼキュータを備えた最小限の Koog `AIAgent` を構築し、そのツールレジストリを SSE 経由で MCP サーバーに向けます。次に、ツールのみを使用してブラウザタスクを完了するよう要求します。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    println("Playwright MCP サーバーに接続中...")
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
    )
    println("Playwright MCP サーバーに正常に接続しました")

    // エージェントを作成
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiToken),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = toolRegistry,
    )

    val request = "Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar"
    println("リクエストを送信中: $request")

    agent.run(
        request + ". " +
            "You can only call tools. Use the Playwright tools to complete this task."
    )
}

```

## 4) MCP プロセスをシャットダウンする
実行の最後には必ず外部プロセスをクリーンアップしてください。

```kotlin
// Playwright MCP プロセスをシャットダウン
println("Playwright MCP サーバーへの接続を閉じています")
process.destroy()

```

## トラブルシューティング
- エージェントが接続できない場合は、MCP サーバーが `http://localhost:8931` で実行されていることを確認してください。
- ブラウザが表示されない場合は、Playwright がインストールされており、システム上でブラウザを起動できることを確認してください。
- OpenAI から認証エラーが発生する場合は、`OPENAI_API_KEY` 環境変数を再確認してください。

## 次のステップ
- さまざまなウェブサイトやフローを試してみてください。MCP サーバーは、豊富な Playwright ツールセットを公開しています。
- LLM モデルを入れ替えるか、Koog エージェントにツールを追加してください。
- このフローをアプリに統合するか、ノートブックをドキュメントとして公開してください。