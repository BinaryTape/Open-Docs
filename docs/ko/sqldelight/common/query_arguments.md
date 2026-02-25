## 타입 추론 (Type Inference)

SQLDelight은 사용자 정의 컬럼 타입을 포함하여 런타임 파라미터의 올바른 타입과 null 허용 여부(nullability)를 추론합니다.

```sql
selectByNumber:
SELECT *
FROM hockeyPlayer
WHERE player_number = ?;
```

```kotlin
val selectNumber10 = playerQueries.selectByNumber(player_number = 10)
println(selectNumber10.executeAsOne())
// "Corey Perry" 출력
```

## 이름이 지정된 인자 (Named Arguments)

이름이 지정된 파라미터(Named parameters) 또는 인덱스 파라미터를 사용할 수 있습니다.

```sql
firstOrLastName:
SELECT *
FROM hockeyPlayer
WHERE full_name LIKE ('% ' || :name)
OR full_name LIKE (:name || ' %');
```

```kotlin
playerQueries.firstOrLastName(name = "Ryan")
```

## 가변 인자 (Variable Arguments)

값들의 집합(Sets of values)을 인자로 전달할 수도 있습니다.

```sql
selectByNames:
SELECT *
FROM hockeyPlayer
WHERE full_name IN ?;
```

```kotlin
playerQueries.selectByNames(listOf("Alec", "Jake", "Matt"))
```

## 삽입 (Inserts)

`INSERT VALUES` 인자는 테이블의 데이터 클래스와 바인딩할 수 있습니다.

```sql
insertPlayer:
INSERT INTO hockeyPlayer
VALUES ?;
```

```kotlin
val rickardRakell = HockeyPlayer(
  full_name = "Rickard Rakell",
  number = 67
)
playerQueries.insertPlayer(rickardRakell)
```

## 입력값 정제 (Input Sanitization)

SQLDelight은 쿼리에 인자를 전달하기 위해 쿼리 플레이스홀더(query placeholders)를 사용합니다.
실제 입력 인자의 정제(sanitization)는 각 플랫폼 및 방언(dialect)의 하위 드라이버 구현체에 의해 처리됩니다.