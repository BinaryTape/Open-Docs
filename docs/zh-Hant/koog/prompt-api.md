# 提示 API

提示 API 提供了一套全面的工具包，用於在生產環境應用程式中與大型語言模型 (LLMs) 互動。它提供：

- 具有型別安全的 **Kotlin DSL**，用於建立結構化提示。
- **多供應商支援**，支援 OpenAI、Anthropic、Google 及其他 LLM 供應商。
- **生產功能**，例如重試邏輯、錯誤處理和逾時設定。
- **多模態功能**，用於處理文字、圖像、音訊和文件。

## 架構概覽

提示 API 由三個主要層組成：

- **LLM 用戶端**：針對特定供應商 (OpenAI、Anthropic 等) 的低階介面。
- **裝飾器**：可選的包裝器，用於新增重試邏輯等功能。
- **提示執行器**：管理用戶端生命週期並簡化使用方式的高階抽象層。

## 建立提示

提示 API 使用 Kotlin DSL 建立提示。它支援以下類型的訊息：

- `system`：設定 LLM 的上下文和指令。
- `user`：代表使用者輸入。
- `assistant`：代表 LLM 回應。

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

## 多模態輸入

除了在提示中提供文字訊息外，Koog 還允許您在 `user` 訊息中向 LLMs 傳送圖像、音訊、視訊和檔案。
與標準的純文字提示一樣，您也可以使用提示建構的 DSL 結構將媒體新增至提示中。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("multimodal_input") {
    system("You are a helpful assistant.")

    user {
        +"Describe these images"
        
        image("https://example.com/test.png")
        image(Path("/User/koog/image.png"))
    }
}
```
<!--- KNIT example-prompt-api-02.kt -->

### 文字提示內容
包含文字訊息和附件列表的使用者訊息的一般格式如下：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user {
    +"This is the text part of the user message"
    // Add attachment
    image("https://example.com/capture.png")
    file("https://example.com/data.pdf", "application/pdf")
}
```
<!--- KNIT example-prompt-api-03.kt -->

### 檔案附件

若要包含附件，請提供檔案，其格式如下：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.message.AttachmentContent
import ai.koog.prompt.message.ContentPart

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user {
    +"Describe this image"
    image(
        ContentPart.Image(
            content = AttachmentContent.URL("https://example.com/capture.png"),
            format = "png",
            mimeType = "image/png",
            fileName = "capture.png"
        )
    )
}
```
<!--- KNIT example-prompt-api-04.kt -->

`attachments` 參數接受檔案輸入的列表，其中每個項目都是以下類別之一的實例：

- `Attachment.Image`：圖像附件，例如 `jpg` 或 `png` 檔案。
- `Attachment.Audio`：音訊附件，例如 `mp3` 或 `wav` 檔案。
- `Attachment.Video`：視訊附件，例如 `mpg` 或 `avi` 檔案。
- `Attachment.File`：檔案附件，例如 `pdf` 或 `txt` 檔案。

上述每個類別都接受以下參數：

| 名稱       | 資料類型                               | 必填                   | 說明                                                                                                 |
|------------|-----------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | 是                        | 提供的檔案內容來源。有關更多資訊，請參閱 [AttachmentContent](#attachmentcontent)。 |
| `format`   | String                                  | 是                        | 提供的檔案格式。例如，`png`。                                                        |
| `mimeType` | String                                  | 僅限 `Attachment.File` | 提供的檔案 MIME 類型。例如，`image/png`。                                               |
| `fileName` | String                                  | 否                         | 提供的檔案名稱，包括副檔名。例如，`screenshot.png`。                       |

有關更多詳細資訊，請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment/index.html)。

#### AttachmentContent

`AttachmentContent` 定義了作為 LLM 輸入提供的內容的類型和來源。支援以下類別：

* `AttachmentContent.URL(val url: String)`

  從指定的 URL 提供檔案內容。接受以下參數：

  | 名稱   | 資料類型 | 必填 | 說明                      |
  |--------|-----------|----------|----------------------------------|
  | `url`  | String    | 是      | 提供的內容 URL。 |

  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)。

* `AttachmentContent.Binary.Bytes(val data: ByteArray)`

  以位元組陣列形式提供檔案內容。接受以下參數：

  | 名稱   | 資料類型 | 必填 | 說明                                |
  |--------|-----------|----------|--------------------------------------------|
  | `data` | ByteArray | 是      | 以位元組陣列形式提供的檔案內容。 |

  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

* `AttachmentContent.Binary.Base64(val base64: String)`

  提供編碼為 Base64 字串的檔案內容。接受以下參數：

  | 名稱     | 資料類型 | 必填 | 說明                             |
  |----------|-----------|----------|-----------------------------------------|
  | `base64` | String    | 是      | 包含檔案資料的 Base64 字串。 |

  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

* `AttachmentContent.PlainText(val text: String)`

!!! tip
    僅適用於附件類型為 `Attachment.File`。

  從純文字檔案（例如 `text/plain` MIME 類型）提供內容。接受以下參數：

  | 名稱   | 資料類型 | 必填 | 說明              |
  |--------|-----------|----------|--------------------------|
  | `text` | String    | 是      | 檔案內容。 |

  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)。

### 混合附件內容

除了在單獨的提示或訊息中提供不同類型的附件外，您還可以在單一 `user` 訊息中提供多種和混合類型的附件：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("You are a helpful assistant.")

    user {
        +"Compare the image with the document content."
        image(Path("/User/koog/page.png"))
        binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        +"Structure the result as a table"
    }
}
```
<!--- KNIT example-prompt-api-05.kt -->

