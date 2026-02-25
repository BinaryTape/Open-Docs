[//]: # (title: Kotlin 프로젝트를 CocoaPods 의존성으로 사용하기)

<tldr>

* Pod 의존성을 추가하기 전에, [초기 설정](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)을 완료하세요.
* 샘플 프로젝트는 [GitHub 저장소](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)에서 확인할 수 있습니다.

</tldr>

전체 Kotlin 프로젝트를 Pod 의존성으로 사용할 수 있습니다. 이를 위해 프로젝트의 Podfile에 해당 의존성을 포함하고, 이름과 생성된 Podspec이 있는 프로젝트 디렉토리 경로를 지정해야 합니다.

이 의존성은 해당 프로젝트와 함께 자동으로 빌드(및 재빌드)됩니다. 이러한 방식은 해당 Gradle 태스크와 Xcode 빌드 단계를 수동으로 작성할 필요를 없애주어 Xcode로의 임포트 과정을 간소화합니다.

하나 또는 여러 개의 타겟이 있는 Xcode 프로젝트와 Kotlin 프로젝트 간에 의존성을 추가할 수 있습니다. 또한 Kotlin 프로젝트와 여러 Xcode 프로젝트 간에 의존성을 추가하는 것도 가능합니다. 하지만 이 경우 각 Xcode 프로젝트에 대해 `pod install`을 수동으로 호출해야 합니다. 단일 Xcode 프로젝트의 경우 자동으로 수행됩니다.

> * 의존성을 Kotlin/Native 모듈로 올바르게 가져오려면 Podfile에 [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 또는 [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 지시어가 포함되어야 합니다.
> * 최소 배포 타겟(minimum deployment target) 버전을 지정하지 않았는데 의존성 Pod이 더 높은 배포 타겟을 요구하는 경우 오류가 발생합니다.
>
{style="note"}

## 단일 타겟 Xcode 프로젝트

Kotlin 프로젝트를 단일 타겟 Xcode 프로젝트의 Pod 의존성으로 사용하려면 다음을 수행하세요:

1. Xcode 프로젝트가 없다면 새로 생성합니다.
2. Xcode의 애플리케이션 타겟에서 **Build Options** 아래에 있는 **User Script Sandboxing**을 비활성화해야 합니다:

   ![CocoaPods 샌드박싱 비활성화](disable-sandboxing-cocoapods.png)

3. Kotlin 프로젝트의 iOS 파트에서 Podfile을 생성합니다. 
4. 공유 모듈(shared module)의 `build.gradle(.kts)` 파일에서 `podfile = project.file()`을 사용하여 Podfile의 경로를 추가합니다.

   이 단계는 Podfile에 대해 `pod install`을 호출하여 Xcode 프로젝트를 Kotlin 프로젝트 의존성과 동기화하는 데 도움이 됩니다.
5. Pod 라이브러리의 최소 배포 타겟 버전을 지정합니다:

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

6. Podfile에 Xcode 프로젝트에 포함하려는 Kotlin 프로젝트의 이름과 경로를 추가합니다:

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # iosApp을 위한 Pods
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 프로젝트 디렉토리에서 `pod install`을 실행합니다.

   처음으로 `pod install`을 실행하면 `.xcworkspace` 파일이 생성됩니다. 이 파일에는 원래의 `.xcodeproj`와 CocoaPods 프로젝트가 포함되어 있습니다.
8. 기존 `.xcodeproj`를 닫고 대신 새로운 `.xcworkspace` 파일을 엽니다. 이렇게 하면 프로젝트 의존성 관련 문제를 방지할 수 있습니다.
9. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(Android Studio의 경우 **File** | **Sync Project with Gradle Files**) 프로젝트를 다시 임포트합니다.

## 여러 타겟이 있는 Xcode 프로젝트

여러 타겟이 있는 Xcode 프로젝트에서 Kotlin 프로젝트를 Pod 의존성으로 사용하려면 다음을 수행하세요:

1. Xcode 프로젝트가 없다면 새로 생성합니다.
2. Kotlin 프로젝트의 iOS 파트에서 Podfile을 생성합니다.
3. 공유 모듈의 `build.gradle(.kts)` 파일에서 `podfile = project.file()`을 사용하여 프로젝트의 Podfile 경로를 추가합니다.

   이 단계는 Podfile에 대해 `pod install`을 호출하여 Xcode 프로젝트를 Kotlin 프로젝트 의존성과 동기화하는 데 도움이 됩니다.
4. 프로젝트에서 사용하려는 Pod 라이브러리에 대한 의존성을 `pod()`으로 추가합니다.
5. 각 타겟에 대해 Pod 라이브러리의 최소 배포 타겟 버전을 지정합니다:

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
            // Podfile 경로 지정
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6. Podfile에 Xcode 프로젝트에 포함하려는 Kotlin 프로젝트의 이름과 경로를 추가합니다:

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '16.0'
   
      # iosApp을 위한 Pods
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '16.0'

      # TVosApp을 위한 Pods
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 프로젝트 디렉토리에서 `pod install`을 실행합니다.

   처음으로 `pod install`을 실행하면 `.xcworkspace` 파일이 생성됩니다. 이 파일에는 원래의 `.xcodeproj`와 CocoaPods 프로젝트가 포함되어 있습니다.
8. 기존 `.xcodeproj`를 닫고 대신 새로운 `.xcworkspace` 파일을 엽니다. 이렇게 하면 프로젝트 의존성 관련 문제를 방지할 수 있습니다.
9. IntelliJ IDEA에서 **Build** | **Reload All Gradle Projects**를 실행하거나(Android Studio의 경우 **File** | **Sync Project with Gradle Files**) 프로젝트를 다시 임포트합니다.

## 다음 단계

* [Kotlin 프로젝트에서 Pod 라이브러리 의존성 추가하기](multiplatform-cocoapods-libraries.md)
* [iOS 프로젝트에 프레임워크를 연결하는 방법 확인하기](multiplatform-direct-integration.md)
* [전체 CocoaPods Gradle 플러그인 DSL 레퍼런스 보기](multiplatform-cocoapods-dsl-reference.md)