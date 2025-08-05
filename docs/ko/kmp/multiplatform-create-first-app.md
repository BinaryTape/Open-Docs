[//]: # (title: Kotlin Multiplatform 앱 만들기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 튜토리얼은 **공유 로직과 네이티브 UI를 가진 Kotlin Multiplatform 앱 만들기**의 첫 번째 부분입니다.</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>Kotlin Multiplatform 앱 만들기</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> 사용자 인터페이스 업데이트<br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 의존성 추가<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 더 많은 로직 공유<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 프로젝트 마무리<br/>
    </p>
</tldr>

여기서 IntelliJ IDEA를 사용하여 첫 번째 Kotlin Multiplatform 애플리케이션을 만들고 실행하는 방법을 배웁니다.

Kotlin Multiplatform 기술은 크로스 플랫폼 프로젝트 개발을 간소화합니다.
Kotlin Multiplatform 애플리케이션은 iOS, Android, macOS, Windows, Linux, 웹 등 다양한 플랫폼에서 작동할 수 있습니다.

Kotlin Multiplatform의 주요 사용 사례 중 하나는 모바일 플랫폼 간에 코드를 공유하는 것입니다.
iOS와 Android 앱 간에 애플리케이션 로직을 공유하고, 네이티브 UI를 구현하거나 플랫폼 API와 연동해야 할 때만 플랫폼별 코드를 작성할 수 있습니다.

## 프로젝트 만들기

1. [빠른 시작 가이드](quickstart.md)에서 [Kotlin Multiplatform 개발 환경 설정](quickstart.md#set-up-the-environment) 지침을 완료하세요.
2. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
3. 왼쪽 패널에서 **Kotlin Multiplatform**을 선택합니다.
4. **New Project** 창에서 다음 필드를 지정합니다.
   * **Name**: GreetingKMP
   * **Group**: com.jetbrains.greeting
   * **Artifact**: greetingkmp
   
   ![Create Compose Multiplatform project](create-first-multiplatform-app.png){width=800}

5. **Android** 및 **iOS** 타겟을 선택합니다.
6. iOS의 경우, UI를 네이티브로 유지하기 위해 **Do not share UI** 옵션을 선택합니다.
7. 모든 필드와 타겟을 지정했으면 **Create**를 클릭합니다.

> IntelliJ IDEA는 프로젝트 내 Android Gradle 플러그인을 최신 버전으로 업그레이드하도록 자동으로 제안할 수 있습니다.
> Kotlin Multiplatform은 최신 AGP 버전과 호환되지 않으므로 업그레이드를 권장하지 않습니다.
> ([호환성 표](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility) 참조).
>
{style="note"}

## 프로젝트 구조 살펴보기

IntelliJ IDEA에서 `GreetingKMP` 폴더를 확장합니다.

이 Kotlin Multiplatform 프로젝트에는 세 가지 모듈이 포함됩니다.

* _shared_는 Android 및 iOS 애플리케이션 모두에 공통된 로직을 포함하는 Kotlin 모듈입니다. 이는 플랫폼 간에 공유하는 코드입니다. 빌드 프로세스를 자동화하는 데 도움이 되는 빌드 시스템으로 [Gradle](https://kotlinlang.org/docs/gradle.html)을 사용합니다.
* _composeApp_은 Android 애플리케이션으로 빌드되는 Kotlin 모듈입니다. 빌드 시스템으로 Gradle을 사용합니다. composeApp 모듈은 shared 모듈을 일반 Android 라이브러리로 의존하고 사용합니다.
* _iosApp_은 iOS 애플리케이션으로 빌드되는 Xcode 프로젝트입니다. 이는 shared 모듈을 iOS 프레임워크로 의존하고 사용합니다. shared 모듈은 일반 프레임워크 또는 [CocoaPods 의존성](multiplatform-cocoapods-overview.md)으로 사용될 수 있습니다. 기본적으로 IntelliJ IDEA에서 생성된 Kotlin Multiplatform 프로젝트는 일반 프레임워크 의존성을 사용합니다.

![Basic Multiplatform project structure](basic-project-structure.svg){width=700}

shared 모듈은 세 가지 소스 세트(`androidMain`, `commonMain`, `iosMain`)로 구성됩니다. _소스 세트(Source set)_는 각 그룹이 자체 의존성을 갖도록 논리적으로 그룹화된 파일들의 집합을 위한 Gradle 개념입니다.
Kotlin Multiplatform에서는 shared 모듈의 다른 소스 세트가 다른 플랫폼을 타겟팅할 수 있습니다.

common 소스 세트에는 공유 Kotlin 코드가 포함되어 있으며, 플랫폼 소스 세트는 각 타겟에 특화된 Kotlin 코드를 사용합니다.
`androidMain`에는 Kotlin/JVM이 사용되고 `iosMain`에는 Kotlin/Native가 사용됩니다.

![Source sets and modules structure](basic-project-structure-2.png){width=350}

shared 모듈이 Android 라이브러리로 빌드될 때, common Kotlin 코드는 Kotlin/JVM으로 처리됩니다.
iOS 프레임워크로 빌드될 때, common Kotlin은 Kotlin/Native로 처리됩니다.

![Common Kotlin, Kotlin/JVM, and Kotlin/Native](modules-structure.png)

### 공통 선언 작성하기

common 소스 세트에는 여러 타겟 플랫폼에서 사용될 수 있는 공유 코드가 포함되어 있습니다.
이는 플랫폼에 독립적인 코드를 포함하도록 설계되었습니다. common 소스 세트에서 플랫폼별 API를 사용하려고 하면 IDE에 경고가 표시됩니다.

1. `shared/src/commonMain/kotlin/com/jetbrains/greeting/greetingkmp/Greeting.kt` 파일을 엽니다. 이 파일에는 `greet()` 함수가 있는 자동 생성된 `Greeting` 클래스를 찾을 수 있습니다.

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 인사말에 약간의 다양성을 추가합니다. Kotlin 표준 라이브러리에서 `kotlin.random.Random`을 임포트합니다.
    이는 모든 플랫폼에서 작동하는 멀티플랫폼 라이브러리이며, 의존성으로 자동으로 포함됩니다.
3. Kotlin 표준 라이브러리의 `reversed()` 호출을 사용하여 공유 코드를 업데이트하여 텍스트를 반전시킵니다.

    ```kotlin
    import kotlin.random.Random
    
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord Guess what this is! > ${platform.name.reversed()}!"
        }
    }
    ```

코드를 common Kotlin에만 작성하는 것은 플랫폼별 기능을 사용할 수 없으므로 명백한 한계가 있습니다.
인터페이스와 [expect/actual](multiplatform-connect-to-apis.md) 메커니즘을 사용하면 이 문제가 해결됩니다.

### 플랫폼별 구현 확인하기

common 소스 세트는 예상 선언(인터페이스, 클래스 등)을 정의할 수 있습니다.
그러면 각 플랫폼 소스 세트, 이 경우 `androidMain` 및 `iosMain`은 예상 선언에 대한 실제 플랫폼별 구현을 제공해야 합니다.

특정 플랫폼용 코드를 생성하는 동안 Kotlin 컴파일러는 예상 선언과 실제 선언을 병합하고, 실제 구현이 포함된 단일 선언을 생성합니다.

1. IntelliJ IDEA로 Kotlin Multiplatform 프로젝트를 생성할 때, `commonMain` 모듈에 `Platform.kt` 파일이 포함된 템플릿을 얻게 됩니다.

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   이는 플랫폼에 대한 정보를 담은 공통 `Platform` 인터페이스입니다.

2. `androidMain` 및 `iosMain` 모듈 간에 전환합니다.
   Android 및 iOS 소스 세트에 대해 동일한 기능에 대한 다른 구현이 있는 것을 볼 수 있습니다.
    
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

    * `AndroidPlatform`의 `name` 프로퍼티 구현은 Android 전용 코드인 `android.os.Build` 의존성을 사용합니다. 이 코드는 Kotlin/JVM으로 작성되었습니다. 여기에 있는 `java.util.Random`과 같은 JVM 전용 클래스에 액세스하려고 하면 이 코드는 컴파일됩니다.
    * `IOSPlatform`의 `name` 프로퍼티 구현은 iOS 전용 코드인 `platform.UIKit.UIDevice` 의존성을 사용합니다. 이 코드는 Kotlin/Native로 작성되었으며, 이는 Kotlin으로 iOS 코드를 작성할 수 있음을 의미합니다. 이 코드는 나중에 iOS 애플리케이션에서 Swift로 호출할 iOS 프레임워크의 일부가 됩니다.

3. 다른 소스 세트에서 `getPlatform()` 함수를 확인하세요. 이 함수의 예상 선언은 본문이 없으며, 실제 구현은 플랫폼 코드에 제공됩니다.

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

여기서 common 소스 세트는 예상 `getPlatform()` 함수를 정의하고, 플랫폼 소스 세트에서 Android 앱을 위한 `AndroidPlatform()`과 iOS 앱을 위한 `IOSPlatform()`이라는 실제 구현을 가지고 있습니다.

특정 플랫폼용 코드를 생성하는 동안 Kotlin 컴파일러는 예상 선언과 실제 선언을 실제 구현이 포함된 단일 `getPlatform()` 함수로 병합합니다.

그렇기 때문에 예상 선언과 실제 선언은 동일한 패키지에 정의되어야 합니다. 이는 결과적으로 플랫폼 코드에서 하나의 선언으로 병합되기 때문입니다. Any invocation of the expected `getPlatform()` function in the generated platform code calls a correct actual implementation.
생성된 플랫폼 코드에서 예상 `getPlatform()` 함수를 호출하면 올바른 실제 구현이 호출됩니다.

이제 앱을 실행하여 이 모든 것을 실제로 확인할 수 있습니다.

#### expect/actual 메커니즘 탐색 (선택 사항) {initial-collapse-state="collapsed" collapsible="true"}

템플릿 프로젝트는 함수에 대해 expect/actual 메커니즘을 사용하지만, 프로퍼티와 클래스 같은 대부분의 Kotlin 선언에서도 작동합니다. 예상 프로퍼티를 구현해 봅시다.

1. `commonMain` 모듈에 있는 `Platform.kt` 파일을 열고 파일 끝에 다음을 추가합니다.

   ```kotlin
   expect val num: Int
   ```

   Kotlin 컴파일러는 이 프로퍼티에 플랫폼 모듈에 해당하는 실제 선언이 없다고 불평합니다.

2. 다음과 같이 바로 구현을 제공해 보세요.

   ```kotlin
   expect val num: Int = 42
   ```

   예상 선언은 본문, 이 경우 초기화자를 가질 수 없다는 오류가 발생할 것입니다.
   구현은 실제 플랫폼 모듈에서 제공되어야 합니다. 초기화자를 제거하세요.
3. `num` 프로퍼티에 마우스를 올리고 **Create missed actuals...**를 클릭합니다.
   `androidMain` 소스 세트를 선택합니다. 그런 다음 `androidMain/Platform.android.kt`에서 구현을 완료할 수 있습니다.

   ```kotlin
   actual val num: Int = 1
    ```

4. 이제 `iosMain` 모듈에 대한 구현을 제공합니다. `iosMain/Platform.ios.kt`에 다음을 추가합니다.

   ```kotlin
   actual val num: Int = 2
   ```

5. `commonMain/Greeting.kt` 파일에서 `num` 프로퍼티를 `greet()` 함수에 추가하여 차이점을 확인합니다.

   ```kotlin
   fun greet(): String {
       val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
  
       return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
   }
   ```

## 애플리케이션 실행하기

IntelliJ IDEA에서 [Android](#run-your-application-on-android) 또는 [iOS](#run-your-application-on-ios)용 멀티플랫폼 애플리케이션을 실행할 수 있습니다.

이전에 expect/actual 메커니즘을 탐색했다면, Android용 인사말에는 "[1]"이, iOS용 인사말에는 "[2]"가 추가된 것을 확인할 수 있습니다.

### Android에서 애플리케이션 실행하기

1. 실행 구성 목록에서 **composeApp**을 선택합니다.
2. 구성 목록 옆에서 Android 가상 장치를 선택하고 **Run**을 클릭합니다.

   목록에 장치가 없으면 [새 Android 가상 장치](https://developer.android.com/studio/run/managing-avds#createavd)를 생성하세요.

   ![Run multiplatform app on Android](compose-run-android.png){width=350}

   ![First mobile multiplatform app on Android](first-multiplatform-project-on-android-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_android_other_devices"/>

### iOS에서 애플리케이션 실행하기

초기 설정의 일부로 Xcode를 실행하지 않았다면, iOS 앱을 실행하기 전에 Xcode를 실행하세요.

IntelliJ IDEA에서 실행 구성 목록에서 **iosApp**을 선택하고, 실행 구성 옆에 있는 시뮬레이션 장치를 선택한 다음 **Run**을 클릭합니다.

목록에 사용 가능한 iOS 구성이 없으면 [새 실행 구성](#run-on-a-new-ios-simulated-device)을 추가하세요.

![Run multiplatform app on iOS](compose-run-ios.png){width=350}

![First mobile multiplatform app on iOS](first-multiplatform-project-on-ios-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_ios_other_devices"/>

## 다음 단계

튜토리얼의 다음 부분에서는 플랫폼별 라이브러리를 사용하여 UI 요소를 업데이트하는 방법을 배웁니다.

**[다음 부분으로 진행하기](multiplatform-update-ui.md)**

### 함께 보기

* 코드가 올바르게 작동하는지 확인하기 위해 [멀티플랫폼 테스트를 만들고 실행하는 방법](multiplatform-run-tests.md)을 알아보세요.
* [프로젝트 구조](multiplatform-discover-project.md)에 대해 더 알아보세요.
* 기존 Android 프로젝트를 크로스 플랫폼 앱으로 변환하려면, [Android 앱을 크로스 플랫폼으로 만드는 이 튜토리얼을 완료](multiplatform-integrate-in-existing-app.md)하세요.

## 도움 받기

* **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받아 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* **Kotlin 이슈 트래커**. [새로운 이슈 보고](https://youtrack.jetbrains.com/newIssue?project=KT).