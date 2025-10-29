# 嵌入

`embeddings` 模块提供了用于生成和比较文本与代码嵌入的功能。嵌入是捕获语义信息的向量表示，从而实现高效的相似度比较。

## 概述

该模块由两个主要组件组成：

1.  **embeddings-base**：嵌入的核心接口和数据结构。
2.  **embeddings-llm**：使用 Ollama 实现本地嵌入生成。

## 开始使用

以下部分包含如何通过以下方式使用嵌入的基本示例：

-   通过 Ollama 使用本地嵌入模型
-   使用 OpenAI 嵌入模型

### 本地嵌入

要将嵌入功能与本地模型一起使用，您需要在系统上安装并运行 Ollama。有关安装和运行说明，请参考 [Ollama 官方 GitHub 版本库](https://github.com/ollama/ollama)。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        // Create an OllamaClient instance
        val client = OllamaClient()
        // Create an embedder
        val embedder = LLMEmbedder(client, OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
        // Create embeddings
        val embedding = embedder.embed("This is the text to embed")
        // Print embeddings to the output
        println(embedding)
    }
}
```
<!--- KNIT example-embeddings-01.kt -->

要使用 Ollama 嵌入模型，请确保满足以下先决条件：

-   安装并运行 [Ollama](https://ollama.com/download)
-   使用以下命令将嵌入模型下载到您的本地机器：
    ```bash
    ollama pull <ollama-model-id>
    ```
    将 `<ollama-model-id>` 替换为特定模型的 Ollama 标识符。有关可用嵌入模型及其标识符的更多信息，请参见 [Ollama 模型概述](#ollama-models-overview)。

### Ollama 模型概述

下表提供了可用 Ollama 嵌入模型的概述。

| 模型 ID           | Ollama ID                     | 参数   | 维度   | 上下文长度 | 性能                                                            | 权衡                                                             |
| :---------------- | :---------------------------- | :----- | :----- | :--------- | :-------------------------------------------------------------- | :--------------------------------------------------------------- |
| NOMIC_EMBED_TEXT  | nomic-embed-text              | 137M   | 768    | 8192       | 高质量嵌入，适用于语义搜索和文本相似度任务                      | 在质量和效率之间取得平衡                                         |
| ALL_MINILM        | all-minilm                    | 33M    | 384    | 512        | 快速推断，对通用文本嵌入具有良好质量                            | 模型尺寸更小，上下文长度缩短，但效率极高                         |
| MULTILINGUAL_E5   | zylonai/multilingual-e5-large | 300M   | 768    | 512        | 在 100 多种语言中表现出色                                       | 模型尺寸更大，但提供出色的多语言能力                             |
| BGE_LARGE         | bge-large                     | 335M   | 1024   | 512        | 非常适用于英文文本检索和语义搜索                                | 模型尺寸更大，但提供高质量嵌入                                   |
| MXBAI_EMBED_LARGE | mxbai-embed-large             | -      | -      | -          | 文本数据的高维嵌入                                              | 专为创建高维嵌入而设计                                           |

有关这些模型的更多信息，请参见 Ollama 的 [Embedding Models](https://ollama.com/blog/embedding-models) 博客文章。

### 选择模型

以下是根据您的要求选择 Ollama 嵌入模型的一些一般建议：

-   对于通用文本嵌入，请使用 `NOMIC_EMBED_TEXT`。
-   对于多语言支持，请使用 `MULTILINGUAL_E5`。
-   对于最高质量（以牺牲性能为代价），请使用 `BGE_LARGE`。
-   对于最高效率（以牺牲部分质量为代价），请使用 `ALL_MINILM`。
-   对于高维嵌入，请使用 `MXBAI_EMBED_LARGE`。

## OpenAI 嵌入

要使用 OpenAI 嵌入模型创建嵌入，请使用 `OpenAILLMClient` 实例的 `embed` 方法，如下例所示。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
suspend fun openAIEmbed(text: String) {
    // Get the OpenAI API token from the OPENAI_KEY environment variable
    val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY is not set")
    // Create an OpenAILLMClient instance
    val client = OpenAILLMClient(token)
    // Create an embedder
    val embedder = LLMEmbedder(client, OpenAIModels.Embeddings.TextEmbeddingAda002)
    // Create embeddings
    val embedding = embedder.embed(text)
    // Print embeddings to the output
    println(embedding)
}
```
<!--- KNIT example-embeddings-02.kt -->

## AWS Bedrock 嵌入

