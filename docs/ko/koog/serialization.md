# 직렬화 (Serialization)

## 소개

Koog은 도구(tool) 인자와 결과를 JSON으로 상호 변환하기 위해 가볍고 라이브러리에 독립적인 직렬화 레이어를 사용합니다.
이 레이어는 에이전트 런타임과 기반 직렬화 라이브러리 사이에 위치하므로, 도구나 에이전트 코드를 변경하지 않고도 직렬화 라이브러리를 교체할 수 있습니다.

도구 외에도, 직렬화 레이어는 노드 입력 및 출력을 직렬화하고 역직렬화하기 위해 **지속성 (Persistence)**과 같은 에이전트 기능에서도 사용됩니다.

기본적으로 Koog은 `KotlinxSerializer`(kotlinx-serialization 기반)를 사용합니다.
JVM에서는 `JacksonSerializer`(jackson-databind 기반)로 전환할 수도 있습니다.

## `JSONSerializer` 인터페이스

`JSONSerializer`는 `serialization-core`에 정의된 핵심 추상화입니다.
이 인터페이스는 네 가지 주요 메서드(문자열 및 `JSONElement` 모두에 대한 인코딩/디코딩)와 `JSONElement`와 문자열 간의 변환을 위한 두 가지 편의 메서드를 제공합니다.

- `encodeToString` / `decodeFromString` — 타입화된 값을 JSON 문자열로 직렬화하거나 그 반대로 수행합니다.
- `encodeToJSONElement` / `decodeFromJSONElement` — 타입화된 값을 `JSONElement` 트리로 직렬화하거나 그 반대로 수행합니다.
- `encodeJSONElementToString` / `decodeJSONElementFromString` — `JSONElement`와 문자열 형식 간의 변환을 수행합니다.

다음 예제는 모든 주요 작업을 보여줍니다.

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

// 데이터 클래스를 JSON 문자열로 인코딩
val json: String = serializer.encodeToString(User("Alice", 30), typeToken<User>())

// JSON 문자열을 다시 데이터 클래스로 디코딩
val user: User = serializer.decodeFromString(json, typeToken<User>())

// JSONElement 트리로 인코딩
val element: JSONElement = serializer.encodeToJSONElement(user, typeToken<User>())

// JSONElement 트리에서 디코딩
val userFromElement: User = serializer.decodeFromJSONElement(element, typeToken<User>())

// JSONElement와 가공되지 않은(raw) JSON 문자열 간의 변환
val jsonString = """{"key": "value"}"""
val jsonElement: JSONElement = serializer.decodeJSONElementFromString(jsonString)
val backToString: String = serializer.encodeJSONElementToString(jsonElement)
```

<!--- KNIT example-tool-serialization-01.kt -->

## 타입 토큰 (Type tokens)

`TypeToken`은 Koog이 런타임에 타입 정보를 전달하는 방법입니다.

### Kotlin

<!--- INCLUDE
import ai.koog.serialization.typeToken

-->

```kotlin
data class MyClass(val value: String)

fun typeTokenExamples() {
    // 인라인 reified — Kotlin에서 권장되는 방식
    val tokenReified = typeToken<MyClass>()

    // KClass로부터 생성 (reified 타입 파라미터를 사용할 수 없는 경우)
    val tokenKClass = typeToken(MyClass::class)

    // 제네릭 타입 — 런타임에 타입 인자를 보존함
    val tokenGeneric = typeToken<List<String>>()
}
```

<!--- KNIT example-tool-serialization-02.kt -->

### Java

```java
// 단순 클래스
TypeToken token = TypeToken.of(MyClass.class);

// 제네릭 타입 — 타입 인자를 보존하기 위해 TypeCapture를 사용함
TypeToken token = TypeToken.of(new TypeCapture<List<String>>() {});
```

## `JSONElement` — 라이브러리 독립적 JSON 트리

`JSONElement`는 JSON 데이터를 위한 중립적인 중간 표현입니다.
이것은 직렬화기(serializer), 도구 및 에이전트 내부 로직이 특정 라이브러리의 특정 JSON 타입에 의존하지 않도록 하기 위해 존재합니다.

### 계층 구조 (Hierarchy)

```
JSONElement
├── JSONObject   – 키-값 쌍 (entries: Map<String, JSONElement>)
├── JSONArray    – 순서가 있는 리스트 (elements: List<JSONElement>)
└── JSONPrimitive
    ├── JSONLiteral  – 문자열, 숫자 또는 불리언
    └── JSONNull     – JSON null 싱글톤
```

### 라이브러리 타입과의 상호 변환

각 직렬화 통합 기능은 `JSONElement`와 라이브러리 고유의 동적 JSON 타입 간의 변환을 가능하게 하는 확장 함수를 제공합니다. 이는 이미 `JsonElement`나 `JsonNode`를 가지고 있고, 전체 인코딩/디코딩 과정을 거치지 않고 Koog에 전달하려는 경우(또는 그 반대의 경우)에 유용합니다.

### 엘리먼트 생성 및 읽기

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

// 객체에서 값 읽기
val nameContent: String = (obj.entries["name"] as JSONPrimitive).content  // "Alice"
val age: Int? = (obj.entries["age"] as JSONPrimitive).intOrNull // 30
```

