# Prompt API

Prompt API を使用すると、Kotlin DSL で適切に構造化されたプロンプトを作成し、さまざまなLLMプロバイダーに対してそれらを実行し、さまざまな形式でレスポンスを処理できます。

## プロンプトの作成

Prompt API は、Kotlin DSL を使用してプロンプトを作成します。以下の種類のメッセージをサポートしています。

- `system`: LLMのコンテキストと指示を設定します。
- `user`: ユーザー入力を表します。
- `assistant`: LLMのレスポンスを表します。

シンプルなプロンプトの例を以下に示します。

```kotlin
val prompt = prompt("prompt_name", LLMParams()) {
    // コンテキストを設定するシステムメッセージを追加
    system("You are a helpful assistant.")

    // ユーザーメッセージを追加
    user("Tell me about Kotlin")

    // few-shotの例としてアシスタントメッセージを追加することもできます
    assistant("Kotlin is a modern programming language...")

    // 別のユーザーメッセージを追加
    user("What are its key features?")
}
```

## プロンプトの実行

特定のLLMでプロンプトを実行するには、次の手順を実行します。

1. アプリケーションとLLMプロバイダー間の接続を処理する、対応するLLMクライアントを作成します。例：
```kotlin
// OpenAIクライアントを作成
val client = OpenAILLMClient(apiKey)
```
2. プロンプトとLLMを引数として`execute` メソッドを呼び出します。
```kotlin
// プロンプトを実行
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // 異なるモデルを選択できます
)
```

以下のLLMクライアントが利用可能です。

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)

Prompt API を使用するシンプルな例を以下に示します。

```kotlin
fun main() {
    // APIキーでOpenAIクライアントを設定
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // プロンプトを作成
    val prompt = prompt("prompt_name", LLMParams()) {
        // コンテキストを設定するシステムメッセージを追加
        system("You are a helpful assistant.")

        // ユーザーメッセージを追加
        user("Tell me about Kotlin")

        // few-shotの例としてアシスタントメッセージを追加することもできます
        assistant("Kotlin is a modern programming language...")

        // 別のユーザーメッセージを追加
        user("What are its key features?")
    }

    // プロンプトを実行し、レスポンスを取得
    val response = client.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4o)
    println(response)
}
```

## プロンプトエグゼキューター

プロンプトエグゼキューターは、LLMを操作するためのより高レベルな方法を提供し、クライアントの作成と管理の詳細を処理します。

プロンプトエグゼキューターを使用してプロンプトを管理し、実行できます。
使用する予定のLLMプロバイダーに基づいてプロンプトエグゼキューターを選択するか、利用可能なLLMクライアントのいずれかを使用してカスタムプロンプトエグゼキューターを作成できます。

Koogフレームワークはいくつかのプロンプトエグゼキューターを提供します。

- **単一プロバイダーエグゼキューター**:
    - `simpleOpenAIExecutor`: OpenAIモデルでプロンプトを実行するため。
    - `simpleAnthropicExecutor`: Anthropicモデルでプロンプトを実行するため。
    - `simpleGoogleExecutor`: Googleモデルでプロンプトを実行するため。
    - `simpleOpenRouterExecutor`: OpenRouterでプロンプトを実行するため。
    - `simpleOllamaExecutor`: Ollamaでプロンプトを実行するため。

- **マルチプロバイダーエグゼキューター**:
    - `DefaultMultiLLMPromptExecutor`: 複数のLLMプロバイダーを操作するため

### 単一プロバイダーエグゼキューターの作成

特定のLLMプロバイダー向けのプロンプトエグゼキューターを作成するには、対応する関数を使用します。
例えば、OpenAIプロンプトエグゼキューターを作成するには、`simpleOpenAIExecutor` 関数を呼び出し、OpenAIサービスでの認証に必要なAPIキーを提供する必要があります。

1. プロンプトエグゼキューターの作成:
```kotlin
// OpenAIエグゼキューターを作成
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
2. 特定のLLMでプロンプトを実行:
```kotlin
// プロンプトを実行
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```

### マルチプロバイダーエグゼキューターの作成

複数のLLMプロバイダーを操作するプロンプトエグゼキューターを作成するには、次の手順を実行します。

1. 必要なLLMプロバイダーのクライアントを、対応するAPIキーを使用して構成します。例：
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
2. 構成されたクライアントを`DefaultMultiLLMPromptExecutor` クラスのコンストラクタに渡し、複数のLLMプロバイダーを持つプロンプトエグゼキューターを作成します。
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
3. 特定のLLMでプロンプトを実行:
```kotlin
val response = multiExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```