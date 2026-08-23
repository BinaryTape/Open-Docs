# 스킬 사용법

Koog 스킬을 사용하면 에이전트가 파일 시스템에서 재사용 가능한 기능 번들(reusable capability bundles)을 검색하고, 생성된 프롬프트 섹션을 통해 이를 모델에 노출할 수 있습니다.

상위 수준에서, 사용법은 다음 세 부분으로 구성됩니다:

1. 하나 이상의 루트 디렉터리에서 스킬을 검색합니다.
2. 검색된 메타데이터로부터 스킬 프롬프트 블록을 생성합니다.
3. 생성된 블록을 에이전트의 `system` 프롬프트에 추가하고, 에이전트가 파일을 검사하고 스킬 스크립트를 실행하는 데 사용할 수 있는 도구를 제공합니다.

## 예제: 시스템 프롬프트에 스킬 추가하기

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

    // 스크립트 실행 도구 구현체로 교체하세요.
    val apiKey = System.getenv("OPENAI_API_KEY")
        ?: error("The API key is not set.")

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
            // 추가 도구...
        },
    )
}

```
<!--- KNIT example-skills-usage-01.kt -->

## 필수 구성 요소

- `discoverSkills(...)`: 설정된 디렉터리를 스캔하고 검색된 스킬 디스크립터(skill descriptors)를 반환합니다.
- `generateSkillsPrompt(...)`: 검색된 스킬을 프롬프트 텍스트로 변환합니다 (`SkillsPromptFormat.XML`이 일반적으로 사용됩니다).
- 생성된 텍스트는 모델이 사용 가능한 스킬에 대해 추론할 수 있도록 에이전트의 `system` 프롬프트에 포함되어야 합니다.
- 도구 레지스트리(tool registry)에는 워크플로에 필요한 도구들이 포함되어야 하며, 일반적으로 다음과 같습니다:
  - 파일 검색/읽기 도구 (투명한 스킬 노출을 위해)
  - 스킬 스크립트를 실행하는 데 사용되는 하나 이상의 실행 도구

## 동작 기대 사항

스킬 프롬프트가 존재하고 일치하는 도구가 등록되면, 에이전트는 다음을 수행할 수 있습니다:

- 스킬 파일 검색
- 스킬 정의 읽기
- 관련 작업에 대한 실행 도구 실행 (예: 적절한 인자와 함께 파이썬 스크립트 실행)

자세한 내용은 [Agent Skills](https://agentskills.io/home) 문서를 참조하세요.

## 실용적인 팁

- 스킬을 전용 디렉터리에 보관하고, 상대 루트가 달라질 수 있는 런타임 환경에서는 절대 경로를 전달하세요.
- 스킬이 정적인 경우(예: `JVMFileSystemProvider.ReadOnly`), 검색을 위해 읽기 전용 파일 제공자를 사용하세요.
- 스크립트 실행 도구는 범위를 좁히고 타입 안전하게(구조화된 인자/결과) 유지하며, 스크립트 경로 처리를 검증하세요.