[//]: # (title: 로컬 Swift 패키지에서 Kotlin 사용하기)

<tldr>
   이것은 로컬 통합 방식입니다. 다음과 같은 경우에 유용합니다:<br/>

   * 로컬 SwiftPM 모듈이 포함된 iOS 앱이 있는 경우.
   * 로컬 머신에 iOS를 타겟으로 하는 Kotlin Multiplatform 프로젝트를 이미 설정한 경우.
   * 기존 iOS 프로젝트가 정적 링크(static linking) 타입을 사용하는 경우.<br/>

   [본인에게 가장 적합한 통합 방식을 선택하세요](multiplatform-ios-integration-overview.md)
</tldr>

이 튜토리얼에서는 Swift 패키지 관리자(SwiftPM)를 사용하여 Kotlin Multiplatform 프로젝트의 Kotlin 프레임워크를 로컬 패키지에 통합하는 방법을 알아봅니다.

![직접 통합 다이어그램](direct-integration-scheme.svg){width=700}

통합을 설정하기 위해, 프로젝트 빌드 설정의 사전 작업(pre-action)으로 `embedAndSignAppleFrameworkForXcode` Gradle 태스크를 사용하는 특수 스크립트를 추가합니다. 공통 코드(common code)의 변경 사항을 Xcode 프로젝트에 반영하려면 Kotlin Multiplatform 프로젝트만 다시 빌드하면 됩니다.

이 방식을 사용하면 빌드 단계(build phase)에 스크립트를 추가하여 공통 코드의 변경 사항을 반영하기 위해 Kotlin Multiplatform과 iOS 프로젝트를 모두 다시 빌드해야 하는 일반적인 직접 통합 방식에 비해, 로컬 Swift 패키지에서 Kotlin 코드를 훨씬 쉽게 사용할 수 있습니다.

> Kotlin Multiplatform에 익숙하지 않다면, 먼저 [환경 설정 방법](quickstart.md)과 [처음부터 크로스 플랫폼 애플리케이션을 만드는 방법](compose-multiplatform-create-first-app.md)을 익히시기 바랍니다.
>
{style="tip"}

## 프로젝트 설정

이 기능은 Kotlin 2.0.0부터 사용할 수 있습니다.

> Kotlin 버전을 확인하려면 Kotlin Multiplatform 프로젝트 루트의 `build.gradle(.kts)` 파일로 이동하세요. 파일 상단의 `plugins {}` 블록에서 현재 버전을 확인할 수 있습니다.
> 
> 또는 `gradle/libs.versions.toml` 파일의 버전 카탈로그를 확인하세요.
> 
{style="tip"}

이 튜토리얼은 프로젝트가 빌드 단계에서 `embedAndSignAppleFrameworkForXcode` 태스크를 사용하는 [직접 통합](multiplatform-direct-integration.md) 방식을 사용하고 있다고 가정합니다. CocoaPods 플러그인이나 `binaryTarget`이 포함된 Swift 패키지를 통해 Kotlin 프레임워크를 연결하고 있다면 먼저 마이그레이션하세요.

### SPM binaryTarget 통합에서 마이그레이션 {initial-collapse-state="collapsed" collapsible="true"}

SPM 통합에서 `binaryTarget`을 사용하는 방식으로부터 마이그레이션하려면 다음을 수행하세요:

1. Xcode에서 **Product** | **Clean Build Folder**를 선택하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉터리를 정리합니다.
2. 각 `Package.swift` 파일에서 Kotlin 프레임워크가 포함된 패키지에 대한 종속성과 제품(products)에 대한 타겟 종속성을 모두 제거합니다.

### CocoaPods 플러그인에서 마이그레이션 {initial-collapse-state="collapsed" collapsible="true"}

> `cocoapods {}` 블록에 다른 Pod에 대한 종속성이 있는 경우 CocoaPods 통합 방식을 계속 사용해야 합니다. 현재 멀티모달(multimodal) SwiftPM 프로젝트에서는 Pod과 Kotlin 프레임워크 모두에 대한 종속성을 동시에 가질 수 없습니다.
>
{style="warning"}

CocoaPods 플러그인에서 마이그레이션하려면 다음을 수행하세요:

1. Xcode에서 **Product** | **Clean Build Folder**를 선택하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉터리를 정리합니다.
2. Podfile이 있는 디렉터리에서 다음 명령을 실행합니다:

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)` 파일에서 `cocoapods {}` 블록을 제거합니다.
4. `.podspec` 파일과 Podfile을 삭제합니다.

## 프로젝트에 프레임워크 연결하기

> 현재 `swift build`로의 통합은 지원되지 않습니다.
>
{style="note"}

로컬 Swift 패키지에서 Kotlin 코드를 사용하려면 멀티플랫폼 프로젝트에서 생성된 Kotlin 프레임워크를 Xcode 프로젝트에 연결하세요:

1. Xcode에서 **Product** | **Scheme** | **Edit scheme**으로 이동하거나 상단 바의 스킴 아이콘을 클릭하고 **Edit scheme**을 선택합니다:

   ![스킴 편집](xcode-edit-schemes.png){width=700}

2. **Build** | **Pre-actions** 항목을 선택한 다음 **+** | **New Run Script Action**을 클릭합니다:

   ![새 실행 스크립트 액션](xcode-new-run-script-action.png){width=700}

3. 다음 스크립트를 수정하여 액션으로 추가합니다:

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd` 명령에서 Kotlin Multiplatform 프로젝트 루트 경로를 지정합니다(예: `$SRCROOT/..`).
   * `./gradlew` 명령에서 공유 모듈의 이름을 지정합니다(예: `:shared` 또는 `:composeApp`).
  
4. **Provide build settings from** 섹션에서 앱의 타겟을 선택합니다:

   ![작성된 실행 스크립트 액션](xcode-filled-run-script-action.png){width=700}

5. 이제 로컬 Swift 패키지에 공유 모듈을 임포트하고 Kotlin 코드를 사용할 수 있습니다.

   Xcode에서 로컬 Swift 패키지로 이동하여 모듈 임포트가 포함된 함수를 정의합니다. 예:

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SwiftPM 사용 예시](xcode-spm-usage.png){width=700}

6. iOS 프로젝트의 `ContentView.swift` 파일에서 로컬 패키지를 임포트하여 이 함수를 사용할 수 있습니다:

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
   
7. Xcode에서 프로젝트를 빌드합니다. 모든 설정이 올바르다면 프로젝트 빌드가 성공할 것입니다.
   
고려해야 할 몇 가지 요소가 더 있습니다: 

* 기본 `Debug` 또는 `Release`와 다른 커스텀 빌드 구성(build configuration)이 있는 경우, **Build Settings** 탭의 **User-Defined** 아래에 `KOTLIN_FRAMEWORK_BUILD_TYPE` 설정을 추가하고 이를 `Debug` 또는 `Release`로 설정하세요.
* 스크립트 샌드박싱(script sandboxing) 오류가 발생하는 경우, 프로젝트 이름을 더블 클릭하여 iOS 프로젝트 설정을 열고 **Build Settings** 탭의 **Build Options** 아래에서 **User Script Sandboxing**을 비활성화하세요.

## 다음 단계

* [통합 방식 선택하기](multiplatform-ios-integration-overview.md)
* [Swift 패키지 내보내기 설정 방법 알아보기](multiplatform-spm-export.md)