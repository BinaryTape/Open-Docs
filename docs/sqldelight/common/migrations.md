# 迁移

一个 `.sq` 文件总是描述如何在空数据库中创建最新的 schema。如果你的数据库当前处于较早版本，迁移文件会将这些数据库更新到最新。迁移文件与 `.sq` 文件存储在相同的 `sqldelight` 文件夹中：

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

如果驱动支持，迁移将在事务中运行。你不应在 `BEGIN/END TRANSACTION` 中封装你的迁移，因为这可能导致某些驱动崩溃。

## 版本控制

schema 的第一个版本是 1。迁移文件以 `<version to upgrade from>.sqm` 命名。要迁移到版本 2，请将迁移语句放入 `1.sqm` 中：

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

这些 SQL 语句由 `Database.Schema.migrate()` 方法运行。迁移文件与你的 `.sq` 文件位于相同的源集。

## 验证迁移

一个 `verifySqlDelightMigration` 任务将被添加到 Gradle 项目中，它将作为 `check` 任务的一部分运行。对于你的 SqlDelight 源集（例如 `src/main/sqldelight`）中任何名为 `<version number>.db` 的 `.db` 文件，它将应用从 `<version number>.sqm` 开始的所有迁移，并确认这些迁移会生成一个包含最新 schema 的数据库。

要从最新 schema 生成一个 `.db` 文件，请运行 `generate<source set name><database name>Schema` 任务，该任务在你指定 `schemaOutputDirectory` 后即可使用，如 [gradle.md](gradle.md) 中所述。你可能应该在创建第一个迁移之前执行此操作。例如，如果你的项目使用 `main` 源集并带有自定义名称 `"MyDatabase"`，你将需要运行 `generateMainMyDatabaseSchema` 任务。

大多数用例将受益于只拥有一个 `1.db` 文件，代表其数据库初始版本的 schema。允许多个 `.db` 文件，但这会导致每个 `.db` 文件都应用其各自的迁移，从而导致大量不必要的工作。

## 代码迁移

如果你从代码中运行迁移并希望执行数据迁移，可以使用 `Database.Schema.migrate` API：

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

在以下示例中，如果你有 1.sqm、2.sqm、3.sqm、4.sqm 和 5.sqm 作为迁移，当数据库版本为 4 时，上述回调将在 3.sqm 完成后发生。回调完成后，它将从 4.sqm 继续并完成剩余的迁移，在本例中是 4.sqm 和 5.sqm，这意味着最终数据库版本为 6。