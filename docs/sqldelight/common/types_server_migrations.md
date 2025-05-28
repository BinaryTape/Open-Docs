## 乐观锁

如果将某个列指定为 `LOCK`，它将为其生成一个值类型，并要求 `UPDATE` 语句正确使用该锁来执行更新。

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- This will fail (and the IDE plugin will suggest rewriting to the below)
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- This will pass compilation
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## 迁移中的自定义类型

如果迁移是模式的事实来源，那么在修改表时，您也可以指定暴露的 Kotlin 类型：

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;