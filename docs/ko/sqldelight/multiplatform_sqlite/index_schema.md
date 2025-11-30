{% include 'multiplatform_sqlite/index_schema_sq.md' %}

이 선언문들을 통해 SQLDelight는 데이터베이스를 생성하고 그 위에서 선언문을 실행하는 데 사용될 수 있는 `Database` 클래스와 관련 `Schema` 객체를 생성합니다. `Database` 클래스는 `.sq` 파일을 편집할 때 SQLDelight IDE 플러그인에 의해 자동으로 실행되며, 일반 Gradle 빌드의 일부로도 실행되는 `generateSqlDelightInterface` Gradle 태스크를 통해 생성됩니다.