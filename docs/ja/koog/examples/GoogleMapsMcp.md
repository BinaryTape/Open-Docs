# Google Maps MCPとKoog: Kotlin Notebookでゼロから標高を取得するまで

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

この短いブログ形式のウォークスルーでは、Google Maps用のModel Context Protocol (MCP) サーバーにKoogを接続します。Dockerでサーバーを起動し、利用可能なツールを検出し、AIエージェントに住所をジオコーディングさせ、その標高を取得させます。これらすべてをKotlin Notebookから実行します。

最終的には、ワークフローやドキュメントに組み込むことができる、再現可能なエンドツーエンドの例が手に入ります。

```kotlin
%useLatestDescriptors
%use koog

```

## 前提条件
以下のセルを実行する前に、以下を確認してください：

- Dockerがインストールされ、実行されていること
- 有効なGoogle Maps APIキーが環境変数 `GOOGLE_MAPS_API_KEY` としてエクスポートされていること
- OpenAI APIキーが `OPENAI_API_KEY` としてエクスポートされていること

これらはシェルで次のように設定できます (macOS/Linuxの例)：

```bash
export GOOGLE_MAPS_API_KEY="<your-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

```kotlin
// APIキーを環境変数から取得
val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY") ?: error("GOOGLE_MAPS_API_KEY environment variable not set")
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## Google Maps MCPサーバーを起動する (Docker)
公式の `mcp/google-maps` イメージを使用します。このコンテナは、`maps_geocode` や `maps_elevation` などのツールをMCP経由で公開します。APIキーは環境変数を介して渡し、ノートブックがstdioを介して通信できるように、アタッチモードで起動します。

```kotlin
// Google Maps MCPサーバーでDockerコンテナを起動
val process = ProcessBuilder(
    "docker",
    "run",
    "-i",
    "-e",
    "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

```

## McpToolRegistryを介してツールを発見する
Koogはstdioを介してMCPサーバーに接続できます。ここでは、実行中のプロセスからツールレジストリを作成し、発見されたツールとその記述子を出力します。

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## OpenAIでAIエージェントを構築する
次に、OpenAIのエグゼキューターとモデルをバックエンドとするシンプルなエージェントを組み立てます。このエージェントは、先ほど作成したレジストリを介して、MCPサーバーによって公開されたツールを呼び出すことができます。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 標高を要求する: まずジオコーディング、次に標高
ミュンヘンにあるJetBrainsオフィスの標高を検索するように、エージェントに指示します。この指示は、利用可能なツールのみを使用し、そのタスクにどのツールを優先すべきかをエージェントに明確に伝えています。

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
完了したら、バックグラウンドで何も実行されたままにならないように、Dockerプロセスを停止します。

```kotlin
process.destroy()

```

## トラブルシューティングと次のステップ
- コンテナの起動に失敗した場合は、Dockerが実行されていること、および `GOOGLE_MAPS_API_KEY` が有効であることを確認してください。
- エージェントがツールを呼び出せない場合は、ディスカバリセルを再実行して、ツールレジストリが適切にロードされていることを確認してください。
- 利用可能なGoogle Mapsツールを使用して、ルート計画や場所検索など、他のプロンプトを試してください。

次に、複数のMCPサーバー（例：Web自動化用のPlaywright + Google Maps）を組み合わせることを検討し、Koogに、より高度なタスクのためにツールの使用をオーケストレーションさせましょう。