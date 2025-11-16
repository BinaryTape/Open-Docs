# 变更日志

## 未发布

暂无内容！

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 新增
- [PostgreSQL Dialect] 修复 Postgres numeric/integer/biginteger 类型映射 (#5994 by @griffio)
- [Compiler] 改进编译器错误消息，使其在需要 CAST 操作符时包含源文件位置 (#5979 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres JSON 操作符路径提取的支持 (#5971 by @griffio)
- [SQLite Dialect] 添加 SQLite 3.35 对使用公共表表达式的 MATERIALIZED 查询规划器提示的支持 (#5961 by @griffio)
- [PostgreSQL Dialect] 添加对使用公共表表达式的 MATERIALIZED 查询规划器提示的支持 (#5961 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres JSON 聚合 FILTER 的支持 (#5957 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres 枚举的支持 (#5935 by @griffio)
- [PostgreSQL Dialect] 添加对 Postgres 触发器的有限支持 (#5932 by @griffio)
- [PostgreSQL Dialect] 添加谓词以检测 SQL 表达式是否可解析为 JSON (#5843 by @griffio)
- [PostgreSQL Dialect] 添加对 PostgreSQL COMMENT ON 语句的有限支持 (#5808 by @griffio)
- [MySQL Dialect] 添加对索引可见性选项的支持 (#5785 by @orenkislev-faire)
- [PostgreSQL Dialect] 添加对 TSQUERY 数据类型的支持 (#5779 by @griffio)
- [Gradle Plugin] 添加对在添加模块时使用版本目录的支持 (#5755 by @DRSchlaubi)

### 变更
- 开发中的快照现在已发布到 Central Portal Snapshots 版本库：https://central.sonatype.com/repository/maven-snapshots/。
- [Compiler] 使用构造函数引用简化了默认生成的查询 (#5814 by @jonapoul)

### 修复
- [Compiler] 修复了使用包含公共表表达式的 View 时发生的栈溢出问题 (#5928 by @griffio)
- [Gradle Plugin] 修复了打开 SqlDelight 工具窗口以添加“New Connection”时发生的崩溃 (#5906 by @griffio)
- [IntelliJ Plugin] 避免了在复制到 SQLite 边槽操作中与线程相关的崩溃 (#5901 by @griffio)
- [IntelliJ Plugin] 修复了 PostgreSQL 方言在使用 schema 语句 CREATE INDEX 和 CREATE VIEW 时的问题 (#5772 by @griffio)
- [Compiler] 修复了引用列时 FTS 栈溢出问题 (#5896 by @griffio)
- [Compiler] 修复了 WITH RECURSIVE 栈溢出问题 (#5892 by @griffio)
- [Compiler] 修复了 INSERT|UPDATE|DELETE RETURNING 语句的通知功能 (#5851 by @griffio)
- [Compiler] 修复了返回 Long 的事务代码块的异步结果类型问题 (#5836 by @griffio)
- [Compiler] 将 SQL 形参绑定从 O(n²) 复杂度优化到 O(n) 复杂度 (#5898 by @chenf7)
- [SQLite Dialect] 修复 SQLite 3.18 缺失的函数 (#5759 by @griffio)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

由于部分构件发布失败，此版本发布失败。请使用 2.2.1！

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 新增
- [WASM Driver] 添加对 wasmJs 到 web worker 驱动的支持 (#5534 by @IlyaGulya)
- [PostgreSQL Dialect] 支持 PostgreSQL 将数组平铺到行 (#5673 by @griffio)
- [PostgreSQL Dialect] PostgreSQL TSRANGE/TSTZRANGE 支持 (#5297 by @griffio)
- [PostgreSQL Dialect] PostgreSQL Right Full Join (#5086 by @griffio)
- [PostgreSQL Dialect] PostgreSQL 从时间类型中提取 (#5273 by @griffio)
- [PostgreSQL Dialect] PostgreSQL 数组包含操作符 (#4933 by @griffio)
- [PostgreSQL Dialect] PostgreSQL DROP CONSTRAINT (#5288 by @griffio)
- [PostgreSQL Dialect] PostgreSQL 类型转换 (#5089 by @griffio)
- [PostgreSQL Dialect] PostgreSQL 子查询的 LATERAL JOIN 操作符 (#5122 by @griffio)
- [PostgreSQL Dialect] PostgreSQL ILIKE 操作符 (#5330 by @griffio)
- [PostgreSQL Dialect] PostgreSQL XML 类型 (#5331 by @griffio)
- [PostgreSQL Dialect] PostgreSQL AT TIME ZONE (#5243 by @griffio)
- [PostgreSQL Dialect] 支持 PostgreSQL ORDER BY NULLS (#5199 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSQL 当前日期/时间函数支持 (#5226 by @drewd)
- [PostgreSQL Dialect] PostgreSQL Regex 操作符 (#5137 by @griffio)
- [PostgreSQL Dialect] 添加 brin gist (#5059 by @griffio)
- [MySQL Dialect] 支持 MySQL 方言的 RENAME INDEX (#5212 by @orenkislev-faire)
- [JSON Extension] 为 JSON 表函数添加别名 (#5372 by @griffio)

### 变更
- [Compiler] 生成的查询文件为简单修改器返回行计数 (#4578 by @MariusVolkhart)
- [Native Driver] 更新 NativeSqlDatabase.kt 以更改 DELETE、INSERT 和 UPDATE 语句的只读标志 (#5680 by @griffio)
- [PostgreSQL Dialect] 将 PgInterval 更改为 String (#5403 by @griffio)
- [PostgreSQL Dialect] 支持 SqlDelight 模块实现 PostgreSQL 扩展 (#5677 by @griffio)

### 修复
- [Compiler] 修复：执行带结果的分组语句时通知查询 (#5006 by @vitorhugods)
- [Compiler] 修复 SqlDelightModule 类型解析器 (#5625 by @griffio)
- [Compiler] 修复 5501 插入对象转义列 (#5503 by @griffio)
- [Compiler] 编译器：改进错误消息，使路径链接可点击并显示正确的行和字符位置 (#5604 by @vanniktech)
- [Compiler] 修复问题 5298：允许关键字用作表名
- [Compiler] 修复命名执行并添加测试
- [Compiler] 在排序初始化语句时考虑外键表约束 (#5325 by @TheMrMilchmann)
- [Compiler] 在涉及制表符时正确对齐错误下划线 (#5224 by @drewd)
- [JDBC Driver] 修复 connectionManager 在事务结束时的内存泄漏
- [JDBC Driver] 如文档所述，在事务中运行 SQLite 迁移 (#5218 by @morki)
- [JDBC Driver] 修复事务提交/回滚后连接泄漏 (#5205 by @morki)
- [Gradle Plugin] 在 `GenerateSchemaTask` 之前执行 `DriverInitializer` (#5562 by @nwagu)
- [Runtime] 修复 LogSqliteDriver 在实际驱动为异步时的崩溃 (#5723 by @edenman)
- [Runtime] 修复 StringBuilder 容量 (#5192 by @janbina)
- [PostgreSQL Dialect] PostgreSQL CREATE OR REPLACE VIEW (#5407 by @griffio)
- [PostgreSQL Dialect] PostgreSQL to_json (#5606 by @griffio)
- [PostgreSQL Dialect] PostgreSQL 数值解析器 (#5399 by @griffio)
- [PostgreSQL Dialect] SQLite Window 函数 (#2799 by @griffio)
- [PostgreSQL Dialect] PostgreSQL SELECT DISTINCT ON (#5345 by @griffio)
- [PostgreSQL Dialect] ALTER TABLE ADD COLUMN IF NOT EXISTS (#5309 by @griffio)
- [PostgreSQL Dialect] PostgreSQL 异步绑定形参 (#5313 by @griffio)
- [PostgreSQL Dialect] PostgreSQL 布尔字面量 (#5262 by @griffio)
- [PostgreSQL Dialect] PostgreSQL Window 函数 (#5155 by @griffio)
- [PostgreSQL Dialect] PostgreSQL isNull isNotNull 类型 (#5173 by @griffio)
- [PostgreSQL Dialect] PostgreSQL SELECT DISTINCT (#5172 by @griffio)
- [Paging Extension] Paging 刷新初始加载修复 (#5615 by @evant)
- [Paging Extension] 添加 MacOS 原生目标 (#5324 by @vitorhugods)
- [IntelliJ Plugin] K2 Support

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 新增
- [PostgreSQL Dialect] 添加 PostgreSQL STRING_AGG 函数 (#4950 by @anddani)
- [PostgreSQL Dialect] 为 PG 方言添加 SET 语句 (#4927 by @de-luca)
- [PostgreSQL Dialect] 添加 PostgreSQL alter column sequence 形参 (#4916 by @griffio)
- [PostgreSQL Dialect] 为 INSERT 语句添加 PostgreSQL alter column default 支持 (#4912 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSQL alter sequence and drop sequence (#4920 by @griffio)
- [PostgreSQL Dialect] 添加 Postgres Regex 函数定义 (#5025 by @MariusVolkhart)
- [PostgreSQL Dialect] 为 GIN 添加语法 (#5027 by @griffio)

### 变更
- [IDE Plugin] 最低版本 2023.1 / Android Studio Iguana
- [Compiler] 允许在 encapsulatingType 中覆盖类型可空性 (#4882 by @eygraber)
- [Compiler] 内联 SELECT * 的列名
- [Gradle Plugin] 切换到 processIsolation (#5068 by @nwagu)
- [Android Runtime] 将 Android minSDK 提高到 21 (#5094 by @hfhbd)
- [Drivers] 为方言作者暴露更多 JDBC/R2DBC 语句方法 (#5098 by @hfhbd)

### 修复
- [PostgreSQL Dialect] 修复 PostgreSQL alter table alter column (#4868 by @griffio)
- [PostgreSQL Dialect] 修复 4448 表模型缺失导入 (#4885 by @griffio)
- [PostgreSQL Dialect] 修复 4932 PostgreSQL default constraint 函数 (#4934 by @griffio)
- [PostgreSQL Dialect] 修复 4879 PostgreSQL ClassCastError 在迁移期间的 alter table rename column (#4880 by @griffio)
- [PostgreSQL Dialect] 修复 4474 PostgreSQL CREATE EXTENSION (#4541 by @griffio)
- [PostgreSQL Dialect] 修复 5018 PostgreSQL ADD PRIMARY KEY 非空的类型 (#5020 by @griffio)
- [PostgreSQL Dialect] 修复 4703 聚合表达式 (#5071 by @griffio)
- [PostgreSQL Dialect] 修复 5028 PostgreSQL JSON (#5030 by @griffio)
- [PostgreSQL Dialect] 修复 5040 PostgreSQL JSON 操作符 (#5041 by @griffio)
- [PostgreSQL Dialect] 修复 5040 的 JSON 操作符绑定 (#5100 by @griffio)
- [PostgreSQL Dialect] 修复 5082 tsvector (#5104 by @griffio)
- [PostgreSQL Dialect] 修复 5032 PostgreSQL UPDATE FROM 语句的列相邻问题 (#5035 by @griffio)
- [SQLite Dialect] 修复 4897 SQLite alter table rename column (#4899 by @griffio)
- [IDE Plugin] 修复错误处理器崩溃 (#4988 by @aperfilyev)
- [IDE Plugin] BugSnag 未能在 IDEA 2023.3 中初始化 (by @aperfilyev)
- [IDE Plugin] PluginException 当在 IntelliJ 中通过插件打开 .sq 文件时 (#5126)
- [IDE Plugin] 不将 Kotlin lib 打包到 IntelliJ 插件中，因为它已经是插件依赖项 (#5126)
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
- [PostgreSQL Dialect] 将 PostgreSQL 时间类型添加到 SqlBinaryExpr (#4657 by @griffio)
- [PostgreSQL Dialect] 将 TRUNCATE 添加到 Postgres 方言 (#4817 by @de-luca)
- [SQLite 3.35 Dialect] 允许按顺序求值的多个 ON CONFLICT 子句 (#4551 by @griffio)
- [JDBC Driver] 添加 Language 注解以实现更愉快的 SQL 编辑 (#4602 by @MariusVolkhart)
- [Native Driver] 原生驱动：添加对 linuxArm64 的支持 (#4792 by @hfhbd)
- [Android Driver] 为 AndroidSqliteDriver 添加 windowSizeBytes 形参 (#4804 by @BoD)
- [Paging3 Extension] 特性：为 OffsetQueryPagingSource 添加 initialOffset (#4802 by @MohamadJaara)

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
- [IDE Plugin] 如果已设置，则使用 IDEA 项目 JDK (#4689 by @griffio)
- [IDE Plugin] 修复 IDEA 2023.2 及更高版本中的“Unknown element type: TYPE_NAME”错误 (#4727)
- [IDE Plugin] 修复了与 2023.2 的一些兼容性问题
- [Gradle Plugin] 更正 verifyMigrationTask Gradle 任务的文档 (#4713 by @joshfriend)
- [Gradle Plugin] 添加 Gradle 任务输出消息以帮助用户在验证数据库之前生成数据库 (#4684 by @jingwei99)
- [PostgreSQL Dialect] 修复 PostgreSQL 列的多次重命名问题 (#4566 by @griffio)
- [PostgreSQL Dialect] 修复 4714 PostgreSQL alter column nullability (#4831 by @griffio)
- [PostgreSQL Dialect] 修复 4837 alter table alter column (#4846 by @griffio)
- [PostgreSQL Dialect] 修复 4501 PostgreSQL sequence (#4528 by @griffio)
- [SQLite Dialect] 允许 JSON 二进制操作符用于列表达式 (#4776 by @eygraber)
- [SQLite Dialect] UPDATE FROM 对于发现的多个同名列存在误报 (#4777 by @eygraber)
- [Native Driver] 支持命名内存数据库 (#4662 by @05nelsonm)
- [Native Driver] 确保查询监听器集合的线程安全 (#4567 by @kpgalligan)
- [JDBC Driver] 修复 ConnectionManager 中的连接泄漏 (#4589 by @MariusVolkhart)
- [JDBC Driver] 修复 JdbcSqliteDriver URL 解析当选择 ConnectionManager 类型时 (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 新增
- [MySQL Dialect] MySQL：支持 IF 表达式中的 timestamp/bigint (#4329 by @shellderp)
- [MySQL Dialect] MySQL：添加 NOW (#4431 by @hfhbd)
- [Web Driver] 启用 NPM 包发布 (#4364)
- [IDE Plugin] 允许用户在 Gradle Tooling 连接失败时显示堆栈跟踪 (#4383)

### 变更
- [Sqlite Driver] 简化 JdbcSqliteDriver 使用 schema 迁移 (#3737 by @morki)
- [R2DBC Driver] 真实的异步 R2DBC cursor (#4387 by @hfhbd)

### 修复
- [IDE Plugin] 在需要之前不要实例化数据库项目服务 (#4382)
- [IDE Plugin] 处理查找使用期间的进程取消 (#4340)
- [IDE Plugin] 修复 IDE 异步代码生成 (#4406)
- [IDE Plugin] 将包结构的组装移动到一次性计算并在 EDT 之外执行 (#4417)
- [IDE Plugin] 在 2023.2 上使用正确的 stub 索引键进行 Kotlin 类型解析 (#4416)
- [IDE Plugin] 等待索引就绪后再执行搜索 (#4419)
- [IDE Plugin] 如果索引不可用，则不执行跳转 (#4420)
- [Compiler] 修复分组语句的结果表达式 (#4378)
- [Compiler] 不要将虚拟表用作接口类型 (#4427 by @hfhbd)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 新增
- [MySQL Dialect] 支持小写日期类型以及日期类型的 min 和 max (#4243 by @shellderp)
- [MySQL Dialect] 支持 MySQL 二进制表达式和 sum 类型 (#4254 by @shellderp)
- [MySQL Dialect] 支持没有显示宽度的无符号 int (#4306 by @shellderp)
- [MySQL Dialect] 支持 LOCK IN SHARED MODE
- [PostgreSQL Dialect] 添加 boolean 和 Timestamp 到 min max (#4245 by @griffio)
- [PostgreSQL Dialect] Postgres：添加 Window 函数支持 (#4283 by @hfhbd)
- [Runtime] 添加 linuxArm64、androidNative 和 watchosDeviceArm 目标到运行时 (#4258 by @hfhbd)
- [Paging Extension] 为 Paging 扩展添加 linux 和 mingw x64 目标 (#4280 by @chippmann)

### 变更
- [Gradle Plugin] 为 Android API 34 添加自动方言支持 (#4251)
- [Paging Extension] 添加对 QueryPagingSource 中 SuspendingTransacter 的支持 (#4292 by @daio)
- [Runtime] 改进 addListener API (#4244 by @hfhbd)
- [Runtime] 使用 Long 作为迁移版本 (#4297 by @hfhbd)

### 修复
- [Gradle Plugin] 为生成的源使用稳定的输出路径 (#4269 by @joshfriend)
- [Gradle Plugin] Gradle 调整 (#4222 by @3flex)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 新增
- [Paging] 为 Paging 扩展添加 JS 浏览器目标 (#3843 by @sproctor)
- [Paging] 为 androidx-paging3 扩展添加 iosSimulatorArm64 目标 (#4117)
- [PostgreSQL Dialect] 添加对 gen_random_uuid() 的支持和测试 (#3855 by @davidwheeler123)
- [PostgreSQL Dialect] ALTER TABLE ADD CONSTRAINT PostgreSQL (#4116 by @griffio)
- [PostgreSQL Dialect] ALTER TABLE ADD CONSTRAINT CHECK (#4120 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSQL 字符长度函数 (#4121 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSQL 列默认区间 (#4142 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSQL 区间列结果 (#4152 by @griffio)
- [PostgreSQL Dialect] 添加 PostgreSQL ALTER COLUMN (#4165 by @griffio)
- [PostgreSQL Dialect] PostgreSQL: 添加 date_part (#4198 by @hfhbd)
- [MySQL Dialect] 添加 SQL CHAR LENGTH 函数 (#4134 by @griffio)
- [IDE Plugin] 添加 sqldelight 目录建议 (#3976 by @aperfilyev)
- [IDE Plugin] 在项目树中压缩中间包 (#3992 by @aperfilyev)
- [IDE Plugin] 添加 JOIN 子句自动补全 (#4086 by @aperfilyev)
- [IDE Plugin] 创建 View 意图和实时模板 (#4074 by @aperfilyev)
- [IDE Plugin] 警告 DELETE 或 UPDATE 中缺少 WHERE 子句 (#4058 by @aperfilyev)
- [Gradle Plugin] 启用类型安全项目访问器 (#4005 by @hfhbd)

### 变更
- [Gradle Plugin] 允许使用 ServiceLoader 机制为 VerifyMigrationTask 注册 DriverInitializer (#3986 by @C2H6O)
- [Gradle Plugin] 创建显式编译器 env (#4079 by @hfhbd)
- [JS Driver] 将 web worker 驱动拆分为单独的构件 artifact
- [JS Driver] 不暴露 JsWorkerSqlCursor (#3874 by @hfhbd)
- [JS Driver] 禁用 sqljs 驱动的发布 (#4108)
- [Runtime] 强制同步驱动需要同步 schema 初始化器 (#4013)
- [Runtime] 改进 Cursors 的异步支持 (#4102)
- [Runtime] 移除已弃用的目标 (#4149 by @hfhbd)
- [Runtime] 移除对旧 MM 的支持 (#4148 by @hfhbd)

### 修复
- [R2DBC Driver] R2DBC: 等待关闭驱动 (#4139 by @hfhbd)
- [Compiler] 将迁移中的 PRAGMA 包含在数据库创建 (SqlDriver) 中 (#3845 by @MariusVolkhart)
- [Compiler] 修复 RETURNING 子句的代码生成 (#3872 by @MariusVolkhart)
- [Compiler] 不为虚拟表生成类型 (#4015)
- [Gradle Plugin] 小幅 Gradle 插件质量改进 (#3930 by @zacsweers)
- [IDE Plugin] 修复未解析的 Kotlin 类型 (#3924 by @aperfilyev)
- [IDE Plugin] 修复展开通配符意图以与限定符一起使用 (#3979 by @aperfilyev)
- [IDE Plugin] 如果 Java HOME 缺失，则使用可用 JDK (#3925 by @aperfilyev)
- [IDE Plugin] 修复包名查找使用 (#4010)
- [IDE Plugin] 不显示无效元素的自动导入 (#4008)
- [IDE Plugin] 如果缺少方言，则不解析 (#4009)
- [IDE Plugin] 忽略编译器在失效状态下的 IDE 运行 (#4016)
- [IDE Plugin] 添加对 IntelliJ 2023.1 的支持 (#4037 by @madisp)
- [IDE Plugin] 在列重命名时重命名命名实参 usage (#4027 by @aperfilyev)
- [IDE Plugin] 修复添加迁移弹出窗口 (#4105 by @aperfilyev)
- [IDE Plugin] 在迁移文件中禁用 SchemaNeedsMigrationInspection (#4106 by @aperfilyev)
- [IDE Plugin] 使用 SQL 列名而不是类型名进行迁移生成 (#4112 by @aperfilyev)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 新增
- [Paging] 多平台 Paging 扩展 (by @jeffdgr8)
- [Runtime] 为 Listener 接口添加 fun 修饰符。
- [SQLite Dialect] 添加 SQLite 3.33 支持 (UPDATE FROM) (by @eygraber)
- [PostgreSQL Dialect] 支持 PostgreSQL 中的 UPDATE FROM (by @eygraber)

### 变更
- [RDBC Driver] 暴露连接 (by @hfhbd)
- [Runtime] 将迁移回调移动到 main `migrate` 函数中
- [Gradle Plugin] 向下游项目隐藏 Configurations
- [Gradle Plugin] 仅着色 Intellij (by @hfhbd)
- [Gradle Plugin] 支持 Kotlin 1.8.0-Beta 并添加多版本 Kotlin 检测 (by @hfhbd)

### 修复
- [RDBC Driver] 使用 javaObjectType 而不是 (by @hfhbd)
- [RDBC Driver] 修复 bindStatement 中的原始 null 值 (by @hfhbd)
- [RDBC Driver] 支持 R2DBC 1.0 (by @hfhbd)
- [PostgreSQL Dialect] Postgres: 修复不带类型形参的数组 (by @hfhbd)
- [IDE Plugin] 将 IntelliJ 提升到 221.6008.13 (by @hfhbd)
- [Compiler] 从纯 View 解析递归源表 (by @hfhbd)
- [Compiler] 使用表外键子句中的值类 (by @hfhbd)
- [Compiler] 修复 SelectQueryGenerator 以支持不带圆括号的绑定表达式 (by @bellatoris)
- [Compiler] 修复使用事务时重复生成 ${name}Indexes 变量的问题 (by @sachera)

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
- [HSQL Dialect] HSQL: 支持在 INSERT 中使用 DEFAULT 用于生成列 (#3372 by @hfhbd)
- [PostgreSQL Dialect] PostgreSQL: 支持在 INSERT 中使用 DEFAULT 用于生成列 (#3373 by @hfhbd)
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
- [HSQL Dialect] 修复使用 HSQL 导致 SQLite VerifyMigrationTask 失败 (#3380 by @hfhbd)
- [Gradle Plugin] 将任务转换为使用 Gradle 的惰性配置 API (by @3flex)
- [Gradle Plugin] 避免 Kotlin 1.7.20 中的 NPE (#3398 by @ZacSweers)
- [Gradle Plugin] 修复 squash migrations 任务的描述 (#3449)
- [IDE Plugin] 修复较新 Kotlin 插件中的 NoSuchFieldError (#3422 by @madisp)
- [IDE Plugin] IDEA: UnusedQueryInspection - 修复 ArrayIndexOutOfBoundsException。 (#3427 by @vanniktech)
- [IDE Plugin] 为旧 Kotlin 插件引用使用反射
- [Compiler] 带有扩展函数的自定义方言不创建导入 (#3338 by @hfhbd)
- [Compiler] 修复转义 CodeBlock.of("${CodeBlock.toString()}") (#3340 by @hfhbd)
- [Compiler] 迁移中等待异步执行语句 (#3352)
- [Compiler] 修复 AS (#3370 by @hfhbd)
- [Compiler] `getObject` 方法支持自动填充实际类型。 (#3401 by @robxyy)
- [Compiler] 修复异步分组返回语句的代码生成 (#3411)
- [Compiler] 如果可能，推断绑定形参的 Kotlin 类型，否则抛出更好的错误消息 (#3413 by @hfhbd)
- [Compiler] 不允许 ABS("foo") (#3430 by @hfhbd)
- [Compiler] 支持从其他形参推断 Kotlin 类型 (#3431 by @hfhbd)
- [Compiler] 始终创建数据库实现 (#3540 by @hfhbd)
- [Compiler] 放宽 JavaDoc 并将其添加到自定义 mapper 函数中 (#3554 @hfhbd)
- [Compiler] 修复绑定中的 DEFAULT (by @hfhbd)
- [Paging] 修复 Paging 3 (#3396)
- [Paging] 允许使用 Long 构造 OffsetQueryPagingSource (#3409)
- [Paging] 不静态交换 Dispatchers.Main (#3428)

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
- `AfterVersionWithDriver` 类型已被移除，取而代之的是 `AfterVersion`，后者现在总是带有驱动。
- `Schema` 类型不再是 `SqlDriver` 的子类型。
- `PreparedStatement` API 现在以零为基数的索引调用。

### 新增
- [IDE Plugin] 添加了针对运行中数据库运行 SQLite、MySQL 和 PostgreSQL 命令的支持 (#2718 by @aperfilyev)
- [IDE Plugin] 添加了对 Android Studio DB 探查器的支持 (#3107 by @aperfilyev)
- [Runtime] 添加了对异步驱动的支持 (#3168 by @dellisd)
- [Native Driver] 支持新的 Kotlin 原生内存模型 (#3177 by @kpgalligan)
- [JS Driver] 为 SqlJs worker 添加了驱动 (#3203 by @dellisd)
- [Gradle Plugin] 暴露 SQLDelight 任务的 classpath
- [Gradle Plugin] 添加了一个用于压缩迁移的 Gradle 任务
- [Gradle Plugin] 添加了一个标志以在迁移检测期间忽略 schema 定义
- [MySQL Dialect] 支持 MySQL 中的 FOR SHARE 和 FOR UPDATE (#3098)
- [MySQL Dialect] 支持 MySQL 索引提示 (#3099)
- [PostgreSQL Dialect] 添加 date_trunc (#3295 by @hfhbd)
- [JSON Extensions] 支持 JSON 表函数 (#3090)

### 变更
- [Runtime] 移除不带驱动的 AfterVersion 类型 (#3091)
- [Runtime] 将 Schema 类型移动到顶层
- [Runtime] 开放方言和解析器以支持第三方实现 (#3232 by @hfhbd)
- [Compiler] 在失败报告中包含用于编译的方言 (#3086)
- [Compiler] 跳过未使用的适配器 (#3162 by @eygraber)
- [Compiler] 在 PrepareStatement 中使用零基索引 (#3269 by @hfhbd)
- [Gradle Plugin] 也使方言成为正确的 Gradle 依赖项而不是字符串 (#3085)
- [Gradle Plugin] Gradle 验证任务：当数据库文件缺失时抛出异常 (#3126 by @vanniktech)

### 修复
- [Gradle Plugin] 对 Gradle 插件进行小幅清理和调整 (#3171 by @3flex)
- [Gradle Plugin] 不使用 AGP 字符串作为生成的目录
- [Gradle Plugin] 使用 AGP namespace 属性 (#3220)
- [Gradle Plugin] 不将 kotlin-stdlib 作为 Gradle 插件的运行时依赖项 (#3245 by @mbonnin)
- [Gradle Plugin] 简化多平台配置 (#3246 by @mbonnin)
- [Gradle Plugin] 支持 JS only 项目 (#3310 by @hfhbd)
- [IDE Plugin] 使用 Java HOME 用于 Gradle Tooling API (#3078)
- [IDE Plugin] 在 IDE 插件中将 JDBC 驱动加载到正确的 classLoader 上 (#3080)
- [IDE Plugin] 在失效之前将文件元素标记为 null，以避免在已经存在的 PSI 更改期间出现错误 (#3082)
- [IDE Plugin] 在 ALTER TABLE 语句中查找新表名的使用时不会崩溃 (#3106)
- [IDE Plugin] 优化探查器并使其能够针对预期异常类型静默失败 (#3121)
- [IDE Plugin] 删除应为生成目录的文件 (#3198)
- [IDE Plugin] 修复一个不安全的操作符调用
- [Compiler] 确保带有 RETURNING 语句的更新和删除执行查询。 (#3084)
- [Compiler] 正确推断复合 SELECT 中的实参类型 (#3096)
- [Compiler] 公共表不生成 data class，因此不返回它们 (#3097)
- [Compiler] 更快地找到顶层迁移文件 (#3108)
- [Compiler] 正确继承管道操作符上的可空性
- [Compiler] 支持 IIF ANSI SQL 函数
- [Compiler] 不生成空的查询文件 (#3300 by @hfhbd)
- [Compiler] 修复只带问号的适配器 (#3314 by @hfhbd)
- [PostgreSQL Dialect] PostgreSQL 主键列始终非空 (#3092)
- [PostgreSQL Dialect] 修复多个表中同名复制的问题 (#3297 by @hfhbd)
- [SQLite 3.35 Dialect] 仅在从 ALTERED TABLE 中删除索引列时显示错误 (#3158 by @eygraber)

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
- [Compiler] 支持多更新语句
- [PostgreSQL] 支持 Postgres RETURNING 语句
- [PostgreSQL] 支持 Postgres 日期类型
- [PostgreSQL] 支持 PG 区间
- [PostgreSQL] 支持 PG 布尔类型并修复 ALTER TABLE 上的插入操作
- [PostgreSQL] 支持 Postgres 中的可选 LIMIT
- [PostgreSQL] 支持 PG BYTEA 类型
- [PostgreSQL] 添加 Postgres SERIAL 的测试
- [PostgreSQL] 支持 FOR UPDATE Postgres 语法
- [PostgreSQL] 支持 PostgreSQL 数组类型
- [PostgreSQL] 正确存储/检索 PG 中的 UUID 类型
- [PostgreSQL] 支持 PostgreSQL NUMERIC 类型 (#1882)
- [PostgreSQL] 支持公共表表达式中返回查询 (#2471)
- [PostgreSQL] 支持 JSON 特有的操作符
- [PostgreSQL] 添加 Postgres COPY (by @hfhbd)
- [MySQL] 支持 MySQL REPLACE
- [MySQL] 支持 NUMERIC/BigDecimal MySQL 类型 (#2051)
- [MySQL] 支持 MySQL TRUNCATE 语句
- [MySQL] 支持 MySQL 中的 JSON 特有的操作符 (by @eygraber)
- [MySQL] 支持 MySQL INTERVAL (#2969 by @eygraber)
- [HSQL] 添加 HSQL Window 功能
- [SQLite] 不替换 WHERE 中可空形参的相等检测 (#1490 by @eygraber)
- [SQLite] 支持 SQLite 3.35 RETURNING 语句 (#1490 by @eygraber)
- [SQLite] 支持 GENERATED 子句
- [SQLite] 添加对 SQLite 3.38 方言的支持 (by @eygraber)

### 变更
- [Compiler] 清理了部分生成的代码
- [Compiler] 禁止在分组语句中使用表形参 (#1822)
- [Compiler] 将分组查询放入事务中 (#2785)
- [Runtime] 从驱动的 execute 方法返回更新的行数
- [Runtime] 将 SqlCursor 限制在访问连接的临界区。 (#2123 by @andersio)
- [Gradle Plugin] 比较迁移的 schema 定义 (#841)
- [PostgreSQL] 不允许 PG 的双引号
- [MySQL] MySQL 中使用 == 时报错 (#2673)

### 修复
- [Compiler] 2.0 alpha 中不同表相同适配器类型导致编译错误
- [Compiler] UPSERT 语句编译问题 (#2791)
- [Compiler] 如果 SELECT 中存在多个匹配项，查询结果应使用 SELECT 中的表 (#1874, #2313)
- [Compiler] 支持更新具有 INSTEAD OF 触发器的视图 (#1018)
- [Compiler] 支持函数名中的 FROM 和 FOR
- [Compiler] 允许函数表达式中使用 SEPARATOR 关键字
- [Compiler] 无法访问 ORDER BY 中别名表的 ROWID
- [Compiler] 别名列名在 MySQL 的 HAVING 子句中无法识别
- [Compiler] 错误的“Multiple columns found”错误
- [Compiler] 无法设置 PRAGMA locking_mode = EXCLUSIVE;
- [PostgreSQL] PostgreSQL 重命名列
- [MySQL] UNIX_TIMESTAMP、TO_SECONDS、JSON_ARRAYAGG MySQL 函数无法识别
- [SQLite] 修复 SQLite Window 功能
- [IDE Plugin] 在空进度指示器中运行跳转处理器 (#2990)
- [IDE Plugin] 确保高亮访问器在项目未配置时不运行 (#2981, #2976)
- [IDE Plugin] 确保 IDE 中也更新传递生成的代码 (#1837)
- [IDE Plugin] 更新方言时使索引失效

## [2.0.0-alpha01] - 2022-03-31
[2.0.0-alpha01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha01

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

- 原生类型现在必须导入（例如 `INTEGER AS Boolean`，您必须 `import kotlin.Boolean`），一些先前支持的类型现在需要适配器。原生类型适配器可在 `app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` 中找到，用于大多数转换（例如 `IntColumnAdapter` 用于 `Integer AS kotlin.Int`）。

### 新增
- [IDE Plugin] 基本建议迁移 (by @aperfilyev)
- [IDE Plugin] 添加导入提示动作 (by @aperfilyev)
- [IDE Plugin] 添加 Kotlin 类补全 (by @aperfilyev)
- [Gradle Plugin] 为 Gradle 类型安全项目访问器添加快捷方式 (by @hfhbd)
- [Compiler] 根据方言自定义代码生成 (by @MariusVolkhart)
- [JDBC Driver] 为 JdbcDriver 添加公共类型 (by @MariusVolkhart)
- [SQLite] 添加对 SQLite 3.35 的支持 (by @eygraber)
- [SQLite] 添加对 ALTER TABLE DROP COLUMN 的支持 (by @eygraber)
- [SQLite] 添加对 SQLite 3.30 方言的支持 (by @eygraber)
- [SQLite] 支持 SQLite 中的 NULLS FIRST/LAST (by @eygraber)
- [HSQL] 添加 HSQL 对 GENERATED 子句的支持 (by @MariusVolkhart)
- [HSQL] 添加对 HSQL 中命名形参的支持 (by @MariusVolkhart)
- [HSQL] 自定义 HSQL 插入查询 (by @MariusVolkhart)

### 变更
- [所有] 包名已从 com.squareup.sqldelight 更改为 app.cash.sqldelight。
- [Runtime] 将方言移到其自身的独立 gradle 模块
- [Runtime] 切换到驱动实现的查询通知。
- [Runtime] 提取默认列适配器到单独模块 (#2056, #2060)
- [Compiler] 让模块生成查询实现，而不是在每个模块中重复生成
- [Compiler] 移除生成的 data class 中自定义 toString 的生成。(by @PaulWoitaschek)
- [JS Driver] 从 sqljs-driver 移除 sql.js 依赖项 (by @dellisd)
- [Paging] 移除 Android Paging 2 扩展
- [IDE Plugin] 在 SQLDelight 同步时添加编辑器横幅 (#2511)
- [IDE Plugin] 最低支持 IntelliJ 版本为 2021.1

### 修复
- [Runtime] 扁平化监听器列表以减少内存分配和指针追逐。(by @andersio)
- [IDE Plugin] 修复错误消息以允许跳转到错误 (by @hfhbd)
- [IDE Plugin] 添加缺失的探查描述 (#2768 by @aperfilyev)
- [IDE Plugin] 修复 GotoDeclarationHandler 中的异常 (#2531, #2688, #2804 by @aperfilyev)
- [IDE Plugin] 高亮 import 关键字 (by @aperfilyev)
- [IDE Plugin] 修复未解析的 Kotlin 类型 (#1678 by @aperfilyev)
- [IDE Plugin] 修复未解析包的高亮显示 (#2543 by @aperfilyev)
- [IDE Plugin] 如果项目索引尚未初始化，请勿尝试探查不匹配的列
- [IDE Plugin] 如果 Gradle 同步开始，则取消 SQLDelight 导入
- [IDE Plugin] 在执行撤销操作的线程之外重新生成数据库
- [IDE Plugin] 如果无法解析引用，则使用空白 Java 类型
- [IDE Plugin] 在文件解析期间正确地离开主线程，并且只在写入时返回
- [IDE Plugin] 改进与旧 IntelliJ 版本的兼容性 (by @3flex)
- [IDE Plugin] 使用更快的注解 API
- [Gradle Plugin] 注册迁移输出任务而不从迁移中派生 schema (#2744 by @kevincianfarini)
- [Gradle Plugin] 如果迁移任务崩溃，则打印其崩溃运行的文件
- [Gradle Plugin] 生成代码时对文件进行排序以确保幂等输出 (by @ZacSweers)
- [Compiler] 使用更快的 API 遍历文件，并且不探查整个 PSI 图
- [Compiler] 为 SELECT 函数形参添加关键字名字修饰 (#2759 by @aperfilyev)
- [Compiler] 修复 migration adapter 的 packageName (by @hfhbd)
- [Compiler] 在属性而非类型上发出注解 (#2798 by @aperfilyev)
- [Compiler] 在传递给 Query 子类型之前对实参进行排序 (#2379 by @aperfilyev)

## [1.5.3] - 2021-11-23
[1.5.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.3

### 新增
- [JDBC Driver] 开放 JdbcDriver 以支持第三方驱动实现 (#2672 by @hfhbd)
- [MySQL Dialect] 添加缺失的时间增量函数 (#2671 by @sdoward)
- [Coroutines Extension] 为 coroutines-extensions 添加 M1 目标 (by @PhilipDukhov)

### 变更
- [Paging3 Extension] 将 sqldelight-android-paging3 作为 JAR 而非 AAR 发布 (#2634 by @julioromano)
- 如果属性名也是软关键字，现在将以 `_` 为后缀。例如 `value` 将暴露为 `value_`

### 修复
- [Compiler] 不为重复的数组形参提取变量 (by @aperfilyev)
- [Gradle Plugin] 添加 kotlin.mpp.enableCompatibilityMetadataVariant。 (#2628 by @martinbonnin)
- [IDE Plugin] Find usages 处理需要读取操作

## [1.5.2] - 2021-10-12
[1.5.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.2

### 新增
- [Gradle Plugin] HMPP 支持 (#2548 by @martinbonnin)
- [IDE Plugin] 添加 NULL 比较探查 (by @aperfilyev)
- [IDE Plugin] 添加探查抑制器 (#2519 by @aperfilyev)
- [IDE Plugin] 混合命名形参和位置形参探查 (by @aperfilyev)
- [SQLite Driver] 添加 mingwX86 目标。 (#2558 by @enginegl)
- [SQLite Driver] 添加 M1 目标
- [SQLite Driver] 添加 linuxX64 支持 (#2456 by @chippmann)
- [MySQL Dialect] 为 MySQL 添加 ROW_COUNT 函数 (#2523)
- [PostgreSQL Dialect] PostgreSQL 重命名、删除列 (by @pabl0rg)
- [PostgreSQL Dialect] PostgreSQL 语法无法识别 CITEXT
- [PostgreSQL Dialect] 包含 TIMESTAMP WITH TIME ZONE 和 TIMESTAMPTZ
- [PostgreSQL Dialect] 为 PostgreSQL GENERATED 列添加语法
- [Runtime] 将 SqlDriver 作为形参提供给 AfterVersion (#2534, 2614 by @ahmedre)

### 变更
- [Gradle Plugin] 明确要求 Gradle 7.0 (#2572 by @martinbonnin)
- [Gradle Plugin] 使 VerifyMigrationTask 支持 Gradle 的最新检测 (#2533 by @3flex)
- [IDE Plugin] 当连接可空类型与非空类型时，不发出“Join compares two columns of different types”警告 (#2550 by @pchmielowski)
- [IDE Plugin] 澄清列类型中小写 'AS' 的错误 (by @aperfilyev)

### 修复
- [IDE Plugin] 如果项目已被处置，则不使用新方言重新解析 (#2609)
- [IDE Plugin] 如果关联的虚拟文件为 null，则模块为 null (#2607)
- [IDE Plugin] 避免在无用查询探查期间崩溃 (#2610)
- [IDE Plugin] 在写入操作中运行数据库同步写入 (#2605)
- [IDE Plugin] 让 IDE 调度 SQLDelight 同步
- [IDE Plugin] 修复 JavaTypeMixin 中的 NPE (#2603 by @aperfilyev)
- [IDE Plugin] 修复 MismatchJoinColumnInspection 中的 IndexOutOfBoundsException (#2602 by @aperfilyev)
- [IDE Plugin] 为 UnusedColumnInspection 添加描述 (#2600 by @aperfilyev)
- [IDE Plugin] 将 PsiElement.generatedVirtualFiles 包装到读取操作中 (#2599 by @aperfilyev)
- [IDE Plugin] 移除不必要的非空转换 (#2596)
- [IDE Plugin] 正确处理查找使用中的 null 值 (#2595)
- [IDE Plugin] 修复 Android 生成文件的 IDE 自动补全 (#2573 by @martinbonnin)
- [IDE Plugin] 修复 SqlDelightGotoDeclarationHandler 中的 NPE (by @aperfilyev)
- [IDE Plugin] 在 INSERT 语句中对实参中的 Kotlin 关键字进行名字修饰 (#2433 by @aperfilyev)
- [IDE Plugin] 修复 SqlDelightFoldingBuilder 中的 NPE (#2382 by @aperfilyev)
- [IDE Plugin] 在 CopyPasteProcessor 中捕获 ClassCastException (#2369 by @aperfilyev)
- [IDE Plugin] 修复 UPDATE 实时模板 (by @IliasRedissi)
- [IDE Plugin] 为意图动作添加描述 (#2489 by @aperfilyev)
- [IDE Plugin] 修复 CreateTriggerMixin 中表未找到时的异常 (by @aperfilyev)
- [Compiler] 对表创建语句进行拓扑排序
- [Compiler] 停止在目录上调用 `forDatabaseFiles` 回调 (#2532)
- [Gradle Plugin] 将 generateDatabaseInterface 任务依赖项传播到潜在消费者 (#2518 by @martinbonnin)

## [1.5.1] - 2021-07-16
[1.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.1

### 新增
- [PostgreSQL Dialect] PostgreSQL JSONB 和 ON CONFLICT DO NOTHING (by @satook)
- [PostgreSQL Dialect] 添加对 PostgreSQL ON CONFLICT (column, ...) DO UPDATE 的支持 (by @satook)
- [MySQL Dialect] 支持 MySQL 生成列 (by @JGulbronson)
- [Native Driver] 添加 watchosX64 支持
- [IDE Plugin] 添加形参类型和注解 (by @aperfilyev)
- [IDE Plugin] 添加生成“SELECT ALL”查询的动作 (by @aperfilyev)
- [IDE Plugin] 在自动补全中显示列类型 (by @aperfilyev)
- [IDE Plugin] 为自动补全添加图标 (by @aperfilyev)
- [IDE Plugin] 添加生成“SELECT BY PRIMARY KEY”查询的动作 (by @aperfilyev)
- [IDE Plugin] 添加生成“INSERT INTO”查询的动作 (by @aperfilyev)
- [IDE Plugin] 为列名、语句标识符、函数名添加高亮 (by @aperfilyev)
- [IDE Plugin] 添加剩余的查询生成动作 (#489 by @aperfilyev)
- [IDE Plugin] 显示 INSERT 语句的形参提示 (by @aperfilyev)
- [IDE Plugin] 表别名意图动作 (by @aperfilyev)
- [IDE Plugin] 限定列名意图 (by @aperfilyev)
- [IDE Plugin] 跳转到 Kotlin 属性声明 (by @aperfilyev)

### 变更
- [Native Driver] 改进原生事务性能，通过在可能时避免冻结和可共享数据结构 (by @andersio)
- [Paging 3] 将 Paging3 版本提升到 3.0.0 稳定版
- [JS Driver] 将 sql.js 升级到 1.5.0

### 修复
- [JDBC SQLite Driver] 在清除 ThreadLocal 之前调用连接上的 close() (#2444 by @hannesstruss)
- [RX extensions] 修复订阅/处置竞争泄漏 (#2403 by @pyricau)
- [Coroutines extension] 确保我们在通知之前注册查询监听器
- [Compiler] 对 notifyQueries 进行排序以获得一致的 Kotlin 输出文件 (by @thomascjy)
- [Compiler] 不要使用 @JvmField 注解 SELECT 查询类的属性 (by @eygraber)
- [IDE Plugin] 修复导入优化器 (#2350 by @aperfilyev)
- [IDE Plugin] 修复无用列探查 (by @aperfilyev)
- [IDE Plugin] 为导入探查和类注解器添加嵌套类支持 (by @aperfilyev)
- [IDE Plugin] 修复 CopyPasteProcessor 中的 NPE (#2363 by @aperfilyev)
- [IDE Plugin] 修复 InlayParameterHintsProvider 中的崩溃 (#2359 by @aperfilyev)
- [IDE Plugin] 修复将任何文本复制粘贴到 CREATE TABLE 语句时插入空白行的问题 (#2431 by @aperfilyev)

## [1.5.0] - 2021-04-23
[1.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.0

### 新增
- [SQLite Javascript Driver] 启用 sqljs-driver 发布 (#1667 by @dellisd)
- [Paging3 Extension] Android Paging 3 库的扩展 (#1786 by @kevincianfarini)
- [MySQL Dialect] 添加对 MySQL 的 ON DUPLICATE KEY UPDATE 冲突解决的支持。(by @rharter)
- [SQLite Dialect] 添加编译器对 SQLite offsets() 的支持 (by @qjroberts)
- [IDE Plugin] 为未知类型添加导入快速修复 (#683 by @aperfilyev)
- [IDE Plugin] 添加无用导入探查 (#1161 by @aperfilyev)
- [IDE Plugin] 添加无用查询探查 (by @aperfilyev)
- [IDE Plugin] 添加无用列探查 (#569 by @aperfilyev)
- [IDE Plugin] 在复制/粘贴时自动导入 (#684 by @aperfilyev)
- [IDE Plugin] 当 Gradle/IntelliJ 插件版本不兼容时弹出一个气球提示
- [IDE Plugin] INSERT INTO ... VALUES(?) 形参提示 (#506 by @aperfilyev)
- [IDE Plugin] 内联形参提示 (by @aperfilyev)
- [Runtime] 在运行时包含一个用于运行带回调迁移的 API (#1844)

### 变更
- [Compiler] 智能转换“IS NOT NULL”查询 (#867)
- [Compiler] 防止在运行时失败的关键字 (#1471, #1629)
- [Gradle Plugin] 将 Gradle 插件大小从 60MB 减小到 13MB。
- [Gradle Plugin] 正确支持 Android 变体，并移除对 KMM 目标特有的 SQL 的支持 (#1039)
- [Gradle Plugin] 根据 minSDK 选择最低 SQLite 版本 (#1684)
- [Native Driver] 原生驱动连接池和性能更新

### 修复
- [Compiler] lambda 表达式前的 NBSP (by @oldergod)
- [Compiler] 修复生成的 bind* 和 cursor.get* 语句中不兼容的类型
- [Compiler] SQL 子句应保留适配的类型 (#2067)
- [Compiler] 只包含 NULL 关键字的列应为可空的
- [Compiler] 不生成带有类型注解的 mapper lambda 表达式 (#1957)
- [Compiler] 如果自定义查询发生冲突，则使用文件名作为额外的包后缀 (#1057, #1278)
- [Compiler] 确保外键级联导致查询监听器被通知 (#1325, #1485)
- [Compiler] 如果联合两个相同类型，则返回表类型 (#1342)
- [Compiler] 确保 ifnull 和 coalesce 的形参可以为空 (#1263)
- [Compiler] 正确使用查询强制的可空性来处理表达式
- [MySQL Dialect] 支持 MySQL IF 语句
- [PostgreSQL Dialect] 在 PostgreSQL 中将 NUMERIC 和 DECIMAL 检索为 Double (#2118)
- [SQLite Dialect] UPSERT 通知应考虑 BEFORE/AFTER UPDATE 触发器。 (#2198 by @andersio)
- [SQLite Driver] 在 SqliteDriver 中为线程使用多个连接，除非在内存中 (#1832)
- [JDBC Driver] JDBC Driver 假定 autoCommit 为 true (#2041)
- [JDBC Driver] 确保我们在异常时关闭连接 (#2306)
- [IDE Plugin] 修复因路径分隔符错误导致 Windows 上 GoToDeclaration/FindUsages 功能损坏 (#2054 by @angusholder)
- [IDE Plugin] 忽略 Gradle 错误，而不是在 IDE 中崩溃。
- [IDE Plugin] 如果 .sqldelight 文件移动到非 SQLDelight 模块，则不尝试代码生成
- [IDE Plugin] 忽略 IDE 中的代码生成错误
- [IDE Plugin] 确保我们不会尝试负子字符串 (#2068)
- [IDE Plugin] 还要确保在运行 Gradle 动作之前项目未被处置 (#2155)
- [IDE Plugin] 对可空类型进行算术运算也应是可空的 (#1853)
- [IDE Plugin] 使“expand * intention”与额外投影一起工作 (#2173 by @aperfilyev)
- [IDE Plugin] 如果在 GoTo 期间 Kotlin 解析失败，则不尝试跳转到 .sqldelight 文件
- [IDE Plugin] 如果 IntelliJ 在 SQLDelight 索引期间遇到异常，则不崩溃
- [IDE Plugin] 处理在 IDE 中代码生成前检测错误时发生的异常
- [IDE Plugin] 使 IDE 插件与动态插件兼容 (#1536)
- [Gradle Plugin] 使用 WorkerApi 生成数据库时的竞争条件 (#2062 by @stephanenicolas)
- [Gradle Plugin] classLoaderIsolation 阻止自定义 JDBC 使用 (#2048 by @benasher44)
- [Gradle Plugin] 改进缺失 packageName 错误消息 (by @vanniktech)
- [Gradle Plugin] SQLDelight 将 IntelliJ 依赖项泄漏到 buildscript 类路径 (#1998)
- [Gradle Plugin] 修复 Gradle 构建缓存 (#2075)
- [Gradle Plugin] Gradle 插件不依赖 kotlin-native-utils (by @ilmat192)
- [Gradle Plugin] 如果只有迁移文件，也要写入数据库 (#2094)
- [Gradle Plugin] 确保菱形依赖项在最终编译单元中只被拾取一次 (#1455)

此外，特别感谢 @3flex 在此版本中为改进 SQLDelight 基础设施所做的许多工作。

## [1.4.4] - 2020-10-08
[1.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.4

### 新增
- [PostgreSQL Dialect] 支持 WITH 子句中的数据修改语句
- [PostgreSQL Dialect] 支持 SUBSTRING 函数
- [Gradle Plugin] 添加 verifyMigrations 标志，用于在 SQLDelight 编译期间验证迁移 (#1872)

### 变更
- [Compiler] 在非 SQLite 方言中将 SQLite 特有的函数标记为未知
- [Gradle Plugin] 当 SQLDelight 插件已应用但未配置数据库时发出警告 (#1421)

### 修复
- [Compiler] 在 ORDER BY 子句中绑定列名时报告错误 (#1187 by @eygraber)
- [Compiler] 生成数据库接口时出现注册表警告 (#1792)
- [Compiler] CASE 语句的类型推断不正确 (#1811)
- [Compiler] 为没有版本的迁移文件提供更好的错误 (#2006)
- [Compiler] 某些数据库类型 ColumnAdapter 的所需数据库封送类型不正确 (#2012)
- [Compiler] CAST 的可空性 (#1261)
- [Compiler] 查询包装器中出现大量名称遮蔽警告 (#1946 by @eygraber)
- [Compiler] 生成的代码使用完整限定符名称 (#1939)
- [IDE Plugin] 从 Gradle 同步触发 SQLDelight 代码生成
- [IDE Plugin] 更改 .sq 文件时插件未重新生成数据库接口 (#1945)
- [IDE Plugin] 将文件移动到新包时出现问题 (#444)
- [IDE Plugin] 如果没有地方移动光标，则不执行任何操作，而不是崩溃 (#1994)
- [IDE Plugin] 对 Gradle 项目之外的文件使用空包名 (#1973)
- [IDE Plugin] 对无效类型优雅地失败 (#1943)
- [IDE Plugin] 遇到未知表达式时抛出更好的错误消息 (#1958)
- [Gradle Plugin] SQLDelight 将 IntelliJ 依赖项泄漏到 buildscript 类路径 (#1998)
- [Gradle Plugin] 在 *.sq 文件中添加方法文档时出现“JavadocIntegrationKt not found”编译错误 (#1982)
- [Gradle Plugin] SQLDelight Gradle 插件不支持配置缓存 (CoCa)。(#1947 by @stephanenicolas)
- [SQLite JDBC Driver] SQLException: 数据库处于自动提交模式 (#1832)
- [Coroutines Extension] 修复 coroutines-extensions 的 IR 后端 (#1918 by @dellisd)

## [1.4.3] - 2020-09-04
[1.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.3

### 新增
- [MySQL Dialect] 添加对 MySQL last_insert_id 函数的支持 (by @lawkai)
- [PostgreSQL Dialect] 支持 SERIAL 数据类型 (by @veyndan & @felipecsl)
- [PostgreSQL Dialect] 支持 PostgreSQL RETURNING (by @veyndan)

### 修复
- [MySQL Dialect] 将 MySQL AUTO_INCREMENT 视为具有默认值 (#1823)
- [Compiler] 修复 UPSERT 语句编译错误 (#1809 by @eygraber)
- [Compiler] 修复生成无效 Kotlin 的问题 (#1925 by @eygraber)
- [Compiler] 为未知函数提供更好的错误消息 (#1843)
- [Compiler] 将字符串作为 instr 第二个形参的类型暴露
- [IDE Plugin] 修复 IDE 插件的守护进程膨胀和 UI 线程停滞问题 (#1916)
- [IDE Plugin] 处理 null 模块场景 (#1902)
- [IDE Plugin] 在未配置的 .sq 文件中返回空字符串作为包名 (#1920)
- [IDE Plugin] 修复分组语句并为其添加集成测试 (#1820)
- [IDE Plugin] 使用内置的 ModuleUtil 为元素查找模块 (#1854)
- [IDE Plugin] 只将有效元素添加到查找中 (#1909)
- [IDE Plugin] 父级可以为 null (#1857)

## [1.4.2] - 2020-08-27
[1.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.2

### 新增
- [Runtime] 支持新的 JS IR 后端
- [Gradle Plugin] 添加 generateSqlDelightInterface Gradle 任务。(by @vanniktech)
- [Gradle Plugin] 添加 verifySqlDelightMigration Gradle 任务。(by @vanniktech)

### 修复
- [IDE Plugin] 使用 Gradle Tooling API 促进 IDE 和 Gradle 之间的数据共享
- [IDE Plugin] schema 派生默认为 false
- [IDE Plugin] 正确检索 commonMain 源代码集
- [MySQL Dialect] 将 minute 添加到 mySqlFunctionType() (by @maaxgr)

## [1.4.1] - 2020-08-21
[1.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.1

### 新增
- [Runtime] 支持 Kotlin 1.4.0 (#1859)

### 变更
- [Gradle Plugin] 将 AGP 依赖项设置为 compileOnly (#1362)

### 修复
- [Compiler] 为列定义规则和表接口生成器添加可选 Javadoc (#1224 by @endanke)
- [SQLite Dialect] 添加对 SQLite FTS5 辅助函数 highlight、snippet 和 bm25 的支持 (by @drampelt)
- [MySQL Dialect] 支持 MySQL BIT 数据类型
- [MySQL Dialect] 支持 MySQL 二进制字面量
- [PostgreSQL Dialect] 从 sql-psi 暴露 SERIAL (by @veyndan)
- [PostgreSQL Dialect] 添加 BOOLEAN 数据类型 (by @veyndan)
- [PostgreSQL Dialect] 添加 NULL 列约束 (by @veyndan)
- [HSQL Dialect] 为 HSQL 添加 `AUTO_INCREMENT` 支持 (by @rharter)

## [1.4.0] - 2020-06-22
[1.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.0

### 新增
- [MySQL Dialect] MySQL 支持 (by @JGulbronson & @veyndan)
- [PostgreSQL Dialect] 实验性的 PostgreSQL 支持 (by @veyndan)
- [HSQL Dialect] 实验性的 H2 支持 (by @MariusVolkhart)
- [SQLite Dialect] SQLite FTS5 支持 (by @benasher44 & @jpalawaga)
- [SQLite Dialect] 支持 ALTER TABLE RENAME COLUMN (#1505 by @angusholder)
- [IDE] IDE 对迁移 (.sqm) 文件的支持
- [IDE] 添加模仿内置 SQL 实时模板的 SQLDelight 实时模板 (#1154 by @veyndan)
- [IDE] 添加新的 SQLDelight 文件动作 (#42 by @romtsn)
- [Runtime] transactionWithReturn API 用于返回结果的事务
- [Compiler] 在 .sq 文件中对多个 SQL 语句进行分组的语法
- [Compiler] 支持从迁移文件生成 schema
- [Gradle Plugin] 添加一个将迁移文件输出为有效 SQL 的任务

### 变更
- [Documentation] 重新整理了文档网站 (by @saket)
- [Gradle Plugin] 改进不受支持的方言错误消息 (by @veyndan)
- [IDE] 根据方言动态更改文件图标 (by @veyndan)
- [JDBC Driver] 暴露基于 javax.sql.DataSource 的 JdbcDriver 构造函数 (#1614)

### 修复
- [Compiler] 支持表上的 Javadoc 并修复一个文件中的多个 Javadoc (#1224)
- [Compiler] 允许为合成列插入值 (#1351)
- [Compiler] 修复目录名清理中的不一致 (by @ZacSweers)
- [Compiler] 合成列应在连接中保留可空性 (#1656)
- [Compiler] 将 DELETE 语句固定到 DELETE 关键字 (#1643)
- [Compiler] 修复引号问题 (#1525 by @angusholder)
- [Compiler] 修复 BETWEEN 操作符以正确递归到表达式中 (#1279)
- [Compiler] 在创建索引时，如果缺少表/列，则给出更好的错误 (#1372)
- [Compiler] 允许在连接约束中使用外部查询的投影 (#1346)
- [Native Driver] 使 execute 使用 transationPool (by @benasher44)
- [JDBC Driver] 使用 JDBC 事务 API 而非 SQLite (#1693)
- [IDE] 修复 virtualFile 引用始终指向原始文件的问题 (#1782)
- [IDE] 向 Bugsnag 报告错误时使用正确的 throwable (#1262)
- [Paging Extension] 修复 DataSource 泄漏 (#1628)
- [Gradle Plugin] 如果在生成 schema 时输出数据库文件已存在，则删除它 (#1645)
- [Gradle Plugin] 如果存在间隙，则迁移验证失败
- [Gradle Plugin] 显式使用我们设置的文件索引 (#1644)

## [1.3.0] - 2020-04-03
[1.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.3.0

* 新增: [Gradle] dialect 属性，用于指定要编译的 SQL 方言。
* 新增: [Compiler] #1009 实验性的 MySQL 方言支持。
* 新增: [Compiler] #1436 支持 SQLite 3.24 方言和 UPSERT。
* 新增: [JDBC Driver] 将 JDBC 驱动程序从 SQLite JVM 驱动程序中分离出来。
* 修复: [Compiler] #1199 支持任意长度的 lambda 表达式。
* 修复: [Compiler] #1610 修复 avg() 的返回类型为可空的。
* 修复: [IntelliJ] #1594 修复导致 Windows 上 Goto 和 Find Usages 功能失效的路径分隔符处理问题。

## [1.2.2] - 2020-01-22
[1.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.2

* 新增: [Runtime] 支持 Windows (mingW)、tvOS、watchOS 和 macOS 架构。
* 修复: [Compiler] sum() 的返回类型应为可空的。
* 修复: [Paging] 将 Transacter 传入 QueryDataSourceFactory 以避免竞争条件。
* 修复: [IntelliJ Plugin] 查找文件包名时不搜索依赖项。
* 修复: [Gradle] #862 将 Gradle 中的验证器日志更改为调试级别。
* 增强: [Gradle] 将 GenerateSchemaTask 转换为使用 Gradle Worker。
* 注意: sqldelight-runtime 构件重命名为 runtime。

## [1.2.1] - 2019-12-11
[1.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.1

* 修复: [Gradle] Kotlin Native 1.3.60 支持。
* 修复: [Gradle] #1287 同步时的警告。
* 修复: [Compiler] #1469 查询的 SynetheticAccessor 创建。
* 修复: [JVM Driver] 修复了内存泄漏。
* 注意: 协程扩展构件要求将 kotlinx bintray maven 版本库添加到您的构建脚本中。

## [1.2.0] - 2019-08-30
[1.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.0

* 新增: [Runtime] 稳定的 Flow API。
* 修复: [Gradle] Kotlin Native 1.3.50 支持。
* 修复: [Gradle] #1380 清理构建有时失败。
* 修复: [Gradle] #1348 运行验证任务时打印“Could not retrieve functions”。
* 修复: [Compile] #1405 如果查询包含 FTS 表连接，则无法构建项目。
* 修复: [Gradle] #1266 存在多个数据库模块时，Gradle 构建偶尔失败。

## [1.1.4] - 2019-07-11
[1.1.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.4

* 新增: [Runtime] 实验性的 Kotlin Flow API。
* 修复: [Gradle] Kotlin/Native 1.3.40 兼容性。
* 修复: [Gradle] #1243 修复了在 Gradle 按需配置下使用 SQLDelight 的问题。
* 修复: [Gradle] #1385 修复了在增量注解处理下使用 SQLDelight 的问题。
* 修复: [Gradle] 允许 Gradle 任务缓存。
* 修复: [Gradle] #1274 启用 Kotlin DSL 使用 SQLDelight 扩展。
* 修复: [Compiler] 为每个查询确定性地生成唯一 ID。
* 修复: [Compiler] 仅在事务完成后通知监听查询。
* 修复: [JVM Driver] #1370 强制 JdbcSqliteDriver 用户提供数据库 URL。

## [1.1.3] - 2019-04-14
[1.1.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.3

* Gradle Metadata 1.0 发布。

## [1.1.2] - 2019-04-14
[1.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.2

* 新增: [Runtime] #1267 日志驱动装饰器。
* 修复: [Compiler] #1254 拆分长度超过 2^16 字符的字符串字面量。
* 修复: [Gradle] #1260 在多平台项目中生成的源被识别为 iOS 源。
* 修复: [IDE] #1290 `CopyAsSqliteAction.kt:43` 中的 `kotlin.KotlinNullPointerException`。
* 修复: [Gradle] #1268 `linkDebugFrameworkIos*` 任务在最近版本中运行失败。

## [1.1.1] - 2019-03-01
[1.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.1

* 修复: [Gradle] 修复 Android 项目的模块依赖编译问题。
* 修复: [Gradle] #1246 在 afterEvaluate 中设置 API 依赖项。
* 修复: [Compiler] 数组类型正确打印。

## [1.1.0] - 2019-02-27
[1.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.0

* 新增: [Gradle] #502 允许指定 schema 模块依赖项。
* 增强: [Compiler] #1111 表错误在其他错误之前排序。
* 修复: [Compiler] #1225 返回 REAL 字面量的正确类型。
* 修复: [Compiler] #1218 docid 通过触发器传播。

## [1.0.3] - 2019-01-30
[1.0.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.3

* 增强: [Runtime] #1195 原生驱动/运行时 Arm32。
* 增强: [Runtime] #1190 从 Query 类型暴露 mapper。

## [1.0.2] - 2019-01-26
[1.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.2

* 修复: [Gradle Plugin] 更新到 Kotlin 1.3.20。
* 修复: [Runtime] 事务不再吞噬异常。

## [1.0.1] - 2019-01-21
[1.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.1

* 增强: [Native Driver] 允许将目录名传递给 DatabaseConfiguration。
* 增强: [Compiler] #1173 没有包的文件编译失败。
* 修复: [IDE] 正确向 Square 报告 IDE 错误。
* 修复: [IDE] #1162 相同包中的类型显示为错误但工作正常。
* 修复: [IDE] #1166 重命名表时出现 NPE。
* 修复: [Compiler] #1167 尝试解析包含 UNION 和 SELECT 的复杂 SQL 语句时抛出异常。

## [1.0.0] - 2019-01-08
[1.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.0

* 新增: 生成代码的全面改进，现在采用 Kotlin。
* 新增: RxJava2 扩展构件 artifact。
* 新增: Android Paging 扩展构件 artifact。
* 新增: Kotlin 多平台支持。
* 新增: Android、iOS 和 JVM SQLite 驱动构件 artifact。
* 新增: 事务 API。

## [0.7.0] - 2018-02-12
[0.7.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.7.0

* 新增: 生成的代码已更新，仅使用 Support SQLite 库。所有查询现在都生成语句对象，而不是原始字符串。
* 新增: IDE 中的语句折叠。
* 新增: 布尔类型现在自动处理。
* 修复: 从代码生成中移除已弃用的封送器。
* 修复: 将 'avg' SQL 函数类型映射更正为 REAL。
* 修复: 正确检测 'julianday' SQL 函数。

## [0.6.1] - 2017-03-22
[0.6.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.1

* 新增: 不带实参的 DELETE、UPDATE 和 INSERT 语句会生成编译语句。
* 修复: 子查询中使用的视图内的 USING 子句不再报错。
* 修复: 移除生成的 Mapper 上重复的类型。
* 修复: 子查询可用于对实参进行检测的表达式中。

## [0.6.0] - 2017-03-06
[0.6.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.0

* 新增: SELECT 查询现在作为 `SqlDelightStatement` 工厂暴露，而不是字符串常量。
* 新增: 查询 Javadoc 现在复制到语句和 mapper 工厂。
* 新增: 为视图名称发出字符串常量。
* 修复: 需要工厂的视图上的查询现在正确地要求这些工厂作为实参。
* 修复: 验证插入操作的实参数量与指定列的数量匹配。
* 修复: 正确编码 WHERE 子句中使用的 blob 字面量。
* 此版本需要 Gradle 3.3 或更高版本。

## [0.5.1] - 2016-10-24
[0.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.1

* 新增: 编译语句扩展一个抽象类型。
* 修复: 形参中的原生类型如果可空，则会被装箱。
* 修复: 工厂方法中存在所有必要的绑定实参工厂。
* 修复: 转义的列名正确封送。

## [0.5.0] - 2016-10-19
[0.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.0

* 新增: SQLite 实参可以通过 Factory 进行类型安全传递
* 新增: IntelliJ 插件对 .sq 文件执行格式化
* 新增: 支持 SQLite 时间戳字面量
* 修复: 参数化类型可以在 IntelliJ 中点击跳转
* 修复: 如果从 Cursor 中获取，转义的列名不再抛出 RuntimeException。
* 修复: Gradle 插件在尝试打印异常时不会崩溃。

## [0.4.4] - 2016-07-20
[0.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.4

* 新增: 对 short 作为列 Java 类型的原生支持
* 新增: 生成的 mapper 和工厂方法上的 Javadoc
* 修复: group_concat 和 nullif 函数具有正确的可空性
* 修复: 与 Android Studio 2.2-alpha 的兼容性
* 修复: WITH RECURSIVE 不再使插件崩溃

## [0.4.3] - 2016-07-07
[0.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.3

* 新增: 编译错误链接到源文件。
* 新增: 右键点击将 SQLDelight 代码复制为有效的 SQLite。
* 新增: 命名语句上的 Javadoc 将出现在生成的字符串上。
* 修复: 生成的视图模型包含可空性注解。
* 修复: 来自联合的生成代码具有正确的类型和可空性，以支持所有可能的列。
* 修复: sum 和 round SQLite 函数在生成的代码中具有正确的类型。
* 修复: CAST、内部 SELECT 的 bug 修复。
* 修复: CREATE TABLE 语句中的自动补全。
* 修复: SQLite 关键字可在包中使用。

## [0.4.2] - 2016-06-16
[0.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.2

* 新增: Marshal 可以从工厂创建。
* 修复: IntelliJ 插件生成工厂方法时泛型顺序正确。
* 修复: 函数名可以使用任何大小写。

## [0.4.1] - 2016-06-14
[0.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.1

* 修复: IntelliJ 插件生成类时泛型顺序正确。
* 修复: 列定义可以使用任何大小写。

## [0.4.0] - 2016-06-14
[0.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.0

* 新增: Mapper 按查询而不是按表生成。
* 新增: Java 类型可以在 .sq 文件中导入。
* 新增: SQLite 函数经过验证。
* 修复: 移除重复错误。
* 修复: 大写列名和 Java 关键字列名不会出错。

## [0.3.2] - 2016-05-14
[0.3.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.2

* 新增: 自动补全和查找用法现在适用于视图和别名。
* 修复: 编译期验证现在允许在 SELECT 中使用函数。
* 修复: 支持只声明默认值的 INSERT 语句。
* 修复: 未使用 SQLDelight 的项目导入时，插件不再崩溃。

## [0.3.1] - 2016-04-27
[0.3.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.1

* 修复: 接口可见性改回 public，以避免方法引用导致 Illegal Access 运行时异常。
* 修复: 子表达式正确求值。

## [0.3.0] - 2016-04-26
[0.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.0

* 新增: 列定义使用 SQLite 类型，并且可以有额外的 'AS' 约束来指定 Java 类型。
* 新增: 可以在 IDE 中发送 bug 报告。
* 修复: 自动补全功能正常。
* 修复: SQLDelight 模型文件在 .sq 文件编辑时更新。
* 移除: 不再支持附加数据库。

## [0.2.2] - 2016-03-07
[0.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.2

* 新增: 对 INSERT、UPDATE、DELETE、INDEX 和 TRIGGER 语句使用的列进行编译期验证。
* 修复: 文件移动/创建时 IDE 插件不会崩溃。

## [0.2.1] - 2016-03-07
[0.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.1

* 新增: Ctrl+`/`（macOS 上为 Cmd+`/`）切换选中行的注释。
* 新增: 对 SQL 查询使用的列进行编译期验证。
* 修复: IDE 和 Gradle 插件都支持 Windows 路径。

## [0.2.0] - 2016-02-29
[0.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.0

* 新增: 为 Marshal 类添加了复制构造函数。
* 新增: 更新到 Kotlin 1.0 最终版。
* 修复: 以非失败方式报告 'sqldelight' 文件夹结构问题。
* 修复: 禁止命名为 `table_name` 的列。它们生成的常量与表名常量冲突。
* 修复: 确保 IDE 插件立即生成模型类，无论是否打开 .sq 文件。
* 修复: IDE 和 Gradle 插件都支持 Windows 路径。

## [0.1.2] - 2016-02-13
[0.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.2

* 修复: 移除阻止 Gradle 插件在大多数项目中使用的代码。
* 修复: 添加对 Antlr 运行时的缺失编译器依赖项。

## [0.1.1] - 2016-02-12
[0.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.1

* 修复: 确保 Gradle 插件指向与其自身相同的运行时版本。

## [0.1.0] - 2016-02-12
[0.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.0

首次发布。