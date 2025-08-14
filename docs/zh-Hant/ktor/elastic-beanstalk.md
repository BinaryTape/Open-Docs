[//]: # (title: AWS Elastic Beanstalk)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初始專案</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a> 或 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最終專案</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/aws-elastic-beanstalk">aws-elastic-beanstalk</a>
</p>
</tldr>

在本教學中，我們將向您展示如何準備 Ktor 應用程式並將其部署到 AWS Elastic Beanstalk。您可以根據用於[建立 Ktor 伺服器](server-create-and-configure.topic)的方式使用以下其中一個初始專案：
* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)
* [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

> 從 [Elastic Beanstalk 文件](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Java.html)中了解更多關於部署 Java 應用程式的資訊。

## 前提 {id="prerequisites"}
在開始本教學之前，您需要建立一個 AWS 帳戶。

## 複製範例應用程式 {id="clone"}
若要開啟範例應用程式，請依照以下步驟操作：

1. 複製 Ktor 文件儲存庫並開啟 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 專案。
2. 開啟 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 或 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例。這些範例展示了[建立和配置 Ktor 伺服器](server-create-and-configure.topic)的不同方法：在程式碼中或透過使用配置檔。部署這些專案的唯一區別在於如何[指定一個埠號](#port)來監聽傳入請求。

## 準備應用程式 {id="prepare-app"}

### 步驟 1：配置埠號 {id="port"}

首先，您需要指定一個用於監聽傳入請求的埠號。Elastic Beanstalk 會將請求轉發到您應用程式的 5000 埠。您可以選擇透過設定 `PORT` 環境變數來覆寫預設埠號。根據用於[配置 Ktor 伺服器](server-create-and-configure.topic)的方式，您可以透過以下其中一種方式配置埠號：
* 如果您選擇了在程式碼中指定伺服器配置的 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 範例，您可以使用 `System.getenv` 取得環境變數值，或者在未指定環境變數的情況下使用預設的 _5000_ 值。開啟位於 `src/main/kotlin/com/example` 資料夾中的 `Application.kt` 檔案，並如下所示更改 `embeddedServer` 函數的 `port` 參數值：
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = (System.getenv("PORT")?:"5000").toInt()) {
      // ...
      }.start(wait = true)
   }
    ```

* 如果您選擇了在 `application.conf` 檔案中指定伺服器配置的 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例，您可以使用 `${ENV}` 語法將環境變數指派給 `port` 參數。開啟位於 `src/main/resources` 中的 `application.conf` 檔案並如下所示更新它：
   [object Promise]

### 步驟 2：應用 Ktor 插件 {id="configure-ktor-plugin"}
本教學展示了如何使用 [fat JAR](server-fatjar.md) 將應用程式部署到 Elastic Beanstalk。若要生成 fat JAR，您需要應用 Ktor 插件。開啟 `build.gradle.kts` 檔案並將插件新增到 `plugins` 區塊：
[object Promise]

然後，請確保已配置[主應用程式類別](server-dependencies.topic#create-entry-point)：
[object Promise]

## 建置 Fat JAR {id="build"}
若要建置 Fat JAR，請開啟終端機並執行 [Ktor 插件](#configure-ktor-plugin)提供的 `buildFatJar` 任務：

<tabs group="os">
<tab title="Linux/macOS" group-key="unix">
[object Promise]
</tab>
<tab title="Windows" group-key="windows">
[object Promise]
</tab>
</tabs>

當此建置完成時，您應該會在 `build/libs` 目錄中看到 `aws-elastic-beanstalk-all.jar` 檔案。

## 部署應用程式 {id="deploy-app"}
若要部署應用程式，請登入 [AWS Management Console](https://aws.amazon.com/console/) 並依照以下步驟操作：
1. 在 **AWS 服務**群組中開啟 **Elastic Beanstalk** 服務。
2. 在開啟的頁面上，點擊**建立應用程式**。
3. 指定以下應用程式設定：
   * **應用程式名稱**：指定應用程式名稱（例如，_Sample Ktor app_）。
   * **平台**：從列表中選擇 _Java_。
   * **平台分支**：選擇 _Corretto 11 running on 64bit Amazon Linux 2_。
   * **應用程式程式碼**：選擇_上傳您的程式碼_。
   * **原始碼來源**：選擇_本機檔案_。然後，點擊**選擇檔案**按鈕並選擇在[上一步](#build)中生成的 Fat JAR。請等待檔案上傳完成。
4. 點擊**建立應用程式**按鈕，並等待幾分鐘直到 Beanstalk 建立環境並發佈應用程式：
   ```
   INFO    實例部署成功完成。
   INFO    應用程式可在 Samplektorapp-env.eba-bnye2kpu.us-east-2.elasticbeanstalk.com 取得。
   INFO    成功啟動環境：Samplektorapp-env
   ```
   {style="block"}