## SQLite 型別

SQLDelight 的欄位定義與一般的 SQLite 欄位定義相同，但支援一項[額外欄位約束](#custom-column-types)，用於指定生成介面中該欄位的 Kotlin 型別。

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- 在資料庫中儲存為 INTEGER，取回時為 Long
  some_double REAL,            -- 在資料庫中儲存為 REAL，取回時為 Double
  some_string TEXT,            -- 在資料庫中儲存為 TEXT，取回時為 String
  some_blob BLOB               -- 在資料庫中儲存為 BLOB，取回時為 ByteArray
);
```

## 基本型別

一個同級模組，為您的便利提供基本型別的轉換。

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

存在以下轉換器：

- `FloatColumnAdapter` — 用於 SQL 型別隱式儲存為 `kotlin.Double` 時，取回 `kotlin.Float`
- `IntColumnAdapter` — 用於 SQL 型別隱式儲存為 `kotlin.Long` 時，取回 `kotlin.Int`
- `ShortColumnAdapter` — 用於 SQL 型別隱式儲存為 `kotlin.Long` 時，取回 `kotlin.Short`