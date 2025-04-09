---
title: "최종 네이티브 바이너리 빌드 (실험적 DSL)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::note
아래 설명된 새로운 DSL은 [Experimental](components-stability)입니다. 언제든지 변경될 수 있습니다.
평가 목적으로 사용하는 것이 좋습니다.

새로운 DSL이 작동하지 않으면 [이전 방식](multiplatform-build-native-binaries)을 참조하여
네이티브 바이너리를 빌드하세요.

[Kotlin/Native targets](multiplatform-dsl-reference#native-targets)은 `*.klib` 라이브러리 아티팩트로 컴파일됩니다.
이 아티팩트는 Kotlin/Native 자체에서 종속성으로 사용할 수 있지만 네이티브 라이브러리로는 사용할 수 없습니다.
 
최종 네이티브 바이너리를 선언하려면 `kotlinArtifacts` DSL과 함께 새로운 바이너리 형식을 사용하세요. 이 형식은 기본 `*.klib` 아티팩트 외에도 이 타겟을 위해 빌드된 네이티브 바이너리 모음을 나타내며, 이를 선언하고 구성하기 위한 메서드 집합을 제공합니다.
 
`kotlin-multiplatform` 플러그인은 기본적으로 프로덕션 바이너리를 생성하지 않습니다. 기본적으로 사용할 수 있는 유일한 바이너리는 `test` 컴파일에서 단위 테스트를 실행할 수 있게 해주는 디버그 테스트 실행 파일입니다.

:::

Kotlin artifact DSL을 사용하면 앱에서 여러 Kotlin 모듈에 액세스해야 하는 일반적인 문제를 해결하는 데 도움이 될 수 있습니다.
여러 Kotlin/Native 아티팩트의 사용이 제한되어 있으므로 새로운 DSL을 사용하여 여러 Kotlin 모듈을 단일
아티팩트로 내보낼 수 있습니다.

## 바이너리 선언

`kotlinArtifacts {}`는 Gradle 빌드 스크립트에서 아티팩트 구성을 위한 최상위 블록입니다. 다음 종류의 바이너리를 사용하여 `kotlinArtifacts {}` DSL의 요소를 선언합니다.

| 팩토리 메서드 | 바이너리 종류                                                                               | 사용 가능 대상                                |
|----------------|-------------------------------------------------------------------------------------------|----------------------------------------------|
| `sharedLib`    | [공유 네이티브 라이브러리](native-faq#how-do-i-create-a-shared-library)                   | `WebAssembly`을 제외한 모든 네이티브 타겟 |
| `staticLib`    | [정적 네이티브 라이브러리](native-faq#how-do-i-create-a-static-library-or-an-object-file) | `WebAssembly`을 제외한 모든 네이티브 타겟 |
| `framework`    | Objective-C framework                                                                     | macOS, iOS, watchOS 및 tvOS 타겟만 해당   |
| `fatFramework` | Universal fat framework                                                                   | macOS, iOS, watchOS 및 tvOS 타겟만 해당   |
| `XCFramework`  | XCFramework framework                                                                     | macOS, iOS, watchOS 및 tvOS 타겟만 해당   |

`kotlinArtifacts` 요소 내에서 다음 블록을 작성할 수 있습니다.

* [Native.Library](#library)
* [Native.Framework](#framework)
* [Native.FatFramework](#fat-frameworks)
* [Native.XCFramework](#xcframeworks)

가장 간단한 버전에서는 선택한 빌드 유형에 대한 `target` (또는 `targets`) 파라미터가 필요합니다. 현재
두 가지 빌드 유형을 사용할 수 있습니다.

* `DEBUG` – 디버그 정보가 포함된 최적화되지 않은 바이너리를 생성합니다.
* `RELEASE` – 디버그 정보가 없는 최적화된 바이너리를 생성합니다.

`modes` 파라미터에서는 바이너리를 생성할 빌드 유형을 지정할 수 있습니다. 기본값에는 `DEBUG`와 `RELEASE` 실행 파일 바이너리가 모두 포함됩니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library {
        target = iosX64 // 대신 타겟을 정의합니다.
        modes(DEBUG, RELEASE)
        // 바이너리 구성
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library {
        target = iosX64 // 대신 타겟을 정의합니다.
        modes(DEBUG, RELEASE)
        // 바이너리 구성
    }
}
```

</TabItem>
</Tabs>

다음과 같이 사용자 지정 이름으로 바이너리를 선언할 수도 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("mylib") {
        // 바이너리 구성
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("mylib") {
        // 바이너리 구성
    }
}
```

</TabItem>
</Tabs>

이 인수는 바이너리 파일의 기본 이름인 이름 접두사를 설정합니다. 예를 들어 Windows의 경우 코드는
`mylib.dll` 파일을 생성합니다.

## 바이너리 구성

바이너리 구성에 사용할 수 있는 일반적인 파라미터는 다음과 같습니다.

| **이름**        | **설명**                                                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isStatic`      | 라이브러리 유형을 정의하는 선택적 연결 유형입니다. 기본적으로 `false`이며 라이브러리는 동적입니다.                                              |
| `modes`         | 선택적 빌드 유형, `DEBUG` 및 `RELEASE`입니다.                                                                                                           |
| `kotlinOptions` | 컴파일에 적용되는 선택적 컴파일러 옵션입니다. 사용 가능한 [컴파일러 옵션](gradle-compiler-options) 목록을 참조하세요.                        |
| `addModule`     | 현재 모듈 외에도 결과 아티팩트에 다른 모듈을 추가할 수 있습니다.                                                                |
| `setModules`    | 결과 아티팩트에 추가될 모든 모듈 목록을 재정의할 수 있습니다.                                                                 |
| `target`        | 프로젝트의 특정 타겟을 선언합니다. 사용 가능한 타겟 이름은 [타겟](multiplatform-dsl-reference#targets) 섹션에 나열되어 있습니다. |

### 라이브러리 및 프레임워크

Objective-C framework 또는 네이티브 라이브러리(공유 또는 정적)를 빌드할 때 현재 프로젝트의 클래스뿐만 아니라
다른 멀티플랫폼 모듈의 클래스도 단일 엔터티로 패키징하고 이러한 모든
모듈을 내보내야 할 수 있습니다.

#### 라이브러리

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("myslib") {
        target = linuxX64
        isStatic = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("myslib") {
        target = linuxX64
        it.static = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
</Tabs>

등록된 Gradle 작업은 등록된 모든 유형의 "myslib"를 동적 라이브러리로 어셈블하는 `assembleMyslibSharedLibrary`입니다.

#### 프레임워크

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        isStatic = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        it.static = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
</Tabs>

등록된 Gradle 작업은 등록된 모든 유형의 "myframe" 프레임워크를 어셈블하는 `assembleMyframeFramework`입니다.

:::tip
새로운 DSL이 작동하지 않으면 [이전 방식](multiplatform-build-native-binaries#export-dependencies-to-binaries)을 사용하여
종속성을 바이너리로 내보내세요.

:::

### Fat framework

기본적으로 Kotlin/Native에서 생성된 Objective-C framework는 하나의 플랫폼만 지원합니다. 그러나 이러한
framework를 단일 universal(fat) 바이너리로 병합할 수 있습니다. 이는 특히 32비트 및 64비트 iOS framework에 적합합니다.
이 경우 결과 universal framework를 32비트 및 64비트 장치 모두에서 사용할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
</Tabs>

등록된 Gradle 작업은 등록된 모든 유형의 "myfatframe" fat framework를 어셈블하는 `assembleMyfatframeFatFramework`입니다.

:::tip
새로운 DSL이 작동하지 않으면 [이전 방식](multiplatform-build-native-binaries#build-universal-frameworks)을 사용하여
fat framework를 빌드하세요.

:::

### XCFramework

모든 Kotlin Multiplatform 프로젝트는 XCFramework를 출력으로 사용하여 모든 타겟 플랫폼 및
아키텍처에 대한 로직을 단일 번들에 모을 수 있습니다. [universal (fat) framework](#fat-frameworks)와 달리
App Store에 애플리케이션을 게시하기 전에 불필요한 아키텍처를 모두 제거할 필요가 없습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"),
            project(":lib")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"), 
            project(":lib")
        )
    }
}
```

</TabItem>
</Tabs>

등록된 Gradle 작업은 등록된 모든 유형의 "sdk" XCFramework를 어셈블하는 `assembleSdkXCFramework`입니다.

:::tip
새로운 DSL이 작동하지 않으면 [이전 방식](multiplatform-build-native-binaries#build-xcframeworks)을 사용하여
XCFramework를 빌드하세요.

:::