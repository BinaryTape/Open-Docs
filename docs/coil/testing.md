# 测试

要使用测试支持类，请导入扩展库：

```kotlin
testImplementation("io.coil-kt.coil3:coil-test:3.3.0")
```

`coil-test` 包含一个 `FakeImageLoaderEngine`，可以将其添加到 `ImageLoader` 中以拦截所有传入的 `ImageRequest` 并返回一个自定义的 `ImageResult`。这对于测试很有用，因为它使图像加载同步（在主线程中）且一致。通过使用 `FakeImageLoaderEngine`，`ImageLoader` 将避免通常用于加载图像的所有内存缓存、线程跳转、磁盘/网络 I/O 获取以及图像解码操作。以下是一个示例：

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

`ColorImage` 对于测试很有用，因为它可以根据其宽度/高度绘制一个彩色方框或用颜色填充画布，并且它支持所有平台。

此策略与 [Paparazzi](https://github.com/cashapp/paparazzi) 配合得很好，可以在没有物理设备或模拟器的情况下截屏测试 UI：

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
        // 将显示一个红色方框。
        paparazzi.snapshot {
            AsyncImage(
                model = "https://example.com/image.jpg",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeGreen() {
        // 将显示一个绿色方框。
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/test.png",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeBlue() {
        // 将显示一个蓝色方框。
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/default.png",
                contentDescription = null,
            )
        }
    }
}