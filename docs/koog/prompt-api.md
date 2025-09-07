# Prompt API

Prompt API 提供了一个全面的工具包，用于在生产应用程序中与大语言模型 (LLM) 进行交互。它提供：

- 结合类型安全的 **Kotlin DSL** 用于创建结构化提示词。
- 对 OpenAI、Anthropic、Google 及其他 LLM 提供方提供**多提供方支持**。
- **生产特性**，例如重试逻辑、错误处理和超时配置。
- 用于处理文本、图像、音频和文档的**多模态能力**。

## 架构概览

Prompt API 由三个主要层组成：

- **LLM 客户端**：连接特定提供方（OpenAI、Anthropic 等）的底层接口。
- **装饰器**：可选的包装器，用于添加重试逻辑等功能。
- **提示词执行器**：管理客户端生命周期并简化使用的高级抽象。

## 创建提示词

Prompt API 使用 Kotlin DSL 创建提示词。它支持以下消息类型：

- `system`：设置 LLM 的上下文和指令。
- `user`：表示用户输入。
- `assistant`：表示 LLM 响应。

这是一个简单提示词的示例：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val prompt = prompt("prompt_name", LLMParams()) {
    // 添加 system 消息以设置上下文
    system("You are a helpful assistant.")

    // 添加 user 消息
    user("Tell me about Kotlin")

    // 你还可以添加 assistant 消息用于少样本示例
    assistant("Kotlin is a modern programming language...")

    // 再添加一条 user 消息
    user("What are its key features?")
}
```
<!--- KNIT example-prompt-api-01.kt -->

## 多模态输入

除了在提示词中提供文本消息外，Koog 还允许你将图像、音频、视频和文件与 `user` 消息一同发送给 LLM。与标准的纯文本提示词一样，你也可以使用 DSL 结构来构建提示词并向其添加媒体。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("multimodal_input") {
    system("You are a helpful assistant.")

    user {
        +"描述这些图像"

        attachments {
            image("https://example.com/test.png")
            image(Path("/User/koog/image.png"))
        }
    }
}
```
<!--- KNIT example-prompt-api-02.kt -->

### 文本提示词内容

为了支持各种附件类型并在提示词中区分文本输入和文件输入，你可以将文本消息放在 `user` 提示词中一个专用的 `content` 形参中。要添加文件输入，请将它们作为列表提供给 `attachments` 形参。

包含文本消息和附件列表的 `user` 消息的通用格式如下：

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
        // 添加附件
    )
)
```
<!--- KNIT example-prompt-api-03.kt -->

### 文件附件

要包含附件，请将文件提供给 `attachments` 形参，格式如下：

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
<!--- KNIT example-prompt-api-04.kt -->

`attachments` 形参接受一个文件输入列表，其中每个项都是以下某个类的实例：

- `Attachment.Image`：图像附件，例如 `jpg` 或 `png` 文件。
- `Attachment.Audio`：音频附件，例如 `mp3` 或 `wav` 文件。
- `Attachment.Video`：视频附件，例如 `mpg` 或 `avi` 文件。
- `Attachment.File`：文件附件，例如 `pdf` 或 `txt` 文件。

上述每个类都接受以下形参：

| 名称       | 数据类型                               | 必需                   | 描述                                                                                                 |
|------------|-----------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | Yes                        | 所提供文件内容的源。有关更多信息，请参见 [AttachmentContent](#attachmentcontent)。 |
| `format`   | String                                  | Yes                        | 所提供文件的格式。例如，`png`。                                                        |
| `mimeType` | String                                  | Only for `Attachment.File` | 所提供文件的 MIME 类型。例如，`image/png`。                                               |
| `fileName` | String                                  | No                         | 所提供文件的名称，包括扩展名。例如，`screenshot.png`。                       |

有关更多详细信息，请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment/index.html)。

#### AttachmentContent

`AttachmentContent` 定义了作为 LLM 输入提供的内容的类型和源。支持以下类：

* `AttachmentContent.URL(val url: String)`

  从指定的 URL 提供文件内容。接受以下形参：

  | 名称   | 数据类型 | 必需 | 描述                      |
  |--------|-----------|----------|--------------------------|
  | `url`  | String    | Yes      | 所提供内容的 URL。 |

  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)。

* `AttachmentContent.Binary.Bytes(val data: ByteArray)`

  将文件内容作为字节数组提供。接受以下形参：

  | 名称   | 数据类型 | 必需 | 描述                                |
  |--------|-----------|----------|--------------------------------------------|
  | `data` | ByteArray | Yes      | 作为字节数组提供的文件内容。 |

  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

* `AttachmentContent.Binary.Base64(val base64: String)`

  将文件内容编码为 Base64 字符串提供。接受以下形参：

  | 名称     | 数据类型 | 必需 | 描述                             |
  |----------|-----------|----------|-----------------------------------------|
  | `base64` | String    | Yes      | 包含文件数据的 Base64 字符串。 |

  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

* `AttachmentContent.PlainText(val text: String)`

!!! tip
    仅当附件类型为 `Attachment.File` 时适用。

  提供纯文本文件（例如 `text/plain` MIME 类型）的内容。接受以下形参：

  | 名称   | 数据类型 | 必需 | 描述              |
  |--------|-----------|----------|--------------------------|
  | `text` | String    | Yes      | 文件的内容。 |

  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)。

### 混合附件内容

除了在单独的提示词或消息中提供不同类型的附件外，你还可以在单个 `user` 消息中提供多种混合类型的附件，如下所示：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("You are a helpful assistant.")

    user {
        +"比较图像与文档内容。"

        attachments {
            image(Path("/User/koog/page.png"))
            binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        }
    }
}
```
<!--- KNIT example-prompt-api-05.kt -->

