# 遷移

`.sq` 檔案始終描述如何在一個空白資料庫中建立最新的結構描述 (schema)。如果你的資料庫目前處於較早版本，遷移檔案 (migration files) 會將這些資料庫更新至最新狀態。遷移檔案儲存在與你的 `.sq` 檔案相同的 `sqldelight` 資料夾中：

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

如果驅動程式 (driver) 支援，遷移作業會在交易 (transaction) 中執行。你不應將你的遷移作業用 `BEGIN/END TRANSACTION` 包裹，因為這可能會導致某些驅動程式崩潰。

## 版本控制

結構描述的第一個版本是 1。遷移檔案命名為 `<version to upgrade from>.sqm`。要遷移到版本 2，請將遷移陳述式放在 `1.sqm` 中：

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

這些 SQL 陳述式由 `Database.Schema.migrate()` 方法執行。遷移檔案與你的 `.sq` 檔案位於相同的原始碼集 (source set) 中。

## 驗證遷移

一個 `verifySqlDelightMigration` 任務 (task) 將會新增至 Gradle 專案，並且它將作為 `check` 任務的一部分執行。對於你的 SqlDelight 原始碼集（例如 `src/main/sqldelight`）中任何名為 `<version number>.db` 的 `.db` 檔案，它將從 `<version number>.sqm` 開始套用所有遷移，並確認這些遷移會產生一個具有最新結構描述的資料庫。

要從你的最新結構描述產生一個 `.db` 檔案，請執行 `generate<source set name><database name>Schema` 任務，該任務在你指定 `schemaOutputDirectory` 後即可使用，如 [gradle.md](gradle.md) 中所述。你可能應該在建立第一個遷移之前執行此操作。例如，如果你的專案使用 `main` 原始碼集，並且自訂名稱為 `"MyDatabase"`，你將需要執行 `generateMainMyDatabaseSchema` 任務。

大多數使用案例會受益於只擁有一個代表其資料庫初始版本結構描述的 `1.db` 檔案。允許有多個 `.db` 檔案，但這會導致每個 `.db` 檔案都被套用所有其遷移，從而導致許多不必要的工作。

## 程式碼遷移

如果你從程式碼執行遷移，並且想要執行資料遷移 (data migrations)，你可以使用 `Database.Schema.migrate` API：

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

在以下範例中，如果你有 1.sqm、2.sqm、3.sqm、4.sqm 和 5.sqm 作為遷移，上述回呼 (callback) 將在 3.sqm 完成後發生，此時資料庫版本為 4。回呼後，它將從 4.sqm 繼續，並完成剩餘的遷移，在此情況下是 4.sqm 和 5.sqm，這意味著最終資料庫版本為 6。