## 有效的 SQL 遷移

在遷移檔案中使用自訂 Kotlin 型別，代表這些檔案不再是有效的 SQL。
您可以選擇性地配置 Gradle 任務，將您的遷移檔案輸出為有效的 SQL，以便其他服務讀取：

```groovy
sqldelight {
  databases {
    Database {
      migrationOutputDirectory = layout.buildDirectory.dir("resources/main/migrations")
      migrationOutputFileFormat = ".sql" // Defaults to .sql
  }
}
```

這會建立一個新任務 `generateMainDatabaseMigrations`，它會將您的 `.sqm` 檔案以指定的輸出格式作為有效的 SQL 輸出到輸出目錄中。請為您的 `compileKotlin` 任務建立相依性，以便 Flyway 等服務在其 Classpath 中可以使用這些檔案：

```groovy
compileKotlin.configure {
  dependsOn "generateMainDatabaseMigrations"
}