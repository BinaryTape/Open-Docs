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
Ktorでファイルの内容を読み込み、クライアントに[レスポンスとして送信する](server-responses.md)ことは確かに可能ですが、Ktorは静的コンテンツを提供するための追加機能を提供することで、このプロセスを簡素化します。

Ktorでは、[フォルダー](#folders)、[ZIPファイル](#zipped)、[組み込みアプリケーションリソース](#resources)からコンテンツを提供できます。

## フォルダー {id="folders"}

ローカルファイルシステムから静的ファイルを提供するには、[`staticFiles()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-files.html)関数を使用します。この場合、相対パスは現在の作業ディレクトリを使用して解決されます。

 [object Promise]

上記の例では、`/resources`からのすべてのリクエストは、現在の作業ディレクトリ内の物理フォルダー`files`にマッピングされます。
Ktorは、URLパスと物理ファイル名が一致する限り、`files`から任意のファイルを再帰的に提供します。

完全な例については、[static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)を参照してください。

## ZIPファイル {id="zipped"}

ZIPファイルから静的コンテンツを提供するために、Ktorは[`staticZip()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-zip.html)関数を提供します。
これにより、以下の例に示すように、リクエストをZIPアーカイブのコンテンツに直接マッピングできます。

 [object Promise]

この例では、ルートURL `/`からのすべてのリクエストが、ZIPファイル`text-files.zip`のコンテンツに直接マッピングされます。

### 自動リロードのサポート {id="zip-auto-reload"}

`staticZip()`関数は、自動リロードもサポートしています。ZIPファイルの親ディレクトリで変更が検出された場合、次回のリクエスト時にZIPファイルシステムがリロードされます。これにより、サーバーの再起動を必要とせずに、提供されるコンテンツが常に最新の状態に保たれます。

完全な例については、[static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)を参照してください。

## リソース {id="resources"}

クラスパスからコンテンツを提供するには、[`staticResources()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-resources.html)関数を使用します。

[object Promise]

これは、`/resources`からのすべてのリクエストを、アプリケーションリソース内の`static`パッケージにマッピングします。
この場合、KtorはURLパスとリソースへのパスが一致する限り、`static`パッケージから任意のファイルを再帰的に提供します。

完全な例については、[static-resources](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)を参照してください。

## 追加設定 {id="configuration"}

Ktorは、静的ファイルとリソースに対して、より多くの設定を提供します。

### インデックスファイル {id="index"}

`index.html`という名前のファイルが存在する場合、Ktorはディレクトリがリクエストされた際にデフォルトでそのファイルを提供します。`index`パラメーターを使用してカスタムインデックスファイルを設定できます。

[object Promise]

この場合、`/custom`がリクエストされると、Ktorは`/custom_index.html`を提供します。

### 事前圧縮ファイル {id="precompressed"}

Ktorは、事前圧縮ファイルを提供し、[動的圧縮](server-compression.md)の使用を避ける機能を提供します。
この機能を使用するには、ブロックステートメント内に`preCompressed()`関数を定義します。

[object Promise]

この例では、`/js/script.js`へのリクエストに対して、Ktorは`/js/script.js.br`または`/js/script.js.gz`を提供できます。

### HEADリクエスト {id="autohead"}

`enableAutoHeadResponse()`関数を使用すると、`GET`が定義されている静的ルート内のすべてのパスに対して、`HEAD`リクエストに自動的に応答できます。

[object Promise]

### デフォルトファイル応答 {id="default-file"}

`default()`関数は、静的ルート内で対応するファイルがないリクエストに対して、ファイルで応答する機能を提供します。

[object Promise]

この例では、クライアントが存在しないリソースを要求した場合、`index.html`ファイルがレスポンスとして提供されます。

### コンテンツタイプ {id="content-type"}

デフォルトでは、Ktorはファイル拡張子から`Content-Type`ヘッダーの値を推測しようとします。`contentType()`関数を使用して、`Content-Type`ヘッダーを明示的に設定できます。

[object Promise]

この例では、ファイル`html-file.txt`に対するレスポンスは`Content-Type: text/html`ヘッダーを持ち、その他のすべてのファイルにはデフォルトの動作が適用されます。

### キャッシュ {id="caching"}

`cacheControl()`関数を使用すると、HTTPキャッシングのための`Cache-Control`ヘッダーを設定できます。

[object Promise]

> Ktorでのキャッシングに関する詳細については、[キャッシングヘッダー](server-caching-headers.md)を参照してください。
>
{style="tip"}

### 除外ファイル {id="exclude"}

`exclude()`関数を使用すると、ファイルが提供されないように除外できます。除外されたファイルがクライアントによってリクエストされた場合、サーバーは`403 Forbidden`ステータスコードで応答します。

[object Promise]

### ファイル拡張子のフォールバック {id="extensions"}

リクエストされたファイルが見つからない場合、Ktorはファイル名に指定された拡張子を追加して検索することができます。

[object Promise]

この例では、`/index`がリクエストされた場合、Ktorは`/index.html`を検索し、見つかったコンテンツを提供します。

### カスタム変更 {id="modify"}

`modify()`関数を使用すると、結果のレスポンスにカスタム変更を適用できます。

[object Promise]

## エラー処理 {id="errors"}

リクエストされたコンテンツが見つからない場合、Ktorは自動的に`404 Not Found` HTTPステータスコードで応答します。

エラー処理の設定方法については、[Status Pages](server-status-pages.md)を参照してください。