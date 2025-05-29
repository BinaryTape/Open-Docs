在某些測試中（例如遷移驗證），您可能希望將 Android 驅動程式替換為 [JVM 驅動程式](https://github.com/square/sqldelight#JVM)，這使您能夠測試涉及資料庫的程式碼，而無需 Android 模擬器或實體設備。為此，請使用 JVM SQLite 驅動程式：

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
// 當您的測試需要驅動程式時
@Before fun before() {
  driver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY)
  Database.Schema.create(driver)
}
```

如果您使用的是隨 Android 綁定提供的 SQLite（而不是自行提供的 [SQLite](https://github.com/requery/sqlite-android/)），您可以覆寫 [sqlite-jdbc](https://github.com/xerial/sqlite-jdbc) 的版本，使其符合您的 [Android minSdkVersion](https://stackoverflow.com/questions/2421189/version-of-sqlite-used-in-android#4377116)，例如對於 API 23，請使用 SQLite 3.8.10.2：

```groovy
dependencies {
  testImplementation('org.xerial:sqlite-jdbc') {
    // 覆寫 sqlite-driver 使用的 sqlite 版本以符合 Android API 23
    version { strictly('3.8.10.2') }
  }
}