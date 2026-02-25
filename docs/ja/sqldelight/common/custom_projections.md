# 型のプロジェクション

デフォルトでは、クエリはプロジェクションを含むデータクラスを返しますが、型安全なマッパーを使用してその動作をオーバーライドできます。

```kotlin
val selectAllNames = playerQueries.selectAll(
  mapper = { player_number, full_name -> full_name.toUppercase() }
)
println(selectAllNames.executeAsList())
// ["RYAN GETZLAF", "COREY PERRY"] を出力します
```

原則として、カスタムプロジェクションを行う場合は、可能な限りSQLを活用すべきです。

```sql
selectNames:
SELECT upper(full_name)
FROM hockeyPlayer;
```

```kotlin
val selectAllNames = playerQueries.selectNames()
println(selectAllNames.executeAsList())
// ["RYAN GETZLAF", "COREY PERRY"] を出力します