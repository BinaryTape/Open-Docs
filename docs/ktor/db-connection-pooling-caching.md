[//]: # (title: 连接池与缓存)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>使用的库</b>：<a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>、<a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>了解如何实现数据库连接池与缓存。</link-summary>

在[上一个教程](db-persistence.md)中，我们使用 Exposed 框架为网站添加了持久化。
在本教程中，我们将分别探讨如何使用 HikariCP 和 Ehcache 库来实现数据库连接池和缓存。

## 添加依赖项 {id="add-dependencies"}

首先，您需要为 HikariCP 和 Ehcache 库添加依赖项。 
打开 `gradle.properties` 文件并指定库版本：

```kotlin
h2_version = 2.3.232
hikaricp_version = 5.1.0
```

然后，打开 `build.gradle.kts` 并添加以下依赖项：

```kotlin

```

点击 `build.gradle.kts` 文件右上角的 **Load Gradle Changes** 图标来安装新添加的依赖项。

## 连接池 {id="connection-pooling"}

当 Exposed 在 `transaction` 调用的作用域内对数据库执行第一次操作时，它会在每个 `transaction` 调用内部启动一个新的 JDBC 连接。
但建立多个 JDBC 连接是非常消耗资源的：
重用现有连接有助于提高性能。
“连接池”机制解决了这个问题。

在本节中，我们将使用 HikariCP 框架来管理应用程序中的 JDBC 连接池。

### 将连接设置提取到配置文件中 {id="connection-settings-config"}

在[上一个教程](db-persistence.md#connect_db)中，我们在 `com/example/dao/DatabaseSingleton.kt` 文件中使用了硬编码的 `driverClassName` 和 `jdbcURL` 来建立数据库连接：

```kotlin

```

让我们将数据库连接设置提取到一个[自定义配置组](server-configuration-file.topic)中。

1. 打开 `src/main/resources/application.conf` 文件，并在 `ktor` 组之外添加 `storage` 组，如下所示：

   ```kotlin
   
   ```

2. 打开 `com/example/dao/DatabaseSingleton.kt` 并更新 `init` 函数，以从配置文件加载存储设置：

   ```kotlin
   
   ```
   
   `init` 函数现在接受 `ApplicationConfig` 并使用 `config.property` 来加载自定义设置。

3. 最后，打开 `com/example/Application.kt` 并将 `environment.config` 传递给 `DatabaseSingleton.init`，以便在应用程序启动时加载连接设置：

   ```kotlin
   
   ```

### 启用连接池 {id="enable-connection-pooling"}

要在 Exposed 中启用连接池，您需要向 `Database.connect` 函数提供 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html) 作为参数。
HikariCP 提供了实现 `DataSource` 接口的 `HikariDataSource` 类。

1. 要创建 `HikariDataSource`，请打开 `com/example/dao/DatabaseSingleton.kt` 并将 `createHikariDataSource` 函数添加到 `DatabaseSingleton` 对象中：

   ```kotlin
   
   ```

   以下是关于数据源设置的一些说明：
     - `createHikariDataSource` 函数接收驱动程序类名和数据库 URL 作为参数。
     - `maximumPoolSize` 属性指定了连接池可以达到的最大容量。
     - `isAutoCommit` 和 `transactionIsolation` 被设置为与 Exposed 使用的默认设置同步。

2. 要使用 `HikariDataSource`，请将其传递给 `Database.connect` 函数：

   ```kotlin
   
   ```

   您现在可以[运行应用程序](db-persistence.md#run_app)并确保一切运行如初。

## 缓存 {id="caching"}

您可以使用数据库缓存来补充数据库。 
缓存是一种能够将常用数据存储在临时内存中的技术，
可以减轻数据库的工作负载并减少读取常用数据的时间。

在本教程中，我们将使用 Ehcache 库在文件中组织缓存。

### 将缓存文件路径添加到配置中 {id="cache-file-path"}

打开 `src/main/resources/application.conf` 文件并将 `ehcacheFilePath` 属性添加到 `storage` 组：

```kotlin

```

此属性指定了用于存储缓存数据的文件路径。
稍后我们将使用它来配置处理缓存的 `DAOFacade` 实现。

### 实现缓存 {id="implement-caching"}

要实现缓存，我们需要提供另一个 `DAOFacade` 实现，该实现从缓存中返回值，并在没有缓存值的情况下将其委托给数据库接口。

1. 在 `com.example.dao` 软件包中创建一个新的 `DAOFacadeCacheImpl.kt` 文件，并将以下实现添加到其中：

   ```kotlin
   
   ```

   以下是该代码示例的简要概述：
     - 为了初始化和配置缓存，我们定义了一个 Ehcache `CacheManager` 实例。我们将 `storagePath` 作为根目录用于磁盘存储。
     - 我们为条目创建了一个缓存，用于按 ID 存储文章：`articlesCache` 将 `Int` 类型的键映射到 `Article` 类型的值。 
     - 然后我们为本地内存和磁盘资源提供大小约束。您可以在 [Ehcache 文档](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)中详细了解这些参数。
     - 最后，我们通过调用 `cacheManager.getCache()` 并提供指定的名称、键和值类型来获取创建的缓存。

2. 为了在缓存中使用，`Article` 类应该是可序列化的并实现 `java.io.Serializable`。
   打开 `com/example/models/Article.kt` 并如下更新代码：

   ```kotlin
   
   ```

3. 现在我们准备好实现 `DAOFacade` 的成员了。 
   回到 `DAOFacadeCacheImpl.kt`，添加以下方法：

   ```kotlin
   
   ```

   - `allArticles`：我们不尝试缓存所有文章；我们将其委托给主数据库。
   - `article`：当我们获取一篇文章时，我们首先检查它是否存在于缓存中，只有当它不在缓存中时，我们才会将其委托给主 `DAOFacade`，并将该文章添加到缓存中。
   - `addNewArticle`：当我们添加新文章时，我们将其委托给主 `DAOFacade`，但同时也将该文章添加到缓存中。
   - `editArticle`：编辑现有文章时，我们同时更新缓存和数据库。
   - `deleteArticle`：在删除时，我们需要同时从缓存和主数据库中删除该文章。

### 初始化 DAOFacadeCacheImpl {id="init-dao-facade"}

让我们创建一个 `DAOFacadeCacheImpl` 实例，并添加一个示例文章，以便在应用程序启动前插入到数据库中：

1. 首先，打开 `DAOFacadeImpl.kt` 文件并删除文件底部的 `dao` 变量初始化。

2. 然后，打开 `com/example/plugins/Routing.kt` 并在 `configureRouting` 块内部初始化 `dao` 变量：

   ```kotlin
   
   ```

   大功告成。 
   您现在可以[运行应用程序](db-persistence.md#run_app)并确保一切运行如初。

> 您可以在此处找到包含连接池和缓存的完整示例：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。