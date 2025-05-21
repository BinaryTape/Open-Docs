---
title: "직접 통합"
---
:::info

   이것은 로컬 통합 방식입니다. 다음과 같은 경우에 유용합니다:<br/>

   * 로컬 시스템에 iOS를 대상으로 하는 Kotlin Multiplatform 프로젝트를 이미 설정했습니다.
   * Kotlin Multiplatform 프로젝트에 CocoaPods 종속성이 없습니다.<br/>

   [가장 적합한 통합 방식을 선택하세요](multiplatform-ios-integration-overview)

:::

Kotlin Multiplatform 프로젝트와 iOS 프로젝트 간에 코드를 공유하여 동시에 개발하려는 경우, 특별한 스크립트를 사용하여 직접 통합을 설정할 수 있습니다.

이 스크립트는 Xcode에서 Kotlin framework를 iOS 프로젝트에 연결하는 과정을 자동화합니다.

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

이 스크립트는 Xcode 환경을 위해 특별히 설계된 `embedAndSignAppleFrameworkForXcode` Gradle 작업을 사용합니다.
설정하는 동안 iOS 앱 빌드의 run script 단계에 이를 추가합니다. 그 후, Kotlin artifact가 빌드되고 iOS 앱 빌드를 실행하기 전에 파생된 데이터에 포함됩니다.

일반적으로 스크립트는 다음 작업을 수행합니다.

* 컴파일된 Kotlin framework를 iOS 프로젝트 구조 내의 올바른 디렉토리에 복사합니다.
* 임베디드 framework의 코드 서명 프로세스를 처리합니다.
* Kotlin framework의 코드 변경 사항이 Xcode의 iOS 앱에 반영되도록 합니다.

## 설정 방법

현재 CocoaPods 플러그인을 사용하여 Kotlin framework를 연결하고 있는 경우, 먼저 마이그레이션하세요.
프로젝트에 CocoaPods 종속성이 없는 경우, [이 단계를 건너뛰세요](#connect-the-framework-to-your-project).

### CocoaPods 플러그인에서 마이그레이션

CocoaPods 플러그인에서 마이그레이션하려면:

1. Xcode에서 **Product** | **Clean Build Folder**를 사용하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉토리를 정리합니다.
2. `Podfile` 파일이 있는 디렉토리에서 다음 명령을 실행합니다.

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)` 파일에서 `cocoapods {}` 블록을 제거합니다.
4. `.podspec` 및 `Podfile` 파일을 삭제합니다.

### 프로젝트에 framework 연결

Multiplatform 프로젝트에서 생성된 Kotlin framework를 Xcode 프로젝트에 연결하려면:

1. `embedAndSignAppleFrameworkForXcode` 작업은 `binaries.framework` 구성 옵션이 선언된 경우에만 등록됩니다. Kotlin Multiplatform 프로젝트의 `build.gradle.kts` 파일에서 iOS 대상 선언을 확인하세요.
2. Xcode에서 프로젝트 이름을 더블 클릭하여 iOS 프로젝트 설정을 엽니다.
3. 프로젝트 설정의 **Build Phases** 탭에서 **+**를 클릭하고 **New Run Script Phase**를 선택합니다.

   <img src="/img/xcode-run-script-phase-1.png" alt="Add run script phase" width="700" style={{verticalAlign: 'middle'}}/>

4. 다음 스크립트를 조정하고 결과를 run script 단계에 복사합니다.

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd` 명령에서 Kotlin Multiplatform 프로젝트의 루트 경로를 지정합니다 (예: `$SRCROOT/..`).
   * `./gradlew` 명령에서 공유 모듈의 이름을 지정합니다 (예: `:shared` 또는 `:composeApp`).

   <img src="/img/xcode-run-script-phase-2.png" alt="Add the script" width="700" style={{verticalAlign: 'middle'}}/>

5. **Run Script** 단계를 **Compile Sources** 단계 앞으로 드래그합니다.

   <img src="/img/xcode-run-script-phase-3.png" alt="Drag the Run Script phase" width="700" style={{verticalAlign: 'middle'}}/>

6. **Build Settings** 탭에서 **Build Options** 아래의 **User Script Sandboxing** 옵션을 비활성화합니다.

   <img src="/img/disable-sandboxing-in-xcode-project-settings.png" alt="User Script Sandboxing" width="700" style={{verticalAlign: 'middle'}}/>

   > 샌드박싱을 비활성화하지 않고 먼저 iOS 프로젝트를 빌드한 경우 Gradle 데몬을 다시 시작해야 할 수 있습니다.
   > 샌드박스 처리되었을 수 있는 Gradle 데몬 프로세스를 중지합니다.
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > 

7. Xcode에서 프로젝트를 빌드합니다. 모든 설정이 올바르게 완료되면 프로젝트가 성공적으로 빌드됩니다.

:::note
기본값인 `Debug` 또는 `Release`와 다른 사용자 정의 빌드 구성이 있는 경우, **Build Settings** 탭의 **User-Defined** 아래에 `KOTLIN_FRAMEWORK_BUILD_TYPE` 설정을 추가하고 `Debug` 또는 `Release`로 설정합니다.

:::

## 다음 단계

Swift 패키지 관리자를 사용할 때 로컬 통합을 활용할 수도 있습니다. [로컬 패키지에서 Kotlin framework에 대한 종속성을 추가하는 방법 알아보기](multiplatform-spm-local-integration).