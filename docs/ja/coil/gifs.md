# GIF

**この機能はAndroidでのみ利用可能です。**

Glideとは異なり、GIFはデフォルトではサポートされていません。しかし、CoilにはGIFをサポートするための拡張ライブラリがあります。

GIFのサポートを追加するには、拡張ライブラリをインポートします。

```kotlin
implementation("io.coil-kt.coil3:coil-gif:3.3.0")
```

これだけです！ `ImageLoader` はファイルヘッダーを使用してGIFを自動的に検出し、正しくデコードします。

オプションとして、`ImageLoader` を構築する際に、デコーダーをコンポーネントレジストリに手動で追加できます。

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

GIFの各フレームのピクセルデータを変換するには、[AnimatedTransformation](/coil/api/coil-gif/coil3.gif/-animated-transformation)を参照してください。

!!! 注意
    Coilには、GIFのデコードをサポートするために2つの異なるデコーダーが含まれています。`GifDecoder` はすべてのAPIレベルをサポートしますが、より低速です。`AnimatedImageDecoder` は、API 28以降でのみ利用可能なAndroidの [ImageDecoder](https://developer.android.com/reference/android/graphics/ImageDecoder) APIを利用しています。`AnimatedImageDecoder` は `GifDecoder` よりも高速で、アニメーションWebP画像やアニメーションHEIF画像シーケンスのデコードをサポートしています。