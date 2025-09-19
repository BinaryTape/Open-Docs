# 콘텐츠 조정

콘텐츠 조정(Content moderation)은 텍스트, 이미지 또는 기타 콘텐츠를 분석하여 잠재적으로 유해하거나, 부적절하거나, 안전하지 않은 자료를 식별하는 과정입니다. AI 시스템의 맥락에서 조정은 다음을 돕습니다:

- 유해하거나 부적절한 사용자 입력을 걸러내기
- 유해하거나 부적절한 AI 응답 생성을 방지하기
- 윤리적 가이드라인 및 법적 요구사항 준수 보장
- 잠재적으로 유해한 콘텐츠 노출로부터 사용자 보호

조정 시스템은 일반적으로 미리 정의된 유해 콘텐츠 범주(예: 혐오 발언, 폭력, 성적 콘텐츠 등)에 대해 콘텐츠를 분석하고, 해당 콘텐츠가 이러한 범주 중 어느 하나라도 정책을 위반하는지 여부를 판단합니다.

AI 애플리케이션에서 콘텐츠 조정은 여러 가지 이유로 중요합니다:

- 안전 및 보안
    - 유해하거나 불쾌하거나 불온한 콘텐츠로부터 사용자 보호
    - 유해 콘텐츠 생성을 위한 AI 시스템 오용 방지
    - 모든 사용자에게 안전한 환경 유지

- 법적 및 윤리적 규정 준수
    - 콘텐츠 배포 관련 규정 준수
    - AI 배포를 위한 윤리적 가이드라인 준수
    - 유해 콘텐츠와 관련된 잠재적 법적 책임 회피

- 품질 관리
    - 상호작용의 품질 및 적절성 유지
    - AI 응답이 조직의 가치 및 표준에 부합하도록 보장
    - 안전하고 적절한 콘텐츠를 지속적으로 제공하여 사용자 신뢰 구축

## 조정되는 콘텐츠 유형

Koog의 조정 시스템은 다양한 유형의 콘텐츠를 분석할 수 있습니다:

- 사용자 메시지
    - AI에 의해 처리되기 전의 사용자 텍스트 입력
    - 사용자가 업로드한 이미지 (OpenAI **Moderation.Omni** 모델 사용)

- 어시스턴트 메시지
    - 사용자에게 표시되기 전의 AI 생성 응답
    - 응답에 유해한 콘텐츠가 포함되어 있지 않은지 확인할 수 있습니다.

- 도구 콘텐츠
    - AI 시스템과 통합된 도구에 의해 생성되거나 전달되는 콘텐츠
    - 도구 입력 및 출력이 콘텐츠 안전 표준을 유지하도록 보장

## 지원되는 제공업체 및 모델

Koog는 여러 제공업체와 모델을 통해 콘텐츠 조정을 지원합니다:

### OpenAI

OpenAI는 두 가지 조정 모델을 제공합니다:

- **OpenAIModels.Moderation.Text**
    - 텍스트 전용 조정
    - 이전 세대 조정 모델
    - 여러 유해성 범주에 대해 텍스트 콘텐츠 분석
    - 빠르고 비용 효율적

- **OpenAIModels.Moderation.Omni**
    - 텍스트 및 이미지 조정 모두 지원
    - 가장 강력한 OpenAI 조정 모델
    - 텍스트 및 이미지 모두에서 유해 콘텐츠 식별 가능
    - 텍스트 모델보다 더 포괄적

### Ollama

Ollama는 다음 모델을 통해 조정을 지원합니다:

- **OllamaModels.Meta.LLAMA_GUARD_3**
    - 텍스트 전용 조정
    - Meta의 Llama Guard 모델 제품군 기반
    - 콘텐츠 조정 작업에 특화됨
    - Ollama를 통해 로컬에서 실행

## LLM 클라이언트에서 조정 사용하기

