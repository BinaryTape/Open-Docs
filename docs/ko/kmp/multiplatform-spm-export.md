[//]: # (title: Swift 패키지 내보내기 설정)

<tldr>
   원격 통합 방식입니다. 다음과 같은 경우에 적합합니다:<br/>

   * 최종 애플리케이션의 코드베이스를 공통 코드베이스와 분리하고 싶을 때.
   * 로컬 머신에 이미 iOS를 대상으로 하는 Kotlin Multiplatform 프로젝트를 설정했을 때.
   * iOS 프로젝트에서 Swift Package Manager를 사용하여 의존성을 관리할 때.<br/>

   [가장 적합한 통합 방식 선택하기](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native 출력을 Apple 타겟용 Swift Package Manager(SPM) 의존성으로 사용하도록 설정할 수 있습니다.

iOS 타겟을 포함하는 Kotlin Multiplatform 프로젝트를 고려해 보세요. 이 iOS 바이너리를 네이티브 Swift 프로젝트에서 작업하는 iOS 개발자에게 의존성으로 제공하고 싶을 수 있습니다. Kotlin Multiplatform 툴링을 사용하면 Xcode 프로젝트와 원활하게 통합될 아티팩트를 제공할 수 있습니다.

이 튜토리얼에서는 Kotlin Gradle 플러그인을 사용하여 [XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks)를 빌드하는 방법을 보여줍니다.

## 원격 통합 설정

프레임워크를 사용할 수 있게 하려면 두 가지 파일을 업로드해야 합니다:

*   XCFramework가 포함된 ZIP 아카이브. 직접 액세스 가능한 편리한 파일 저장소에 업로드해야 합니다(예: 아카이브가 첨부된 GitHub 릴리스 생성, Amazon S3 또는 Maven 사용). 워크플로에 가장 쉽게 통합할 수 있는 옵션을 선택하세요.
*   패키지를 설명하는 `Package.swift` 파일. 별도의 Git 저장소에 푸시해야 합니다.

#### 프로젝트 구성 옵션 {initial-collapse-state="collapsed" collapsible="true"}

이 튜토리얼에서는 XCFramework를 바이너리로 선호하는 파일 저장소에 저장하고, `Package.swift` 파일은 별도의 Git 저장소에 저장합니다.

하지만 프로젝트를 다르게 구성할 수도 있습니다. Git 저장소를 구성하는 다음 옵션들을 고려해 보세요:

*   `Package.swift` 파일과 XCFramework로 패키징될 코드를 별도의 Git 저장소에 저장합니다. 이렇게 하면 Swift 매니페스트를 파일이 설명하는 프로젝트와 별도로 버전 관리할 수 있습니다. 이는 확장 가능하고 일반적으로 유지 관리가 더 쉽기 때문에 권장되는 접근 방식입니다.
*   `Package.swift` 파일을 Kotlin Multiplatform 코드 옆에 둡니다. 이는 더 간단한 접근 방식이지만, 이 경우 Swift 패키지와 코드가 동일한 버전 관리를 사용하게 된다는 점을 명심하십시오. SPM은 패키지 버전 관리에 Git 태그를 사용하며, 이는 프로젝트에 사용되는 태그와 충돌할 수 있습니다.
*   `Package.swift` 파일을 소비자 프로젝트의 저장소 내부에 저장합니다. 이렇게 하면 버전 관리 및 유지 관리 문제를 피할 수 있습니다. 그러나 이 접근 방식은 소비자 프로젝트의 다중 저장소 SPM 설정 및 추가 자동화에서 문제를 일으킬 수 있습니다:

    *   다중 패키지 프로젝트에서는 하나의 소비자 패키지만 외부 모듈에 의존할 수 있습니다(프로젝트 내 의존성 충돌을 피하기 위해). 따라서 Kotlin Multiplatform 모듈에 의존하는 모든 로직은 특정 소비자 패키지에 캡슐화되어야 합니다.
    *   자동화된 CI 프로세스를 사용하여 Kotlin Multiplatform 프로젝트를 게시하는 경우, 이 프로세스에는 업데이트된 `Package.swift` 파일을 소비자 저장소에 게시하는 것이 포함되어야 합니다. 이는 소비자 저장소의 충돌 업데이트로 이어질 수 있으므로 CI에서 이러한 단계를 유지 관리하기 어려울 수 있습니다.

### 멀티플랫폼 프로젝트 구성

다음 예시에서 Kotlin Multiplatform 프로젝트의 공유 코드는 `shared` 모듈에 로컬로 저장됩니다. 프로젝트 구조가 다르다면 코드 및 경로 예시에서 "shared"를 모듈 이름으로 바꾸십시오.

XCFramework 게시를 설정하려면:

1.  `shared/build.gradle.kts` 구성 파일의 iOS 타겟 목록에 `XCFramework` 호출을 추가하여 업데이트합니다:

    ```kotlin
    import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
    
    kotlin {
        // Other Kotlin Multiplatform targets
        // ...
        // Name of the module to be imported in the consumer project
        val xcframeworkName = "Shared"
        val xcf = XCFramework(xcframeworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64(),
        ).forEach { 
            it.binaries.framework {
                baseName = xcframeworkName
                
                // Specify CFBundleIdentifier to uniquely identify the framework
                binaryOption("bundleId", "org.example.${xcframeworkName}")
                xcf.add(this)
                isStatic = true
            }
        }
        //...
    }
    ```

2.  프레임워크를 생성하기 위해 Gradle 태스크를 실행합니다:

    ```shell
    ./gradlew :shared:assembleSharedXCFramework
    ```

    결과 프레임워크는 프로젝트 디렉토리 내 `shared/build/XCFrameworks/release/Shared.xcframework` 폴더로 생성됩니다.

    > Compose Multiplatform 프로젝트를 사용하는 경우 다음 Gradle 태스크를 사용하십시오:
    >
    > ```shell
    > ./gradlew :composeApp:assembleSharedXCFramework
    > ```
    >
    > 그런 다음 `composeApp/build/XCFrameworks/release/Shared.xcframework` 폴더에서 결과 프레임워크를 찾을 수 있습니다.
    >
    {style="tip"}

### XCFramework 및 Swift 패키지 매니페스트 준비

1.  `Shared.xcframework` 폴더를 ZIP 파일로 압축하고, 예를 들어 결과 아카이브에 대한 체크섬을 계산합니다:

    `swift package compute-checksum Shared.xcframework.zip`

2.  선택한 파일 저장소에 ZIP 파일을 업로드합니다. 파일은 직접 링크로 액세스할 수 있어야 합니다. 예를 들어, GitHub 릴리스를 사용하여 이 작업을 수행하는 방법은 다음과 같습니다:

    <deflist collapsible="true">
        <def title="GitHub 릴리스에 업로드">
            <list type="decimal">
                <li><a href="https://github.com">GitHub</a>로 이동하여 계정에 로그인하십시오.</li>
                <li>릴리스를 생성하려는 저장소로 이동하십시오.</li>
                <li>오른쪽의 <b>Releases</b> 섹션에서 <b>Create a new release</b> 링크를 클릭하십시오.</li>
                <li>릴리스 정보를 입력하고, 새 태그를 추가하거나 생성하며, 릴리스 제목을 지정하고 설명을 작성하십시오.</li>
                <li>
                    <p>하단의 <b>Attach binaries by dropping them here or selecting them</b> 필드를 통해 XCFramework가 포함된 ZIP 파일을 업로드하십시오:</p>
                    <img src="github-release-description.png" alt="Fill in the release information" width="700"/>
                </li>
                <li><b>Publish release</b>를 클릭하십시오.</li>
                <li>
                    <p>릴리스의 <b>Assets</b> 섹션에서 ZIP 파일을 마우스 오른쪽 버튼으로 클릭하고 브라우저에서 <b>링크 주소 복사</b> 또는 유사한 옵션을 선택하십시오:</p>
                    <img src="github-release-link.png" alt="Copy the link to the uploaded file" width="500"/>
                </li>
          </list>
        </def>
    </deflist>

3.  [권장] 링크가 작동하고 파일이 다운로드되는지 확인하십시오. 터미널에서 다음 명령어를 실행하십시오:

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4.  임의의 디렉토리를 선택하고 다음 코드로 `Package.swift` 파일을 로컬로 생성하십시오:

    ```Swift
    // swift-tools-version:5.3
    import PackageDescription
    
    let package = Package(
       name: "Shared",
       platforms: [
         .iOS(.v14),
       ],
       products: [
          .library(name: "Shared", targets: ["Shared"])
       ],
       targets: [
          .binaryTarget(
             name: "Shared",
             url: "<link to the uploaded XCFramework ZIP file>",
             checksum:"<checksum calculated for the ZIP file>")
       ]
    )
    ```

5.  `url` 필드에 XCFramework가 포함된 ZIP 아카이브 링크를 지정하십시오.
6.  [권장] 결과 매니페스트를 검증하려면 `Package.swift` 파일이 있는 디렉토리에서 다음 셸 명령어를 실행할 수 있습니다:

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```

    출력은 발견된 오류를 설명하거나 매니페스트가 올바른 경우 성공적인 다운로드 및 구문 분석 결과를 보여줍니다.

7.  `Package.swift` 파일을 원격 저장소에 푸시하십시오. 패키지의 시맨틱 버전으로 Git 태그를 생성하고 푸시해야 합니다.

### 패키지 의존성 추가

이제 두 파일 모두 액세스 가능하므로, 생성한 패키지에 대한 의존성을 기존 클라이언트 iOS 프로젝트에 추가하거나 새 프로젝트를 생성할 수 있습니다. 패키지 의존성을 추가하려면:

1.  Xcode에서 **File | Add Package Dependencies**를 선택합니다.
2.  검색 필드에 `Package.swift` 파일이 있는 Git 저장소의 URL을 입력합니다:

    ![Specify repo with the package file](multiplatform-spm-url.png)

3.  **Add package** 버튼을 클릭한 다음, 패키지에 대한 제품과 해당 타겟을 선택합니다.

    > Swift 패키지를 만드는 경우 대화 상자가 다릅니다. 이 경우 **Copy package** 버튼을 클릭합니다. 이렇게 하면 `.package` 줄이 클립보드에 복사됩니다. 이 줄을 자체 `Package.swift` 파일의 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency) 블록에 붙여넣고 필요한 제품을 적절한 `Target.Dependency` 블록에 추가하십시오.
    >
    {style="tip"}

### 설정 확인

모든 것이 올바르게 설정되었는지 확인하려면 Xcode에서 가져오기를 테스트하십시오:

1.  프로젝트에서 UI 뷰 파일로 이동하십시오. 예를 들어, `ContentView.swift`.
2.  코드를 다음 스니펫으로 대체하십시오:

    ```Swift
    import SwiftUI
    import Shared
    
    struct ContentView: View {
        var body: some View {
            VStack {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Hello, world! \(Shared.Platform_iosKt.getPlatform().name)")
            }
            .padding()
        }
    }
    
    #Preview {
        ContentView()
    }
    ```

    여기서는 `Shared` XCFramework를 가져와서 `Text` 필드에서 플랫폼 이름을 얻는 데 사용합니다.

3.  미리 보기가 새 텍스트로 업데이트되었는지 확인하십시오.

## 여러 모듈을 XCFramework로 내보내기

여러 Kotlin Multiplatform 모듈의 코드를 iOS 바이너리로 사용할 수 있게 하려면, 이 모듈들을 하나의 우산 모듈로 결합하십시오. 그런 다음 이 우산 모듈의 XCFramework를 빌드하고 내보내십시오.

예를 들어, `network` 및 `database` 모듈이 있고, 이를 `together` 모듈로 결합한다고 가정합니다:

1.  `together/build.gradle.kts` 파일에서 의존성 및 프레임워크 구성을 지정하십시오:

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            // Same as in the example above,
            // with added export calls for dependencies
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // Dependencies set as "api" (as opposed to "implementation") to export underlying modules
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2.  포함된 각 모듈은 iOS 타겟이 구성되어 있어야 합니다. 예를 들어:

    ```kotlin
    kotlin {
        androidTarget {
            //...
        }
        
        iosX64()
        iosArm64()
        iosSimulatorArm64()
        
        //...
    }
    ```

3.  `together` 폴더 안에 빈 Kotlin 파일을 생성하십시오. 예를 들어, `together/src/commonMain/kotlin/Together.kt`. 이는 내보내진 모듈에 소스 코드가 포함되어 있지 않으면 Gradle 스크립트가 프레임워크를 조립할 수 없는 현재의 임시 해결책입니다.

4.  프레임워크를 조립하는 Gradle 태스크를 실행하십시오:

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5.  `together.xcframework`를 준비하기 위해 [이전 섹션](#prepare-the-xcframework-and-the-swift-package-manifest)의 단계를 따르십시오: 아카이브하고, 체크섬을 계산하고, 아카이브된 XCFramework를 파일 저장소에 업로드하고, `Package.swift` 파일을 생성하고 푸시하십시오.

이제 Xcode 프로젝트로 의존성을 가져올 수 있습니다. `import together` 지시문을 추가한 후에는 Swift 코드에서 `network` 및 `database` 모듈의 클래스를 모두 가져올 수 있어야 합니다.