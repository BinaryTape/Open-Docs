[//]: # (title: 使用 Exposed 实现数据库持久化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>使用的库</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>了解如何使用 Exposed ORM 框架为网站添加持久化功能。</link-summary>

在本系列教程中，我们将向您展示如何在 Ktor 中创建一个简单的博客应用程序：
- 在第一个教程中，我们展示了如何托管图片和 HTML 页面等静态内容。
- 在第二个教程中，我们使用 FreeMarker 模板引擎为应用程序添加了交互性。
- 在**本教程**中，我们将使用 Exposed 框架为我们的网站添加持久化功能。我们将使用 H2 本地数据库来存储文章。
- 在[下一个教程](db-connection-pooling-caching.md)中，我们将了解如何分别使用 HikariCP 和 Ehcache 库实现数据库连接池和缓存。

## 添加依赖 {id="add-dependencies"}

首先，您需要添加 Exposed 和 H2 库的依赖。打开 `gradle.properties` 文件并指定库版本：

```kotlin
```
{src="gradle.properties" include-lines="13-14"}

然后，打开 `build.gradle.kts` 并添加以下依赖：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/build.gradle.kts" include-lines="2-3,20-21,25-28,32"}

点击 `build.gradle.kts` 文件右上角的**加载 Gradle 更改**图标，以安装新添加的依赖。

## 更新模型 {id="model"}

Exposed 使用 `org.jetbrains.exposed.sql.Table` 类作为数据库表。要更新 `Article` 模型，请打开 `models/Article.kt` 文件并用以下代码替换现有代码：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/models/Article.kt"}

`id`、`title` 和 `body` 列将存储我们文章的信息。 `id` 列将作为主键。 

> 如果您[检查](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info) `Articles` 对象中属性的类型，您会发现它们具有带所需类型参数的 `Column` 类型：`id` 的类型为 `Column<Int>`，而 `title` 和 `body` 的类型都为 `Column<String>`。
> 
{type="tip"}

## 连接到数据库 {id="connect_db"}

[数据访问对象](https://en.wikipedia.org/wiki/Data_access_object) (DAO) 是一种模式，它提供了一个数据库接口，同时不暴露特定数据库的细节。我们稍后将定义一个 `DAOFacade` 接口，以抽象我们对数据库的具体请求。

每次使用 Exposed 访问数据库都通过获取数据库连接开始。为此，您需要将 JDBC URL 和驱动程序类名传递给 `Database.connect` 函数。在 `com.example` 中创建 `dao` 包，并添加一个新的 `DatabaseSingleton.kt` 文件。然后，插入此代码：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="1-13,17,21"}

> 请注意，`driverClassName` 和 `jdbcURL` 在此处是硬编码的。Ktor 允许您将此类设置提取到[自定义配置组](server-configuration-file.topic)中。

### 创建表 {id="create_table"}

获取连接后，所有 SQL 语句都应放在事务中： 

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

在此代码示例中，默认数据库被显式传递给 `transaction` 函数。如果您只有一个数据库，则可以省略它。在这种情况下，Exposed 会自动将上次连接的数据库用于事务。

> 请注意，`Database.connect` 函数在您调用事务之前不会建立真实的数据库连接——它只是为未来的连接创建一个描述符。

鉴于 `Articles` 表已经声明，我们可以在 `init` 函数的底部调用包裹在 `transaction` 调用中的 `SchemaUtils.create(Articles)`，以指示数据库在表尚不存在时创建该表：

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        SchemaUtils.create(Articles)
    }
}
```

### 执行查询 {id="queries"}

为了方便起见，让我们在 `DatabaseSingleton` 对象中创建一个实用函数 `dbQuery`，我们将在未来所有对数据库的请求中使用它。与其使用事务以阻塞方式访问它，不如利用协程并在自己的协程中启动每个查询：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="19-20"}

最终的 `DatabaseSingleton.kt` 文件应如下所示：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt"}

### 在启动时加载数据库配置 {id="startup"}

最后，我们需要在应用程序启动时加载创建的配置。打开 `Application.kt` 并从 `Application.module` 主体调用 `DatabaseSingleton.init`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/Application.kt" include-lines="3,8-13"}

## 实现持久化逻辑 {id="persistence_logic"}

现在，让我们创建一个接口来抽象更新文章所需的操作。在 `dao` 包中创建 `DAOFacade.kt` 文件，并用以下代码填充它：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacade.kt"}

我们需要列出所有文章，按 ID 查看文章，添加新文章，编辑或删除文章。由于所有这些函数都在底层执行数据库查询，因此它们被定义为挂起函数。

要实现 `DAOFacade` 接口，请将光标放在其名称上，点击此接口旁边的黄色灯泡图标并选择**实现接口**。在弹出的对话框中，保留默认设置并点击**确定**。 

在**实现成员**对话框中，选择所有函数并点击**确定**。 

![实现成员](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA 会在 `dao` 包中创建 `DAOFacadeImpl.kt` 文件。让我们使用 Exposed DSL 实现所有函数。

### 获取所有文章 {id="get_all"}

让我们从一个返回所有条目的函数开始。我们的请求被包装在 `dbQuery` 调用中。我们调用 `Table.selectAll` 扩展函数从数据库中获取所有数据。`Articles` 对象是 `Table` 的子类，因此我们使用 Exposed DSL 方法来处理它。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="1-18,45"}

`Table.selectAll` 返回一个 `Query` 实例，因此要获取 `Article` 实例列表，我们需要手动提取每行数据并将其转换为我们的数据类。我们通过使用辅助函数 `resultRowToArticle` 来实现这一点，该函数从 `ResultRow` 构建 `Article`。

`ResultRow` 提供了一种通过使用简洁的 `get` 运算符来获取存储在指定 `Column` 中的数据的方法，允许我们使用方括号语法，类似于数组或映射。

> `Articles.id` 的类型是 `Column<Int>`，它实现了 `Expression` 接口。这就是为什么我们可以将任何列作为表达式传递。

### 获取文章 {id="get_article"}

现在，让我们实现一个返回一篇文章的函数：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="20-25"}

`select` 函数接受一个扩展 lambda 作为参数。此 lambda 中的隐式接收器类型为 `SqlExpressionBuilder`。您不会显式使用此类型，但它定义了许多有用的列操作，您可以使用它们来构建查询。您可以使用比较（`eq`、`less`、`greater`）、算术运算（`plus`、`times`）、检查值是否属于或不属于提供的值列表（`inList`、`notInList`）、检查值是否为空或非空等等。

`select` 返回一个 `Query` 值列表。和以前一样，我们将其转换为文章。在我们的例子中，它应该是一篇文章，所以我们将其作为结果返回。

### 添加新文章 {id="add_article"}

要将新文章插入表中，请使用 `Table.insert` 函数，它接受一个 lambda 参数：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="27-33"}

在此 lambda 内部，我们指定哪个值应该设置到哪个列。`it` 参数的类型为 `InsertStatement`，我们可以调用其 `set` 运算符，该运算符接受列和值作为参数。

### 编辑文章 {id="edit_article"}

要更新现有文章，使用 `Table.update`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="35-40"}

### 删除文章 {id="delete_article"}

最后，使用 `Table.deleteWhere` 从数据库中删除文章：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="42-44"}

### 初始化 DAOFacade {id="init-dao-facade"}

让我们创建一个 `DAOFacade` 实例，并在应用程序启动前添加一个示例文章插入到数据库中。
将以下代码添加到 `DAOFacadeImpl.kt` 的底部：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="47-53"}

## 更新路由 {id="update_routes"}

现在，我们准备好在路由处理程序中使用已实现的数据库操作。打开 `plugins/Routing.kt` 文件。
要显示所有文章，在 `get` 处理程序中调用 `dao.allArticles`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="22-24"}

要发布新文章，在 `post` 中调用 `dao.addNewArticle` 函数：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="28-34"}

要获取用于显示和编辑的文章，分别在 `get("{id}")` 和 `get("{id}/edit")` 中使用 `dao.article`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="35-42"}

最后，转到 `post("{id}")` 处理程序，使用 `dao.editArticle` 更新文章，并使用 `dao.deleteArticle` 删除文章：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="43-58"}

> 您可以在此处找到本教程的最终项目：[tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## 运行应用程序 {id="run_app"}

让我们看看我们的日志应用程序是否按预期运行。我们可以通过点击 `Application.kt` 中 `fun main(...)` 旁边的**运行**按钮来运行我们的应用程序：

![运行服务器](run-app.png){width="706"}

IntelliJ IDEA 将启动应用程序，几秒钟后，我们应该会看到应用程序正在运行的确认信息：

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

在浏览器中打开 [`http://localhost:8080/`](http://localhost:8080/)，尝试创建、编辑和删除文章。文章将保存到 `build/db.mv.db` 文件中。在 IntelliJ IDEA 中，您可以在[数据库工具窗口](https://www.jetbrains.com/help/idea/database-tool-window.html)中查看此文件的内容。

![数据库工具窗口](tutorial_persistence_database_tool_window.png){width="706"}