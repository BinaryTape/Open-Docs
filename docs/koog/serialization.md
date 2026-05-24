# 序列化

## 简介

Koog 使用了一个轻量级的、与库无关的序列化层，用于在 JSON 与工具实参 (argument) 及结果之间进行转换。
该层位于代理运行时与底层序列化库之间，因此你可以在不更改任何工具或代理代码的情况下更换库。

除了工具之外，序列化层还被 **Persistence**（持久化）等代理功能用于序列化和反序列化节点输入与输出。

默认情况下，Koog 使用 `KotlinxSerializer`（由 kotlinx-serialization 提供支持）。
在 JVM 上，你也可以切换到 `JacksonSerializer`（由 jackson-databind 提供支持）。

## `JSONSerializer` 接口

`JSONSerializer` 是位于 `serialization-core` 中的核心抽象。
该接口具有四个主要方法（针对字符串和 `JSONElement` 的编码/解码），以及两个用于在 `JSONElement` 与字符串之间转换的便捷方法：

- `encodeToString` / `decodeFromString` — 将类型化值序列化为 JSON 字符串或从其反序列化。
- `encodeToJSONElement` / `decodeFromJSONElement` — 将类型化值序列化为 `JSONElement` 树或从其反序列化。
- `encodeJSONElementToString` / `decodeJSONElementFromString` — 在 `JSONElement` 与其字符串形式之间进行转换。

以下示例展示了所有关键操作：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.JSONElement
    import ai.koog.serialization.JSONSerializer
    import ai.koog.serialization.kotlinx.KotlinxSerializer
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    @Serializable
    data class User(val name: String, val age: Int)

    val serializer: JSONSerializer = KotlinxSerializer()

    // 将 data class 编码为 JSON 字符串
    val json: String = serializer.encodeToString(User("Alice", 30), typeToken<User>())

    // 将 JSON 字符串解码回 data class
    val user: User = serializer.decodeFromString(json, typeToken<User>())

    // 编码为 JSONElement 树
    val element: JSONElement = serializer.encodeToJSONElement(user, typeToken<User>())

    // 从 JSONElement 树解码
    val userFromElement: User = serializer.decodeFromJSONElement(element, typeToken<User>())

    // 在 JSONElement 与原始 JSON 字符串之间转换
    val jsonString = """{"key": "value"}"""
    val jsonElement: JSONElement = serializer.decodeJSONElementFromString(jsonString)
    val backToString: String = serializer.encodeJSONElementToString(jsonElement)
    ```
    <!--- KNIT example-serialization-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.serialization.JSONElement;
    import ai.koog.serialization.TypeToken;
    import ai.koog.serialization.jackson.JacksonSerializer;
    import com.fasterxml.jackson.annotation.JsonProperty;
    public class exampleSerializationJava01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Jackson 可序列化类
    record User(
        @JsonProperty("name") String name,
        @JsonProperty("age") int age
    ) {}

    var serializer = new JacksonSerializer();

    // 将 data class 编码为 JSON 字符串
    String json = serializer.encodeToString(new User("Alice", 30), TypeToken.of(User.class));

    // 将 JSON 字符串解码回 data class
    User user = serializer.decodeFromString(json, TypeToken.of(User.class));

    // 编码为 JSONElement 树
    JSONElement element = serializer.encodeToJSONElement(user, TypeToken.of(User.class));

    // 从 JSONElement 树解码
    User userFromElement = serializer.decodeFromJSONElement(element, TypeToken.of(User.class));

    // 在 JSONElement 与原始 JSON 字符串之间转换
    String jsonString = "{\"key\": \"value\"}";
    JSONElement jsonElement = serializer.decodeJSONElementFromString(jsonString);
    String backToString = serializer.encodeJSONElementToString(jsonElement);
    ```
    <!--- KNIT exampleSerializationJava01.java -->

## Type token

