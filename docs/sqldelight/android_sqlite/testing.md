在某些测试中（例如迁移验证），你可能希望将 Android 驱动程序替换为 [JVM 驱动程序](https://github.com/square/sqldelight#JVM)，这样你无需 Android 模拟器或物理设备即可测试涉及数据库的代码。为此，请使用 JVM SQLite 驱动程序：

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
// 当你的测试需要一个驱动程序时
@Before fun before() {
  driver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY)
  Database.Schema.create(driver)
}
```

如果你使用的是 Android 自带的 SQLite（而不是引入[自己的](https://github.com/requery/sqlite-android/)），你可以覆盖 [sqlite-jdbc](https://github.com/xerial/sqlite-jdbc) 的版本，使其与你的 [Android minSdkVersion](https://stackoverflow.com/questions/2421189/version-of-sqlite-used-in-android#4377116) 匹配，例如，对于 API 23，请使用 SQLite 3.8.10.2：

```groovy
dependencies {
  testImplementation('org.xerial:sqlite-jdbc') {
    // 覆盖 sqlite-driver 使用的 sqlite 版本以匹配 Android API 23
    version { strictly('3.8.10.2') }
  }
}