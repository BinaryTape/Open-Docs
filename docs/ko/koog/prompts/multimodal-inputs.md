# 다중 모달 입력

텍스트 메시지 외에도, Koog를 사용하면 `user` 메시지 내에서 이미지, 오디오, 비디오 및 파일을 LLM으로 보낼 수 있습니다.
해당 함수들을 사용하여 이러한 첨부 파일을 `user` 메시지에 추가할 수 있습니다:

- `image()`: 이미지(JPG, PNG, WebP, GIF)를 추가합니다.
- `audio()`: 오디오 파일(MP3, WAV, FLAC)을 추가합니다.
- `video()`: 비디오 파일(MP4, AVI, MOV)을 추가합니다.
- `file()` / `binaryFile()` / `textFile()`: 문서(PDF, TXT, MD 등)를 추가합니다.

각 함수는 미디어 콘텐츠 파라미터를 구성하는 두 가지 방식을 지원하므로, 다음을 수행할 수 있습니다.

- URL 또는 파일 경로를 함수에 전달하면, 자동으로 미디어 콘텐츠 파라미터를 처리합니다.
- 미디어 콘텐츠 파라미터에 대한 사용자 정의 제어를 위해 `ContentPart` 객체를 생성하여 함수에 전달합니다.

### 자동 구성 첨부 파일

`image()`, `audio()`, `video()`, 또는 `file()` 함수에 URL 또는 파일 경로를 전달하면, Koog는 파일 확장자를 기반으로 해당 미디어 콘텐츠 파라미터를 자동으로 구성합니다.

텍스트 메시지와 자동 구성된 첨부 파일 목록을 포함하는 `user` 메시지의 일반적인 형식은 다음과 같습니다:

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
    +"이 이미지들을 설명해 주세요:"

    image("https://example.com/test.png")
    image(Path("/User/koog/image.png"))

    +"주요 피사체에 집중해 주세요."
}
```
<!--- KNIT example-multimodal-inputs-01.kt -->

`+` 연산자는 미디어 첨부 파일과 함께 사용자 메시지에 텍스트 콘텐츠를 추가합니다.

### 사용자 정의 구성 첨부 파일

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html) 클래스를 사용하면 각 첨부 파일에 대해 미디어 콘텐츠 파라미터를 개별적으로 구성할 수 있습니다.

각 첨부 파일에 대한 `ContentPart` 객체를 생성하고, 파라미터를 구성한 다음, 해당 `image()`, `audio()`, `video()`, 또는 `file()` 함수에 전달할 수 있습니다.

텍스트 메시지와 사용자 정의 구성 첨부 파일 목록을 포함하는 `user` 메시지의 일반적인 형식은 다음과 같습니다:

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
    +"이 이미지를 설명해 주세요."
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
<!--- KNIT example-multimodal-inputs-02.kt -->

Koog는 각 미디어 유형에 대해 특수화된 `ContentPart` 클래스를 제공합니다:

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): JPG 또는 PNG 파일과 같은 이미지 첨부 파일.
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): MP3 또는 WAV 파일과 같은 오디오 첨부 파일.
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): MP4 또는 AVI 파일과 같은 비디오 첨부 파일.
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): PDF 또는 TXT 파일과 같은 파일 첨부 파일.

모든 `ContentPart` 유형은 다음 파라미터를 허용합니다:

| 이름       | 데이터 유형                               | 필수 여부                    | 설명                                                                                               |
|------------|-----------------------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | Yes                         | 제공된 파일 콘텐츠의 소스. |
| `format`   | String                                  | Yes                         | 제공된 파일의 형식. 예를 들어, `png`.                                                      |
| `mimeType` | String                                  | Only for `ContentPart.File` | 제공된 파일의 MIME 유형. 예를 들어, `image/png`.                                             |
| `fileName` | String                                  | No                          | 확장자를 포함한 제공된 파일의 이름. 예를 들어, `screenshot.png`.                     |

#### 첨부 파일 콘텐츠

`AttachmentContent`는 LLM에 입력으로 제공되는 콘텐츠의 유형과 소스를 정의합니다:

- 제공된 콘텐츠의 URL:
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
  [API 참조](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)도 참고하세요.

- 바이트 배열 형태의 파일 콘텐츠:
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
  [API 참조](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)도 참고하세요.

- 파일 데이터를 포함하는 Base64 인코딩 문자열 형태의 파일 콘텐츠:
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
  [API 참조](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)도 참고하세요.

- 일반 텍스트 형태의 파일 콘텐츠 (`ContentPart.File`에만 해당):

    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
  [API 참조](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)도 참고하세요.

### 혼합 첨부 파일

별도의 프롬프트나 메시지에서 다른 유형의 첨부 파일을 제공하는 것 외에도, 단일 `user` 메시지에서 여러 가지 혼합된 유형의 첨부 파일을 제공할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("당신은 유용한 비서입니다.")

    user {
        +"이미지를 문서 내용과 비교해 주세요."
        image(Path("/User/koog/page.png"))
        binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        +"결과를 표 형태로 구성해 주세요."
    }
}
```
<!--- KNIT example-multimodal-inputs-03.kt -->

## 다음 단계

- 단일 LLM 공급자와 작업하는 경우 [LLM 클라이언트](llm-clients.md)로 프롬프트를 실행하세요.
- 여러 LLM 공급자와 작업하는 경우 [프롬프트 실행기](prompt-executors.md)로 프롬프트를 실행하세요.