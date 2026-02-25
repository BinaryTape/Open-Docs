# 타입 프로젝션

기본적으로 쿼리는 프로젝션이 포함된 데이터 클래스를 반환하지만, 타입 안정성이 있는 매퍼(mapper)를 사용하여 이 동작을 재정의할 수 있습니다.

```kotlin
val selectAllNames = playerQueries.selectAll(
  mapper = { player_number, full_name -> full_name.toUppercase() }
)
println(selectAllNames.executeAsList())
// ["RYAN GETZLAF", "COREY PERRY"] 출력
```

일반적으로는 가능할 때마다 SQL을 활용하여 커스텀 프로젝션을 수행하는 것이 좋습니다.

```sql
selectNames:
SELECT upper(full_name)
FROM hockeyPlayer;
```

```kotlin
val selectAllNames = playerQueries.selectNames()
println(selectAllNames.executeAsList())
// ["RYAN GETZLAF", "COREY PERRY"] 출력