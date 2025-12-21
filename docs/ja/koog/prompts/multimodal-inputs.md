# マルチモーダル入力

テキストメッセージに加えて、Koogでは`user`メッセージ内でLLMに画像、音声、動画、ファイルを送信できます。
これらの添付ファイルは、対応する関数を使用して`user`メッセージに追加できます。

- `image()`: 画像（JPG、PNG、WebP、GIF）を追加します。
- `audio()`: 音声ファイル（MP3、WAV、FLAC）を追加します。
- `video()`: 動画ファイル（MP4、AVI、MOV）を追加します。
- `file()` / `binaryFile()` / `textFile()`: ドキュメント（PDF、TXT、MDなど）を追加します。

各関数は、メディアコンテンツのパラメーターを設定する2つの方法をサポートしており、以下のことができます。

- 関数にURLまたはファイルパスを渡すと、メディアコンテンツのパラメーターが自動的に処理されます。
- `ContentPart`オブジェクトを作成して関数に渡すことで、メディアコンテンツのパラメーターをカスタム制御できます。

### 自動設定される添付ファイル

`image()`、`audio()`、`video()`、`file()`関数のいずれかにURLまたはファイルパスを渡すと、Koogはファイル拡張子に基づいて対応するメディアコンテンツのパラメーターを自動的に構築します。

テキストメッセージと自動設定される添付ファイルのリストを含む`user`メッセージの一般的な形式は以下のとおりです。

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

`+`演算子は、メディア添付ファイルとともにテキストコンテンツをユーザーメッセージに追加します。

### カスタム設定される添付ファイル

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html)クラスを使用すると、各添付ファイルに対してメディアコンテンツのパラメーターを個別に設定できます。

各添付ファイルに対して`ContentPart`オブジェクトを作成し、そのパラメーターを設定して、対応する`image()`、`audio()`、`video()`、`file()`関数のいずれかに渡すことができます。

テキストメッセージとカスタム設定される添付ファイルのリストを含む`user`メッセージの一般的な形式は以下のとおりです。

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

Koogは、各メディアタイプに対して特殊な`ContentPart`クラスを提供します。

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): 画像添付ファイル（JPGやPNGファイルなど）。
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): 音声添付ファイル（MP3やWAVファイルなど）。
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): 動画添付ファイル（MP4やAVIファイルなど）。
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): ファイル添付ファイル（PDFやTXTファイルなど）。

すべての`ContentPart`タイプは以下のパラメーターを受け入れます。

| 名前       | データ型                                                                                             | 必須 | 説明                                                      |
|------------|------------------------------------------------------------------------------------------------------|------|-----------------------------------------------------------|
| `content`  | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | はい   | 提供されるファイルコンテンツのソース。                      |
| `format`   | String                                                                                               | はい   | 提供されるファイルのフォーマット。例: `png`。             |
| `mimeType` | String                                                                                               | `ContentPart.File`の場合のみ | 提供されるファイルのMIMEタイプ。例: `image/png`。         |
| `fileName` | String                                                                                               | いいえ   | 拡張子を含む、提供されるファイルの名前。例: `screenshot.png`。 |

#### 添付コンテンツ

`AttachmentContent`は、LLMへの入力として提供されるコンテンツのタイプとソースを定義します。

- 提供されるコンテンツのURL:
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
  [APIリファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html)も参照してください。

- ファイルコンテンツをバイト配列として:
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
  [APIリファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)も参照してください。

- ファイルコンテンツをBase64エンコードされた文字列として（ファイルデータを含む）:
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
  [APIリファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html)も参照してください。

- ファイルコンテンツをプレーンテキストとして（`ContentPart.File`のみ）:

    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
  [APIリファレンス](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html)も参照してください。

### 混合された添付ファイル

異なる種類の添付ファイルを別々のプロンプトやメッセージで提供することに加えて、単一の`user`メッセージ内で複数の混合された種類の添付ファイルも提供できます。

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

## 次のステップ

- 単一のLLMプロバイダーを使用している場合は、[LLMクライアント](llm-clients.md)でプロンプトを実行します。
- 複数のLLMプロバイダーを使用している場合は、[プロンプトエグゼキューター](prompt-executors.md)でプロンプトを実行します。