<!--- KNIT example-tool-serialization-03.kt -->

## 지원되는 직렬화기 (Serializers)

### `KotlinxSerializer` (기본값)

- **모듈**: `ai.koog:serialization-core` (`ai.koog:agents-core`에 전이적으로 포함됨)
- **기반 라이브러리**: kotlinx-serialization
- **JSONElement 매퍼**: `JsonElement.toKoogJSONElement()` / `JSONElement.toKotlinxJsonElement()` (및 하위 타입별 변형)

<!--- INCLUDE
import ai.koog.serialization.kotlinx.KotlinxSerializer
import kotlinx.serialization.json.Json
-->

```kotlin
// 기본 인스턴스 — Json.Default 사용
val defaultSerializer = KotlinxSerializer()

// 커스텀 Json 설정
val customSerializer = KotlinxSerializer(
    json = Json {
        ignoreUnknownKeys = true
        prettyPrint = true
    }
)
```

<!--- KNIT example-tool-serialization-04.kt -->

### `JacksonSerializer` (JVM 전용)

- **모듈**: `ai.koog:serialization-jackson` (별도 의존성)
- **기반 라이브러리**: jackson-databind
- **JSONElement 매퍼**: `JsonNode.toKoogJSONElement()` / `JSONElement.toJacksonJsonNode()` (및 하위 타입별 변형)

`build.gradle.kts`에 의존성을 추가하세요:

```kts
dependencies {
    implementation("ai.koog:serialization-jackson:<version>")
}
```

그 다음 직렬화기를 생성합니다:

<!--- INCLUDE
import ai.koog.serialization.jackson.JacksonSerializer
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
-->

```kotlin
// 기본 인스턴스 — JSONElementModule이 사전 등록된 새로운 ObjectMapper 사용
val defaultSerializer = JacksonSerializer()

// 커스텀 ObjectMapper 설정
val customSerializer = JacksonSerializer(
    objectMapper = ObjectMapper().apply {
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    }
)
```

<!--- KNIT example-tool-serialization-05.kt -->

!!! note
    `JacksonSerializer`는 `JSONElement` 타입의 올바른 직렬화/역직렬화를 위해 사용하는 `ObjectMapper`에 `JSONElementModule`을 자동으로 등록합니다.

## `AIAgentConfig`에서 직렬화기 설정하기

`AIAgentConfig`를 생성할 때 `serializer` 파라미터를 전달하세요.
생략하면 `KotlinxSerializer()`가 사용됩니다.

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

## 도구가 직렬화기와 상호작용하는 방식

에이전트 런타임은 각 `Tool` 인스턴스에서 다음 메서드들을 자동으로 호출합니다. 일반적인 사용 시에는 이 메서드들을 직접 호출할 필요가 없습니다.

- **`decodeArgs(rawArgs, serializer)`** (JSON → TArgs) — LLM으로부터 받은 가공되지 않은 JSON 인자를 도구의 타입화된 인자 클래스로 역직렬화합니다.
- **`encodeArgs(args, serializer)`** (TArgs → JSON) — 타입화된 인자를 다시 JSON으로 직렬화합니다 (특정 에이전트 기능에서 사용됨).
- **`decodeResult(rawResult, serializer)`** (JSON → TResult) — 저장된 JSON 결과를 역직렬화합니다.
- **`encodeResult(result, serializer)`** (TResult → JSON) — 도구의 결과를 JSON으로 직렬화합니다.
- **`encodeResultToString(result, serializer)`** (TResult → String) — 도구의 결과를 LLM으로 보낼 문자열로 직렬화합니다.
  기본적으로 `encodeResult`에 위임합니다. LLM을 위한 결과 형식을 커스터마이징하려는 경우 재정의(override)할 수 있습니다.

이 메서드들은 `Tool`에서 `open`으로 선언되어 있으므로, 특정 도구에 대해 커스텀 직렬화 동작이 필요한 경우 재정의할 수 있습니다.

## 에이전트 기능이 직렬화기를 사용하는 방식

직렬화 레이어는 도구에만 국한되지 않으며, 특정 에이전트 기능들도 이에 의존합니다.

예를 들어, **지속성 (Persistence)** 기능은 체크포인트를 생성하고 에이전트 상태를 복구할 때 `AIAgentConfig`에 설정된 `JSONSerializer`를 사용하여 노드의 입력과 출력을 직렬화 및 역직렬화합니다. 즉, 지속성 노드를 통과하는 모든 타입은 구성된 `JSONSerializer`에 의해 직렬화 가능해야 합니다.

체크포인트 생성 및 복구에 대한 자세한 내용은 [에이전트 지속성 (Agent Persistence)](agent-persistence.md)을 참조하세요.