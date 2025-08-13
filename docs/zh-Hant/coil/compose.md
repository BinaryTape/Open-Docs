# Compose

若要新增對 [Compose UI](https://www.jetbrains.com/compose-multiplatform/) 的支援，請匯入擴充函式庫：

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
```

接著使用 `AsyncImage` 可組合函式來載入並顯示圖片：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

`model` 可以是 `ImageRequest.data` 的值，也可以是 `ImageRequest` 本身。`contentDescription` 設定了輔助功能服務用來描述此圖片所代表意義的文字。

## AsyncImage

`AsyncImage` 是一個可組合函式，它會非同步地執行圖片請求並呈現結果。它支援與標準 `Image` 可組合函式相同的引數，此外，它還支援設定預留位置 (`placeholder`)、錯誤 (`error`)、備用 (`fallback`) 繪圖器，以及載入中 (`onLoading`)、成功 (`onSuccess`)、錯誤 (`onError`) 回呼。這是一個載入圖片並帶有圓形裁剪、淡入淡出效果和設定預留位置的範例：

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    contentDescription = stringResource(R.string.description),
    contentScale = ContentScale.Crop,
    modifier = Modifier.clip(CircleShape),
)
```

**何時使用此函式：**

大部分情況下，優先使用 `AsyncImage`。它會根據可組合函式的約束條件以及提供的 `ContentScale`，正確判斷圖片應載入的尺寸。

## rememberAsyncImagePainter

在內部，`AsyncImage` 和 `SubcomposeAsyncImage` 使用 `rememberAsyncImagePainter` 來載入 `model`。如果您需要一個繪圖器 (`Painter`) 而不是可組合函式，可以使用 `rememberAsyncImagePainter` 來載入圖片：

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")
```

`rememberAsyncImagePainter` 比 `AsyncImage` 和 `SubcomposeAsyncImage` 更具彈性，但它有幾個缺點（詳見下方）。

**何時使用此函式：**

如果您需要一個繪圖器 (`Painter`) 而不是可組合函式，或者您需要觀察 `AsyncImagePainter.state` 並根據其繪製不同的可組合函式，又或者您需要使用 `AsyncImagePainter.restart` 手動重新啟動圖片請求，此函式會很有用。

此函式的主要缺點是它不會偵測圖片在螢幕上載入的尺寸，並且始終以其原始尺寸載入圖片。您可以傳遞一個自訂的 `SizeResolver` 或使用 `rememberConstraintsSizeResolver`（`AsyncImage` 內部使用的就是它）來解決此問題。範例：

```kotlin
val sizeResolver = rememberConstraintsSizeResolver()
val painter = rememberAsyncImagePainter(
    model = ImageRequest.Builder(LocalPlatformContext.current)
        .data("https://example.com/image.jpg")
        .size(sizeResolver)
        .build(),
)

Image(
    painter = painter,
    contentDescription = null,
    modifier = Modifier.then(sizeResolver),
)
```

另一個缺點是，當使用 `rememberAsyncImagePainter` 時，即使圖片存在於記憶體快取中並將在第一個影格中繪製，`AsyncImagePainter.state` 在首次組合時也將始終為 `AsyncImagePainter.State.Empty`。

## SubcomposeAsyncImage

`SubcomposeAsyncImage` 是 `AsyncImage` 的一個變體，它使用子組合 (`subcomposition`) 為 `AsyncImagePainter` 的狀態提供一個插槽 API，而不是使用繪圖器 (`Painter`)。這是一個範例：

```kotlin
SubcomposeAsyncImage(
    model = "https://example.com/image.jpg",
    loading = {
        CircularProgressIndicator()
    },
    contentDescription = stringResource(R.string.description),
)
```

此外，您可以使用其 `content` 引數和 `SubcomposeAsyncImageContent`（它會呈現當前狀態）來實現更複雜的邏輯：

```kotlin
SubcomposeAsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = stringResource(R.string.description)
) {
    val state by painter.state.collectAsState()
    if (state is AsyncImagePainter.State.Success) {
        SubcomposeAsyncImageContent()
    } else {
        CircularProgressIndicator()
    }
}
```

!!! 注意
    子組合 (`Subcomposition`) 比常規組合慢，因此此可組合函式可能不適合您 UI 中對效能要求較高的部分（例如 `LazyList`）。

**何時使用此函式：**

一般來說，如果您需要觀察 `AsyncImagePainter.state` 並且它不使用子組合 (`subcomposition`)，則優先使用 `rememberAsyncImagePainter` 而不是此函式。

具體來說，此函式僅在您需要觀察 `AsyncImagePainter.state` 且不能像使用 `rememberAsyncImagePainter` 那樣在第一次組合和第一個影格時為 `Empty` 的情況下才有用。`SubcomposeAsyncImage` 使用子組合來獲取圖片的約束條件，因此其 `AsyncImagePainter.state` 會立即更新。

## 觀察 AsyncImagePainter.state

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")
val state by painter.state.collectAsState()

when (state) {
    is AsyncImagePainter.State.Empty,
    is AsyncImagePainter.State.Loading -> {
        CircularProgressIndicator()
    }
    is AsyncImagePainter.State.Success -> {
        Image(
            painter = painter,
            contentDescription = stringResource(R.string.description)
        )
    }
    is AsyncImagePainter.State.Error -> {
        // 顯示一些錯誤 UI。
    }
}
```

## 轉場

您可以使用 `ImageRequest.Builder.crossfade` 啟用內建的淡入淡出 (`crossfade`) 轉場：

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
)
```

自訂的 [`Transition`](/coil/api/coil-core/coil3.transition/-transition) 不適用於 `AsyncImage`、`SubcomposeAsyncImage` 或 `rememberAsyncImagePainter`，因為它們需要 `View` 引用。`CrossfadeTransition` 由於內部特殊支援而能正常運作。

儘管如此，透過觀察 `AsyncImagePainter.state`，仍然可以在 Compose 中建立自訂轉場：

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")

val state by painter.state.collectAsState()
if (state is AsyncImagePainter.State.Success && state.result.dataSource != DataSource.MEMORY_CACHE) {
    // 執行轉場動畫。
}

Image(
    painter = painter,
    contentDescription = stringResource(R.string.description),
)
```

## 預覽

`AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage` 在 Android Studio 中的預覽行為由 `LocalAsyncImagePreviewHandler` 控制。預設情況下，它會嘗試在預覽環境中正常執行請求。預覽環境中網路存取已禁用，因此網路 URL 將始終失敗。

您可以像這樣覆寫預覽行為：

```kotlin
val previewHandler = AsyncImagePreviewHandler {
    ColorImage(Color.Red.toArgb())
}

CompositionLocalProvider(LocalAsyncImagePreviewHandler provides previewHandler) {
    AsyncImage(
        model = "https://example.com/image.jpg",
        contentDescription = null,
    )
}
```

這對於 [AndroidX 的 Compose 預覽截圖測試函式庫](https://developer.android.com/studio/preview/compose-screenshot-testing) 也很有用，它在相同的預覽環境中執行。

## Compose 多平台資源

Coil 透過使用 `Res.getUri` 作為 `model` 參數來支援載入 [Compose 多平台資源](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-resources.html)。範例：

```kotlin
AsyncImage(
    model = Res.getUri("drawable/sample.jpg"),
    contentDescription = null,
)
```

!!! 注意
    Coil 不支援 `Res.drawable.image` 及其他編譯安全引用。您必須改用 `Res.getUri("drawable/image")`。[追蹤此問題以獲取更新](https://github.com/coil-kt/coil/issues/2812)。