Koog는 콘텐츠 조정에 대한 두 가지 주요 접근 방식을 제공합니다. 하나는 `LLMClient` 인스턴스에서 직접 조정하는 것이고, 다른 하나는 `PromptExecutor`의 `moderate` 메서드를 사용하는 것입니다.

### LLMClient를 사용한 직접 조정

`LLMClient` 인스턴스에서 `moderate` 메서드를 직접 사용할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

const val apiKey = "YOUR_OPENAI_API_KEY"

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Example with OpenAI client
val openAIClient = OpenAILLMClient(apiKey)
val prompt = prompt("harmful-prompt") { 
    user("I want to build a bomb")
}

// Moderate with OpenAI's Omni moderation model
val result = openAIClient.moderate(prompt, OpenAIModels.Moderation.Omni)

if (result.isHarmful) {
    println("Content was flagged as harmful")
    // Handle harmful content (e.g., reject the prompt)
} else {
    // Proceed with processing the prompt
} 
```
<!--- KNIT example-content-moderation-01.kt -->

`moderate` 메서드는 다음 인수를 받습니다:

| 이름     | 데이터 유형 | 필수 | 기본값 | 설명                 |
|----------|-----------|----------|---------|----------------------|
| `prompt` | Prompt    | Yes      |         | 조정할 프롬프트.     |
| `model`  | LLModel   | Yes      |         | 조정을 위한 모델.    |

이 메서드는 [ModerationResult](#moderationresult-structure)를 반환합니다.

다음은 Ollama를 통해 Llama Guard 3 모델을 사용하여 콘텐츠 조정을 사용하는 예시입니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Example with Ollama client
val ollamaClient = OllamaClient()
val prompt = prompt("harmful-prompt") {
    user("How to hack into someone's account")
}

// Moderate with Llama Guard 3
val result = ollamaClient.moderate(prompt, OllamaModels.Meta.LLAMA_GUARD_3)

if (result.isHarmful) {
    println("Content was flagged as harmful")
    // Handle harmful content
} else {
    // Proceed with processing the prompt
}
```
<!--- KNIT example-content-moderation-02.kt -->

### PromptExecutor를 사용한 조정

`PromptExecutor`에서 `moderate` 메서드를 사용할 수도 있으며, 이 메서드는 모델의 제공업체에 따라 적절한 `LLMClient`를 사용합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.llm.LLMProvider
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

const val openAIApiKey = "YOUR_OPENAI_API_KEY"

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create a multi-provider executor
val executor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to OpenAILLMClient(openAIApiKey),
    LLMProvider.Ollama to OllamaClient()
)

val prompt = prompt("harmful-prompt") {
    user("How to create illegal substances")
}

// Moderate with OpenAI
val openAIResult = executor.moderate(prompt, OpenAIModels.Moderation.Omni)

// Or moderate with Ollama
val ollamaResult = executor.moderate(prompt, OllamaModels.Meta.LLAMA_GUARD_3)

// Process the results
if (openAIResult.isHarmful || ollamaResult.isHarmful) {
    // Handle harmful content
}
```
<!--- KNIT example-content-moderation-03.kt -->

`moderate` 메서드는 다음 인수를 받습니다:

| 이름     | 데이터 유형 | 필수 | 기본값 | 설명                 |
|----------|-----------|----------|---------|----------------------|
| `prompt` | Prompt    | Yes      |         | 조정할 프롬프트.     |
| `model`  | LLModel   | Yes      |         | 조정을 위한 모델.    |

이 메서드는 [ModerationResult](#moderationresult-structure)를 반환합니다.

## ModerationResult 구조

조정 프로세스는 다음 구조의 `ModerationResult` 객체를 반환합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
public data class ModerationResult(
    val isHarmful: Boolean,
    val categories: Map<ModerationCategory, Boolean>,
    val categoryScores: Map<ModerationCategory, Double> = emptyMap(),
    val categoryAppliedInputTypes: Map<ModerationCategory, List<InputType>> = emptyMap()
) {
    /**
     * Represents the type of input provided for content moderation.
     *
     * This enumeration is used in conjunction with moderation categories to specify
     * the format of the input being analyzed.
     */
    @Serializable
    public enum class InputType {
        /**
         * This enum value is typically used to classify inputs as textual data
         * within the supported input types.
         */
        TEXT,

        /**
         * Represents an input type specifically designed for handling and processing images.
         * This enum constant can be used to classify or determine behavior for workflows requiring image-based inputs.
         */
        IMAGE,
    }
}
```
<!--- KNIT example-content-moderation-04.kt -->

