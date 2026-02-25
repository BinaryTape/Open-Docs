# ToolDescriptorSchemer

## 무엇인가요?

`ToolDescriptorSchemer`는 `ToolDescriptor`를 특정 LLM 제공자(provider)와 호환되는 JSON Schema 객체로 변환하는 확장 포인트(extension point)입니다.

주요 사항:

- 위치: `ai.koog.agents.core.tools.serialization.ToolDescriptorSchemer`
- 계약(Contract): 단일 함수 `scheme(toolDescriptor: ToolDescriptor): JsonObject`
- 제공되는 구현체:
  - `OpenAICompatibleToolDescriptorSchemer` — OpenAI 스타일의 함수/도구 정의와 호환되는 스키마를 생성합니다.
  - `OllamaToolDescriptorSchemer` — Ollama 도구 JSON과 호환되는 스키마를 생성합니다.

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.json.JsonObject
-->
```kotlin
// 인터페이스
interface ToolDescriptorSchemaGenerator {
  fun generate(toolDescriptor: ToolDescriptor): JsonObject
}
```
<!--- KNIT example-tool-descriptor-schemer-01.kt -->

## 왜 사용하나요?
기존 또는 새로운 LLM 제공자를 위해 커스텀 스키마를 제공하려는 경우, 이 인터페이스를 구현하여 Koog의 `ToolDescriptor`를 기대되는 JSON Schema 형식으로 변환하세요.

## 구현 예시

아래는 SPI에 연결하는 방법을 설명하기 위해 파라미터 타입의 일부만 렌더링하는 최소한의 커스텀 구현 예시입니다. 실제 구현에서는 모든 `ToolParameterType`(String, Integer, Float, Boolean, Null, Enum, List, Object, AnyOf)을 처리해야 합니다.

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.serialization.ToolDescriptorSchemaGenerator
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray
import kotlinx.serialization.json.putJsonObject
-->
```kotlin

class MinimalSchemer : ToolDescriptorSchemaGenerator {
    override fun generate(toolDescriptor: ToolDescriptor): JsonObject = buildJsonObject {
        put("type", "object")
        putJsonObject("properties") {
            (toolDescriptor.requiredParameters + toolDescriptor.optionalParameters).forEach { p ->
                put(p.name, buildJsonObject {
                    put("description", p.description)
                    when (val t = p.type) {
                        ToolParameterType.String -> put("type", "string")
                        ToolParameterType.Integer -> put("type", "integer")
                        is ToolParameterType.Enum -> {
                            put("type", "string")
                            putJsonArray("enum") { t.entries.forEach { add(JsonPrimitive(it)) } }
                        }
                        else -> put("type", "string") // 간결함을 위해 폴백 처리
                    }
                })
            }
        }
        putJsonArray("required") { toolDescriptor.requiredParameters.forEach { add(JsonPrimitive(it.name)) } }
    }
}
```
<!--- KNIT example-tool-descriptor-schemer-02.kt -->

## 클라이언트와 함께 사용하는 예시

일반적으로 스키머를 직접 호출할 필요는 없습니다. Koog 클라이언트는 `ToolDescriptor` 객체 리스트를 받아 제공자에게 요청을 직렬화할 때 내부적으로 적절한 스키머를 적용합니다.

아래 예시는 간단한 도구를 정의하고 이를 OpenAI 클라이언트에 전달합니다. 클라이언트는 내부적으로 `OpenAICompatibleToolDescriptorSchemer`를 사용하여 JSON 스키마를 빌드합니다.

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.openai.base.OpenAICompatibleToolDescriptorSchemaGenerator
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray
import kotlinx.serialization.json.putJsonObject
import kotlinx.coroutines.runBlocking

class MinimalSchemer : OpenAICompatibleToolDescriptorSchemaGenerator() {
    override fun generate(toolDescriptor: ToolDescriptor): JsonObject = buildJsonObject {
        put("type", "object")
        putJsonObject("properties") {
            (toolDescriptor.requiredParameters + toolDescriptor.optionalParameters).forEach { p ->
                put(p.name, buildJsonObject {
                    put("description", p.description)
                    when (val t = p.type) {
                        ToolParameterType.String -> put("type", "string")
                        ToolParameterType.Integer -> put("type", "integer")
                        is ToolParameterType.Enum -> {
                            put("type", "string")
                            putJsonArray("enum") { t.entries.forEach { add(JsonPrimitive(it)) } }
                        }
                        else -> put("type", "string") // 간결함을 위해 폴백 처리
                    }
                })
            }
        }
        putJsonArray("required") { toolDescriptor.requiredParameters.forEach { add(JsonPrimitive(it.name)) } }
    }
}

-->
```kotlin
val client = OpenAILLMClient(apiKey = System.getenv("OPENAI_API_KEY"), toolsConverter = MinimalSchemer())

val getUserTool = ToolDescriptor(
    name = "get_user",
    description = "Returns user profile by id",
    requiredParameters = listOf(
        ToolParameterDescriptor(
            name = "id",
            description = "User id",
            type = ToolParameterType.String
        )
    )
)

val prompt = Prompt.build(id = "p1") { user("Hello") }
val responses = runBlocking {
    client.execute(
        prompt = prompt,
        model = OpenAIModels.Chat.GPT4o,
        tools = listOf(getUserTool)
    )
}
```
<!--- KNIT example-tool-descriptor-schemer-03.kt -->

생성된 스키마에 직접 접근해야 하는 경우(디버깅 또는 커스텀 전송 용도), 특정 제공자의 스키머를 인스턴스화하여 직접 JSON을 직렬화할 수 있습니다.

<!--- INCLUDE
import kotlinx.serialization.json.Json
import ai.koog.prompt.executor.clients.openai.base.OpenAICompatibleToolDescriptorSchemaGenerator
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType

fun getUserTool(): ToolDescriptor {
    return ToolDescriptor(
        name = "get_user",
        description = "Returns user profile by id",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "id",
                description = "User id",
                type = ToolParameterType.String
            )
        )
    )
}
-->

```kotlin
val json = Json { prettyPrint = true }
val schema = OpenAICompatibleToolDescriptorSchemaGenerator().generate(getUserTool())
```
<!--- KNIT example-tool-descriptor-schemer-04.kt -->