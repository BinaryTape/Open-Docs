# Android에서 SQLite 시작하기

{% include 'common/index_gradle_database.md' %}

!!! tip
    SQLDelight 파일을 더 쉽게 찾고 편집할 수 있도록 Android Studio의 파일 보기를 "Android" 보기 대신 "Project" 보기로 전환하는 것이 좋습니다.

{% include 'common/index_schema.md' %}

생성된 데이터베이스를 코드에서 사용하려면 프로젝트에 SQLDelight Android 드라이버 의존성을 추가해야 합니다.

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:android-driver:{{ versions.sqldelight }}"
    }
    ```

드라이버 인스턴스는 아래와 같이 생성할 수 있으며, 생성된 `Schema` 객체에 대한 참조가 필요합니다.
```kotlin
val driver: SqlDriver = AndroidSqliteDriver(Database.Schema, context, "test.db")
```

!!! info
    `AndroidSqliteDriver`는 드라이버가 생성될 때 스키마를 자동으로 생성하거나 마이그레이션합니다. 필요한 경우 마이그레이션을 수동으로 실행할 수도 있습니다. 자세한 내용은 [Code Migrations]를 참조하세요.

{% include 'common/index_queries.md' %}

## SQLite 버전

Android 프로젝트의 경우, SQLDelight Gradle 플러그인은 프로젝트의 `minSdkVersion` 설정을 기반으로 SQLite dialect 버전을 자동으로 선택합니다. 각 Android SDK 레벨에서 지원되는 SQLite 버전 목록은 [여기](https://developer.android.com/reference/android/database/sqlite/package-summary)에서 확인할 수 있습니다.

[Code Migrations]: migrations#code-migrations