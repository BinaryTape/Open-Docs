# Koogで数字当てエージェントを構築する

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb
){ .md-button }

あなたが考えている数字を推測する、小さくて楽しいエージェントを構築しましょう。Koogのツール呼び出しを活用し、的を絞った質問をし、古典的な二分探索戦略（binary search strategy）を使用して収束させます。その結果、ドキュメントに直接組み込むことができるKotlinらしいノートブック（Kotlin Notebook）が完成します。

コードは最小限に抑え、フローは明確にします。いくつかの小さなツール、コンパクトなプロンプト、そしてインタラクティブなCLIループで構成されます。

## セットアップ

このノートブックは以下の前提条件を満たしていると仮定しています。
- Koogが利用可能なKotlinノートブックで実行していること。
- 環境変数 `OPENAI_API_KEY` が設定されていること。エージェントは `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))` を介してこれを使用します。

Koogカーネルをロードします。

```kotlin
%useLatestDescriptors
%use koog
```

## ツール：的を絞った質問をする

ツールとは、LLMが呼び出すことができる、よく記述された小さな関数です。ここでは3つのツールを提供します。
- `lessThan(value)`：「あなたの数字は `value` より小さいですか？」
- `greaterThan(value)`：「あなたの数字は `value` より大きいですか？」
- `proposeNumber(value)`：「あなたの数字は `value` と同じですか？」(範囲が狭まったら使用)

各ツールはシンプルな「YES」または「NO」の文字列を返します。ヘルパー関数 `ask` は、最小限のY/nループを実装し、入力を検証します。`@LLMDescription` を介した説明は、モデルがツールを正しく選択するのに役立ちます。

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

## ツールレジストリ

ツールをエージェントに公開します。また、エージェントがユーザーに直接メッセージを表示できるように、組み込みの `SayToUser` ツールも追加します。

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## エージェントの設定

必要なのは、簡潔でツール指向のシステムプロンプトだけです。二分探索戦略を提案し、安定した決定的な動作のために `temperature = 0.0` を維持します。ここでは、明確なプランニングのためにOpenAIの推論モデル `GPT4oMini` を使用します。

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

## 実行

- 1から100までの数字を考えます。
- ゲームを開始するには「`start`」と入力します。
- エージェントの質問には、はいの場合は「`Y`」または「`Enter`」、いいえの場合は「`n`」で答えます。エージェントは約7ステップであなたの数字を特定するはずです。

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

- エージェントはシステムプロンプトを読み込み、二分探索を計画します。
- 各イテレーションで、エージェントは `lessThan`、`greaterThan`、または（確信がある場合は）`proposeNumber` のいずれかのツールを呼び出します。
- ヘルパー関数 `ask` は、あなたのY/n入力を収集し、モデルにクリーンな「YES」または「NO」のシグナルを返します。
- 確認が取れると、`SayToUser` を介してあなたを祝福します。

## 拡張

- システムプロンプトを調整して、範囲を変更します（例：1..1000）。
- `between(low, high)` ツールを追加して、呼び出し回数をさらに減らします。
- 同じツールを維持しながら、モデルやエグゼキュータを交換します（例：Ollamaエグゼキュータとローカルモデルを使用）。
- 推測や結果を分析のためにストアに永続化します。

## トラブルシューティング

- キーが見つからない：環境に `OPENAI_API_KEY` が設定されていることを確認してください。
- カーネルが見つからない：`%useLatestDescriptors` と `%use koog` が正常に実行されたことを確認してください。
- ツールが呼び出されない：`ToolRegistry` に `GuesserTool()` が含まれており、プロンプト内の名前がツール関数と一致していることを確認してください。