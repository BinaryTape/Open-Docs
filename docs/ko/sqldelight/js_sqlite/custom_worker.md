# 커스텀 워커 구현하기

SQLDelight 웹 워커는 웹 워커 드라이버로부터 수신 메시지를 받고, 해당 메시지를 사용하여 일부 SQL 작업을 실행한 다음, 쿼리 결과에 따라 응답할 수 있는 스크립트입니다.

웹 워커는 비교적 짧고 간단한 스크립트이므로, 일반 JavaScript로 구현하는 것이 가장 쉽습니다.

## 수신 메시지

웹 워커 드라이버 메시지 형식은 SQLDelight가 특정 SQL 방언이나 구현에 얽매이지 않는 일반적인 방식으로 워커 구현과 통신할 수 있도록 합니다. 모든 메시지에는 네 가지 액션 중 하나를 지정하는 `action` 속성이 포함되어 있습니다.

### `exec`

이 액션은 워커가 메시지에 첨부된 SQL 문을 실행하고 SQL 쿼리 결과로 응답해야 함을 나타냅니다. 메시지에는 실행할 SQL 문을 포함하는 `sql` 속성과 해당 문에 바인딩될 파라미터를 포함하는 `params` 배열이 포함됩니다.

메시지 예시:
```json
{
  "id": 5,
  "action": "exec",
  "sql": "SELECT column_a, column_b FROM some_table WHERE column_a = ?;",
  "params": ["value"]
}
```

### `begin_transaction`

워커에게 트랜잭션을 시작해야 한다고 알립니다.

메시지 예시:
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

워커에게 현재 트랜잭션을 종료해야 한다고 알립니다.

메시지 예시:
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

워커에게 현재 트랜잭션을 롤백해야 한다고 알립니다.

메시지 예시:
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## 메시지 응답

모든 수신 메시지에는 해당 메시지에 대한 고유한 정수인 `id` 속성이 포함되어 있습니다. 메시지에 응답할 때, 워커 구현은 응답 메시지에 이 `id` 값을 포함해야 합니다. 이는 웹 워커 드라이버가 응답을 올바르게 처리하는 데 사용됩니다.

### `results` 속성

응답 메시지에는 또한 `results` 속성이 포함되어야 합니다. 이는 일부 SQL 실행 결과, 특히 쿼리의 결과 집합을 전달하는 데 사용됩니다. `results` 속성은 결과의 _행(row)_을 나타내는 배열이어야 하며, 각 항목은 결과 집합의 _열(column)_을 나타내는 배열입니다.

예를 들어, 위 `exec` 메시지에 대한 응답은 다음과 같을 수 있습니다:

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

결과 집합을 반환하지 않는 SQL 문의 경우, `results` 값은 해당 문 실행으로 영향을 받은 행의 수를 나타내는 숫자를 포함하는 단일 행/열이어야 합니다.

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 예시

*   [SQLDelight의 SQL.js 워커](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)