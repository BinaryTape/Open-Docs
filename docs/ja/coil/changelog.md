# 変更履歴

## [3.3.0] - 2025年7月22日

- **新機能**: アプリがバックグラウンドにある間、Androidで`MemoryCache.maxSize`を制限する新しいAPIを導入しました。
    - `ImageLoader.Builder.memoryCacheMaxSizePercentWhileInBackground`が設定されている場合、アプリがバックグラウンドにある間、`ImageLoader`のメモリキャッシュはその最大サイズの一定の割合に制限されます。この設定は現在、デフォルトで無効になっています。
    - アプリがバックグラウンドにあるときに、メモリキャッシュから画像がトリミングされ、制限された最大サイズに達します。ただし、最近トリミングされた画像へのメモリキャッシュの弱参照（weak references）は影響を受けません。これは、画像が現在他の場所で参照されている場合（例: `AsyncImage`、`ImageView`など）、メモリキャッシュに引き続き存在することを意味します。
    - このAPIは、バックグラウンドでのメモリ使用量を削減し、アプリが強制終了されるのを防ぎ、ユーザーのデバイスのメモリ負荷を軽減するのに役立ちます。
- **新機能**: `SvgDecoder`に`Svg.Parser`引数を追加しました。
    - これにより、デフォルトのSVGパーサーがニーズに合わない場合、カスタムのSVGパーサーを使用できるようになります。
