---
search:
  exclude: true
---

# --8<-- [start:heading]
|參數|型別| 描述 |
|---------|----|-------------|
# --8<-- [end:heading]

# --8<-- [start:topP]
| `topP` | Double | 也稱為核心取樣 (nucleus sampling)。透過將具有最高機率值的 token 加入子集，直到其機率總和達到指定的 `topP` 值，來建立下一個 token 的子集。取值範圍為大於 0.0 且小於等於 1.0。 |
# --8<-- [end:topP]

# --8<-- [start:logprobs]
| `logprobs` | Boolean | 如果為 `true`，則包含輸出 token 的對數機率 (log-probabilities)。 |
# --8<-- [end:logprobs]

# --8<-- [start:topLogprobs]
| `topLogprobs` | Integer | 每個位置最有可能的前幾個 token 數量。取值範圍為 0 到 20。需要將 `logprobs` 參數設定為 `true`。 |
# --8<-- [end:topLogprobs]

# --8<-- [start:frequencyPenalty]
| `frequencyPenalty` | Double | 懲罰頻繁出現的 token 以減少重複。較高的 `frequencyPenalty` 值會導致措辭變化更大，並減少重複。取值範圍為 -2.0 到 2.0。 |
# --8<-- [end:frequencyPenalty]

# --8<-- [start:presencePenalty]
| `presencePenalty` | Double | 防止模型重複使用已包含在輸出中的 token。較高的值鼓勵引入新的 token 和主題。取值範圍為 -2.0 到 2.0。 |
# --8<-- [end:presencePenalty]

# --8<-- [start:stop]
| `stop` | List&lt;String&gt; | 當模型遇到這些字串中的任何一個時，會停止生成內容。例如，若要讓模型在產生兩個換行符號時停止生成內容，請將停止序列指定為 `stop = listOf("/n/n")`。 |
# --8<-- [end:stop]

# --8<-- [start:parallelToolCalls]
| `parallelToolCalls` | Boolean | 如果為 `true`，則可以並行執行多個工具呼叫 (tool calls)。特別適用於自訂節點或代理程式策略 (agent strategies) 之外的 LLM 互動。 |
# --8<-- [end:parallelToolCalls]

# --8<-- [start:promptCacheKey]
| `promptCacheKey` | String | 用於提示快取 (prompt caching) 的穩定快取鍵。OpenAI 使用它來快取類似請求的回應。 |
# --8<-- [end:promptCacheKey]

# --8<-- [start:safetyIdentifier]
| `safetyIdentifier` | String | 一個穩定且唯一的使用者識別碼，可用於偵測違反 OpenAI 政策的使用者。 |
# --8<-- [end:safetyIdentifier]

# --8<-- [start:serviceTier]
| `serviceTier` | ServiceTier | OpenAI 處理層級 (processing tier) 的選擇，讓您可以在效能和成本之間進行優先排序，反之亦然。更多資訊請參閱 [ServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-service-tier/index.html) 的 API 文件。 |
# --8<-- [end:serviceTier]

# --8<-- [start:store]
| `store` | Boolean | 如果為 `true`，提供者可能會儲存輸出以供稍後擷取。 |
# --8<-- [end:store]

# --8<-- [start:audio]
| `audio` | OpenAIAudioConfig | 使用具備音訊功能模型時的音訊輸出配置。更多資訊請參閱 [OpenAIAudioConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-audio-config/index.html) 的 API 文件。 |
# --8<-- [end:audio]

# --8<-- [start:reasoningEffort]
| `reasoningEffort` | ReasoningEffort | 指定模型將使用的推理工作量級別。更多資訊及可用值請參閱 [ReasoningEffort](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-reasoning-effort/index.html) 的 API 文件。 |
# --8<-- [end:reasoningEffort]

