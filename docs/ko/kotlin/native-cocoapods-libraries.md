---
title: "Pod 라이브러리에 대한 종속성 추가"
---
Kotlin 프로젝트와 Pod 라이브러리 간에 종속성을 추가하려면 [초기 구성](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)을 완료하세요.
그런 다음 다양한 유형의 Pod 라이브러리에 종속성을 추가할 수 있습니다.

새 종속성을 추가하고 IDE에서 프로젝트를 다시 가져오면 새 종속성이 자동으로 추가됩니다.
추가 단계는 필요하지 않습니다.

Xcode에서 Kotlin 프로젝트를 사용하려면 [프로젝트 Podfile을 변경](native-cocoapods#update-podfile-for-xcode)해야 합니다.

Kotlin 프로젝트는 Pod 종속성을 추가하기 위해 `build.gradle(.kts)`에 `pod()` 함수 호출이 필요합니다.
각 종속성에는 별도의 함수 호출이 필요합니다. 함수 구성 블록에서 종속성에 대한 매개변수를 지정할 수 있습니다.

:::note
최소 배포 대상 버전을 지정하지 않고 종속성 Pod에 더 높은 배포 대상이 필요한 경우 오류가 발생합니다.

:::

샘플 프로젝트는 [여기](https://github.com/Kotlin/kmm-with-cocoapods-sample)에서 찾을 수 있습니다.

## CocoaPods 저장소에서

1. `pod()` 함수에서 Pod 라이브러리 이름을 지정합니다.
   
   구성 블록에서 `version` 매개변수를 사용하여 라이브러리 버전을 지정할 수 있습니다. 최신 버전의 라이브러리를 사용하려면 이 매개변수를 생략하면 됩니다.

   > 서브스펙에 종속성을 추가할 수 있습니다.
   >
   

2. Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            ios.deploymentTarget = "16.0"

            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3. IntelliJ IDEA에서 **Reload All Gradle Projects**(또는 Android Studio에서 **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 가져옵니다.

```kotlin
import cocoapods.SDWebImage.*
```

## 로컬에 저장된 라이브러리에서

1. `pod()` 함수에서 Pod 라이브러리 이름을 지정합니다.

   구성 블록에서 로컬 Pod 라이브러리 경로를 지정합니다. `source` 매개변수 값에서 `path()` 함수를 사용합니다.

   > 로컬 종속성을 서브스펙에도 추가할 수 있습니다.
   > `cocoapods` 블록에는 로컬에 저장된 Pod와 CocoaPods 저장소의 Pod에 대한 종속성이 동시에 포함될 수 있습니다.
   >
   

2. Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

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
   > 최신 버전의 라이브러리를 사용하려면 매개변수를 생략하세요.
   >
   

3. IntelliJ IDEA에서 **Reload All Gradle Projects**(또는 Android Studio에서 **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 가져옵니다.

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 사용자 지정 Git 저장소에서

1. `pod()` 함수에서 Pod 라이브러리 이름을 지정합니다.

   구성 블록에서 git 저장소 경로를 지정합니다. `source` 매개변수 값에서 `git()` 함수를 사용합니다.

   또한 `git()` 뒤의 블록에서 다음 매개변수를 지정할 수 있습니다.
    * `commit` – 저장소에서 특정 커밋을 사용합니다.
    * `tag` – 저장소에서 특정 태그를 사용합니다.
    * `branch` – 저장소에서 특정 분기를 사용합니다.

   `git()` 함수는 `commit`, `tag`, `branch` 순으로 전달된 매개변수의 우선 순위를 지정합니다.
   매개변수를 지정하지 않으면 Kotlin 플러그인은 `master` 분기의 `HEAD`를 사용합니다.

   > `branch`, `commit`, `tag` 매개변수를 결합하여 특정 버전의 Pod를 가져올 수 있습니다.
   >
   

2. Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

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

3. IntelliJ IDEA에서 **Reload All Gradle Projects**(또는 Android Studio에서 **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 가져옵니다.

```kotlin
import cocoapods.Alamofire.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 사용자 지정 Podspec 저장소에서

1. `specRepos` 블록 내에서 `url()`을 사용하여 사용자 지정 Podspec 저장소의 HTTP 주소를 지정합니다.
2. `pod()` 함수에서 Pod 라이브러리 이름을 지정합니다.
3. Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

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

4. IntelliJ IDEA에서 **Reload All Gradle Projects**(또는 Android Studio에서 **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져옵니다.

:::note
Xcode에서 올바르게 작동하려면 Podfile 시작 부분에 스펙 위치를 지정해야 합니다.
예를 들어,
```ruby
source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
```

:::

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 가져옵니다.

```kotlin
import cocoapods.example.*
```

## 사용자 지정 cinterop 옵션 사용

1. `pod()` 함수에서 Pod 라이브러리 이름을 지정합니다.
2. 구성 블록에서 다음 옵션을 추가합니다.

   * `extraOpts` – Pod 라이브러리에 대한 옵션 목록을 지정합니다. 예를 들어 `extraOpts = listOf("-compiler-option")`입니다.
      
      > clang 모듈에 문제가 발생하면 `-fmodules` 옵션도 추가하세요.
      >
     

   * `packageName` – `import <packageName>`으로 패키지 이름을 사용하여 라이브러리를 직접 가져옵니다.

3. Pod 라이브러리의 최소 배포 대상 버전을 지정합니다.

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

4. IntelliJ IDEA에서 **Reload All Gradle Projects**(또는 Android Studio에서 **Sync Project with Gradle Files**)를 실행하여 프로젝트를 다시 가져옵니다.

Kotlin 코드에서 이러한 종속성을 사용하려면 `cocoapods.<library-name>` 패키지를 가져옵니다.
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
`packageName` 매개변수를 사용하는 경우 패키지 이름 `import <packageName>`을 사용하여 라이브러리를 가져올 수 있습니다.
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### `@import` 지시문이 있는 Objective-C 헤더 지원

:::caution
이 기능은 [Experimental](components-stability#stability-levels-explained)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
[YouTrack](https://kotl.in/issue)에서 여러분의 피드백을 부탁드립니다.

:::

일부 Objective-C 라이브러리, 특히 Swift 라이브러리의 래퍼 역할을 하는 라이브러리에는 헤더에 `@import` 지시문이 있습니다. 기본적으로 cinterop는 이러한 지시문을 지원하지 않습니다.

`@import` 지시문 지원을 활성화하려면 `pod()` 함수의 구성 블록에서 `-fmodules` 옵션을 지정합니다.

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

`pod()` 함수를 사용하여 Pod에 여러 종속성을 추가하는 경우 Pod API 간에 종속성이 있을 때 문제가 발생할 수 있습니다.

이러한 경우 코드를 컴파일하려면 `useInteropBindingFrom()` 함수를 사용합니다.
이 함수는 새 Pod에 대한 바인딩을 빌드하는 동안 다른 Pod에 대해 생성된 cinterop 바인딩을 활용합니다.

종속성을 설정하기 전에 종속 Pod를 선언해야 합니다.

```kotlin
// pod("WebImage")의 cinterop:
fun loadImage(): WebImage

// pod("Info")의 cinterop:
fun printImageInfo(image: WebImage)

// Your code:
printImageInfo(loadImage())
```

이 경우 cinterop 간에 올바른 종속성을 구성하지 않은 경우, `WebImage` 유형이 다른 cinterop 파일과 결과적으로 다른 패키지에서 소싱되기 때문에 코드가 유효하지 않습니다.