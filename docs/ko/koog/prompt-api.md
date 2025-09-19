# 프롬프트 API

프롬프트 API는 프로덕션 애플리케이션에서 대규모 언어 모델(LLM)과 상호작용하기 위한 포괄적인 툴킷을 제공합니다. 다음을 제공합니다:

- 타입 안전성을 갖춘 구조화된 프롬프트를 생성하기 위한 **Kotlin DSL**
- OpenAI, Anthropic, Google 및 다른 LLM 제공자를 위한 **다중 제공자 지원**
- 재시도 로직, 오류 처리, 타임아웃 구성과 같은 **프로덕션 기능**
- 텍스트, 이미지, 오디오 및 문서 작업을 위한 **멀티모달 기능**

## 아키텍처 개요

프롬프트 API는 세 가지 주요 계층으로 구성됩니다:

- **LLM 클라이언트**: 특정 제공자(OpenAI, Anthropic 등)에 대한 저수준 인터페이스.
- **데코레이터**: 재시도 로직과 같은 기능을 추가하는 선택적 래퍼.
- **프롬프트 실행기**: 클라이언트 라이프사이클을 관리하고 사용을 간소화하는 고수준 추상화.

## 프롬프트 생성

프롬프트 API는 Kotlin DSL을 사용하여 프롬프트를 생성합니다. 다음 유형의 메시지를 지원합니다:

- `system`: LLM의 컨텍스트와 지시사항을 설정합니다.
- `user`: 사용자 입력을 나타냅니다.
- `assistant`: LLM 응답을 나타냅니다.

다음은 간단한 프롬프트의 예시입니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val prompt = prompt("prompt_name", LLMParams()) {
    // 컨텍스트를 설정하기 위한 시스템 메시지 추가
    system("You are a helpful assistant.")

    // 사용자 메시지 추가
    user("Tell me about Kotlin")

    // 퓨샷(few-shot) 예시를 위해 어시스턴트 메시지를 추가할 수도 있습니다.
    assistant("Kotlin is a modern programming language...")

    // 또 다른 사용자 메시지 추가
    user("What are its key features?")
}
```
<!--- KNIT example-prompt-api-01.kt -->

## 멀티모달 입력

프롬프트 내에서 텍스트 메시지를 제공하는 것 외에도, Koog는 이미지, 오디오, 비디오, 파일을 `user` 메시지와 함께 LLM으로 보낼 수도 있도록 합니다.
표준 텍스트 전용 프롬프트와 마찬가지로, 프롬프트 구성 시 DSL 구조를 사용하여 미디어를 프롬프트에 추가합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("multimodal_input") {
    system("You are a helpful assistant.")

    user {
        +"Describe these images"

        attachments {
            image("https://example.com/test.png")
            image(Path("/User/koog/image.png"))
        }
    }
}
```
<!--- KNIT example-prompt-api-02.kt -->

### 텍스트 프롬프트 내용

다양한 첨부 파일 유형 지원을 수용하고 프롬프트 내에서 텍스트 입력과 파일 입력을 명확하게 구분하기 위해, 사용자 프롬프트 내 전용 `content` 파라미터에 텍스트 메시지를 넣습니다.
파일 입력을 추가하려면, `attachments` 파라미터 내에 목록으로 제공하세요.

