[//]: # (title: Compose 핫 리로드)

<primary-label ref="beta"/>

[Compose 핫 리로드](https://github.com/JetBrains/compose-hot-reload)는 Compose Multiplatform 프로젝트에서 작업하는 동안 UI 변경 사항을 시각화하고 실험하는 데 도움을 줍니다.

Compose 핫 리로드는 현재 멀티플랫폼 프로젝트에 데스크톱 타겟이 포함되어 있고 Java 21 이하 버전과 호환되는 경우에만 사용할 수 있습니다.

JetBrains는 향후 다른 타겟에 대한 지원 추가를 검토 중입니다. 그 동안 데스크톱 앱을 샌드박스(sandbox)로 사용하면 작업 흐름을 방해하지 않고 공통 코드의 UI 변경 사항을 빠르게 실험할 수 있습니다.

![Compose 핫 리로드](compose-hot-reload.gif){width=350}

## 프로젝트에 Compose 핫 리로드 추가하기

Compose 핫 리로드는 다음 두 가지 방법으로 추가할 수 있습니다.

*   [IntelliJ IDEA 또는 Android Studio에서 프로젝트를 처음부터 생성](#from-scratch)
*   [기존 프로젝트에 Gradle 플러그인으로 추가](#to-an-existing-project)

### 처음부터

이 섹션에서는 IntelliJ IDEA 및 Android Studio에서 데스크톱 타겟이 있는 멀티플랫폼 프로젝트를 생성하는 단계를 안내합니다. 프로젝트가 생성되면 Compose 핫 리로드가 자동으로 추가됩니다.

1.  [빠른 시작](quickstart.md)에서 [Kotlin Multiplatform 개발 환경 설정](quickstart.md#set-up-the-environment) 지침을 완료합니다.
2.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3.  왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.
4.  **새 프로젝트** 창에서 **Name**, **Group**, **Artifact** 필드를 지정합니다.
5.  **Desktop** 타겟을 선택하고 **Create**를 클릭합니다.
    ![데스크톱 타겟으로 멀티플랫폼 프로젝트 생성](create-desktop-project.png){width=600 style="block"}

### 기존 프로젝트에 추가하기

이 섹션에서는 기존 멀티플랫폼 프로젝트에 Compose 핫 리로드를 추가하는 단계를 안내합니다. 이 단계는 [공유 로직 및 UI로 앱 생성](compose-multiplatform-create-first-app.md) 튜토리얼의 프로젝트를 참조합니다.

> Compose Multiplatform 1.10.0부터는 Compose 핫 리로드 플러그인이 데스크톱 타겟을 포함하는 프로젝트에 [번들로 제공](whats-new-compose-110.md#compose-hot-reload-integration)되고 기본적으로 활성화되므로 더 이상 별도로 구성할 필요가 없습니다. 하지만 특정 버전을 사용하기 위해 Compose 핫 리로드 플러그인을 명시적으로 선언할 수도 있습니다.
>
{style="note"}

1.  프로젝트에서 최신 버전의 Compose 핫 리로드(자세한 내용은 [Releases](https://github.com/JetBrains/compose-hot-reload/releases) 참조)로 버전 카탈로그(version catalog)를 업데이트합니다. `gradle/libs.versions.toml`에 다음 코드를 추가합니다.
    ```kotlin
    composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
    ```

    > 프로젝트 전체의 의존성을 중앙에서 관리하기 위해 버전 카탈로그를 사용하는 방법에 대해 더 알아보려면 [Gradle 모범 사례](https://kotlinlang.org/gradle-best-practices.html)를 참조하세요.

2.  상위 프로젝트의 `build.gradle.kts`(`ComposeDemo/build.gradle.kts`)에 다음 코드를 `plugins {}` 블록에 추가합니다.
    ```kotlin
    plugins {
        alias(libs.plugins.composeHotReload) apply false
    }
    ```
    이렇게 하면 Compose 핫 리로드 플러그인이 각 서브프로젝트에서 여러 번 로드되는 것을 방지합니다.

3.  멀티플랫폼 애플리케이션을 포함하는 서브프로젝트의 `build.gradle.kts`(`ComposeDemo/composeApp/build.gradle.kts`)에 다음 코드를 `plugins {}` 블록에 추가합니다.
    ```kotlin
    plugins { 
        alias(libs.plugins.composeHotReload)
    }
    ```

4.  Compose 핫 리로드의 모든 기능을 사용하려면 프로젝트가 향상된 클래스 재정의(redefinition)를 지원하는 OpenJDK 포크(fork)인 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)(JBR)에서 실행되어야 합니다.
    Compose 핫 리로드는 프로젝트에 호환 가능한 JBR을 자동으로 프로비저닝(provision)할 수 있습니다.

    > 최신 JetBrains Runtime은 Java 21만 지원합니다. Java 22 이상 버전에서만 호환되는 프로젝트에 Compose 핫 리로드를 추가하면 프로젝트 실행 시 링키지 오류가 발생합니다.
    >
    {style="warning"}

    자동 프로비저닝을 허용하려면 다음 Gradle 플러그인을 `settings.gradle.kts` 파일에 추가합니다.

    ```kotlin
    plugins {
        id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
    }
    ```

5.  **Gradle 변경 사항 동기화** 버튼을 클릭하여 Gradle 파일을 동기화합니다. ![Synchronize Gradle files](gradle-sync.png){width=50}

## Compose 핫 리로드 사용하기

1.  `jvmMain` 디렉터리에서 `main.kt` 파일을 열고 `main()` 함수를 업데이트합니다.
    ```kotlin
    fun main() = application {
        Window(
            onCloseRequest = ::exitApplication,
            alwaysOnTop = true,
            title = "composedemo",
        ) {
            App()
        }
    }
    ```
    `alwaysOnTop` 변수를 `true`로 설정하면 생성된 데스크톱 앱이 모든 창 위에 유지되어 코드를 더 쉽게 편집하고 변경 사항을 실시간으로 확인할 수 있습니다.

2.  `App.kt` 파일을 열고 `Button` 컴포저블(composable)을 업데이트합니다.
    ```kotlin
    Button(onClick = { showContent = !showContent }) {
        Column {
            Text(Greeting().greet())
        }
    }
    ```
    이제 버튼의 텍스트는 `greet()` 함수에 의해 제어됩니다.

3.  `Greeting.kt` 파일을 열고 `greet()` 함수를 업데이트합니다.
    ```kotlin
     fun greet(): String {
         return "Hello!"
     }
    ```

4.  `main.kt` 파일을 열고 거터(gutter)에 있는 **Run** 아이콘을 클릭합니다.
    **Run 'composeApp [hotRunJvm]' with Compose Hot Reload (Beta)**를 선택합니다.

    ![거터에서 Compose 핫 리로드 실행](compose-hot-reload-gutter-run.png){width=350}

    ![데스크톱 앱에서 첫 번째 Compose 핫 리로드](compose-hot-reload-hello.png){width=500}

5.  `greet()` 함수에서 반환되는 문자열을 업데이트한 다음, 모든 파일을 저장하여 (<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>) 데스크톱 앱이 자동으로 업데이트되는 것을 확인합니다.

    ![Compose 핫 리로드](compose-hot-reload.gif){width=350}

축하합니다! Compose 핫 리로드가 작동하는 것을 확인했습니다. 이제 변경할 때마다 데스크톱 실행 구성을 다시 시작할 필요 없이 텍스트, 이미지, 서식, UI 구조 등을 변경하면서 실험할 수 있습니다.

## 도움 받기

Compose 핫 리로드를 사용하는 동안 문제가 발생하면 [GitHub 이슈를 생성하여](https://github.com/JetBrains/compose-hot-reload/issues) 알려주십시오.