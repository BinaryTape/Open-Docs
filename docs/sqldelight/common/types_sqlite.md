## SQLite 类型

SQLDelight 的列定义与常规 SQLite 列定义相同，但支持一个[额外列约束](#custom-column-types)，用于在生成的接口中指定该列的 Kotlin 类型。

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- 在数据库中存储为 INTEGER，检索为 Long
  some_double REAL,            -- 在数据库中存储为 REAL，检索为 Double
  some_string TEXT,            -- 在数据库中存储为 TEXT，检索为 String
  some_blob BLOB               -- 在数据库中存储为 BLOB，检索为 ByteArray
);
```

## 基元

一个为您的便利而对基元进行适配的兄弟模块。

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

存在以下适配器：

- `FloatColumnAdapter` — 为隐式存储为 `kotlin.Double` 的 SQL 类型检索 `kotlin.Float`
- `IntColumnAdapter` — 为隐式存储为 `kotlin.Long` 的 SQL 类型检索 `kotlin.Int`
- `ShortColumnAdapter` — 为隐式存储为 `kotlin.Long` 的 SQL 类型检索 `kotlin.Short`