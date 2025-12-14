---
search:
  exclude: true
---

# --8<-- [start:heading]
|参数|类型| 描述 |
|---------|----|-------------|
# --8<-- [end:heading]

# --8<-- [start:topP]
| `topP` | Double | 也称为核采样（nucleus sampling）。通过将具有最高概率值的 token 添加到子集中，直到它们的概率总和达到指定的 `topP` 值，从而创建下一个 token 的子集。取值大于 0.0 且小于或等于 1.0。 |
# --8<-- [end:topP]

# --8<-- [start:logprobs]
| `logprobs` | Boolean | 如果为 `true`，则包含输出 token 的对数概率。 |
# --8<-- [end:logprobs]

# --8<-- [start:topLogprobs]
| `topLogprobs` | Integer | 每个位置最有可能的 `top` 个 token 的数量。取值范围为 0–20。需要将 `logprobs` 参数设置为 `true`。 |
# --8<-- [end:topLogprobs]

# --8<-- [start:frequencyPenalty]
| `frequencyPenalty` | Double | 惩罚常用 token 以减少重复。`frequencyPenalty` 值越高，生成的措辞变化越大，重复越少。取值范围为 -2.0 到 2.0。 |
# --8<-- [end:frequencyPenalty]

# --8<-- [start:presencePenalty]
| `presencePenalty` | Double | 防止模型重复使用已包含在输出中的 token。值越高，越鼓励引入新的 token 和主题。取值范围为 -2.0 到 2.0。 |
# --8<-- [end:presencePenalty]

# --8<-- [start:stop]
| `stop` | List&lt;String&gt; | 当模型遇到其中任何一个字符串时，它应停止生成内容。例如，要使模型在生成两个换行符时停止生成内容，请将停止序列指定为 `stop = listOf("/n/n")`。 |
# --8<-- [end:stop]

# --8<-- [start:parallelToolCalls]
| `parallelToolCalls` | Boolean | 如果为 `true`，则多个工具调用可以并行运行。特别适用于自定义节点或代理策略之外的 LLM 交互。 |
# --8<-- [end:parallelToolCalls]

# --8<-- [start:promptCacheKey]
| `promptCacheKey` | String | 用于 prompt 缓存的稳定缓存键。OpenAI 使用它来缓存类似请求的响应。 |
# --8<-- [end:promptCacheKey]

# --8<-- [start:safetyIdentifier]
| `safetyIdentifier` | String | 一个稳定且唯一的用户标识符，可用于检测违反 OpenAI 政策的用户。 |
# --8<-- [end:safetyIdentifier]

# --8<-- [start:serviceTier]
| `serviceTier` | ServiceTier | OpenAI 处理层级选择，允许您优先考虑性能而非成本，反之亦然。关于更多信息，请参见 [ServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-service-tier/index.html) 的 API 文档。 |
# --8<-- [end:serviceTier]

# --8<-- [start:store]
| `store` | Boolean | 如果为 `true`，提供者可以存储输出以供后续检索。 |
# --8<-- [end:store]

# --8<-- [start:audio]
| `audio` | OpenAIAudioConfig | 使用支持音频的模型时，音频输出的配置。关于更多信息，请参见 [OpenAIAudioConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-audio-config/index.html) 的 API 文档。 |
# --8<-- [end:audio]

# --8<-- [start:reasoningEffort]
| `reasoningEffort` | ReasoningEffort | 指定模型将使用的推理工作量级别。关于更多信息和可用值，请参见 [ReasoningEffort](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-reasoning-effort/index.html) 的 API 文档。 |
# --8<-- [end:reasoningEffort]

# --8<-- [start:webSearchOptions]
| `webSearchOptions` | OpenAIWebSearchOptions | 配置网页搜索工具的使用（如果支持）。关于更多信息，请参见 [OpenAIWebSearchOptions](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-web-search-options/index.html) 的 API 文档。 |
# --8<-- [end:webSearchOptions]

# --8<-- [start:background]
| `background` | Boolean | 在后台运行响应。 |
# --8<-- [end:background]

# --8<-- [start:include]
| `include` | List&lt;OpenAIInclude&gt; | 要包含在模型响应中的额外数据，例如网页搜索工具调用的来源或文件搜索工具调用的搜索结果。关于详细参考信息，请参见 Koog API 参考中的 [OpenAIInclude](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-open-a-i-include/index.html)。要了解更多关于 `include` 参数的信息，请参见 [OpenAI 的文档](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include)。 |
# --8<-- [end:include]

# --8<-- [start:maxToolCalls]
| `maxToolCalls` | Integer | 此响应中允许的最大内置工具调用总数。取值大于或等于 `0`。 |
# --8<-- [end:maxToolCalls]

# --8<-- [start:reasoning]
| `reasoning` | ReasoningConfig | 支持推理的模型推理配置。关于更多信息，请参见 [ReasoningConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-reasoning-config/index.html) 的 API 文档。 |
# --8<-- [end:reasoning]

# --8<-- [start:truncation]
| `truncation` | Truncation | 接近上下文窗口时的截断策略。关于更多信息，请参见 [Truncation](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-truncation/index.html) 的 API 文档。 |
# --8<-- [end:truncation]

# --8<-- [start:topK]
| `topK` | Integer | 生成输出时要考虑的 `top` 个 token 的数量。取值大于或等于 0（可能适用提供者特定的最小值）。 |
# --8<-- [end:topK]

# --8<-- [start:repetitionPenalty]
| `repetitionPenalty` | Double | 惩罚 token 重复。对于已出现在输出中的 token，其下一个 token 概率将除以 `repetitionPenalty` 的值，如果 `repetitionPenalty > 1`，这将使它们再次出现的可能性降低。取值大于 0.0 且小于或等于 2.0。 |
# --8<-- [end:repetitionPenalty]

