[//]: # (title: 최종 네이티브 바이너리 빌드)

기본적으로 Kotlin/Native 타겟은 `*.klib` 라이브러리 아티팩트로 컴파일됩니다. 이 아티팩트는 Kotlin/Native 자체에서 의존성으로 사용될 수 있지만, 실행되거나 네이티브 라이브러리로 사용될 수는 없습니다.

실행 파일이나 공유 라이브러리와 같은 최종 네이티브 바이너리를 선언하려면 네이티브 타겟의 `binaries` 속성을 사용하세요. 이 속성은 기본 `*.klib` 아티팩트 외에 이 타겟을 위해 빌드된 네이티브 바이너리 컬렉션을 나타내며, 바이너리를 선언하고 구성하기 위한 메서드 세트를 제공합니다.

> 기본적으로 `kotlin-multiplatform` 플러그인은 프로덕션 바이너리를 생성하지 않습니다. 기본적으로 사용 가능한 유일한 바이너리는 `test` 컴파일에서 단위 테스트를 실행할 수 있게 해주는 디버그 테스트 실행 파일입니다.
>
{style="note"}

Kotlin/Native 컴파일러가 생성한 바이너리에는 서드파티 코드, 데이터 또는 파생 작업이 포함될 수 있습니다. 즉, Kotlin/Native로 컴파일된 최종 바이너리를 배포하는 경우, 바이너리 배포판에 필요한 [라이선스 파일](https://kotlinlang.org/docs/native-binary-licenses.html)을 항상 포함해야 합니다.

## 바이너리 선언하기

다음 팩토리 메서드를 사용하여 `binaries` 컬렉션의 요소를 선언하세요.

| 팩토리 메서드 | 바이너리 종류         | 사용 가능 대상                             |
|----------------|-----------------------|--------------------------------------------|
| `executable`   | 제품 실행 파일        | 모든 네이티브 타겟                         |
| `test`         | 테스트 실행 파일      | 모든 네이티브 타겟                         |
| `sharedLib`    | 공유 네이티브 라이브러리 | 모든 네이티브 타겟                         |
| `staticLib`    | 정적 네이티브 라이브러리 | 모든 네이티브 타겟                         |
| `framework`    | Objective-C 프레임워크 | macOS, iOS, watchOS, tvOS 타겟 전용 |

가장 간단한 버전은 추가 파라미터가 필요 없으며 각 빌드 타입에 대해 하나의 바이너리를 생성합니다. 현재 두 가지 빌드 타입이 사용 가능합니다.

*   `DEBUG` – [디버거 도구](https://kotlinlang.org/docs/native-debugging.html)와 함께 작업할 때 유용한 추가 메타데이터를 포함하는 최적화되지 않은 바이너리를 생성합니다.
*   `RELEASE` – 디버그 정보가 없는 최적화된 바이너리를 생성합니다.

다음 코드 스니펫은 디버그 및 릴리스 실행 파일 두 개를 생성합니다.

```kotlin
kotlin {
    linuxX64 { // 대신 타겟을 정의하세요.
        binaries {
            executable {
                // 바이너리 구성.
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

어떤 빌드 타입에 대해 바이너리를 생성할지 지정할 수 있습니다. 다음 예시에서는 `debug` 실행 파일만 생성됩니다.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 바이너리 구성.
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // 바이너리 구성.
    }
}
```

</TabItem>
</Tabs>

사용자 지정 이름으로 바이너리를 선언할 수도 있습니다.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 바이너리 구성.
    }

    // 빌드 타입 목록을 생략할 수 있습니다.
    // (이 경우, 사용 가능한 모든 빌드 타입이 사용됩니다.)
    executable("bar") {
        // 바이너리 구성.
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 바이너리 구성.
    }

    // 빌드 타입 목록을 생략할 수 있습니다.
    // (이 경우, 사용 가능한 모든 빌드 타입이 사용됩니다.)
    executable('bar') {
        // 바이너리 구성.
    }
}
```

</TabItem>
</Tabs>

첫 번째 인수는 바이너리 파일의 기본 이름이 되는 이름 접두사를 설정합니다. 예를 들어, Windows의 경우 이 코드는 `foo.exe` 및 `bar.exe` 파일을 생성합니다. 빌드 스크립트에서 바이너리에 [접근](#access-binaries)하기 위해 이름 접두사를 사용할 수도 있습니다.

## 바이너리 접근하기

바이너리에 접근하여 [구성](multiplatform-dsl-reference.md#native-targets)하거나 속성(예: 출력 파일 경로)을 가져올 수 있습니다.

바이너리의 고유한 이름으로 가져올 수 있습니다. 이 이름은 이름 접두사(지정된 경우), 빌드 타입 및 바이너리 종류를 기반으로 하며, `<optional-name-prefix><build-type><binary-kind>` 패턴을 따릅니다(예: `releaseFramework` 또는 `testDebugExecutable`).

> 정적 및 공유 라이브러리는 각각 `static` 및 `shared` 접미사를 가집니다(예: `fooDebugStatic` 또는 `barReleaseShared`).
>
{style="note"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 해당 바이너리가 없으면 실패합니다.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 해당 바이너리가 없으면 null을 반환합니다.
binaries.findByName("fooDebugExecutable")
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// 해당 바이너리가 없으면 실패합니다.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 해당 바이너리가 없으면 null을 반환합니다.
binaries.findByName('fooDebugExecutable')
```

</TabItem>
</Tabs>

또는 타입이 지정된 getter를 사용하여 이름 접두사와 빌드 타입으로 바이너리에 접근할 수 있습니다.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 해당 바이너리가 없으면 실패합니다.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 이름 접두사가 설정되지 않은 경우 첫 번째 인수를 생략합니다.
binaries.getExecutable("bar", "DEBUG") // 빌드 타입에 문자열을 사용할 수도 있습니다.

// 다른 바이너리 종류에 대해서도 유사한 getter를 사용할 수 있습니다:
// getFramework, getStaticLib and getSharedLib.

// 해당 바이너리가 없으면 null을 반환합니다.
binaries.findExecutable("foo", DEBUG)

// 다른 바이너리 종류에 대해서도 유사한 getter를 사용할 수 있습니다:
// findFramework, findStaticLib and findSharedLib.
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// 해당 바이너리가 없으면 실패합니다.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 이름 접두사가 설정되지 않은 경우 첫 번째 인수를 생략합니다.
binaries.getExecutable('bar', 'DEBUG') // 빌드 타입에 문자열을 사용할 수도 있습니다.

// 다른 바이너리 종류에 대해서도 유사한 getter를 사용할 수 있습니다:
// getFramework, getStaticLib and getSharedLib.

// 해당 바이너리가 없으면 null을 반환합니다.
binaries.findExecutable('foo', DEBUG)

// 다른 바이너리 종류에 대해서도 유사한 getter를 사용할 수 있습니다:
// findFramework, findStaticLib and findSharedLib.
```

</TabItem>
</Tabs>

## 바이너리에 의존성 내보내기

Objective-C 프레임워크 또는 네이티브 라이브러리(공유 또는 정적)를 빌드할 때, 현재 프로젝트의 클래스뿐만 아니라 해당 의존성의 클래스도 포함해야 할 수 있습니다. `export` 메서드를 사용하여 어떤 의존성을 바이너리로 내보낼지 지정합니다.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // 내보내질 것입니다.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // 내보내지지 않을 것입니다.
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // 다른 바이너리에 다른 의존성 세트를 내보낼 수 있습니다.
            export(project(':dependency'))
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // 내보내질 것입니다.
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // 내보내지지 않을 것입니다.
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // 다른 바이너리에 다른 의존성 세트를 내보낼 수 있습니다.
            export project(':dependency')
        }
    }
}
```

</TabItem>
</Tabs>

예를 들어, Kotlin으로 여러 모듈을 구현하고 Swift에서 해당 모듈에 접근하고 싶을 때, Swift 애플리케이션에서 여러 Kotlin/Native 프레임워크를 사용하는 것은 제한적입니다. 하지만 우산 프레임워크(umbrella framework)를 생성하고 이 모든 모듈을 내보낼 수 있습니다.

> 해당 소스 세트의 [`api` 의존성](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)만 내보낼 수 있습니다.
>
{style="note"}

의존성을 내보낼 때, 해당 의존성의 모든 API가 프레임워크 API에 포함됩니다. 컴파일러는 그중 작은 부분만 사용하더라도 이 의존성의 코드를 프레임워크에 추가합니다. 이는 내보내진 의존성(그리고 어느 정도는 그 의존성의 의존성)에 대한 데드 코드 제거를 비활성화합니다.

기본적으로 내보내기(export)는 비전이적(non-transitively)으로 작동합니다. 이는 `bar` 라이브러리에 의존하는 `foo` 라이브러리를 내보낼 경우, `foo`의 메서드만 출력 프레임워크에 추가됨을 의미합니다.

`transitiveExport` 옵션을 사용하여 이 동작을 변경할 수 있습니다. `true`로 설정하면 `bar` 라이브러리의 선언도 내보내집니다.

> `transitiveExport` 사용은 권장되지 않습니다. 이는 내보내진 의존성의 모든 전이적 의존성을 프레임워크에 추가합니다.
> 이는 컴파일 시간과 바이너리 크기를 모두 증가시킬 수 있습니다.
>
> 대부분의 경우, 이 모든 의존성을 프레임워크 API에 추가할 필요가 없습니다.
> Swift 또는 Objective-C 코드에서 직접 접근해야 하는 의존성에 대해서는 `export`를 명시적으로 사용하세요.
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 전이적으로 내보내기.
        transitiveExport = true
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // 전이적으로 내보내기.
        transitiveExport = true
    }
}
```

</TabItem>
</Tabs>

## 유니버설 프레임워크 빌드하기

기본적으로 Kotlin/Native가 생성한 Objective-C 프레임워크는 하나의 플랫폼만 지원합니다. 하지만 [`lipo` 도구](https://llvm.org/docs/CommandGuide/llvm-lipo.html)를 사용하여 이러한 프레임워크를 단일 유니버설(fat) 바이너리로 병합할 수 있습니다. 이 작업은 특히 32비트 및 64비트 iOS 프레임워크에 유용합니다. 이 경우, 결과로 생성된 유니버설 프레임워크를 32비트 및 64비트 기기 모두에서 사용할 수 있습니다.

> fat 프레임워크는 초기 프레임워크와 동일한 기본 이름을 가져야 합니다. 그렇지 않으면 오류가 발생합니다.
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 타겟을 생성하고 구성합니다.
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "MyFramework"
        }
    }
    // fat 프레임워크를 빌드하는 태스크를 생성합니다.
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // fat 프레임워크는 초기 프레임워크와 동일한 기본 이름을 가져야 합니다.
        baseName = "MyFramework"
        // 기본 대상 디렉토리는 "<빌드 디렉토리>/fat-framework"입니다.
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // 병합할 프레임워크를 지정합니다.
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 타겟을 생성하고 구성합니다.
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "MyFramework"
            }
        }
    }
    // fat 프레임워크를 빌드하는 태스크를 생성합니다.
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // fat 프레임워크는 초기 프레임워크와 동일한 기본 이름을 가져야 합니다.
        baseName = "MyFramework"
        // 기본 대상 디렉토리는 "<빌드 디렉토리>/fat-framework"입니다.
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // 병합할 프레임워크를 지정합니다.
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
</Tabs>

## XCFramework 빌드하기

모든 Kotlin 멀티플랫폼 프로젝트는 XCFramework를 출력으로 사용하여 모든 타겟 플랫폼 및 아키텍처에 대한 로직을 단일 번들로 모을 수 있습니다. [유니버설(fat) 프레임워크](#build-universal-frameworks)와 달리, 앱을 App Store에 게시하기 전에 불필요한 모든 아키텍처를 제거할 필요가 없습니다.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

XCFramework를 선언하면 Kotlin Gradle 플러그인이 여러 Gradle 태스크를 등록합니다.

*   `assembleXCFramework`
*   `assemble<Framework name>DebugXCFramework`
*   `assemble<Framework name>ReleaseXCFramework`

undefined

프로젝트에서 [CocoaPods 통합](multiplatform-cocoapods-overview.md)을 사용하는 경우, Kotlin CocoaPods Gradle 플러그인으로 XCFramework를 빌드할 수 있습니다. 이 플러그인은 등록된 모든 타겟으로 XCFramework를 빌드하고 podspec 파일을 생성하는 다음 태스크를 포함합니다.

*   `podPublishReleaseXCFramework`는 릴리스 XCFramework와 podspec 파일을 생성합니다.
*   `podPublishDebugXCFramework`는 디버그 XCFramework와 podspec 파일을 생성합니다.
*   `podPublishXCFramework`는 디버그 및 릴리스 XCFramework와 podspec 파일을 모두 생성합니다.

이를 통해 CocoaPods를 통해 프로젝트의 공유 부분을 모바일 앱과 별도로 배포할 수 있습니다. 또한 XCFramework를 사용하여 비공개 또는 공개 podspec 저장소에 게시할 수도 있습니다.

> Kotlin 프레임워크가 다른 버전의 Kotlin으로 빌드된 경우, 해당 프레임워크를 공개 저장소에 게시하는 것은 권장되지 않습니다. 그렇게 하면 최종 사용자의 프로젝트에서 충돌이 발생할 수 있습니다.
>
{style="warning"}

## Info.plist 파일 사용자 지정하기

프레임워크를 생성할 때, Kotlin/Native 컴파일러는 정보 속성 목록 파일인 `Info.plist`를 생성합니다. 해당 바이너리 옵션으로 속성을 사용자 지정할 수 있습니다.

| 속성                         | 바이너리 옵션              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

이 기능을 활성화하려면 `-Xbinary=$option=$value` 컴파일러 플래그를 전달하거나 특정 프레임워크에 대해 `binaryOption("option", "value")` Gradle DSL을 설정하세요.

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}