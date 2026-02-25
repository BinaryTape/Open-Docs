---
search:
  exclude: true
---

# --8<-- [start:heading]
|形参|类型| 描述 |
|---------|----|-------------|
# --8<-- [end:heading]

# --8<-- [start:topP]
| `topP` | Double | 也称为核采样。通过将具有最高概率值的 token 添加到子集中，直到它们的概率总和达到指定的 `topP` 值，从而创建后续 token 的子集。取值范围为大于 0.0 且小于或等于 1.0。 |
# --8<-- [end:topP]

# --8<-- [start:logprobs]
| `logprobs` | Boolean | 如果为 `true`，则包含输出 token 的对数概率。 |
# --8<-- [end:logprobs]

# --8<-- [start:topLogprobs]
| `topLogprobs` | Integer | 每个位置最有可能出现的顶级 token 数量。取值范围为 0–20。需要将 `logprobs` 形参设置为 `true`。 |
# --8<-- [end:topLogprobs]

# --8<-- [start:frequencyPenalty]
| `frequencyPenalty` | Double | 对高频 token 进行惩罚以减少重复。较高的 `frequencyPenalty` 值会导致更丰富的用词变化并减少重复。取值范围为 -2.0 到 2.0。 |
# --8<-- [end:frequencyPenalty]

# --8<-- [start:presencePenalty]
| `presencePenalty` | Double | 防止模型重复使用已包含在输出中的 token。较高的值会鼓励引入新的 token 和主题。取值范围为 -2.0 到 2.0。 |
# --8<-- [end:presencePenalty]

# --8<-- [start:stop]
| `stop` | List&lt;String&gt; | 向模型发出信号的字符串，表示模型在遇到其中任何一个字符串时应停止生成内容。例如，要让模型在产生两个换行符时停止生成内容，可以将停止序列指定为 `stop = listOf("/n/n")`。 |
# --8<-- [end:stop]

# --8<-- [start:parallelToolCalls]
| `parallelToolCalls` | Boolean | 如果为 `true`，则可以并行运行多个工具调用。特别适用于智能体策略之外的自定义节点或 LLM 交互。 |
# --8<-- [end:parallelToolCalls]

# --8<-- [start:promptCacheKey]
| `promptCacheKey` | String | 用于提示词缓存的稳定缓存键。OpenAI 使用它来为类似的请求缓存响应。 |
# --8<-- [end:promptCacheKey]

# --8<-- [start:safetyIdentifier]
| `safetyIdentifier` | String | 一个稳定且唯一的用户标识符，可用于检测违反 OpenAI 政策的用户。 |
# --8<-- [end:safetyIdentifier]

# --8<-- [start:serviceTier]
| `serviceTier` | ServiceTier | OpenAI 处理层级选择，允许您优先考虑性能而非成本，反之亦然。有关更多信息，请参阅 [ServiceTier](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ServiceTier) 的 API 文档。 |
# --8<-- [end:serviceTier]

# --8<-- [start:store]
| `store` | Boolean | 如果为 `true`，提供商可能会存储输出以便以后检索。 |
# --8<-- [end:store]

# --8<-- [start:audio]
| `audio` | OpenAIAudioConfig | 使用支持音频的模型时的音频输出配置。有关更多信息，请参阅 [OpenAIAudioConfig](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIAudioConfig) 的 API 文档。 |
# --8<-- [end:audio]

# --8<-- [start:reasoningEffort]
| `reasoningEffort` | ReasoningEffort | 指定模型将使用的推理力度级别。有关更多信息和可用值，请参阅 [ReasoningEffort](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ReasoningEffort) 的 API 文档。 |
# --8<-- [end:reasoningEffort]

# --8<-- [start:webSearchOptions]
| `webSearchOptions` | OpenAIWebSearchOptions | 配置网络搜索工具的使用（如果支持）。有关更多信息，请参阅 [OpenAIWebSearchOptions](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIWebSearchOptions) 的 API 文档。 |
# --8<-- [end:webSearchOptions]

# --8<-- [start:background]
| `background` | Boolean | 在后台运行响应。 |
# --8<-- [end:background]

# --8<-- [start:include]
| `include` | List&lt;OpenAIInclude&gt; | 要包含在模型响应中的附加数据，例如网络搜索工具调用的来源或文件搜索工具调用的搜索结果。有关详细参考信息，请参阅 Koog API 参考中的 [OpenAIInclude](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.OpenAIInclude)。要了解有关 `include` 形参的更多信息，请参阅 [OpenAI 文档](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include)。 |
# --8<-- [end:include]

# --8<-- [start:maxToolCalls]
| `maxToolCalls` | Integer | 此响应中允许的最大内置工具调用总数。取值范围为大于或等于 `0`。 |
# --8<-- [end:maxToolCalls]

# --8<-- [start:reasoning]
| `reasoning` | ReasoningConfig | 推理能力模型的推理配置。有关更多信息，请参阅 [ReasoningConfig](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.ReasoningConfig) 的 API 文档。 |
# --8<-- [end:reasoning]

# --8<-- [start:truncation]
| `truncation` | Truncation | 接近上下文窗口时的截断策略。有关更多信息，请参阅 [Truncation](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.Truncation) 的 API 文档。 |
# --8<-- [end:truncation]

# --8<-- [start:topK]
| `topK` | Integer | 生成输出时要考虑的顶级 token 数量。取值范围为大于或等于 0（可能适用特定提供商的最小值）。 |
# --8<-- [end:topK]

# --8<-- [start:repetitionPenalty]
| `repetitionPenalty` | Double | 对 token 重复进行惩罚。对于已出现在输出中的 token，其后续 token 概率将除以 `repetitionPenalty` 的值，如果 `repetitionPenalty > 1`，这将降低它们再次出现的可能性。取值范围为大于 0.0 且小于或等于 2.0。 |
# --8<-- [end:repetitionPenalty]

