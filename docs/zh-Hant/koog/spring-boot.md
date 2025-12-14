# Spring Boot 整合

Koog 透過其自動配置啟動器，提供無縫的 Spring Boot 整合，讓您能夠以最少的設定輕鬆將 AI 代理整合到您的 Spring Boot 應用程式中。

## 概述

`koog-spring-boot-starter` 會根據您的應用程式屬性自動配置 LLM 用戶端，並提供現成的 bean 供依賴注入。它支援所有主要的 LLM 提供者，包括：

- OpenAI
- Anthropic
- Google
- OpenRouter
- DeepSeek
- Ollama

## 入門

### 1. 加入依賴

將 Koog Spring Boot starter 和 [Ktor Client Engine](https://ktor.io/docs/client-engines.html#jvm) 加入您的 `build.gradle.kts` 或 `pom.xml`：

```kotlin
dependencies {
    implementation("ai.koog:koog-spring-boot-starter:$koogVersion")
    implementation("io.ktor:ktor-client-okhttp-jvm:$ktorVersion")
}
```

### 2. 配置提供者

在 `application.properties` 中配置您偏好的 LLM 提供者：

```properties
# OpenAI Configuration
ai.koog.openai.enabled=true
ai.koog.openai.api-key=${OPENAI_API_KEY}
ai.koog.openai.base-url=https://api.openai.com
# Anthropic Configuration  
ai.koog.anthropic.enabled=true
ai.koog.anthropic.api-key=${ANTHROPIC_API_KEY}
ai.koog.anthropic.base-url=https://api.anthropic.com
# Google Configuration
ai.koog.google.enabled=true
ai.koog.google.api-key=${GOOGLE_API_KEY}
ai.koog.google.base-url=https://generativelanguage.googleapis.com
# OpenRouter Configuration
ai.koog.openrouter.enabled=true
ai.koog.openrouter.api-key=${OPENROUTER_API_KEY}
ai.koog.openrouter.base-url=https://openrouter.ai
# DeepSeek Configuration
ai.koog.deepseek.enabled=true
ai.koog.deepseek.api-key=${DEEPSEEK_API_KEY}
ai.koog.deepseek.base-url=https://api.deepseek.com
# Ollama Configuration (local - no API key required)
ai.koog.ollama.enabled=true
ai.koog.ollama.base-url=http://localhost:11434
```

或使用 YAML 格式 (`application.yml`)：

```yaml
ai:
    koog:
        openai:
            enabled: true
            api-key: ${OPENAI_API_KEY}
            base-url: https://api.openai.com
        anthropic:
            enabled: true
            api-key: ${ANTHROPIC_API_KEY}
            base-url: https://api.anthropic.com
        google:
            enabled: true
            api-key: ${GOOGLE_API_KEY}
            base-url: https://generativelanguage.googleapis.com
        openrouter:
            enabled: true
            api-key: ${OPENROUTER_API_KEY}
            base-url: https://openrouter.ai
        deepseek:
            enabled: true
            api-key: ${DEEPSEEK_API_KEY}
            base-url: https://api.deepseek.com
        ollama:
            enabled: true # 需明確設定為 `true` 以啟用 !!!
            base-url: http://localhost:11434
```

`ai.koog.PROVIDER.api-key` 和 `ai.koog.PROVIDER.enabled` 這兩個屬性都用於啟用提供者。

如果提供者支援 API 金鑰（例如 OpenAI、Anthropic、Google），則 `ai.koog.PROVIDER.enabled` 預設為 `true`。

如果提供者不支援 API 金鑰，例如 Ollama，則 `ai.koog.PROVIDER.enabled` 預設為 `false`，並且提供者應在應用程式配置中明確啟用。

提供者的基礎 URL 在 Spring Boot 啟動器中會設定為其預設值，但您可以在應用程式中覆寫它。

!!! tip "環境變數"
建議為 API 金鑰使用環境變數，以確保其安全並避免納入版本控制。
Spring 配置使用 LLM 提供者眾所周知的環境變數。
例如，設定環境變數 `OPENAI_API_KEY` 足以啟用 OpenAI 的 Spring 配置。

| LLM 提供者 | 環境變數            |
|--------------|-----------------------|
| Open AI      | `OPENAI_API_KEY`      |
| Anthropic    | `ANTHROPIC_API_KEY`   |
| Google       | `GOOGLE_API_KEY`      |
| OpenRouter   | `OPENROUTER_API_KEY`  |
| DeepSeek     | `DEEPSEEK_API_KEY`    |

### 3. 注入與使用

將自動配置的執行器注入到您的服務中：

```kotlin
@Service
class AIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    private val anthropicExecutor: SingleLLMPromptExecutor?
) {

    suspend fun generateResponse(input: String): String {
        val prompt = prompt {
            system("您是一位有用的 AI 助理")
            user(input)
        }

        return when {
            openAIExecutor != null -> {
                val result = openAIExecutor.execute(prompt)
                result.text
            }
            anthropicExecutor != null -> {
                val result = anthropicExecutor.execute(prompt)
                result.text
            }
            else -> throw IllegalStateException("未配置任何 LLM 提供者")
        }
    }
}
```

## 進階用法

### REST 控制器範例

使用自動配置的執行器建立一個聊天端點：

```kotlin
@RestController
@RequestMapping("/api/chat")
class ChatController(
    private val anthropicExecutor: SingleLLMPromptExecutor?
) {

    @PostMapping
    suspend fun chat(@RequestBody request: ChatRequest): ResponseEntity<ChatResponse> {
        return if (anthropicExecutor != null) {
            try {
                val prompt = prompt {
                    system("您是個有用的助理")
                    user(request.message)
                }

                val result = anthropicExecutor.execute(prompt)
                ResponseEntity.ok(ChatResponse(result.text))
            } catch (e: Exception) {
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ChatResponse("處理請求時發生錯誤"))
            }
        } else {
            ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ChatResponse("AI 服務未配置"))
        }
    }
}

data class ChatRequest(val message: String)
data class ChatResponse(val response: String)
```

### 多個提供者支援

處理具有備援邏輯的多個提供者：

```kotlin
@Service
class RobustAIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    private val anthropicExecutor: SingleLLMPromptExecutor?,
    private val openRouterExecutor: SingleLLMPromptExecutor?
) {

    suspend fun generateWithFallback(input: String): String {
        val prompt = prompt {
            system("您是一位有用的 AI 助理")
            user(input)
        }

        val executors = listOfNotNull(openAIExecutor, anthropicExecutor, openRouterExecutor)

        for (executor in executors) {
            try {
                val result = executor.execute(prompt)
                return result.text
            } catch (e: Exception) {
                logger.warn("執行器失敗，嘗試下一個: ${e.message}")
                continue
            }
        }

        throw IllegalStateException("所有 AI 提供者均失敗")
    }

    companion object {
        private val logger = LoggerFactory.getLogger(RobustAIService::class.java)
    }
}
```

### 配置屬性

您也可以注入配置屬性以實現自訂邏輯：

```kotlin
@Service
class ConfigurableAIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    @Value("\${ai.koog.openai.api-key:}") private val openAIKey: String
) {

    fun isOpenAIConfigured(): Boolean = openAIKey.isNotBlank() && openAIExecutor != null

    suspend fun processIfConfigured(input: String): String? {
        return if (isOpenAIConfigured()) {
            val result = openAIExecutor!!.execute(prompt { user(input) })
            result.text
        } else {
            null
        }
    }
}
```

## 配置參考

### 可用屬性

| 屬性                            | 描述                | Bean 條件                                                   | 預設值                                      |
|-------------------------------|---------------------|-------------------------------------------------------------|---------------------------------------------|
| `ai.koog.openai.api-key`      | OpenAI API 金鑰     | 為 `openAIExecutor` bean 所必需                             | -                                           |
| `ai.koog.openai.base-url`     | OpenAI 基礎 URL     | 選用                                                        | `https://api.openai.com`                    |
| `ai.koog.anthropic.api-key`   | Anthropic API 金鑰  | 為 `anthropicExecutor` bean 所必需                          | -                                           |
| `ai.koog.anthropic.base-url`  | Anthropic 基礎 URL  | 選用                                                        | `https://api.anthropic.com`                 |
| `ai.koog.google.api-key`      | Google API 金鑰     | 為 `googleExecutor` bean 所必需                             | -                                           |
| `ai.koog.google.base-url`     | Google 基礎 URL     | 選用                                                        | `https://generativelanguage.googleapis.com` |
| `ai.koog.openrouter.api-key`  | OpenRouter API 金鑰 | 為 `openRouterExecutor` bean 所必需                         | -                                           |
| `ai.koog.openrouter.base-url` | OpenRouter 基礎 URL | 選用                                                        | `https://openrouter.ai`                     |
| `ai.koog.deepseek.api-key`    | DeepSeek API 金鑰   | 為 `deepSeekExecutor` bean 所必需                           | -                                           |
| `ai.koog.deepseek.base-url`   | DeepSeek 基礎 URL   | 選用                                                        | `https://api.deepseek.com`                  |
| `ai.koog.ollama.base-url`     | Ollama 基礎 URL     | 任何 `ai.koog.ollama.*` 屬性都會啟用 `ollamaExecutor` bean | `http://localhost:11434`                    |

### Bean 名稱

自動配置會建立以下 bean (配置時)：

- `openAIExecutor` - OpenAI 執行器（需要 `ai.koog.openai.api-key`）
- `anthropicExecutor` - Anthropic 執行器（需要 `ai.koog.anthropic.api-key`）
- `googleExecutor` - Google 執行器（需要 `ai.koog.google.api-key`）
- `openRouterExecutor` - OpenRouter 執行器（需要 `ai.koog.openrouter.api-key`）
- `deepSeekExecutor` - DeepSeek 執行器（需要 `ai.koog.deepseek.api-key`）
- `ollamaExecutor` - Ollama 執行器（需要任何 `ai.koog.ollama.*` 屬性）

## 疑難排解

### 常見問題

**找不到 Bean 錯誤：**

```
No qualifying bean of type 'SingleLLMPromptExecutor' available
```

**解決方案：** 請確保您已在屬性檔中配置至少一個提供者。

**多個 Bean 錯誤：**

```
Multiple qualifying beans of type 'SingleLLMPromptExecutor' available
```

**解決方案：** 使用 `@Qualifier` 來指定您想要的 bean：

```kotlin
@Service
class MyService(
    @Qualifier("openAIExecutor") private val openAIExecutor: SingleLLMPromptExecutor,
    @Qualifier("anthropicExecutor") private val anthropicExecutor: SingleLLMPromptExecutor
) {
    // ...
}
```

**API 金鑰未載入：**

```
API key is required but not provided
```

**解決方案：** 檢查您的環境變數是否已正確設定，並可供您的 Spring Boot 應用程式存取。

## 最佳實踐

1.  **環境變數**：始終使用環境變數來儲存 API 金鑰
2.  **可為空的注入**：使用可為空的型別 (`SingleLLMPromptExecutor?`) 來處理未配置提供者的情況
3.  **備援邏輯**：在使用多個提供者時實作備援機制
4.  **錯誤處理**：在生產環境程式碼中，始終將執行器呼叫包裝在 try-catch 區塊中
5.  **測試**：在測試中使用模擬物件 (mocks) 以避免實際的 API 呼叫
6.  **配置驗證**：在使用執行器之前檢查其是否可用

## 後續步驟

- 了解 [基本代理](basic-agents.md) 以建立最基礎的 AI 工作流程
- 探索 [複雜工作流程代理](complex-workflow-agents.md) 以用於進階使用案例
- 查看 [工具概述](tools-overview.md) 以擴展您的代理功能
- 查閱 [範例](examples.md) 以了解實際應用
- 閱讀 [術語表](glossary.md) 以更好地理解該框架