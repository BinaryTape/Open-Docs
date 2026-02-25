[//]: # (title: Ktor Gradle 플러그인을 사용하여 fat JAR 만들기)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>Ktor Gradle 플러그인을 사용하여 실행 가능한 fat JAR를 생성하고 실행하는 방법에 대해 알아봅니다.</link-summary>

[Ktor Gradle 플러그인](https://github.com/ktorio/ktor-build-plugins)을 사용하면 모든 코드 의존성을 포함하는 실행 가능한 JAR(fat JAR)를 생성하고 실행할 수 있습니다.

## Ktor 플러그인 설정하기 {id="configure-plugin"}

fat JAR를 빌드하려면 먼저 Ktor 플러그인을 설정해야 합니다:

1. `build.gradle.kts` 파일을 열고 `plugins` 블록에 플러그인을 추가합니다:
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.4.0"
   }
   ```

2. [메인 애플리케이션 클래스](server-dependencies.topic#create-entry-point)가 설정되었는지 확인합니다:
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

3. 선택적으로, `ktor.fatJar` 확장을 사용하여 생성될 fat JAR의 이름을 설정할 수 있습니다:
   ```kotlin
   ktor {
       fatJar {
           archiveFileName.set("fat.jar")
       }
   }
   ```

> Ktor Gradle 플러그인을 Kotlin Multiplatform Gradle 플러그인과 함께 적용하면 fat JAR 생성 기능이 자동으로 비활성화됩니다.
> 이들을 함께 사용하려면 다음 단계를 따르세요:
> 1. 위에서 설명한 대로 Ktor Gradle 플러그인이 적용된 JVM 전용 프로젝트를 생성합니다.
> 2. 해당 JVM 전용 프로젝트에 Kotlin Multiplatform 프로젝트를 의존성으로 추가합니다.
> 
> 이 해결 방법으로 문제가 해결되지 않는 경우, [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464)에 의견을 남겨 저희에게 알려주세요.
>
{style="warning"}

## fat JAR 빌드 및 실행 {id="build"}

Ktor 플러그인은 fat JAR를 생성하고 실행하기 위해 다음 태스크(task)들을 제공합니다:
- `buildFatJar`: 프로젝트와 런타임 의존성이 결합된 JAR를 빌드합니다. 빌드가 완료되면 `build/libs` 디렉토리에 `***-all.jar` 파일이 생성된 것을 확인할 수 있습니다.
- `runFatJar`: 프로젝트의 fat JAR를 빌드하고 실행합니다.

> ProGuard를 사용하여 생성된 JAR의 크기를 최소화하는 방법을 알아보려면 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 샘플을 참고하세요.