SQLDelight 提供两种数据分页方法 — 基于偏移量的分页和键集分页。

## 基于偏移量的分页

偏移量分页使用 `OFFSET` 和 `LIMIT` 子句实现分页结果。创建一个执行基于偏移量分页的 `PagingSource` 需要一个计数查询以及分页查询。

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

如果未指定 context，默认情况下将在 `Dispatchers.IO` 上执行查询。期望使用 RxJava 的 `Scheduler` 执行查询的使用者应使用 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 扩展函数。

## 键集分页

偏移量分页简单且易于维护。遗憾的是，它在大型数据集上表现不佳。SQL 语句的 `OFFSET` 子句实际上只是丢弃了 SQL 查询中已经执行的行。因此，随着 `OFFSET` 数量的增长，执行查询所需的时间也会随之增加。为了克服这个问题，SQLDelight 提供了 `PagingSource` 的“键集分页”实现。键集分页不是查询整个数据集并低效地丢弃前 `OFFSET` 个元素，而是通过使用唯一列来限制查询的边界。虽然这需要开发者付出更高的维护成本，但性能更好。

此分页源接受的 `queryProvider` 回调有两个参数 — 一个 `beginInclusive` 非 null 唯一 `Key`，以及一个 `endExclusive` 可为 null 的唯一 `Key?`。核心分页查询示例如下所示。

```sql
keyedQuery:
SELECT * FROM hockeyPlayer
WHERE id >= :beginInclusive AND (id < :endExclusive OR :endExclusive IS NULL)
ORDER BY id ASC;
```

键集分页中使用的查询必须具有如上所示的唯一排序。

`beginInclusive` 和 `endExclusive` 都是作为页面边界的*预计算*键。页面大小在预计算页面边界时确定。`pageBoundariesProvider` 回调接受一个 `anchor: Key?` 参数以及一个 `limit: Int?` 参数。一个预计算页面边界的查询示例如下所示。

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

预计算 SQL 查询的页面边界可能需要 [SQLite 窗口函数 (Window Functions)](https://www.sqlite.org/windowfunctions.html)。窗口函数是在 SQLite 3.25.0 版本中引入的，因此在 Android API 30 之前默认不可用。要使用键集分页，SQLDelight 建议设置 `minApi 30` *或*捆绑您自己的 SQLite 版本。Requery 组织提供了一个作为独立库的 [最新版 SQLite 分发](https://github.com/requery/sqlite-android)。

AndroidX 分页库允许通过 `PagingConfig.initialLoadSize` 使第一页获取的大小与后续页面获取的大小不同。**应避免使用此功能**，因为 `pageBoundariesProvider` 回调仅在第一次页面获取时被调用一次。如果 `PagingConfig.initialLoadSize` 和 `PagingConfig.pageSize` 不匹配，将导致生成非预期的页面边界。

此分页源*不支持*跳转。

要创建此分页源，请使用 `QueryPagingSource` 工厂函数。

```kotlin
import app.cash.sqldelight.android.paging3.QueryPagingSource

val keyedSource = QueryPagingSource(
  transacter = playerQueries,
  context = Dispatchers.IO,
  pageBoundariesProvider = playerQueries::pageBoundaries,
  queryProvider = playerQueries::keyedQuery,
)
```

如果未指定 context，默认情况下将在 `Dispatchers.IO` 上执行查询。期望使用 RxJava 的 `Scheduler` 执行查询的使用者应使用 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 扩展函数。