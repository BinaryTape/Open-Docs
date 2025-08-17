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
了解如何將 Ktor 應用程式部署到 Docker 容器，然後可以在本地或您選擇的雲端供應商上執行。
</web-summary>

<link-summary>
了解如何將您的應用程式部署到 Docker 容器。
</link-summary>

在本節中，我們將探討如何使用 [Ktor Gradle plugin](https://github.com/ktorio/ktor-build-plugins) 來
打包、執行和部署使用 [Docker](https://www.docker.com) 的應用程式。

## 安裝 Ktor 插件 {id="install-plugin"}

要安裝 Ktor 插件，請將其新增到您的 `build.gradle.(kts)` 檔案的 `plugins` 區塊中：

<Tabs group="languages">
<TabItem title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

{interpolate-variables="true"}

</TabItem>
<TabItem title="Gradle (Groovy)" group-key="groovy">

```groovy
plugins {
    id "io.ktor.plugin" version "%ktor_version%"
}
```

{interpolate-variables="true"}

</TabItem>
</Tabs>

> 如果您將 Ktor Gradle plugin 與 Kotlin Multiplatform Gradle plugin 一起應用，Docker 整合功能會自動停用。
> 為了能夠將它們一起使用：
> 1. 建立一個僅限 JVM 的專案，並如上所示應用 Ktor Gradle plugin。
> 2. 將 Kotlin Multiplatform 專案作為依賴項新增到該僅限 JVM 的專案中。
>
> 如果此解決方法未能解決您的問題，請在 [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) 中留言告知我們。
>
{style="warning"}

## 插件任務 {id="tasks"}

[安裝](#install-plugin) 插件後，以下任務可用於打包、執行和部署
應用程式：

- `buildImage`: 將專案的 Docker 映像檔建置為 tarball。此任務會在 `build` 目錄中產生一個 `jib-image.tar` 檔案。您可以
  使用 [docker load](https://docs.docker.com/engine/reference/commandline/load/) 命令將此映像檔載入到 Docker daemon：
   ```Bash
   docker load < build/jib-image.tar
   ```
- `publishImageToLocalRegistry`: 建置並發佈專案的 Docker 映像檔到本地 registry。
- `runDocker`: 將專案的映像檔建置到 Docker daemon 並執行它。執行此任務將會啟動 Ktor 伺服器，
  預設在 `http://0.0.0.0:8080` 上響應。如果您的伺服器配置為使用另一個埠口，您可以
  調整 [埠口映射](#port-mapping)。
- `publishImage`: 建置並發佈專案的 Docker 映像檔到外部 registry，例如 [Docker Hub](https://hub.docker.com/) 或 [Google Container Registry](https://cloud.google.com/container-registry)。
  請注意，您需要使用 **[ktor.docker.externalRegistry](#external-registry)**
  屬性來配置此任務的外部 registry。

請注意，預設情況下，這些任務會以 `ktor-docker-image` 名稱和 `latest` 標籤建置映像檔。
您可以在 [插件配置](#name-tag) 中自訂這些值。

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

`jreVersion` 屬性指定映像檔中使用的 JRE 版本：

```kotlin
ktor {
    docker {
        jreVersion.set(JavaVersion.VERSION_17)
    }
}
```

### 映像檔名稱和標籤 {id="name-tag"}

如果您需要自訂映像檔名稱和標籤，請分別使用 `localImageName` 和 `imageTag` 屬性：

```kotlin
ktor {
    docker {
        localImageName.set("sample-docker-image")
        imageTag.set("0.0.1-preview")
    }
}
```

### 埠口映射 {id="port-mapping"}

預設情況下，[runDocker](#tasks) 任務會將 `8080` 容器埠口發佈到 `8080` Docker 主機埠口。
如果需要，您可以使用 `portMappings` 屬性更改這些埠口。
如果您的伺服器 [配置](server-configuration-file.topic#predefined-properties) 為使用其他埠口，這可能很有用。

以下範例展示了如何將 `8080` 容器埠口映射到 `80` Docker 主機埠口。

```kotlin
ktor {
    docker {
        portMappings.set(listOf(
            io.ktor.plugin.features.DockerPortMapping(
                80,
                8080,
                io.ktor.plugin.features.DockerPortMappingProtocol.TCP
            )
        ))
    }
}
```

在這種情況下，您可以透過 `http://0.0.0.0:80` 存取伺服器。

### 外部 registry {id="external-registry"}

在使用 **[publishImage](#tasks)** 任務將專案的 Docker 映像檔發佈到外部 registry 之前，您需要
使用 `ktor.docker.externalRegistry` 屬性配置外部 registry。此屬性接受
`DockerImageRegistry` 實例，該實例為所需的 registry 類型提供配置：

- `DockerImageRegistry.dockerHub`: 為 [Docker Hub](https://hub.docker.com/) 建立一個 `DockerImageRegistry`。
- `DockerImageRegistry.googleContainerRegistry`: 為 [Google Container Registry](https://cloud.google.com/container-registry) 建立一個 `DockerImageRegistry`。

以下範例展示了如何配置 Docker Hub registry：

```kotlin
ktor {
    docker {
        externalRegistry.set(
            io.ktor.plugin.features.DockerImageRegistry.dockerHub(
                appName = provider { "ktor-app" },
                username = providers.environmentVariable("DOCKER_HUB_USERNAME"),
                password = providers.environmentVariable("DOCKER_HUB_PASSWORD")
            )
        )
    }
}
```

請注意，Docker Hub 的名稱和密碼是從環境變數中取得的，因此您需要在執行 `publishImage` 任務之前設定這些值：

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">

```Bash
export DOCKER_HUB_USERNAME=yourHubUsername
export DOCKER_HUB_PASSWORD=yourHubPassword
```

</TabItem>
<TabItem title="Windows" group-key="windows">

```Bash
setx DOCKER_HUB_USERNAME yourHubUsername
setx DOCKER_HUB_PASSWORD yourHubPassword
```

</TabItem>
</Tabs>

## 手動映像檔配置 {id="manual"}

如果需要，您可以提供自己的 `Dockerfile` 來組裝包含 Ktor 應用程式的映像檔。

### 打包應用程式 {id="packagea-pp"}

第一步，您需要打包您的應用程式及其依賴項。
例如，這可能是一個 [fat JAR](server-fatjar.md) 或一個 [可執行 JVM 應用程式](server-packaging.md)。

### 準備 Docker 映像檔 {id="prepare-docker"}

為了將應用程式 Docker 化，我們將
使用 [多階段建置 (multi-stage builds)](https://docs.docker.com/develop/develop-images/multistage-build/)：

1. 首先，我們將為 Gradle/Maven 依賴項設定快取。此步驟是可選的，但建議執行，因為它會提高整體建置速度。
2. 然後，我們將使用 `gradle`/`maven` 映像檔來產生應用程式的 fat JAR。
3. 最後，生成的發行版將在基於 JDK 映像檔建立的環境中執行。

在專案的根資料夾中，建立一個名為 `Dockerfile` 的檔案，其內容如下：

<Tabs group="languages">
<TabItem title="Gradle" group-key="kotlin">

<code-block lang="Docker" code="# 階段 1：快取 Gradle 依賴項&#10;FROM gradle:latest AS cache&#10;RUN mkdir -p /home/gradle/cache_home&#10;ENV GRADLE_USER_HOME=/home/gradle/cache_home&#10;COPY build.gradle.* gradle.properties /home/gradle/app/&#10;COPY gradle /home/gradle/app/gradle&#10;WORKDIR /home/gradle/app&#10;RUN gradle clean build -i --stacktrace&#10;&#10;# 階段 2：建置應用程式&#10;FROM gradle:latest AS build&#10;COPY --from=cache /home/gradle/cache_home /home/gradle/.gradle&#10;COPY --chown=gradle:gradle . /home/gradle/src&#10;WORKDIR /home/gradle/src&#10;# 建置 fat JAR，Gradle 預設也支援 shadow&#10;# 和 boot JAR。&#10;RUN gradle buildFatJar --no-daemon&#10;&#10;# 階段 3：建立運行時映像檔&#10;FROM amazoncorretto:22 AS runtime&#10;EXPOSE 8080&#10;RUN mkdir /app&#10;COPY --from=build /home/gradle/src/build/libs/*.jar /app/ktor-docker-sample.jar&#10;ENTRYPOINT [&quot;java&quot;,&quot;-jar&quot;,&quot;/app/ktor-docker-sample.jar&quot;]"/>

</TabItem>
<TabItem title="Maven" group-key="maven">

```Docker
# 階段 1：快取 Maven 依賴項
FROM maven:3.8-amazoncorretto-21 AS cache
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

# 階段 2：建置應用程式
FROM maven:3.8-amazoncorretto-21 AS build
WORKDIR /app
COPY --from=cache /root/.m2 /root/.m2
COPY . .
RUN mvn clean package

# 階段 3：建立運行時映像檔
FROM amazoncorretto:21-slim AS runtime
EXPOSE 8080
WORKDIR /app
COPY --from=build /app/target/*-with-dependencies.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

</TabItem>
</Tabs>

第一個階段確保只有在建置相關檔案發生更改時才會重新下載依賴項。如果未使用第一個階段，或依賴項未在其他階段快取，
則每次建置時都會安裝依賴項。

在第二個階段建置 fat JAR。請注意，Gradle 預設也支援 shadow 和 boot JAR。

建置的第三個階段以以下方式運作：

*   指示將使用的映像檔。
*   指定暴露的埠口（這不會自動暴露埠口，在運行容器時完成）。
*   將建置輸出中的內容複製到資料夾。
*   運行應用程式 (`ENTRYPOINT`)。

<tip id="jdk_image_replacement_tip">
  <p>
   本範例使用 Amazon Corretto Docker 映像檔，但您可以將其替換為任何其他適合的替代方案，例如：
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

這將會啟動 Ktor 伺服器，在 `https://0.0.0.0:8080` 上響應。