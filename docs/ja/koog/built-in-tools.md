# ビルトインツール

Koog フレームワークは、エージェントとユーザーの対話における一般的なシナリオを処理する Kotlin および Java 用のビルトインツールを提供します。

以下のビルトインツールが利用可能です。

| ツール              | <div style="width:115px">名前</div> | 説明                                                                                                              |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser         | `__say_to_user__`                   | エージェントがユーザーにメッセージを送信できるようにします。エージェントのメッセージを、`Agent says: ` というプレフィックスを付けてコンソールに出力します。 |
| AskUser           | `__ask_user__`                      | エージェントがユーザーに入力を求めることができるようにします。エージェントのメッセージをコンソールに出力し、ユーザーの応答を待ちます。           |
| ExitTool          | `__exit__`                          | エージェントが会話を終了し、セッションを終了できるようにします。                                                               |
| ReadFileTool      | `__read_file__`                     | オプションで行範囲を指定してテキストファイルを読み込みます。0から始まる行インデックスを使用して、メタデータとともにフォーマットされたコンテンツを返します。 |
| EditFileTool      | `__edit_file__`                     | ファイル内で特定のテキストを 1 箇所置換します。新しいファイルの作成や、コンテンツの完全な置換も可能です。                |
| ListDirectoryTool | `__list_directory__`                | ディレクトリの内容を階層ツリーとしてリスト表示します。オプションで深度制御やグロブフィルタリングが可能です。                          |
| WriteFileTool     | `__write_file__`                    | テキストコンテンツをファイルに書き込みます（必要に応じて親ディレクトリを作成します）。                                                   |

## ビルトインツールの登録

他のツールと同様に、エージェントがビルトインツールを利用できるようにするには、ツールレジストリに追加する必要があります。以下に例を示します。

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
// すべてのビルトインツールを含むツールレジストリを作成します
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// エージェント作成時にレジストリを渡します
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

Kotlin と Java の両方において、同じレジストリ内でビルトインツールとカスタムツールを組み合わせることで、エージェントのための包括的な機能セットを作成できます。
カスタムツールの詳細については、[アノテーションベースのツール](annotation-based-tools.md)および[クラスベースのツール](class-based-tools.md)を参照してください。