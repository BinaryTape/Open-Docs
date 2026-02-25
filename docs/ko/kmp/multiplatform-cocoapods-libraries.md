[//]: # (title: Pod 라이브러리에 의존성 추가하기)

<tldr>

   * Pod 의존성을 추가하기 전에, [초기 구성을 완료](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)하세요.
   * [GitHub 저장소](https://github.com/Kotlin/kmp-with-cocoapods-sample)에서 샘플 프로젝트를 확인할 수 있습니다.

</tldr>

Kotlin 프로젝트의 다양한 위치에서 Pod 라이브러리에 대한 의존성을 추가할 수 있습니다.

Pod 의존성을 추가하려면 공유 모듈의 `build.gradle(.kts)` 파일에서 `pod()` 함수를 호출하세요. 각 의존성마다 별도의 함수 호출이 필요합니다. 함수의 구성 블록(configuration block)에서 의존성에 대한 파라미터를 지정할 수 있습니다.

* 새로운 의존성을 추가하고 IDE에서 프로젝트를 다시 임포트하면 라이브러리가 자동으로 연결됩니다.
* Kotlin 프로젝트를 Xcode와 함께 사용하려면, 먼저 [프로젝트의 Podfile을 변경](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)해야 합니다.

> 최소 배포 타겟(minimum deployment target) 버전을 지정하지 않았는데 의존성 Pod이 더 높은 배포 타겟을 요구하는 경우 오류가 발생합니다.
>
{style="note"}

## CocoaPods 저장소에서 추가

CocoaPods 저장소에 있는 Pod 라이브러리에 의존성을 추가하려면 다음을 수행하세요:

1. `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
   
   구성 블록 내에서 `version` 파라미터를 사용하여 라이브러리 버전을 지정할 수 있습니다. 라이브러리의 최신 버전을 사용하려면 이 파라미터를 생략하면 됩니다.

   > 서브스펙(subspecs)에 대한 의존성도 추가할 수 있습니다.
   >
   {style="note"}

2. Pod 라이브러리에 대한 최소 배포 타겟 버전을 지정합니다.

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

3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files** 실행) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.SDWebImage.*
```

## 로컬에 저장된 라이브러리 사용

로컬에 저장된 Pod 라이브러리에 의존성을 추가하려면 다음을 수행하세요:

1. `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.

   구성 블록 내에서 로컬 Pod 라이브러리의 경로를 지정합니다. `source` 파라미터 값에 `path()` 함수를 사용하세요.

   > 서브스펙(subspecs)에 대한 로컬 의존성도 추가할 수 있습니다.
   > `cocoapods {}` 블록에는 로컬에 저장된 Pod과 CocoaPods 저장소의 Pod에 대한 의존성을 동시에 포함할 수 있습니다.
   >
   {style="note"}

2. Pod 라이브러리에 대한 최소 배포 타겟 버전을 지정합니다.

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

   > 구성 블록의 `version` 파라미터를 사용하여 라이브러리 버전을 지정할 수도 있습니다. 라이브러리의 최신 버전을 사용하려면 파라미터를 생략하세요.
   >
   {style="note"}

3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files** 실행) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 커스텀 Git 저장소에서 추가

커스텀 Git 저장소에 있는 Pod 라이브러리에 의존성을 추가하려면 다음을 수행하세요:

1. `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.

   구성 블록 내에서 Git 저장소의 경로를 지정합니다. `source` 파라미터 값에 `git()` 함수를 사용하세요.

   또한 `git()` 뒤의 블록에 다음 파라미터들을 지정할 수 있습니다:
    * `commit` – 저장소의 특정 커밋을 사용하려는 경우
    * `tag` – 저장소의 특정 태그를 사용하려는 경우
    * `branch` – 저장소의 특정 브랜치를 사용하려는 경우

   `git()` 함수는 전달된 파라미터의 우선순위를 `commit`, `tag`, `branch` 순으로 부여합니다. 파라미터를 지정하지 않으면 Kotlin 플러그인은 `master` 브랜치의 `HEAD`를 사용합니다.

   > `branch`, `commit`, `tag` 파라미터를 조합하여 특정 버전의 Pod을 가져올 수 있습니다.
   >
   {style="note"}

2. Pod 라이브러리에 대한 최소 배포 타겟 버전을 지정합니다.

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

3. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files** 실행) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 커스텀 Podspec 저장소에서 추가

커스텀 Podspec 저장소에 있는 Pod 라이브러리에 의존성을 추가하려면 다음을 수행하세요:

1. `specRepos {}` 블록 내부에서 `url()` 호출을 사용하여 커스텀 Podspec 저장소의 주소를 지정합니다.
2. `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
3. Pod 라이브러리에 대한 최소 배포 타겟 버전을 지정합니다.

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

4. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files** 실행) 프로젝트를 다시 임포트합니다.

> Xcode와 연동하려면 Podfile의 시작 부분에 스펙(specs)의 위치를 지정하세요:
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

## 커스텀 cinterop 옵션 사용

커스텀 cinterop 옵션을 사용하여 Pod 라이브러리에 의존성을 추가하려면 다음을 수행하세요:

1. `pod()` 함수에 Pod 라이브러리의 이름을 지정합니다.
2. 구성 블록에 다음 옵션들을 추가합니다:

   * `extraOpts` – Pod 라이브러리에 대한 옵션 목록을 지정합니다. 예: `extraOpts = listOf("-compiler-option")`.
      
      > clang 모듈과 관련된 문제가 발생하면 `-fmodules` 옵션도 추가하세요.
      >
     {style="note"}

   * `packageName` – `import <packageName>`을 사용하여 패키지 이름으로 라이브러리를 직접 임포트하려는 경우 지정합니다.

3. Pod 라이브러리에 대한 최소 배포 타겟 버전을 지정합니다.

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

4. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(또는 Android Studio에서 **File** | **Sync Project with Gradle Files** 실행) 프로젝트를 다시 임포트합니다.

Kotlin 코드에서 이러한 의존성을 사용하려면 `cocoapods.<library-name>` 패키지를 임포트하세요:
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
`packageName` 파라미터를 사용했다면, 패키지 이름 `import <packageName>`을 사용하여 라이브러리를 임포트할 수 있습니다:
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### @import 디렉티브를 포함한 Objective-C 헤더 지원

> 이 기능은 [실험적(Experimental)](supported-platforms.md#general-kotlin-stability-levels)입니다. 
> 언제든지 제거되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요. 
> [YouTrack](https://kotl.in/issue)을 통해 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

일부 Objective-C 라이브러리, 특히 Swift 라이브러리의 래퍼 역할을 하는 라이브러리들은 헤더에 `@import` 디렉티브를 포함하고 있습니다. 기본적으로 cinterop은 이러한 디렉티브를 지원하지 않습니다.

`@import` 디렉티브에 대한 지원을 활성화하려면 `pod()` 함수의 구성 블록에서 `-fmodules` 옵션을 지정하세요:

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

### 의존 관계에 있는 Pod 간 Kotlin cinterop 공유

`pod()` 함수를 사용하여 여러 Pod 의존성을 추가할 때, Pod들의 API 사이에 의존 관계가 있으면 문제가 발생할 수 있습니다.

이런 상황에서 코드가 컴파일되도록 하려면 `useInteropBindingFrom()` 함수를 사용하세요. 이 함수는 새로운 Pod을 위한 바인딩을 빌드할 때 다른 Pod을 위해 생성된 cinterop 바인딩을 활용합니다.

의존성을 설정하기 전에 의존 대상이 되는 Pod을 먼저 선언해야 합니다:

```kotlin
// pod("WebImage")의 cinterop:
fun loadImage(): WebImage

// pod("Info")의 cinterop:
fun printImageInfo(image: WebImage)

// 여러분의 코드:
printImageInfo(loadImage())
```

이 경우 cinterop 간의 올바른 의존성을 구성하지 않으면, `WebImage` 타입이 서로 다른 cinterop 파일(결과적으로 서로 다른 패키지)에서 제공되므로 코드가 유효하지 않게 됩니다.

## 다음 단계

* [Kotlin 프로젝트와 Xcode 프로젝트 간의 의존성 설정](multiplatform-cocoapods-xcode.md)
* [CocoaPods Gradle 플러그인 DSL 전체 레퍼런스 보기](multiplatform-cocoapods-dsl-reference.md)