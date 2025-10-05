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
本教學課程將展示如何準備 Ktor 專案並將其部署到 Google App Engine 標準環境。
</web-summary>

<link-summary>
學習如何將專案部署到 Google App Engine 標準環境。
</link-summary>

在本教學課程中，我們將展示如何準備 Ktor 專案並將其部署到 Google App Engine 標準環境。本教學課程使用 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例專案作為起始專案。

## 必要條件 {id="prerequisites"}
在開始本教學課程之前，您需要執行以下步驟：
* 註冊 [Google Cloud Platform](https://console.cloud.google.com/)。
* 安裝並初始化 [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)。
* 使用以下命令安裝適用於 Java 的 App Engine 擴充功能：
   ```Bash
   gcloud components install app-engine-java
   ```

## 複製範例應用程式 {id="clone"}
要開啟範例應用程式，請按照以下步驟操作：
1. 複製 Ktor 文件儲存庫並開啟 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 專案。
2. 開啟 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 模組。
   > 請注意，Ktor 提供兩種方式來 [建立和設定伺服器](server-create-and-configure.topic)：透過程式碼或使用設定檔。在本教學課程中，部署過程對於這兩種方式都是相同的。

## 準備應用程式 {id="prepare-app"}
### 步驟 1：套用 Shadow 外掛程式 {id="configure-shadow-plugin"}
本教學課程展示了如何使用 [fat JAR](server-fatjar.md) 將應用程式部署到 Google App Engine。要產生 fat JAR，您需要套用 Shadow 外掛程式。開啟 `build.gradle.kts` 檔案並將此外掛程式新增到 `plugins` 區塊中：
```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.9"
}
```

### 步驟 2：設定 App Engine 外掛程式 {id="configure-app-engine-plugin"}
[Google App Engine Gradle plugin](https://github.com/GoogleCloudPlatform/app-gradle-plugin) 提供用於建置和部署 Google App Engine 應用程式的任務。要使用此外掛程式，請按照以下步驟操作：

1. 開啟 `settings.gradle.kts` 檔案並插入以下程式碼以從 Central Maven 儲存庫引用外掛程式：
   ```kotlin
   pluginManagement {
       repositories {
           gradlePluginPortal()
           mavenCentral()
           maven("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
       }
       resolutionStrategy {
           eachPlugin {
               if (requested.id.id.startsWith("com.google.cloud.tools.appengine")) {
                   useModule("com.google.cloud.tools:appengine-gradle-plugin:${requested.version}")
               }
           }
       }
   }
   ```

2. 開啟 `build.gradle.kts` 並在 `plugins` 區塊中套用此外掛程式：
   ```kotlin
   plugins {
       id("com.google.cloud.tools.appengine") version "2.8.0"
   }
   ```

3. 在 `build.gradle.kts` 檔案中加入帶有以下設定的 `appengine` 區塊：
   ```kotlin
   import com.google.cloud.tools.gradle.appengine.appyaml.AppEngineAppYamlExtension
   
   configure<AppEngineAppYamlExtension> {
       stage {
           setArtifact("build/libs/${project.name}-all.jar")
       }
       deploy {
           version = "GCLOUD_CONFIG"
           projectId = "GCLOUD_CONFIG"
       }
   }
   ```

### 步驟 3：設定 App Engine 配置 {id="configure-app-engine-settings"}
您可以在 [app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref) 檔案中配置應用程式的 App Engine 設定：
1. 在 `src/main` 內部建立 `appengine` 目錄。
2. 在此目錄中，建立 `app.yaml` 檔案並加入以下內容（將 `google-appengine-standard` 替換為您的專案名稱）：
   ```yaml
   runtime: java21
   entrypoint: 'java -jar google-appengine-standard-all.jar'
   
   ```
   
   `entrypoint` 選項包含一個用於執行為應用程式生成的 fat JAR 的命令。

   有關支援的設定選項的更多文件，請參閱 [Google AppEngine documentation](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)。

## 部署應用程式 {id="deploy-app"}

要部署應用程式，請開啟終端機並按照以下步驟操作：

1. 首先，建立一個 Google Cloud 專案，它是一個包含應用程式資源的頂層容器。例如，以下命令會建立一個名為 `ktor-sample-app-engine` 的專案：
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. 為 Cloud 專案建立一個 App Engine 應用程式：
   ```Bash
   gcloud app create
   ```

3. 要部署應用程式，請執行 `appengineDeploy` Gradle 任務...
   ```Bash
   ./gradlew appengineDeploy
   ```
   ... 並等待 Google Cloud 建置並發佈應用程式：
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > 如果您在建置期間收到 `Cloud Build has not been used in project` 錯誤，請依照錯誤報告中的指示啟用它。
   >
   {type="note"}

您可以在此處找到完整的範例：[google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard)。