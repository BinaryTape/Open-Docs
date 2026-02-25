# はじめに

このガイドでは、Koogのインストール方法と、最初のAIエージェントの作成方法について説明します。

## 前提条件

開始する前に、以下が準備されていることを確認してください：

- GradleまたはMavenを使用する、動作可能なKotlin/JVMプロジェクト。
- Java 17以上がインストールされていること。
- 使用する[LLMプロバイダー](llm-providers.md)の有効なAPIキー（ローカルで動作するOllamaの場合は不要）。

## Koogのインストール

Koogを使用するには、ビルド設定に必要なすべての依存関係を含める必要があります。

!!! note
    `LATEST_VERSION` は、Maven Centralで公開されているKoogの最新バージョンに置き換えてください。

=== "Gradle (Kotlin DSL)"

    1. `build.gradle.kts` ファイルに依存関係を追加します。
    
        ```kotlin
        dependencies {
            implementation("ai.koog:koog-agents:LATEST_VERSION")
        }
        ```
    2. リポジトリのリストに `mavenCentral()` が含まれていることを確認してください。
    
        ```kotlin
        repositories {
            mavenCentral()
        }
        ```

=== "Gradle (Groovy)"

    1. `build.gradle` ファイルに依存関係を追加します。
    
        ```groovy
        dependencies {
            implementation 'ai.koog:koog-agents:LATEST_VERSION'
        }
        ```
    2. リポジトリのリストに `mavenCentral()` が含まれていることを確認してください。
        ```groovy
        repositories {
            mavenCentral()
        }
        ```

=== "Maven"

    1. `pom.xml` ファイルに依存関係を追加します。
    
        ```xml
        <dependency>
            <groupId>ai.koog</groupId>
            <artifactId>koog-agents</artifactId>
            <version>LATEST_VERSION</version>
        </dependency>
        ```
    2. リポジトリのリストに `mavenCentral()` が含まれていることを確認してください。

        ```xml
         <repositories>
            <repository>
                <id>mavenCentral</id>
                <url>https://repo1.maven.org/maven2/</url>
            </repository>
        </repositories>
        ```

!!! note
    Koogを [Ktorサーバー](ktor-plugin.md)、[Springアプリケーション](spring-boot.md)、または [MCPツール](model-context-protocol.md) と統合する場合、ビルド設定に追加の依存関係を含める必要があります。
    正確な依存関係については、Koogドキュメントの関連ページを参照してください。

??? tip "ナイトリービルド (Nightly builds)"

    developブランチからのナイトリービルドは、[JetBrains Grazie Maven](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public) リポジトリに公開されています。
    
    ナイトリービルドを使用するには、以下のリポジトリをビルド設定に追加してください：
    `https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public`
    
    その後、Koogの依存関係を目的のナイトリーバージョンに更新します。ナイトリーバージョンは 
    `[next-major-version]-develop-[date]-[time]` というパターンに従います。
    
    利用可能なナイトリービルドは [こちら](https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public/ai/koog/koog-agents/) で確認できます。

## APIキーの設定

!!! tip
    APIキーを保存するには、環境変数または安全な設定管理システムを使用してください。
    ソースコードに直接APIキーをハードコーディングすることは避けてください。

