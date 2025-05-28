[//]: # (title: 애플리케이션 배포본 만들기)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[Ktor Gradle 플러그인](https://github.com/ktorio/ktor-build-plugins)은 Gradle [Application 플러그인](https://docs.gradle.org/current/userguide/application_plugin.html)을 자동으로 적용하며, 이 플러그인은 코드 종속성과 생성된 시작 스크립트를 포함하여 애플리케이션을 패키징할 수 있는 기능을 제공합니다. 이 토픽에서는 Ktor 애플리케이션을 패키징하고 실행하는 방법을 보여드리겠습니다.

## Ktor 플러그인 구성하기 {id="configure-plugin"}
애플리케이션 배포본을 생성하려면 먼저 Ktor 플러그인을 적용해야 합니다.
1. `build.gradle.kts` 파일을 열고 `plugins` 블록에 플러그인을 추가합니다:
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="4,7-8"}

2. [메인 애플리케이션 클래스](server-dependencies.topic#create-entry-point)가 구성되었는지 확인합니다:
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="10-12"}

## 애플리케이션 패키징하기 {id="package"}
Application 플러그인은 애플리케이션을 패키징하는 다양한 방법을 제공합니다. 예를 들어, `installDist` 태스크는 모든 런타임 종속성과 시작 스크립트와 함께 애플리케이션을 설치합니다. 전체 배포 아카이브를 생성하려면 `distZip` 및 `distTar` 태스크를 사용할 수 있습니다.

이 토픽에서는 `installDist`를 사용하겠습니다:
1. 터미널을 엽니다.
2. 운영 체제에 따라 다음 방법 중 하나로 `installDist` 태스크를 실행합니다:
   
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   <code-block>./gradlew installDist</code-block>
   </tab>
   <tab title="Windows" group-key="windows">
   <code-block>gradlew.bat installDist</code-block>
   </tab>
   </tabs>

   Application 플러그인은 `build/install/<project_name>` 폴더에 애플리케이션 이미지를 생성합니다. 

## 애플리케이션 실행하기 {id="run"}
[패키징된 애플리케이션](#package)을 실행하려면:
1. 터미널에서 `build/install/<project_name>/bin` 폴더로 이동합니다.
2. 운영 체제에 따라 `<project_name>` 또는 `<project_name>.bat` 실행 파일을 실행합니다. 예를 들어:

   <snippet id="run_executable">
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   <code-block>./ktor-sample</code-block>
   </tab>
   <tab title="Windows" group-key="windows">
   <code-block>ktor-sample.bat</code-block>
   </tab>
   </tabs>
   </snippet>
   
3. 다음 메시지가 표시될 때까지 기다립니다:
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
   브라우저에서 링크를 열어 실행 중인 애플리케이션을 확인합니다:

   <img src="ktor_idea_new_project_browser.png" alt="브라우저에서 Ktor 앱" width="430"/>