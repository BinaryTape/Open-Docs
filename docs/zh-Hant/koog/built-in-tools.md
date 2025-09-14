# 內建工具

Koog 框架提供內建工具，用於處理代理程式與使用者互動的常見情境。

以下是可用的內建工具：

| 工具              | <div style="width:115px">名稱</div> | 說明                                                                                                           |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser         | `__say_to_user__`                   | 讓代理程式傳送訊息給使用者。它會將代理程式訊息以 `Agent says: ` 前綴印出至控制台。 |
| AskUser           | `__ask_user__`                      | 讓代理程式向使用者請求輸入。它會將代理程式訊息印出至控制台並等待使用者回應。        |
| ExitTool          | `__exit__`                          | 讓代理程式結束對話並終止會話。                                                     |
| ReadFileTool      | `__read_file__`                     | 讀取文字檔，可選行數範圍。傳回格式化內容，其中包含使用 0 基底行索引的後設資料。 |
| EditFileTool      | `__edit_file__`                     | 在檔案中進行單一、有針對性的文字替換；也可以建立新檔案或完全替換內容。               |
| ListDirectoryTool | `__list_directory__`                | 將目錄內容列為分層樹狀結構，並可選深度控制和 glob 過濾。                          |
| WriteFileTool     | `__write_file__`                    | 將文字內容寫入檔案（如有需要會建立上層目錄）。                                                   |

## 註冊內建工具

如同任何其他工具，內建工具必須加入到工具註冊表才能供代理程式使用。以下是一個範例：

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
// 建立一個包含所有內建工具的工具註冊表
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// 在建立代理程式時傳入註冊表
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

您可以透過在同一個註冊表中結合內建工具和自訂工具，為您的代理程式建立一套全面的功能。
若要深入了解自訂工具，請參閱 [基於註解的工具](annotation-based-tools.md) 和 [基於類別的工具](class-based-tools.md)。