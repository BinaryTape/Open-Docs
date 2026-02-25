# FTS5 虚拟表

您可以使用 `CREATE VIRTUAL TABLE` 语句定义 FTS5 虚拟表。

```sql
CREATE VIRTUAL TABLE data USING fts5(
  text
);
```

在查询 FTS5 虚拟表中的隐藏列时，您需要使用一种变通方法来正确映射隐藏列：

```sql
searchFTS5:
SELECT
  rank AS rank,
  rowid AS rowid
FROM data
WHERE data MATCH ?
ORDER BY rank;