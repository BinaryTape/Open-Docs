# 概要

Koogは、JVMエコシステム向けに特別に設計された、AIエージェント構築のためのオープンソースのJetBrainsフレームワークです。
イディオマティックで型安全なKotlin DSLと、流れるようなビルダー形式のJava APIを備え、KotlinとJavaの両方の開発者にファーストクラスの開発体験を提供します。

Java開発者はイディオマティックなAPIを使用してJVM上でKoogの全機能を活用でき、Kotlin開発者はKotlin Multiplatformを使用してJS、WasmJS、Android、iOSの各ターゲットにエージェントをデプロイすることも可能です。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**クイックスタート**](quickstart.md)

    ---

    はじめてのAIエージェントを構築して実行する

-   :material-book-open-variant:{ .lg .middle } [**用語集**](glossary.md)

    ---

    基本用語を学ぶ

-   :material-shield-check-outline:{ .lg .middle } [**モジュールのバージョニング**](module-versioning.md)

    ---

    安定版とベータ版のモジュール、およびAPIの保証について理解する

</div>

## エージェント

[エージェントの概要](agents/index.md)と、Koogを使用してさまざまなタイプのエージェントを作成する方法について説明します。

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基本エージェント**](agents/basic-agents.md)

    ---

    ほとんどの一般的なユースケースに適した、事前定義されたストラテジーを使用する

-   :material-function:{ .lg .middle } [**関数型エージェント**](agents/functional-agents.md)

    ---

    素のKotlin（plain Kotlin）やJavaのラムダ関数としてカスタムロジックを定義する

-   :material-state-machine:{ .lg .middle } [**グラフベースのエージェント**](agents/graph-based-agents.md)

    ---

    ストラテジーグラフとしてカスタムワークフローを実装する

-   :material-list-status:{ .lg .middle } [**プランナーエージェント**](agents/planner-agents/index.md) <span class="beta-badge" title="ベータ — APIは変更される可能性があります">beta</span>

    ---

    状態が目的の条件に一致するまで、計画を反復的に構築および実行する

</div>

## コアコンポーネント

Koogエージェントのコアコンポーネントについて詳しく説明します。

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**プロンプト**](prompts/index.md)

    ---

    エージェントとLLMの対話を駆動するプロンプトを作成、管理、実行する

-   :material-strategy:{ .lg .middle } [**ストラテジー**](predefined-agent-strategies.md)

    ---

    エージェントの意図したワークフローを有向グラフとして設計する

-   :material-tools:{ .lg .middle } [**ツール**](tools/index.md)

    ---

    エージェントが外部のデータソースやサービスと対話できるようにする

-   :material-toy-brick-outline:{ .lg .middle } [**機能**](features/index.md)

    ---

    AIエージェントの機能を拡張および強化する

</div>

## 高度な使用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**履歴の圧縮**](history-compression.md)

    ---

    高度な手法を使用して、長時間の会話におけるコンテキストを維持しながらトークンの使用量を最適化する

-   :material-floppy:{ .lg .middle } [**エージェントの永続化**](features/agent-persistence.md)

    ---

    実行中の特定のポイントでエージェントの状態を復元する
        

-   :material-code-braces:{ .lg .middle } [**構造化出力**](structured-output.md)

    ---

    構造化された形式で応答を生成する

-   :material-waves:{ .lg .middle } [**ストリーミングAPI**](streaming-api.md)

    ---

    ストリーミングサポートと並列ツール呼び出しにより、リアルタイムで応答を処理する

-   :material-database-search:{ .lg .middle } [**知識の検索**](embeddings.md) <span class="beta-badge" title="ベータ — APIは変更される可能性があります">beta</span>

    ---

    [ベクトル埋め込み](embeddings.md)や[RAG](retrieval-augmented-generation.md)を使用して、会話をまたいで知識を保持および取得する

-   :material-timeline-text:{ .lg .middle } [**トレース**](features/tracing.md)

    ---

    詳細で設定可能なトレース機能を使用して、エージェントの実行をデバッグおよび監視する

-   :material-timeline-text:{ .lg .middle } [**長期メモリ**](features/long-term-memory.md) <span class="beta-badge" title="ベータ — APIは変更される可能性があります">beta</span>

    ---

    RAGや永続メモリのために、ベクトルデータベースやメモリプロバイダーを統合する。

</div>

## 統合

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**Model Context Protocol (MCP)**](model-context-protocol.md) <span class="beta-badge" title="ベータ — APIは変更される可能性があります">beta</span>

    ---

    AIエージェントでMCPツールを直接使用する

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md) <span class="beta-badge" title="ベータ — APIは変更される可能性があります">beta</span>

    ---

    SpringアプリケーションにKoogを追加する

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md) <span class="beta-badge" title="ベータ — APIは変更される可能性があります">beta</span>

    ---

    KoogをKtorサーバーと統合する

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](features/open-telemetry/index.md)

    ---

    一般的なオブザーバビリティツールを使用して、エージェントのトレース、ログ記録、計測を行う

-   :material-lan:{ .lg .middle } [**A2Aプロトコル**](a2a/index.md) <span class="beta-badge" title="ベータ — APIは変更される可能性があります">beta</span>

    ---

    共通のプロトコルを介してエージェントとサービスを接続する

</div>