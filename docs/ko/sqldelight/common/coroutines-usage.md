```kotlin
val players: Flow<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asFlow()
    .mapToList(Dispatchers.IO)
```

이 Flow는 쿼리 결과를 내보내며, 해당 쿼리에 대한 데이터베이스가 변경될 때마다 새로운 결과를 내보냅니다.