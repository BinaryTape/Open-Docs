# LLM 响应缓存

对于使用提示执行器运行的重复请求，您可以缓存 LLM 响应以优化性能并降低成本。在 Koog 中，所有提示执行器都可以通过 `CachedPromptExecutor` 使用缓存，它是一个 `PromptExecutor` 的包装器，增加了缓存功能。它允许您存储先前执行的提示的响应，并在再次运行相同的提示时检索它们。

要创建缓存的提示执行器，请执行以下操作：

1.  创建一个您希望缓存其响应的提示执行器。
2.  通过提供所需的缓存和您创建的提示执行器，创建一个 `CachedPromptExecutor` 实例。
3.  使用所需的提示和模型运行创建的 `CachedPromptExecutor`。

以下是一个示例：

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
// 创建一个提示执行器
val client = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = SingleLLMPromptExecutor(client)

// 创建一个缓存的提示执行器
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("/cache_directory")),
    nested = promptExecutor
)

// 运行缓存的提示执行器
val response = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-llm-response-caching-01.kt -->

现在，您可以使用相同的模型多次运行相同的提示。响应将从缓存中检索。

!!!note
    *   如果您使用缓存的提示执行器调用 `executeStreaming()`，它会生成一个单块响应。
    *   如果您使用缓存的提示执行器调用 `moderate()`，它会将请求转发到嵌套的提示执行器，并且不使用缓存。
    *   不支持对多选响应 (`executeMultipleChoice()`) 进行缓存。