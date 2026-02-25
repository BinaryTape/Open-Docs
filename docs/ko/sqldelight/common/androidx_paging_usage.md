SQLDelight은 데이터 페이징을 위해 오프셋 기반 페이징(offset based paging)과 키셋 페이징(keyset paging) 두 가지 방법을 제공합니다.

## 오프셋 기반 페이징 (Offset Based Paging)

오프셋 페이징은 `OFFSET` 및 `LIMIT` 절을 사용하여 페이징된 결과를 얻습니다. 오프셋 기반 페이징을 수행하는 `PagingSource`를 생성하려면 페이징 쿼리뿐만 아니라 카운트 쿼리(count query)도 필요합니다.

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

컨텍스트가 지정되지 않은 경우, 기본적으로 쿼리는 `Dispatchers.IO`에서 수행됩니다. RxJava의 `Scheduler`를 사용하여 쿼리를 수행하려는 사용자는 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 확장 함수를 사용해야 합니다.

## 키셋 페이징 (Keyset Paging)

오프셋 페이징은 간단하고 유지보수가 쉽습니다. 하지만 안타깝게도 대규모 데이터셋(dataset)에서는 성능이 떨어집니다. SQL 문의 `OFFSET` 절은 실제로는 SQL 쿼리에서 이미 실행된 행을 그냥 버리는 방식으로 작동하기 때문입니다. 따라서 `OFFSET` 숫자가 커질수록 쿼리 실행 시간도 늘어납니다. 이를 극복하기 위해 SQLDelight은 `PagingSource`의 "키셋 페이징" 구현체를 제공합니다. 키셋 페이징은 전체 데이터셋을 쿼리한 후 처음 `OFFSET`만큼의 요소를 비효율적으로 버리는 대신, 고유한 컬럼을 사용하여 쿼리의 범위를 제한하는 방식으로 작동합니다. 이는 개발자의 유지보수 비용이 더 드는 대신 더 나은 성능을 제공합니다.

이 페이징 소스가 허용하는 `queryProvider` 콜백은 두 개의 파라미터, 즉 null이 될 수 없는 고유한 `Key`인 `beginInclusive`와 null이 될 수 있는 고유한 `Key?`인 `endExclusive`를 가집니다. 핵심 페이징 쿼리의 예시는 다음과 같습니다.

```sql
keyedQuery:
SELECT * FROM hockeyPlayer
WHERE id >= :beginInclusive AND (id < :endExclusive OR :endExclusive IS NULL)
ORDER BY id ASC;
```

키셋 페이징에 사용되는 쿼리는 위와 같이 고유한 순서(unique ordering)를 가져야 합니다.

`beginInclusive`와 `endExclusive`는 모두 페이지 경계 역할을 하는 *미리 계산된(pre-calculated)* 키입니다. 페이지 크기는 페이지 경계를 미리 계산할 때 결정됩니다. `pageBoundariesProvider` 콜백은 `anchor: Key?` 파라미터와 `limit: Int?` 파라미터를 가집니다. 페이지 경계를 미리 계산하는 쿼리 예시는 다음과 같습니다.

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

SQL 쿼리의 페이지 경계를 미리 계산하려면 [SQLite 윈도우 함수(Window Functions)](https://www.sqlite.org/windowfunctions.html)가 필요할 가능성이 높습니다. 윈도우 함수는 SQLite 버전 3.25.0에서 도입되었으므로, Android API 30 이전 버전에서는 기본적으로 사용할 수 없습니다. 키셋 페이징을 사용하기 위해 SQLDelight은 `minApi 30`으로 설정하거나 자체 SQLite 버전을 번들로 제공할 것을 권장합니다. Requery 조직은 독립형 라이브러리로 [최신 버전의 SQLite 배포판](https://github.com/requery/sqlite-android)을 제공합니다.

AndroidX 페이징 라이브러리는 `PagingConfig.initialLoadSize`를 통해 첫 번째 페이지 페치(fetch) 크기를 후속 페이지 페치 크기와 다르게 설정할 수 있도록 허용합니다. 하지만 `pageBoundariesProvider` 콜백은 첫 번째 페이지 페치 시 한 번만 호출되므로 **이 기능은 사용하지 않아야 합니다**. `PagingConfig.initialLoadSize`와 `PagingConfig.pageSize`를 일치시키지 않으면 예상치 못한 페이지 경계가 생성될 수 있습니다.

이 페이징 소스는 점핑(jumping)을 지원하지 않습니다.

이 페이징 소스를 생성하려면 `QueryPagingSource` 팩토리 함수를 사용하세요.

```kotlin
import app.cash.sqldelight.android.paging3.QueryPagingSource

val keyedSource = QueryPagingSource(
  transacter = playerQueries,
  context = Dispatchers.IO,
  pageBoundariesProvider = playerQueries::pageBoundaries,
  queryProvider = playerQueries::keyedQuery,
)
```

컨텍스트가 지정되지 않은 경우, 기본적으로 쿼리는 `Dispatchers.IO`에서 수행됩니다. RxJava의 `Scheduler`를 사용하여 쿼리를 수행하려는 사용자는 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 확장 함수를 사용해야 합니다.