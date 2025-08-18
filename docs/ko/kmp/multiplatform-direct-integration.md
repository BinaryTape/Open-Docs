[//]: # (title: 직접 통합)

<tldr>
   이는 로컬 통합 방식입니다. 다음과 같은 경우에 적합합니다:<br/>

   * 로컬 머신에 이미 iOS를 타겟팅하는 Kotlin 멀티플랫폼 프로젝트를 설정했습니다.
   * Kotlin 멀티플랫폼 프로젝트에 CocoaPods 의존성이 없습니다.<br/>

   [가장 적합한 통합 방식을 선택하세요](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin 멀티플랫폼 프로젝트와 iOS 프로젝트 간에 코드를 공유하며 동시에 개발하고 싶다면, 특별한 스크립트를 사용하여 직접 통합을 설정할 수 있습니다.

이 스크립트는 Kotlin 프레임워크를 Xcode의 iOS 프로젝트에 연결하는 과정을 자동화합니다:

![Direct integration diagram](direct-integration-scheme.svg){width=700}

이 스크립트는 Xcode 환경에 맞게 특별히 설계된 `embedAndSignAppleFrameworkForXcode` Gradle 태스크를 사용합니다. 설정 과정에서, 이를 iOS 앱 빌드의 실행 스크립트 단계에 추가합니다. 그 후, iOS 앱 빌드를 실행하기 전에 Kotlin 아티팩트가 빌드되어 파생 데이터에 포함됩니다.

일반적으로 이 스크립트는:

* 컴파일된 Kotlin 프레임워크를 iOS 프로젝트 구조 내의 올바른 디렉토리로 복사합니다.
* 포함된 프레임워크의 코드 서명 프로세스를 처리합니다.
* Kotlin 프레임워크의 코드 변경 사항이 Xcode의 iOS 앱에 반영되도록 합니다.

## 설정 방법

현재 Kotlin 프레임워크를 연결하기 위해 CocoaPods 플러그인을 사용하고 있다면, 먼저 마이그레이션하세요. 프로젝트에 CocoaPods 의존성이 없다면, [이 단계를 건너뛰세요](#connect-the-framework-to-your-project).

### CocoaPods 플러그인에서 마이그레이션하기

CocoaPods 플러그인에서 마이그레이션하려면:

1. Xcode에서 **Product** | **Clean Build Folder**를 사용하거나 <shortcut>Cmd + Shift + K</shortcut> 단축키를 사용하여 빌드 디렉토리를 정리합니다.
2. Podfile이 있는 디렉토리에서 다음 명령을 실행합니다:

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)` 파일에서 `cocoapods {}` 블록을 제거합니다.
4. `.podspec` 파일과 Podfile을 삭제합니다.

### 프레임워크를 프로젝트에 연결하기

멀티플랫폼 프로젝트에서 생성된 Kotlin 프레임워크를 Xcode 프로젝트에 연결하려면:

1. `embedAndSignAppleFrameworkForXcode` 태스크는 `binaries.framework` 구성 옵션이 선언되어 있을 때만 등록됩니다. Kotlin 멀티플랫폼 프로젝트의 `build.gradle.kts` 파일에서 iOS 타겟 선언을 확인하세요.
2. Xcode에서 프로젝트 이름을 두 번 클릭하여 iOS 프로젝트 설정을 엽니다.
3. 왼쪽의 **Targets** 섹션에서 타겟을 선택한 다음, **Build Phases** 탭으로 이동합니다.
4. **+**를 클릭하고 **New Run Script Phase**를 선택합니다.

   ![Add run script phase](xcode-run-script-phase-1.png){width=700}

5. 다음 스크립트를 조정한 후 스크립트 실행 필드에 붙여넣으세요:

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd` 명령에서 Kotlin 멀티플랫폼 프로젝트의 루트 경로를 지정하세요. 예를 들어, `$SRCROOT/..`입니다.
   * `./gradlew` 명령에서 공유 모듈의 이름을 지정하세요. 예를 들어, `:shared` 또는 `:composeApp`입니다.

   ![Add the script](xcode-run-script-phase-2.png){width=700}

6. **Based on dependency analysis** 옵션을 비활성화합니다.

   이렇게 하면 Xcode가 모든 빌드 중에 스크립트를 실행하고, 매번 누락된 출력 의존성에 대해 경고하지 않도록 보장합니다.
7. **Run Script** 단계를 **Compile Sources** 단계보다 위로 이동시킵니다.

   ![Drag the Run Script phase](xcode-run-script-phase-3.png){width=700}

8. **Build Settings** 탭에서 **Build Options** 아래의 **User Script Sandboxing** 옵션을 비활성화합니다:

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 샌드박싱을 먼저 비활성화하지 않고 iOS 프로젝트를 빌드했다면 Gradle 데몬을 다시 시작해야 할 수 있습니다. 샌드박싱되었을 수 있는 Gradle 데몬 프로세스를 중지하세요:
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9. Xcode에서 프로젝트를 빌드합니다. 모든 것이 올바르게 설정되었다면, 프로젝트가 성공적으로 빌드될 것입니다.

> 기본 `Debug` 또는 `Release`와 다른 사용자 지정 빌드 구성이 있는 경우, **Build Settings** 탭의 **User-Defined** 아래에 `KOTLIN_FRAMEWORK_BUILD_TYPE` 설정을 추가하고 `Debug` 또는 `Release`로 설정하세요.
>
{style="note"}

## 다음 단계는?

Swift 패키지 매니저와 작업할 때도 로컬 통합의 이점을 활용할 수 있습니다. [로컬 패키지에서 Kotlin 프레임워크에 대한 의존성을 추가하는 방법 알아보기](multiplatform-spm-local-integration.md).