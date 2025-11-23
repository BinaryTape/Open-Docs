# FTS5 仮想テーブル

`CREATE VIRTUAL TABLE` ステートメントを使用して、FTS5 仮想テーブルを定義できます。

```sql
CREATE VIRTUAL TABLE data USING fts5(
  text
);
```

FTS5 仮想テーブル内の隠しカラムをクエリする際、隠しカラムを正しくマッピングするために回避策を使用する必要があります。

```sql
searchFTS5:
SELECT
  rank AS rank,
  rowid AS rowid
FROM data
WHERE data MATCH ?
ORDER BY rank;