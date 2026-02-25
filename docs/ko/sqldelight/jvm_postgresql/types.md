## PostgreSQL 타입

SQLDelight 컬럼 정의는 일반적인 PostgreSQL 컬럼 정의와 동일하지만, 생성된 인터페이스에서 컬럼의 코틀린 타입을 지정하는 [추가 컬럼 제약 조건](#custom-column-types)을 지원합니다.

```sql
CREATE TABLE some_types (
  some_smallint SMALLINT,               -- Short로 반환됨
  some_int2 INT2,                       -- Short로 반환됨
  some_integer INTEGER,                 -- Int로 반환됨
  some_int INT,                         -- Int로 반환됨
  some_int4 INT4,                       -- Int로 반환됨
  some_bigint BIGINT,                   -- Long으로 반환됨
  some_int8 INT8,                       -- Long으로 반환됨
  some_numeric NUMERIC,                 -- BigDecimal로 반환됨
  some_decimal DECIMAL,                 -- Double로 반환됨
  some_real REAL,                       -- Double로 반환됨
  some_float4 FLOAT4,                   -- Double로 반환됨
  some_double_prec DOUBLE PRECISION,    -- Double로 반환됨
  some_float8 FLOAT8,                   -- Double로 반환됨
  some_smallserial SMALLSERIAL,         -- Short로 반환됨
  some_serial2 SERIAL2,                 -- Short로 반환됨
  some_serial SERIAL,                   -- Int로 반환됨
  some_serial4 SERIAL4,                 -- Int로 반환됨
  some_bigserial BIGSERIAL,             -- Long으로 반환됨
  some_serial8 SERIAL8,                 -- Long으로 반환됨
  some_character CHARACTER,             -- String으로 반환됨
  some_char CHAR,                       -- String으로 반환됨
  some_char_var CHARACTER VARYING(16),  -- String으로 반환됨
  some_varchar VARCHAR(16),             -- String으로 반환됨
  some_text TEXT,                       -- String으로 반환됨
  some_date DATE,                       -- LocalDate로 반환됨
  some_time TIME,                       -- LocalTime으로 반환됨
  some_timestamp TIMESTAMP,             -- LocalDateTime으로 반환됨
  some_timestamp TIMESTAMPTZ,           -- OffsetDateTime으로 반환됨
  some_json JSON,                       -- String으로 반환됨
  some_jsonb JSONB,                     -- String으로 반환됨
  some_interval INTERVAL,               -- String으로 반환됨
  some_uuid UUID                        -- UUID로 반환됨
  some_bool BOOL,                       -- Boolean으로 반환됨
  some_boolean BOOLEAN,                 -- Boolean으로 반환됨
  some_bytea BYTEA                      -- ByteArray로 반환됨
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}