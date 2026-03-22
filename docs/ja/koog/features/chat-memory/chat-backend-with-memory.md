# メモリ機能付きチャットバックエンド

`ChatMemory` 機能の一般的なパターンは、クライアントに代わってエージェントとのやり取りを管理するバックエンドサービスです。
各 HTTP リクエストはセッション ID を保持し、エージェントは一致する会話履歴をロードしてレスポンスを生成・返却し、次回のやり取りに備えて更新されたチャット履歴を保存します。

```kotlin
// --- コントローラー ---

@RestController
class ChatController(private val agentService: ChatAgentService) {
    @PostMapping("/chat")
    suspend fun chat(@RequestBody request: ChatRequest): ChatResponse {
        val reply = agentService.chat(request.sessionId, request.message)
        return ChatResponse(reply)
    }
}

// --- サービス ---

@Service
class ChatAgentService(private val executor: SingleLLMPromptExecutor) {
    private val toolRegistry = ToolRegistry {
        // ここでツールを登録します
    }

    private val agent = AIAgent(
        promptExecutor = executor,
        llmModel = OpenAIModels.Chat.GPT4oMini,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry,
    ) {
        install(ChatMemory) {
            chatHistoryProvider = MyDatabaseProvider() // 永続ストレージ
            windowSize(50)
        }
    }

    suspend fun chat(sessionId: String, message: String): String {
        return agent.run(message, sessionId)
    }
}
```

Koog を Spring Boot でセットアップするための完全なガイドについては、
[Spring Boot 統合ガイド](../../spring-boot.md)を参照してください。