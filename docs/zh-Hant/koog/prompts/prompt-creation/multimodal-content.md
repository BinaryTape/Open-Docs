# 多模態內容

多模態內容指的是不同類型的內容，例如文字、圖片、音訊、視訊和檔案。
Koog 讓您能夠在 `user` 訊息中，連同文字一起將圖片、音訊、視訊和檔案傳送給 LLM。您可以使用以下對應的函式將它們新增到 `user` 訊息中：

- `image()`: 附加圖片 (JPG、PNG、WebP、GIF)。
- `audio()`: 附加音訊檔案 (MP3、WAV、FLAC)。
- `video()`: 附加視訊檔案 (MP4、AVI、MOV)。
- `file()` / `binaryFile()` / `textFile()`: 附加文件 (PDF、TXT、MD 等)。

每個函式都支援兩種配置附件參數的方式，因此您可以：

- 將 URL 或檔案路徑傳遞給函式，它會自動處理附件參數。對於 `file()`、`binaryFile()` 和 `textFile()`，您還必須提供 MIME 類型。
- 建立 `ContentPart` 物件並將其傳遞給函式，以自訂控制附件參數。

!!! note
    多模態內容支援因 [LLM 供應商](../llm-providers.md) 而異。
    請查閱供應商文件以瞭解支援的內容類型。

### 自動配置的附件

如果您將 URL 或檔案路徑傳遞給附件函式，Koog 會根據檔案副檔名自動建構對應的附件參數。

包含文字訊息和自動配置附件列表的 `user` 訊息一般格式如下：

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
    +"描述這些圖片:"

    image("https://example.com/test.png")
    image(Path("/path/to/image.png"))

    +"專注於主要主題。"
}
```
<!--- KNIT example-multimodal-content-01.kt -->

`+` 運算子將文字內容連同附件新增到 user 訊息中。

### 自訂配置的附件

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html) 介面讓您可以單獨配置每個附件的參數。

所有附件都實作了 `ContentPart.Attachment` 介面。您可以為每個附件建立特定實作的實例，配置其參數，並將其傳遞給對應的 `image()`、`audio()`、`video()` 或 `file()` 函式。

包含文字訊息和自訂配置附件列表的 `user` 訊息一般格式如下：

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
    +"描述這張圖片"
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

Koog 為每個實作了 `ContentPart.Attachment` 介面的媒體類型提供了以下專用類別：

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): 圖片附件，例如 JPG 或 PNG 檔案。
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): 音訊附件，例如 MP3 或 WAV 檔案。
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): 視訊附件，例如 MP4 或 AVI 檔案。
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): 檔案附件，例如 PDF 或 TXT 檔案。

所有 `ContentPart.Attachment` 類型都接受以下參數：

| 名稱 | 資料類型 | 必填 | 說明 |
|---|---|---|---|
| `content` | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | 是 | 提供檔案內容的來源。 |
| `format` | String | 是 | 提供檔案的格式。例如，`png`。 |
| `mimeType` | String | 僅適用於 `ContentPart.File` | 提供檔案的 MIME 類型。<br/>對於 `ContentPart.Image`、`ContentPart.Audio` 和 `ContentPart.Video`，它預設為 `<type>/<format>` (例如，`image/png`)。<br/>對於 `ContentPart.File`，必須明確提供。 |
| `fileName` | String? | 否 | 提供檔案的名稱，包含副檔名。例如，`screenshot.png`。 |

#### 附件內容

AttachmentContent 介面的實作定義了作為 LLM 輸入提供的內容類型和來源：

- [`AttachmentContent.URL`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html) 定義了所提供內容的 URL：
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
- [`AttachmentContent.Binary.Bytes`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html) 將檔案內容定義為位元組陣列：
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```

- [`AttachmentContent.Binary.Base64`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html) 將檔案內容定義為包含檔案資料的 Base64 編碼字串：
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```

- [`AttachmentContent.PlainText`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html) 將檔案內容定義為純文字 (僅適用於 [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html))：
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```

### 混合附件

除了在不同的提示或訊息中提供不同類型的附件外，您還可以在單一 `user()` 訊息中提供多種類型和混合類型的附件：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("您是一位樂於助人的助理。")

    user {
        +"比較圖片與文件內容。"
        image(Path("/path/to/image.png"))
        binaryFile(Path("/path/to/page.pdf"), "application/pdf")
        +"將結果結構化為表格"
    }
}
```
<!--- KNIT example-multimodal-content-03.kt -->

## 後續步驟

- 如果您使用單一 LLM 供應商，請使用 [LLM 用戶端](../llm-clients.md) 執行提示。
- 如果您使用多個 LLM 供應商，請使用 [提示執行器](../prompt-executors.md) 執行提示。