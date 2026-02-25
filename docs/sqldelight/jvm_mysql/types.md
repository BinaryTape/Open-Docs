## MySQL 类型

SQLDelight 列定义与常规 MySQL 列定义相同，但支持一个[额外的列约束](#custom-column-types)，用于在生成的接口中指定该列的 Kotlin 类型。

```sql
CREATE TABLE some_types (
  some_bit BIT,                      -- 获取为 Boolean
  some_tiny_int TINYINT,             -- 获取为 Byte 
  some_small_int SMALLINT,           -- 获取为 Short
  some_medium_int MEDIUMINT,         -- 获取为 Int
  some_integer INTEGER,              -- 获取为 Int
  some_int INT,                      -- 获取为 Int
  some_big_int BIGINT,               -- 获取为 Long
  some_decimal DECIMAL,              -- 获取为 Double
  some_dec DEC,                      -- 获取为 Double
  some_fixed FIXED,                  -- 获取为 Double
  some_numeric NUMERIC,              -- 获取为 BigDecimal
  some_float FLOAT,                  -- 获取为 Double
  some_real REAL,                    -- 获取为 Double
  some_double_prec DOUBLE PRECISION, -- 获取为 Double
  some_double DOUBLE,                -- 获取为 Double
  some_date DATE,                    -- 获取为 LocalDate
  some_time TIME,                    -- 获取为 LocalTime
  some_datetime DATETIME,            -- 获取为 LocalDateTime
  some_timestamp TIMESTAMP,          -- 获取为 OffsetDateTime
  some_year YEAR,                    -- 获取为 String
  some_char CHAR,                    -- 获取为 String
  some_varchar VARCHAR(16),          -- 获取为 String
  some_tiny_text TINYTEXT,           -- 获取为 String
  some_text TEXT,                    -- 获取为 String
  some_medium_text MEDIUMTEXT,       -- 获取为 String
  some_long_text LONGTEXT,           -- 获取为 String
  some_enum ENUM,                    -- 获取为 String
  some_set SET,                      -- 获取为 String
  some_varbinary VARBINARY(8),       -- 获取为 ByteArray
  some_blob BLOB(8, 8),              -- 获取为 ByteArray
  some_binary BINARY,                -- 获取为 ByteArray
  some_json JSON,                    -- 获取为 String
  some_boolean BOOLEAN,              -- 获取为 Boolean
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}