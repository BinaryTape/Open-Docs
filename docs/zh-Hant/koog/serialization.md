# 序列化

## 簡介

Koog 使用一個輕量、且與程式庫無關的序列化層，用於在 JSON 與工具引數及結果之間進行轉換。
此層位於代理程式執行時期與底層序列化程式庫之間，因此您可以更換程式庫而無需更改任何工具或代理程式程式碼。

除了工具之外，序列化層也用於代理程式功能（例如 **Persistence**），以序列化和反序列化節點的輸入和輸出。

預設情況下，Koog 使用 `KotlinxSerializer`（由 kotlinx-serialization 支援）。
在 JVM 上，您也可以切換到 `JacksonSerializer`（由 jackson-databind 支援）。

## `JSONSerializer` 介面

`JSONSerializer` 是位於 `serialization-core` 中的核心抽象。
該介面有四個主要方法（對字串和 `JSONElement` 進行編解碼），加上兩個用於在 `JSONElement` 和字串之間轉換的便利方法：

- `encodeToString` / `decodeFromString` — 將型別化值序列化為 JSON 字串，或從中反序列化。
- `encodeToJSONElement` / `decodeFromJSONElement` — 將型別化值序列化為 `JSONElement` 樹，或從中反序列化。
- `encodeJSONElementToString` / `decodeJSONElementFromString` — 在 `JSONElement` 及其字串形式之間轉換。

以下範例展示了所有關鍵操作：

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

    // 將資料類別編碼為 JSON 字串
    val json: String = serializer.encodeToString(User("Alice", 30), typeToken<User>())

    // 將 JSON 字串解碼回資料類別
    val user: User = serializer.decodeFromString(json, typeToken<User>())

    // 編碼為 JSONElement 樹
    val element: JSONElement = serializer.encodeToJSONElement(user, typeToken<User>())

    // 從 JSONElement 樹解碼
    val userFromElement: User = serializer.decodeFromJSONElement(element, typeToken<User>())

    // 在 JSONElement 與原始 JSON 字串之間轉換
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
    // Jackson 序列化類別
    record User(
        @JsonProperty("name") String name,
        @JsonProperty("age") int age
    ) {}

    var serializer = new JacksonSerializer();

    // 將資料類別編碼為 JSON 字串
    String json = serializer.encodeToString(new User("Alice", 30), TypeToken.of(User.class));

    // 將 JSON 字串解碼回資料類別
    User user = serializer.decodeFromString(json, TypeToken.of(User.class));

    // 編碼為 JSONElement 樹
    JSONElement element = serializer.encodeToJSONElement(user, TypeToken.of(User.class));

    // 從 JSONElement 樹解碼
    User userFromElement = serializer.decodeFromJSONElement(element, TypeToken.of(User.class));

    // 在 JSONElement 與原始 JSON 字串之間轉換
    String jsonString = "{\"key\": \"value\"}";
    JSONElement jsonElement = serializer.decodeJSONElementFromString(jsonString);
    String backToString = serializer.encodeJSONElementToString(jsonElement);
    ```
    <!--- KNIT exampleSerializationJava01.java -->

## 型別權杖 (Type tokens)

`TypeToken` 是 Koog 在執行時期傳遞型別資訊的方式。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.typeToken
    -->
    ```kotlin
    data class MyClass(val value: String)

    // 內聯具體化 (Inline reified) — Kotlin 中的首選方式
    val tokenReified = typeToken<MyClass>()

    // 從 KClass 建立 (當沒有具體化型別參數可用時)
    val tokenKClass = typeToken(MyClass::class)

    // 泛型型別 — 在執行時期保留型別引數
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

    // 簡單類別
    TypeToken tokenClass = TypeToken.of(MyClass.class);

    // 泛型型別 — 使用 TypeCapture 來保留型別引數
    TypeToken tokenGeneric = TypeToken.of(new TypeCapture<List<String>>() {});
    ```
    <!--- KNIT exampleSerializationJava02.java -->

## `JSONElement` — 與程式庫無關的 JSON 樹

`JSONElement` 是 JSON 資料的中性中間表示法。
它的存在是為了讓序列化器、工具和代理程式內部實作不依賴於特定程式庫的特定 JSON 型別。

### 階層結構

```
JSONElement
├── JSONObject   – 鍵值對 (entries: Map<String, JSONElement>)
├── JSONArray    – 有序清單 (elements: List<JSONElement>)
└── JSONPrimitive
    ├── JSONLiteral  – 字串、數值或布林值
    └── JSONNull     – JSON null 單例
```
<!--- KNIT example-serialization-01.txt -->

### 與程式庫型別之間的轉換

每個序列化整合都提供了擴充函式，讓您可以在 `JSONElement` 與程式庫自有的動態 JSON 型別之間進行轉換。當您已經擁有 `JsonElement`、`JsonNode` 等並希望將其傳遞給 Koog（或反之亦然），而不想經過完整的編解碼週期時，這非常有用。
下方提供了每個受支援程式庫的範例。

### 建立與讀取元素

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

    // 從物件讀取值
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

    // 從物件讀取值
    String nameContent = ((JSONPrimitive) obj.getEntries().get("name")).getContent();  // "Alice"
    Integer age = ((JSONPrimitive) obj.getEntries().get("age")).getIntOrNull(); // 30
    ```
    <!--- KNIT exampleSerializationJava03.java -->

