---
search:
  exclude: true
---

# --8<-- [start:heading]
|參數|型別| 說明 |
|---------|----|-------------|
# --8<-- [end:heading]

# --8<-- [start:topP]
| `topP` | Double | 也稱為核取樣 (nucleus sampling)。透過將機率值最高的 token 加入子集，直到其機率總和達到指定的 `topP` 值，以此建立下一個 token 的子集。取值範圍為大於 0.0 且小於或等於 1.0。 |
# --8<-- [end:topP]

# --8<-- [start:logprobs]
| `logprobs` | Boolean | 若為 `true`，則在輸出 token 中包含對數機率 (log-probabilities)。 |
# --8<-- [end:logprobs]

# --8<-- [start:topLogprobs]
| `topLogprobs` | Integer | 每個位置最可能出現的前幾個 token 數量。取值範圍為 0–20。需要將 `logprobs` 參數設定為 `true`。 |
# --8<-- [end:topLogprobs]

# --8<-- [start:frequencyPenalty]
| `frequencyPenalty` | Double | 針對頻繁出現的 token 進行懲罰以減少重複。較高的 `frequencyPenalty` 值會產生更多的措辭變化並減少重複。取值範圍為 -2.0 到 2.0。 |
# --8<-- [end:frequencyPenalty]

# --8<-- [start:presencePenalty]
| `presencePenalty` | Double | 防止模型重複使用已經包含在輸出中的 token。較高的值會鼓勵引入新的 token 和主題。取值範圍為 -2.0 到 2.0。 |
# --8<-- [end:presencePenalty]

# --8<-- [start:stop]
| `stop` | List&lt;String&gt; | 當模型遇到這些字串時，會發出停止產生內容訊號的字串列表。例如，要讓模型在產生兩個換行符號時停止產生內容，請將停止序列指定為 `stop = listOf("/n/n")`。 |
# --8<-- [end:stop]

# --8<-- [start:parallelToolCalls]
| `parallelToolCalls` | Boolean | 若為 `true`，則可以並行執行多個工具呼叫。特別適用於自訂節點或代理策略 (agent strategies) 之外的 LLM 互動。 |
# --8<-- [end:parallelToolCalls]

# --8<-- [start:promptCacheKey]
| `promptCacheKey` | String | 用於提示快取 (prompt caching) 的穩定快取金鑰。OpenAI 使用它來快取相似請求的回應。 |
# --8<-- [end:promptCacheKey]

# --8<-- [start:safetyIdentifier]
| `safetyIdentifier` | String | 穩定且唯一的使用者識別碼，可用於偵測違反 OpenAI 政策的使用者。 |
# --8<-- [end:safetyIdentifier]

# --8<-- [start:serviceTier]
| `serviceTier` | ServiceTier | OpenAI 處理層級選擇，讓您可以優先考慮效能而非成本，反之亦然。如需詳細資訊，請參閱 [ServiceTier](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ServiceTier) 的 API 文件。 |
# --8<-- [end:serviceTier]

# --8<-- [start:store]
| `store` | Boolean | 若為 `true`，提供者可能會存儲輸出內容供日後檢索。 |
# --8<-- [end:store]

# --8<-- [start:audio]
| `audio` | OpenAIAudioConfig | 使用具備音訊能力模型時的音訊輸出配置。如需詳細資訊，請參閱 [OpenAIAudioConfig](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIAudioConfig) 的 API 文件。 |
# --8<-- [end:audio]

# --8<-- [start:reasoningEffort]
| `reasoningEffort` | ReasoningEffort | 指定模型將使用的推理程度 (reasoning effort)。如需詳細資訊與可用值，請參閱 [ReasoningEffort](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ReasoningEffort) 的 API 文件。 |
# --8<-- [end:reasoningEffort]

# --8<-- [start:webSearchOptions]
| `webSearchOptions` | OpenAIWebSearchOptions | 配置網路搜尋工具的使用方式（若支援）。如需詳細資訊，請參閱 [OpenAIWebSearchOptions](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIWebSearchOptions) 的 API 文件。 |
# --8<-- [end:webSearchOptions]

