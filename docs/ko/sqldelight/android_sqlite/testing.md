일부 테스트(마이그레이션 확인 등)에서 Android 드라이버를 [JVM 드라이버](https://github.com/square/sqldelight#JVM)로 교체하고 싶을 수 있습니다. 이를 통해 Android 에뮬레이터나 실제 기기 없이 데이터베이스 관련 코드를 테스트할 수 있습니다. 그러려면 JVM SQLite 드라이버를 사용하세요:

=== "Kotlin"
    ```kotlin
    dependencies {
      testImplementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      testImplementation "app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}"
    }
    ```

```kotlin
// 테스트에 드라이버가 필요한 경우
@Before fun before() {
  driver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY)
  Database.Schema.create(driver)
}
```

Android에 번들로 제공되는 SQLite를 사용하고 있다면([직접 포함하는 것](https://github.com/requery/sqlite-android/) 대신) [sqlite-jdbc](https://github.com/xerial/sqlite-jdbc) 버전을 [Android minSdkVersion](https://stackoverflow.com/questions/2421189/version-of-sqlite-used-in-android#4377116)과 일치하는 버전으로 재정의할 수 있습니다. 예를 들어 API 23의 경우 SQLite 3.8.10.2를 사용하세요:

```groovy
dependencies {
  testImplementation('org.xerial:sqlite-jdbc') {
    // sqlite-driver에서 사용하는 sqlite 버전을 Android API 23에 맞춰 재정의
    version { strictly('3.8.10.2') }
  }
}