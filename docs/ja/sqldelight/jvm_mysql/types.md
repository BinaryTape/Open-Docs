## MySQLの型

SQLDelightのカラム定義は通常のMySQLのカラム定義と同じですが、生成されるインターフェースにおけるカラムのKotlinの型を指定する[追加のカラム制約](#custom-column-types)をサポートしています。

```sql
CREATE TABLE some_types (
  some_bit BIT,                      -- Booleanとして取得
  some_tiny_int TINYINT,             -- Byteとして取得 
  some_small_int SMALLINT,           -- Shortとして取得
  some_medium_int MEDIUMINT,         -- Intとして取得
  some_integer INTEGER,              -- Intとして取得
  some_int INT,                      -- Intとして取得
  some_big_int BIGINT,               -- Longとして取得
  some_decimal DECIMAL,              -- Doubleとして取得
  some_dec DEC,                      -- Doubleとして取得
  some_fixed FIXED,                  -- Doubleとして取得
  some_numeric NUMERIC,              -- BigDecimalとして取得
  some_float FLOAT,                  -- Doubleとして取得
  some_real REAL,                    -- Doubleとして取得
  some_double_prec DOUBLE PRECISION, -- Doubleとして取得
  some_double DOUBLE,                -- Doubleとして取得
  some_date DATE,                    -- LocalDateとして取得
  some_time TIME,                    -- LocalTimeとして取得
  some_datetime DATETIME,            -- LocalDateTimeとして取得
  some_timestamp TIMESTAMP,          -- OffsetDateTimeとして取得
  some_year YEAR,                    -- Stringとして取得
  some_char CHAR,                    -- Stringとして取得
  some_varchar VARCHAR(16),          -- Stringとして取得
  some_tiny_text TINYTEXT,           -- Stringとして取得
  some_text TEXT,                    -- Stringとして取得
  some_medium_text MEDIUMTEXT,       -- Stringとして取得
  some_long_text LONGTEXT,           -- Stringとして取得
  some_enum ENUM,                    -- Stringとして取得
  some_set SET,                      -- Stringとして取得
  some_varbinary VARBINARY(8),       -- ByteArrayとして取得
  some_blob BLOB(8, 8),              -- ByteArrayとして取得
  some_binary BINARY,                -- ByteArrayとして取得
  some_json JSON,                    -- Stringとして取得
  some_boolean BOOLEAN,              -- Booleanとして取得
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}