## カスタムカラム型

カスタム型としてカラムを取得したい場合は、Kotlin型を指定できます。

```sql
import kotlin.String;
import kotlin.collections.List;

CREATE TABLE hockeyPlayer (
  cup_wins TEXT AS List<String> NOT NULL
);
```

しかし、`Database` を作成するには、データベース型とカスタム型の間でマッピングする方法を知っている `ColumnAdapter` を提供する必要があります。

```kotlin
val listOfStringsAdapter = object : ColumnAdapter<List<String>, String> {
  override fun decode(databaseValue: String) =
    if (databaseValue.isEmpty()) {
      listOf()
    } else {
      databaseValue.split(",")
    }
  override fun encode(value: List<String>) = value.joinToString(separator = ",")
}

val queryWrapper: Database = Database(
  driver = driver,
  hockeyPlayerAdapter = hockeyPlayer.Adapter(
    cup_winsAdapter = listOfStringsAdapter
  )
)
```

## 列挙型

便宜上、SQLDelight ランタイムには、列挙型を String データとして保存するための `ColumnAdapter` が含まれています。

```sql
import com.example.hockey.HockeyPlayer;

CREATE TABLE hockeyPlayer (
  position TEXT AS HockeyPlayer.Position
)
```

```kotlin
val queryWrapper: Database = Database(
  driver = driver,
  hockeyPlayerAdapter = HockeyPlayer.Adapter(
    positionAdapter = EnumColumnAdapter()
  )
)
```

## 値型

要求された場合、SQLDelight は基となるデータベース型をラップするカラムの値型を生成できます。

```sql
CREATE TABLE hockeyPlayer (
  id INT AS VALUE
);