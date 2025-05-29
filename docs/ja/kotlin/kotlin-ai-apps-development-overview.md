[//]: # (title: KotlinによるAI駆動型アプリ開発)

Kotlinは、AIを活用したアプリケーションを構築するための現代的で実用的な基盤を提供します。複数のプラットフォームで使用でき、確立されたAIフレームワークと良好に統合し、一般的なAI開発パターンをサポートします。

> このページでは、[Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples)リポジトリの動作する例と共に、現実のAIシナリオでKotlinがどのように使用されているかを紹介します。
> 
{style="note"}

## Kotlin AIエージェントフレームワーク – Koog

[Koog](https://koog.ai)は、外部サービスを必要とせずに、AIエージェントをローカルで作成・実行するためのKotlinベースのフレームワークです。
KoogはJetBrainsの革新的なオープンソース・エージェントフレームワークであり、開発者がJVMエコシステム内でAIエージェントを構築できるようにします。
ツールと対話し、複雑なワークフローを処理し、ユーザーとコミュニケーションできるインテリジェントなエージェントを構築するための純粋なKotlin実装を提供します。

## その他のユースケース

他にも多くのユースケースがあり、KotlinはAI開発に役立ちます。
言語モデルをバックエンドサービスに統合することから、AIを活用したユーザーインターフェースを構築することまで、これらの例は様々なAIアプリケーションにおけるKotlinの多用途性を示しています。

### 検索拡張生成 (RAG)

Kotlinを使用して、言語モデルをドキュメント、ベクトルストア、APIなどの外部ソースに接続する検索拡張生成 (RAG) パイプラインを構築します。
例:

*   [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): Kotlin標準ライブラリのドキュメントをベクトルストアにロードし、ドキュメントベースのQ&AをサポートするSpring Bootアプリ。
*   [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): LangChain4jを使用した最小限のRAGの例。

### エージェントベースのアプリケーション

Kotlinで、言語モデルとツールを使用して推論し、計画し、行動するAIエージェントを構築します。
例:

*   [`koog`](https://github.com/JetBrains/koog): KotlinのエージェントフレームワークKoogを使用してAIエージェントを構築する方法を示します。
*   [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): LangChain4jで構築されたシンプルなツール使用エージェントが含まれています。

### 思考の連鎖プロンプティング

言語モデルを多段階の推論に導く構造化されたプロンプティング技術を実装します。
例:

*   [`LangChain4j_Overview.ipynb`](https://github.com/Kotlin/Kotlin-AI-Examples/blob/master/notebooks/langchain4j/LangChain4j_Overview.ipynb): 思考の連鎖と構造化された出力をデモンストレーションするKotlin Notebook。

### バックエンドサービスにおけるLLM

KotlinとSpringを使用して、LLMをビジネスロジックまたはREST APIに統合します。
例:

*   [`spring-ai-examples`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/spring-ai-examples): 分類、チャット、要約の例が含まれています。
*   [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): LLMの応答とアプリケーションロジックの完全な統合を示します。

### AIを活用したマルチプラットフォームユーザーインターフェース

Compose Multiplatformを使用して、Kotlinで対話型のAIを活用したUIを構築します。
例:

*   [`mcp-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/mcp/mcp-demo): ClaudeとOpenAIに接続し、Compose Multiplatformを使用して応答を表示するデスクトップUI。

## 例を探索する

[Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples)リポジトリの例を探索し実行できます。
各プロジェクトは自己完結型です。各プロジェクトは、KotlinベースのAIアプリケーションを構築するための参照またはテンプレートとして使用できます。

## 次のステップ

*   IntelliJ IDEAでKotlinとSpring AIを使用する方法について詳しく学ぶため、[Qdrantに保存されたドキュメントに基づいて質問に回答するためにSpring AIを使用するKotlinアプリを構築する](spring-ai-guide.md)チュートリアルを完了してください。
*   [Kotlinコミュニティ](https://kotlinlang.org/community/)に参加して、KotlinでAIアプリケーションを構築している他の開発者とつながりましょう。