# Prompt API

プロンプト API は、本番アプリケーションで大規模言語モデル (LLM) と対話するための包括的なツールキットを提供します。これは以下の機能を提供します。

- 型安全な構造化プロンプトを作成するための **Kotlin DSL**。
- OpenAI、Anthropic、Google、その他の LLM プロバイダー向けの **マルチプロバイダー対応**。
- リトライロジック、エラーハンドリング、タイムアウト設定などの **本番環境向け機能**。
- テキスト、画像、音声、ドキュメントを扱うための **マルチモーダル機能**。

## アーキテクチャの概要

プロンプト API は、主に3つのレイヤーで構成されます。

- **LLM クライアント**: 特定のプロバイダー (OpenAI、Anthropicなど) への低レベルインターフェース。
- **デコレーター**: リトライロジックなどの機能を追加するオプションのラッパー。
- **プロンプトエグゼキューター**: クライアントのライフサイクルを管理し、使用を簡素化する高レベルの抽象化。

## プロンプトの作成

プロンプト API は、Kotlin DSL を使用してプロンプトを作成します。以下の種類のメッセージをサポートしています。

- `system`: LLMのコンテキストと指示を設定します。
- `user`: ユーザー入力を表します。
- `assistant`: LLMのレスポンスを表します。

シンプルなプロンプトの例を以下に示します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val prompt = prompt("prompt_name", LLMParams()) {
    // コンテキストを設定するためのシステムメッセージを追加します
    system("You are a helpful assistant.")

    // ユーザーメッセージを追加します
    user("Tell me about Kotlin")

    // Few-shotの例としてアシスタントメッセージを追加することもできます
    assistant("Kotlin is a modern programming language...")

    // 別のユーザーメッセージを追加します
    user("What are its key features?")
}
```
<!--- KNIT example-prompt-api-01.kt -->

## マルチモーダル入力

プロンプト内でテキストメッセージを提供するだけでなく、Koog では`user`メッセージとともに画像、音声、動画、ファイルを LLM に送信することもできます。
標準的なテキストのみのプロンプトと同様に、プロンプト構築のための DSL 構造を使用してメディアをプロンプトに追加します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("multimodal_input") {
    system("You are a helpful assistant.")

    user {
        +"Describe these images"

        attachments {
            image("https://example.com/test.png")
            image(Path("/User/koog/image.png"))
        }
    }
}
```
<!--- KNIT example-prompt-api-02.kt -->

### テキストプロンプトコンテンツ

さまざまなアタッチメントタイプをサポートし、プロンプト内のテキスト入力とファイル入力を明確に区別するために、テキストメッセージはユーザープロンプト内の専用の`content`パラメータに配置します。
ファイル入力を追加するには、`attachments`パラメータ内のリストとして提供します。

テキストメッセージとアタッチメントのリストを含むユーザーメッセージの一般的な形式は以下のとおりです。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user(
    content = "This is the user message",
    attachments = listOf(
        // アタッチメントを追加
    )
)
```
<!--- KNIT example-prompt-api-03.kt -->

### ファイルアタッチメント

アタッチメントを含めるには、以下の形式に従って`attachments`パラメータにファイルを提供します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.message.Attachment
import ai.koog.prompt.message.AttachmentContent

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user(
    content = "Describe this image",
    attachments = listOf(
        Attachment.Image(
            content = AttachmentContent.URL("https://example.com/capture.png"),
            format = "png",
            mimeType = "image/png",
            fileName = "capture.png"
        )
    )
)
```
<!--- KNIT example-prompt-api-04.kt -->

`attachments`パラメータはファイル入力のリストを受け取り、各項目は以下のクラスのいずれかのインスタンスです。

- `Attachment.Image`: `jpg`や`png`ファイルなどの画像アタッチメント。
- `Attachment.Audio`: `mp3`や`wav`ファイルなどの音声アタッチメント。
- `Attachment.Video`: `mpg`や`avi`ファイルなどの動画アタッチメント。
- `Attachment.File`: `pdf`や`txt`ファイルなどのファイルアタッチメント。

