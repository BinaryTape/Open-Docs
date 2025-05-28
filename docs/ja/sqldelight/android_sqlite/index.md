# AndroidでのSQLite入門

{% include 'common/index_gradle_database.md' %}

!!! tip
    SQLDelightのファイルを見つけて編集しやすくするために、Android Studioのファイルビューを「Android」ビューから「Project」ビューに切り替えることをお勧めします。

{% include 'common/index_schema.md' %}

生成されたデータベースをコードで使用するには、SQLDelight Androidドライバーの依存関係をプロジェクトに追加する必要があります。

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:android-driver:{{ versions.sqldelight }}"
    }
    ```

以下に示すようにドライバーのインスタンスを構築でき、生成された `Schema` オブジェクトへの参照が必要です。
```kotlin
val driver: SqlDriver = AndroidSqliteDriver(Database.Schema, context, "test.db")
```

!!! info
    `AndroidSqliteDriver` は、ドライバーが構築される際にスキーマを自動的に作成またはマイグレーションします。
    必要に応じて、マイグレーションを手動で実行することもできます。詳細については、[コードマイグレーション]を参照してください。

{% include 'common/index_queries.md' %}

## SQLiteのバージョン

Androidプロジェクトの場合、SQLDelight Gradleプラグインは、プロジェクトの `minSdkVersion` 設定に基づいてSQLiteのダイアレクトバージョンを自動的に選択します。各Android SDKレベルでサポートされているSQLiteバージョンのリストは、[こちら](https://developer.android.com/reference/android/database/sqlite/package-summary)を参照してください。

[Code Migrations]: migrations#code-migrations