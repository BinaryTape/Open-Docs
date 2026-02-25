## 型別推論

SQLDelight 會推論執行時參數的正確型別與可 null 性，包括自訂資料行型別。

```sql
selectByNumber:
SELECT *
FROM hockeyPlayer
WHERE player_number = ?;
```

```kotlin
val selectNumber10 = playerQueries.selectByNumber(player_number = 10)
println(selectNumber10.executeAsOne())
// 輸出 "Corey Perry"
```

## 具名引數

可以使用具名參數或索引參數。

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

## 可變參數

數值集合也可以作為引數傳遞。

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

`INSERT VALUES` 引數可以與資料表的資料類別進行繫結。

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

## 輸入清理

SQLDelight 使用查詢占位符號將引數傳遞至查詢中。引數輸入的實際清理是由各個平台與方言對應的底層驅動程式實作負責處理。