# Javaとの互換性

CoilのAPIはKotlin第一（Kotlin-first）で設計されています。Javaでは利用できないインラインラムダ、レシーバーパラメータ、デフォルト引数、拡張関数といったKotlinの言語機能を活用しています。

重要な点として、`suspend` 関数はJavaで実装することができません。つまり、カスタムの [Transformations](/coil/api/coil-core/coil3.transform/-transformation)、[Size Resolvers](/coil/api/coil-core/coil3.size/-size-resolver)、[Fetchers](image_pipeline.md#fetchers)、および [Decoders](image_pipeline.md#decoders) は、Kotlinで実装する**必要があります**。

これらの制限はありますが、CoilのAPIの大部分はJavaと互換性があります。シングルトンの `ImageLoader` は次のように取得できます。

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

`ImageRequest` をエンキュー（enqueue）する構文は、JavaとKotlinでほとんど同じです。

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(new ImageViewTarget(imageView))
    .build();
imageLoader.enqueue(request);
```

!!! Note
    `ImageView.load` はJavaからは使用できません。代わりに `ImageRequest.Builder` APIを使用してください。

`suspend` 関数をJavaから簡単に呼び出すことはできません。そのため、画像を同期的に取得するには、`ImageLoader.executeBlocking` 拡張関数を使用する必要があります。これはJavaから次のように呼び出すことができます。

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Image image = ImageLoaders.executeBlocking(imageLoader, request).getImage();
Drawable drawable = Image_androidKt.asDrawable(image, context.getResources());
```

!!! Note
    `ImageLoaders.executeBlocking` は、処理を中断（suspend）させるのではなく、カレントスレッドをブロックします。メインスレッドからは呼び出さないでください。