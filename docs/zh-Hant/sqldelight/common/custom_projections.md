# 型別投影

預設情況下，查詢會傳回包含您投影內容的 data class，但您可以使用型別安全的對應器來覆寫此行為。

```kotlin
val selectAllNames = playerQueries.selectAll(
  mapper = { player_number, full_name -> full_name.toUppercase() }
)
println(selectAllNames.executeAsList())
// 印出 ["RYAN GETZLAF", "COREY PERRY"]
```

一般而言，您應該盡可能利用 SQL 來執行自訂投影。

```sql
selectNames:
SELECT upper(full_name)
FROM hockeyPlayer;
```

```kotlin
val selectAllNames = playerQueries.selectNames()
println(selectAllNames.executeAsList())
// 印出 ["RYAN GETZLAF", "COREY PERRY"]