[//]: # (title: Google App Engine)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初始專案</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最終專案</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard">google-appengine-standard</a>
</p>
</tldr>

<web-summary>
本教學示範如何準備 Ktor 專案並將其部署到 Google App Engine 標準環境。
</web-summary>

<link-summary>
了解如何將您的專案部署到 Google App Engine 標準環境。
</link-summary>

在本教學中，我們將示範如何準備 Ktor 專案並將其部署到 Google App Engine 標準環境。本教學使用 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例專案作為起始專案。

## 先決條件 {id="prerequisites"}
在開始本教學之前，您需要執行以下步驟：
* 在 [Google Cloud Platform](https://console.cloud.google.com/) 註冊。
* 安裝並初始化 [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)。
* 使用以下命令安裝 Java 的 App Engine 擴充功能：
   ```Bash
   gcloud components install app-engine-java
   ```

## 複製範例應用程式 {id="clone"}
若要開啟範例應用程式，請按照以下步驟操作：
1. 複製 Ktor 文件儲存庫並開啟 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 專案。
2. 開啟 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 模組。
   > 請注意，Ktor 提供了兩種 [建立和配置伺服器](server-create-and-configure.topic) 的方法：透過程式碼或使用配置檔。在本教學中，部署過程對於這兩種方法都是相同的。

## 準備應用程式 {id="prepare-app"}
### 步驟 1: 應用 Shadow 外掛程式 {id="configure-shadow-plugin"}
本教學展示如何使用 [fat JAR](server-fatjar.md) 將應用程式部署到 Google App Engine。若要生成 fat JAR，您需要應用 Shadow 外掛程式。開啟 `build.gradle.kts` 檔案並將此外掛程式新增到 `plugins` 區塊：
```kotlin
```
{src="snippets/google-appengine-standard/build.gradle.kts" include-lines="7,11-12"}

### 步驟 2: 配置 App Engine 外掛程式 {id="configure-app-engine-plugin"}
[Google App Engine Gradle 外掛程式](https://github.com/GoogleCloudPlatform/app-gradle-plugin) 提供了建置和部署 Google App Engine 應用程式的任務。若要使用此外掛程式，請按照以下步驟操作：

1. 開啟 `settings.gradle.kts` 檔案並插入以下程式碼以引用來自 Central Maven 儲存庫的外掛程式：
   ```groovy
   ```
   {src="settings.gradle.kts" include-lines="1-14"}

2. 開啟 `build.gradle.kts` 並在 `plugins` 區塊中應用此外掛程式：
   ```kotlin
   ```
   {src="snippets/google-appengine-standard/build.gradle.kts" include-lines="7,10,12"}

3. 在 `build.gradle.kts` 檔案中新增 `appengine` 區塊並包含以下設定：
   ```kotlin
   ```
   {src="snippets/google-appengine-standard/build.gradle.kts" include-lines="1,22-31"}

### 步驟 3: 配置 App Engine 設定 {id="configure-app-engine-settings"}
您可以在 [app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref) 檔案中為您的應用程式配置 App Engine 設定：
1. 在 `src/main` 內部建立 `appengine` 目錄。
2. 在此目錄中，建立 `app.yaml` 檔案並添加以下內容（將 `google-appengine-standard` 替換為您的專案名稱）：
   ```yaml
   ```
   {src="snippets/google-appengine-standard/src/main/appengine/app.yaml"}
   
   `entrypoint` 選項包含用於執行為應用程式生成的 fat JAR 的命令。

   有關支援的配置選項的更多文檔，請參閱 [Google AppEngine 文件](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)。

## 部署應用程式 {id="deploy-app"}

若要部署應用程式，請開啟終端機並按照以下步驟操作：

1. 首先，建立一個 Google Cloud 專案，它是一個包含應用程式資源的頂層容器。例如，以下命令會建立一個名為 `ktor-sample-app-engine` 的專案：
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. 為 Cloud 專案建立一個 App Engine 應用程式：
   ```Bash
   gcloud app create
   ```

3. 若要部署應用程式，請執行 `appengineDeploy` Gradle 任務...
   ```Bash
   ./gradlew appengineDeploy
   ```
   ... 並等待 Google Cloud 建置並發布應用程式：
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > 如果您在建置過程中收到 `Cloud Build has not been used in project` 錯誤，請按照錯誤報告中的說明啟用它。
   >
   {type="note"}

您可以在此處找到完整的範例：[google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard)。