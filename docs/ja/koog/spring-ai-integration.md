# Spring AIとの統合

Koogは、Spring AIのモデル抽象化とKoogエージェントフレームワークを橋渡しするSpring AI統合スターターを提供します。
すでにモデルアクセスにSpring AIを使用している場合、これらのスターターを使用することで、既存のSpring AI設定を置き換えることなく、その上にKoogのエージェントオーケストレーション（Agent orchestration）を組み込むことができます。

## `koog-spring-boot-starter` との違い

| | `koog-spring-boot-starter` | `koog-spring-ai` スターター |
|---|---|---|
| **LLMトランスポート** | Koog独自のHTTPクライアント（プロバイダーごとに1つ：OpenAI、Anthropic、Googleなど） | Spring AIの `ChatModel` / `EmbeddingModel` に委譲 — Spring AIがサポートするすべてのプロバイダーが自動的に動作します |
| **設定** | プロバイダーごとの `ai.koog.*` プロパティ | Spring AIスターターによって管理される標準的な `spring.ai.*` プロパティ |
| **利用シーン** | KoogにLLM接続を直接管理させたい場合 | すでにモデルアクセスにSpring AIを使用しており、その上にKoogのエージェントオーケストレーションを組み込みたい場合 |

どちらのアプローチも独立しています。LLMの接続性をどのように管理したいかに基づいて選択してください。
直接的なKoogスターターのアプローチについては、[Spring Boot統合](spring-boot.md)を参照してください。

## 利用可能なスターター

| モジュール | 目的 |
|---|---|
| `koog-spring-ai-starter-model-chat` | Spring AIの `ChatModel`（およびオプションの `ModerationModel`）を Koogの `LLMClient` および `PromptExecutor` に適合させます |
| `koog-spring-ai-starter-model-embedding` | Spring AIの `EmbeddingModel` を Koogの `LLMEmbeddingProvider` に適合させます |

各スターターは、独自のアート構成、設定プロパティ、およびディスパッチャー管理を備えた、完全に独立したSpring Bootスターターです。

## チャットモデルスターター (Chat Model Starter)

### 概要

`koog-spring-ai-starter-model-chat` スターターは、Spring AIのチャットモデル抽象化とKoogエージェントフレームワークを橋渡しします。
以下の内容を自動構成します：

- Spring AIの `ChatModel` に委譲する Koog の `LLMClient` (`SpringAiLLMClient`)
- 利用可能なすべての `LLMClient` Beanから組み立てられた `PromptExecutor` (`MultiLLMPromptExecutor`)

ツールは常にKoogエージェントフレームワークによって実行されます。Spring AIはツールの定義/スキーマのみを受け取ります。ツールを含むすべてのリクエストにおいて、`internalToolExecutionEnabled` フラグは `false` に設定されます。

### 依存関係の追加

任意のSpring AIモデルスターター（例：Google用）と一緒に依存関係を追加します：

=== "Gradle (Kotlin DSL)"

    ```kotlin
    // build.gradle.kts
    dependencies {
        implementation("ai.koog:koog-agents-jvm:$koogVersion")
        implementation("ai.koog:koog-spring-ai-starter-model-chat:$koogVersion")
        implementation("org.springframework.ai:spring-ai-starter-model-google-genai")
    }
    ```

=== "Maven"

    ```xml
    <dependencies>
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents-jvm</artifactId>
            <version>${koog.version}</version>
        </dependency>
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-spring-ai-starter-model-chat</artifactId>
            <version>${koog.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-google-genai</artifactId>
        </dependency>
    </dependencies>
    ```

プロジェクトが以下を満たしていることを確認してください：

- Spring Boot 3（Java 17以上が必要）
- バージョン 2.3.10+ の Kotlin ライブラリ (kotlin-stdlib)
- 選択したプロバイダー用の Spring AI モデルスターター

### 利用可能なプロバイダー
Anthropic, Azure OpenAI, Bedrock Converse, Deepseek, Google GenAI, HuggingFace, MiniMax, Mistral AI, OCI GenAI, Ollama, OpenAI, Vertex AI, ZhiPu AI

### 設定

必要に応じて Spring Boot のプロパティを修正します：

```properties
# Gemini Developer APIのAPIキーを設定するか、環境変数経由で渡します
spring.ai.google.genai.api-key=YOUR_GOOGLE_API_KEY
# デフォルト値
spring.ai.model.chat=google-genai
koog.spring.ai.chat.enabled=true
koog.spring.ai.chat.dispatcher.type=AUTO
```

単一の `ChatModel` Bean が存在する場合、すべてが自動的に動作します。アダプターがそれを Koog の `LLMClient` でラップし、すぐに使用可能な `PromptExecutor` を作成します。

### 使用例

`PromptExecutor` をインジェクトし、それを使用して Koog エージェントを実行します：

