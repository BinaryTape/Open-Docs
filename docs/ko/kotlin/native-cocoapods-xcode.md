---
title: "Kotlin Gradle 프로젝트를 CocoaPods 종속성으로 사용"
---
네이티브 타겟이 있는 Kotlin Multiplatform 프로젝트를 CocoaPods 종속성으로 사용하려면 [초기 구성 완료](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)해야 합니다. 생성된 Podspec이 포함된 프로젝트 디렉터리의 이름과 경로를 사용하여 Xcode 프로젝트의 Podfile에 이러한 종속성을 포함할 수 있습니다.

이러한 종속성은 이 프로젝트와 함께 자동으로 빌드(및 재빌드)됩니다. 이러한 접근 방식은 해당 Gradle 작업 및 Xcode 빌드 단계를 수동으로 작성할 필요성을 없애 Xcode로의 가져오기를 간소화합니다.

Kotlin Gradle 프로젝트와 하나 또는 여러 개의 타겟이 있는 Xcode 프로젝트 사이에 종속성을 추가할 수 있습니다. Gradle 프로젝트와 여러 Xcode 프로젝트 사이에 종속성을 추가하는 것도 가능합니다. 하지만 이 경우 각 Xcode 프로젝트에 대해 `pod install`을 수동으로 호출하여 종속성을 추가해야 합니다. 다른 경우에는 자동으로 수행됩니다.

:::note
* Kotlin/Native 모듈로 종속성을 올바르게 가져오려면 `Podfile`에 다음 지시문 중 하나가 포함되어야 합니다.
  [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 또는
  [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang)
* 최소 배포 타겟 버전을 지정하지 않고 종속성 Pod에 더 높은 배포 타겟이 필요한 경우
  오류가 발생합니다.

:::

## 타겟이 하나인 Xcode 프로젝트

1. 아직 만들지 않았다면 `Podfile`이 있는 Xcode 프로젝트를 만듭니다.
2. 애플리케이션 타겟의 **빌드 옵션(Build Options)**에서 **사용자 스크립트 샌드박싱(User Script Sandboxing)**을 비활성화했는지 확인합니다.

   <img src="/img/disable-sandboxing-cocoapods.png" alt="Disable sandboxing CocoaPods" style={{verticalAlign: 'middle'}}/>

3. Kotlin 프로젝트의 `build.gradle(.kts)` 파일에 `podfile = project.file(..)`을 사용하여 Xcode 프로젝트 `Podfile`의 경로를 추가합니다.
   이 단계는 `Podfile`에 대해 `pod install`을 호출하여 Xcode 프로젝트를 Gradle 프로젝트 종속성과 동기화하는 데 도움이 됩니다.
4. Pod 라이브러리의 최소 배포 타겟 버전을 지정합니다.

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
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

5. Xcode 프로젝트에 포함할 Gradle 프로젝트의 이름과 경로를 `Podfile`에 추가합니다.

    ```ruby
    use_frameworks!

    platform :ios, '16.0'

    target 'ios-app' do
            pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. 프로젝트 디렉터리에서 `pod install`을 실행합니다.

   `pod install`을 처음 실행하면 `.xcworkspace` 파일이 생성됩니다. 이 파일에는
   원래 `.xcodeproj`와 CocoaPods 프로젝트가 포함됩니다.
7. `.xcodeproj`를 닫고 대신 새 `.xcworkspace` 파일을 엽니다. 이렇게 하면 프로젝트 종속성 문제를 방지할 수 있습니다.
8. IntelliJ IDEA에서 **모든 Gradle 프로젝트 다시 로드(Reload All Gradle Projects)**(또는 Android Studio에서 **Gradle 파일과 프로젝트 동기화(Sync Project with Gradle Files)**)를 실행하여
   프로젝트를 다시 가져옵니다.

## 타겟이 여러 개인 Xcode 프로젝트

1. 아직 만들지 않았다면 `Podfile`이 있는 Xcode 프로젝트를 만듭니다.
2. Kotlin 프로젝트의 `build.gradle(.kts)`에 `podfile = project.file(..)`을 사용하여 Xcode 프로젝트 `Podfile`의 경로를 추가합니다.
   이 단계는 `Podfile`에 대해 `pod install`을 호출하여 Xcode 프로젝트를 Gradle 프로젝트 종속성과 동기화하는 데 도움이 됩니다.
3. 프로젝트에서 사용할 Pod 라이브러리에 종속성을 `pod()`로 추가합니다.
4. 각 타겟에 대해 Pod 라이브러리의 최소 배포 타겟 버전을 지정합니다.

    ```kotlin
    kotlin {
        iosArm64()
        tvosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
            tvos.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // specify the path to the Podfile
        }
    }
    ```

5. Xcode 프로젝트에 포함할 Gradle 프로젝트의 이름과 경로를 `Podfile`에 추가합니다.

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '16.0'
      # Pods for iosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '16.0'

      # Pods for TVosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. 프로젝트 디렉터리에서 `pod install`을 실행합니다.

   `pod install`을 처음 실행하면 `.xcworkspace` 파일이 생성됩니다. 이 파일에는
   원래 `.xcodeproj`와 CocoaPods 프로젝트가 포함됩니다.
7. `.xcodeproj`를 닫고 대신 새 `.xcworkspace` 파일을 엽니다. 이렇게 하면 프로젝트 종속성 문제를 방지할 수 있습니다.
8. IntelliJ IDEA에서 **모든 Gradle 프로젝트 다시 로드(Reload All Gradle Projects)**(또는 Android Studio에서 **Gradle 파일과 프로젝트 동기화(Sync Project with Gradle Files)**)를 실행하여
   프로젝트를 다시 가져옵니다.

샘플 프로젝트는 [여기](https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample)에서 찾을 수 있습니다.

## 다음 단계

Xcode 프로젝트에서 빌드 단계에 사용자 지정 빌드 스크립트를 추가하는 방법을 알아보려면 [프레임워크를 iOS 프로젝트에 연결](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html#connect-the-framework-to-your-ios-project)을 참조하십시오.