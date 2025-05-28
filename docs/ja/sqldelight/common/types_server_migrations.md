## 楽観的ロック

カラムを`LOCK`として指定すると、それに対して値型が生成され、さらに`UPDATE`ステートメントが更新を実行するためにロックを正しく使用する必要があります。

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- これは失敗します (そしてIDEプラグインは以下のように書き換えることを提案します)
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- これはコンパイルをパスします
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## マイグレーションにおけるカスタム型

マイグレーションがスキーマの信頼できる情報源である場合、テーブルを変更する際に公開されるKotlin型を指定することもできます。

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;
```