上記の各クラスは以下のパラメータを受け取ります。

| 名前 | データ型 | 必須 | 説明 |
|---|---|---|---|
| `content` | [AttachmentContent](#attachmentcontent) | Yes | 提供されるファイルコンテンツのソースです。詳細については、[AttachmentContent](#attachmentcontent)を参照してください。 |
| `format` | String | Yes | 提供されるファイルの形式です。例: `png`。 |
| `mimeType` | String | Only for `Attachment.File` | 提供されるファイルの MIME タイプです。例: `image/png`。 |
| `fileName` | String | No | 拡張子を含む提供されるファイルの名前です。例: `screenshot.png`。 |

詳細については、[API リファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment/index.html)を参照してください。

#### AttachmentContent

`AttachmentContent`は、LLMへの入力として提供されるコンテンツのタイプとソースを定義します。以下のクラスがサポートされています。

* `AttachmentContent.URL(val url: String)`

  指定されたURLからファイルコンテンツを提供します。以下のパラメータを取ります。

  | 名前 | データ型 | 必須 | 説明 |
  |---|---|---|---|
  | `url` | String | Yes | 提供されるコンテンツのURLです。 |

  詳細については、[API リファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)も参照してください。

* `AttachmentContent.Binary.Bytes(val data: ByteArray)`

  バイト配列としてファイルコンテンツを提供します。以下のパラメータを取ります。

  | 名前 | データ型 | 必須 | 説明 |
  |---|---|---|---|
  | `data` | ByteArray | Yes | バイト配列として提供されるファイルコンテンツです。 |

  詳細については、[API リファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)も参照してください。

* `AttachmentContent.Binary.Base64(val base64: String)`

  Base64文字列としてエンコードされたファイルコンテンツを提供します。以下のパラメータを取ります。

  | 名前 | データ型 | 必須 | 説明 |
  |---|---|---|---|
  | `base64` | String | Yes | ファイルデータを含む Base64 文字列です。 |

  詳細については、[API リファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)も参照してください。

* `AttachmentContent.PlainText(val text: String)`

!!! tip
    アタッチメントタイプが`Attachment.File`の場合にのみ適用されます。

  プレーンテキストファイル（`text/plain` MIME タイプなど）からコンテンツを提供します。以下のパラメータを取ります。

  | 名前 | データ型 | 必須 | 説明 |
  |---|---|---|---|
  | `text` | String | Yes | ファイルのコンテンツです。 |

  詳細については、[API リファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)も参照してください。

### 混在するアタッチメントコンテンツ

異なるタイプのアタッチメントを個別のプロンプトやメッセージで提供するだけでなく、以下に示すように、単一の`user`メッセージで複数かつ混在するタイプのアタッチメントを提供することもできます。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("You are a helpful assistant.")

    user {
        +"Compare the image with the document content."

        attachments {
            image(Path("/User/koog/page.png"))
            binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        }
    }
}
```
<!--- KNIT example-prompt-api-05.kt -->

## LLM クライアントとプロンプトエグゼキューターの選択

プロンプト API を使用する際、LLM クライアントまたはプロンプトエグゼキューターのいずれかを使用してプロンプトを実行できます。
クライアントとエグゼキューターのどちらを選択するかは、以下の要因を考慮してください。

- 単一の LLM プロバイダーを扱い、高度なライフサイクル管理を必要としない場合は、LLM クライアントを直接使用してください。詳細については、「[LLM クライアントを使用したプロンプトの実行](#running-prompts-with-llm-clients)」を参照してください。
- LLM とそのライフサイクルを管理するためのより高レベルの抽象化が必要な場合、または複数のプロバイダー間で一貫した API でプロンプトを実行し、それらを動的に切り替えたい場合は、プロンプトエグゼキューターを使用してください。
  詳細については、「[プロンプトエグゼキューターを使用したプロンプトの実行](#running-prompts-with-prompt-executors)」を参照してください。

!!!note
    LLM クライアントとプロンプトエグゼキューターはどちらも、ストリーミングレスポンス、複数選択肢の生成、コンテンツモデレーションを可能にします。
    詳細については、特定のクライアントまたはエグゼキューターの[API リファレンス](https://api.koog.ai/index.html)を参照してください。

## LLM クライアントを使用したプロンプトの実行

単一の LLM プロバイダーを扱い、高度なライフサイクル管理を必要としない場合は、LLM クライアントを使用してプロンプトを実行できます。
Koog は以下の LLM クライアントを提供します。

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (JVM のみ)

LLM クライアントを使用してプロンプトを実行するには、次の手順を実行します。

1) アプリケーションと LLM プロバイダー間の接続を処理する、対応する LLM クライアントを作成します。例：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// OpenAI クライアントを作成します
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-06.kt -->

2) プロンプトと LLM を引数として`execute` メソッドを呼び出します。

<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi01.prompt
import ai.koog.agents.example.examplePromptApi06.client
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
runBlocking {
-->
<!--- SUFFIX
}
}
-->
```kotlin
// プロンプトを実行します
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // 異なるモデルを選択できます
)
```
<!--- KNIT example-prompt-api-07.kt -->

以下は、OpenAI クライアントを使用してプロンプトを実行する例です。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin

fun main() {
    runBlocking {
        // API キーを使用して OpenAI クライアントをセットアップします
        val token = System.getenv("OPENAI_API_KEY")
        val client = OpenAILLMClient(token)

        // プロンプトを作成します
        val prompt = prompt("prompt_name", LLMParams()) {
            // コンテキストを設定するためのシステムメッセージを追加します
            system("You are a helpful assistant.")

            // ユーザーメッセージを追加します
            user("Tell me about Kotlin")

            // Few-shotの例としてアシスタントメッセージを追加することもできます
            assistant("Kotlin is a modern programming language...")

            // 別のユーザーメッセージを追加します
            user("What are its key features?")
        }

        // プロンプトを実行し、レスポンスを取得します
        val response = client.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4o)
        println(response)
    }
}
```
<!--- KNIT example-prompt-api-08.kt -->

