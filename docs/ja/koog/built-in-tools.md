# ビルトインツール

Koogフレームワークは、エージェントとユーザーの一般的な対話シナリオを処理するビルトインツールを提供します。

以下のビルトインツールが利用可能です:

| ツール              | <div style="width:115px">名前</div> | 説明                                                                                                          |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser         | `__say_to_user__`                   | エージェントがユーザーにメッセージを送信できるようにします。`Agent says: `プレフィックス付きでエージェントのメッセージをコンソールに出力します。 |
| AskUser           | `__ask_user__`                      | エージェントがユーザーに入力を求められるようにします。エージェントのメッセージをコンソールに出力し、ユーザーの応答を待ちます。 |
| ExitTool          | `__exit__`                          | エージェントが会話を終了し、セッションを終了できるようにします。 |
| ReadFileTool      | `__read_file__`                     | テキストファイルを読み込みます（オプションで行範囲選択可能）。0から始まる行インデックスを使用して、フォーマットされた内容とメタデータを返します。 |
| EditFileTool      | `__edit_file__`                     | ファイル内で単一の特定テキスト置換を行い、新しいファイルを作成したり、内容を完全に置き換えたりすることもできます。 |
| ListDirectoryTool | `__list_directory__`                | ディレクトリの内容を、オプションの深さ制御とグロブフィルタリングを使用して、階層ツリーとして一覧表示します。 |
| WriteFileTool     | `__write_file__`                    | テキストコンテンツをファイルに書き込みます（必要に応じて親ディレクトリを作成します）。 |

## ビルトインツールの登録

他のツールと同様に、ビルトインツールもエージェントが利用できるようにするためにツールレジストリに追加する必要があります。以下に例を示します:

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

同じレジストリ内でビルトインツールとカスタムツールを組み合わせることで、エージェント向けの包括的な機能セットを作成できます。
カスタムツールの詳細については、[アノテーションベースのツール](annotation-based-tools.md)および[クラスベースのツール](class-based-tools.md)を参照してください。