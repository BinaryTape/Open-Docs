## SQLite 型別

SQLDelight 的欄位定義與一般的 SQLite 欄位定義相同，但支援一個[額外的欄位約束](#custom-column-types)，用來在產生的介面中指定該欄位的 Kotlin 型別。

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- 在資料庫中儲存為 INTEGER，檢索為 Long
  some_double REAL,            -- 在資料庫中儲存為 REAL，檢索為 Double
  some_string TEXT,            -- 在資料庫中儲存為 TEXT，檢索為 String
  some_blob BLOB               -- 在資料庫中儲存為 BLOB，檢索為 ByteArray
);
```

## 基本型別

一個為提供便利而轉換基本型別的同級模組。

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}"
    }
    ```

存在以下轉接器：

- `FloatColumnAdapter` — 為隱式儲存為 `kotlin.Double` 的 SQL 型別檢索 `kotlin.Float`
- `IntColumnAdapter` — 為隱式儲存為 `kotlin.Long` 的 SQL 型別檢索 `kotlin.Int`
- `ShortColumnAdapter` — 為隱式儲存為 `kotlin.Long` 的 SQL 型別檢索 `kotlin.Short`