`[//]: # (title: Kotlin 멀티플랫폼 앱 만들기)`

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만 Android Studio에서도 따라할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 튜토리얼은 **공유 로직과 네이티브 UI를 사용하는 Kotlin 멀티플랫폼 앱 만들기** 가이드의 첫 번째 부분입니다.</p>
    <p><img src="icon-1.svg" width="20" alt="첫 번째 단계"/> **Kotlin 멀티플랫폼 앱 만들기**<br/>
       <img src="icon-2-todo.svg" width="20" alt="두 번째 단계"/> 사용자 인터페이스 업데이트<br/>
       <img src="icon-3-todo.svg" width="20" alt="세 번째 단계"/> 종속성 추가<br/>       
       <img src="icon-4-todo.svg" width="20" alt="네 번째 단계"/> 더 많은 로직 공유<br/>
       <img src="icon-5-todo.svg" width="20" alt="다섯 번째 단계"/> 프로젝트 마무리<br/>
    </p>
</tldr>

여기서는 IntelliJ IDEA를 사용하여 첫 번째 Kotlin 멀티플랫폼 애플리케이션을 생성하고 실행하는 방법을 배웁니다.

Kotlin Multiplatform 기술은 크로스 플랫폼 프로젝트 개발을 간소화합니다.
Kotlin Multiplatform 애플리케이션은 iOS, Android, macOS, Windows, Linux, 웹 등 다양한 플랫폼에서 작동할 수 있습니다.

Kotlin Multiplatform의 주요 사용 사례 중 하나는 모바일 플랫폼 간에 코드를 공유하는 것입니다.
iOS 및 Android 앱 간에 애플리케이션 로직을 공유하고, 네이티브 UI를 구현하거나 플랫폼 API와 작업해야 할 때만 플랫폼별 코드를 작성할 수 있습니다.

## 프로젝트 생성

