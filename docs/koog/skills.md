# 技能用法

Koog 技能允许智能体从文件系统中搜索 (discover) 可重用的功能包，并通过生成的提示词部分将其公开给模型。

从高层次来看，用法分为三个部分：

1. 从一个或多个根目录搜索技能。
2. 从搜索到的元数据生成技能提示词块。
3. 将生成的提示词块添加到智能体的 `system` 提示词中，并提供智能体可用于检查文件和执行技能脚本的工具。

## 示例：将技能添加到 system 提示词 {id="example-adding-skills-to-system-prompt"}

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

    // 替换为您的脚本执行工具实现。
    val apiKey = System.getenv("OPENAI_API_KEY")
        ?: error("The API key is not set.")

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = """
                你是一个细心的助手。
                使用下面列出的可用技能。
                在使用技能脚本之前，请通过工具列出并读取文件来公开技能信息。

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

## 核心组件 {id="required-pieces"}

- `discoverSkills(...)` 扫描配置的目录并返回搜索到的技能描述符。
- `generateSkillsPrompt(...)` 将搜索到的技能转换为提示词文本（`SkillsPromptFormat.XML` 是常用选择）。
- 生成的文本应嵌入到智能体的 `system` 提示词中，以便模型能够对可用技能进行推理。
- 工具库 (tool registry) 必须包含工作流所需的工具，通常包括：
  - 文件搜索/读取工具（用于技能信息的透明公开），
  - 一个或多个用于执行技能脚本的执行工具。

## 行为预期 {id="behavior-expectations"}

当提示词中包含技能且注册了匹配的工具时，智能体可以：

- 搜索技能文件，
- 读取技能定义，
- 为相关任务运行执行工具（例如，使用适当的参数运行 Python 脚本）。

详情请参阅 [Agent Skills](https://agentskills.io/home) 文档。

## 实用技巧 {id="practical-tips"}

- 将技能保存在专用目录中，并在相对路径根目录可能发生变化的运行时环境中传递绝对路径。
- 当技能是静态的时，使用只读文件提供程序进行搜索（例如 `JVMFileSystemProvider.ReadOnly`）。
- 保持脚本执行工具的专一性且类型安全（结构化参数/结果），并验证脚本路径的处理方式。