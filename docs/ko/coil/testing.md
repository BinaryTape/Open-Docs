# 테스팅

테스트 지원 클래스를 사용하려면 확장 라이브러리를 가져옵니다:

```kotlin
testImplementation("io.coil-kt.coil3:coil-test:3.3.0")
```

`coil-test`에는 `FakeImageLoaderEngine`이 포함되어 있으며, 이를 `ImageLoader`에 추가하여 들어오는 모든 `ImageRequest`를 가로채고 커스텀 `ImageResult`를 반환할 수 있습니다. 이는 이미지 로딩을 동기적(메인 스레드에서)이고 일관되게 만들어 테스트에 유용합니다. `FakeImageLoaderEngine`을 사용하면 `ImageLoader`는 일반적으로 이미지를 로드하기 위해 수행되는 모든 메모리 캐싱, 스레드 점프, 디스크/네트워크 I/O 페칭, 이미지 디코딩을 피하게 됩니다. 다음은 예시입니다:

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

`ColorImage`는 너비/높이에 따라 색상 상자를 그리거나 캔버스를 색상으로 채울 수 있으며 모든 플랫폼에서 지원되므로 테스트에 유용합니다.

이 전략은 [Paparazzi](https://github.com/cashapp/paparazzi)와 함께 물리적 장치나 에뮬레이터 없이 UI 스크린샷 테스트를 하는 데 매우 효과적입니다:

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
        // 빨간색 상자가 표시됩니다.
        paparazzi.snapshot {
            AsyncImage(
                model = "https://example.com/image.jpg",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeGreen() {
        // 녹색 상자가 표시됩니다.
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/test.png",
                contentDescription = null,
            )
        }
    }

    @Test
    fun testContentComposeBlue() {
        // 파란색 상자가 표시됩니다.
        paparazzi.snapshot {
            AsyncImage(
                model = "https://www.example.com/default.png",
                contentDescription = null,
            )
        }
    }
}