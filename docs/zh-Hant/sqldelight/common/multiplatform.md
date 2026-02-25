# 多平台

若要在 Kotlin 多平台中使用 SQLDelight，請為 Gradle 外掛程式設定一個用於產生程式碼的套件。

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

將 `.sq` 檔案放在 `src/commonMain/sqldelight` 目錄中，接著在建立 `Database` 時，由各個平台 `expect` 提供 `SqlDriver`。遷移檔案也應放在相同的 `src/commonMain/sqldelight` 目錄下。