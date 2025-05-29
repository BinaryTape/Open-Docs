## 類型推斷

SQLDelight 將會推斷執行時參數的正確類型和可為空性，包括自訂欄位類型。

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

## 具名參數

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

## 多值參數

值集合也可以作為參數傳遞。

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

`INSERT VALUES` 參數可以綁定至表格的資料類別。

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

SQLDelight 使用查詢佔位符將參數傳遞至查詢。參數輸入的實際清理是由每個各自平台和變體上的底層驅動程式實作完成。