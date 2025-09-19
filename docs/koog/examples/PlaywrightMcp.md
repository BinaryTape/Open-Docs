# 使用 Playwright MCP 和 Koog 驱动浏览器

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

在这个 notebook 中，你将把一个 Koog 代理连接到 Playwright 的 Model Context Protocol (MCP) 服务器，并让它驱动真实的浏览器来完成一项任务：打开 jetbrains.com，接受 Cookie，然后点击工具栏中的 AI 部分。

我们将保持事情简单且可复现，专注于一个最小化但真实的代理 + 工具设置，你可以发布和重用它。

```kotlin
%useLatestDescriptors
%use koog

```

## 先决条件
- 已导出为环境变量 `OPENAI_API_KEY` 的 OpenAI API key
- Node.js 和 npx 在你的 PATH 环境变量中可用
- 具有通过 `%use koog` 可用的 Koog 的 Kotlin Jupyter notebook 环境

提示：以有头模式运行 Playwright MCP 服务器，以观看浏览器自动化这些步骤。

## 1) 提供你的 OpenAI API key
我们从 `OPENAI_API_KEY` 环境变量中读取 API key。这使得敏感信息不会出现在 notebook 中。

```kotlin
// Get the API key from environment variables
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) 启动 Playwright MCP 服务器
我们将使用 npx 在本地启动 Playwright 的 MCP 服务器。默认情况下，它将暴露一个 SSE endpoint，我们可以从 Koog 连接到它。

```kotlin
// Start the Playwright MCP server via npx
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) 从 Koog 连接并运行代理
我们构建一个带有 OpenAI 执行器的最小化 Koog AIAgent，并将其工具注册表指向通过 SSE 连接的 MCP 服务器。然后我们要求它严格通过工具完成浏览器任务。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    println("正在连接到 Playwright MCP 服务器...")
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
    )
    println("成功连接到 Playwright MCP 服务器")

    // Create the agent
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiToken),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = toolRegistry,
    )

    val request = "Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar"
    println("正在发送请求：$request")

    agent.run(
        request + ". " +
            "你只能调用工具。使用 Playwright 工具完成此任务。"
    )
}

```

## 4) 关闭 MCP 进程
始终在运行结束时清理外部进程。

```kotlin
// Shutdown the Playwright MCP process
println("正在关闭与 Playwright MCP 服务器的连接")
process.destroy()

```

## 故障排除
- 如果代理无法连接，请确保 MCP 服务器正在 `http://localhost:8931` 上运行。
- 如果你没有看到浏览器，请确保 Playwright 已安装并能在你的系统上启动浏览器。
- 如果你从 OpenAI 收到认证错误，请仔细检查 `OPENAI_API_KEY` 环境变量。

## 下一步
- 尝试不同的网站或流程。MCP 服务器暴露了 Playwright 的一套丰富的工具。
- 更换 LLM 模型，或向 Koog 代理添加更多工具。
- 将此流程集成到你的应用中，或将此 notebook 发布为文档。