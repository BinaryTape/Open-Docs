## 定义类型安全查询

SQLDelight 将为 `.sq` 文件中的任何带标签的 SQL 语句生成一个类型安全函数。

```sql title="src/commonMain/sqldelight/com/example/sqldelight/hockey/data/Player.sq"
selectAll:
SELECT *
FROM hockeyPlayer;

insert:
INSERT INTO hockeyPlayer(player_number, full_name)
VALUES (?, ?);

insertFullPlayerObject:
INSERT INTO hockeyPlayer(player_number, full_name)
VALUES ?;
```

对于每个包含带标签语句的 `.sq` 文件，都会生成一个 "Queries" 对象。例如，对于上面所示的 `Player.sq` 文件，将生成一个 `PlayerQueries` 对象。此对象可用于调用生成的类型安全函数，这些函数将执行实际的 SQL 语句。

```kotlin
{% if async %}suspend {% endif %}fun doDatabaseThings(driver: SqlDriver) {
  val database = Database(driver)
  val playerQueries: PlayerQueries = database.playerQueries

  println(playerQueries.selectAll().{% if async %}await{% else %}execute{% endif %}AsList()) 
  // [HockeyPlayer(15, "Ryan Getzlaf")]

  playerQueries.insert(player_number = 10, full_name = "Corey Perry")
  println(playerQueries.selectAll().{% if async %}await{% else %}execute{% endif %}AsList()) 
  // [HockeyPlayer(15, "Ryan Getzlaf"), HockeyPlayer(10, "Corey Perry")]

  val player = HockeyPlayer(10, "Ronald McDonald")
  playerQueries.insertFullPlayerObject(player)
}
```

{% if async %}
!!! warning
    当使用异步驱动时，请使用挂起 (suspending) 的 `awaitAs*()` 扩展函数来运行查询，而不是阻塞 (blocking) 的 `executeAs*()` 函数。
{% endif %}

就是这样！请查看侧边栏中的其他页面，了解其他功能。