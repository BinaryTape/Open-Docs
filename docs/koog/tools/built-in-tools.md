# 内置工具

Koog 为 Kotlin 和 Java 提供了内置工具，帮助您快速构建原型并实验智能体与用户的交互。
这些工具不适用于生产环境。要使用它们，请将 `ai.koog:agents-ext` 添加到您的依赖项中。
以下是可用的内置工具：

| 工具 | <div style="width:115px">名称</div> | 描述 |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser         | `__say_to_user__`                   | 允许智能体向用户发送消息。它将智能体消息打印到控制台，并带有 `Agent says: ` 前缀。 |
| AskUser           | `__ask_user__`                      | 允许智能体向用户请求输入。它将智能体消息打印到控制台并等待用户响应。 |
| ExitTool          | `__exit__`                          | 允许智能体完成对话并终止会话。 |
| ReadFileTool      | `__read_file__`                     | 读取文本文件，支持可选的行范围选择。返回带有元数据的格式化内容，使用从 0 开始的行索引。 |
| EditFileTool      | `__edit_file__`                     | 对文件进行单个、有针对性的文本替换；也可以创建新文件或完全替换内容。 |
| ListDirectoryTool | `__list_directory__`                | 以层次结构树的形式列出目录内容，支持可选的深度控制和 glob 筛选。 |
| WriteFileTool     | `__write_file__`                    | 将文本内容写入文件（根据需要创建父目录）。 |

## 注册内置工具

与任何其他工具一样，内置工具必须添加到工具注册表才能供智能体使用。示例如下：

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
// 创建一个包含所有内置工具的工具注册表
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

通过在 Kotlin 和 Java 的同一个注册表中组合内置工具和自定义工具，您可以为您的智能体创建一套全面的功能。
要了解更多关于自定义工具的信息，请参阅[基于注解的工具](annotation-based-tools.md)和[基于类的工具](class-based-tools.md)。