## 在 LLM 用戶端和提示執行器之間做選擇

使用提示 API 時，您可以透過 LLM 用戶端或提示執行器來執行提示。
若要在用戶端和執行器之間做選擇，請考慮以下因素：

- 如果您使用單一 LLM 供應商且不需要進階生命週期管理，請直接使用 LLM 用戶端。若要了解更多資訊，請參閱 [使用 LLM 用戶端執行提示](#running-prompts-with-llm-clients)。
- 如果您需要更進階的抽象層來管理 LLMs 及其生命週期，或者您希望透過跨多個供應商的一致 API 執行提示並在它們之間動態切換，請使用提示執行器。
  若要了解更多資訊，請參閱 [使用提示執行器執行提示](#running-prompts-with-prompt-executors)。

!!!note
    LLM 用戶端和提示執行器都允許您串流回應、產生多個選擇並執行內容審核。
    有關更多資訊，請參閱特定用戶端或執行器的 [API 參考](https://api.koog.ai/index.html)。

## 使用 LLM 用戶端執行提示

如果您使用單一 LLM 供應商且不需要進階生命週期管理，則可以使用 LLM 用戶端來執行提示。
Koog 提供以下 LLM 用戶端：

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (僅限 JVM)

若要使用 LLM 用戶端執行提示，請執行以下操作：

1) 建立 LLM 用戶端，用於處理應用程式與 LLM 供應商之間的連線。例如：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// Create an OpenAI client
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-06.kt -->

2) 呼叫 `execute` 方法，並以提示和 LLM 作為引數。

<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi01.prompt
import ai.koog.agents.example.examplePromptApi06.client
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
<!--- KNIT example-prompt-api-07.kt -->

以下是一個使用 OpenAI 用戶端執行提示的範例：

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
<!--- KNIT example-prompt-api-08.kt -->

!!!note
    LLM 用戶端允許您串流回應、產生多個選擇並執行內容審核。
    有關更多資訊，請參閱特定用戶端的 API 參考。
    若要深入了解內容審核，請參閱 [內容審核](content-moderation.md)。

## 使用提示執行器執行提示

雖然 LLM 用戶端提供對供應商的直接存取，但提示執行器提供更高層次的抽象，可簡化常見的使用案例並處理用戶端生命週期管理。
當您希望達成以下目標時，它們是理想的選擇：

- 快速建立原型，而無需管理用戶端配置。
- 透過統一介面與多個供應商協同運作。
- 在大型應用程式中簡化依賴注入。
- 抽象化供應商特定細節。

### 執行器類型

Koog 提供兩種主要的提示執行器：

| <div style="width:175px">名稱</div> | 說明                                                                                                                                                                                                                             |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html)       | 包裝單一供應商的單一 LLM 用戶端。如果您的代理程式僅需要在單一 LLM 供應商內的不同模型之間切換，請使用此執行器。                                                                            |
| [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html)        | 透過供應商路由到多個 LLM 用戶端，並為每個供應商提供可選的備用方案，以在請求的供應商不可用時使用。如果您的代理程式需要在不同供應商的模型之間切換，請使用此執行器。 |

這些是 [`PromtExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html) 介面的實作，用於使用 LLMs 執行提示。

### 建立單一供應商執行器

若要為特定的 LLM 供應商建立提示執行器，請執行以下操作：

1) 設定特定供應商的 LLM 用戶端，並提供對應的 API 金鑰：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
```
<!--- KNIT example-prompt-api-09.kt -->
2) 使用 [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) 建立提示執行器：
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi09.openAIClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val promptExecutor = SingleLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-api-10.kt -->

