# 附件

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 設定環境

在深入程式碼之前，我們需要確保 Kotlin Notebook 已準備就緒。
在這裡，我們載入最新的描述符 (descriptors) 並啟用 **Koog** 函式庫，
它提供了一個簡潔的 API 來與 AI 模型供應商合作。

```kotlin
// 載入最新的描述符並啟用 Koog 與 Kotlin Notebook 的整合。
// 這使得 Koog 的 DSL 型別和執行器在後續單元格中可用。
%useLatestDescriptors
%use koog
```

## 設定 API 金鑰

我們從環境變數中讀取 API 金鑰。這能避免將機密資訊 (secrets) 寫入筆記本檔案，並讓你能夠切換供應商。
你可以設定 `OPENAI_API_KEY`、`ANTHROPIC_API_KEY` 或 `GEMINI_API_KEY`。

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // or ANTHROPIC_API_KEY, or GEMINI_API_KEY
```

## 建立一個簡單的 OpenAI 執行器

執行器封裝了身份驗證 (authentication)、基礎 URL (base URLs) 和正確的預設值。在這裡，我們使用一個簡單的 OpenAI 執行器，
但你可以在不改變其他程式碼的情況下，將其替換為 Anthropic 或 Gemini 的執行器。

```kotlin
// --- 供應商選擇 ---
// 適用於 OpenAI 相容模型。其他選項包括：
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// 所有執行器都暴露相同的高階 API。
val executor = simpleOpenAIExecutor(apiKey)
```

Koog 的 prompt DSL 讓你能夠新增 **結構化 Markdown** 和 **附件**。
在此單元格中，我們建立一個 prompt，要求模型生成一個簡短、部落格風格的「內容卡片 (content card)」，
並從本機的 `images/` 目錄附加兩張圖片。

```kotlin
import ai.koog.prompt.markdown.markdown
import kotlinx.io.files.Path

val prompt = prompt("images-prompt") {
    system("你是一位專業的助理，能夠為 Instagram 貼文撰寫酷炫有趣的描述。")

    user {
        markdown {
            +"我想在 Instagram 上發佈一個新貼文。"
            br()
            +"你能為我下面的 Instagram 貼文和這些照片寫些有創意的內容嗎？"
            br()
            h2("要求")
            bulleted {
                item("它必須非常有趣且富有創意")
                item("它必須增加我成為超有名部落客的機會!!!!")
                item("它不得包含露骨內容、騷擾或霸凌行為")
                item("它必須是一個簡短吸睛的句子")
                item("你必須包含相關的 hashtag，以增加我貼文的曝光率")
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

我們對 `gpt-4.1` 執行 prompt，收集第一條訊息，並印出其內容。
如果你需要串流 (streaming)，請切換到 Koog 中的串流 API；對於工具使用 (tool use)，則傳遞你的工具列表而不是 `emptyList()`。

> 疑難排解:
> * **401/403** — 檢查你的 API 金鑰/環境變數。
> * **檔案未找到** — 驗證 `images/` 路徑。
> * **速率限制 (Rate limits)** — 如有需要，在呼叫周圍增加最小的重試/退避 (retry/backoff) 機制。

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