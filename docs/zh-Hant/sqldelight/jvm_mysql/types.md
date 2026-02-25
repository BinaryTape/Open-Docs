## MySQL 型別

SQLDelight 欄位定義與一般的 MySQL 欄位定義完全相同，但支援一種[額外的欄位約束](#custom-column-types)，用於指定產生的介面中該欄位的 Kotlin 型別。

```sql
CREATE TABLE some_types (
  some_bit BIT,                      -- 擷取為 Boolean
  some_tiny_int TINYINT,             -- 擷取為 Byte 
  some_small_int SMALLINT,           -- 擷取為 Short
  some_medium_int MEDIUMINT,         -- 擷取為 Int
  some_integer INTEGER,              -- 擷取為 Int
  some_int INT,                      -- 擷取為 Int
  some_big_int BIGINT,               -- 擷取為 Long
  some_decimal DECIMAL,              -- 擷取為 Double
  some_dec DEC,                      -- 擷取為 Double
  some_fixed FIXED,                  -- 擷取為 Double
  some_numeric NUMERIC,              -- 擷取為 BigDecimal
  some_float FLOAT,                  -- 擷取為 Double
  some_real REAL,                    -- 擷取為 Double
  some_double_prec DOUBLE PRECISION, -- 擷取為 Double
  some_double DOUBLE,                -- 擷取為 Double
  some_date DATE,                    -- 擷取為 LocalDate
  some_time TIME,                    -- 擷取為 LocalTime
  some_datetime DATETIME,            -- 擷取為 LocalDateTime
  some_timestamp TIMESTAMP,          -- 擷取為 OffsetDateTime
  some_year YEAR,                    -- 擷取為 String
  some_char CHAR,                    -- 擷取為 String
  some_varchar VARCHAR(16),          -- 擷取為 String
  some_tiny_text TINYTEXT,           -- 擷取為 String
  some_text TEXT,                    -- 擷取為 String
  some_medium_text MEDIUMTEXT,       -- 擷取為 String
  some_long_text LONGTEXT,           -- 擷取為 String
  some_enum ENUM,                    -- 擷取為 String
  some_set SET,                      -- 擷取為 String
  some_varbinary VARBINARY(8),       -- 擷取為 ByteArray
  some_blob BLOB(8, 8),              -- 擷取為 ByteArray
  some_binary BINARY,                -- 擷取為 ByteArray
  some_json JSON,                    -- 擷取為 String
  some_boolean BOOLEAN,              -- 擷取為 Boolean
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}