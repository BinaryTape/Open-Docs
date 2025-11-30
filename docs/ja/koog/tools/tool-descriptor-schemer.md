# ToolDescriptorSchemer

## これは何か

`ToolDescriptorSchemer` は、`ToolDescriptor` を特定の LLM プロバイダーと互換性のある JSON Schema オブジェクトに変換する拡張ポイントです。

主要なポイント:

- 場所: `ai.koog.agents.core.tools.serialization.ToolDescriptorSchemer`
- 契約: 単一の関数 `scheme(toolDescriptor: ToolDescriptor): JsonObject`
- 提供されている実装:
  - `OpenAICompatibleToolDescriptorSchemer` — OpenAI スタイルの関数/ツール定義と互換性のあるスキーマを生成します。
  - `OllamaToolDescriptorSchemer` — Ollama ツールの JSON と互換性のあるスキーマを生成します。

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.json.JsonObject
-->
```kotlin
// Interface
interface ToolDescriptorSchemaGenerator {
  fun generate(toolDescriptor: ToolDescriptor): JsonObject
}
```
<!--- KNIT example-tool-descriptor-schemer-01.kt -->

## なぜこれを使うのか？
既存または新規の LLM プロバイダー向けにカスタムスキーマを提供したい場合は、このインターフェースを実装して、Koog の `ToolDescriptor` を期待される JSON Schema 形式に変換してください。

## 実装例

以下に示すのは、SPI への組み込み方を示すために、パラメーター型の一部のみをレンダリングする最小限のカスタム実装です。実際の実装では、すべての `ToolParameterType`（String、Integer、Float、Boolean、Null、Enum、List、Object、AnyOf）をカバーする必要があります。

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
                        else -> put("type", "string") // fallback for brevity
                    }
                })
            }
        }
        putJsonArray("required") { toolDescriptor.requiredParameters.forEach { add(JsonPrimitive(it.name)) } }
    }
}
```
<!--- KNIT example-tool-descriptor-schemer-02.kt -->

## クライアントでの使用例

通常、schemer を直接呼び出す必要はありません。Koog クライアントは `ToolDescriptor` オブジェクトのリストを受け入れ、プロバイダーへのリクエストをシリアライズする際に内部で適切な schemer を適用します。

以下の例では、シンプルなツールを定義し、それを OpenAI クライアントに渡します。クライアントは内部で `OpenAICompatibleToolDescriptorSchemer` を使用して JSON スキーマを構築します。

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
                        else -> put("type", "string") // fallback for brevity
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

生成されたスキーマに直接アクセスする必要がある場合（デバッグのため、またはカスタム転送のため）は、プロバイダー固有の schemer をインスタンス化し、JSON を自身でシリアライズできます。

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