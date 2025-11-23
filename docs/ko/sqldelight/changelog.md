# 변경 로그

## 미출시

### 추가
- [Gradle 플러그인] `SqlDelightWorkerTask`를 더 구성 가능하도록 만들고, Windows 개발을 지원하도록 기본 구성을 업데이트 (#5215 by @MSDarwish2000)
- [SQLite 다이얼렉트] FTS5 가상 테이블에서 합성된 열 지원 추가 (#5986 by @watbe)

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
- [SQLite 다이얼렉트] Sqlite 3.18 누락된 함수 수정 (#5759 by @griffio)

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
- [PostgreSQL 다이얼렉트] PostgreSql SELECT DISTINCT ON (#534