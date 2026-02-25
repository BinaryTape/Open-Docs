# 类型投影

默认情况下，查询将返回一个包含投影的 data class，但您可以使用类型安全的映射器重写该行为。

```kotlin
val selectAllNames = playerQueries.selectAll(
  mapper = { player_number, full_name -> full_name.toUppercase() }
)
println(selectAllNames.executeAsList())
// 输出 ["RYAN GETZLAF", "COREY PERRY"]
```

通常情况下，您应该尽可能利用 SQL 来执行自定义投影。

```sql
selectNames:
SELECT upper(full_name)
FROM hockeyPlayer;
```

```kotlin
val selectAllNames = playerQueries.selectNames()
println(selectAllNames.executeAsList())
// 输出 ["RYAN GETZLAF", "COREY PERRY"]