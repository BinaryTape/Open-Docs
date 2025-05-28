[//]: # (title: キャッシュ)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpCacheプラグインを使用すると、以前にフェッチしたリソースをインメモリキャッシュまたは永続キャッシュに保存できます。
</link-summary>

Ktorクライアントは、以前にフェッチしたリソースをインメモリまたは永続キャッシュに保存できる[HttpCache](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html)プラグインを提供します。

## 依存関係を追加する {id="add_dependencies"}
`HttpCache`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## インメモリキャッシュ {id="memory_cache"}
`HttpCache`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

これだけで、クライアントが以前にフェッチしたリソースをインメモリキャッシュに保存できるようになります。
例えば、設定された`Cache-Control`ヘッダーを持つリソースに対して連続する2つの[リクエスト](client-requests.md)を行った場合、データがすでにキャッシュに保存されているため、クライアントは最初のリクエストのみを実行し、2番目のリクエストはスキップします。

## 永続キャッシュ {id="persistent_cache"}

Ktorでは、[CacheStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html)インターフェースを実装することで永続キャッシュを作成できます。JVM上では、[FileStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html)関数を呼び出すことでファイルストレージを作成できます。

ファイルキャッシュストレージを作成するには、`File`インスタンスを`FileStorage`関数に渡します。次に、作成されたストレージが共有キャッシュとして使用されるか、プライベートキャッシュとして使用されるかに応じて、`publicStorage`または`privateStorage`関数に渡します。

```kotlin
```
{src="snippets/client-caching/src/main/kotlin/com/example/Application.kt" include-lines="18-22,24"}

> 完全な例は以下で確認できます: [client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching)。