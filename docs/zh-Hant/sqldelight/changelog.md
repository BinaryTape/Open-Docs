# 變更日誌

## 未發布

- [SQLite 方言] 修正 Sqlite 3.18 缺少函式 (#5759 by [Griffio][griffio])
- [Gradle 外掛程式] 新增支援版本目錄以新增模組 (#5755 by [Michael Rittmeister][DRSchlaubi])

## [2.1.0] - 2025-05-16

### 新增
- [WASM 驅動程式] 新增 Web Worker 驅動程式對 wasmJs 的支援 (#5534 by [Ilya Gulya][IlyaGulya])
- [PostgreSQL 方言] 支援 PostgreSQL 將陣列解除巢狀為列 (#5673 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL TSRANGE/TSTZRANGE 支援 (#5297 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 右全連接 (Right Full Join) (#5086 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 從時間類型中提取 (#5273 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 陣列包含運算子 (#4933 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 移除約束 (#5288 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 型別轉換 (#5089 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 子查詢的側向連接運算子 (#5122 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL ILIKE 運算子 (#5330 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL XML 型別 (#5331 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL AT TIME ZONE (#5243 by [Griffio][griffio])
- [PostgreSQL 方言] 支援 PostgreSQL 依空值排序 (#5199 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL 當前日期/時間函式支援 (#5226 by [Drew Dobson][drewd])
- [PostgreSQL 方言] PostgreSQL Regex 運算子 (#5137 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 BRIN GIST 索引 (#5059 by [Griffio][griffio])
- [MySQL 方言] 支援 MySQL 方言的 RENAME INDEX (#5212 by [Oren Kislev][orenkislev-faire])
- [JSON 擴充功能] 為 JSON 表格函式新增別名 (#5372 by [Griffio][griffio])

### 變更
- [編譯器] 生成的查詢檔案為簡單的變更器 (mutators) 返回行數 (#4578 by [Marius Volkhart][MariusV])
- [原生驅動程式] 更新 NativeSqlDatabase.kt 以變更 DELETE、INSERT 和 UPDATE 陳述式的唯讀標誌 (#5680 by [Griffio][griffio])
- [PostgreSQL 方言] 將 PgInterval 變更為 String (#5403 by [Griffio][griffio])
- [PostgreSQL 方言] 支援 SqlDelight 模組以實作 PostgreSQL 擴充功能 (#5677 by [Griffio][griffio])

### 修正
- [編譯器] 修正：執行帶有結果的群組陳述式 (group statements) 時通知查詢 (#5006 by [Vitor Hugo Schwaab][vitorhugods])
- [編譯器] 修正 SqlDelightModule 型別解析器 (#5625 by [Griffio][griffio])
- [編譯器] 修正 5501 插入物件的轉義欄位 (escaped column) (#5503 by [Griffio][griffio])
- [編譯器] 編譯器：改善錯誤訊息，使路徑連結可點擊並顯示正確的行號和字元位置 (#5604 by [Niklas Baudy][vanniktech])
- [編譯器] 修正問題 5298：允許關鍵字作為表格名稱
- [編譯器] 修正具名執行並新增測試
- [編譯器] 在排序初始化陳述式時考慮外部鍵表格約束 (#5325 by [Leon Linhart][TheMrMilchmann])
- [編譯器] 當涉及 Tab 時正確對齊錯誤下劃線 (#5224 by [Drew Dobson][drewd])
- [JDBC 驅動程式] 修正 connectionManager 在交易結束時的記憶體洩漏
- [JDBC 驅動程式] 按照文件中所述在交易中執行 SQLite 遷移 (#5218 by [Lukáš Moravec][morki])
- [JDBC 驅動程式] 修正交易提交/回滾後連接洩漏問題 (#5205 by [Lukáš Moravec][morki])
- [Gradle 外掛程式] 在 `GenerateSchemaTask` 之前執行 `DriverInitializer` (#5562 by [Emeka Nwagu][nwagu])
- [執行期] 修正 LogSqliteDriver 在實際驅動程式為非同步 (Async) 時的崩潰問題 (#5723 by [Eric Denman][edenman])
- [執行期] 修正 StringBuilder 容量問題 (#5192 by [Jan Bína][janbina])
- [PostgreSQL 方言] PostgreSQL 建立或替換視圖 (#5407 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL to_json (#5606 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 數值解析器 (#5399 by [Griffio][griffio])
- [PostgreSQL 方言] SQLite 視窗函式 (#2799 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL SELECT DISTINCT ON (#5345 by [Griffio][griffio])
- [PostgreSQL 方言] 變更表格，如果欄位不存在則新增 (#5309 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 非同步綁定參數 (#5313 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 布林字面量 (#5262 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 視窗函式 (#5155 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL isNull isNotNull 型別 (#5173 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL SELECT DISTINCT (#5172 by [Griffio][griffio])
- [分頁擴充功能] 分頁刷新初始載入修正 (#5615 by [Eva][evant])
- [分頁擴充功能] 新增 MacOS 原生目標 (#5324 by [Vitor Hugo Schwaab][vitorhugods])
- [IntelliJ 外掛程式] K2 支援

## [2.0.2] - 2024-04-05

### 新增
- [PostgreSQL 方言] 新增 PostgreSQL STRING_AGG 函式 (#4950 by [André Danielsson][anddani])
- [PostgreSQL 方言] 新增 SET 陳述式到 PostgreSQL 方言 (#4927 by [Bastien de Luca][de-luca])
- [PostgreSQL 方言] 新增 PostgreSQL 變更欄位序列參數 (#4916 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL 變更欄位預設值以支援 INSERT 陳述式 (#4912 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL 變更序列和移除序列 (#4920 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL Regex 函式定義 (#5025 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 新增 GIN 的語法 (#5027 by [Griffio][griffio])

### 變更
- [IDE 外掛程式] 最低版本為 2023.1 / Android Studio Iguana
- [編譯器] 允許在 `encapsulatingType` 中覆寫型別的空值性 (nullability) (#4882 by [Eliezer Graber][eygraber])
- [編譯器] 對於 SELECT * 內聯欄位名稱
- [Gradle 外掛程式] 切換到 `processIsolation` (#5068 by [Emeka Nwagu][nwagu])
- [Android 執行期] 將 Android minSDK 提高到 21 (#5094 by [Philip Wedemann][hfhbd])
- [驅動程式] 為方言作者公開更多 JDBC/R2DBC 陳述式方法 (#5098 by [Philip Wedemann][hfhbd])

### 修正
- [PostgreSQL 方言] 修正 PostgreSQL 變更表格變更欄位 (#4868 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4448 表格模型缺少匯入 (#4885 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4932 PostgreSQL 預設約束函式 (#4934 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4879 PostgreSQL 在遷移期間變更表格重新命名欄位時的類別轉換錯誤 (#4880 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4474 PostgreSQL 建立擴充功能 (#4541 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 5018 PostgreSQL 新增主鍵非空值型別 (#5020 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4703 聚合表達式 (#5071 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 5028 PostgreSQL JSON (#5030 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 5040 PostgreSQL JSON 運算子 (#5041 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 5040 的 JSON 運算子綁定 (#5100 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 5082 `tsvector` (#5104 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 5032 PostgreSQL UPDATE FROM 陳述式的欄位鄰接 (#5035 by [Griffio][griffio])
- [SQLite 方言] 修正 4897 SQLite 變更表格重新命名欄位 (#4899 by [Griffio][griffio])
- [IDE 外掛程式] 修正錯誤處理程式崩潰 (#4988 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] BugSnag 在 IDEA 2023.3 中初始化失敗 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 透過外掛程式在 IntelliJ 中開啟 .sq 檔案時發生 PluginException (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 不要將 Kotlin 函式庫捆綁到 IntelliJ 外掛程式中，因為它已經是外掛程式的依賴項 (#5126)
- [IDE 外掛程式] 使用擴充功能陣列而不是串流 (#5127)

## [2.0.1] - 2023-12-01

### 新增
- [編譯器] 在執行 SELECT 時新增對多欄位表達式 (multi-column-expr) 的支援 (#4453 by [Adriel Martinez][Adriel-M])
- [PostgreSQL 方言] 新增對 PostgreSQL CREATE INDEX CONCURRENTLY 的支援 (#4531 by [Griffio][griffio])
- [PostgreSQL 方言] 允許 PostgreSQL CTEs 輔助陳述式相互參照 (#4493 by [Griffio][griffio])
- [PostgreSQL 方言] 新增對 PostgreSQL 二進位表達式和求和型別的支援 (#4539 by [Adriel Martinez][Adriel-M])
- [PostgreSQL 方言] 新增對 PostgreSQL SELECT DISTINCT ON 語法的支援 (#4584 by [Griffio][griffio])
- [PostgreSQL 方言] 新增對 SELECT 陳述式中 PostgreSQL JSON 函式的支援 (#4590 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 新增 generate_series PostgreSQL 函式 (#4717 by [Griffio][griffio])
- [PostgreSQL 方言] 新增額外的 PostgreSQL 字串函式定義 (#4752 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 將 DATE PostgreSQL 型別新增到 min 和 max 聚合函式 (#4816 by [André Danielsson][anddani])
- [PostgreSQL 方言] 將 PostgreSQL 時間類型新增到 SqlBinaryExpr (#4657 by [Griifio][griffio])
- [PostgreSQL 方言] 新增 TRUNCATE 到 PostgreSQL 方言 (#4817 by [Bastien de Luca][de-luca])
- [SQLite 3.35 方言] 允許依序評估多個 ON CONFLICT 子句 (#4551 by [Griffio][griffio])
- [JDBC 驅動程式] 為更愉快的 SQL 編輯新增語言註釋 (#4602 by [Marius Volkhart][MariusV])
- [原生驅動程式] 原生驅動程式：新增對 linuxArm64 的支援 (#4792 by [Philip Wedemann][hfhbd])
- [Android 驅動程式] 為 AndroidSqliteDriver 新增 `windowSizeBytes` 參數 (#4804 by [Benoit Lubek][BoD])
- [Paging3 擴充功能] 功能：為 OffsetQueryPagingSource 新增 `initialOffset` (#4802 by [Mohamad Jaara][MohamadJaara])

### 變更
- [編譯器] 在適當情況下優先使用 Kotlin 型別 (#4517 by [Eliezer Graber][eygraber])
- [編譯器] 在執行值型別插入時始終包含欄位名稱 (#4864)
- [PostgreSQL 方言] 移除 PostgreSQL 方言的實驗性狀態 (#4443 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] 更新 PostgreSQL 型別的文件 (#4569 by [Marius Volkhart][MariusV])
- [R2DBC 驅動程式] 優化 PostgreSQL 中處理整數資料型別的效能 (#4588 by [Marius Volkhart][MariusV])

### 移除
- [SQLite Javascript 驅動程式] 移除 `sqljs-driver` (#4613, #4670 by [Derek Ellis][dellisd])

### 修正
- [編譯器] 修正帶有返回且無參數的群組陳述式編譯 (#4699 by [Griffio][griffio])
- [編譯器] 使用 SqlBinaryExpr 綁定參數 (#4604 by [Griffio][griffio])
- [IDE 外掛程式] 如果設定了 IDEA 專案 JDK 則使用它 (#4689 by [Griffio][griffio])
- [IDE 外掛程式] 修正 IDEA 2023.2 及更高版本中「未知元素型別：TYPE_NAME」錯誤 (#4727)
- [IDE 外掛程式] 修正了與 2023.2 的一些相容性問題
- [Gradle 外掛程式] 修正 `verifyMigrationTask` Gradle 任務的文件 (#4713 by [Josh Friend][joshfriend])
- [Gradle 外掛程式] 新增 Gradle 任務輸出訊息以幫助使用者在驗證資料庫之前生成資料庫 (#4684 by [Jingwei][jingwei99])
- [PostgreSQL 方言] 修正 PostgreSQL 欄位多次重新命名問題 (#4566 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4714 PostgreSQL 變更欄位空值性 (#4831 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4837 變更表格變更欄位 (#4846 by [Griffio][griffio])
- [PostgreSQL 方言] 修正 4501 PostgreSQL 序列 (#4528 by [Griffio][griffio])
- [SQLite 方言] 允許 JSON 二進位運算子用於欄位表達式 (#4776 by [Eliezer Graber][eygraber])
- [SQLite 方言] 修正了因名稱找到多個欄位而導致的 UPDATE FROM 誤報 (#4777 by [Eliezer Graber][eygraber])
- [原生驅動程式] 支援具名記憶體內資料庫 (#4662 by [Matthew Nelson][05nelsonm])
- [原生驅動程式] 確保查詢監聽器集合的執行緒安全 (#4567 by [Kevin Galligan][kpgalligan])
- [JDBC 驅動程式] 修正 ConnectionManager 中的連接洩漏 (#4589 by [Marius Volkhart][MariusV])
- [JDBC 驅動程式] 修正 JdbcSqliteDriver 在選擇 ConnectionManager 類型時的 URL 解析 (#4656 by [Matthew Nelson][05nelsonm])

## [2.0.0] - 2023-07-26

### 新增
- [MySQL 方言] MySQL：在 IF 表達式中支援 timestamp/bigint (#4329 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] MySQL：新增 `now` (#4431 by [Philip Wedemann][hfhbd])
- [Web 驅動程式] 啟用 NPM 套件發布 (#4364)
- [IDE 外掛程式] 允許使用者在 Gradle 工具連接失敗時顯示堆疊追蹤 (#4383)

### 變更
- [SQLite 驅動程式] 簡化 JdbcSqliteDriver 使用 Schema 遷移的方式 (#3737 by [Lukáš Moravec][morki])
- [R2DBC 驅動程式] 真正的非同步 R2DBC 游標 (#4387 by [Philip Wedemann][hfhbd])

### 修正
- [IDE 外掛程式] 只有在需要時才實例化資料庫專案服務 (#4382)
- [IDE 外掛程式] 處理尋找使用過程中的程序取消 (#4340)
- [IDE 外掛程式] 修正 IDE 生成非同步程式碼的問題 (#4406)
- [IDE 外掛程式] 將套件結構的組裝移動到一次性計算並脫離 EDT (#4417)
- [IDE 外掛程式] 在 2023.2 上使用正確的 Stub 索引鍵進行 Kotlin 型別解析 (#4416)
- [IDE 外掛程式] 在執行搜尋之前等待索引準備好 (#4419)
- [IDE 外掛程式] 如果索引不可用，則不要執行 GoTo (#4420)
- [編譯器] 修正群組陳述式的結果表達式 (#4378)
- [編譯器] 不要使用虛擬表格作為介面型別 (#4427 by [Philip Wedemann][hfhbd])

## [2.0.0-rc02] - 2023-06-27

### 新增
- [MySQL 方言] 支援小寫日期型別以及日期型別上的 min 和 max (#4243 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支援二進位表達式和求和的 MySQL 型別 (#4254 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支援不帶顯示寬度的無符號整數 (#4306 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支援 LOCK IN SHARED MODE
- [PostgreSQL 方言] 新增布林和 Timestamp 到 min max (#4245 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL：新增視窗函式支援 (#4283 by [Philip Wedemann][hfhbd])
- [執行期] 為執行期新增 `linuxArm64`、`androidNative` 和 `watchosDeviceArm` 目標 (#4258 by [Philip Wedemann][hfhbd])
- [分頁擴充功能] 為分頁擴充功能新增 `linux` 和 `mingw x64` 目標 (#4280 by [Cedric Hippmann][chippman])

### 變更
- [Gradle 外掛程式] 新增 Android API 34 的自動方言支援 (#4251)
- [分頁擴充功能] 為 QueryPagingSource 新增 SuspendingTransacter 支援 (#4292 by [Ilya Polenov][daio])
- [執行期] 改善 addListener API (#4244 by [Philip Wedemann][hfhbd])
- [執行期] 使用 Long 作為遷移版本 (#4297 by [Philip Wedemann][hfhbd])

### 修正
- [Gradle 外掛程式] 為生成源使用穩定的輸出路徑 (#4269 by [Josh Friend][joshfriend])
- [Gradle 外掛程式] Gradle 調整 (#4222 by [Matthew Haughton][3flex])

## [2.0.0-rc01] - 2023-05-29

### 新增
- [分頁] 為分頁擴充功能新增 js 瀏覽器目標 (#3843 by [Sean Proctor][sproctor])
- [分頁] 為 androidx-paging3 擴充功能新增 iosSimulatorArm64 目標 (#4117)
- [PostgreSQL 方言] 新增 `gen_random_uuid()` 的支援和測試 (#3855 by [David Wheeler][davidwheeler123])
- [PostgreSQL 方言] 變更表格新增約束 PostgreSQL (#4116 by [Griffio][griffio])
- [PostgreSQL 方言] 變更表格新增約束檢查 (#4120 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL 字元長度函式 (#4121 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL 欄位預設間隔 (#4142 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL 間隔欄位結果 (#4152 by [Griffio][griffio])
- [PostgreSQL 方言] 新增 PostgreSQL 變更欄位 (#4165 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL：新增 `date_part` (#4198 by [Philip Wedemann][hfhbd])
- [MySQL 方言] 新增 SQL 字元長度函式 (#4134 by [Griffio][griffio])
- [IDE 外掛程式] 新增 sqldelight 目錄建議 (#3976 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 在專案樹中壓縮中間套件 (#3992 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增 join 子句補全 (#4086 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 建立視圖意圖和 Live Template (#4074 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 警告 DELETE 或 UPDATE 內缺少 WHERE (#4058 by [Alexander Perfilyev][aperfilyev])
- [Gradle 外掛程式] 啟用型別安全專案存取器 (#4005 by [Philip Wedemann][hfhbd])

### 變更
- [Gradle 外掛程式] 允許使用 ServiceLoader 機制註冊 VerifyMigrationTask 的 DriverInitializer (#3986 by [Alex Doubov][C2H6O])
- [Gradle 外掛程式] 建立明確的編譯器環境 (#4079 by [Philip Wedemann][hfhbd])
- [JS 驅動程式] 將 Web Worker 驅動程式拆分為獨立的 Artifact
- [JS 驅動程式] 不要公開 JsWorkerSqlCursor (#3874 by [Philip Wedemann][hfhbd])
- [JS 驅動程式] 禁用 sqljs 驅動程式的發布 (#4108)
- [執行期] 強制同步驅動程式需要同步 Schema 初始化器 (#4013)
- [執行期] 改善 Cursors 的非同步支援 (#4102)
- [執行期] 移除已棄用的目標 (#4149 by [Philip Wedemann][hfhbd])
- [執行期] 移除對舊 MM 的支援 (#4148 by [Philip Wedemann][hfhbd])

### 修正
- [R2DBC 驅動程式] R2DBC：等待關閉驅動程式 (#4139 by [Philip Wedemann][hfhbd])
- [編譯器] 在資料庫建立 (SqlDriver) 中包含遷移的 PRAGMAs (#3845 by [Marius Volkhart][MariusV])
- [編譯器] 修正 RETURNING 子句的程式碼生成 (#3872 by [Marius Volkhart][MariusV])
- [編譯器] 不要為虛擬表格生成型別 (#4015)
- [Gradle 外掛程式] Gradle 外掛程式的一些品質改善 (#3930 by [Zac Sweers][zacsweers])
- [IDE 外掛程式] 修正未解析的 Kotlin 型別 (#3924 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正擴展萬用字元意圖以適用於限定符 (#3979 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 如果 Java Home 缺失，則使用可用的 JDK (#3925 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正套件名稱上的尋找使用 (#4010)
- [IDE 外掛程式] 不要為無效元素顯示自動匯入 (#4008)
- [IDE 外掛程式] 如果缺少方言，則不解析 (#4009)
- [IDE 外掛程式] 在無效狀態期間忽略 IDE 執行編譯器 (#4016)
- [IDE 外掛程式] 新增對 IntelliJ 2023.1 的支援 (#4037 by [Madis Pink][madisp])
- [IDE 外掛程式] 在欄位重新命名時重新命名具名參數使用 (#4027 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正新增遷移彈出視窗 (#4105 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 在遷移檔案中禁用 SchemaNeedsMigrationInspection (#4106 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 使用 SQL 欄位名稱進行遷移生成而不是型別名稱 (#4112 by [Alexander Perfilyev][aperfilyev])

## [2.0.0-alpha05] - 2023-01-20

### 新增
- [分頁] 多平台分頁擴充功能 (by [Jeff Lockhart][jeffdgr8])
- [執行期] 為 Listener 介面新增 `fun` 修飾符。
- [SQLite 方言] 新增 SQLite 3.33 支援 (UPDATE FROM) (by [Eliezer Graber][eygraber])
- [PostgreSQL 方言] 支援 PostgreSQL 中的 UPDATE FROM (by [Eliezer Graber][eygraber])

### 變更
- [R2DBC 驅動程式] 公開連接 (by [Philip Wedemann][hfhbd])
- [執行期] 將遷移回調移動到主要的 `migrate` 函式中
- [Gradle 外掛程式] 向下游專案隱藏 Configuration
- [Gradle 外掛程式] 僅遮蔽 Intellij (by [Philip Wedemann][hfhbd])
- [Gradle 外掛程式] 支援 Kotlin 1.8.0-Beta 並新增多版本 Kotlin 測試 (by [Philip Wedemann][hfhbd])

### 修正
- [R2DBC 驅動程式] 改用 javaObjectType (by [Philip Wedemann][hfhbd])
- [R2DBC 驅動程式] 修正 `bindStatement` 中的原始空值 (primitive null values) (by [Philip Wedemann][hfhbd])
- [R2DBC 驅動程式] 支援 R2DBC 1.0 (by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL：修正沒有型別參數的陣列 (Array without type parameter) (by [Philip Wedemann][hfhbd])
- [IDE 外掛程式] 將 Intellij 版本提升到 221.6008.13 (by [Philip Wedemann][hfhbd])
- [編譯器] 從純視圖解析遞迴起源表 (recursive origin table) (by [Philip Wedemann][hfhbd])
- [編譯器] 從表格外部鍵子句 (foreign key clause) 使用值類別 (value classes) (by [Philip Wedemann][hfhbd])
- [編譯器] 修正 SelectQueryGenerator 以支援沒有括號的綁定表達式 (bind expression) (by [Doogie Min][bellatoris])
- [編譯器] 修正使用交易時重複生成 `${name}Indexes` 變數的問題 (by [Andreas Sacher][sachera])

## [1.5.5] - 2023-01-20

這是針對 Kotlin 1.8 和 IntelliJ 2021+ 的相容性版本，支援 JDK 17。

## [1.5.4] - 2022-10-06

這是 Kotlin 1.7.20 和 AGP 7.3.0 的相容性更新。

## [2.0.0-alpha04] - 2022-10-03

### 破壞性變更

- Paging 3 擴充功能 API 已變更為僅允許 `int` 型別作為計數。
- Coroutines 擴充功能現在需要傳入一個 Dispatcher，而不是預設。
- Dialect 和 Driver 類別現在是 `final`，請改用委託 (delegation)。

### 新增
- [HSQL 方言] HSQL：支援在 Insert 中使用 `DEFAULT` 作為生成欄位 (#3372 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL：支援在 INSERT 中使用 `DEFAULT` 作為生成欄位 (#3373 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] 新增 NOW() 到 PostgreSQL (#3403 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL 新增 NOT 運算子 (#3504 by [Philip Wedemann][hfhbd])
- [分頁] 允許將 CoroutineContext 傳入 *QueryPagingSource (#3384)
- [Gradle 外掛程式] 新增更好的方言版本目錄支援 (#3435)
- [原生驅動程式] 新增回調以掛鉤 NativeSqliteDriver 的 DatabaseConfiguration 建立 (#3512 by [Sven Jacobs][svenjacobs])

### 變更
- [分頁] 為 KeyedQueryPagingSource 支援的 QueryPagingSource 函式新增預設 Dispatcher (#3385)
- [分頁] 使 OffsetQueryPagingSource 僅適用於 Int 型別 (#3386)
- [非同步執行期] 將 `await*` 移動到上層類別 ExecutableQuery (#3524 by [Philip Wedemann][hfhbd])
- [Coroutines 擴充功能] 移除 Flow 擴充功能的預設參數 (#3489)

### 修正
- [Gradle 外掛程式] 更新至 Kotlin 1.7.20 (#3542 by [Zac Sweers][zacsweers])
- [R2DBC 驅動程式] 採用 R2DBC 變更，不總是發送值 (#3525 by [Philip Wedemann][hfhbd])
- [HSQL 方言] 修正 HSQL 導致 SQLite `VerifyMigrationTask` 失敗的問題 (#3380 by [Philip Wedemann][hfhbd])
- [Gradle 外掛程式] 將任務轉換為使用 Gradle 的延遲配置 API (by [Matthew Haughton][3flex])
- [Gradle 外掛程式] 避免 Kotlin 1.7.20 中的 NPE (#3398 by [Zac Sweers][ZacSweers])
- [Gradle 外掛程式] 修正 squash migrations 任務的描述 (#3449)
- [IDE 外掛程式] 修正較新 Kotlin 外掛程式中的 NoSuchFieldError (#3422 by [Madis Pink][madisp])
- [IDE 外掛程式] IDEA: UnusedQueryInspection - 修正 ArrayIndexOutOfBoundsException (#3427 by [Niklas Baudy][vanniktech])
- [IDE 外掛程式] 對舊 Kotlin 外掛程式參考使用反射
- [編譯器] 帶有擴充功能函式的自定義方言不建立匯入 (#3338 by [Philip Wedemann][hfhbd])
- [編譯器] 修正 `CodeBlock.of("${CodeBlock.toString()}")` 的轉義問題 (#3340 by [Philip Wedemann][hfhbd])
- [編譯器] 在遷移中等待非同步執行陳述式 (#3352)
- [編譯器] 修正 AS (#3370 by [Philip Wedemann][hfhbd])
- [編譯器] `getObject` 方法支援自動填寫實際型別 (#3401 by [Rob X][robx])
- [編譯器] 修正非同步群組返回陳述式的程式碼生成 (#3411)
- [編譯器] 如果可能，推斷綁定參數的 Kotlin 型別，否則會出現更好的錯誤訊息 (#3413 by [Philip Wedemann][hfhbd])
- [編譯器] 不允許 ABS("foo") (#3430 by [Philip Wedemann][hfhbd])
- [編譯器] 支援從其他參數推斷 Kotlin 型別 (#3431 by [Philip Wedemann][hfhbd])
- [編譯器] 始終建立資料庫實作 (#3540 by [Philip Wedemann][hfhbd])
- [編譯器] 放鬆 javadoc 並將其新增到自定義 mapper 函式中 (#3554 [Philip Wedemann][hfhbd])
- [編譯器] 修正綁定中的 DEFAULT (by [Philip Wedemann][hfhbd])
- [分頁] 修正 Paging 3 (#3396)
- [分頁] 允許使用 Long 建構 OffsetQueryPagingSource (#3409)
- [分頁] 不要靜態交換 `Dispatchers.Main` (#3428)

## [2.0.0-alpha03] - 2022-06-17

### 破壞性變更

- 方言現在像實際的 Gradle 依賴項一樣被引用。
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
- [IDE 外掛程式] 新增支援對正在執行的資料庫執行 SQLite、MySQL 和 PostgreSQL 命令 (#2718 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增支援 Android Studio DB Inspector (#3107 by [Alexander Perfilyev][aperfilyev])
- [執行期] 新增對非同步驅動程式的支援 (#3168 by [Derek Ellis][dellisd])
- [原生驅動程式] 支援新的 Kotlin 原生記憶體模型 (#3177 by [Kevin Galligan][kpgalligan])
- [JS 驅動程式] 新增 SqlJs Worker 的驅動程式 (#3203 by [Derek Ellis][dellisd])
- [Gradle 外掛程式] 公開 SQLDelight 任務的類別路徑
- [Gradle 外掛程式] 新增一個 Gradle 任務用於壓縮遷移
- [Gradle 外掛程式] 新增一個標誌以在遷移檢查期間忽略 Schema 定義
- [MySQL 方言] 支援 MySQL 中的 FOR SHARE 和 FOR UPDATE (#3098)
- [MySQL 方言] 支援 MySQL 索引提示 (#3099)
- [PostgreSQL 方言] 新增 `date_trunc` (#3295 by [Philip Wedemann][hfhbd])
- [JSON 擴充功能] 支援 JSON 表格函式 (#3090)

### 變更
- [執行期] 移除不帶驅動程式的 AfterVersion 型別 (#3091)
- [執行期] 將 Schema 型別移動到頂層
- [執行期] 開放方言和解析器以支援第三方實作 (#3232 by [Philip Wedemann][hfhbd])
- [編譯器] 在故障報告中包含用於編譯的方言 (#3086)
- [編譯器] 跳過未使用的適配器 (#3162 by [Eliezer Graber][eygraber])
- [編譯器] 在 `PrepareStatement` 中使用基於零的索引 (#3269 by [Philip Wedemann][hfhbd])
- [Gradle 外掛程式] 也將方言作為一個適當的 Gradle 依賴項而不是字串 (#3085)
- [Gradle 外掛程式] Gradle Verify Task：缺少資料庫檔案時拋出錯誤 (#3126 by [Niklas Baudy][vanniktech])

### 修正
- [Gradle 外掛程式] Gradle 外掛程式的次要清理和調整 (#3171 by [Matthew Haughton][3flex])
- [Gradle 外掛程式] 不要使用 AGP 字串作為生成目錄
- [Gradle 外掛程式] 使用 AGP 命名空間屬性 (#3220)
- [Gradle 外掛程式] 不要將 `kotlin-stdlib` 作為 Gradle 外掛程式的執行期依賴項捆綁 (#3245 by [Martin Bonnin][mbonnin])
- [Gradle 外掛程式] 簡化多平台配置 (#3246 by [Martin Bonnin][mbonnin])
- [Gradle 外掛程式] 支援僅 JS 專案 (#3310 by [Philip Wedemann][hfhbd])
- [IDE 外掛程式] 對 Gradle 工具 API 使用 Java Home (#3078)
- [IDE 外掛程式] 在 IDE 外掛程式內部在正確的 ClassLoader 上載入 JDBC 驅動程式 (#3080)
- [IDE 外掛程式] 在無效化之前將檔案元素標記為 null，以避免在已存在的 PSI 變更期間出現錯誤 (#3082)
- [IDE 外掛程式] 在 ALTER TABLE 陳述式中尋找新表格名稱的使用時不會崩潰 (#3106)
- [IDE 外掛程式] 優化檢查器並使其能夠在預期異常型別上靜默失敗 (#3121)
- [IDE 外掛程式] 刪除應為生成目錄的檔案 (#3198)
- [IDE 外掛程式] 修正不安全的運算子呼叫
- [編譯器] 確保帶有 RETURNING 陳述式的更新和刪除執行查詢 (#3084)
- [編譯器] 在複合選擇中正確推斷引數型別 (#3096)
- [編譯器] 共同表格不生成資料類別，因此不返回它們 (#3097)
- [編譯器] 更快地找到頂層遷移檔案 (#3108)
- [編譯器] 正確繼承管線運算子上的空值性
- [編譯器] 支援 iif ANSI SQL 函式
- [編譯器] 不要生成空的查詢檔案 (#3300 by [Philip Wedemann][hfhbd])
- [編譯器] 修正僅帶有問號的適配器 (#3314 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL 主鍵欄位始終是非空的 (#3092)
- [PostgreSQL 方言] 修正多個表格中同名副本的問題 (#3297 by [Philip Wedemann][hfhbd])
- [SQLite 3.35 方言] 僅在從變更的表格中刪除索引欄位時顯示錯誤 (#3158 by [Eliezer Graber][eygraber])

## [2.0.0-alpha02] - 2022-04-13

### 破壞性變更

- 您需要將所有 `app.cash.sqldelight.runtime.rx` 的出現替換為 `app.cash.sqldelight.rx2`

### 新增
- [編譯器] 支援在群組陳述式結尾返回
- [編譯器] 透過方言模組支援編譯器擴充功能，並新增 SQLite JSON 擴充功能 (#1379, #2087)
- [編譯器] 支援返回值的 PRAGMA 陳述式 (#1106)
- [編譯器] 支援為標記的欄位生成值型別
- [編譯器] 新增對樂觀鎖和驗證的支援 (#1952)
- [編譯器] 支援多重更新陳述式
- [PostgreSQL] 支援 PostgreSQL 返回陳述式
- [PostgreSQL] 支援 PostgreSQL 日期型別
- [PostgreSQL] 支援 PostgreSQL 間隔型別
- [PostgreSQL] 支援 PostgreSQL 布林型別並修正 ALTER TABLES 上的插入
- [PostgreSQL] 支援 PostgreSQL 可選限制
- [PostgreSQL] 支援 PostgreSQL BYTEA 型別
- [PostgreSQL] 新增 PostgreSQL 序列的測試
- [PostgreSQL] 支援 PostgreSQL UPDATE 語法
- [PostgreSQL] 支援 PostgreSQL 陣列型別
- [PostgreSQL] 在 PostgreSQL 中正確儲存/檢索 UUID 型別
- [PostgreSQL] 支援 PostgreSQL NUMERIC 型別 (#1882)
- [PostgreSQL] 支援共同表格表達式中的返回查詢 (#2471)
- [PostgreSQL] 支援 JSON 特有的運算子
- [PostgreSQL] 新增 PostgreSQL Copy (by [Philip Wedemann][hfhbd])
- [MySQL] 支援 MySQL Replace
- [MySQL] 支援 NUMERIC/BigDecimal MySQL 型別 (#2051)
- [MySQL] 支援 MySQL TRUNCATE 陳述式
- [MySQL] 支援 MySQL 中的 JSON 特有運算子 (by [Eliezer Graber][eygraber])
- [MySQL] 支援 MySQL INTERVAL (#2969 by [Eliezer Graber][eygraber])
- [HSQL] 新增 HSQL 視窗函式功能
- [SQLite] 不要替換 WHERE 子句中可空參數的等式檢查 (#1490 by [Eliezer Graber][eygraber])
- [SQLite] 支援 Sqlite 3.35 返回陳述式 (#1490 by [Eliezer Graber][eygraber])
- [SQLite] 支援 GENERATED 子句
- [SQLite] 新增對 Sqlite 3.38 方言的支援 (by [Eliezer Graber][eygraber])

### 變更
- [編譯器] 稍微清理生成的程式碼
- [編譯器] 禁止在群組陳述式中使用表格參數 (#1822)
- [編譯器] 將群組查詢放入交易中 (#2785)
- [執行期] 從驅動程式的 `execute` 方法返回更新的行數
- [執行期] 將 `SqlCursor` 限制在訪問連接的臨界區 (#2123 by [Anders Ha][andersio])
- [Gradle 外掛程式] 比較遷移的 Schema 定義 (#841)
- [PostgreSQL] 禁止 PostgreSQL 使用雙引號
- [MySQL] MySQL 中使用 `==` 時報錯 (#2673)

### 修正
- [編譯器] 來自不同表格的相同適配器型別導致 2.0 alpha 版編譯錯誤
- [編譯器] Upsert 陳述式編譯問題 (#2791)
- [編譯器] 如果有多個匹配項，查詢結果應使用 SELECT 中的表格 (#1874, #2313)
- [編譯器] 支援更新帶有 INSTEAD OF 觸發器的視圖 (#1018)
- [編譯器] 支援函式名稱中的 `from` 和 `for`
- [編譯器] 允許 `SEPARATOR` 關鍵字在函式表達式中
- [編譯器] 無法在 ORDER BY 中存取別名表格的 ROWID
- [編譯器] MySQL 中 HAVING 子句中無法識別別名欄位名稱
- [編譯器] 錯誤的「找到多個欄位」錯誤
- [編譯器] 無法設定 `PRAGMA locking_mode = EXCLUSIVE;`
- [PostgreSQL] PostgreSQL 重新命名欄位
- [MySQL] 無法識別 UNIX_TIMESTAMP、TO_SECONDS、JSON_ARRAYAGG MySQL 函式
- [SQLite] 修正 SQLite 視窗函式功能
- [IDE 外掛程式] 在空進度指示器中執行 goto 處理程式 (#2990)
- [IDE 外掛程式] 確保如果專案未配置，高亮訪問器不會運行 (#2981, #2976)
- [IDE 外掛程式] 確保傳遞生成的程式碼也在 IDE 中更新 (#1837)
- [IDE 外掛程式] 更新方言時使索引失效

## [2.0.0-alpha01] - 2022-03-31

這是 2.0 的第一個 Alpha 版本，包含一些破壞性變更。我們預計會有更多 ABI 破壞性變更，因此請勿發布任何依賴此版本的函式庫（應用程式應該沒問題）。

### 破壞性變更

- 首先，您需要將所有 `com.squareup.sqldelight` 的出現替換為 `app.cash.sqldelight`
- 其次，您需要將所有 `app.cash.sqldelight.android` 的出現替換為 `app.cash.sqldelight.driver.android`
- 第三，您需要將所有 `app.cash.sqldelight.sqlite.driver` 的出現替換為 `app.cash.sqldelight.driver.jdbc.sqlite`
- 第四，您需要將所有 `app.cash.sqldelight.drivers.native` 的出現替換為 `app.cash.sqldelight.driver.native`
- IDE 外掛程式必須更新到 2.X 版本，可在 [alpha 或 eap 頻道](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha) 找到
- 方言現在是您可以透過 Gradle 指定的依賴項：

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

目前支援的方言有 `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect` 和 `sqlite-3-35-dialect`

- 原始型別現在必須匯入（例如 `INTEGER AS Boolean` 您必須 `import kotlin.Boolean`），一些以前支援的型別現在需要一個適配器 (adapter)。原始型別適配器可在 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` 中找到，用於大多數轉換（例如用於 `Integer AS kotlin.Int` 的 `IntColumnAdapter`）。

### 新增
- [IDE 外掛程式] 基本建議遷移 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增匯入提示動作 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增 Kotlin 類別自動補全 (by [Alexander Perfilyev][aperfilyev])
- [Gradle 外掛程式] 新增 Gradle 型別安全專案存取器快捷方式 (by [Philip Wedemann][hfhbd])
- [編譯器] 根據方言自定義程式碼生成 (by [Marius Volkhart][MariusV])
- [JDBC 驅動程式] 為 JdbcDriver 新增通用型別 (by [Marius Volkhart][MariusV])
- [SQLite] 新增對 SQLite 3.35 的支援 (by [Eliezer Graber][eygraber])
- [SQLite] 新增對 ALTER TABLE DROP COLUMN 的支援 (by [Eliezer Graber][eygraber])
- [SQLite] 新增對 Sqlite 3.30 方言的支援 (by [Eliezer Graber][eygraber])
- [SQLite] 支援 SQLite 中的 NULLS FIRST/LAST (by [Eliezer Graber][eygraber])
- [HSQL] 新增 HSQL 對生成子句的支援 (by [Marius Volkhart][MariusV])
- [HSQL] 新增對 HSQL 中具名參數的支援 (by [Marius Volkhart][MariusV])
- [HSQL] 自定義 HSQL 插入查詢 (by [Marius Volkhart][MariusV])

### 變更
- [全部] 套件名稱已從 `com.squareup.sqldelight` 變更為 `app.cash.sqldelight`。
- [執行期] 將方言移動到其獨立的 Gradle 模組中
- [執行期] 切換到驅動程式實作的查詢通知。
- [執行期] 將預設欄位適配器提取到單獨的模組 (#2056, #2060)
- [編譯器] 讓模組生成查詢實作，而不是在每個模組中重複
- [編譯器] 移除生成的資料類別的自定義 toString 生成。(by [Paul Woitaschek][PaulWoitaschek])
- [JS 驅動程式] 從 `sqljs-driver` 中移除 `sql.js` 依賴項 (by [Derek Ellis][dellisd])
- [分頁] 移除 Android 分頁 2 擴充功能
- [IDE 外掛程式] 在 SQLDelight 同步時新增編輯器橫幅 (#2511)
- [IDE 外掛程式] 最低支援的 IntelliJ 版本為 2021.1

### 修正
- [執行期] 平面化監聽器列表以減少分配和指標追蹤。(by [Anders Ha][andersio])
- [IDE 外掛程式] 修正錯誤訊息以允許跳轉到錯誤 (by [Philip Wedemann][hfhbd])
- [IDE 外掛程式] 新增缺失的檢查描述 (#2768 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正 GotoDeclarationHandler 中的異常 (#2531, #2688, #2804 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 高亮匯入關鍵字 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正未解析的 kotlin 型別 (#1678 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正未解析套件的高亮顯示 (#2543 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 如果專案索引尚未初始化，則不要嘗試檢查不匹配的欄位
- [IDE 外掛程式] 在 Gradle 同步發生之前不要初始化檔案索引
- [IDE 外掛程式] 如果 Gradle 同步開始，取消 SQLDelight 匯入
- [IDE 外掛程式] 在撤銷操作執行所在執行緒之外重新生成資料庫
- [IDE 外掛程式] 如果無法解析引用，則使用空白的 Java 型別
- [IDE 外掛程式] 在檔案解析期間正確移出主執行緒，並僅在寫入時移回
- [IDE 外掛程式] 改善與舊 IntelliJ 版本的相容性 (by [Matthew Haughton][3flex])
- [IDE 外掛程式] 使用更快的註解 API
- [Gradle 外掛程式] 在新增執行期時明確支援 JS/Android 外掛程式 (by [Zac Sweers][ZacSweers])
- [Gradle 外掛程式] 註冊遷移輸出任務，不從遷移中推導 Schema (#2744 by [Kevin Cianfarini][kevincianfarini])
- [Gradle 外掛程式] 如果遷移任務崩潰，列印崩潰時正在執行的檔案
- [Gradle 外掛程式] 在生成程式碼時排序檔案以確保冪等輸出 (by [Zac Sweers][ZacSweers])
- [編譯器] 使用更快的 API 來迭代檔案，並且不探索整個 PSI 圖
- [編譯器] 為 SELECT 函式參數新增關鍵字命名衝突處理 (#2759 by [Alexander Perfilyev][aperfilyev])
- [編譯器] 修正遷移適配器的 packageName (by [Philip Wedemann][hfhbd])
- [編譯器] 在屬性而不是型別上發出註解 (#2798 by [Alexander Perfilyev][aperfilyev])
- [編譯器] 在傳遞給 Query 子型別之前排序引數 (#2379 by [Alexander Perfilyev][aperfilyev])

## [1.5.3] - 2021-11-23
### 新增
- [JDBC 驅動程式] 開放 JdbcDriver 以支援第三方驅動程式實作 (#2672 by [Philip Wedemann][hfhbd])
- [MySQL 方言] 新增時間增量函式 (#2671 by [Sam Doward][sdoward])
- [Coroutines 擴充功能] 為 coroutines-extensions 新增 M1 目標 (by [Philip Dukhov][PhilipDukhov])

### 變更
- [Paging3 擴充功能] 將 `sqldelight-android-paging3` 作為 JAR 而非 AAR 分發 (#2634 by [Marco Romano][julioromano])
- 同時也是軟關鍵字的屬性名稱現在將以底線為後綴。例如 `value` 將公開為 `value_`

### 修正
- [編譯器] 不要為重複的陣列參數提取變數 (by [Alexander Perfilyev][aperfilyev])
- [Gradle 外掛程式] 新增 `kotlin.mpp.enableCompatibilityMetadataVariant` (#2628 by [Martin Bonnin][martinbonnin])
- [IDE 外掛程式] 尋找使用處理需要讀取動作

## [1.5.2] - 2021-10-12
### 新增
- [Gradle 外掛程式] HMPP 支援 (#2548 by [Martin Bonnin][martinbonnin])
- [IDE 外掛程式] 新增 NULL 比較檢查 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增檢查抑制器 (#2519 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 混合具名和位置參數檢查 (by [Alexander Perfilyev][aperfilyev])
- [SQLite 驅動程式] 新增 mingwX86 目標 (#2558 by [Nikita Kozhemyakin][enginegl])
- [SQLite 驅動程式] 新增 M1 目標
- [SQLite 驅動程式] 新增 linuxX64 支援 (#2456 by [Cedric Hippmann][chippmann])
- [MySQL 方言] 新增 ROW_COUNT 函式到 MySQL (#2523)
- [PostgreSQL 方言] PostgreSQL 重新命名、移除欄位 (by [Juan Liska][pabl0rg])
- [PostgreSQL 方言] PostgreSQL 語法無法識別 CITEXT
- [PostgreSQL 方言] 包含 TIMESTAMP WITH TIME ZONE 和 TIMESTAMPTZ
- [PostgreSQL 方言] 新增 PostgreSQL GENERATED 欄位的語法
- [執行期] 提供 SqlDriver 作為 AfterVersion 的參數 (#2534, 2614 by [Ahmed El-Helw][ahmedre])

### 變更
- [Gradle 外掛程式] 明確要求 Gradle 7.0 (#2572 by [Martin Bonnin][martinbonnin])
- [Gradle 外掛程式] 使 VerifyMigrationTask 支援 Gradle 的最新檢查 (#2533 by [Matthew Haughton][3flex])
- [IDE 外掛程式] 在可空型別與非可空型別連接時，不要警告「Join 比較兩個不同型別的欄位」(#2550 by [Piotr Chmielowski][pchmielowski])
- [IDE 外掛程式] 澄清欄位型別中小寫「as」的錯誤 (by [Alexander Perfilyev][aperfilyev])

### 修正
- [IDE 外掛程式] 如果專案已銷毀，不要在新的方言下重新解析 (#2609)
- [IDE 外掛程式] 如果相關的虛擬檔案為 null，則模組為 null (#2607)
- [IDE 外掛程式] 避免在未使用查詢檢查期間崩潰 (#2610)
- [IDE 外掛程式] 在寫入動作內執行資料庫同步寫入 (#2605)
- [IDE 外掛程式] 讓 IDE 安排 SQLDelight 同步
- [IDE 外掛程式] 修正 JavaTypeMixin 中的 NPE (#2603 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正 MismatchJoinColumnInspection 中的 IndexOutOfBoundsException (#2602 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增 UnusedColumnInspection 的描述 (#2600 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 將 PsiElement.generatedVirtualFiles 包裹在讀取動作中 (#2599 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 移除不必要的 nonnull 強制轉換 (#2596)
- [IDE 外掛程式] 正確處理尋找使用中的空值 (#2595)
- [IDE 外掛程式] 修正 Android 生成檔案的 IDE 自動補全 (#2573 by [Martin Bonnin][martinbonnin])
- [IDE 外掛程式] 修正 SqlDelightGotoDeclarationHandler 中的 NPE (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 在 INSERT 陳述式中mangle Kotlin 關鍵字參數 (#2433 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正 SqlDelightFoldingBuilder 中的 NPE (#2382 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 在 CopyPasteProcessor 中捕獲 ClassCastException (#2369 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正更新 Live Template (by [Ilias Redissi][IliasRedissi])
- [IDE 外掛程式] 新增動作意圖的描述 (#2489 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 如果未找到表格，修正 CreateTriggerMixin 中的異常 (by [Alexander Perfilyev][aperfilyev])
- [編譯器] 對表格建立陳述式進行拓撲排序
- [編譯器] 停止對目錄呼叫 `forDatabaseFiles` 回調 (#2532)
- [Gradle 外掛程式] 將 `generateDatabaseInterface` 任務依賴項傳播給潛在的消費者 (#2518 by [Martin Bonnin][martinbonnin])

## [1.5.1] - 2021-07-16
### 新增
- [PostgreSQL 方言] PostgreSQL JSONB 和 ON CONFLICT DO NOTHING (by [Andrew Stewart][satook])
- [PostgreSQL 方言] 新增對 PostgreSQL ON CONFLICT (column, ...) DO UPDATE 的支援 (by [Andrew Stewart][satook])
- [MySQL 方言] 支援 MySQL 生成欄位 (by [Jeff Gulbronson][JeffG])
- [原生驅動程式] 新增 watchosX64 支援
- [IDE 外掛程式] 新增參數型別和註解 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增動作以生成「select all」查詢 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 在自動補全中顯示欄位型別 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 為自動補全新增圖示 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增動作以生成「select by primary key」查詢 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增動作以生成「insert into」查詢 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 為欄位名稱、陳述式識別碼、函式名稱新增高亮顯示 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增其餘查詢生成動作 (#489 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 顯示 insert-stmt 的參數提示 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 表格別名意圖動作 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 限定欄位名稱意圖 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 跳轉到 Kotlin 屬性宣告 (by [Alexander Perfilyev][aperfilyev])

### 變更
- [原生驅動程式] 透過避免凍結和可共享資料結構來改善原生交易性能 (by [Anders Ha][andersio])
- [Paging 3] 將 Paging3 版本提升到 3.0.0 stable
- [JS 驅動程式] 升級 `sql.js` 到 1.5.0

### 修正
- [JDBC SQLite 驅動程式] 在清除 ThreadLocal 之前呼叫連接的 `close()` (#2444 by [Hannes Struß][hannesstruss])
- [RX 擴充功能] 修正訂閱/處置競爭洩漏 (#2403 by [Pierre Yves Ricau][pyricau])
- [Coroutines 擴充功能] 確保我們在通知之前註冊查詢監聽器
- [編譯器] 排序 `notifyQueries` 以獲得一致的 Kotlin 輸出檔案 (by [Jiayu Chen][thomascjy])
- [編譯器] 不要用 `@JvmField` 註解 SELECT 查詢類別屬性 (by [Eliezer Graber][eygraber])
- [IDE 外掛程式] 修正匯入優化器 (#2350 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正未使用欄位檢查 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增巢狀類別支援到匯入檢查和類別註解器 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正 CopyPasteProcessor 中的 NPE (#2363 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正 InlayParameterHintsProvider 中的崩潰 (#2359 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 修正將任何文本複製貼上到 CREATE TABLE 陳述式時插入空白行 (#2431 by [Alexander Perfilyev][aperfilyev])

## [1.5.0] - 2021-04-23
### 新增
- [SQLite Javascript 驅動程式] 啟用 `sqljs-driver` 發布 (#1667 by [Derek Ellis][dellisd])
- [Paging3 擴充功能] Android Paging 3 Library 擴充功能 (#1786 by [Kevin Cianfarini][kevincianfarini])

## [1.5.0] - 2021-04-23
### 新增
- [SQLite Javascript 驅動程式] 啟用 `sqljs-driver` 發布 (#1667 by [Derek Ellis][dellisd])
- [Paging3 擴充功能] Android Paging 3 Library 擴充功能 (#1786 by [Kevin Cianfarini][kevincianfarini])
- [MySQL 方言] 新增支援 MySQL 的 ON DUPLICATE KEY UPDATE 衝突解決方案。(by [Ryan Harter][rharter])
- [SQLite 方言] 新增編譯器支援 SQLite `offsets()` (by [Quinton Roberts][qjroberts])
- [IDE 外掛程式] 新增未知型別的快速修復匯入 (#683 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增未使用匯入檢查 (#1161 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增未使用查詢檢查 (by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 新增未使用欄位檢查 (#569 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 複製/貼上時自動匯入 (#684 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 當 Gradle/IntelliJ 外掛程式版本不相容時彈出氣泡
- [IDE 外掛程式] Insert Into ... VALUES(?) 參數提示 (#506 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 內聯參數提示 (by [Alexander Perfilyev][aperfilyev])
- [執行期] 在執行期中包含一個 API，用於帶有回調的執行遷移 (#1844)

### 變更
- [編譯器] 智慧轉換「IS NOT NULL」查詢 (#867)
- [編譯器] 防止執行期失敗的關鍵字 (#1471, #1629)
- [Gradle 外掛程式] 將 Gradle 外掛程式大小從 60MB 減小到 13MB。
- [Gradle 外掛程式] 正確支援 Android 變體，並移除對 KMM 特定目標 SQL 的支援 (#1039)
- [Gradle 外掛程式] 根據 minSDK 選擇最小 SQLite 版本 (#1684)
- [原生驅動程式] 原生驅動程式連接池和性能更新

### 修正
- [編譯器] Lambdas 前的 NBSP (by [Benoît Quenaudon][oldergod])
- [編譯器] 修正生成 `bind*` 和 `cursor.get*` 陳述式中不相容的型別
- [編譯器] SQL 子句應保留適配型別 (#2067)
- [編譯器] 僅包含 NULL 關鍵字的欄位應為可空
- [編譯器] 不要生成帶有型別註解的 mapper lambda (#1957)
- [編譯器] 如果自定義查詢發生衝突，請使用檔名作為額外的套件後綴 (#1057, #1278)
- [編譯器] 確保外部鍵聯級操作會觸發查詢監聽器 (#1325, #1485)
- [編譯器] 如果聯合兩個相同型別，則返回表格型別 (#1342)
- [編譯器] 確保 `ifnull` 和 `coalesce` 的參數可以為空 (#1263)
- [編譯器] 正確使用查詢施加的表達式空值性
- [MySQL 方言] 支援 MySQL IF 陳述式
- [PostgreSQL 方言] 在 PostgreSQL 中將 NUMERIC 和 DECIMAL 檢索為 Double (#2118)
- [SQLite 方言] UPSERT 通知應考慮 BEFORE/AFTER UPDATE 觸發器 (#2198 by [Anders Ha][andersio])
- [SQLite 驅動程式] 除非在記憶體中，否則 SqliteDriver 對於執行緒使用多個連接 (#1832)
- [JDBC 驅動程式] JDBC 驅動程式假設 `autoCommit` 為 true (#2041)
- [JDBC 驅動程式] 確保在異常時關閉連接 (#2306)
- [IDE 外掛程式] 修正 Windows 上因路徑分隔符號錯誤導致 GoToDeclaration/FindUsages 損壞的問題 (#2054 by [Angus Holder][AngusH])
- [IDE 外掛程式] 忽略 Gradle 錯誤，而不是在 IDE 中崩潰。
- [IDE 外掛程式] 如果 `sqldelight` 檔案移動到非 `sqldelight` 模組，請勿嘗試程式碼生成
- [IDE 外掛程式] 忽略 IDE 中的程式碼生成錯誤
- [IDE 外掛程式] 確保我們不會嘗試負數子字串 (#2068)
- [IDE 外掛程式] 另外確保專案在執行 Gradle 動作之前未被銷毀 (#2155)
- [IDE 外掛程式] 可空型別的算術運算也應為可空 (#1853)
- [IDE 外掛程式] 使「展開 * 意圖」適用於額外的投影 (#2173 by [Alexander Perfilyev][aperfilyev])
- [IDE 外掛程式] 如果 Kotlin 解析在 GoTo 期間失敗，則不要嘗試 GoTo `sqldelight` 檔案
- [IDE 外掛程式] 如果 IntelliJ 在 `sqldelight` 索引時遇到異常，請勿崩潰
- [IDE 外掛程式] 處理在 IDE 中程式碼生成之前檢測錯誤時發生的異常
- [IDE 外掛程式] 使 IDE 外掛程式與動態外掛程式相容 (#1536)
- [Gradle 外掛程式] 使用 WorkerApi 生成資料庫的競爭條件 (#2062 by [Stéphane Nicolas][stephanenicolas])
- [Gradle 外掛程式] `classLoaderIsolation` 阻止自定義 JDBC 使用 (#2048 by [Ben Asher][BenA])
- [Gradle 外掛程式] 改善缺少 `packageName` 的錯誤訊息 (by [Niklas Baudy][vanniktech])
- [Gradle 外掛程式] SQLDelight 將 IntelliJ 依賴項洩漏到構建腳本類別路徑中 (#1998)
- [Gradle 外掛程式] 「JavadocIntegrationKt not found」編譯錯誤，在 *.sq 檔案中新增方法文件時 (#1982)
- [Gradle 外掛程式] SqlDelight Gradle 外掛程式不支援 Configuration Caching (CoCa) (#1947 by [Stéphane Nicolas][stephanenicolas])
- [SQLite JDBC 驅動程式] SQLException: 資料庫處於自動提交模式 (#1832)
- [Coroutines 擴充功能] 修正 coroutines-extensions 的 IR 後端 (#1918 by [Derek Ellis][dellisd])

另外，特別感謝 [Matthew Haughton][3flex] 在本次發布中為改善 SQLDelight 基礎設施所做的許多工作。

## [1.4.4] - 2020-10-08
### 新增
- [PostgreSQL 方言] 支援帶 WITH 的資料修改陳述式
- [PostgreSQL 方言] 支援 substring 函式
- [Gradle 外掛程式] 新增 `verifyMigrations` 標誌，用於在 SQLDelight 編譯期間驗證遷移 (#1872)

### 變更
- [編譯器] 在非 SQLite 方言中將 SQLite 特定的函式標記為未知
- [Gradle 外掛程式] 當 `sqldelight` 外掛程式已應用但未配置資料庫時發出警告 (#1421)

### 修正
- [編譯器] 報告在 ORDER BY 子句中綁定欄位名稱時的錯誤 (#1187 by [Eliezer Graber][eygraber])
- [編譯器] 在生成資料庫介面時出現 Registry 警告 (#1792)
- [編譯器] CASE 陳述式的型別推斷不正確 (#1811)
- [編譯器] 為沒有版本的遷移檔案提供更好的錯誤訊息 (#2006)
- [編譯器] 某些資料庫型別 ColumnAdapter 的所需資料庫型別錯誤 (#2012)
- [編譯器] CAST 的空值性 (#1261)
- [編譯器] 查詢包裝器中大量名稱遮蔽警告 (#1946 by [Eliezer Graber][eygraber])
- [編譯器] 生成程式碼正在使用完全限定名稱 (#1939)
- [IDE 外掛程式] 從 Gradle 同步觸發 `sqldelight` 程式碼生成
- [IDE 外掛程式] 變更 .sq 檔案時外掛程式未重新生成資料庫介面 (#1945)
- [IDE 外掛程式] 將檔案移動到新套件時出現問題 (#444)
- [IDE 外掛程式] 如果沒有地方移動游標，則不執行任何操作而不是崩潰 (#1994)
- [IDE 外掛程式] 對於 Gradle 專案之外的檔案使用空套件名稱 (#1973)
- [IDE 外掛程式] 對於無效型別優雅地失敗 (#1943)
- [IDE 外掛程式] 遇到未知表達式時拋出更好的錯誤訊息 (#1958)
- [Gradle 外掛程式] SQLDelight 將 IntelliJ 依賴項洩漏到構建腳本類別路徑中 (#1998)
- [Gradle 外掛程式] 「JavadocIntegrationKt not found」編譯錯誤，在 *.sq 檔案中新增方法文件時 (#1982)
- [Gradle 外掛程式] SqlDelight Gradle 外掛程式不支援 Configuration Caching (CoCa) (#1947 by [Stéphane Nicolas][stephanenicolas])
- [SQLite JDBC 驅動程式] SQLException: 資料庫處於自動提交模式 (#1832)
- [Coroutines 擴充功能] 修正 coroutines-extensions 的 IR 後端 (#1918 by [Derek Ellis][dellisd])

## [1.4.3] - 2020-09-04
### 新增
- [MySQL 方言] 新增支援 MySQL 的 `last_insert_id` 函式 (by [Kelvin Law][lawkai])
- [PostgreSQL 方言] 支援 SERIAL 資料型別 (by [Veyndan Stuart][VeyndanS] & [Felipe Lima][felipecsl])
- [PostgreSQL 方言] 支援 PostgreSQL RETURNING (by [Veyndan Stuart][VeyndanS])

### 修正
- [MySQL 方言] 將 MySQL AUTO_INCREMENT 視為具有預設值 (#1823)
- [編譯器] 修正 Upsert 陳述式編譯錯誤 (#1809 by [Eliezer Graber][eygraber])
- [編譯器] 修正生成無效 Kotlin 的問題 (#1925 by [Eliezer Graber][eygraber])
- [編譯器] 為未知函式提供更好的錯誤訊息 (#1843)
- [編譯器] 將字串公開為 `instr` 第二個參數的型別
- [IDE 外掛程式] 修正 IDE 外掛程式的守護程序膨脹和 UI 執行緒停滯 (#1916)
- [IDE 外掛程式] 處理 null 模組場景 (#1902)
- [IDE 外掛程式] 在未配置的 .sq 檔案中返回空字串作為套件名稱 (#1920)
- [IDE 外掛程式] 修正群組陳述式並為其新增整合測試 (#1820)
- [IDE 外掛程式] 使用內建的 ModuleUtil 尋找元素的模組 (#1854)
- [IDE 外掛程式] 僅將有效元素新增到查詢中 (#1909)
- [IDE 外掛程式] 父級可以為 null (#1857)

## [1.4.2] - 2020-08-27
### 新增
- [執行期] 支援新的 JS IR 後端
- [Gradle 外掛程式] 新增 `generateSqlDelightInterface` Gradle 任務。(by [Niklas Baudy][vanniktech])
- [Gradle 外掛程式] 新增 `verifySqlDelightMigration` Gradle 任務。(by [Niklas Baudy][vanniktech])

### 修正
- [IDE 外掛程式] 使用 Gradle 工具 API 促進 IDE 和 Gradle 之間的資料共享
- [IDE 外掛程式] 預設為 false，不從 Schema 推導
- [IDE 外掛程式] 正確檢索 `commonMain` 源集
- [MySQL 方言] 將 `minute` 新增到 `mySqlFunctionType()` (by [MaaxGr][maaxgr])

## [1.4.1] - 2020-08-21
### 新增
- [執行期] 支援 Kotlin 1.4.0 (#1859)

### 變更
- [Gradle 外掛程式] 將 AGP 依賴項變更為 `compileOnly` (#1362)

### 修正
- [編譯器] 新增可選的 Javadoc 到欄位定義規則和表格介面生成器 (#1224 by [Daniel Eke][endanke])
- [SQLite 方言] 新增支援 SQLite FTS5 輔助函式 `highlight`、`snippet` 和 `bm25` (by [Daniel Rampelt][drampelt])
- [MySQL 方言] 支援 MySQL 位元資料型別
- [MySQL 方言] 支援 MySQL 二進位字面量
- [PostgreSQL 方言] 從 `sql-psi` 公開 SERIAL (by [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 新增 BOOLEAN 資料型別 (by [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 新增 NULL 欄位約束 (by [Veyndan Stuart][VeyndanS])
- [HSQL 方言] 為 HSQL 新增 `AUTO_INCREMENT` 支援 (by [Ryan Harter][rharter])

## [1.4.0] - 2020-06-22
### 新增
- [MySQL 方言] MySQL 支援 (by [Jeff Gulbronson][JeffG] & [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 實驗性 PostgreSQL 支援 (by [Veyndan Stuart][VeyndanS])
- [HSQL 方言] 實驗性 H2 支援 (by [Marius Volkhart][MariusV])
- [SQLite 方言] SQLite FTS5 支援 (by [Ben Asher][BenA] & [James Palawaga][JamesP])
- [SQLite 方言] 支援 `ALTER TABLE RENAME COLUMN` (#1505 by [Angus Holder][AngusH])
- [IDE] IDE 對遷移 (.sqm) 檔案的支援
- [IDE] 新增模仿內建 SQL Live Templates 的 SQLDelight Live Templates (#1154 by [Veyndan Stuart][VeyndanS])
- [IDE] 新增 New SqlDelight file action (#42 by [Roman Zavarnitsyn][RomanZ])
- [執行期] `transactionWithReturn` API，用於返回結果的交易
- [編譯器] 用於在 .sq 檔案中將多個 SQL 陳述式分組的語法
- [編譯器] 支援從遷移檔案生成 Schema
- [Gradle 外掛程式] 新增一個任務，用於將遷移檔案輸出為有效的 SQL

### 變更
- [文件] 文件網站大修 (by [Saket Narayan][SaketN])
- [Gradle 外掛程式] 改善不支援方言的錯誤訊息 (by [Veyndan Stuart][VeyndanS])
- [IDE] 根據方言動態更改檔案圖示 (by [Veyndan Stuart][VeyndanS])
- [JDBC 驅動程式] 從 `javax.sql.DataSource` 公開 `JdbcDriver` 建構函式 (#1614)

### 修正
- [編譯器] 支援表格上的 Javadoc 並修正一個檔案中的多個 Javadoc (#1224)
- [編譯器] 啟用為合成欄位插入值 (#1351)
- [編譯器] 修正目錄名稱淨化中的不一致 (by [Zac Sweers][ZacSweers])
- [編譯器] 合成欄位應在連接中保留空值性 (#1656)
- [編譯器] 將刪除陳述式固定在 `DELETE` 關鍵字上 (#1643)
- [編譯器] 修正引用 (#1525 by [Angus Holder][AngusH])
- [編譯器] 修正 BETWEEN 運算子，使其正確遞迴到表達式中 (#1279)
- [編譯器] 為缺少表格/欄位時建立索引提供更好的錯誤 (#1372)
- [編譯器] 啟用在連接約束中使用外部查詢的投影 (#1346)
- [原生驅動程式] 使 `execute` 使用 `transactionPool` (by [Ben Asher][BenA])
- [JDBC 驅動程式] 使用 JDBC 交易 API 而不是 SQLite (#1693)
- [IDE] 修正 `virtualFile` 引用始終指向原始檔案 (#1782)
- [IDE] 在向 Bugsnag 報告錯誤時使用正確的可拋出物件 (#1262)
- [分頁擴充功能] 修正有洩漏的 DataSource (#1628)
- [Gradle 外掛程式] 如果生成 Schema 時輸出資料庫檔案已存在，則將其刪除 (#1645)
- [Gradle 外掛程式] 如果存在間隙，則遷移驗證失敗
- [Gradle 外掛程式] 明確使用我們設定的檔案索引 (#1644)

## [1.3.0] - 2020-04-03

* 新增：[Gradle] `dialect` 屬性，用於指定要編譯的 SQL 方言。
* 新增：[編譯器] #1009 MySQL 方言的實驗性支援。
* 新增：[編譯器] #1436 支援 `sqlite:3.24` 方言和 UPSERT。
* 新增：[JDBC 驅動程式] 將 JDBC 驅動程式從 SQLite JVM 驅動程式中分離出來。
* 修正：[編譯器] #1199 支援任意長度的 Lambda。
* 修正：[編譯器] #1610 修正 `avg()` 的返回型別為可空。
* 修正：[IntelliJ] #1594 修正路徑分隔符號處理，此問題導致 Windows 上 Goto 和 Find Usages 崩潰。

## [1.2.2] - 2020-01-22

* 新增：[執行期] 支援 Windows (mingW)、tvOS、watchOS 和 macOS 架構。
* 修正：[編譯器] `sum()` 的返回型別應為可空。
* 修正：[分頁] 將 `Transacter` 傳入 `QueryDataSourceFactory` 以避免競爭條件。
* 修正：[IntelliJ 外掛程式] 在尋找檔案的套件名稱時不要搜尋依賴項。
* 修正：[Gradle] #862 更改 Gradle 中的驗證器日誌級別為調試級別。
* 增強：[Gradle] 將 `GenerateSchemaTask` 轉換為使用 Gradle worker。
* 注意：`sqldelight-runtime` artifact 已更名為 `runtime`。

## [1.2.1] - 2019-12-11

* 修正：[Gradle] Kotlin Native 1.3.60 支援。
* 修正：[Gradle] #1287 同步時警告。
* 修正：[編譯器] #1469 查詢的 `SynetheticAccessor` 建立。
* 修正：[JVM 驅動程式] 修正記憶體洩漏。
* 注意：`kotlinx bintray maven` 倉庫需要新增到您的 `buildscript` 中，以支持協程擴展 artifact。

## [1.2.0] - 2019-08-30

* 新增：[執行期] 穩定的 Flow API。
* 修正：[Gradle] Kotlin Native 1.3.50 支援。
* 修正：[Gradle] #1380 Clean build 有時會失敗。
* 修正：[Gradle] #1348 執行驗證任務時列印「無法檢索函式」。
* 修正：[編譯] #1405 如果查詢包含 FTS 表格連接，則無法建構專案。
* 修正：[Gradle] #1266 具有多個資料庫模組時 Gradle 建構偶爾失敗。

## [1.1.4] - 2019-07-11

* 新增：[執行期] 實驗性 Kotlin Flow API。
* 修正：[Gradle] Kotlin/Native 1.3.40 相容性。
* 修正：[Gradle] #1243 修正 SQLDelight 與 Gradle configure-on-demand 的使用。
* 修正：[Gradle] #1385 修正 SQLDelight 與增量註解處理的使用。
* 修正：[Gradle] 允許 Gradle 任務緩存。
* 修正：[Gradle] #1274 啟用與 Kotlin DSL 一起使用 SQLDelight 擴充功能。
* 修正：[編譯器] 為每個查詢確定性地生成唯一 ID。
* 修正：[編譯器] 僅在交易完成時通知監聽查詢。
* 修正：[JVM 驅動程式] #1370 強制 `JdbcSqliteDriver` 使用者提供資料庫 URL。

## [1.1.3] - 2019-04-14

* Gradle Metadata 1.0 版本發布。

## [1.1.2] - 2019-04-14

* 新增：[執行期] #1267 記錄驅動程式裝飾器。
* 修正：[編譯器] #1254 分割長度超過 2^16 字元的字串字面量。
* 修正：[Gradle] #1260 在多平台專案中，生成的來源被識別為 iOS 來源。
* 修正：[IDE] #1290 `kotlin.KotlinNullPointerException` 在 `CopyAsSqliteAction.kt:43` 中。
* 修正：[Gradle] #1268 在最近版本中執行 `linkDebugFrameworkIos*` 任務失敗。

## [1.1.1] - 2019-03-01

* 修正：[Gradle] 修正 Android 專案的模組依賴編譯。
* 修正：[Gradle] #1246 在 `afterEvaluate` 中設定 API 依賴項。
* 修正：[編譯器] 陣列型別正確列印。

## [1.1.0] - 2019-02-27

* 新增：[Gradle] #502 允許指定 Schema 模組依賴項。
* 增強：[編譯器] #1111 表格錯誤在其他錯誤之前排序。
* 修正：[編譯器] #1225 返回 REAL 字面量的正確型別。
* 修正：[編譯器] #1218 docid 透過觸發器傳播。

## [1.0.3] - 2019-01-30

* 增強：[執行期] #1195 原生驅動程式/執行期 Arm32。
* 增強：[執行期] #1190 從 Query 型別公開 mapper。

## [1.0.2] - 2019-01-26

* 修正：[Gradle 外掛程式] 更新至 Kotlin 1.3.20。
* 修正：[執行期] 交易不再吞噬異常。

## [1.0.1] - 2019-01-21

* 增強：[原生驅動程式] 允許將目錄名稱傳遞給 `DatabaseConfiguration`。
* 增強：[編譯器] #1173 沒有套件的檔案編譯失敗。
* 修正：[IDE] 正確向 Square 報告 IDE 錯誤。
* 修正：[IDE] #1162 相同套件中的型別顯示為錯誤但工作正常。
* 修正：[IDE] #1166 重新命名表格導致 NPE。
* 修正：[編譯器] #1167 在嘗試解析帶有 UNION 和 SELECT 的複雜 SQL 陳述式時拋出異常。

## [1.0.0] - 2019-01-08

* 新增：生成的程式碼全面翻新，現在使用 Kotlin。
* 新增：RxJava2 擴充功能 artifact。
* 新增：Android 分頁擴充功能 artifact。
* 新增：Kotlin Multiplatform 支援。
* 新增：Android、iOS 和 JVM SQLite 驅動程式 artifact。
* 新增：交易 API。

## [0.7.0] - 2018-02-12

* 新增：生成的程式碼已更新為僅使用 Support SQLite 函式庫。所有查詢現在都生成陳述式物件，而不是原始字串。
* 新增：IDE 中的陳述式摺疊。
* 新增：布林型別現在自動處理。
* 修正：從程式碼生成中移除棄用的 marshals。
* 修正：正確將 `avg` SQL 函式型別映射為 REAL。
* 修正：正確檢測 `julianday` SQL 函式。

## [0.6.1] - 2017-03-22

* 新增：沒有引數的 DELETE、UPDATE 和 INSERT 陳述式會生成編譯陳述式。
* 修正：在子查詢中使用的視圖內的 USING 子句不再報錯。
* 修正：移除生成的 Mapper 中的重複型別。
* 修正：子查詢可以用於檢查引數的表達式。

## [0.6.0] - 2017-03-06

* 新增：SELECT 查詢現在以 `SqlDelightStatement` 工廠的形式公開，而不是字串常數。
* 新增：查詢 Javadoc 現在複製到陳述式和 Mapper 工廠。
* 新增：為視圖名稱發出字串常數。
* 修正：需要工廠的視圖上的查詢現在正確要求這些工廠作為引數。
* 修正：驗證插入的引數數量與指定的欄位數量匹配。
* 修正：正確編碼在 WHERE 子句中使用的 BLOB 字面量。
* 此版本需要 Gradle 3.3 或更高版本。

## [0.5.1] - 2016-10-24

* 新增：編譯的陳述式擴展抽象型別。
* 修正：參數中的原始型別如果為可空將會被裝箱。
* 修正：Factory 方法中存在所有綁定引數所需的工廠。
* 修正：轉義的欄位名稱正確地被封送。

## [0.5.0] - 2016-10-19

* 新增：SQLite 引數可以透過 Factory 安全地傳遞型別。
* 新增：IntelliJ 外掛程式對 .sq 檔案執行格式化。
* 新增：支援 SQLite 時間戳字面量。
* 修正：參數化型別可以在 IntelliJ 中點擊進入。
* 修正：轉義的欄位名稱不再從 Cursor 中取得時拋出 RuntimeExceptions。
* 修正：Gradle 外掛程式在嘗試列印異常時不會崩潰。

## [0.4.4] - 2016-07-20

* 新增：原生存取 `short` 型別作為欄位 Java 型別
* 新增：生成的 mappers 和 factory 方法上的 Javadoc
* 修正：`group_concat` 和 `nullif` 函式具有正確的空值性
* 修正：與 Android Studio 2.2-alpha 的相容性
* 修正：`WITH RECURSIVE` 不再使外掛程式崩潰

## [0.4.3] - 2016-07-07

* 新增：編譯錯誤會連結到源檔案。
* 新增：右鍵複製 SQLDelight 程式碼作為有效的 SQLite。
* 新增：具名陳述式上的 Javadoc 將出現在生成的字串上。
* 修正：生成的視圖模型包含空值性註解。
* 修正：聯合查詢生成的程式碼具有正確的型別和空值性，以支援所有可能的欄位。
* 修正：`sum` 和 `round` SQLite 函式在生成的程式碼中具有正確的型別。
* 修正：CAST、內部 SELECT 錯誤修正。
* 修正：CREATE TABLE 陳述式中的自動補全。
* 修正：SQLite 關鍵字可以用於套件名稱。

## [0.4.2] - 2016-06-16

* 新增：Marshal 可以從工廠建立。
* 修正：IntelliJ 外掛程式生成具有正確泛型順序的工廠方法。
* 修正：函式名稱可以使用任何大小寫。

## [0.4.1] - 2016-06-14

* 修正：IntelliJ 外掛程式生成具有正確泛型順序的類別。
* 修正：欄位定義可以使用任何大小寫。

## [0.4.0] - 2016-06-14

* 新增：Mappers 按查詢而不是按表格生成。
* 新增：Java 型別可以在 .sq 檔案中匯入。
* 新增：SQLite 函式已驗證。
* 修正：移除重複錯誤。
* 修正：大寫欄位名稱和 Java 關鍵字欄位名稱不會報錯。

## [0.3.2] - 2016-05-14

* 新增：自動補全和尋找使用現在適用於視圖和別名。
* 修正：編譯時驗證現在允許在 SELECT 中使用函式。
* 修正：支援僅宣告預設值的 INSERT 陳述式。
* 修正：未安裝 SQLDelight 的專案被匯入時外掛程式不再崩潰。

## [0.3.1] - 2016-04-27

* 修正：介面可見性已更改回 `public`，以避免方法引用引起的非法存取執行期異常。
* 修正：子表達式正確求值。

## [0.3.0] - 2016-04-26

* 新增：欄位定義使用 SQLite 型別，並且可以有額外的「AS」約束來指定 Java 型別。
* 新增：錯誤報告可以從 IDE 發送。
* 修正：自動補全功能正常。
* 修正：SQLDelight 模型檔案在 .sq 檔案編輯時更新。
* 移除：不再支援附加資料庫。

## [0.2.2] - 2016-03-07

* 新增：對 INSERT、UPDATE、DELETE、INDEX 和 TRIGGER 陳述式所用欄位的編譯時驗證。
* 修正：移動/建立檔案時 IDE 外掛程式不會崩潰。

## [0.2.1] - 2016-03-07

* 新增：Ctrl+`/` (Cmd+`/` on OSX) 切換選定行 (或多行) 的註釋。
* 新增：對 SQL 查詢中使用的欄位進行編譯時驗證。
* 修正：支援 IDE 和 Gradle 外掛程式中的 Windows 路徑。

## [0.2.0] - 2016-02-29

* 新增：為 Marshal 類別新增複製建構函式。
* 新增：更新至 Kotlin 1.0 正式版。
* 修正：以非失敗方式報告「sqldelight」資料夾結構問題。
* 修正：禁止命名為 `table_name` 的欄位。它們生成的常數與表格名稱常數衝突。
* 修正：確保 IDE 外掛程式立即生成模型類別，無論 .sq 檔案是否已開啟。
* 修正：支援 IDE 和 Gradle 外掛程式中的 Windows 路徑。

## [0.1.2] - 2016-02-13

* 修正：移除阻止 Gradle 外掛程式在大多數專案中使用的程式碼。
* 修正：新增對 Antlr 執行期的缺少編譯器依賴。

## [0.1.1] - 2016-02-12

* 修正：確保 Gradle 外掛程式指向與自身相同的執行期版本。

## [0.1.0] - 2016-02-12

初次發布。

[JeffG]: https://github.com/JGulbronson
[VeyndanS]: https://github.com/veyndan
[BenA]: https://github.com/benasher44
[JamesP]: https://github.com/jpalawaga
[MariusV]: https://github.com/MariusVolkhart
[SaketN]: https://github.com/saket
[RomanZ]: https://github.com/romtsn
[ZacSweers]: https://github.com/ZacSweers
[AngusH]: https://github.com/angusholder
[drampelt]: https://github.com/drampelt
[endanke]: https://github.com/endanke
[rharter]: https://github.com/rharter
[vanniktech]: https://github.com/vanniktech
[maaxgr]: https://github.com/maaxgr
[eygraber]: https://github.com/eygraber
[lawkai]: https://github.com/lawkai
[felipecsl]: https://github.com/felipecsl
[dellisd]: https://github.com/dellisd
[stephanenicolas]: https://github.com/stephanenicolas
[oldergod]: https://github.com/oldergod
[qjroberts]: https://github.com/qjroberts
[kevincianfarini]: https://github.com/kevincianfarini
[andersio]: https://github.com/andersio
[ilmat192]: https://github.com/ilmat192
[3flex]: https://github.com/3flex
[aperfilyev]: https://github.com/aperfilyev
[satook]: https://github.com/Satook
[thomascjy]: https://github.com/ThomasCJY
[pyricau]: https://github.com/pyricau
[hannesstruss]: https://github.com/hannesstruss
[martinbonnin]: https://github.com/martinbonnin
[enginegl]: https://github.com/enginegl
[pchmielowski]: https://github.com/pchmielowski
[chippmann]: https://github.com/chippmann
[IliasRedissi]: https://github.com/IliasRedissi
[ahmedre]: https://github.com/ahmedre
[pabl0rg]: https://github.com/pabl0rg
[hfhbd]: https://github.com/hfhbd
[sdoward]: https://github.com/sdoward
[PhilipDukhov]: https://github.com/PhilipDukhov
[julioromano]: https://github.com/julioromano
[PaulWoitaschek]: https://github.com/PaulWoitaschek
[kpgalligan]: https://github.com/kpgalligan
[robx]: https://github.com/robxyy
[madisp]: https://github.com/madisp
[svenjacobs]: https://github.com/svenjacobs
[jeffdgr8]: https://github.com/jeffdgr8
[bellatoris]: https://github.com/bellatoris
[sachera]: https://github.com/sachera
[sproctor]: https://github.com/sproctor
[davidwheeler123]: https://github.com/davidwheeler123
[C2H6O]: https://github.com/C2H6O
[griffio]: https://github.com/griffio
[shellderp]: https://github.com/shellderp
[joshfriend]: https://github.com/joshfriend
[daio]: https://github.com/daio
[morki]: https://github.com/morki
[Adriel-M]: https://github.com/Adriel-M
[05nelsonm]: https://github.com/05nelsonm
[jingwei99]: https://github.com/jingwei99
[anddani]: https://github.com/anddani
[BoD]: https://github.com/BoD
[de-luca]: https://github.com/de-luca
[MohamadJaara]: https://github.com/MohamadJaara
[nwagu]: https://github.com/nwagu
[IlyaGulya]: https://github.com/IlyaGulya
[edenman]: https://github.com/edenman
[vitorhugods]: https://github.com/vitorhugods
[evant]: https://github.com/evant
[TheMrMilchmann]: https://github.com/TheMrMilchmann
[drewd]: https://github.com/drewd
[orenkislev-faire]: https://github.com/orenkislev-faire
[janbina]: https://github.com/janbina
[DRSchlaubi]: https://github.com/DRSchlaubi