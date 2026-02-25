## PostgreSQL 类型

SQLDelight 列定义与常规 PostgreSQL 列定义相同，但支持[额外列约束](#custom-column-types)，用于在生成的接口中指定该列的 Kotlin 类型。

```sql
CREATE TABLE some_types (
  some_smallint SMALLINT,               -- 作为 Short 检索
  some_int2 INT2,                       -- 作为 Short 检索
  some_integer INTEGER,                 -- 作为 Int 检索
  some_int INT,                         -- 作为 Int 检索
  some_int4 INT4,                       -- 作为 Int 检索
  some_bigint BIGINT,                   -- 作为 Long 检索
  some_int8 INT8,                       -- 作为 Long 检索
  some_numeric NUMERIC,                 -- 作为 BigDecimal 检索
  some_decimal DECIMAL,                 -- 作为 Double 检索
  some_real REAL,                       -- 作为 Double 检索
  some_float4 FLOAT4,                   -- 作为 Double 检索
  some_double_prec DOUBLE PRECISION,    -- 作为 Double 检索
  some_float8 FLOAT8,                   -- 作为 Double 检索
  some_smallserial SMALLSERIAL,         -- 作为 Short 检索
  some_serial2 SERIAL2,                 -- 作为 Short 检索
  some_serial SERIAL,                   -- 作为 Int 检索
  some_serial4 SERIAL4,                 -- 作为 Int 检索
  some_bigserial BIGSERIAL,             -- 作为 Long 检索
  some_serial8 SERIAL8,                 -- 作为 Long 检索
  some_character CHARACTER,             -- 作为 String 检索
  some_char CHAR,                       -- 作为 String 检索
  some_char_var CHARACTER VARYING(16),  -- 作为 String 检索
  some_varchar VARCHAR(16),             -- 作为 String 检索
  some_text TEXT,                       -- 作为 String 检索
  some_date DATE,                       -- 作为 LocalDate 检索
  some_time TIME,                       -- 作为 LocalTime 检索
  some_timestamp TIMESTAMP,             -- 作为 LocalDateTime 检索
  some_timestamp TIMESTAMPTZ,           -- 作为 OffsetDateTime 检索
  some_json JSON,                       -- 作为 String 检索
  some_jsonb JSONB,                     -- 作为 String 检索
  some_interval INTERVAL,               -- 作为 String 检索
  some_uuid UUID                        -- 作为 UUID 检索
  some_bool BOOL,                       -- 作为 Boolean 检索
  some_boolean BOOLEAN,                 -- 作为 Boolean 检索
  some_bytea BYTEA                      -- 作为 ByteArray 检索
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}