# --8<-- [start:background]
| `background` | Boolean | 在背景執行回應。 |
# --8<-- [end:background]

# --8<-- [start:include]
| `include` | List&lt;OpenAIInclude&gt; | 模型回應中要包含的額外資料，例如網路搜尋工具呼叫的來源或檔案搜尋工具呼叫的搜尋結果。如需詳細參考資訊，請參閱 Koog API 參考中的 [OpenAIInclude](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.OpenAIInclude)。若要進一步了解 `include` 參數，請參閱 [OpenAI 的文件](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include)。 |
# --8<-- [end:include]

# --8<-- [start:maxToolCalls]
| `maxToolCalls` | Integer | 此回應中允許的內建工具呼叫最大總數。取值需大於或等於 `0`。 |
# --8<-- [end:maxToolCalls]

# --8<-- [start:reasoning]
| `reasoning` | ReasoningConfig | 具備推理能力模型的推理配置。如需詳細資訊，請參閱 [ReasoningConfig](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.ReasoningConfig) 的 API 文件。 |
# --8<-- [end:reasoning]

# --8<-- [start:truncation]
| `truncation` | Truncation | 接近上下文視窗時的截斷策略。如需詳細資訊，請參閱 [Truncation](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.Truncation) 的 API 文件。 |
# --8<-- [end:truncation]

# --8<-- [start:topK]
| `topK` | Integer | 產生輸出時要考慮的前幾個 token 數量。取值需大於或等於 0（可能適用特定提供者的最小值限制）。 |
# --8<-- [end:topK]

# --8<-- [start:repetitionPenalty]
| `repetitionPenalty` | Double | 針對 token 重複進行懲罰。對於已經出現在輸出中的 token，其下一個 token 的機率會除以 `repetitionPenalty` 的值，若 `repetitionPenalty > 1`，則會使它們再次出現的可能性降低。取值範圍為大於 0.0 且小於或等於 2.0。 |
# --8<-- [end:repetitionPenalty]

# --8<-- [start:minP]
| `minP` | Double | 過濾掉相對機率低於指定 `minP` 值（相對於最可能出現的 token）的 token。取值範圍為 0.0–0.1。 |
# --8<-- [end:minP]

# --8<-- [start:topA]
| `topA` | Double | 根據模型置信度動態調整取樣視窗。如果模型很有把握（存在佔主導地位的高機率下一個 token），則取樣視窗會限制在少數幾個頂級 token 內。如果置信度較低（存在許多機率相似的 token），則取樣視窗中會保留更多 token。取值範圍為 0.0–0.1（含）。值越高代表動態適應程度越高。 |
# --8<-- [end:topA]

