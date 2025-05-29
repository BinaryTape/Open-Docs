## API

如果你想在一个事务下执行多个语句，请使用 `transaction` 函数。

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

要从事务中返回一个值，请使用 `transactionWithResult` 函数。

```kotlin
val players: List<Player> = database.playerQueries.transactionWithResult {
  database.playerQueries.selectAll().executeAsList()
}
```

## 回滚

如果事务中发生任何异常，事务将回滚。你可以在事务内部的任何位置手动回滚事务，但如果你的事务返回一个值，你将需要为事务指定一个返回值。

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

## 回调

你可以注册回调，使其在事务完成或回滚后发生：

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