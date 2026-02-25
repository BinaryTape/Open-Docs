SQLDelight 需要了解数据库的架构。通常有两种设置数据库架构的方法。“Fresh Schema”方法假设您从一个空数据库开始，并且将一次性应用所有必要的语句以将其置于所需状态。另一方面，“Migration Schema”方法假设您已经设置了数据库和架构（例如现有的生产数据库），并且您将随着时间的推移逐步应用迁移来更新数据库的架构。

在 SQLDelight 中，这些方法对应于在 `.sq` 文件中编写表定义以使用“[Fresh Schema](#fresh-schema)”，或者在 `.sqm` 文件中编写迁移语句以使用“[Migration Schema](#migration-schema)”。在这两种情况下，您的 SQL 查询都将编写在 `.sq` 文件中（[如这里所示](#typesafe-sql)）。

## Fresh Schema

{% include 'common/index_schema_sq.md' %}

在同一个 `.sq` 文件中，您可以开始放置要在[运行时](#typesafe-sql)执行的 SQL 语句。

## Migration Schema

首先，配置 Gradle 使用迁移来组装架构：

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

迁移文件的扩展名为 `.sqm`，并且文件名中必须包含一个数字，以指示迁移文件的运行顺序。例如，给定以下层次结构：

```
src
`-- main
    `-- sqldelight
        |-- v1__backend.sqm
        `-- v2__backend.sqm
```

SQLDelight 将通过先应用 `v1__backend.sqm` 然后应用 `v2__backend.sqm` 来创建架构。在这些文件中放置常规的 SQL `CREATE`/`ALTER` 语句。如果有其他服务读取您的迁移文件（如 flyway），请务必阅读有关[迁移](migrations)以及如何输出有效 SQL 的信息。

## 类型安全 SQL

在您能够在运行时执行 SQL 语句之前，需要创建一个 `SqlDriver` 以连接到数据库。最简单的方法是基于从 hikari 或其他连接管理器中获取的 `DataSource`。

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

无论您是通过全新的创建表语句还是通过迁移来指定架构，运行时的 SQL 都会放入 `.sq` 文件中。

{% include 'common/index_queries.md' %}