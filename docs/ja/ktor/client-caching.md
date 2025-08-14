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
HttpCache プラグインを使用すると、以前にフェッチしたリソースをインメモリまたは永続キャッシュに保存できます。
</link-summary>

Ktor クライアントは、以前にフェッチしたリソースをインメモリまたは永続キャッシュに保存できる [HttpCache](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) プラグインを提供します。

## 依存関係の追加 {id="add_dependencies"}
`HttpCache` は [ktor-client-core](client-dependencies.md) アーティファクトのみを必要とし、特定の依存関係は不要です。

## インメモリキャッシュ {id="memory_cache"}
`HttpCache` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の `install` 関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

これにより、クライアントは以前にフェッチしたリソースをインメモリキャッシュに保存できるようになります。
例えば、設定済みの `Cache-Control` ヘッダーを持つリソースに対して連続して2つの[リクエスト](client-requests.md)を行う場合、データはすでにキャッシュに保存されているため、クライアントは最初のリクエストのみを実行し、2番目のリクエストはスキップします。

## 永続キャッシュ {id="persistent_cache"}

Ktor では、[CacheStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) インターフェースを実装することで永続キャッシュを作成できます。
JVM では、[FileStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 関数を呼び出すことでファイルストレージを作成できます。

ファイルキャッシュストレージを作成するには、`File` インスタンスを `FileStorage` 関数に渡します。
次に、作成したストレージを、そのストレージが共有キャッシュとして使用されるかプライベートキャッシュとして使用されるかに応じて、`publicStorage` または `privateStorage` 関数に渡します。

[object Promise]

> 完全な例はこちらで確認できます: [client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching)。