# LLM 响应缓存

对于您使用提示执行器运行的重复请求，您可以缓存 LLM 响应以优化性能并降低成本。在 Koog 中，所有提示执行器都可以通过 `CachedPromptExecutor` 使用缓存，它是一个 `PromptExecutor` 的包装器，增加了缓存功能。它允许您存储先前执行的提示的响应，并在再次运行相同的提示时检索它们。

要创建缓存的提示执行器，请执行以下操作：

1.  创建一个您希望缓存其响应的提示执行器。
2.  通过提供所需的缓存和您创建的提示执行器，创建一个 `CachedPromptExecutor` 实例。
3.  使用所需的提示和模型运行创建的 `CachedPromptExecutor`。

以下是一个示例：

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
// 创建一个提示执行器
val client = OpenAILLMClient(System.getenv("OPENAI_API_KEY"))
val promptExecutor = MultiLLMPromptExecutor(client)

// 创建一个缓存的提示执行器
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("path/to/your/cache/directory")),
    nested = promptExecutor
)

// 首次运行缓存的提示执行器
// 这将执行实际的 LLM 请求
val firstTime = measureTimeMillis {
    val firstResponse = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
    println("First response: ${firstResponse.first().content}")
}
println("First execution took: ${firstTime}ms")

// 第二次运行缓存的提示执行器
// 这将立即从缓存返回结果
val secondTime = measureTimeMillis {
    val secondResponse = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
    println("Second response: ${secondResponse.first().content}")
}
println("Second execution took: ${secondTime}ms")
```
<!--- KNIT example-llm-response-caching-01.kt -->

该示例产生以下输出：

```
First response: Hello! It seems like we're starting a new conversation. What can I help you with today?
First execution took: 48ms
Second response: Hello! It seems like we're starting a new conversation. What can I help you with today?
Second execution took: 1ms
```
第二个响应是从缓存中检索的，仅耗时 1 毫秒。

!!!note
    *   如果您使用缓存的提示执行器调用 `executeStreaming()`，它会生成一个单块响应。
    *   如果您使用缓存的提示执行器调用 `moderate()`，它会将请求转发到嵌套的提示执行器，并且不使用缓存。
    *   不支持对多选响应 (`executeMultipleChoice()`) 进行缓存。