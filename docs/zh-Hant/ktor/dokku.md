[//]: # (title: Dokku)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何準備 Ktor 應用程式並將其部署到 Dokku。</link-summary>

[Dokku](https://dokku.com/) 是一個自託管的平台即服務 (PaaS)，可在您自己的 Linux 伺服器上執行，並提供類似於 [Heroku](heroku.md) 的部署工作流程。雖然您可以透過手動將 fat JAR 複製到伺服器來部署 Ktor 應用程式，但 Dokku 能夠自動化周邊的基礎結構：

* **基於 Git 的部署** — 使用 `git push` 推送您的程式碼，Dokku 就會自動建置並重啟應用程式，無需透過 SSH 進行檔案複製或手動重啟。
* **程序管理** — Dokku 會自動啟動、停止和重啟您的應用程式，包括在伺服器重新開機後。
* **在單一伺服器上執行多個應用程式** — 每個應用程式都在隔離的容器中執行，可防止應用程式之間的 port 衝突和相互干擾。
* **HTTPS** — 只要一個指令即可為您的應用程式配置 Let's Encrypt 憑證。
* **零停機部署** — Dokku 會等待新容器通過健康檢查，然後才將流量從舊容器切換走。

Dokku 需要 Linux 伺服器才能執行。多家託管供應商提供預先安裝 Dokku 的映像檔，因此您不需要手動設定：[DigitalOcean](https://marketplace.digitalocean.com/apps/dokku)、[Hostinger](https://www.hostinger.com/vps/dokku-hosting) 以及 [HOSTKEY](https://hostkey.com/apps/developer-tools/dokku/)。

## 先決條件 {id="prerequisites"}
在開始本教學之前，請確保滿足以下先決條件：
* 您擁有一台安裝了 Dokku 的 Linux 伺服器。您可以[手動安裝](https://dokku.com/docs/getting-started/installation/)，或使用提供預裝 Dokku 映像檔的託管供應商。
* 您的電腦上已安裝 [Git](https://git-scm.com/downloads)。

## 準備應用程式 {id="prepare-app"}

### 步驟 1：配置 port {id="port"}

首先，您需要指定用於監聽傳入請求的 port。Dokku 會動態為每個應用程式分配一個 port，並使用 `PORT` 環境變數傳遞它。您的應用程式必須在啟動時讀取此變數，否則它可能會監聽錯誤的 port，導致 Dokku 無法將流量路由到該應用程式。根據您[配置 Ktor 伺服器](server-create-and-configure.topic)的方式，執行以下操作之一：
* 如果您的伺服器配置是在程式碼中指定的，請使用 `System.getenv()` 函式讀取環境變數，並將其傳遞給 `embeddedServer()` 函式的 `port` 參數：
   ```kotlin
   fun main() {
       embeddedServer(Netty, port = System.getenv("PORT")?.toIntOrNull() ?: 8080) {
           // ...
       }.start(wait = true)
   }
   ```

* 如果您的伺服器配置是在設定檔中指定的，請開啟位於 `src/main/resources` 的 <Path>application.conf</Path> 或 <Path>application.yaml</Path> 檔案，並按照下方所示更新 `port` 屬性：

   <Tabs group="config">
   <TabItem title="application.conf" group-key="hocon">

   ```shell
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```

   </TabItem>
   <TabItem title="application.yaml" group-key="yaml">

   ```yaml
   ktor:
       deployment:
           port: ${PORT:8080}
   ```

   </TabItem>
   </Tabs>

### 步驟 2：新增 stage 任務 {id="stage"}

開啟 <Path>build.gradle.kts</Path> 檔案並新增一個自訂的 `stage` 任務，Dokku 會使用此任務來建置應用程式：
```kotlin
tasks {
    register("stage").configure {
        dependsOn("installDist")
    }
}
```
> `installDist` 任務隨 Gradle [應用程式外掛程式](https://docs.gradle.org/current/userguide/application_plugin.html)一起提供。
>
{style="tip"}

### 步驟 3：指定 Java 版本 {id="java-version"}

在專案根目錄中建立一個 <Path>system.properties</Path> 檔案以指定 Java 版本：
```properties
java.runtime.version=21
```

該版本必須與您 <Path>build.gradle.kts</Path> 檔案中指定的 JVM 工具鏈版本相符。若沒有此檔案，Dokku 將使用最新可用的 JDK 版本，這可能會隨時間變化並導致非預期的建置失敗。

### 步驟 4：建立 Procfile {id="procfile"}

在專案根目錄中建立一個 `Procfile` 並加入以下內容：
```text
web: ./build/install/<project-name>/bin/<project-name>
```
{style="block"}

此檔案告訴 Dokku 在 [`stage`](#stage) 任務建置完成後如何啟動應用程式。
請將 `<project-name>` 替換為您的專案名稱。若要查找您的專案名稱，請執行以下指令：
```bash
./gradlew properties -q | grep "^name:" | sed 's/name: //'
```

## 部署應用程式 {id="deploy-app"}

若要使用 Git 將應用程式部署到 Dokku，請開啟一個新的終端視窗並按照以下步驟操作：

1. 在本機提交[上一節](#prepare-app)中所做的變更：
   ```bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. 連接到您的伺服器並建立一個 Dokku 應用程式。
   將 `<app-name>` 替換為您的應用程式名稱：
   ```bash
   ssh <user>@<your-server> dokku apps:create <app-name>
   ```
3. 將 Dokku 伺服器新增為 Git 遠端。
   將 `<your-server>` 替換為伺服器的主機名稱或 IP 位址，並將 `<app-name>` 替換為上一步中使用的名稱：
   ```bash
   git remote add dokku dokku@<your-server>:<app-name>
   ```
4. 將程式碼推送到 Dokku 以觸發建置和部署：
   ```bash
   git push dokku main
   ```
   如果您的分支名稱不同，請將 `main` 替換為您的分支名稱。

   如果您的 Ktor 應用程式位於子目錄中，請改用 `git subtree push`：
    ```bash
    git subtree push --prefix=<subdir> dokku main
    ```
5. 等待直到 Dokku 建置並啟動應用程式：
   ```text
   ...
   =====> Application deployed:
          http://<app-name>.<your-server>
   ```
   {style="block"}
6. 設定網域或 IP 位址以讓應用程式可供存取：
   ```bash
   ssh <user>@<your-server> dokku domains:set <app-name> <domain-or-ip>
   ```
7. 應用程式將可於 `http://<domain-or-ip>` 存取。