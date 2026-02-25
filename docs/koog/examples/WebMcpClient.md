# 使用 Bright Data 的 Web MCP 与 Koog 进行网页抓取

[:material-github: Open on GitHub](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: Download .kt](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

在本教程中，您将把 Koog 智能体连接到 Bright Data 的 Web MCP 服务器，并让其执行网页抓取和数据采集任务。我们将演示如何通过 Model Context Protocol，利用 Bright Data 强大的网页抓取基础架构来搜索关于 Koog.ai 的信息。

我们将保持内容简单且可复现，重点介绍一种最小化但符合实际的智能体 + 工具设置，您可以根据自己的网页抓取需求进行调整。

## 前置条件

- 已导出为环境变量的 OpenAI API 密钥：`OPENAI_API_KEY`
- 已导出为环境变量的 Bright Data API 令牌：`BRIGHT_DATA_API_TOKEN`
- 在 PATH 中可用的 Node.js 和 npx
- 包含 Koog 依赖项的 Kotlin 开发环境

**提示**：Bright Data MCP 服务器提供了对企业级网页抓取工具的访问，这些工具可以处理复杂的网站、验证码 (CAPTCHA) 和反爬虫措施。

## 1) 设置您的 API 凭据

我们从环境变量中读取这两个 API 密钥，以确保密钥安全并将其从代码中分离。

```kotlin
// 从环境变量中获取 API 密钥
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("OPENAI_API_KEY environment variable is not set")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")
```

## 2) 启动 Bright Data 的 Web MCP 服务器

我们将使用 `npx` 启动 Bright Data 的 MCP 服务器，并使用您的 API 令牌对其进行配置。该服务器将通过 Model Context Protocol 开放网页抓取功能。

```kotlin
println("Starting Bright Data MCP server...")

// 将 Bright Data MCP 服务器作为一个单独的进程启动
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// 为 MCP 服务器进程设置 API_TOKEN 环境变量
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// 启动进程
val process = processBuilder.start()

// 给进程一点启动时间
Thread.sleep(2000)
```

## 3) 从 Koog 连接并创建智能体

我们构建一个带有 OpenAI 执行器的 Koog `AIAgent`，并通过 STDIO 传输将其工具注册表连接到 Bright Data MCP 服务器。然后，我们将探索可用的工具并运行网页抓取任务。

```kotlin
println("Creating STDIO transport...")
try {
    // 创建 STDIO 传输
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("Creating tool registry...")
    
    // 使用来自 Bright Data MCP 服务器的工具创建一个工具注册表
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // 打印可用工具（可选 - 用于调试）
    println("Available tools from Bright Data MCP server:")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // 使用 MCP 工具创建智能体
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiKey),
        systemPrompt = "You are a helpful assistant with access to web scraping and data collection tools from Bright Data. You can help users gather information from websites, analyze web data, and provide insights.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = toolRegistry,
        maxIterations = 100
    )
    
    val result = agent.run("Please search for Koog.ai and tell me what is it and who invented it")
    
    println("
Agent response:")
    println(result)
    
} catch (e: Exception) {
    println("Error: ${e.message}")
    e.printStackTrace()
} finally {
    println("Shutting down MCP server...")
    process.destroyForcibly()
}
```

## 4) 完整代码示例

以下是演示使用 Bright Data 的 Web MCP 进行网页抓取的完整工作示例：

```kotlin
package koog

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

/**
 * 程序的入口点，演示 AI 驱动的网页抓取和数据采集。
 *
 * 此函数初始化一个 Bright Data MCP 服务器，设置工具集成，
 * 并定义一个用于与网页抓取工具交互的 AI 智能体。它演示了
 * 以下关键操作：
 *
 * 1. 使用带有正确 API 令牌配置的子进程启动 Bright Data MCP 服务器。
 * 2. 通过 STDIO 传输通信配置来自 MCP 服务器的工具注册表。
 * 3. 利用 OpenAI 的 GPT-4o 模型创建具有网页抓取能力的 AI 智能体。
 * 4. 运行智能体以执行指定任务（例如，搜索并分析关于 Koog.ai 的网页内容）。
 * 5. 执行后关闭 MCP 服务器进程进行清理。
 *
 * 此函数用于教程目的，演示如何将 MCP (Model Context Protocol) 服务器
 * 与 AI 智能体集成，以进行网页数据采集和分析。
 * 它需要设置 OPENAI_API_KEY 和 BRIGHT_DATA_API_TOKEN 环境变量。
 */
fun main() = runBlocking {
    // 从环境变量中获取 API 密钥
    val openAIApiKey = System.getenv("OPENAI_API_KEY")
        ?: error("OPENAI_API_KEY environment variable is not set")
    val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
        ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")

    println("Starting Bright Data MCP server...")

    // 将 Bright Data MCP 服务器作为一个单独的进程启动
    val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

    // 为 MCP 服务器进程设置 API_TOKEN 环境变量
    val environment = processBuilder.environment()
    environment["API_TOKEN"] = brightDataToken

    // 启动进程
    val process = processBuilder.start()

    // 给进程一点启动时间
    Thread.sleep(2000)

    println("Creating STDIO transport...")

    try {
        // 创建 STDIO 传输
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("Creating tool registry...")
        
        // 使用来自 Bright Data MCP 服务器的工具创建一个工具注册表
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // 打印可用工具（可选 - 用于调试）
        println("Available tools from Bright Data MCP server:")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // 使用 MCP 工具创建智能体
        val agent = AIAgent(
            executor = simpleOpenAIExecutor(openAIApiKey),
            systemPrompt = "You are a helpful assistant with access to web scraping and data collection tools from Bright Data. You can help users gather information from websites, analyze web data, and provide insights.",
            llmModel = OpenAIModels.Chat.GPT4o,
            temperature = 0.7,
            toolRegistry = toolRegistry,
            maxIterations = 100
        )
        
        val result = agent.run("Please search for Koog.ai and tell me what is it and who invented it")
        
        println("
Agent response:")
        println(result)
        
    } catch (e: Exception) {
        println("Error: ${e.message}")
        e.printStackTrace()
    } finally {
        println("Shutting down MCP server...")
        process.destroyForcibly()
    }
}
```

## 故障排除

- **连接问题**：如果智能体无法连接到 MCP 服务器，请确保已通过 `npx @brightdata/mcp` 正确安装了 Bright Data MCP 软件包。
- **API 令牌错误**：仔细检查您的 `BRIGHT_DATA_API_TOKEN` 是否有效，并且具有网页抓取所需的权限。
- **OpenAI 身份验证**：验证您的 `OPENAI_API_KEY` 环境变量是否已正确设置且 API 密钥有效。
- **进程超时**：如果服务器启动时间较长，请增加 `Thread.sleep(2000)` 的持续时间。

## 后续步骤

- **探索不同的查询**：尝试抓取不同的网站或搜索各种主题。
- **自定义工具集成**：在 Bright Data 的网页抓取能力之外添加您自己的工具。
- **高级抓取**：利用 Bright Data 的高级功能，如住宅代理、验证码识别和 JavaScript 渲染。
- **数据处理**：将抓取的数据与其他 Koog 智能体结合进行分析和洞察。
- **生产部署**：将此模式集成到您的应用程序中，以实现自动化网页数据采集。

## 您学到的内容

本教程演示了如何：
- 设置并配置 Bright Data 的 Web MCP
- 通过 STDIO 传输将 Koog AI 智能体连接到外部 MCP 服务器
- 使用自然语言指令执行 AI 驱动的网页抓取任务
- 处理适当的资源清理和错误管理
- 为生产就绪的网页抓取应用程序构建代码结构

Koog 的 AI 智能体能力与 Bright Data 的企业级网页抓取基础架构相结合，为自动化数据采集和分析工作流提供了强大的基础。