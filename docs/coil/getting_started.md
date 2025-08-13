# 快速入门

## Compose UI

一个典型的 Compose UI 项目需要导入：

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

导入后，你可以使用 `AsyncImage` 从网络加载图片：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

!!! 注意
    如果你使用 Compose Multiplatform，你需要使用 Ktor 而不是 OkHttp。具体操作请参阅[此处](network.md#ktor-network-engines)。

## Android Views

如果你使用 Android Views 而不是 Compose UI，请导入：

```kotlin
implementation("io.coil-kt.coil3:coil:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

导入后，你可以使用 `ImageView.load` 扩展函数从网络加载图片：

```kotlin
imageView.load("https://example.com/image.jpg")
```

## 配置单例 ImageLoader

默认情况下，Coil 包含一个单例 `ImageLoader`。`ImageLoader` 通过获取、解码、缓存并返回结果来执行传入的 `ImageRequest`。你不需要配置 `ImageLoader`；如果你不进行配置，Coil 将使用默认配置创建单例 `ImageLoader`。

你可以通过多种方式进行配置（**请选择其中一种**）：

-   在应用程序的入口点（应用程序的根 `@Composable`）附近调用 `setSingletonImageLoaderFactory`。**这最适用于 Compose Multiplatform 应用程序。**

```kotlin
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

-   在 Android 中，在你的 [`Application`](https://developer.android.com/reference/android/app/Application) 上实现 `SingletonImageLoader.Factory`。**这最适用于 Android 应用程序。**

```kotlin
class CustomApplication : Application(), SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

-   在应用程序的入口点（例如 Android 上的 `Application.onCreate` 中）附近调用 `SingletonImageLoader.setSafe`。这是最灵活的方式。

```kotlin
SingletonImageLoader.setSafe { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

!!! 注意
    如果你正在编写依赖 Coil 的库，则不应获取/设置单例 `ImageLoader`。相反，你应该依赖 `io.coil-kt.coil3:coil-core`，创建自己的 `ImageLoader`，并手动传递它。如果你在库中设置了单例 `ImageLoader`，则可能会覆盖使用你库的应用程序所设置的 `ImageLoader`（如果它们也使用 Coil）。

## 构件

以下是 Coil 发布到 `mavenCentral()` 的主要构件列表：

*   `io.coil-kt.coil3:coil`：默认构件，依赖于 `io.coil-kt.coil3:coil-core`。它包含一个单例 `ImageLoader` 及相关的扩展函数。
*   `io.coil-kt.coil3:coil-core`：`io.coil-kt.coil3:coil` 的一个子集，**不**包含单例 `ImageLoader` 及相关的扩展函数。
*   `io.coil-kt.coil3:coil-compose`：默认的 [Compose UI](https://www.jetbrains.com/compose-multiplatform/) 构件，依赖于 `io.coil-kt.coil3:coil` 和 `io.coil-kt.coil3:coil-compose-core`。它包含使用单例 `ImageLoader` 的 `AsyncImage`、`rememberAsyncImagePainter` 和 `SubcomposeAsyncImage` 的重载。
*   `io.coil-kt.coil3:coil-compose-core`：`io.coil-kt.coil3:coil-compose` 的一个子集，不包含依赖于单例 `ImageLoader` 的函数。
*   `io.coil-kt.coil3:coil-network-okhttp`：包含使用 [OkHttp](https://github.com/square/okhttp) 从网络获取图片的支持。
*   `io.coil-kt.coil3:coil-network-ktor2`：包含使用 [Ktor 2](https://github.com/ktorio/ktor) 从网络获取图片的支持。
*   `io.coil-kt.coil3:coil-network-ktor3`：包含使用 [Ktor 3](https://github.com/ktorio/ktor) 从网络获取图片的支持。
*   `io.coil-kt.coil3:coil-network-cache-control`：包含在从网络获取图片时，支持遵守 [`Cache-Control` 头部](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)的特性。
*   `io.coil-kt.coil3:coil-gif`：包含两个[解码器](/coil/api/coil-core/coil3.decode/-decoder)以支持解码 GIF。更多详情请参阅 [GIFs](gifs.md)。
*   `io.coil-kt.coil3:coil-svg`：包含一个[解码器](/coil/api/coil-core/coil3.decode/-decoder)以支持解码 SVG。更多详情请参阅 [SVGs](svgs.md)。
*   `io.coil-kt.coil3:coil-video`：包含一个[解码器](/coil/api/coil-core/coil3.decode/-decoder)以支持解码 [Android 支持的任何视频格式](https://developer.android.com/guide/topics/media/media-formats#video-codecs)中的帧。更多详情请参阅 [videos](videos.md)。
*   `io.coil-kt.coil3:coil-test`：包含支持测试的类。更多详情请参阅 [testing](testing.md)。
*   `io.coil-kt.coil3:coil-bom`：包含一个[材料清单 (bill of materials)](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)。导入 `coil-bom` 允许你依赖其他 Coil 构件而无需指定版本。