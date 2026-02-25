---
search:
  exclude: true
---

# --8<-- [start:heading]
|파라미터|타입| 설명 |
|---------|----|-------------|
# --8<-- [end:heading]

# --8<-- [start:topP]
| `topP` | Double | 핵심 샘플링(nucleus sampling)이라고도 합니다. 확률 값의 합이 지정된 `topP` 값에 도달할 때까지 가장 높은 확률 값을 가진 토큰들을 추가하여 다음 토큰의 하위 집합을 생성합니다. 0.0보다 크고 1.0보다 작거나 같은 값을 가집니다. |
# --8<-- [end:topP]

# --8<-- [start:logprobs]
| `logprobs` | Boolean | `true`인 경우, 출력 토큰에 대한 로그 확률(log-probabilities)을 포함합니다. |
# --8<-- [end:logprobs]

# --8<-- [start:topLogprobs]
| `topLogprobs` | Integer | 각 위치에서 가장 가능성이 높은 상위 토큰의 개수입니다. 0–20 사이의 값을 가집니다. `logprobs` 파라미터가 `true`로 설정되어야 합니다. |
# --8<-- [end:topLogprobs]

# --8<-- [start:frequencyPenalty]
| `frequencyPenalty` | Double | 빈번하게 나타나는 토큰에 페널티를 부여하여 반복을 줄입니다. `frequencyPenalty` 값이 높을수록 표현의 변화가 많아지고 반복이 줄어듭니다. -2.0에서 2.0 사이의 값을 가집니다. |
# --8<-- [end:frequencyPenalty]

# --8<-- [start:presencePenalty]
| `presencePenalty` | Double | 모델이 이미 출력에 포함된 토큰을 다시 사용하는 것을 방지합니다. 값이 높을수록 새로운 토큰과 주제의 도입을 장려합니다. -2.0에서 2.0 사이의 값을 가집니다. |
# --8<-- [end:presencePenalty]

# --8<-- [start:stop]
| `stop` | List&lt;String&gt; | 모델이 해당 문자열 중 하나라도 만나면 콘텐츠 생성을 중단해야 함을 알리는 문자열 리스트입니다. 예를 들어, 두 개의 줄바꿈이 발생할 때 생성을 중단하게 하려면 중단 시퀀스를 `stop = listOf("/n/n")`와 같이 지정합니다. |
# --8<-- [end:stop]

# --8<-- [start:parallelToolCalls]
| `parallelToolCalls` | Boolean | `true`인 경우, 여러 도구 호출을 병렬로 실행할 수 있습니다. 특히 에이전트 전략 이외의 커스텀 노드나 LLM 상호작용에 적용됩니다. |
# --8<-- [end:parallelToolCalls]

# --8<-- [start:promptCacheKey]
| `promptCacheKey` | String | 프롬프트 캐싱을 위한 고유한 캐시 키입니다. OpenAI는 이를 사용하여 유사한 요청에 대한 응답을 캐시합니다. |
# --8<-- [end:promptCacheKey]

# --8<-- [start:safetyIdentifier]
| `safetyIdentifier` | String | OpenAI 정책을 위반하는 사용자를 감지하는 데 사용될 수 있는 고유하고 안정적인 사용자 식별자입니다. |
# --8<-- [end:safetyIdentifier]

# --8<-- [start:serviceTier]
| `serviceTier` | ServiceTier | 비용보다 성능을 우선시하거나 그 반대로 설정할 수 있는 OpenAI 처리 티어 선택입니다. 자세한 내용은 [ServiceTier](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ServiceTier) API 문서를 참조하세요. |
# --8<-- [end:serviceTier]

# --8<-- [start:store]
| `store` | Boolean | `true`인 경우, 제공자가 나중에 회수할 수 있도록 출력을 저장할 수 있습니다. |
# --8<-- [end:store]

# --8<-- [start:audio]
| `audio` | OpenAIAudioConfig | 오디오 지원 모델을 사용할 때의 오디오 출력 구성입니다. 자세한 내용은 [OpenAIAudioConfig](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIAudioConfig) API 문서를 참조하세요. |
# --8<-- [end:audio]

# --8<-- [start:reasoningEffort]
| `reasoningEffort` | ReasoningEffort | 모델이 사용할 추론 노력(reasoning effort) 수준을 지정합니다. 자세한 내용 및 사용 가능한 값은 [ReasoningEffort](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ReasoningEffort) API 문서를 참조하세요. |
# --8<-- [end:reasoningEffort]

# --8<-- [start:webSearchOptions]
| `webSearchOptions` | OpenAIWebSearchOptions | 웹 검색 도구 사용을 구성합니다(지원되는 경우). 자세한 내용은 [OpenAIWebSearchOptions](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIWebSearchOptions) API 문서를 참조하세요. |
# --8<-- [end:webSearchOptions]

