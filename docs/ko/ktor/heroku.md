[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktor 애플리케이션을 Heroku에 준비하고 배포하는 방법을 알아봅니다.</link-summary>

이 튜토리얼에서는 Ktor 애플리케이션을 Heroku에 준비하고 배포하는 방법을 보여드리겠습니다.

## Prerequisites {id="prerequisites"}
이 튜토리얼을 시작하기 전에 다음 전제 조건이 충족되었는지 확인하세요.
* Heroku 계정이 있어야 합니다.
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)가 머신에 설치되어 있어야 합니다.

## Create a sample application {id="create-sample-app"}

[](server-create-a-new-project.topic)에 설명된 대로 샘플 애플리케이션을 만드세요.

> Ktor는 [서버를 생성하고 구성하는](server-create-and-configure.topic) 두 가지 접근 방식(코드 또는 구성 파일 사용)을 제공합니다. 배포의 유일한 차이점은 들어오는 요청을 수신하는 데 사용되는 [포트를 지정하는](#port) 방법입니다.

## Prepare an application {id="prepare-app"}

### Step 1: Configure a port {id="port"}

먼저, 들어오는 요청을 수신하는 데 사용되는 포트를 지정해야 합니다. Heroku는 `PORT` 환경 변수를 사용하므로, 이 변수의 값을 사용하도록 애플리케이션을 구성해야 합니다. [Ktor 서버를 구성하는](server-create-and-configure.topic) 방식에 따라 다음 중 하나를 수행하세요.
* 서버 구성이 코드에 지정된 경우, `System.getenv`를 사용하여 환경 변수 값을 얻을 수 있습니다. `src/main/kotlin/com/example` 폴더에 있는 `Application.kt` 파일을 열고 아래와 같이 `embeddedServer` 함수의 `port` 매개변수 값을 변경하세요.
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

* 서버 구성이 `application.conf` 파일에 지정된 경우, `${ENV}` 구문을 사용하여 환경 변수를 `port` 매개변수에 할당할 수 있습니다. `src/main/resources`에 있는 `application.conf` 파일을 열고 아래와 같이 업데이트하세요.
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### Step 2: Add a stage task {id="stage"}
`build.gradle.kts` 파일을 열고 Heroku가 플랫폼에서 실행할 실행 파일을 만드는 데 사용하는 사용자 지정 `stage` 작업을 추가하세요.
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
`installDist` 작업은 샘플 프로젝트에 이미 추가된 Gradle [애플리케이션 플러그인](https://docs.gradle.org/current/userguide/application_plugin.html)과 함께 제공됩니다.

### Step 3: Create a Procfile {id="procfile"}
프로젝트 루트에 [Procfile](https://devcenter.heroku.com/articles/procfile)을 생성하고 다음 내용을 추가하세요.
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

이 파일은 [stage](#stage) 작업에 의해 생성된 애플리케이션의 실행 파일 경로를 지정하며 Heroku가 애플리케이션을 시작할 수 있도록 합니다.
`ktor-get-started-sample`을 프로젝트 이름으로 바꿔야 할 수도 있습니다.

## Deploy an application {id="deploy-app"}

Git을 사용하여 Heroku에 애플리케이션을 배포하려면 터미널을 열고 다음 단계를 따르세요.

1. [이전 섹션](#prepare-app)에서 변경한 내용을 로컬에 커밋합니다.
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. Heroku CLI에 로그인합니다.
   ```Bash
   heroku login
   ```
3. `heroku create` 명령을 사용하여 Heroku 애플리케이션을 생성합니다.
   `ktor-sample-heroku`를 애플리케이션 이름으로 바꿔야 합니다.
   ```Bash
   heroku create ktor-sample-heroku
   ```
   이 명령은 두 가지 작업을 수행합니다.
   * [웹 대시보드](https://dashboard.heroku.com/apps/)에서 사용 가능한 새 Heroku 애플리케이션을 생성합니다.
   * 로컬 저장소에 `heroku`라는 새 Git 원격 저장소를 추가합니다.

4. 애플리케이션을 배포하려면 `heroku main`으로 변경 사항을 푸시합니다.
   ```Bash
   git push heroku main
   ```
   ... 그리고 Heroku가 애플리케이션을 빌드하고 게시할 때까지 기다립니다.
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}