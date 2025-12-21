# LLM 回應快取

對於您使用提示執行器執行的重複請求，您可以快取 LLM 回應以優化效能並降低成本。
在 Koog 中，所有提示執行器都可以透過 `CachedPromptExecutor` 使用快取功能，
它是一個 `PromptExecutor` 的包裝器，新增了快取功能。
它允許您儲存先前執行過的提示的回應，並在相同的提示再次執行時取回它們。

要建立一個快取提示執行器，請執行以下步驟：

1.  建立一個您想要快取其回應的提示執行器。
2.  透過提供所需的快取和您建立的提示執行器，建立一個 `CachedPromptExecutor` 實例。
3.  使用所需的提示和模型執行所建立的 `CachedPromptExecutor`。

以下是一個範例：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
import ai.koog.prompt.executor.cached.CachedPromptExecutor
import ai.koog.prompt.cache.files.FilePromptCache
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
val client = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = SingleLLMPromptExecutor(client)

// Create a cached prompt executor
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("/cache_directory")),
    nested = promptExecutor
)

// Run the cached prompt executor
val response = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-llm-response-caching-01.kt -->

現在您可以多次執行相同的提示與相同的模型。回應將會從快取中取回。

!!!note
    *   如果您使用快取提示執行器呼叫 `executeStreaming()`，它會產生一個單一區塊的回應。
    *   如果您使用快取提示執行器呼叫 `moderate()`，它會將請求轉發給巢狀提示執行器並且不使用快取。
    *   不支援多選回應 (`executeMultipleChoice()`) 的快取。