# --8<-- [start:webSearchOptions]
| `webSearchOptions` | OpenAIWebSearchOptions | 配置網路搜尋工具 (web search tool) 的使用方式（如果支援）。更多資訊請參閱 [OpenAIWebSearchOptions](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-web-search-options/index.html) 的 API 文件。 |
# --8<-- [end:webSearchOptions]

# --8<-- [start:background]
| `background` | Boolean | 在背景執行回應。 |
# --8<-- [end:background]

# --8<-- [start:include]
| `include` | List&lt;OpenAIInclude&gt; | 要包含在模型回應中的額外資料，例如網路搜尋工具呼叫的來源或檔案搜尋工具呼叫的搜尋結果。詳細參考資訊請參閱 Koog API 參考文件中的 [OpenAIInclude](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-open-a-i-include/index.html)。要了解更多關於 `include` 參數的資訊，請參閱 [OpenAI 的文件](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include)。 |
# --8<-- [end:include]

# --8<-- [start:maxToolCalls]
| `maxToolCalls` | Integer | 此回應中允許的內建工具呼叫總數上限。取值為大於或等於 `0`。 |
# --8<-- [end:maxToolCalls]

# --8<-- [start:reasoning]
| `reasoning` | ReasoningConfig | 具備推理能力模型 (reasoning-capable models) 的推理配置。更多資訊請參閱 [ReasoningConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-reasoning-config/index.html) 的 API 文件。 |
# --8<-- [end:reasoning]

# --8<-- [start:truncation]
| `truncation` | Truncation | 當接近上下文視窗 (context window) 時的截斷策略。更多資訊請參閱 [Truncation](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-truncation/index.html) 的 API 文件。 |
# --8<-- [end:truncation]

# --8<-- [start:topK]
| `topK` | Integer | 生成輸出時要考慮的前幾個 token 數量。取值為大於或等於 0（可能適用於提供者特定的最小值）。 |
# --8<-- [end:topK]

# --8<-- [start:repetitionPenalty]
| `repetitionPenalty` | Double | 懲罰 token 重複。對於已出現在輸出中的 token，其下一個 token 的機率會被 `repetitionPenalty` 的值除以，如果 `repetitionPenalty > 1`，這會使它們再次出現的可能性降低。取值範圍為大於 0.0 且小於等於 2.0。 |
# --8<-- [end:repetitionPenalty]

# --8<-- [start:minP]
| `minP` | Double | 過濾掉相對於最有可能的 token，其相對機率低於定義的 `minP` 值的 token。取值範圍為 0.0 到 0.1。 |
# --8<-- [end:minP]

# --8<-- [start:topA]
| `topA` | Double | 根據模型置信度動態調整取樣視窗。如果模型有信心（存在主要的、高機率的下一個 token），它會將取樣視窗限制在少數幾個頂級 token。如果置信度較低（存在許多機率相似的 token），則會在取樣視窗中保留更多 token。取值範圍為 0.0 到 0.1（含）。值越高表示動態適應性越強。 |
# --8<-- [end:topA]

