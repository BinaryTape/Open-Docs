[//]: # (title: KotlinによるAI活用アプリケーション開発)

Kotlinは、AIを活用したアプリケーションを構築するための、現代的で実用的な基盤を提供します。
複数のプラットフォームで利用でき、確立されたAIフレームワークと良好に統合し、一般的なAI開発パターンをサポートします。

> このページでは、[Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples)リポジトリの動作する例を用いて、Kotlinが実際のAIシナリオでどのように使用されているかを紹介します。
>
{style="note"}

## Kotlin AIエージェントフレームワーク – Koog

[Koog](https://koog.ai)は、外部サービスを必要とせずに、AIエージェントをローカルで作成・実行するためのKotlinベースのフレームワークです。
Koogは、JetBrainsの革新的なオープンソースのエージェントフレームワークであり、開発者がJVMエコシステム内でAIエージェントを構築できるように支援します。
ツールと対話し、複雑なワークフローを処理し、ユーザーとコミュニケーションできるインテリジェントなエージェントを構築するための、純粋なKotlin実装を提供します。

## その他のユースケース

KotlinがAI開発に役立つユースケースは他にも多数あります。
言語モデルをバックエンドサービスに統合することから、AIを活用したユーザーインターフェースを構築することまで、
これらの例は、様々なAIアプリケーションにおけるKotlinの多様性を示しています。

### 検索拡張生成

Kotlinを使用して、言語モデルをドキュメント、ベクトルストア、またはAPIなどの外部ソースに接続する検索拡張生成 (RAG) パイプラインを構築します。
例：

*   [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): Kotlin標準ライブラリのドキュメントをベクトルストアにロードし、ドキュメントベースのQ&AをサポートするSpring Bootアプリ。
*   [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): LangChain4jを使用した最小限のRAGの例。

### エージェントベースのアプリケーション

Kotlinで、言語モデルとツールを使用して推論し、計画し、行動するAIエージェントを構築します。
例：

*   [`koog`](https://github.com/JetBrains/koog): KotlinエージェントフレームワークKoogを使用してAIエージェントを構築する方法を示します。
*   [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): LangChain4jで構築されたシンプルなツール利用エージェントが含まれています。

### 思考の連鎖プロンプティング

多段階の推論を通じて言語モデルをガイドする構造化されたプロンプティング技術を実装します。
例：

*   [`LangChain4j_Overview.ipynb`](https://github.com/Kotlin/Kotlin-AI-Examples/blob/master/notebooks/langchain4j/LangChain4j_Overview.ipynb): 思考の連鎖と構造化された出力を示すKotlin Notebookです。

### バックエンドサービスにおけるLLM

KotlinとSpringを使用して、LLMをビジネスロジックまたはREST APIに統合します。
例：

*   [`spring-ai-examples`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/spring-ai-examples): 分類、チャット、要約の例が含まれています。
*   [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): LLMの応答とアプリケーションロジックの完全な統合を示しています。

### AIを活用したマルチプラットフォームUI

Compose Multiplatformを使用して、KotlinでインタラクティブなAI活用UIを構築します。
例：

*   [`mcp-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/mcp/mcp-demo): ClaudeおよびOpenAIに接続し、Compose Multiplatformを使用して応答を表示するデスクトップUIです。

## 例を探す

[Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples)リポジトリから例を探して実行できます。
各プロジェクトは自己完結型です。各プロジェクトをKotlinベースのAIアプリケーションを構築するための参照またはテンプレートとして使用できます。

## 次のステップ

*   IntelliJ IDEAでSpring AIとKotlinを使用する方法について詳しく学ぶには、[Spring AIを使用してQdrantに保存されたドキュメントに基づいて質問に回答するKotlinアプリを構築する](spring-ai-guide.md)チュートリアルを完了してください。
*   [Kotlinコミュニティ](https://kotlinlang.org/community/)に参加して、KotlinでAIアプリケーションを構築している他の開発者とつながりましょう。