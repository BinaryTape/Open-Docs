[//]: # (title: 使用 Exposed 進行資料庫持續性)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>使用的程式庫</b>：<a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>了解如何使用 Exposed ORM 架構為網站新增持續性。</link-summary>

在此系列教學中，我們將向您展示如何使用 Ktor 建立一個簡單的部落格應用程式：
- 在第一個教學中，我們展示了如何託管圖片和 HTML 頁面等靜態內容。
- 在第二個教學中，我們使用 FreeMarker 範本引擎為應用程式新增了互動性。
- 在**本教學**中，我們將使用 Exposed 架構為網站新增持續性。我們將使用 H2 本機資料庫來儲存文章。
- 在[下一個教學](db-connection-pooling-caching.md)中，我們將分別探討如何使用 HikariCP 和 Ehcache 程式庫來實作資料庫連線池和快取。

## 新增相依性 {id="add-dependencies"}

首先，您需要新增 Exposed 和 H2 程式庫的相依性。開啟 `gradle.properties` 檔案並指定程式庫版本：

```kotlin
kotlinx_serialization_version = 1.8.0
kotlin_css_version = 1.0.0-pre.721
```

然後，開啟 `build.gradle.kts` 並新增以下相依性：

```kotlin

```

按一下 `build.gradle.kts` 檔案右上角的 **Load Gradle Changes** 圖示以安裝新新增的相依性。

## 更新模型 {id="model"}

Exposed 使用 `org.jetbrains.exposed.sql.Table` 類別作為資料庫資料表。若要更新 `Article` 模型，請開啟 `models/Article.kt` 檔案，並將現有程式碼替換為以下內容：

```kotlin

```

`id`、`title` 和 `body` 欄位將儲存有關文章的資訊。`id` 欄位將作為主鍵。 

> 如果您[檢查屬性的型別](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)，您會看到它們具有帶有必要型別引數的 `Column` 型別：`id` 的型別為 `Column<Int>`，而 `title` 和 `body` 的型別均為 `Column<String>`。
> 
{type="tip"}

## 連接到資料庫 {id="connect_db"}

[資料存取物件](https://en.wikipedia.org/wiki/Data_access_object) (DAO) 是一種模式，它提供資料庫介面，而無需公開特定資料庫的詳細資訊。稍後我們將定義一個 `DAOFacade` 介面，以抽象化我們對資料庫的特定請求。

每次使用 Exposed 進行資料庫存取，都是從取得資料庫連線開始的。為此，您需要將 JDBC URL 和驅動程式類別名稱傳遞給 `Database.connect` 函式。在 `com.example` 內建立 `dao` 套件並新增一個新的 `DatabaseSingleton.kt` 檔案。然後，插入此程式碼：

```kotlin

```

> 請注意，這裡的 `driverClassName` 和 `jdbcURL` 是硬編碼的。Ktor 允許您將此類設定解壓到[自訂配置群組](server-configuration-file.topic)。

### 建立資料表 {id="create_table"}

取得連線後，所有 SQL 陳述式都應放在交易中： 

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // 在此處編寫陳述式
    }
}
```

在此程式碼範例中，預設資料庫會明確傳遞給 `transaction` 函式。如果您只有一個資料庫，則可以將其省略。在這種情況下，Exposed 會自動將最後連接的資料庫用於交易。

> 請注意，`Database.connect` 函式在您呼叫交易之前不會建立真實的資料庫連線——它僅建立未來連線的描述符。

鑑於 `Articles` 資料表已經宣告，我們可以在 `init` 函式底部呼叫包裹在 `transaction` 中的 `SchemaUtils.create(Articles)`，以指示資料庫建立此資料表（如果尚不存在）：

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

為了方便起見，讓我們在 `DatabaseSingleton` 物件中建立一個公用函式 `dbQuery`，我們將在未來所有對資料庫的請求中使用它。與其使用交易以阻塞方式存取，不如利用協同程式，並在各自的協同程式中啟動每個查詢：

```kotlin

```

產生的 `DatabaseSingleton.kt` 檔案應如下所示：

```kotlin

```

### 在啟動時載入資料庫配置 {id="startup"}

最後，我們需要在應用程式啟動時載入建立的配置。開啟 `Application.kt` 並從 `Application.module` 主體呼叫 `DatabaseSingleton.init`：

```kotlin

```

## 實作持續性邏輯 {id="persistence_logic"}

現在讓我們建立一個介面來抽象化更新文章所需的作業。在 `dao` 套件內建立 `DAOFacade.kt` 檔案並填入以下程式碼：

```kotlin

