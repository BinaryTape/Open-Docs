# 提示 API

提示 API 讓您可以使用 Kotlin DSL 建立結構良好的提示，對不同的 LLM 供應商執行這些提示，並以不同格式處理回應。

## 建立提示

提示 API 使用 Kotlin DSL 建立提示。它支援以下類型的訊息：

- `system`: 設定 LLM 的上下文和指令。
- `user`: 代表使用者輸入。
- `assistant`: 代表 LLM 回應。

以下是一個簡單的提示範例：

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

## 執行提示

若要使用特定的 LLM 執行提示，您需要執行以下操作：

1. 建立一個對應的 LLM 用戶端，用於處理應用程式與 LLM 供應商之間的連線。例如：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// Create an OpenAI client
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-02.kt -->

2. 呼叫 `execute` 方法，並以提示和 LLM 作為引數。
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

以下 LLM 用戶端可用：

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (僅限 JVM)

以下是一個使用提示 API 的簡單範例：

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

## 多模態輸入

除了在提示中提供文字訊息外，Koog 還允許您在 `user` 訊息中向 LLM 傳送圖像、音訊、視訊和檔案。與標準的純文字提示一樣，您也可以使用提示建構的 DSL 結構將媒體新增至提示中。

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

### 文字提示內容

為了支援各種附件類型，並在提示中明確區分文字和檔案輸入，您將文字訊息放入使用者提示中專用的 `content` 參數中。若要新增檔案輸入，請將其作為列表提供給 `attachments` 參數。

包含文字訊息和附件列表的使用者訊息的一般格式如下：

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

### 檔案附件

若要包含附件，請在 `attachments` 參數中提供檔案，格式如下：

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

`attachments` 參數接受檔案輸入的列表，其中每個項目都是以下類別之一的實例：

- `Attachment.Image`: 圖像附件，例如 `jpg` 或 `png` 檔案。
- `Attachment.Audio`: 音訊附件，例如 `mp3` 或 `wav` 檔案。
- `Attachment.Video`: 視訊附件，例如 `mpg` 或 `avi` 檔案。
- `Attachment.File`: 檔案附件，例如 `pdf` 或 `txt` 檔案。

上述每個類別都接受以下參數：

| 名稱       | 資料類型                               | 必填                   | 說明                                                                                                 |
|------------|-----------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | 是                        | 提供的檔案內容來源。有關更多資訊，請參閱 [AttachmentContent](#attachmentcontent)。 |
| `format`   | String                                  | 是                        | 提供的檔案格式。例如，`png`。                                                        |
| `mimeType` | String                                  | 僅限 `Attachment.File` | 提供的檔案 MIME 類型。例如，`image/png`。                                               |
| `fileName` | String                                  | 否                         | 提供的檔案名稱，包括副檔名。例如，`screenshot.png`。                       |

#### AttachmentContent

`AttachmentContent` 定義了作為 LLM 輸入提供的內容的類型和來源。支援以下類別：

`AttachmentContent.URL(val url: String)`

從指定的 URL 提供檔案內容。接受以下參數：

| 名稱   | 資料類型 | 必填 | 說明                      |
|--------|-----------|----------|----------------------------------|
| `url`  | String    | 是      | 提供的內容 URL。 |

`AttachmentContent.Binary.Bytes(val data: ByteArray)`

以位元組陣列形式提供檔案內容。接受以下參數：

| 名稱   | 資料類型 | 必填 | 說明                                |
|--------|-----------|----------|--------------------------------------------|
| `data` | ByteArray | 是      | 以位元組陣列形式提供的檔案內容。 |

`AttachmentContent.Binary.Base64(val base64: String)`

提供編碼為 Base64 字串的檔案內容。接受以下參數：

| 名稱     | 資料類型 | 必填 | 說明                             |
|----------|-----------|----------|-----------------------------------------|
| `base64` | String    | 是      | 包含檔案資料的 Base64 字串。 |

`AttachmentContent.PlainText(val text: String)`

_僅適用於附件類型為 `Attachment.File`_。從純文字檔案（例如 `text/plain` MIME 類型）提供內容。接受以下參數：

| 名稱   | 資料類型 | 必填 | 說明              |
|--------|-----------|----------|--------------------------|
| `text` | String    | 是      | 檔案內容。 |

### 混合附件內容

除了在單獨的提示或訊息中提供不同類型的附件外，您還可以在單一 `user` 訊息中提供多種和混合類型的附件，如下所示：

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

## 提示執行器

提示執行器提供一種更高級的方式來使用 LLM，處理用戶端建立和管理的細節。

您可以使用提示執行器來管理和執行提示。
您可以根據您計畫使用的 LLM 供應商選擇提示執行器，或者使用其中一個可用的 LLM 用戶端建立自訂提示執行器。

Koog 框架提供多種提示執行器：

- **單一供應商執行器**：
    - `simpleOpenAIExecutor`：用於執行 OpenAI 模型的提示。
    - `simpleAnthropicExecutor`：用於執行 Anthropic 模型的提示。
    - `simpleGoogleExecutor`：用於執行 Google 模型的提示。
    - `simpleOpenRouterExecutor`：用於執行 OpenRouter 的提示。
    - `simpleOllamaExecutor`：用於執行 Ollama 的提示。

- **多供應商執行器**：
    - `DefaultMultiLLMPromptExecutor`：用於處理多個 LLM 供應商

### 建立單一供應商執行器

若要為特定的 LLM 供應商建立提示執行器，請使用對應的函數。
例如，若要建立 OpenAI 提示執行器，您需要呼叫 `simpleOpenAIExecutor` 函數，並提供與 OpenAI 服務驗證所需的 API 金鑰：

1. 建立提示執行器：
<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
const val apiToken = "YOUR_API_TOKEN"
-->
```kotlin
// Create an OpenAI executor
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
<!--- KNIT example-prompt-api-09.kt -->

2. 使用特定的 LLM 執行提示：
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

### 建立多供應商執行器

若要建立可與多個 LLM 供應商協同運作的提示執行器，請執行以下操作：

1. 配置所需 LLM 供應商的用戶端，並提供對應的 API 金鑰。例如：
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

2. 將已配置的用戶端傳遞給 `DefaultMultiLLMPromptExecutor` 類別建構函式，以建立一個具有多個 LLM 供應商的提示執行器：
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

3. 使用特定的 LLM 執行提示：
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