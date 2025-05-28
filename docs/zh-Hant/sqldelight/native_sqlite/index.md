# 開始在 Kotlin/Native 上使用 SQLDelight

!!! info "Kotlin/Native 記憶體管理器"
    自 SQLDelight 2.0 起，SQLDelight 原生驅動程式僅支援 Kotlin/Native 的 [新記憶體管理器]。

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

要在程式碼中使用生成的資料庫，您必須新增 SQLDelight 原生驅動程式依賴項到您的專案中。

=== "Kotlin"
    ```kotlin
    kotlin {
      // or iosMain, windowsMain, etc.
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      // or iosMain, windowsMain, etc.
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }
    }
    ```

驅動程式實例可以如下所示建構，並需要引用生成的 `Schema` 物件。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## 讀取器連線池

磁碟資料庫可以（選擇性地）擁有多個讀取器連線。要設定讀取器連線池，請將 `maxReaderConnections` 參數傳遞給 `NativeSqliteDriver` 的各種建構函式：

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

讀取器連線僅用於在交易之外執行查詢。任何寫入呼叫以及交易中的任何內容，都使用專用於交易的單一連線。

[new memory manager]: https://kotlinlang.org/docs/native-memory-manager.html