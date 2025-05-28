{% include 'common/index_schema_sq.md' %}

從這些語句中，SQLDelight 將會生成一個 `Database` 類別，附帶一個相關的 `Schema` 物件，可用於建立您的資料庫並在其上執行語句。這個 `Database` 類別是由 `generateSqlDelightInterface` Gradle 任務生成的，該任務會在您編輯 `.sq` 檔案時由 SQLDelight IDE 外掛程式自動執行，並且也是正常 Gradle 建構過程的一部分。