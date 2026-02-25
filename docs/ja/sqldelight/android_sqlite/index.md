# Android での SQLite のはじめかた

{% include 'common/index_gradle_database.md' %}

!!! tip
    SQLDelight ファイルを見つけて編集しやすくするために、Android Studio の表示を「Android」ビューではなく「Project（プロジェクト）」ビューに切り替えて使用することをお勧めします。

{% include 'common/index_schema.md' %}

生成されたデータベースをコード内で使用するには、SQLDelight Android ドライバの依存関係をプロジェクトに追加する必要があります。

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

ドライバのインスタンスは以下のように構築でき、生成された `Schema` オブジェクトへの参照が必要になります。
```kotlin
val driver: SqlDriver = AndroidSqliteDriver(Database.Schema, context, "test.db")
```

!!! info
    `AndroidSqliteDriver` は、ドライバが構築されるときにスキーマを自動的に作成または移行（マイグレーション）します。必要に応じて、移行を手動で実行することも可能です。詳細は [Code Migrations] を参照してください。

{% include 'common/index_queries.md' %}

## SQLite のバージョン

Android プロジェクトでは、SQLDelight Gradle プラグインがプロジェクトの `minSdkVersion` 設定に基づいて SQLite ダイアレクト (dialect) のバージョンを自動的に選択します。各 Android SDK レベルでサポートされている SQLite バージョンのリストについては、[こちら](https://developer.android.com/reference/android/database/sqlite/package-summary) を参照してください。

[Code Migrations]: migrations#code-migrations