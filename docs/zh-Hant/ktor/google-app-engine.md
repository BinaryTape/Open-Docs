[//]: # (title: Google App Engine)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初始專案</control>：<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最終專案</control>：<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard">google-appengine-standard</a>
</p>
</tldr>

<web-summary>
本教學展示如何準備 Ktor 專案並將其部署到 Google App Engine 標準環境。
</web-summary>

<link-summary>
了解如何將您的專案部署到 Google App Engine 標準環境。
</link-summary>

在本教學中，我們將向您展示如何準備 Ktor 專案並將其部署到 Google App Engine 標準環境。本教學使用 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例專案作為起始專案。

## 先決條件 {id="prerequisites"}
在開始本教學之前，您需要執行以下步驟：
* 在 [Google Cloud Platform](https://console.cloud.google.com/) 註冊。
* 安裝並初始化 [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)。
* 使用以下指令安裝適用於 Java 的 App Engine 擴充套件：
   ```Bash
   gcloud components install app-engine-java
   ```

## 複製範例應用程式 {id="clone"}
若要開啟範例應用程式，請遵循以下步驟：
1. 複製 Ktor 文件存儲庫並開啟 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 專案。
2. 開啟 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 模組。
   > 請注意，Ktor 提供兩種[建立與配置伺服器](server-create-and-configure.topic)的方法：透過程式碼或使用配置檔案。在本教學中，兩種方法的部署程序是相同的。

## 準備應用程式 {id="prepare-app"}
### 步驟 1：套用 Shadow 外掛程式 {id="configure-shadow-plugin"}
本教學展示如何使用 [fat JAR](server-fatjar.md) 將應用程式部署到 Google App Engine。若要產生 fat JAR，您需要套用 Shadow 外掛程式。開啟 `build.gradle.kts` 檔案並將外掛程式新增至 `plugins` 區塊：
```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.9"
}
```

### 步驟 2：配置 App Engine 外掛程式 {id="configure-app-engine-plugin"}
[Google App Engine Gradle 外掛程式](https://github.com/GoogleCloudPlatform/app-gradle-plugin)提供建置與部署 Google App Engine 應用程式的任務。若要使用此外掛程式，請遵循以下步驟：

1. 開啟 `settings.gradle.kts` 檔案並插入以下程式碼，以從 Central Maven 存儲庫引用外掛程式：
   ```kotlin
   pluginManagement {
       repositories {
           gradlePluginPortal()
           mavenCentral()
           maven("https://redirector.kotlinlang.org/maven/ktor-eap")
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

2. 開啟 `build.gradle.kts` 並在 `plugins` 區塊中套用外掛程式：
   ```kotlin
   plugins {
       id("com.google.cloud.tools.appengine") version "2.8.0"
   }
   ```

3. 在 `build.gradle.kts` 檔案中新增包含以下設定的 `appengine` 區塊：
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

### 步驟 3：配置 App Engine 設定 {id="configure-app-engine-settings"}
您可以在 [app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref) 檔案中為您的應用程式配置 App Engine 設定：
1. 在 `src/main` 中建立 `appengine` 目錄。
2. 在此目錄中建立 `app.yaml` 檔案並新增以下內容（將 `google-appengine-standard` 替換為您的專案名稱）：
   ```yaml
   runtime: java21
   entrypoint: 'java -jar google-appengine-standard-all.jar'
   
   ```
   
   `entrypoint` 選項包含用於執行為應用程式產生的 fat JAR 的指令。

   關於支援配置選項的更多文件，可以在 [Google AppEngine 文件](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)中找到。

## 部署應用程式 {id="deploy-app"}

若要部署應用程式，請開啟終端並遵循以下步驟：

1. 首先，建立 Google Cloud 專案，這是保存應用程式資源的最頂層容器。例如，以下指令會建立名稱為 `ktor-sample-app-engine` 的專案：
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. 為 Cloud 專案建立 App Engine 應用程式：
   ```Bash
   gcloud app create
   ```

3. 若要部署應用程式，請執行 `appengineDeploy` Gradle 任務...
   ```Bash
   ./gradlew appengineDeploy
   ```
   ...並等待直到 Google Cloud 建置並發布應用程式：
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > 如果您在建置過程中收到 `Cloud Build has not been used in project` 錯誤，請根據錯誤報告中的指示啟用它。
   >
   {type="note"}

您可以在此處找到完整的範例：[google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard)。