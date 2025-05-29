SQLDelight 提供兩種分頁資料的方法 — 基於偏移的分頁 (offset based paging) 和鍵集分頁 (keyset paging)。

## 基於偏移的分頁 (Offset Based Paging)

偏移分頁使用 `OFFSET` 和 `LIMIT` 子句來實現分頁結果。建立一個執行基於偏移的分頁的 `PagingSource` 需要一個計數查詢以及分頁查詢。

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

預設情況下，如果未指定上下文，查詢會在 `Dispatchers.IO` 上執行。預期使用 RxJava `Scheduler` 來執行查詢的消費者應使用 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 擴展函數。

## 鍵集分頁 (Keyset Paging)

偏移分頁簡單且易於維護。不幸的是，它在大型資料集上性能不佳。SQL 語句中的 `OFFSET` 子句實際上只是丟棄已執行的行。因此，隨著 `OFFSET` 數量的增加，執行查詢所需的時間也會隨之增加。為了克服這個問題，SQLDelight 提供了一個 `PagingSource` 的「鍵集分頁」實作。鍵集分頁不是查詢整個資料集並低效地丟棄前 `OFFSET` 個元素，而是使用唯一的欄位來限制查詢的邊界。這會帶來更好的性能，但代價是開發人員的維護成本更高。

此分頁源接受的 `queryProvider` 回調有兩個參數 — 一個 `beginInclusive` 非空唯一 `Key` 以及一個 `endExclusive` 可空唯一 `Key?`。核心分頁查詢的範例如下所示。

```sql
keyedQuery:
SELECT * FROM hockeyPlayer
WHERE id >= :beginInclusive AND (id < :endExclusive OR :endExclusive IS NULL)
ORDER BY id ASC;
```

用於鍵集分頁的查詢必須具有如上所示的唯一排序。

`beginInclusive` 和 `endExclusive` 都是作為頁面邊界的_預先計算的_鍵。頁面大小是在預先計算頁面邊界時建立的。`pageBoundariesProvider` 回調接受一個 `anchor: Key?` 參數以及一個 `limit: Int?` 參數。預先計算頁面邊界的查詢範例如下所示。

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

預先計算 SQL 查詢的頁面邊界可能需要 [SQLite 視窗函數 (Window Functions)](https://www.sqlite.org/windowfunctions.html)。視窗函數是在 SQLite 3.25.0 版本中引入的，因此在 Android API 30 之前預設情況下不可用。為了使用鍵集分頁，SQLDelight 建議設定 `minApi 30` _或_ 捆綁您自己的 SQLite 版本。Requery 組織 [提供最新版本的 SQLite 作為獨立函式庫](https://github.com/requery/sqlite-android)。

AndroidX 分頁函式庫允許使用 `PagingConfig.initialLoadSize` 使第一個頁面提取的大小與後續頁面提取的大小不同。**應避免此功能**，因為 `pageBoundariesProvider` 回調在第一次頁面提取時只被呼叫一次。如果 `PagingConfig.initialLoadSize` 和 `PagingConfig.pageSize` 不匹配，將導致非預期的頁面邊界產生。

此分頁源_不_支援跳轉。

要建立此分頁源，請使用 `QueryPagingSource` 工廠函數。

```kotlin
import app.cash.sqldelight.android.paging3.QueryPagingSource

val keyedSource = QueryPagingSource(
  transacter = playerQueries,
  context = Dispatchers.IO,
  pageBoundariesProvider = playerQueries::pageBoundaries,
  queryProvider = playerQueries::keyedQuery,
)
```

預設情況下，如果未指定上下文，查詢會在 `Dispatchers.IO` 上執行。預期使用 RxJava `Scheduler` 來執行查詢的消費者應使用 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 擴展函數。