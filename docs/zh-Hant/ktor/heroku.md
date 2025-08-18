[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>學習如何準備與部署 Ktor 應用程式到 Heroku。</link-summary>

在本教學中，我們將展示如何準備與部署 Ktor 應用程式到 Heroku。

## 前提條件 {id="prerequisites"}
在開始本教學之前，請確保符合以下前提條件：
* 您擁有一個 Heroku 帳戶。
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) 已安裝在您的機器上。

## 建立範例應用程式 {id="create-sample-app"}

按照 [建立、開啟並執行新的 Ktor 專案](server-create-a-new-project.topic) 中的說明建立範例應用程式。

> 請注意，Ktor 提供了兩種方式來 [建立與設定伺服器](server-create-and-configure.topic)：在程式碼中或透過使用設定檔。部署時的唯一區別在於如何 [指定用於監聽傳入請求的連接埠](#port)。

## 準備應用程式 {id="prepare-app"}

### 步驟 1：設定連接埠 {id="port"}

首先，您需要指定一個用於監聽傳入請求的連接埠。由於 Heroku 使用 `PORT` 環境變數，您需要設定應用程式以使用此變數的值。根據 [設定 Ktor 伺服器](server-create-and-configure.topic) 的方式，執行以下其中一項操作：
* 如果伺服器設定是在程式碼中指定，您可以使用 `System.getenv` 取得環境變數值。開啟位於 `src/main/kotlin/com/example` 資料夾中的 `Application.kt` 檔案，並按照以下所示更改 `embeddedServer` 函式的 `port` 參數值：
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

* 如果您的伺服器設定是在 `application.conf` 檔案中指定，您可以使用 `${ENV}` 語法將環境變數指派給 `port` 參數。開啟位於 `src/main/resources` 中的 `application.conf` 檔案並按照以下所示進行更新：
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### 步驟 2：新增 `stage` 任務 {id="stage"}
開啟 `build.gradle.kts` 檔案並新增一個自訂的 `stage` 任務，Heroku 會使用此任務來建立可在 Heroku 平台上執行的可執行檔：
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
請注意，`installDist` 任務隨附於 Gradle [應用程式外掛程式](https://docs.gradle.org/current/userguide/application_plugin.html)，該外掛程式已新增到範例專案中。

### 步驟 3：建立 Procfile {id="procfile"}
在專案根目錄中建立一個 [Procfile](https://devcenter.heroku.com/articles/procfile) 檔案，並新增以下內容：
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

此檔案指定應用程式可執行檔的路徑，由 [stage](#stage) 任務產生，並允許 Heroku 啟動應用程式。
您可能需要將 `ktor-get-started-sample` 替換為您的專案名稱。

## 部署應用程式 {id="deploy-app"}

若要使用 Git 將應用程式部署到 Heroku，請開啟終端機並依照以下步驟操作：

1. 在本機提交 [上一節](#prepare-app) 中所做的更改：
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. 登入 Heroku CLI：
   ```Bash
   heroku login
   ```
3. 使用 `heroku create` 命令建立 Heroku 應用程式。
   您需要將 `ktor-sample-heroku` 替換為您的應用程式名稱：
   ```Bash
   heroku create ktor-sample-heroku
   ```
   此命令執行兩項操作：
   * 建立一個新的 Heroku 應用程式，該應用程式可在 [Web 儀表板](https://dashboard.heroku.com/apps/) 上使用。
   * 將一個名為 `heroku` 的新 Git 遠端新增到本機儲存庫。

4. 若要部署應用程式，將更改推送到 `heroku main`...
   ```Bash
   git push heroku main
   ```
   ... 並等待 Heroku 建置並發佈應用程式：
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}