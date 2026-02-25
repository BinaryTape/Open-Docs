## MySQL 타입

SQLDelight 컬럼 정의는 일반적인 H2 컬럼 정의와 동일하지만, 생성된 인터페이스에서 컬럼의 Kotlin 타입을 지정하는 [추가 컬럼 제약 조건](#custom-column-types)을 지원합니다.

```sql
CREATE TABLE some_types (
  some_tiny_int TINYINT,                           -- Byte로 반환됨
  some_small_int SMALLINT,                         -- Short로 반환됨
  some_integer INTEGER,                            -- Int로 반환됨
  some_int INT,                                    -- Int로 반환됨
  some_big_int BIGINT,                             -- Long으로 반환됨
  some_decimal DECIMAL(6,5),                       -- Int로 반환됨
  some_dec DEC(6,5),                               -- Int로 반환됨
  some_numeric NUMERIC(6,5),                       -- Int로 반환됨
  some_float FLOAT(6),                             -- Double로 반환됨
  some_real REAL,                                  -- Double로 반환됨
  some_double DOUBLE,                              -- Double로 반환됨
  some_double_precision DOUBLE PRECISION,          -- Double로 반환됨
  some_boolean BOOLEAN,                            -- Boolean으로 반환됨
  some_date DATE,                                  -- String으로 반환됨
  some_time TIME,                                  -- String으로 반환됨
  some_timestamp2 TIMESTAMP(6),                    -- String으로 반환됨
  some_char CHAR,                                  -- String으로 반환됨
  some_character CHARACTER(6),                     -- String으로 반환됨
  some_char_varying CHAR VARYING(6),               -- String으로 반환됨
  some_longvarchar LONGVARCHAR,                    -- String으로 반환됨
  some_character_varying CHARACTER VARYING(6),     -- String으로 반환됨
  some_varchar VARCHAR(16),                        -- String으로 반환됨
  some_clo CHARACTER LARGE OBJECT(16),             -- String으로 반환됨
  some_clob clob(16 M CHARACTERS),                 -- String으로 반환됨
  some_binary BINARY,                              -- ByteArray로 반환됨
  some_binary2 BINARY(6),                          -- ByteArray로 반환됨
  some_longvarbinary LONGVARBINARY,                -- ByteArray로 반환됨
  some_longvarbinary2 LONGVARBINARY(6),            -- ByteArray로 반환됨
  some_binary_varying BINARY VARYING(6),           -- ByteArray로 반환됨
  some_varbinary VARBINARY(8),                     -- ByteArray로 반환됨
  some_uuid UUID,                                  -- ByteArray로 반환됨
  some_blob BLOB,                                  -- ByteArray로 반환됨
  some_blo BINARY LARGE OBJECT(6),                 -- ByteArray로 반환됨
  some_bit BIT,                                    -- ByteArray로 반환됨
  some_bit2 BIT(6),                                -- ByteArray로 반환됨
  some_bit_varying BIT VARYING(6),                 -- ByteArray로 반환됨
  some_interval INTERVAL YEAR TO MONTH,            -- ByteArray로 반환됨
  some_interval2 INTERVAL YEAR(3),                 -- ByteArray로 반환됨
  some_interval3 INTERVAL DAY(4) TO HOUR,          -- ByteArray로 반환됨
  some_interval4 INTERVAL MINUTE(4) TO SECOND(6),  -- ByteArray로 반환됨
  some_interval5 INTERVAL SECOND(4,6)              -- ByteArray로 반환됨
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}