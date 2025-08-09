# 入門

## Compose UI

一個典型的 Compose UI 專案會想要引入：

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

引入這些後，您可以使用 `AsyncImage` 從網路載入圖像：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

!!! Note
    如果您使用 Compose Multiplatform，則需要使用 Ktor 而非 OkHttp。有關如何操作的資訊，請參閱[此處](network.md#ktor-network-engines)。

## Android Views

如果您使用 Android Views 而非 Compose UI，請引入：

```kotlin
implementation("io.coil-kt.coil3:coil:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

引入這些後，您可以使用 `ImageView.load` 擴充函數從網路載入圖像：

```kotlin
imageView.load("https://example.com/image.jpg")
```

## 配置單例 ImageLoader

預設情況下，Coil 包含一個單例 (singleton) `ImageLoader`。`ImageLoader` 透過擷取、解碼、快取並返回結果來執行傳入的 `ImageRequest`。您不需要配置您的 `ImageLoader`；如果您不配置，Coil 將以預設配置建立單例 `ImageLoader`。

您可以透過多種方式進行配置（**僅選擇其中一種**）：

- 在您應用程式的入口點（應用程式的根 `@Composable`）附近呼叫 `setSingletonImageLoaderFactory`。**這最適用於 Compose Multiplatform 應用程式。**

```kotlin
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

- 在 Android 中，於您的 [`Application`](https://developer.android.com/reference/android/app/Application) 上實作 `SingletonImageLoader.Factory`。**這最適用於 Android 應用程式。**

```kotlin
class CustomApplication : Application(), SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

- 在您應用程式的入口點（例如，Android 上的 `Application.onCreate` 中）附近呼叫 `SingletonImageLoader.setSafe`。這是最靈活的方式。

```kotlin
SingletonImageLoader.setSafe { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

!!! Note
    如果您正在編寫依賴於 Coil 的程式庫，則不應取得/設定單例 `ImageLoader`。相反，您應該依賴 `io.coil-kt.coil3:coil-core`，建立您自己的 `ImageLoader`，並手動傳遞它。如果您在程式庫中設定單例 `ImageLoader`，那麼如果使用您程式庫的應用程式也使用 Coil，您可能會覆寫該應用程式設定的 `ImageLoader`。

## 構件

以下是 Coil 已發佈到 `mavenCentral()` 的主要構件 (artifact) 列表：

*   `io.coil-kt.coil3:coil`：預設構件，依賴於 `io.coil-kt.coil3:coil-core`。它包含一個單例 `ImageLoader` 和相關的擴充函數。
*   `io.coil-kt.coil3:coil-core`：`io.coil-kt.coil3:coil` 的子集，**不**包含單例 `ImageLoader` 和相關的擴充函數。
*   `io.coil-kt.coil3:coil-compose`：預設的 [Compose UI](https://www.jetbrains.com/compose-multiplatform/) 構件，依賴於 `io.coil-kt.coil3:coil` 和 `io.coil-kt.coil3:coil-compose-core`。它包括使用單例 `ImageLoader` 的 `AsyncImage`、`rememberAsyncImagePainter` 和 `SubcomposeAsyncImage` 的多載 (overload)。
*   `io.coil-kt.coil3:coil-compose-core`：`io.coil-kt.coil3:coil-compose` 的子集，不包含依賴於單例 `ImageLoader` 的函數。
*   `io.coil-kt.coil3:coil-network-okhttp`：包含使用 [OkHttp](https://github.com/square/okhttp) 從網路擷取圖像的支援。
*   `io.coil-kt.coil3:coil-network-ktor2`：包含使用 [Ktor 2](https://github.com/ktorio/ktor) 從網路擷取圖像的支援。
*   `io.coil-kt.coil3:coil-network-ktor3`：包含使用 [Ktor 3](https://github.com/ktorio/ktor) 從網路擷取圖像的支援。
*   `io.coil-kt.coil3:coil-network-cache-control`：包含在從網路擷取圖像時，支援遵循 [`Cache-Control` 標頭](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) 的功能。
*   `io.coil-kt.coil3:coil-gif`：包含兩個 [解碼器](/coil/api/coil-core/coil3.decode/-decoder) 以支援解碼 GIF。有關更多詳細資訊，請參閱 [GIFs](gifs.md)。
*   `io.coil-kt.coil3:coil-svg`：包含一個 [解碼器](/coil/api/coil-core/coil3.decode/-decoder) 以支援解碼 SVG。有關更多詳細資訊，請參閱 [SVGs](svgs.md)。
*   `io.coil-kt.coil3:coil-video`：包含一個 [解碼器](/coil/api/coil-core/coil3.decode/-decoder) 以支援解碼來自 [任何 Android 支援的影片格式](https://developer.android.com/guide/topics/media/media-formats#video-codecs) 的影格。有關更多詳細資訊，請參閱 [影片](videos.md)。
*   `io.coil-kt.coil3:coil-test`：包含支援測試的類別。有關更多詳細資訊，請參閱 [測試](testing.md)。
*   `io.coil-kt.coil3:coil-bom`：包含一個 [物料清單 (bill of materials)](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)。引入 `coil-bom` 允許您依賴其他 Coil 構件而無需指定版本。