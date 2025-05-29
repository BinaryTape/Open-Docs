# 升级到 2.0

SQLDelight 2.0 对 Gradle 插件和运行时 API 进行了一些破坏性变更。

本页面列出了这些破坏性变更及其在 2.0 中的新对应项。有关新功能和更多变更的完整列表，请参阅[更新日志](../changelog)。

## 新包名和 Artifact 组

所有 `com.squareup.sqldelight` 实例都需要替换为 `app.cash.sqldelight`。

```diff title="Gradle 依赖"
plugins {
-  id("com.squareup.sqldelight") version "{{ versions.sqldelight }}"
+  id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
}

dependencies {
-  implementation("com.squareup.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
}

对于纯 Android 的 SqlDelight 1.x 项目，请使用 android-driver 和 coroutine-extensions-jvm：
dependencies {
-  implementation("com.squareup.sqldelight:android-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
-  implementation("com.squareup.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:coroutines-extensions-jvm:{{ versions.sqldelight }}")
}
```

```diff title="在代码中"
-import com.squareup.sqldelight.db.SqlDriver
+import app.cash.sqldelight.db.SqlDriver
```

## Gradle 配置变更

*   SQLDelight 2.0 要求 Java 11 进行构建，Java 8 用于运行时。
*   SQLDelight 配置 API 现在为数据库使用托管属性 (`managed properties`) 和 `DomainObjectCollection`。

    === "Kotlin"
        ```kotlin
        sqldelight {
          databases { // (1)!
            create("Database") {
              packageName.set("com.example") // (2)!
            }
          }
        }
        ```

        1.  新的 `DomainObjectCollection` 包装器。
        2.  现在是一个 `Property<String>`。
    === "Groovy"
        ```kotlin
        sqldelight {
          databases { // (1)!
            Database {
              packageName = "com.example"
            }
          }
        }
        ```

        1.  新的 `DomainObjectCollection` 包装器。

*   `sourceFolders` 设置已重命名为 `srcDirs`

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              srcDirs.setFrom("src/main/sqldelight")
            }
          }
        }
        ```
    === "Groovy"
        ```groovy
        sqldelight {
          databases {
            MyDatabase {
              packageName = "com.example"
              srcDirs = ['src/main/sqldelight']
            }
          }
        }
        ```

*   数据库的 SQL 变体现在通过 Gradle 依赖指定。

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              dialect("app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}")

              // 版本目录 (Version catalogs) 也适用！
              dialect(libs.sqldelight.dialects.mysql)
            }
          }
        }
        ```
    === "Groovy"
        ```groovy
        sqldelight {
          databases {
            MyDatabase {
              packageName = "com.example"
              dialect "app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}"

              // 版本目录 (Version catalogs) 也适用！
              dialect libs.sqldelight.dialects.mysql
            }
          }
        }
        ```

    目前支持的变体有 `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、`sqlite-3-35-dialect` 和 `sqlite-3-38-dialect`。

## 运行时变更

*   基本类型现在必须导入到 `.sq` 和 `.sqm` 文件中。

    ```diff
    +{++import kotlin.Boolean;++}

    CREATE TABLE HockeyPlayer (
      name TEXT NOT NULL,
      good INTEGER {==AS Boolean==}
    );
    ```

    一些以前支持的类型现在需要适配器 (adapter)。基本类型的适配器可在 `app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}` artifact 中获取。例如，用于执行 `INTEGER As kotlin.Int` 转换的 `IntColumnAdapter`。

*   `AfterVersionWithDriver` 类型已移除，取而代之的是 [`AfterVersion`](../2.x/runtime/app.cash.sqldelight.db/-after-version)，后者现在始终包含驱动，并且 `migrateWithCallbacks` 扩展函数已移除，取而代之的是现在接受回调的主 [`migrate`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema/#-775472427%2FFunctions%2F-2112917107) 方法。

    ```diff
    Database.Schema.{++migrate++}{--WithCallbacks--}(
      driver = driver,
      oldVersion = 1,
      newVersion = Database.Schema.version,
    -  {--AfterVersionWithDriver(3) { driver ->--}
    -  {--  driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0)--}
    -  {--}--}
    +  {++AfterVersion(3) { driver ->++}
    +  {++  driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0)++}
    +  {++}++}
    )
    ```

*   `Schema` 类型不再是 `SqlDriver` 的嵌套类型，现在称为 [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema)。

    ```diff
    -val schema: {--SqlDriver.Schema--}
    +val schema: {++SqlSchema++}
    ```

*   [Paging3 扩展 API](../2.x/extensions/androidx-paging3/app.cash.sqldelight.paging3/) 已更改为仅允许 `int` 类型用于计数。
*   [协程扩展 API](../2.x/extensions/coroutines-extensions/app.cash.sqldelight.coroutines/) 现在要求显式传入调度器 (dispatcher)。
    ```diff
    val players: Flow<List<HockeyPlayer>> =
      playerQueries.selectAll()
        .asFlow()
    +   .mapToList({++Dispatchers.IO++})
    ```
*   一些驱动方法，如 [`execute()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute)、[`executeQuery()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute-query)、`newTransaction()` 和 `endTransaction()` 现在返回一个 [`QueryResult`](../2.x/runtime/app.cash.sqldelight.db/-query-result) 对象。使用 [`QueryResult.value`](../2.x/runtime/app.cash.sqldelight.db/-query-result/value) 访问返回的值。
    ```diff
    -driver.executeQuery(null, "PRAGMA user_version", { /*...*/ })
    +driver.executeQuery(null, "PRAGMA user_version", { /*...*/ }){++.value++}
    ```
    此更改使驱动实现能够基于非阻塞 API，其中返回的值可以使用挂起 (suspending) 的 [`QueryResult.await()`](../2.x/runtime/app.cash.sqldelight.db/-query-result/await) 方法访问。
    *   `SqlCursor` 接口上的 [`next()`](../2.x/runtime/app.cash.sqldelight.db/-sql-cursor/next) 方法也已更改为返回 `QueryResult`，以便为异步驱动提供更好的游标支持。
*   [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema) 接口现在具有一个泛型 `QueryResult` 类型参数。这用于区分为了与异步驱动配合使用而生成的 schema 运行时，这些运行时可能与同步驱动不直接兼容。
    这仅与同时使用同步和异步驱动的项目相关，例如具有 JS 目标的多平台项目。有关更多详细信息，请参阅“[使用 Web Worker 驱动的多平台设置](js_sqlite/multiplatform.md)”。
*   `SqlSchema.Version` 的类型从 `Int` 更改为 `Long`，以允许服务器环境利用时间戳作为版本。现有设置可以安全地在 `Int` 和 `Long` 之间进行类型转换，而要求版本范围为 `Int` 的驱动将在数据库创建之前因版本超出范围而崩溃。