---
search:
  exclude: true
---

# --8<-- [start:heading]
|Parameter|Type| 説明 |
|---------|----|-------------|
# --8<-- [end:heading]

# --8<-- [start:topP]
| `topP` | Double | ニュークリアスサンプリングとも呼ばれます。確率値が最も高いトークンをサブセットに追加し、それらの確率の合計が指定された `topP` 値に達するまで、次のトークンのサブセットを作成します。0.0より大きく、1.0以下の値を取ります。 |
# --8<-- [end:topP]

# --8<-- [start:logprobs]
| `logprobs` | Boolean | `true` の場合、出力トークンの対数確率を含めます。 |
# --8<-- [end:logprobs]

# --8<-- [start:topLogprobs]
| `topLogprobs` | Integer | ポジションごとに最も可能性の高いトークンの上位数。0から20の範囲の値を取ります。`logprobs` パラメータを `true` に設定する必要があります。 |
# --8<-- [end:topLogprobs]

# --8<-- [start:frequencyPenalty]
| `frequencyPenalty` | Double | 頻繁に出現するトークンにペナルティを与え、繰り返しを減らします。`frequencyPenalty` の値が高いほど、表現のバリエーションが大きくなり、繰り返しが減少します。-2.0から2.0の範囲の値を取ります。 |
# --8<-- [end:frequencyPenalty]

# --8<-- [start:presencePenalty]
| `presencePenalty` | Double | モデルが既に出力に含まれているトークンを再利用するのを防ぎます。値が高いほど、新しいトークンやトピックの導入が促されます。-2.0から2.0の範囲の値を取ります。 |
# --8<-- [end:presencePenalty]

# --8<-- [start:stop]
| `stop` | List&lt;String&gt; | モデルがこれらいずれかの文字列に遭遇したときにコンテンツの生成を停止するよう指示する文字列。例えば、モデルが2つの改行を生成したときにコンテンツの生成を停止させるには、停止シーケンスを `stop = listOf("/n/n")` と指定します。 |
# --8<-- [end:stop]

# --8<-- [start:parallelToolCalls]
| `parallelToolCalls` | Boolean | `true` の場合、複数のツール呼び出しを並行して実行できます。特にカスタムノードやエージェント戦略以外のLLMインタラクションに適用されます。 |
# --8<-- [end:parallelToolCalls]

# --8<-- [start:promptCacheKey]
| `promptCacheKey` | String | プロンプトキャッシュのための安定したキャッシュキー。OpenAIは、類似のリクエストに対する応答をキャッシュするためにこれを使用します。 |
# --8<-- [end:promptCacheKey]

# --8<-- [start:safetyIdentifier]
| `safetyIdentifier` | String | OpenAIポリシーに違反するユーザーを検出するために使用される、安定した一意のユーザー識別子。 |
# --8<-- [end:safetyIdentifier]

# --8<-- [start:serviceTier]
| `serviceTier` | ServiceTier | パフォーマンスをコストよりも優先するか、その逆を行うかを設定できるOpenAIの処理ティア選択。詳細については、[ServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-service-tier/index.html) のAPIドキュメントを参照してください。 |
# --8<-- [end:serviceTier]

# --8<-- [start:store]
| `store` | Boolean | `true` の場合、プロバイダーは後で取得できるように出力を保存する場合があります。 |
# --8<-- [end:store]

# --8<-- [start:audio]
| `audio` | OpenAIAudioConfig | 音声対応モデルを使用する場合の音声出力設定。詳細については、[OpenAIAudioConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-audio-config/index.html) のAPIドキュメントを参照してください。 |
# --8<-- [end:audio]

# --8<-- [start:reasoningEffort]
| `reasoningEffort` | ReasoningEffort | モデルが使用する推論のレベルを指定します。詳細および利用可能な値については、[ReasoningEffort](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-reasoning-effort/index.html) のAPIドキュメントを参照してください。 |
# --8<-- [end:reasoningEffort]

# --8<-- [start:webSearchOptions]
| `webSearchOptions` | OpenAIWebSearchOptions | ウェブ検索ツールの使用を設定します (サポートされている場合)。詳細については、[OpenAIWebSearchOptions](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-web-search-options/index.html) のAPIドキュメントを参照してください。 |
# --8<-- [end:webSearchOptions]

