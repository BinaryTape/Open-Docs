# シリアライズ

## はじめに

Koogは、ツールの引数や結果をJSONと相互に変換するために、ライブラリに依存しない軽量なシリアライズ層を使用します。
この層はエージェントのランタイムと基底のシリアライズライブラリの間に位置するため、ツールやエージェントのコードを変更することなくシリアライズライブラリを入れ替えることができます。

ツール以外にも、シリアライズ層は**永続化 (Persistence)** などのエージェント機能によって、ノードの入出力をシリアライズおよびデシリアライズするために使用されます。

デフォルトでは、Koogは `KotlinxSerializer`（kotlinx-serializationベース）を使用します。
JVMでは、`JacksonSerializer`（jackson-databindベース）に切り替えることも可能です。

## `JSONSerializer` インターフェース

`JSONSerializer` は、`serialization-core` に含まれる中心的な抽象化です。
このインターフェースには、4つの主要なメソッド（文字列および `JSONElement` との相互エンコード/デコード）に加えて、`JSONElement` と文字列の間を変換するための2つの便利なメソッドがあります。

- `encodeToString` / `decodeFromString` — 型指定された値とJSON文字列を相互にシリアライズ/デシリアライズします。
- `encodeToJSONElement` / `decodeFromJSONElement` — 型指定された値と `JSONElement` ツリーを相互にシリアライズ/デシリアライズします。
- `encodeJSONElementToString` / `decodeJSONElementFromString` — `JSONElement` とその文字列形式を相互に変換します。

以下の例は、すべての主要な操作を示しています。

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

    // データクラスをJSON文字列にエンコードする
    val json: String = serializer.encodeToString(User("Alice", 30), typeToken<User>())

    // JSON文字列をデータクラスにデコードする
    val user: User = serializer.decodeFromString(json, typeToken<User>())

    // JSONElementツリーにエンコードする
    val element: JSONElement = serializer.encodeToJSONElement(user, typeToken<User>())

    // JSONElementツリーからデコードする
    val userFromElement: User = serializer.decodeFromJSONElement(element, typeToken<User>())

    // JSONElementと生のJSON文字列の間で変換する
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
    // Jacksonでシリアライズ可能なクラス
    record User(
        @JsonProperty("name") String name,
        @JsonProperty("age") int age
    ) {}

    var serializer = new JacksonSerializer();

    // データクラスをJSON文字列にエンコードする
    String json = serializer.encodeToString(new User("Alice", 30), TypeToken.of(User.class));

    // JSON文字列をデータクラスにデコードする
    User user = serializer.decodeFromString(json, TypeToken.of(User.class));

    // JSONElementツリーにエンコードする
    JSONElement element = serializer.encodeToJSONElement(user, TypeToken.of(User.class));

    // JSONElementツリーからデコードする
    User userFromElement = serializer.decodeFromJSONElement(element, TypeToken.of(User.class));

    // JSONElementと生のJSON文字列の間で変換する
    String jsonString = "{\"key\": \"value\"}";
    JSONElement jsonElement = serializer.decodeJSONElementFromString(jsonString);
    String backToString = serializer.encodeJSONElementToString(jsonElement);
    ```
    <!--- KNIT exampleSerializationJava01.java -->

## 型トークン (Type tokens)

`TypeToken` は、Koogが実行時に型情報を渡すための仕組みです。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.typeToken
    -->
    ```kotlin
    data class MyClass(val value: String)

    // インライン reified — Kotlinで推奨される方法
    val tokenReified = typeToken<MyClass>()

    // KClassから生成（reified型パラメータが使用できない場合）
    val tokenKClass = typeToken(MyClass::class)

    // ジェネリック型 — 実行時に型引数を保持する
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

    // シンプルなクラス
    TypeToken tokenClass = TypeToken.of(MyClass.class);

    // ジェネリック型 — 型引数を保持するためにTypeCaptureを使用する
    TypeToken tokenGeneric = TypeToken.of(new TypeCapture<List<String>>() {});
    ```
    <!--- KNIT exampleSerializationJava02.java -->

## `JSONElement` — ライブラリに依存しないJSONツリー

`JSONElement` は、JSONデータの中立的な中間表現です。
これがあることで、シリアライザー、ツール、エージェントの内部実装が、特定のライブラリ特有のJSON型に依存しないようになっています。

### 階層構造

```
JSONElement
├── JSONObject   – キーと値のペア  (entries: Map<String, JSONElement>)
├── JSONArray    – 順序付きリスト  (elements: List<JSONElement>)
└── JSONPrimitive
    ├── JSONLiteral  – 文字列、数値、または真偽値
    └── JSONNull     – JSONのnullシングルトン
```
<!--- KNIT example-serialization-01.txt -->

### ライブラリ型との変換

各シリアライズ統合（integration）は、`JSONElement` とライブラリ独自の動的なJSON型の間で変換を行うための拡張関数を提供しています。これは、すでに `JsonElement` や `JsonNode` を持っており、完全なエンコード/デコードのサイクルを経ずにKoogに渡したい（またはその逆）場合に便利です。
以下に、サポートされている各ライブラリの例を示します。

### 要素の構築と読み取り

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

    // オブジェクトから値を読み取る
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

    // オブジェクトから値を読み取る
    String nameContent = ((JSONPrimitive) obj.getEntries().get("name")).getContent();  // "Alice"
    Integer age = ((JSONPrimitive) obj.getEntries().get("age")).getIntOrNull(); // 30
    ```
    <!--- KNIT exampleSerializationJava03.java -->

