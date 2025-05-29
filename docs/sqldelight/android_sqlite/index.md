# 在 Android 上开始使用 SQLite

{% include 'common/index_gradle_database.md' %}

!!! tip
    建议将 Android Studio 切换为使用“Project”视图而不是“Android”视图来查看文件，以便更轻松地查找和编辑 SQLDelight 文件。

{% include 'common/index_schema.md' %}

要在代码中使用生成的数据库，您必须将 SQLDelight Android 驱动程序依赖项添加到您的项目中。

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:android-driver:{{ versions.sqldelight }}"
    }
    ```

驱动程序实例可以按如下方式构造，并且需要引用生成的 `Schema` 对象。
```kotlin
val driver: SqlDriver = AndroidSqliteDriver(Database.Schema, context, "test.db")
```

!!! info
    `AndroidSqliteDriver` 会在驱动程序构造时自动创建或迁移您的 schema。如果需要，迁移也可以手动执行。更多信息请参阅 [Code Migrations]。

{% include 'common/index_queries.md' %}

## SQLite 版本

对于 Android 项目，SQLDelight Gradle 插件将根据您项目的 `minSdkVersion` 设置自动选择 SQLite 变体版本。[此处](https://developer.android.com/reference/android/database/sqlite/package-summary) 查看每个 Android SDK 级别支持的 SQLite 版本列表。

[Code Migrations]: migrations#code-migrations