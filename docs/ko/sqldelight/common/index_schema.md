{% include 'common/index_schema_sq.md' %}

이러한 문들을 바탕으로 SQLDelight는 데이터베이스를 생성하고 SQL 문을 실행하는 데 사용할 수 있는 연관된 `Schema` 객체를 포함한 `Database` 클래스를 생성합니다. `Database` 클래스는 `generateSqlDelightInterface` Gradle 태스크에 의해 생성되며, 이 태스크는 `.sq` 파일을 편집할 때 SQLDelight IDE 플러그인에 의해 자동으로 실행되거나 일반적인 Gradle 빌드의 일부로 실행됩니다.