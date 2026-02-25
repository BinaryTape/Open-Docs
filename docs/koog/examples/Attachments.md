# 附件

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 设置环境

在深入研究代码之前，我们先确保 Kotlin Notebook 已准备就绪。
在这里，我们加载最新的描述符并启用 **Koog** 库，
它为使用 AI 模型提供商提供了简洁的 API。

```kotlin
// 加载最新的描述符并为 Kotlin Notebook 激活 Koog 集成。
// 这将使 Koog DSL 类型和执行器在后续单元格中可用。
%useLatestDescriptors
%use koog
```

## 配置 API 密钥

我们从环境变量中读取 API 密钥。这样可以将敏感信息排除在 Notebook 文件之外，并允许您
切换提供商。您可以设置 `OPENAI_API_KEY`、`ANTHROPIC_API_KEY` 或 `GEMINI_API_KEY`。

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // 或 ANTHROPIC_API_KEY，或 GEMINI_API_KEY
```

## 创建简单的 OpenAI 执行器

执行器封装了身份验证、基础 URL 和正确的默认设置。这里我们使用一个简单的 OpenAI 执行器，
但您可以在不更改其余代码的情况下将其更换为 Anthropic 或 Gemini。

```kotlin
// --- 提供商选择 ---
// 适用于 OpenAI 兼容模型。替代方案包括：
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// 所有执行器都公开相同的高级 API。
val executor = simpleOpenAIExecutor(apiKey)
```

Koog 的 prompt DSL 允许您添加**结构化 Markdown** 和**附件**。
在此单元格中，我们构建一个 prompt，要求模型生成一段简短的、博客风格的“内容卡片”，并
附上来自本地 `images/` 目录的两张图片。

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

## 执行并检查响应

我们针对 `gpt-4.1` 运行该 prompt，获取第一条消息，并打印其内容。
如果您需要流式传输，请在 Koog 中切换到流式 API；对于工具使用，请传入您的工具列表，而不是 `emptyList()`。

> 故障排除：
> * **401/403** — 检查您的 API 密钥/环境变量。
> * **File not found** — 验证 `images/` 路径。
> * **Rate limits** — 如有需要，在调用周围添加最少的重试/退避逻辑。

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