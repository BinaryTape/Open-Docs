# 마이그레이션

`.sq` 파일은 빈 데이터베이스에서 최신 스키마를 생성하는 방법을 항상 설명합니다. 데이터베이스가 현재 이전 버전에 있는 경우, 마이그레이션 파일은 해당 데이터베이스를 최신 상태로 만듭니다. 마이그레이션 파일은 `.sq` 파일과 동일한 `sqldelight` 폴더에 저장됩니다.

```
src
└─ main
   └─ sqdelight
      ├─ com/example/hockey
      |  ├─ Team.sq
      |  └─ Player.sq
      └─ migrations
         ├─ 1.sqm
         └─ 2.sqm
```

드라이버가 지원하는 경우, 마이그레이션은 트랜잭션 내에서 실행됩니다. 일부 드라이버에서는 충돌을 일으킬 수 있으므로 마이그레이션을 `BEGIN/END TRANSACTION`으로 둘러싸지 않아야 합니다.

## 버전 관리

스키마의 첫 번째 버전은 1입니다. 마이그레이션 파일은 `<업그레이드할 이전 버전>.sqm` 형식으로 이름이 지정됩니다. 버전 2로 마이그레이션하려면 `1.sqm`에 마이그레이션 구문을 넣으세요.

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

이러한 SQL 구문은 `Database.Schema.migrate()` 메서드에 의해 실행됩니다. 마이그레이션 파일은 `.sq` 파일과 동일한 소스 세트에 있습니다.

## 마이그레이션 확인

`verifySqlDelightMigration` 태스크가 Gradle 프로젝트에 추가되며, `check` 태스크의 일부로 실행됩니다. SqlDelight 소스 세트(예: `src/main/sqldelight`)에 있는 `<버전 번호>.db`라는 이름의 `.db` 파일에 대해, `<버전 번호>.sqm`부터 시작하는 모든 마이그레이션을 적용하고 마이그레이션이 최신 스키마를 가진 데이터베이스를 생성하는지 확인합니다.

최신 스키마에서 `.db` 파일을 생성하려면 [gradle.md](gradle.md)에 설명된 대로 `schemaOutputDirectory`를 지정하면 사용할 수 있는 `generate<소스 세트 이름><데이터베이스 이름>Schema` 태스크를 실행하세요. 첫 번째 마이그레이션을 생성하기 전에 이를 수행하는 것이 좋습니다. 예를 들어, 프로젝트가 `"MyDatabase"`라는 사용자 지정 이름을 가진 `main` 소스 세트를 사용하는 경우, `generateMainMyDatabaseSchema` 태스크를 실행해야 합니다.

대부분의 사용 사례에서는 데이터베이스 초기 버전의 스키마를 나타내는 `1.db` 파일만 사용하는 것이 좋습니다. 여러 개의 `.db` 파일을 가지는 것은 허용되지만, 이는 각 `.db` 파일에 모든 마이그레이션이 적용되는 결과를 초래하여 많은 불필요한 작업을 야기합니다.

## 코드 마이그레이션

코드에서 마이그레이션을 실행하고 데이터 마이그레이션을 수행하고 싶다면 `Database.Schema.migrate` API를 사용할 수 있습니다.

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

다음 예시에서, 마이그레이션으로 1.sqm, 2.sqm, 3.sqm, 4.sqm, 5.sqm이 있다면, 위의 콜백은 데이터베이스가 버전 4일 때 3.sqm이 완료된 후에 발생합니다. 콜백 후에는 4.sqm에서 재개되어 남은 마이그레이션(이 경우 4.sqm과 5.sqm)을 완료하며, 이는 최종 데이터베이스 버전이 6이 됨을 의미합니다.