## 낙관적 잠금

열을 `LOCK`로 지정하면 해당 열에 대한 값 유형이 생성되며, `UPDATE` 문이 업데이트를 수행하기 위해 해당 잠금을 올바르게 사용해야 합니다.

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- 이것은 실패합니다 (그리고 IDE 플러그인은 아래와 같이 다시 작성하도록 제안할 것입니다)
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- 이것은 컴파일을 통과합니다
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## 마이그레이션의 커스텀 타입

마이그레이션이 스키마의 신뢰할 수 있는 소스인 경우, 테이블을 변경할 때 노출되는 Kotlin 타입을 지정할 수도 있습니다:

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;