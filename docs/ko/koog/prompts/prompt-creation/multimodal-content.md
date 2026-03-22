# 멀티모달 콘텐츠

멀티모달 콘텐츠는 텍스트, 이미지, 오디오, 비디오, 파일과 같은 다양한 유형의 콘텐츠를 의미합니다.
Koog를 사용하면 텍스트와 함께 `user` 메시지 내에서 이미지, 오디오, 비디오 및 파일을 LLM으로 보낼 수 있습니다. 
Kotlin의 해당 함수나 Java의 메서드를 사용하여 `user` 메시지에 추가할 수 있습니다:

- `image()`: 이미지 첨부 (JPG, PNG, WebP, GIF).
- `audio()`: 오디오 파일 첨부 (MP3, WAV, FLAC).
- `video()`: 비디오 파일 첨부 (MP4, AVI, MOV).
- `file()` / `binaryFile()` / `textFile()`: 문서 첨부 (PDF, TXT, MD 등).

각 함수나 메서드는 첨부 파라미터를 구성하는 두 가지 방법을 지원하므로 다음과 같이 할 수 있습니다:

- 함수나 메서드에 URL이나 파일 경로를 전달하면 첨부 파라미터가 자동으로 처리됩니다. `file()`, `binaryFile()`, `textFile()`의 경우 MIME 타입도 제공해야 합니다.
- 첨부 파라미터를 커스텀하게 제어하려면 `ContentPart` 객체를 생성하여 함수나 메서드에 전달합니다.

!!! note
    멀티모달 콘텐츠 지원은 [LLM 제공자](../../llm-providers.md)에 따라 다릅니다.
    지원되는 콘텐츠 유형은 제공자 문서를 확인하세요.

### 자동 구성된 첨부 파일

첨부 함수나 메서드에 URL이나 파일 경로를 전달하면, Koog는 파일 확장자를 기반으로 해당 첨부 파라미터를 자동으로 구성합니다.

텍스트 메시지와 자동 구성된 첨부 파일 목록을 포함하는 `user` 메시지의 일반적인 형식은 다음과 같습니다:

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ContentPartsBuilder partsBuilder = new ContentPartsBuilder();
    partsBuilder.text("Describe these images:");
    partsBuilder.image("https://example.com/test.png");
    partsBuilder.text("Focus on the main subjects.");

    Prompt prompt = Prompt.builder("image_analysis")
        .user(partsBuilder.build())
        .build();
    ```
    <!--- KNIT example-multimodal-content-java-01.java -->

Kotlin에서 `+` 연산자는 첨부 파일과 함께 텍스트 콘텐츠를 사용자 메시지에 추가합니다. Java에서는 `ContentPartsBuilder`의 `text()` 메서드를 사용하세요.

### 커스텀 구성된 첨부 파일

[`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart) 인터페이스를 사용하면 각 첨부 파일의 파라미터를 개별적으로 구성할 수 있습니다.

모든 첨부 파일은 `ContentPart.Attachment` 인터페이스를 구현합니다.
각 첨부 파일에 대한 특정 구현 인스턴스를 생성하고 파라미터를 구성한 다음, 이를 Kotlin의 해당 `image()`, `audio()`, `video()`, 또는 `file()` 함수나 Java의 메서드에 전달할 수 있습니다.

텍스트 메시지와 커스텀 구성된 첨부 파일 목록을 포함하는 `user` 메시지의 일반적인 형식은 다음과 같습니다:

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("custom_image")
        .user(List.of(
            new ContentPart.Text("Describe this image"),
            new ContentPart.Image(
                new AttachmentContent.URL("https://example.com/capture.png"),
                "png",
                "image/png",
                "capture.png"
            )
        ))
        .build();
    ```
    <!--- KNIT example-multimodal-content-java-02.java -->

Koog는 `ContentPart.Attachment` 인터페이스를 구현하는 각 미디어 유형별 전용 클래스를 제공합니다:

- [`ContentPart.Image`](api:prompt-model::ai.koog.prompt.message.ContentPart.Image): JPG나 PNG 파일과 같은 이미지 첨부 파일.
- [`ContentPart.Audio`](api:prompt-model::ai.koog.prompt.message.ContentPart.Audio): MP3나 WAV 파일과 같은 오디오 첨부 파일.
- [`ContentPart.Video`](api:prompt-model::ai.koog.prompt.message.ContentPart.Video): MP4나 AVI 파일과 같은 비디오 첨부 파일.
- [`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File): PDF나 TXT 파일과 같은 파일 첨부 파일.

모든 `ContentPart.Attachment` 유형은 다음 파라미터를 허용합니다:

| 이름 | 데이터 타입 | 필수 여부 | 설명 |
|------------|--------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](api:prompt-model::ai.koog.prompt.message.AttachmentContent) | 예 | 제공된 파일 콘텐츠의 소스. |
| `format`   | String | 예 | 제공된 파일의 형식. 예: `png`. |
| `mimeType` | String | `ContentPart.File`인 경우에만 | 제공된 파일의 MIME 타입.<br/>`ContentPart.Image`, `ContentPart.Audio`, `ContentPart.Video`의 경우 기본값은 `<type>/<format>`입니다 (예: `image/png`).<br/>`ContentPart.File`의 경우 명시적으로 제공해야 합니다. |
| `fileName` | String? | 아니요 | 확장자를 포함한 제공된 파일의 이름. 예: `screenshot.png`. |

#### 첨부 콘텐츠

AttachmentContent 인터페이스의 구현체는 LLM에 입력으로 제공되는 콘텐츠의 유형과 소스를 정의합니다:

- [`AttachmentContent.URL`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.URL)은 제공된 콘텐츠의 URL을 정의합니다:
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
    <!--- KNIT example-multimodal-content-01.txt -->

- [`AttachmentContent.Binary.Bytes`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary)는 파일 콘텐츠를 바이트 배열로 정의합니다:
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
    <!--- KNIT example-multimodal-content-02.txt -->

- [`AttachmentContent.Binary.Base64`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary)는 파일 데이터를 포함하는 Base64 인코딩된 문자열로 파일 콘텐츠를 정의합니다:
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
    <!--- KNIT example-multimodal-content-03.txt -->

- [`AttachmentContent.PlainText`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.PlainText)는 파일 콘텐츠를 플레인 텍스트로 정의합니다 ([`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File) 전용):
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
    <!--- KNIT example-multimodal-content-04.txt -->

### 혼합된 첨부 파일

서로 다른 유형의 첨부 파일을 별도의 프롬프트나 메시지에 제공하는 것 외에도, 단일 `user()` 메시지에 여러 유형 및 혼합된 유형의 첨부 파일을 제공할 수 있습니다:

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("mixed_content_example")
    .system("You are a helpful assistant.")
    .user(List.of(
        new ContentPart.Text("Please analyze this image and the attached document."),
        new ContentPart.Image(
            new AttachmentContent.URL("https://example.com/image.png"),
            "png",
            "image/png",
            "image.png"
        ),
        new ContentPart.File(
            new AttachmentContent.URL("https://example.com/document.pdf"),
            "pdf",
            "application/pdf",
            "document.pdf"
        ),
        new ContentPart.Text("Summarize the differences.")
    ))
    .build();
    ```
    <!--- KNIT example-multimodal-content-java-03.java -->

## 다음 단계

- 단일 LLM 제공자와 작업하는 경우 [LLM 클라이언트](../llm-clients.md)를 사용하여 프롬프트를 실행하세요.
- 여러 LLM 제공자와 작업하는 경우 [프롬프트 실행기](../prompt-executors.md)를 사용하여 프롬프트를 실행하세요.