# カスタムワーカーの実装

SQLDelightのWebワーカーは、Webワーカードライバーからの受信メッセージを受け取り、そのメッセージを使用してSQL操作を実行し、クエリ結果を適切に返すスクリプトです。

Webワーカーは、比較的短くシンプルなスクリプトであるため、プレーンなJavaScriptで実装するのが最も簡単です。

## 受信メッセージ

Webワーカードライバーのメッセージ形式により、SQLDelightは特定のSQL方言や実装に依存しない汎用的な方法でワーカー実装と通信できます。すべてのメッセージには、4つのアクションのいずれかを指定する `action` プロパティが含まれています。

### `exec`

このアクションは、ワーカーがメッセージに添付されたSQLステートメントを実行し、SQLクエリの結果とともに応答する必要があることを示します。メッセージには、実行するSQLステートメントを含む `sql` プロパティと、ステートメントにバインドされるパラメータを含む `params` 配列が含まれます。

メッセージの例：
```json
{
  "id": 5,
  "action": "exec",
  "sql": "SELECT column_a, column_b FROM some_table WHERE column_a = ?;",
  "params": ["value"]
}
```

### `begin_transaction`

ワーカーにトランザクションを開始するように指示します。

メッセージの例：
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

ワーカーに現在のトランザクションを終了するように指示します。

メッセージの例：
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

ワーカーに現在のトランザクションをロールバックするように指示します。

メッセージの例：
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## メッセージへの応答

すべての受信メッセージには、そのメッセージに対して一意の整数である `id` プロパティが含まれています。メッセージに応答する際、ワーカーの実装はこの `id` 値を応答メッセージに含める必要があります。これは、Webワーカードライバーが応答を正しく処理するために使用されます。

### `results` プロパティ

応答メッセージには `results` プロパティも含める必要があります。これは、SQL実行の結果（特にクエリの結果セット）を伝えるために使用されます。`results` プロパティは、結果の「行（rows）」を表す配列である必要があり、各エントリは結果セットの「列（columns）」を表す配列となります。

たとえば、上記の `exec` メッセージに対する応答は次のようになります。

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

結果セットを返さないSQLステートメントの場合、`results` の値には、ステートメントの実行によって影響を受けた行数を示す数値を含む単一の行/列を含める必要があります。

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 例

* [SQLDelightのSQL.jsワーカー](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)