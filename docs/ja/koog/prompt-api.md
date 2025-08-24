# Prompt API

Prompt API は、本番アプリケーションで大規模言語モデル (LLM) と対話するための包括的なツールキットを提供します。これは以下の機能を提供します。

- **Kotlin DSL**: 型安全な構造化プロンプトを作成
- **マルチプロバイダー対応**: OpenAI、Anthropic、Google、その他のLLMプロバイダーをサポート
- **本番環境向け機能**: リトライロジック、エラーハンドリング、タイムアウト設定など
- **マルチモーダル機能**: テキスト、画像、音声、ドキュメントの処理

## アーキテクチャの概要

Prompt API は、主に3つのレイヤーで構成されます。

1.  **LLMクライアント**: 特定のプロバイダー (OpenAI、Anthropicなど) への低レベルインターフェース
2.  **デコレーター (Decorator)**: リトライロジックなどの機能を追加するオプションのラッパー
3.  **プロンプトエグゼキューター (Prompt Executor)**: クライアントのライフサイクルを管理し、使用を簡素化する高レベルの抽象化

## プロンプトの作成

Prompt API は、Kotlin DSL を使用してプロンプトを作成します。以下の種類のメッセージをサポートしています。

- `system`: LLMのコンテキストと指示を設定します。
- `user`: ユーザー入力を表します。
- `assistant`: LLMのレスポンスを表します。

シンプルなプロンプトの例を以下に示します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val prompt = prompt("prompt_name", LLMParams()) {
    // Add a system message to set the context
    system("You are a helpful assistant.")

    // Add a user message
    user("Tell me about Kotlin")

    // You can also add assistant messages for few-shot examples
    assistant("Kotlin is a modern programming language...")

    // Add another user message
    user("What are its key features?")
}
```
<!--- KNIT example-prompt-api-01.kt -->

## プロンプトの実行

特定のLLMでプロンプトを実行するには、次の手順を実行します。

1.  アプリケーションとLLMプロバイダー間の接続を処理する、対応するLLMクライアントを作成します。例：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// Create an OpenAI client
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-02.kt -->

2.  プロンプトとLLMを引数として`execute` メソッドを呼び出します。
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi01.prompt
import ai.koog.agents.example.examplePromptApi02.client
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Execute the prompt
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // You can choose different models
)
```
<!--- KNIT example-prompt-api-03.kt -->

以下のLLMクライアントが利用可能です。

