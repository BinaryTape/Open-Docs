[//]: # (title: 連線池化與快取)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>使用的函式庫</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>了解如何實作資料庫連線池化和快取。</link-summary>

在[前一個教學](db-persistence.md)中，我們使用 Exposed 框架為網站增加了永續性。
在本教學中，我們將分別探討如何使用 HikariCP 和 Ehcache 函式庫來實作資料庫連線池化和快取。

## 新增依賴項 {id="add-dependencies"}

首先，你需要為 HikariCP 和 Ehcache 函式庫新增依賴項。
開啟 `gradle.properties` 檔案並指定函式庫版本：

```kotlin
```
{src="gradle.properties" include-lines="16-17"}

然後，開啟 `build.gradle.kts` 並新增以下依賴項：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence-advanced/build.gradle.kts" include-lines="5-6,22-23,31-32,36"}

點擊 `build.gradle.kts` 檔案右上角的 **Load Gradle Changes** 圖示，以安裝新加入的依賴項。

## 連線池化 {id="connection-pooling"}

當 Exposed 在 `transaction` 範圍內首次對資料庫進行操作時，它會在每次 `transaction` 呼叫內部啟動一個新的 JDBC 連線。
但建立多個 JDBC 連線會消耗大量資源：重複使用現有連線有助於提高效能。
「連線池化 (connection pooling)」機制解決了這個問題。

在本節中，我們將使用 HikariCP 框架來管理應用程式中的 JDBC 連線池化。

### 將連線設定提取到設定檔中 {id="connection-settings-config"}

在[前一個教學](db-persistence.md#connect_db)中，我們在 `com/example/dao/DatabaseSingleton.kt` 檔案中使用了硬編碼的 `driverClassName` 和 `jdbcURL` 來建立資料庫連線：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="10-12,17"}

讓我們將資料庫連線設定提取到一個[自訂設定群組](server-configuration-file.topic)中。

1. 開啟 `src/main/resources/application.conf` 檔案，並在 `ktor` 群組之外新增 `storage` 群組，如下所示：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/resources/application.conf" include-lines="11-14,16"}

2. 開啟 `com/example/dao/DatabaseSingleton.kt` 並更新 `init` 函數，從設定檔載入儲存設定：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="5,10-18,23,39"}
   
   現在 `init` 函數接受 `ApplicationConfig` 並使用 `config.property` 載入自訂設定。

3. 最後，開啟 `com/example/Application.kt` 並將 `environment.config` 傳遞給 `DatabaseSingleton.init`，以便在應用程式啟動時載入連線設定：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/Application.kt" include-lines="9-13"}

### 啟用連線池化 {id="enable-connection-pooling"}

要在 Exposed 中啟用連線池化，你需要將 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html) 作為參數提供給 `Database.connect` 函數。
HikariCP 提供了實作 `DataSource` 介面的 `HikariDataSource` 類別。

1. 要建立 `HikariDataSource`，開啟 `com/example/dao/DatabaseSingleton.kt` 並將 `createHikariDataSource` 函數新增到 `DatabaseSingleton` 物件中：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="4,11-12,25-35,39"}

   以下是關於資料來源設定的一些注意事項：
     - `createHikariDataSource` 函數將驅動程式類別名稱和資料庫 URL 作為參數。
     - `maximumPoolSize` 屬性指定了連線池可以達到的最大大小。
     - `isAutoCommit` 和 `transactionIsolation` 的設定與 Exposed 使用的預設設定同步。

2. 要使用 `HikariDataSource`，將其傳遞給 `Database.connect` 函數：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="12-13,19,23,39"}

   你現在可以[執行應用程式](db-persistence.md#run_app)並確認一切運作正常。

## 快取 {id="caching"}

你可以為資料庫補充一個資料庫快取。
快取是一種將常用資料儲存在暫存記憶體中的技術，可以減少資料庫的工作負載並縮短讀取常用資料的時間。

在本教學中，我們將使用 Ehcache 函式庫將快取組織到檔案中。

### 將快取檔案路徑新增到設定中 {id="cache-file-path"}

開啟 `src/main/resources/application.conf` 檔案，並將 `ehcacheFilePath` 屬性新增到 `storage` 群組：

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence-advanced/src/main/resources/application.conf" include-lines="11,15-16"}

此屬性指定了用於儲存快取資料的檔案路徑。
我們稍後將使用它來配置 `DAOFacade` 實作，以便與快取協同工作。

### 實作快取 {id="implement-caching"}

要實作快取，我們需要提供另一個 `DAOFacade` 實作，它從快取中回傳值，如果沒有快取值，則將其委派給資料庫介面。

1. 在 `com.example.dao` 套件中建立一個新的 `DAOFacadeCacheImpl.kt` 檔案，並新增以下實作：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DAOFacadeCacheImpl.kt" include-lines="1-28,51"}

   以下是此程式碼範例的簡短概述：
     - 為了初始化和配置快取，我們定義了一個 Ehcache `CacheManager` 實例。我們提供 `storagePath` 作為用於磁碟儲存的根目錄。
     - 我們為按其 ID 儲存文章的條目建立一個快取：`articlesCache` 將 `Int` 鍵對應到 `Article` 值。
     - 然後我們為本機記憶體和磁碟資源提供大小限制。你可以在 [Ehcache 文件](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)中閱讀更多關於這些參數的資訊。
     - 最後，我們透過呼叫 `cacheManager.getCache()` 並提供名稱、鍵和值類型來取得已建立的快取。

2. 若要用於快取，`Article` 類別應該是可序列化的，並實作 `java.io.Serializable`。
   開啟 `com/example/models/Article.kt` 並按照以下方式更新程式碼：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/models/Article.kt" include-lines="4-6"}

3. 現在我們準備好實作 `DAOFacade` 的成員。
   回到 `DAOFacadeCacheImpl.kt`，新增以下方法：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DAOFacadeCacheImpl.kt" include-lines="30-50"}

   - `allArticles`：我們不嘗試快取所有文章；我們將此委派給主資料庫。
   - `article`：當我們取得一篇文章時，我們首先檢查它是否存在於快取中，只有在不存在的情況下，我們才將此委派給主要的 `DAOFacade` 並將這篇文章新增到快取中。
   - `addNewArticle`：當我們新增一篇文章時，我們將其委派給主要的 `DAOFacade`，但我們也將這篇文章新增到快取中。
   - `editArticle`：編輯現有文章時，我們同時更新快取和資料庫。
   - `deleteArticle`：刪除時，我們需要同時從快取和主資料庫中刪除文章。

### 初始化 DAOFacadeCacheImpl {id="init-dao-facade"}

讓我們建立一個 `DAOFacadeCacheImpl` 實例，並在應用程式啟動之前新增一個範例文章插入資料庫：

1. 首先，開啟 `DAOFacadeImpl.kt` 檔案並移除檔案底部的 `dao` 變數初始化。

2. 然後，開啟 `com/example/plugins/Routing.kt` 並在 `configureRouting` 區塊內部初始化 `dao` 變數：

   ```kotlin
   ```
   {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="11-24,73"}

   就是這樣了。
   你現在可以[執行應用程式](db-persistence.md#run_app)並確認一切運作正常。

> 你可以在此處找到包含連線池化和快取的完整範例：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。