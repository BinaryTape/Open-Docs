```kotlin
val players: Flow<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asFlow()
    .mapToList(Dispatchers.IO)
```

此 Flow 会发射查询结果，并且每当该查询对应的数据库发生变更时，都会发射新的结果。