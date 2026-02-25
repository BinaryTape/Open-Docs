# 迁移

`.sq` 文件始终描述如何在空数据库中创建最新的架构。如果您的数据库当前处于较早版本，迁移文件会将这些数据库更新到最新状态。迁移文件存储在与 `.sq` 文件相同的 `sqldelight` 文件夹中：

```
src
└─ main
   └─ sqdelight
      ├─ com/example/hockey
      |  ├─ Team.sq
      |  └─ Player.sq
      └─ migrations
         ├─ 1.sqm
         └─ 2.sqm
```

如果驱动程序支持，迁移将在事务中运行。您不应在迁移中使用 `BEGIN/END TRANSACTION`，因为这可能会导致某些驱动程序崩溃。

## 版本管理

架构的第一个版本是 1。迁移文件的命名方式为 `<version to upgrade from>.sqm`。要迁移到版本 2，请将迁移语句放入 `1.sqm` 中：

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

这些 SQL 语句由 `Database.Schema.migrate()` 方法运行。迁移文件位于与 `.sq` 文件相同的源集中。

## 验证迁移

`verifySqlDelightMigration` 任务将添加到 Gradle 项目中，并作为 `check` 任务的一部分运行。对于 SQLDelight 源集（例如 `src/main/sqldelight`）中名为 `<version number>.db` 的任何 `.db` 文件，它将应用从 `<version number>.sqm` 开始的所有迁移，并确认迁移产生的数据库具有最新的架构。

要从最新架构生成 `.db` 文件，请运行 `generate<source set name><database name>Schema` 任务，该任务在您指定 `schemaOutputDirectory` 后可用，详见 [gradle.md](gradle.md)。您可能应该在创建第一个迁移之前执行此操作。例如，如果您的项目使用名为 "MyDatabase" 的自定义名称以及 `main` 源集，则需要运行 `generateMainMyDatabaseSchema` 任务。

大多数用例只需一个代表数据库初始版本架构的 `1.db` 文件即可。允许拥有多个 `.db` 文件，但这将导致每个 `.db` 文件都要应用其各自的迁移，从而导致大量不必要的工作。

## 代码迁移

如果您从代码运行迁移并希望执行数据迁移，可以使用 `Database.Schema.migrate` API：

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

在以下示例中，如果您有 1.sqm、2.sqm、3.sqm、4.sqm 和 5.sqm 作为迁移，则上述回调将在 3.sqm 完成后、数据库处于版本 4 时发生。回调结束后，它将从 4.sqm 恢复并完成剩余的迁移（在本例中为 4.sqm 和 5.sqm），这意味着最终的数据库版本为 6。