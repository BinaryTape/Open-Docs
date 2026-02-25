## 型推論

SQLDelightは、カスタムカラム型を含む実行時パラメータの正しい型とNull許容性（nullability）を推論します。

```sql
selectByNumber:
SELECT *
FROM hockeyPlayer
WHERE player_number = ?;
```

```kotlin
val selectNumber10 = playerQueries.selectByNumber(player_number = 10)
println(selectNumber10.executeAsOne())
// "Corey Perry" を出力
```

## 名前付き引数

名前付きパラメータ、またはインデックス付きパラメータを使用できます。

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

## 可変長引数

値のセットを引数として渡すこともできます。

```sql
selectByNames:
SELECT *
FROM hockeyPlayer
WHERE full_name IN ?;
```

```kotlin
playerQueries.selectByNames(listOf("Alec", "Jake", "Matt"))
```

## インサート

`INSERT VALUES` の引数は、テーブルのデータクラスにバインドすることができます。

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

## 入力のサニタイズ

SQLDelightは、クエリに引数を渡すためにクエリプレースホルダーを使用します。
引数入力の実際のサニタイズは、各プラットフォームやダイアレクト（方言）における、基盤となるドライバーの実装によって行われます。