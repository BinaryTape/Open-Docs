# 提示词 API

Prompt API 允许你使用 Kotlin DSL 创建结构良好的提示词，针对不同的 LLM 提供方执行这些提示词，并以不同格式处理响应。

## 创建提示词

Prompt API 使用 Kotlin DSL 创建提示词。它支持以下消息类型：

- `system`: 设置 LLM 的上下文和指令。
- `user`: 表示用户输入。
- `assistant`: 表示 LLM 响应。

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

## 执行提示词

要使用特定的 LLM 执行提示词，你需要完成以下步骤：

1. 创建相应的 LLM 客户端，用于处理你的应用程序与 LLM 提供方之间的连接。例如：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// 创建一个 OpenAI 客户端
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-02.kt -->

2. 调用 `execute` 方法，将提示词和 LLM 作为实参。
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
// 执行提示词
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // 你可以选择不同的模型
)
```
<!--- KNIT example-prompt-api-03.kt -->

以下 LLM 客户端可用：

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (仅限 JVM)

这是一个使用 Prompt API 的简单示例：

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
<!--- KNIT example-prompt-api-04.kt -->

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
<!--- KNIT example-prompt-api-05.kt -->

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
<!--- KNIT example-prompt-api-06.kt -->

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
<!--- KNIT example-prompt-api-07.kt -->

`attachments` 形参接受一个文件输入列表，其中每个项都是以下某个类的实例：

- `Attachment.Image`: 图像附件，例如 `jpg` 或 `png` 文件。
- `Attachment.Audio`: 音频附件，例如 `mp3` 或 `wav` 文件。
- `Attachment.Video`: 视频附件，例如 `mpg` 或 `avi` 文件。
- `Attachment.File`: 文件附件，例如 `pdf` 或 `txt` 文件。

上述每个类都接受以下形参：

| 名称       | 数据类型                               | 必需                   | 描述                                                                                                 |
|------------|-----------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | Yes                        | 所提供文件内容的源。有关更多信息，请参见 [AttachmentContent](#attachmentcontent)。 |
| `format`   | String                                  | Yes                        | 所提供文件的格式。例如，`png`。                                                        |
| `mimeType` | String                                  | Only for `Attachment.File` | 所提供文件的 MIME 类型。例如，`image/png`。                                               |
| `fileName` | String                                  | No                         | 所提供文件的名称，包括扩展名。例如，`screenshot.png`。                       |

#### AttachmentContent

`AttachmentContent` 定义了作为 LLM 输入提供的内容的类型和源。支持以下类：

`AttachmentContent.URL(val url: String)`

从指定的 URL 提供文件内容。接受以下形参：

| 名称   | 数据类型 | 必需 | 描述                      |
|--------|-----------|----------|--------------------------|
| `url`  | String    | Yes      | 所提供内容的 URL。 |

`AttachmentContent.Binary.Bytes(val data: ByteArray)`

将文件内容作为字节数组提供。接受以下形参：

| 名称   | 数据类型 | 必需 | 描述                                |
|--------|-----------|----------|--------------------------------------------|
| `data` | ByteArray | Yes      | 作为字节数组提供的文件内容。 |

`AttachmentContent.Binary.Base64(val base64: String)`

将文件内容编码为 Base64 字符串提供。接受以下形参：

| 名称     | 数据类型 | 必需 | 描述                             |
|----------|-----------|----------|-----------------------------------------|
| `base64` | String    | Yes      | 包含文件数据的 Base64 字符串。 |

`AttachmentContent.PlainText(val text: String)`

仅当附件类型为 `Attachment.File` 时适用。提供纯文本文件（例如 `text/plain` MIME 类型）的内容。接受以下形参：

| 名称   | 数据类型 | 必需 | 描述              |
|--------|-----------|----------|--------------------------|
| `text` | String    | Yes      | 文件的内容。 |

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
<!--- KNIT example-prompt-api-08.kt -->

## 提示词执行器

提示词执行器提供了一种更高级的方式与 LLM 协同工作，处理客户端的创建和管理细节。

你可以使用提示词执行器来管理和运行提示词。
你可以根据计划使用的 LLM 提供方选择提示词执行器，或者使用其中一个可用 LLM 客户端创建自定义提示词执行器。

Koog 框架提供了几种提示词执行器：

- **单提供方执行器**：
    - `simpleOpenAIExecutor`: 用于执行带有 OpenAI 模型的提示词。
    - `simpleAnthropicExecutor`: 用于执行带有 Anthropic 模型的提示词。
    - `simpleGoogleExecutor`: 用于执行带有 Google 模型的提示词。
    - `simpleOpenRouterExecutor`: 用于执行带有 OpenRouter 的提示词。
    - `simpleOllamaExecutor`: 用于执行带有 Ollama 的提示词。

- **多提供方执行器**：
    - `DefaultMultiLLMPromptExecutor`: 用于与多个 LLM 提供方协同工作

### 创建单提供方执行器

要为特定的 LLM 提供方创建提示词执行器，请使用相应函数。例如，要创建 OpenAI 提示词执行器，你需要调用 `simpleOpenAIExecutor` 函数并提供与 OpenAI 服务进行认证所需的 API 密钥：

1. 创建提示词执行器：
<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
const val apiToken = "YOUR_API_TOKEN"
-->
```kotlin
// 创建一个 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
<!--- KNIT example-prompt-api-09.kt -->

2. 使用特定的 LLM 执行提示词：
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
// 执行提示词
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-api-10.kt -->

### 创建多提供方执行器

要创建与多个 LLM 提供方协同工作的提示词执行器，请完成以下步骤：

1. 为所需的 LLM 提供方配置客户端，并提供相应的 API 密钥。例如：
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

2. 将配置好的客户端传递给 `DefaultMultiLLMPromptExecutor` 类构造函数，以创建具有多个 LLM 提供方的提示词执行器：
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

3. 使用特定的 LLM 执行提示词：
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