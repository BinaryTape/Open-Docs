# 변경 로그

## 미출시

아직 없음!

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 추가
- [PostgreSQL 다이얼렉트] Postgres 숫자/정수/큰 정수 타입 매핑 수정 (#5994 by @griffio)
- [컴파일러] CAST가 필요할 때 소스 파일 위치를 포함하도록 컴파일러 오류 메시지 개선 (#5979 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres JSON 연산자 경로 추출 지원 추가 (#5971 by @griffio)
- [SQLite 다이얼렉트] 공통 테이블 표현식(Common Table Expressions)을 사용하는 MATERIALIZED 쿼리 플래너 힌트(query planner hint)에 대한 Sqlite 3.35 지원 추가 (#5961 by @griffio)
- [PostgreSQL 다이얼렉트] 공통 테이블 표현식(Common Table Expressions)을 사용하는 MATERIALIZED 쿼리 플래너 힌트(query planner hint)에 대한 지원 추가 (#5961 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres JSON 집계 필터(Aggregate FILTER) 지원 추가 (#5957 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres Enum 지원 추가 (#5935 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres 트리거(Triggers)에 대한 제한된 지원 추가 (#5932 by @griffio)
- [PostgreSQL 다이얼렉트] SQL 표현식이 JSON으로 파싱될 수 있는지 확인하는 조건자(predicate) 추가 (#5843 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql COMMENT ON 문에 대한 제한된 지원 추가 (#5808 by @griffio)
- [MySQL 다이얼렉트] 인덱스 가시성 옵션 지원 추가 (#5785 by @orenkislev-faire)
- [PostgreSQL 다이얼렉트] TSQUERY 데이터 타입 지원 추가 (#5779 by @griffio)
- [Gradle 플러그인] 모듈 추가 시 버전 카탈로그(version catalogs) 지원 추가 (#5755 by @DRSchlaubi)

### 변경
- 개발 중인 스냅샷(snapshots)은 이제 https://central.sonatype.com/repository/maven-snapshots/ 에 있는 Central Portal Snapshots 저장소에 게시됩니다.
- [컴파일러] 생성자 참조(constructor references)를 사용하여 기본 생성된 쿼리 단순화 (#5814 by @jonapoul)

### 수정
- [컴파일러] 공통 테이블 표현식(Common Table Expression)을 포함하는 뷰 사용 시 스택 오버플로우(stack overflow) 수정 (#5928 by @griffio)
- [Gradle 플러그인] "새 연결(New Connection)" 추가를 위해 SqlDelight 도구 창을 열 때 발생하는 크래시 수정 (#5906 by @griffio)
- [IntelliJ 플러그인] copy-to-sqlite 거터 액션(gutter action)에서 스레딩 관련 크래시 방지 (#5901 by @griffio)
- [IntelliJ 플러그인] CREATE INDEX 및 CREATE VIEW 스키마 문(schema statements) 사용 시 PostgreSql 다이얼렉트에 대한 수정 (#5772 by @griffio)
- [컴파일러] 열 참조 시 FTS 스택 오버플로우(stack overflow) 수정 (#5896 by @griffio)
- [컴파일러] With Recursive 스택 오버플로우 수정 (#5892 by @griffio)
- [컴파일러] INSERT|UPDATE|DELETE RETURNING 문에 대한 알림(Notify) 수정 (#5851 by @griffio)
- [컴파일러] Long을 반환하는 트랜잭션 블록(transaction blocks)에 대한 비동기 결과 타입(async result type) 수정 (#5836 by @griffio)
- [컴파일러] SQL 매개변수 바인딩(parameter binding) 복잡도(complexity)를 O(n²)에서 O(n)으로 최적화 (#5898 by @chenf7)
- [SQLite 다이얼렉트] Sqlite 3.18 누락된 함수(missing functions) 수정 (#5759 by @griffio)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

일부 아티팩트가 부분적으로 게시되어 릴리스에 실패했습니다. 2.2.1 버전을 사용하세요!

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 추가
- [WASM 드라이버] 웹 워커(web worker) 드라이버에 wasmJs 지원 추가 (#5534 by @IlyaGulya)
- [PostgreSQL 다이얼렉트] PostgreSql 배열을 행으로 언네스트(UnNest)하는 기능 지원 (#5673 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql TSRANGE/TSTZRANGE 지원 (#5297 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql RIGHT FULL JOIN (#5086 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql 시간 관련(temporal) 타입에서 추출 기능 (#5273 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 배열 포함(array contains) 연산자 (#4933 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 제약 조건(constraint) 제거 (#5288 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql 타입 캐스팅(type casting) (#5089 by @griffio)
- [PostgreSQL 다이얼렉트] 서브쿼리(subquery)를 위한 PostgreSql LATERAL JOIN 연산자 (#5122 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql ILIKE 연산자 (#5330 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql XML 타입 (#5331 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql AT TIME ZONE (#5243 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL ORDER BY NULLS 지원 (#5199 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL 현재 날짜/시간 함수 지원 추가 (#5226 by @drewd)
- [PostgreSQL 다이얼렉트] PostgreSql 정규 표현식(Regex) 연산자 (#5137 by @griffio)
- [PostgreSQL 다이얼렉트] BRIN GIST 추가 (#5059 by @griffio)
- [MySQL 다이얼렉트] MySQL 다이얼렉트에서 RENAME INDEX 지원 (#5212 by @orenkislev-faire)
- [JSON 확장] JSON 테이블 함수에 별칭(alias) 추가 (#5372 by @griffio)

### 변경
- [컴파일러] 생성된 쿼리 파일이 단순 뮤테이터(simple mutators)에 대한 행 개수(row counts)를 반환하도록 변경 (#4578 by @MariusVolkhart)
- [네이티브 드라이버] NativeSqlDatabase.kt 업데이트: DELETE, INSERT, UPDATE 문에 대한 읽기 전용(readonly) 플래그 변경 (#5680 by @griffio)
- [PostgreSQL 다이얼렉트] PgInterval을 String으로 변경 (#5403 by @griffio)
- [PostgreSQL 다이얼렉트] SqlDelight 모듈이 PostgreSQL 확장 기능(extensions)을 구현하도록 지원 (#5677 by @griffio)

### 수정
- [컴파일러] 수정: 결과와 함께 그룹 문(group statements)을 실행할 때 쿼리 알림 (#5006 by @vitorhugods)
- [컴파일러] SqlDelightModule 타입 리졸버(type resolver) 수정 (#5625 by @griffio)
- [컴파일러] 5501번 이슈 수정: 객체 이스케이프된 열 삽입 (#5503 by @griffio)
- [컴파일러] 컴파일러: 오류 메시지를 개선하여 경로 링크(path links)가 올바른 줄 및 문자 위치(line & char position)로 클릭 가능하도록 함. (#5604 by @vanniktech)
- [컴파일러] 5298번 이슈 수정: 키워드(keywords)를 테이블 이름으로 사용할 수 있도록 허용
- [컴파일러] 명명된 실행(named executes) 수정 및 테스트 추가
- [컴파일러] 초기화 문(initialization statements) 정렬 시 외래 키 테이블 제약 조건(foreign key table constraints) 고려 (#5325 by @TheMrMilchmann)
- [컴파일러] 탭이 포함된 경우 오류 밑줄을 올바르게 정렬 (#5224 by @drewd)
- [JDBC 드라이버] 트랜잭션 종료 중 connectionManager의 메모리 누수(memory leak) 수정
- [JDBC 드라이버] 문서에 언급된 대로 트랜잭션 내에서 SQLite 마이그레이션 실행 (#5218 by @morki)
- [JDBC 드라이버] 트랜잭션 커밋/롤백 후 연결 누수(leaking connections) 수정 (#5205 by @morki)
- [Gradle 플러그인] `DriverInitializer` 이전에 `GenerateSchemaTask` 실행 (#5562 by @nwagu)
- [런타임] 실제 드라이버가 비동기(Async)일 때 LogSqliteDriver의 크래시(crash) 수정 (#5723 by @edenman)
- [런타임] StringBuilder 용량(capacity) 수정 (#5192 by @janbina)
- [PostgreSQL 다이얼렉트] PostgreSql CREATE OR REPLACE VIEW (#5407 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql TO_JSON (#5606 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 숫자(numeric) 리졸버 (#5399 by @griffio)
- [PostgreSQL 다이얼렉트] SQLite 윈도우 함수(windows function) (#2799 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql SELECT DISTINCT ON (#5345 by @griffio)
- [PostgreSQL 다이얼렉트] ALTER TABLE ADD COLUMN IF NOT EXISTS (#5309 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql 비동기(async) 바인드 매개변수 (#5313 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 불리언(boolean) 리터럴 (#5262 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 윈도우 함수(window functions) (#5155 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql IS NULL IS NOT NULL 타입 (#5173 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql SELECT DISTINCT (#5172 by @griffio)
- [페이징 확장] 페이징 초기 로드(initial load) 새로고침 수정 (#5615 by @evant)
- [페이징 확장] MacOS 네이티브 타겟(native targets) 추가 (#5324 by @vitorhugods)
- [IntelliJ 플러그인] K2 지원

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 추가
- [PostgreSQL 다이얼렉트] PostgreSQL STRING_AGG 함수 추가 (#4950 by @anddani)
- [PostgreSQL 다이얼렉트] pg 다이얼렉트에 SET 문 추가 (#4927 by @de-luca)
- [PostgreSQL 다이얼렉트] PostgreSql ALTER COLUMN SEQUENCE 매개변수 추가 (#4916 by @griffio)
- [PostgreSQL 다이얼렉트] INSERT 문에 postgresql ALTER COLUMN DEFAULT 지원 추가 (#4912 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql ALTER SEQUENCE 및 DROP SEQUENCE 추가 (#4920 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres 정규 표현식(Regex) 함수 정의(function definitions) 추가 (#5025 by @MariusVolkhart)
- [PostgreSQL 다이얼렉트] GIN을 위한 문법(grammar) 추가 (#5027 by @griffio)

### 변경
- [IDE 플러그인] 최소 버전(Minimum version) 2023.1 / Android Studio Iguana
- [컴파일러] encapsulatingType에서 타입 널러블리티(nullability) 재정의 허용 (#4882 by @eygraber)
- [컴파일러] `SELECT *`에 대한 열 이름 인라인화(Inline the column names) (#4864)
- [Gradle 플러그인] processIsolation으로 전환 (#5068 by @nwagu)
- [Android 런타임] Android minSDK를 21로 상향 (#5094 by @hfhbd)
- [드라이버] 다이얼렉트 작성자를 위해 더 많은 JDBC/R2DBC 문(statement) 메서드 노출 (#5098 by @hfhbd)

### 수정
- [PostgreSQL 다이얼렉트] postgresql ALTER TABLE ALTER COLUMN 수정 (#4868 by @griffio)
- [PostgreSQL 다이얼렉트] 4448번 이슈 수정: 테이블 모델의 누락된 임포트(missing import) (#4885 by @griffio)
- [PostgreSQL 다이얼렉트] 4932번 이슈 수정: postgresql 기본(default) 제약 조건 함수 (#4934 by @griffio)
- [PostgreSQL 다이얼렉트] 4879번 이슈 수정: 마이그레이션 중 ALTER TABLE RENAME COLUMN에서 postgresql 클래스 캐스트 오류(class-cast error) (#4880 by @griffio)
- [PostgreSQL 다이얼렉트] 4474번 이슈 수정: PostgreSql CREATE EXTENSION (#4541 by @griffio)
- [PostgreSQL 다이얼렉트] 5018번 이슈 수정: PostgreSql PRIMARY KEY가 null을 허용하지 않는 타입으로 추가됨 (#5020 by @griffio)
- [PostgreSQL 다이얼렉트] 4703번 이슈 수정: 집계 표현식(aggregate expressions) (#5071 by @griffio)
- [PostgreSQL 다이얼렉트] 5028번 이슈 수정: PostgreSql JSON (#5030 by @griffio)
- [PostgreSQL 다이얼렉트] 5040번 이슈 수정: PostgreSql JSON 연산자(operators) (#5041 by @griffio)
- [PostgreSQL 다이얼렉트] 5040번 이슈에 대한 JSON 연산자 바인딩 수정 (#5100 by @griffio)
- [PostgreSQL 다이얼렉트] 5082번 이슈 수정: TSVECTOR (#5104 by @griffio)
- [PostgreSQL 다이얼렉트] 5032번 이슈 수정: PostgreSql UPDATE FROM 문에 대한 열 인접성(column adjacency) (#5035 by @griffio)
- [SQLite 다이얼렉트] 4897번 이슈 수정: sqlite ALTER TABLE RENAME COLUMN (#4899 by @griffio)
- [IDE 플러그인] 오류 핸들러(error handler) 크래시 수정 (#4988 by @aperfilyev)
- [IDE 플러그인] IDEA 2023.3에서 BugSnag 초기화 실패(init fails) (by @aperfilyev)
- [IDE 플러그인] 플러그인을 통해 IntelliJ에서 .sq 파일 열기 시 PluginException 발생 (by @aperfilyev)
- [IDE 플러그인] kotlin 라이브러리(lib)를 intellij 플러그인에 번들링하지 않음(Dont bundle) (이미 플러그인 의존성임) (#5126)
- [IDE 플러그인] 스트림 대신 확장 배열(extensions array) 사용 (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 추가
- [컴파일러] SELECT 시 다중 열 표현식(multi-column-expr) 지원 추가 (#4453 by @Adriel-M)
- [PostgreSQL 다이얼렉트] PostgreSQL CREATE INDEX CONCURRENTLY 지원 추가 (#4531 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL CTE 보조 문(auxiliary statements)이 서로 참조할 수 있도록 허용 (#4493 by @griffio)
- [PostgreSQL 다이얼렉트] 이진 표현식(binary expr) 및 합계(sum)에 대한 PostgreSQL 타입 지원 추가 (#4539 by @Adriel-M)
- [PostgreSQL 다이얼렉트] PostgreSQL SELECT DISTINCT ON 구문 지원 추가 (#4584 by @griffio)
- [PostgreSQL 다이얼렉트] SELECT 문에 PostgreSQL JSON 함수 지원 추가 (#4590 by @MariusVolkhart)
- [PostgreSQL 다이얼렉트] generate_series PostgreSQL 함수 추가 (#4717 by @griffio)
- [PostgreSQL 다이얼렉트] 추가 Postgres String 함수 정의 추가 (#4752 by @MariusVolkhart)
- [PostgreSQL 다이얼렉트] min 및 max 집계 함수에 DATE PostgreSQL 타입 추가 (#4816 by @anddani)
- [PostgreSQL 다이얼렉트] SqlBinaryExpr에 PostgreSql 시간 관련(temporal) 타입 추가 (#4657 by @griffio)
- [PostgreSQL 다이얼렉트] postgres 다이얼렉트에 TRUNCATE 추가 (#4817 by @de-luca)
- [SQLite 3.35 다이얼렉트] 순서대로 평가되는 여러 ON CONFLICT 절 허용 (#4551 by @griffio)
- [JDBC 드라이버] 보다 쾌적한 SQL 편집을 위한 언어(Language) 어노테이션 추가 (#4602 by @MariusVolkhart)
- [네이티브 드라이버] Native-driver: linuxArm64 지원 추가 (#4792 by @hfhbd)
- [Android 드라이버] AndroidSqliteDriver에 windowSizeBytes 매개변수 추가 (#4804 by @BoD)
- [Paging3 확장] 기능: OffsetQueryPagingSource에 initialOffset 추가 (#4802 by @MohamadJaara)

### 변경
- [컴파일러] 적절한 경우 Kotlin 타입 선호 (#4517 by @eygraber)
- [컴파일러] 값 타입 삽입 시 항상 열 이름 포함 (#4864)
- [PostgreSQL 다이얼렉트] PostgreSQL 다이얼렉트의 실험적 상태 제거 (#4443 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL 타입에 대한 문서 업데이트 (#4569 by @MariusVolkhart)
- [R2DBC 드라이버] PostgreSQL에서 정수 데이터 타입 처리 시 성능 최적화 (#4588 by @MariusVolkhart)

### 제거
- [SQLite Javascript 드라이버] sqljs-driver 제거 (#4613, #4670 by @dellisd)

### 수정
- [컴파일러] 반환 값은 있지만 매개변수가 없는 그룹화된 문 컴파일 수정 (#4699 by @griffio)
- [컴파일러] SqlBinaryExpr로 인수 바인딩 (#4604 by @griffio)
- [IDE 플러그인] 설정된 경우 IDEA Project JDK 사용 (#4689 by @griffio)
- [IDE 플러그인] IDEA 2023.2 이상에서 "Unknown element type: TYPE_NAME" 오류 수정 (#4727)
- [IDE 플러그인] 2023.2와의 일부 호환성 문제 수정
- [Gradle 플러그인] `verifyMigrationTask` Gradle 작업 문서화 수정 (#4713 by @joshfriend)
- [Gradle 플러그인] 사용자가 데이터베이스를 확인하기 전에 데이터베이스를 생성(generate)하는 데 도움이 되는 Gradle 작업 출력 메시지 추가 (#4684 by @jingwei99)
- [PostgreSQL 다이얼렉트] PostgreSQL 열의 다중 이름 변경 수정 (#4566 by @griffio)
- [PostgreSQL 다이얼렉트] 4714번 이슈 수정: postgresql ALTER COLUMN nullability (#4831 by @griffio)
- [PostgreSQL 다이얼렉트] 4837번 이슈 수정: ALTER TABLE ALTER COLUMN (#4846 by @griffio)
- [PostgreSQL 다이얼렉트] 4501번 이슈 수정: PostgreSql 시퀀스(sequence) (#4528 by @griffio)
- [SQLite 다이얼렉트] JSON 이진 연산자를 열 표현식에 사용할 수 있도록 허용 (#4776 by @eygraber)
- [SQLite 다이얼렉트] UPDATE FROM 거짓 양성(false positive) 수정: 여러 열이 이름으로 발견됨 (#4777 by @eygraber)
- [네이티브 드라이버] 명명된 인메모리 데이터베이스(in-memory databases) 지원 (#4662 by @05nelsonm)
- [네이티브 드라이버] 쿼리 리스너(listener) 컬렉션의 스레드 안전성(thread safety) 보장 (#4567 by @kpgalligan)
- [JDBC 드라이버] ConnectionManager에서 연결 누수(connection leak) 수정 (#4589 by @MariusVolkhart)
- [JDBC 드라이버] ConnectionManager 타입 선택 시 JdbcSqliteDriver URL 파싱 수정 (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 추가
- [MySQL 다이얼렉트] MySQL: IF 표현식에서 timestamp/bigint 지원 (#4329 by @shellderp)
- [MySQL 다이얼렉트] MySQL: NOW 추가 (#4431 by @hfhbd)
- [웹 드라이버] NPM 패키지 게시 활성화 (#4364)
- [IDE 플러그인] Gradle 툴링(tooling) 연결 실패 시 스택 트레이스(stacktrace)를 표시할 수 있도록 허용 (#4383)

### 변경
- [SQLite 드라이버] JdbcSqliteDriver에 스키마 마이그레이션 사용 단순화 (#3737 by @morki)
- [R2DBC 드라이버] 실제 비동기 R2DBC 커서(cursor) (#4387 by @hfhbd)

### 수정
- [IDE 플러그인] 필요할 때까지 데이터베이스 프로젝트 서비스 인스턴스화하지 않음 (#4382)
- [IDE 플러그인] 사용처 찾기(find usages) 중 프로세스 취소 처리 (#4340)
- [IDE 플러그인] IDE 비동기 코드 생성 수정 (#4406)
- [IDE 플러그인] 패키지 구조 어셈블리를 한 번만 계산하고 EDT 외부에서 수행하도록 이동 (#4417)
- [IDE 플러그인] 2023.2에서 kotlin 타입 해석을 위해 올바른 스텁(stub) 인덱스 키 사용 (#4416)
- [IDE 플러그인] 검색 수행 전에 인덱스가 준비될 때까지 대기 (#4419)
- [IDE 플러그인] 인덱스를 사용할 수 없는 경우 이동(goto)을 수행하지 않음 (#4420)
- [컴파일러] 그룹화된 문(grouped statements)에 대한 결과 표현식 수정 (#4378)
- [컴파일러] 가상 테이블(virtual table)을 인터페이스 타입으로 사용하지 않음 (#4427 by @hfhbd)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 추가
- [MySQL 다이얼렉트] 소문자 날짜 타입 및 날짜 타입의 min/max 지원 (#4243 by @shellderp)
- [MySQL 다이얼렉트] 이진 표현식(binary expr) 및 합계(sum)에 대한 mysql 타입 지원 (#4254 by @shellderp)
- [MySQL 다이얼렉트] 표시 너비 없는 부호 없는 정수(unsigned ints) 지원 (#4306 by @shellderp)
- [MySQL 다이얼렉트] LOCK IN SHARED MODE 지원
- [PostgreSQL 다이얼렉트] 불리언(boolean) 및 Timestamp를 min/max에 추가 (#4245 by @griffio)
- [PostgreSQL 다이얼렉트] Postgres: 윈도우 함수(window function) 지원 추가 (#4283 by @hfhbd)
- [런타임] 런타임에 linuxArm64, androidNative, watchosDeviceArm 타겟 추가 (#4258 by @hfhbd)
- [페이징 확장] 페이징 확장에 linux 및 mingw x64 타겟 추가 (#4280 by @chippman)

### 변경
- [Gradle 플러그인] Android API 34에 대한 자동 다이얼렉트 지원 추가 (#4251)
- [페이징 확장] QueryPagingSource에서 SuspendingTransacter 지원 추가 (#4292 by @daio)
- [런타임] addListener API 개선 (#4244 by @hfhbd)
- [런타임] 마이그레이션 버전을 Long으로 사용 (#4297 by @hfhbd)

### 수정
- [Gradle 플러그인] 생성된 소스(generated source)의 안정적인 출력 경로 사용 (#4269 by @joshfriend)
- [Gradle 플러그인] Gradle 개선 사항(Gradle tweaks) (#4222 by @3flex)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 추가
- [페이징] 페이징 확장에 JS 브라우저 타겟 추가 (#3843 by @sproctor)
- [페이징] androidx-paging3 확장에 iosSimulatorArm64 타겟 추가 (#4117)
- [PostgreSQL 다이얼렉트] gen_random_uuid() 지원 및 테스트 추가 (#3855 by @davidwheeler123)
- [PostgreSQL 다이얼렉트] ALTER TABLE ADD CONSTRAINT postgres (#4116 by @griffio)
- [PostgreSQL 다이얼렉트] ALTER TABLE ADD CONSTRAINT CHECK (#4120 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 문자 길이 함수 추가 (#4121 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 열 기본 간격(interval) 추가 (#4142 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 간격(interval) 열 결과 추가 (#4152 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql ALTER COLUMN 추가 (#4165 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSQL: date_part 추가 (#4198 by @hfhbd)
- [MySQL 다이얼렉트] SQL 문자 길이 함수 추가 (#4134 by @griffio)
- [IDE 플러그인] sqldelight 디렉토리 제안 추가 (#3976 by @aperfilyev)
- [IDE 플러그인] 프로젝트 트리에 중간 패키지 압축(Compact middle packages) (#3992 by @aperfilyev)
- [IDE 플러그인] JOIN 절 자동 완성(completion) 추가 (#4086 by @aperfilyev)
- [IDE 플러그인] CREATE VIEW 인텐션 및 라이브 템플릿 (#4074 by @aperfilyev)
- [IDE 플러그인] DELETE 또는 UPDATE 내에 WHERE가 누락된 경우 경고(Warn) (#4058 by @aperfilyev)
- [Gradle 플러그인] 타입 안전 프로젝트 접근자(typesafe project accessors) 활성화 (#4005 by @hfhbd)

### 변경
- [Gradle 플러그인] ServiceLoader 메커니즘(ServiceLoader mechanism)을 사용하여 VerifyMigrationTask에 DriverInitializer 등록 허용 (#3986 by @C2H6O)
- [Gradle 플러그인] 명시적 컴파일러 환경(explicit compiler env) 생성 (#4079 by @hfhbd)
- [JS 드라이버] 웹 워커(web worker) 드라이버를 별도의 아티팩트로 분리
- [JS 드라이버] JsWorkerSqlCursor 노출하지 않음 (#3874 by @hfhbd)
- [JS 드라이버] sqljs 드라이버 게시 비활성화 (#4108)
- [런타임] 동기 드라이버가 동기 스키마 초기화자(initializer)를 요구하도록 강제 (#4013)
- [런타임] 커서(Cursors)에 대한 비동기 지원 개선 (#4102)
- [런타임] 사용되지 않는 타겟 제거 (#4149 by @hfhbd)
- [런타임] 이전 MM 지원 제거 (#4148 by @hfhbd)

### 수정
- [R2DBC 드라이버] R2DBC: 드라이버 닫기 대기 (#4139 by @hfhbd)
- [컴파일러] 데이터베이스 생성(SqlDriver) 시 마이그레이션의 PRAGMA 포함 (#3845 by @MariusVolkhart)
- [컴파일러] RETURNING 절에 대한 코드 생성 수정 (#3872 by @MariusVolkhart)
- [컴파일러] 가상 테이블(virtual tables)에 대한 타입 생성하지 않음 (#4015)
- [Gradle 플러그인] Gradle 플러그인 QoL(삶의 질) 개선 사항 (#3930 by @zacsweers)
- [IDE 플러그인] 해결되지 않은(unresolved) kotlin 타입 수정 (#3924 by @aperfilyev)
- [IDE 플러그인] 한정자(qualifier)와 함께 작동하도록 와일드카드 확장 인텐션(expand wildcard intention) 수정 (#3979 by @aperfilyev)
- [IDE 플러그인] JAVA_HOME이 없는 경우 사용 가능한 JDK 사용 (#3925 by @aperfilyev)
- [IDE 플러그인] 패키지 이름에서 사용처 찾기(find usages) 수정 (#4010)
- [IDE 플러그인] 유효하지 않은 요소(invalid elements)에 대한 자동 임포트(auto imports) 표시하지 않음 (#4008)
- [IDE 플러그인] 다이얼렉트가 누락된 경우 해결하지 않음(Do not resolve) (#4009)
- [IDE 플러그인] 무효화된 상태(invalidated state)에서 컴파일러의 IDE 실행 무시 (#4016)
- [IDE 플러그인] IntelliJ 2023.1 지원 추가 (#4037 by @madisp)
- [IDE 플러그인] 열 이름 변경 시 명명된 인수(named argument) 사용 이름 변경 (#4027 by @aperfilyev)
- [IDE 플러그인] 마이그레이션 추가 팝업 수정 (#4105 by @aperfilyev)
- [IDE 플러그인] 마이그레이션 파일에서 SchemaNeedsMigrationInspection 비활성화 (#4106 by @aperfilyev)
- [IDE 플러그인] 타입 이름 대신 마이그레이션 생성에 SQL 열 이름 사용 (#4112 by @aperfilyev)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 추가
- [페이징] 멀티플랫폼 페이징 확장 (by @jeffdgr8)
- [런타임] Listener 인터페이스에 `fun` 수정자(modifier) 추가.
- [SQLite 다이얼렉트] SQLite 3.33 지원 (UPDATE FROM) (by @eygraber)
- [PostgreSQL 다이얼렉트] postgresql에서 UPDATE FROM 지원 (by @eygraber)

### 변경
- [R2DBC 드라이버] 연결 노출 (by @hfhbd)
- [런타임] 마이그레이션 콜백을 메인 `migrate` 함수로 이동
- [Gradle 플러그인] 다운스트림(downstream) 프로젝트에서 구성(Configurations) 숨기기
- [Gradle 플러그인] IntelliJ만 셰이딩(shade) 처리 (by @hfhbd)
- [Gradle 플러그인] Kotlin 1.8.0-Beta 지원 및 다중 버전 Kotlin 테스트(multi version Kotlin test) 추가 (by @hfhbd)

### 수정
- [R2DBC 드라이버] javaObjectType 대신 사용 (by @hfhbd)
- [R2DBC 드라이버] bindStatement에서 기본(primitive) null 값 수정 (by @hfhbd)
- [R2DBC 드라이버] R2DBC 1.0 지원 (by @hfhbd)
- [PostgreSQL 다이얼렉트] Postgres: 타입 매개변수(type parameter) 없는 배열 수정 (by @hfhbd)
- [IDE 플러그인] intellij를 221.6008.13으로 상향 (by @hfhbd)
- [컴파일러] 순수 뷰(pure views)에서 재귀적 원본 테이블 해결(resolve recursive origin table) (by @hfhbd)
- [컴파일러] 테이블 외래 키(foreign key) 절에서 값 클래스(value classes) 사용 (by @hfhbd)
- [컴파일러] 괄호 없는 바인드 표현식(bind expression without parenthesis)을 지원하도록 SelectQueryGenerator 수정 (by @bellatoris)
- [컴파일러] 트랜잭션 사용 시 `${name}Indexes` 변수의 중복 생성(duplicate generation) 수정 (by @sachera)

## [1.5.5] - 2023-01-20
[1.5.5]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.5

Kotlin 1.8 및 IntelliJ 2021+ 호환성 릴리스(compatibility release)로, JDK 17을 지원합니다.

## [1.5.4] - 2022-10-06
[1.5.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.4

Kotlin 1.7.20 및 AGP 7.3.0 호환성 업데이트입니다.

## [2.0.0-alpha04] - 2022-10-03
[2.0.0-alpha04]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha04

### 파괴적 변경(Breaking Changes)

- 페이징 3 확장 API가 개수(count)에 int 타입만 허용하도록 변경되었습니다.
- 코루틴 확장(coroutines extension)은 이제 기본값 대신 디스패처(dispatcher)를 전달해야 합니다.
- 다이얼렉트 및 드라이버 클래스는 `final`이며, 대신 위임(delegation)을 사용하십시오.

### 추가
- [HSQL 다이얼렉트] HSQL: INSERT에서 생성된 열(generated columns)에 DEFAULT 사용 지원 (#3372 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL: INSERT에서 생성된 열(generated columns)에 DEFAULT 사용 지원 (#3373 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL에 NOW() 추가 (#3403 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL NOT 연산자 추가 (#3504 by @hfhbd)
- [페이징] `*QueryPagingSource`에 CoroutineContext 전달 허용 (#3384)
- [Gradle 플러그인] 다이얼렉트에 대한 향상된 버전 카탈로그(version catalog) 지원 추가 (#3435)
- [네이티브 드라이버] NativeSqliteDriver의 DatabaseConfiguration 생성에 연결할(hook into) 콜백 추가 (#3512 by @svenjacobs)

### 변경
- [페이징] KeyedQueryPagingSource에 의해 지원되는 QueryPagingSource 함수에 기본 디스패처(default dispatcher) 추가 (#3385)
- [페이징] OffsetQueryPagingSource가 Int 타입에서만 작동하도록 변경 (#3386)
- [비동기 런타임] `await*`를 상위 클래스(upper class) ExecutableQuery로 이동 (#3524 by @hfhbd)
- [코루틴 확장] flow 확장에서 기본(default) 매개변수 제거 (#3489)

### 수정
- [Gradle 플러그인] Kotlin 1.7.20으로 업데이트 (#3542 by @zacsweers)
- [R2DBC 드라이버] 항상 값을 보내지 않는 R2DBC 변경 사항 채택 (#3525 by @hfhbd)
- [HSQL 다이얼렉트] HSQL과 함께 Sqlite VerifyMigrationTask 실패 수정 (#3380 by @hfhbd)
- [Gradle 플러그인] 작업을 레이지 구성(lazy configuration) API 사용으로 전환 (by @3flex)
- [Gradle 플러그인] Kotlin 1.7.20에서 NPE 방지 (#3398 by @ZacSweers)
- [Gradle 플러그인] squash migrations 작업 설명 수정 (#3449)
- [IDE 플러그인] 최신 Kotlin 플러그인에서 NoSuchFieldError 수정 (#3422 by @madisp)
- [IDE 플러그인] IDEA: UnusedQueryInspection - ArrayIndexOutOfBoundsException 수정. (#3427 by @vanniktech)
- [IDE 플러그인] 이전 kotlin 플러그인 참조에 대한 리플렉션 사용
- [컴파일러] 확장 함수가 있는 사용자 정의 다이얼렉트가 임포트(imports)를 생성하지 않음 (#3338 by @hfhbd)
- [컴파일러] `CodeBlock.of("${CodeBlock.toString()}")` 이스케이프 처리 수정 (#3340 by @hfhbd)
- [컴파일러] 마이그레이션에서 비동기 실행 문 대기 (#3352)
- [컴파일러] Fix AS (#3370 by @hfhbd)
- [컴파일러] `getObject` 메서드가 실제 타입 자동 채우기(automatic filling) 지원. (#3401 by @robxyy)
- [컴파일러] 비동기 그룹 반환 문에 대한 코드 생성 수정 (#3411)
- [컴파일러] 가능한 경우 바인드 매개변수의 Kotlin 타입을 추론(infer the Kotlin type)하거나, 더 나은 오류 메시지와 함께 실패하도록 변경 (#3413 by @hfhbd)
- [컴파일러] `ABS("foo")` 허용하지 않음 (#3430 by @hfhbd)
- [컴파일러] 다른 매개변수에서 kotlin 타입 추론 지원 (#3431 by @hfhbd)
- [컴파일러] 항상 데이터베이스 구현 생성(create the database implementation) (#3540 by @hfhbd)
- [컴파일러] javaDoc 완화 및 사용자 정의 매퍼(mapper) 함수에도 추가 (#3554 @hfhbd)
- [컴파일러] 바인딩의 DEFAULT 수정 (by @hfhbd)
- [페이징] 페이징 3 수정 (#3396)
- [페이징] Long을 사용하여 OffsetQueryPagingSource 생성 허용 (#3409)
- [페이징] `Dispatchers.Main`을 정적으로 교체하지 않음 (#3428)

## [2.0.0-alpha03] - 2022-06-17
[2.0.0-alpha03]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha03

### 파괴적 변경(Breaking Changes)

- 다이얼렉트는 이제 실제 Gradle 의존성처럼 참조됩니다.
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 타입은 `AfterVersion`으로 대체되었으며, 이제 항상 드라이버를 가집니다.
- `Schema` 타입은 더 이상 `SqlDriver`의 서브타입이 아닙니다.
- `PreparedStatement` API는 이제 0-기반 인덱스로 호출됩니다.

### 추가
- [IDE 플러그인] 실행 중인 데이터베이스에 대해 SQLite, MySQL, PostgreSQL 명령 실행 지원 추가 (#2718 by @aperfilyev)
- [IDE 플러그인] Android Studio DB 인스펙터 지원 추가 (#3107 by @aperfilyev)
- [런타임] 비동기 드라이버 지원 추가 (#3168 by @dellisd)
- [네이티브 드라이버] 새로운 kotlin 네이티브 메모리 모델 지원 (#3177 by @kpgalligan)
- [JS 드라이버] SqlJs 워커(workers)용 드라이버 추가 (#3203 by @dellisd)
- [Gradle 플러그인] SQLDelight 작업에 대한 클래스패스(classpath) 노출
- [Gradle 플러그인] 마이그레이션을 스쿼시하는(squashing) Gradle 작업 추가
- [Gradle 플러그인] 마이그레이션 검사 중 스키마 정의(schema definitions)를 무시하는 플래그 추가
- [MySQL 다이얼렉트] MySQL에서 FOR SHARE 및 FOR UPDATE 지원 (#3098)
- [MySQL 다이얼렉트] MySQL 인덱스 힌트(index hints) 지원 (#3099)
- [PostgreSQL 다이얼렉트] date_trunc 추가 (#3295 by @hfhbd)
- [JSON 확장] JSON 테이블 함수 지원 (#3090)

### 변경
- [런타임] 드라이버 없는 AfterVersion 타입 제거 (#3091)
- [런타임] 스키마(Schema) 타입을 최상위로 이동
- [런타임] 타사 구현을 지원하기 위해 다이얼렉트 및 리졸버 열기 (#3232 by @hfhbd)
- [컴파일러] 실패 보고서에 컴파일에 사용된 다이얼렉트 포함 (#3086)
- [컴파일러] 사용되지 않는 어댑터 건너뛰기 (#3162 by @eygraber)
- [컴파일러] PrepareStatement에서 0-기반 인덱스 사용 (#3269 by @hfhbd)
- [Gradle 플러그인] 다이얼렉트도 문자열 대신 적절한 Gradle 의존성으로 만들기 (#3085)
- [Gradle 플러그인] Gradle Verify Task: 데이터베이스 파일이 누락된 경우 오류 발생. (#3126 by @vanniktech)

### 수정
- [Gradle 플러그인] Gradle 플러그인에 대한 사소한 정리 및 조정 (#3171 by @3flex)
- [Gradle 플러그인] 생성된 디렉토리(generated directory)여야 하는 파일 삭제 (#3198)
- [Gradle 플러그인] AGP 네임스페이스 속성 사용 (#3220)
- [Gradle 플러그인] `kotlin-stdlib`를 Gradle 플러그인의 런타임 의존성으로 추가하지 않음 (#3245 by @mbonnin)
- [Gradle 플러그인] 멀티플랫폼 구성 단순화 (#3246 by @mbonnin)
- [Gradle 플러그인] JS 전용 프로젝트 지원 (#3310 by @hfhbd)
- [IDE 플러그인] Gradle 툴링 API에 JAVA_HOME 사용 (#3078)
- [IDE 플러그인] IDE 플러그인 내부에서 JDBC 드라이버를 올바른 클래스 로더(classLoader)에 로드 (#3080)
- [IDE 플러그인] 기존 PSI 변경 중 오류를 방지하기 위해 무효화하기 전에 파일 요소를 null로 표시 (#3082)
- [IDE 플러그인] ALTER TABLE 문에서 새 테이블 이름의 사용처 찾기(find usages) 시 크래시 발생하지 않음 (#3106)
- [IDE 플러그인] 인스펙터(inspectors) 최적화 및 예상 예외 타입에 대해 자동으로 실패하도록 설정 (#3121)
- [IDE 플러그인] 생성된 디렉토리(generated directory)여야 하는 파일 삭제 (#3198)
- [IDE 플러그인] 안전하지 않은 연산자 호출 수정
- [컴파일러] RETURNING 문이 포함된 업데이트 및 삭제가 쿼리를 실행하도록 보장. (#3084)
- [컴파일러] 복합 SELECT(compound selects)에서 인수 타입 올바르게 추론 (#3096)
- [컴파일러] 공통 테이블은 데이터 클래스(data classes)를 생성하지 않으므로 반환하지 않음 (#3097)
- [컴파일러] 최상위 마이그레이션 파일 더 빠르게 찾기 (#3108)
- [컴파일러] 파이프 연산자(pipe operator)에서 널러블리티(nullability) 올바르게 상속
- [컴파일러] iif ANSI SQL 함수(ANSI SQL function) 지원
- [컴파일러] 빈 쿼리 파일(empty query files) 생성하지 않음 (#3300 by @hfhbd)
- [컴파일러] 물음표(question mark)만 있는 어댑터 수정 (#3314 by @hfhbd)
- [PostgreSQL 다이얼렉트] Postgres 기본 키 열은 항상 NULL을 허용하지 않음 (#3092)
- [PostgreSQL 다이얼렉트] 여러 테이블에서 동일한 이름으로 복사(copy) 수정 (#3297 by @hfhbd)
- [SQLite 3.35 다이얼렉트] 변경된 테이블에서 인덱싱된 열을 삭제할 때만 오류 표시 (#3158 by @eygraber)

## [2.0.0-alpha02] - 2022-04-13
[2.0.0-alpha02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha02

### 파괴적 변경(Breaking Changes)

- `app.cash.sqldelight.runtime.rx`의 모든 발생을 `app.cash.sqldelight.rx2`로 바꿔야 합니다.

### 추가
- [컴파일러] 그룹화된 문(grouped statement) 끝에서 반환 지원
- [컴파일러] 다이얼렉트 모듈을 통한 컴파일러 확장 지원 및 SQLite JSON 확장 추가 (#1379, #2087)
- [컴파일러] 값을 반환하는 PRAGMA 문 지원 (#1106)
- [컴파일러] 표시된 열에 대한 값 타입 생성 지원
- [컴파일러] 낙관적 잠금(optimistic locks) 및 유효성 검사(validation) 지원 추가 (#1952)
- [컴파일러] 다중 업데이트(multi-update) 문 지원
- [PostgreSQL] postgres 반환 문 지원
- [PostgreSQL] postgres 날짜 타입 지원
- [PostgreSQL] pg 간격(intervals) 지원
- [PostgreSQL] PG 불리언(Booleans) 지원 및 ALTER TABLE에 대한 삽입(inserts) 수정
- [PostgreSQL] Postgres에서 선택적 제한(limits) 지원
- [PostgreSQL] PG BYTEA 타입 지원
- [PostgreSQL] postgres serials에 대한 테스트 추가
- [PostgreSQL] postgres 구문 업데이트 지원
- [PostgreSQL] PostgreSQL 배열 타입 지원
- [PostgreSQL] PG에서 UUID 타입 올바르게 저장/검색
- [PostgreSQL] PostgreSQL NUMERIC 타입 지원 (#1882)
- [PostgreSQL] 공통 테이블 표현식(common table expressions) 내부에서 쿼리 반환 지원 (#2471)
- [PostgreSQL] JSON 특정 연산자 지원
- [PostgreSQL] Postgres COPY 추가 (by @hfhbd)
- [MySQL] MySQL REPLACE 지원
- [MySQL] NUMERIC/BigDecimal MySQL 타입 지원 (#2051)
- [MySQL] MySQL TRUNCATE 문 지원
- [MySQL] MySQL에서 JSON 특정 연산자 지원 (by @eygraber)
- [MySQL] MySQL INTERVAL 지원 (#2969 by @eygraber)
- [HSQL] HSQL 윈도우 기능 추가
- [SQLite] WHERE 절에서 널러블(nullable) 매개변수에 대한 동등성 검사(equality checks)를 대체하지 않음 (#1490 by @eygraber)
- [SQLite] Sqlite 3.35 반환 문 지원 (#1490 by @eygraber)
- [SQLite] GENERATED 절 지원
- [SQLite] Sqlite 3.38 다이얼렉트 지원 추가 (by @eygraber)

### 변경
- [컴파일러] 생성된 코드(generated code) 약간 정리
- [컴파일러] 그룹화된 문(grouped statements)에서 테이블 매개변수 사용 금지 (#1822)
- [컴파일러] 그룹화된 쿼리를 트랜잭션 내에 배치 (#2785)
- [런타임] 드라이버의 execute 메서드에서 업데이트된 행 개수(updated row count) 반환
- [런타임] 연결에 접근하는 중요 섹션(critical section)에 SqlCursor 제한. (#2123 by @andersio)
- [Gradle 플러그인] 마이그레이션에 대한 스키마 정의(schema definitions) 비교 (#841)
- [PostgreSQL] PG에 대한 이중 따옴표(double quotes) 허용하지 않음
- [MySQL] MySQL에서 `==` 사용 시 오류 발생 (#2673)

### 수정
- [컴파일러] 2.0 알파에서 다른 테이블의 동일한 어댑터 타입이 컴파일 오류를 일으키는 문제
- [컴파일러] UPSERT 문 컴파일 문제 (#2791)
- [컴파일러] 쿼리 결과는 여러 일치 항목이 있는 경우 SELECT의 테이블을 사용해야 함 (#1874, #2313)
- [컴파일러] INSTEAD OF 트리거가 있는 뷰 업데이트 지원 (#1018)
- [컴파일러] 함수 이름에서 FROM 및 FOR 지원
- [컴파일러] 함수 표현식(function expressions)에서 SEPARATOR 키워드 허용
- [컴파일러] ORDER BY 절에서 별칭이 지정된 테이블(aliased table)의 ROWID에 접근할 수 없음
- [컴파일러] MySQL의 HAVING 절에서 별칭이 지정된 열 이름이 인식되지 않음
- [컴파일러] 잘못된 'Multiple columns found' 오류
- [컴파일러] `PRAGMA locking_mode = EXCLUSIVE` 설정 불가;
- [PostgreSQL] Postgresql 열 이름 변경
- [MySQL] UNIX_TIMESTAMP, TO_SECONDS, JSON_ARRAYAGG MySQL 함수 인식되지 않음
- [SQLite] SQLite 윈도우 기능 수정
- [IDE 플러그인] 빈 진행률 표시기에서 이동(goto) 핸들러 실행 (#2990)
- [IDE 플러그인] 프로젝트가 구성되지 않은 경우 하이라이트 방문자(highlight visitor)가 실행되지 않도록 함 (#2981, #2976)
- [IDE 플러그인] 전이적(transitive) 생성 코드도 IDE에서 업데이트되도록 보장 (#1837)
- [IDE 플러그인] 다이얼렉트 업데이트 시 인덱스 무효화

## [2.0.0-alpha01] - 2022-03-31
[2.0.0-alpha01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha01

이것은 2.0의 첫 번째 알파 릴리스이며 일부 파괴적 변경 사항이 있습니다. 더 많은 ABI 파괴적 변경 사항이 예상되므로 이 릴리스에 의존하는 라이브러리를 게시하지 마십시오 (애플리케이션은 괜찮을 것입니다).

### 파괴적 변경(Breaking Changes)

- 첫째, `com.squareup.sqldelight`의 모든 발생을 `app.cash.sqldelight`로 바꿔야 합니다.
- 둘째, `app.cash.sqldelight.android`의 모든 발생을 `app.cash.sqldelight.driver.android`로 바꿔야 합니다.
- 셋째, `app.cash.sqldelight.sqlite.driver`의 모든 발생을 `app.cash.sqldelight.driver.jdbc.sqlite`로 바꿔야 합니다.
- 넷째, `app.cash.sqldelight.drivers.native`의 모든 발생을 `app.cash.sqldelight.driver.native`로 바꿔야 합니다.
- IDE 플러그인은 [알파 또는 EAP 채널](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)에서 찾을 수 있는 2.X 버전으로 업데이트되어야 합니다.
- 다이얼렉트는 이제 Gradle 내에서 지정할 수 있는 의존성입니다:

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

현재 지원되는 다이얼렉트는 `mysql-dialect`, `postgresql-dialect`, `hsql-dialect`, `sqlite-3-18-dialect`, `sqlite-3-24-dialect`, `sqlite-3-25-dialect`, `sqlite-3-30-dialect`, `sqlite-3-35-dialect`입니다.

- 기본 타입(Primitive types)은 이제 임포트되어야 합니다 (예: `INTEGER AS Boolean`의 경우 `import kotlin.Boolean`을 해야 함). 이전에 지원되던 일부 타입은 이제 어댑터가 필요합니다. 대부분의 변환(`Integer AS kotlin.Int`와 같은)을 위해 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01`에서 기본 어댑터(primitive adapters)를 사용할 수 있습니다.

### 추가
- [IDE 플러그인] 기본 제안 마이그레이션 (by @aperfilyev)
- [IDE 플러그인] 알 수 없는 타입에 대한 임포트 빠른 수정(import quick fix) 추가 (by @aperfilyev)
- [IDE 플러그인] kotlin 클래스 자동 완성(completion) 추가 (by @aperfilyev)
- [Gradle 플러그인] Gradle 타입 안전 프로젝트 접근자(type safe project accessors)에 대한 바로 가기 추가 (by @hfhbd)
- [컴파일러] 다이얼렉트를 기반으로 코드 생성 사용자 정의 (by @MariusVolkhart)
- [JDBC 드라이버] JdbcDriver에 공통 타입 추가 (by @MariusVolkhart)
- [SQLite] SQLite 3.35 지원 추가 (by @eygraber)
- [SQLite] ALTER TABLE DROP COLUMN 지원 추가 (by @eygraber)
- [SQLite] Sqlite 3.30 다이얼렉트 지원 추가 (by @eygraber)
- [SQLite] sqlite에서 NULLS FIRST/LAST 지원 (by @eygraber)
- [HSQL] HSQL에 생성된 절(generated clause) 지원 추가 (by @MariusVolkhart)
- [HSQL] HSQL에서 명명된 매개변수 지원 추가 (by @MariusVolkhart)
- [HSQL] HSQL INSERT 쿼리 사용자 정의 (by @MariusVolkhart)

### 변경
- [전체] 패키지 이름이 `com.squareup.sqldelight`에서 `app.cash.sqldelight`로 변경되었습니다.
- [런타임] 다이얼렉트를 자체 격리된 Gradle 모듈로 이동
- [런타임] 드라이버가 구현하는 쿼리 알림으로 전환.
- [런타임] 기본 열 어댑터(default column adapters)를 별도 모듈로 추출 (#2056, #2060)
- [컴파일러] 각 모듈에서 쿼리 구현을 다시 하는 대신 모듈이 쿼리 구현을 생성하도록 함
- [컴파일러] 생성된 데이터 클래스(data classes)의 사용자 정의 `toString` 생성 제거. (by @PaulWoitaschek)
- [JS 드라이버] sql.js 의존성 제거 (by @dellisd)
- [페이징] 안드로이드 페이징 2 확장 제거
- [IDE 플러그인] SQLDelight 동기화 중(syncing) 에디터 배너 추가 (#2511)
- [IDE 플러그인] 지원되는 IntelliJ 최소 버전은 2021.1입니다.

### 수정
- [런타임] 할당 및 포인터 추적(pointer chasing)을 줄이기 위해 리스너 목록 평탄화. (by @andersio)
- [IDE 플러그인] 오류 메시지 수정: 오류로 점프할 수 있도록 허용 (by @hfhbd)
- [IDE 플러그인] 누락된 검사 설명 추가 (#2768 by @aperfilyev)
- [IDE 플러그인] `GotoDeclarationHandler`의 예외 수정 (#2531, #2688, #2804 by @aperfilyev)
- [IDE 플러그인] import 키워드 강조 (by @aperfilyev)
- [IDE 플러그인] 해결되지 않은(unresolved) kotlin 타입 수정 (#1678 by @aperfilyev)
- [IDE 플러그인] 해결되지 않은(unresolved) 패키지 강조 수정 (#2543 by @aperfilyev)
- [IDE 플러그인] 프로젝트 인덱스가 아직 초기화되지 않은 경우 불일치 열 검사 시도하지 않음
- [IDE 플러그인] Gradle 동기화가 시작될 때까지 파일 인덱스 초기화하지 않음
- [IDE 플러그인] Gradle 동기화가 시작되면 SQLDelight 임포트(import) 취소
- [IDE 플러그인] 실행 취소 작업이 수행된 스레드 외부에서 데이터베이스 재생성
- [IDE 플러그인] 참조를 해결할 수 없는 경우 빈 자바 타입 사용
- [IDE 플러그인] 파일 파싱 중 메인 스레드(main thread)에서 올바르게 이동하고 쓰기 시에만 메인 스레드(main thread)로 돌아옴
- [IDE 플러그인] 이전 IntelliJ 버전과의 호환성 개선 (by @3flex)
- [IDE 플러그인] 더 빠른 어노테이션 API 사용
- [Gradle 플러그인] 런타임 추가 시 js/android 플러그인 명시적으로 지원 (by @ZacSweers)
- [Gradle 플러그인] 마이그레이션에서 스키마를 파생하지 않고 마이그레이션 출력 작업 등록 (#2744 by @kevincianfarini)
- [Gradle 플러그인] 마이그레이션 작업이 충돌하면 실행 중 충돌한 파일 인쇄
- [Gradle 플러그인] 코드 생성 시 파일을 정렬하여 멱등성(idempotent) 출력 보장 (by @ZacSweers)
- [컴파일러] 파일 반복에 더 빠른 API 사용 및 전체 PSI 그래프 탐색하지 않음
- [컴파일러] 함수 매개변수 선택에 키워드 망글링(mangling) 추가 (#2759 by @aperfilyev)
- [컴파일러] 마이그레이션 어댑터의 `packageName` 수정 (by @hfhbd)
- [컴파일러] 타입 대신 속성(properties)에 어노테이션(annotations) 방출 (#2798 by @aperfilyev)
- [컴파일러] `Query` 서브타입에 전달하기 전에 인수 정렬 (#2379 by @aperfilyev)

## [1.5.3] - 2021-11-23
[1.5.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.3

### 추가
- [JDBC 드라이버] 3자 드라이버 구현을 위해 JdbcDriver 열기 (#2672 by @hfhbd)
- [MySQL 다이얼렉트] 시간 증가(time increments)에 대한 누락된 함수 추가 (#2671 by @sdoward)
- [코루틴 확장] coroutines-extensions에 M1 타겟 추가 (by @PhilipDukhov)

### 변경
- [Paging3 확장] sqldelight-android-paging3을 AAR 대신 JAR로 배포 (#2634 by @julioromano)
- 소프트 키워드(soft keywords)이기도 한 속성 이름은 이제 밑줄(underscores)이 붙습니다. 예를 들어 `value`는 `value_`로 노출됩니다.

### 수정
- [컴파일러] 중복 배열 매개변수(duplicate array parameters)에 대해 변수 추출하지 않음 (by @aperfilyev)
- [Gradle 플러그인] `kotlin.mpp.enableCompatibilityMetadataVariant` 추가. (#2628 by @martinbonnin)
- [IDE 플러그인] 사용처 찾기(Find usages) 처리에 읽기 액션(read action) 필요

## [1.5.2] - 2021-10-12
[1.5.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.2

### 추가
- [Gradle 플러그인] HMPP 지원(HMPP support) (#2548 by @martinbonnin)
- [IDE 플러그인] NULL 비교 검사(NULL comparison inspection) 추가 (by @aperfilyev)
- [IDE 플러그인] 검사 억제기(inspection suppressor) 추가 (#2519 by @aperfilyev)
- [IDE 플러그인] 혼합된 명명된(mixed named) 및 위치(positional) 매개변수 검사 추가 (by @aperfilyev)
- [SQLite 드라이버] mingwX86 타겟 추가. (#2558 by @enginegl)
- [SQLite 드라이버] M1 타겟 추가
- [SQLite 드라이버] linuxX64 지원 추가 (#2456 by @chippman)
- [MySQL 다이얼렉트] MySQL에 ROW_COUNT 함수 추가 (#2523)
- [PostgreSQL 다이얼렉트] postgres 이름 변경, 열 삭제 (by @pabl0rg)
- [PostgreSQL 다이얼렉트] PostgreSQL 문법이 CITEXT를 인식하지 못함
- [PostgreSQL 다이얼렉트] TIMESTAMP WITH TIME ZONE 및 TIMESTAMPTZ 포함
- [PostgreSQL 다이얼렉트] PostgreSQL 생성 열(GENERATED columns)에 대한 문법 추가
- [런타임] SqlDriver를 AfterVersion의 매개변수로 제공 (#2534, 2614 by @ahmedre)

### 변경
- [Gradle 플러그인] Gradle 7.0 명시적으로 요구 (#2572 by @martinbonnin)
- [Gradle 플러그인] `VerifyMigrationTask`가 Gradle의 최신 검사(up-to-date checks)를 지원하도록 변경 (#2533 by @3flex)
- [IDE 플러그인] 널러블(nullable) 타입과 널러블이 아닌(non-nullable) 타입을 JOIN할 때 "Join compares two columns of different types" 경고 표시하지 않음 (#2550 by @pchmielowski)
- [IDE 플러그인] 열 타입의 소문자 'as'에 대한 오류 명확화 (by @aperfilyev)

### 수정
- [IDE 플러그인] 프로젝트가 이미 폐기된(disposed) 경우 새 다이얼렉트에서 다시 파싱하지 않음 (#2609)
- [IDE 플러그인] 연결된 가상 파일(virtual file)이 null인 경우 모듈은 null임 (#2607)
- [IDE 플러그인] 사용되지 않는 쿼리 검사(unused query inspection) 중에 충돌 방지 (#2610)
- [IDE 플러그인] 데이터베이스 동기화 쓰기(database sync write)를 쓰기 액션 내에서 실행 (#2605)
- [IDE 플러그인] IDE가 SQLDelight 동기화를 예약하도록 함
- [IDE 플러그인] `JavaTypeMixin`의 NPE 수정 (#2603 by @aperfilyev)
- [IDE 플러그인] `MismatchJoinColumnInspection`에서 IndexOutOfBoundsException 수정 (#2602 by @aperfilyev)
- [IDE 플러그인] `UnusedColumnInspection`에 대한 설명 추가 (#2600 by @aperfilyev)
- [IDE 플러그인] `PsiElement.generatedVirtualFiles`를 읽기 액션으로 래핑 (#2599 by @aperfilyev)
- [IDE 플러그인] 불필요한 nonnull 캐스트 제거 (#2596)
- [IDE 플러그인] 사용처 찾기(find usages)에 대해 null을 올바르게 처리 (#2595)
- [IDE 플러그인] Android용으로 생성된 파일에 대한 IDE 자동 완성(autocomplete) 수정 (#2573 by @martinbonnin)
- [IDE 플러그인] `SqlDelightGotoDeclarationHandler`의 NPE 수정 (by @aperfilyev)
- [IDE 플러그인] INSERT 문 내부 인수에서 kotlin 키워드 망글링(mangle) (#2433 by @aperfilyev)
- [IDE 플러그인] `SqlDelightFoldingBuilder`의 NPE 수정 (#2382 by @aperfilyev)
- [IDE 플러그인] `CopyPasteProcessor`에서 `ClassCastException` 캐치 (#2369 by @aperfilyev)
- [IDE 플러그인] 라이브 템플릿 업데이트 수정 (by @IliasRedissi)
- [IDE 플러그인] 인텐션 액션에 설명 추가 (#2489 by @aperfilyev)
- [IDE 플러그인] `CreateTriggerMixin`에서 테이블을 찾을 수 없는 경우 예외 수정 (by @aperfilyev)
- [컴파일러] 테이블 생성 문을 위상적으로 정렬
- [컴파일러] 디렉토리에서 `forDatabaseFiles` 콜백 호출 중지 (#2532)
- [Gradle 플러그인] `generateDatabaseInterface` 작업 의존성을 잠재적 소비자에게 전파 (#2518 by @martinbonnin)

## [1.5.1] - 2021-07-16
[1.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.1

### 추가
- [PostgreSQL 다이얼렉트] PostgreSQL JSONB 및 ON CONFLICT DO NOTHING (by @satook)
- [PostgreSQL 다이얼렉트] PostgreSQL ON CONFLICT (column, ...) DO UPDATE 지원 추가 (by @satook)
- [MySQL 다이얼렉트] MySQL 생성 열(generated columns) 지원 (by @JGulbronson)
- [네이티브 드라이버] watchosX64 지원 추가
- [IDE 플러그인] 매개변수 타입 및 어노테이션 추가 (by @aperfilyev)
- [IDE 플러그인] 'select all' 쿼리 생성 액션 추가 (by @aperfilyev)
- [IDE 플러그인] 자동 완성(autocomplete)에 열 타입 표시 (by @aperfilyev)
- [IDE 플러그인] 자동 완성(autocomplete)에 아이콘 추가 (by @aperfilyev)
- [IDE 플러그인] 'select by primary key' 쿼리 생성 액션 추가 (by @aperfilyev)
- [IDE 플러그인] 'insert into' 쿼리 생성 액션 추가 (by @aperfilyev)
- [IDE 플러그인] 열 이름, stmt 식별자, 함수 이름 강조 추가 (by @aperfilyev)
- [IDE 플러그인] 남은 쿼리 생성 액션 추가 (#489 by @aperfilyev)
- [IDE 플러그인] insert-stmt에서 매개변수 힌트 표시 (by @aperfilyev)
- [IDE 플러그인] 테이블 별칭(alias) 인텐션 액션 (by @aperfilyev)
- [IDE 플러그인] 열 이름 한정(qualify) 인텐션 (by @aperfilyev)
- [IDE 플러그인] kotlin 속성(property)으로 선언 이동 (by @aperfilyev)

### 변경
- [네이티브 드라이버] 가능한 경우 고정(freezing) 및 공유 가능한 데이터 구조(shareable data structures)를 피하여 네이티브 트랜잭션 성능 향상 (by @andersio)
- [페이징 3] Paging3 버전을 3.0.0 stable로 상향
- [JS 드라이버] sql.js를 1.5.0으로 업그레이드

### 수정
- [JDBC SQLite 드라이버] ThreadLocal을 지우기 전에 연결에 `close()` 호출 (#2444 by @hannesstruss)
- [RX 확장] 구독/폐기(subscription / disposal) 경쟁 누수(race leak) 수정 (#2403 by @pyricau)
- [코루틴 확장] 알림 전에 쿼리 리스너(listener) 등록 확인
- [컴파일러] 일관된 kotlin 출력 파일을 위해 notifyQueries 정렬 (by @thomascjy)
- [컴파일러] SELECT 쿼리 클래스 속성(properties)에 `@JvmField` 어노테이션 달지 않음 (by @eygraber)
- [IDE 플러그인] 임포트 최적화(import optimizer) 수정 (#2350 by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 열 검사(unused column inspection) 수정 (by @aperfilyev)
- [IDE 플러그인] 임포트 검사(import inspection) 및 클래스 어노테이터(class annotator)에 중첩 클래스(nested classes) 지원 추가 (by @aperfilyev)
- [IDE 플러그인] `CopyPasteProcessor`의 NPE 수정 (#2363 by @aperfilyev)
- [IDE 플러그인] `InlayParameterHintsProvider`의 크래시 수정 (#2359 by @aperfilyev)
- [IDE 플러그인] CREATE TABLE stmt에 텍스트를 복사/붙여넣기할 때 빈 줄 삽입 수정 (#2431 by @aperfilyev)

## [1.5.0] - 2021-04-23
[1.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.0

### 추가
- [SQLite Javascript 드라이버] sqljs-driver 게시 활성화 (#1667 by @dellisd)
- [Paging3 확장] Android Paging 3 라이브러리용 확장 (#1786 by @kevincianfarini)
- [MySQL 다이얼렉트] mysql의 ON DUPLICATE KEY UPDATE 충돌 해결 지원 추가 (by @rharter)
- [SQLite 다이얼렉트] SQLite offsets()에 대한 컴파일러 지원 추가 (by @qjroberts)
- [IDE 플러그인] 알 수 없는 타입에 대한 임포트 빠른 수정(import quick fix) 추가 (#683 by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 임포트 검사(unused import inspection) 추가 (#1161 by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 쿼리 검사(unused query inspection) 추가 (by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 열 검사(unused column inspection) 추가 (#569 by @aperfilyev)
- [IDE 플러그인] 복사/붙여넣기 시 임포트 자동 가져오기 (#684 by @aperfilyev)
- [IDE 플러그인] Gradle/IntelliJ 플러그인 버전 간에 호환성 문제가 있을 때 풍선(balloon) 띄우기
- [IDE 플러그인] `Insert Into ... VALUES(?)` 매개변수 힌트 (#506 by @aperfilyev)
- [IDE 플러그인] 인라인 매개변수 힌트 (by @aperfilyev)
- [런타임] 콜백을 사용하여 마이그레이션을 실행하기 위한 런타임 API 포함 (#1844)

### 변경
- [컴파일러] "IS NOT NULL" 쿼리 스마트 캐스트 (#867)
- [컴파일러] 런타임에 실패할 수 있는 키워드 방지 (#1471, #1629)
- [Gradle 플러그인] Gradle 플러그인 크기를 60mb -> 13mb로 줄임.
- [Gradle 플러그인] 안드로이드 변형(variants)을 올바르게 지원하고, KMM 타겟별 SQL 지원 제거 (#1039)
- [Gradle 플러그인] minsdk를 기반으로 최소 sqlite 버전 선택 (#1684)
- [네이티브 드라이버] 네이티브 드라이버 연결 풀 및 성능 업데이트

### 수정
- [컴파일러] 람다(lambdas) 앞 NBSP (by @oldergod)
- [컴파일러] 생성된 `bind*` 및 `cursor.get*` 문에서 호환되지 않는 타입 수정
- [컴파일러] SQL 절은 어댑팅된 타입 유지 (#2067)
- [컴파일러] NULL 키워드만 있는 열은 널러블(nullable)이어야 함
- [컴파일러] 타입 어노테이션과 함께 매퍼 람다(mapper lambda) 생성하지 않음 (#1957)
- [컴파일러] 사용자 정의 쿼리가 충돌하는 경우 파일 이름을 추가 패키지 접미사(package suffix)로 사용 (#1057, #1278)
- [컴파일러] 외래 키(foreign key) CASCADE가 쿼리 리스너(listener)에 알림을 보내도록 보장 (#1325, #1485)
- [컴파일러] 동일한 타입 두 개를 UNION하는 경우 테이블 타입 반환 (#1342)
- [컴파일러] ifnull 및 coalesce의 매개변수가 널러블이 될 수 있도록 보장 (#1263)
- [컴파일러] 쿼리에서 부과된 널러블리티(nullability)를 표현식에 올바르게 사용
- [MySQL 다이얼렉트] MySQL if 문 지원
- [PostgreSQL 다이얼렉트] PostgreSQL에서 NUMERIC 및 DECIMAL을 Double로 검색 (#2118)
- [SQLite 다이얼렉트] UPSERT 알림은 BEFORE/AFTER UPDATE 트리거를 고려해야 함. (#2198 by @andersio)
- [SQLite 드라이버] 메모리 내(in memory)가 아닌 경우 SqliteDriver에서 스레드에 대해 여러 연결 사용 (#1832)
- [JDBC 드라이버] JDBC 드라이버는 autoCommit이 true라고 가정함 (#2041)
- [JDBC 드라이버] 예외 발생 시 연결 닫기 보장 (#2306)
- [IDE 플러그인] 경로 구분자(path separator) 버그로 인해 Windows에서 GoToDeclaration/FindUsages가 작동하지 않는 문제 수정 (#2054 by @angusholder)
- [IDE 플러그인] Gradle 오류 무시, IDE에서 충돌하지 않음.
- [IDE 플러그인] sqldelight 파일이 sqldelight가 아닌 모듈로 이동된 경우 코드 생성을 시도하지 않음
- [IDE 플러그인] IDE에서 코드 생성 오류 무시
- [IDE 플러그인] 음수 서브스트링 시도하지 않도록 보장 (#2068)
- [IDE 플러그인] 프로젝트가 Gradle 액션 실행 전에 폐기되지 않도록 보장 (#2155)
- [IDE 플러그인] 널러블 타입에 대한 산술(Arithmetic)도 널러블이어야 함 (#1853)
- [IDE 플러그인] 'expand * intention'이 추가 프로젝션(additional projections)과 함께 작동하도록 수정 (#2173 by @aperfilyev)
- [IDE 플러그인] Kotlin 해결 실패 시 sqldelight 파일로 이동 시도하지 않음 (GoTo 중)
- [IDE 플러그인] SQLDelight 인덱싱(indexing) 중 IntelliJ에서 예외가 발생하면 충돌하지 않음
- [IDE 플러그인] IDE에서 코드 생성 전 오류 감지 시 발생하는 예외 처리
- [IDE 플러그인] IDE 플러그인을 동적 플러그인(Dynamic Plugins)과 호환되도록 만듦 (#1536)
- [Gradle 플러그인] WorkerApi를 사용하여 데이터베이스 생성 시 경합 조건(Race condition) (#2062 by @stephanenicolas)
- [Gradle 플러그인] classLoaderIsolation은 사용자 정의 jdbc 사용을 방지함 (#2048 by @benasher44)
- [Gradle 플러그인] packageName 누락 오류 메시지 개선 (by @vanniktech)
- [Gradle 플러그인] SQLDelight가 IntelliJ 의존성을 빌드 스크립트 클래스 경로에 누출 (#1998)
- [Gradle 플러그인] Gradle 빌드 캐싱(build caching) 수정 (#2075)
- [Gradle 플러그인] Gradle 플러그인에서 kotlin-native-utils에 의존하지 않음 (by @ilmat192)
- [Gradle 플러그인] 마이그레이션 파일만 있는 경우에도 데이터베이스 작성 (#2094)
- [Gradle 플러그인] 최종 컴파일 유닛(compilation unit)에서 다이아몬드 의존성(diamond dependencies)이 한 번만 선택되도록 보장 (#1455)

또한 이 릴리스에서 SQLDelight 인프라 개선에 많은 노력을 기울인 [Matthew Haughton][3flex]에게 감사의 말씀을 전합니다.

## [1.4.4] - 2020-10-08
[1.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.4

### 추가
- [PostgreSQL 다이얼렉트] WITH 절에서 데이터 수정(data-modifying) 문 지원
- [PostgreSQL 다이얼렉트] SUBSTRING 함수 지원
- [Gradle 플러그인] SQLDelight 컴파일 중 마이그레이션 유효성 검사(validation)를 위한 `verifyMigrations` 플래그 추가 (#1872)

### 변경
- [컴파일러] SQLite 특정 함수를 비-SQLite 다이얼렉트에서 알 수 없는 함수로 플래그 지정
- [Gradle 플러그인] sqldelight 플러그인이 적용되었지만 데이터베이스가 구성되지 않은 경우 경고 제공 (#1421)

### 수정
- [컴파일러] ORDER BY 절에서 열 이름을 바인딩할 때 오류 보고 (#1187 by @eygraber)
- [컴파일러] 레지스트리(Registry) 경고가 db 인터페이스 생성 시 표시됨 (#1792)
- [컴파일러] CASE 문에 대한 잘못된 타입 추론 (#1811)
- [컴파일러] 버전 없는 마이그레이션 파일에 대해 더 나은 오류 제공 (#2006)
- [컴파일러] 마샬링(marshal)할 필수 데이터베이스 타입이 일부 데이터베이스 타입 ColumnAdapter에 대해 잘못됨 (#2012)
- [컴파일러] CAST의 널러블리티(Nullability) (#1261)
- [컴파일러] 쿼리 래퍼에서 많은 이름 섀도우(name shadowed) 경고 (#1946 by @eygraber)
- [컴파일러] 생성된 코드(generated code)가 전체 한정자(qualifier) 이름을 사용함 (#1939)
- [IDE 플러그인] Gradle 동기화에서 sqldelight 코드 생성 트리거
- [IDE 플러그인] .sq 파일 변경 시 플러그인이 데이터베이스 인터페이스를 재생성하지 않음 (#1945)
- [IDE 플러그인] 파일을 새 패키지로 이동할 때 발생하는 문제 (#444)
- [IDE 플러그인] 커서를 이동할 곳이 없으면 충돌하는 대신 아무것도 하지 않음 (#1994)
- [IDE 플러그인] Gradle 프로젝트 외부의 파일에 대해 빈 패키지 이름 사용 (#1973)
- [IDE 플러그인] 유효하지 않은 타입에 대해 정상적으로 실패 (#1943)
- [IDE 플러그인] 알 수 없는 표현식을 만났을 때 더 나은 오류 메시지 발생 (#1958)
- [Gradle 플러그인] SQLDelight가 IntelliJ 의존성을 빌드 스크립트 클래스 경로에 누출 (#1998)
- [Gradle 플러그인] "JavadocIntegrationKt not found" 컴파일 오류 (doc in *.sq 파일 추가 시) (#1982)
- [Gradle 플러그인] SqlDelight Gradle 플러그인은 Configuration Caching (CoCa)을 지원하지 않음. (#1947 by @stephanenicolas)
- [SQLite JDBC 드라이버] `SQLException`: 데이터베이스가 자동 커밋(auto-commit) 모드임 (#1832)
- [코루틴 확장] coroutines-extensions에 대한 IR 백엔드 수정 (#1918 by @dellisd)

## [1.4.3] - 2020-09-04
[1.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.3

### 추가
- [MySQL 다이얼렉트] MySQL `last_insert_id` 함수 지원 추가 (by @lawkai)
- [PostgreSQL 다이얼렉트] SERIAL 데이터 타입 지원 (by @veyndan & @felipecsl)
- [PostgreSQL 다이얼렉트] PostgreSQL RETURNING 지원 (by @veyndan)

### 수정
- [MySQL 다이얼렉트] MySQL `AUTO_INCREMENT`를 기본값(default value)을 가지는 것으로 처리 (#1823)
- [컴파일러] Upsert 문 컴파일 오류 수정 (#1809 by @eygraber)
- [컴파일러] 유효하지 않은 Kotlin이 생성되는 문제 수정 (#1925 by @eygraber)
- [컴파일러] 알 수 없는 함수에 대해 더 나은 오류 메시지 제공 (#1843)
- [컴파일러] instr의 두 번째 매개변수 타입을 String으로 노출
- [IDE 플러그인] IDE 플러그인에 대한 데몬(daemon) 비대화(bloat) 및 UI 스레드 멈춤(stalling) 수정 (#1916)
- [IDE 플러그인] null 모듈 시나리오 처리 (#1902)
- [IDE 플러그인] 구성되지 않은 sq 파일에서 패키지 이름에 대해 빈 문자열 반환 (#1920)
- [IDE 플러그인] 그룹화된 문(grouped statements) 수정 및 통합 테스트 추가 (#1820)
- [IDE 플러그인] 요소의 모듈을 찾기 위해 내장 `ModuleUtil` 사용 (#1854)
- [IDE 플러그인] 유효한 요소만 조회(lookups)에 추가 (#1909)
- [IDE 플러그인] 부모(Parent)는 null일 수 있음 (#1857)

## [1.4.2] - 2020-08-27
[1.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.2

### 추가
- [런타임] 새로운 JS IR 백엔드 지원
- [Gradle 플러그인] `generateSqlDelightInterface` Gradle 작업 추가. (by @vanniktech)
- [Gradle 플러그인] `verifySqlDelightMigration` Gradle 작업 추가. (by @vanniktech)

### 수정
- [IDE 플러그인] Gradle 툴링 API를 사용하여 IDE와 Gradle 간의 데이터 공유 용이하게 함
- [IDE 플러그인] 스키마 파생(schema derivation)에 대해 기본값으로 false 설정
- [IDE 플러그인] commonMain 소스 세트(source set) 올바르게 검색
- [MySQL 다이얼렉트] `mySqlFunctionType()`에 minute 추가 (by @maaxgr)

## [1.4.1] - 2020-08-21
[1.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.1

### 추가
- [런타임] Kotlin 1.4.0 지원 (#1859)

### 변경
- [Gradle 플러그인] AGP 의존성을 compileOnly로 변경 (#1362)

### 수정
- [컴파일러] 열 정의 규칙 및 테이블 인터페이스 생성기에 선택적 자바독(javadoc) 추가 (#1224 by @endanke)
- [SQLite 다이얼렉트] sqlite fts5 보조 함수 highlight, snippet, bm25 지원 추가 (by @drampelt)
- [MySQL 다이얼렉트] MySQL bit 데이터 타입 지원
- [MySQL 다이얼렉트] MySQL 이진 리터럴 지원
- [PostgreSQL 다이얼렉트] sql-psi에서 SERIAL 노출 (by @veyndan)
- [PostgreSQL 다이얼렉트] BOOLEAN 데이터 타입 추가 (by @veyndan)
- [PostgreSQL 다이얼렉트] NULL 열 제약 조건 추가 (by @veyndan)
- [HSQL 다이얼렉트] HSQL에 `AUTO_INCREMENT` 지원 추가 (by @rharter)

## [1.4.0] - 2020-06-22
[1.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.0

### 추가
- [MySQL 다이얼렉트] MySQL 지원 (by @JGulbronson & @veyndan)
- [PostgreSQL 다이얼렉트] 실험적 PostgreSQL 지원 (by @veyndan)
- [HSQL 다이얼렉트] 실험적 H2 지원 (by @MariusVolkhart)
- [SQLite 다이얼렉트] SQLite FTS5 지원 (by @benasher44 & @jpalawaga)
- [SQLite 다이얼렉트] ALTER TABLE RENAME COLUMN 지원 (#1505 by @angusholder)
- [IDE] 마이그레이션(.sqm) 파일 IDE 지원
- [IDE] 내장 SQL 라이브 템플릿을 모방한 SQLDelight 라이브 템플릿 추가 (#1154 by @veyndan)
- [IDE] 새 SqlDelight 파일 액션 추가 (#42 by @romtsn)
- [런타임] 결과 반환 트랜잭션을 위한 transactionWithReturn API
- [컴파일러] .sq 파일에서 여러 SQL 문을 함께 그룹화하는 구문
- [컴파일러] 마이그레이션 파일에서 스키마 생성 지원
- [Gradle 플러그인] 마이그레이션 파일을 유효한 SQL로 출력하는 작업 추가

### 변경
- [문서] 문서 웹사이트 전면 개편 (by @saket)
- [Gradle 플러그인] 지원되지 않는 다이얼렉트 오류 메시지 개선 (by @veyndan)
- [IDE] 다이얼렉트에 따라 파일 아이콘 동적으로 변경 (by @veyndan)
- [JDBC 드라이버] `javax.sql.DataSource`에서 JdbcDriver 생성자 노출 (#1614)

### 수정
- [컴파일러] 테이블에 대한 자바독(Javadoc) 지원 및 한 파일에 여러 자바독 수정 (#1224)
- [컴파일러] 합성된 열(synthesized columns)에 대한 값 삽입 활성화 (#1351)
- [컴파일러] 디렉토리 이름 정규화(sanitizing)의 불일치 수정 (by @ZacSweers)
- [컴파일러] 합성된 열(synthesized columns)은 JOIN을 통해 널러블리티(nullability)를 유지해야 함 (#1656)
- [컴파일러] DELETE 키워드에 삭제 문 고정 (#1643)
- [컴파일러] 인용 부호(quoting) 수정 (#1525 by @angusholder)
- [컴파일러] BETWEEN 연산자가 표현식으로 올바르게 재귀되도록 수정 (#1279)
- [컴파일러] 인덱스 생성 시 누락된 테이블/열에 대해 더 나은 오류 제공 (#1372)
- [컴파일러] JOIN 제약 조건에서 외부 쿼리 투영(outer query's projection) 사용 가능하도록 설정 (#1346)
- [네이티브 드라이버] execute가 transationPool을 사용하도록 함 (by @benasher44)
- [JDBC 드라이버] sqlite 대신 jdbc 트랜잭션 API 사용 (#1693)
- [IDE] virtualFile 참조가 항상 원본 파일이 되도록 수정 (#1782)
- [IDE] Bugsnag에 오류를 보고할 때 올바른 throwable 사용 (#1262)
- [페이징 확장] DataSource 누수 수정 (#1628)
- [Gradle 플러그인] 스키마 생성 시 출력 db 파일이 이미 존재하면 삭제 (#1645)
- [Gradle 플러그인] 간격(gaps)이 있으면 마이그레이션 유효성 검사(validation) 실패
- [Gradle 플러그인] 설정한 파일 인덱스 명시적으로 사용 (#1644)

## [1.3.0] - 2020-04-03
[1.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.3.0

* 신규: [Gradle] 컴파일할 SQL 다이얼렉트를 지정하는 Dialect 속성.
* 신규: [컴파일러] #1009 mysql 다이얼렉트 실험적 지원.
* 신규: [컴파일러] #1436 sqlite:3.24 다이얼렉트 및 upsert 지원.
* 신규: [JDBC 드라이버] sqlite jvm 드라이버에서 JDBC 드라이버 분리.
* 수정: [컴파일러] #1199 모든 길이의 람다(lambdas) 지원.
* 수정: [컴파일러] #1610 avg()의 반환 타입이 널러블(nullable)이 되도록 수정.
* 수정: [IntelliJ] #1594 경로 구분자(path separator) 처리 수정 (Windows에서 Goto 및 Find Usages가 작동하지 않던 문제).

## [1.2.2] - 2020-01-22
[1.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.2

* 신규: [런타임] Windows (mingW), tvOS, watchOS, macOS 아키텍처 지원.
* 수정: [컴파일러] sum()의 반환 타입은 널러블(nullable)이어야 합니다.
* 수정: [페이징] 경쟁 조건(race conditions)을 피하기 위해 Transacter를 QueryDataSourceFactory에 전달.
* 수정: [IntelliJ 플러그인] 파일의 패키지 이름을 찾을 때 의존성을 검색하지 않음.
* 수정: [Gradle] #862 Gradle의 validator 로그를 디버그 레벨로 변경.
* 개선: [Gradle] GenerateSchemaTask를 Gradle worker를 사용하도록 전환.
* 참고: sqldelight-runtime 아티팩트 이름이 runtime으로 변경되었습니다.

## [1.2.1] - 2019-12-11
[1.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.1

* 수정: [Gradle] Kotlin Native 1.3.60 지원.
* 수정: [Gradle] #1287 동기화 시 경고.
* 수정: [컴파일러] #1469 SynetheticAccessor 생성.
* 수정: [JVM 드라이버] 메모리 누수(memory leak) 수정.
* 참고: 코루틴(coroutine) 확장 아티팩트는 빌드 스크립트에 kotlinx bintray maven 저장소가 추가되어야 합니다.

## [1.2.0] - 2019-08-30
[1.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.0

* 신규: [런타임] 안정적인 Flow API.
* 수정: [Gradle] Kotlin Native 1.3.50 지원.
* 수정: [Gradle] #1380 클린 빌드(Clean build)가 때때로 실패.
* 수정: [Gradle] #1348 verify 작업 실행 시 "Could not retrieve functions" 인쇄.
* 수정: [컴파일] #1405 쿼리에 FTS 테이블이 조인되어 있으면 프로젝트 빌드 불가.
* 수정: [Gradle] #1266 여러 데이터베이스 모듈이 있을 때 Gradle 빌드 간헐적 실패.

## [1.1.4] - 2019-07-11
[1.1.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.4

* 신규: [런타임] 실험적 kotlin Flow API.
* 수정: [Gradle] Kotlin/Native 1.3.40 호환성.
* 수정: [Gradle] #1243 Gradle configure-on-demand와 SQLDelight 사용 시 수정.
* 수정: [Gradle] #1385 점진적(incremental) 어노테이션 처리와 SQLDelight 사용 시 수정.
* 수정: [Gradle] Gradle 작업 캐시 허용.
* 수정: [Gradle] #1274 kotlin dsl에서 sqldelight 확장 사용 활성화.
* 수정: [컴파일러] 각 쿼리에 대해 고유 ID가 결정적으로 생성됩니다.
* 수정: [컴파일러] 트랜잭션이 완료될 때만 수신 쿼리(listening queries)에 알립니다.
* 수정: [JVM 드라이버] #1370 JdbcSqliteDriver 사용자가 DB URL을 제공하도록 강제.

## [1.1.3] - 2019-04-14
[1.1.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.3

* Gradle Metadata 1.0 릴리스.

## [1.1.2] - 2019-04-14
[1.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.2

* 신규: [런타임] 로깅 드라이버 데코레이터(logging driver decorator).
* 수정: [컴파일러] 2^16 문자보다 긴 문자열 리터럴(string literals) 분할. (#1254)
* 수정: [Gradle] #1260 생성된 소스(generated sources)가 멀티플랫폼 프로젝트(Multiplatform Project)에서 iOS 소스로 인식됨.
* 수정: [IDE] #1290 kotlin.KotlinNullPointerException in `CopyAsSqliteAction.kt:43`.
* 수정: [Gradle] #1268 최근 버전에서 linkDebugFrameworkIos* 작업 실행 실패.

## [1.1.1] - 2019-03-01
[1.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.1

* 수정: [Gradle] Android 프로젝트에 대한 모듈 의존성 컴파일 수정.
* 수정: [Gradle] #1246 `afterEvaluate`에서 API 의존성 설정.
* 수정: [컴파일러] 배열 타입이 올바르게 인쇄됩니다.

## [1.1.0] - 2019-02-27
[1.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.0

* 신규: [Gradle] #502 스키마 모듈 의존성 지정 허용.
* 개선: [컴파일러] #1111 테이블 오류가 다른 오류보다 먼저 정렬됩니다.
* 수정: [컴파일러] #1225 REAL 리터럴에 대한 올바른 타입 반환.
* 수정: [컴파일러] #1218 docid가 트리거를 통해 전파됩니다.

## [1.0.3] - 2019-01-30
[1.0.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.3

* 개선: [런타임] #1195 네이티브 드라이버/런타임 Arm32.
* 개선: [런타임] #1190 Query 타입에서 매퍼 노출.

## [1.0.2] - 2019-01-26
[1.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.2

* 수정: [Gradle 플러그인] kotlin 1.3.20으로 업데이트.
* 수정: [런타임] 트랜잭션이 더 이상 예외를 무시하지 않음.

## [1.0.1] - 2019-01-21
[1.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.1

* 개선: [네이티브 드라이버] `DatabaseConfiguration`에 디렉토리 이름 전달 허용.
* 개선: [컴파일러] #1173 패키지 없는 파일은 컴파일 실패.
* 수정: [IDE] IDE 오류를 Square에 올바르게 보고.
* 수정: [IDE] #1162 동일한 패키지의 타입이 오류로 표시되지만 정상 작동.
* 수정: [IDE] #1166 테이블 이름 변경 시 NPE 발생.
* 수정: [컴파일러] #1167 UNION 및 SELECT를 포함하는 복합 SQL 문을 파싱하려고 할 때 예외 발생.

## [1.0.0] - 2019-01-08
[1.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.0

* 신규: 생성된 코드의 전면 개편, 이제 kotlin으로 제공.
* 신규: RxJava2 확장 아티팩트.
* 신규: Android Paging 확장 아티팩트.
* 신규: Kotlin 멀티플랫폼 지원.
* 신규: Android, iOS, JVM SQLite 드라이버 아티팩트.
* 신규: 트랜잭션 API.

## [0.7.0] - 2018-02-12
[0.7.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.7.0

 * 신규: 생성된 코드(generated code)는 이제 Support SQLite 라이브러리만 사용하도록 업데이트되었습니다. 모든 쿼리는 이제 원시 문자열 대신 문(statement) 객체를 생성합니다.
 * 신규: IDE에서 문(Statement) 폴딩.
 * 신규: 불리언 타입이 이제 자동으로 처리됩니다.
 * 수정: 코드 생성에서 사용되지 않는 마샬(marshals) 제거.
 * 수정: 'avg' SQL 함수 타입 매핑이 REAL이 되도록 수정.
 * 수정: 'julianday' SQL 함수를 올바르게 감지.

## [0.6.1] - 2017-03-22
[0.6.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.1

 * 신규: 인수 없는 DELETE, UPDATE, INSERT 문에 대해 컴파일된 문(statements)이 생성됩니다.
 * 수정: 서브쿼리에서 사용된 뷰 내 USING 절이 오류를 발생시키지 않음.
 * 수정: 생성된 Mapper에서 중복 타입 제거.
 * 수정: 서브쿼리가 인수에 대해 검사하는 표현식에 사용될 수 있습니다.

## [0.6.0] - 2017-03-06
[0.6.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.0

 * 신규: SELECT 쿼리가 문자열 상수 대신 `SqlDelightStatement` 팩토리로 노출됩니다.
 * 신규: 쿼리 자바독(JavaDoc)이 문(statement) 및 매퍼(mapper) 팩토리로 복사됩니다.
 * 신규: 뷰 이름에 대한 문자열 상수 방출.
 * 수정: 팩토리가 필요한 뷰에 대한 쿼리가 이제 해당 팩토리를 인수로 올바르게 요구합니다.
 * 수정: INSERT에 대한 인수 개수가 지정된 열 개수와 일치하는지 확인.
 * 수정: WHERE 절에서 사용되는 BLOB 리터럴을 올바르게 인코딩.
 * 이 릴리스에는 Gradle 3.3 이상이 필요합니다.

## [0.5.1] - 2016-10-24
[0.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.1

 * 신규: 컴파일된 문(statements)이 추상 타입을 확장합니다.
 * 수정: 매개변수의 기본 타입은 널러블(nullable)인 경우 박싱(boxed)됩니다.
 * 수정: 바인드 인수에 필요한 모든 팩토리가 팩토리 메서드에 존재합니다.
 * 수정: 이스케이프된 열 이름이 RuntimeExceptions를 발생시키지 않고 올바르게 마샬링(marshalled)됩니다.

## [0.5.0] - 2016-10-19
[0.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.0

 * 신규: SQLite 인수가 팩토리(Factory)를 통해 타입 안전하게 전달될 수 있습니다.
 * 신규: IntelliJ 플러그인이 .sq 파일에 대한 서식 지정(formatting)을 수행합니다.
 * 신규: SQLite 타임스탬프 리터럴 지원.
 * 수정: 매개변수화된 타입이 IntelliJ에서 클릭 가능합니다.
 * 수정: 이스케이프된 열 이름이 더 이상 Cursor에서 가져올 때 RuntimeExceptions를 발생시키지 않습니다.
 * 수정: Gradle 플러그인이 예외를 인쇄하려고 할 때 충돌하지 않습니다.

## [0.4.4] - 2016-07-20
[0.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.4

 * 신규: 열 자바 타입으로 shorts에 대한 네이티브 지원.
 * 신규: 생성된 매퍼 및 팩토리 메서드에 자바독(Javadoc) 추가.
 * 수정: group_concat 및 nullif 함수의 널러블리티(nullability)가 올바릅니다.
 * 수정: Android Studio 2.2-alpha와의 호환성.
 * 수정: WITH RECURSIVE가 더 이상 플러그인을 충돌시키지 않음.

## [0.4.3] - 2016-07-07
[0.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.3

 * 신규: 컴파일 오류가 소스 파일로 링크됩니다.
 * 신규: 오른쪽 클릭으로 SQLDelight 코드를 유효한 SQLite로 복사할 수 있습니다.
 * 신규: 명명된 문(statements)에 대한 자바독(Javadoc)이 생성된 String에 나타납니다.
 * 수정: 생성된 뷰 모델에 널러블리티(nullability) 어노테이션이 포함됩니다.
 * 수정: UNION으로 생성된 코드(generated code)는 가능한 모든 열을 지원하기 위해 올바른 타입과 널러블리티를 가집니다.
 * 수정: sum 및 round SQLite 함수의 생성된 코드(generated code)에서 올바른 타입.
 * 수정: CAST's, 내부 SELECT의 버그 수정.
 * 수정: CREATE TABLE 문에서 자동 완성(Autocomplete).
 * 수정: SQLite 키워드가 패키지에서 사용될 수 있습니다.

## [0.4.2] - 2016-06-16
[0.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.2

 * 신규: 마샬(Marshal)이 팩토리에서 생성될 수 있습니다.
 * 수정: IntelliJ 플러그인이 올바른 제네릭 순서로 팩토리 메서드를 생성합니다.
 * 수정: 함수 이름은 어떤 대소문자도 사용할 수 있습니다.

## [0.4.1] - 2016-06-14
[0.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.1

 * 수정: IntelliJ 플러그인이 올바른 제네릭 순서로 클래스를 생성합니다.
 * 수정: 열 정의는 어떤 대소문자도 사용할 수 있습니다.

## [0.4.0] - 2016-06-14
[0.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.0

 * 신규: 매퍼(Mappers)는 테이블별 대신 쿼리별로 생성됩니다.
 * 신규: .sq 파일에서 Java 타입을 임포트할 수 있습니다.
 * 신규: SQLite 함수가 유효성 검사(validated)됩니다.
 * 수정: 중복 오류 제거.
 * 수정: 대문자 열 이름 및 Java 키워드 열 이름이 오류를 발생시키지 않습니다.

## [0.3.2] - 2016-05-14
[0.3.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.2

 * 신규: 자동 완성(Autocompletion) 및 사용처 찾기(find usages)가 이제 뷰 및 별칭에 대해 작동합니다.
 * 수정: 컴파일 시간 유효성 검사(Compile-time validation)가 이제 함수를 SELECT에서 사용할 수 있도록 허용합니다.
 * 수정: 기본값만 선언하는 INSERT 문 지원.
 * 수정: SQLDelight를 사용하지 않는 프로젝트를 임포트할 때 플러그인이 더 이상 충돌하지 않습니다.

## [0.3.1] - 2016-04-27
[0.3.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.1

  * 수정: 인터페이스 가시성(visibility)이 메서드 참조에서 Illegal Access 런타임 예외를 피하기 위해 다시 public으로 변경되었습니다.
  * 수정: 서브 표현식(Subexpressions)이 올바르게 평가됩니다.

## [0.3.0] - 2016-04-26
[0.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.0

  * 신규: 열 정의는 SQLite 타입을 사용하며 추가 'AS' 제약 조건을 가질 수 있어 Java 타입을 지정할 수 있습니다.
  * 신규: IDE에서 버그 보고서를 보낼 수 있습니다.
  * 수정: 자동 완성(Autocomplete) 기능이 제대로 작동합니다.
  * 수정: SQLDelight 모델 파일이 .sq 파일 편집 시 업데이트됩니다.
  * 제거: 연결된 데이터베이스(Attached databases)는 더 이상 지원되지 않습니다.

## [0.2.2] - 2016-03-07
[0.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.2

 * 신규: INSERT, UPDATE, DELETE, INDEX, TRIGGER 문에서 사용되는 열의 컴파일 시간 유효성 검사(Compile-time validation).
 * 수정: 파일 이동/생성 시 IDE 플러그인 충돌하지 않음.

## [0.2.1] - 2016-03-07
[0.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.1

 * 신규: Ctrl+`/` (OSX에서는 Cmd+`/`)는 선택된 줄의 주석을 토글합니다.
 * 신규: SQL 쿼리에서 사용되는 열의 컴파일 시간 유효성 검사(Compile-time validation).
 * 수정: IDE 및 Gradle 플러그인 모두에서 Windows 경로 지원.

## [0.2.0] - 2016-02-29
[0.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.0

 * 신규: Marshal 클래스에 복사 생성자(copy constructor) 추가.
 * 신규: Kotlin 1.0 final로 업데이트.
 * 수정: 'sqldelight' 폴더 구조 문제를 실패하지 않는 방식으로 보고.
 * 수정: `table_name`으로 명명된 열 금지. 생성된 상수가 테이블 이름 상수와 충돌합니다.
 * 수정: IDE 플러그인이 즉시, 그리고 `.sq` 파일이 열렸는지 여부와 상관없이 모델 클래스를 생성하도록 보장.
 * 수정: IDE 및 Gradle 플러그인 모두에서 Windows 경로 지원.

## [0.1.2] - 2016-02-13
[0.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.2

 * 수정: 대부분의 프로젝트에서 Gradle 플러그인 사용을 막던 코드 제거.
 * 수정: Antlr 런타임에 대한 컴파일러 의존성 누락 수정.

## [0.1.1] - 2016-02-12
[0.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.1

 * 수정: Gradle 플러그인이 자체 런타임과 동일한 버전을 가리키도록 보장.

## [0.1.0] - 2016-02-12
[0.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.0

초기 릴리스.