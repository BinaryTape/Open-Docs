# 实现自定义 Worker

SQLDelight Web worker 是一个脚本，它可以接收来自 Web worker 驱动程序的传入消息，使用传入消息执行某些 SQL 操作，然后相应地返回查询结果。

Web worker 最容易使用纯 JavaScript 实现，因为它们通常是相对简短且简单的脚本。

## 传入消息

Web worker 驱动程序的消息格式允许 SQLDelight 以一种通用的方式与 worker 实现进行通信，这种方式不绑定到特定的 SQL 方言或实现。每条消息都包含一个 `action` 属性，用于指定四种操作之一。

### `exec`

此操作指示 worker 应执行附加到消息的某些 SQL 语句，并返回 SQL 查询的结果。消息将包含一个 `sql` 属性（包含要执行的 SQL 语句），以及一个 `params` 数组（包含要绑定到该语句的形参）。

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

告知 worker 应开始一个事务。

示例消息：
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

告知 worker 应结束当前事务。

示例消息：
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

告知 worker 回滚当前事务。

示例消息：
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## 响应消息

每条传入消息都包含一个 `id` 属性，它是该消息的唯一整数。当响应消息时，worker 实现必须在响应消息中包含此 `id` 值。Web worker 驱动程序利用此值来正确处理响应。

### `results` 属性

响应消息还应包含一个 `results` 属性。它用于传递某些 SQL 执行的结果，特别是查询的结果集。`results` 属性应为一个代表结果**行**的数组，其中每个条目是一个代表结果集中**列**的数组。

例如，对上述 `exec` 消息的响应可能是：

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

对于不返回结果集的 SQL 语句，`results` 值应包含单行/单列，其中的数字表示受该语句执行影响的行数。

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 示例

* [SQLDelight 的 SQL.js Worker](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)