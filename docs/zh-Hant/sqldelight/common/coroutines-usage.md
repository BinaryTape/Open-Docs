```kotlin
val players: Flow<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asFlow()
    .mapToList(Dispatchers.IO)
```

這個 Flow 會發送查詢結果，並且每當該查詢相關的資料庫發生變更時，都會發送新的結果。