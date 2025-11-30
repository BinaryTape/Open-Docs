# 變更日誌

## 未發布

### 新增
- [Gradle 外掛程式] 修正當起始 Schema 版本不是 1 且 verifyMigrations 為 true 時建構失敗的問題 (#6017 by @neilgmiller)
- [Gradle 外掛程式] 使 `SqlDelightWorkerTask` 更具可配置性，並更新預設配置以支援在 Windows 上開發 (#5215 by @MSDarwish2000)
- [SQLite 變體] 新增對 FTS5 虛擬表格中合成欄位的支援 (#5986 by @watbe)

### 變更
- [編譯器] 允許套件名稱中使用底線。之前底線被淨化，導致了非預期的行為 (#6027 by @BierDav)

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
- [PostgreSQL 變體] 新增對 Postgres 觸發器的有限支援 (#5932 by @griffio)
- [PostgreSQL 變體] 新增判斷式以檢查 SQL 表達式是否可解析為 JSON (#5843 by @griffio)
- [PostgreSQL 變體] 新增對 PostgreSql Comment On 陳述式的有限支援 (#5808 by @griffio)
- [MySQL 變體] 新增對索引可見性選項的支援 (#5785 by @orenkislev-faire)
- [PostgreSql 變體] 新增對 TSQUERY 資料型別的支援 (#5779 by @griffio)
- [Gradle 外掛程式] 新增支援版本目錄以新增模組 (#5755 by @DRSchlaubi)

### 變更
- 開發中快照版本現已發布到 https://central.sonatype.com/repository/maven-snapshots/ 的 Central Portal Snapshots 儲存庫。
- [編譯器] 使用建構函式參照簡化預設生成的查詢 (#5814 by @jonapoul)

### 修正
- [編譯器] 修正使用包含共同表格表達式 (Common Table Expression) 的視圖時的堆疊溢位 (#5928 by @griffio)
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
- [WASM 驅動程式] 新增 Web Worker 驅動程式對 wasmJs 的支援 (#5534 by @IlyaGulya)
- [PostgreSQL 變體] 支援 PostgreSql 將陣列解除巢狀為列 (#5673 by @griffio)
- [PostgreSQL 變體] PostgreSql TSRANGE/TSTZRANGE 支援 (#5297 by @griffio)
- [PostgreSQL 變體] PostgreSql 右全連接 (Right Full Join) (#5086 by @griffio)
- [PostgreSQL 變體] Postrgesql 從時間型別中提取 (#5273 by @griffio)
- [PostgreSQL 變體] PostgreSql 陣列包含運算子 (#4933 by @griffio)
- [PostgreSQL 變體] PostgreSql 移除約束 (#5288 by @griffio)
- [PostgreSQL 變體] Postgresql 型別轉換 (#5089 by @griffio)
- [PostgreSQL 變體] PostgreSql 子查詢的側向連接運算子 (#5122 by @griffio)
- [PostgreSQL 變體] Postgresql ILIKE 運算子 (#5330 by @griffio)
- [PostgreSQL 變體] PostgreSql XML 型別 (#5331 by @griffio)
- [PostgreSQL 變體] PostgreSql AT TIME ZONE (#5243 by @griffio)
- [PostgreSQL 變體] 支援 postgresql 依空值排序 (#5199 by @griffio)
- [PostgreSQL 變體] 新增 PostgreSQL 當前日期/時間函式支援 (#5226 by @drewd)
- [PostgreSQL 變體] PostgreSql Regex 運算子 (#5137 by @griffio)
- [PostgreSQL 變體] 新增 BRIN GIST (#5059 by @griffio)
- [MySQL 變體] 支援 MySQL 變體的 RENAME INDEX (#5212 by @orenkislev-faire)
- [JSON 擴充功能] 為 JSON 表格函式新增別名 (#5372 by @griffio)

### 變更
- [編譯器] 生成的查詢檔案為簡單的變更器 (mutators) 返回行數 (#4578 by @MariusVolkhart)
- [原生驅動程式] 更新 NativeSqlDatabase.kt 以變更 DELETE、INSERT 和 UPDATE 陳述式的唯讀標誌 (#5680 by @griffio)
- [PostgreSQL 變體] 將 PgInterval 變更為 String (#5403 by @griffio)
- [PostgreSQL 變體] 支援 SqlDelight 模組以實作 PostgreSql 擴充功能 (#5677 by @griffio)

### 修正
- [編譯器] 修正：執行帶有結果的群組陳述式 (group statements) 時通知查詢 (#5006 by @vitorhugods)
- [編譯器] 修正 SqlDelightModule 型別解析器 (#5625 by @griffio)
- [編譯器] 修正 5501 插入物件的轉義欄位 (escaped column) (#5503 by @griffio)
- [編譯器] 編譯器：改善錯誤訊息，使路徑連結可點擊並顯示正確的行號和字元位置。 (#5604 by @vanniktech)
- [編譯器] 修正問題 5298：允許關鍵字作為表格名稱
- [編譯器] 修正具名執行並新增測試
- [編譯器] 在排序初始化陳述式時考慮外部鍵表格約束 (#5325 by @TheMrMilchmann)
- [編譯器] 當涉及 Tab 時正確對齊錯誤下劃線 (#5224 by @drewd)
- [JDBC 驅動程式] 修正 connectionManager 在交易結束時的記憶體洩漏
- [JDBC 驅動程式] 按照文件中所述在交易中執行 SQLite 遷移 (#5218 by @morki)
- [JDBC 驅動程式] 修正交易提交/回滾後連接洩漏問題 (#5205 by @morki)
- [Gradle 外掛程式] 執行 `DriverInitializer` 之前 `GenerateSchemaTask` (#5562 by @nwagu)
- [執行期] 修正 LogSqliteDriver 在實際驅動程式為非同步 (Async) 時的崩潰問題 (#5723 by @edenman)
- [執行期] 修正 StringBuilder 容量 (#5192 by @janbina)
- [PostgreSQL 變體] PostgreSql 建立或替換視圖 (#5407 by @griffio)
- [PostgreSQL 變體] Postgresql to_json (#5606 by @griffio)
- [PostgreSQL 變體] PostgreSql 數值解析器 (#5399 by @griffio)
- [PostgreSQL 變體] sqlite 視窗函式 (#2799 by @griffio)
- [PostgreSQL 變體] PostgreSql SELECT DISTINCT ON (#5345 by @griffio)
- [PostgreSQL 變體] 變更表格，如果欄位不存在則新增 (#5309 by @griffio)
- [PostgreSQL 變體] Postgresql 非同步綁定參數 (#5313 by @griffio)
- [PostgreSQL 變體] PostgreSql 布林字面量 (#5262 by @griffio)
- [PostgreSQL 變體] PostgreSql 視窗函式 (#5155 by @griffio)
- [PostgreSQL 變體] PostgreSql isNull isNotNull 型別 (#5173 by @griffio)
- [PostgreSQL 變體] PostgreSql select distinct (#5172 by @griffio)
- [分頁擴充功能] 分頁重新整理初始載入修正 (#5615 by @evant)
- [分頁擴充功能] 新增 MacOS 原生目標 (#5324 by @vitorhugods)
- [IntelliJ 外掛程式] K2 支援

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 新增
- [PostgreSQL 變體] 新增 PostgreSQL STRING_AGG 函式 (#4950 by @anddani)
- [PostgreSQL 變體] 新增 SET 陳述式到 pg 變體 (#4927 by @de-luca)
- [PostgreSQL 變體] 新增 PostgreSql 變更欄位序列參數 (#4916 by @griffio)
- [PostgreSQL 變體] 新增 postgresql 變更欄位預設支援用於 INSERT 陳述式 (#4912 by @griffio)
- [PostgreSQL 變體] 新增 PostgreSql 變更序列和移除序列 (#4920 by @griffio)
- [PostgreSQL 變體] 新增 Postgres Regex 函式定義 (#5025 by @MariusVolkhart)
- [PostgreSQL 變體] 新增 GIN 的語法 (#5027 by @griffio)

### 變更
- [IDE 外掛程式] 最低版本為 2023.1 / Android Studio Iguana
- [編譯器] 允許覆寫 encapsulatingType 中的型別空值性 (#4882 by @eygraber)
- [編譯器] SELECT * 內聯欄位名稱
- [Gradle 外掛程式] 切換到 processIsolation (#5068 by @nwagu)
- [Android 執行期] 將 Android minSDK 提高到 21 (#5094 by @hfhbd)
- [驅動程式] 為變體作者公開更多 JDBC/R2DBC 陳述式方法 (#5098 by @hfhbd)

### 修正
- [PostgreSQL 變體] 修正 postgresql 變更表格變更欄位 (#4868 by @griffio)
- [PostgreSQL 變體] 修正 4448 表格模型缺少匯入 (#4885 by @griffio)
- [PostgreSQL 變體] 修正 4932 postgresql 預設約束函式 (#4934 by @griffio)
- [PostgreSQL 變體] 修正 4879 postgresql 在遷移期間變更表格重新命名欄位時的類別轉換錯誤 (#4880 by @griffio)
- [PostgreSQL 變體] 修正 4474 PostgreSql 建立擴充功能 (#4541 by @griffio)
- [PostgreSQL 變體] 修正 5018 PostgreSql 新增主鍵非空值型別 (#5020 by @griffio)
- [PostgreSQL 變體] 修正 4703 聚合表達式 (#5071 by @griffio)
- [PostgreSQL 變體] 修正 5028 PostgreSql json (#5030 by @griffio)
- [PostgreSQL 變體] 修正 5040 PostgreSql json 運算子 (#5041 by @griffio)
- [PostgreSQL 變體] 修正 5040 的 json 運算子綁定 (#5100 by @griffio)
- [PostgreSQL 變體] 修正 5082 tsvector (#5104 by @griffio)
- [PostgreSQL 變體] 修正 5032 欄位鄰接用於 PostgreSql UPDATE FROM 陳述式 (#5035 by @griffio)
- [SQLite 變體] 修正 4897 sqlite 變更表格重新命名欄位 (#4899 by @griffio)
- [IDE 外掛程式] 修正錯誤處理程式崩潰 (#4988 by @aperfilyev)
- [IDE 外掛程式] BugSnag 在 IDEA 2023.3 中初始化失敗 (by @aperfilyev)
- [IDE 外掛程式] 在 IntelliJ 中透過外掛程式開啟 .sq 檔案時發生 PluginException (by @aperfilyev)
- [IDE 外掛程式] 不要將 Kotlin 函式庫捆綁到 IntelliJ 外掛程式中，因為它已經是外掛程式的依賴項 (#5126)
- [IDE 外掛程式] 使用擴充功能陣列而不是串流 (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 新增
- [編譯器] 在執行 SELECT 時新增對多欄位表達式 (multi-column-expr) 的支援 (#4453 by @Adriel-M)
- [PostgreSQL 變體] 新增對 PostgreSQL CREATE INDEX CONCURRENTLY 的支援 (#4531 by @griffio)
- [PostgreSQL 變體] 允許 PostgreSQL CTEs 輔助陳述式相互參照 (#4493 by @griffio)
- [PostgreSQL 變體] 新增對 PostgreSQL 二進位表達式和求和型別的支援 (#4539 by @Adriel-M)
- [PostgreSQL 變體] 新增對 PostgreSQL SELECT DISTINCT ON 語法的支援 (#4584 by @griffio)
- [PostgreSQL 變體] 新增對 PostgreSQL JSON 函式在 SELECT 陳述式中的支援 (#4590 by @MariusVolkhart)
- [PostgreSQL 變體] 新增 generate_series PostgreSQL 函式 (#4717 by @griffio)
- [PostgreSQL 變體] 新增額外的 Postgres 字串函式定義 (#4752 by @MariusVolkhart)
- [PostgreSQL 變體] 將 DATE PostgreSQL 型別新增到 min 和 max 聚合函式 (#4816 by @anddani)
- [PostgreSQL 變體] 將 PostgreSql 時間型別新增到 SqlBinaryExpr (#4657 by @griffio)
- [PostgreSQL 變體] 新增 TRUNCATE 到 postgres 變體 (#4817 by @de-luca)
- [SQLite 3.35 變體] 允許依序評估多個 ON CONFLICT 子句 (#4551 by @griffio)
- [JDBC 驅動程式] 新增語言註釋以實現更愉快的 SQL 編輯 (#4602 by @MariusVolkhart)
- [原生驅動程式] 原生驅動程式：新增對 linuxArm64 的支援 (#4792 by @hfhbd)
- [Android 驅動程式] 為 AndroidSqliteDriver 新增 `windowSizeBytes` 參數 (#4804 by @BoD)
- [Paging3 擴充功能] 功能：為 OffsetQueryPagingSource 新增 `initialOffset` (#4802 by @MohamadJaara)

### 變更
- [編譯器] 在適當情況下優先使用 Kotlin 型別 (#4517 by @eygraber)
- [編譯器] 執行值型別插入時始終包含欄位名稱 (#4864)
- [PostgreSQL 變體] 移除 PostgreSQL 變體的實驗性狀態 (#4443 by @hfhbd)
- [PostgreSQL 變體] 更新 PostgreSQL 型別的文件 (#4569 by @MariusVolkhart)
- [R2DBC 驅動程式] 優化 PostgreSQL 中處理整數資料型別的效能 (#4588 by @MariusVolkhart)

### 移除
- [SQLite Javascript 驅動程式] 移除 sqljs-driver (#4613, #4670 by @dellisd)

### 修正
- [編譯器] 修正帶有返回且無參數的群組陳述式編譯 (#4699 by @griffio)
- [編譯器] 使用 SqlBinaryExpr 綁定引數 (#4604 by @griffio)
- [IDE 外掛程式] 如果設定了 IDEA 專案 JDK 則使用它 (#4689 by @griffio)
- [IDE 外掛程式] 修正 IDEA 2023.2 及更高版本中的「未知元素型別：TYPE_NAME」錯誤 (#4727)
- [IDE 外掛程式] 修正了與 2023.2 的一些相容性問題
- [Gradle 外掛程式] 更正 verifyMigrationTask Gradle 任務的文件 (#4713 by @joshfriend)
- [Gradle 外掛程式] 新增 Gradle 任務輸出訊息以幫助使用者在驗證資料庫之前生成資料庫 (#4684 by @jingwei99)
- [PostgreSQL 變體] 修正 PostgreSQL 欄位多次重新命名問題 (#4566 by @griffio)
- [PostgreSQL 變體] 修正 4714 postgresql 變更欄位空值性 (#4831 by @griffio)
- [PostgreSQL 變體] 修正 4837 變更表格變更欄位 (#4846 by @griffio)
- [PostgreSQL 變體] 修正 4501 PostgreSql 序列 (#4528 by @griffio)
- [SQLite 變體] 允許 JSON 二進位運算子用於欄位表達式 (#4776 by @eygraber)
- [SQLite 變體] Update From 因名稱找到多個欄位而導致的誤報 (#4777 by @eygraber)
- [原生驅動程式] 支援具名記憶體內資料庫 (#4662 by @05nelsonm)
- [原生驅動程式] 確保查詢監聽器集合的執行緒安全 (#4567 by @kpgalligan)
- [JDBC 驅動程式] 修正 ConnectionManager 中的連接洩漏 (#4589 by @MariusVolkhart)
- [JDBC 驅動程式] 修正 JdbcSqliteDriver url 解析在選擇 ConnectionManager 型別時的問題 (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 新增
- [MySQL 變體] MySQL：在 IF 表達式中支援 timestamp/bigint (#4329 by @shellderp)
- [MySQL 變體] MySQL：新增 now (#4431 by @hfhbd)
- [Web 驅動程式] 啟用 NPM 套件發布 (#4364)
- [IDE 外掛程式] 允許使用者在 Gradle 工具連接失敗時顯示堆疊追蹤 (#4383)

### 變更
- [Sqlite 驅動程式] 簡化 JdbcSqliteDriver 使用 Schema 遷移的方式 (#3737 by @morki)
- [R2DBC 驅動程式] 真正的非同步 R2DBC 游標 (#4387 by @hfhbd)

### 修正
- [IDE 外掛程式] 只有在需要時才實例化資料庫專案服務 (#4382)
- [IDE 外掛程式] 處理尋找使用過程中的程序取消 (#4340)
- [IDE 外掛程式] 修正 IDE 生成非同步程式碼的問題 (#4406)
- [IDE 外掛程式] 將套件結構的組裝移動到一次性計算並脫離 EDT (#4417)
- [IDE 外掛程式] 在 2023.2 上使用正確的 Stub 索引鍵進行 Kotlin 型別解析 (#4416)
- [IDE 外掛程式] 等待索引準備好後再執行搜尋 (#4419)
- [IDE 外掛程式] 如果索引不可用，則不要執行 GoTo (#4420)
- [編譯器] 修正群組陳述式的結果表達式 (#4378)
- [編譯器] 不要使用虛擬表格作為介面型別 (#4427 by @hfhbd)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 新增
- [MySQL 變體] 支援小寫日期型別以及日期型別上的 min 和 max (#4243 by @shellderp)
- [MySQL 變體] 支援二進位表達式和求和的 mysql 型別 (#4254 by @shellderp)
- [MySQL 變體] 支援不帶顯示寬度的無符號整數 (#4306 by @shellderp)
- [MySQL 變體] 支援 LOCK IN SHARED MODE
- [PostgreSQL 變體] 新增布林和 Timestamp 到 min max (#4245 by @griffio)
- [PostgreSQL 變體] Postgres：新增視窗函式支援 (#4283 by @hfhbd)
- [執行期] 為執行期新增 `linuxArm64`、`androidNative` 和 `watchosDeviceArm` 目標 (#4258 by @hfhbd)
- [分頁擴充功能] 為分頁擴充功能新增 linux 和 mingw x64 目標 (#4280 by @chippman)

### 變更
- [Gradle 外掛程式] 新增 Android API 34 的自動變體支援 (#4251)
- [分頁擴充功能] 為 QueryPagingSource 新增 SuspendingTransacter 支援 (#4292 by @daio)
- [執行期] 改善 addListener API (#4244 by @hfhbd)
- [執行期] 使用 Long 作為遷移版本 (#4297 by @hfhbd)

### 修正
- [Gradle 外掛程式] 為生成源使用穩定輸出路徑 (#4269 by @joshfriend)
- [Gradle 外掛程式] Gradle 微調 (#4222 by @3flex)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 新增
- [分頁] 為分頁擴充功能新增 js 瀏覽器目標 (#3843 by @sproctor)
- [分頁] 為 androidx-paging3 擴充功能新增 iosSimulatorArm64 目標 (#4117)
- [PostgreSQL 變體] 新增對 gen_random_uuid() 的支援和測試 (#3855 by @davidwheeler123)
- [PostgreSQL 變體] 變更表格新增約束 postgres (#4116 by @griffio)
- [PostgreSQL 變體] 變更表格新增約束檢查 (#4120 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql 字元長度函式 (#4121 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql 欄位預設間隔 (#4142 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql 間隔欄位結果 (#4152 by @griffio)
- [PostgreSQL 變體] 新增 postgreSql 變更欄位 (#4165 by @griffio)
- [PostgreSQL 變體] PostgreSQL：新增 date_part (#4198 by @hfhbd)
- [MySQL 變體] 新增 sql 字元長度函式 (#4134 by @griffio)
- [IDE 外掛程式] 新增 sqldelight 目錄建議 (#3976 by @aperfilyev)
- [IDE 外掛程式] 在專案樹中壓縮中間套件 (#3992 by @aperfilyev)
- [IDE 外掛程式] 新增連接子句補全 (#4086 by @aperfilyev)
- [IDE 外掛程式] 建立視圖意圖和即時範本 (#4074 by @aperfilyev)
- [IDE 外掛程式] 警告 DELETE 或 UPDATE 內缺少 WHERE (#4058 by @aperfilyev)
- [Gradle 外掛程式] 啟用型別安全專案存取器 (#4005 by @hfhbd)

### 變更
- [Gradle 外掛程式] 允許使用 ServiceLoader 機制註冊 VerifyMigrationTask 的 DriverInitializer (#3986 by @C2H6O)
- [Gradle 外掛程式] 建立顯式編譯器環境 (#4079 by @hfhbd)
- [JS 驅動程式] 將 Web Worker 驅動程式拆分為獨立的 Artifact
- [JS 驅動程式] 不要公開 JsWorkerSqlCursor (#3874 by @hfhbd)
- [JS 驅動程式] 禁用 sqljs 驅動程式的發布 (#4108)
- [執行期] 強制同步驅動程式需要同步 Schema 初始化器 (#4013)
- [執行期] 改善 Cursors 的非同步支援 (#4102)
- [執行期] 移除已棄用目標 (#4149 by @hfhbd)
- [執行期] 移除對舊 MM 的支援 (#4148 by @hfhbd)

### 修正
- [R2DBC 驅動程式] R2DBC：等待關閉驅動程式 (#4139 by @hfhbd)
- [編譯器] 在資料庫建立 (SqlDriver) 中包含來自遷移的 PRAGMAs (#3845 by @MariusVolkhart)
- [編譯器] 修正 RETURNING 子句的程式碼生成 (#3872 by @MariusVolkhart)
- [編譯器] 不要為虛擬表格生成型別 (#4015)
- [Gradle 外掛程式] Gradle 外掛程式的一些品質改善 (#3930 by @zacsweers)
- [IDE 外掛程式] 修正未解析的 Kotlin 型別 (#3924 by @aperfilyev)
- [IDE 外掛程式] 修正展開萬用字元意圖以適用於限定符 (#3979 by @aperfilyev)
- [IDE 外掛程式] 如果 Java Home 缺失，則使用可用的 JDK (#3925 by @aperfilyev)
- [IDE 外掛程式] 修正套件名稱上的尋找使用 (#4010)
- [IDE 外掛程式] 不要為無效元素顯示自動匯入 (#4008)
- [IDE 外掛程式] 如果缺少變體，則不解析 (#4009)
- [IDE 外掛程式] 在無效狀態期間忽略 IDE 執行編譯器 (#4016)
- [IDE 外掛程式] 新增對 IntelliJ 2023.1 的支援 (#4037 by @madisp)
- [IDE 外掛程式] 在欄位重新命名時重新命名具名引數使用 (#4027 by @aperfilyev)
- [IDE 外掛程式] 修正新增遷移彈出視窗 (#4105 by @aperfilyev)
- [IDE 外掛程式] 在遷移檔案中禁用 SchemaNeedsMigrationInspection (#4106 by @aperfilyev)
- [IDE 外掛程式] 使用 sql 欄位名稱進行遷移生成而不是型別名稱 (#4112 by @aperfilyev)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 新增
- [分頁] 多平台分頁擴充功能 (by @jeffdgr8)
- [執行期] 為 Listener 介面新增 `fun` 修飾符。
- [SQLite 變體] 新增 SQLite 3.33 支援 (UPDATE FROM) (by @eygraber)
- [PostgreSQL 變體] 支援 PostgreSQL 中的 UPDATE FROM (by @eygraber)

### 變更
- [RDBC 驅動程式] 公開連接 (by @hfhbd)
- [執行期] 將遷移回調移動到主要的 `migrate` 函式中
- [Gradle 外掛程式] 向下游專案隱藏 Configuration
- [Gradle 外掛程式] 僅遮蔽 Intellij (by @hfhbd)
- [Gradle 外掛程式] 支援 Kotlin 1.8.0-Beta 並新增多版本 Kotlin 測試 (by @hfhbd)

### 修正
- [RDBC 驅動程式] 改用 javaObjectType (by @hfhbd)
- [RDBC 驅動程式] 修正 `bindStatement` 中的原始空值 (primitive null values) (by @hfhbd)
- [RDBC 驅動程式] 支援 R2DBC 1.0 (by @hfhbd)
- [PostgreSQL 變體] Postgres：修正沒有型別參數的陣列 (Array without type parameter) (by @hfhbd)
- [IDE 外掛程式] 將 Intellij 版本提升到 221.6008.13 (by @hfhbd)
- [編譯器] 從純視圖解析遞迴起源表 (recursive origin table) (by @hfhbd)
- [編譯器] 從表格外部鍵子句 (foreign key clause) 使用值類別 (value classes) (by @hfhbd)
- [編譯器] 修正 SelectQueryGenerator 以支援沒有圓括號的綁定表達式 (bind expression) (#3780 by @bellatoris)
- [編譯器] 修正使用交易時重複生成 `${name}Indexes` 變數的問題 (by @sachera)

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
- [HSQL 變體] Hsql：支援在 Insert 中使用 `DEFAULT` 作為生成欄位 (#3372 by @hfhbd)
- [PostgreSQL 變體] PostgreSQL：支援在 INSERT 中使用 `DEFAULT` 作為生成欄位 (#3373 by @hfhbd)
- [PostgreSQL 變體] 新增 NOW() 到 PostgreSQL (#3403 by @hfhbd)
- [PostgreSQL 變體] PostgreSQL 新增 NOT 運算子 (#3504 by @hfhbd)
- [分頁] 允許將 CoroutineContext 傳入 *QueryPagingSource (#3384)
- [Gradle 外掛程式] 新增更好的版本目錄支援變體 (#3435)
- [原生驅動程式] 新增回調以掛鉤 NativeSqliteDriver 的 DatabaseConfiguration 建立 (#3512 by @svenjacobs)

### 變更
- [分頁] 為 KeyedQueryPagingSource 支援的 QueryPagingSource 函式新增預設 Dispatcher (#3385)
- [分頁] 使 OffsetQueryPagingSource 僅適用於 Int 型別 (#3386)
- [非同步執行期] 將 `await*` 移動到上層類別 ExecutableQuery (#3524 by @hfhbd)
- [Coroutines 擴充功能] 移除 Flow 擴充功能的預設參數 (#3489)

### 修正
- [Gradle 外掛程式] 更新至 Kotlin 1.7.20 (#3542 by @zacsweers)
- [R2DBC 驅動程式] 採用 R2DBC 變更，不總是發送值 (#3525 by @hfhbd)
- [HSQL 變體] 修正 Hsql 導致 SQLite `VerifyMigrationTask` 失敗的問題 (#3380 by @hfhbd)
- [Gradle 外掛程式] 將任務轉換為使用 Gradle 的漸進式配置 API (by @3flex)
- [Gradle 外掛程式] 避免 Kotlin 1.7.20 中的 NPE (#3398 by @ZacSweers)
- [Gradle 外掛程式] 修正 squash migrations 任務的描述 (#3449)
- [IDE 外掛程式] 修正較新 Kotlin 外掛程式中的 NoSuchFieldError (#3422 by @madisp)
- [IDE 外掛程式] IDEA: UnusedQueryInspection - 修正 ArrayIndexOutOfBoundsException。 (#3427 by @vanniktech)
- [IDE 外掛程式] 對舊 Kotlin 外掛程式參考使用反射
- [編譯器] 帶有擴充功能函式的自定義變體不建立匯入 (#3338 by @hfhbd)
- [編譯器] 修正 CodeBlock.of("${CodeBlock.toString()}") 的轉義問題 (#3340 by @hfhbd)
- [編譯器] 在遷移中等待非同步執行陳述式 (#3352)
- [編譯器] 修正 AS (#3370 by @hfhbd)
- [編譯器] `getObject` 方法支援自動填寫實際型別。 (#3401 by @robxyy)
- [編譯器] 修正非同步群組返回陳述式的程式碼生成 (#3411)
- [編譯器] 如果可能，推斷綁定參數的 Kotlin 型別，否則會出現更好的錯誤訊息 (#3413 by @hfhbd)
- [編譯器] 不允許 ABS("foo") (#3430 by @hfhbd)
- [編譯器] 支援從其他參數推斷 Kotlin 型別 (#3431 by @hfhbd)
- [編譯器] 始終建立資料庫實作 (#3540 by @hfhbd)
- [編譯器] 放鬆 Javadoc 並將其新增到自定義 mapper 函式中 (#3554 @hfhbd)
- [編譯器] 修正綁定中的 DEFAULT (by @hfhbd)
- [分頁] 修正 Paging 3 (#3396)
- [分頁] 允許使用 Long 建構 OffsetQueryPagingSource (#3409)
- [分頁] 不要靜態交換 Dispatchers.Main (#3428)

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
- [執行期] 新增對非同步驅動程式的支援 (#3168 by @dellisd)
- [原生驅動程式] 支援新的 Kotlin 原生記憶體模型 (#3177 by @kpgalligan)
- [JS 驅動程式] 新增 SqlJs Worker 的驅動程式 (#32