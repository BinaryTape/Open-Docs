## 有效的 SQL 迁移

在迁移文件中使用自定义 Kotlin 类型意味着这些文件不再是有效的 SQL。
您可以选择配置一个 Gradle 任务，将您的迁移文件作为有效的 SQL 输出，以便其他服务读取：

```groovy
sqldelight {
  databases {
    Database {
      migrationOutputDirectory = layout.buildDirectory.dir("resources/main/migrations")
      migrationOutputFileFormat = ".sql" // 默认为 .sql
  }
}
```

这将创建一个新任务 `generateMainDatabaseMigrations`，该任务将根据指定的输出格式，在输出目录中将您的 `.sqm` 文件输出为有效的 SQL。请为您的 `compileKotlin` 任务创建依赖项，以便像 flyway 这样的服务可以在其类路径中获取这些文件：

```groovy
compileKotlin.configure {
  dependsOn "generateMainDatabaseMigrations"
}