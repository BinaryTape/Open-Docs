# 画像リクエスト

`ImageRequest` は、[ImageLoader](image_loaders.md) が画像を読み込むために必要なすべての情報を提供する [バリューオブジェクト](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/) です。`ImageRequest` はビルダーを使用して作成できます。

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(imageView)
    .build()
```

リクエストを作成したら、それを `ImageLoader` に渡して `enqueue` または `execute` します。

```kotlin
imageLoader.enqueue(request)
```

詳細については、[API ドキュメント](/coil/api/coil-core/coil3.request/-image-request/) を参照してください。

!!! Notes
    Coil 3.x では、`ImageRequest` のプラットフォーム固有の関数（例：`ImageRequest.Builder.target(ImageView)`）は拡張関数として実装されており、別途インポートする必要があります。