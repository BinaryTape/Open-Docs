# 內建工具

Koog 架構為 Kotlin 與 Java 提供了內建工具，用來處理代理（agent）與使用者互動的常見情境。

可用的內建工具如下：

| 工具 | <div style="width:115px">名稱</div> | 描述 |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser | `__say_to_user__` | 讓代理傳送訊息給使用者。它會在主控台中印出代理訊息，並帶有 `Agent says: ` 前置字元。 |
| AskUser | `__ask_user__` | 讓代理要求使用者輸入。它會在主控台中印出代理訊息並等待使用者回應。 |
| ExitTool | `__exit__` | 讓代理結束對話並終止工作階段。 |
| ReadFileTool | `__read_file__` | 讀取文字檔，可選擇行範圍。使用以 0 為起始的行索引傳回包含元資料的格式化內容。 |
| EditFileTool | `__edit_file__` | 對檔案執行單一且具針對性的文字取代；也可以建立新檔案或完全取代內容。 |
| ListDirectoryTool | `__list_directory__` | 以階層式樹狀結構列出目錄內容，可選擇控制深度與使用 glob 篩選。 |
| WriteFileTool | `__write_file__` | 將文字內容寫入檔案（必要時會建立父目錄）。 |

## 註冊內建工具

與任何其他工具一樣，必須將內建工具新增至工具登錄（tool registry）中，代理才能使用。以下是一個範例：

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
// 建立包含所有內建工具的工具登錄
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// 在建立代理時傳遞該登錄
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

您可以在 Kotlin 與 Java 中，透過在同一個登錄中組合內建工具與自訂工具，為您的代理建立一套全方位的功能集。
若要了解更多關於自訂工具的資訊，請參閱 [以註解為基礎的工具 (Annotation-based tools)](annotation-based-tools.md) 與 [以類別為基礎的工具 (Class-based tools)](class-based-tools.md)。