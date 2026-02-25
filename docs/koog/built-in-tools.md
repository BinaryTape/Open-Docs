# 内置工具

Koog 框架提供了内置工具，用于处理智能体与用户交互的常见场景。

以下是可用的内置工具：

| 工具 | <div style="width:115px">名称</div> | 描述 |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser | `__say_to_user__` | 允许智能体向用户发送消息。 它会将智能体消息打印到控制台，并带有 `Agent says: ` 前缀。 |
| AskUser | `__ask_user__` | 允许智能体向用户请求输入。 它将智能体消息打印到控制台，并等待用户响应。 |
| ExitTool | `__exit__` | 允许智能体结束对话并终止会话。 |
| ReadFileTool | `__read_file__` | 读取文本文件，支持可选的行范围选择。 返回带有元数据的格式化内容，行索引从 0 开始。 |
| EditFileTool | `__edit_file__` | 在文件中进行单一、有针对性的文本替换； 也可以创建新文件或完全替换内容。 |
| ListDirectoryTool | `__list_directory__` | 以层次结构树的形式列出目录内容，支持可选的深度控制和通配符 (glob) 过滤。 |
| WriteFileTool | `__write_file__` | 将文本内容写入文件（如果需要，会创建父目录）。 |

## 注册内置工具

与任何其他工具一样，内置工具必须添加到工具注册表才能供智能体使用。 示例如下：

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
// 创建包含所有内置工具的工具注册表
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// 在创建智能体时传递注册表
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

您可以通过在同一个注册表中组合使用内置工具和自定义工具，为您的智能体创建一套完整的功能集。
要了解更多关于自定义工具的信息，请参阅 [基于注解的工具](annotation-based-tools.md) 和 [基于类的工具](class-based-tools.md)。