[//]: # (title: 連線池與快取)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>使用的函式庫</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>了解如何實作資料庫連線池與快取。</link-summary>

在[上一篇教學](db-persistence.md)中，我們使用 Exposed 框架為網站增加了持久性。
在本教學中，我們將分別探討如何使用 HikariCP 和 Ehcache 函式庫來實作資料庫連線池和快取。

## 新增依賴項 {id="add-dependencies"}

首先，你需要為 HikariCP 和 Ehcache 函式庫新增依賴項。
開啟 `gradle.properties` 檔案並指定函式庫版本：

[object Promise]

然後，開啟 `build.gradle.kts` 並新增以下依賴項：

[object Promise]

點擊 `build.gradle.kts` 檔案右上角的「**載入 Gradle 變更**」圖示以安裝新增加的依賴項。

## 連線池 {id="connection-pooling"}

當 Exposed 在 `transaction` 的範圍內對資料庫進行第一次操作時，它會在每個 `transaction` 呼叫中啟動一個新的 JDBC 連線。
但是，建立多個 JDBC 連線會消耗大量資源：重複使用現有連線有助於提升效能。
_連線池_ 機制解決了這個問題。

在本節中，我們將使用 HikariCP 框架來管理應用程式中的 JDBC 連線池。

### 將連線設定提取到設定檔中 {id="connection-settings-config"}

在[上一篇教學](db-persistence.md#connect_db)中，我們在 `com/example/dao/DatabaseSingleton.kt` 檔案中使用了硬編碼的 `driverClassName` 和 `jdbcURL` 來建立資料庫連線：

[object Promise]

讓我們將資料庫連線設定提取到[自訂設定群組](server-configuration-file.topic)。

1. 開啟 `src/main/resources/application.conf` 檔案，並在 `ktor` 群組外部新增 `storage` 群組，如下所示：

   [object Promise]

2. 開啟 `com/example/dao/DatabaseSingleton.kt` 並更新 `init` 函數以從設定檔載入儲存設定：

   [object Promise]
   
   現在 `init` 函數接受 `ApplicationConfig` 並使用 `config.property` 來載入自訂設定。

3. 最後，開啟 `com/example/Application.kt` 並將 `environment.config` 傳遞給 `DatabaseSingleton.init`，以便在應用程式啟動時載入連線設定：

   [object Promise]

### 啟用連線池 {id="enable-connection-pooling"}

要在 Exposed 中啟用連線池，你需要將 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html) 作為參數傳遞給 `Database.connect` 函數。
HikariCP 提供了實作 `DataSource` 介面的 `HikariDataSource` 類別。

1. 若要建立 `HikariDataSource`，請開啟 `com/example/dao/DatabaseSingleton.kt` 並將 `createHikariDataSource` 函數新增到 `DatabaseSingleton` 物件中：

   [object Promise]

   以下是關於資料來源設定的一些注意事項：
     - `createHikariDataSource` 函數接受驅動程式類別名稱和資料庫 URL 作為參數。
     - `maximumPoolSize` 屬性指定了連線池可以達到的最大大小。
     - `isAutoCommit` 和 `transactionIsolation` 設定為與 Exposed 使用的預設設定同步。

2. 若要使用 `HikariDataSource`，請將其傳遞給 `Database.connect` 函數：

   [object Promise]

   你現在可以[執行應用程式](db-persistence.md#run_app)並確保一切運作正常如前。

## 快取 {id="caching"}

你可以使用資料庫快取來補充資料庫。
快取是一種技術，能夠將經常使用的資料儲存在臨時記憶體中，可以減少資料庫的工作負載以及讀取經常需要的資料的時間。

在本教學中，我們將使用 Ehcache 函式庫以檔案形式組織快取。

### 將快取檔案路徑新增到設定中 {id="cache-file-path"}

開啟 `src/main/resources/application.conf` 檔案，並將 `ehcacheFilePath` 屬性新增到 `storage` 群組：

[object Promise]

此屬性指定用於儲存快取資料的檔案路徑。
我們稍後將使用它來設定用於與快取協同工作的 `DAOFacade` 實作。

### 實作快取 {id="implement-caching"}

若要實作快取，我們需要提供另一個 `DAOFacade` 實作，該實作會從快取傳回值，如果沒有快取值，則將其委派給資料庫介面。

1. 在 `com.example.dao` 套件中建立一個新的 `DAOFacadeCacheImpl.kt` 檔案，並向其中新增以下實作：

   [object Promise]

   以下是此程式碼範例的簡要概述：
     - 若要初始化並設定快取，我們定義一個 Ehcache `CacheManager` 實例。我們提供 `storagePath` 作為用於磁碟儲存的根目錄。
     - 我們為依據 ID 儲存文章的條目建立一個快取：`articlesCache` 將 `Int` 鍵對應到 `Article` 值。
     - 然後我們為本機記憶體和磁碟資源提供大小限制。你可以在 [Ehcache 文件](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)中閱讀更多關於這些參數的資訊。
     - 最後，我們透過呼叫 `cacheManager.getCache()` 並提供名稱、鍵和值類型來取得建立的快取。

2. 若要在快取中使用，`Article` 類別應是可序列化的，並實作 `java.io.Serializable`。
   開啟 `com/example/models/Article.kt` 並將程式碼更新如下：

   [object Promise]

3. 現在我們準備實作 `DAOFacade` 的成員。
   回到 `DAOFacadeCacheImpl.kt`，新增以下方法：

   [object Promise]

   - `allArticles`：我們不嘗試快取所有文章；我們將此委派給主資料庫。
   - `article`：當我們取得一篇文章時，我們首先檢查它是否存在於快取中，只有在不存在的情況下，我們才將此委派給主 `DAOFacade`，並將此文章新增到快取中。
   - `addNewArticle`：當我們新增一篇文章時，我們將其委派給主 `DAOFacade`，但我們也將此文章新增到快取中。
   - `editArticle`：編輯現有文章時，我們同時更新快取和資料庫。
   - `deleteArticle`：刪除時，我們需要同時從快取和主資料庫中刪除文章。

### 初始化 DAOFacadeCacheImpl {id="init-dao-facade"}

讓我們建立一個 `DAOFacadeCacheImpl` 實例，並在應用程式啟動前新增一篇範例文章以插入到資料庫中：

1. 首先，開啟 `DAOFacadeImpl.kt` 檔案並移除檔案底部的 `dao` 變數初始化。

2. 然後，開啟 `com/example/plugins/Routing.kt` 並在 `configureRouting` 區塊內初始化 `dao` 變數：

   [object Promise]

就這些了。
你現在可以[執行應用程式](db-persistence.md#run_app)並確保一切運作正常如前。

> 你可以在此處找到包含連線池和快取的完整範例：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。