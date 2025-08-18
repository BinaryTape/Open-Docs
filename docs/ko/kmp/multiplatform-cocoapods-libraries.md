[//]: # (title: Pod 라이브러리 종속성 추가)

<tldr>

   * Pod 종속성을 추가하기 전에, [초기 설정을 완료하십시오](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods).
   * 샘플 프로젝트는 [GitHub 저장소](https://github.com/Kotlin/kmp-with-cocoapods-sample)에서 찾을 수 있습니다.

</tldr>

Kotlin 프로젝트에서 다양한 위치에 있는 Pod 라이브러리에 종속성을 추가할 수 있습니다.

Pod 종속성을 추가하려면 공유 모듈의 `build.gradle(.kts)` 파일에서 `pod()` 함수를 호출합니다. 각 종속성에는 별도의 함수 호출이 필요합니다. 함수의 구성 블록에서 종속성에 대한 매개변수를 지정할 수 있습니다.

* 새로운 종속성을 추가하고 IDE에서 프로젝트를 다시 임포트하면 라이브러리가 자동으로 연결됩니다.
* Xcode에서 Kotlin 프로젝트를 사용하려면 먼저 [프로젝트의 Podfile을 변경해야](multiplatform-cocoapods-overview.md#update-podfile-for-xcode) 합니다.

> 최소 배포 대상(deployment target) 버전을 지정하지 않고 종속성 Pod이 더 높은 배포 대상(deployment target)을 요구하는 경우 오류가 발생합니다.
>
{style="note"}

## CocoaPods 저장소에서

CocoaPods 저장소에 있는 Pod 라이브러리에 종속성을 추가하려면: 

1. `pod()` 함수에 Pod 라이브러리 이름을 지정합니다.
   
   구성 블록에서 `version` 매개변수를 사용하여 라이브러리 버전을 지정할 수 있습니다. 라이브러리의 최신 버전을 사용하려면 이 매개변수를 완전히 생략할 수 있습니다.

   > 서브스펙(subspec)에 대한 종속성도 추가할 수 있습니다.
   >
   {style="note"}

2. Pod 라이브러리의 최소 배포 대상(minimum deployment target) 버전을 지정합니다.

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

3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files**를 실행하여) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트합니다:

```kotlin
import cocoapods.SDWebImage.*
```

## 로컬에 저장된 라이브러리에 대해

로컬에 저장된 Pod 라이브러리에 종속성을 추가하려면:

1. `pod()` 함수에 Pod 라이브러리 이름을 지정합니다.

   구성 블록에서 로컬 Pod 라이브러리의 경로를 지정합니다: `source` 매개변수 값에 `path()` 함수를 사용합니다.

   > 로컬 서브스펙(subspec)에 대한 종속성도 추가할 수 있습니다.
   > `cocoapods {}` 블록은 로컬에 저장된 Pod과 CocoaPods 저장소의 Pod에 대한 종속성을 동시에 포함할 수 있습니다.
   >
   {style="note"}

2. Pod 라이브러리의 최소 배포 대상(minimum deployment target) 버전을 지정합니다.

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
   > 라이브러리의 최신 버전을 사용하려면 매개변수를 생략합니다.
   >
   {style="note"}

3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files**를 실행하여) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트합니다:

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 사용자 지정 Git 저장소에서

사용자 지정 Git 저장소에 있는 Pod 라이브러리에 종속성을 추가하려면:

1. `pod()` 함수에 Pod 라이브러리 이름을 지정합니다.

   구성 블록에서 git 저장소의 경로를 지정합니다: `source` 매개변수 값에 `git()` 함수를 사용합니다.

   추가적으로, `git()` 뒤의 블록에서 다음 매개변수들을 지정할 수 있습니다:
    * `commit` – 저장소의 특정 커밋(commit)을 사용합니다.
    * `tag` – 저장소의 특정 태그(tag)를 사용합니다.
    * `branch` – 저장소의 특정 브랜치(branch)를 사용합니다.

   `git()` 함수는 `commit`, `tag`, `branch` 순서로 전달된 매개변수에 우선순위를 부여합니다. 매개변수를 지정하지 않으면 Kotlin 플러그인은 `master` 브랜치의 `HEAD`를 사용합니다.

   > `branch`, `commit`, `tag` 매개변수를 조합하여 Pod의 특정 버전을 가져올 수 있습니다.
   >
   {style="note"}

2. Pod 라이브러리의 최소 배포 대상(minimum deployment target) 버전을 지정합니다.

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

3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files**를 실행하여) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트합니다:

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 사용자 지정 Podspec 저장소에서

