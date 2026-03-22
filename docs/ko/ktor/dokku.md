[//]: # (title: Dokku)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktor 애플리케이션을 Dokku에 준비하고 배포하는 방법을 알아봅니다.</link-summary>

[Dokku](https://dokku.com/)는 사용자의 리눅스 서버에서 실행되며 [Heroku](heroku.md)와 유사한 배포 워크플로우를 제공하는 셀프 호스팅 서비스형 플랫폼(PaaS, Platform-as-a-Service)입니다. Ktor 애플리케이션을 서버에 fat JAR를 수동으로 복사하여 배포할 수도 있지만, Dokku는 다음과 같이 주변 인프라를 자동화해 줍니다:

* **Git 기반 배포** — `git push`로 코드를 푸시하면 Dokku가 SSH 파일 복사나 수동 재시작 없이 애플리케이션을 자동으로 빌드하고 재시작합니다.
* **프로세스 관리** — 서버 재부팅 후를 포함하여 Dokku가 애플리케이션을 자동으로 시작, 중지 및 재시작합니다.
* **한 서버 내 다중 앱 실행** — 각 애플리케이션은 격리된 컨테이너에서 실행되므로 포트 충돌 및 앱 간의 간섭을 방지합니다.
* **HTTPS** — 단일 명령으로 애플리케이션에 Let's Encrypt 인증서를 할당합니다.
* **무중단 배포(Zero-downtime deployments)** — Dokku는 이전 컨테이너에서 트래픽을 전환하기 전, 새 컨테이너가 헬스 체크(health check)를 통과할 때까지 기다립니다.

Dokku를 실행하려면 리눅스 서버가 필요합니다. 여러 호스팅 제공업체에서 Dokku가 사전 설치된 이미지를 제공하므로 수동으로 설정할 필요가 없습니다: [DigitalOcean](https://marketplace.digitalocean.com/apps/dokku), [Hostinger](https://www.hostinger.com/vps/dokku-hosting), [HOSTKEY](https://hostkey.com/apps/developer-tools/dokku/).

## 사전 준비 사항 {id="prerequisites"}
이 튜토리얼을 시작하기 전에 다음 요구 사항을 충족하는지 확인하세요:
* Dokku가 설치된 리눅스 서버가 있어야 합니다. [수동으로 설치](https://dokku.com/docs/getting-started/installation/)하거나 Dokku 이미지가 사전 설치된 호스팅 제공업체를 이용할 수 있습니다.
* 로컬 머신에 [Git](https://git-scm.com/downloads)이 설치되어 있어야 합니다.

## 애플리케이션 준비하기 {id="prepare-app"}

### 1단계: 포트 구성 {id="port"}

먼저, 들어오는 요청을 수신하는 데 사용되는 포트를 지정해야 합니다. Dokku는 각 애플리케이션에 포트를 동적으로 할당하고 `PORT` 환경 변수를 사용하여 이를 전달합니다. 애플리케이션은 시작 시 이 변수를 읽어야 합니다. 그렇지 않으면 잘못된 포트에서 수신 대기할 수 있으며 Dokku가 트래픽을 해당 앱으로 라우팅할 수 없게 됩니다. [Ktor 서버 구성 방식](server-create-and-configure.topic)에 따라 다음 중 하나를 수행하세요:
* 서버 구성이 코드에 지정된 경우, `System.getenv()` 함수를 사용하여 환경 변수를 읽고 이를 `embeddedServer()` 함수의 `port` 파라미터에 전달합니다:
   ```kotlin
   fun main() {
       embeddedServer(Netty, port = System.getenv("PORT")?.toIntOrNull() ?: 8080) {
           // ...
       }.start(wait = true)
   }
   ```

* 서버 구성이 구성 파일에 지정된 경우, `src/main/resources`에 있는 <Path>application.conf</Path> 또는 <Path>application.yaml</Path> 파일을 열고 아래와 같이 `port` 속성을 업데이트합니다:

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

### 2단계: stage 태스크 추가 {id="stage"}

<Path>build.gradle.kts</Path> 파일을 열고 Dokku가 애플리케이션을 빌드할 때 사용하는 커스텀 `stage` 태스크를 추가합니다:
```kotlin
tasks {
    register("stage").configure {
        dependsOn("installDist")
    }
}
```
> `installDist` 태스크는 Gradle [application 플러그인](https://docs.gradle.org/current/userguide/application_plugin.html)에서 제공됩니다.
>
{style="tip"}

### 3단계: Java 버전 지정 {id="java-version"}

프로젝트 루트에 <Path>system.properties</Path> 파일을 생성하여 Java 버전을 지정합니다:
```properties
java.runtime.version=21
```

이 버전은 <Path>build.gradle.kts</Path> 파일에 지정된 JVM 툴체인 버전과 일치해야 합니다. 이 파일이 없으면 Dokku는 사용 가능한 최신 JDK 버전을 사용하게 되며, 이는 시간이 지남에 따라 변경되어 예상치 못한 빌드 실패를 일으킬 수 있습니다.

### 4단계: Procfile 생성 {id="procfile"}

프로젝트 루트에 `Procfile`을 생성하고 다음 내용을 추가합니다:
```text
web: ./build/install/<project-name>/bin/<project-name>
```
{style="block"}

이 파일은 [`stage`](#stage) 태스크에 의해 빌드된 후 애플리케이션을 시작하는 방법을 Dokku에 알려줍니다.
`<project-name>`을 실제 프로젝트 이름으로 바꿉니다. 프로젝트 이름을 확인하려면 다음 명령어를 실행하세요:
```bash
./gradlew properties -q | grep "^name:" | sed 's/name: //'
```

## 애플리케이션 배포하기 {id="deploy-app"}

Git을 사용하여 Dokku에 애플리케이션을 배포하려면 새 터미널 창을 열고 아래 단계를 따르세요:

1. [이전 섹션](#prepare-app)에서 변경한 사항을 로컬에 커밋합니다:
   ```bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. 서버에 접속하여 Dokku 애플리케이션을 생성합니다.
   `<app-name>`을 애플리케이션 이름으로 바꿉니다:
   ```bash
   ssh <user>@<your-server> dokku apps:create <app-name>
   ```
3. Dokku 서버를 Git 원격 저장소(remote)로 추가합니다.
   `<your-server>`를 서버의 호스트 이름 또는 IP 주소로 바꾸고, `<app-name>`을 이전 단계에서 사용한 이름으로 바꿉니다:
   ```bash
   git remote add dokku dokku@<your-server>:<app-name>
   ```
4. Dokku에 코드를 푸시하여 빌드 및 배포를 트리거합니다:
   ```bash
   git push dokku main
   ```
   브랜치 이름이 다를 경우 `main` 대신 해당 브랜치 이름을 사용하세요.

   Ktor 애플리케이션이 하위 디렉토리에 있는 경우 `git subtree push`를 대신 사용하세요:
    ```bash
    git subtree push --prefix=<subdir> dokku main
    ```
5. Dokku가 애플리케이션을 빌드하고 시작할 때까지 기다립니다:
   ```text
   ...
   =====> Application deployed:
          http://<app-name>.<your-server>
   ```
   {style="block"}
6. 애플리케이션에 접속할 수 있도록 도메인 또는 IP 주소를 설정합니다:
   ```bash
   ssh <user>@<your-server> dokku domains:set <app-name> <domain-or-ip>
   ```
7. 이제 `http://<domain-or-ip>`에서 애플리케이션을 사용할 수 있습니다.