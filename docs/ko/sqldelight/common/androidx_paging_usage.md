SQLDelight는 데이터 페이징을 위한 두 가지 방법인 오프셋 기반 페이징과 키셋 페이징을 제공합니다.

## 오프셋 기반 페이징

오프셋 페이징은 `OFFSET` 및 `LIMIT` 절을 사용하여 페이지화된 결과를 얻습니다. 오프셋 기반 페이징을 수행하는 `PagingSource`를 생성하려면 페이지네이션 쿼리뿐만 아니라 카운트 쿼리도 필요합니다.

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

기본적으로 컨텍스트가 지정되지 않은 경우 쿼리는 `Dispatchers.IO`에서 수행됩니다. RxJava의 `Scheduler`를 사용하여 쿼리를 수행하려는 소비자(개발자)는 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx-coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 확장 함수를 사용해야 합니다.

## 키셋 페이징

오프셋 페이징은 간단하고 유지보수하기 쉽습니다. 하지만 대규모 데이터셋에서는 성능이 좋지 않습니다. SQL 문의 `OFFSET` 절은 사실상 SQL 쿼리에서 이미 실행된 행을 단순히 버립니다. 따라서 `OFFSET` 숫자가 커질수록 쿼리 실행 시간도 길어집니다. 이를 극복하기 위해 SQLDelight는 `PagingSource`의 "키셋 페이징" 구현을 제공합니다. 전체 데이터셋을 쿼리하고 첫 `OFFSET` 요소를 비효율적으로 버리는 대신, 키셋 페이징은 고유한 열을 사용하여 쿼리의 범위를 제한합니다. 이는 개발자 유지보수 부담이 더 커지는 대가로 더 나은 성능을 제공합니다.

이 페이징 소스가 받는 `queryProvider` 콜백은 `beginInclusive`라는 null을 허용하지 않는 고유한 `Key` 매개변수와 `endExclusive`라는 null을 허용하는 고유한 `Key?` 매개변수를 가집니다. 핵심 페이징 쿼리 예시는 아래에 나와 있습니다.

```sql
keyedQuery:
SELECT * FROM hockeyPlayer
WHERE id >= :beginInclusive AND (id < :endExclusive OR :endExclusive IS NULL)
ORDER BY id ASC;
```

키셋 페이징에 사용되는 쿼리는 위에서 보여진 것처럼 고유한 정렬을 가져야 합니다.

`beginInclusive`와 `endExclusive`는 모두 페이지 경계 역할을 하는 _미리 계산된_ 키입니다. 페이지 크기는 페이지 경계를 미리 계산할 때 설정됩니다. `pageBoundariesProvider` 콜백은 `anchor: Key?` 매개변수와 `limit: Int?` 매개변수를 받습니다. 페이지 경계를 미리 계산하는 쿼리 예시는 아래에 나와 있습니다.

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

SQL 쿼리의 페이지 경계를 미리 계산하려면 아마도 [SQLite Window Functions](https://www.sqlite.org/windowfunctions.html)가 필요할 것입니다. 윈도우 함수는 SQLite 버전 3.25.0에 도입되었으므로, Android API 30 이전에는 기본적으로 사용할 수 없습니다. 키셋 페이징을 사용하려면 SQLDelight는 `minApi 30`을 설정하거나 자체 SQLite 버전을 번들링하는 것을 권장합니다. Requery 조직은 SQLite의 [최신 배포본](https://github.com/requery/sqlite-android)을 독립형 라이브러리로 제공합니다.

AndroidX 페이징 라이브러리는 `PagingConfig.initialLoadSize`를 사용하여 첫 번째 페이지 가져오기 크기가 이후 페이지 가져오기 크기와 다르게 허용합니다. `pageBoundariesProvider` 콜백은 첫 번째 페이지 가져오기 시 한 번만 호출되기 때문에 **이 기능은 피해야 합니다**. `PagingConifg.initialLoadSize`와 `PagingConfig.pageSize`가 일치하지 않으면 예상치 못한 페이지 경계 생성이 발생할 수 있습니다.

이 페이징 소스는 점프를 _지원하지 않습니다_.

이 페이징 소스를 생성하려면 `QueryPagingSource` 팩토리 함수를 사용하십시오.

```kotlin
import app.cash.sqldelight.android.paging3.QueryPagingSource

val keyedSource = QueryPagingSource(
  transacter = playerQueries,
  context = Dispatchers.IO,
  pageBoundariesProvider = playerQueries::pageBoundaries,
  queryProvider = playerQueries::keyedQuery,
)
```

기본적으로 컨텍스트가 지정되지 않은 경우 쿼리는 `Dispatchers.IO`에서 수행됩니다. RxJava의 `Scheduler`를 사용하여 쿼리를 수행하려는 소비자(개발자)는 [`Scheduler.asCoroutineDispatcher`](https://kotlin.github.io/kotlinx-coroutines/kotlinx-coroutines-rx2/kotlinx.coroutines.rx2/io.reactivex.-scheduler/as-coroutine-dispatcher.html) 확장 함수를 사용해야 합니다.