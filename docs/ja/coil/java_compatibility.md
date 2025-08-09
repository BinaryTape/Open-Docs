# Java互換性

CoilのAPIはKotlinファーストで設計されています。Kotlinのインラインラムダ、レシーバーパラメータ、デフォルト引数、拡張関数といったJavaでは利用できない言語機能を活用しています。

重要な点として、サスペンド関数はJavaでは実装できません。これは、カスタムの[Transformations](/coil/api/coil-core/coil3.transform/-transformation)、[Size Resolvers](/coil/api/coil-core/coil3.size/-size-resolver)、[Fetchers](image_pipeline.md#fetchers)、および[Decoders](image_pipeline.md#decoders)がKotlinで**のみ**実装可能であることを意味します。

これらの制限があるにもかかわらず、CoilのAPIのほとんどはJavaと互換性があります。シングルトン`ImageLoader`は次のようにして取得できます。

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

`ImageRequest`をエンキューする構文は、JavaとKotlinでほとんど同じです。

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(new ImageViewTarget(imageView))
    .build();
imageLoader.enqueue(request);
```

!!! Note
    `ImageView.load`はJavaからは使用できません。代わりに`ImageRequest.Builder` APIを使用してください。

`suspend`関数はJavaから簡単に呼び出すことはできません。したがって、画像を同期的に取得するには、Javaから次のように呼び出せる`ImageLoader.executeBlocking`拡張関数を使用する必要があります。

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Drawable drawable = ImageLoaders.executeBlocking(imageLoader, request).getImage().asDrawable(context.resources);
```

!!! Note
    `ImageLoaders.executeBlocking`は、サスペンドする代わりに現在のスレッドをブロックします。これをメインスレッドから呼び出さないでください。