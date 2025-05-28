[//]: # (title: Google App Engine)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>초기 프로젝트</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>최종 프로젝트</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard">google-appengine-standard</a>
</p>
</tldr>

<web-summary>
이 튜토리얼에서는 Ktor 프로젝트를 Google App Engine 표준 환경에 준비하고 배포하는 방법을 보여줍니다.
</web-summary>

<link-summary>
프로젝트를 Google App Engine 표준 환경에 배포하는 방법을 알아보세요.
</link-summary>

이 튜토리얼에서는 Ktor 프로젝트를 Google App Engine 표준 환경에 준비하고 배포하는 방법을 보여드립니다. 이 튜토리얼은 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 샘플 프로젝트를 시작 프로젝트로 사용합니다.

## 전제 조건 {id="prerequisites"}
이 튜토리얼을 시작하기 전에 다음 단계를 수행해야 합니다.
* [Google Cloud Platform](https://console.cloud.google.com/)에 등록하세요.
* [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)를 설치하고 초기화하세요.
* 다음 명령어를 사용하여 Java용 App Engine 확장을 설치하세요.
   ```Bash
   gcloud components install app-engine-java
   ```

## 샘플 애플리케이션 클론하기 {id="clone"}
샘플 애플리케이션을 열려면 아래 단계를 따르세요.
1. Ktor 문서 저장소를 클론하고 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 프로젝트를 엽니다.
2. [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 모듈을 엽니다.
   > 참고로, Ktor는 [서버를 생성하고 구성하는](server-create-and-configure.topic) 두 가지 방식(코드 내에서 또는 구성 파일을 사용하여)을 제공합니다. 이 튜토리얼에서는 두 가지 방식 모두에서 배포 과정은 동일합니다.

## 애플리케이션 준비하기 {id="prepare-app"}
### 1단계: Shadow 플러그인 적용하기 {id="configure-shadow-plugin"}
이 튜토리얼에서는 [fat JAR](server-fatjar.md)를 사용하여 애플리케이션을 Google App Engine에 배포하는 방법을 보여줍니다. fat JAR를 생성하려면 Shadow 플러그인을 적용해야 합니다. `build.gradle.kts` 파일을 열고 `plugins` 블록에 플러그인을 추가합니다.
```kotlin
```
{src="snippets/google-appengine-standard/build.gradle.kts" include-lines="7,11-12"}

### 2단계: App Engine 플러그인 구성하기 {id="configure-app-engine-plugin"}
[Google App Engine Gradle 플러그인](https://github.com/GoogleCloudPlatform/app-gradle-plugin)은 Google App Engine 애플리케이션을 빌드하고 배포하기 위한 태스크를 제공합니다. 이 플러그인을 사용하려면 아래 단계를 따르세요.

1. `settings.gradle.kts` 파일을 열고 Central Maven 저장소에서 플러그인을 참조하기 위해 다음 코드를 삽입합니다.
   ```groovy
   ```
   {src="settings.gradle.kts" include-lines="1-14"}

2. `build.gradle.kts`를 열고 `plugins` 블록에 플러그인을 적용합니다.
   ```kotlin
   ```
   {src="snippets/google-appengine-standard/build.gradle.kts" include-lines="7,10,12"}

3. `build.gradle.kts` 파일에 다음 설정과 함께 `appengine` 블록을 추가합니다.
   ```kotlin
   ```
   {src="snippets/google-appengine-standard/build.gradle.kts" include-lines="1,22-31"}

### 3단계: App Engine 설정 구성하기 {id="configure-app-engine-settings"}
[app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref) 파일에서 애플리케이션의 App Engine 설정을 구성합니다.
1. `src/main` 안에 `appengine` 디렉토리를 생성합니다.
2. 이 디렉토리 안에 `app.yaml` 파일을 생성하고 다음 내용을 추가합니다 (`google-appengine-standard`를 프로젝트 이름으로 대체하세요).
   ```yaml
   ```
   {src="snippets/google-appengine-standard/src/main/appengine/app.yaml"}
   
   `entrypoint` 옵션은 애플리케이션용으로 생성된 fat JAR를 실행하는 데 사용되는 명령어를 포함합니다.

   지원되는 구성 옵션에 대한 추가 문서는 [Google App Engine 문서](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)에서 찾을 수 있습니다.

## 애플리케이션 배포하기 {id="deploy-app"}

애플리케이션을 배포하려면 터미널을 열고 아래 단계를 따르세요.

1. 먼저 Google Cloud 프로젝트를 생성합니다. 이는 애플리케이션 리소스를 담는 최상위 컨테이너입니다. 예를 들어, 아래 명령어는 `ktor-sample-app-engine`이라는 이름으로 프로젝트를 생성합니다.
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. 클라우드 프로젝트용 App Engine 애플리케이션을 생성합니다.
   ```Bash
   gcloud app create
   ```

3. 애플리케이션을 배포하려면 `appengineDeploy` Gradle 태스크를 실행합니다...
   ```Bash
   ./gradlew appengineDeploy
   ```
   ... 그리고 Google Cloud가 애플리케이션을 빌드하고 게시할 때까지 기다립니다.
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > 빌드 중에 `Cloud Build has not been used in project` 오류가 발생하면, 오류 보고서의 지침을 사용하여 활성화하세요.
   >
   {type="note"}

완성된 예제는 여기에서 찾을 수 있습니다: [google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard).