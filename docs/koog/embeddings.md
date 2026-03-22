# 嵌入

`embeddings` 模块提供了生成和比较文本及代码嵌入的功能。嵌入是捕捉语义含义的向量表示，允许进行高效的相似性比较。

## 概览

该模块由两个主要组件组成：

1. **embeddings-base**：嵌入的核心接口和数据结构。
2. **embeddings-llm**：使用 Ollama 进行本地嵌入生成的实现。

## 入门指南

以下章节包含了如何通过以下方式使用嵌入的基本示例：

- 通过 Ollama 使用本地嵌入模型
- 使用 OpenAI 嵌入模型

### 本地嵌入

要将嵌入功能与本地模型配合使用，您需要在系统上安装并运行 Ollama。
有关安装和运行说明，请参阅 [Ollama 官方 GitHub 仓库](https://github.com/ollama/ollama)。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        // 创建 OllamaClient 实例
        val client = OllamaClient()
        // 创建 embedder
        val embedder = LLMEmbedder(client, OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
        // 创建嵌入
        val embedding = embedder.embed("This is the text to embed")
        // 将嵌入打印到输出
        println(embedding)
    }
}
```
<!--- KNIT example-embeddings-01.kt -->

要使用 Ollama 嵌入模型，请确保具备以下前提条件：

- 已安装并运行 [Ollama](https://ollama.com/download)
- 使用以下命令将嵌入模型下载到本地计算机：
    ```bash
    ollama pull <ollama-model-id>
    ```
    <!--- KNIT example-embeddings-01.txt -->

    将 `<ollama-model-id>` 替换为特定模型的 Ollama 标识符。有关可用嵌入模型及其标识符的更多信息，请参阅 [Ollama 模型概览](#ollama-models-overview)。

### Ollama 模型概览

下表提供了可用 Ollama 嵌入模型的概览。

| 模型 ID | Ollama ID | 参数 | 维度 | 上下文长度 | 性能 | 权衡 |
|-------------------|-------------------|------------|------------|----------------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| NOMIC_EMBED_TEXT | nomic-embed-text | 137M | 768 | 8192 | 用于语义搜索和文本相似性任务的高质量嵌入 | 在质量和效率之间取得了平衡 |
| ALL_MINILM | all-minilm | 33M | 384 | 512 | 推理速度快，且通用文本嵌入质量良好 | 模型较小且上下文长度较短，但非常高效 |
| MULTILINGUAL_E5 | zylonai/multilingual-e5-large | 300M | 768 | 512 | 在 100 多种语言中表现强劲 | 模型较大，但提供了出色的多语言能力 |
| BGE_LARGE | bge-large | 335M | 1024 | 512 | 非常适合英语文本检索和语义搜索 | 模型较大，但提供了高质量的嵌入 |
| MXBAI_EMBED_LARGE | mxbai-embed-large | - | - | - | 文本数据的高维嵌入 | 专为创建高维嵌入而设计 |

有关这些模型的更多信息，请参阅 Ollama 的 [嵌入模型](https://ollama.com/blog/embedding-models) 博客文章。

### 选择模型

以下是一些根据您的需求选择 Ollama 嵌入模型的通用提示：

- 对于通用文本嵌入，使用 `NOMIC_EMBED_TEXT`。
- 对于多语言支持，使用 `MULTILINGUAL_E5`。
- 为了获得最高质量（以性能为代价），使用 `BGE_LARGE`。
- 为了获得最高效率（以牺牲部分质量为代价），使用 `ALL_MINILM`。
- 对于高维嵌入，使用 `MXBAI_EMBED_LARGE`。

## OpenAI 嵌入

要使用 OpenAI 嵌入模型创建嵌入，请使用 `OpenAILLMClient` 实例的 `embed` 方法，如下面的示例所示。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
suspend fun openAIEmbed(text: String) {
    // 从 OPENAI_KEY 环境变量获取 OpenAI API 令牌
    val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY is not set")
    // 创建 OpenAILLMClient 实例
    val client = OpenAILLMClient(token)
    // 创建 embedder
    val embedder = LLMEmbedder(client, OpenAIModels.Embeddings.TextEmbeddingAda002)
    // 创建嵌入
    val embedding = embedder.embed(text)
    // 将嵌入打印到输出
    println(embedding)
}
```
<!--- KNIT example-embeddings-02.kt -->

## AWS Bedrock 嵌入

要使用 AWS Bedrock 嵌入模型创建嵌入，请使用 `BedrockLLMClient` 实例的 `embed` 方法及您选择的模型。示例：

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockModels
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
-->
```kotlin
suspend fun bedrockEmbed(text: String) {
    // 从环境/配置中获取 AWS 凭据
    val awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID") ?: error("AWS_ACCESS_KEY_ID not set")
    val awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY") ?: error("AWS_SECRET_ACCESS_KEY not set")
    // （可选）用于临时凭据的 AWS_SESSION_TOKEN
    val awsSessionToken = System.getenv("AWS_SESSION_TOKEN")
    // 创建 BedrockLLMClient 实例
    val client = BedrockLLMClient(
        identityProvider = StaticCredentialsProvider {
            this.accessKeyId = awsAccessKeyId
            this.secretAccessKey = awsSecretAccessKey
            awsSessionToken?.let { this.sessionToken = it }
        },
        settings = BedrockClientSettings()
    )
    // 创建 embedder
    val embedder = LLMEmbedder(client, BedrockModels.Embeddings.AmazonTitanEmbedText)
    // 创建嵌入
    val embedding = embedder.embed(text)
    // 将嵌入打印到输出
    println(embedding)
}
```
<!--- KNIT example-embeddings-03.kt -->

