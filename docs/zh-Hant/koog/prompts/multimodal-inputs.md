# 多模態輸入

除了文字訊息外，Koog 也讓您可以在 `user` 訊息中向 LLM 傳送圖片、音訊、視訊和檔案。
您可以使用對應的函式將這些附件新增至 `user` 訊息：

- `image()`: 新增圖片 (JPG, PNG, WebP, GIF)。
- `audio()`: 新增音訊檔 (MP3, WAV, FLAC)。
- `video()`: 新增視訊檔 (MP4, AVI, MOV)。
- `file()` / `binaryFile()` / `textFile()`: 新增文件 (PDF, TXT, MD, 等)。

每個函式都支援兩種配置媒體內容參數的方式，因此您可以：

- 將 URL 或檔案路徑傳遞給函式，它會自動處理媒體內容參數。
- 建立並傳遞 `ContentPart` 物件給函式，以自訂控制媒體內容參數。

### 自動配置的附件

如果您將 URL 或檔案路徑傳遞給 `image()`、`audio()`、`video()` 或 `file()` 函式，Koog 會根據檔案副檔名自動建構
對應的媒體內容參數。

包含文字訊息和自動配置附件列表的 `user` 訊息的一般格式如下所示：

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
    +"描述這些圖片："

    image("https://example.com/test.png")
    image(Path("/User/koog/image.png"))

    +"聚焦於主要內容。"
}
```
<!--- KNIT example-multimodal-inputs-01.kt -->

`+` 運算子會將文字內容連同媒體附件新增到 `user` 訊息中。

### 自訂配置的附件

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html) 類別讓您可以針對每個附件個別配置媒體內容參數。

您可以為每個附件建立一個 `ContentPart` 物件，配置其參數，
然後將其傳遞給對應的 `image()`、`audio()`、`video()` 或 `file()` 函式。

包含文字訊息和自訂配置附件列表的 `user` 訊息的一般格式如下所示：

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
<!--- KNIT example-multimodal-inputs-02.kt -->

Koog 為每種媒體類型提供了專用的 `ContentPart` 類別：

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): 圖片附件，例如 JPG 或 PNG 檔案。
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): 音訊附件，例如 MP3 或 WAV 檔案。
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): 視訊附件，例如 MP4 或 AVI 檔案。
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): 檔案附件，例如 PDF 或 TXT 檔案。

所有 `ContentPart` 類型都接受以下參數：

| 名稱       | 資料類型                               | 必填                    | 描述                                                                                               |
|------------|-----------------------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | 是                         | 所提供檔案內容的來源。 |
| `format`   | String                                  | 是                         | 所提供檔案的格式。例如，`png`。                                                      |
| `mimeType` | String                                  | 僅適用於 `ContentPart.File` | 所提供檔案的 MIME 類型。例如，`image/png`。                                             |
| `fileName` | String                                  | 否                          | 所提供檔案的名稱，包含副檔名。例如，`screenshot.png`。                     |

#### 附件內容

`AttachmentContent` 定義了作為 LLM 輸入提供的內容類型和來源：

- 所提供內容的 URL：
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)。

- 檔案內容作為位元組陣列：
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

- 檔案內容作為 Base64 編碼的字串，包含檔案資料：
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)。

- 檔案內容作為純文字 (僅適用於 `ContentPart.File`)：

    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
  另請參閱 [API 參考](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)。

### 混合附件

除了在單獨的提示或訊息中提供不同類型的附件外，您也可以在單一的 `user` 訊息中提供多種混合類型的附件：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import kotlinx.io.files.Path
-->
```kotlin
val prompt = prompt("mixed_content") {
    system("您是一位樂於助人的助理。")

    user {
        +"比較圖片與文件內容。"
        image(Path("/User/koog/page.png"))
        binaryFile(Path("/User/koog/page.pdf"), "application/pdf")
        +"將結果以表格形式呈現"
    }
}
```
<!--- KNIT example-multimodal-inputs-03.kt -->

## 後續步驟

- 如果您使用單一 LLM 供應商，請使用 [LLM 客戶端](llm-clients.md)執行提示。
- 如果您使用多個 LLM 供應商，請使用 [提示執行器](prompt-executors.md)執行提示。