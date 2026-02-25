# Coil 2.x へのアップグレード

このガイドは、Coil 1.x から 2.x へアップグレードする際の主な変更点と、それらへの対応方法をまとめた短編ガイドです。このアップグレードガイドでは、バイナリやソースレベルでの非互換な変更をすべて網羅しているわけではありませんが、最も重要な変更について説明します。

## 最小 API レベル 21

Coil 2.x は、API レベル 21 以上を必要とします。これは Compose および OkHttp 4.x で必要とされる最小 API と同じです。

## ImageRequest のデフォルトスケール

Coil 2.x では、`ImageRequest` のデフォルトのスケール（scale）が `Scale.FILL` から `Scale.FIT` に変更されました。これは、`ImageView` のデフォルトの `ScaleType` や、`Image` のデフォルトの `ContentScale` と一貫性を持たせるためです。`ImageRequest.target` に `ImageView` を設定している場合、スケールは引き続き自動検出されます。

## Size のリファクタリング

`Size` の `width` と `height` は、`Int` 型のピクセル値ではなく、2 つの `Dimension` 型になりました。`Dimension` はピクセル値、または未定義/制約なしの状態を表す `Dimension.Undefined` のいずれかです。例えば、サイズが `Size(400, Dimension.Undefined)` の場合、高さに関係なく幅が 400 ピクセルになるように画像をスケールする必要があることを意味します。ピクセル値を取得するには `pxOrElse` 拡張関数を使用し、（ピクセル値が存在する場合）その値を取得するか、そうでなければフォールバック値を使用します。

```kotlin
val width = size.width.pxOrElse { -1 }
if (width > 0) {
    // ピクセル値を使用する
}
```

この変更は、ターゲットが片方の次元において制約を持たない場合（例：`View` の `ViewGroup.LayoutParams.WRAP_CONTENT` や、Compose の `Constraints.Infinity`）のサポートを改善するために行われました。

## Compose

Coil 2.x では、機能追加、安定性の向上、およびパフォーマンス改善のために Compose 統合が大幅に刷新されました。

Coil 1.x では、画像の読み込みに `rememberImagePainter` を使用していました。

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

Coil 2.x では `rememberImagePainter` が `rememberAsyncImagePainter` に変更され、以下の点が変更されました。

- `ImageRequest` を設定するための末尾のラムダ引数が削除されました。
- Coil 2.x では、`rememberAsyncImagePainter` は `Image` との一貫性を保つためにデフォルトで `ContentScale.Fit` を使用しますが、Coil 1.x では `ContentScale.Crop` がデフォルトでした。そのため、`Image` にカスタムの `ContentScale` を設定する場合、`rememberAsyncImagePainter` にもそれを渡す必要があります。

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

さらに、Coil には `AsyncImage` および `SubcomposeAsyncImage` コンポーザブル関数が追加されました。これらは新機能を追加し、`rememberAsyncImagePainter` の設計上の制限の一部を回避します。Compose の完全なドキュメントは[こちら](compose.md)で確認してください。

## ディスクキャッシュ

Coil 2.x は、`imageLoader.diskCache` を通じてアクセスできる独自の公開ディスクキャッシュクラスを持つようになりました。Coil 1.x は OkHttp のディスクキャッシュに依存していましたが、それは不要になりました。

1.x でディスクキャッシュを構成するには、`CoilUtils.createDefaultCache` を使用していました。

```kotlin
ImageLoader.Builder(context)
    .okHttpClient {
        OkHttpClient.Builder().cache(CoilUtils.createDefaultCache(context)).build()
    }
    .build()
```

Coil 2.x では、`ImageLoader` で使用する `OkHttpClient` に `Cache` オブジェクトを設定すべきではありません。代わりに、以下のようにディスクキャッシュオブジェクトを構成してください。

```kotlin
ImageLoader.Builder(context)
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .build()
    }
    .build()
```

この変更は、機能の追加とパフォーマンスの向上のために行われました。

- 画像デコード中のスレッド割り込み（thread interruption）をサポートします。
    - スレッド割り込みにより、デコード処理を迅速にキャンセルできます。これは、リストを高速にスクロールする場合に特に重要です。
    - カスタムのディスクキャッシュを使用することで、Coil はデコード前にネットワークソースがディスクに完全に読み込まれていることを保証できます。データのディスクへの書き込みは中断できませんが、デコードステップは中断できるため、これは重要です。Coil 2.0 では OkHttp の `Cache` を使用すべきではありません。なぜなら、デコード前にすべてのデータがディスクに書き込まれていることを保証できないからです。
- `InputStream` をサポートしていない、または `File` への直接アクセスを必要とするデコード API（`ImageDecoder`、`MediaMetadataRetriever` など）に対して、バッファリングや一時ファイルの作成を回避します。
- 公開の読み書き用 `DiskCache` API を追加します。

Coil 2.x では、`Cache-Control` やその他のキャッシュヘッダーは引き続きサポートされます。ただし、キャッシュは URL の一致のみを確認するため、`Vary` ヘッダーは除きます。また、レスポンスコードが [200..300) の範囲にあるレスポンスのみがキャッシュされます。

Coil 1.x から 2.x にアップグレードすると、内部フォーマットが変更されているため、既存のディスクキャッシュはすべてクリアされます。

## 画像パイプラインのリファクタリング

Coil 2.x は、より柔軟性を高めるために画像パイプラインクラスを刷新しました。主な変更点は以下の通りです。

- リクエストのメモリキャッシュキーを計算する新しいクラス `Keyer` を導入しました。これは `Fetcher.key` に代わるものです。
- `Mapper`、`Keyer`、`Fetcher`、`Decoder` は、コンポーネントリスト内の次の要素に処理を委譲するために `null` を返すことができます。
- `Mapper.map` のシグネチャに `Options` を追加しました。
- `Fetcher.Factory` と `Decoder.Factory` を導入しました。特定の `Fetcher`/`Decoder` が適用可能かどうかを判断するためにファクトリを使用します。その `Fetcher`/`Decoder` が適用できない場合は `null` を返します。

## ビットマッププールの削除

Coil 2.x は、ビットマッププール（bitmap pooling）と、それに関連するクラス（`BitmapPool`、`PoolableViewTarget`）を削除しました。削除された理由については[こちら](https://github.com/coil-kt/coil/discussions/1186#discussioncomment-2305528)を参照してください。