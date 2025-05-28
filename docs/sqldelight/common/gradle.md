# Gradle

为了实现进一步定制，你可以使用 Gradle DSL 显式声明数据库。

## SQLDelight 配置

### `databases`

数据库容器。配置 SQLDelight 以给定名称创建每个数据库。

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // Database configuration here.
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // Database configuration here.
        }
      }
    }
    ```

----

### `linkSqlite`

类型: `Property<Boolean>`

针对原生目标。是否应自动链接 sqlite。
这会在项目编译为动态框架（KMP 近期版本的默认行为）时，添加链接 sqlite 所需的元数据。

请注意，对于静态框架，此标志无效。
导入项目的 XCode 构建应将 `-lsqlite3` 添加到链接器标志中。
或者，通过 cocoapods 插件在 [sqlite3](https://cocoapods.org/pods/sqlite3) pod 上[添加项目依赖](https://kotlinlang.org/docs/native-cocoapods-libraries.html)。
另一种可能有效的方法是将 `sqlite3` 添加到 cocoapods 的 [`spec.libraries` 设置](https://guides.cocoapods.org/syntax/podspec.html#libraries)中，例如在 Gradle Kotlin DSL 中：`extraSpecAttributes["libraries"] = "'c++', 'sqlite3'".`

默认为 `true`。

=== "Kotlin"
    ```kotlin
    linkSqlite.set(true)
    ```
=== "Groovy"
    ```groovy
    linkSqlite = true
    ```

## 数据库配置

### `packageName`

类型: `Property<String>`

用于数据库类的包名。

=== "Kotlin"
    ```kotlin
    packageName.set("com.example.db")
    ```
=== "Groovy"
    ```groovy
    packageName = "com.example.db"
    ```

----

### `srcDirs`

类型: `ConfigurableFileCollection`

插件将查找 `.sq` 和 `.sqm` 文件的文件夹集合。

默认为 `src/[prefix]main/sqldelight`，其中前缀取决于所应用的 Kotlin 插件，例如多平台的 `common`。

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

插件将查找 `.sq` 和 `.sqm` 文件的对象集合。

=== "Kotlin"
    ```kotlin
    srcDirs("src/main/sqldelight", "main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs('src/main/sqldelight', 'main/sqldelight')
    ```

----

### `schemaOutputDirectory`

类型: `DirectoryProperty`

应存储 `.db` 模式文件的目录，相对于项目根目录。这些文件用于验证迁移是否能生成最新模式的数据库。

默认为 `null`。
如果为 `null`，将不会创建迁移验证任务。

=== "Kotlin"
    ```kotlin
    schemaOutputDirectory.set(file("src/main/sqldelight/databases"))
    ```
=== "Groovy"
    ```groovy
    schemaOutputDirectory = file("src/main/sqldelight/databases")
    ```

----

### `dependency`

类型: `Project`

可选地指定对其他 Gradle 项目的模式依赖 ([见下文](#schema-dependencies))。

=== "Kotlin"
    ```kotlin
    dependency(project(":other-project"))
    ```
=== "Groovy"
    ```groovy
    dependency project(":other-project")
    ```

----

### `dialect`

类型: `String` 或 `Provider<MinimalExternalModuleDependency>`

你希望目标 SQL 变体。变体是使用 Gradle 依赖选择的。这些依赖可以指定为 `app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}`。可用变体见下文。

对于 Android 项目，SQLite 版本会根据你的 `minSdk` 自动选择。否则默认为 SQLite 3.18。

可用变体：

*   HSQL: `hsql-dialect`
*   MySQL: `mysql-dialect`
*   PostgreSQL: `postgresql-dialect`
*   SQLite 3.18: `sqlite-3-18-dialect`
*   SQLite 3.24: `sqlite-3-24-dialect`
*   SQLite 3.25: `sqlite-3-25-dialect`
*   SQLite 3.30: `sqlite-3-30-dialect`
*   SQLite 3.33: `sqlite-3-33-dialect`
*   SQLite 3.35: `sqlite-3-35-dialect`
*   SQLite 3.38: `sqlite-3-38-dialect`

=== "Kotlin"
    ```kotlin
    dialect("app.cash.sqldelight:sqlite-3-24-dialect:{{ versions.sqldelight }}")
    ```
=== "Groovy"
    ```groovy
    dialect 'app.cash.sqldelight:sqlite-3-24-dialect:{{ versions.sqldelight }}'
    ```

----

### `verifyMigrations`

类型: `Property<Boolean>`

如果设置为 `true`，迁移文件若存在任何错误，将在构建过程中导致构建失败。

默认为 `false`。

=== "Kotlin"
    ```kotlin
    verifyMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    verifyMigrations = true
    ```

----

### `treatNullAsUnknownForEquality`

类型: `Property<Boolean>`

如果设置为 `true`，SQLDelight 在使用 `IS` 时，不会替换与可空类型值的相等比较。

默认为 `false`。

=== "Kotlin"
    ```kotlin
    treatNullAsUnknownForEquality.set(true)
    ```
=== "Groovy"
    ```groovy
    treatNullAsUnknownForEquality = true
    ```

----

### `generateAsync`

类型: `Property<Boolean>`

如果设置为 `true`，SQLDelight 将生成用于异步驱动的挂起查询方法。

默认为 `false`。

=== "Kotlin"
    ```kotlin
    generateAsync.set(true)
    ```
=== "Groovy"
    ```groovy
    generateAsync = true
    ```

----

### `deriveSchemaFromMigrations`

类型: `Property<Boolean>`

如果设置为 `true`，你的数据库模式将从 `.sqm` 文件中派生，就如同每个迁移都已应用一样。如果为 `false`，你的模式在 `.sq` 文件中定义。

默认为 `false`。

=== "Kotlin"
    ```kotlin
    deriveSchemaFromMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    deriveSchemaFromMigrations = true
    ```

{% include 'common/gradle-dependencies.md' %}