# 概要

Koogは、JVMおよびKotlin開発者向けに特別に設計された、イディオマティックで型安全なKotlin DSLを使用してAIエージェントを構築するためのオープンソースのJetBrainsフレームワークです。
ツールと対話し、複雑なワークフローを処理し、ユーザーとコミュニケーションをとるエージェントを作成できます。

モジュール化された機能システムを使用してエージェントの機能をカスタマイズしたり、Kotlin Multiplatformを使用してJVM、JS、WasmJS、Android、iOSの各ターゲットにエージェントをデプロイしたりすることが可能です。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**クイックスタート**](getting-started.md)

    ---

    はじめてのAIエージェントを構築して実行する

-   :material-book-open-variant:{ .lg .middle } [**用語集**](glossary.md)

    ---

    基本用語を学ぶ

</div>

## エージェントのタイプ

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基本エージェント**](basic-agents.md)

    ---

    単一の入力を処理して応答を提供するエージェントを作成・実行する

-   :material-script-text-outline:{ .lg .middle } [**関数型エージェント**](functional-agents.md)

    ---

    素のKotlin（plain Kotlin）でカスタムロジックを記述した軽量なエージェントを作成・実行する

-   :material-graph-outline:{ .lg .middle } [**複雑なワークフローエージェント**](complex-workflow-agents.md)

    ---

    カスタムストラテジーを使用して複雑なワークフローを処理するエージェントを作成・実行する

-   :material-state-machine:{ .lg .middle } [**プランナーエージェント**](planner-agents.md)

    ---

    計画を反復的に構築および実行するエージェントを作成・実行する

</div>

## コア機能

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**プロンプト**](prompts/index.md)

    ---

    プロンプトを作成し、LLMクライアントやプロンプトエグゼキューターを使用して実行します。LLMやプロバイダーの切り替え、組み込みのリトライ機能による失敗の処理が可能です。

-   :material-wrench:{ .lg .middle } [**ツール**](tools-overview.md)

    ---

    組み込み、アノテーションベース、またはクラスベースのツールを使用して、外部システムやAPIにアクセスできるようエージェントを強化します。

-   :material-share-variant-outline:{ .lg .middle } [**ストラテジー**](predefined-agent-strategies.md)

    ---

    直感的なグラフベースのワークフローを使用して、複雑なエージェントの動作を設計します。

-   :material-bell-outline:{ .lg .middle } [**イベント**](agent-events.md)

    ---

    エージェントのライフサイクル、ストラテジー、ノード、LLM呼び出し、ツール呼び出しのイベントを、事前定義されたハンドラーで監視・処理します。

</div>

## 高度な使用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**履歴の圧縮**](history-compression.md)

    ---

    高度な手法を使用して、長時間の会話におけるコンテキストを維持しながらトークンの使用量を最適化します。

-   :material-state-machine:{ .lg .middle } [**エージェントの永続化**](agent-persistence.md)

    ---

    実行中の特定のポイントでエージェントの状態を復元します。
        

-   :material-code-braces:{ .lg .middle } [**構造化出力**](structured-output.md)

    ---

    構造化された形式で応答を生成します。

-   :material-waves:{ .lg .middle } [**ストリーミングAPI**](streaming-api.md)

    ---

    ストリーミングサポートと並列ツール呼び出しにより、リアルタイムで応答を処理します。

-   :material-database-search:{ .lg .middle } [**知識の検索**](embeddings.md)

    ---

    [ベクトル埋め込み](embeddings.md)、[ランク付けされたドキュメントストレージ](ranked-document-storage.md)、[共有エージェントメモリ](agent-memory.md)を使用して、会話をまたいで知識を保持および取得します。

-   :material-timeline-text:{ .lg .middle } [**トレース**](tracing.md)

    ---

    詳細で設定可能なトレース機能を使用して、エージェントの実行をデバッグおよび監視します。

</div>

## 統合

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**Model Context Protocol (MCP)**](model-context-protocol.md)

    ---

    AIエージェントでMCPツールを直接使用します。

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    SpringアプリケーションにKoogを追加します。

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    KoogをKtorサーバーと統合します。

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](opentelemetry-support.md)

    ---

    一般的なオブザーバビリティツールを使用して、エージェントのトレース、ログ記録、計測を行います。

-   :material-lan:{ .lg .middle } [**A2Aプロトコル**](a2a-protocol-overview.md)

    ---

    共通のプロトコルを介してエージェントとサービスを接続します。

</div>