### 支持的 AWS Bedrock 嵌入模型

| 提供商 | 模型名称 | 模型 ID | 输入 | 输出 | 维度 | 上下文长度 | 备注 |
|----------|------------------------------|--------------------------------|-------|-----------|------------|----------------|-------------------------------------------------------------------------------------------------------|
| Amazon | Titan Embeddings G1 - Text | `amazon.titan-embed-text-v1` | 文本 | 嵌入 | 1,536 | 8192 | 支持 25 种以上语言，针对检索、语义相似性、聚类进行了优化；为搜索对长文档进行分段。 |
| Amazon | Titan Text Embeddings V2 | `amazon.titan-embed-text-v2:0` | 文本 | 嵌入 | 1,024 | 8192 | 高精度、灵活的维度、多语言（100 多种）；较小的维度可节省存储空间，输出经过归一化。 |
| Cohere | Cohere Embed English v3 | `cohere.embed-english-v3` | 文本 | 嵌入 | 1,024 | 8192 | 用于搜索、检索和理解文本细微差别的 SOTA 英语文本嵌入。 |
| Cohere | Cohere Embed Multilingual v3 | `cohere.embed-multilingual-v3` | 文本 | 嵌入 | 1,024 | 8192 | 多语言嵌入，在跨语言搜索和语义理解方面处于 SOTA 水平。 |

> 有关最新的模型支持情况，请参阅 [AWS Bedrock 支持的模型文档](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)。

## 示例

以下示例展示了如何使用嵌入来将代码与文本或其他代码片段进行比较。

### 代码与文本比较

将代码片段与自然语言描述进行比较以找到语义匹配：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToText(embedder: Embedder) { // Embedder 类型
    // 代码片段
    val code = """
        fun factorial(n: Int): Int {
            return if (n <= 1) 1 else n * factorial(n - 1)
        }
    """.trimIndent()

    // 文本描述
    val description1 = "A recursive function that calculates the factorial of a number"
    val description2 = "A function that sorts an array of integers"

    // 生成嵌入
    val codeEmbedding = embedder.embed(code)
    val desc1Embedding = embedder.embed(description1)
    val desc2Embedding = embedder.embed(description2)

    // 计算差异（值越低表示越相似）
    val diff1 = embedder.diff(codeEmbedding, desc1Embedding)
    val diff2 = embedder.diff(codeEmbedding, desc2Embedding)

    println("Difference between code and description 1: $diff1")
    println("Difference between code and description 2: $diff2")

    // 该代码应与 description1 比 description2 更相似
    if (diff1 < diff2) {
        println("The code is more similar to: '$description1'")
    } else {
        println("The code is more similar to: '$description2'")
    }
}
```
<!--- KNIT example-embeddings-04.kt -->

### 代码与代码比较

比较代码片段以找到语义相似性，无论语法是否存在差异：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToCode(embedder: Embedder) { // Embedder 类型
    // 同一个算法在不同语言下的两种实现
    val kotlinCode = """
        fun fibonacci(n: Int): Int {
            return if (n <= 1) n else fibonacci(n - 1) + fibonacci(n - 2)
        }
    """.trimIndent()

    val pythonCode = """
        def fibonacci(n):
            if n <= 1:
                return n
            else:
                return fibonacci(n-1) + fibonacci(n-2)
    """.trimIndent()

    val javaCode = """
        public static int bubbleSort(int[] arr) {
            int n = arr.length;
            for (int i = 0; i < n-1; i++) {
                for (int j = 0; j < n-i-1; j++) {
                    if (arr[j] > arr[j+1]) {
                        int temp = arr[j];
                        arr[j] = arr[j+1];
                        arr[j+1] = temp;
                    }
                }
            }
            return arr;
        }
    """.trimIndent()

    // 生成嵌入
    val kotlinEmbedding = embedder.embed(kotlinCode)
    val pythonEmbedding = embedder.embed(pythonCode)
    val javaEmbedding = embedder.embed(javaCode)

    // 计算差异
    val diffKotlinPython = embedder.diff(kotlinEmbedding, pythonEmbedding)
    val diffKotlinJava = embedder.diff(kotlinEmbedding, javaEmbedding)

    println("Difference between Kotlin and Python implementations: $diffKotlinPython")
    println("Difference between Kotlin and Java implementations: $diffKotlinJava")

    // Kotlin 和 Python 的实现应该更相似
    if (diffKotlinPython < diffKotlinJava) {
        println("The Kotlin code is more similar to the Python code")
    } else {
        println("The Kotlin code is more similar to the Java code")
    }
}
```
<!--- KNIT example-embeddings-05.kt -->

## API 文档

有关嵌入相关的完整 API 参考，请参阅以下模块的参考文档：

- [embeddings-base](api:embeddings-base::ai.koog.embeddings.base)：提供用于表示和比较文本及代码嵌入的核心接口和数据结构。
- [embeddings-llm](api:embeddings-llm::)：包含用于处理本地嵌入模型的实现。