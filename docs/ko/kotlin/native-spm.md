---
title: "Swift 패키지 내보내기 설정"
---
:::info

   이것은 원격 통합 방식입니다. 다음과 같은 경우에 적합합니다:<br/>

   * 최종 애플리케이션의 코드베이스를 공통 코드베이스에서 분리하고 싶을 때.
   * 로컬 시스템에 iOS를 대상으로 하는 Kotlin Multiplatform 프로젝트를 이미 설정했을 때.
   * iOS 프로젝트에서 종속성을 처리하기 위해 Swift Package Manager를 사용할 때.<br/>

   [자신에게 가장 적합한 통합 방식을 선택하세요](multiplatform-ios-integration-overview)

:::

Apple 대상을 위한 Kotlin/Native 출력을 Swift Package Manager(SPM) 종속성으로 사용되도록 설정할 수 있습니다.

iOS 대상을 가진 Kotlin Multiplatform 프로젝트를 생각해 보세요. 이 iOS 바이너리를 네이티브 Swift 프로젝트에서 작업하는 iOS 개발자가 종속성으로 사용할 수 있도록 하고 싶을 수 있습니다. Kotlin Multiplatform 도구를 사용하면 해당 Xcode 프로젝트와 원활하게 통합되는 아티팩트를 제공할 수 있습니다.

