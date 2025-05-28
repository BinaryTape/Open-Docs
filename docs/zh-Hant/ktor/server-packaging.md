[//]: # (title: 建立應用程式發佈)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins) 會自動套用 Gradle 的 [Application 插件](https://docs.gradle.org/current/userguide/application_plugin.html)，該插件提供打包應用程式的能力，包括程式碼依賴項和產生的啟動腳本。在本主題中，我們將展示如何打包並執行 Ktor 應用程式。

## 設定 Ktor 插件 {id="configure-plugin"}
為了建立應用程式發佈，您需要先套用 Ktor 插件：
1. 開啟 `build.gradle.kts` 檔案並將插件加入 `plugins` 區塊：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="4,7-8"}

2. 確保 [主要應用程式類別](server-dependencies.topic#create-entry-point) 已設定：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="10-12"}

## 打包應用程式 {id="package"}
Application 插件提供多種打包應用程式的方式，例如，`installDist` 任務會安裝應用程式及其所有執行時依賴項和啟動腳本。若要建立完整的發佈歸檔，您可以使用 `distZip` 和 `distTar` 任務。

在本主題中，我們將使用 `installDist`：
1. 開啟終端機。
2. 根據您的作業系統，透過以下其中一種方式執行 `installDist` 任務：
   
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   <code-block>./gradlew installDist</code-block>
   </tab>
   <tab title="Windows" group-key="windows">
   <code-block>gradlew.bat installDist</code-block>
   </tab>
   </tabs>

   Application 插件會應用程式映像建立在 `build/install/<project_name>` 資料夾中。 

## 執行應用程式 {id="run"}
若要執行已打包的應用程式：
1. 在終端機中進入 `build/install/<project_name>/bin` 資料夾。
2. 根據您的作業系統，執行 `<project_name>` 或 `<project_name>.bat` 可執行檔，例如：

   <snippet id="run_executable">
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   <code-block>./ktor-sample</code-block>
   </tab>
   <tab title="Windows" group-key="windows">
   <code-block>ktor-sample.bat</code-block>
   </tab>
   </tabs>
   </snippet>
   
3. 等待直到顯示以下訊息：
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
   在瀏覽器中開啟此連結以查看正在執行的應用程式：

   <img src="ktor_idea_new_project_browser.png" alt="瀏覽器中的 Ktor 應用程式" width="430"/>