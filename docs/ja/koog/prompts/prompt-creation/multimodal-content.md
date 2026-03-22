# マルチモーダルコンテンツ

マルチモーダルコンテンツとは、テキスト、画像、音声、ビデオ、ファイルなど、異なる種類のコンテンツを指します。
Koog を使用すると、テキストと共に、`user` メッセージ内で画像、音声、ビデオ、ファイルを LLM に送信できます。
これらは、Kotlin の対応する関数、または Java のメソッドを使用することで `user` メッセージに追加できます。

- `image()`: 画像（JPG、PNG、WebP、GIF）を添付します。
- `audio()`: 音声ファイル（MP3、WAV、FLAC）を添付します。
- `video()`: ビデオファイル（MP4、AVI、MOV）を添付します。
- `file()` / `binaryFile()` / `textFile()`: ドキュメント（PDF、TXT、MDなど）を添付します。

各関数またはメソッドは添付パラメータを構成する 2 つの方法をサポートしているため、以下が可能です：

- 関数またはメソッドに URL またはファイルパスを渡すと、添付パラメータが自動的に処理されます。`file()`、`binaryFile()`、および `textFile()` の場合は、MIME タイプも指定する必要があります。
- 添付パラメータをカスタム制御するために、`ContentPart` オブジェクトを作成して関数またはメソッドに渡します。

!!! note
    マルチモーダルコンテンツのサポート状況は [LLM プロバイダー](../../llm-providers.md)によって異なります。
    サポートされているコンテンツタイプについては、プロバイダーのドキュメントを確認してください。

### 自動設定された添付

添付関数またはメソッドに URL またはファイルパスを渡すと、Koog はファイル拡張子に基づいて対応する添付パラメータを自動的に構築します。

テキストメッセージと自動設定された添付のリストを含む `user` メッセージの一般的な形式は次のとおりです。

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

Kotlin では、`+` 演算子が添付と共にテキストコンテンツをユーザーメッセージに追加します。Java では、`ContentPartsBuilder` の `text()` メソッドを使用します。

### カスタム設定された添付

[`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart) インターフェースを使用すると、各添付のパラメータを個別に構成できます。

すべての添付は `ContentPart.Attachment` インターフェースを実装しています。
添付ごとに特定の実装のインスタンスを作成し、そのパラメータを構成して、Kotlin の対応する `image()`、`audio()`、`video()`、または `file()` 関数、あるいは Java のメソッドに渡すことができます。

テキストメッセージとカスタム設定された添付のリストを含む `user` メッセージの一般的な形式は次のとおりです。

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

Koog は、`ContentPart.Attachment` インターフェースを実装する、各メディアタイプ向けの以下の特化されたクラスを提供しています。

- [`ContentPart.Image`](api:prompt-model::ai.koog.prompt.message.ContentPart.Image): JPG や PNG ファイルなどの画像添付。
- [`ContentPart.Audio`](api:prompt-model::ai.koog.prompt.message.ContentPart.Audio): MP3 や WAV ファイルなどの音声添付。
- [`ContentPart.Video`](api:prompt-model::ai.koog.prompt.message.ContentPart.Video): MP4 や AVI ファイルなどのビデオ添付。
- [`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File): PDF や TXT ファイルなどのファイル添付。

すべての `ContentPart.Attachment` タイプは、以下のパラメータを受け入れます。

| 名前 | データ型 | 必須 | 説明 |
|------------|--------------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `content`  | [AttachmentContent](api:prompt-model::ai.koog.prompt.message.AttachmentContent) | はい | 提供されたファイルコンテンツのソース。 |
| `format`   | String | はい | 提供されたファイルのフォーマット。例：`png`。 |
| `mimeType` | String | `ContentPart.File` のみ | 提供されたファイルの MIME タイプ。<br/>`ContentPart.Image`、`ContentPart.Audio`、および `ContentPart.Video` の場合、デフォルトは `<type>/<format>`（例：`image/png`）になります。<br/>`ContentPart.File` の場合、明示的に指定する必要があります。 |
| `fileName` | String? | いいえ | 拡張子を含む、提供されたファイルの名前。例：`screenshot.png`。 |

#### 添付コンテンツ

AttachmentContent インターフェースの実装は、LLM への入力として提供されるコンテンツのタイプとソースを定義します。

- [`AttachmentContent.URL`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.URL) は、提供されたコンテンツの URL を定義します。
    ```kotlin
    AttachmentContent.URL("https://example.com/image.png")
    ```
    <!--- KNIT example-multimodal-content-01.txt -->

- [`AttachmentContent.Binary.Bytes`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary) は、ファイルコンテンツをバイト配列として定義します。
    ```kotlin
    AttachmentContent.Binary.Bytes(byteArrayOf(/* ... */))
    ```
    <!--- KNIT example-multimodal-content-02.txt -->

- [`AttachmentContent.Binary.Base64`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.Binary) は、ファイルデータを含む Base64 エンコードされた文字列としてファイルコンテンツを定義します。
    ```kotlin
    AttachmentContent.Binary.Base64("iVBORw0KGgoAAAANS...")
    ```
    <!--- KNIT example-multimodal-content-03.txt -->

- [`AttachmentContent.PlainText`](api:prompt-model::ai.koog.prompt.message.AttachmentContent.PlainText) は、ファイルコンテンツをプレーンテキストとして定義します（[`ContentPart.File`](api:prompt-model::ai.koog.prompt.message.ContentPart.File) のみ）。
    ```kotlin
    AttachmentContent.PlainText("This is the file content.")
    ```
    <!--- KNIT example-multimodal-content-04.txt -->

### 混合添付

異なる種類の添付を個別のプロンプトやメッセージで提供するだけでなく、単一の `user()` メッセージ内で複数の混合した種類の添付を提供することもできます。

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

## 次のステップ

- 単一の LLM プロバイダーを使用する場合は、[LLM クライアント](../llm-clients.md)でプロンプトを実行します。
- 複数の LLM プロバイダーを使用する場合は、[プロンプトエグゼキューター](../prompt-executors.md)でプロンプトを実行します。