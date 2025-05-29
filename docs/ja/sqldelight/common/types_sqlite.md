## SQLiteの型

SQLDelightの列定義は標準的なSQLiteの列定義と同一ですが、生成されるインターフェースにおける列のKotlin型を指定する[追加の列制約](#custom-column-types)をサポートしています。

```sql
CREATE TABLE some_types (
  some_long INTEGER,           -- DBにはINTEGERとして保存され、Longとして取得されます
  some_double REAL,            -- DBにはREALとして保存され、Doubleとして取得されます
  some_string TEXT,            -- DBにはTEXTとして保存され、Stringとして取得されます
  some_blob BLOB               -- DBにはBLOBとして保存され、ByteArrayとして取得されます
);
```

## プリミティブ型

便宜のためにプリミティブ型を適応させる補助モジュールです。

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

以下のAdapterが存在します:

- `FloatColumnAdapter` — `kotlin.Double`として暗黙的に保存されているSQL型に対して`kotlin.Float`を取得します
- `IntColumnAdapter` — `kotlin.Long`として暗黙的に保存されているSQL型に対して`kotlin.Int`を取得します
- `ShortColumnAdapter` — `kotlin.Long`として暗黙的に保存されているSQL型に対して`kotlin.Short`を取得します