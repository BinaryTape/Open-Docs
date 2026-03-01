# Spring Boot 整合

Koog 透過其自動組態 (auto-configuration) starter 提供無縫的 Spring Boot 整合，只需極少設定即可輕鬆將 AI agent 合併到您的 Spring Boot 應用程式中。

## 總覽

`koog-spring-boot-starter` 會根據您的應用程式屬性自動設定 LLM 用戶端，並提供現成的 bean 用於相依注入。它支援所有主流 LLM 提供者，包括：

- OpenAI
- Anthropic
- Google
- OpenRouter
- DeepSeek
- Ollama

## 快速入門

### 1. 新增相依性

將 Koog Spring Boot starter 與 [Ktor Client Engine](https://ktor.io/docs/client-engines.html#jvm) 新增至您的 `build.gradle.kts` 或 `pom.xml`：

```kotlin
dependencies {
    implementation("ai.koog:koog-spring-boot-starter:$koogVersion")
    implementation("io.ktor:ktor-client-okhttp-jvm:$ktorVersion")
}
```

### 2. 設定提供者

在 `application.properties` 中設定您偏好的 LLM 提供者：

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
            enabled: true # Set it to `true` explicitly to activate !!!
            base-url: http://localhost:11434
```

`ai.koog.PROVIDER.api-key` 與 `ai.koog.PROVIDER.enabled` 屬性皆用於啟用提供者。

如果提供者支援 API 金鑰 (如 OpenAI、Anthropic、Google)，則 `ai.koog.PROVIDER.enabled` 預設為 `true`。

如果提供者不支援 API 金鑰，例如 Ollama，則 `ai.koog.PROVIDER.enabled` 預設為 `false`，且應在應用程式設定中明確啟用提供者。

提供者的基礎 URL 在 Spring Boot starter 中已設為其預設值，但您可以在應用程式中將其覆寫。

!!! tip "環境變數"
    建議使用環境變數來管理 API 金鑰，以保持其安全性並避免進入版本控制。
    Spring 設定使用 LLM 提供者眾所皆知的環境變數。
    例如，只需設定環境變數 `OPENAI_API_KEY` 即可啟用 OpenAI Spring 設定。

| LLM 提供者 | 環境變數 |
|--------------|-----------------------|
| Open AI      | `OPENAI_API_KEY`      |
| Anthropic    | `ANTHROPIC_API_KEY`   |
| Google       | `GOOGLE_API_KEY`      |
| OpenRouter   | `OPENROUTER_API_KEY`  |
| DeepSeek     | `DEEPSEEK_API_KEY`    |

### 3. 注入與使用

將自動組態的執行器注入到您的服務中：

```kotlin
@Service
class AIService(
    private val openAIExecutor: MultiLLMPromptExecutor?,
    private val anthropicExecutor: MultiLLMPromptExecutor?
) {

    suspend fun generateResponse(input: String): String {
        val prompt = prompt {
            system("You are a helpful AI assistant")
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
            else -> throw IllegalStateException("No LLM provider configured")
        }
    }
}
```

## 進階用法

### REST 控制器範例

使用自動組態的執行器建立聊天端點：

```kotlin
@RestController
@RequestMapping("/api/chat")
class ChatController(
    private val anthropicExecutor: MultiLLMPromptExecutor?
) {

    @PostMapping
    suspend fun chat(@RequestBody request: ChatRequest): ResponseEntity<ChatResponse> {
        return if (anthropicExecutor != null) {
            try {
                val prompt = prompt {
                    system("You are a helpful assistant")
                    user(request.message)
                }

                val result = anthropicExecutor.execute(prompt)
                ResponseEntity.ok(ChatResponse(result.text))
            } catch (e: Exception) {
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ChatResponse("Error processing request"))
            }
        } else {
            ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ChatResponse("AI service not configured"))
        }
    }
}

