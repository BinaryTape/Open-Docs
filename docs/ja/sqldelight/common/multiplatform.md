# マルチプラットフォーム

KotlinマルチプラットフォームでSQLDelightを使用するには、コードを生成するパッケージを指定してGradleプラグインを設定します。

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

`.sq`ファイルを`src/commonMain/sqldelight`ディレクトリに配置し、`Database`を作成する際に各プラットフォームから`SqlDriver`が提供されるよう`expect`を定義します。マイグレーションファイルも同じ`src/commonMain/sqldelight`ディレクトリに配置する必要があります。