이 튜토리얼에서는 Kotlin Gradle 플러그인을 사용하여 [XCFramework](multiplatform-build-native-binaries#build-xcframeworks)를 빌드하여 이를 수행하는 방법을 보여줍니다.

## 원격 통합 설정

프레임워크를 사용 가능하게 만들려면 다음 두 파일을 업로드해야 합니다.

* XCFramework가 포함된 ZIP 아카이브. 직접 액세스할 수 있는 편리한 파일 저장소에 업로드해야 합니다(예:
  아카이브가 첨부된 GitHub 릴리스 생성, Amazon S3 또는 Maven 사용).
  워크플로에 통합하기 가장 쉬운 옵션을 선택하세요.
* 패키지를 설명하는 `Package.swift` 파일. 별도의 Git 저장소에 푸시해야 합니다.

#### 프로젝트 구성 옵션

이 튜토리얼에서는 XCFramework를 선호하는 파일 저장소에 바이너리로 저장하고 `Package.swift` 파일을
별도의 Git 저장소에 저장합니다.

그러나 프로젝트를 다르게 구성할 수도 있습니다. Git 저장소를 구성하는 데 대한 다음 옵션을 고려하십시오.

* `Package.swift` 파일과 XCFramework로 패키징해야 하는 코드를 별도의 Git 저장소에 저장합니다.
  이렇게 하면 파일을 설명하는 프로젝트와 별도로 Swift manifest의 버전을 관리할 수 있습니다. 이는 권장되는 접근 방식입니다.
  확장이 용이하고 일반적으로 유지 관리하기가 더 쉽습니다.
* `Package.swift` 파일을 Kotlin Multiplatform 코드 옆에 놓습니다. 이것은 더 간단한 접근 방식이지만,
  이 경우 Swift 패키지와 코드가 동일한 버전 관리를 사용한다는 점에 유의하세요. SPM은
  패키지 버전 관리에 Git 태그를 사용하며, 이는 프로젝트에 사용되는 태그와 충돌할 수 있습니다.
* `Package.swift` 파일을 소비자 프로젝트의 저장소 내에 저장합니다. 이렇게 하면 버전 관리 및 유지 관리 문제를 피하는 데 도움이 됩니다.
  그러나 이 접근 방식은 소비자 프로젝트의 다중 저장소 SPM 설정 및 추가 자동화에 문제를 일으킬 수 있습니다.

  * 다중 패키지 프로젝트에서 하나의 소비자 패키지만 외부 모듈에 의존할 수 있습니다(종속성 충돌을 피하기 위해
    프로젝트 내에서). 따라서 Kotlin Multiplatform 모듈에 의존하는 모든 로직은
    특정 소비자 패키지에 캡슐화되어야 합니다.
  * 자동화된 CI 프로세스를 사용하여 Kotlin Multiplatform 프로젝트를 게시하는 경우 이 프로세스에는
    업데이트된 `Package.swift` 파일을 소비자 저장소에 게시하는 것이 포함되어야 합니다. 이로 인해
    소비자 저장소의 업데이트가 충돌할 수 있으므로 CI의 이러한 단계를 유지 관리하기가 어려울 수 있습니다.

### Multiplatform 프로젝트 구성

다음 예제에서 Kotlin Multiplatform 프로젝트의 공유 코드는 로컬로 `shared` 모듈에 저장됩니다.
프로젝트 구조가 다른 경우 코드 및 경로 예제에서 "shared"를 모듈 이름으로 바꾸십시오.

XCFramework 게시를 설정하려면 다음을 수행하십시오.

1. `shared/build.gradle.kts` 구성 파일을 iOS 대상 목록에 `XCFramework` 호출로 업데이트합니다.

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
   
2. Gradle 작업을 실행하여 프레임워크를 만듭니다.
   
   ```shell
   ./gradlew :shared:assembleSharedXCFramework
   ```
  
   결과 프레임워크는 프로젝트 디렉터리의 `shared/build/XCFrameworks/release/Shared.xcframework` 폴더로 생성됩니다.

   > Compose Multiplatform 프로젝트로 작업하는 경우 다음 Gradle 작업을 사용하십시오.
   >
   > ```shell
   > ./gradlew :composeApp:assembleSharedXCFramework
   > ```
   >
   > 그러면 결과 프레임워크를 `composeApp/build/XCFrameworks/release/Shared.xcframework` 폴더에서 찾을 수 있습니다.
   >
   

### XCFramework 및 Swift 패키지 manifest 준비

1. `Shared.xcframework` 폴더를 ZIP 파일로 압축하고 결과 아카이브에 대한 체크섬을 계산합니다(예:
   
   `swift package compute-checksum Shared.xcframework.zip`

2. ZIP 파일을 선택한 파일 저장소에 업로드합니다. 파일은 직접 링크로 액세스할 수 있어야 합니다. 예를 들어 GitHub의 릴리스를 사용하여 다음과 같이 할 수 있습니다.
<h3>GitHub 릴리스에 업로드</h3>
<list type="decimal">
<li><a href="https://github.com">GitHub</a>로 이동하여 계정에 로그인합니다.</li>
<li>릴리스를 만들려는 저장소로 이동합니다.</li>
<li>오른쪽의 <b>Releases</b> 섹션에서 <b>Create a new release</b> 링크를 클릭합니다.</li>
<li>릴리스 정보를 입력하고 새 태그를 추가하거나 만들고 릴리스 제목을 지정하고 설명을 작성합니다.</li>
<li>
<p>
   하단의 <b>Attach binaries by dropping them here or selecting them</b> 필드를 통해 XCFramework가 있는 ZIP 파일을 업로드합니다.
</p>
                   <img src="/img/github-release-description.png" alt="릴리스 정보 입력" width="700"/>
               </li>
<li><b>Publish release</b>를 클릭합니다.</li>
<li>
<p>
   릴리스의 <b>Assets</b> 섹션에서 ZIP 파일을 마우스 오른쪽 버튼으로 클릭하고 브라우저에서 <b>Copy link address</b> 또는 유사한 옵션을 선택합니다.
</p>
                   <img src="/img/github-release-link.png" alt="업로드된 파일에 대한 링크 복사" width="500"/>
               </li>
</list>
       
   

3. [권장 사항] 링크가 작동하는지, 파일을 다운로드할 수 있는지 확인합니다. 터미널에서 다음 명령을 실행합니다.

    ```none
    curl <업로드된 XCFramework ZIP 파일에 대한 다운로드 가능한 링크>
    ```

4. 디렉터리를 선택하고 다음 코드를 사용하여 로컬로 `Package.swift` 파일을 만듭니다.

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
            url: "<업로드된 XCFramework ZIP 파일에 대한 링크>",
            checksum:"<ZIP 파일에 대해 계산된 체크섬>")
      ]
   )
   ```
   
5. `url` 필드에서 XCFramework가 있는 ZIP 아카이브에 대한 링크를 지정합니다.
6. [권장 사항] 결과 manifest의 유효성을 검사하려면 디렉터리에서 다음 셸 명령을 실행할 수 있습니다.
   `Package.swift` 파일이 있습니다.

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    출력은 발견된 오류를 설명하거나 manifest가 올바른 경우 성공적인 다운로드 및 구문 분석 결과를 표시합니다.

7. `Package.swift` 파일을 원격 저장소에 푸시합니다. 패키지의 시맨틱 버전을 사용하여 Git 태그를 만들고 푸시해야 합니다.

### 패키지 종속성 추가

이제 두 파일에 모두 액세스할 수 있으므로 생성한 패키지에 대한 종속성을 기존 클라이언트 iOS
프로젝트에 추가하거나 새 프로젝트를 만들 수 있습니다. 패키지 종속성을 추가하려면 다음을 수행하십시오.

1. Xcode에서 **File | Add Package Dependencies**를 선택합니다.
2. 검색 필드에 `Package.swift` 파일이 있는 Git 저장소의 URL을 입력합니다.

   <img src="/img/native-spm-url.png" alt="패키지 파일이 있는 repo 지정" style={{verticalAlign: 'middle'}}/>

3. **Add package** 버튼을 누른 다음 패키지에 대한 제품 및 해당 대상을 선택합니다.

   > Swift 패키지를 만드는 경우 대화 상자가 다릅니다. 이 경우 **Copy package** 버튼을 누릅니다.
   > 이렇게 하면 `.package` 줄이 클립보드에 들어갑니다. 이 줄을 자신의 `Package.swift` 파일의 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency)
   > 블록에 붙여넣고 필요한 제품을 해당 `Target.Dependency` 블록에 추가합니다.
   >
   

### 설정 확인

모든 것이 올바르게 설정되었는지 확인하려면 Xcode에서 가져오기를 테스트합니다.

1. 프로젝트에서 UI 보기 파일(예: `ContentView.swift`)로 이동합니다.
2. 코드를 다음 스니펫으로 바꿉니다.
   
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
   
    여기서 `Shared` XCFramework를 가져온 다음 이를 사용하여 `Text` 필드에서 플랫폼 이름을 가져옵니다.

3. 미리 보기가 새 텍스트로 업데이트되었는지 확인합니다.

## 여러 모듈을 XCFramework로 내보내기

여러 Kotlin Multiplatform 모듈의 코드를 iOS 바이너리로 사용할 수 있도록 하려면 이러한 모듈을 단일
엄브렐라 모듈로 결합합니다. 그런 다음 이 엄브렐라 모듈의 XCFramework를 빌드하고 내보냅니다.

예를 들어 `network` 및 `database` 모듈이 있고 이를 `together` 모듈로 결합합니다.

1. `together/build.gradle.kts` 파일에서 종속성 및 프레임워크 구성을 지정합니다.

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget `->`
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

2. 포함된 각 모듈에는 iOS 대상이 구성되어 있어야 합니다(예:).

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

3. `together` 폴더 안에 빈 Kotlin 파일(예: `together/src/commonMain/kotlin/Together.kt`)을 만듭니다.
   이는 해결 방법입니다. Gradle 스크립트는 현재 내보낸 모듈에
   소스 코드가 없는 경우 프레임워크를 어셈블할 수 없습니다.

4. 프레임워크를 어셈블하는 Gradle 작업을 실행합니다.

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. [이전 섹션](#prepare-the-xcframework-and-the-swift-package-manifest)의 단계를 따라
   `together.xcframework`를 준비합니다. 보관하고, 체크섬을 계산하고, 보관된 XCFramework를 파일 저장소에 업로드하고,
   `Package.swift` 파일을 만들고 푸시합니다.

이제 Xcode 프로젝트에 종속성을 가져올 수 있습니다. `import together` 지시문을 추가한 후에는
Swift 코드에서 가져올 수 있는 `network` 및 `database` 모듈의 클래스가 모두 있어야 합니다.