# 機能

エージェント機能は、AIエージェントの機能を拡張および強化するための手段を提供します。
機能を使用することで、以下のことが可能になります。

- エージェントへの新しいケーパビリティの追加
- エージェントの動作のインターセプトと変更
- エージェントの実行のログ記録と監視
- 単一の機能内での、同一イベントタイプに対する複数のハンドラーの登録

Koogフレームワークでは、以下の機能が標準で利用可能です。

<div class="grid cards" markdown>

-   :material-flash:{ .lg .middle } [イベントハンドリング](agent-event-handlers.md)

    ---

    エージェントの実行中に特定のイベントを監視し、応答します

-   :material-routes:{ .lg .middle } [トレース](tracing.md)

    ---

    エージェントの実行に関する詳細な情報を取得します

-   :material-message-text-clock:{ .lg .middle } [チャットメモリ](chat-memory/index.md)

    ---

    エージェントの実行間でチャットメッセージの履歴を保存および取得します

-   :material-database-clock:{ .lg .middle } [長期メモリ](long-term-memory.md)

    ---

    AIエージェントに永続的なメモリを追加します

-   :material-content-save-cog:{ .lg .middle } [エージェントの永続化](agent-persistence.md)

    ---

    実行中の特定のポイントでエージェントの状態を保存および復元します

-   :simple-opentelemetry:{ .lg .middle } [OpenTelemetry](open-telemetry/index.md)

    ---

    エージェントからテレメトリデータ（トレース）を生成、収集、エクスポートします

</div>

独自の機能を実装する方法については、[カスタム機能](custom-features.md)を参照してください。