[//]: # (title: Sevalla)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何準備並將 Ktor 應用程式部署到 Sevalla。</link-summary>

在本教學中，您將學習如何準備並將 Ktor 應用程式部署到 [Sevalla](https://sevalla.com/)。根據[建立 Ktor 伺服器](server-create-and-configure.topic)的方式，您可以使用以下初始專案之一：

* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server)

* [Engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main)

## 先決條件 {id="prerequisites"}

在開始本教學之前，您需要[建立 Sevalla 帳戶](https://sevalla.com)（附贈 50 美元的免費點數）。

## 複製範例應用程式 {id="clone-sample-app"}

若要開啟範例應用程式，請遵循以下步驟：

1. 複製 [Ktor 文件存儲庫](https://github.com/ktorio/ktor-documentation)。
2. 開啟 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets) 專案。
3. 開啟 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server) 或 [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 範例，這些範例展示了兩種不同的 Ktor 伺服器設定方式 — 無論是直接在程式碼中配置，或是透過外部配置文件進行配置。部署這些專案的唯一區別在於如何指定用於監聽傳入請求的連接埠。

## 準備應用程式 {id="prepare-app"}

### 步驟 1：配置連接埠 {id="port"}

Sevalla 會使用 `PORT` 環境變數注入一個隨機連接埠。您的應用程式必須配置為監聽該連接埠。

如果您選擇了在程式碼中指定伺服器配置的 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server) 範例，您可以使用 `System.getenv()` 取得環境變數的值。開啟位於 <Path>src/main/kotlin/com/example</Path> 資料夾中的 <Path>Application.kt</Path> 檔案，並如下所示修改 `embeddedServer()` 函式的 port 參數值：

```kotlin
fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        // ...
    }.start(wait = true)
}
```

如果您選擇了在 <Path>application.conf</Path> 檔案中指定伺服器配置的 [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 範例，您可以使用 `${ENV}` 語法將環境變數指派給 port 參數。開啟位於 <Path>src/main/resources</Path> 的 <Path>application.conf</Path> 檔案，並如下所示進行更新：

```hocon
ktor {
  deployment {
    port = 5000
    port = ${?PORT}
  }
  application {
    modules = [ com.example.ApplicationKt.module ]
  }
}
```

### 步驟 2：新增 Dockerfile {id="dockerfile"}

若要在 Sevalla 上組建並執行您的 Ktor 專案，您需要一個 Dockerfile。以下是使用多階段組建的 Dockerfile 範例：

```docker
# Stage 1: Build the app
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle installDist

# Stage 2: Run the app
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/install/<project-name>/ ./
ENV PORT=8080
CMD ["./bin/<project-name>"]
```

請確保將 `<project-name>` 取代為您 <Path>settings.gradle.kts</Path> 檔案中定義的專案名稱：

```kotlin
rootProject.name = "ktor-app"
```

## 部署應用程式 {id="deploy-app"}

Sevalla 會直接從連接的 Git 存儲庫組建並部署您的應用程式。這可以代管在 GitHub、GitLab、Bitbucket 或任何支援的 Git 供應商平台上。若要成功部署，請確保您的專案已提交並推送，且包含所有必要的檔案（例如您的 Dockerfile、<Path>build.gradle.kts</Path> 和原始碼）。

若要部署應用程式，請登入 [Sevalla](https://sevalla.com/) 並遵循以下步驟：

1. 點擊 **Applications -> Create an app**
  ![Sevalla add app](../images/sevalla-add-app.jpg)
2. 選擇您的 Git 存儲庫並選取相應的分支（通常為 `main` 或 `master`）。
3. 設定 **application name**（應用程式名稱）、選取 **region**（區域），並選擇您的 **pod size**（pod 大小，您可以從 0.5 CPU / 1 GB RAM 開始）。
4. 點擊 **Create**，但先跳過部署步驟  
  ![Sevalla create app](../images/sevalla-deployment-create-app.png)
5. 前往 **Settings -> Build**，然後點擊 **Build environment** 卡片下的 **Update Settings**。  
  ![Sevalla update build settings](../images/sevalla-deployment-update-build-settings.png)
6. 將組建方法設定為 **Dockerfile**。
  ![Sevalla Dockerfile settings](../images/sevalla-deployment-docker-settings.png)
7. 確認 **Dockerfile path** 為 `Dockerfile` 且 **Context** 為 `.`。
8. 返回您應用程式的 **Deployment** 索引標籤並點擊 **Deploy**。

Sevalla 將會複製您的 Git 存儲庫，使用您的 Dockerfile 組建 Docker 映像，注入 `PORT` 環境變數，並執行您的應用程式。如果一切配置正確，您的 Ktor 應用程式將在 `https://<your-app>.sevalla.app` 上線。