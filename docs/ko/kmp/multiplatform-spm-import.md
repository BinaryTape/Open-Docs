[//]: # (title: KMP 모듈에 Swift 패키지를 의존성으로 추가하기)
<primary-label ref="Experimental"/>

<tldr>
   <p>Swift Package Manager(SwiftPM)는 CocoaPods와 동일한 역할을 수행합니다. 즉, iOS 앱의 네이티브 iOS 의존성을 투명하게 관리할 수 있게 해줍니다.</p>
   <p>이 문서에서는 KMP 프로젝트에서 SwiftPM 의존성을 설정하는 방법과, 필요한 경우 KMP 설정을 CocoaPods에서 SwiftPM으로 마이그레이션하는 방법을 배울 수 있습니다.</p>
</tldr>

> 이 기능은 [실험적(Experimental)](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 단계이며 프로덕션 용도로 권장되지 않습니다.
> 문제나 의견이 있다면 전용 Kotlin Slack 채널인 [#kmp-swift-package-manager](https://kotlinlang.slack.com/archives/C09TW68099C)에서 공유해 주세요.
>
{style="warning"}

SwiftPM 임포트 통합 기능이 포함된 Kotlin Gradle 플러그인을 사용하면, Apple 타겟에 선언된 SwiftPM 의존성을 이용해 Objective-C 및 Swift 코드로부터 Objective-C API를 임포트할 수 있습니다.

전이 의존성(SwiftPM 임포트를 사용하는 프로젝트를 의존하는 프로젝트)의 경우, Kotlin Gradle 플러그인이 SwiftPM 의존성으로부터 필요한 머신 코드를 자동으로 제공합니다. 예를 들어, Kotlin/Native 테스트를 실행하거나 프레임워크를 링크할 때 추가적인 설정이 필요하지 않습니다.

> SwiftPM 임포트를 사용하는 KMP 모듈을 Swift 패키지 자체로 [내보내는(export)](multiplatform-spm-export.md) 기능은 아직 지원되지 않으며 작동하지 않을 수 있습니다.
> 자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-84420)를 확인하고, 여러분의 사용 사례를 알려주세요.
>
{style="note"}

프로젝트를 구성하는 방법은 다음과 같습니다:

1. [개발 환경 설정하기](#set-up-environment)
2. [KMP 모듈에 SwiftPM 의존성 추가하기](#add-and-call-swiftpm-dependencies)
3. [Kotlin 코드에서 임포트된 API 사용하기](#use-imported-apis)

## 환경 설정

SwiftPM 임포트 기능을 사용해 보려면 특정 개발 버전의 Kotlin을 사용해야 합니다.
이 버전은 프로덕션 용도로 **설계되지 않았음**을 유의하세요.
<!-- This will be invalidated when 2.4.0-Beta1 comes out. This is when we specify the feature stability level and change the page label. -->

Kotlin Multiplatform Gradle 플러그인을 설정하려면 다음 단계를 따르세요:

1. `settings.gradle.kts` 파일에 의존성과 플러그인을 위한 개발 패키지 저장소를 추가합니다:

    ```kotlin
    dependencyResolutionManagement {
        repositories {
            maven("https://packages.jetbrains.team/maven/p/kt/dev")
            mavenCentral()
        }
    }

    pluginManagement {
        repositories {
            maven("https://packages.jetbrains.team/maven/p/kt/dev")
            mavenCentral()
            gradlePluginPortal()
        }
    }
    ```

2. 버전 카탈로그(version catalog)에서 실험적 버전의 Kotlin Multiplatform Gradle 플러그인을 적용합니다:

    ```text
    kotlin = "%spmImport%"

    [plugins]
    kotlin-multiplatform = "%spmImport%"
    ```

3. Gradle 파일을 동기화하고 KMP 모듈의 `build.gradle.kts` 파일에 `kotlin.swiftPMDependencies {}` 블록을 추가해 봅니다.

   만약 `swiftPMDependencies` 이름을 확인할 수 없다면, 루트 `build.gradle.kts` 파일에 다음 블록을 추가하여 실험적 Kotlin Multiplatform Gradle 플러그인 버전을 강제 적용하세요:

    ```kotlin
    buildscript {
        dependencies.constraints {
            "classpath"("org.jetbrains.kotlin:kotlin-gradle-plugin:%spmImport%")
        }
    }
    ```

### KMP IDE 플러그인 설정

KMP 프로젝트에 권장되는 [Kotlin Multiplatform IDE 플러그인]()을 사용하는 경우, KMP 모듈에서 빌드되는 iOS 프로젝트의 경로를 명시적으로 지정해야 합니다.

`iosTarget.binaries.framework` API를 호출하는 `build.gradle.kts` 파일에 경로를 설정하는 API 호출을 추가합니다:

```kotlin
kotlin {
    // iOS 타겟 설정 예시
    listOf(
        iosArm64(),
        iosSimulatorArm64(),
        iosX64(),
    ).forEach { iosTarget ->
            iosTarget.binaries.framework { 
                baseName = "Shared"
                isStatic = false
            } 
    }

    swiftPMDependencies { 
        // :embedAndSignAppleFrameworkForXcode 통합을 사용하는
        // .xcodeproj 파일의 경로를 지정합니다.
        xcodeProjectPathForKmpIJPlugin.set(
            layout.projectDirectory.file("../iosApp/iosApp.xcodeproj")
        )
    }
}
```

## SwiftPM 의존성 추가 및 호출

> 실제 작동하는 예제는 샘플 프로젝트를 참조하세요.
> `master` 브랜치는 CocoaPods를 사용하여 설정되어 있고, `spm_import` 브랜치는 SwiftPM을 사용합니다:
> 
> * [SwiftUI 및 Firebase 샘플 앱](https://github.com/Kotlin/kmp-with-cocoapods-firebase-sample/tree/spm_import)
> * [Compose Multiplatform iOS 샘플 앱](https://github.com/Kotlin/kmp-with-cocoapods-compose-sample/tree/spm_import)
>
{type="tip"}

### 빌드 파일 구성

Apple 타겟이 선언된 `build.gradle.kts` 파일의 `swiftPMDependencies` 블록에서 특정 SwiftPM 의존성을 추가할 수 있습니다.
예를 들어 Firebase의 경우는 다음과 같습니다:

```kotlin
kotlin {
    iosArm64()
    iosSimulatorArm64()
    iosX64()

    swiftPMDependencies {
        // Kotlin 코드에 FirebaseAnalytics 임포트
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.5.0"),
            products = listOf(product("FirebaseAnalytics")),
        )
        // swift-protobuf는 Firebase의 전이 의존성입니다.
        // 특정 버전을 사용하려는 경우에만 포함하면 됩니다.
        swiftPackage(
            url = url("https://github.com/apple/swift-protobuf.git"),
            version = exact("1.32.0"),
            products = listOf(),
        )
    }
}
```

SwiftPM 통합은 Clang 모듈을 임포트하는 방식에 기반합니다.
기본적으로 임포트 메커니즘은 지정된 Swift 패키지에서 Clang 모듈을 자동으로 검색하고, 모든 사용 가능한 모듈을 Kotlin 코드에서 접근할 수 있도록 만듭니다. 이는 Swift 및 Objective-C에서 API 가시성이 작동하는 방식과 유사합니다.
<!-- TODO link to where it is explained? -->

이 기본 동작과 자동 모듈 검색 기능을 비활성화하려면 `discoverClangModulesImplicitly`를 `false`로 설정하세요.
모듈 검색이 비활성화되면 SwiftPM 임포트는 제품(product) 이름을 Clang 모듈 이름으로 사용합니다.

제품 이름과 다른 이름의 Clang 모듈을 임포트하려면 `importedClangModules` 파라미터를 사용하세요:

```kotlin
kotlin {
    swiftPMDependencies {
        // 'discoverClangModulesImplicitly'가 'true'로 설정된 경우,
        // 아래의 'importedClangModules' 파라미터는 무시됩니다.
        discoverClangModulesImplicitly = false

        // 임포트된 패키지, 제품 및 Clang 모듈
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.5.0"),
            products = listOf(
                product("FirebaseAnalytics"),
                product("FirebaseFirestore")
            ),
            importedClangModules = listOf(
                "FirebaseAnalytics", 
                // FirebaseFirestore의 Objective-C API는
                // 'FirebaseFirestoreInternal' Clang 모듈에 위치합니다.
                "FirebaseFirestoreInternal"
            ),
        )
    }
}
```

### 플랫폼 제약 조건 설정

일부 SwiftPM 의존성은 빌드 스크립트의 모든 타겟에 대해 컴파일되지 않거나 유효한 API를 제공하지 않을 수 있습니다.
예를 들어 Google Maps SDK는 현재 iOS 타겟만 지원합니다.

따라서 프로젝트가 iOS만을 타겟팅하는 경우에는 플랫폼을 명시적으로 선언할 필요가 없습니다.
하지만 macOS와 같은 다른 타겟을 추가하는 즉시 각 의존성에 대해 플랫폼 제약 조건을 지정해야 합니다.

의존성이 관련 컴파일에만 적용되도록 하려면 `product` 명세의 `platforms` 파라미터에 올바른 타겟을 지정하세요:

```kotlin
kotlin {
    iosArm64()
    iosSimulatorArm64()
    iosX64()
    macosArm64()

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/googlemaps/ios-maps-sdk.git"),
            version = exact("10.3.0"),
            products = listOf(
                product(
                    "GoogleMaps", 
                    platforms = setOf(
                        // `GoogleMaps` 패키지는
                        // iOS 컴파일에서만 보입니다.
                        iOS()
                    )
                )
            )
        ) 
    }
}
```

### 임포트된 API 사용하기

임포트된 Objective-C API는 `swiftPMImport` 접두사로 시작하고 프로젝트의 이름과 그룹의 Gradle 이름으로 끝나는 네임스페이스에 포함됩니다.

예를 들어 Kotlin 빌드 스크립트에 그룹 이름이 다음과 같이 지정되어 있다고 가정해 보겠습니다:

```kotlin
// subproject/build.gradle.kts
group = "groupName"
```

여기서 `groupName`은 프로젝트의 Gradle 그룹 이름이고 `subproject`는 프로젝트 이름입니다.
이제 해당 모듈의 `iosMain` 소스 세트에서 Firebase API를 임포트할 수 있습니다:

```kotlin
// subproject/src/iosMain/kotlin/useFirebaseAnalytics.kt
import swiftPMImport.groupName.subproject.FIRAnalytics
import swiftPMImport.groupName.subproject.FIRApp
```

## 추가 임포트 옵션

### 로컬 Swift 패키지 임포트하기

SwiftPM 임포트 메커니즘을 사용하면 로컬 파일 시스템에서 Swift 패키지를 임포트할 수도 있습니다.

`/path/to/ExamplePackage` 디렉토리에 위치한 다음과 같은 매니페스트를 가진 Swift 패키지를 고려해 보겠습니다:

```swift
// /path/to/ExamplePackage/Package.swift
let package = Package(
  name: "ExamplePackage",
  platforms: [.iOS("15.0")],
  products: [
    .library(name: "ExamplePackage", targets: ["ExamplePackage"]),
  ],
  dependencies: [
    .package(url: "https://github.com/grpc/grpc-swift.git", exact: "1.27.0",),
  ],
  targets: [
    // 이 타겟은 @objc API를 사용하여 Swift로 구현되거나 Objective-C로 구현될 수 있습니다.
    .target(name: "ExamplePackage", dependencies: [.product(name: "GRPC", package: "grpc-swift")]),
  ]
)
```
{collapsible="true" collapsed-title-line-number="3"}

이를 Kotlin 빌드 스크립트에서 임포트하려면 `localSwiftPackage` API를 사용합니다:

```kotlin
// <projectDir>/shared/build.gradle.kts
kotlin {
    swiftPMDependencies {
        localSwiftPackage(
            directory = project.layout.projectDirectory.dir("/path/to/ExamplePackage/"),
            products = listOf("ExamplePackage")
        )
    }
}
```

Gradle 파일을 동기화하여 SwiftPM 임포트를 수행한 다음, Kotlin 코드에서 임포트된 API를 사용합니다:

```kotlin
// /path/to/shared/src/appleMain/kotlin/useExamplePackage.kt

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun useExamplePackage() {
    // Swift 패키지가 성공적으로 임포트되면,
    // IDE가 해당 클래스에 대한 올바른 임포트를 제안합니다.
    HelloFromExamplePackage().hello()
}
```

### 특정 배포 버전

의존성이 더 높은 [배포 버전(deployment version)](https://developer.apple.com/documentation/packagedescription/supportedplatform)을 요구하는 경우, `*MinimumDeploymentTarget` 파라미터에 이를 지정하십시오. 예를 들어 iOS의 경우는 다음과 같습니다:

```kotlin
kotlin {
    swiftPMDependencies {
        iosMinimumDeploymentTarget.set("16.0")
    }
}
```

### Swift 패키지 위치 및 버전

`Package.swift` 매니페스트 파일과 유사하게, `swiftPackage()` 호출에서 Swift 패키지의 위치와 버전을 지정할 수 있습니다. 두 설정 모두 몇 가지 상호 배타적인 옵션이 있습니다.

위치를 설정하려면 URL이나 [SwiftPM 레지스트리 ID](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/usingswiftpackageregistry)를 사용할 수 있습니다:

```kotlin
swiftPackage(
    // 옵션 1, URL 문자열
    // 패키지의 Git 저장소를 가리킵니다.
    url = url("https://github.com/firebase/firebase-ios-sdk.git")

    // 옵션 2, Swift 패키지 레지스트리 ID
    // 위에 링크된 패키지 레지스트리 사용에 관한 Apple 문서를 참조하세요.
    repository = id("...")
)
```

버전을 지정하려면 다음과 같은 Gradle 및 Git 스타일의 버전 명세를 사용하십시오:

```kotlin
swiftPackage(
    // Gradle의 'require' 버전 제약 조건과 유사하게,
    // 지정된 버전부터 시작합니다.
    version = from("1.0")

    // Gradle의 'strict' 버전 제약 조건과 유사하게,
    // 지정된 버전과 정확히 일치해야 합니다.
    version = exact("2.0")

    // Git 전용 버전 명세로,
    // 지정된 브랜치나 리비전과 일치해야 합니다.
    version = branch("master")
    // 또는
    version = revision("e74b07278b926c9ec6f9643455ea00d1ce04a021")
)
```

## 동적 Kotlin/Native 프레임워크에서의 알려진 제한 사항

현재 SwiftPM 임포트 통합은 동적 Kotlin/Native 프레임워크를 생성할 때 발생할 수 있는 모든 예외 케이스를 지원하지는 않습니다. Xcode 빌드 중에 문제가 발생하거나 런타임에 다음과 같은 경고가 표시될 수 있습니다:

* `Undefined symbols for architecture ...: "...", referenced from: ld: symbol(s) not found ...`
* `dyld: Symbol not found: ...`
* `objc[...]: Class _Foo is implemented in both /path/to/Shared and /path/to/Bar. This may cause spurious casting failures and mysterious crashes. One of the duplicates must be removed or renamed.`

이러한 문제에 대한 일반적인 해결책은 `isStatic` 속성을 `true`로 설정하여 프레임워크의 링크 모드를 변경하는 것입니다:

```kotlin
// shared/build.gradle.kts
kotlin {
    listOf(
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "Shared"

            // 이 속성을 "true"로 설정합니다.
            isStatic = true
        }
    }
}
```

위의 문제 중 하나라도 발생했거나, `isStatic=false`를 유지해야 하거나, 이 속성을 변경해도 빌드 실패가 해결되지 않는 경우 Slack 채널을 통해 알려주세요. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#kmp-swift-package-manager](https://kotlinlang.slack.com/archives/C09TW68099C) 채널에 참여하세요.

## 다음 단계는?

[KMP 프로젝트에서 CocoaPods 의존성을 SwiftPM으로 전환하는 방법](multiplatform-cocoapods-spm-migration.md)에 대해 자세히 알아보세요.