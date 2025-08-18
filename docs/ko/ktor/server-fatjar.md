[//]: # (title: Ktor Gradle 플러그인을 사용하여 Fat JAR 생성하기)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>Ktor Gradle 플러그인을 사용하여 실행 가능한 Fat JAR를 생성하고 실행하는 방법을 알아봅니다.</link-summary>

[Ktor Gradle 플러그인](https://github.com/ktorio/ktor-build-plugins)을 사용하면 모든 코드 의존성(Fat JAR)을 포함하는 실행 가능한 JAR를 생성하고 실행할 수 있습니다.

## Ktor 플러그인 구성하기 {id="configure-plugin"}

Fat JAR를 빌드하려면 먼저 Ktor 플러그인을 구성해야 합니다:

1. `build.gradle.kts` 파일을 열고 `plugins` 블록에 플러그인을 추가합니다:
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.2.3"
   }
   ```

2. [주 애플리케이션 클래스](server-dependencies.topic#create-entry-point)가 구성되어 있는지 확인합니다:
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

3. 선택적으로, `ktor.fatJar` 확장(extension)을 사용하여 생성될 Fat JAR의 이름을 구성할 수 있습니다:
   ```kotlin
   ktor {
       fatJar {
           archiveFileName.set("fat.jar")
       }
   }
   ```

> Ktor Gradle 플러그인을 Kotlin Multiplatform Gradle 플러그인과 함께 적용하면 Fat JAR 생성 기능이 자동으로 비활성화됩니다.
> 두 플러그인을 함께 사용하려면:
> 1. 위에서 설명한 대로 Ktor Gradle 플러그인이 적용된 JVM 전용 프로젝트를 생성합니다.
> 2. 해당 JVM 전용 프로젝트에 Kotlin Multiplatform 프로젝트를 의존성으로 추가합니다.
> 
> 이 임시 해결책(workaround)이 문제를 해결하지 못한다면, [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464)에 댓글을 남겨 알려주세요.
>
{style="warning"}

## Fat JAR 빌드 및 실행 {id="build"}

Ktor 플러그인은 Fat JAR를 생성하고 실행하기 위한 다음 작업을 제공합니다:
- `buildFatJar`: 프로젝트와 런타임 의존성을 결합한 JAR를 빌드합니다. 이 빌드가 완료되면 `build/libs` 디렉터리에서 `***-all.jar` 파일을 볼 수 있습니다.
- `runFatJar`: 프로젝트의 Fat JAR를 빌드하고 실행합니다.

> ProGuard를 사용하여 생성된 JAR를 최소화하는 방법을 알아보려면, [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 예시를 참조하세요.