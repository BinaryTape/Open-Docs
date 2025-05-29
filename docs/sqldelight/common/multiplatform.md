# 多平台

要在 Kotlin 多平台中使用 SQLDelight，请配置 Gradle 插件并指定代码生成的目标包。

```groovy
apply plugin: "org.jetbrains.kotlin.multiplatform"
apply plugin: "app.cash.sqldelight"

sqldelight {
  databases {
    MyDatabase {
      packageName = "com.example.hockey"
    }
  }
}
```

将 `.sq` 文件放入 `src/commonMain/sqldelight` 目录，然后在创建 `Database` 时 `expect` 各个平台提供一个 `SqlDriver`。迁移文件也应该放在同一个 `src/commonMain/sqldelight` 目录中。