# GIF图

**此功能仅在 Android 上可用。**

与 Glide 不同，Coil 默认不支持 GIF。然而，Coil 提供了一个扩展库来支持它们。

要添加 GIF 支持，请导入以下扩展库：

```kotlin
implementation("io.coil-kt.coil3:coil-gif:3.3.0")
```

就是这样！`ImageLoader` 将使用文件头自动检测任何 GIF 并正确解码它们。

（可选）在构建 `ImageLoader` 时，您可以手动将解码器添加到组件注册表：

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        if (SDK_INT >= 28) {
            add(AnimatedImageDecoder.Factory())
        } else {
            add(GifDecoder.Factory())
        }
    }
    .build()
```

要转换 GIF 每个帧的像素数据，请参阅 [AnimatedTransformation](/coil/api/coil-gif/coil3.gif/-animated-transformation)。

!!! Note
    Coil 包含两个独立的解码器来支持 GIF 解码。`GifDecoder` 支持所有 API 级别，但速度较慢。`AnimatedImageDecoder` 由 Android 的 [ImageDecoder](https://developer.android.com/reference/android/graphics/ImageDecoder) API 提供支持，该 API 仅适用于 API 级别 28 及更高版本。`AnimatedImageDecoder` 比 `GifDecoder` 更快，并支持解码动画 WebP 图像和动画 HEIF 图像序列。