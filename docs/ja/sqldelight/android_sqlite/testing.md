一部のテスト（マイグレーションの検証など）では、Androidドライバーを[JVMドライバー](https://github.com/square/sqldelight#JVM)に置き換えたい場合があります。これにより、Androidエミュレーターや実機を必要とせずにデータベースを扱うコードをテストできます。そのためには、JVM SQLiteドライバーを使用します。

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
// When your test needs a driver
@Before fun before() {
  driver = JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY)
  Database.Schema.create(driver)
}
```

AndroidにバンドルされているSQLiteを使用している場合（[独自のもの](https://github.com/requery/sqlite-android/)を同梱するのではなく）、[sqlite-jdbc](https://github.com/xerial/sqlite-jdbc)のバージョンを、[AndroidのminSdkVersion](https://stackoverflow.com/questions/2421189/version-of-sqlite-used-in-android#4377116)に一致するものにオーバーライドできます。例えば、API 23の場合はSQLite 3.8.10.2を使用します。

```groovy
dependencies {
  testImplementation('org.xerial:sqlite-jdbc') {
    // Override the version of sqlite used by sqlite-driver to match Android API 23
    version { strictly('3.8.10.2') }
  }
}