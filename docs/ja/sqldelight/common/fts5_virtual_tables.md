# FTS5仮想テーブル

`CREATE VIRTUAL TABLE` 文を使用して、FTS5仮想テーブルを定義できます。

```sql
CREATE VIRTUAL TABLE data USING fts5(
  text
);
```

FTS5仮想テーブル内の隠しカラムをクエリする場合、隠しカラムを正しくマッピングするためにワークアラウンドを使用する必要があります：

```sql
searchFTS5:
SELECT
  rank AS rank,
  rowid AS rowid
FROM data
WHERE data MATCH ?
ORDER BY rank;