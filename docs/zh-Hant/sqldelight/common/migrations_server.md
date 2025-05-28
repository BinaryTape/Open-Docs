## 有效的 SQL 移轉

在移轉檔案中使用自訂的 Kotlin 型別，表示這些檔案不再是有效的 SQL。您可以選擇性地配置一個 Gradle 任務，將您的移轉檔案輸出為有效的 SQL，供其他服務讀取：

```groovy
sqldelight {
  databases {
    Database {
      migrationOutputDirectory = layout.buildDirectory.dir("resources/main/migrations")
      migrationOutputFileFormat = ".sql" // Defaults to .sql
  }
}
```

這會建立一個新的任務 `generateMainDatabaseMigrations`，它會將您的 `.sqm` 檔案以輸出格式輸出為有效的 SQL，並存放在輸出目錄中。從您的 `compileKotlin` 任務建立一個依賴項，以便 Flyway 等服務可以在它們的類別路徑 (classpath) 上取得這些檔案：

```groovy
compileKotlin.configure {
  dependsOn "generateMainDatabaseMigrations"
}
```