要使用 AWS Bedrock 嵌入模型创建嵌入，请使用 `BedrockLLMClient` 实例及其选择的模型（如以下示例所示）的 `embed` 方法。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockModels
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
-->
```kotlin
suspend fun bedrockEmbed(text: String) {
    // Get AWS credentials from environment/configuration
    val awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID") ?: error("AWS_ACCESS_KEY_ID not set")
    val awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY") ?: error("AWS_SECRET_ACCESS_KEY not set")
    // (Optional) AWS_SESSION_TOKEN for temporary credentials
    val awsSessionToken = System.getenv("AWS_SESSION_TOKEN")
    // Create a BedrockLLMClient instance
    val client = BedrockLLMClient(
        identityProvider = StaticCredentialsProvider {
            this.accessKeyId = awsAccessKeyId
            this.secretAccessKey = awsSecretAccessKey
            awsSessionToken?.let { this.sessionToken = it }
        },
        settings = BedrockClientSettings()
    )
    // Create an embedder
    val embedder = LLMEmbedder(client, BedrockModels.Embeddings.AmazonTitanEmbedText)
    // Create embeddings
    val embedding = embedder.embed(text)
    // Print embeddings to the output
    println(embedding)
}
```
<!--- KNIT example-embeddings-03.kt -->

### 支持的 AWS Bedrock 嵌入模型

| 供应商 | 模型名称                   | 模型 ID                        | 输入 | 输出    | 维度   | 上下文长度 | 备注                                                                                                 |
| :----- | :------------------------- | :----------------------------- | :--- | :------ | :----- | :--------- | :--------------------------------------------------------------------------------------------------- |
| Amazon | Titan Embeddings G1 - Text | `amazon.titan-embed-text-v1`   | Text | Embedding | 1,536  | 8192       | 25+ 种语言，针对检索、语义相似度、聚类进行优化；长文档可分段进行搜索。                             |
| Amazon | Titan Text Embeddings V2   | `amazon.titan-embed-text-v2:0` | Text | Embedding | 1,024  | 8192       | 高准确度、灵活的维度、多语言（100+）；较小维度可节省存储空间，输出归一化。                           |
| Cohere | Cohere Embed English v3    | `cohere.embed-english-v3`      | Text | Embedding | 1,024  | 8192       | 针对搜索、检索和理解文本细微差别的最先进英文文本嵌入。                                               |
| Cohere | Cohere Embed Multilingual v3 | `cohere.embed-multilingual-v3` | Text | Embedding | 1,024  | 8192       | 多语言嵌入，针对跨语言搜索和语义理解的最先进技术。                                                   |

> 关于最新的模型支持，请参考 [AWS Bedrock 支持的模型文档](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)。

## 示例

以下示例展示了如何使用嵌入来比较代码与文本或其他代码片段。

### 代码到文本比较

比较代码片段与自然语言描述，以查找语义匹配项：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToText(embedder: Embedder) { // Embedder type
    // Code snippet
    val code = """
        fun factorial(n: Int): Int {
            return if (n <= 1) 1 else n * factorial(n - 1)
        }
    """.trimIndent()

    // Text descriptions
    val description1 = "A recursive function that calculates the factorial of a number"
    val description2 = "A function that sorts an array of integers"

    // Generate embeddings
    val codeEmbedding = embedder.embed(code)
    val desc1Embedding = embedder.embed(description1)
    val desc2Embedding = embedder.embed(description2)

    // Calculate differences (lower value means more similar)
    val diff1 = embedder.diff(codeEmbedding, desc1Embedding)
    val diff2 = embedder.diff(codeEmbedding, desc2Embedding)

    println("Difference between code and description 1: $diff1")
    println("Difference between code and description 2: $diff2")

    // The code should be more similar to description1 than description2
    if (diff1 < diff2) {
        println("The code is more similar to: '$description1'")
    } else {
        println("The code is more similar to: '$description2'")
    }
}
```
<!--- KNIT example-embeddings-04.kt -->

### 代码到代码比较

比较代码片段以查找语义相似性，无论语法差异如何：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToCode(embedder: Embedder) { // Embedder type
    // Two implementations of the same algorithm in different languages
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

    // Generate embeddings
    val kotlinEmbedding = embedder.embed(kotlinCode)
    val pythonEmbedding = embedder.embed(pythonCode)
    val javaEmbedding = embedder.embed(javaCode)

    // Calculate differences
    val diffKotlinPython = embedder.diff(kotlinEmbedding, pythonEmbedding)
    val diffKotlinJava = embedder.diff(kotlinEmbedding, javaEmbedding)

    println("Difference between Kotlin and Python implementations: $diffKotlinPython")
    println("Difference between Kotlin and Java implementations: $diffKotlinJava")

    // The Kotlin and Python implementations should be more similar
    if (diffKotlinPython < diffKotlinJava) {
        println("The Kotlin code is more similar to the Python code")
    } else {
        println("The Kotlin code is more similar to the Java code")
    }
}
```
<!--- KNIT example-embeddings-05.kt -->

## API 文档

有关与嵌入相关的完整 API 参考，请参见以下模块的参考文档：

-   [embeddings-base](https://api.koog.ai/embeddings/embeddings-base/ai.koog.embeddings.base/index.html)：提供核心接口和数据结构，用于表示和比较文本与代码嵌入。
-   [embeddings-llm](https://api.koog.ai/embeddings/embeddings-llm/index.html)：包括用于处理本地嵌入模型的实现。