data class ChatRequest(val message: String)
data class ChatResponse(val response: String)
```

### 多重提供者支援

使用備援邏輯處理多個提供者：

```kotlin
@Service
class RobustAIService(
    private val openAIExecutor: MultiLLMPromptExecutor?,
    private val anthropicExecutor: MultiLLMPromptExecutor?,
    private val openRouterExecutor: MultiLLMPromptExecutor?
) {

    suspend fun generateWithFallback(input: String): String {
        val prompt = prompt {
            system("You are a helpful AI assistant")
            user(input)
        }

        val executors = listOfNotNull(openAIExecutor, anthropicExecutor, openRouterExecutor)

        for (executor in executors) {
            try {
                val result = executor.execute(prompt)
                return result.text
            } catch (e: Exception) {
                logger.warn("Executor failed, trying next: ${e.message}")
                continue
            }
        }

        throw IllegalStateException("All AI providers failed")
    }

    companion object {
        private val logger = LoggerFactory.getLogger(RobustAIService::class.java)
    }
}
```

### 設定屬性

您也可以為自訂邏輯注入設定屬性：

```kotlin
@Service
class ConfigurableAIService(
    private val openAIExecutor: MultiLLMPromptExecutor?,
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

## 設定參考

### 可用屬性

| 屬性 | 說明 | Bean 條件 | 預設值 |
|-------------------------------|---------------------|-----------------------------------------------------------------|---------------------------------------------|
| `ai.koog.openai.api-key` | OpenAI API 金鑰 | `openAIExecutor` bean 的必要項 | - |
| `ai.koog.openai.base-url` | OpenAI 基礎 URL | 選填 | `https://api.openai.com` |
| `ai.koog.anthropic.api-key` | Anthropic API 金鑰 | `anthropicExecutor` bean 的必要項 | - |
| `ai.koog.anthropic.base-url` | Anthropic 基礎 URL | 選填 | `https://api.anthropic.com` |
| `ai.koog.google.api-key` | Google API 金鑰 | `googleExecutor` bean 的必要項 | - |
| `ai.koog.google.base-url` | Google 基礎 URL | 選填 | `https://generativelanguage.googleapis.com` |
| `ai.koog.openrouter.api-key` | OpenRouter API 金鑰 | `openRouterExecutor` bean 的必要項 | - |
| `ai.koog.openrouter.base-url` | OpenRouter 基礎 URL | 選填 | `https://openrouter.ai` |
| `ai.koog.deepseek.api-key` | DeepSeek API 金鑰 | `deepSeekExecutor` bean 的必要項 | - |
| `ai.koog.deepseek.base-url` | DeepSeek 基礎 URL | 選填 | `https://api.deepseek.com` |
| `ai.koog.ollama.base-url` | Ollama 基礎 URL | 任何 `ai.koog.ollama.*` 屬性皆可啟用 `ollamaExecutor` bean | `http://localhost:11434` |

### Bean 名稱

自動組態會建立以下 bean (若已設定)：

- `openAIExecutor` - OpenAI 執行器 (需要 `ai.koog.openai.api-key`)
- `anthropicExecutor` - Anthropic 執行器 (需要 `ai.koog.anthropic.api-key`)
- `googleExecutor` - Google 執行器 (需要 `ai.koog.google.api-key`)
- `openRouterExecutor` - OpenRouter 執行器 (需要 `ai.koog.openrouter.api-key`)
- `deepSeekExecutor` - DeepSeek 執行器 (需要 `ai.koog.deepseek.api-key`)
- `ollamaExecutor` - Ollama 執行器 (需要任何 `ai.koog.ollama.*` 屬性)

## 疑難排解

### 常見問題

**找不到 Bean 錯誤：**

```
No qualifying bean of type 'MultiLLMPromptExecutor' available
```

**解決方案：** 請確保您已在屬性檔案中設定了至少一個提供者。

**多重 Bean 錯誤：**

```
Multiple qualifying beans of type 'MultiLLMPromptExecutor' available
```

**解決方案：** 使用 `@Qualifier` 來指定您想要的 bean：

```kotlin
@Service
class MyService(
    @Qualifier("openAIExecutor") private val openAIExecutor: MultiLLMPromptExecutor,
    @Qualifier("anthropicExecutor") private val anthropicExecutor: MultiLLMPromptExecutor
) {
    // ...
}
```

**API 金鑰未載入：**

```
API key is required but not provided
```

**解決方案：** 檢查您的環境變數是否已正確設定，且您的 Spring Boot 應用程式可以存取這些變數。

## 最佳實務

1. **環境變數**：務必使用環境變數來管理 API 金鑰。
2. **可為 null 的注入**：使用可為 null 的型別 (`MultiLLMPromptExecutor?`) 來處理未設定提供者的情況。
3. **備援邏輯**：使用多個提供者時實作備援機制。
4. **錯誤處理**：在生產環境程式碼中，務必將執行器呼叫封裝在 try-catch 區塊中。
5. **測試**：在測試中使用 mock，以避免產生實際的 API 呼叫。
6. **設定驗證**：在使用執行器之前檢查其是否可用。

## 後續步驟

- 了解 [基礎 agent](agents/basic-agents.md) 以建置極簡的 AI 工作流程。
- 探索 [圖形式 agent](agents/graph-based-agents.md) 以處理進階使用案例。
- 參閱 [工具總覽](tools-overview.md) 以擴展您 agent 的功能。
- 查看 [範例](examples.md) 以了解實際的實作方式。
- 閱讀 [術語表](glossary.md) 以更深入了解框架。