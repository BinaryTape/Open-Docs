{% include 'multiplatform_sqlite/index_schema_sq.md' %}

透過這些陳述式，SQLDelight 會產生一個 `Database` 類別與關聯的 `Schema` 物件，可用於建立您的資料庫並對其執行陳述式。`Database` 類別是由 `generateSqlDelightInterface` Gradle 任務產生的，當您編輯 `.sq` 檔案時，SQLDelight IDE 外掛程式會自動執行該任務，同時它也是一般 Gradle 組建的一部分。