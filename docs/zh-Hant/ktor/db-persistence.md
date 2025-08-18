[//]: # (title: 使用 Exposed 實現資料庫持久性)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>使用的函式庫</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>學習如何使用 Exposed ORM 框架為網站新增持久性。</link-summary>

在本系列教程中，我們將向您展示如何在 Ktor 中建立一個簡單的部落格應用程式：
- 在第一個教程中，我們展示了如何託管靜態內容，如圖片和 HTML 頁面。
- 在第二個教程中，我們使用 FreeMarker 模板引擎為應用程式新增了互動性。
- 在**本教程**中，我們將使用 Exposed 框架為網站新增持久性。我們將使用 H2 本地資料庫來儲存文章。
- 在[下一個教程](db-connection-pooling-caching.md)中，我們將探討如何分別使用 HikariCP 和 Ehcache 函式庫實現資料庫連線池化和快取。

## 新增依賴項 {id="add-dependencies"}

首先，您需要新增 Exposed 和 H2 函式庫的依賴項。開啟 `gradle.properties` 檔案並指定函式庫版本：

```kotlin
exposed_version = 0.53.0
h2_version = 2.3.232
```

然後，開啟 `build.gradle.kts` 並新增以下依賴項：

```kotlin

```

點擊 `build.gradle.kts` 檔案右上角的 **載入 Gradle 變更** 圖示，以安裝新新增的依賴項。

## 更新模型 {id="model"}

Exposed 使用 `org.jetbrains.exposed.sql.Table` 類別作為資料庫表格。要更新 `Article` 模型，開啟 `models/Article.kt` 檔案並用以下程式碼替換現有程式碼：

```kotlin

```

`id`、`title` 和 `body` 欄位將儲存我們文章的資訊。`id` 欄位將作為主鍵。

> 如果您[檢查](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info) `Articles` 物件中屬性的類型，您會發現它們具有 `Column` 類型以及必要的類型引數：`id` 具有 `Column<Int>` 類型，而 `title` 和 `body` 都具有 `Column<String>` 類型。
> 
{type="tip"}

## 連線到資料庫 {id="connect_db"}

[資料存取物件](https://en.wikipedia.org/wiki/Data_access_object) (DAO) 是一種模式，提供資料庫介面而不會暴露特定資料庫的細節。我們稍後將定義一個 `DAOFacade` 介面，以抽象化我們對資料庫的特定請求。

每次使用 Exposed 存取資料庫都始於取得資料庫連線。為此，您將 JDBC URL 和驅動程式類別名稱傳遞給 `Database.connect` 函數。在 `com.example` 內部建立 `dao` 套件並新增一個 `DatabaseSingleton.kt` 檔案。然後，插入這段程式碼：

```kotlin

```

> 請注意，`driverClassName` 和 `jdbcURL` 在此處是硬編碼的。Ktor 允許您將此類設定提取到[自訂設定組](server-configuration-file.topic)。

### 建立表格 {id="create_table"}

取得連線後，所有 SQL 語句都應該放在事務中：

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

在此程式碼範例中，預設資料庫被明確傳遞給 `transaction` 函數。如果您只有一個資料庫，可以省略它。在這種情況下，Exposed 會自動使用最後連線的資料庫進行事務。

> 請注意，`Database.connect` 函數直到您呼叫事務才會建立實際的資料庫連線 — 它只為未來的連線建立一個描述符。

鑑於 `Articles` 表格已經宣告，我們可以將 `SchemaUtils.create(Articles)` 呼叫包裹在 `transaction` 呼叫中，放在 `init` 函數底部，以指示資料庫在該表格不存在時建立它：

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

為方便起見，讓我們在 `DatabaseSingleton` 物件中建立一個實用函數 `dbQuery`，我們將在所有未來對資料庫的請求中使用它。我們不使用事務以阻塞方式存取它，而是利用協程並在每個查詢的獨立協程中啟動它：

```kotlin

```

最終的 `DatabaseSingleton.kt` 檔案應如下所示：

```kotlin

```

### 在啟動時載入資料庫設定 {id="startup"}

最後，我們需要在應用程式啟動時載入建立的設定。開啟 `Application.kt` 並從 `Application.module` 主體呼叫 `DatabaseSingleton.init`：

```kotlin

```

## 實現持久性邏輯 {id="persistence_logic"}

現在讓我們建立一個介面來抽象化更新文章所需的操作。在 `dao` 套件中建立 `DAOFacade.kt` 檔案並填入以下程式碼：

```kotlin

```

我們需要列出所有文章、按 ID 查看文章、新增文章、編輯或刪除文章。由於所有這些函數在底層執行資料庫查詢，因此它們被定義為掛起函數。

要實現 `DAOFacade` 介面，請將游標放在其名稱上，點擊該介面旁邊的黃色燈泡圖示並選擇 **Implement interface**。在彈出的對話框中，保留預設設定並點擊 **OK**。

在 **Implement Members** 對話框中，選擇所有函數並點擊 **OK**。

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA 會在 `dao` 套件中建立 `DAOFacadeImpl.kt` 檔案。讓我們使用 Exposed DSL 實現所有函數。

### 獲取所有文章 {id="get_all"}

讓我們從一個返回所有條目的函數開始。我們的請求被包裝在 `dbQuery` 呼叫中。我們呼叫 `Table.selectAll` 擴充函數以從資料庫中獲取所有資料。`Articles` 物件是 `Table` 的子類別，因此我們使用 Exposed DSL 方法來操作它。

```kotlin

```

`Table.selectAll` 返回一個 `Query` 實例，因此要獲取 `Article` 實例列表，我們需要手動提取每行的資料並將其轉換為我們的資料類別。我們使用輔助函數 `resultRowToArticle` 來完成此操作，該函數從 `ResultRow` 構建一個 `Article`。

`ResultRow` 提供了一種使用簡潔的 `get` 運算符獲取指定 `Column` 中儲存資料的方法，允許我們使用類似於陣列或映射的方括號語法。

> `Articles.id` 的類型是 `Column<Int>`，它實現了 `Expression` 介面。這就是為什麼我們可以將任何欄位作為表達式傳遞的原因。
> 
{type="tip"}

### 獲取一篇文章 {id="get_article"}

現在讓我們實現一個返回一篇文章的函數：

```kotlin

```

`select` 函數接受一個擴充 lambda 作為引數。此 lambda 內的隱式接收器類型為 `SqlExpressionBuilder`。您不需要顯式使用此類型，但它定義了許多對欄位有用的操作，您可以使用這些操作來建構查詢。您可以使用比較 (`eq`、`less`、`greater`)、算術運算 (`plus`、`times`)、檢查值是否屬於或不屬於提供的清單 (`inList`、`notInList`)、檢查值是否為 null 或非 null，以及更多。

`select` 返回一個 `Query` 值列表。像以前一樣，我們將它們轉換為文章。在我們的情況下，它應該是一篇文章，所以我們將其作為結果返回。

### 新增文章 {id="add_article"}

要將新文章插入表格，請使用 `Table.insert` 函數，它接受一個 lambda 引數：

```kotlin

```

在這個 lambda 內部，我們指定哪個值應該設定給哪個欄位。`it` 引數的類型是 `InsertStatement`，我們可以在其上呼叫 `set` 運算符，該運算符接受欄位和值作為引數。

### 編輯文章 {id="edit_article"}

要更新現有文章，請使用 `Table.update`：

```kotlin

```

### 刪除文章 {id="delete_article"}

最後，使用 `Table.deleteWhere` 從資料庫中移除一篇文章：

```kotlin

```

### 初始化 DAOFacade {id="init-dao-facade"}

讓我們建立一個 `DAOFacade` 實例，並在應用程式啟動前將一篇範例文章插入資料庫。
在 `DAOFacadeImpl.kt` 底部新增以下程式碼：

```kotlin

```

## 更新路由 {id="update_routes"}

現在我們已準備好在路由處理器內部使用已實現的資料庫操作。
開啟 `plugins/Routing.kt` 檔案。
要顯示所有文章，請在 `get` 處理器內部呼叫 `dao.allArticles`：

```kotlin

```

要發佈新文章，請在 `post` 內部呼叫 `dao.addNewArticle` 函數：

```kotlin

```

要獲取用於顯示和編輯的文章，請分別在 `get("{id}")` 和 `get("{id}/edit")` 內部使用 `dao.article`：

```kotlin

```

最後，前往 `post("{id}")` 處理器並使用 `dao.editArticle` 更新文章，使用 `dao.deleteArticle` 刪除文章：

```kotlin

```

> 您可以在此處找到本教學課程的最終專案：[tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## 執行應用程式 {id="run_app"}

讓我們看看我們的日誌應用程式是否按預期執行。我們可以透過點擊 `Application.kt` 中 `fun main(...)` 旁邊的 **執行** 按鈕來執行我們的應用程式：

![Run Server](run-app.png){width="706"}

IntelliJ IDEA 將啟動應用程式，幾秒鐘後，我們應該會看到應用程式正在執行的確認訊息：

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

在瀏覽器中開啟 [`http://localhost:8080/`](http://localhost:8080/) 並嘗試建立、編輯和刪除文章。文章將儲存到 `build/db.mv.db` 檔案中。在 IntelliJ IDEA 中，您可以在[資料庫工具視窗](https://www.jetbrains.com/help/idea/database-tool-window.html)中查看此檔案的內容。

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}