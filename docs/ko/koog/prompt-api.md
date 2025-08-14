# 프롬프트 API

프롬프트 API를 사용하면 Kotlin DSL을 통해 잘 구성된 프롬프트를 생성하고, 다양한 LLM 제공자에 대해 실행하며, 여러 형식으로 응답을 처리할 수 있습니다.

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

## 프롬프트 실행

특정 LLM으로 프롬프트를 실행하려면 다음을 수행해야 합니다:

1. 애플리케이션과 LLM 제공자 간의 연결을 처리하는 해당 LLM 클라이언트를 생성합니다. 예를 들면 다음과 같습니다:
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
const val apiKey = "apikey"
-->
```kotlin
// OpenAI 클라이언트 생성
val client = OpenAILLMClient(apiKey)
```
<!--- KNIT example-prompt-api-02.kt -->

2. `execute` 메서드를 프롬프트와 LLM을 인수로 사용하여 호출합니다.
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi01.prompt
import ai.koog.agents.example.examplePromptApi02.client
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
<!--- KNIT example-prompt-api-03.kt -->

다음 LLM 클라이언트를 사용할 수 있습니다:

* [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
* [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
* [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
* [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
* [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)
* [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html) (JVM 전용)

다음은 프롬프트 API 사용의 간단한 예시입니다:

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
<!--- KNIT example-prompt-api-04.kt -->

## 멀티모달 입력

프롬프트 내에서 텍스트 메시지를 제공하는 것 외에도, Koog는 `user` 메시지와 함께 이미지, 오디오, 비디오, 파일을 LLM으로 보낼 수 있도록 합니다. 표준 텍스트 전용 프롬프트와 마찬가지로, 프롬프트 구성 시 DSL 구조를 사용하여 미디어를 프롬프트에 추가할 수 있습니다.

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
<!--- KNIT example-prompt-api-05.kt -->

### 텍스트 프롬프트 내용

다양한 첨부 파일 유형 지원을 수용하고 프롬프트 내에서 텍스트 입력과 파일 입력을 명확하게 구분하기 위해, 사용자 프롬프트 내 전용 `content` 파라미터에 텍스트 메시지를 넣습니다. 파일 입력을 추가하려면, `attachments` 파라미터 내에 목록으로 제공하세요.

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
<!--- KNIT example-prompt-api-06.kt -->

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
<!--- KNIT example-prompt-api-07.kt -->

`attachments` 파라미터는 파일 입력 목록을 취하며, 각 항목은 다음 클래스 중 하나의 인스턴스입니다:

- `Attachment.Image`: `jpg` 또는 `png` 파일과 같은 이미지 첨부 파일.
- `Attachment.Audio`: `mp3` 또는 `wav` 파일과 같은 오디오 첨부 파일.
- `Attachment.Video`: `mpg` 또는 `avi` 파일과 같은 비디오 첨부 파일.
- `Attachment.File`: `pdf` 또는 `txt` 파일과 같은 일반 파일 첨부 파일.

각 클래스는 다음 파라미터를 사용합니다:

| 이름       | 데이터 유형                             | 필수                  | 설명                                                                                             |
|------------|-----------------------------------------|-----------------------|--------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](#attachmentcontent) | 예                    | 제공된 파일 콘텐츠의 소스. 자세한 내용은 [AttachmentContent](#attachmentcontent)를 참조하세요. |
| `format`   | String                                  | 예                    | 제공된 파일의 형식. 예: `png`.                                                                   |
| `mimeType` | String                                  | `Attachment.File`에만 해당 | 제공된 파일의 MIME 유형. 예: `image/png`.                                                        |
| `fileName` | String                                  | 아니요                  | 확장자를 포함한 제공된 파일의 이름. 예: `screenshot.png`.                                          |

#### AttachmentContent

`AttachmentContent`는 LLM에 입력으로 제공되는 콘텐츠의 유형과 소스를 정의합니다. 다음 클래스가 지원됩니다:

`AttachmentContent.URL(val url: String)`

지정된 URL에서 파일 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

| 이름   | 데이터 유형 | 필수 | 설명                      |
|--------|-----------|------|---------------------------|
| `url`  | String    | 예   | 제공된 콘텐츠의 URL.        |

`AttachmentContent.Binary.Bytes(val data: ByteArray)`

바이트 배열로 파일 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

| 이름   | 데이터 유형 | 필수 | 설명                            |
|--------|-----------|------|---------------------------------|
| `data` | ByteArray | 예   | 바이트 배열로 제공되는 파일 콘텐츠. |

`AttachmentContent.Binary.Base64(val base64: String)`

Base64 문자열로 인코딩된 파일 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

| 이름     | 데이터 유형 | 필수 | 설명                            |
|----------|-----------|------|---------------------------------|
| `base64` | String    | 예   | 파일 데이터를 포함하는 Base64 문자열. |

`AttachmentContent.PlainText(val text: String)`

_첨부 파일 유형이 `Attachment.File`인 경우에만 적용됩니다._ 일반 텍스트 파일(예: `text/plain` MIME 유형)의 콘텐츠를 제공합니다. 다음 파라미터를 사용합니다:

| 이름   | 데이터 유형 | 필수 | 설명             |
|--------|-----------|------|------------------|
| `text` | String    | 예   | 파일의 내용.       |

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
<!--- KNIT example-prompt-api-08.kt -->

## 프롬프트 실행기

프롬프트 실행기는 LLM과 상호작용하는 더 높은 수준의 방법을 제공하며, 클라이언트 생성 및 관리의 세부 사항을 처리합니다.

프롬프트 실행기를 사용하여 프롬프트를 관리하고 실행할 수 있습니다.
사용하려는 LLM 제공자에 따라 프롬프트 실행기를 선택하거나, 사용 가능한 LLM 클라이언트 중 하나를 사용하여 커스텀 프롬프트 실행기를 생성할 수 있습니다.

Koog 프레임워크는 여러 프롬프트 실행기를 제공합니다:

- **단일 제공자 실행기**:
    - `simpleOpenAIExecutor`: OpenAI 모델로 프롬프트를 실행하기 위한 실행기.
    - `simpleAnthropicExecutor`: Anthropic 모델로 프롬프트를 실행하기 위한 실행기.
    - `simpleGoogleExecutor`: Google 모델로 프롬프트를 실행하기 위한 실행기.
    - `simpleOpenRouterExecutor`: OpenRouter로 프롬프트를 실행하기 위한 실행기.
    - `simpleOllamaExecutor`: Ollama로 프롬프트를 실행하기 위한 실행기.

- **다중 제공자 실행기**:
    - `DefaultMultiLLMPromptExecutor`: 여러 LLM 제공자와 함께 작업하기 위한 실행기.

### 단일 제공자 실행기 생성

특정 LLM 제공자를 위한 프롬프트 실행기를 생성하려면 해당 함수를 사용합니다.
예를 들어, OpenAI 프롬프트 실행기를 생성하려면 `simpleOpenAIExecutor` 함수를 호출하고 OpenAI 서비스 인증에 필요한 API 키를 제공해야 합니다:

1. 프롬프트 실행기 생성:
<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
const val apiToken = "YOUR_API_TOKEN"
-->
```kotlin
// OpenAI 실행기 생성
val promptExecutor = simpleOpenAIExecutor(apiToken)
```
<!--- KNIT example-prompt-api-09.kt -->

2. 특정 LLM으로 프롬프트 실행:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi08.prompt
import ai.koog.agents.example.examplePromptApi09.promptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.model.PromptExecutorExt.execute
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
<!--- KNIT example-prompt-api-10.kt -->

### 다중 제공자 실행기 생성

여러 LLM 제공자와 함께 작동하는 프롬프트 실행기를 생성하려면 다음을 수행합니다:

1. 필요한 LLM 제공자를 위한 클라이언트를 해당 API 키로 구성합니다. 예를 들면 다음과 같습니다:
<!--- INCLUDE
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
<!--- KNIT example-prompt-api-11.kt -->

2. 구성된 클라이언트들을 `DefaultMultiLLMPromptExecutor` 클래스 생성자에 전달하여 여러 LLM 제공자를 지원하는 프롬프트 실행기를 생성합니다:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi11.anthropicClient
import ai.koog.agents.example.examplePromptApi11.googleClient
import ai.koog.agents.example.examplePromptApi11.openAIClient
import ai.koog.prompt.executor.llms.all.DefaultMultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-api-12.kt -->

3. 특정 LLM으로 프롬프트 실행:
<!--- INCLUDE
import ai.koog.agents.example.examplePromptApi08.prompt
import ai.koog.agents.example.examplePromptApi12.multiExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.model.PromptExecutorExt.execute
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val response = multiExecutor.execute(
    prompt = prompt,
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-api-13.kt -->