```kotlin
val players: Flow<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asFlow()
    .mapToList(Dispatchers.IO)
```

这个 `Flow` 会发出查询结果，并且每当数据库针对该查询发生变化时，都会发出新的结果。