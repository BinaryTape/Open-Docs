# 嵌入

`embeddings` 模組提供了產生和比較文字和程式碼嵌入的功能。嵌入是捕捉語義意義的向量表示，可實現高效的相似性比較。

## 概述

此模組包含兩個主要元件：

1.  **embeddings-base**：嵌入的核心介面和資料結構。
2.  **embeddings-llm**：使用 Ollama 進行本地嵌入生成的實作。

## 開始使用

以下章節包含如何以以下方式使用嵌入的基本範例：

-   透過 Ollama 使用本地嵌入模型
-   使用 OpenAI 嵌入模型

### 本地嵌入

若要搭配本地模型使用嵌入功能，您需要在系統上安裝並執行 Ollama。有關安裝和執行說明，請參閱 [官方 Ollama GitHub 儲存庫](https://github.com/ollama/ollama)。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        // 建立一個 OllamaClient 實例
        val client = OllamaClient()
        // 建立一個嵌入器
        val embedder = LLMEmbedder(client, OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
        // 建立嵌入
        val embedding = embedder.embed("This is the text to embed")
        // 將嵌入輸出到控制台
        println(embedding)
    }
}
```
<!--- KNIT example-embeddings-01.kt -->

若要使用 Ollama 嵌入模型，請確保滿足以下前提條件：

-   已安裝並執行 [Ollama](https://ollama.com/download)
-   使用以下命令將嵌入模型下載到您的本地機器：
    ```bash
    ollama pull <ollama-model-id>
    ```
    將 `<ollama-model-id>` 替換為特定模型的 Ollama 識別碼。有關可用的嵌入模型及其識別碼的更多資訊，請參閱 [Ollama 模型概述](#ollama-models-overview)。

### Ollama 模型概述

以下表格提供了可用 Ollama 嵌入模型的概述。

| 模型 ID           | Ollama ID         | 參數     | 維度     | 上下文長度   | 效能                                                              | 取捨                                                              |
|-------------------|-------------------|------------|------------|----------------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| NOMIC_EMBED_TEXT  | nomic-embed-text  | 137M       | 768        | 8192           | 適用於語義搜尋和文字相似性任務的高品質嵌入                        | 在品質和效率之間取得平衡                                           |
| ALL_MINILM        | all-minilm        | 33M        | 384        | 512            | 針對一般文字嵌入提供快速推論與良好品質                            | 模型較小，上下文長度較短，但效率極高                               |
| MULTILINGUAL_E5   | zylonai/multilingual-e5-large   | 300M       | 768        | 512            | 跨 100 多種語言提供強大性能                                         | 模型較大，但提供出色的多語言功能                                   |
| BGE_LARGE         | bge-large         | 335M       | 1024       | 512            | 非常適用於英文文字檢索和語義搜尋                                  | 模型較大，但提供高品質嵌入                                         |
| MXBAI_EMBED_LARGE | mxbai-embed-large | -          | -          | -              | 文字資料的高維度嵌入                                              | 專為建立高維度嵌入而設計                                           |

有關這些模型的更多資訊，請參閱 Ollama 的 [嵌入模型](https://ollama.com/blog/embedding-models) 部落格文章。

### 選擇模型

以下是一些關於根據您的要求選擇 Ollama 嵌入模型的一般提示：

-   針對一般文字嵌入，請使用 `NOMIC_EMBED_TEXT`。
-   針對多語言支援，請使用 `MULTILINGUAL_E5`。
-   針對最高品質（以性能為代價），請使用 `BGE_LARGE`。
-   針對最高效率（以犧牲部分品質為代價），請使用 `ALL_MINILM`。
-   針對高維度嵌入，請使用 `MXBAI_EMBED_LARGE`。

## OpenAI 嵌入

若要使用 OpenAI 嵌入模型建立嵌入，請使用 `OpenAILLMClient` 實例的 `embed` 方法，如下方範例所示。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
suspend fun openAIEmbed(text: String) {
    // 從 OPENAI_KEY 環境變數取得 OpenAI API 權杖
    val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY is not set")
    // 建立一個 OpenAILLMClient 實例
    val client = OpenAILLMClient(token)
    // 建立一個嵌入器
    val embedder = LLMEmbedder(client, OpenAIModels.Embeddings.TextEmbeddingAda002)
    // 建立嵌入
    val embedding = embedder.embed(text)
    // 將嵌入輸出到控制台
    println(embedding)
}
```
<!--- KNIT example-embeddings-02.kt -->

## AWS Bedrock 嵌入

