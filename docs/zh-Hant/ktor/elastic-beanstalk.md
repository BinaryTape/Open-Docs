[//]: # (title: AWS Elastic Beanstalk)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初始專案</control>：<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a> 或 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最終專案</control>：<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/aws-elastic-beanstalk">aws-elastic-beanstalk</a>
</p>
</tldr>

在本教學中，我們將向您展示如何準備 Ktor 應用程式並將其部署到 AWS Elastic Beanstalk。您可以根據用於 [建立 Ktor 伺服器](server-create-and-configure.topic) 的方式，使用以下其中一個初始專案：
* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)
* [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

> 瞭解更多關於從 [Elastic Beanstalk 文件](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Java.html) 部署 Java 應用程式的資訊。

## 先決條件 {id="prerequisites"}
在開始本教學之前，您需要建立一個 AWS 帳戶。

## 複製範例應用程式 {id="clone"}
若要開啟範例應用程式，請依照以下步驟操作：

1. 複製 Ktor 文件儲存庫並開啟 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 專案。
2. 開啟 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 或 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例。這些範例展示了 [建立和設定 Ktor 伺服器](server-create-and-configure.topic) 的不同方法：透過程式碼或使用組態檔。部署這些專案的唯一區別在於如何 [指定一個埠](#port) 以偵聽傳入的請求。

## 準備應用程式 {id="prepare-app"}

### 步驟 1：設定埠 {id="port"}

首先，您需要指定一個用於偵聽傳入請求的埠。Elastic Beanstalk 會將請求轉發到您應用程式的埠 5000。您可以選擇透過設定 `PORT` 環境變數來覆寫預設埠。根據您用於 [設定 Ktor 伺服器](server-create-and-configure.topic) 的方式，您可以透過以下方法之一設定埠：
* 如果您選擇了 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 範例，其中伺服器組態是在程式碼中指定的，您可以使用 `System.getenv` 取得環境變數值，或在未指定環境變數的情況下使用預設值 _5000_。開啟位於 `src/main/kotlin/com/example` 資料夾中的 `Application.kt` 檔案並變更 `embeddedServer` 函數的 `port` 參數值，如下所示：
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = (System.getenv("PORT")?:"5000").toInt()) {
      // ...
      }.start(wait = true)
   }
    ```

* 如果您選擇了 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例，其中伺服器組態是在 `application.conf` 檔案中指定的，您可以透過使用 `${ENV}` 語法將環境變數指派給 `port` 參數。開啟位於 `src/main/resources` 中的 `application.conf` 檔案並如下所示更新它：
   ```
   ktor {
       deployment {
           port = 5000
           port = ${?PORT}
       }
   }
   ```

### 步驟 2：應用 Ktor 外掛程式 {id="configure-ktor-plugin"}
本教學展示如何使用 [fat JAR](server-fatjar.md) 將應用程式部署到 Elastic Beanstalk。若要產生 fat JAR，您需要應用 Ktor 外掛程式。開啟 `build.gradle.kts` 檔案並將外掛程式新增到 `plugins` 區塊：
```groovy
plugins {
    id("io.ktor.plugin") version "3.2.3"
}
```

然後，請確保已設定 [主應用程式類別](server-dependencies.topic#create-entry-point)：
```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

## 建構 Fat JAR {id="build"}
若要建構 Fat JAR，開啟終端機並執行由 [Ktor 外掛程式](#configure-ktor-plugin) 提供的 `buildFatJar` 任務：

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">
<code-block code="./gradlew :aws-elastic-beanstalk:buildFatJar"/>
</TabItem>
<TabItem title="Windows" group-key="windows">
<code-block code="gradlew.bat :aws-elastic-beanstalk:buildFatJar"/>
</TabItem>
</Tabs>

當此建構完成時，您應該會在 `build/libs` 目錄中看到 `aws-elastic-beanstalk-all.jar` 檔案。

## 部署應用程式 {id="deploy-app"}
若要部署應用程式，登入 [AWS 管理主控台](https://aws.amazon.com/console/) 並依照以下步驟操作：
1. 開啟 **Elastic Beanstalk** 服務在 **AWS 服務** 群組中。
2. 在開啟的頁面上，點擊 **Create Application**。
3. 指定以下應用程式設定：
   * **應用程式名稱**：指定應用程式名稱 (例如，_Sample Ktor app_)。
   * **平台**：從列表中選擇 _Java_。
   * **平台分支**：選擇 _Corretto 11 running on 64bit Amazon Linux 2_。
   * **應用程式程式碼**：選擇 _上傳您的程式碼_。
   * **原始碼來源**：選擇 _本地檔案_。然後，點擊 **Choose file** 按鈕並選擇在 [上一步](#build) 中產生的 Fat JAR。請等待檔案上傳完成。
4. 點擊 **Create application** 按鈕並等待幾分鐘，直到 Beanstalk 建立環境並發佈應用程式：
   ```
   INFO    Instance deployment completed successfully.
   INFO    Application available at Samplektorapp-env.eba-bnye2kpu.us-east-2.elasticbeanstalk.com.
   INFO    Successfully launched environment: Samplektorapp-env
   ```
   {style="block"}