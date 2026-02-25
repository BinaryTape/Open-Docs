## 楽観的ロック

カラムを `LOCK` として指定すると、そのカラムに対して値型が生成されます。また、`UPDATE` ステートメントが更新を実行する際に、そのロックを正しく使用することが要求されるようになります。

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- これは失敗します（IDEプラグインは以下のように書き換えることを提案します）
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- これはコンパイルを通過します
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## マイグレーションにおけるカスタム型

マイグレーションがスキーマの信頼できる唯一の情報源（source of truth）である場合、テーブルを変更する際に公開される Kotlin の型を指定することもできます。

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;