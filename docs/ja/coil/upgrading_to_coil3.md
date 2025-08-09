# Coil 3.x へのアップグレード

Coil 3 は、Coil の次の主要バージョンであり、いくつかの大きな改善点があります。

-   [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) の主要なターゲット（Android、iOS、JVM、JS、および [WASM](https://coil-kt.github.io/coil/sample/)）を含む完全なサポート。
-   複数のネットワーキングライブラリ（Ktor と OkHttp）のサポート。あるいは、ローカル/静的ファイルの読み込みのみが必要な場合は、ネットワーク依存関係なしで Coil を使用できます。
-   Compose の `@Preview` レンダリングの改善と、`LocalAsyncImagePreviewHandler` を介したカスタムプレビュー動作のサポート。
-   既存の動作の変更を必要とした重要なバグ修正（以下に概説）。

このドキュメントでは、Coil 2 から Coil 3 への主な変更点の概要と、破壊的または重要な変更点について重点的に説明します。バイナリ非互換な変更や細かな動作の変更はすべては網羅していません。

Compose Multiplatform プロジェクトで Coil 3 を使用していますか？ [`samples`](https://github.com/coil-kt/coil/tree/3.x/samples/compose) リポジトリで例を確認してください。

## Maven座標とパッケージ名

Coil の Maven 座標は `io.coil-kt` から `io.coil-kt.coil3` に更新され、そのパッケージ名は `coil` から `coil3` に更新されました。これにより、Coil 3 はバイナリ互換性の問題なしに Coil 2 と並行して実行できます。例えば、`io.coil-kt:coil:2.7.0` は `io.coil-kt.coil3:coil:3.0.0` になりました。

`coil-base` と `coil-compose-base` アーティファクトは、それぞれ `coil-core` と `coil-compose-core` に名称変更され、Coroutines、Ktor、および AndroidX で使用される命名規則に合わせられました。

## ネットワーク画像

**`coil-core` はデフォルトでネットワークからの画像読み込みをサポートしなくなりました。** [Coil のネットワークアーティファクトのいずれかへの依存関係を追加する必要があります。詳細はこちらを参照してください。](network.md)。これは、ユーザーが異なるネットワークライブラリを使用したり、アプリがネットワークを必要としない場合にネットワークへの依存を避けられるように変更されました。

さらに、キャッシュコントロールヘッダーはデフォルトでは尊重されなくなりました。[詳細はこちら](network.md) を参照してください。

## マルチプラットフォーム

Coil 3 は、Android、JVM、iOS、macOS、Javascript、および WASM をサポートする Kotlin マルチプラットフォームライブラリになりました。

Android では、Coil は標準のグラフィッククラスを使用して画像をレンダリングします。Android以外のプラットフォームでは、Coil は [Skiko](https://github.com/JetBrains/skiko) を使用して画像をレンダリングします。Skiko は、Google が開発した [Skia](https://github.com/google/skia) グラフィックエンジンをラップする Kotlin バインディングのセットです。

Android SDK からの分離の一環として、いくつかの API 変更が行われました。特に次の点が挙げられます。

-   `Drawable` はカスタムの `Image` インターフェースに置き換えられました。Android 上でクラス間で変換するには、`Drawable.asImage()` と `Image.asDrawable(resources)` を使用します。Android以外のプラットフォームでは `Bitmap.asImage()` と `Image.toBitmap()` を使用します。
-   Android の `android.net.Uri` クラスの使用は、マルチプラットフォームの `coil3.Uri` クラスに置き換えられました。`android.net.Uri` を `ImageRequest.data` として渡す呼び出し箇所は影響を受けません。`android.net.Uri` の受信に依存するカスタム `Fetcher` は、`coil3.Uri` を使用するように更新する必要があります。
-   `Context` の使用は `PlatformContext` に置き換えられました。`PlatformContext` は Android では `Context` の型エイリアスであり、Android以外のプラットフォームでは `PlatformContext.INSTANCE` を使用してアクセスできます。Compose Multiplatform で参照を取得するには `LocalPlatformContext.current` を使用します。
-   `Coil` クラスは `SingletonImageLoader` に名称変更されました。
-   カスタム Android `Application` クラスで `ImageLoaderFactory` を実装している場合、`ImageLoaderFactory` の代替として `SingletonImageLoader.Factory` の実装に切り替える必要があります。`SingletonImageLoader.Factory` を実装すると、必要に応じて `newImageLoader()` をオーバーライドできるようになります。

`coil-svg` アーティファクトはマルチプラットフォームでサポートされていますが、`coil-gif` および `coil-video` アーティファクトは、特定のAndroidデコーダーとライブラリに依存しているため、引き続きAndroidのみの対応です（現時点では）。

## Compose

`coil-compose` アーティファクトの API はほとんど変更されていません。Coil 2 と同じように `AsyncImage`、`SubcomposeAsyncImage`、`rememberAsyncImagePainter` を引き続き使用できます。さらに、これらのメソッドは [リスタート可能かつスキップ可能](https://developer.android.com/jetpack/compose/performance/stability) に更新され、パフォーマンスが向上するはずです。

-   `AsyncImagePainter.state` は `StateFlow` になりました。`val state = painter.state.collectAsState()` を使用して観測する必要があります。
-   `AsyncImagePainter` のデフォルト `SizeResolver` は、キャンバスのサイズを取得するために最初の `onDraw` 呼び出しを待たなくなりました。代わりに、`AsyncImagePainter` はデフォルトで `Size.ORIGINAL` になります。
-   Compose の `modelEqualityDelegate` デリゲートは、`AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImagePainter` へのパラメータとしてではなく、コンポジションローカルである `LocalAsyncImageModelEqualityDelegate` を介して設定されるようになりました。

## 一般

その他の重要な動作変更には以下が含まれます。

-   ファーストパーティの `Fetcher` と `Decoder`（例: `NetworkFetcher.Factory`、`SvgDecoder` など）は、サービスローダーを介して各新しい `ImageLoader` に自動的に追加されるようになりました。この動作は `ImageLoader.Builder.serviceLoaderEnabled(false)` で無効にできます。
-   リソース縮小最適化を妨げるため、`android.resource://example.package.name/drawable/image` URI のサポートを削除しました。`R.drawable.image` の値を直接渡すことを推奨します。リソース名ではなくリソースIDを渡す場合でも機能します: `android.resource://example.package.name/12345678`。その機能がまだ必要な場合は、[コンポーネントレジストリに `ResourceUriMapper` を手動で含める](https://github.com/coil-kt/coil/blob/da7d872e340430014dbc5136e35eb62f9b17662e/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)ことができます。
-   ファイルの最終書き込みタイムスタンプは、デフォルトでキャッシュキーに追加されなくなりました。これは、メインスレッドでのディスク読み込み（非常に短時間であっても）を避けるためです。これは `ImageRequest.Builder.addLastModifiedToFileCacheKey(true)` または `ImageLoader.Builder.addLastModifiedToFileCacheKey(true)` で再有効化できます。
-   意図しないOOM（メモリ不足エラー）を防ぐため、出力画像サイズは4096x4096ピクセル未満に制限されるようになりました。これは `ImageLoader/ImageRequest.Builder.maxBitmapSize` で設定できます。この動作を無効にするには、`maxBitmapSize` を `Size.ORIGINAL` に設定します。
-   Coil 2 の `Parameters` API は `Extras` に置き換えられました。`Extras` は文字列キーを必要とせず、代わりに同一性等価性に依存します。`Extras` はメモリキャッシュキーの変更をサポートしていません。代わりに、追加情報がメモリキャッシュキーに影響する場合は `ImageRequest.memoryCacheKeyExtra` を使用してください。
-   多くの `ImageRequest.Builder` 関数は、マルチプラットフォームをより容易にサポートするために拡張関数になりました。

    ```