# 멀티모달 콘텐츠

멀티모달(Multimodal) 콘텐츠는 텍스트, 이미지, 오디오, 비디오, 파일 등 다양한 유형의 콘텐츠를 의미합니다.
Koog를 사용하면 텍스트와 함께 이미지, 오디오, 비디오, 파일을 `user` 메시지 내에서 LLM으로 보낼 수 있습니다.
다음 함수들을 사용하여 `user` 메시지에 추가할 수 있습니다:

- `image()`: 이미지(JPG, PNG, WebP, GIF)를 첨부합니다.
- `audio()`: 오디오 파일(MP3, WAV, FLAC)을 첨부합니다.
- `video()`: 비디오 파일(MP4, AVI, MOV)을 첨부합니다.
- `file()` / `binaryFile()` / `textFile()`: 문서(PDF, TXT, MD 등)를 첨부합니다.

각 함수는 첨부 파일 매개변수를 구성하는 두 가지 방법을 지원하므로 다음을 수행할 수 있습니다.

- URL 또는 파일 경로를 함수에 전달하면, 첨부 파일 매개변수가 자동으로 처리됩니다. `file()`, `binaryFile()`, `textFile()`의 경우 MIME 유형도 제공해야 합니다.
- 첨부 파일 매개변수를 사용자 지정으로 제어하기 위해 `ContentPart` 객체를 생성하여 함수에 전달합니다.

!!! note
    멀티모달 콘텐츠 지원은 [LLM 제공자](../llm-providers.md)에 따라 다릅니다.
    지원되는 콘텐츠 유형은 제공자 문서를 확인하십시오.

### 자동 구성 첨부 파일

첨부 함수에 URL 또는 파일 경로를 전달하면, Koog는 파일 확장자를 기반으로 해당 첨부 파일 매개변수를 자동으로 구성합니다.

텍스트 메시지와 자동 구성 첨부 파일 목록을 포함하는 `user` 메시지의 일반적인 형식은 다음과 같습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path

val prompt = prompt("image_analysis") {
-->
<!--- SUFFIX
}
-->
```kotlin
user {
    +"Describe these images:"

    image("https://example.com/test.png")
    image(Path("/path/to/image.png"))

    +"Focus on the main subjects."
}
```
<!--- KNIT example-multimodal-content-01.kt -->

`+` 연산자는 첨부 파일과 함께 텍스트 콘텐츠를 사용자 메시지에 추가합니다.

### 사용자 지정 구성 첨부 파일

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html) 인터페이스를 사용하면 각 첨부 파일의 매개변수를 개별적으로 구성할 수 있습니다.

모든 첨부 파일은 `ContentPart.Attachment` 인터페이스를 구현합니다.
각 첨부 파일에 대한 특정 구현 인스턴스를 생성하고, 매개변수를 구성한 다음, 해당 `image()`, `audio()`, `video()`, `file()` 함수에 전달할 수 있습니다.

텍스트 메시지와 사용자 지정 구성 첨부 파일 목록을 포함하는 `user` 메시지의 일반적인 형식은 다음과 같습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.message.AttachmentContent
import ai.koog.prompt.message.ContentPart

val prompt = prompt("custom_image") {
-->
<!--- SUFFIX
}
-->
```kotlin
user {
    +"Describe this image"
    image(
        ContentPart.Image(
            content = AttachmentContent.URL("https://example.com/capture.png"),
            format = "png",
            mimeType = "image/png",
            fileName = "capture.png"
        )
    )
}
```
<!--- KNIT example-multimodal-content-02.kt -->

Koog는 `ContentPart.Attachment` 인터페이스를 구현하는 각 미디어 유형에 대해 다음 특수화된 클래스를 제공합니다:

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): JPG 또는 PNG 파일과 같은 이미지 첨부 파일.
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): MP3 또는 WAV 파일과 같은 오디오 첨부 파일.
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): MP4 또는 AVI 파일과 같은 비디오 첨부 파일.
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): PDF 또는 TXT 파일과 같은 파일 첨부 파일.

모든 `ContentPart.Attachment` 유형은 다음 매개변수를 허용합니다:

| 이름       | 데이터 유형                                                                                                          | 필수 | 설명                                                                                                                                                                                                                             |
|------------|--------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | 예      | 제공된 파일 콘텐츠의 소스.                                                                                                                                                                                                |
| `format`   | String                                                                                                             | 예      | 제공된 파일의 형식. 예를 들어, `png`.                                                                                                                                                                                    |
| `mimeType` | String                                                                                                             | `ContentPart.File`에만 해당      | 제공된 파일의 MIME 유형.<br/>`ContentPart.Image`, `ContentPart.Audio`, `ContentPart.Video`의 경우 `<type>/<format>`(예: `image/png`)으로 기본 설정됩니다.<br/>`ContentPart.File`의 경우 명시적으로 제공해야 합니다. |
| `fileName` | String?                                                                                                            | 아니요       | 확장자를 포함한 제공된 파일의 이름. 예를 들어, `screenshot.png`.                                                                                                                                                   |

#### 첨부 파일 콘텐츠

AttachmentContent 인터페이스의 구현은 LLM에 입력으로 제공되는 콘텐츠의 유형과 소스를 정의합니다:

- [`AttachmentContent.URL`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)은 제공된 콘텐츠의 URL을 정의합니다:
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
- [`AttachmentContent.Binary.Bytes`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)는 파일 콘텐츠를 바이트 배열로 정의합니다:
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```

- [`AttachmentContent.Binary.Base64`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)는 파일 데이터를 포함하는 Base64로 인코딩된 문자열로 파일 콘텐츠를 정의합니다:
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```

- [`AttachmentContent.PlainText`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)는 파일 콘텐츠를 일반 텍스트로 정의합니다 ([`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html)에만 해당):
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```

### 혼합 첨부 파일

별도의 프롬프트나 메시지에서 다양한 유형의 첨부 파일을 제공하는 것 외에도, 단일 `user()` 메시지에서 여러 가지 혼합된 유형의 첨부 파일을 제공할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("You are a helpful assistant.")

    user {
        +"Compare the image with the document content."
        image(Path("/path/to/image.png"))
        binaryFile(Path("/path/to/page.pdf"), "application/pdf")
        +"Structure the result as a table"
    }
}
```
<!--- KNIT example-multimodal-content-03.kt -->

## 다음 단계

- 단일 LLM 제공자와 작업하는 경우 [LLM 클라이언트](../llm-clients.md)로 프롬프트를 실행하십시오.
- 여러 LLM 제공자와 작업하는 경우 [프롬프트 실행기](../prompt-executors.md)로 프롬프트를 실행하십시오.