## 选择 LLM 客户端还是提示词执行器

在使用 Prompt API 时，你可以使用 LLM 客户端或提示词执行器来运行提示词。要在这两者之间进行选择，请考虑以下因素：

- 如果你使用单个 LLM 提供方并且不需要高级生命周期管理，请直接使用 LLM 客户端。要了解更多信息，请参见 [使用 LLM 客户端运行提示词](#running-prompts-with-llm-clients)。
- 如果你需要更高级别的抽象来管理 LLM 及其生命周期，或者你希望通过跨多个提供方的统一 API 运行提示词并动态切换它们，请使用提示词执行器。要了解更多信息，请参见 [使用提示词执行器运行提示词](#running-prompts-with-prompt-executors)。

!!!note
    LLM 客户端和提示词执行器都允许你流式传输响应、生成多个选择和运行内容审核。有关更多信息，请参考特定客户端或执行器的 [API 参考](https://api.koog.ai/index.html)。

## 使用 LLM 客户端运行提示词

如果你使用单个 LLM 提供方且不需要高级生命周期管理，则可以使用 LLM 客户端来运行提示词。Koog 提供以下 LLM 客户端：

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (仅限 JVM)

要使用 LLM 客户端运行提示词，请执行以下操作：

1) 创建 LLM 客户端，用于处理你的应用程序与 LLM 提供方之间的连接。例如：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// 创建一个 OpenAI 客户端
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-06.kt -->

2) 调用 `execute` 方法，将提示词和 LLM 作为实参。

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
// 执行提示词
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // 你可以选择不同的模型
)
```
<!--- KNIT example-prompt-api-07.kt -->

这是一个使用 OpenAI 客户端运行提示词的示例：

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
        // 使用你的 API 密钥设置 OpenAI 客户端
        val token = System.getenv("OPENAI_API_KEY")
        val client = OpenAILLMClient(token)

        // 创建提示词
        val prompt = prompt("prompt_name", LLMParams()) {
            // 添加 system 消息以设置上下文
            system("You are a helpful assistant.")

            // 添加 user 消息
            user("Tell me about Kotlin")

            // 你还可以添加 assistant 消息用于少样本示例
            assistant("Kotlin is a modern programming language...")

            // 再添加一条 user 消息
            user("What are its key features?")
        }

        // 执行提示词并获取响应
        val response = client.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4o)
        println(response)
    }
}
```
<!--- KNIT example-prompt-api-08.kt -->

!!!note
    LLM 客户端允许你流式传输响应、生成多个选择和运行内容审核。有关更多信息，请参考特定客户端的 API 参考。要了解有关内容审核的更多信息，请参见 [Content moderation](content-moderation.md)。

## 使用提示词执行器运行提示词

尽管 LLM 客户端提供了对提供方的直接访问，但提示词执行器提供了一种更高级的抽象，可以简化常见用例并处理客户端生命周期管理。它们在你需要以下情况时非常理想：

