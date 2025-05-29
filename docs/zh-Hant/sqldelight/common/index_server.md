SQLDelight 需要知道您的資料庫結構描述。設定資料庫結構描述通常有兩種方法。「新建結構描述 (Fresh Schema)」方法假設您從一個空白資料庫開始，並且所有必要的陳述式將一次性套用，使其達到所需狀態。「遷移結構描述 (Migration Schema)」方法則假設您已設定好資料庫和結構描述 (例如現有的生產資料庫)，並且將隨著時間逐步套用遷移來更新資料庫的結構描述。

在 SQLDelight 中，這些方法轉化為：針對「[新建結構描述](#fresh-schema)」在 `.sq` 檔案中撰寫您的資料表定義，或針對「[遷移結構描述](#migration-schema)」在 `.sqm` 檔案中撰寫遷移陳述式。無論哪種情況，您的 SQL *查詢* 都將寫在 `.sq` 檔案中 ([如這裡所示](#typesafe-sql))。

## 新建結構描述

{% include 'common/index_schema_sq.md' %}

您可以在相同的 `.sq` 檔案中開始放置要[在執行階段](#typesafe-sql)執行的 SQL 陳述式。

## 遷移結構描述

首先，設定 Gradle 使用遷移來組建結構描述：

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

遷移檔案的副檔名為 `.sqm`，並且其檔案名稱中必須包含一個數字，以指示遷移檔案執行的順序。例如，給定此階層：

```
src
`-- main
    `-- sqldelight
        |-- v1__backend.sqm
        `-- v2__backend.sqm
```

SQLDelight 將透過先套用 `v1__backend.sqm` 然後再套用 `v2__backend.sqm` 來建立結構描述。請將您一般的 SQL `CREATE`/`ALTER` 陳述式放置在這些檔案中。如果其他服務從您的遷移檔案讀取 (例如 Flyway)，請務必閱讀有關[遷移](migrations)的資訊以及如何輸出有效的 SQL。

## 型別安全 SQL

在您能夠在執行階段執行 SQL 陳述式之前，您需要建立一個 `SqlDriver` 來連接到您的資料庫。最簡單的方式是從 Hikari 或其他連線管理員取得的 `DataSource`。

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

無論您是透過新的建立資料表陳述式還是透過遷移來指定結構描述，執行階段的 SQL 都會放在 `.sq` 檔案中。

{% include 'common/index_queries.md' %}