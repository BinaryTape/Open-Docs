# 在 Android 上快速入門 SQLite

{% include 'common/index_gradle_database.md' %}

!!! tip
    建議將 Android Studio 切換為使用「專案 (Project)」檢視而非「Android」檔案檢視，以便更容易找到和編輯 SQLDelight 檔案。

{% include 'common/index_schema.md' %}

要在您的程式碼中使用生成的資料庫，您必須將 SQLDelight Android 驅動程式的依賴項添加到您的專案中。

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

驅動程式的實例可以如下所示建構，並且需要引用生成的 `Schema` 物件。
```kotlin
val driver: SqlDriver = AndroidSqliteDriver(Database.Schema, context, "test.db")
```

!!! info
    `AndroidSqliteDriver` 在驅動程式建構時將自動建立或遷移您的結構描述 (schema)。如果需要，遷移也可以手動執行。詳情請參閱 [程式碼遷移]。

{% include 'common/index_queries.md' %}

## SQLite 版本

對於 Android 專案，SQLDelight Gradle 外掛程式會根據您專案的 `minSdkVersion` 設定自動選擇 SQLite 變體版本。[請參閱此處](https://developer.android.com/reference/android/database/sqlite/package-summary) 以取得每個 Android SDK 級別支援的 SQLite 版本列表。

[程式碼遷移]: migrations#code-migrations