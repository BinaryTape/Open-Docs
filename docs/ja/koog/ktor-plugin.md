# Ktor連携: Koogプラグイン

KoogはKtorサーバーに自然にフィットし、イディオマティックなKotlin APIを使ってサーバーサイドのAIアプリケーションを両側から書くことができます。

Koogプラグインを一度インストールし、`application.conf`/YAMLまたはコードでLLMプロバイダーを設定すれば、ルートから直接エージェントを呼び出せます。モジュール間でLLMクライアントを接続する手間はもうありません。ルートはエージェントをリクエストするだけで準備完了です。

## 概要

`koog-ktor`モジュールは、サーバーサイドのエージェント開発向けにイディオマティックなKotlin/Ktor連携を提供します。

- ドロップインKtorプラグイン: `Application`での`install(Koog)`
- OpenAI、Anthropic、Google、OpenRouter、DeepSeek、およびOllamaのファーストクラスのサポート
- YAML/CONFおよび/またはコードによる一元的な設定
- プロンプト、ツール、機能によるエージェントのセットアップ。ルート用のシンプルな拡張関数
- 直接的なLLM利用（`execute`、`executeStreaming`、`moderate`）
- JVM専用のModel Context Protocol（MCP）ツール連携

## 依存関係の追加

```kotlin
dependencies {
    implementation("ai.koog:koog-ktor:$koogVersion")
}
```

## クイックスタート

1) プロバイダーを設定する（`application.yaml`または`application.conf`で）

`koog.<provider>`の下にネストされたキーを使用します。プラグインはそれらを自動的に読み込みます。

```yaml
# application.yaml (Ktor config)
koog:
  openai:
    apikey: ${OPENAI_API_KEY}
    baseUrl: https://api.openai.com
  anthropic:
    apikey: ${ANTHROPIC_API_KEY}
    baseUrl: https://api.anthropic.com
  google:
    apikey: ${GOOGLE_API_KEY}
    baseUrl: https://generativelanguage.googleapis.com
  openrouter:
    apikey: ${OPENROUTER_API_KEY}
    baseUrl: https://openrouter.ai
  deepseek:
    apikey: ${DEEPSEEK_API_KEY}
    baseUrl: https://api.deepseek.com
  # koog.ollama.*キーが存在する場合、Ollamaが有効になります
  ollama:
    enable: true
    baseUrl: http://localhost:11434
```

オプション: リクエストされたプロバイダーが設定されていない場合に、直接的なLLM呼び出しで使用されるフォールバックを設定します。

```yaml
koog:
  llm:
    fallback:
      provider: openai
      # 下記の「モデル識別子」セクションを参照してください
      model: openai.chat.gpt4_1
```

2) プラグインをインストールしてルートを定義する

```kotlin
fun Application.module() {
    install(Koog) {
        // プロバイダーをプログラムで設定することもできます（下記参照）
    }

    routing {
        route("/ai") {
            post("/chat") {
                val userInput = call.receiveText()
                // 特定のモデルを使用してデフォルトのシングルランエージェントを作成し、実行します
                val output = aiAgent(
                    strategy = reActStrategy(),
                    model = OpenAIModels.Chat.GPT4_1,
                    input = userInput
                )
                call.respond(HttpStatusCode.OK, output)
            }
        }
    }
}
```

注意
- `aiAgent`は具体的なモデル（`LLModel`）を必要とします。ルートごと、使用ごとに選択してください。
- より低レベルなLLMアクセスには、`llm()`（`PromptExecutor`）を直接使用してください。

## ルートからの直接的なLLM利用

```kotlin
post("/llm-chat") {
    val userInput = call.receiveText()

    val messages = llm().execute(
        prompt("chat") {
            system("You are a helpful assistant that clarifies questions")
            user(userInput)
        },
        GoogleModels.Gemini2_5Pro
    )

    // すべてのアシスタントメッセージを単一の文字列に結合します
    val text = messages.joinToString(separator = "") { it.content }
    call.respond(HttpStatusCode.OK, text)
}
```

ストリーミング

```kotlin
get("/stream") {
    val flow = llm().executeStreaming(
        prompt("streaming") { user("Stream this response, please") },
        OpenRouterModels.GPT4o
    )

    // 例: バッファリングして単一のチャンクとして送信
    val sb = StringBuilder()
    flow.collect { chunk -> sb.append(chunk) }
    call.respondText(sb.toString())
}
```

