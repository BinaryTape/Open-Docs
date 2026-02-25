## 낙관적 잠금 (Optimistic Locking)

컬럼을 `LOCK`으로 지정하면, 해당 컬럼에 대해 값 타입이 생성되며, `UPDATE` 문이 업데이트를 수행할 때 해당 잠금을 올바르게 사용해야 합니다.

```sql
CREATE TABLE hockeyPlayer(
  id INT AS VALUE,
  version_number INT AS LOCK,
  name VARCHAR(8)
);

-- 이 문장은 실패합니다 (IDE 플러그인이 아래와 같이 다시 작성할 것을 권장합니다)
updateName:
UPDATE hockeyPlayer
SET name = ?;

-- 이 문장은 컴파일에 성공합니다
updateNamePassing:
UPDATE hockeyPlayer
SET name = ?
    version_number = :version_number + 1
WHERE version_number = :version_number;
```

## 마이그레이션에서의 커스텀 타입 (Custom Types in Migrations)

마이그레이션이 스키마의 소스(source of truth)인 경우, 테이블을 변경(alter)할 때 노출될 Kotlin 타입을 지정할 수도 있습니다:

```sql
import kotlin.String;
import kotlin.collection.List;

ALTER TABLE my_table
  ADD COLUMN new_column VARCHAR(8) AS List<String>;