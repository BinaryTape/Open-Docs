## 概要

Koogは、`AIAgentStorage`を使用してデータを保存および受け渡す方法を提供します。これは、異なるノード間やサブグラフ間でもデータを渡すための型安全な方法として設計されたキーバリューストレージ（key-value storage）システムです。

ストレージは、エージェントノードで使用可能な`storage`プロパティ（`storage: AIAgentStorage`）を介してアクセスでき、AIエージェントシステムの異なるコンポーネント間でシームレスなデータ共有を可能にします。

## キーと値の構造

キーバリューデータのストレージ構造は、`AIAgentStorageKey`データクラスに依存しています。`AIAgentStorageKey`の詳細については、以下のセクションを参照してください。

### AIAgentStorageKey

ストレージは、データの保存と取得時に型安全性を確保するために、型指定されたキーシステムを使用します。

- `AIAgentStorageKey<T>`: データの識別とアクセスに使用されるストレージキーを表すデータクラスです。`AIAgentStorageKey`クラスの主な特徴は以下の通りです。
    - ジェネリック型パラメータ`T`は、このキーに関連付けられたデータの型を指定し、型安全性を確保します。
    - 各キーには、ストレージキーを一意に表す文字列識別子である`name`プロパティがあります。

## 使用例

以下のセクションでは、ストレージキーを作成し、それを使用してデータを保存および取得する実際の例を示します。

### データを表すクラスの定義

データを保存して受け渡すための最初のステップは、そのデータを表すクラスを作成することです。以下は、基本的なユーザーデータを持つ単純なクラスの例です。

```kotlin
class UserData(
   val name: String,
   val age: Int
)
```
<!--- KNIT example-data-transfer-between-nodes-01.kt -->

定義が完了したら、以下で説明するように、このクラスを使用してストレージキーを作成します。

### ストレージキーの作成

定義したデータ構造に対して、型指定されたストレージキーを作成します。

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

`createStorageKey`関数は、キーを一意に識別する単一の文字列パラメータを受け取ります。

### データの保存

作成したストレージキーを使用してデータを保存するには、ノード内で`storage.set(key: AIAgentStorageKey<T>, value: T)`メソッドを使用します。

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

`AIAgentStorage`クラスに関する完全なリファレンスについては、[AIAgentStorage](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage)を参照してください。

`AIAgentStorage`クラスで使用可能な個々の関数については、以下のAPIリファレンスを参照してください。

- [clear](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.clear)
- [get](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.get)
- [getValue](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.getValue)
- [putAll](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.putAll)
- [remove](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.remove)
- [set](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.set)
- [toMap](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.toMap)

## 追加情報

- `AIAgentStorage`はスレッドセーフであり、同時アクセスが適切に処理されるようにMutex（ミューテックス）を使用しています。
- ストレージは、`Any`を継承する任意の型で動作するように設計されています。
- 値を取得する際、型キャストは自動的に処理され、アプリケーション全体で型安全性が確保されます。
- 値への非nullアクセスには、キーが存在しない場合に例外をスローする`getValue`メソッドを使用します。
- `clear`メソッドを使用すると、ストレージを完全にクリアし、保存されているすべてのキーと値のペアを削除できます。