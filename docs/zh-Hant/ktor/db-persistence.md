[//]: # (title: 使用 Exposed 實現資料庫持久化)

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
<b>使用函式庫</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>學習如何使用 Exposed ORM 框架為網站添加持久化功能。</link-summary>

在本系列教學中，我們將向您展示如何在 Ktor 中建立一個簡單的部落格應用程式：
- 在第一個教學中，我們展示了如何託管圖片和 HTML 頁面等靜態內容。
- 在第二個教學中，我們使用 FreeMarker 模板引擎為應用程式添加了互動性。
- 在**此教學**中，我們將使用 Exposed 框架為我們的網站添加持久化功能。我們將使用 H2 本地資料庫來儲存文章。
- 在[下一個教學](db-connection-pooling-caching.md)中，我們將探討如何分別使用 HikariCP 和 Ehcache 函式庫來實作資料庫連線池和快取。

## 添加依賴 {id="add-dependencies"}

首先，您需要為 Exposed 和 H2 函式庫添加依賴。開啟 `gradle.properties` 檔案並指定函式庫版本：

[object Promise]

然後，開啟 `build.gradle.kts` 並添加以下依賴：

[object Promise]

點擊 `build.gradle.kts` 檔案右上角的 **Load Gradle Changes** 圖示來安裝新添加的依賴。

## 更新模型 {id="model"}

Exposed 使用 `org.jetbrains.exposed.sql.Table` 類別作為資料庫表格。要更新 `Article` 模型，請開啟 `models/Article.kt` 檔案並將現有程式碼替換為以下內容：

[object Promise]

`id`、`title` 和 `body` 欄位將儲存我們的文章資訊。`id` 欄位將作為主鍵。

> 如果您[檢查 `Articles` 物件中屬性的類型](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)，您將會看到它們具有 `Column` 類型以及必要的類型參數：`id` 的類型是 `Column<Int>`，而 `title` 和 `body` 的類型都是 `Column<String>`。
> 
{type="tip"}

## 連線到資料庫 {id="connect_db"}

[資料存取物件](https://en.wikipedia.org/wiki/Data_access_object) (DAO) 是一種提供資料庫介面而不暴露特定資料庫細節的模式。我們稍後將定義一個 `DAOFacade` 介面來抽象我們對資料庫的特定請求。

使用 Exposed 的每次資料庫存取都從取得資料庫連線開始。為此，您將 JDBC URL 和驅動程式類別名稱傳遞給 `Database.connect` 函式。在 `com.example` 內部建立 `dao` 套件並添加一個新的 `DatabaseSingleton.kt` 檔案。然後，插入這段程式碼：

[object Promise]

> 請注意，`driverClassName` 和 `jdbcURL` 在此處是硬編碼的。Ktor 允許您將這些設定提取到[自訂組態群組](server-configuration-file.topic)。

### 建立表格 {id="create_table"}

取得連線後，所有 SQL 語句都應置於交易中：

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // 在此處的語句
    }
}
```

在此程式碼範例中，預設資料庫被明確地傳遞給 `transaction` 函式。如果您只有一個資料庫，則可以省略它。在這種情況下，Exposed 會自動使用上次連線的資料庫進行交易。

> 請注意，`Database.connect` 函式在您呼叫交易之前不會建立實際的資料庫連線——它只會為未來的連線建立一個描述符。

鑑於 `Articles` 表格已宣告，我們可以在 `init` 函式底部呼叫 `SchemaUtils.create(Articles)` 並將其包裝在 `transaction` 呼叫中，以指示資料庫在不存在時建立此表格：

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

為方便起見，我們在 `DatabaseSingleton` 物件內部建立一個實用函式 `dbQuery`，我們將其用於未來所有對資料庫的請求。與其以阻塞方式使用交易來存取它，不如利用協程並在每個查詢的自己的協程中啟動：

[object Promise]

最終的 `DatabaseSingleton.kt` 檔案應如下所示：

[object Promise]

### 在啟動時載入資料庫組態 {id="startup"}

最後，我們需要在應用程式啟動時載入建立的組態。開啟 `Application.kt` 並從 `Application.module` 主體中呼叫 `DatabaseSingleton.init`：

[object Promise]

## 實作持久化邏輯 {id="persistence_logic"}

現在讓我們建立一個介面來抽象更新文章所需的作業。在 `dao` 套件內部建立 `DAOFacade.kt` 檔案，並用以下程式碼填入：

[object Promise]

我們需要列出所有文章，依 ID 查看文章，新增文章，編輯或刪除文章。由於所有這些函式在底層都執行資料庫查詢，因此它們被定義為暫停函式。

要實作 `DAOFacade` 介面，請將游標放在其名稱上，點擊介面旁邊的黃色燈泡圖示，然後選擇 **Implement interface** (實作介面)。在叫出的對話方塊中，保留預設設定並點擊 **OK**。

在 **Implement Members** (實作成員) 對話方塊中，選擇所有函式並點擊 **OK**。

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA 會在 `dao` 套件內部建立 `DAOFacadeImpl.kt` 檔案。讓我們使用 Exposed DSL 來實作所有函式。

### 取得所有文章 {id="get_all"}

讓我們從一個返回所有條目的函式開始。我們的請求被包裝在 `dbQuery` 呼叫中。我們呼叫 `Table.selectAll` 擴充函式以從資料庫中獲取所有資料。`Articles` 物件是 `Table` 的子類別，因此我們使用 Exposed DSL 方法來處理它。

[object Promise]

`Table.selectAll` 返回一個 `Query` 的實例，因此要獲取 `Article` 實例的列表，我們需要手動提取每一行的資料並將其轉換為我們的資料類別。我們通過使用幫助函式 `resultRowToArticle` 來完成此操作，該函式從 `ResultRow` 構建一個 `Article`。

`ResultRow` 提供了一種通過使用簡潔的 `get` 運算子來獲取指定 `Column` 中儲存的資料的方法，允許我們使用類似於陣列或映射的方括號語法。

> `Articles.id` 的類型是 `Column<Int>`，它實作了 `Expression` 介面。這就是為什麼我們可以將任何欄位作為表達式傳遞的原因。

### 取得一篇文章 {id="get_article"}

現在讓我們實作一個返回一篇文章的函式：

[object Promise]

`select` 函式接受一個擴充 lambda 作為參數。此 lambda 內部隱含的接收者類型為 `SqlExpressionBuilder`。您不會明確使用此類型，但它定義了許多對欄位有用的操作，您可以使用這些操作來建立查詢。您可以使用比較 (`eq`、`less`、`greater`)、算術運算 (`plus`、`times`)、檢查值是否屬於或不屬於提供的數值列表 (`inList`、`notInList`)、檢查值是否為 null 或非 null 等等。

`select` 返回一個 `Query` 值的列表。和以前一樣，我們將它們轉換為文章。在我們的情況下，它應該是一篇文章，所以我們將其作為結果返回。

### 新增文章 {id="add_article"}

要將新文章插入表格，請使用 `Table.insert` 函式，它接受一個 lambda 參數：

[object Promise]

在此 lambda 內部，我們指定哪個值應該設定給哪個欄位。`it` 參數的類型為 `InsertStatement`，我們可以在其上呼叫 `set` 運算子，它接受欄位和值作為參數。

### 編輯文章 {id="edit_article"}

要更新現有文章，請使用 `Table.update`：

[object Promise]

### 刪除文章 {id="delete_article"}

最後，使用 `Table.deleteWhere` 從資料庫中移除文章：

[object Promise]

### 初始化 DAOFacade {id="init-dao-facade"}

讓我們建立一個 `DAOFacade` 實例，並添加一個範例文章，以便在應用程式啟動前將其插入到資料庫中。
將以下程式碼添加到 `DAOFacadeImpl.kt` 底部：

[object Promise]

## 更新路由 {id="update_routes"}

現在我們準備好在路由處理器內部使用已實作的資料庫操作。
開啟 `plugins/Routing.kt` 檔案。
要顯示所有文章，請在 `get` 處理器內部呼叫 `dao.allArticles`：

[object Promise]

要發布新文章，請在 `post` 內部呼叫 `dao.addNewArticle` 函式：

[object Promise]

要取得用於顯示和編輯的文章，請分別在 `get("{id}")` 和 `get("{id}/edit")` 內部使用 `dao.article`：

[object Promise]

最後，前往 `post("{id}")` 處理器，並使用 `dao.editArticle` 來更新文章，使用 `dao.deleteArticle` 來刪除文章：

[object Promise]

> 您可以在此處找到此教學的最終專案：[tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## 執行應用程式 {id="run_app"}

讓我們看看我們的日誌應用程式是否按預期執行。我們可以透過點擊 `Application.kt` 中 `fun main(...)` 旁邊的 **Run** (執行) 按鈕來執行我們的應用程式：

![Run Server](run-app.png){width="706"}

IntelliJ IDEA 將啟動應用程式，幾秒鐘後，我們應該會看到應用程式正在執行的確認訊息：

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

在瀏覽器中開啟 [`http://localhost:8080/`](http://localhost:8080/) 並嘗試建立、編輯和刪除文章。文章將儲存在 `build/db.mv.db` 檔案中。在 IntelliJ IDEA 中，您可以在[資料庫工具視窗](https://www.jetbrains.com/help/idea/database-tool-window.html)中查看此檔案的內容。

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}