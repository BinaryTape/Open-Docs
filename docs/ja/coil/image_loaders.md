# Image Loaders

`ImageLoader` は、[`ImageRequest`](image_requests.md) を実行する[サービスオブジェクト](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)です。これらはキャッシュ、データ取得、画像デコード、リクエスト管理、メモリ管理などを処理します。

Coil は、単一の `ImageLoader` を作成し、アプリ全体で共有することで最高のパフォーマンスを発揮します。これは、各 `ImageLoader` が独自のメモリキャッシュ、ディスクキャッシュ、および `OkHttpClient` を持つためです。

## シングルトン

デフォルトの `io.coil-kt.coil3:coil` アーティファクトには、シングルトンの `ImageLoader` が含まれています。Coil はこの `ImageLoader` を遅延して作成します。これはいくつかの方法で設定できます。

```kotlin
// The setSafe method ensures that it won't overwrite an
// existing image loader that's been created.
SingletonImageLoader.setSafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// An alias of SingletonImageLoader.setSafe that's useful for
// Compose Multiplatform apps.
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Should only be used in tests. If you call this method
// multiple times it will create multiple image loaders.
SingletonImageLoader.setUnsafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// On Android you can implement SingletonImageLoader.Factory on your
// Application class to have it create the singleton image loader.
class CustomApplication : SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

**いずれの場合も、上記のメソッドはアプリの起動時（つまり、アプリが単一の `Activity` のみである場合は `Application.onCreate` または `MainActivity.onCreate` 内）にできるだけ早く呼び出すようにしてください。**

## 依存性注入

大規模なアプリをお持ちの場合や、独自の `ImageLoader` を管理したい場合は、`io.coil-kt.coil3:coil` の代わりに `io.coil-kt.coil3:coil-core` に依存できます。

この方法により、フェイクの `ImageLoader` のライフサイクルをスコープすることがはるかに容易になり、全体的にテストが簡単になります。

## キャッシュ

各 `ImageLoader` は、最近デコードされた `Bitmap` のメモリキャッシュと、インターネットからロードされた画像のディスクキャッシュを保持します。どちらも `ImageLoader` の作成時に設定できます。

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .memoryCache {
        MemoryCache.Builder(context)
            .maxSizePercent(0.25)
            .build()
    }
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .maxSizePercent(0.02)
            .build()
    }
    .build()
```

画像がロードされた後、メモリキャッシュとディスクキャッシュ内の項目は、そのキー（`ImageResult` で返されます）を使用してアクセスできます。`ImageResult` は `ImageLoader.execute` または `ImageRequest.Listener.onSuccess` および `ImageRequest.Listener.onError` で返されます。