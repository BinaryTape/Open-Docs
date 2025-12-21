# LLMレスポンスのキャッシュ

プロンプトエグゼキューターで実行する繰り返しのリクエストに対して、LLMレスポンスをキャッシュすることで、パフォーマンスを最適化し、コストを削減できます。Koogでは、キャッシング機能を追加する`PromptExecutor`のラッパーである`CachedPromptExecutor`を介して、すべてのプロンプトエグゼキューターでキャッシングが利用可能です。これにより、以前に実行されたプロンプトからのレスポンスを保存し、同じプロンプトが再度実行されたときにそれらを取得できます。

キャッシュされたプロンプトエグゼキューターを作成するには、次の手順を実行します。

1.  レスポンスをキャッシュしたいプロンプトエグゼキューターを作成します。
2.  目的のキャッシュと、作成したプロンプトエグゼキューターを提供して、`CachedPromptExecutor`インスタンスを作成します。
3.  作成した`CachedPromptExecutor`を目的のプロンプトとモデルで実行します。

以下に例を示します。

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
// プロンプトエグゼキューターを作成します
val client = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = SingleLLMPromptExecutor(client)

// キャッシュされたプロンプトエグゼキューターを作成します
val cachedExecutor = CachedPromptExecutor(
    cache = FilePromptCache(Path("/cache_directory")),
    nested = promptExecutor
)

// キャッシュされたプロンプトエグゼキューターを実行します
val response = cachedExecutor.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-llm-response-caching-01.kt -->

これで、同じプロンプトを同じモデルで複数回実行できます。レスポンスはキャッシュから取得されます。

!!!note
    *   キャッシュされたプロンプトエグゼキューターで`executeStreaming()`を呼び出すと、レスポンスが単一のチャンクとして生成されます。
    *   キャッシュされたプロンプトエグゼキューターで`moderate()`を呼び出すと、リクエストがネストされたプロンプトエグゼキューターに転送され、キャッシュは使用されません。
    *   複数選択式レスポンス（`executeMultipleChoice()`）のキャッシングはサポートされていません。