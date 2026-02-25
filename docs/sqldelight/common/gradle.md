# Gradle

为了实现更高的自定义程度，您可以使用 Gradle DSL 显式声明数据库。

## SQLDelight 配置

### `databases`

数据库容器。配置 SQLDelight 以使用指定名称创建每个数据库。

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // 在此处配置数据库。
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // 在此处配置数据库。
        }
      }
    }
    ```

----

### `linkSqlite`

类型：`Property<Boolean>`

用于原生目标。是否应自动链接 sqlite。
当项目编译为动态框架（这是最近 KMP 版本中的默认设置）时，这会添加用于链接 sqlite 的必要元数据。

请注意，对于静态框架，此标志无效。
导入该项目的 XCode 构建应将 `-lsqlite3` 添加到链接器标志中。
或者通过 cocoapods 插件[添加项目依赖项](https://kotlinlang.org/docs/native-cocoapods-libraries.html)到 [sqlite3](https://cocoapods.org/pods/sqlite3) pod。
另一个可能奏效的选择是将 `sqlite3` 添加到 cocoapods [`spec.libraries` 设置](https://guides.cocoapods.org/syntax/podspec.html#libraries)中，例如在 Gradle Kotlin DSL 中：`extraSpecAttributes["libraries"] = "'c++', 'sqlite3'"`。

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

类型：`Property<String>`

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

类型：`ConfigurableFileCollection`

插件将在其中查找 `.sq` 和 `.sqm` 文件的文件夹集合。

默认为 `src/[prefix]main/sqldelight`，其中前缀取决于所应用的 kotlin 插件，例如多平台对应的 `common`。

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

插件将在其中查找 `.sq` 和 `.sqm` 文件的对象集合。

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

类型：`DirectoryProperty`

存储 `.db` 架构文件的目录，相对于项目根目录。
这些文件用于验证迁移生成的数据库是否具有最新的架构。

默认为 `null`。  
如果为 `null`，则不会创建迁移验证任务。

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

类型：`Project`

（可选）指定对其他 gradle 项目的架构依赖项[（见下文）](#schema-dependencies)。

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

类型：`String` 或 `Provider<MinimalExternalModuleDependency>`

您想要针对的 SQL 方言。方言通过 gradle 依赖项进行选择。
这些依赖项可以指定为 `app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}`。 
有关可用方言，请参见下文。

对于 Android 项目，SQLite 版本会根据您的 `minSdk` 自动选择。 
否则默认为 SQLite 3.18。

可用方言：

* HSQL: `hsql-dialect`
* MySQL: `mysql-dialect`
* PostgreSQL: `postgresql-dialect`
* SQLite 3.18: `sqlite-3-18-dialect`
* SQLite 3.24: `sqlite-3-24-dialect`
* SQLite 3.25: `sqlite-3-25-dialect`
* SQLite 3.30: `sqlite-3-30-dialect`
* SQLite 3.33: `sqlite-3-33-dialect`
* SQLite 3.35: `sqlite-3-35-dialect`
* SQLite 3.38: `sqlite-3-38-dialect`

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

类型：`Property<Boolean>`

如果设置为 true，在构建过程中如果迁移文件中存在任何错误，构建将失败。

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

类型：`Property<Boolean>`

如果设置为 true，在使用 `IS` 时，SQLDelight 不会替换为可为 null 类型值的相等性比较。

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

类型：`Property<Boolean>`

如果设置为 true，SQLDelight 将生成挂起查询方法，以便与异步驱动程序一起使用。

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

类型：`Property<Boolean>`

如果设置为 true，数据库的架构将从您的 `.sqm` 文件派生，就像已应用了每次迁移一样。
如果为 false，您的架构将在 `.sq` 文件中定义。

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