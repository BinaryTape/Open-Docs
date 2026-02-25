{% include 'common/index_schema_sq.md' %}

根据这些语句，SQLDelight 将生成一个 `Database` 类及关联的 `Schema` 对象，可用于创建数据库并对其执行语句。`Database` 类是由 `generateSqlDelightInterface` Gradle 任务生成的，当您编辑 `.sq` 文件时，SQLDelight IDE 插件会自动运行该任务，同时它也是普通 Gradle 构建的一部分。