- 无需管理客户端配置即可快速原型化。
- 通过统一接口与多个提供方协同工作。
- 在大型应用程序中简化依赖注入。
- 抽象化提供方特有的细节。

### 执行器类型

Koog 提供两种主要的提示词执行器：

| 名称                                                                                                                                              | 描述                                                                                                                                                                                                                             |
|:--------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) | 包装单个 LLM 客户端用于一个提供方。如果你的代理仅需要在一个 LLM 提供方内切换模型，请使用此执行器。                                                                                                                                                 |
| [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html)  | 按提供方路由到多个 LLM 客户端，并为每个提供方提供可选的回退机制，以便在请求的提供方不可用时使用。如果你的代理需要在不同提供方的模型之间切换，请使用此执行器。 |

它们是用于使用 LLM 执行提示词的 [`PromtExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html) 接口的实现。

### 创建单提供方执行器

要为特定的 LLM 提供方创建提示词执行器，请执行以下操作：

1) 为特定提供方配置 LLM 客户端，并提供相应的 API 密钥：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
```
<!--- KNIT example-prompt-api-09.kt -->
2) 使用 [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) 创建提示词执行器：
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi09.openAIClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val promptExecutor = SingleLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-api-10.kt -->

### 创建多提供方执行器

要创建与多个 LLM 提供方协同工作的提示词执行器，请执行以下操作：

1) 为所需的 LLM 提供方配置客户端，并提供相应的 API 密钥：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val ollamaClient = OllamaClient()
```
<!--- KNIT example-prompt-api-11.kt -->

2) 将配置好的客户端传递给 `MultiLLMPromptExecutor` 类构造函数，以创建具有多个 LLM 提供方的提示词执行器：
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

### 预定义的提示词执行器

为了加快设置速度，Koog 为常见的提供方提供了以下开箱即用的执行器实现：

- 单提供方执行器，返回配置了特定 LLM 客户端的 `SingleLLMPromptExecutor`：
    - `simpleOpenAIExecutor` 用于使用 OpenAI 模型执行提示词。
    - `simpleAzureOpenAIExecutor` 用于使用 Azure OpenAI 服务执行提示词。
    - `simpleAnthropicExecutor` 用于使用 Anthropic 模型执行提示词。
    - `simpleGoogleAIExecutor` 用于使用 Google 模型执行提示词。
    - `simpleOpenRouterExecutor` 用于使用 OpenRouter 执行提示词。
    - `simpleOllamaExecutor` 用于使用 Ollama 执行提示词。

- 多提供方执行器：
    - `DefaultMultiLLMPromptExecutor` 是 `MultiLLMPromptExecutor` 的一个实现，支持 OpenAI、Anthropic 和 Google 提供方。

以下是创建预定义的单提供方和多提供方执行器的示例：

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
// 创建一个 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// 创建一个包含 OpenAI、Anthropic 和 Google LLM 客户端的 DefaultMultiLLMPromptExecutor
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-api-13.kt -->

### 执行提示词

提示词执行器提供使用各种功能（例如流式传输、生成多个选择和内容审核）来运行提示词的方法。

以下是使用 `execute` 方法通过特定 LLM 运行提示词的示例：

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
// 执行提示词
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-api-14.kt -->

这将使用 `GPT4o` 模型运行提示词并返回响应。

!!!note
    提示词执行器允许你流式传输响应、生成多个选择和运行内容审核。有关更多信息，请参考特定执行器的 API 参考。要了解有关内容审核的更多信息，请参见 [Content moderation](content-moderation.md)。

## 缓存提示词执行器

对于重复请求，你可以缓存 LLM 响应以优化性能并降低成本。Koog 提供了 `CachedPromptExecutor`，它是 `PromptExecutor` 的一个包装器，添加了缓存功能。它允许你存储先前执行的提示词的响应，并在再次运行相同的提示词时检索它们。

要创建缓存提示词执行器，请执行以下操作：

1) 为你希望缓存响应的提示词执行器创建一个实例：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val client = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = SingleLLMPromptExecutor(client)
```
<!--- KNIT example-prompt-api-15.kt -->

2) 创建一个 `CachedPromptExecutor` 实例，指定所需的缓存并提供已创建的提示词执行器：
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

3) 使用所需的提示词和模型运行缓存提示词执行器：
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

