[//]: # (title: CocoaPods 개요 및 설정)

<tldr>
   이것은 로컬 통합 방식입니다. 다음과 같은 경우에 적합합니다:<br/>

   * CocoaPods를 사용하는 iOS 프로젝트와 함께 모노레포(mono repository) 환경을 구성한 경우.
   * Kotlin 멀티플랫폼 프로젝트에 CocoaPods 의존성이 있는 경우.<br/>

   [본인에게 가장 적합한 통합 방식을 선택하세요](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native는 [CocoaPods 의존성 관리자(dependency manager)](https://cocoapods.org/)와의 통합을 지원합니다. Pod 라이브러리에 대한 의존성을 추가하거나 Kotlin 프로젝트를 CocoaPods 의존성으로 사용할 수 있습니다.

> CocoaPods 통합 방식은 [직접 통합(direct integration)](multiplatform-direct-integration.md)에 사용되는 `embedAndSignAppleFrameworkForXcode` 메커니즘과 함께 사용할 수 없습니다.
>
{style="warning"}

IntelliJ IDEA 또는 Android Studio에서 직접 Pod 의존성을 관리하고 코드 하이라이팅 및 자동 완성 같은 추가 기능을 활용할 수 있습니다. Xcode로 전환하지 않고도 Gradle을 통해 전체 Kotlin 프로젝트를 빌드할 수 있습니다. 

Swift/Objective-C 코드를 수정하거나 Apple 시뮬레이터 또는 기기에서 애플리케이션을 실행하려는 경우에만 Xcode가 필요합니다. Xcode에서 작업하려면 먼저 [Podfile을 업데이트](#update-podfile-for-xcode)하세요.

## CocoaPods 작업을 위한 환경 설정

원하는 설치 도구를 사용하여 [CocoaPods 의존성 관리자](https://cocoapods.org/)를 설치하세요:

<Tabs>
<TabItem title="RVM">

1. 아직 설치되어 있지 않다면 [RVM](https://rvm.io/rvm/install)을 설치하세요.
2. Ruby를 설치합니다. 특정 버전을 선택할 수 있습니다:

    ```bash
    rvm install ruby %rubyVersion%
    ```

3. CocoaPods를 설치합니다:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Rbenv">

1. 아직 설치되어 있지 않다면 [GitHub에서 rbenv](https://github.com/rbenv/rbenv#installation)를 설치하세요.
2. Ruby를 설치합니다. 특정 버전을 선택할 수 있습니다:

    ```bash
    rbenv install %rubyVersion%
    ```

3. Ruby 버전을 특정 디렉터리에 대한 로컬(local) 또는 전체 머신에 대한 글로벌(global)로 설정하세요:

    ```bash
    rbenv global %rubyVersion%
    ```
    
4. CocoaPods를 설치합니다:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Default Ruby">

> 이 설치 방법은 Apple M 칩이 탑재된 기기에서는 작동하지 않습니다. CocoaPods 작업을 위한 환경을 설정하려면 다른 도구를 사용하세요.
>
{style="note"}

macOS에서 기본적으로 사용할 수 있는 Ruby를 통해 CocoaPods 의존성 관리자를 설치할 수 있습니다:

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem title="Homebrew">

> Homebrew를 통한 CocoaPods 설치는 호환성 문제를 일으킬 수 있습니다.
>
> CocoaPods를 설치할 때 Homebrew는 Xcode 작업에 필요한 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem도 함께 설치합니다.
> 하지만 이는 Homebrew로 업데이트할 수 없으며, 설치된 Xcodeproj가 최신 Xcode 버전을 아직 지원하지 않는 경우 Pod 설치 시 오류가 발생할 수 있습니다. 이런 경우 다른 도구를 사용하여 CocoaPods를 설치해 보세요.
>
{style="warning"}

1. 아직 설치되어 있지 않다면 [Homebrew](https://brew.sh/)를 설치하세요.
2. CocoaPods를 설치합니다:

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

설치 중 문제가 발생하면 [발생 가능한 문제 및 해결 방법](#possible-issues-and-solutions) 섹션을 확인하세요.

## 프로젝트 생성

CocoaPods 환경이 설정되면 Kotlin 멀티플랫폼 프로젝트가 Pod과 연동되도록 구성할 수 있습니다. 다음 단계는 새로 생성된 프로젝트에서의 구성 방법을 보여줍니다:

1. [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 또는 [Kotlin Multiplatform 웹 위저드](https://kmp.jetbrains.com)를 사용하여 Android 및 iOS용 새 프로젝트를 생성하세요.
   웹 위저드를 사용하는 경우 압축을 풀고 IDE에서 프로젝트를 가져오세요(import).
2. `gradle/libs.versions.toml` 파일의 `[plugins]` 블록에 Kotlin CocoaPods Gradle 플러그인을 추가하세요:

   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. 프로젝트의 루트 `build.gradle.kts` 파일로 이동하여 `plugins {}` 블록에 다음 별칭(alias)을 추가하세요:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. CocoaPods를 통합하려는 모듈(예: `sharedLogic` 모듈)을 열고 `build.gradle.kts` 파일의 `plugins {}` 블록에 다음 별칭을 추가하세요:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

이제 [Kotlin 멀티플랫폼 프로젝트에서 CocoaPods를 구성](#configure-the-project)할 준비가 되었습니다.

## 프로젝트 구성

멀티플랫폼 프로젝트에서 Kotlin CocoaPods Gradle 플러그인을 구성하려면:

1. 프로젝트의 공유 모듈(shared module) `build.gradle(.kts)`에서 Kotlin 멀티플랫폼 플러그인과 함께 CocoaPods 플러그인을 적용하세요.

   > [IDE 플러그인 또는 웹 위저드](#create-a-project)로 프로젝트를 생성했다면 이 단계는 건너뛰세요.
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. `cocoapods` 블록에서 Podspec 파일의 `version`, `summary`, `homepage`, `baseName`을 구성하세요:
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // 필수 속성
            // 여기에 필요한 Pod 버전을 지정하세요.
            // 지정하지 않으면 Gradle 프로젝트 버전이 사용됩니다.
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // 선택적 속성
            // Gradle 프로젝트 이름을 변경하는 대신 여기서 Pod 이름을 구성하세요.
            name = "MyCocoaPod"

            framework {
                // 필수 속성              
                // 프레임워크 이름 구성. 더 이상 사용되지 않는 'frameworkName' 대신 이 속성을 사용하세요.
                baseName = "MyFramework"
                
                // 선택적 속성
                // 프레임워크 연결 유형을 지정합니다. 기본값은 dynamic입니다. 
                isStatic = false
                // 의존성 내보내기(Export)
                // 다른 프로젝트 모듈이 있는 경우 주석을 해제하고 지정하세요:
                // export(project(":<your other KMP module>"))
                transitiveExport = false // 기본값입니다.
            }

            // 커스텀 Xcode 구성을 NativeBuildType에 매핑합니다.
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > Kotlin DSL의 전체 구문은 [Kotlin Gradle 플러그인 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)에서 확인할 수 있습니다.
    >
    {style="note"}
    
3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**(또는 Android Studio에서 **File** | **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져오세요.
4. Xcode 빌드 중 호환성 문제를 방지하려면 [Gradle 래퍼(wrapper)](https://docs.gradle.org/current/userguide/gradle_wrapper.html)를 생성하세요.

플러그인을 적용하면 CocoaPods 플러그인은 다음을 수행합니다:

* 모든 macOS, iOS, tvOS, watchOS 타겟에 대해 `debug` 및 `release` 프레임워크를 출력 바이너리로 추가합니다.
* 프로젝트에 대한 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 파일을 생성하는 `podspec` 태스크를 만듭니다.

`Podspec` 파일에는 출력 프레임워크에 대한 경로와 Xcode 프로젝트의 빌드 프로세스 중에 이 프레임워크를 자동으로 빌드하는 스크립트 단계가 포함됩니다.

## Xcode를 위한 Podfile 업데이트

Kotlin 프로젝트를 Xcode 프로젝트로 가져오려는 경우:

1. Kotlin 프로젝트의 iOS 부분에서 Podfile을 다음과 같이 수정하세요:

   * 프로젝트에 Git, HTTP 또는 커스텀 Podspec 저장소 의존성이 있는 경우 Podfile에 Podspec 경로를 지정하세요.

     예를 들어 `podspecWithFilesExample`에 대한 의존성을 추가하는 경우 Podfile에 해당 Podspec의 경로를 선언합니다:

     ```ruby
     target 'ios-app' do
        # ... 기타 의존성 ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path`에는 Pod의 파일 경로가 포함되어야 합니다.

   * 커스텀 Podspec 저장소에서 라이브러리를 추가하는 경우 Podfile 시작 부분에 spec의 [위치](https://guides.cocoapods.org/syntax/podfile.html#source)를 지정하세요:

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... 기타 의존성 ...
         pod 'example'
     end
     ```

2. 프로젝트 디렉터리에서 `pod install`을 실행하세요.

   `pod install`을 처음 실행하면 `.xcworkspace` 파일이 생성됩니다. 이 파일에는 원래의 `.xcodeproj`와 CocoaPods 프로젝트가 포함됩니다.
3. 기존 `.xcodeproj`를 닫고 대신 새로운 `.xcworkspace` 파일을 여세요. 이렇게 하면 프로젝트 의존성 문제를 피할 수 있습니다.
4. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**(또는 Android Studio에서 **File** | **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져오세요.

Podfile에서 이러한 변경을 수행하지 않으면 `podInstall` 태스크가 실패하고 CocoaPods 플러그인이 로그에 오류 메시지를 표시합니다.

## 발생 가능한 문제 및 해결 방법

### CocoaPods 설치 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 설치

CocoaPods는 Ruby로 구축되었으며, macOS에서 기본적으로 제공되는 Ruby로 설치할 수 있습니다. Ruby 1.9 이상에는 [CocoaPods 의존성 관리자](https://guides.cocoapods.org/using/getting-started.html#installation) 설치를 도와주는 RubyGems 패키지 관리 프레임워크가 내장되어 있습니다.

CocoaPods를 설치하고 실행하는 데 문제가 있는 경우, [이 가이드](https://www.ruby-lang.org/en/documentation/installation/)를 따라 Ruby를 설치하거나 [RubyGems 웹사이트](https://rubygems.org/pages/download/)를 참조하여 프레임워크를 설치하세요.

#### 버전 호환성

최신 버전의 Kotlin을 사용하는 것이 좋습니다. 이 CocoaPods 설정을 위한 최소 요구 버전은 1.7.0입니다.

### Xcode 사용 시 빌드 오류 {initial-collapse-state="collapsed" collapsible="true"}

CocoaPods 설치 방식에 따라 Xcode에서 빌드 오류가 발생할 수 있습니다. 일반적으로 Kotlin Gradle 플러그인은 `PATH`에서 `pod` 실행 파일을 찾아내지만, 이는 환경에 따라 일관되지 않을 수 있습니다.

CocoaPods 설치 경로를 명시적으로 설정하려면 프로젝트의 `local.properties` 파일에 수동으로 추가하거나 셸 명령을 사용하여 추가할 수 있습니다:

* 코드 에디터를 사용하는 경우 `local.properties` 파일에 다음 줄을 추가하세요:

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 터미널을 사용하는 경우 다음 명령을 실행하세요:

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 모듈 또는 프레임워크를 찾을 수 없음 {initial-collapse-state="collapsed" collapsible="true"}

Pod 설치 시 [C interop](https://kotlinlang.org/docs/native-c-interop.html) 이슈와 관련된 `module 'SomeSDK' not found` 또는 `framework 'SomeFramework' not found` 오류가 발생할 수 있습니다. 이러한 오류를 해결하려면 다음 방법들을 시도해 보세요:

#### 패키지 업데이트

설치 도구와 설치된 패키지(gems)를 업데이트하세요:

<Tabs>
<TabItem title="RVM">

1. RVM 업데이트:

   ```bash
   rvm get stable
   ```

2. Ruby 패키지 관리자인 RubyGems 업데이트:

    ```bash
    gem update --system
    ```

3. 설치된 모든 gem을 최신 버전으로 업그레이드:

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Rbenv">

1. Rbenv 업데이트:

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. Ruby 패키지 관리자인 RubyGems 업데이트:

    ```bash
    gem update --system
    ```

3. 설치된 모든 gem을 최신 버전으로 업그레이드:

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Homebrew">

1. Homebrew 패키지 관리자 업데이트: 

   ```bash
   brew update
   ```

2. 설치된 모든 패키지를 최신 버전으로 업그레이드:

   ```bash
   brew upgrade
   ````

</TabItem>
</Tabs>

#### 프레임워크 이름 지정 

1. 다운로드된 Pod 디렉터리 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`에서 `module.modulemap` 파일을 찾습니다.
2. 모듈 내부의 프레임워크 이름(예: `SDWebImageMapKit {}`)을 확인합니다. 프레임워크 이름이 Pod 이름과 일치하지 않으면 명시적으로 지정하세요:

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 헤더 지정

`pod("NearbyMessages")`와 같이 Pod에 `.modulemap` 파일이 포함되어 있지 않은 경우, 메인 헤더를 명시적으로 지정하세요:

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

더 자세한 정보는 [CocoaPods 문서](https://guides.cocoapods.org/)를 확인하세요. 모든 방법을 시도해도 오류가 계속 발생하면 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에 이슈를 제보해 주세요.

### Rsync 오류 {initial-collapse-state="collapsed" collapsible="true"}

`rsync error: some files could not be transferred` 오류가 발생할 수 있습니다. 이는 Xcode의 애플리케이션 타겟에서 사용자 스크립트의 샌드박싱(sandboxing)이 활성화되어 있을 때 발생하는 [알려진 이슈](https://github.com/CocoaPods/CocoaPods/issues/11946)입니다.

이 문제를 해결하려면:

1. 애플리케이션 타겟에서 사용자 스크립트의 샌드박싱을 비활성화하세요:

   ![CocoaPods 샌드박싱 비활성화](disable-sandboxing-cocoapods.png){width=700}

2. 샌드박싱되었을 수 있는 Gradle 데몬 프로세스를 중지합니다:

    ```shell
    ./gradlew --stop
    ```

## 다음 단계

* [Kotlin 프로젝트에서 Pod 라이브러리에 대한 의존성 추가하기](multiplatform-cocoapods-libraries.md)
* [Kotlin 프로젝트와 Xcode 프로젝트 간의 의존성 설정하기](multiplatform-cocoapods-xcode.md)
* [CocoaPods Gradle 플러그인 DSL 전체 레퍼런스 보기](multiplatform-cocoapods-dsl-reference.md)