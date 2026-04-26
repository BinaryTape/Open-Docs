## 概要

Koogは、`AIAgentStorage`を使用してデータを保存および受け渡す方法を提供します。これは、異なるノード間やサブグラフ間でもデータを渡すための型安全な方法として設計されたキーバリューストレージ（key-value storage）システムです。

ストレージは、エージェントノードで使用可能な`storage`プロパティ（`storage: AIAgentStorage`）を介してアクセスでき、AIエージェントシステムの異なるコンポーネント間でシームレスなデータ共有を可能にします。

## キーと値の構造

キーバリューデータのストレージ構造は、`AIAgentStorageKey`データクラスに依存しています。`AIAgentStorageKey`の詳細については、以下のセクションを参照してください。

### AIAgentStorageKey

ストレージは、データの保存と取得時に型安全性を確保するために、型指定されたキーシステムを使用します。

`AIAgentStorageKey<T>`クラスは、データの識別とアクセスに使用されるストレージキーを表します。このクラスの主な特徴は以下の通りです。

- ジェネリック型パラメータ`T`は、このキーに関連付けられたデータの型を指定し、型安全性を確保します。

- 各キーには、識別やデバッグを容易にするための文字列識別子である`name`プロパティがあります。

- 各キーインスタンスは一意です。`name`は一意性を判断するためには使用されないため、同じ名前のキーを複数持つことができます。これにより、ストレージ内のデータを誤って上書きするリスクなく、既存のストラテジー（Strategy）コンポーネントを再利用できます。

## 使用例

以下のセクションでは、ストレージキーを作成し、それを使用してデータを保存および取得する実際の例を示します。

### データを表すクラスの定義

データを保存して受け渡すための最初のステップは、そのデータを表すクラスを作成することです。以下は、基本的なユーザーデータを持つ単純なクラスの例です。

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

定義が完了したら、以下で説明するように、このクラスを使用してストレージキーを作成します。

### ストレージキーの作成

定義したデータ構造に対して、型指定されたストレージキーを作成します。

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

`createStorageKey`関数は、識別やデバッグの目的で使用される単一の文字列パラメータを受け取ります。

### データの保存

作成したストレージキーを使用してデータを保存するには、ノード内で`storage.set(key: AIAgentStorageKey<T>, value: T)`メソッドを使用します。

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

### データの取得

データを取得するには、ノード内で`storage.get`メソッドを使用します。

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
- 値を取得する際、型キャストは自動的に処理され、アプリケーション全体で型安全性が確保されます。
- 値への非nullアクセスには、キーが存在しない場合に例外をスローする`getValue`メソッドを使用します。
- `clear`メソッドを使用すると、ストレージを完全にクリアし、保存されているすべてのキーと値のペアを削除できます。