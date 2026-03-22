## 概览

Koog 提供了一种使用 `AIAgentStorage` 存储和传递数据的方式。这是一个键值存储系统，旨在作为一种类型安全的方式在不同节点甚至子图之间传递数据。

可通过代理节点中的 `storage` 属性（`storage: AIAgentStorage`）访问该存储，从而在 AI 代理系统的不同组件之间实现无缝的数据共享。

## 键值结构

键值数据存储结构依赖于 `AIAgentStorageKey` 数据类。有关 `AIAgentStorageKey` 的更多信息，请参阅以下部分。

### AIAgentStorageKey

该存储使用类型化的键系统，以在存储和检索数据时提供类型安全性。

`AIAgentStorageKey<T>` 数据类代表用于标识和访问数据的存储键。以下是该类的主要特性：

- 泛型类型形参 `T` 指定了与此键关联的数据类型，从而提供类型安全性。

- 每个键都有一个 `name` 属性，这是一个字符串标识符，用于更轻松地进行识别和调试。

- 每个键实例都是唯一的。`name` 不用于确定唯一性，因此可以拥有多个具有相同名称的键。这允许重复使用现有的策略组件，而不会面临意外覆盖存储中数据的风险。

## 使用示例

以下部分提供了创建存储键并使用它来存储和检索数据的实际示例。

### 定义代表数据的类

存储想要传递的数据的第一步是创建一个代表该数据的类。下面是一个包含基本用户数据的简单类示例：

=== "Kotlin"

    ```kotlin
    class UserData(
       val name: String,
       val age: Int
    )
    ```
    <!--- KNIT example-data-transfer-between-nodes-01.kt -->

=== "Java"

    ```java
    record UserData(
        String name,
        int age
    ) {}
    ```
    <!--- KNIT exampleDataTransferBetweenNodesJava01.java -->

定义完成后，请按照下文所述使用该类创建存储键。

### 创建存储键

为定义的数据结构创建一个类型化的存储键：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.createStorageKey
    class UserData(
        val name: String,
        val age: Int
    )
    -->
    ```kotlin
    val userDataKey = createStorageKey<UserData>("user-data")
    ```
    <!--- KNIT example-data-transfer-between-nodes-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentStorage;
    import ai.koog.agents.core.agent.entity.AIAgentStorageKey;
    class exampleDataTransferBetweenNodesJava02 {
        record UserData(
            String name,
            int age
        ) {}
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    AIAgentStorageKey<UserData> userDataKey = AIAgentStorage.createStorageKey("user-data");
    ```
    <!--- KNIT exampleDataTransferBetweenNodesJava02.java -->

`createStorageKey` 函数接受一个唯一标识该键的字符串参数。

### 存储数据

要使用创建的存储键保存数据，请在节点中使用 `storage.set(key: AIAgentStorageKey<T>, value: T)` 方法：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.agent.entity.createStorageKey
    class UserData(
       val name: String,
       val age: Int
    )
    val userDataKey = createStorageKey<UserData>("user-data")
    -->
    ```kotlin
    val nodeSaveData by node<Unit, Unit> {
        storage.set(userDataKey, UserData("John", 26))
    }
    ```
    <!--- KNIT example-data-transfer-between-nodes-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentStorage;
    import ai.koog.agents.core.agent.entity.AIAgentStorageKey;
    public class exampleDataTransferBetweenNodesJava03 {
        record UserData(
            String name,
            int age
        ) {}
        public static void main(String[] args) {
            AIAgentStorageKey<UserData> userDataKey = AIAgentStorage.createStorageKey("user-data");
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var nodeSaveData = AIAgentNode.builder("nodeSaveData")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            ctx.getStorage().set(userDataKey, new UserData("John", 26));
            return "";
        })
        .build();
    ```
    <!--- KNIT exampleDataTransferBetweenNodesJava03.java -->

### 检索数据

要检索数据，请在节点中使用 `storage.get` 方法：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.createStorageKey
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentStorage;
    import ai.koog.agents.core.agent.entity.AIAgentStorageKey;
    public class exampleDataTransferBetweenNodesJava04 {
        record UserData(
            String name,
            int age
        ) {}
        public static void main(String[] args) {
            AIAgentStorageKey<UserData> userDataKey = AIAgentStorage.createStorageKey("user-data");
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var nodeRetrieveData = AIAgentNode.builder("nodeRetrieveData")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((message, ctx) -> {
            var userData = ctx.getStorage().get(userDataKey);
            System.out.println("Hello dear %s, here's a message for you: %s".formatted(userData, message));
            return "";
        })
        .build();
    ```
    <!--- KNIT exampleDataTransferBetweenNodesJava04.java -->

## API 文档

有关 `AIAgentStorage` 类的完整参考，请参阅 [AIAgentStorage](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage)。

有关 `AIAgentStorage` 类中可用的各个函数，请参阅以下 API 参考：

- [clear](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.clear)
- [get](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.get)
- [getValue](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.getValue)
- [putAll](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.putAll)
- [remove](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.remove)
- [set](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.set)
- [toMap](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.toMap)

## 附加信息

- `AIAgentStorage` 是线程安全的，使用 Mutex 确保正确处理并发访问。
- 检索值时，类型转换会自动处理，从而确保整个应用程序的类型安全性。
- 对于非可空的值访问，请使用 `getValue` 方法，如果键不存在，该方法将抛出异常。
- 您可以使用 `clear` 方法完全清除存储，这将移除所有存储的键值对。