!!!note
    LLM クライアントは、ストリーミングレスポンス、複数選択肢の生成、コンテンツモデレーションを可能にします。
    詳細については、特定のクライアントの API リファレンスを参照してください。
    コンテンツモデレーションの詳細については、「[コンテンツモデレーション](content-moderation.md)」を参照してください。

## プロンプトエグゼキューターを使用したプロンプトの実行

LLM クライアントがプロバイダーへの直接アクセスを提供するのに対し、プロンプトエグゼキューターは、一般的なユースケースを簡素化し、クライアントのライフサイクル管理を処理する、より高レベルの抽象化を提供します。
これらは、次のような場合に理想的です。

- クライアント設定を管理せずに迅速なプロトタイプ作成を行いたい場合。
- 統一されたインターフェースを通じて複数のプロバイダーと連携したい場合。
- 大規模なアプリケーションでの依存性注入 (Dependency Injection) を簡素化したい場合。
- プロバイダー固有の詳細を抽象化したい場合。

### エグゼキューターの種類

Koog は主に2つのプロンプトエグゼキューターを提供します。

| <div style="width:175px">名前</div> | 説明 |
|---|---|
| [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) | 単一のプロバイダーの LLM クライアントをラップします。エージェントが単一の LLM プロバイダー内でモデルを切り替える機能のみを必要とする場合、このエグゼキューターを使用してください。 |
| [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html) | プロバイダーごとに複数の LLM クライアントにルーティングし、リクエストされたプロバイダーが利用できない場合はオプションのフォールバックを使用します。エージェントが異なるプロバイダーのモデル間を切り替える必要がある場合、このエグゼキューターを使用してください。 |

これらは、LLM でプロンプトを実行するための[`PromtExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html)インターフェースの実装です。

### 単一プロバイダーエグゼキューターの作成

特定の LLM プロバイダー向けのプロンプトエグゼキューターを作成するには、次の手順を実行します。

1) 対応する API キーを使用して、特定のプロバイダーの LLM クライアントを構成します。
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
```
<!--- KNIT example-prompt-api-09.kt -->
2) [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html)を使用してプロンプトエグゼキューターを作成します。
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi09.openAIClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val promptExecutor = SingleLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-api-10.kt -->

