## 有効なSQLマイグレーション

マイグレーションファイルでカスタムKotlin型を使用すると、それらのファイルは有効なSQLではなくなります。他のサービスが読み取れるように、マイグレーションファイルを有効なSQLとして出力するGradleタスクをオプションで設定できます。

```groovy
sqldelight {
  databases {
    Database {
      migrationOutputDirectory = layout.buildDirectory.dir("resources/main/migrations")
      migrationOutputFileFormat = ".sql" // デフォルトは .sql
  }
}
```

これにより、新しいタスク `generateMainDatabaseMigrations` が作成されます。このタスクは、`.sqm` ファイルを有効なSQLとして、指定された出力形式で出力ディレクトリに書き出します。Flywayなどのサービスがそれらのファイルをクラスパス上で利用できるように、`compileKotlin` タスクからの依存関係を作成してください。

```groovy
compileKotlin.configure {
  dependsOn "generateMainDatabaseMigrations"
}