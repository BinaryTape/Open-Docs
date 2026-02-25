# 遷移

`.sq` 檔案一律描述如何在空資料庫中建立最新的架構。如果您的資料庫目前處於較早的版本，遷移檔案會將這些資料庫更新至最新狀態。遷移檔案與您的 `.sq` 檔案儲存在相同的 `sqldelight` 資料夾中：

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

如果驅動程式支援，遷移會在交易中執行。您不應將遷移放在 `BEGIN/END TRANSACTION` 之中，因為這可能會導致某些驅動程式當機。

## 版本管理

架構的第一個版本是 1。遷移檔案的命名方式為 `<要從其升級的版本>.sqm`。要遷移到版本 2，請將遷移陳述式放在 `1.sqm` 中：

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

這些 SQL 陳述式由 `Database.Schema.migrate()` 方法執行。遷移檔案與您的 `.sq` 檔案位於相同的原始碼集中。

## 驗證遷移

一個 `verifySqlDelightMigration` 任務將被加入到 Gradle 專案中，並作為 `check` 任務的一部分執行。對於您的 SqlDelight 原始碼集（例如 `src/main/sqldelight`）中任何名為 `<版本號碼>.db` 的檔案，它將套用從 `<版本號碼>.sqm` 開始的所有遷移，並確認遷移產生的資料庫具有最新的架構。

若要從最新架構產生 `.db` 檔案，請執行 `generate<原始碼集名稱><資料庫名稱>Schema` 任務，該任務在您指定 `schemaOutputDirectory` 後即可使用，如 [gradle.md](gradle.md) 中所述。您應該在建立第一個遷移之前執行此操作。例如，如果您的專案使用 `main` 原始碼集且自訂名稱為 `"MyDatabase"`，則需要執行 `generateMainMyDatabaseSchema` 任務。

大多數使用案例僅需保留一個代表資料庫初始版本架構的 `1.db` 檔案即可獲益。雖然允許擁有多個 `.db` 檔案，但這會導致每個 `.db` 檔案都需要套用其各自的遷移，從而造成許多不必要的工作。

## 程式碼遷移

如果您從程式碼執行遷移並希望執行資料遷移，可以使用 `Database.Schema.migrate` API：

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

在以下範例中，如果您有 1.sqm、2.sqm、3.sqm、4.sqm 和 5.sqm 作為遷移，上述回呼將在 3.sqm 完成且資料庫處於版本 4 時發生。回呼之後，它將從 4.sqm 繼續並完成剩餘的遷移（在此情況下為 4.sqm 和 5.sqm），這意味著最終的資料庫版本為 6。