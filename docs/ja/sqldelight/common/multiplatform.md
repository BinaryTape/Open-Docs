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

`.sq` ファイルは `src/commonMain/sqldelight` ディレクトリに配置し、`Database` を作成する際には、各プラットフォームから `SqlDriver` が提供されるように `expect` します。移行ファイルも同じ `src/commonMain/sqldelight` ディレクトリに置く必要があります。