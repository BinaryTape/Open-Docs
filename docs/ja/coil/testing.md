# テスト

テストサポートクラスを使用するには、拡張ライブラリをインポートします。

```kotlin
testImplementation("io.coil-kt.coil3:coil-test:3.3.0")
```

`coil-test` には `FakeImageLoaderEngine` が含まれており、これを `ImageLoader` に追加することで、すべての着信 `ImageRequest` をインターセプトし、カスタムの `ImageResult` を返すことができます。これは、画像の読み込みを（メインスレッドから）同期的かつ一貫性のあるものにするため、テストに役立ちます。`FakeImageLoaderEngine` を使用することで、`ImageLoader` は通常画像を読み込む際に行われるメモリキャッシュ、スレッド切り替え、ディスク/ネットワークI/Oフェッチ、および画像デコードのすべてを回避します。例を示します。

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

`ColorImage` は、その幅/高さに応じて色付きのボックスを描画したり、キャンバスを色で塗りつぶしたりできるため、テストに有用であり、すべてのプラットフォームでサポートされています。

この戦略は、[Paparazzi](https://github.com/cashapp/paparazzi) と非常に相性が良く、物理デバイスやエミュレータなしでUIのスクリーンショットテストを行うことができます。

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
        // Will display a red box.
        paparazzi.snapshot {
            AsyncImage(
                model = "https://example.com/image.jpg",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeGreen() {
        // Will display a green box.
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/test.png",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeBlue() {
        // Will display a blue box.
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/default.png",
                contentDescription = null,
            )
        }
    }
}