モデレーション

```kotlin
post("/moderated-chat") {
    val userInput = call.receiveText()

    val moderation = llm().moderate(
        prompt("moderation") { user(userInput) },
        OpenAIModels.Moderation.Omni
    )

    if (moderation.isHarmful) {
        call.respond(HttpStatusCode.BadRequest, "Harmful content detected")
        return@post
    }

    val output = aiAgent(
        strategy = reActStrategy(),
        model = OpenAIModels.Chat.GPT4_1,
        input = userInput
    )
    call.respond(HttpStatusCode.OK, output)
}
```

## プログラムによる設定（コード内）

すべてのプロバイダーとエージェントの動作は`install(Koog) {}`を介して設定できます。

```kotlin
install(Koog) {
    llm {
        openAI(apiKey = System.getenv("OPENAI_API_KEY") ?: "") {
            baseUrl = "https://api.openai.com"
            timeouts { // 下記にデフォルト値を示します
                requestTimeout = 15.minutes
                connectTimeout = 60.seconds
                socketTimeout = 15.minutes
            }
        }
        anthropic(apiKey = System.getenv("ANTHROPIC_API_KEY") ?: "")
        google(apiKey = System.getenv("GOOGLE_API_KEY") ?: "")
        openRouter(apiKey = System.getenv("OPENROUTER_API_KEY") ?: "")
        deepSeek(apiKey = System.getenv("DEEPSEEK_API_KEY") ?: "")
        ollama { baseUrl = "http://localhost:11434" }

        // プロバイダーが設定されていない場合にPromptExecutorが使用するオプションのフォールバック
        fallback {
            provider = LLMProvider.OpenAI
            model = OpenAIModels.Chat.GPT4_1
        }
    }

    agentConfig {
        // エージェント用の再利用可能なベースプロンプトを提供
        prompt(name = "agent") {
            system("You are a helpful server‑side agent")
        }

        // 暴走するツール/ループを制限
        maxAgentIterations = 10

        // エージェントがデフォルトで利用できるツールを登録
        registerTools {
            // tool(::yourTool) // 詳細については「Tools Overview」を参照してください
        }

        // エージェント機能をインストール（トレーシングなど）
        // install(OpenTelemetry) { /* ... */ }
    }
}
```

## 設定におけるモデル識別子（フォールバック）

YAML/CONFで`llm.fallback`を設定する場合、以下の識別子形式を使用します。
- OpenAI: `openai.chat.gpt4_1`, `openai.reasoning.o3`, `openai.costoptimized.gpt4_1mini`, `openai.audio.gpt4oaudio`, `openai.moderation.omni`
- Anthropic: `anthropic.sonnet_3_7`, `anthropic.opus_4`, `anthropic.haiku_3_5`
- Google: `google.gemini2_5pro`, `google.gemini2_0flash001`
- OpenRouter: `openrouter.gpt4o`, `openrouter.gpt4`, `openrouter.claude3sonnet`
- DeepSeek: `deepseek.deepseek-chat`, `deepseek.deepseek-reasoner`
- Ollama: `ollama.meta.llama3.2`, `ollama.alibaba.qwq:32b`, `ollama.groq.llama3-grok-tool-use:8b`

注意
- OpenAIの場合、カテゴリ（`chat`、`reasoning`、`costoptimized`、`audio`、`embeddings`、`moderation`）を含める必要があります。
- Ollamaの場合、`ollama.model`と`ollama.<maker>.<model>`の両方がサポートされています。

## MCPツール（JVM専用）

JVMでは、MCPサーバーからエージェントツールレジストリにツールを追加できます。

```kotlin
install(Koog) {
    agentConfig {
        mcp {
            // SSE経由で登録
            sse("https://your-mcp-server.com/sse")

            // またはスポーンされたプロセス経由で登録（stdioトランスポート）
            // process(Runtime.getRuntime().exec("your-mcp-binary ..."))

            // または既存のMCPクライアントインスタンスから
            // client(existingMcpClient)
        }
    }
}
```
## なぜKoog + Ktorなのか？

- サーバーでのKotlinファースト、型安全なエージェント開発
- クリーンでテスト可能なルートコードによる一元化された設定
- ルートごとに適切なモデルを使用するか、直接的なLLM呼び出しの場合は自動的にフォールバックする
- 本番環境対応の機能：ツール、モデレーション、ストリーミング、およびトレーシング