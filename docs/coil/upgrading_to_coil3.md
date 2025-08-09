# 升级到 Coil 3.x

Coil 3 是 Coil 的下一个主要版本，它包含了多项重大改进：

- 全面支持 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，包括所有主要目标平台（Android、iOS、JVM、JS 和 [WASM](https://coil-kt.github.io/coil/sample/)）。
- 支持多种网络库（Ktor 和 OkHttp）。或者，如果您只需要加载本地/静态文件，Coil 也可以在没有网络依赖的情况下使用。
- 改进了 Compose `@Preview` 渲染，并通过 `LocalAsyncImagePreviewHandler` 支持自定义预览行为。
- 针对需要破坏现有行为的 bug 进行了重要修复（如下所述）。

本文档提供了从 Coil 2 到 Coil 3 的主要变化概览，并重点介绍了所有破坏性或重要更改。它不涵盖每一个二进制不兼容的更改或小的行为变化。

在 Compose Multiplatform 项目中使用 Coil 3？请查看 [`samples`](https://github.com/coil-kt/coil/tree/3.x/samples/compose) 仓库以获取示例。

## Maven 坐标和包名

Coil 的 Maven 坐标已从 `io.coil-kt` 更新为 `io.coil-kt.coil3`，其包名已从 `coil` 更新为 `coil3`。这使得 Coil 3 可以与 Coil 2 并行运行，而不会出现二进制兼容性问题。例如，`io.coil-kt:coil:2.7.0` 现在是 `io.coil-kt.coil3:coil:3.0.0`。

为了与 Coroutines、Ktor 和 AndroidX 使用的命名约定保持一致，`coil-base` 和 `coil-compose-base` 工件已分别重命名为 `coil-core` 和 `coil-compose-core`。

## 网络图片

**`coil-core` 不再默认支持从网络加载图片。** [您必须添加对 Coil 某个网络工件的依赖。详见此处。](network.md)。进行此更改是为了让消费者可以使用不同的网络库，或者在应用不需要时避免网络依赖。

此外，缓存控制标头不再默认受尊重。详见 [此处](network.md)。

## 多平台

Coil 3 现在是一个 Kotlin 多平台库，支持 Android、JVM、iOS、macOS、Javascript 和 WASM。

在 Android 上，Coil 使用标准图形类来渲染图片。在非 Android 平台上，Coil 使用 [Skiko](https://github.com/JetBrains/skiko) 来渲染图片。Skiko 是 JetBrains 开发的一组 Kotlin 绑定，它封装了由 Google 开发的 [Skia](https://github.com/google/skia) 图形引擎。

作为与 Android SDK 解耦的一部分，进行了一些 API 更改。值得注意的是：

- `Drawable` 被自定义的 `Image` 接口取代。在 Android 上，使用 `Drawable.asImage()` 和 `Image.asDrawable(resources)` 在这些类之间进行转换。在非 Android 平台上，使用 `Bitmap.asImage()` 和 `Image.toBitmap()`。
- Android 的 `android.net.Uri` 类用法被多平台 `coil3.Uri` 类取代。任何将 `android.net.Uri` 作为 `ImageRequest.data` 传递的调用点不受影响。依赖于接收 `android.net.Uri` 的自定义 `Fetcher` 需要更新为使用 `coil3.Uri`。
- `Context` 的用法被 `PlatformContext` 取代。`PlatformContext` 在 Android 上是 `Context` 的类型别名，在非 Android 平台上可以使用 `PlatformContext.INSTANCE` 访问。在 Compose Multiplatform 中，使用 `LocalPlatformContext.current` 获取引用。
- `Coil` 类被重命名为 `SingletonImageLoader`。
- 如果您在自定义的 Android `Application` 类中实现了 `ImageLoaderFactory`，则需要切换为实现 `SingletonImageLoader.Factory` 来替代 `ImageLoaderFactory`。一旦您实现了 `SingletonImageLoader.Factory`，如果需要或希望覆盖 `newImageLoader()`，您就可以这么做。

多平台支持 `coil-svg` 工件，但 `coil-gif` 和 `coil-video` 工件目前仍仅限 Android 使用，因为它们依赖于特定的 Android 解码器和库。

## Compose

`coil-compose` 工件的 API 大部分未变。您可以继续像 Coil 2 一样使用 `AsyncImage`、`SubcomposeAsyncImage` 和 `rememberAsyncImagePainter`。此外，这些方法已更新为 [可重启和可跳过](https://developer.android.com/jetpack/compose/performance/stability)，这应该会提高它们的性能。

- `AsyncImagePainter.state` 现在是一个 `StateFlow`。应该使用 `val state = painter.state.collectAsState()` 来观察它。
- `AsyncImagePainter` 的默认 `SizeResolver` 不再等待第一次 `onDraw` 调用来获取画布的大小。相反，`AsyncImagePainter` 默认使用 `Size.ORIGINAL`。
- Compose 的 `modelEqualityDelegate` 委托现在通过一个组合本地 `LocalAsyncImageModelEqualityDelegate` 设置，而不是作为 `AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImagePainter` 的参数。

## 通用

其他重要的行为更改包括：

- 第一方 `Fetcher` 和 `Decoder`（例如 `NetworkFetcher.Factory`、`SvgDecoder` 等）现在通过服务加载器自动添加到每个新的 `ImageLoader` 中。此行为可以通过 `ImageLoader.Builder.serviceLoaderEnabled(false)` 禁用。
- 移除对 `android.resource://example.package.name/drawable/image` URI 的支持，因为它会阻止资源缩小优化。建议直接传递 `R.drawable.image` 值。传递资源 ID 而不是资源名称仍然有效：`android.resource://example.package.name/12345678`。如果您仍然需要其功能，可以 [手动将 `ResourceUriMapper` 包含在您的组件注册表中](https://github.com/coil-kt/coil/blob/da7d872e340430014dbc5136e35eb62f9b17662e/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)。
- 文件的最后写入时间戳不再默认添加到其缓存键中。这是为了避免在主线程上读取磁盘（即使时间很短）。可以通过 `ImageRequest.Builder.addLastModifiedToFileCacheKey(true)` 或 `ImageLoader.Builder.addLastModifiedToFileCacheKey(true)` 重新启用此功能。
- 输出图片尺寸现在被强制限制在 4096x4096 以下，以防止意外的内存溢出 (OOM)。这可以通过 `ImageLoader/ImageRequest.Builder.maxBitmapSize` 配置。要禁用此行为，请将 `maxBitmapSize` 设置为 `Size.ORIGINAL`。
- Coil 2 的 `Parameters` API 已被 `Extras` 取代。`Extras` 不需要字符串键，而是依赖于身份相等性。`Extras` 不支持修改内存缓存键。相反，如果您的额外参数影响内存缓存键，请使用 `ImageRequest.memoryCacheKeyExtra`。
- 许多 `ImageRequest.Builder` 函数已移至扩展函数，以更方便地支持多平台。