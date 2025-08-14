[//]: # (title: 连接池与缓存)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>使用的库</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>了解如何实现数据库连接池和缓存。</link-summary>

在[上一个教程](db-persistence.md)中，我们使用 Exposed 框架为网站添加了持久化。
在本教程中，我们将探讨如何分别使用 HikariCP 和 Ehcache 库来实现数据库连接池和缓存。

## 添加依赖项 {id="add-dependencies"}

首先，你需要为 HikariCP 和 Ehcache 库添加依赖项。
打开 `gradle.properties` 文件并指定库版本：

[object Promise]

然后，打开 `build.gradle.kts` 并添加以下依赖项：

[object Promise]

点击 `build.gradle.kts` 文件右上角的 **Load Gradle Changes** 图标来安装新添加的依赖项。

## 连接池 {id="connection-pooling"}

Exposed 在 `transaction` 作用域内首次对数据库执行操作时，会在每个 `transaction` 调用内部启动一个新的 JDBC 连接。
但建立多个 JDBC 连接会消耗大量资源：重用现有连接有助于提升性能。
_连接池_机制解决了这个问题。

在本章节中，我们将使用 HikariCP 框架来管理应用程序中的 JDBC 连接池。

### 将连接设置提取到配置文件 {id="connection-settings-config"}

在[上一个教程](db-persistence.md#connect_db)中，我们使用 `com/example/dao/DatabaseSingleton.kt` 文件中硬编码的 `driverClassName` 和 `jdbcURL` 来建立数据库连接：

[object Promise]

让我们将数据库连接设置提取到一个[自定义配置组](server-configuration-file.topic)。

1. 打开 `src/main/resources/application.conf` 文件，并在 `ktor` 组外部添加 `storage` 组，如下所示：

   [object Promise]

2. 打开 `com/example/dao/DatabaseSingleton.kt` 并更新 `init` 函数以从配置文件加载存储设置：

   [object Promise]
   
   `init` 函数现在接受 `ApplicationConfig` 并使用 `config.property` 来加载自定义设置。

3. 最后，打开 `com/example/Application.kt` 并将 `environment.config` 传递给 `DatabaseSingleton.init`，以便在应用程序启动时加载连接设置：

   [object Promise]

### 启用连接池 {id="enable-connection-pooling"}

为了在 Exposed 中启用连接池，你需要将 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html) 作为实参传递给 `Database.connect` 函数。
HikariCP 提供了 `HikariDataSource` 类，该类实现了 `DataSource` 接口。

1. 要创建 `HikariDataSource`，请打开 `com/example/dao/DatabaseSingleton.kt` 并将 `createHikariDataSource` 函数添加到 `DatabaseSingleton` 对象中：

   [object Promise]

   以下是关于数据源设置的一些注意事项：
     - `createHikariDataSource` 函数接受驱动类名和数据库 URL 作为形参。
     - `maximumPoolSize` 属性指定了连接池可达到的最大大小。
     - `isAutoCommit` 和 `transactionIsolation` 设置为与 Exposed 使用的默认设置同步。

2. 要使用 `HikariDataSource`，请将其传递给 `Database.connect` 函数：

   [object Promise]

   你现在可以[运行应用程序](db-persistence.md#run_app)并确保一切正常运行。

## 缓存 {id="caching"}

你可以为数据库补充数据库缓存。
缓存是一种能够将频繁使用的数据存储在临时内存中的技术，可以减少数据库的工作负载以及读取频繁所需数据的时间。

在本教程中，我们将使用 Ehcache 库将缓存组织到文件中。

### 将缓存文件路径添加到配置中 {id="cache-file-path"}

打开 `src/main/resources/application.conf` 文件，并将 `ehcacheFilePath` 属性添加到 `storage` 组中：

[object Promise]

此属性指定了用于存储缓存数据的文件路径。
我们稍后会使用它来配置一个用于处理缓存的 `DAOFacade` 实现。

### 实现缓存 {id="implement-caching"}

要实现缓存，我们需要提供另一个 `DAOFacade` 实现，该实现会从缓存中返回值，如果没有缓存值，则将其委托给数据库接口。

1. 在 `com.example.dao` 包中创建一个新的 `DAOFacadeCacheImpl.kt` 文件，并向其中添加以下实现：

   [object Promise]

   以下是此代码示例的简要概述：
     - 为了初始化和配置缓存，我们定义了一个 Ehcache `CacheManager` 实例。我们提供 `storagePath` 作为用于磁盘存储的根目录。
     - 我们创建了一个根据 ID 存储文章的条目缓存：`articlesCache` 将 `Int` 键映射到 `Article` 值。
     - 然后我们为本地内存和磁盘资源提供大小约束。你可以在 [Ehcache 文档](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)中阅读更多关于这些形参的信息。
     - 最后，我们通过使用提供的名称、键和值类型调用 `cacheManager.getCache()` 来获取创建的缓存。

2. 要在缓存中使用，`Article` 类应该是可序列化的并实现 `java.io.Serializable`。
   打开 `com/example/models/Article.kt` 并如下更新代码：

   [object Promise]

3. 现在我们准备好实现 `DAOFacade` 的成员了。
   回到 `DAOFacadeCacheImpl.kt`，添加以下方法：

   [object Promise]

   - `allArticles`：我们不尝试缓存所有文章；我们将此委托给主数据库。
   - `article`：当我们获取一篇文章时，我们首先检测它是否存在于缓存中，仅当它不存在时，我们才将此委托给主 `DAOFacade`，并将此文章添加到缓存中。
   - `addNewArticle`：当我们添加新文章时，我们会将其委托给主 `DAOFacade`，但也会将此文章添加到缓存中。
   - `editArticle`：编辑现有文章时，我们会同时更新缓存和数据库。
   - `deleteArticle`：删除时，我们需要同时从缓存和主数据库中删除该文章。

### 初始化 DAOFacadeCacheImpl {id="init-dao-facade"}

让我们创建 `DAOFacadeCacheImpl` 的一个实例，并在应用程序启动之前添加一个示例文章以插入到数据库中：

1. 首先，打开 `DAOFacadeImpl.kt` 文件并移除文件底部的 `dao` 变量初始化。

2. 然后，打开 `com/example/plugins/Routing.kt` 并在 `configureRouting` 代码块内部初始化 `dao` 变量：

   [object Promise]

   就这样。
   你现在可以[运行应用程序](db-persistence.md#run_app)并确保一切正常运行。

> 你可以在此处找到包含连接池和缓存的完整示例：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。