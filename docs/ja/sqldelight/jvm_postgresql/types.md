## PostgreSQL の型

SQLDelight の列定義は、通常の PostgreSQL の列定義と同じですが、生成されるインターフェースにおける列の Kotlin 型を指定する [追加の列制約](#custom-column-types) をサポートしています。

```sql
CREATE TABLE some_types (
  some_smallint SMALLINT,               -- Short として取得されます
  some_int2 INT2,                       -- Short として取得されます
  some_integer INTEGER,                 -- Int として取得されます
  some_int INT,                         -- Int として取得されます
  some_int4 INT4,                       -- Int として取得されます
  some_bigint BIGINT,                   -- Long として取得されます
  some_int8 INT8,                       -- Long として取得されます
  some_numeric NUMERIC,                 -- BigDecimal として取得されます
  some_decimal DECIMAL,                 -- Double として取得されます
  some_real REAL,                       -- Double として取得されます
  some_float4 FLOAT4,                   -- Double として取得されます
  some_double_prec DOUBLE PRECISION,    -- Double として取得されます
  some_float8 FLOAT8,                   -- Double として取得されます
  some_smallserial SMALLSERIAL,         -- Short として取得されます
  some_serial2 SERIAL2,                 -- Short として取得されます
  some_serial SERIAL,                   -- Int として取得されます
  some_serial4 SERIAL4,                 -- Int として取得されます
  some_bigserial BIGSERIAL,             -- Long として取得されます
  some_serial8 SERIAL8,                 -- Long として取得されます
  some_character CHARACTER,             -- String として取得されます
  some_char CHAR,                       -- String として取得されます
  some_char_var CHARACTER VARYING(16),  -- String として取得されます
  some_varchar VARCHAR(16),             -- String として取得されます
  some_text TEXT,                       -- String として取得されます
  some_date DATE,                       -- LocalDate として取得されます
  some_time TIME,                       -- LocalTime として取得されます
  some_timestamp TIMESTAMP,             -- LocalDateTime として取得されます
  some_timestamp TIMESTAMPTZ,           -- OffsetDateTime として取得されます
  some_json JSON,                       -- String として取得されます
  some_jsonb JSONB,                     -- String として取得されます
  some_interval INTERVAL,               -- String として取得されます
  some_uuid UUID                        -- UUID として取得されます
  some_bool BOOL,                       -- Boolean として取得されます
  some_boolean BOOLEAN,                 -- Boolean として取得されます
  some_bytea BYTEA                      -- ByteArray として取得されます
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}