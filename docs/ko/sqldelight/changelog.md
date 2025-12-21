# 변경 로그

## 미출시

### 추가
- [Gradle 플러그인] 시작 스키마 버전이 1이 아니고 `verifyMigrations`가 true일 때 빌드 실패를 수정했습니다 (#6017 by @neilgmiller)
- [Gradle 플러그인] `SqlDelightWorkerTask`를 더 구성 가능하도록 만들고, Windows 개발을 지원하도록 기본 구성을 업데이트했습니다 (#5215 by @MSDarwish2000)
- [SQLite 다이얼렉트] FTS5 가상 테이블에서 합성된 열 지원을 추가했습니다 (#5986 by @watbe)

### 변경
- [컴파일러] 패키지 이름에 밑줄 사용을 허용했습니다. 이전에는 밑줄이 정리되어 예상치 못한 동작이 발생했습니다 (#6027 by @BierDav)
- [Paging 확장] AndroidX Paging으로 전환했습니다 (#5910 by @jeffdgr8)

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 추가
- [PostgreSQL 다이얼렉트] Postgres 숫자/정수/큰 정수 타입 매핑을 수정했습니다 (#5994 by @griffio)
- [컴파일러] CAST가 필요할 때 소스 파일 위치를 포함하도록 컴파일러 오류 메시지를 개선했습니다 (#5979 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres JSON 연산자 경로 추출 지원을 추가했습니다 (#5971 by @griffio)
- [SQLite 다이얼렉트] 공통 테이블 표현식(Common Table Expressions)을 사용하는 MATERIALIZED 쿼리 플래너 힌트(query planner hint)에 대한 Sqlite 3.35 지원을 추가했습니다 (#5961 by @griffio)
- [PostgreSQL 다이얼렉트] 공통 테이블 표현식(Common Table Expressions)을 사용하는 MATERIALIZED 쿼리 플래너 힌트(query planner hint)에 대한 지원을 추가했습니다 (#5961 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres JSON 집계 필터(Aggregate FILTER) 지원을 추가했습니다 (#5957 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres Enum 지원을 추가했습니다 (#5935 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres 트리거(Triggers)에 대한 제한된 지원을 추가했습니다 (#5932 by @griffio)
- [PostgreSQL 다이얼렉트] SQL 표현식이 JSON으로 파싱될 수 있는지 확인하는 조건자(predicate)를 추가했습니다 (#5843 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql COMMENT ON 문에 대한 제한된 지원을 추가했습니다 (#5808 by @griffio)
- [MySQL 다이얼렉트] 인덱스 가시성 옵션 지원을 추가했습니다 (#5785 by @orenkislev-faire)
- [PostgreSQL 다이얼렉트] TSQUERY 데이터 타입 지원을 추가했습니다 (#5779 by @griffio)
- [Gradle 플러그인] 모듈 추가 시 버전 카탈로그(version catalogs) 지원을 추가했습니다 (#5755 by @DRSchlaubi)

### 변경
- 개발 중인 스냅샷(snapshots)은 이제 https://central.sonatype.com/repository/maven-snapshots/ 에 있는 Central Portal Snapshots 저장소에 게시됩니다.
- [컴파일러] 생성자 참조(constructor references)를 사용하여 기본 생성된 쿼리를 단순화했습니다 (#5814 by @jonapoul)

### 수정
- [컴파일러] 공통 테이블 표현식(Common Table Expression)을 포함하는 뷰 사용 시 스택 오버플로우(stack overflow)를 수정했습니다 (#5928 by @griffio)
- [Gradle 플러그인] "새 연결(New Connection)" 추가를 위해 SqlDelight 도구 창을 열 때 발생하는 크래시를 수정했습니다 (#5906 by @griffio)
- [IntelliJ 플러그인] copy-to-sqlite 거터 액션(gutter action)에서 스레딩 관련 크래시를 방지했습니다 (#5901 by @griffio)
- [IntelliJ 플러그인] CREATE INDEX 및 CREATE VIEW 스키마 문(schema statements) 사용 시 PostgreSql 다이얼렉트에 대한 수정을 적용했습니다 (#5772 by @griffio)
- [컴파일러] 열 참조 시 FTS 스택 오버플로우(stack overflow)를 수정했습니다 (#5896 by @griffio)
- [컴파일러] With Recursive 스택 오버플로우를 수정했습니다 (#5892 by @griffio)
- [컴파일러] INSERT|UPDATE|DELETE RETURNING 문에 대한 알림(Notify)을 수정했습니다 (#5851 by @griffio)
- [컴파일러] Long을 반환하는 트랜잭션 블록(transaction blocks)에 대한 비동기 결과 타입(async result type)을 수정했습니다 (#5836 by @griffio)
- [컴파일러] SQL 매개변수 바인딩(parameter binding) 복잡도(complexity)를 O(n²)에서 O(n)으로 최적화했습니다 (#5898 by @chenf7)
- [SQLite 다이얼렉트] Sqlite 3.18 누락된 함수를 수정했습니다 (#5759 by @griffio)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

일부 아티팩트가 부분적으로 게시되어 릴리스에 실패했습니다. 2.2.1 버전을 사용하세요!

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 추가
- [WASM 드라이버] 웹 워커(web worker) 드라이버에 wasmJs 지원을 추가했습니다 (#5534 by @IlyaGulya)
- [PostgreSQL 다이얼렉트] PostgreSql 배열을 행으로 언네스트(UnNest)하는 기능 지원을 추가했습니다 (#5673 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql TSRANGE/TSTZRANGE 지원을 추가했습니다 (#5297 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql RIGHT FULL JOIN 지원을 추가했습니다 (#5086 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql 시간 관련(temporal) 타입에서 추출 기능 지원을 추가했습니다 (#5273 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 배열 포함(array contains) 연산자 지원을 추가했습니다 (#4933 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 제약 조건(constraint) 제거 지원을 추가했습니다 (#5288 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql 타입 캐스팅(type casting) 지원을 추가했습니다 (#5089 by @griffio)
- [PostgreSQL 다이얼렉트] 서브쿼리(subquery)를 위한 PostgreSql LATERAL JOIN 연산자 지원을 추가했습니다 (#5122 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql ILIKE 연산자 지원을 추가했습니다 (#5330 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql XML 타입 지원을 추가했습니다 (#5331 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql AT TIME ZONE 지원을 추가했습니다 (#5243 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL ORDER BY NULLS 지원을 추가했습니다 (#5199 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL 현재 날짜/시간 함수 지원을 추가했습니다 (#5226 by @drewd)
- [PostgreSQL 다이얼렉트] PostgreSql 정규 표현식(Regex) 연산자 지원을 추가했습니다 (#5137 by @griffio)
- [PostgreSQL 다이얼렉트] BRIN GIST를 추가했습니다 (#5059 by @griffio)
- [MySQL 다이얼렉트] MySQL 다이얼렉트에서 RENAME INDEX 지원을 추가했습니다 (#5212 by @orenkislev-faire)
- [JSON 확장] JSON 테이블 함수에 별칭(alias)을 추가했습니다 (#5372 by @griffio)

### 변경
- [컴파일러] 생성된 쿼리 파일이 단순 뮤테이터(simple mutators)에 대한 행 개수(row counts)를 반환하도록 변경했습니다 (#4578 by @MariusVolkhart)
- [네이티브 드라이버] `NativeSqlDatabase.kt`를 업데이트하여 DELETE, INSERT, UPDATE 문에 대한 읽기 전용(readonly) 플래그를 변경했습니다 (#5680 by @griffio)
- [PostgreSQL 다이얼렉트] PgInterval을 String으로 변경했습니다 (#5403 by @griffio)
- [PostgreSQL 다이얼렉트] SqlDelight 모듈이 PostgreSQL 확장 기능(extensions)을 구현하도록 지원했습니다 (#5677 by @griffio)

### 수정
- [컴파일러] 수정: 결과와 함께 그룹 문(group statements)을 실행할 때 쿼리 알림 (#5006 by @vitorhugods)
- [컴파일러] SqlDelightModule 타입 리졸버(type resolver)를 수정했습니다 (#5625 by @griffio)
- [컴파일러] 5501번 이슈 수정: 객체 이스케이프된 열 삽입 (#5503 by @griffio)
- [컴파일러] 컴파일러: 오류 메시지를 개선하여 경로 링크(path links)가 올바른 줄 및 문자 위치(line & char position)로 클릭 가능하도록 했습니다 (#5604 by @vanniktech)
- [컴파일러] 5298번 이슈 수정: 키워드(keywords)를 테이블 이름으로 사용할 수 있도록 허용
- [컴파일러] 명명된 실행(named executes)을 수정하고 테스트를 추가했습니다
- [컴파일러] 초기화 문(initialization statements) 정렬 시 외래 키 테이블 제약 조건(foreign key table constraints)을 고려했습니다 (#5325 by @TheMrMilchmann)
- [컴파일러] 탭이 포함된 경우 오류 밑줄을 올바르게 정렬했습니다 (#5224 by @drewd)
- [JDBC 드라이버] 트랜잭션 종료 중 `connectionManager`의 메모리 누수(memory leak)를 수정했습니다
- [JDBC 드라이버] 문서에 언급된 대로 트랜잭션 내에서 SQLite 마이그레이션을 실행했습니다 (#5218 by @morki)
- [JDBC 드라이버] 트랜잭션 커밋/롤백 후 연결 누수(leaking connections)를 수정했습니다 (#5205 by @morki)
- [Gradle 플러그인] `GenerateSchemaTask` 이전에 `DriverInitializer`를 실행했습니다 (#5562 by @nwagu)
- [런타임] 실제 드라이버가 비동기(Async)일 때 `LogSqliteDriver`의 크래시(crash)를 수정했습니다 (#5723 by @edenman)
- [런타임] `StringBuilder` 용량(capacity)을 수정했습니다 (#5192 by @janbina)
- [PostgreSQL 다이얼렉트] PostgreSql CREATE OR REPLACE VIEW를 수정했습니다 (#5407 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql TO_JSON을 수정했습니다 (#5606 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 숫자(numeric) 리졸버를 수정했습니다 (#5399 by @griffio)
- [PostgreSQL 다이얼렉트] SQLite 윈도우 함수(windows function)를 수정했습니다 (#2799 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql SELECT DISTINCT ON을 수정했습니다 (#5345 by @griffio)
- [PostgreSQL 다이얼렉트] ALTER TABLE ADD COLUMN IF NOT EXISTS를 수정했습니다 (#5309 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql 비동기 바인딩 매개변수(async bind parameter)를 수정했습니다 (#5313 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 부울 리터럴(boolean literals)을 수정했습니다 (#5262 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 윈도우 함수(window functions)를 수정했습니다 (#5155 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql isNull isNotNull 타입을 수정했습니다 (#5173 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql SELECT DISTINCT를 수정했습니다 (#5172 by @griffio)
- [Paging 확장] 페이징 초기 로드 새로 고침 수정 (#5615 by @evant)
- [Paging 확장] MacOS 네이티브 타겟을 추가했습니다 (#5324 by @vitorhugods)
- [IntelliJ 플러그인] K2 지원

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 추가
- [PostgreSQL 다이얼렉트] PostgreSQL STRING_AGG 함수를 추가했습니다 (#4950 by @anddani)
- [PostgreSQL 다이얼렉트] Postgres 다이얼렉트에 SET 문을 추가했습니다 (#4927 by @de-luca)
- [PostgreSQL 다이얼렉트] PostgreSql 열 시퀀스 매개변수를 추가했습니다 (#4916 by @griffio)
- [PostgreSQL 다이얼렉트] INSERT 문에 대한 postgresql 열 기본값 변경 지원을 추가했습니다 (#4912 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 시퀀스 변경 및 시퀀스 제거를 추가했습니다 (#4920 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres 정규 표현식(Regex) 함수 정의를 추가했습니다 (#5025 by @MariusVolkhart)
- [PostgreSQL 다이얼렉트] GIN에 대한 문법을 추가했습니다 (#5027 by @griffio)

### 변경
- [IDE 플러그인] 최소 버전 2023.1 / Android Studio Iguana
- [컴파일러] 캡슐화 타입에서 타입 널 허용 여부(nullability) 재정의를 허용했습니다 (#4882 by @eygraber)
- [컴파일러] `SELECT *`에 대한 열 이름을 인라인화했습니다
- [Gradle 플러그인] `processIsolation`으로 전환했습니다 (#5068 by @nwagu)
- [Android 런타임] Android minSDK를 21로 증가시켰습니다 (#5094 by @hfhbd)
- [드라이버] 다이얼렉트 작성자를 위해 더 많은 JDBC/R2DBC 문 메서드를 노출했습니다 (#5098 by @hfhbd)

### 수정
- [PostgreSQL 다이얼렉트] postgresql ALTER TABLE ALTER COLUMN을 수정했습니다 (#4868 by @griffio)
- [PostgreSQL 다이얼렉트] 4448번 이슈: 테이블 모델에 대한 누락된 임포트를 수정했습니다 (#4885 by @griffio)
- [PostgreSQL 다이얼렉트] 4932번 이슈: postgresql 기본 제약 조건 함수를 수정했습니다 (#4934 by @griffio)
- [PostgreSQL 다이얼렉트] 4879번 이슈: 마이그레이션 중 ALTER TABLE RENAME COLUMN에서 postgresql 클래스 캐스트 오류를 수정했습니다 (#4880 by @griffio)
- [PostgreSQL 다이얼렉트] 4474번 이슈: PostgreSql CREATE EXTENSION을 수정했습니다 (#4541 by @griffio)
- [PostgreSQL 다이얼렉트] 5018번 이슈: PostgreSql 기본 키(Primary Key)에 널 허용 안 함(not nullable) 타입 추가를 수정했습니다 (#5020 by @griffio)
- [PostgreSQL 다이얼렉트] 4703번 이슈: 집계 표현식(aggregate expressions)을 수정했습니다 (#5071 by @griffio)
- [PostgreSQL 다이얼렉트] 5028번 이슈: PostgreSql JSON을 수정했습니다 (#5030 by @griffio)
- [PostgreSQL 다이얼렉트] 5040번 이슈: PostgreSql JSON 연산자를 수정했습니다 (#5041 by @griffio)
- [PostgreSQL 다이얼렉트] 5040번 이슈에 대한 JSON 연산자 바인딩을 수정했습니다 (#5100 by @griffio)
- [PostgreSQL 다이얼렉트] 5082번 이슈: tsvector를 수정했습니다 (#5104 by @griffio)
- [PostgreSQL 다이얼렉트] 5032번 이슈: PostgreSql UPDATE FROM 문에 대한 열 인접성(column adjacency)을 수정했습니다 (#5035 by @griffio)
- [SQLite 다이얼렉트] 4897번 이슈: sqlite ALTER TABLE RENAME COLUMN을 수정했습니다 (#4899 by @griffio)
- [IDE 플러그인] 오류 핸들러 크래시를 수정했습니다 (#4988 by @aperfilyev)
- [IDE 플러그인] IDEA 2023.3에서 BugSnag 초기화에 실패했습니다 (by @aperfilyev)
- [IDE 플러그인] 플러그인을 통해 IntelliJ에서 .sq 파일을 열 때 PluginException이 발생했습니다 (by @aperfilyev)
- [IDE 플러그인] IntelliJ 플러그인에 Kotlin 라이브러리를 번들로 포함하지 마십시오. 이미 플러그인 종속성입니다 (#5126)
- [IDE 플러그인] 스트림 대신 확장 배열을 사용했습니다 (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 추가
- [컴파일러] SELECT 수행 시 다중 열 표현식(multi-column-expr) 지원을 추가했습니다 (#4453 by @Adriel-M)
- [PostgreSQL 다이얼렉트] PostgreSQL CREATE INDEX CONCURRENTLY 지원을 추가했습니다 (#4531 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL CTE 보조 문이 서로 참조하도록 허용했습니다 (#4493 by @griffio)
- [PostgreSQL 다이얼렉트] 이진 표현식(binary expr) 및 합계(sum)에 대한 PostgreSQL 타입 지원을 추가했습니다 (#4539 by @Adriel-M)
- [PostgreSQL 다이얼렉트] PostgreSQL SELECT DISTINCT ON 구문 지원을 추가했습니다 (#4584 by @griffio)
- [PostgreSQL 다이얼렉트] SELECT 문에서 PostgreSQL JSON 함수 지원을 추가했습니다 (#4590 by @MariusVolkhart)
- [PostgreSQL 다이얼렉트] `generate_series` PostgreSQL 함수를 추가했습니다 (#4717 by @griffio)
- [PostgreSQL 다이얼렉트] 추가 Postgres 문자열 함수 정의를 추가했습니다 (#4752 by @MariusVolkhart)
- [PostgreSQL 다이얼렉트] min 및 max 집계 함수에 DATE PostgreSQL 타입을 추가했습니다 (#4816 by @anddani)
- [PostgreSQL 다이얼렉트] `SqlBinaryExpr`에 시간 관련(temporal) 타입을 추가했습니다 (#4657 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres 다이얼렉트에 TRUNCATE를 추가했습니다 (#4817 by @de-luca)
- [SQLite 3.35 다이얼렉트] 순서대로 평가되는 여러 ON CONFLICT 절을 허용했습니다 (#4551 by @griffio)
- [JDBC 드라이버] 더 쾌적한 SQL 편집을 위한 언어 어노테이션(Language annotations)을 추가했습니다 (#4602 by @MariusVolkhart)
- [네이티브 드라이버] 네이티브 드라이버: `linuxArm64` 지원을 추가했습니다 (#4792 by @hfhbd)
- [Android 드라이버] `AndroidSqliteDriver`에 `windowSizeBytes` 매개변수를 추가했습니다 (#4804 by @BoD)
- [Paging3 확장] 기능: `OffsetQueryPagingSource`에 `initialOffset`을 추가했습니다 (#4802 by @MohamadJaara)

### 변경
- [컴파일러] 적절한 경우 Kotlin 타입을 선호하도록 변경했습니다 (#4517 by @eygraber)
- [컴파일러] 값 타입 삽입 시 항상 열 이름을 포함하도록 변경했습니다 (#4864)
- [PostgreSQL 다이얼렉트] PostgreSQL 다이얼렉트에서 실험적(experimental) 상태를 제거했습니다 (#4443 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL 타입에 대한 문서를 업데이트했습니다 (#4569 by @MariusVolkhart)
- [R2DBC 드라이버] PostgreSQL에서 정수 데이터 타입 처리 시 성능을 최적화했습니다 (#4588 by @MariusVolkhart)

### 제거
- [SQLite 자바스크립트 드라이버] `sqljs-driver`를 제거했습니다 (#4613, #4670 by @dellisd)

### 수정
- [컴파일러] 반환 값과 매개변수 없는 그룹화된 문 컴파일을 수정했습니다 (#4699 by @griffio)
- [컴파일러] `SqlBinaryExpr`로 인수를 바인딩했습니다 (#4604 by @griffio)
- [IDE 플러그인] 설정된 경우 IDEA 프로젝트 JDK를 사용했습니다 (#4689 by @griffio)
- [IDE 플러그인] IDEA 2023.2 이상에서 "알 수 없는 요소 타입: TYPE_NAME" 오류를 수정했습니다 (#4727)
- [IDE 플러그인] 2023.2와의 일부 호환성 문제를 수정했습니다
- [Gradle 플러그인] `verifyMigrationTask` Gradle 작업의 문서를 수정했습니다 (#4713 by @joshfriend)
- [Gradle 플러그인] 사용자가 데이터베이스를 검증하기 전에 데이터베이스를 생성하도록 돕기 위한 Gradle 작업 출력 메시지를 추가했습니다 (#4684 by @jingwei99)
- [PostgreSQL 다이얼렉트] PostgreSQL 열 이름이 여러 번 변경되는 문제를 수정했습니다 (#4566 by @griffio)
- [PostgreSQL 다이얼렉트] 4714번 이슈: postgresql `ALTER COLUMN` 널 허용 여부(nullability)를 수정했습니다 (#4831 by @griffio)
- [PostgreSQL 다이얼렉트] 4837번 이슈: `ALTER TABLE ALTER COLUMN`을 수정했습니다 (#4846 by @griffio)
- [PostgreSQL 다이얼렉트] 4501번 이슈: PostgreSql 시퀀스를 수정했습니다 (#4528 by @griffio)
- [SQLite 다이얼렉트] JSON 이진 연산자를 열 표현식에 사용하도록 허용했습니다 (#4776 by @eygraber)
- [SQLite 다이얼렉트] 이름이 같은 여러 열이 발견된 경우 `Update From` 오탐(false positive)을 수정했습니다 (#4777 by @eygraber)
- [네이티브 드라이버] 명명된 인메모리 데이터베이스를 지원했습니다 (#4662 by @05nelsonm)
- [네이티브 드라이버] 쿼리 리스너 컬렉션에 대한 스레드 안전성을 보장했습니다 (#4567 by @kpgalligan)
- [JDBC 드라이버] `ConnectionManager`의 연결 누수(connection leak)를 수정했습니다 (#4589 by @MariusVolkhart)
- [JDBC 드라이버] `ConnectionManager` 타입 선택 시 `JdbcSqliteDriver` URL 파싱을 수정했습니다 (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 추가
- [MySQL 다이얼렉트] MySQL: IF 표현식에서 timestamp/bigint를 지원했습니다 (#4329 by @shellderp)
- [MySQL 다이얼렉트] MySQL: now를 추가했습니다 (#4431 by @hfhbd)
- [웹 드라이버] NPM 패키지 게시를 활성화했습니다 (#4364)
- [IDE 플러그인] Gradle 툴링 연결 실패 시 스택 트레이스를 표시하도록 허용했습니다 (#4383)

### 변경
- [Sqlite 드라이버] `JdbcSqliteDriver`에 대한 스키마 마이그레이션 사용을 단순화했습니다 (#3737 by @morki)
- [R2DBC 드라이버] 실제 비동기 R2DBC 커서 (#4387 by @hfhbd)

### 수정
- [IDE 플러그인] 필요할 때까지 데이터베이스 프로젝트 서비스를 인스턴스화하지 않도록 했습니다 (#4382)
- [IDE 플러그인] 사용처 찾기 중 프로세스 취소를 처리했습니다 (#4340)
- [IDE 플러그인] IDE의 비동기 코드 생성을 수정했습니다 (#4406)
- [IDE 플러그인] 패키지 구조 조립을 한 번 계산되고 EDT 외부에서 수행되도록 이동했습니다 (#4417)
- [IDE 플러그인] 2023.2에서 Kotlin 타입 해결을 위한 올바른 스텁 인덱스 키를 사용했습니다 (#4416)
- [IDE 플러그인] 검색 수행 전에 인덱스가 준비될 때까지 기다렸습니다 (#4419)
- [IDE 플러그인] 인덱스를 사용할 수 없는 경우 이동(goto)을 수행하지 않도록 했습니다 (#4420)
- [컴파일러] 그룹화된 문에 대한 결과 표현식을 수정했습니다 (#4378)
- [컴파일러] 가상 테이블을 인터페이스 타입으로 사용하지 않도록 했습니다 (#4427 by @hfhbd)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 추가
- [MySQL 다이얼렉트] 소문자 날짜 타입 및 날짜 타입에 대한 최소/최대값 지원을 추가했습니다 (#4243 by @shellderp)
- [MySQL 다이얼렉트] 이진 표현식(binary expr) 및 합계(sum)에 대한 MySQL 타입 지원을 추가했습니다 (#4254 by @shellderp)
- [MySQL 다이얼렉트] 표시 너비(display width) 없는 부호 없는 정수(unsigned ints) 지원을 추가했습니다 (#4306 by @shellderp)
- [MySQL 다이얼렉트] LOCK IN SHARED MODE 지원을 추가했습니다
- [PostgreSQL 다이얼렉트] 최소/최대값에 부울 및 타임스탬프를 추가했습니다 (#4245 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres: 윈도우 함수 지원을 추가했습니다 (#4283 by @hfhbd)
- [런타임] 런타임에 linuxArm64, androidNative 및 watchosDeviceArm 타겟을 추가했습니다 (#4258 by @hfhbd)
- [Paging 확장] 페이징 확장에 linux 및 mingw x64 타겟을 추가했습니다 (#4280 by @chippman)

### 변경
- [Gradle 플러그인] Android API 34에 대한 자동 다이얼렉트 지원을 추가했습니다 (#4251)
- [Paging 확장] `QueryPagingSource`에서 `SuspendingTransacter` 지원을 추가했습니다 (#4292 by @daio)
- [런타임] `addListener` API를 개선했습니다 (#4244 by @hfhbd)
- [런타임] `Long`을 마이그레이션 버전으로 사용했습니다 (#4297 by @hfhbd)

### 수정
- [Gradle 플러그인] 생성된 소스에 대해 안정적인 출력 경로를 사용했습니다 (#4269 by @joshfriend)
- [Gradle 플러그인] Gradle 조정 (#4222 by @3flex)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 추가
- [Paging] 페이징 확장에 js 브라우저 타겟을 추가했습니다 (#3843 by @sproctor)
- [Paging] androidx-paging3 확장에 iosSimulatorArm64 타겟을 추가했습니다 (#4117)
- [PostgreSQL 다이얼렉트] `gen_random_uuid()`에 대한 지원 및 테스트를 추가했습니다 (#3855 by @davidwheeler123)
- [PostgreSQL 다이얼렉트] 테이블 변경 제약 조건 postgres 추가 (#4116 by @griffio)
- [PostgreSQL 다이얼렉트] 테이블 변경 제약 조건 check 추가 (#4120 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL 문자 길이 함수를 추가했습니다 (#4121 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL 열 기본 간격을 추가했습니다 (#4142 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL 간격 열 결과를 추가했습니다 (#4152 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL ALTER COLUMN을 추가했습니다 (#4165 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL: `date_part`를 추가했습니다 (#4198 by @hfhbd)
- [MySQL 다이얼렉트] SQL 문자 길이 함수를 추가했습니다 (#4134 by @griffio)
- [IDE 플러그인] SqlDelight 디렉토리 제안을 추가했습니다 (#3976 by @aperfilyev)
- [IDE 플러그인] 프로젝트 트리에서 중간 패키지를 압축했습니다 (#3992 by @aperfilyev)
- [IDE 플러그인] JOIN 절 완성(completion)을 추가했습니다 (#4086 by @aperfilyev)
- [IDE 플러그인] 뷰 생성 인텐션(intention) 및 라이브 템플릿(live template)을 추가했습니다 (#4074 by @aperfilyev)
- [IDE 플러그인] DELETE 또는 UPDATE 내 WHERE 누락에 대한 경고를 추가했습니다 (#4058 by @aperfilyev)
- [Gradle 플러그인] 타입 세이프 프로젝트 접근자(typesafe project accessors)를 활성화했습니다 (#4005 by @hfhbd)

### 변경
- [Gradle 플러그인] ServiceLoader 메커니즘으로 `VerifyMigrationTask`에 대한 `DriverInitializer` 등록을 허용했습니다 (#3986 by @C2H6O)
- [Gradle 플러그인] 명시적 컴파일러 환경을 생성했습니다 (#4079 by @hfhbd)
- [JS 드라이버] 웹 워커 드라이버를 별도 아티팩트로 분할했습니다
- [JS 드라이버] `JsWorkerSqlCursor` 노출을 금지했습니다 (#3874 by @hfhbd)
- [JS 드라이버] `sqljs` 드라이버 게시를 비활성화했습니다 (#4108)
- [런타임] 동기 드라이버가 동기 스키마 이니셜라이저를 요구하도록 강제했습니다 (#4013)
- [런타임] 커서에 대한 비동기 지원을 개선했습니다 (#4102)
- [런타임] 사용 중단된 타겟을 제거했습니다 (#4149 by @hfhbd)
- [런타임] 오래된 MM 지원을 제거했습니다 (#4148 by @hfhbd)

### 수정
- [R2DBC 드라이버] R2DBC: 드라이버 닫기를 기다렸습니다 (#4139 by @hfhbd)
- [컴파일러] 데이터베이스 `create(SqlDriver)`에 마이그레이션에서 PRAGMA를 포함했습니다 (#3845 by @MariusVolkhart)
- [컴파일러] RETURNING 절에 대한 코드 생성을 수정했습니다 (#3872 by @MariusVolkhart)
- [컴파일러] 가상 테이블에 대한 타입 생성을 금지했습니다 (#4015)
- [Gradle 플러그인] Gradle 플러그인의 사소한 QoL 개선(Quality of Life improvements) (#3930 by @zacsweers)
- [IDE 플러그인] 해결되지 않은 Kotlin 타입을 수정했습니다 (#3924 by @aperfilyev)
- [IDE 플러그인] 수식어와 함께 작동하도록 와일드카드 확장 인텐션을 수정했습니다 (#3979 by @aperfilyev)
- [IDE 플러그인] Java 홈이 누락된 경우 사용 가능한 JDK를 사용했습니다 (#3925 by @aperfilyev)
- [IDE 플러그인] 패키지 이름에 대한 사용처 찾기를 수정했습니다 (#4010)
- [IDE 플러그인] 잘못된 요소에 대해 자동 임포트 표시를 금지했습니다 (#4008)
- [IDE 플러그인] 다이얼렉트가 누락된 경우 해결하지 않도록 했습니다 (#4009)
- [IDE 플러그인] 무효화된 상태에서 컴파일러의 IDE 실행을 무시했습니다 (#4016)
- [IDE 플러그인] IntelliJ 2023.1 지원을 추가했습니다 (#4037 by @madisp)
- [IDE 플러그인] 열 이름 변경 시 명명된 인수 사용의 이름을 변경했습니다 (#4027 by @aperfilyev)
- [IDE 플러그인] 마이그레이션 추가 팝업을 수정했습니다 (#4105 by @aperfilyev)
- [IDE 플러그인] 마이그레이션 파일에서 `SchemaNeedsMigrationInspection`을 비활성화했습니다 (#4106 by @aperfilyev)
- [IDE 플러그인] 타입 이름 대신 마이그레이션 생성에 SQL 열 이름을 사용했습니다 (#4112 by @aperfilyev)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 추가
- [Paging] 멀티플랫폼 페이징 확장 (by @jeffdgr8)
- [런타임] Listener 인터페이스에 `fun` 한정자를 추가했습니다.
- [SQLite 다이얼렉트] SQLite 3.33 지원 (UPDATE FROM)을 추가했습니다 (by @eygraber)
- [PostgreSQL 다이얼렉트] PostgreSQL에서 UPDATE FROM을 지원했습니다 (by @eygraber)

### 변경
- [R2DBC 드라이버] 연결을 노출했습니다 (by @hfhbd)
- [런타임] 마이그레이션 콜백을 메인 `migrate` fun으로 이동했습니다
- [Gradle 플러그인] 다운스트림 프로젝트에서 구성(Configurations)을 숨겼습니다
- [Gradle 플러그인] IntelliJ만 쉐이딩했습니다 (by @hfhbd)
- [Gradle 플러그인] Kotlin 1.8.0-Beta를 지원하고 다중 버전 Kotlin 테스트를 추가했습니다 (by @hfhbd)

### 수정
- [R2DBC 드라이버] 대신 `javaObjectType`를 사용했습니다 (by @hfhbd)
- [R2DBC 드라이버] `bindStatement`에서 기본 타입 널(null) 값을 수정했습니다 (by @hfhbd)
- [R2DBC 드라이버] R2DBC 1.0을 지원했습니다 (by @hfhbd)
- [PostgreSQL 다이얼렉트] Postgres: 타입 매개변수 없는 배열을 수정했습니다 (by @hfhbd)
- [IDE 플러그인] IntelliJ를 221.6008.13으로 업데이트했습니다 (by @hfhbd)
- [컴파일러] 순수 뷰에서 재귀적 원본 테이블을 해결했습니다 (by @hfhbd)
- [컴파일러] 테이블 외래 키 절에서 값 클래스를 사용했습니다 (by @hfhbd)
- [컴파일러] 괄호 없는 바인딩 표현식을 지원하도록 `SelectQueryGenerator`를 수정했습니다 (by @bellatoris)
- [컴파일러] 트랜잭션 사용 시 `${name}Indexes` 변수의 중복 생성을 수정했습니다 (by @sachera)

## [1.5.5] - 2023-01-20
[1.5.5]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.5

이것은 Kotlin 1.8 및 IntelliJ 2021+ 호환성 릴리스이며, JDK 17을 지원합니다.

## [1.5.4] - 2022-10-06
[1.5.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.4

이것은 Kotlin 1.7.20 및 AGP 7.3.0 호환성 업데이트입니다.

## [2.0.0-alpha04] - 2022-10-03
[2.0.0-alpha04]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha04

### 주요 변경 사항 (Breaking Changes)

- Paging 3 확장 API가 개수에 대해 `int` 타입만 허용하도록 변경되었습니다.
- 코루틴 확장은 이제 기본값이 아닌 디스패처를 전달해야 합니다.
- 다이얼렉트 및 드라이버 클래스는 `final`이며, 대신 위임(delegation)을 사용하십시오.

### 추가
- [HSQL 다이얼렉트] HSQL: INSERT 문에서 생성된 열에 DEFAULT 사용을 지원했습니다 (#3372 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL: INSERT 문에서 생성된 열에 DEFAULT 사용을 지원했습니다 (#3373 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL에 `NOW()`를 추가했습니다 (#3403 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL에 NOT 연산자를 추가했습니다 (#3504 by @hfhbd)
- [Paging] `*QueryPagingSource`에 `CoroutineContext` 전달을 허용했습니다 (#3384)
- [Gradle 플러그인] 다이얼렉트에 대한 더 나은 버전 카탈로그 지원을 추가했습니다 (#3435)
- [네이티브 드라이버] `NativeSqliteDriver`의 `DatabaseConfiguration` 생성에 훅을 걸 수 있는 콜백을 추가했습니다 (#3512 by @svenjacobs)

### 변경
- [Paging] `KeyedQueryPagingSource`가 지원하는 `QueryPagingSource` 함수에 기본 디스패처를 추가했습니다 (#3385)
- [Paging] `OffsetQueryPagingSource`가 `Int` 타입으로만 작동하도록 변경했습니다 (#3386)
- [비동기 런타임] `await*`를 상위 클래스 `ExecutableQuery`로 이동했습니다 (#3524 by @hfhbd)
- [코루틴 확장] 플로우 확장에서 기본 매개변수를 제거했습니다 (#3489)

### 수정
- [Gradle 플러그인] Kotlin 1.7.20으로 업데이트했습니다 (#3542 by @zacsweers)
- [R2DBC 드라이버] 항상 값을 보내지 않는 R2DBC 변경 사항을 채택했습니다 (#3525 by @hfhbd)
- [HSQL 다이얼렉트] HSQL로 인해 실패하는 SQLite `VerifyMigrationTask`를 수정했습니다 (#3380 by @hfhbd)
- [Gradle 플러그인] 작업이 Gradle의 지연 구성(lazy configuration) API를 사용하도록 변환했습니다 (by @3flex)
- [Gradle 플러그인] Kotlin 1.7.20에서 NPE를 방지했습니다 (#3398 by @ZacSweers)
- [Gradle 플러그인] 마이그레이션 스쿼시 작업 설명을 수정했습니다 (#3449)
- [IDE 플러그인] 최신 Kotlin 플러그인에서 `NoSuchFieldError`를 수정했습니다 (#3422 by @madisp)
- [IDE 플러그인] IDEA: `UnusedQueryInspection` - `ArrayIndexOutOfBoundsException`을 수정했습니다 (#3427 by @vanniktech)
- [IDE 플러그인] 오래된 Kotlin 플러그인 참조에 반사(reflection)를 사용했습니다
- [컴파일러] 확장 함수가 있는 커스텀 다이얼렉트는 임포트를 생성하지 않도록 했습니다 (#3338 by @hfhbd)
- [컴파일러] `CodeBlock.of("${CodeBlock.toString()}")` 이스케이프를 수정했습니다 (#3340 by @hfhbd)
- [컴파일러] 마이그레이션에서 비동기 실행 문을 기다렸습니다 (#3352)
- [컴파일러] AS를 수정했습니다 (#3370 by @hfhbd)
- [컴파일러] `getObject` 메서드가 실제 타입의 자동 채우기를 지원하도록 했습니다 (#3401 by @robxyy)
- [컴파일러] 비동기 그룹화된 반환 문에 대한 코드 생성을 수정했습니다 (#3411)
- [컴파일러] 가능하다면 바인딩 매개변수의 Kotlin 타입을 추론하거나, 더 나은 오류 메시지로 실패하도록 했습니다 (#3413 by @hfhbd)
- [컴파일러] `ABS("foo")`를 허용하지 않았습니다 (#3430 by @hfhbd)
- [컴파일러] 다른 매개변수에서 Kotlin 타입 추론을 지원했습니다 (#3431 by @hfhbd)
- [컴파일러] 항상 데이터베이스 구현을 생성하도록 했습니다 (#3540 by @hfhbd)
- [컴파일러] javaDoc을 완화하고 커스텀 매퍼 함수에도 추가했습니다 (#3554 @hfhbd)
- [컴파일러] 바인딩에서 DEFAULT를 수정했습니다 (by @hfhbd)
- [Paging] Paging 3를 수정했습니다 (#3396)
- [Paging] `Long`을 사용하여 `OffsetQueryPagingSource` 생성을 허용했습니다 (#3409)
- [Paging] `Dispatchers.Main`을 정적으로 교체하지 않았습니다 (#3428)

## [2.0.0-alpha03] - 2022-06-17
[2.0.0-alpha03]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha03

### 주요 변경 사항 (Breaking Changes)

- 다이얼렉트가 이제 실제 Gradle 종속성처럼 참조됩니다.
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 타입이 제거되었으며, 이제 항상 드라이버를 포함하는 `AfterVersion` 타입으로 대체되었습니다.
- `Schema` 타입은 더 이상 `SqlDriver`의 서브타입이 아닙니다.