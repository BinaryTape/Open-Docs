# LLM 回應快取

對於使用提示詞執行器執行的重複請求，您可以快取 LLM 回應以優化效能並降低成本。
在 Koog 中，所有提示詞執行器都可以透過 `CachedPromptExecutor` 使用快取功能，它是 `PromptExecutor` 的一個包裝函式，增加了快取功能。
它讓您可以儲存先前執行的提示詞回應，並在再次執行相同的提示詞時將其檢索出來。

若要建立快取提示詞執行器，請執行以下操作：

1. 建立一個您想要快取其回應的提示詞執行器。
2. 透過提供所需的快取和您建立的提示詞執行器來建立 `CachedPromptExecutor` 執行個體。
3. 使用所需的提示詞和模型執行建立好的 `CachedPromptExecutor`。

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
// 建立提示詞執行器
val client = OpenAILLMClient(System.getenv("OPENAI_API_KEY"))
val promptExecutor = MultiLLMPromptExecutor(client)

// 建立快取提示詞執行器
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("path/to/your/cache/directory")),
    nested = promptExecutor
)

// 第一次執行快取提示詞執行器
// 這將執行實際的 LLM 請求
val firstTime = measureTimeMillis {
    val firstResponse = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
    println("First response: ${firstResponse.first().content}")
}
println("First execution took: ${firstTime}ms")

// 第二次執行快取提示詞執行器
// 這將立即從快取傳回結果
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
第二次回應是從快取中檢索的，僅耗時 1 ms。

!!!note
    * 如果您使用快取提示詞執行器呼叫 `executeStreaming()`，它會以單一區塊（chunk）的形式產生回應。
    * 如果您使用快取提示詞執行器呼叫 `moderate()`，它會將請求轉發到巢狀提示詞執行器，且不會使用快取。
    * 不支援多選回應 (`executeMultipleChoice()`) 的快取。