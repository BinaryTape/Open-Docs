# SVG

为了添加 SVG 支持，请导入扩展库：

```kotlin
implementation("io.coil-kt.coil3:coil-svg:3.3.0")
```

就这样！`ImageLoader` 将自动检测并解码所有 SVG。Coil 通过查找文件前 1 KB 中的 `<svg ` 标记来检测 SVG，这应该涵盖大多数情况。如果 SVG 未自动检测到，您可以为请求显式设置 `Decoder`：

```kotlin
imageView.load("/path/to/svg") {
    decoderFactory { result, options, _ -> SvgDecoder(result.source, options) }
}
```

或者，您可以在构建 `ImageLoader` 时手动将解码器添加到您的组件注册表：

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(SvgDecoder.Factory())
    }
    .build()