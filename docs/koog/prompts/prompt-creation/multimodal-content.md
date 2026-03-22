# 多模态内容

多模态内容是指不同类型的内容，例如文本、图像、音频、视频和文件。
Koog 允许您在 `user` 消息中将图像、音频、视频和文件与文本一起发送给 LLM。
您可以通过使用 Kotlin 中对应的函数或 Java 中对应的方法将它们添加到 `user` 消息中：

- `image()`：附加图像（JPG、PNG、WebP、GIF）。
- `audio()`：附加音频文件（MP3、WAV、FLAC）。
- `video()`：附加视频文件（MP4、AVI、MOV）。
- `file()` / `binaryFile()` / `textFile()`：附加文档（PDF、TXT、MD 等）。

每种函数或方法都支持两种配置附件参数的方式，因此您可以：

- 向函数或方法传递一个 URL 或文件路径，它会自动处理附件参数。对于 `file()`、`binaryFile()` 和 `textFile()`，您还必须提供 MIME 类型。
- 创建并向函数或方法传递一个 `ContentPart` 对象，以便对附件参数进行自定义控制。

!!! note
    多模态内容支持因 [LLM 提供商](../../llm-providers.md)而异。
    请查阅提供商文档以了解支持的内容类型。

### 自动配置附件

如果您向附件函数或方法传递 URL 或文件路径，Koog 会根据文件扩展名自动构建相应的附件参数。

包含文本消息和自动配置附件列表的 `user` 消息通用格式如下：

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

在 Kotlin 中，`+` 运算符可将文本内容与附件一起添加到 `user` 消息中。在 Java 中，请使用 `ContentPartsBuilder` 的 `text()` 方法。

### 自定义配置附件

[`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart) 接口允许您分别为每个附件配置参数。

所有附件都实现了 `ContentPart.Attachment` 接口。
您可以为每个附件创建特定实现的实例，配置其参数，并将其传递给 Kotlin 中对应的 `image()`、`audio()`、`video()` 或 `file()` 函数或 Java 中对应的方法。

包含文本消息和自定义配置附件列表的 `user` 消息通用格式如下：

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

Koog 为每种媒体类型提供了以下实现了 `ContentPart.Attachment` 接口的专用类：

- [`ContentPart.Image`](api:prompt-model::ai.koog.prompt.message.ContentPart.Image)：图像附件，例如 JPG 或 PNG 文件。
- [`ContentPart.Audio`](api:prompt-model::ai.koog.prompt.message.ContentPart.Audio)：音频附件，例如 MP3 或 WAV 文件。
- [`ContentPart.Video`](api:prompt-model::ai.koog.prompt.message.ContentPart.Video)：视频附件，例如 MP4 或 AVI 文件。
- [`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File)：文件附件，例如 PDF 或 TXT 文件。

所有 `ContentPart.Attachment` 类型都接受以下参数：

| 名称 | 数据类型 | 必填 | 描述 |
|------------|--------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `content` | [AttachmentContent](api:prompt-model::ai.koog.prompt.message.AttachmentContent) | 是 | 所提供文件内容的来源。 |
| `format` | String | 是 | 所提供文件的格式。例如 `png`。 |
| `mimeType` | String | 仅限 `ContentPart.File` | 所提供文件的 MIME 类型。<br/>对于 `ContentPart.Image`、`ContentPart.Audio` 和 `ContentPart.Video`，其默认为 `<type>/<format>`（例如 `image/png`）。<br/>对于 `ContentPart.File`，必须显式提供该参数。 |
| `fileName` | String? | 否 | 所提供文件的名称，包括扩展名。例如 `screenshot.png`。 |

#### 附件内容

`AttachmentContent` 接口的实现定义了作为 LLM 输入提供的内容类型和来源：

- [`AttachmentContent.URL`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.URL) 定义了所提供内容的 URL：
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
    <!--- KNIT example-multimodal-content-01.txt -->

- [`AttachmentContent.Binary.Bytes`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary) 将文件内容定义为字节数组：
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
    <!--- KNIT example-multimodal-content-02.txt -->

- [`AttachmentContent.Binary.Base64`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary) 将文件内容定义为包含文件数据的 Base64 编码字符串：
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
    <!--- KNIT example-multimodal-content-03.txt -->

- [`AttachmentContent.PlainText`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.PlainText) 将文件内容定义为纯文本（仅限 [`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File)）：
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
    <!--- KNIT example-multimodal-content-04.txt -->

### 混合附件

除了在不同的提示词或消息中提供不同类型的附件外，您还可以在单个 `user()` 消息中提供多种且混合类型的附件：

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

## 下一步

- 如果您只使用单个 LLM 提供商，请使用 [LLM 客户端](../llm-clients.md)运行提示词。
- 如果您使用多个 LLM 提供商，请使用 [提示词执行器](../prompt-executors.md)运行提示词。