### 建立多供應商執行器

若要建立可與多個 LLM 供應商協同運作的提示執行器，請執行以下操作：

1) 設定所需 LLM 供應商的用戶端，並提供對應的 API 金鑰：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val ollamaClient = OllamaClient()
```
<!--- KNIT example-prompt-api-11.kt -->

2) 將已設定的用戶端傳遞給 `MultiLLMPromptExecutor` 類別建構函式，以建立一個具有多個 LLM 供應商的提示執行器：
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi11.openAIClient
import ai.koog.agents.example.examplePromptApi11.ollamaClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider
-->
```kotlin
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Ollama to ollamaClient
)
```
<!--- KNIT example-prompt-api-12.kt -->

### 預定義提示執行器

為了更快速地設定，Koog 為常見供應商提供了以下即用型執行器實作：

- 單一供應商執行器，返回設定有特定 LLM 用戶端的 `SingleLLMPromptExecutor`：
    - `simpleOpenAIExecutor` 用於使用 OpenAI 模型執行提示。
    - `simpleAzureOpenAIExecutor` 用於使用 Azure OpenAI Service 執行提示。
    - `simpleAnthropicExecutor` 用於使用 Anthropic 模型執行提示。
    - `simpleGoogleAIExecutor` 用於使用 Google 模型執行提示。
    - `simpleOpenRouterExecutor` 用於使用 OpenRouter 執行提示。
    - `simpleOllamaAIExecutor` 用於使用 Ollama 執行提示。

- 多供應商執行器：
    - `DefaultMultiLLMPromptExecutor` 是 `MultiLLMPromptExecutor` 的實作，支援 OpenAI、Anthropic 和 Google 供應商。

以下是一個建立預定義單一和多供應商執行器的範例：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.all.DefaultMultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an OpenAI executor
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// Create a DefaultMultiLLMPromptExecutor with OpenAI, Anthropic, and Google LLM clients
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-api-13.kt -->

### 執行提示

提示執行器提供了使用各種功能執行提示的方法，例如串流、多重選擇產生和內容審核。

以下是一個如何使用 `execute` 方法執行帶有特定 LLM 的提示的範例：

<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi04.prompt
import ai.koog.agents.example.examplePromptApi10.promptExecutor
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
)
```
<!--- KNIT example-prompt-api-14.kt -->

這將使用 `GPT4o` 模型執行提示並返回回應。

!!!note
    提示執行器允許您串流回應、產生多個選擇並執行內容審核。
    有關更多資訊，請參閱特定執行器的 API 參考。
    若要深入了解內容審核，請參閱 [內容審核](content-moderation.md)。

## 快取提示執行器

對於重複的請求，您可以快取 LLM 回應以最佳化效能並降低成本。
Koog 提供了 `CachedPromptExecutor`，它是 `PromptExecutor` 的一個包裝器，可新增快取功能。
它允許您儲存先前執行提示的回應，並在再次執行相同提示時擷取它們。

若要建立快取提示執行器，請執行以下操作：

1) 建立您要快取回應的提示執行器：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val client = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = SingleLLMPromptExecutor(client)
```
<!--- KNIT example-prompt-api-15.kt -->

2) 使用所需的快取建立 `CachedPromptExecutor` 實例，並提供建立的提示執行器：
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi15.promptExecutor
import ai.koog.prompt.cache.files.FilePromptCache
import ai.koog.prompt.executor.cached.CachedPromptExecutor
import kotlin.io.path.Path
import kotlinx.coroutines.runBlocking
--> 
```kotlin
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("/cache_directory")),
    nested = promptExecutor
)
```
<!--- KNIT example-prompt-api-16.kt -->

3) 使用所需的提示和模型執行快取提示執行器：
<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.agents.example.examplePromptApi16.cachedExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val prompt = prompt("test") {
            user("Hello")
        }

-->
<!--- SUFFIX
    }
}
--> 
```kotlin
val response = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-17.kt -->

現在，您可以多次使用相同的模型執行相同的提示，回應將從快取中擷取。

!!!note
    * 如果您使用快取提示執行器呼叫 `executeStreaming()`，它會以單一區塊產生回應。
    * 如果您使用快取提示執行器呼叫 `moderate()`，它會將請求轉發給巢狀提示執行器，並且不使用快取。
    * 不支援快取多重選擇回應。

## 重試功能

