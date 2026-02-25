{% include 'common/index_schema_sq.md' %}

これらのステートメントから、SQLDelightはデータベースの作成やステートメントの実行に使用できる、`Schema`オブジェクトが関連付けられた`Database`クラスを生成します。`Database`クラスは`generateSqlDelightInterface` Gradleタスクによって生成されます。このタスクは、`.sq`ファイルを編集した際にSQLDelight IDEプラグインによって自動的に実行されるほか、通常のGradleビルドの一部としても実行されます。