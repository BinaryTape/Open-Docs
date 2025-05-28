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

在本教學課程中，我們將向您展示如何準備 Ktor 應用程式並將其部署到 AWS Elastic Beanstalk。您可以根據[建立 Ktor 伺服器](server-create-and-configure.topic)的方式，使用以下其中一個初始專案：
* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)
* [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

> 如需更多關於部署 Java 應用程式的資訊，請參閱 [Elastic Beanstalk 文件](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Java.html)。

## 先決條件 {id="prerequisites"}
在開始本教學課程之前，您需要建立一個 AWS 帳戶。

## 複製範例應用程式 {id="clone"}
若要開啟範例應用程式，請依照下列步驟操作：

1. 複製 Ktor 文件儲存庫並開啟 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 專案。
2. 開啟 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 或 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例。這些範例展示了[建立及配置 Ktor 伺服器](server-create-and-configure.topic)的不同方法：在程式碼中或透過使用配置檔。部署這些專案的唯一區別在於如何[指定連接埠](#port)以監聽傳入請求。

## 準備應用程式 {id="prepare-app"}

### 步驟 1: 配置連接埠 {id="port"}

首先，您需要指定用於監聽傳入請求的連接埠。Elastic Beanstalk 會將請求轉發到您應用程式的連接埠 5000。您可以選擇透過設定 `PORT` 環境變數來覆寫預設連接埠。根據[配置 Ktor 伺服器](server-create-and-configure.topic)的方式，您可以透過以下其中一種方式配置連接埠：
* 如果您選擇了在程式碼中指定伺服器配置的 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 範例，您可以使用 `System.getenv` 取得環境變數值，或者在未指定環境變數的情況下使用預設值 _5000_。開啟位於 `src/main/kotlin/com/example` 資料夾中的 `Application.kt` 檔案，並如下所示更改 `embeddedServer` 函數的 `port` 參數值：
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = (System.getenv("PORT")?:"5000").toInt()) {
      // ...
      }.start(wait = true)
   }
    ```

* 如果您選擇了在 `application.conf` 檔案中指定伺服器配置的 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 範例，您可以使用 `${ENV}` 語法將環境變數指派給 `port` 參數。開啟位於 `src/main/resources` 中的 `application.conf` 檔案，並如下所示進行更新：
   ```
   ```
  {src="snippets/aws-elastic-beanstalk/src/main/resources/application.conf" include-lines="1-5,9" style="block"}

### 步驟 2: 套用 Ktor 外掛程式 {id="configure-ktor-plugin"}
本教學課程展示了如何使用[胖 JAR (fat JAR)](server-fatjar.md) 將應用程式部署到 Elastic Beanstalk。為了產生胖 JAR 檔，您需要套用 Ktor 外掛程式。開啟 `build.gradle.kts` 檔案並將外掛程式新增到 `plugins` 區塊中：
```groovy
```
{src="snippets/aws-elastic-beanstalk/build.gradle.kts" include-lines="3,6-7"}

然後，確保[主應用程式類別 (main application class)](server-dependencies.topic#create-entry-point) 已配置：
```kotlin
```
{src="snippets/aws-elastic-beanstalk/build.gradle.kts" include-lines="9-11"}

## 建置胖 JAR {id="build"}
若要建置胖 JAR，請開啟終端機並執行由 [Ktor 外掛程式](#configure-ktor-plugin)提供的 `buildFatJar` 任務：

<tabs group="os">
<tab title="Linux/macOS" group-key="unix">
<code-block>./gradlew :aws-elastic-beanstalk:buildFatJar</code-block>
</tab>
<tab title="Windows" group-key="windows">
<code-block>gradlew.bat :aws-elastic-beanstalk:buildFatJar</code-block>
</tab>
</tabs>

建置完成後，您應該會在 `build/libs` 目錄中看到 `aws-elastic-beanstalk-all.jar` 檔案。

## 部署應用程式 {id="deploy-app"}
若要部署應用程式，請登入 [AWS 管理主控台](https://aws.amazon.com/console/)並依照下列步驟操作：
1. 在 **AWS 服務**群組中開啟 **Elastic Beanstalk** 服務。
2. 在開啟的頁面上，按一下**建立應用程式 (Create Application)**。
3. 指定以下應用程式設定：
   * **應用程式名稱 (Application name)**：指定應用程式名稱 (例如，_Sample Ktor app_)。
   * **平台 (Platform)**：從清單中選擇 _Java_。
   * **平台分支 (Platform branch)**：選擇 _Corretto 11 (執行於 64 位元 Amazon Linux 2)_。
   * **應用程式程式碼 (Application code)**：選擇 _上傳您的程式碼 (Upload your code)_。
   * **原始碼來源 (Source code origin)**：選擇 _本機檔案 (Local file)_。然後，按一下**選擇檔案 (Choose file)** 按鈕，並選擇在[上一步驟](#build)中產生的胖 JAR。等待檔案上傳完成。
4. 按一下**建立應用程式 (Create application)** 按鈕，並等待數分鐘，直到 Beanstalk 建立環境並發佈應用程式：
   ```
   INFO    Instance deployment completed successfully.
   INFO    Application available at Samplektorapp-env.eba-bnye2kpu.us-east-2.elasticbeanstalk.com.
   INFO    Successfully launched environment: Samplektorapp-env
   ```
   {style="block"}