# はじめに

## Compose UI

一般的なCompose UIプロジェクトでは、以下をインポートする必要があります。

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

インポート後、`AsyncImage` を使用してネットワークから画像を読み込むことができます。

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

!!! Note
    Compose Multiplatformを使用する場合、OkHttpの代わりにKtorを使用する必要があります。その方法については[こちら](network.md#ktor-network-engines)を参照してください。

## Android Views

Compose UIの代わりにAndroid Viewsを使用する場合は、以下をインポートします。

```kotlin
implementation("io.coil-kt.coil3:coil:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

インポート後、`ImageView.load` 拡張関数を使用してネットワークから画像を読み込むことができます。

```kotlin
imageView.load("https://example.com/image.jpg")
```

## シングルトン ImageLoader の構成

デフォルトでは、Coilにはシングルトン`ImageLoader`が含まれています。`ImageLoader`は、`ImageRequest`の取得、デコード、キャッシュ、および結果の返却を行うことで、受信する`ImageRequest`を実行します。`ImageLoader`を構成する必要はありません。構成しない場合、Coilはデフォルト設定でシングルトン`ImageLoader`を作成します。

いくつかの方法で構成できます（**いずれか1つを選択してください**）。

- アプリのエントリポイント（アプリのルート`@Composable`）付近で`setSingletonImageLoaderFactory`を呼び出す。**これはCompose Multiplatformアプリに最適です。**

```kotlin
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

- Androidで、[`Application`](https://developer.android.com/reference/android/app/Application)に`SingletonImageLoader.Factory`を実装する。**これはAndroidアプリに最適です。**

```kotlin
class CustomApplication : Application(), SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

- アプリのエントリポイント（例：Androidの`Application.onCreate`）付近で`SingletonImageLoader.setSafe`を呼び出す。これが最も柔軟な方法です。

```kotlin
SingletonImageLoader.setSafe { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}
```

!!! Note
    Coilに依存するライブラリを作成している場合、シングルトン`ImageLoader`を取得/設定**すべきではありません**。代わりに、`io.coil-kt.coil3:coil-core`に依存し、独自の`ImageLoader`を作成して手動で渡す必要があります。ライブラリ内でシングルトン`ImageLoader`を設定すると、そのライブラリを使用しているアプリがCoilも使用している場合に、アプリによって設定された`ImageLoader`を上書きしてしまう可能性があります。

## アーティファクト

Coilが`mavenCentral()`に公開している主要なアーティファクトのリストを以下に示します。

*   `io.coil-kt.coil3:coil`: `io.coil-kt.coil3:coil-core`に依存するデフォルトのアーティファクトです。シングルトン`ImageLoader`と関連する拡張関数が含まれています。
*   `io.coil-kt.coil3:coil-core`: `io.coil-kt.coil3:coil`のサブセットで、シングルトン`ImageLoader`および関連する拡張関数は**含まれていません**。
*   `io.coil-kt.coil3:coil-compose`: `io.coil-kt.coil3:coil`と`io.coil-kt.coil3:coil-compose-core`に依存するデフォルトの[Compose UI](https://www.jetbrains.com/compose-multiplatform/)アーティファクトです。シングルトン`ImageLoader`を使用する`AsyncImage`、`rememberAsyncImagePainter`、`SubcomposeAsyncImage`のオーバーロードが含まれています。
*   `io.coil-kt.coil3:coil-compose-core`: `io.coil-kt.coil3:coil-compose`のサブセットで、シングルトン`ImageLoader`に依存する関数は含まれていません。
*   `io.coil-kt.coil3:coil-network-okhttp`: [OkHttp](https://github.com/square/okhttp)を使用してネットワークから画像をフェッチするサポートが含まれています。
*   `io.coil-kt.coil3:coil-network-ktor2`: [Ktor 2](https://github.com/ktorio/ktor)を使用してネットワークから画像をフェッチするサポートが含まれています。
*   `io.coil-kt.coil3:coil-network-ktor3`: [Ktor 3](https://github.com/ktorio/ktor)を使用してネットワークから画像をフェッチするサポートが含まれています。
*   `io.coil-kt.coil3:coil-network-cache-control`: ネットワークから画像をフェッチする際に、[`Cache-Control`ヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)を尊重するサポートが含まれています。
*   `io.coil-kt.coil3:coil-gif`: GIFのデコードをサポートするための2つの[デコーダー](/coil/api/coil-core/coil3.decode/-decoder)が含まれています。詳細については[GIFs](gifs.md)を参照してください。
*   `io.coil-kt.coil3:coil-svg`: SVGのデコードをサポートするための[デコーダー](/coil/api/coil-core/coil3.decode/-decoder)が含まれています。詳細については[SVGs](svgs.md)を参照してください。
*   `io.coil-kt.coil3:coil-video`: [Androidがサポートする任意のビデオ形式](https://developer.android.com/guide/topics/media/media-formats#video-codecs)からフレームをデコードするサポートのための[デコーダー](/coil/api/coil-core/coil3.decode/-decoder)が含まれています。詳細については[videos](videos.md)を参照してください。
*   `io.coil-kt.coil3:coil-test`: テストをサポートするためのクラスが含まれています。詳細については[testing](testing.md)を参照してください。
*   `io.coil-kt.coil3:coil-bom`: [ビルオブマテリアル](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)が含まれています。`coil-bom`をインポートすると、バージョンを指定せずに他のCoilアーティファクトに依存できるようになります。