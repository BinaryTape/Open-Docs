# 組合陳述式

您可以將多個 SQL 陳述式組合在一起，以便在交易中一次執行：

```sql
upsert {
  UPDATE myTable
  SET column1 = :column1,
      column2 = :column2
  WHERE id = :id;

  INSERT OR IGNORE INTO myTable (id, column1, column2)
  VALUES (:id, :column1, :column2);
}