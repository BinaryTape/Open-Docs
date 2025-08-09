# Compose

要添加对 [Compose UI](https://www.jetbrains.com/compose-multiplatform/) 的支持，请导入扩展库：

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
```

然后使用 `AsyncImage` 可组合函数 (composable) 来加载并显示图片：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

`model` 可以是 `ImageRequest.data` 值，也可以是 `ImageRequest` 本身。`contentDescription` 设置了辅助功能服务用于描述此图片所代表内容的文本。

## AsyncImage

`AsyncImage` 是一个可组合函数，它异步执行图片请求并渲染结果。它支持与标准 `Image` 可组合函数相同的参数，此外，它还支持设置 `placeholder`/`error`/`fallback` 绘制器 (painter) 和 `onLoading`/`onSuccess`/`onError` 回调。这是一个加载带圆形裁剪、交叉渐变并设置占位符的图片示例：

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

**何时使用此函数：**

在大多数情况下，首选使用 `AsyncImage`。它会根据可组合函数的约束和提供的 `ContentScale`，正确确定图片应加载的大小。

## rememberAsyncImagePainter

在内部，`AsyncImage` 和 `SubcomposeAsyncImage` 使用 `rememberAsyncImagePainter` 来加载 `model`。如果你需要的是 `Painter` 而不是可组合函数，你可以使用 `rememberAsyncImagePainter` 加载图片：

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")
```

`rememberAsyncImagePainter` 比 `AsyncImage` 和 `SubcomposeAsyncImage` 更灵活，但有几个缺点（见下文）。

**何时使用此函数：**

如果你需要 `Painter` 而不是可组合函数，或者如果你需要观察 `AsyncImagePainter.state` 并根据其绘制不同的可组合函数，或者如果你需要使用 `AsyncImagePainter.restart` 手动重新启动图片请求，此函数会很有用。

此函数的主要缺点是它无法检测图片在屏幕上加载时的大小，并且总是以其原始尺寸加载图片。你可以传递自定义的 `SizeResolver` 或使用 `rememberConstraintsSizeResolver`（`AsyncImage` 内部使用的就是它）来解决此问题。示例：

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

另一个缺点是，当使用 `rememberAsyncImagePainter` 时，`AsyncImagePainter.state` 在首次组合 (composition) 时将始终为 `AsyncImagePainter.State.Empty`，即使图片存在于内存缓存中并将在第一帧中绘制。

## SubcomposeAsyncImage

`SubcomposeAsyncImage` 是 `AsyncImage` 的一个变体，它使用子组合 (subcomposition) 为 `AsyncImagePainter` 的状态提供槽位 API (slot API)，而不是使用 `Painter`。这是一个示例：

```kotlin
SubcomposeAsyncImage(
    model = "https://example.com/image.jpg",
    loading = {
        CircularProgressIndicator()
    },
    contentDescription = stringResource(R.string.description),
)
```

此外，你可以使用其 `content` 参数和 `SubcomposeAsyncImageContent` 实现更复杂的逻辑，`SubcomposeAsyncImageContent` 会渲染当前状态：

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

!!! Note
    子组合 (subcomposition) 比常规组合 (composition) 慢，因此此可组合函数可能不适用于 UI 中对性能要求较高的部分（例如 `LazyList`）。

**何时使用此函数：**

通常，如果你需要观察 `AsyncImagePainter.state`，请首选使用 `rememberAsyncImagePainter` 而不是此函数，因为它不使用子组合。

具体而言，此函数仅在你需要观察 `AsyncImagePainter.state` 且它不能像 `rememberAsyncImagePainter` 那样在首次组合和第一帧中为 `Empty` 时才有用。`SubcomposeAsyncImage` 使用子组合来获取图片的约束，因此其 `AsyncImagePainter.state` 会立即更新。

## 观察 AsyncImagePainter.state

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
        // Show some error UI.
    }
}
```

## 过渡

你可以使用 `ImageRequest.Builder.crossfade` 启用内置的交叉渐变过渡：

```kotlin
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
)
```

自定义 [`Transition`](/coil/api/coil-core/coil3.transition/-transition) 不适用于 `AsyncImage`、`SubcomposeAsyncImage` 或 `rememberAsyncImagePainter`，因为它们需要 `View` 引用。`CrossfadeTransition` 由于特殊的内部支持而起作用。

也就是说，可以通过观察 `AsyncImagePainter.state` 在 Compose 中创建自定义过渡：

```kotlin
val painter = rememberAsyncImagePainter("https://example.com/image.jpg")

val state by painter.state.collectAsState()
if (state is AsyncImagePainter.State.Success && state.result.dataSource != DataSource.MEMORY_CACHE) {
    // Perform the transition animation.
}

Image(
    painter = painter,
    contentDescription = stringResource(R.string.description),
)
```

## 预览

`AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage` 在 Android Studio 预览中的行为由 `LocalAsyncImagePreviewHandler` 控制。默认情况下，它会在预览环境中尝试正常执行请求。预览环境中网络访问被禁用，因此网络 URL 总是会失败。

你可以这样覆盖预览行为：

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

这对于 [AndroidX 的 Compose 预览截图测试库](https://developer.android.com/studio/preview/compose-screenshot-testing)也很有用，该库在相同的预览环境中执行。

## Compose Multiplatform 资源

Coil 支持使用 `Res.getUri` 作为 `model` 参数来加载 [Compose Multiplatform 资源](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-resources.html)。示例：

```kotlin
AsyncImage(
    model = Res.getUri("drawable/sample.jpg"),
    contentDescription = null,
)
```

!!! Note
    Coil 不支持 `Res.drawable.image` 和其他编译安全引用。你必须改用 `Res.getUri("drawable/image")`。 [关注此 issue 获取更新](https://github.com/coil-kt/coil/issues/2812)。

    ```