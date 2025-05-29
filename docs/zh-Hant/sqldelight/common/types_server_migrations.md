## 樂觀鎖定

如果將欄位指定為 `LOCK`，它會為其產生一個值型別，並要求 `UPDATE` 陳述式正確使用該鎖定來執行更新。

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- 這將會失敗（IDE 外掛會建議改寫成下面的形式）
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- 這將會通過編譯
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## 遷移中的自訂型別

如果遷移是綱要 (schema) 的事實來源，您也可以在修改表格時指定公開的 Kotlin 型別：

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;
```