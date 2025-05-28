## API

複数のステートメントを1つのトランザクション内で実行したい場合は、`transaction` 関数を使用します。

```kotlin
val players = listOf<Player>()
database.playerQueries.transaction {
  players.forEach { player ->
    database.playerQueries.insert(
      player_number = player.number,
      full_name = player.fullName
    )
  }
}
```

トランザクションから値を返すには、`transactionWithResult` 関数を使用します。

```kotlin
val players: List<Player> = database.playerQueries.transactionWithResult {
  database.playerQueries.selectAll().executeAsList()
}
```

## ロールバック

トランザクション内でどこかで例外が発生した場合、トランザクションはロールバックされます。トランザクションのどこからでも手動でロールバックできますが、トランザクションが値を返す場合は、トランザクションが返す値を指定する必要があります。

```kotlin
database.playerQueries.transaction {
  players.forEach { player ->
    if (player.number == 0) rollback()
    database.playerQueries.insert(
      player_number = player.number,
      full_name = player.fullName
    )
  }
}
```

```kotlin
val numberInserted: Int = database.playerQueries.transactionWithResult {
  players.forEach { player ->
    if (player.number == 0) rollback(0)
    database.playerQueries.insert(
      player_number = player.number,
      full_name = player.fullName
    )
  }
  players.size
}
```

## コールバック

トランザクションが完了またはロールバックした後に実行されるコールバックを登録できます。

```kotlin
database.playerQueries.transaction {
  afterRollback { log("No players were inserted.") }
  afterCommit { log("${players.size} players were inserted.") }

  players.forEach { player ->
    database.playerQueries.insert(
      player_number = player.number,
      full_name = player.fullName
    )
  }
}