# ステートメントのグループ化

複数のSQLステートメントをグループ化して、トランザクション内で一括して実行することができます。

```sql
upsert {
  UPDATE myTable
  SET column1 = :column1,
      column2 = :column2
  WHERE id = :id;

  INSERT OR IGNORE INTO myTable (id, column1, column2)
  VALUES (:id, :column1, :column2);
}