*   [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
*   [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
*   [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
*   [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
*   [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
*   [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (JVM only)

Prompt API を使用するシンプルな例を以下に示します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin

fun main() {
    runBlocking {
        // Set up the OpenAI client with your API key
        val token = System.getenv("OPENAI_API_KEY")
        val client = OpenAILLMClient(token)

        // Create a prompt
        val prompt = prompt("prompt_name", LLMParams()) {
            // Add a system message to set the context
            system("You are a helpful assistant.")

            // Add a user message
            user("Tell me about Kotlin")

            // You can also add assistant messages for few-shot examples
            assistant("Kotlin is a modern programming language...")

            // Add another user message
            user("What are its key features?")
        }

        // Execute the prompt and get the response
        val response = client.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4o)
        println(response)
    }
}
```
<!--- KNIT example-prompt-api-04.kt -->

## リトライ機能

LLMプロバイダーと連携する際、レート制限や一時的なサービス停止といった一時的なエラーに遭遇することがあります。`RetryingLLMClient`デコレーターは、あらゆるLLMクライアントに自動リトライロジックを追加します。

### 基本的な使用方法

既存のクライアントをリトライ機能でラップします:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY")
        val prompt = prompt("test") {
            user("Hello")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Wrap any client with retry capability
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// Now all operations will automatically retry on transient errors
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-05.kt -->

#### リトライ動作の設定

Koog は、いくつかの事前定義されたリトライ設定を提供します:

| 設定           | 最大試行回数 | 初期遅延 | 最大遅延 | ユースケース          |
|--------------|-----------|----------|----------|-------------------|
| `DISABLED`   | 1回 (リトライなし) | -        | -        | 開発/テスト           |
| `CONSERVATIVE` | 3回         | 2秒      | 30秒     | 通常の本番運用        |
| `AGGRESSIVE`   | 5回         | 500ミリ秒 | 20秒     | クリティカルな操作      |
| `PRODUCTION`   | 3回         | 1秒      | 20秒     | 推奨されるデフォルト |

これらを直接使用するか、カスタム設定を作成できます:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// Use predefined configuration
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)

// Or create custom configuration
val customClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig(
        maxAttempts = 5,
        initialDelay = 1.seconds,
        maxDelay = 30.seconds,
        backoffMultiplier = 2.0,
        jitterFactor = 0.2
    )
)
```
<!--- KNIT example-prompt-api-06.kt -->

#### リトライ可能なエラーパターン

デフォルトでは、リトライメカニズムは一般的な一時的エラーを認識します:

-   **HTTPステータスコード**: 429 (レート制限)、500、502、503、504
-   **エラーキーワード**: "rate limit", "timeout", "connection reset", "overloaded"

特定のニーズに合わせてカスタムパターンを定義できます:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),           // 特定のステータスコード
        RetryablePattern.Keyword("quota"),      // エラーメッセージ内のキーワード
        RetryablePattern.Regex(Regex("ERR_\\d+")), // カスタム正規表現パターン
        RetryablePattern.Custom { error ->      // カスタムロジック
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-prompt-api-07.kt -->

#### プロンプトエグゼキューターでのリトライ

プロンプトエグゼキューターを使用する際は、エグゼキューターを作成する前に基盤となるクライアントをラップします:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider

-->
```kotlin
// Single provider executor with retry
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
    RetryConfig.PRODUCTION
)
val executor = SingleLLMPromptExecutor(resilientClient)

// Multi-provider executor with flexible client configuration
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock クライアントには、すでにAWS SDKのリトライ機能が組み込まれています
    LLMProvider.Bedrock to BedrockLLMClient(
        awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID"),
        awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY"),
        awsSessionToken = System.getenv("AWS_SESSION_TOKEN"),
    ))
```
<!--- KNIT example-prompt-api-08.kt -->

#### ストリーミングでのリトライ

ストリーミング操作はオプションでリトライできます (デフォルトでは無効です):

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val baseClient = OpenAILLMClient(System.getenv("OPENAI_API_KEY"))
        val prompt = prompt("test") {
            user("Generate a story")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val config = RetryConfig(
    maxAttempts = 3
)

val client = RetryingLLMClient(baseClient, config)
val stream = client.executeStreaming(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-09.kt -->

> **注**: ストリーミングのリトライは、最初のトークンを受信する前の接続障害にのみ適用されます。ストリーミングが開始されると、コンテンツの整合性を維持するためにエラーはそのまま渡されます。

### タイムアウト設定

すべてのLLMクライアントは、リクエストのハングを防ぐためのタイムアウト設定をサポートしています:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.ConnectionTimeoutConfig
import ai.koog.prompt.executor.clients.openai.OpenAIClientSettings
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient

val apiKey = System.getenv("OPENAI_API_KEY")
-->
```kotlin
val client = OpenAILLMClient(
    apiKey = apiKey,
    settings = OpenAIClientSettings(
        timeoutConfig = ConnectionTimeoutConfig(
            connectTimeoutMillis = 5000,    // 接続確立まで5秒
            requestTimeoutMillis = 60000    // リクエスト全体で60秒
        )
    )
)
```
<!--- KNIT example-prompt-api-10.kt -->

### エラーハンドリングのベストプラクティス

本番環境でLLMを操作する際は:

1.  予期せぬエラーを処理するために、**常にtry-catchブロックで操作をラップしてください**
2.  デバッグのために、**コンテキスト情報とともにエラーをログに出力してください**
3.  クリティカルな操作には、**フォールバック戦略を実装してください**
4.  システムの問題を特定するために、**リトライパターンを監視してください**

包括的なエラーハンドリングの例:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory

fun main() {
    runBlocking {
        val logger = LoggerFactory.getLogger("Example")
        val resilientClient = RetryingLLMClient(
            OpenAILLMClient(System.getenv("OPENAI_API_KEY"))
        )
        val prompt = prompt("test") { user("Hello") }
        val model = OpenAIModels.Chat.GPT4o
        
        fun processResponse(response: Any) { /* ... */ }
        fun scheduleRetryLater() { /* ... */ }
        fun notifyAdministrator() { /* ... */ }
        fun useDefaultResponse() { /* ... */ }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
try {
    val response = resilientClient.execute(prompt, model)
    processResponse(response)
} catch (e: Exception) {
    logger.error("LLM operation failed", e)
    
    when {
        e.message?.contains("rate limit") == true -> {
            // レート制限を特別に処理
            scheduleRetryLater()
        }
        e.message?.contains("invalid api key") == true -> {
            // 認証エラーを処理
            notifyAdministrator()
        }
        else -> {
            // 代替ソリューションにフォールバック
            useDefaultResponse()
        }
    }
}
```
<!--- KNIT example-prompt-api-11.kt -->

## マルチモーダル入力

プロンプト内でテキストメッセージを提供するだけでなく、Koogでは`user`メッセージとともに画像、音声、動画、ファイルをLLMに送信することもできます。標準的なテキストのみのプロンプトと同様に、プロンプト構築のためのDSL構造を使用してメディアをプロンプトに追加します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("multimodal_input") {
    system("You are a helpful assistant.")

    user {
        +"Describe these images"

        attachments {
            image("https://example.com/test.png")
            image(Path("/User/koog/image.png"))
        }
    }
}
```
<!--- KNIT example-prompt-api-12.kt -->

### テキストプロンプトコンテンツ

さまざまなアタッチメントタイプをサポートし、プロンプト内のテキスト入力とファイル入力を明確に区別するために、テキストメッセージはユーザープロンプト内の専用の`content`パラメータに配置します。ファイル入力を追加するには、`attachments`パラメータ内のリストとして提供します。

テキストメッセージとアタッチメントのリストを含むユーザーメッセージの一般的な形式は以下のとおりです。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user(
    content = "This is the user message",
    attachments = listOf(
        // Add attachments
    )
)
```
<!--- KNIT example-prompt-api-13.kt -->

### ファイルアタッチメント

アタッチメントを含めるには、以下の形式に従って`attachments`パラメータにファイルを提供します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.message.Attachment
import ai.koog.prompt.message.AttachmentContent

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user(
    content = "Describe this image",
    attachments = listOf(
        Attachment.Image(
            content = AttachmentContent.URL("https://example.com/capture.png"),
            format = "png",
            mimeType = "image/png",
            fileName = "capture.png"
        )
    )
)
```
<!--- KNIT example-prompt-api-14.kt -->

`attachments`パラメータはファイル入力のリストを受け取り、各項目は以下のクラスのいずれかのインスタンスです。

-   `Attachment.Image`: `jpg`や`png`ファイルなどの画像アタッチメント。
-   `Attachment.Audio`: `mp3`や`wav`ファイルなどの音声アタッチメント。
-   `Attachment.Video`: `mpg`や`avi`ファイルなどの動画アタッチメント。
-   `Attachment.File`: `pdf`や`txt`ファイルなどのファイルアタッチメント。

上記の各クラスは以下のパラメータを受け取ります。

| 名前       | データ型                               | 必須                       | 説明                                                                                                 |
|------------|-----------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | Yes                        | 提供されるファイルコンテンツのソースです。詳細については、[AttachmentContent](#attachmentcontent)を参照してください。 |
| `format`   | String                                  | Yes                        | 提供されるファイルの形式です。例: `png`。                                                        |
| `mimeType` | String                                  | Only for `Attachment.File` | 提供されるファイルのMIMEタイプです。例: `image/png`。                                               |
| `fileName` | String                                  | No                         | 拡張子を含む提供されるファイルの名前です。例: `screenshot.png`。                       |

#### AttachmentContent

`AttachmentContent`は、LLMへの入力として提供されるコンテンツのタイプとソースを定義します。以下のクラスがサポートされています。

`AttachmentContent.URL(val url: String)`

指定されたURLからファイルコンテンツを提供します。以下のパラメータを取ります。

| 名前   | データ型 | 必須 | 説明                      |
|--------|-----------|----------|----------------------------------|
| `url`  | String    | Yes      | 提供されるコンテンツのURLです。 |

`AttachmentContent.Binary.Bytes(val data: ByteArray)`

バイト配列としてファイルコンテンツを提供します。以下のパラメータを取ります。

| 名前   | データ型 | 必須 | 説明                                |
|--------|-----------|----------|--------------------------------------------|
| `data` | ByteArray | Yes      | バイト配列として提供されるファイルコンテンツです。 |

`AttachmentContent.Binary.Base64(val base64: String)`

Base64文字列としてエンコードされたファイルコンテンツを提供します。以下のパラメータを取ります。

| 名前     | データ型 | 必須 | 説明                             |
|----------|-----------|----------|-----------------------------------------|
| `base64` | String    | Yes      | ファイルデータを含むBase64文字列です。 |

`AttachmentContent.PlainText(val text: String)`

_アタッチメントタイプが`Attachment.File`の場合にのみ適用されます_。プレーンテキストファイル（`text/plain`MIMEタイプなど）からコンテンツを提供します。以下のパラメータを取ります。

| 名前   | データ型 | 必須 | 説明              |
|--------|-----------|----------|--------------------------|
| `text` | String    | Yes      | ファイルのコンテンツです。 |

### 混在するアタッチメントコンテンツ

異なるタイプのアタッチメントを個別のプロンプトやメッセージで提供するだけでなく、以下に示すように、単一の`user`メッセージで複数かつ混在するタイプのアタッチメントを提供することもできます。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("You are a helpful assistant.")

    user {
        +"Compare the image with the document content."

        attachments {
            image(Path("/User/koog/page.png"))
            binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        }
    }
}
```
<!--- KNIT example-prompt-api-15.kt -->

## プロンプトエグゼキューター

LLMクライアントがプロバイダーへの直接アクセスを提供するのに対し、**プロンプトエグゼキューター**は、一般的なユースケースを簡素化し、クライアントのライフサイクル管理を処理する、より高レベルの抽象化を提供します。これらは、次のような場合に理想的です:

-   クライアント設定を管理せずに迅速なプロトタイプ作成を行いたい場合
-   統一されたインターフェースを通じて複数のプロバイダーと連携したい場合
-   大規模なアプリケーションでの依存性注入 (Dependency Injection) を簡素化したい場合
-   プロバイダー固有の詳細を抽象化したい場合

### エグゼキューターの種類

Koog フレームワークはいくつかのプロンプトエグゼキューターを提供します。

-   **単一プロバイダーエグゼキューター**:
    -   `simpleOpenAIExecutor`: OpenAIモデルでプロンプトを実行するため。
    -   `simpleAnthropicExecutor`: Anthropicモデルでプロンプトを実行するため。
    -   `simpleGoogleExecutor`: Googleモデルでプロンプトを実行するため。
    -   `simpleOpenRouterExecutor`: OpenRouterでプロンプトを実行するため。
    -   `simpleOllamaExecutor`: Ollamaでプロンプトを実行するため。

-   **マルチプロバイダーエグゼキューター**:
    -   `DefaultMultiLLMPromptExecutor`: 複数のLLMプロバイダーを操作するため

### 単一プロバイダーエグゼキューターの作成

特定のLLMプロバイダー向けのプロンプトエグゼキューターを作成するには、対応する関数を使用します。
例えば、OpenAIプロンプトエグゼキューターを作成するには、`simpleOpenAIExecutor` 関数を呼び出し、OpenAIサービスでの認証に必要なAPIキーを提供する必要があります。

1.  プロンプトエグゼキューターの作成:
<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
const val apiToken = "YOUR_API_TOKEN"
-->
```kotlin
// Create an OpenAI executor
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
<!--- KNIT example-prompt-api-16.kt -->

2.  特定のLLMでプロンプトを実行:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi12.prompt
import ai.koog.agents.example.examplePromptApi16.promptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Execute a prompt
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
).single()
```
<!--- KNIT example-prompt-api-17.kt -->

### マルチプロバイダーエグゼキューターの作成

複数のLLMプロバイダーを操作するプロンプトエグゼキューターを作成するには、次の手順を実行します。

1.  必要なLLMプロバイダーのクライアントを、対応するAPIキーを使用して構成します。例：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
<!--- KNIT example-prompt-api-18.kt -->

2.  構成されたクライアントを`DefaultMultiLLMPromptExecutor` クラスのコンストラクタに渡し、複数のLLMプロバイダーを持つプロンプトエグゼキューターを作成します。
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi18.anthropicClient
import ai.koog.agents.example.examplePromptApi18.googleClient
import ai.koog.agents.example.examplePromptApi18.openAIClient
import ai.koog.prompt.executor.llms.all.DefaultMultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-api-19.kt -->

3.  特定のLLMでプロンプトを実行:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi12.prompt
import ai.koog.agents.example.examplePromptApi19.multiExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val response = multiExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
).single()
```
<!--- KNIT example-prompt-api-20.kt -->