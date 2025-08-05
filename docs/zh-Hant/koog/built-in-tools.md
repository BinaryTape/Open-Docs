# 內建工具

Koog 框架提供內建工具，用於處理代理程式與使用者互動的常見情境。

以下是可用的內建工具：

| 工具      | <div style="width:115px">名稱</div> | 說明                                                                                                           |
|-----------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| SayToUser | `__say_to_user__`                   | 讓代理程式傳送訊息給使用者。它會將代理程式訊息以 `Agent says: ` 前綴印出至控制台。 |
| AskUser   | `__ask_user__`                      | 讓代理程式向使用者請求輸入。它會將代理程式訊息印出至控制台並等待使用者回應。        |
| ExitTool  | `__exit__`                          | 讓代理程式結束對話並終止會話。                                                     |

## 註冊內建工具

如同任何其他工具，內建工具必須加入到工具註冊表才能供代理程式使用。以下是一個範例：

```kotlin
// 建立一個包含所有內建工具的工具註冊表
val toolRegistry = ToolRegistry {
    tool(SayToUser())
    tool(AskUser())
    tool(ExitTool())
}

// 在建立代理程式時傳入註冊表
val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)
```

您可以透過在同一個註冊表中結合內建工具和自訂工具，為您的代理程式建立一套全面的功能。
若要深入了解自訂工具，請參閱 [基於註解的工具](annotation-based-tools.md) 和 [進階實作](advanced-tool-implementation.md)。