### マルチプロバイダーエグゼキューターの作成

複数の LLM プロバイダーと連携するプロンプトエグゼキューターを作成するには、次の手順を実行します。

1) 必要な LLM プロバイダーのクライアントを、対応する API キーを使用して構成します。
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val ollamaClient = OllamaClient()
```
<!--- KNIT example-prompt-api-11.kt -->

2) 構成されたクライアントを`MultiLLMPromptExecutor` クラスのコンストラクタに渡し、複数の LLM プロバイダーを持つプロンプトエグゼキューターを作成します。
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi11.openAIClient
import ai.koog.agents.example.examplePromptApi11.ollamaClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider
-->
```kotlin
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Ollama to ollamaClient
)
```
<!--- KNIT example-prompt-api-12.kt -->

### 事前定義されたプロンプトエグゼキューター

より迅速なセットアップのために、Koog は一般的なプロバイダー向けに、以下のすぐに使用できるエグゼキューター実装を提供します。

- 特定の LLM クライアントで構成された`SingleLLMPromptExecutor`を返す単一プロバイダーエグゼキューター：
    - `simpleOpenAIExecutor`: OpenAI モデルでプロンプトを実行するため。
    - `simpleAzureOpenAIExecutor`: Azure OpenAI Service を使用してプロンプトを実行するため。
    - `simpleAnthropicExecutor`: Anthropic モデルでプロンプトを実行するため。
    - `simpleGoogleAIExecutor`: Google モデルでプロンプトを実行するため。
    - `simpleOpenRouterExecutor`: OpenRouter でプロンプトを実行するため。
    - `simpleOllamaAIExecutor`: Ollama でプロンプトを実行するため。

- マルチプロバイダーエグゼキューター：
    - `DefaultMultiLLMPromptExecutor`: OpenAI、Anthropic、Google プロバイダーをサポートする`MultiLLMPromptExecutor`の実装。

事前定義された単一およびマルチプロバイダーエグゼキューターを作成する例を以下に示します。

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.all.DefaultMultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// OpenAI エグゼキューターを作成します
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// OpenAI、Anthropic、Google LLM クライアントを含む DefaultMultiLLMPromptExecutor を作成します
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-api-13.kt -->

### プロンプトの実行

プロンプトエグゼキューターは、ストリーミング、複数選択肢の生成、コンテンツモデレーションなど、さまざまな機能を使用してプロンプトを実行するメソッドを提供します。

`execute`メソッドを使用して特定の LLM でプロンプトを実行する方法の例を以下に示します。

<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi04.prompt
import ai.koog.agents.example.examplePromptApi10.promptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// プロンプトを実行します
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-api-14.kt -->

これにより、`GPT4o`モデルでプロンプトが実行され、レスポンスが返されます。

!!!note
    プロンプトエグゼキューターは、ストリーミングレスポンス、複数選択肢の生成、コンテンツモデレーションを可能にします。
    詳細については、特定の Executor の API リファレンスを参照してください。
    コンテンツモデレーションの詳細については、「[コンテンツモデレーション](content-moderation.md)」を参照してください。

## キャッシュ付きプロンプトエグゼキューター

繰り返されるリクエストの場合、LLM レスポンスをキャッシュしてパフォーマンスを最適化し、コストを削減できます。
Koog は、キャッシュ機能を追加する`PromptExecutor`のラッパーである`CachedPromptExecutor`を提供します。
これにより、以前に実行されたプロンプトからのレスポンスを保存し、同じプロンプトが再度実行されたときにそれらを取得できます。

キャッシュ付きプロンプトエグゼキューターを作成するには、次の手順を実行します。

1) レスポンスをキャッシュしたいプロンプトエグゼキューターを作成します。
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val client = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = SingleLLMPromptExecutor(client)
```
<!--- KNIT example-prompt-api-15.kt -->