# --8<-- [start:background]
| `background` | Boolean | 応答をバックグラウンドで実行します。 |
# --8<-- [end:background]

# --8<-- [start:include]
| `include` | List&lt;OpenAIInclude&gt; | ウェブ検索ツール呼び出しのソースやファイル検索ツール呼び出しの検索結果など、モデルの応答に含める追加データ。詳細な参照情報については、Koog APIリファレンスの[OpenAIInclude](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-open-a-i-include/index.html) を参照してください。`include` パラメータの詳細については、[OpenAIのドキュメント](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include) を参照してください。 |
# --8<-- [end:include]

# --8<-- [start:maxToolCalls]
| `maxToolCalls` | Integer | この応答で許可される組み込みツール呼び出しの最大合計数。`0` 以上の値を取ります。 |
# --8<-- [end:maxToolCalls]

# --8<-- [start:reasoning]
| `reasoning` | ReasoningConfig | 推論対応モデルの推論設定。詳細については、[ReasoningConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-reasoning-config/index.html) のAPIドキュメントを参照してください。 |
# --8<-- [end:reasoning]

# --8<-- [start:truncation]
| `truncation` | Truncation | コンテキストウィンドウに近づいた場合の切り捨て戦略。詳細については、[Truncation](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-truncation/index.html) のAPIドキュメントを参照してください。 |
# --8<-- [end:truncation]

# --8<-- [start:topK]
| `topK` | Integer | 出力生成時に考慮する上位トークンの数。0以上の値を取ります (プロバイダー固有の最小値が適用される場合があります)。 |
# --8<-- [end:topK]

# --8<-- [start:repetitionPenalty]
| `repetitionPenalty` | Double | トークンの繰り返しにペナルティを与えます。出力に既に現れたトークンの次のトークン確率は `repetitionPenalty` の値で除算され、`repetitionPenalty > 1` の場合に再度出現する可能性を低くします。0.0より大きく、2.0以下の値を取ります。 |
# --8<-- [end:repetitionPenalty]

# --8<-- [start:minP]
| `minP` | Double | 最も可能性の高いトークンに対する相対確率が定義された `minP` 値を下回るトークンを除外します。0.0から0.1の範囲の値を取ります。 |
# --8<-- [end:minP]

# --8<-- [start:topA]
| `topA` | Double | モデルの信頼度に基づいてサンプリングウィンドウを動的に調整します。モデルが確信している場合（支配的な高確率の次のトークンがある場合）、サンプリングウィンドウを少数の上位トークンに限定します。信頼度が低い場合（類似した確率を持つ多くのトークンがある場合）、サンプリングウィンドウにより多くのトークンを保持します。0.0から0.1の範囲の値を取ります（含む）。値が高いほど、動的な適応性が高くなります。 |
# --8<-- [end:topA]

