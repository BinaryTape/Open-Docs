# 附件

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 设置环境

在深入代码之前，我们确保 Kotlin Notebook 已准备就绪。在这里，我们加载最新的描述符并启用 **Koog** 库，该库为使用 AI 模型提供商提供了简洁的 API。

```kotlin
// Loads the latest descriptors and activates Koog integration for Kotlin Notebook.
// This makes Koog DSL types and executors available in further cells.
%useLatestDescriptors
%use koog
```

## 配置 API 密钥

我们从环境变量中读取 API 密钥。这可以防止秘密信息泄露到 notebook 文件中，并允许你切换提供商。你可以设置 `OPENAI_API_KEY`、`ANTHROPIC_API_KEY` 或 `GEMINI_API_KEY`。

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // or ANTHROPIC_API_KEY, or GEMINI_API_KEY
```

## 创建一个简单的 OpenAI 执行器

执行器封装了身份验证、基本 URL 和正确的默认值。这里我们使用一个简单的 OpenAI 执行器，但你可以将其替换为 Anthropic 或 Gemini，而无需更改代码的其余部分。

```kotlin
// --- Provider selection ---
// For OpenAI-compatible models. Alternatives include:
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// All executors expose the same high‑level API.
val executor = simpleOpenAIExecutor(apiKey)
```

Koog 的 prompt DSL 允许你添加**结构化 Markdown** 和**附件**。在此单元格中，我们构建了一个 prompt，要求模型生成一个简短的、博客风格的“内容卡片”，并附带两张来自本地 `images/` 目录的图片。

```kotlin
import ai.koog.prompt.markdown.markdown
import kotlinx.io.files.Path

val prompt = prompt("images-prompt") {
    system("你是一个专业的助手，能为 Instagram 帖子编写酷炫有趣的描述。")

    user {
        markdown {
            +"我想在 Instagram 上发布新帖子。"
            br()
            +"你能为我的 Instagram 帖子和以下照片写些创意内容吗？"
            br()
            h2("要求")
            bulleted {
                item("必须非常有趣和有创意")
                item("必须增加我成为超级网红的机会！！！！")
                item("不得包含露骨内容、骚扰或欺凌")
                item("必须是简短、吸引人的短语")
                item("必须包含能提高帖子可见度的相关话题标签")
            }
        }

        attachments {
            image(Path("images/kodee-loving.png"))
            image(Path("images/kodee-electrified.png"))
        }
    }
}
```

## 执行并探查响应

我们对 `gpt-4.1` 运行 prompt，收集第一条消息，并打印其内容。如果你想要流式传输，请切换到 Koog 中的流式 API；对于工具使用，请传递你的工具列表而不是 `emptyList()`。

> 故障排除：
> * **401/403** — 检查你的 API 密钥/环境变量。
> * **文件未找到** — 验证 `images/` 路径。
> * **速率限制** — 如有需要，在调用周围添加最小重试/指数退避逻辑。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    val response = executor.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4_1, tools = emptyList()).first()
    println(response.content)
}
```

    说明：
    靠可爱和额外的傻笑能量运行！警告：副作用可能包括偷心氛围和自发性舞会。💜🤖💃
    
    话题标签：  
    #ViralVibes #UltraFamousBlogger #CutieAlert #QuirkyContent #InstaFun #SpreadTheLove #DancingIntoFame #RobotLife #InstaFamous #FeedGoals

```kotlin
runBlocking {
    val response = executor.executeStreaming(prompt = prompt, model = OpenAIModels.Chat.GPT4_1)
    response.collect { print(it) }
}
```

    说明：  
    靠好心情和 Wi-Fi 运行！🤖💜 如果你感受到电路的喜悦，就点个赞吧！#BlogBotInTheWild #HeartDeliveryService #DancingWithWiFi #UltraFamousBlogger #MoreFunThanYourAICat #ViralVibes #InstaFun #BeepBoopFamous