- `SvgDecoder`に`density`引数を追加し、カスタムの密度乗数を指定できるようにしました。
- `Uri.Builder`を追加し、`Uri`のコピーと変更をサポートしました。
- `ImageLoader.Builder.mainCoroutineContext`を追加し、テストでCoilの`Dispatchers.main.immediate`の使用をオーバーライドできるようにしました。
- `CrossfadePainter.intrinsicSize`が、アニメーションの最後に`start`画像が参照解除されたときに変更される問題を修正しました。これは`CrossfadeDrawable`の動作と一致します。
- `ImageLoaders.executeBlocking`がJavaからアクセスできない問題を修正しました。
- `coil-network-ktor3`で`kotlinx.io`のOkio相互運用モジュールを使用するようにしました。
- `kotlinx-datetime`を`0.7.1`に更新しました。
    - このリリースには、`coil-network-cache-control`モジュールのみに影響するバイナリ互換性のない変更が含まれています。詳細については[こちら](https://github.com/Kotlin/kotlinx-datetime?tab=readme-ov-file#deprecation-of-instant)を参照してください。
- Kotlinを2.2.0に更新しました。
- Composeを1.8.2に更新しました。
- Okioを3.15.0に更新しました。
- Skikoを0.9.4.2に更新しました。

## [3.2.0] - 2025年5月13日

`3.1.0`からの変更点:

- **重要**: `coil-compose`と`coil-compose-core`は、Compose `1.8.0`がJava 11のバイトコードを要求するため、Java 11のバイトコードを必要とするようになりました。有効にする方法については[こちら](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11)を参照してください。
- `AsyncImagePreviewHandler`の関数型コンストラクタが、`AsyncImagePainter.State.Loading`ではなく`AsyncImagePainter.State.Success`を返すように変更しました。
- `ConstraintsSizeResolver#size()`におけるキャンセルを修正しました。
- R8でビルドする際の`PlatformContext`の欠落に関する警告を修正しました。
- デフォルトの`FakeImageLoaderEngine`のレスポンスが返されたときに、`FakeImageLoaderEngine`が`Transition.Factory.NONE`を設定しない問題を修正しました。
- `ColorImage`から実験的アノテーションを削除しました。
- `CacheControlCacheStrategy`でネットワークヘッダーを遅延的にパースするようにしました。
- `CircleCropTransformation`と`RoundedCornersTransformation`をリファクタリングし、共通のコードを共有するようにしました。
- `ExifOrientationStrategy`が`RESPECT_PERFORMANCE`ではない場合、内部で`BitmapFactory`を使用するようにフォールバックしました。
- Kotlinを2.1.20に更新しました。
- Composeを1.8.0に更新しました。
- Okioを3.11.0に更新しました。
- Skikoを0.9.4に更新しました。
- Coroutinesを1.10.2に更新しました。
- `accompanist-drawablepainter`を0.37.3に更新しました。

`3.2.0-rc02`からの変更点:

- `ExifOrientationStrategy`が`RESPECT_PERFORMANCE`ではない場合、内部で`BitmapFactory`を使用するようにフォールバックしました。
- Composeを1.8.0に更新しました。
- `accompanist-drawablepainter`を0.37.3に更新しました。

## [3.2.0-rc02] - 2025年4月26日

- 非JVMターゲットで`KtorNetworkFetcherFactory`（Ktor 3）を使用して画像をロードする際に、`ClosedByteChannelException`で画像リクエストが失敗する問題を修正しました。

## [3.2.0-rc01] - 2025年4月24日

- **重要**: `coil-compose`と`coil-compose-core`は、Compose `1.8.0`がJava 11のバイトコードを要求するため、Java 11のバイトコードを必要とするようになりました。有効にする方法については[こちら](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8-or-java-11)を参照してください。
- `AsyncImagePreviewHandler`の関数型コンストラクタが、`AsyncImagePainter.State.Loading`ではなく`AsyncImagePainter.State.Success`を返すように変更しました。
- `ConstraintsSizeResolver#size()`におけるキャンセルを修正しました。
- R8でビルドする際の`PlatformContext`の欠落に関する警告を修正しました。
- デフォルトの`FakeImageLoaderEngine`のレスポンスが返されたときに、`FakeImageLoaderEngine`が`Transition.Factory.NONE`を設定しない問題を修正しました。
- `ColorImage`から実験的アノテーションを削除しました。
- `CacheControlCacheStrategy`でネットワークヘッダーを遅延的にパースするようにしました。
- `CircleCropTransformation`と`RoundedCornersTransformation`をリファクタリングし、共通のコードを共有するようにしました。
- `coil-network-ktor2`と`coil-network-ktor3`で`kotlinx.io`のOkio相互運用モジュールを使用するようにしました。
- Kotlinを2.1.20に更新しました。
- Composeを1.8.0-rc01に更新しました。
- Okioを3.11.0に更新しました。
- Skikoを0.9.4に更新しました。
- Coroutinesを1.10.2に更新しました。

## [3.1.0] - 2025年2月4日

- `AsyncImage`のパフォーマンスを改善しました。
    - コンポーザブルがインスタンス化されるか再利用されるかによって、実行時パフォーマンスが25%から40%改善されました。アロケーションも35%から48%削減されました。詳細については[こちら](https://github.com/coil-kt/coil/pull/2795)を参照してください。
- `ColorImage`を追加し、`FakeImage`を非推奨にしました。
    - `ColorImage`は、テストやプレビューで偽の値を返すのに便利です。`FakeImage`と同じユースケースを解決しますが、`coil-test`ではなく`coil-core`でより簡単にアクセスできます。
- `coil-compose-core`の`Dispatchers.Main.immedate`への依存を削除しました。
    - これにより、`AsyncImagePainter`がPaparazziおよびRoborazziのスクリーンショットテストで`ImageRequest`を同期的に実行しないケースも修正されました。
- `data:[<mediatype>][;base64],<data>`形式の[データURI](https://www.ietf.org/rfc/rfc2397.txt)のサポートを追加しました。
- GIFのメタデータでエンコードされた繰り返し回数を使用するために、`AnimatedImageDecoder.ENCODED_LOOP_COUNT`を追加しました。
- カスタム拡張をサポートするために、`NetworkRequest`に`Extras`を追加しました。
- `DiskCache.Builder.cleanupCoroutineContext`を追加し、`DiskCache.Builder.cleanupDispatcher`を非推奨にしました。
- API 29以上で`android.graphics.ImageDecoder`の使用をオプションで無効にするために、`ImageLoader.Builder.imageDecoderEnabled`を追加しました。
- `ImageRequest`のデータ型に登録された`Keyer`がない場合、警告をログ出力するようにしました。
- `CrossfadePainter`を公開しました。
- すべてのマルチプラットフォームターゲットで`Transformation`をサポートしました。
- `CacheControlCacheStrategy`で`Expires`ヘッダー値として0をサポートしました。
- `AsyncImage`/`SubcomposeAsyncImage`/`rememberAsyncImage`が、`ContentScale`が`None`に変更された場合に新しい`ImageRequest`を起動しない問題を修正しました。
- Kotlinを2.1.10に更新しました。
    - 注: このリリースでは、[LLVMの更新](https://kotlinlang.org/docs/whatsnew21.html#llvm-update-from-11-1-0-to-16-0-0)により、Kotlin Nativeを使用する場合、Kotlin 2.1.0以降でのコンパイルが必要です。
- Composeを1.7.3に更新しました。
- `androidx.core`を1.15.0に更新しました。

## [3.0.4] - 2024年11月25日

- Android Studioのプレビューでベクタードローアブルがレンダリングされない問題を修正しました。
- `maxBitmapSize`を超えるリクエストに対するメモリキャッシュミスの可能性を修正しました。
- Androidで`FakeImage`がレンダリングされない問題を修正しました。
- `AsyncImage`/`rememberAsyncImagePainter`/`SubcomposeAsyncImage`と一緒に使用した場合、リクエストの`Transformation`が変更されたときに新しい画像リクエストが起動しない問題を修正しました。
- `ScaleDrawable`と`CrossfadeDrawable`がtintの状態を尊重しない問題を修正しました。
- `ImageDecoder`が部分的な画像ソースをデコードできるようにしました。これは`BitmapFactory`の動作と一致します。
- デコード後に`Bitmap.prepareToDraw()`が呼び出されない問題を修正しました。
- `SvgDecoder`は、非ラスター化画像に対して`isSampled = true`を返すべきではありません。
- Composeで即時メインディスパッチャーが利用できない場合、`Dispatchers.Unconfined`を使用するようにフォールバックしました。これはプレビュー/テスト環境でのみ使用されます。
- Ktor 2を`2.3.13`に更新しました。

## [3.0.3] - 2024年11月14日

- `ImageView`の`ScaleType`に基づいて`ImageRequest.scale`を設定する問題を修正しました。
- `DiskCache`がファイル削除後のエントリの削除を正しく追跡しないエッジケースを修正しました。
- エラーをログ出力する際に、`Logger`にthrowableを渡すようにしました。
- `kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`を`kotlin-stdlib`で置き換えないようにしました。

## [3.0.2] - 2024年11月9日

- Androidでカスタムの`CacheStrategy`を指定して`OkHttpNetworkFetcherFactory`を呼び出すとクラッシュする問題を修正しました。
- `CacheControlCacheStrategy`がキャッシュエントリの経過時間を誤って計算する問題を修正しました。
- `ImageRequest.bitmapConfig`が`ARGB_8888`または`HARDWARE`であった場合に、API 28以上でのみ尊重される問題を修正しました。

## [3.0.1] - 2024年11月7日

- ハードウェアビットマップを基盤とする`BitmapImage`で`Image.toBitmap`を呼び出すとクラッシュする問題を修正しました。
- `AsyncImageModelEqualityDelegate.Default`が非`ImageRequest`モデルに対して等価性を誤って比較する問題を修正しました。

## [3.0.0] - 2024年11月4日

Coil 3.0.0は、[Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)を完全にサポートするCoilの次のメジャーリリースです。

[3.0.0における改善点と重要な変更点の完全なリストについては、アップグレードガイド](https://coil-kt.github.io/coil/upgrading_to_coil3/)をご覧ください。

`3.0.0-rc02`からの変更点:

- 残りの非推奨メソッドを削除しました。

## [3.0.0-rc02] - 2024年10月28日

[3.xにおける改善点と重要な変更点の完全なリストについては、アップグレードガイド](https://coil-kt.github.io/coil/upgrading_to_coil3/)をご覧ください。`3.0.0-rc01`からの変更点:

- `BlackholeDecoder`を追加しました。これにより、[ディスクキャッシュのみのプリロード](https://coil-kt.github.io/coil/faq/#how-do-i-preload-an-image)が簡素化されます。
- `ConstraintsSizeResolver`と`DrawScopeSizeResolver`の`remember`関数を追加しました。
- `AsyncImage`の引数から`EqualityDelegate`を削除しました。代わりに、`LocalAsyncImageModelEqualityDelegate`を通じて設定されるべきです。
- 親コンポーザブルが`IntrinsicSize`を使用している場合に`AsyncImage`がレンダリングされない問題を修正しました。
- `AsyncImagePainter`に子ペインタがない場合、`AsyncImage`が利用可能な制約を満たす問題を修正しました。
- `EqualityDelegate`が無視されたために、`rememberAsyncImagePainter`がその状態が監視されると無限に再コンポーズされる問題を修正しました。
- 特殊文字を含む`File`/`Path`パスのパースを修正しました。
- `VideoFrameDecoder`でカスタムの`FileSystem`実装を使用する問題を修正しました。
- Ktorを`3.0.0`に更新しました。
- `androidx.annotation`を`1.9.0`に更新しました。

## [3.0.0-rc01] - 2024年10月8日

[3.xにおける改善点と重要な変更点の完全なリストについては、アップグレードガイド](https://coil-kt.github.io/coil/upgrading_to_coil3/)をご覧ください。`3.0.0-alpha10`からの変更点:

- **破壊的変更**: `addLastModifiedToFileCacheKey`をデフォルトで無効にし、リクエストごとに設定できるようにしました。同じフラグでこの動作を再度有効にすることができます。
- **新機能**: 新しい`coil-network-cache-control`アーティファクトを導入しました。これは、[`Cache-Control`ヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)のサポートを実装します。
- **新機能**: `SvgDecoder.Factory`に`scaleToDensity`プロパティを追加しました。このプロパティは、固有の寸法を持つSVGがデバイスの密度（Androidのみでサポート）で乗算されることを保証します。
- `ExifOrientationPolicy`を`ExifOrientationStrategy`に名前変更しました。
- `MemoryCache`から共有できない画像を削除しました。
- `ConstraintsSizeResolver`を公開しました。
- `setSingletonImageLoaderFactory`を安定化しました。
- `coil-network-ktor3`で最適化されたJVM I/O関数を復元しました。
- MIMEタイプリストに`pdf`を追加しました。
- コンパイルSDKを35に更新しました。
- Kotlinを2.0.20に更新しました。
- Okioを3.9.1に更新しました。

## [3.0.0-alpha10] - 2024年8月7日

- **破壊的変更**: `ImageLoader.Builder.networkObserverEnabled`を`NetworkFetcher`用の`ConnectivityChecker`インターフェースに置き換えました。
    - ネットワークオブザーバーを無効にするには、`KtorNetworkFetcherFactory`/`OkHttpNetworkFetcherFactory`のコンストラクタに`ConnectivityChecker.ONLINE`を渡します。
- **新機能**: すべてのプラットフォームで[Compose Multiplatformリソース](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-images-resources.html)の読み込みをサポートしました。リソースをロードするには、`Res.getUri`を使用します。

```kotlin
AsyncImage(
    model = Res.getUri("drawable/image.jpg"),
    contentDescription = null,
)
```

- `ImageLoader`と`ImageRequest`に`maxBitmapSize`プロパティを追加しました。
    - このプロパティはデフォルトで4096x4096であり、アロケートされたビットマップの寸法に安全な上限を提供します。これは、`Size.ORIGINAL`で非常に大きな画像を誤ってロードし、メモリ不足例外を引き起こすのを防ぐのに役立ちます。
- `ExifOrientationPolicy`をカスタムポリシーをサポートするインターフェースに変換しました。
- Windowsのファイルパスの`Uri`処理を修正しました。
- `Image` APIから`@ExperimentalCoilApi`を削除しました。
- Kotlinを2.0.10に更新しました。

## [3.0.0-alpha09] - 2024年7月23日

- **破壊的変更**: `io.coil-kt.coil3:coil-network-ktor`アーティファクトを`io.coil-kt.coil3:coil-network-ktor2`に名前変更しました。これはKtor 2.xに依存します。さらに、`io.coil-kt.coil3:coil-network-ktor3`を導入しました。これはKtor 3.xに依存します。`wasmJs`のサポートはKtor 3.xでのみ利用可能です。
- **新機能**: `AsyncImagePainter.restart()`を追加し、画像リクエストを手動で再開できるようにしました。
- `NetworkClient`および関連クラスから`@ExperimentalCoilApi`を削除しました。
- `ImageRequest`を最適化し、不要な`Extras`と`Map`のアロケーションを回避しました。

## [2.7.0] - 2024年7月17日

- `ImageLoader.execute`、`AsyncImage`、`SubcomposeAsyncImage`、および`rememberAsyncImagePainter`のパフォーマンスを向上させるために、内部コルーチンの使用をわずかに最適化しました。([#2205](https://github.com/coil-kt/coil/pull/2205))
- チャンク化されたレスポンスに対する重複したネットワーク呼び出しを修正しました。([#2363](https://github.com/coil-kt/coil/pull/2363))
- Kotlinを2.0.0に更新しました。
- Compose UIを1.6.8に更新しました。
- Okioを3.9.0に更新しました。

## [3.0.0-alpha08] - 2024年7月8日

- **破壊的変更**: `ImageRequest`と`ImageLoader`の`dispatcher`メソッドを`coroutineContext`に名前変更しました。たとえば、`ImageRequest.Builder.dispatcher`は`ImageRequest.Builder.coroutineContext`になりました。メソッドが任意の`CoroutineContext`を受け入れ、もはや`Dispatcher`を必要としないため、名前が変更されました。
- 修正: 競合状態により発生する可能性のある`IllegalStateException: Reading a state that was created after the snapshot was taken or in a snapshot that has not yet been applied`を修正しました。
    - 注: これにより、`Dispatchers.Main.immediate`へのソフトな依存関係が再導入されます。結果として、JVMで[`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/)への依存関係を再追加する必要があります。インポートされない場合、`ImageRequest`はすぐにディスパッチされず、`ImageRequest.placeholder`を設定するまで、またはメモリキャッシュから解決するまでに1フレームの遅延が発生します。

## [3.0.0-alpha07] - 2024年6月26日

- **破壊的変更**: `AsyncImagePainter`はデフォルトで`onDraw`を待たなくなり、代わりに`Size.ORIGINAL`を使用します。
    - これにより、[Roborazzi/Paparazziとの互換性の問題](https://github.com/coil-kt/coil/issues/1910)が修正され、全体的なテストの信頼性が向上します。
    - `onDraw`を待つ以前の動作に戻すには、`ImageRequest.sizeResolver`として`DrawScopeSizeResolver`を設定してください。
- **破壊的変更**: マルチプラットフォーム`Image` APIをリファクタリングしました。特に、`asCoilImage`が`asImage`に名前変更されました。
- **破壊的変更**: `AsyncImagePainter.state`が`StateFlow<AsyncImagePainter.State>`に変更されました。その値を監視するには`collectAsState`を使用してください。これによりパフォーマンスが向上します。
- **破壊的変更**: `AsyncImagePainter.imageLoader`と`AsyncImagePainter.request`が`StateFlow<AsyncImagePainter.Inputs>`に統合されました。その値を監視するには`collectAsState`を使用してください。これによりパフォーマンスが向上します。
- **破壊的変更**: リソース縮小の最適化を妨げるため、`android.resource://example.package.name/drawable/image` URIのサポートを削除しました。
    - その機能がまだ必要な場合は、[コンポーネントレジストリに`ResourceUriMapper`を手動で含める](https://github.com/coil-kt/coil/blob/main/coil-core/src/androidInstrumentedTest/kotlin/coil3/map/ResourceUriMapper.kt)ことができます。
- **新機能**: `AsyncImagePreviewHandler`を導入し、`AsyncImagePainter`のプレビューレンダリング動作を制御できるようにしました。
    - プレビュー動作をオーバーライドするには、`LocalAsyncImagePreviewHandler`を使用してください。
    - この変更および他の`coil-compose`の改善の一環として、`AsyncImagePainter`はデフォルトで`ImageRequest.placeholder`を表示する代わりに、`ImageRequest`の実行を試みるようになりました。プレビュー環境では[ネットワークまたはファイルを使用するリクエストは失敗することが予想されます](https://developer.android.com/develop/ui/compose/tooling/previews#preview-limitations)が、Androidリソースは動作するはずです。
- **新機能**: フレームインデックスによるビデオ画像抽出をサポートしました。([#2183](https://github.com/coil-kt/coil/pull/2183))
- **新機能**: 任意の`CoroutineDispatcher`メソッドに`CoroutineContext`を渡すのをサポートしました。([#2241](https://github.com/coil-kt/coil/pull/2241))。
- **新機能**: JSおよびWASM JSで弱参照メモリキャッシュをサポートしました。
- Composeで`Dispatchers.Main.immediate`にディスパッチしないようにしました。副作用として、JVMでは[`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/)をインポートする必要がなくなりました。
- パフォーマンス向上のため、`async`を呼び出してComposeでディスポーザブルを作成しないようにしました（@mlykotomに感謝！）。([#2205](https://github.com/coil-kt/coil/pull/2205))
- グローバルな`ImageLoader`のextrasを`Options`に渡す問題を修正しました。([#2223](https://github.com/coil-kt/coil/pull/2223))
- 非Androidターゲットで`crossfade(false)`が機能しない問題を修正しました。
- VP8X機能フラグのバイトオフセットを修正しました。([#2199](https://github.com/coil-kt/coil/pull/2199))。
- 非Androidターゲット上の`SvgDecoder`を、描画時に画像をレンダリングする代わりにビットマップにレンダリングするように変換しました。これによりパフォーマンスが向上します。
    - この動作は`SvgDecoder(renderToBitmap)`を使用して制御できます。
- `ScaleDrawable`を`coil-gif`から`coil-core`に移動しました。
- Kotlinを2.0.0に更新しました。
- Composeを1.6.11に更新しました。
- Okioを3.9.0に更新しました。
- Skikoを0.8.4に更新しました。
- [3.xにおける重要な変更点の完全なリストについては、アップグレードガイドをご覧ください。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha06] - 2024年2月29日

- Skikoを0.7.93にダウングレードしました。
- [3.xにおける重要な変更点の完全なリストについては、アップグレードガイドをご覧ください。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha05] - 2024年2月28日

- **新機能**: `wasmJs`ターゲットをサポートしました。
- 非Androidプラットフォームで`Bitmap`にバックアップされていない`Image`を描画するために、`DrawablePainter`と`DrawableImage`を作成しました。
    - `Image` APIは実験的であり、アルファリリース間で変更される可能性があります。
- `ContentPainterModifier`を`Modifier.Node`を実装するように更新しました。
- 修正: コンポーネントコールバックとネットワークオブザーバーの登録をバックグラウンドスレッドで遅延的に行いました。これにより、通常メインスレッドで発生していた初期化の遅延が解消されます。
- 修正: `ImageLoader.Builder.placeholder/error/fallback`が`ImageRequest`によって使用されない問題を修正しました。
- Composeを1.6.0に更新しました。
- Coroutinesを1.8.0に更新しました。
- Okioを3.8.0に更新しました。
- Skikoを0.7.94に更新しました。
- [3.xにおける重要な変更点の完全なリストについては、アップグレードガイドをご覧ください。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [2.6.0] - 2024年2月23日

- `rememberAsyncImagePainter`、`AsyncImage`、`SubcomposeAsyncImage`を[再起動可能でスキップ可能](https://developer.android.com/jetpack/compose/performance/stability#functions)にしました。これにより、コンポーザブルの引数が変更されない限り、再コンポーズを回避することでパフォーマンスが向上します。
    - `rememberAsyncImagePainter`、`AsyncImage`、および`SubcomposeAsyncImage`にオプションの`modelEqualityDelegate`引数を追加しました。これは、`model`が再コンポーズをトリガーするかどうかを制御するためです。
- `ContentPainterModifier`を`Modifier.Node`を実装するように更新しました。
- 修正: コンポーネントコールバックとネットワークオブザーバーの登録をバックグラウンドスレッドで遅延的に行いました。これにより、通常メインスレッドで発生していた初期化の遅延が解消されます。
- 修正: `rememberAsyncImagePainter`、`AsyncImage`、および`SubcomposeAsyncImage`で`ImageRequest.listener`または`ImageRequest.target`が変更された場合、新しい画像リクエストを再起動しないようにしました。
- 修正: `AsyncImagePainter`で画像リクエストを2回監視しないようにしました。
- Kotlinを1.9.22に更新しました。
- Composeを1.6.1に更新しました。
- Okioを3.8.0に更新しました。
- `androidx.collection`を1.4.0に更新しました。
- `androidx.lifecycle`を2.7.0に更新しました。

## [3.0.0-alpha04] - 2024年2月1日

- **破壊的変更**: `OkHttpNetworkFetcherFactory`と`KtorNetworkFetcherFactory`の公開APIから`Lazy`を削除しました。
- `OkHttpNetworkFetcherFactory`で`OkHttpClient`の代わりに`Call.Factory`を公開しました。
- `NetworkResponseBody`を`ByteString`をラップするように変換しました。
- Composeを1.5.12にダウングレードしました。
- [重要な変更点の完全なリストについては、アップグレードガイドをご覧ください。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha03] - 2024年1月20日

- **破壊的変更**: `coil-network`が`coil-network-ktor`に名前変更されました。さらに、OkHttpに依存し、Ktorエンジンを指定する必要のない新しい`coil-network-okhttp`アーティファクトが追加されました。
    - インポートするアーティファクトに応じて、`KtorNetworkFetcherFactory`または`OkHttpNetworkFetcherFactory`を使用して`Fetcher.Factory`を手動で参照できます。
- Appleプラットフォームでの`NSUrl`のロードに対応しました。
- `AsyncImage`に`clipToBounds`パラメータを追加しました。
- [重要な変更点の完全なリストについては、アップグレードガイドをご覧ください。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha02] - 2024年1月10日

- **破壊的変更**: `coil-gif`、`coil-network`、`coil-svg`、`coil-video`のパッケージが更新され、すべてのクラスがそれぞれ`coil.gif`、`coil.network`、`coil.svg`、`coil.video`の一部になりました。これにより、他のアーティファクトとのクラス名衝突を回避できます。
- **破壊的変更**: `ImageDecoderDecoder`が`AnimatedImageDecoder`に名前変更されました。
- **新機能**: `coil-gif`、`coil-network`、`coil-svg`、`coil-video`のコンポーネントが、各`ImageLoader`の`ComponentRegistry`に自動的に追加されるようになりました。
    - 明確にするために、`3.0.0-alpha01`とは異なり、**`NetworkFetcher.Factory()`を手動で`ComponentRegistry`に追加する必要はありません**。`io.coil-kt.coil3:coil-network:[version]`と[Ktorエンジン](https://ktor.io/docs/http-client-engines.html#dependencies)をインポートするだけで、ネットワーク画像をロードするのに十分です。
    - これらのコンポーネントを`ComponentRegistry`に手動で追加することも安全です。手動で追加されたコンポーネントは、自動的に追加されるコンポーネントよりも優先されます。
    - 優先する場合は、`ImageLoader.Builder.serviceLoaderEnabled(false)`を使用してこの動作を無効にできます。
- **新機能**: すべてのプラットフォームで`coil-svg`をサポートしました。Androidでは[AndroidSVG](https://bigbadaboom.github.io/androidsvg/)、非Androidプラットフォームでは[SVGDOM](https://api.skia.org/classSkSVGDOM.html)によってサポートされています。
- Coilは内部でAndroidの[`ImageDecoder`](https://developer.android.com/reference/android/graphics/ImageDecoder) APIを使用するようになりました。これは、ファイル、リソース、またはコンテンツURIから直接デコードする際にパフォーマンス上の利点があります。
- 修正: 複数の`coil3.Uri`パースに関する修正。
- [重要な変更点の完全なリストについては、アップグレードガイドをご覧ください。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [3.0.0-alpha01] - 2023年12月30日

- **新機能**: [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)のサポート。CoilはAndroid、JVM、iOS、macOS、JavaScriptをサポートするKotlin Multiplatformライブラリになりました。
- CoilのMaven座標が`io.coil-kt.coil3`に更新され、そのインポートが`coil3`に更新されました。これにより、Coil 3をCoil 2とバイナリ互換性の問題なく並行して実行できます。例えば、`io.coil-kt:coil:[version]`は`io.coil-kt.coil3:coil:[version]`になりました。
- `coil-base`および`coil-compose-base`アーティファクトは、Coroutines、Ktor、およびAndroidXで使用される命名規則に合わせるため、それぞれ`coil-core`および`coil-compose-core`に名前変更されました。
- [重要な変更点の完全なリストについては、アップグレードガイドをご覧ください。](https://coil-kt.github.io/coil/upgrading_to_coil3/)

## [2.5.0] - 2023年10月30日

- **新機能**: `MediaDataSourceFetcher.Factory`を追加し、`coil-video`で`MediaDataSource`実装のデコードをサポートしました。([#1795](https://github.com/coil-kt/coil/pull/1795))
- `SHIFT6m`デバイスをハードウェアビットマップのブラックリストに追加しました。([#1812](https://github.com/coil-kt/coil/pull/1812))
- 修正: 一辺が境界なしのサイズを返すペインタを防ぐようにしました。([#1826](https://github.com/coil-kt/coil/pull/1826))
- 修正: キャッシュされたヘッダーに非ASCII文字が含まれている場合、`304 Not Modified`後にディスクキャッシュのロードが失敗する問題を修正しました。([#1839](https://github.com/coil-kt/coil/pull/1839))
- 修正: `FakeImageEngine`がインターセプタチェーンのリクエストを更新しない問題を修正しました。([#1905](https://github.com/coil-kt/coil/pull/1905))
- コンパイルSDKを34に更新しました。
- Kotlinを1.9.10に更新しました。
- Coroutinesを1.7.3に更新しました。
- `accompanist-drawablepainter`を0.32.0に更新しました。
- `androidx.annotation`を1.7.0に更新しました。
- `androidx.compose.foundation`を1.5.4に更新しました。
- `androidx.core`を1.12.0に更新しました。
- `androidx.exifinterface:exifinterface`を1.3.6に更新しました。
- `androidx.lifecycle`を2.6.2に更新しました。
- `com.squareup.okhttp3`を4.12.0に更新しました。
- `com.squareup.okio`を3.6.0に更新しました。

## [2.4.0] - 2023年5月21日

- `DiskCache`の`get`/`edit`を`openSnapshot`/`openEditor`に名前変更しました。
- `AsyncImagePainter`で`ColorDrawable`を`ColorPainter`に自動変換しないようにしました。
- シンプルな`AsyncImage`オーバーロードに`@NonRestartableComposable`アノテーションを付けました。
- 修正: `ImageSource`で`Context.cacheDir`を遅延呼び出しするようにしました。
- 修正: `coil-bom`の公開を修正しました。
- 修正: ハードウェアビットマップが無効な場合、常にビットマップ設定を`ARGB_8888`に設定する問題を修正しました。
- Kotlinを1.8.21に更新しました。
- Coroutinesを1.7.1に更新しました。
- `accompanist-drawablepainter`を0.30.1に更新しました。
- `androidx.compose.foundation`を1.4.3に更新しました。
- `androidx.profileinstaller:profileinstaller`を1.3.1に更新しました。
- `com.squareup.okhttp3`を4.11.0に更新しました。

## [2.3.0] - 2023年3月25日

- **新機能**: `FakeImageLoaderEngine`を含む新しい`coil-test`アーティファクトを導入しました。このクラスは、テストで一貫性のある同期的な（メインスレッドからの）応答を保証するために、画像ローダーの応答をハードコーディングするのに役立ちます。詳細については[こちら](https://coil-kt.github.io/coil/testing)を参照してください。
- **新機能**: `coil-base`（`coil`の子モジュール）と`coil-compose-base`（`coil-compose`の子モジュール）に[ベースラインプロファイル](https://developer.android.com/topic/performance/baselineprofiles/overview)を追加しました。
    - これにより、Coilの実行時パフォーマンスが向上し、アプリでのCoilの使用方法に応じて[フレームタイミングが改善される](https://github.com/coil-kt/coil/tree/main/coil-benchmark/benchmark_output.md)はずです。
- 修正: エンコードされたデータを含む`file://` URIのパースを修正しました。 [#1601](https://github.com/coil-kt/coil/pull/1601)
- 修正: `DiskCache`が、存在しないディレクトリを渡された場合でも最大サイズを正しく計算するように修正しました。 [#1620](https://github.com/coil-kt/coil/pull/1620)
- `Coil.reset`を公開APIにしました。 [#1506](https://github.com/coil-kt/coil/pull/1506)
- Javaデフォルトメソッド生成を有効にしました。 [#1491](https://github.com/coil-kt/coil/pull/1491)
- Kotlinを1.8.10に更新しました。
- `accompanist-drawablepainter`を0.30.0に更新しました。
- `androidx.annotation`を1.6.0に更新しました。
- `androidx.appcompat:appcompat-resources`を1.6.1に更新しました。
- `androidx.compose.foundation`を1.4.0に更新しました。
- `androidx.core`を1.9.0に更新しました。
- `androidx.exifinterface:exifinterface`を1.3.6に更新しました。
- `androidx.lifecycle`を2.6.1に更新しました。
- `okio`を3.3.0に更新しました。

## [2.2.2] - 2022年10月1日

- システムコールバックを登録する前に、画像ローダーが完全に初期化されていることを確認するようにしました。 [#1465](https://github.com/coil-kt/coil/pull/1465)
- API 30以上で`VideoFrameDecoder`で推奨ビットマップ設定を設定するようにしました。 [#1487](https://github.com/coil-kt/coil/pull/1487)
- `FileUriMapper`で`#`を含むパスのパースを修正しました。 [#1466](https://github.com/coil-kt/coil/pull/1466)
- ディスクキャッシュから非ASCIIヘッダーを持つ応答を読み取る問題を修正しました。 [#1468](https://github.com/coil-kt/coil/pull/1468)
- アセットのサブフォルダ内のビデオをデコードする問題を修正しました。 [#1489](https://github.com/coil-kt/coil/pull/1489)
- `androidx.annotation`を1.5.0に更新しました。

## [2.2.1] - 2022年9月8日

- 修正: `RoundedCornersTransformation`が`input`ビットマップを正しくスケーリングするようになりました。
- `kotlin-parcelize`プラグインへの依存関係を削除しました。
- コンパイルSDKを33に更新しました。
- `androidx.appcompat:appcompat-resources`を1.4.2にダウングレードし、[#1423](https://github.com/coil-kt/coil/issues/1423)の回避策としました。

## [2.2.0] - 2022年8月16日

- **新機能**: `coil-video`に`ImageRequest.videoFramePercent`を追加し、ビデオの持続時間の割合としてビデオフレームを指定できるようにしました。
- **新機能**: `ExifOrientationPolicy`を追加し、`BitmapFactoryDecoder`がEXIFオリエンテーションデータをどのように処理するかを設定できるようにしました。
- 修正: 未定義の寸法を持つサイズが渡された場合に`RoundedCornersTransformation`で例外をスローしないようにしました。
- 修正: GIFのフレーム遅延を1バイトの符号付きバイトではなく、2バイトの符号なしバイトとして読み取るようにしました。
- Kotlinを1.7.10に更新しました。
- Coroutinesを1.6.4に更新しました。
- Composeを1.2.1に更新しました。
- OkHttpを4.10.0に更新しました。
- Okioを3.2.0に更新しました。
- `accompanist-drawablepainter`を0.25.1に更新しました。
- `androidx.annotation`を1.4.0に更新しました。
- `androidx.appcompat:appcompat-resources`を1.5.0に更新しました。
- `androidx.core`を1.8.0に更新しました。

## [2.1.0] - 2022年5月17日

- **新機能**: `ByteArray`のロードに対応しました。([#1202](https://github.com/coil-kt/coil/pull/1202))
- **新機能**: `ImageRequest.Builder.css`を使用してSVGにカスタムCSSルールを設定するのをサポートしました。([#1210](https://github.com/coil-kt/coil/pull/1210))
- 修正: `GenericViewTarget`のプライベートメソッドをprotectedに変換しました。([#1273](https://github.com/coil-kt/coil/pull/1273))
- コンパイルSDKを32に更新しました。([#1268](https://github.com/coil-kt/coil/pull/1268))

## [2.0.0] - 2022年5月10日

Coil 2.0.0はライブラリのメジャーイテレーションであり、破壊的変更を含みます。アップグレード方法については[アップグレードガイド](https://coil-kt.github.io/coil/upgrading/)をご覧ください。

- **新機能**: `coil-compose`に`AsyncImage`を導入しました。詳細については[ドキュメント](https://coil-kt.github.io/coil/compose/)をご覧ください。

```kotlin
// ネットワークから画像を表示します。
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)

// ネットワークからプレースホルダー、円形トリミング、クロスフェードアニメーション付きで画像を表示します。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    placeholder = painterResource(R.drawable.placeholder),
    contentDescription = stringResource(R.string.description),
    contentScale = ContentScale.Crop,
    modifier = Modifier.clip(CircleShape)
)
```

- **新機能**: 公開`DiskCache` APIを導入しました。
    - `ImageLoader.Builder.diskCache`と`DiskCache.Builder`を使用してディスクキャッシュを設定します。
    - Coil 2.0ではOkHttpの`Cache`を使用すべきではありません。詳細については[こちら](https://coil-kt.github.io/coil/upgrading_to_coil2/#disk-cache)をご覧ください。
    - `Cache-Control`およびその他のキャッシュヘッダーは引き続きサポートされます。ただし、`Vary`ヘッダーはキャッシュがURLの一致のみをチェックするため除きます。さらに、応答コードが[200..300)の範囲にある応答のみがキャッシュされます。
    - 2.0にアップグレードする際に、既存のディスクキャッシュはクリアされます。
- 最小サポートAPIが21になりました。
- `ImageRequest`のデフォルトの`Scale`が`Scale.FIT`になりました。
    - これは、`ImageRequest.scale`をデフォルトの`Scale`を持つ他のクラスと一致させるために変更されました。
    - `ImageViewTarget`を持つリクエストは、引き続き`Scale`が自動検出されます。
- 画像パイプラインクラスを再設計しました。
    - `Mapper`、`Fetcher`、`Decoder`はより柔軟になるようにリファクタリングされました。
    - `Fetcher.key`は新しい`Keyer`インターフェースに置き換えられました。`Keyer`は入力データからキャッシュキーを作成します。
    - `Decoder`がOkioのファイルシステムAPIを使用して`File`を直接読み取れるように`ImageSource`を追加しました。
- Jetpack Compose統合を再設計しました。
    - `rememberImagePainter`と`ImagePainter`は、それぞれ`rememberAsyncImagePainter`と`AsyncImagePainter`に名前変更されました。
    - `LocalImageLoader`を非推奨にしました。詳細については非推奨メッセージをご覧ください。
- ランタイムのnullでないアサーションの生成を無効にしました。
    - Javaを使用している場合、nullでないとアノテーションされた引数にnullを渡しても、直ちに`NullPointerException`がスローされなくなります。Kotlinのコンパイル時のnull安全性はこれを防ぎます。
    - この変更により、ライブラリのサイズが小さくなります。
- `Size`は、その幅と高さの2つの`Dimension`値で構成されるようになりました。`Dimension`は、正のピクセル値または`Dimension.Undefined`のいずれかになります。詳細については[こちら](https://coil-kt.github.io/coil/upgrading/#size-refactor)をご覧ください。
- `BitmapPool`と`PoolableViewTarget`はライブラリから削除されました。
- `VideoFrameFileFetcher`と`VideoFrameUriFetcher`はライブラリから削除されました。代わりに、すべてのデータソースをサポートする`VideoFrameDecoder`を使用してください。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt)と[`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt)はライブラリから削除されました。使用している場合は、そのコードをプロジェクトにコピーできます。
- `Transition.transition`は、遷移が完了するまで中断する必要がなくなったため、非中断関数に変更されました。
- 進行中の`BitmapFactory`操作の最大数を制限する`bitmapFactoryMaxParallelism`のサポートを追加しました。この値はデフォルトで4であり、UIパフォーマンスを向上させます。
- `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher`、および`transformationDispatcher`のサポートを追加しました。
- 共通の`ViewTarget`ロジックを処理する`GenericViewTarget`を追加しました。
- `ByteBuffer`をデフォルトでサポートされるデータ型に追加しました。
- `Disposable`はリファクタリングされ、基になる`ImageRequest`のジョブを公開します。
- `MemoryCache` APIを再設計しました。
- `ImageRequest.error`は、`ImageRequest.fallback`がnullの場合に`Target`に設定されるようになりました。
- `Transformation.key`は`Transformation.cacheKey`に置き換えられました。
- Kotlinを1.6.10に更新しました。
- Composeを1.1.1に更新しました。
- OkHttpを4.9.3に更新しました。
- Okioを3.0.0に更新しました。

`2.0.0-rc03`からの変更点:
- `Dimension.Original`を`Dimension.Undefined`に変換しました。
    - これは、サイズシステムにおけるいくつかのエッジケース（[例](https://github.com/coil-kt/coil/issues/1246)）を修正するために、非ピクセル次元のセマンティクスをわずかに変更します。
- `ContentScale`が`None`の場合、画像を`Size.ORIGINAL`でロードするようにしました。
- `ImageView.load`ビルダー引数を最後に設定するのではなく、最初に適用する問題を修正しました。
- 応答が変更されていない場合、HTTPヘッダーを結合しない問題を修正しました。

## [2.0.0-rc03] - 2022年4月11日

- `ScaleResolver`インターフェースを削除しました。
- `Size`コンストラクタを関数に変換しました。
- `Dimension.Pixels`の`toString`がピクセル値のみを返すように変更しました。
- `SystemCallbacks.onTrimMemory`でのまれなクラッシュを防ぐようにしました。
- Coroutinesを1.6.1に更新しました。

## [2.0.0-rc02] - 2022年3月20日

- `ImageRequest`のデフォルトサイズを`Size.ORIGINAL`ではなく、現在のディスプレイのサイズに戻しました。
- `DiskCache.Builder`が実験的とマークされている問題を修正しました。`DiskCache`のメソッドのみが実験的です。
- `ImageView`に`WRAP_CONTENT`の次元を持つ画像をロードすると、境界のある次元に収まるのではなく、元のサイズで画像がロードされるケースを修正しました。
- `MemoryCache.Key`、`MemoryCache.Value`、`Parameters.Entry`からコンポーネント関数を削除しました。

## [2.0.0-rc01] - 2022年3月2日

`1.4.0`からの主な変更点:

- 最小サポートAPIが21になりました。
- Jetpack Compose統合を再設計しました。
    - `rememberImagePainter`は`rememberAsyncImagePainter`に名前変更されました。
    - `AsyncImage`と`SubcomposeAsyncImage`のサポートを追加しました。詳細については[ドキュメント](https://coil-kt.github.io/coil/compose/)をご覧ください。
    - `LocalImageLoader`を非推奨にしました。詳細については非推奨メッセージをご覧ください。
- Coil 2.0は独自のディスクキャッシュ実装を持ち、ディスクキャッシュにOkHttpに依存しなくなりました。
    - `ImageLoader.Builder.diskCache`と`DiskCache.Builder`を使用してディスクキャッシュを設定します。
    - スレッドが書き込み中に中断された場合、キャッシュが破損する可能性があるため、Coil 2.0でOkHttpの`Cache`を使用**すべきではありません**。
    - `Cache-Control`およびその他のキャッシュヘッダーは引き続きサポートされます。ただし、`Vary`ヘッダーはキャッシュがURLの一致のみをチェックするため除きます。さらに、応答コードが[200..300)の範囲にある応答のみがキャッシュされます。
    - 2.0にアップグレードする際に、既存のディスクキャッシュはクリアされます。
- `ImageRequest`のデフォルトの`Scale`が`Scale.FIT`になりました。
    - これは、`ImageRequest.scale`をデフォルトの`Scale`を持つ他のクラスと一致させるために変更されました。
    - `ImageViewTarget`を持つリクエストは、引き続き`Scale`が自動検出されます。
- `ImageRequest`のデフォルトサイズが`Size.ORIGINAL`になりました。
- 画像パイプラインクラスを再設計しました。
    - `Mapper`、`Fetcher`、`Decoder`はより柔軟になるようにリファクタリングされました。
    - `Fetcher.key`は新しい`Keyer`インターフェースに置き換えられました。`Keyer`は入力データからキャッシュキーを作成します。
    - `Decoder`がOkioのファイルシステムAPIを使用して`File`を直接読み取れるように`ImageSource`を追加しました。
- ラン