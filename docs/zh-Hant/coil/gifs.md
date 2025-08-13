# GIF 動畫

**此功能僅適用於 Android。**

與 Glide 不同，GIF 動畫預設不支援。然而，Coil 有一個擴充函式庫來支援它們。

若要新增 GIF 動畫支援，請導入此擴充函式庫：

```kotlin
implementation("io.coil-kt.coil3:coil-gif:3.3.0")
```

就這樣！`ImageLoader` 將會自動偵測任何 GIF 動畫，透過其檔案標頭並正確地解碼它們。

您可以選擇手動將解碼器新增到建構 `ImageLoader` 時的元件註冊表：

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

若要轉換 GIF 動畫每個影格的像素資料，請參閱 [AnimatedTransformation](/coil/api/coil-gif/coil3.gif/-animated-transformation)。

!!! 注意
    Coil 包含兩個獨立的解碼器來支援 GIF 動畫解碼。`GifDecoder` 支援所有 API 等級，但速度較慢。`AnimatedImageDecoder` 由 Android 的 [ImageDecoder](https://developer.android.com/reference/android/graphics/ImageDecoder) API 提供支援，該 API 僅在 API 28 及更高版本上可用。`AnimatedImageDecoder` 比 `GifDecoder` 更快，並支援解碼動態 WebP 影像和動態 HEIF 影像序列。

    ```