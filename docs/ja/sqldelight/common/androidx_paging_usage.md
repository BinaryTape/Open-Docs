SQLDelightは、オフセットベースのページングとキーセットページングという2つのデータページング方法を提供します。

## オフセットベースのページング

オフセットページングは、`OFFSET`句と`LIMIT`句を使用してページングされた結果を実現します。オフセットベースのページングを実行する`PagingSource`を作成するには、カウントクエリとページングされるクエリの両方が必要です。

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

デフォルトでは、コンテキストが指定されていない場合、クエリは`Dispatchers.IO`で実行されます。RxJavaの`Scheduler`を使用してクエリを実行することを想定しているコンシューマは、[`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html)拡張関数を使用すべきです。

## キーセットページング

オフセットページングはシンプルで保守が容易です。残念ながら、大規模なデータセットではパフォーマンスが低下します。SQLステートメントの`OFFSET`句は、実際にはSQLクエリですでに実行された行を単に破棄するだけです。したがって、`OFFSET`の数値が増加するにつれて、クエリの実行にかかる時間も増加します。これを克服するために、SQLDelightは`PagingSource`の「キーセットページング」実装を提供します。データセット全体をクエリし、最初の`OFFSET`要素を非効率的に破棄するのではなく、キーセットページングは一意の列を使用してクエリの境界を制限します。これは、開発者のメンテナンスコストが高くなるという犠牲を払って、より優れたパフォーマンスを発揮します。

このページングソースが受け入れる`queryProvider`コールバックは、`beginInclusive`というnull非許容の一意な`Key`と、`endExclusive`というnull許容の一意な`Key?`という2つのパラメータを持っています。コアページングクエリの例を以下に示します。

```sql
keyedQuery:
SELECT * FROM hockeyPlayer
WHERE id >= :beginInclusive AND (id < :endExclusive OR :endExclusive IS NULL)
ORDER BY id ASC;
```

キーセットページングで使用されるクエリは、上記のように一意の順序付けを持つ必要があります。

`beginInclusive`と`endExclusive`は、ページ境界として機能する_事前に計算された_キーです。ページ境界を事前に計算するときにページサイズが設定されます。`pageBoundariesProvider`コールバックは、`anchor: Key?`パラメータと`limit: Int?`パラメータを受け取ります。ページ境界を事前に計算するクエリの例を以下に示します。

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

SQLクエリのページ境界を事前に計算するには、[SQLite Window Functions](https://www.sqlite.org/windowfunctions.html)が必要となる可能性が高いです。ウィンドウ関数はSQLiteバージョン3.25.0で導入されたため、Android API 30まではデフォルトでは利用できません。キーセットページングを使用するには、SQLDelightは`minApi 30`を設定するか、独自のSQLiteバージョンをバンドルすることを推奨します。Requery組織は、スタンドアロンライブラリとしてSQLiteの[最新ディストリビューション](https://github.com/requery/sqlite-android)を提供しています。

AndroidX pagingライブラリでは、`PagingConfig.initialLoadSize`を使用して、最初のページフェッチのサイズを以降のページフェッチと異なるように設定できます。`pageBoundariesProvider`コールバックは最初のページフェッチ時に一度だけ呼び出されるため、**この機能は避けるべきです**。`PagingConfig.initialLoadSize`と`PagingConfig.pageSize`が一致しない場合、予期せぬページ境界の生成につながります。

このページングソースはジャンプを_サポートしていません_。

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

デフォルトでは、コンテキストが指定されていない場合、クエリは`Dispatchers.IO`で実行されます。RxJavaの`Scheduler`を使用してクエリを実行することを想定しているコンシューマは、[`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html)拡張関数を使用すべきです。