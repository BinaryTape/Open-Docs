# 圖像載入器

`ImageLoader` 是 [服務物件](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)，用於執行 [`ImageRequest`](image_requests.md)。它們負責處理快取、資料擷取、圖像解碼、請求管理、記憶體管理等等。

當您建立一個單一的 `ImageLoader` 並在整個應用程式中共用它時，Coil 的效能表現最佳。這是因為每個 `ImageLoader` 都有自己的記憶體快取、磁碟快取和 `OkHttpClient`。

## 單例

預設的 `io.coil-kt.coil3:coil` 構件 (artifact) 帶有一個單例 `ImageLoader`。Coil 會惰性地 (lazily) 建立這個 `ImageLoader`。它可以用多種方式進行配置：

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

**在所有情況下，請確保上述方法應盡可能地在應用程式啟動時呼叫 (例如在 `Application.onCreate` 內部，或如果您的應用程式只有一個 `Activity`，則在 `MainActivity.onCreate` 內部)。**

## 依賴注入

如果您有一個較大的應用程式，或者想要管理您自己的 `ImageLoader` 實例，您可以依賴 `io.coil-kt.coil3:coil-core` 而非 `io.coil-kt.coil3:coil`。

這種方式使得模擬 `ImageLoader` 的生命週期範圍 (scoping the lifecycle) 變得更加容易，並且整體上會使測試更為簡便。

## 快取

每個 `ImageLoader` 都會維護一個最近解碼的 `Bitmap` 的記憶體快取，以及一個用於從網際網路載入的任何圖像的磁碟快取。這兩者都可以在建立 `ImageLoader` 時進行配置：

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

您可以使用鍵值 (keys) 存取記憶體和磁碟快取中的項目，這些鍵值會在圖像載入後於 `ImageResult` 中回傳。`ImageResult` 是由 `ImageLoader.execute` 或在 `ImageRequest.Listener.onSuccess` 和 `ImageRequest.Listener.onError` 中回傳的。