2) 目的のキャッシュを使用して`CachedPromptExecutor`インスタンスを作成し、作成したプロンプトエグゼキューターを提供します。
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi15.promptExecutor
import ai.koog.prompt.cache.files.FilePromptCache
import ai.koog.prompt.executor.cached.CachedPromptExecutor
import kotlin.io.path.Path
import kotlinx.coroutines.runBlocking
--> 
```kotlin
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("/cache_directory")),
    nested = promptExecutor
)
```
<!--- KNIT example-prompt-api-16.kt -->

3) 目的のプロンプトとモデルでキャッシュ付きプロンプトエグゼキューターを実行します。
<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.agents.example.examplePromptApi16.cachedExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val prompt = prompt("test") {
            user("Hello")
        }

-->
<!--- SUFFIX
    }
}
--> 
```kotlin
val response = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-17.kt -->

これで、同じプロンプトを同じモデルで複数回実行しても、レスポンスはキャッシュから取得されます。

!!!note
    * キャッシュ付きプロンプトエグゼキューターで`executeStreaming()`を呼び出すと、レスポンスは単一のチャンクとして生成されます。
    * キャッシュ付きプロンプトエグゼキューターで`moderate()`を呼び出すと、リクエストはネストされたプロンプトエグゼキューターに転送され、キャッシュは使用されません。
    * 複数選択肢のレスポンスのキャッシュはサポートされていません。

## リトライ機能

LLM プロバイダーと連携する際、レート制限や一時的なサービス停止といった一時的なエラーに遭遇することがあります。`RetryingLLMClient`デコレーターは、あらゆる LLM クライアントに自動リトライロジックを追加します。

### 基本的な使用方法

既存のクライアントをリトライ機能でラップします。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY")
        val prompt = prompt("test") {
            user("Hello")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 既存のクライアントをリトライ機能でラップします
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// これで、すべて操作は一時的なエラー発生時に自動的にリトライされます
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-18.kt -->

#### リトライ動作の設定

Koog は、いくつかの事前定義されたリトライ設定を提供します。

| 設定 | 最大試行回数 | 初期遅延 | 最大遅延 | ユースケース |
|---|---|---|---|---|
| `DISABLED` | 1回 (リトライなし) | - | - | 開発とテスト |
| `CONSERVATIVE` | 3回 | 2秒 | 30秒 | 通常の本番運用 |
| `AGGRESSIVE` | 5回 | 500ミリ秒 | 20秒 | クリティカルな操作 |
| `PRODUCTION` | 3回 | 1秒 | 20秒 | 推奨されるデフォルト |

これらを直接使用するか、カスタム設定を作成できます。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 事前定義された設定を使用します
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)

// またはカスタム設定を作成します
val customClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig(
        maxAttempts = 5,
        initialDelay = 1.seconds,
        maxDelay = 30.seconds,
        backoffMultiplier = 2.0,
        jitterFactor = 0.2
    )
)
```
<!--- KNIT example-prompt-api-19.kt -->

#### リトライ可能なエラーパターン

デフォルトでは、リトライメカニズムは一般的な一時的エラーを認識します。

* **HTTP ステータスコード**:
    * `429`: レート制限
    * `500`: 内部サーバーエラー
    * `502`: バッドゲートウェイ
    * `503`: サービス利用不可
    * `504`: ゲートウェイタイムアウト
    * `529`: Anthropic 過負荷

* **エラーキーワード**:
    * rate limit (レート制限)
    * too many requests (リクエストが多すぎます)
    * request timeout (リクエストタイムアウト)
    * connection timeout (接続タイムアウト)
    * read timeout (読み取りタイムアウト)
    * write timeout (書き込みタイムアウト)
    * connection reset by peer (ピアによって接続がリセットされました)
    * connection refused (接続拒否)
    * temporarily unavailable (一時的に利用不可)
    * service unavailable (サービス利用不可)