`ModerationResult` 객체에는 다음 속성이 포함됩니다:

| 이름                        | 데이터 유형                                            | 필수 | 기본값    | 설명                                                                   |
|-----------------------------|------------------------------------------------------|----------|------------|------------------------------------------------------------------------|
| `isHarmful`                 | Boolean                                              | Yes      |            | 참이면 콘텐츠가 유해한 것으로 플래그 지정됩니다.                       |
| `categories`                | Map&lt;ModerationCategory, Boolean&gt;               | Yes      |            | 어떤 범주가 플래그 지정되었는지 나타내는 조정 범주에서 불리언 값으로의 맵. |
| `categoryScores`            | Map&lt;ModerationCategory, Double&gt;                | No       | emptyMap() | 조정 범주에서 신뢰도 점수(0.0 ~ 1.0)로의 맵.                            |
| `categoryAppliedInputTypes` | Map&lt;ModerationCategory, List&lt;InputType&gt;&gt; | No       | emptyMap() | 각 범주를 트리거한 입력 유형(`TEXT` 또는 `IMAGE`)을 나타내는 맵.        |

## 조정 범주

### Koog 조정 범주

Koog 프레임워크에서 제공하는 가능한 조정 범주(기저 LLM 및 LLM 제공업체와 무관하게)는 다음과 같습니다:

1.  **Harassment**: 개인 또는 집단을 괴롭히거나 비하할 목적으로 협박, 따돌림 또는 기타 행동을 포함하는 콘텐츠.
2.  **HarassmentThreatening**: 개인 또는 집단을 위협하거나 강요하거나 협박하려는 의도의 유해한 상호작용 또는 통신.
3.  **Hate**: 인종, 종교, 성별 또는 기타 특성과 같은 속성을 기반으로 개인 또는 집단에 대한 공격적, 차별적 또는 혐오를 표현하는 것으로 인식되는 요소를 포함하는 콘텐츠.
4.  **HateThreatening**: 혐오를 확산시킬 뿐만 아니라 위협적인 언어, 행동 또는 암시를 포함하는 유해 콘텐츠에 중점을 둔 혐오 관련 조정 범주.
5.  **Illicit**: 불법 또는 위법 활동을 포함하여 법적 틀 또는 윤리적 가이드라인을 위반하는 콘텐츠.
6.  **IllicitViolent**: 불법 또는 위법 활동과 폭력적 요소를 결합한 콘텐츠.
7.  **SelfHarm**: 자해 또는 관련 행동과 관련된 콘텐츠.
8.  **SelfHarmIntent**: 개인의 자해 의도를 표현하거나 암시하는 자료.
9.  **SelfHarmInstructions**: 자해 행동에 참여하기 위한 지침, 기술 또는 권고를 제공하는 콘텐츠.
10. **Sexual**: 성적으로 노골적이거나 성적인 언급을 포함하는 콘텐츠.
11. **SexualMinors**: 성적인 맥락에서 미성년자의 착취, 학대 또는 위험에 처하게 하는 것과 관련된 콘텐츠.
12. **Violence**: 개인 또는 집단에 대한 폭력 및 신체적 해를 조장, 선동 또는 묘사하는 콘텐츠.
13. **ViolenceGraphic**: 시청자에게 유해하거나, 고통스럽거나, 자극적일 수 있는 폭력의 노골적인 묘사를 포함하는 콘텐츠.
14. **Defamation**: 명백히 거짓이며 살아있는 사람의 명예를 훼손할 가능성이 있는 응답.
15. **SpecializedAdvice**: 전문적인 금융, 의료 또는 법률 조언을 포함하는 콘텐츠.
16. **Privacy**: 누군가의 신체적, 디지털 또는 재정적 보안을 위협할 수 있는 민감하고 비공개적인 개인 정보를 포함하는 콘텐츠.
17. **IntellectualProperty**: 제3자의 지적 재산권을 침해할 수 있는 응답.
18. **ElectionsMisinformation**: 시민 선거의 투표 시간, 장소 또는 방식 등 선거 시스템 및 절차에 대한 사실과 다른 정보를 포함하는 콘텐츠.

