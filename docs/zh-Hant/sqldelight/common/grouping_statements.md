# 分組陳述式

您可以將多個 SQL 陳述式分組在一起，以便在一個交易內一次執行：

```sql
upsert {
  UPDATE myTable
  SET column1 = :column1,
      column2 = :column2
  WHERE id = :id;

  INSERT OR IGNORE INTO myTable (id, column1, column2)
  VALUES (:id, :column1, :column2);
}
```