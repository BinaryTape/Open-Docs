# 影片影格

**此功能僅適用於 Android。**

若要新增影片影格支援，請匯入擴充程式庫：

```kotlin
implementation("io.coil-kt.coil3:coil-video:3.3.0")
```

建立 `ImageLoader` 時，請將解碼器新增至您的元件註冊表：

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(VideoFrameDecoder.Factory())
    }
    .build()
```

若要指定從影片中擷取影格的時間，請使用 `videoFrameMillis` 或 `videoFrameMicros`：

```kotlin
imageView.load("/path/to/video.mp4") {
    videoFrameMillis(1000)  // 擷取影片在 1 秒處的影格
}
```

若要指定確切的影格編號，請使用 `videoFrameIndex` (需要 API level 28)：

```kotlin
imageView.load("/path/to/video.mp4") {
    videoFrameIndex(1234)  // 擷取影片的第 1234 個影格
}
```

若要根據影片總時長的百分比選取影片影格，請使用 `videoFramePercent`：

```kotlin
imageView.load("/path/to/video.mp4") {
    videoFramePercent(0.5)  // 擷取影片時長中間的影格
}
```

如果未指定影格位置，則會解碼影片的第一個影格。

如果請求的檔案名稱/URI 以 [有效的影片副檔名](https://developer.android.com/guide/topics/media/media-formats#video-formats) 結尾，`ImageLoader` 將自動偵測任何影片並擷取其影格。如果沒有，您可以為請求明確設定 `Decoder`：

```kotlin
imageView.load("/path/to/video") {
    decoderFactory { result, options, _ -> VideoFrameDecoder(result.source, options) }
}
```