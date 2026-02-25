# 附件

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 設定環境

在深入研究程式碼之前，我們確保 Kotlin Notebook 已經準備就緒。
在這裡，我們會載入最新的描述符並啟用 **Koog** 程式庫，
它為使用 AI 模型提供者提供了一個簡潔的 API。

```kotlin
// 載入最新的描述符並為 Kotlin Notebook 啟用 Koog 整合。
// 這使得 Koog DSL 型別和執行器在後續的程式碼資料格中可用。
%useLatestDescriptors
%use koog
```

## 設定 API 金鑰

我們從環境變數中讀取 API 金鑰。這可以避免在筆記本檔案中洩露敏感資訊，並讓您
切換提供者。您可以設定 `OPENAI_API_KEY`、`ANTHROPIC_API_KEY` 或 `GEMINI_API_KEY`。

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // 或 ANTHROPIC_API_KEY，或 GEMINI_API_KEY
```

## 建立簡單的 OpenAI 執行器

執行器封裝了身分驗證、基本 URL 以及正確的預設值。在這裡，我們使用一個簡單的 OpenAI 執行器，
但您可以將其更換為 Anthropic 或 Gemini，而無需更改其餘程式碼。

```kotlin
// --- 提供者選擇 ---
// 對於 OpenAI 相容模型。替代方案包括：
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// 所有執行器都提供相同的高階 API。
val executor = simpleOpenAIExecutor(apiKey)
```

Koog 的提示詞 (Prompt) DSL 讓您可以新增**結構化 Markdown** 和**附件**。
在這個資料格中，我們建立一個提示詞，要求模型產生一個短小、部落格風格的「內容卡片」，並且
我們附加了來自本機 `images/` 目錄的兩張圖片。

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

## 執行並檢查回應

我們針對 `gpt-4.1` 執行提示詞，收集第一條訊息並列印其內容。
如果您想要進行串流，請切換到 Koog 中的串流 API；若要使用工具，請傳遞您的工具清單而不是 `emptyList()`。

> 疑難排解：
> * **401/403** — 檢查您的 API 金鑰/環境變數。
> * **檔案未找到 (File not found)** — 驗證 `images/` 路徑。
> * **頻率限制 (Rate limits)** — 如果需要，可以在呼叫周圍加入最少的重試/退避 (backoff) 邏輯。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    val response = executor.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4_1, tools = emptyList()).first()
    println(response.content)
}
```

    圖說：
    Running on cuteness and extra giggle power! Warning: Side effects may include heart-thief vibes and spontaneous dance parties. 💜🤖💃
    
    標籤：  
    #ViralVibes #UltraFamousBlogger #CutieAlert #QuirkyContent #InstaFun #SpreadTheLove #DancingIntoFame #RobotLife #InstaFamous #FeedGoals

```kotlin
runBlocking {
    val response = executor.executeStreaming(prompt = prompt, model = OpenAIModels.Chat.GPT4_1)
    response.collect { print(it) }
}
```

    圖說：  
    Running on good vibes & wi-fi only! 🤖💜 Drop a like if you feel the circuit-joy! #BlogBotInTheWild #HeartDeliveryService #DancingWithWiFi #UltraFamousBlogger #MoreFunThanYourAICat #ViralVibes #InstaFun #BeepBoopFamous