# 変更履歴

## [3.3.0] - 2025年7月22日

- **新機能**: アプリがバックグラウンドにある間、`MemoryCache.maxSize`を制限する新しいAPIを導入しました。
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

3.0.0における改善点と重要な変更点の完全なリストについては、[アップグレードガイド](https://coil-kt.github.io/coil/upgrading_to_coil3/)をご覧ください。

`3.0.0-rc02`からの変更点:

- 残りの非推奨メソッドを削除しました。

## [3.0.0-rc02] - 2024年10月28日

3.xにおける改善点と重要な変更点の完全なリストについては、[アップグレードガイド](https://coil-kt.github.io/coil/upgrading_to_coil3/)をご覧ください。`3.0.0-rc01`からの変更点:

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

3.xにおける改善点と重要な変更点の完全なリストについては、[アップグレードガイド](https://coil-kt.github.io/coil/upgrading_to_coil3/)をご覧ください。`3.0.0-alpha10`からの変更点:

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
- **新機能**: 任意の`CoroutineDispatcher`メソッドに`CoroutineContext`を渡すのをサポートしました。([#2241](https://github.com/coil-kt/coil/pull/2241))
- **新機能**: JSおよびWASM JSで弱参照メモリキャッシュをサポートしました。
- Composeで`Dispatchers.Main.immediate`にディスパッチしないようにしました。副作用として、JVMでは[`kotlinx-coroutines-swing`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-swing/)をインポートする必要がなくなりました。
- パフォーマンス向上のため、`async`を呼び出してComposeでディスポーザブルを作成しないようにしました（@mlykotomに感謝！）。([#2205](https://github.com/coil-kt/coil/pull/2205))
- グローバルな`ImageLoader`のextrasを`Options`に渡す問題を修正しました。([#2223](https://github.com/coil-kt/coil/pull/2223))
- 非Androidターゲットで`crossfade(false)`が機能しない問題を修正しました。
- VP8X機能フラグのバイトオフセットを修正しました。([#2199](https://github.com/coil-kt/coil/pull/2199))
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
    - `model`が再コンポーズをトリガーするかどうかを制御するために、`rememberAsyncImagePainter`、`AsyncImage`、および`SubcomposeAsyncImage`にオプションの`modelEqualityDelegate`引数を追加しました。
- `ContentPainterModifier`を`Modifier.Node`を実装するように更新しました。
- 修正: コンポーネントコールバックとネットワークオブザーバーの登録をバックグラウンドスレッドで遅延的に行いました。これにより、通常メインスレッドで発生していた初期化の遅延が解消されます。
- 修正: `ImageRequest.listener`または`ImageRequest.target`が変更された場合、`rememberAsyncImagePainter`、`AsyncImage`、および`SubcomposeAsyncImage`で新しい画像リクエストを再起動しないようにしました。
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

- **新機能**: `coil-video`に`MediaDataSource`実装のデコードをサポートする`MediaDataSourceFetcher.Factory`を追加しました。([#1795](https://github.com/coil-kt/coil/pull/1795))
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
- バンディングを避けるために、API 30以降の`VideoFrameDecoder`で推奨ビットマップ設定を設定するようにしました。 [#1487](https://github.com/coil-kt/coil/pull/1487)
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
- `ImageRequest.fallback`がnullの場合、`ImageRequest.error`が`Target`に設定されるようになりました。
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
- ランタイムのnullでないアサーションの生成を無効にしました。
    - Javaを使用している場合、nullでないとアノテーションされたパラメータにnullを渡しても、直ちに`NullPointerException`がスローされなくなります。Kotlinのコンパイル時のnull安全性はこれを防ぎます。
    - この変更により、ライブラリのサイズが小さくなります。
- `Size`は、その幅と高さの2つの`Dimension`値で構成されるようになりました。`Dimension`は、正のピクセル値または`Dimension.Original`のいずれかになります。
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
- `ImageRequest.fallback`がnullの場合、`ImageRequest.error`が`Target`に設定されるようになりました。
- `Transformation.key`は`Transformation.cacheKey`に置き換えられました。
- Kotlinを1.6.10に更新しました。
- Composeを1.1.1に更新しました。
- OkHttpを4.9.3に更新しました。
- Okioを3.0.0に更新しました。

`2.0.0-alpha09`からの変更点:

- `-Xjvm-default=all`コンパイラフラグを削除しました。
- must-revalidate/e-tagを持つ複数のリクエストが同時に実行された場合に画像をロードできない問題を修正しました。
- `<svg`タグの後に改行文字がある場合、`DecodeUtils.isSvg`がfalseを返す問題を修正しました。
- `LocalImageLoader.provides`非推奨メッセージをより明確にしました。
- Composeを1.1.1に更新しました。
- `accompanist-drawablepainter`を0.23.1に更新しました。

## [2.0.0-alpha09] - 2022年2月16日

- 修正: `AsyncImage`が不正な制約を作成する問題を修正しました。([#1134](https://github.com/coil-kt/coil/pull/1134))
- `AsyncImagePainter`に`ContentScale`引数を追加しました。([#1144](https://github.com/coil-kt/coil/pull/1144))
    - これは、画像が正しいサイズでロードされるように、`Image`に設定されているのと同じ値を設定する必要があります。
- `ImageRequest`の`Scale`を遅延解決するために`ScaleResolver`を追加しました。([#1134](https://github.com/coil-kt/coil/pull/1134))
    - `ImageRequest.scale`は`ImageRequest.scaleResolver.scale()`に置き換えられるべきです。
- Composeを1.1.0に更新しました。
- `accompanist-drawablepainter`を0.23.0に更新しました。
- `androidx.lifecycle`を2.4.1に更新しました。

## [2.0.0-alpha08] - 2022年2月7日

- `DiskCache`と`ImageSource`がOkioの`FileSystem` APIを使用するように更新しました。([#1115](https://github.com/coil-kt/coil/pull/1115))

## [2.0.0-alpha07] - 2022年1月30日

- `AsyncImage`のパフォーマンスを大幅に改善し、`AsyncImage`を`AsyncImage`と`SubcomposeAsyncImage`に分割しました。([#1048](https://github.com/coil-kt/coil/pull/1048))
    - `SubcomposeAsyncImage`は`loading`/`success`/`error`/`content`スロットAPIを提供し、パフォーマンスの低いサブコンポジションを使用します。
    - `AsyncImage`は、読み込み中またはリクエストが成功しなかった場合に描画される`Painter`を上書きするための`placeholder`/`error`/`fallback`引数を提供します。`AsyncImage`はサブコンポジションを使用せず、`SubcomposeAsyncImage`よりもはるかに優れたパフォーマンスを発揮します。
    - `SubcomposeAsyncImage.content`から`AsyncImagePainter.State`引数を削除しました。必要に応じて`painter.state`を使用してください。
    - `AsyncImage`と`SubcomposeAsyncImage`の両方に`onLoading`/`onSuccess`/`onError`コールバックを追加しました。
- `LocalImageLoader`を非推奨にしました。([#1101](https://github.com/coil-kt/coil/pull/1101))
- `ImageRequest.tags`のサポートを追加しました。([#1066](https://github.com/coil-kt/coil/pull/1066))
- `DecodeUtils`の`isGif`、`isWebP`、`isAnimatedWebP`、`isHeif`、`isAnimatedHeif`を`coil-gif`に移動しました。`isSvg`を`coil-svg`に追加しました。([#1117](https://github.com/coil-kt/coil/pull/1117))
- `FetchResult`と`DecodeResult`を非データクラスに変換しました。([#1114](https://github.com/coil-kt/coil/pull/1114))
- 未使用の`DiskCache.Builder`コンテキスト引数を削除しました。([#1099](https://github.com/coil-kt/coil/pull/1099))
- 元のサイズのビットマップリソースのスケーリングを修正しました。([#1072](https://github.com/coil-kt/coil/pull/1072))
- `ImageDecoderDecoder`で`ImageDecoder`を閉じない問題を修正しました。([#1109](https://github.com/coil-kt/coil/pull/1109))
- ドローアブルをビットマップに変換する際の不正なスケーリングを修正しました。([#1084](https://github.com/coil-kt/coil/pull/1084))
- Composeを1.1.0-rc03に更新しました。
- `accompanist-drawablepainter`を0.22.1-rcに更新しました。
- `androidx.appcompat:appcompat-resources`を1.4.1に更新しました。

## [2.0.0-alpha06] - 2021年12月24日

- `ImageSource.Metadata`を追加し、バッファリングや一時ファイルなしでアセット、リソース、コンテンツURIからデコードできるようにしました。([#1060](https://github.com/coil-kt/coil/pull/1060))
- `AsyncImage`が正の制約を持つまで画像リクエストの実行を遅延させました。([#1028](https://github.com/coil-kt/coil/pull/1028))
- `loading`、`success`、`error`がすべて設定されている場合に`AsyncImage`の`DefaultContent`を使用する問題を修正しました。([#1026](https://github.com/coil-kt/coil/pull/1026))
- プラットフォームの`LruCache`ではなく、androidxの`LruCache`を使用するようにしました。([#1047](https://github.com/coil-kt/coil/pull/1047))
- Kotlinを1.6.10に更新しました。
- Coroutinesを1.6.0に更新しました。
- Composeを1.1.0-rc01に更新しました。
- `accompanist-drawablepainter`を0.22.0-rcに更新しました。
- `androidx.collection`を1.2.0に更新しました。

## [2.0.0-alpha05] - 2021年11月28日

- **重要**: `Size`をリファクタリングし、どちらかの次元で画像の元のサイズを使用できるようにしました。
    - `Size`は、その幅と高さの2つの`Dimension`値で構成されるようになりました。`Dimension`は、正のピクセル値または`Dimension.Original`のいずれかになります。
    - この変更は、1つの次元が固定ピクセル値である場合に、境界なしの幅/高さの値（例: `wrap_content`、`Constraints.Infinity`）をより適切にサポートするために行われました。
- 修正: `AsyncImage`のインスペクションモード（プレビュー）をサポートしました。
- 修正: `imageLoader.memoryCache`がnullの場合、`SuccessResult.memoryCacheKey`は常に`null`であるべきです。
- `ImageLoader`、`SizeResolver`、および`ViewSizeResolver`のコンストラクタのような`invoke`関数をトップレベル関数に変換しました。
- `CrossfadeDrawable`の`start`および`end`ドローアブルを公開APIにしました。
- `ImageLoader`のプレースホルダー/エラー/フォールバックドローアブルを変更しました。
- `SuccessResult`のコンストラクタにデフォルト引数を追加しました。
- `androidx.collection-ktx`ではなく`androidx.collection`に依存するようにしました。
- OkHttpを4.9.3に更新しました。

## [2.0.0-alpha04] - 2021年11月22日

- **新機能**: `coil-compose`に`AsyncImage`を追加しました。
    - `AsyncImage`は、`ImageRequest`を非同期で実行し、その結果をレンダリングするコンポーザブルです。
    - **`AsyncImage`は、ほとんどのユースケースで`rememberImagePainter`を置き換えることを目的としています。**
    - そのAPIは最終版ではなく、2.0の最終リリースまでに変更される可能性があります。
    - `Image`と似たAPIを持ち、`Alignment`、`ContentScale`、`alpha`、`ColorFilter`、`FilterQuality`と同じ引数をサポートしています。
    - `content`、`loading`、`success`、`error`引数を使用して、各`AsyncImagePainter`の状態ごとに描画される内容を上書きできます。
    - `rememberImagePainter`が持っていた画像サイズとスケールの解決に関する多くの設計上の問題を修正します。
    - 使用例:

```kotlin
// 画像のみを描画します。
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null, // `null`は避け、可能であればローカライズされた文字列を設定してください。
)

// 円形トリミング、クロスフェード、および`loading`状態を上書きして画像を描画します。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    loading = {
        CircularProgressIndicator()
    },
    contentScale = ContentScale.Crop
)

// 円形トリミング、クロスフェード、およびすべての状態を上書きして画像を描画します。
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentDescription = null,
    modifier = Modifier
        .clip(CircleShape),
    contentScale = ContentScale.Crop
) { state ->
    if (state is AsyncImagePainter.State.Loading) {
        CircularProgressIndicator()
    } else {
        AsyncImageContent() // 画像を描画します。
    }
}
```

- **重要**: `ImagePainter`を`AsyncImagePainter`に、`rememberImagePainter`を`rememberAsyncImagePainter`に名前変更しました。
    - `ExecuteCallback`はサポートされなくなりました。`AsyncImagePainter`が`onDraw`が呼び出されるのを待つのをスキップするには、代わりに`ImageRequest.size(OriginalSize)`（または任意のサイズ）を設定してください。
    - `rememberAsyncImagePainter`にオプションの`FilterQuality`引数を追加しました。
- `DiskCache`でのクリーンアップ操作にコルーチンを使用し、`DiskCache.Builder.cleanupDispatcher`を追加しました。
- `ImageLoader.Builder.placeholder`を使用して設定されたプレースホルダーのComposeプレビューを修正しました。
- より効率的なコードを生成するために、`LocalImageLoader.current`に`@ReadOnlyComposable`を付けました。
- Composeを1.1.0-beta03に更新し、`compose.ui`の代わりに`compose.foundation`に依存するようにしました。
- `androidx.appcompat-resources`を1.4.0に更新しました。

## [2.0.0-alpha03] - 2021年11月12日

- Android 29+で音楽のサムネイルを読み込む機能を追加しました。([#967](https://github.com/coil-kt/coil/pull/967))
- 修正: 現在のパッケージのリソースを読み込むために`context.resources`を使用するようにしました。([#968](https://github.com/coil-kt/coil/pull/968))
- 修正: `clear` -> `dispose`の置換式を修正しました。([#970](https://github.com/coil-kt/coil/pull/970))
- Composeを1.0.5に更新しました。
- `accompanist-drawablepainter`を0.20.2に更新しました。
- Okioを3.0.0に更新しました。
- `androidx.annotation`を1.3.0に更新しました。
- `androidx.core`を1.7.0に更新しました。
- `androidx.lifecycle`を2.4.0に更新しました。
    - `lifecycle-common-java8`が`lifecycle-common`にマージされたため、その依存関係を削除しました。

## [2.0.0-alpha02] - 2021年10月24日

- [マテリアル一覧（bill of materials）](https://docs.gradle.org/7.2/userguide/platforms.html#sub:bom_import)を含む新しい`coil-bom`アーティファクトを追加しました。
    - `coil-bom`をインポートすると、バージョンを指定せずに他のCoilアーティファクトに依存できます。
- `ExecuteCallback.Immediate`を使用しているときに画像をロードできない問題を修正しました。
- Okioを3.0.0-alpha.11に更新しました。
    - これにより、Okio 3.0.0-alpha.11との互換性の問題も解決されます。
- Kotlinを1.5.31に更新しました。
- Composeを1.0.4に更新しました。

## [2.0.0-alpha01] - 2021年10月11日

Coil 2.0.0はライブラリの次のメジャーイテレーションであり、新機能、パフォーマンスの改善、APIの改善、および様々なバグ修正が含まれています。このリリースは、2.0.0の安定版がリリースされるまで、将来のアルファリリースとバイナリ/ソース互換性がない可能性があります。

- **重要**: 最小サポートAPIが21になりました。
- **重要**: `-Xjvm-default=all`を有効にしました。
    - これにより、Kotlinのデフォルトインターフェースメソッドサポートを使用する代わりに、Java 8のデフォルトメソッドが生成されます。詳細については[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)をご覧ください。
    - **ビルドファイルに`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`を追加する必要があります。** 詳細については[こちら](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8)をご覧ください。
- **重要**: Coilは独自のディスクキャッシュ実装を持ち、ディスクキャッシュにOkHttpに依存しなくなりました。
    - この変更は以下のために行われました。
        - 画像デコード中におけるスレッド中断のサポートを改善します。これにより、画像リクエストが素早く開始および停止された場合のパフォーマンスが向上します。
        - `File`にバックアップされた`ImageSource`を公開するのをサポートします。これにより、Android APIがデコードのために`File`を必要とする場合（例: `MediaMetadataRetriever`）に不要なコピーを回避します。
        - ディスクキャッシュファイルを直接読み書きするのをサポートします。
    - `ImageLoader.Builder.diskCache`と`DiskCache.Builder`を使用してディスクキャッシュを設定します。
    - 書き込み中に中断された場合、キャッシュが破損する可能性があるため、Coil 2.0でOkHttpの`Cache`を使用**すべきではありません**。
    - `Cache-Control`およびその他のキャッシュヘッダーは引き続きサポートされます。ただし、`Vary`ヘッダーはキャッシュがURLの一致のみをチェックするため除きます。さらに、応答コードが[200..300)の範囲にある応答のみがキャッシュされます。
    - キャッシュヘッダーのサポートは、`ImageLoader.Builder.respectCacheHeaders`を使用して有効/無効にできます。
    - 2.0にアップグレードする際に、既存のディスクキャッシュはクリアされ、再構築されます。
- **重要**: `ImageRequest`のデフォルトの`Scale`が`Scale.FIT`になりました。
    - これは、`ImageRequest.scale`をデフォルトの`Scale`を持つ他のクラスと一致させるために変更されました。
    - `ImageViewTarget`を持つリクエストは、引き続きスケールが自動検出されます。
- 画像パイプラインクラスへの大幅な変更:
    - `Mapper`、`Fetcher`、`Decoder`はより柔軟になるようにリファクタリングされました。
    - `Fetcher.key`は新しい`Keyer`インターフェースに置き換えられました。`Keyer`は入力データからキャッシュキーを作成します。
    - `Decoder`が`File`を直接デコードできるように`ImageSource`を追加しました。
- ランタイムのnullでないアサーションの生成を無効にしました。
    - Javaを使用している場合、nullでないとアノテーションされたパラメータにnullを渡しても、直ちに`NullPointerException`がスローされなくなります。Kotlinを使用している場合、実質的な変更はありません。
    - この変更により、ライブラリのサイズが小さくなります。
- `VideoFrameFileFetcher`と`VideoFrameUriFetcher`はライブラリから削除されました。代わりに、すべてのデータソースをサポートする`VideoFrameDecoder`を使用してください。
- 進行中の`BitmapFactory`操作の最大数を制限する`bitmapFactoryMaxParallelism`のサポートを追加しました。この値はデフォルトで4であり、UIパフォーマンスを向上させます。
- `interceptorDispatcher`、`fetcherDispatcher`、`decoderDispatcher`、および`transformationDispatcher`のサポートを追加しました。
- `Disposable`はリファクタリングされ、基になる`ImageRequest`のジョブを公開します。
- `Transition.transition`は、遷移が完了するまで中断する必要がなくなったため、非中断関数に変更されました。
- 共通の`ViewTarget`ロジックを処理する`GenericViewTarget`を追加しました。
- [`BlurTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/BlurTransformation.kt)と[`GrayscaleTransformation`](https://github.com/coil-kt/coil/blob/845f39383f332428077c666e3567b954675ce248/coil-core/src/main/java/coil/transform/GrayscaleTransformation.kt)はライブラリから削除されました。
    - 使用している場合は、そのコードをプロジェクトにコピーできます。
- `ImageRequest.fallback`がnullの場合、`ImageRequest.error`が`Target`に設定されるようになりました。
- `Transformation.key`は`Transformation.cacheKey`に置き換えられました。
- `ImageRequest.Listener`は、`onSuccess`と`onError`でそれぞれ`SuccessResult`/`ErrorResult`を返します。
- `ByteBuffer`をデフォルトでサポートされるデータ型に追加しました。
- いくつかのクラスから`toString`実装を削除しました。
- OkHttpを4.9.2に更新しました。
- Okioを3.0.0-alpha.10に更新しました。

## [1.4.0] - 2021年10月6日

- **新機能**: `ImagePainter.State.Success`と`ImagePainter.State.Error`に`ImageResult`を追加しました。([#887](https://github.com/coil-kt/coil/pull/887))
    - これは`ImagePainter.State.Success`と`ImagePainter.State.Error`のシグネチャに対するバイナリ互換性のない変更ですが、これらのAPIは実験的としてマークされています。
- `CrossfadeTransition`は`View.isShown`が`true`の場合のみ実行されるようになりました。以前は`View.isVisible`のみをチェックしていました。([#898](https://github.com/coil-kt/coil/pull/898))
- 丸め処理の問題により、スケーリング乗数が1よりわずかに小さい場合、メモリキャッシュミスが発生する可能性がある問題を修正しました。([#899](https://github.com/coil-kt/coil/pull/899))
- 非インライン`ComponentRegistry`メソッドを公開しました。([#925](https://github.com/coil-kt/coil/pull/925))
- `accompanist-drawablepainter`に依存し、Coilのカスタム`DrawablePainter`実装を削除しました。([#845](https://github.com/coil-kt/coil/pull/845))
- desugaringの問題を防ぐためにJava 8メソッドの使用を削除しました。([#924](https://github.com/coil-kt/coil/pull/924))
- `ImagePainter.ExecuteCallback`を安定APIに昇格させました。([#927](https://github.com/coil-kt/coil/pull/927))
- `compileSdk`を31に更新しました。
- Kotlinを1.5.30に更新しました。
- Coroutinesを1.5.2に更新しました。
- Composeを1.0.3に更新しました。

## [1.3.2] - 2021年8月4日

- `coil-compose`は`compose.foundation`ではなく`compose.ui`に依存するようになりました。
    - `compose.ui`は`compose.foundation`のサブセットであるため、より小さい依存関係です。
- Jetpack Composeを1.0.1に更新しました。
- Kotlinを1.5.21に更新しました。
- Coroutinesを1.5.1に更新しました。
- `androidx.exifinterface:exifinterface`を1.3.3に更新しました。

## [1.3.1] - 2021年7月28日

- Jetpack Composeを`1.0.0`に更新しました。Composeチームの[安定版リリース](https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html)に心からお祝い申し上げます！
- `androidx.appcompat:appcompat-resources`を1.3.1に更新しました。

## [1.3.0] - 2021年7月10日

- **新機能**: [Jetpack Compose](https://developer.android.com/jetpack/compose)のサポートを追加しました。これは[Accompanist](https://github.com/google/accompanist/)のCoil統合をベースにしていますが、いくつかの変更点があります。詳細については[ドキュメント](https://coil-kt.github.io/coil/compose/)をご覧ください。
- `allowConversionToBitmap`を追加し、`Transformation`の自動ビットマップ変換を有効/無効にできるようにしました。([#775](https://github.com/coil-kt/coil/pull/775))
- `ImageDecoderDecoder`と`GifDecoder`に`enforceMinimumFrameDelay`を追加し、GIFのフレーム遅延がしきい値以下の場合にフレーム遅延を書き換えるのを有効にできるようにしました。([#783](https://github.com/coil-kt/coil/pull/783))
    - これはデフォルトで無効になっていますが、将来のリリースでデフォルトで有効になります。
- `ImageLoader`の内部ネットワークオブザーバーを有効/無効にするサポートを追加しました。([#741](https://github.com/coil-kt/coil/pull/741))
- `BitmapFactoryDecoder`によってデコードされたビットマップの密度を修正しました。([#776](https://github.com/coil-kt/coil/pull/776))
- LicenseeがCoilのライセンスURLを見つけられない問題を修正しました。([#774](https://github.com/coil-kt/coil/pull/774))
- `androidx.core:core-ktx`を1.6.0に更新しました。

## [1.2.2] - 2021年6月4日

- 共有状態を持つドローアブルをビットマップに変換する際の競合状態を修正しました。([#771](https://github.com/coil-kt/coil/pull/771))
- `ImageLoader.Builder.fallback`が`fallback`ドローアブルではなく`error`ドローアブルを設定する問題を修正しました。
- `ResourceUriFetcher`が返すデータソースが正しくない問題を修正しました。([#770](https://github.com/coil-kt/coil/pull/770))
- API 26および27での利用可能なファイル記述子がない場合のログチェックを修正しました。
- プラットフォームベクタードローアブルのサポートに関するバージョンチェックが正しくない問題を修正しました。([#751](https://github.com/coil-kt/coil/pull/751))
- Kotlinを1.5.10に更新しました。
- Coroutinesを1.5.0に更新しました。
- `androidx.appcompat:appcompat-resources`を1.3.0に更新しました。
- `androidx.core:core-ktx`を1.5.0に更新しました。

## [1.2.1] - 2021年4月27日

- 修正: `VideoFrameUriFetcher`がhttp/https URIを処理しようとする問題を修正しました。([#734](https://github.com/coil-kt/coil/pull/734)

## [1.2.0] - 2021年4月12日

- **重要**: `SvgDecoder`でSVGのビューバウンドを使用してアスペクト比を計算するようにしました。([#688](https://github.com/coil-kt/coil/pull/688))
    - 以前は、`SvgDecoder`はSVGの`width`/`height`要素を使用してアスペクト比を決定していましたが、これはSVGの仕様に正しく従っていませんでした。
    - 以前の動作に戻すには、`SvgDecoder`を構築する際に`useViewBoundsAsIntrinsicSize = false`を設定してください。
- **新機能**: `VideoFrameDecoder`を追加し、あらゆるソースからビデオフレームをデコードできるようにしました。([#689](https://github.com/coil-kt/coil/pull/689))
- **新機能**: MIMEタイプだけでなく、ソースのコンテンツを使用してSVGを自動検出するサポートを追加しました。([#654](https://github.com/coil-kt/coil/pull/654))
- **新機能**: `ImageLoader.newBuilder()`を使用してリソースを共有するサポートを追加しました。([#653](https://github.com/coil-kt/coil/pull/653))
    - 重要な点として、これにより`ImageLoader`インスタンス間でメモリキャッシュを共有できるようになります。
- **新機能**: `AnimatedTransformation`を使用したアニメーション画像の変換のサポートを追加しました。([#659](https://github.com/coil-kt/coil/pull/659))
- **新機能**: アニメーションドローアブルの開始/終了コールバックのサポートを追加しました。([#676](https://github.com/coil-kt/coil/pull/676))

---

- HEIF/HEICファイルのEXIFデータ解析を修正しました。([#664](https://github.com/coil-kt/coil/pull/664))
- ビットマッププーリングが無効になっている場合、`EmptyBitmapPool`の実装を使用しない問題を修正しました。([#638](https://github.com/coil-kt/coil/pull/638))
    - この修正がないと、ビットマッププーリングは適切に無効になっていましたが、より重い`BitmapPool`の実装を使用していました。
- `MovieDrawable.getOpacity`が誤って透明を返すケースを修正しました。([#682](https://github.com/coil-kt/coil/pull/682))
- デフォルトの一時ディレクトリが存在しない場合を防ぐようにしました。([#683](https://github.com/coil-kt/coil/pull/683))

---

- JVM IRバックエンドを使用してビルドするようにしました。([#670](https://github.com/coil-kt/coil/pull/670))
- Kotlinを1.4.32に更新しました。
- Coroutinesを1.4.3に更新しました。
- OkHttpを3.12.13に更新しました。
- `androidx.lifecycle:lifecycle-common-java8`を2.3.1に更新しました。

## [1.1.1] - 2021年1月11日

- 修正: コルーチンが複数回再開されることによって`ViewSizeResolver.size`が`IllegalStateException`をスローする可能性のあるケースを修正しました。
- 修正: メインスレッドから呼び出された場合に`HttpFetcher`が永久にブロックされる問題を修正しました。
    - `ImageRequest.dispatcher(Dispatchers.Main.immediate)`を使用してメインスレッドで強制的に実行されるリクエストは、`ImageRequest.networkCachePolicy`が`CachePolicy.DISABLED`または`CachePolicy.WRITE_ONLY`に設定されていない限り、`NetworkOnMainThreadException`で失敗します。
- ビデオに回転メタデータがある場合、`VideoFrameFetcher`からのビデオフレームを回転させるようにしました。
- Kotlinを1.4.21に更新しました。
- Coroutinesを1.4.2に更新しました。
- Okioを2.10.0に更新しました。
- `androidx.exifinterface:exifinterface`を1.3.2に更新しました。

## [1.1.0] - 2020年11月24日

- **重要**: `CENTER`および`MATRIX`の`ImageView`スケールタイプを`OriginalSize`に解決するように変更しました。([#587](https://github.com/coil-kt/coil/pull/587))
    - この変更は、リクエストのサイズが明示的に指定されていない場合の暗黙的なサイズ解決アルゴリズムにのみ影響します。
    - この変更は、画像リクエストの視覚的な結果が`ImageView.setImageResource`/`ImageView.setImageURI`と一貫するようにするために行われました。以前の動作に戻すには、リクエストを構築する際に`ViewSizeResolver`を設定してください。
- **重要**: `View`のレイアウトパラメータが`WRAP_CONTENT`の場合、`ViewSizeResolver`からディスプレイサイズを返すようにしました。([#562](https://github.com/coil-kt/coil/pull/562))
    - 以前は、ビューが完全にレイアウトされている場合にのみディスプレイサイズを返していました。この変更により、一般的な動作がより一貫性があり直感的になります。
- アルファ事前乗算を制御する機能を追加しました。([#569](https://github.com/coil-kt/coil/pull/569))
- `CrossfadeDrawable`で正確な固有サイズを優先するのをサポートしました。([#585](https://github.com/coil-kt/coil/pull/585))
- バージョンを含む完全なGIFヘッダーをチェックするようにしました。([#564](https://github.com/coil-kt/coil/pull/564))
- 空のビットマッププール実装を追加しました。([#561](https://github.com/coil-kt/coil/pull/561))
- `EventListener.Factory`を関数型インターフェースにしました。([#575](https://github.com/coil-kt/coil/pull/575))
- `EventListener`を安定化しました。([#574](https://github.com/coil-kt/coil/pull/574))
- `ImageRequest.Builder.placeholderMemoryCacheKey`の`String`オーバーロードを追加しました。
- `ViewSizeResolver`コンストラクタに`@JvmOverloads`を追加しました。
- 修正: `CrossfadeDrawable`の開始/終了ドローアブルを変更しました。([#572](https://github.com/coil-kt/coil/pull/572))
- 修正: 2回目のロードでGIFが再生されない問題を修正しました。([#577](https://github.com/coil-kt/coil/pull/534))
- Kotlinを1.4.20に更新し、`kotlin-parcelize`プラグインに移行しました。
- Coroutinesを1.4.1に更新しました。

## [1.0.0] - 2020年10月22日

`0.13.0`からの変更点:
- `Context.imageLoader`拡張関数を追加しました。([#534](https://github.com/coil-kt/coil/pull/534))
- `ImageLoader.executeBlocking`拡張関数を追加しました。([#537](https://github.com/coil-kt/coil/pull/537))
- 以前のシングルトン画像ローダーが置き換えられた場合、シャットダウンしないようにしました。([#533](https://github.com/coil-kt/coil/pull/533))

`1.0.0-rc3`からの変更点:
- 修正: 不足/無効な`ActivityManager`を防ぐようにしました。([#541](https://github.com/coil-kt/coil/pull/541))
- 修正: OkHttpが失敗した応答をキャッシュできるようにしました。([#551](https://github.com/coil-kt/coil/pull/551))
- Kotlinを1.4.10に更新しました。
- Okioを2.9.0に更新しました。
- `androidx.exifinterface:exifinterface`を1.3.1に更新しました。

## [1.0.0-rc3] - 2020年9月21日

- 不安定性のため、[`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)コンパイラフラグの使用を元に戻しました。
    - **これは、以前のリリース候補バージョンからソース互換ですが、バイナリ互換性がない変更です。**
- `Context.imageLoader`拡張関数を追加しました。([#534](https://github.com/coil-kt/coil/pull/534))
- `ImageLoader.executeBlocking`拡張関数を追加しました。([#537](https://github.com/coil-kt/coil/pull/537))
- 以前のシングルトン画像ローダーが置き換えられた場合、シャットダウンしないようにしました。([#533](https://github.com/coil-kt/coil/pull/533))
- AndroidXの依存関係を更新しました:
    - `androidx.exifinterface:exifinterface` -> 1.3.0

## [1.0.0-rc2] - 2020年9月3日

- **このリリースにはKotlin 1.4.0以降が必要です。**
- [0.13.0](#0130---september-3-2020)に存在するすべての変更が含まれています。
- ベースのKotlin `stdlib`に依存し、`stdlib-jdk8`ではなくなりました。

## [0.13.0] - 2020年9月3日

- **重要**: デフォルトでインターセプターチェーンをメインスレッドで起動するようにしました。([#513](https://github.com/coil-kt/coil/pull/513))
    - これにより、メモリキャッシュがメインスレッドで同期的にチェックされていた`0.11.0`以前の動作がほぼ復元されます。
    - メモリキャッシュが`ImageRequest.dispatcher`でチェックされる`0.12.0`と同じ動作に戻すには、`ImageLoader.Builder.launchInterceptorChainOnMainThread(false)`を設定してください。
    - 詳細については[`launchInterceptorChainOnMainThread`](https://coil-kt.github.io/coil/api/coil-core/coil3/-image-loader/-builder/launch-interceptor-chain-on-main-thread/)をご覧ください。

---

- 修正: デタッチされたフラグメントの`ViewTarget`でリクエストが開始された場合、メモリリークの可能性を修正しました。([#518](https://github.com/coil-kt/coil/pull/518))
- 修正: リソースURIをロードするために`ImageRequest.context`を使用するようにしました。([#517](https://github.com/coil-kt/coil/pull/517))
- 修正: 後続のリクエストがディスクキャッシュに保存されない可能性のある競合状態を修正しました。([#510](https://github.com/coil-kt/coil/pull/510))
- 修正: API 18で`blockCountLong`と`blockSizeLong`を使用するようにしました。

---

- `ImageLoaderFactory`をfunインターフェースにしました。
- `ImageLoader.Builder.addLastModifiedToFileCacheKey`を追加しました。これにより、`File`からロードされた画像のメモリキャッシュキーに最終更新タイムスタンプを追加するかどうかを有効/無効にできます。

---

- Kotlinを1.4.0に更新しました。
- Coroutinesを1.3.9に更新しました。
- Okioを2.8.0に更新しました。

## [1.0.0-rc1] - 2020年8月18日

- **このリリースにはKotlin 1.4.0以降が必要です。**
- Kotlinを1.4.0に更新し、[`-Xjvm-default=all`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)を有効にしました。
    - **ビルドファイルで`-Xjvm-default=all`を有効にする方法については、[こちら](https://coil-kt.github.io/coil/faq/#how-do-i-target-java-8)をご覧ください。**
    - これにより、デフォルトのKotlinインターフェースメソッドに対してJava 8のデフォルトメソッドが生成されます。
- 0.12.0で既存の非推奨メソッドをすべて削除しました。
- Coroutinesを1.3.9に更新しました。

## [0.12.0] - 2020年8月18日

- **破壊的変更**: `LoadRequest`と`GetRequest`は`ImageRequest`に置き換えられました。
    - `ImageLoader.execute(LoadRequest)` -> `ImageLoader.enqueue(ImageRequest)`
    - `ImageLoader.execute(GetRequest)` -> `ImageLoader.execute(ImageRequest)`
    - `ImageRequest`は`equals`/`hashCode`を実装します。
- **破壊的変更**: 多くのクラスが名前変更および/またはパッケージ変更されました。
    - `coil.request.RequestResult` -> `coil.request.ImageResult`
    - `coil.request.RequestDisposable` -> `coil.request.Disposable`
    - `coil.bitmappool.BitmapPool` -> `coil.bitmap.BitmapPool`
    - `coil.DefaultRequestOptions` -> `coil.request.DefaultRequestOptions`
- **破壊的変更**: [`SparseIntArraySet`](https://github.com/coil-kt/coil/blob/f52addd039f0195b66f93cb0f1cad59b0832f784/coil-core/src/main/java/coil/collection/SparseIntArraySet.kt)は公開APIから削除されました。
- **破壊的変更**: `TransitionTarget`は`ViewTarget`を実装しなくなりました。
- **破壊的変更**: `ImageRequest.Listener.onSuccess`のシグネチャが変更され、`DataSource`だけでなく`ImageResult.Metadata`を返すようになりました。
- **破壊的変更**: `LoadRequest.aliasKeys`のサポートを削除しました。このAPIは、メモリキャッシュへの直接読み書きアクセスでより適切に処理されます。

---

- **重要**: メモリキャッシュの値は、もはや同期的に解決されません（メインスレッドから呼び出された場合）。
    - この変更は、バックグラウンドディスパッチャーで`Interceptor`を実行するためにも必要でした。
    - この変更により、より多くの作業がメインスレッドから移動され、パフォーマンスが向上します。
- **重要**: `Mapper`はバックグラウンドディスパッチャーで実行されるようになりました。結果として、自動ビットマップサンプリングは**自動的に**サポートされなくなりました。同じ効果を達成するには、以前のリクエストの`MemoryCache.Key`を、後続のリクエストの`placeholderMemoryCacheKey`として使用してください。[例はこちら](https://coil-kt.github.io/coil/recipes/#using-a-memory-cache-key-as-a-placeholder)。
    - `placeholderMemoryCacheKey` APIは、異なるデータ（例: 小さい画像と大きい画像の異なるURL）を持つ2つの画像リクエストを「リンク」できるため、より多くの自由度を提供します。
- **重要**: Coilの`ImageView`拡張関数は`coil.api`パッケージから`coil`パッケージに移動されました。
    - `import coil.api.load` -> `import coil.load`のリファクタリングには、検索と置換を使用してください。残念ながら、Kotlinの`ReplaceWith`機能を使用してインポートを置き換えることはできません。
- **重要**: ドローアブルが同じ画像でない場合、標準のクロスフェードを使用するようにしました。
- **重要**: API 24以降では、不変のビットマップを優先するようにしました。
- **重要**: `MeasuredMapper`は、新しい`Interceptor`インターフェースの代わりに非推奨になりました。`MeasuredMapper`を`Interceptor`に変換する方法の例は[こちら](https://gist.github.com/colinrtwhite/90267704091467451e46b21b95154299)をご覧ください。
    - `Interceptor`ははるかに制限の少ないAPIであり、より広範囲のカスタムロジックを可能にします。
- **重要**: `ImageRequest.data`はnull非許容になりました。データが設定されていない`ImageRequest`を作成した場合、そのデータとして`NullRequestData`が返されます。

---

- **新機能**: `ImageLoader`の`MemoryCache`への直接読み書きアクセスをサポートしました。詳細については[ドキュメント](https://coil-kt.github.io/coil/getting_started/#memory-cache)をご覧ください。
- **新機能**: `Interceptor`のサポートを追加しました。詳細については[ドキュメント](https://coil-kt.github.io/coil/image_pipeline/#interceptors)をご覧ください。Coilの`Interceptor`設計は[OkHttp](https://github.com/square/okhttp)に強く影響を受けています！
- **新機能**: `ImageLoader.Builder.bitmapPoolingEnabled`を使用してビットマッププーリングを有効/無効にする機能を追加しました。
    - ビットマッププーリングはAPI 23以下で最も効果的ですが、API 24以降でも（`Bitmap.recycle`を積極的に呼び出すことで）依然として有益な場合があります。
    - ビットマッププールを管理するためのランタイムオーバーヘッドがあります。
    - ビットマッププーリングは、ビットマップがプーリングの対象であるかどうかを追跡する必要があるため、CoilのAPIに設計上の制約をもたらします。ビットマッププーリングを削除することで、Coilは結果の`Drawable`をより多くの場所（例: `Listener`、`Disposable`）で公開できます。さらに、これによりCoilは`ImageView`をクリアする必要がなくなり、[問題](https://github.com/coil-kt/coil/issues/650)を引き起こす可能性があります。
    - ビットマッププーリングは[エラーが発生しやすい](https://github.com/coil-kt/coil/issues/546)です。新しいビットマップを割り当てる方が、まだ使用されている可能性のあるビットマップを再利用しようとするよりもはるかに安全です。
- **新機能**: デコード中のスレッド中断をサポートしました。

---

- content-typeヘッダーの複数のセグメントのパースを修正しました。
- ビットマップ参照カウントをより堅牢にするように再設計しました。
- API 19未満のデバイスでのWebPデコードを修正しました。
- `EventListener` APIで`FetchResult`と`DecodeResult`を公開しました。

---

- SDK 30でコンパイルするようにしました。
- Coroutinesを1.3.8に更新しました。
- OkHttpを3.12.12に更新しました。
- Okioを2.7.0に更新しました。
- AndroidXの依存関係を更新しました:
    - `androidx.appcompat:appcompat-resources` -> 1.2.0
    - `androidx.core:core-ktx` -> 1.3.1

## [0.11.0] - 2020年5月14日

- **破壊的変更**: **このバージョンは既存の非推奨関数をすべて削除します。**
    - これにより、Coilの`ContentProvider`を削除できるようになり、アプリ起動時にコードが実行されなくなります。
- **破壊的変更**: `SparseIntArraySet.size`を`val`に変換しました。([#380](https://github.com/coil-kt/coil/pull/380))
- **破壊的変更**: `Parameters.count()`を拡張関数に移動しました。([#403](https://github.com/coil-kt/coil/pull/403))
- **破壊的変更**: `BitmapPool.maxSize`を`Int`にしました。([#404](https://github.com/coil-kt/coil/pull/404))

---

- **重要**: `ImageLoader.shutdown()`をオプションにしました（`OkHttpClient`と同様）。([#385](https://github.com/coil-kt/coil/pull/385))

---

- 修正: AGP 4.1との互換性を修正しました。([#386](https://github.com/coil-kt/coil/pull/386))
- 修正: `GONE`状態のビューの測定を修正しました。([#397](https://github.com/coil-kt/coil/pull/397))

---

- デフォルトのメモリキャッシュサイズを20%に削減しました。([#390](https://github.com/coil-kt/coil/pull/390))
    - 既存の動作に戻すには、`ImageLoader`を作成する際に`ImageLoaderBuilder.availableMemoryPercentage(0.25)`を設定してください。
- Coroutinesを1.3.6に更新しました。
- OkHttpを3.12.11に更新しました。

## [0.10.1] - 2020年4月26日

- 修正: API 23以下で大きなPNGをデコードする際のOOMを修正しました。([#372](https://github.com/coil-kt/coil/pull/372)).
    - これにより、PNGファイルのEXIFオリエンテーションのデコードが無効になります。PNGのEXIFオリエンテーションは非常にまれにしか使用されず、PNGのEXIFデータ（たとえ空であっても）を読み取るには、ファイル全体をメモリにバッファリングする必要があり、これはパフォーマンスにとって悪いことです。
- `SparseIntArraySet`のJava互換性をわずかに改善しました。

---

- Okioを2.6.0に更新しました。

## [0.10.0] - 2020年4月20日

### ハイライト

- **このバージョンでは、ほとんどのDSL APIが非推奨となり、ビルダーを直接使用するようになりました。** 変更点は次のとおりです。

    ```kotlin
    // 0.9.5 (旧)
    val imageLoader = ImageLoader(context) {
        bitmapPoolPercentage(0.5)
        crossfade(true)
    }

    val disposable = imageLoader.load(context, "https://example.com/image.jpg") {
        target(imageView)
    }

    val drawable = imageLoader.get("https://example.com/image.jpg") {
        size(512, 512)
    }

    // 0.10.0 (新)
    val imageLoader = ImageLoader.Builder(context)
        .bitmapPoolPercentage(0.5)
        .crossfade(true)
        .build()

    val request = LoadRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .target(imageView)
        .build()
    val disposable = imageLoader.execute(request)

    val request = GetRequest.Builder(context)
        .data("https://example.com/image.jpg")
        .size(512, 512)
        .build()
    val drawable = imageLoader.execute(request).drawable
    ```

    - `io.coil-kt:coil`アーティファクトを使用している場合、シングルトン`ImageLoader`でリクエストを実行するために`Coil.execute(request)`を呼び出すことができます。

- **`ImageLoader`は、強参照メモリキャッシュから排除された画像を追跡する弱参照メモリキャッシュを持つようになりました。**
    - これは、画像に強参照がまだ存在する場合、`ImageLoader`のメモリキャッシュから常に画像が返されることを意味します。
    - 一般的に、これによりメモリキャッシュがはるかに予測可能になり、ヒット率が向上するはずです。
    - この動作は、`ImageLoaderBuilder.trackWeakReferences`で有効/無効にできます。

- 新しいアーティファクト、**`io.coil-kt:coil-video`**を追加し、ビデオファイルから特定のフレームをデコードできるようにしました。[詳細はこちら](https://coil-kt.github.io/coil/videos/)をご覧ください。

- メトリック追跡用の新しい[EventListener](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt) APIを追加しました。

- シングルトンの初期化を簡素化するために、`Application`で実装できる[ImageLoaderFactory](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)を追加しました。

---

### 全リリースノート

- **重要**: ビルダー構文を優先してDSL構文を非推奨にしました。([#267](https://github.com/coil-kt/coil/pull/267))
- **重要**: `Coil`と`ImageLoader`の拡張関数を非推奨にしました。([#322](https://github.com/coil-kt/coil/pull/322))
- **破壊的変更**: `ImageLoader.execute(GetRequest)`からsealedな`RequestResult`型を返すようにしました。([#349](https://github.com/coil-kt/coil/pull/349))
- **破壊的変更**: `ExperimentalCoil`を`ExperimentalCoilApi`に名前変更しました。`@Experimental`から`@RequiresOptIn`に移行しました。([#306](https://github.com/coil-kt/coil/pull/306))
- **破壊的変更**: `CoilLogger`を`Logger`インターフェースに置き換えました。([#316](https://github.com/coil-kt/coil/pull/316))
- **破壊的変更**: `destWidth`/`destHeight`を`dstWidth`/`dstHeight`に名前変更しました。([#275](https://github.com/coil-kt/coil/pull/275))
- **破壊的変更**: `MovieDrawable`のコンストラクタパラメータを再配置しました。([#272](https://github.com/coil-kt/coil/pull/272))
- **破壊的変更**: `Request.Listener`のメソッドが、データだけでなく完全な`Request`オブジェクトを受け取るようになりました。
- **破壊的変更**: `GetRequestBuilder`のコンストラクタで`Context`が必要になりました。
- **破壊的変更**: `Request`のいくつかのプロパティがnull許容になりました。
- **動作変更**: デフォルトでパラメータ値をキャッシュキーに含めるようにしました。([#319](https://github.com/coil-kt/coil/pull/319))
- **動作変更**: `Request.Listener.onStart()`のタイミングを`Target.onStart()`の直後に呼び出されるようにわずかに調整しました。([#348](https://github.com/coil-kt/coil/pull/348))

---

- **新機能**: `WeakMemoryCache`実装を追加しました。([#295](https://github.com/coil-kt/coil/pull/295))
- **新機能**: ビデオフレームのデコードをサポートするために`coil-video`を追加しました。([#122](https://github.com/coil-kt/coil/pull/122))
- **新機能**: [`EventListener`](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/EventListener.kt)を導入しました。([#314](https://github.com/coil-kt/coil/pull/314))
- **新機能**: [`ImageLoaderFactory`](https://github.com/coil-kt/coil/blob/main/coil/src/main/java/coil/ImageLoaderFactory.kt)を導入しました。([#311](https://github.com/coil-kt/coil/pull/311))
- **新機能**: Android 11でアニメーションHEIF画像シーケンスをサポートしました。([#297](https://github.com/coil-kt/coil/pull/297))
- **新機能**: Java互換性を改善しました。([#262](https://github.com/coil-kt/coil/pull/262))
- **新機能**: デフォルトの`CachePolicy`を設定するサポートを追加しました。([#307](https://github.com/coil-kt/coil/pull/307))
- **新機能**: デフォルトの`Bitmap.Config`を設定するサポートを追加しました。([#342](https://github.com/coil-kt/coil/pull/342))
- **新機能**: 単一のメモリキャッシュアイテムをクリアするための`ImageLoader.invalidate(key)`を追加しました。([#55](https://github.com/coil-kt/coil/pull/55))
- **新機能**: キャッシュされた画像が再利用されない理由を説明するためのデバッグログを追加しました。([#346](https://github.com/coil-kt/coil/pull/346))
- **新機能**: `get`リクエストのエラーおよびフォールバックドローアブルをサポートしました。

---

- 修正: `Transformation`が入力ビットマップのサイズを縮小した場合のメモリキャッシュミスを修正しました。([#357](https://github.com/coil-kt/coil/pull/357))
- 修正: `BlurTransformation`で半径がRenderScriptの最大値以下であることを確認するようにしました。([#291](https://github.com/coil-kt/coil/pull/291))
- 修正: 高い色深度の画像のデコードを修正しました。([#358](https://github.com/coil-kt/coil/pull/358))
- 修正: Android 11以降で`ImageDecoderDecoder`のクラッシュ回避策を無効にしました。([#298](https://github.com/coil-kt/coil/pull/298))
- 修正: API 23以前でEXIFデータの読み取りが失敗する問題を修正しました。([#331](https://github.com/coil-kt/coil/pull/331))
- 修正: Android R SDKとの非互換性を修正しました。([#337](https://github.com/coil-kt/coil/pull/337))
- 修正: `ImageView`に一致する`SizeResolver`がある場合にのみ、不正確なサイズを有効にするようにしました。([#344](https://github.com/coil-kt/coil/pull/344))
- 修正: キャッシュされた画像が要求されたサイズから最大1ピクセルずれるのを許可するようにしました。([#360](https://github.com/coil-kt/coil/pull/360))
- 修正: ビューが非表示の場合、クロスフェード遷移をスキップするようにしました。([#361](https://github.com/coil-kt/coil/pull/361))

---

- `CoilContentProvider`を非推奨にしました。([#293](https://github.com/coil-kt/coil/pull/293))
- いくつかの`ImageLoader`メソッドに`@MainThread`アノテーションを付けました。
- ライフサイクルが現在開始されている場合、`LifecycleCoroutineDispatcher`を作成しないようにしました。([#356](https://github.com/coil-kt/coil/pull/356))
- `OriginalSize.toString()`に完全なパッケージ名を使用するようにしました。
- ソフトウェアビットマップをデコードする際に事前割り当てするようにしました。([#354](https://github.com/coil-kt/coil/pull/354))

---

- Kotlinを1.3.72に更新しました。
- Coroutinesを1.3.5に更新しました。
- OkHttpを3.12.10に更新しました。
- Okioを2.5.0に更新しました。
- AndroidXの依存関係を更新しました:
    - `androidx.exifinterface:exifinterface` -> 1.2.0

## [0.9.5] - 2020年2月6日

- 修正: ビューがハードウェアアクセラレーションされているかどうかをチェックする前に、ビューがアタッチされていることを確認するようにしました。これにより、ハードウェアビットマップを要求したときにメモリキャッシュミスが発生する可能性のあるケースが修正されました。

---

- AndroidXの依存関係を更新しました:
    - `androidx.core:core-ktx` -> 1.2.0

## [0.9.4] - 2020年2月3日

- 修正: `ImageDecoderDecoder`でのダウンサンプリング時にアスペクト比を尊重するようにしました。@zhanghaiに感謝します。

---

- 以前は、要求された設定が`ARGB_8888`の場合、メモリキャッシュから`RGBA_F16`ビットマップが返される可能性がありましたが、ビットマップは要求された設定以上であればメモリキャッシュから返されていました。現在では、キャッシュされた設定と要求された設定が同じである必要があります。
- `CrossfadeDrawable`と`CrossfadeTransition`の`scale`と`durationMillis`を公開しました。

## [0.9.3] - 2020年2月1日

- 修正: `ScaleDrawable`内の子ドローアブルを移動させ、中央に配置されるように修正しました。
- 修正: GIFとSVGが境界を完全に埋めないケースを修正しました。

---

- `HttpUrl.get()`の呼び出しをバックグラウンドスレッドに遅延させました。
- `BitmapFactory`のnullビットマップエラーメッセージを改善しました。
- ハードウェアビットマップのブラックリストに3つのデバイスを追加しました。([#264](https://github.com/coil-kt/coil/pull/264))

---

- AndroidXの依存関係を更新しました:
    - `androidx.lifecycle:lifecycle-common-java8` -> 2.2.0

## [0.9.2] - 2020年1月19日

- 修正: API 19以前でのGIFデコードを修正しました。@marioに感謝します。
- 修正: ラスタライズされたベクタードローアブルがサンプリング済みとしてマークされない問題を修正しました。
- 修正: `Movie`の寸法が0以下の場合に例外をスローするようにしました。
- 修正: `CrossfadeTransition`がメモリキャッシュイベントで再開されない問題を修正しました。
- 修正: ハードウェアビットマップが許可されていない場合、すべてのターゲットメソッドにハードウェアビットマップが返されるのを防ぐようにしました。
- 修正: `MovieDrawable`が自身の境界の中心に配置されない問題を修正しました。

---

- `CrossfadeDrawable`からの自動スケーリングを削除しました。
- `BitmapPool.trimMemory`を公開しました。
- `AnimatedImageDrawable`を`ScaleDrawable`でラップし、境界を埋めるようにしました。
- `RequestBuilder.setParameter`に`@JvmOverloads`を追加しました。
- SVGのビューボックスが設定されていない場合、そのサイズをビューボックスに設定するようにしました。
- `CrossfadeDrawable`の子に状態とレベルの変更を渡すようにしました。

---

- OkHttpを3.12.8に更新しました。

## [0.9.1] - 2019年12月30日

- 修正: `LoadRequestBuilder.crossfade(false)`を呼び出すとクラッシュする問題を修正しました。

## [0.9.0] - 2019年12月30日

- **破壊的変更**: `Transformation.transform`に`Size`パラメータが含まれるようになりました。これは、`Target`のサイズに基づいて出力`Bitmap`のサイズを変更する変換をサポートするためです。変換を伴うリクエストも、[画像サンプリング](https://coil-kt.github.io/coil/getting_started/#image-sampling)から除外されるようになりました。
- **破壊的変更**: `Transformation`は、あらゆる種類の`Drawable`に適用されるようになりました。以前は、入力`Drawable`が`BitmapDrawable`でない場合、`Transformation`はスキップされていました。現在では、`Drawable`は`Transformation`を適用する前に`Bitmap`にレンダリングされます。
- **破壊的変更**: `ImageLoader.load`に`null`データを渡すと、エラーとして扱われ、`Target.onError`と`Request.Listener.onError`が`NullRequestDataException`で呼び出されるようになりました。この変更は、データが`null`の場合に`fallback`ドローアブルを設定するのをサポートするために行われました。以前はリクエストは黙って無視されていました。
- **破壊的変更**: `RequestDisposable.isDisposed`が`val`になりました。

---

- **新機能**: カスタムトランジションのサポート。[詳細はこちら](https://coil-kt.github.io/coil/transitions/)をご覧ください。トランジションは、APIがインキュベート段階であるため実験的とマークされています。
- **新機能**: `LoadRequest`が進行中の間、中断をサポートする`RequestDisposable.await`を追加しました。
- **新機能**: リクエストデータがnullの場合に`fallback`ドローアブルを設定するサポートを追加しました。
- **新機能**: `Precision`を追加しました。これにより、出力`Drawable`のサイズが正確になり、スケーリングをサポートするターゲット（例: `ImageViewTarget`）のスケーリング最適化が可能になります。詳細については[ドキュメント](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/size/Precision.kt)をご覧ください。
- **新機能**: 複数のキャッシュキーを一致させるのをサポートする`RequestBuilder.aliasKeys`を追加しました。

---

- 修正: `RequestDisposable`をスレッドセーフにしました。
- 修正: `RoundedCornersTransformation`が、ターゲットのサイズに合わせてトリミングしてから角を丸めるようにしました。
- 修正: `CircleCropTransformation`が中心からトリミングするようにしました。
- 修正: [ハードウェアビットマップのブラックリスト](https://github.com/coil-kt/coil/blob/main/coil-core/src/main/java/coil/memory/HardwareBitmapService.kt)にいくつかのデバイスを追加しました。
- 修正: `Drawable`を`Bitmap`に変換する際にアスペクト比を保持するようにしました。
- 修正: `Scale.FIT`でのメモリキャッシュミスの可能性を修正しました。
- 修正: `Parameters`の反復順序が確定的であることを確認するようにしました。
- 修正: `Parameters`と`ComponentRegistry`を作成する際に、防御的なコピーを行いました。
- 修正: `RealBitmapPool`の`maxSize`が0以上であることを確認するようにしました。
- 修正: `CrossfadeDrawable`がアニメーションしていない、または完了している場合、開始ドローアブルを表示するようにしました。
- 修正: `CrossfadeDrawable`を、未定義の固有サイズを持つ子に対応するように調整しました。
- 修正: `MovieDrawable`が正しくスケーリングされない問題を修正しました。

---

- Kotlinを1.3.61に更新しました。
- Kotlin Coroutinesを1.3.3に更新しました。
- Okioを2.4.3に更新しました。
- AndroidXの依存関係を更新しました:
    - `androidx.exifinterface:exifinterface` -> 1.1.0

## [0.8.0] - 2019年10月22日

- **破壊的変更**: `SvgDrawable`が削除されました。代わりに、SVGは`SvgDecoder`によって`BitmapDrawable`に事前レンダリングされるようになりました。これにより、SVGの**メインスレッドでのレンダリングコストが大幅に削減されます**。また、`SvgDecoder`のコンストラクタで`Context`が必要になりました。
- **破壊的変更**: `SparseIntArraySet`の拡張関数が`coil.extension`パッケージに移動しました。

---

- **新機能**: リクエストごとのネットワークヘッダー設定をサポートしました。[詳細はこちら](https://github.com/coil-kt/coil/pull/120)をご覧ください。
- **新機能**: 画像パイプラインを介してカスタムデータを渡すのをサポートする新しい`Parameters` APIを追加しました。
- **新機能**: `RoundedCornersTransformation`で個別の角の半径をサポートしました。@khatv911に感謝します。
- **新機能**: プロアクティブにリソースを解放するのをサポートする`ImageView.clear()`を追加しました。
- **新機能**: 他のパッケージからのリソースのロードをサポートしました。
- **新機能**: `ViewSizeResolver`に`subtractPadding`属性を追加し、測定時にビューのパディングを差し引くのを有効/無効にできるようにしました。
- **新機能**: `HttpUrlFetcher`のMIMEタイプ検出を改善しました。
- **新機能**: `MovieDrawable`と`CrossfadeDrawable`に`Animatable2Compat`サポートを追加しました。
- **新機能**: `RequestBuilder<*>.repeatCount`を追加し、GIFの繰り返し回数を設定できるようにしました。
- **新機能**: `BitmapPool`作成を公開APIに追加しました。
- **新機能**: `Request.Listener`メソッドに`@MainThread`アノテーションを付けました。

---

- 修正: `CoilContentProvider`をテスト可能にしました。
- 修正: リソースキャッシュキーにナイトモードを含めるようにしました。
- 修正: `ImageDecoder`ネイティブクラッシュを回避するために、ソースを一時的にディスクに書き込むようにしました。
- 修正: 連絡先の表示写真URIを正しく処理するようにしました。
- 修正: `CrossfadeDrawable`の子にtintを渡すようにしました。
- 修正: ソースを閉じないいくつかのインスタンスを修正しました。
- 修正: 破損/不完全なハードウェアビットマップ実装を持つデバイスのブラックリストを追加しました。

---

- SDK 29でコンパイルするようにしました。
- Kotlin Coroutinesを1.3.2に更新しました。
- OkHttpを3.12.6に更新しました。
- Okioを2.4.1に更新しました。
- `coil-base`の`appcompat-resources`を`compileOnly`から`implementation`に変更しました。

## [0.7.0] - 2019年9月8日

- **破壊的変更**: `ImageLoaderBuilder.okHttpClient(OkHttpClient.Builder.() -> Unit)`が`ImageLoaderBuilder.okHttpClient(() -> OkHttpClient)`になりました。初期化子もバックグラウンドスレッドで遅延呼び出しされるようになりました。**カスタム`OkHttpClient`を設定する場合、ディスクキャッシュを有効にするには`OkHttpClient.cache`を設定する必要があります。** カスタム`OkHttpClient`を設定しない場合、Coilはディスクキャッシュが有効なデフォルトの`OkHttpClient`を作成します。デフォルトのCoilキャッシュは`CoilUtils.createDefaultCache(context)`を使用して作成できます。例:

```kotlin
val imageLoader = ImageLoader(context) {
    okHttpClient {
        OkHttpClient.Builder()
            .cache(CoilUtils.createDefaultCache(context))
            .build()
    }
}
```

- **破壊的変更**: `Fetcher.key`にデフォルトの実装がなくなりました。
- **破壊的変更**: 以前は、最初に適用可能な`Mapper`のみが呼び出されていました。現在は、適用可能なすべての`Mapper`が呼び出されます。APIの変更はありません。
- **破壊的変更**: マイナーな名前付きパラメータの名前変更: `url` -> `uri`、`factory` -> `initializer`。

---

- **新機能**: `coil-svg`アーティファクト。これには、SVGを自動デコードする`SvgDecoder`が含まれています。[AndroidSVG](https://github.com/BigBadaboom/androidsvg)によって駆動されます。@rharterに感謝します。
- **新機能**: `load(String)`および`get(String)`が、サポートされている任意のURIスキームを受け入れるようになりました。例: `imageView.load("file:///path/to/file.jpg")`を実行できるようになりました。
- **新機能**: `ImageLoader`をリファクタリングし、`OkHttpClient`の代わりに`Call.Factory`を使用するようにしました。これにより、`ImageLoaderBuilder.okHttpClient { OkHttpClient() }`を使用してネットワークリソースを遅延初期化できます。@ZacSweersに感謝します。
- **新機能**: `RequestBuilder.decoder`を追加し、リクエストのデコーダを明示的に設定できるようにしました。
- **新機能**: `ImageLoaderBuilder.allowHardware`を追加し、`ImageLoader`のハードウェアビットマップをデフォルトで有効/無効にできるようにしました。
- **新機能**: `ImageDecoderDecoder`でのソフトウェアレンダリングをサポートしました。

---

- 修正: ベクタードローアブルのロードに関する複数のバグ。
- 修正: `WRAP_CONTENT`の`View`寸法をサポートしました。
- 修正: 8192バイトより長いEXIFデータのパースをサポートしました。
- 修正: クロスフェード時にアスペクト比の異なるドローアブルを伸ばさないようにしました。
- 修正: 例外によりネットワークオブザーバーの登録が失敗するのを防ぐようにしました。
- 修正: `MovieDrawable`でのゼロ除算エラーを修正しました。@R12rusに感謝します。
- 修正: ネストされたAndroidアセットファイルをサポートしました。@JaCzekanskiに感謝します。
- 修正: Android OおよびO_MR1でファイル記述子が不足するのを防ぐようにしました。
- 修正: メモリキャッシュを無効にしたときにクラッシュしないようにしました。@hansenjiに感謝します。
- 修正: `Target.cancel`が常にメインスレッドから呼び出されることを確認するようにしました。

---

- Kotlinを1.3.50に更新しました。
- Kotlin Coroutinesを1.3.0に更新しました。
- OkHttpを3.12.4に更新しました。
- Okioを2.4.0に更新しました。
- AndroidXの依存関係を最新の安定版に更新しました:
    - `androidx.appcompat:appcompat` -> 1.1.0
    - `androidx.core:core-ktx` -> 1.1.0
    - `androidx.lifecycle:lifecycle-common-java8` -> 2.1.0
- `appcompat`をオプションの`compileOnly`依存関係として`appcompat-resources`に置き換えました。`appcompat-resources`ははるかに小さいアーティファクトです。

## [0.6.1] - 2019年8月16日

- 新機能: `RequestBuilder`に`transformations(List<Transformation>)`を追加しました。
- 修正: ファイルURIのキャッシュキーに最終変更日を追加しました。
- 修正: `View`の寸法が少なくとも1pxと評価されるようにしました。
- 修正: フレーム間で`MovieDrawable`のキャンバスをクリアするようにしました。
- 修正: アセットを正しく開くようにしました。

## [0.6.0] - 2019年8月12日

- 初回リリース。