# --8<-- [start:transforms]
| `transforms` | List&lt;String&gt; | 上下文轉換列表。定義當上下文超過模型 token 限制時的轉換方式。預設轉換為 `middle-out`，即從提示的中間部分進行截斷。使用空列表表示不進行轉換。如需詳細資訊，請參閱 OpenRouter 文件中的 [訊息轉換 (Message Transforms)](https://openrouter.ai/docs/guides/features/message-transforms)。 |
# --8<-- [end:transforms]

# --8<-- [start:models]
| `models` | List&lt;String&gt; | 此請求允許的模型列表。 |
# --8<-- [end:models]

# --8<-- [start:route]
| `route` | String | 要使用的請求路由策略。 |
# --8<-- [end:route]

# --8<-- [start:provider]
| `provider` | ProviderPreferences | 包含一系列參數，讓您可以明確控制 OpenRouter 如何選擇要使用的 LLM 提供者。如需詳細資訊，請參閱 [ProviderPreferences](api:prompt-executor-openrouter-client::ai.koog.prompt.executor.clients.openrouter.models.ProviderPreferences) 的 API 文件。 |
# --8<-- [end:provider]

# --8<-- [start:stopSequences]
| `stopSequences` | List&lt;String&gt; | 導致模型停止產生內容的自訂文字序列。如果匹配，回應中的 `stop_reason` 值將為 `stop_sequence`。 |
# --8<-- [end:stopSequences]

# --8<-- [start:container]
| `container`  | String | 用於跨請求重複使用的容器識別符號。容器由 Anthropic 的程式碼執行工具使用，以提供安全且容器化的程式碼執行環境。透過提供先前回應中的容器識別符號，您可以跨多個請求重複使用容器，進而保留請求之間建立的檔案。如需詳細資訊，請參閱 Anthropic 文件中的 [容器 (Containers)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#containers)。 |
# --8<-- [end:container]

# --8<-- [start:mcpServers]
| `mcpServers` | List&lt;AnthropicMCPServerURLDefinition&gt; | 請求中要使用的 MCP 伺服器定義。最多支援 20 個伺服器。如需詳細資訊，請參閱 [AnthropicMCPServerURLDefinition](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicMCPServerURLDefinition) 的 API 參考。 |
# --8<-- [end:mcpServers]

# --8<-- [start:serviceTier]
| `serviceTier` | AnthropicServiceTier | 決定此請求使用優先容量（若可用）或標準容量。如需詳細資訊，請參閱 [AnthropicServiceTier](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicServiceTier) 的 API 參考以及 Anthropic 的 [服務層級 (Service tiers)](https://platform.claude.com/docs/en/api/service-tiers) 文件。 |
# --8<-- [end:serviceTier]

# --8<-- [start:thinking]
| `thinking` | AnthropicThinking | 啟動 Claude 擴充思考的配置。啟動後，回應還會包含思考內容區塊。如需詳細資訊，請參閱 [AnthropicThinking](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicThinking) 的 API 參考。 |
# --8<-- [end:thinking]

# --8<-- [start:thinkingConfig]
| `thinkingConfig` | GoogleThinkingConfig | 控制模型是否應公開其思維鏈 (chain-of-thought)，以及可以在其上消耗多少 token。如需詳細資訊，請參閱 [GoogleThinkingConfig](api:prompt-executor-google-client::ai.koog.prompt.executor.clients.google.models.GoogleThinkingConfig) 的 API 參考。 |
# --8<-- [end:thinkingConfig]

# --8<-- [start:enableSearch]
| `enableSearch` | Boolean | 指定是否啟用網路搜尋功能。如需詳細資訊，請參閱阿里巴巴的 [網路搜尋 (Web search)](https://www.alibabacloud.com/help/en/model-studio/web-search?spm=a2c63.p38356.0.i14) 文件。 |
# --8<-- [end:enableSearch]

# --8<-- [start:enableThinking]
| `enableThinking` | Boolean | 指定在使用混合思考模型時是否啟用思考模式。如需詳細資訊，請參閱阿里巴巴關於 [深度思考 (Deep thinking)](https://www.alibabacloud.com/help/en/model-studio/deep-thinking?spm=a2c63.p38356.0.i11) 的文件。 |
# --8<-- [end:enableThinking]

# --8<-- [start:randomSeed]
| `randomSeed` | Integer | 用於隨機取樣的種子。如果設定，具有相同參數和相同種子值的不同呼叫將產生確定性的結果。 |
# --8<-- [end:randomSeed]

# --8<-- [start:promptMode]
| `promptMode` | String | 讓您在推理模式與無系統提示之間切換。當設定為 `reasoning` 時，將使用推理模型的預設系統提示。如需詳細資訊，請參閱 Mistral 的 [推理 (Reasoning)](https://docs.mistral.ai/capabilities/reasoning) 文件。 |
# --8<-- [end:promptMode]

# --8<-- [start:safePrompt]
| `safePrompt` | Boolean | 指定是否在所有對話之前注入安全提示。安全提示用於執行護欄 (guardrails) 並防止有害內容。如需詳細資訊，請參閱 Mistral 的 [審核與護欄 (Moderation & Guardarailing)](https://docs.mistral.ai/capabilities/guardrailing) 文件。 |
# --8<-- [end:safePrompt]