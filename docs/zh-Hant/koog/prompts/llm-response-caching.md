# LLM 回應快取

對於您使用提示執行器執行的重複請求，
您可以快取 LLM 回應以優化效能並降低成本。
在 Koog 中，所有提示執行器都可以透過 `CachedPromptExecutor` 使用快取功能，
它是一個 `PromptExecutor` 的包裝器，新增了快取功能。
它讓您可以儲存先前執行過的提示的回應，並在相同的提示再次執行時取回它們。

要建立一個快取提示執行器，請執行以下步驟：

1.  建立一個您想要快取其回應的提示執行器。
2.  透過提供所需的快取和您建立的提示執行器，建立一個 `CachedPromptExecutor` 實例。
3.  使用所需的提示和模型執行所建立的 `CachedPromptExecutor`。

以下是一個範例：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.cached.CachedPromptExecutor
import ai.koog.prompt.cache.files.FilePromptCache
import kotlin.system.measureTimeMillis
import ai.koog.prompt.dsl.prompt
import kotlin.io.path.Path

import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val prompt = prompt("test") {
            user("Hello")
        }

-->
<!--- SUFFIX
    }
}
--> 
```kotlin
// Create a prompt executor
val client = OpenAILLMClient(System.getenv("OPENAI_API_KEY"))
val promptExecutor = MultiLLMPromptExecutor(client)

// Create a cached prompt executor
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("path/to/your/cache/directory")),
    nested = promptExecutor
)

// Run cached prompt executor for the first time
// This will perform an actual LLM request
val firstTime = measureTimeMillis {
    val firstResponse = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
    println("First response: ${firstResponse.first().content}")
}
println("First execution took: ${firstTime}ms")

// Run cached prompt executor for the second time
// This will return the result immediately from the cache
val secondTime = measureTimeMillis {
    val secondResponse = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
    println("Second response: ${secondResponse.first().content}")
}
println("Second execution took: ${secondTime}ms")
```
<!--- KNIT example-llm-response-caching-01.kt -->

該範例產生以下輸出：

```
First response: Hello! It seems like we're starting a new conversation. What can I help you with today?
First execution took: 48ms
Second response: Hello! It seems like we're starting a new conversation. What can I help you with today?
Second execution took: 1ms
```
第二個回應是從快取中取回的，只花費了 1ms。

!!!note
    *   如果您使用快取提示執行器呼叫 `executeStreaming()`，它會產生一個單一區塊的回應。
    *   如果您使用快取提示執行器呼叫 `moderate()`，它會將請求轉發給巢狀提示執行器並且不使用快取。
    *   不支援多選回應 (`executeMultipleChoice()`) 的快取。