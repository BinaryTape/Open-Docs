# Bright DataによるThe Web MCPとKoogを使用したウェブスクレイピング

[:material-github: GitHubで開く](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: .ktをダウンロード](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

このチュートリアルでは、KoogエージェントをBright DataのWeb MCPサーバーに接続し、ウェブスクレイピングとデータ収集タスクを実行させる方法を解説します。Model Context Protocol（MCP）を通じて、Bright Dataの強力なウェブスクレイピング・インフラストラクチャを使用し、Koog.aiに関する情報を検索するデモを行います。

シンプルかつ再現可能な構成を維持しつつ、独自のウェブスクレイピング・ニーズに合わせてカスタマイズできる、最小限ながらも現実的なエージェントとツールのセットアップに焦点を当てます。

## 前提条件

- 環境変数としてエクスポートされたOpenAI APIキー: `OPENAI_API_KEY`
- 環境変数としてエクスポートされたBright Data APIトークン: `BRIGHT_DATA_API_TOKEN`
- PATHが通っており、利用可能なNode.jsおよびnpx
- Koogの依存関係が含まれるKotlin開発環境

**ヒント**: Bright Data MCPサーバーは、複雑なウェブサイト、CAPTCHA、アンチボット対策を処理できるエンタープライズ級のウェブスクレイピング・ツールへのアクセスを提供します。

## 1) API認証情報のセットアップ

機密情報を保護しコードから分離するため、両方のAPIキーを環境変数から読み込みます。

```kotlin
// 環境変数からAPIキーを取得
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("OPENAI_API_KEY environment variable is not set")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")
```

## 2) Bright DataによるThe Web MCPサーバーの起動

`npx`を使用してBright DataのMCPサーバーを起動し、APIトークンを設定します。このサーバーは、Model Context Protocolを介してウェブスクレイピング機能を公開します。

```kotlin
println("Starting Bright Data MCP server...")

// Bright Data MCPサーバーを別プロセスとして起動
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// MCPサーバープロセス用にAPI_TOKEN環境変数を設定
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// プロセスを開始
val process = processBuilder.start()

// プロセスが起動するまで少し待機
Thread.sleep(2000)
```

## 3) Koogからの接続とエージェントの作成

OpenAIエグゼキューター（executor）を使用してKoogの`AIAgent`を構築し、STDIOトランスポートを介してそのツールレジストリをBright Data MCPサーバーに接続します。その後、利用可能なツールを確認し、ウェブスクレイピング・タスクを実行します。

```kotlin
println("Creating STDIO transport...")
try {
    // STDIOトランスポートを作成
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("Creating tool registry...")
    
    // Bright Data MCPサーバーのツールを使用してツールレジストリを作成
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // 利用可能なツールを出力（オプション - デバッグ用）
    println("Available tools from Bright Data MCP server:")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // MCPツールを搭載したエージェントを作成
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiKey),
        systemPrompt = "You are a helpful assistant with access to web scraping and data collection tools from Bright Data. You can help users gather information from websites, analyze web data, and provide insights.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = toolRegistry,
        maxIterations = 100
    )
    
    val result = agent.run("Please search for Koog.ai and tell me what is it and who invented it")
    
    println("
Agent response:")
    println(result)
    
} catch (e: Exception) {
    println("Error: ${e.message}")
    e.printStackTrace()
} finally {
    println("Shutting down MCP server...")
    process.destroyForcibly()
}
```

## 4) 完全なコード例

以下は、Bright DataによるThe Web MCPを使用したウェブスクレイピングの実演を行う、完全に動作するコード例です。

```kotlin
package koog

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

/**
 * AI駆動のウェブスクレイピングとデータ収集をデモンストレーションするプログラムのエントリポイントです。
 *
 * この関数は、Bright Data MCPサーバーを初期化し、ツール統合をセットアップし、
 * ウェブスクレイピング・ツールと対話するためのAIエージェントを定義します。
 * 以下の主要な操作を実行します。
 *
 * 1. 適切なAPIトークン設定を使用して、サブプロセスとしてBright Data MCPサーバーを起動します。
 * 2. STDIOトランスポート通信を介して、MCPサーバーからのツールレジストリを構成します。
 * 3. ウェブスクレイピング機能を備えたOpenAIのGPT-4oモデルを活用するAIエージェントを作成します。
 * 4. 指定されたタスク（例：Koog.aiに関するウェブコンテンツの検索と分析）を実行するためにエージェントを走らせます。
 * 5. 実行後、MCPサーバープロセスをシャットダウンしてクリーンアップします。
 *
 * この関数はチュートリアル目的であり、MCP（Model Context Protocol）サーバーを
 * AIエージェントと統合してウェブデータの収集と分析を行う方法を示しています。
 * 実行にはOPENAI_API_KEYおよびBRIGHT_DATA_API_TOKEN環境変数の設定が必要です。
 */
fun main() = runBlocking {
    // 環境変数からAPIキーを取得
    val openAIApiKey = System.getenv("OPENAI_API_KEY")
        ?: error("OPENAI_API_KEY environment variable is not set")
    val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
        ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")

    println("Starting Bright Data MCP server...")

    // Bright Data MCPサーバーを別プロセスとして起動
    val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

    // MCPサーバープロセス用にAPI_TOKEN環境変数を設定
    val environment = processBuilder.environment()
    environment["API_TOKEN"] = brightDataToken

    // プロセスを開始
    val process = processBuilder.start()

    // プロセスが起動するまで少し待機
    Thread.sleep(2000)

    println("Creating STDIO transport...")

    try {
        // STDIOトランスポートを作成
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("Creating tool registry...")
        
        // Bright Data MCPサーバーのツールを使用してツールレジストリを作成
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // 利用可能なツールを出力（オプション - デバッグ用）
        println("Available tools from Bright Data MCP server:")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // MCPツールを搭載したエージェントを作成
        val agent = AIAgent(
            executor = simpleOpenAIExecutor(openAIApiKey),
            systemPrompt = "You are a helpful assistant with access to web scraping and data collection tools from Bright Data. You can help users gather information from websites, analyze web data, and provide insights.",
            llmModel = OpenAIModels.Chat.GPT4o,
            temperature = 0.7,
            toolRegistry = toolRegistry,
            maxIterations = 100
        )
        
        val result = agent.run("Please search for Koog.ai and tell me what is it and who invented it")
        
        println("
Agent response:")
        println(result)
        
    } catch (e: Exception) {
        println("Error: ${e.message}")
        e.printStackTrace()
    } finally {
        println("Shutting down MCP server...")
        process.destroyForcibly()
    }
}
```

## トラブルシューティング

- **接続の問題**: エージェントがMCPサーバーに接続できない場合は、`npx @brightdata/mcp`を介してBright Data MCPパッケージが正しくインストールされているか確認してください。
- **APIトークンのエラー**: `BRIGHT_DATA_API_TOKEN`が有効であり、ウェブスクレイピングに必要な権限を持っているか再確認してください。
- **OpenAI認証**: `OPENAI_API_KEY`環境変数が正しく設定されており、APIキーが有効であることを確認してください。
- **プロセスタイムアウト**: サーバーの起動に時間がかかる場合は、`Thread.sleep(2000)`の時間を増やしてください。

## 次のステップ

- **異なるクエリの探索**: さまざまなウェブサイトをスクレイピングしたり、多様なトピックを検索したりしてみてください。
- **カスタムツールの統合**: Bright Dataのウェブスクレイピング機能と並行して、独自のツールを追加してください。
- **高度なスクレイピング**: レジデンシャルプロキシ、CAPTCHA解決、JavaScriptレンダリングなど、Bright Dataの高度な機能を活用してください。
- **データ処理**: スクレイピングしたデータを他のKoogエージェントと組み合わせて、分析や洞察を得るために利用してください。
- **本番環境へのデプロイ**: このパターンをアプリケーションに統合し、自動化されたウェブデータ収集を実現してください。

## 学んだこと

このチュートリアルでは、以下の方法を学びました：
- Bright DataによるThe Web MCPのセットアップと構成
- STDIOトランスポートを介したKoog AIエージェントと外部MCPサーバーの接続
- 自然言語による指示を用いたAI駆動のウェブスクレイピングタスクの実行
- 適切なリソースのクリーンアップとエラー管理
- 本番対応のウェブスクレイピング・アプリケーションのためのコード構造化

KoogのAIエージェント機能とBright Dataのエンタープライズ向けウェブスクレイピング・インフラストラクチャの組み合わせは、自動化されたデータ収集および分析ワークフローのための強力な基盤を提供します。