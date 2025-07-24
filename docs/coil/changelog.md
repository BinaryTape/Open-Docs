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
- 允许 `ImageDecoder` 解码部分图像源。这与 `BitmapFactory` 中的行为一致。
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
- 修复了 `ImageRequest.bitmapConfig` 仅在 API 28 及更高版本上被遵循的情况，如果它是 `ARGB_8888` 或 `HARDWARE`。

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
- 不要自动将 `ColorDrawable` 转换为 `AsyncImagePainter` 中的 `ColorPainter`。
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
    - `Mapper`、`Fetcher` 和 `Decoder` 已