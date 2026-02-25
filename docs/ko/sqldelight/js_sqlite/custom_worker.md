# 커스텀 워커 구현하기

SQLDelight 웹 워커(web worker)는 웹 워커 드라이버(web worker driver)로부터 수신되는 메시지를 받고, 해당 메시지를 사용해 SQL 연산을 실행한 후, 쿼리 결과에 따라 적절히 응답하는 스크립트입니다.

웹 워커는 스크립트가 비교적 짧고 간단하기 때문에 순수 자바스크립트(plain JavaScript)로 구현하는 것이 가장 쉽습니다.

## 수신 메시지 (Incoming Messages)

웹 워커 드라이버 메시지 형식은 SQLDelight가 특정 SQL dialect나 구현에 얽매이지 않고 일반적인 방식으로 워커 구현체와 통신할 수 있게 해줍니다. 모든 메시지에는 네 가지 동작 중 하나를 지정하는 `action` 속성이 포함됩니다.

### `exec`

이 동작은 워커가 메시지에 첨부된 SQL 문을 실행하고 SQL 쿼리 결과와 함께 응답해야 함을 나타냅니다. 메시지에는 실행할 SQL 문이 담긴 `sql` 속성과, 문에 바인딩될 매개변수들을 담은 `params` 배열이 포함됩니다.

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

워커에게 트랜잭션을 시작하도록 지시합니다.

메시지 예시:
```json
{
  "id": 2,
  "action": "begin_transaction"
}
```

### `end_transaction`

워커에게 현재 트랜잭션을 종료하도록 지시합니다.

메시지 예시:
```json
{
  "id": 3,
  "action": "end_transaction"
}
```

### `rollback_transaction`

워커에게 현재 트랜잭션을 롤백하도록 지시합니다.

메시지 예시:
```json
{
  "id": 8,
  "action": "rollback_transaction"
}
```

## 메시지에 응답하기

모든 수신 메시지에는 해당 메시지의 고유한 정수 값인 `id` 속성이 포함되어 있습니다. 메시지에 응답할 때 워커 구현체는 응답 메시지에 이 `id` 값을 반드시 포함해야 합니다. 이는 웹 워커 드라이버가 응답을 올바르게 처리하기 위해 사용됩니다.

### `results` 속성

응답 메시지에는 `results` 속성도 포함되어야 합니다. 이는 SQL 실행 결과, 특히 쿼리의 결과 집합(result set)을 전달하는 데 사용됩니다. `results` 속성은 결과의 *행(rows)*을 나타내는 배열이어야 하며, 각 항목은 결과 집합의 *열(columns)*을 나타내는 배열입니다.

예를 들어, 위 `exec` 메시지에 대한 응답은 다음과 같을 수 있습니다.

```json
{
  "id": 5,
  "results": [
    ["value", "this is the content of column_b"],
    ["value", "this is a different row"]
  ]
}
```

결과 집합을 반환하지 않는 SQL 문의 경우, `results` 값은 해당 문 실행으로 영향을 받은 행의 수를 나타내는 숫자가 포함된 단일 행/열을 가져야 합니다.

```json
{
  "id": 10,
  "results": [ [1] ]
}
```

## 예제

* [SQLDelight의 SQL.js 워커](https://github.com/cashapp/sqldelight/blob/master/drivers/web-worker-driver/sqljs/sqljs.worker.js)