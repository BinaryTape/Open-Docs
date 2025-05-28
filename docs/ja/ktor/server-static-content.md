[//]: # (title: 静的コンテンツの配信)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files">static-files</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources">static-resources</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip">static-zip</a>
</p>
</tldr>

<link-summary>
スタイルシート、スクリプト、画像などの静的コンテンツを配信する方法を学びます。
</link-summary>

ウェブサイトを構築している場合でも、HTTPエンドポイントを作成している場合でも、アプリケーションでスタイルシート、スクリプト、画像などのファイルを配信する必要があるでしょう。
Ktorでファイルの内容をロードし、クライアントに[レスポンスとして送信](server-responses.md)することも確かに可能ですが、Ktorは静的コンテンツを配信するための追加機能を提供することで、このプロセスを簡素化します。

Ktorでは、[フォルダー](#folders)、[ZIPファイル](#zipped)、[組み込みアプリケーションリソース](#resources)からコンテンツを配信できます。

## フォルダー {id="folders"}

ローカルファイルシステムから静的ファイルを配信するには、[`staticFiles()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-files.html)関数を使用します。この場合、相対パスは現在の作業ディレクトリを使用して解決されます。

 ```kotlin
 ```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="10-11,35"}

上記の例では、`/resources`からのすべてのリクエストは、現在の作業ディレクトリ内の`files`物理フォルダーにマップされます。
Ktorは、URLパスと物理ファイル名が一致する限り、`files`からすべてのファイルを再帰的に配信します。

完全な例については、[static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)を参照してください。

## ZIPファイル {id="zipped"}

ZIPファイルから静的コンテンツを配信するために、Ktorは[`staticZip()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-zip.html)関数を提供します。これにより、以下の例に示すように、リクエストをZIPアーカイブの内容に直接マップできます。

 ```kotlin
 ```

{src="snippets/static-zip/src/main/kotlin/com/example/Application.kt" include-lines="10,12,20"}

この例では、ルートURL`/`からのすべてのリクエストは、ZIPファイル`text-files.zip`の内容に直接マップされます。

### 自動リロードのサポート {id="zip-auto-reload"}

`staticZip()`関数は自動リロードもサポートしています。ZIPファイルの親ディレクトリで変更が検出された場合、次回のリクエストでZIPファイルシステムがリロードされます。これにより、サーバーを再起動することなく、配信されるコンテンツが最新の状態に保たれます。

完全な例については、[static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)を参照してください。

## リソース {id="resources"}

クラスパスからコンテンツを配信するには、[`staticResources()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-resources.html)関数を使用します。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="8,9,17"}

これにより、`/resources`からのすべてのリクエストがアプリケーションリソース内の`static`パッケージにマップされます。
この場合、Ktorは、URLパスとリソースへのパスが一致する限り、`static`パッケージからすべてのファイルを再帰的に配信します。

完全な例については、[static-resources](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)を参照してください。

## 追加設定 {id="configuration"}

Ktorは、静的ファイルとリソースに対するより多くの設定を提供します。

### インデックスファイル {id="index"}

`index.html`という名前のファイルが存在する場合、ディレクトリがリクエストされたときに、Ktorはデフォルトでそれを配信します。`index`パラメーターを使用してカスタムインデックスファイルを設定できます。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="10"}

この場合、`/custom`がリクエストされると、Ktorは`/custom_index.html`を配信します。

### 事前圧縮ファイル {id="precompressed"}

Ktorは、事前圧縮ファイルを配信し、[動的圧縮](server-compression.md)の使用を回避する機能を提供します。この機能を使用するには、ブロックステートメント内で`preCompressed()`関数を定義します。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12,14,18"}

この例では、`/js/script.js`へのリクエストに対して、Ktorは`/js/script.js.br`または`/js/script.js.gz`を配信できます。

### HEADリクエスト {id="autohead"}

`enableAutoHeadResponse()`関数を使用すると、`GET`が定義されている静的ルート内のすべてのパスに対して`HEAD`リクエストに自動的に応答できます。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="11,13,16"}

### デフォルトファイルレスポンス {id="default-file"}

`default()`関数は、対応するファイルがない静的ルート内のすべてのリクエストに対してファイルで応答する機能を提供します。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12-13,18"}

この例では、クライアントが存在しないリソースをリクエストした場合、`index.html`ファイルがレスポンスとして配信されます。

### コンテンツタイプ {id="content-type"}

デフォルトでは、Ktorはファイル拡張子から`Content-Type`ヘッダーの値を推測しようとします。`contentType()`関数を使用して`Content-Type`ヘッダーを明示的に設定できます。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="19,22-27,34"}

この例では、`html-file.txt`ファイルのレスポンスには`Content-Type: text/html`ヘッダーが含まれ、他のすべてのファイルにはデフォルトの動作が適用されます。

### キャッシュ {id="caching"}

`cacheControl()`関数を使用すると、HTTPキャッシュ用の`Cache-Control`ヘッダーを設定できます。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="9-10,19,28-36,38-40"}

> Ktorでのキャッシュに関する詳細については、[キャッシュヘッダー](server-caching-headers.md)を参照してください。
>
{style="tip"}

### 除外ファイル {id="exclude"}

`exclude()`関数を使用すると、配信されるファイルを除外できます。クライアントから除外されたファイルがリクエストされた場合、サーバーは`403 Forbidden`ステータスコードで応答します。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="19,21,34"}

### ファイル拡張子のフォールバック {id="extensions"}

リクエストされたファイルが見つからない場合、Ktorはファイル名に指定された拡張子を追加して検索できます。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="11,12,16"}

この例では、`/index`がリクエストされた場合、Ktorは`/index.html`を検索し、見つかったコンテンツを配信します。

### カスタム変更 {id="modify"}

`modify()`関数を使用すると、結果のレスポンスにカスタム変更を適用できます。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12,15-18"}

## エラー処理 {id="errors"}

リクエストされたコンテンツが見つからない場合、Ktorは自動的に`404 Not Found`HTTPステータスコードで応答します。

エラー処理の設定方法を学ぶには、[ステータス・ページ](server-status-pages.md)を参照してください。