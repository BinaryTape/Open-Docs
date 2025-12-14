[//]: # (title: AIを活用したアプリケーション開発のためのKotlin)

Kotlinは、AIを活用したアプリケーションを構築するための、現代的で実用的な基盤を提供します。複数のプラットフォームで利用でき、確立されたAIフレームワークと良好に統合し、一般的なAI開発パターンをサポートします。

## Koog

[Koog](https://koog.ai)は、JetBrainsが提供する、シンプルから複雑なAIエージェントを構築するためのオープンソースフレームワークです。マルチプラットフォームサポート、Spring BootおよびKtorとの統合、イディオマティックなDSL、そしてすぐに利用できる本番環境対応の機能を提供します。

### 数行でシンプルなエージェントを作成する

```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            // Use Anthropic, Google, OpenRouter, or any other provider
            executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```

<a href="https://docs.koog.ai/getting-started/"><img src="get-started-with-koog.svg" width="700" alt="Koogを始める" style="block"/></a>

### 主な機能

*   **マルチプラットフォーム開発のサポート**。マルチプラットフォームサポートにより、JVM、JavaScript、WebAssembly、Android、iOS向けのAIエージェントアプリケーション開発が可能になります。
*   **信頼性とフォールトトレランス**。組み込みのリトライ機能により、Koogはタイムアウトやツールエラーなどの障害を開発者が処理できるようにします。エージェントの永続化により、チャットメッセージだけでなく、完全なエージェントの状態マシンを復元することが可能になります。
*   **長文コンテキストのための組み込み履歴圧縮技術**。Koogには、追加の設定なしに長時間の会話を圧縮・管理するための高度な戦略が付属しています。
*   **エンタープライズ対応の統合**。Koogは、[Spring Boot](https://spring.io/projects/spring-boot)や[Ktor](https://ktor.io)などの一般的なJVMフレームワークと統合できます。
*   **OpenTelemetryエクスポーターによるオブザーバビリティ**。Koogは、AIアプリケーションの監視とデバッグのために、W&B WeaveやLangfuseなどの人気のあるオブザーバビリティプロバイダーとのすぐに使える統合を提供します。
*   **LLMの切り替えとシームレスな履歴適応**。Koogは、既存の会話履歴を失うことなく、任意の時点で新しいツールセットを持つ異なるLLMに切り替えることを可能にします。また、OpenAI、Anthropic、Googleなど、複数のLLMプロバイダー間でのルーティング変更も可能です。Ollamaとの統合により、ローカルモデルを使用してエージェントをローカルで実行できます。
*   **JVMおよびKotlinアプリケーションとの統合**。Koogは、JVMおよびKotlin開発者向けに特化したイディオマティックで型安全なDSLを提供します。
*   **Model Context Protocol (MCP) 統合**。KoogはエージェントでMCPツールを使用できるようにします。
*   **知識検索とメモリ**。エンベディング、ランク付けされたドキュメントストレージ、および共有エージェントメモリにより、Koog自体が会話全体で積極的に知識を保持します。
*   **ストリーミング機能**。Koogは、ストリーミングサポートと並列ツール呼び出しにより、開発者が応答をリアルタイムで処理できるようにします。

### どこから始めるか

*   [概要](https://docs.koog.ai/)でKoogの機能を探索します。
*   [入門ガイド](https://docs.koog.ai/getting-started/)で最初のKoogエージェントを構築します。
*   [Koogリリースノート](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md)で最新の更新を確認します。
*   [例](https://docs.koog.ai/examples/)から学びます。

## Model Context Protocol (MCP) Kotlin SDK

[MCP Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk)は、Model Context ProtocolのKotlin Multiplatform実装です。このSDKを使用すると、開発者はKotlinでAIを活用したアプリケーションを構築し、JVM、WebAssembly、iOSにわたるLLMサーフェスと統合できます。

MCP Kotlin SDKを使用すると、以下のことが可能になります。

*   コンテキスト処理をLLMとの対話から分離することで、LLMに構造化された標準的な方法でコンテキストを提供します。
*   既存のサーバーからリソースを消費するMCPクライアントを構築します。
*   プロンプト、ツール、リソースをLLMに公開するMCPサーバーを作成します。
*   stdio、SSE、WebSocketなどの標準的な通信トランスポートを使用します。
*   すべてのMCPプロトコルメッセージとライフサイクルイベントを処理します。

## その他のAI活用アプリケーションシナリオを探索する

シームレスなJava相互運用性とKotlin Multiplatformのおかげで、Kotlinを確立されたAI SDKやフレームワークと組み合わせ、バックエンドやデスクトップ/モバイルUIを構築し、RAGやエージェントベースのワークフローといったパターンを採用できます。

> [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples)リポジトリから例を探索して実行できます。
> 各プロジェクトは自己完結型です。各プロジェクトをKotlinベースのAIアプリケーションを構築するための参照またはテンプレートとして使用できます。

### 主要なモデルプロバイダーに接続する

Kotlinを使用して、OpenAI、Anthropic、Googleなどの主要なモデルプロバイダーに接続します。

*   [OpenAI](https://github.com/openai/openai-java) — OpenAI APIの公式Java SDK。応答、チャット、画像、オーディオをカバーしています。
*   [Anthropic (Claude)](https://github.com/anthropics/anthropic-sdk-java) — Claude Messages APIの公式Java SDK。Vertex AIおよびBedrockとの統合モジュールが含まれています。
*   [Google AI (Gemini / Vertex AI)](https://github.com/googleapis/java-genai) — Gemini APIとVertex AIを切り替える単一クライアントを持つ公式Java SDK。
*   [Azure OpenAI](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) — Azure OpenAI Serviceの公式Javaクライアント。チャット補完とエンベディングをサポートします。
*   [AWS Bedrock](https://github.com/aws/aws-sdk-kotlin) — 基盤モデルを呼び出すための公式SDK。BedrockおよびBedrock Runtime用のKotlin SDKとJava SDKが含まれています。

### RAGパイプラインとエージェントベースのアプリケーションを作成する

*   [Spring AI](https://github.com/spring-projects/spring-ai) — プロンプト、チャット、エンベディング、ツールと関数呼び出し、およびベクトルストア向けのマルチプロバイダー抽象化。
*   [LangChain4j](https://docs.langchain4j.dev/tutorials/kotlin/) — プロンプト、ツール、検索拡張生成 (RAG) パイプライン、およびエージェントのためのKotlin拡張機能を備えたJVMツールキット。

## 次のステップ

*   [Spring AIを使用して質問に回答するKotlinアプリを構築する](spring-ai-guide.md)チュートリアルを完了して、IntelliJ IDEAでSpring AIとKotlinを使用する方法について詳しく学びます。
*   [Kotlinコミュニティ](https://kotlinlang.org/community/)に参加して、KotlinでAIアプリケーションを構築している他の開発者とつながりましょう。