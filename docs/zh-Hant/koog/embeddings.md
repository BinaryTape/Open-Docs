# Embeddings

`embeddings` 模組提供了用於產生和比較文字與程式碼 Embeddings 的功能性。Embeddings 是捕捉語義的向量表示，可實現高效的相似度比較。

## 總覽

此模組由兩個主要元件組成：

1. **embeddings-base**：Embeddings 的核心介面與資料結構。
2. **embeddings-llm**：使用 Ollama 進行本機 Embedding 產生的實作。

## 快速入門

以下章節包含如何透過以下方式使用 Embeddings 的基本範例：

- 透過 Ollama 使用本機 Embedding 模型
- 使用 OpenAI Embedding 模型

### 本機 Embeddings

若要搭配本機模型使用 Embedding 功能性，您的系統需要安裝並執行 Ollama。
有關安裝與執行指示，請參閱 [Ollama 官方 GitHub 存儲庫](https://github.com/ollama/ollama)。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        // 建立一個 OllamaClient 執行個體
        val client = OllamaClient()
        // 建立一個 embedder
        val embedder = LLMEmbedder(client, OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
        // 建立 embeddings
        val embedding = embedder.embed("This is the text to embed")
        // 將 embeddings 印出到輸出
        println(embedding)
    }
}
```
<!--- KNIT example-embeddings-01.kt -->

若要使用 Ollama Embedding 模型，請確保具備以下先決條件：

- 已安裝並執行 [Ollama](https://ollama.com/download)
- 使用以下指令將 Embedding 模型下載到您的本機電腦：
    ```bash
    ollama pull <ollama-model-id>
    ```
    將 `<ollama-model-id>` 替換為特定模型的 Ollama 識別碼。有關可用 Embedding 模型及其識別碼的更多資訊，請參閱 [Ollama 模型總覽](#ollama-models-overview)。

### Ollama 模型總覽

下表提供了可用 Ollama Embedding 模型的總覽。

| 模型 ID | Ollama ID | 參數 | 維度 | 上下文長度 | 效能 | 權衡 |
|-------------------|-------------------|------------|------------|----------------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| NOMIC_EMBED_TEXT | nomic-embed-text | 137M | 768 | 8192 | 用於語義搜尋和文字相似度任務的高品質 Embeddings | 品質與效率之間的平衡 |
| ALL_MINILM | all-minilm | 33M | 384 | 512 | 推論速度快，對一般文字 Embeddings 具有良好的品質 | 較小的模型尺寸且縮減了上下文長度，但非常高效 |
| MULTILINGUAL_E5 | zylonai/multilingual-e5-large | 300M | 768 | 512 | 在 100 多種語言中表現強勁 | 模型尺寸較大，但提供卓越的多語言能力 |
| BGE_LARGE | bge-large | 335M | 1024 | 512 | 非常適合英文文字檢索和語義搜尋 | 模型尺寸較大，但提供高品質的 Embeddings |
| MXBAI_EMBED_LARGE | mxbai-embed-large | - | - | - | 文字資料的高維度 Embeddings | 專為建立高維度 Embeddings 而設計 |

有關這些模型的更多資訊，請參閱 Ollama 的 [Embedding Models](https://ollama.com/blog/embedding-models) 部落格文章。

### 選擇模型

根據您的需求，以下是選擇 Ollama Embedding 模型的一些一般建議：

- 對於一般文字 Embeddings，請使用 `NOMIC_EMBED_TEXT`。
- 對於多語言支援，請使用 `MULTILINGUAL_E5`。
- 追求最高品質（以效能為代價），請使用 `BGE_LARGE`。
- 追求最高效率（以部分品質為代價），請使用 `ALL_MINILM`。
- 對於高維度 Embeddings，請使用 `MXBAI_EMBED_LARGE`。

## OpenAI embeddings

若要使用 OpenAI Embedding 模型建立 Embeddings，請使用 `OpenAILLMClient` 執行個體的 `embed` 方法，如下例所示。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
suspend fun openAIEmbed(text: String) {
    // 從 OPENAI_KEY 環境變數獲取 OpenAI API 權杖
    val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY is not set")
    // 建立一個 OpenAILLMClient 執行個體
    val client = OpenAILLMClient(token)
    // 建立一個 embedder
    val embedder = LLMEmbedder(client, OpenAIModels.Embeddings.TextEmbeddingAda002)
    // 建立 embeddings
    val embedding = embedder.embed(text)
    // 將 embeddings 印出到輸出
    println(embedding)
}
```
<!--- KNIT example-embeddings-02.kt -->

## AWS Bedrock embeddings

