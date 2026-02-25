## 定義型別安全查詢

SQLDelight 會為 `.sq` 檔案中任何帶有標籤的 SQL 陳述式產生型別安全函式。

```sql title="src/main/sqldelight/com/example/sqldelight/hockey/data/Player.sq"
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

系統會為每個包含標籤陳述式的 `.sq` 檔案產生一個「Queries」物件。
例如，系統會為上方所示的 `Player.sq` 檔案產生一個 `PlayerQueries` 物件。
此物件可用於呼叫產生的型別安全函式，這些函式將執行實際的 SQL 陳述式。

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
    當使用非同步驅動程式時，在執行查詢時請使用暫停式的 `awaitAs*()` 擴充函式，而非阻塞式的 `executeAs*()` 函式。
{% endif %}

就是這樣！請查看側邊欄中的其他頁面以了解其他功能。