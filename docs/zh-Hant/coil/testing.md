# 測試

若要使用測試支援類別，請匯入延伸庫：

```kotlin
testImplementation("io.coil-kt.coil3:coil-test:3.3.0")
```

`coil-test` 包含一個 `FakeImageLoaderEngine`，可將其加入您的 `ImageLoader` 以攔截所有傳入的 `ImageRequest` 並返回一個自訂的 `ImageResult`。這對於測試非常有用，因為它使影像載入變得同步（從主執行緒）且一致。透過使用 `FakeImageLoaderEngine`，`ImageLoader` 將避免所有通常用於載入影像的記憶體快取、執行緒跳轉、磁碟/網路 I/O 擷取以及影像解碼。這是一個範例：

```kotlin
val engine = FakeImageLoaderEngine.Builder()
    .intercept("https://example.com/image.jpg", ColorImage(Color.Red.toArgb()))
    .intercept({ it is String && it.endsWith("test.png") }, ColorImage(Color.Green.toArgb()))
    .default(ColorImage(Color.Blue.toArgb()))
    .build()
val imageLoader = ImageLoader.Builder(context)
    .components { add(engine) }
    .build()
```

`ColorImage` 對於測試很有用，因為它可以根據其寬度/高度繪製彩色方塊或用顏色填充畫布，並且在所有平台上都受支援。

此策略與 [Paparazzi](https://github.com/cashapp/paparazzi) 配合得很好，可以在無需實體裝置或模擬器的情況下截圖測試 UI：

```kotlin
class PaparazziTest {
    @get:Rule
    val paparazzi = Paparazzi()

    @Before
    fun before() {
        val engine = FakeImageLoaderEngine.Builder()
            .intercept("https://example.com/image.jpg", ColorImage(Color.Red.toArgb()))
            .intercept({ it is String && it.endsWith("test.png") }, ColorImage(Color.Green.toArgb()))
            .default(ColorImage(Color.Blue.toArgb()))
            .build()
        val imageLoader = ImageLoader.Builder(paparazzi.context)
            .components { add(engine) }
            .build()
        SingletonImageLoader.setUnsafe(imageLoader)
    }

    @Test
    fun testContentComposeRed() {
        // 將顯示一個紅色方塊。
        paparazzi.snapshot {
            AsyncImage(
                model = "https://example.com/image.jpg",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeGreen() {
        // 將顯示一個綠色方塊。
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/test.png",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeBlue() {
        // 將顯示一個藍色方塊。
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/default.png",
                contentDescription = null,
            )
        }
    }
}