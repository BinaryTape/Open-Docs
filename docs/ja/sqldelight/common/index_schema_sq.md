{% if not server %}## スキーマの定義{% endif %}

SQLステートメントは、`src/commonMain/sqldelight`配下の`.sq`ファイルに記述します。
通常、`.sq`ファイルの最初のステートメントはテーブルを作成しますが、インデックスを作成したり、デフォルトコンテンツを設定することもできます。

```sql title="src/commonMain/sqldelight/com/example/sqldelight/hockey/data/Player.sq"
CREATE TABLE hockeyPlayer (
  player_number INTEGER PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL
);

CREATE INDEX hockeyPlayer_full_name ON hockeyPlayer(full_name);

INSERT INTO hockeyPlayer (player_number, full_name)
VALUES (15, 'Ryan Getzlaf');