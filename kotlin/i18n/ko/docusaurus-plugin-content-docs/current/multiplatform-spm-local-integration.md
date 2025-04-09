---
title: "로컬 Swift 패키지에서 Kotlin 사용하기"
---
:::info

   이것은 로컬 통합 방식입니다. 다음과 같은 경우에 적합합니다:<br/>

   * 로컬 SPM 모듈이 있는 iOS 앱이 있는 경우.
   * 로컬 시스템에서 iOS를 타겟으로 하는 Kotlin Multiplatform 프로젝트를 이미 설정한 경우.
   * 기존 iOS 프로젝트가 정적 링크 유형인 경우.<br/>

   [자신에게 가장 적합한 통합 방식 선택](multiplatform-ios-integration-overview)

:::

이 튜토리얼에서는 Swift 패키지 관리자(SPM)를 사용하여 Kotlin Multiplatform 프로젝트의 Kotlin 프레임워크를 로컬 패키지에 통합하는 방법을 알아봅니다.

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

통합을 설정하려면 프로젝트의 빌드 설정에서 `embedAndSignAppleFrameworkForXcode` Gradle 작업을 사전 작업으로 사용하는 특수 스크립트를 추가합니다. 공통 코드에서 변경된 내용이 Xcode 프로젝트에 반영되도록 하려면 Kotlin Multiplatform 프로젝트를 다시 빌드하기만 하면 됩니다.

이 방식을 사용하면 빌드 단계에 스크립트를 추가하고 공통 코드의 변경 사항을 적용하기 위해 Kotlin Multiplatform 프로젝트와 iOS 프로젝트를 모두 다시 빌드해야 하는 일반적인 직접 통합 방식에 비해 로컬 Swift 패키지에서 Kotlin 코드를 쉽게 사용할 수 있습니다.

:::note
Kotlin Multiplatform에 익숙하지 않다면 먼저 [환경 설정 방법](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)과 [크로스 플랫폼 애플리케이션을 처음부터 만드는 방법](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)을 알아보세요.

## 프로젝트 설정

이 기능은 Kotlin 2.0.0부터 사용할 수 있습니다.

Kotlin 버전을 확인하려면 Kotlin Multiplatform 프로젝트의 루트에 있는 `build.gradle(.kts)` 파일로 이동합니다. 파일 상단의 `plugins {}` 블록에서 현재 버전을 확인할 수 있습니다.

또는 `gradle/libs.versions.toml` 파일에서 버전 카탈로그를 확인합니다.

이 튜토리얼에서는 프로젝트가 프로젝트의 빌드 단계에서 `embedAndSignAppleFrameworkForXcode` 작업을 사용하는 [직접 통합](multiplatform-direct-integration) 방식을 사용하고 있다고 가정합니다. CocoaPods 플러그인을 통해 또는 `binaryTarget`을 사용하여 Swift 패키지를 통해 Kotlin 프레임워크를 연결하는 경우 먼저 마이그레이션하세요.

### SPM binaryTarget 통합에서 마이그레이션

`binaryTarget`을 사용하여 SPM 통합에서 마이그레이션하려면:

1. Xcode에서 **Product** | **Clean Build Folder**를 사용하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉토리를 정리합니다.
2. 모든 `Package.swift` 파일에서 Kotlin 프레임워크가 포함된 패키지에 대한 종속성과 제품에 대한 대상 종속성을 모두 제거합니다.

### CocoaPods 플러그인에서 마이그레이션

`cocoapods {}` 블록에 다른 Pod에 대한 종속성이 있는 경우 CocoaPods 통합 방식을 사용해야 합니다. 현재 멀티모달 SPM 프로젝트에서 Pod와 Kotlin 프레임워크 모두에 대한 종속성을 가질 수 없습니다.

CocoaPods 플러그인에서 마이그레이션하려면:

1. Xcode에서 **Product** | **Clean Build Folder**를 사용하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉토리를 정리합니다.
2. `Podfile`이 있는 디렉터리에서 다음 명령을 실행합니다.

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)` 파일에서 `cocoapods {}` 블록을 제거합니다.
4. `.podspec` 및 `Podfile` 파일을 삭제합니다.

## 프로젝트에 프레임워크 연결

`swift build`에 대한 통합은 현재 지원되지 않습니다.

:::

로컬 Swift 패키지에서 Kotlin 코드를 사용할 수 있도록 하려면 멀티 플랫폼 프로젝트에서 생성된 Kotlin 프레임워크를 Xcode 프로젝트에 연결합니다.

1. Xcode에서 **Product** | **Scheme** | **Edit scheme**로 이동하거나 상단 막대에서 scheme 아이콘을 클릭하고 **Edit scheme**을 선택합니다.

   <img src="/img/xcode-edit-schemes.png" alt="Edit scheme" width="700" style={{verticalAlign: 'middle'}}/>

2. **Build** | **Pre-actions** 항목을 선택한 다음 **+** | **New Run Script Action**을 클릭합니다.

   <img src="/img/xcode-new-run-script-action.png" alt="New run script action" width="700" style={{verticalAlign: 'middle'}}/>

3. 다음 스크립트를 조정하여 작업으로 추가합니다.

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd` 명령에서 Kotlin Multiplatform 프로젝트의 루트 경로를 지정합니다(예: `$SRCROOT/..`).
   * `./gradlew` 명령에서 공유 모듈의 이름(예: `:shared` 또는 `:composeApp`)을 지정합니다.
  
4. **Provide build settings from** 섹션에서 앱의 대상을 선택합니다.

   <img src="/img/xcode-filled-run-script-action.png" alt="Filled run script action" width="700" style={{verticalAlign: 'middle'}}/>

5. 이제 공유 모듈을 로컬 Swift 패키지로 가져와 Kotlin 코드를 사용할 수 있습니다.

   Xcode에서 로컬 Swift 패키지로 이동하여 모듈 가져오기가 있는 함수를 정의합니다(예:).

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() `->` String {
       return Greeting.greet()
   }
   ```

   <img src="/img/xcode-spm-usage.png" alt="SPM usage" width="700" style={{verticalAlign: 'middle'}}/>

6. iOS 프로젝트의 `ContentView.swift` 파일에서 로컬 패키지를 가져와 이 함수를 사용할 수 있습니다.

   ```Swift
   import SwiftUI
   import SpmLocalPackage
   
   struct ContentView: View {
       var body: some View {
           Vstack {
               Image(systemName: "globe")
                   .imageScale(.large)
                   .foregroundStyle(.tint)
               Text(greetingsFromSpmLocalPackage())
           }
           .padding()
       }
   }
   
   #Preview {
       ContentView()
   }
   ```
   
7. Xcode에서 프로젝트를 빌드합니다. 모든 것이 올바르게 설정되면 프로젝트 빌드가 성공합니다.
   
고려해야 할 몇 가지 요소가 더 있습니다.

* 기본값인 `Debug` 또는 `Release`와 다른 사용자 지정 빌드 구성이 있는 경우 **Build Settings** 탭에서 **User-Defined** 아래에 `KOTLIN_FRAMEWORK_BUILD_TYPE` 설정을 추가하고 `Debug` 또는 `Release`로 설정합니다.
* 스크립트 샌드박싱에 오류가 발생하면 프로젝트 이름을 두 번 클릭하여 iOS 프로젝트 설정을 연 다음 **Build Settings** 탭에서 **Build Options** 아래의 **User Script Sandboxing**을 비활성화합니다.

## 다음 단계

* [통합 방식 선택](multiplatform-ios-integration-overview)
* [Swift 패키지 내보내기 설정 방법 알아보기](native-spm)

  ```