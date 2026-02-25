# SQLDelight on Kotlin/Native 快速入门

!!! info "Kotlin/Native 内存管理器"
    自 SQLDelight 2.0 起，SQLDelight Native 驱动程序仅支持 Kotlin/Native 的 [新内存管理器]。

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

要在代码中使用生成的数据库，您必须将 SQLDelight Native 驱动程序依赖项添加到您的项目中。

=== "Kotlin"
    ```kotlin
    kotlin {
      // 或 iosMain, windowsMain 等。
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      // 或 iosMain, windowsMain 等。
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }
    }
    ```

驱动程序的实例可以按如下方式构造，并且需要引用生成的 `Schema` 对象。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## 读取器连接池

磁盘数据库可以（可选）具有多个读取器连接。要配置读取器池，请将 `maxReaderConnections` 形参传递给 `NativeSqliteDriver` 的各个构造函数：

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

读取器连接仅用于在事务之外运行查询。任何写入调用以及事务中的任何内容都使用专用于事务的单个连接。

[新内存管理器]: https://kotlinlang.org/docs/native-memory-manager.html