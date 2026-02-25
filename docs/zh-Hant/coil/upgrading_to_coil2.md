# 升級至 Coil 2.x

本指南簡要說明從 Coil 1.x 升級到 2.x 的主要變更以及處理方式。本升級指南並未涵蓋所有二進位或原始碼不相容的變更，但涵蓋了最重要的部分。

## 最低 API 21

Coil 2.x 最低需要 API 21。這也是 Compose 與 OkHttp 4.x 所需的最低 API。

## ImageRequest 預設縮放 (scale)

Coil 2.x 將 `ImageRequest` 的預設縮放從 `Scale.FILL` 變更為 `Scale.FIT`。此變更是為了與 `ImageView` 的預設 `ScaleType` 以及 `Image` 的預設 `ContentScale` 保持一致。如果您將 `ImageView` 設定為 `ImageRequest.target`，縮放（Scale）仍會自動偵測。

## Size 重構 (Size refactor)

`Size` 的 `width` 與 `height` 現在是兩個 `Dimension` 物件，而非 `Int` 像素值。`Dimension` 可以是像素值或是 `Dimension.Undefined`，後者代表未定義／無界限的約束（constraint）。例如，如果大小為 `Size(400, Dimension.Undefined)`，代表圖片應縮放為寬度 400 像素，而不考慮其高度。您可以使用 `pxOrElse` 擴充方法來獲取像素值（如果存在），否則使用備援值：

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // 使用像素值。
}
```

此變更旨在改善對具有無界限維度之目標的支援（例如 `View` 的 `ViewGroup.LayoutParams.WRAP_CONTENT` 或 Compose 中的 `Constraints.Infinity`）。

## Compose

Coil 2.x 大幅重構了 Compose 整合，以增加功能、提升穩定性並優化效能。

在 Coil 1.x 中，您會使用 `rememberImagePainter` 來載入圖片：

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

在 Coil 2.x 中，`rememberImagePainter` 已更名為 `rememberAsyncImagePainter`，並有以下變更：

- 已移除用於配置 `ImageRequest` 的尾隨 Lambda 引數。
- 在 Coil 2.x 中，`rememberAsyncImagePainter` 預設使用 `ContentScale.Fit` 以與 `Image` 保持一致，而在 Coil 1.x 中預設為 `ContentScale.Crop`。因此，如果您在 `Image` 上設定了自訂的 `ContentScale`，現在也需要將其傳遞給 `rememberAsyncImagePainter`。

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

此外，Coil 現在提供了 `AsyncImage` 與 `SubcomposeAsyncImage` 可組合函式，這些函式增加了新功能，並解決了 `rememberAsyncImagePainter` 的一些設計限制。請在此處查看完整的 Compose 文件 [here](compose.md)。

## 磁碟快取 (Disk Cache)

Coil 2.x 擁有自己的公開磁碟快取類別，可透過 `imageLoader.diskCache` 存取。Coil 1.x 依賴 OkHttp 的磁碟快取，但現在已不再需要。

若要在 1.x 中配置磁碟快取，您會使用 `CoilUtils.createDefaultCache`：

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

在 Coil 2.x 中，與 `ImageLoader` 一起使用時，不應在 `OkHttpClient` 上設定 `Cache` 物件。請改為按照以下方式配置磁碟快取物件：

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

此變更旨在增加功能並優化效能：

- 支援在解碼圖片時中斷執行緒。
  - 執行緒中斷可讓解碼作業快速取消。這對於快速捲動清單尤為重要。
  - 透過使用自訂磁碟快取，Coil 能夠確保在解碼前將網路來源完全讀取到磁碟中。這是必要的，因為將資料寫入磁碟無法被中斷，只有解碼步驟可以中斷。OkHttp 的 `Cache` 不應與 Coil 2.0 一起使用，因為無法保證所有資料在解碼前都已寫入磁碟。
- 避免針對不支援 `InputStream` 或需要直接存取 `File` 的解碼 API（如 `ImageDecoder`、`MediaMetadataRetriever`）進行緩衝或建立暫存檔。
- 增加公開的讀／寫 `DiskCache` API。

在 Coil 2.x 中，仍支援 `Cache-Control` 與其他快取標頭——但 `Vary` 標頭除外，因為快取僅檢查 URL 是否相符。此外，僅回應代碼在 [200..300) 範圍內的回應才會被快取。

從 Coil 1.x 升級到 2.x 時，由於內部格式已更改，任何現有的磁碟快取都將被清除。

## 圖片管線重構 (Image pipeline refactor)

Coil 2.x 重構了圖片管線類別以使其更具靈活性。以下是主要變更列表：

- 引入新類別 `Keyer`，用於計算請求的記憶體快取金鑰。它取代了 `Fetcher.key`。
- `Mapper`、`Keyer`、`Fetcher` 與 `Decoder` 可以傳回 `null`，以便委派給組件（component）清單中的下一個元素。
- 在 `Mapper.map` 的簽章中加入 `Options`。
- 引入 `Fetcher.Factory` 與 `Decoder.Factory`。使用工廠來判斷特定的 `Fetcher`/`Decoder` 是否適用。如果不適用，則傳回 `null`。

## 移除點陣圖集 (Remove bitmap pooling)

Coil 2.x 移除了點陣圖集（bitmap pooling）及其相關類別（`BitmapPool`、`PoolableViewTarget`）。關於移除原因，請參閱[此處](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528)。