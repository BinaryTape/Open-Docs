# ToolDescriptorSchemer

## 這是什麼

`ToolDescriptorSchemer` 是一個擴充點，負責將 `ToolDescriptor` 轉換為與特定 LLM 提供者相容的 JSON Schema 物件。

關鍵點：

- 位置：`ai.koog.agents.core.tools.serialization.ToolDescriptorSchemer`
- 規範：單個函式 `scheme(toolDescriptor: ToolDescriptor): JsonObject`
- 提供的實作：
  - `OpenAICompatibleToolDescriptorSchemer` — 產生與 OpenAI 風格的函式/工具定義相容的架構（schema）。
  - `OllamaToolDescriptorSchemer` — 產生與 Ollama 工具 JSON 相容的架構（schema）。

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.json.JsonObject
-->
```kotlin
// 介面
interface ToolDescriptorSchemaGenerator {
  fun generate(toolDescriptor: ToolDescriptor): JsonObject
}
```
<!--- KNIT example-tool-descriptor-schemer-01.kt -->

## 為什麼要使用它？
如果您想為現有或新的 LLM 提供者提供自訂架構（scheme），請實作此介面以將 Koog 的 `ToolDescriptor` 轉換為預期的 JSON Schema 格式。

## 實作範例

以下是一個極簡的自訂實作，僅呈現參數型別的子集，用以說明如何接入 SPI。實際實作應涵蓋所有 `ToolParameterType`（String、Integer、Float、Boolean、Null、Enum、List、Object、AnyOf）。

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
                        else -> put("type", "string") // 為了簡潔起見的備援方案
                    }
                })
            }
        }
        putJsonArray("required") { toolDescriptor.requiredParameters.forEach { add(JsonPrimitive(it.name)) } }
    }
}
```
<!--- KNIT example-tool-descriptor-schemer-02.kt -->

## 搭配用戶端的使用範例

通常您不需要直接呼叫 schemer。Koog 用戶端接受 `ToolDescriptor` 物件清單，並在為提供者序列化請求時，於內部套用正確的 schemer。

下面的範例定義了一個簡單的工具，並將其傳遞給 OpenAI 用戶端。用戶端將在底層使用 `OpenAICompatibleToolDescriptorSchemer` 來建置 JSON 架構。

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
                        else -> put("type", "string") // 為了簡潔起見的備援方案
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

如果您需要直接存取產生的架構（用於偵錯或自訂傳輸），您可以具現化特定提供者的 schemer 並自行序列化 JSON：

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