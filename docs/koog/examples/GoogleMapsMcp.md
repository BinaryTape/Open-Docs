# 通过 Koog 在 Kotlin Notebook 中使用 Google Maps MCP：从零到海拔高度

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

在这个简短的博客风格演练中，我们将 Koog 连接到 Google Maps 的 Model Context Protocol (MCP) 服务器。我们将使用 Docker 启动服务器，发现可用的工具，并让 AI 代理对地址进行地理编码并获取其海拔高度——所有这些操作都在 Kotlin Notebook 中完成。

完成后，您将拥有一个可重现的端到端示例，您可以将其融入到您的工作流或文档中。

```kotlin
%useLatestDescriptors
%use koog

```

## 前提条件
在运行下面的单元格之前，请确保您已具备以下条件：

- Docker 已安装并正在运行
- 一个有效的 Google Maps API 密钥，并已将其作为环境变量 `GOOGLE_MAPS_API_KEY` 导出
- 一个 OpenAI API 密钥，并已将其作为 `OPENAI_API_KEY` 导出

您可以在 shell 中这样设置它们 (macOS/Linux 示例)：

```bash
export GOOGLE_MAPS_API_KEY="<your-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

```kotlin
// 从环境变量获取 API 密钥
val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY") ?: error("GOOGLE_MAPS_API_KEY environment variable not set")
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 启动 Google Maps MCP 服务器 (Docker)
我们将使用官方的 `mcp/google-maps` 镜像。容器将通过 MCP 暴露 `maps_geocode` 和 `maps_elevation` 等工具。我们通过环境变量传递 API 密钥，并以前台模式启动它，以便 Notebook 可以通过 stdio 与其通信。

```kotlin
// 启动运行 Google Maps MCP 服务器的 Docker 容器
val process = ProcessBuilder(
    "docker",
    "run",
    "-i",
    "-e",
    "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

```

## 通过 McpToolRegistry 发现工具
Koog 可以通过 stdio 连接到 MCP 服务器。在这里，我们从正在运行的进程创建一个工具注册表，并打印出发现的工具及其描述符。

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## 使用 OpenAI 构建 AI 代理
接下来，我们组装一个由 OpenAI 执行器和模型支持的简单代理。该代理将能够通过我们刚刚创建的注册表调用 MCP 服务器暴露的工具。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 请求海拔高度：先地理编码，后海拔高度
我们提示代理查找位于慕尼黑的 JetBrains 办公室的海拔高度。指令显式地告诉代理只能使用可用的工具，以及在执行任务时应优先使用哪些工具。

```kotlin
import kotlinx.coroutines.runBlocking

val request = "Get elevation of the Jetbrains Office in Munich, Germany?"
runBlocking {
    agent.run(
        request +
            "You can only call tools. Get it by calling maps_geocode and maps_elevation tools."
    )
}

```

## 清理
完成后，停止 Docker 进程，以免在后台留下任何正在运行的程序。

```kotlin
process.destroy()

```

## 故障排除和后续步骤
- 如果容器启动失败，请检查 Docker 是否正在运行以及您的 `GOOGLE_MAPS_API_KEY` 是否有效。
- 如果代理无法调用工具，请重新运行发现单元格，以确保工具注册表已填充。
- 尝试使用可用的 Google Maps 工具进行其他提示，例如路线规划或地点搜索。

接下来，考虑组合多个 MCP 服务器（例如，用于 Web 自动化的 Playwright + Google Maps），并让 Koog 编排工具使用以完成更丰富的任务。