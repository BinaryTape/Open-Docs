# 타입 프로젝션

기본적으로 쿼리는 프로젝션(projection)이 적용된 데이터 클래스를 반환하지만, 타입 세이프 매퍼(typesafe mapper)를 사용하여 해당 동작을 재정의할 수 있습니다.

```kotlin
val selectAllNames = playerQueries.selectAll(
  mapper = { player_number, full_name -> full_name.toUppercase() }
)
println(selectAllNames.executeAsList())
// 출력: ["RYAN GETZLAF", "COREY PERRY"]
```

일반적으로 가능한 한 SQL을 활용하여 커스텀 프로젝션을 수행해야 합니다.

```sql
selectNames:
SELECT upper(full_name)
FROM hockeyPlayer;
```

```kotlin
val selectAllNames = playerQueries.selectNames()
println(selectAllNames.executeAsList())
// 출력: ["RYAN GETZLAF", "COREY PERRY"]