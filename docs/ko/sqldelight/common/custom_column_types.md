## 커스텀 컬럼 타입

컬럼을 커스텀 타입으로 조회하고 싶다면 Kotlin 타입을 지정할 수 있습니다.

```sql
import kotlin.String;
import kotlin.collections.List;

CREATE TABLE hockeyPlayer (
  cup_wins TEXT AS List<String> NOT NULL
);
```

하지만, `Database`를 생성하려면 데이터베이스 타입과 커스텀 타입 간에 매핑하는 방법을 아는 `ColumnAdapter`를 제공해야 합니다.

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

## Enum

편의를 위해 SQLDelight 런타임은 enum을 String 데이터로 저장하기 위한 `ColumnAdapter`를 포함합니다.

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

## 값 타입

SQLDelight는 요청 시 기본 데이터베이스 타입을 래핑하는 컬럼에 대한 값 타입을 생성할 수 있습니다.

```sql
CREATE TABLE hockeyPlayer (
  id INT AS VALUE
);