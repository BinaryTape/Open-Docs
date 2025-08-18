# 内置工具

Koog 框架提供内置工具，用于处理代理与用户交互的常见场景。

以下是可用的内置工具：

| 工具      | <div style="width:115px">名称</div> | 描述                                                                                                          |
|-----------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| SayToUser | `__say_to_user__`                   | 允许代理向用户发送消息。它会将代理消息打印到控制台，并带有 `Agent says: ` 前缀。 |
| AskUser   | `__ask_user__`                      | 允许代理向用户请求输入。它会将代理消息打印到控制台并等待用户响应。        |
| ExitTool  | `__exit__`                          | 允许代理结束对话并终止会话。                                                     |

## 注册内置工具

与任何其他工具一样，内置工具必须添加到工具注册表才能供代理使用。下面是一个示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.ExitTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiToken = ""

-->
```kotlin
// Create a tool registry with all built-in tools
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
}

// Pass the registry when creating an agent
val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

通过在同一个注册表中结合内置工具和自定义工具，你可以为你的代理创建一套全面的能力。
要了解有关自定义工具的更多信息，请参见[基于注解的工具](annotation-based-tools.md)和[基于类的工具](class-based-tools.md)。