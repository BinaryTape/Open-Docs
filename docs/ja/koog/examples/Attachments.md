# 添付ファイル

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 環境設定

コードに入る前に、Kotlin Notebookが準備できていることを確認します。
ここでは、最新のディスクリプタを読み込み、AIモデルプロバイダーと連携するためのクリーンなAPIを提供する**Koog**ライブラリを有効にします。

```kotlin
// Loads the latest descriptors and activates Koog integration for Kotlin Notebook.
// This makes Koog DSL types and executors available in further cells.
%useLatestDescriptors
%use koog
```

## APIキーの設定

APIキーは環境変数から読み込みます。これにより、シークレットがノートブックファイルから分離され、プロバイダーを切り替えることができます。
`OPENAI_API_KEY`、`ANTHROPIC_API_KEY`、または`GEMINI_API_KEY`を設定できます。

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // or ANTHROPIC_API_KEY, or GEMINI_API_KEY
```

## シンプルなOpenAIエグゼキューターの作成

エグゼキューターは、認証、ベースURL、および適切なデフォルトをカプセル化します。ここではシンプルなOpenAIエグゼキューターを使用しますが、残りのコードを変更せずにAnthropicやGeminiに置き換えることができます。

```kotlin
// --- Provider selection ---
// For OpenAI-compatible models. Alternatives include:
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// All executors expose the same high‑level API.
val executor = simpleOpenAIExecutor(apiKey)
```

KoogのプロンプトDSLを使用すると、**構造化Markdown**と**添付ファイル**を追加できます。
このセルでは、モデルに短いブログスタイルの「コンテンツカード」を生成するよう依頼するプロンプトを作成し、ローカルの`images/`ディレクトリから2つの画像を添付します。

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

## 応答の実行と検査

`gpt-4.1`に対してプロンプトを実行し、最初のメッセージを収集してその内容を表示します。
ストリーミングが必要な場合は、KoogのストリーミングAPIに切り替えてください。ツール利用の場合は、`emptyList()`の代わりにツールリストを渡してください。

> トラブルシューティング：
> *   **401/403** — APIキー/環境変数を確認してください。
> *   **File not found** — `images/`のパスを確認してください。
> *   **Rate limits** — 必要に応じて、呼び出しの周りに最小限のリトライ/バックオフを追加してください。

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