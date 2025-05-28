# 多平台

要在 Kotlin 多平台中使用 SQLDelight，請配置 Gradle 外掛程式，並指定一個用於生成程式碼的套件。

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

將 `.sq` 檔案放在 `src/commonMain/sqldelight` 目錄中，然後在建立 `Database` 時，期望 `SqlDriver` 能由個別平台提供。遷移檔案也應位於相同的 `src/commonMain/sqldelight` 目錄中。