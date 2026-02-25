# 在 Android 上開始使用 SQLite

{% include 'common/index_gradle_database.md' %}

!!! tip
    建議將 Android Studio 切換為使用「Project」檢視，而非檔案的「Android」檢視，以便更輕鬆地尋找與編輯 SQLDelight 檔案。

{% include 'common/index_schema.md' %}

若要在程式碼中使用產生的資料庫，您必須將 SQLDelight Android 驅動程式相依性新增至專案中。

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

如下所示，可以建構驅動程式的執行個體，且需要參照產生的 `Schema` 物件。
```kotlin
val driver: SqlDriver = AndroidSqliteDriver(Database.Schema, context, "test.db")
```

!!! info
    當驅動程式建構時，`AndroidSqliteDriver` 會自動建立或遷移您的架構。如有需要，也可以手動執行遷移。請參閱 [程式碼遷移][Code Migrations] 以進一步了解。

{% include 'common/index_queries.md' %}

## SQLite 版本

對於 Android 專案，SQLDelight Gradle 外掛程式會根據您專案的 `minSdkVersion` 設定，自動選取 SQLite 方言版本。[點擊此處](https://developer.android.com/reference/android/database/sqlite/package-summary) 以查看各個 Android SDK 層級支援的 SQLite 版本列表。

[Code Migrations]: migrations#code-migrations