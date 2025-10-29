# A2Aプロトコル

このページでは、Koog エージェントフレームワークにおける A2A (Agent-to-Agent) プロトコルの実装の概要を説明します。

## A2Aプロトコルとは何ですか？

A2A (Agent-to-Agent) プロトコルは、AIエージェントが相互に、またクライアントアプリケーションと対話することを可能にする、標準化された通信プロトコルです。
これは、一貫性のある相互運用可能なエージェント通信を可能にする、一連のメソッド、メッセージ形式、および動作を定義します。
A2Aプロトコルの詳細情報と詳細な仕様については、公式の [A2Aプロトコルウェブサイト](https://a2a-protocol.org/latest/) を参照してください。

## 利用開始

**重要**: A2Aの依存関係は、デフォルトでは `koog-agents` メタ依存関係に含まれていません。必要なA2Aモジュールをプロジェクトに明示的に追加する必要があります。

プロジェクトでA2Aを使用するには、ユースケースに基づいて依存関係を追加してください:

- **A2Aクライアントの場合**: [A2A Client documentation](a2a-client.md#dependencies) を参照してください。
- **A2Aサーバーの場合**: [A2A Server documentation](a2a-server.md#dependencies) を参照してください。
- **Koog統合の場合**: [A2A Koog Integration documentation](a2a-koog-integration.md#dependencies) を参照してください。

## 主要なA2Aコンポーネント

Koogは、A2Aプロトコルv0.3.0のクライアントとサーバーの両方に対する完全な実装に加え、Koogエージェントフレームワークとの統合も提供します。

- [A2Aサーバー](a2a-server.md) は、A2Aプロトコルを実装するエンドポイントを公開するエージェントまたはエージェントシステムです。クライアントからのリクエストを受け取り、タスクを処理し、結果またはステータス更新を返します。Koogエージェントとは独立して使用することもできます。
- [A2Aクライアント](a2a-client.md) は、A2Aプロトコルを使用してA2Aサーバーとの通信を開始するクライアントアプリケーションまたはエージェントです。Koogエージェントとは独立して使用することもできます。
- [A2A Koog統合](a2a-koog-integration.md) は、KoogエージェントとのA2Aの統合を簡素化する一連のクラスとユーティリティです。Koogフレームワーク内でのシームレスなA2Aエージェント接続と通信を可能にするコンポーネント (A2Aの機能とノード) を含んでいます。

その他の例については、[例](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a) を参照してください。