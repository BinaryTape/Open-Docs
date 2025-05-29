{% include 'common/index_schema_sq.md' %}

これらのステートメントに基づいて、SQLDelight は、データベースの作成やステートメントの実行に使用できる、関連する `Schema` オブジェクトを持つ `Database` クラスを生成します。`Database` クラスは `generateSqlDelightInterface` Gradle タスクによって生成されます。このタスクは、`.sq` ファイルを編集する際に SQLDelight IDE プラグインによって自動的に実行されるほか、通常の Gradle ビルドの一部としても実行されます。