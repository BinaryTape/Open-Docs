[//]: # (title: Azure App Service)

<show-structure for="chapter" depth="2"/>

<link-summary>本教學說明如何建置、設定並部署您的 Ktor 應用程式到 [Azure App Service](https://azure.microsoft.com/products/app-service/)。</link-summary>

本教學說明如何建置、設定並部署您的 Ktor 應用程式到 [Azure App Service](https://azure.microsoft.com/products/app-service/)。

## 先決條件 {id="prerequisites"}
在開始本教學之前，您需要具備以下條件：
* Azure 帳戶 ([在此免費試用](https://azure.microsoft.com/en-us/free/))。
* 您的機器上已安裝 [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)。

## 建立範例應用程式 {id="create-sample-app"}

按照 [建立、開啟並執行新的 Ktor 專案](server-create-a-new-project.topic) 中的說明建立範例應用程式。此範例顯示的程式碼和指令是基於以下專案：[embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 和 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

> 上述教學提供兩種設定應用程式的方式：透過直接在程式碼中指定值，或使用設定檔。在這兩種情況下，關鍵設定是伺服器監聽傳入請求的連接埠。

## 設定應用程式 {id="setup-app"}

### 步驟 1：設定連接埠 {id="port"}

在 Azure App Service 中，環境變數 `PORT` 包含用於傳入請求的連接埠號碼。根據您在 [設定 Ktor 伺服器](server-create-and-configure.topic) 中建立應用程式的方式，您需要更新程式碼，從以下兩個地方之一讀取此環境變數：

* 如果您使用在**程式碼中**設定連接埠的範例，`PORT` 環境變數可以使用 `System.getenv()` 讀取，並透過 `.toIntOrNull()` 解析為整數。開啟 `Application.kt` 檔案並如下所示更改連接埠號碼：

   ```kotlin
   fun runBasicServer() {
      val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
      embeddedServer(Netty, port = port) {
          // ...
      }.start(wait = true)
   }
    ```
* 如果伺服器設定定義在**設定檔** `application.conf` 中，請更新它以讀取 `PORT` 環境變數，如以下範例所示：

   ```
   ktor {
       deployment {
           port = ${PORT:8080}
       }
   }
   ```
   {style="block"}

### 步驟 2：新增外掛 {id="plugins"}
開啟 `build.gradle.kts` 檔案，並將以下行新增到 `plugins` 區塊：
```kotlin
plugins {
    application
    kotlin("jvm")
    id("io.ktor.plugin") version "%ktor_version%" // ADDED
    id("com.microsoft.azure.azurewebapp") version "1.10.0" // ADDED
}
```

`io.ktor.plugin` 將提供用於建立 [fat JAR](server-fatjar.md) 的任務，而 [Azure WebApp Plugin for Gradle](https://github.com/microsoft/azure-gradle-plugins) 將用於輕鬆地在 Azure 中建立所有必要的資源。

確保在 `application` 區塊中定義了 `mainClass`，以便您的 fat JAR 有一個明確定義的進入點：

```kotlin
application {
    mainClass.set("com.example.ApplicationKt")
}
```
如果您使用 `engine-main` 範本建立專案，主類別將如下所示：

```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

### 步驟 3：設定 {id="configuration"}

如果您已經在 App Service 中建立了一個要部署的 Java 網路應用程式，您可以跳過此步驟。

否則，請在 `build.gradle.kts` 檔案末尾新增以下條目，以便 Azure Webapp 外掛程式為您建立一個：

```kotlin
 // Rename the fat JAR to the name that the deploy task expects
ktor {
    fatJar {
        archiveFileName.set("embedded-server.jar")
    }
}

// Disable the `jar` task that Azure Plugin would normally run
// to deploy the archive created by the `fatJar` task instead
tasks.named("jar") {
    enabled = false
}

// Ensure the deploy task builds the fat JAR first
tasks.named("azureWebAppDeploy") {
    dependsOn("buildFatJar")
}

// Azure Webapp Plugin configuration
azurewebapp {
  subscription = "YOUR-SUBSCRIPTION-ID"
  resourceGroup = "RESOURCE-GROUP-NAME"
  appName = "WEBAPP-NAME"
  pricingTier = "YOUR-PLAN" // e.g. "F1", "B1", "P0v3", etc.
  region = "YOUR-REGION" // e.g. "westus2"
  setRuntime(closureOf<com.microsoft.azure.gradle.configuration.GradleRuntimeConfig> {
    os("Linux") // Or "Windows"
    webContainer("Java SE")
    javaVersion("Java 21")
  })
  setAuth(closureOf<com.microsoft.azure.gradle.auth.GradleAuthConfig> {
    type = "azure_cli"
  })
}
```

有關可用設定屬性的詳細說明，請參閱 [Webapp 設定文件](https://github.com/microsoft/azure-gradle-plugins/wiki/Webapp-Configuration)。

* `pricingTier` (服務方案) 的值可以在 [適用於 Linux](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) 和 [適用於 Windows](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/) 中找到。
* `region` 的值清單可以使用以下 Azure CLI 指令取得：`az account list-locations --query "[].name" --output tsv`，或者透過在 [產品可用性表格](https://go.microsoft.com/fwlink/?linkid=2300348&clcid=0x409) 中搜尋「App Service」。

## 部署應用程式 {id="deploy-app"}

### 部署到新的網路應用程式

Azure Web App Deploy 外掛程式使用的驗證方法是 Azure CLI。如果您尚未這麼做，請使用 `az login` 登入一次並依照指示操作。

最後，透過執行 `azureWebAppDeploy` 任務來部署應用程式，該任務會設定為先建置 fat JAR，然後再進行部署：

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">
<code-block code="./gradlew :embedded-server:azureWebAppDeploy"/>
</TabItem>
<TabItem title="Windows" group-key="windows">
<code-block code="gradlew.bat :embedded-server:azureWebAppDeploy"/>
</TabItem>
</Tabs>

此任務將建立資源群組、方案和網路應用程式，然後部署 fat JAR。當部署成功時，您應該會看到如下所示的輸出：

```text
> Task: :embedded-server:azureWebAppDeploy
Auth type: AZURE_CLI
Username: some.username@example.com
Subscription: Some Subscription(13936cf1-cc18-40be-a0d4-177fe532b3dd)
Start creation Resource Group(resource-group) in region (Some Region)
Resource Group (resource-group) is successfully created.
Start creating App Service plan (asp-your-webapp-name)...
App Service plan (asp-your-webapp-name) is successfully created
Start creating Web App(your-webapp-name)...
Web App(your-webapp-name) is successfully created
Trying to deploy artifact to your-webapp-name...
Deploying (C:\docs\ktor-documentation\codeSnippets\snippets\embedded-server\build\libs\embedded-server.jar)[jar] ...
Application url: https://your-webapp-name.azurewebsites.net
```

當部署完成時，您應該能夠在上面顯示的 URL 看到您的新網路應用程式正在運行。

### 部署到現有的網路應用程式

如果您已經在 Azure App Service 中有一個現有的 Java 網路應用程式，首先透過執行 [Ktor 外掛程式](#plugins) 提供的 `buildFatJar` 任務來建置 fat JAR：

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">
<code-block code="./gradlew :embedded-server:buildFatJar"/>
</TabItem>
<TabItem title="Windows" group-key="windows">
<code-block code="gradlew.bat :embedded-server:buildFatJar"/>
</TabItem>
</Tabs>

然後，使用以下 Azure CLI 指令部署先前建立的 fat JAR：

```bash
az webapp deploy -g RESOURCE-GROUP-NAME -n WEBAPP-NAME --src-path ./path/to/embedded-server.jar --restart true
```

此指令將上傳 JAR 檔案並重新啟動您的網路應用程式。一段時間後，您應該會看到部署結果：

```text
Deployment type: jar. To override deployment type, please specify the --type parameter. Possible values: war, jar, ear, zip, startup, script, static
Initiating deployment
Deploying from local path: ./snippets/embedded-server/build/libs/embedded-server.jar
Warming up Kudu before deployment.
Warmed up Kudu instance successfully.
Polling the status of sync deployment. Start Time: 2025-09-07 00:07:14.729383+00:00 UTC
Status: Build successful. Time: 5(s)
Status: Starting the site... Time: 23(s)
Status: Starting the site... Time: 41(s)
Status: Site started successfully. Time: 44(s)
Deployment has completed successfully
You can visit your app at: http://your-app-name.some-region.azurewebsites.net
```