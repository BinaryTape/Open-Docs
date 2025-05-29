{% include 'common/index_schema_sq.md' %}

이 구문들로부터, SQLDelight는 데이터베이스를 생성하고 그 위에서 구문을 실행하는 데 사용될 수 있는, 관련된 `Schema` 객체를 가진 `Database` 클래스를 생성합니다. `Database` 클래스는 `.sq` 파일을 편집할 때 SQLDelight IDE 플러그인에 의해 자동으로 실행되고, 일반 Gradle 빌드의 일부로도 실행되는 `generateSqlDelightInterface` Gradle 태스크에 의해 생성됩니다.