特定のニーズに合わせてカスタムパターンを定義できます。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),           // 特定のステータスコード
        RetryablePattern.Keyword("quota"),      // エラーメッセージ内のキーワード
        RetryablePattern.Regex(Regex("ERR_\\d+")), // カスタム正規表現パターン
        RetryablePattern.Custom { error ->      // カスタムロジック
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-prompt-api-20.kt -->

#### プロンプトエグゼキューターでのリトライ

プロンプトエグゼキューターを使用する際は、エグゼキューターを作成する前に基盤となる LLM クライアントをリトライメカニズムでラップします。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider

-->
```kotlin
// リトライ機能を備えた単一プロバイダーエグゼキューター
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_KEY")),
    RetryConfig.PRODUCTION
)
val executor = SingleLLMPromptExecutor(resilientClient)

// 柔軟なクライアント構成を備えたマルチプロバイダーエグゼキューター
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock クライアントにはすでに AWS SDK のリトライ機能が組み込まれています
    LLMProvider.Bedrock to BedrockLLMClient(
        credentialsProvider = StaticCredentialsProvider {
            accessKeyId = System.getenv("AWS_ACCESS_KEY_ID")
            secretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY")
            sessionToken = System.getenv("AWS_SESSION_TOKEN")
        },
    ),
)
```
<!--- KNIT example-prompt-api-21.kt -->

#### ストリーミングでのリトライ

ストリーミング操作はオプションでリトライできます。この機能はデフォルトで無効になっています。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val baseClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
        val prompt = prompt("test") {
            user("Generate a story")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val config = RetryConfig(
    maxAttempts = 3
)

val client = RetryingLLMClient(baseClient, config)
val stream = client.executeStreaming(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-22.kt -->

!!!note
    ストリーミングのリトライは、最初のトークンを受信する前の接続障害にのみ適用されます。ストリーミングが開始されると、コンテンツの整合性を維持するためにエラーはそのまま渡されます。

### タイムアウト設定

すべての LLM クライアントは、リクエストのハングを防ぐためのタイムアウト設定をサポートしています。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.ConnectionTimeoutConfig
import ai.koog.prompt.executor.clients.openai.OpenAIClientSettings
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient

val apiKey = System.getenv("OPENAI_API_KEY")
-->
```kotlin
val client = OpenAILLMClient(
    apiKey = apiKey,
    settings = OpenAIClientSettings(
        timeoutConfig = ConnectionTimeoutConfig(
            connectTimeoutMillis = 5000,    // 接続確立まで5秒
            requestTimeoutMillis = 60000    // リクエスト全体で60秒
        )
    )
)
```
<!--- KNIT example-prompt-api-23.kt -->

### エラーハンドリング

本番環境で LLM を操作する際は、エラーハンドリング戦略を実装する必要があります。

- 予期せぬエラーを処理するために、**try-catch ブロックを使用してください**。
- デバッグのために、**コンテキスト情報とともにエラーをログに出力してください**。
- クリティカルな操作には、**フォールバック戦略を実装してください**。
- 再発する問題やシステムの問題を特定するために、**リトライパターンを監視してください**。

包括的なエラーハンドリングの例を以下に示します。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory

fun main() {
    runBlocking {
        val logger = LoggerFactory.getLogger("Example")
        val resilientClient = RetryingLLMClient(
            OpenAILLMClient(System.getenv("OPENAI_KEY"))
        )
        val prompt = prompt("test") { user("Hello") }
        val model = OpenAIModels.Chat.GPT4o
        
        fun processResponse(response: Any) { /* ... */ }
        fun scheduleRetryLater() { /* ... */ }
        fun notifyAdministrator() { /* ... */ }
        fun useDefaultResponse() { /* ... */ }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
try {
    val response = resilientClient.execute(prompt, model)
    processResponse(response)
} catch (e: Exception) {
    logger.error("LLM operation failed", e)
    
    when {
        e.message?.contains("rate limit") == true -> {
            // レート制限を特別に処理
            scheduleRetryLater()
        }
        e.message?.contains("invalid api key") == true -> {
            // 認証エラーを処理
            notifyAdministrator()
        }
        else -> {
            // 代替ソリューションにフォールバック
            useDefaultResponse()
        }
    }
}
```
<!--- KNIT example-prompt-api-24.kt -->