## SQLite 类型

SQLDelight 列定义与常规 SQLite 列定义相同，但支持一个[额外的列约束](#custom-column-types)，该约束指定了生成接口中列的 Kotlin 类型。

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- 在数据库中存储为 INTEGER，检索时为 Long
  some_double REAL,            -- 在数据库中存储为 REAL，检索时为 Double
  some_string TEXT,            -- 在数据库中存储为 TEXT，检索时为 String
  some_blob BLOB               -- 在数据库中存储为 BLOB，检索时为 ByteArray
);
```

## 基本类型

一个兄弟模块，用于适配基本类型以方便您使用。

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

- `FloatColumnAdapter` — 为一个隐式存储为 `kotlin.Double` 的 SQL 类型检索 `kotlin.Float`
- `IntColumnAdapter` — 为一个隐式存储为 `kotlin.Long` 的 SQL 类型检索 `kotlin.Int`
- `ShortColumnAdapter` — 为一个隐式存储为 `kotlin.Long` 的 SQL 类型检索 `kotlin.Short`