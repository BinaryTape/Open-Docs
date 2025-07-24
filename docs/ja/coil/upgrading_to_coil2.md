# Coil 2.x へのアップグレード

これは、Coil 1.x から 2.x へのアップグレード時に発生する主な変更点と、それらにどう対応するかを重点的に説明する短いガイドです。このアップグレードガイドは、すべてのバイナリ互換性のない変更やソース互換性のない変更を網羅するものではありませんが、最も重要な変更点についてはカバーしています。

## 最小 API 21

Coil 2.x は最小 API 21 を要求します。これはComposeおよびOkHttp 4.xでも要求される最小APIです。

## ImageRequest のデフォルトスケール

Coil 2.x では、`ImageRequest` のデフォルトのスケールが `Scale.FILL` から `Scale.FIT` に変更されました。これは、`ImageView` のデフォルト `ScaleType` および `Image` のデフォルト `ContentScale` と一貫性を持たせるためです。`ImageView` を `ImageRequest.target` として設定した場合、スケールは引き続き自動検出されます。

## Size のリファクタリング

`Size` の `width` と `height` は、`Int` のピクセル値ではなく、2つの `Dimension` になりました。`Dimension` はピクセル値、または未定義/無制限の制約を表す `Dimension.Undefined` のいずれかです。例えば、サイズが `Size(400, Dimension.Undefined)` の場合、その画像は高さに関係なく幅が 400 ピクセルになるようにスケーリングされるべきであることを意味します。ピクセル値（存在する場合）を取得するには `pxOrElse` 拡張関数を使用できます。それ以外の場合はフォールバックを使用します。

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // Use the pixel value.
}
```

この変更は、ターゲットが1つの非境界寸法（例: `View` の `ViewGroup.LayoutParams.WRAP_CONTENT`、またはComposeの `Constraints.Infinity`）を持つケースのサポートを改善するために行われました。

## Compose

Coil 2.x は、機能の追加、安定性の向上、パフォーマンスの改善のために Compose の統合を大幅に再構築しました。

Coil 1.x では、画像を読み込むために `rememberImagePainter` を使用していました。

```kotlin
val painter = rememberImagePainter("https://example.com/image.jpg") {
    crossfade(true)
}

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

Coil 2.x では、`rememberImagePainter` が `rememberAsyncImagePainter` に変更され、以下の変更点があります。

- `ImageRequest` を構成するための末尾ラムダ引数が削除されました。
- Coil 2.x では、`rememberAsyncImagePainter` は `Image` と一貫性を持たせるためにデフォルトで `ContentScale.Fit` を使用しますが、Coil 1.x ではデフォルトで `ContentScale.Crop` を使用していました。そのため、`Image` でカスタムの `ContentScale` を設定する場合、それを `rememberAsyncImagePainter` にも渡す必要があります。

```kotlin
val painter = rememberAsyncImagePainter(
    model = ImageRequest.Builder(LocalContext.current)
        .data("https://example.com/image.jpg")
        .crossfade(true)
        .build(),
    contentScale = ContentScale.Crop
)

Image(
    painter = painter,
    contentDescription = null,
    contentScale = ContentScale.Crop
)
```

さらに、Coil には `AsyncImage` と `SubcomposeAsyncImage` のコンポーザブル関数が追加され、新機能が追加され、`rememberAsyncImagePainter` の設計上の制約の一部を回避できるようになりました。Compose の完全なドキュメントは[こちら](compose.md)で確認してください。

## ディスクキャッシュ

Coil 2.x は独自の公開ディスクキャッシュクラスを持ち、`imageLoader.diskCache` を使用してアクセスできます。Coil 1.x は OkHttp のディスクキャッシュに依存していましたが、もはや必要ありません。

1.x でディスクキャッシュを構成するには、`CoilUtils.createDefaultCache` を使用していました。

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

Coil 2.x では、`ImageLoader` と共に使用する場合、`OkHttpClient` に `Cache` オブジェクトを設定すべきではありません。代わりに、以下のようにディスクキャッシュオブジェクトを構成してください。

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

この変更は、機能を追加し、パフォーマンスを向上させるために行われました。

- 画像のデコード中にスレッド中断をサポート。
  - スレッド中断によりデコード操作を高速にキャンセルできます。これはリストを素早くスクロールする際に特に重要です。
  - カスタムディスクキャッシュを使用することで、Coil はネットワークソースがデコード前に完全にディスクに読み込まれることを保証できます。これは、データをディスクに書き込む処理は中断できないため必要です。デコードステップのみが中断可能です。OkHttp の `Cache` は Coil 2.0 では使用すべきではありません。なぜなら、すべてのデータがデコード前にディスクに書き込まれることを保証できないためです。
- `InputStream` をサポートしない、または `File` への直接アクセスを必要とするデコード API（例: `ImageDecoder`、`MediaMetadataRetriever`）のために、バッファリング/一時ファイルの作成を避ける。
- 公開された読み書き可能な `DiskCache` API を追加。

Coil 2.x では、`Cache-Control` およびその他のキャッシュヘッダーは引き続きサポートされますが、`Vary` ヘッダーは除外されます。これは、キャッシュが URL の一致のみをチェックするためです。さらに、応答コードが [200..300) の範囲にある応答のみがキャッシュされます。

Coil 1.x から 2.x へアップグレードする際、内部フォーマットが変更されたため、既存のディスクキャッシュはすべてクリアされます。

## 画像パイプラインのリファクタリング

Coil 2.x では、画像パイプラインクラスがより柔軟になるようにリファクタリングされました。変更点の概要リストを以下に示します。

- 新しいクラス `Keyer` が導入され、リクエストのメモリキャッシュキーを計算します。これは `Fetcher.key` を置き換えます。
- `Mapper`、`Keyer`、`Fetcher`、および `Decoder` は `null` を返すことで、コンポーネントリストの次の要素に処理を委譲できます。
- `Mapper.map` のシグネチャに `Options` を追加。
- `Fetcher.Factory` と `Decoder.Factory` を導入。これらのファクトリを使用して、特定の `Fetcher`/`Decoder` が適用可能かどうかを判断します。適用可能でない場合は `null` を返します。

## ビットマッププーリングの削除

Coil 2.x では、ビットマッププーリングおよびそれに関連するクラス（`BitmapPool`、`PoolableViewTarget`）が削除されました。削除された理由については[こちら](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528)を参照してください。