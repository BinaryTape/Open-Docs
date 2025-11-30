{% include 'multiplatform_sqlite/index_schema_sq.md' %}

SQLDelight 会根据这些语句生成一个 `Database` 类，该类带有一个关联的 `Schema` 对象，可用于创建你的数据库并对其执行语句。`Database` 类由 `generateSqlDelightInterface` Gradle 任务生成，该任务会在你编辑 `.sq` 文件时由 SQLDelight IDE plugin 自动运行，也会作为正常的 Gradle 构建的一部分运行。