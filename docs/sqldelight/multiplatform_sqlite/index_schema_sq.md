{% if not server %}## 定义模式{% endif %}

在 `src/commonMain/sqldelight` 下的 `.sq` 文件中编写您的 SQL 语句。通常，`.sq` 文件中的第一个语句会创建一个表，但您也可以创建索引或设置默认内容。

```sql title="src/commonMain/sqldelight/com/example/sqldelight/hockey/data/Player.sq"
CREATE TABLE hockeyPlayer (
  player_number INTEGER PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL
);

CREATE INDEX hockeyPlayer_full_name ON hockeyPlayer(full_name);

INSERT INTO hockeyPlayer (player_number, full_name)
VALUES (15, 'Ryan Getzlaf');