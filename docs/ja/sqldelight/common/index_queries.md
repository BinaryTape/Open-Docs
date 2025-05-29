## 型安全なクエリの定義

SQLDelightは、`.sq`ファイル内のラベル付きSQLステートメントに対して型安全な関数を生成します。

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

ラベル付きステートメントを含む各`.sq`ファイルには、「Queries」オブジェクトが生成されます。
たとえば、上記の`Player.sq`ファイルに対しては`PlayerQueries`オブジェクトが生成されます。
このオブジェクトを使用して、実際のSQLステートメントを実行する生成された型安全な関数を呼び出すことができます。

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
    非同期ドライバーを使用する場合、クエリを実行する際はブロッキング関数である`executeAs*()`関数の代わりに、サスペンド関数である`awaitAs*()`拡張関数を使用してください。
{% endif %}

以上です！他の機能については、サイドバーの他のページを確認してください。