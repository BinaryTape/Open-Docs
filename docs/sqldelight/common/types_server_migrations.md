## 乐观锁

如果你将某一列指定为 `LOCK`，系统将为其生成一个值类型，并且还要求 `UPDATE` 语句正确使用该锁来执行更新。

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- 这将失败（IDE 插件会建议重写为如下内容）
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- 这将通过编译
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## 迁移中的自定义类型

如果迁移是架构的单一事实来源，你还可以在修改表时指定公开的 Kotlin 类型：

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;