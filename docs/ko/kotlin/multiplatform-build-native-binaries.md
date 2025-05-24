---
title: "최종 네이티브 바이너리 빌드"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

기본적으로 Kotlin/Native 타겟은 `*.klib` 라이브러리 아티팩트로 컴파일됩니다. 이 아티팩트는 Kotlin/Native 자체에서 의존성으로 사용할 수 있지만, 실행하거나 네이티브 라이브러리로 사용할 수는 없습니다.

실행 파일 또는 공유 라이브러리와 같은 최종 네이티브 바이너리를 선언하려면 네이티브 타겟의 `binaries` 속성을 사용하세요.
이 속성은 기본 `*.klib` 아티팩트 외에도 이 타겟을 위해 빌드된 네이티브 바이너리 컬렉션을 나타내며, 이를 선언하고 구성하기 위한 메서드 집합을 제공합니다.

:::note
`kotlin-multiplatform` 플러그인은 기본적으로 프로덕션 바이너리를 생성하지 않습니다. 기본적으로 사용 가능한 유일한 바이너리는
`test` 컴파일에서 유닛 테스트를 실행할 수 있게 해주는 디버그 테스트 실행 파일입니다.

:::

Kotlin/Native 컴파일러에서 생성된 바이너리에는 타사 코드, 데이터 또는 파생 작업이 포함될 수 있습니다.
즉, Kotlin/Native로 컴파일된 최종 바이너리를 배포하는 경우,
항상 필요한 [라이선스 파일](native-binary-licenses)을 바이너리 배포에 포함해야 합니다.

## 바이너리 선언

`binaries` 컬렉션의 요소를 선언하려면 다음 팩토리 메서드를 사용하세요.

| 팩토리 메서드 | 바이너리 종류           | 사용 가능한 타겟                                |
|----------------|-----------------------|----------------------------------------------|
| `executable`   | 제품 실행 파일    | 모든 네이티브 타겟                           |
| `test`         | 테스트 실행 파일       | 모든 네이티브 타겟                           |
| `sharedLib`    | 공유 네이티브 라이브러리 | `WebAssembly`를 제외한 모든 네이티브 타겟 |
| `staticLib`    | 정적 네이티브 라이브러리 | `WebAssembly`를 제외한 모든 네이티브 타겟 |
| `framework`    | Objective-C framework | macOS, iOS, watchOS, 및 tvOS 타겟만 해당   |

가장 간단한 버전은 추가 매개변수가 필요하지 않으며 각 빌드 유형에 대해 하나의 바이너리를 생성합니다. 현재,
두 가지 빌드 유형을 사용할 수 있습니다:

* `DEBUG` – 디버그 정보가 포함된 비최적화 바이너리를 생성합니다.
* `RELEASE` – 디버그 정보가 없는 최적화 바이너리를 생성합니다.

다음 스니펫은 디버그 및 릴리스의 두 가지 실행 파일 바이너리를 생성합니다:

```kotlin
kotlin {
    linuxX64 { // 타겟을 대신 정의하세요.
        binaries {
            executable {
                // 바이너리 구성.
            }
        }
    }
}
```

[추가 구성](multiplatform-dsl-reference#native-targets)이 필요하지 않은 경우 람다를 생략할 수 있습니다:

```kotlin
binaries {
    executable()
}
```

바이너리를 생성할 빌드 유형을 지정할 수 있습니다. 다음 예에서는 `debug` 실행 파일만 생성됩니다:

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 바이너리 구성.
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable([DEBUG]) {
        // 바이너리 구성.
    }
}
```

</TabItem>
</Tabs>

사용자 지정 이름으로 바이너리를 선언할 수도 있습니다:

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 바이너리 구성.
    }

    // 빌드 유형 목록을 생략할 수 있습니다
    // (이 경우 사용 가능한 모든 빌드 유형이 사용됩니다).
    executable("bar") {
        // 바이너리 구성.
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 바이너리 구성.
    }

    // 빌드 유형 목록을 생략할 수 있습니다
    // (이 경우 사용 가능한 모든 빌드 유형이 사용됩니다).
    executable('bar') {
        // 바이너리 구성.
    }
}
```

</TabItem>
</Tabs>

