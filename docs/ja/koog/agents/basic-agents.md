# 基本的なエージェント

基本的なエージェントは、ほとんどの一般的なユースケースで機能する、シンプルな実行フローを持つ定義済みのストラテジーを使用します。
これは文字列の入力（質問、リクエスト、またはタスクの説明）を受け取り、この入力を構成されたLLMに送信します。
LLMは、提供されたツールを呼び出すかどうかを決定します。
エージェントはツールを実行し、その結果をLLMに送り返します。
これは、LLMがそれ以上のツール呼び出しを要求しなくなり、文字列のレスポンスを返すまで繰り返されます。
その後、エージェントはそのレスポンスを出力します。

[グラフベースのエージェント](graph-based-agents.md)では、基本的なエージェントで使用されている定義済みのストラテジーグラフをどのように再作成できるかを確認できます。

??? note "前提条件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    このページの例では、`OPENAI_API_KEY` 環境変数が設定されていることを前提としています。

## 最小限のエージェントを作成する

最も基本的なエージェントを作成するには、[`AIAgent`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/index.html) をインスタンス化し、[言語モデル](../model-capabilities.md#creating-a-model-llmodel-configuration)を備えた [プロンプトエグゼキューター](../prompts/prompt-executors.md) を提供します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
)
```

このエージェントは入力を文字列として期待し、出力を文字列として返します。
エージェントを実行するには、ユーザー入力を指定して `run()` 関数を使用します。

```kotlin
fun main() = runBlocking {
    val result = agent.run("Hello! How can you help me?")
    println(result)
}
```
<!--- KNIT example-basic-01.kt -->

エージェントは次のような一般的な回答を返します。

```text
I can assist with a wide range of topics and tasks. Here are some examples:

1. **Answering questions**: I can provide information on various subjects, from science and history to entertainment and culture.
2. **Generating text**: I can help with writing tasks, such as suggesting alternative phrases, providing definitions, or even creating entire articles or stories.
3. **Translation**: I can translate text from one language to another, including popular languages such as Spanish, French, German, Chinese, and many more.
4. **Conversation**: I can engage in natural-sounding conversations, using context and understanding to respond to questions and statements.
5. **Brainstorming**: I can help generate ideas for creative projects, such as writing stories, composing music, or coming up with business ideas.
6. **Learning**: I can help with language learning, explaining grammar rules, vocabulary, and pronunciation.
7. **Calculations**: I can perform mathematical calculations, including basic arithmetic, algebra, and more advanced math concepts.

What's on your mind? Do you have a specific question, topic, or task you'd like to tackle?
```

## システムプロンプトを追加する

[システムメッセージ](../prompts/prompt-creation/index.md#system-message)を提供して、エージェントの役割、およびタスクに関連する目的、コンテキスト、指示を定義します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-basic-02.kt -->

システムプロンプト内の指示がエージェントのレスポンスをガイドします。

```text
I'm here to help you navigate the wild world of internet memes!

What's on your mind? Are you trying to understand a specific meme, need help finding a popular joke, or perhaps want some recommendations for trending memes? Let me know, and I'll do my best to provide you with some LOLs!
```

## LLM出力を構成する

エージェントのコンストラクタに直接いくつかの [LLMパラメータ](../llm-parameters.md#llm-parameter-reference) を提供して、LLMの動作をカスタマイズできます。
例えば、生成されるレスポンスのランダム性を調整するには `temperature` パラメータを使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7
)
```
<!--- KNIT example-basic-03.kt -->

以下は、異なる `temperature` 値によるレスポンスの例です。

=== "0.4"
    
    ```text
    I'm here to help you navigate the wild world of internet memes! Whether you're looking for explanations, examples, or just want to share a meme with someone, I'm your go-to expert. What's on your mind? Got a specific meme in mind that's got you curious? Or maybe you need some meme-related advice? Fire away!
    ```

=== "0.7"

    ```text
    I'm here to help you navigate the wild world of internet memes!
    
    What's on your mind? Need help understanding a specific meme, finding a popular joke or trend, or maybe even creating your own meme? Let's get this meme party started!
    ```

=== "1.0"

    ```text
    I'd be happy to help you navigate the wild world of internet memes!
    
    Whether you're looking for explanations of classic memes, suggestions for new ones to try out, or just want to discuss your favorite meme culture trends, I'm here to assist. What's on your mind?
    
    Do you have a specific question about memes (e.g., "What does this meme mean?"), or are you looking for some meme-related recommendations (e.g., "Can you recommend a funny meme to share with friends?"). Let me know how I can help!
    ```
    
