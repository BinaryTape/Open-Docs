# 多模態內容

多模態內容是指不同類型的內容，例如文字、影像、音訊、影片和檔案。
Koog 讓您可以在 `user` 訊息中連同文字一起將影像、音訊、影片和檔案發送給大型語言模型。
您可以使用 Kotlin 中相應的函式或 Java 中的方法將它們新增到 `user` 訊息中：

- `image()`：附加影像 (JPG, PNG, WebP, GIF)。
- `audio()`：附加音訊檔案 (MP3, WAV, FLAC)。
- `video()`：附加影片檔案 (MP4, AVI, MOV)。
- `file()` / `binaryFile()` / `textFile()`：附加文件 (PDF, TXT, MD 等)。

每個函式或方法都支援兩種配置附件參數的方式，因此您可以：

- 將 URL 或檔案路徑傳遞給函式或方法，它會自動處理附件參數。對於 `file()`、`binaryFile()` 和 `textFile()`，您還必須提供 MIME 類型。
- 建立並將 `ContentPart` 物件傳遞給函式或方法，以便對附件參數進行自訂控制。

!!! note
    多模態內容支援因 [大型語言模型提供者](../../llm-providers.md) 而異。
    請查看提供者文件以瞭解支援的內容類型。

### 自動配置附件

如果您將 URL 或檔案路徑傳遞給附件函式或方法，Koog 會根據副檔名自動建構相應的附件參數。

包含文字訊息和自動配置附件列表的 `user` 訊息一般格式如下：

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

在 Kotlin 中，`+` 運算子會將文字內容連同附件一起新增至使用者訊息中。在 Java 中，請使用 `ContentPartsBuilder` 的 `text()` 方法。

### 自訂配置附件

[`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart) 介面讓您可以個別配置每個附件的參數。

所有附件都實作了 `ContentPart.Attachment` 介面。
您可以為每個附件建立特定實作的執行個體，配置其參數，並將其傳遞給 Kotlin 中相應的 `image()`、`audio()`、`video()` 或 `file()` 函式或 Java 中的方法。

包含文字訊息和自訂配置附件列表的 `user` 訊息一般格式如下：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.message.AttachmentContent
    import ai.koog.prompt.message.AttachmentSource
    val prompt = prompt("custom_image") {
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    user {
        +"Describe this image"
        image(
            AttachmentSource.Image(
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

Koog 為每種媒體類型提供了以下實作 `ContentPart.Attachment` 介面的專用類別：

- [`ContentPart.Image`](api:prompt-model::ai.koog.prompt.message.ContentPart.Image)：影像附件，例如 JPG 或 PNG 檔案。
- [`ContentPart.Audio`](api:prompt-model::ai.koog.prompt.message.ContentPart.Audio)：音訊附件，例如 MP3 或 WAV 檔案。
- [`ContentPart.Video`](api:prompt-model::ai.koog.prompt.message.ContentPart.Video)：影片附件，例如 MP4 或 AVI 檔案。
- [`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File)：檔案附件，例如 PDF 或 TXT 檔案。

所有 `ContentPart.Attachment` 型別都接受以下參數：

| 名稱       | 資料型別                                                                                                          | 必要 | 說明                                                                                                                                                                                                                             |
|------------|--------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](api:prompt-model::ai.koog.prompt.message.AttachmentContent) | 是      | 提供的檔案內容來源。                                                                                                                                                                                                |
| `format`   | String                                                                                                             | 是      | 提供的檔案格式。例如 `png`。                                                                                                                                                                                    |
| `mimeType` | String                                                                                                             | 僅適用於 `ContentPart.File`      | 提供的檔案 MIME 類型。<br/>對於 `ContentPart.Image`、`ContentPart.Audio` 和 `ContentPart.Video`，預設為 `<type>/<format>`（例如 `image/png`）。<br/>對於 `ContentPart.File`，必須明確提供。 |
| `fileName` | String?                                                                                                            | 否       | 提供的檔案名稱，包含副檔名。例如 `screenshot.png`。                                                                                                                                                   |

#### 附件內容

`AttachmentContent` 介面的實作定義了作為大型語言模型輸入提供的內容類型與來源：

- [`AttachmentContent.URL`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.URL) 定義所提供內容的 URL：
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
    <!--- KNIT example-multimodal-content-01.txt -->

- [`AttachmentContent.Binary.Bytes`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary) 將檔案內容定義為位元組陣列：
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
    <!--- KNIT example-multimodal-content-02.txt -->

- [`AttachmentContent.Binary.Base64`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary) 將檔案內容定義為包含檔案資料的 Base64 編碼字串：
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
    <!--- KNIT example-multimodal-content-03.txt -->

- [`AttachmentContent.PlainText`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.PlainText) 將檔案內容定義為純文字（僅限 [`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File)）：
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
    <!--- KNIT example-multimodal-content-04.txt -->

### 混合附件

除了在個別提示或訊息中提供不同類型的附件外，您還可以在單個 `user()` 訊息中提供多種且混合類型的附件：

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

## 後續步驟

- 如果您只使用單個大型語言模型提供者，請使用 [大型語言模型用戶端](../llm-clients.md) 執行提示。
- 如果您使用多個大型語言模型提供者，請使用 [提示執行器](../prompt-executors.md) 執行提示。