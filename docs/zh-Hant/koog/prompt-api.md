# 提示 API

提示 API 讓您可以使用 Kotlin DSL 建立結構良好的提示，對不同的 LLM 供應商執行這些提示，並以不同格式處理回應。

## 建立提示

提示 API 使用 Kotlin DSL 建立提示。它支援以下類型的訊息：

- `system`: 設定 LLM 的上下文和指令。
- `user`: 代表使用者輸入。
- `assistant`: 代表 LLM 回應。

以下是一個簡單的提示範例：

```kotlin
val prompt = prompt("prompt_name", LLMParams()) {
    // 新增一個 system 訊息以設定上下文
    system("You are a helpful assistant.")

    // 新增一個 user 訊息
    user("Tell me about Kotlin")

    // 您也可以新增 assistant 訊息來提供少樣本範例
    assistant("Kotlin is a modern programming language...")

    // 新增另一個 user 訊息
    user("What are its key features?")
}
```

## 執行提示

若要使用特定的 LLM 執行提示，您需要執行以下操作：

1. 建立一個對應的 LLM 用戶端，用於處理應用程式與 LLM 供應商之間的連線。例如：
```kotlin
// 建立一個 OpenAI 用戶端
val client = OpenAILLMClient(apiKey)
```
2. 呼叫 `execute` 方法，並以提示和 LLM 作為引數。
```kotlin
// 執行提示
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // 您可以選擇不同的模型
)
```

以下 LLM 用戶端可用：

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)

以下是一個使用提示 API 的簡單範例：

```kotlin
fun main() {
    // 使用您的 API 金鑰設定 OpenAI 用戶端
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // 建立提示
    val prompt = prompt("prompt_name", LLMParams()) {
        // 新增一個 system 訊息以設定上下文
        system("You are a helpful assistant.")

        // 新增一個 user 訊息
        user("Tell me about Kotlin")

        // 您也可以新增 assistant 訊息來提供少樣本範例
        assistant("Kotlin is a modern programming language...")

        // 新增另一個 user 訊息
        user("What are its key features?")
    }

    // 執行提示並取得回應
    val response = client.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4o)
    println(response)
}
```

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
```kotlin
// 建立一個 OpenAI 執行器
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
2. 使用特定的 LLM 執行提示：
```kotlin
// 執行提示
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```

### 建立多供應商執行器

若要建立可與多個 LLM 供應商協同運作的提示執行器，請執行以下操作：

1. 配置所需 LLM 供應商的用戶端，並提供對應的 API 金鑰。例如：
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
2. 將已配置的用戶端傳遞給 `DefaultMultiLLMPromptExecutor` 類別建構函式，以建立一個具有多個 LLM 供應商的提示執行器：
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
3. 使用特定的 LLM 執行提示：
```kotlin
val response = multiExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)