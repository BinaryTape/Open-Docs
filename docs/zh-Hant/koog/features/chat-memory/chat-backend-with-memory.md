# 具備記憶功能的聊天後端

`ChatMemory` 功能的一個常見模式是代表用戶端管理代理互動的後端服務。
每個 HTTP 請求都帶有一個工作階段 ID，代理會載入相應的對話歷程記錄，
產生並傳回回應，並儲存更新後的聊天記錄以供下一次互動使用。

```kotlin
// --- 控制器 ---

@RestController
class ChatController(private val agentService: ChatAgentService) {
    @PostMapping("/chat")
    suspend fun chat(@RequestBody request: ChatRequest): ChatResponse {
        val reply = agentService.chat(request.sessionId, request.message)
        return ChatResponse(reply)
    }
}

// --- 服務 ---

@Service
class ChatAgentService(private val executor: SingleLLMPromptExecutor) {
    private val toolRegistry = ToolRegistry {
        // 在此處註冊您的工具
    }

    private val agent = AIAgent(
        promptExecutor = executor,
        llmModel = OpenAIModels.Chat.GPT4oMini,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry,
    ) {
        install(ChatMemory) {
            chatHistoryProvider = MyDatabaseProvider() // 持久化儲存
            windowSize(50)
        }
    }

    suspend fun chat(sessionId: String, message: String): String {
        return agent.run(message, sessionId)
    }
}
```

如需關於如何將 Koog 與 Spring Boot 搭配設定的完整指南，請參閱
[Spring Boot 整合指南](../../spring-boot.md)。