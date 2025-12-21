# 概要

Koogは、JVMおよびKotlin開発者向けに特別に設計された、イディオムに沿った型安全なKotlin DSLを使用してAIエージェントを構築するための、JetBrains製のオープンソースフレームワークです。
これにより、ツールと対話し、複雑なワークフローを処理し、ユーザーと通信できるエージェントを作成できます。

モジュラー機能システムを使用してエージェントの機能をカスタマイズし、Kotlin Multiplatformを使用してJVM、JS、WasmJS、Android、およびiOSターゲットにわたってエージェントをデプロイできます。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**はじめに**](getting-started.md)

    ---

    最初のAIエージェントを構築して実行します

-   :material-book-open-variant:{ .lg .middle } [**用語集**](glossary.md)

    ---

    必須の用語を学びます

</div>

## エージェントの種類

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基本的なエージェント**](basic-agents.md)

    ---

    単一の入力を処理し、応答を提供するエージェントを作成して実行します

-   :material-script-text-outline:{ .lg .middle } [**ファンクショナルエージェント**](functional-agents.md)

    ---

    プレーンなKotlinでカスタムロジックを持つ軽量エージェントを作成して実行します

-   :material-graph-outline:{ .lg .middle } [**複雑なワークフローエージェント**](complex-workflow-agents.md)

    ---

    カスタム戦略で複雑なワークフローを処理するエージェントを作成して実行します

-   :material-state-machine:{ .lg .middle } [**プランナーエージェント**](planner-agents.md)

    ---

    計画を反復的に構築し実行するエージェントを作成して実行します

</div>

## コア機能

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**プロンプト**](prompts/index.md)

    ---

    プロンプトを作成し、LLMクライアントまたはプロンプト実行者を使用して実行し、
    LLMとプロバイダーを切り替え、組み込みのリトライ機能で失敗を処理します

-   :material-wrench:{ .lg .middle } [**ツール**](tools-overview.md)

    ---

    外部システムやAPIにアクセスできる、組み込み、アノテーションベース、またはクラスベースのツールでエージェントを強化します

-   :material-share-variant-outline:{ .lg .middle } [**戦略**](predefined-agent-strategies.md)

    ---

    直感的なグラフベースのワークフローを使用して、複雑なエージェントの動作を設計します

-   :material-bell-outline:{ .lg .middle } [**イベント**](agent-events.md)

    ---

    定義済みのハンドラーを使用して、エージェントのライフサイクル、戦略、ノード、LLM呼び出し、ツール呼び出しイベントを監視および処理します

</div>

## 高度な使用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**履歴圧縮**](history-compression.md)

    ---

    高度な技術を使用して、長時間の会話でコンテキストを維持しながらトークン使用量を最適化します

-   :material-state-machine:{ .lg .middle } [**エージェントの永続化**](agent-persistence.md)

    ---

    実行中の特定の時点でエージェントの状態を復元します

-   :material-code-braces:{ .lg .middle } [**構造化出力**](structured-output.md)

    ---

    構造化された形式で応答を生成します

-   :material-waves:{ .lg .middle } [**ストリーミングAPI**](streaming-api.md)

    ---

    ストリーミングサポートと並行ツール呼び出しにより、リアルタイムで応答を処理します

-   :material-database-search:{ .lg .middle } [**知識検索**](embeddings.md)

    ---

    [ベクトル埋め込み](embeddings.md)、[ランク付けされたドキュメントストレージ](ranked-document-storage.md)、および[共有エージェントメモリ](agent-memory.md)を使用して、会話全体で知識を保持および検索します

-   :material-timeline-text:{ .lg .middle } [**トレース**](tracing.md)

    ---

    詳細で構成可能なトレースを使用して、エージェントの実行をデバッグおよび監視します

</div>

## 統合

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**Model Context Protocol (MCP)**](model-context-protocol.md)

    ---

    AIエージェントでMCPツールを直接使用します

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    KoogをSpringアプリケーションに追加します

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    KoogをKtorサーバーと統合します

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](opentelemetry-support.md)

    ---

    人気の可観測性ツールでエージェントをトレース、ログ記録、測定します

-   :material-lan:{ .lg .middle } [**A2A Protocol**](a2a-protocol-overview.md)

    ---

    共有プロトコルを介してエージェントとサービスを接続します

</div>