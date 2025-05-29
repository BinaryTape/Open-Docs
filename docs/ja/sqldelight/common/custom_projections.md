# 型プロジェクション

デフォルトでは、クエリはプロジェクションを含むデータクラスを返しますが、型安全なマッパーを使用してこの動作をオーバーライドできます。

```kotlin
val selectAllNames = playerQueries.selectAll(
  mapper = { player_number, full_name -> full_name.toUppercase() }
)
println(selectAllNames.executeAsList())
// Prints ["RYAN GETZLAF", "COREY PERRY"]
```

一般的に、可能な限りSQLを活用してカスタムプロジェクションを行うべきです。

```sql
selectNames:
SELECT upper(full_name)
FROM hockeyPlayer;
```

```kotlin
val selectAllNames = playerQueries.selectNames()
println(selectAllNames.executeAsList())
// Prints ["RYAN GETZLAF", "COREY PERRY"]