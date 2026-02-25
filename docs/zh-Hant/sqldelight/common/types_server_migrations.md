## 樂觀鎖 (Optimistic Locking)

如果你將某個欄位指定為 `LOCK`，系統會為其產生一個值型別，並要求 `UPDATE` 陳述式必須正確地使用該鎖來執行更新。

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- 這會失敗（且 IDE 外掛程式會建議改寫成如下所示）
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- 這會通過編譯
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## 遷移中的自訂型別 (Custom Types in Migrations)

如果遷移是架構的唯一事實來源，你也可以在修改資料表時指定公開的 Kotlin 型別：

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;