# --8<-- [start:background]
| `background` | Boolean | 백그라운드에서 응답을 실행합니다. |
# --8<-- [end:background]

# --8<-- [start:include]
| `include` | List&lt;OpenAIInclude&gt; | 웹 검색 도구 호출의 소스나 파일 검색 도구 호출의 검색 결과와 같이 모델 응답에 포함할 추가 데이터입니다. 자세한 참조 정보는 Koog API 참조의 [OpenAIInclude](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.OpenAIInclude)를 확인하세요. `include` 파라미터에 대해 자세히 알아보려면 [OpenAI 문서](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include)를 참조하세요. |
# --8<-- [end:include]

# --8<-- [start:maxToolCalls]
| `maxToolCalls` | Integer | 이 응답에서 허용되는 내장 도구 호출의 최대 총 횟수입니다. `0`보다 크거나 같은 값을 가집니다. |
# --8<-- [end:maxToolCalls]

# --8<-- [start:reasoning]
| `reasoning` | ReasoningConfig | 추론 가능 모델을 위한 추론 구성입니다. 자세한 내용은 [ReasoningConfig](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.ReasoningConfig) API 문서를 참조하세요. |
# --8<-- [end:reasoning]

# --8<-- [start:truncation]
| `truncation` | Truncation | 컨텍스트 윈도우에 근접했을 때의 자르기(truncation) 전략입니다. 자세한 내용은 [Truncation](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.Truncation) API 문서를 참조하세요. |
# --8<-- [end:truncation]

# --8<-- [start:topK]
| `topK` | Integer | 출력을 생성할 때 고려할 상위 토큰의 개수입니다. 0보다 크거나 같은 값을 가집니다(제공자별 최소값이 적용될 수 있음). |
# --8<-- [end:topK]

# --8<-- [start:repetitionPenalty]
| `repetitionPenalty` | Double | 토큰 반복에 페널티를 부여합니다. 이미 출력에 나타난 토큰의 다음 토큰 확률을 `repetitionPenalty` 값으로 나눕니다. `repetitionPenalty > 1`인 경우 해당 토큰이 다시 나타날 가능성이 낮아집니다. 0.0보다 크고 2.0보다 작거나 같은 값을 가집니다. |
# --8<-- [end:repetitionPenalty]

# --8<-- [start:minP]
| `minP` | Double | 가장 가능성이 높은 토큰에 대한 상대적 확률이 정의된 `minP` 값 미만인 토큰을 필터링합니다. 0.0–0.1 범위의 값을 가집니다. |
# --8<-- [end:minP]

# --8<-- [start:topA]
| `topA` | Double | 모델의 확신도에 따라 샘플링 윈도우를 동적으로 조정합니다. 모델이 확신하는 경우(지배적인 고확률 다음 토큰이 있는 경우) 샘플링 윈도우를 소수의 상위 토큰으로 제한합니다. 확신도가 낮은 경우(확률이 비슷한 토큰이 많은 경우) 샘플링 윈도우에 더 많은 토큰을 유지합니다. 0.0–0.1(포함) 범위의 값을 가집니다. 값이 높을수록 동적 적응 폭이 커집니다. |
# --8<-- [end:topA]

