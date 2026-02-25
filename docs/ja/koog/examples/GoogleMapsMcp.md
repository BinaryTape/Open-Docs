# Koog を使った Google Maps MCP：Kotlin Notebook でゼロから標高を取得するまで

[:material-github: GitHub で開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb をダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

この短いブログ形式のウォークスルーでは、Koog を Google Maps の Model Context Protocol (MCP) サーバーに接続します。Docker でサーバーを起動し、利用可能なツールを検出し、AI エージェントに住所のジオコーディングと標高の取得を行わせます。これらすべてを Kotlin Notebook 上で完結させます。

読み終える頃には、自身のワークフローやドキュメントにそのまま組み込める、再現可能なエンドツーエンドの例が手に入ります。

```kotlin
%useLatestDescriptors
%use koog

```

## 前提条件
以下のセルを実行する前に、以下が準備されていることを確認してください：

- Docker がインストールされ、実行されていること
- 有効な Google Maps API キーが環境変数 `GOOGLE_MAPS_API_KEY` としてエクスポートされていること
- OpenAI API キーが `OPENAI_API_KEY` としてエクスポートされていること

シェルで次のように設定できます（macOS/Linux の例）：

```bash
export GOOGLE_MAPS_API_KEY="<your-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

```kotlin
// 環境変数から API キーを取得
val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY") ?: error("GOOGLE_MAPS_API_KEY environment variable not set")
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## Google Maps MCP サーバーの起動 (Docker)
公式の `mcp/google-maps` イメージを使用します。このコンテナは MCP を介して `maps_geocode` や `maps_elevation` などのツールを公開します。環境変数を介して API キーを渡し、ノートブックが標準入出力（stdio）を介して通信できるように、アタッチされた状態で起動します。

```kotlin
// Google Maps MCP サーバーを Docker コンテナで起動
val process = ProcessBuilder(
    "docker",
    "run",
    "-i",
    "-e",
    "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

```

## McpToolRegistry によるツールの検出
Koog は標準入出力を介して MCP サーバーに接続できます。ここでは、実行中のプロセスからツールレジストリを作成し、検出されたツールとそのデスクリプタを表示します。

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## OpenAI を使用した AI エージェントの構築
次に、OpenAI のエグゼキューターとモデルをベースにしたシンプルなエージェントを組み立てます。このエージェントは、先ほど作成したレジストリを通じて、MCP サーバーによって公開されたツールを呼び出すことができます。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 標高の問い合わせ：最初にジオコーディング、次に標高
ミュンヘンにある JetBrains オフィスの標高を調べるようエージェントに促します。指示の中で、利用可能なツールのみを使用すること、およびこのタスクにどのツールを優先すべきかを明示的に伝えます。

```kotlin
import kotlinx.coroutines.runBlocking

val request = "Get elevation of the Jetbrains Office in Munich, Germany?"
runBlocking {
    agent.run(
        request +
            "You can only call tools. Get it by calling maps_geocode and maps_elevation tools."
    )
}

```

## クリーンアップ
完了したら、バックグラウンドで実行されたままにならないよう、Docker プロセスを停止します。

```kotlin
process.destroy()

```

## トラブルシューティングと次のステップ
- コンテナの起動に失敗した場合は、Docker が実行されているか、および `GOOGLE_MAPS_API_KEY` が有効かを確認してください。
- エージェントがツールを呼び出せない場合は、ツール検出のセルを再実行して、ツールレジストリにデータが入っていることを確認してください。
- 利用可能な Google Maps ツールを使用して、ルート計画や場所の検索など、他のプロンプトを試してみてください。

次は、複数の MCP サーバー（例：Web オートメーション用の Playwright + Google Maps）を組み合わせ、Koog にツールの使用をオーケストレーションさせて、より高度なタスクを実行させることを検討してみてください。