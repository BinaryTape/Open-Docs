# 구문 그룹화

여러 SQL 구문을 함께 묶어 트랜잭션 내에서 한 번에 실행할 수 있습니다.

```sql
upsert {
  UPDATE myTable
  SET column1 = :column1,
      column2 = :column2
  WHERE id = :id;

  INSERT OR IGNORE INTO myTable (id, column1, column2)
  VALUES (:id, :column1, :column2);
}