## 有効なSQLマイグレーション

マイグレーションファイルでカスタムのKotlin型を使用すると、それらのファイルはもはや有効なSQLではなくなります。オプションで、他のサービスが読み取れるように、マイグレーションファイルを有効なSQLとして出力するGradleタスクを設定できます。

```groovy
sqldelight {
  databases {
    Database {
      migrationOutputDirectory = layout.buildDirectory.dir("resources/main/migrations")
      migrationOutputFileFormat = ".sql" // Defaults to .sql
  }
}
```

これにより、新しいタスク`generateMainDatabaseMigrations`が作成され、`.sqm`ファイルが指定された出力形式で、出力ディレクトリに有効なSQLとして出力されます。Flywayのようなサービスがクラスパス上でファイルを利用できるように、`compileKotlin`タスクから依存関係を作成してください。

```groovy
compileKotlin.configure {
  dependsOn "generateMainDatabaseMigrations"
}