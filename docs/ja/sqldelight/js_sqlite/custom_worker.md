# カスタムワーカーの実装

SQLDelightのウェブワーカーは、ウェブワーカー ドライバーから受信メッセージを受け取り、その受信メッセージを使用してSQL操作を実行し、クエリ結果に応じて応答するスクリプトです。

ウェブワーカーは、比較的短くシンプルなスクリプトであるため、素のJavaScriptで最も簡単に実装できます。

## 受信メッセージ

ウェブワーカー ドライバーのメッセージフォーマットにより、SQLDelightは特定のSQL方言や実装に縛られない汎用的な方法でワーカー実装と通信できます。すべてのメッセージには、4つのアクションのうちの1つを指定する`action`プロパティが含まれています。

### `exec`

このアクションは、ワーカーがメッセージに添付されたSQLステートメントを実行し、そのSQLクエリの結果で応答すべきであることを示します。メッセージには、実行するSQLステートメントを含む`sql`プロパティと、ステートメントにバインドされるパラメーターを含む`params`配列が含まれます。

Example message:
```json
{
  "id": 5,
  "action": "exec",
  "sql": "SELECT column_a, column_b FROM some_table WHERE column_a = ?;",
  "params": ["value"]
}
```

### `begin_transaction`

ワーカーにトランザクションを開始するよう指示します。

Example message:
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

ワーカーに現在のトランザクションを終了するよう指示します。

Example message:
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

ワーカーに現在のトランザクションをロールバックするよう指示します。

Example message:
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## メッセージへの応答

すべての受信メッセージには、そのメッセージに固有の一意の整数である`id`プロパティが含まれています。メッセージに応答する際、ワーカー実装はこの`id`値を応答メッセージに含める必要があります。これは、ウェブワーカー ドライバーが応答を正しく処理するために使用されます。

### `results`プロパティ

応答メッセージには、`results`プロパティも含まれるべきです。これは、特にクエリの結果セットの場合、SQL実行の結果を伝えるために使用されます。`results`プロパティは、結果の_行_を表す配列であるべきで、各エントリは結果セット内の_列_を表す配列です。

For example, a response to the `exec` message above could be:

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

結果セットを返さないSQLステートメントの場合、`results`の値は、ステートメントの実行によって影響を受けた行数を表す数値を含む単一の行/列であるべきです。

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 例

* [SQLDelightのSQL.jsワーカー](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)