# --8<-- [start:transforms]
| `transforms` | List&lt;String&gt; | コンテキスト変換のリスト。モデルのトークン制限を超過した場合にコンテキストがどのように変換されるかを定義します。デフォルトの変換は、プロンプトの中央から切り捨てる `middle-out` です。変換なしの場合は空のリストを使用します。詳細については、OpenRouterドキュメントの[Message Transforms](https://openrouter.ai/docs/guides/features/message-transforms) を参照してください。 |
# --8<-- [end:transforms]

# --8<-- [start:models]
| `models` | List&lt;String&gt; | リクエストで許可されるモデルのリスト。 |
# --8<-- [end:models]

# --8<-- [start:route]
| `route` | String | 使用するリクエストルーティング戦略。 |
# --8<-- [end:route]

# --8<-- [start:provider]
| `provider` | ProviderPreferences | OpenRouterがどのLLMプロバイダーを使用するかを明示的に制御できる一連のパラメータが含まれます。詳細については、[ProviderPreferences](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter.models/-provider-preferences/index.html) のAPIドキュメントを参照してください。 |
# --8<-- [end:provider]

# --8<-- [start:stopSequences]
| `stopSequences` | List&lt;String&gt; | モデルがコンテンツの生成を停止させるカスタムテキストシーケンス。一致した場合、応答の `stop_reason` の値は `stop_sequence` となります。 |
# --8<-- [end:stopSequences]

# --8<-- [start:container]
| `container`  | String | リクエスト間で再利用するためのコンテナ識別子。コンテナは、Anthropicのコード実行ツールによって、安全でコンテナ化されたコード実行環境を提供するために使用されます。以前の応答からのコンテナ識別子を提供することで、複数のリクエスト間でコンテナを再利用でき、リクエスト間で作成されたファイルを保持します。詳細については、Anthropicのドキュメントの[Containers](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#containers) を参照してください。 |
# --8<-- [end:container]

# --8<-- [start:mcpServers]
| `mcpServers` | List&lt;AnthropicMCPServerURLDefinition&gt; | リクエストで使用されるMCPサーバーの定義。最大20台のサーバーをサポートします。詳細については、[AnthropicMCPServerURLDefinition](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-m-c-p-server-u-r-l-definition/index.html) のAPIリファレンスを参照してください。 |
# --8<-- [end:mcpServers]

# --8<-- [start:serviceTier]
| `serviceTier` | AnthropicServiceTier | リクエストに優先容量（利用可能な場合）を使用するか、標準容量を使用するかを決定します。詳細については、[AnthropicServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-service-tier/index.html) のAPIリファレンスおよびAnthropicの[Service tiers](https://platform.claude.com/docs/en/api/service-tiers) ドキュメントを参照してください。 |
# --8<-- [end:serviceTier]

# --8<-- [start:thinking]
| `thinking` | AnthropicThinking | Claudeの拡張思考を有効にするための設定。有効にすると、応答には思考コンテンツブロックも含まれます。詳細については、[AnthropicThinking](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic.models/-anthropic-thinking/index.html) のAPIリファレンスを参照してください。 |
# --8<-- [end:thinking]

# --8<-- [start:thinkingConfig]
| `thinkingConfig` | GoogleThinkingConfig | モデルが思考の連鎖を公開するかどうか、およびそれに費やすトークン数を制御します。詳細については、[GoogleThinkingConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google.models/-google-thinking-config/index.html) のAPIリファレンスを参照してください。 |
# --8<-- [end:thinkingConfig]

# --8<-- [start:enableSearch]
| `enableSearch` | Boolean | ウェブ検索機能を有効にするかどうかを指定します。詳細については、Alibabaの[Web search](https://www.alibabacloud.com/help/en/model-studio/web-search?spm=a2c63.p38356.0.i14) ドキュメントを参照してください。 |
# --8<-- [end:enableSearch]

# --8<-- [start:enableThinking]
| `enableThinking` | Boolean | ハイブリッド思考モデルを使用する際に、思考モードを有効にするかどうかを指定します。詳細については、Alibabaの[Deep thinking](https://www.alibabacloud.com/help/en/model-studio/deep-thinking?spm=a2c63.p38356.0.i11) ドキュメントを参照してください。 |
# --8<-- [end:enableThinking]

# --8<-- [start:randomSeed]
| `randomSeed` | Integer | ランダムサンプリングに使用するシード。設定されている場合、同じパラメータと同じシード値を持つ異なる呼び出しは、決定論的な結果を生成します。 |
# --8<-- [end:randomSeed]

# --8<-- [start:promptMode]
| `promptMode` | String | 推論モードとシステムプロンプトなしを切り替えることができます。`reasoning` に設定すると、推論モデルのデフォルトのシステムプロンプトが使用されます。詳細については、Mistralの[Reasoning](https://docs.mistral.ai/capabilities/reasoning) ドキュメントを参照してください。 |
# --8<-- [end:promptMode]

# --8<-- [start:safePrompt]
| `safePrompt` | Boolean | すべての会話の前にセーフティプロンプトを挿入するかどうかを指定します。セーフティプロンプトは、ガードレールを適用し、有害なコンテンツから保護するために使用されます。詳細については、Mistralの[Moderation & Guardarailing](https://docs.mistral.ai/capabilities/guardrailing) ドキュメントを参照してください。 |
# --8<-- [end:safePrompt]