=== "Kotlin"

    ```kotlin
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import ai.koog.prompt.executor.model.PromptExecutor
    import org.springframework.stereotype.Service

    @Service
    class MyAgentService(private val promptExecutor: PromptExecutor) {

        suspend fun askAgent(userMessage: String): String {
            val agent = AIAgent(
                promptExecutor = promptExecutor,
                llmModel = GoogleModels.Gemini2_5Flash,
                systemPrompt = "You are a helpful assistant."
            )

            return agent.run(userMessage)
        }
    }
    ```

=== "Java"

    ```java
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.google.GoogleModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import org.springframework.stereotype.Service;

    @Service
    public class MyAgentService {
        private final PromptExecutor promptExecutor;

        public MyAgentService(PromptExecutor promptExecutor) {
            this.promptExecutor = promptExecutor;
        }

        public String askAgent(String userMessage) {
            var agent = AIAgent.builder()
                    .promptExecutor(promptExecutor)
                    .llmModel(GoogleModels.Gemini2_5Flash)
                    .systemPrompt("You are a helpful assistant.")
                    .build();

            return agent.run(userMessage);
        }
    }
    ```

または、独自の `PromptExecutor` Bean を提供して、自動構成されたものを完全に上書きすることもできます。

### 設定プロパティ (`koog.spring.ai.chat`)

| プロパティ | 型 | デフォルト値 | 説明 |
|---|---|---|---|
| `enabled` | `Boolean` | `true` | チャットの自動構成を有効/無効にします |
| `chat-model-bean-name` | `String?` | `null` | 使用する `ChatModel` の Bean 名（マルチモデルコンテキスト用） |
| `moderation-model-bean-name` | `String?` | `null` | 使用する `ModerationModel` の Bean 名（マルチモデルコンテキスト用） |
| `provider` | `String?` | `null` | LLMプロバイダーID（例：`openai`, `anthropic`, `google`）。設定されると、`ChatModel` クラス名からの自動検出を上書きします。自動検出に失敗した場合は `spring-ai` にフォールバックします。 |
| `dispatcher.type` | `AUTO` / `IO` | `AUTO` | ブロッキングモデル呼び出し用のディスパッチャー |
| `dispatcher.parallelism` | `Int` | `0` (= 無制限) | `IO` ディスパッチャーの最大並行数 (0 = 制限なし) |

### ディスパッチャーのタイプ

- **`AUTO`** (デフォルト): 利用可能な場合は Spring 管理の `AsyncTaskExecutor` を使用し（例：Spring Boot 3.2+ で `spring.threads.virtual.enabled=true` の場合）、そうでない場合は `Dispatchers.IO` にフォールバックします。これにより、標準的な Spring Boot プロパティを1つ設定するだけで仮想スレッド（Virtual threads）を利用できるようになります。
- **`IO`**: 常に `Dispatchers.IO` を使用します。`dispatcher.parallelism` が 0 より大きい場合は、`Dispatchers.IO.limitedParallelism(parallelism)` を使用して並行数を制限します。

### マルチモデルコンテキスト

複数の `ChatModel` または `ModerationModel` Bean が登録されている場合は、使用するものを指定します：

```properties
koog.spring.ai.chat.chat-model-bean-name=openAiChatModel
koog.spring.ai.chat.moderation-model-bean-name=openAiModerationModel
```

セレクターがない場合、自動構成は候補が1つだけ存在する場合にのみ有効になります。

### 拡張ポイント

- **`ChatOptionsCustomizer`**: プロバイダー固有の `ChatOptions` チューニングを適用するために、この関数型インターフェースを実装した Spring Bean を登録します：

=== "Kotlin"

    ```kotlin
    @Bean
    fun chatOptionsCustomizer() = ChatOptionsCustomizer { options, params, model ->
        // モデルまたはリクエストパラメータに基づいてカスタムオプションを適用
        options
    }
    ```

=== "Java"

    ```java
    @Bean
    public ChatOptionsCustomizer chatOptionsCustomizer() {
        return (options, params, model) -> {
            // モデルまたはリクエストパラメータに基づいてカスタムオプションを適用
            return options;
        };
    }
    ```

  自動構成は、オプションのインジェクションを介してこれを自動的に取得します。

- **カスタム `LLMClient`**: 独自の `LLMClient` Bean を登録して、自動構成されたアダプターを完全に上書きします。
- **カスタム `PromptExecutor`**: 独自の `PromptExecutor` Bean を登録して、自動構成された `MultiLLMPromptExecutor` を完全に上書きします。

## 次のステップ

- 最小限のAIワークフローを構築するための[基本エージェント](agents/basic-agents.md)について学ぶ
- 高度なユースケース向けの[グラフベースのエージェント](agents/graph-based-agents.md)を探索する
- エージェントの機能を拡張するために[ツールの概要](tools-overview.md)を確認する
- 実践的な実装については[サンプル](examples.md)をチェックする
- 直接的なKoogスターターのアプローチについては[Spring Boot統合](spring-boot.md)ガイドを読む