텍스트 메시지와 첨부 파일 목록을 포함하는 사용자 메시지의 일반적인 형식은 다음과 같습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user(
    content = "This is the user message",
    attachments = listOf(
        // 첨부 파일 추가
    )
)
```
<!--- KNIT example-prompt-api-03.kt -->

### 파일 첨부

첨부 파일을 포함하려면, 아래 형식에 따라 `attachments` 파라미터에 파일을 제공하세요:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.message.Attachment
import ai.koog.prompt.message.AttachmentContent

val prompt = prompt("prompt") {
-->
<!--- SUFFIX
}
-->
```kotlin
user(
    content = "Describe this image",
    attachments = listOf(
        Attachment.Image(
            content = AttachmentContent.URL("https://example.com/capture.png"),
            format = "png",
            mimeType = "image/png",
            fileName = "capture.png"
        )
    )
)
```
<!--- KNIT example-prompt-api-04.kt -->

`attachments` 파라미터는 파일 입력 목록을 취하며, 각 항목은 다음 클래스 중 하나의 인스턴스입니다:

- `Attachment.Image`: `jpg` 또는 `png` 파일과 같은 이미지 첨부 파일.
- `Attachment.Audio`: `mp3` 또는 `wav` 파일과 같은 오디오 첨부 파일.
- `Attachment.Video`: `mpg` 또는 `avi` 파일과 같은 비디오 첨부 파일.
- `Attachment.File`: `pdf` 또는 `txt` 파일과 같은 일반 파일 첨부 파일.

각 클래스는 다음 파라미터를 사용합니다:

| 이름       | 데이터 유형                             | 필수                   | 설명                                                                                             |
|------------|-----------------------------------------|------------------------|--------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | 예                     | 제공된 파일 콘텐츠의 소스. 자세한 내용은 [AttachmentContent](#attachmentcontent)를 참조하세요. |
| `format`   | String                                  | 예                     | 제공된 파일의 형식. 예: `png`.                                                                   |
| `mimeType` | String                                  | `Attachment.File`에만 해당 | 제공된 파일의 MIME 유형. 예: `image/png`.                                                        |
| `fileName` | String                                  | 아니요                   | 확장자를 포함한 제공된 파일의 이름. 예: `screenshot.png`.                                          |

자세한 내용은 [API reference](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment/index.html)를 참조하세요.

#### AttachmentContent

`AttachmentContent`는 LLM에 입력으로 제공되는 콘텐츠의 유형과 소스를 정의합니다. 다음 클래스가 지원됩니다:

* `AttachmentContent.URL(val url: String)`

  지정된 URL에서 파일 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

  | 이름   | 데이터 유형 | 필수 | 설명                      |
  |--------|-----------|------|---------------------------|
  | `url`  | String    | 예   | 제공된 콘텐츠의 URL.        |

  [API reference](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)도 참조하세요.

* `AttachmentContent.Binary.Bytes(val data: ByteArray)`

  바이트 배열로 파일 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

  | 이름   | 데이터 유형 | 필수 | 설명                            |
  |--------|-----------|------|---------------------------------|
  | `data` | ByteArray | 예   | 바이트 배열로 제공되는 파일 콘텐츠. |

  [API reference](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)도 참조하세요.

* `AttachmentContent.Binary.Base64(val base64: String)`

  Base64 문자열로 인코딩된 파일 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

  | 이름     | 데이터 유형 | 필수 | 설명                            |
  |----------|-----------|------|---------------------------------|
  | `base64` | String    | 예   | 파일 데이터를 포함하는 Base64 문자열. |

  [API reference](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)도 참조하세요.

* `AttachmentContent.PlainText(val text: String)`

!!! tip
    첨부 파일 유형이 `Attachment.File`인 경우에만 적용됩니다.

  일반 텍스트 파일(예: `text/plain` MIME 유형)의 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

  | 이름   | 데이터 유형 | 필수 | 설명             |
  |--------|-----------|------|------------------|
  | `text` | String    | 예   | 파일의 내용.       |

  [API reference](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)도 참조하세요.

### 혼합 첨부 파일 내용

별도의 프롬프트나 메시지에 다양한 유형의 첨부 파일을 제공하는 것 외에도, 아래와 같이 단일 `user` 메시지에 여러 혼합 유형의 첨부 파일을 제공할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("You are a helpful assistant.")

    user {
        +"Compare the image with the document content."

        attachments {
            image(Path("/User/koog/page.png"))
            binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        }
    }
}
```
<!--- KNIT example-prompt-api-05.kt -->

## LLM 클라이언트와 프롬프트 실행기 선택

프롬프트 API를 사용할 때, LLM 클라이언트 또는 프롬프트 실행기를 사용하여 프롬프트를 실행할 수 있습니다.
클라이언트와 실행기 중 하나를 선택하려면 다음 요소를 고려하세요:

