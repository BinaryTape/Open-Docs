[//]: # (title: CocoaPods 개요 및 설정)

<tldr>
   이것은 로컬 통합 방식입니다. 다음 경우에 유용합니다:<br/>

   * CocoaPods를 사용하는 iOS 프로젝트와 함께 모노 리포지토리(mono repository)를 설정한 경우.
   * Kotlin Multiplatform 프로젝트에 CocoaPods 종속성이 있는 경우.<br/>

   [가장 적합한 통합 방식을 선택하세요](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native는 [CocoaPods 종속성 관리자](https://cocoapods.org/)와의 통합을 제공합니다. Pod 라이브러리에 대한 종속성을 추가할 수 있으며, Kotlin 프로젝트를 CocoaPods 종속성으로 사용할 수도 있습니다.

IntelliJ IDEA 또는 Android Studio에서 직접 Pod 종속성을 관리하고 코드 하이라이팅 및 자동 완성 등 모든 추가 기능을 활용할 수 있습니다. Xcode로 전환할 필요 없이 Gradle을 사용하여 전체 Kotlin 프로젝트를 빌드할 수 있습니다.

Swift/Objective-C 코드를 변경하거나 Apple 시뮬레이터 또는 기기에서 애플리케이션을 실행하려면 Xcode가 필요합니다. Xcode에서 작업하려면 먼저 [Podfile을 업데이트하세요](#update-podfile-for-xcode).

## CocoaPods 작업을 위한 환경 설정

원하는 설치 도구를 사용하여 [CocoaPods 종속성 관리자](https://cocoapods.org/)를 설치하세요:

<Tabs>
<TabItem title="RVM">

1. 아직 RVM이 없다면 [RVM](https://rvm.io/rvm/install)을 설치하세요.
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

1. 아직 rbenv가 없다면 [GitHub에서 rbenv](https://github.com/rbenv/rbenv#installation)를 설치하세요.
2. Ruby를 설치합니다. 특정 버전을 선택할 수 있습니다:

    ```bash
    rbenv install %rubyVersion%
    ```

3. 특정 디렉토리에는 로컬 Ruby 버전을, 전체 머신에는 전역 Ruby 버전을 설정합니다:

    ```bash
    rbenv global %rubyVersion%
    ```
    
4. CocoaPods를 설치합니다:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Default Ruby">

> 이 설치 방식은 Apple M 칩을 탑재한 기기에서는 작동하지 않습니다. CocoaPods와 함께 작업할 환경을 설정하려면 다른 도구를 사용하세요.
>
{style="note"}

macOS에 기본으로 제공되는 Ruby를 사용하여 CocoaPods 종속성 관리자를 설치할 수 있습니다:

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem title="Homebrew">

> Homebrew를 사용한 CocoaPods 설치는 호환성 문제를 일으킬 수 있습니다.
>
> CocoaPods를 설치할 때 Homebrew는 Xcode 작업에 필요한 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem도 설치합니다.
> 그러나 Homebrew로는 업데이트할 수 없으며, 설치된 Xcodeproj가 최신 Xcode 버전을 아직 지원하지 않으면 Pod 설치 시 오류가 발생합니다. 이런 경우, 다른 도구를 사용하여 CocoaPods를 설치해 보세요.
>
{style="warning"}

1. 아직 Homebrew가 없다면 [Homebrew](https://brew.sh/)를 설치하세요.
2. CocoaPods를 설치합니다:

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

설치 중 문제가 발생하면 [가능한 문제 및 해결 방법](#possible-issues-and-solutions) 섹션을 확인하세요.

## 프로젝트 생성

CocoaPods 환경이 설정되면 Pod와 함께 작동하도록 Kotlin Multiplatform 프로젝트를 구성할 수 있습니다. 다음 단계는 새로 생성된 프로젝트에서 구성을 보여줍니다:

1. [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 또는 [Kotlin Multiplatform 웹 위자드](https://kmp.jetbrains.com)를 사용하여 Android 및 iOS용 새 프로젝트를 생성합니다.
   웹 위자드를 사용하는 경우, 아카이브의 압축을 해제하고 IDE로 프로젝트를 임포트(import)합니다.
2. `gradle/libs.versions.toml` 파일의 `[plugins]` 블록에 Kotlin CocoaPods Gradle 플러그인을 추가합니다:

   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. 프로젝트의 루트 `build.gradle.kts` 파일로 이동하여 `plugins {}` 블록에 다음 alias를 추가합니다:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. CocoaPods를 통합하려는 모듈(예: `composeApp` 모듈)을 열고 `build.gradle.kts` 파일의 `plugins {}` 블록에 다음 alias를 추가합니다:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

이제 [Kotlin Multiplatform 프로젝트에서 CocoaPods를 구성할](#configure-the-project) 준비가 되었습니다.

## 프로젝트 구성

멀티플랫폼 프로젝트에서 Kotlin CocoaPods Gradle 플러그인을 구성하려면:

1. 프로젝트의 공유 모듈(shared module) `build.gradle(.kts)`에 Kotlin Multiplatform 플러그인뿐만 아니라 CocoaPods 플러그인도 적용합니다.

   > 이 단계는 [IDE 플러그인 또는 웹 위자드로 프로젝트를 생성했다면](#create-a-project) 건너뛰세요.
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
            // 필수 속성
            // 필요한 Pod 버전을 여기에 지정합니다
            // 그렇지 않으면 Gradle 프로젝트 버전이 사용됩니다
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // 선택적 속성
            // Gradle 프로젝트 이름 변경 대신 여기에 Pod 이름을 구성합니다
            name = "MyCocoaPod"

            framework {
                // 필수 속성              
                // 프레임워크 이름 구성. 더 이상 사용되지 않는 'frameworkName' 대신 이 속성을 사용합니다
                baseName = "MyFramework"
                
                // 선택적 속성
                // 프레임워크 연결 유형을 지정합니다. 기본적으로 동적입니다. 
                isStatic = false
                // 종속성 내보내기
                // 주석을 해제하고 다른 프로젝트 모듈이 있다면 지정합니다:
                // export(project(":<your other KMP module>"))
                transitiveExport = false // 이것이 기본값입니다.
            }

            // 사용자 지정 Xcode 구성을 NativeBuildType에 매핑합니다
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > Kotlin DSL의 전체 구문은 [Kotlin Gradle 플러그인 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)를 참조하세요.
    >
    {style="note"}
    
3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects** (또는 Android Studio에서 **File** | **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 임포트(re-import)합니다.
4. [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)를 생성합니다. Xcode 빌드 중 호환성 문제를 방지합니다.

적용하면 CocoaPods 플러그인은 다음을 수행합니다:

* 모든 macOS, iOS, tvOS, watchOS 대상에 대해 `debug` 및 `release` 프레임워크를 출력 바이너리로 추가합니다.
* 프로젝트용 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 파일을 생성하는 `podspec` 태스크를 생성합니다.

`Podspec` 파일에는 출력 프레임워크의 경로와 Xcode 프로젝트의 빌드 프로세스 중에 이 프레임워크 빌드를 자동화하는 스크립트 단계가 포함됩니다.

## Xcode용 Podfile 업데이트

Kotlin 프로젝트를 Xcode 프로젝트로 임포트(import)하려면:

1. Kotlin 프로젝트의 iOS 부분에서 Podfile을 변경합니다:

   * 프로젝트에 Git, HTTP 또는 사용자 지정 Podspec 저장소 종속성이 있는 경우, Podfile에 Podspec 경로를 지정합니다.

     예를 들어, `podspecWithFilesExample`에 종속성을 추가하는 경우, Podfile에 Podspec 경로를 선언합니다:

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path`에는 Pod의 파일 경로가 포함되어야 합니다.

   * 사용자 지정 Podspec 저장소에서 라이브러리를 추가하는 경우, Podfile 시작 부분에 spec의 [위치](https://guides.cocoapods.org/syntax/podfile.html#source)를 지정합니다:

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. 프로젝트 디렉토리에서 `pod install`을 실행합니다.

   `pod install`을 처음 실행하면 `.xcworkspace` 파일이 생성됩니다. 이 파일에는 원래의 `.xcodeproj`와 CocoaPods 프로젝트가 포함됩니다.
3. `.xcodeproj`를 닫고 대신 새 `.xcworkspace` 파일을 엽니다. 이렇게 하면 프로젝트 종속성 문제를 피할 수 있습니다.
4. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects** (또는 Android Studio에서 **File** | **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 임포트(re-import)합니다.

Podfile에서 이러한 변경 사항을 적용하지 않으면 `podInstall` 태스크가 실패하고 CocoaPods 플러그인이 로그에 오류 메시지를 표시합니다.

## 가능한 문제 및 해결 방법

### CocoaPods 설치 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 설치

CocoaPods는 Ruby로 빌드되었으며, macOS에 기본으로 제공되는 Ruby를 사용하여 설치할 수 있습니다. Ruby 1.9 이상 버전에는 [CocoaPods 종속성 관리자](https://guides.cocoapods.org/using/getting-started.html#installation) 설치를 돕는 RubyGems 패키지 관리 프레임워크가 내장되어 있습니다.

CocoaPods 설치 및 작동에 문제가 발생하면 [이 가이드](https://www.ruby-lang.org/en/documentation/installation/)를 따라 Ruby를 설치하거나 [RubyGems 웹사이트](https://rubygems.org/pages/download/)를 참조하여 프레임워크를 설치하세요.

#### 버전 호환성

최신 Kotlin 버전을 사용하는 것을 권장합니다. 이 CocoaPods 설정에 필요한 최소 버전은 1.7.0입니다.

### Xcode 사용 시 빌드 오류 {initial-collapse-state="collapsed" collapsible="true"}

CocoaPods 설치 방식에 따라 Xcode에서 빌드 오류가 발생할 수 있습니다. 일반적으로 Kotlin Gradle 플러그인은 `PATH`에서 `pod` 실행 파일을 찾지만, 이는 환경에 따라 일관되지 않을 수 있습니다.

CocoaPods 설치 경로를 명시적으로 설정하려면 프로젝트의 `local.properties` 파일에 수동으로 또는 셸 명령어를 사용하여 추가할 수 있습니다:

* 코드 편집기를 사용하는 경우, `local.properties` 파일에 다음 줄을 추가합니다:

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 터미널을 사용하는 경우, 다음 명령어를 실행합니다:

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 모듈 또는 프레임워크를 찾을 수 없음 {initial-collapse-state="collapsed" collapsible="true"}

Pod를 설치할 때 [C interop](https://kotlinlang.org/docs/native-c-interop.html) 문제와 관련된 `module 'SomeSDK' not found` 또는 `framework 'SomeFramework' not found` 오류가 발생할 수 있습니다. 이러한 오류를 해결하려면 다음 해결 방법을 시도해 보세요:

#### 패키지 업데이트

설치 도구와 설치된 패키지(gem)를 업데이트하세요:

<Tabs>
<TabItem title="RVM">

1. RVM을 업데이트합니다:

   ```bash
   rvm get stable
   ```

2. Ruby의 패키지 관리자 RubyGems를 업데이트합니다:

    ```bash
    gem update --system
    ```

3. 설치된 모든 gem을 최신 버전으로 업그레이드합니다:

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Rbenv">

1. Rbenv를 업데이트합니다:

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. Ruby의 패키지 관리자 RubyGems를 업데이트합니다:

    ```bash
    gem update --system
    ```

3. 설치된 모든 gem을 최신 버전으로 업그레이드합니다:

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Homebrew">

1. Homebrew 패키지 관리자를 업데이트합니다: 

   ```bash
   brew update
   ```

2. 설치된 모든 패키지를 최신 버전으로 업그레이드합니다:

   ```bash
   brew upgrade
   ````

</TabItem>
</Tabs>

#### 프레임워크 이름 지정 

1. 다운로드된 Pod 디렉토리 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`에서 `module.modulemap` 파일을 찾습니다.
2. 모듈 내의 프레임워크 이름(예: `SDWebImageMapKit {}`)을 확인합니다. 프레임워크 이름이 Pod 이름과 일치하지 않으면 명시적으로 지정합니다:

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 헤더 지정

Pod에 `.modulemap` 파일이 포함되어 있지 않은 경우(`pod("NearbyMessages")`와 같이), 메인 헤더를 명시적으로 지정합니다:

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

더 자세한 정보는 [CocoaPods 문서](https://guides.cocoapods.org/)를 확인하세요. 아무것도 작동하지 않고 이 오류가 계속 발생하면 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에 문제를 보고하세요.

### Rsync 오류 {initial-collapse-state="collapsed" collapsible="true"}

`rsync error: some files could not be transferred` 오류가 발생할 수 있습니다. 이는 Xcode의 애플리케이션 대상에 사용자 스크립트 샌드박싱(sandboxing)이 활성화되어 있을 때 발생하는 [알려진 문제](https://github.com/CocoaPods/CocoaPods/issues/11946)입니다.

이 문제를 해결하려면:

1. 애플리케이션 대상에서 사용자 스크립트 샌드박싱을 비활성화합니다:

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png){width=700}

2. 샌드박싱되었을 수 있는 Gradle 데몬 프로세스를 중지합니다:

    ```shell
    ./gradlew --stop
    ```

## 다음 단계

* [Kotlin 프로젝트에 Pod 라이브러리 종속성 추가하기](multiplatform-cocoapods-libraries.md)
* [Kotlin 프로젝트와 Xcode 프로젝트 간 종속성 설정하기](multiplatform-cocoapods-xcode.md)
* [CocoaPods Gradle 플러그인 DSL 전체 참조 보기](multiplatform-cocoapods-dsl-reference.md)