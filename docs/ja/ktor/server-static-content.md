[//]: # (title: 静的コンテンツの提供)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files">static-files</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources">static-resources</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip">static-zip</a>
</p>
</tldr>

<link-summary>
スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。
</link-summary>

ウェブサイトを構築している場合でも、HTTPエンドポイントを作成している場合でも、アプリケーションはスタイルシート、スクリプト、画像などのファイルを提供する必要があるでしょう。
Ktorでファイルのコンテンツをロードし、クライアントに[応答として送信](server-responses.md)することは確かに可能ですが、Ktorは静的コンテンツを提供するための追加機能を提供することで、このプロセスを簡素化します。

Ktorを使用すると、[フォルダ](#folders)、[ZIPファイル](#zipped)、[埋め込みアプリケーションリソース](#resources)からコンテンツを提供できます。

## フォルダ {id="folders"}

ローカルファイルシステムから静的ファイルを提供するには、[`staticFiles()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-files.html)関数を使用します。この場合、相対パスは現在の作業ディレクトリを使用して解決されます。

 ```kotlin
 routing {
     staticFiles("/resources", File("files"))
 }
 ```

上記の例では、`/resources` からのすべてのリクエストは、現在の作業ディレクトリ内の物理フォルダ `files` にマッピングされます。
Ktorは、URLパスと物理ファイル名が一致する限り、`files` から任意のファイルを再帰的に提供します。

完全な例については、[static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)を参照してください。

## ZIPファイル {id="zipped"}

ZIPファイルから静的コンテンツを提供するために、Ktorは[`staticZip()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-zip.html)関数を提供します。これにより、以下の例に示すように、リクエストをZIPアーカイブのコンテンツに直接マッピングできます。

 ```kotlin
 routing {
     staticZip("/", "", Paths.get("files/text-files.zip"))
 }
 ```

この例では、ルートURL `/` からのすべてのリクエストは、ZIPファイル `text-files.zip` のコンテンツに直接マッピングされます。

### 自動リロードのサポート {id="zip-auto-reload"}

`staticZip()` 関数は自動リロードもサポートしています。ZIPファイルの親ディレクトリで変更が検出された場合、次のリクエストでZIPファイルシステムがリロードされます。これにより、サーバーの再起動を必要とせずに、提供されるコンテンツが最新の状態に保たれます。

完全な例については、[static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)を参照してください。

## リソース {id="resources"}

クラスパスからコンテンツを提供するには、[`staticResources()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-resources.html)関数を使用します。

```kotlin
routing {
    staticResources("/resources", "static")
}
```

これは、`/resources` からのすべてのリクエストを、アプリケーションリソース内の `static` パッケージにマッピングします。
この場合、Ktorは、URLパスとリソースへのパスが一致する限り、`static` パッケージから任意のファイルを再帰的に提供します。

完全な例については、[static-resources](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)を参照してください。

## 追加設定 {id="configuration"}

Ktorは、静的ファイルとリソースに対してより多くの設定を提供します。

### インデックスファイル {id="index"}

`index.html` という名前のファイルが存在する場合、Ktorはディレクトリがリクエストされたときにデフォルトでそれをサービス提供します。`index` パラメータを使用してカスタムインデックスファイルを指定できます。

```kotlin
staticResources("/custom", "static", index = "custom_index.html")
```

この場合、`/custom` がリクエストされると、Ktorは `/custom_index.html` を提供します。

### 事前圧縮ファイル {id="precompressed"}

Ktorは、事前圧縮ファイルを提供し、[動的圧縮](server-compression.md)の使用を避ける機能を提供します。この機能を使用するには、`preCompressed()` 関数をブロックステートメント内に定義します。

```kotlin
staticFiles("/", File("files")) {
    preCompressed(CompressedFileType.BROTLI, CompressedFileType.GZIP)
}
```

この例では、`/js/script.js` へのリクエストに対して、Ktorは `/js/script.js.br` または `/js/script.js.gz` を提供できます。

### HEADリクエスト {id="autohead"}

`enableAutoHeadResponse()` 関数を使用すると、`GET` が定義されている静的ルート内のすべてのパスに対する `HEAD` リクエストに自動的に応答できます。

```kotlin
staticResources("/", "static"){
    enableAutoHeadResponse()
}
```

### デフォルトファイル応答 {id="default-file"}

`default()` 関数は、対応するファイルがない静的ルート内の任意のリクエストに対してファイルで応答する機能を提供します。

```kotlin
staticFiles("/", File("files")) {
    default("index.html")
}
```

この例では、クライアントが存在しないリソースをリクエストした場合、`index.html` ファイルが応答として提供されます。

### コンテンツタイプ {id="content-type"}

デフォルトでは、Ktorはファイル拡張子から `Content-Type` ヘッダーの値を推測しようとします。`contentType()` 関数を使用して、`Content-Type` ヘッダーを明示的に設定できます。

```kotlin
staticFiles("/files", File("textFiles")) {
    contentType { file ->
        when (file.name) {
            "html-file.txt" -> ContentType.Text.Html
            else -> null
        }
    }
}
```

この例では、`html-file.txt` ファイルへの応答には `Content-Type: text/html` ヘッダーが含まれ、他のすべてのファイルにはデフォルトの動作が適用されます。

### キャッシング {id="caching"}

`cacheControl()` 関数を使用すると、HTTPキャッシングのための `Cache-Control` ヘッダーを設定できます。

```kotlin
fun Application.module() {
    routing {
        staticFiles("/files", File("textFiles")) {
            cacheControl { file ->
                when (file.name) {
                    "file.txt" -> listOf(Immutable, CacheControl.MaxAge(10000))
                    else -> emptyList()
                }
            }
        }
    }
}
object Immutable : CacheControl(null) {
    override fun toString(): String = "immutable"
}
```

[`ConditionalHeaders`](server-conditional-headers.md)プラグインがインストールされている場合、Ktorは静的リソースを `ETag` および `LastModified` ヘッダーとともに提供し、条件付きヘッダーを処理して、最後の要求以降に変更がない場合にコンテンツの本体を送信しないようにすることができます。

```kotlin
staticFiles("/filesWithEtagAndLastModified", filesDir) {
    etag { resource -> EntityTagVersion("etag") }
    lastModified { resource -> GMTDate() }
}
```

この例では、`etag` と `lastModified` の値は、各リソースに基づいて動的に計算され、応答に適用されます。

`ETag` 生成を簡素化するために、事前定義されたプロバイダーを使用することもできます。

```kotlin
staticFiles("/filesWithStrongGeneratedEtag", filesDir) {
    etag(ETagProvider.StrongSha256)
}
```

この例では、リソースコンテンツのSHA‑256ハッシュを使用して強力な `ETag` が生成されます。I/Oエラーが発生した場合、`ETag` は生成されません。

> Ktorでのキャッシングに関する詳細については、[キャッシングヘッダー](server-caching-headers.md)を参照してください。
>
{style="tip"}

### 除外ファイル {id="exclude"}

`exclude()` 関数を使用すると、提供されるファイルから特定のファイルを除外できます。除外されたファイルがクライアントによってリクエストされた場合、サーバーは `403 Forbidden` ステータスコードで応答します。

```kotlin
staticFiles("/files", File("textFiles")) {
    exclude { file -> file.path.contains("excluded") }
}
```

### ファイル拡張子のフォールバック {id="extensions"}

リクエストされたファイルが見つからない場合、Ktorはファイル名に指定された拡張子を追加して検索できます。

```kotlin
staticResources("/", "static"){
    extensions("html", "htm")
}
```

この例では、`/index` がリクエストされると、Ktorは `/index.html` を検索し、見つかったコンテンツを提供します。

### カスタムフォールバック

リクエストされた静的リソースが見つからない場合のカスタムフォールバック動作を設定するには、`fallback()` 関数を使用します。
`fallback()` を使用すると、リクエストされたパスを検査し、どのように応答するかを決定できます。例えば、別のリソースにリダイレクトしたり、特定のHTTPステータスを返したり、代替ファイルを提供したりすることができます。

`fallback()` は、`staticFiles()`、`staticResources()`、`staticZip()`、または `staticFileSystem()` の内部に追加できます。このコールバックは、リクエストされたパスと現在の `ApplicationCall` を提供します。

以下の例は、特定の拡張子をリダイレクトしたり、カスタムステータスを返したり、`index.html` にフォールバックしたりする方法を示しています。

```kotlin
staticFiles("/files", File("textFiles")) {
    fallback { requestedPath, call ->
        when {
            requestedPath.endsWith(".php") -> call.respondRedirect("/static/index.html") // absolute path
            requestedPath.endsWith(".kt") -> call.respondRedirect("Default.kt") // relative path
            requestedPath.endsWith(".xml") -> call.respond(HttpStatusCode.Gone)
            else -> call.respondFile(File("files/index.html"))
        }
    }
}
```

### カスタム変更 {id="modify"}

`modify()` 関数を使用すると、結果の応答にカスタム変更を適用できます。

```kotlin
staticFiles("/", File("files")) {
    modify { file, call ->
        call.response.headers.append(HttpHeaders.ETag, file.name.toString())
    }
}
```

## エラー処理 {id="errors"}

リクエストされたコンテンツが見つからない場合、Ktorは自動的に `404 Not Found` HTTPステータスコードで応答します。

エラー処理の設定方法については、[ステータスページ](server-status-pages.md)を参照してください。