## SQLite の型

SQLDelight の列定義は通常の SQLite の列定義と同じですが、生成されるインターフェースにおける列の Kotlin 型を指定する[追加の列制約](#custom-column-types)をサポートしています。

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- DB 内では INTEGER として保存され、Long として取得される
  some_double REAL,            -- DB 内では REAL として保存され、Double として取得される
  some_string TEXT,            -- DB 内では TEXT として保存され、String として取得される
  some_blob BLOB               -- DB 内では BLOB として保存され、ByteArray として取得される
);
```

## プリミティブ型

利便性のためにプリミティブ型を適合させるための兄弟モジュールです。

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

以下の型アダプターが存在します：

- `FloatColumnAdapter` — 暗黙的に `kotlin.Double` として保存されている SQL 型に対して `kotlin.Float` を取得します
- `IntColumnAdapter` — 暗黙的に `kotlin.Long` として保存されている SQL 型に対して `kotlin.Int` を取得します
- `ShortColumnAdapter` — 暗黙的に `kotlin.Long` として保存されている SQL 型に対して `kotlin.Short` を取得します