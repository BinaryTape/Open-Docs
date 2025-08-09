# SVG

若要新增 SVG 支援，請匯入擴充函式庫：

```kotlin
implementation("io.coil-kt.coil3:coil-svg:3.3.0")
```

就這麼簡單！`ImageLoader` 將會自動偵測並解碼任何 SVG。Coil 透過尋找檔案前 1 KB 中的 `<svg ` 標記來偵測 SVG，這應能涵蓋大多數情況。如果 SVG 未自動偵測到，您可以為請求明確設定 `Decoder`：

```kotlin
imageView.load("/path/to/svg") {
    decoderFactory { result, options, _ -> SvgDecoder(result.source, options) }
}
```

或者，您可以在建構 `ImageLoader` 時手動將解碼器新增到您的組件註冊表：

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(SvgDecoder.Factory())
    }
    .build()