现在你可以多次使用相同的模型运行相同的提示词，响应将从缓存中检索。

!!!note
    * 如果你使用缓存提示词执行器调用 `executeStreaming()`，它会生成一个单一块的响应。
    * 如果你使用缓存提示词执行器调用 `moderate()`，它会将请求转发到嵌套的提示词执行器，并且不使用缓存。
    * 不支持缓存多个选择响应。

## 重试功能

与 LLM 提供方协同工作时，你可能会遇到瞬时错误，例如速率限制或临时服务不可用。`RetryingLLMClient` 装饰器为任何 LLM 客户端添加了自动重试逻辑。

### 基本用法

将任何现有客户端包装为具有重试能力：

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
// 将任何客户端包装为具有重试能力
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// 现在，所有操作都将在瞬时错误时自动重试
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-18.kt -->

#### 配置重试行为

Koog 提供了几种预定义的重试配置：

| 配置       | 最大尝试次数 | 初始延迟 | 最大延迟 | 用例          |
|------------|-------------|----------|----------|---------------|
| `DISABLED` | 1（无重试）   | -        | -        | 开发和测试    |
| `CONSERVATIVE` | 3           | 2秒      | 30秒     | 正常生产使用  |
| `AGGRESSIVE` | 5           | 500毫秒  | 20秒     | 关键操作      |
| `PRODUCTION` | 3           | 1秒      | 20秒     | 推荐默认值    |

直接使用它们或创建自定义配置：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 使用预定义配置
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)

// 或者创建自定义配置
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

#### 可重试错误模式

默认情况下，重试机制会识别常见的瞬时错误：

* **HTTP 状态码**：
    * `429`：速率限制
    * `500`：内部服务器错误
    * `502`：坏网关
    * `503`：服务不可用
    * `504`：网关超时
    * `529`：Anthropic 过载

* **错误关键词**：
    * rate limit
    * too many requests
    * request timeout
    * connection timeout
    * read timeout
    * write timeout
    * connection reset by peer
    * connection refused
    * temporarily unavailable
    * service unavailable

你可以根据特定需求定义自定义模式：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),           // 特定状态码
        RetryablePattern.Keyword("quota"),      // 错误消息中的关键词
        RetryablePattern.Regex(Regex("ERR_\\d+")), // 自定义正则表达式模式
        RetryablePattern.Custom { error ->      // 自定义逻辑
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-prompt-api-20.kt -->

#### 提示词执行器重试

使用提示词执行器时，你可以在创建执行器之前，用重试机制包装底层 LLM 客户端：

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
// 具有重试功能的单提供方执行器
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_KEY")),
    RetryConfig.PRODUCTION
)
val executor = SingleLLMPromptExecutor(resilientClient)

// 具有灵活客户端配置的多提供方执行器
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock 客户端已内置 AWS SDK 重试功能
    LLMProvider.Bedrock to BedrockLLMClient(
        awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID"),
        awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY"),
        awsSessionToken = System.getenv("AWS_SESSION_TOKEN"),
    ))
```
<!--- KNIT example-prompt-api-21.kt -->

#### 流式传输重试

流式传输操作可以选择性地重试。此特性默认禁用。

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
    流式传输重试仅适用于在收到第一个 token 之前的连接失败。一旦流式传输开始，错误将直接传递以保留内容完整性。

### 超时配置

所有 LLM 客户端都支持超时配置，以防止请求挂起：

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
            connectTimeoutMillis = 5000,    // 建立连接的 5 秒
            requestTimeoutMillis = 60000    // 整个请求的 60 秒
        )
    )
)
```
<!--- KNIT example-prompt-api-23.kt -->

### 错误处理

在生产环境中与 LLM 协同工作时，你需要实施错误处理策略：

- **使用 try-catch 块**来处理意外错误。
- **记录带上下文的错误**以便调试。
- **为关键操作实施回退策略**。
- **监控重试模式**以识别重复出现或系统性问题。

以下是全面错误处理的示例：

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
            // 特别处理速率限制
            scheduleRetryLater()
        }
        e.message?.contains("invalid api key") == true -> {
            // 处理认证错误
            notifyAdministrator()
        }
        else -> {
            // 回退到备用解决方案
            useDefaultResponse()
        }
    }
}
```
<!--- KNIT example-prompt-api-24.kt -->