- 단일 LLM 제공자와 작업하고 고급 라이프사이클 관리가 필요하지 않은 경우 LLM 클라이언트를 직접 사용하세요. 자세한 내용은 [LLM 클라이언트로 프롬프트 실행](#running-prompts-with-llm-clients)을 참조하세요.
- LLM 및 해당 라이프사이클 관리를 위한 더 높은 수준의 추상화가 필요하거나, 여러 제공자 간에 일관된 API로 프롬프트를 실행하고 동적으로 전환하고 싶다면 프롬프트 실행기를 사용하세요.
  자세한 내용은 [프롬프트 실행기로 프롬프트 실행](#running-prompts-with-prompt-executors)을 참조하세요.

!!!note
    LLM 클라이언트와 프롬프트 실행기 모두 응답 스트리밍, 다중 선택 생성 및 콘텐츠 조정을 가능하게 합니다.
    자세한 내용은 특정 클라이언트 또는 실행기의 [API 참조](https://api.koog.ai/index.html)를 참조하세요.

## LLM 클라이언트로 프롬프트 실행

단일 LLM 제공자와 작업하고 고급 라이프사이클 관리가 필요하지 않은 경우 LLM 클라이언트를 사용하여 프롬프트를 실행할 수 있습니다.
Koog는 다음 LLM 클라이언트를 제공합니다:

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (JVM 전용)

LLM 클라이언트를 사용하여 프롬프트를 실행하려면 다음을 수행하세요:

1) 애플리케이션과 LLM 제공자 간의 연결을 처리하는 해당 LLM 클라이언트를 생성합니다. 예를 들면 다음과 같습니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// OpenAI 클라이언트 생성
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-06.kt -->

2) 프롬프트와 LLM을 인수로 사용하여 `execute` 메서드를 호출합니다.

<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi01.prompt
import ai.koog.agents.example.examplePromptApi06.client
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
runBlocking {
-->
<!--- SUFFIX
}
}
-->
```kotlin
// 프롬프트 실행
val response = client.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o  // 다른 모델을 선택할 수 있습니다.
)
```
<!--- KNIT example-prompt-api-07.kt -->

다음은 OpenAI 클라이언트를 사용하여 프롬프트를 실행하는 예시입니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin

fun main() {
    runBlocking {
        // API 키로 OpenAI 클라이언트 설정
        val token = System.getenv("OPENAI_API_KEY")
        val client = OpenAILLMClient(token)

        // 프롬프트 생성
        val prompt = prompt("prompt_name", LLMParams()) {
            // 컨텍스트를 설정하기 위한 시스템 메시지 추가
            system("You are a helpful assistant.")

            // 사용자 메시지 추가
            user("Tell me about Kotlin")

            // 퓨샷(few-shot) 예시를 위해 어시스턴트 메시지를 추가할 수도 있습니다.
            assistant("Kotlin is a modern programming language...")

            // 또 다른 사용자 메시지 추가
            user("What are its key features?")
        }

        // 프롬프트 실행 및 응답 받기
        val response = client.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4o)
        println(response)
    }
}
```
<!--- KNIT example-prompt-api-08.kt -->

!!!note
    LLM 클라이언트는 응답 스트리밍, 다중 선택 생성 및 콘텐츠 조정을 가능하게 합니다.
    자세한 내용은 특정 클라이언트의 API 참조를 참조하세요.
    콘텐츠 조정에 대해 자세히 알아보려면 [콘텐츠 조정](content-moderation.md)을 참조하세요.

## 프롬프트 실행기로 프롬프트 실행

LLM 클라이언트가 제공자에 대한 직접적인 접근을 제공하는 반면, 프롬프트 실행기는 일반적인 사용 사례를 간소화하고 클라이언트 라이프사이클 관리를 처리하는 더 높은 수준의 추상화를 제공합니다.
다음과 같은 경우에 이상적입니다:

- 클라이언트 구성 관리 없이 신속하게 프로토타입을 만들 때
- 통합 인터페이스를 통해 여러 제공자와 작업할 때
- 대규모 애플리케이션에서 의존성 주입을 간소화할 때
- 제공자별 세부 정보를 추상화할 때

### 실행기 유형

Koog는 두 가지 주요 프롬프트 실행기를 제공합니다:

| <div style="width:175px">이름</div> | 설명                                                                                                                                                                                                                             |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html)       | 단일 제공자를 위한 단일 LLM 클라이언트를 래핑합니다. 에이전트가 단일 LLM 제공자 내에서 모델을 전환하는 기능만 필요한 경우 이 실행기를 사용하세요.                                                                             |
| [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html)        | 제공자별로 여러 LLM 클라이언트로 라우팅하며, 요청된 제공자를 사용할 수 없을 때 사용할 각 제공자에 대한 선택적 폴백(fallback)을 제공합니다. 에이전트가 다른 제공자의 모델 간에 전환해야 하는 경우 이 실행기를 사용하세요. |

이들은 LLM으로 프롬프트를 실행하기 위한 [`PromtExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html) 인터페이스의 구현입니다.

