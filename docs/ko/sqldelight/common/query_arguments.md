## 타입 추론

SQLDelight는 사용자 지정 컬럼 타입을 포함하여 런타임 매개변수의 올바른 타입과 널 허용 여부를 추론합니다.

```sql
selectByNumber:
SELECT *
FROM hockeyPlayer
WHERE player_number = ?;
```

```kotlin
val selectNumber10 = playerQueries.selectByNumber(player_number = 10)
println(selectNumber10.executeAsOne())
// "Corey Perry"를 출력합니다.
```

## 명명된 인자

명명된 매개변수 또는 인덱싱된 매개변수를 사용할 수 있습니다.

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

## 가변 인자

값 집합도 인자로 전달될 수 있습니다.

```sql
selectByNames:
SELECT *
FROM hockeyPlayer
WHERE full_name IN ?;
```

```kotlin
playerQueries.selectByNames(listOf("Alec", "Jake", "Matt"))
```

## 삽입

`INSERT VALUES` 인자는 테이블의 데이터 클래스와 함께 바인딩될 수 있습니다.

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

## 입력 값 정제

SQLDelight는 쿼리 플레이스홀더를 사용하여 쿼리에 인자를 전달합니다.
인자 입력값의 실제 정제는 각 플랫폼 및 방언에 있는 하위 드라이버 구현에 의해 수행됩니다.