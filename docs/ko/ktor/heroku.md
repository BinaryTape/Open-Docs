[//]: # (title: 헤로쿠)

<show-structure for="chapter" depth="2"/>

<link-summary>Ktor 애플리케이션을 헤로쿠에 준비하고 배포하는 방법을 알아보세요.</link-summary>

이 튜토리얼에서는 Ktor 애플리케이션을 헤로쿠에 준비하고 배포하는 방법을 보여드립니다.

## 사전 요구 사항 {id="prerequisites"}
이 튜토리얼을 시작하기 전에 다음 사전 요구 사항이 충족되었는지 확인하세요.
* 헤로쿠 계정이 있어야 합니다.
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)가 로컬 머신에 설치되어 있어야 합니다.

## 샘플 애플리케이션 생성 {id="create-sample-app"}

[새 Ktor 프로젝트 생성, 열기 및 실행](server-create-a-new-project.topic)에 설명된 대로 샘플 애플리케이션을 생성합니다.

> Ktor는 [서버 생성 및 구성](server-create-and-configure.topic)을 위한 두 가지 접근 방식(코드 또는 구성 파일 사용)을 제공합니다. 배포 시 유일한 차이점은 들어오는 요청을 수신하는 데 사용되는 [포트](#port)를 지정하는 방법입니다.

## 애플리케이션 준비 {id="prepare-app"}

### 1단계: 포트 구성 {id="port"}

먼저, 들어오는 요청을 수신하는 데 사용될 포트를 지정해야 합니다. 헤로쿠는 `PORT` 환경 변수를 사용하므로, 애플리케이션이 이 변수의 값을 사용하도록 구성해야 합니다. [Ktor 서버를 구성](server-create-and-configure.topic)하는 방식에 따라 다음 중 하나를 수행하세요:
* 서버 구성이 코드에 지정된 경우, `System.getenv`를 사용하여 환경 변수 값을 얻을 수 있습니다. `src/main/kotlin/com/example` 폴더에 있는 `Application.kt` 파일을 열고, 아래와 같이 `embeddedServer` 함수의 `port` 파라미터 값을 변경하세요:
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

* 서버 구성이 `application.conf` 파일에 지정된 경우, `${ENV}` 구문을 사용하여 환경 변수를 `port` 파라미터에 할당할 수 있습니다. `src/main/resources`에 있는 `application.conf` 파일을 열고, 아래와 같이 업데이트하세요:
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### 2단계: stage 태스크 추가 {id="stage"}
`build.gradle.kts` 파일을 열고, 헤로쿠에서 실행되는 실행 파일을 만들기 위해 헤로쿠가 사용하는 사용자 지정 `stage` 태스크를 추가하세요:
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
`installDist` 태스크는 Gradle [애플리케이션 플러그인](https://docs.gradle.org/current/userguide/application_plugin.html)에 포함되어 있으며, 이 플러그인은 이미 샘플 프로젝트에 추가되어 있습니다.

### 3단계: Procfile 생성 {id="procfile"}
프로젝트 루트에 [Procfile](https://devcenter.heroku.com/articles/procfile)을 생성하고 다음 내용을 추가하세요:
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

이 파일은 [`stage`](#stage) 태스크에 의해 생성된 애플리케이션 실행 파일의 경로를 지정하며, 헤로쿠가 애플리케이션을 시작할 수 있도록 합니다.
`ktor-get-started-sample`을 프로젝트 이름으로 바꿔야 할 수도 있습니다.

## 애플리케이션 배포 {id="deploy-app"}

Git을 사용하여 헤로쿠에 애플리케이션을 배포하려면 터미널을 열고 다음 단계를 따르세요:

1. [이전 섹션](#prepare-app)에서 변경한 내용을 로컬에 커밋합니다:
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. 헤로쿠 CLI에 로그인합니다:
   ```Bash
   heroku login
   ```
3. `heroku create` 명령어를 사용하여 헤로쿠 애플리케이션을 생성합니다.
   `ktor-sample-heroku`를 애플리케이션 이름으로 바꿔야 합니다:
   ```Bash
   heroku create ktor-sample-heroku
   ```
   이 명령어는 두 가지를 수행합니다:
   * 새 헤로쿠 애플리케이션을 생성합니다. 이 애플리케이션은 [웹 대시보드](https://dashboard.heroku.com/apps/)에서 확인할 수 있습니다.
   * 로컬 저장소에 `heroku`라는 새 Git 리모트를 추가합니다.

4. 애플리케이션을 배포하려면 `heroku main`으로 변경 사항을 푸시합니다...
   ```Bash
   git push heroku main
   ```
   ... 그리고 헤로쿠가 애플리케이션을 빌드하고 배포할 때까지 기다리세요:
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}