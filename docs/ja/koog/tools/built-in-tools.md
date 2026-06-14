# ビルトインツール

Koogは、エージェントとユーザーの対話における迅速なプロトタイピングや実験を支援するために、KotlinおよびJava向けのビルトインツールを提供しています。
これらのツールは本番環境での使用を意図したものではありません。使用するには、依存関係に `ai.koog:agents-ext` を追加してください。
以下のビルトインツールが利用可能です：

| ツール | <div style="width:115px">名前</div> | 説明 |
|-------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| SayToUser | `__say_to_user__` | エージェントがユーザーにメッセージを送信できるようにします。`Agent says: ` というプレフィックスを付けて、エージェントのメッセージをコンソールに出力します。 |
| AskUser | `__ask_user__` | エージェントがユーザーに入力を求められるようにします。エージェントのメッセージをコンソールに出力し、ユーザーの応答を待ちます。 |
| ExitTool | `__exit__` | エージェントが会話を終了し、セッションを終了できるようにします。 |
| ReadFileTool | `__read_file__` | オプションで行範囲を指定してテキストファイルを読み取ります。0ベースの行インデックスを使用したメタデータ付きのフォーマット済みコンテンツを返します。 |
| EditFileTool | `__edit_file__` | ファイル内のテキストをターゲットを絞って一箇所置換します。新しいファイルの作成や、コンテンツ全体の置換も可能です。 |
| ListDirectoryTool | `__list_directory__` | ディレクトリの内容を、オプションの深度制御とグロブフィルタリングを使用して階層ツリーとしてリスト表示します。 |
| WriteFileTool | `__write_file__` | テキストコンテンツをファイルに書き込みます（必要に応じて親ディレクトリを作成します）。 |

## ビルトインツールの登録

他のツールと同様に、ビルトインツールをエージェントで利用できるようにするには、ツールレジストリに追加する必要があります。例を以下に示します：

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
// すべてのビルトインツールを含むツールレジストリを作成する
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tool(ExitTool)
    tool(ReadFileTool(JVMFileSystemProvider.ReadOnly))
    tool(ListDirectoryTool(JVMFileSystemProvider.ReadOnly))
    tool(WriteFileTool(JVMFileSystemProvider.ReadWrite))
}

// エージェント作成時にレジストリを渡す
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiToken),
    systemPrompt = "You are a helpful assistant.",
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

```
<!--- KNIT example-built-in-tools-01.kt -->

KotlinとJavaの両方で、同じレジストリ内にビルトインツールとカスタムツールを組み合わせることで、エージェントのための包括的な機能セットを作成できます。
カスタムツールの詳細については、[アノテーションベースのツール](annotation-based-tools.md)および[クラスベースのツール](class-based-tools.md)を参照してください。