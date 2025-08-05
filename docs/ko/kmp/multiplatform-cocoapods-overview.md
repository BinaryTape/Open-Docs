[//]: # (title: CocoaPods 개요 및 설정)

<tldr>
   이것은 로컬 통합 방법입니다. 다음과 같은 경우에 유용합니다:<br/>

   * CocoaPods를 사용하는 iOS 프로젝트와 함께 모노 리포지토리(mono repository)를 설정한 경우.
   * Kotlin Multiplatform 프로젝트에 CocoaPods 의존성이 있는 경우.<br/>

   [자신에게 가장 적합한 통합 방법 선택하기](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native는 [CocoaPods 의존성 관리자](https://cocoapods.org/)와 통합 기능을 제공합니다. Pod 라이브러리에 대한 의존성을 추가할 수 있을 뿐만 아니라, Kotlin 프로젝트를 CocoaPods 의존성으로 사용할 수도 있습니다.

IntelliJ IDEA 또는 Android Studio에서 Pod 의존성을 직접 관리할 수 있으며, 코드 하이라이팅 및 자동 완성 같은 모든 추가 기능을 활용할 수 있습니다. Xcode로 전환할 필요 없이 Gradle로 전체 Kotlin 프로젝트를 빌드할 수 있습니다.

Swift/Objective-C 코드를 변경하거나 Apple 시뮬레이터 또는 기기에서 애플리케이션을 실행하려면 Xcode만 필요합니다. Xcode와 함께 작업하려면 먼저 [Podfile을 업데이트](#update-podfile-for-xcode)하세요.

## CocoaPods 작업을 위한 환경 설정

선택한 설치 도구를 사용하여 [CocoaPods 의존성 관리자](https://cocoapods.org/)를 설치합니다:

<tabs>
<tab title="RVM">

1. 아직 설치하지 않았다면 [RVM](https://rvm.io/rvm/install)을 설치합니다.
2. Ruby를 설치합니다. 특정 버전을 선택할 수 있습니다:

    ```bash
    rvm install ruby 3.0.0
    ```

3. CocoaPods를 설치합니다:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="Rbenv">

1. 아직 설치하지 않았다면 [GitHub에서 rbenv](https://github.com/rbenv/rbenv#installation)를 설치합니다.
2. Ruby를 설치합니다. 특정 버전을 선택할 수 있습니다:

    ```bash
    rbenv install 3.0.0
    ```

3. 특정 디렉터리에 대한 로컬 또는 전체 시스템에 대한 전역으로 Ruby 버전을 설정합니다:

    ```bash
    rbenv global 3.0.0
    ```
    
4. CocoaPods를 설치합니다:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="기본 Ruby">

> 이 설치 방식은 Apple M 칩이 탑재된 기기에서는 작동하지 않습니다. CocoaPods 작업을 위한 환경을 설정하려면 다른 도구를 사용하세요.
>
{style="note"}

macOS에서 기본으로 제공되는 Ruby를 사용하여 CocoaPods 의존성 관리자를 설치할 수 있습니다:

```bash
sudo gem install cocoapods
```

</tab>
<tab title="Homebrew">

> Homebrew를 사용한 CocoaPods 설치는 호환성 문제를 야기할 수 있습니다.
>
> CocoaPods를 설치할 때 Homebrew는 Xcode와 함께 작업하는 데 필요한 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem도 설치합니다.
> 그러나 Homebrew로는 업데이트할 수 없으며, 설치된 Xcodeproj가 최신 Xcode 버전을 아직 지원하지 않는 경우 Pod 설치 시 오류가 발생할 수 있습니다. 이러한 경우 다른 도구를 사용하여 CocoaPods를 설치해 보세요.
>
{style="warning"}

1. 아직 설치하지 않았다면 [Homebrew](https://brew.sh/)를 설치합니다.
2. CocoaPods를 설치합니다:

    ```bash
    brew install cocoapods
    ```

</tab>
</tabs>

설치 중에 문제가 발생하면 [발생 가능한 문제 및 해결책](#possible-issues-and-solutions) 섹션을 확인하세요.

## 프로젝트 생성

환경이 설정되면 새 Kotlin Multiplatform 프로젝트를 생성할 수 있습니다. 이를 위해 Kotlin Multiplatform 웹 위자드 또는 Android Studio용 Kotlin Multiplatform 플러그인을 사용하세요.

### 웹 위자드 사용

웹 위자드를 사용하여 프로젝트를 생성하고 CocoaPods 통합을 구성하려면:

1. [Kotlin Multiplatform 위자드](https://kmp.jetbrains.com)를 열고 프로젝트의 타겟 플랫폼을 선택합니다.
2. **Download** 버튼을 클릭하고 다운로드한 아카이브의 압축을 해제합니다.
3. Android Studio에서 메뉴에서 **File | Open**을 선택합니다.
4. 압축 해제된 프로젝트 폴더로 이동한 다음 **Open**을 클릭합니다.
5. Kotlin CocoaPods Gradle 플러그인을 버전 카탈로그에 추가합니다. `gradle/libs.versions.toml` 파일의 `[plugins]` 블록에 다음 선언을 추가합니다:
 
   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```
   
6. 프로젝트의 루트 `build.gradle.kts` 파일로 이동하여 `plugins {}` 블록에 다음 별칭을 추가합니다:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

7. CocoaPods를 통합하려는 모듈(예: `composeApp` 모듈)을 열고 `plugins {}` 블록에 다음 별칭을 추가합니다:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

이제 [Kotlin Multiplatform 프로젝트에서 CocoaPods를 구성](#configure-the-project)할 준비가 되었습니다.

### Android Studio에서

Android Studio에서 CocoaPods 통합과 함께 프로젝트를 생성하려면:

1. Android Studio에 [Kotlin Multiplatform 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)을 설치합니다.
2. Android Studio에서 메뉴에서 **File** | **New** | **New Project**를 선택합니다.
3. 프로젝트 템플릿 목록에서 **Kotlin Multiplatform App**을 선택한 다음 **Next**를 클릭합니다.
4. 애플리케이션 이름을 지정하고 **Next**를 클릭합니다.
5. iOS 프레임워크 배포 옵션으로 **CocoaPods Dependency Manager**를 선택합니다.

   ![Kotlin Multiplatform 플러그인과 함께하는 Android Studio 위자드](as-project-wizard.png){width=700}

6. 다른 모든 옵션은 기본값으로 유지합니다. **Finish**를 클릭합니다.

   플러그인이 CocoaPods 통합이 설정된 프로젝트를 자동으로 생성합니다.

## 프로젝트 구성

멀티플랫폼 프로젝트에서 Kotlin CocoaPods Gradle 플러그인을 구성하려면:

1. 프로젝트의 공유 모듈(shared module) `build.gradle(.kts)`에 CocoaPods 플러그인과 Kotlin Multiplatform 플러그인을 적용합니다.

   > [웹 위자드](#using-web-wizard) 또는 [Android Studio용 Kotlin Multiplatform 플러그인](#in-android-studio)을 사용하여 프로젝트를 생성했다면 이 단계를 건너뛰세요.
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. `cocoapods` 블록에서 Podspec 파일의 `version`, `summary`, `homepage`, `baseName`을 구성합니다:
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // Required properties
            // Specify the required Pod version here
            // Otherwise, the Gradle project version is used
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // Optional properties
            // Configure the Pod name here instead of changing the Gradle project name
            name = "MyCocoaPod"

            framework {
                // Required properties              
                // Framework name configuration. Use this property instead of deprecated 'frameworkName'
                baseName = "MyFramework"
                
                // Optional properties
                // Specify the framework linking type. It's dynamic by default. 
                isStatic = false
                // Dependency export
                // Uncomment and specify another project module if you have one:
                // export(project(":<your other KMP module>"))
                transitiveExport = false // This is default.
            }

            // Maps custom Xcode configuration to NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > Kotlin DSL의 전체 문법은 [Kotlin Gradle 플러그인 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)에서 확인할 수 있습니다.
    >
    {style="note"}
    
3. 프로젝트를 다시 임포트하려면 IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나 (Android Studio에서는 **File** | **Sync Project with Gradle Files**).
4. Xcode 빌드 중 호환성 문제를 피하려면 [Gradle 래퍼](https://docs.gradle.org/current/userguide/gradle_wrapper.html)를 생성합니다.

적용되면 CocoaPods 플러그인은 다음을 수행합니다:

* 모든 macOS, iOS, tvOS, watchOS 타겟에 대해 `debug` 및 `release` 프레임워크를 출력 바이너리로 추가합니다.
* 프로젝트에 대한 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 파일을 생성하는 `podspec` 태스크를 생성합니다.

`Podspec` 파일에는 출력 프레임워크의 경로와 Xcode 프로젝트 빌드 프로세스 중 이 프레임워크의 빌드를 자동화하는 스크립트 단계가 포함됩니다.

## Xcode용 Podfile 업데이트

Kotlin 프로젝트를 Xcode 프로젝트로 임포트하려면:

1. Kotlin 프로젝트의 iOS 부분에서 Podfile을 변경합니다:

   * 프로젝트에 Git, HTTP 또는 사용자 정의 Podspec 저장소 의존성이 있는 경우, Podfile에서 Podspec에 대한 경로를 지정합니다.

     예를 들어, `podspecWithFilesExample`에 대한 의존성을 추가하는 경우 Podfile에 Podspec 경로를 선언합니다:

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path`에는 Pod에 대한 파일 경로가 포함되어야 합니다.

   * 사용자 정의 Podspec 저장소에서 라이브러리를 추가하는 경우, Podfile 시작 부분에 스펙의 [위치](https://guides.cocoapods.org/syntax/podfile.html#source)를 지정합니다:

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. 프로젝트 디렉터리에서 `pod install`을 실행합니다.

   `pod install`을 처음 실행하면 `.xcworkspace` 파일이 생성됩니다. 이 파일에는 원래의 `.xcodeproj`와 CocoaPods 프로젝트가 포함됩니다.
3. 기존 `.xcodeproj`를 닫고 대신 새 `.xcworkspace` 파일을 엽니다. 이렇게 하면 프로젝트 의존성 문제를 피할 수 있습니다.
4. 프로젝트를 다시 임포트하려면 IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나 (Android Studio에서는 **File** | **Sync Project with Gradle Files**).

Podfile에서 이러한 변경을 하지 않으면 `podInstall` 태스크가 실패하고 CocoaPods 플러그인이 로그에 오류 메시지를 표시합니다.

## 발생 가능한 문제 및 해결책

### CocoaPods 설치 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 설치

CocoaPods는 Ruby로 빌드되었으며, macOS에서 기본으로 제공되는 Ruby로 설치할 수 있습니다. Ruby 1.9 이상에는 [CocoaPods 의존성 관리자](https://guides.cocoapods.org/using/getting-started.html#installation) 설치를 돕는 RubyGems 패키지 관리 프레임워크가 내장되어 있습니다.

CocoaPods를 설치하고 작동시키는 데 문제가 발생하면 [이 가이드](https://www.ruby-lang.org/en/documentation/installation/)를 따라 Ruby를 설치하거나 [RubyGems 웹사이트](https://rubygems.org/pages/download/)를 참조하여 프레임워크를 설치하세요.

#### 버전 호환성

최신 Kotlin 버전을 사용하는 것을 권장합니다. 현재 버전이 1.7.0 이전인 경우, 추가적으로 [`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") 플러그인을 설치해야 합니다.

그러나 `cocoapods-generate`는 Ruby 3.0.0 이상과 호환되지 않습니다. 이 경우, Ruby를 다운그레이드하거나 Kotlin을 1.7.0 이상으로 업그레이드하세요.

### Xcode 사용 시 빌드 오류 {initial-collapse-state="collapsed" collapsible="true"}

CocoaPods 설치의 일부 변형은 Xcode에서 빌드 오류를 유발할 수 있습니다. 일반적으로 Kotlin Gradle 플러그인은 `PATH`에서 `pod` 실행 파일을 찾지만, 환경에 따라 일관성이 없을 수 있습니다.

CocoaPods 설치 경로를 명시적으로 설정하려면, 프로젝트의 `local.properties` 파일에 수동으로 추가하거나 쉘 명령어를 사용하여 추가할 수 있습니다:

* 코드 편집기를 사용하는 경우, `local.properties` 파일에 다음 줄을 추가합니다:

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 터미널을 사용하는 경우, 다음 명령어를 실행합니다:

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 모듈 또는 프레임워크를 찾을 수 없음 {initial-collapse-state="collapsed" collapsible="true"}

Pod를 설치할 때, [C 상호운용(C interop)](https://kotlinlang.org/docs/native-c-interop.html) 문제와 관련된 `module 'SomeSDK' not found` 또는 `framework 'SomeFramework' not found` 오류가 발생할 수 있습니다. 이러한 오류를 해결하려면 다음 해결책을 시도해 보세요:

#### 패키지 업데이트

설치 도구 및 설치된 패키지(gem)를 업데이트합니다:

<tabs>
<tab title="RVM">

1. RVM을 업데이트합니다:

   ```bash
   rvm get stable
   ```

2. Ruby의 패키지 관리자인 RubyGems를 업데이트합니다:

    ```bash
    gem update --system
    ```

3. 설치된 모든 gem을 최신 버전으로 업그레이드합니다:

    ```bash
    gem update
    ```

</tab>
<tab title="Rbenv">

1. Rbenv를 업데이트합니다:

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. Ruby의 패키지 관리자인 RubyGems를 업데이트합니다:

    ```bash
    gem update --system
    ```

3. 설치된 모든 gem을 최신 버전으로 업그레이드합니다:

    ```bash
    gem update
    ```

</tab>
<tab title="Homebrew">

1. Homebrew 패키지 관리자를 업데이트합니다: 

   ```bash
   brew update
   ```

2. 설치된 모든 패키지를 최신 버전으로 업그레이드합니다:

   ```bash
   brew upgrade
   ````

</tab>
</tabs>

#### 프레임워크 이름 지정

1. 다운로드된 Pod 디렉터리 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`에서 `module.modulemap` 파일을 찾아봅니다.
2. 모듈 내부의 프레임워크 이름(예: `SDWebImageMapKit {}`)을 확인합니다. 프레임워크 이름이 Pod 이름과 일치하지 않으면 명시적으로 지정합니다:

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 헤더 지정

`pod("NearbyMessages")`와 같이 Pod에 `.modulemap` 파일이 포함되어 있지 않은 경우, 메인 헤더를 명시적으로 지정합니다:

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

더 자세한 정보는 [CocoaPods 문서](https://guides.cocoapods.org/)를 확인하세요. 아무것도 작동하지 않고 이 오류가 계속 발생하면 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에 문제를 보고하세요.

### Rsync 오류 {initial-collapse-state="collapsed" collapsible="true"}

`rsync error: some files could not be transferred` 오류가 발생할 수 있습니다. 이는 Xcode의 애플리케이션 타겟에서 사용자 스크립트 샌드박싱이 활성화된 경우 발생하는 [알려진 문제](https://github.com/CocoaPods/CocoaPods/issues/11946)입니다.

이 문제를 해결하려면:

1. 애플리케이션 타겟에서 사용자 스크립트 샌드박싱을 비활성화합니다:

   ![CocoaPods 샌드박싱 비활성화](disable-sandboxing-cocoapods.png){width=700}

2. 샌드박스 처리되었을 수 있는 Gradle 데몬 프로세스를 중지합니다:

    ```shell
    ./gradlew --stop
    ```

## 다음 단계

* [Kotlin 프로젝트에 Pod 라이브러리 의존성 추가](multiplatform-cocoapods-libraries.md)
* [Kotlin 프로젝트와 Xcode 프로젝트 간 의존성 설정](multiplatform-cocoapods-xcode.md)
* [CocoaPods Gradle 플러그인 DSL 참조 전체 보기](multiplatform-cocoapods-dsl-reference.md)