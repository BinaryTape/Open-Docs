# 变更日志

## 未发布

### 新增
- [SQLite 方言] 为 MATERIALIZED 查询规划器提示添加对使用 Common Table Expressions 的 Sqlite 3.35 支持 (#5961 by [Griffio][griffio])
- [PostgreSQL 方言] 为 MATERIALIZED 查询规划器提示添加对使用 Common Table Expressions 的支持 (#5961 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 Postgres JSON 聚合 FILTER 的支持 (#5957 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 Postgres Enums 的支持 (#5935 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 Postgres Triggers 的有限支持 (#5932 by [Griffio][griffio])
- [PostgreSQL 方言] 添加谓词以检测 SQL 表达式是否可解析为 JSON (#5843 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 PostgreSql Comment On 语句的有限支持 (#5808 by [Griffio][griffio])
- [MySQL 方言] 添加对索引可见性选项的支持 (#5785 by [Oren Kislev][orenkislev-faire])
- [PostgreSql 方言] 添加对 TSQUERY 数据类型的支持 (#5779 by [Griffio][griffio])
- [Gradle 插件] 添加对版本目录的支持，用于添加模块 (#5755 by [Michael Rittmeister][DRSchlaubi])

### 变更
- 开发中的快照现在已发布到 Central Portal Snapshots 版本库：https://central.sonatype.com/repository/maven-snapshots/。
- [编译器] 使用构造函数引用简化了默认生成的查询 (#5814 by [Jon Poulton][jonapoul])

### 修复
- [编译器] 修复了使用包含 Common Table Expression 的 View 时发生的栈溢出问题 (#5928 by [Griffio][griffio])
- [Gradle 插件] 修复了打开 SqlDelight 工具窗口以添加“New Connection”时发生的崩溃 (#5906 by [Griffio][griffio])
- [IntelliJ 插件] 避免了复制到 SQLite 边槽操作中与线程相关的崩溃 (#5901 by [Griffio][griffio])
- [IntelliJ 插件] 修复了 PostgreSQL 方言在使用 schema 语句 CREATE INDEX 和 CREATE VIEW 时的问题 (#5772 by [Griffio][griffio])
- [编译器] 修复了引用列时 FTS 的栈溢出问题 (#5896 by [Griffio][griffio])
- [编译器] 修复了 With Recursive 栈溢出问题 (#5892 by [Griffio][griffio])
- [编译器] 修复了 Insert|Update|Delete Returning 语句的通知功能 (#5851 by [Griffio][griffio])
- [编译器] 修复了返回 Long 的事务代码块的异步结果类型问题 (#5836 by [Griffio][griffio])
- [编译器] 将 SQL 形参绑定从 O(n²) 复杂度优化到 O(n) (#5898 by [Chen Frenkel][chenf7])
- [SQLite 方言] 修复 Sqlite 3.18 缺失的函数 (#5759 by [Griffio][griffio])

## [2.1.0] - 2025-05-16

### 新增
- [WASM 驱动] 添加对 wasmJs 到 web worker 驱动的支持 (#5534 by [Ilya Gulya][IlyaGulya])
- [PostgreSQL 方言] 支持 PostgreSql 将数组平铺到行 (#5673 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql TSRANGE/TSTZRANGE 支持 (#5297 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql Right Full Join (#5086 by [Griffio][griffio])
- [PostgreSQL 方言] Postrgesql 从时间类型中提取 (#5273 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql 数组包含操作符 (#4933 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql drop constraint (#5288 by [Griffio][griffio])
- [PostgreSQL 方言] Postgresql 类型转换 (#5089 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql 子查询的 lateral join 操作符 (#5122 by [Griffio][griffio])
- [PostgreSQL 方言] Postgresql ILIKE 操作符 (#5330 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql XML type (#5331 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql AT TIME ZONE (#5243 by [Griffio][griffio])
- [PostgreSQL 方言] 支持 postgresql order by nulls (#5199 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSQL 当前日期/时间函数支持 (#5226 by [Drew Dobson][drewd])
- [PostgreSQL 方言] PostgreSql Regex 操作符 (#5137 by [Griffio][griffio])
- [PostgreSQL 方言] add brin gist (#5059 by [Griffio][griffio])
- [MySQL 方言] 支持 RENAME INDEX 用于 MySql 方言 (#5212 by [Oren Kislev][orenkislev-faire])
- [JSON 扩展] 添加别名到 json 表函数 (#5372 by [Griffio][griffio])

### 变更
- [编译器] 生成的查询文件为简单修改器返回行计数 (#4578 by [Marius Volkhart][MariusV])
- [Native Driver] 更新 NativeSqlDatabase.kt 以更改 DELETE、INSERT 和 UPDATE 语句的只读标志 (#5680 by [Griffio][griffio])
- [PostgreSQL 方言] 将 PgInterval 更改为 String (#5403 by [Griffio][griffio])
- [PostgreSQL 方言] 支持 SqlDelight 模块实现 PostgreSql 扩展 (#5677 by [Griffio][griffio])

### 修复
- [编译器] 修复：执行带结果的分组语句时通知查询 (#5006 by [Vitor Hugo Schwaab][vitorhugods])
- [编译器] 修复 SqlDelightModule 类型解析器 (#5625 by [Griffio][griffio])
- [编译器] 修复 5501 插入对象转义列 (#5503 by [Griffio][griffio])
- [编译器] 编译器：改进错误消息，使路径链接可点击并显示正确的行和字符位置 (#5604 by [Niklas Baudy][vanniktech])
- [编译器] 修复问题 5298：允许关键字用作表名
- [编译器] 修复命名执行并添加测试
- [编译器] 在排序初始化语句时考虑外键表约束 (#5325 by [Leon Linhart][TheMrMilchmann])
- [编译器] 在涉及制表符时正确对齐错误下划线 (#5224 by [Drew Dobson][drewd])
- [JDBC Driver] 修复 connectionManager 在事务结束时的内存泄漏
- [JDBC Driver] 如文档所述，在事务中运行 SQLite 迁移 (#5218 by [Lukáš Moravec][morki])
- [JDBC Driver] 修复事务提交/回滚后连接泄漏 (#5205 by [Lukáš Moravec][morki])
- [Gradle Plugin] 在 `GenerateSchemaTask` 之前执行 `DriverInitializer` (#5562 by [Emeka Nwagu][nwagu])
- [Runtime] 修复 LogSqliteDriver 在实际驱动为异步时的崩溃 (#5723 by [Eric Denman][edenman])
- [Runtime] 修复 StringBuilder 容量 (#5192 by [Jan Bína][janbina])
- [PostgreSQL 方言] PostgreSql create or replace view (#5407 by [Griffio][griffio])
- [PostgreSQL 方言] Postgresql to_json (#5606 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql 数值解析器 (#5399 by [Griffio][griffio])
- [PostgreSQL 方言] sqlite window function (#2799 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql SELECT DISTINCT ON (#5345 by [Griffio][griffio])
- [PostgreSQL 方言] alter table add column if not exists (#5309 by [Griffio][griffio])
- [PostgreSQL 方言] Postgresql async bind parameter (#5313 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql boolean literals (#5262 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql window functions (#5155 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql isNull isNotNull types (#5173 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSql select distinct (#5172 by [Griffio][griffio])
- [Paging 扩展] paging refresh initial load 修复 (#5615 by [Eva][evant])
- [Paging 扩展] 添加 MacOS 原生目标 (#5324 by [Vitor Hugo Schwaab][vitorhugods])
- [IntelliJ Plugin] K2 Support

## [2.0.2] - 2024-04-05

### 新增
- [PostgreSQL 方言] 添加 PostgreSQL STRING_AGG 函数 (#4950 by [André Danielsson][anddani])
- [PostgreSQL 方言] 为 pg 方言添加 SET 语句 (#4927 by [Bastien de Luca][de-luca])
- [PostgreSQL 方言] 添加 PostgreSql alter column sequence 形参 (#4916 by [Griffio][griffio])
- [PostgreSQL 方言] 为 INSERT 语句添加 postgresql alter column default 支持 (#4912 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 PostgreSql alter sequence and drop sequence (#4920 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 Postgres Regex 函数定义 (#5025 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 为 GIN 添加语法 (#5027 by [Griffio][griffio])

### 变更
- [IDE 插件] 最低版本 2023.1 / Android Studio Iguana
- [编译器] 允许在 encapsulatingType 中覆盖类型可空性 (#4882 by [Eliezer Graber][eygraber])
- [编译器] 内联 SELECT * 的列名
- [Gradle 插件] 切换到 processIsolation (#5068 by [Emeka Nwagu][nwagu])
- [Android Runtime] 将 Android minSDK 提高到 21 (#5094 by [Philip Wedemann][hfhbd])
- [Drivers] 为方言作者暴露更多 JDBC/R2DBC 语句方法 (#5098 by [Philip Wedemann][hfhbd])

### 修复
- [PostgreSQL 方言] 修复 postgresql alter table alter column (#4868 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4448 表模型缺失导入 (#4885 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4932 postgresql default constraint 函数 (#4934 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4879 postgresql class-cast 错误在迁移期间的 alter table rename column (#4880 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4474 PostgreSql create extension (#4541 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5018 PostgreSql add Primary Key 非空类型 (#5020 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4703 聚合表达式 (#5071 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5028 PostgreSql json (#5030 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5040 PostgreSql json 操作符 (#5041 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5040 的 json 操作符绑定 (#5100 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5082 tsvector (#5104 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 5032 PostgreSql UPDATE FROM 语句的列相邻问题 (#5035 by [Griffio][griffio])
- [SQLite 方言] 修复 4897 sqlite alter table rename column (#4899 by [Griffio][griffio])
- [IDE Plugin] 修复错误处理器崩溃 (#4988 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] BugSnag 未能在 IDEA 2023.3 中初始化 (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 在 IntelliJ 中通过插件打开 .sq 文件时出现 PluginException (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 不将 kotlin lib 打包到 intellij 插件中，因为它已经是插件依赖项 (#5126)
- [IDE Plugin] 使用 extensions 数组而不是 stream (#5127)

## [2.0.1] - 2023-12-01

### 新增
- [编译器] 添加 SELECT 中多列表达式的支持 (#4453 by [Adriel Martinez][Adriel-M])
- [PostgreSQL 方言] 添加对 PostgreSQL CREATE INDEX CONCURRENTLY 的支持 (#4531 by [Griffio][griffio])
- [PostgreSQL 方言] 允许 PostgreSQL CTEs 辅助语句相互引用 (#4493 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 PostgreSQL 二元表达式和 sum 类型支持 (#4539 by [Adriel Martinez][Adriel-M])
- [PostgreSQL 方言] 添加对 PostgreSQL SELECT DISTINCT ON 语法的支持 (#4584 by [Griffio][griffio])
- [PostgreSQL 方言] 添加对 SELECT 语句中 PostgreSQL JSON 函数的支持 (#4590 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 添加 generate_series PostgreSQL 函数 (#4717 by [Griffio][griffio])
- [PostgreSQL 方言] 添加额外的 Postgres String 函数定义 (#4752 by [Marius Volkhart][MariusV])
- [PostgreSQL 方言] 将 DATE PostgreSQL 类型添加到 min 和 max 聚合函数 (#4816 by [André Danielsson][anddani])
- [PostgreSQL 方言] 将 PostgreSql temporal 类型添加到 SqlBinaryExpr (#4657 by [Griifio][griffio])
- [PostgreSQL 方言] 添加 TRUNCATE 到 postgres 方言 (#4817 by [Bastien de Luca][de-luca])
- [SQLite 3.35 方言] 允许多个 ON CONFLICT 子句按顺序求值 (#4551 by [Griffio][griffio])
- [JDBC Driver] 添加 Language 注解以实现更愉快的 SQL 编辑 (#4602 by [Marius Volkhart][MariusV])
- [Native Driver] native-driver: 添加对 linuxArm64 的支持 (#4792 by [Philip Wedemann][hfhbd])
- [Android Driver] 为 AndroidSqliteDriver 添加 windowSizeBytes 形参 (#4804 by [Benoit Lubek][BoD])
- [Paging3 扩展] feature: 为 OffsetQueryPagingSource 添加 initialOffset (#4802 by [Mohamad Jaara][MohamadJaara])

### 变更
- [编译器] 在适当情况下优先使用 Kotlin 类型 (#4517 by [Eliezer Graber][eygraber])
- [编译器] 执行值类型插入时始终包含列名 (#4864)
- [PostgreSQL 方言] 移除 PostgreSQL 方言的实验性状态 (#4443 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] 更新 PostgreSQL 类型的文档 (#4569 by [Marius Volkhart][MariusV])
- [R2DBC Driver] 优化 PostgreSQL 中处理整数数据类型时的性能 (#4588 by [Marius Volkhart][MariusV])

### 移除
- [SQLite Javascript Driver] 移除 sqljs-driver (#4613, #4670 by [Derek Ellis][dellisd])

### 修复
- [编译器] 修复带返回且无形参的分组语句的编译 (#4699 by [Griffio][griffio])
- [编译器] 使用 SqlBinaryExpr 绑定实参 (#4604 by [Griffio][griffio])
- [IDE Plugin] 如果已设置，则使用 IDEA Project JDK (#4689 by [Griffio][griffio])
- [IDE Plugin] 修复 IDEA 2023.2 及更高版本中的“Unknown element type: TYPE_NAME”错误 (#4727)
- [IDE Plugin] 修复了与 2023.2 的一些兼容性问题
- [Gradle Plugin] 更正 verifyMigrationTask Gradle 任务的文档 (#4713 by [Josh Friend][joshfriend])
- [Gradle Plugin] 添加 Gradle 任务输出消息以帮助用户在验证数据库之前生成数据库 (#4684 by [Jingwei][jingwei99])
- [PostgreSQL 方言] 修复 PostgreSQL 列的多次重命名问题 (#4566 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4714 postgresql alter column nullability (#4831 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4837 alter table alter column (#4846 by [Griffio][griffio])
- [PostgreSQL 方言] 修复 4501 PostgreSql sequence (#4528 by [Griffio][griffio])
- [SQLite 方言] 允许 JSON 二元操作符用于列表达式 (#4776 by [Eliezer Graber][eygraber])
- [SQLite 方言] Update From 发现多个同名列的误报 (#4777 by [Eliezer Graber][eygraber])
- [Native Driver] 支持命名内存数据库 (#4662 by [Matthew Nelson][05nelsonm])
- [Native Driver] 确保查询监听器集合的线程安全 (#4567 by [Kevin Galligan][kpgalligan])
- [JDBC Driver] 修复 ConnectionManager 中的连接泄漏 (#4589 by [Marius Volkhart][MariusV])
- [JDBC Driver] 修复 JdbcSqliteDriver url 解析当选择 ConnectionManager 类型时 (#4656 by [Matthew Nelson][05nelsonm])

## [2.0.0] - 2023-07-26

### 新增
- [MySQL 方言] MySQL：支持 IF 表达式中的 timestamp/bigint (#4329 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] MySQL：添加 now (#4431 by [Philip Wedemann][hfhbd])
- [Web Driver] 启用 NPM 包发布 (#4364)
- [IDE Plugin] 允许用户在 gradle tooling 连接失败时显示堆栈跟踪 (#4383)

### 变更
- [Sqlite Driver] 简化 JdbcSqliteDriver 使用 schema 迁移 (#3737 by [Lukáš Moravec][morki])
- [R2DBC Driver] 真实的异步 R2DBC cursor (#4387 by [Philip Wedemann][hfhbd])

### 修复
- [IDE Plugin] 在需要之前不要实例化数据库项目服务 (#4382)
- [IDE Plugin] 处理查找使用期间的进程取消 (#4340)
- [IDE Plugin] 修复 IDE 异步代码生成 (#4406)
- [IDE Plugin] 将包结构的组装移动到一次性计算并在 EDT 之外执行 (#4417)
- [IDE Plugin] 在 2023.2 上使用正确的 stub 索引键进行 kotlin 类型解析 (#4416)
- [IDE Plugin] 等待索引就绪后再执行搜索 (#4419)
- [IDE Plugin] 如果索引不可用，则不执行跳转 (#4420)
- [编译器] 修复分组语句的结果表达式 (#4378)
- [编译器] 不要将虚拟表用作接口类型 (#4427 by [Philip Wedemann][hfhbd])

## [2.0.0-rc02] - 2023-06-27

### 新增
- [MySQL 方言] 支持小写日期类型以及日期类型的 min 和 max (#4243 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支持 mysql 二元表达式和 sum 类型 (#4254 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支持没有显示宽度的无符号 int (#4306 by [Mike Gershunovsky][shellderp])
- [MySQL 方言] 支持 LOCK IN SHARED MODE
- [PostgreSQL 方言] 添加 boolean 和 Timestamp 到 min max (#4245 by [Griffio][griffio])
- [PostgreSQL 方言] Postgres：添加窗口函数支持 (#4283 by [Philip Wedemann][hfhbd])
- [Runtime] 添加 linuxArm64、androidNative 和 watchosDeviceArm 目标到运行时 (#4258 by [Philip Wedemann][hfhbd])
- [Paging 扩展] 为 paging 扩展添加 linux 和 mingw x64 目标 (#4280 by [Cedric Hippmann][chippmann])

### 变更
- [Gradle Plugin] 为 Android API 34 添加自动方言支持 (#4251)
- [Paging 扩展] 添加对 QueryPagingSource 中 SuspendingTransacter 的支持 (#4292 by [Ilya Polenov][daio])
- [Runtime] 改进 addListener API (#4244 by [Philip Wedemann][hfhbd])
- [Runtime] 使用 Long 作为迁移版本 (#4297 by [Philip Wedemann][hfhbd])

### 修复
- [Gradle Plugin] 为生成的源使用稳定的输出路径 (#4269 by [Josh Friend][joshfriend])
- [Gradle Plugin] Gradle 调整 (#4222 by [Matthew Haughton][3flex])

## [2.0.0-rc01] - 2023-05-29

### 新增
- [Paging] 为 paging 扩展添加 js browser 目标 (#3843 by [Sean Proctor][sproctor])
- [Paging] 为 androidx-paging3 扩展添加 iosSimulatorArm64 目标 (#4117)
- [PostgreSQL 方言] 添加对 gen_random_uuid() 的支持和测试 (#3855 by [David Wheeler][davidwheeler123])
- [PostgreSQL 方言] Alter table add constraint postgres (#4116 by [Griffio][griffio])
- [PostgreSQL 方言] Alter table add constraint check (#4120 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 postgreSql 字符长度函数 (#4121 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 postgreSql column default interval (#4142 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 postgreSql interval column result (#4152 by [Griffio][griffio])
- [PostgreSQL 方言] 添加 postgreSql Alter Column (#4165 by [Griffio][griffio])
- [PostgreSQL 方言] PostgreSQL：添加 date_part (#4198 by [Philip Wedemann][hfhbd])
- [MySQL 方言] 添加 sql char length 函数 (#4134 by [Griffio][griffio])
- [IDE Plugin] 添加 sqldelight 目录建议 (#3976 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 在项目树中压缩中间包 (#3992 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 join 子句自动补全 (#4086 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 创建 view intention 和 live template (#4074 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 警告 DELETE 或 UPDATE 中缺少 WHERE 子句 (#4058 by [Alexander Perfilyev][aperfilyev])
- [Gradle Plugin] 启用类型安全项目访问器 (#4005 by [Philip Wedemann][hfhbd])

### 变更
- [Gradle Plugin] 允许使用 ServiceLoader 机制为 VerifyMigrationTask 注册 DriverInitializer (#3986 by [Alex Doubov][C2H6O])
- [Gradle Plugin] 创建显式编译器 env (#4079 by [Philip Wedemann][hfhbd])
- [JS Driver] 将 web worker 驱动拆分为单独的构件
- [JS Driver] 不暴露 JsWorkerSqlCursor (#3874 by [Philip Wedemann][hfhbd])
- [JS Driver] 禁用 sqljs 驱动的发布 (#4108)
- [Runtime] 强制同步驱动需要同步 schema 初始化器 (#4013)
- [Runtime] 改进 Cursors 的异步支持 (#4102)
- [Runtime] 移除已弃用的目标 (#4149 by [Philip Wedemann][hfhbd])
- [Runtime] 移除对旧 MM 的支持 (#4148 by [Philip Wedemann][hfhbd])

### 修复
- [R2DBC Driver] R2DBC: 等待关闭驱动 (#4139 by [Philip Wedemann][hfhbd])
- [编译器] 包含迁移中的 PRAGMAs 到数据库创建(SqlDriver) (#3845 by [Marius Volkhart][MariusV])
- [编译器] 修复 RETURNING 子句的代码生成 (#3872 by [Marius Volkhart][MariusV])
- [编译器] 不为虚拟表生成类型 (#4015)
- [Gradle Plugin] 小幅 Gradle 插件质量改进 (#3930 by [Zac Sweers][zacsweers])
- [IDE Plugin] 修复未解析的 kotlin 类型 (#3924 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复展开通配符 intention 以与限定符一起使用 (#3979 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 如果 java home 缺失，则使用可用 jdk (#3925 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复包名查找使用 (#4010)
- [IDE Plugin] 不显示无效元素的自动导入 (#4008)
- [IDE Plugin] 如果缺少方言，则不解析 (#4009)
- [IDE Plugin] 忽略编译器在失效状态下的 IDE 运行 (#4016)
- [IDE Plugin] 添加对 IntelliJ 2023.1 的支持 (#4037 by [Madis Pink][madisp])
- [IDE Plugin] 在列重命名时重命名命名实参使用 (#4027 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复添加迁移弹出窗口 (#4105 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 在迁移文件中禁用 SchemaNeedsMigrationInspection (#4106 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 使用 sql 列名而不是类型名进行迁移生成 (#4112 by [Alexander Perfilyev][aperfilyev])

## [2.0.0-alpha05] - 2023-01-20

### 新增
- [Paging] 多平台 paging 扩展 (by [Jeff Lockhart][jeffdgr8])
- [Runtime] 为 Listener 接口添加 fun 修饰符。
- [SQLite 方言] 添加 SQLite 3.33 支持 (UPDATE FROM) (by [Eliezer Graber][eygraber])
- [PostgreSQL 方言] 支持 PostgreSQL 中的 UPDATE FROM (by [Eliezer Graber][eygraber])

### 变更
- [RDBC Driver] 暴露 connection (by [Philip Wedemann][hfhbd])
- [Runtime] 将迁移回调移到主 `migrate` 函数中
- [Gradle Plugin] 向下游项目隐藏 Configurations
- [Gradle Plugin] 仅着色 Intellij (by [Philip Wedemann][hfhbd])
- [Gradle Plugin] 支持 Kotlin 1.8.0-Beta 并添加多版本 Kotlin 测试 (by [Philip Wedemann][hfhbd])

### 修复
- [RDBC Driver] 使用 javaObjectType 代替 (by [Philip Wedemann][hfhbd])
- [RDBC Driver] 修复 bindStatement 中的原始 null 值 (by [Philip Wedemann][hfhbd])
- [RDBC Driver] 支持 R2DBC 1.0 (by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] Postgres：修复不带类型形参的数组 (by [Philip Wedemann][hfhbd])
- [IDE Plugin] 将 intellij 提升到 221.6008.13 (by [Philip Wedemann][hfhbd])
- [编译器] 从纯 views 解析递归源表 (by [Philip Wedemann][hfhbd])
- [编译器] 使用 table foreign key clause 中的 value classes (by [Philip Wedemann][hfhbd])
- [编译器] 修复 SelectQueryGenerator 以支持不带圆括号的 bind expression (by [Doogie Min][bellatoris])
- [编译器] 修复使用事务时重复生成 ${name}Indexes 变量的问题 (by [Andreas Sacher][sachera])

## [1.5.5] - 2023-01-20

此版本是为了兼容 Kotlin 1.8 和 IntelliJ 2021+，支持 JDK 17。

## [1.5.4] - 2022-10-06

此版本是为了兼容 Kotlin 1.7.20 和 AGP 7.3.0。

## [2.0.0-alpha04] - 2022-10-03

### 破坏性变更

- Paging 3 扩展 API 已更改为仅允许 int 类型用于 count。
- 协程扩展现在需要传入 dispatcher 而不是默认值。
- 方言和 Driver 类是 final 的，请改用委托。

### 新增
- [HSQL 方言] Hsql：支持在 Insert 中使用 DEFAULT 用于生成列 (#3372 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL：支持在 INSERT 中使用 DEFAULT 用于生成列 (#3373 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] 添加 NOW() 到 PostgreSQL (#3403 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] PostgreSQL 添加 NOT 操作符 (#3504 by [Philip Wedemann][hfhbd])
- [Paging] 允许将 CoroutineContext 传入 *QueryPagingSource (#3384)
- [Gradle Plugin] 添加更好的版本目录支持方言 (#3435)
- [Native Driver] 添加回调以钩入 NativeSqliteDriver 的 DatabaseConfiguration 创建 (#3512 by [Sven Jacobs][svenjacobs])

### 变更
- [Paging] 为 KeyedQueryPagingSource 支持的 QueryPagingSource 函数添加默认 dispatcher (#3385)
- [Paging] 使 OffsetQueryPagingSource 仅与 Int 配合使用 (#3386)
- [Async Runtime] 将 await* 移动到上层类 ExecutableQuery (#3524 by [Philip Wedemann][hfhbd])
- [Coroutines Extensions] 移除 flow extensions 的默认形参 (#3489)

### 修复
- [Gradle Plugin] 更新到 Kotlin 1.7.20 (#3542 by [Zac Sweers][zacsweers])
- [R2DBC Driver] 采纳 R2DBC 更改，这些更改不总是发送值 (#3525 by [Philip Wedemann][hfhbd])
- [HSQL 方言] 修复使用 Hsql 导致 sqlite VerifyMigrationTask 失败 (#3380 by [Philip Wedemann][hfhbd])
- [Gradle Plugin] 将任务转换为使用 Gradle 的惰性配置 API (by [Matthew Haughton][3flex])
- [Gradle Plugin] 避免 Kotlin 1.7.20 中的 NPE (#3398 by [Zac Sweers][ZacSweers])
- [Gradle Plugin] 修复 squash migrations 任务的描述 (#3449)
- [IDE Plugin] 修复较新 Kotlin 插件中的 NoSuchFieldError (#3422 by [Madis Pink][madisp])
- [IDE Plugin] IDEA: UnusedQueryInspection - 修复 ArrayIndexOutOfBoundsException. (#3427 by [Niklas Baudy][vanniktech])
- [IDE Plugin] 为旧 kotlin 插件引用使用反射
- [编译器] 带有扩展函数的自定义方言不创建导入 (#3338 by [Philip Wedemann][hfhbd])
- [编译器] 修复转义 CodeBlock.of("${CodeBlock.toString()}") (#3340 by [Philip Wedemann][hfhbd])
- [编译器] 迁移中等待异步执行语句 (#3352)
- [编译器] 修复 AS (#3370 by [Philip Wedemann][hfhbd])
- [编译器] `getObject` 方法支持自动填充实际类型。 (#3401 by [Rob X][robx])
- [编译器] 修复异步分组返回语句的代码生成 (#3411)
- [编译器] 如果可能，推断 bind parameter 的 Kotlin 类型，否则抛出更好的错误消息 (#3413 by [Philip Wedemann][hfhbd])
- [编译器] 不允许 ABS("foo") (#3430 by [Philip Wedemann][hfhbd])
- [编译器] 支持从其他 parameters 推断 kotlin 类型 (#3431 by [Philip Wedemann][hfhbd])
- [编译器] 始终创建数据库实现 (#3540 by [Philip Wedemann][hfhbd])
- [编译器] 放宽 javaDoc 并将其添加到自定义 mapper function 中 (#3554 [Philip Wedemann][hfhbd])
- [编译器] 修复 binding 中的 DEFAULT (by [Philip Wedemann][hfhbd])
- [Paging] 修复 Paging 3 (#3396)
- [Paging] 允许使用 Long 构造 OffsetQueryPagingSource (#3409)
- [Paging] 不静态交换 Dispatchers.Main (#3428)

## [2.0.0-alpha03] - 2022-06-17

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
- `PreparedStatement` API 现在以零为基数的索引调用。

### 新增
- [IDE Plugin] 添加了针对运行中数据库运行 SQLite、MySQL 和 PostgreSQL 命令的支持 (#2718 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加了对 android studio DB inspector 的支持 (#3107 by [Alexander Perfilyev][aperfilyev])
- [Runtime] 添加了对异步驱动的支持 (#3168 by [Derek Ellis][dellisd])
- [Native Driver] 支持新的 kotlin native memory model (#3177 by [Kevin Galligan][kpgalligan])
- [JS Driver] 为 SqlJs workers 添加了驱动 (#3203 by [Derek Ellis][dellisd])
- [Gradle Plugin] 暴露 SQLDelight 任务的 classpath
- [Gradle Plugin] 添加了一个用于 squash migrations 的 gradle task
- [Gradle Plugin] 添加了一个标志以在 migration checks 期间忽略 schema definitions
- [MySQL 方言] 支持 MySQL 中的 FOR SHARE 和 FOR UPDATE (#3098)
- [MySQL 方言] 支持 MySQL index hints (#3099)
- [PostgreSQL 方言] 添加 date_trunc (#3295 by [Philip Wedemann][hfhbd])
- [JSON 扩展] 支持 JSON 表函数 (#3090)

### 变更
- [Runtime] 移除不带驱动的 AfterVersion 类型 (#3091)
- [Runtime] 将 Schema 类型移动到顶层
- [Runtime] 开放方言和解析器以支持第三方实现 (#3232 by [Philip Wedemann][hfhbd])
- [编译器] 在失败报告中包含用于编译的方言 (#3086)
- [编译器] 跳过未使用的适配器 (#3162 by [Eliezer Graber][eygraber])
- [编译器] 在 PrepareStatement 中使用零基索引 (#3269 by [Philip Wedemann][hfhbd])
- [Gradle Plugin] 也使方言成为正确的 gradle dependency 而不是 string (#3085)
- [Gradle Plugin] Gradle Verify Task: 当数据库文件缺失时抛出异常 (#3126 by [Niklas Baudy][vanniktech])

### 修复
- [Gradle Plugin] 对 Gradle 插件进行小幅清理和调整 (#3171 by [Matthew Haughton][3flex])
- [Gradle Plugin] 不使用 AGP string 作为生成的目录
- [Gradle Plugin] 使用 AGP namespace attribute (#3220)
- [Gradle Plugin] 不将 kotlin-stdlib 作为 Gradle 插件的 runtime dependency (#3245 by [Martin Bonnin][mbonnin])
- [Gradle Plugin] 简化 multiplatform configuration (#3246 by [Martin Bonnin][mbonnin])
- [Gradle Plugin] 支持 js only 项目 (#3310 by [Philip Wedemann][hfhbd])
- [IDE Plugin] 使用 java home 用于 gradle tooling API (#3078)
- [IDE Plugin] 在 IDE plugin 中将 JDBC driver 加载到正确的 classLoader 上 (#3080)
- [IDE Plugin] 在失效之前将 file element 标记为 null，以避免在 already existing PSI changes 期间出现错误 (#3082)
- [IDE Plugin] 在 ALTER TABLE 语句中查找新表名的使用时不要崩溃 (#3106)
- [IDE Plugin] 优化 inspectors 并使其能够针对 expected exception types 静默失败 (#3121)
- [IDE Plugin] 删除应为 generated directories 的文件 (#3198)
- [IDE Plugin] 修复一个 not-safe 操作符调用
- [编译器] 确保带有 RETURNING 语句的 updates 和 deletes 执行 queries。 (#3084)
- [编译器] 正确推断 compound selects 中的 argument types (#3096)
- [编译器] Common tables 不生成 data classes，因此不返回它们 (#3097)
- [编译器] 更快地找到 top migration file (#3108)
- [编译器] 正确继承 pipe operator 上的 nullability
- [编译器] 支持 iif ANSI SQL function
- [编译器] 不生成空的 query files (#3300 by [Philip Wedemann][hfhbd])
- [编译器] 修复 adapter 仅带 question mark (#3314 by [Philip Wedemann][hfhbd])
- [PostgreSQL 方言] Postgres primary key columns 始终非 null (#3092)
- [PostgreSQL 方言] 修复多个表中同名复制的问题 (#3297 by [Philip Wedemann][hfhbd])
- [SQLite 3.35 方言] 仅在从 altered table 中 dropping an indexed column 时显示错误 (#3158 by [Eliezer Graber][eygraber])

## [2.0.0-alpha02] - 2022-04-13

### 破坏性变更

- 您需要将所有出现的 `app.cash.sqldelight.runtime.rx` 替换为 `app.cash.sqldelight.rx2`

### 新增
- [编译器] 支持在 grouped statement 末尾返回
- [编译器] 通过 dialect modules 支持编译器扩展，并添加一个 SQLite JSON 扩展 (#1379, #2087)
- [编译器] 支持返回 value 的 PRAGMA 语句 (#1106)
- [编译器] 支持为 marked columns 生成 value types
- [编译器] 添加对 optimistic locks 和 validation 的支持 (#1952)
- [编译器] 支持 multi-update 语句
- [PostgreSQL] 支持 postgres returning 语句
- [PostgreSQL] 支持 postgres date types
- [PostgreSQL] 支持 pg intervals
- [PostgreSQL] 支持 PG Booleans 并修复 alter tables 上的 inserts
- [PostgreSQL] 支持 Postgres 中的 optional limits
- [PostgreSQL] 支持 PG BYTEA type
- [PostgreSQL] 添加 postgres serials 的测试
- [PostgreSQL] 支持 for update postgres 语法
- [PostgreSQL] 支持 PostgreSQL array types
- [PostgreSQL] 正确存储/检索 PG 中的 UUID types
- [PostgreSQL] 支持 PostgreSQL NUMERIC type (#1882)
- [PostgreSQL] 支持 common table expressions 中 returning queries (#2471)
- [PostgreSQL] 支持 json specific operators
- [PostgreSQL] 添加 Postgres Copy (by [Philip Wedemann][hfhbd])
- [MySQL] 支持 MySQL Replace
- [MySQL] 支持 NUMERIC/BigDecimal MySQL types (#2051)
- [MySQL] 支持 MySQL truncate statement
- [MySQL] 支持 Mysql 中的 json specific operators (by [Eliezer Graber][eygraber])
- [MySQL] 支持 MySql INTERVAL (#2969 by [Eliezer Graber][eygraber])
- [HSQL] 添加 HSQL Window functionality
- [SQLite] 不在 WHERE 中 replace equality checks for nullable parameters (#1490 by [Eliezer Graber][eygraber])
- [SQLite] 支持 Sqlite 3.35 returning statements (#1490 by [Eliezer Graber][eygraber])
- [SQLite] 支持 GENERATED clause
- [SQLite] 添加对 Sqlite 3.38 方言的支持 (by [Eliezer Graber][eygraber])

### 变更
- [编译器] 清理生成的代码
- [编译器] 禁止在 grouped statements 中使用 table parameters (#1822)
- [编译器] 将 grouped queries 放入 transaction 中 (#2785)
- [Runtime] 从 drivers execute 方法返回 updated row count
- [Runtime] 将 SqlCursor 限制在 critical section 访问 connection。 (#2123 by [Anders Ha][andersio])
- [Gradle Plugin] 比较 migrations 的 schema definitions (#841)
- [PostgreSQL] 不允许 PG 的 double quotes
- [MySQL] Error on usage of == in MySQL (#2673)

### 修复
- [编译器] 2.0 alpha 中不同表相同适配器类型导致编译错误
- [编译器] Problem compiling upsert statement (#2791)
- [编译器] Query result 应使用 select 中的 tables 如果有多个 matches (#1874, #2313)
- [编译器] 支持 updating a view with an INSTEAD OF trigger (#1018)
- [编译器] 支持 function names 中的 from 和 for
- [编译器] 允许 SEPARATOR 关键字在 function expressions 中
- [编译器] Cannot access ROWID of aliased table in ORDER BY
- [编译器] Aliased column name is not recognized in HAVING clause in MySQL
- [编译器] Erroneous 'Multiple columns found' 错误
- [编译器] 无法设置 PRAGMA locking_mode = EXCLUSIVE;
- [PostgreSQL] Postgresql rename column
- [MySQL] UNIX_TIMESTAMP, TO_SECONDS, JSON_ARRAYAGG MySQL functions 未识别
- [SQLite] 修复 SQLite window functionality
- [IDE Plugin] 在 empty progress indicator 中运行 goto handler (#2990)
- [IDE Plugin] 确保 highlight visitor 不运行如果 project 未配置 (#2981, #2976)
- [IDE Plugin] 确保 transitive generated code 在 IDE 中也 updated (#1837)
- [IDE Plugin] 更新 dialect 时 invalidate indexes

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

- Primitive types 现在必须导入（例如 `INTEGER AS Boolean`，您必须 `import kotlin.Boolean`），一些以前支持的类型现在需要 adapter。Primitive adapters 可在 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` 中找到，用于大多数转换（例如 `IntColumnAdapter` 用于 `Integer AS kotlin.Int`）。

### 新增
- [IDE Plugin] 基本 suggested migration (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 import hint action (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 kotlin class completion (by [Alexander Perfilyev][aperfilyev])
- [Gradle Plugin] 为 Gradle type safe project accessors 添加快捷方式 (by [Philip Wedemann][hfhbd])
- [编译器] 根据 dialect 自定义 codegen (by [Marius Volkhart][MariusV])
- [JDBC Driver] 为 JdbcDriver 添加 common types (by [Marius Volkhart][MariusV])
- [SQLite] 添加对 sqlite 3.35 的支持 (by [Eliezer Graber][eygraber])
- [SQLite] 添加对 ALTER TABLE DROP COLUMN 的支持 (by [Eliezer Graber][eygraber])
- [SQLite] 添加对 Sqlite 3.30 dialect 的支持 (by [Eliezer Graber][eygraber])
- [SQLite] 支持 sqlite 中的 NULLS FIRST/LAST (by [Eliezer Graber][eygraber])
- [HSQL] 添加 HSQL 对 generated clause 的支持 (by [Marius Volkhart][MariusV])
- [HSQL] 添加对 HSQL 中 named parameters 的支持 (by [Marius Volkhart][MariusV])
- [HSQL] Customize HSQL insert query (by [Marius Volkhart][MariusV])

### 变更
- [所有] 包名已从 com.squareup.sqldelight 更改为 app.cash.sqldelight。
- [Runtime] 将 dialects 移到其自身的 isolated gradle modules
- [Runtime] 切换到 driver-implemented query notifications。
- [Runtime] 将 default column adapters 提取到 separate module (#2056, #2060)
- [编译器] 让 modules 生成 queries implementations 而不是在每个 module 中重复生成
- [编译器] 移除生成的 data classes 中 custom toString 的生成。 (by [Paul Woitaschek][PaulWoitaschek])
- [JS Driver] 从 sqljs-driver 移除 sql.js dependency (by [Derek Ellis][dellisd])
- [Paging] 移除 android paging 2 扩展
- [IDE Plugin] SQLDelight 同步时添加 editor banner (#2511)
- [IDE Plugin] 最低支持 IntelliJ 版本为 2021.1

### 修复
- [Runtime] Flatten listener list to reduce allocations and pointer chasing. (by [Anders Ha][andersio])
- [IDE Plugin] 修复 error message 以允许 jumping to error (by [Philip Wedemann][hfhbd])
- [IDE Plugin] 添加缺失的 inspection descriptions (#2768 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 GotoDeclarationHandler 中的 exception (#2531, #2688, #2804 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 高亮 import 关键字 (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 unresolved kotlin types (#1678 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 unresolved package 的 highlighting (#2543 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Dont attempt to inspect mismatched columns if the project index is not yet initialized
- [IDE Plugin] Dont initialize the file index until a gradle sync has occurred
- [IDE Plugin] Cancel the SQLDelight import if a gradle sync begins
- [IDE Plugin] Regenerate the database outside of the thread an undo action is performed on
- [IDE Plugin] If a reference cannot be resolves use a blank java type
- [IDE Plugin] Correctly move off the main thread during file parsing and only move back on to write
- [IDE Plugin] Improve compatibility with older IntelliJ versions (by [Matthew Haughton][3flex])
- [IDE Plugin] 使用 faster annotation API
- [Gradle Plugin] Explicitly support js/android plugins when adding runtime (by [Zac Sweers][ZacSweers])
- [Gradle Plugin] Register migration output task without derviving schemas from migrations (#2744 by [Kevin Cianfarini][kevincianfarini])
- [Gradle Plugin] 如果 migration task 崩溃，打印 it crashed running 的文件
- [Gradle Plugin] 生成代码时对 files 进行排序以确保 idempotent outputs (by [Zac Sweers][ZacSweers])
- [编译器] 使用 faster APIs for iterating files and dont explore the entire PSI graph
- [编译器] Add keyword mangling to select function parameters (#2759 by [Alexander Perfilyev][aperfilyev])
- [编译器] 修复 migration adapter 的 packageName (by [Philip Wedemann][hfhbd])
- [编译器] Emit annotations on properties instead of types (#2798 by [Alexander Perfilyev][aperfilyev])
- [编译器] Sort arguments before passing to a Query subtype (#2379 by [Alexander Perfilyev][aperfilyev])

## [1.5.3] - 2021-11-23
### 新增
- [JDBC Driver] Open JdbcDriver for 3rd party driver implementations (#2672 by [Philip Wedemann][hfhbd])
- [MySQL 方言] 添加缺失的 time increments 函数 (#2671 by [Sam Doward][sdoward])
- [Coroutines Extension] 为 coroutines-extensions 添加 M1 目标 (by [Philip Dukhov][PhilipDukhov])

### 变更
- [Paging3 Extension] 将 sqldelight-android-paging3 作为 JAR 而不是 AAR 发布 (#2634 by [Marco Romano][julioromano])
- Property names 如果也是 soft keywords，现在将以 `_` 为后缀。例如 `value` 将被暴露为 `value_`

### 修复
- [编译器] 不为 duplicate array parameters 提取 variables (by [Alexander Perfilyev][aperfilyev])
- [Gradle Plugin] add kotlin.mpp.enableCompatibilityMetadataVariant. (#2628 by [Martin Bonnin][martinbonnin])
- [IDE Plugin] Find usages processing requires a read action

## [1.5.2] - 2021-10-12
### 新增
- [Gradle Plugin] HMPP 支持 (#2548 by [Martin Bonnin][martinbonnin])
- [IDE Plugin] 添加 NULL comparison inspection (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 inspection suppressor (#2519 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Mixed named and positional parameters inspection (by [Alexander Perfilyev][aperfilyev])
- [SQLite Driver] 添加 mingwX86 目标。 (#2558 by [Nikita Kozhemyakin][enginegl])
- [SQLite Driver] 添加 M1 目标
- [SQLite Driver] 添加 linuxX64 支持 (#2456 by [Cedric Hippmann][chippmann])
- [MySQL 方言] 为 mysql 添加 ROW_COUNT 函数 (#2523)
- [PostgreSQL 方言] postgres rename, drop column (by [Juan Liska][pabl0rg])
- [PostgreSQL 方言] PostgreSQL grammar 不识别 CITEXT
- [PostgreSQL 方言] 包含 TIMESTAMP WITH TIME ZONE 和 TIMESTAMPTZ
- [PostgreSQL 方言] 为 PostgreSQL GENERATED columns 添加 grammar
- [Runtime] 提供 SqlDriver 作为 AfterVersion 的 parameter (#2534, 2614 by [Ahmed El-Helw][ahmedre])

### 变更
- [Gradle Plugin] explicitely require Gradle 7.0 (#2572 by [Martin Bonnin][martinbonnin])
- [Gradle Plugin] 使 VerifyMigrationTask 支持 Gradle 的 up-to-date checks (#2533 by [Matthew Haughton][3flex])
- [IDE Plugin] 当 joining nullable with non-nullable type 时，不警告 "Join compares two columns of different types" (#2550 by [Piotr Chmielowski][pchmielowski])
- [IDE Plugin] 澄清 column type 中 lowercase 'as' 的 error message (by [Alexander Perfilyev][aperfilyev])

### 修复
- [IDE Plugin] 如果 project 已经 disposed，则不 reparse under a new dialect (#2609)
- [IDE Plugin] 如果 associated virtual file 是 null，则 module 是 null (#2607)
- [IDE Plugin] 避免 during the unused query inspection 时 crashing (#2610)
- [IDE Plugin] Run the database sync write inside of a write action (#2605)
- [IDE Plugin] 让 IDE schedule SQLDelight syncronization
- [IDE Plugin] 修复 JavaTypeMixin 中的 npe (#2603 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 MismatchJoinColumnInspection 中的 IndexOutOfBoundsException (#2602 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 为 UnusedColumnInspection 添加 description (#2600 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 将 PsiElement.generatedVirtualFiles 包装到 read action 中 (#2599 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 移除不必要的 nonnull cast (#2596)
- [IDE Plugin] Properly handle nulls for find usages (#2595)
- [IDE Plugin] 修复 Android generated files 的 IDE autocomplete (#2573 by [Martin Bonnin][martinbonnin])
- [IDE Plugin] 修复 SqlDelightGotoDeclarationHandler 中的 npe (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 在 insert stmt 中 mangle kotlin keywords in arguments (#2433 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 SqlDelightFoldingBuilder 中的 npe (#2382 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Catch ClassCastException in CopyPasteProcessor (#2369 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 update live template (by [Ilias Redissi][IliasRedissi])
- [IDE Plugin] Adds descriptions to intention actions (#2489 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 CreateTriggerMixin 中如果 table not found 时的 exception (by [Alexander Perfilyev][aperfilyev])
- [编译器] Topologically sort table creation statemenets
- [编译器] Stop invoking `forDatabaseFiles` callback on directories (#2532)
- [Gradle Plugin] Propagate generateDatabaseInterface task dependency to potential consumers (#2518 by [Martin Bonnin][martinbonnin])

## [1.5.1] - 2021-07-16
### 新增
- [PostgreSQL 方言] PostgreSQL JSONB 和 ON Conflict Do Nothing (by [Andrew Stewart][satook])
- [PostgreSQL 方言] 添加对 PostgreSQL ON CONFLICT (column, ...) DO UPDATE 的支持 (by [Andrew Stewart][satook])
- [MySQL 方言] 支持 MySQL generated columns (by [Jeff Gulbronson][JeffG])
- [Native Driver] 添加 watchosX64 支持
- [IDE Plugin] 添加 parameter types 和 annotations (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 action to generate 'select all' query (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 在 autocomplete 中显示 column types (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 为 autocomplete 添加 icons (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 action to generate 'select by primary key' query (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 action to generate 'insert into' query (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 highlighting for column names, stmt identifiers, function names (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 remaining query generation actions (#489 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 显示 insert-stmt 的 parameter hints (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Table alias intention action (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Qualify column name intention (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Go to declaration for kotlin property (by [Alexander Perfilyev][aperfilyev])

### 变更
- [Native Driver] 改进 native transaction performance，通过避免 freezing 和 shareable data structures 当可能时 (by [Anders Ha][andersio])
- [Paging 3] 将 Paging3 版本提升到 3.0.0 stable
- [JS Driver] 升级 sql.js 到 1.5.0

### 修复
- [JDBC SQLite Driver] 在 clearing the ThreadLocal 之前调用 connection 上的 close() (#2444 by [Hannes Struß][hannesstruss])
- [RX extensions] 修复 subscription / disposal race leak (#2403 by [Pierre Yves Ricau][pyricau])
- [Coroutines extension] 确保我们在 notifying 之前 register query listener
- [编译器] Sort notifyQueries to have consistent kotlin output file (by [Jiayu Chen][thomascjy])
- [编译器] Don't annotate select query class properties with @JvmField (by [Eliezer Graber][eygraber])
- [IDE Plugin] 修复 import optimizer (#2350 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 unused column inspection (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 为 import inspection 和 class annotator 添加 nested classes support (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 CopyPasteProcessor 中的 npe (#2363 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复 InlayParameterHintsProvider 中的 crash (#2359 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 修复当 copy-pasting any text into create table stmt 时 insertion of blank lines (#2431 by [Alexander Perfilyev][aperfilyev])

## [1.5.0] - 2021-04-23
### 新增
- [SQLite Javascript Driver] 启用 sqljs-driver publication (#1667 by [Derek Ellis][dellisd])
- [Paging3 Extension] Extension for Android Paging 3 Library (#1786 by [Kevin Cianfarini][kevincianfarini])

## [1.5.0] - 2021-04-23
### 新增
- [SQLite Javascript Driver] 启用 sqljs-driver publication (#1667 by [Derek Ellis][dellisd])
- [Paging3 Extension] Extension for Android Paging 3 Library (#1786 by [Kevin Cianfarini][kevincianfarini])
- [MySQL 方言] 添加对 mysql 的 ON DUPLICATE KEY UPDATE 冲突解决的支持。 (by [Ryan Harter][rharter])
- [SQLite 方言] 添加 compiler 支持 for SQLite offsets() (by [Quinton Roberts][qjroberts])
- [IDE Plugin] 为 unknown type 添加 import quick fix (#683 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 unused import inspection (#1161 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 unused query inspection (by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 添加 unused column inspection (#569 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Automatically bring imports on copy/paste (#684 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 当 gradle/intellij plugin versions 不兼容时，pop a balloon
- [IDE Plugin] Insert Into ... VALUES(?) parameter hints (#506 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] Inline parameter hints (by [Alexander Perfilyev][aperfilyev])
- [Runtime] Include an API in the runtime for running migrations with callbacks (#1844)

### 变更
- [编译器] Smart cast "IS NOT NULL" queries (#867)
- [编译器] Protect against keywords that will fail at runtime (#1471, #1629)
- [Gradle Plugin] Reduce size of gradle plugin from 60mb -> 13mb.
- [Gradle Plugin] Properly support android variants, and remove support for KMM target-specific sql (#1039)
- [Gradle Plugin] Pick a minimum sqlite version based on minsdk (#1684)
- [Native Driver] Native driver connection pool and performance updates

### 修复
- [编译器] NBSP before lambdas (by [Benoît Quenaudon][oldergod])
- [编译器] Fix incompatible types in generated bind* and cursor.get* statements
- [编译器] SQL clause should persist adapted type (#2067)
- [编译器] Column with only NULL keyword should be nullable
- [编译器] Dont generate mapper lambda with type annotations (#1957)
- [编译器] 如果 custom queries 会 clash，则使用 file name 作为 additional package suffix (#1057, #1278)
- [编译器] 确保 foreign key cascades cause query listeners to be notified (#1325, #1485)
- [编译器] If unioning two of the same type, return the table type (#1342)
- [编译器] 确保 params to ifnull and coalesce can be nullable (#1263)
- [编译器] Correctly use query-imposed nullability for expressions
- [MySQL 方言] 支持 MySQL if statements
- [PostgreSQL 方言] Retrieve NUMERIC and DECIMAL as Double in PostgreSQL (#2118)
- [SQLite 方言] UPSERT notifications should account for BEFORE/AFTER UPDATE triggers. (#2198 by [Anders Ha][andersio])
- [SQLite Driver] Use multiple connections for threads in the SqliteDriver unless we are in memory (#1832)
- [JDBC Driver] JDBC Driver assumes autoCommit is true (#2041)
- [JDBC Driver] 确保我们在 exception 时 close connections (#2306)
- [IDE Plugin] Fix GoToDeclaration/FindUsages being broken on Windows due to path separator bug (#2054 by [Angus Holder][AngusH])
- [IDE Plugin] Ignore gradle errors instead of crashing in the IDE.
- [IDE Plugin] If a sqldelight file is moved to a non-sqldelight module, do not attempt codegen
- [IDE Plugin] Ignore codegen errors in IDE
- [IDE Plugin] 确保我们 dont try to negatively substring (#2068)
- [IDE Plugin] Also ensure project is not disposed before running gradle action (#2155)
- [IDE Plugin] Arithmetic on nullable types should also be nullable (#1853)
- [IDE Plugin] 使 'expand * intention' 与 additional projections 一起工作 (#2173 by [Alexander Perfilyev][aperfilyev])
- [IDE Plugin] 如果 kotlin resolution fails during GoTo，dont attempt to go to sqldelight files
- [IDE Plugin] 如果 IntelliJ encounters an exception while sqldelight is indexing，dont crash
- [IDE Plugin] Handle exceptions that happen while detecting errors before codegen in the IDE
- [IDE Plugin] Make the IDE plugin compatible with Dynamic Plugins (#1536)
- [Gradle Plugin] Race condition generating a database using WorkerApi (#2062 by [Stéphane Nicolas][stephanenicolas])
- [Gradle Plugin] classLoaderIsolation prevents custom jdbc usage (#2048 by [Ben Asher][BenA])
- [Gradle Plugin] Improve missing packageName error message (by [Niklas Baudy][vanniktech])
- [Gradle Plugin] SQLDelight bleeds IntelliJ dependencies onto buildscript class path (#1998)
- [Gradle Plugin] Fix gradle build caching (#2075)
- [Gradle Plugin] Do not depend on kotlin-native-utils in Gradle plugin (by [Ilya Matveev][ilmat192])
- [Gradle Plugin] 如果只有 migration files，也要 write the database (#2094)
- [Gradle Plugin] Ensure diamond dependencies only get picked up once in the final compilation unit (#1455)

此外，特别感谢 [Matthew Haughton][3flex] 在此版本中为改进 SQLDelight 基础设施所做的许多工作。

## [1.4.4] - 2020-10-08
### 新增
- [PostgreSQL 方言] 支持 WITH 子句中的 data-modifying statements
- [PostgreSQL 方言] 支持 substring 函数
- [Gradle Plugin] 为 validating migrations during SQLDelight compilation 添加 verifyMigrations 标志 (#1872)

### 变更
- [编译器] 在 non-SQLite dialects 中将 SQLite specific functions 标记为 unknown
- [Gradle Plugin] 当 sqldelight plugin applied 但 no databases configured 时发出 warning (#1421)

### 修复
- [编译器] 在 ORDER BY 子句中 binding a column name 时报告 error (#1187 by [Eliezer Graber][eygraber])
- [编译器] Registry warnings appear when generating the db interface (#1792)
- [编译器] Incorrect type inference for case statement (#1811)
- [编译器] 为 no version 的 migration files 提供 better errors (#2006)
- [编译器] Required database type to marshal is incorrect for some database type ColumnAdapter's (#2012)
- [编译器] Nullability of CAST (#1261)
- [编译器] Lots of name shadowed warnings in query wrappers (#1946 by [Eliezer Graber][eygraber])
- [编译器] Generated code is using full qualifier names (#1939)
- [IDE Plugin] Trigger sqldelight code gen from gradle syncs
- [IDE Plugin] Plugin 不 regenerate database interface 当 changing .sq files (#1945)
- [IDE Plugin] Issue when moving files to new packages (#444)
- [IDE Plugin] 如果 theres nowhere to move the cursor，do nothing instead of crashing (#1994)
- [IDE Plugin] 为 files outside of a gradle project 使用 empty package name (#1973)
- [IDE Plugin] Fail gracefully for invalid types (#1943)
- [IDE Plugin] Throw a better error message when encountering an unknown expression (#1958)
- [Gradle Plugin] SQLDelight bleeds IntelliJ dependencies onto buildscript class path (#1998)
- [Gradle Plugin] "JavadocIntegrationKt not found" compilation error when adding method doc in *.sq file (#1982)
- [Gradle Plugin] SqlDeslight gradle plugin doesn't support Configuration Caching (CoCa). (#1947 by [Stéphane Nicolas][stephanenicolas])
- [SQLite JDBC Driver] SQLException: database in auto-commit mode (#1832)
- [Coroutines Extension] 修复 coroutines-extensions 的 IR backend (#1918 by [Derek Ellis][dellisd])

## [1.4.3] - 2020-09-04
### 新增
- [MySQL 方言] 添加对 MySQL last_insert_id 函数的支持 (by [Kelvin Law][lawkai])
- [PostgreSQL 方言] 支持 SERIAL data type (by [Veyndan Stuart][VeyndanS] & [Felipe Lima][felipecsl])
- [PostgreSQL 方言] 支持 PostgreSQL RETURNING (by [Veyndan Stuart][VeyndanS])

### 修复
- [MySQL 方言] Treat MySQL AUTO_INCREMENT as having a default value (#1823)
- [编译器] 修复 Upsert statement compiler error (#1809 by [Eliezer Graber][eygraber])
- [编译器] 修复 with invalid Kotlin being generated 的 issue (#1925 by [Eliezer Graber][eygraber])
- [编译器] 为 unknown functions 提供 better error message (#1843)
- [编译器] Expose string as the type for the second parameter of instr
- [IDE Plugin] Fix daemon bloat and UI thread stalling for IDE plugin (#1916)
- [IDE Plugin] Handle null module scenario (#1902)
- [IDE Plugin] 在 unconfigured sq files 中 return empty string for the package name (#1920)
- [IDE Plugin] 修复 grouped statements 并为它们添加 integration test (#1820)
- [IDE Plugin] Use built in ModuleUtil to find the module for an element (#1854)
- [IDE Plugin] 只 add valid elements to lookups (#1909)
- [IDE Plugin] Parent can be null (#1857)

## [1.4.2] - 2020-08-27
### 新增
- [Runtime] 支持新的 JS IR backend
- [Gradle Plugin] 添加 generateSqlDelightInterface Gradle task. (by [Niklas Baudy][vanniktech])
- [Gradle Plugin] 添加 verifySqlDelightMigration Gradle task. (by [Niklas Baudy][vanniktech])

### 修复
- [IDE Plugin] Use the gradle tooling API to facilitate data sharing between the IDE and gradle
- [IDE Plugin] Default to false for schema derivation
- [IDE Plugin] Properly retrieve the commonMain source set
- [MySQL 方言] Added minute to mySqlFunctionType() (by [MaaxGr][maaxgr])

## [1.4.1] - 2020-08-21
### 新增
- [Runtime] 支持 Kotlin 1.4.0 (#1859)

### 变更
- [Gradle Plugin] Make AGP dependency compileOnly (#1362)

### 修复
- [编译器] Add optional javadoc to column defintion rule and to table interface generator (#1224 by [Daniel Eke][endanke])
- [SQLite 方言] 添加对 sqlite fts5 auxiliary functions highlight, snippet, and bm25 的支持 (by [Daniel Rampelt][drampelt])
- [MySQL 方言] 支持 MySQL bit data type
- [MySQL 方言] 支持 MySQL binary literals
- [PostgreSQL 方言] Expose SERIAL from sql-psi (by [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 添加 BOOLEAN data type (by [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 添加 NULL column constraint (by [Veyndan Stuart][VeyndanS])
- [HSQL 方言] Adds `AUTO_INCREMENT` support to HSQL (by [Ryan Harter][rharter])

## [1.4.0] - 2020-06-22
### 新增
- [MySQL 方言] MySQL 支持 (by [Jeff Gulbronson][JeffG] & [Veyndan Stuart][VeyndanS])
- [PostgreSQL 方言] 实验性 PostgreSQL 支持 (by [Veyndan Stuart][VeyndanS])
- [HSQL 方言] 实验性 H2 支持 (by [Marius Volkhart][MariusV])
- [SQLite 方言] SQLite FTS5 支持 (by [Ben Asher][BenA] & [James Palawaga][JamesP])
- [SQLite 方言] 支持 alter table rename column (#1505 by [Angus Holder][AngusH])
- [IDE] IDE 支持 migration (.sqm) files
- [IDE] 添加 SQLDelight Live Templates，模仿内置 SQL Live Templates (#1154 by [Veyndan Stuart][VeyndanS])
- [IDE] 添加 new SqlDelight file action (#42 by [Roman Zavarnitsyn][RomanZ])
- [Runtime] transactionWithReturn API for transactions that return results
- [编译器] .sq 文件中分组多个 SQL statements 的语法
- [编译器] 支持从 migration files 生成 schemas
- [Gradle Plugin] 添加一个 task 用于 outputting migration files as valid sql

### 变更
- [Documentation] Overhaul of the documentation website (by [Saket Narayan][SaketN])
- [Gradle Plugin] Improve unsupported dialect error message (by [Veyndan Stuart][VeyndanS])
- [IDE] Dynamically change file icon based on dialect (by [Veyndan Stuart][VeyndanS])
- [JDBC Driver] Expose a JdbcDriver constructor off of javax.sql.DataSource (#1614)

### 修复
- [编译器]Support Javadoc on tables and fix multiple javadoc in one file (#1224)
- [编译器] Enable inserting a value for synthesized columns (#1351)
- [编译器] Fix inconsistency in directory name sanitizing (by [Zac Sweers][ZacSweers])
- [编译器] Synthesized columns should retain nullability across joins (#1656)
- [编译器] Pin the delete statement on the delete keyword (#1643)
- [编译器] Fix quoting (#1525 by [Angus Holder][AngusH])
- [编译器] Fix the between operator to properly recurse into expressions (#1279)
- [编译器] Give better error for missing table/column when creating an index (#1372)
- [编译器] Enable using the outer querys projection in join constraints (#1346)
- [Native Driver] Make execute use transationPool (by [Ben Asher][BenA])
- [JDBC Driver] Use the jdbc transaction APIs instead of sqlite (#1693)
- [IDE] Fix virtualFile references to always be the original file (#1782)
- [IDE] Use the correct throwable when reporting errors to bugsnag (#1262)
- [Paging Extension] Fix leaky DataSource (#1628)
- [Gradle Plugin] If the output db file already exists when generating a schema, delete it (#1645)
- [Gradle Plugin] Fail migration validation if there are gaps
- [Gradle Plugin] Explicitely use the file index we set (#1644)

## [1.3.0] - 2020-04-03

* 新增: [Gradle] dialect property to specify with sql dialect to compile against.
* 新增: [编译器] #1009 Experimental support of the mysql dialect.
* 新增: [编译器] #1436 Support of sqlite:3.24 dialect and upsert.
* 新增: [JDBC Driver] Split out JDBC driver from sqlite jvm driver.
* 修复: [编译器] #1199 Support lambdas of any length.
* 修复: [编译器] #1610 Fix the return type of avg() to be nullable.
* 修复: [IntelliJ] #1594 Fix path separator handling which broke Goto and Find Usages on Windows.

## [1.2.2] - 2020-01-22

* 新增: [Runtime] Support for Windows (mingW), tvOS, watchOS, and macOS architectures.
* 修复: [编译器] sum() 的返回类型应为 nullable。
* 修复: [Paging] 将 Transacter 传入 QueryDataSourceFactory 以避免 race conditions。
* 修复: [IntelliJ Plugin] 查找 file 的 package name 时不搜索 dependencies。
* 修复: [Gradle] #862 将 Gradle 中的 validator logs 更改为 debug level。
* 增强: [Gradle] 将 GenerateSchemaTask 转换为使用 Gradle worker。
* 注意: sqldelight-runtime artifact 重命名为 runtime。

## [1.2.1] - 2019-12-11

* 修复: [Gradle] Kotlin Native 1.3.60 支持。
* 修复: [Gradle] #1287 同步时的 warning。
* 修复: [编译器] #1469 Query 的 SynetheticAccessor creation。
* 修复: [JVM Driver] Fixed memory leak。
* NOTE: coroutine extension artifact 要求将 kotlinx bintray maven repository 添加到您的 buildscript。

## [1.2.0] - 2019-08-30

* 新增: [Runtime] Stable Flow api。
* 修复: [Gradle] Kotlin Native 1.3.50 支持。
* 修复: [Gradle] #1380 Clean build sometimes fails。
* 修复: [Gradle] #1348 Running verify tasks prints "Could not retrieve functions"。
* 修复: [Compile] #1405 Query 包含 FTS table joined 时 Cannot build project。
* 修复: [Gradle] #1266 多个 database modules 时 Sporadic gradle build failure。

## [1.1.4] - 2019-07-11

* 新增: [Runtime] Experimental kotlin Flow api。
* 修复: [Gradle] Kotlin/Native 1.3.40 兼容性。
* 修复: [Gradle] #1243 Fix for usage of SQLDelight with Gradle configure on demand。
* 修复: [Gradle] #1385 Fix for usage of SQLDelight with incremental annotation processing。
* 修复: [Gradle] Allow gradle tasks to cache。
* 修复: [Gradle] #1274 Enable usage of sqldelight extension with kotlin dsl。
* 修复: [编译器] Unique ids are generated for each query deterministically。
* 修复: [编译器] Only notify listening queries when a transaction is complete。
* 修复: [JVM Driver] #1370 Force JdbcSqliteDriver users to supply a DB URL。

## [1.1.3] - 2019-04-14

* Gradle Metadata 1.0 release。

## [1.1.2] - 2019-04-14

* 新增: [Runtime] #1267 Logging driver decorator。
* 修复: [编译器] #1254 Split string literals which are longer than 2^16 characters。
* 修复: [Gradle] #1260 generated sources are recognized as iOS source in Multiplatform Project。
* 修复: [IDE] #1290 `kotlin.KotlinNullPointerException` in `CopyAsSqliteAction.kt:43`。
* 修复: [Gradle] #1268 Running `linkDebugFrameworkIos*` tasks fail in recent versions。

## [1.1.1] - 2019-03-01

* 修复: [Gradle] Fix module dependency compilation for android projects。
* 修复: [Gradle] #1246 Set up api dependencies in afterEvaluate。
* 修复: [编译器] Array types are properly printed。

## [1.1.0] - 2019-02-27

* 新增: [Gradle] #502 Allow specifying schema module dependencies。
* 增强: [编译器] #1111 Table errors are sorted before other errors。
* 修复: [编译器] #1225 Return the correct type for REAL literals。
* 修复: [编译器] #1218 docid propagates through triggers。

## [1.0.3] - 2019-01-30

* 增强: [Runtime] #1195 Native Driver/Runtime Arm32。
* 增强: [Runtime] #1190 Expose the mapper from the Query type。

## [1.0.2] - 2019-01-26

* 修复: [Gradle Plugin] Update to kotlin 1.3.20。
* 修复: [Runtime] Transactions no longer swallow exceptions。

## [1.0.1] - 2019-01-21

* 增强: [Native Driver] Allow passing directory name to DatabaseConfiguration。
* 增强: [编译器] #1173 Files without a package fail compilation。
* 修复: [IDE] Properly report IDE errors to Square。
* 修复: [IDE] #1162 Types in the same package show as error but work fine。
* 修复: [IDE] #1166 Renaming a table fails with NPE。
* 修复: [编译器] #1167 Throws an exception when trying to parse complex SQL statements with UNION and SELECT。

## [1.0.0] - 2019-01-08

* 新增: Generated code 的 Complete overhaul，现在 in kotlin。
* 新增: RxJava2 extensions artifact。
* 新增: Android Paging extensions artifact。
* 新增: Kotlin Multiplatform support。
* 新增: Android、iOS 和 JVM SQLite driver artifacts。
* 新增: Transaction API。

## [0.7.0] - 2018-02-12

 * 新增: Generated code has been updated to use the Support SQLite library only。All queries now generate statement objects instead of a raw strings。
 * 新增: IDE 中的 Statement folding。
 * 新增: Boolean types are now automatically handled。
 * 修复: Remove deprecated marshals from code generation。
 * 修复: Correct 'avg' SQL function type mapping to be REAL。
 * 修复: Correctly detect 'julianday' SQL function。

## [0.6.1] - 2017-03-22

 * 新增: Delete Update 和 Insert statements without arguments get compiled statements generated。
 * 修复: Using clause within a view used in a subquery doesn't error。
 * 修复: Generated Mapper 上 Duplicate types removed。
 * 修复: Subqueries can be used in expressions that check against arguments。

## [0.6.0] - 2017-03-06

 * 新增: Select queries are now exposed as a `SqlDelightStatement` factory instead of string constants。
 * 新增: Query JavaDoc is now copied to statement and mapper factories。
 * 新增: Emit string constants for view names。
 * 修复: Queries on views which require factories now correctly require those factories are arguments。
 * 修复: Validate the number of arguments to an insert matches the number of columns specified。
 * 修复: Properly encode blob literals used in where clauses。
 * Gradle 3.3 或更新版本 is required for this release。

## [0.5.1] - 2016-10-24

 * 新增: Compiled statements extend an abstract type。
 * 修复: Primitive types in parameters will be boxed if nullable。
 * 修复: All required factories for bind args are present in factory method。
 * 修复: Escaped column names are marshalled correctly。

## [0.5.0] - 2016-10-19

 * 新增: SQLite arguments can be passed typesafely through the Factory
 * 新增: IntelliJ plugin performs formatting on .sq files
 * 新增: Support for SQLite timestamp literals
 * 修复: Parameterized types can be clicked through in IntelliJ
 * 修复: Escaped column names no longer throw RuntimeExceptions if grabbed from Cursor.
 * 修复: Gradle plugin doesn't crash trying to print exceptions.

## [0.4.4] - 2016-07-20

 * 新增: 对 `short` 作为 column java type 的 Native support。
 * 新增: Generated mappers and factory methods 上的 Javadoc。
 * 修复: group_concat 和 nullif functions have proper nullability。
 * 修复: Compatibility with Android Studio 2.2-alpha。
 * 修复: WITH RECURSIVE no longer crashes plugin。

## [0.4.3] - 2016-07-07

 * 新增: Compilation errors link to source file。
 * 新增: Right-click to copy SQLDelight code as valid SQLite。
 * 新增: Named statements 上的 Javadoc will appear on generated Strings。
 * 修复: Generated view models include nullability annotations。
 * 修复: Generated code from unions has proper type and nullability to support all possible columns。
 * 修复: sum 和 round SQLite functions have proper type in generated code。
 * 修复: CAST's，inner selects bugfixes。
 * 修复: CREATE TABLE statements 中的 Autocomplete。
 * 修复: SQLite keywords can be used in packages。

## [0.4.2] - 2016-06-16

 * 新增: Marshal can be created from the factory。
 * 修复: IntelliJ plugin generates factory methods with proper generic order。
 * 修复: Function names can use any casing。

## [0.4.1] - 2016-06-14

 * 修复: IntelliJ plugin generates classes with proper generic order。
 * 修复: Column definitions can use any casing。

## [0.4.0] - 2016-06-14

 * 新增: Mappers are generated per query instead of per table。
 * 新增: Java types can be imported in .sq files。
 * 新增: SQLite functions are validated。
 * 修复: Remove duplicate errors。
 * 修复: Uppercase column names and java keyword column names do not error。

## [0.3.2] - 2016-05-14

 * 新增: Autocompletion and find usages now work for views and aliases。
 * 修复: Compile-time validation now allows functions to be used in selects。
 * 修复: Support insert statements which only declare default values。
 * 修复: Plugin no longer crashes when a project not using SQLDelight is imported。

## [0.3.1] - 2016-04-27

  * 修复: Interface visibility changed back to public to avoid Illegal Access runtime exceptions from method references。
  * 修复: Subexpressions are evaluated properly。

## [0.3.0] - 2016-04-26

  * 新增: Column definitions use SQLite types and can have additional 'AS' constraint to specify java type。
  * 新增: Bug reports can be sent from the IDE。
  * 修复: Autocomplete functions properly。
  * 修复: SQLDelight model files update on .sq file edit。
  * 移除: Attached databases no longer supported。

## [0.2.2] - 2016-03-07

 * 新增: Compile-time validation of the columns used by insert, update, delete, index, and trigger statements。
 * 修复: Don't crash IDE plugin on file move/create。

## [0.2.1] - 2016-03-07

 * 新增: Ctrl+`/` (Cmd+`/` on OSX) toggles comment of the selected line(s)。
 * 新增: Compile-time validation of the columns used by SQL queries。
 * 修复: Support Windows paths in both the IDE and Gradle plugin。

## [0.2.0] - 2016-02-29

 * 新增: Added copy constructor to Marshal class。
 * 新增: Update to Kotlin 1.0 final。
 * 修复: Report 'sqldelight' folder structure problems in a non-failing way。
 * 修复: Forbid columns named `table_name`。Their generated constant clashes with the table name constant。
 * 修复: Ensure IDE plugin generates model classes immediately and regardless of whether `.sq` files were opened。
 * 修复: Support Windows paths in both the IDE and Gradle plugin。

## [0.1.2] - 2016-02-13

 * 修复: Remove code which prevented the Gradle plugin from being used in most projects。
 * 修复: Add missing compiler dependency on the Antlr runtime。

## [0.1.1] - 2016-02-12

 * 修复: Ensure the Gradle plugin points to the same version of the runtime as itself。

## [0.1.0] - 2016-02-12

Initial release。

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
  [jonapoul]: https://github.com/jonapoul