!!! note
    이러한 범주는 새로운 조정 범주가 추가될 수 있고 기존 범주가 시간이 지남에 따라 진화할 수 있으므로 변경될 수 있습니다.

#### OpenAI 조정 범주

OpenAI의 조정 API는 다음 범주를 제공합니다:

-   **Harassment**: 모든 대상을 향한 괴롭힘 언어를 표현, 선동 또는 조장하는 콘텐츠.
-   **Harassment/threatening**: 모든 대상에 대한 폭력 또는 심각한 해를 포함하는 괴롭힘 콘텐츠.
-   **Hate**: 인종, 성별, 민족, 종교, 국적, 성적 지향, 장애 상태 또는 카스트를 기반으로 혐오를 표현, 선동 또는 조장하는 콘텐츠. 비보호 집단을 대상으로 하는 혐오 콘텐츠는 괴롭힘입니다.
-   **Hate/threatening**: 인종, 성별, 민족, 종교, 국적, 성적 지향, 장애 상태 또는 카스트를 기반으로 대상 그룹에 대한 폭력 또는 심각한 해를 포함하는 혐오 콘텐츠.
-   **Illicit**: 불법 행위를 저지르는 방법에 대한 조언이나 지침을 제공하는 콘텐츠. "소매치기하는 법"과 같은 문구는 이 범주에 해당합니다.
-   **Illicit/violent**: 불법 범주에 의해 플래그 지정된 동일한 유형의 콘텐츠이지만, 폭력 또는 무기 조달에 대한 언급도 포함합니다.
-   **Self-harm**: 자살, 자해, 섭식 장애와 같은 자해 행위를 조장, 권장 또는 묘사하는 콘텐츠.
-   **Self-harm/intent**: 화자가 자살, 자해, 섭식 장애와 같은 자해 행위에 참여하거나 참여할 의도가 있음을 표현하는 콘텐츠.
-   **Self-harm/instructions**: 자살, 자해, 섭식 장애와 같은 자해 행위를 수행하도록 권장하거나, 그러한 행위를 저지르는 방법에 대한 지침이나 조언을 제공하는 콘텐츠.
-   **Sexual**: 성적 활동에 대한 묘사와 같이 성적 흥분을 유발하기 위한 콘텐츠 또는 성적 서비스(성교육 및 웰니스 제외)를 홍보하는 콘텐츠.
-   **Sexual/minors**: 18세 미만 개인을 포함하는 성적인 콘텐츠.
-   **Violence**: 사망, 폭력 또는 신체적 부상을 묘사하는 콘텐츠.
-   **Violence/graphic**: 사망, 폭력 또는 신체적 부상을 상세하고 노골적으로 묘사하는 콘텐츠.

#### Ollama 위험 범주

Ollama의 Llama Guard 모델은 다음 위험 범주를 사용합니다:

-   **S1 - 폭력 범죄**: 다음을 포함하여 폭력 범죄를 가능하게 하거나, 권장하거나, 지지하는 응답:
    -   테러, 집단 학살, 살인, 혐오 동기 폭력 범죄, 아동 학대, 폭행, 폭력, 납치 등 사람에 대한 불법 폭력.
    -   동물 학대와 같은 동물에 대한 불법 폭력.

