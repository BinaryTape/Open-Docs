## 有效的 SQL 迁移

在迁移文件中使用自定义的 Kotlin 类型意味着这些文件不再是有效的 SQL。你可以选择配置一个 Gradle 任务，将你的迁移文件输出为有效的 SQL，供其他服务读取：

```groovy
sqldelight {
  databases {
    Database {
      migrationOutputDirectory = layout.buildDirectory.dir("resources/main/migrations")
      migrationOutputFileFormat = ".sql" // Defaults to .sql
  }
}
```

这会创建一个新任务 `generateMainDatabaseMigrations`，它将你的 `.sqm` 文件以指定的输出格式输出为有效的 SQL 到输出目录中。请从你的 `compileKotlin` 任务创建一个依赖，以便像 Flyway 这样的服务可以在其类路径 (classpath) 上找到这些文件：

```groovy
compileKotlin.configure {
  dependsOn "generateMainDatabaseMigrations"
}