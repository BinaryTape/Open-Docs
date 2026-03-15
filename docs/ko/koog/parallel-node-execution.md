## 개요

노드 병렬 실행(Parallel node execution)을 사용하면 여러 AI 에이전트 노드를 동시에 실행할 수 있어, 성능을 향상시키고 복잡한 워크플로를 구현할 수 있습니다. 이 기능은 특히 다음과 같은 경우에 유용합니다:

- 동일한 입력을 서로 다른 모델이나 접근 방식을 통해 동시에 처리해야 할 때
- 여러 개의 독립적인 작업을 병렬로 수행해야 할 때
- 여러 해결책을 생성한 후 비교하는 경쟁 평가 패턴을 구현할 때

## 주요 구성 요소

Koog의 노드 병렬 실행은 아래에 설명된 메서드와 데이터 구조로 구성됩니다.

### 메서드

- `parallel()`: 여러 노드를 병렬로 실행하고 그 결과를 수집합니다.

### 데이터 구조

- `ParallelResult`: 노드 병렬 실행이 완료된 결과를 나타냅니다.
- `NodeExecutionResult`: 노드 실행의 출력과 컨텍스트(context)를 포함합니다.

## 기본 사용법

### 노드를 병렬로 실행하기

노드 병렬 실행을 시작하려면 다음과 같은 형식으로 `parallel` 메서드를 사용합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