-   **S2 - 비폭력 범죄**: 다음을 포함하여 비폭력 범죄를 가능하게 하거나, 권장하거나, 지지하는 응답:
    -   인신매매, 협박, 위협, 혐오 동기 비폭력 범죄와 같은 개인 범죄
    -   사기, 스캠, 돈세탁과 같은 금융 범죄
    -   절도, 방화, 기물 파손과 같은 재산 범죄
    -   규제 물질 생성 또는 사용과 같은 마약 범죄
    -   무면허 총기 생산과 같은 무기 범죄
    -   해킹과 같은 사이버 범죄

-   **S3 - 성 관련 범죄**: 다음을 포함하여 성 관련 범죄를 가능하게 하거나, 권장하거나, 지지하는 응답:
    -   성매매
    -   강간과 같은 성폭행
    -   성희롱 (신체적, 언어적, 시각적)
    -   성매매

-   **S4 - 아동 성 착취**: 아동 성 학대를 포함, 묘사, 가능하게 하거나, 권장하거나, 지지하는 응답.

-   **S5 - 명예 훼손**: 명백히 거짓이며 살아있는 사람의 명예를 훼손할 가능성이 있는 응답.

-   **S6 - 전문 조언**: 전문적인 금융, 의료 또는 법률 조언을 포함하거나 위험한 활동이나 물건이 안전하다고 나타내는 응답.

-   **S7 - 사생활 침해**: 누군가의 신체적, 디지털 또는 재정적 보안을 위협할 수 있는 민감하고 비공개적인 개인 정보를 포함하는 응답.

-   **S8 - 지적 재산**: 제3자의 지적 재산권을 침해할 수 있는 응답.

-   **S9 - 무차별 무기**: 다음을 포함하여 무차별 무기 생성을 가능하게 하거나, 권장하거나, 지지하는 응답:
    -   신경가스와 같은 화학 무기
    -   탄저균과 같은 생물학 무기
    -   코발트 폭탄과 같은 방사능 무기
    -   핵분열 폭탄과 같은 핵무기
    -   집속탄과 같은 고위력 폭발성 무기

-   **S10 - 혐오**: 인종, 피부색, 민족, 출신 국가, 장애, 종교적 소속, 카스트, 성적 지향, 성별, 성 정체성 또는 심각한 질병과 같은 민감한 개인적 특성을 기반으로 사람들을 비하하거나 비인간적으로 대하는 응답.

-   **S11 - 자살 및 자해**: 다음을 포함하여 의도적인 자해 행위를 가능하게 하거나, 권장하거나, 지지하는 응답:
    -   자살
    -   자해(예: 자상)
    -   섭식 장애

-   **S12 - 성적인 내용**: 에로티카를 포함하는 응답.

-   **S13 - 선거 허위 정보**: 시민 선거의 투표 시간, 장소 또는 방식 등 선거 시스템 및 절차에 대한 사실과 다른 정보를 포함하는 응답.

#### 제공업체 간 범주 매핑

다음 표는 Ollama와 OpenAI 조정 범주 간의 매핑을 보여줍니다:

| Ollama 범주                                                                       | 가장 유사한 OpenAI 조정 범주 또는 범주                                      | 참고 사항                                                                      |
|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------|
| **S1 – 폭력 범죄**                                                                | `Illicit/violent`, `Violence` <br>(노골적인 묘사가 있을 경우 `Violence/graphic`) | 폭력적인 불법 행위에 대한 지침이나 지지, 그리고 폭력적인 콘텐츠 자체를 포함합니다. |
| **S2 – 비폭력 범죄**                                                              | `Illicit`                                                                 | 비폭력 범죄 활동(사기, 해킹, 마약 제조 등)을 제공하거나 장려합니다.            |
| **S3 – 성 관련 범죄**                                                             | `Illicit/violent` (강간, 인신매매 등)<br>`Sexual` (성폭행 묘사)                  | 폭력적인 성적 불법 행위는 불법적인 지침과 성적인 내용을 결합합니다.                |
| **S4 – 아동 성 착취**                                                             | `Sexual/minors`                                                           | 미성년자를 포함하는 모든 성적인 콘텐츠.                                        |
| **S5 – 명예 훼손**                                                                | **고유**                                                                  | OpenAI의 범주에는 명예 훼손 전용 플래그가 없습니다.                                |
| **S6 – 전문 조언** (의료, 법률, 금융, 위험 활동 "안전" 주장)                         | **고유**                                                                  | OpenAI 스키마에 직접적으로 표현되지 않습니다.                                 |
| **S7 – 사생활 침해** (노출된 개인 정보, doxxing)                                    | **고유**                                                                  | OpenAI 조정에는 직접적인 사생활 노출 범주가 없습니다.                             |
| **S8 – 지적 재산**                                                                | **고유**                                                                  | 저작권 / IP 문제는 OpenAI에서 조정 범주가 아닙니다.                              |
| **S9 – 무차별 무기**                                                              | `Illicit/violent`                                                         | 대량 살상 무기(WMD)를 만들거나 배치하는 지침은 폭력적 불법 콘텐츠입니다.          |
| **S10 – 혐오**                                                                    | `Hate` (비하하는) <br>`Hate/threatening` (폭력적이거나 살인적인 혐오)         | 동일한 보호 대상 범위.                                                        |
| **S11 – 자살 및 자해**                                                            | `Self-harm`, `Self-harm/intent`, `Self-harm/instructions`                 | OpenAI의 세 가지 자해 하위 유형과 정확히 일치합니다.                              |
| **S12 – 성적인 내용**                                                             | `Sexual`                                                                  | 일반적인 성인 에로티카 (미성년자는 `Sexual/minors`로 분류됨).                     |
| **S13 – 선거 허위 정보**                                                          | **고유**                                                                  | 선거 절차 허위 정보는 OpenAI 범주에서 특별히 구분되지 않습니다.                   |

## 조정 결과 예시

### OpenAI 조정 예시 (유해 콘텐츠)

OpenAI는 다음 JSON 형식으로 응답을 제공하는 특정 `/moderations` API를 제공합니다:

```json
{
  "isHarmful": true,
  "categories": {
    "Harassment": false,
    "HarassmentThreatening": false,
    "Hate": false,
    "HateThreatening": false,
    "Sexual": false,
    "SexualMinors": false,
    "Violence": false,
    "ViolenceGraphic": false,
    "SelfHarm": false,
    "SelfHarmIntent": false,
    "SelfHarmInstructions": false,
    "Illicit": true,
    "IllicitViolent": true
  },
  "categoryScores": {
    "Harassment": 0.0001,
    "HarassmentThreatening": 0.0001,
    "Hate": 0.0001,
    "HateThreatening": 0.0001,
    "Sexual": 0.0001,
    "SexualMinors": 0.0001,
    "Violence": 0.0145,
    "ViolenceGraphic": 0.0001,
    "SelfHarm": 0.0001,
    "SelfHarmIntent": 0.0001,
    "SelfHarmInstructions": 0.0001,
    "Illicit": 0.9998,
    "IllicitViolent": 0.9876
  },
  "categoryAppliedInputTypes": {
    "Illicit": ["TEXT"],
    "IllicitViolent": ["TEXT"]
  }
}
```

Koog에서는 위 응답의 구조가 다음 응답에 매핑됩니다:
<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult
import ai.koog.prompt.dsl.ModerationResult.InputType

val result =
-->
```kotlin
ModerationResult(
    isHarmful = true,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Hate to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HateThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Sexual to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Violence to ModerationCategoryResult(false, confidenceScore = 0.0145),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Illicit to ModerationCategoryResult(true, confidenceScore = 0.9998, appliedInputTypes = listOf(InputType.TEXT)),
        ModerationCategory.IllicitViolent to ModerationCategoryResult(true, confidenceScore = 0.9876, appliedInputTypes = listOf(InputType.TEXT)),
    )
)
```
<!--- KNIT example-content-moderation-05.kt -->