# --8<-- [start:minP]
| `minP` | Double | 过滤掉相对于最有可能出现的 token 的概率低于定义的 `minP` 值的 token。取值范围为 0.0–0.1。 |
# --8<-- [end:minP]

# --8<-- [start:topA]
| `topA` | Double | 根据模型置信度动态调整采样窗口。如果模型置信度高（存在占主导地位的高概率后续 token），它会将采样窗口限制在少数几个顶级 token 内。如果置信度低（存在许多概率相似的 token），则在采样窗口中保留更多 token。取值范围为 0.0–0.1（含）。值越高表示动态自适应能力越强。 |
# --8<-- [end:topA]

# --8<-- [start:transforms]
| `transforms` | List&lt;String&gt; | 上下文转换列表。定义当上下文超过模型的 token 限制时如何转换。默认转换为 `middle-out`，即从提示词中间进行截断。使用空列表表示不进行转换。有关更多信息，请参阅 OpenRouter 文档中的 [Message Transforms](https://openrouter.ai/docs/guides/features/message-transforms)。 |
# --8<-- [end:transforms]

# --8<-- [start:models]
| `models` | List&lt;String&gt; | 请求允许的模型列表。 |
# --8<-- [end:models]

# --8<-- [start:route]
| `route` | String | 要使用的请求路由策略。 |
# --8<-- [end:route]

# --8<-- [start:provider]
| `provider` | ProviderPreferences | 包含一系列形参，允许您显式控制 OpenRouter 如何选择要使用的 LLM 提供商。有关更多信息，请参阅 [ProviderPreferences](api:prompt-executor-openrouter-client::ai.koog.prompt.executor.clients.openrouter.models.ProviderPreferences) 的 API 文档。 |
# --8<-- [end:provider]

# --8<-- [start:stopSequences]
| `stopSequences` | List&lt;String&gt; | 导致模型停止生成内容的自定义文本序列。如果匹配，响应中 `stop_reason` 的值为 `stop_sequence`。 |
# --8<-- [end:stopSequences]

# --8<-- [start:container]
| `container`  | String | 跨请求重用的容器标识符。Anthropic 的代码执行工具使用容器来提供安全且容器化的代码执行环境。通过提供之前响应中的容器标识符，您可以跨多个请求重用容器，从而在请求之间保留创建的文件。有关更多信息，请参阅 Anthropic 文档中的 [Containers](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#containers)。 |
# --8<-- [end:container]

# --8<-- [start:mcpServers]
| `mcpServers` | List&lt;AnthropicMCPServerURLDefinition&gt; | 请求中要使用的 MCP 服务器定义。最多支持 20 个服务器。有关更多信息，请参阅 [AnthropicMCPServerURLDefinition](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicMCPServerURLDefinition) 的 API 参考。 |
# --8<-- [end:mcpServers]

# --8<-- [start:serviceTier]
| `serviceTier` | AnthropicServiceTier | 确定请求是使用优先级容量（如果可用）还是标准容量。有关更多信息，请参阅 [AnthropicServiceTier](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicServiceTier) 的 API 参考和 Anthropic 的 [Service tiers](https://platform.claude.com/docs/en/api/service-tiers) 文档。 |
# --8<-- [end:serviceTier]

# --8<-- [start:thinking]
| `thinking` | AnthropicThinking | 激活 Claude 扩展思维的配置。激活后，响应还包括思维内容块。有关更多信息，请参阅 [AnthropicThinking](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicThinking) 的 API 参考。 |
# --8<-- [end:thinking]

# --8<-- [start:thinkingConfig]
| `thinkingConfig` | GoogleThinkingConfig | 控制模型是否应公开其思维链，以及可以为此消耗多少 token。有关更多信息，请参阅 [GoogleThinkingConfig](api:prompt-executor-google-client::ai.koog.prompt.executor.clients.google.models.GoogleThinkingConfig) 的 API 参考。 |
# --8<-- [end:thinkingConfig]

# --8<-- [start:enableSearch]
| `enableSearch` | Boolean | 指定是否启用网络搜索功能。有关更多信息，请参阅阿里云的[网络搜索](https://www.alibabacloud.com/help/en/model-studio/web-search?spm=a2c63.p38356.0.i14)文档。 |
# --8<-- [end:enableSearch]

# --8<-- [start:enableThinking]
| `enableThinking` | Boolean | 指定在使用混合思维模型时是否启用思维模式。有关更多信息，请参阅阿里云关于[深度思考](https://www.alibabacloud.com/help/en/model-studio/deep-thinking?spm=a2c63.p38356.0.i11)的文档。 |
# --8<-- [end:enableThinking]

# --8<-- [start:randomSeed]
| `randomSeed` | Integer | 用于随机采样的种子。如果设置，具有相同形参和相同种子值的不同调用将生成确定性的结果。 |
# --8<-- [end:randomSeed]

# --8<-- [start:promptMode]
| `promptMode` | String | 允许您在推理模式和无系统提示词之间切换。设置为 `reasoning` 时，将使用推理模型的默认系统提示词。有关更多信息，请参阅 Mistral 的 [Reasoning](https://docs.mistral.ai/capabilities/reasoning) 文档。 |
# --8<-- [end:promptMode]

# --8<-- [start:safePrompt]
| `safePrompt` | Boolean | 指定是否在所有对话之前注入安全提示词。安全提示词用于执行护栏并防止有害内容。有关更多信息，请参阅 Mistral 的 [Moderation & Guardarailing](https://docs.mistral.ai/capabilities/guardrailing) 文档。 |
# --8<-- [end:safePrompt]