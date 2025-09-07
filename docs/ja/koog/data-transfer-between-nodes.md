## 概要

Koogは、`AIAgentStorage`を使用してデータを保存および渡す方法を提供します。これは、異なるノード間やサブグラフ間でもデータを渡せるように設計された、型安全なキーバリュー型ストレージシステムです。

このストレージは、エージェントノードで利用できる`storage`プロパティ（`storage: AIAgentStorage`）を通じてアクセスでき、AIエージェントシステムの様々なコンポーネント間でシームレスなデータ共有を可能にします。

## キーと値の構造

キーバリューデータストレージの構造は、`AIAgentStorageKey`データクラスに基づいています。`AIAgentStorageKey`の詳細については、以下のセクションを参照してください。

### AIAgentStorageKey

このストレージは、データの保存と取得の際に型安全性を保証するために、型付けされたキーシステムを使用しています。

- `AIAgentStorageKey<T>`: データの識別とアクセスに使用されるストレージキーを表すデータクラスです。`AIAgentStorageKey`クラスの主要な特徴は以下の通りです。
    - 総称型パラメーター`T`は、このキーに関連付けられたデータの型を指定し、型安全性を保証します。
    - 各キーには、ストレージキーを一意に表現する文字列識別子である`name`プロパティがあります。

## 使用例

以下のセクションでは、ストレージキーを作成し、それを使用してデータを保存および取得する実際の例を提供します。

### データを表すクラスの定義

渡したいデータを保存する際の最初のステップは、そのデータを表すクラスを作成することです。以下は、基本的なユーザーデータを持つシンプルなクラスの例です。

```kotlin
class UserData(
   val name: String,
   val age: Int
)
```
<!--- KNIT example-data-transfer-between-nodes-01.kt -->

一度定義したら、以下に説明するように、そのクラスを使用してストレージキーを作成します。

### ストレージキーの作成

定義されたデータ構造に対して、型付けされたストレージキーを作成します。

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.createStorageKey

class UserData(
    val name: String,
    val age: Int
)

fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
val userDataKey = createStorageKey<UserData>("user-data")
```
<!--- KNIT example-data-transfer-between-nodes-02.kt -->

`createStorageKey`関数は、キーを一意に識別する単一の文字列パラメーターを受け取ります。

### データの保存

作成されたストレージキーを使用してデータを保存するには、ノード内で`storage.set(key: AIAgentStorageKey<T>, value: T)`メソッドを使用します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.agent.entity.createStorageKey

class UserData(
   val name: String,
   val age: Int
)

fun main() {
    val userDataKey = createStorageKey<UserData>("user-data")

    val str = strategy<Unit, Unit>("my-strategy") {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val nodeSaveData by node<Unit, Unit> {
    storage.set(userDataKey, UserData("John", 26))
}
```
<!--- KNIT example-data-transfer-between-nodes-03.kt -->

### データの取得

データを取得するには、ノード内で`storage.get`メソッドを使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.createStorageKey
import ai.koog.agents.core.dsl.builder.strategy

class UserData(
    val name: String,
    val age: Int
)

fun main() {
    val userDataKey = createStorageKey<UserData>("user-data")

    val str = strategy<String, Unit>("my-strategy") {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val nodeRetrieveData by node<String, Unit> { message ->
    storage.get(userDataKey)?.let { userFromStorage ->
        println("Hello dear $userFromStorage, here's a message for you: $message")
    }
}
```
<!--- KNIT example-data-transfer-between-nodes-04.kt -->

## APIドキュメント

`AIAgentStorage`クラスに関する完全なリファレンスについては、[AIAgentStorage](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/index.html)を参照してください。

`AIAgentStorage`クラスで利用可能な個々の関数については、以下のAPIリファレンスを参照してください。

- [clear](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/clear.html)
- [get](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/get.html)
- [getValue](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/get-value.html)
- [putAll](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/put-all.html)
- [remove](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/remove.html)
- [set](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/set.html)
- [toMap](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/to-map.html)

## 追加情報

- `AIAgentStorage`はスレッドセーフであり、ミューテックス（Mutex）を使用して同時アクセスが適切に処理されることを保証します。
- このストレージは、`Any`を拡張する任意の型と連携するように設計されています。
- 値を取得する際、型キャストは自動的に処理され、アプリケーション全体で型安全性が保証されます。
- 非null値へのアクセスには、キーが存在しない場合に例外をスローする`getValue`メソッドを使用します。
- `clear`メソッドを使用すると、ストレージに保存されているすべてのキーバリューペアが削除され、ストレージ全体をクリアできます。