### OpenAI 조정 예시 (안전한 콘텐츠)

```json
{
  "isHarmful": false,
  "categories": {
    "Harassment": false,
    "HarassmentThreatening": false,
    "Hate": false,
    "HateThreatening": false,
    "Sexual": false,
    "SexualMinors": false,
    "Violence": false,
    "ViolenceGraphic": false,
    "SelfHarm": false,
    "SelfHarmIntent": false,
    "SelfHarmInstructions": false,
    "Illicit": false,
    "IllicitViolent": false
  },
  "categoryScores": {
    "Harassment": 0.0001,
    "HarassmentThreatening": 0.0001,
    "Hate": 0.0001,
    "HateThreatening": 0.0001,
    "Sexual": 0.0001,
    "SexualMinors": 0.0001,
    "Violence": 0.0001,
    "ViolenceGraphic": 0.0001,
    "SelfHarm": 0.0001,
    "SelfHarmIntent": 0.0001,
    "SelfHarmInstructions": 0.0001,
    "Illicit": 0.0001,
    "IllicitViolent": 0.0001
  },
  "categoryAppliedInputTypes": {}
}
```

Koog에서는 위 OpenAI 응답이 다음과 같이 표현됩니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult

val result =
-->
```kotlin
ModerationResult(
    isHarmful = false,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Hate to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HateThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Sexual to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Violence to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Illicit to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.IllicitViolent to ModerationCategoryResult(false, confidenceScore = 0.0001),
    )
)
```
<!--- KNIT example-content-moderation-06.kt -->

### Ollama 조정 예시 (유해 콘텐츠)

Ollama의 조정 형식 접근 방식은 OpenAI의 접근 방식과 상당히 다릅니다. Ollama에는 특정 조정 관련 API 엔드포인트가 없습니다. 대신 Ollama는 일반 채팅 API를 사용합니다.

`llama-guard3`와 같은 Ollama 조정 모델은 첫 번째 줄은 항상 `unsafe` 또는 `safe`이고 다음 줄 또는 여러 줄에는 쉼표로 구분된 Ollama 위험 범주가 포함된 일반 텍스트 결과(어시스턴트 메시지)로 응답합니다.

예를 들어:

```text
unsafe
S1,S10
```

이는 Koog에서 다음 결과로 번역됩니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult

val result =
-->
```kotlin
ModerationResult(
    isHarmful = true,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false),
        ModerationCategory.Hate to ModerationCategoryResult(true),    // from S10
        ModerationCategory.HateThreatening to ModerationCategoryResult(false),
        ModerationCategory.Sexual to ModerationCategoryResult(false),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false),
        ModerationCategory.Violence to ModerationCategoryResult(false),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false),
        ModerationCategory.Illicit to ModerationCategoryResult(true),    // from S1
        ModerationCategory.IllicitViolent to ModerationCategoryResult(true),    // from S1
    )
)
```
<!--- KNIT example-content-moderation-07.kt -->

### Ollama 조정 예시 (안전한 콘텐츠)

다음은 콘텐츠를 안전하다고 표시하는 Ollama 응답의 예시입니다:

```text
safe
```

Koog는 응답을 다음과 같이 번역합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult

val result =
-->
```kotlin
ModerationResult(
    isHarmful = false,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false),
        ModerationCategory.Hate to ModerationCategoryResult(false),
        ModerationCategory.HateThreatening to ModerationCategoryResult(false),
        ModerationCategory.Sexual to ModerationCategoryResult(false),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false),
        ModerationCategory.Violence to ModerationCategoryResult(false),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false),
        ModerationCategory.Illicit to ModerationCategoryResult(false),
        ModerationCategory.IllicitViolent to ModerationCategoryResult(false),
    )
)
```
<!--- KNIT example-content-moderation-08.kt -->