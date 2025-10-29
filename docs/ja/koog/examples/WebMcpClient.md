# Bright DataとKoogによるThe Web MCPでのウェブスクレイピング

[:material-github: GitHubで開く](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: .ktファイルをダウンロード](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

このチュートリアルでは、KoogエージェントをBright DataのWeb MCPサーバーに接続し、ウェブスクレイピングとデータ収集タスクを実行させます。Model Context Protocolを介してBright Dataの強力なウェブスクレイピングインフラストラクチャを使用し、Koog.aiに関する情報を検索する方法をデモンストレーションします。

シンプルで再現性のあるものにし、最小限ながらも現実的なエージェント + ツール設定に焦点を当て、ご自身のウェブスクレイピングのニーズに合わせて調整できるようにします。

## 前提条件

- 環境変数 `OPENAI_API_KEY` としてエクスポートされたOpenAI APIキー
- 環境変数 `BRIGHT_DATA_API_TOKEN` としてエクスポートされたBright Data APIトークン
- PATH上にNode.jsとnpxが利用可能であること
- Koogの依存関係を持つKotlin開発環境

**ヒント**: Bright Data MCPサーバーは、複雑なウェブサイト、CAPTCHA、アンチボット対策に対応できるエンタープライズグレードのウェブスクレイピングツールへのアクセスを提供します。

## 1) API認証情報を設定する

シークレットを安全に保ち、コードから分離するために、APIキーは両方とも環境変数から読み込みます。

```kotlin
// 環境変数からAPIキーを取得
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("OPENAI_API_KEY environment variable is not set")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")
```

## 2) Bright DataによるThe Web MCPサーバーを起動する

`npx` を使ってBright DataのMCPサーバーを起動し、APIトークンで設定します。サーバーはModel Context Protocolを通じてウェブスクレイピング機能を提供します。

```kotlin
println("Starting Bright Data MCP server...")

// Bright Data MCPサーバーを別プロセスとして起動
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// MCPサーバープロセス用にAPI_TOKEN環境変数を設定
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// プロセスを起動
val process = processBuilder.start()

// プロセスが起動するまでしばらく待機
Thread.sleep(2000)
```

## 3) Koogから接続し、エージェントを作成する

OpenAIエグゼキュータを持つKoog `AIAgent` を構築し、そのツールレジストリをSTDIOトランスポート経由でBright Data MCPサーバーに接続します。その後、利用可能なツールを探索し、ウェブスクレイピングタスクを実行します。

```kotlin
println("Creating STDIO transport...")
try {
    // STDIOトランスポートを作成
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("Creating tool registry...")
    
    // Bright Data MCPサーバーからのツールを持つツールレジストリを作成
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // 利用可能なツールを表示（オプション - デバッグ用）
    println("Available tools from Bright Data MCP server:")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // MCPツールを持つエージェントを作成
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
    println("エラー: ${e.message}")
    e.printStackTrace()
} finally {
    println("MCPサーバーをシャットダウン中...")
    process.destroyForcibly()
}
```

## 4) 完全なコード例

Bright DataによるThe Web MCPでのウェブスクレイピングを示す、動作する完全な例を以下に示します。

```kotlin
package koog

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

/**
 * AI駆動のウェブスクレイピングとデータ収集を示すプログラムのエントリポイント。
 *
 * この関数は、Bright Data MCPサーバーを初期化し、ツール統合を設定し、
 * ウェブスクレイピングツールと対話するためのAIエージェントを定義します。これは、以下の主要な操作を示します。
 *
 * 1. 適切なAPIトークン構成を持つサブプロセスを使用してBright Data MCPサーバーを起動します。
 * 2. STDIOトランスポート通信を介して、MCPサーバーからのツールレジストリを設定します。
 * 3. ウェブスクレイピング機能を備えたOpenAIのGPT-4oモデルを活用するAIエージェントを作成します。
 * 4. 指定されたタスク（例：Koog.aiに関するウェブコンテンツの検索と分析）を実行するためにエージェントを実行します。
 * 5. 実行後にMCPサーバープロセスをシャットダウンしてクリーンアップします。
 *
 * この関数は、MCP（Model Context Protocol）サーバーをAIエージェントと統合して、ウェブデータ収集と分析を行う方法を示すチュートリアルを目的としています。
 * OPENAI_API_KEYおよびBRIGHT_DATA_API_TOKEN環境変数が設定されている必要があります。
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

    // プロセスを起動
    val process = processBuilder.start()

    // プロセスが起動するまでしばらく待機
    Thread.sleep(2000)

    println("Creating STDIO transport...")

    try {
        // STDIOトランスポートを作成
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("Creating tool registry...")
        
        // Bright Data MCPサーバーからのツールを持つツールレジストリを作成
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // 利用可能なツールを表示（オプション - デバッグ用）
        println("Available tools from Bright Data MCP server:")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // MCPツールを持つエージェントを作成
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
        println("エラー: ${e.message}")
        e.printStackTrace()
    } finally {
        println("MCPサーバーをシャットダウン中...")
        process.destroyForcibly()
    }
}
```

## トラブルシューティング

- **接続の問題**: エージェントがMCPサーバーに接続できない場合は、`npx @brightdata/mcp` を介してBright Data MCPパッケージが正しくインストールされていることを確認してください。
- **APIトークンのエラー**: `BRIGHT_DATA_API_TOKEN` が有効であり、ウェブスクレイピングに必要な権限を持っていることを再確認してください。
- **OpenAI認証**: `OPENAI_API_KEY` 環境変数が正しく設定されており、APIキーが有効であることを確認してください。
- **プロセスのタイムアウト**: サーバーの起動に時間がかかる場合は、`Thread.sleep(2000)` の持続時間を増やしてください。

## 次のステップ

- **異なるクエリを試す**: 異なるウェブサイトをスクレイピングしたり、様々なトピックを検索したりしてみてください。
- **カスタムツールの統合**: Bright Dataのウェブスクレイピング機能に加えて、独自のツールを追加してください。
- **高度なスクレイピング**: 住宅用プロキシ、CAPTCHA解決、JavaScriptレンダリングなどのBright Dataの高度な機能を活用してください。
- **データ処理**: スクレイピングされたデータを他のKoogエージェントと組み合わせて、分析や洞察を得てください。
- **本番環境へのデプロイ**: このパターンをアプリケーションに統合して、自動化されたウェブデータ収集を実現してください。

## 学んだこと

このチュートリアルでは、以下の方法を学びました。
- Bright DataによるThe Web MCPのセットアップと構成
- STDIOトランスポート経由でKoog AIエージェントを外部MCPサーバーに接続する
- 自然言語の指示を使用してAI駆動のウェブスクレイピングタスクを実行する
- 適切なリソースのクリーンアップとエラー管理を処理する
- 本番環境に対応したウェブスクレイピングアプリケーションのためのコード構造

KoogのAIエージェント機能とBright Dataのエンタープライズウェブスクレイピングインフラストラクチャの組み合わせは、自動化されたデータ収集と分析ワークフローのための強力な基盤を提供します。