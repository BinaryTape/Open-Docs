# 임베딩 (Embeddings)

`embeddings` 모듈은 텍스트와 코드의 임베딩을 생성하고 비교하는 기능을 제공합니다. 임베딩은 의미론적 의미를 포착하는 벡터 표현(vector representations)으로, 효율적인 유사도 비교를 가능하게 합니다.

## 개요 (Overview)

이 모듈은 두 가지 주요 구성 요소로 이루어져 있습니다:

1. **embeddings-base**: 임베딩을 위한 핵심 인터페이스 및 데이터 구조.
2. **embeddings-llm**: 로컬 임베딩 생성을 위해 Ollama를 사용하는 구현체.

## 시작하기 (Getting started)

다음 섹션에는 다음과 같은 방식으로 임베딩을 사용하는 기본적인 예제가 포함되어 있습니다:

- Ollama를 통한 로컬 임베딩 모델 사용
- OpenAI 임베딩 모델 사용

### 로컬 임베딩 (Local embeddings)

로컬 모델과 함께 임베딩 기능을 사용하려면 시스템에 Ollama가 설치되어 실행 중이어야 합니다.
설치 및 실행 지침은 [공식 Ollama GitHub 저장소](https://github.com/ollama/ollama)를 참조하세요.

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        // OllamaClient 인스턴스 생성
        val client = OllamaClient()
        // 임베더(embedder) 생성
        val embedder = LLMEmbedder(client, OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
        // 임베딩 생성
        val embedding = embedder.embed("This is the text to embed")
        // 출력창에 임베딩 출력
        println(embedding)
    }
}
```
<!--- KNIT example-embeddings-01.kt -->

Ollama 임베딩 모델을 사용하려면 다음 전제 조건을 확인하세요:

- [Ollama](https://ollama.com/download)가 설치되어 실행 중이어야 함
- 다음 명령어를 사용하여 로컬 머신에 임베딩 모델 다운로드:
    ```bash
    ollama pull <ollama-model-id>
    ```
    `<ollama-model-id>`를 특정 모델의 Ollama 식별자로 바꿉니다. 사용 가능한 임베딩 모델 및 식별자에 대한 자세한 내용은 [Ollama 모델 개요(#ollama-models-overview)]를 참조하세요.

### Ollama 모델 개요 (Ollama models overview)

다음 표는 사용 가능한 Ollama 임베딩 모델에 대한 개요를 제공합니다.

| 모델 ID (Model ID) | Ollama ID | 파라미터 | 차원 | 컨텍스트 길이 | 성능 | 트레이드오프 (Tradeoffs) |
|-------------------|-------------------|------------|------------|----------------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| NOMIC_EMBED_TEXT  | nomic-embed-text  | 137M       | 768        | 8192           | 시맨틱 검색 및 텍스트 유사도 작업을 위한 고품질 임베딩 | 품질과 효율성 사이의 균형 |
| ALL_MINILM        | all-minilm        | 33M        | 384        | 512            | 일반적인 텍스트 임베딩에 적합한 품질과 빠른 추론 | 모델 크기가 작고 컨텍스트 길이가 짧지만 매우 효율적임 |
| MULTILINGUAL_E5   | zylonai/multilingual-e5-large   | 300M       | 768        | 512            | 100개 이상의 언어에서 강력한 성능 발휘 | 모델 크기가 더 크지만 뛰어난 다국어 기능 제공 |
| BGE_LARGE         | bge-large         | 335M       | 1024       | 512            | 영어 텍스트 검색 및 시맨틱 검색에 탁월함 | 모델 크기가 더 크지만 고품질 임베딩 제공 |
| MXBAI_EMBED_LARGE | mxbai-embed-large | -          | -          | -              | 텍스트 데이터의 고차원 임베딩 생성 | 고차원 임베딩 생성을 위해 설계됨 |

이 모델들에 대한 자세한 정보는 Ollama의 [Embedding Models](https://ollama.com/blog/embedding-models) 블로그 포스트를 참조하세요.

### 모델 선택하기 (Choosing a model)

요구 사항에 따라 어떤 Ollama 임베딩 모델을 선택할지에 대한 일반적인 팁은 다음과 같습니다:

- 일반적인 텍스트 임베딩의 경우, `NOMIC_EMBED_TEXT`를 사용하세요.
- 다국어 지원이 필요한 경우, `MULTILINGUAL_E5`를 사용하세요.
- (성능을 희생하더라도) 품질을 극대화하려면, `BGE_LARGE`를 사용하세요.
- (품질을 일부 희생하더라도) 효율성을 극대화하려면, `ALL_MINILM`을 사용하세요.
- 고차원 임베딩이 필요한 경우, `MXBAI_EMBED_LARGE`를 사용하세요.

## OpenAI 임베딩 (OpenAI embeddings)

OpenAI 임베딩 모델을 사용하여 임베딩을 생성하려면, 아래 예제에 표시된 대로 `OpenAILLMClient` 인스턴스의 `embed` 메서드를 사용하세요.

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
suspend fun openAIEmbed(text: String) {
    // OPENAI_KEY 환경 변수에서 OpenAI API 토큰 가져오기
    val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY is not set")
    // OpenAILLMClient 인스턴스 생성
    val client = OpenAILLMClient(token)
    // 임베더(embedder) 생성
    val embedder = LLMEmbedder(client, OpenAIModels.Embeddings.TextEmbeddingAda002)
    // 임베딩 생성
    val embedding = embedder.embed(text)
    // 출력창에 임베딩 출력
    println(embedding)
}
```
<!--- KNIT example-embeddings-02.kt -->

