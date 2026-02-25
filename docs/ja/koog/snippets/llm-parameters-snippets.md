---
search:
  exclude: true
---

# --8<-- [start:heading]
|パラメーター|型| 説明 |
|---------|----|-------------|
# --8<-- [end:heading]

# --8<-- [start:topP]
| `topP` | Double | ニュークリアスサンプリング（nucleus sampling）とも呼ばれます。確率値の高い順にトークンをサブセットに追加し、それらの確率の合計が指定された `topP` 値に達するまでトークンのサブセットを作成します。0.0より大きく1.0以下の値を指定します。 |
# --8<-- [end:topP]

# --8<-- [start:logprobs]
| `logprobs` | Boolean | `true` の場合、出力トークンの対数確率（log-probabilities）を含めます。 |
# --8<-- [end:logprobs]

# --8<-- [start:topLogprobs]
| `topLogprobs` | Integer | 各位置における、最も可能性の高い上位トークンの数。0から20の範囲の値を指定します。このパラメーターを使用するには、 `logprobs` パラメーターを `true` に設定する必要があります。 |
# --8<-- [end:topLogprobs]

# --8<-- [start:frequencyPenalty]
| `frequencyPenalty` | Double | 頻出するトークンにペナルティを課し、繰り返しを減らします。 `frequencyPenalty` の値を大きくすると、語彙のバリエーションが増え、繰り返しが減少します。-2.0から2.0の範囲の値を指定します。 |
# --8<-- [end:frequencyPenalty]

# --8<-- [start:presencePenalty]
| `presencePenalty` | Double | 出力に既に出現したトークンをモデルが再利用するのを防ぎます。値を大きくすると、新しいトークンやトピックの導入が促されます。-2.0から2.0の範囲の値を指定します。 |
# --8<-- [end:presencePenalty]

# --8<-- [start:stop]
| `stop` | List&lt;String&gt; | モデルがこれらの文字列のいずれかに遭遇したときに、コンテンツの生成を停止するように指示する文字列のリストです。例えば、2つの改行が出現したときに生成を停止させるには、停止シーケンスとして `stop = listOf("/n/n")` を指定します。 |
# --8<-- [end:stop]

# --8<-- [start:parallelToolCalls]
| `parallelToolCalls` | Boolean | `true` の場合、複数のツール呼び出しを並列で実行できます。特にカスタムノードや、エージェント戦略外のLLMインタラクションに適用されます。 |
# --8<-- [end:parallelToolCalls]

# --8<-- [start:promptCacheKey]
| `promptCacheKey` | String | プロンプトキャッシュ用の安定したキャッシュキー。OpenAIはこれを使用して、類似のリクエストに対するレスポンスをキャッシュします。 |
# --8<-- [end:promptCacheKey]

# --8<-- [start:safetyIdentifier]
| `safetyIdentifier` | String | OpenAIのポリシーに違反するユーザーを検出するために使用される、安定した一意のユーザー識別子です。 |
# --8<-- [end:safetyIdentifier]

# --8<-- [start:serviceTier]
| `serviceTier` | ServiceTier | コストよりもパフォーマンスを優先するか、あるいはその逆かを選択できるOpenAIの処理ティア。詳細については、[ServiceTier](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ServiceTier) のAPIドキュメントを参照してください。 |
# --8<-- [end:serviceTier]

# --8<-- [start:store]
| `store` | Boolean | `true` の場合、プロバイダーは後で取得できるように出力を保存することがあります。 |
# --8<-- [end:store]

# --8<-- [start:audio]
| `audio` | OpenAIAudioConfig | オーディオ対応モデルを使用する場合のオーディオ出力設定。詳細については、[OpenAIAudioConfig](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIAudioConfig) のAPIドキュメントを参照してください。 |
# --8<-- [end:audio]

# --8<-- [start:reasoningEffort]
| `reasoningEffort` | ReasoningEffort | モデルが使用する推論（reasoning）のレベルを指定します。詳細および利用可能な値については、[ReasoningEffort](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.ReasoningEffort) のAPIドキュメントを参照してください。 |
# --8<-- [end:reasoningEffort]

# --8<-- [start:webSearchOptions]
| `webSearchOptions` | OpenAIWebSearchOptions | Web検索ツールの使用を設定します（サポートされている場合）。詳細については、[OpenAIWebSearchOptions](api:prompt-executor-openai-client-base::ai.koog.prompt.executor.clients.openai.base.models.OpenAIWebSearchOptions) のAPIドキュメントを参照してください。 |
# --8<-- [end:webSearchOptions]

