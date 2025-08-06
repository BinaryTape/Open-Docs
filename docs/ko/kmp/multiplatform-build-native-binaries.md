[//]: # (title: 최종 네이티브 바이너리 빌드)

기본적으로 Kotlin/Native 타겟은 `*.klib` 라이브러리 아티팩트로 컴파일됩니다. 이 아티팩트는 Kotlin/Native 자체에서 의존성으로 사용될 수는 있지만, 실행되거나 네이티브 라이브러리로 사용될 수는 없습니다.

실행 파일(executables) 또는 공유 라이브러리(shared libraries)와 같은 최종 네이티브 바이너리(final native binaries)를 선언하려면 네이티브 타겟의 `binaries` 속성을 사용하세요. 이 속성은 기본 `*.klib` 아티팩트 외에 이 타겟용으로 빌드된 네이티브 바이너리 컬렉션을 나타내며, 바이너리를 선언하고 구성하는 일련의 메서드를 제공합니다.

> `kotlin-multiplatform` 플러그인은 기본적으로 프로덕션 바이너리를 생성하지 않습니다. 기본적으로 사용 가능한 유일한 바이너리는 `test` 컴파일레이션에서 단위 테스트를 실행할 수 있게 해주는 디버그 테스트 실행 파일입니다.
>
{style="note"}

Kotlin/Native 컴파일러가 생성하는 바이너리에는 타사 코드, 데이터 또는 파생 작업이 포함될 수 있습니다. 즉, Kotlin/Native로 컴파일된 최종 바이너리를 배포하는 경우, 바이너리 배포판에 항상 필요한 [라이선스 파일](https://kotlinlang.org/docs/native-binary-licenses.html)을 포함해야 합니다.

## 바이너리 선언

`binaries` 컬렉션의 요소를 선언하려면 다음 팩토리 메서드를 사용하세요.

| 팩토리 메서드(Factory method) | 바이너리 종류(Binary kind) | 사용 가능(Available for)           |
|----------------------------|--------------------|---------------------------------|
| `executable`               | 제품 실행 파일     | 모든 네이티브 타겟             |
| `test`                     | 테스트 실행 파일   | 모든 네이티브 타겟             |
| `sharedLib`                | 공유 네이티브 라이브러리 | 모든 네이티브 타겟             |
| `staticLib`                | 정적 네이티브 라이브러리 | 모든 네이티브 타겟             |
| `framework`                | Objective-C 프레임워크 | macOS, iOS, watchOS 및 tvOS 타겟 전용 |

가장 간단한 버전은 추가 매개변수를 필요로 하지 않으며 각 빌드 유형에 대해 하나의 바이너리를 생성합니다. 현재 두 가지 빌드 유형을 사용할 수 있습니다.

*   `DEBUG` – [디버거 도구](https://kotlinlang.org/docs/native-debugging.html)를 사용할 때 유용한 추가 메타데이터가 포함된 최적화되지 않은 바이너리를 생성합니다.
*   `RELEASE` – 디버그 정보가 없는 최적화된 바이너리를 생성합니다.

다음 스니펫은 두 개의 실행 파일 바이너리(디버그 및 릴리스)를 생성합니다.

```kotlin
kotlin {
    linuxX64 { // Define your target instead.
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

[추가 구성](multiplatform-dsl-reference.md#native-targets)이 필요 없는 경우 람다를 생략할 수 있습니다.

```kotlin
binaries {
    executable()
}
```

바이너리를 생성할 빌드 유형을 지정할 수 있습니다. 다음 예제에서는 `debug` 실행 파일만 생성됩니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // Binary configuration.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // Binary configuration.
    }
}
```

</tab>
</tabs>

사용자 지정 이름으로 바이너리를 선언할 수도 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types
    // (in this case, all the available build types will be used).
    executable("bar") {
        // Binary configuration.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types
    // (in this case, all the available build types will be used).
    executable('bar') {
        // Binary configuration.
    }
}
```

</tab>
</tabs>

첫 번째 인수는 이진 파일의 기본 이름인 이름 접두사(name prefix)를 설정합니다. 예를 들어, Windows의 경우 이 코드는 `foo.exe` 및 `bar.exe` 파일을 생성합니다. 또한 이름 접두사를 사용하여 [빌드 스크립트에서 바이너리에 액세스](#access-binaries)할 수 있습니다.

## 바이너리 액세스

바이너리에 액세스하여 [구성](multiplatform-dsl-reference.md#native-targets)하거나 속성(예: 출력 파일 경로)을 가져올 수 있습니다.

고유한 이름으로 바이너리를 가져올 수 있습니다. 이 이름은 이름 접두사(지정된 경우), 빌드 유형 및 바이너리 종류를 `<optional-name-prefix><build-type><binary-kind>` 패턴으로 따릅니다. 예를 들어, `releaseFramework` 또는 `testDebugExecutable`과 같습니다.

> 정적 및 공유 라이브러리에는 각각 `static` 및 `shared` 접미사가 붙습니다. 예를 들어, `fooDebugStatic` 또는 `barReleaseShared`와 같습니다.
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Fails if there is no such binary.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// Returns null if there is no such binary.
binaries.findByName("fooDebugExecutable")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Fails if there is no such binary.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// Returns null if there is no such binary.
binaries.findByName('fooDebugExecutable')
```

</tab>
</tabs>

또는 이름 접두사와 빌드 유형을 사용하여 타입이 지정된 게터(typed getters)로 바이너리에 액세스할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Fails if there is no such binary.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable("bar", "DEBUG") // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such binary.
binaries.findExecutable("foo", DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Fails if there is no such binary.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable('bar', 'DEBUG') // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such binary.
binaries.findExecutable('foo', DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</tab>
</tabs>

## 바이너리로 의존성 내보내기

Objective-C 프레임워크 또는 네이티브 라이브러리(공유 또는 정적)를 빌드할 때 현재 프로젝트의 클래스뿐만 아니라 의존성 클래스도 패키징해야 할 수 있습니다. `export` 메서드를 사용하여 어떤 의존성을 바이너리로 내보낼지 지정합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // Will not be exported.
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export(project(':dependency'))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // Will not be exported.
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export project(':dependency')
        }
    }
}
```

</tab>
</tabs>

예를 들어, Kotlin으로 여러 모듈을 구현하고 Swift에서 해당 모듈에 액세스하고 싶을 수 있습니다. Swift 애플리케이션에서 여러 Kotlin/Native 프레임워크를 사용하는 것은 제한적이지만, 통합 프레임워크(umbrella framework)를 생성하고 이 모든 모듈을 내보낼 수 있습니다.

> 해당 소스 세트의 [`api` 의존성](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)만 내보낼 수 있습니다.
>
{style="note"}

의존성을 내보내면 해당 의존성의 모든 API가 프레임워크 API에 포함됩니다. 컴파일러는 이 의존성의 코드를 프레임워크에 추가하며, 이 코드를 아주 일부만 사용하더라도 마찬가지입니다. 이렇게 하면 내보낸 의존성(및 어느 정도는 해당 의존성의 의존성)에 대한 데드 코드 제거(dead code elimination)가 비활성화됩니다.

기본적으로 내보내기는 비전이적(non-transitively)으로 작동합니다. 즉, 라이브러리 `bar`에 의존하는 라이브러리 `foo`를 내보내면 `foo`의 메서드만 출력 프레임워크에 추가됩니다.

`transitiveExport` 옵션을 사용하여 이 동작을 변경할 수 있습니다. `true`로 설정하면 라이브러리 `bar`의 선언도 내보내집니다.

> `transitiveExport`를 사용하는 것은 권장되지 않습니다. 내보낸 의존성의 모든 전이적(transitive) 의존성을 프레임워크에 추가합니다. 이는 컴파일 시간과 바이너리 크기를 모두 증가시킬 수 있습니다.
>
> 대부분의 경우, 이 모든 의존성을 프레임워크 API에 추가할 필요가 없습니다. Swift 또는 Objective-C 코드에서 직접 액세스해야 하는 의존성에 대해서는 `export`를 명시적으로 사용하세요.
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // Export transitively.
        transitiveExport = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // Export transitively.
        transitiveExport = true
    }
}
```

</tab>
</tabs>

## 유니버설 프레임워크 빌드

기본적으로 Kotlin/Native가 생성하는 Objective-C 프레임워크는 하나의 플랫폼만 지원합니다. 그러나 [`lipo` 도구](https://llvm.org/docs/CommandGuide/llvm-lipo.html)를 사용하여 이러한 프레임워크를 단일 유니버설(fat) 바이너리로 병합할 수 있습니다. 이 작업은 특히 32비트 및 64비트 iOS 프레임워크에 의미가 있습니다. 이 경우 결과로 생성된 유니버설 프레임워크를 32비트 및 64비트 장치 모두에서 사용할 수 있습니다.

> fat 프레임워크는 초기 프레임워크와 동일한 기본 이름을 가져야 합니다. 그렇지 않으면 오류가 발생합니다.
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "MyFramework"
        }
    }
    // Create a task to build a fat framework.
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "MyFramework"
        // The default destination directory is "<build directory>/fat-framework".
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // Specify the frameworks to be merged.
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "MyFramework"
            }
        }
    }
    // Create a task building a fat framework.
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "MyFramework"
        // The default destination directory is "<build directory>/fat-framework".
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // Specify the frameworks to be merged.
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
</tabs>

