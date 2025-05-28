[//]: # (title: 连接池和缓存)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>使用的库</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>学习如何实现数据库连接池和缓存。</link-summary>

在[上一个教程](db-persistence.md)中，我们使用 Exposed 框架为网站添加了持久化功能。
在本教程中，我们将分别介绍如何使用 HikariCP 和 Ehcache 库实现数据库连接池和缓存。

## 添加依赖项 {id="add-dependencies"}

首先，你需要添加 HikariCP 和 Ehcache 库的依赖项。
打开 `gradle.properties` 文件并指定库版本：

```kotlin
```
{src="gradle.properties" include-lines="16-17"}

然后，打开 `build.gradle.kts` 并添加以下依赖项：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence-advanced/build.gradle.kts" include-lines="5-6,22-23,31-32,36"}

点击 `build.gradle.kts` 文件右上角的 **Load Gradle Changes** 图标以安装新添加的依赖项。

## 连接池 {id="connection-pooling"}

Exposed 在每次 `transaction` 调用中，当它在 `transaction` 作用域内首次对数据库执行操作时，都会启动一个新的 JDBC 连接。
但是，建立多个 JDBC 连接会消耗大量资源：
重用现有连接有助于提高性能。
_连接池_机制解决了这个问题。

在本节中，我们将使用 HikariCP 框架来管理应用程序中的 JDBC 连接池。

### 将连接设置提取到配置文件中 {id="connection-settings-config"}

在[上一个教程](db-persistence.md#connect_db)中，我们在 `com/example/dao/DatabaseSingleton.kt` 文件中使用了硬编码的 `driverClassName` 和 `jdbcURL` 来建立数据库连接：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="10-12,17"}

让我们将数据库连接设置提取到[自定义配置组](server-configuration-file.topic)中。

1.  打开 `src/main/resources/application.conf` 文件，并在 `ktor` 组外部添加 `storage` 组，如下所示：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/resources/application.conf" include-lines="11-14,16"}

2.  打开 `com/example/dao/DatabaseSingleton.kt` 并更新 `init` 函数，以从配置文件加载存储设置：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="5,10-18,23,39"}

    `init` 函数现在接受 `ApplicationConfig` 并使用 `config.property` 来加载自定义设置。

3.  最后，打开 `com/example/Application.kt` 并将 `environment.config` 传递给 `DatabaseSingleton.init`，以便在应用程序启动时加载连接设置：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/Application.kt" include-lines="9-13"}

### 启用连接池 {id="enable-connection-pooling"}

要在 Exposed 中启用连接池，你需要提供 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html) 作为参数给 `Database.connect` 函数。
HikariCP 提供了实现 `DataSource` 接口的 `HikariDataSource` 类。

1.  要创建 `HikariDataSource`，请打开 `com/example/dao/DatabaseSingleton.kt` 并在 `DatabaseSingleton` 对象中添加 `createHikariDataSource` 函数：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="4,11-12,25-35,39"}

    以下是关于数据源设置的一些说明：
    - `createHikariDataSource` 函数将驱动程序类名和数据库 URL 作为参数。
    - `maximumPoolSize` 属性指定了连接池可以达到的最大大小。
    - `isAutoCommit` 和 `transactionIsolation` 设置与 Exposed 使用的默认设置同步。

2.  要使用 `HikariDataSource`，请将其传递给 `Database.connect` 函数：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="12-13,19,23,39"}

    你现在可以[运行应用程序](db-persistence.md#run_app)并确保一切都像以前一样正常工作。

## 缓存 {id="caching"}

你可以用数据库缓存来补充数据库。
缓存是一种将常用数据存储在临时内存中的技术，
可以减少数据库的工作负载以及读取常用数据所需的时间。

在本教程中，我们将使用 Ehcache 库来组织文件中的缓存。

### 在配置中添加缓存文件路径 {id="cache-file-path"}

打开 `src/main/resources/application.conf` 文件，并在 `storage` 组中添加 `ehcacheFilePath` 属性：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence-advanced/src/main/resources/application.conf" include-lines="11,15-16"}

此属性指定用于存储缓存数据的文件路径。
我们稍后将使用它来配置用于缓存的 `DAOFacade` 实现。

### 实现缓存 {id="implement-caching"}

要实现缓存，我们需要提供另一个 `DAOFacade` 实现，该实现从缓存中返回值，
如果缓存中没有值，则将其委托给数据库接口。

1.  在 `com.example.dao` 包中创建新的 `DAOFacadeCacheImpl.kt` 文件，并添加以下实现：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DAOFacadeCacheImpl.kt" include-lines="1-28,51"}

    以下是此代码示例的简要概述：
    - 为了初始化和配置缓存，我们定义了一个 Ehcache `CacheManager` 实例。我们将 `storagePath` 作为用于磁盘存储的根目录。
    - 我们为按 ID 存储文章的条目创建了一个缓存：`articlesCache` 将 `Int` 键映射到 `Article` 值。
    - 然后我们为本地内存和磁盘资源提供大小约束。你可以在 [Ehcache 文档](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)中阅读有关这些参数的更多信息。
    - 最后，我们通过调用 `cacheManager.getCache()` 并提供名称、键和值类型来获取创建的缓存。

2.  要在缓存中使用，`Article` 类应可序列化并实现 `java.io.Serializable`。
    打开 `com/example/models/Article.kt` 并更新代码如下：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/models/Article.kt" include-lines="4-6"}

3.  现在我们准备实现 `DAOFacade` 的成员。
    回到 `DAOFacadeCacheImpl.kt`，添加以下方法：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DAOFacadeCacheImpl.kt" include-lines="30-50"}

    - `allArticles`：我们不尝试缓存所有文章；我们将其委托给主数据库。
    - `article`：当我们获取一篇文章时，我们首先检查它是否存在于缓存中，只有当它不存在时，我们才将其委托给主 `DAOFacade` 并将此文章添加到缓存中。
    - `addNewArticle`：当我们添加新文章时，我们将其委托给主 `DAOFacade`，但我们也将此文章添加到缓存中。
    - `editArticle`：当编辑现有文章时，我们同时更新缓存和数据库。
    - `deleteArticle`：删除时，我们需要同时从缓存和主数据库中删除文章。

### 初始化 DAOFacadeCacheImpl {id="init-dao-facade"}

让我们创建 `DAOFacadeCacheImpl` 的实例，并在应用程序启动前向数据库中插入一个示例文章：

1.  首先，打开 `DAOFacadeImpl.kt` 文件并删除文件底部的 `dao` 变量初始化。

2.  然后，打开 `com/example/plugins/Routing.kt` 并在 `configureRouting` 块中初始化 `dao` 变量：

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="11-24,73"}

    就是这样。
    你现在可以[运行应用程序](db-persistence.md#run_app)并确保一切都像以前一样正常工作。

> 你可以在这里找到包含连接池和缓存的完整示例：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。