# --8<-- [start:background]
| `background` | Boolean | レスポンスをバックグラウンドで実行します。 |
# --8<-- [end:background]

# --8<-- [start:include]
| `include` | List&lt;OpenAIInclude&gt; | Web検索ツールの呼び出し元や、ファイル検索ツールの呼び出しによる検索結果など、モデルのレスポンスに含める追加データ。詳細なリファレンス情報については、Koog APIリファレンスの [OpenAIInclude](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.OpenAIInclude) を参照してください。 `include` パラメーターの詳細については、[OpenAIのドキュメント](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include) を参照してください。 |
# --8<-- [end:include]

# --8<-- [start:maxToolCalls]
| `maxToolCalls` | Integer | このレスポンスで許可される組み込みツールの呼び出しの最大合計数。0以上の値を指定します。 |
# --8<-- [end:maxToolCalls]

# --8<-- [start:reasoning]
| `reasoning` | ReasoningConfig | 推論対応モデル用の推論設定。詳細については、[ReasoningConfig](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.ReasoningConfig) のAPIドキュメントを参照してください。 |
# --8<-- [end:reasoning]

# --8<-- [start:truncation]
| `truncation` | Truncation | コンテキストウィンドウの制限に近づいたときの切り捨て（truncation）戦略。詳細については、[Truncation](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.models.Truncation) のAPIドキュメントを参照してください。 |
# --8<-- [end:truncation]

# --8<-- [start:topK]
| `topK` | Integer | 出力を生成する際に考慮する上位トークンの数。0以上の値を指定します（プロバイダー固有の最小値が適用される場合があります）。 |
# --8<-- [end:topK]

# --8<-- [start:repetitionPenalty]
| `repetitionPenalty` | Double | トークンの繰り返しにペナルティを課します。すでに出現したトークンの次トークン確率は `repetitionPenalty` の値で除算され、 `repetitionPenalty > 1` の場合に再出現しにくくなります。0.0より大きく2.0以下の値を指定します。 |
# --8<-- [end:repetitionPenalty]

# --8<-- [start:minP]
| `minP` | Double | 最も可能性の高いトークンに対する相対的な確率が、定義された `minP` 値を下回るトークンをフィルタリングして除外します。0.0から0.1の範囲の値を指定します。 |
# --8<-- [end:minP]

# --8<-- [start:topA]
| `topA` | Double | モデルの確信度に基づいてサンプリングウィンドウを動的に調整します。モデルの確信度が高い場合（支配的な高確率の次トークンがある場合）、サンプリングウィンドウを上位数個のトークンに限定します。確信度が低い場合（似たような確率を持つトークンが多数ある場合）、より多くのトークンをサンプリングウィンドウに保持します。0.0から0.1（両端を含む）の範囲の値を指定します。値が大きいほど、動的な適応性が高くなります。 |
# --8<-- [end:topA]