=== "OpenAI"

    [APIキー](https://platform.openai.com/api-keys) を取得し、環境変数として設定します。
    
    === "Linux/macOS"

        ```bash
        export OPENAI_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENAI_API_KEY "your-api-key"
        ```
    
    変更を適用するためにターミナルを再起動してください。これで、APIキーを取得してエージェントを作成できるようになります。

=== "Anthropic"

    [APIキー](https://console.anthropic.com/settings/keys) を取得し、環境変数として設定します。

    === "Linux/macOS"

        ```bash
        export ANTHROPIC_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx ANTHROPIC_API_KEY "your-api-key"
        ```
    
    変更を適用するためにターミナルを再起動してください。これで、APIキーを取得してエージェントを作成できるようになります。

=== "Google"

    [APIキー](https://aistudio.google.com/app/api-keys) を取得し、環境変数として設定します。

    === "Linux/macOS"

        ```bash
        export GOOGLE_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx GOOGLE_API_KEY "your-api-key"
        ```

    変更を適用するためにターミナルを再起動してください。これで、APIキーを取得してエージェントを作成できるようになります。

=== "DeepSeek"
    
    [APIキー](https://platform.deepseek.com/api_keys) を取得し、環境変数として設定します。

    === "Linux/macOS"

        ```bash
        export DEEPSEEK_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx DEEPSEEK_API_KEY "your-api-key"
        ```

    変更を適用するためにターミナルを再起動してください。これで、APIキーを取得してエージェントを作成できるようになります。

=== "OpenRouter"

    [APIキー](https://openrouter.ai/keys) を取得し、環境変数として設定します。

    === "Linux/macOS"

        ```bash
        export OPENROUTER_API_KEY=your-api-key
        ```

    === "Windows"

        ```shell
        setx OPENROUTER_API_KEY "your-api-key"
        ```

    変更を適用するためにターミナルを再起動してください。これで、APIキーを取得してエージェントを作成できるようになります。

=== "Bedrock"

    有効な [AWS認証情報](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_bedrock.html)（アクセスキーとシークレットアクセスキー）を取得し、環境変数として設定します。

    === "Linux/macOS"

        ```bash
        export AWS_BEDROCK_ACCESS_KEY=your-access-key
        export AWS_BEDROCK_SECRET_ACCESS_KEY=your-secret-access-key
        ``` 

    === "Windows"

        ```shell
        setx AWS_BEDROCK_ACCESS_KEY "your-access-key"
        setx AWS_BEDROCK_SECRET_ACCESS_KEY "your-secret-access-key"
        ```

    変更を適用するためにターミナルを再起動してください。これで、APIキーを取得してエージェントを作成できるようになります。

=== "Ollama"

    Ollamaをインストールし、APIキーなしでローカルでモデルを実行します。

    詳細については、[Ollamaドキュメント](https://docs.ollama.com/quickstart) を参照してください。

## エージェントの作成と実行

=== "OpenAI"

    以下の例では、[`GPT-4o`](https://platform.openai.com/docs/models/gpt-4o) モデルを使用して、シンプルなAIエージェントを作成し実行します。

    <!--- CLEAR -->
    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // OPENAI_API_KEY 環境変数からAPIキーを取得する
        val apiKey = System.getenv("OPENAI_API_KEY")
            ?: error("APIキーが設定されていません。")
        
        // エージェントを作成する
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )
    
        // エージェントを実行する
        val result = agent.run("こんにちは！どのような手伝いができますか？")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-01.kt -->

    この例では、以下のような出力が生成されます：
    
    ```
    こんにちは！どのようなことでもお手伝いします。私ができることをいくつか挙げます：

    - 質問に答える。
    - 気になる概念やトピックについて説明する。
    - タスクのステップバイステップの手順を提供する。
    - アドバイス、メモ、アイデアを提案する。
    - 調査や複雑な資料の要約を支援する。
    - テキスト、メール、その他のドキュメントを作成または編集する。
    - クリエイティブなプロジェクトや解決策のブレインストーミングを行う。
    - 問題を解決したり計算を行ったりする。

    何かお手伝いが必要なことがあれば教えてください。いつでもお待ちしています！
    ```

=== "Anthropic"

    以下の例では、[`Claude Opus 4.1`](https://www.anthropic.com/news/claude-opus-4-1) モデルを使用して、シンプルなAIエージェントを作成し実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // ANTHROPIC_API_KEY 環境変数からAPIキーを取得する
        val apiKey = System.getenv("ANTHROPIC_API_KEY")
            ?: error("APIキーが設定されていません。")
        
        // エージェントを作成する
        val agent = AIAgent(
            promptExecutor = simpleAnthropicExecutor(apiKey),
            llmModel = AnthropicModels.Opus_4_1
        )
    
        // エージェントを実行する
        val result = agent.run("こんにちは！どのような手伝いができますか？")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-02.kt -->

    この例では、以下のような出力が生成されます：

    ```
    こんにちは！以下のようなお手伝いができます：

    - **質問への回答**とトピックの説明
    - **執筆** - 下書き、編集、校正
    - **学習** - 宿題、数学、学習支援
    - **問題解決**とブレインストーミング
    - **調査**と情報検索
    - **一般的なタスク** - 手順の説明、計画、推奨事項
    
    本日はどのようなお手伝いが必要ですか？
    ```

=== "Google"

    以下の例では、[`Gemini 2.5 Pro`](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro) モデルを使用して、シンプルなAIエージェントを作成し実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // GOOGLE_API_KEY 環境変数からAPIキーを取得する
        val apiKey = System.getenv("GOOGLE_API_KEY")
            ?: error("APIキーが設定されていません。")
        
        // エージェントを作成する
        val agent = AIAgent(
            promptExecutor = simpleGoogleAIExecutor(apiKey),
            llmModel = GoogleModels.Gemini2_5Pro
        )
    
        // エージェントを実行する
        val result = agent.run("こんにちは！どのような手伝いができますか？")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-03.kt -->

    この例では、以下のような出力が生成されます：

    ```
    私は言語や情報に関するタスクをお手伝いできるAIです。以下のようなことを依頼できます：

    *   **質問に答える**
    *   **テキストの作成や編集**（メール、物語、コードなど）
    *   **アイデアのブレインストーミング**
    *   **長いドキュメントの要約**
    *   **計画を立てる**（旅行やプロジェクトなど）
    *   **クリエイティブなパートナーになる**

    必要なことを教えてください。
    ```

=== "DeepSeek"

    以下の例では、`deepseek-chat` モデルを使用して、シンプルなAIエージェントを作成し実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient
    import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
    import ai.koog.prompt.executor.clients.deepseek.DeepSeekModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // DEEPSEEK_API_KEY 環境変数からAPIキーを取得する
        val apiKey = System.getenv("DEEPSEEK_API_KEY")
            ?: error("APIキーが設定されていません。")
        
        // LLMクライアントを作成する
        val deepSeekClient = DeepSeekLLMClient(apiKey)
    
        // エージェントを作成する
        val agent = AIAgent(
            // LLMクライアントを使用してプロンプトエグゼキューターを作成する
            promptExecutor = MultiLLMPromptExecutor(deepSeekClient),
            // モデルを指定する
            llmModel = DeepSeekModels.DeepSeekChat
        )
    
        // エージェントを実行する
        val result = agent.run("こんにちは！どのような手伝いができますか？")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-04.kt -->

    この例では、以下のような出力が生成されます：

    ```
    こんにちは！質問への回答、情報の提供、問題解決の支援、クリエイティブなアイデアの提案、さらには単なるチャットなど、幅広いタスクでお手伝いします。調査、執筆、新しいことの学習、あるいは単にあるトピックについて議論したい場合でも、お気軽にお尋ねください。喜んでお手伝いします！ 😊
    ```

=== "OpenRouter"

    以下の例では、[`GPT-4o`](https://openrouter.ai/openai/gpt-4o) モデルを使用して、シンプルなAIエージェントを作成し実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor
    import ai.koog.prompt.executor.clients.openrouter.OpenRouterModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // OPENROUTER_API_KEY 環境変数からAPIキーを取得する
        val apiKey = System.getenv("OPENROUTER_API_KEY")
            ?: error("APIキーが設定されていません。")
        
        // エージェントを作成する
        val agent = AIAgent(
            promptExecutor = simpleOpenRouterExecutor(apiKey),
            llmModel = OpenRouterModels.GPT4o
        )
    
        // エージェントを実行する
        val result = agent.run("こんにちは！どのような手伝いができますか？")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-05.kt -->

    この例では、以下のような出力が生成されます：

    ```
    質問への回答、執筆のサポート、問題の解決、タスクの整理など、さまざまなお手伝いができます。必要なことを教えてください！
    ```

=== "Bedrock"

    以下の例では、[`Claude Sonnet 4.5`](https://www.anthropic.com/news/claude-sonnet-4-5) モデルを使用して、シンプルなAIエージェントを作成し実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // AWS_BEDROCK_ACCESS_KEY および AWS_BEDROCK_SECRET_ACCESS_KEY 環境変数からアクセスキーを取得する
        val awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
            ?: error("アクセスキーが設定されていません。")
    
        val awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
            ?: error("シークレットアクセスキーが設定されていません。")
        
        // エージェントを作成する
        val agent = AIAgent(
            promptExecutor = simpleBedrockExecutor(awsAccessKeyId, awsSecretAccessKey),
            llmModel = BedrockModels.AnthropicClaude4_5Sonnet
        )
    
        // エージェントを実行する
        val result = agent.run("こんにちは！どのような手伝いができますか？")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-06.kt -->

    この例では、以下のような出力が生成されます：

    ```
    こんにちは！私は便利なアシスタントであり、以下のような多くの方法でお手伝いできます：

    - **質問への回答**: 幅広いトピック（科学、歴史、技術など）について
    - **執筆支援**: メールの下書き、エッセイ、クリエイティブなコンテンツ、またはテキストの編集
    - **問題解決**: 数学の問題、ロジックパズル、またはトラブルシューティングの実行
    - **学習サポート**: 概念の説明、学習ノートの提供、または個別指導
    - **計画と整理**: プロジェクト、スケジュール、またはタスクの分解の支援
    - **コーディング支援**: プログラミング概念の説明やコードのデバッグ支援
    - **クリエイティブなブレインストーミング**: プロジェクト、物語、または解決策のアイデア生成
    - **一般的な会話**: トピックについての議論や単なるチャット
    
     本日はどのようなお手伝いが必要ですか？
    ```

=== "Ollama"

    以下の例では、[`llama3.2`](https://ollama.com/library/llama3.2) モデルを使用して、シンプルなAIエージェントを作成し実行します。

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    fun main() = runBlocking {
        // エージェントを作成する
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2
        )

        // エージェントを実行する
        val result = agent.run("こんにちは！どのような手伝いができますか？")
        println(result)
    }
    ```
    <!--- KNIT example-getting-started-07.kt -->

    この例では、以下のような出力が生成されます：

    ```
    質問への回答、情報の提供、さらには校正や執筆の提案といった言語関連のタスクなど、さまざまなタスクをお手伝いできます。本日はどのようなご用件でしょうか？
    ```

## 次のステップ

- Koogの [主な機能](key-features.md) を確認する。
- 利用可能な [エージェントの種類](basic-agents.md) について詳しく学ぶ。