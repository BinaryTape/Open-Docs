## PostgreSQL 型別

SQLDelight 的欄位定義與常規 PostgreSQL 欄位定義相同，但支援一個[額外欄位約束](#custom-column-types)，用來指定產生的介面中欄位的 Kotlin 型別。

```sql
CREATE TABLE some_types (
  some_smallint SMALLINT,               -- 以 Short 形式取得
  some_int2 INT2,                       -- 以 Short 形式取得
  some_integer INTEGER,                 -- 以 Int 形式取得
  some_int INT,                         -- 以 Int 形式取得
  some_int4 INT4,                       -- 以 Int 形式取得
  some_bigint BIGINT,                   -- 以 Long 形式取得
  some_int8 INT8,                       -- 以 Long 形式取得
  some_numeric NUMERIC,                 -- 以 BigDecimal 形式取得
  some_decimal DECIMAL,                 -- 以 Double 形式取得
  some_real REAL,                       -- 以 Double 形式取得
  some_float4 FLOAT4,                   -- 以 Double 形式取得
  some_double_prec DOUBLE PRECISION,    -- 以 Double 形式取得
  some_float8 FLOAT8,                   -- 以 Double 形式取得
  some_smallserial SMALLSERIAL,         -- 以 Short 形式取得
  some_serial2 SERIAL2,                 -- 以 Short 形式取得
  some_serial SERIAL,                   -- 以 Int 形式取得
  some_serial4 SERIAL4,                 -- 以 Int 形式取得
  some_bigserial BIGSERIAL,             -- 以 Long 形式取得
  some_serial8 SERIAL8,                 -- 以 Long 形式取得
  some_character CHARACTER,             -- 以 String 形式取得
  some_char CHAR,                       -- 以 String 形式取得
  some_char_var CHARACTER VARYING(16),  -- 以 String 形式取得
  some_varchar VARCHAR(16),             -- 以 String 形式取得
  some_text TEXT,                       -- 以 String 形式取得
  some_date DATE,                       -- 以 LocalDate 形式取得
  some_time TIME,                       -- 以 LocalTime 形式取得
  some_timestamp TIMESTAMP,             -- 以 LocalDateTime 形式取得
  some_timestamp TIMESTAMPTZ,           -- 以 OffsetDateTime 形式取得
  some_json JSON,                       -- 以 String 形式取得
  some_jsonb JSONB,                     -- 以 String 形式取得
  some_interval INTERVAL,               -- 以 String 形式取得
  some_uuid UUID                        -- 以 UUID 形式取得
  some_bool BOOL,                       -- 以 Boolean 形式取得
  some_boolean BOOLEAN,                 -- 以 Boolean 形式取得
  some_bytea BYTEA                      -- 以 ByteArray 形式取得
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}