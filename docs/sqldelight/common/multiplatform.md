# 多平台

要在 Kotlin 多平台中使用 SQLDelight，请为 Gradle 插件配置一个用于生成代码的软件包。

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

将 `.sq` 文件放入 `src/commonMain/sqldelight` 目录，然后在创建 `Database` 时，通过 `expect` 要求由各个平台提供 `SqlDriver`。迁移文件也应位于相同的 `src/commonMain/sqldelight` 目录中。