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
<b>使用库</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>了解如何实现数据库连接池与缓存。</link-summary>

在[前一个教程](db-persistence.md)中，我们使用 Exposed 框架为网站添加了持久化功能。
在本教程中，我们将探讨如何分别使用 HikariCP 和 Ehcache 库来实现数据库连接池与缓存。

## 添加依赖项 {id="add-dependencies"}

首先，你需要添加 HikariCP 和 Ehcache 库的依赖项。
打开 `gradle.properties` 文件并指定库版本：

```kotlin
ehcache_version = 3.10.8
logback_version = 1.5.18
```

然后，打开 `build.gradle.kts` 并添加以下依赖项：

```kotlin

```

点击 `build.gradle.kts` 文件右上角的 **Load Gradle Changes** 图标以安装新添加的依赖项。

## 连接池 {id="connection-pooling"}

当 Exposed 在 `transaction` 的作用域内首次对数据库执行操作时，它会在每个 `transaction` 调用中启动一个新的 JDBC 连接。
但建立多个 JDBC 连接会消耗大量资源：重用现有连接有助于提升性能。
_连接池_机制解决了这个问题。

在本节中，我们将使用 HikariCP 框架来管理应用程序中的 JDBC 连接池。

### 将连接设置提取到配置文件中 {id="connection-settings-config"}

在[前一个教程](db-persistence.md#connect_db)中，我们使用 `com/example/dao/DatabaseSingleton.kt` 文件中硬编码的 `driverClassName` 和 `jdbcURL` 来建立数据库连接：

```kotlin

```

让我们将数据库连接设置提取到[自定义配置组](server-configuration-file.topic)中。

1. 打开 `src/main/resources/application.conf` 文件，并在 `ktor` 组外部添加 `storage` 组，如下所示：

   ```kotlin
   
   ```

2. 打开 `com/example/dao/DatabaseSingleton.kt` 并更新 `init` 函数，使其从配置文件加载存储设置：

   ```kotlin
   
   ```
   
   现在，`init` 函数接受 `ApplicationConfig` 并使用 `config.property` 来加载自定义设置。

3. 最后，打开 `com/example/Application.kt` 并将 `environment.config` 传递给 `DatabaseSingleton.init`，以便在应用程序启动时加载连接设置：

   ```kotlin
   
   ```

### 启用连接池 {id="enable-connection-pooling"}

要在 Exposed 中启用连接池，你需要将 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html) 作为形参传递给 `Database.connect` 函数。
HikariCP 提供了实现 `DataSource` 接口的 `HikariDataSource` 类。

1. 要创建 `HikariDataSource`，请打开 `com/example/dao/DatabaseSingleton.kt` 并在 `DatabaseSingleton` 对象中添加 `createHikariDataSource` 函数：

   ```kotlin
   
   ```

   以下是关于数据源设置的一些注意事项：
     - `createHikariDataSource` 函数接受驱动程序类名和数据库 URL 作为形参。
     - `maximumPoolSize` 属性指定了连接池可以达到的最大大小。
     - `isAutoCommit` 和 `transactionIsolation` 的设置与 Exposed 使用的默认设置同步。

2. 要使用 `HikariDataSource`，将其传递给 `Database.connect` 函数：

   ```kotlin
   
   ```

   你现在可以[运行应用程序](db-persistence.md#run_app)，并确保一切都像以前一样正常工作。

## 缓存 {id="caching"}

你可以为数据库补充一个数据库缓存。
缓存是一种将常用数据存储在临时内存中的技术，可以减少数据库的工作负载以及读取常用数据所需的时间。

在本教程中，我们将使用 Ehcache 库来组织文件中的缓存。

### 将缓存文件路径添加到配置中 {id="cache-file-path"}

打开 `src/main/resources/application.conf` 文件，并将 `ehcacheFilePath` 属性添加到 `storage` 组：

```kotlin

```

此属性指定了用于存储缓存数据的文件路径。
我们稍后将使用它来配置一个 `DAOFacade` 实现，用于处理缓存。

### 实现缓存 {id="implement-caching"}

要实现缓存，我们需要提供另一个 `DAOFacade` 实现，该实现从缓存中返回值；如果缓存中没有值，则将其委托给数据库接口。

1. 在 `com.example.dao` 包中创建一个新的 `DAOFacadeCacheImpl.kt` 文件，并向其中添加以下实现：

   ```kotlin
   
   ```

   以下是此代码示例的简要概述：
     - 为了初始化和配置缓存，我们定义了一个 Ehcache `CacheManager` 实例。我们将 `storagePath` 作为用于磁盘存储的根目录。
     - 我们创建了一个缓存，用于按 ID 存储文章条目：`articlesCache` 将 `Int` 键映射到 `Article` 值。
     - 然后，我们为本地内存和磁盘资源提供大小限制。你可以在 [Ehcache 文档](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)中阅读有关这些形参的更多信息。
     - 最后，我们通过调用 `cacheManager.getCache()` 并传入指定的名称、键和值类型来获取创建的缓存。

2. 要在缓存中使用，`Article` 类应是可序列化的并实现 `java.io.Serializable`。
   打开 `com/example/models/Article.kt` 并按如下方式更新代码：

   ```kotlin
   
   ```

3. 现在我们准备实现 `DAOFacade` 的成员。
   回到 `DAOFacadeCacheImpl.kt`，添加以下方法：

   ```kotlin
   
   ```

   - `allArticles`：我们不尝试缓存所有文章；我们将其委托给主数据库。
   - `article`：当我们获取一篇文章时，我们首先检测它是否存在于缓存中，只有当它不存在时，我们才将其委托给主 `DAOFacade`，并将这篇文章添加到缓存中。
   - `addNewArticle`：当我们添加一篇新文章时，我们将其委托给主 `DAOFacade`，但也会将这篇文章添加到缓存中。
   - `editArticle`：编辑现有文章时，我们同时更新缓存和数据库。
   - `deleteArticle`：删除时，我们需要同时从缓存和主数据库中删除文章。

### 初始化 DAOFacadeCacheImpl {id="init-dao-facade"}

让我们创建一个 `DAOFacadeCacheImpl` 实例，并在应用程序启动前添加一篇示例文章插入到数据库中：

1. 首先，打开 `DAOFacadeImpl.kt` 文件并删除文件底部的 `dao` 变量初始化。

2. 然后，打开 `com/example/plugins/Routing.kt` 并在 `configureRouting` 代码块内初始化 `dao` 变量：

   ```kotlin
   
   ```

   就是这样。
   你现在可以[运行应用程序](db-persistence.md#run_app)，并确保一切都像以前一样正常工作。

> 你可以在此处找到包含连接池和缓存的完整示例：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。