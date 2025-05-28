[//]: # (title: Ktor Gradle 플러그인을 사용하여 fat JAR 만들기)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>Ktor Gradle 플러그인을 사용하여 실행 가능한 fat JAR를 생성하고 실행하는 방법을 알아보세요.</link-summary>

[Ktor Gradle 플러그인](https://github.com/ktorio/ktor-build-plugins)을(를) 사용하면 모든 코드 종속성을 포함하는 실행 가능한 JAR(fat JAR)를 생성하고 실행할 수 있습니다.

## Ktor 플러그인 구성 {id="configure-plugin"}
fat JAR를 빌드하려면 먼저 Ktor 플러그인을 구성해야 합니다.
1. `build.gradle.kts` 파일을 열고 `plugins` 블록에 플러그인을 추가합니다.
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="4,7-8"}

2. [메인 애플리케이션 클래스](server-dependencies.topic#create-entry-point)가 구성되었는지 확인합니다.
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="10-12"}

3. 선택 사항으로, `ktor.fatJar` 확장 기능을 사용하여 생성될 fat JAR의 이름을 구성할 수 있습니다.
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28-31,53"}

## fat JAR 빌드 및 실행 {id="build"}

Ktor 플러그인은 fat JAR를 생성하고 실행하기 위한 다음 태스크를 제공합니다.
- `buildFatJar`: 프로젝트와 런타임 종속성을 결합한 JAR를 빌드합니다. 이 빌드가 완료되면 `build/libs` 디렉터리에서 `***-all.jar` 파일을 확인할 수 있습니다.
- `runFatJar`: 프로젝트의 fat JAR를 빌드하고 실행합니다.

> 생성된 JAR를 ProGuard를 사용하여 최소화하는 방법을 알아보려면 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 샘플을 참조하세요.