# 메모리 기능이 있는 채팅 백엔드

`ChatMemory` 기능의 일반적인 패턴은 클라이언트를 대신하여 에이전트 상호작용을 관리하는 백엔드 서비스입니다.
각 HTTP 요청은 세션 ID를 포함하며, 에이전트는 일치하는 대화 기록(conversation history)을 로드하고, 응답을 생성하여 반환한 후, 다음 상호작용을 위해 업데이트된 채팅 기록을 저장합니다.

```kotlin
// --- 컨트롤러 ---

@RestController
class ChatController(private val agentService: ChatAgentService) {
    @PostMapping("/chat")
    suspend fun chat(@RequestBody request: ChatRequest): ChatResponse {
        val reply = agentService.chat(request.sessionId, request.message)
        return ChatResponse(reply)
    }
}

// --- 서비스 ---

@Service
class ChatAgentService(private val executor: SingleLLMPromptExecutor) {
    private val toolRegistry = ToolRegistry {
        // 여기에 도구를 등록하세요
    }

    private val agent = AIAgent(
        promptExecutor = executor,
        llmModel = OpenAIModels.Chat.GPT4oMini,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry,
    ) {
        install(ChatMemory) {
            chatHistoryProvider = MyDatabaseProvider() // 영구 저장소
            windowSize(50)
        }
    }

    suspend fun chat(sessionId: String, message: String): String {
        return agent.run(message, sessionId)
    }
}
```

Spring Boot에서 Koog를 설정하는 방법에 대한 전체 가이드는 [Spring Boot 통합 가이드](../../spring-boot.md)를 참조하세요.