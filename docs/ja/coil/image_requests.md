# 画像リクエスト

`ImageRequest`は、[値オブジェクト](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)であり、[ImageLoader](image_loaders.md)が画像を読み込むために必要なすべての情報を提供します。`ImageRequest`はビルダーを使用して作成できます。

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

リクエストを作成したら、それを`ImageLoader`に渡してキューに入れるか実行します。

```kotlin
imageLoader.enqueue(request)
```

詳細については、[APIドキュメント](/coil/api/coil-core/coil3.request/-image-request/)を参照してください。