### 단일 제공자 실행기 생성

특정 LLM 제공자를 위한 프롬프트 실행기를 생성하려면 다음을 수행하세요:

1) 특정 제공자를 위한 LLM 클라이언트를 해당 API 키로 구성합니다:
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
```
<!--- KNIT example-prompt-api-09.kt -->
2) [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html)를 사용하여 프롬프트 실행기를 생성합니다:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi09.openAIClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val promptExecutor = SingleLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-api-10.kt -->

### 다중 제공자 실행기 생성

여러 LLM 제공자와 함께 작동하는 프롬프트 실행기를 생성하려면 다음을 수행합니다:

1) 필요한 LLM 제공자를 위한 클라이언트를 해당 API 키로 구성합니다:
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val ollamaClient = OllamaClient()
```
<!--- KNIT example-prompt-api-11.kt -->

2) 구성된 클라이언트들을 `MultiLLMPromptExecutor` 클래스 생성자에 전달하여 여러 LLM 제공자를 지원하는 프롬프트 실행기를 생성합니다:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi11.openAIClient
import ai.koog.agents.example.examplePromptApi11.ollamaClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider
-->
```kotlin
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Ollama to ollamaClient
)
```
<!--- KNIT example-prompt-api-12.kt -->

### 사전 정의된 프롬프트 실행기

더 빠른 설정을 위해 Koog는 일반적인 제공자를 위한 다음과 같은 즉시 사용 가능한 실행기 구현을 제공합니다:

- 특정 LLM 클라이언트로 구성된 `SingleLLMPromptExecutor`를 반환하는 단일 제공자 실행기:
    - `simpleOpenAIExecutor`: OpenAI 모델로 프롬프트를 실행하기 위한 실행기.
    - `simpleAzureOpenAIExecutor`: Azure OpenAI Service를 사용하여 프롬프트를 실행하기 위한 실행기.
    - `simpleAnthropicExecutor`: Anthropic 모델로 프롬프트를 실행하기 위한 실행기.
    - `simpleGoogleAIExecutor`: Google 모델로 프롬프트를 실행하기 위한 실행기.
    - `simpleOpenRouterExecutor`: OpenRouter로 프롬프트를 실행하기 위한 실행기.
    - `simpleOllamaExecutor`: Ollama로 프롬프트를 실행하기 위한 실행기.

- 다중 제공자 실행기:
    - `DefaultMultiLLMPromptExecutor`: OpenAI, Anthropic, Google 제공자를 지원하는 `MultiLLMPromptExecutor`의 구현.

다음은 사전 정의된 단일 및 다중 제공자 실행기를 생성하는 예시입니다:

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.all.DefaultMultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// OpenAI 실행기 생성
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// OpenAI, Anthropic, Google LLM 클라이언트를 사용하는 DefaultMultiLLMPromptExecutor 생성
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-api-13.kt -->

### 프롬프트 실행

프롬프트 실행기는 스트리밍, 다중 선택 생성 및 콘텐츠 조정과 같은 다양한 기능을 사용하여 프롬프트를 실행하는 메서드를 제공합니다.

다음은 `execute` 메서드를 사용하여 특정 LLM으로 프롬프트를 실행하는 예시입니다:

<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi04.prompt
import ai.koog.agents.example.examplePromptApi10.promptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 프롬프트 실행
val response = promptExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-api-14.kt -->

이렇게 하면 `GPT4o` 모델로 프롬프트가 실행되고 응답이 반환됩니다.

!!!note
    프롬프트 실행기는 응답 스트리밍, 다중 선택 생성 및 콘텐츠 조정을 가능하게 합니다.
    자세한 내용은 특정 실행기의 API 참조를 참조하세요.
    콘텐츠 조정에 대해 자세히 알아보려면 [콘텐츠 조정](content-moderation.md)을 참조하세요.

## 캐시된 프롬프트 실행기

반복되는 요청의 경우, 성능을 최적화하고 비용을 줄이기 위해 LLM 응답을 캐시할 수 있습니다.
Koog는 캐싱 기능을 추가하는 `PromptExecutor`의 래퍼인 `CachedPromptExecutor`를 제공합니다.
이것은 이전에 실행된 프롬프트의 응답을 저장하고 동일한 프롬프트가 다시 실행될 때 이를 검색할 수 있도록 합니다.