`TypeToken` 是 Koog 在运行时传递类型信息的方式。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.typeToken
    -->
    ```kotlin
    data class MyClass(val value: String)

    // 内联具体化 (Inline reified) —— Kotlin 中的首选方式
    val tokenReified = typeToken<MyClass>()

    // 通过 KClass 获取（当没有具体化类型形参可用时）
    val tokenKClass = typeToken(MyClass::class)

    // 泛型类型 —— 在运行时保留类型实参
    val tokenGeneric = typeToken<List<String>>()
    ```
    <!--- KNIT example-serialization-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.serialization.TypeCapture;
    import ai.koog.serialization.TypeToken;
    import java.util.List;
    public class exampleSerializationJava02 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    record MyClass(
        String value
    ) {}

    // 简单类
    TypeToken tokenClass = TypeToken.of(MyClass.class);

    // 泛型类型 —— 使用 TypeCapture 来保留类型实参
    TypeToken tokenGeneric = TypeToken.of(new TypeCapture<List<String>>() {});
    ```
    <!--- KNIT exampleSerializationJava02.java -->

## `JSONElement` — 与库无关的 JSON 树

`JSONElement` 是 JSON 数据的一种中立中间表示。
它的存在是为了使序列化器、工具和代理内部机制不依赖于特定库中的特定 JSON 类型。

### 层次结构

```
JSONElement
├── JSONObject   – 键值对 (entries: Map<String, JSONElement>)
├── JSONArray    – 有序列表 (elements: List<JSONElement>)
└── JSONPrimitive
    ├── JSONLiteral  – 字符串、数字或布尔值
    └── JSONNull     – JSON null 单例
```
<!--- KNIT example-serialization-01.txt -->

### 与库类型之间的转换

每个序列化集成都提供了扩展函数，允许你在 `JSONElement` 与库自身的动态 JSON 类型之间进行转换。当你已经拥有 `JsonElement` 或 `JsonNode` 并希望将其传递给 Koog（或反之亦然），而不经过完整的编码/解码周期时，这非常有用。
下文针对每个受支持的库提供了示例。

### 构建和读取元素

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.JSONArray
    import ai.koog.serialization.JSONLiteral
    import ai.koog.serialization.JSONNull
    import ai.koog.serialization.JSONObject
    import ai.koog.serialization.JSONPrimitive
    -->

    ```kotlin
    val obj = JSONObject(
        mapOf(
            "name" to JSONPrimitive("Alice"),
            "age" to JSONPrimitive(30),
            "active" to JSONPrimitive(true),
        )
    )

    val arr = JSONArray(listOf(JSONPrimitive(1), JSONPrimitive(2), JSONPrimitive(3)))

    // 从对象中读取值
    val nameContent: String = (obj.entries["name"] as JSONPrimitive).content  // "Alice"
    val age: Int? = (obj.entries["age"] as JSONPrimitive).intOrNull // 30
    ```
    <!--- KNIT example-serialization-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.serialization.JSONArray;
    import ai.koog.serialization.JSONObject;
    import ai.koog.serialization.JSONPrimitive;
    import java.util.List;
    import java.util.Map;
    public class exampleSerializationJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    JSONObject obj = new JSONObject(
        Map.of(
            "name", JSONPrimitive.of("Alice"),
            "age", JSONPrimitive.of(30),
            "active", JSONPrimitive.of(true)
        )
    );

    JSONArray arr = new JSONArray(List.of(JSONPrimitive.of(1), JSONPrimitive.of(2), JSONPrimitive.of(3)));

    // 从对象中读取值
    String nameContent = ((JSONPrimitive) obj.getEntries().get("name")).getContent();  // "Alice"
    Integer age = ((JSONPrimitive) obj.getEntries().get("age")).getIntOrNull(); // 30
    ```
    <!--- KNIT exampleSerializationJava03.java -->

## 受支持的序列化器

### `KotlinxSerializer`（默认）

