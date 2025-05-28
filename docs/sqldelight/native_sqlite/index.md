# 在 Kotlin/Native 上开始使用 SQLDelight

!!! info "Kotlin/Native 内存管理器"
    从 SQLDelight 2.0 开始，SQLDelight Native 驱动只支持 Kotlin/Native 的[新内存管理器]。

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

要在代码中使用生成的数据库，您必须将 SQLDelight Native 驱动依赖添加到您的项目中。

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

驱动实例可以按如下方式构建，并且需要引用生成的 `Schema` 对象。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## 读连接池

磁盘数据库可以（可选地）拥有多个读连接。要配置读连接池，请将 `maxReaderConnections` 参数传递给 `NativeSqliteDriver` 的各种构造函数：

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

读连接仅用于在事务之外运行查询。任何写入调用以及事务中的任何操作都使用一个专用于事务的单一连接。

[新内存管理器]: https://kotlinlang.org/docs/native-memory-manager.html