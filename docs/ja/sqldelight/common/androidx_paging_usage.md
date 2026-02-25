SQLDelightは、データのページングのために、オフセットベースのページングとキーセットページングの2つのメソッドを提供しています。

## オフセットベースのページング (Offset Based Paging)

オフセットページングは、`OFFSET`句と`LIMIT`句を使用してページングの結果を取得します。オフセットベースのページングを実行する`PagingSource`を作成するには、件数取得（count）クエリとページングクエリの両方が必要です。

```sql
countPlayers:
SELECT count(*) FROM hockeyPlayer;

players:
SELECT *
FROM hockeyPlayer
LIMIT :limit OFFSET :offset;
```

```kotlin
import app.cash.sqldelight.android.paging3.QueryPagingSource

val pagingSource: PagingSource = QueryPagingSource(
  countQuery = playerQueries.countPlayers(),
  transacter = playerQueries,
  context = Dispatchers.IO,
  queryProvider = playerQueries::players,
)
```

コンテキストが指定されていない場合、デフォルトでクエリは`Dispatchers.IO`上で実行されます。クエリの実行にRxJavaの`Scheduler`を使用したい場合は、[`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html)拡張関数を使用してください。

## キーセットページング (Keyset Paging)

オフセットページングはシンプルでメンテナンスが容易です。しかし、残念ながら大規模なデータセットではパフォーマンスが低下します。SQLステートメントの`OFFSET`句は、実際にはSQLクエリですでに実行された行を単に破棄するだけです。そのため、`OFFSET`の数が増えるにつれて、クエリの実行にかかる時間も増加します。これを克服するために、SQLDelightは`PagingSource`の「キーセットページング (keyset paging)」の実装を提供しています。データセット全体をクエリして最初の`OFFSET`要素を非効率に破棄するのではなく、キーセットページングはユニークな列を使用してクエリの範囲を制限します。これによりパフォーマンスは向上しますが、開発者のメンテナンス負荷は高くなります。

このページングソースが受け取る`queryProvider`コールバックには、2つのパラメータがあります。null不可でユニークな`Key`である`beginInclusive`と、null許容でユニークな`Key?`である`endExclusive`です。コアとなるページングクエリの例を以下に示します。

```sql
keyedQuery:
SELECT * FROM hockeyPlayer
WHERE id >= :beginInclusive AND (id < :endExclusive OR :endExclusive IS NULL)
ORDER BY id ASC;
```

キーセットページングで使用されるクエリは、上記のようにユニークな順序（ordering）を持っている必要があります。

`beginInclusive`と`endExclusive`はどちらも、ページの境界として機能する *事前計算（pre-calculated）* されたキーです。ページサイズは、ページの境界を事前計算するときに確立されます。`pageBoundariesProvider`コールバックは、`anchor: Key?`パラメータと`limit: Int?`パラメータを受け取ります。ページの境界を事前計算するクエリの例を以下に示します。

```sql
pageBoundaries:
SELECT id 
FROM (
  SELECT
    id,
    CASE
      WHEN ((row_number() OVER(ORDER BY id ASC) - 0) % :limit) = 0 THEN 1
      WHEN id = :anchor THEN 1
      ELSE 0
    END page_boundary;
  FROM hockeyPlayer
  ORDER BY id ASC
)
WHERE page_boundary = 1;
```

SQLクエリのページ境界の事前計算には、多くの場合[SQLite Window Functions](https://www.sqlite.org/windowfunctions.html)が必要になります。ウィンドウ関数はSQLiteバージョン3.25.0で導入されたため、Android API 30まではデフォルトでは利用できません。キーセットページングを使用するために、SQLDelightは`minApi 30`を設定するか、独自のSQLiteバージョンを同梱（bundle）することを推奨しています。Requery組織は、スタンドアロンライブラリとして[SQLiteの最新のディストリビューションを提供](https://github.com/requery/sqlite-android)しています。

AndroidXのpagingライブラリでは、`PagingConfig.initialLoadSize`を使用して、最初のページのフェッチサイズを後続のページのフェッチサイズと異なるものに設定できます。**この機能は避けるべきです**。なぜなら、`pageBoundariesProvider`コールバックは最初のページフェッチ時に一度だけ呼び出されるからです。`PagingConifg.initialLoadSize`と`PagingConfig.pageSize`が一致しない場合、予期しないページ境界の生成結果を招くことになります。

このページングソースは、ジャンプ（jumping）を *サポートしていません*。

このページングソースを作成するには、`QueryPagingSource`ファクトリ関数を使用します。

```kotlin
import app.cash.sqldelight.android.paging3.QueryPagingSource

val keyedSource = QueryPagingSource(
  transacter = playerQueries,
  context = Dispatchers.IO,
  pageBoundariesProvider = playerQueries::pageBoundaries,
  queryProvider = playerQueries::keyedQuery,
)
```

コンテキストが指定されていない場合、デフォルトでクエリは`Dispatchers.IO`上で実行されます。クエリの実行にRxJavaの`Scheduler`を使用したい場合は、[`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html)拡張関数を使用してください。