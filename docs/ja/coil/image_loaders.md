# イメージローダー (Image Loaders)

`ImageLoader` は、[`ImageRequest`](image_requests.md) を実行する [サービスオブジェクト](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/) です。これらは、キャッシング、データフェッチ、画像のデコード、リクエスト管理、メモリ管理などを処理します。

Coil は、単一の `ImageLoader` を作成し、それをアプリ全体で共有することで最高のパフォーマンスを発揮します。これは、各 `ImageLoader` が独自のメモリキャッシュ、ディスクキャッシュ、および `OkHttpClient` を持っているためです。

## シングルトン (Singleton)

デフォルトの `io.coil-kt.coil3:coil` アーティファクトには、シングルトンの `ImageLoader` が含まれています。Coil はこの `ImageLoader` を遅延生成（Lazy creation）します。これはいくつかの方法で設定できます。

```kotlin
// setSafe メソッドは、作成済みの既存のイメージローダーを
// 上書きしないことを保証します。
SingletonImageLoader.setSafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Compose Multiplatform アプリに便利な 
// SingletonImageLoader.setSafe のエイリアスです。
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// テストでのみ使用してください。このメソッドを複数回呼び出すと、
// 複数のイメージローダーが作成されます。
SingletonImageLoader.setUnsafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Android では、Application クラスに SingletonImageLoader.Factory を
// 実装して、シングルトンイメージローダーを作成させることができます。
class CustomApplication : SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

**どのような場合でも、上記のメソッドはアプリの起動後できるだけ早く（つまり、`Application.onCreate` 内、またはアプリが単一の `Activity` のみの場合は `MainActivity.onCreate` 内で）呼び出されるようにしてください。**

## 依存関係の注入 (Dependency injection)

より大規模なアプリを作成する場合や、独自の `ImageLoader` を管理したい場合は、`io.coil-kt.coil3:coil` の代わりに `io.coil-kt.coil3:coil-core` に依存させることができます。

この方法をとることで、フェイク（Fake）の `ImageLoader` のライフサイクルのスコープ設定が非常に容易になり、全体としてテストがしやすくなります。

## キャッシング

各 `ImageLoader` は、最近デコードされた `Bitmap` のメモリキャッシュと、インターネットから読み込まれた画像のディスクキャッシュを保持します。これらは両方とも、`ImageLoader` の作成時に設定可能です。

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .memoryCache {
        MemoryCache.Builder()
            .maxSizePercent(context, 0.25)
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

メモリキャッシュやディスクキャッシュ内のアイテムには、画像の読み込み後に `ImageResult` で返されるキーを使用してアクセスできます。`ImageResult` は `ImageLoader.execute` によって、または `ImageRequest.Listener.onSuccess` と `ImageRequest.Listener.onError` 内で返されます。