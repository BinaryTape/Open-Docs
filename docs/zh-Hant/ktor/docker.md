[//]: # (title: Docker)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<web-summary>
學習如何將 Ktor 應用程式部署到 Docker 容器，該容器隨後可以在本地或您選擇的雲端供應商上運行。
</web-summary>

<link-summary>
學習如何將您的應用程式部署到 Docker 容器。
</link-summary>

在本節中，我們將探討如何使用 [Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins) 來封裝、運行和部署基於 [Docker](https://www.docker.com) 的應用程式。

## 安裝 Ktor 插件 {id="install-plugin"}

要安裝 Ktor 插件，請將其添加到 `build.gradle.(kts)` 檔案的 `plugins` 區塊中：

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

## 插件任務 {id="tasks"}

在 [安裝](#install-plugin) 插件後，以下任務可用於封裝、運行和部署應用程式：

- `buildImage`：將專案的 Docker 映像檔建置為 tarball。此任務會在 `build` 目錄中生成一個 `jib-image.tar` 檔案。您可以使用 [docker load](https://docs.docker.com/engine/reference/commandline/load/) 命令將此映像檔載入到 Docker daemon：
   ```Bash
   docker load < build/jib-image.tar
   ```
- `publishImageToLocalRegistry`：將專案的 Docker 映像檔建置並發佈到本地 registry。
- `runDocker`：將專案的映像檔建置到 Docker daemon 並運行它。執行此任務將會啟動 Ktor 伺服器，預設回應於 `http://0.0.0.0:8080`。如果您的伺服器配置為使用另一個埠，您可以調整 [埠映射](#port-mapping)。
- `publishImage`：將專案的 Docker 映像檔建置並發佈到外部 registry，例如 [Docker Hub](https://hub.docker.com/) 或 [Google Container Registry](https://cloud.google.com/container-registry)。請注意，您需要使用 **[ktor.docker.externalRegistry](#external-registry)** 屬性為此任務配置外部 registry。

請注意，預設情況下，這些任務會使用 `ktor-docker-image` 名稱和 `latest` 標籤建置映像檔。您可以在 [插件配置](#name-tag) 中自訂這些值。

## 配置 Ktor 插件 {id="configure-plugin"}

要配置與 Docker 任務相關的 Ktor 插件設定，請在您的 `build.gradle.(kts)` 檔案中使用 `ktor.docker` 擴展：

```kotlin
ktor {
    docker {
        // ...
    }
}
```

### JRE 版本 {id="jre-version"}

`jreVersion` 屬性指定了映像檔中要使用的 JRE 版本：

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33-34,52-53"}

### 映像檔名稱和標籤 {id="name-tag"}

如果您需要自訂映像檔名稱和標籤，請分別使用 `localImageName` 和 `imageTag` 屬性：

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,35-36,52-53"}

### 埠映射 {id="port-mapping"}

預設情況下，[runDocker](#tasks) 任務會將 `8080` 容器埠發佈到 `8080` Docker 主機埠。如果需要，您可以使用 `portMappings` 屬性更改這些埠。如果您的伺服器 [配置](server-configuration-file.topic#predefined-properties) 為使用另一個埠，這可能會很有用。

以下範例展示了如何將 `8080` 容器埠映射到 `80` Docker 主機埠。

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,37-43,52-53"}

在此情況下，您可以透過 `http://0.0.0.0:80` 存取伺服器。

### 外部 registry {id="external-registry"}

在使用 **[publishImage](#tasks)** 任務將專案的 Docker 映像檔發佈到外部 registry 之前，您需要使用 `ktor.docker.externalRegistry` 屬性配置外部 registry。此屬性接受 `DockerImageRegistry` 實例，該實例提供了所需 registry 類型的配置：

- `DockerImageRegistry.dockerHub`：為 [Docker Hub](https://hub.docker.com/) 建立一個 `DockerImageRegistry`。
- `DockerImageRegistry.googleContainerRegistry`：為 [Google Container Registry](https://cloud.google.com/container-registry) 建立一個 `DockerImageRegistry`。

以下範例展示了如何配置 Docker Hub registry：

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,45-53"}

請注意，Docker Hub 的名稱和密碼是從環境變數中獲取的，因此您需要在運行 `publishImage` 任務之前設定這些值：

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

如果需要，您可以提供自己的 `Dockerfile` 來組裝一個包含 Ktor 應用程式的映像檔。

### 封裝應用程式 {id="packagea-pp"}

第一步，您需要將應用程式及其依賴項一併封裝。例如，這可能是一個 [fat JAR](server-fatjar.md) 或一個 [可執行 JVM 應用程式](server-packaging.md)。

### 準備 Docker 映像檔 {id="prepare-docker"}

要將應用程式 Docker 化，我們將使用 [多階段建置](https://docs.docker.com/develop/develop-images/multistage-build/)：

1. 首先，我們將為 Gradle/Maven 依賴項設置快取。此步驟是可選的，但建議執行，因為它能提高整體建置速度。
2. 然後，我們將使用 `gradle`/`maven` 映像檔生成一個包含應用程式的 fat JAR。
3. 最後，生成的發行版將在基於 JDK 映像檔創建的環境中運行。

在專案的根資料夾中，創建一個名為 `Dockerfile` 的檔案，其內容如下：

<tabs group="languages">
<tab title="Gradle" group-key="kotlin">

<code-block lang="Docker" src="snippets/tutorial-server-docker-compose/Dockerfile"/>

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

第一階段確保只有在與建置相關的檔案發生變更時才會重新下載依賴項。如果未使用第一階段，或者依賴項未在其他階段中快取，那麼每次建置時都會安裝依賴項。

在第二階段會建置 fat JAR。請注意，Gradle 也預設支援 shadow JAR 和 boot JAR。

建置的第三階段工作方式如下：

* 指示將要使用的映像檔。
* 指定暴露的埠（這不會自動暴露埠，而是在運行容器時完成）。
* 將建置輸出的內容複製到資料夾。
* 運行應用程式 (`ENTRYPOINT`)。

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

### 建置並運行 Docker 映像檔 {id="build-run"}

下一步是建置並標記 Docker 映像檔：

```bash
docker build -t my-application .
```

最後，啟動映像檔：

```bash
docker run -p 8080:8080 my-application
```

這將啟動 Ktor 伺服器，回應於 `https://0.0.0.0:8080`。