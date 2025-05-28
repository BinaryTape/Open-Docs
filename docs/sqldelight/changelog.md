# 变更日志

## 未发布

- [SQLite 方言] 修复 Sqlite 3.18 缺失的函数 (#5759 by [Griffio][griffio])
- [Gradle 插件] 添加对版本目录的支持，用于添加模块 (#5755 by [Michael Rittmeister][DRSchlaubi])

## [2.1.0] - 2025-05-16

### 新增
- [WASM 驱动] 添加对 wasmJs 到 web worker 驱动的支持 (#5534 by [Ilya Gulya][IlyaGulya])
- [PostgreSQL 方言] 支持 PostgreSQL UnNest 数组到行 (#5673 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL TSRANGE/TSTZRANGE 支持 (#5297 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL Right Full Join (#5086 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 从时间类型中提取 (#5273 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 数组包含操作符 (#4933 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 删除约束 (#5288 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 类型转换 (#5089 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 子查询的 LATERAL JOIN 操作符 (#5122 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL ILIKE 操作符 (#5330 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL XML 类型 (#5331 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL AT TIME ZONE (#5243 by [Griffio][griffio])
- [PostgreSQL 方言] 支持 PostgreSQL ORDER BY NULLS (#5199 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSQL 当前日期/时间函数支持 (#5226 by [Drew Dobson][drewd])
- [PostgreSQL 方言] PostgreSQL 正则表达式操作符 (#5137 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 brin gist (#5059 by [Griffio][griffio])
- [MySQL 方言] 支持 MySQL 方言的 RENAME INDEX (#5212 by [Oren Kislev][orenkislev-faire])
- [JSON 扩展] 为 JSON 表函数添加别名 (#5372 by [Griffio][griffio])

### 变更
- [编译器] 生成的查询文件为简单修改器返回行计数 (#4578 by [Marius Volkhart][MariusV])
- [原生驱动] 更新 `NativeSqlDatabase.kt` 以更改 `DELETE`、`INSERT` 和 `UPDATE` 语句的只读标志 (#5680 by [Griffio][griffio])
- [PostgreSQL 方言] 将 PgInterval 更改为 String (#5403 by [Griffio][griffio])
- [PostgreSQL 方言] 支持 SqlDelight 模块实现 PostgreSQL 扩展 (#5677 by [Griffio][griffio])

### 修复
- [编译器] 修复：执行带结果的分组语句时通知查询 (#5006 by [Vitor Hugo Schwaab][vitorhugods])
- [编译器] 修复 SqlDelightModule 类型解析器 (#5625 by [Griffio][griffio])
- [编译器] 修复 5501 插入对象转义列 (#5503 by [Griffio][griffio])
- [编译器] 编译器：改进错误消息，使路径链接可点击并显示正确的行和字符位置 (#5604 by [Niklas Baudy][vanniktech])
- [编译器] 修复问题 5298：允许关键字用作表名
- [编译器] 修复命名执行并添加测试
- [编译器] 在排序初始化语句时考虑外键表约束 (#5325 by [Leon Linhart][TheMrMilchmann])
- [编译器] 在涉及制表符时正确对齐错误下划线 (#5224 by [Drew Dobson][drewd])
- [JDBC 驱动] 修复事务结束时 `connectionManager` 的内存泄漏
- [JDBC 驱动] 如文档所述，在事务中运行 SQLite 迁移 (#5218 by [Lukáš Moravec][morki])
- [JDBC 驱动] 修复事务提交/回滚后连接泄漏 (#5205 by [Lukáš Moravec][morki])
- [Gradle 插件] 在 `GenerateSchemaTask` 之前执行 `DriverInitializer` (#5562 by [Emeka Nwagu][nwagu])
- [运行时] 修复 `LogSqliteDriver` 在实际驱动为异步时的崩溃 (#5723 by [Eric Denman][edenman])
- [运行时] 修复 StringBuilder 容量 (#5192 by [Jan Bína][janbina])
- [PostgreSQL 方言] PostgreSQL CREATE OR REPLACE VIEW (#5407 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL to_json (#5606 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 数值解析器 (#5399 by [Griffio][griffio])
- [PostgreSQL 方言] SQLite 窗口函数 (#2799 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL SELECT DISTINCT ON (#5345 by [Griffio][griffio])
- [PostgreSQL 方言] ALTER TABLE ADD COLUMN IF NOT EXISTS (#5309 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 异步绑定参数 (#5313 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 布尔字面量 (#5262 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL 窗口函数 (#5155 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL IS NULL IS NOT NULL 类型 (#5173 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL SELECT DISTINCT (#5172 by [Griffio][griffio])
- [Paging 扩展] Paging 刷新初始加载修复 (#5615 by [Eva][evant])
- [Paging 扩展] 添加 MacOS 原生目标 (#5324 by [Vitor Hugo Schwaab][vitorhugods])
- [IntelliJ 插件] K2 支持

## [2.0.2] - 2024-04-05

### 新增
- [PostgreSQL 方言] 添加 PostgreSQL `STRING_AGG` 函数 (#4950 by [André Danielsson][anddani])
- [PostgreSQL 方言] 为 pg 方言添加 `SET` 语句 (#4927 by [Bastien de Luca][de-luca])
- [PostgreSQL 方言] 添加 PostgreSQL ALTER COLUMN SEQUENCE 参数 (#4916 by [Griffio][griffio])
- [PostgreSQL 方言] 为 INSERT 语句添加 PostgreSQL ALTER COLUMN DEFAULT 支持 (#4912 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSQL ALTER SEQUENCE 和 DROP SEQUENCE (#4920 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 Postgres Regex 函数定义 (#5025 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 为 GIN 添加语法 (#5027 by [Griffio][griffio])

### 变更
- [IDE 插件] 最低版本 2023.1 / Android Studio Iguana
- [编译器] 允许在 `encapsulatingType` 中覆盖类型可空性 (#4882 by [Eliezer Graber][eygraber])
- [编译器] 内联 `SELECT *` 的列名
- [Gradle 插件] 切换到 `processIsolation` (#5068 by [Emeka Nwagu][nwagu])
- [Android 运行时] 将 Android `minSDK` 提高到 21 (#5094 by [Philip Wedemann][hfhbd])
- [驱动] 为方言作者公开更多 JDBC/R2DBC 语句方法 (#5098 by [Philip Wedemann][hfhbd])

### 修复
- [PostgreSQL 方言] 修复 PostgreSQL ALTER TABLE ALTER COLUMN (#4868 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4448 表模型缺失导入 (#4885 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4932 PostgreSQL 默认约束函数 (#4934 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4879 PostgreSQL 迁移期间 ALTER TABLE RENAME COLUMN 的类转换错误 (#4880 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4474 PostgreSQL CREATE EXTENSION (#4541 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5018 PostgreSQL 添加 PRIMARY KEY 不可空类型 (#5020 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4703 聚合表达式 (#5071 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5028 PostgreSQL JSON (#5030 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5040 PostgreSQL JSON 操作符 (#5041 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5040 的 JSON 操作符绑定 (#5100 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5082 tsvector (#5104 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5032 PostgreSQL `UPDATE FROM` 语句的列相邻问题 (#5035 by [Griffio][griffio])
- [SQLite 方言] 修复 4897 SQLite ALTER TABLE RENAME COLUMN (#4899 by [Griffio][griffio])
- [IDE 插件] 修复错误处理器崩溃 (#4988 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] BugSnag 未能在 IDEA 2023.3 中初始化 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 在 IntelliJ 中通过插件打开 `.sq` 文件时出现 PluginException (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 不要将 kotlin 库打包到 intellij 插件中，因为它已经是插件依赖项 (#5126)
- [IDE 插件] 使用 `extensions` 数组而不是流 (#5127)

## [2.0.1] - 2023-12-01

### 新增
- [编译器] 添加对 `SELECT` 中多列表达式的支持 (#4453 by [Adriel Martinez][Adriel-M])
- [PostgreSQL 方言] 添加对 PostgreSQL `CREATE INDEX CONCURRENTLY` 的支持 (#4531 by [Griffio][griffio])
- [PostgreSQL 方言] 允许 PostgreSQL CTEs 辅助语句相互引用 (#4493 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 PostgreSQL 二元表达式和求和类型的支持 (#4539 by [Adriel Martinez][Adriel-M])
- [PostgreSQL 方言] 添加对 PostgreSQL `SELECT DISTINCT ON` 语法的支持 (#4584 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 `SELECT` 语句中 PostgreSQL JSON 函数的支持 (#4590 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 添加 `generate_series` PostgreSQL 函数 (#4717 by [Griffio][griffio])
- [PostgreSQL 方言] 添加额外的 Postgres 字符串函数定义 (#4752 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 将 `DATE` PostgreSQL 类型添加到 `min` 和 `max` 聚合函数 (#4816 by [André Danielsson][anddani])
- [PostgreSQL 方言] 将 PostgreSQL 时间类型添加到 SqlBinaryExpr (#4657 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 `TRUNCATE` 到 Postgres 方言 (#4817 by [Bastien de Luca][de-luca])
- [SQLite 3.35 方言] 允许多个 `ON CONFLICT` 子句按顺序评估 (#4551 by [Griffio][griffio])
- [JDBC 驱动] 为更愉快的 SQL 编辑添加语言注解 (#4602 by [Marius Volkhart][MariusV])
- [原生驱动] 原生驱动：添加对 linuxArm64 的支持 (#4792 by [Philip Wedemann][hfhbd])
- [Android 驱动] 为 AndroidSqliteDriver 添加 `windowSizeBytes` 参数 (#4804 by [Benoit Lubek][BoD])
- [Paging3 扩展] feat: 为 OffsetQueryPagingSource 添加 `initialOffset` (#4802 by [Mohamad Jaara][MohamadJaara])

### 变更
- [编译器] 在适当情况下优先使用 Kotlin 类型 (#4517 by [Eliezer Graber][eygraber])
- [编译器] 执行值类型插入时始终包含列名 (#4864)
- [PostgreSQL 方言] 移除 PostgreSQL 方言的实验状态 (#4443 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] 更新 PostgreSQL 类型的文档 (#4569 by [Marius Volkhart][MariusV])
- [R2DBC 驱动] 优化 PostgreSQL 中处理整数数据类型时的性能 (#4588 by [Marius Volkhart][MariusV])

### 移除
- [SQLite Javascript 驱动] 移除 sqljs-driver (#4613, #4670 by [Derek Ellis][dellisd])

### 修复
- [编译器] 修复带返回且无参数的分组语句的编译 (#4699 by [Griffio][griffio])
- [编译器] 使用 SqlBinaryExpr 绑定参数 (#4604 by [Griffio][griffio])
- [IDE 插件] 如果已设置，则使用 IDEA 项目 JDK (#4689 by [Griffio][griffio])
- [IDE 插件] 修复 IDEA 2023.2 及更高版本中的“未知元素类型：TYPE_NAME”错误 (#4727)
- [IDE 插件] 修复了一些与 2023.2 的兼容性问题
- [Gradle 插件] 更正 `verifyMigrationTask` Gradle 任务的文档 (#4713 by [Josh Friend][joshfriend])
- [Gradle 插件] 添加 Gradle 任务输出消息以帮助用户在验证数据库之前生成数据库 (#4684 by [Jingwei][jingwei99])
- [PostgreSQL 方言] 修复 PostgreSQL 列的多次重命名问题 (#4566 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4714 PostgreSQL ALTER COLUMN NULLABILITY (#4831 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4837 ALTER TABLE ALTER COLUMN (#4846 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4501 PostgreSQL SEQUENCE (#4528 by [Griffio][griffio])
- [SQLite 方言] 允许 JSON 二元操作符用于列表达式 (#4776 by [Eliezer Graber][eygraber])
- [SQLite 方言] 更新 FROM 语句对发现多个同名列的误报 (#4777 by [Eliezer Graber][eygraber])
- [原生驱动] 支持命名内存数据库 (#4662 by [Matthew Nelson][05nelsonm])
- [原生驱动] 确保查询监听器集合的线程安全 (#4567 by [Kevin Galligan][kpgalligan])
- [JDBC 驱动] 修复 `ConnectionManager` 中的连接泄漏 (#4589 by [Marius Volkhart][MariusV])
- [JDBC 驱动] 修复 `JdbcSqliteDriver` 在选择 `ConnectionManager` 类型时的 URL 解析 (#4656 by [Matthew Nelson][05nelsonm])

## [2.0.0] - 2023-07-26

### 新增
- [MySQL 方言] MySQL: 支持 IF 表达式中的 `timestamp`/`bigint` (#4329 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] MySQL: 添加 `now` (#4431 by [Philip Wedemann][hfhbd])
- [Web 驱动] 启用 NPM 包发布 (#4364)
- [IDE 插件] 允许用户在 Gradle 工具连接失败时显示堆栈跟踪 (#4383)

### 变更
- [SQLite 驱动] 简化 `JdbcSqliteDriver` 使用 schema 迁移 (#3737 by [Lukáš Moravec][morki])
- [R2DBC 驱动] 真实的异步 R2DBC 游标 (#4387 by [Philip Wedemann][hfhbd])

### 修复
- [IDE 插件] 在需要之前不要实例化数据库项目服务 (#4382)
- [IDE 插件] 处理查找使用期间的进程取消 (#4340)
- [IDE 插件] 修复 IDE 异步代码生成 (#4406)
- [IDE 插件] 将包结构的组装移动到一次性计算并在 EDT 之外执行 (#4417)
- [IDE 插件] 在 2023.2 版本上使用正确的 stub 索引键进行 Kotlin 类型解析 (#4416)
- [IDE 插件] 在执行搜索之前等待索引就绪 (#4419)
- [IDE 插件] 如果索引不可用，则不执行跳转 (#4420)
- [编译器] 修复分组语句的结果表达式 (#4378)
- [编译器] 不要将虚拟表用作接口类型 (#4427 by [Philip Wedemann][hfhbd])

## [2.0.0-rc02] - 2023-06-27

### 新增
- [MySQL 方言] 支持小写日期类型以及日期类型的 `min` 和 `max` (#4243 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支持 MySQL 二元表达式和求和类型 (#4254 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支持没有显示宽度的无符号整数 (#4306 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支持 `LOCK IN SHARED MODE`
- [PostgreSQL 方言] 为 `min` 和 `max` 添加布尔值和时间戳 (#4245 by [Griffio][griffio])
- [PostgreSQL 方言] Postgres: 添加窗口函数支持 (#4283 by [Philip Wedemann][hfhbd])
- [运行时] 为运行时添加 linuxArm64、androidNative 和 watchosDeviceArm 目标 (#4258 by [Philip Wedemann][hfhbd])
- [Paging 扩展] 为 paging 扩展添加 linux 和 mingw x64 目标 (#4280 by [Cedric Hippmann][chippman])

### 变更
- [Gradle 插件] 为 Android API 34 添加自动方言支持 (#4251)
- [Paging 扩展] 为 QueryPagingSource 添加 SuspendingTransacter 支持 (#4292 by [Ilya Polenov][daio])
- [运行时] 改进 addListener API (#4244 by [Philip Wedemann][hfhbd])
- [运行时] 使用 `Long` 作为迁移版本 (#4297 by [Philip Wedemann][hfhbd])

### 修复
- [Gradle 插件] 为生成的源使用稳定的输出路径 (#4269 by [Josh Friend][joshfriend])
- [Gradle 插件] Gradle 调整 (#4222 by [Matthew Haughton][3flex])

## [2.0.0-rc01] - 2023-05-29

### 新增
- [Paging] 为 paging 扩展添加 JS 浏览器目标 (#3843 by [Sean Proctor][sproctor])
- [Paging] 为 `androidx-paging3` 扩展添加 iosSimulatorArm64 目标 (#4117)
- [PostgreSQL 方言] 添加对 `gen_random_uuid()` 的支持和测试 (#3855 by [David Wheeler][davidwheeler123])
- [PostgreSQL 方言] ALTER TABLE ADD CONSTRAINT PostgreSQL (#4116 by [Griffio][griffio])
- [PostgreSQL 方言] ALTER TABLE ADD CONSTRAINT CHECK (#4120 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSQL 字符长度函数 (#4121 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSQL 列默认间隔 (#4142 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSQL 间隔列结果 (#4152 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSQL ALTER COLUMN (#4165 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL: 添加 `date_part` (#4198 by [Philip Wedemann][hfhbd])
- [MySQL 方言] 添加 SQL 字符长度函数 (#4134 by [Griffio][griffio])
- [IDE 插件] 添加 sqldelight 目录建议 (#3976 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 在项目树中压缩中间包 (#3992 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加 JOIN 子句自动补全 (#4086 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 创建视图意图和实时模板 (#4074 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 警告 DELETE 或 UPDATE 语句中缺少 WHERE 子句 (#4058 by [Alexander Perfilyev][aperfilyev])
- [Gradle 插件] 启用类型安全项目访问器 (#4005 by [Philip Wedemann][hfhbd])

### 变更
- [Gradle 插件] 允许使用 ServiceLoader 机制为 VerifyMigrationTask 注册 DriverInitializer (#3986 by [Alex Doubov][C2H6O])
- [Gradle 插件] 创建显式编译器环境 (#4079 by [Philip Wedemann][hfhbd])
- [JS 驱动] 将 web worker 驱动拆分为单独的构件
- [JS 驱动] 不暴露 JsWorkerSqlCursor (#3874 by [Philip Wedemann][hfhbd])
- [JS 驱动] 禁用 sqljs 驱动的发布 (#4108)
- [运行时] 强制同步驱动需要同步 schema 初始化器 (#4013)
- [运行时] 改进对 Cursors 的异步支持 (#4102)
- [运行时] 移除弃用目标 (#4149 by [Philip Wedemann][hfhbd])
- [运行时] 移除对旧 MM 的支持 (#4148 by [Philip Wedemann][hfhbd])

### 修复
- [R2DBC 驱动] R2DBC: 等待关闭驱动 (#4139 by [Philip Wedemann][hfhbd])
- [编译器] 包含迁移中的 PRAGMA 到数据库创建 (`SqlDriver`) (#3845 by [Marius Volkhart][MariusV])
- [编译器] 修复 `RETURNING` 子句的代码生成 (#3872 by [Marius Volkhart][MariusV])
- [编译器] 不为虚拟表生成类型 (#4015)
- [Gradle 插件] 小幅 Gradle 插件质量改进 (#3930 by [Zac Sweers][zacsweers])
- [IDE 插件] 修复未解析的 Kotlin 类型 (#3924 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复展开通配符意图以与限定符一起使用 (#3979 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 如果 `java home` 缺失，则使用可用 JDK (#3925 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复包名查找使用 (#4010)
- [IDE 插件] 不显示无效元素的自动导入 (#4008)
- [IDE 插件] 如果缺少方言，则不解析 (#4009)
- [IDE 插件] 忽略编译器在无效状态下的 IDE 运行 (#4016)
- [IDE 插件] 添加对 IntelliJ 2023.1 的支持 (#4037 by [Madis Pink][madisp])
- [IDE 插件] 在列重命名时重命名命名参数使用 (#4027 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复添加迁移弹出窗口 (#4105 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 在迁移文件中禁用 SchemaNeedsMigrationInspection (#4106 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 使用 SQL 列名而不是类型名进行迁移生成 (#4112 by [Alexander Perfilyev][aperfilyev])

## [2.0.0-alpha05] - 2023-01-20

### 新增
- [Paging] 多平台 Paging 扩展 (by [Jeff Lockhart][jeffdgr8])
- [运行时] 为 `Listener` 接口添加 `fun` 修饰符。
- [SQLite 方言] 添加 SQLite 3.33 支持 (`UPDATE FROM`) (by [Eliezer Graber][eygraber])
- [PostgreSQL 方言] 支持 PostgreSQL 中的 `UPDATE FROM` (by [Eliezer Graber][eygraber])

### 变更
- [R2DBC 驱动] 暴露连接 (by [Philip Wedemann][hfhbd])
- [运行时] 将迁移回调移到主 `migrate` 函数中
- [Gradle 插件] 向下游项目隐藏配置
- [Gradle 插件] 仅着色 IntelliJ (by [Philip Wedemann][hfhbd])
- [Gradle 插件] 支持 Kotlin 1.8.0-Beta 并添加多版本 Kotlin 测试 (by [Philip Wedemann][hfhbd])

### 修复
- [R2DBC 驱动] 使用 `javaObjectType` 代替 (by [Philip Wedemann][hfhbd])
- [R2DBC 驱动] 修复 `bindStatement` 中的原始空值 (by [Philip Wedemann][hfhbd])
- [R2DBC 驱动] 支持 R2DBC 1.0 (by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] Postgres: 修复不带类型参数的数组 (by [Philip Wedemann][hfhbd])
- [IDE 插件] 将 intellij 提升到 221.6008.13 (by [Philip Wedemann][hfhbd])
- [编译器] 从纯视图解析递归源表 (by [Philip Wedemann][hfhbd])
- [编译器] 使用表外键子句中的值类 (by [Philip Wedemann][hfhbd])
- [编译器] 修复 `SelectQueryGenerator` 以支持不带括号的绑定表达式 (by [Doogie Min][bellatoris])
- [编译器] 修复使用事务时重复生成 `${name}Indexes` 变量的问题 (by [Andreas Sacher][sachera])

## [1.5.5] - 2023-01-20

此版本是为了兼容 Kotlin 1.8 和 IntelliJ 2021+，支持 JDK 17。

## [1.5.4] - 2022-10-06

此版本是为了兼容 Kotlin 1.7.20 和 AGP 7.3.0。

## [2.0.0-alpha04] - 2022-10-03

### 破坏性变更

- Paging 3 扩展 API 已更改为仅允许 `int` 类型用于计数。
- 协程扩展现在需要传入 `dispatcher` 而不是默认值。
- 方言和驱动类是最终的，请改用委托。

### 新增
- [HSQL 方言] HSQL: 支持在 INSERT 中使用 `DEFAULT` 用于生成列 (#3372 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL: 支持在 INSERT 中使用 `DEFAULT` 用于生成列 (#3373 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] 添加 `NOW()` 到 PostgreSQL (#3403 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL 添加 `NOT` 操作符 (#3504 by [Philip Wedemann][hfhbd])
- [Paging] 允许将 CoroutineContext 传入 `*QueryPagingSource` (#3384)
- [Gradle 插件] 添加更好的版本目录支持方言 (#3435)
- [原生驱动] 添加回调以钩入 `NativeSqliteDriver` 的 `DatabaseConfiguration` 创建 (#3512 by [Sven Jacobs][svenjacobs])

### 变更
- [Paging] 为 KeyedQueryPagingSource 支持的 QueryPagingSource 函数添加默认调度器 (#3385)
- [Paging] 使 OffsetQueryPagingSource 仅与 `Int` 配合使用 (#3386)
- [异步运行时] 将 `await*` 移动到上层类 `ExecutableQuery` (#3524 by [Philip Wedemann][hfhbd])
- [协程扩展] 移除流扩展的默认参数 (#3489)

### 修复
- [Gradle 插件] 更新到 Kotlin 1.7.20 (#3542 by [Zac Sweers][zacsweers])
- [R2DBC 驱动] 采纳 R2DBC 更改，这些更改不总是发送值 (#3525 by [Philip Wedemann][hfhbd])
- [HSQL 方言] 修复使用 HSQL 导致 `sqlite VerifyMigrationTask` 失败 (#3380 by [Philip Wedemann][hfhbd])
- [Gradle 插件] 将任务转换为使用 Gradle 的惰性配置 API (by [Matthew Haughton][3flex])
- [Gradle 插件] 避免 Kotlin 1.7.20 中的 NPE (#3398 by [Zac Sweers][ZacSweers])
- [Gradle 插件] 修复 squash migrations 任务的描述 (#3449)
- [IDE 插件] 修复较新 Kotlin 插件中的 `NoSuchFieldError` (#3422 by [Madis Pink][madisp])
- [IDE 插件] IDEA: UnusedQueryInspection - 修复 ArrayIndexOutOfBoundsException (#3427 by [Niklas Baudy][vanniktech])
- [IDE 插件] 为旧 Kotlin 插件引用使用反射
- [编译器] 带有扩展函数的自定义方言不创建导入 (#3338 by [Philip Wedemann][hfhbd])
- [编译器] 修复转义 `CodeBlock.of("${CodeBlock.toString()}")` (#3340 by [Philip Wedemann][hfhbd])
- [编译器] 迁移中等待异步执行语句 (#3352)
- [编译器] 修复 AS (#3370 by [Philip Wedemann][hfhbd])
- [编译器] `getObject` 方法支持自动填充实际类型 (#3401 by [Rob X][robx])
- [编译器] 修复异步分组返回语句的代码生成 (#3411)
- [编译器] 如果可能，推断绑定参数的 Kotlin 类型，否则抛出更好的错误消息 (#3413 by [Philip Wedemann][hfhbd])
- [编译器] 不允许 `ABS("foo")` (#3430 by [Philip Wedemann][hfhbd])
- [编译器] 支持从其他参数推断 Kotlin 类型 (#3431 by [Philip Wedemann][hfhbd])
- [编译器] 始终创建数据库实现 (#3540 by [Philip Wedemann][hfhbd])
- [编译器] 放宽 javaDoc 并将其添加到自定义映射函数中 (#3554 by [Philip Wedemann][hfhbd])
- [编译器] 修复绑定中的 DEFAULT (by [Philip Wedemann][hfhbd])
- [Paging] 修复 Paging 3 (#3396)
- [Paging] 允许使用 `Long` 构造 `OffsetQueryPagingSource` (#3409)
- [Paging] 不静态交换 `Dispatchers.Main` (#3428)

## [2.0.0-alpha03] - 2022-06-17

### 破坏性变更

- 方言现在像实际的 Gradle 依赖一样被引用。
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 类型已被移除，取而代之的是 `AfterVersion`，后者现在总是带有驱动。
- `Schema` 类型不再是 `SqlDriver` 的子类型。
- `PreparedStatement` API 现在以零为基数的索引调用。

### 新增
- [IDE 插件] 添加了针对运行中数据库运行 SQLite、MySQL 和 PostgreSQL 命令的支持 (#2718 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加了对 Android Studio DB Inspector 的支持 (#3107 by [Alexander Perfilyev][aperfilyev])
- [运行时] 添加了对异步驱动的支持 (#3168 by [Derek Ellis][dellisd])
- [原生驱动] 支持新的 Kotlin 原生内存模型 (#3177 by [Kevin Galligan][kpgalligan])
- [JS 驱动] 为 SqlJs workers 添加了驱动 (#3203 by [Derek Ellis][dellisd])
- [Gradle 插件] 暴露 SQLDelight 任务的类路径
- [Gradle 插件] 添加了用于压缩迁移的 Gradle 任务
- [Gradle 插件] 添加了一个标志以在迁移检查期间忽略 schema 定义
- [MySQL 方言] 支持 MySQL 中的 `FOR SHARE` 和 `FOR UPDATE` (#3098)
- [MySQL 方言] 支持 MySQL 索引提示 (#3099)
- [PostgreSQL 方言] 添加 `date_trunc` (#3295 by [Philip Wedemann][hfhbd])
- [JSON 扩展] 支持 JSON 表函数 (#3090)

### 变更
- [运行时] 移除不带驱动的 AfterVersion 类型 (#3091)
- [运行时] 将 Schema 类型移动到顶层
- [运行时] 开放方言和解析器以支持第三方实现 (#3232 by [Philip Wedemann][hfhbd])
- [编译器] 在失败报告中包含用于编译的方言 (#3086)
- [编译器] 跳过未使用的适配器 (#3162 by [Eliezer Graber][eygraber])
- [编译器] 在 `PrepareStatement` 中使用零基索引 (#3269 by [Philip Wedemann][hfhbd])
- [Gradle 插件] 也使方言成为正确的 Gradle 依赖项而不是字符串 (#3085)
- [Gradle 插件] Gradle 验证任务：当数据库文件缺失时抛出异常 (#3126 by [Niklas Baudy][vanniktech])

### 修复
- [Gradle 插件] 对 Gradle 插件进行小幅清理和调整 (#3171 by [Matthew Haughton][3flex])
- [Gradle 插件] 不使用 AGP 字符串作为生成目录
- [Gradle 插件] 使用 AGP 命名空间属性 (#3220)
- [Gradle 插件] 不将 `kotlin-stdlib` 作为 Gradle 插件的运行时依赖项 (#3245 by [Martin Bonnin][mbonnin])
- [Gradle 插件] 简化多平台配置 (#3246 by [Martin Bonnin][mbonnin])
- [Gradle 插件] 支持仅限 js 的项目 (#3310 by [Philip Wedemann][hfhbd])
- [IDE 插件] 使用 `java home` 用于 Gradle 工具 API (#3078)
- [IDE 插件] 在 IDE 插件中将 JDBC 驱动加载到正确的 `classLoader` 上 (#3080)
- [IDE 插件] 在失效之前将文件元素标记为 null，以避免在现有 PSI 更改期间出现错误 (#3082)
- [IDE 插件] 在 `ALTER TABLE` 语句中查找新表名的使用时不要崩溃 (#3106)
- [IDE 插件] 优化检查器并使其能够针对预期异常类型静默失败 (#3121)
- [IDE 插件] 删除应为生成目录的文件 (#3198)
- [IDE 插件] 修复不安全的运算符调用
- [编译器] 确保带有 RETURNING 语句的更新和删除执行查询 (#3084)
- [编译器] 正确推断复合选择中的参数类型 (#3096)
- [编译器] 公共表不生成数据类，因此不返回它们 (#3097)
- [编译器] 更快地找到顶级迁移文件 (#3108)
- [编译器] 正确继承管道运算符的可空性
- [编译器] 支持 `iif` ANSI SQL 函数
- [编译器] 不生成空的查询文件 (#3300 by [Philip Wedemann][hfhbd])
- [编译器] 修复仅带问号的适配器 (#3314 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] Postgres 主键列始终不可空 (#3092)
- [PostgreSQL 方言] 修复多个表中同名复制的问题 (#3297 by [Philip Wedemann][hfhbd])
- [SQLite 3.35 方言] 仅在从更改的表中删除索引列时显示错误 (#3158 by [Eliezer Graber][eygraber])

## [2.0.0-alpha02] - 2022-04-13

### 破坏性变更

- 您需要将所有出现的 `app.cash.sqldelight.runtime.rx` 替换为 `app.cash.sqldelight.rx2`

### 新增
- [编译器] 支持在分组语句末尾返回
- [编译器] 通过方言模块支持编译器扩展，并添加 SQLite JSON 扩展 (#1379, #2087)
- [编译器] 支持返回值的 PRAGMA 语句 (#1106)
- [编译器] 支持为标记列生成值类型
- [编译器] 添加乐观锁和验证支持 (#1952)
- [编译器] 支持多更新语句
- [PostgreSQL] 支持 Postgres `RETURNING` 语句
- [PostgreSQL] 支持 Postgres 日期类型
- [PostgreSQL] 支持 PG 区间
- [PostgreSQL] 支持 PG 布尔值并修复修改表的插入操作
- [PostgreSQL] 支持 Postgres 中的可选限制
- [PostgreSQL] 支持 PG `BYTEA` 类型
- [PostgreSQL] 添加 Postgres 序列化测试
- [PostgreSQL] 支持 Postgres 语法更新
- [PostgreSQL] 支持 PostgreSQL 数组类型
- [PostgreSQL] 正确存储/检索 PG 中的 UUID 类型
- [PostgreSQL] 支持 PostgreSQL NUMERIC 类型 (#1882)
- [PostgreSQL] 支持在公共表表达式中返回查询 (#2471)
- [PostgreSQL] 支持 JSON 特定操作符
- [PostgreSQL] 添加 Postgres Copy (by [Philip Wedemann][hfhbd])
- [MySQL] 支持 MySQL Replace
- [MySQL] 支持 NUMERIC/BigDecimal MySQL 类型 (#2051)
- [MySQL] 支持 MySQL `TRUNCATE` 语句
- [MySQL] 支持 MySQL 中的 JSON 特定操作符 (by [Eliezer Graber][eygraber])
- [MySQL] 支持 MySQL INTERVAL (#2969 by [Eliezer Graber][eygraber])
- [HSQL] 添加 HSQL 窗口功能
- [SQLite] 不在 WHERE 子句中替换可空参数的相等性检查 (#1490 by [Eliezer Graber][eygraber])
- [SQLite] 支持 Sqlite 3.35 返回语句 (#1490 by [Eliezer Graber][eygraber])
- [SQLite] 支持 GENERATED 子句
- [SQLite] 添加 Sqlite 3.38 方言支持 (by [Eliezer Graber][eygraber])

### 变更
- [编译器] 清理生成的代码
- [编译器] 禁止在分组语句中使用表参数 (#1822)
- [编译器] 将分组查询放入事务中 (#2785)
- [运行时] 从驱动的 `execute` 方法返回更新的行数
- [运行时] 将 `SqlCursor` 限制在访问连接的关键部分 (#2123 by [Anders Ha][andersio])
- [Gradle 插件] 比较迁移的 schema 定义 (#841)
- [PostgreSQL] PG 不允许双引号
- [MySQL] MySQL 中使用 `==` 时报错 (#2673)

### 修复
- [编译器] 2.0 alpha 中不同表相同适配器类型导致编译错误
- [编译器] Upsert 语句编译问题 (#2791)
- [编译器] 如果有多个匹配，查询结果应使用 SELECT 中的表 (#1874, #2313)
- [编译器] 支持更新具有 `INSTEAD OF` 触发器的视图 (#1018)
- [编译器] 支持函数名中的 `from` 和 `for`
- [编译器] 允许 `SEPARATOR` 关键字在函数表达式中
- [编译器] 无法访问 ORDER BY 中别名表的 ROWID
- [编译器] MySQL 中 HAVING 子句中未识别别名列名
- [编译器] 错误的“发现多列”错误
- [编译器] 无法设置 `PRAGMA locking_mode = EXCLUSIVE;`
- [PostgreSQL] PostgreSQL 重命名列
- [MySQL] `UNIX_TIMESTAMP`、`TO_SECONDS`、`JSON_ARRAYAGG` MySQL 函数未识别
- [SQLite] 修复 SQLite 窗口功能
- [IDE 插件] 在空进度指示器中运行 goto 处理程序 (#2990)
- [IDE 插件] 确保如果项目未配置，高亮访问器不运行 (#2981, #2976)
- [IDE 插件] 确保在 IDE 中也更新传递生成的代码 (#1837)
- [IDE 插件] 更新方言时使索引失效

## [2.0.0-alpha01] - 2022-03-31

这是 2.0 的第一个 alpha 版本，包含一些破坏性变更。我们预计会有更多 ABI 破坏性变更，因此请勿发布依赖此版本的库（应用程序应该没问题）。

### 破坏性变更

- 首先，您需要将所有出现的 `com.squareup.sqldelight` 替换为 `app.cash.sqldelight`
- 其次，您需要将所有出现的 `app.cash.sqldelight.android` 替换为 `app.cash.sqldelight.driver.android`
- 第三，您需要将所有出现的 `app.cash.sqldelight.sqlite.driver` 替换为 `app.cash.sqldelight.driver.jdbc.sqlite`
- 第四，您需要将所有出现的 `app.cash.sqldelight.drivers.native` 替换为 `app.cash.sqldelight.driver.native`
- IDE 插件必须更新到 2.X 版本，可以在 [alpha 或 eap 渠道](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha) 找到
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

- 原始类型现在必须导入（例如 `INTEGER AS Boolean`，您必须 `import kotlin.Boolean`），一些以前支持的类型现在需要适配器。大多数转换（例如 `IntColumnAdapter` 用于 `Integer AS kotlin.Int`）的原始适配器可在 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` 中找到。

### 新增
- [IDE 插件] 基本建议迁移 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加导入提示操作 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加 Kotlin 类自动补全 (by [Alexander Perfilyev][aperfilyev])
- [Gradle 插件] 为 Gradle 类型安全项目访问器添加快捷方式 (by [Philip Wedemann][hfhbd])
- [编译器] 根据方言自定义代码生成 (by [Marius Volkhart][MariusV])
- [JDBC 驱动] 为 `JdbcDriver` 添加通用类型 (by [Marius Volkhart][MariusV])
- [SQLite] 添加对 SQLite 3.35 的支持 (by [Eliezer Graber][eygraber])
- [SQLite] 添加对 `ALTER TABLE DROP COLUMN` 的支持 (by [Eliezer Graber][eygraber])
- [SQLite] 添加对 Sqlite 3.30 方言的支持 (by [Eliezer Graber][eygraber])
- [SQLite] 支持 SQLite 中的 `NULLS FIRST`/`LAST` (by [Eliezer Graber][eygraber])
- [HSQL] 为 HSQL 添加生成子句支持 (by [Marius Volkhart][MariusV])
- [HSQL] 为 HSQL 添加命名参数支持 (by [Marius Volkhart][MariusV])
- [HSQL] 自定义 HSQL 插入查询 (by [Marius Volkhart][MariusV])

### 变更
- [所有] 包名已从 `com.squareup.sqldelight` 更改为 `app.cash.sqldelight`。
- [运行时] 将方言移到自己的独立 Gradle 模块中
- [运行时] 切换到驱动实现的查询通知。
- [运行时] 将默认列适配器提取到单独的模块 (#2056, #2060)
- [编译器] 让模块生成查询实现而不是在每个模块中重复生成
- [编译器] 移除生成数据类的自定义 `toString` 生成 (by [Paul Woitaschek][PaulWoitaschek])
- [JS 驱动] 移除 `sqljs-driver` 对 `sql.js` 的依赖 (by [Derek Ellis][dellisd])
- [Paging] 移除 Android Paging 2 扩展
- [IDE 插件] SQLDelight 同步时添加编辑器横幅 (#2511)
- [IDE 插件] 支持的最低 IntelliJ 版本为 2021.1

### 修复
- [运行时] 平整监听器列表以减少分配和指针追逐 (by [Anders Ha][andersio])
- [IDE 插件] 修复错误消息以允许跳转到错误 (by [Philip Wedemann][hfhbd])
- [IDE 插件] 添加缺失的检查描述 (#2768 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复 `GotoDeclarationHandler` 中的异常 (#2531, #2688, #2804 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 高亮显示导入关键字 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复未解析的 Kotlin 类型 (#1678 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复未解析包的高亮显示 (#2543 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 如果项目索引尚未初始化，则不尝试检查不匹配的列
- [IDE 插件] 在 Gradle 同步发生之前不初始化文件索引
- [IDE 插件] 如果 Gradle 同步开始，则取消 SQLDelight 导入
- [IDE 插件] 在执行撤消操作的线程之外重新生成数据库
- [IDE 插件] 如果无法解析引用，则使用空白 Java 类型
- [IDE 插件] 在文件解析期间正确地脱离主线程，并且只在写入时返回
- [IDE 插件] 提高与旧 IntelliJ 版本的兼容性 (by [Matthew Haughton][3flex])
- [IDE 插件] 使用更快的注解 API
- [Gradle 插件] 添加运行时时明确支持 js/android 插件 (by [Zac Sweers][ZacSweers])
- [Gradle 插件] 注册迁移输出任务，而不从迁移派生 schema (#2744 by [Kevin Cianfarini][kevincianfarini])
- [Gradle 插件] 如果迁移任务崩溃，打印它运行的文件
- [Gradle 插件] 生成代码时对文件进行排序以确保幂等输出 (by [Zac Sweers][ZacSweers])
- [编译器] 使用更快的 API 迭代文件，并且不探索整个 PSI 图
- [编译器] 添加关键字 mangling 到选择函数参数 (#2759 by [Alexander Perfilyev][aperfilyev])
- [编译器] 修复迁移适配器的 `packageName` (by [Philip Wedemann][hfhbd])
- [编译器] 在属性而不是类型上发出注解 (#2798 by [Alexander Perfilyev][aperfilyev])
- [编译器] 在传递给 `Query` 子类型之前对参数进行排序 (#2379 by [Alexander Perfilyev][aperfilyev])

## [1.5.3] - 2021-11-23
### 新增
- [JDBC 驱动] 开放 `JdbcDriver` 以供第三方驱动实现 (#2672 by [Philip Wedemann][hfhbd])
- [MySQL 方言] 添加缺失的时间增量函数 (#2671 by [Sam Doward][sdoward])
- [协程扩展] 为协程扩展添加 M1 目标 (by [Philip Dukhov][PhilipDukhov])

### 变更
- [Paging3 扩展] 将 `sqldelight-android-paging3` 分发为 JAR 而不是 AAR (#2634 by [Marco Romano][julioromano])
- 属性名如果也是软关键字，现在将以 `_` 为后缀。例如，`value` 将被公开为 `value_`

### 修复
- [编译器] 不为重复数组参数提取变量 (by [Alexander Perfilyev][aperfilyev])
- [Gradle 插件] 添加 `kotlin.mpp.enableCompatibilityMetadataVariant` (#2628 by [Martin Bonnin][martinbonnin])
- [IDE 插件] 查找使用处理需要读取操作

## [1.5.2] - 2021-10-12
### 新增
- [Gradle 插件] HMPP 支持 (#2548 by [Martin Bonnin][martinbonnin])
- [IDE 插件] 添加 NULL 比较检查 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加检查抑制器 (#2519 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 混合命名和位置参数检查 (by [Alexander Perfilyev][aperfilyev])
- [SQLite 驱动] 添加 mingwX86 目标 (#2558 by [Nikita Kozhemyakin][enginegl])
- [SQLite 驱动] 添加 M1 目标
- [SQLite 驱动] 添加 linuxX64 支持 (#2456 by [Cedric Hippmann][chippmann])
- [MySQL 方言] 为 MySQL 添加 `ROW_COUNT` 函数 (#2523)
- [PostgreSQL 方言] PostgreSQL 重命名，删除列 (by [Juan Liska][pabl0rg])
- [PostgreSQL 方言] PostgreSQL 语法不识别 CITEXT
- [PostgreSQL 方言] 包含 `TIMESTAMP WITH TIME ZONE` 和 `TIMESTAMPTZ`
- [PostgreSQL 方言] 为 PostgreSQL GENERATED 列添加语法
- [运行时] 提供 `SqlDriver` 作为 `AfterVersion` 的参数 (#2534, 2614 by [Ahmed El-Helw][ahmedre])

### 变更
- [Gradle 插件] 明确要求 Gradle 7.0 (#2572 by [Martin Bonnin][martinbonnin])
- [Gradle 插件] 使 VerifyMigrationTask 支持 Gradle 的最新检查 (#2533 by [Matthew Haughton][3flex])
- [IDE 插件] 当可空类型与不可空类型连接时，不警告“连接比较两种不同类型的列” (#2550 by [Piotr Chmielowski][pchmielowski])
- [IDE 插件] 澄清列类型中“as”小写时的错误信息 (by [Alexander Perfilyev][aperfilyev])

### 修复
- [IDE 插件] 如果项目已被处置，则不重新解析新方言 (#2609)
- [IDE 插件] 如果关联的虚拟文件为 null，则模块为 null (#2607)
- [IDE 插件] 避免在未使用查询检查期间崩溃 (#2610)
- [IDE 插件] 在写入操作中运行数据库同步写入 (#2605)
- [IDE 插件] 让 IDE 调度 SQLDelight 同步
- [IDE 插件] 修复 `JavaTypeMixin` 中的 NPE (#2603 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复 `MismatchJoinColumnInspection` 中的 `IndexOutOfBoundsException` (#2602 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 为 `UnusedColumnInspection` 添加描述 (#2600 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 将 `PsiElement.generatedVirtualFiles` 包装到读取操作中 (#2599 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 移除不必要的非空转换 (#2596)
- [IDE 插件] 正确处理查找使用的空值 (#2595)
- [IDE 插件] 修复 Android 生成文件的 IDE 自动补全 (#2573 by [Martin Bonnin][martinbonnin])
- [IDE 插件] 修复 `SqlDelightGotoDeclarationHandler` 中的 NPE (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 在 insert 语句中对参数中的 Kotlin 关键字进行 mangling (#2433 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复 `SqlDelightFoldingBuilder` 中的 NPE (#2382 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 捕获 `CopyPasteProcessor` 中的 `ClassCastException` (#2369 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复更新实时模板 (by [Ilias Redissi][IliasRedissi])
- [IDE 插件] 为意图操作添加描述 (#2489 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复 `CreateTriggerMixin` 中找不到表时的异常 (by [Alexander Perfilyev][aperfilyev])
- [编译器] 拓扑排序表创建语句
- [编译器] 停止在目录上调用 `forDatabaseFiles` 回调 (#2532)
- [Gradle 插件] 将 `generateDatabaseInterface` 任务依赖传播到潜在消费者 (#2518 by [Martin Bonnin][martinbonnin])

## [1.5.1] - 2021-07-16
### 新增
- [PostgreSQL 方言] PostgreSQL JSONB 和 ON CONFLICT DO NOTHING (by [Andrew Stewart][satook])
- [PostgreSQL 方言] 添加对 PostgreSQL `ON CONFLICT (column, ...) DO UPDATE` 的支持 (by [Andrew Stewart][satook])
- [MySQL 方言] 支持 MySQL 生成列 (by [Jeff Gulbronson][JeffG])
- [原生驱动] 添加 watchosX64 支持
- [IDE 插件] 添加参数类型和注解 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加生成“select all”查询的操作 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 在自动补全中显示列类型 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 为自动补全添加图标 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加生成“select by primary key”查询的操作 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加生成“insert into”查询的操作 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加列名、语句标识符、函数名的高亮显示 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加剩余的查询生成操作 (#489 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 显示 insert 语句的参数提示 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 表别名意图操作 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 限定列名意图 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 跳转到 Kotlin 属性的声明 (by [Alexander Perfilyev][aperfilyev])

### 变更
- [原生驱动] 改进原生事务性能，避免冻结和在可能时共享数据结构 (by [Anders Ha][andersio])
- [Paging 3] 将 Paging3 版本提升到 3.0.0 稳定版
- [JS 驱动] 将 sql.js 升级到 1.5.0

### 修复
- [JDBC SQLite 驱动] 在清除 `ThreadLocal` 之前调用连接上的 `close()` (#2444 by [Hannes Struß][hannesstruss])
- [RX 扩展] 修复订阅/释放竞争泄漏 (#2403 by [Pierre Yves Ricau][pyricau])
- [协程扩展] 确保在通知之前注册查询监听器
- [编译器] 排序 `notifyQueries` 以获得一致的 Kotlin 输出文件 (by [Jiayu Chen][thomascjy])
- [编译器] 不使用 `@JvmField` 注解 `select` 查询类属性 (by [Eliezer Graber][eygraber])
- [IDE 插件] 修复导入优化器 (#2350 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复未使用列检查 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 为导入检查和类注解器添加嵌套类支持 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复 `CopyPasteProcessor` 中的 NPE (#2363 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复 `InlayParameterHintsProvider` 中的崩溃 (#2359 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 修复将任何文本复制粘贴到 create table 语句时插入空白行的问题 (#2431 by [Alexander Perfilyev][aperfilyev])

## [1.5.0] - 2021-04-23
### 新增
- [SQLite Javascript 驱动] 启用 sqljs-driver 发布 (#1667 by [Derek Ellis][dellisd])
- [Paging3 扩展] Android Paging 3 库扩展 (#1786 by [Kevin Cianfarini][kevincianfarini])

## [1.5.0] - 2021-04-23
### 新增
- [SQLite Javascript 驱动] 启用 sqljs-driver 发布 (#1667 by [Derek Ellis][dellisd])
- [Paging3 扩展] Android Paging 3 库扩展 (#1786 by [Kevin Cianfarini][kevincianfarini])
- [MySQL 方言] 添加对 MySQL 的 `ON DUPLICATE KEY UPDATE` 冲突解决的支持 (by [Ryan Harter][rharter])
- [SQLite 方言] 添加对 SQLite `offsets()` 的编译器支持 (by [Quinton Roberts][qjroberts])
- [IDE 插件] 为未知类型添加导入快速修复 (#683 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加未使用导入检查 (#1161 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加未使用查询检查 (by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 添加未使用列检查 (#569 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 自动在复制/粘贴时导入 (#684 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 当 Gradle/IntelliJ 插件版本不兼容时，弹出气泡通知
- [IDE 插件] `INSERT INTO ... VALUES(?)` 参数提示 (#506 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 内联参数提示 (by [Alexander Perfilyev][aperfilyev])
- [运行时] 在运行时中包含用于运行带回调的迁移的 API (#1844)

### 变更
- [编译器] 智能转换“IS NOT NULL”查询 (#867)
- [编译器] 防范在运行时失败的关键字 (#1471, #1629)
- [Gradle 插件] 将 Gradle 插件大小从 60MB 减小到 13MB。
- [Gradle 插件] 正确支持 Android 变体，并移除对 KMM 目标特定 SQL 的支持 (#1039)
- [Gradle 插件] 根据 `minSdkVersion` 选择最低 SQLite 版本 (#1684)
- [原生驱动] 原生驱动连接池和性能更新

### 修复
- [编译器] Lambda 之前的 NBSP (by [Benoît Quenaudon][oldergod])
- [编译器] 修复生成的 `bind*` 和 `cursor.get*` 语句中不兼容的类型
- [编译器] SQL 子句应保留适配类型 (#2067)
- [编译器] 仅包含 `NULL` 关键字的列应为可空
- [编译器] 不生成带类型注解的映射器 lambda (#1957)
- [编译器] 如果自定义查询冲突，则使用文件名作为额外的包后缀 (#1057, #1278)
- [编译器] 确保外键级联导致查询监听器被通知 (#1325, #1485)
- [编译器] 如果联合两种相同类型，则返回表类型 (#1342)
- [编译器] 确保 `ifnull` 和 `coalesce` 的参数可空 (#1263)
- [编译器] 正确使用查询施加的可空性来处理表达式
- [MySQL 方言] 支持 MySQL `IF` 语句
- [PostgreSQL 方言] 在 PostgreSQL 中将 `NUMERIC` 和 `DECIMAL` 作为 Double 检索 (#2118)
- [SQLite 方言] UPSERT 通知应考虑 BEFORE/AFTER UPDATE 触发器 (#2198 by [Anders Ha][andersio])
- [SQLite 驱动] 除非在内存中，否则 `SqliteDriver` 对线程使用多个连接 (#1832)
- [JDBC 驱动] JDBC 驱动假定 `autoCommit` 为 true (#2041)
- [JDBC 驱动] 确保在异常时关闭连接 (#2306)
- [IDE 插件] 修复 Windows 上由于路径分隔符错误导致 GoToDeclaration/FindUsages 损坏的问题 (#2054 by [Angus Holder][AngusH])
- [IDE 插件] 忽略 Gradle 错误而不是在 IDE 中崩溃。
- [IDE 插件] 如果 sqldelight 文件移动到非 sqldelight 模块，则不尝试代码生成
- [IDE 插件] 忽略 IDE 中的代码生成错误
- [IDE 插件] 确保不尝试负数子字符串 (#2068)
- [IDE 插件] 在运行 Gradle 操作之前，还要确保项目未被处置 (#2155)
- [IDE 插件] 可空类型上的算术运算也应是可空 (#1853)
- [IDE 插件] 使“展开 * 意图”与附加投影一起工作 (#2173 by [Alexander Perfilyev][aperfilyev])
- [IDE 插件] 如果 Kotlin 解析在 GoTo 期间失败，则不尝试跳转到 sqldelight 文件
- [IDE 插件] 如果 IntelliJ 在 sqldelight 索引期间遇到异常，则不崩溃
- [IDE 插件] 处理在 IDE 中代码生成之前检测错误时发生的异常
- [IDE 插件] 使 IDE 插件与动态插件兼容 (#1536)
- [Gradle 插件] 使用 WorkerApi 生成数据库的竞争条件 (#2062 by [Stéphane Nicolas][stephanenicolas])
- [Gradle 插件] `classLoaderIsolation` 阻止自定义 JDBC 使用 (#2048 by [Ben Asher][BenA])
- [Gradle 插件] 改进缺失 `packageName` 错误消息 (by [Niklas Baudy][vanniktech])
- [Gradle 插件] SQLDelight 将 IntelliJ 依赖项泄露到 `buildscript` 类路径中 (#1998)
- [Gradle 插件] 添加方法文档到 `*.sq` 文件时出现“JavadocIntegrationKt not found”编译错误 (#1982)
- [Gradle 插件] SqlDelight Gradle 插件不支持配置缓存（CoCa）(#1947 by [Stéphane Nicolas][stephanenicolas])
- [SQLite JDBC 驱动] `SQLException: database in auto-commit mode` (#1832)
- [协程扩展] 修复协程扩展的 IR 后端 (#1918 by [Derek Ellis][dellisd])

另外，特别感谢 [Matthew Haughton][3flex] 在此版本中为改进 SQLDelight 基础设施所做的许多工作。

## [1.4.4] - 2020-10-08
### 新增
- [PostgreSQL 方言] 支持 `WITH` 子句中的数据修改语句
- [PostgreSQL 方言] 支持 `substring` 函数
- [Gradle 插件] 添加 `verifyMigrations` 标志，用于在 SQLDelight 编译期间验证迁移 (#1872)

### 变更
- [编译器] 在非 SQLite 方言中将 SQLite 特定函数标记为未知
- [Gradle 插件] 当 sqldelight 插件已应用但未配置数据库时发出警告 (#1421)

### 修复
- [编译器] 报告在 ORDER BY 子句中绑定列名时的错误 (#1187 by [Eliezer Graber][eygraber])
- [编译器] 生成数据库接口时出现注册表警告 (#1792)
- [编译器] `CASE` 语句类型推断不正确 (#1811)
- [编译器] 为没有版本的迁移文件提供更好的错误信息 (#2006)
- [编译器] 某些数据库类型 `ColumnAdapter` 的所需数据库类型不正确 (#2012)
- [编译器] CAST 的可空性 (#1261)
- [编译器] 查询包装器中大量名称冲突警告 (#1946 by [Eliezer Graber][eygraber])
- [编译器] 生成的代码使用完整的限定名 (#1939)
- [IDE 插件] 从 Gradle 同步触发 sqldelight 代码生成
- [IDE 插件] 更改 `.sq` 文件时插件不重新生成数据库接口 (#1945)
- [IDE 插件] 移动文件到新包时的问题 (#444)
- [IDE 插件] 如果没有地方移动光标，则不执行任何操作，而不是崩溃 (#1994)
- [IDE 插件] 对于 Gradle 项目之外的文件使用空包名 (#1973)
- [IDE 插件] 对于无效类型优雅地失败 (#1943)
- [IDE 插件] 遇到未知表达式时抛出更好的错误消息 (#1958)
- [Gradle 插件] SQLDelight 将 IntelliJ 依赖项泄露到 `buildscript` 类路径中 (#1998)
- [Gradle 插件] 在 `*.sq` 文件中添加方法文档时出现“JavadocIntegrationKt not found”编译错误 (#1982)
- [Gradle 插件] SqlDelight Gradle 插件不支持配置缓存（CoCa）(#1947 by [Stéphane Nicolas][stephanenicolas])
- [SQLite JDBC 驱动] `SQLException: database in auto-commit mode` (#1832)
- [协程扩展] 修复协程扩展的 IR 后端 (#1918 by [Derek Ellis][dellisd])

## [1.4.3] - 2020-09-04
### 新增
- [MySQL 方言] 添加对 MySQL `last_insert_id` 函数的支持 (by [Kelvin Law][lawkai])
- [PostgreSQL 方言] 支持 `SERIAL` 数据类型 (by [Veyndan Stuart][VeyndanS] & [Felipe Lima][felipecsl])
- [PostgreSQL 方言] 支持 PostgreSQL `RETURNING` (by [Veyndan Stuart][VeyndanS])

### 修复
- [MySQL 方言] 将 MySQL `AUTO_INCREMENT` 视为具有默认值 (#1823)
- [编译器] 修复 `Upsert` 语句编译器错误 (#1809 by [Eliezer Graber][eygraber])
- [编译器] 修复生成无效 Kotlin 代码的问题 (#1925 by [Eliezer Graber][eygraber])
- [编译器] 为未知函数提供更好的错误信息 (#1843)
- [编译器] 将 `instr` 的第二个参数类型公开为字符串
- [IDE 插件] 修复 IDE 插件的守护进程膨胀和 UI 线程停滞 (#1916)
- [IDE 插件] 处理空模块场景 (#1902)
- [IDE 插件] 在未配置的 `sq` 文件中，包名返回空字符串 (#1920)
- [IDE 插件] 修复分组语句并添加集成测试 (#1820)
- [IDE 插件] 使用内置的 `ModuleUtil` 查找元素的模块 (#1854)
- [IDE 插件] 只将有效元素添加到查找中 (#1909)
- [IDE 插件] 父级可以为 null (#1857)

## [1.4.2] - 2020-08-27
### 新增
- [运行时] 支持新的 JS IR 后端
- [Gradle 插件] 添加 `generateSqlDelightInterface` Gradle 任务 (by [Niklas Baudy][vanniktech])
- [Gradle 插件] 添加 `verifySqlDelightMigration` Gradle 任务 (by [Niklas Baudy][vanniktech])

### 修复
- [IDE 插件] 使用 Gradle 工具 API 促进 IDE 和 Gradle 之间的数据共享
- [IDE 插件] schema 派生默认设为 false
- [IDE 插件] 正确检索 `commonMain` 源集
- [MySQL 方言] 为 `mySqlFunctionType()` 添加 `minute` (by [MaaxGr][maaxgr])

## [1.4.1] - 2020-08-21
### 新增
- [运行时] 支持 Kotlin 1.4.0 (#1859)

### 变更
- [Gradle 插件] 使 AGP 依赖为 `compileOnly` (#1362)

### 修复
- [编译器] 为列定义规则和表接口生成器添加可选的 javadoc (#1224 by [Daniel Eke][endanke])
- [SQLite 方言] 添加对 sqlite fts5 辅助函数 `highlight`、`snippet` 和 `bm25` 的支持 (by [Daniel Rampelt][drampelt])
- [MySQL 方言] 支持 MySQL bit 数据类型
- [MySQL 方言] 支持 MySQL 二进制字面量
- [PostgreSQL 方言] 从 `sql-psi` 暴露 `SERIAL` (by [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 添加 `BOOLEAN` 数据类型 (by [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 添加 `NULL` 列约束 (by [Veyndan Stuart][VeyndanS])
- [HSQL 方言] 为 HSQL 添加 `AUTO_INCREMENT` 支持 (by [Ryan Harter][rharter])

## [1.4.0] - 2020-06-22
### 新增
- [MySQL 方言] MySQL 支持 (by [Jeff Gulbronson][JeffG] & [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 实验性 PostgreSQL 支持 (by [Veyndan Stuart][VeyndanS])
- [HSQL 方言] 实验性 H2 支持 (by [Marius Volkhart][MariusV])
- [SQLite 方言] SQLite FTS5 支持 (by [Ben Asher][BenA] & [James Palawaga][JamesP])
- [SQLite 方言] 支持 `ALTER TABLE RENAME COLUMN` (#1505 by [Angus Holder][AngusH])
- [IDE] IDE 对迁移 (.sqm) 文件的支持
- [IDE] 添加模拟内置 SQL Live Templates 的 SQLDelight Live Templates (#1154 by [Veyndan Stuart][VeyndanS])
- [IDE] 添加新建 SqlDelight 文件操作 (#42 by [Roman Zavarnitsyn][RomanZ])
- [运行时] `transactionWithReturn` API 用于返回结果的事务
- [编译器] 在 `.sq` 文件中分组多个 SQL 语句的语法
- [编译器] 支持从迁移文件生成 schema
- [Gradle 插件] 添加一个任务用于将迁移文件输出为有效 SQL

### 变更
- [文档] 大修文档网站 (by [Saket Narayan][SaketN])
- [Gradle 插件] 改进不受支持的方言错误消息 (by [Veyndan Stuart][VeyndanS])
- [IDE] 根据方言动态更改文件图标 (by [Veyndan Stuart][VeyndanS])
- [JDBC 驱动] 暴露一个基于 `javax.sql.DataSource` 的 `JdbcDriver` 构造函数 (#1614)

### 修复
- [编译器] 支持表上的 Javadoc 并修复一个文件中多个 javadoc 的问题 (#1224)
- [编译器] 允许为合成列插入值 (#1351)
- [编译器] 修复目录名称清理中的不一致性 (by [Zac Sweers][ZacSweers])
- [编译器] 合成列在连接时应保留可空性 (#1656)
- [编译器] 将 `DELETE` 语句锁定在 `DELETE` 关键字上 (#1643)
- [编译器] 修复引号 (#1525 by [Angus Holder][AngusH])
- [编译器] 修复 `BETWEEN` 运算符以正确递归到表达式中 (#1279)
- [编译器] 为创建索引时缺失表/列提供更好的错误信息 (#1372)
- [编译器] 允许在 JOIN 约束中使用外部查询的投影 (#1346)
- [原生驱动] 使执行使用 `transactionPool` (by [Ben Asher][BenA])
- [JDBC 驱动] 使用 JDBC 事务 API 而不是 SQLite (#1693)
- [IDE] 修复 `virtualFile` 引用始终是原始文件的问题 (#1782)
- [IDE] 在向 Bugsnag 报告错误时使用正确的 `throwable` (#1262)
- [Paging 扩展] 修复 DataSource 泄漏 (#1628)
- [Gradle 插件] 如果输出数据库文件在生成 schema 时已存在，则删除它 (#1645)
- [Gradle 插件] 如果存在间隙，则迁移验证失败
- [Gradle 插件] 明确使用我们设置的文件索引 (#1644)

## [1.3.0] - 2020-04-03

* 新增: [Gradle] `dialect` 属性，用于指定要编译的 SQL 方言。
* 新增: [编译器] #1009 实验性支持 MySQL 方言。
* 新增: [编译器] #1436 支持 SQLite 3.24 方言和 upsert。
* 新增: [JDBC 驱动] 从 SQLite JVM 驱动中拆分出 JDBC 驱动。
* 修复: [编译器] #1199 支持任意长度的 lambda。
* 修复: [编译器] #1610 修复 `avg()` 的返回类型为可空。
* 修复: [IntelliJ] #1594 修复 Windows 上导致 Goto 和 Find Usages 损坏的路径分隔符处理问题。

## [1.2.2] - 2020-01-22

* 新增: [运行时] 支持 Windows (mingW)、tvOS、watchOS 和 macOS 架构。
* 修复: [编译器] `sum()` 的返回类型应为可空。
* 修复: [Paging] 将 `Transacter` 传入 `QueryDataSourceFactory` 以避免竞争条件。
* 修复: [IntelliJ 插件] 查找文件的包名时不搜索依赖项。
* 修复: [Gradle] #862 将 Gradle 中的 validator 日志更改为调试级别。
* 增强: [Gradle] 将 `GenerateSchemaTask` 转换为使用 Gradle worker。
* 注意: `sqldelight-runtime` 构件已重命名为 `runtime`。

## [1.2.1] - 2019-12-11

* 修复: [Gradle] Kotlin Native 1.3.60 支持。
* 修复: [Gradle] #1287 同步时的警告。
* 修复: [编译器] #1469 查询的 `SynetheticAccessor` 创建。
* 修复: [JVM 驱动] 修复内存泄漏。
* 注意: 协程扩展构件要求将 `kotlinx bintray maven` 仓库添加到您的 `buildscript`。

## [1.2.0] - 2019-08-30

* 新增: [运行时] 稳定的 Flow API。
* 修复: [Gradle] Kotlin Native 1.3.50 支持。
* 修复: [Gradle] #1380 清理构建有时会失败。
* 修复: [Gradle] #1348 运行验证任务时打印“Could not retrieve functions”。
* 修复: [编译器] #1405 查询包含 FTS 表连接时无法构建项目。
* 修复: [Gradle] #1266 多个数据库模块时偶尔出现 Gradle 构建失败。

## [1.1.4] - 2019-07-11

* 新增: [运行时] 实验性 Kotlin Flow API。
* 修复: [Gradle] Kotlin/Native 1.3.40 兼容性。
* 修复: [Gradle] #1243 修复 SQLDelight 与 Gradle 按需配置的使用。
* 修复: [Gradle] #1385 修复 SQLDelight 与增量注解处理的使用。
* 修复: [Gradle] 允许 Gradle 任务缓存。
* 修复: [Gradle] #1274 启用在 Kotlin DSL 中使用 sqldelight 扩展。
* 修复: [编译器] 为每个查询确定性地生成唯一 ID。
* 修复: [编译器] 仅在事务完成时通知监听查询。
* 修复: [JVM 驱动] #1370 强制 `JdbcSqliteDriver` 用户提供 DB URL。

## [1.1.3] - 2019-04-14

* Gradle 元数据 1.0 发布。

## [1.1.2] - 2019-04-14

* 新增: [运行时] #1267 日志驱动装饰器。
* 修复: [编译器] #1254 拆分超过 2^16 个字符的字符串字面量。
* 修复: [Gradle] #1260 在多平台项目中，生成的源被识别为 iOS 源。
* 修复: [IDE] #1290 `kotlin.KotlinNullPointerException` 在 `CopyAsSqliteAction.kt:43`。
* 修复: [Gradle] #1268 在最新版本中运行 `linkDebugFrameworkIos*` 任务失败。

## [1.1.1] - 2019-03-01

* 修复: [Gradle] 修复 Android 项目的模块依赖编译。
* 修复: [Gradle] #1246 在 `afterEvaluate` 中设置 API 依赖。
* 修复: [编译器] 正确打印数组类型。

## [1.1.0] - 2019-02-27

* 新增: [Gradle] #502 允许指定 schema 模块依赖。
* 增强: [编译器] #1111 表错误在其他错误之前排序。
* 修复: [编译器] #1225 返回 REAL 字面量的正确类型。
* 修复: [编译器] #1218 `docid` 通过触发器传播。

## [1.0.3] - 2019-01-30

* 增强: [运行时] #1195 原生驱动/运行时 Arm32。
* 增强: [运行时] #1190 从 `Query` 类型中暴露映射器。

## [1.0.2] - 2019-01-26

* 修复: [Gradle 插件] 更新到 Kotlin 1.3.20。
* 修复: [运行时] 事务不再吞噬异常。

## [1.0.1] - 2019-01-21

* 增强: [原生驱动] 允许将目录名传递给 `DatabaseConfiguration`。
* 增强: [编译器] #1173 没有包的文件编译失败。
* 修复: [IDE] 正确向 Square 报告 IDE 错误。
* 修复: [IDE] #1162 同一包中的类型显示为错误但工作正常。
* 修复: [IDE] #1166 重命名表失败，出现 NPE。
* 修复: [编译器] #1167 尝试解析带有 UNION 和 SELECT 的复杂 SQL 语句时抛出异常。

## [1.0.0] - 2019-01-08

* 新增: 生成代码的全面大修，现在使用 Kotlin。
* 新增: RxJava2 扩展构件。
* 新增: Android Paging 扩展构件。
* 新增: Kotlin Multiplatform 支持。
* 新增: Android、iOS 和 JVM SQLite 驱动构件。
* 新增: 事务 API。

## [0.7.0] - 2018-02-12

* 新增: 生成的代码已更新为仅使用 Support SQLite 库。所有查询现在生成语句对象而不是原始字符串。
* 新增: IDE 中的语句折叠。
* 新增: 布尔类型现在自动处理。
* 修复: 移除代码生成中已弃用的 `marshals`。
* 修复: 正确将 `avg` SQL 函数类型映射为 REAL。
* 修复: 正确检测 `julianday` SQL 函数。

## [0.6.1] - 2017-03-22

* 新增: 没有参数的 Delete、Update 和 Insert 语句生成编译语句。
* 修复: 在子查询中使用的视图中的 `USING` 子句不再报错。
* 修复: 移除生成的映射器上的重复类型。
* 修复: 子查询可以在检查参数的表达式中使用。

## [0.6.0] - 2017-03-06

* 新增: SELECT 查询现在作为 `SqlDelightStatement` 工厂而不是字符串常量暴露。
* 新增: 查询的 JavaDoc 现在复制到语句和映射器工厂。
* 新增: 为视图名称发出字符串常量。
* 修复: 需要工厂的视图上的查询现在正确要求这些工厂作为参数。
* 修复: 验证插入参数的数量与指定列的数量匹配。
* 修复: 正确编码在 `WHERE` 子句中使用的 blob 字面量。
* 此版本需要 Gradle 3.3 或更高版本。

## [0.5.1] - 2016-10-24

* 新增: 编译语句扩展一个抽象类型。
* 修复: 参数中的原始类型如果可空将被装箱。
* 修复: 绑定参数所需的所有工厂都存在于工厂方法中。
* 修复: 转义的列名从 Cursor 获取时不再抛出 RuntimeExceptions。

## [0.5.0] - 2016-10-19

* 新增: SQLite 参数可以通过工厂进行类型安全传递。
* 新增: IntelliJ 插件对 `.sq` 文件执行格式化。
* 新增: 支持 SQLite 时间戳字面量。
* 修复: 参数化类型可以在 IntelliJ 中点击进入。
* 修复: 转义的列名如果从 Cursor 获取，不再抛出 RuntimeExceptions。
* 修复: Gradle 插件在尝试打印异常时不会崩溃。

## [0.4.4] - 2016-07-20

* 新增: 对 `short` 作为列 Java 类型的原生支持。
* 新增: 生成的映射器和工厂方法的 Javadoc。
* 修复: `group_concat` 和 `nullif` 函数具有正确的可空性。
* 修复: 与 Android Studio 2.2-alpha 的兼容性。
* 修复: `WITH RECURSIVE` 不再使插件崩溃。

## [0.4.3] - 2016-07-07

* 新增: 编译错误链接到源文件。
* 新增: 右键单击将 SQLDelight 代码复制为有效的 SQLite。
* 新增: 命名语句上的 Javadoc 将出现在生成的字符串中。
* 修复: 生成的视图模型包含可空性注解。
* 修复: 联合生成的代码具有正确的类型和可空性，以支持所有可能的列。
* 修复: `sum` 和 `round` SQLite 函数在生成的代码中具有正确的类型。
* 修复: `CAST`、内部选择的 bug 修复。
* 修复: `CREATE TABLE` 语句中的自动补全。
* 修复: SQLite 关键字可以在包中使用。

## [0.4.2] - 2016-06-16

* 新增: 映射器可以从工厂创建。
* 修复: IntelliJ 插件生成具有正确泛型顺序的工厂方法。
* 修复: 函数名可以使用任何大小写。

## [0.4.1] - 2016-06-14

* 修复: IntelliJ 插件生成具有正确泛型顺序的类。
* 修复: 列定义可以使用任何大小写。

## [0.4.0] - 2016-06-14

* 新增: 映射器按查询生成，而不是按表生成。
* 新增: Java 类型可以在 `.sq` 文件中导入。
* 新增: SQLite 函数被验证。
* 修复: 移除重复错误。
* 修复: 大写列名和 Java 关键字列名不再报错。

## [0.3.2] - 2016-05-14

* 新增: 视图和别名现在支持自动补全和查找使用。
* 修复: 编译时验证现在允许函数在 `SELECT` 语句中使用。
* 修复: 支持只声明默认值的 `INSERT` 语句。
* 修复: 当导入未使用 SQLDelight 的项目时，插件不再崩溃。

## [0.3.1] - 2016-04-27

* 修复: 接口可见性改回 `public`，以避免方法引用引起的非法访问运行时异常。
* 修复: 子表达式得到正确评估。

## [0.3.0] - 2016-04-26

* 新增: 列定义使用 SQLite 类型，并可以有额外的“AS”约束来指定 Java 类型。
* 新增: 可以从 IDE 发送 Bug 报告。
* 修复: 自动补全功能正常。
* 修复: SQLDelight 模型文件在 `.sq` 文件编辑时更新。
* 移除: 不再支持附加数据库。

## [0.2.2] - 2016-03-07

* 新增: 编译时验证 `insert`、`update`、`delete`、`index` 和 `trigger` 语句使用的列。
* 修复: 移动/创建文件时不会导致 IDE 插件崩溃。

## [0.2.1] - 2016-03-07

* 新增: `Ctrl + /` (OSX 上为 `Cmd + /`) 切换选定行（或多行）的注释。
* 新增: 编译时验证 SQL 查询使用的列。
* 修复: 支持 IDE 和 Gradle 插件中的 Windows 路径。

## [0.2.0] - 2016-02-29

* 新增: 为 `Marshal` 类添加了复制构造函数。
* 新增: 更新到 Kotlin 1.0 最终版。
* 修复: 以非失败方式报告 `sqldelight` 文件夹结构问题。
* 修复: 禁止名为 `table_name` 的列。它们生成的常量与表名常量冲突。
* 修复: 确保 IDE 插件立即生成模型类，无论 `.sq` 文件是否打开。
* 修复: 支持 IDE 和 Gradle 插件中的 Windows 路径。

## [0.1.2] - 2016-02-13

* 修复: 移除阻止 Gradle 插件在大多数项目中使用的代码。
* 修复: 添加缺失的 Antlr 运行时编译器依赖。

## [0.1.1] - 2016-02-12

* 修复: 确保 Gradle 插件指向与其自身相同的运行时版本。

## [0.1.0] - 2016-02-12

首次发布。

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