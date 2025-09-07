## 概述

Koog 提供了一种使用 `AIAgentStorage` 存储和传递数据的方式。`AIAgentStorage` 是一个键值存储系统，旨在以类型安全的方式在不同节点甚至子图之间传递数据。

存储可通过代理节点中可用的 `storage` 属性（`storage: AIAgentStorage`）访问，从而实现 AI 代理系统不同组件之间数据的无缝共享。

## 键值结构

键值数据存储结构依赖于 `AIAgentStorageKey` 数据类。有关 `AIAgentStorageKey` 的更多信息，请参阅以下章节。

### AIAgentStorageKey

该存储使用类型化键系统，以确保在存储和检索数据时的类型安全：

- `AIAgentStorageKey<T>`：一个数据类，表示用于识别和访问数据的存储键。`AIAgentStorageKey` 类主要特性如下：
    - 泛型类型参数 `T` 指定与此键关联的数据类型，确保类型安全。
    - 每个键都有一个 `name` 属性，它是一个唯一标识存储键的字符串标识符。

## 使用示例

以下章节提供了一个创建存储键以及使用它来存储和检索数据的实际示例。

### 定义表示数据的类

存储您想要传递的数据的第一步是创建表示数据的类。以下是一个包含基本用户数据的简单类示例：

```kotlin
class UserData(
   val name: String,
   val age: Int
)
```
<!--- KNIT example-data-transfer-between-nodes-01.kt -->

定义后，请按照如下所述使用该类创建存储键。

### 创建存储键

为已定义的数据结构创建类型化的存储键：

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

`createStorageKey` 函数接受一个唯一标识该键的字符串形参。

### 存储数据

要在节点中使用创建的存储键保存数据，请使用 `storage.set(key: AIAgentStorageKey<T>, value: T)` 方法：

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

### 检索数据

要在节点中检索数据，请使用 `storage.get` 方法：

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

## API 文档

有关 `AIAgentStorage` 类的完整参考，请参见 [AIAgentStorage](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/index.html)。

有关 `AIAgentStorage` 类中可用的各个函数，请参见以下 API 参考：

- [clear](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/clear.html)
- [get](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/get.html)
- [getValue](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/get-value.html)
- [putAll](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/put-all.html)
- [remove](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/remove.html)
- [set](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/set.html)
- [toMap](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/to-map.html)

## 附加信息

- `AIAgentStorage` 是线程安全的，它使用 `Mutex` 来确保并发访问得到正确处理。
- 该存储旨在与任何扩展 `Any` 的类型配合使用。
- 检索值时，类型转换会自动处理，确保整个应用程序的类型安全。
- 对于值的非空访问，请使用 `getValue` 方法，如果键不存在，该方法将抛出异常。
- 您可以使用 `clear` 方法完全清空存储，该方法会移除所有存储的键值对。