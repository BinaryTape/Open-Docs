# 变更日志

## 未发布

### 新增
- [Gradle Plugin] 修复当起始 schema 版本不为 1 且 `verifyMigrations` 为 `true` 时构建失败的问题 (#6017 by @neilgmiller)
- [Gradle Plugin] 使 `SqlDelightWorkerTask` 更具可配置性，并更新默认配置以支持在 Windows 上开发 (#5215 by @MSDarwish2000)
- [SQLite Dialect] 添加对 FTS5 虚拟表中合成列的支持 (#5986 by @watbe)

### 变更
- [Compiler] 允许包名中使用下划线。以前下划线会被清理，导致意外行为 (#6027 by @BierDav)
- [Paging Extension] 切换到 AndroidX Paging (#5910 by @jeffdgr8)

### 修复
- [SQLite Dialect] 当使用自定义列类型时，`group_concat` 函数使用 String 类型 (#6082 by @griffio)
- [Gradle Plugin] 改进 `VerifyMigrationTask` 的性能，防止其在复杂 schema 上挂起 (#6073 by @Lightwood13)

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 新增
- [PostgreSQL Dialect] 修复 Postgres numeric/integer/biginteger 类型映射 (#5994 by @griffio)
- [Compiler] 改进编译器错误消息，使其在需要 CAST 操作符时包含源文件位置 (#5979 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres JSON 操作符路径提取的支持 (#5971 by @griffio)
- [SQLite Dialect] 添加 SQLite 3.35 对使用公共表表达式的 MATERIALIZED 查询规划器提示的支持 (#5961 by @griffio)
- [PostgreSQL Dialect] 添加对使用公共表表达式的 MATERIALIZED 查询规划器提示的支持 (#5961 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres JSON Aggregate FILTER 的支持 (#5957 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres Enums 的支持 (#5935 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres Triggers 的有限支持 (#5932 by @griffio)
- [PostgreSQL Dialect] 添加谓词以检测 SQL 表达式是否可解析为 JSON (#5843 by @griffio)
- [PostgreSQL Dialect] 添加对 PostgreSql COMMENT ON 语句的有限支持 (#5808 by @griffio)
- [MySQL Dialect] 添加对索引可见性选项的支持 (#5785 by @orenkislev-faire)
- [PostgreSql Dialect] 添加对 TSQUERY 数据类型的支持 (#5779 by @griffio)
- [Gradle Plugin] 添加对在添加模块时使用版本目录的支持 (#5755 by @DRSchlaubi)

### 变更
- 开发中的快照现在已发布到 Central Portal Snapshots 版本库，地址为 https://central.sonatype.com/repository/maven-snapshots/。
- [Compiler] 使用构造函数引用简化了默认生成的查询 (#5814 by @jonapoul)

### 修复
- [Compiler] 修复了使用包含公共表表达式的 View 时发生的栈溢出问题 (#5928 by @griffio)
- [Gradle Plugin] 修复了打开 SqlDelight 工具窗口以添加“New Connection”时发生的崩溃 (#5906 by @griffio)
- [IntelliJ Plugin] 避免了在复制到 SQLite 边槽操作中与线程相关的崩溃 (#5901 by @griffio)
- [IntelliJ Plugin] 修复了 PostgreSQL 方言在使用 schema 语句 CREATE INDEX 和 CREATE VIEW 时的问题 (#5772 by @griffio)
- [Compiler] 修复了引用列时 FTS 栈溢出问题 (#5896 by @griffio)
- [Compiler] 修复了 With Recursive 栈溢出问题 (#5892 by @griffio)
- [Compiler] 修复了 Insert|Update|Delete Returning 语句的通知功能 (#5851 by @griffio)
- [Compiler] 修复了返回 Long 的事务代码块的异步结果类型问题 (#5836 by @griffio)
- [Compiler] 将 SQL 形参绑定从 O(n²) 复杂度优化到 O(n) 复杂度 (#5898 by @chenf7)
- [SQLite Dialect] 修复 SQLite 3.18 缺失的函数 (#5759 by @griffio)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

部分构件发布失败，此版本发布失败。请使用 2.2.1！

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 新增
- [WASM Driver] 添加对 wasmJs 到 web worker 驱动的支持 (#5534 by @IlyaGulya)
- [PostgreSQL Dialect] 支持 PostgreSql 将数组平铺到行 (#5673 by @griffio)
- [PostgreSQL Dialect] PostgreSql TSRANGE/TSTZRANGE 支持 (#5297 by @griffio)
- [PostgreSQL Dialect] PostgreSql Right Full Join (#5086 by @griffio)
- [PostgreSQL Dialect] Postrgesql 从时间类型中提取 (#5273 by @griffio)
- [PostgreSQL Dialect] PostgreSql 数组包含操作符 (#4933 by @griffio)
- [PostgreSQL Dialect] PostgreSql 移除约束 (#5288 by @griffio)
- [PostgreSQL Dialect] Postgresql 类型转换 (#5089 by @griffio)
- [PostgreSQL Dialect] PostgreSql lateral join 操作符用于子查询 (#5122 by @griffio)
- [PostgreSQL Dialect] Postgresql ILIKE 操作符 (#5330 by @griffio)
- [PostgreSQL Dialect] PostgreSql XML type (#5331 by @griffio)
- [PostgreSQL Dialect] PostgreSql AT TIME ZONE (#5243 by @griffio)
- [PostgreSQL Dialect] 支持 postgresql ORDER BY NULLS (#5199 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSQL 当前日期/时间函数支持 (#5226 by @drewd)
- [PostgreSQL Dialect] PostgreSql Regex 操作符 (#5137 by @griffio)
- [PostgreSQL Dialect] 添加 brin gist (#5059 by @griffio)
- [MySQL Dialect] 支持 MySQL 方言的 RENAME INDEX (#5212 by @orenkislev-faire)
- [JSON Extension] 为 JSON table 函数添加别名 (#5372 by @griffio)

### 变更
- [Compiler] 生成的查询文件为简单修改器返回行计数 (#4578 by @MariusVolkhart)
- [Native Driver] 更新 NativeSqlDatabase.kt 以更改 DELETE、INSERT 和 UPDATE 语句的只读标志 (#5680 by @griffio)
- [PostgreSQL Dialect] 将 PgInterval 更改为 String (#5403 by @griffio)
- [PostgreSQL Dialect] 支持 SqlDelight 模块实现 PostgreSql 扩展 (#5677 by @griffio)

### 修复
- [Compiler] 修复：执行带结果的分组语句时通知查询 (#5006 by @vitorhugods)
- [Compiler] 修复 SqlDelightModule 类型解析器 (#5625 by @griffio)
- [Compiler] 修复 5501 插入对象转义列 (#5503 by @griffio)
- [Compiler] 编译器：改进错误消息，使其路径链接可点击并显示正确的行和字符位置 (#5604 by @vanniktech)
- [Compiler] 修复问题 5298：允许关键字用作表名
- [Compiler] 修复命名执行并添加测试
- [Compiler] 在排序初始化语句时考虑外键表约束 (#5325 by @TheMrMilchmann)
- [Compiler] 在涉及制表符时正确对齐错误下划线 (#5224 by @drewd)
- [JDBC Driver] 修复 `connectionManager` 在事务结束时的内存泄漏
- [JDBC Driver] 如文档所述，在事务中运行 SQLite 迁移 (#5218 by @morki)
- [JDBC Driver] 修复事务提交/回滚后连接泄漏 (#5205 by @morki)
- [Gradle Plugin] 在 `GenerateSchemaTask` 之前执行 `DriverInitializer` (#5562 by @nwagu)
- [Runtime] 修复 `LogSqliteDriver` 在实际驱动为异步时的崩溃 (#5723 by @edenman)
- [Runtime] 修复 `StringBuilder` 容量 (#5192 by @janbina)
- [PostgreSQL Dialect] PostgreSql CREATE OR REPLACE VIEW (#5407 by @griffio)
- [PostgreSQL Dialect] Postgresql to_json (#5606 by @griffio)
- [PostgreSQL Dialect] PostgreSql 数字解析器 (#5399 by @griffio)
- [PostgreSQL Dialect] sqlite 窗口函数 (#2799 by @griffio)
- [PostgreSQL Dialect] PostgreSql SELECT DISTINCT ON (#5345 by @griffio)
- [PostgreSQL Dialect] ALTER TABLE ADD COLUMN IF NOT EXISTS (#5309 by @griffio)
- [PostgreSQL Dialect] Postgresql 异步绑定形参 (#5313 by @griffio)
- [PostgreSQL Dialect] PostgreSql 布尔字面量 (#5262 by @griffio)
- [PostgreSQL Dialect] PostgreSql 窗口函数 (#5155 by @griffio)
- [PostgreSQL Dialect] PostgreSql isNull isNotNull 类型 (#5173 by @griffio)
- [PostgreSQL Dialect] PostgreSql SELECT DISTINCT (#5172 by @griffio)
- [Paging Extension] 分页刷新初始加载修复 (#5615 by @evant)
- [Paging Extension] 添加 MacOS native 目标 (#5324 by @vitorhugods)
- [IntelliJ Plugin] K2 支持

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 新增
- [PostgreSQL Dialect] 添加 PostgreSQL STRING_AGG 函数 (#4950 by @anddani)
- [PostgreSQL Dialect] 为 PG 方言添加 SET 语句 (#4927 by @de-luca)
- [PostgreSQL Dialect] 添加 PostgreSql ALTER COLUMN SEQUENCE 形参 (#4916 by @griffio)
- [PostgreSQL Dialect] 添加 postgresql ALTER COLUMN DEFAULT 支持用于 insert 语句 (#4912 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSql ALTER SEQUENCE 和 DROP SEQUENCE (#4920 by @griffio)
- [PostgreSQL Dialect] 添加 Postgres Regex 函数定义 (#5025 by @MariusVolkhart)
- [PostgreSQL Dialect] 为 GIN 添加语法 (#5027 by @griffio)

### 变更
- [IDE Plugin] 最低版本 2023.1 / Android Studio Iguana
- [Compiler] 允许在 encapsulatingType 中覆盖类型可空性 (#4882 by @eygraber)
- [Compiler] 内联 SELECT * 的列名
- [Gradle Plugin] 切换到 processIsolation (#5068 by @nwagu)
- [Android Runtime] 提高 Android minSDK 到 21 (#5094 by @hfhbd)
- [Drivers] 为方言作者暴露更多 JDBC/R2DBC 语句方法 (#5098 by @hfhbd)

### 修复
- [PostgreSQL Dialect] 修复 postgresql ALTER TABLE ALTER COLUMN (#4868 by @griffio)
- [PostgreSQL Dialect] 修复 4448 表模型缺失导入 (#4885 by @griffio)
- [PostgreSQL Dialect] 修复 4932 postgresql 默认约束函数 (#4934 by @griffio)
- [PostgreSQL Dialect] 修复 4879 postgresql 类转换错误在迁移期间的 ALTER TABLE RENAME COLUMN 时发生 (#4880 by @griffio)
- [PostgreSQL Dialect] 修复 4474 PostgreSql CREATE EXTENSION (#4541 by @griffio)
- [PostgreSQL Dialect] 修复 5018 PostgreSql 添加非空的 Primary Key 类型 (#5020 by @griffio)
- [PostgreSQL Dialect] 修复 4703 聚合表达式 (#5071 by @griffio)
- [PostgreSQL Dialect] 修复 5028 PostgreSql JSON (#5030 by @griffio)
- [PostgreSQL Dialect] 修复 5040 PostgreSql JSON 操作符 (#5041 by @griffio)
- [PostgreSQL Dialect] 修复 5040 的 JSON 操作符绑定 (#5100 by @griffio)
- [PostgreSQL Dialect] 修复 5082 TSVECTOR (#5104 by @griffio)
- [PostgreSQL Dialect] 修复 5032 `PostgreSql UPDATE FROM` 语句的列相邻问题 (#5035 by @griffio)
- [SQLite Dialect] 修复 4897 sqlite ALTER TABLE RENAME COLUMN (#4899 by @griffio)
- [IDE Plugin] 修复错误处理器崩溃 (#4988 by @aperfilyev)
- [IDE Plugin] BugSnag 未能在 IDEA 2023.3 中初始化 (by @aperfilyev)
- [IDE Plugin] PluginException 当在 IntelliJ 中通过插件打开 .sq 文件时 (by @aperfilyev)
- [IDE Plugin] 不将 kotlin lib 打包到 intellij 插件中，因为它已经是插件依赖项 (#5126)
- [IDE Plugin] 使用 extensions 数组而不是 stream (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 新增
- [Compiler] 在执行 SELECT 时添加对多列表达式的支持 (#4453 by @Adriel-M)
- [PostgreSQL Dialect] 添加对 PostgreSQL CREATE INDEX CONCURRENTLY 的支持 (#4531 by @griffio)
- [PostgreSQL Dialect] 允许 PostgreSQL CTEs 辅助语句相互引用 (#4493 by @griffio)
- [PostgreSQL Dialect] 添加对 PostgreSQL 二进制表达式和 sum 类型的支持 (#4539 by @Adriel-M)
- [PostgreSQL Dialect] 添加对 PostgreSQL SELECT DISTINCT ON 语法的支持 (#4584 by @griffio)
- [PostgreSQL Dialect] 添加对 SELECT 语句中 PostgreSQL JSON 函数的支持 (#4590 by @MariusVolkhart)
- [PostgreSQL Dialect] 添加 generate_series PostgreSQL 函数 (#4717 by @griffio)
- [PostgreSQL Dialect] 添加额外的 Postgres String 函数定义 (#4752 by @MariusVolkhart)
- [PostgreSQL Dialect] 将 DATE PostgreSQL 类型添加到 min 和 max 聚合函数 (#4816 by @anddani)
- [PostgreSQL Dialect] 将 PostgreSql 时间类型添加到 SqlBinaryExpr (#4657 by @griffio)
- [PostgreSQL Dialect] 将 TRUNCATE 添加到 postgres 方言 (#4817 by @de-luca)
- [SQLite 3.35 Dialect] 允许按顺序求值的多个 ON CONFLICT 子句 (#4551 by @griffio)
- [JDBC Driver] 添加 Language 注解以实现更愉快的 SQL 编辑 (#4602 by @MariusVolkhart)
- [Native Driver] native 驱动：添加对 linuxArm64 的支持 (#4792 by @hfhbd)
- [Android Driver] 为 AndroidSqliteDriver 添加 `windowSizeBytes` 形参 (#4804 by @BoD)
- [Paging3 Extension] 特性：为 OffsetQueryPagingSource 添加 `initialOffset` (#4802 by @MohamadJaara)

### 变更
- [Compiler] 在适当情况下优先使用 Kotlin 类型 (#4517 by @eygraber)
- [Compiler] 在进行值类型插入时始终包含列名 (#4864)
- [PostgreSQL Dialect] 移除 PostgreSQL 方言的实验性状态 (#4443 by @hfhbd)
- [PostgreSQL Dialect] 更新 PostgreSQL 类型的文档 (#4569 by @MariusVolkhart)
- [R2DBC Driver] 优化 PostgreSQL 中处理整数数据类型时的性能 (#4588 by @MariusVolkhart)

### 移除
- [SQLite Javascript Driver] 移除 sqljs-driver (#4613, #4670 by @dellisd)

### 修复
- [Compiler] 修复带返回且无形参的分组语句的编译 (#4699 by @griffio)
- [Compiler] 使用 SqlBinaryExpr 绑定实参 (#4604 by @griffio)
- [IDE Plugin] 如果已设置，则使用 IDEA Project JDK (#4689 by @griffio)
- [IDE Plugin] 修复 IDEA 2023.2 及更高版本中的“Unknown element type: TYPE_NAME”错误 (#4727)
- [IDE Plugin] 修复了与 2023.2 的一些兼容性问题
- [Gradle Plugin] 更正 `verifyMigrationTask` Gradle 任务的文档 (#4713 by @joshfriend)
- [Gradle Plugin] 添加 Gradle 任务输出消息以帮助用户在验证数据库之前生成数据库 (#4684 by @jingwei99)
- [PostgreSQL Dialect] 修复 PostgreSQL 列的多次重命名问题 (#4566 by @griffio)
- [PostgreSQL Dialect] 修复 4714 postgresql ALTER COLUMN 可空性 (#4831 by @griffio)
- [PostgreSQL Dialect] 修复 4837 ALTER TABLE ALTER COLUMN (#4846 by @griffio)
- [PostgreSQL Dialect] 修复 4501 PostgreSql sequence (#4528 by @griffio)
- [SQLite Dialect] 允许 JSON 二进制操作符用于列表达式 (#4776 by @eygraber)
- [SQLite Dialect] Update From 对于发现的多个同名列存在误报 (#4777 by @eygraber)
- [Native Driver] 支持命名内存数据库 (#4662 by @05nelsonm)
- [Native Driver] 确保查询监听器集合的线程安全 (#4567 by @kpgalligan)
- [JDBC Driver] 修复 ConnectionManager 中的连接泄漏 (#4589 by @MariusVolkhart)
- [JDBC Driver] 修复 JdbcSqliteDriver URL 解析当选择 ConnectionManager 类型时 (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 新增
- [MySQL Dialect] MySQL：支持 timestamp/bigint 在 IF 表达式中使用 (#4329 by @shellderp)
- [MySQL Dialect] MySQL：添加 NOW (#4431 by @hfhbd)
- [Web Driver] 启用 NPM 包发布 (#4364)
- [IDE Plugin] 允许用户在 gradle tooling 连接失败时显示堆栈跟踪 (#4383)

### 变更
- [Sqlite Driver] 简化 JdbcSqliteDriver 使用 schema 迁移 (#3737 by @morki)
- [R2DBC Driver] 真实的异步 R2DBC cursor (#4387 by @hfhbd)

### 修复
- [IDE Plugin] 在需要之前不要实例化 database project 服务 (#4382)
- [IDE Plugin] 处理查找使用期间的进程取消 (#4340)
- [IDE Plugin] 修复 IDE 异步代码生成 (#4406)
- [IDE Plugin] 将包结构的组装移动到一次性计算并在 EDT 之外执行 (#4417)
- [IDE Plugin] 在 2023.2 上使用正确的 stub 索引键进行 kotlin 类型解析 (#4416)
- [IDE Plugin] 等待索引就绪后再执行搜索 (#4419)
- [IDE Plugin] 如果索引不可用，则不执行 goto (#4420)
- [Compiler] 修复分组语句的结果表达式 (#4378)
- [Compiler] 不要将虚拟表用作接口类型 (#4427 by @hfhbd)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 新增
- [MySQL Dialect] 支持小写日期类型以及日期类型的 min 和 max (#4243 by @shellderp)
- [MySQL Dialect] 支持 mysql 二进制表达式和 sum 类型 (#4254 by @shellderp)
- [MySQL Dialect] 支持没有显示宽度的无符号 int (#4306 by @shellderp)
- [MySQL Dialect] 支持 LOCK IN SHARED MODE
- [PostgreSQL Dialect] 添加 boolean 和 Timestamp 到 min max (#4245 by @griffio)
- [PostgreSQL Dialect] Postgres：添加窗口函数支持 (#4283 by @hfhbd)
- [Runtime] 添加 linuxArm64、androidNative 和 watchosDeviceArm 目标到运行时 (#4258 by @hfhbd)
- [Paging Extension] 为分页扩展添加 linux 和 mingw x64 目标 (#4280 by @chippman)

### 变更
- [Gradle Plugin] 为 Android API 34 添加自动方言支持 (#4251)
- [Paging Extension] 添加对 SuspendingTransacter 在 QueryPagingSource 中的支持 (#4292 by @daio)
- [Runtime] 改进 addListener API (#4244 by @hfhbd)
- [Runtime] 使用 Long 作为迁移版本 (#4297 by @hfhbd)

### 修复
- [Gradle Plugin] 为生成的源使用稳定的输出路径 (#4269 by @joshfriend)
- [Gradle Plugin] Gradle 调整 (#4222 by @3flex)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 新增
- [Paging] 为分页扩展添加 js 浏览器目标 (#3843 by @sproctor)
- [Paging] 为 androidx-paging3 扩展添加 iosSimulatorArm64 目标 (#4117)
- [PostgreSQL Dialect] 添加对 gen_random_uuid() 的支持和测试 (#3855 by @davidwheeler123)
- [PostgreSQL Dialect] ALTER TABLE ADD CONSTRAINT PG (#4116 by @griffio)
- [PostgreSQL Dialect] ALTER TABLE ADD CONSTRAINT CHECK (#4120 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSql 字符长度函数 (#4121 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSql 列默认区间 (#4142 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSql 区间列结果 (#4152 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSql ALTER COLUMN (#4165 by @griffio)
- [PostgreSQL Dialect] PostgreSQL：添加 date_part (#4198 by @hfhbd)
- [MySQL Dialect] 添加 SQL 字符长度函数 (#4134 by @griffio)
- [IDE Plugin] 添加 sqldelight 目录建议 (#3976 by @aperfilyev)
- [IDE Plugin] 在 project tree 中压缩中间包 (#3992 by @aperfilyev)
- [IDE Plugin] 添加 JOIN 子句自动补全 (#4086 by @aperfilyev)
- [IDE Plugin] 创建 view intention 和 live template (#4074 by @aperfilyev)
- [IDE Plugin] 警告 `DELETE` 或 `UPDATE` 中缺少 `WHERE` 子句 (#4058 by @aperfilyev)
- [Gradle Plugin] 启用类型安全 project accessors (#4005 by @hfhbd)

### 变更
- [Gradle Plugin] 允许使用 ServiceLoader 机制为 VerifyMigrationTask 注册 DriverInitializer (#3986 by @C2H6O)
- [Gradle Plugin] 创建显式编译器环境 (#4079 by @hfhbd)
- [JS Driver] 将 web worker 驱动拆分为单独的构件
- [JS Driver] 不暴露 JsWorkerSqlCursor (#3874 by @hfhbd)
- [JS Driver] 禁用 sqljs 驱动的发布 (#4108)
- [Runtime] 强制同步驱动需要同步 schema 初始化器 (#4013)
- [Runtime] 改进 Cursors 的异步支持 (#4102)
- [Runtime] 移除已弃用的目标 (#4149 by @hfhbd)
- [Runtime] 移除对旧 MM 的支持 (#4148 by @hfhbd)

### 修复
- [R2DBC Driver] R2DBC：等待关闭驱动 (#4139 by @hfhbd)
- [Compiler] 将迁移中的 PRAGMA 包含在 database create (SqlDriver) 中 (#3845 by @MariusVolkhart)
- [Compiler] 修复 RETURNING 子句的代码生成 (#3872 by @MariusVolkhart)
- [Compiler] 不为虚拟表生成类型 (#4015)
- [Gradle Plugin] 小幅 Gradle 插件质量改进 (#3930 by @zacsweers)
- [IDE Plugin] 修复未解析的 kotlin 类型 (#3924 by @aperfilyev)
- [IDE Plugin] 修复展开通配符 intention 以与限定符一起使用 (#3979 by @aperfilyev)
- [IDE Plugin] 如果 java home 缺失，则使用可用 JDK (#3925 by @aperfilyev)
- [IDE Plugin] 修复包名的查找使用 (#4010)
- [IDE Plugin] 不显示无效元素的自动导入 (#4008)
- [IDE Plugin] 如果缺少方言，则不解析 (#4009)
- [IDE Plugin] 忽略编译器在失效状态下的 IDE 运行 (#4016)
- [IDE Plugin] 添加对 IntelliJ 2023.1 的支持 (#4037 by @madisp)
- [IDE Plugin] 在列重命名时重命名命名实参使用 (#4027 by @aperfilyev)
- [IDE Plugin] 修复添加迁移弹出窗口 (#4105 by @aperfilyev)
- [IDE Plugin] 在迁移文件中禁用 SchemaNeedsMigrationInspection (#4106 by @aperfilyev)
- [IDE Plugin] 使用 SQL 列名而不是类型名进行迁移生成 (#4112 by @aperfilyev)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 新增
- [Paging] 多平台分页扩展 (by @jeffdgr8)
- [Runtime] 为 Listener 接口添加 fun 修饰符。
- [SQLite Dialect] 添加 SQLite 3.33 支持 (UPDATE FROM) (by @eygraber)
- [PostgreSQL Dialect] 支持 PostgreSQL 中的 UPDATE FROM (by @eygraber)

### 变更
- [RDBC Driver] 暴露 connection (by @hfhbd)
- [Runtime] 将迁移回调移动到 main `migrate` fun
- [Gradle Plugin] 向下游项目隐藏 Configurations
- [Gradle Plugin] 仅着色 Intellij (by @hfhbd)
- [Gradle Plugin] 支持 Kotlin 1.8.0-Beta 并添加多版本 Kotlin 检测 (#5591 by @hfhbd)

### 修复
- [RDBC Driver] 使用 `javaObjectType` 而不是 (by @hfhbd)
- [RDBC Driver] 修复 `bindStatement` 中的原始 null 值 (by @hfhbd)
- [RDBC Driver] 支持 R2DBC 1.0 (by @hfhbd)
- [PostgreSQL Dialect] Postgres：修复不带类型形参的数组 (by @hfhbd)
- [IDE Plugin] 将 intellij 提升到 221.6008.13 (by @hfhbd)
- [Compiler] 从纯 views 解析递归 origin 表 (by @hfhbd)
- [Compiler] 使用 table foreign key clause 中的 value 类 (by @hfhbd)
- [Compiler] 修复 SelectQueryGenerator 以支持不带圆括号的 bind 表达式 (by @bellatoris)
- [Compiler] 修复使用事务时重复生成 `${name}Indexes` 变量的问题 (by @sachera)

## [1.5.5] - 2023-01-20
[1.5.5]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.5

此版本是为了兼容 Kotlin 1.8 和 IntelliJ 2021+，支持 JDK 17。

## [1.5.4] - 2022-10-06
[1.5.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.4

此版本是为了兼容 Kotlin 1.7.20 和 AGP 7.3.0。

## [2.0.0-alpha04] - 2022-10-03
[2.0.0-alpha04]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha04

### 破坏性变更

- Paging 3 扩展 API 已更改为仅允许 int 类型用于计数。
- 协程扩展现在需要传入 dispatcher 而不是默认值。
- 方言和 Driver 类是 final 的，请改用委托。

### 新增
- [HSQL Dialect] Hsql：支持在 Insert 中使用 DEFAULT 用于生成列 (#3372 by @hfhbd)
- [PostgreSQL Dialect] PostgreSQL：支持在 INSERT 中使用 DEFAULT 用于生成列 (#3373 by @hfhbd)
- [PostgreSQL Dialect] 添加 NOW() 到 PostgreSQL (#3403 by @hfhbd)
- [PostgreSQL Dialect] PostgreSQL 添加 NOT 操作符 (#3504 by @hfhbd)
- [Paging] 允许将 CoroutineContext 传入 *QueryPagingSource (#3384)
- [Gradle Plugin] 添加更好的版本目录支持方言 (#3435)
- [Native Driver] 添加回调以钩入 NativeSqliteDriver 的 DatabaseConfiguration 创建 (#3512 by @svenjacobs)

### 变更
- [Paging] 为 KeyedQueryPagingSource 支持的 QueryPagingSource 函数添加默认 dispatcher (#3385)
- [Paging] 使 OffsetQueryPagingSource 仅与 Int 配合使用 (#3386)
- [Async Runtime] 将 await* 移动到上层类 ExecutableQuery (#3524 by @hfhbd)
- [Coroutines Extensions] 移除 flow 扩展的默认形参 (#3489)

### 修复
- [Gradle Plugin] 更新到 Kotlin 1.7.20 (#3542 by @zacsweers)
- [R2DBC Driver] 采纳 R2DBC 更改，这些更改不总是发送值 (#3525 by @hfhbd)
- [HSQL Dialect] 修复使用 Hsql 导致 sqlite VerifyMigrationTask 失败 (#3380 by @hfhbd)
- [Gradle Plugin] 将任务转换为使用 Gradle 的惰性配置 API (by @3flex)
- [Gradle Plugin] 避免 Kotlin 1.7.20 中的 NPE (#3398 by @ZacSweers)
- [Gradle Plugin] 修复 squash migrations 任务的描述 (#3449)
- [IDE Plugin] 修复较新 Kotlin 插件中的 NoSuchFieldError (#3422 by @madisp)
- [IDE Plugin] IDEA: UnusedQueryInspection - 修复 ArrayIndexOutOfBoundsException (#3427 by @vanniktech)
- [IDE Plugin] 使用 reflection 用于旧 kotlin plugin 引用
- [Compiler] 带有扩展函数的自定义方言不创建导入 (#3338 by @hfhbd)
- [Compiler] 修复转义 CodeBlock.of("${CodeBlock.toString()}") (#3340 by @hfhbd)
- [Compiler] 迁移中等待异步执行语句 (#3352)
- [Compiler] 修复 AS (#3370 by @hfhbd)
- [Compiler] `getObject` 方法支持自动填充实际类型 (#3401 by @robxyy)
- [Compiler] 修复异步分组返回语句的代码生成 (#3411)
- [Compiler] 如果可能，推断 bind 形参的 Kotlin 类型，否则抛出更好的错误消息 (#3413 by @hfhbd)
- [Compiler] 不允许 ABS("foo") (#3430 by @hfhbd)
- [Compiler] 支持从其他形参推断 kotlin 类型 (#3431 by @hfhbd)
- [Compiler] 始终创建 database 实现 (#3540 by @hfhbd)
- [Compiler] 放宽 javaDoc 并将其添加到自定义 mapper 函数中 (#3554 @hfhbd)
- [Compiler] 修复 DEFAULT 在 binding 中 (by @hfhbd)
- [Paging] 修复 Paging 3 (#3396)
- [Paging] 允许使用 Long 构造 OffsetQueryPagingSource (#3409)
- [Paging] 不静态交换 Dispatchers.Main (#3428)

## [2.0.0-alpha03] - 2022-06-17
[2.0.0-alpha03]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha03

### 破坏性变更

- 方言现在像实际的 gradle 依赖项一样被引用。
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 类型已被移除，取而代之的是 `AfterVersion`，后者现在总是带有驱动。
- `Schema` 类型不再是 `SqlDriver` 的子类型。
- `PreparedStatement` APIs 现在以零为基数的索引调用。

### 新增
- [IDE Plugin] 添加了针对运行中数据库运行 SQLite、MySQL 和 PostgreSQL 命令的支持 (#2718 by @aperfilyev)
- [IDE Plugin] 添加了对 android studio DB inspector 的支持 (#3107 by @aperfilyev)
- [Runtime] 添加了对异步驱动的支持 (#3168 by @dellisd)
- [Native Driver] 支持新的 kotlin native memory model (#3177 by @kpgalligan)
- [JS Driver] 为 SqlJs workers 添加了驱动 (#3203 by @dellisd)
- [Gradle Plugin] 暴露 SQLDelight 任务的 classpath
- [Gradle Plugin] 添加了一个用于 squash migrations 的 Gradle 任务
- [Gradle Plugin] 添加了一个标志以在迁移检测期间忽略 schema 定义
- [MySQL Dialect] 支持 MySQL 中的 FOR SHARE 和 FOR UPDATE (#3098)
- [MySQL Dialect] 支持 MySQL 索引提示 (#3099)
- [PostgreSQL Dialect] 添加 date_trunc (#3295 by @hfhbd)
- [JSON Extensions] 支持 JSON table 函数 (#3090)

### 变更
- [Runtime] 移除不带驱动的 AfterVersion 类型 (#3091)
- [Runtime] 将 Schema 类型移动到顶层
- [Runtime] 开放方言和解析器以支持第三方实现 (#3232 by @hfhbd)
- [Compiler] 在失败报告中包含用于编译的方言 (#3086)
- [Compiler] 跳过未使用的适配器 (#3162 by @eygraber)
- [Compiler] 在 PrepareStatement 中使用零基索引 (#3269 by @hfhbd)
- [Gradle Plugin] 也使方言成为正确的 gradle 依赖项而不是字符串 (#3085)
- [Gradle Plugin] Gradle Verify Task：当数据库文件缺失时抛出异常 (#3126 by @vanniktech)

### 修复
- [Gradle Plugin] 对 Gradle 插件进行小幅清理和调整 (#3171 by @3flex)
- [Gradle Plugin] 不使用 AGP 字符串作为生成的目录
- [Gradle Plugin] 使用 AGP namespace 属性 (#3220)
- [Gradle Plugin] 不将 kotlin-stdlib 作为 Gradle 插件的运行时依赖项 (#3245 by @mbonnin)
- [Gradle Plugin] 简化多平台配置 (#3246 by @mbonnin)
- [Gradle Plugin] 支持 js only 项目 (#3310 by @hfhbd)
- [IDE Plugin] 使用 java home 用于 gradle tooling API (#3078)
- [IDE Plugin] 在 IDE 插件中将 JDBC 驱动加载到正确的 classLoader 上 (#3080)
- [IDE Plugin] 在失效之前将 file element 标记为 null，以避免在已经存在的 PSI 更改期间出现错误 (#3082)
- [IDE Plugin] 在 `ALTER TABLE` 语句中查找新表名的使用时不会崩溃 (#3106)
- [IDE Plugin] 优化 inspectors 并使其能够针对预期异常类型静默失败 (#3121)
- [IDE Plugin] 删除应为生成的目录的文件 (#3198)
- [IDE Plugin] 修复一个 not-safe 操作符调用
- [Compiler] 确保带有 RETURNING 语句的 updates 和 deletes 执行查询 (#3084)
- [Compiler] 正确推断 compound selects 中的实参类型 (#3096)
- [Compiler] Common tables 不生成 data class，因此不返回它们 (#3097)
- [Compiler] 查找最顶层的迁移文件更快 (#3108)
- [Compiler] 在 pipe 操作符上正确继承可空性
- [Compiler] 支持 iif ANSI SQL 函数
- [Compiler] 不生成空的 query files (#3300 by @hfhbd)
- [Compiler] 修复只带问号的 adapter (#3314 by @hfhbd)
- [PostgreSQL Dialect] Postgres 主键列始终非空 (#3092)
- [PostgreSQL Dialect] 修复多个表中同名复制的问题 (#3297 by @hfhbd)
- [SQLite 3.35 Dialect] 仅在从 ALTERED TABLE 中删除 indexed column 时显示错误 (#3158 by @eygraber)

## [2.0.0-alpha02] - 2022-04-13
[2.0.0-alpha02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha02

### 破坏性变更

- 您需要将所有出现的 `app.cash.sqldelight.runtime.rx` 替换为 `app.cash.sqldelight.rx2`

### 新增
- [Compiler] 支持在分组语句末尾返回
- [Compiler] 通过方言模块支持编译器扩展，并添加一个 SQLite JSON 扩展 (#1379, #2087)
- [Compiler] 支持返回值的 PRAGMA 语句 (#1106)
- [Compiler] 支持为标记的列生成值类型
- [Compiler] 添加对乐观锁和验证的支持 (#1952)
- [Compiler] 支持多 update 语句
- [PostgreSQL] 支持 postgres returning 语句
- [PostgreSQL] 支持 postgres date 类型
- [PostgreSQL] 支持 pg intervals
- [PostgreSQL] 支持 PG Booleans 并修复 alter tables 上的 inserts 操作
- [PostgreSQL] 支持 Postgres 中的可选 LIMIT
- [PostgreSQL] 支持 PG BYTEA 类型
- [PostgreSQL] 添加 postgres serials 的测试
- [PostgreSQL] 支持 for update postgres 语法
- [PostgreSQL] 支持 PostgreSQL array types
- [PostgreSQL] 正确存储/检索 PG 中的 UUID 类型
- [PostgreSQL] 支持 PostgreSQL NUMERIC 类型 (#1882)
- [PostgreSQL] 支持 common table expressions 中返回查询 (#2471)
- [PostgreSQL] 支持 json specific 操作符
- [PostgreSQL] 添加 Postgres Copy (by @hfhbd)
- [MySQL] 支持 MySQL Replace
- [MySQL] 支持 NUMERIC/BigDecimal MySQL 类型 (#2051)
- [MySQL] 支持 MySQL truncate 语句
- [MySQL] 支持 Mysql 中的 json specific 操作符 (by @eygraber)
- [MySQL] 支持 MySql INTERVAL (#2969 by @eygraber)
- [HSQL] 添加 HSQL Window 功能
- [SQLite] 不替换 WHERE 中 nullable 形参的相等检测 (#1490 by @eygraber)
- [SQLite] 支持 Sqlite 3.35 returning 语句 (#1490 by @eygraber)
- [SQLite] 支持 GENERATED 子句
- [SQLite] 添加对 Sqlite 3.38 方言的支持 (by @eygraber)

### 变更
- [Compiler] 清理了部分生成的代码
- [Compiler] 禁止在分组语句中使用 table 形参 (#1822)
- [Compiler] 将分组查询放入事务中 (#2785)
- [Runtime] 从 drivers execute 方法返回 updated row count
- [Runtime] 将 SqlCursor 限制在访问 connection 的 critical section (#2123 by @andersio)
- [Gradle Plugin] 比较迁移的 schema 定义 (#841)
- [PostgreSQL] Disallow double quotes for PG
- [MySQL] Error on usage of `==` in MySQL (#2673)

### 修复
- [Compiler] 2.0 alpha 中不同表相同 adapter type 导致编译错误
- [Compiler] UPSERT 语句编译问题 (#2791)
- [Compiler] 如果 SELECT 中存在多个匹配项，query result 应使用 SELECT 中的表 (#1874, #2313)
- [Compiler] 支持更新具有 INSTEAD OF trigger 的 view (#1018)
- [Compiler] 支持 function names 中的 from 和 for
- [Compiler] 允许 SEPARATOR 关键字在 function expressions 中使用
- [Compiler] 无法访问 aliased table 在 ORDER BY 中的 ROWID
- [Compiler] Aliased column name 在 MySQL 的 HAVING 子句中无法识别
- [Compiler] Erroneous 'Multiple columns found' 错误
- [Compiler] 无法设置 `PRAGMA locking_mode = EXCLUSIVE;`
- [PostgreSQL] Postgresql rename column
- [MySQL] UNIX_TIMESTAMP、TO_SECONDS、JSON_ARRAYAGG MySQL 函数无法识别
- [SQLite] 修复 SQLite 窗口功能
- [IDE Plugin] 在 empty progress indicator 中运行 goto handler (#2990)
- [IDE Plugin] 确保 highlight visitor 不运行如果 project 未配置 (#2981, #2976)
- [IDE Plugin] 确保 transitive generated code 也更新在 IDE 中 (#1837)
- [IDE Plugin] Invalidate indexes 当更新 dialect

## [2.0.0-alpha01] - 2022-03-31
[2.0.0-alpha01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha01

这是 2.0 的第一个 alpha 版本，包含一些破坏性变更。我们预计会有更多 ABI 破坏性变更，因此请勿发布依赖此版本的库（应用程序应该没问题）。

### 破坏性变更

- 首先，您需要将所有出现的 `com.squareup.sqldelight` 替换为 `app.cash.sqldelight`
- 其次，您需要将所有出现的 `app.cash.sqldelight.android` 替换为 `app.cash.sqldelight.driver.android`
- 第三，您需要将所有出现的 `app.cash.sqldelight.sqlite.driver` 替换为 `app.cash.sqldelight.driver.jdbc.sqlite`
- 第四，您需要将所有出现的 `app.cash.sqldelight.drivers.native` 替换为 `app.cash.sqldelight.driver.native`
- IDE plugin 必须更新到 2.X 版本，可以在 [alpha 或 eap channel](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha) 找到
- 方言现在是依赖项，您可以在 Gradle 中指定：

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

目前支持的方言有 `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect` 和 `sqlite-3-35-dialect`

- primitive types 必须现在被导入（例如 `INTEGER AS Boolean`，您必须 `import kotlin.Boolean`），一些先前支持的类型现在需要 adapter。Primitive adapters 可在 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` 中找到，用于大多数转换（例如 `IntColumnAdapter` 用于 `Integer AS kotlin.Int`）。

### 新增
- [IDE Plugin] 基本 suggested migration (by @aperfilyev)
- [IDE Plugin] 添加 import hint action (by @aperfilyev)
- [IDE Plugin] 添加 kotlin class completion (by @aperfilyev)
- [Gradle Plugin] 为 Gradle 类型安全 project accessors 添加快捷方式 (by @hfhbd)
- [Compiler] 根据方言自定义 codegen (by @MariusVolkhart)
- [JDBC Driver] 为 JdbcDriver 添加 common types (by @MariusVolkhart)
- [SQLite] 添加对 sqlite 3.35 的支持 (by @eygraber)
- [SQLite] 添加对 ALTER TABLE DROP COLUMN 的支持 (by @eygraber)
- [SQLite] 添加对 Sqlite 3.30 方言的支持 (by @eygraber)
- [SQLite] 支持 sqlite 中的 NULLS FIRST/LAST (by @eygraber)
- [HSQL] 添加 HSQL 对 generated clause 的支持 (by @MariusVolkhart)
- [HSQL] 添加对 HSQL 中命名形参的支持 (by @MariusVolkhart)
- [HSQL] 自定义 HSQL insert query (by @MariusVolkhart)

### 变更
- [一切] 包名已从 `com.squareup.sqldelight` 更改为 `app.cash.sqldelight`。
- [Runtime] 将方言移到其自身的 isolated gradle 模块
- [Runtime] 切换到 driver-implemented query notifications。
- [Runtime] 提取 default column adapters 到 separate module (#2056, #2060)
- [Compiler] 让模块生成 queries 实现，而不是在每个模块中重复生成
- [Compiler] 移除生成的 data class 中 custom `toString` 的生成 (by @PaulWoitaschek)
- [JS Driver] 从 sqljs-driver 移除 sql.js dependency (by @dellisd)
- [Paging] 移除 android paging 2 extension
- [IDE Plugin] 在 SQLDelight 同步时添加一个编辑器 banner (#2511)
- [IDE Plugin] 最低支持的 IntelliJ 版本是 2021.1

### 修复
- [Runtime] 扁平化 listener list 以减少 allocations 和 pointer chasing (by @andersio)
- [IDE Plugin] 修复 error message 以允许跳转到 error (by @hfhbd)
- [IDE Plugin] 添加缺失的 inspection descriptions (#2768 by @aperfilyev)
- [IDE Plugin] 修复 GotoDeclarationHandler 中的异常 (#2531, #2688, #2804 by @aperfilyev)
- [IDE Plugin] Highlight import keyword (by @aperfilyev)
- [IDE Plugin] 修复未解析的 kotlin 类型 (#1678 by @aperfilyev)
- [IDE Plugin] 修复 unresolved package 的 highlighting (#2543 by @aperfilyev)
- [IDE Plugin] 如果 project index 尚未初始化，则不尝试 inspect mismatched columns
- [IDE Plugin] 如果 gradle sync 开始，则取消 SQLDelight import
- [IDE Plugin] 在 undo action 执行的线程之外重新生成 database
- [IDE Plugin] 如果 reference 无法 resolves 则使用 blank java type
- [IDE Plugin] 在 file parsing 期间正确地离开 main thread，并且只在写入时返回
- [IDE Plugin] 改进与旧 IntelliJ 版本的兼容性 (by @3flex)
- [IDE Plugin] 使用 faster annotation API
- [Gradle Plugin] Explicitly support js/android plugins when adding runtime (by @ZacSweers)
- [Gradle Plugin] Register migration output task without derviving schemas from migrations (#2744 by @kevincianfarini)
- [Gradle Plugin] 如果 migration task 崩溃，则 print the file it crashed running
- [Gradle Plugin] 生成代码时对文件进行排序以确保 idempotent outputs (by @ZacSweers)
- [Compiler] 使用 faster APIs for iterating files and dont explore the entire PSI graph
- [Compiler] 为 select function parameters 添加 keyword mangling (#2759 by @aperfilyev)
- [Compiler] 修复 migration adapter 的 `packageName` (by @hfhbd)
- [Compiler] Emit annotations on properties instead of types (#2798 by @aperfilyev)
- [Compiler] 在传递给 Query subtype 之前对实参进行排序 (#2379 by @aperfilyev)

## [1.5.3] - 2021-11-23
[1.5.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.3

### 新增
- [JDBC Driver] 开放 JdbcDriver 以支持 3rd party driver 实现 (#2672 by @hfhbd)
- [MySQL Dialect] 添加缺失的 time increments 函数 (#2671 by @sdoward)
- [Coroutines Extension] 为 coroutines-extensions 添加 M1 目标 (by @PhilipDukhov)

### 变更
- [Paging3 Extension] 将 sqldelight-android-paging3 作为 JAR 而非 AAR 发布 (#2634 by @julioromano)
- 属性名如果也是软关键字，现在将以 `_` 为后缀。例如 `value` 将暴露为 `value_`

### 修复
- [Compiler] 不为 duplicate array parameters 提取变量 (by @aperfilyev)
- [Gradle Plugin] 添加 kotlin.mpp.enableCompatibilityMetadataVariant (#2628 by @martinbonnin)
- [IDE Plugin] Find usages processing requires a read action

## [1.5.2] - 2021-10-12
[1.5.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.2

### 新增
- [Gradle Plugin] HMPP 支持 (#2548 by @martinbonnin)
- [IDE Plugin] 添加 NULL comparison inspection (by @aperfilyev)
- [IDE Plugin] 添加 inspection suppressor (#2519 by @aperfilyev)
- [IDE Plugin] Mixed named and positional parameters inspection (by @aperfilyev)
- [SQLite Driver] 添加 mingwX86 目标 (#2558 by @enginegl)
- [SQLite Driver] 添加 M1 目标
- [SQLite Driver] 添加 linuxX64 支持 (#2456 by @chippmann)
- [MySQL Dialect] 为 mysql 添加 ROW_COUNT 函数 (#2523)
- [PostgreSQL Dialect] postgres rename, drop column (by @pabl0rg)
- [PostgreSQL Dialect] PostgreSQL grammar doesn't recognize CITEXT
- [PostgreSQL Dialect] 包含 TIMESTAMP WITH TIME ZONE 和 TIMESTAMPTZ
- [PostgreSQL Dialect] 为 PostgreSQL GENERATED columns 添加 grammar
- [Runtime] 提供 SqlDriver 作为 AfterVersion 的形参 (#2534, 2614 by @ahmedre)

### 变更
- [Gradle Plugin] explicitely require Gradle 7.0 (#2572 by @martinbonnin)
- [Gradle Plugin] 使 VerifyMigrationTask 支持 Gradle 的 up-to-date checks (#2533 by @3flex)
- [IDE Plugin] 当连接 nullable 与 non-nullable 类型时，不发出“Join compares two columns of different types”警告 (#2550 by @pchmielowski)
- [IDE Plugin] 澄清 lowercase 'as' 在 column type 中的错误 (by @aperfilyev)

### 修复
- [IDE Plugin] 如果 project 已被 disposed，则不重新解析新的 dialect (#2609)
- [IDE Plugin] 如果 associated virtual file 为 null，则 module 为 null (#2607)
- [IDE Plugin] 避免在 unused query inspection 期间崩溃 (#2610)
- [IDE Plugin] 在 write action 中运行 database sync write (#2605)
- [IDE Plugin] 让 IDE 调度 SQLDelight syncronization
- [IDE Plugin] 修复 JavaTypeMixin 中的 NPE (#2603 by @aperfilyev)
- [IDE Plugin] 修复 MismatchJoinColumnInspection 中的 IndexOutOfBoundsException (#2602 by @aperfilyev)
- [IDE Plugin] 为 UnusedColumnInspection 添加 description (#2600 by @aperfilyev)
- [IDE Plugin] 将 PsiElement.generatedVirtualFiles 包装到 read action 中 (#2599 by @aperfilyev)
- [IDE Plugin] 移除不必要的 nonnull cast (#2596)
- [IDE Plugin] Properly handle nulls for find usages (#2595)
- [IDE Plugin] 修复 Android 生成文件的 IDE autocomplete (#2573 by @martinbonnin)
- [IDE Plugin] 修复 SqlDelightGotoDeclarationHandler 中的 NPE (by @aperfilyev)
- [IDE Plugin] 在 insert stmt 中对实参中的 kotlin keywords 进行 mangling (#2433 by @aperfilyev)
- [IDE Plugin] 修复 SqlDelightFoldingBuilder 中的 NPE (#2382 by @aperfilyev)
- [IDE Plugin] Catch ClassCastException in CopyPasteProcessor (#2369 by @aperfilyev)
- [IDE Plugin] 修复 update live template (by @IliasRedissi)
- [IDE Plugin] Adds descriptions to intention actions (#2489 by @aperfilyev)
- [IDE Plugin] 修复 CreateTriggerMixin 中 table 未找到时的异常 (by @aperfilyev)
- [Compiler] Topologically sort table creation statemenets
- [Compiler] Stop invoking `forDatabaseFiles` callback on directories (#2532)
- [Gradle Plugin] Propagate generateDatabaseInterface task dependency to potential consumers (#2518 by @martinbonnin)

## [1.5.1] - 2021-07-16
[1.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.1

### 新增
- [PostgreSQL Dialect] PostgreSQL JSONB 和 ON CONFLICT DO NOTHING (by @satook)
- [PostgreSQL Dialect] 添加对 PostgreSQL ON CONFLICT (column, ...) DO UPDATE 的支持 (by @satook)
- [MySQL Dialect] 支持 MySQL generated columns (by @JGulbronson)
- [Native Driver] 添加 watchosX64 支持
- [IDE Plugin] 添加 parameter types 和 annotations (by @aperfilyev)
- [IDE Plugin] 添加 action 以生成 'select all' query (by @aperfilyev)
- [IDE Plugin] 在 autocomplete 中显示 column types (by @aperfilyev)
- [IDE Plugin] 为 autocomplete 添加 icons (by @aperfilyev)
- [IDE Plugin] 添加 action 以生成 'select by primary key' query (by @aperfilyev)
- [IDE Plugin] 添加 action 以生成 'insert into' query (by @aperfilyev)
- [IDE Plugin] 添加 highlighting for column names, stmt identifiers, function names (by @aperfilyev)
- [IDE Plugin] 添加剩余的 query generation actions (#489 by @aperfilyev)
- [IDE Plugin] 显示来自 insert-stmt 的 parameter hints (by @aperfilyev)
- [IDE Plugin] Table alias intention action (by @aperfilyev)
- [IDE Plugin] Qualify column name intention (by @aperfilyev)
- [IDE Plugin] Go to declaration for kotlin property (by @aperfilyev)

### 变更
- [Native Driver] 改进 native transaction 性能，通过在可能时避免 freezing 和 shareable data structures (by @andersio)
- [Paging 3] 将 Paging3 版本提升到 3.0.0 stable
- [JS Driver] Upgrade sql.js 到 1.5.0

### 修复
- [JDBC SQLite Driver] 在清除 ThreadLocal 之前调用 connection 上的 `close()` (#2444 by @hannesstruss)
- [RX extensions] 修复 subscription / disposal race leak (#2403 by @pyricau)
- [Coroutines extension] 确保我们在 notifying 之前注册 query listener
- [Compiler] Sort notifyQueries 以获得 consistent kotlin output file (by @thomascjy)
- [Compiler] 不要用 `@JvmField` 注解 select query class properties (by @eygraber)
- [IDE Plugin] 修复 import optimizer (#2350 by @aperfilyev)
- [IDE Plugin] 修复 unused column inspection (by @aperfilyev)
- [IDE Plugin] 为 import inspection 和 class annotator 添加 nested classes 支持 (by @aperfilyev)
- [IDE Plugin] 修复 CopyPasteProcessor 中的 NPE (#2363 by @aperfilyev)
- [IDE Plugin] 修复 InlayParameterHintsProvider 中的崩溃 (#2359 by @aperfilyev)
- [IDE Plugin] 修复将任何文本复制粘贴到 create table stmt 时插入 blank lines 的问题 (#2431 by @aperfilyev)

## [1.5.0] - 2021-04-23
[1.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.0

### 新增
- [SQLite Javascript Driver] 启用 sqljs-driver publication (#1667 by @dellisd)
- [Paging3 Extension] Android Paging 3 库的扩展 (#1786 by @kevincianfarini)
- [MySQL Dialect] 添加对 mysql 的 ON DUPLICATE KEY UPDATE conflict resolution 的支持 (by @rharter)
- [SQLite Dialect] 添加 compiler 对 SQLite offsets() 的支持 (by @qjroberts)
- [IDE Plugin] 为 unknown type 添加 import quick fix (#683 by @aperfilyev)
- [IDE Plugin] 添加 unused import inspection (#1161 by @aperfilyev)
- [IDE Plugin] 添加 unused query inspection (by @aperfilyev)
- [IDE Plugin] 添加 unused column inspection (#569 by @aperfilyev)
- [IDE Plugin] Automatically bring imports on copy/paste (#684 by @aperfilyev)
- [IDE Plugin] 当 gradle/intellij plugin versions 不兼容时弹出一个 balloon
- [IDE Plugin] Insert Into ... VALUES(?) parameter hints (#506 by @aperfilyev)
- [IDE Plugin] Inline parameter hints (by @aperfilyev)
- [Runtime] 在运行时中包含一个用于运行带回调迁移的 API (#1844)

### 变更
- [Compiler] Smart cast "IS NOT NULL" queries (#867)
- [Compiler] Protect against keywords that will fail at runtime (#1471, #1629)
- [Gradle Plugin] 将 gradle 插件大小从 60MB 减小到 13MB。
- [Gradle Plugin] Properly support android variants, and remove support for KMM target-specific sql (#1039)
- [Gradle Plugin] 根据 minsdk 选择 minimum sqlite version (#1684)
- [Native Driver] Native driver connection pool 和 performance updates

### 修复
- [Compiler] lambda 表达式前的 NBSP (by @oldergod)
- [Compiler] 修复 generated `bind*` 和 `cursor.get*` 语句中 incompatible types
- [Compiler] SQL clause should persist adapted type (#2067)
- [Compiler] Column with only NULL keyword should be nullable
- [Compiler] Dont generate mapper lambda with type annotations (#1957)
- [Compiler] 如果 custom queries 会冲突，使用 file name 作为 additional package suffix (#1057, #1278)
- [Compiler] 确保 foreign key cascades cause query listeners to be notified (#1325, #1485)
- [Compiler] 如果 unioning two of the same type，返回 table type (#1342)
- [Compiler] 确保 `ifnull` 和 `coalesce` 的 params 可以是 nullable (#1263)
- [Compiler] Correctly use query-imposed nullability for expressions
- [MySQL Dialect] 支持 MySQL `if` statements
- [PostgreSQL Dialect] 在 PostgreSQL 中将 NUMERIC 和 DECIMAL 检索为 Double (#2118)
- [SQLite Dialect] UPSERT notifications should account for BEFORE/AFTER UPDATE triggers (#2198 by @andersio)
- [SQLite Driver] 在 SqliteDriver 中为 threads 使用 multiple connections unless we are in memory (#1832)
- [JDBC Driver] JDBC Driver assumes `autoCommit` is `true` (#2041)
- [JDBC Driver] 确保我们在 exception 时 close connections (#2306)
- [IDE Plugin] 修复因 path separator bug 导致 Windows 上 GoToDeclaration/FindUsages 功能损坏 (#2054 by @angusholder)
- [IDE Plugin] Ignore gradle errors instead of crashing in the IDE
- [IDE Plugin] 如果 sqldelight file 被移动到 non-sqldelight module，则不尝试 codegen
- [IDE Plugin] Ignore codegen errors in IDE
- [IDE Plugin] 确保我们 dont try to negatively substring (#2068)
- [IDE Plugin] Also ensure project is not disposed before running gradle action (#2155)
- [IDE Plugin] Arithmetic on nullable types should also be nullable (#1853)
- [IDE Plugin] Make 'expand * intention' work with additional projections (#2173 by @aperfilyev)
- [IDE Plugin] 如果 kotlin resolution fails during GoTo，dont attempt to go to sqldelight files
- [IDE Plugin] 如果 IntelliJ encounters an exception while sqldelight is indexing，dont crash
- [IDE Plugin] Handle exceptions that happen while detecting errors before codegen in the IDE
- [IDE Plugin] Make the IDE plugin compatible with Dynamic Plugins (#1536)
- [Gradle Plugin] Race condition generating a database using WorkerApi (#2062 by @stephanenicolas)
- [Gradle Plugin] classLoaderIsolation prevents custom jdbc usage (#2048 by @benasher44)
- [Gradle Plugin] 改进 missing packageName error message (by @vanniktech)
- [Gradle Plugin] SQLDelight bleeds IntelliJ dependencies onto buildscript class path (#1998)
- [Gradle Plugin] 修复 gradle build caching (#2075)
- [Gradle Plugin] Do not depend on kotlin-native-utils in Gradle plugin (by @ilmat192)
- [Gradle Plugin] 如果只有 migration files，也写入 database (#2094)
- [Gradle Plugin] 确保 diamond dependencies only get picked up once in the final compilation unit (#1455)

此外，特别感谢 @3flex 在此版本中为改进 SQLDelight 基础设施所做的许多工作。

## [1.4.4] - 2020-10-08
[1.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.4

### 新增
- [PostgreSQL Dialect] 支持 WITH 子句中的数据修改语句
- [PostgreSQL Dialect] 支持 substring function
- [Gradle Plugin] 添加 `verifyMigrations` 标志，用于在 SQLDelight 编译期间验证迁移 (#1872)

### 变更
- [Compiler] 在非 SQLite 方言中将 SQLite specific functions 标记为 unknown
- [Gradle Plugin] 当 sqldelight plugin 已应用但未配置 database 时发出 warning (#1421)

### 修复
- [Compiler] 在 `ORDER BY` 子句中绑定 column name 时报告 error (#1187 by @eygraber)
- [Compiler] Registry warnings 出现时生成 db interface (#1792)
- [Compiler] `CASE` 语句的 incorrect type inference (#1811)
- [Compiler] 为没有 version 的 migration files 提供 better errors (#2006)
- [Compiler] Required database type to marshal is incorrect for some database type ColumnAdapter's (#2012)
- [Compiler] `CAST` 的 nullability (#1261)
- [Compiler] query wrappers 中出现 lots of name shadowed warnings (#1946 by @eygraber)
- [Compiler] Generated code is using full qualifier names (#1939)
- [IDE Plugin] Trigger sqldelight code gen from gradle syncs
- [IDE Plugin] Plugin 不重新生成 database interface 当 changing .sq files 时 (#1945)
- [IDE Plugin] Issue when moving files to new packages (#444)
- [IDE Plugin] 如果 theres nowhere to move the cursor，do nothing instead of crashing (#1994)
- [IDE Plugin] 对 files outside of a gradle project 使用 empty package name (#1973)
- [IDE Plugin] Fail gracefully for invalid types (#1943)
- [IDE Plugin] Throw a better error message when encountering an unknown expression (#1958)
- [Gradle Plugin] SQLDelight bleeds IntelliJ dependencies onto buildscript class path (#1998)
- [Gradle Plugin] "JavadocIntegrationKt not found" compilation error，当在 *.sq 文件中添加 method doc 时 (#1982)
- [Gradle Plugin] SqlDeslight gradle plugin doesn't support Configuration Caching (CoCa) (#1947 by @stephanenicolas)
- [SQLite JDBC Driver] `SQLException: database in auto-commit mode` (#1832)
- [Coroutines Extension] 修复 coroutines-extensions 的 IR backend (#1918 by @dellisd)

## [1.4.3] - 2020-09-04
[1.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.3

### 新增
- [MySQL Dialect] 添加对 MySQL `last_insert_id` function 的支持 (by @lawkai)
- [PostgreSQL Dialect] 支持 `SERIAL` data type (by @veyndan & @felipecsl)
- [PostgreSQL Dialect] 支持 PostgreSQL `RETURNING` (by @veyndan)

### 修复
- [MySQL Dialect] 将 MySQL `AUTO_INCREMENT` 视为具有 default value (#1823)
- [Compiler] 修复 Upsert statement compiler error (#1809 by @eygraber)
- [Compiler] 修复 issue with invalid Kotlin being generated (#1925 by @eygraber)
- [Compiler] 为 unknown functions 提供 a better error message (#1843)
- [Compiler] 将 string 作为 instr 的 second parameter 的 type 暴露
- [IDE Plugin] 修复 daemon bloat 和 UI thread stalling for IDE plugin (#1916)
- [IDE Plugin] 处理 null module scenario (#1902)
- [IDE Plugin] In unconfigured sq files return empty string for the package name (#1920)
- [IDE Plugin] 修复 grouped statements 并为其添加 an integration test (#1820)
- [IDE Plugin] Use built in ModuleUtil to find the module for an element (#1854)
- [IDE Plugin] Only add valid elements to lookups (#1909)
- [IDE Plugin] Parent can be null (#1857)

## [1.4.2] - 2020-08-27
[1.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.2

### 新增
- [Runtime] 支持 new JS IR backend
- [Gradle Plugin] 添加 generateSqlDelightInterface Gradle 任务 (by @vanniktech)
- [Gradle Plugin] 添加 verifySqlDelightMigration Gradle 任务 (by @vanniktech)

### 修复
- [IDE Plugin] Use the gradle tooling API to facilitate data sharing between the IDE and gradle
- [IDE Plugin] Default to false for schema derivation
- [IDE Plugin] Properly retrieve the commonMain source set
- [MySQL Dialect] Added minute to mySqlFunctionType() (by @maaxgr)

## [1.4.1] - 2020-08-21
[1.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.1

### 新增
- [Runtime] 支持 Kotlin 1.4.0 (#1859)

### 变更
- [Gradle Plugin] Make AGP dependency `compileOnly` (#1362)

### 修复
- [Compiler] Add optional javadoc to column defintion rule and to table interface generator (#1224 by @endanke)
- [SQLite Dialect] Add support for sqlite fts5 auxiliary functions highlight, snippet, and bm25 (by @drampelt)
- [MySQL Dialect] 支持 MySQL bit data type
- [MySQL Dialect] 支持 MySQL binary literals
- [PostgreSQL Dialect] Expose `SERIAL` from sql-psi (by @veyndan)
- [PostgreSQL Dialect] Add `BOOLEAN` data type (by @veyndan)
- [PostgreSQL Dialect] Add `NULL` column constraint (by @veyndan)
- [HSQL Dialect] Adds `AUTO_INCREMENT` support to HSQL (by @rharter)

## [1.4.0] - 2020-06-22
[1.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.0

### 新增
- [MySQL Dialect] MySQL 支持 (by @JGulbronson & @veyndan)
- [PostgreSQL Dialect] 实验性的 PostgreSQL 支持 (by @veyndan)
- [HSQL Dialect] 实验性的 H2 支持 (by @MariusVolkhart)
- [SQLite Dialect] SQLite FTS5 支持 (by @benasher44 & @jpalawaga)
- [SQLite Dialect] 支持 ALTER TABLE RENAME COLUMN (#1505 by @angusholder)
- [IDE] IDE 对 migration (.sqm) files 的支持
- [IDE] 添加 SQLDelight Live Templates that mimic built-in SQL Live Templates (#1154 by @veyndan)
- [IDE] 添加 new SqlDelight file action (#42 by @romtsn)
- [Runtime] transactionWithReturn API for transactions that return results
- [Compiler] Syntax for grouping multiple SQL statements together in a .sq file
- [Compiler] 支持从 migration files 生成 schemas
- [Gradle Plugin] 添加一个用于将 migration files 输出为 valid sql 的任务

### 变更
- [文档] Overhaul of the documentation website (by @saket)
- [Gradle Plugin] 改进 unsupported dialect error message (by @veyndan)
- [IDE] Dynamically change file icon based on dialect (by @veyndan)
- [JDBC Driver] Expose a JdbcDriver constructor off of javax.sql.DataSource (#1614)

### 修复
- [Compiler] Support Javadoc on tables and fix multiple javadoc in one file (#1224)
- [Compiler] Enable inserting a value for synthesized columns (#1351)
- [Compiler] Fix inconsistency in directory name sanitizing (by @ZacSweers)
- [Compiler] Synthesized columns should retain nullability across joins (#1656)
- [Compiler] Pin the delete statement on the delete keyword (#1643)
- [Compiler] Fix quoting (#1525 by @angusholder)
- [Compiler] Fix the between operator to properly recurse into expressions (#1279)
- [Compiler] Give better error for missing table/column when creating an index (#1372)
- [Compiler] Enable using the outer querys projection in join constraints (#1346)
- [Native Driver] Make execute use transationPool (by @benasher44)
- [JDBC Driver] Use the jdbc transaction APIs instead of sqlite (#1693)
- [IDE] Fix virtualFile references to always be the original file (#1782)
- [IDE] Use the correct throwable when reporting errors to bugsnag (#1262)
- [Paging Extension] Fix leaky DataSource (#1628)
- [Gradle Plugin] If the output db file already exists when generating a schema, delete it (#1645)
- [Gradle Plugin] Fail migration validation if there are gaps
- [Gradle Plugin] Explicitely use the file index we set (#1644)

## [1.3.0] - 2020-04-03
[1.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.3.0

* 新增: [Gradle] `dialect` 属性，用于指定要编译的 SQL 方言。
* 新增: [Compiler] #1009 实验性的 MySQL 方言支持。
* 新增: [Compiler] #1436 支持 SQLite 3.24 方言和 UPSERT。
* 新增: [JDBC Driver] 将 JDBC 驱动程序从 SQLite JVM 驱动程序中分离出来。
* 修复: [Compiler] #1199 支持任意长度的 lambda 表达式。
* 修复: [Compiler] #1610 修复 `avg()` 的返回类型为可空的。
* 修复: [IntelliJ] #1594 修复导致 Windows 上 Goto 和 Find Usages 功能失效的路径分隔符处理问题。

## [1.2.2] - 2020-01-22
[1.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.2

* 新增: [Runtime] 支持 Windows (mingW)、tvOS、watchOS 和 macOS 架构。
* 修复: [Compiler] `sum()` 的返回类型应为可空的。
* 修复: [Paging] 将 Transacter 传入 QueryDataSourceFactory 以避免竞争条件。
* 修复: [IntelliJ Plugin] 查找文件包名时不搜索依赖项。
* 修复: [Gradle] #862 将 Gradle 中的验证器日志更改为调试级别。
* 增强: [Gradle] 将 GenerateSchemaTask 转换为使用 Gradle worker。
* 注意: `sqldelight-runtime` 构件重命名为 `runtime`。

## [1.2.1] - 2019-12-11
[1.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.1

* 修复: [Gradle] Kotlin Native 1.3.60 支持。
* 修复: [Gradle] #1287 同步时的警告。
* 修复: [Compiler] #1469 Query 的 SynetheticAccessor 创建。
* 修复: [JVM Driver] 修复了内存泄漏。
* 注意: 协程扩展构件要求将 `kotlinx bintray maven` 版本库添加到您的构建脚本中。

## [1.2.0] - 2019-08-30
[1.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.0

* 新增: [Runtime] 稳定的 Flow API。
* 修复: [Gradle] Kotlin Native 1.3.50 支持。
* 修复: [Gradle] #1380 清理构建有时失败。
* 修复: [Gradle] #1348 运行验证任务时打印“Could not retrieve functions”。
* 修复: [Compile] #1405 如果 Query 包含 FTS 表连接，则无法构建项目。
* 修复: [Gradle] #1266 存在多个 database 模块时，Gradle 构建偶尔失败。

## [1.1.4] - 2019-07-11
[1.1.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.4

* 新增: [Runtime] 实验性的 kotlin Flow api。
* 修复: [Gradle] Kotlin/Native 1.3.40 兼容性。
* 修复: [Gradle] #1243 修复了在 Gradle 按需配置下使用 SQLDelight 的问题。
* 修复: [Gradle] #1385 修复了在增量注解处理下使用 SQLDelight 的问题。
* 修复: [Gradle] 允许 gradle tasks cache。
* 修复: [Gradle] #1274 启用 Kotlin DSL 使用 sqldelight extension。
* 修复: [Compiler] 为每个 Query 确定性地生成唯一 ID。
* 修复: [Compiler] 仅在事务完成后通知监听 Query。
* 修复: [JVM Driver] #1370 强制 JdbcSqliteDriver 用户提供数据库 URL。

## [1.1.3] - 2019-04-14
[1.1.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.3

* Gradle Metadata 1.0 发布。

## [1.1.2] - 2019-04-14
[1.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.2

* 新增: [Runtime] #1267 Logging driver decorator。
* 修复: [Compiler] #1254 拆分长度超过 2^16 字符的字符串字面量。
* 修复: [Gradle] #1260 在多平台项目中的 generated sources 被识别为 iOS source。
* 修复: [IDE] #1290 `kotlin.KotlinNullPointerException` 在 `CopyAsSqliteAction.kt:43` 中。
* 修复: [Gradle] #1268 `linkDebugFrameworkIos*` 任务在最近版本中运行失败。

## [1.1.1] - 2019-03-01
[1.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.1

* 修复: [Gradle] 修复 Android 项目的模块依赖编译问题。
* 修复: [Gradle] #1246 在 `afterEvaluate` 中设置 API 依赖项。
* 修复: [Compiler] 数组类型正确打印。

## [1.1.0] - 2019-02-27
[1.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.0

* 新增: [Gradle] #502 允许指定 schema 模块依赖项。
* 增强: [Compiler] #1111 表错误在其他错误之前排序。
* 修复: [Compiler] #1225 返回 `REAL` 字面量的正确类型。
* 修复: [Compiler] #1218 docid 通过 triggers 传播。

## [1.0.3] - 2019-01-30
[1.0.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.3

* 增强: [Runtime] #1195 Native Driver/Runtime Arm32。
* 增强: [Runtime] #1190 从 Query 类型暴露 mapper。

## [1.0.2] - 2019-01-26
[1.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.2

* 修复: [Gradle Plugin] 更新到 kotlin 1.3.20。
* 修复: [Runtime] Transactions 不再吞噬异常。

## [1.0.1] - 2019-01-21
[1.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.1

* 增强: [Native Driver] 允许将目录名传递给 DatabaseConfiguration。
* 增强: [Compiler] #1173 没有包的文件编译失败。
* 修复: [IDE] 正确向 Square 报告 IDE 错误。
* 修复: [IDE] #1162 相同包中的类型显示为错误但工作正常。
* 修复: [IDE] #1166 重命名表时出现 NPE。
* 修复: [Compiler] #1167 尝试解析包含 `UNION` 和 `SELECT` 的复杂 SQL 语句时抛出异常。

## [1.0.0] - 2019-01-08
[1.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.0

* 新增: 生成代码的全面改进，现在采用 Kotlin。
* 新增: RxJava2 extensions artifact。
* 新增: Android Paging extensions artifact。
* 新增: Kotlin Multiplatform 支持。
* 新增: Android、iOS 和 JVM SQLite driver artifacts。
* 新增: Transaction API。

## [0.7.0] - 2018-02-12
[0.7.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.7.0

* 新增: 生成的代码已更新，仅使用 Support SQLite 库。所有查询现在都生成 statement objects，而不是原始字符串。
* 新增: IDE 中的 statement folding。
* 新增: Boolean types 现在自动处理。
* 修复: 从代码生成中移除已弃用的 marshals。
* 修复: 将 'avg' SQL function type 映射更正为 REAL。
* 修复: 正确检测 'julianday' SQL function。

## [0.6.1] - 2017-03-22
[0.6.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.1

* 新增: Delete Update 和 Insert statements without arguments get compiled statements generated。
* 修复: Using clause within a view used in a subquery doesn't error。
* 修复: Duplicate types on generated Mapper removed。
* 修复: Subqueries can be used in expressions that check against arguments。

## [0.6.0] - 2017-03-06
[0.6.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.0

* 新增: Select queries are now exposed as a `SqlDelightStatement` factory instead of string constants。
* 新增: Query JavaDoc is now copied to statement and mapper factories。
* 新增: Emit string constants for view names。
* 修复: Queries on views which require factories now correctly require those factories are arguments。
* 修复: Validate the number of arguments to an insert matches the number of columns specified。
* 修复: Properly encode blob literals used in where clauses。
* 此版本需要 Gradle 3.3 或更高版本。

## [0.5.1] - 2016-10-24
[0.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.1

* 新增: Compiled statements extend an abstract type。
* 修复: Primitive types in parameters will be boxed if nullable。
* 修复: All required factories for bind args are present in factory method。
* 修复: Escaped column names are marshalled correctly。

## [0.5.0] - 2016-10-19
[0.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.0

* 新增: SQLite arguments can be passed typesafely through the Factory
* 新增: IntelliJ plugin performs formatting on .sq files
* 新增: Support for SQLite timestamp literals
* 修复: Parameterized types can be clicked through in IntelliJ
* 修复: Escaped column names no longer throw RuntimeExceptions if grabbed from Cursor。
* 修复: Gradle plugin doesn't crash trying to print exceptions。

## [0.4.4] - 2016-07-20
[0.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.4

* 新增: Native support for shorts as column java type
* 新增: Javadoc on generated mappers and factory methods
* 修复: `group_concat` 和 `nullif` functions have proper nullability
* 修复: Compatibility with Android Studio 2.2-alpha
* 修复: `WITH RECURSIVE` no longer crashes plugin

## [0.4.3] - 2016-07-07
[0.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.3

* 新增: Compilation errors link to source file。
* 新增: Right-click to copy SQLDelight code as valid SQLite。
* 新增: Javadoc on named statements will appear on generated Strings。
* 修复: Generated view models include nullability annotations。
* 修复: Generated code from unions has proper type and nullability to support all possible columns。
* 修复: `sum` and `round` SQLite functions have proper type in generated code。
* 修复: `CAST`s、inner selects bugfixes。
* 修复: Autocomplete in `CREATE TABLE` statements。
* 修复: SQLite keywords can be used in packages。

## [0.4.2] - 2016-06-16
[0.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.2

* 新增: Marshal can be created from the factory。
* 修复: IntelliJ plugin generates factory methods with proper generic order。
* 修复: Function names can use any casing。

## [0.4.1] - 2016-06-14
[0.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.1

* 修复: IntelliJ plugin generates classes with proper generic order。
* 修复: Column definitions can use any casing。

## [0.4.0] - 2016-06-14
[0.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.0

* 新增: Mappers are generated per query instead of per table。
* 新增: Java types can be imported in .sq files。
* 新增: SQLite functions are validated。
* 修复: Remove duplicate errors。
* 修复: Uppercase column names and java keyword column names do not error。

## [0.3.2] - 2016-05-14
[0.3.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.2

* 新增: Autocompletion and find usages now work for views and aliases。
* 修复: Compile-time validation now allows functions to be used in selects。
* 修复: Support insert statements which only declare default values。
* 修复: Plugin no longer crashes when a project not using SQLDelight is imported。

## [0.3.1] - 2016-04-27
[0.3.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.1

* 修复: Interface visibility changed back to public to avoid Illegal Access runtime exceptions from method references。
* 修复: Subexpressions are evaluated properly。

## [0.3.0] - 2016-04-26
[0.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.0

* 新增: Column definitions use SQLite types and can have additional 'AS' constraint to specify java type。
* 新增: Bug reports can be sent from the IDE。
* 修复: Autocomplete functions properly。
* 修复: SQLDelight model files update on .sq file edit。
* 移除: Attached databases no longer supported。

## [0.2.2] - 2016-03-07
[0.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.2

* 新增: Compile-time validation of the columns used by insert, update, delete, index, and trigger statements。
* 修复: Don't crash IDE plugin on file move/create。

## [0.2.1] - 2016-03-07
[0.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.1

* 新增: Ctrl+`/` (Cmd+`/` on OSX) toggles comment of the selected line(s)。
* 新增: Compile-time validation of the columns used by SQL queries。
* 修复: Support Windows paths in both the IDE and Gradle plugin。

## [0.2.0] - 2016-02-29
[0.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.0

* 新增: Added copy constructor to Marshal class。
* 新增: Update to Kotlin 1.0 final。
* 修复: Report 'sqldelight' folder structure problems in a non-failing way。
* 修复: Forbid columns named `table_name`。Their generated constant clashes with the table name constant。
* 修复: Ensure IDE plugin generates model classes immediately and regardless of whether `.sq` files were opened。
* 修复: Support Windows paths in both the IDE and Gradle plugin。

## [0.1.2] - 2016-02-13
[0.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.2

* 修复: Remove code which prevented the Gradle plugin from being used in most projects。
* 修复: Add missing compiler dependency on the Antlr runtime。

## [0.1.1] - 2016-02-12
[0.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.1

* 修复: Ensure the Gradle plugin points to the same version of the runtime as itself。

## [0.1.0] - 2016-02-12
[0.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.0

首次发布。