[//]: # (title: 안드로이드 애플리케이션을 iOS에서 동작하게 만들기 – 튜토리얼)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>이 튜토리얼은 Android Studio를 사용하지만, IntelliJ IDEA에서도 따라 할 수 있습니다. <Links href="/kmp/quickstart" summary="undefined">제대로 설정하면</Links>,
   두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
</tldr>

이 튜토리얼은 기존 안드로이드 애플리케이션을 안드로이드와 iOS 모두에서 작동하도록 크로스 플랫폼으로 만드는 방법을 보여줍니다.
동일한 장소에서 안드로이드와 iOS용 코드를 동시에 작성할 수 있게 됩니다.

이 튜토리얼은 사용자 이름과 비밀번호를 입력하는 단일 화면을 가진 [샘플 안드로이드 애플리케이션](https://github.com/Kotlin/kmp-integration-sample)을 사용합니다.
자격 증명은 유효성을 검사하고 인메모리 데이터베이스에 저장됩니다.

애플리케이션이 iOS와 안드로이드 모두에서 작동하도록 하려면,
먼저 코드의 일부를 공유 모듈로 이동하여 코드를 크로스 플랫폼으로 만듭니다.
그 다음 안드로이드 애플리케이션에서 크로스 플랫폼 코드를 사용하고, 동일한 코드를 새로운 iOS 애플리케이션에서 사용합니다.

> Kotlin Multiplatform에 익숙하지 않다면, 먼저 [처음부터 크로스 플랫폼 애플리케이션을 만드는 방법](quickstart.md)을 알아보세요.
>
{style="tip"}

## 개발 환경 준비하기

1.  퀵스타트에서 [Kotlin Multiplatform 개발 환경 설정](quickstart.md#set-up-the-environment) 지침을 완료합니다.

   > 이 튜토리얼의 특정 단계(예: iOS 애플리케이션 실행)를 완료하려면 macOS가 설치된 Mac이 필요합니다.
   > 이는 Apple의 요구 사항 때문입니다.
   >
   {style="note"}

2.  Android Studio에서 버전 관리로부터 새 프로젝트를 생성합니다:

   ```text
   https://github.com/Kotlin/kmp-integration-sample
   ```

   > `master` 브랜치에는 프로젝트의 초기 상태(간단한 안드로이드 애플리케이션)가 포함되어 있습니다.
   > iOS 애플리케이션 및 공유 모듈이 포함된 최종 상태를 보려면 `final` 브랜치로 전환하세요.
   >
   {style="tip"}

3.  **Project** 뷰로 전환합니다:

   ![Project view](switch-to-project.png){width="513"}

## 코드 크로스 플랫폼으로 만들기

코드를 크로스 플랫폼으로 만들기 위해 다음 단계를 따릅니다:

1.  [크로스 플랫폼으로 만들 코드 결정](#decide-what-code-to-make-cross-platform)
2.  [크로스 플랫폼 코드를 위한 공유 모듈 생성](#create-a-shared-module-for-cross-platform-code)
3.  [코드 공유 테스트](#add-code-to-the-shared-module)
4.  [안드로이드 애플리케이션에 공유 모듈 종속성 추가](#add-a-dependency-on-the-shared-module-to-your-android-application)
5.  [비즈니스 로직 크로스 플랫폼으로 만들기](#make-the-business-logic-cross-platform)
6.  [안드로이드에서 크로스 플랫폼 애플리케이션 실행](#run-your-cross-platform-application-on-android)

### 크로스 플랫폼으로 만들 코드 결정

안드로이드 애플리케이션의 어떤 코드를 iOS와 공유하는 것이 더 좋고 어떤 코드를 네이티브로 유지할지 결정합니다. 간단한 규칙은 다음과 같습니다:
가능한 한 많이 재사용하려는 것을 공유하세요. 비즈니스 로직은 종종 안드로이드와 iOS 모두에서 동일하므로,
재사용하기에 좋은 후보입니다.

샘플 안드로이드 애플리케이션에서 비즈니스 로직은 `com.jetbrains.simplelogin.androidapp.data` 패키지에 저장되어 있습니다.
미래의 iOS 애플리케이션도 동일한 로직을 사용할 것이므로, 이를 크로스 플랫폼으로 만들어야 합니다.

![Business logic to share](business-logic-to-share.png){width=366}

### 크로스 플랫폼 코드를 위한 공유 모듈 생성

iOS와 안드로이드 모두에서 사용되는 크로스 플랫폼 코드는 공유 모듈에 저장됩니다.
Android Studio와 IntelliJ IDEA 모두 Kotlin Multiplatform용 공유 모듈을 생성하기 위한 마법사를 제공합니다.

기존 안드로이드 애플리케이션과 미래의 iOS 애플리케이션 모두에 연결할 공유 모듈을 생성합니다:

1.  Android Studio에서 메인 메뉴에서 **File** | **New** | **New Module**을 선택합니다.
2.  템플릿 목록에서 **Kotlin Multiplatform Shared Module**을 선택합니다.
    라이브러리 이름은 `shared`로 두고 패키지 이름을 입력합니다:

    ```text
    com.jetbrains.simplelogin.shared
    ```

3.  **Finish**를 클릭합니다. 마법사가 공유 모듈을 생성하고, 빌드 스크립트를 그에 따라 변경하며, Gradle 동기화를 시작합니다.
4.  설정이 완료되면, `shared` 디렉터리에 다음과 같은 파일 구조가 표시됩니다:

   ![Final file structure inside the shared directory](shared-directory-structure.png){width="341"}

5.  `shared/build.gradle.kts` 파일의 `kotlin.androidLibrary.minSdk` 속성이
    `app/build.gradle.kts` 파일의 동일한 속성 값과 일치하는지 확인합니다.

### 공유 모듈에 코드 추가하기

이제 공유 모듈이 생겼으니,
`commonMain/kotlin/com.jetbrains.simplelogin.shared` 디렉터리에 공유할 공통 코드를 추가합니다:

1.  다음 코드로 새 `Greeting` 클래스를 생성합니다:

    ```kotlin
    package com.jetbrains.simplelogin.shared

    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2.  생성된 파일의 코드를 다음으로 바꿉니다:

    *   `commonMain/Platform.kt`에서:

        ```kotlin
        package com.jetbrains.simplelogin.shared
      
        interface Platform {
            val name: String
        }
       
        expect fun getPlatform(): Platform
        ```
    
    *   `androidMain/Platform.android.kt`에서:

        ```kotlin
        package com.jetbrains.simplelogin.shared
        
        import android.os.Build

        class AndroidPlatform : Platform {
            override val name: String = "Android ${Build.VERSION.SDK_INT}"
        }

        actual fun getPlatform(): Platform = AndroidPlatform()
        ```
    *   `iosMain/Platform.ios.kt`에서:

        ```kotlin
        package com.jetbrains.simplelogin.shared
      
        import platform.UIKit.UIDevice

        class IOSPlatform: Platform {
            override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
        }

        actual fun getPlatform(): Platform = IOSPlatform()
        ```

결과 프로젝트의 레이아웃을 더 잘 이해하고 싶다면,
[Kotlin Multiplatform 프로젝트 구조의 기본](multiplatform-discover-project.md)을 참조하세요.

### 안드로이드 애플리케이션에 공유 모듈 종속성 추가

안드로이드 애플리케이션에서 크로스 플랫폼 코드를 사용하려면, 공유 모듈을 연결하고, 비즈니스 로직 코드를
그곳으로 이동하며, 이 코드를 크로스 플랫폼으로 만드세요.

1.  `app/build.gradle.kts` 파일에 공유 모듈 종속성을 추가합니다:

    ```kotlin
    dependencies {
        // ...
        implementation(project(":shared"))
    }
    ```

2.  IDE에서 제안하거나 **File** | **Sync Project with Gradle Files** 메뉴 항목을 사용하여 Gradle 파일을 동기화합니다.
3.  `app/src/main/java/` 디렉터리에서 `com.jetbrains.simplelogin.androidapp.ui.login` 패키지에 있는 `LoginActivity.kt` 파일을 엽니다.
4.  공유 모듈이 애플리케이션에 성공적으로 연결되었는지 확인하기 위해, `onCreate()` 메서드에 `Log.i()` 호출을 추가하여
    `greet()` 함수 결과를 로그로 덤프합니다:

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Log.i("Login Activity", "Hello from shared module: " + (Greeting().greet()))
   
        // ...
    }
    ```
5.  누락된 클래스를 임포트하기 위해 IDE의 제안을 따릅니다.
6.  도구 모음에서 `app` 드롭다운을 클릭한 다음 디버그 아이콘을 클릭합니다:

   ![App from list to debug](app-list-android.png){width="300"}

7.  **Logcat** 도구 창에서 로그에서 "Hello"를 검색하면 공유 모듈의 인사를 찾을 수 있습니다:

   ![Greeting from the shared module](shared-module-greeting.png){width="700"}

### 비즈니스 로직 크로스 플랫폼으로 만들기

이제 비즈니스 로직 코드를 Kotlin Multiplatform 공유 모듈로 추출하고 플랫폼 독립적으로 만들 수 있습니다.
이는 안드로이드와 iOS 모두에서 코드를 재사용하는 데 필요합니다.

1.  비즈니스 로직 코드 `com.jetbrains.simplelogin.androidapp.data`를 `app` 디렉터리에서
    `shared/src/commonMain` 디렉터리의 `com.jetbrains.simplelogin.shared` 패키지로 이동합니다.

   ![Drag and drop the package with the business logic code](moving-business-logic.png){width=300}

2.  Android Studio가 무엇을 할 것인지 물으면, 패키지 이동을 선택한 다음 리팩터링을 승인합니다.

   ![Refactor the business logic package](refactor-business-logic-package.png){width=300}

3.  플랫폼 종속 코드에 대한 모든 경고를 무시하고 **Refactor Anyway**를 클릭합니다.

   ![Warnings about platform-dependent code](warnings-android-specific-code.png){width=450}

4.  안드로이드 관련 코드를 크로스 플랫폼 Kotlin 코드로 바꾸거나 [expect 및 actual 선언](multiplatform-connect-to-apis.md)을 사용하여 안드로이드 관련 API에 연결함으로써 제거합니다. 자세한 내용은 다음 섹션을 참조하세요:

   #### 안드로이드 관련 코드를 크로스 플랫폼 코드로 바꾸기 {initial-collapse-state="collapsed" collapsible="true"}
   
   코드가 안드로이드와 iOS 모두에서 잘 작동하도록 하려면, 이동된 `data` 디렉터리에서 가능한 한 모든 JVM 종속성을 Kotlin 종속성으로 바꿉니다.

   1.  `LoginDataValidator` 클래스에서 `android.utils` 패키지의 `Patterns` 클래스를 이메일 유효성 검사 패턴과 일치하는 Kotlin
       정규 표현식으로 바꿉니다:
   
       ```kotlin
       // Before
       private fun isEmailValid(email: String) = Patterns.EMAIL_ADDRESS.matcher(email).matches()
       ```
   
       ```kotlin
       // After
       private fun isEmailValid(email: String) = emailRegex.matches(email)
       
       companion object {
           private val emailRegex = 
               ("[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                   "\\@" +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                   "(" +
                   "\\." +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                   ")+").toRegex()
       }
       ```
   
   2.  `Patterns` 클래스에 대한 임포트 지시문을 제거합니다:
   
       ```kotlin
       import android.util.Patterns
       ```

   3.  `LoginDataSource` 클래스에서 `login()` 함수의 `IOException`을 `RuntimeException`으로 바꿉니다.
       `IOException`은 Kotlin/JVM에서 사용할 수 없습니다.

          ```kotlin
          // Before
          return Result.Error(IOException("Error logging in", e))
          ```

          ```kotlin
          // After
          return Result.Error(RuntimeException("Error logging in", e))
          ```

   4.  `IOException`에 대한 임포트 지시문도 제거합니다:

       ```kotlin
       import java.io.IOException
       ```

   #### 크로스 플랫폼 코드에서 플랫폼 특정 API에 연결하기 {initial-collapse-state="collapsed" collapsible="true"}
   
   `LoginDataSource` 클래스에서 `fakeUser`에 대한 범용 고유 식별자(UUID)는
   iOS에서 사용할 수 없는 `java.util.UUID` 클래스를 사용하여 생성됩니다.
   
   ```kotlin
   val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
   ```
   
   Kotlin 표준 라이브러리가 [UUID 생성을 위한 실험적 클래스](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)를 제공하지만,
   이 경우 플랫폼 특정 기능을 사용하여 이를 연습해 봅시다.
   
   공유 코드에 `randomUUID()` 함수에 대한 `expect` 선언을 제공하고 각 플랫폼(안드로이드 및 iOS)에 대한 `actual` 구현을
   해당 소스 세트에 제공합니다.
   [플랫폼 특정 API 연결](multiplatform-connect-to-apis.md)에 대해 더 자세히 알아볼 수 있습니다.
   
   1.  `login()` 함수의 `java.util.UUID.randomUUID()` 호출을 각 플랫폼에 대해 구현할 `randomUUID()` 호출로 변경합니다:
   
       ```kotlin
       val fakeUser = LoggedInUser(randomUUID(), "Jane Doe")
       ```
   
   2.  `shared/src/commonMain` 디렉터리의 `com.jetbrains.simplelogin.shared` 패키지에 `Utils.kt` 파일을 생성하고
       `expect` 선언을 제공합니다:
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       expect fun randomUUID(): String
       ```
   
   3.  `shared/src/androidMain` 디렉터리의 `com.jetbrains.simplelogin.shared` 패키지에 `Utils.android.kt` 파일을 생성하고
       안드로이드에서 `randomUUID()`에 대한 `actual` 구현을 제공합니다:
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import java.util.*
      
       actual fun randomUUID() = UUID.randomUUID().toString()
       ```
   
   4.  `shared/src/iosMain` 디렉터리의 `com.jetbrains.simplelogin.shared`에 `Utils.ios.kt` 파일을 생성하고
       iOS에서 `randomUUID()`에 대한 `actual` 구현을 제공합니다:
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import platform.Foundation.NSUUID
      
       actual fun randomUUID(): String = NSUUID().UUIDString()
       ```
   
   5.  `shared/src/commonMain` 디렉터리의 `LoginDataSource.kt` 파일에서 `randomUUID` 함수를 임포트합니다:
   
      ```kotlin
      import com.jetbrains.simplelogin.shared.randomUUID
      ```
   
이제 Kotlin은 안드로이드와 iOS에 대해 플랫폼 특정 UUID 구현을 사용할 것입니다.

### 안드로이드에서 크로스 플랫폼 애플리케이션 실행

크로스 플랫폼 안드로이드 애플리케이션을 실행하여 이전과 같이 작동하는지 확인합니다.

![Android login application](android-login.png){width=300}

## 크로스 플랫폼 애플리케이션을 iOS에서 작동하게 만들기

안드로이드 애플리케이션을 크로스 플랫폼으로 만든 후, iOS 애플리케이션을 생성하고 공유된
비즈니스 로직을 재사용할 수 있습니다.

1.  [Xcode에서 iOS 프로젝트 생성](#create-an-ios-project-in-xcode)
2.  [KMP 프레임워크를 사용하도록 iOS 프로젝트 구성](#configure-the-ios-project-to-use-a-kmp-framework)
3.  [Android Studio에서 iOS 실행 구성 설정](#set-up-an-ios-run-configuration-in-android-studio)
4.  [iOS 프로젝트에서 공유 모듈 사용](#use-the-shared-module-in-the-ios-project)

### Xcode에서 iOS 프로젝트 생성

1.  Xcode에서 **File** | **New** | **Project**를 클릭합니다.
2.  iOS 앱 템플릿을 선택하고 **Next**를 클릭합니다.

   ![iOS project template](ios-project-wizard-1.png){width="700"}

3.  제품 이름으로 "simpleLoginIOS"를 지정하고 **Next**를 클릭합니다.

   ![iOS project settings](ios-project-wizard-2.png){width="700"}

4.  프로젝트 위치로 크로스 플랫폼 애플리케이션이 저장된 디렉터리(예: `kmp-integration-sample`)를 선택합니다.

Android Studio에서 다음과 같은 구조를 얻게 됩니다:

![iOS project in Android Studio](ios-project-in-as.png){width="194"}

크로스 플랫폼 프로젝트의 다른 최상위 디렉터리와 일관성을 위해 `simpleLoginIOS` 디렉터리 이름을 `iosApp`으로 변경할 수 있습니다.
이렇게 하려면 Xcode를 닫은 다음 `simpleLoginIOS` 디렉터리 이름을 `iosApp`으로 변경합니다.
Xcode가 열려 있는 상태에서 폴더 이름을 변경하면 경고가 표시되고 프로젝트가 손상될 수 있습니다.

![Renamed iOS project directory in Android Studio](ios-directory-renamed-in-as.png){width="194"}

### KMP 프레임워크를 사용하도록 iOS 프로젝트 구성

iOS 앱과 Kotlin Multiplatform이 빌드한 프레임워크 간의 통합을 직접 설정할 수 있습니다.
이 방법의 대안은 [iOS 통합 방법 개요](multiplatform-ios-integration-overview.md)에 설명되어 있지만,
이 튜토리얼의 범위를 벗어납니다.

1.  Android Studio에서 `iosApp/simpleLoginIOS.xcodeproj` 디렉터리를 마우스 오른쪽 버튼으로 클릭하고
    **Open In** | **Open In Associated Application**을 선택하여 Xcode에서 iOS 프로젝트를 엽니다.
2.  Xcode에서 **Project** 내비게이터의 프로젝트 이름을 두 번 클릭하여 iOS 프로젝트 설정을 엽니다.

3.  왼쪽의 **Targets** 섹션에서 **simpleLoginIOS**를 선택한 다음 **Build Phases** 탭을 클릭합니다.

4.  **+** 아이콘을 클릭하고 **New Run Script Phase**를 선택합니다.

    ![Add a run script phase](xcode-run-script-phase-1.png){width="700"}

4.  스크립트 실행 필드에 다음 스크립트를 붙여넣습니다:

    ```text
    cd "$SRCROOT/.."
    ./gradlew :shared:embedAndSignAppleFrameworkForXcode
    ```

   ![Add the script](xcode-run-script-phase-2.png){width="700"}

5.  **Based on dependency analysis** 옵션을 비활성화합니다.

   이렇게 하면 Xcode가 빌드할 때마다 스크립트를 실행하고 누락된 출력 종속성에 대해 매번 경고하지 않습니다.

6.  **Run Script** 단계를 **Compile Sources** 단계보다 위로 이동합니다:

   ![Move the Run Script phase](xcode-run-script-phase-3.png){width="700"}

7.  **Build Settings** 탭에서 **Build Options** 아래의 **User Script Sandboxing** 옵션을 비활성화합니다:

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width="700"}

   > 기본 `Debug` 또는 `Release`와 다른 사용자 지정 빌드 구성을 사용하는 경우, **Build Settings** 탭에서
   > **User-Defined** 아래에 `KOTLIN_FRAMEWORK_BUILD_TYPE` 설정을 추가하고 `Debug` 또는 `Release`로 설정합니다.
   >
   {style="note"}

8.  Xcode에서 프로젝트를 빌드합니다 (메인 메뉴에서 **Product** | **Build**).
    모든 것이 올바르게 구성되었다면, 프로젝트는 성공적으로 빌드되어야 합니다
    ("build phase will be run during every build" 경고는 무시해도 됩니다).
   
    > **User Script Sandboxing** 옵션을 비활성화하기 전에 프로젝트를 빌드했다면 빌드가 실패할 수 있습니다:
    > Gradle 데몬 프로세스가 샌드박스 처리되어 다시 시작해야 할 수 있습니다.
    > 프로젝트 디렉터리(예시에서는 `kmp-integration-sample`)에서 다음 명령을 실행하여 프로젝트를 다시 빌드하기 전에 중지하세요:
    > 
    > ```shell
    > ./gradlew --stop
    > ```
    > 
    {style="note"}

### Android Studio에서 iOS 실행 구성 설정

Xcode가 올바르게 설정되었는지 확인한 후, Android Studio로 돌아갑니다:

1.  메인 메뉴에서 **File | Sync Project with Gradle Files**를 선택합니다. Android Studio는 자동으로
    **simpleLoginIOS**라는 실행 구성을 생성합니다.

   Android Studio는 자동으로 **simpleLoginIOS**라는 실행 구성을 생성하고 `iosApp` 디렉터리를
   링크된 Xcode 프로젝트로 표시합니다.

2.  실행 구성 목록에서 **simpleLoginIOS**를 선택합니다.
    iOS 에뮬레이터를 선택한 다음 **Run**을 클릭하여 iOS 앱이 올바르게 실행되는지 확인합니다.

   ![The iOS run configuration in the list of run configurations](ios-run-configuration-simplelogin.png){width="400"}

### iOS 프로젝트에서 공유 모듈 사용

`shared` 모듈의 `build.gradle.kts` 파일은 각 iOS 타겟에 대해 `binaries.framework.baseName`
속성을 `sharedKit`으로 정의합니다.
이것은 Kotlin Multiplatform이 iOS 앱이 소비할 프레임워크의 이름입니다.

통합을 테스트하려면 Swift 코드에서 공통 코드 호출을 추가합니다:

1.  Android Studio에서 `iosApp/simpleloginIOS/ContentView.swift` 파일을 열고 프레임워크를 임포트합니다:

   ```swift
   import sharedKit
   ```

2.  제대로 연결되었는지 확인하기 위해, `ContentView` 구조를 크로스 플랫폼 앱의 공유 모듈에서 `greet()` 함수를 사용하도록 변경합니다:

   ```swift
   struct ContentView: View {
       var body: some View {
           Text(Greeting().greet())
           .padding()
       }
   }
   ```

3.  Android Studio iOS 실행 구성을 사용하여 앱을 실행하여 결과를 확인합니다:

   ![Greeting from the shared module](xcode-iphone-hello.png){width="300"}

4.  `ContentView.swift` 파일의 코드를 다시 업데이트하여 공유 모듈의 비즈니스 로직을 사용하여 애플리케이션 UI를 렌더링합니다:

   ```kotlin
   
   ```

5.  `simpleLoginIOSApp.swift` 파일에서 `sharedKit` 모듈을 임포트하고 `ContentView()` 함수의 인수를 지정합니다:

    ```swift
    import SwiftUI
    import sharedKit
    
    @main
    struct SimpleLoginIOSApp: App {
        var body: some Scene {
            WindowGroup {
                ContentView(viewModel: .init(loginRepository: LoginRepository(dataSource: LoginDataSource()), loginValidator: LoginDataValidator()))
            }
        }
    }
    ```

6.  iOS 실행 구성을 다시 실행하여 iOS 앱이 로그인 양식을 표시하는지 확인합니다.
7.  사용자 이름으로 "Jane"을, 비밀번호로 "password"를 입력합니다.
8.  [이전에 통합을 설정했듯이](#configure-the-ios-project-to-use-a-kmp-framework),
    iOS 앱은 공통 코드를 사용하여 입력을 검증합니다:

   ![Simple login application](xcode-iphone-login.png){width="300"}

## 결과를 즐기세요 – 로직을 한 번만 업데이트하세요

이제 애플리케이션은 크로스 플랫폼입니다. `shared` 모듈의 비즈니스 로직을 업데이트하고 안드로이드와 iOS 모두에서 결과를 볼 수 있습니다.

1.  사용자 비밀번호에 대한 유효성 검사 로직을 변경합니다: "password"는 유효한 옵션이 되어서는 안 됩니다.
    이렇게 하려면 `LoginDataValidator` 클래스의 `checkPassword()` 함수를 업데이트합니다
    (빨리 찾으려면 <shortcut>Shift</shortcut> 키를 두 번 누른 다음 클래스 이름을 붙여넣고 **Classes** 탭으로 전환하세요):

   ```kotlin
   package com.jetbrains.simplelogin.shared.data
   
   class LoginDataValidator {
   //...
       fun checkPassword(password: String): Result {
           return when {
               password.length < 5 -> Result.Error("Password must be >5 characters")
               password.lowercase() == "password" -> Result.Error("Password shouldn't be \"password\"")
               else -> Result.Success
           }
       }
   //...
   }
   ```

2.  Android Studio에서 iOS와 안드로이드 애플리케이션을 모두 실행하여 변경 사항을 확인합니다:

   ![Android and iOS applications password error](android-iphone-password-error.png){width="600"}

이 튜토리얼의 [최종 코드](https://github.com/Kotlin/kmp-integration-sample/tree/final)를 검토할 수 있습니다.

## 무엇을 더 공유할 수 있을까요?

애플리케이션의 비즈니스 로직을 공유했지만, 애플리케이션의 다른 레이어도 공유할 수 있습니다.
예를 들어, `ViewModel` 클래스 코드는 [안드로이드](https://github.com/Kotlin/kmp-integration-sample/blob/final/app/src/main/java/com/jetbrains/simplelogin/androidapp/ui/login/LoginViewModel.kt)와
[iOS 애플리케이션](https://github.com/Kotlin/kmp-integration-sample/blob/final/iosApp/SimpleLoginIOS/ContentView.swift#L84)에서 거의 동일하며,
모바일 애플리케이션이 동일한 프레젠테이션 레이어를 가져야 한다면 공유할 수 있습니다.

## 다음 단계는?

안드로이드 애플리케이션을 크로스 플랫폼으로 만든 후, 다음으로 진행할 수 있습니다:

*   [멀티플랫폼 라이브러리 종속성 추가](multiplatform-add-dependencies.md)
*   [안드로이드 종속성 추가](multiplatform-android-dependencies.md)
*   [iOS 종속성 추가](multiplatform-ios-dependencies.md)

Compose Multiplatform을 사용하여 모든 플랫폼에서 통합된 UI를 만들 수 있습니다:

*   [Compose Multiplatform 및 Jetpack Compose에 대해 알아보기](compose-multiplatform-and-jetpack-compose.md)
*   [Compose Multiplatform에 사용 가능한 리소스 탐색](compose-multiplatform-resources.md)
*   [공유 로직과 UI로 앱 생성](compose-multiplatform-create-first-app.md)

커뮤니티 리소스도 확인할 수 있습니다:

*   [비디오: 안드로이드 프로젝트를 Kotlin Multiplatform로 마이그레이션하는 방법](https://www.youtube.com/watch?v=vb-Pt8SdfEE&t=1s)
*   [비디오: Kotlin JVM 코드를 Kotlin Multiplatform용으로 준비하는 3가지 방법](https://www.youtube.com/watch?v=X6ckI1JWjqo)