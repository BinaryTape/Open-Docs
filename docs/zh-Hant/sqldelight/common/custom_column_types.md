## 自訂欄位型別

如果您想將欄位擷取為自訂型別，可以指定一個 Kotlin 型別：

```sql
import kotlin.String;
import kotlin.collections.List;

CREATE TABLE hockeyPlayer (
  cup_wins TEXT AS List<String> NOT NULL
);
```

然而，建立 `Database` 將需要您提供一個 `ColumnAdapter`，它知道如何將資料庫型別映射到您的自訂型別：

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

## 列舉 (Enums)

為方便起見，SQLDelight 執行時 (runtime) 包含一個 `ColumnAdapter`，用於將列舉 (enum) 儲存為字串資料。

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

## 值型別

如果需要，SQLDelight 可以為欄位生成一個值型別，該型別會包裝底層 (underlying) 資料庫型別：

```sql
CREATE TABLE hockeyPlayer (
  id INT AS VALUE
);