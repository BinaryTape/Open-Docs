[//]: # (title: Compose Multiplatform 앱 생성하기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 튜토리얼은 **공유 로직과 UI를 사용하는 Compose Multiplatform 앱 생성하기** 튜토리얼의 첫 번째 파트입니다.</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>Compose Multiplatform 앱 생성하기</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="Second step"/> 컴포저블 코드 탐색하기 <br/>
        <img src="icon-3-todo.svg" width="20" alt="Third step"/> 프로젝트 수정하기 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 나만의 애플리케이션 생성하기 <br/>
    </p>
</tldr>

여기서는 IntelliJ IDEA를 사용하여 첫 번째 Compose Multiplatform 애플리케이션을 생성하고 실행하는 방법을 배웁니다.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UI 프레임워크를 사용하면 Kotlin Multiplatform의 코드 공유 기능을 애플리케이션 로직을 넘어 확장할 수 있습니다. 사용자 인터페이스를 한 번 구현한 다음 Compose Multiplatform에서 지원하는 모든 플랫폼에 사용할 수 있습니다.

이 튜토리얼에서는 Android, iOS, 데스크톱, 웹에서 실행되는 샘플 애플리케이션을 빌드합니다. 사용자 인터페이스를 생성하기 위해 Compose Multiplatform 프레임워크를 사용하고, 컴포저블 함수, 테마, 레이아웃, 이벤트, 수정자(modifier) 등 기본 사항을 배웁니다.

이 튜토리얼에서 유의할 점:
*   Compose Multiplatform, Android 또는 iOS에 대한 이전 경험은 필요하지 않습니다. 시작하기 전에 [Kotlin의 기본](https://kotlinlang.org/docs/getting-started.html)을 숙지하는 것을 권장합니다.
*   이 튜토리얼을 완료하려면 IntelliJ IDEA만 있으면 됩니다. 이를 통해 Android 및 데스크톱에서 멀티플랫폼 개발을 시도할 수 있습니다. iOS의 경우 Xcode가 설치된 macOS 기기가 필요합니다. 이는 iOS 개발의 일반적인 제한 사항입니다.
*   원하는 경우 관심 있는 특정 플랫폼으로 선택을 제한하고 다른 플랫폼은 생략할 수 있습니다.

## 프로젝트 생성하기

1.  [퀵스타트](quickstart.md)에서 [Kotlin Multiplatform 개발 환경 설정](quickstart.md#set-up-the-environment) 지침을 완료하세요.
2.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3.  왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.

    > Kotlin Multiplatform IDE 플러그인을 사용하지 않는 경우, [KMP 웹 위자드](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true)를 사용하여 동일한 프로젝트를 생성할 수 있습니다.
    >
    {style="note"}

4.  **New Project** 창에서 다음 필드를 지정합니다:

    *   **Name**: ComposeDemo
    *   **Group**: compose.project
    *   **Artifact**: demo

    > 웹 위자드를 사용하는 경우, "ComposeDemo"를 **Project Name**으로, "compose.project.demo"를 **Project ID**로 지정합니다.
    >
    {style="note"}

5.  **Android**, **iOS**, **Desktop**, **Web** 타겟을 선택합니다.
    iOS에 대해 **Share UI** 옵션이 선택되어 있는지 확인합니다.
6.  모든 필드와 타겟을 지정했으면 **Create**를 클릭합니다 (웹 위자드에서는 **Download**).

   ![Create Compose Multiplatform project](create-compose-multiplatform-project.png){width=800}

## 프로젝트 구조 살펴보기

IntelliJ IDEA에서 "ComposeDemo" 폴더로 이동합니다.
위자드에서 iOS를 선택하지 않았다면, "ios" 또는 "apple"로 시작하는 폴더가 없을 것입니다.

> IntelliJ IDEA가 프로젝트의 Android Gradle 플러그인을 최신 버전으로 업그레이드하도록 자동으로 제안할 수 있습니다.
> Kotlin Multiplatform은 최신 AGP 버전과 호환되지 않으므로 업그레이드하지 않는 것을 권장합니다
> ([호환성 표](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility) 참조).
>
{style="note"}

프로젝트에는 두 개의 모듈이 포함되어 있습니다:

*   _composeApp_은 Android, 데스크톱, iOS, 웹 애플리케이션 간에 공유되는 로직(모든 플랫폼에 사용하는 코드)을 포함하는 Kotlin 모듈입니다. 빌드 프로세스를 자동화하는 데 도움이 되는 [Gradle](https://kotlinlang.org/docs/gradle.html)을 빌드 시스템으로 사용합니다.
*   _iosApp_은 iOS 애플리케이션으로 빌드되는 Xcode 프로젝트입니다. 공유 모듈에 의존하며 이를 iOS 프레임워크로 사용합니다.

  ![Compose Multiplatform project structure](compose-project-structure.png){width=350}

**composeApp** 모듈은 다음 소스 세트로 구성됩니다: `androidMain`, `commonMain`, `desktopMain`, `iosMain`, `wasmJsMain`.
_소스 세트_는 논리적으로 함께 그룹화된 파일들의 집합에 대한 Gradle 개념으로, 각 그룹은 자체 종속성을 가집니다. Kotlin Multiplatform에서 서로 다른 소스 세트는 다른 플랫폼을 타겟팅할 수 있습니다.

`commonMain` 소스 세트는 공통 Kotlin 코드를 사용하고, 플랫폼 소스 세트는 각 타겟에 특정한 Kotlin 코드를 사용합니다. `androidMain` 및 `desktopMain`에는 Kotlin/JVM이 사용됩니다. `iosMain`에는 Kotlin/Native가 사용됩니다. 반면 `wasmJsMain`에는 Kotlin/Wasm이 사용됩니다.

공유 모듈이 Android 라이브러리로 빌드될 때, 공통 Kotlin 코드는 Kotlin/JVM으로 처리됩니다. iOS 프레임워크로 빌드될 때, 공통 Kotlin 코드는 Kotlin/Native로 처리됩니다. 공유 모듈이 웹 앱으로 빌드될 때, 공통 Kotlin 코드는 Kotlin/Wasm으로 처리됩니다.

![Common Kotlin, Kotlin/JVM, and Kotlin/Native](module-structure.png){width=700}

일반적으로 플랫폼별 소스 세트에서 기능을 중복하는 대신, 가능하면 구현을 공통 코드로 작성하세요.

`composeApp/src/commonMain/kotlin` 디렉터리에서 `App.kt` 파일을 엽니다. 이 파일에는 최소한이지만 완전한 Compose Multiplatform UI를 구현하는 `App()` 함수가 포함되어 있습니다:

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="fun App()"}

지원되는 모든 플랫폼에서 애플리케이션을 실행해 봅시다.

## 애플리케이션 실행하기

애플리케이션을 Android, iOS, 데스크톱, 웹에서 실행할 수 있습니다. 특정 순서로 애플리케이션을 실행할 필요는 없으므로 가장 익숙한 플랫폼부터 시작하세요.

> Gradle 빌드 작업을 사용할 필요는 없습니다. 멀티플랫폼 애플리케이션에서는 모든 지원되는 타겟의 디버그 및 릴리스 버전을 빌드합니다. Multiplatform 위자드에서 선택한 플랫폼에 따라 시간이 걸릴 수 있습니다. 실행 구성(run configuration)을 사용하면 훨씬 빠릅니다. 이 경우 선택된 타겟만 빌드됩니다.
>
{style="tip"}

### Android에서 애플리케이션 실행하기

1.  실행 구성 목록에서 **composeApp**을 선택합니다.
2.  Android 가상 기기를 선택한 다음 **Run**을 클릭합니다: IDE가 선택된 가상 기기가 꺼져 있다면 시작하고, 앱을 실행합니다.

![Run the Compose Multiplatform app on Android](compose-run-android.png){width=350}

![First Compose Multiplatform app on Android](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 다른 Android 시뮬레이션 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

[Android Emulator를 구성하고 다른 시뮬레이션 기기에서 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/emulator#runningapp)을 알아보세요.

#### 실제 Android 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

[하드웨어 기기를 구성하고 연결하여 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/device)을 알아보세요.

</snippet>

### iOS에서 애플리케이션 실행하기

초기 설정의 일부로 Xcode를 실행하지 않았다면, iOS 앱을 실행하기 전에 Xcode를 실행하세요.

IntelliJ IDEA에서 실행 구성 목록에서 **iosApp**을 선택하고, 실행 구성 옆에 있는 시뮬레이션 기기를 선택한 후 **Run**을 클릭합니다.
목록에 사용 가능한 iOS 구성이 없다면, [새 실행 구성](#run-on-a-new-ios-simulated-device)을 추가하세요.

![Run the Compose Multiplatform app on iOS](compose-run-ios.png){width=350}

![First Compose Multiplatform app on iOS](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 새 iOS 시뮬레이션 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

시뮬레이션 기기에서 애플리케이션을 실행하려면 새 실행 구성을 추가할 수 있습니다.

1.  실행 구성 목록에서 **Edit Configurations**를 클릭합니다.

   ![Edit run configurations](ios-edit-configurations.png){width=450}

2.  구성 목록 위에 있는 **+** 버튼을 클릭한 다음 **Xcode Application**을 선택합니다.

   ![New run configuration for iOS application](ios-new-configuration.png)

3.  구성 이름을 지정합니다.
4.  **Working directory**를 선택합니다. 이를 위해 프로젝트(예: **KotlinMultiplatformSandbox**)의 `iosApp` 폴더로 이동합니다.

5.  새 시뮬레이션 기기에서 애플리케이션을 실행하려면 **Run**을 클릭합니다.

#### 실제 iOS 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

멀티플랫폼 애플리케이션을 실제 iOS 기기에서 실행할 수 있습니다. 시작하기 전에 [Apple ID](https://support.apple.com/en-us/HT204316)와 연결된 팀 ID를 설정해야 합니다.

##### 팀 ID 설정하기

프로젝트에 팀 ID를 설정하려면 IntelliJ IDEA의 KDoctor 도구를 사용하거나 Xcode에서 팀을 선택할 수 있습니다.

KDoctor 사용 시:

1.  IntelliJ IDEA에서 터미널에 다음 명령어를 실행합니다:

   ```none
   kdoctor --team-ids 
   ```

   KDoctor가 현재 시스템에 구성된 모든 팀 ID를 다음과 같이 나열합니다:

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2.  IntelliJ IDEA에서 `iosApp/Configuration/Config.xcconfig` 파일을 열고 팀 ID를 지정합니다.

또는 Xcode에서 팀 선택하기:

1.  Xcode로 이동하여 **Open a project or file**을 선택합니다.
2.  프로젝트의 `iosApp/iosApp.xcworkspace` 파일로 이동합니다.
3.  왼쪽 메뉴에서 `iosApp`을 선택합니다.
4.  **Signing & Capabilities**로 이동합니다.
5.  **Team** 목록에서 팀을 선택합니다.

   아직 팀을 설정하지 않았다면 **Team** 목록에서 **Add an Account** 옵션을 사용하고 Xcode 지침을 따르세요.

6.  번들 식별자(Bundle Identifier)가 고유하고 서명 인증서(Signing Certificate)가 성공적으로 할당되었는지 확인합니다.

##### 앱 실행하기

iPhone을 케이블로 연결합니다. 이미 Xcode에 기기가 등록되어 있다면, IntelliJ IDEA에서 실행 구성 목록에 해당 기기가 표시될 것입니다. 해당 `iosApp` 구성을 실행합니다.

아직 Xcode에 iPhone을 등록하지 않았다면, [Apple 권장 사항](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)을 따르세요.
간단히 말해, 다음을 수행해야 합니다:

1.  iPhone을 케이블로 연결합니다.
2.  iPhone에서 **Settings** | **Privacy & Security**에서 개발자 모드를 활성화합니다.
3.  Xcode에서 상단 메뉴로 이동하여 **Window** | **Devices and Simulators**를 선택합니다.
4.  더하기 기호를 클릭합니다. 연결된 iPhone을 선택하고 **Add**를 클릭합니다.
5.  Apple ID로 로그인하여 기기에서 개발 기능을 활성화합니다.
6.  화면의 지침에 따라 페어링 프로세스를 완료합니다.

Xcode에 iPhone을 등록했다면, IntelliJ IDEA에서 [새 실행 구성](#run-on-a-new-ios-simulated-device)을 생성하고 **Execution target** 목록에서 기기를 선택하세요. 해당 `iosApp` 구성을 실행합니다.

</snippet>

### 데스크톱에서 애플리케이션 실행하기

실행 구성 목록에서 **composeApp [desktop]**을 선택하고 **Run**을 클릭합니다. 기본적으로 실행 구성은 데스크톱 앱을 자체 OS 창에서 시작합니다:

![Run the Compose Multiplatform app on desktop](compose-run-desktop.png){width=350}

![First Compose Multiplatform app on desktop](first-compose-project-on-desktop-1.png){width=500}

### 웹 애플리케이션 실행하기

실행 구성 목록에서 **composeApp [wasmJs]**을 선택하고 **Run**을 클릭합니다.

![Run the Compose Multiplatform app on web](compose-run-web.png){width=350}

웹 애플리케이션이 브라우저에서 자동으로 열립니다. 또는 실행이 완료되면 브라우저에 다음 URL을 입력할 수 있습니다:

```shell
   http://localhost:8080/
```
> 8080 포트를 사용할 수 없을 수 있으므로 포트 번호가 다를 수 있습니다.
> 실제 포트 번호는 Gradle 빌드 콘솔에서 찾을 수 있습니다.
>
{style="tip"}

![Compose web application](first-compose-project-on-web.png){width=550}

## 다음 단계

튜토리얼의 다음 파트에서는 컴포저블 함수를 구현하고 각 플랫폼에서 애플리케이션을 실행하는 방법을 배웁니다.

**[다음 파트로 진행하기](compose-multiplatform-explore-composables.md)**

## 도움 받기

*   **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받아 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
*   **Kotlin 이슈 트래커**. [새로운 이슈 보고](https://youtrack.jetbrains.com/newIssue?project=KT).