## 支援的序列化器

### `KotlinxSerializer` (預設)

- **模組**: `ai.koog:serialization-core` (隨 `ai.koog:agents-core` 遞移性包含)
- **支援庫**: kotlinx-serialization

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.kotlinx.KotlinxSerializer
    import kotlinx.serialization.json.Json
    -->

    ```kotlin
    // 預設執行個體 — 使用 Json.Default
    val defaultSerializer = KotlinxSerializer()

    // 自訂 Json 配置
    val customSerializer = KotlinxSerializer(
        json = Json {
            ignoreUnknownKeys = true
            prettyPrint = true
        }
    )
    ```

    <!--- KNIT example-serialization-04.kt -->

您也可以在 Koog 的 `JSONElement` 與 kotlinx-serialization 的 `JsonElement` 之間進行轉換。

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

    // 轉換為 kotlinx-serialization 動態 JSON 執行個體
    val kotlinxJson: JsonElement = koogJson.toKotlinxJsonElement()

    // 轉換為 Koog 動態 JSON 執行個體
    val koogJsonConverted: JSONElement = kotlinxJson.toKoogJSONElement()
    ```
    <!--- KNIT example-serialization-05.kt -->

### `JacksonSerializer` (僅限 JVM)

- **模組**: `ai.koog:serialization-jackson` (獨立相依性)
- **支援庫**: jackson-databind

在您的 `build.gradle.kts` 中加入相依性：

```kts
dependencies {
    implementation("ai.koog:serialization-jackson:<version>")
}
```
<!--- KNIT example-serialization-02.txt -->

然後建立序列化器：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.jackson.JacksonSerializer
    import com.fasterxml.jackson.databind.DeserializationFeature
    import com.fasterxml.jackson.databind.ObjectMapper
    -->

    ```kotlin
    // 預設執行個體 — 使用預先註冊了 JSONElementModule 的全新 ObjectMapper
    val defaultSerializer = JacksonSerializer()

    // 自訂 ObjectMapper 配置
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
    // 預設執行個體 — 使用預先註冊了 JSONElementModule 的全新 ObjectMapper
    var defaultSerializer = new JacksonSerializer();

    // 自訂 ObjectMapper 配置
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    var customSerializer = new JacksonSerializer(objectMapper);
    ```
    <!--- KNIT exampleSerializationJava04.java -->

!!! note
    `JacksonSerializer` 會在它使用的 `ObjectMapper` 上自動註冊 `JSONElementModule`，以便對 `JSONElement` 型別進行正確的序列化/反序列化。

您也可以在 Koog 的 `JSONElement` 與 Jackson 的 `JsonNode` 之間進行轉換。

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

    // 轉換為 Jackson 動態 JSON 執行個體
    val jacksonJson: JsonNode = koogJson.toJacksonJsonNode()

    // 轉換為 Koog 動態 JSON 執行個體
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

    // 轉換為 Jackson 動態 JSON 執行個體
    JsonNode jacksonJson = JacksonJSONElementMappers.toJacksonJsonNode(koogJson);

    // 轉換為 Koog 動態 JSON 執行個體
    JSONElement koogJsonConverted = JacksonJSONElementMappers.toKoogJSONElement(jacksonJson);
    ```
    <!--- KNIT exampleSerializationJava05.java -->

## 在 `AIAgentConfig` 中配置序列化器

=== "Kotlin" 

    在建構 `AIAgentConfig` 時傳遞 `serializer` 參數。
    如果省略，則預設使用 `KotlinxSerializer`。

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

    在建構 `AIAgentConfig` 時傳遞 `serializer` 參數。
    如果省略，則預設使用 `JacksonSerializer`。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.config.AIAgentConfig;
    import ai.koog.prompt.dsl.Prompt;
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

## 工具如何與序列化器互動

代理程式執行時期會自動在每個 `Tool` 執行個體上呼叫以下方法。
在正常使用情況下，您不需要手動呼叫它們。

- **`decodeArgs(rawArgs, serializer)`** (JSON → TArgs) — 將來自 LLM 的原始 JSON 引數反序列化為工具的型別化引數類別。
- **`encodeArgs(args, serializer)`** (TArgs → JSON) — 將型別化引數序列化回 JSON（由某些代理程式功能使用）。
- **`decodeResult(rawResult, serializer)`** (JSON → TResult) — 反序列化儲存的 JSON 結果。
- **`encodeResult(result, serializer)`** (TResult → JSON) — 將工具的結果序列化為 JSON。
- **`encodeResultToString(result, serializer)`** (TResult → String) — 將工具的結果序列化為傳送給 LLM 的字串。
  預設情況下會委派給 `encodeResult`。可以覆寫此方法以自訂傳送給 LLM 的結果格式。

這些方法在 `Tool` 中均為 `open`，因此如果您需要為特定工具自訂序列化行為，可以覆寫它們。

## 功能如何使用序列化器

序列化層不僅限於工具 — 某些代理程式功能也依賴它。

例如，**Persistence** 會使用在 `AIAgentConfig` 中配置的 `JSONSerializer`，在建立檢查點和還原代理程式狀態時，序列化和反序列化節點的輸入和輸出。這意味著流經持久化節點的任何型別都必須可由配置的 `JSONSerializer` 進行序列化。

有關檢查點建立和還原的詳細資訊，請參閱 [Agent Persistence](features/agent-persistence.md)。