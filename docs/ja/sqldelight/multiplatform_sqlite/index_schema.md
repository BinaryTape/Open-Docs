{% include 'multiplatform_sqlite/index_schema_sq.md' %}

これらのステートメントから、SQLDelightは、データベースの作成やその上でのステートメントの実行に使用できる、関連する `Schema` オブジェクトを持つ `Database` クラスを生成します。`Database` クラスは `generateSqlDelightInterface` Gradleタスクによって生成されます。このタスクは、`.sq` ファイルを編集した際に SQLDelight IDE プラグインによって自動的に実行されるほか、通常の Gradle ビルドの一部としても実行されます。