# --8<-- [start:transforms]
| `transforms` | List&lt;String&gt; | 컨텍스트 변환 리스트입니다. 컨텍스트가 모델의 토큰 제한을 초과할 때 변환되는 방식을 정의합니다. 기본 변환은 프롬프트의 중간부터 자르는 `middle-out`입니다. 변환을 사용하지 않으려면 빈 리스트를 사용하세요. 자세한 내용은 OpenRouter 문서의 [Message Transforms](https://openrouter.ai/docs/guides/features/message-transforms)를 참조하세요. |
# --8<-- [end:transforms]

# --8<-- [start:models]
| `models` | List&lt;String&gt; | 요청에 허용되는 모델 리스트입니다. |
# --8<-- [end:models]

# --8<-- [start:route]
| `route` | String | 사용할 요청 라우팅 전략입니다. |
# --8<-- [end:route]

# --8<-- [start:provider]
| `provider` | ProviderPreferences | OpenRouter가 사용할 LLM 제공자를 선택하는 방식을 명시적으로 제어할 수 있는 다양한 파라미터를 포함합니다. 자세한 내용은 [ProviderPreferences](api:prompt-executor-openrouter-client::ai.koog.prompt.executor.clients.openrouter.models.ProviderPreferences) API 문서를 참조하세요. |
# --8<-- [end:provider]

# --8<-- [start:stopSequences]
| `stopSequences` | List&lt;String&gt; | 모델이 콘텐츠 생성을 중단하게 만드는 커스텀 텍스트 시퀀스입니다. 일치하는 경우 응답의 `stop_reason` 값은 `stop_sequence`가 됩니다. |
# --8<-- [end:stopSequences]

# --8<-- [start:container]
| `container`  | String | 요청 간 재사용을 위한 컨테이너 식별자입니다. 컨테이너는 Anthropic의 코드 실행 도구에서 안전하고 컨테이너화된 코드 실행 환경을 제공하는 데 사용됩니다. 이전 응답의 컨테이너 식별자를 제공하면 여러 요청에서 컨테이너를 재사용할 수 있으며, 이를 통해 요청 간에 생성된 파일을 보존할 수 있습니다. 자세한 내용은 Anthropic 문서의 [Containers](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#containers)를 참조하세요. |
# --8<-- [end:container]

# --8<-- [start:mcpServers]
| `mcpServers` | List&lt;AnthropicMCPServerURLDefinition&gt; | 요청에서 사용될 MCP 서버의 정의입니다. 최대 20개의 서버를 지원합니다. 자세한 내용은 [AnthropicMCPServerURLDefinition](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicMCPServerURLDefinition) API 참조를 확인하세요. |
# --8<-- [end:mcpServers]

# --8<-- [start:serviceTier]
| `serviceTier` | AnthropicServiceTier | 요청에 우선순위 용량(사용 가능한 경우)을 사용할지 표준 용량을 사용할지 결정합니다. 자세한 내용은 [AnthropicServiceTier](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicServiceTier) API 참조 및 Anthropic의 [Service tiers](https://platform.claude.com/docs/en/api/service-tiers) 문서를 확인하세요. |
# --8<-- [end:serviceTier]

# --8<-- [start:thinking]
| `thinking` | AnthropicThinking | Claude의 확장 사고(extended thinking) 활성화를 위한 구성입니다. 활성화되면 응답에 사고 콘텐츠 블록도 포함됩니다. 자세한 내용은 [AnthropicThinking](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicThinking) API 참조를 확인하세요. |
# --8<-- [end:thinking]

# --8<-- [start:thinkingConfig]
| `thinkingConfig` | GoogleThinkingConfig | 모델이 사고 과정(chain-of-thought)을 노출할지 여부와 여기에 소비할 수 있는 최대 토큰 수를 제어합니다. 자세한 내용은 [GoogleThinkingConfig](api:prompt-executor-google-client::ai.koog.prompt.executor.clients.google.models.GoogleThinkingConfig) API 참조를 확인하세요. |
# --8<-- [end:thinkingConfig]

# --8<-- [start:enableSearch]
| `enableSearch` | Boolean | 웹 검색 기능 활성화 여부를 지정합니다. 자세한 내용은 Alibaba의 [Web search](https://www.alibabacloud.com/help/en/model-studio/web-search?spm=a2c63.p38356.0.i14) 문서를 확인하세요. |
# --8<-- [end:enableSearch]

# --8<-- [start:enableThinking]
| `enableThinking` | Boolean | 하이브리드 사고 모델을 사용할 때 사고 모드(thinking mode) 활성화 여부를 지정합니다. 자세한 내용은 Alibaba의 [Deep thinking](https://www.alibabacloud.com/help/en/model-studio/deep-thinking?spm=a2c63.p38356.0.i11) 문서를 확인하세요. |
# --8<-- [end:enableThinking]

# --8<-- [start:randomSeed]
| `randomSeed` | Integer | 무작위 샘플링에 사용할 시드(seed)입니다. 설정 시, 동일한 파라미터와 동일한 시드 값을 사용한 다른 호출은 결정론적인 결과를 생성합니다. |
# --8<-- [end:randomSeed]

# --8<-- [start:promptMode]
| `promptMode` | String | 추론 모드와 시스템 프롬프트 없음 사이를 전환할 수 있게 합니다. `reasoning`으로 설정하면 추론 모델용 기본 시스템 프롬프트가 사용됩니다. 자세한 내용은 Mistral의 [Reasoning](https://docs.mistral.ai/capabilities/reasoning) 문서를 확인하세요. |
# --8<-- [end:promptMode]

# --8<-- [start:safePrompt]
| `safePrompt` | Boolean | 모든 대화 전에 안전 프롬프트(safety prompt)를 주입할지 여부를 지정합니다. 안전 프롬프트는 가드레일을 적용하고 유해한 콘텐츠로부터 보호하는 데 사용됩니다. 자세한 내용은 Mistral의 [Moderation & Guardarailing](https://docs.mistral.ai/capabilities/guardrailing) 문서를 확인하세요. |
# --8<-- [end:safePrompt]