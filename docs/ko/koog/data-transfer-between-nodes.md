## 개요

Koog는 `AIAgentStorage`를 사용하여 데이터를 저장하고 전달하는 방법을 제공합니다. 이는 서로 다른 노드나 서브그래프 간에 데이터를 전달하기 위해 타입 안전(type-safe)한 방식으로 설계된 키-값 스토리지 시스템입니다.

이 스토리지는 에이전트 노드에서 사용할 수 있는 `storage` 속성(`storage: AIAgentStorage`)을 통해 접근할 수 있으며, AI 에이전트 시스템의 서로 다른 컴포넌트 간에 원활한 데이터 공유를 가능하게 합니다.

## 키 및 값 구조

키-값 데이터 스토리지 구조는 `AIAgentStorageKey` 데이터 클래스에 의존합니다. `AIAgentStorageKey`에 대한 자세한 내용은 아래 섹션을 참조하세요.

### AIAgentStorageKey

스토리지 내에서 데이터를 저장하고 검색할 때 타입 안전성을 보장하기 위해 타입화된 키 시스템을 사용합니다.

`AIAgentStorageKey<T>` 클래스는 데이터 식별 및 접근에 사용되는 스토리지 키를 나타냅니다. 이 클래스의 주요 특징은 다음과 같습니다.

- 제네릭 타입 파라미터 `T`는 이 키와 연관된 데이터의 타입을 지정하여 타입 안전성을 보장합니다.

- 각 키에는 식별과 디버깅을 용이하게 하기 위한 문자열 식별자인 `name` 속성이 있습니다.

- 각 키 인스턴스는 고유합니다. `name`은 고유성을 결정하는 데 사용되지 않으므로, 이름이 같은 키를 여러 개 가질 수 있습니다. 이를 통해 스토리지의 데이터를 실수로 덮어쓸 위험 없이 기존 전략(strategy) 컴포넌트를 재사용할 수 있습니다.

## 사용 예제

다음 섹션에서는 스토리지 키를 생성하고 이를 사용하여 데이터를 저장 및 검색하는 실제 예제를 제공합니다.

### 데이터를 나타내는 클래스 정의

전달하고자 하는 데이터를 저장하는 첫 번째 단계는 해당 데이터를 나타내는 클래스를 생성하는 것입니다. 다음은 기본적인 사용자 데이터를 포함하는 단순한 클래스의 예입니다.

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

클래스를 정의한 후, 아래 설명에 따라 스토리지 키를 생성하는 데 사용합니다.

### 스토리지 키 생성

정의된 데이터 구조에 대한 타입화된 스토리지 키를 생성합니다.

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
    import ai.koog.serialization.TypeToken;
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
    AIAgentStorageKey<UserData> userDataKey = AIAgentStorage.createStorageKey("user-data", TypeToken.of(UserData.class));
    ```
    <!--- KNIT exampleDataTransferBetweenNodesJava02.java -->

`createStorageKey` 함수는 식별 및 디버깅 목적으로 사용되는 문자열 파라미터와 값 타입을 나타내는 `TypeToken`을 인자로 받습니다 (Java의 경우이며, Kotlin은 reified 제네릭을 자동으로 사용합니다).

### 데이터 저장

생성된 스토리지 키를 사용하여 데이터를 저장하려면 노드 내에서 `storage.set(key: AIAgentStorageKey<T>, value: T)` 메서드를 사용합니다.

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
    import ai.koog.serialization.TypeToken;
    public class exampleDataTransferBetweenNodesJava03 {
        record UserData(
            String name,
            int age
        ) {}
        public static void main(String[] args) {
            AIAgentStorageKey<UserData> userDataKey = AIAgentStorage.createStorageKey("user-data", TypeToken.of(UserData.class));
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

### 데이터 검색

데이터를 검색하려면 노드 내에서 `storage.get` 메서드를 사용합니다.

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
    import ai.koog.serialization.TypeToken;
    public class exampleDataTransferBetweenNodesJava04 {
        record UserData(
            String name,
            int age
        ) {}
        public static void main(String[] args) {
            AIAgentStorageKey<UserData> userDataKey = AIAgentStorage.createStorageKey("user-data", TypeToken.of(UserData.class));
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

## API 문서

`AIAgentStorage` 클래스와 관련된 전체 참조는 [AIAgentStorage](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage)를 확인하세요.

`AIAgentStorage` 클래스에서 사용할 수 있는 개별 함수에 대해서는 다음 API 참조를 확인하세요.

- [clear](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.clear)
- [get](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.get)
- [getValue](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.getValue)
- [putAll](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.putAll)
- [remove](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.remove)
- [set](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.set)
- [toMap](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.toMap)

## 추가 정보

- `AIAgentStorage`는 스레드 안전(thread-safe)하며, Mutex를 사용하여 동시성 액세스가 올바르게 처리되도록 보장합니다.
- 값을 검색할 때 타입 캐스팅이 자동으로 처리되어 애플리케이션 전반에서 타입 안전성을 보장합니다.
- null을 허용하지 않는 값 액세스를 위해 `getValue` 메서드를 사용하세요. 키가 존재하지 않으면 예외가 발생합니다.
- 모든 저장된 키-값 쌍을 제거하는 `clear` 메서드를 사용하여 스토리지를 완전히 비울 수 있습니다.