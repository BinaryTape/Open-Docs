# 内置工具

Koog 框架提供内置工具，用于处理代理与用户交互的常见场景。

以下是可用的内置工具：

| Tool              | <div style="width:115px">名称</div> | Description                                                                                                              |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser         | `__say_to_user__`                   | 允许代理向用户发送消息。它会将代理消息打印到控制台，并带有 `Agent says: ` 前缀。    |
| AskUser           | `__ask_user__`                      | 允许代理向用户请求输入。它会将代理消息打印到控制台并等待用户响应。           |
| ExitTool          | `__exit__`                          | 允许代理结束对话并终止会话。                                                        |
| ReadFileTool      | `__read_file__`                     | 读取文本文件，支持可选的行范围选择。返回带有元数据和基于 0 的行索引的格式化内容。 |
| EditFileTool      | `__edit_file__`                     | 对文件进行单次、有针对性的文本替换；也可以创建新文件或完全替换其内容。                 |
| ListDirectoryTool | `__list_directory__`                | 列出目录内容，以分层树状结构显示，支持可选的深度控制和 glob 过滤。                          |
| WriteFileTool     | `__write_file__`                    | 将文本内容写入文件（如有需要，可创建父目录）。                                                   |

## 注册内置工具

与任何其他工具一样，内置工具必须添加到工具注册表才能供代理使用。下面是一个示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.ExitTool
import ai.koog.agents.ext.tool.file.ListDirectoryTool
import ai.koog.agents.ext.tool.file.ReadFileTool
import ai.koog.agents.ext.tool.file.WriteFileTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.rag.base.files.JVMFileSystemProvider

const val apiToken = ""

-->
```kotlin
// Create a tool registry with all built-in tools
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// Pass the registry when creating an agent
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

通过在同一个注册表中结合内置工具和自定义工具，你可以为你的代理创建一套全面的能力。
要了解有关自定义工具的更多信息，请参见[基于注解的工具](annotation-based-tools.md)和[基于类的工具](class-based-tools.md)。