## XCFramework 빌드

모든 Kotlin Multiplatform 프로젝트는 XCFramework를 출력으로 사용하여 모든 타겟 플랫폼 및 아키텍처에 대한 로직을 단일 번들로 모을 수 있습니다. [유니버설(fat) 프레임워크](#build-universal-frameworks)와 달리, 애플리케이션을 App Store에 게시하기 전에 불필요한 모든 아키텍처를 제거할 필요가 없습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
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

</tab>
</tabs>

XCFramework를 선언하면 Kotlin Gradle 플러그인이 다음 Gradle 작업을 등록합니다.

*   `assembleXCFramework`
*   `assemble<Framework name>DebugXCFramework`
*   `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

프로젝트에서 [CocoaPods 통합](multiplatform-cocoapods-overview.md)을 사용하는 경우, Kotlin CocoaPods Gradle 플러그인으로 XCFramework를 빌드할 수 있습니다. 이 플러그인에는 등록된 모든 타겟으로 XCFramework를 빌드하고 podspec 파일을 생성하는 다음 작업이 포함됩니다.

*   `podPublishReleaseXCFramework`: 릴리스 XCFramework와 podspec 파일을 생성합니다.
*   `podPublishDebugXCFramework`: 디버그 XCFramework와 podspec 파일을 생성합니다.
*   `podPublishXCFramework`: 디버그 및 릴리스 XCFramework와 podspec 파일을 모두 생성합니다.

이를 통해 CocoaPods를 통해 모바일 앱과 별도로 프로젝트의 공유 부분을 배포할 수 있습니다. XCFramework를 사용하여 비공개 또는 공개 podspec 저장소에 게시할 수도 있습니다.

> Kotlin 프레임워크를 공개 저장소에 게시하는 것은 해당 프레임워크가 다른 버전의 Kotlin용으로 빌드된 경우 권장되지 않습니다. 이렇게 하면 최종 사용자 프로젝트에서 충돌이 발생할 수 있습니다.
>
{style="warning"}

## Info.plist 파일 사용자 지정

프레임워크를 생성할 때 Kotlin/Native 컴파일러는 정보 속성 목록 파일인 `Info.plist`를 생성합니다. 해당 바이너리 옵션으로 속성을 사용자 지정할 수 있습니다.

| 속성(Property)               | 바이너리 옵션(Binary option) |
|--------------------------|------------------------|
| `CFBundleIdentifier`     | `bundleId`             |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`        | `bundleVersion`        |

이 기능을 활성화하려면 `-Xbinary=$option=$value` 컴파일러 플래그를 전달하거나 특정 프레임워크에 대해 `binaryOption("option", "value")` Gradle DSL을 설정하세요.

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}