# LLM 클라이언트

LLM 클라이언트는 LLM 제공업체와 직접 상호작용하도록 설계되었습니다.
각 클라이언트는 프롬프트 실행 및 응답 스트리밍을 위한 메서드를 제공하는 [`LLMClient`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients/-l-l-m-client/index.html) 인터페이스를 구현합니다.

단일 LLM 제공업체와 작업하고 고급 생명 주기 관리가 필요하지 않을 때 LLM 클라이언트를 사용할 수 있습니다.
여러 LLM 제공업체를 관리해야 하는 경우 [프롬프트 이그제큐터](prompt-executors.md)를 사용하세요.

아래 표는 사용 가능한 LLM 클라이언트와 해당 기능을 보여줍니다.

| LLM 제공업체                                        | LLMClient                                                                                                                                                                                                   | 툴<br/>호출 | 스트리밍 | 다중<br/>선택 | 임베딩 | 검토 | <div style="width:50px">모델<br/>목록</div> | <div style="width:200px">참고</div>                                                                                        |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------|----------------------|------------|------------|-------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [OpenAI](https://platform.openai.com/docs/overview) | [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)                | ✓                | ✓         | ✓                    | ✓          | ✓[^1]      | ✓                                               |                                                                                                                             |
| [Anthropic](https://www.anthropic.com/)             | [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)      | ✓                | ✓         | -                    | -          | -          | -                                               | -                                                                                                                           |
| [Google](https://ai.google.dev/)                    | [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)                  | ✓                | ✓         | ✓                    | ✓          | -          | ✓                                               | -                                                                                                                           |
| [DeepSeek](https://www.deepseek.com/)               | [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)         | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | OpenAI 호환 채팅 클라이언트.                                                                                              |
| [OpenRouter](https://openrouter.ai/)                | [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html) | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | OpenAI 호환 라우터 클라이언트.                                                                                            |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/)   | [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html)              | ✓                | ✓         | -                    | ✓          | ✓[^2]      | -                                               | 여러 모델 패밀리를 지원하는 JVM 전용 AWS SDK 클라이언트.                                                                  |
| [Mistral](https://mistral.ai/)                      | [MistralAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-mistralai-client/ai.koog.prompt.executor.clients.mistralai/-mistral-a-i-l-l-m-client/index.html)    | ✓                | ✓         | ✓                    | ✓          | ✓[^3]      | ✓                                               | OpenAI 호환 클라이언트.                                                                                                   |
| [Alibaba](https://www.alibabacloud.com/en?_p_lc=1)  | [DashScopeLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-dashscope-client/ai.koog.prompt.executor.clients.dashscope/-dashscope-l-l-m-client/index.html)      | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | 제공업체별 매개변수(`enableSearch`, `parallelToolCalls`, `enableThinking`)를 노출하는 OpenAI 호환 클라이언트. |
| [Ollama](https://ollama.com/)                       | [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)                            | ✓                | ✓         | -                    | ✓          | ✓          | -                                               | 모델 관리 API를 갖춘 로컬 서버 클라이언트.                                                                             |

## 프롬프트 실행하기

LLM 클라이언트를 사용하여 프롬프트를 실행하려면 다음을 수행하세요.

1.  애플리케이션과 LLM 제공업체 간의 연결을 처리하는 LLM 클라이언트를 생성합니다.
2.  프롬프트와 LLM을 인수로 사용하여 `execute()` 메서드를 호출합니다.

다음은 `OpenAILLMClient`를 사용하여 프롬프트를 실행하는 예시입니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    // OpenAI 클라이언트 생성
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // 프롬프트 생성
    val prompt = prompt("prompt_name", LLMParams()) {
        // 컨텍스트 설정을 위한 시스템 메시지 추가
        system("You are a helpful assistant.")

        // 사용자 메시지 추가
        user("Tell me about Kotlin")

        // 퓨샷(few-shot) 예시를 위한 어시스턴트 메시지도 추가할 수 있습니다
        assistant("Kotlin is a modern programming language...")

        // 다른 사용자 메시지 추가
        user("What are its key features?")
    }

    // 프롬프트 실행
    val response = client.execute(prompt, OpenAIModels.Chat.GPT4o)
    // 응답 출력
    println(response)
}
```
<!--- KNIT example-llm-clients-01.kt -->

## 응답 스트리밍

!!! note
    모든 LLM 클라이언트에서 사용 가능합니다.

응답이 생성되는 즉시 처리해야 하는 경우,
`executeStreaming()` 메서드를 사용하여 모델 출력을 스트리밍할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.streaming.StreamFrame
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
-->
<!--- SUFFIX
}
-->
```kotlin
// API 키로 OpenAI 클라이언트 설정
val token = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(token)

val response = client.executeStreaming(
    prompt = prompt("stream_demo") { user("Stream this response in short chunks.") },
    model = OpenAIModels.Chat.GPT4_1
)

response.collect { event ->
    when (event) {
        is StreamFrame.Append -> println(event.text)
        is StreamFrame.ToolCall -> println("
Tool call: ${event.name}")
        is StreamFrame.End -> println("
[done] Reason: ${event.finishReason}")
    }
}
```
<!--- KNIT example-llm-clients-02.kt -->

## 다중 선택

!!! note
    `GoogleLLMClient`, `BedrockLLMClient`, `OllamaClient`를 제외한 모든 LLM 클라이언트에서 사용 가능합니다.

`executeMultipleChoices()` 메서드를 사용하여 단일 호출로 모델에서 여러 대안 응답을 요청할 수 있습니다.
이 메서드는 실행 중인 프롬프트에 [`numberOfChoices`](prompt-creation/index.md#prompt-parameters) LLM 매개변수를 추가로 지정해야 합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val choices = client.executeMultipleChoices(
        prompt = prompt("n_best", params = LLMParams(numberOfChoices = 3)) {
            system("You are a creative assistant.")
            user("Give me three different opening lines for a story.")
        },
        model = OpenAIModels.Chat.GPT4o
    )

    choices.forEachIndexed { i, choice ->
        val text = choice.joinToString(" ") { it.content }
        println("Line #${i + 1}: $text")
    }
}
```
<!--- KNIT example-llm-clients-03.kt -->

!!! tip
    프롬프트에 `numberOfChoices` LLM 매개변수를 추가하여 여러 선택 항목을 요청할 수도 있습니다.

## 사용 가능한 모델 나열하기

!!! note
    `GoogleLLMClient`, `BedrockLLMClient`, `OllamaClient`를 제외한 모든 LLM 클라이언트에서 사용 가능합니다.

LLM 클라이언트에서 지원하는 사용 가능한 모델 ID 목록을 얻으려면 `models()` 메서드를 사용하세요:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val ids: List<String> = client.models()
    ids.forEach { println(it) }
}
```
<!--- KNIT example-llm-clients-04.kt -->

## 임베딩

!!! note
    `OpenAILLMClient`, `GoogleLLMClient`, `BedrockLLMClient`, `MistralAILLMClient`, `OllamaClient`에서 사용 가능합니다.

`embed()` 메서드를 사용하여 텍스트를 임베딩 벡터로 변환합니다.
임베딩 모델을 선택하고 텍스트를 이 메서드에 전달하세요:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val embedding = client.embed(
        text = "This is a sample text for embedding",
        model = OpenAIModels.Embeddings.TextEmbedding3Large
    )

    println("Embedding size: ${embedding.size}")
}
```
<!--- KNIT example-llm-clients-05.kt -->

## 검토

!!! note
    다음 LLM 클라이언트에서 사용 가능합니다: `OpenAILLMClient`, `BedrockLLMClient`, `MistralAILLMClient`, `OllamaClient`.

`moderate()` 메서드를 검토 모델과 함께 사용하여 프롬프트에 부적절한 콘텐츠가 포함되어 있는지 확인할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val result = client.moderate(
        prompt = prompt("moderation") {
            user("This is a test message that may contain offensive content.")
        },
        model = OpenAIModels.Moderation.Omni
    )

    println(result)
}
```
<!--- KNIT example-llm-clients-06.kt -->

## 프롬프트 이그제큐터와의 통합

[프롬프트 이그제큐터](prompt-executors.md)는 LLM 클라이언트를 래핑(wrap)하며 라우팅, 폴백, 여러 제공업체에 걸친 통합 사용과 같은 추가 기능을 제공합니다.
여러 제공업체와 작업할 때 유연성을 제공하므로 프로덕션 환경에서 사용하는 것이 좋습니다.

[^1]: OpenAI Moderation API를 통한 검토를 지원합니다.
[^2]: 검토에는 Guardrails 구성이 필요합니다.
[^3]: Mistral `v1/moderations` 엔드포인트를 통해 검토를 지원합니다.