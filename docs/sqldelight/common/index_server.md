SQLDelight 需要知道你的数据库 schema。通常有两种方法来设置你的数据库 schema。“全新 schema”方法假设你从一个空数据库开始，所有将数据库带到所需状态的语句将一次性应用。另一方面，“迁移 schema”方法假设你已经有一个数据库和 schema （例如，一个现有的生产数据库），并且你将随着时间的推移逐步应用迁移来更新数据库的 schema。

在 SQLDelight 中，这些方法转化为要么在 `.sq` 文件中编写你的表定义以实现“[全新 schema](#fresh-schema)”，要么在 `.sqm` 文件中编写迁移语句以实现“[迁移 schema](#migration-schema)”。在这两种情况下，你的 SQL _查询_都将写入 `.sq` 文件（[如这里所示](#typesafe-sql)）。

## 全新 Schema

{% include 'common/index_schema_sq.md' %}

在相同的 `.sq` 文件中，你可以开始放置要在[运行时](#typesafe-sql)执行的 SQL 语句。

## 迁移 Schema

首先，配置 Gradle 以使用迁移来组装 schema：

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

迁移文件使用 `.sqm` 扩展名，并且文件名中必须包含一个数字，表明迁移文件的运行顺序。例如，给定此文件层级：

```
src
`-- main
    `-- sqldelight
        |-- v1__backend.sqm
        `-- v2__backend.sqm
```

SQLDelight 将通过应用 `v1__backend.sqm` 然后 `v2__backend.sqm` 来创建 schema。将你的常规 SQL `CREATE`/`ALTER` 语句放在这些文件中。如果其他服务（如 Flyway）从你的迁移文件中读取，请务必阅读有关[迁移](migrations)的信息以及如何输出有效的 SQL。

## 类型安全的 SQL

在你能够在运行时执行 SQL 语句之前，你需要创建一个 `SqlDriver` 来连接到你的数据库。最简单的方法是使用从 Hikari 或其他连接管理器获取的 `DataSource`。

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

无论你将 schema 指定为全新的表创建语句还是通过迁移，运行时 SQL 都存在于 `.sq` 文件中。

{% include 'common/index_queries.md' %}