1.  [빠른 시작](quickstart.md)에서 지침을 완료하여 [Kotlin Multiplatform 개발 환경을 설정하십시오](quickstart.md#set-up-the-environment).
2.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3.  왼쪽 패널에서 **Kotlin Multiplatform**를 선택합니다.
4.  **New Project** 창에서 다음 필드를 지정합니다.
    *   **이름**: GreetingKMP
    *   **그룹**: com.jetbrains.greeting
    *   **아티팩트**: greetingkmp
    
    ![Compose Multiplatform 프로젝트 생성](create-first-multiplatform-app.png){width=800}

5.  **Android** 및 **iOS** 대상을 선택합니다.
6.  iOS의 경우, UI를 네이티브로 유지하기 위해 **UI 공유 안 함** 옵션을 선택합니다.
7.  모든 필드와 대상을 지정했으면 **Create**를 클릭합니다.

> IntelliJ IDEA는 프로젝트의 Android Gradle 플러그인을 최신 버전으로 업그레이드하도록 자동으로 제안할 수 있습니다.
> Kotlin Multiplatform이 최신 AGP 버전과 호환되지 않으므로 업그레이드하는 것을 권장하지 않습니다
> ([호환성 표](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility) 참조).
>
{style="note"}

## 프로젝트 구조 살펴보기

IntelliJ IDEA에서 `GreetingKMP` 폴더를 확장합니다.

이 Kotlin Multiplatform 프로젝트에는 다음 세 가지 모듈이 포함됩니다.

*   _shared_는 Android 및 iOS 애플리케이션 모두에 공통되는 로직을 포함하는 Kotlin 모듈입니다. 즉, 플랫폼 간에 공유하는 코드입니다. 빌드 시스템으로 [Gradle](https://kotlinlang.org/docs/gradle.html)을 사용하여 빌드 프로세스를 자동화하는 데 도움이 됩니다.
*   _composeApp_은 Android 애플리케이션으로 빌드되는 Kotlin 모듈입니다. 빌드 시스템으로 Gradle을 사용합니다. `composeApp` 모듈은 `shared` 모듈에 의존하며 일반 Android 라이브러리로 사용합니다.
*   _iosApp_은 iOS 애플리케이션으로 빌드되는 Xcode 프로젝트입니다. shared 모듈에 의존하며 iOS 프레임워크로 사용합니다. shared 모듈은 일반 프레임워크 또는 [CocoaPods 종속성](multiplatform-cocoapods-overview.md)으로 사용될 수 있습니다. 기본적으로 IntelliJ IDEA에서 생성된 Kotlin Multiplatform 프로젝트는 일반 프레임워크 종속성을 사용합니다.

![기본 Multiplatform 프로젝트 구조](basic-project-structure.svg){width=700}

`shared` 모듈은 다음 세 가지 소스 세트로 구성됩니다: `androidMain`, `commonMain`, `iosMain`. _Source set_은 논리적으로 함께 그룹화된 여러 파일을 위한 Gradle 개념으로, 각 그룹에는 자체 종속성이 있습니다.
Kotlin Multiplatform에서 shared 모듈의 다른 소스 세트는 다른 플랫폼을 대상으로 할 수 있습니다.

common 소스 세트에는 공유 Kotlin 코드가 포함되어 있으며, 플랫폼 소스 세트는 각 대상에 특정한 Kotlin 코드를 사용합니다.
`androidMain`에는 Kotlin/JVM이 사용되고 `iosMain`에는 Kotlin/Native가 사용됩니다:

![소스 세트 및 모듈 구조](basic-project-structure-2.png){width=350}

`shared` 모듈이 Android 라이브러리로 빌드될 때 common Kotlin 코드는 Kotlin/JVM으로 처리됩니다.
iOS 프레임워크로 빌드될 때 common Kotlin은 Kotlin/Native로 처리됩니다:

![Common Kotlin, Kotlin/JVM, 그리고 Kotlin/Native](modules-structure.png)

### 공통 선언 작성

common 소스 세트에는 여러 대상 플랫폼에서 사용될 수 있는 공유 코드가 포함되어 있습니다. 이는 플랫폼에 독립적인 코드를 포함하도록 설계되었습니다. common 소스 세트에서 플랫폼별 API를 사용하려고 하면 IDE에서 경고가 표시됩니다:

1.  `shared/src/commonMain/.../Greeting.kt` 파일을 엽니다. 여기에는 자동으로 생성된 `Greeting` 클래스와 `greet()` 함수가 있습니다:

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2.  인사에 약간의 다양성을 추가합니다. 무작위화와 Kotlin 표준 라이브러리의 `reversed()` 호출을 사용하여 공유 코드를 업데이트하여 텍스트를 뒤집습니다:

    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            //
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord Guess what this is! > ${platform.name.reversed()}!"
        }
    }
    ```
3.  IDE의 제안에 따라 `kotlin.random.Random` 클래스를 임포트합니다.

common Kotlin으로만 코드를 작성하는 것은 플랫폼별 기능을 사용할 수 없으므로 명백한 한계가 있습니다. 인터페이스와 [expect/actual](multiplatform-connect-to-apis.md) 메커니즘을 사용하면 이 문제를 해결할 수 있습니다.

### 플랫폼별 구현 확인

common 소스 세트는 예상되는 선언(인터페이스, 클래스 등)을 정의할 수 있습니다.
그런 다음 각 플랫폼 소스 세트(이 경우 `androidMain` 및 `iosMain`)는 예상되는 선언에 대한 실제 플랫폼별 구현을 제공해야 합니다.

특정 플랫폼에 대한 코드를 생성하는 동안 Kotlin 컴파일러는 예상되는 선언과 실제 선언을 병합하고 실제 구현을 포함하는 단일 선언을 생성합니다.

1.  IntelliJ IDEA로 Kotlin Multiplatform 프로젝트를 생성하면 `commonMain` 모듈에 `Platform.kt` 파일 템플릿을 얻게 됩니다:

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

    이것은 플랫폼에 대한 정보를 담고 있는 공통 `Platform` 인터페이스입니다.

2.  `androidMain` 및 `iosMain` 모듈 간에 전환합니다. Android 및 iOS 소스 세트에 대해 동일한 기능의 다른 구현이 있는 것을 볼 수 있습니다:
    
    ```kotlin
    // Platform.android.kt in the androidMain module:
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain module:
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    *   `AndroidPlatform`의 `name` 프로퍼티 구현은 Android 고유의 코드, 즉 `android.os.Build` 종속성을 사용합니다. 이 코드는 Kotlin/JVM으로 작성되었습니다. 여기서 `java.util.Random`과 같은 JVM 고유 클래스에 접근하려고 하면 이 코드는 컴파일됩니다.
    *   `IOSPlatform`의 `name` 프로퍼티 구현은 iOS 고유의 코드, 즉 `platform.UIKit.UIDevice` 종속성을 사용합니다. 이것은 Kotlin/Native로 작성되었으며, 이는 Kotlin으로 iOS 코드를 작성할 수 있음을 의미합니다. 이 코드는 나중에 iOS 애플리케이션에서 Swift로 호출할 iOS 프레임워크의 일부가 됩니다.

