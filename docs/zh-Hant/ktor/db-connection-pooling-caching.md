[//]: # (title: 連線池化與快取)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>使用的函式庫</b>：<a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>、<a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>了解如何實作資料庫連線池化與快取。</link-summary>

在[上一個教學](db-persistence.md)中，我們使用 Exposed 架構為網站新增了持久化功能。
在本教學中，我們將分別探討如何使用 HikariCP 與 Ehcache 函式庫來實作資料庫連線池化與快取。

## 新增相依性 {id="add-dependencies"}

首先，您需要新增 HikariCP 與 Ehcache 函式庫的相依性。
開啟 `gradle.properties` 檔案並指定函式庫版本：

```kotlin
h2_version = 2.3.232
hikaricp_version = 5.1.0
```

接著，開啟 `build.gradle.kts` 並新增以下相依性：

```kotlin

```

點擊 `build.gradle.kts` 檔案右上角的 **Load Gradle Changes** 圖示以安裝新新增的相依性。

## 連線池化 {id="connection-pooling"}

當 Exposed 在 `transaction` 呼叫的範圍內對資料庫進行第一次操作時，它會在每個 `transaction` 呼叫中啟動一個新的 JDBC 連線。
但建立多個 JDBC 連線是非常消耗資源的：重複使用現有連線有助於提高效能。
「連線池化」機制解決了這個問題。

在本節中，我們將使用 HikariCP 架構來管理應用程式中的 JDBC 連線池化。

### 將連線設定擷取至配置檔案中 {id="connection-settings-config"}

在[上一個教學](db-persistence.md#connect_db)中，我們在 `com/example/dao/DatabaseSingleton.kt` 檔案中使用了寫死的 `driverClassName` 與 `jdbcURL` 來建立資料庫連線：

```kotlin

```

讓我們將資料庫連線設定擷取到[自訂配置群組](server-configuration-file.topic)中。

1. 開啟 `src/main/resources/application.conf` 檔案，並在 `ktor` 群組之外新增 `storage` 群組，如下所示：

   ```kotlin
   
   ```

2. 開啟 `com/example/dao/DatabaseSingleton.kt` 並更新 `init` 函式，以便從配置檔案載入儲存設定：

   ```kotlin
   
   ```
   
   `init` 函式現在接受 `ApplicationConfig` 並使用 `config.property` 來載入自訂設定。

3. 最後，開啟 `com/example/Application.kt` 並將 `environment.config` 傳遞給 `DatabaseSingleton.init`，以便在應用程式啟動時載入連線設定：

   ```kotlin
   
   ```

### 啟用連線池化 {id="enable-connection-pooling"}

若要在 Exposed 中啟用連線池化，您需要提供 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html) 作為 `Database.connect` 函式的參數。
HikariCP 提供了實作 `DataSource` 介面的 `HikariDataSource` 類別。

1. 若要建立 `HikariDataSource`，請開啟 `com/example/dao/DatabaseSingleton.kt` 並將 `createHikariDataSource` 函式新增到 `DatabaseSingleton` 物件中：

   ```kotlin
   
   ```

   以下是關於資料源設定的一些說明：
     - `createHikariDataSource` 函式將驅動程式類別名稱與資料庫 URL 作為參數。
     - `maximumPoolSize` 屬性指定連線池可以達到的最大大小。
     - `isAutoCommit` 與 `transactionIsolation` 的設定是為了與 Exposed 使用的預設設定保持同步。

2. 若要使用 `HikariDataSource`，請將其傳遞給 `Database.connect` 函式：

   ```kotlin
   
   ```

   您現在可以[執行應用程式](db-persistence.md#run_app)並確保一切運作如常。

## 快取 {id="caching"}

您可以使用資料庫快取來補充資料庫。
快取是一種技術，能夠將常用資料儲存在暫時記憶體中，並可以減少資料庫的工作負載，以及讀取常用資料的時間。

在本教學中，我們將使用 Ehcache 函式庫來在檔案中組織快取。

### 將快取檔案路徑新增到配置中 {id="cache-file-path"}

開啟 `src/main/resources/application.conf` 檔案，並將 `ehcacheFilePath` 屬性新增到 `storage` 群組：

```kotlin

```

此屬性指定用於儲存快取資料的檔案路徑。
我們稍後將使用它來配置用於處理快取的 `DAOFacade` 實作。

### 實作快取 {id="implement-caching"}

若要實作快取，我們需要提供另一個 `DAOFacade` 實作，該實作會從快取中傳回值，如果快取中沒有該值，則將其委派給資料庫介面。

1. 在 `com.example.dao` 套件中建立一個新的 `DAOFacadeCacheImpl.kt` 檔案，並將以下實作新增到其中：

   ```kotlin
   
   ```

   以下是此程式碼範例的簡要概述：
     - 為了初始化與配置快取，我們定義了一個 Ehcache `CacheManager` 執行個體。我們提供 `storagePath` 作為磁碟儲存使用的根目錄。
     - 我們為項目的儲存建立了一個快取，該快取按文章的 ID 儲存文章：`articlesCache` 將 `Int` 鍵對應到 `Article` 值。
     - 然後我們為本機記憶體與磁碟資源提供大小約束。您可以在 [Ehcache 文件](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)中閱讀有關這些參數的更多資訊。
     - 最後，我們透過呼叫 `cacheManager.getCache()` 並提供名稱、鍵與值型別來獲取已建立的快取。

2. 若要在快取中使用，`Article` 類別應該是可序列化的，並且實作 `java.io.Serializable`。
   開啟 `com/example/models/Article.kt` 並按如下方式更新程式碼：

   ```kotlin
   
   ```

3. 現在我們準備好實作 `DAOFacade` 的成員了。
   回到 `DAOFacadeCacheImpl.kt`，新增以下方法：

   ```kotlin
   
   ```

   - `allArticles`：我們不嘗試快取所有文章；我們將此操作委派給主資料庫。
   - `article`：當我們獲取文章時，我們會先檢查它是否存在於快取中，只有在不存在的情況下，我們才會將此操作委派給主 `DAOFacade` 並將該文章新增到快取中。
   - `addNewArticle`：當我們新增新文章時，我們將其委派給主 `DAOFacade`，但我們也會將該文章新增到快取中。
   - `editArticle`：編輯現有文章時，我們會同時更新快取與資料庫。
   - `deleteArticle`：刪除時，我們需要同時從快取與主資料庫中刪除文章。

### 初始化 DAOFacadeCacheImpl {id="init-dao-facade"}

讓我們建立一個 `DAOFacadeCacheImpl` 執行個體，並在應用程式啟動前新增一個要插入資料庫的範例文章：

1. 首先，開啟 `DAOFacadeImpl.kt` 檔案，並移除檔案底部的 `dao` 變數初始化。

2. 然後，開啟 `com/example/plugins/Routing.kt` 並在 `configureRouting` 區塊內初始化 `dao` 變數：

   ```kotlin
   
   ```

   大功告成。
   您現在可以[執行應用程式](db-persistence.md#run_app)並確保一切運作如常。

> 您可以在此處找到包含連線池化與快取的完整範例：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。