# Koogで数字当てエージェントを構築する

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb
){ .md-button }

あなたが考えている数字を当てる、小さくて楽しいエージェントを構築してみましょう。Koogのツール呼び出し（tool-calling）機能を活用して的を絞った質問を行い、古典的な二分探索（binary search）戦略を用いて答えを導き出します。その結果、ドキュメントにそのまま活用できるような、慣用的な Kotlin Notebook が完成します。

コードは最小限に抑え、フローを明確にします。いくつかの小さなツール、コンパクトなプロンプト、そしてインタラクティブなCLIループで構成されます。

## セットアップ

このノートブックは以下の環境を想定しています：
- Koogが利用可能な Kotlin Notebook で実行していること。
- 環境変数 `OPENAI_API_KEY` が設定されていること。エージェントは `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))` を通じてこれを使用します。

Koogカーネルをロードします：

```kotlin
%useLatestDescriptors
%use koog
```

## ツール：的を絞った質問をする

ツールは、LLMが呼び出すことができる、動作が明確に定義された小さな関数です。ここでは3つのツールを提供します：
- `lessThan(value)`：「あなたの数字はその値より小さいですか？」
- `greaterThan(value)`：「あなたの数字はその値より大きいですか？」
- `proposeNumber(value)`：「あなたの数字はその値と等しいですか？」（範囲が十分に絞られた後に使用）

各ツールはシンプルな "YES" または "NO" の文字列を返します。ヘルパー関数 `ask` は、最小限の Y/n ループを実装し、入力を検証します。`@LLMDescription` による説明は、モデルがツールを正しく選択するのに役立ちます。

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

class GuesserTool : ToolSet {

    @Tool
    @LLMDescription("Asks the user if his number is STRICTLY less than a given value.")
    fun lessThan(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number less than $value?", value)

    @Tool
    @LLMDescription("Asks the user if his number is STRICTLY greater than a given value.")
    fun greaterThan(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number greater than $value?", value)

    @Tool
    @LLMDescription("Asks the user if his number is EXACTLY equal to the given number. Only use this tool once you've narrowed down your answer.")
    fun proposeNumber(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number equal to $value?", value)

    fun ask(question: String, value: Int): String {
        print("$question [Y/n]: ")
        val input = readln()
        println(input)

        return when (input.lowercase()) {
            "", "y", "yes" -> "YES"
            "n", "no" -> "NO"
            else -> {
                println("Invalid input! Please, try again.")
                ask(question, value)
            }
        }
    }
}
```

## ツール登録（Tool Registry）

ツールをエージェントに公開します。また、組み込みの `SayToUser` ツールを追加することで、エージェントがユーザーに直接メッセージを表示できるようにします。

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## エージェント設定

ツールを活用する短いシステムプロンプトを作成します。二分探索戦略を提案し、安定した決定論的な動作を得るために `temperature = 0.0` に設定します。ここでは、的確なプランニングを行うためにOpenAIの推論モデル `GPT4oMini` を使用します。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = """
            You are a number guessing agent. Your goal is to guess a number that the user is thinking of.
            
            Follow these steps:
            1. Start by asking the user to think of a number between 1 and 100.
            2. Use the less_than and greater_than tools to narrow down the range.
                a. If it's neither greater nor smaller, use the propose_number tool.
            3. Once you're confident about the number, use the propose_number tool to check if your guess is correct.
            4. If your guess is correct, congratulate the user. If not, continue guessing.
            
            Be efficient with your guessing strategy. A binary search approach works well.
        """.trimIndent(),
    temperature = 0.0,
    toolRegistry = toolRegistry
)
```

## 実行する

- 1から100の間の数字を1つ思い浮かべてください。
- `start` と入力して開始します。
- エージェントの質問に対し、はいの場合は `Y` または `Enter`、いいえの場合は `n` で答えてください。エージェントは約7ステップであなたの数字を突き止めるはずです。

```kotlin
import kotlinx.coroutines.runBlocking

println("Number Guessing Game started!")
println("Think of a number between 1 and 100, and I'll try to guess it.")
println("Type 'start' to begin the game.")

val initialMessage = readln()
runBlocking {
    agent.run(initialMessage)
}
```

## 仕組み

- エージェントはシステムプロンプトを読み取り、二分探索を計画します。
- 各反復において、`lessThan`、`greaterThan`、または（確信が持てた時に）`proposeNumber` といったツールのいずれかを呼び出します。
- ヘルパー関数 `ask` があなたの Y/n 入力を収集し、クリーンな "YES"/"NO" シグナルをモデルに返します。
- 確信が得られると、`SayToUser` を通じてお祝いの言葉を伝えます。

## 拡張してみる

- システムプロンプトを微調整して、範囲を変更する（例：1～1000）。
- `between(low, high)` ツールを追加して、呼び出し回数をさらに減らす。
- ツールはそのままに、モデルやエージェント（例：Ollamaエグゼキューターとローカルモデル）を入れ替える。
- 推測結果やアウトカムを分析用に保存する。

## トラブルシューティング

- キーが見つからない：環境変数に `OPENAI_API_KEY` が設定されているか確認してください。
- カーネルが見つからない：`%useLatestDescriptors` と `%use koog` が正常に実行されたか確認してください。
- ツールが呼び出されない：`ToolRegistry` に `GuesserTool()` が含まれているか、プロンプト内の名前がツール関数と一致しているか確認してください。