- **模块**: `ai.koog:serialization-core`（通过 `ai.koog:agents-core` 传递包含）
- **支持库**: kotlinx-serialization

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.kotlinx.KotlinxSerializer
    import kotlinx.serialization.json.Json
    -->

    ```kotlin
    // 默认实例 —— 使用 Json.Default
    val defaultSerializer = KotlinxSerializer()

    // 自定义 Json 配置
    val customSerializer = KotlinxSerializer(
        json = Json {
            ignoreUnknownKeys = true
            prettyPrint = true
        }
    )
    ```

    <!--- KNIT example-serialization-04.kt -->

你也可以在 Koog 的 `JSONElement` 与 kotlinx-serialization 的 `JsonElement` 之间进行转换

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.JSONElement
    import ai.koog.serialization.JSONObject
    import ai.koog.serialization.JSONPrimitive
    import ai.koog.serialization.kotlinx.toKoogJSONElement
    import ai.koog.serialization.kotlinx.toKotlinxJsonElement
    import kotlinx.serialization.json.JsonElement
    -->
    ```kotlin
    val koogJson: JSONElement = JSONObject(
        mapOf(
            "key" to JSONPrimitive("value")
        )
    )

    // 转换为 kotlinx-serialization 动态 JSON 实例
    val kotlinxJson: JsonElement = koogJson.toKotlinxJsonElement()

    // 转换为 Koog 动态 JSON 实例
    val koogJsonConverted: JSONElement = kotlinxJson.toKoogJSONElement()
    ```
    <!--- KNIT example-serialization-05.kt -->

### `JacksonSerializer`（仅限 JVM）

- **模块**: `ai.koog:serialization-jackson`（独立依赖项）
- **支持库**: jackson-databind

将依赖项添加到你的 `build.gradle.kts`：

```kts
dependencies {
    implementation("ai.koog:serialization-jackson:<version>")
}
```
<!--- KNIT example-serialization-02.txt -->

然后创建序列化器：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.jackson.JacksonSerializer
    import com.fasterxml.jackson.databind.DeserializationFeature
    import com.fasterxml.jackson.databind.ObjectMapper
    -->

    ```kotlin
    // 默认实例 —— 使用预注册了 JSONElementModule 的全新 ObjectMapper
    val defaultSerializer = JacksonSerializer()

    // 自定义 ObjectMapper 配置
    val customSerializer = JacksonSerializer(
        objectMapper = ObjectMapper().apply {
            configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        }
    )
    ```
    <!--- KNIT example-serialization-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.serialization.jackson.JacksonSerializer;
    import com.fasterxml.jackson.databind.DeserializationFeature;
    import com.fasterxml.jackson.databind.ObjectMapper;
    public class exampleSerializationJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 默认实例 —— 使用预注册了 JSONElementModule 的全新 ObjectMapper
    var defaultSerializer = new JacksonSerializer();

    // 自定义 ObjectMapper 配置
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    var customSerializer = new JacksonSerializer(objectMapper);
    ```
    <!--- KNIT exampleSerializationJava04.java -->

!!! note
    `JacksonSerializer` 会自动在其使用的 `ObjectMapper` 上注册 `JSONElementModule`，以便正确序列化/反序列化 `JSONElement` 类型。

你也可以在 Koog 的 `JSONElement` 与 Jackson 的 `JsonNode` 之间进行转换

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.JSONElement
    import ai.koog.serialization.JSONObject
    import ai.koog.serialization.JSONPrimitive
    import ai.koog.serialization.jackson.toJacksonJsonNode
    import ai.koog.serialization.jackson.toKoogJSONElement
    import com.fasterxml.jackson.databind.JsonNode
    -->
    ```kotlin
    val koogJson: JSONElement = JSONObject(
        mapOf(
            "key" to JSONPrimitive("value")
        )
    )

    // 转换为 Jackson 动态 JSON 实例
    val jacksonJson: JsonNode = koogJson.toJacksonJsonNode()

    // 转换为 Koog 动态 JSON 实例
    val koogJsonConverted: JSONElement = jacksonJson.toKoogJSONElement()
    ```
    <!--- KNIT example-serialization-07.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.serialization.JSONElement;
    import ai.koog.serialization.JSONObject;
    import ai.koog.serialization.JSONPrimitive;
    import ai.koog.serialization.jackson.JacksonJSONElementMappers;
    import com.fasterxml.jackson.databind.JsonNode;
    import java.util.Map;
    public class exampleSerializationJava05 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    JSONElement koogJson = new JSONObject(
        Map.of(
            "key", JSONPrimitive.of("value")
        )
    );

    // 转换为 Jackson 动态 JSON 实例
    JsonNode jacksonJson = JacksonJSONElementMappers.toJacksonJsonNode(koogJson);

    // 转换为 Koog 动态 JSON 实例
    JSONElement koogJsonConverted = JacksonJSONElementMappers.toKoogJSONElement(jacksonJson);
    ```
    <!--- KNIT exampleSerializationJava05.java -->