사용자 지정 Podspec 저장소에 있는 Pod 라이브러리에 종속성을 추가하려면:

1. `specRepos {}` 블록 안에 `url()` 호출을 사용하여 사용자 지정 Podspec 저장소의 주소를 지정합니다.
2. `pod()` 함수에 Pod 라이브러리 이름을 지정합니다.
3. Pod 라이브러리의 최소 배포 대상(minimum deployment target) 버전을 지정합니다.

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

4. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files**를 실행하여) 프로젝트를 다시 임포트합니다.

> Xcode에서 작업하려면 Podfile의 시작 부분에 스펙(spec)의 위치를 지정합니다:
> 
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트합니다:

```kotlin
import cocoapods.example.*
```

## 사용자 지정 cinterop 옵션 사용

사용자 지정 cinterop 옵션을 사용하여 Pod 라이브러리에 종속성을 추가하려면:

1. `pod()` 함수에 Pod 라이브러리 이름을 지정합니다.
2. 구성 블록에 다음 옵션을 추가합니다:

   * `extraOpts` – Pod 라이브러리에 대한 옵션 목록을 지정합니다. 예를 들어, `extraOpts = listOf("-compiler-option")`입니다.
      
      > clang 모듈 문제가 발생하는 경우 `-fmodules` 옵션도 추가하십시오.
      >
     {style="note"}

   * `packageName` – `import <packageName>`을 사용하여 패키지 이름으로 라이브러리를 직접 임포트합니다.

3. Pod 라이브러리의 최소 배포 대상(minimum deployment target) 버전을 지정합니다.

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

4. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files**를 실행하여) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트합니다:
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
`packageName` 매개변수를 사용하는 경우 `import <packageName>`과 같이 패키지 이름을 사용하여 라이브러리를 임포트할 수 있습니다:
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### `@import` 지시문이 있는 Objective-C 헤더 지원

> 이 기능은 [실험적](supported-platforms.md#general-kotlin-stability-levels)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
> [YouTrack](https://kotl.in/issue)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

일부 Objective-C 라이브러리, 특히 Swift 라이브러리의 래퍼(wrapper) 역할을 하는 라이브러리에는 헤더에 `@import` 지시문이 있습니다. 기본적으로 cinterop은 이러한 지시문에 대한 지원을 제공하지 않습니다.

`@import` 지시문에 대한 지원을 활성화하려면 `pod()` 함수의 구성 블록에서 `-fmodules` 옵션을 지정합니다:

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

### 종속 Pod 간에 Kotlin cinterop 공유

`pod()` 함수를 사용하여 Pod에 여러 종속성을 추가하는 경우 Pod의 API 간에 종속성이 있을 때 문제가 발생할 수 있습니다.

이러한 경우 코드를 컴파일하려면 `useInteropBindingFrom()` 함수를 사용하십시오. 이는 새 Pod에 대한 바인딩을 빌드하는 동안 다른 Pod용으로 생성된 cinterop 바인딩을 활용합니다.

종속성을 설정하기 전에 종속 Pod를 선언해야 합니다:

```kotlin
// The cinterop of pod("WebImage"):
fun loadImage(): WebImage

// The cinterop of pod("Info"):
fun printImageInfo(image: WebImage)

// Your code:
printImageInfo(loadImage())
```

이 경우 cinterop 간에 올바른 종속성을 구성하지 않으면 `WebImage` 타입이 다른 cinterop 파일에서, 결과적으로 다른 패키지에서 가져오기 때문에 코드가 유효하지 않게 됩니다.

## 다음 단계

* [Kotlin 프로젝트와 Xcode 프로젝트 간 종속성 설정](multiplatform-cocoapods-xcode.md)
* [CocoaPods Gradle 플러그인 DSL 전체 참조 보기](multiplatform-cocoapods-dsl-reference.md)