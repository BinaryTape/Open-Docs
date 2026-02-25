SQLDelight 提供兩種資料分頁方法 — 基於位移的分頁（offset based paging）與鍵集分頁（keyset paging）。

## 基於位移的分頁 (Offset Based Paging)

位移分頁使用 `OFFSET` 與 `LIMIT` 子句來達成分頁結果。建立一個執行位移分頁的 `PagingSource` 需要一個計數查詢以及分頁查詢。

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

若未指定 context，預設會在 `Dispatchers.IO` 上執行查詢。預期使用 RxJava 的 `Scheduler` 來執行查詢的使用者，應使用 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 擴充方法。

## 鍵集分頁 (Keyset Paging)

位移分頁簡單且易於維護。遺憾的是，它在大型資料集上的效能表現不佳。SQL 陳述式的 `OFFSET` 子句實際上只是丟棄 SQL 查詢中已經執行的列。因此，隨著 `OFFSET` 數量的增加，執行查詢所需的時間也會隨之增加。為了解決這個問題，SQLDelight 提供了 `PagingSource` 的「鍵集分頁」實作。鍵集分頁並非查詢整個資料集並低效率地丟棄前 `OFFSET` 個元素，而是利用唯一欄位來限制查詢範圍。這能提供更好的效能，但代價是開發人員需要負擔更高的維護成本。

此分頁來源接受的 `queryProvider` 回呼具有兩個參數 — 一個非 null 的唯一 `Key` `beginInclusive` 以及一個可為 null 的唯一 `Key?` `endExclusive`。核心分頁查詢的範例如下所示。

```sql
keyedQuery:
SELECT * FROM hockeyPlayer
WHERE id >= :beginInclusive AND (id < :endExclusive OR :endExclusive IS NULL)
ORDER BY id ASC;
```

用於鍵集分頁的查詢必須具有如上所示的唯一排序。

`beginInclusive` 與 `endExclusive` 都是作為頁面邊界的「預先計算」金鑰。頁面大小是在預先計算頁面邊界時確定的。`pageBoundariesProvider` 回呼接受一個 `anchor: Key?` 參數以及一個 `limit: Int?` 參數。預先計算頁面邊界的查詢範例如下所示。

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

預先計算 SQL 查詢的頁面邊界可能需要 [SQLite 視窗函式](https://www.sqlite.org/windowfunctions.html)。視窗函式是在 SQLite 3.25.0 版本中引入的，因此在 Android API 30 之前預設無法使用。為了使用鍵集分頁，SQLDelight 建議設定 `minApi 30` 或綑綁您自己的 SQLite 版本。Requery 組織[提供了一個最新發行版](https://github.com/requery/sqlite-android)，將 SQLite 作為獨立程式庫提供。

AndroidX paging 程式庫允許透過 `PagingConfig.initialLoadSize` 讓第一頁抓取的大小與後續頁面抓取的大小不同。**應避免使用此功能**，因為 `pageBoundariesProvider` 回呼僅在第一次抓取頁面時呼叫一次。若 `PagingConfig.initialLoadSize` 與 `PagingConfig.pageSize` 不相符，將導致產生非預期的頁面邊界。

此分頁來源「不支援」跳轉。

若要建立此分頁來源，請使用 `QueryPagingSource` 工廠函式。

```kotlin
import app.cash.sqldelight.android.paging3.QueryPagingSource

val keyedSource = QueryPagingSource(
  transacter = playerQueries,
  context = Dispatchers.IO,
  pageBoundariesProvider = playerQueries::pageBoundaries,
  queryProvider = playerQueries::keyedQuery,
)
```

若未指定 context，預設會在 `Dispatchers.IO` 上執行查詢。預期使用 RxJava 的 `Scheduler` 來執行查詢的使用者，應使用 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 擴充方法。