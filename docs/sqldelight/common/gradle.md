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

----

### `expandSelectStar`

类型：`Property<Boolean>`

如果设置为 true，SQLDelight 将重写 `SELECT *` 语句以显式引用每个实际的结果列。

例如，下方的 `getAll` 查询
```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);

getAll:
SELECT * FROM hockey_player;
```
将被重写为 `SELECT hockey_player.id, hockey_player.name, hockey_player.number FROM hockey_player;`。

默认为 `true`。

=== "Kotlin"
    ```kotlin
    expandSelectStar.set(true)
    ```
=== "Groovy"
    ```groovy
    expandSelectStar = true
    ```

----

### `codegenExcludedColumns`

类型：`SetProperty<String>`

一组 `table.column` 值，用于从生成的模型和扩展的 `SELECT *` 投影中省略这些列。表名和列名必须使用与 SQLDelight 架构源相同的大小写。这仅影响代码生成；不会更改 SQL 架构或生成的迁移输出。

这可用于在后续架构迁移删除列之前更新生成的 Kotlin API。如果配置的表或列不存在，或者模型绑定的 insert、`SELECT` 结果列或 `RETURNING` 子句显式列出了排除在代码生成之外的列，SQLDelight 将编译失败。由于这仅限代码生成，应用程序负责确保在删除任何仍然存在的排除列之前，可以从写入操作中省略这些列，例如通过使用可为 null 的列或默认值。

如果您的 `.sq` 文件包含 `CREATE TABLE` 架构定义，请在物理架构迁移删除该列之前，将排除的列保留在架构定义中。移除对该列的显式查询引用，但保留反映当前数据库形态的架构源。

默认为空。

=== "Kotlin"
    ```kotlin
    codegenExcludedColumns.set(setOf("hockey_player.number"))
    ```
=== "Groovy"
    ```groovy
    codegenExcludedColumns = ["hockey_player.number"]
    ```

{% include 'common/gradle-dependencies.md' %}