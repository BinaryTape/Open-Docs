# FTS5 가상 테이블

`CREATE VIRTUAL TABLE` 문을 사용하여 FTS5 가상 테이블을 정의할 수 있습니다.

```sql
CREATE VIRTUAL TABLE data USING fts5(
  text
);
```

FTS5 가상 테이블 내의 숨겨진 열을 쿼리할 때, 숨겨진 열을 올바르게 매핑하려면 해결 방법을 사용해야 합니다.

```sql
searchFTS5:
SELECT
  rank AS rank,
  rowid AS rowid
FROM data
WHERE data MATCH ?
ORDER BY rank;