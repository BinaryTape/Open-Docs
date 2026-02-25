# FTS5 가상 테이블 (Virtual Tables)

`CREATE VIRTUAL TABLE` 문을 사용하여 FTS5 가상 테이블을 정의할 수 있습니다.

```sql
CREATE VIRTUAL TABLE data USING fts5(
  text
);
```

FTS5 가상 테이블 내의 숨겨진 컬럼(hidden columns)을 쿼리할 때는 숨겨진 컬럼을 올바르게 매핑하기 위해 다음과 같은 해결 방법(workaround)을 사용해야 합니다:

```sql
searchFTS5:
SELECT
  rank AS rank,
  rowid AS rowid
FROM data
WHERE data MATCH ?
ORDER BY rank;