# --8<-- [start:transforms]
| `transforms` | List&lt;String&gt; | 上下文轉換 (context transforms) 列表。定義當上下文超出模型的 token 限制時如何轉換上下文。預設轉換為 `middle-out`，它從提示的中間截斷。使用空列表表示不進行任何轉換。更多資訊請參閱 OpenRouter 文件中的 [Message Transforms](https://openrouter.ai/docs/guides/features/message-transforms)。 |
# --8<-- [end:transforms]

# --8<-- [start:models]
| `models` | List&lt;String&gt; | 請求允許的模型列表。 |
# --8<-- [end:models]

# --8<-- [start:route]
| `route` | String | 要使用的請求路由策略。 |
# --8<-- [end:route]

# --8<-- [start:provider]
| `provider` | ProviderPreferences | 包含一系列參數，讓您可以明確控制 OpenRouter 如何選擇要使用的 LLM 提供者。更多資訊請參閱 [ProviderPreferences](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter.models/-provider-preferences/index.html) 的 API 文件。 |
# --8<-- [end:provider]

# --8<-- [start:stopSequences]
| `stopSequences` | List&lt;String&gt; | 導致模型停止生成內容的自訂文字序列。如果匹配，回應中的 `stop_reason` 值為 `stop_sequence`。 |
# --8<-- [end:stopSequences]

# --8<-- [start:container]
| `container`  | String | 跨請求重用的容器識別碼。容器由 Anthropic 的程式碼執行工具使用，以提供安全且容器化的程式碼執行環境。透過提供先前回應中的容器識別碼，您可以在多個請求中重用容器，這會保留請求之間建立的檔案。更多資訊請參閱 Anthropic 文件中的 [Containers](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#containers)。 |
# --8<-- [end:container]

# --8<-- [start:mcpServers]
| `mcpServers` | List&lt;AnthropicMCPServerURLDefinition&gt; | 請求中要使用的 MCP 伺服器定義。最多支援 20 個伺服器。更多資訊請參閱 [AnthropicMCPServerURLDefinition](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-m-c-p-server-u-r-l-definition/index.html) 的 API 參考文件。 |
# --8<-- [end:mcpServers]

# --8<-- [start:serviceTier]
| `serviceTier` | AnthropicServiceTier | 決定請求是使用優先容量（如果可用）還是標準容量。更多資訊請參閱 [AnthropicServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-service-tier/index.html) 的 API 參考文件和 Anthropic 的 [Service tiers](https://platform.claude.com/docs/en/api/service-tiers) 文件。 |
# --8<-- [end:serviceTier]

# --8<-- [start:thinking]
| `thinking` | AnthropicThinking | 啟用 Claude 擴展思考的配置。啟用後，回應也會包含思考內容區塊。更多資訊請參閱 [AnthropicThinking](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-thinking/index.html) 的 API 參考文件。 |
# --8<-- [end:thinking]

# --8<-- [start:thinkingConfig]
| `thinkingConfig` | GoogleThinkingConfig | 控制模型是否應公開其思維鏈 (chain-of-thought) 以及可能花費多少 token 在其上。更多資訊請參閱 [GoogleThinkingConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google.models/-google-thinking-config/index.html) 的 API 參考文件。 |
# --8<-- [end:thinkingConfig]

# --8<-- [start:enableSearch]
| `enableSearch` | Boolean | 指定是否啟用網路搜尋功能。更多資訊請參閱阿里巴巴的 [Web search](https://www.alibabacloud.com/help/en/model-studio/web-search?spm=a2c63.p38356.0.i14) 文件。 |
# --8<-- [end:enableSearch]

# --8<-- [start:enableThinking]
| `enableThinking` | Boolean | 指定在使用混合思考模型時是否啟用思考模式。更多資訊請參閱阿里巴巴關於 [Deep thinking](https://www.alibabacloud.com/help/en/model-studio/deep-thinking?spm=a2c63.p38356.0.i11) 的文件。 |
# --8<-- [end:enableThinking]

# --8<-- [start:randomSeed]
| `randomSeed` | Integer | 用於隨機取樣的種子。如果設定，具有相同參數和相同種子值的不同呼叫將產生確定性結果。 |
# --8<-- [end:randomSeed]

# --8<-- [start:promptMode]
| `promptMode` | String | 讓您可以在推理模式 (reasoning mode) 和無系統提示之間切換。當設定為 `reasoning` 時，將使用推理模型的預設系統提示。更多資訊請參閱 Mistral 的 [Reasoning](https://docs.mistral.ai/capabilities/reasoning) 文件。 |
# --8<-- [end:promptMode]

# --8<-- [start:safePrompt]
| `safePrompt` | Boolean | 指定是否在所有對話之前注入安全提示。安全提示用於執行防護措施 (guardrails) 並防止有害內容。更多資訊請參閱 Mistral 的 [Moderation & Guardarailing](https://docs.mistral.ai/capabilities/guardrailing) 文件。 |
# --8<-- [end:safePrompt]