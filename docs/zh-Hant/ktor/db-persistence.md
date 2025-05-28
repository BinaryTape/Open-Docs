[//]: # (title: 使用 Exposed 進行資料庫持久化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>使用的函式庫</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>學習如何使用 Exposed ORM 框架為網站新增持久化功能。</link-summary>

在本系列教學中，我們將向您展示如何在 Ktor 中建立一個簡單的部落格應用程式：
- 在第一個教學中，我們展示了如何託管圖片和 HTML 頁面等靜態內容。
- 在第二個教學中，我們使用 FreeMarker 模板引擎為應用程式新增了互動性。
- 在 **本教學中**，我們將使用 Exposed 框架為網站新增持久化功能。我們將使用 H2 本地資料庫來儲存文章。
- 在[下一個教學](db-connection-pooling-caching.md)中，我們將分別探討如何使用 HikariCP 和 Ehcache 函式庫來實作資料庫連線池和快取。

## 新增依賴項 {id="add-dependencies"}

首先，您需要為 Exposed 和 H2 函式庫新增依賴項。開啟 `gradle.properties` 檔案並指定函式庫版本：

```kotlin
```
{src="gradle.properties" include-lines="13-14"}

然後，開啟 `build.gradle.kts` 並新增以下依賴項：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/build.gradle.kts" include-lines="2-3,20-21,25-28,32"}

點擊 `build.gradle.kts` 檔案右上角的 **Load Gradle Changes** 圖示，以安裝新加入的依賴項。

## 更新模型 {id="model"}

Exposed 使用 `org.jetbrains.exposed.sql.Table` 類別作為資料庫表格。若要更新 `Article` 模型，請開啟 `models/Article.kt` 檔案並將現有程式碼替換為以下內容：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/models/Article.kt"}

`id`、`title` 和 `body` 欄位將儲存我們文章的資訊。`id` 欄位將作為主鍵。

> 如果您[檢查](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info) `Articles` 物件中屬性的類型，您會發現它們具有帶有所需類型引數的 `Column` 類型：`id` 的類型是 `Column<Int>`，而 `title` 和 `body` 的類型都是 `Column<String>`。
>
{type="tip"}

## 連線到資料庫 {id="connect_db"}

[資料存取物件](https://en.wikipedia.org/wiki/Data_access_object) (DAO) 是一種模式，它提供資料庫介面，而無需暴露特定資料庫的細節。我們稍後將定義一個 `DAOFacade` 介面，以抽象化我們對資料庫的特定請求。

每次使用 Exposed 存取資料庫時，都需先取得資料庫連線。為此，您需將 JDBC URL 和驅動程式類別名稱傳遞給 `Database.connect` 函數。在 `com.example` 內部建立 `dao` 套件並新增一個 `DatabaseSingleton.kt` 檔案。然後，插入以下程式碼：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="1-13,17,21"}

> 請注意，`driverClassName` 和 `jdbcURL` 在這裡被硬編碼。Ktor 允許您將此類設定提取到[自訂配置組](server-configuration-file.topic)。

### 建立表格 {id="create_table"}

取得連線後，所有 SQL 語句都應置於事務 (transaction) 內部：

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

在此程式碼範例中，預設資料庫會明確地傳遞給 `transaction` 函數。如果您只有一個資料庫，則可以省略它。在這種情況下，Exposed 會自動使用最後連線的資料庫進行事務。

> 請注意，`Database.connect` 函數在您呼叫事務之前不會建立真正的資料庫連線 — 它只為未來的連線建立一個描述符。

鑑於 `Articles` 表格已聲明，我們可以在 `init` 函數底部呼叫包裝在 `transaction` 呼叫中的 `SchemaUtils.create(Articles)`，以指示資料庫在不存在時建立此表格：

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        SchemaUtils.create(Articles)
    }
}
```

### 執行查詢 {id="queries"}

為了我們的方便，讓咱們在 `DatabaseSingleton` 物件內部建立一個工具函數 `dbQuery`，我們將在未來所有對資料庫的請求中使用它。不要以阻塞方式使用事務來存取它，讓咱們利用協程 (coroutines) 並在它自己的協程中啟動每個查詢：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="19-20"}

最終的 `DatabaseSingleton.kt` 檔案應如下所示：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt"}

### 在啟動時載入資料庫配置 {id="startup"}

最後，我們需要在應用程式啟動時載入建立的配置。開啟 `Application.kt` 並從 `Application.module` 主體中呼叫 `DatabaseSingleton.init`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/Application.kt" include-lines="3,8-13"}

## 實作持久化邏輯 {id="persistence_logic"}

現在，讓我們建立一個介面來抽象化更新文章所需的運算。在 `dao` 套件內部建立 `DAOFacade.kt` 檔案，並填入以下程式碼：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacade.kt"}

我們需要列出所有文章、按 ID 檢視文章、新增文章、編輯或刪除文章。由於所有這些函數都在底層執行資料庫查詢，因此它們被定義為掛起函數 (suspending functions)。

若要實作 `DAOFacade` 介面，請將游標放在其名稱上，點擊該介面旁邊的黃色燈泡圖示，然後選擇 **Implement interface**。在呼叫的對話方塊中，保留預設設定，然後點擊 **OK**。

在 **Implement Members** 對話方塊中，選擇所有函數，然後點擊 **OK**。

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA 在 `dao` 套件內部建立 `DAOFacadeImpl.kt` 檔案。讓我們使用 Exposed DSL 實作所有函數。

### 取得所有文章 {id="get_all"}

讓咱們從一個返回所有條目的函數開始。我們的請求被包裝在 `dbQuery` 呼叫中。我們呼叫 `Table.selectAll` 擴充函數以從資料庫中取得所有資料。`Articles` 物件是 `Table` 的子類別，因此我們使用 Exposed DSL 方法來處理它。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="1-18,45"}

`Table.selectAll` 返回一個 `Query` 實例，因此為了取得 `Article` 實例的列表，我們需要手動提取每一行的資料並將其轉換為我們的資料類別 (data class)。我們使用輔助函數 `resultRowToArticle` 來完成此操作，該函數從 `ResultRow` 建構一個 `Article`。

`ResultRow` 提供了一種透過使用簡潔的 `get` 運算子來取得儲存在指定 `Column` 中的資料的方法，它允許我們使用括號語法，類似於陣列或映射。

> `Articles.id` 的類型是 `Column<Int>`，它實作了 `Expression` 介面。這就是為什麼我們可以將任何欄位作為表達式傳遞。

### 取得一篇文章 {id="get_article"}

現在讓咱們實作一個返回單篇文章的函數：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="20-25"}

`select` 函數接受一個擴充 lambda 作為引數。此 lambda 內部的隱式接收器類型為 `SqlExpressionBuilder`。您不會明確使用此類型，但它定義了許多對欄位有用的操作，您可以使用這些操作來建構您的查詢。您可以使用比較運算 (`eq`, `less`, `greater`)、算術運算 (`plus`, `times`)、檢查值是否屬於或不屬於提供的數值列表 (`inList`, `notInList`)、檢查值是否為 null 或非 null，以及更多。

`select` 返回一個 `Query` 值列表。和以前一樣，我們將它們轉換為文章。在我們的情況下，它應該是一篇文章，所以我們將其作為結果返回。

### 新增文章 {id="add_article"}

若要向表格中插入新文章，請使用接受 lambda 引數的 `Table.insert` 函數：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="27-33"}

在此 lambda 內部，我們指定哪個值應該設定給哪個欄位。`it` 引數的類型是 `InsertStatement`，我們可以在其上呼叫 `set` 運算子，該運算子接受欄位和值作為引數。

### 編輯文章 {id="edit_article"}

若要更新現有文章，請使用 `Table.update`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="35-40"}

### 刪除文章 {id="delete_article"}

最後，使用 `Table.deleteWhere` 從資料庫中刪除文章：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="42-44"}

### 初始化 DAOFacade {id="init-dao-facade"}

讓咱們建立一個 `DAOFacade` 實例，並在應用程式啟動之前新增一篇範例文章到資料庫中。
在 `DAOFacadeImpl.kt` 底部新增以下程式碼：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="47-53"}

## 更新路由 {id="update_routes"}

現在我們準備好在路由處理器內部使用已實作的資料庫操作了。
開啟 `plugins/Routing.kt` 檔案。
若要顯示所有文章，請在 `get` 處理器內部呼叫 `dao.allArticles`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="22-24"}

若要發佈新文章，請在 `post` 內部呼叫 `dao.addNewArticle` 函數：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="28-34"}

若要取得文章以供顯示和編輯，請分別在 `get("{id}")` 和 `get("{id}/edit")` 內部使用 `dao.article`：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="35-42"}

最後，前往 `post("{id}")` 處理器，並使用 `dao.editArticle` 更新文章和 `dao.deleteArticle` 刪除文章：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="43-58"}

> 您可以在此處找到本教學的最終專案：[tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## 執行應用程式 {id="run_app"}

讓咱們看看我們的日誌應用程式是否按預期執行。我們可以透過點擊 `Application.kt` 中 `fun main(...)` 旁邊的 **Run** 按鈕來執行我們的應用程式：

![Run Server](run-app.png){width="706"}

IntelliJ IDEA 將啟動應用程式，幾秒鐘後，我們應該會看到應用程式正在執行的確認訊息：

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

在瀏覽器中開啟 [`http://localhost:8080/`](http://localhost:8080/)，並嘗試建立、編輯和刪除文章。文章將儲存在 `build/db.mv.db` 檔案中。在 IntelliJ IDEA 中，您可以在[資料庫工具視窗](https://www.jetbrains.com/help/idea/database-tool-window.html)中檢視此檔案的內容。

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}