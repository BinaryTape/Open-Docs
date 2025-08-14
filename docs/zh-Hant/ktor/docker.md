[//]: # (title: Docker)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<web-summary>
了解如何將 Ktor 應用程式部署到 Docker 容器，然後可以在本機或您選擇的雲端服務供應商上執行該容器。
</web-summary>

<link-summary>
了解如何將您的應用程式部署到 Docker 容器。
</link-summary>

在本節中，我們將探討如何使用 [Ktor Gradle plugin](https://github.com/ktorio/ktor-build-plugins) 來打包、執行和部署使用 [Docker](https://www.docker.com) 的應用程式。

## 安裝 Ktor 外掛程式 {id="install-plugin"}

要安裝 Ktor 外掛程式，請將其新增至您的 `build.gradle.(kts)` 檔案的 `plugins` 區塊中：

<tabs group="languages">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

{interpolate-variables="true"}

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
plugins {
    id "io.ktor.plugin" version "%ktor_version%"
}
```

{interpolate-variables="true"}

</tab>
</tabs>

> 如果您將 Ktor Gradle 外掛程式與 Kotlin Multiplatform Gradle 外掛程式一起應用，Docker 整合功能會自動停用。
> 若要能夠同時使用它們：
> 1. 建立一個僅限 JVM 的專案，並如上所示應用 Ktor Gradle 外掛程式。
> 2. 將 Kotlin Multiplatform 專案新增為該僅限 JVM 專案的依賴項。
>
> 如果此解決方案無法解決您的問題，請在 [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) 中留言告知我們。
>
{style="warning"}

## 外掛程式任務 {id="tasks"}

[安裝](#install-plugin) 外掛程式後，以下任務可用於打包、執行和部署應用程式：

- `buildImage`：將專案的 Docker 映像檔建構為 tarball。此任務會在 `build` 目錄中產生一個 `jib-image.tar` 檔案。您可以使用 [docker load](https://docs.docker.com/engine/reference/commandline/load/) 指令將此映像檔載入到 Docker 守護程式中：
   ```Bash
   docker load < build/jib-image.tar
   ```
- `publishImageToLocalRegistry`：建構並發佈專案的 Docker 映像檔到本機暫存器。
- `runDocker`：將專案的映像檔建構到 Docker 守護程式並執行它。執行此任務將啟動 Ktor 伺服器，預設響應 `http://0.0.0.0:8080`。如果您的伺服器配置為使用另一個埠號，您可以調整 [埠號映射](#port-mapping)。
- `publishImage`：建構並發佈專案的 Docker 映像檔到外部暫存器，例如 [Docker Hub](https://hub.docker.com/) 或 [Google Container Registry](https://cloud.google.com/container-registry)。請注意，您需要使用 **[ktor.docker.externalRegistry](#external-registry)** 屬性來為此任務配置外部暫存器。

請注意，依預設，這些任務會以 `ktor-docker-image` 名稱和 `latest` 標籤建構映像檔。您可以在 [外掛程式配置](#name-tag) 中自訂這些值。

## 配置 Ktor 外掛程式 {id="configure-plugin"}

要配置與 Docker 任務相關的 Ktor 外掛程式設定，請在您的 `build.gradle.(kts)` 檔案中使用 `ktor.docker` 擴充功能：

```kotlin
ktor {
    docker {
        // ...
    }
}
```

### JRE 版本 {id="jre-version"}

`jreVersion` 屬性指定了要在映像檔中使用的 JRE 版本：

[object Promise]

### 映像檔名稱和標籤 {id="name-tag"}

如果您需要自訂映像檔名稱和標籤，請分別使用 `localImageName` 和 `imageTag` 屬性：

[object Promise]

### 埠號映射 {id="port-mapping"}

依預設，[runDocker](#tasks) 任務會將 `8080` 容器埠號發佈到 `8080` Docker 主機埠號。如果需要，您可以使用 `portMappings` 屬性更改這些埠號。如果您的伺服器[配置](server-configuration-file.topic#predefined-properties)為使用另一個埠號，這可能會很有用。

以下範例展示如何將 `8080` 容器埠號映射到 `80` Docker 主機埠號。

[object Promise]

在這種情況下，您可以在 `http://0.0.0.0:80` 上存取伺服器。

### 外部暫存器 {id="external-registry"}

在使用 **[publishImage](#tasks)** 任務將專案的 Docker 映像檔發佈到外部暫存器之前，您需要使用 `ktor.docker.externalRegistry` 屬性來配置外部暫存器。此屬性接受 `DockerImageRegistry` 實例，該實例為所需的暫存器類型提供配置：

- `DockerImageRegistry.dockerHub`：為 [Docker Hub](https://hub.docker.com/) 建立一個 `DockerImageRegistry`。
- `DockerImageRegistry.googleContainerRegistry`：為 [Google Container Registry](https://cloud.google.com/container-registry) 建立一個 `DockerImageRegistry`。

以下範例展示如何配置 Docker Hub 暫存器：

[object Promise]

請注意，Docker Hub 的名稱和密碼是從環境變數中獲取的，因此您需要在執行 `publishImage` 任務之前設定這些值：

<tabs group="os">
<tab title="Linux/macOS" group-key="unix">

```Bash
export DOCKER_HUB_USERNAME=yourHubUsername
export DOCKER_HUB_PASSWORD=yourHubPassword
```

</tab>
<tab title="Windows" group-key="windows">

```Bash
setx DOCKER_HUB_USERNAME yourHubUsername
setx DOCKER_HUB_PASSWORD yourHubPassword
```

</tab>
</tabs>

## 手動映像檔配置 {id="manual"}

如果需要，您可以提供自己的 `Dockerfile` 來組裝包含 Ktor 應用程式的映像檔。

### 打包應用程式 {id="packagea-pp"}

作為第一步，您需要將應用程式及其依賴項一起打包。例如，這可能是一個 [超大 JAR (fat JAR)](server-fatjar.md) 或一個 [可執行 JVM 應用程式](server-packaging.md)。

### 準備 Docker 映像檔 {id="prepare-docker"}

為了將應用程式 Docker 化，我們將使用 [多階段建構 (multi-stage builds)](https://docs.docker.com/develop/develop-images/multistage-build/)：

1. 首先，我們將為 Gradle/Maven 依賴項設定快取。此步驟是可選的，但建議執行，因為它能提高整體建構速度。
2. 接著，我們將使用 `gradle`/`maven` 映像檔來產生一個包含應用程式的超大 JAR。
3. 最後，生成的發佈將在基於 JDK 映像檔建立的環境中執行。

在專案的根資料夾中，建立一個名為 `Dockerfile` 的檔案，其內容如下：

<tabs group="languages">
<tab title="Gradle" group-key="kotlin">

[object Promise]

</tab>
<tab title="Maven" group-key="maven">

```Docker
# Stage 1: Cache Maven dependencies
FROM maven:3.8-amazoncorretto-21 AS cache
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

# Stage 2: Build Application
FROM maven:3.8-amazoncorretto-21 AS build
WORKDIR /app
COPY --from=cache /root/.m2 /root/.m2
COPY . .
RUN mvn clean package

# Stage 3: Create the Runtime Image
FROM amazoncorretto:21-slim AS runtime
EXPOSE 8080
WORKDIR /app
COPY --from=build /app/target/*-with-dependencies.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

</tab>
</tabs>

第一階段確保只有在建構相關檔案發生變更時，依賴項才會被重新下載。如果未使用第一階段，或未在其他階段快取依賴項，則每次建構時都會安裝依賴項。

在第二階段中會建構超大 JAR。請注意，Gradle 預設也支援 shadow 和 boot JAR。

建構的第三階段運作方式如下：

* 指示將使用哪個映像檔。
* 指定暴露的埠號（這不會自動暴露埠號，暴露動作會在執行容器時完成）。
* 將建構輸出的內容複製到資料夾。
* 執行應用程式 (`ENTRYPOINT`)。

<tip id="jdk_image_replacement_tip">
  <p>
   此範例使用 Amazon Corretto Docker 映像檔，但您可以將其替換為任何其他合適的替代方案，例如：
  </p>
  <list>
    <li><a href="https://hub.docker.com/_/eclipse-temurin">Eclipse Temurin</a></li>
    <li><a href="https://hub.docker.com/_/ibm-semeru-runtimes">IBM Semeru</a></li>
    <li><a href="https://hub.docker.com/_/ibmjava">IBM Java</a></li>
    <li><a href="https://hub.docker.com/_/sapmachine">SAP Machine JDK</a></li>
  </list>
</tip>

### 建構並執行 Docker 映像檔 {id="build-run"}

下一步是建構並標記 Docker 映像檔：

```bash
docker build -t my-application .
```

最後，啟動映像檔：

```bash
docker run -p 8080:8080 my-application
```

這將啟動 Ktor 伺服器，響應 `https://0.0.0.0:8080`。