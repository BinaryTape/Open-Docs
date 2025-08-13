# 升級到 Coil 2.x

這是一份簡短指南，重點說明從 Coil 1.x 升級到 2.x 時的主要變更以及如何處理這些變更。本升級指南未涵蓋所有二進位或原始碼不相容的變更，但它涵蓋了最重要的變更。

## 最低 API 21

Coil 2.x 需要最低 API 21。這也是 Compose 和 OkHttp 4.x 所需的最低 API。

## ImageRequest 預設縮放

Coil 2.x 將 `ImageRequest` 的預設縮放從 `Scale.FILL` 變更為 `Scale.FIT`。這樣做的目的是為了與 `ImageView` 的預設 `ScaleType` 和 `Image` 的預設 `ContentScale` 保持一致。如果您將 `ImageView` 設定為 `ImageRequest.target`，縮放比例仍會自動偵測。

## Size 重構

`Size` 的 `width` 和 `height` 現在是兩個 `Dimension`，而不是 `Int` 像素值。`Dimension` 可以是像素值或 `Dimension.Undefined`，後者表示未定義/無邊界的約束。例如，如果大小是 `Size(400, Dimension.Undefined)`，這表示影像應該按其寬度縮放為 400 像素，不論其高度如何。您可以使用 `pxOrElse` 擴展函數來取得像素值（如果存在），否則使用備用值：

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // 使用像素值。
}
```

這項變更旨在改進對目標具有一個無邊界維度（例如，如果一個維度是 `View` 的 `ViewGroup.LayoutParams.WRAP_CONTENT` 或 Compose 中的 `Constraints.Infinity`）情況的支援。

## Compose

Coil 2.x 大幅重構了 Compose 整合，以新增功能、提高穩定性並改善效能。

在 Coil 1.x 中，您會使用 `rememberImagePainter` 來載入影像：

```kotlin
val painter = rememberImagePainter("https://example.com/image.jpg") {
    crossfade(true)
}

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

在 Coil 2.x 中，`rememberImagePainter` 已變更為 `rememberAsyncImagePainter`，並有以下變更：

- 用於配置 `ImageRequest` 的尾隨 lambda 參數已移除。
- 在 Coil 2.x 中，`rememberAsyncImagePainter` 預設使用 `ContentScale.Fit` 以與 `Image` 保持一致，而在 Coil 1.x 中它會預設為 `ContentScale.Crop`。因此，如果您在 `Image` 上設定了自訂 `ContentScale`，您現在也需要將其傳遞給 `rememberAsyncImagePainter`。

```kotlin
val painter = rememberAsyncImagePainter(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentScale = ContentScale.Crop
)

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

此外，Coil 現在擁有 `AsyncImage` 和 `SubcomposeAsyncImage` 可組合函數，它們新增了新功能並解決了 `rememberAsyncImagePainter` 的一些設計限制。請查看[此處](compose.md)完整的 Compose 文件。

## 磁碟快取

Coil 2.x 擁有自己的公共磁碟快取類別，可以使用 `imageLoader.diskCache` 存取。Coil 1.x 依賴於 OkHttp 的磁碟快取，但它現在不再需要。

在 1.x 中配置磁碟快取時，您會使用 `CoilUtils.createDefaultCache`：

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

在 Coil 2.x 中，當與 `ImageLoader` 一起使用時，您不應在 `OkHttpClient` 上設定 `Cache` 物件。而是像這樣配置磁碟快取物件：

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

這項變更旨在新增功能並提高效能：

- 支援在解碼影像時執行緒中斷。
  - 執行緒中斷允許快速取消解碼操作。這對於快速滾動列表尤其重要。
  - 透過使用自訂磁碟快取，Coil 能夠確保網路來源在解碼前完整讀取到磁碟。這是必要的，因為將資料寫入磁碟的過程無法中斷——只有解碼步驟可以中斷。OkHttp 的 `Cache` 不應與 Coil 2.0 一起使用，因為無法保證所有資料在解碼前寫入磁碟。
- 避免為不支援 `InputStream` 或需要直接存取 `File` 的解碼 API 進行緩衝/建立臨時檔案（例如 `ImageDecoder`、`MediaMetadataRetriever`）。
- 新增公共讀/寫 `DiskCache` API。

在 Coil 2.x 中，`Cache-Control` 和其他快取標頭仍然支援——除了 `Vary` 標頭，因為快取只檢查 URL 是否匹配。此外，只有響應碼在 [200..300) 範圍內的響應才會被快取。

從 Coil 1.x 升級到 2.x 時，任何現有的磁碟快取都將被清除，因為內部格式已更改。

## 影像管線重構

Coil 2.x 重構了影像管線類別，使其更具彈性。以下是變更的高層次清單：

- 引入一個新類別 `Keyer`，它計算請求的記憶體快取鍵。它取代了 `Fetcher.key`。
- `Mapper`、`Keyer`、`Fetcher` 和 `Decoder` 可以返回 `null` 以委派給元件清單中的下一個元素。
- 將 `Options` 添加到 `Mapper.map` 的簽名中。
- 引入 `Fetcher.Factory` 和 `Decoder.Factory`。使用這些工廠來判斷特定的 `Fetcher`/`Decoder` 是否適用。如果該 `Fetcher`/`Decoder` 不適用，則返回 `null`。

## 移除位元圖池

Coil 2.x 移除了位元圖池及其相關類別 (`BitmapPool`、`PoolableViewTarget`)。請參閱[此處](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528)了解其移除原因。