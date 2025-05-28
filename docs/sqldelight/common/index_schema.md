{% include 'common/index_schema_sq.md' %}

从这些语句中，SQLDelight 会生成一个 `Database` 类及其关联的 `Schema` 对象，可用于创建数据库并在其上执行语句。`Database` 类由 `generateSqlDelightInterface` Gradle 任务生成，该任务在您编辑 `.sq` 文件时由 SQLDelight IDE 插件自动运行，并且也是正常 Gradle 构建的一部分。