若要使用 AWS Bedrock 嵌入模型建立嵌入，請使用 `BedrockLLMClient` 實例的 `embed` 方法和您所選的模型。範例：

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockModels
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
-->
```kotlin
suspend fun bedrockEmbed(text: String) {
    // 從環境/設定中取得 AWS 憑證
    val awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID") ?: error("AWS_ACCESS_KEY_ID not set")
    val awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY") ?: error("AWS_SECRET_ACCESS_KEY not set")
    // (可選) AWS_SESSION_TOKEN 用於暫時憑證
    val awsSessionToken = System.getenv("AWS_SESSION_TOKEN")
    // 建立一個 BedrockLLMClient 實例
    val client = BedrockLLMClient(
        identityProvider = StaticCredentialsProvider {
            this.accessKeyId = awsAccessKeyId
            this.secretAccessKey = awsSecretAccessKey
            awsSessionToken?.let { this.sessionToken = it }
        },
        settings = BedrockClientSettings()
    )
    // 建立一個嵌入器
    val embedder = LLMEmbedder(client, BedrockModels.Embeddings.AmazonTitanEmbedText)
    // 建立嵌入
    val embedding = embedder.embed(text)
    // 將嵌入輸出到控制台
    println(embedding)
}
```
<!--- KNIT example-embeddings-03.kt -->

### 支援的 AWS Bedrock 嵌入模型

| 提供者 | 模型名稱                   | 模型 ID                        | 輸入 | 輸出    | 維度     | 上下文長度   | 備註                                                                                                 |
|----------|------------------------------|--------------------------------|-------|-----------|------------|----------------|-------------------------------------------------------------------------------------------------------|
| Amazon   | Titan Embeddings G1 - Text   | `amazon.titan-embed-text-v1`   | 文字  | 嵌入      | 1,536      | 8192           | 支援 25 種以上語言，針對檢索、語義相似性和群集進行優化；將長文件分段以進行搜尋。|
| Amazon   | Titan Text Embeddings V2     | `amazon.titan-embed-text-v2:0` | 文字  | 嵌入      | 1,024      | 8192           | 高準確度、靈活的維度、多語言 (100+)；較小的維度可節省儲存空間，正規化輸出。|
| Cohere   | Cohere Embed English v3      | `cohere.embed-english-v3`      | 文字  | 嵌入      | 1,024      | 8192           | 最先進的英文文字嵌入，用於搜尋、檢索和理解文字細微差別。                   |
| Cohere   | Cohere Embed Multilingual v3 | `cohere.embed-multilingual-v3` | 文字  | 嵌入      | 1,024      | 8192           | 多語言嵌入，最先進的搜尋和跨語言語義理解功能。                 |

> 有關最新模型支援資訊，請參閱 [AWS Bedrock 支援模型文件](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)。

## 範例

以下範例顯示如何使用嵌入來比較程式碼與文字或其他程式碼片段。

### 程式碼到文字比較

比較程式碼片段與自然語言描述，以尋找語義匹配：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToText(embedder: Embedder) { // Embedder type
    // 程式碼片段
    val code = """
        fun factorial(n: Int): Int {
            return if (n <= 1) 1 else n * factorial(n - 1)
        }
    """.trimIndent()

    // 文字描述
    val description1 = "A recursive function that calculates the factorial of a number"
    val description2 = "A function that sorts an array of integers"

    // 生成嵌入
    val codeEmbedding = embedder.embed(code)
    val desc1Embedding = embedder.embed(description1)
    val desc2Embedding = embedder.embed(description2)

    // 計算差異（值越低表示越相似）
    val diff1 = embedder.diff(codeEmbedding, desc1Embedding)
    val diff2 = embedder.diff(codeEmbedding, desc2Embedding)

    println("程式碼與描述 1 之間的差異：$diff1")
    println("程式碼與描述 2 之間的差異：$diff2")

    // 程式碼應與 description1 比 description2 更相似
    if (diff1 < diff2) {
        println("程式碼與：'$description1' 更相似")
    } else {
        println("程式碼與：'$description2' 更相似")
    }
}
```
<!--- KNIT example-embeddings-04.kt -->

### 程式碼到程式碼比較

比較程式碼片段以尋找語義相似性，不論語法差異：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToCode(embedder: Embedder) { // Embedder type
    // 相同演算法在不同語言中的兩種實作
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

    // 計算差異
    val diffKotlinPython = embedder.diff(kotlinEmbedding, pythonEmbedding)
    val diffKotlinJava = embedder.diff(kotlinEmbedding, javaEmbedding)

    println("Kotlin 和 Python 實作之間的差異：$diffKotlinPython")
    println("Kotlin 和 Java 實作之間的差異：$diffKotlinJava")

    // Kotlin 和 Python 的實作應更相似
    if (diffKotlinPython < diffKotlinJava) {
        println("Kotlin 程式碼與 Python 程式碼更相似")
    } else {
        println("Kotlin 程式碼與 Java 程式碼更相似")
    }
}
```
<!--- KNIT example-embeddings-05.kt -->

## API 文件

有關嵌入相關的完整 API 參考，請參閱以下模組的參考文件：

-   [embeddings-base](https://api.koog.ai/embeddings/embeddings-base/ai.koog.embeddings.base/index.html)：提供用於表示和比較文字和程式碼嵌入的核心介面和資料結構。
-   [embeddings-llm](https://api.koog.ai/embeddings/embeddings-llm/index.html)：包含用於處理本地嵌入模型的實作。