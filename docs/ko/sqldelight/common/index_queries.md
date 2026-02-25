## 타입 세이프(Typesafe) 쿼리 정의하기

SQLDelight는 `.sq` 파일에 레이블(labeled)이 지정된 모든 SQL 문에 대해 타입 세이프 함수를 생성합니다.

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

레이블이 지정된 문이 포함된 각 `.sq` 파일에 대해 "Queries" 객체가 생성됩니다.
예를 들어, 위에서 보여준 `Player.sq` 파일에 대해 `PlayerQueries` 객체가 생성됩니다.
이 객체를 사용하여 실제 SQL 문을 실행하는 생성된 타입 세이프 함수를 호출할 수 있습니다.

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
    비동기 드라이버를 사용할 때는 쿼리를 실행할 때 블로킹(blocking) 방식의 `executeAs*()` 함수 대신 중단(suspending) 방식의 `awaitAs*()` 확장 함수를 사용하세요.
{% endif %}

이상입니다! 다른 기능에 대해서는 사이드바의 다른 페이지들을 참조해 주세요.