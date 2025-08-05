[//]: # (title: Pod 라이브러리 의존성 추가)

<tldr>

   * Pod 의존성을 추가하기 전에, [초기 구성](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)을 완료하세요.
   * 샘플 프로젝트는 [GitHub 저장소](https://github.com/Kotlin/kmp-with-cocoapods-sample)에서 찾을 수 있습니다.

</tldr>

Kotlin 프로젝트의 다양한 위치에서 Pod 라이브러리 의존성을 추가할 수 있습니다.

Pod 의존성을 추가하려면, 공유 모듈의 `build.gradle(.kts)` 파일에서 `pod()` 함수를 호출합니다.
각 의존성에는 별도의 함수 호출이 필요합니다. 의존성에 대한 매개변수는
함수의 구성 블록에서 지정할 수 있습니다.

* 새로운 의존성을 추가하고 IDE에서 프로젝트를 다시 가져오면(re-import), 라이브러리가 자동으로 연결됩니다.
* Kotlin 프로젝트를 Xcode와 함께 사용하려면, 먼저 [프로젝트의 Podfile을 변경](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)하세요.

> 최소 배포 대상 버전(minimum deployment target version)을 지정하지 않고, 의존성 Pod가 더 높은 배포 대상(deployment target)을 요구하는 경우,
> 오류가 발생합니다.
>
{style="note"}

## CocoaPods 저장소에서

CocoaPods 저장소에 있는 Pod 라이브러리에 의존성을 추가하려면:

1.  `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
    구성 블록에서 `version` 매개변수를 사용하여 라이브러리 버전을 지정할 수 있습니다.
    라이브러리의 최신 버전을 사용하려면 이 매개변수를 완전히 생략할 수 있습니다.

    > 서브스펙(subspecs)에도 의존성을 추가할 수 있습니다.
    >
    {style="note"}

2.  Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3.  IntelliJ IDEA에서 **빌드(Build)** | **모든 Gradle 프로젝트 다시 로드(Reload All Gradle Projects)**를 실행하거나 (또는 Android Studio에서 **파일(File)** | **Gradle 파일과 프로젝트 동기화(Sync Project with Gradle Files)**) 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.SDWebImage.*
```

## 로컬에 저장된 라이브러리 사용

로컬에 저장된 Pod 라이브러리에 의존성을 추가하려면:

1.  `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
    구성 블록에서 로컬 Pod 라이브러리의 경로를 지정합니다: `source` 매개변수 값에 `path()` 함수를 사용합니다.

    > 서브스펙에도 로컬 의존성을 추가할 수 있습니다.
    > `cocoapods {}` 블록은 로컬에 저장된 Pod와 CocoaPods 저장소의 Pod에 대한 의존성을
    > 동시에 포함할 수 있습니다.
    >
    {style="note"}

2.  Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("pod_dependency") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../pod_dependency"))
            }
            pod("subspec_dependency/Core") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../subspec_dependency"))
            }
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

    > 구성 블록에서 `version` 매개변수를 사용하여 라이브러리 버전을 지정할 수도 있습니다.
    > 라이브러리의 최신 버전을 사용하려면 매개변수를 생략하세요.
    >
    {style="note"}

3.  IntelliJ IDEA에서 **빌드(Build)** | **모든 Gradle 프로젝트 다시 로드(Reload All Gradle Projects)**를 실행하거나 (또는 Android Studio에서 **파일(File)** | **Gradle 파일과 프로젝트 동기화(Sync Project with Gradle Files)**) 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 사용자 지정 Git 저장소에서

사용자 지정 Git 저장소에 있는 Pod 라이브러리에 의존성을 추가하려면:

1.  `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
    구성 블록에서 Git 저장소의 경로를 지정합니다: `source` 매개변수 값에 `git()` 함수를 사용합니다.

    추가적으로, `git()` 다음 블록에서 다음 매개변수들을 지정할 수 있습니다:
    *   `commit` – 저장소의 특정 커밋을 사용하려면
    *   `tag` – 저장소의 특정 태그를 사용하려면
    *   `branch` – 저장소의 특정 브랜치를 사용하려면

    `git()` 함수는 전달된 매개변수를 다음 순서로 우선 처리합니다: `commit`, `tag`, `branch`.
    매개변수를 지정하지 않으면 Kotlin 플러그인은 `master` 브랜치의 `HEAD`를 사용합니다.

    > `branch`, `commit`, `tag` 매개변수를 조합하여 특정 Pod 버전을 가져올 수 있습니다.
    >
    {style="note"}

2.  Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                source = git("https://github.com/SDWebImage/SDWebImage") {
                    tag = "5.20.0"
                }
            }

            pod("JSONModel") {
                source = git("https://github.com/jsonmodel/jsonmodel.git") {
                    branch = "key-mapper-class"
                }
            }

            pod("CocoaLumberjack") {
                source = git("https://github.com/CocoaLumberjack/CocoaLumberjack.git") {
                    commit = "3e7f595e3a459c39b917aacf9856cd2a48c4dbf3"
                }
            }
        }
    }
    ```

3.  IntelliJ IDEA에서 **빌드(Build)** | **모든 Gradle 프로젝트 다시 로드(Reload All Gradle Projects)**를 실행하거나 (또는 Android Studio에서 **파일(File)** | **Gradle 파일과 프로젝트 동기화(Sync Project with Gradle Files)**) 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 사용자 지정 Podspec 저장소에서

사용자 지정 Podspec 저장소에 있는 Pod 라이브러리에 의존성을 추가하려면:

1.  `specRepos {}` 블록 내에서 `url()` 호출을 사용하여 사용자 지정 Podspec 저장소의 주소를 지정합니다.
2.  `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
3.  Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            specRepos {
                url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
            }
            pod("example")
        }
    }
    ```

4.  IntelliJ IDEA에서 **빌드(Build)** | **모든 Gradle 프로젝트 다시 로드(Reload All Gradle Projects)**를 실행하거나 (또는 Android Studio에서 **파일(File)** | **Gradle 파일과 프로젝트 동기화(Sync Project with Gradle Files)**) 프로젝트를 다시 가져옵니다.

> Xcode와 함께 작업하려면, Podfile 시작 부분에 스펙(specs)의 위치를 지정하세요:
>
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.example.*
```

