## 定義型別安全的查詢

SQLDelight 將為 `.sq` 檔案中任何標記的 SQL 陳述式生成型別安全的函式。

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

每個包含標記陳述式的 `.sq` 檔案都將生成一個 `Queries` 物件。例如，上述 `Player.sq` 檔案將生成一個 `PlayerQueries` 物件。此物件可用於呼叫生成的型別安全函式，這些函式將執行實際的 SQL 陳述式。

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
!!! warning "警告"
    使用非同步驅動程式時，請使用暫停的 `awaitAs*()` 擴充函式來執行查詢，而不是阻塞的 `executeAs*()` 函式。
{% endif %}

就這樣！請查看側邊欄中的其他頁面以了解其他功能。