typealias Input = Unit
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val firstNode by node<Input, Output>() { "first" }
   val secondNode by node<Input, Output>() { "second" }
   val thirdNode by node<Input, Output>() { "third" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeName by parallel<Input, Output>(
   firstNode, secondNode, thirdNode /* 필요한 경우 노드를 더 추가하세요 */
) {
   // 여기에 병합 전략이 들어갑니다. 예: 
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-01.kt -->

다음은 세 개의 노드를 병렬로 실행하고 길이가 가장 긴 결과를 선택하는 실제 예제입니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

typealias Input = String
typealias Output = Int

val strategy = strategy<String, String>("strategy_name") {
   val nodeCalcTokens by node<Input, Output>() { 1 }
   val nodeCalcSymbols by node<Input, Output>() { 2 }
   val nodeCalcWords by node<Input, Output>() { 3 }
-->
<!--- SUFFIX
}
-->
```kotlin
val calc by parallel<String, Int>(
   nodeCalcTokens, nodeCalcSymbols, nodeCalcWords,
) {
   selectByMax { it }
}
```
<!--- KNIT example-parallel-node-execution-02.kt -->

위 코드는 `nodeCalcTokens`, `nodeCalcSymbols`, `nodeCalcWords` 노드를 병렬로 실행하고 최댓값을 가진 결과를 반환합니다.

### 병합 전략

노드를 병렬로 실행한 후에는 결과를 병합하는 방법을 지정해야 합니다. Koog는 다음과 같은 병합 전략(merge strategies)을 제공합니다:

- `selectBy()`: 조건 함수(predicate function)를 기반으로 결과를 선택합니다.
- `selectByMax()`: 비교 함수를 기반으로 최댓값을 가진 결과를 선택합니다.
- `selectByIndex()`: 선택 함수(selection function)가 반환한 인덱스를 기반으로 결과를 선택합니다.
- `fold()`: 연산 함수를 사용하여 결과를 하나의 값으로 병합(fold)합니다.

#### selectBy

조건 함수를 기반으로 결과를 선택합니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeSelectJoke by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   selectBy { it.contains("programmer") }
}
```
<!--- KNIT example-parallel-node-execution-03.kt -->

이 코드는 "programmer"라는 단어가 포함된 첫 번째 농담을 선택합니다.

#### selectByMax

비교 함수를 기반으로 최댓값을 가진 결과를 선택합니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeLongestJoke by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-04.kt -->

이 코드는 길이가 가장 긴 농담을 선택합니다.

#### selectByIndex

선택 함수가 반환한 인덱스를 기반으로 결과를 선택합니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.structure.json.JsonStructure

typealias Input = String
typealias Output = String

data class JokeRating(
   val bestJokeIndex: Int,
)

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeBestJoke by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   selectByIndex { jokes ->
      // 다른 LLM을 사용하여 가장 좋은 농담을 결정합니다.
      llm.writeSession {
         model = OpenAIModels.Chat.GPT4o
         appendPrompt {
            system("You are a comedy critic. Select the best joke.")
            user("Here are three jokes: ${jokes.joinToString("
\n")}")
         }
         val response = requestLLMStructured<JokeRating>()
         response.getOrNull()!!.data.bestJokeIndex
      }
   }
}
```
<!--- KNIT example-parallel-node-execution-05.kt -->

이 코드는 별도의 LLM 호출을 사용하여 가장 좋은 농담의 인덱스를 결정합니다.

#### fold

연산 함수를 사용하여 결과를 하나의 값으로 병합합니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeAllJokes by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   fold("Jokes:
") { result, joke -> "$result
$joke" }
}
```
<!--- KNIT example-parallel-node-execution-06.kt -->

이 코드는 모든 농담을 하나의 문자열로 결합합니다.

## 예제: 베스트 농담 에이전트

다음은 서로 다른 LLM 모델에서 농담을 생성하고 그중 가장 좋은 것을 선택하기 위해 병렬 실행을 사용하는 전체 예제입니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.prompt.executor.clients.openai.OpenAIModels

typealias Input = String
typealias Output = String

data class JokeRating(
   val bestJokeIndex: Int,
)
-->
```kotlin
val strategy = strategy("best-joke") {
   // 서로 다른 LLM 모델에 대한 노드 정의
   val nodeOpenAI by node<String, String> { topic ->
      llm.writeSession {
         model = OpenAIModels.Chat.GPT4o
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   val nodeAnthropicSonnet by node<String, String> { topic ->
      llm.writeSession {
         model = AnthropicModels.Sonnet_4_5
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   val nodeAnthropicOpus by node<String, String> { topic ->
      llm.writeSession {
         model = AnthropicModels.Opus_4_6
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   // 농담 생성을 병렬로 실행하고 가장 좋은 농담을 선택
   val nodeGenerateBestJoke by parallel(
      nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
   ) {
      selectByIndex { jokes ->
         // 또 다른 LLM(예: GPT4o)이 가장 재미있는 농담을 찾습니다:
         llm.writeSession {
            model = OpenAIModels.Chat.GPT4o
            appendPrompt {
               prompt("best-joke-selector") {
                  system("You are a comedy critic. Give a critique for the given joke.")
                  user(
                     """
                            Here are three jokes about the same topic:

                            ${jokes.mapIndexed { index, joke -> "Joke $index:
$joke" }.joinToString("
\n")}

                            Select the best joke and explain why it's the best.
                            """.trimIndent()
                  )
               }
            }

            val response = requestLLMStructured<JokeRating>()
            val bestJoke = response.getOrNull()!!.data
            bestJoke.bestJokeIndex
         }
      }
   }

   // 노드 연결
   nodeStart then nodeGenerateBestJoke then nodeFinish
}
```
<!--- KNIT example-parallel-node-execution-07.kt -->

## 권장 사항 (Best practices)

1. **리소스 제약 고려**: 특히 여러 LLM API 호출을 동시에 수행할 때 리소스 사용량에 유의하세요.

2. **컨텍스트 관리**: 각 병렬 실행은 포크된 컨텍스트(forked context)를 생성합니다. 결과를 병합할 때 어떤 컨텍스트를 유지할지 또는 서로 다른 실행의 컨텍스트를 어떻게 결합할지 선택하세요.

3. **사용 사례에 따른 최적화**:
    - 경쟁 평가(농담 예제와 같은 경우)에는 `selectByIndex`를 사용하여 최선의 결과를 선택하세요.
    - 최댓값을 찾을 때는 `selectByMax`를 사용하세요.
    - 조건에 따른 필터링에는 `selectBy`를 사용하세요.
    - 집계 작업에는 `fold`를 사용하여 모든 결과를 하나의 복합 출력으로 결합하세요.

## 성능 고려 사항

병렬 실행은 처리량(throughput)을 크게 향상시킬 수 있지만, 다음과 같은 약간의 오버헤드가 발생합니다:

- 각 병렬 노드는 새로운 코루틴을 생성합니다.
- 컨텍스트 포크(forking) 및 병합 과정에서 연산 비용이 추가됩니다.
- 다수의 병렬 실행 시 리소스 경합(contention)이 발생할 수 있습니다.

최적의 성능을 위해 다음과 같은 작업을 병렬화하는 것이 좋습니다:

- 서로 독립적인 작업
- 실행 시간이 긴 작업
- 가변 상태(mutable state)를 공유하지 않는 작업