# --8<-- [start:minP]
| `minP` | Double | 过滤掉其相对于最有可能的 token 的相对概率低于定义 `minP` 值的 token。取值范围为 0.0–0.1。 |
# --8<-- [end:minP]

# --8<-- [start:topA]
| `topA` | Double | 根据模型置信度动态调整采样窗口。如果模型置信度高（存在占主导地位的高概率下一个 token），它会将采样窗口限制在少数 `top` 个 token。如果置信度低（存在许多概率相似的 token），它会在采样窗口中保留更多 token。取值范围为 0.0–0.1（含）。值越高表示动态适应性越强。 |
# --8<-- [end:topA]

# --8<-- [start:transforms]
| `transforms` | List&lt;String&gt; | 上下文转换的 List。定义当上下文超出模型的 token 限制时如何进行转换。默认的转换是 `middle-out`，它从 prompt 的中间进行截断。使用空 List 表示不进行转换。关于更多信息，请参见 OpenRouter 文档中的 [Message Transforms](https://openrouter.ai/docs/guides/features/message-transforms)。 |
# --8<-- [end:transforms]

# --8<-- [start:models]
| `models` | List&lt;String&gt; | 请求允许的模型 List。 |
# --8<-- [end:models]

# --8<-- [start:route]
| `route` | String | 要使用的请求路由策略。 |
# --8<-- [end:route]

# --8<-- [start:provider]
| `provider` | ProviderPreferences | 包含一系列参数，允许您显式控制 OpenRouter 如何选择要使用的 LLM 提供者。关于更多信息，请参见 [ProviderPreferences](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter.models/-provider-preferences/index.html) 的 API 文档。 |
# --8<-- [end:provider]

# --8<-- [start:stopSequences]
| `stopSequences` | List&lt;String&gt; | 导致模型停止生成内容的自定义文本序列。如果匹配，响应中的 `stop_reason` 值为 `stop_sequence`。 |
# --8<-- [end:stopSequences]

# --8<-- [start:container]
| `container`  | String | 用于跨请求重用的容器标识符。Anthropic 的代码执行工具使用容器来提供安全且容器化的代码执行环境。通过提供来自先前响应的容器标识符，您可以跨多个请求重用容器，从而保留请求之间创建的文件。关于更多信息，请参见 Anthropic 文档中的 [Containers](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#containers)。 |
# --8<-- [end:container]

# --8<-- [start:mcpServers]
| `mcpServers` | List&lt;AnthropicMCPServerURLDefinition&gt; | 请求中要使用的 MCP 服务器定义。最多支持 20 个服务器。关于更多信息，请参见 [AnthropicMCPServerURLDefinition](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-m-c-p-server-u-r-l-definition/index.html) 的 API 参考。 |
# --8<-- [end:mcpServers]

# --8<-- [start:serviceTier]
| `serviceTier` | AnthropicServiceTier | 确定请求是使用优先容量（如果可用）还是标准容量。关于更多信息，请参见 [AnthropicServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-service-tier/index.html) 的 API 参考和 Anthropic 的 [Service tiers](https://platform.claude.com/docs/en/api/service-tiers) 文档。 |
# --8<-- [end:serviceTier]

# --8<-- [start:thinking]
| `thinking` | AnthropicThinking | 激活 Claude 扩展思考的配置。激活后，响应还包含思考内容块。关于更多信息，请参见 [AnthropicThinking](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-thinking/index.html) 的 API 参考。 |
# --8<-- [end:thinking]

# --8<-- [start:thinkingConfig]
| `thinkingConfig` | GoogleThinkingConfig | 控制模型是否应暴露其思维链以及可能花费多少 token 在上面。关于更多信息，请参见 [GoogleThinkingConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google.models/-google-thinking-config/index.html) 的 API 参考。 |
# --8<-- [end:thinkingConfig]

# --8<-- [start:enableSearch]
| `enableSearch` | Boolean | 指定是否启用网页搜索功能。关于更多信息，请参见阿里巴巴的 [Web search](https://www.alibabacloud.com/help/en/model-studio/web-search?spm=a2c63.p38356.0.i14) 文档。 |
# --8<-- [end:enableSearch]

# --8<-- [start:enableThinking]
| `enableThinking` | Boolean | 指定在使用混合思考模型时是否启用思考模式。关于更多信息，请参见阿里巴巴关于 [Deep thinking](https://www.alibabacloud.com/help/en/model-studio/deep-thinking?spm=a2c63.p38356.0.i11) 的文档。 |
# --8<-- [end:enableThinking]

# --8<-- [start:randomSeed]
| `randomSeed` | Integer | 用于随机采样的种子。如果设置，具有相同参数和相同种子值的不同调用将生成确定性结果。 |
# --8<-- [end:randomSeed]

# --8<-- [start:promptMode]
| `promptMode` | String | 允许您在推理模式和无系统 prompt 之间切换。当设置为 `reasoning` 时，将使用推理模型的默认系统 prompt。关于更多信息，请参见 Mistral 的 [Reasoning](https://docs.mistral.ai/capabilities/reasoning) 文档。 |
# --8<-- [end:promptMode]

# --8<-- [start:safePrompt]
| `safePrompt` | Boolean | 指定是否在所有对话前注入安全 prompt。安全 prompt 用于强制执行护栏并防止有害内容。关于更多信息，请参见 Mistral 的 [Moderation & Guardarailing](https://docs.mistral.ai/capabilities/guardrailing) 文档。 |
# --8<-- [end:safePrompt]