# --8<-- [start:transforms]
| `transforms` | List&lt;String&gt; | コンテキスト変換のリスト。コンテキストがモデルのトークン制限を超えた場合に、コンテキストをどのように変換するかを定義します。デフォルトの変換は `middle-out` で、プロンプトの中央部分を切り捨てます。変換を行わない場合は空のリストを使用します。詳細については、OpenRouterドキュメントの [Message Transforms](https://openrouter.ai/docs/guides/features/message-transforms) を参照してください。 |
# --8<-- [end:transforms]

# --8<-- [start:models]
| `models` | List&lt;String&gt; | リクエストで許可されるモデルのリスト。 |
# --8<-- [end:models]

# --8<-- [start:route]
| `route` | String | 使用するリクエストルーティング戦略。 |
# --8<-- [end:route]

# --8<-- [start:provider]
| `provider` | ProviderPreferences | OpenRouterが使用するLLMプロバイダーをどのように選択するかを明示的に制御するための、さまざまなパラメーターが含まれます。詳細については、[ProviderPreferences](api:prompt-executor-openrouter-client::ai.koog.prompt.executor.clients.openrouter.models.ProviderPreferences) のAPIドキュメントを参照してください。 |
# --8<-- [end:provider]

# --8<-- [start:stopSequences]
| `stopSequences` | List&lt;String&gt; | モデルにコンテンツ生成を停止させるカスタムテキストシーケンス。一致した場合、レスポンスの `stop_reason` の値は `stop_sequence` になります。 |
# --8<-- [end:stopSequences]

# --8<-- [start:container]
| `container`  | String | リクエスト間で再利用するためのコンテナー識別子。コンテナーは、安全でコンテナー化されたコード実行環境を提供するために、Anthropicのコード実行ツールで使用されます。以前のレスポンスのコンテナー識別子を指定することで、複数のリクエスト間でコンテナーを再利用でき、リクエスト間で作成されたファイルを保持できます。詳細については、Anthropicドキュメントの [Containers](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#containers) を参照してください。 |
# --8<-- [end:container]

# --8<-- [start:mcpServers]
| `mcpServers` | List&lt;AnthropicMCPServerURLDefinition&gt; | リクエストで使用されるMCPサーバーの定義。最大20個のサーバーをサポートします。詳細については、[AnthropicMCPServerURLDefinition](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicMCPServerURLDefinition) のAPIリファレンスを参照してください。 |
# --8<-- [end:mcpServers]

# --8<-- [start:serviceTier]
| `serviceTier` | AnthropicServiceTier | リクエストに優先容量（利用可能な場合）を使用するか、標準容量を使用するかを決定します。詳細については、[AnthropicServiceTier](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicServiceTier) のAPIリファレンスおよびAnthropicの [Service tiers](https://platform.claude.com/docs/en/api/service-tiers) ドキュメントを参照してください。 |
# --8<-- [end:serviceTier]

# --8<-- [start:thinking]
| `thinking` | AnthropicThinking | Claudeの拡張思考（extended thinking）を有効にするための設定。有効にすると、レスポンスに思考コンテンツブロックも含まれます。詳細については、[AnthropicThinking](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.models.AnthropicThinking) のAPIリファレンスを参照してください。 |
# --8<-- [end:thinking]

# --8<-- [start:thinkingConfig]
| `thinkingConfig` | GoogleThinkingConfig | モデルが思考の連鎖（chain-of-thought）を公開すべきかどうか、およびそれに費やすことができるトークン数を制御します。詳細については、[GoogleThinkingConfig](api:prompt-executor-google-client::ai.koog.prompt.executor.clients.google.models.GoogleThinkingConfig) のAPIリファレンスを参照してください。 |
# --8<-- [end:thinkingConfig]

# --8<-- [start:enableSearch]
| `enableSearch` | Boolean | Web検索機能を有効にするかどうかを指定します。詳細については、Alibabaの [Web search](https://www.alibabacloud.com/help/en/model-studio/web-search?spm=a2c63.p38356.0.i14) ドキュメントを参照してください。 |
# --8<-- [end:enableSearch]

# --8<-- [start:enableThinking]
| `enableThinking` | Boolean | ハイブリッド思考モデルを使用する際に思考モードを有効にするかどうかを指定します。詳細については、Alibabaの [Deep thinking](https://www.alibabacloud.com/help/en/model-studio/deep-thinking?spm=a2c63.p38356.0.i11) ドキュメントを参照してください。 |
# --8<-- [end:enableThinking]

# --8<-- [start:randomSeed]
| `randomSeed` | Integer | ランダムサンプリングに使用するシード。設定すると、同じパラメーターと同じシード値を持つ異なる呼び出しが決定論的な結果を生成します。 |
# --8<-- [end:randomSeed]

# --8<-- [start:promptMode]
| `promptMode` | String | 推論モードとシステムプロンプトなしを切り替えることができます。 `reasoning` に設定すると、推論モデル用のデフォルトのシステムプロンプトが使用されます。詳細については、Mistralの [Reasoning](https://docs.mistral.ai/capabilities/reasoning) ドキュメントを参照してください。 |
# --8<-- [end:promptMode]

# --8<-- [start:safePrompt]
| `safePrompt` | Boolean | すべての会話の前にセーフティプロンプトを注入するかどうかを指定します。セーフティプロンプトは、ガードレールを適用し、有害なコンテンツから保護するために使用されます。詳細については、Mistralの [Moderation & Guardarailing](https://docs.mistral.ai/capabilities/guardrailing) ドキュメントを参照してください。 |
# --8<-- [end:safePrompt]