SQLDelight 需要知道資料庫的架構 (schema)。設定資料庫架構通常有兩種方法。「全新架構 (Fresh Schema)」方法假設您是從一個空的資料庫開始，並且會一次套用所有將資料庫帶入所需狀態的必要陳述式。另一方面，「遷移架構 (Migration Schema)」方法則假設您已經設定好資料庫與架構（例如：現有的生產環境資料庫），並且會隨著時間逐步套用遷移 (migrations) 來更新資料庫架構。

在 SQLDelight 中，這些方法對應到：在 `.sq` 檔案中撰寫資料表定義以建立「[全新架構 (Fresh Schema)](#fresh-schema)」，或是在 `.sqm` 檔案中撰寫遷移陳述式以建立「[遷移架構 (Migration Schema)](#migration-schema)」。
在這兩種情況下，您的 SQL 查詢 (queries) 都將撰寫在 `.sq` 檔案中（[如這裡所示](#typesafe-sql)）。

## 全新架構 (Fresh Schema)

{% include 'common/index_schema_sq.md' %}

在同一個 `.sq` 檔案中，您可以開始放置要在[執行時 (runtime)](#typesafe-sql)執行的 SQL 陳述式。

## 遷移架構 (Migration Schema)

首先，設定 Gradle 使用遷移來組合架構：

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("Database") {
          ...
          srcDirs("sqldelight")
          deriveSchemaFromMigrations.set(true)
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        Database {
          ...
          srcDirs "sqldelight"
          deriveSchemaFromMigrations = true
        }
      }
    }
    ```

遷移檔案的副檔名為 `.sqm`，且檔名中必須包含一個數字，用以指示該遷移檔案的執行順序。例如，給定以下階層結構：

```
src
`-- main
    `-- sqldelight
        |-- v1__backend.sqm
        `-- v2__backend.sqm
```

SQLDelight 將透過套用 `v1__backend.sqm` 然後是 `v2__backend.sqm` 來建立架構。請在這些檔案中放置一般的 SQL `CREATE`/`ALTER` 陳述式。如果有其他服務（例如 Flyway）會讀取您的遷移檔案，請務必閱讀關於 [遷移 (migrations)](migrations) 的資訊，以及如何輸出有效的 SQL。

## Typesafe SQL

在您能夠於執行時執行 SQL 陳述式之前，您需要建立一個 `SqlDriver` 來連線到資料庫。最簡單的方法是從 Hikari 或其他連線管理員取得的 `DataSource` 來建立。

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:jdbc-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:jdbc-driver:{{ versions.sqldelight }}"
    }
    ```
```kotlin
val driver: SqlDriver = dataSource.asJdbcDriver()
```

無論您是透過全新的資料表建立陳述式還是透過遷移來指定架構，執行時的 SQL 都會放在 `.sq` 檔案中。

{% include 'common/index_queries.md' %}