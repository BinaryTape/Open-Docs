# ステートメントのグループ化

複数のSQLステートメントをまとめて、トランザクション内で一度に実行できます。

```sql
upsert {
  UPDATE myTable
  SET column1 = :column1,
      column2 = :column2
  WHERE id = :id;

  INSERT OR IGNORE INTO myTable (id, column1, column2)
  VALUES (:id, :column1, :column2);
}