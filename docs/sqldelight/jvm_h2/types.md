## MySQL 类型

SQLDelight 列定义与常规 H2 列定义相同，但支持一个[额外列约束](#custom-column-types)，用于在生成的接口中指定该列的 Kotlin 类型。

```sql
CREATE TABLE some_types (
  some_tiny_int TINYINT,                           -- 检索为 Byte
  some_small_int SMALLINT,                         -- 检索为 Short
  some_integer INTEGER,                            -- 检索为 Int
  some_int INT,                                    -- 检索为 Int
  some_big_int BIGINT,                             -- 检索为 Long
  some_decimal DECIMAL(6,5),                       -- 检索为 Int
  some_dec DEC(6,5),                               -- 检索为 Int
  some_numeric NUMERIC(6,5),                       -- 检索为 Int
  some_float FLOAT(6),                             -- 检索为 Double
  some_real REAL,                                  -- 检索为 Double
  some_double DOUBLE,                              -- 检索为 Double
  some_double_precision DOUBLE PRECISION,          -- 检索为 Double
  some_boolean BOOLEAN,                            -- 检索为 Boolean
  some_date DATE,                                  -- 检索为 String
  some_time TIME,                                  -- 检索为 String
  some_timestamp2 TIMESTAMP(6),                    -- 检索为 String
  some_char CHAR,                                  -- 检索为 String
  some_character CHARACTER(6),                     -- 检索为 String
  some_char_varying CHAR VARYING(6),               -- 检索为 String
  some_longvarchar LONGVARCHAR,                    -- 检索为 String
  some_character_varying CHARACTER VARYING(6),     -- 检索为 String
  some_varchar VARCHAR(16),                        -- 检索为 String
  some_clo CHARACTER LARGE OBJECT(16),             -- 检索为 String
  some_clob clob(16 M CHARACTERS),                 -- 检索为 String
  some_binary BINARY,                              -- 检索为 ByteArray
  some_binary2 BINARY(6),                          -- 检索为 ByteArray
  some_longvarbinary LONGVARBINARY,                -- 检索为 ByteArray
  some_longvarbinary2 LONGVARBINARY(6),            -- 检索为 ByteArray
  some_binary_varying BINARY VARYING(6),           -- 检索为 ByteArray
  some_varbinary VARBINARY(8),                     -- 检索为 ByteArray
  some_uuid UUID,                                  -- 检索为 ByteArray
  some_blob BLOB,                                  -- 检索为 ByteArray
  some_blo BINARY LARGE OBJECT(6),                 -- 检索为 ByteArray
  some_bit BIT,                                    -- 检索为 ByteArray
  some_bit2 BIT(6),                                -- 检索为 ByteArray
  some_bit_varying BIT VARYING(6),                 -- 检索为 ByteArray
  some_interval INTERVAL YEAR TO MONTH,            -- 检索为 ByteArray
  some_interval2 INTERVAL YEAR(3),                 -- 检索为 ByteArray
  some_interval3 INTERVAL DAY(4) TO HOUR,          -- 检索为 ByteArray
  some_interval4 INTERVAL MINUTE(4) TO SECOND(6),  -- 检索为 ByteArray
  some_interval5 INTERVAL SECOND(4,6)              -- 检索为 ByteArray
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}