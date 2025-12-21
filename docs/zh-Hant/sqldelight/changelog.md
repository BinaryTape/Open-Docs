# 變更日誌

## 未發布

### 新增
- [Gradle 外掛程式] 修正當起始 Schema 版本不是 1 且 verifyMigrations 為 true 時建構失敗的問題 (#6017 by @neilgmiller)
- [Gradle 外掛程式] 使 `SqlDelightWorkerTask` 更具可配置性，並更新預設配置以支援在 Windows 上開發 (#5215 by @MSDarwish2000)
- [SQLite 變體] 新增對 FTS5 虛擬表格中合成欄位的支援 (#5986 by @watbe)

### 變更
- [編譯器] 允許套件名稱中使用底線。之前底線被淨化，導致了非預期的行為 (#6027 by @BierDav)
- [分頁擴充功能] 切換到 AndroidX Paging (#5910 by @jeffdgr8)

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 新增
- [PostgreSQL 變體] 修正 Postgres 數值/整數/大整數型別映射 (#5994 by @griffio)
- [編譯器] 改善編譯器錯誤訊息，在需要 CAST 時包含源檔案位置 (#5979 by @griffio)
- [PostgreSQL 變體] 新增對 Postgres JSON 運算子路徑提取的支援 (#5971 by @griffio)
- [SQLite 變體] 新增 Sqlite 3.35 支援，利用共同表格表達式 (Common Table Expressions) 的 MATERIALIZED 查詢規劃器提示 (#5961 by @griffio)
- [PostgreSQL 變體] 新增對利用共同表格表達式 (Common Table Expressions) 的 MATERIALIZED 查詢規劃器提示的支援 (#5961 by @griffio)
- [PostgreSQL 變體] 新增對 Postgres JSON Aggregate FILTER 的支援 (#5957 by @griffio)
- [PostgreSQL 變體] 新增對 Postgres Enum 的支援 (#5935 by @griffio)
- [PostgreSQL 變體] 新增對 Postgres Triggers 的有限支援 (#5932 by @griffio)
- [PostgreSQL 變體] 新增判斷式以檢查 SQL 表達式是否可解析為 JSON (#5843 by @griffio)
- [PostgreSQL 變體] 新增對 PostgreSql Comment On 陳述式的有限支援 (#5808 by @griffio)
- [MySQL 變體] 新增對索引可見性選項的支援 (#5785 by @orenkislev-faire)
- [PostgreSql 變體] 新增對 TSQUERY 資料型別的支援 (#5779 by @griffio)
- [Gradle 外掛程式] 新增支援版本目錄以新增模組 (#5755 by @DRSchlaubi)

### 變更
- 開發中快照版本現已發布到 https://central.sonatype.com/repository/maven-snapshots/ 的 Central Portal Snapshots 儲存庫。
- [編譯器] 使用建構函式參照簡化預設生成的查詢 (#5814 by @jonapoul)

### 修正
- [編譯器] 修正使用包含共同表格表達式 (Common Table Expression) 的 View 時的堆疊溢位 (#5928 by @griffio)
- [Gradle 外掛程式] 修正開啟 SqlDelight 工具視窗以新增「New Connection」時的崩潰問題 (#5906 by @griffio)
- [IntelliJ 外掛程式] 避免在複製到 SQLite 側邊欄動作中發生執行緒相關的崩潰 (#5901 by @griffio)
- [IntelliJ 外掛程式] 修正使用 Schema 陳述式 CREATE INDEX 和 CREATE VIEW 時的 PostgreSql 變體問題 (#5772 by @griffio)
- [編譯器] 修正 FTS 堆疊溢位參照欄位時 (#5896 by @griffio)
- [編譯器] 修正 With Recursive 堆疊溢位 (#5892 by @griffio)
- [編譯器] 修正 Insert|Update|Delete Returning 陳述式的通知問題 (#5851 by @griffio)
- [編譯器] 修正返回 Long 的交易區塊的非同步結果型別 (#5836 by @griffio)
- [編譯器] 將 SQL 參數綁定從 O(n²) 複雜度優化至 O(n) 複雜度 (#5898 by @chenf7)
- [SQLite 變體] 修正 Sqlite 3.18 缺少函式 (#5759 by @griffio)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

發布失敗，部分構件已發布。請使用 2.2.1！

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 新增
- [WASM Driver] 新增對 web worker driver 的 wasmJs 支援 (#5534 by @IlyaGulya)
- [PostgreSQL 變體] 支援 PostgreSql 將陣列解除巢狀為列 (#5673 by @griffio)
- [PostgreSQL 變體] PostgreSql TSRANGE/TSTZRANGE 支援 (#5297 by @griffio)
- [PostgreSQL 變體] PostgreSql Right Full Join (#5086 by @griffio)
- [PostgreSQL 變體] Postrgesql 從時間型別中提取 (#5273 by @griffio)
- [PostgreSQL 變體] PostgreSql 陣列包含運算子 (#4933 by @griffio)
- [PostgreSQL 變體] PostgreSql drop constraint (#5288 by @griffio)
- [PostgreSQL 變體] Postgresql type casting (#5089 by @griffio)
- [PostgreSQL 變體] PostgreSql 子查詢的 Lateral Join 運算子 (#5122 by @griffio)
- [PostgreSQL 變體] Postgresql ILIKE 運算子 (#5330 by @griffio)
- [PostgreSQL 變體] PostgreSql XML 型別 (#5331 by @griffio)
- [PostgreSQL 變體] PostgreSql AT TIME ZONE (#5243 by @griffio)
- [PostgreSQL 變體] 支援 postgresql order by nulls (#5199 by @griffio)
- [PostgreSQL 變體] 新增 PostgreSQL 當前日期/時間函式支援 (#5226 by @drewd)
- [PostgreSQL 變體] PostgreSql Regex 運算子 (#5137 by @griffio)
- [PostgreSQL 變體] 新增 brin gist (#5059 by @griffio)
- [MySQL 變體] 支援 RENAME INDEX for MySql dialect (#5212 by @orenkislev-faire)
- [JSON 擴充功能] 為 JSON table function 新增別名 (#5372 by @griffio)

### 變更
- [編譯器] 生成的查詢檔案為簡單的 Mutator 返回行數 (#4578 by @MariusVolkhart)
- [原生驅動程式] 更新 NativeSqlDatabase.kt 以變更 DELETE、INSERT 和 UPDATE 陳述式的唯讀標誌 (#5680 by @griffio)
- [PostgreSQL 變體] 將 PgInterval 變更為 String (#5403 by @griffio)
- [PostgreSQL 變體] 支援 SqlDelight 模組以實作 PostgreSql 擴充功能 (#5677 by @griffio)

### 修正
- [編譯器] 修正：執行帶有結果的 group statements 時通知查詢 (#5006 by @vitorhugods)
- [編譯器] 修正 SqlDelightModule type resolver (#5625 by @griffio)
- [編譯器] 修正 5501 insert object escaped column (#5503 by @griffio)
- [編譯器] 編譯器：改善錯誤訊息，使 path links 可點擊並顯示正確的行號和字元位置。 (#5604 by @vanniktech)
- [編譯器] 修正問題 5298：允許關鍵字作為表格名稱
- [編譯器] 修正具名執行並新增測試
- [編譯器] 在排序初始化陳述式時考慮 foreign key table constraints (#5325 by @TheMrMilchmann)
- [編譯器] 當涉及 Tab 時正確對齊錯誤下劃線 (#5224 by @drewd)
- [JDBC 驅動程式] 修正 connectionManager 在交易結束時的記憶體洩漏
- [JDBC 驅動程式] 按照文件中所述在交易中執行 SQLite 遷移 (#5218 by @morki)
- [JDBC 驅動程式] 修正 leaking connections after transaction commit / rollback (#5205 by @morki)
- [Gradle 外掛程式] 執行 `DriverInitializer` before `GenerateSchemaTask` (#5562 by @nwagu)
- [執行期] 修正 LogSqliteDriver 在 real driver 為 Async 時的崩潰問題 (#5723 by @edenman)
- [執行期] 修正 StringBuilder capacity (#5192 by @janbina)
- [PostgreSQL 變體] PostgreSql create or replace view (#5407 by @griffio)
- [PostgreSQL 變體] Postgresql to_json (#5606 by @griffio)
- [PostgreSQL 變體] PostgreSql numeric resolver (#5399 by @griffio)
- [PostgreSQL 變體] sqlite windows function (#2799 by @griffio)
- [PostgreSQL 變體] PostgreSql SELECT DISTINCT ON (#5345 by @griffio)
- [PostgreSQL 變體] alter table add column if not exists (#5309 by @griffio)
- [PostgreSQL 變體] Postgresql async bind parameter (#5313 by @griffio)
- [PostgreSQL 變體] PostgreSql boolean literals (#5262 by @griffio)
- [PostgreSQL 變體] PostgreSql window functions (#5155 by @griffio)
- [PostgreSQL 變體] PostgreSql isNull isNotNull types (#5173 by @griffio)
- [PostgreSQL 變體] PostgreSql select distinct (#5172 by @griffio)
- [分頁擴充功能] paging refresh initial load fix (#5615 by @evant)
- [分頁擴充功能] 新增 MacOS native targets (#5324 by @vitorhugods)
- [IntelliJ 外掛程式] K2 Support

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 新增
- [PostgreSQL 變體] 新增 PostgreSQL STRING_AGG 函式 (#4950 by @anddani)
- [PostgreSQL 變體] 新增 SET 陳述式到 pg dialect (#4927 by @de-luca)
- [PostgreSQL 變體] 新增 PostgreSql alter column sequence parameters (#4916 by @griffio)
- [PostgreSQL 變體] 新增 postgresql alter column default support for insert statement (#4912 by @griffio)
- [PostgreSQL 變體] 新增 PostgreSql alter sequence and drop sequence (#4920 by @griffio)
- [PostgreSQL 變體] 新增 Postgres Regex function definitions (#5025 by @MariusVolkhart)
- [PostgreSQL 變體] 新增 GIN 的語法 (#5027 by @griffio)

### 變更
- [IDE 外掛程式] 最低版本為 2023.1 / Android Studio Iguana
- [編譯器] 允許覆寫 encapsulatingType 中的 type nullability (#4882 by @eygraber)
- [編譯器] Inline the column names for SELECT *
- [Gradle 外掛程式] 切換到 processIsolation (#5068 by @nwagu)
- [Android 執行期] 將 Android minSDK 提高到 21 (#5094 by @hfhbd)
- [驅動程式] 為 dialect authors 公開更多 JDBC/R2DBC statement methods (#5098 by @hfhbd)

### 修正
- [PostgreSQL 變體] 修正 postgresql alter table alter column (#4868 by @griffio)
- [PostgreSQL 變體] 修正 4448 missing import for table model (#4885 by @griffio)
- [PostgreSQL 變體] 修正 4932 postgresql default constraint functions (#4934 by @griffio)
- [PostgreSQL 變體] 修正 4879 postgresql class-cast error in alter table rename column during migrations (#4880 by @griffio)
- [PostgreSQL 變體] 修正 4474 PostgreSql create extension (#4541 by @griffio)
- [PostgreSQL 變體] 修正 5018 PostgreSql add Primary Key not nullable types (#5020 by @griffio)
- [PostgreSQL 變體] 修正 4703 aggregate expressions (#5071 by @griffio)
- [PostgreSQL 變體] 修正 5028 PostgreSql json (#5030 by @griffio)
- [PostgreSQL 變體] 修正 5040 PostgreSql json operators (#5041 by @griffio)
- [PostgreSQL 變體] 修正 json operator binding for 5040 (#5100 by @griffio)
- [PostgreSQL 變體] 修正 5082 tsvector (#5104 by @griffio)
- [PostgreSQL 變體] 修正 5032 column adjacency for PostgreSql UPDATE FROM statement (#5035 by @griffio)
- [SQLite 變體] 修正 4897 sqlite alter table rename column (#4899 by @griffio)
- [IDE 外掛程式] 修正 error handler crash (#4988 by @aperfilyev)
- [IDE 外掛程式] BugSnag fails to init in IDEA 2023.3 (by @aperfilyev)
- [IDE 外掛程式] PluginException when opening .sq file in IntelliJ via plugin (by @aperfilyev)
- [IDE 外掛程式] Dont bundle the kotlin lib into the intellij plugin as its already a plugin dependency (#5126)
- [IDE 外掛程式] Use the extensions array instead of stream (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 新增
- [編譯器] 在執行 SELECT 時新增對 multi-column-expr 的支援 (#4453 by @Adriel-M)
- [PostgreSQL 變體] 新增對 PostgreSQL CREATE INDEX CONCURRENTLY 的支援 (#4531 by @griffio)
- [PostgreSQL 變體] 允許 PostgreSQL CTEs auxiliary statements 相互參照 (#4493 by @griffio)
- [PostgreSQL 變體] 新增對 PostgreSQL binary expr 和 sum 型別的支援 (#4539 by @Adriel-M)
- [PostgreSQL 變體] 新增對 PostgreSQL SELECT DISTINCT ON 語法的支援 (#4584 by @griffio)
- [PostgreSQL 變體] 新增對 PostgreSQL JSON functions in SELECT statements 的支援 (#4590 by @MariusVolkhart)
- [PostgreSQL 變體] 新增 generate_series PostgreSQL 函式 (#4717 by @griffio)
- [PostgreSQL 變體] 新增額外的 Postgres String function definitions (#4752 by @MariusVolkhart)
- [PostgreSQL 變體] 將 DATE PostgreSQL 型別新增到 min and max aggregate functions (#4816 by @anddani)
- [PostgreSQL 變體] 將 PostgreSql temporal types 新增到 SqlBinaryExpr (#4657 by @griffio)
- [PostgreSQL 變體] 新增 TRUNCATE 到 postgres dialect (#4817 by @de-luca)
- [SQLite 3.35 變體] 允許依序評估多個 ON CONFLICT 子句 (#4551 by @griffio)
- [JDBC 驅動程式] 新增 Language annotations 以實現更愉快的 SQL 編輯 (#4602 by @MariusVolkhart)
- [原生驅動程式] 原生驅動程式：新增對 linuxArm64 的支援 (#4792 by @hfhbd)
- [Android 驅動程式] 為 AndroidSqliteDriver 新增 `windowSizeBytes` 參數 (#4804 by @BoD)
- [Paging3 擴充功能] 功能：為 OffsetQueryPagingSource 新增 `initialOffset` (#4802 by @MohamadJaara)

### 變更
- [編譯器] 在適當情況下優先使用 Kotlin 型別 (#4517 by @eygraber)
- [編譯器] 執行 value type insert 時始終包含 column names (#4864)
- [PostgreSQL 變體] 移除 PostgreSQL dialect 的 experimental status (#4443 by @hfhbd)
- [PostgreSQL 變體] 更新 PostgreSQL types 的文件 (#4569 by @MariusVolkhart)
- [R2DBC 驅動程式] 優化 PostgreSQL 中處理 integer data types 的效能 (#4588 by @MariusVolkhart)

### 移除
- [SQLite Javascript Driver] 移除 sqljs-driver (#4613, #4670 by @dellisd)

### 修正
- [編譯器] 修正 compilation of grouped statements with returns and no parameters (#4699 by @griffio)
- [編譯器] 綁定 SqlBinaryExpr 的引數 (#4604 by @griffio)
- [IDE 外掛程式] 如果設定了 IDEA Project JDK 則使用它 (#4689 by @griffio)
- [IDE 外掛程式] 修正 IDEA 2023.2 及更高版本中的「Unknown element type: TYPE_NAME」錯誤 (#4727)
- [IDE 外掛程式] 修正了與 2023.2 的一些相容性問題
- [Gradle 外掛程式] 更正 verifyMigrationTask Gradle task 的文件 (#4713 by @joshfriend)
- [Gradle 外掛程式] 新增 Gradle task output message 以幫助使用者 generate a database before verifying a database (#4684 by @jingwei99)
- [PostgreSQL 變體] 修正 the renaming of PostgreSQL columns multiple times (#4566 by @griffio)
- [PostgreSQL 變體] 修正 4714 postgresql alter column nullability (#4831 by @griffio)
- [PostgreSQL 變體] 修正 4837 alter table alter column (#4846 by @griffio)
- [PostgreSQL 變體] 修正 4501 PostgreSql sequence (#4528 by @griffio)
- [SQLite 變體] 允許 JSON binary operator to be used on a column expression (#4776 by @eygraber)
- [SQLite 變體] Update From false positive for multiple columns found with name (#4777 by @eygraber)
- [原生驅動程式] 支援 named in-memory databases (#4662 by @05nelsonm)
- [原生驅動程式] 確保 query listener collection 的 thread safety (#4567 by @kpgalligan)
- [JDBC 驅動程式] 修正 ConnectionManager 中的 connection leak (#4589 by @MariusVolkhart)
- [JDBC 驅動程式] 修正 JdbcSqliteDriver url parsing when choosing ConnectionManager type (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 新增
- [MySQL 變體] MySQL：在 IF expression 中支援 timestamp/bigint (#4329 by @shellderp)
- [MySQL 變體] MySQL：新增 now (#4431 by @hfhbd)
- [Web Driver] 啟用 NPM package publishing (#4364)
- [IDE 外掛程式] 允許使用者在 gradle tooling connect fails 時顯示 stacktrace (#4383)

### 變更
- [Sqlite Driver] Simplify using schema migrations for JdbcSqliteDriver (#3737 by @morki)
- [R2DBC Driver] Real async R2DBC cursor (#4387 by @hfhbd)

### 修正
- [IDE 外掛程式] Dont instantiate the database project service until needed (#4382)
- [IDE 外掛程式] Handle process cancellation during find usages (#4340)
- [IDE 外掛程式] 修正 IDE generation of async code (#4406)
- [IDE 外掛程式] Move assembly of the package structure to be one-time computed and off the EDT (#4417)
- [IDE 外掛程式] Use the correct stub index key for kotlin type resolution on 2023.2 (#4416)
- [IDE 外掛程式] Wait for the index to be ready before performing a search (#4419)
- [IDE 外掛程式] Dont perform a goto if the index is unavailable (#4420)
- [編譯器] Fix result expression for grouped statements (#4378)
- [編譯器] Don't use virtual table as interface type (#4427 by @hfhbd)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 新增
- [MySQL 變體] 支援小寫 date types 和 min and max on date types (#4243 by @shellderp)
- [MySQL 變體] 支援 mysql types for binary expr and sum (#4254 by @shellderp)
- [MySQL 變體] 支援 unsigned ints without display width (#4306 by @shellderp)
- [MySQL 變體] 支援 LOCK IN SHARED MODE
- [PostgreSQL 變體] 新增 boolean 和 Timestamp 到 min max (#4245 by @griffio)
- [PostgreSQL 變體] Postgres：新增 window function support (#4283 by @hfhbd)
- [執行期] 將 linuxArm64、androidNative 和 watchosDeviceArm target 新增到 runtime (#4258 by @hfhbd)
- [分頁擴充功能] 將 linux 和 mingw x64 target 新增到 paging extension (#4280 by @chippman)

### 變更
- [Gradle 外掛程式] 新增 Android API 34 的 automatic dialect support (#4251)
- [分頁擴充功能] 新增對 QueryPagingSource 中 SuspendingTransacter 的支援 (#4292 by @daio)
- [執行期] 改善 addListener API (#4244 by @hfhbd)
- [執行期] 使用 Long 作為 migration version (#4297 by @hfhbd)

### 修正
- [Gradle 外掛程式] 使用 stable output path for generated source (#4269 by @joshfriend)
- [Gradle 外掛程式] Gradle tweaks (#4222 by @3flex)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 新增
- [分頁] 為 paging extensions 新增 js browser target (#3843 by @sproctor)
- [分頁] 為 androidx-paging3 extension 新增 iosSimulatorArm64 target (#4117)
- [PostgreSQL 變體] 新增對 gen_random_uuid() 的支援和測試 (#3855 by @davidwheeler123)
- [PostgreSQL 變體] Alter table add constraint postgres (#4116 by @griffio)
- [PostgreSQL 變體] Alter table add constraint check (#4120 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql character length functions (#4121 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql column default interval (#4142 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql interval column result (#4152 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql Alter Column (#4165 by @griffio)
- [PostgreSQL 變體] PostgreSQL: 新增 date_part (#4198 by @hfhbd)
- [MySQL 變體] 新增 sql char length functions (#4134 by @griffio)
- [IDE 外掛程式] 新增 sqldelight directory suggestions (#3976 by @aperfilyev)
- [IDE 外掛程式] Compact middle packages in project tree (#3992 by @aperfilyev)
- [IDE 外掛程式] 新增 join clause completion (#4086 by @aperfilyev)
- [IDE 外掛程式] Create view intention and live template (#4074 by @aperfilyev)
- [IDE 外掛程式] Warn about missing WHERE inside DELETE or UPDATE (#4058 by @aperfilyev)
- [Gradle 外掛程式] 啟用 typesafe project accessors (#4005 by @hfhbd)

### 變更
- [Gradle 外掛程式] 允許透過 ServiceLoader mechanism 註冊 VerifyMigrationTask 的 DriverInitializer (#3986 by @C2H6O)
- [Gradle 外掛程式] 建立 explicit compiler env (#4079 by @hfhbd)
- [JS 驅動程式] 將 web worker driver 拆分為 separate artifact
- [JS 驅動程式] Don't expose JsWorkerSqlCursor (#3874 by @hfhbd)
- [JS 驅動程式] Disable publication of the sqljs driver (#4108)
- [執行期] 強制 synchronous drivers require a synchronous schema initializer (#4013)
- [執行期] 改善 Cursors 的 async support (#4102)
- [執行期] 移除 deprecated targets (#4149 by @hfhbd)
- [執行期] 移除 support for old MM (#4148 by @hfhbd)

### 修正
- [R2DBC 驅動程式] R2DBC: Await closing the driver (#4139 by @hfhbd)
- [編譯器] 在 database create(SqlDriver) 中包含來自 migrations 的 PRAGMAs (#3845 by @MariusVolkhart)
- [編譯器] 修正 RETURNING clause 的 codegen (#3872 by @MariusVolkhart)
- [編譯器] Dont generate types for virtual tables (#4015)
- [Gradle 外掛程式] Small Gradle plugin QoL improvements (#3930 by @zacsweers)
- [IDE 外掛程式] 修正 unresolved kotlin types (#3924 by @aperfilyev)
- [IDE 外掛程式] 修正 for expand wildcard intention to work with qualifier (#3979 by @aperfilyev)
- [IDE 外掛程式] Use available jdk if java home is missing (#3925 by @aperfilyev)
- [IDE 外掛程式] 修正 find usages on package names (#4010)
- [IDE 外掛程式] Dont show auto imports for invalid elements (#4008)
- [IDE 外掛程式] Do not resolve if a dialect is missing (#4009)
- [IDE 外掛程式] Ignore IDE runs of the compiler during an invalidated state (#4016)
- [IDE 外掛程式] Add support for IntelliJ 2023.1 (#4037 by @madisp)
- [IDE 外掛程式] Rename named argument usage on column rename (#4027 by @aperfilyev)
- [IDE 外掛程式] 修正 add migration popup (#4105 by @aperfilyev)
- [IDE 外掛程式] Disable SchemaNeedsMigrationInspection in migration files (#4106 by @aperfilyev)
- [IDE 外掛程式] Use sql column name for migration generation instead of type name (#4112 by @aperfilyev)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 新增
- [分頁] 多平台分頁擴充功能 (by @jeffdgr8)
- [執行期] 為 Listener 介面新增 `fun` 修飾符。
- [SQLite 變體] 新增 SQLite 3.33 支援 (UPDATE FROM) (by @eygraber)
- [PostgreSQL 變體] 支援 PostgreSQL 中的 UPDATE FROM (by @eygraber)

### 變更
- [RDBC 驅動程式] 公開 connection (by @hfhbd)
- [執行期] 將 migration callbacks 移動到 main `migrate` fun
- [Gradle 外掛程式] Hide Configurations from downstream projects
- [Gradle 外掛程式] Only shade Intellij (by @hfhbd)
- [Gradle 外掛程式] 支援 Kotlin 1.8.0-Beta 並新增 multi version Kotlin test (by @hfhbd)

### 修正
- [RDBC 驅動程式] 改用 javaObjectType (by @hfhbd)
- [RDBC 驅動程式] 修正 `bindStatement` 中的 primitive null values (by @hfhbd)
- [RDBC 驅動程式] 支援 R2DBC 1.0 (by @hfhbd)
- [PostgreSQL 變體] Postgres: 修正 Array without type parameter (by @hfhbd)
- [IDE 外掛程式] Bump intellij to 221.6008.13 (by @hfhbd)
- [編譯器] Resolve recursive origin table from pure views (by @hfhbd)
- [編譯器] Use value classes from table foreign key clause (by @hfhbd)
- [編譯器] 修正 SelectQueryGenerator to support bind expression without parenthesis (#3780 by @bellatoris)
- [編譯器] 修正 using transactions 時 duplicate generation of `${name}Indexes` variables 的問題 (by @sachera)

## [1.5.5] - 2023-01-20
[1.5.5]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.5

這是針對 Kotlin 1.8 和 IntelliJ 2021+ 的相容性版本，支援 JDK 17。

## [1.5.4] - 2022-10-06
[1.5.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.4

這是 Kotlin 1.7.20 和 AGP 7.3.0 的相容性更新。

## [2.0.0-alpha04] - 2022-10-03
[2.0.0-alpha04]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha04

### 破壞性變更

- Paging 3 擴充功能 API 已變更為僅允許 `int` 型別作為計數。
- Coroutines 擴充功能現在需要傳入一個 Dispatcher，而不是預設。
- Dialect 和 Driver 類別現在是 `final`，請改用委託 (delegation)。

### 新增
- [HSQL 變體] Hsql: 支援在 Insert 中使用 `DEFAULT` 作為生成欄位 (#3372 by @hfhbd)
- [PostgreSQL 變體] PostgreSQL: 支援在 INSERT 中使用 `DEFAULT` 作為生成欄位 (#3373 by @hfhbd)
- [PostgreSQL 變體] 新增 NOW() 到 PostgreSQL (#3403 by @hfhbd)
- [PostgreSQL 變體] PostgreSQL 新增 NOT 運算子 (#3504 by @hfhbd)
- [分頁] 允許將 CoroutineContext 傳入 *QueryPagingSource (#3384)
- [Gradle 外掛程式] 新增 better version catalog support for dialects (#3435)
- [原生驅動程式] 新增 callback to hook into DatabaseConfiguration creation of NativeSqliteDriver (#3512 by @svenjacobs)

### 變更
- [分頁] 為 KeyedQueryPagingSource backed QueryPagingSource function 新增 default dispatcher (#3385)
- [分頁] Make OffsetQueryPagingSource only work with Int (#3386)
- [Async 執行期] Move await* to upper class ExecutableQuery (#3524 by @hfhbd)
- [Coroutines 擴充功能] 移除 default params to flow extensions (#3489)

### 修正
- [Gradle 外掛程式] 更新至 Kotlin 1.7.20 (#3542 by @zacsweers)
- [R2DBC 驅動程式] Adopt R2DBC changes which do not always send a value (#3525 by @hfhbd)
- [HSQL 變體] 修正 failing sqlite VerifyMigrationTask with Hsql (#3380 by @hfhbd)
- [Gradle 外掛程式] Convert tasks to use lazy configuration API (by @3flex)
- [Gradle 外掛程式] Avoid NPEs in Kotlin 1.7.20 (#3398 by @ZacSweers)
- [Gradle 外掛程式] Fix description of squash migrations task (#3449)
- [IDE 外掛程式] Fix NoSuchFieldError in newer Kotlin plugins (#3422 by @madisp)
- [IDE 外掛程式] IDEA: UnusedQueryInspection - fix ArrayIndexOutOfBoundsException. (#3427 by @vanniktech)
- [IDE 外掛程式] Use reflection for old kotlin plugin references
- [編譯器] Custom dialect with extension function don't create imports (#3338 by @hfhbd)
- [編譯器] 修正 escaping CodeBlock.of("${CodeBlock.toString()}") (#3340 by @hfhbd)
- [編譯器] Await async execute statements in migrations (#3352)
- [編譯器] 修正 AS (#3370 by @hfhbd)
- [編譯器] `getObject` method supports automatic filling of the actual type. (#3401 by @robxyy)
- [編譯器] 修正 codegen for async grouped returning statements (#3411)
- [編譯器] Infer the Kotlin type of bind parameter, if possible, or fail with a better error message (#3413 by @hfhbd)
- [編譯器] Don't allow ABS("foo") (#3430 by @hfhbd)
- [編譯器] 支援 inferring kotlin type from other parameters (#3431 by @hfhbd)
- [編譯器] Always create the database implementation (#3540 by @hfhbd)
- [編譯器] Relax javaDoc and add it to custom mapper function too (#3554 @hfhbd)
- [編譯器] 修正 DEFAULT in binding (by @hfhbd)
- [分頁] 修正 Paging 3 (#3396)
- [分頁] 允許使用 Long 建構 OffsetQueryPagingSource (#3409)
- [分頁] Don't statically swap Dispatchers.Main (#3428)

## [2.0.0-alpha03] - 2022-06-17
[2.0.0-alpha03]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha03

### 破壞性變更

- 變體現在像實際的 Gradle 依賴項一樣被參照。
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 型別已被移除，取而代之的是 `AfterVersion`，後者現在始終包含驅動程式。
- `Schema` 型別不再是 `SqlDriver` 的子型別。
- `PreparedStatement` API 現在使用基於零的索引呼叫。

### 新增
- [IDE 外掛程式] 新增支援對正在執行的資料庫執行 SQLite、MySQL 和 PostgreSQL 命令 (#2718 by @aperfilyev)
- [IDE 外掛程式] 新增支援 Android Studio DB Inspector (#3107 by @aperfilyev)
- [執行期] 新增對 async drivers 的支援 (#3168 by @dellisd)
- [原生驅動程式] 支援 new kotlin native memory model (#3177 by @kpgalligan)
- [JS 驅動程式] 為 SqlJs workers 新增 driver (#3203 by @dellisd)
- [Gradle 外掛程式] Expose the classpath for SQLDelight tasks
- [Gradle 外掛程式] Add a gradle task for squashing migrations
- [Gradle 外掛程式] Add a flag to ignore schema definitions during migration checks
- [MySQL 變體] 支援 FOR SHARE 和 FOR UPDATE in MySQL (#3098)
- [MySQL 變體] 支援 MySQL index hints (#3099)
- [PostgreSQL 變體] 新增 date_trunc (#3295 by @hfhbd)
- [JSON 擴充功能] 支援 JSON table functions (#3090)

### 變更
- [執行期] Remove the AfterVersion type without the driver (#3091)
- [執行期] Move Schema type to top-level
- [執行期] Open dialect and resolver to support 3rd party implementations (#3232 by @hfhbd)
- [編譯器] Include the dialect used to compile in failure reports (#3086)
- [編譯器] Skip unused adapters (#3162 by @eygraber)
- [編譯器] Use zero based index in PrepareStatement (#3269 by @hfhbd)
- [Gradle 外掛程式] Also make the dialect a proper gradle dependency instead of a string (#3085)
- [Gradle 外掛程式] Gradle Verify Task: Throw when missing database file. (#3126 by @vanniktech)

### 修正
- [Gradle 外掛程式] Minor cleanups and tweaks to the Gradle plugin (#3171 by @3flex)
- [Gradle 外掛程式] Dont use an AGP string for the generated directory
- [Gradle 外掛程式] Use AGP namespace attribute (#3220)
- [Gradle 外掛程式] Do not add kotlin-stdlib as a runtime dependency of the Gradle plugin (#3245 by @mbonnin)
- [Gradle 外掛程式] Simplify the multiplatform configuration (#3246 by @mbonnin)
- [Gradle 外掛程式] Support js only projects (#3310 by @hfhbd)
- [IDE 外掛程式] Use java home for gradle tooling API (#3078)
- [IDE 外掛程式] Load the JDBC driver on the correct classLoader inside the IDE plugin (#3080)
- [IDE 外掛程式] Mark the file element as null before invalidating to avoid errors during already existing PSI changes (#3082)
- [IDE 外掛程式] Dont crash finding usages of the new table name in an ALTER TABLE statement (#3106)
- [IDE 外掛程式] Optimize the inspectors and enable them to fail silently for expected exception types (#3121)
- [IDE 外掛程式] Delete files that should be generated directories (#3198)
- [IDE 外掛程式] 修正 a not-safe operator call
- [編譯器] Ensure updates and deletes with RETURNING statements execute queries. (#3084)
- [編譯器] Correctly infer argument types in compound selects (#3096)
- [編譯器] Common tables do not generate data classes so dont return them (#3097)
- [編譯器] Find the top migration file faster (#3108)
- [編譯器] Properly inherit nullability on the pipe operator
- [編譯器] 支援 the iif ANSI SQL function
- [編譯器] Don't generate empty query files (#3300 by @hfhbd)
- [編譯器] 修正 adapter with question mark only (#3314 by @hfhbd)
- [PostgreSQL 變體] Postgres primary key columns are always non-null (#3092)
- [PostgreSQL 變體] 修正 copy with same name in multiple tables (#3297 by @hfhbd)
- [SQLite 3.35 變體] Only show an error when dropping an indexed column from the altered table (#3158 by @eygraber)

## [2.0.0-alpha02] - 2022-04-13
[2.0.0-alpha02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha02

### 破壞性變更

- 您需要將所有 `app.cash.sqldelight.runtime.rx` 的出現替換為 `app.cash.sqldelight.rx2`

### 新增
- [編譯器] 支援 returning at the end of a grouped statement
- [編譯器] 支援 compiler extensions via dialect modules 並新增 a SQLite JSON extension (#1379, #2087)
- [編譯器] 支援 PRAGMA statements which return a value (#1106)
- [編譯器] 支援 generating value types for marked columns
- [編譯器] 新增 support for optimistic locks and validation (#1952)
- [編譯器] 支援 multi-update statements
- [PostgreSQL] 支援 postgres returning statements
- [PostgreSQL] 支援 postgres date types
- [PostgreSQL] 支援 pg intervals
- [PostgreSQL] 支援 PG Booleans 並修正 inserts on alter tables
- [PostgreSQL] 支援 optional limits in Postgres
- [PostgreSQL] 支援 PG BYTEA type
- [PostgreSQL] 新增 a test for postgres serials
- [PostgreSQL] 支援 for update postgres syntax
- [PostgreSQL] 支援 PostgreSQL array types
- [PostgreSQL] Properly store/retrieve UUID types in PG
- [PostgreSQL] 支援 PostgreSQL NUMERIC type (#1882)
- [PostgreSQL] 支援 returning queries inside of common table expressions (#2471)
- [PostgreSQL] 支援 json specific operators
- [PostgreSQL] 新增 Postgres Copy (by @hfhbd)
- [MySQL] 支援 MySQL Replace
- [MySQL] 支援 NUMERIC/BigDecimal MySQL types (#2051)
- [MySQL] 支援 MySQL truncate statement
- [MySQL] 支援 json specific operators in Mysql (by @eygraber)
- [MySQL] 支援 MySql INTERVAL (#2969 by @eygraber)
- [HSQL] 新增 HSQL Window functionality
- [SQLite] Don't replace equality checks for nullable parameters in a WHERE (#1490 by @eygraber)
- [SQLite] 支援 Sqlite 3.35 returning statements (#1490 by @eygraber)
- [SQLite] 支援 GENERATED clause
- [SQLite] 新增 support for Sqlite 3.38 dialect (by @eygraber)

### 變更
- [編譯器] Clean up generated code a bit
- [編譯器] Forbid usage of table parameters in grouped statements (#1822)
- [編譯器] Put grouped queries inside a transaction (#2785)
- [執行期] Return the updated row count from the drivers execute method
- [執行期] Confine SqlCursor to the critical section accessing the connection. (#2123 by @andersio)
- [Gradle 外掛程式] Compare schema definitions for migrations (#841)
- [PostgreSQL] Disallow double quotes for PG
- [MySQL] Error on usage of == in MySQL (#2673)

### 修正
- [編譯器] Same adapter type from different tables causing a compilation error in 2.0 alpha
- [編譯器] Problem compiling upsert statement (#2791)
- [編譯器] Query result should use tables in the select if there are multiple matches (#1874, #2313)
- [編譯器] 支援 updating a view which has a INSTEAD OF trigger (#1018)
- [編譯器] 支援 from and for in function names
- [編譯器] 允許 SEPARATOR keyword in function expressions
- [編譯器] Cannot access ROWID of aliased table in ORDER BY
- [編譯器] Aliased column name is not recognized in HAVING clause in MySQL
- [編譯器] Erroneous 'Multiple columns found' error
- [編譯器] Unable to set PRAGMA locking_mode = EXCLUSIVE;
- [PostgreSQL] Postgresql rename column
- [MySQL] UNIX_TIMESTAMP, TO_SECONDS, JSON_ARRAYAGG MySQL functions not recognized
- [SQLite] 修正 SQLite window functionality
- [IDE 外掛程式] Run the goto handler in an empty progress indicator (#2990)
- [IDE 外掛程式] Ensure the highlight visitor doesnt run if the project isnt configured (#2981, #2976)
- [IDE 外掛程式] Ensure transitive generated code is also updated in the IDE (#1837)
- [IDE 外掛程式] Invalidate indexes when updating the dialect

## [2.0.0-alpha01] - 2022-03-31
[2.0.0-alpha01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha01

這是 2.0 的第一個 Alpha 版本，並包含一些破壞性變更。我們預計將有更多 ABI 破壞性變更，因此請勿發布任何依賴此版本的函式庫（應用程式應該沒問題）。

### 破壞性變更

- 首先，您需要將所有 `com.squareup.sqldelight` 的出現替換為 `app.cash.sqldelight`
- 其次，您需要將所有 `app.cash.sqldelight.android` 的出現替換為 `app.cash.sqldelight.driver.android`
- 第三，您需要將所有 `app.cash.sqldelight.sqlite.driver` 的出現替換為 `app.cash.sqldelight.driver.jdbc.sqlite`
- 第四，您需要將所有 `app.cash.sqldelight.drivers.native` 的出現替換為 `app.cash.sqldelight.driver.native`
- IDE 外掛程式必須更新到 2.X 版本，該版本可在 [alpha 或 eap 頻道](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha) 找到
- 變體現在是您可以透過 Gradle 指定的依賴項：

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

目前支援的變體包括 `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect` 和 `sqlite-3-35-dialect`

- 原始型別現在必須被匯入（例如 `INTEGER AS Boolean` 您必須 `import kotlin.Boolean`），一些之前支援的型別現在需要一個 Adapter。對於大多數轉換（例如 `IntColumnAdapter` 用於 `Integer AS kotlin.Int`），原始型別 Adapter 可在 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` 中找到。

### 新增
- [IDE 外掛程式] Basic suggested migration (by @aperfilyev)
- [IDE 外掛程式] 新增 import hint action (by @aperfilyev)
- [IDE 外掛程式] 新增 kotlin class completion (by @aperfilyev)
- [Gradle 外掛程式] 新增 shortcut for Gradle type safe project accessors (by @hfhbd)
- [編譯器] Customize codegen based on dialect (by @MariusVolkhart)
- [JDBC 驅動程式] 新增 common types to JdbcDriver (by @MariusVolkhart)
- [SQLite] 新增 support for the sqlite 3.35 (by @eygraber)
- [SQLite] 新增 support for ALTER TABLE DROP COLUMN (by @eygraber)
- [SQLite] 新增 support for Sqlite 3.30 dialect (by @eygraber)
- [SQLite] 支援 NULLS FIRST/LAST in sqlite (by @eygraber)
- [HSQL] 新增 HSQL support for generated clause (by @MariusVolkhart)
- [HSQL] 新增 support for named parameters in HSQL (by @MariusVolkhart)
- [HSQL] Customize the HSQL insert query (by @MariusVolkhart)

### 變更
- [全部] 套件名稱已從 `com.squareup.sqldelight` 變更為 `app.cash.sqldelight`。
- [執行期] Move dialects into their own isolated gradle modules
- [執行期] Switch to driver-implemented query notifications.
- [執行期] Extract default column adapters to separate module (#2056, #2060)
- [編譯器] Let modules generate the queries implementations instead of redoing it in each module
- [編譯器] Remove the custom toString generation of generated data classes. (by @PaulWoitaschek)
- [JS 驅動程式] Remove sql.js dependency from sqljs-driver (by @dellisd)
- [分頁] Remove the android paging 2 extension
- [IDE 外掛程式] Add an editor banner while SQLDelight is syncing (#2511)
- [IDE 外掛程式] 最低支援的 IntelliJ 版本為 2021.1

### 修正
- [執行期] Flatten listener list to reduce allocations and pointer chasing. (by @andersio)
- [IDE 外掛程式] 修正 error message to allow jumping to error (by @hfhbd)
- [IDE 外掛程式] 新增 missing inspection descriptions (#2768 by @aperfilyev)
- [IDE 外掛程式] 修正 exception in GotoDeclarationHandler (#2531, #2688, #2804 by @aperfilyev)
- [IDE 外掛程式] Highlight import keyword (by @aperfilyev)
- [IDE 外掛程式] 修正 unresolved kotlin types (#1678 by @aperfilyev)
- [IDE 外掛程式] 修正 highlighting for unresolved package (#2543 by @aperfilyev)
- [IDE 外掛程式] Dont attempt to inspect mismatched columns if the project index is not yet initialized
- [IDE 外掛程式] Dont initialize the file index until a gradle sync has occurred
- [IDE 外掛程式] Cancel the SQLDelight import if a gradle sync begins
- [IDE 外掛程式] Regenerate the database outside of the thread an undo action is performed on
- [IDE 外掛程式] If a reference cannot be resolves use a blank java type
- [IDE 外掛程式] Correctly move off the main thread during file parsing and only move back on to write
- [IDE 外掛程式] Improve compatibility with older IntelliJ versions (by @3flex)
- [IDE 外掛程式] Use faster annotation API
- [Gradle 外掛程式] Explicitly support js/android plugins when adding runtime (by @ZacSweers)
- [Gradle 外掛程式] Register migration output task without derviving schemas from migrations (#2744 by @kevincianfarini)
- [Gradle 外掛程式] If the migration task crashes, print the file it crashed running
- [Gradle 外掛程式] Sort files when generating code to ensure idempotent outputs (by @ZacSweers)
- [編譯器] Use faster APIs for iterating files and dont explore the entire PSI graph
- [編譯器] 新增 keyword mangling to select function parameters (#2759 by @aperfilyev)
- [編譯器] 修正 packageName for migration adapter (by @hfhbd)
- [編譯器] Emit annotations on properties instead of types (#2798 by @aperfilyev)
- [編譯器] Sort arguments before passing to a Query subtype (#2379 by @aperfilyev)

## [1.5.3] - 2021-11-23
[1.5.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.3

### 新增
- [JDBC 驅動程式] Open JdbcDriver for 3rd party driver implementations (#2672 by @hfhbd)
- [MySQL 變體] 新增 missing functions for time increments (#2671 by @sdoward)
- [Coroutines 擴充功能] 新增 M1 targets for coroutines-extensions (by @PhilipDukhov)

### 變更
- [Paging3 擴充功能] Distribute sqldelight-android-paging3 as JAR instead of AAR (#2634 by @julioromano)
- 作為 soft keywords 的 Property names 現在將以底線為後綴。例如 `value` 將被公開為 `value_`

### 修正
- [編譯器] Don't extract variables for duplicate array parameters (by @aperfilyev)
- [Gradle 外掛程式] 新增 kotlin.mpp.enableCompatibilityMetadataVariant. (#2628 by @martinbonnin)
- [IDE 外掛程式] Find usages processing requires a read action

## [1.5.2] - 2021-10-12
[1.5.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.2

### 新增
- [Gradle 外掛程式] HMPP support (#2548 by @martinbonnin)
- [IDE 外掛程式] 新增 NULL comparison inspection (by @aperfilyev)
- [IDE 外掛程式] 新增 inspection suppressor (#2519 by @aperfilyev)
- [IDE 外掛程式] Mixed named and positional parameters inspection (by @aperfilyev)
- [SQLite 驅動程式] 新增 mingwX86 target. (#2558 by @enginegl)
- [SQLite 驅動程式] 新增 M1 targets
- [SQLite 驅動程式] 新增 linuxX64 support (#2456 by @chippmann)
- [MySQL 變體] 新增 ROW_COUNT function to mysql (#2523)
- [PostgreSQL 變體] postgres rename, drop column (by @pabl0rg)
- [PostgreSQL 變體] PostgreSQL grammar doesn't recognize CITEXT
- [PostgreSQL 變體] Include TIMESTAMP WITH TIME ZONE and TIMESTAMPTZ
- [PostgreSQL 變體] 新增 grammar for PostgreSQL GENERATED columns
- [執行期] Provide SqlDriver as a parameter to AfterVersion (#2534, 2614 by @ahmedre)

### 變更
- [Gradle 外掛程式] explicitely require Gradle 7.0 (#2572 by @martinbonnin)
- [Gradle 外掛程式] Make VerifyMigrationTask support Gradle's up-to-date checks (#2533 by @3flex)
- [IDE 外掛程式] Don't warn with "Join compares two columns of different types" when joining nullable with non-nullable type (#2550 by @pchmielowski)
- [IDE 外掛程式] Clarify the error for the lowercase 'as' in column type (by @aperfilyev)

### 修正
- [IDE 外掛程式] Do not reparse under a new dialect if the project is already disposed (#2609)
- [IDE 外掛程式] If the associated virtual file is null, the module is null (#2607)
- [IDE 外掛程式] Avoid crashing during the unused query inspection (#2610)
- [IDE 外掛程式] Run the database sync write inside of a write action (#2605)
- [IDE 外掛程式] Let the IDE schedule SQLDelight syncronization
- [IDE 外掛程式] 修正 npe in JavaTypeMixin (#2603 by @aperfilyev)
- [IDE 外掛程式] 修正 IndexOutOfBoundsException in MismatchJoinColumnInspection (#2602 by @aperfilyev)
- [IDE 外掛程式] 新增 description for UnusedColumnInspection (#2600 by @aperfilyev)
- [IDE 外掛程式] Wrap PsiElement.generatedVirtualFiles into read action (#2599 by @aperfilyev)
- [IDE 外掛程式] Remove unnecessary nonnull cast (#2596)
- [IDE 外掛程式] Properly handle nulls for find usages (#2595)
- [IDE 外掛程式] Fix IDE autocomplete for generated files for Android (#2573 by @martinbonnin)
- [IDE 外掛程式] 修正 npe in SqlDelightGotoDeclarationHandler (by @aperfilyev)
- [IDE 外掛程式] Mangle kotlin keywords in arguments inside insert stmt (#2433 by @aperfilyev)
- [IDE 外掛程式] 修正 npe in SqlDelightFoldingBuilder (#2382 by @aperfilyev)
- [IDE 外掛程式] Catch ClassCastException in CopyPasteProcessor (#2369 by @aperfilyev)
- [IDE 外掛程式] 修正 update live template (by @IliasRedissi)
- [IDE 外掛程式] 新增 descriptions to intention actions (#2489 by @aperfilyev)
- [IDE 外掛程式] 修正 exception in CreateTriggerMixin if table is not found (by @aperfilyev)
- [編譯器] Topologically sort table creation statemenets
- [編譯器] Stop invoking `forDatabaseFiles` callback on directories (#2532)
- [Gradle 外掛程式] Propagate generateDatabaseInterface task dependency to potential consumers (#2518 by @martinbonnin)

## [1.5.1] - 2021-07-16
[1.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.1

### 新增
- [PostgreSQL 變體] PostgreSQL JSONB 和 ON Conflict Do Nothing (by @satook)
- [PostgreSQL 變體] 新增 support for PostgreSQL ON CONFLICT (column, ...) DO UPDATE (by @satook)
- [MySQL 變體] 支援 MySQL generated columns (by @JGulbronson)
- [原生驅動程式] 新增 watchosX64 support
- [IDE 外掛程式] 新增 parameter types and annotations (by @aperfilyev)
- [IDE 外掛程式] 新增 action to generate 'select all' query (by @aperfilyev)
- [IDE 外掛程式] Show column types in autocomplete (by @aperfilyev)
- [IDE 外掛程式] 新增 icons to autocomplete (by @aperfilyev)
- [IDE 外掛程式] 新增 action to generate 'select by primary key' query (by @aperfilyev)
- [IDE 外掛程式] 新增 action to generate 'insert into' query (by @aperfilyev)
- [IDE 外掛程式] 新增 highlighting for column names, stmt identifiers, function names (by @aperfilyev)
- [IDE 外掛程式] 新增 remaining query generation actions (#489 by @aperfilyev)
- [IDE 外掛程式] Show parameter hints from insert-stmt (by @aperfilyev)
- [IDE 外掛程式] Table alias intention action (by @aperfilyev)
- [IDE 外掛程式] Qualify column name intention (by @aperfilyev)
- [IDE 外掛程式] Go to declaration for kotlin property (by @aperfilyev)

### 變更
- [原生驅動程式] Improve native transaction performance by avoiding freezing and shareable data structures when possible (by @andersio)
- [Paging 3] Bump Paging3 version to 3.0.0 stable
- [JS 驅動程式] Upgrade sql.js to 1.5.0

### 修正
- [JDBC SQLite Driver] Call close() on connection before clearing the ThreadLocal (#2444 by @hannesstruss)
- [RX extensions] 修正 subscription / disposal race leak (#2403 by @pyricau)
- [Coroutines extension] Ensure we register query listener before notifying
- [編譯器] Sort notifyQueries to have consistent kotlin output file (by @thomascjy)
- [編譯器] Don't annotate select query class properties with @JvmField (by @eygraber)
- [IDE 外掛程式] 修正 import optimizer (#2350 by @aperfilyev)
- [IDE 外掛程式] 修正 unused column inspection (by @aperfilyev)
- [IDE 外掛程式] 新增 nested classes support to import inspection and class annotator (by @aperfilyev)
- [IDE 外掛程式] 修正 npe in CopyPasteProcessor (#2363 by @aperfilyev)
- [IDE 外掛程式] 修正 crash in InlayParameterHintsProvider (#2359 by @aperfilyev)
- [IDE 外掛程式] 修正 insertion of blank lines when copy-pasting any text into create table stmt (#2431 by @aperfilyev)

## [1.5.0] - 2021-04-23
[1.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.0

### 新增
- [SQLite Javascript Driver] 啟用 sqljs-driver publication (#1667 by @dellisd)
- [Paging3 擴充功能] Extension for Android Paging 3 Library (#1786 by @kevincianfarini)
- [MySQL 變體] 新增 support for mysql's ON DUPLICATE KEY UPDATE conflict resolution. (by @rharter)
- [SQLite 變體] 新增 compiler support for SQLite offsets() (by @qjroberts)
- [IDE 外掛程式] 新增 import quick fix for unknown type (#683 by @aperfilyev)
- [IDE 外掛程式] 新增 unused import inspection (#1161 by @aperfilyev)
- [IDE 外掛程式] 新增 unused query inspection (by @aperfilyev)
- [IDE 外掛程式] 新增 unused column inspection (#569 by @aperfilyev)
- [IDE 外掛程式] Automatically bring imports on copy/paste (#684 by @aperfilyev)
- [IDE 外掛程式] Pop a balloon when there are incompatibilities between gradle/intellij plugin versions
- [IDE 外掛程式] Insert Into ... VALUES(?) parameter hints (#506 by @aperfilyev)
- [IDE 外掛程式] Inline parameter hints (by @aperfilyev)
- [執行期] Include an API in the runtime for running migrations with callbacks (#1844)

### 變更
- [編譯器] Smart cast "IS NOT NULL" queries (#867)
- [編譯器] Protect against keywords that will fail at runtime (#1471, #1629)
- [Gradle 外掛程式] Reduce size of gradle plugin from 60mb -> 13mb.
- [Gradle 外掛程式] Properly support android variants, and remove support for KMM target-specific sql (#1039)
- [Gradle 外掛程式] Pick a minimum sqlite version based on minsdk (#1684)
- [原生驅動程式] Native driver connection pool and performance updates

### 修正
- [編譯器] NBSP before lambdas (by @oldergod)
- [編譯器] 修正 incompatible types in generated bind* and cursor.get* statements
- [編譯器] SQL clause should persist adapted type (#2067)
- [編譯器] Column with only NULL keyword should be nullable
- [編譯器] Dont generate mapper lambda with type annotations (#1957)
- [編譯器] If custom queries would clash, use the file name as an additional package suffix (#1057, #1278)
- [編譯器] Ensure foreign key cascades cause query listeners to be notified (#1325, #1485)
- [編譯器] If unioning two of the same type, return the table type (#1342)
- [編譯器] Ensure params to ifnull and coalesce can be nullable (#1263)
- [編譯器] Correctly use query-imposed nullability for expressions
- [MySQL 變體] 支援 MySQL if statements
- [PostgreSQL 變體] Retrieve NUMERIC and DECIMAL as Double in PostgreSQL (#2118)
- [SQLite 變體] UPSERT notifications should account for BEFORE/AFTER UPDATE triggers. (#2198 by @andersio)
- [SQLite 驅動程式] Use multiple connections for threads in the SqliteDriver unless we are in memory (#1832)
- [JDBC 驅動程式] JDBC Driver assumes autoCommit is true (#2041)
- [JDBC 驅動程式] Ensure that we close connections on exception (#2306)
- [IDE 外掛程式] 修正 GoToDeclaration/FindUsages being broken on Windows due to path separator bug (#2054 by @angusholder)
- [IDE 外掛程式] Ignore gradle errors instead of crashing in the IDE.
- [IDE 外掛程式] If a sqldelight file is moved to a non-sqldelight module, do not attempt codegen
- [IDE 外掛程式] Ignore codegen errors in IDE
- [IDE 外掛程式] Ensure that we dont try to negatively substring (#2068)
- [IDE 外掛程式] Also ensure project is not disposed before running gradle action (#2155)
- [IDE 外掛程式] Arithmetic on nullable types should also be nullable (#1853)
- [IDE 外掛程式] Make 'expand * intention' work with additional projections (#2173 by @aperfilyev)
- [IDE 外掛程式] If kotlin resolution fails during GoTo, dont attempt to go to sqldelight files
- [IDE 外掛程式] If IntelliJ encounters an exception while sqldelight is indexing, dont crash
- [IDE 外掛程式] Handle exceptions that happen while detecting errors before codegen in the IDE
- [IDE 外掛程式] Make the IDE plugin compatible with Dynamic Plugins (#1536)
- [Gradle 外掛程式] Race condition generating a database using WorkerApi (#2062 by @stephanenicolas)
- [Gradle 外掛程式] classLoaderIsolation prevents custom jdbc usage (#2048 by @benasher44)
- [Gradle 外掛程式] Improve missing packageName error message (by @vanniktech)
- [Gradle 外掛程式] SQLDelight bleeds IntelliJ dependencies onto buildscript class path (#1998)
- [Gradle 外掛程式] Fix gradle build caching (#2075)
- [Gradle 外掛程式] Do not depend on kotlin-native-utils in Gradle plugin (by @ilmat192)
- [Gradle 外掛程式] Also write the database if there are only migration files (#2094)
- [Gradle 外掛程式] Ensure diamond dependencies only get picked up once in the final compilation unit (#1455)

此外，還要特別感謝 @3flex 在這次發布中為改進 SQLDelight 基礎設施所做的許多工作。

## [1.4.4] - 2020-10-08
[1.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.4

### 新增
- [PostgreSQL 變體] 支援 data-modifying statements in WITH
- [PostgreSQL 變體] 支援 substring function
- [Gradle 外掛程式] 新增 verifyMigrations flag for validating migrations during SQLDelight compilation (#1872)

### 變更
- [編譯器] Flag SQLite specific functions as unknown in non-SQLite dialects
- [Gradle 外掛程式] Provide a warning when the sqldelight plugin is applied but no databases are configured (#1421)

### 修正
- [編譯器] Report an error when binding a column name in an ORDER BY clause (#1187 by @eygraber)
- [編譯器] Registry warnings appear when generating the db interface (#1792)
- [編譯器] Incorrect type inference for case statement (#1811)
- [編譯器] Provide better errors for migration files with no version (#2006)
- [編譯器] Required database type to marshal is incorrect for some database type ColumnAdapter's (#2012)
- [編譯器] Nullability of CAST (#1261)
- [編譯器] Lots of name shadowed warnings in query wrappers (#1946 by @eygraber)
- [編譯器] Generated code is using full qualifier names (#1939)
- [IDE 外掛程式] Trigger sqldelight code gen from gradle syncs
- [IDE 外掛程式] Plugin not regenerating database interface when changing .sq files (#1945)
- [IDE 外掛程式] Issue when moving files to new packages (#444)
- [IDE 外掛程式] If theres nowhere to move the cursor, do nothing instead of crashing (#1994)
- [IDE 外掛程式] Use empty package name for files outside of a gradle project (#1973)
- [IDE 外掛程式] Fail gracefully for invalid types (#1943)
- [IDE 外掛程式] Throw a better error message when encountering an unknown expression (#1958)
- [Gradle 外掛程式] SQLDelight bleeds IntelliJ dependencies onto buildscript class path (#1998)
- [Gradle 外掛程式] "JavadocIntegrationKt not found" compilation error when adding method doc in *.sq file (#1982)
- [Gradle 外掛程式] SqlDeslight gradle plugin doesn't support Configuration Caching (CoCa). (#1947 by @stephanenicolas)
- [SQLite JDBC Driver] SQLException: database in auto-commit mode (#1832)
- [Coroutines 擴充功能] 修正 IR backend for coroutines-extensions (#1918 by @dellisd)

## [1.4.3] - 2020-09-04
[1.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.3

### 新增
- [MySQL 變體] 新增 support for MySQL last_insert_id function (by @lawkai)
- [PostgreSQL 變體] 支援 SERIAL data type (by @veyndan & @felipecsl)
- [PostgreSQL 變體] 支援 PostgreSQL RETURNING (by @veyndan)

### 修正
- [MySQL 變體] Treat MySQL AUTO_INCREMENT as having a default value (#1823)
- [編譯器] 修正 Upsert statement compiler error (#1809 by @eygraber)
- [編譯器] 修正 issue with invalid Kotlin being generated (#1925 by @eygraber)
- [編譯器] Have a better error message for unknown functions (#1843)
- [編譯器] Expose string as the type for the second parameter of instr
- [IDE 外掛程式] 修正 daemon bloat and UI thread stalling for IDE plugin (#1916)
- [IDE 外掛程式] Handle null module scenario (#1902)
- [IDE 外掛程式] In unconfigured sq files return empty string for the package name (#1920)
- [IDE 外掛程式] 修正 grouped statements and add an integration test for them (#1820)
- [IDE 外掛程式] Use built in ModuleUtil to find the module for an element (#1854)
- [IDE 外掛程式] Only add valid elements to lookups (#1909)
- [IDE 外掛程式] Parent can be null (#1857)

## [1.4.2] - 2020-08-27
[1.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.2

### 新增
- [執行期] 支援 new JS IR backend
- [Gradle 外掛程式] 新增 generateSqlDelightInterface Gradle task. (by @vanniktech)
- [Gradle 外掛程式] 新增 verifySqlDelightMigration Gradle task. (by @vanniktech)

### 修正
- [IDE 外掛程式] Use the gradle tooling API to facilitate data sharing between the IDE and gradle
- [IDE 外掛程式] Default to false for schema derivation
- [IDE 外掛程式] Properly retrieve the commonMain source set
- [MySQL 變體] 新增 minute to mySqlFunctionType() (by @maaxgr)

## [1.4.1] - 2020-08-21
[1.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.1

### 新增
- [執行期] 支援 Kotlin 1.4.0 (#1859)

### 變更
- [Gradle 外掛程式] Make AGP dependency compileOnly (#1362)

### 修正
- [編譯器] 新增 optional javadoc to column defintion rule and to table interface generator (#1224 by @endanke)
- [SQLite 變體] 新增 support for sqlite fts5 auxiliary functions highlight, snippet, and bm25 (by @drampelt)
- [MySQL 變體] 支援 MySQL bit data type
- [MySQL 變體] 支援 MySQL binary literals
- [PostgreSQL 變體] Expose SERIAL from sql-psi (by @veyndan)
- [PostgreSQL 變體] 新增 BOOLEAN data type (by @veyndan)
- [PostgreSQL 變體] 新增 NULL column constraint (by @veyndan)
- [HSQL 變體] 新增 `AUTO_INCREMENT` support to HSQL (by @rharter)

## [1.4.0] - 2020-06-22
[1.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.0

### 新增
- [MySQL 變體] MySQL 支援 (by @JGulbronson & @veyndan)
- [PostgreSQL 變體] 實驗性 PostgreSQL 支援 (by @veyndan)
- [HSQL 變體] 實驗性 H2 支援 (by @MariusVolkhart)
- [SQLite 變體] SQLite FTS5 支援 (by @benasher44 & @jpalawaga)
- [SQLite 變體] 支援 alter table rename column (#1505 by @angusholder)
- [IDE] IDE support for migration (.sqm) files
- [IDE] 新增 SQLDelight Live Templates that mimic built-in SQL Live Templates (#1154 by @veyndan)
- [IDE] 新增 new SqlDelight file action (#42 by @romtsn)
- [執行期] transactionWithReturn API for transactions that return results
- [編譯器] Syntax for grouping multiple SQL statements together in a .sq file
- [編譯器] 支援 generating schemas from migration files
- [Gradle 外掛程式] Add a task for outputting migration files as valid sql

### 變更
- [文件] Overhaul of the documentation website (by @saket)
- [Gradle 外掛程式] Improve unsupported dialect error message (by @veyndan)
- [IDE] Dynamically change file icon based on dialect (by @veyndan)
- [JDBC 驅動程式] Expose a JdbcDriver constructor off of javax.sql.DataSource (#1614)

### 修正
- [編譯器] 支援 Javadoc on tables and fix multiple javadoc in one file (#1224)
- [編譯器] 啟用 inserting a value for synthesized columns (#1351)
- [編譯器] 修正 inconsistency in directory name sanitizing (by @ZacSweers)
- [編譯器] Synthesized columns should retain nullability across joins (#1656)
- [編譯器] Pin the delete statement on the delete keyword (#1643)
- [編譯器] 修正 quoting (#1525 by @angusholder)
- [編譯器] 修正 the between operator to properly recurse into expressions (#1279)
- [編譯器] Give better error for missing table/column when creating an index (#1372)
- [編譯器] 啟用 using the outer querys projection in join constraints (#1346)
- [原生驅動程式] Make execute use transationPool (by @benasher44)
- [JDBC 驅動程式] Use the jdbc transaction APIs instead of sqlite (#1693)
- [IDE] 修正 virtualFile references to always be the original file (#1782)
- [IDE] Use the correct throwable when reporting errors to bugsnag (#1262)
- [Paging 擴充功能] 修正 leaky DataSource (#1628)
- [Gradle 外掛程式] If the output db file already exists when generating a schema, delete it (#1645)
- [Gradle 外掛程式] Fail migration validation if there are gaps
- [Gradle 外掛程式] Explicitely use the file index we set (#1644)

## [1.3.0] - 2020-04-03
[1.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.3.0

* 新增: [Gradle] Dialect 屬性，用於指定要編譯的 SQL 變體。
* 新增: [編譯器] #1009 實驗性支援 MySQL 變體。
* 新增: [編譯器] #1436 支援 sqlite:3.24 變體和 upsert。
* 新增: [JDBC 驅動程式] 從 sqlite jvm driver 中分離出 JDBC driver。
* 修正: [編譯器] #1199 支援任意長度的 lambdas。
* 修正: [編譯器] #1610 修正 avg() 的回傳型別為 nullable。
* 修正: [IntelliJ] #1594 修正路徑分隔符處理問題，該問題導致 Windows 上的 Goto 和 Find Usages 中斷。

## [1.2.2] - 2020-01-22
[1.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.2

* 新增: [執行期] 支援 Windows (mingW)、tvOS、watchOS 和 macOS 架構。
* 修正: [編譯器] sum() 的回傳型別應該是 nullable。
* 修正: [分頁] 將 Transacter 傳遞到 QueryDataSourceFactory 以避免 race conditions。
* 修正: [IntelliJ 外掛程式] 尋找檔案的套件名稱時，不要搜尋 dependencies。
* 修正: [Gradle] #862 將 Gradle 中的 validator logs 變更為 debug level。
* 增強: [Gradle] 將 GenerateSchemaTask 轉換為使用 Gradle worker。
* 注意: sqldelight-runtime artifact 已重新命名為 runtime。

## [1.2.1] - 2019-12-11
[1.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.1

* 修正: [Gradle] Kotlin Native 1.3.60 支援。
* 修正: [Gradle] #1287 Sync 時發出警告。
* 修正: [編譯器] #1469 Query 的 SynetheticAccessor 建立。
* 修正: [JVM 驅動程式] 修正 memory leak。
* 注意: coroutine extension artifact 要求將 kotlinx bintray maven repository 添加到您的 buildscript 中。

## [1.2.0] - 2019-08-30
[1.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.0

* 新增: [執行期] 穩定的 Flow API。
* 修正: [Gradle] Kotlin Native 1.3.50 支援。
* 修正: [Gradle] #1380 Clean build 有時會失敗。
* 修正: [Gradle] #1348 執行 verify tasks 時印出「Could not retrieve functions」。
* 修正: [編譯] #1405 如果 query 包含 FTS table joined，無法建構專案。
* 修正: [Gradle] #1266 擁有多個 database modules 時，偶爾會出現 gradle build failure。

## [1.1.4] - 2019-07-11
[1.1.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.4

* 新增: [執行期] 實驗性 kotlin Flow API。
* 修正: [Gradle] Kotlin/Native 1.3.40 相容性。
* 修正: [Gradle] #1243 修正 SQLDelight with Gradle configure on demand 的使用問題。
* 修正: [Gradle] #1385 修正 SQLDelight with incremental annotation processing 的使用問題。
* 修正: [Gradle] 允許 gradle tasks 快取。
* 修正: [Gradle] #1274 啟用 kotlin dsl 使用 sqldelight extension。
* 修正: [編譯器] 為每個 query 確定性地生成 unique ids。
* 修正: [編譯器] 僅在交易完成時通知 listening queries。
* 修正: [JVM 驅動程式] #1370 強制 JdbcSqliteDriver 使用者提供 DB URL。

## [1.1.3] - 2019-04-14
[1.1.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.3

* Gradle Metadata 1.0 發布。

## [1.1.2] - 2019-04-14
[1.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.2

* 新增: [執行期] #1267 Logging driver decorator。
* 修正: [編譯器] #1254 Split string literals which are longer than 2^16 characters。
* 修正: [Gradle] #1260 generated sources are recognized as iOS source in Multiplatform Project。
* 修正: [IDE] #1290 kotlin.KotlinNullPointerException in CopyAsSqliteAction.kt:43。
* 修正: [Gradle] #1268 Running linkDebugFrameworkIos* tasks fail in recent versions。

## [1.1.1] - 2019-03-01
[1.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.1

* 修正: [Gradle] Fix module dependency compilation for android projects。
* 修正: [Gradle] #1246 Set up api dependencies in afterEvaluate。
* 修正: [編譯器] Array types are properly printed。

## [1.1.0] - 2019-02-27
[1.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.0

* 新增: [Gradle] #502 允許指定 schema module dependencies。
* 增強: [編譯器] #1111 Table errors are sorted before other errors。
* 修正: [編譯器] #1225 Return the correct type for REAL literals。
* 修正: [編譯器] #1218 docid propagates through triggers。

## [1.0.3] - 2019-01-30
[1.0.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.3

* 增強: [執行期] #1195 Native Driver/Runtime Arm32。
* 增強: [執行期] #1190 Expose the mapper from the Query type。

## [1.0.2] - 2019-01-26
[1.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.2

* 修正: [Gradle 外掛程式] 更新至 kotlin 1.3.20。
* 修正: [執行期] Transactions no longer swallow exceptions。

## [1.0.1] - 2019-01-21
[1.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.1

* 增強: [原生驅動程式] 允許將 directory name 傳遞給 DatabaseConfiguration。
* 增強: [編譯器] #1173 Files without a package fail compilation。
* 修正: [IDE] Properly report IDE errors to Square。
* 修正: [IDE] #1162 Types in the same package show as error but work fine。
* 修正: [IDE] #1166 Renaming a table fails with NPE。
* 修正: [編譯器] #1167 Throws an exception when trying to parse complex SQL statements with UNION and SELECT。

## [1.0.0] - 2019-01-08
[1.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.0

* 新增: 生成程式碼的徹底改造，現在使用 Kotlin。
* 新增: RxJava2 extensions artifact。
* 新增: Android Paging extensions artifact。
* 新增: Kotlin Multiplatform 支援。
* 新增: Android、iOS 和 JVM SQLite driver artifacts。
* 新增: Transaction API。

## [0.7.0] - 2018-02-12
[0.7.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.7.0

* 新增: 生成的程式碼已更新為僅使用 Support SQLite 函式庫。所有查詢現在都生成 statement objects 而不是 raw strings。
* 新增: IDE 中的 Statement folding。
* 新增: Boolean types 現在會自動處理。
* 修正: 從程式碼生成中移除 deprecated marshals。
* 修正: 正確的 'avg' SQL function type mapping 為 REAL。
* 修正: 正確偵測 'julianday' SQL function。

## [0.6.1] - 2017-03-22
[0.6.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.1

* 新增: Delete Update 和 Insert statements without arguments will get compiled statements generated。
* 修正: Subquery 中使用的 View 中的 Using clause 不會出錯。
* 修正: 移除 generated Mapper 上的 Duplicate types。
* 修正: Subqueries 可以用於檢查 arguments 的 expressions 中。

## [0.6.0] - 2017-03-06
[0.6.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.0

* 新增: Select queries 現在作為 `SqlDelightStatement` factory 而不是 string constants 公開。
* 新增: Query JavaDoc 現在會複製到 statement 和 mapper factories。
* 新增: 為 view names 發出 string constants。
* 修正: 對於 requiring factories 的 View 上的 Queries 現在會正確地要求這些 factories 作為 arguments。
* 修正: Validate the number of arguments to an insert matches the number of columns specified。
* 修正: Properly encode blob literals used in where clauses。
* 此版本需要 Gradle 3.3 或更高版本。

## [0.5.1] - 2016-10-24
[0.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.1

* 新增: Compiled statements extend an abstract type。
* 修正: Primitive types in parameters will be boxed if nullable。
* 修正: Factory method 中存在所有 required factories for bind args。
* 修正: Escaped column names are marshalled correctly。

## [0.5.0] - 2016-10-19
[0.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.0

* 新增: SQLite arguments 可以透過 Factory 進行 type-safely 傳遞
* 新增: IntelliJ 外掛程式對 .sq 檔案執行格式化
* 新增: 支援 SQLite timestamp literals
* 修正: Parameterized types 可以在 IntelliJ 中點擊
* 修正: Escaped column names no longer throw RuntimeExceptions if grabbed from Cursor。
* 修正: Gradle 外掛程式不會在嘗試印出 exceptions 時崩潰。

## [0.4.4] - 2016-07-20
[0.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.4

* 新增: Native support for shorts as column java type
* 新增: Generated mappers 和 factory methods 上的 Javadoc
* 修正: group_concat 和 nullif functions 具有 proper nullability
* 修正: Compatibility with Android Studio 2.2-alpha
* 修正: WITH RECURSIVE no longer crashes plugin

## [0.4.3] - 2016-07-07
[0.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.3

* 新增: Compilation errors link to source file。
* 新增: 右鍵複製 SQLDelight 程式碼作為有效的 SQLite。
* 新增: Named statements 上的 Javadoc 將會出現在 generated Strings 上。
* 修正: Generated view models include nullability annotations。
* 修正: Unions 生成的程式碼具有 proper type 和 nullability 以支援所有可能的 columns。
* 修正: sum 和 round SQLite functions 具有 generated code 中的 proper type。
* 修正: CAST's、inner selects bugfixes。
* 修正: CREATE TABLE statements 中的 Autocomplete。
* 修正: SQLite keywords 可以用於 packages。

## [0.4.2] - 2016-06-16
[0.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.2

* 新增: Marshal 可以從 Factory 建立。
* 修正: IntelliJ 外掛程式生成具有 proper generic order 的 factory methods。
* 修正: Function names 可以使用任何 casing。

## [0.4.1] - 2016-06-14
[0.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.1

* 修正: IntelliJ 外掛程式生成具有 proper generic order 的 classes。
* 修正: Column definitions 可以使用任何 casing。

## [0.4.0] - 2016-06-14
[0.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.0

* 新增: Mappers 是根據每個 query 而非每個 table 生成的。
* 新增: Java types 可以在 .sq 檔案中匯入。
* 新增: SQLite functions 經過驗證。
* 修正: 移除 duplicate errors。
* 修正: Uppercase column names 和 java keyword column names 不會出錯。

## [0.3.2] - 2016-05-14
[0.3.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.2

* 新增: Autocompletion 和 find usages 現在適用於 views 和 aliases。
* 修正: Compile-time validation 現在允許 functions 用於 selects。
* 修正: 支援僅聲明 default values 的 insert statements。
* 修正: 當未使用的專案匯入時，外掛程式不再崩潰。

## [0.3.1] - 2016-04-27
[0.3.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.1

* 修正: 介面可見性改回 public，以避免 method references 引起的 Illegal Access runtime exceptions。
* 修正: Subexpressions 得到正確評估。

## [0.3.0] - 2016-04-26
[0.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.0

* 新增: Column definitions 使用 SQLite types，並可額外加上 'AS' constraint 以指定 java type。
* 新增: Bug reports 可以從 IDE 發送。
* 修正: Autocomplete functions properly。
* 修正: SQLDelight model files update on .sq file edit。
* 移除: Attached databases 不再支援。

## [0.2.2] - 2016-03-07
[0.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.2

* 新增: Compile-time validation of the columns used by insert, update, delete, index, and trigger statements。
* 修正: Don't crash IDE plugin on file move/create。

## [0.2.1] - 2016-03-07
[0.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.1

* 新增: Ctrl+`/` (OSX 上為 Cmd+`/`) 切換 selected line(s) 的註釋。
* 新增: Compile-time validation of the columns used by SQL queries。
* 修正: 支援 IDE 和 Gradle 外掛程式中的 Windows paths。

## [0.2.0] - 2016-02-29
[0.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.0

* 新增: Marshal 類別新增 copy constructor。
* 新增: 更新至 Kotlin 1.0 final。
* 修正: 以非失敗方式報告 'sqldelight' folder structure problems。
* 修正: Forbid columns named `table_name`。其 generated constant 與 table name constant 衝突。
* 修正: 確保 IDE 外掛程式立即生成 model classes，無論 .sq 檔案是否開啟。
* 修正: 支援 IDE 和 Gradle 外掛程式中的 Windows paths。

## [0.1.2] - 2016-02-13
[0.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.2

* 修正: 移除阻止 Gradle 外掛程式在大多數專案中使用的程式碼。
* 修正: 新增 missing compiler dependency on the Antlr runtime。

## [0.1.1] - 2016-02-12
[0.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.1

* 修正: 確保 Gradle 外掛程式指向與其本身相同版本的 runtime。

## [0.1.0] - 2016-02-12
[0.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.0

初始發布。