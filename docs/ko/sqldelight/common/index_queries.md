## 타입 안전 쿼리 정의

SQLDelight는 `.sq` 파일에 있는 레이블이 지정된 SQL 문에 대해 타입 안전 함수를 생성합니다.

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

레이블이 지정된 문을 포함하는 `.sq` 파일마다 "Queries" 객체가 생성됩니다.
예를 들어, 위에서 보인 `Player.sq` 파일에 대해 `PlayerQueries` 객체가 생성됩니다.
이 객체는 생성된 타입 안전 함수를 호출하는 데 사용될 수 있으며, 이 함수들은 실제 SQL 문을 실행합니다.

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
    비동기 드라이버를 사용할 때, 쿼리를 실행할 때 블로킹 `executeAs*()` 함수 대신 `awaitAs*()` 서스펜딩 확장 함수를 사용하십시오.
{% endif %}

이것으로 끝입니다! 사이드바의 다른 페이지에서 다른 기능들을 확인하십시오.