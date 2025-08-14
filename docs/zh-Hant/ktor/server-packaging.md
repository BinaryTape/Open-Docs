[//]: # (title: 建立應用程式發佈)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[Ktor Gradle 外掛程式](https://github.com/ktorio/ktor-build-plugins) 會自動套用 Gradle [Application 外掛程式](https://docs.gradle.org/current/userguide/application_plugin.html)，該外掛程式提供了打包應用程式的能力，包括程式碼相依性及生成的啟動腳本。在本主題中，我們將展示如何打包及執行 Ktor 應用程式。

## 配置 Ktor 外掛程式 {id="configure-plugin"}
要建立應用程式發佈，您需要先套用 Ktor 外掛程式：
1. 開啟 `build.gradle.kts` 檔案並將該外掛程式加入到 `plugins` 區塊：
   [object Promise]

2. 確保已配置[主應用程式類別](server-dependencies.topic#create-entry-point)：
   [object Promise]

## 打包應用程式 {id="package"}
Application 外掛程式提供了多種打包應用程式的方式，例如，`installDist` 任務會將應用程式與所有執行時相依性及啟動腳本一起安裝。要建立完整的發佈壓縮檔，您可以使用 `distZip` 和 `distTar` 任務。

在本主題中，我們將使用 `installDist`：
1. 開啟終端機。
2. 根據您的作業系統，透過以下其中一種方式執行 `installDist` 任務：
   
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   [object Promise]
   </tab>
   <tab title="Windows" group-key="windows">
   [object Promise]
   </tab>
   </tabs>

   Application 外掛程式將在 `build/install/<project_name>` 資料夾中建立應用程式映象。

## 執行應用程式 {id="run"}
要執行[已打包的應用程式](#package)：
1. 在終端機中進入 `build/install/<project_name>/bin` 資料夾。
2. 根據您的作業系統，執行 `<project_name>` 或 `<project_name>.bat` 可執行檔，例如：

   <snippet id="run_executable">
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   [object Promise]
   </tab>
   <tab title="Windows" group-key="windows">
   [object Promise]
   </tab>
   </tabs>
   </snippet>
   
3. 等待顯示以下訊息：
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
   在瀏覽器中開啟該連結以查看正在執行的應用程式：

   <img src="ktor_idea_new_project_browser.png" alt="瀏覽器中的 Ktor 應用程式" width="430"/>