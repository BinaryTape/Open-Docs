## MySQL 型別

SQLDelight 的欄位定義與一般的 H2 欄位定義相同，但支援一個[額外欄位約束](#custom-column-types)，該約束指定了產生的介面中該欄位的 Kotlin 型別。

```sql
CREATE TABLE some_types (
  some_tiny_int TINYINT,                           -- 讀取為 Byte
  some_small_int SMALLINT,                         -- 讀取為 Short
  some_integer INTEGER,                            -- 讀取為 Int
  some_int INT,                                    -- 讀取為 Int
  some_big_int BIGINT,                             -- 讀取為 Long
  some_decimal DECIMAL(6,5),                       -- 讀取為 Int
  some_dec DEC(6,5),                               -- 讀取為 Int
  some_numeric NUMERIC(6,5),                       -- 讀取為 Int
  some_float FLOAT(6),                             -- 讀取為 Double
  some_real REAL,                                  -- 讀取為 Double
  some_double DOUBLE,                              -- 讀取為 Double
  some_double_precision DOUBLE PRECISION,          -- 讀取為 Double
  some_boolean BOOLEAN,                            -- 讀取為 Boolean
  some_date DATE,                                  -- 讀取為 String
  some_time TIME,                                  -- 讀取為 String
  some_timestamp2 TIMESTAMP(6),                    -- 讀取為 String
  some_char CHAR,                                  -- 讀取為 String
  some_character CHARACTER(6),                     -- 讀取為 String
  some_char_varying CHAR VARYING(6),               -- 讀取為 String
  some_longvarchar LONGVARCHAR,                    -- 讀取為 String
  some_character_varying CHARACTER VARYING(6),     -- 讀取為 String
  some_varchar VARCHAR(16),                        -- 讀取為 String
  some_clo CHARACTER LARGE OBJECT(16),             -- 讀取為 String
  some_clob clob(16 M CHARACTERS),                 -- 讀取為 String
  some_binary BINARY,                              -- 讀取為 ByteArray
  some_binary2 BINARY(6),                          -- 讀取為 ByteArray
  some_longvarbinary LONGVARBINARY,                -- 讀取為 ByteArray
  some_longvarbinary2 LONGVARBINARY(6),            -- 讀取為 ByteArray
  some_binary_varying BINARY VARYING(6),           -- 讀取為 ByteArray
  some_varbinary VARBINARY(8),                     -- 讀取為 ByteArray
  some_uuid UUID,                                  -- 讀取為 ByteArray
  some_blob BLOB,                                  -- 讀取為 ByteArray
  some_blo BINARY LARGE OBJECT(6),                 -- 讀取為 ByteArray
  some_bit BIT,                                    -- 讀取為 ByteArray
  some_bit2 BIT(6),                                -- 讀取為 ByteArray
  some_bit_varying BIT VARYING(6),                 -- 讀取為 ByteArray
  some_interval INTERVAL YEAR TO MONTH,            -- 讀取為 ByteArray
  some_interval2 INTERVAL YEAR(3),                 -- 讀取為 ByteArray
  some_interval3 INTERVAL DAY(4) TO HOUR,          -- 讀取為 ByteArray
  some_interval4 INTERVAL MINUTE(4) TO SECOND(6),  -- 讀取為 ByteArray
  some_interval5 INTERVAL SECOND(4,6)              -- 讀取為 ByteArray
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}