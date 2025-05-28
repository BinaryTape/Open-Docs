## 自定义列类型

如果你想将列作为自定义类型检索，可以指定一个 Kotlin 类型：

```sql
import kotlin.String;
import kotlin.collections.List;

CREATE TABLE hockeyPlayer (
  cup_wins TEXT AS List<String> NOT NULL
);
```

然而，创建 `Database` 需要你提供一个 `ColumnAdapter`，它知道如何在数据库类型和你的自定义类型之间进行映射：

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

## 枚举

为了方便，SQLDelight 运行时包含一个 `ColumnAdapter`，用于将枚举存储为字符串数据。

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

## 值类型

如果需要，SQLDelight 可以为列生成一个值类型，该值类型会包装底层数据库类型：

```sql
CREATE TABLE hockeyPlayer (
  id INT AS VALUE
);