## AWS Bedrock 임베딩 (AWS Bedrock embeddings)

AWS Bedrock 임베딩 모델을 사용하여 임베딩을 생성하려면, `BedrockLLMClient` 인스턴스의 `embed` 메서드와 선택한 모델을 사용하세요. 예제:

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockModels
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider
-->
```kotlin
suspend fun bedrockEmbed(text: String) {
    // 환경 변수/구성에서 AWS 자격 증명 가져오기
    val awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID") ?: error("AWS_ACCESS_KEY_ID not set")
    val awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY") ?: error("AWS_SECRET_ACCESS_KEY not set")
    // (선택 사항) 임시 자격 증명을 위한 AWS_SESSION_TOKEN
    val awsSessionToken = System.getenv("AWS_SESSION_TOKEN")
    // BedrockLLMClient 인스턴스 생성
    val client = BedrockLLMClient(
        identityProvider = StaticCredentialsProvider {
            this.accessKeyId = awsAccessKeyId
            this.secretAccessKey = awsSecretAccessKey
            awsSessionToken?.let { this.sessionToken = it }
        },
        settings = BedrockClientSettings()
    )
    // 임베더(embedder) 생성
    val embedder = LLMEmbedder(client, BedrockModels.Embeddings.AmazonTitanEmbedText)
    // 임베딩 생성
    val embedding = embedder.embed(text)
    // 출력창에 임베딩 출력
    println(embedding)
}
```
<!--- KNIT example-embeddings-03.kt -->

### 지원되는 AWS Bedrock 임베딩 모델 (Supported AWS Bedrock embedding models)

| 제공업체 | 모델 이름 | 모델 ID | 입력 | 출력 | 차원 | 컨텍스트 길이 | 비고 |
|----------|------------------------------|--------------------------------|-------|-----------|------------|----------------|-------------------------------------------------------------------------------------------------------|
| Amazon   | Titan Embeddings G1 - Text   | `amazon.titan-embed-text-v1`   | 텍스트 | 임베딩 | 1,536      | 8192           | 25개 이상의 언어 지원, 검색, 의미론적 유사성, 클러스터링에 최적화됨. 검색을 위해 긴 문서를 분할함. |
| Amazon   | Titan Text Embeddings V2     | `amazon.titan-embed-text-v2:0` | 텍스트 | 임베딩 | 1,024      | 8192           | 높은 정확도, 유연한 차원, 다국어(100개 이상) 지원. 작은 차원으로 저장 공간 절약, 정규화된 출력. |
| Cohere   | Cohere Embed English v3      | `cohere.embed-english-v3`      | 텍스트 | 임베딩 | 1,024      | 8192           | 검색, 정보 추출 및 텍스트 뉘앙스 파악을 위한 최첨단(SOTA) 영어 텍스트 임베딩. |
| Cohere   | Cohere Embed Multilingual v3 | `cohere.embed-multilingual-v3` | 텍스트 | 임베딩 | 1,024      | 8192           | 다국어 임베딩, 언어 전반에 걸친 검색 및 의미론적 이해를 위한 최첨단(SOTA) 모델. |

> 최신 모델 지원 정보는 [AWS Bedrock 지원 모델 문서](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)를 참조하세요.

## 예제 (Examples)

다음 예제는 임베딩을 사용하여 코드를 텍스트 또는 다른 코드 스니펫과 비교하는 방법을 보여줍니다.

### 코드와 텍스트 비교 (Code-to-text comparison)

코드 스니펫을 자연어 설명과 비교하여 의미론적 일치를 찾습니다:

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToText(embedder: Embedder) { // Embedder 타입
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

    // 차이 계산 (값이 낮을수록 더 유사함)
    val diff1 = embedder.diff(codeEmbedding, desc1Embedding)
    val diff2 = embedder.diff(codeEmbedding, desc2Embedding)

    println("Difference between code and description 1: $diff1")
    println("Difference between code and description 2: $diff2")

    // 코드는 description2보다 description1과 더 유사해야 함
    if (diff1 < diff2) {
        println("The code is more similar to: '$description1'")
    } else {
        println("The code is more similar to: '$description2'")
    }
}
```
<!--- KNIT example-embeddings-04.kt -->

### 코드 간 비교 (Code-to-code comparison)

구문(syntax) 차이에 관계없이 의미론적 유사성을 찾기 위해 코드 스니펫을 비교합니다:

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToCode(embedder: Embedder) { // Embedder 타입
    // 서로 다른 언어로 구현된 동일한 알고리즘의 두 구현체
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

    // Kotlin과 Python 구현이 더 유사해야 함
    if (diffKotlinPython < diffKotlinJava) {
        println("The Kotlin code is more similar to the Python code")
    } else {
        println("The Kotlin code is more similar to the Java code")
    }
}
```
<!--- KNIT example-embeddings-05.kt -->

## API 문서 (API documentation)

임베딩과 관련된 전체 API 참조는 다음 모듈의 참조 문서를 확인하세요:

- [embeddings-base](api:embeddings-base::ai.koog.embeddings.base): 텍스트 및 코드 임베딩을 표현하고 비교하기 위한 핵심 인터페이스 및 데이터 구조를 제공합니다.
- [embeddings-llm](api:embeddings-llm::): 로컬 임베딩 모델 작업을 위한 구현체를 포함합니다.