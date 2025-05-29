# 实现自定义 Worker

SQLDelight 的 Web Worker 是一种脚本，能够接收来自 Web Worker 驱动器的传入消息，使用传入消息执行一些 SQL 操作，然后根据查询结果进行相应响应。

Web Worker 通常使用纯 JavaScript 实现最为简便，因为它们是相对简短和简单的脚本。

## 传入消息

Web Worker 驱动器消息格式允许 SQLDelight 以一种不依赖于特定 SQL 变体或实现的通用方式与 Worker 实现进行通信。每条消息都包含一个 `action` 属性，用于指定四种操作之一。

### `exec`

此操作指示 Worker 应执行消息中附加的 SQL 语句，并响应 SQL 查询的结果。消息将包含一个 `sql` 属性，其中包含要执行的 SQL 语句，以及一个 `params` 数组，其中包含要绑定到该语句的参数。

示例消息：
```json
{
  "id": 5,
  "action": "exec",
  "sql": "SELECT column_a, column_b FROM some_table WHERE column_a = ?;",
  "params": ["value"]
}
```

### `begin_transaction`

告诉 Worker 它应该开始一个事务。

示例消息：
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

告诉 Worker 它应该结束当前事务。

示例消息：
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

告诉 Worker 回滚当前事务。

示例消息：
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## 响应消息

每条传入消息都包含一个 `id` 属性，它是该消息的唯一整数标识符。当响应消息时，Worker 实现必须在响应消息中包含此 `id` 值。Web Worker 驱动器使用此值来正确处理响应。

### `results` 属性

响应消息还应包含一个 `results` 属性。它用于传达某些 SQL 执行的结果，特别是查询的结果集。`results` 属性应是一个表示结果“行”的数组，其中每个条目是表示结果集中“列”的数组。

例如，对上述 `exec` 消息的响应可以是：

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

对于不返回结果集的 SQL 语句，`results` 值应包含单行/单列，其中一个数字表示受语句执行影响的行数。

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 示例

* [SQLDelight 的 SQL.js Worker](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)