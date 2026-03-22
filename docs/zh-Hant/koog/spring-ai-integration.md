# Spring AI 整合

Koog 提供 Spring AI 整合 starter，將 Spring AI 的模型抽象與 Koog 代理架構串聯起來。
如果您已使用 Spring AI 進行模型存取，這些 starter 讓您可以在其之上接入 Koog 的代理編排 — 
而無需替換現有的 Spring AI 配置。

## 與 `koog-spring-boot-starter` 的區別

| | `koog-spring-boot-starter` | `koog-spring-ai` starter |
|---|---|---|
| **LLM 傳輸** | Koog 自有的 HTTP 用戶端（每個供應商一個：OpenAI、Anthropic、Google 等） | 委派至 Spring AI 的 `ChatModel` / `EmbeddingModel` — 任何 Spring AI 支援的供應商皆可自動運作 |
| **配置** | 每個供應商的 `ai.koog.*` 屬性 | 由 Spring AI starter 管理的標準 `spring.ai.*` 屬性 |
| **何時使用** | 您希望 Koog 直接管理 LLM 連線 | 您已使用 Spring AI 進行模型存取，並希望在其之上接入 Koog 的代理編排 |

這兩種方式是相互獨立的 — 請根據您偏好的 LLM 連線管理方式擇一使用。
關於直接使用 Koog starter 的方式，請參閱 [Spring Boot 整合](spring-boot.md)。

## 可用的 Starter

| 模組 | 用途 |
|---|---|
| `koog-spring-ai-starter-model-chat` | 將 Spring AI 的 `ChatModel`（包含選用的 `ModerationModel`）適配為 Koog 的 `LLMClient` 與 `PromptExecutor` |
| `koog-spring-ai-starter-model-embedding` | 將 Spring AI 的 `EmbeddingModel` 適配為 Koog 的 `LLMEmbeddingProvider` |

每個 starter 都是完全獨立的 Spring Boot starter，擁有自己的自動配置、配置屬性與調度器管理。

## 聊天模型 Starter

### 總覽

`koog-spring-ai-starter-model-chat` starter 橋接了 Spring AI 的聊天模型抽象與 Koog 代理架構。
它會自動配置：

- 一個 Koog `LLMClient` (`SpringAiLLMClient`)，委派至 Spring AI 的 `ChatModel`
- 一個從所有可用 `LLMClient` bean 組裝而成的 `PromptExecutor` (`MultiLLMPromptExecutor`)

工具始終由 Koog 代理架構執行 — Spring AI 僅接收工具定義/架構。在所有帶有工具的請求中，`internalToolExecutionEnabled` 旗標皆設定為 `false`。

### 新增相依性

將此相依性與任何 Spring AI 模型 starter（例如 Google）一同加入：

=== "Gradle (Kotlin DSL)"

    ```kotlin
    // build.gradle.kts
    dependencies {
        implementation("ai.koog:koog-agents-jvm:$koogVersion")
        implementation("ai.koog:koog-spring-ai-starter-model-chat:$koogVersion")
        implementation("org.springframework.ai:spring-ai-starter-model-google-genai")
    }
    ```

=== "Maven"

    ```xml
    <dependencies>
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents-jvm</artifactId>
            <version>${koog.version}</version>
        </dependency>
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-spring-ai-starter-model-chat</artifactId>
            <version>${koog.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-google-genai</artifactId>
        </dependency>
    </dependencies>
    ```

請確保您的專案具備：

- Spring Boot 3（需要 Java 17 或更高版本）
- 2.3.10+ 版本之 Kotlin 程式庫 (kotlin-stdlib)
- 您所選供應商的 Spring AI 模型 starter

### 支援的供應商
Anthropic, Azure OpenAI, Bedrock Converse, Deepseek, Google GenAI, HuggingFace, MiniMax, Mistral AI, OCI GenAI, Ollama, OpenAI, Vertex AI, ZhiPu AI

### 配置

如有需要，請修改您的 Spring Boot 屬性：

```properties
# 填寫您的 Gemini Developer API 金鑰，或透過環境變數傳遞
spring.ai.google.genai.api-key=YOUR_GOOGLE_API_KEY
# 預設值
spring.ai.model.chat=google-genai
koog.spring.ai.chat.enabled=true
koog.spring.ai.chat.dispatcher.type=AUTO
```

如果您只有單個 `ChatModel` bean，一切都會自動運作 — 適配器會將其封裝為 Koog 的 `LLMClient` 並建立一個開箱即用的 `PromptExecutor`。

### 使用範例

注入 `PromptExecutor` 並用其執行 Koog 代理：

