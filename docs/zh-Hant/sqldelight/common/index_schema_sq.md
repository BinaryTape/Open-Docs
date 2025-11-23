{% if not server %}## 定義綱要{% endif %}

在 `src/commonMain/sqldelight` 目錄下的 `.sq` 檔案中撰寫您的 SQL 語句。通常 `.sq` 檔案中的第一個語句會建立一個資料表，但您也可以建立索引或設定預設內容。

```sql title="src/commonMain/sqldelight/com/example/sqldelight/hockey/data/Player.sq"
CREATE TABLE hockeyPlayer (
  player_number INTEGER PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL
);

CREATE INDEX hockeyPlayer_full_name ON hockeyPlayer(full_name);

INSERT INTO hockeyPlayer (player_number, full_name)
VALUES (15, 'Ryan Getzlaf');