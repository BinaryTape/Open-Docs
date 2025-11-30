{% include 'multiplatform_sqlite/index_schema_sq.md' %}

根據這些語句，`SQLDelight` 會生成一個 `Database` 類別，以及一個相關聯的 `Schema` 物件，可用於建立您的資料庫並在其上執行語句。這個 `Database` 類別是由 `generateSqlDelightInterface` `Gradle` 任務生成的，該任務會在您編輯 `.sq` 檔案時由 `SQLDelight IDE plugin` 自動執行，同時也會作為正常 `Gradle` 建置的一部分執行。