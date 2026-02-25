# 添付ファイル

[:material-github: GitHub で開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb をダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 環境のセットアップ

コードの実装に入る前に、Kotlin Notebook の準備ができているか確認します。
ここでは最新の記述子（descriptors）を読み込み、**Koog** ライブラリを有効にします。
このライブラリは、AI モデルプロバイダーを操作するためのクリーンな API を提供します。

```kotlin
// 最新の記述子（descriptors）を読み込み、Kotlin Notebook 用の Koog インテグレーションを有効にします。
// これにより、以降のセルで Koog DSL の型やエグゼキューターが利用可能になります。
%useLatestDescriptors
%use koog
```

## API キーの設定

API キーを環境変数から読み込みます。これにより、シークレット（秘密情報）をノートブックファイルに含めずに済み、プロバイダーを簡単に切り替えることができます。`OPENAI_API_KEY`、`ANTHROPIC_API_KEY`、または `GEMINI_API_KEY` を設定できます。

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // または ANTHROPIC_API_KEY、あるいは GEMINI_API_KEY
```

## シンプルな OpenAI エグゼキューターの作成

エグゼキューター（executor）は、認証、ベース URL、および適切なデフォルト設定をカプセル化します。ここではシンプルな OpenAI エグゼキューターを使用しますが、他のコードを変更することなく Anthropic や Gemini 用に差し替えることが可能です。

```kotlin
// --- プロバイダーの選択 ---
// OpenAI 互換モデル用。代替案は以下の通りです：
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// すべてのエグゼキューターは、同じハイレベルな API を提供します。
val executor = simpleOpenAIExecutor(apiKey)
```

Koog のプロンプト DSL を使用すると、**構造化された Markdown** や**添付ファイル**を追加できます。
このセルでは、モデルに対してブログスタイルの短い「コンテンツカード」を作成するよう依頼するプロンプトを構築し、ローカルの `images/` ディレクトリから 2 つの画像を添付します。

```kotlin
import ai.koog.prompt.markdown.markdown
import kotlinx.io.files.Path

val prompt = prompt("images-prompt") {
    system("You are professional assistant that can write cool and funny descriptions for Instagram posts.")

    user {
        markdown {
            +"I want to create a new post on Instagram."
            br()
            +"Can you write something creative under my instagram post with the following photos?"
            br()
            h2("Requirements")
            bulleted {
                item("It must be very funny and creative")
                item("It must increase my chance of becoming an ultra-famous blogger!!!!")
                item("It not contain explicit content, harassment or bullying")
                item("It must be a short catching phrase")
                item("You must include relevant hashtags that would increase the visibility of my post")
            }
        }

        attachments {
            image(Path("images/kodee-loving.png"))
            image(Path("images/kodee-electrified.png"))
        }
    }
}
```

## 実行とレスポンスの確認

プロンプトを `gpt-4.1` に対して実行し、最初のメッセージを取得してその内容を出力します。
ストリーミングが必要な場合は Koog のストリーミング API に変更してください。ツールの使用（tool use）については、`emptyList()` の代わりにツールリストを渡します。

> トラブルシューティング:
> * **401/403** — API キーまたは環境変数を確認してください。
> * **File not found** — `images/` のパスを確認してください。
> * **Rate limits** — 必要に応じて、呼び出しの周囲に最小限のリトライ/バックオフ（再試行）処理を追加してください。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    val response = executor.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4_1, tools = emptyList()).first()
    println(response.content)
}
```

    Caption:
    Running on cuteness and extra giggle power! Warning: Side effects may include heart-thief vibes and spontaneous dance parties. 💜🤖💃
    
    Hashtags:  
    #ViralVibes #UltraFamousBlogger #CutieAlert #QuirkyContent #InstaFun #SpreadTheLove #DancingIntoFame #RobotLife #InstaFamous #FeedGoals

```kotlin
runBlocking {
    val response = executor.executeStreaming(prompt = prompt, model = OpenAIModels.Chat.GPT4_1)
    response.collect { print(it) }
}
```

    Caption:  
    Running on good vibes & wi-fi only! 🤖💜 Drop a like if you feel the circuit-joy! #BlogBotInTheWild #HeartDeliveryService #DancingWithWiFi #UltraFamousBlogger #MoreFunThanYourAICat #ViralVibes #InstaFun #BeepBoopFamous