캐시된 프롬프트 실행기를 생성하려면 다음을 수행하세요:

1) 응답을 캐시하려는 프롬프트 실행기를 생성합니다:
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
-->
```kotlin
val client = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = SingleLLMPromptExecutor(client)
```
<!--- KNIT example-prompt-api-15.kt -->

2) 원하는 캐시로 `CachedPromptExecutor` 인스턴스를 생성하고 생성된 프롬프트 실행기를 제공합니다:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi15.promptExecutor
import ai.koog.prompt.cache.files.FilePromptCache
import ai.koog.prompt.executor.cached.CachedPromptExecutor
import kotlin.io.path.Path
import kotlinx.coroutines.runBlocking
-->
```kotlin
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("/cache_directory")),
    nested = promptExecutor
)
```
<!--- KNIT example-prompt-api-16.kt -->

3) 원하는 프롬프트 및 모델로 캐시된 프롬프트 실행기를 실행합니다:
<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.agents.example.examplePromptApi16.cachedExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val prompt = prompt("test") {
            user("Hello")
        }

-->
<!--- SUFFIX
    }
}
-->
```kotlin
val response = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-17.kt -->

이제 동일한 프롬프트를 동일한 모델로 여러 번 실행할 수 있으며, 응답은 캐시에서 검색됩니다.

!!!note
    * 캐시된 프롬프트 실행기로 `executeStreaming()`을 호출하면 응답을 단일 청크로 생성합니다.
    * 캐시된 프롬프트 실행기로 `moderate()`를 호출하면 요청을 중첩된 프롬프트 실행기로 전달하며 캐시를 사용하지 않습니다.
    * 다중 선택 응답의 캐싱은 지원되지 않습니다.

## 재시도 기능

LLM 제공자와 작업할 때, 속도 제한 또는 일시적인 서비스 사용 불가와 같은 일시적인 오류가 발생할 수 있습니다. `RetryingLLMClient` 데코레이터는 모든 LLM 클라이언트에 자동 재시도 로직을 추가합니다.

### 기본 사용법

기존 클라이언트를 재시도 기능으로 래핑(Wrap)합니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY")
        val prompt = prompt("test") {
            user("Hello")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 모든 클라이언트를 재시도 기능으로 래핑합니다.
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// 이제 모든 작업은 일시적인 오류 발생 시 자동으로 재시도됩니다.
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-18.kt -->

#### 재시도 동작 구성

Koog는 몇 가지 사전 정의된 재시도 구성을 제공합니다:

| 구성       | 최대 시도 횟수 | 초기 지연 | 최대 지연 | 사용 사례          |
|------------|----------------|-----------|-----------|--------------------|
| `DISABLED` | 1 (재시도 없음) | -         | -         | 개발 및 테스트      |
| `CONSERVATIVE` | 3              | 2초       | 30초      | 일반적인 프로덕션 사용 |
| `AGGRESSIVE` | 5              | 500ms     | 20초      | 중요 작업          |
| `PRODUCTION` | 3              | 1초       | 20초      | 권장 기본값        |

직접 사용하거나 사용자 정의 구성을 생성합니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 사전 정의된 구성 사용
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)

// 또는 사용자 정의 구성 생성
val customClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig(
        maxAttempts = 5,
        initialDelay = 1.seconds,
        maxDelay = 30.seconds,
        backoffMultiplier = 2.0,
        jitterFactor = 0.2
    )
)
```
<!--- KNIT example-prompt-api-19.kt -->

#### 재시도 가능한 오류 패턴

기본적으로 재시도 메커니즘은 일반적인 일시적 오류를 인식합니다:

* **HTTP 상태 코드**:
    * `429`: 속도 제한
    * `500`: 내부 서버 오류
    * `502`: Bad Gateway
    * `503`: 서비스 사용 불가
    * `504`: 게이트웨이 타임아웃
    * `529`: Anthropic 과부하

* **오류 키워드**:
    * rate limit
    * too many requests
    * request timeout
    * connection timeout
    * read timeout
    * write timeout
    * connection reset by peer
    * connection refused
    * temporarily unavailable
    * service unavailable

