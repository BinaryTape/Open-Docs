[//]: # (title: Compose Multiplatform 앱 만들기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼에서는 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 문서는 <strong>공통 로직 및 UI를 포함한 Compose Multiplatform 앱 만들기</strong> 튜토리얼의 첫 번째 파트입니다.</p>
    <p><img src="icon-1.svg" width="20" alt="첫 번째 단계"/> <strong>Compose Multiplatform 앱 만들기</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="두 번째 단계"/> Composable 코드 살펴보기 <br/>
        <img src="icon-3-todo.svg" width="20" alt="세 번째 단계"/> 프로젝트 수정하기 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="네 번째 단계"/> 나만의 애플리케이션 만들기 <br/>
    </p>
</tldr>

여기서는 IntelliJ IDEA를 사용하여 첫 번째 Compose Multiplatform 애플리케이션을 만들고 실행하는 방법을 배웁니다.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UI 프레임워크를 사용하면 Kotlin Multiplatform의 코드 공유 기능을 애플리케이션 로직 너머로 확장할 수 있습니다. 사용자 인터페이스를 한 번만 구현하면 Compose Multiplatform이 지원하는 모든 플랫폼에서 사용할 수 있습니다.

이 튜토리얼에서는 Android, iOS, 데스크톱 및 웹에서 실행되는 샘플 애플리케이션을 제작합니다. 사용자 인터페이스를 만들기 위해 Compose Multiplatform 프레임워크를 사용하며, composable 함수, 테마, 레이아웃, 이벤트 및 modifier(수정자)와 같은 기본 사항을 배웁니다.

이 튜토리얼을 진행할 때 유의할 사항:
* Compose Multiplatform, Android 또는 iOS에 대한 사전 경험은 필요하지 않습니다. 시작하기 전에 [Kotlin의 기본 사항](https://kotlinlang.org/docs/getting-started.html)에 익숙해지는 것을 권장합니다.
* 이 튜토리얼을 완료하려면 IntelliJ IDEA만 있으면 됩니다. 이를 통해 Android 및 데스크톱용 멀티플랫폼 개발을 시도해 볼 수 있습니다. iOS의 경우 Xcode가 설치된 macOS 기기가 필요합니다. 이는 iOS 개발의 일반적인 제한 사항입니다.
* 원하는 경우 관심 있는 특정 플랫폼으로 선택을 제한하고 나머지는 생략할 수 있습니다.

## 프로젝트 생성

1. [빠른 시작](quickstart.md)에서 [Kotlin Multiplatform 개발 환경 설정](quickstart.md#set-up-the-environment) 안내를 완료하세요.
2. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3. 왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.

    > Kotlin Multiplatform IDE 플러그인을 사용하지 않는 경우, [KMP 웹 마법사](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true)를 사용하여 동일한 프로젝트를 생성할 수 있습니다.
    >
    {style="note"}

4. **New Project** 창에서 다음 필드를 지정합니다:

    * **Name**: ComposeDemo
    * **Group**: compose.project
    * **Artifact**: demo

    > 웹 마법사를 사용하는 경우 **Project Name**으로 "ComposeDemo"를, **Project ID**로 "compose.project.demo"를 지정하세요.
    >
    {style="note"}

5. **Android**, **iOS**, **Desktop**, **Web** 타겟을 선택합니다.
    iOS와 웹에 대해 **Share UI** 옵션이 선택되어 있는지 확인하세요.
6. 모든 필드와 타겟을 지정했다면 **Create**(웹 마법사에서는 **Download**)를 클릭합니다.

   ![Compose Multiplatform 프로젝트 생성](create-compose-multiplatform-project.png){width=800}

## 프로젝트 구조 살펴보기

IntelliJ IDEA에서 `ComposeDemo` 폴더로 이동합니다.
마법사에서 iOS를 선택하지 않았다면 "ios" 또는 "apple"로 시작하는 폴더가 없을 것입니다.

> IDE가 프로젝트의 Android Gradle 플러그인(AGP)을 최신 버전으로 업그레이드하도록 자동으로 제안할 수 있습니다. Kotlin Multiplatform은 최신 AGP 버전과 호환되지 않을 수 있으므로 업그레이드하지 않는 것을 권장합니다([호환성 표](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility) 참조).
>
{style="note"}

프로젝트에는 두 개의 모듈이 포함되어 있습니다:

* _composeApp_은 Android, 데스크톱, iOS 및 웹 애플리케이션 간에 공유되는 로직이 포함된 Kotlin 모듈로, 모든 플랫폼에서 사용하는 코드입니다. 빌드 프로세스 자동화를 돕는 빌드 시스템으로 [Gradle](https://kotlinlang.org/docs/gradle.html)을 사용합니다.
* _iosApp_은 iOS 애플리케이션으로 빌드되는 Xcode 프로젝트입니다. 공유 모듈에 의존하며 이를 iOS 프레임워크로 사용합니다.

  ![Compose Multiplatform 프로젝트 구조](compose-project-structure.png)

**composeApp** 모듈은 `androidMain`, `commonMain`, `iosMain`, `jsMain`, `jvmMain`, `wasmJsMain`, `webMain`(테스트를 포함하도록 선택한 경우 `commonTest` 포함) 소스 세트(source set)로 구성됩니다. _소스 세트_는 논리적으로 그룹화된 파일들에 대한 Gradle 개념으로, 각 그룹은 자체 의존성을 갖습니다. Kotlin Multiplatform에서 서로 다른 소스 세트는 서로 다른 플랫폼을 타겟팅할 수 있습니다.

`commonMain` 소스 세트는 공통 Kotlin 코드를 사용하고, 플랫폼 소스 세트는 각 타겟에 특화된 Kotlin 코드를 사용합니다: 

* `jvmMain`은 Kotlin/JVM을 사용하는 데스크톱용 소스 파일입니다.
* `androidMain` 또한 Kotlin/JVM을 사용합니다.
* `iosMain`은 Kotlin/Native를 사용합니다.
* `jsMain`은 Kotlin/JS를 사용합니다.
* `wasmJsMain`은 Kotlin/Wasm을 사용합니다.
* `webMain`은 `jsMain`과 `wasmJsMain`을 포함하는 웹 [중간 소스 세트(intermediate source set)](multiplatform-hierarchy.md#manual-configuration)입니다.

공유 모듈이 Android 라이브러리로 빌드될 때 공통 Kotlin 코드는 Kotlin/JVM으로 취급됩니다. iOS 프레임워크로 빌드될 때는 Kotlin/Native로 취급됩니다. 웹 앱으로 빌드될 때는 공통 Kotlin 코드가 Kotlin/Wasm 및 Kotlin/JS로 취급될 수 있습니다.

![공통 Kotlin, Kotlin/JVM 및 Kotlin/Native](module-structure.svg){width=700}

일반적으로 플랫폼별 소스 세트에서 기능을 중복해서 만들기보다는 가능한 한 공통 코드로 구현을 작성하세요.

`composeApp/src/commonMain/kotlin` 디렉토리에서 `App.kt` 파일을 엽니다. 여기에는 최소한의 기능이지만 완전한 Compose Multiplatform UI를 구현하는 `App()` 함수가 포함되어 있습니다:

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="fun App()"}

이제 지원되는 모든 플랫폼에서 애플리케이션을 실행해 보겠습니다.

## 애플리케이션 실행하기

Android, iOS, 데스크톱 및 웹에서 애플리케이션을 실행할 수 있습니다. 특정 순서대로 실행할 필요는 없으므로 가장 익숙한 플랫폼부터 시작하세요.

> Gradle build 태스크를 사용할 필요는 없습니다. 멀티플랫폼 애플리케이션에서 이는 지원되는 모든 타겟의 디버그 및 릴리스 버전을 빌드합니다. 마법사에서 선택한 플랫폼에 따라 시간이 다소 걸릴 수 있습니다. 실행 구성(run configuration)을 사용하는 것이 훨씬 빠르며, 이 경우 선택한 타겟만 빌드됩니다.
>
{style="tip"}

### Android에서 애플리케이션 실행하기

1. 실행 구성 목록에서 **composeApp**을 선택합니다.
2. Android 가상 기기를 선택한 다음 **Run**을 클릭합니다. 선택한 가상 기기가 꺼져 있으면 IDE가 이를 시작하고 앱을 실행합니다.

![Android에서 Compose Multiplatform 앱 실행](compose-run-android.png){width=350}

![Android에서의 첫 번째 Compose Multiplatform 앱](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 다른 Android 시뮬레이션 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

[Android 에뮬레이터를 구성하고 다른 시뮬레이션 기기에서 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/emulator#runningapp)을 알아보세요.

#### 실제 Android 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

[하드웨어 기기를 구성 및 연결하고 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/device)을 알아보세요.

</snippet>

### iOS에서 애플리케이션 실행하기

초기 설정 단계에서 Xcode를 실행하지 않았다면 iOS 앱을 실행하기 전에 실행하세요.

IntelliJ IDEA에서 실행 구성 목록의 **iosApp**을 선택하고, 실행 구성 옆에서 시뮬레이션 기기를 선택한 다음 **Run**을 클릭합니다.
목록에 사용 가능한 iOS 구성이 없다면 [새로운 실행 구성](#run-on-a-new-ios-simulated-device)을 추가하세요.

![iOS에서 Compose Multiplatform 앱 실행](compose-run-ios.png){width=350}

![iOS에서의 첫 번째 Compose Multiplatform 앱](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 새로운 iOS 시뮬레이션 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

시뮬레이션 기기에서 애플리케이션을 실행하려면 새로운 실행 구성을 추가할 수 있습니다.

1. 실행 구성 목록에서 **Edit Configurations**를 클릭합니다.

   ![실행 구성 편집](ios-edit-configurations.png){width=450}

2. 목록 위의 **+** 버튼을 클릭한 다음 **Xcode Application**을 선택합니다.

   ![iOS 애플리케이션용 새 실행 구성](ios-new-configuration.png)

3. 구성 이름을 지정합니다.
4. **Working directory**를 선택합니다. 이를 위해 프로젝트(예: **KotlinMultiplatformSandbox**) 내의 `iosApp` 폴더로 이동합니다.

5. **Run**을 클릭하여 새로운 시뮬레이션 기기에서 애플리케이션을 실행합니다.

#### 실제 iOS 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

실제 iOS 기기에서 멀티플랫폼 애플리케이션을 실행할 수 있습니다. 시작하기 전에 [Apple ID](https://support.apple.com/en-us/HT204316)와 연결된 Team ID를 설정해야 합니다.

##### Team ID 설정하기

프로젝트에서 Team ID를 설정하려면 IntelliJ IDEA에서 KDoctor 도구를 사용하거나 Xcode에서 팀을 선택할 수 있습니다.

KDoctor 사용 시:

1. IntelliJ IDEA의 터미널에서 다음 명령을 실행합니다:

   ```none
   kdoctor --team-ids 
   ```

   KDoctor가 시스템에 현재 구성된 모든 Team ID를 나열합니다. 예:

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. IntelliJ IDEA에서 `iosApp/Configuration/Config.xcconfig`를 열고 Team ID를 지정합니다.

또는 Xcode에서 팀을 선택합니다:

1. Xcode로 이동하여 **Open a project or file**을 선택합니다.
2. 프로젝트의 `iosApp/iosApp.xcworkspace` 파일로 이동합니다.
3. 왼쪽 메뉴에서 `iosApp`을 선택합니다.
4. **Signing & Capabilities**로 이동합니다.
5. **Team** 목록에서 본인의 팀을 선택합니다.

   아직 팀을 설정하지 않았다면 **Team** 목록에서 **Add an Account** 옵션을 사용하여 Xcode의 안내를 따르세요.

6. Bundle Identifier가 고유하고 Signing Certificate가 성공적으로 할당되었는지 확인합니다.

##### 앱 실행하기

iPhone을 케이블로 연결합니다. 이미 Xcode에 기기가 등록되어 있다면 IntelliJ IDEA의 실행 구성 목록에 해당 기기가 표시됩니다. 해당 `iosApp` 구성을 실행합니다.

아직 iPhone을 Xcode에 등록하지 않았다면 [Apple 권장 사항](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)을 따르세요. 요약하자면 다음과 같습니다:

1. iPhone을 케이블로 연결합니다.
2. iPhone의 **설정** | **개인정보 보호 및 보안**에서 개발자 모드를 활성화합니다.
3. Xcode의 상단 메뉴에서 **Window** | **Devices and Simulators**를 선택합니다.
4. 플러스(+) 기호를 클릭합니다. 연결된 iPhone을 선택하고 **Add**를 클릭합니다.
5. Apple ID로 로그인하여 기기에서 개발 기능을 활성화합니다.
6. 화면의 지시에 따라 페어링 프로세스를 완료합니다.

Xcode에 iPhone을 등록했다면 IntelliJ IDEA에서 [새로운 실행 구성](#run-on-a-new-ios-simulated-device)을 만들고 **Execution target** 목록에서 기기를 선택합니다. 해당 `iosApp` 구성을 실행합니다.

</snippet>

### 데스크톱에서 애플리케이션 실행하기

실행 구성 목록에서 **composeApp [desktop]**을 선택하고 **Run**을 클릭합니다. 기본적으로 실행 구성은 자체 OS 창에서 데스크톱 앱을 시작합니다:

![데스크톱에서 Compose Multiplatform 앱 실행](compose-run-desktop.png){width=350}

![데스크톱에서의 첫 번째 Compose Multiplatform 앱](first-compose-project-on-desktop-1.png){width=500}

### 웹 애플리케이션 실행하기

1. 실행 구성 목록에서 다음 중 하나를 선택합니다:

   * **composeApp[js]**: Kotlin/JS 애플리케이션을 실행합니다.
   * **composeApp[wasmJs]**: Kotlin/Wasm 애플리케이션을 실행합니다.

   ![웹에서 Compose Multiplatform 앱 실행](web-run-configuration.png){width=400}

2. **Run**을 클릭합니다.

웹 애플리케이션이 브라우저에서 자동으로 열립니다. 
또는 실행이 완료된 후 브라우저에 다음 URL을 입력할 수 있습니다:

```shell
   http://localhost:8080/
```
> 8080 포트를 사용할 수 없는 경우 포트 번호가 달라질 수 있습니다.
> 실제 포트 번호는 Gradle 빌드 콘솔에서 확인할 수 있습니다.
>
{style="tip"}

![Compose 웹 애플리케이션](first-compose-project-on-web.png){width=600}

#### 웹 타겟을 위한 호환 모드

웹 애플리케이션에 호환 모드를 활성화하여 모든 브라우저에서 즉시 작동하도록 할 수 있습니다. 이 모드에서 최신 브라우저는 Wasm 버전을 사용하고, 오래된 브라우저는 JS 버전으로 폴백(fall back)합니다. 이 모드는 `js` 및 `wasmJs` 타겟 모두에 대한 교차 컴파일을 통해 구현됩니다.

웹 애플리케이션에 호환 모드를 활성화하려면 다음을 수행하세요:

1. **View | Tool Windows | Gradle**을 선택하여 Gradle 도구 창을 엽니다.
2. **composedemo | Tasks | compose**에서 **composeCompatibilityBrowserDistribution** 태스크를 선택하고 실행합니다.

   > 태스크를 성공적으로 로드하려면 Gradle JVM으로 적어도 Java 11 이상이 필요하며, 일반적인 Compose Multiplatform 프로젝트에는 JetBrains Runtime 17 이상을 권장합니다.
   >
   {style="note"}

   ![호환성 태스크 실행](web-compatibility-gradle-task.png){width=500}

   또는 `ComposeDemo` 루트 디렉토리의 터미널에서 다음 명령을 실행할 수 있습니다:

    ```bash
    ./gradlew composeCompatibilityBrowserDistribution
    ```

Gradle 태스크가 완료되면, 호환 가능한 아티팩트가 `composeApp/build/dist/composeWebCompatibility/productionExecutable` 디렉토리에 생성됩니다. 이 아티팩트들을 사용하여 `js` 및 `wasmJs` 타겟 모두에서 작동하도록 [애플리케이션을 게시](https://kotlinlang.org/docs/wasm-get-started.html#publish-the-application)할 수 있습니다.

## 다음 단계

튜토리얼의 다음 파트에서는 composable 함수를 구현하고 각 플랫폼에서 애플리케이션을 실행하는 방법을 배웁니다.

**[다음 파트로 진행하기](compose-multiplatform-explore-composables.md)**

## 도움받기

* **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* **Kotlin 이슈 트래커**. [새로운 이슈를 보고](https://youtrack.jetbrains.com/newIssue?project=KT)하세요.