## 사용자 지정 cinterop 옵션 사용

사용자 지정 cinterop 옵션을 사용하여 Pod 라이브러리에 의존성을 추가하려면:

1.  `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
2.  구성 블록에 다음 옵션들을 추가합니다:

    *   `extraOpts` – Pod 라이브러리에 대한 옵션 목록을 지정합니다. 예를 들어, `extraOpts = listOf("-compiler-option")`.

        > clang 모듈과 관련된 문제가 발생하면, `-fmodules` 옵션도 추가하세요.
        >
        {style="note"}

    *   `packageName` – 패키지 이름 `import <packageName>`을 사용하여 라이브러리를 직접 임포트합니다.

3.  Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("FirebaseAuth") {
                packageName = "FirebaseAuthWrapper"
                version = "11.7.0"
                extraOpts += listOf("-compiler-option", "-fmodules")
            }
        }
    }
    ```

4.  IntelliJ IDEA에서 **빌드(Build)** | **모든 Gradle 프로젝트 다시 로드(Reload All Gradle Projects)**를 실행하거나 (또는 Android Studio에서 **파일(File)** | **Gradle 파일과 프로젝트 동기화(Sync Project with Gradle Files)**) 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.FirebaseAuth.*
```

`packageName` 매개변수를 사용하는 경우, `import <packageName>` 패키지 이름을 사용하여 라이브러리를 임포트할 수 있습니다:

```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### Objective-C 헤더의 `@import` 지시문 지원

> 이 기능은 [실험적(Experimental)](supported-platforms.md#general-kotlin-stability-levels)입니다.
> 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요.
> [YouTrack](https://kotl.in/issue)에서 이에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

일부 Objective-C 라이브러리, 특히 Swift 라이브러리의 래퍼 역할을 하는 라이브러리는
헤더에 `@import` 지시문을 포함하고 있습니다. 기본적으로 cinterop은 이러한 지시문에 대한 지원을 제공하지 않습니다.

`@import` 지시문에 대한 지원을 활성화하려면, `pod()` 함수의 구성 블록에서 `-fmodules` 옵션을 지정하세요:

```kotlin
kotlin {
    iosArm64()

    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        ios.deploymentTarget = "16.0"

        pod("PodName") {
            version = "1.0.0"
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

### 의존적인 Pod 간에 Kotlin cinterop 공유

`pod()` 함수를 사용하여 Pod에 여러 의존성을 추가하면,
Pod API 간에 의존성이 있을 때 문제가 발생할 수 있습니다.

이러한 경우 코드를 컴파일하려면 `useInteropBindingFrom()` 함수를 사용하세요.
이는 새로운 Pod에 대한 바인딩을 빌드하는 동안 다른 Pod에 대해 생성된 cinterop 바인딩을 활용합니다.

의존성을 설정하기 전에 종속적인 Pod를 선언해야 합니다:

```kotlin
// The cinterop of pod("WebImage"):
fun loadImage(): WebImage

// The cinterop of pod("Info"):
fun printImageInfo(image: WebImage)

// Your code:
printImageInfo(loadImage())
```

이 경우 cinterop 간에 올바른 의존성을 구성하지 않으면,
`WebImage` 타입이 다른 cinterop 파일, 결과적으로 다른 패키지에서 소스되기 때문에 코드가 유효하지 않게 됩니다.

## 다음 단계

*   [Kotlin 프로젝트와 Xcode 프로젝트 간 의존성 설정](multiplatform-cocoapods-xcode.md)
*   [전체 CocoaPods Gradle 플러그인 DSL 참조 확인](multiplatform-cocoapods-dsl-reference.md)