## 在 `AIAgentConfig` 中配置序列化器

=== "Kotlin" 

    构造 `AIAgentConfig` 时传递 `serializer` 形参。
    如果省略，则默认使用 `KotlinxSerializer`。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.serialization.jackson.JacksonSerializer
    -->

    ```kotlin
    val agentConfig = AIAgentConfig(
        prompt = prompt("assistant") {
            system("You are a helpful assistant.")
        },
        model = OpenAIModels.Chat.GPT4o,
        maxAgentIterations = 10,
        serializer = JacksonSerializer()
    )
    ```

    <!--- KNIT example-serialization-08.kt -->

=== "Java"

    构造 `AIAgentConfig` 时传递 `serializer` 形参。
    如果省略，则默认使用 `JacksonSerializer`。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.config.AIAgentConfig;
    import ai.koog.prompt.Prompt;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.serialization.jackson.JacksonSerializer;
    public class exampleSerializationJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var agentConfig = AIAgentConfig.builder()
        .model(OpenAIModels.Chat.GPT4o)
        .prompt(
            Prompt.builder("assistant")
                .system("You are a helpful assistant")
                .build()
        )
        .maxAgentIterations(10)
        .serializer(new JacksonSerializer())
        .build();
    ```
    <!--- KNIT exampleSerializationJava06.java -->

## 工具如何与序列化器交互

代理运行时会自动在每个 `Tool` 实例上调用以下方法。
在正常使用中，你无需亲自调用它们。

- **`decodeArgs(rawArgs, serializer)`** (JSON → TArgs) — 将来自 LLM 的原始 JSON 实参反序列化为工具的类型化实参类。
- **`encodeArgs(args, serializer)`** (TArgs → JSON) — 将类型化实参序列化回 JSON（由某些代理功能使用）。
- **`decodeResult(rawResult, serializer)`** (JSON → TResult) — 反序列化存储的 JSON 结果。
- **`encodeResult(result, serializer)`** (TResult → JSON) — 将工具的结果序列化为 JSON。
- **`encodeResultToString(result, serializer)`** (TResult → String) — 将工具的结果序列化为发送给 LLM 的字符串。
  默认情况下，委托给 `encodeResult`。可以重写以自定义发送给 LLM 的结果格式。

这些方法在 `Tool` 上是 `open` 的，因此如果你需要为特定工具定制序列化行为，可以重写它们。

## 功能如何使用序列化器

序列化层并不局限于工具 —— 某些代理功能也依赖于它。

例如，**Persistence**（持久化）在创建检查点和恢复代理状态时，会使用 `AIAgentConfig` 中配置的 `JSONSerializer` 来序列化和反序列化节点输入与输出。这意味着任何流经受持久化保护的节点的类型都必须能够被配置的 `JSONSerializer` 序列化。

有关检查点创建和恢复的详细信息，请参阅 [Agent Persistence](features/agent-persistence.md)。