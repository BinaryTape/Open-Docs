[//]: # (title: Compose 핫 리로드)

<primary-label ref="alpha"/>

[Compose Hot Reload](https://github.com/JetBrains/compose-hot-reload)는 Compose Multiplatform 프로젝트 작업 중 UI 변경 사항을 시각화하고 실험하는 데 도움이 됩니다.

현재 Compose Hot Reload는 멀티플랫폼 프로젝트에 데스크톱 타겟을 포함할 때만 사용할 수 있습니다. 향후 다른 타겟에 대한 지원 추가를 모색하고 있습니다. 그 동안, 데스크톱 앱을 샌드박스(sandbox)로 사용하면 작업 흐름을 방해하지 않고 공통 코드의 UI 변경 사항을 빠르게 실험할 수 있습니다.

![Compose Hot Reload](compose-hot-reload.gif){width=500}

## 프로젝트에 Compose Hot Reload 추가

Compose Hot Reload는 다음 두 가지 방법으로 추가할 수 있습니다.

*   IntelliJ IDEA 또는 Android Studio에서 [새 프로젝트 생성](#from-scratch)
*   [기존 프로젝트에 Gradle 플러그인으로 추가](#to-an-existing-project)

### 새 프로젝트 생성

이 섹션에서는 IntelliJ IDEA 및 Android Studio에서 데스크톱 타겟을 포함하는 멀티플랫폼 프로젝트를 생성하는 단계를 안내합니다. 프로젝트가 생성되면 Compose Hot Reload가 자동으로 추가됩니다.

1.  [빠른 시작 가이드](quickstart.md)에서 [Kotlin Multiplatform 개발 환경 설정](quickstart.md#set-up-the-environment) 지침을 완료합니다.
2.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3.  왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.
4.  **New Project** 창에서 **Name**, **Group**, **Artifact** 필드를 지정합니다.
5.  **Desktop** 타겟을 선택하고 **Create**를 클릭합니다.
    ![Create multiplatform project with desktop target](create-desktop-project.png){width=700}

### 기존 프로젝트에 추가

이 섹션에서는 기존 멀티플랫폼 프로젝트에 Compose Hot Reload를 추가하는 단계를 안내합니다. 이 단계들은 [공유 로직 및 UI로 앱 생성](compose-multiplatform-create-first-app.md) 튜토리얼의 프로젝트를 참고합니다.

> Compose Hot Reload의 최신 버전을 찾으려면 [릴리스](https://github.com/JetBrains/compose-hot-reload/releases)를 참조하세요.
> 
{style="tip"}

1.  프로젝트에서 버전 카탈로그를 업데이트합니다. `gradle/libs.versions.toml`에 다음 코드를 추가합니다.
    ```kotlin
    composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
    ```

    > 프로젝트 전체에서 종속성을 중앙에서 관리하기 위한 버전 카탈로그 사용 방법에 대해 자세히 알아보려면 [Gradle 모범 사례](https://kotlinlang.org/gradle-best-practices.html)를 참조하세요.

2.  상위 프로젝트의 `build.gradle.kts` 파일(`ComposeDemo/build.gradle.kts`)에서 `plugins {}` 블록에 다음 코드를 추가합니다.
    ```kotlin
    plugins {
        alias(libs.plugins.composeHotReload) apply false
    }
    ```
    이렇게 하면 Compose Hot Reload 플러그인이 각 하위 프로젝트에서 여러 번 로드되는 것을 방지할 수 있습니다.

3.  멀티플랫폼 애플리케이션이 포함된 하위 프로젝트의 `build.gradle.kts` 파일(`ComposeDemo/composeApp/build.gradle.kts`)에서 `plugins {}` 블록에 다음 코드를 추가합니다.
    ```kotlin
    plugins { 
        alias(libs.plugins.composeHotReload)
    }
    ```

4.  Compose Hot Reload의 모든 기능을 사용하려면 프로젝트가 향상된 클래스 재정의를 지원하는 OpenJDK 포크인 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)(JBR)에서 실행되어야 합니다.
    Compose Hot Reload는 프로젝트를 위해 호환 가능한 JBR을 자동으로 프로비저닝할 수 있습니다.
    이를 허용하려면 `settings.gradle.kts` 파일에 다음 Gradle 플러그인을 추가하세요.

    ```kotlin
    plugins {
        id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
    }
    ```

5.  Gradle 파일을 동기화하려면 **Sync Gradle Changes** 버튼을 클릭합니다. ![Synchronize Gradle files](gradle-sync.png){width=50}

## Compose Hot Reload 사용

1.  `desktopMain` 디렉터리에서 `main.kt` 파일을 열고 `main()` 함수를 업데이트합니다.
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
    `alwaysOnTop` 변수를 `true`로 설정하면 생성된 데스크톱 앱이 다른 모든 창 위에 유지되어 코드를 편집하고 변경 사항을 실시간으로 확인하기가 더 쉬워집니다.

2.  `commonMain` 디렉터리에서 `App.kt` 파일을 열고 `Button` 컴포저블(composable)을 업데이트합니다.
    ```kotlin
    Button(onClick = { showContent = !showContent }) {
        Column {
            Text(Greeting().greet())
        }
    }
    ```
    이제 버튼의 텍스트는 `greet()` 함수에 의해 제어됩니다.

3.  `commonMain` 디렉터리에서 `Greeting.kt` 파일을 열고 `greet()` 함수를 업데이트합니다.
    ```kotlin
     fun greet(): String {
         return "Hello!"
     }
    ```

4.  `desktopMain` 디렉터리에서 `main.kt` 파일을 열고 거터(gutter)의 **Run** 아이콘을 클릭합니다. 
    **Run 'composeApp [desktop]' with Compose Hot Reload (Alpha)**를 선택합니다.

    ![Run Compose Hot Reload from gutter](compose-hot-reload-gutter-run.png){width=350}

    ![First Compose Hot Reload on desktop app](compose-hot-reload-hello.png){width=500}

5.  `greet()` 함수에서 반환되는 문자열을 업데이트한 다음 파일을 저장하여 데스크톱 앱이 자동으로 업데이트되는 것을 확인합니다.

    ![Compose Hot Reload](compose-hot-reload.gif){width=500}

축하합니다! Compose Hot Reload의 작동 방식을 확인하셨습니다. 이제 변경할 때마다 데스크톱 실행 구성을 다시 시작할 필요 없이 텍스트, 이미지, 서식, UI 구조 등을 변경하는 실험을 할 수 있습니다.

## 도움 받기

Compose Hot Reload 사용 중 문제가 발생하면 [GitHub 이슈를 생성](https://github.com/JetBrains/compose-hot-reload/issues)하여 알려주세요.