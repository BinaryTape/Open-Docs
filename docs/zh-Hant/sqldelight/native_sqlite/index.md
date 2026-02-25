# Kotlin/Native 上的 SQLDelight 快速入門

!!! info "Kotlin/Native 記憶體管理員"
    自 SQLDelight 2.0 起，SQLDelight Native 驅動程式僅支援 Kotlin/Native 的 [新記憶體管理員]。

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

若要在程式碼中使用產生的資料庫，您必須將 SQLDelight Native 驅動程式相依性新增至您的專案。

=== "Kotlin"
    ```kotlin
    kotlin {
      // 或 iosMain, windowsMain 等。
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      // 或 iosMain, windowsMain 等。
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }
    }
    ```

驅動程式的執行個體可以如下所示進行建構，且需要產生的 `Schema` 物件參照。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## 讀取器連線池

磁碟資料庫可以（選用）擁有多個讀取器連線。若要設定讀取器池，請將 `maxReaderConnections` 參數傳遞給 `NativeSqliteDriver` 的各個建構函式：

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

讀取器連線僅用於執行交易之外的查詢。任何寫入呼叫以及交易中的任何操作，皆會使用專用於交易的單一連線。

[新記憶體管理員]: https://kotlinlang.org/docs/native-memory-manager.html