## サポートされているシリアライザー

### `KotlinxSerializer`（デフォルト）

- **モジュール**: `ai.koog:serialization-core` (`ai.koog:agents-core` に推移的に含まれます)
- **ベース**: kotlinx-serialization

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.kotlinx.KotlinxSerializer
    import kotlinx.serialization.json.Json
    -->

    ```kotlin
    // デフォルトインスタンス — Json.Defaultを使用
    val defaultSerializer = KotlinxSerializer()

    // カスタムのJson設定
    val customSerializer = KotlinxSerializer(
        json = Json {
            ignoreUnknownKeys = true
            prettyPrint = true
        }
    )
    ```

    <!--- KNIT example-serialization-04.kt -->

Koogの `JSONElement` と kotlinx-serializationの `JsonElement` の間で変換することもできます。

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

    // kotlinx-serializationの動的JSONインスタンスに変換する
    val kotlinxJson: JsonElement = koogJson.toKotlinxJsonElement()

    // Koogの動的JSONインスタンスに変換する
    val koogJsonConverted: JSONElement = kotlinxJson.toKoogJSONElement()
    ```
    <!--- KNIT example-serialization-05.kt -->

### `JacksonSerializer`（JVMのみ）

- **モジュール**: `ai.koog:serialization-jackson`（個別の依存関係）
- **ベース**: jackson-databind

`build.gradle.kts` に依存関係を追加します：

```kts
dependencies {
    implementation("ai.koog:serialization-jackson:<version>")
}
```
<!--- KNIT example-serialization-02.txt -->

その後、シリアライザーを作成します：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.serialization.jackson.JacksonSerializer
    import com.fasterxml.jackson.databind.DeserializationFeature
    import com.fasterxml.jackson.databind.ObjectMapper
    -->

    ```kotlin
    // デフォルトインスタンス — JSONElementModuleが事前登録された新しいObjectMapperを使用
    val defaultSerializer = JacksonSerializer()

    // カスタムのObjectMapper設定
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
    // デフォルトインスタンス — JSONElementModuleが事前登録された新しいObjectMapperを使用
    var defaultSerializer = new JacksonSerializer();

    // カスタムのObjectMapper設定
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    var customSerializer = new JacksonSerializer(objectMapper);
    ```
    <!--- KNIT exampleSerializationJava04.java -->

!!! note
    `JacksonSerializer` は、使用する `ObjectMapper` に対して、`JSONElement` 型の適切なシリアライズ/デシリアライズのために `JSONElementModule` を自動的に登録します。

Koogの `JSONElement` と Jacksonの `JsonNode` の間で変換することもできます。

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

    // Jacksonの動的JSONインスタンスに変換する
    val jacksonJson: JsonNode = koogJson.toJacksonJsonNode()

    // Koogの動的JSONインスタンスに変換する
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

    // Jacksonの動的JSONインスタンスに変換する
    JsonNode jacksonJson = JacksonJSONElementMappers.toJacksonJsonNode(koogJson);

    // Koogの動的JSONインスタンスに変換する
    JSONElement koogJsonConverted = JacksonJSONElementMappers.toKoogJSONElement(jacksonJson);
    ```
    <!--- KNIT exampleSerializationJava05.java -->

## `AIAgentConfig` でのシリアライザーの設定

=== "Kotlin" 

    `AIAgentConfig` を構築する際に `serializer` パラメータを渡します。
    省略した場合は、`KotlinxSerializer` が使用されます。

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

    `AIAgentConfig` を構築する際に `serializer` パラメータを渡します。
    省略した場合は、`JacksonSerializer` が使用されます。

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

## ツールとシリアライザーの相互作用

エージェントのランタイムは、各 `Tool` インスタンスに対して以下のメソッドを自動的に呼び出します。
通常の使用において、これらを自分で呼び出す必要はありません。

- **`decodeArgs(rawArgs, serializer)`** (JSON → TArgs) — LLMからの生のJSON引数をツールの型指定された引数クラスにデシリアライズします。
- **`encodeArgs(args, serializer)`** (TArgs → JSON) — 型指定された引数をJSONにシリアライズします（特定のエージェント機能で使用されます）。
- **`decodeResult(rawResult, serializer)`** (JSON → TResult) — 保存されたJSON形式の結果をデシリアライズします。
- **`encodeResult(result, serializer)`** (TResult → JSON) — ツールの結果をJSONにシリアライズします。
- **`encodeResultToString(result, serializer)`** (TResult → String) — ツールの結果をLLMに送信する文字列にシリアライズします。
  デフォルトでは、`encodeResult` に委譲されます。LLM向けの結果フォーマットをカスタマイズするためにオーバーライド可能です。

これらのメソッドは `Tool` において `open` であるため、特定のツールでカスタムのシリアライズ動作が必要な場合にはオーバーライドできます。

## 各機能でのシリアライザーの利用

シリアライズ層はツールに限定されず、特定のエージェント機能もこれに依存しています。

例えば、**永続化 (Persistence)** は、チェックポイントの作成やエージェント状態の復元時に、`AIAgentConfig` で設定された `JSONSerializer` を使用してノードの入出力をシリアライズおよびデシリアライズします。これは、永続化されるノードを流れるすべての型が、設定された `JSONSerializer` によってシリアライズ可能である必要があることを意味します。

チェックポイントの作成と復元の詳細については、[Agent Persistence](features/agent-persistence.md) を参照してください。