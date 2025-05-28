```kotlin
val players: Flow<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asFlow()
    .mapToList(Dispatchers.IO)
```

この`Flow`はクエリ結果を放出し、そのクエリに関連するデータベースが変更されるたびに新しい結果を放出します。