# シリアライズ

## はじめに

Koogは、ツールの引数や結果をJSONと相互に変換するために、ライブラリに依存しない軽量なシリアライズ層を使用します。
この層はエージェントのランタイムと基底のシリアライズライブラリの間に位置するため、ツールやエージェントのコードを変更することなくシリアライズライブラリを入れ替えることができます。

ツール以外にも、シリアライズ層は**永続化 (Persistence)**などのエージェント機能によって、ノードの入出力をシリアライズおよびデシリアライズするために使用されます。

デフォルトでは、Koogは `KotlinxSerializer`（kotlinx-serializationベース）を使用します。
JVMでは、`JacksonSerializer`（jackson-databindベース）に切り替えることも可能です。

## `JSONSerializer` インターフェース

`JSONSerializer` は、`serialization-core` に含まれる中心的な抽象化です。
このインターフェースには、4つの主要なメソッド（文字列および `JSONElement` との相互エンコード/デコード）に加えて、`JSONElement` と文字列の間を変換するための2つの便利なメソッドがあります。

- `encodeToString` / `decodeFromString` — 型指定された値とJSON文字列を相互にシリアライズ/デシリアライズします。
- `encodeToJSONElement` / `decodeFromJSONElement` — 型指定された値と `JSONElement` ツリーを相互にシリアライズ/デシリアライズします。
- `encodeJSONElementToString` / `decodeJSONElementFromString` — `JSONElement` とその文字列形式を相互に変換します。

以下の例は、すべての主要な操作を示しています。

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

<!--- KNIT example-tool-serialization-01.kt -->

## 型トークン (Type tokens)

`TypeToken` は、Koogが実行時に型情報を渡すための仕組みです。

### Kotlin

<!--- INCLUDE
import ai.koog.serialization.typeToken

-->

```kotlin
data class MyClass(val value: String)

fun typeTokenExamples() {
    // インライン reified — Kotlinで推奨される方法
    val tokenReified = typeToken<MyClass>()

    // KClassから生成（reified型パラメータが使用できない場合）
    val tokenKClass = typeToken(MyClass::class)

    // ジェネリック型 — 実行時に型引数を保持する
    val tokenGeneric = typeToken<List<String>>()
}
```

<!--- KNIT example-tool-serialization-02.kt -->

### Java

```java
// シンプルなクラス
TypeToken token = TypeToken.of(MyClass.class);

// ジェネリック型 — 型引数を保持するためにTypeCaptureを使用する
TypeToken token = TypeToken.of(new TypeCapture<List<String>>() {});
```

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
<!--- KNIT example-tool-serialization-01.txt -->

### ライブラリ型との変換

各シリアライズ統合（integration）は、`JSONElement` とライブラリ独自の動的なJSON型の間で変換を行うための拡張関数を提供しています。これは、すでに `JsonElement` や `JsonNode` を持っており、完全なエンコード/デコードのサイクルを経ずにKoogに渡したい（またはその逆）場合に便利です。

### 要素の構築と読み取り

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

<!--- KNIT example-tool-serialization-03.kt -->

## サポートされているシリアライザー

### `KotlinxSerializer`（デフォルト）

- **モジュール**: `ai.koog:serialization-core` (`ai.koog:agents-core` に推移的に含まれます)
- **ベース**: kotlinx-serialization
- **JSONElement マッパー**: `JsonElement.toKoogJSONElement()` / `JSONElement.toKotlinxJsonElement()` (および各サブタイプ用バリアント)

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

<!--- KNIT example-tool-serialization-04.kt -->

### `JacksonSerializer`（JVMのみ）

- **モジュール**: `ai.koog:serialization-jackson`（個別の依存関係）
- **ベース**: jackson-databind
- **JSONElement マッパー**: `JsonNode.toKoogJSONElement()` / `JSONElement.toJacksonJsonNode()` (および各サブタイプ用バリアント)

`build.gradle.kts` に依存関係を追加します：

```kts
dependencies {
    implementation("ai.koog:serialization-jackson:<version>")
}
```
<!--- KNIT example-tool-serialization-02.txt -->

その後、シリアライザーを作成します：

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

<!--- KNIT example-tool-serialization-05.kt -->

!!! note
    `JacksonSerializer` は、使用する `ObjectMapper` に対して、`JSONElement` 型の適切なシリアライズ/デシリアライズのために `JSONElementModule` を自動的に登録します。

## `AIAgentConfig` でのシリアライザーの設定

`AIAgentConfig` を構築する際に `serializer` パラメータを渡します。
省略した場合は、`KotlinxSerializer()` が使用されます。

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