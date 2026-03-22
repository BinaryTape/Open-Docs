# 具有记忆功能的聊天后端

`ChatMemory` 功能的一个常见模式是代表客户端管理智能体交互的后端服务。
每个 HTTP 请求都携带一个会话 ID，智能体加载匹配的对话历史记录，生成并返回响应，并存储更新后的聊天历史记录，为下一次交互做好准备。

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

// --- 服务 ---

@Service
class ChatAgentService(private val executor: SingleLLMPromptExecutor) {
    private val toolRegistry = ToolRegistry {
        // 在此处注册您的工具
    }

    private val agent = AIAgent(
        promptExecutor = executor,
        llmModel = OpenAIModels.Chat.GPT4oMini,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry,
    ) {
        install(ChatMemory) {
            chatHistoryProvider = MyDatabaseProvider() // 持久化存储
            windowSize(50)
        }
    }

    suspend fun chat(sessionId: String, message: String): String {
        return agent.run(message, sessionId)
    }
}
```

有关在 Spring Boot 中设置 Koog 的完整指南，请参阅 [Spring Boot 集成指南](../../spring-boot.md)。