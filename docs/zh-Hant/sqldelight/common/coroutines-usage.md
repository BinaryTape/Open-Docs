```kotlin
val players: Flow<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asFlow()
    .mapToList(Dispatchers.IO)
```

這個 Flow 會發出查詢結果，並在資料庫針對該查詢發生變更時，每次都發出新的結果。