```

我們需要列出所有文章、按 ID 查看文章、新增新文章、編輯或刪除文章。由於所有這些函式在底層都會執行資料庫查詢，因此它們被定義為掛起函式。

若要實作 `DAOFacade` 介面，請將插入符號放在其名稱上，按一下該介面旁邊的黃色燈泡圖示，然後選取 **Implement interface**。在調用的對話方塊中，保留預設設定並按一下 **OK**。 

在 **Implement Members** 對話方塊中，選取所有函式並按一下 **OK**。 

![實作成員](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA 在 `dao` 套件中建立了 `DAOFacadeImpl.kt` 檔案。讓我們使用 Exposed DSL 實作所有函式。

### 取得所有文章 {id="get_all"}

讓我們從回傳所有項目的函式開始。我們的請求被包裹在 `dbQuery` 呼叫中。我們呼叫 `Table.selectAll` 擴充函式來從資料庫中取得所有資料。`Articles` 物件是 `Table` 的子類別，因此我們使用 Exposed DSL 方法來處理它。

```kotlin

```

`Table.selectAll` 回傳一個 `Query` 執行個體，因此要取得 `Article` 執行個體列表，我們需要手動提取每一行的資料並將其轉換為我們的資料類別。我們使用輔助函式 `resultRowToArticle` 來完成此操作，該函式從 `ResultRow` 建置一個 `Article`。

`ResultRow` 提供了一種使用簡潔的 `get` 運算子來取得存儲在指定 `Column` 中資料的方法，允許我們使用類似陣列或 Map 的方括號語法。

> `Articles.id` 的型別是 `Column<Int>`，它實作了 `Expression` 介面。這就是為什麼我們可以將任何欄位作為運算式傳遞。

### 取得單篇文章 {id="get_article"}

現在讓我們實作一個回傳一篇文章的函式：

```kotlin

```

`select` 函式接受一個擴充 Lambda 作為引數。此 Lambda 內部的隱含接收者型別為 `SqlExpressionBuilder`。您不會明確使用此型別，但它定義了一系列用於欄位的實用作業，您可以使用這些作業來建置查詢。您可以使用比較 (`eq`、`less`、`greater`)、算術運算 (`plus`、`times`)、檢查值是否屬於提供的值清單 (`inList`、`notInList`)、檢查值是否為 null 或非 null 等等。

`select` 回傳 `Query` 值的列表。和之前一樣，我們將它們轉換為文章。在我們的案例中，它應該是一篇文章，所以我們將其作為結果回傳。

### 新增新文章 {id="add_article"}

若要在資料表中插入新文章，請使用 `Table.insert` 函式，該函式接受一個 Lambda 引數：

```kotlin

```

在此 Lambda 內部，我們指定應為哪個欄位設定哪個值。`it` 引數具有 `InsertStatement` 型別，我們可以在其上呼叫接受欄位和值作為引數的 `set` 運算子。

### 編輯文章 {id="edit_article"}

若要更新現有文章，請使用 `Table.update`：

```kotlin

```

### 刪除文章 {id="delete_article"}

最後，使用 `Table.deleteWhere` 從資料庫中移除文章：

```kotlin

```

### 初始化 DAOFacade {id="init-dao-facade"}

讓我們建立一個 `DAOFacade` 執行個體，並在應用程式啟動前新增一個要插入資料庫的範例文章。
在 `DAOFacadeImpl.kt` 底部新增以下程式碼：

```kotlin

```

## 更新路由 {id="update_routes"}

現在我們準備好在路由處理常式中使用實作好的資料庫作業。
開啟 `plugins/Routing.kt` 檔案。
若要顯示所有文章，請在 `get` 處理常式中呼叫 `dao.allArticles`：

```kotlin

```

若要發佈新文章，請在 `post` 中呼叫 `dao.addNewArticle` 函式：

```kotlin

```

若要取得文章以進行顯示和編輯，請分別在 `get("{id}")` 和 `get("{id}/edit")` 中使用 `dao.article`：

```kotlin

```

最後，前往 `post("{id}")` 處理常式並使用 `dao.editArticle` 更新文章，使用 `dao.deleteArticle` 刪除文章：

```kotlin

```

> 您可以在此處找到本教學的最終專案：[tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## 執行應用程式 {id="run_app"}

讓我們看看我們的日誌應用程式是否如預期運作。我們可以透過按一下 `Application.kt` 中 `fun main(...)` 旁邊的 **Run** 按鈕來執行應用程式：

![執行伺服器](run-app.png){width="706"}

IntelliJ IDEA 將啟動應用程式，幾秒鐘後，我們應該會看到應用程式正在執行的確認：

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

在瀏覽器中開啟 [`http://localhost:8080/`](http://localhost:8080/) 並嘗試建立、編輯和刪除文章。文章將儲存在 `build/db.mv.db` 檔案中。在 IntelliJ IDEA 中，您可以在 [**Database** 工具視窗](https://www.jetbrains.com/help/idea/database-tool-window.html)中查看此檔案的內容。

![資料庫工具視窗](tutorial_persistence_database_tool_window.png){width="706"}