若要使用 AWS Bedrock Embedding 模型建立 Embeddings，請使用 `BedrockLLMClient` 執行個體的 `embed` 方法以及您選擇的模型。範例：

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockModels
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
-->
```kotlin
suspend fun bedrockEmbed(text: String) {
    // 從環境/配置獲取 AWS 憑據
    val awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID") ?: error("AWS_ACCESS_KEY_ID not set")
    val awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY") ?: error("AWS_SECRET_ACCESS_KEY not set")
    // (選填) 用於臨時憑據的 AWS_SESSION_TOKEN
    val awsSessionToken = System.getenv("AWS_SESSION_TOKEN")
    // 建立一個 BedrockLLMClient 執行個體
    val client = BedrockLLMClient(
        identityProvider = StaticCredentialsProvider {
            this.accessKeyId = awsAccessKeyId
            this.secretAccessKey = awsSecretAccessKey
            awsSessionToken?.let { this.sessionToken = it }
        },
        settings = BedrockClientSettings()
    )
    // 建立一個 embedder
    val embedder = LLMEmbedder(client, BedrockModels.Embeddings.AmazonTitanEmbedText)
    // 建立 embeddings
    val embedding = embedder.embed(text)
    // 將 embeddings 印出到輸出
    println(embedding)
}
```
<!--- KNIT example-embeddings-03.kt -->

### 支援的 AWS Bedrock Embedding 模型

| 供應商 | 模型名稱 | 模型 ID | 輸入 | 輸出 | 維度 | 上下文長度 | 備註 |
|----------|------------------------------|--------------------------------|-------|-----------|------------|----------------|-------------------------------------------------------------------------------------------------------|
| Amazon | Titan Embeddings G1 - Text | `amazon.titan-embed-text-v1` | 文字 | Embedding | 1,536 | 8192 | 支援 25 種以上語言，針對檢索、語義相似度、分群進行優化；搜尋時建議對長文件進行分段。 |
| Amazon | Titan Text Embeddings V2 | `amazon.titan-embed-text-v2:0` | 文字 | Embedding | 1,024 | 8192 | 高準確度、彈性維度、多語言（100+）；較小的維度可節省儲存空間，輸出已正規化。 |
| Cohere | Cohere Embed English v3 | `cohere.embed-english-v3` | 文字 | Embedding | 1,024 | 8192 | 領先的英文文字 Embeddings，用於搜尋、檢索和理解文字細微差別。 |
| Cohere | Cohere Embed Multilingual v3 | `cohere.embed-multilingual-v3` | 文字 | Embedding | 1,024 | 8192 | 多語言 Embeddings，在跨語言搜尋和語義理解方面處於領先地位。 |

> 如需最新的模型支援資訊，請參閱 [AWS Bedrock 支援的模型文件](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)。

## 範例

以下範例展示了如何使用 Embeddings 來比較程式碼與文字或其他程式碼片段。

### 程式碼與文字比較

將程式碼片段與自然語言描述進行比較，以尋找語義匹配：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToText(embedder: Embedder) { // Embedder 型別
    // 程式碼片段
    val code = """
        fun factorial(n: Int): Int {
            return if (n <= 1) 1 else n * factorial(n - 1)
        }
    """.trimIndent()

    // 文字描述
    val description1 = "A recursive function that calculates the factorial of a number"
    val description2 = "A function that sorts an array of integers"

    // 產生 embeddings
    val codeEmbedding = embedder.embed(code)
    val desc1Embedding = embedder.embed(description1)
    val desc2Embedding = embedder.embed(description2)

    // 計算差異（值越低表示越相似）
    val diff1 = embedder.diff(codeEmbedding, desc1Embedding)
    val diff2 = embedder.diff(codeEmbedding, desc2Embedding)

    println("Difference between code and description 1: $diff1")
    println("Difference between code and description 2: $diff2")

    // 此程式碼與 description1 的相似度應高於 description2
    if (diff1 < diff2) {
        println("The code is more similar to: '$description1'")
    } else {
        println("The code is more similar to: '$description2'")
    }
}
```
<!--- KNIT example-embeddings-04.kt -->

### 程式碼與程式碼比較

比較程式碼片段，以尋找語義相似度，而不受語法差異影響：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToCode(embedder: Embedder) { // Embedder 型別
    // 以不同語言實作相同演算法的兩個版本
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

    // 產生 embeddings
    val kotlinEmbedding = embedder.embed(kotlinCode)
    val pythonEmbedding = embedder.embed(pythonCode)
    val javaEmbedding = embedder.embed(javaCode)

    // 計算差異
    val diffKotlinPython = embedder.diff(kotlinEmbedding, pythonEmbedding)
    val diffKotlinJava = embedder.diff(kotlinEmbedding, javaEmbedding)

    println("Difference between Kotlin and Python implementations: $diffKotlinPython")
    println("Difference between Kotlin and Java implementations: $diffKotlinJava")

    // Kotlin 與 Python 的實作應更為相似
    if (diffKotlinPython < diffKotlinJava) {
        println("The Kotlin code is more similar to the Python code")
    } else {
        println("The Kotlin code is more similar to the Java code")
    }
}
```
<!--- KNIT example-embeddings-05.kt -->

## API 文件

有關 Embeddings 的完整 API 參考，請參閱以下模組的參考文件：

- [embeddings-base](api:embeddings-base::ai.koog.embeddings.base)：提供用於表示與比較文字與程式碼 Embeddings 的核心介面與資料結構。
- [embeddings-llm](api:embeddings-llm::)：包含搭配本機 Embedding 模型運作的實作。