# 實作自訂 Worker

SQLDelight Web Worker 是一種腳本，它能接收來自 Web Worker 驅動程式的傳入訊息，使用這些訊息執行一些 SQL 操作，然後據此回應任何查詢結果。

Web Worker 最容易以純 JavaScript 實作，因為它們是相對簡短且簡單的腳本。

## 傳入訊息

Web Worker 驅動程式訊息格式允許 SQLDelight 以通用方式與 Worker 實作進行通訊，不受特定 SQL 變體或實作的限制。每個訊息都包含一個 `action` 屬性，指定四種動作之一。

### `exec`

此動作表示 Worker 應執行附加到訊息的 SQL 陳述式，並回應 SQL 查詢的結果。訊息將包含一個 `sql` 屬性，其中包含要執行的 SQL 陳述式，以及一個 `params` 陣列，其中包含要綁定到該陳述式的參數。

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

告知 Worker 應開始一個交易。

範例訊息：
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

告知 Worker 應結束目前的交易。

範例訊息：
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

告知 Worker 回溯目前的交易。

範例訊息：
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## 回應訊息

每個傳入訊息都包含一個 `id` 屬性，這是該訊息的唯一整數。當回應訊息時，Worker 實作必須在回應訊息中包含此 `id` 值。Web Worker 驅動程式會使用此值來正確處理回應。

### `results` 屬性

回應訊息也應包含一個 `results` 屬性。這用於傳達某些 SQL 執行的結果，特別是查詢的結果集。`results` 屬性應為一個陣列，表示結果的**列**，其中每個條目都是一個陣列，表示結果集中的**欄**。

例如，對上方 `exec` 訊息的回應可能如下所示：

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

對於不返回結果集的 SQL 陳述式，`results` 值應包含單一的列/欄，其中包含一個數字，表示受陳述式執行影響的列數。

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 範例

* [SQLDelight 的 SQL.js Worker](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)