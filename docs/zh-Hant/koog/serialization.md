# 序列化

## 簡介

Koog 使用一個輕量、且與程式庫無關的序列化層，用於在 JSON 與工具引數及結果之間進行轉換。
此層位於代理程式執行時期與底層序列化程式庫之間，因此您可以更換程式庫而無需更改任何工具或代理程式程式碼。

除了工具之外，序列化層也用於代理程式功能（例如 **Persistence**），以序列化和反序列化節點的輸入和輸出。

預設情況下，Koog 使用 `KotlinxSerializer`（由 kotlinx-serialization 支援）。
在 JVM 上，您也可以切換到 `JacksonSerializer`（由 jackson-databind 支援）。

## `JSONSerializer` 介面

`JSONSerializer` 是位於 `serialization-core` 中的核心抽象。
該介面有四個主要方法（對字串和 `JSONElement` 進行編碼/解碼），加上兩個用於在 `JSONElement` 和字串之間轉換的便利方法：

- `encodeToString` / `decodeFromString` — 將型別化物件序列化為 JSON 字串，或從中反序列化。
- `encodeToJSONElement` / `decodeFromJSONElement` — 將型別化物件序列化為 `JSONElement` 樹，或從中反序列化。
- `encodeJSONElementToString` / `decodeJSONElementFromString` — 在 `JSONElement` 及其字串形式之間轉換。

以下範例展示了所有關鍵操作：

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

<!--- KNIT example-tool-serialization-01.kt -->

## 型別權杖 (Type tokens)

`TypeToken` 是 Koog 在執行時期傳遞型別資訊的方式。

### Kotlin

<!--- INCLUDE
import ai.koog.serialization.typeToken

-->

```kotlin
data class MyClass(val value: String)

fun typeTokenExamples() {
    // 內聯具體化 (Inline reified) — Kotlin 中的首選方式
    val tokenReified = typeToken<MyClass>()

    // 從 KClass 建立 (當沒有具體化型別參數可用時)
    val tokenKClass = typeToken(MyClass::class)

    // 泛型型別 — 在執行時期保留型別引數
    val tokenGeneric = typeToken<List<String>>()
}
```

<!--- KNIT example-tool-serialization-02.kt -->

### Java

```java
// 簡單類別
TypeToken token = TypeToken.of(MyClass.class);

// 泛型型別 — 使用 TypeCapture 來保留型別引數
TypeToken token = TypeToken.of(new TypeCapture<List<String>>() {});
```

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
<!--- KNIT example-tool-serialization-01.txt -->

### 與程式庫型別之間的轉換

每個序列化整合都提供了擴充函式，讓您可以在 `JSONElement` 與程式庫自有的動態 JSON 型別之間進行轉換。當您已經擁有 `JsonElement` 或 `JsonNode` 並希望將其傳遞給 Koog（或反之亦然），而不想經過完整的編解碼週期時，這非常有用。

### 建立與讀取元素

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

<!--- KNIT example-tool-serialization-03.kt -->

## 支援的序列化器

### `KotlinxSerializer` (預設)

- **模組**: `ai.koog:serialization-core` (隨 `ai.koog:agents-core` 遞移性包含)
- **支援庫**: kotlinx-serialization
- **JSONElement 映射器**: `JsonElement.toKoogJSONElement()` / `JSONElement.toKotlinxJsonElement()` (以及各子型別變體)

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

<!--- KNIT example-tool-serialization-04.kt -->

### `JacksonSerializer` (僅限 JVM)

- **模組**: `ai.koog:serialization-jackson` (獨立相依性)
- **支援庫**: jackson-databind
- **JSONElement 映射器**: `JsonNode.toKoogJSONElement()` / `JSONElement.toJacksonJsonNode()` (以及各子型別變體)

在您的 `build.gradle.kts` 中加入相依性：

```kts
dependencies {
    implementation("ai.koog:serialization-jackson:<version>")
}
```
<!--- KNIT example-tool-serialization-02.txt -->

然後建立序列化器：

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

<!--- KNIT example-tool-serialization-05.kt -->

!!! note
    `JacksonSerializer` 會在它使用的 `ObjectMapper` 上自動註冊 `JSONElementModule`，以便對 `JSONElement` 型別進行正確的序列化/反序列化。

## 在 `AIAgentConfig` 中配置序列化器

在建構 `AIAgentConfig` 時傳遞 `serializer` 參數。
如果省略，則預設使用 `KotlinxSerializer()`。

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

<!--- KNIT example-tool-serialization-06.kt -->

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