첫 번째 인수는 바이너리 파일의 기본 이름인 이름 접두사를 설정합니다. 예를 들어, Windows의 경우 코드는
`foo.exe` 및 `bar.exe` 파일을 생성합니다. 이름 접두사를 사용하여 [빌드 스크립트에서 바이너리에 액세스](#access-binaries)할 수도 있습니다.

## 바이너리 액세스

바이너리에 액세스하여 [구성](multiplatform-dsl-reference#native-targets)하거나 해당 속성(예: 출력 파일 경로)을 가져올 수 있습니다.

고유한 이름으로 바이너리를 가져올 수 있습니다. 이 이름은 이름 접두사(지정된 경우), 빌드 유형 및
바이너리 종류를 기반으로 다음 패턴을 따릅니다: `<선택적-이름-접두사><빌드-유형><바이너리-종류>`, 예를 들어 `releaseFramework` 또는
`testDebugExecutable`입니다.

:::note
정적 및 공유 라이브러리에는 각각 static 및 shared 접미사가 있습니다(예: `fooDebugStatic` 또는 `barReleaseShared`).

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// 그러한 바이너리가 없으면 실패합니다.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 그러한 바이너리가 없으면 null을 반환합니다.
binaries.findByName("fooDebugExecutable")
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 그러한 바이너리가 없으면 실패합니다.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 그러한 바이너리가 없으면 null을 반환합니다.
binaries.findByName('fooDebugExecutable')
```

</TabItem>
</Tabs>

또는 유형화된 getter를 사용하여 이름 접두사 및 빌드 유형별로 바이너리에 액세스할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// 그러한 바이너리가 없으면 실패합니다.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 이름 접두사가 설정되지 않은 경우 첫 번째 인수를 건너뜁니다.
binaries.getExecutable("bar", "DEBUG") // 빌드 유형에 문자열을 사용할 수도 있습니다.

// 유사한 getter는 다른 바이너리 종류에 사용할 수 있습니다:
// getFramework, getStaticLib 및 getSharedLib.

// 그러한 바이너리가 없으면 null을 반환합니다.
binaries.findExecutable("foo", DEBUG)

// 유사한 getter는 다른 바이너리 종류에 사용할 수 있습니다:
// findFramework, findStaticLib 및 findSharedLib.
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 그러한 바이너리가 없으면 실패합니다.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 이름 접두사가 설정되지 않은 경우 첫 번째 인수를 건너뜁니다.
binaries.getExecutable('bar', 'DEBUG') // 빌드 유형에 문자열을 사용할 수도 있습니다.

// 유사한 getter는 다른 바이너리 종류에 사용할 수 있습니다:
// getFramework, getStaticLib 및 getSharedLib.

// 그러한 바이너리가 없으면 null을 반환합니다.
binaries.findExecutable('foo', DEBUG)

// 유사한 getter는 다른 바이너리 종류에 사용할 수 있습니다:
// findFramework, findStaticLib 및 findSharedLib.
```

</TabItem>
</Tabs>

## 바이너리로 의존성 내보내기

Objective-C framework 또는 네이티브 라이브러리(공유 또는 정적)를 빌드할 때 현재 프로젝트의 클래스뿐만 아니라 해당 의존성의 클래스도 패키징해야 할 수 있습니다. `export` 메서드를 사용하여 바이너리로 내보낼 의존성을 지정합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 내보내집니다.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // 내보내지 않습니다.
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // 서로 다른 바이너리에 서로 다른 의존성 집합을 내보낼 수 있습니다.
            export(project(':dependency'))
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 내보내집니다.
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // 내보내지 않습니다.
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // 서로 다른 바이너리에 서로 다른 의존성 집합을 내보낼 수 있습니다.
            export project(':dependency')
        }
    }
}
```

</TabItem>
</Tabs>

예를 들어, Kotlin에서 여러 모듈을 구현하고 Swift에서 해당 모듈에 액세스하려고 합니다. Swift 애플리케이션에서 여러 Kotlin/Native framework를 사용하는 것은 제한적이지만, umbrella framework를 생성하고
이러한 모든 모듈을 해당 framework로 내보낼 수 있습니다.

:::note
해당 소스 세트의 [`api` 의존성](gradle-configure-project#dependency-types)만 내보낼 수 있습니다.

:::

의존성을 내보내면 해당 의존성의 모든 API가 framework API에 포함됩니다.
컴파일러는 해당 의존성의 코드 중 일부만 사용하더라도 해당 코드를 framework에 추가합니다.
이렇게 하면 내보낸 의존성(및 어느 정도까지는 해당 의존성의 의존성)에 대해 데드 코드 제거가 비활성화됩니다.

기본적으로 내보내기는 비전이적으로 작동합니다. 즉, 라이브러리 `bar`에 의존하는 라이브러리 `foo`를 내보내는 경우
`foo`의 메서드만 출력 framework에 추가됩니다.

`transitiveExport` 옵션을 사용하여 이 동작을 변경할 수 있습니다. `true`로 설정하면 라이브러리 `bar`의 선언도
내보내집니다.

:::caution
`transitiveExport`는 사용하지 않는 것이 좋습니다. 내보낸 의존성의 모든 전이적 의존성을 framework에 추가하기 때문입니다.
이렇게 하면 컴파일 시간과 바이너리 크기가 모두 늘어날 수 있습니다.

대부분의 경우 이러한 모든 의존성을 framework API에 추가할 필요가 없습니다.
Swift 또는 Objective-C 코드에서 직접 액세스해야 하는 의존성에 대해 명시적으로 `export`를 사용하세요.

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 전이적으로 내보냅니다.
        transitiveExport = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    framework {
        export project(':dependency')
        // 전이적으로 내보냅니다.
        transitiveExport = true
    }
}
```

