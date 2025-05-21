---
title: "CocoaPods Gradle 플러그인 DSL 참조"
---
Kotlin CocoaPods Gradle 플러그인은 Podspec 파일을 생성하는 도구입니다. 이러한 파일은 Kotlin 프로젝트를 [CocoaPods 종속성 관리자](https://cocoapods.org/)와 통합하는 데 필요합니다.

이 참조에는 [CocoaPods 통합](native-cocoapods)을 사용할 때 사용할 수 있는 Kotlin CocoaPods Gradle 플러그인의 블록, 함수 및 속성의 전체 목록이 포함되어 있습니다.

* [환경을 설정하고 Kotlin CocoaPods Gradle 플러그인을 구성하는 방법](native-cocoapods)을 알아보세요.
* 프로젝트 및 목적에 따라 [Kotlin 프로젝트와 Pod 라이브러리](native-cocoapods-libraries) 간의 종속성 및 [Kotlin Gradle 프로젝트와 Xcode 프로젝트](native-cocoapods-xcode) 간의 종속성을 추가할 수 있습니다.

## 플러그인 활성화

CocoaPods 플러그인을 적용하려면 `build.gradle(.kts)` 파일에 다음 줄을 추가하세요.

```kotlin
plugins {
   kotlin("multiplatform") version "2.1.20"
   kotlin("native.cocoapods") version "2.1.20"
}
```

플러그인 버전은 [Kotlin 릴리스 버전](releases)과 일치합니다. 최신 안정 버전은 2.1.20입니다.

## cocoapods 블록

`cocoapods` 블록은 CocoaPods 구성의 최상위 블록입니다. 여기에는 Pod 버전, 요약 및 홈페이지와 같은 필수 정보와 선택적 기능을 포함하여 Pod에 대한 일반 정보가 포함되어 있습니다.

다음 블록, 함수 및 속성을 내부에 사용할 수 있습니다.

| **이름**                              | **설명**                                                                                                                                                                                                                  | 
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Pod의 버전입니다. 지정하지 않으면 Gradle 프로젝트 버전이 사용됩니다. 이러한 속성이 구성되지 않으면 오류가 발생합니다.                                                                                                          |
| `summary`                             | 이 프로젝트에서 빌드된 Pod에 대한 필수 설명입니다.                                                                                                                                                                           |
| `homepage`                            | 이 프로젝트에서 빌드된 Pod의 홈페이지에 대한 필수 링크입니다.                                                                                                                                                                  |
| `authors`                             | 이 프로젝트에서 빌드된 Pod의 작성자를 지정합니다.                                                                                                                                                                             |
| `podfile`                             | 기존 `Podfile` 파일을 구성합니다.                                                                                                                                                                                           |
| `noPodspec()`                         | `cocoapods` 섹션에 대해 Podspec 파일을 생성하지 않도록 플러그인을 설정합니다.                                                                                                                                                |
| `name`                                | 이 프로젝트에서 빌드된 Pod의 이름입니다. 제공되지 않으면 프로젝트 이름이 사용됩니다.                                                                                                                                           |
| `license`                             | 이 프로젝트에서 빌드된 Pod의 라이선스, 유형 및 텍스트입니다.                                                                                                                                                                    |
| `framework`                           | framework 블록은 플러그인에서 생성된 프레임워크를 구성합니다.                                                                                                                                                                  |
| `source`                              | 이 프로젝트에서 빌드된 Pod의 위치입니다.                                                                                                                                                                                    |
| `extraSpecAttributes`                 | `libraries` 또는 `vendored_frameworks`와 같은 다른 Podspec 속성을 구성합니다.                                                                                                                                                  |
| `xcodeConfigurationToNativeBuildType` | 사용자 지정 Xcode 구성을 NativeBuildType에 매핑합니다. "Debug"를 `NativeBuildType.DEBUG`에, "Release"를 `NativeBuildType.RELEASE`에 매핑합니다.                                                                                  |
| `publishDir`                          | Pod 게시를 위한 출력 디렉터리를 구성합니다.                                                                                                                                                                                   |
| `pods`                                | Pod 종속성 목록을 반환합니다.                                                                                                                                                                                               |
| `pod()`                               | 이 프로젝트에서 빌드된 Pod에 CocoaPods 종속성을 추가합니다.                                                                                                                                                                   |
| `specRepos`                           | `url()`을 사용하여 사양 저장소를 추가합니다. 이는 개인 Pod가 종속성으로 사용될 때 필요합니다. 자세한 내용은 [CocoaPods 설명서](https://guides.cocoapods.org/making/private-cocoapods.html)를 참조하세요. |

### 타겟

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

각 타겟에 대해 `deploymentTarget` 속성을 사용하여 Pod 라이브러리의 최소 타겟 버전을 지정합니다.

적용되면 CocoaPods는 모든 타겟에 대해 `debug` 및 `release` 프레임워크를 출력 바이너리로 추가합니다.

```kotlin
kotlin {
    iosArm64()
   
    cocoapods {
        version = "2.0"
        name = "MyCocoaPod"
        summary = "CocoaPods 테스트 라이브러리"
        homepage = "https://github.com/JetBrains/kotlin"
        
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        license = "{ :type => 'MIT', :text => 'License text'}"
        source = "{ :git => 'git@github.com:vkormushkin/kmmpodlibrary.git', :tag => '$version' }"
        authors = "Kotlin Dev"
        
        specRepos {
            url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
        }
        pod("example")
        
        xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
   }
}
```

### framework 블록

`framework` 블록은 `cocoapods` 내부에 중첩되어 있으며 프로젝트에서 빌드된 Pod의 프레임워크 속성을 구성합니다.

:::note
`baseName`은 필수 필드입니다.

:::

| **이름**           | **설명**                                                                         | 
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | 필수 프레임워크 이름입니다. 더 이상 사용되지 않는 `frameworkName` 대신 이 속성을 사용하세요. |
| `isStatic`         | 프레임워크 연결 유형을 정의합니다. 기본적으로 동적입니다.                            |
| `transitiveExport` | 종속성 내보내기를 활성화합니다.                                                              |                                                      

```kotlin
kotlin {
    cocoapods {
        version = "2.0"
        framework {
            baseName = "MyFramework"
            isStatic = false
            export(project(":anotherKMMModule"))
            transitiveExport = true
        }
    }
}
```

## pod() 함수

`pod()` 함수 호출은 이 프로젝트에서 빌드된 Pod에 CocoaPods 종속성을 추가합니다. 각 종속성에는
별도의 함수 호출이 필요합니다.

함수 매개변수에서 Pod 라이브러리의 이름과 추가 매개변수 값(예: 라이브러리의 `version`
및 `source`)을 해당 구성 블록에 지정할 수 있습니다.

| **이름**                     | **설명**                                                                                                                                                                                                                                                                                    | 
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | 라이브러리 버전입니다. 라이브러리의 최신 버전을 사용하려면 매개변수를 생략하세요.                                                                                                                                                                                                                 |
| `source`                     | 다음을 사용하여 Pod를 구성합니다. <list><li>`git()`을 사용하는 Git 저장소. `git()` 뒤의 블록에서 특정 커밋을 사용하려면 `commit`을, 특정 태그를 사용하려면 `tag`를, 저장소의 특정 분기를 사용하려면 `branch`를 지정할 수 있습니다.</li><li>`path()`를 사용하는 로컬 저장소</li></list> |
| `packageName`                | 패키지 이름을 지정합니다.                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | Pod 라이브러리에 대한 옵션 목록을 지정합니다. 예를 들어 특정 플래그를 지정합니다. ```Kotlin
extraOpts = listOf("-compiler-option")
```                                                                                                                                        |
| `linkOnly`                   | cinterop 바인딩을 생성하지 않고 동적 프레임워크로 Pod 종속성을 사용하도록 CocoaPods 플러그인에 지시합니다. 정적 프레임워크와 함께 사용하면 옵션이 Pod 종속성을 완전히 제거합니다.                                                                                           |
| `interopBindingDependencies` | 다른 Pod에 대한 종속성 목록을 포함합니다. 이 목록은 새 Pod에 대한 Kotlin 바인딩을 빌드할 때 사용됩니다.                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 종속성으로 사용되는 기존 Pod의 이름을 지정합니다. 이 Pod는 함수 실행 전에 선언되어야 합니다. 이 함수는 새 Pod에 대한 바인딩을 빌드할 때 기존 Pod의 Kotlin 바인딩을 사용하도록 CocoaPods 플러그인에 지시합니다.                                     |

```kotlin
kotlin {
    iosArm64()
    cocoapods {
        version = "2.0"
        summary = "CocoaPods 테스트 라이브러리"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "16.0"
      
        pod("pod_dependency") {
            version = "1.0"
            extraOpts += listOf("-compiler-option")
            linkOnly = true
            source = path(project.file("../pod_dependency"))
        }
    }
}
```