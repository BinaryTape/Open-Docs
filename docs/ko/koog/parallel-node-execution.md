## 개요

병렬 노드 실행을 통해 여러 AI 에이전트 노드를 동시에 실행하여 성능을 향상하고 복잡한 워크플로를 구현할 수 있습니다. 이 기능은 다음이 필요할 때 특히 유용합니다.

- 동일한 입력을 여러 모델 또는 접근 방식을 통해 동시에 처리
- 여러 독립적인 작업을 병렬로 수행
- 여러 솔루션을 생성한 다음 비교하는 경쟁적 평가 패턴 구현

## 주요 구성 요소

Koog의 병렬 노드 실행은 아래 설명된 메서드 및 데이터 구조로 구성됩니다.

### 메서드

- `parallel()`: 여러 노드를 병렬로 실행하고 결과를 수집합니다.

### 데이터 구조

- `ParallelResult`: 병렬 노드 실행의 완료된 결과를 나타냅니다.
- `NodeExecutionResult`: 노드 실행의 출력 및 컨텍스트를 포함합니다.

## 기본 사용법

### 노드 병렬 실행

노드의 병렬 실행을 시작하려면 다음 형식으로 `parallel` 메서드를 사용합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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
   firstNode, secondNode, thirdNode /* 필요한 경우 노드 추가 */
) {
   // 병합 전략은 여기에 작성됩니다. 예를 들어: 
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-01.kt -->

다음은 세 개의 노드를 병렬로 실행하고 길이가 최대인 결과를 선택하는 실제 예제입니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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

위 코드는 `nodeCalcTokens`, `nodeCalcSymbols`, `nodeCalcWords` 노드를 병렬로 실행하고 최대값을 가진 결과를 반환합니다.

### 병합 전략

노드를 병렬로 실행한 후 결과를 병합하는 방법을 지정해야 합니다. Koog는 다음 병합 전략을 제공합니다.

- `selectBy()`: 조건 함수를 기반으로 결과를 선택합니다.
- `selectByMax()`: 비교 함수를 기반으로 최대값을 가진 결과를 선택합니다.
- `selectByIndex()`: 선택 함수가 반환한 인덱스를 기반으로 결과를 선택합니다.
- `fold()`: 연산 함수를 사용하여 결과를 단일 값으로 폴드(fold)합니다.

#### selectBy

조건 함수를 기반으로 결과를 선택합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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

이것은 "programmer" 단어를 포함하는 첫 번째 농담을 선택합니다.

#### selectByMax

비교 함수를 기반으로 최대값을 가진 결과를 선택합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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

이것은 길이가 최대인 농담을 선택합니다.

#### selectByIndex

선택 함수가 반환한 인덱스를 기반으로 결과를 선택합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.structure.json.JsonStructuredData

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
      // 또 다른 LLM을 사용하여 가장 좋은 농담을 결정
      llm.writeSession {
         model = OpenAIModels.Chat.GPT4o
         appendPrompt {
            system("You are a comedy critic. Select the best joke.")
            user("Here are three jokes: ${jokes.joinToString("
\n")}")
         }
         val response = requestLLMStructured<JokeRating>()
         response.getOrNull()!!.structure.bestJokeIndex
      }
   }
}
```
<!--- KNIT example-parallel-node-execution-05.kt -->

이것은 또 다른 LLM 호출을 사용하여 가장 좋은 농담의 인덱스를 결정합니다.

#### fold

연산 함수를 사용하여 결과를 단일 값으로 폴드(fold)합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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

이것은 모든 농담을 단일 문자열로 결합합니다.

## 예시: 최고의 농담 에이전트

다음은 병렬 실행을 사용하여 다양한 LLM 모델에서 농담을 생성하고 가장 좋은 것을 선택하는 완벽한 예제입니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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
   // 다양한 LLM 모델에 대한 노드 정의
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
         model = AnthropicModels.Sonnet_3_5
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
         model = AnthropicModels.Opus_3
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   // 농담 생성을 병렬로 실행하고 가장 좋은 농담을 선택합니다.
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
                            여기 같은 주제에 대한 세 가지 농담이 있습니다:

                            ${jokes.mapIndexed { index, joke -> "농담 $index:
$joke" }.joinToString("
\n")}

                            가장 좋은 농담을 선택하고 그 이유를 설명하세요.
                            """.trimIndent()
                  )
               }
            }

            val response = requestLLMStructured<JokeRating>()
            val bestJoke = response.getOrNull()!!.structure
            bestJoke.bestJokeIndex
         }
      }
   }

   // 노드 연결
   nodeStart then nodeGenerateBestJoke then nodeFinish
}
```
<!--- KNIT example-parallel-node-execution-07.kt -->

## 모범 사례

1.  **리소스 제약 조건 고려**: 특히 여러 LLM API 호출을 동시에 수행할 때 노드를 병렬로 실행할 때 리소스 사용에 유의하십시오.

2.  **컨텍스트 관리**: 각 병렬 실행은 포크된 컨텍스트를 생성합니다. 결과를 병합할 때 어떤 컨텍스트를 유지할지 또는 다른 실행의 컨텍스트를 결합하는 방법을 선택합니다.

3.  **사용 사례에 맞게 최적화**:
    -   (농담 예시와 같은) 경쟁적 평가의 경우, 최상의 결과를 선택하려면 `selectByIndex`를 사용합니다.
    -   최대값을 찾으려면 `selectByMax`를 사용합니다.
    -   조건에 따라 필터링하려면 `selectBy`를 사용합니다.
    -   집계를 위해서는 `fold`를 사용하여 모든 결과를 단일 복합 출력으로 결합합니다.

## 성능 고려 사항

병렬 실행은 처리량을 크게 향상시킬 수 있지만, 몇 가지 오버헤드가 따릅니다.

- 각 병렬 노드는 새로운 코루틴을 생성합니다.
- 컨텍스트 포크 및 병합에는 일부 계산 비용이 추가됩니다.
- 많은 병렬 실행 시 리소스 경합이 발생할 수 있습니다.

최적의 성능을 위해서는 다음 작업들을 병렬화하십시오.

- 서로 독립적인 작업
- 상당한 실행 시간을 가진 작업
- 변경 가능한 상태를 공유하지 않는 작업