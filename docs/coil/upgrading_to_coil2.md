# 升级到 Coil 2.x

这是一份简短的指南，旨在强调从 Coil 1.x 升级到 2.x 时的主要变化以及如何处理它们。本升级指南不涵盖所有二进制或源不兼容的更改，但它涵盖了最重要的更改。

## 最低 API 21

Coil 2.x 要求最低 API 21。这也是 Compose 和 OkHttp 4.x 所要求的最低 API。

## ImageRequest 默认缩放

Coil 2.x 将 `ImageRequest` 的默认缩放从 `Scale.FILL` 更改为 `Scale.FIT`。这样做是为了与 `ImageView` 的默认 `ScaleType` 和 `Image` 的默认 `ContentScale` 保持一致。如果您将 `ImageView` 设置为 `ImageRequest.target`，缩放仍然会进行自动检测。

## Size 重构

`Size` 的 `width` 和 `height` 现在是两个 `Dimension` 类型，而不是 `Int` 像素值。`Dimension` 可以是像素值，也可以是 `Dimension.Undefined`，后者表示未定义/无边界的约束。例如，如果 `size` 是 `Size(400, Dimension.Undefined)`，这意味着图像的宽度应缩放为 400 像素，而无论其高度如何。您可以使用 `pxOrElse` 扩展函数来获取像素值（如果存在），否则使用备用值：

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // Use the pixel value.
}
```

此更改旨在改善对目标具有一个无边界维度的情况的支持（例如，如果 `View` 的一个维度是 `ViewGroup.LayoutParams.WRAP_CONTENT`，或 Compose 中的 `Constraints.Infinity`）。

## Compose

Coil 2.x 大幅重构了 Compose 集成，以增加功能、提高稳定性和改善性能。

在 Coil 1.x 中，您会使用 `rememberImagePainter` 来加载图像：

```kotlin
val painter = rememberImagePainter("https://example.com/image.jpg") {
    crossfade(true)
}

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

在 Coil 2.x 中，`rememberImagePainter` 已更改为 `rememberAsyncImagePainter`，并进行了以下更改：

- 用于配置 `ImageRequest` 的尾随 lambda 参数已移除。
- 在 Coil 2.x 中，`rememberAsyncImagePainter` 默认使用 `ContentScale.Fit`，以与 `Image` 保持一致，而在 Coil 1.x 中，它默认使用 `ContentScale.Crop`。因此，如果您在 `Image` 上设置了自定义的 `ContentScale`，您现在也需要将其传递给 `rememberAsyncImagePainter`。

```kotlin
val painter = rememberAsyncImagePainter(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentScale = ContentScale.Crop
)

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

此外，Coil 现在提供了 `AsyncImage` 和 `SubcomposeAsyncImage` 可组合函数，它们增加了新功能并解决了 `rememberAsyncImagePainter` 的一些设计限制。请在此处查看完整的 Compose 文档 [compose.md](compose.md)。

## 磁盘缓存

Coil 2.x 拥有自己的公共磁盘缓存类，可以通过 `imageLoader.diskCache` 访问。Coil 1.x 依赖于 OkHttp 的磁盘缓存，但现在不再需要。

在 1.x 中配置磁盘缓存，您会使用 `CoilUtils.createDefaultCache`：

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

在 Coil 2.x 中，当与 `ImageLoader` 一起使用时，您不应该在 `OkHttpClient` 上设置 `Cache` 对象。相反，应像这样配置磁盘缓存对象：

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

进行此更改是为了增加功能并提高性能：

- 支持图像解码时的线程中断。
  - 线程中断允许快速取消解码操作。这对于快速滚动列表尤其重要。
  - 通过使用自定义磁盘缓存，Coil 能够确保网络源在解码之前完全写入磁盘。这是必要的，因为数据写入磁盘不能被中断——只有解码步骤可以被中断。OkHttp 的 `Cache` 不应与 Coil 2.0 一起使用，因为它无法保证所有数据在解码之前都写入磁盘。
- 避免为不支持 `InputStream` 或需要直接访问 `File` 的解码 API（例如 `ImageDecoder`、`MediaMetadataRetriever`）进行缓冲/创建临时文件。
- 添加公共读写 `DiskCache` API。

在 Coil 2.x 中，`Cache-Control` 和其他缓存头仍然受支持——除了 `Vary` 头，因为缓存只检查 URL 是否匹配。此外，只有响应码在 [200..300) 范围内的响应才会被缓存。

从 Coil 1.x 升级到 2.x 时，任何现有的磁盘缓存都将被清除，因为内部格式已更改。

## 图像管道重构

Coil 2.x 重构了图像管道类，使其更加灵活。以下是这些更改的概要列表：

- 引入了一个新类 `Keyer`，它计算请求的内存缓存键。它取代了 `Fetcher.key`。
- `Mapper`、`Keyer`、`Fetcher` 和 `Decoder` 可以返回 `null`，以委托给列表中的下一个元素。
- 在 `Mapper.map` 的签名中添加了 `Options`。
- 引入了 `Fetcher.Factory` 和 `Decoder.Factory`。使用这些工厂来确定特定的 `Fetcher`/`Decoder` 是否适用。如果该 `Fetcher`/`Decoder` 不适用，则返回 `null`。

## 移除位图池化

Coil 2.x 移除了位图池化及其相关类（`BitmapPool`、`PoolableViewTarget`）。请参阅 [此处](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528) 了解移除的原因。