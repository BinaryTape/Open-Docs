# 實作自訂背景工作執行緒

SQLDelight Web 背景工作執行緒是一個指令碼，可以接收來自 Web 背景工作執行緒驅動程式的傳入訊息，使用傳入訊息執行某些 SQL 作業，然後據此回應任何查詢結果。

Web 背景工作執行緒最容易使用純 JavaScript 實作，因為它們是相對短且簡單的指令碼。

## 傳入訊息

Web 背景工作執行緒驅動程式訊息格式允許 SQLDelight 以通用方式與背景工作執行緒實作進行通訊，而不會與特定的 SQL 方言或實作繫結。每個訊息都包含一個 `action` 屬性，用於指定四種操作之一。

### `exec`

此操作表示背景工作執行緒應執行訊息附加的某些 SQL 陳述式，並回應 SQL 查詢的結果。訊息將包含一個包含要執行的 SQL 陳述式的 `sql` 屬性，以及一個包含要繫結到該陳述式的參數的 `params` 陣列。

範例訊息：
```json
{
  "id": 5,
  "action": "exec",
  "sql": "SELECT column_a, column_b FROM some_table WHERE column_a = ?;",
  "params": ["value"]
}
```

### `begin_transaction`

告知背景工作執行緒應開始一個交易。

範例訊息：
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

告知背景工作執行緒應結束當前交易。

範例訊息：
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

告知背景工作執行緒回復當前交易。

範例訊息：
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## 回應訊息

每個傳入訊息都包含一個 `id` 屬性，該屬性是該訊息的唯一整數。在回應訊息時，背景工作執行緒實作必須在回應訊息中包含此 `id` 值。Web 背景工作執行緒驅動程式使用它來正確處理回應。

### `results` 屬性

回應訊息還應包含一個 `results` 屬性。這用於傳達某些 SQL 執行的結果，特別是查詢的結果集。`results` 屬性應為一個代表結果列（rows）的陣列，其中每個項目都是一個代表結果集中欄（columns）的陣列。

例如，對上述 `exec` 訊息的回應可能是：

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

對於不傳回結果集的 SQL 陳述式，`results` 值應包含單個列/欄，其中的數字代表受該陳述式執行影響的列數。

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 範例

* [SQLDelight 的 SQL.js 背景工作執行緒](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)