=== "Kotlin"

    ```kotlin
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import ai.koog.prompt.executor.model.PromptExecutor
    import org.springframework.stereotype.Service

    @Service
    class MyAgentService(private val promptExecutor: PromptExecutor) {

        suspend fun askAgent(userMessage: String): String {
            val agent = AIAgent(
                promptExecutor = promptExecutor,
                llmModel = GoogleModels.Gemini2_5Flash,
                systemPrompt = "You are a helpful assistant."
            )

            return agent.run(userMessage)
        }
    }
    ```

=== "Java"

    ```java
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.google.GoogleModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import org.springframework.stereotype.Service;

    @Service
    public class MyAgentService {
        private final PromptExecutor promptExecutor;

        public MyAgentService(PromptExecutor promptExecutor) {
            this.promptExecutor = promptExecutor;
        }

        public String askAgent(String userMessage) {
            var agent = AIAgent.builder()
                    .promptExecutor(promptExecutor)
                    .llmModel(GoogleModels.Gemini2_5Flash)
                    .systemPrompt("You are a helpful assistant.")
                    .build();

            return agent.run(userMessage);
        }
    }
    ```

或者提供您自己的 `PromptExecutor` bean 來完全覆蓋自動配置的 bean。

### 配置屬性 (`koog.spring.ai.chat`)

| 屬性 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `enabled` | `Boolean` | `true` | 啟用/停用聊天自動配置 |
| `chat-model-bean-name` | `String?` | `null` | 要使用的 `ChatModel` bean 名稱（用於多模型上下文） |
| `moderation-model-bean-name` | `String?` | `null` | 要使用的 `ModerationModel` bean 名稱（用於多模型上下文） |
| `provider` | `String?` | `null` | LLM 供應商 ID（例如 `openai`, `anthropic`, `google`）。設定後會覆蓋從 `ChatModel` 類別名稱自動偵測的結果。若自動偵測失敗，則回退至 `spring-ai`。 |
| `dispatcher.type` | `AUTO` / `IO` | `AUTO` | 用於阻塞式模型呼叫的調度器 |
| `dispatcher.parallelism` | `Int` | `0` (= 無限制) | `IO` 調度器的最大並行數 (0 = 不限) |

### 調度器類型

- **`AUTO`** (預設)：如果可用，使用 Spring 管理的 `AsyncTaskExecutor`（例如在 Spring Boot 3.2+ 中開啟 `spring.threads.virtual.enabled=true` 時），否則回退至 `Dispatchers.IO`。這讓您只需透過一個標準的 Spring Boot 屬性即可選用虛擬執行緒。
- **`IO`**：始終使用 `Dispatchers.IO`。當 `dispatcher.parallelism` 大於 0 時，使用 `Dispatchers.IO.limitedParallelism(parallelism)` 來限制並行數。

### 多模型上下文

當註冊了多個 `ChatModel` 或 `ModerationModel` bean 時，請指定要使用哪一個：

```properties
koog.spring.ai.chat.chat-model-bean-name=openAiChatModel
koog.spring.ai.chat.moderation-model-bean-name=openAiModerationModel
```

若沒有選擇器，自動配置僅在存在單一候選對象時才會啟動。

### 擴充點

- **`ChatOptionsCustomizer`**：註冊一個實作此功能介面的 Spring bean，以套用特定供應商的 `ChatOptions` 微調：

=== "Kotlin"

    ```kotlin
    @Bean
    fun chatOptionsCustomizer() = ChatOptionsCustomizer { options, params, model ->
        // 根據模型或請求參數套用自訂選項
        options
    }
    ```

=== "Java"

    ```java
    @Bean
    public ChatOptionsCustomizer chatOptionsCustomizer() {
        return (options, params, model) -> {
            // 根據模型或請求參數套用自訂選項
            return options;
        };
    }
    ```

  自動配置會透過選用注入自動取得該定義。

- **自訂 `LLMClient`**：註冊您自己的 `LLMClient` bean，以完全覆蓋自動配置的適配器。
- **自訂 `PromptExecutor`**：註冊您自己的 `PromptExecutor` bean，以完全覆蓋自動配置的 `MultiLLMPromptExecutor`。

## 後續步驟

- 了解 [基礎代理](agents/basic-agents.md) 以建置極簡的 AI 工作流
- 探索 [圖形基礎代理](agents/graph-based-agents.md) 以處理進階使用案例
- 查看 [工具總覽](tools-overview.md) 以擴展代理的能力
- 參考 [範例](examples.md) 查看實際開發中的實作
- 閱讀 [Spring Boot 整合](spring-boot.md) 指南以了解直接使用 Koog starter 的方式