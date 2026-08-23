# 技能使用

Koog 技能讓代理可以從檔案系統中探索可重複使用的功能套件，並透過產生的提示詞區段將其公開給模型。

高階的使用方式包含三個部分：

1.  從一個或多個根目錄探索技能。
2.  從探索到的元資料產生技能提示詞區塊。
3.  將產生的區塊新增至代理的 `system` 提示詞中，並提供代理可用來檢查檔案和執行技能指令碼的工具。

## 範例：將技能新增至系統提示詞

```kotlin

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.file.ListDirectoryTool
import ai.koog.agents.ext.tool.file.ReadFileTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.rag.base.files.JVMFileSystemProvider
import ai.koog.skills.discovery.discoverSkills
import ai.koog.skills.prompt.SkillsPromptFormat
import ai.koog.skills.prompt.generateSkillsPrompt
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val skillsRoot = "/absolute/path/to/skills"
    val discoveredSkills = discoverSkills(JVMFileSystemProvider.ReadOnly, listOf(skillsRoot))
    val generatedSkillsPrompt = generateSkillsPrompt(discoveredSkills, SkillsPromptFormat.XML)

    // 替換為您的指令碼執行工具實作。
    val apiKey = System.getenv("OPENAI_API_KEY")
        ?: error("API 金鑰未設定。")

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = """
                You are a careful assistant.
                Use the available skills listed below.
                Before using a skill script, disclose the skills by listing and reading files with tools.

                $generatedSkillsPrompt
                """.trimIndent(),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = ToolRegistry {
            tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
            tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
            // 其他工具...
        },
    )
}

```
<!--- KNIT example-skills-usage-01.kt -->

## 必要組件

- `discoverSkills(...)` 掃描設定的目錄並回傳探索到的技能描述符。
- `generateSkillsPrompt(...)` 將探索到的技能轉換為提示詞文字（`SkillsPromptFormat.XML` 是常見的選擇）。
- 產生的文字應嵌入到代理的 `system` 提示詞中，以便模型能夠推論可用的技能。
- 工具註冊表必須包含您的工作流所需的工具，通常包括：
  - 檔案探索/讀取工具（用於透明的技能揭露），
  - 一個或多個用於執行技能指令碼的執行工具。

## 行為預期

當技能提示詞存在且註冊了符合的工具時，代理可以：

- 探索技能檔案，
- 讀取技能定義，
- 針對相關任務執行執行工具（例如，使用適當的引數執行 Python 指令碼）。

詳情請參閱 [Agent Skills](https://agentskills.io/home) 文件。

## 實用技巧

- 將技能保存在專用目錄中，並在相對根路徑可能變動的執行環境中傳遞絕對路徑。
- 當技能是靜態時，使用唯讀檔案提供者進行探索（例如 `JVMFileSystemProvider.ReadOnly`）。
- 保持指令碼執行工具的範圍狹窄且型別安全（結構化引數/結果），並驗證指令碼路徑處理。