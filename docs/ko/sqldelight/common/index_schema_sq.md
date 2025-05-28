{% if not server %}## 스키마 정의{% endif %}

SQL 문은 `src/main/sqldelight` 경로 아래의 `.sq` 파일에 작성합니다.
일반적으로 `.sq` 파일의 첫 번째 문은 테이블을 생성하지만, 인덱스를 생성하거나 기본 콘텐츠를 설정할 수도 있습니다.

```sql title="src/main/sqldelight/com/example/sqldelight/hockey/data/Player.sq"
CREATE TABLE hockeyPlayer (
  player_number INTEGER PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL
);

CREATE INDEX hockeyPlayer_full_name ON hockeyPlayer(full_name);

INSERT INTO hockeyPlayer (player_number, full_name)
VALUES (15, 'Ryan Getzlaf');