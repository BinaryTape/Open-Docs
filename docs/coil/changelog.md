# 更新日志

## [3.3.0] - 2025 年 7 月 22 日

- **新特性**：引入了一个新的 API，用于在应用程序处于后台时限制 Android 上的 `MemoryCache.maxSize`。
    - 如果设置了 `ImageLoader.Builder.memoryCacheMaxSizePercentWhileInBackground`，`ImageLoader` 的内存缓存将在应用程序处于后台时被限制为其最大大小的某个百分比。此设置目前默认禁用。
    - 当应用程序处于后台时，图像将从内存缓存中修剪，以达到限制的最大大小，但内存缓存对最近修剪图像的弱引用不受影响。这意味着如果图像当前在其他地方被引用（例如 `AsyncImage`、`ImageView` 等），它仍将存在于内存缓存中。
    - 此 API 有助于减少后台内存使用，防止您的应用程序过早被终止，并有助于减轻用户设备的内存压力。
- **新特性**：为 `SvgDecoder` 添加一个 `Svg.Parser` 参数。
    - 这使得在默认 SVG 解析器不满足您的需求时，可以使用自定义 SVG 解析器。
- 为 `SvgDecoder` 添加一个 `density` 参数，以支持提供自定义密度乘数。
- 添加 `Uri.Builder` 以支持复制和修改 `Uri`。
- 添加 `ImageLoader.Builder.mainCoroutineContext` 以支持在测试中覆盖 Coil 对 `Dispatchers.main.immediate` 的使用。
- 修复了当 `start` 图像在动画结束时被解引用时 `CrossfadePainter.intrinsicSize` 发生变化的问题。这与 `CrossfadeDrawable` 的行为保持一致。
- 修复了 `ImageLoaders.executeBlocking` 在 Java 中无法访问的问题。
- 在 `coil-network-ktor3` 中使用 `kotlinx.io` 的 Okio 互操作模块。
- 更新 `kotlinx-datetime` 至 `0.7.1`。
    - 此版本包含二进制不兼容的更改，仅影响 `coil-network-cache-control` 模块。有关更多信息，请参阅[此处](https://github.com/Kotlin/kotlinx-datetime?tab=readme-ov-file#deprecation-of-instant)。
- 更新 Kotlin 到 2.2.0。
- 更新 Compose 到 1.8.2。
- 更新 Okio 到 3.15.0。
- 更新 Skiko 到 0.9.4.2。

## [3.2.0] - 2025 年 5 月 13 日

自 `3.1.0` 以来的变更：

- **重要**：`coil-compose` 和 `coil-compose-core` 现在需要 Java 11 字节码，因为 Compose `1.8.0` 要求它。有关如何启用它的信息，请参阅[此处](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11)。
- 将 `AsyncImagePreviewHandler` 的函数式构造函数更改为返回 `AsyncImagePainter.State.Success` 而不是 `AsyncImagePainter.State.Loading`。
- 修复了 `ConstraintsSizeResolver#size()` 中的取消问题。
- 修复了使用 R8 构建时 `PlatformContext` 缺失的警告。
- 修复了当返回默认 `FakeImageLoaderEngine` 响应时，`FakeImageLoaderEngine` 未设置 `Transition.Factory.NONE` 的问题。
- 从 `ColorImage` 中移除实验性注解。
- 在 `CacheControlCacheStrategy` 中延迟解析网络头。
- 重构 `CircleCropTransformation` 和 `RoundedCornersTransformation` 以共享通用代码。
- 如果 `ExifOrientationStrategy` 不是 `RESPECT_PERFORMANCE`，则内部回退到使用 `BitmapFactory`。
- 更新 Kotlin 到 2.1.20。
- 更新 Compose 到 1.8.0。
- 更新 Okio 到 3.11.0。
- 更新 Skiko 到 0.9.4。
- 更新 Coroutines 到 1.10.2。
- 更新 `accompanist-drawablepainter` 到 0.37.3。

自 `3.2.0-rc02` 以来的变更：

- 如果 `ExifOrientationStrategy` 不是 `RESPECT_PERFORMANCE`，则内部回退到使用 `BitmapFactory`。
- 更新 Compose 到 1.8.0。
- 更新 `accompanist-drawablepainter` 到 0.37.3。

## [3.2.0-rc02] - 2025 年 4 月 26 日

- 修复了在使用 `KtorNetworkFetcherFactory` (Ktor 3) 在非 JVM 目标上加载图像时，图像请求因 `ClosedByteChannelException` 而失败的问题。

## [3.2.0-rc01] - 2025 年 4 月 24 日

- **重要**：`coil-compose` 和 `coil-compose-core` 现在需要 Java 11 字节码，因为 Compose `1.8.0` 要求它。有关如何启用它的信息，请参阅[此处](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11)。
- 将 `AsyncImagePreviewHandler` 的函数式构造函数更改为返回 `AsyncImagePainter.State.Success` 而不是 `AsyncImagePainter.State.Loading`。
- 修复了 `ConstraintsSizeResolver#size()` 中的取消问题。
- 修复了使用 R8 构建时 `PlatformContext` 缺失的警告。
- 修复了当返回默认 `FakeImageLoaderEngine` 响应时，`FakeImageLoaderEngine` 未设置 `Transition.Factory.NONE` 的问题。
- 从 `ColorImage` 中移除实验性注解。
- 在 `CacheControlCacheStrategy` 中延迟解析网络头。
- 重构 `CircleCropTransformation` 和 `RoundedCornersTransformation` 以共享通用代码。
- 在 `coil-network-ktor2` 和 `coil-network-ktor3` 中使用 `kotlinx.io` 的 Okio 互操作模块。
- 更新 Kotlin 到 2.1.20。
- 更新 Compose 到 1.8.0-rc01。
- 更新 Okio 到 3.11.0。
- 更新 Skiko 到 0.9.4。
- 更新 Coroutines 到 1.10.2。

## [3.1.0] - 2025 年 2 月 4 日

- 提升 `AsyncImage` 的性能。
    - 运行时性能提升了 25% 到 40%，具体取决于可组合项是正在实例化还是被复用。内存分配也减少了 35% 到 48%。更多信息请参阅[此处](https://github.com/coil-kt/coil/pull/2795)。
- 添加 `ColorImage` 并弃用 `FakeImage`。
    - `ColorImage` 在测试和预览中返回模拟值时很有用。它解决了与 `FakeImage` 相同的用例，但在 `coil-core` 中比在 `coil-test` 中更容易访问。
- 移除 `coil-compose-core` 对 `Dispatchers.Main.immedate` 的依赖。
    - 这也修复了 `AsyncImagePainter` 在 Paparazzi 和 Roborazzi 屏幕截图测试中不同步执行 `ImageRequest` 的情况。
- 添加对[数据 URI](https://www.ietf.org/rfc/rfc2397.txt) 的支持，格式为：`data:[<mediatype>][;base64],<data>`。
- 添加 `AnimatedImageDecoder.ENCODED_LOOP_COUNT` 以支持在 GIF 的元数据中使用编码的重复计数。
- 为 `NetworkRequest` 添加 `Extras` 以支持自定义扩展。
- 添加 `DiskCache.Builder.cleanupCoroutineContext` 并弃用 `DiskCache.Builder.cleanupDispatcher`。
- 添加 `ImageLoader.Builder.imageDecoderEnabled` 以选择性地禁用在 API 29 及更高版本上使用 `android.graphics.ImageDecoder`。
- 如果 `ImageRequest` 的数据类型没有注册 `Keyer`，则记录一条警告。
- 将 `CrossfadePainter` 公开。
- 支持所有多平台目标上的 `Transformation`。
- 在 `CacheControlCacheStrategy` 中支持将 0 作为 `Expires` 头的值。
- 修复了 `AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImage` 在其 `ContentScale` 更改为/从 `None` 时不启动新的 `ImageRequest` 的问题。
- 更新 Kotlin 到 2.1.10。
    - 注意：如果使用 Kotlin native，此版本需要使用 Kotlin 2.1.0 或更高版本进行编译，因为 LLVM 进行了更新，请参阅[此处](https://kotlinlang.org/docs/whatsnew21.html#llvm-update-from-11-1-0-to-16-0-0)了解更多信息。
- 更新 Compose 到 1.7.3。
- 更新 `androidx.core` 到 1.15.0。

## [3.0.4] - 2024 年 11 月 25 日

- 修复了矢量可绘制对象在 Android Studio 预览中不渲染的问题。
- 修复了请求大小超过 `maxBitmapSize` 时潜在的内存缓存未命中问题。
- 修复了 `FakeImage` 在 Android 上不渲染的问题。
- 修复了当与 `AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage` 一起使用时，如果请求的 `Transformation` 发生变化，则不启动新图像请求的问题。
- 修复了 `ScaleDrawable` 和 `CrossfadeDrawable` 不尊重色调状态的问题。
- 允许 `ImageDecoder` 解码部分图像源。这与 `BitmapFactory` 中的行为保持一致。
- 修复了解码后未调用 `Bitmap.prepareToDraw()` 的问题。
- `SvgDecoder` 不应为非栅格化图像返回 `isSampled = true`。
- 如果即时主调度器不可用，Compose 中回退到 `Dispatchers.Unconfined`。这仅在预览/测试环境中使用。
- 更新 Ktor 2 到 `2.3.13`。

## [3.0.3] - 2024 年 11 月 14 日

- 修复了根据 `ImageView` 的 `ScaleType` 设置 `ImageRequest.scale` 的问题。
- 修复了 `DiskCache` 在删除文件后不会跟踪条目删除的边缘情况。
- 在记录错误时将可抛出对象传递给 `Logger`。
- 不要用 `kotlin-stdlib` 替换 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`。

## [3.0.2] - 2024 年 11 月 9 日

- 修复了在 Android 上使用自定义 `CacheStrategy` 调用 `OkHttpNetworkFetcherFactory` 时崩溃的问题。
- 修复了 `CacheControlCacheStrategy` 错误计算缓存条目年龄的问题。
- 修复了当 `ImageRequest.bitmapConfig` 仅在 API 28 及更高版本上被遵循的情况，如果它是 `ARGB_8888` 或 `HARDWARE`。

## [3.0.1] - 2024 年 11 月 7 日

- 修复了使用硬件位图支持的 `BitmapImage` 调用 `Image.toBitmap` 时崩溃的问题。
- 修复了 `AsyncImageModelEqualityDelegate.Default` 对非 `ImageRequest` 模型错误比较相等性的问题。

## [3.0.0] - 2024 年 11 月 4 日

Coil 3.0.0 是 Coil 的下一个主要版本，全面支持 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)。

有关 3.0.0 中改进和重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

自 `3.0.0-rc02` 以来的变更：

- 移除剩余的已弃用方法。

## [3.0.0-rc02] - 2024 年 10 月 28 日

有关 3.x 中改进和重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。自 `3.0.0-rc01` 以来的变更：

- 添加 `BlackholeDecoder`。这简化了[仅磁盘缓存预加载](https://coil-kt.github.io/coil/faq/#how-do-i-preload-an-image)。
- 为 `ConstraintsSizeResolver` 和 `DrawScopeSizeResolver` 添加 `remember` 函数。
- 从 `AsyncImage` 中移除 `EqualityDelegate` 参数。相反，它应该通过 `LocalAsyncImageModelEqualityDelegate` 进行设置。
- 修复了当父可组合项使用 `IntrinsicSize` 时 `AsyncImage` 不渲染的问题。
- 修复了当 `AsyncImagePainter` 没有子绘制器时，`AsyncImage` 填充可用约束的问题。
- 修复了当 `rememberAsyncImagePainter` 的状态由于 `EqualityDelegate` 被忽略而导致无限重组的问题。
- 修复了解析包含特殊字符的 `File`/`Path` 路径的问题。
- 修复了 `VideoFrameDecoder` 使用自定义 `FileSystem` 实现的问题。
- 更新 Ktor 到 `3.0.0`。
- 更新 `androidx.annotation` 到 `1.9.0`。

## [3.0.0-rc01] - 2024 年 10 月 8 日

有关 3.x 中改进和重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。自 `3.0.0-alpha10` 以来的变更：

- **破坏性变更**：默认禁用 `addLastModifiedToFileCacheKey`，并允许它按请求设置。可以通过相同的标志重新启用此行为。
- **新特性**：引入了一个新的 `coil-network-cache-control` 工件，它实现了 [`Cache-Control` 头](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)支持。
- **新特性**：为 `SvgDecoder.Factory` 添加 `scaleToDensity` 属性。此属性确保具有固有尺寸的 SVG 会乘以设备密度（仅在 Android 上支持）。
- 将 `ExifOrientationPolicy` 重命名为 `ExifOrientationStrategy`。
- 在获取时从 `MemoryCache` 中移除不可共享的图像。
- 将 `ConstraintsSizeResolver` 公开。
- 稳定 `setSingletonImageLoaderFactory`。
- 恢复 `coil-network-ktor3` 中优化的 JVM I/O 函数。
- 将 `pdf` 添加到 mime 类型列表。
- 更新编译 SDK 到 35。
- 更新 Kotlin 到 2.0.20。
- 更新 Okio 到 3.9.1。

## [3.0.0-alpha10] - 2024 年 8 月 7 日

- **破坏性变更**：将 `ImageLoader.Builder.networkObserverEnabled` 替换为 `NetworkFetcher` 的 `ConnectivityChecker` 接口。
    - 要禁用网络观察器，请将 `ConnectivityChecker.ONLINE` 传递给 `KtorNetworkFetcherFactory`/`OkHttpNetworkFetcherFactory` 的构造函数。
- **新特性**：支持在所有平台上加载 [Compose Multiplatform 资源](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-images-resources.html)。要加载资源，请使用 `Res.getUri`：

```kotlin
AsyncImage(
    model = Res.getUri("drawable/image.jpg"),
    contentDescription = null,
)
```

- 为 `ImageLoader` 和 `ImageRequest` 添加 `maxBitmapSize` 属性。
    - 此属性默认为 4096x4096，并为分配的位图尺寸提供了一个安全的上限。这有助于避免意外加载非常大的图像（使用 `Size.ORIGINAL`）并导致内存不足异常。
- 将 `ExifOrientationPolicy` 转换为接口以支持自定义策略。
- 修复了 `Uri` 处理 Windows 文件路径的问题。
- 从 `Image` API 中移除 `@ExperimentalCoilApi`。
- 更新 Kotlin 到 2.0.10。

## [3.0.0-alpha09] - 2024 年 7 月 23 日

- **破坏性变更**：将 `io.coil-kt.coil3:coil-network-ktor` 工件重命名为 `io.coil-kt.coil3:coil-network-ktor2`，它依赖于 Ktor 2.x。此外，引入 `io.coil-kt.coil3:coil-network-ktor3`，它依赖于 Ktor 3.x。`wasmJs` 支持仅在 Ktor 3.x 中可用。
- **新特性**：添加 `AsyncImagePainter.restart()` 以手动重新启动图像请求。
- 从 `NetworkClient` 及相关类中移除 `@ExperimentalCoilApi`。
- 优化 `ImageRequest` 以避免不必要的 `Extras` 和 `Map` 内存分配。

## [2.7.0] - 2024 年 7 月 17 日

- 略微优化内部协程的使用，以提高 `ImageLoader.execute`、`AsyncImage`、`SubcomposeAsyncImage` 和 `rememberAsyncImagePainter` 的性能。([#2205](https://github.com/coil-kt/coil/pull/2205))
- 修复了分块响应的重复网络调用问题。([#2363](https://github.com/coil-kt/coil/pull/2363))
- 更新 Kotlin 到 2.0.0。
- 更新 Compose UI 到 1.6.8。
- 更新 Okio 到 3.9.0。

## [3.0.0-alpha08] - 2024 年 7 月 8 日

- **破坏性变更**：将 `ImageRequest` 和 `ImageLoader` 的 `dispatcher` 方法重命名为 `coroutineContext`。例如，`ImageRequest.Builder.dispatcher` 现在是 `ImageRequest.Builder.coroutineContext`。此重命名是因为该方法现在接受任何 `CoroutineContext`，并且不再需要 `Dispatcher`。
- 修复：修复了可能由于竞态条件而导致的 `IllegalStateException: Reading a state that was created after the snapshot was taken or in a snapshot that has not yet been applied` 错误。
    - 注意：这重新引入了对 `Dispatchers.Main.immediate` 的软依赖。因此，您应该在 JVM 上重新添加对 [`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/) 的依赖。如果未导入，`ImageRequest` 将不会立即分派，并且在设置 `ImageRequest.placeholder` 或从内存缓存解析之前会有单帧延迟。

## [3.0.0-alpha07] - 2024 年 6 月 26 日

- **破坏性变更**：`AsyncImagePainter` 默认不再等待 `onDraw`，而是使用 `Size.ORIGINAL`。
    - 这修复了[与 Roborazzi/Paparazzi 的兼容性问题](https://github.com/coil-kt/coil/issues/1910)，并整体提高了测试可靠性。
    - 要恢复等待 `onDraw` 的行为，请将 `DrawScopeSizeResolver` 设置为您的 `ImageRequest.sizeResolver`。
- **破坏性变更**：重构多平台 `Image` API。值得注意的是，`asCoilImage` 已重命名为 `asImage`。
- **破坏性变更**：`AsyncImagePainter.state` 已更改为 `StateFlow<AsyncImagePainter.State>`。使用 `collectAsState` 观察其值。这可以提高性能。
- **破坏性变更**：`AsyncImagePainter.imageLoader` 和 `AsyncImagePainter.request` 已合并为 `StateFlow<AsyncImagePainter.Inputs>`。使用 `collectAsState` 观察其值。这可以提高性能。
- **破坏性变更**：移除对 `android.resource://example.package.name/drawable/image` URI 的支持，因为它会阻止资源缩小优化。
    - 如果您仍然需要此功能，可以[手动将 `ResourceUriMapper` 包含到您的组件注册表中](https://github.com/coil-kt/coil/blob/main/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)。
- **新特性**：引入 `AsyncImagePreviewHandler` 以支持控制 `AsyncImagePainter` 的预览渲染行为。
    - 使用 `LocalAsyncImagePreviewHandler` 覆盖预览行为。
    - 作为此更改和 `coil-compose` 其他改进的一部分，`AsyncImagePainter` 现在默认尝试执行 `ImageRequest`，而不是默认显示 `ImageRequest.placeholder`。[使用网络或文件的请求](https://developer.android.com/develop/ui/compose/tooling/previews#preview-limitations)在预览环境中预计会失败，但 Android 资源应该可以工作。
- **新特性**：支持按帧索引提取视频图像。([#2183](https://github.com/coil-kt/coil/pull/2183))
- **新特性**：支持将 `CoroutineContext` 传递给任何 `CoroutineDispatcher` 方法。([#2241](https://github.com/coil-kt/coil/pull/2241))。
- **新特性**：支持 JS 和 WASM JS 上的弱引用内存缓存。
- 不在 Compose 中分派到 `Dispatchers.Main.immediate`。副作用是，在 JVM 上不再需要导入 [`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/)。
- 不在 Compose 中调用 `async` 并创建可处置对象以提高性能（感谢 @mlykotom！）。([#2205](https://github.com/coil-kt/coil/pull/2205))
- 修复了将全局 `ImageLoader` 额外数据传递给 `Options` 的问题。([#2223](https://github.com/coil-kt/coil/pull/2223))
- 修复了 `crossfade(false)` 在非 Android 目标上不起作用的问题。
- 修复了 VP8X 特性标志字节偏移的问题。([#2199](https://github.com/coil-kt/coil/pull/2199))
- 将非 Android 目标上的 `SvgDecoder` 转换为渲染到位图，而不是在绘制时渲染图像。这提高了性能。
    - 此行为可以使用 `SvgDecoder(renderToBitmap)` 进行控制。
- 将 `ScaleDrawable` 从 `coil-gif` 移动到 `coil-core`。
- 更新 Kotlin 到 2.0.0。
- 更新 Compose 到 1.6.11。
- 更新 Okio 到 3.9.0。
- 更新 Skiko 到 0.8.4。
- 有关 3.x 中重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

## [3.0.0-alpha06] - 2024 年 2 月 29 日

- 将 Skiko 降级到 0.7.93。
- 有关 3.x 中重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

## [3.0.0-alpha05] - 2024 年 2 月 28 日

- **新特性**：支持 `wasmJs` 目标。
- 创建 `DrawablePainter` 和 `DrawableImage` 以支持在非 Android 平台上绘制不以 `Bitmap` 为后备的 `Image`。
    - `Image` API 是实验性的，在 alpha 版本之间可能会发生变化。
- 更新 `ContentPainterModifier` 以实现 `Modifier.Node`。
- 修复：在后台线程上延迟注册组件回调和网络观察器。这修复了通常在主线程上发生的缓慢初始化问题。
- 修复：修复了 `ImageLoader.Builder.placeholder/error/fallback` 未被 `ImageRequest` 使用的问题。
- 更新 Compose 到 1.6.0。
- 更新 Coroutines 到 1.8.0。
- 更新 Okio 到 3.8.0。
- 更新 Skiko 到 0.7.94。
- 有关 3.x 中重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

## [2.6.0] - 2024 年 2 月 23 日

- 使 `rememberAsyncImagePainter`、`AsyncImage` 和 `SubcomposeAsyncImage` [可重新启动和可跳过](https://developer.android.com/jetpack/compose/performance/stability#functions)。这通过避免重新组合，除非可组合项的某个参数发生更改，从而提高了性能。
    - 为 `rememberAsyncImagePainter`、`AsyncImage` 和 `SubcomposeAsyncImage` 添加一个可选的 `modelEqualityDelegate` 参数，以控制 `model` 是否会触发重新组合。
- 更新 `ContentPainterModifier` 以实现 `Modifier.Node`。
- 修复：在后台线程上延迟注册组件回调和网络观察器。这修复了通常在主线程上发生的缓慢初始化问题。
- 修复：如果 `ImageRequest.listener` 或 `ImageRequest.target` 发生更改，避免在 `rememberAsyncImagePainter`、`AsyncImage` 和 `SubcomposeAsyncImage` 中重新启动新的图像请求。
- 修复：不要在 `AsyncImagePainter` 中两次观察图像请求。
- 更新 Kotlin 到 1.9.22。
- 更新 Compose 到 1.6.1。
- 更新 Okio 到 3.8.0。
- 更新 `androidx.collection` 到 1.4.0。
- 更新 `androidx.lifecycle` 到 2.7.0。

## [3.0.0-alpha04] - 2024 年 2 月 1 日

- **破坏性变更**：从 `OkHttpNetworkFetcherFactory` 和 `KtorNetworkFetcherFactory` 的公共 API 中移除 `Lazy`。
- 在 `OkHttpNetworkFetcherFactory` 中公开 `Call.Factory` 而不是 `OkHttpClient`。
- 将 `NetworkResponseBody` 转换为包装 `ByteString`。
- 将 Compose 降级到 1.5.12。
- 有关重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

## [3.0.0-alpha03] - 2024 年 1 月 20 日

- **破坏性变更**：`coil-network` 已重命名为 `coil-network-ktor`。此外，还有一个新的 `coil-network-okhttp` 工件，它依赖于 OkHttp，并且不需要指定 Ktor 引擎。
    - 根据您导入的工件，您可以使用 `KtorNetworkFetcherFactory` 或 `OkHttpNetworkFetcherFactory` 手动引用 `Fetcher.Factory`。
- 支持在 Apple 平台上加载 `NSUrl`。
- 为 `AsyncImage` 添加 `clipToBounds` 参数。
- 有关重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

## [3.0.0-alpha02] - 2024 年 1 月 10 日

- **破坏性变更**：`coil-gif`、`coil-network`、`coil-svg` 和 `coil-video` 的包已更新，因此它们的所有类都分别属于 `coil.gif`、`coil.network`、`coil.svg` 和 `coil.video`。这有助于避免与其他工件的类名冲突。
- **破坏性变更**：`ImageDecoderDecoder` 已重命名为 `AnimatedImageDecoder`。
- **新特性**：`coil-gif`、`coil-network`、`coil-svg` 和 `coil-video` 的组件现在会自动添加到每个 `ImageLoader` 的 `ComponentRegistry` 中。
    - 明确地说，与 `3.0.0-alpha01` 不同，**您不需要手动将 `NetworkFetcher.Factory()` 添加到您的 `ComponentRegistry` 中**。只需导入 `io.coil-kt.coil3:coil-network:[version]` 和[一个 Ktor 引擎](https://ktor.io/docs/http-client-engines.html#dependencies)就足以加载网络图像。
    - 手动将这些组件添加到 `ComponentRegistry` 也是安全的。任何手动添加的组件优先于自动添加的组件。
    - 如果需要，可以使用 `ImageLoader.Builder.serviceLoaderEnabled(false)` 禁用此行为。
- **新特性**：支持所有平台上的 `coil-svg`。它在 Android 上由 [AndroidSVG](https://bigbadaboom.github.io/androidsvg/) 提供支持，在非 Android 平台上由 [SVGDOM](https://api.skia.org/classSkSVGDOM.html) 提供支持。
- Coil 现在内部使用 Android 的 [`ImageDecoder`](https://developer.android.com/reference/android/graphics/ImageDecoder) API，这在直接从文件、资源或内容 URI 解码时具有性能优势。
- 修复：多个 `coil3.Uri` 解析修复。
- 有关重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

## [3.0.0-alpha01] - 2023 年 12 月 30 日

- **新特性**：[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 支持。Coil 现在是一个 Kotlin Multiplatform 库，支持 Android、JVM、iOS、macOS 和 Javascript。
- Coil 的 Maven 坐标已更新为 `io.coil-kt.coil3`，其导入已更新为 `coil3`。这使得 Coil 3 可以与 Coil 2 并行运行，而不会出现二进制兼容性问题。例如，`io.coil-kt:coil:[version]` 现在是 `io.coil-kt.coil3:coil:[version]`。
- `coil-base` 和 `coil-compose-base` 工件已分别重命名为 `coil-core` 和 `coil-compose-core`，以与 Coroutines、Ktor 和 AndroidX 使用的命名约定保持一致。
- 有关重要更改的完整列表，请查看[升级指南](https://coil-kt.github.io/coil/upgrading_to_coil3/)。

## [2.5.0] - 2023 年 10 月 30 日

- **新特性**：添加 `MediaDataSourceFetcher.Factory` 以支持在 `coil-video` 中解码 `MediaDataSource` 实现。([#1795](https://github.com/coil-kt/coil/pull/1795))
- 将 `SHIFT6m` 设备添加到硬件位图黑名单中。([#1812](https://github.com/coil-kt/coil/pull/1812))
- 修复：防止绘制器返回具有一个无界尺寸的大小。([#1826](https://github.com/coil-kt/coil/pull/1826))
- 修复：当缓存头包含非 ASCII 字符时，磁盘缓存加载在 `304 Not Modified` 后失败。([#1839](https://github.com/coil-kt/coil/pull/1839))
- 修复：`FakeImageEngine` 未更新拦截器链的请求。([#1905](https://github.com/coil-kt/coil/pull/1905))
- 更新编译 SDK 到 34。
- 更新 Kotlin 到 1.9.10。
- 更新 Coroutines 到 1.7.3。
- 更新 `accompanist-drawablepainter` 到 0.32.0。
- 更新 `androidx.annotation` 到 1.7.0。
- 更新 `androidx.compose.foundation` 到 1.5.4。
- 更新 `androidx.core` 到 1.12.0。
- 更新 `androidx.exifinterface:exifinterface` 到 1.3.6。
- 更新 `androidx.lifecycle` 到 2.6.2。
- 更新 `com.squareup.okhttp3` 到 4.12.0。
- 更新 `com.squareup.okio` 到 3.6.0。

## [2.4.0] - 2023 年 5 月 21 日

- 将 `DiskCache` 的 `get`/`edit` 重命名为 `openSnapshot`/`openEditor`。
- 不要自动将 `ColorDrawable` 转换为 `ColorPainter` 在 `AsyncImagePainter` 中。
- 使用 `@NonRestartableComposable` 注解简单的 `AsyncImage` 重载。
- 修复：在 `ImageSource` 中延迟调用 `Context.cacheDir`。
- 修复：修复发布 `coil-bom` 的问题。
- 修复：修复了如果硬件位图被禁用，总是将位图配置设置为 `ARGB_8888` 的问题。
- 更新 Kotlin 到 1.8.21。
- 更新 Coroutines 到 1.7.1。
- 更新 `accompanist-drawablepainter` 到 0.30.1。
- 更新 `androidx.compose.foundation` 到 1.4.3。
- 更新 `androidx.profileinstaller:profileinstaller` 到 1.3.1。
- 更新 `com.squareup.okhttp3` 到 4.11.0。

## [2.3.0] - 2023 年 3 月 25 日

- **新特性**：引入了一个新的 `coil-test` 工件，其中包括 `FakeImageLoaderEngine`。此类对于硬编码图像加载器响应（以确保测试中一致且同步（从主线程）的响应）很有用。有关更多信息，请参阅[此处](https://coil-kt.github.io/coil/testing)。
- **新特性**：为 `coil-base`（`coil` 的子模块）和 `coil-compose-base`（`coil-compose` 的子模块）添加了[基线配置文件](https://developer.android.com/topic/performance/baselineprofiles/overview)。
    - 这提高了 Coil 的运行时性能，并且根据 Coil 在您的应用程序中的使用方式，应该能提供[更好的帧时间](https://github.com/coil-kt/coil/tree/main/coil-benchmark/benchmark_output.md)。
- 修复：修复了解析包含编码数据的 `file://` URI 的问题。 [#1601](https://github.com/coil-kt/coil/pull/1601)
- 修复：如果传递的目录不存在，`DiskCache` 现在可以正确计算其最大大小。 [#1620](https://github.com/coil-kt/coil/pull/1620)
- 将 `Coil.reset` 公开为 API。 [#1506](https://github.com/coil-kt/coil/pull/1506)
- 启用 Java 默认方法生成。 [#1491](https://github.com/coil-kt/coil/pull/1491)
- 更新 Kotlin 到 1.8.10。
- 更新 `accompanist-drawablepainter` 到 0.30.0。
- 更新 `androidx.annotation` 到 1.6.0。
- 更新 `androidx.appcompat:appcompat-resources` 到 1.6.1。
- 更新 `androidx.compose.foundation` 到 1.4.0。
- 更新 `androidx.core` 到 1.9.0。
- 更新 `androidx.exifinterface:exifinterface` 到 1.3.6。
- 更新 `androidx.lifecycle` 到 2.6.1。
- 更新 `okio` 到 3.3.0。

## [2.2.2] - 2022 年 10 月 1 日

- 确保图像加载器完全初始化后再注册其系统回调。 [#1465](https://github.com/coil-kt/coil/pull/1465)
- 在 API 30+ 上，在 `VideoFrameDecoder` 中设置首选位图配置以避免色带。 [#1487](https://github.com/coil-kt/coil/pull/1487)
- 修复了 `FileUriMapper` 中解析包含 `#` 路径的问题。 [#1466](https://github.com/coil-kt/coil/pull/1466)
- 修复了从磁盘缓存读取包含非 ASCII 头部的响应的问题。 [#1468](https://github.com/coil-kt/coil/pull/1468)
- 修复了在资产子文件夹内解码视频的问题。 [#1489](https://github.com/coil-kt/coil/pull/1489)
- 更新 `androidx.annotation` 到 1.5.0。

## [2.2.1] - 2022 年 9 月 8 日

- 修复：`RoundedCornersTransformation` 现在正确缩放 `input` 位图。
- 移除对 `kotlin-parcelize` 插件的依赖。
- 更新编译 SDK 到 33。
- 将 `androidx.appcompat:appcompat-resources` 降级到 1.4.2，以解决 [#1423](https://github.com/coil-kt/coil/issues/1423) 问题。

## [2.2.0] - 2022 年 8 月 16 日

- **新特性**：为 `coil-video` 添加 `ImageRequest.videoFramePercent` 以支持将视频帧指定为视频持续时间的百分比。
- **新特性**：添加 `ExifOrientationPolicy` 以配置 `BitmapFactoryDecoder` 如何处理 EXIF 方向数据。
- 修复：如果传递给 `RoundedCornersTransformation` 的大小包含未定义的维度，则不要抛出异常。
- 修复：将 GIF 的帧延迟读取为两个无符号字节，而不是一个有符号字节。
- 更新 Kotlin 到 1.7.10。
- 更新 Coroutines 到 1.6.4。
- 更新 Compose 到 1.2.1。
- 更新 OkHttp 到 4.10.0。
- 更新 Okio 到 3.2.0。
- 更新 `accompanist-drawablepainter` 到 0.25.1。
- 更新 `androidx.annotation` 到 1.4.0。
- 更新 `androidx.appcompat:appcompat-resources` 到 1.5.0。
- 更新 `androidx.core` 到 1.8.0。

## [2.1.0] - 2022 年 5 月 17 日

- **新特性**：支持加载 `ByteArray`。([#1202](https://github.com/coil-kt/coil/pull/1202))
- **新特性**：使用 `ImageRequest.Builder.css` 支持为 SVG 设置自定义 CSS 规则。([#1210](https://github.com/coil-kt/coil/pull/1210))
- 修复：将 `GenericViewTarget` 的私有方法转换为保护方法。([#1273](https://github.com/coil-kt/coil/pull/1273))
- 更新编译 SDK 到 32。([#1268](https://github.com/coil-kt/coil/pull/1268))

## [2.0.0] - 2022 年 5 月 10 日

Coil 2.0.0 是该库的一个主要迭代，包含破坏性更改。请查看[升级指南](https://coil-kt.github.io/coil/upgrading/)了解如何升级。

- **新特性**：在 `coil-compose` 中引入 `AsyncImage`。有关更多信息，请查看[文档](https://coil-kt.github.io/coil/compose/)。

```kotlin
// 显示来自网络的图像。
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)

// 显示来自网络的图像，带有占位符、圆形裁剪和交叉淡入动画。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    contentDescription = stringResource(R.string.description),
    contentScale = ContentScale.Crop,
    modifier = Modifier.clip(CircleShape)
)
```

- **新特性**：引入公共 `DiskCache` API。
    - 使用 `ImageLoader.Builder.diskCache` 和 `DiskCache.Builder` 配置磁盘缓存。
    - 您不应在 Coil 2.0 中使用 OkHttp 的 `Cache`。有关更多信息，请参阅[此处](https://coil-kt.github.io/coil/upgrading_to_coil2/#disk-cache)。
    - `Cache-Control` 和其他缓存头仍然受支持——除了 `Vary` 头，因为缓存只检查 URL 是否匹配。此外，只有响应代码在 [200..300) 范围内的响应才会被缓存。
    - 升级到 2.0 时，现有磁盘缓存将被清除。
- 最低支持的 API 现在是 21。
- `ImageRequest` 的默认 `Scale` 现在是 `Scale.FIT`。
    - 这样做的目的是使 `ImageRequest.scale` 与其他具有默认 `Scale` 的类保持一致。
    - 带有 `ImageViewTarget` 的请求仍然会自动检测其 `Scale`。
- 重构图像管道类：
    - `Mapper`、`Fetcher` 和 `Decoder` 已被重构以更灵活。
    - `Fetcher.key` 已被新的 `Keyer` 接口取代。`Keyer` 从输入数据创建缓存键。
    - 添加 `ImageSource`，它允许 `Decoder` 使用 Okio 的文件系统 API 直接读取 `File`。
- 重构 Jetpack Compose 集成：
    - `rememberImagePainter` 和 `ImagePainter` 已分别重命名为 `rememberAsyncImagePainter` 和 `AsyncImagePainter`。
    - 弃用 `LocalImageLoader`。有关更多信息，请查看弃用消息。
- 禁用生成运行时非空断言。
    - 如果您使用 Java，将 null 作为非空注解参数传递给函数将不再立即抛出 `NullPointerException`。Kotlin 的编译时空安全机制可以防止这种情况发生。
    - 此更改允许库的大小更小。
- `Size` 现在由两个 `Dimension` 值组成，用于其宽度和高度。`Dimension` 可以是正像素值或 `Dimension.Undefined`。有关更多信息，请参阅[此处](https://coil-kt.github.io/coil/upgrading/#size-refactor)。
- `BitmapPool` 和 `PoolableViewTarget` 已从库中移除。
- `VideoFrameFileFetcher` 和 `VideoFrameUriFetcher` 已从库中移除。而是使用 `VideoFrameDecoder`，它支持所有数据源。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 和 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt) 已从库中移除。如果您使用它们，可以将它们的代码复制到您的项目中。
- 将 `Transition.transition` 更改为非挂起函数，因为它不再需要挂起过渡直到完成。
- 添加对 `bitmapFactoryMaxParallelism` 的支持，它限制了正在进行的 `BitmapFactory` 操作的最大数量。此值默认为 4，这提高了 UI 性能。
- 添加对 `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher` 和 `transformationDispatcher` 的支持。
- 添加 `GenericViewTarget`，它处理通用 `ViewTarget` 逻辑。
- 将 `ByteBuffer` 添加到默认支持的数据类型中。
- `Disposable` 已被重构并暴露底层 `ImageRequest` 的作业。
- 重构 `MemoryCache` API。
- 如果 `ImageRequest.fallback` 为 null，则 `ImageRequest.error` 现在会设置在 `Target` 上。
- `Transformation.key` 被 `Transformation.cacheKey` 取代。
- 更新 Kotlin 到 1.6.10。
- 更新 Compose 到 1.1.1。
- 更新 OkHttp 到 4.9.3。
- 更新 Okio 到 3.0.0。

自 `2.0.0-rc03` 以来的变更：
- 将 `Dimension.Original` 转换为 `Dimension.Undefined`。
    - 这稍微改变了非像素尺寸的语义，以修复尺寸系统中的一些边缘情况（[示例](https://github.com/coil-kt/coil/issues/1246)）。
- 如果 ContentScale 为 None，则使用 `Size.ORIGINAL` 加载图像。
- 修复了优先而不是最后应用 `ImageView.load` 构建器参数的问题。
- 修复了如果响应未修改，则不合并 HTTP 头的问题。

## [2.0.0-rc03] - 2022 年 4 月 11 日

- 移除 `ScaleResolver` 接口。
- 将 `Size` 构造函数转换为函数。
- 将 `Dimension.Pixels` 的 `toString` 更改为仅为其像素值。
- 防止 `SystemCallbacks.onTrimMemory` 中的罕见崩溃。
- 更新 Coroutines 到 1.6.1。

## [2.0.0-rc02] - 2022 年 3 月 20 日

- 恢复 `ImageRequest` 的默认尺寸为当前显示的大小，而不是 `Size.ORIGINAL`。
- 修复 `DiskCache.Builder` 被标记为实验性。仅 `DiskCache` 的方法是实验性的。
- 修复了将图像加载到 `ImageView` 中，其中一个维度为 `WRAP_CONTENT` 时，图像会以原始大小加载，而不是适应有界维度的情况。
- 移除 `MemoryCache.Key`、`MemoryCache.Value` 和 `Parameters.Entry` 的组件函数。

## [2.0.0-rc01] - 2022 年 3 月 2 日

自 `1.4.0` 以来的重大更改：

- 最低支持的 API 现在是 21。
- 重构 Jetpack Compose 集成。
    - `rememberImagePainter` 已重命名为 `rememberAsyncImagePainter`。
    - 添加了对 `AsyncImage` 和 `SubcomposeAsyncImage` 的支持。有关更多信息，请查看[文档](https://coil-kt.github.io/coil/compose/)。
    - 弃用 `LocalImageLoader`。有关更多信息，请查看弃用消息。
- Coil 2.0 拥有自己的磁盘缓存实现，不再依赖 OkHttp 进行磁盘缓存。
    - 使用 `ImageLoader.Builder.diskCache` 和 `DiskCache.Builder` 配置磁盘缓存。
    - 您**不应**在 Coil 2.0 中使用 OkHttp 的 `Cache`，因为如果线程在写入缓存时中断，缓存可能会损坏。
    - `Cache-Control` 和其他缓存头仍然受支持——除了 `Vary` 头，因为缓存只检查 URL 是否匹配。此外，只有响应代码在 [200..300) 范围内的响应才会被缓存。
    - 升级到 2.0 时，现有磁盘缓存将被清除。
- `ImageRequest` 的默认 `Scale` 现在是 `Scale.FIT`。
    - 这样做的目的是使 `ImageRequest.scale` 与其他具有默认 `Scale` 的类保持一致。
    - 带有 `ImageViewTarget` 的请求仍然会自动检测其 `Scale`。
- `ImageRequest` 的默认尺寸现在是 `Size.ORIGINAL`。
- 重构图像管道类：
    - `Mapper`、`Fetcher` 和 `Decoder` 已被重构以更灵活。
    - `Fetcher.key` 已被新的 `Keyer` 接口取代。`Keyer` 从输入数据创建缓存键。
    - 添加 `ImageSource`，它允许 `Decoder` 使用 Okio 的文件系统 API 直接读取 `File`。
- 禁用生成运行时非空断言。
    - 如果您使用 Java，将 null 作为非空注解参数传递给函数将不再立即抛出 `NullPointerException`。如果您使用 Kotlin，则基本没有变化。
    - 此更改允许库的大小更小。
- `Size` 现在由两个 `Dimension` 值组成，用于其宽度和高度。`Dimension` 可以是正像素值或 `Dimension.Original`。
- `BitmapPool` 和 `PoolableViewTarget` 已从库中移除。
- `VideoFrameFileFetcher` 和 `VideoFrameUriFetcher` 已从库中移除。而是使用 `VideoFrameDecoder`，它支持所有数据源。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 和 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt) 已从库中移除。如果您使用它们，可以将它们的代码复制到您的项目中。
- 将 `Transition.transition` 更改为非挂起函数，因为它不再需要挂起过渡直到完成。
- 添加对 `bitmapFactoryMaxParallelism` 的支持，它限制了正在进行的 `BitmapFactory` 操作的最大数量。此值默认为 4，这提高了 UI 性能。
- 添加对 `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher` 和 `transformationDispatcher` 的支持。
- 添加 `GenericViewTarget`，它处理通用 `ViewTarget` 逻辑。
- 将 `ByteBuffer` 添加到默认支持的数据类型中。
- `Disposable` 已被重构并暴露底层 `ImageRequest` 的作业。
- 重构 `MemoryCache` API。
- 如果 `ImageRequest.fallback` 为 null，则 `ImageRequest.error` 现在会设置在 `Target` 上。
- `Transformation.key` 被 `Transformation.cacheKey` 取代。
- 更新 Kotlin 到 1.6.10。
- 更新 Compose 到 1.1.1。
- 更新 OkHttp 到 4.9.3。
- 更新 Okio 到 3.0.0。

自 `2.0.0-alpha09` 以来的更改：

- 移除 `-Xjvm-default=all` 编译器标志。
- 修复了如果多个带有 must-revalidate/e-tag 的请求并发执行时，图像加载失败的问题。
- 修复了如果 `<svg` 标签后有换行符，`DecodeUtils.isSvg` 返回 false 的问题。
- 使 `LocalImageLoader.provides` 弃用消息更清晰。
- 更新 Compose 到 1.1.1。
- 更新 `accompanist-drawablepainter` 到 0.23.1。

## [2.0.0-alpha09] - 2022 年 2 月 16 日

- 修复 `AsyncImage` 创建无效约束。([#1134](https://github.com/coil-kt/coil/pull/1134))
- 为 `AsyncImagePainter` 添加 `ContentScale` 参数。([#1144](https://github.com/coil-kt/coil/pull/1144))
    - 这应该设置为与 `Image` 上设置的相同值，以确保图像以正确的大小加载。
- 添加 `ScaleResolver` 以支持延迟解析 `ImageRequest` 的 `Scale`。([#1134](https://github.com/coil-kt/coil/pull/1134))
    - `ImageRequest.scale` 应该被 `ImageRequest.scaleResolver.scale()` 替换。
- 更新 Compose 到 1.1.0。
- 更新 `accompanist-drawablepainter` 到 0.23.0。
- 更新 `androidx.lifecycle` 到 2.4.1。

## [2.0.0-alpha08] - 2022 年 2 月 7 日

- 更新 `DiskCache` 和 `ImageSource` 以使用 Okio 的 `FileSystem` API。([#1115](https://github.com/coil-kt/coil/pull/1115))

## [2.0.0-alpha07] - 2022 年 1 月 30 日

- 显著提高 `AsyncImage` 性能，并将 `AsyncImage` 分割为 `AsyncImage` 和 `SubcomposeAsyncImage`。([#1048](https://github.com/coil-kt/coil/pull/1048))
    - `SubcomposeAsyncImage` 提供 `loading`/`success`/`error`/`content` 插槽 API，并使用子组合，性能较差。
    - `AsyncImage` 提供 `placeholder`/`error`/`fallback` 参数以覆盖加载时或请求不成功时绘制的 `Painter`。`AsyncImage` 不使用子组合，性能比 `SubcomposeAsyncImage` 好得多。
    - 从 `SubcomposeAsyncImage.content` 中移除 `AsyncImagePainter.State` 参数。如果需要，请使用 `painter.state`。
    - 为 `AsyncImage` 和 `SubcomposeAsyncImage` 添加 `onLoading`/`onSuccess`/`onError` 回调。
- 弃用 `LocalImageLoader`。([#1101](https://github.com/coil-kt/coil/pull/1101))
- 添加对 `ImageRequest.tags` 的支持。([#1066](https://github.com/coil-kt/coil/pull/1066))
- 将 `DecodeUtils` 中的 `isGif`、`isWebP`、`isAnimatedWebP`、`isHeif` 和 `isAnimatedHeif` 移动到 coil-gif。将 `isSvg` 添加到 coil-svg。([#1117](https://github.com/coil-kt/coil/pull/1117))
- 将 `FetchResult` 和 `DecodeResult` 转换为非数据类。([#1114](https://github.com/coil-kt/coil/pull/1114))
- 移除未使用的 `DiskCache.Builder` context 参数。([#1099](https://github.com/coil-kt/coil/pull/1099))
- 修复原始大小位图资源的缩放问题。([#1072](https://github.com/coil-kt/coil/pull/1072))
- 修复 `ImageDecoderDecoder` 中 `ImageDecoder` 关闭失败的问题。([#1109](https://github.com/coil-kt/coil/pull/1109))
- 修复将 drawable 转换为位图时缩放不正确的问题。([#1084](https://github.com/coil-kt/coil/pull/1084))
- 更新 Compose 到 1.1.0-rc03。
- 更新 `accompanist-drawablepainter` 到 0.22.1-rc。
- 更新 `androidx.appcompat:appcompat-resources` 到 1.4.1。

## [2.0.0-alpha06] - 2021 年 12 月 24 日

- 添加 `ImageSource.Metadata` 以支持从资产、资源和内容 URI 解码，无需缓冲或临时文件。([#1060](https://github.com/coil-kt/coil/pull/1060))
- 延迟执行图像请求，直到 `AsyncImage` 具有正约束。([#1028](https://github.com/coil-kt/coil/pull/1028))
- 修复当 `loading`、`success` 和 `error` 都设置时，`AsyncImage` 使用 `DefaultContent` 的问题。([#1026](https://github.com/coil-kt/coil/pull/1026))
- 使用 androidx `LruCache` 而不是平台 `LruCache`。([#1047](https://github.com/coil-kt/coil/pull/1047))
- 更新 Kotlin 到 1.6.10。
- 更新 Coroutines 到 1.6.0。
- 更新 Compose 到 1.1.0-rc01。
- 更新 `accompanist-drawablepainter` 到 0.22.0-rc。
- 更新 `androidx.collection` 到 1.2.0。

## [2.0.0-alpha05] - 2021 年 11 月 28 日

- **重要**：重构 `Size` 以支持将图像的原始尺寸用于任一维度。
    - `Size` 现在由两个 `Dimension` 值组成，用于其宽度和高度。`Dimension` 可以是正像素值或 `Dimension.Original`。
    - 此更改旨在更好地支持当一个维度为固定像素值时，无界宽度/高度值（例如 `wrap_content`、`Constraints.Infinity`）。
- 修复：支持 `AsyncImage` 的检查模式（预览）。
- 修复：如果 `imageLoader.memoryCache` 为 null，则 `SuccessResult.memoryCacheKey` 应始终为 `null`。
- 将 `ImageLoader`、`SizeResolver` 和 `ViewSizeResolver` 构造函数式的 `invoke` 函数转换为顶层函数。
- 将 `CrossfadeDrawable` 的起始和结束 drawable 公开为 API。
- 修改 `ImageLoader` 的占位符/错误/回退 drawable。
- 为 `SuccessResult` 的构造函数添加默认参数。
- 依赖 `androidx.collection` 而不是 `androidx.collection-ktx`。
- 更新 OkHttp 到 4.9.3。

## [2.0.0-alpha04] - 2021 年 11 月 22 日

- **新特性**：将 `AsyncImage` 添加到 `coil-compose`。
    - `AsyncImage` 是一个可组合项，它异步执行 `ImageRequest` 并渲染结果。
    - **`AsyncImage` 旨在替代大多数用例中的 `rememberImagePainter`。**
    - 它的 API 尚未最终确定，在 2.0 最终发布之前可能会发生变化。
    - 它具有类似于 `Image` 的 API，并支持相同的参数：`Alignment`、`ContentScale`、`alpha`、`ColorFilter` 和 `FilterQuality`。
    - 它支持使用 `content`、`loading`、`success` 和 `error` 参数覆盖每个 `AsyncImagePainter` 状态绘制的内容。
    - 它修复了 `rememberImagePainter` 在解决图像大小和缩放方面存在的许多设计问题。
    - 示例用法：

```kotlin
// 只绘制图像。
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null, // 尽可能避免 `null`，并将其设置为本地化字符串。
)

// 绘制带有圆形裁剪、交叉淡入的图像，并覆盖 `loading` 状态。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    loading = {
        CircularProgressIndicator()
    },
    contentScale = ContentScale.Crop
)

// 绘制带有圆形裁剪、交叉淡入的图像，并覆盖所有状态。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    contentScale = ContentScale.Crop
) { state ->
    if (state is AsyncImagePainter.State.Loading) {
        CircularProgressIndicator()
    } else {
        AsyncImageContent() // 绘制图像。
    }
}
```

- **重要**：将 `ImagePainter` 重命名为 `AsyncImagePainter`，将 `rememberImagePainter` 重命名为 `rememberAsyncImagePainter`。
    - `ExecuteCallback` 不再受支持。要使 `AsyncImagePainter` 跳过等待 `onDraw` 被调用，请设置 `ImageRequest.size(OriginalSize)`（或任何大小）。
    - 为 `rememberAsyncImagePainter` 添加一个可选的 `FilterQuality` 参数。
- 使用协程进行 `DiskCache` 中的清理操作，并添加 `DiskCache.Builder.cleanupDispatcher`。
- 修复了使用 `ImageLoader.Builder.placeholder` 设置的占位符的 Compose 预览。
- 使用 `@ReadOnlyComposable` 标记 `LocalImageLoader.current` 以生成更高效的代码。
- 更新 Compose 到 1.1.0-beta03 并依赖 `compose.foundation` 而不是 `compose.ui`。
- 更新 `androidx.appcompat-resources` 到 1.4.0。

## [2.0.0-alpha03] - 2021 年 11 月 12 日

- 添加在 Android 29+ 上加载音乐缩略图的能力。([#967](https://github.com/coil-kt/coil/pull/967))
- 修复：使用 `context.resources` 为当前包加载资源。([#968](https://github.com/coil-kt/coil/pull/968))
- 修复：`clear` -> `dispose` 替换表达式。([#970](https://github.com/coil-kt/coil/pull/970))
- 更新 Compose 到 1.0.5。
- 更新 `accompanist-drawablepainter` 到 0.20.2。
- 更新 Okio 到 3.0.0。
- 更新 `androidx.annotation` 到 1.3.0。
- 更新 `androidx.core` 到 1.7.0。
- 更新 `androidx.lifecycle` 到 2.4.0。
    - 移除对 `lifecycle-common-java8` 的依赖，因为它已合并到 `lifecycle-common` 中。

## [2.0.0-alpha02] - 2021 年 10 月 24 日

- 添加一个新的 `coil-bom` 工件，其中包括一个[材料清单](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)。
    - 导入 `coil-bom` 允许您依赖其他 Coil 工件而无需指定版本。
- 修复使用 `ExecuteCallback.Immediate` 时图像加载失败的问题。
- 更新 Okio 到 3.0.0-alpha.11。
    - 这也解决了与 Okio 3.0.0-alpha.11 的兼容性问题。
- 更新 Kotlin 到 1.5.31。
- 更新 Compose 到 1.0.4。

## [2.0.0-alpha01] - 2021 年 10 月 11 日

Coil 2.0.0 是该库的下一个主要迭代，具有新特性、性能改进、API 改进和各种错误修复。在 2.0.0 稳定发布之前，此版本可能与未来的 alpha 版本存在二进制/源代码不兼容。

- **重要**：最低支持的 API 现在是 21。
- **重要**：启用 `-Xjvm-default=all`。
    - 这将生成 Java 8 默认方法，而不是使用 Kotlin 的默认接口方法支持。有关更多信息，请查看[这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。
    - **您还需要在构建文件中添加 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility`。**有关如何操作的信息，请参阅[此处](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8)。
- **重要**：Coil 现在拥有自己的磁盘缓存实现，不再依赖 OkHttp 进行磁盘缓存。
    - 此更改旨在：
        - 更好地支持解码图像时的线程中断。当图像请求快速启动和停止时，这可以提高性能。
        - 支持暴露以 `File` 为后备的 `ImageSource`。当 Android API 需要 `File` 来解码时（例如 `MediaMetadataRetriever`），这可以避免不必要的复制。
        - 支持直接从/向磁盘缓存文件读取/写入。
    - 使用 `ImageLoader.Builder.diskCache` 和 `DiskCache.Builder` 配置磁盘缓存。
    - 您**不应**在 Coil 2.0 中使用 OkHttp 的 `Cache`，因为它在写入时如果中断可能会损坏。
    - `Cache-Control` 和其他缓存头仍然受支持——除了 `Vary` 头，因为缓存只检查 URL 是否匹配。此外，只有响应代码在 [200..300) 范围内的响应才会被缓存。
    - 可以使用 `ImageLoader.Builder.respectCacheHeaders` 启用或禁用对缓存头的支持。
    - 升级到 2.0 时，您现有的磁盘缓存将被清除并重建。
- **重要**：`ImageRequest` 的默认 `Scale` 现在是 `Scale.FIT`。
    - 这样做的目的是使 `ImageRequest.scale` 与其他具有默认 `Scale` 的类保持一致。
    - 带有 `ImageViewTarget` 的请求仍然会自动检测其缩放。
- 图像管道类发生重大更改：
    - `Mapper`、`Fetcher` 和 `Decoder` 已被重构以更灵活。
    - `Fetcher.key` 已被新的 `Keyer` 接口取代。`Keyer` 从输入数据创建缓存键。
    - 添加 `ImageSource`，它允许 `Decoder` 直接解码 `File`。
- `BitmapPool` 和 `PoolableViewTarget` 已从库中移除。位图池已被移除，因为：
    - 它在 API 23 及以下最有效，但随着更新的 Android 版本效果降低。
    - 移除位图池允许 Coil 使用不可变位图，这具有性能优势。
    - 管理位图池存在运行时开销。
    - 位图池对 Coil 的 API 造成设计限制，因为它需要跟踪位图是否符合池化条件。移除位图池允许 Coil 在更多地方（例如 `Listener`、`Disposable`）暴露结果 `Drawable`。此外，这意味着 Coil 不必清除 `ImageView`，这可能会导致[问题](https://github.com/coil-kt/coil/issues/650)。
    - 位图池容易出错。分配新的位图比尝试重用可能仍在使用的位图安全得多。
- `MemoryCache` 已被重构以更灵活。
- 禁用生成运行时非空断言。
    - 如果您使用 Java，将 null 作为非空注解参数传递给函数将不再立即抛出 `NullPointerException`。如果您使用 Kotlin，则基本没有变化。
    - 此更改允许库的大小更小。
- `VideoFrameFileFetcher` 和 `VideoFrameUriFetcher` 已从库中移除。而是使用 `VideoFrameDecoder`，它支持所有数据源。
- 添加对 `bitmapFactoryMaxParallelism` 的支持，它限制了正在进行的 `BitmapFactory` 操作的最大数量。此值默认为 4，这提高了 UI 性能。
- 添加对 `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher` 和 `transformationDispatcher` 的支持。
- `Disposable` 已被重构并暴露底层 `ImageRequest` 的作业。
- 将 `Transition.transition` 更改为非挂起函数，因为它不再需要挂起过渡直到完成。
- 添加 `GenericViewTarget`，它处理通用 `ViewTarget` 逻辑。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt) 和 [`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt) 已从库中移除。
    - 如果您使用它们，可以将它们的代码复制到您的项目中。
- 如果 `ImageRequest.fallback` 为 null，则 `ImageRequest.error` 现在会设置在 `Target` 上。
- `Transformation.key` 被 `Transformation.cacheKey` 取代。
- `ImageRequest.Listener` 在 `onSuccess` 和 `onError` 中分别返回 `SuccessResult`/`ErrorResult`。
- 将 `ByteBuffer` 添加到默认支持的数据类型中。
- 移除多个类的 `toString` 实现。
- 更新 OkHttp 到 4.9.2。
- 更新 Okio 到 3.0.0-alpha.10。

## [1.4.0] - 2021 年 10 月 6 日

- **新特性**：将 `ImageResult` 添加到 `ImagePainter.State.Success` 和 `ImagePainter.State.Error`。([#887](https://github.com/coil-kt/coil/pull/887))
    - 这是对 `ImagePainter.State.Success` 和 `ImagePainter.State.Error` 签名的二进制不兼容更改，但这些 API 被标记为实验性。
- 仅当 `View.isShown` 为 `true` 时才执行 `CrossfadeTransition`。以前它只检查 `View.isVisible`。([#898](https://github.com/coil-kt/coil/pull/898))
- 修复了如果缩放乘数由于舍入问题略小于 1，可能导致内存缓存未命中。([#899](https://github.com/coil-kt/coil/pull/899))
- 将非内联 `ComponentRegistry` 方法公开。([#925](https://github.com/coil-kt/coil/pull/925))
- 依赖 `accompanist-drawablepainter` 并移除 Coil 的自定义 `DrawablePainter` 实现。([#845](https://github.com/coil-kt/coil/pull/845))
- 移除使用 Java 8 方法以防止脱糖问题。([#924](https://github.com/coil-kt/coil/pull/924))
- 将 `ImagePainter.ExecuteCallback` 提升为稳定 API。([#927](https://github.com/coil-kt/coil/pull/927))
- 更新 compileSdk 到 31。
- 更新 Kotlin 到 1.5.30。
- 更新 Coroutines 到 1.5.2。
- 更新 Compose 到 1.0.3。

## [1.3.2] - 2021 年 8 月 4 日

- `coil-compose` 现在依赖 `compose.ui` 而不是 `compose.foundation`。
    - `compose.ui` 是一个更小的依赖，因为它是 `compose.foundation` 的子集。
- 更新 Jetpack Compose 到 1.0.1。
- 更新 Kotlin 到 1.5.21。
- 更新 Coroutines 到 1.5.1。
- 更新 `androidx.exifinterface:exifinterface` 到 1.3.3。

## [1.3.1] - 2021 年 7 月 28 日

- 更新 Jetpack Compose 到 `1.0.0`。热烈祝贺 Compose 团队[稳定发布](https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html)！
- 更新 `androidx.appcompat:appcompat-resources` 到 1.3.1。

## [1.3.0] - 2021 年 7 月 10 日

- **新特性**：添加对 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的支持。它基于 [Accompanist](https://github.com/google/accompanist/) 的 Coil 集成，但有一些更改。有关更多信息，请查看[文档](https://coil-kt.github.io/coil/compose/)。
- 添加 `allowConversionToBitmap` 以启用/禁用 `Transformation` 的自动位图转换。([#775](https://github.com/coil-kt/coil/pull/775))
- 添加 `enforceMinimumFrameDelay` 到 `ImageDecoderDecoder` 和 `GifDecoder`，以支持如果 GIF 的帧延迟低于某个阈值，则重写它。([#783](https://github.com/coil-kt/coil/pull/783))
    - 此功能默认禁用，但将在未来版本中默认启用。
- 添加支持启用/禁用 `ImageLoader` 的内部网络观察器。([#741](https://github.com/coil-kt/coil/pull/741))
- 修复 `BitmapFactoryDecoder` 解码位图的密度。([#776](https://github.com/coil-kt/coil/pull/776))
- 修复 Licensee 找不到 Coil 的许可证 URL。([#774](https://github.com/coil-kt/coil/pull/774))
- 更新 `androidx.core:core-ktx` 到 1.6.0。

## [1.2.2] - 2021 年 6 月 4 日

- 修复了将具有共享状态的 drawable 转换为位图时的竞态条件。([#771](https://github.com/coil-kt/coil/pull/771))
- 修复了 `ImageLoader.Builder.fallback` 设置 `error` drawable 而不是 `fallback` drawable 的问题。
- 修复了 `ResourceUriFetcher` 返回不正确数据源的问题。([#770](https://github.com/coil-kt/coil/pull/770))
- 修复了 API 26 和 27 上没有可用文件描述符的日志检查。
- 修复了平台矢量 drawable 支持的版本检查不正确的问题。([#751](https://github.com/coil-kt/coil/pull/751))
- 更新 Kotlin (1.5.10)。
- 更新 Coroutines (1.5.0)。
- 更新 `androidx.appcompat:appcompat-resources` 到 1.3.0。
- 更新 `androidx.core:core-ktx` 到 1.5.0。

## [1.2.1] - 2021 年 4 月 27 日

- 修复：`VideoFrameUriFetcher` 尝试处理 http/https URI。([#734](https://github.com/coil-kt/coil/pull/734))

## [1.2.0] - 2021 年 4 月 12 日

- **重要**：在 `SvgDecoder` 中使用 SVG 的视图边界来计算其宽高比。([#688](https://github.com/coil-kt/coil/pull/688))
    - 以前，`SvgDecoder` 使用 SVG 的 `width`/`height` 元素来确定其宽高比，但这不正确遵循 SVG 规范。
    - 要恢复旧行为，请在构建 `SvgDecoder` 时设置 `useViewBoundsAsIntrinsicSize = false`。
- **新特性**：添加 `VideoFrameDecoder` 以支持从任何源解码视频帧。([#689](https://github.com/coil-kt/coil/pull/689))
- **新特性**：支持使用源内容而不是仅 MIME 类型自动检测 SVG。([#654](https://github.com/coil-kt/coil/pull/654))
- **新特性**：支持使用 `ImageLoader.newBuilder()` 共享资源。([#653](https://github.com/coil-kt/coil/pull/653))
    - 重要的是，这使得 `ImageLoader` 实例之间可以共享内存缓存。
- **新特性**：添加对使用 `AnimatedTransformation` 的动画图像转换的支持。([#659](https://github.com/coil-kt/coil/pull/659))
- **新特性**：添加对动画 drawable 的开始/结束回调的支持。([#676](https://github.com/coil-kt/coil/pull/676))

---

- 修复：解析 HEIF/HEIC 文件的 EXIF 数据。([#664](https://github.com/coil-kt/coil/pull/664))
- 修复：当位图池禁用时未使用 `EmptyBitmapPool` 实现的问题。([#638](https://github.com/coil-kt/coil/pull/638))
    - 如果没有此修复，位图池仍然正确禁用，但它使用了更重量级的 `BitmapPool` 实现。
- 修复了 `MovieDrawable.getOpacity` 错误返回透明的情况。([#682](https://github.com/coil-kt/coil/pull/682))
- 防止默认临时目录不存在。([#683](https://github.com/coil-kt/coil/pull/683))

---

- 使用 JVM IR 后端构建。([#670](https://github.com/coil-kt/coil/pull/670))
- 更新 Kotlin (1.4.32)。
- 更新 Coroutines (1.4.3)。
- 更新 OkHttp (3.12.13)。
- 更新 `androidx.lifecycle:lifecycle-common-java8` 到 2.3.1。

## [1.1.1] - 2021 年 1 月 11 日

- 修复了 `ViewSizeResolver.size` 可能由于协程多次恢复而抛出 `IllegalStateException` 的情况。
- 修复了 `HttpFetcher` 从主线程调用时永远阻塞的问题。
    - 使用 `ImageRequest.dispatcher(Dispatchers.Main.immediate)` 强制在主线程执行的请求将失败并抛出 `NetworkOnMainThreadException`，除非 `ImageRequest.networkCachePolicy` 设置为 `CachePolicy.DISABLED` 或 `CachePolicy.WRITE_ONLY`。
- 如果视频具有旋转元数据，则旋转 `VideoFrameFetcher` 中的视频帧。
- 更新 Kotlin (1.4.21)。
- 更新 Coroutines (1.4.2)。
- 更新 Okio (2.10.0)。
- 更新 `androidx.exifinterface:exifinterface` (1.3.2)。

## [1.1.0] - 2020 年 11 月 24 日

- **重要**：更改 `CENTER` 和 `MATRIX` `ImageView` 缩放类型以解析为 `OriginalSize`。([#587](https://github.com/coil-kt/coil/pull/587))
    - 此更改仅影响请求的尺寸未明确指定时的隐式尺寸解析算法。
    - 此更改旨在确保图像请求的视觉结果与 `ImageView.setImageResource`/`ImageView.setImageURI` 保持一致。要恢复旧行为，请在构建请求时设置 `ViewSizeResolver`。
- **重要**：如果视图的布局参数为 `WRAP_CONTENT`，则从 `ViewSizeResolver` 返回显示大小。([#562](https://github.com/coil-kt/coil/pull/562))
    - 以前，只有当视图完全布局后才会返回显示大小。此更改使典型行为更一致和直观。
- 添加控制 alpha 预乘的能力。([#569](https://github.com/coil-kt/coil/pull/569))
- 支持 `CrossfadeDrawable` 中优先使用精确固有尺寸。([#585](https://github.com/coil-kt/coil/pull/585))
- 检查完整的 GIF 头，包括版本。([#564](https://github.com/coil-kt/coil/pull/564))
- 添加空的位图池实现。([#561](https://github.com/coil-kt/coil/pull/561))
- 将 `EventListener.Factory` 设为函数式接口。([#575](https://github.com/coil-kt/coil/pull/575))
- 稳定 `EventListener`。([#574](https://github.com/coil-kt/coil/pull/574))
- 为 `ImageRequest.Builder.placeholderMemoryCacheKey` 添加 `String` 重载。
- 为 `ViewSizeResolver` 构造函数添加 `@JvmOverloads`。
- 修复：修改 `CrossfadeDrawable` 中的起始/结束 drawable。([#572](https://github.com/coil-kt/coil/pull/572))
- 修复：修复 GIF 第二次加载时不播放的问题。([#577](https://github.com/coil-kt/coil/pull/534))
- 更新 Kotlin (1.4.20) 并迁移到 `kotlin-parcelize` 插件。
- 更新 Coroutines (1.4.1)。

## [1.0.0] - 2020 年 10 月 22 日

自 `0.13.0` 以来的更改：
- 添加 `Context.imageLoader` 扩展函数。([#534](https://github.com/coil-kt/coil/pull/534))
- 添加 `ImageLoader.executeBlocking` 扩展函数。([#537](https://github.com/coil-kt/coil/pull/537))
- 如果替换了之前的单例图像加载器，则不关闭。([#533](https://github.com/coil-kt/coil/pull/533))

自 `1.0.0-rc3` 以来的更改：
- 修复：防止缺少/无效的 ActivityManager。([#541](https://github.com/coil-kt/coil/pull/541))
- 修复：允许 OkHttp 缓存不成功的响应。([#551](https://github.com/coil-kt/coil/pull/551))
- 更新 Kotlin 到 1.4.10。
- 更新 Okio 到 2.9.0。
- 更新 `androidx.exifinterface:exifinterface` 到 1.3.1。

## [1.0.0-rc3] - 2020 年 9 月 21 日

- 由于不稳定，恢复使用 [`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 编译器标志。
    - **这是与之前发布候选版本源代码兼容但二进制不兼容的更改。**
- 添加 `Context.imageLoader` 扩展函数。([#534](https://github.com/coil-kt/coil/pull/534))
- 添加 `ImageLoader.executeBlocking` 扩展函数。([#537](https://github.com/coil-kt/coil/pull/537))
- 如果替换了之前的单例图像加载器，则不关闭。([#533](https://github.com/coil-kt/coil/pull/533))
- 更新 AndroidX 依赖项：
    - `androidx.exifinterface:exifinterface` -> 1.3.0

## [1.0.0-rc2] - 2020 年 9 月 3 日

- **此版本需要 Kotlin 1.4.0 或更高版本。**
- [0.13.0](#0130---september-3-2020) 中包含的所有更改。
- 依赖基本 Kotlin `stdlib` 而不是 `stdlib-jdk8`。

## [0.13.0] - 2020 年 9 月 3 日

- **破坏性变更**：`Interceptor` 链默认在主线程上启动。([#513](https://github.com/coil-kt/coil/pull/513))
    - 这基本恢复了 `0.11.0` 及以下版本的行为，即内存缓存会在主线程上同步检查。
    - 要恢复使用 `0.12.0` 的行为（内存缓存在 `ImageRequest.dispatcher` 上检查），请设置 `ImageLoader.Builder.launchInterceptorChainOnMainThread(false)`。
    - 有关更多信息，请参阅[`launchInterceptorChainOnMainThread`](https://coil-kt.github.io/coil/api/coil-core/coil3/-image-loader/-builder/launch-interceptor-chain-on-main-thread/)。

---

- 修复：修复了当请求在分离的片段中的 `ViewTarget` 上启动时可能出现的内存泄漏。([#518](https://github.com/coil-kt/coil/pull/518))
- 修复：使用 `ImageRequest.context` 加载资源 URI。([#517](https://github.com/coil-kt/coil/pull/517))
- 修复：修复了可能导致后续请求未保存到磁盘缓存的竞态条件。([#510](https://github.com/coil-kt/coil/pull/510))
- 修复：在 API 18 上使用 `blockCountLong` 和 `blockSizeLong`。

---

- 将 `ImageLoaderFactory` 设为函数式接口。
- 添加 `ImageLoader.Builder.addLastModifiedToFileCacheKey`，允许您启用/禁用将最后修改时间戳添加到从 `File` 加载的图像的内存缓存键。

---

- 更新 Kotlin 到 1.4.0。
- 更新 Coroutines 到 1.3.9。
- 更新 Okio 到 2.8.0。

## [1.0.0-rc1] - 2020 年 8 月 18 日

- **此版本需要 Kotlin 1.4.0 或更高版本。**
- 更新 Kotlin 到 1.4.0 并启用 [`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。
    - **有关如何在构建文件中启用 `-Xjvm-default=all`，请参阅[此处](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8)。**
    - 这为默认 Kotlin 接口方法生成 Java 8 默认方法。
- 移除 0.12.0 中所有现有的已弃用方法。
- 更新 Coroutines 到 1.3.9。

## [0.12.0] - 2020 年 8 月 18 日

- **破坏性变更**：`LoadRequest` 和 `GetRequest` 已被 `ImageRequest` 替换：
    - `ImageLoader.execute(LoadRequest)` -> `ImageLoader.enqueue(ImageRequest)`
    - `ImageLoader.execute(GetRequest)` -> `ImageLoader.execute(ImageRequest)`
    - `ImageRequest` 实现 `equals`/`hashCode`。
- **破坏性变更**：许多类已重命名和/或更改包：
    - `coil.request.RequestResult` -> `coil.request.ImageResult`
    - `coil.request.RequestDisposable` -> `coil.request.Disposable`
    - `coil.bitmappool.BitmapPool` -> `coil.bitmap.BitmapPool`
    - `coil.DefaultRequestOptions` -> `coil.request.DefaultRequestOptions`
- **破坏性变更**：[`SparseIntArraySet`](https://github.com/coil-kt/coil/blob/f52addd039f0195b66f93cb0f1cad59b0832f784/coil-core/src/main/java/coil/collection/SparseIntArraySet.kt) 已从公共 API 中移除。
- **破坏性变更**：`TransitionTarget` 不再实现 `ViewTarget`。
- **破坏性变更**：`ImageRequest.Listener.onSuccess` 的签名已更改为返回 `ImageResult.Metadata` 而不是仅 `DataSource`。
- **破坏性变更**：移除对 `LoadRequest.aliasKeys` 的支持。此 API 通过直接读写内存缓存更好地处理。

---

- **重要**：内存缓存中的值不再同步解析（如果从主线程调用）。
    - 此更改对于支持在后台调度器上执行 `Interceptor` 也是必要的。
    - 此更改还将更多工作从主线程转移，提高了性能。
- **重要**：`Mapper` 现在在后台调度器上执行。副作用是，自动位图采样不再**自动**支持。要实现相同效果，请将前一个请求的 `MemoryCache.Key` 用作后续请求的 `placeholderMemoryCacheKey`。**[有关示例，请参阅此处](https://coil-kt.github.io/coil/recipes/#using-a-memory-cache-key-as-a-placeholder)。**
    - `placeholderMemoryCacheKey` API 提供了更多自由，因为您可以将两个具有不同数据（例如，用于小/大图像的不同 URL）的图像请求“链接”起来。
- **重要**：Coil 的 `ImageView` 扩展函数已从 `coil.api` 包移动到 `coil` 包。
    - 使用查找 + 替换重构 `import coil.api.load` -> `import coil.load`。不幸的是，无法使用 Kotlin 的 `ReplaceWith` 功能替换导入。
- **重要**：如果 drawable 不是同一图像，则使用标准交叉淡入。
- **重要**：在 API 24+ 上优先使用不可变位图。
- **重要**：`MeasuredMapper` 已被弃用，取而代之的是新的 `Interceptor` 接口。**[有关如何将 `MeasuredMapper` 转换为 `Interceptor` 的示例，请参阅此处](https://gist.github.com/colinrtwhite/90267704091467451e46b21b95154299)。**
    - `Interceptor` 是一个限制少得多的 API，允许实现更广泛的自定义逻辑。
- **重要**：`ImageRequest.data` 现在不为 null。如果您创建 `ImageRequest` 而不设置其数据，它将返回 `NullRequestData` 作为其数据。

---

- **新特性**：添加对 `ImageLoader` 的 `MemoryCache` 的直接读写访问。有关更多信息，请参阅[文档](https://coil-kt.github.io/coil/getting_started/#memory-cache)。
- **新特性**：添加对 `Interceptor` 的支持。有关更多信息，请参阅[文档](https://coil-kt.github.io/coil/image_pipeline/#interceptors)。Coil 的 `Interceptor` 设计深受 [OkHttp](https://github.com/square/okhttp) 的启发！
- **新特性**：添加使用 `ImageLoader.Builder.bitmapPoolingEnabled` 启用/禁用位图池的能力。
    - 位图池在 API 23 及以下最有效，但可能在 API 24 及以上仍有益（通过急切调用 `Bitmap.recycle`）。
- **新特性**：支持解码时的线程中断。

---

- 修复：解析内容类型头中的多个段。
- 重构位图引用计数以更健壮。
- 修复在 API < 19 设备上解码 WebP。
- 在 EventListener API 中暴露 FetchResult 和 DecodeResult。

---

- 使用 SDK 30 编译。
- 更新 Coroutines 到 1.3.8。
- 更新 OkHttp 到 3.12.12。
- 更新 Okio 到 2.7.0。
- 更新 AndroidX 依赖项：
    - `androidx.appcompat:appcompat-resources` -> 1.2.0
    - `androidx.core:core-ktx` -> 1.3.1

## [0.11.0] - 2020 年 5 月 14 日

- **破坏性变更**：**此版本移除了所有现有的已弃用函数。**
    - 这使得可以移除 Coil 的 `ContentProvider`，因此它在应用程序启动时不会运行任何代码。
- **破坏性变更**：将 `SparseIntArraySet.size` 转换为 val。([#380](https://github.com/coil-kt/coil/pull/380))
- **破坏性变更**：将 `Parameters.count()` 移动到扩展函数。([#403](https://github.com/coil-kt/coil/pull/403))
- **破坏性变更**：将 `BitmapPool.maxSize` 设为 Int。([#404](https://github.com/coil-kt/coil/pull/404))

---

- **重要**：使 `ImageLoader.shutdown()` 可选（类似于 `OkHttpClient`）。([#385](https://github.com/coil-kt/coil/pull/385))

---

- 修复：修复 AGP 4.1 兼容性。([#386](https://github.com/coil-kt/coil/pull/386))
- 修复：修复测量 `GONE` 视图。([#397](https://github.com/coil-kt/coil/pull/397))

---

- 将默认内存缓存大小减少到 20%。([#390](https://github.com/coil-kt/coil/pull/390))
    - 要恢复现有行为，请在创建 `ImageLoader` 时设置 `ImageLoaderBuilder.availableMemoryPercentage(0.25)`。
- 更新 Coroutines 到 1.3.6。
- 更新 OkHttp 到 3.12.11。

## [0.10.1] - 2020 年 4 月 26 日

- 修复：在 API 23 及以下解码大型 PNG 时出现 OOM。([#372](https://github.com/coil-kt/coil/pull/372))。
    - 这将禁用 PNG 文件的 EXIF 方向解码。PNG EXIF 方向很少使用，并且读取 PNG EXIF 数据（即使为空）需要将整个文件缓冲到内存中，这不利于性能。
- 对 `SparseIntArraySet` 的少量 Java 兼容性改进。

---

- 更新 Okio 到 2.6.0。

## [0.10.0] - 2020 年 4 月 20 日

### 亮点

- **此版本弃用了大部分 DSL API，转而直接使用构建器。**更改如下：

    ```kotlin
    // 0.9.5 (旧)
    val imageLoader = ImageLoader(context) {
        bitmapPoolPercentage(0.5)
        crossfade(true)
    }

    val disposable = imageLoader.load(context, "https://example.com/image.jpg") {
        target(imageView)
    }

    val drawable = imageLoader.get("https://example.com/image.jpg") {
        size(512, 512)
    }

    // 0.10.0 (新)
    val imageLoader = ImageLoader.Builder(context)
        .bitmapPoolPercentage(0.5)
        .crossfade(true)
        .build()

    val request = LoadRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .target(imageView)
        .build()
    val disposable = imageLoader.execute(request)

    val request = GetRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .size(512, 512)
        .build()
    val drawable = imageLoader.execute(request).drawable
    ```

    - 如果您使用 `io.coil-kt:coil` 工件，您可以调用 `Coil.execute(request)` 使用单例 `ImageLoader` 执行请求。

- **`ImageLoader` 现在具有弱引用内存缓存**，该缓存跟踪图像从强引用内存缓存中逐出后对其的弱引用。
    - 这意味着如果图像仍有强引用，它将始终从 `ImageLoader` 的内存缓存中返回。
    - 通常，这应该使内存缓存更具可预测性并提高其命中率。
    - 此行为可以使用 `ImageLoaderBuilder.trackWeakReferences` 启用/禁用。

- 添加了一个新工件 `**io.coil-kt:coil-video**`，用于解码视频文件中的特定帧。**[在此处阅读更多信息](https://coil-kt.github.io/coil/videos/)。**

- 添加了一个新的 [EventListener](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt) API，用于跟踪指标。

- 添加 [ImageLoaderFactory](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)，您的 `Application` 可以实现它以简化单例初始化。

---

### 完整发布说明

- **重要**：弃用 DSL 语法，转而使用构建器语法。([#267](https://github.com/coil-kt/coil/pull/267))
- **重要**：弃用 `Coil` 和 `ImageLoader` 扩展函数。([#322](https://github.com/coil-kt/coil/pull/322))
- **破坏性变更**：从 `ImageLoader.execute(GetRequest)` 返回密封的 `RequestResult` 类型。([#349](https://github.com/coil-kt/coil/pull/349))
- **破坏性变更**：将 `ExperimentalCoil` 重命名为 `ExperimentalCoilApi`。从 `@Experimental` 迁移到 `@RequiresOptIn`。([#306](https://github.com/coil-kt/coil/pull/306))
- **破坏性变更**：将 `CoilLogger` 替换为 `Logger` 接口。([#316](https://github.com/coil-kt/coil/pull/316))
- **破坏性变更**：将 `destWidth`/`destHeight` 重命名为 `dstWidth`/`dstHeight`。([#275](https://github.com/coil-kt/coil/pull/275))
- **破坏性变更**：重新排列 `MovieDrawable` 的构造函数参数。([#272](https://github.com/coil-kt/coil/pull/272))
- **破坏性变更**：`Request.Listener` 的方法现在接收完整的 `Request` 对象，而不仅仅是其数据。
- **破坏性变更**：`GetRequestBuilder` 现在在其构造函数中需要 `Context`。
- **破坏性变更**：`Request` 上的几个属性现在可为空。
- **行为变更**：默认情况下将参数值包含在缓存键中。([#319](https://github.com/coil-kt/coil/pull/319))
- **行为变更**：稍微调整 `Request.Listener.onStart()` 的时机，使其在 `Target.onStart()` 之后立即调用。([#348](https://github.com/coil-kt/coil/pull/348))

---

- **新特性**：添加 `WeakMemoryCache` 实现。([#295](https://github.com/coil-kt/coil/pull/295))
- **新特性**：添加 `coil-video` 以支持解码视频帧。([#122](https://github.com/coil-kt/coil/pull/122))
- **新特性**：引入 [`EventListener`](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt)。([#314](https://github.com/coil-kt/coil/pull/314))
- **新特性**：引入 [`ImageLoaderFactory`](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)。([#311](https://github.com/coil-kt/coil/pull/311))
- **新特性**：支持 Android 11 上的动画 HEIF 图像序列。([#297](https://github.com/coil-kt/coil/pull/297))
- **新特性**：改进 Java 兼容性。([#262](https://github.com/coil-kt/coil/pull/262))
- **新特性**：支持设置默认 `CachePolicy`。([#307](https://github.com/coil-kt/coil/pull/307))
- **新特性**：支持设置默认 `Bitmap.Config`。([#342](https://github.com/coil-kt/coil/pull/342))
- **新特性**：添加 `ImageLoader.invalidate(key)` 以清除单个内存缓存项。([#55](https://github.com/coil-kt/coil/pull/55))
- **新特性**：添加调试日志以解释为什么不重用缓存图像。([#346](https://github.com/coil-kt/coil/pull/346))
- **新特性**：支持 get 请求的 `error` 和 `fallback` drawable。

---

- 修复：修复了当 `Transformation` 减小输入位图大小时内存缓存未命中。([#357](https://github.com/coil-kt/coil/pull/357))
- 修复：确保 `BlurTransformation` 中的半径低于 RenderScript 最大值。([#291](https://github.com/coil-kt/coil/pull/291))
- 修复：修复解码高色深图像。([#358](https://github.com/coil-kt/coil/pull/358))
- 修复：禁用 Android 11 及以上版本上的 `ImageDecoderDecoder` 崩溃解决方法。([#298](https://github.com/coil-kt/coil/pull/298))
- 修复：修复无法读取 API 23 之前 EXIF 数据的问题。([#331](https://github.com/coil-kt/coil/pull/331))
- 修复：修复与 Android R SDK 的不兼容性。([#337](https://github.com/coil-kt/coil/pull/337))
- 修复：仅当 `ImageView` 具有匹配的 `SizeResolver` 时才启用不精确大小。([#344](https://github.com/coil-kt/coil/pull/344))
- 修复：允许缓存图像与请求大小最多相差一个像素。([#360](https://github.com/coil-kt/coil/pull/360))
- 修复：如果视图不可见，则跳过交叉淡入过渡。([#361](https://github.com/coil-kt/coil/pull/361))

---

- 弃用 `CoilContentProvider`。([#293](https://github.com/coil-kt/coil/pull/293))
- 使用 `@MainThread` 注解多个 `ImageLoader` 方法。
- 如果生命周期当前已启动，则避免创建 `LifecycleCoroutineDispatcher`。([#356](https://github.com/coil-kt/coil/pull/356))
- `OriginalSize.toString()` 使用完整包名。
- 解码软件位图时预分配。([#354](https://github.com/coil-kt/coil/pull/354))

---

- 更新 Kotlin 到 1.3.72。
- 更新 Coroutines 到 1.3.5。
- 更新 OkHttp 到 3.12.10。
- 更新 Okio 到 2.5.0。
- 更新 AndroidX 依赖项：
    - `androidx.exifinterface:exifinterface` -> 1.2.0

## [0.9.5] - 2020 年 2 月 6 日

- 修复：确保视图在检查是否硬件加速之前已附加。这修复了请求硬件位图可能导致内存缓存未命中的情况。

---

- 更新 AndroidX 依赖项：
    - `androidx.core:core-ktx` -> 1.2.0

## [0.9.4] - 2020 年 2 月 3 日

- 修复：在 ImageDecoderDecoder 中下采样时遵守宽高比。感谢 @zhanghai。

---

- 以前，只要位图的配置大于或等于请求中指定的配置，位图就会从内存缓存中返回。例如，如果您请求 `ARGB_8888` 位图，可能会从内存缓存中返回 `RGBA_F16` 位图。现在，缓存配置和请求配置必须相等。
- 将 `CrossfadeDrawable` 和 `CrossfadeTransition` 中的 `scale` 和 `durationMillis` 公开。

## [0.9.3] - 2020 年 2 月 1 日

- 修复：在 `ScaleDrawable` 内部平移子 drawable 以确保其居中。
- 修复：修复 GIF 和 SVG 不完全填充边界的情况。

---

- 将 `HttpUrl.get()` 的调用延迟到后台线程。
- 改进 BitmapFactory null 位图错误消息。
- 将 3 个设备添加到硬件位图黑名单。([#264](https://github.com/coil-kt/coil/pull/264))

---

- 更新 AndroidX 依赖项：
    - `androidx.lifecycle:lifecycle-common-java8` -> 2.2.0

## [0.9.2] - 2020 年 1 月 19 日

- 修复：修复在 API 19 之前解码 GIF 的问题。感谢 @mario。
- 修复：修复栅格化矢量 drawable 未标记为已采样的问题。
- 修复：如果 Movie 维度 <= 0 则抛出异常。
- 修复：修复 `CrossfadeTransition` 未因内存缓存事件而恢复的问题。
- 修复：如果不允许，则阻止将硬件位图返回给所有目标方法。
- 修复：修复 `MovieDrawable` 未将其自身定位在其边界中心的问题。

---

- 从 `CrossfadeDrawable` 中移除自动缩放。
- 将 `BitmapPool.trimMemory` 公开。
- 将 `AnimatedImageDrawable` 包装在 `ScaleDrawable` 中以确保其填充边界。
- 为 `RequestBuilder.setParameter` 添加 `@JvmOverloads`。
- 如果未设置，将 SVG 的视图框设置为其大小。
- 将状态和级别更改传递给 `CrossfadeDrawable` 子项。

---

- 更新 OkHttp 到 3.12.8。

## [0.9.1] - 2019 年 12 月 30 日

- 修复：修复调用 `LoadRequestBuilder.crossfade(false)` 时崩溃的问题。

## [0.9.0] - 2019 年 12 月 30 日

- **破坏性变更**：`Transformation.transform` 现在包含一个 `Size` 参数。这是为了支持根据 `Target` 大小改变输出 `Bitmap` 大小的转换。带有转换的请求现在也免于[图像采样](https://coil-kt.github.io/coil/getting_started/#image-sampling)。
- **破坏性变更**：`Transformation` 现在应用于任何类型的 `Drawable`。以前，如果输入 `Drawable` 不是 `BitmapDrawable`，则会跳过 `Transformation`。现在，`Drawable` 在应用 `Transformation` 之前会渲染到位图。
- **破坏性变更**：将 `null` 数据传递给 `ImageLoader.load` 现在被视为错误，并使用 `NullRequestDataException` 调用 `Target.onError` 和 `Request.Listener.onError`。此更改是为了支持在数据为 `null` 时设置 `fallback` drawable。以前请求会被静默忽略。
- **破坏性变更**：`RequestDisposable.isDisposed` 现在是 `val`。

---

- **新特性**：支持自定义过渡。[有关更多信息，请参阅此处](https://coil-kt.github.io/coil/transitions/)。过渡被标记为实验性，因为 API 正在孵化中。
- **新特性**：添加 `RequestDisposable.await` 以支持在 `LoadRequest` 进行中时挂起。
- **新特性**：支持在请求数据为 null 时设置 `fallback` drawable。
- **新特性**：添加 `Precision`。这使得输出 `Drawable` 的大小精确，同时为支持缩放的目标（例如 `ImageViewTarget`）启用缩放优化。**[有关更多信息，请参阅其文档](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/size/Precision.kt)。**
- **新特性**：添加 `RequestBuilder.aliasKeys` 以支持匹配多个缓存键。

---

- 修复：使 RequestDisposable 线程安全。
- 修复：`RoundedCornersTransformation` 现在裁剪到目标大小，然后圆角。
- 修复：`CircleCropTransformation` 现在从中心裁剪。
- 修复：将多个设备添加到[硬件位图黑名单](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/memory/HardwareBitmapService.kt)。
- 修复：将 Drawable 转换为 Bitmap 时保留宽高比。
- 修复：修复 `Scale.FIT` 可能导致内存缓存未命中。
- 修复：确保 Parameters 迭代顺序是确定性的。
- 修复：在创建 Parameters 和 ComponentRegistry 时进行防御性复制。
- 修复：确保 RealBitmapPool 的 `maxSize` >= 0。
- 修复：如果 `CrossfadeDrawable` 未动画或已完成，则显示起始 drawable。
- 修复：调整 `CrossfadeDrawable` 以考虑具有未定义固有大小的子项。
- 修复：修复 `MovieDrawable` 缩放不正确的问题。

---

- 更新 Kotlin 到 1.3.61。
- 更新 Kotlin Coroutines 到 1.3.3。
- 更新 Okio 到 2.4.3。
- 更新 AndroidX 依赖项：
    - `androidx.exifinterface:exifinterface` -> 1.1.0

## [0.8.0] - 2019 年 10 月 22 日

- **破坏性变更**：`SvgDrawable` 已被移除。相反，SVG 现在通过 `SvgDecoder` 预渲染为 `BitmapDrawable`。这使得 SVG **在主线程上的渲染成本显著降低**。此外，`SvgDecoder` 现在在其构造函数中需要 `Context`。
- **破坏性变更**：`SparseIntArraySet` 扩展函数已移动到 `coil.extension` 包。

---

- **新特性**：支持设置每个请求的网络头。[有关更多信息，请参阅此处](https://github.com/coil-kt/coil/pull/120)。
- **新特性**：添加新的 `Parameters` API 以支持通过图像管道传递自定义数据。
- **新特性**：支持 `RoundedCornersTransformation` 中的单个圆角半径。感谢 @khatv911。
- **新特性**：添加 `ImageView.clear()` 以支持主动释放资源。
- **新特性**：支持从其他包加载资源。
- **新特性**：为 `ViewSizeResolver` 添加 `subtractPadding` 属性，以启用/禁用在测量时减去视图的填充。
- **新特性**：改进 HttpUrlFetcher MIME 类型检测。
- **新特性**：为 MovieDrawable 和 CrossfadeDrawable 添加 Animatable2Compat 支持。
- **新特性**：添加 `RequestBuilder<*>.repeatCount` 以设置 GIF 的重复计数。
- **新特性**：将 BitmapPool 创建添加到公共 API。
- **新特性**：使用 `@MainThread` 注解 Request.Listener 方法。

---

- 修复：使 CoilContentProvider 对测试可见。
- 修复：在资源缓存键中包含夜间模式。
- 修复：通过临时将源写入磁盘来解决 ImageDecoder 本机崩溃问题。
- 修复：正确处理联系人显示照片 URI。
- 修复：将色调传递给 `CrossfadeDrawable` 的子项。
- 修复：修复多个未关闭源的实例。
- 修复：添加带有损坏/不完整硬件位图实现的设备黑名单。

---

- 针对 SDK 29 编译。
- 更新 Kotlin Coroutines 到 1.3.2。
- 更新 OkHttp 到 3.12.6。
- 更新 Okio 到 2.4.1。
- 将 `appcompat-resources` 从 `compileOnly` 更改为 `implementation`，用于 `coil-base`。

## [0.7.0] - 2019 年 9 月 8 日
- **破坏性变更**：`ImageLoaderBuilder.okHttpClient(OkHttpClient.Builder.() -> Unit)` 现在是 `ImageLoaderBuilder.okHttpClient(() -> OkHttpClient)`。初始化器现在也在后台线程上延迟调用。**如果您设置自定义 `OkHttpClient`，则必须设置 `OkHttpClient.cache` 以启用磁盘缓存。**如果您不设置自定义 `OkHttpClient`，Coil 将创建默认的 `OkHttpClient`，该默认 `OkHttpClient` 已启用磁盘缓存。默认 Coil 缓存可以使用 `CoilUtils.createDefaultCache(context)` 创建。例如：

```kotlin
val imageLoader = ImageLoader(context) {
    okHttpClient {
        OkHttpClient.Builder()
            .cache(CoilUtils.createDefaultCache(context))
            .build()
    }
}
```

- **破坏性变更**：`Fetcher.key` 不再具有默认实现。
- **破坏性变更**：以前，只有第一个适用的 `Mapper` 会被调用。现在，所有适用的 `Mapper` 都将被调用。无 API 更改。
- **破坏性变更**：次要命名参数重命名：`url` -> `uri`，`factory` -> `initializer`。

---

- **新特性**：`coil-svg` 工件，它具有支持自动解码 SVG 的 `SvgDecoder`。由 [AndroidSVG](https://github.com/BigBadaboom/androidsvg) 提供支持。感谢 @rharter。
- **新特性**：`load(String)` 和 `get(String)` 现在接受任何受支持的 Uri 方案。例如，您现在可以执行 `imageView.load("file:///path/to/file.jpg")`。
- **新特性**：重构 ImageLoader 以使用 `Call.Factory` 而不是 `OkHttpClient`。这允许使用 `ImageLoaderBuilder.okHttpClient { OkHttpClient() }` 延迟初始化网络资源。感谢 @ZacSweers。
- **新特性**：`RequestBuilder.decoder` 以明确设置请求的解码器。
- **新特性**：`ImageLoaderBuilder.allowHardware` 以启用/禁用 ImageLoader 默认的硬件位图。
- **新特性**：支持 ImageDecoderDecoder 中的软件渲染。

---

- 修复：加载矢量 drawable 的多个错误。
- 修复：支持 `WRAP_CONTENT` 视图维度。
- 修复：支持解析长于 8192 字节的 EXIF 数据。
- 修复：交叉淡入时不要拉伸宽高比不同的 drawable。
- 修复：防止网络观察器因异常而注册失败。
- 修复：修复 MovieDrawable 中的除零错误。感谢 @R12rus。
- 修复：支持嵌套 Android 资产文件。感谢 @JaCzekanski。
- 修复：防止在 Android O 和 O_MR1 上文件描述符耗尽。
- 修复：禁用内存缓存时不要崩溃。感谢 @hansenji。
- 修复：确保 `Target.cancel` 始终从主线程调用。

---

- 更新 Kotlin 到 1.3.50。
- 更新 Kotlin Coroutines 到 1.3.0。
- 更新 OkHttp 到 3.12.4。
- 更新 Okio 到 2.4.0。
- 更新 AndroidX 依赖项到最新的稳定版本：
    - `androidx.appcompat:appcompat` -> 1.1.0
    - `androidx.core:core-ktx` -> 1.1.0
    - `androidx.lifecycle:lifecycle-common-java8` -> 2.1.0
- 用 `appcompat-resources` 替换 `appcompat` 作为可选的 `compileOnly` 依赖项。`appcompat-resources` 是一个更小的工件。

## [0.6.1] - 2019 年 8 月 16 日
- 新特性：为 RequestBuilder 添加 `transformations(List<Transformation>)`。
- 修复：将最后修改日期添加到文件 URI 的缓存键。
- 修复：确保视图维度至少评估为 1px。
- 修复：清除 MovieDrawable 帧之间的画布。
- 修复：正确打开资产。

## [0.6.0] - 2019 年 8 月 12 日
- 首次发布。