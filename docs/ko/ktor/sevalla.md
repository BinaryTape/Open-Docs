[//]: # (title: Sevalla)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktor 애플리케이션을 준비하고 Sevalla에 배포하는 방법을 알아봅니다.</link-summary>

이 튜토리얼에서는 Ktor 애플리케이션을 준비하고 [Sevalla](https://sevalla.com/)에 배포하는 방법을 배웁니다. [Ktor 서버 생성 및 구성](server-create-and-configure.topic) 방식에 따라 다음 초기 프로젝트 중 하나를 사용할 수 있습니다.

* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server)

* [Engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main)

## 전제 조건 {id="prerequisites"}

이 튜토리얼을 시작하기 전에 [Sevalla 계정을 생성](https://sevalla.com)해야 합니다 ($50의 무료 크레딧이 제공됩니다).

## 샘플 애플리케이션 클론 {id="clone-sample-app"}

샘플 애플리케이션을 열려면 다음 단계를 따르세요.

1. [Ktor 문서 저장소(repository)](https://github.com/ktorio/ktor-documentation)를 클론합니다.
2. [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets) 프로젝트를 엽니다.
3. [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server) 또는 [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 샘플을 엽니다. 이 샘플들은 코드에서 직접 설정하거나 외부 설정 파일을 통해 설정하는 두 가지 다른 Ktor 서버 설정 방식을 보여줍니다. 이 프로젝트들을 배포할 때 유일한 차이점은 들어오는 요청을 대기(listen)하는 데 사용할 포트를 지정하는 방법입니다.

## 애플리케이션 준비 {id="prepare-app"}

### 1단계: 포트 구성 {id="port"}

Sevalla는 `PORT` 환경 변수를 사용하여 무작위 포트를 주입합니다. 애플리케이션은 해당 포트에서 대기하도록 구성되어야 합니다.

코드에 서버 설정이 명시된 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server) 샘플을 선택한 경우, `System.getenv()`를 사용하여 환경 변수 값을 가져올 수 있습니다. <Path>src/main/kotlin/com/example</Path> 폴더에 있는 <Path>Application.kt</Path> 파일을 열고 아래와 같이 `embeddedServer()` 함수의 port 파라미터 값을 변경하세요.

```kotlin
fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        // ...
    }.start(wait = true)
}
```

<Path>application.conf</Path> 파일에 서버 설정이 명시된 [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 샘플을 선택한 경우, `${ENV}` 구문을 사용하여 환경 변수를 port 파라미터에 할당할 수 있습니다. <Path>src/main/resources</Path>에 있는 <Path>application.conf</Path> 파일을 열고 아래와 같이 업데이트하세요.

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

### 2단계: Dockerfile 추가 {id="dockerfile"}

Sevalla에서 Ktor 프로젝트를 빌드하고 실행하려면 Dockerfile이 필요합니다. 다음은 멀티 스테이지 빌드(multi-stage build)를 사용하는 Dockerfile 샘플입니다.

```docker
# 1단계: 앱 빌드
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle installDist

# 2단계: 앱 실행
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/install/<project-name>/ ./
ENV PORT=8080
CMD ["./bin/<project-name>"]
```

`<project-name>`을 <Path>settings.gradle.kts</Path> 파일에 정의된 프로젝트 이름으로 교체해야 합니다.

```kotlin
rootProject.name = "ktor-app"
```

## 애플리케이션 배포 {id="deploy-app"}

Sevalla는 연결된 Git 저장소에서 직접 애플리케이션을 빌드하고 배포합니다. GitHub, GitLab, Bitbucket 또는 지원되는 모든 Git 제공업체에서 호스팅할 수 있습니다. 성공적으로 배포하려면 프로젝트가 커밋 및 푸시되어야 하며, 필요한 모든 파일(Dockerfile, <Path>build.gradle.kts</Path>, 소스 코드 등)이 포함되어 있어야 합니다.

애플리케이션을 배포하려면 [Sevalla](https://sevalla.com/)에 로그인하고 다음 단계를 따르세요.

1. **Applications -> Create an app**을 클릭합니다.
  ![Sevalla add app](../images/sevalla-add-app.jpg)
2. Git 저장소를 선택하고 적절한 브랜치(보통 `main` 또는 `master`)를 선택합니다.
3. **application name**을 설정하고, **region**을 선택한 다음, **pod size**를 선택합니다(0.5 CPU / 1GB RAM으로 시작할 수 있습니다).
4. **Create**를 클릭하되, 지금은 배포(deploy) 단계를 건너뜁니다.  
  ![Sevalla create app](../images/sevalla-deployment-create-app.png)
5. **Settings -> Build**로 이동하여 **Build environment** 카드 아래의 **Update Settings**를 클릭합니다.  
  ![Sevalla update build settings](../images/sevalla-deployment-update-build-settings.png)
6. 빌드 방법(build method)을 **Dockerfile**로 설정합니다.
  ![Sevalla Dockerfile settings](../images/sevalla-deployment-docker-settings.png)
7. **Dockerfile path**가 `Dockerfile`이고 **Context**가 `.`인지 확인합니다.
8. 애플리케이션의 **Deployment** 탭으로 돌아가 **Deploy**를 클릭합니다.

Sevalla는 Git 저장소를 클론하고, Dockerfile을 사용하여 Docker 이미지를 빌드하고, `PORT` 환경 변수를 주입한 후 애플리케이션을 실행합니다. 모든 것이 올바르게 구성되었다면, Ktor 앱이 `https://<your-app>.sevalla.app`에서 실시간으로 서비스될 것입니다.