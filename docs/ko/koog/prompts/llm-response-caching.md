# LLM 응답 캐싱

프롬프트 실행기(prompt executor)를 사용하여 실행하는 반복되는 요청의 경우, LLM 응답을 캐시하여 성능을 최적화하고 비용을 절감할 수 있습니다. Koog에서는 모든 프롬프트 실행기에서 `CachedPromptExecutor`를 통해 캐싱을 사용할 수 있습니다. `CachedPromptExecutor`는 캐싱 기능을 추가하여 `PromptExecutor`를 감싸는 래퍼입니다. 이를 통해 이전에 실행된 프롬프트의 응답을 저장하고, 동일한 프롬프트가 다시 실행될 때 해당 응답을 검색할 수 있습니다.

캐시된 프롬프트 실행기를 생성하려면 다음을 수행하십시오:

1.  응답을 캐시할 프롬프트 실행기를 생성합니다.
2.  원하는 캐시와 생성한 프롬프트 실행기를 제공하여 `CachedPromptExecutor` 인스턴스를 생성합니다.
3.  생성된 `CachedPromptExecutor`를 원하는 프롬프트 및 모델과 함께 실행합니다.

다음은 예시입니다:

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
// 프롬프트 실행기 생성
val client = OpenAILLMClient(System.getenv("OPENAI_API_KEY"))
val promptExecutor = MultiLLMPromptExecutor(client)

// 캐시된 프롬프트 실행기 생성
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("path/to/your/cache/directory")),
    nested = promptExecutor
)

// 캐시된 프롬프트 실행기를 처음 실행
// 실제 LLM 요청을 수행합니다.
val firstTime = measureTimeMillis {
    val firstResponse = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
    println("First response: ${firstResponse.first().content}")
}
println("First execution took: ${firstTime}ms")

// 캐시된 프롬프트 실행기를 두 번째 실행
// 캐시에서 즉시 결과를 반환합니다.
val secondTime = measureTimeMillis {
    val secondResponse = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
    println("Second response: ${secondResponse.first().content}")
}
println("Second execution took: ${secondTime}ms")
```
<!--- KNIT example-llm-response-caching-01.kt -->

이 예시는 다음과 같은 출력을 생성합니다:

```
First response: Hello! It seems like we're starting a new conversation. What can I help you with today?
First execution took: 48ms
Second response: Hello! It seems like we're starting a new conversation. What can I help you with today?
Second execution took: 1ms
```
두 번째 응답은 캐시에서 검색되었으며, 1ms밖에 걸리지 않았습니다.

!!!note
    *   캐시된 프롬프트 실행기로 `executeStreaming()`을 호출하면, 응답을 단일 청크(single chunk)로 생성합니다.
    *   캐시된 프롬프트 실행기로 `moderate()`을 호출하면, 요청을 중첩된 프롬프트 실행기(nested prompt executor)로 전달하며 캐시를 사용하지 않습니다.
    *   다중 선택 응답(`executeMultipleChoice()`)의 캐싱은 지원되지 않습니다.