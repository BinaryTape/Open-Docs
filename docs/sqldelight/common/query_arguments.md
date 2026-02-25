## 类型推断

SQLDelight 会推断运行时形参的正确类型与为 null 性，包括自定义列类型。

```sql
selectByNumber:
SELECT *
FROM hockeyPlayer
WHERE player_number = ?;
```

```kotlin
val selectNumber10 = playerQueries.selectByNumber(player_number = 10)
println(selectNumber10.executeAsOne())
// Prints "Corey Perry"
```

## 命名实参

可以使用命名形参或索引形参。

```sql
firstOrLastName:
SELECT *
FROM hockeyPlayer
WHERE full_name LIKE ('% ' || :name)
OR full_name LIKE (:name || ' %');
```

```kotlin
playerQueries.firstOrLastName(name = "Ryan")
```

## 可变实参

一组值也可以作为实参传递。

```sql
selectByNames:
SELECT *
FROM hockeyPlayer
WHERE full_name IN ?;
```

```kotlin
playerQueries.selectByNames(listOf("Alec", "Jake", "Matt"))
```

## 插入

`INSERT VALUES` 实参可以绑定到表的 data class。

```sql
insertPlayer:
INSERT INTO hockeyPlayer
VALUES ?;
```

```kotlin
val rickardRakell = HockeyPlayer(
  full_name = "Rickard Rakell",
  number = 67
)
playerQueries.insertPlayer(rickardRakell)
```

## 输入净化

SQLDelight 使用查询占位符将实参传递到查询中。实参输入的实际净化由每个对应平台和方言的底层驱动程序实现负责。