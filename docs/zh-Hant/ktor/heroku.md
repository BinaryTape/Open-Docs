[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何準備 Ktor 應用程式並將其部署到 Heroku。</link-summary>

在本教學中，我們將向您展示如何準備 Ktor 應用程式並將其部署到 Heroku。

## 先決條件 {id="prerequisites"}
在開始本教學之前，請確保滿足以下先決條件：
*   您擁有一個 Heroku 帳戶。
*   [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) 已安裝在您的機器上。

## 建立範例應用程式 {id="create-sample-app"}

按照 [](server-create-a-new-project.topic) 中的說明建立一個範例應用程式。

> 請注意，Ktor 提供了兩種方式來 [建立與配置伺服器](server-create-and-configure.topic)：透過程式碼或使用組態檔。部署時唯一的區別在於如何 [指定連接埠](#port) 以用於監聽傳入請求。

## 準備應用程式 {id="prepare-app"}

### 步驟 1：配置連接埠 {id="port"}

首先，您需要指定一個用於監聽傳入請求的連接埠。由於 Heroku 使用 `PORT` 環境變數，因此您需要將應用程式配置為使用此變數的值。根據用於 [配置 Ktor 伺服器](server-create-and-configure.topic) 的方式，執行以下操作之一：
*   如果伺服器組態是在程式碼中指定的，您可以使用 `System.getenv` 取得環境變數值。開啟 `src/main/kotlin/com/example` 資料夾中的 `Application.kt` 檔案，並如下所示更改 `embeddedServer` 函數的 `port` 參數值：
    ```kotlin
    fun main() {
       embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
           // ...
       }.start(wait = true)
    }
    ```

*   如果您的伺服器組態是在 `application.conf` 檔案中指定的，您可以使用 `${ENV}` 語法將環境變數指派給 `port` 參數。開啟 `src/main/resources` 中的 `application.conf` 檔案，並如下所示更新它：
    ```
    ktor {
        deployment {
            port = 8080
            port = ${?PORT}
        }
    }
    ```
    {style="block"}

### 步驟 2：新增一個 stage 任務 {id="stage"}
開啟 `build.gradle.kts` 檔案並新增一個自訂的 `stage` 任務，Heroku 會使用它來產生一個可執行檔，該可執行檔將在 Heroku 的平台上執行：
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
```
請注意，`installDist` 任務來自 Gradle [應用程式外掛程式 (application plugin)](https://docs.gradle.org/current/userguide/application_plugin.html)，該外掛程式已新增到範例專案中。

### 步驟 3：建立 Procfile {id="procfile"}
在專案根目錄中建立一個 [Procfile](https://devcenter.heroku.com/articles/procfile) 並新增以下內容：
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

此檔案指定了由 [stage](#stage) 任務產生的應用程式可執行檔的路徑，並允許 Heroku 啟動應用程式。
您可能需要將 `ktor-get-started-sample` 替換為您的專案名稱。

## 部署應用程式 {id="deploy-app"}

要使用 Git 將應用程式部署到 Heroku，請開啟終端機並按照以下步驟操作：

1.  在本機提交在 [上一節](#prepare-app) 中所做的變更：
    ```Bash
    git add .
    git commit -m "Prepare app for deploying"
    ```
2.  登入 Heroku CLI：
    ```Bash
    heroku login
    ```
3.  使用 `heroku create` 命令建立 Heroku 應用程式。
    您需要將 `ktor-sample-heroku` 替換為您的應用程式名稱：
    ```Bash
    heroku create ktor-sample-heroku
    ```
    此命令執行兩項操作：
    *   建立一個新的 Heroku 應用程式，可在 [網頁儀表板](https://dashboard.heroku.com/apps/) 上使用。
    *   將名為 `heroku` 的新 Git 遠端新增到本機儲存庫。

4.  要部署應用程式，請將變更推送到 `heroku main`...
    ```Bash
    git push heroku main
    ```
    ...並等待 Heroku 建置並發布應用程式：
    ```
    ...
    remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
    remote:
    remote: Verifying deploy... done.
    ```
    {style="block"}