在使用 LLM 供應商時，您可能會遇到暫時性錯誤，例如速率限制或暫時性服務不可用。`RetryingLLMClient` 裝飾器會為任何 LLM 用戶端新增自動重試邏輯。

### 基本用法

將任何現有的用戶端包裝上重試功能：

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
<!--- KNIT example-prompt-api-18.kt -->

#### 配置重試行為

Koog 提供多種預設重試配置：

| 配置         | 最大嘗試次數 | 初始延遲 | 最大延遲 | 使用案例      |
|--------------|-------------|---------------|-----------|---------------|
| `DISABLED`   | 1 (不重試) | -             | -         | 開發與測試    |
| `CONSERVATIVE` | 3           | 2s            | 30s       | 正常生產用途  |
| `AGGRESSIVE` | 5           | 500ms         | 20s       | 關鍵操作      |
| `PRODUCTION` | 3           | 1s            | 20s       | 推薦預設值    |

您可以直接使用它們，或建立自訂配置：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// Use the predefined configuration
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)

// Or create a custom configuration
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
<!--- KNIT example-prompt-api-19.kt -->

#### 可重試錯誤模式

預設情況下，重試機制會識別常見的暫時性錯誤：

* **HTTP 狀態碼**：
    * `429`：速率限制
    * `500`：內部伺服器錯誤
    * `502`：錯誤閘道
    * `503`：服務不可用
    * `504`：閘道逾時
    * `529`：Anthropic 超載

* **錯誤關鍵字**：
    * rate limit (速率限制)
    * too many requests (請求過多)
    * request timeout (請求逾時)
    * connection timeout (連線逾時)
    * read timeout (讀取逾時)
    * write timeout (寫入逾時)
    * connection reset by peer (對等連線重設)
    * connection refused (連線遭拒)
    * temporarily unavailable (暫時不可用)
    * service unavailable (服務不可用)

您可以針對您的特定需求定義自訂模式：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),           // 特定狀態碼
        RetryablePattern.Keyword("quota"),      // 錯誤訊息中的關鍵字
        RetryablePattern.Regex(Regex("ERR_\\d+")), // 自訂正規表示式模式
        RetryablePattern.Custom { error ->      // 自訂邏輯
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-prompt-api-20.kt -->

#### 搭配提示執行器使用重試

使用提示執行器時，請在建立執行器之前，使用重試機制包裝底層 LLM 用戶端：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider

-->
```kotlin
// 帶有重試功能的單一供應商執行器
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_KEY")),
    RetryConfig.PRODUCTION
)
val executor = SingleLLMPromptExecutor(resilientClient)

// 帶有靈活用戶端配置的多供應商執行器
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock 用戶端已內建 AWS SDK 重試
    LLMProvider.Bedrock to BedrockLLMClient(
        identityProvider = StaticCredentialsProvider {
            accessKeyId = System.getenv("AWS_ACCESS_KEY_ID")
            secretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY")
            sessionToken = System.getenv("AWS_SESSION_TOKEN")
        },
    ),
)
```
<!--- KNIT example-prompt-api-21.kt -->

#### 搭配重試進行串流

串流操作可以選擇重試。此功能預設為停用。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val baseClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
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
<!--- KNIT example-prompt-api-22.kt -->

!!!note
    串流重試僅適用於在收到第一個 Token 之前的連線失敗。一旦串流開始，錯誤將直接傳遞，以保留內容完整性。

### 逾時設定

所有 LLM 用戶端都支援逾時設定，以防止掛起請求：

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
            connectTimeoutMillis = 5000,    // 5 秒以建立連線
            requestTimeoutMillis = 60000    // 60 秒以完成整個請求
        )
    )
)
```
<!--- KNIT example-prompt-api-23.kt -->

### 錯誤處理

在生產環境中處理 LLMs 時，您需要實作錯誤處理策略：

- **使用 `try-catch` 區塊**來處理意外錯誤。
- **記錄帶有上下文的錯誤**，用於偵錯。
- **實作備用策略**，用於關鍵操作。
- **監控重試模式**，以識別重複或系統性問題。

以下是一個全面的錯誤處理範例：

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
            OpenAILLMClient(System.getenv("OPENAI_KEY"))
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
            // 專門處理速率限制
            scheduleRetryLater()
        }
        e.message?.contains("invalid api key") == true -> {
            // 處理身份驗證錯誤
            notifyAdministrator()
        }
        else -> {
            // 退回到替代解決方案
            useDefaultResponse()
        }
    }
}
```
<!--- KNIT example-prompt-api-24.kt -->