</TabItem>
</Tabs>

## 유니버설 framework 빌드

기본적으로 Kotlin/Native에서 생성된 Objective-C framework는 하나의 플랫폼만 지원합니다. 그러나 [`lipo` 도구](https://llvm.org/docs/CommandGuide/llvm-lipo.html)를 사용하여 이러한
framework를 단일 유니버설(fat) 바이너리로 병합할 수 있습니다.
이 작업은 특히 32비트 및 64비트 iOS framework에 유용합니다. 이 경우 결과 유니버설
framework를 32비트 및 64비트 장치 모두에서 사용할 수 있습니다.

:::caution
fat framework는 초기 framework와 동일한 기본 이름을 가져야 합니다. 그렇지 않으면 오류가 발생합니다.

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 타겟을 생성하고 구성합니다.
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }
    // fat framework를 빌드하는 작업을 생성합니다.
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // fat framework는 초기 framework와 동일한 기본 이름을 가져야 합니다.
        baseName = "my_framework"
        // 기본 대상 디렉터리는 "<빌드 디렉터리>/fat-framework"입니다.
        destinationDir = buildDir.resolve("fat-framework/debug")
        // 병합할 framework를 지정합니다.
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 타겟을 생성하고 구성합니다.
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }
    // fat framework를 빌드하는 작업을 생성합니다.
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // fat framework는 초기 framework와 동일한 기본 이름을 가져야 합니다.
        baseName = "my_framework"
        // 기본 대상 디렉터리는 "<빌드 디렉터리>/fat-framework"입니다.
        destinationDir = file("$buildDir/fat-framework/debug")
        // 병합할 framework를 지정합니다.
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
</Tabs>

## XCFramework 빌드

모든 Kotlin Multiplatform 프로젝트는 XCFramework를 출력으로 사용하여 모든 대상 플랫폼 및 아키텍처에 대한 로직을 단일 번들에 모을 수 있습니다.
[유니버설 (fat) framework](#build-universal-frameworks)와 달리 애플리케이션을 App Store에 게시하기 전에 불필요한 모든 아키텍처를 제거할 필요가 없습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "2.1.20"
}

kotlin {
    val xcf = XCFramework()
    val iosTargets = listOf(iosX64(), iosArm64(), iosSimulatorArm64())
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)
    def iosTargets = [iosX64(), iosArm64(), iosSimulatorArm64()]
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = 'shared'
            xcf.add(it)
        }
    }
}
```

</TabItem>
</Tabs>

XCFramework를 선언하면 Kotlin Gradle 플러그인이 여러 Gradle 작업을 등록합니다.

* `assembleXCFramework`
* `assemble<Framework name>DebugXCFramework`
* `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

프로젝트에서 [CocoaPods 통합](native-cocoapods)을 사용하는 경우 Kotlin
CocoaPods Gradle 플러그인을 사용하여 XCFramework를 빌드할 수 있습니다. 여기에는 등록된 모든 타겟으로 XCFramework를 빌드하고
podspec 파일을 생성하는 다음 작업이 포함됩니다.

* `podPublishReleaseXCFramework`: 릴리스 XCFramework와 함께 podspec 파일을 생성합니다.
* `podPublishDebugXCFramework`: 디버그 XCFramework와 함께 podspec 파일을 생성합니다.
* `podPublishXCFramework`: 디버그 및 릴리스 XCFramework를 모두 podspec 파일과 함께 생성합니다.

이를 통해 CocoaPods를 통해 모바일 앱과 별도로 프로젝트의 공유 부분을 배포할 수 있습니다. XCFramework를 사용하여
개인 또는 공용 podspec 리포지토리에 게시할 수도 있습니다.

:::caution
Kotlin framework를 서로 다른 버전의 Kotlin용으로 빌드한 경우 공용 리포지토리에 게시하는 것은 권장되지 않습니다.
이렇게 하면 최종 사용자의 프로젝트에서 충돌이 발생할 수 있습니다.

:::

## Info.plist 파일 사용자 지정

framework를 생성할 때 Kotlin/Native 컴파일러는 정보 속성 목록 파일 `Info.plist`를 생성합니다.
해당 바이너리 옵션을 사용하여 해당 속성을 사용자 지정할 수 있습니다.

| 속성                     | 바이너리 옵션              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

이 기능을 활성화하려면 `-Xbinary=$option=$value` 컴파일러 플래그를 전달하거나 특정 framework에 대해 `binaryOption("option", "value")`
Gradle DSL을 설정합니다.

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```
```