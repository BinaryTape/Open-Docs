# 임베딩

`embeddings` 모듈은 텍스트 및 코드의 임베딩을 생성하고 비교하는 기능을 제공합니다. 임베딩은 의미적 의미를 포착하는 벡터 표현으로, 효율적인 유사성 비교를 가능하게 합니다.

## 개요

이 모듈은 두 가지 주요 구성 요소로 구성됩니다:

1.  **embeddings-base**: 임베딩을 위한 핵심 인터페이스 및 데이터 구조.
2.  **embeddings-llm**: 로컬 임베딩 생성을 위한 Ollama를 사용한 구현.

## 시작하기

다음 섹션에는 임베딩을 사용하는 방법에 대한 기본 예시가 포함되어 있습니다:

-   Ollama를 통한 로컬 임베딩 모델 사용
-   OpenAI 임베딩 모델 사용

### 로컬 임베딩

로컬 모델로 임베딩 기능을 사용하려면 시스템에 Ollama가 설치되어 실행 중이어야 합니다.
설치 및 실행 지침은 [Ollama 공식 GitHub 저장소](https://github.com/ollama/ollama)를 참조하세요.

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

Ollama 임베딩 모델을 사용하려면 다음 전제 조건을 확인하세요:

-   [Ollama](https://ollama.com/download)가 설치되어 실행 중이어야 합니다.
-   다음 명령어를 사용하여 임베딩 모델을 로컬 머신에 다운로드하세요:
    ```bash
    ollama pull <ollama-model-id>
    ```
    `<ollama-model-id>`를 특정 모델의 Ollama 식별자로 교체하세요. 사용 가능한
임베딩 모델 및 해당 식별자에 대한 자세한 내용은 [Ollama 모델 개요](#ollama-models-overview)를 참조하세요.

### Ollama 모델 개요

다음 표는 사용 가능한 Ollama 임베딩 모델에 대한 개요를 제공합니다.

| 모델 ID          | Ollama ID         | 파라미터 | 차원 | 컨텍스트 길이 | 성능                                                           | 장단점                                                          |
|-------------------|-------------------|------------|------------|----------------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| NOMIC_EMBED_TEXT  | nomic-embed-text  | 137M       | 768        | 8192           | 의미 검색 및 텍스트 유사성 작업에 대한 고품질 임베딩                | 품질과 효율성 사이의 균형                                          |
| ALL_MINILM        | all-minilm        | 33M        | 384        | 512            | 일반 텍스트 임베딩에 대해 빠른 추론 및 양호한 품질                  | 컨텍스트 길이가 줄어든 더 작은 모델 크기이지만 매우 효율적       |
| MULTILINGUAL_E5   | zylonai/multilingual-e5-large   | 300M       | 768        | 512            | 100개 이상의 언어에서 강력한 성능                                   | 더 큰 모델 크기이지만 뛰어난 다국어 기능 제공                     |
| BGE_LARGE         | bge-large         | 335M       | 1024       | 512            | 영어 텍스트 검색 및 의미 검색에 탁월                                | 더 큰 모델 크기이지만 고품질 임베딩 제공                         |
| MXBAI_EMBED_LARGE | mxbai-embed-large | -          | -          | -              | 텍스트 데이터의 고차원 임베딩                                       | 고차원 임베딩 생성을 위해 설계됨                                  |

이러한 모델에 대한 자세한 내용은 Ollama의 [임베딩 모델](https://ollama.com/blog/embedding-models) 블로그 게시물을 참조하세요.

### 모델 선택

다음은 요구 사항에 따라 선택할 Ollama 임베딩 모델에 대한 일반적인 팁입니다:

-   일반 텍스트 임베딩에는 `NOMIC_EMBED_TEXT`를 사용하세요.
-   다국어 지원에는 `MULTILINGUAL_E5`를 사용하세요.
-   최대 품질(성능 저하 감수)에는 `BGE_LARGE`를 사용하세요.
-   최대 효율성(일부 품질 저하 감수)에는 `ALL_MINILM`을 사용하세요.
-   고차원 임베딩에는 `MXBAI_EMBED_LARGE`를 사용하세요.

## OpenAI 임베딩

OpenAI 임베딩 모델을 사용하여 임베딩을 생성하려면 아래 예시와 같이 `OpenAILLMClient` 인스턴스의 `embed` 메서드를 사용하세요.

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

## 예시

다음 예시들은 임베딩을 사용하여 코드를 텍스트 또는 다른 코드 스니펫과 비교하는 방법을 보여줍니다.

### 코드-텍스트 비교

코드 스니펫을 자연어 설명과 비교하여 의미론적 일치를 찾으세요:

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToText(embedder: Embedder) { // Embedder type
    // 코드 스니펫
    val code = """
        fun factorial(n: Int): Int {
            return if (n <= 1) 1 else n * factorial(n - 1)
        }
    """.trimIndent()

    // 텍스트 설명
    val description1 = "A recursive function that calculates the factorial of a number"
    val description2 = "A function that sorts an array of integers"

    // 임베딩 생성
    val codeEmbedding = embedder.embed(code)
    val desc1Embedding = embedder.embed(description1)
    val desc2Embedding = embedder.embed(description2)

    // 차이 계산 (값이 낮을수록 유사성 높음)
    val diff1 = embedder.diff(codeEmbedding, desc1Embedding)
    val diff2 = embedder.diff(codeEmbedding, desc2Embedding)

    println("Difference between code and description 1: $diff1")
    println("Difference between code and description 2: $diff2")

    // 코드는 description2보다 description1과 더 유사해야 합니다.
    if (diff1 < diff2) {
        println("The code is more similar to: '$description1'")
    } else {
        println("The code is more similar to: '$description2'")
    }
}
```
<!--- KNIT example-embeddings-03.kt -->

### 코드-코드 비교

구문 차이에 관계없이 코드 스니펫을 비교하여 의미론적 유사성을 찾으세요:

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToCode(embedder: Embedder) { // Embedder type
    // 다른 언어로 구현된 동일한 알고리즘의 두 가지 구현
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

    // 임베딩 생성
    val kotlinEmbedding = embedder.embed(kotlinCode)
    val pythonEmbedding = embedder.embed(pythonCode)
    val javaEmbedding = embedder.embed(javaCode)

    // 차이 계산
    val diffKotlinPython = embedder.diff(kotlinEmbedding, pythonEmbedding)
    val diffKotlinJava = embedder.diff(kotlinEmbedding, javaEmbedding)

    println("Difference between Kotlin and Python implementations: $diffKotlinPython")
    println("Difference between Kotlin and Java implementations: $diffKotlinJava")

    // Kotlin 및 Python 구현이 더 유사해야 합니다.
    if (diffKotlinPython < diffKotlinJava) {
        println("The Kotlin code is more similar to the Python code")
    } else {
        println("The Kotlin code is more similar to the Java code")
    }
}
```
<!--- KNIT example-embeddings-04.kt -->

## API 문서

임베딩과 관련된 전체 API 참조는 다음 모듈의 참조 문서를 확인하세요:

-   [embeddings-base](https://api.koog.ai/embeddings/embeddings-base/ai.koog.embeddings.base/index.html): 텍스트 및 코드 임베딩을 표현하고 비교하기 위한 핵심 인터페이스 및 데이터 구조를 제공합니다.
-   [embeddings-llm](https://api.koog.ai/embeddings/embeddings-llm/index.html): 로컬 임베딩 모델 작업용 구현을 포함합니다.