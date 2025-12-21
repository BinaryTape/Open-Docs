# 多模态输入

除了文本消息，Koog 还允许你在 `user` 消息中向 LLM 发送图片、音频、视频和文件。
你可以通过使用以下相应函数将这些附件添加到 `user` 消息中：

- `image()`: 添加图片 (JPG, PNG, WebP, GIF)。
- `audio()`: 添加音频文件 (MP3, WAV, FLAC)。
- `video()`: 添加视频文件 (MP4, AVI, MOV)。
- `file()` / `binaryFile()` / `textFile()`: 添加文档 (PDF, TXT, MD 等)。

每个函数支持两种配置媒体内容参数的方式，因此你可以：

- 向函数传入 URL 或文件路径，它会自动处理媒体内容参数。
- 创建并传入一个 `ContentPart` 对象给函数，以便对媒体内容参数进行自定义控制。

### 自动配置的附件

如果你向 `image()`、`audio()`、`video()` 或 `file()` 函数传入 URL 或文件路径，Koog 会根据文件扩展名自动构建相应的媒体内容参数。

包含文本消息和自动配置附件列表的 `user` 消息的通用格式如下：

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
    image(Path("/User/koog/image.png"))

    +"Focus on the main subjects."
}
```
<!--- KNIT example-multimodal-inputs-01.kt -->

`+` 操作符会将文本内容以及媒体附件添加到用户消息中。

### 自定义配置的附件

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html) 类允许你为每个附件单独配置媒体内容参数。

你可以为每个附件创建一个 `ContentPart` 对象，配置其参数，然后将其传入相应的 `image()`、`audio()`、`video()` 或 `file()` 函数。

包含文本消息和自定义配置附件列表的 `user` 消息的通用格式如下：

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
<!--- KNIT example-multimodal-inputs-02.kt -->

Koog 为每种媒体类型提供了专门的 `ContentPart` 类：

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): 图片附件，例如 JPG 或 PNG 文件。
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): 音频附件，例如 MP3 或 WAV 文件。
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): 视频附件，例如 MP4 或 AVI 文件。
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): 文件附件，例如 PDF 或 TXT 文件。

所有 `ContentPart` 类型都接受以下参数：

| 名称       | 数据类型                               | 必需                    | 描述                                                                       |
|------------|-----------------------------------------|-----------------------------|----------------------------------------------------------------------------|
| `content`  | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | Yes                         | 所提供文件内容的来源。                                                     |
| `format`   | String                                  | Yes                         | 所提供文件的格式。例如，`png`。                                            |
| `mimeType` | String                                  | 仅适用于 `ContentPart.File` | 所提供文件的 MIME 类型。例如，`image/png`。                                |
| `fileName` | String                                  | No                          | 所提供文件的名称，包括扩展名。例如，`screenshot.png`。                     |

#### 附件内容

`AttachmentContent` 定义了作为 LLM 输入提供的内容的类型和来源：

- 所提供内容的 URL：
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)。

- 文件内容作为字节数组：
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

- 文件内容作为包含文件数据的 Base64 编码字符串：
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

- 文件内容作为纯文本（仅适用于 `ContentPart.File`）：

    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
  另请参见 [API 参考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)。

### 混合附件

除了在单独的 prompt 或消息中提供不同类型的附件外，你还可以在单个 `user` 消息中提供多种混合类型的附件：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("You are a helpful assistant.")

    user {
        +"Compare the image with the document content."
        image(Path("/User/koog/page.png"))
        binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        +"Structure the result as a table"
    }
}
```
<!--- KNIT example-multimodal-inputs-03.kt -->

## 后续步骤

- 如果你使用单个 LLM 提供商，请使用 [LLM 客户端](llm-clients.md) 运行 prompt。
- 如果你使用多个 LLM 提供商，请使用 [prompt 执行器](prompt-executors.md) 运行 prompt。