3.  다른 소스 세트의 `getPlatform()` 함수를 확인하십시오. 예상되는 선언에는 본문이 없으며, 실제 구현은 플랫폼 코드에 제공됩니다:

    ```kotlin
    // Platform.kt in the commonMain source set
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // Platform.android.kt in the androidMain source set
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain source set
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

여기서 common 소스 세트는 예상되는 `getPlatform()` 함수를 정의하고 플랫폼 소스 세트에 Android 앱용 `AndroidPlatform()` 및 iOS 앱용 `IOSPlatform()` 실제 구현을 가집니다.

특정 플랫폼에 대한 코드를 생성하는 동안 Kotlin 컴파일러는 예상되는 선언과 실제 선언을 실제 구현을 포함하는 단일 `getPlatform()` 함수로 병합합니다.

이것이 예상되는 선언과 실제 선언이 동일한 패키지에 정의되어야 하는 이유입니다. 최종 플랫폼 코드에서 하나의 선언으로 병합되기 때문입니다. 생성된 플랫폼 코드에서 예상되는 `getPlatform()` 함수를 호출하면 올바른 실제 구현이 호출됩니다.

이제 앱을 실행하고 이 모든 것을 실제로 확인할 수 있습니다.

#### expect/actual 메커니즘 살펴보기 (선택 사항) {initial-collapse-state="collapsed" collapsible="true"}

템플릿 프로젝트는 함수에 expect/actual 메커니즘을 사용하지만, 프로퍼티 및 클래스와 같은 대부분의 Kotlin 선언에도 작동합니다. 예상되는 프로퍼티를 구현해 보겠습니다:

1.  `commonMain` 모듈에 있는 `Platform.kt` 파일을 열고 파일 끝에 다음을 추가합니다:

    ```kotlin
    expect val num: Int
    ```

    Kotlin 컴파일러는 이 프로퍼티에 해당하는 실제 선언이 플랫폼 모듈에 없다고 불평합니다.

2.  다음과 같이 즉시 구현을 제공해 보십시오:

    ```kotlin
    expect val num: Int = 42
    ```

    예상되는 선언에는 본문(이 경우 초기화 프로그램)이 없어야 한다는 오류가 발생합니다. 구현은 실제 플랫폼 모듈에 제공되어야 합니다. 초기화 프로그램을 제거합니다.
3.  `num` 프로퍼티 위로 마우스를 올리고 **Create missed actuals...**를 클릭합니다. `androidMain` 소스 세트를 선택합니다. 그런 다음 `androidMain/Platform.android.kt`에서 구현을 완료할 수 있습니다:

    ```kotlin
    actual val num: Int = 1
    ```

4.  이제 `iosMain` 모듈에 대한 구현을 제공합니다. `iosMain/Platform.ios.kt`에 다음을 추가합니다:

    ```kotlin
    actual val num: Int = 2
    ```

5.  `commonMain/Greeting.kt` 파일에서 `greet()` 함수에 `num` 프로퍼티를 추가하여 차이점을 확인합니다:

    ```kotlin
    fun greet(): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
   
        return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
    }
    ```

## 애플리케이션 실행

IntelliJ IDEA에서 [Android](#run-your-application-on-android) 또는 [iOS](#run-your-application-on-ios) 모두에 대해 멀티플랫폼 애플리케이션을 실행할 수 있습니다.

이전에 expect/actual 메커니즘을 살펴보았다면, Android 인사말에 "[1]"이, iOS 인사말에 "[2]"가 추가된 것을 볼 수 있습니다.

### Android에서 애플리케이션 실행

1.  실행 구성 목록에서 **composeApp**을 선택합니다.
2.  구성 목록 옆에 있는 Android 가상 기기를 선택하고 **Run**을 클릭합니다.

    목록에 기기가 없으면 [새 Android 가상 기기를 생성하십시오](https://developer.android.com/studio/run/managing-avds#createavd).

    ![Android에서 멀티플랫폼 앱 실행](compose-run-android.png){width=350}

    ![Android에서 첫 번째 모바일 멀티플랫폼 앱](first-multiplatform-project-on-android-1.png){width=300}

#### 다른 Android 시뮬레이션 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

[Android 에뮬레이터를 구성하고 다른 시뮬레이션 기기에서 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/emulator#runningapp)을 알아보십시오.

#### 실제 Android 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

[하드웨어 기기를 구성하고 연결하여 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/device)을 알아보십시오.

### iOS에서 애플리케이션 실행

초기 설정의 일부로 Xcode를 시작하지 않았다면, iOS 앱을 실행하기 전에 먼저 실행하십시오.

IntelliJ IDEA에서 실행 구성 목록에서 **iosApp**을 선택하고, 실행 구성 옆에 있는 시뮬레이션 기기를 선택한 다음, **Run**을 클릭합니다.

목록에 사용 가능한 iOS 구성이 없으면 [새 실행 구성을 추가하십시오](#run-on-a-new-ios-simulated-device).

![iOS에서 멀티플랫폼 앱 실행](compose-run-ios.png){width=350}

![iOS에서 첫 번째 모바일 멀티플랫폼 앱](first-multiplatform-project-on-ios-1.png){width=300}

#### 새 iOS 시뮬레이션 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

시뮬레이션 기기에서 애플리케이션을 실행하려면 새 실행 구성을 추가할 수 있습니다.

1.  실행 구성 목록에서 **Edit Configurations**를 클릭합니다.

    ![실행 구성 편집](ios-edit-configurations.png){width=450}

2.  구성 목록 위에 있는 **+** 버튼을 클릭한 다음 **Xcode Application**을 선택합니다.

    ![iOS 애플리케이션용 새 실행 구성](ios-new-configuration.png)

3.  구성에 이름을 지정합니다.
4.  **Working directory**를 선택합니다. 그러려면 `iosApp` 폴더에 있는 프로젝트(예: **KotlinMultiplatformSandbox**)로 이동합니다.

5.  **Run**을 클릭하여 새 시뮬레이션 기기에서 애플리케이션을 실행합니다.

#### 실제 iOS 기기에서 실행 {initial-collapse-state="collapsed" collapsible="true"}

실제 iOS 기기에서 멀티플랫폼 애플리케이션을 실행할 수 있습니다. 시작하기 전에, [Apple ID](https://support.apple.com/en-us/HT204316)와 연결된 Team ID를 설정해야 합니다.

##### Team ID 설정

프로젝트에서 Team ID를 설정하려면 IntelliJ IDEA에서 KDoctor 도구를 사용하거나 Xcode에서 팀을 선택할 수 있습니다.

KDoctor의 경우:

1.  IntelliJ IDEA에서 터미널에서 다음 명령어를 실행합니다:

    ```none
    kdoctor --team-ids 
    ```

    KDoctor는 현재 시스템에 구성된 모든 Team ID를 나열합니다. 예시:

    ```text
    3ABC246XYZ (Max Sample)
    ZABCW6SXYZ (SampleTech Inc.)
    ```

2.  IntelliJ IDEA에서 `iosApp/Configuration/Config.xcconfig` 파일을 열고 Team ID를 지정합니다.

다른 방법으로, Xcode에서 팀을 선택하십시오:

1.  Xcode로 이동하여 **Open a project or file**을 선택합니다.
2.  프로젝트의 `iosApp/iosApp.xcworkspace` 파일로 이동합니다.
3.  왼쪽 메뉴에서 `iosApp`을 선택합니다.
4.  **Signing & Capabilities**로 이동합니다.
5.  **Team** 목록에서 팀을 선택합니다.

    아직 팀을 설정하지 않았다면, **Team** 목록에서 **Add an Account** 옵션을 사용하고 Xcode 지침을 따르십시오.

6.  번들 식별자가 고유하고 서명 인증서가 성공적으로 할당되었는지 확인하십시오.

##### 앱 실행

케이블을 사용하여 iPhone을 연결합니다. Xcode에 기기가 이미 등록되어 있다면, IntelliJ IDEA는 해당 기기를 실행 구성 목록에 보여줄 것입니다. 해당 `iosApp` 구성을 실행합니다.

Xcode에 iPhone을 아직 등록하지 않았다면, [Apple 권장 사항](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)을 따르십시오. 간단히 말해, 다음을 수행해야 합니다:

1.  케이블을 사용하여 iPhone을 연결합니다.
2.  iPhone에서 **Settings** | **Privacy & Security**에서 개발자 모드를 활성화합니다.
3.  Xcode에서 상단 메뉴로 이동하여 **Window** | **Devices and Simulators**를 선택합니다.
4.  더하기 기호를 클릭합니다. 연결된 iPhone을 선택하고 **Add**를 클릭합니다.
5.  Apple ID로 로그인하여 기기에서 개발 기능을 활성화합니다.
6.  페어링 프로세스를 완료하려면 화면의 지침을 따릅니다.

Xcode에 iPhone을 등록한 후, IntelliJ IDEA에서 [새 실행 구성을 생성하고](#run-on-a-new-ios-simulated-device) **Execution target** 목록에서 기기를 선택합니다. 해당 `iosApp` 구성을 실행합니다.

## 다음 단계

튜토리얼의 다음 부분에서는 플랫폼별 라이브러리를 사용하여 UI 요소를 업데이트하는 방법을 배웁니다.

**[다음 부분으로 진행](multiplatform-update-ui.md)**

### 참고 항목

*   코드가 올바르게 작동하는지 확인하기 위해 [멀티플랫폼 테스트를 생성하고 실행하는 방법](multiplatform-run-tests.md)을 알아보십시오.
*   [프로젝트 구조](multiplatform-discover-project.md)에 대해 자세히 알아보십시오.
*   기존 Android 프로젝트를 크로스 플랫폼 앱으로 변환하려면 [Android 앱을 크로스 플랫폼으로 만드는 이 튜토리얼을 완료하십시오](multiplatform-integrate-in-existing-app.md).

## 도움 받기

*   **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하십시오.
*   **Kotlin 이슈 트래커**. [새 이슈를 보고하십시오](https://youtrack.jetbrains.com/newIssue?project=KT).