# 更新日志

## 未发布

### 已添加
- [原生驱动程序] 为 `inMemoryDriver` 添加了 `extendedConfig` 形参 (#5539 由 @GuilhE 贡献)
- [PostgreSQL 方言] 添加了对隐式定义的系统列 (System Columns) 的查询支持 (#5834 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了基础数组字面量 (Array literal) 支持 (#5997 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了基础 LTREE 支持 (#5880 由 @yesitskev @griffio 贡献)
- [MySQL 方言] 添加了对 INET 函数的支持 (#5072 由 @mcxinyu 贡献)
- [PostgreSQL 方言] 添加了对 `ALTER INDEX` 的支持 (#6224 由 @griffio 贡献)
- [SQLite 方言] 添加了对 SQLite 3.44 聚合函数 `DISTINCT`、`ORDER BY` 和 `FILTER` 的支持 (#6236 由 @griffio 贡献)
- [SQLite 方言] 添加了对 SQLite 3.37 STRICT 表的支持 (#6230 由 @griffio 贡献)
- [Gradle 插件] 添加了通过 `codegenExcludedColumns` 从生成的模型中排除列的支持 (#6243 由 @sokolikp 贡献)
- [编译器] 在架构中添加了 `allTableNames` 函数 (#6245 由 @edenman 贡献)
- [PostgreSQL 方言] 添加了对 `ANY` 运算符的支持 (#6253 由 @griffio 贡献)
- [SQLite 方言] 为 SQLite 3.39 添加了对 `RIGHT JOIN` 和 `FULL JOIN` 的支持 (#6273 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对触发器函数中 `RAISE` 语句和 `FOUND` 变量的支持 (#6297 由 @griffio 贡献)

### 已变更
- [PostgreSQL 方言] 将 `arrayIntermediateType` 的可见性更改为 public (#5835 由 @griffio 贡献)
- [Gradle 插件] 实现了更严格的 `MigrationFile` 版本控制 (#5730 由 @madisp 贡献)
- [Gradle 插件] 将最低支持的 Gradle 版本提高到 8.2.1 (#6217 由 @maxsav 贡献)
- [Gradle 插件] 支持 Gradle 隔离项目 (isolated projects) (#6217 由 @maxsav 贡献)
- [IntelliJ 插件] 最低版本要求为 2023.3 / Android Studio Jellyfish

### 已修复
- [Gradle 插件] 抑制 JDK 24+ 上编译器工作程序 (compiler worker) 的 `sun.misc.Unsafe` 弃用警告 (#6321)
- [编译器] 抑制生成代码中的 Kotlin 额外警告 (#6208 由 @eyupcanakman 贡献)
- [编译器] 非分组聚合结果集中的其他列始终为可为 null
- [PostgreSQL 方言] 正确解析 `coalesce` 和 `ifnull` 的为 null 性
- [PostgreSQL 方言] 修复了 PostgreSQL 方言的 IDE 集成
- [PostgreSQL 方言] 改进了 PostgreSQL 方言的 IDE 插件 (#6209 由 @griffio 贡献)
- [IntelliJ 插件] IDE 插件可以为所有方言执行代码补全 (#6210 由 @griffio 贡献)
- [Gradle 插件] 修复了运行验证数据库任务时的循环依赖错误 (#6221 由 @griffio 贡献)
- [编译器] 修复了多行更新的乐观锁问题 (#6240 由 @griffio 贡献)
- [IntelliJ 插件] 修复了在 IDEA 2026.2 中导致崩溃的弃用 (deprecation) 问题 (#6247 由 @griffio 贡献)
- [Gradle 插件] 修复了生成的源码在 AGP 8.9 到 8.11 上未被 Kotlin 编译拾取的问题
- [PostgreSQL 方言] 修复了 `lower` 和 `upper` 函数使用原始绑定实参时默认为 `TEXT` 的问题 (#6262 由 @griffio 贡献)
- [编译器] 修复了使用适配器且迁移更改了为 null 性时，通过数据类绑定插入值的问题 (#6269 由 @griffio 贡献)
- [编译器] 在使用 null 安全运算符（`IS` 和 `IS DISTINCT FROM`）时使用可为 null 的绑定实参 (#6265 由 @griffio 贡献)
- [Gradle 插件] 为项目依赖项使用 AGP 的变体解析 (#6217 由 @maxsav 贡献)
- [Gradle 插件] 修复了当构建之间的 AGP 变体列表不同时，`generateDatabaseInterface` 出现的构建缓存未命中问题
- [Gradle 插件] 修复了在未配置任何数据库的情况下应用插件时导致的 IDE 同步崩溃问题 (#6088)
- [PostgreSQL 方言] 修复了使用嵌套函数调用时的 JSON 聚合函数问题 (#6281 由 @griffio 贡献)
- [Paging3 扩展] 修复了数据库为空时 `KeyedQueryPagingSource` 崩溃的问题 (#6284 由 @woods-marshes 贡献)
- [编译器] 修复了当变更器语句与 `COALESCE` 等封装函数一起使用时出现的 Java 类型适配器问题 (#6292 由 @griffio 贡献)
- [编译器] 修复了模块名称大写时，生成的代码包名也大写的问题 (#6316 由 @griffio 贡献)
- [PostgreSQL 方言] 允许日期数据类型不区分大小写 (#6328 由 @griffio 贡献)

## [2.3.2] - 2026-03-16
[2.3.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.3.2

### 已添加
- [PostgreSQL 方言] 改进了对 `ALTER TABLE ALTER TYPE USING` 表达式的支持 (#6116 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对 `DROP COLUMN IF EXISTS` 的支持 (#6112 由 @griffio 贡献)
- [Gradle 插件] 添加了 `expandSelectStar` 标志以关闭 Select 通配符扩展 (#5813 由 @griffio 贡献)
- [MySQL 方言] 添加了对窗口函数 (Window Functions) 的支持 (#6086 由 @griffio 贡献)
- [Gradle 插件] 修复了当起始架构版本不为 1 且 `verifyMigrations` 为 `true` 时的构建失败问题 (#6017 由 @neilgmiller 贡献)
- [Gradle 插件] 使 `SqlDelightWorkerTask` 更具可配置性，并更新默认配置以支持在 Windows 上开发 (#5215 由 @MSDarwish2000 贡献)
- [SQLite 方言] 添加了对 FTS5 虚表中合成列的支持 (#5986 由 @watbe 贡献)
- [PostgreSQL 方言] 添加了对 Postgres 行级安全性的支持 (#6087 由 @shellderp 贡献)
- [PostgreSQL 方言] 扩展了 `FOR UPDATE` 以支持 `OF table`、`NO KEY UPDATE`、`NO WAIT` (#6104 由 @shellderp 贡献)
- [PostgreSQL 方言] 支持 Postgis `Point` 类型及相关函数 (#5602 由 @vanniktech 贡献)
- [运行时] 添加了 `SuspendingTransacter.TransactionDispatcher`，提供了一种控制事务 `CoroutineContext` 的机制 (#5967 由 @eygraber 贡献)
- [Gradle 插件] 与 Android Gradle 插件 9.0 的新 DSL 完全兼容。 (#6140)
- [PostgreSQL 方言] 支持 PostgreSQL `CREATE TABLE` 存储参数 (#6148 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 PostgreSQL 唯一表约束可为 null 的结果列问题 (#6167 由 @griffio 贡献)

### 已变更
- [编译器] 将编译器输出类型从 `java.lang.Void` 更改为 `kotlin.Nothing` (#6099 由 @griffio 贡献)
- [编译器] 允许在软件包名称中使用下划线。之前下划线会被清理，导致出现非预期的行为 (#6027 由 @BierDav 贡献)
- [Paging 扩展] 切换到 AndroidX Paging (#5910 由 @jeffdgr8 贡献)
- [Android 驱动程序] 将 Android `minSdk` 提高到 23。 (#6141)
- [Paging 扩展] 升级至 Paging 3.4.1，并移除了 X64 Apple 目标。 (#6166)

### 已修复
- [IntelliJ 插件] 修复了由于在 VFS 刷新事件期间阻塞 EDT 上的文件类型检测而导致的 IDE 冻结问题。
- [SQLite 方言] 修复了使用 JSON 路径运算符时的 SQLite 3.38 编译错误 (#6070 由 @griffio 贡献)
- [SQLite 方言] 使用自定义列类型时，为 `group_concat` 函数使用 `String` 类型 (#6082 由 @griffio 贡献)
- [Gradle 插件] 改进了 `VerifyMigrationTask` 的性能，防止其在复杂的架构上卡死 (#6073 由 @Lightwood13 贡献)
- [IntelliJ 插件] 修复了插件初始化异常并更新了过时的方法 (#6040 由 @griffio 贡献)
- [Gradle 插件] 修复了与 Android Gradle 插件内置 Kotlin 的兼容性问题 (#6139)

## [2.3.1] - 2025-03-12
[2.3.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.3.1

发布失败。请使用 2.3.2！

## [2.3.0] - 2025-03-12
[2.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.3.0

发布失败。请使用 2.3.2！

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 已添加
- [PostgreSQL 方言] 修复了 Postgres `numeric`/`integer`/`biginteger` 类型映射 (#5994 由 @griffio 贡献)
- [编译器] 改进了编译器错误消息，以便在需要 `CAST` 时包含源文件位置 (#5979 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对 Postgres JSON 运算符路径提取的支持 (#5971 由 @griffio 贡献)
- [SQLite 方言] 为使用公用表表达式的 `MATERIALIZED` 查询计划程序提示添加了 SQLite 3.35 支持 (#5961 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对使用公用表表达式的 `MATERIALIZED` 查询计划程序提示的支持 (#5961 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对 Postgres JSON 聚合 `FILTER` 的支持 (#5957 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对 Postgres 枚举的支持 (#5935 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对 Postgres 触发器的有限支持 (#5932 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了检查 SQL 表达式是否可以解析为 JSON 的谓词 (#5843 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对 PostgreSQL `COMMENT ON` 语句的有限支持 (#5808 由 @griffio 贡献)
- [MySQL 方言] 添加了对索引可见性选项的支持 (#5785 由 @orenkislev-faire 贡献)
- [PostgreSQL 方言] 添加了对 `TSQUERY` 数据类型的支持 (#5779 由 @griffio 贡献)
- [Gradle 插件] 添加模块时增加了对版本目录的支持 (#5755 由 @DRSchlaubi 贡献)

### 已变更
- 开发中的快照现在发布到位于 https://central.sonatype.com/repository/maven-snapshots/ 的 Central Portal Snapshots 仓库。
- [编译器] 使用构造函数引用简化了默认生成的查询 (#5814 由 @jonapoul 贡献)

### 已修复
- [编译器] 修复了使用包含公用表表达式的视图时的堆栈溢出问题 (#5928 由 @griffio 贡献)
- [Gradle 插件] 修复了打开 SqlDelight 工具窗口以添加“新连接”时的崩溃问题 (#5906 由 @griffio 贡献)
- [IntelliJ 插件] 避免了 `copy-to-sqlite` 装订区域操作中与线程相关的崩溃 (#5901 由 @griffio 贡献)
- [IntelliJ 插件] 修复了使用架构语句 `CREATE INDEX` 和 `CREATE VIEW` 时的 PostgreSQL 方言问题 (#5772 由 @griffio 贡献)
- [编译器] 修复了引用列时的 FTS 堆栈溢出问题 (#5896 由 @griffio 贡献)
- [编译器] 修复了 `WITH RECURSIVE` 堆栈溢出问题 (#5892 由 @griffio 贡献)
- [编译器] 修复了 `INSERT|UPDATE|DELETE RETURNING` 语句的通知 (Notify) 问题 (#5851 由 @griffio 贡献)
- [编译器] 修复了返回 `Long` 的事务块的异步结果类型 (#5836 由 @griffio 贡献)
- [编译器] 将 SQL 参数绑定的复杂度从 O(n²) 优化到 O(n) (#5898 由 @chenf7 贡献)
- [SQLite 方言] 修复了 SQLite 3.18 缺失函数的问题 (#5759 由 @griffio 贡献)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

发布失败，构件仅部分发布。请使用 2.2.1！

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 已添加
- [WASM 驱动程序] 为 Web 工作线程驱动程序添加了对 `wasmJs` 的支持 (#5534 由 @IlyaGulya 贡献)
- [PostgreSQL 方言] 支持 PostgreSQL `UNNEST` 数组到行 (#5673 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `TSRANGE`/`TSTZRANGE` 支持 (#5297 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `RIGHT FULL JOIN` (#5086 由 @griffio 贡献)
- [PostgreSQL 方言] 从时间类型中提取 PostgreSQL 数据 (#5273 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL 数组包含运算符 (#4933 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL 删除约束 (#5288 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL 类型转换 (#5089 由 @griffio 贡献)
- [PostgreSQL 方言] 用于子查询的 PostgreSQL `LATERAL JOIN` 运算符 (#5122 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `ILIKE` 运算符 (#5330 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `XML` 类型 (#5331 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `AT TIME ZONE` (#5243 由 @griffio 贡献)
- [PostgreSQL 方言] 支持 PostgreSQL `ORDER BY NULLS` (#5199 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 PostgreSQL 当前日期/时间函数支持 (#5226 由 @drewd 贡献)
- [PostgreSQL 方言] PostgreSQL 正则表达式运算符 (#5137 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 `BRIN GIST` (#5059 由 @griffio 贡献)
- [MySQL 方言] 为 MySQL 方言支持 `RENAME INDEX` (#5212 由 @orenkislev-faire 贡献)
- [JSON 扩展] 为 JSON 表函数添加了别名 (#5372 由 @griffio 贡献)

### 已变更
- [编译器] 生成的查询文件为简单的变更器返回行计数 (#4578 由 @MariusVolkhart 贡献)
- [原生驱动程序] 更新 `NativeSqlDatabase.kt` 以更改 `DELETE`、`INSERT` 和 `UPDATE` 语句的 `readonly` 标志 (#5680 由 @griffio 贡献)
- [PostgreSQL 方言] 将 `PgInterval` 更改为 `String` (#5403 由 @griffio 贡献)
- [PostgreSQL 方言] 支持 SqlDelight 模块实现 PostgreSQL 扩展 (#5677 由 @griffio 贡献)

### 已修复
- [编译器] 修复：执行带结果的分组语句时通知查询 (#5006 由 @vitorhugods 贡献)
- [编译器] 修复了 `SqlDelightModule` 类型解析器 (#5625 由 @griffio 贡献)
- [编译器] 修复了 5501 插入对象转义列的问题 (#5503 由 @griffio 贡献)
- [编译器] 编译器：改进了错误消息，使路径链接在正确的行 and 字符位置可点击 (#5604 由 @vanniktech 贡献)
- [编译器] 修复问题 5298：允许将关键字用作表名
- [编译器] 修复命名的执行并添加测试
- [编译器] 在排序初始化语句时考虑外键表约束 (#5325 由 @TheMrMilchmann 贡献)
- [编译器] 在涉及制表符时正确对齐错误波浪下划线 (#5224 由 @drewd 贡献)
- [JDBC 驱动程序] 修复了事务结束期间 `connectionManager` 的内存泄漏问题
- [JDBC 驱动程序] 按照文档所述在事务内运行 SQLite 迁移 (#5218 由 @morki 贡献)
- [JDBC 驱动程序] 修复了事务提交/回滚后泄漏连接的问题 (#5205 由 @morki 贡献)
- [Gradle 插件] 在 `GenerateSchemaTask` 之前执行 `DriverInitializer` (#5562 由 @nwagu 贡献)
- [运行时] 修复了当真实驱动程序为 `Async` 时 `LogSqliteDriver` 中的崩溃问题 (#5723 由 @edenman 贡献)
- [运行时] 修复了 `StringBuilder` 容量问题 (#5192 由 @janbina 贡献)
- [PostgreSQL 方言] PostgreSQL 创建或替换视图 (#5407 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `to_json` (#5606 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL 数字解析器 (#5399 由 @griffio 贡献)
- [PostgreSQL 方言] SQLite 窗口函数 (#2799 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `SELECT DISTINCT ON` (#5345 由 @griffio 贡献)
- [PostgreSQL 方言] `ALTER TABLE ADD COLUMN IF NOT EXISTS` (#5309 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL 异步绑定参数 (#5313 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL 布尔字面量 (#5262 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL 窗口函数 (#5155 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `isNull` `isNotNull` 类型 (#5173 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL `SELECT DISTINCT` (#5172 由 @griffio 贡献)
- [Paging 扩展] 分页刷新初始加载修复 (#5615 由 @evant 贡献)
- [Paging 扩展] 添加了 macOS 原生目标 (#5324 由 @vitorhugods 贡献)
- [IntelliJ 插件] K2 支持

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 已添加
- [PostgreSQL 方言] 添加了 PostgreSQL `STRING_AGG` 函数 (#4950 由 @anddani 贡献)
- [PostgreSQL 方言] 在 PostgreSQL 方言中添加了 `SET` 语句 (#4927 由 @de-luca 贡献)
- [PostgreSQL 方言] 添加了 PostgreSQL 修改列序列参数 (#4916 由 @griffio 贡献)
- [PostgreSQL 方言] 为插入语句添加了 PostgreSQL 修改列默认值支持 (#4912 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 PostgreSQL 修改序列和删除序列 (#4920 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 Postgres 正则表达式函数定义 (#5025 由 @MariusVolkhart 贡献)
- [PostgreSQL 方言] 添加了 GIN 的语法 (#5027 由 @griffio 贡献)

### 已变更
- [IDE 插件] 最低版本要求为 2023.1 / Android Studio Iguana
- [编译器] 允许在 `encapsulatingType` 中重写类型为 null 性 (#4882 由 @eygraber 贡献)
- [编译器] 内联 `SELECT *` 的列名
- [Gradle 插件] 切换到 `processIsolation` (#5068 由 @nwagu 贡献)
- [Android 运行时] 将 Android `minSdk` 提高到 21 (#5094 由 @hfhbd 贡献)
- [驱动程序] 为方言作者公开更多 JDBC/R2DBC 语句方法 (#5098 由 @hfhbd 贡献)

### 已修复
- [PostgreSQL 方言] 修复了 PostgreSQL 修改表修改列 (#4868 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4448 表模型缺失导入的问题 (#4885 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4932 PostgreSQL 默认约束函数 (#4934 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4879 迁移期间修改表重命名列中的 PostgreSQL 类转换错误 (#4880 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4474 PostgreSQL 创建扩展 (#4541 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 5018 PostgreSQL 添加主键不可为 null 类型的问题 (#5020 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4703 聚合表达式 (#5071 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 5028 PostgreSQL JSON (#5030 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 5040 PostgreSQL JSON 运算符 (#5041 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 5040 的 JSON 运算符绑定 (#5100 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 5082 `tsvector` (#5104 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 5032 PostgreSQL `UPDATE FROM` 语句的列相邻性 (#5035 由 @griffio 贡献)
- [SQLite 方言] 修复了 4897 SQLite 修改表重命名列 (#4899 由 @griffio 贡献)
- [IDE 插件] 修复了错误处理程序崩溃 (#4988 由 @aperfilyev 贡献)
- [IDE 插件] BugSnag 在 IDEA 2023.3 中初始化失败 (由 @aperfilyev 贡献)
- [IDE 插件] 修复了在 IntelliJ 中通过插件打开 .sq 文件时出现的 `PluginException` (由 @aperfilyev 贡献)
- [IDE 插件] 不要将 Kotlin 库打包到 IntelliJ 插件中，因为它已经是插件依赖项 (#5126)
- [IDE 插件] 使用扩展数组而不是流 (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 已添加
- [编译器] 执行 `SELECT` 时添加了对多列表达式的支持 (#4453 由 @Adriel-M 贡献)
- [PostgreSQL 方言] 添加了对 PostgreSQL `CREATE INDEX CONCURRENTLY` 的支持 (#4531 由 @griffio 贡献)
- [PostgreSQL 方言] 允许 PostgreSQL CTE 辅助语句相互引用 (#4493 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对二进制表达式和求和的 PostgreSQL 类型的支持 (#4539 由 @Adriel-M 贡献)
- [PostgreSQL 方言] 添加了对 PostgreSQL `SELECT DISTINCT ON` 语法的支持 (#4584 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了对 `SELECT` 语句中 PostgreSQL JSON 函数的支持 (#4590 由 @MariusVolkhart 贡献)
- [PostgreSQL 方言] 添加了 `generate_series` PostgreSQL 函数 (#4717 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了额外的 Postgres 字符串函数定义 (#4752 由 @MariusVolkhart 贡献)
- [PostgreSQL 方言] 在 `MIN` 和 `MAX` 聚合函数中添加了 `DATE` PostgreSQL 类型 (#4816 由 @anddani 贡献)
- [PostgreSQL 方言] 在 `SqlBinaryExpr` 中添加了 PostgreSQL 时间类型 (#4657 由 @griffio 贡献)
- [PostgreSQL 方言] 在 PostgreSQL 方言中添加了 `TRUNCATE` (#4817 由 @de-luca 贡献)
- [SQLite 3.35 方言] 允许按顺序评估多个 `ON CONFLICT` 子句 (#4551 由 @griffio 贡献)
- [JDBC 驱动程序] 添加了语言注解以提供更愉快的 SQL 编辑体验 (#4602 由 @MariusVolkhart 贡献)
- [原生驱动程序] 原生驱动程序：添加了对 `linuxArm64` 的支持 (#4792 由 @hfhbd 贡献)
- [Android 驱动程序] 为 `AndroidSqliteDriver` 添加了 `windowSizeBytes` 形参 (#4804 由 @BoD 贡献)
- [Paging3 扩展] 已添加：为 `OffsetQueryPagingSource` 添加了 `initialOffset` (#4802 由 @MohamadJaara 贡献)

### 已变更
- [编译器] 在适当的情况下优先使用 Kotlin 类型 (#4517 由 @eygraber 贡献)
- [编译器] 执行值类型插入时始终包含列名 (#4864)
- [PostgreSQL 方言] 从 PostgreSQL 方言中移除实验性状态 (#4443 由 @hfhbd 贡献)
- [PostgreSQL 方言] 更新了 PostgreSQL 类型的文档 (#4569 由 @MariusVolkhart 贡献)
- [R2DBC 驱动程序] 优化了处理 PostgreSQL 中整数数据类型时的性能 (#4588 由 @MariusVolkhart 贡献)

### 已移除
- [SQLite Javascript 驱动程序] 移除了 `sqljs-driver` (#4613, #4670 由 @dellisd 贡献)

### 已修复
- [编译器] 修复了带返回且无参数的分组语句的编译问题 (#4699 由 @griffio 贡献)
- [编译器] 绑定带有 `SqlBinaryExpr` 的实参 (#4604 由 @griffio 贡献)
- [IDE 插件] 如果已设置，则使用 IDEA 项目 JDK (#4689 由 @griffio 贡献)
- [IDE 插件] 修复了 IDEA 2023.2 及更高版本中的 "Unknown element type: TYPE_NAME" 错误 (#4727)
- [IDE 插件] 修复了一些与 2023.2 的兼容性问题
- [Gradle 插件] 修正了 `verifyMigrationTask` Gradle 任务的文档 (#4713 由 @joshfriend 贡献)
- [Gradle 插件] 添加了 Gradle 任务输出消息，以帮助用户在验证数据库之前生成数据库 (#4684 由 @jingwei99 贡献)
- [PostgreSQL 方言] 修复了多次重命名 PostgreSQL 列的问题 (#4566 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4714 PostgreSQL 修改列为 null 性 (#4831 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4837 修改表修改列 (#4846 由 @griffio 贡献)
- [PostgreSQL 方言] 修复了 4501 PostgreSQL 序列 (#4528 由 @griffio 贡献)
- [SQLite 方言] 允许 JSON 二进制运算符用于列表达式 (#4776 由 @eygraber 贡献)
- [SQLite 方言] 修复了 `UPDATE FROM` 中由于发现多个同名列导致的误报问题 (#4777 由 @eygraber 贡献)
- [原生驱动程序] 支持命名的内存数据库 (#4662 由 @05nelsonm 贡献)
- [原生驱动程序] 确保查询监听器集合的线程安全性 (#4567 由 @kpgalligan 贡献)
- [JDBC 驱动程序] 修复了 `ConnectionManager` 中的连接泄漏问题 (#4589 由 @MariusVolkhart 贡献)
- [JDBC 驱动程序] 修复了选择 `ConnectionManager` 类型时的 `JdbcSqliteDriver` URL 解析问题 (#4656 由 @05nelsonm 贡献)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 已添加
- [MySQL 方言] MySQL：在 `IF` 表达式中支持 `timestamp`/`bigint` (#4329 由 @shellderp 贡献)
- [MySQL 方言] MySQL：添加了 `now` (#4431 由 @hfhbd 贡献)
- [Web 驱动程序] 启用了 NPM 软件包发布 (#4364)
- [IDE 插件] 允许用户在 Gradle 工具连接失败时显示堆栈跟踪 (#4383)

### 已变更
- [SQLite 驱动程序] 简化了 `JdbcSqliteDriver` 的架构迁移使用 (#3737 由 @morki 贡献)
- [R2DBC 驱动程序] 真正的异步 R2DBC 文本光标 (#4387 由 @hfhbd 贡献)

### 已修复
- [IDE 插件] 不要将数据库项目服务实例化，直到需要时为止 (#4382)
- [IDE 插件] 处理查找用例期间的过程取消 (#4340)
- [IDE 插件] 修复了异步代码的 IDE 生成 (#4406)
- [IDE 插件] 将软件包结构的组装移动为一次性计算并脱离 EDT (#4417)
- [IDE 插件] 为 2023.2 上的 Kotlin 类型解析使用正确的存根索引键 (#4416)
- [IDE 插件] 在执行搜索之前等待索引就绪 (#4419)
- [IDE 插件] 如果索引不可用，不要执行转到操作 (#4420)
- [编译器] 修复了分组语句的结果表达式 (#4378)
- [编译器] 不要将虚表用作接口类型 (#4427 由 @hfhbd 贡献)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 已添加
- [MySQL 方言] 支持小写日期类型以及日期类型上的 `min` 和 `max` (#4243 由 @shellderp 贡献)
- [MySQL 方言] 为二进制表达式和求和支持 MySQL 类型 (#4254 由 @shellderp 贡献)
- [MySQL 方言] 支持不带显示宽度的无符号整型 (#4306 由 @shellderp 贡献)
- [MySQL 方言] 支持 `LOCK IN SHARED MODE`
- [PostgreSQL 方言] 为 `min` 和 `max` 添加了布尔值和时间戳 (#4245 由 @griffio 贡献)
- [PostgreSQL 方言] Postgres：添加了窗口函数支持 (#4283 由 @hfhbd 贡献)
- [运行时] 为运行时添加了 `linuxArm64`、`androidNative` 和 `watchosDeviceArm` 目标 (#4258 由 @hfhbd 贡献)
- [Paging 扩展] 为 Paging 扩展添加了 `linux` 和 `mingw x64` 目标 (#4280 由 @chippman 贡献)

### 已变更
- [Gradle 插件] 为 Android API 34 添加了自动方言支持 (#4251)
- [Paging 扩展] 在 `QueryPagingSource` 中添加了对 `SuspendingTransacter` 的支持 (#4292 由 @daio 贡献)
- [运行时] 改进了 `addListener` API (#4244 由 @hfhbd 贡献)
- [运行时] 使用 `Long` 作为迁移版本 (#4297 由 @hfhbd 贡献)

### 已修复
- [Gradle 插件] 为生成的源码使用稳定的输出路径 (#4269 由 @joshfriend 贡献)
- [Gradle 插件] Gradle 优化 (#4222 由 @3flex 贡献)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 已添加
- [Paging] 为 Paging 扩展添加了 JS 浏览器目标 (#3843 由 @sproctor 贡献)
- [Paging] 为 `androidx-paging3` 扩展添加了 `iosSimulatorArm64` 目标 (#4117)
- [PostgreSQL 方言] 添加了对 `gen_random_uuid()` 的支持和测试 (#3855 由 @davidwheeler123 贡献)
- [PostgreSQL 方言] PostgreSQL 修改表添加约束 (#4116 由 @griffio 贡献)
- [PostgreSQL 方言] 修改表添加 `CHECK` 约束 (#4120 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 PostgreSQL 字符长度函数 (#4121 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 PostgreSQL 列默认间隔 (#4142 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 PostgreSQL 间隔列结果 (#4152 由 @griffio 贡献)
- [PostgreSQL 方言] 添加了 PostgreSQL 修改列支持 (#4165 由 @griffio 贡献)
- [PostgreSQL 方言] PostgreSQL：添加了 `date_part` (#4198 由 @hfhbd 贡献)
- [MySQL 方言] 添加了 SQL 字符长度函数 (#4134 由 @griffio 贡献)
- [IDE 插件] 添加了 `sqldelight` 目录建议 (#3976 由 @aperfilyev 贡献)
- [IDE 插件] 在项目树中压缩中间包 (#3992 由 @aperfilyev 贡献)
- [IDE 插件] 添加了 `JOIN` 子句补全 (#4086 由 @aperfilyev 贡献)
- [IDE 插件] 创建视图意图和实时模板 (#4074 由 @aperfilyev 贡献)
- [IDE 插件] 对 `DELETE` 或 `UPDATE` 中缺失 `WHERE` 的情况发出警告 (#4058 由 @aperfilyev 贡献)
- [Gradle 插件] 启用类型安全的项目访问器 (#4005 由 @hfhbd 贡献)

### 已变更
- [Gradle 插件] 允许通过 `ServiceLoader` 机制为 `VerifyMigrationTask` 注册 `DriverInitializer` (#3986 由 @C2H6O 贡献)
- [Gradle 插件] 创建显式编译器环境 (#4079 由 @hfhbd 贡献)
- [JS 驱动程序] 将 Web 工作线程驱动程序拆分为独立的构件
- [JS 驱动程序] 不要公开 `JsWorkerSqlCursor` (#3874 由 @hfhbd 贡献)
- [JS 驱动程序] 禁用 `sqljs` 驱动程序的发布 (#4108)
- [运行时] 强制同步驱动程序需要同步架构初始化程序 (#4013)
- [运行时] 改进了对文本光标的异步支持 (#4102)
- [运行时] 移除了已弃用的目标 (#4149 由 @hfhbd 贡献)
- [运行时] 移除了对旧版内存模型 (MM) 的支持 (#4148 由 @hfhbd 贡献)

### 已修复
- [R2DBC 驱动程序] R2DBC：等待驱动程序关闭 (#4139 由 @hfhbd 贡献)
- [编译器] 在数据库 `create(SqlDriver)` 中包含来自迁移的 `PRAGMA` (#3845 由 @MariusVolkhart 贡献)
- [编译器] 修复了 `RETURNING` 子句的代码生成 (#3872 由 @MariusVolkhart 贡献)
- [编译器] 不要为虚表生成类型 (#4015)
- [Gradle 插件] Gradle 插件的小型质量改进 (#3930 由 @zacsweers 贡献)
- [IDE 插件] 修复了未解析的 Kotlin 类型 (#3924 由 @aperfilyev 贡献)
- [IDE 插件] 修复了扩展通配符意图以支持限定符的问题 (#3979 由 @aperfilyev 贡献)
- [IDE 插件] 如果缺少 Java Home，则使用可用的 JDK (#3925 由 @aperfilyev 贡献)
- [IDE 插件] 修复了软件包名称上的查找用例 (#4010)
- [IDE 插件] 不要为无效元素显示自动导入 (#4008)
- [IDE 插件] 如果方言缺失，不要进行解析 (#4009)
- [IDE 插件] 忽略无效状态期间编译器的 IDE 运行 (#4016)
- [IDE 插件] 添加了对 IntelliJ 2023.1 的支持 (#4037 由 @madisp 贡献)
- [IDE 插件] 在重命名列时重命名命名的实参用法 (#4027 由 @aperfilyev 贡献)
- [IDE 插件] 修复了添加迁移弹出窗口 (#4105 由 @aperfilyev 贡献)
- [IDE 插件] 在迁移文件中禁用 `SchemaNeedsMigrationInspection` (#4106 由 @aperfilyev 贡献)
- [IDE 插件] 为迁移生成使用 SQL 列名而不是类型名称 (#4112 由 @aperfilyev 贡献)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 已添加
- [Paging] 多平台 Paging 扩展 (由 @jeffdgr8 贡献)
- [运行时] 为 `Listener` 接口添加了 `fun` 修饰符。
- [SQLite 方言] 添加了 SQLite 3.33 支持 (`UPDATE FROM`) (由 @eygraber 贡献)
- [PostgreSQL 方言] 支持 PostgreSQL 中的 `UPDATE FROM` (由 @eygraber 贡献)

### 已变更
- [RDBC 驱动程序] 公开连接 (由 @hfhbd 贡献)
- [运行时] 将迁移回调移动到主 `migrate` 函数中
- [Gradle 插件] 对下游项目隐藏配置
- [Gradle 插件] 仅着色 IntelliJ (由 @hfhbd 贡献)
- [Gradle 插件] 支持 Kotlin 1.8.0-Beta 并添加了多版本 Kotlin 测试 (由 @hfhbd 贡献)

### 已修复
- [RDBC 驱动程序] 改为使用 `javaObjectType` (由 @hfhbd 贡献)
- [RDBC 驱动程序] 修复了 `bindStatement` 中的基本类型 null 值 (由 @hfhbd 贡献)
- [RDBC 驱动程序] 支持 R2DBC 1.0 (由 @hfhbd 贡献)
- [PostgreSQL 方言] Postgres：修复了不带类型参数的数组 (由 @hfhbd 贡献)
- [IDE 插件] 将 IntelliJ 提升至 221.6008.13 (由 @hfhbd 贡献)
- [编译器] 从纯视图解析递归原始表 (由 @hfhbd 贡献)
- [编译器] 使用来自表外键子句的值类 (由 @hfhbd 贡献)
- [编译器] 修复了 `SelectQueryGenerator` 以支持不带圆括号的绑定表达式 (由 @bellatoris 贡献)
- [编译器] 修复了使用事务时 `${name}Indexes` 变量的重复生成问题 (由 @sachera 贡献)

## [1.5.5] - 2023-01-20
[1.5.5]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.5

这是一个针对 Kotlin 1.8 和 IntelliJ 2021+ 的兼容性版本，支持 JDK 17。

## [1.5.4] - 2022-10-06
[1.5.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.4

这是一个针对 Kotlin 1.7.20 和 AGP 7.3.0 的兼容性更新。

## [2.0.0-alpha04] - 2022-10-03
[2.0.0-alpha04]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha04

### 破坏性变更

- Paging 3 扩展 API 已更改，仅允许对计数使用 `int` 类型。
- 协程扩展现在要求传入一个调度程序，而不再使用默认值。
- 方言和驱动程序类现在是 `final` 的，请改用委托。

### 已添加
- [HSQL 方言] Hsql：支持在插入中使用 `DEFAULT` 处理生成的列 (#3372 由 @hfhbd 贡献)
- [PostgreSQL 方言] PostgreSQL：支持在 `INSERT` 中使用 `DEFAULT` 处理生成的列 (#3373 由 @hfhbd 贡献)
- [PostgreSQL 方言] 在 PostgreSQL 中添加了 `NOW()` (#3403 由 @hfhbd 贡献)
- [PostgreSQL 方言] PostgreSQL 添加了 `NOT` 运算符 (#3504 由 @hfhbd 贡献)
- [Paging] 允许将 `CoroutineContext` 传入 `*QueryPagingSource` (#3384)
- [Gradle 插件] 为方言添加了更好的版本目录支持 (#3435)
- [原生驱动程序] 为 `NativeSqliteDriver` 的 `DatabaseConfiguration` 创建添加了钩子回调 (#3512 由 @svenjacobs 贡献)

### 已变更
- [Paging] 为基于 `KeyedQueryPagingSource` 的 `QueryPagingSource` 函数添加了默认调度程序 (#3385)
- [Paging] 使 `OffsetQueryPagingSource` 仅适用于 `Int` (#3386)
- [异步运行时] 将 `await*` 移动到上层类 `ExecutableQuery` (#3524 由 @hfhbd 贡献)
- [协程扩展] 移除了流扩展的默认形参 (#3489)

### 已修复
- [Gradle 插件] 更新至 Kotlin 1.7.20 (#3542 由 @zacsweers 贡献)
- [R2DBC 驱动程序] 采用了不总是发送值的 R2DBC 更改 (#3525 由 @hfhbd 贡献)
- [HSQL 方言] 修复了 Hsql 中 SQLite `VerifyMigrationTask` 失败的问题 (#3380 由 @hfhbd 贡献)
- [Gradle 插件] 转换任务以使用延迟配置 API (由 @3flex 贡献)
- [Gradle 插件] 避免 Kotlin 1.7.20 中的 NPE (#3398 由 @ZacSweers 贡献)
- [Gradle 插件] 修复了压缩迁移任务的说明 (#3449)
- [IDE 插件] 修复了较新 Kotlin 插件中的 `NoSuchFieldError` (#3422 由 @madisp 贡献)
- [IDE 插件] IDEA：`UnusedQueryInspection` - 修复了 `ArrayIndexOutOfBoundsException`。 (#3427 由 @vanniktech 贡献)
- [IDE 插件] 为旧版 Kotlin 插件引用使用反射
- [编译器] 自定义方言与扩展函数不创建导入 (#3338 由 @hfhbd 贡献)
- [编译器] 修复了转义 `CodeBlock.of("${CodeBlock.toString()}")` 的问题 (#3340 由 @hfhbd 贡献)
- [编译器] 在迁移中等待异步执行语句 (#3352)
- [编译器] 修复了 `AS` (#3370 由 @hfhbd 贡献)
- [编译器] `getObject` 方法支持自动填充实际类型。 (#3401 由 @robxyy 贡献)
- [编译器] 修复了异步分组返回语句的代码生成 (#3411)
- [编译器] 如果可能，推断绑定参数的 Kotlin 类型，否则报错并提供更好的错误消息 (#3413 由 @hfhbd 贡献)
- [编译器] 不允许 `ABS("foo")` (#3430 由 @hfhbd 贡献)
- [编译器] 支持从其他参数推断 Kotlin 类型 (#3431 由 @hfhbd 贡献)
- [编译器] 始终创建数据库实现 (#3540 由 @hfhbd 贡献)
- [编译器] 放宽 Javadoc 并将其也添加到自定义映射器函数中 (#3554 @hfhbd)
- [编译器] 修复了绑定中的 `DEFAULT` (由 @hfhbd 贡献)
- [Paging] 修复了 Paging 3 (#3396)
- [Paging] 允许使用 `Long` 构造 `OffsetQueryPagingSource` (#3409)
- [Paging] 不要静态交换 `Dispatchers.Main` (#3428)

## [2.0.0-alpha03] - 2022-06-17
[2.0.0-alpha03]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha03

### 破坏性变更

- 方言现在像实际的 Gradle 依赖项一样被引用。
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 类型已移除，取而代之的是现在始终包含驱动程序的 `AfterVersion`。
- `Schema` 类型不再是 `SqlDriver` 的子类型。
- `PreparedStatement` API 现在使用从零开始的索引进行调用。

### 已添加
- [IDE 插件] 添加了对针对正在运行的数据库运行 SQLite、MySQL 和 PostgreSQL 命令的支持 (#2718 由 @aperfilyev 贡献)
- [IDE 插件] 添加了对 Android Studio 数据库检查器的支持 (#3107 由 @aperfilyev 贡献)
- [运行时] 添加了对异步驱动程序的支持 (#3168 由 @dellisd 贡献)
- [原生驱动程序] 支持新的 Kotlin 原生内存模型 (#3177 由 @kpgalligan 贡献)
- [JS 驱动程序] 添加了用于 SqlJs 工作线程的驱动程序 (#3203 由 @dellisd 贡献)
- [Gradle 插件] 公开了 SQLDelight 任务的类路径
- [Gradle 插件] 添加了用于压缩迁移的 Gradle 任务
- [Gradle 插件] 添加了一个在迁移检查期间忽略架构定义的标志
- [MySQL 方言] 在 MySQL 中支持 `FOR SHARE` 和 `FOR UPDATE` (#3098)
- [MySQL 方言] 支持 MySQL 索引提示 (#3099)
- [PostgreSQL 方言] 添加了 `date_trunc` (#3295 由 @hfhbd 贡献)
- [JSON 扩展] 支持 JSON 表函数 (#3090)

### 已变更
- [运行时] 移除了不带驱动程序的 `AfterVersion` 类型 (#3091)
- [运行时] 将 `Schema` 类型移动到顶级
- [运行时] 开放方言和解析器以支持第三方实现 (#3232 由 @hfhbd 贡献)
- [编译器] 在失败报告中包含用于编译的方言 (#3086)
- [编译器] 跳过未使用的适配器 (#3162 由 @eygraber 贡献)
- [编译器] 在 `PrepareStatement` 中使用从零开始的索引 (#3269 由 @hfhbd 贡献)
- [Gradle 插件] 同时将方言设为适当的 Gradle 依赖项而不是字符串 (#3085)
- [Gradle 插件] Gradle 验证任务：缺少数据库文件时抛出异常。 (#3126 由 @vanniktech 贡献)

### 已修复
- [Gradle 插件] 对 Gradle 插件进行了微量清理和优化 (#3171 由 @3flex 贡献)
- [Gradle 插件] 不要为生成的目录使用 AGP 字符串
- [Gradle 插件] 使用 AGP 命名空间特性 (#3220)
- [Gradle 插件] 不要将 `kotlin-stdlib` 添加为 Gradle 插件的运行时依赖项 (#3245 由 @mbonnin 贡献)
- [Gradle 插件] 简化了多平台配置 (#3246 由 @mbonnin 贡献)
- [Gradle 插件] 支持仅限 JS 的项目 (#3310 由 @hfhbd 贡献)
- [IDE 插件] 为 Gradle 工具 API 使用 Java Home (#3078)
- [IDE 插件] 在 IDE 插件内部的正确类加载器上加载 JDBC 驱动程序 (#3080)
- [IDE 插件] 在失效前将文件元素标记为 `null`，以避免在已有的 PSI 架构更改期间出错 (#3082)
- [IDE 插件] 不要针对 `ALTER TABLE` 语句中重命名后的表名查找用例时发生崩溃 (#3106)
- [IDE 插件] 优化了检查器并使其能够针对预期的异常类型静默失败 (#3121)
- [IDE 插件] 删除应为生成目录的文件 (#3198)
- [IDE 插件] 修复了一个非安全的运算符调用
- [编译器] 确保带有 `RETURNING` 语句的更新和删除操作执行查询。 (#3084)
- [编译器] 在复合选择中正确推断实参类型 (#3096)
- [编译器] 通用表不生成数据类，因此不要返回它们 (#3097)
- [编译器] 更快地查找顶级迁移文件 (#3108)
- [编译器] 在管道运算符上正确继承为 null 性
- [编译器] 支持 `iif` ANSI SQL 函数
- [编译器] 不要生成空的查询文件 (#3300 由 @hfhbd 贡献)
- [编译器] 修复了仅包含问号的适配器 (#3314 由 @hfhbd 贡献)
- [PostgreSQL 方言] PostgreSQL 主键列始终不可为 null (#3092)
- [PostgreSQL 方言] 修复了多个表中具有相同名称的复制问题 (#3297 由 @hfhbd 贡献)
- [SQLite 3.35 方言] 仅在从修改后的表中删除索引列时显示错误 (#3158 由 @eygraber 贡献)

## [2.0.0-alpha02] - 2022-04-13
[2.0.0-alpha02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha02

### 破坏性变更

- 您需要将所有出现的 `app.cash.sqldelight.runtime.rx` 替换为 `app.cash.sqldelight.rx2`

### 已添加
- [编译器] 支持在分组语句末尾返回
- [编译器] 支持通过方言模块扩展编译器，并添加了 SQLite JSON 扩展 (#1379, #2087)
- [编译器] 支持返回值的 `PRAGMA` 语句 (#1106)
- [编译器] 支持为标记的列生成值类型
- [编译器] 添加了对乐观锁和验证的支持 (#1952)
- [编译器] 支持多更新语句
- [PostgreSQL] 支持 PostgreSQL 返回语句
- [PostgreSQL] 支持 PostgreSQL 日期类型
- [PostgreSQL] 支持 PostgreSQL 间隔 (Interval)
- [PostgreSQL] 支持 PostgreSQL 布尔值并修复了修改表上的插入操作
- [PostgreSQL] 支持 PostgreSQL 中的可选限制 (Limit)
- [PostgreSQL] 支持 PostgreSQL `BYTEA` 类型
- [PostgreSQL] 为 PostgreSQL 序列 (Serial) 添加了测试
- [PostgreSQL] 支持 PostgreSQL 的 `FOR UPDATE` 语法
- [PostgreSQL] 支持 PostgreSQL 数组类型
- [PostgreSQL] 在 PostgreSQL 中正确存储/检索 UUID 类型
- [PostgreSQL] 支持 PostgreSQL `NUMERIC` 类型 (#1882)
- [PostgreSQL] 支持在公用表表达式内部返回查询 (#2471)
- [PostgreSQL] 支持 JSON 特定运算符
- [PostgreSQL] 添加了 Postgres Copy (由 @hfhbd 贡献)
- [MySQL] 支持 MySQL Replace
- [MySQL] 支持 `NUMERIC`/`BigDecimal` MySQL 类型 (#2051)
- [MySQL] 支持 MySQL `truncate` 语句
- [MySQL] 支持 MySQL 中的 JSON 特定运算符 (由 @eygraber 贡献)
- [MySQL] 支持 MySQL `INTERVAL` (#2969 由 @eygraber 贡献)
- [HSQL] 添加了 HSQL 窗口功能
- [SQLite] 不要在 `WHERE` 中替换可为 null 形参的相等性检查 (#1490 由 @eygraber 贡献)
- [SQLite] 支持 SQLite 3.35 返回语句 (#1490 由 @eygraber 贡献)
- [SQLite] 支持 `GENERATED` 子句
- [SQLite] 添加了对 SQLite 3.38 方言的支持 (由 @eygraber 贡献)

### 已变更
- [编译器] 稍微清理了生成的代码
- [编译器] 禁止在分组语句中使用表参数 (#1822)
- [编译器] 将分组查询放入事务中 (#2785)
- [运行时] 从驱动程序的 `execute` 方法返回更新后的行数
- [运行时] 将 `SqlCursor` 限制在访问连接的关键部分。 (#2123 由 @andersio 贡献)
- [Gradle 插件] 比较迁移的架构定义 (#841)
- [PostgreSQL] 禁止在 PostgreSQL 中使用双引号
- [MySQL] 在 MySQL 中使用 `==` 时报错 (#2673)

### 已修复
- [编译器] 2.0 alpha 中来自不同表的相同适配器类型导致编译错误的问题
- [编译器] 编译 `UPSERT` 语句时的问题 (#2791)
- [编译器] 如果有多个匹配项，查询结果应使用 `SELECT` 中的表 (#1874, #2313)
- [编译器] 支持更新具有 `INSTEAD OF` 触发器的视图 (#1018)
- [编译器] 在函数名称中支持 `from` 和 `for`
- [编译器] 在函数表达式中允许 `SEPARATOR` 关键字
- [编译器] 无法在 `ORDER BY` 中访问别名表的 `ROWID`
- [编译器] MySQL 的 `HAVING` 子句中无法识别别名列名
- [编译器] 错误的“发现多个同名列”错误
- [编译器] 无法设置 `PRAGMA locking_mode = EXCLUSIVE;`
- [PostgreSQL] PostgreSQL 重命名列
- [MySQL] 无法识别 `UNIX_TIMESTAMP`、`TO_SECONDS`、`JSON_ARRAYAGG` 等 MySQL 函数
- [SQLite] 修复 SQLite 窗口功能
- [IDE 插件] 在空进度指示器中运行转到处理程序 (#2990)
- [IDE 插件] 确保如果项目未配置，高亮访问器不运行 (#2981, #2976)
- [IDE 插件] 确保传递生成的代码在 IDE 中也能更新 (#1837)
- [IDE 插件] 更新方言时使索引失效

## [2.0.0-alpha01] - 2022-03-31
[2.0.0-alpha01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha01

这是 2.0 的第一个 Alpha 版本，包含一些破坏性变更。我们预计会有更多 ABI 破坏性变更，因此请不要发布任何依赖此版本的库（应用程序应不受影响）。

### 破坏性变更

- 首先，您需要将所有出现的 `com.squareup.sqldelight` 替换为 `app.cash.sqldelight`
- 第二，您需要将所有出现的 `app.cash.sqldelight.android` 替换为 `app.cash.sqldelight.driver.android`
- 第三，您需要将所有出现的 `app.cash.sqldelight.sqlite.driver` 替换为 `app.cash.sqldelight.driver.jdbc.sqlite`
- 第四，您需要将所有出现的 `app.cash.sqldelight.drivers.native` 替换为 `app.cash.sqldelight.driver.native`
- IDE 插件必须更新到 2.X 版本，可以在 [alpha 或 eap 频道](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)中找到
- 方言现在是依赖项，您可以在 Gradle 中指定：

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

目前支持的方言包括 `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect` 和 `sqlite-3-35-dialect`

- 现在必须导入原始类型（例如 `INTEGER AS Boolean`，您必须 `import kotlin.Boolean`），某些先前支持的类型现在需要适配器。原始适配器在 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` 中提供，用于大多数转换（例如使用 `IntColumnAdapter` 执行 `Integer AS kotlin.Int`）。

### 已添加
- [IDE 插件] 基础建议迁移 (由 @aperfilyev 贡献)
- [IDE 插件] 添加了导入提示操作 (由 @aperfilyev 贡献)
- [IDE 插件] 添加了 Kotlin 类补全 (由 @aperfilyev 贡献)
- [Gradle 插件] 添加了针对 Gradle 类型安全的项目访问器的快捷方式 (由 @hfhbd 贡献)
- [编译器] 根据方言自定义代码生成 (由 @MariusVolkhart 贡献)
- [JDBC 驱动程序] 向 `JdbcDriver` 添加了通用类型 (由 @MariusVolkhart 贡献)
- [SQLite] 添加了对 SQLite 3.35 的支持 (由 @eygraber 贡献)
- [SQLite] 添加了对 `ALTER TABLE DROP COLUMN` 的支持 (由 @eygraber 贡献)
- [SQLite] 添加了对 SQLite 3.30 方言的支持 (由 @eygraber 贡献)
- [SQLite] 在 SQLite 中支持 `NULLS FIRST`/`LAST` (由 @eygraber 贡献)
- [HSQL] 为 `GENERATED` 子句添加了 HSQL 支持 (由 @MariusVolkhart 贡献)
- [HSQL] 在 HSQL 中添加了对命名参数的支持 (由 @MariusVolkhart 贡献)
- [HSQL] 自定义了 HSQL 插入查询 (由 @MariusVolkhart 贡献)

### 已变更
- [全局] 软件包名称已从 `com.squareup.sqldelight` 更改为 `app.cash.sqldelight`。
- [运行时] 将方言移动到它们各自隔离的 Gradle 模块中
- [运行时] 切换到由驱动程序实现的查询通知。
- [运行时] 将默认列适配器提取到单独的模块 (#2056, #2060)
- [编译器] 让模块生成查询实现，而不是在每个模块中重复生成
- [编译器] 移除了生成的数据类自定义 `toString` 的生成。 (由 @PaulWoitaschek 贡献)
- [JS 驱动程序] 从 `sqljs-driver` 中移除了 `sql.js` 依赖项 (由 @dellisd 贡献)
- [Paging] 移除了 Android Paging 2 扩展
- [IDE 插件] 在 SQLDelight 同步期间添加了编辑器横幅 (#2511)
- [IDE 插件] 最低支持的 IntelliJ 版本为 2021.1

### 已修复
- [运行时] 扁平化监听器列表以减少分配和指针追逐。 (由 @andersio 贡献)
- [IDE 插件] 修复了错误消息以允许跳转到错误 (由 @hfhbd 贡献)
- [IDE 插件] 添加了缺失的检查说明 (#2768 由 @aperfilyev 贡献)
- [IDE 插件] 修复了 `GotoDeclarationHandler` 中的异常 (#2531, #2688, #2804 由 @aperfilyev 贡献)
- [IDE 插件] 高亮显示 `import` 关键字 (由 @aperfilyev 贡献)
- [IDE 插件] 修复了未解析的 Kotlin 类型 (#1678 由 @aperfilyev 贡献)
- [IDE 插件] 修复了未解析软件包的高亮显示问题 (#2543 由 @aperfilyev 贡献)
- [IDE 插件] 如果项目索引尚未初始化，不要尝试检查不匹配的列
- [IDE 插件] 在 Gradle 同步发生前不要初始化文件索引
- [IDE 插件] 如果 Gradle 同步开始，取消 SQLDelight 导入
- [IDE 插件] 在执行撤消操作的线程之外重新生成数据库
- [IDE 插件] 如果引用无法解析，使用空白 Java 类型
- [IDE 插件] 在文件解析期间正确脱离主线程，仅在写入时切回
- [IDE 插件] 改进了与旧版 IntelliJ 版本的兼容性 (由 @3flex 贡献)
- [IDE 插件] 使用更快的注解 API
- [Gradle 插件] 添加运行时时显式支持 js/android 插件 (由 @ZacSweers 贡献)
- [Gradle 插件] 注册迁移输出任务而不从迁移中推导架构 (#2744 由 @kevincianfarini 贡献)
- [Gradle 插件] 如果迁移任务崩溃，打印崩溃时运行的文件
- [Gradle 插件] 在生成代码时对文件进行排序以确保输出幂等 (由 @ZacSweers 贡献)
- [编译器] 使用更快的 API 遍历文件，且不探索整个 PSI 图
- [编译器] 为选择函数参数添加了关键字重整 (#2759 由 @aperfilyev 贡献)
- [编译器] 修复了迁移适配器的 `packageName` (由 @hfhbd 贡献)
- [编译器] 在属性上而非类型上发出注解 (#2798 由 @aperfilyev 贡献)
- [编译器] 在传递给 `Query` 子类型之前对实参进行排序 (#2379 由 @aperfilyev 贡献)