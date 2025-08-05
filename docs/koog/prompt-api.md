# Prompt API

Prompt API 允许你使用 Kotlin DSL 创建结构良好的提示词，针对不同的 LLM 提供方执行这些提示词，并以不同格式处理响应。

## 创建提示词

Prompt API 使用 Kotlin DSL 创建提示词。它支持以下消息类型：

- `system`: 设置 LLM 的上下文和指令。
- `user`: 表示用户输入。
- `assistant`: 表示 LLM 响应。

这是一个简单提示词的示例：

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

## 执行提示词

要使用特定的 LLM 执行提示词，你需要完成以下步骤：

1. 创建相应的 LLM 客户端，用于处理你的应用程序与 LLM 提供方之间的连接。例如：
```kotlin
// 创建一个 OpenAI 客户端
val client = OpenAILLMClient(apiKey)
```
2. 调用 `execute` 方法，将提示词和 LLM 作为实参。
```kotlin
// 执行提示词
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // 你可以选择不同的模型
)
```

以下 LLM 客户端可用：

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)

这是一个使用 Prompt API 的简单示例：

```kotlin
fun main() {
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
```

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
    - `DefaultMultiLLMPromptExecutor`: 用于与多个 LLM 提供方协同工作。

### 创建单提供方执行器

要为特定的 LLM 提供方创建提示词执行器，请使用相应函数。
例如，要创建 OpenAI 提示词执行器，你需要调用 `simpleOpenAIExecutor` 函数并提供与 OpenAI 服务进行认证所需的 API 密钥：

1. 创建提示词执行器：
```kotlin
// 创建一个 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
2. 使用特定的 LLM 执行提示词：
```kotlin
// 执行提示词
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```

### 创建多提供方执行器

要创建与多个 LLM 提供方协同工作的提示词执行器，请完成以下步骤：

1. 为所需的 LLM 提供方配置客户端，并提供相应的 API 密钥。例如：
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
2. 将配置好的客户端传递给 `DefaultMultiLLMPromptExecutor` 类构造函数，以创建具有多个 LLM 提供方的提示词执行器：
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
3. 使用特定的 LLM 执行提示词：
```kotlin
val response = multiExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)