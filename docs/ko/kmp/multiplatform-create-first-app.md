[//]: # (title: Kotlin Multiplatform 앱 만들기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 핵심 기능과 Kotlin Multiplatform 지원을 동일하게 공유합니다.</p>
    <br/>
    <p>이 문서는 <strong>공통 로직과 네이티브 UI를 사용하는 Kotlin Multiplatform 앱 만들기</strong> 튜토리얼의 첫 번째 부분입니다.</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>Kotlin Multiplatform 앱 만들기</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> 사용자 인터페이스 업데이트<br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 의존성 추가<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 더 많은 로직 공유하기<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 프로젝트 마무리<br/>
    </p>
</tldr>

이곳에서는 IntelliJ IDEA를 사용하여 첫 번째 Kotlin Multiplatform 애플리케이션을 만들고 실행하는 방법을 배웁니다.

Kotlin Multiplatform 기술은 크로스 플랫폼 프로젝트 개발을 단순화합니다.
Kotlin Multiplatform 애플리케이션은 iOS, Android, macOS, Windows, Linux, 웹 등 다양한 플랫폼에서 작동할 수 있습니다.

Kotlin Multiplatform의 주요 사용 사례 중 하나는 모바일 플랫폼 간의 코드 공유입니다.
iOS와 Android 앱 간에 애플리케이션 로직을 공유하고, 네이티브 UI를 구현하거나 플랫폼 API를 사용해야 할 때만 플랫폼 전용 코드를 작성할 수 있습니다.

## 프로젝트 생성하기

1. [빠른 시작(quickstart)](quickstart.md)에서 [Kotlin Multiplatform 개발을 위한 환경 설정](quickstart.md#set-up-the-environment) 안내를 완료하세요.
2. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3. 왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.
4. **New Project** 창에서 다음 필드들을 지정합니다:
   * **Name**: GreetingKMP
   * **Group**: com.jetbrains.greeting
   * **Artifact**: greetingkmp
   
   ![Compose Multiplatform 프로젝트 생성](create-first-multiplatform-app.png){width=800}

5. **Android**와 **iOS** 타겟(targets)을 선택합니다.
6. iOS의 경우, UI를 네이티브로 유지하기 위해 **Do not share UI** 옵션을 선택합니다.
7. 모든 필드와 타겟을 지정했다면 **Create**를 클릭합니다.

> IDE에서 프로젝트의 Android Gradle 플러그인(AGP)을 최신 버전으로 업그레이드하도록 자동으로 제안할 수 있습니다.
> Kotlin Multiplatform은 최신 AGP 버전과 호환되지 않을 수 있으므로 업그레이드하지 않는 것을 권장합니다
> ([호환성 표](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility) 참조).
>
{style="note"}

## 프로젝트 구조 살펴보기

IntelliJ IDEA에서 `GreetingKMP` 폴더를 확장합니다.

이 Kotlin Multiplatform 프로젝트는 세 개의 모듈을 포함합니다:

* _shared_는 Android와 iOS 애플리케이션 모두에 공통적인 로직을 포함하는 Kotlin 모듈입니다. 즉, 플랫폼 간에 공유하는 코드입니다. 빌드 프로세스 자동화를 돕기 위해 [Gradle](https://kotlinlang.org/docs/gradle.html)을 빌드 시스템으로 사용합니다.
* _composeApp_은 Android 애플리케이션으로 빌드되는 Kotlin 모듈입니다. Gradle을 빌드 시스템으로 사용합니다. composeApp 모듈은 shared 모듈에 의존하며, 이를 일반적인 Android 라이브러리처럼 사용합니다.
* _iosApp_은 iOS 애플리케이션으로 빌드되는 Xcode 프로젝트입니다. shared 모듈에 의존하며 이를 iOS 프레임워크(framework)로 사용합니다. shared 모듈은 일반 프레임워크 또는 [CocoaPods 의존성](multiplatform-cocoapods-overview.md)으로 사용될 수 있습니다. 기본적으로 IntelliJ IDEA에서 생성된 Kotlin Multiplatform 프로젝트는 일반 프레임워크 의존성을 사용합니다.

![기본 Multiplatform 프로젝트 구조](basic-project-structure.svg){width=700}

shared 모듈은 세 개의 소스 세트(source sets)인 `androidMain`, `commonMain`, `iosMain`으로 구성됩니다. _소스 세트_는 논리적으로 함께 그룹화된 파일들에 대한 Gradle 개념으로, 각 그룹은 자체 의존성을 가집니다. Kotlin Multiplatform에서 shared 모듈의 서로 다른 소스 세트는 서로 다른 플랫폼을 타겟팅할 수 있습니다.

common 소스 세트는 공유 Kotlin 코드를 포함하며, 플랫폼 소스 세트는 각 타겟에 특정한 Kotlin 코드를 사용합니다. `androidMain`에는 Kotlin/JVM이 사용되고 `iosMain`에는 Kotlin/Native가 사용됩니다.

![소스 세트 및 모듈 구조](basic-project-structure-2.png){width=350}

shared 모듈이 Android 라이브러리로 빌드될 때 common Kotlin 코드는 Kotlin/JVM으로 처리됩니다. iOS 프레임워크로 빌드될 때는 common Kotlin 코드가 Kotlin/Native로 처리됩니다.

![Common Kotlin, Kotlin/JVM, Kotlin/Native](modules-structure.png)

### 공통 선언 작성하기

common 소스 세트는 여러 대상 플랫폼에서 사용할 수 있는 공유 코드를 포함합니다. 플랫폼에 독립적인 코드를 포함하도록 설계되었습니다. common 소스 세트에서 플랫폼 전용 API를 사용하려고 하면 IDE에서 경고를 표시합니다.

1. `shared/src/commonMain/.../Greeting.kt` 파일을 엽니다. 이곳에서 자동으로 생성된 `Greeting` 클래스와 `greet()` 함수를 찾을 수 있습니다.

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 인사에 약간의 변화를 주어 보겠습니다. 무작위성(randomization)과 텍스트를 뒤집는 Kotlin 표준 라이브러리의 `reversed()` 호출을 사용하여 공유 코드를 업데이트합니다.

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
3. IDE의 제안에 따라 `kotlin.random.Random` 클래스를 임포트(import)합니다.

common Kotlin에서만 코드를 작성하는 것은 플랫폼 전용 기능을 사용할 수 없다는 명백한 한계가 있습니다. 인터페이스와 [expect/actual](multiplatform-connect-to-apis.md) 메커니즘을 사용하면 이 문제를 해결할 수 있습니다.

### 플랫폼별 구현 확인하기

common 소스 세트는 기대 선언(expected declarations, 인터페이스, 클래스 등)을 정의할 수 있습니다. 그러면 `androidMain` 및 `iosMain`과 같은 각 플랫폼 소스 세트는 기대 선언에 대한 실제 플랫폼 전용 구현(actual platform-specific implementations)을 제공해야 합니다.

특정 플랫폼을 위한 코드를 생성할 때, Kotlin 컴파일러는 기대 선언과 실제 선언을 병합하여 실제 구현이 포함된 단일 선언을 생성합니다.

1. IntelliJ IDEA로 Kotlin Multiplatform 프로젝트를 생성하면, `commonMain` 모듈에 `Platform.kt` 파일이 포함된 템플릿을 얻게 됩니다.

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   이는 플랫폼에 대한 정보를 담고 있는 공통 `Platform` 인터페이스입니다.

2. `androidMain` 모듈과 `iosMain` 모듈 사이를 전환해 보세요. Android와 iOS 소스 세트에 대해 동일한 기능이 서로 다르게 구현되어 있는 것을 볼 수 있습니다.
    
    ```kotlin
    // androidMain 모듈의 Platform.android.kt:
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // iosMain 모듈의 Platform.ios.kt:
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * `AndroidPlatform`의 `name` 프로퍼티 구현은 Android 전용 코드인 `android.os.Build` 의존성을 사용합니다. 이 코드는 Kotlin/JVM으로 작성되었습니다. 여기서 `java.util.Random`과 같은 JVM 전용 클래스에 접근하려고 하면 정상적으로 컴파일됩니다.
    * `IOSPlatform`의 `name` 프로퍼티 구현은 iOS 전용 코드인 `platform.UIKit.UIDevice` 의존성을 사용합니다. 이는 Kotlin/Native로 작성되었으며, 즉 Kotlin으로 iOS 코드를 작성할 수 있음을 의미합니다. 이 코드는 iOS 프레임워크의 일부가 되며, 나중에 iOS 애플리케이션의 Swift에서 호출하게 됩니다.

3. 서로 다른 소스 세트에 있는 `getPlatform()` 함수를 확인해 보세요. 기대 선언에는 본문(body)이 없으며, 실제 구현은 플랫폼 코드에서 제공됩니다.

    ```kotlin
    // commonMain 소스 세트의 Platform.kt
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // androidMain 소스 세트의 Platform.android.kt
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // iosMain 소스 세트의 Platform.ios.kt
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

여기서 common 소스 세트는 기대되는 `getPlatform()` 함수를 정의하고, 플랫폼 소스 세트인 Android 앱에는 `AndroidPlatform()`, iOS 앱에는 `IOSPlatform()`이라는 실제 구현을 가집니다.

특정 플랫폼을 위한 코드를 생성하는 동안 Kotlin 컴파일러는 기대 선언과 실제 선언을 실제 구현이 포함된 단일 `getPlatform()` 함수로 병합합니다.

그렇기 때문에 기대 선언과 실제 선언은 동일한 패키지에 정의되어야 합니다. 이들은 결과 플랫폼 코드에서 하나의 선언으로 병합되기 때문입니다. 생성된 플랫폼 코드에서 기대되는 `getPlatform()` 함수를 호출하면 올바른 실제 구현이 호출됩니다.

이제 앱을 실행하여 이 모든 것이 어떻게 작동하는지 확인할 수 있습니다.

#### expect/actual 메커니즘 탐색하기 (선택 사항) {initial-collapse-state="collapsed" collapsible="true"}

템플릿 프로젝트는 함수에 expect/actual 메커니즘을 사용하지만, 프로퍼티나 클래스와 같은 대부분의 Kotlin 선언에도 작동합니다. 기대 프로퍼티(expected property)를 구현해 보겠습니다.

1. `commonMain` 모듈의 `Platform.kt`를 열고 파일 끝에 다음을 추가합니다.

   ```kotlin
   expect val num: Int
   ```

   Kotlin 컴파일러는 플랫폼 모듈에 이 프로퍼티에 대응하는 실제 선언이 없다고 불평할 것입니다.

2. 다음과 같이 바로 구현을 제공해 보세요.

   ```kotlin
   expect val num: Int = 42
   ```

   기대 선언은 본문(이 경우 초기화 식)을 가질 수 없다는 오류가 발생할 것입니다. 구현은 실제 플랫폼 모듈에서 제공되어야 합니다. 초기화 식을 제거하세요.
3. `num` 프로퍼티 위에 마우스를 올리고 **Create missed actuals...**를 클릭합니다.
   `androidMain` 소스 세트를 선택합니다. 그런 다음 `androidMain/Platform.android.kt`에서 구현을 완료할 수 있습니다.

   ```kotlin
   actual val num: Int = 1
    ```

4. 이제 `iosMain` 모듈에 대한 구현을 제공합니다. `iosMain/Platform.ios.kt`에 다음을 추가합니다.

   ```kotlin
   actual val num: Int = 2
   ```

5. `commonMain/Greeting.kt` 파일에서 차이점을 확인하기 위해 `greet()` 함수에 `num` 프로퍼티를 추가합니다.

   ```kotlin
   fun greet(): String {
       val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
  
       return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
   }
   ```

## 애플리케이션 실행하기

IntelliJ IDEA에서 [Android](#run-your-application-on-android) 또는 [iOS](#run-your-application-on-ios)용 멀티플랫폼 애플리케이션을 실행할 수 있습니다.

앞서 expect/actual 메커니즘을 탐색했다면, Android에서는 인사말에 "[1]"이 추가되고 iOS에서는 "[2]"가 추가된 것을 볼 수 있습니다.

### Android에서 애플리케이션 실행하기

1. 실행 구성(run configurations) 목록에서 **composeApp**을 선택합니다.
2. 구성 목록 옆에서 Android 가상 기기(AVD)를 선택하고 **Run**을 클릭합니다.

   목록에 기기가 없다면 [새 Android 가상 기기](https://developer.android.com/studio/run/managing-avds#createavd)를 만드세요.

   ![Android에서 멀티플랫폼 앱 실행](compose-run-android.png){width=350}

   ![Android에서 실행된 첫 번째 모바일 멀티플랫폼 앱](first-multiplatform-project-on-android-1.png){width=300}

#### 다른 Android 시뮬레이션 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

[Android Emulator를 구성하고 다른 시뮬레이션 기기에서 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/emulator#runningapp)을 알아보세요.

#### 실제 Android 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

[하드웨어 기기를 구성 및 연결하고 그 위에서 애플리케이션을 실행하는 방법](https://developer.android.com/studio/run/device)을 알아보세요.

### iOS에서 애플리케이션 실행하기

초기 설정 과정에서 Xcode를 실행하지 않았다면 iOS 앱을 실행하기 전에 실행하세요.

IntelliJ IDEA의 실행 구성 목록에서 **iosApp**을 선택하고, 실행 구성 옆에서 시뮬레이션 기기를 선택한 후 **Run**을 클릭합니다.

목록에 사용 가능한 iOS 구성이 없다면 [새 실행 구성을 추가](#run-on-a-new-ios-simulated-device)하세요.

![iOS에서 멀티플랫폼 앱 실행](compose-run-ios.png){width=350}

![iOS에서 실행된 첫 번째 모바일 멀티플랫폼 앱](first-multiplatform-project-on-ios-1.png){width=300}

#### 새 iOS 시뮬레이션 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

시뮬레이션 기기에서 애플리케이션을 실행하려는 경우 새 실행 구성을 추가할 수 있습니다.

1. 실행 구성 목록에서 **Edit Configurations**를 클릭합니다.

   ![실행 구성 편집](ios-edit-configurations.png){width=450}

2. 구성 목록 위의 **+** 버튼을 클릭한 다음 **Xcode Application**을 선택합니다.

   ![iOS 애플리케이션을 위한 새 실행 구성](ios-new-configuration.png)

3. 구성 이름을 지정합니다.
4. **Working directory**를 선택합니다. 이를 위해 프로젝트(예: **KotlinMultiplatformSandbox**) 내의 `iosApp` 폴더로 이동합니다.

5. **Run**을 클릭하여 새 시뮬레이션 기기에서 애플리케이션을 실행합니다.

#### 실제 iOS 기기에서 실행하기 {initial-collapse-state="collapsed" collapsible="true"}

실제 iOS 기기에서 멀티플랫폼 애플리케이션을 실행할 수 있습니다. 시작하기 전에 [Apple ID](https://support.apple.com/en-us/HT204316)와 연결된 Team ID를 설정해야 합니다.

##### Team ID 설정하기

프로젝트에서 Team ID를 설정하려면 IntelliJ IDEA의 KDoctor 도구를 사용하거나 Xcode에서 팀을 선택할 수 있습니다.

KDoctor의 경우:

1. IntelliJ IDEA 터미널에서 다음 명령을 실행합니다.

   ```none
   kdoctor --team-ids 
   ```

   KDoctor는 시스템에 현재 구성된 모든 Team ID를 나열합니다. 예:

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. IntelliJ IDEA에서 `iosApp/Configuration/Config.xcconfig`를 열고 Team ID를 지정합니다.

또는 Xcode에서 팀을 선택합니다.

1. Xcode로 이동하여 **Open a project or file**을 선택합니다.
2. 프로젝트의 `iosApp/iosApp.xcworkspace` 파일로 이동합니다.
3. 왼쪽 메뉴에서 `iosApp`을 선택합니다.
4. **Signing & Capabilities**로 이동합니다.
5. **Team** 목록에서 본인의 팀을 선택합니다.

   아직 팀을 설정하지 않았다면 **Team** 목록에서 **Add an Account** 옵션을 사용하여 Xcode의 안내를 따르세요.

6. Bundle Identifier가 고유하고 Signing Certificate가 성공적으로 할당되었는지 확인합니다.

##### 앱 실행하기

케이블로 iPhone을 연결합니다. 이미 Xcode에 기기가 등록되어 있다면 IntelliJ IDEA의 실행 구성 목록에 표시됩니다. 해당 `iosApp` 구성을 실행하세요.

아직 Xcode에 iPhone을 등록하지 않았다면 [Apple 권장 사항](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)을 따르세요. 요약하자면 다음과 같습니다.

1. 케이블로 iPhone을 연결합니다.
2. iPhone의 **설정** | **개인정보 보호 및 보안**에서 개발자 모드를 활성화합니다.
3. Xcode의 상단 메뉴에서 **Window** | **Devices and Simulators**를 선택합니다.
4. 더하기(+) 기호를 클릭합니다. 연결된 iPhone을 선택하고 **Add**를 클릭합니다.
5. 기기에서 개발 기능을 활성화하려면 Apple ID로 로그인합니다.
6. 화면의 지시에 따라 페어링 프로세스를 완료합니다.

Xcode에 iPhone을 등록했다면 IntelliJ IDEA에서 [새 실행 구성을 생성](#run-on-a-new-ios-simulated-device)하고 **Execution target** 목록에서 기기를 선택합니다. 해당 `iosApp` 구성을 실행하세요.

## 다음 단계

튜토리얼의 다음 부분에서는 플랫폼 전용 라이브러리를 사용하여 UI 요소를 업데이트하는 방법을 배웁니다.

**[다음 단계로 진행하기](multiplatform-update-ui.md)**

### 더 보기

* 코드가 올바르게 작동하는지 확인하기 위해 [멀티플랫폼 테스트를 만들고 실행하는 방법](multiplatform-run-tests.md)을 확인하세요.
* [프로젝트 구조](multiplatform-discover-project.md)에 대해 더 자세히 알아보세요.
* 기존 Android 프로젝트를 크로스 플랫폼 앱으로 변환하고 싶다면 [Android 앱을 크로스 플랫폼으로 만드는 이 튜토리얼](multiplatform-integrate-in-existing-app.md)을 완료하세요.

## 도움받기

* **Kotlin Slack**: [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* **Kotlin 이슈 트래커**: [새로운 이슈를 보고](https://youtrack.jetbrains.com/newIssue?project=KT)하세요.