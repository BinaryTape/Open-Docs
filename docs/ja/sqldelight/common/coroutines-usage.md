```kotlin
val players: Flow<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asFlow()
    .mapToList(Dispatchers.IO)
```

この Flow はクエリの結果を発行し、そのクエリに対してデータベースの変更が行われるたびに、新しい結果を発行します。