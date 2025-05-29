## MySQL 타입

SQLDelight 컬럼 정의는 일반적인 MySQL 컬럼 정의와 동일하지만, 생성된 인터페이스에서 해당 컬럼의 Kotlin 타입을 지정하는 [추가 컬럼 제약 조건](#custom-column-types)을 지원합니다.

```sql
CREATE TABLE some_types (
  some_bit BIT,                      -- Retrieved as Boolean
  some_tiny_int TINYINT,             -- Retrieved as Byte 
  some_small_int SMALLINT,           -- Retrieved as Short
  some_medium_int MEDIUMINT,         -- Retrieved as Int
  some_integer INTEGER,              -- Retrieved as Int
  some_int INT,                      -- Retrieved as Int
  some_big_int BIGINT,               -- Retrieved as Long
  some_decimal DECIMAL,              -- Retrieved as Double
  some_dec DEC,                      -- Retrieved as Double
  some_fixed FIXED,                  -- Retrieved as Double
  some_numeric NUMERIC,              -- Retrieved as BigDecimal
  some_float FLOAT,                  -- Retrieved as Double
  some_real REAL,                    -- Retrieved as Double
  some_double_prec DOUBLE PRECISION, -- Retrieved as Double
  some_double DOUBLE,                -- Retrieved as Double
  some_date DATE,                    -- Retrieved as LocalDate
  some_time TIME,                    -- Retrieved as LocalTime
  some_datetime DATETIME,            -- Retrieved as LocalDateTime
  some_timestamp TIMESTAMP,          -- Retrieved as OffsetDateTime
  some_year YEAR,                    -- Retrieved as String
  some_char CHAR,                    -- Retrieved as String
  some_varchar VARCHAR(16),          -- Retrieved as String
  some_tiny_text TINYTEXT,           -- Retrieved as String
  some_text TEXT,                    -- Retrieved as String
  some_medium_text MEDIUMTEXT,       -- Retrieved as String
  some_long_text LONGTEXT,           -- Retrieved as String
  some_enum ENUM,                    -- Retrieved as String
  some_set SET,                      -- Retrieved as String
  some_varbinary VARBINARY(8),       -- Retrieved as ByteArray
  some_blob BLOB(8, 8),              -- Retrieved as ByteArray
  some_binary BINARY,                -- Retrieved as ByteArray
  some_json JSON,                    -- Retrieved as String
  some_boolean BOOLEAN,              -- Retrieved as Boolean
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}