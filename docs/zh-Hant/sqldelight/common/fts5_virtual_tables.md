# FTS5 虛擬資料表

您可以使用 `CREATE VIRTUAL TABLE` 陳述式來定義 FTS5 虛擬資料表。

```sql
CREATE VIRTUAL TABLE data USING fts5(
  text
);
```

在查詢 FTS5 虛擬資料表內的隱藏欄位時，您需要使用一個因應措施來正確對應隱藏欄位：

```sql
searchFTS5:
SELECT
  rank AS rank,
  rowid AS rowid
FROM data
WHERE data MATCH ?
ORDER BY rank;