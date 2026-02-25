# 內建工具

Koog 架構提供內建工具，用於處理代理與使用者互動的常見情境。

以下是可用的內建工具：

| 工具 | <div style="width:115px">名稱</div> | 說明 |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser         | `__say_to_user__`                   | 讓代理傳送訊息給使用者。它會在主控台印出帶有 `Agent says: ` 前綴的代理訊息。 |
| AskUser           | `__ask_user__`                      | 讓代理向使用者要求輸入。它會在主控台印出代理訊息並等待使用者回應。 |
| ExitTool          | `__exit__`                          | 讓代理結束對話並終止工作階段。 |
| ReadFileTool      | `__read_file__`                     | 讀取文字檔，可選擇行範圍。使用以 0 為基底的行索引傳回包含元資料的格式化內容。 |
| EditFileTool      | `__edit_file__`                     | 在檔案中進行單一且具針對性的文字替換；也可以建立新檔案或完全替換內容。 |
| ListDirectoryTool | `__list_directory__`                | 將目錄內容列出為階層式樹狀結構，可選擇深度控制與 glob 篩選。 |
| WriteFileTool     | `__write_file__`                    | 將文字內容寫入檔案（如有需要則建立上層目錄）。 |

## 註冊內建工具

就像任何其他工具一樣，內建工具必須加入到工具登錄表 (tool registry) 才能供代理使用。以下是一個範例：

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
// 建立包含所有內建工具的工具登錄表
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// 建立代理時傳遞登錄表
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

您可以透過在同一個登錄表中組合內建工具與自訂工具，為您的代理建立一套完整的功能。
若要了解更多關於自訂工具的資訊，請參閱 [以註解為基礎的工具](annotation-based-tools.md) 與 [以類別為基礎的工具](class-based-tools.md)。