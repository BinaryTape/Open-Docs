# Prompt API

Prompt API を使用すると、Kotlin DSL で適切に構造化されたプロンプトを作成し、さまざまなLLMプロバイダーに対してそれらを実行し、さまざまな形式でレスポンスを処理できます。

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

1. アプリケーションとLLMプロバイダー間の接続を処理する、対応するLLMクライアントを作成します。例：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// Create an OpenAI client
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-02.kt -->

2. プロンプトとLLMを引数として`execute` メソッドを呼び出します。
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

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (JVM only)

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
<!--- KNIT example-prompt-api-05.kt -->

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
<!--- KNIT example-prompt-api-06.kt -->

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
<!--- KNIT example-prompt-api-07.kt -->

`attachments`パラメータはファイル入力のリストを受け取り、各項目は以下のクラスのいずれかのインスタンスです。

- `Attachment.Image`: `jpg`や`png`ファイルなどの画像アタッチメント。
- `Attachment.Audio`: `mp3`や`wav`ファイルなどの音声アタッチメント。
- `Attachment.Video`: `mpg`や`avi`ファイルなどの動画アタッチメント。
- `Attachment.File`: `pdf`や`txt`ファイルなどのファイルアタッチメント。

上記の各クラスは以下のパラメータを受け取ります。

| Name       | Data type                               | Required                   | Description                                                                                                 |
|------------|-----------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | Yes                        | 提供されるファイルコンテンツのソースです。詳細については、[AttachmentContent](#attachmentcontent)を参照してください。 |
| `format`   | String                                  | Yes                        | 提供されるファイルの形式です。例: `png`。                                                        |
| `mimeType` | String                                  | Only for `Attachment.File` | 提供されるファイルのMIMEタイプです。例: `image/png`。                                               |
| `fileName` | String                                  | No                         | 拡張子を含む提供されるファイルの名前です。例: `screenshot.png`。                       |

#### AttachmentContent

`AttachmentContent`は、LLMへの入力として提供されるコンテンツのタイプとソースを定義します。以下のクラスがサポートされています。

`AttachmentContent.URL(val url: String)`

指定されたURLからファイルコンテンツを提供します。以下のパラメータを取ります。

| Name   | Data type | Required | Description                      |
|--------|-----------|----------|----------------------------------|
| `url`  | String    | Yes      | 提供されるコンテンツのURLです。 |

`AttachmentContent.Binary.Bytes(val data: ByteArray)`

バイト配列としてファイルコンテンツを提供します。以下のパラメータを取ります。

| Name   | Data type | Required | Description                                |
|--------|-----------|----------|--------------------------------------------|
| `data` | ByteArray | Yes      | バイト配列として提供されるファイルコンテンツです。 |

`AttachmentContent.Binary.Base64(val base64: String)`

Base64文字列としてエンコードされたファイルコンテンツを提供します。以下のパラメータを取ります。

| Name     | Data type | Required | Description                             |
|----------|-----------|----------|-----------------------------------------|
| `base64` | String    | Yes      | ファイルデータを含むBase64文字列です。 |

`AttachmentContent.PlainText(val text: String)`

_アタッチメントタイプが`Attachment.File`の場合にのみ適用されます_。プレーンテキストファイル（`text/plain`MIMEタイプなど）からコンテンツを提供します。以下のパラメータを取ります。

| Name   | Data type | Required | Description              |
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
<!--- KNIT example-prompt-api-08.kt -->

## プロンプトエグゼキューター

プロンプトエグゼキューターは、LLMを操作するためのより高レベルな方法を提供し、クライアントの作成と管理の詳細を処理します。

プロンプトエグゼキューターを使用してプロンプトを管理し、実行できます。
使用する予定のLLMプロバイダーに基づいてプロンプトエグゼキューターを選択するか、利用可能なLLMクライアントのいずれかを使用してカスタムプロンプトエグゼキューターを作成できます。

Koogフレームワークはいくつかのプロンプトエグゼキューターを提供します。

- **単一プロバイダーエグゼキューター**:
    - `simpleOpenAIExecutor`: OpenAIモデルでプロンプトを実行するため。
    - `simpleAnthropicExecutor`: Anthropicモデルでプロンプトを実行するため。
    - `simpleGoogleExecutor`: Googleモデルでプロンプトを実行するため。
    - `simpleOpenRouterExecutor`: OpenRouterでプロンプトを実行するため。
    - `simpleOllamaExecutor`: Ollamaでプロンプトを実行するため。

- **マルチプロバイダーエグゼキューター**:
    - `DefaultMultiLLMPromptExecutor`: 複数のLLMプロバイダーを操作するため

### 単一プロバイダーエグゼキューターの作成

特定のLLMプロバイダー向けのプロンプトエグゼキューターを作成するには、対応する関数を使用します。
例えば、OpenAIプロンプトエグゼキューターを作成するには、`simpleOpenAIExecutor` 関数を呼び出し、OpenAIサービスでの認証に必要なAPIキーを提供する必要があります。

1. プロンプトエグゼキューターの作成:
<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
const val apiToken = "YOUR_API_TOKEN"
-->
```kotlin
// Create an OpenAI executor
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
<!--- KNIT example-prompt-api-09.kt -->

2. 特定のLLMでプロンプトを実行:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi08.prompt
import ai.koog.agents.example.examplePromptApi09.promptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.model.PromptExecutorExt.execute
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
)
```
<!--- KNIT example-prompt-api-10.kt -->

### マルチプロバイダーエグゼキューターの作成

複数のLLMプロバイダーを操作するプロンプトエグゼキューターを作成するには、次の手順を実行します。

1. 必要なLLMプロバイダーのクライアントを、対応するAPIキーを使用して構成します。例：
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
<!--- KNIT example-prompt-api-11.kt -->

2. 構成されたクライアントを`DefaultMultiLLMPromptExecutor` クラスのコンストラクタに渡し、複数のLLMプロバイダーを持つプロンプトエグゼキューターを作成します。
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi11.anthropicClient
import ai.koog.agents.example.examplePromptApi11.googleClient
import ai.koog.agents.example.examplePromptApi11.openAIClient
import ai.koog.prompt.executor.llms.all.DefaultMultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-api-12.kt -->

3. 特定のLLMでプロンプトを実行:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi08.prompt
import ai.koog.agents.example.examplePromptApi12.multiExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.model.PromptExecutorExt.execute
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
)
```
<!--- KNIT example-prompt-api-13.kt -->