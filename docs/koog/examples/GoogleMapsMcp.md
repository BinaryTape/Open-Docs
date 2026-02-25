# 使用 Koog 结合 Google Maps MCP：在 Kotlin 笔记本中从零开始获取海拔数据

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

在这篇简短的博客式演练中，我们将把 Koog 连接到 Google Maps 的 Model Context Protocol (MCP) 服务器。我们将使用 Docker 启动服务器，发现可用工具，并让 AI 智能体对地址进行地理编码并获取其海拔——这一切都在 Kotlin 笔记本中完成。

最后，你将拥有一个可复现的端到端示例，可以将其直接应用到你的工作流或文档中。

```kotlin
%useLatestDescriptors
%use koog

```

## 前提条件
在运行下面的单元格之前，请确保你已经：

- 安装并运行 Docker
- 将有效的 Google Maps API 密钥导出为环境变量：`GOOGLE_MAPS_API_KEY`
- 将 OpenAI API 密钥导出为 `OPENAI_API_KEY`

你可以在 shell 中这样设置它们（macOS/Linux 示例）：

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
我们将使用官方的 `mcp/google-maps` 镜像。该容器将通过 MCP 暴露 `maps_geocode` 和 `maps_elevation` 等工具。我们通过环境变量传递 API 密钥，并以连接模式启动它，以便笔记本可以通过 stdio 与其通信。

```kotlin
// 启动带有 Google Maps MCP 服务器的 Docker 容器
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
Koog 可以通过 stdio 连接到 MCP 服务器。在这里，我们从运行中的进程创建一个工具注册表，并打印出发现的工具及其描述符。

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## 使用 OpenAI 构建 AI 智能体
接下来，我们组装一个由 OpenAI 执行器和模型支持的简单智能体。该智能体将能够通过我们刚刚创建的注册表调用 MCP 服务器暴露的工具。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 请求海拔：先地理编码，再获取海拔
我们提示智能体查找位于慕尼黑的 JetBrains 办公室的海拔。指令明确告知智能体仅使用可用工具，并指明完成该任务首选哪些工具。

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
完成后，请停止 Docker 进程，以免在后台留下运行中的容器。

```kotlin
process.destroy()

```

## 故障排除与后续步骤
- 如果容器启动失败，请检查 Docker 是否正在运行以及你的 `GOOGLE_MAPS_API_KEY` 是否有效。
- 如果智能体无法调用工具，请重新运行发现工具的单元格，以确保工具注册表已填充。
- 尝试使用其他提示词，例如使用可用的 Google Maps 工具进行路线规划或地点搜索。

接下来，可以考虑组合多个 MCP 服务器（例如，用于 Web 自动化的 Playwright + Google Maps），并让 Koog 编排工具使用以完成更丰富的任务。