# 변경 로그

## 미출시

### 추가
- [Gradle 플러그인] 시작 스키마 버전이 1이 아니고 `verifyMigrations`가 true일 때 빌드 실패를 수정했습니다 (#6017 by @neilgmiller)
- [Gradle 플러그인] `SqlDelightWorkerTask`를 더 구성 가능하도록 만들고, Windows 개발을 지원하도록 기본 구성을 업데이트했습니다 (#5215 by @MSDarwish2000)
- [SQLite 다이얼렉트] FTS5 가상 테이블에서 합성된 열(synthesized columns) 지원을 추가했습니다 (#5986 by @watbe)

### 변경
- [컴파일러] 패키지 이름에 밑줄 사용을 허용했습니다. 이전에는 밑줄이 정리되어 예상치 못한 동작을 일으켰습니다 (#6027 by @BierDav)
- [Paging 확장] AndroidX Paging으로 전환했습니다 (#5910 by @jeffdgr8)

### 수정
- [SQLite 다이얼렉트] 사용자 지정 열 타입 사용 시 `group_concat` 함수에 String 타입을 사용했습니다 (#6082 by @griffio)
- [Gradle 플러그인] 복잡한 스키마에서 멈추는 것을 방지하기 위해 `VerifyMigrationTask`의 성능을 개선했습니다 (#6073 by @Lightwood13)

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
- [Gradle 플러그인] `DriverInitializer`를 `GenerateSchemaTask` 이전에 실행했습니다 (#5562 by @nwagu)
- [런타임] 실제 드라이버가 비동기(Async)일 때 `LogSqliteDriver`의 크래시(crash)를 수정했습니다 (#5723 by @edenman)
- [런타임] `StringBuilder` 용량(capacity)을 수정했습니다 (#5192 by @janbina)
- [PostgreSQL 다이얼렉트] PostgreSql CREATE OR REPLACE VIEW를 수정했습니다 (#5407 by @griffio)
- [PostgreSQL 다이얼렉트] Postgresql TO_JSON을 수정했습니다 (#5606 by @griffio)
- [PostgreSQL 다이얼렉트] PostgreSql 숫자(numeric) 리졸버를 수정했습니다 (#5399 by @griffio)
- [PostgreSQL 다이얼렉트] sqlite 윈도우 함수(windows function)를 수정했습니다 (#2799 by @griffio)
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
- [컴파일러] 캡슐화 타입(encapsulatingType)에서 타입 널 허용 여부(nullability) 재정의를 허용했습니다 (#4882 by @eygraber)
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
- [PostgreSQL 다이얼렉트] PostgreSQL CTE 보조 문(auxiliary statements)이 서로 참조하도록 허용했습니다 (#4493 by @griffio)
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
- [런타임] `linuxArm64`, `androidNative` 및 `watchosDeviceArm` 타겟을 런타임에 추가했습니다 (#4258 by @hfhbd)
- [Paging 확장] 페이징 확장에 `linux` 및 `mingw x64` 타겟을 추가했습니다 (#4280 by @chippman)

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
- [Gradle 플러그인] `ServiceLoader` 메커니즘으로 `VerifyMigrationTask`에 대한 `DriverInitializer` 등록을 허용했습니다 (#3986 by @C2H6O)
- [Gradle 플러그인] 명시적 컴파일러 환경을 생성했습니다 (#4079 by @hfhbd)
- [JS 드라이버] 웹 워커 드라이버를 별도 아티팩트로 분할했습니다
- [JS 드라이버] `JsWorkerSqlCursor` 노출을 금지했습니다 (#3874 by @hfhbd)
- [JS 드라이버] `sqljs` 드라이버 게시를 비활성화했습니다 (#4108)
- [런타임] 동기 드라이버가 동기 스키마 이니셜라이저를 요구하도록 강제했습니다 (#4013)
- [런타임] 커서에 대한 비동기 지원을 개선했습니다 (#4102)
- [런타임] 사용 중단된 타겟을 제거했습니다 (#4149 by @hfhbd)
- [런타임] 오래된 MM(메모리 모델) 지원을 제거했습니다 (#4148 by @hfhbd)

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
- [IDE 플러그인] 타입 이름 대신 마이그레이션 생성을 위한 SQL 열 이름을 사용했습니다 (#4112 by @aperfilyev)

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
- [R2DBC 드라이버] 대신 `javaObjectType`을 사용했습니다 (by @hfhbd)
- [R2DBC 드라이버] `bindStatement`에서 기본 타입 널(null) 값을 수정했습니다 (by @hfhbd)
- [R2DBC 드라이버] R2DBC 1.0을 지원했습니다 (by @hfhbd)
- [PostgreSQL 다이얼렉트] Postgres: 타입 매개변수 없는 배열을 수정했습니다 (by @hfhbd)
- [IDE 플러그인] intellij를 221.6008.13으로 업데이트했습니다 (by @hfhbd)
- [컴파일러] 순수 뷰에서 재귀적 원본 테이블을 해결했습니다 (by @hfhbd)
- [컴파일러] 테이블 외래 키 절에서 값 클래스를 사용했습니다 (by @hfhbd)
- [컴파일러] 괄호 없는 바인딩 표현식을 지원하도록 `SelectQueryGenerator`를 수정했습니다 (by @bellatoris)
- [컴파일러] 트랜잭션 사용 시 `${name}Indexes` 변수의 중복 생성을 수정했습니다 (#6490 by @sachera)

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
- 코루틴 확장(coroutines extension)은 이제 기본값이 아닌 디스패처를 전달해야 합니다.
- 다이얼렉트 및 드라이버 클래스는 final이며, 대신 위임(delegation)을 사용하십시오.

### 추가
- [HSQL 다이얼렉트] HSQL: INSERT에서 생성된 열에 DEFAULT 사용을 지원했습니다 (#3372 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL: INSERT에서 생성된 열에 DEFAULT 사용을 지원했습니다 (#3373 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL에 `NOW()`를 추가했습니다 (#3403 by @hfhbd)
- [PostgreSQL 다이얼렉트] PostgreSQL에 NOT 연산자를 추가했습니다 (#3504 by @hfhbd)
- [Paging] `*QueryPagingSource`에 `CoroutineContext` 전달을 허용했습니다 (#3384)
- [Gradle 플러그인] 다이얼렉트에 대한 더 나은 버전 카탈로그(version catalog) 지원을 추가했습니다 (#3435)
- [네이티브 드라이버] `NativeSqliteDriver`의 `DatabaseConfiguration` 생성에 훅을 걸 수 있는 콜백을 추가했습니다 (#3512 by @svenjacobs)

### 변경
- [Paging] `KeyedQueryPagingSource`가 지원하는 `QueryPagingSource` 함수에 기본 디스패처를 추가했습니다 (#3385)
- [Paging] `OffsetQueryPagingSource`가 `Int` 타입으로만 작동하도록 변경했습니다 (#3386)
- [비동기 런타임] `await*`를 상위 클래스 `ExecutableQuery`로 이동했습니다 (#3524 by @hfhbd)
- [코루틴 확장] 플로우 확장(flow extensions)에서 기본 매개변수를 제거했습니다 (#3489)

### 수정
- [Gradle 플러그인] Kotlin 1.7.20으로 업데이트했습니다 (#3542 by @zacsweers)
- [R2DBC 드라이버] 항상 값을 보내지 않는 R2DBC 변경 사항을 채택했습니다 (#3525 by @hfhbd)
- [HSQL 다이얼렉트] HSQL로 인해 실패하는 SQLite `VerifyMigrationTask`를 수정했습니다 (#3380 by @hfhbd)
- [Gradle 플러그인] 작업이 Gradle의 지연 구성(lazy configuration) API를 사용하도록 변환했습니다 (by @3flex)
- [Gradle 플러그인] Kotlin 1.7.20에서 NPE(NullPointerException)를 방지했습니다 (#3398 by @ZacSweers)
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

- 다이얼렉트는 이제 실제 Gradle 종속성처럼 참조됩니다.
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 타입은 이제 항상 드라이버를 포함하는 `AfterVersion` 타입으로 대체되어 제거되었습니다.
- `Schema` 타입은 더 이상 `SqlDriver`의 서브타입이 아닙니다.
- `PreparedStatement` API는 이제 0부터 시작하는 인덱스로 호출됩니다.

### 추가
- [IDE 플러그인] 실행 중인 데이터베이스에 대한 SQLite, MySQL, PostgreSQL 명령 실행 지원을 추가했습니다 (#2718 by @aperfilyev)
- [IDE 플러그인] Android Studio DB 인스펙터(inspector) 지원을 추가했습니다 (#3107 by @aperfilyev)
- [런타임] 비동기 드라이버(async drivers) 지원을 추가했습니다 (#3168 by @dellisd)
- [네이티브 드라이버] 새 Kotlin 네이티브 메모리 모델 지원을 추가했습니다 (#3177 by @kpgalligan)
- [JS 드라이버] SqlJs 워커(workers)용 드라이버를 추가했습니다 (#3203 by @dellisd)
- [Gradle 플러그인] SQLDelight 작업에 대한 클래스패스를 노출했습니다
- [Gradle 플러그인] 마이그레이션 스쿼시(squashing migrations)를 위한 Gradle 작업을 추가했습니다
- [Gradle 플러그인] 마이그레이션 확인 중 스키마 정의를 무시하는 플래그를 추가했습니다
- [MySQL 다이얼렉트] MySQL에서 FOR SHARE 및 FOR UPDATE 지원을 추가했습니다 (#3098)
- [MySQL 다이얼렉트] MySQL 인덱스 힌트(index hints) 지원을 추가했습니다 (#3099)
- [PostgreSQL 다이얼렉트] `date_trunc`를 추가했습니다 (#3295 by @hfhbd)
- [JSON 확장] JSON 테이블 함수 지원을 추가했습니다 (#3090)

### 변경
- [런타임] 드라이버 없는 AfterVersion 타입이 제거되었습니다 (#3091)
- [런타임] Schema 타입을 최상위로 이동했습니다
- [런타임] 서드파티 구현을 지원하기 위해 다이얼렉트 및 리졸버를 공개했습니다 (#3232 by @hfhbd)
- [컴파일러] 실패 보고서에 컴파일에 사용된 다이얼렉트를 포함했습니다 (#3086)
- [컴파일러] 사용되지 않는 어댑터를 건너뛰도록 했습니다 (#3162 by @eygraber)
- [컴파일러] `PreparedStatement`에서 0부터 시작하는 인덱스를 사용하도록 했습니다 (#3269 by @hfhbd)
- [Gradle 플러그인] 다이얼렉트도 단순 문자열 대신 적절한 Gradle 종속성으로 만들었습니다 (#3085)
- [Gradle 플러그인] Gradle 검증 작업: 데이터베이스 파일 누락 시 예외를 발생시키도록 했습니다 (#3126 by @vanniktech)

### 수정
- [Gradle 플러그인] Gradle 플러그인의 사소한 정리 및 조정 (#3171 by @3flex)
- [Gradle 플러그인] 생성된 디렉토리에 AGP 문자열을 사용하지 않도록 했습니다
- [Gradle 플러그인] AGP 네임스페이스 속성을 사용했습니다 (#3220)
- [Gradle 플러그인] `kotlin-stdlib`를 Gradle 플러그인의 런타임 종속성으로 추가하지 않도록 했습니다 (#3245 by @mbonnin)
- [Gradle 플러그인] 멀티플랫폼 구성을 단순화했습니다 (#3246 by @mbonnin)
- [Gradle 플러그인] js 전용 프로젝트를 지원했습니다 (#3310 by @hfhbd)
- [IDE 플러그인] Gradle 툴링 API에 대한 Java 홈을 사용했습니다 (#3078)
- [IDE 플러그인] IDE 플러그인 내에서 올바른 classLoader에 JDBC 드라이버를 로드했습니다 (#3080)
- [IDE 플러그인] 이미 존재하는 PSI 변경 중에 오류를 피하기 위해 무효화하기 전에 파일 요소를 null로 표시했습니다 (#3082)
- [IDE 플러그인] ALTER TABLE 문에서 새 테이블 이름의 사용처 찾기 중 크래시되지 않도록 했습니다 (#3106)
- [IDE 플러그인] 인스펙터를 최적화하고 예상되는 예외 타입에 대해 자동으로 실패하도록 설정했습니다 (#3121)
- [IDE 플러그인] 생성된 디렉토리여야 하는 파일을 삭제했습니다 (#3198)
- [IDE 플러그인] 안전하지 않은 연산자 호출을 수정했습니다
- [컴파일러] RETURNING 문이 쿼리를 실행하도록 보장했습니다 (#3084)
- [컴파일러] 복합 SELECT에서 인수 타입을 올바르게 추론했습니다 (#3096)
- [컴파일러] 공통 테이블은 데이터 클래스를 생성하지 않으므로 반환하지 않도록 했습니다 (#3097)
- [컴파일러] 상위 마이그레이션 파일을 더 빠르게 찾도록 했습니다 (#3108)
- [컴파일러] 파이프 연산자에서 널 허용 여부를 올바르게 상속하도록 했습니다
- [컴파일러] `iif` ANSI SQL 함수를 지원했습니다
- [컴파일러] 빈 쿼리 파일 생성을 방지했습니다 (#3300 by @hfhbd)
- [컴파일러] 물음표만 있는 어댑터를 수정했습니다 (#3314 by @hfhbd)
- [PostgreSQL 다이얼렉트] Postgres 기본 키 열은 항상 NULL을 허용하지 않습니다 (#3092)
- [PostgreSQL 다이얼렉트] 여러 테이블에서 동일한 이름으로 복사하는 문제를 수정했습니다 (#3297 by @hfhbd)
- [SQLite 3.35 다이얼렉트] 변경된 테이블에서 인덱스된 열을 삭제할 때만 오류를 표시하도록 했습니다 (#3158 by @eygraber)

## [2.0.0-alpha02] - 2022-04-13
[2.0.0-alpha02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha02

### 주요 변경 사항 (Breaking Changes)

- `app.cash.sqldelight.runtime.rx`의 모든 발생을 `app.cash.sqldelight.rx2`로 교체해야 합니다.

### 추가
- [컴파일러] 그룹화된 문 끝에서 반환 기능을 지원했습니다
- [컴파일러] 다이얼렉트 모듈을 통한 컴파일러 확장 지원 및 SQLite JSON 확장 추가 (#1379, #2087)
- [컴파일러] 값을 반환하는 PRAGMA 문 지원 (#1106)
- [컴파일러] 마크된 열에 대한 값 타입 생성 지원
- [컴파일러] 낙관적 잠금 및 유효성 검사 지원 추가 (#1952)
- [컴파일러] 다중 업데이트 문 지원
- [PostgreSQL] Postgres 반환 문 지원
- [PostgreSQL] Postgres 날짜 타입 지원
- [PostgreSQL] PG 간격 지원
- [PostgreSQL] PG 부울 지원 및 ALTER TABLE의 삽입 수정
- [PostgreSQL] Postgres의 선택적 제한 지원
- [PostgreSQL] PG BYTEA 타입 지원
- [PostgreSQL] Postgres SERIAL에 대한 테스트를 추가했습니다
- [PostgreSQL] 업데이트 Postgres 구문 지원
- [PostgreSQL] PostgreSQL 배열 타입 지원
- [PostgreSQL] PG에서 UUID 타입 올바르게 저장/검색
- [PostgreSQL] PostgreSQL NUMERIC 타입 지원 (#1882)
- [PostgreSQL] 공통 테이블 표현식 내에서 쿼리 반환 지원 (#2471)
- [PostgreSQL] JSON 특정 연산자 지원
- [PostgreSQL] Postgres Copy 추가 (by @hfhbd)
- [MySQL] MySQL Replace 지원
- [MySQL] NUMERIC/BigDecimal MySQL 타입 지원 (#2051)
- [MySQL] MySQL TRUNCATE 문 지원
- [MySQL] MySQL에서 JSON 특정 연산자 지원 (by @eygraber)
- [MySQL] MySQL INTERVAL 지원 (#2969 by @eygraber)
- [HSQL] HSQL 윈도우 기능 추가
- [SQLite] WHERE 절에서 널 허용 매개변수에 대한 동등성 검사를 교체하지 않도록 했습니다 (#1490 by @eygraber)
- [SQLite] Sqlite 3.35 반환 문 지원 (#1490 by @eygraber)
- [SQLite] GENERATED 절 지원
- [SQLite] Sqlite 3.38 다이얼렉트 지원 추가 (by @eygraber)

### 변경
- [컴파일러] 생성된 코드를 약간 정리했습니다
- [컴파일러] 그룹화된 문에서 테이블 매개변수 사용을 금지했습니다 (#1822)
- [컴파일러] 트랜잭션 내에서 그룹화된 쿼리를 배치했습니다 (#2785)
- [런타임] 드라이버 실행 메서드에서 업데이트된 행 개수를 반환하도록 했습니다
- [런타임] `SqlCursor`를 연결에 접근하는 임계 영역으로 제한했습니다 (#2123 by @andersio)
- [Gradle 플러그인] 마이그레이션에 대한 스키마 정의를 비교했습니다 (#841)
- [PostgreSQL] PG에 이중 따옴표 사용을 금지했습니다
- [MySQL] MySQL에서 `==` 사용 시 오류를 발생시키도록 했습니다 (#2673)

### 수정
- [컴파일러] 다른 테이블의 동일한 어댑터 타입으로 인해 2.0 알파에서 컴파일 오류가 발생하는 문제 수정
- [컴파일러] upsert 문 컴파일 문제 수정 (#2791)
- [컴파일러] 여러 일치 항목이 있는 경우 쿼리 결과는 SELECT의 테이블을 사용해야 합니다 (#1874, #2313)
- [컴파일러] INSTEAD OF 트리거가 있는 뷰 업데이트 지원 (#1018)
- [컴파일러] 함수 이름에 `from` 및 `for` 사용 지원
- [컴파일러] 함수 표현식에 SEPARATOR 키워드 허용
- [컴파일러] ORDER BY에서 별칭 테이블의 ROWID에 접근할 수 없는 문제 수정
- [컴파일러] MySQL의 HAVING 절에서 별칭 열 이름이 인식되지 않는 문제 수정
- [컴파일러] 잘못된 '여러 열이 발견됨' 오류 수정
- [컴파일러] `PRAGMA locking_mode = EXCLUSIVE` 설정 불가능 문제 수정
- [PostgreSQL] Postgresql 열 이름 변경 수정
- [MySQL] UNIX_TIMESTAMP, TO_SECONDS, JSON_ARRAYAGG MySQL 함수가 인식되지 않는 문제 수정
- [SQLite] SQLite 윈도우 기능 수정
- [IDE 플러그인] 빈 진행률 표시기에서 이동 핸들러를 실행했습니다 (#2990)
- [IDE 플러그인] 프로젝트가 구성되지 않은 경우 하이라이트 방문자가 실행되지 않도록 했습니다 (#2981, #2976)
- [IDE 플러그인] IDE에서도 전이적으로 생성된 코드 업데이트를 보장했습니다 (#1837)
- [IDE 플러그인] 다이얼렉트 업데이트 시 인덱스를 무효화했습니다

## [2.0.0-alpha01] - 2022-03-31
[2.0.0-alpha01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha01

이것은 2.0의 첫 번째 알파 릴리스이며 몇 가지 주요 변경 사항이 있습니다. 더 많은 ABI 주요 변경 사항이 예상되므로 이 릴리스에 종속된 라이브러리는 게시하지 마십시오 (애플리케이션은 괜찮을 것입니다).

### 주요 변경 사항 (Breaking Changes)

- 첫째, `com.squareup.sqldelight`의 모든 발생을 `app.cash.sqldelight`로 교체해야 합니다.
- 둘째, `app.cash.sqldelight.android`의 모든 발생을 `app.cash.sqldelight.driver.android`로 교체해야 합니다.
- 셋째, `app.cash.sqldelight.sqlite.driver`의 모든 발생을 `app.cash.sqldelight.driver.jdbc.sqlite`로 교체해야 합니다.
- 넷째, `app.cash.sqldelight.drivers.native`의 모든 발생을 `app.cash.sqldelight.driver.native`로 교체해야 합니다.
- IDE 플러그인은 [알파 또는 EAP 채널](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)에서 찾을 수 있는 2.X 버전으로 업데이트해야 합니다.
- 다이얼렉트는 이제 Gradle에서 지정할 수 있는 종속성입니다:

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

현재 지원되는 다이얼렉트는 `mysql-dialect`, `postgresql-dialect`, `hsql-dialect`, `sqlite-3-18-dialect`, `sqlite-3-24-dialect`, `sqlite-3-25-dialect`, `sqlite-3-30-dialect`, `sqlite-3-35-dialect`입니다.

- 기본 타입은 이제 임포트되어야 합니다 (예를 들어 `INTEGER AS Boolean`인 경우 `import kotlin.Boolean`을 임포트해야 합니다). 이전에 지원되던 일부 타입은 이제 어댑터가 필요합니다. 대부분의 변환 (예: `Integer AS kotlin.Int`에 대한 `IntColumnAdapter`)을 위한 기본 어댑터는 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01`에서 사용할 수 있습니다.

### 추가
- [IDE 플러그인] 기본 마이그레이션 제안 (by @aperfilyev)
- [IDE 플러그인] 임포트 힌트 액션 추가 (by @aperfilyev)
- [IDE 플러그인] Kotlin 클래스 완성 추가 (by @aperfilyev)
- [Gradle 플러그인] Gradle 타입 세이프 프로젝트 접근자에 대한 단축키 추가 (by @hfhbd)
- [컴파일러] 다이얼렉트에 따라 코드 생성 사용자 지정 (by @MariusVolkhart)
- [JDBC 드라이버] `JdbcDriver`에 공통 타입 추가 (by @MariusVolkhart)
- [SQLite] sqlite 3.35 지원 추가 (by @eygraber)
- [SQLite] ALTER TABLE DROP COLUMN 지원 추가 (by @eygraber)
- [SQLite] Sqlite 3.30 다이얼렉트 지원 추가 (by @eygraber)
- [SQLite] sqlite에서 NULLS FIRST/LAST 지원 (by @eygraber)
- [HSQL] 생성된 절에 대한 HSQL 지원 추가 (by @MariusVolkhart)
- [HSQL] HSQL에서 명명된 매개변수 지원 추가 (by @MariusVolkhart)
- [HSQL] HSQL INSERT 쿼리 사용자 지정 (by @MariusVolkhart)

### 변경
- [전체] 패키지 이름이 `com.squareup.sqldelight`에서 `app.cash.sqldelight`로 변경되었습니다.
- [런타임] 다이얼렉트를 자체 격리된 Gradle 모듈로 이동했습니다
- [런타임] 드라이버가 구현한 쿼리 알림으로 전환했습니다.
- [런타임] 기본 열 어댑터를 별도 모듈로 추출했습니다 (#2056, #2060)
- [컴파일러] 각 모듈에서 다시 구현하는 대신 모듈이 쿼리 구현을 생성하도록 했습니다
- [컴파일러] 생성된 데이터 클래스의 사용자 지정 `toString` 생성 기능을 제거했습니다. (by @PaulWoitaschek)
- [JS 드라이버] `sql.js` 종속성을 `sqljs-driver`에서 제거했습니다 (by @dellisd)
- [Paging] Android Paging 2 확장 기능을 제거했습니다
- [IDE 플러그인] SQLDelight 동기화 중 에디터 배너를 추가했습니다 (#2511)
- [IDE 플러그인] 최소 지원 IntelliJ 버전은 2021.1입니다

### 수정
- [런타임] 할당 및 포인터 추적을 줄이기 위해 리스너 목록을 평탄화했습니다. (by @andersio)
- [IDE 플러그인] 오류로 이동할 수 있도록 오류 메시지를 수정했습니다 (by @hfhbd)
- [IDE 플러그인] 누락된 인스펙션 설명을 추가했습니다 (#2768 by @aperfilyev)
- [IDE 플러그인] GotoDeclarationHandler에서 예외를 수정했습니다 (#2531, #2688, #2804 by @aperfilyev)
- [IDE 플러그인] 임포트 키워드를 강조 표시했습니다 (by @aperfilyev)
- [IDE 플러그인] 해결되지 않은 Kotlin 타입을 수정했습니다 (#1678 by @aperfilyev)
- [IDE 플러그인] 해결되지 않은 패키지에 대한 강조 표시를 수정했습니다 (#2543 by @aperfilyev)
- [IDE 플러그인] 프로젝트 인덱스가 아직 초기화되지 않은 경우 불일치하는 열을 검사하지 않도록 했습니다
- [IDE 플러그인] Gradle 동기화가 발생할 때까지 파일 인덱스를 초기화하지 않도록 했습니다
- [IDE 플러그인] Gradle 동기화가 시작되면 SQLDelight 임포트를 취소했습니다
- [IDE 플러그인] 실행 취소 액션이 수행되는 스레드 외부에서 데이터베이스를 재생성했습니다
- [IDE 플러그인] 참조를 해결할 수 없는 경우 빈 Java 타입을 사용했습니다
- [IDE 플러그인] 파일 파싱 중 메인 스레드에서 올바르게 벗어나고 쓰기 시에만 다시 메인 스레드로 이동하도록 했습니다
- [IDE 플러그인] 이전 IntelliJ 버전과의 호환성을 개선했습니다 (by @3flex)
- [IDE 플러그인] 더 빠른 어노테이션 API를 사용했습니다
- [Gradle 플러그인] 런타임을 추가할 때 js/android 플러그인을 명시적으로 지원했습니다 (by @ZacSweers)
- [Gradle 플러그인] 마이그레이션에서 스키마를 파생하지 않고 마이그레이션 출력 작업을 등록했습니다 (#2744 by @kevincianfarini)
- [Gradle 플러그인] 마이그레이션 작업이 크래시되는 경우, 크래시된 파일을 출력했습니다
- [Gradle 플러그인] 멱등적인 출력을 보장하기 위해 코드 생성 시 파일 정렬했습니다 (by @ZacSweers)
- [컴파일러] 파일 반복을 위한 더 빠른 API를 사용하고 전체 PSI 그래프를 탐색하지 않도록 했습니다
- [컴파일러] SELECT 함수 매개변수에 대한 키워드 변환(keyword mangling)을 추가했습니다 (#2759 by @aperfilyev)
- [컴파일러] 마이그레이션 어댑터에 대한 `packageName`을 수정했습니다 (by @hfhbd)
- [컴파일러] 타입 대신 속성에 어노테이션을 방출했습니다 (#2798 by @aperfilyev)
- [컴파일러] 쿼리 서브타입에 전달하기 전에 인수를 정렬했습니다 (#2379 by @aperfilyev)

## [1.5.3] - 2021-11-23
[1.5.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.3

### 추가
- [JDBC 드라이버] 서드파티 드라이버 구현을 위해 `JdbcDriver`를 공개했습니다 (#2672 by @hfhbd)
- [MySQL 다이얼렉트] 시간 증가에 대한 누락된 함수를 추가했습니다 (#2671 by @sdoward)
- [코루틴 확장] 코루틴 확장 기능에 대한 M1 타겟을 추가했습니다 (by @PhilipDukhov)

### 변경
- [Paging3 확장] `sqldelight-android-paging3`를 AAR 대신 JAR로 배포했습니다 (#2634 by @julioromano)
- 속성 이름이 소프트 키워드인 경우 이제 밑줄이 접미사로 붙습니다. 예를 들어 `value`는 `value_`로 노출됩니다.

### 수정
- [컴파일러] 중복 배열 매개변수에 대한 변수 추출을 방지했습니다 (by @aperfilyev)
- [Gradle 플러그인] `kotlin.mpp.enableCompatibilityMetadataVariant`를 추가했습니다 (#2628 by @martinbonnin)
- [IDE 플러그인] 사용처 찾기 처리에 읽기 액션이 필요합니다

## [1.5.2] - 2021-10-12
[1.5.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.2

### 추가
- [Gradle 플러그인] HMPP(계층형 멀티플랫폼 프로젝트) 지원 (#2548 by @martinbonnin)
- [IDE 플러그인] NULL 비교 인스펙션을 추가했습니다 (by @aperfilyev)
- [IDE 플러그인] 인스펙션 억제기(suppressor)를 추가했습니다 (#2519 by @aperfilyev)
- [IDE 플러그인] 혼합된 명명된 매개변수와 위치 매개변수 인스펙션을 추가했습니다 (by @aperfilyev)
- [SQLite 드라이버] mingwX86 타겟을 추가했습니다 (#2558 by @enginegl)
- [SQLite 드라이버] M1 타겟을 추가했습니다
- [SQLite 드라이버] linuxX64 지원을 추가했습니다 (#2456 by @chippmann)
- [MySQL 다이얼렉트] MySQL에 ROW_COUNT 함수를 추가했습니다 (#2523)
- [PostgreSQL 다이얼렉트] postgres 열 이름 변경, 열 제거 (by @pabl0rg)
- [PostgreSQL 다이얼렉트] PostgreSQL 문법이 CITEXT를 인식하지 못하는 문제 수정
- [PostgreSQL 다이얼렉트] TIMESTAMP WITH TIME ZONE 및 TIMESTAMPTZ를 포함했습니다
- [PostgreSQL 다이얼렉트] PostgreSQL 생성된 열(GENERATED columns)에 대한 문법을 추가했습니다
- [런타임] `SqlDriver`를 `AfterVersion`의 매개변수로 제공했습니다 (#2534, 2614 by @ahmedre)

### 변경
- [Gradle 플러그인] Gradle 7.0을 명시적으로 요구했습니다 (#2572 by @martinbonnin)
- [Gradle 플러그인] `VerifyMigrationTask`가 Gradle의 최신 상태 검사(up-to-date checks)를 지원하도록 했습니다 (#2533 by @3flex)
- [IDE 플러그인] 널 허용 타입과 널 허용이 아닌 타입을 조인할 때 "Join compares two columns of different types" 경고가 뜨지 않도록 했습니다 (#2550 by @pchmielowski)
- [IDE 플러그인] 열 타입에서 소문자 'as'에 대한 오류를 명확히 했습니다 (by @aperfilyev)

### 수정
- [IDE 플러그인] 프로젝트가 이미 소멸된 경우 새 다이얼렉트로 다시 파싱하지 않도록 했습니다 (#2609)
- [IDE 플러그인] 연결된 가상 파일이 null이면 모듈도 null입니다 (#2607)
- [IDE 플러그인] 사용되지 않는 쿼리 인스펙션 중에 크래시되지 않도록 했습니다 (#2610)
- [IDE 플러그인] 데이터베이스 동기화 쓰기 작업을 쓰기 액션 내에서 실행했습니다 (#2605)
- [IDE 플러그인] IDE가 SQLDelight 동기화를 예약하도록 했습니다
- [IDE 플러그인] JavaTypeMixin에서 NPE를 수정했습니다 (#2603 by @aperfilyev)
- [IDE 플러그인] MismatchJoinColumnInspection에서 IndexOutOfBoundsException을 수정했습니다 (#2602 by @aperfilyev)
- [IDE 플러그인] UnusedColumnInspection에 대한 설명을 추가했습니다 (#2600 by @aperfilyev)
- [IDE 플러그인] `PsiElement.generatedVirtualFiles`를 읽기 액션으로 래핑했습니다 (#2599 by @aperfilyev)
- [IDE 플러그인] 불필요한 nonnull 캐스트를 제거했습니다 (#2596)
- [IDE 플러그인] 사용처 찾기에 대해 null을 올바르게 처리했습니다 (#2595)
- [IDE 플러그인] Android용 생성 파일에 대한 IDE 자동 완성 기능을 수정했습니다 (#2573 by @martinbonnin)
- [IDE 플러그인] SqlDelightGotoDeclarationHandler에서 NPE를 수정했습니다 (by @aperfilyev)
- [IDE 플러그인] INSERT 문 내부 인수에서 kotlin 키워드를 변환했습니다 (#2433 by @aperfilyev)
- [IDE 플러그인] SqlDelightFoldingBuilder에서 NPE를 수정했습니다 (#2382 by @aperfilyev)
- [IDE 플러그인] CopyPasteProcessor에서 ClassCastException을 포착했습니다 (#2369 by @aperfilyev)
- [IDE 플러그인] 업데이트 라이브 템플릿을 수정했습니다 (by @IliasRedissi)
- [IDE 플러그인] 인텐션 액션에 설명을 추가했습니다 (#2489 by @aperfilyev)
- [IDE 플러그인] 테이블을 찾을 수 없는 경우 CreateTriggerMixin에서 예외를 수정했습니다 (by @aperfilyev)
- [컴파일러] 테이블 생성 문을 위상 정렬했습니다
- [컴파일러] 디렉토리에 대해 `forDatabaseFiles` 콜백을 호출하지 않도록 했습니다 (#2532)
- [Gradle 플러그인] `generateDatabaseInterface` 작업 종속성을 잠재적 소비자에게 전파했습니다 (#2518 by @martinbonnin)

## [1.5.1] - 2021-07-16
[1.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.1

### 추가
- [PostgreSQL 다이얼렉트] PostgreSQL JSONB 및 ON CONFLICT DO NOTHING 지원 (by @satook)
- [PostgreSQL 다이얼렉트] PostgreSQL ON CONFLICT (column, ...) DO UPDATE 지원을 추가했습니다 (by @satook)
- [MySQL 다이얼렉트] MySQL 생성된 열(generated columns) 지원 (by @JGulbronson)
- [네이티브 드라이버] watchosX64 지원 추가
- [IDE 플러그인] 매개변수 타입 및 어노테이션 추가 (by @aperfilyev)
- [IDE 플러그인] 'select all' 쿼리 생성 액션 추가 (by @aperfilyev)
- [IDE 플러그인] 자동 완성에 열 타입 표시 (by @aperfilyev)
- [IDE 플러그인] 자동 완성에 아이콘 추가 (by @aperfilyev)
- [IDE 플러그인] '기본 키로 select' 쿼리 생성 액션 추가 (by @aperfilyev)
- [IDE 플러그인] 'insert into' 쿼리 생성 액션 추가 (by @aperfilyev)
- [IDE 플러그인] 열 이름, stmt 식별자, 함수 이름에 대한 강조 표시 추가 (by @aperfilyev)
- [IDE 플러그인] 나머지 쿼리 생성 액션 추가 (#489 by @aperfilyev)
- [IDE 플러그인] insert-stmt에서 매개변수 힌트 표시 (by @aperfilyev)
- [IDE 플러그인] 테이블 별칭 인텐션 액션 (by @aperfilyev)
- [IDE 플러그인] 열 이름 한정(qualify) 인텐션 (by @aperfilyev)
- [IDE 플러그인] kotlin 속성으로 이동(Go to declaration) (by @aperfilyev)

### 변경
- [네이티브 드라이버] 가능한 경우 고정(freezing) 및 공유 가능한 데이터 구조를 피하여 네이티브 트랜잭션 성능을 개선했습니다 (by @andersio)
- [Paging 3] Paging3 버전을 3.0.0 안정 버전으로 올렸습니다
- [JS 드라이버] sql.js를 1.5.0으로 업그레이드했습니다

### 수정
- [JDBC SQLite 드라이버] `ThreadLocal`을 비우기 전에 연결에 `close()`를 호출했습니다 (#2444 by @hannesstruss)
- [RX 확장] 구독/해제 경합 누수를 수정했습니다 (#2403 by @pyricau)
- [코루틴 확장] 알림 전에 쿼리 리스너를 등록하도록 보장했습니다
- [컴파일러] 일관된 Kotlin 출력 파일을 위해 `notifyQueries`를 정렬했습니다 (by @thomascjy)
- [컴파일러] SELECT 쿼리 클래스 속성에 `@JvmField` 어노테이션을 붙이지 않도록 했습니다 (by @eygraber)
- [IDE 플러그인] 임포트 최적화기를 수정했습니다 (#2350 by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 열 인스펙션을 수정했습니다 (by @aperfilyev)
- [IDE 플러그인] 임포트 인스펙션 및 클래스 어노테이터에 중첩 클래스 지원을 추가했습니다 (by @aperfilyev)
- [IDE 플러그인] CopyPasteProcessor에서 NPE를 수정했습니다 (#2363 by @aperfilyev)
- [IDE 플러그인] InlayParameterHintsProvider에서 크래시를 수정했습니다 (#2359 by @aperfilyev)
- [IDE 플러그인] 모든 텍스트를 CREATE TABLE 문으로 복사/붙여넣기할 때 빈 줄 삽입을 수정했습니다 (#2431 by @aperfilyev)

## [1.5.0] - 2021-04-23
[1.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.0

### 추가
- [SQLite 자바스크립트 드라이버] `sqljs-driver` 게시 활성화 (#1667 by @dellisd)
- [Paging3 확장] Android Paging 3 라이브러리 확장 (#1786 by @kevincianfarini)
- [MySQL 다이얼렉트] MySQL의 ON DUPLICATE KEY UPDATE 충돌 해결 지원 추가 (by @rharter)
- [SQLite 다이얼렉트] SQLite `offsets()`에 대한 컴파일러 지원 추가 (by @qjroberts)
- [IDE 플러그인] 알 수 없는 타입에 대한 임포트 빠른 수정 추가 (#683 by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 임포트 인스펙션 추가 (#1161 by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 쿼리 인스펙션 추가 (by @aperfilyev)
- [IDE 플러그인] 사용되지 않는 열 인스펙션 추가 (#569 by @aperfilyev)
- [IDE 플러그인] 복사/붙여넣기 시 자동으로 임포트 가져오기 (#684 by @aperfilyev)
- [IDE 플러그인] Gradle/IntelliJ 플러그인 버전 간 비호환성이 있을 때 풍선(balloon) 표시
- [IDE 플러그인] Insert Into ... VALUES(?) 매개변수 힌트 (#506 by @aperfilyev)
- [IDE 플러그인] 인라인 매개변수 힌트 (by @aperfilyev)
- [런타임] 콜백을 사용하여 마이그레이션을 실행하는 런타임 API 포함 (#1844)

### 변경
- [컴파일러] "IS NOT NULL" 쿼리를 스마트 캐스팅했습니다 (#867)
- [컴파일러] 런타임에 실패할 수 있는 키워드를 방지했습니다 (#1471, #1629)
- [Gradle 플러그인] Gradle 플러그인 크기를 60MB에서 13MB로 줄였습니다.
- [Gradle 플러그인] Android variant를 올바르게 지원하고 KMM 타겟별 SQL 지원을 제거했습니다 (#1039)
- [Gradle 플러그인] minsdk를 기반으로 최소 sqlite 버전을 선택했습니다 (#1684)
- [네이티브 드라이버] 네이티브 드라이버 연결 풀 및 성능 업데이트

### 수정
- [컴파일러] 람다 앞의 NBSP(줄 바꿈 금지 공백) 수정 (by @oldergod)
- [컴파일러] 생성된 `bind*` 및 `cursor.get*` 문에서 호환되지 않는 타입 수정
- [컴파일러] SQL 절이 적용된 타입을 유지해야 합니다 (#2067)
- [컴파일러] NULL 키워드만 있는 열은 널 허용(nullable)이어야 합니다
- [컴파일러] 타입 어노테이션이 있는 매퍼 람다를 생성하지 않도록 했습니다 (#1957)
- [컴파일러] 사용자 지정 쿼리가 충돌할 경우, 파일 이름을 추가 패키지 접미사로 사용했습니다 (#1057, #1278)
- [컴파일러] 외래 키 종속(cascades)이 쿼리 리스너에게 알림을 보내도록 보장했습니다 (#1325, #1485)
- [컴파일러] 동일한 타입 두 개를 union하는 경우, 테이블 타입을 반환했습니다 (#1342)
- [컴파일러] `ifnull` 및 `coalesce`의 매개변수가 널 허용임을 보장했습니다 (#1263)
- [컴파일러] 표현식에 대해 쿼리가 부과하는 널 허용 여부를 올바르게 사용했습니다
- [MySQL 다이얼렉트] MySQL if 문 지원
- [PostgreSQL 다이얼렉트] PostgreSQL에서 NUMERIC 및 DECIMAL을 Double로 검색했습니다 (#2118)
- [SQLite 다이얼렉트] UPSERT 알림은 BEFORE/AFTER UPDATE 트리거를 고려해야 합니다. (#2198 by @andersio)
- [SQLite 드라이버] 인메모리(in memory) 상태가 아니면 `SqliteDriver`의 스레드에 여러 연결을 사용했습니다 (#1832)
- [JDBC 드라이버] JDBC 드라이버가 autoCommit이 true라고 가정하는 문제 수정 (#2041)
- [JDBC 드라이버] 예외 발생 시 연결을 닫도록 보장했습니다 (#2306)
- [IDE 플러그인] 경로 구분자 버그로 인해 Windows에서 GoToDeclaration/FindUsages가 작동하지 않는 문제 수정 (#2054 by @angusholder)
- [IDE 플러그인] IDE에서 Gradle 오류를 무시하는 대신 크래시되지 않도록 했습니다.
- [IDE 플러그인] sqldelight 파일이 sqldelight 모듈이 아닌 곳으로 이동된 경우, 코드 생성을 시도하지 않도록 했습니다
- [IDE 플러그인] IDE에서 코드 생성 오류를 무시했습니다
- [IDE 플러그인] 음수 서브스트링을 시도하지 않도록 했습니다 (#2068)
- [IDE 플러그인] Gradle 액션 실행 전에 프로젝트가 소멸되지 않았는지 확인했습니다 (#2155)
- [IDE 플러그인] 널 허용 타입에 대한 산술 연산도 널 허용이어야 합니다 (#1853)
- [IDE 플러그인] '와일드카드 확장 인텐션'이 추가 프로젝션과 함께 작동하도록 했습니다 (#2173 by @aperfilyev)
- [IDE 플러그인] GoTo 중 Kotlin 해결에 실패하면 sqldelight 파일로 이동을 시도하지 않도록 했습니다
- [IDE 플러그인] sqldelight가 인덱싱하는 동안 IntelliJ에서 예외가 발생해도 크래시되지 않도록 했습니다
- [IDE 플러그인] IDE에서 코드 생성 전 오류 감지 시 발생하는 예외를 처리했습니다
- [IDE 플러그인] IDE 플러그인이 동적 플러그인과 호환되도록 했습니다 (#1536)
- [Gradle 플러그인] WorkerApi를 사용하여 데이터베이스 생성 시 경합 조건 수정 (#2062 by @stephanenicolas)
- [Gradle 플러그인] `classLoaderIsolation`이 사용자 지정 JDBC 사용을 방해하는 문제 수정 (#2048 by @benasher44)
- [Gradle 플러그인] `packageName` 누락 오류 메시지 개선 (by @vanniktech)
- [Gradle 플러그인] SQLDelight가 IntelliJ 종속성을 빌드스크립트 클래스 경로에 누출시키는 문제 수정 (#1998)
- [Gradle 플러그인] Gradle 빌드 캐싱 수정 (#2075)
- [Gradle 플러그인] Gradle 플러그인에서 `kotlin-native-utils`에 의존하지 않도록 했습니다 (by @ilmat192)
- [Gradle 플러그인] 마이그레이션 파일만 있는 경우에도 데이터베이스를 작성하도록 했습니다 (#2094)
- [Gradle 플러그인] 최종 컴파일 단위에서 다이아몬드 종속성(diamond dependencies)이 한 번만 선택되도록 보장했습니다 (#1455)

또한, 이번 릴리스에서 SQLDelight 인프라 개선에 많은 노력을 기울인 @3flex에게 특별히 감사드립니다.

## [1.4.4] - 2020-10-08
[1.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.4

### 추가
- [PostgreSQL 다이얼렉트] WITH 문에서 데이터 수정 문(data-modifying statements) 지원
- [PostgreSQL 다이얼렉트] substring 함수 지원
- [Gradle 플러그인] SQLDelight 컴파일 중 마이그레이션을 검증하기 위한 `verifyMigrations` 플래그 추가 (#1872)

### 변경
- [컴파일러] SQLite 특정 함수를 비SQLite 다이얼렉트에서 알 수 없는 것으로 플래그 지정
- [Gradle 플러그인] sqldelight 플러그인이 적용되었지만 데이터베이스가 구성되지 않았을 때 경고를 제공했습니다 (#1421)

### 수정
- [컴파일러] ORDER BY 절에서 열 이름을 바인딩할 때 오류 보고 (#1187 by @eygraber)
- [컴파일러] db 인터페이스 생성 시 레지스트리 경고가 나타나는 문제 수정 (#1792)
- [컴파일러] case 문에 대한 잘못된 타입 추론 수정 (#1811)
- [컴파일러] 버전 없는 마이그레이션 파일에 대해 더 나은 오류 제공 (#2006)
- [컴파일러] 일부 데이터베이스 타입 `ColumnAdapter`에 대해 마샬링에 필요한 데이터베이스 타입이 올바르지 않은 문제 수정 (#2012)
- [컴파일러] CAST의 널 허용 여부 수정 (#1261)
- [컴파일러] 쿼리 래퍼에서 이름이 가려진(shadowed) 경고가 많이 발생하는 문제 수정 (#1946 by @eygraber)
- [컴파일러] 생성된 코드가 전체 한정자 이름을 사용하는 문제 수정 (#1939)
- [IDE 플러그인] Gradle 동기화에서 sqldelight 코드 생성 트리거
- [IDE 플러그인] .sq 파일 변경 시 플러그인이 데이터베이스 인터페이스를 재생성하지 않는 문제 수정 (#1945)
- [IDE 플러그인] 파일을 새 패키지로 이동할 때 발생하는 문제 수정 (#444)
- [IDE 플러그인] 커서를 이동할 곳이 없으면 크래시되지 않고 아무것도 하지 않도록 했습니다 (#1994)
- [IDE 플러그인] Gradle 프로젝트 외부에 있는 파일에 대해 빈 패키지 이름을 사용했습니다 (#1973)
- [IDE 플러그인] 잘못된 타입에 대해 정상적으로 실패하도록 했습니다 (#1943)
- [IDE 플러그인] 알 수 없는 표현식을 만났을 때 더 나은 오류 메시지를 던지도록 했습니다 (#1958)
- [Gradle 플러그인] SQLDelight가 IntelliJ 종속성을 빌드스크립트 클래스 경로에 누출시키는 문제 수정 (#1998)
- [Gradle 플러그인] *.sq 파일에 메서드 문서 추가 시 "JavadocIntegrationKt not found" 컴파일 오류 수정 (#1982)
- [Gradle 플러그인] SqlDelight Gradle 플러그인이 Configuration Caching (CoCa)을 지원하지 않는 문제 수정 (#1947 by @stephanenicolas)
- [SQLite JDBC 드라이버] SQLException: 데이터베이스가 자동 커밋 모드인 문제 수정 (#1832)
- [코루틴 확장] 코루틴 확장에 대한 IR 백엔드 수정 (#1918 by @dellisd)

## [1.4.3] - 2020-09-04
[1.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.3

### 추가
- [MySQL 다이얼렉트] MySQL `last_insert_id` 함수 지원 추가 (by @lawkai)
- [PostgreSQL 다이얼렉트] SERIAL 데이터 타입 지원 (by @veyndan & @felipecsl)
- [PostgreSQL 다이얼렉트] PostgreSQL RETURNING 지원 (by @veyndan)

### 수정
- [MySQL 다이얼렉트] MySQL AUTO_INCREMENT를 기본값이 있는 것으로 처리하도록 했습니다 (#1823)
- [컴파일러] Upsert 문 컴파일러 오류 수정 (#1809 by @eygraber)
- [컴파일러] 잘못된 Kotlin 코드가 생성되는 문제 수정 (#1925 by @eygraber)
- [컴파일러] 알 수 없는 함수에 대해 더 나은 오류 메시지를 제공하도록 했습니다 (#1843)
- [컴파일러] instr의 두 번째 매개변수 타입을 string으로 노출
- [IDE 플러그인] IDE 플러그인의 데몬 비대화(bloat) 및 UI 스레드 정지 현상 수정 (#1916)
- [IDE 플러그인] null 모듈 시나리오 처리 (#1902)
- [IDE 플러그인] 구성되지 않은 .sq 파일에서 패키지 이름으로 빈 문자열 반환 (#1920)
- [IDE 플러그인] 그룹화된 문을 수정하고 통합 테스트를 추가했습니다 (#1820)
- [IDE 플러그인] 요소에 대한 모듈을 찾기 위해 내장 ModuleUtil을 사용했습니다 (#1854)
- [IDE 플러그인] 유효한 요소만 조회에 추가했습니다 (#1909)
- [IDE 플러그인] 부모가 null일 수 있는 경우 처리 (#1857)

## [1.4.2] - 2020-08-27
[1.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.2

### 추가
- [런타임] 새 JS IR 백엔드 지원
- [Gradle 플러그인] `generateSqlDelightInterface` Gradle 작업 추가. (by @vanniktech)
- [Gradle 플러그인] `verifySqlDelightMigration` Gradle 작업 추가. (by @vanniktech)

### 수정
- [IDE 플러그인] IDE와 Gradle 간의 데이터 공유를 용이하게 하기 위해 Gradle 툴링 API를 사용했습니다
- [IDE 플러그인] 스키마 파생에 대해 기본값을 false로 설정했습니다
- [IDE 플러그인] `commonMain` 소스 세트를 올바르게 검색했습니다
- [MySQL 다이얼렉트] `mySqlFunctionType()`에 minute을 추가했습니다 (by @maaxgr)

## [1.4.1] - 2020-08-21
[1.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.1

### 추가
- [런타임] Kotlin 1.4.0 지원 (#1859)

### 변경
- [Gradle 플러그인] AGP 종속성을 `compileOnly`로 변경했습니다 (#1362)

### 수정
- [컴파일러] 열 정의 규칙 및 테이블 인터페이스 생성기에 선택적 Javadoc 추가 (#1224 by @endanke)
- [SQLite 다이얼렉트] sqlite fts5 보조 함수 `highlight`, `snippet`, `bm25` 지원 추가 (by @drampelt)
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
- [SQLite 다이얼렉트] `alter table rename column` 지원 (#1505 by @angusholder)
- [IDE] 마이그레이션(.sqm) 파일에 대한 IDE 지원
- [IDE] 내장 SQL 라이브 템플릿과 유사한 SQLDelight 라이브 템플릿 추가 (#1154 by @veyndan)
- [IDE] 새 SqlDelight 파일 액션 추가 (#42 by @romtsn)
- [런타임] 결과를 반환하는 트랜잭션을 위한 `transactionWithReturn` API
- [컴파일러] .sq 파일에서 여러 SQL 문을 함께 그룹화하기 위한 구문
- [컴파일러] 마이그레이션 파일에서 스키마 생성 지원
- [Gradle 플러그인] 마이그레이션 파일을 유효한 SQL로 출력하는 작업을 추가했습니다

### 변경
- [문서] 문서 웹사이트 전면 개편 (by @saket)
- [Gradle 플러그인] 지원되지 않는 다이얼렉트 오류 메시지 개선 (by @veyndan)
- [IDE] 다이얼렉트에 따라 파일 아이콘을 동적으로 변경 (by @veyndan)
- [JDBC 드라이버] `javax.sql.DataSource`에서 `JdbcDriver` 생성자 노출 (#1614)

### 수정
- [컴파일러] 테이블에 대한 Javadoc 지원 및 한 파일에 여러 Javadoc 수정 (#1224)
- [컴파일러] 합성된 열(synthesized columns)에 대한 값 삽입 활성화 (#1351)
- [컴파일러] 디렉토리 이름 정리의 불일치 수정 (by @ZacSweers)
- [컴파일러] 합성된 열은 조인 전반에 걸쳐 널 허용 여부를 유지해야 합니다 (#1656)
- [컴파일러] delete 키워드에 delete 문을 고정했습니다 (#1643)
- [컴파일러] 인용(quoting) 수정 (#1525 by @angusholder)
- [컴파일러] between 연산자가 표현식으로 올바르게 재귀되도록 수정 (#1279)
- [컴파일러] 인덱스 생성 시 누락된 테이블/열에 대해 더 나은 오류 제공 (#1372)
- [컴파일러] 조인 제약 조건에서 외부 쿼리 프로젝션 사용 활성화 (#1346)
- [네이티브 드라이버] execute가 `transationPool`을 사용하도록 했습니다 (by @benasher44)
- [JDBC 드라이버] sqlite 대신 jdbc 트랜잭션 API를 사용했습니다 (#1693)
- [IDE] `virtualFile` 참조가 항상 원본 파일을 가리키도록 수정 (#1782)
- [IDE] BugSnag에 오류를 보고할 때 올바른 throwable을 사용했습니다 (#1262)
- [Paging 확장] DataSource 누수 수정 (#1628)
- [Gradle 플러그인] 스키마 생성 시 출력 db 파일이 이미 존재하는 경우 삭제했습니다 (#1645)
- [Gradle 플러그인] 마이그레이션 유효성 검증에 간격이 있으면 실패하도록 했습니다
- [Gradle 플러그인] 설정한 파일 인덱스를 명시적으로 사용했습니다 (#1644)

## [1.3.0] - 2020-04-03
[1.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.3.0

* New: [Gradle] 컴파일할 SQL 다이얼렉트를 지정하는 `dialect` 속성.
* New: [컴파일러] #1009 mysql 다이얼렉트에 대한 실험적 지원.
* New: [컴파일러] #1436 sqlite:3.24 다이얼렉트 및 upsert 지원.
* New: [JDBC 드라이버] JDBC 드라이버를 sqlite jvm 드라이버에서 분리했습니다.
* Fix: [컴파일러] #1199 모든 길이의 람다 지원.
* Fix: [컴파일러] #1610 `avg()`의 반환 타입이 널 허용이 되도록 수정.
* Fix: [IntelliJ] #1594 경로 구분자 처리 수정으로 Windows에서 Goto 및 Find Usages가 깨지는 문제 수정.

## [1.2.2] - 2020-01-22
[1.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.2

* New: [런타임] Windows (mingW), tvOS, watchOS, macOS 아키텍처 지원.
* Fix: [컴파일러] `sum()`의 반환 타입이 널 허용이어야 합니다.
* Fix: [Paging] 경합 조건을 피하기 위해 `Transacter`를 `QueryDataSourceFactory`로 전달.
* Fix: [IntelliJ 플러그인] 파일의 패키지 이름을 찾을 때 종속성을 검색하지 않도록 했습니다.
* Fix: [Gradle] #862 Gradle의 유효성 검사기 로그 수준을 debug로 변경.
* Enhancement: [Gradle] `GenerateSchemaTask`를 Gradle 워커를 사용하도록 변환.
* 참고: `sqldelight-runtime` 아티팩트 이름이 `runtime`으로 변경되었습니다.

## [1.2.1] - 2019-12-11
[1.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.1

* Fix: [Gradle] Kotlin Native 1.3.60 지원.
* Fix: [Gradle] #1287 동기화 시 경고.
* Fix: [컴파일러] #1469 쿼리에 대한 SynetheticAccessor 생성.
* Fix: [JVM 드라이버] 메모리 누수 수정.
* NOTE: 코루틴 확장 아티팩트는 빌드 스크립트에 kotlinx bintray maven 저장소가 추가되어야 합니다.

## [1.2.0] - 2019-08-30
[1.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.0

* New: [런타임] 안정적인 Flow API.
* Fix: [Gradle] Kotlin Native 1.3.50 지원.
* Fix: [Gradle] #1380 클린 빌드가 때때로 실패하는 문제 수정.
* Fix: [Gradle] #1348 검증 작업 실행 시 "Could not retrieve functions"가 출력되는 문제 수정.
* Fix: [컴파일러] #1405 쿼리에 FTS 테이블 조인이 포함된 경우 프로젝트 빌드 불가 문제 수정.
* Fix: [Gradle] #1266 여러 데이터베이스 모듈이 있을 때 Gradle 빌드가 간헐적으로 실패하는 문제 수정.

## [1.1.4] - 2019-07-11
[1.1.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.4

* New: [런타임] 실험적 Kotlin Flow API.
* Fix: [Gradle] Kotlin/Native 1.3.40 호환성.
* Fix: [Gradle] #1243 Gradle configure on demand와 SQLDelight 사용 시 문제 수정.
* Fix: [Gradle] #1385 증분 어노테이션 처리와 SQLDelight 사용 시 문제 수정.
* Fix: [Gradle] Gradle 작업 캐싱 허용.
* Fix: [Gradle] #1274 Kotlin DSL과 sqldelight 확장 기능 사용 가능.
* Fix: [컴파일러] 각 쿼리에 대해 결정적으로 고유 ID가 생성됩니다.
* Fix: [컴파일러] 트랜잭션이 완료될 때만 청취 쿼리에게 알림.
* Fix: [JVM 드라이버] #1370 `JdbcSqliteDriver` 사용자에게 DB URL을 제공하도록 강제.

## [1.1.3] - 2019-04-14
[1.1.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.3

* Gradle Metadata 1.0 릴리스.

## [1.1.2] - 2019-04-14
[1.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.2

* New: [런타임] #1267 로깅 드라이버 데코레이터.
* Fix: [컴파일러] #1254 2^16자보다 긴 문자열 리터럴을 분할.
* Fix: [Gradle] #1260 생성된 소스가 멀티플랫폼 프로젝트에서 iOS 소스로 인식되는 문제 수정.
* Fix: [IDE] #1290 `kotlin.KotlinNullPointerException` in `CopyAsSqliteAction.kt:43` 수정.
* Fix: [Gradle] #1268 최근 버전에서 `linkDebugFrameworkIos*` 작업 실행 실패 문제 수정.

## [1.1.1] - 2019-03-01
[1.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.1

* Fix: [Gradle] Android 프로젝트에 대한 모듈 종속성 컴파일 수정.
* Fix: [Gradle] #1246 `afterEvaluate`에서 API 종속성 설정.
* Fix: [컴파일러] 배열 타입이 올바르게 출력됩니다.

## [1.1.0] - 2019-02-27
[1.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.0

* New: [Gradle] #502 스키마 모듈 종속성 지정 허용.
* Enhancement: [컴파일러] #1111 테이블 오류가 다른 오류보다 먼저 정렬됩니다.
* Fix: [컴파일러] #1225 REAL 리터럴에 대한 올바른 타입을 반환.
* Fix: [컴파일러] #1218 `docid`가 트리거를 통해 전파되는 문제 수정.

## [1.0.3] - 2019-01-30
[1.0.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.3

* Enhancement: [런타임] #1195 네이티브 드라이버/런타임 Arm32.
* Enhancement: [런타임] #1190 쿼리 타입에서 매퍼 노출.

## [1.0.2] - 2019-01-26
[1.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.2

* Fix: [Gradle 플러그인] kotlin 1.3.20으로 업데이트.
* Fix: [런타임] 트랜잭션이 더 이상 예외를 삼키지 않습니다.

## [1.0.1] - 2019-01-21
[1.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.1

* Enhancement: [네이티브 드라이버] `DatabaseConfiguration`에 디렉토리 이름을 전달할 수 있도록 허용.
* Enhancement: [컴파일러] #1173 패키지 없는 파일은 컴파일에 실패합니다.
* Fix: [IDE] IDE 오류를 Square에 올바르게 보고.
* Fix: [IDE] #1162 동일한 패키지의 타입이 오류로 표시되지만 정상 작동하는 문제 수정.
* Fix: [IDE] #1166 테이블 이름 변경 시 NPE로 실패하는 문제 수정.
* Fix: [컴파일러] #1167 UNION 및 SELECT를 포함하는 복잡한 SQL 문 파싱 시 예외가 발생하는 문제 수정.

## [1.0.0] - 2019-01-08
[1.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.0

* New: 생성된 코드가 Kotlin으로 전면 개편되었습니다.
* New: RxJava2 확장 아티팩트.
* New: Android Paging 확장 아티팩트.
* New: Kotlin Multiplatform 지원.
* New: Android, iOS, JVM SQLite 드라이버 아티팩트.
* New: 트랜잭션 API.

## [0.7.0] - 2018-02-12
[0.7.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.7.0

 * New: 생성된 코드가 Support SQLite 라이브러리만 사용하도록 업데이트되었습니다. 모든 쿼리가 이제 원시 문자열 대신 statement 객체를 생성합니다.
 * New: IDE에서 문 폴딩(Statement folding) 기능.
 * New: 부울 타입이 이제 자동으로 처리됩니다.
 * Fix: 코드 생성에서 사용되지 않는 `marshals` 제거.
 * Fix: `avg` SQL 함수 타입 매핑을 REAL로 올바르게 수정.
 * Fix: `julianday` SQL 함수를 올바르게 감지.

## [0.6.1] - 2017-03-22
[0.6.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.1

 * New: 인수가 없는 Delete, Update, Insert 문에 대해 컴파일된 문이 생성됩니다.
 * Fix: 서브쿼리에서 사용되는 뷰 내의 `USING` 절이 오류를 발생시키지 않습니다.
 * Fix: 생성된 Mapper에서 중복 타입 제거.
 * Fix: 서브쿼리가 인수에 대해 검사하는 표현식에서 사용될 수 있습니다.

## [0.6.0] - 2017-03-06
[0.6.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.0

 * New: Select 쿼리가 문자열 상수 대신 `SqlDelightStatement` 팩토리로 노출됩니다.
 * New: 쿼리 Javadoc이 statement 및 mapper 팩토리로 복사됩니다.
 * New: 뷰 이름에 대한 문자열 상수를 방출합니다.
 * Fix: 팩토리가 필요한 뷰에 대한 쿼리가 해당 팩토리를 인수로 올바르게 요구합니다.
 * Fix: INSERT 문의 인수 개수가 지정된 열 개수와 일치하는지 유효성 검사.
 * Fix: WHERE 절에 사용된 BLOB 리터럴을 올바르게 인코딩.
 * 이 릴리스에는 Gradle 3.3 이상이 필요합니다.

## [0.5.1] - 2016-10-24
[0.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.1

 * New: 컴파일된 문은 추상 타입을 확장합니다.
 * Fix: 매개변수의 기본 타입은 널 허용(nullable)이면 박싱(boxed)됩니다.
 * Fix: 바인딩 인수에 필요한 모든 팩토리가 팩토리 메서드에 존재합니다.
 * Fix: 이스케이프된 열 이름이 Cursor에서 가져올 때 올바르게 마샬링됩니다.

## [0.5.0] - 2016-10-19
[0.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.0

 * New: SQLite 인수를 Factory를 통해 타입 안전하게 전달할 수 있습니다.
 * New: IntelliJ 플러그인이 .sq 파일에 서식(formatting)을 수행합니다.
 * New: SQLite 타임스탬프 리터럴 지원.
 * Fix: 매개변수화된 타입은 IntelliJ에서 클릭하여 이동할 수 있습니다.
 * Fix: 이스케이프된 열 이름이 Cursor에서 가져올 때 더 이상 RuntimeException을 발생시키지 않습니다.
 * Fix: Gradle 플러그인이 예외 출력 시 크래시되지 않습니다.

## [0.4.4] - 2016-07-20
[0.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.4

 * New: 열 Java 타입으로 short에 대한 기본 지원.
 * New: 생성된 매퍼 및 팩토리 메서드에 Javadoc 추가.
 * Fix: `group_concat` 및 `nullif` 함수가 올바른 널 허용 여부를 가집니다.
 * Fix: Android Studio 2.2-alpha와의 호환성.
 * Fix: WITH RECURSIVE가 더 이상 플러그인을 크래시시키지 않습니다.

## [0.4.3] - 2016-07-07
[0.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.3

 * New: 컴파일 오류가 소스 파일로 연결됩니다.
 * New: 마우스 오른쪽 버튼을 클릭하여 SQLDelight 코드를 유효한 SQLite로 복사할 수 있습니다.
 * New: 명명된 문에 대한 Javadoc이 생성된 String에 나타납니다.
 * Fix: 생성된 뷰 모델에 널 허용 여부 어노테이션이 포함됩니다.
 * Fix: union에서 생성된 코드가 가능한 모든 열을 지원하기 위해 올바른 타입과 널 허용 여부를 가집니다.
 * Fix: `sum` 및 `round` SQLite 함수가 생성된 코드에서 올바른 타입을 가집니다.
 * Fix: CAST, 내부 SELECT 버그 수정.
 * Fix: CREATE TABLE 문에서 자동 완성.
 * Fix: SQLite 키워드를 패키지에서 사용할 수 있습니다.

## [0.4.2] - 2016-06-16
[0.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.2

 * New: Marshal은 팩토리에서 생성될 수 있습니다.
 * Fix: IntelliJ 플러그인이 올바른 제네릭 순서로 팩토리 메서드를 생성합니다.
 * Fix: 함수 이름은 어떤 대소문자도 사용할 수 있습니다.

## [0.4.1] - 2016-06-14
[0.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.1

 * Fix: IntelliJ 플러그인이 올바른 제네릭 순서로 클래스를 생성합니다.
 * Fix: 열 정의는 어떤 대소문자도 사용할 수 있습니다.

## [0.4.0] - 2016-06-14
[0.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.0

 * New: 매퍼는 테이블당이 아닌 쿼리당 생성됩니다.
 * New: Java 타입을 .sq 파일에서 임포트할 수 있습니다.
 * New: SQLite 함수가 유효성 검사됩니다.
 * Fix: 중복 오류 제거.
 * Fix: 대문자 열 이름 및 Java 키워드 열 이름이 오류를 발생시키지 않습니다.

## [0.3.2] - 2016-05-14
[0.3.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.2

 * New: 자동 완성 및 사용처 찾기 기능이 이제 뷰 및 별칭에 대해 작동합니다.
 * Fix: 컴파일 시 유효성 검사가 이제 함수를 SELECT에서 사용할 수 있도록 허용합니다.
 * Fix: 기본값만 선언하는 INSERT 문 지원.
 * Fix: SQLDelight를 사용하지 않는 프로젝트를 임포트할 때 플러그인이 더 이상 크래시되지 않습니다.

## [0.3.1] - 2016-04-27
[0.3.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.1

  * Fix: 인터페이스 가시성이 메서드 참조에서 Illegal Access 런타임 예외를 피하기 위해 다시 public으로 변경되었습니다.
  * Fix: 서브 표현식이 올바르게 평가됩니다.

## [0.3.0] - 2016-04-26
[0.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.0

  * New: 열 정의는 SQLite 타입을 사용하며 Java 타입을 지정하기 위해 추가 'AS' 제약 조건을 가질 수 있습니다.
  * New: IDE에서 버그 보고서를 보낼 수 있습니다.
  * Fix: 자동 완성 기능이 올바르게 작동합니다.
  * Fix: .sq 파일 편집 시 SQLDelight 모델 파일이 업데이트됩니다.
  * Removed: 연결된 데이터베이스는 더 이상 지원되지 않습니다.

## [0.2.2] - 2016-03-07
[0.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.2

 * New: INSERT, UPDATE, DELETE, INDEX, TRIGGER 문에서 사용되는 열에 대한 컴파일 시 유효성 검사.
 * Fix: 파일 이동/생성 시 IDE 플러그인이 크래시되지 않도록 했습니다.

## [0.2.1] - 2016-03-07
[0.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.1

 * New: Ctrl+`/` (OSX에서는 Cmd+`/`)는 선택된 줄의 주석을 토글합니다.
 * New: SQL 쿼리에서 사용되는 열에 대한 컴파일 시 유효성 검사.
 * Fix: IDE 및 Gradle 플러그인 모두에서 Windows 경로 지원.

## [0.2.0] - 2016-02-29
[0.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.0

 * New: Marshal 클래스에 복사 생성자 추가.
 * New: Kotlin 1.0 Final로 업데이트.
 * Fix: 'sqldelight' 폴더 구조 문제를 실패하지 않는 방식으로 보고.
 * Fix: `table_name`이라는 열 이름 금지. 이들의 생성된 상수가 테이블 이름 상수와 충돌합니다.
 * Fix: IDE 플러그인이 .sq 파일이 열렸는지 여부와 관계없이 모델 클래스를 즉시 생성하도록 보장.
 * Fix: IDE 및 Gradle 플러그인 모두에서 Windows 경로 지원.

## [0.1.2] - 2016-02-13
[0.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.2

 * Fix: Gradle 플러그인이 대부분의 프로젝트에서 사용되는 것을 방지하던 코드 제거.
 * Fix: Antlr 런타임에 대한 누락된 컴파일러 종속성 추가.

## [0.1.1] - 2016-02-12
[0.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.1

 * Fix: Gradle 플러그인이 자체와 동일한 버전의 런타임을 가리키도록 보장.

## [0.1.0] - 2016-02-12
[0.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.0

초기 릴리스.