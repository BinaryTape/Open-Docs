# スキルの利用

Koogスキルを使用すると、エージェントはファイルシステムから再利用可能な機能バンドル（capability bundles）を検出し、生成されたプロンプトセクションを通じてそれらをモデルに公開できます。

ハイレベルでは、利用方法は3つの要素で構成されます。

1. 1つ以上のルートディレクトリからスキルを検出する。
2. 検出されたメタデータからスキルプロンプトブロックを生成する。
3. 生成されたブロックをエージェントの `system` プロンプトに追加し、エージェントがファイルの検査やスキルスクリプトの実行に使用できるツールを提供する。

## 例：システムプロンプトへのスキルの追加

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

    // スクリプト実行ツールの実装に置き換えてください。
    val apiKey = System.getenv("OPENAI_API_KEY")
        ?: error("APIキーが設定されていません。")

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
            // 追加のツール...
        },
    )
}

```
<!--- KNIT example-skills-usage-01.kt -->

## 必要な構成要素

- `discoverSkills(...)` は設定されたディレクトリをスキャンし、検出されたスキルの記述子（descriptors）を返します。
- `generateSkillsPrompt(...)` は、検出されたスキルをプロンプトテキストに変換します（`SkillsPromptFormat.XML` が一般的な選択肢です）。
- 生成されたテキストは、モデルが利用可能なスキルについて推論できるように、エージェントの `system` プロンプトに埋め込む必要があります。
- ツールレジストリには、ワークフローに必要なツールを含める必要があります。通常は以下の通りです：
  - ファイルの検出/読み取りツール（スキルの透明な公開のため）
  - スキルスクリプトを実行するために使用される1つ以上の実行ツール

## 期待される動作

スキルプロンプトが存在し、対応するツールが登録されている場合、エージェントは以下のことが可能です：

- スキルファイルの検出
- スキル定義の読み取り
- 関連するタスクのための実行ツールの実行（例：適切な引数を使用したPythonスクリプトの実行）

詳細は [Agent Skills](https://agentskills.io/home) のドキュメントを参照してください。

## 実践的なヒント

- スキルは専用のディレクトリに保持し、相対パスのルートが変動する可能性のある実行環境では絶対パスを渡すようにしてください。
- スキルが静的な場合は、検出に読み取り専用のファイルプロバイダーを使用します（例：`JVMFileSystemProvider.ReadOnly`）。
- スクリプト実行ツールは、スコープを絞り、型安全（構造化された引数/結果）に保ち、スクリプトパスの処理を検証してください。