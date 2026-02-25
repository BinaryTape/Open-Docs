# Image Loader

`ImageLoader` 是執行 [`ImageRequest`](image_requests.md) 的 [服務物件](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)。它們處理快取、資料擷取、圖片解碼、請求管理、記憶體管理等作業。

當您建立單一 `ImageLoader` 並在整個應用程式中共用它時，Coil 的效能表現最佳。這是因為每個 `ImageLoader` 都擁有自己的記憶體快取、磁碟快取和 `OkHttpClient`。

## Singleton

預設的 `io.coil-kt.coil3:coil` 構件附帶一個單例 `ImageLoader`。Coil 會延遲建立此 `ImageLoader`。可以透過多種方式進行配置：

```kotlin
// setSafe 方法可確保它不會覆蓋
// 已建立的現有影像載入器。
SingletonImageLoader.setSafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// SingletonImageLoader.setSafe 的別名，對 
// Compose Multiplatform 應用程式很有用。
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// 僅應在測試中使用。如果您多次呼叫此方法，
// 它將建立多個影像載入器。
SingletonImageLoader.setUnsafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// 在 Android 上，您可以在 Application 類別中
// 實作 SingletonImageLoader.Factory，使其建立單例影像載入器。
class CustomApplication : SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

**在所有情況下，請確保上述方法在應用程式啟動時盡快調用（例如：在 `Application.onCreate` 內，或者如果您的應用程式只有單一 `Activity`，則在 `MainActivity.onCreate` 內）。**

## 相依注入

如果您有較大型的應用程式或想要管理自己的 `ImageLoader`，您可以改為相依於 `io.coil-kt.coil3:coil-core` 而非 `io.coil-kt.coil3:coil`。

這種做法讓限定虛擬 `ImageLoader` 的生命週期變得更容易，且總體上會讓測試更簡單。

## 快取

每個 `ImageLoader` 都會保留最近解碼的 `Bitmap` 的記憶體快取，以及從網際網路載入之任何圖片的磁碟快取。這兩者都可以在建立 `ImageLoader` 時進行配置：

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

您可以使用金鑰存取記憶體與磁碟快取中的項目，這些金鑰會在圖片載入後透過 `ImageResult` 傳回。`ImageResult` 由 `ImageLoader.execute` 傳回，或在 `ImageRequest.Listener.onSuccess` 與 `ImageRequest.Listener.onError` 中傳回。