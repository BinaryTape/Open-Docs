# 마이그레이션(Migrations)

`.sq` 파일은 항상 빈 데이터베이스에서 최신 스키마(schema)를 생성하는 방법을 기술합니다. 데이터베이스가 현재 이전 버전인 경우, 마이그레이션 파일이 해당 데이터베이스를 최신 상태로 업데이트합니다. 마이그레이션 파일은 `.sq` 파일과 동일한 `sqldelight` 폴더에 저장됩니다.

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

드라이버가 지원하는 경우, 마이그레이션은 트랜잭션(transaction) 내에서 실행됩니다. 일부 드라이버에서 충돌을 일으킬 수 있으므로 마이그레이션 구문을 `BEGIN/END TRANSACTION`으로 감싸면 안 됩니다.

## 버전 관리(Versioning)

스키마의 첫 번째 버전은 1입니다. 마이그레이션 파일의 이름은 `<업그레이드 시작 버전>.sqm`으로 지정합니다. 버전 2로 마이그레이션하려면 `1.sqm`에 마이그레이션 문을 작성합니다.

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

이러한 SQL 문은 `Database.Schema.migrate()` 메서드에 의해 실행됩니다. 마이그레이션 파일은 `.sq` 파일과 동일한 소스 세트(source set)에 위치해야 합니다.

## 마이그레이션 검증(Verifying Migrations)

`verifySqlDelightMigration` 태스크가 Gradle 프로젝트에 추가되며, 이는 `check` 태스크의 일부로 실행됩니다. SqlDelight 소스 세트(예: `src/main/sqldelight`)에 있는 `<버전 번호>.db`라는 이름의 모든 `.db` 파일에 대해, `<버전 번호>.sqm`부터 시작하는 모든 마이그레이션을 적용하고, 마이그레이션 결과가 최신 스키마의 데이터베이스와 일치하는지 확인합니다.

최신 스키마에서 `.db` 파일을 생성하려면 `generate<소스 세트 이름><데이터베이스 이름>Schema` 태스크를 실행하세요. 이 태스크는 [gradle.md](gradle.md)에 설명된 대로 `schemaOutputDirectory`를 지정하면 사용할 수 있습니다. 첫 번째 마이그레이션을 만들기 전에 이 작업을 수행하는 것이 좋습니다. 예를 들어, 프로젝트에서 `"MyDatabase"`라는 사용자 정의 이름을 가진 `main` 소스 세트를 사용하는 경우, `generateMainMyDatabaseSchema` 태스크를 실행해야 합니다.

대부분의 경우 초기 버전의 스키마를 나타내는 `1.db` 파일 하나만 유지하는 것이 좋습니다. 여러 개의 `.db` 파일을 가질 수 있지만, 이 경우 각 `.db` 파일마다 모든 마이그레이션이 적용되므로 불필요한 작업이 많이 발생하게 됩니다.

## 코드 마이그레이션(Code Migrations)

코드에서 마이그레이션을 실행하고 데이터 마이그레이션을 수행하려는 경우 `Database.Schema.migrate` API를 사용할 수 있습니다.

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

다음 예시에서 마이그레이션 파일로 1.sqm, 2.sqm, 3.sqm, 4.sqm, 5.sqm이 있는 경우, 데이터베이스가 버전 4일 때 3.sqm이 완료된 후 위 콜백이 호출됩니다. 콜백 이후에는 4.sqm부터 다시 시작하여 나머지 마이그레이션(이 경우 4.sqm 및 5.sqm)을 완료하며, 최종 데이터베이스 버전은 6이 됩니다.