## ツールを追加する

エージェントは [ツール](../tools-overview.md) を使用して特定のタスクを実行できます。

まず、関数に [`@Tool`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.annotations/-tool/index.html) アノテーションを付加してツールを作成します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.tool
-->
```kotlin
@Tool
@LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
fun askUser(
    @LLMDescription("Question from the agent")
    question: String
): String {
    println(question)
    return readln()
}
```

次に、[`ToolRegistry`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html) を使用して、このツールをエージェントで利用可能にします。

```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(::askUser)
    }
)
```
<!--- KNIT example-basic-04.kt -->

この例では、`askUser` はエージェントがコンソールへの出力と読み取りを介してユーザーとの会話を維持するのに役立つツールです。
エージェントがユーザーに質問することを決定した場合、`println()` を介して `stdout` に書き込み、`readln()` を介して `stdin` から読み取るこのツールを呼び出すことができます。

以下はエージェントとのやり取りの例です。

```text
Agent: Which meme would you like me to explain? Please choose from: Grumpy Cat, Success Kid, or Doge.

User: Explain Doge

Agent:

**Doge**

Doge is a popular internet meme that originated on the imageboard website 4chan in 2013. The meme features a picture of a Shiba Inu dog with a caption written in a playful, exaggerated style.

The typical format of a Doge meme includes:

* A photo of a Shiba Inu dog
* A caption written in all capital letters, using a intentionally simplistic and childlike tone
* Exaggerated or made-up words or phrases, often used to convey a humorous or nonsensical idea

Examples of Doge memes might include:

* "Such wow. Such happy."
* "I had fun today!"
* "Wow, I am good at napping."

The meme is known for its lighthearted and playful tone, and is often used to express excitement, happiness, or silliness. The meme has since become a cultural phenomenon, with countless variations and parodies emerging online.
```

## エージェントのイテレーションを調整する

無限ループを避けるため、Koogは任意のエージェントが実行できるステップ数を制限しています（デフォルトは50回）。
エージェントがより多くのステップ（ツールの呼び出しやLLMのリクエストなど）を必要とすることが予想される場合は `maxIterations` パラメータを使用してこの制限を増やすか、数ステップしか必要としないエージェントの場合は減らします。
例えば、ここで説明したシンプルなエージェントが10ステップ以上を必要とすることはまずありません。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.tool

@Tool
@LLMDescription("Asks the user a question by sending it to stdout and returns the answer from stdin")
fun askUser(
    @LLMDescription("Question from the agent")
    question: String
): String {
    println(question)
    return readln()
}
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(::askUser)
    },
    maxIterations = 10
)
```
<!--- KNIT example-basic-05.kt -->

!!! tip

    モデル、温度、最大イテレーション、その他のパラメータをエージェントのコンストラクタに直接渡す代わりに、それらを別の構成オブジェクトとして定義して渡すこともできます。
    詳細については、[エージェントの構成](index.md#agent-configuration)を参照してください。

## エージェントの実行中にイベントを処理する

テストやデバッグの支援、およびチェーンされたエージェントのやり取りのためのフックを作成するために、Koogは [EventHandler](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler/index.html) 機能を提供しています。
エージェントのコンストラクタラムダ内で `handleEvents()` 関数を呼び出して機能をインストールし、イベントハンドラーを登録します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.tool

@Tool
@LLMDescription("Asks the user a question by sending it to stdout and returns the answer from stdin")
fun askUser(
    @LLMDescription("Question from the agent")
    question: String
): String {
    println(question)
    return readln()
}
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(::askUser)
    },
    maxIterations = 10
){
    handleEvents {
        // ツール呼び出しを処理する
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
    }
}
```
<!--- KNIT example-basic-06.kt -->

エージェントが `askUser` ツールを呼び出すと、次のような内容が出力されるようになります。

```text
Tool called: askUser with args {"question":"Which meme would you like me to explain?"}
```

Koogエージェントの機能の詳細については、[機能の概要](../features-overview.md)を参照してください。

## 次のステップ

- [グラフベースのエージェント](graph-based-agents.md) や [関数型エージェント](functional-agents.md) の構築について詳しく学ぶ