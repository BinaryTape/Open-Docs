# マルチモーダルコンテンツ

マルチモーダルコンテンツとは、テキスト、画像、音声、動画、ファイルなど、さまざまな種類のコンテンツを指します。
Koogでは、`user`メッセージ内でテキストとともに画像、音声、動画、ファイルをLLMに送信できます。
対応する関数を使用することで、これらを`user`メッセージに追加できます。

- `image()`: 画像（JPG、PNG、WebP、GIF）を添付します。
- `audio()`: 音声ファイル（MP3、WAV、FLAC）を添付します。
- `video()`: 動画ファイル（MP4、AVI、MOV）を添付します。
- `file()` / `binaryFile()` / `textFile()`: ドキュメント（PDF、TXT、MDなど）を添付します。

各関数は、添付パラメータを設定する2つの方法をサポートしています。そのため、以下のいずれかの方法で設定できます。

- 関数にURLまたはファイルパスを渡すと、添付パラメータが自動的に処理されます。`file()`、`binaryFile()`、および`textFile()`の場合、MIMEタイプも提供する必要があります。
- `ContentPart`オブジェクトを作成して関数に渡し、添付パラメータをカスタム制御します。

!!! note
    マルチモーダルコンテンツのサポートは、[LLMプロバイダー](../llm-providers.md)によって異なります。
    サポートされているコンテンツタイプについては、プロバイダーのドキュメントを確認してください。

### 自動設定される添付ファイル

添付関数にURLまたはファイルパスを渡すと、Koogはファイル拡張子に基づいて対応する添付パラメータを自動的に構築します。

テキストメッセージと自動設定される添付ファイルのリストを含む`user`メッセージの一般的な形式は次のとおりです。

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

`+`演算子は、添付ファイルとともにテキストコンテンツをユーザーメッセージに追加します。

### カスタム設定される添付ファイル

[`ContentPart`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/index.html)インターフェースを使用すると、各添付ファイルのパラメータを個別に設定できます。

すべての添付ファイルは`ContentPart.Attachment`インターフェースを実装しています。
各添付ファイルに特定の具象クラスのインスタンスを作成し、そのパラメータを設定して、対応する`image()`、`audio()`、`video()`、または`file()`関数に渡すことができます。

テキストメッセージとカスタム設定される添付ファイルのリストを含む`user`メッセージの一般的な形式は次のとおりです。

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

Koogは、`ContentPart.Attachment`インターフェースを実装する各メディアタイプに対して、以下の特殊なクラスを提供します。

- [`ContentPart.Image`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-image/index.html): JPGやPNGファイルなどの画像添付ファイル。
- [`ContentPart.Audio`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-audio/index.html): MP3やWAVファイルなどの音声添付ファイル。
- [`ContentPart.Video`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-video/index.html): MP4やAVIファイルなどの動画添付ファイル。
- [`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html): PDFやTXTファイルなどのファイル添付ファイル。

すべての`ContentPart.Attachment`タイプは、以下のパラメータを受け入れます。

| 名前       | データ型                                                                                                          | 必須 | 説明                                                                                                                                                                                                                             |
|------------|--------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/index.html) | はい      | 提供されるファイルコンテンツのソース。                                                                                                                                                                                                |
| `format`   | String                                                                                                             | はい      | 提供されるファイルのフォーマット。例えば、`png`。                                                                                                                                                                                    |
| `mimeType` | String                                                                                                             | `ContentPart.File`のみ      | 提供されるファイルのMIMEタイプ。<br/>`ContentPart.Image`、`ContentPart.Audio`、および`ContentPart.Video`の場合、デフォルトは`<type>/<format>`（例:`image/png`）です。<br/>`ContentPart.File`の場合、明示的に指定する必要があります。 |
| `fileName` | String?                                                                                                            | いいえ       | 拡張子を含む提供されるファイルの名前。例えば、`screenshot.png`。                                                                                                                                                   |

#### 添付コンテンツ

`AttachmentContent`インターフェースの実装は、LLMに入力として提供されるコンテンツのタイプとソースを定義します。

- [`AttachmentContent.URL`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-u-r-l/index.html) は、提供されるコンテンツのURLを定義します。
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
- [`AttachmentContent.Binary.Bytes`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html) は、ファイルコンテンツをバイト配列として定義します。
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```

- [`AttachmentContent.Binary.Base64`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-binary/index.html) は、ファイルデータを含むBase64エンコードされた文字列としてファイルコンテンツを定義します。
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```

- [`AttachmentContent.PlainText`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-attachment-content/-plain-text/index.html) は、ファイルコンテンツをプレーンテキストとして定義します（[`ContentPart.File`](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.message/-content-part/-file/index.html)のみ）。
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```

### 混合添付ファイル

個別のプロンプトやメッセージで異なる種類の添付ファイルを提供するだけでなく、単一の`user()`メッセージ内で複数の混合タイプの添付ファイルを提供することもできます。

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

## 次のステップ

- 単一のLLMプロバイダーを使用している場合は、[LLMクライアント](../llm-clients.md)でプロンプトを実行します。
- 複数のLLMプロバイダーを使用している場合は、[プロンプトエグゼキュータ](../prompt-executors.md)でプロンプトを実行します。