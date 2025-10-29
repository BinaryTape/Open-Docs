# 使用 Bright Data 和 Koog 的 The Web MCP 进行网页抓取

[:material-github: 在 GitHub 上打开](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: 下载 .kt 文件](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

在本教程中，你将把一个 Koog 代理连接到 Bright Data 的 The Web MCP 服务器，让它执行网页抓取和数据收集任务。我们将演示如何通过 Model Context Protocol，使用 Bright Data 强大的网页抓取基础设施来搜索关于 Koog.ai 的信息。

我们将保持内容简单且可复现，重点关注一个最小化但真实的代理 + 工具设置，你可以将其应用于自己的网页抓取需求。

## 前提条件

- 作为环境变量导出的 OpenAI API 密钥：`OPENAI_API_KEY`
- 作为环境变量导出的 Bright Data API 令牌：`BRIGHT_DATA_API_TOKEN`
- Node.js 和 npx 在你的 PATH 中可用
- 带有 Koog 依赖项的 Kotlin 开发环境

**提示**: Bright Data MCP 服务器提供企业级网页抓取工具，可以处理复杂的网站、验证码和反机器人措施。

## 1) 设置你的 API 凭据

我们从环境变量中读取这两个 API 密钥，以确保秘密安全并使其不出现在你的代码中。

```kotlin
// Get API keys from environment variables
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("OPENAI_API_KEY environment variable is not set")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")
```

## 2) 启动 Bright Data 的 The Web MCP 服务器

我们将使用 `npx` 启动 Bright Data 的 MCP 服务器，并使用你的 API 令牌对其进行配置。该服务器将通过 Model Context Protocol 公开网页抓取功能。

```kotlin
println("Starting Bright Data MCP server...")

// Start the Bright Data MCP server as a separate process
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// Set the API_TOKEN environment variable for the MCP server process
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// Start the process
val process = processBuilder.start()

// Give the process a moment to start
Thread.sleep(2000)
```

## 3) 从 Koog 连接并创建代理

我们构建一个带有 OpenAI 执行器的 Koog `AIAgent`，并通过 STDIO transport 将其工具注册表连接到 Bright Data MCP 服务器。然后我们将探索可用的工具并运行一个网页抓取任务。

```kotlin
println("Creating STDIO transport...")
try {
    // Create the STDIO transport
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("Creating tool registry...")
    
    // Create a tool registry with tools from the Bright Data MCP server
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // Print available tools (optional - for debugging)
    println("Available tools from Bright Data MCP server:")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // Create the agent with MCP tools
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

## 4) 完整的代码示例

以下是演示使用 Bright Data 的 The Web MCP 进行网页抓取的完整工作示例：

```kotlin
package koog

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

/**
 * 演示 AI 驱动的网页抓取和数据收集的程序入口点。
 *
 * 此函数初始化 Bright Data MCP 服务器，设置工具集成，并定义一个 AI 代理以与网页抓取工具交互。
 * 它演示了以下关键操作：
 *
 * 1. 使用带有正确 API 令牌配置的子进程启动 Bright Data MCP 服务器。
 * 2. 通过 STDIO 传输通信配置来自 MCP 服务器的工具注册表。
 * 3. 创建一个利用 OpenAI 的 GPT-4o 模型并具有网页抓取功能的 AI 代理。
 * 4. 运行代理以执行指定任务（例如，搜索和分析关于 Koog.ai 的网页内容）。
 * 5. 执行后通过关闭 MCP 服务器进程进行清理。
 *
 * 此函数旨在用于教程目的，演示如何将 MCP (Model Context Protocol) 服务器与 AI 代理集成，
 * 以进行网页数据收集和分析。它要求设置 OPENAI_API_KEY 和 BRIGHT_DATA_API_TOKEN 环境变量。
 */
fun main() = runBlocking {
    // Get API keys from environment variables
    val openAIApiKey = System.getenv("OPENAI_API_KEY")
        ?: error("OPENAI_API_KEY environment variable is not set")
    val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
        ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")

    println("Starting Bright Data MCP server...")

    // Start the Bright Data MCP server as a separate process
    val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

    // Set the API_TOKEN environment variable for the MCP server process
    val environment = processBuilder.environment()
    environment["API_TOKEN"] = brightDataToken

    // Start the process
    val process = processBuilder.start()

    // Give the process a moment to start
    Thread.sleep(2000)

    println("Creating STDIO transport...")

    try {
        // Create the STDIO transport
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("Creating tool registry...")
        
        // Create a tool registry with tools from the Bright Data MCP server
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // Print available tools (optional - for debugging)
        println("Available tools from Bright Data MCP server:")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // Create the agent with MCP tools
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

- **连接问题**: 如果代理无法连接到 MCP 服务器，请确保 Bright Data MCP 包已通过 `npx @brightdata/mcp` 正确安装。
- **API 令牌错误**: 仔细检查你的 `BRIGHT_DATA_API_TOKEN` 是否有效，并且具有网页抓取所需的权限。
- **OpenAI 认证**: 验证你的 `OPENAI_API_KEY` 环境变量是否已正确设置，并且 API 密钥是否有效。
- **进程超时**: 如果服务器启动时间较长，请增加 `Thread.sleep(2000)` 的持续时间。

## 后续步骤

- **探索不同的查询**: 尝试抓取不同的网站或搜索各种主题。
- **自定义工具集成**: 在 Bright Data 的网页抓取功能之外添加你自己的工具。
- **高级抓取**: 利用 Bright Data 的高级特性，例如住宅代理、验证码解决和 JavaScript 渲染。
- **数据处理**: 将抓取的数据与其他 Koog 代理结合，以进行分析和获取洞察。
- **生产部署**: 将此模式集成到你的应用程序中，以实现自动化网页数据收集。

## 你学到了什么

本教程演示了如何：
- 设置和配置 Bright Data 的 The Web MCP
- 通过 STDIO transport 将 Koog AI 代理连接到外部 MCP 服务器
- 使用自然语言指令执行 AI 驱动的网页抓取任务
- 处理正确的资源清理和错误管理
- 为生产就绪的网页抓取应用程序构建代码

Koog 的 AI 代理功能与 Bright Data 的企业级网页抓取基础设施的结合，为自动化数据收集和分析工作流提供了强大的基础。