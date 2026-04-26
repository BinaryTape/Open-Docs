[//]: # (title: Google App Engine)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>시작 프로젝트</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>최종 프로젝트</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/google-appengine-standard">google-appengine-standard</a>
</p>
</tldr>

<web-summary>
이 튜토리얼에서는 Ktor 프로젝트를 Google App Engine 표준 환경(standard environment)에 준비하고 배포하는 방법을 보여줍니다.
</web-summary>

<link-summary>
프로젝트를 Google App Engine 표준 환경에 배포하는 방법을 알아보세요.
</link-summary>

이 튜토리얼에서는 Ktor 프로젝트를 Google App Engine 표준 환경(standard environment)에 준비하고 배포하는 방법을 보여줍니다. 이 튜토리얼은 [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 샘플 프로젝트를 시작 프로젝트로 사용합니다.

## 사전 준비 사항 {id="prerequisites"}
이 튜토리얼을 시작하기 전에 아래 단계를 수행해야 합니다:
* [Google Cloud Platform](https://console.cloud.google.com/)에 가입합니다.
* [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)를 설치하고 초기화합니다.
* 다음 명령어를 사용하여 Java용 App Engine 확장을 설치합니다:
   ```Bash
   gcloud components install app-engine-java
   ```

## 샘플 애플리케이션 클론하기 {id="clone"}
샘플 애플리케이션을 열려면 아래 단계를 따르세요:
1. Ktor 문서 저장소를 클론하고 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets) 프로젝트를 엽니다.
2. [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 모듈을 엽니다.
   > Ktor는 [서버를 생성하고 구성](server-create-and-configure.topic)하는 두 가지 방법(코드에서 생성하거나 설정 파일을 사용)을 제공합니다. 이 튜토리얼에서 배포 프로세스는 두 방식 모두 동일합니다.

## 애플리케이션 준비하기 {id="prepare-app"}
### 1단계: Shadow 플러그인 적용하기 {id="configure-shadow-plugin"}
이 튜토리얼에서는 [fat JAR](server-fatjar.md)를 사용하여 애플리케이션을 Google App Engine에 배포하는 방법을 보여줍니다. fat JAR를 생성하려면 Shadow 플러그인을 적용해야 합니다. `build.gradle.kts` 파일을 열고 `plugins` 블록에 플러그인을 추가하세요:
```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.10"
}
```

### 2단계: App Engine 플러그인 설정하기 {id="configure-app-engine-plugin"}
[Google App Engine Gradle 플러그인](https://github.com/GoogleCloudPlatform/app-gradle-plugin)은 Google App Engine 애플리케이션을 빌드하고 배포하는 태스크를 제공합니다. 이 플러그인을 사용하려면 다음 단계를 따르세요:

1. `settings.gradle.kts` 파일을 열고 Central Maven 저장소에서 플러그인을 참조하도록 다음 코드를 삽입합니다:
   ```kotlin
   pluginManagement {
       repositories {
           gradlePluginPortal()
           mavenCentral()
           maven("https://redirector.kotlinlang.org/maven/ktor-eap")
       }
       resolutionStrategy {
           eachPlugin {
               if (requested.id.id.startsWith("com.google.cloud.tools.appengine")) {
                   useModule("com.google.cloud.tools:appengine-gradle-plugin:${requested.version}")
               }
           }
       }
   }
   ```

2. `build.gradle.kts`를 열고 `plugins` 블록에 플러그인을 적용합니다:
   ```kotlin
   plugins {
       id("com.google.cloud.tools.appengine") version "2.8.0"
   }
   ```

3. `build.gradle.kts` 파일에 다음 설정이 포함된 `appengine` 블록을 추가합니다:
   ```kotlin
   import com.google.cloud.tools.gradle.appengine.appyaml.AppEngineAppYamlExtension
   
   configure<AppEngineAppYamlExtension> {
       stage {
           setArtifact("build/libs/${project.name}-all.jar")
       }
       deploy {
           version = "GCLOUD_CONFIG"
           projectId = "GCLOUD_CONFIG"
       }
   }
   ```

### 3단계: App Engine 설정 구성하기 {id="configure-app-engine-settings"}
애플리케이션의 App Engine 설정은 [app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref) 파일에서 구성합니다:
1. `src/main` 내부에 `appengine` 디렉토리를 생성합니다.
2. 이 디렉토리 내에 `app.yaml` 파일을 생성하고 다음 내용을 추가합니다(`google-appengine-standard`를 프로젝트 이름으로 바꾸세요):
   ```yaml
   runtime: java21
   entrypoint: 'java -jar google-appengine-standard-all.jar'
   
   ```
   
   `entrypoint` 옵션은 애플리케이션용으로 생성된 fat JAR를 실행하는 데 사용되는 명령어를 포함합니다.

   지원되는 구성 옵션에 대한 자세한 문서는 [Google App Engine 문서](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java)에서 확인할 수 있습니다.

## 애플리케이션 배포하기 {id="deploy-app"}

애플리케이션을 배포하려면 터미널을 열고 다음 단계를 따르세요:

1. 먼저 애플리케이션 리소스를 담는 최상위 컨테이너인 Google Cloud 프로젝트를 생성합니다. 예를 들어, 아래 명령어는 `ktor-sample-app-engine`이라는 이름으로 프로젝트를 생성합니다:
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. Cloud 프로젝트를 위한 App Engine 애플리케이션을 생성합니다:
   ```Bash
   gcloud app create
   ```

3. 애플리케이션을 배포하려면 `appengineDeploy` Gradle 태스크를 실행합니다...
   ```Bash
   ./gradlew appengineDeploy
   ```
   ... 그리고 Google Cloud가 애플리케이션을 빌드하고 게시할 때까지 기다립니다:
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > 빌드 중에 `Cloud Build has not been used in project` 오류가 발생하면 오류 보고서의 지침에 따라 이를 활성화하세요.
   >
   {type="note"}

완성된 예제는 여기에서 확인할 수 있습니다: [google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/google-appengine-standard).