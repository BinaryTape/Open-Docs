# 多模态内容

多模态内容指的是不同类型的内容，例如文本、图像、音频、视频和文件。
Koog 允许您在 `user` 消息中，随同文本一起向 LLMs 发送图像、音频、视频和文件。
您可以通过使用相应的函数将它们添加到 `user` 消息中：

- `image()`: 附加图像（JPG、PNG、WebP、GIF）。
- `audio()`: 附加音频文件（MP3、WAV、FLAC）。
- `video()`: 附加视频文件（MP4、AVI、MOV）。
- `file()` / `binaryFile()` / `textFile()`: 附加文档（PDF、TXT、MD 等）。

每个函数都支持两种配置附件形参的方式，因此您可以：

- 将 URL 或文件路径传递给函数，它会自动处理附件形参。对于 `file()`、`binaryFile()` 和 `textFile()`，您还必须提供 MIME 类型。
- 创建 `ContentPart` 对象并将其传递给函数，以便自定义控制附件形参。

!!! note
    多模态内容支持因 [LLM 提供方](../llm-providers.md) 而异。
    请查阅提供方文档以了解支持的内容类型。

### 自动配置附件

如果您将 URL 或文件路径传递给附件函数，Koog 会根据文件扩展名自动构建相应的附件形参。

包含文本消息和自动配置附件列表的 `user` 消息的一般格式如下：

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

`+` 操作符将文本内容连同附件一起添加到 user 消息中。

### 自定义配置附件

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html) 接口允许您逐个配置每个附件的形参。

所有附件都实现了 `ContentPart.Attachment` 接口。您可以为每个附件创建一个特定实现的实例，配置其形参，然后将其传递给相应的 `image()`、`audio()`、`video()` 或 `file()` 函数。

包含文本消息和自定义配置附件列表的 `user` 消息的一般格式如下：

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

Koog 为每种媒体类型提供了以下实现 `ContentPart.Attachment` 接口的专用类：

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): 图像附件，例如 JPG 或 PNG 文件。
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): 音频附件，例如 MP3 或 WAV 文件。
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): 视频附件，例如 MP4 或 AVI 文件。
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): 文件附件，例如 PDF 或 TXT 文件。

所有 `ContentPart.Attachment` 类型都接受以下形参：

| 名称       | 数据类型                                                                                                          | 必需 | 描述                                                                                                                                                                                                                             |
|------------|--------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | 是      | 所提供文件内容的来源。                                                                                                                                                                                                                               |
| `format`   | String                                                                                                             | 是      | 所提供文件的格式。例如，`png`。                                                                                                                                                                                                                   |
| `mimeType` | String                                                                                                             | 仅适用于 `ContentPart.File`      | 所提供文件的 MIME 类型。<br/>对于 `ContentPart.Image`、`ContentPart.Audio` 和 `ContentPart.Video`，它默认为 `<type>/<format>`（例如，`image/png`）。<br/>对于 `ContentPart.File`，必须显式提供。 |
| `fileName` | String?                                                                                                            | 否       | 所提供文件的名称，包括扩展名。例如，`screenshot.png`。                                                                                                                                                   |

#### 附件内容

AttachmentContent 接口的实现定义了作为 LLM 输入的内容类型和来源：

- [`AttachmentContent.URL`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html) 定义了所提供内容的 URL：
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
- [`AttachmentContent.Binary.Bytes`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html) 将文件内容定义为字节数组：
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```

- [`AttachmentContent.Binary.Base64`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html) 将文件内容定义为包含文件数据的 Base64 编码字符串：
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```

- [`AttachmentContent.PlainText`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html) 将文件内容定义为纯文本（仅适用于 [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html)）：
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```

### 混合附件

除了在独立的提示或消息中提供不同类型的附件外，您还可以在单个 `user()` 消息中提供多个不同类型且混合的附件：

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

## 后续步骤

- 如果您使用单个 LLM 提供方，请通过 [LLM 客户端](../llm-clients.md) 运行提示。
- 如果您使用多个 LLM 提供方，请通过 [提示执行器](../prompt-executors.md) 运行提示。