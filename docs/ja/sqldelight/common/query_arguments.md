## 型推論

SQLDelightは、カスタムカラム型を含むランタイムパラメータの正しい型とnull許容性を推論します。

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

## 名前付き引数

名前付きパラメータまたはインデックス付きパラメータを使用できます。

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

## 可変引数

値のセットも引数として渡すことができます。

```sql
selectByNames:
SELECT *
FROM hockeyPlayer
WHERE full_name IN ?;
```

```kotlin
playerQueries.selectByNames(listOf("Alec", "Jake", "Matt"))
```

## 挿入

`INSERT VALUES` の引数は、テーブルのデータクラスにバインドできます。

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

## 入力サニタイズ

SQLDelightは、クエリプレースホルダーを使用して引数をクエリに渡します。
引数入力の実際のサニタイズは、各プラットフォームおよび方言における基盤となるドライバ実装によって行われます。