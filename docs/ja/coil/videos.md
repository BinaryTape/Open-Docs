# ビデオフレーム

**この機能はAndroidでのみ利用可能です。**

ビデオフレームのサポートを追加するには、以下の拡張ライブラリをインポートします。

```kotlin
implementation("io.coil-kt.coil3:coil-video:3.3.0")
```

そして、`ImageLoader`を構築する際に、デコーダーをコンポーネントレジストリに追加します。

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(VideoFrameDecoder.Factory())
    }
    .build()
```

ビデオから抽出するフレームの時間を指定するには、`videoFrameMillis`または`videoFrameMicros`を使用します。

```kotlin
imageView.load("/path/to/video.mp4") {
    videoFrameMillis(1000)  // ビデオの1秒目のフレームを抽出
}
```

正確なフレーム番号を指定するには、`videoFrameIndex`を使用します（APIレベル28以上が必要です）。

```kotlin
imageView.load("/path/to/video.mp4") {
    videoFrameIndex(1234)  // ビデオの1234番目のフレームを抽出
}
```

ビデオの総再生時間に対する割合でビデオフレームを選択するには、`videoFramePercent`を使用します。

```kotlin
imageView.load("/path/to/video.mp4") {
    videoFramePercent(0.5)  // ビデオの再生時間の中央のフレームを抽出
}
```

フレーム位置が指定されていない場合、ビデオの最初のフレームがデコードされます。

リクエストのファイル名/URIが[有効なビデオ拡張子](https://developer.android.com/guide/topics/media/media-formats#video-formats)で終わっている場合、`ImageLoader`は自動的にビデオを検出し、そのフレームを抽出します。そうでない場合は、リクエストに対して`Decoder`を明示的に設定できます。

```kotlin
imageView.load("/path/to/video") {
    decoderFactory { result, options, _ -> VideoFrameDecoder(result.source, options) }
}