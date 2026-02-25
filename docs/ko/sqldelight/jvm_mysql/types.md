## MySQL 타입

SQLDelight 컬럼 정의는 일반적인 MySQL 컬럼 정의와 동일하지만, 생성된 인터페이스에서 컬럼의 Kotlin 타입을 지정하는 [추가 컬럼 제약 사항(extra column constraint)](#custom-column-types)을 지원합니다.

```sql
CREATE TABLE some_types (
  some_bit BIT,                      -- Boolean으로 가져옴
  some_tiny_int TINYINT,             -- Byte로 가져옴 
  some_small_int SMALLINT,           -- Short으로 가져옴
  some_medium_int MEDIUMINT,         -- Int로 가져옴
  some_integer INTEGER,              -- Int로 가져옴
  some_int INT,                      -- Int로 가져옴
  some_big_int BIGINT,               -- Long으로 가져옴
  some_decimal DECIMAL,              -- Double로 가져옴
  some_dec DEC,                      -- Double로 가져옴
  some_fixed FIXED,                  -- Double로 가져옴
  some_numeric NUMERIC,              -- BigDecimal로 가져옴
  some_float FLOAT,                  -- Double로 가져옴
  some_real REAL,                    -- Double로 가져옴
  some_double_prec DOUBLE PRECISION, -- Double로 가져옴
  some_double DOUBLE,                -- Double로 가져옴
  some_date DATE,                    -- LocalDate로 가져옴
  some_time TIME,                    -- LocalTime으로 가져옴
  some_datetime DATETIME,            -- LocalDateTime으로 가져옴
  some_timestamp TIMESTAMP,          -- OffsetDateTime으로 가져옴
  some_year YEAR,                    -- String으로 가져옴
  some_char CHAR,                    -- String으로 가져옴
  some_varchar VARCHAR(16),          -- String으로 가져옴
  some_tiny_text TINYTEXT,           -- String으로 가져옴
  some_text TEXT,                    -- String으로 가져옴
  some_medium_text MEDIUMTEXT,       -- String으로 가져옴
  some_long_text LONGTEXT,           -- String으로 가져옴
  some_enum ENUM,                    -- String으로 가져옴
  some_set SET,                      -- String으로 가져옴
  some_varbinary VARBINARY(8),       -- ByteArray로 가져옴
  some_blob BLOB(8, 8),              -- ByteArray로 가져옴
  some_binary BINARY,                -- ByteArray로 가져옴
  some_json JSON,                    -- String으로 가져옴
  some_boolean BOOLEAN,              -- Boolean으로 가져옴
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}