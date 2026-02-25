[//]: # (title: キャッシュ)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCacheプラグインを使用すると、以前に取得したリソースをメモリ内キャッシュまたは永続キャッシュに保存できます。
</link-summary>

Ktorクライアントは、以前に取得したリソースをメモリ内キャッシュまたは永続キャッシュに保存できる[HttpCache](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html)プラグインを提供しています。

## 依存関係の追加 {id="add_dependencies"}
`HttpCache`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## メモリ内キャッシュ {id="memory_cache"}
`HttpCache`をインストールするには、[クライアント構成ブロック](client-create-and-configure.md#configure-client)内の`install`関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

これだけで、クライアントが以前に取得したリソースをメモリ内キャッシュに保存できるようになります。
例えば、`Cache-Control`ヘッダーが設定されたリソースに対して2回連続で[リクエスト](client-requests.md)を送信した場合、データはすでにキャッシュに保存されているため、クライアントは最初のリクエストのみを実行し、2回目はスキップします。

## 永続キャッシュ {id="persistent_cache"}

Ktorでは、[CacheStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html)インターフェースを実装することで永続キャッシュを作成できます。
JVMでは、[FileStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html)関数を呼び出すことでファイルストレージを作成できます。

ファイルキャッシュストレージを作成するには、`File`インスタンスを`FileStorage`関数に渡します。
次に、そのストレージが共有キャッシュとして使用されるかプライベートキャッシュとして使用されるかに応じて、作成したストレージを`publicStorage`または`privateStorage`関数に渡します。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCache) {
        val cacheFile = Files.createDirectories(Paths.get("build/cache")).toFile()
        publicStorage(FileStorage(cacheFile))
    }
}
```

> 完全な例はこちらにあります: [client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching)。