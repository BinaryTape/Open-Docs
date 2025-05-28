[//]: # (title: Docker)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<web-summary>
Ktor 애플리케이션을 Docker 컨테이너에 배포하는 방법을 알아보세요. 이렇게 배포된 애플리케이션은 로컬 또는 원하는 클라우드 제공업체에서 실행할 수 있습니다.
</web-summary>

<link-summary>
애플리케이션을 Docker 컨테이너에 배포하는 방법을 알아보세요.
</link-summary>

이 섹션에서는 [Ktor Gradle 플러그인](https://github.com/ktorio/ktor-build-plugins)을 사용하여 [Docker](https://www.docker.com)로 애플리케이션을 패키징, 실행 및 배포하는 방법을 알아봅니다.

## Ktor 플러그인 설치 {id="install-plugin"}

Ktor 플러그인을 설치하려면 `build.gradle.(kts)` 파일의 `plugins` 블록에 추가하세요.

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

## 플러그인 태스크 {id="tasks"}

플러그인을 [설치](#install-plugin)한 후 애플리케이션 패키징, 실행 및 배포를 위해 다음 태스크를 사용할 수 있습니다.

- `buildImage`: 프로젝트의 Docker 이미지를 tarball로 빌드합니다. 이 태스크는 `build` 디렉터리에 `jib-image.tar` 파일을 생성합니다. [docker load](https://docs.docker.com/engine/reference/commandline/load/) 명령어를 사용하여 이 이미지를 Docker 데몬에 로드할 수 있습니다.
   ```Bash
   docker load < build/jib-image.tar
   ```
- `publishImageToLocalRegistry`: 프로젝트의 Docker 이미지를 빌드하여 로컬 레지스트리에 게시합니다.
- `runDocker`: 프로젝트의 이미지를 Docker 데몬으로 빌드하고 실행합니다. 이 태스크를 실행하면 기본적으로 `http://0.0.0.0:8080`에서 응답하는 Ktor 서버가 시작됩니다. 서버가 다른 포트를 사용하도록 구성된 경우 [포트 매핑](#port-mapping)을 조정할 수 있습니다.
- `publishImage`: 프로젝트의 Docker 이미지를 [Docker Hub](https://hub.docker.com/) 또는 [Google Container Registry](https://cloud.google.com/container-registry)와 같은 외부 레지스트리에 빌드하여 게시합니다. 이 태스크를 위해 **[ktor.docker.externalRegistry](#external-registry)** 속성을 사용하여 외부 레지스트리를 구성해야 합니다.

기본적으로 이 태스크들은 `ktor-docker-image` 이름과 `latest` 태그로 이미지를 빌드합니다. 이 값들은 [플러그인 구성](#name-tag)에서 사용자 지정할 수 있습니다.

## Ktor 플러그인 구성 {id="configure-plugin"}

Docker 태스크와 관련된 Ktor 플러그인 설정을 구성하려면 `build.gradle.(kts)` 파일에서 `ktor.docker` 확장 기능을 사용하세요.

```kotlin
ktor {
    docker {
        // ...
    }
}
```

### JRE 버전 {id="jre-version"}

`jreVersion` 속성은 이미지에 사용할 JRE 버전을 지정합니다.

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33-34,52-53"}

### 이미지 이름 및 태그 {id="name-tag"}

이미지 이름과 태그를 사용자 지정해야 하는 경우 각각 `localImageName` 및 `imageTag` 속성을 사용하세요.

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,35-36,52-53"}

### 포트 매핑 {id="port-mapping"}

기본적으로 [runDocker](#tasks) 태스크는 `8080` 컨테이너 포트를 `8080` Docker 호스트 포트에 게시합니다. 필요한 경우 `portMappings` 속성을 사용하여 이러한 포트를 변경할 수 있습니다. 이는 서버가 다른 포트를 사용하도록 [구성](server-configuration-file.topic#predefined-properties)된 경우 유용할 수 있습니다.

아래 예시는 `8080` 컨테이너 포트를 `80` Docker 호스트 포트에 매핑하는 방법을 보여줍니다.

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,37-43,52-53"}

이 경우 `http://0.0.0.0:80`에서 서버에 접속할 수 있습니다.

### 외부 레지스트리 {id="external-registry"}

**[publishImage](#tasks)** 태스크를 사용하여 프로젝트의 Docker 이미지를 외부 레지스트리에 게시하기 전에 `ktor.docker.externalRegistry` 속성을 사용하여 외부 레지스트리를 구성해야 합니다. 이 속성은 `DockerImageRegistry` 인스턴스를 허용하며, 필요한 레지스트리 유형에 대한 구성을 제공합니다.

- `DockerImageRegistry.dockerHub`: [Docker Hub](https://hub.docker.com/)용 `DockerImageRegistry`를 생성합니다.
- `DockerImageRegistry.googleContainerRegistry`: [Google Container Registry](https://cloud.google.com/container-registry)용 `DockerImageRegistry`를 생성합니다.

아래 예시는 Docker Hub 레지스트리를 구성하는 방법을 보여줍니다.

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,45-53"}

Docker Hub 이름과 암호는 환경 변수에서 가져오므로, `publishImage` 태스크를 실행하기 전에 이 값들을 설정해야 합니다.

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

## 수동 이미지 구성 {id="manual"}

필요한 경우 자체 `Dockerfile`을 제공하여 Ktor 애플리케이션으로 이미지를 어셈블할 수 있습니다.

### 애플리케이션 패키징 {id="packagea-pp"}

첫 번째 단계로, 애플리케이션을 종속성과 함께 패키징해야 합니다. 예를 들어, [fat JAR](server-fatjar.md) 또는 [실행 가능한 JVM 애플리케이션](server-packaging.md)일 수 있습니다.

### Docker 이미지 준비 {id="prepare-docker"}

애플리케이션을 Docker화하려면 [다단계 빌드](https://docs.docker.com/develop/develop-images/multistage-build/)를 사용합니다.

1.  먼저, Gradle/Maven 종속성에 대한 캐싱을 설정합니다. 이 단계는 선택 사항이지만 전체 빌드 속도를 향상시키므로 권장됩니다.
2.  다음으로, `gradle`/`maven` 이미지를 사용하여 애플리케이션과 함께 fat JAR를 생성합니다.
3.  마지막으로, 생성된 배포는 JDK 이미지를 기반으로 생성된 환경에서 실행됩니다.

프로젝트의 루트 폴더에 `Dockerfile`이라는 파일을 생성하고 다음 내용을 추가하세요.

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

첫 번째 단계는 빌드 관련 파일이 변경될 때만 종속성이 다시 다운로드되도록 합니다. 첫 번째 단계가 사용되지 않거나 다른 단계에서 종속성이 캐시되지 않으면 모든 빌드에서 종속성이 설치됩니다.

두 번째 단계에서는 fat JAR가 빌드됩니다. Gradle은 기본적으로 shadow 및 boot JAR도 지원한다는 점에 유의하세요.

빌드의 세 번째 단계는 다음 방식으로 작동합니다.

*   어떤 이미지를 사용할 것인지 나타냅니다.
*   노출된 포트를 지정합니다 (이것은 포트를 자동으로 노출하지 않으며, 컨테이너를 실행할 때 수행됩니다).
*   빌드 출력의 내용을 폴더로 복사합니다.
*   애플리케이션을 실행합니다 (`ENTRYPOINT`).

<tip id="jdk_image_replacement_tip">
  <p>
   이 예제는 Amazon Corretto Docker 이미지를 사용하지만, 다음과 같은 다른 적절한 대안으로 대체할 수 있습니다.
  </p>
  <list>
    <li><a href="https://hub.docker.com/_/eclipse-temurin">Eclipse Temurin</a></li>
    <li><a href="https://hub.docker.com/_/ibm-semeru-runtimes">IBM Semeru</a></li>
    <li><a href="https://hub.docker.com/_/ibmjava">IBM Java</a></li>
    <li><a href="https://hub.docker.com/_/sapmachine">SAP Machine JDK</a></li>
  </list>
</tip>

### Docker 이미지 빌드 및 실행 {id="build-run"}

다음 단계는 Docker 이미지를 빌드하고 태그를 지정하는 것입니다.

```bash
docker build -t my-application .
```

마지막으로, 이미지를 시작합니다.

```bash
docker run -p 8080:8080 my-application
```

이렇게 하면 Ktor 서버가 시작되어 `https://0.0.0.0:8080`에서 응답합니다.