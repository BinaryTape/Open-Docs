[//]: # (title: 로컬 Swift 패키지에서 Kotlin 사용)

<tldr>
   이것은 로컬 통합 방식입니다. 다음 경우에 유용합니다:<br/>

   * iOS 앱에 로컬 SPM 모듈이 있는 경우.
   * 로컬 머신에 이미 iOS를 타겟팅하는 Kotlin Multiplatform 프로젝트를 설정한 경우.
   * 기존 iOS 프로젝트가 정적 링크 유형인 경우.<br/>

   [가장 적합한 통합 방식을 선택하세요](multiplatform-ios-integration-overview.md)
</tldr>

이 튜토리얼에서는 Swift 패키지 매니저(SPM)를 사용하여 Kotlin Multiplatform 프로젝트의 Kotlin 프레임워크를 로컬
패키지에 통합하는 방법을 배웁니다.

![Direct integration diagram](direct-integration-scheme.svg){width=700}

통합을 설정하려면, 프로젝트의 빌드 설정에서 `embedAndSignAppleFrameworkForXcode` Gradle 작업을 프리액션(pre-action)으로 사용하는 특수 스크립트를 추가합니다. 공통 코드에 대한 변경 사항이 Xcode 프로젝트에 반영되도록 하려면
Kotlin Multiplatform 프로젝트를 다시 빌드하기만 하면 됩니다.

이러한 방식은 스크립트를 빌드 단계에 추가하고 공통 코드의 변경 사항을 반영하기 위해 Kotlin Multiplatform과 iOS 프로젝트를 모두 다시 빌드해야 하는 일반적인 직접 통합 방식과 비교하여 로컬 Swift 패키지에서 Kotlin 코드를 쉽게 사용할 수 있도록 합니다.

> Kotlin Multiplatform에 익숙하지 않다면, 먼저 [환경을 설정하는 방법](quickstart.md)과 [크로스 플랫폼 애플리케이션을 처음부터 만드는 방법](compose-multiplatform-create-first-app.md)을 배워보세요.
>
{style="tip"}

## 프로젝트 설정

이 기능은 Kotlin 2.0.0부터 사용할 수 있습니다.

> Kotlin 버전을 확인하려면 Kotlin Multiplatform 프로젝트의 루트에 있는 `build.gradle(.kts)` 파일로 이동하세요.
> 파일 상단 `plugins {}` 블록에서 현재 버전을 확인할 수 있습니다.
> 
> 또는 `gradle/libs.versions.toml` 파일에서 버전 카탈로그를 확인하세요.
> 
{style="tip"}

이 튜토리얼은 프로젝트가 빌드 단계에서 `embedAndSignAppleFrameworkForXcode` 작업을 사용하는 [직접 통합](multiplatform-direct-integration.md)
방식을 사용한다고 가정합니다. CocoaPods 플러그인을 통해 Kotlin 프레임워크를 연결하거나 `binaryTarget`를 사용하는 Swift 패키지를 통해 연결하는 경우, 먼저 마이그레이션해야 합니다.

### SPM binaryTarget 통합에서 마이그레이션 {initial-collapse-state="collapsed" collapsible="true"}

`binaryTarget`를 사용한 SPM 통합에서 마이그레이션하려면:

1. Xcode에서 **Product** | **Clean Build Folder**를 사용하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉토리를 정리합니다.
2. 모든 `Package.swift` 파일에서 Kotlin 프레임워크가 포함된 패키지에 대한 의존성과 제품에 대한 타겟 의존성을 모두 제거합니다.

### CocoaPods 플러그인에서 마이그레이션 {initial-collapse-state="collapsed" collapsible="true"}

> `cocoapods {}` 블록에 다른 Pod에 대한 의존성이 있다면 CocoaPods 통합 방식을 사용해야 합니다. 
> 현재 멀티모달 SPM 프로젝트에서 Pod 및 Kotlin 프레임워크에 대한 의존성을 동시에 가질 수는 없습니다. 
>
{style="warning"}

CocoaPods 플러그인에서 마이그레이션하려면:

1. Xcode에서 **Product** | **Clean Build Folder**를 사용하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉토리를 정리합니다.
2. Podfile이 있는 디렉토리에서 다음 명령을 실행합니다.

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)` 파일에서 `cocoapods {}` 블록을 제거합니다.
4. `.podspec` 파일과 Podfile을 삭제합니다.

## 프레임워크를 프로젝트에 연결

> `swift build`로의 통합은 현재 지원되지 않습니다.
>
{style="note"}

로컬 Swift 패키지에서 Kotlin 코드를 사용할 수 있도록, 멀티플랫폼 프로젝트에서 생성된 Kotlin 프레임워크를 Xcode 프로젝트에 연결합니다.

1. Xcode에서 **Product** | **Scheme** | **Edit scheme**으로 이동하거나 상단 바의 스키마 아이콘을 클릭한 후 **Edit scheme**을 선택합니다.

   ![Edit scheme](xcode-edit-schemes.png){width=700}

2. **Build** | **Pre-actions** 항목을 선택한 후 **+** | **New Run Script Action**을 클릭합니다.

   ![New run script action](xcode-new-run-script-action.png){width=700}

3. 다음 스크립트를 조정한 후 액션으로 추가합니다.

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd` 명령에서 Kotlin Multiplatform 프로젝트의 루트 경로를 지정합니다. 예를 들어 `$SRCROOT/..`입니다.
   * `./gradlew` 명령에서 공유 모듈의 이름을 지정합니다. 예를 들어 `:shared` 또는 `:composeApp`입니다.
  
4. **Provide build settings from** 섹션에서 앱의 타겟을 선택합니다.

   ![Filled run script action](xcode-filled-run-script-action.png){width=700}

5. 이제 공유 모듈을 로컬 Swift 패키지로 임포트하고 Kotlin 코드를 사용할 수 있습니다.

   Xcode에서 로컬 Swift 패키지로 이동하여 모듈 임포트가 포함된 함수를 정의합니다. 예를 들어 다음과 같습니다.

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SPM usage](xcode-spm-usage.png){width=700}

6. iOS 프로젝트의 `ContentView.swift` 파일에서 이제 로컬 패키지를 임포트하여 이 함수를 사용할 수 있습니다.

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
   
7. Xcode에서 프로젝트를 빌드합니다. 모든 설정이 올바르면 프로젝트 빌드가 성공적으로 완료됩니다.
   
고려할 만한 몇 가지 추가 요소가 있습니다. 

* 기본 `Debug` 또는 `Release`와 다른 사용자 지정 빌드 구성이 있는 경우, **Build Settings** 탭에서 **User-Defined** 아래에 `KOTLIN_FRAMEWORK_BUILD_TYPE` 설정을 추가하고 `Debug` 또는 `Release`로 설정합니다.
* 스크립트 샌드박싱 오류가 발생하면 프로젝트 이름을 더블 클릭하여 iOS 프로젝트 설정을 연 다음, **Build Settings** 탭에서 **Build Options** 아래의 **User Script Sandboxing**을 비활성화합니다.

## 다음 단계

* [통합 방식 선택](multiplatform-ios-integration-overview.md)
* [Swift 패키지 내보내기 설정 방법 알아보기](multiplatform-spm-export.md)