{% include 'multiplatform_sqlite/index_schema_sq.md' %}

これらのステートメントから、SQLDelightは、データベースを作成し、その上でステートメントを実行するために使用できる、関連する`Schema`オブジェクトを持つ`Database`クラスを生成します。この`Database`クラスは、`.sq`ファイルを編集する際にSQLDelight IDEプラグインによって自動的に実行される、および通常のGradleビルドの一部としても実行される`generateSqlDelightInterface` Gradleタスクによって生成されます。