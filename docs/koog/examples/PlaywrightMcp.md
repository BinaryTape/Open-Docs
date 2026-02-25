# 使用 Playwright MCP 和 Koog 驱动浏览器

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

在本笔记本中，您会将 Koog 智能体连接到 Playwright 的模型上下文协议 (MCP) 服务器，并让它驱动真实的浏览器来完成一项任务：打开 jetbrains.com，接受 Cookie，并点击工具栏中的 AI 部分。

我们将保持内容简单且可复现，重点介绍一个最小化但现实的智能体 + 工具设置，您可以发布并重复使用。

```kotlin
%useLatestDescriptors
%use koog

```

## 前提条件
- 导出为环境变量的 OpenAI API 密钥：`OPENAI_API_KEY`
- PATH 中可用的 Node.js 和 npx
- 已通过 `%use koog` 提供 Koog 的 Kotlin Jupyter notebook 环境

提示：在有头模式（headful mode）下运行 Playwright MCP 服务器，以观察浏览器的自动化步骤。

## 1) 提供您的 OpenAI API 密钥
我们从 `OPENAI_API_KEY` 环境变量中读取 API 密钥。这可以防止将密钥泄露在笔记本中。

```kotlin
// 从环境变量中获取 API 密钥
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) 启动 Playwright MCP 服务器
我们将使用 `npx` 在本地启动 Playwright 的 MCP 服务器。默认情况下，它将公开一个我们可以从 Koog 连接的 SSE 端点。

```kotlin
// 通过 npx 启动 Playwright MCP 服务器
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) 从 Koog 连接并运行智能体
我们构建一个带有 OpenAI 执行器 (executor) 的最小化 Koog `AIAgent`，并将其工具库 (tool registry) 通过 SSE 指向 MCP 服务器。然后我们要求它严格通过工具来完成浏览器任务。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    println("Connecting to Playwright MCP server...")
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
    )
    println("Successfully connected to Playwright MCP server")

    // 创建智能体
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiToken),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = toolRegistry,
    )

    val request = "Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar"
    println("Sending request: $request")

    agent.run(
        request + ". " +
            "You can only call tools. Use the Playwright tools to complete this task."
    )
}

```

## 4) 关闭 MCP 进程
始终在运行结束时清理外部进程。

```kotlin
// 关闭 Playwright MCP 进程
println("Closing connection to Playwright MCP server")
process.destroy()

```

## 故障排除
- 如果智能体无法连接，请确保 MCP 服务器正在 `http://localhost:8931` 上运行。
- 如果您没有看到浏览器，请确保已安装 Playwright 并且能够在您的系统上启动浏览器。
- 如果您收到来自 OpenAI 的身份验证错误，请仔细检查 `OPENAI_API_KEY` 环境变量。

## 后续步骤
- 尝试不同的网站或流程。MCP 服务器公开了一套丰富的 Playwright 工具。
- 更换 LLM 模型，或向 Koog 智能体添加更多工具。
- 将此流程集成到您的应用中，或将笔记本作为文档发布。