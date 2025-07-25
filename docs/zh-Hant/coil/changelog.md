# 更新日誌

## [3.3.0] - 2025 年 7 月 22 日

- **新功能**：引入一個新 API，用於限制應用程式在背景執行時 Android 上 `MemoryCache.maxSize` 的大小。
    - 如果設定了 `ImageLoader.Builder.memoryCacheMaxSizePercentWhileInBackground`，則 `ImageLoader` 的記憶體快取在應用程式於背景執行時將被限制為其最大大小的百分比。此設定目前預設為停用。
    - 當應用程式進入背景時，影像將從記憶體快取中被裁剪 (trimmed)，以達到受限制的最大大小，但記憶體快取對最近裁剪的影像的弱引用不受影響。這表示如果一個影像目前在其他地方被引用（例如 `AsyncImage`、`ImageView` 等），它仍將存在於記憶體快取中。
    - 這個 API 有助於減少背景記憶體使用量，防止應用程式過早被終止，並有助於減輕使用者設備上的記憶體壓力。
- **新功能**：為 `SvgDecoder` 增加了 `Svg.Parser` 參數。
    - 這允許在使用預設 SVG 解析器無法滿足需求時，使用自訂的 SVG 解析器。
- 為 `SvgDecoder` 增加了 `density` 參數，以支援提供自訂的密度乘數。
- 增加 `Uri.Builder` 以支援複製和修改 `Uri`s。
- 增加 `ImageLoader.Builder.mainCoroutineContext` 以支援在測試中覆寫 Coil 對 `Dispatchers.main.immediate` 的使用。
- 修正 `CrossfadePainter.intrinsicSize` 在動畫結束時 `start` 影像被解除引用時發生變化的問題。這與 `CrossfadeDrawable` 的行為一致。
- 修正 `ImageLoaders.executeBlocking` 無法從 Java 存取的問題。
- 在 `coil-network-ktor3` 中使用 `kotlinx.io` 的 Okio 互通模組。
- 更新 `kotlinx-datetime` 至 `0.7.1`。
    - 此版本包含二進制不相容的變更，僅影響 `coil-network-cache-control` 模組。請參閱 [此處](https://github.com/Kotlin/kotlinx-datetime?tab=readme-ov-file#deprecation-of-instant) 以獲取更多資訊。
- 將 Kotlin 更新至 2.2.0。
- 將 Compose 更新至 1.8.2。
- 將 Okio 更新至 3.15.0。
- 將 Skiko 更新至 0.9.4.2。

## [3.2.0] - 2025 年 5 月 13 日

自 `3.1.0` 以來的變更：

- **重要**：由於 Compose `1.8.0` 的要求，`coil-compose` 和 `coil-compose-core` 現在需要 Java 11 位元碼。請參閱 [此處](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11) 了解如何啟用它。
- 將 `AsyncImagePreviewHandler` 的函式建構子更改為返回 `AsyncImagePainter.State.Success` 而不是 `AsyncImagePainter.State.Loading`。
- 修正 `ConstraintsSizeResolver#size()` 中的取消問題。
- 修正使用 R8 建置時缺少 `PlatformContext` 的警告。
- 修正 `FakeImageLoaderEngine` 在返回預設 `FakeImageLoaderEngine` 響應時未設定 `Transition.Factory.NONE` 的問題。
- 移除 `ColorImage` 上的實驗性註解。
- 在 `CacheControlCacheStrategy` 中延遲解析網路標頭。
- 重構 `CircleCropTransformation` 和 `RoundedCornersTransformation` 以共享通用程式碼。
- 如果 `ExifOrientationStrategy` 不是 `RESPECT_PERFORMANCE`，則內部會回退 (fall back) 到使用 `BitmapFactory`。
- 將 Kotlin 更新至 2.1.20。
- 將 Compose 更新至 1.8.0。
- 將 Okio 更新至 3.11.0。
- 將 Skiko 更新至 0.9.4。
- 將 Coroutines 更新至 1.10.2。
- 將 `accompanist-drawablepainter` 更新至 0.37.3。

自 `3.2.0-rc02` 以來的變更：

- 如果 `ExifOrientationStrategy` 不是 `RESPECT_PERFORMANCE`，則內部會回退到使用 `BitmapFactory`。
- 將 Compose 更新至 1.8.0。
- 將 `accompanist-drawablepainter` 更新至 0.37.3。

## [3.2.0-rc02] - 2025 年 4 月 26 日

- 修正在使用 `KtorNetworkFetcherFactory` (Ktor 3) 載入非 JVM 目標上的影像時，影像請求因 `ClosedByteChannelException` 而失敗的問題。

## [3.2.0-rc01] - 2025 年 4 月 24 日

- **重要**：由於 Compose `1.8.0` 的要求，`coil-compose` 和 `coil-compose-core` 現在需要 Java 11 位元碼。請參閱 [此處](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11) 了解如何啟用它。
- 將 `AsyncImagePreviewHandler` 的函式建構子更改為返回 `AsyncImagePainter.State.Success` 而不是 `AsyncImagePainter.State.Loading`。
- 修正 `ConstraintsSizeResolver#size()` 中的取消問題。
- 修正使用 R8 建置時缺少 `PlatformContext` 的警告。
- 修正 `FakeImageLoaderEngine` 在返回預設 `FakeImageLoaderEngine` 響應時未設定 `Transition.Factory.NONE` 的問題。
- 移除 `ColorImage` 上的實驗性註解。
- 在 `CacheControlCacheStrategy` 中延遲解析網路標頭。
- 重構 `CircleCropTransformation` 和 `RoundedCornersTransformation` 以共享通用程式碼。
- 在 `coil-network-ktor2` 和 `coil-network-ktor3` 中使用 `kotlinx.io` 的 Okio 互通模組。
- 將 Kotlin 更新至 2.1.20。
- 將 Compose 更新至 1.8.0-rc01。
- 將 Okio 更新至 3.11.0。
- 將 Skiko 更新至 0.9.4。
- 將 Coroutines 更新至 1.10.2。

## [3.1.0] - 2025 年 2 月 4 日

- 提升 `AsyncImage` 效能。
    - 執行時效能提升了 25% 至 40%，具體取決於可組合項 (composable) 是被實例化還是重複使用。記憶體分配 (allocations) 也減少了 35% 至 48%。更多資訊請參閱 [此處](https://github.com/coil-kt/coil/pull/2795)。
- 增加 `ColorImage` 並棄用 `FakeImage`。
    - `ColorImage` 對於在測試和預覽中返回假值很有用。它解決了與 `FakeImage` 相同的用例，但在 `coil-core` 中比在 `coil-test` 中更容易存取。
- 移除 `coil-compose-core` 對 `Dispatchers.Main.immediate` 的依賴。
    - 這也修正了在 Paparazzi 和 Roborazzi 截圖測試中，`AsyncImagePainter` 無法同步執行 `ImageRequest` 的情況。
- 增加對 [資料 URI (data URIs)](https://www.ietf.org/rfc/rfc2397.txt) 的支援，格式為：`data:[<mediatype>][;base64],<data>`。
- 增加 `AnimatedImageDecoder.ENCODED_LOOP_COUNT` 以支援在 GIF 的中繼資料中使用編碼的重複計數。
- 為 `NetworkRequest` 增加了 `Extras` 以支援自訂擴充。
- 增加 `DiskCache.Builder.cleanupCoroutineContext` 並棄用 `DiskCache.Builder.cleanupDispatcher`。
- 增加 `ImageLoader.Builder.imageDecoderEnabled` 以選擇性停用在 API 29 及以上版本使用 `android.graphics.ImageDecoder`。
- 如果 `ImageRequest` 的資料類型沒有註冊的 `Keyer`，則記錄一個警告。
- 將 `CrossfadePainter` 設為公開。
- 在所有多平台目標上支援 `Transformation`。
- 在 `CacheControlCacheStrategy` 中支援將 0 作為 `Expires` 標頭值。
- 修正 `AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImage` 在其 `ContentScale` 變更為 `None` 或從 `None` 變更時，不啟動新的 `ImageRequest` 的問題。
- 將 Kotlin 更新至 2.1.10。
    - 注意：如果您使用 Kotlin native，此版本需要使用 Kotlin 2.1.0 或更高版本編譯，原因是一個 [LLVM 更新](https://kotlinlang.org/docs/whatsnew21.html#llvm-update-from-11-1-0-to-16-0-0)。
- 將 Compose 更新至 1.7.3。
- 將 `androidx.core` 更新至 1.15.0。

## [3.0.4] - 2024 年 11 月 25 日

- 修正向量繪圖 (vector drawables) 未在 Android Studio 預覽中呈現的問題。
- 修正請求大小超過 `maxBitmapSize` 時可能出現的記憶體快取遺失問題。
- 修正 `FakeImage` 未在 Android 上呈現的問題。
- 修正當 `AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage` 使用時，請求的 `Transformation` 發生變更時，不啟動新的影像請求的問題。
- 修正 `ScaleDrawable` 和 `CrossfadeDrawable` 不尊重色調狀態 (tint states) 的問題。
- 允許 `ImageDecoder` 解碼部分影像來源。這與 `BitmapFactory` 中的行為一致。
- 修正解碼後未呼叫 `Bitmap.prepareToDraw()` 的問題。
- `SvgDecoder` 不應對非點陣圖影像 (non-rasterized images) 返回 `isSampled = true`。
- 如果立即主調度器 (immediate main dispatcher) 不可用，則在 Compose 中回退到 `Dispatchers.Unconfined`。這僅用於預覽/測試環境。
- 將 Ktor 2 更新至 `2.3.13`。

## [3.0.3] - 2024 年 11 月 14 日

- 修正根據 `ImageView` 的 `ScaleType` 設定 `ImageRequest.scale` 的問題。
- 修正 `DiskCache` 在刪除檔案後不會追蹤條目移除的邊緣情況。
- 在記錄錯誤時，將可拋出物件 (throwable) 傳遞給 `Logger`。
- 不要將 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 替換為 `kotlin-stdlib`。

## [3.0.2] - 2024 年 11 月 9 日

- 修正 Android 上使用自訂 `CacheStrategy` 呼叫 `OkHttpNetworkFetcherFactory` 時崩潰的問題。
- 修正 `CacheControlCacheStrategy` 錯誤計算快取條目年齡的問題。
- 修正 `ImageRequest.bitmapConfig` 僅在 API 28 或更高版本上，且為 `ARGB_8888` 或 `HARDWARE` 時才被尊重的問題。

## [3.0.1] - 2024 年 11 月 7 日

- 修正呼叫 `Image.toBitmap` 時，如果使用硬體位圖支援的 `BitmapImage` 會崩潰的問題。
- 修正 `AsyncImageModelEqualityDelegate.Default` 對非 `ImageRequest` 模型比較相等性時出錯的問題。

## [3.0.0] - 2024 年 11 月 4 日

Coil 3.0.0 是 Coil 的下一個主要版本，完整支援 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)。

[有關 3.0.0 中的所有改進和重要變更，請查閱升級指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

自 `3.0.0-rc02` 以來的變更：

- 移除所有剩餘的棄用方法。

## [3.0.0-rc02] - 2024 年 10 月 28 日

[有關 3.x 中的所有改進和重要變更，請查閱升級指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。自 `3.0.0-rc01` 以來的變更：

- 增加 `BlackholeDecoder`。這簡化了 [僅磁碟快取的預載](https://coil-kt.github.io/coil/faq/#how-do-i-preload-an-image)。
- 為 `ConstraintsSizeResolver` 和 `DrawScopeSizeResolver` 增加了 `remember` 函式。
- 移除 `EqualityDelegate` 作為 `AsyncImage` 的參數。相反，它應透過 `LocalAsyncImageModelEqualityDelegate` 設定。
- 修正當父級可組合項使用 `IntrinsicSize` 時，`AsyncImage` 不呈現的問題。
- 修正 `AsyncImage` 填充可用約束的問題，當 `AsyncImagePainter` 沒有子繪圖器 (child painter) 時。
- 修正 `rememberAsyncImagePainter` 因 `EqualityDelegate` 被忽略而導致其狀態被觀察時無限重組的問題。
- 修正解析包含特殊字元的 `File`/`Path` 路徑的問題。
- 修正 `VideoFrameDecoder` 使用自訂 `FileSystem` 實作的問題。
- 將 Ktor 更新至 `3.0.0`。
- 將 `androidx.annotation` 更新至 `1.9.0`。

## [3.0.0-rc01] - 2024 年 10 月 8 日

[有關 3.x 中的所有改進和重要變更，請查閱升級指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。自 `3.0.0-alpha10` 以來的變更：

- **破壞性變更**：預設停用 `addLastModifiedToFileCacheKey`，並允許每個請求單獨設定。可以使用相同的旗標重新啟用此行為。
- **新功能**：引入新的 `coil-network-cache-control` Artifact，它實現了 [`Cache-Control` 標頭](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) 支援。
- **新功能**：為 `SvgDecoder.Factory` 增加了 `scaleToDensity` 屬性。此屬性確保具有固有尺寸的 SVG 會乘以設備的密度（僅在 Android 上支援）。
- 將 `ExifOrientationPolicy` 重命名為 `ExifOrientationStrategy`。
- 在獲取時從 `MemoryCache` 中移除不可共享的影像。
- 將 `ConstraintsSizeResolver` 設為公開。
- 穩定 `setSingletonImageLoaderFactory`。
- 在 `coil-network-ktor3` 中恢復優化的 JVM I/O 函式。
- 將 `pdf` 加入 MIME 類型列表。
- 將編譯 SDK 更新至 35。
- 將 Kotlin 更新至 2.0.20。
- 將 Okio 更新至 3.9.1。

## [3.0.0-alpha10] - 2024 年 8 月 7 日

- **破壞性變更**：將 `ImageLoader.Builder.networkObserverEnabled` 替換為 `NetworkFetcher` 的 `ConnectivityChecker` 介面。
    - 要停用網路觀察器 (network observer)，請將 `ConnectivityChecker.ONLINE` 傳遞給 `KtorNetworkFetcherFactory`/`OkHttpNetworkFetcherFactory` 的建構子。
- **新功能**：在所有平台上支援載入 [Compose Multiplatform 資源](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-images-resources.html)。要載入資源，請使用 `Res.getUri`：

```kotlin
AsyncImage(
    model = Res.getUri("drawable/image.jpg"),
    contentDescription = null,
)
```

- 為 `ImageLoader` 和 `ImageRequest` 增加 `maxBitmapSize` 屬性。
    - 此屬性預設為 4096x4096，並為分配的位圖尺寸提供安全的上限。這有助於避免意外地使用 `Size.ORIGINAL` 載入非常大的影像並導致記憶體不足例外。
- 將 `ExifOrientationPolicy` 轉換為一個介面以支援自訂策略。
- 修正 `Uri` 處理 Windows 檔案路徑的問題。
- 從 `Image` API 中移除 `@ExperimentalCoilApi`。
- 將 Kotlin 更新至 2.0.10。

## [3.0.0-alpha09] - 2024 年 7 月 23 日

- **破壞性變更**：將 `io.coil-kt.coil3:coil-network-ktor` Artifact 重命名為 `io.coil-kt.coil3:coil-network-ktor2`，它依賴於 Ktor 2.x。此外，引入 `io.coil-kt.coil3:coil-network-ktor3`，它依賴於 Ktor 3.x。`wasmJs` 支援僅在 Ktor 3.x 中可用。
- **新功能**：增加 `AsyncImagePainter.restart()` 以手動重新啟動影像請求。
- 從 `NetworkClient` 和相關類別中移除 `@ExperimentalCoilApi`。
- 優化 `ImageRequest` 以避免不必要的 `Extras` 和 `Map` 記憶體分配。

## [2.7.0] - 2024 年 7 月 17 日

- 輕微優化內部協程 (coroutines) 使用，以提升 `ImageLoader.execute`、`AsyncImage`、`SubcomposeAsyncImage` 和 `rememberAsyncImagePainter` 的效能。([#2205](https://github.com/coil-kt/coil/pull/2205))
- 修正分塊響應 (chunked responses) 的重複網路呼叫問題。([#2363](https://github.com/coil-kt/coil/pull/2363))
- 將 Kotlin 更新至 2.0.0。
- 將 Compose UI 更新至 1.6.8。
- 將 Okio 更新至 3.9.0。

## [3.0.0-alpha08] - 2024 年 7 月 8 日

- **破壞性變更**：將 `ImageRequest` 和 `ImageLoader` 的 `dispatcher` 方法重命名為 `coroutineContext`。例如，`ImageRequest.Builder.dispatcher` 現在是 `ImageRequest.Builder.coroutineContext`。此重命名是因為該方法現在接受任何 `CoroutineContext` 並且不再需要 `Dispatcher`。
- 修正：修正可能因競態條件 (race condition) 導致的 `IllegalStateException: Reading a state that was created after the snapshot was taken or in a snapshot that has not yet been applied` 錯誤。
    - 注意：這重新引入了對 `Dispatchers.Main.immediate` 的軟依賴。因此，您應該在 JVM 上重新添加對 [`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/) 的依賴。如果未匯入，則 `ImageRequest` 將不會立即分派，並且在設定 `ImageRequest.placeholder` 或從記憶體快取解析之前會有一幀的延遲。

## [3.0.0-alpha07] - 2024 年 6 月 26 日

- **破壞性變更**：`AsyncImagePainter` 預設不再等待 `onDraw`，而是使用 `Size.ORIGINAL`。
    - 這修正了 [與 Roborazzi/Paparazzi 的相容性問題](https://github.com/coil-kt/coil/issues/1910)，並整體提升了測試的可靠性。
    - 要恢復等待 `onDraw` 的行為，請將 `DrawScopeSizeResolver` 設定為您的 `ImageRequest.sizeResolver`。
- **破壞性變更**：重構多平台 `Image` API。值得注意的是，`asCoilImage` 已重命名為 `asImage`。
- **破壞性變更**：`AsyncImagePainter.state` 已變更為 `StateFlow<AsyncImagePainter.State>`。使用 `collectAsState` 觀察其值。這提升了效能。
- **破壞性變更**：`AsyncImagePainter.imageLoader` 和 `AsyncImagePainter.request` 已合併為 `StateFlow<AsyncImagePainter.Inputs>`。使用 `collectAsState` 觀察其值。這提升了效能。
- **破壞性變更**：移除對 `android.resource://example.package.name/drawable/image` URI 的支援，因為它會阻止資源縮小優化。
    - 如果您仍然需要其功能，可以 [手動將 `ResourceUriMapper` 包含到您的元件註冊表 (component registry) 中](https://github.com/coil-kt/coil/blob/main/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)。
- **新功能**：引入 `AsyncImagePreviewHandler` 以支援控制 `AsyncImagePainter` 的預覽渲染行為。
    - 使用 `LocalAsyncImagePreviewHandler` 來覆寫預覽行為。
    - 作為此變更和其他 `coil-compose` 改進的一部分，`AsyncImagePainter` 現在預設嘗試執行 `ImageRequest`，而不是預設顯示 `ImageRequest.placeholder`。[在預覽環境中，使用網路或檔案的請求預計會失敗](https://developer.android.com/develop/ui/compose/tooling/previews#preview-limitations)，但 Android 資源應該可以運作。
- **新功能**：支援按幀索引提取視訊影像。([#2183](https://github.com/coil-kt/coil/pull/2183))
- **新功能**：支援將 `CoroutineContext` 傳遞給任何 `CoroutineDispatcher` 方法。([#2241](https://github.com/coil-kt/coil/pull/2241))。
- **新功能**：在 JS 和 WASM JS 上支援弱引用記憶體快取。
- 在 Compose 中不分派到 `Dispatchers.Main.immediate`。作為副作用，[`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/) 不再需要在 JVM 上匯入。
- 在 Compose 中不呼叫 `async` 並建立一個一次性對象 (disposable) 以提升效能（感謝 @mlykotom！）。([#2205](https://github.com/coil-kt/coil/pull/2205))
- 修正將全域 `ImageLoader` 額外參數傳遞給 `Options` 的問題。([#2223](https://github.com/coil-kt/coil/pull/2223))
- 修正 `crossfade(false)` 在非 Android 目標上無效的問題。
- 修正 VP8X 特徵旗標位元組偏移 ([#2199](https://github.com/coil-kt/coil/pull/2199))。
- 將非 Android 目標上的 `SvgDecoder` 轉換為渲染到位圖，而不是在繪圖時渲染影像。這提升了效能。
    - 此行為可以使用 `SvgDecoder(renderToBitmap)` 控制。
- 將 `ScaleDrawable` 從 `coil-gif` 移動到 `coil-core`。
- 將 Kotlin 更新至 2.0.0。
- 將 Compose 更新至 1.6.11。
- 將 Okio 更新至 3.9.0。
- 將 Skiko 更新至 0.8.4。
- [有關 3.x 中的所有重要變更，請查閱升級指南。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha06] - 2024 年 2 月 29 日

- 將 Skiko 降級至 0.7.93。
- [有關 3.x 中的所有重要變更，請查閱升級指南。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha05] - 2024 年 2 月 28 日

- **新功能**：支援 `wasmJs` 目標。
- 建立 `DrawablePainter` 和 `DrawableImage`，以支援在非 Android 平台上繪製非由 `Bitmap` 支援的 `Image`。
    - `Image` API 仍處於實驗階段，在 Alpha 版本之間可能會有所變更。
- 更新 `ContentPainterModifier` 以實作 `Modifier.Node`。
- 修正：在背景執行緒上延遲註冊元件回呼和網路觀察器。這修正了通常會在主執行緒上發生的緩慢初始化問題。
- 修正：修正 `ImageLoader.Builder.placeholder/error/fallback` 未被 `ImageRequest` 使用的問題。
- 將 Compose 更新至 1.6.0。
- 將 Coroutines 更新至 1.8.0。
- 將 Okio 更新至 3.8.0。
- 將 Skiko 更新至 0.7.94。
- [有關 3.x 中的所有重要變更，請查閱升級指南。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [2.6.0] - 2024 年 2 月 23 日

- 將 `rememberAsyncImagePainter`、`AsyncImage` 和 `SubcomposeAsyncImage` 設為 [可重新啟動和可跳過](https://developer.android.com/jetpack/compose/performance/stability#functions)。這透過避免重新組合 (recomposition)，除非可組合項的其中一個參數發生變更，從而提升了效能。
    - 為 `rememberAsyncImagePainter`、`AsyncImage` 和 `SubcomposeAsyncImage` 增加了可選的 `modelEqualityDelegate` 參數，以控制 `model` 是否會觸發重新組合。
- 更新 `ContentPainterModifier` 以實作 `Modifier.Node`。
- 修正：在背景執行緒上延遲註冊元件回呼和網路觀察器。這修正了通常會在主執行緒上發生的緩慢初始化問題。
- 修正：避免在 `rememberAsyncImagePainter`、`AsyncImage` 和 `SubcomposeAsyncImage` 中，如果 `ImageRequest.listener` 或 `ImageRequest.target` 發生變更時重新啟動新的影像請求。
- 修正：不要在 `AsyncImagePainter` 中觀察影像請求兩次。
- 將 Kotlin 更新至 1.9.22。
- 將 Compose 更新至 1.6.1。
- 將 Okio 更新至 3.8.0。
- 將 `androidx.collection` 更新至 1.4.0。
- 將 `androidx.lifecycle` 更新至 2.7.0。

## [3.0.0-alpha04] - 2024 年 2 月 1 日

- **破壞性變更**：從 `OkHttpNetworkFetcherFactory` 和 `KtorNetworkFetcherFactory` 的公開 API 中移除 `Lazy`。
- 在 `OkHttpNetworkFetcherFactory` 中公開 `Call.Factory` 而非 `OkHttpClient`。
- 將 `NetworkResponseBody` 轉換為包裹 `ByteString`。
- 將 Compose 降級至 1.5.12。
- [有關所有重要變更，請查閱升級指南。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha03] - 2024 年 1 月 20 日

- **破壞性變更**：`coil-network` 已重命名為 `coil-network-ktor`。此外，新增了一個 `coil-network-okhttp` Artifact，它依賴於 OkHttp 且不需要指定 Ktor 引擎。
    - 根據您匯入的 Artifact，您可以手動使用 `KtorNetworkFetcherFactory` 或 `OkHttpNetworkFetcherFactory` 來引用 `Fetcher.Factory`。
- 支援在 Apple 平台上載入 `NSUrl`。
- 為 `AsyncImage` 增加 `clipToBounds` 參數。
- [有關所有重要變更，請查閱升級指南。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha02] - 2024 年 1 月 10 日

- **破壞性變更**：`coil-gif`、`coil-network`、`coil-svg` 和 `coil-video` 的套件已更新，使其所有類別都分別屬於 `coil.gif`、`coil.network`、`coil.svg` 和 `coil.video`。這有助於避免與其他 Artifact 的類別名稱衝突。
- **破壞性變更**：`ImageDecoderDecoder` 已重命名為 `AnimatedImageDecoder`。
- **新功能**：`coil-gif`、`coil-network`、`coil-svg` 和 `coil-video` 的元件現在會自動添加到每個 `ImageLoader` 的 `ComponentRegistry` 中。
    - 需要說明的是，與 `3.0.0-alpha01` 不同，**您不需要手動將 `NetworkFetcher.Factory()` 添加到您的 `ComponentRegistry` 中**。只需匯入 `io.coil-kt.coil3:coil-network:[version]` 和 [一個 Ktor 引擎](https://ktor.io/docs/http-client-engines.html#dependencies) 就足以載入網路影像。
    - 手動將這些元件添加到 `ComponentRegistry` 也是安全的。任何手動添加的元件優先於自動添加的元件。
    - 如果需要，可以使用 `ImageLoader.Builder.serviceLoaderEnabled(false)` 停用此行為。
- **新功能**：在所有平台上支援 `coil-svg`。它在 Android 上由 [AndroidSVG](https://bigbadaboom.github.io/androidsvg/) 提供支援，在非 Android 平台上由 [SVGDOM](https://api.skia.org/classSkSVGDOM.html) 提供支援。
- Coil 現在內部使用 Android 的 [`ImageDecoder`](https://developer.android.com/reference/android/graphics/ImageDecoder) API，這在直接從檔案、資源或內容 URI 解碼時具有效能優勢。
- 修正：多個 `coil3.Uri` 解析修正。
- [有關所有重要變更，請查閱升級指南。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha01] - 2023 年 12 月 30 日

- **新功能**：[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 支援。Coil 現在是一個 Kotlin Multiplatform 函式庫，支援 Android、JVM、iOS、macOS 和 Javascript。
- Coil 的 Maven 座標已更新為 `io.coil-kt.coil3`，其匯入已更新為 `coil3`。這使得 Coil 3 可以與 Coil 2 並行運行，而不會產生二進制相容性問題。例如，`io.coil-kt:coil:[version]` 現在是 `io.coil-kt.coil3:coil:[version]`。
- `coil-base` 和 `coil-compose-base` Artifact 已分別重命名為 `coil-core` 和 `coil-compose-core`，以與 Coroutines、Ktor 和 AndroidX 使用的命名慣例保持一致。
- [有關所有重要變更，請查閱升級指南。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [2.5.0] - 2023 年 10 月 30 日

- **新功能**：在 `coil-video` 中增加 `MediaDataSourceFetcher.Factory` 以支援解碼 `MediaDataSource` 實作。([#1795](https://github.com/coil-kt/coil/pull/1795))
- 將 `SHIFT6m` 裝置添加到硬體位圖黑名單。([#1812](https://github.com/coil-kt/coil/pull/1812))
- 修正：防範繪圖器 (painters) 返回具有一個無界維度 (unbounded dimension) 的尺寸。([#1826](https://github.com/coil-kt/coil/pull/1826))
- 修正：當快取標頭包含非 ASCII 字元時，磁碟快取在 `304 Not Modified` 後載入失敗。([#1839](https://github.com/coil-kt/coil/pull/1839))
- 修正：`FakeImageEngine` 未更新攔截器鏈的請求。([#1905](https://github.com/coil-kt/coil/pull/1905))
- 將編譯 SDK 更新至 34。
- 將 Kotlin 更新至 1.9.10。
- 將 Coroutines 更新至 1.7.3。
- 將 `accompanist-drawablepainter` 更新至 0.32.0。
- 將 `androidx.annotation` 更新至 1.7.0。
- 將 `androidx.compose.foundation` 更新至 1.5.4。
- 將 `androidx.core` 更新至 1.12.0。
- 將 `androidx.exifinterface:exifinterface` 更新至 1.3.6。
- 將 `androidx.lifecycle` 更新至 2.6.2。
- 將 `com.squareup.okhttp3` 更新至 4.12.0。
- 將 `com.squareup.okio` 更新至 3.6.0。

## [2.4.0] - 2023 年 5 月 21 日

- 將 `DiskCache` 的 `get`/`edit` 重命名為 `openSnapshot`/`openEditor`。
- 不要在 `AsyncImagePainter` 中自動將 `ColorDrawable` 轉換為 `ColorPainter`。
- 使用 `@NonRestartableComposable` 註解簡單的 `AsyncImage` 重載。
- 修正：在 `ImageSource` 中惰性呼叫 `Context.cacheDir`。
- 修正：修正發布 `coil-bom`。
- 修正：修正當硬體位圖停用時，總是將位圖設定為 `ARGB_8888` 的問題。
- 將 Kotlin 更新至 1.8.21。
- 將 Coroutines 更新至 1.7.1。
- 將 `accompanist-drawablepainter` 更新至 0.30.1。
- 將 `androidx.compose.foundation` 更新至 1.4.3。
- 將 `androidx.profileinstaller:profileinstaller` 更新至 1.3.1。
- 將 `com.squareup.okhttp3` 更新至 4.11.0。

## [2.3.0] - 2023 年 3 月 25 日

- **新功能**：引入一個新的 `coil-test` Artifact，其中包括 `FakeImageLoaderEngine`。此類別對於硬編碼影像載入器響應非常有用，可確保測試中響應的一致性和同步性（從主執行緒）。請參閱 [此處](https://coil-kt.github.io/coil/testing) 以獲取更多資訊。
- **新功能**：為 `coil-base` (Coil 的子模組) 和 `coil-compose-base` (Coil-Compose 的子模組) 增加 [基準設定檔 (baseline profiles)](https://developer.android.com/topic/performance/baselineprofiles/overview)。
    - 這提升了 Coil 的運行時效能，並應根據您的應用程式如何使用 Coil 提供 [更好的幀時間](https://github.com/coil-kt/coil/tree/main/coil-benchmark/benchmark_output.md)。
- 修正：修正解析包含編碼資料的 `file://` URI 的問題。 [#1601](https://github.com/coil-kt/coil/pull/1601)
- 修正：`DiskCache` 現在會正確計算其最大大小，如果傳遞給它的目錄不存在。 [#1620](https://github.com/coil-kt/coil/pull/1620)
- 將 `Coil.reset` 設為公開 API。 [#1506](https://github.com/coil-kt/coil/pull/1506)
- 啟用 Java 預設方法生成。 [#1491](https://github.com/coil-kt/coil/pull/1491)
- 將 Kotlin 更新至 1.8.10。
- 將 `accompanist-drawablepainter` 更新至 0.30.0。
- 將 `androidx.annotation` 更新至 1.6.0。
- 將 `androidx.appcompat:appcompat-resources` 更新至 1.6.1。
- 將 `androidx.compose.foundation` 更新至 1.4.0。
- 將 `androidx.core` 更新至 1.9.0。
- 將 `androidx.exifinterface:exifinterface` 更新至 1.3.6。
- 將 `androidx.lifecycle` 更新至 2.6.1。
- 將 `okio` 更新至 3.3.0。

## [2.2.2] - 2022 年 10 月 1 日

- 確保影像載入器在註冊其系統回呼之前完全初始化。 [#1465](https://github.com/coil-kt/coil/pull/1465)
- 在 API 30+ 上，在 `VideoFrameDecoder` 中設定首選位圖設定，以避免條帶。 [#1487](https://github.com/coil-kt/coil/pull/1487)
- 修正 `FileUriMapper` 中解析包含 `#` 的路徑的問題。 [#1466](https://github.com/coil-kt/coil/pull/1466)
- 修正從磁碟快取讀取非 ascii 標頭響應的問題。 [#1468](https://github.com/coil-kt/coil/pull/1468)
- 修正解碼資產子資料夾內視訊的問題。 [#1489](https://github.com/coil-kt/coil/pull/1489)
- 將 `androidx.annotation` 更新至 1.5.0。

## [2.2.1] - 2022 年 9 月 8 日

- 修正：`RoundedCornersTransformation` 現在能正確縮放 `input` 位圖。
- 移除對 `kotlin-parcelize` 外掛的依賴。
- 將編譯 SDK 更新至 33。
- 將 `androidx.appcompat:appcompat-resources` 降級至 1.4.2 以解決 [#1423](https://github.com/coil-kt/coil/issues/1423)。

## [2.2.0] - 2022 年 8 月 16 日

- **新功能**：在 `coil-video` 中增加 `ImageRequest.videoFramePercent` 以支援將視訊幀指定為視訊持續時間的百分比。
- **新功能**：增加 `ExifOrientationPolicy` 以配置 `BitmapFactoryDecoder` 如何處理 EXIF 方向資料。
- 修正：如果在 `RoundedCornersTransformation` 中傳遞了具有未定義維度的尺寸，則不會拋出例外。
- 修正：將 GIF 的幀延遲讀取為兩個無符號位元組而不是一個有符號位元組。
- 將 Kotlin 更新至 1.7.10。
- 將 Coroutines 更新至 1.6.4。
- 將 Compose 更新至 1.2.1。
- 將 OkHttp 更新至 4.10.0。
- 將 Okio 更新至 3.2.0。
- 將 `accompanist-drawablepainter` 更新至 0.25.1。
- 將 `androidx.annotation` 更新至 1.4.0。
- 將 `androidx.appcompat:appcompat-resources` 更新至 1.5.0。
- 將 `androidx.core` 更新至 1.8.0。

## [2.1.0] - 2022 年 5 月 17 日

- **新功能**：支援載入 `ByteArray`s。([#1202](https://github.com/coil-kt/coil/pull/1202))
- **新功能**：支援使用 `ImageRequest.Builder.css` 為 SVG 設定自訂 CSS 規則。([#1210](https://github.com/coil-kt/coil/pull/1210))
- 修正：將 `GenericViewTarget` 的私有方法轉換為受保護的。([#1273](https://github.com/coil-kt/coil/pull/1273))
- 將編譯 SDK 更新至 32。([#1268](https://github.com/coil-kt/coil/pull/1268))

## [2.0.0] - 2022 年 5 月 10 日

Coil 2.0.0 是函式庫的一個主要迭代版本，包含破壞性變更。請查閱 [升級指南](https://coil-kt.github.io/coil/upgrading/) 以了解如何升級。

- **新功能**：在 `coil-compose` 中引入 `AsyncImage`。請查閱[文件](https://coil-kt.github.io/coil/compose/)以獲取更多資訊。

```kotlin
// 顯示來自網路的影像。
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)

// 顯示來自網路的影像，帶有預留位置、圓形裁剪和交叉淡入動畫。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    contentDescription = stringResource(R.string.description),
    contentScale = ContentScale.Crop,
    modifier = Modifier.clip(CircleShape)
)
```

- **新功能**：引入公開的 `DiskCache` API。
    - 使用 `ImageLoader.Builder.diskCache` 和 `DiskCache.Builder` 配置磁碟快取。
    - 您不應將 OkHttp 的 `Cache` 與 Coil 2.0 一起使用。請參閱 [此處](https://coil-kt.github.io/coil/upgrading_to_coil2/#disk-cache) 以獲取更多資訊。
    - `Cache-Control` 和其他快取標頭仍受支援 - 除了 `Vary` 標頭，因為快取僅檢查 URL 是否匹配。此外，只有響應碼在 [200..300) 範圍內的響應才會被快取。
    - 升級到 2.0 時，現有磁碟快取將被清除。
- 最低支援 API 現在是 21。
- `ImageRequest` 的預設 `Scale` 現在是 `Scale.FIT`。
    - 此變更旨在使 `ImageRequest.scale` 與其他具有預設 `Scale` 的類別保持一致。
    - 帶有 `ImageViewTarget` 的請求仍會自動偵測其 `Scale`。
- 重構影像管道類別：
    - `Mapper`、`Fetcher` 和 `Decoder` 已重構以更靈活。
    - `Fetcher.key` 已替換為新的 `Keyer` 介面。`Keyer` 從輸入資料建立快取鍵。
    - 增加 `ImageSource`，它允許 `Decoder` 直接使用 Okio 的檔案系統 API 讀取 `File`。
- 重構 Jetpack Compose 整合：
    - `rememberImagePainter` 和 `ImagePainter` 已分別重命名為 `rememberAsyncImagePainter` 和 `AsyncImagePainter`。
    - 棄用 `LocalImageLoader`。請查閱棄用訊息以獲取更多資訊。
- 停用生成運行時非空斷言。
    - 如果您使用 Java，將 null 作為非空註解參數傳遞給函式將不再立即拋出 `NullPointerException`。Kotlin 的編譯時空安全會防止這種情況發生。
    - 此變更可使函式庫的大小更小。
- `Size` 現在由兩個 `Dimension` 值（用於寬度和高度）組成。`Dimension` 可以是正像素值或 `Dimension.Undefined`。請參閱 [此處](https://coil-kt.github.io/coil/upgrading/#size-refactor) 以獲取更多資訊。
- `BitmapPool` 和 `PoolableViewTarget` 已從函式庫中移除。
- `VideoFrameFileFetcher` 和 `VideoFrameUriFetcher` 已從函式庫中移除。請改用 `VideoFrameDecoder`，它支援所有資料來源。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 和 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt) 已從函式庫中移除。如果您使用它們，可以將其程式碼複製到您的專案中。
- 將 `Transition.transition` 更改為非暫停函式，因為不再需要暫停過渡直到其完成。
- 增加對 `bitmapFactoryMaxParallelism` 的支援，該屬性限制進行中的 `BitmapFactory` 操作的最大數量。此值預設為 4，這提升了 UI 效能。
- 增加對 `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher` 和 `transformationDispatcher` 的支援。
- 增加 `GenericViewTarget`，它處理常見的 `ViewTarget` 邏輯。
- 增加 `ByteBuffer` 到預設支援的資料類型中。
- `Disposable` 已重構並公開了底層 `ImageRequest` 的 job。
- 重構 `MemoryCache` API。
- 如果 `ImageRequest.fallback` 為 null，則 `ImageRequest.error` 現在會在 `Target` 上設定。
- `Transformation.key` 已替換為 `Transformation.cacheKey`。
- 將 Kotlin 更新至 1.6.10。
- 將 Compose 更新至 1.1.1。
- 將 OkHttp 更新至 4.9.3。
- 將 Okio 更新至 3.0.0。

自 `2.0.0-rc03` 以來的變更：
- 將 `Dimension.Original` 轉換為 `Dimension.Undefined`。
    - 這稍微改變了非像素維度的語義，以修正尺寸系統中的一些邊緣情況（[範例](https://github.com/coil-kt/coil/issues/1246)）。
- 如果 ContentScale 為 None，則使用 `Size.ORIGINAL` 載入影像。
- 修正先應用 `ImageView.load` 建構器引數而不是最後應用。
- 修正如果響應未修改則不組合 HTTP 標頭的問題。

## [2.0.0-rc03] - 2022 年 4 月 11 日

- 移除 `ScaleResolver` 介面。
- 將 `Size` 建構子轉換為函式。
- 將 `Dimension.Pixels` 的 `toString` 更改為僅為其像素值。
- 防範 `SystemCallbacks.onTrimMemory` 中的罕見崩潰。
- 將 Coroutines 更新至 1.6.1。

## [2.0.0-rc02] - 2022 年 3 月 20 日

- 還原 `ImageRequest` 的預設尺寸為當前顯示尺寸，而不是 `Size.ORIGINAL`。
- 修正 `DiskCache.Builder` 被標記為實驗性的問題。只有 `DiskCache` 的方法是實驗性的。
- 修正將影像載入到 `ImageView` 中，如果其中一個維度為 `WRAP_CONTENT`，則會以原始尺寸載入影像而不是適應限定維度的情況。
- 移除 `MemoryCache.Key`、`MemoryCache.Value` 和 `Parameters.Entry` 中的元件函式。

## [2.0.0-rc01] - 2022 年 3 月 2 日

自 `1.4.0` 以來的重大變更：

- 最低支援 API 現在是 21。
- 重構 Jetpack Compose 整合。
    - `rememberImagePainter` 已重命名為 `rememberAsyncImagePainter`。
    - 增加對 `AsyncImage` 和 `SubcomposeAsyncImage` 的支援。請查閱[文件](https://coil-kt.github.io/coil/compose/)以獲取更多資訊。
    - 棄用 `LocalImageLoader`。請查閱棄用訊息以獲取更多資訊。
- Coil 2.0 有自己的磁碟快取實作，不再依賴 OkHttp 進行磁碟快取。
    - 使用 `ImageLoader.Builder.diskCache` 和 `DiskCache.Builder` 配置磁碟快取。
    - 您**不應**將 OkHttp 的 `Cache` 與 Coil 2.0 一起使用，因為如果在寫入時執行緒被中斷，快取可能會損壞。
    - `Cache-Control` 和其他快取標頭仍受支援 - 除了 `Vary` 標頭，因為快取僅檢查 URL 是否匹配。此外，只有響應碼在 [200..300) 範圍內的響應才會被快取。
    - 升級到 2.0 時，現有磁碟快取將被清除。
- `ImageRequest` 的預設 `Scale` 現在是 `Scale.FIT`。
    - 此變更旨在使 `ImageRequest.scale` 與其他具有預設 `Scale` 的類別保持一致。
    - 帶有 `ImageViewTarget` 的請求仍會自動偵測其 `Scale`。
- `ImageRequest` 的預設尺寸現在是 `Size.ORIGINAL`。
- 重構影像管道類別：
    - `Mapper`、`Fetcher` 和 `Decoder` 已重構以更靈活。
    - `Fetcher.key` 已替換為新的 `Keyer` 介面。`Keyer` 從輸入資料建立快取鍵。
    - 增加 `ImageSource`，它允許 `Decoder` 直接使用 Okio 的檔案系統 API 讀取 `File`。
- 停用生成運行時非空斷言。
    - 如果您使用 Java，將 null 作為非空註解參數傳遞給函式將不再立即拋出 `NullPointerException`。如果您使用 Kotlin，則基本沒有變化。
    - 此變更可使函式庫的大小更小。
- `Size` 現在由兩個 `Dimension` 值（用於寬度和高度）組成。`Dimension` 可以是正像素值或 `Dimension.Original`。
- `BitmapPool` 和 `PoolableViewTarget` 已從函式庫中移除。
- `VideoFrameFileFetcher` 和 `VideoFrameUriFetcher` 已從函式庫中移除。請改用 `VideoFrameDecoder`，它支援所有資料來源。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 和 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt) 已從函式庫中移除。如果您使用它們，可以將其程式碼複製到您的專案中。
- 將 `Transition.transition` 更改為非暫停函式，因為不再需要暫停過渡直到其完成。
- 增加對 `bitmapFactoryMaxParallelism` 的支援，該屬性限制進行中的 `BitmapFactory` 操作的最大數量。此值預設為 4，這提升了 UI 效能。
- 增加對 `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher` 和 `transformationDispatcher` 的支援。
- 增加 `GenericViewTarget`，它處理常見的 `ViewTarget` 邏輯。
- 增加 `ByteBuffer` 到預設支援的資料類型中。
- `Disposable` 已重構並公開了底層 `ImageRequest` 的 job。
- 重構 `MemoryCache` API。
- 如果 `ImageRequest.fallback` 為 null，則 `ImageRequest.error` 現在會在 `Target` 上設定。
- `Transformation.key` 已替換為 `Transformation.cacheKey`。
- 將 Kotlin 更新至 1.6.10。
- 將 Compose 更新至 1.1.1。
- 將 OkHttp 更新至 4.9.3。
- 將 Okio 更新至 3.0.0。

自 `2.0.0-alpha09` 以來的變更：

- 移除 `-Xjvm-default=all` 編譯器旗標。
- 修正如果多個帶有 `must-revalidate`/`e-tag` 的請求同時執行時，影像載入失敗的問題。
- 修正 `DecodeUtils.isSvg` 如果 `<svg` 標籤後有新行字元則返回 false 的問題。
- 使 `LocalImageLoader.provides` 棄用訊息更清晰。
- 將 Compose 更新至 1.1.1。
- 將 `accompanist-drawablepainter` 更新至 0.23.1。

## [2.0.0-alpha09] - 2022 年 2 月 16 日

- 修正 `AsyncImage` 創建無效約束的問題。([#1134](https://github.com/coil-kt/coil/pull/1134))
- 為 `AsyncImagePainter` 增加 `ContentScale` 引數。([#1144](https://github.com/coil-kt/coil/pull/1144))
    - 這應該設定為與 `Image` 上設定的相同值，以確保影像以正確的尺寸載入。
- 增加 `ScaleResolver` 以支援惰性解析 `ImageRequest` 的 `Scale`。([#1134](https://github.com/coil-kt/coil/pull/1134))
    - `ImageRequest.scale` 應替換為 `ImageRequest.scaleResolver.scale()`。
- 將 Compose 更新至 1.1.0。
- 將 `accompanist-drawablepainter` 更新至 0.23.0。
- 將 `androidx.lifecycle` 更新至 2.4.1。

## [2.0.0-alpha08] - 2022 年 2 月 7 日

- 更新 `DiskCache` 和 `ImageSource` 以使用 Okio 的 `FileSystem` API。([#1115](https://github.com/coil-kt/coil/pull/1115))

## [2.0.0-alpha07] - 2022 年 1 月 30 日

- 顯著提升 `AsyncImage` 效能，並將 `AsyncImage` 拆分為 `AsyncImage` 和 `SubcomposeAsyncImage`。([#1048](https://github.com/coil-kt/coil/pull/1048))
    - `SubcomposeAsyncImage` 提供 `loading`/`success`/`error`/`content` 插槽 API，並使用效能較差的子組合。
    - `AsyncImage` 提供 `placeholder`/`error`/`fallback` 引數，用於覆寫載入時或請求不成功時繪製的 `Painter`。`AsyncImage` 不使用子組合，效能比 `SubcomposeAsyncImage` 好得多。
    - 從 `SubcomposeAsyncImage.content` 中移除 `AsyncImagePainter.State` 引數。如果需要，請使用 `painter.state`。
    - 為 `AsyncImage` 和 `SubcomposeAsyncImage` 增加 `onLoading`/`onSuccess`/`onError` 回呼。
- 棄用 `LocalImageLoader`。([#1101](https://github.com/coil-kt/coil/pull/1101))
- 增加對 `ImageRequest.tags` 的支援。([#1066](https://github.com/coil-kt/coil/pull/1066))
- 將 `isGif`、`isWebP`、`isAnimatedWebP`、`isHeif` 和 `isAnimatedHeif` 從 `DecodeUtils` 移動到 `coil-gif`。將 `isSvg` 增加到 `coil-svg`。([#1117](https://github.com/coil-kt/coil/pull/1117))
- 將 `FetchResult` 和 `DecodeResult` 轉換為非資料類別。([#1114](https://github.com/coil-kt/coil/pull/1114))
- 移除未使用的 `DiskCache.Builder` 上下文引數。([#1099](https://github.com/coil-kt/coil/pull/1099))
- 修正具有原始尺寸的位圖資源的縮放問題。([#1072](https://github.com/coil-kt/coil/pull/1072))
- 修正 `ImageDecoderDecoder` 中無法關閉 `ImageDecoder` 的問題。([#1109](https://github.com/coil-kt/coil/pull/1109))
- 修正將可繪製物件 (drawable) 轉換為位圖時縮放不正確的問題。([#1084](https://github.com/coil-kt/coil/pull/1084))
- 將 Compose 更新至 1.1.0-rc03。
- 將 `accompanist-drawablepainter` 更新至 0.22.1-rc。
- 將 `androidx.appcompat:appcompat-resources` 更新至 1.4.1。

## [2.0.0-alpha06] - 2021 年 12 月 24 日

- 增加 `ImageSource.Metadata` 以支援從資產、資源和內容 URI 解碼，而無需緩衝或暫存檔案。([#1060](https://github.com/coil-kt/coil/pull/1060))
- 延遲執行影像請求，直到 `AsyncImage` 具有正約束。([#1028](https://github.com/coil-kt/coil/pull/1028))
- 修正如果 `loading`、`success` 和 `error` 都設定時，`AsyncImage` 使用 `DefaultContent` 的問題。([#1026](https://github.com/coil-kt/coil/pull/1026))
- 使用 `androidx` 的 `LruCache` 而不是平台 `LruCache`。([#1047](https://github.com/coil-kt/coil/pull/1047))
- 將 Kotlin 更新至 1.6.10。
- 將 Coroutines 更新至 1.6.0。
- 將 Compose 更新至 1.1.0-rc01。
- 將 `accompanist-drawablepainter` 更新至 0.22.0-rc。
- 將 `androidx.collection` 更新至 1.2.0。

## [2.0.0-alpha05] - 2021 年 11 月 28 日

- **重要**：重構 `Size` 以支援對任何維度使用影像的原始尺寸。
    - `Size` 現在由兩個 `Dimension` 值組成，分別表示其寬度和高度。`Dimension` 可以是正像素值或 `Dimension.Original`。
    - 進行此變更是為了更好地支援當一個維度是固定像素值時的無界寬度/高度值（例如 `wrap_content`、`Constraints.Infinity`）。
- 修正：支援 `AsyncImage` 的檢查模式 (預覽)。
- 修正：如果 `imageLoader.memoryCache` 為 null，`SuccessResult.memoryCacheKey` 應始終為 `null`。
- 將 `ImageLoader`、`SizeResolver` 和 `ViewSizeResolver` 類似建構子的 `invoke` 函式轉換為頂層函式。
- 使 `CrossfadeDrawable` 的開始和結束可繪製物件成為公開 API。
- 變異 `ImageLoader` 的預留位置/錯誤/備用可繪製物件。
- 為 `SuccessResult` 的建構子增加預設引數。
- 依賴 `androidx.collection` 而不是 `androidx.collection-ktx`。
- 將 OkHttp 更新至 4.9.3。

## [2.0.0-alpha04] - 2021 年 11 月 22 日

- **新功能**：為 `coil-compose` 增加 `AsyncImage`。
    - `AsyncImage` 是一個可組合項，它非同步執行 `ImageRequest` 並渲染結果。
    - **`AsyncImage` 旨在替代大多數用例的 `rememberImagePainter`。**
    - 其 API 尚未最終確定，在最終的 2.0 版本發布之前可能會發生變化。
    - 它與 `Image` 具有相似的 API，並支援相同的引數：`Alignment`、`ContentScale`、`alpha`、`ColorFilter` 和 `FilterQuality`。
    - 它支援使用 `content`、`loading`、`success` 和 `error` 引數覆寫每個 `AsyncImagePainter` 狀態繪製的內容。
    - 它修正了 `rememberImagePainter` 在解析影像尺寸和比例方面存在的一些設計問題。
    - 範例用法：

```kotlin
// 只繪製影像。
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null, // 避免使用 `null`，如果可能，請將其設定為本地化字串。
)

// 繪製帶有圓形裁剪、交叉淡入和覆寫 `loading` 狀態的影像。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    loading = {
        CircularProgressIndicator()
    },
    contentScale = ContentScale.Crop
)

// 繪製帶有圓形裁剪、交叉淡入和覆寫所有狀態的影像。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    contentScale = ContentScale.Crop
) { state ->
    if (state is AsyncImagePainter.State.Loading) {
        CircularProgressIndicator()
    } else {
        AsyncImageContent() // 繪製影像。
    }
}
```

- **重要**：將 `ImagePainter` 重命名為 `AsyncImagePainter`，將 `rememberImagePainter` 重命名為 `rememberAsyncImagePainter`。
    - 不再支援 `ExecuteCallback`。要讓 `AsyncImagePainter` 跳過等待 `onDraw` 被呼叫，請改為設定 `ImageRequest.size(OriginalSize)`（或任何尺寸）。
    - 為 `rememberAsyncImagePainter` 增加一個可選的 `FilterQuality` 引數。
- 在 `DiskCache` 中使用協程進行清理操作，並增加 `DiskCache.Builder.cleanupDispatcher`。
- 修正使用 `ImageLoader.Builder.placeholder` 設定的預留位置的 Compose 預覽。
- 使用 `@ReadOnlyComposable` 標記 `LocalImageLoader.current` 以生成更高效的程式碼。
- 將 Compose 更新至 1.1.0-beta03，並依賴 `compose.foundation` 而不是 `compose.ui`。
- 將 `androidx.appcompat-resources` 更新至 1.4.0。

## [2.0.0-alpha03] - 2021 年 11 月 12 日

- 增加在 Android 29+ 上載入音樂縮圖的功能。([#967](https://github.com/coil-kt/coil/pull/967))
- 修正：使用 `context.resources` 載入當前套件的資源。([#968](https://github.com/coil-kt/coil/pull/968))
- 修正：`clear` -> `dispose` 替換表達式。([#970](https://github.com/coil-kt/coil/pull/970))
- 將 Compose 更新至 1.0.5。
- 將 `accompanist-drawablepainter` 更新至 0.20.2。
- 將 Okio 更新至 3.0.0。
- 將 `androidx.annotation` 更新至 1.3.0。
- 將 `androidx.core` 更新至 1.7.0。
- 將 `androidx.lifecycle` 更新至 2.4.0。
    - 移除對 `lifecycle-common-java8` 的依賴，因為它已合併到 `lifecycle-common` 中。

## [2.0.0-alpha02] - 2021 年 10 月 24 日

- 增加一個新的 `coil-bom` Artifact，其中包括一個 [物料清單 (bill of materials)](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)。
    - 匯入 `coil-bom` 允許您依賴其他 Coil Artifact 而無需指定版本。
- 修正使用 `ExecuteCallback.Immediate` 時載入影像失敗的問題。
- 將 Okio 更新至 3.0.0-alpha.11。
    - 這也解決了與 Okio 3.0.0-alpha.11 的相容性問題。
- 將 Kotlin 更新至 1.5.31。
- 將 Compose 更新至 1.0.4。

## [2.0.0-alpha01] - 2021 年 10 月 11 日

Coil 2.0.0 是函式庫的下一個主要迭代版本，具有新功能、效能改進、API 改進和各種錯誤修正。在 2.0.0 穩定版發布之前，此版本可能與未來的 alpha 版本存在二進制/源碼不相容問題。

- **重要**：最低支援 API 現在是 21。
- **重要**：啟用 `-Xjvm-default=all`。
    - 這會生成 Java 8 預設方法，而不是使用 Kotlin 的預設介面方法支援。請查閱 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 以獲取更多資訊。
    - **您還需要將 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 添加到您的建置檔案中。**請參閱 [此處](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8) 了解如何操作。
- **重要**：Coil 現在擁有自己的磁碟快取實作，不再依賴 OkHttp 進行磁碟快取。
    - 進行此變更是為了：
        - 更好地支援解碼影像時的執行緒中斷。當影像請求快速啟動和停止時，這會提升效能。
        - 支援公開由 `File` 支援的 `ImageSource`。當 Android API 需要 `File` 進行解碼時（例如 `MediaMetadataRetriever`），這可以避免不必要的複製。
        - 支援直接讀取/寫入磁碟快取檔案。
    - 使用 `ImageLoader.Builder.diskCache` 和 `DiskCache.Builder` 配置磁碟快取。
    - 您**不應**將 OkHttp 的 `Cache` 與 Coil 2.0 一起使用，因為如果在寫入時執行緒被中斷，它可能會損壞。
    - `Cache-Control` 和其他快取標頭仍受支援 - 除了 `Vary` 標頭，因為快取僅檢查 URL 是否匹配。此外，只有響應碼在 [200..300) 範圍內的響應才會被快取。
    - 可以使用 `ImageLoader.Builder.respectCacheHeaders` 啟用或停用快取標頭的支援。
    - 升級到 2.0 時，現有磁碟快取將被清除並重建。
- **重要**：`ImageRequest` 的預設 `Scale` 現在是 `Scale.FIT`
    - 此變更旨在使 `ImageRequest.scale` 與其他具有預設 `Scale` 的類別保持一致。
    - 帶有 `ImageViewTarget` 的請求仍會自動偵測其縮放比例。
- 影像管道類別的重大變更：
    - `Mapper`、`Fetcher` 和 `Decoder` 已重構以更靈活。
    - `Fetcher.key` 已替換為新的 `Keyer` 介面。`Keyer` 從輸入資料建立快取鍵。
    - 增加 `ImageSource`，它允許 `Decoder` 直接解碼 `File`。
- `BitmapPool` 和 `PoolableViewTarget` 已從函式庫中移除。移除位圖池化的原因：
    - 它在 API 23 及以下版本上最有效，但在較新的 Android 版本中效果已降低。
    - 移除位圖池化允許 Coil 使用不可變位圖，這具有效能優勢。
    - 管理位圖池會產生運行時開銷。
    - 位圖池化對 Coil 的 API 產生設計限制，因為它需要追蹤位圖是否符合池化條件。移除位圖池化允許 Coil 在更多地方（例如 `Listener`、`Disposable`）公開結果 `Drawable`。此外，這意味著 Coil 不必清除 `ImageView`，這可能會導致 [問題](https://github.com/coil-kt/coil/issues/650)。
    - 位圖池化 [容易出錯](https://github.com/coil-kt/coil/issues/546)。分配一個新位圖比嘗試重新使用可能仍在使用的位圖安全得多。
- `MemoryCache` 已重構以更靈活。
- 停用生成運行時非空斷言。
    - 如果您使用 Java，將 null 作為非空註解參數傳遞給函式將不再立即拋出 `NullPointerException`。如果您使用 Kotlin，則基本沒有變化。
    - 此變更可使函式庫的大小更小。
- `VideoFrameFileFetcher` 和 `VideoFrameUriFetcher` 已從函式庫中移除。請改用 `VideoFrameDecoder`，它支援所有資料來源。
- 增加對 `bitmapFactoryMaxParallelism` 的支援，該屬性限制進行中的 `BitmapFactory` 操作的最大數量。此值預設為 4，這提升了 UI 效能。
- 增加對 `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher` 和 `transformationDispatcher` 的支援。
- `Disposable` 已重構並公開了底層 `ImageRequest` 的 job。
- 將 `Transition.transition` 更改為非暫停函式，因為不再需要暫停過渡直到其完成。
- 增加 `GenericViewTarget`，它處理常見的 `ViewTarget` 邏輯。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 和 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt) 已從函式庫中移除。
    - 如果您使用它們，可以將其程式碼複製到您的專案中。
- 如果 `ImageRequest.fallback` 為 null，則 `ImageRequest.error` 現在會在 `Target` 上設定。
- `Transformation.key` 已替換為 `Transformation.cacheKey`。
- `ImageRequest.Listener` 在 `onSuccess` 和 `onError` 中分別返回 `SuccessResult`/`ErrorResult`。
- 增加 `ByteBuffer` 到預設支援的資料類型中。
- 移除多個類別的 `toString` 實作。
- 將 OkHttp 更新至 4.9.2。
- 將 Okio 更新至 3.0.0-alpha.10。

## [1.4.0] - 2021 年 10 月 6 日

- **新功能**：將 `ImageResult` 添加到 `ImagePainter.State.Success` 和 `ImagePainter.State.Error`。([#887](https://github.com/coil-kt/coil/pull/887))
    - 這是一個對 `ImagePainter.State.Success` 和 `ImagePainter.State.Error` 簽章的二進制不相容變更，但這些 API 被標記為實驗性。
- 僅在 `View.isShown` 為 `true` 時執行 `CrossfadeTransition`。之前它只會檢查 `View.isVisible`。([#898](https://github.com/coil-kt/coil/pull/898))
- 修正由於捨入問題，如果縮放乘數略小於 1，則可能發生記憶體快取遺失。([#899](https://github.com/coil-kt/coil/pull/899))
- 使非內聯 `ComponentRegistry` 方法公開。([#925](https://github.com/coil-kt/coil/pull/925))
- 依賴 `accompanist-drawablepainter` 並移除 Coil 的自訂 `DrawablePainter` 實作。([#845](https://github.com/coil-kt/coil/pull/845))
- 移除 Java 8 方法的使用，以防範去糖化問題。([#924](https://github.com/coil-kt/coil/pull/924))
- 將 `ImagePainter.ExecuteCallback` 提升為穩定 API。([#927](https://github.com/coil-kt/coil/pull/927))
- 將編譯 SDK 更新至 31。
- 將 Kotlin 更新至 1.5.30。
- 將 Coroutines 更新至 1.5.2。
- 將 Compose 更新至 1.0.3。

## [1.3.2] - 2021 年 8 月 4 日

- `coil-compose` 現在依賴於 `compose.ui` 而不是 `compose.foundation`。
    - `compose.ui` 是一個較小的依賴項，因為它是 `compose.foundation` 的子集。
- 將 Jetpack Compose 更新至 1.0.1。
- 將 Kotlin 更新至 1.5.21。
- 將 Coroutines 更新至 1.5.1。
- 將 `androidx.exifinterface:exifinterface` 更新至 1.3.3。

## [1.3.1] - 2021 年 7 月 28 日

- 將 Jetpack Compose 更新至 `1.0.0`。恭喜 Compose 團隊 [穩定版發布](https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html)！
- 將 `androidx.appcompat:appcompat-resources` 更新至 1.3.1。

## [1.3.0] - 2021 年 7 月 10 日

- **新功能**：增加對 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的支援。它基於 [Accompanist](https://github.com/google/accompanist/) 的 Coil 整合，但有一些變更。請查閱 [文件](https://coil-kt.github.io/coil/compose/) 以獲取更多資訊。
- 增加 `allowConversionToBitmap` 以啟用/停用 `Transformation` 的自動位圖轉換。([#775](https://github.com/coil-kt/coil/pull/775))
- 增加 `enforceMinimumFrameDelay` 到 `ImageDecoderDecoder` 和 `GifDecoder`，以在 GIF 幀延遲低於閾值時啟用重寫。([#783](https://github.com/coil-kt/coil/pull/783))
    - 此功能預設為停用，但在未來版本中將預設為啟用。
- 增加對啟用/停用 `ImageLoader` 內部網路觀察器的支援。([#741](https://github.com/coil-kt/coil/pull/741))
- 修正 `BitmapFactoryDecoder` 解碼的位圖密度。([#776](https://github.com/coil-kt/coil/pull/776))
- 修正 Licensee 未找到 Coil 的授權 URL。([#774](https://github.com/coil-kt/coil/pull/774))
- 將 `androidx.core:core-ktx` 更新至 1.6.0。

## [1.2.2] - 2021 年 6 月 4 日

- 修正將具有共享狀態的可繪製物件轉換為位圖時的競態條件。([#771](https://github.com/coil-kt/coil/pull/771))
- 修正 `ImageLoader.Builder.fallback` 設定了 `error` 可繪製物件而不是 `fallback` 可繪製物件的問題。
- 修正 `ResourceUriFetcher` 返回不正確資料來源的問題。([#770](https://github.com/coil-kt/coil/pull/770))
- 修正 API 26 和 27 上沒有可用檔案描述符的日誌檢查。
- 修正平台向量可繪製物件支援的版本檢查不正確。([#751](https://github.com/coil-kt/coil/pull/751))
- 更新 Kotlin (1.5.10)。
- 更新 Coroutines (1.5.0)。
- 更新 `androidx.appcompat:appcompat-resources` 至 1.3.0。
- 更新 `androidx.core:core-ktx` 至 1.5.0。

## [1.2.1] - 2021 年 4 月 27 日

- 修正：`VideoFrameUriFetcher` 嘗試處理 http/https URI 的問題。([#734](https://github.com/coil-kt/coil/pull/734)

## [1.2.0] - 2021 年 4 月 12 日

- **重要**：在 `SvgDecoder` 中使用 SVG 的視圖邊界計算其長寬比。([#688](https://github.com/coil-kt/coil/pull/688))
    - 之前，`SvgDecoder` 使用 SVG 的 `width`/`height` 元素來確定其長寬比，但這不正確地遵循 SVG 規範。
    - 要恢復舊行為，請在建構 `SvgDecoder` 時設定 `useViewBoundsAsIntrinsicSize = false`。
- **新功能**：增加 `VideoFrameDecoder` 以支援從任何來源解碼視訊幀。([#689](https://github.com/coil-kt/coil/pull/689))
- **新功能**：支援使用來源內容而不是僅 MIME 類型自動偵測 SVG。([#654](https://github.com/coil-kt/coil/pull/654))
- **新功能**：支援使用 `ImageLoader.newBuilder()` 共享資源。([#653](https://github.com/coil-kt/coil/pull/653))
    - 重要的是，這使得 `ImageLoader` 實例之間可以共享記憶體快取。
- **新功能**：增加對使用 `AnimatedTransformation` 進行動畫影像轉換的支援。([#659](https://github.com/coil-kt/coil/pull/659))
- **新功能**：增加對動畫可繪製物件的開始/結束回呼的支援。([#676](https://github.com/coil-kt/coil/pull/676))

---

- 修正解析 HEIF/HEIC 檔案的 EXIF 資料問題。([#664](https://github.com/coil-kt/coil/pull/664))
- 修正如果位圖池化停用時未使用 `EmptyBitmapPool` 實作的問題。([#638](https://github.com/coil-kt/coil/pull/638))
    - 如果沒有此修正，位圖池化雖然仍被正確停用，但它使用了更重量級的 `BitmapPool` 實作。
- 修正 `MovieDrawable.getOpacity` 可能錯誤返回透明的情況。([#682](https://github.com/coil-kt/coil/pull/682))
- 防範預設暫存目錄不存在的情況。([#683](https://github.com/coil-kt/coil/pull/683))

---

- 使用 JVM IR 後端建置。([#670](https://github.com/coil-kt/coil/pull/670))
- 更新 Kotlin (1.4.32)。
- 更新 Coroutines (1.4.3)。
- 更新 OkHttp (3.12.13)。
- 更新 `androidx.lifecycle:lifecycle-common-java8` 至 2.3.1。

## [1.1.1] - 2021 年 1 月 11 日

- 修正 `ViewSizeResolver.size` 可能因協程多次恢復而拋出 `IllegalStateException` 的情況。
- 修正 `HttpFetcher` 如果從主執行緒呼叫則會永遠阻塞。
    - 使用 `ImageRequest.dispatcher(Dispatchers.Main.immediate)` 強制在主執行緒執行的請求將失敗並拋出 `NetworkOnMainThreadException`，除非 `ImageRequest.networkCachePolicy` 設定為 `CachePolicy.DISABLED` 或 `CachePolicy.WRITE_ONLY`。
- 如果視訊具有旋轉中繼資料，則旋轉 `VideoFrameFetcher` 的視訊幀。
- 更新 Kotlin (1.4.21)。
- 更新 Coroutines (1.4.2)。
- 更新 Okio (2.10.0)。
- 更新 `androidx.exifinterface:exifinterface` (1.3.2)。

## [1.1.0] - 2020 年 11 月 24 日

- **重要**：將 `CENTER` 和 `MATRIX` `ImageView` 縮放類型更改為解析為 `OriginalSize`。([#587](https://github.com/coil-kt/coil/pull/587))
    - 此變更僅影響當請求的尺寸未明確指定時的隱式尺寸解析演算法。
    - 進行此變更是為了確保影像請求的視覺結果與 `ImageView.setImageResource`/`ImageView.setImageURI` 一致。要恢復舊行為，請在建構請求時設定 `ViewSizeResolver`。
- **重要**：如果視圖的佈局參數為 `WRAP_CONTENT`，則從 `ViewSizeResolver` 返回顯示尺寸。([#562](https://github.com/coil-kt/coil/pull/562))
    - 之前，我們只會在視圖完全佈局後返回顯示尺寸。此變更使得典型行為更加一致和直觀。
- 增加控制 alpha 預乘的功能。([#569](https://github.com/coil-kt/coil/pull/569))
- 支援 `CrossfadeDrawable` 中偏好精確固有尺寸。([#585](https://github.com/coil-kt/coil/pull/585))
- 檢查包含版本的完整 GIF 標頭。([#564](https://github.com/coil-kt/coil/pull/564))
- 增加一個空的位圖池實作。([#561](https://github.com/coil-kt/coil/pull/561))
- 使 `EventListener.Factory` 成為函式介面。([#575](https://github.com/coil-kt/coil/pull/575))
- 穩定 `EventListener`。([#574](https://github.com/coil-kt/coil/pull/574))
- 為 `ImageRequest.Builder.placeholderMemoryCacheKey` 增加 `String` 重載。
- 為 `ViewSizeResolver` 建構子增加 `@JvmOverloads`。
- 修正：變異 `CrossfadeDrawable` 中的開始/結束可繪製物件。([#572](https://github.com/coil-kt/coil/pull/572))
- 修正：修正 GIF 在第二次載入時不播放的問題。([#577](https://github.com/coil-kt/coil/pull/534))
- 更新 Kotlin (1.4.20) 並遷移到 `kotlin-parcelize` 外掛。
- 更新 Coroutines (1.4.1)。

## [1.0.0] - 2020 年 10 月 22 日

自 `0.13.0` 以來的變更：
- 增加 `Context.imageLoader` 擴充函式。([#534](https://github.com/coil-kt/coil/pull/534))
- 增加 `ImageLoader.executeBlocking` 擴充函式。([#537](https://github.com/coil-kt/coil/pull/537))
- 如果替換了先前的單例影像載入器，則不要關閉它。([#533](https://github.com/coil-kt/coil/pull/533))

自 `1.0.0-rc3` 以來的變更：
- 修正：防範缺少/無效的 ActivityManager。([#541](https://github.com/coil-kt/coil/pull/541))
- 修正：允許 OkHttp 快取不成功的響應。([#551](https://github.com/coil-kt/coil/pull/551))
- 將 Kotlin 更新至 1.4.10。
- 將 Okio 更新至 2.9.0。
- 將 `androidx.exifinterface:exifinterface` 更新至 1.3.1。

## [1.0.0-rc3] - 2020 年 9 月 21 日

- 由於不穩定性，還原使用 [`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 編譯器旗標。
    - **這是一個源碼相容，但二進制不相容的變更，與之前的發布候選版本相比。**
- 增加 `Context.imageLoader` 擴充函式。([#534](https://github.com/coil-kt/coil/pull/534))
- 增加 `ImageLoader.executeBlocking` 擴充函式。([#537](https://github.com/coil-kt/coil/pull/537))
- 如果替換了先前的單例影像載入器，則不要關閉它。([#533](https://github.com/coil-kt/coil/pull/533))
- 更新 AndroidX 依賴：
    - `androidx.exifinterface:exifinterface` -> 1.3.0

## [1.0.0-rc2] - 2020 年 9 月 3 日

- **此版本需要 Kotlin 1.4.0 或更高版本。**
- [0.13.0](#0130---september-3-2020) 中存在的所有變更。
- 依賴基礎 Kotlin `stdlib` 而不是 `stdlib-jdk8`。

## [0.13.0] - 2020 年 9 月 3 日

- **重要**：預設在主執行緒上啟動攔截器鏈。([#513](https://github.com/coil-kt/coil/pull/513))
    - 這在很大程度上恢復了 `0.11.0` 及以下版本的行為，其中記憶體快取會同步在主執行緒上檢查。
    - 要恢復與 `0.12.0` 相同的行為，即在 `ImageRequest.dispatcher` 上檢查記憶體快取，請設定 `ImageLoader.Builder.launchInterceptorChainOnMainThread(false)`。
    - 請參閱 [`launchInterceptorChainOnMainThread`](https://coil-kt.github.io/coil/api/coil-core/coil3/-image-loader/-builder/launch-interceptor-chain-on-main-thread/) 以獲取更多資訊。

---

- 修正：修正如果請求在分離的片段中的 `ViewTarget` 上啟動時可能發生的記憶體洩漏。([#518](https://github.com/coil-kt/coil/pull/518))
- 修正：使用 `ImageRequest.context` 載入資源 URI。([#517](https://github.com/coil-kt/coil/pull/517))
- 修正：修正可能導致後續請求未保存到磁碟快取的競態條件。([#510](https://github.com/coil-kt/coil/pull/510))
- 修正：在 API 18 上使用 `blockCountLong` 和 `blockSizeLong`。

---

- 使 `ImageLoaderFactory` 成為函式介面。
- 增加 `ImageLoader.Builder.addLastModifiedToFileCacheKey`，它允許您啟用/停用為從 `File` 載入的影像的記憶體快取鍵增加上次修改時間戳。

---

- 將 Kotlin 更新至 1.4.0。
- 將 Coroutines 更新至 1.3.9。
- 將 Okio 更新至 2.8.0。

## [1.0.0-rc1] - 2020 年 8 月 18 日

- **此版本需要 Kotlin 1.4.0 或更高版本。**
- 將 Kotlin 更新至 1.4.0 並啟用 [`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。
    - **[請參閱此處](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8) 了解如何在您的建置檔案中啟用 `-Xjvm-default=all`。**
    - 這會為預設的 Kotlin 介面方法生成 Java 8 預設方法。
- 移除 0.12.0 中所有現有的棄用方法。
- 將 Coroutines 更新至 1.3.9。

## [0.12.0] - 2020 年 8 月 18 日

- **破壞性變更**：`LoadRequest` 和 `GetRequest` 已被 `ImageRequest` 替換：
    - `ImageLoader.execute(LoadRequest)` -> `ImageLoader.enqueue(ImageRequest)`
    - `ImageLoader.execute(GetRequest)` -> `ImageLoader.execute(ImageRequest)`
    - `ImageRequest` 實作了 `equals`/`hashCode`。
- **破壞性變更**：許多類別已重命名和/或更改套件：
    - `coil.request.RequestResult` -> `coil.request.ImageResult`
    - `coil.request.RequestDisposable` -> `coil.request.Disposable`
    - `coil.bitmappool.BitmapPool` -> `coil.bitmap.BitmapPool`
    - `coil.DefaultRequestOptions` -> `coil.request.DefaultRequestOptions`
- **破壞性變更**：[`SparseIntArraySet`](https://github.com/coil-kt/coil/blob/f52addd039f0195b66f93cb0f1cad59b0832f784/coil-core/src/main/java/coil/collection/SparseIntArraySet.kt) 已從公開 API 中移除。
- **破壞性變更**：`TransitionTarget` 不再實作 `ViewTarget`。
- **破壞性變更**：`ImageRequest.Listener.onSuccess` 的簽章已更改為返回 `ImageResult.Metadata` 而不是僅 `DataSource`。
- **破壞性變更**：移除對 `LoadRequest.aliasKeys` 的支援。此 API 最好通過對記憶體快取的直接讀寫存取來處理。

---

- **重要**：記憶體快取中的值不再同步解析（如果從主執行緒呼叫）。
    - 此變更也是支援在背景調度器上執行 `Interceptor` 的必要條件。
    - 此變更還將更多工作從主執行緒轉移開，提升了效能。
- **重要**：`Mappers` 現在在背景調度器上執行。作為副作用，不再**自動**支援自動位圖取樣。要實現相同的效果，請使用前一個請求的 `MemoryCache.Key` 作為後續請求的 `placeholderMemoryCacheKey`。[請參閱此處的範例](https://coil-kt.github.io/coil/recipes/#using-a-memory-cache-key-as-a-placeholder)。
    - `placeholderMemoryCacheKey` API 提供了更多自由，因為您可以“連結”兩個具有不同資料（例如，小/大影像的不同 URL）的影像請求。
- **重要**：Coil 的 `ImageView` 擴充函式已從 `coil.api` 套件移至 `coil` 套件。
    - 使用查找和替換將 `import coil.api.load` 重構為 `import coil.load`。不幸的是，無法使用 Kotlin 的 `ReplaceWith` 功能替換匯入。
- **重要**：如果可繪製物件不是相同的影像，則使用標準交叉淡入。
- **重要**：在 API 24+ 上優先使用不可變位圖。
- **重要**：`MeasuredMapper` 已被棄用，取而代之的是新的 `Interceptor` 介面。請參閱 [此處](https://gist.github.com/colinrtwhite/90267704091467451e46b21b95154299) 的範例，了解如何將 `MeasuredMapper` 轉換為 `Interceptor`。
    - `Interceptor` 是一個限制較少的 API，允許更廣泛的自訂邏輯。
- **重要**：`ImageRequest.data` 現在是非 null 的。如果您創建 `ImageRequest` 時未設定其資料，則會將 `NullRequestData` 作為其資料返回。

---

- **新功能**：增加對 `ImageLoader` 的 `MemoryCache` 的直接讀寫存取支援。請參閱 [文件](https://coil-kt.github.io/coil/getting_started/#memory-cache) 以獲取更多資訊。
- **新功能**：增加對 `Interceptor` 的支援。請參閱 [文件](https://coil-kt.github.io/coil/image_pipeline/#interceptors) 以獲取更多資訊。Coil 的 `Interceptor` 設計深受 [OkHttp](https://github.com/square/okhttp) 的啟發！
- **新功能**：增加使用 `ImageLoader.Builder.bitmapPoolingEnabled` 啟用/停用位圖池化的功能。
    - 位圖池化在 API 23 及以下版本上最有效，但在 API 24 及以上版本上仍可能受益（通過及時呼叫 `Bitmap.recycle`）。
- **新功能**：支援解碼時的執行緒中斷。

---

- 修正解析內容類型標頭中的多個區段的問題。
- 重構位圖引用計數以更健壯。
- 修正 API < 19 裝置上的 WebP 解碼問題。
- 在 EventListener API 中公開 FetchResult 和 DecodeResult。

---

- 使用 SDK 30 編譯。
- 將 Coroutines 更新至 1.3.8。
- 將 OkHttp 更新至 3.12.12。
- 將 Okio 更新至 2.7.0。
- 更新 AndroidX 依賴：
    - `androidx.appcompat:appcompat-resources` -> 1.2.0
    - `androidx.core:core-ktx` -> 1.3.1

## [0.11.0] - 2020 年 5 月 14 日

- **破壞性變更**：**此版本移除了所有現有的棄用函式。**
    - 這使得可以移除 Coil 的 `ContentProvider`，因此它在應用程式啟動時不執行任何程式碼。
- **破壞性變更**：將 `SparseIntArraySet.size` 轉換為 val。([#380](https://github.com/coil-kt/coil/pull/380))
- **破壞性變更**：將 `Parameters.count()` 移至擴充函式。([#403](https://github.com/coil-kt/coil/pull/403))
- **破壞性變更**：使 `BitmapPool.maxSize` 為 Int。([#404](https://github.com/coil-kt/coil/pull/404))

---

- **重要**：預設使 `ImageLoader.shutdown()` 可選（類似於 `OkHttpClient`）。([#385](https://github.com/coil-kt/coil/pull/385))

---

- 修正：修正 AGP 4.1 相容性問題。([#386](https://github.com/coil-kt/coil/pull/386))
- 修正：修正測量 `GONE` 視圖的問題。([#397](https://github.com/coil-kt/coil/pull/397))

---

- 將預設記憶體快取大小減少到 20%。([#390](https://github.com/coil-kt/coil/pull/390))
    - 要恢復現有行為，請在創建 `ImageLoader` 時設定 `ImageLoaderBuilder.availableMemoryPercentage(0.25)`。
- 將 Coroutines 更新至 1.3.6。
- 將 OkHttp 更新至 3.12.11。

## [0.10.1] - 2020 年 4 月 26 日

- 修正 API 23 及以下版本上解碼大型 PNG 檔案時出現 OOM 的問題。([#372](https://github.com/coil-kt/coil/pull/372))。
    - 這會停用 PNG 檔案的 EXIF 方向解碼。PNG EXIF 方向很少使用，並且讀取 PNG EXIF 資料（即使是空的）需要將整個檔案緩衝到記憶體中，這對效能不利。
- `SparseIntArraySet` 的次要 Java 相容性改進。

---

- 將 Okio 更新至 2.6.0。

## [0.10.0] - 2020 年 4 月 20 日

### 亮點

- **此版本棄用了大部分 DSL API，轉而直接使用建構器。**變更如下：

    ```kotlin
    // 0.9.5 (舊)
    val imageLoader = ImageLoader(context) {
        bitmapPoolPercentage(0.5)
        crossfade(true)
    }

    val disposable = imageLoader.load(context, "https://example.com/image.jpg") {
        target(imageView)
    }

    val drawable = imageLoader.get("https://example.com/image.jpg") {
        size(512, 512)
    }

    // 0.10.0 (新)
    val imageLoader = ImageLoader.Builder(context)
        .bitmapPoolPercentage(0.5)
        .crossfade(true)
        .build()

    val request = LoadRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .target(imageView)
        .build()
    val disposable = imageLoader.execute(request)

    val request = GetRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .size(512, 512)
        .build()
    val drawable = imageLoader.execute(request).drawable
    ```

    - 如果您使用 `io.coil-kt:coil` Artifact，可以呼叫 `Coil.execute(request)` 來使用單例 `ImageLoader` 執行請求。

- **`ImageLoader` 現在具有弱引用記憶體快取**，它會追蹤從強引用記憶體快取中逐出的影像的弱引用。
    - 這表示如果影像仍有強引用，則它將始終從 `ImageLoader` 的記憶體快取中返回。
    - 通常，這應該使記憶體快取更具可預測性並提高其命中率。
    - 此行為可以通過 `ImageLoaderBuilder.trackWeakReferences` 啟用/停用。

- 增加了一個新的 Artifact，**`io.coil-kt:coil-video`**，用於從視訊檔案中解碼特定幀。[在此處閱讀更多資訊](https://coil-kt.github.io/coil/videos/)。

- 增加了一個新的 [EventListener](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt) API，用於追蹤指標。

- 增加了 [ImageLoaderFactory](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)，您的 `Application` 可以實作它以簡化單例初始化。

---

### 完整發布說明

- **重要**：棄用 DSL 語法，轉而使用建構器語法。([#267](https://github.com/coil-kt/coil/pull/267))
- **重要**：棄用 `Coil` 和 `ImageLoader` 擴充函式。([#322](https://github.com/coil-kt/coil/pull/322))
- **破壞性變更**：從 `ImageLoader.execute(GetRequest)` 返回密封的 `RequestResult` 類型。([#349](https://github.com/coil-kt/coil/pull/349))
- **破壞性變更**：將 `ExperimentalCoil` 重命名為 `ExperimentalCoilApi`。從 `@Experimental` 遷移到 `@RequiresOptIn`。([#306](https://github.com/coil-kt/coil/pull/306))
- **破壞性變更**：將 `CoilLogger` 替換為 `Logger` 介面。([#316](https://github.com/coil-kt/coil/pull/316))
- **破壞性變更**：將 `destWidth`/`destHeight` 重命名為 `dstWidth`/`dstHeight`。([#275](https://github.com/coil-kt/coil/pull/275))
- **破壞性變更**：重新排列 `MovieDrawable` 的建構子參數。([#272](https://github.com/coil-kt/coil/pull/272))
- **破壞性變更**：`Request.Listener` 的方法現在接收完整的 `Request` 物件，而不僅僅是其資料。
- **破壞性變更**：`GetRequestBuilder` 現在在其建構子中需要一個 `Context`。
- **破壞性變更**：`Request` 上的幾個屬性現在是可為 null 的。
- **行為變更**：預設在快取鍵中包含參數值。([#319](https://github.com/coil-kt/coil/pull/319))
- **行為變更**：稍微調整 `Request.Listener.onStart()` 時間，使其在 `Target.onStart()` 後立即呼叫。([#348](https://github.com/coil-kt/coil/pull/348))

---

- **新功能**：增加 `WeakMemoryCache` 實作。([#295](https://github.com/coil-kt/coil/pull/295))
- **新功能**：增加 `coil-video` 以支援解碼視訊幀。([#122](https://github.com/coil-kt/coil/pull/122))
- **新功能**：引入 [`EventListener`](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt)。([#314](https://github.com/coil-kt/coil/pull/314))
- **新功能**：引入 [`ImageLoaderFactory`](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)。([#311](https://github.com/coil-kt/coil/pull/311))
- **新功能**：在 Android 11 上支援動畫 HEIF 影像序列。([#297](https://github.com/coil-kt/coil/pull/297))
- **新功能**：提升 Java 相容性。([#262](https://github.com/coil-kt/coil/pull/262))
- **新功能**：支援設定預設 `CachePolicy`。([#307](https://github.com/coil-kt/coil/pull/307))
- **新功能**：支援設定預設 `Bitmap.Config`。([#342](https://github.com/coil-kt/coil/pull/342))
- **新功能**：增加 `ImageLoader.invalidate(key)` 以清除單個記憶體快取項目。([#55](https://github.com/coil-kt/coil/pull/55))
- **新功能**：增加偵錯日誌以解釋為何快取影像未被重用。([#346](https://github.com/coil-kt/coil/pull/346))
- **新功能**：支援 `get` 請求的 `error` 和 `fallback` 可繪製物件。

---

- 修正：修正當 Transformation 減少輸入位圖大小時的記憶體快取遺失問題。([#357](https://github.com/coil-kt/coil/pull/357))
- 修正：確保 BlurTransformation 中的半徑低於 RenderScript 最大值。([#291](https://github.com/coil-kt/coil/pull/291))
- 修正：修正解碼高色彩深度影像的問題。([#358](https://github.com/coil-kt/coil/pull/358))
- 修正：在 Android 11 及以上版本上停用 `ImageDecoderDecoder` 崩潰的解決方案。([#298](https://github.com/coil-kt/coil/pull/298))
- 修正：修正無法讀取 pre-API 23 上 EXIF 資料的問題。([#331](https://github.com/coil-kt/coil/pull/331))
- 修正：修正與 Android R SDK 不相容的問題。([#337](https://github.com/coil-kt/coil/pull/337))
- 修正：僅在 `ImageView` 具有匹配的 `SizeResolver` 時才啟用不精確尺寸。([#344](https://github.com/coil-kt/coil/pull/344))
- 修正：允許快取影像最多偏離請求尺寸一個像素。([#360](https://github.com/coil-kt/coil/pull/360))
- 修正：如果視圖不可見，則跳過交叉淡入過渡。([#361](https://github.com/coil-kt/coil/pull/361))

---

- 棄用 `CoilContentProvider`。([#293](https://github.com/coil-kt/coil/pull/293))
- 使用 `@MainThread` 註解多個 `ImageLoader` 方法。
- 如果生命週期目前已啟動，則避免創建 `LifecycleCoroutineDispatcher`。([#356](https://github.com/coil-kt/coil/pull/356))
- `OriginalSize.toString()` 使用完整的套件名稱。
- 解碼軟體位圖時預先分配。([#354](https://github.com/coil-kt/coil/pull/354))

---

- 將 Kotlin 更新至 1.3.72。
- 將 Coroutines 更新至 1.3.5。
- 將 OkHttp 更新至 3.12.10。
- 將 Okio 更新至 2.5.0。
- 更新 AndroidX 依賴：
    - `androidx.exifinterface:exifinterface` -> 1.2.0

## [0.9.5] - 2020 年 2 月 6 日

- 修正：確保在檢查視圖是否已硬體加速之前，該視圖已附加。這修正了請求硬體位圖可能錯過記憶體快取的情況。

---

- 更新 AndroidX 依賴：
    - `androidx.core:core-ktx` -> 1.2.0

## [0.9.4] - 2020 年 2 月 3 日

- 修正：在 ImageDecoderDecoder 中降取樣時尊重長寬比。感謝 @zhanghai。

---

- 之前，位圖會從記憶體快取中返回，只要其設定大於或等於請求中指定的設定。例如，如果您請求 `ARGB_8888` 位圖，則可能會從記憶體快取中返回 `RGBA_F16` 位圖。現在，快取的設定和請求的設定必須相等。
- 使 `scale` 和 `durationMillis` 在 `CrossfadeDrawable` 和 `CrossfadeTransition` 中公開。

## [0.9.3] - 2020 年 2 月 1 日

- 修正：在 `ScaleDrawable` 內部平移子可繪製物件以確保其居中。
- 修正：修正 GIF 和 SVG 未完全填充邊界的情況。

---

- 將 `HttpUrl.get()` 的呼叫延遲到背景執行緒。
- 改善 BitmapFactory null 位圖錯誤訊息。
- 將 3 個裝置添加到硬體位圖黑名單。([#264](https://github.com/coil-kt/coil/pull/264))

---

- 更新 AndroidX 依賴：
    - `androidx.lifecycle:lifecycle-common-java8` -> 2.2.0

## [0.9.2] - 2020 年 1 月 19 日

- 修正：修正 pre-API 19 上 GIF 解碼的問題。感謝 @mario。
- 修正：修正柵格化向量可繪製物件未被標記為取樣的問題。
- 修正：如果 Movie 維度 <= 0，則拋出例外。
- 修正：修正 CrossfadeTransition 未恢復記憶體快取事件的問題。
- 修正：如果硬體位圖不允許，則防止將其返回給所有目標方法。
- 修正：修正 MovieDrawable 未將自身定位在其邊界中心的問題。

---

- 移除 CrossfadeDrawable 的自動縮放。
- 使 `BitmapPool.trimMemory` 公開。
- 將 AnimatedImageDrawable 包裹在 ScaleDrawable 中以確保它填滿其邊界。
- 為 RequestBuilder.setParameter 增加 @JvmOverloads。
- 如果 SVG 的視圖框未設定，則將其設定為其尺寸。
- 將狀態和級別更改傳遞給 CrossfadeDrawable 子項。

---

- 將 OkHttp 更新至 3.12.8。

## [0.9.1] - 2019 年 12 月 30 日

- 修正：修正呼叫 `LoadRequestBuilder.crossfade(false)` 時崩潰的問題。

## [0.9.0] - 2019 年 12 月 30 日

- **破壞性變更**：`Transformation.transform` 現在包含 `Size` 參數。這是為了支援基於 `Target` 尺寸改變輸出 `Bitmap` 尺寸的轉換。帶有轉換的請求現在也免於 [影像取樣](https://coil-kt.github.io/coil/getting_started/#image-sampling)。
- **破壞性變更**：`Transformation` 現在應用於任何類型的 `Drawable`。之前，如果輸入 `Drawable` 不是 `BitmapDrawable`，`Transformation` 會被跳過。現在，`Drawable` 會被渲染到位圖，然後再應用 `Transformation`。
- **破壞性變更**：將 `null` 資料傳遞給 `ImageLoader.load` 現在被視為錯誤，並呼叫 `Target.onError` 和 `Request.Listener.onError`，並帶有 `NullRequestDataException`。此變更旨在支援在資料為 `null` 時設定 `fallback` 可繪製物件。之前請求會被靜默忽略。
- **破壞性變更**：`RequestDisposable.isDisposed` 現在是一個 `val`。

---

- **新功能**：支援自訂過渡。 [在此處查看更多資訊](https://coil-kt.github.io/coil/transitions/)。過渡被標記為實驗性，因為 API 正在孵化中。
- **新功能**：增加 `RequestDisposable.await` 以支援在 `LoadRequest` 進行中時暫停。
- **新功能**：支援在請求資料為 null 時設定 `fallback` 可繪製物件。
- **新功能**：增加 `Precision`。這使得輸出 `Drawable` 的尺寸精確，同時為支援縮放的目標（例如 `ImageViewTarget`）啟用縮放優化。請參閱 [其文件](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/size/Precision.kt) 以獲取更多資訊。
- **新功能**：增加 `RequestBuilder.aliasKeys` 以支援匹配多個快取鍵。

---

- 修正：使 RequestDisposable 執行緒安全。
- 修正：`RoundedCornersTransformation` 現在會裁剪到目標尺寸，然後圓角。
- 修正：`CircleCropTransformation` 現在從中心裁剪。
- 修正：將多個裝置添加到 [硬體位圖黑名單](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/memory/HardwareBitmapService.kt)。
- 修正：將可繪製物件轉換為位圖時保留長寬比。
- 修正：修正 `Scale.FIT` 可能導致的記憶體快取遺失。
- 修正：確保 Parameters 迭代順序是確定的。
- 修正：創建 Parameters 和 ComponentRegistry 時的防禦性複製。
- 修正：確保 RealBitmapPool 的 maxSize >= 0。
- 修正：如果 CrossfadeDrawable 未動畫或已完成，則顯示開始可繪製物件。
- 修正：調整 CrossfadeDrawable 以考慮具有未定義固有尺寸的子項。
- 修正：修正 `MovieDrawable` 未正確縮放的問題。

---

- 將 Kotlin 更新至 1.3.61。
- 將 Kotlin Coroutines 更新至 1.3.3。
- 將 Okio 更新至 2.4.3。
- 更新 AndroidX 依賴：
    - `androidx.exifinterface:exifinterface` -> 1.1.0

## [0.8.0] - 2019 年 10 月 22 日

- **破壞性變更**：`SvgDrawable` 已被移除。相反，SVG 現在由 `SvgDecoder` 預渲染為 `BitmapDrawable`。這使得 SVG 在主執行緒上**渲染成本顯著降低**。此外，`SvgDecoder` 的建構子現在需要一個 `Context`。
- **破壞性變更**：`SparseIntArraySet` 擴充函式已移至 `coil.extension` 套件。

---

- **新功能**：支援設定每個請求的網路標頭。[在此處查看更多資訊](https://github.com/coil-kt/coil/pull/120)。
- **新功能**：增加新的 `Parameters` API 以支援通過影像管道傳遞自訂資料。
- **新功能**：支援 RoundedCornersTransformation 中的單個圓角半徑。感謝 @khatv911。
- **新功能**：增加 `ImageView.clear()` 以支援主動釋放資源。
- **新功能**：支援從其他套件載入資源。
- **新功能**：為 ViewSizeResolver 增加 `subtractPadding` 屬性，以啟用/停用測量時減去視圖的內邊距。
- **新功能**：改進 HttpUrlFetcher MIME 類型偵測。
- **新功能**：為 MovieDrawable 和 CrossfadeDrawable 增加 Animatable2Compat 支援。
- **新功能**：增加 `RequestBuilder<*>.repeatCount` 以設定 GIF 的重複次數。
- **新功能**：將 BitmapPool 創建添加到公開 API。
- **新功能**：使用 `@MainThread` 註解 Request.Listener 方法。

---

- 修正：使 CoilContentProvider 對測試可見。
- 修正：將夜間模式包含在資源快取鍵中。
- 修正：通過暫時將來源寫入磁碟來解決 ImageDecoder 原生崩潰問題。
- 修正：正確處理聯絡人顯示照片 URI。
- 修正：將色調傳遞給 CrossfadeDrawable 的子項。
- 修正：修正多個未關閉來源的實例。
- 修正：增加一個設備黑名單，這些設備具有損壞/不完整的硬體位圖實作。

---

- 針對 SDK 29 編譯。
- 將 Kotlin Coroutines 更新至 1.3.2。
- 將 OkHttp 更新至 3.12.6。
- 將 Okio 更新至 2.4.1。
- 將 `appcompat-resources` 從 `compileOnly` 變更為 `implementation`，用於 `coil-base`。

## [0.7.0] - 2019 年 9 月 8 日
- **破壞性變更**：`ImageLoaderBuilder.okHttpClient(OkHttpClient.Builder.() -> Unit)` 現在是 `ImageLoaderBuilder.okHttpClient(() -> OkHttpClient)`。初始化器現在也會在背景執行緒上惰性呼叫。**如果您設定了自訂 `OkHttpClient`，則必須設定 `OkHttpClient.cache` 以啟用磁碟快取。**如果您未設定自訂 `OkHttpClient`，Coil 將創建預設的 `OkHttpClient`，該客戶端已啟用磁碟快取。預設的 Coil 快取可以使用 `CoilUtils.createDefaultCache(context)` 創建。例如：

```kotlin
val imageLoader = ImageLoader(context) {
    okHttpClient {
        OkHttpClient.Builder()
            .cache(CoilUtils.createDefaultCache(context))
            .build()
    }
}
```

- **破壞性變更**：`Fetcher.key` 不再具有預設實作。
- **破壞性變更**：之前，只有第一個適用於 `Mapper` 的會被呼叫。現在，所有適用的 `Mapper` 都會被呼叫。無 API 變更。
- **破壞性變更**：次要命名參數重命名：`url` -> `uri`，`factory` -> `initializer`。

---

- **新功能**：`coil-svg` Artifact，它具有一個 `SvgDecoder`，支援自動解碼 SVG。由 [AndroidSVG](https://github.com/BigBadaboom/androidsvg) 提供支援。感謝 @rharter。
- **新功能**：`load(String)` 和 `get(String)` 現在接受任何支援的 Uri 方案。例如，您現在可以執行 `imageView.load("file:///path/to/file.jpg")`。
- **新功能**：重構 ImageLoader 以使用 `Call.Factory` 而不是 `OkHttpClient`。這允許使用 `ImageLoaderBuilder.okHttpClient { OkHttpClient() }` 惰性初始化網路資源。感謝 @ZacSweers。
- **新功能**：`RequestBuilder.decoder` 用於明確設定請求的解碼器。
- **新功能**：`ImageLoaderBuilder.allowHardware` 用於預設為 ImageLoader 啟用/停用硬體位圖。
- **新功能**：支援 ImageDecoderDecoder 中的軟體渲染。

---

- 修正：載入向量可繪製物件的多個錯誤。
- 修正：支援 `WRAP_CONTENT` 視圖維度。
- 修正：支援解析長度超過 8192 位元組的 EXIF 資料。
- 修正：交叉淡入時不要拉伸具有不同長寬比的可繪製物件。
- 修正：防範網路觀察器因例外而無法註冊的問題。
- 修正：修正 MovieDrawable 中的除以零錯誤。感謝 @R12rus。
- 修正：支援巢狀 Android 資產檔案。感謝 @JaCzekanski。
- 修正：防範 Android O 和 O_MR1 上檔案描述符耗盡的問題。
- 修正：修正停用記憶體快取時崩潰的問題。感謝 @hansenji。
- 修正：確保 Target.cancel 始終從主執行緒呼叫。

---

- 將 Kotlin 更新至 1.3.50。
- 將 Kotlin Coroutines 更新至 1.3.0。
- 將 OkHttp 更新至 3.12.4。
- 將 Okio 更新至 2.4.0。
- 將 AndroidX 依賴更新至最新的穩定版本：
    - `androidx.appcompat:appcompat` -> 1.1.0
    - `androidx.core:core-ktx` -> 1.1.0
    - `androidx.lifecycle:lifecycle-common-java8` -> 2.1.0
- 將 `appcompat` 替換為 `appcompat-resources` 作為可選的 `compileOnly` 依賴。`appcompat-resources` 是一個小得多的 Artifact。

## [0.6.1] - 2019 年 8 月 16 日
- 新功能：為 RequestBuilder 增加 `transformations(List<Transformation>)`。
- 修正：為檔案 URI 將上次修改日期添加到快取鍵。
- 修正：確保視圖維度評估為至少 1 像素。
- 修正：清除 MovieDrawable 的畫布，用於幀之間。
- 修正：正確開啟資產。

## [0.6.0] - 2019 年 8 月 12 日
- 首次發布。