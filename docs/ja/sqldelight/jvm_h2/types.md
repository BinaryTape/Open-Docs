## MySQLの型

SQLDelightの列定義は通常のH2の列定義と同一ですが、生成されるインターフェースにおける列のKotlin型を指定する[追加の列制約](#custom-column-types)をサポートしています。

```sql
CREATE TABLE some_types (
  some_tiny_int TINYINT,                           -- Byteとして取得
  some_small_int SMALLINT,                         -- Shortとして取得
  some_integer INTEGER,                            -- Intとして取得
  some_int INT,                                    -- Intとして取得
  some_big_int BIGINT,                             -- Longとして取得
  some_decimal DECIMAL(6,5),                       -- Intとして取得
  some_dec DEC(6,5),                               -- Intとして取得
  some_numeric NUMERIC(6,5),                       -- Intとして取得
  some_float FLOAT(6),                             -- Doubleとして取得
  some_real REAL,                                  -- Doubleとして取得
  some_double DOUBLE,                              -- Doubleとして取得
  some_double_precision DOUBLE PRECISION,          -- Doubleとして取得
  some_boolean BOOLEAN,                            -- Booleanとして取得
  some_date DATE,                                  -- Stringとして取得
  some_time TIME,                                  -- Stringとして取得
  some_timestamp2 TIMESTAMP(6),                    -- Stringとして取得
  some_char CHAR,                                  -- Stringとして取得
  some_character CHARACTER(6),                     -- Stringとして取得
  some_char_varying CHAR VARYING(6),               -- Stringとして取得
  some_longvarchar LONGVARCHAR,                    -- Stringとして取得
  some_character_varying CHARACTER VARYING(6),     -- Stringとして取得
  some_varchar VARCHAR(16),                        -- Stringとして取得
  some_clo CHARACTER LARGE OBJECT(16),             -- Stringとして取得
  some_clob clob(16 M CHARACTERS),                 -- Stringとして取得
  some_binary BINARY,                              -- ByteArrayとして取得
  some_binary2 BINARY(6),                          -- ByteArrayとして取得
  some_longvarbinary LONGVARBINARY,                -- ByteArrayとして取得
  some_longvarbinary2 LONGVARBINARY(6),            -- ByteArrayとして取得
  some_binary_varying BINARY VARYING(6),           -- ByteArrayとして取得
  some_varbinary VARBINARY(8),                     -- ByteArrayとして取得
  some_uuid UUID,                                  -- ByteArrayとして取得
  some_blob BLOB,                                  -- ByteArrayとして取得
  some_blo BINARY LARGE OBJECT(6),                 -- ByteArrayとして取得
  some_bit BIT,                                    -- ByteArrayとして取得
  some_bit2 BIT(6),                                -- ByteArrayとして取得
  some_bit_varying BIT VARYING(6),                 -- ByteArrayとして取得
  some_interval INTERVAL YEAR TO MONTH,            -- ByteArrayとして取得
  some_interval2 INTERVAL YEAR(3),                 -- ByteArrayとして取得
  some_interval3 INTERVAL DAY(4) TO HOUR,          -- ByteArrayとして取得
  some_interval4 INTERVAL MINUTE(4) TO SECOND(6),  -- ByteArrayとして取得
  some_interval5 INTERVAL SECOND(4,6)              -- ByteArrayとして取得
);
```

{% include 'common/custom_column_types.md' %}

{% include 'common/types_server_migrations.md' %}