특정 요구 사항에 맞게 사용자 정의 패턴을 정의할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),           // 특정 상태 코드
        RetryablePattern.Keyword("quota"),      // 오류 메시지의 키워드
        RetryablePattern.Regex(Regex("ERR_\\d+")), // 사용자 정의 정규 표현식 패턴
        RetryablePattern.Custom { error ->      // 사용자 정의 로직
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-prompt-api-20.kt -->

#### 프롬프트 실행기와 함께 재시도

프롬프트 실행기를 사용할 때, 실행기를 생성하기 전에 기본 LLM 클라이언트를 재시도 메커니즘으로 래핑합니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider

-->
```kotlin
// 재시도 기능을 갖춘 단일 제공자 실행기
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_KEY")),
    RetryConfig.PRODUCTION
)
val executor = SingleLLMPromptExecutor(resilientClient)

// 유연한 클라이언트 구성을 갖춘 다중 제공자 실행기
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock 클라이언트는 이미 AWS SDK 재시도 기능이 내장되어 있습니다.
    LLMProvider.Bedrock to BedrockLLMClient(
        awsAccessKeyId = System.getenv("AWS_ACCESS_KEY_ID"),
        awsSecretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY"),
        awsSessionToken = System.getenv("AWS_SESSION_TOKEN"),
    ))
```
<!--- KNIT example-prompt-api-21.kt -->

#### 재시도 기능을 갖춘 스트리밍

스트리밍 작업은 선택적으로 재시도될 수 있습니다 (기본적으로 비활성화됨):

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val baseClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
        val prompt = prompt("test") {
            user("Generate a story")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val config = RetryConfig(
    maxAttempts = 3
)

val client = RetryingLLMClient(baseClient, config)
val stream = client.executeStreaming(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-prompt-api-22.kt -->

!!!note
    스트리밍 재시도는 첫 번째 토큰을 받기 전의 연결 실패에만 적용됩니다. 스트리밍이 시작되면 오류는 콘텐츠 무결성을 보존하기 위해 전달됩니다.

### 타임아웃 구성

모든 LLM 클라이언트는 지연되는 요청을 방지하기 위해 타임아웃 구성을 지원합니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.ConnectionTimeoutConfig
import ai.koog.prompt.executor.clients.openai.OpenAIClientSettings
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient

val apiKey = System.getenv("OPENAI_API_KEY")
-->
```kotlin
val client = OpenAILLMClient(
    apiKey = apiKey,
    settings = OpenAIClientSettings(
        timeoutConfig = ConnectionTimeoutConfig(
            connectTimeoutMillis = 5000,    // 연결 설정에 5초
            requestTimeoutMillis = 60000    // 전체 요청에 60초
        )
    )
)
```
<!--- KNIT example-prompt-api-23.kt -->

### 오류 처리

프로덕션 환경에서 LLM과 작업할 때, 오류 처리 전략을 구현해야 합니다:

- 예상치 못한 오류를 처리하기 위해 **try-catch 블록을 사용합니다.**
- 디버깅을 위해 **컨텍스트와 함께 오류를 로깅합니다.**
- 중요 작업에 대한 **대체 전략을 구현합니다.**
- 시스템적 문제를 식별하기 위해 **재시도 패턴을 모니터링합니다.**

포괄적인 오류 처리 예시:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory

fun main() {
    runBlocking {
        val logger = LoggerFactory.getLogger("Example")
        val resilientClient = RetryingLLMClient(
            OpenAILLMClient(System.getenv("OPENAI_KEY"))
        )
        val prompt = prompt("test") { user("Hello") }
        val model = OpenAIModels.Chat.GPT4o
        
        fun processResponse(response: Any) { /* ... */ }
        fun scheduleRetryLater() { /* ... */ }
        fun notifyAdministrator() { /* ... */ }
        fun useDefaultResponse() { /* ... */ }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
try {
    val response = resilientClient.execute(prompt, model)
    processResponse(response)
} catch (e: Exception) {
    logger.error("LLM operation failed", e)
    
    when {
        e.message?.contains("rate limit") == true -> {
            // 속도 제한을 구체적으로 처리합니다.
            scheduleRetryLater()
        }
        e.message?.contains("invalid api key") == true -> {
            // 인증 오류를 처리합니다.
            notifyAdministrator()
        }
        else -> {
            // 대체 솔루션으로 폴백(fallback)합니다.
            useDefaultResponse()
        }
    }
}
```
<!--- KNIT example-prompt-api-24.kt -->