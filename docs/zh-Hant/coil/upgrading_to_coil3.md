# 升級至 Coil 3.x

Coil 3 是 Coil 的下一個主要版本，它帶來了多項重大改進：

-   完整支援 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，包括所有主要目標平台（Android、iOS、JVM、JS 和 [WASM](https://coil-kt.github.io/coil/sample/)）。
-   支援多種網路函式庫 (Ktor 和 OkHttp)。或者，如果僅需載入本地/靜態檔案，Coil 也可以在無需網路依賴的情況下使用。
-   改進了 Compose `@Preview` 渲染，並透過 `LocalAsyncImagePreviewHandler` 支援自訂預覽行為。
-   重要的錯誤修復，這些修復需要破壞現有行為（如下所述）。

本文件提供了 Coil 2 到 Coil 3 主要變更的高層次概述，並著重介紹了任何破壞性或重要變更。它不涵蓋所有二進位不相容的變更或小的行為變更。

在 Compose Multiplatform 專案中使用 Coil 3 嗎？請查看 [`samples`](https://github.com/coil-kt/coil/tree/3.x/samples/compose) 儲存庫以獲取範例。

## Maven 座標和套件名稱

Coil 的 Maven 座標已從 `io.coil-kt` 更新為 `io.coil-kt.coil3`，其套件名稱已從 `coil` 更新為 `coil3`。這使得 Coil 3 能夠與 Coil 2 並存運行，而不會產生二進位相容性問題。例如，`io.coil-kt:coil:2.7.0` 現在是 `io.coil-kt.coil3:coil:3.0.0`。

`coil-base` 和 `coil-compose-base` 構件 (artifact) 已分別重新命名為 `coil-core` 和 `coil-compose-core`，以與 Coroutines、Ktor 和 AndroidX 所使用的命名慣例保持一致。

## 網路圖片

**`coil-core` 預設不再支援從網路載入圖片。** [您必須新增對 Coil 網路構件 (artifact) 之一的依賴。請參閱此處以獲取更多資訊。](network.md)。此項變更旨在讓消費者可以使用不同的網路函式庫，或者，如果他們的應用程式不需要網路依賴，則可以避免它。

此外，快取控制標頭 (cache control header) 預設不再被遵守。請參閱 [此處](network.md) 以獲取更多資訊。

## 多平台

Coil 3 現在是一個支援 Android、JVM、iOS、macOS、Javascript 和 WASM 的 Kotlin 多平台函式庫。

在 Android 上，Coil 使用標準圖形類別 (graphics class) 來渲染圖片。在非 Android 平台上，Coil 使用 [Skiko](https://github.com/JetBrains/skiko) 來渲染圖片。Skiko 是一組 Kotlin 綁定 (binding)，它包裝了由 Google 開發的 [Skia](https://github.com/google/skia) 圖形引擎。

作為與 Android SDK 解耦 (decoupling) 的一部分，進行了多項 API 變更。值得注意的是：

-   `Drawable` 已被自訂的 `Image` 介面取代。在 Android 上，使用 `Drawable.asImage()` 和 `Image.asDrawable(resources)` 進行類別之間的轉換。在非 Android 平台上，使用 `Bitmap.asImage()` 和 `Image.toBitmap()`。
-   Android 的 `android.net.Uri` 類別的使用已被多平台 `coil3.Uri` 類別取代。任何將 `android.net.Uri` 作為 `ImageRequest.data` 傳遞的呼叫點 (call site) 不受影響。依賴於接收 `android.net.Uri` 的自訂 `Fetcher`s 將需要更新以使用 `coil3.Uri`。
-   `Context` 的使用已被 `PlatformContext` 取代。`PlatformContext` 是 Android 上 `Context` 的類型別名 (type alias)，在非 Android 平台上可以使用 `PlatformContext.INSTANCE` 來存取。在 Compose Multiplatform 中，使用 `LocalPlatformContext.current` 以獲取引用。
-   `Coil` 類別已重新命名為 `SingletonImageLoader`。
-   如果您在自訂的 Android `Application` 類別中實現 (implementing) `ImageLoaderFactory`，您將需要改為實現 `SingletonImageLoader.Factory` 作為 `ImageLoaderFactory` 的替代方案。一旦您實現了 `SingletonImageLoader.Factory`，如果您需要或希望覆寫 (override) `newImageLoader()`，您就可以這樣做。

`coil-svg` 構件 (artifact) 支援多平台，但 `coil-gif` 和 `coil-video` 構件（目前）仍僅限於 Android，因為它們依賴於特定的 Android 解碼器和函式庫。

## Compose

`coil-compose` 構件 (artifact) 的 API 大多數未變。您可以繼續以與 Coil 2 相同的方式使用 `AsyncImage`、`SubcomposeAsyncImage` 和 `rememberAsyncImagePainter`。此外，這些方法已更新為 [可重啟和可跳過 (restartable and skippable)](https://developer.android.com/jetpack/compose/performance/stability)，這應該會提升其效能。

-   `AsyncImagePainter.state` 現在是一個 `StateFlow`。它應該使用 `val state = painter.state.collectAsState()` 來觀察。
-   `AsyncImagePainter` 的預設 `SizeResolver` 不再等待第一次 `onDraw` 呼叫以獲取畫布 (canvas) 的大小。相反地，`AsyncImagePainter` 預設為 `Size.ORIGINAL`。
-   Compose 的 `modelEqualityDelegate` 委託 (delegate) 現在是透過一個組合局部 (composition local) `LocalAsyncImageModelEqualityDelegate` 來設定的，而不是作為 `AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImagePainter` 的參數。

## 一般

其他重要的行為變更包括：

-   第一方 (first party) 的 `Fetcher` 和 `Decoder`（例如 `NetworkFetcher.Factory`、`SvgDecoder` 等）現在會透過服務載入器 (service loader) 自動新增到每個新的 `ImageLoader` 中。此行為可以使用 `ImageLoader.Builder.serviceLoaderEnabled(false)` 來禁用。
-   移除對 `android.resource://example.package.name/drawable/image` URI 的支援，因為它會阻礙資源縮減優化 (resource shrinking optimization)。建議直接傳遞 `R.drawable.image` 值。傳遞資源 ID 而不是資源名稱仍然有效：`android.resource://example.package.name/12345678`。如果您仍需要其功能，可以 [手動將 `ResourceUriMapper` 包含到您的元件註冊表 (component registry) 中](https://github.com/coil-kt/coil/blob/da7d872e340430014dbc5136e35eb62f9b17662e/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)。
-   檔案的最後寫入時間戳 (last write timestamp) 預設不再新增到其快取鍵 (cache key) 中。這是為了避免在主執行緒 (main thread) 上讀取磁碟（即使時間很短）。這可以使用 `ImageRequest.Builder.addLastModifiedToFileCacheKey(true)` 或 `ImageLoader.Builder.addLastModifiedToFileCacheKey(true)` 重新啟用。
-   輸出圖片尺寸現在被強制為小於 4096x4096，以防止意外的記憶體不足 (OOM)。這可以使用 `ImageLoader/ImageRequest.Builder.maxBitmapSize` 來配置。要禁用此行為，請將 `maxBitmapSize` 設定為 `Size.ORIGINAL`。
-   Coil 2 的 `Parameters` API 已被 `Extras` 取代。`Extras` 不需要字串鍵 (string key)，而是依賴於身份相等性 (identity equality)。`Extras` 不支援修改記憶體快取鍵 (memory cache key)。相反地，如果您的額外資訊 (extra) 影響記憶體快取鍵，請使用 `ImageRequest.memoryCacheKeyExtra`。
-   許多 `ImageRequest.Builder` 函式已移至延伸函式 (extension function)，以便更容易支援多平台。