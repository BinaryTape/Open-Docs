# 升级至 Coil 2.x

本指南简要介绍了从 Coil 1.x 升级至 2.x 时的主要变更及处理方法。本升级指南并未涵盖所有二进制或源代码不兼容的变更，但涵盖了最重要的部分。

## 最低 API 21

Coil 2.x 要求最低 API 21。这也是 Compose 和 OkHttp 4.x 所需的最低 API。

## ImageRequest 默认 scale

Coil 2.x 将 `ImageRequest` 的默认 scale 从 `Scale.FILL` 更改为 `Scale.FIT`。这样做是为了与 `ImageView` 的默认 `ScaleType` 以及 `Image` 的默认 `ContentScale` 保持一致。如果您将 `ImageView` 设置为 `ImageRequest.target`，scale 仍会被自动检测。

## Size 重构

`Size` 的 `width` 和 `height` 现在是两个 `Dimension` 而非 `Int` 像素值。`Dimension` 可以是像素值，也可以是 `Dimension.Undefined`（表示未定义/无界约束）。例如，如果 size 为 `Size(400, Dimension.Undefined)`，则表示该图像应缩放为宽度 400 像素，而不考虑其高度。您可以使用 `pxOrElse` 扩展来获取像素值（如果存在），否则使用回退值：

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // 使用像素值。
}
```

此项更改旨在改进对目标具有一个无界维度的情况的支持（例如：对于 `View`，一个维度是 `ViewGroup.LayoutParams.WRAP_CONTENT`；或在 Compose 中为 `Constraints.Infinity`）。

## Compose

Coil 2.x 对 Compose 集成进行了重大重构，以增加功能、提高稳定性和提升性能。

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

在 Coil 2.x 中，`rememberImagePainter` 已更改为 `rememberAsyncImagePainter`，具体变更如下：

- 用于配置 `ImageRequest` 的尾随 lambda 实参已被移除。
- 在 Coil 2.x 中，`rememberAsyncImagePainter` 默认使用 `ContentScale.Fit` 以与 `Image` 保持一致，而 Coil 1.x 中默认使用 `ContentScale.Crop`。因此，如果您在 `Image` 上设置了自定义 `ContentScale`，现在还需要将其传递给 `rememberAsyncImagePainter`。

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

此外，Coil 现在提供了 `AsyncImage` 和 `SubcomposeAsyncImage` 可组合函数，它们增加了新功能并解决了 `rememberAsyncImagePainter` 的一些设计限制。在此处查看完整的 Compose 文档 [此处](compose.md)。

## 磁盘缓存

Coil 2.x 拥有自己的公开磁盘缓存类，可以通过 `imageLoader.diskCache` 访问。Coil 1.x 依赖于 OkHttp 的磁盘缓存，但现在已不再需要。

要在 1.x 中配置磁盘缓存，您可以使用 `CoilUtils.createDefaultCache`：

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

在 Coil 2.x 中，当 `OkHttpClient` 与 `ImageLoader` 搭配使用时，不应在 `OkHttpClient` 上设置 `Cache` 对象。相反，应按如下方式配置磁盘缓存对象：

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

此项更改旨在增加功能并提升性能：

- 支持在解码图像时中断线程。
  - 线程中断允许快速取消解码操作。这对于快速滚动列表尤为重要。
  - 通过使用自定义磁盘缓存，Coil 能够确保在解码前将网络源完整读取到磁盘。这是必要的，因为将数据写入磁盘的过程不可中断——只有解码步骤可以被中断。Coil 2.0 不应使用 OkHttp 的 `Cache`，因为无法保证所有数据在解码前都已写入磁盘。
- 避免为不支持 `InputStream` 或需要直接访问 `File` 的解码 API（例如 `ImageDecoder`、`MediaMetadataRetriever`）进行缓冲或创建临时文件。
- 增加公开的读/写 `DiskCache` API。

在 Coil 2.x 中，`Cache-Control` 和其他缓存标头仍受支持——但 `Vary` 标头除外，因为缓存仅检查 URL 是否匹配。此外，仅缓存响应代码在 [200..300) 范围内的响应。

从 Coil 1.x 升级到 2.x 时，由于内部格式已更改，任何现有的磁盘缓存都将被清除。

## 图像流水线重构

Coil 2.x 重构了图像流水线类，使其更加灵活。以下是主要的变更列表：

- 引入了一个新类 `Keyer`，用于计算请求的内存缓存键。它取代了 `Fetcher.key`。
- `Mapper`、`Keyer`、`Fetcher` 和 `Decoder` 可以返回 `null`，以便委派给组件列表中的下一个元素。
- 在 `Mapper.map` 的签名中增加了 `Options`。
- 引入了 `Fetcher.Factory` 和 `Decoder.Factory`。使用工厂来确定特定的 `Fetcher`/`Decoder` 是否适用。如果该 `Fetcher`/`Decoder` 不适用，则返回 `null`。

## 移除位图池化

Coil 2.x 移除了位图池化及其相关类（`BitmapPool`、`PoolableViewTarget`）。请参阅[此处](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528)了解移除原因。