## MySQL 型別

SQLDelight 的欄位定義與常規 MySQL 欄位定義相同，但支援一項[額外的欄位約束](#custom-column-types)，該約束指定了在生成介面中該欄位的 Kotlin 型別。

```sql
CREATE TABLE some_types (
  some_bit BIT,                      -- 取得為 Boolean
  some_tiny_int TINYINT,             -- 取得為 Byte 
  some_small_int SMALLINT,           -- 取得為 Short
  some_medium_int MEDIUMINT,         -- 取得為 Int
  some_integer INTEGER,              -- 取得為 Int
  some_int INT,                      -- 取得為 Int
  some_big_int BIGINT,               -- 取得為 Long
  some_decimal DECIMAL,              -- 取得為 Double
  some_dec DEC,                      -- 取得為 Double
  some_fixed FIXED,                  -- 取得為 Double
  some_numeric NUMERIC,              -- 取得為 BigDecimal
  some_float FLOAT,                  -- 取得為 Double
  some_real REAL,                    -- 取得為 Double
  some_double_prec DOUBLE PRECISION, -- 取得為 Double
  some_double DOUBLE,                -- 取得為 Double
  some_date DATE,                    -- 取得為 LocalDate
  some_time TIME,                    -- 取得為 LocalTime
  some_datetime DATETIME,            -- 取得為 LocalDateTime
  some_timestamp TIMESTAMP,          -- 取得為 OffsetDateTime
  some_year YEAR,                    -- 取得為 String
  some_char CHAR,                    -- 取得為 String
  some_varchar VARCHAR(16),          -- 取得為 String
  some_tiny_text TINYTEXT,           -- 取得為 String
  some_text TEXT,                    -- 取得為 String
  some_medium_text MEDIUMTEXT,       -- 取得為 String
  some_long_text LONGTEXT,           -- 取得為 String
  some_enum ENUM,                    -- 取得為 String
  some_set SET,                      -- 取得為 String
  some_varbinary VARBINARY(8),       -- 取得為 ByteArray
  some_blob BLOB(8, 8),              -- 取得為 ByteArray
  some_binary BINARY,                -- 取得為 ByteArray
  some_json JSON,                    -- 取得為 String
  some_boolean BOOLEAN,              -- 取得為 Boolean
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}