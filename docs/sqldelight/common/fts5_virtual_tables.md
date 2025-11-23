# FTS5 虚拟表

你可以使用 `CREATE VIRTUAL TABLE` 语句来定义一个 FTS5 虚拟表。

```sql
CREATE VIRTUAL TABLE data USING fts5(
  text
);
```

在查询 FTS5 虚拟表中的隐藏列时，你需要使用一个变通方法来正确映射隐藏列：

```sql
searchFTS5:
SELECT
  rank AS rank,
  rowid AS rowid
FROM data
WHERE data MATCH ?
ORDER BY rank;