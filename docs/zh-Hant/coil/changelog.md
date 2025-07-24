# 更新日誌

## [3.3.0] - 2025 年 7 月 22 日

- **新功能**：引入一個新 API，用於限制應用程式在背景執行時 Android 上 `MemoryCache.maxSize` 的大小。
    - 如果設定了 `ImageLoader.Builder.memoryCacheMaxSizePercentWhileInBackground`，則 `ImageLoader` 的記憶體快取在應用程式於背景執行時將被限制為其最大大小的百分比。此設定目前預設為停用。
    - 當應用程式進入背景時，影像將從記憶體快取中被裁剪 (trimmed)，以達到受限制的最大大小，但記憶體快取對最近裁剪的影像的弱引用不受影響。這表示如果一個影像目前在其他地方被引用（例如 `AsyncImage`、`ImageView` 等），它仍將存在於記憶體快取中。
    - 這個 API 有助於減少背景記憶體使用量，防止應用程式過早被終止，並有助於減輕使用者設備上的記憶體壓力。
- **新功能**：為 `SvgDecoder` 增加了 `Svg.Parser` 參數。
    - 這允許在使用預設 SVG 解析器無法滿足需求時，使用自訂的 SVG 解析器。
- 為 `SvgDecoder` 增加了 `density` 參數，以支援提供自訂的密度乘數。
- 增加 `Uri.Builder` 以支援複製和修改 `Uri`。
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
- 移除 `coil-compose-core` 對 `Dispatchers.Main.immedate` 的依賴。
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
- 修正 `AsyncImagePainter` 沒有子繪圖器 (child painter) 時，`AsyncImage` 填充可用約束的問題。
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

- **破壞性變更**：