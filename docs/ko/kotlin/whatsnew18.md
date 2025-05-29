[//]: # (title: Kotlin 1.8.0의 새로운 기능)

_[출시일: 2022년 12월 28일](releases.md#release-details)_

Kotlin 1.8.0 릴리스가 출시되었으며, 주요 내용은 다음과 같습니다:

*   [JVM을 위한 새로운 실험적 함수: 디렉토리 내용 재귀적 복사 또는 삭제](#recursive-copying-or-deletion-of-directories)
*   [향상된 kotlin-reflect 성능](#improved-kotlin-reflect-performance)
*   [향상된 디버깅 경험을 위한 새로운 -Xdebug 컴파일러 옵션](#a-new-compiler-option-for-disabling-optimizations)
*   [`kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`이 `kotlin-stdlib`로 통합](#updated-jvm-compilation-target)
*   [향상된 Objective-C/Swift 상호 운용성](#improved-objective-c-swift-interoperability)
*   [Gradle 7.3과의 호환성](#gradle)

## IDE 지원

1.8.0을 지원하는 Kotlin 플러그인은 다음에서 사용할 수 있습니다:

| IDE            | 지원 버전                  |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> IntelliJ IDEA 2022.3에서 IDE 플러그인을 업데이트하지 않고도 프로젝트를 Kotlin 1.8.0으로 업데이트할 수 있습니다.
>
> IntelliJ IDEA 2022.3에서 기존 프로젝트를 Kotlin 1.8.0으로 마이그레이션하려면, Kotlin 버전을 `1.8.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하세요.
>
{style="note"}

## Kotlin/JVM

버전 1.8.0부터 컴파일러는 JVM 19에 해당하는 바이트코드 버전으로 클래스를 생성할 수 있습니다.
새로운 언어 버전에는 다음이 포함됩니다:

*   [JVM 어노테이션 타겟 생성을 끄는 컴파일러 옵션](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
*   [최적화를 비활성화하는 새로운 `-Xdebug` 컴파일러 옵션](#a-new-compiler-option-for-disabling-optimizations)
*   [이전 백엔드 제거](#removal-of-the-old-backend)
*   [Lombok의 @Builder 어노테이션 지원](#support-for-lombok-s-builder-annotation)

### TYPE_USE 및 TYPE_PARAMETER 어노테이션 타겟을 생성하지 않는 기능

Kotlin 어노테이션에 Kotlin 타겟 중 `TYPE`이 있는 경우, 해당 어노테이션은 Java 어노테이션 타겟 목록에서 `java.lang.annotation.ElementType.TYPE_USE`에 매핑됩니다. 이는 `TYPE_PARAMETER` Kotlin 타겟이 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 타겟에 매핑되는 방식과 동일합니다. 이는 API 수준 26 미만의 Android 클라이언트에서 문제가 되는데, 해당 API에는 이러한 타겟이 없기 때문입니다.

Kotlin 1.8.0부터 새로운 컴파일러 옵션인 `-Xno-new-java-annotation-targets`를 사용하여 `TYPE_USE` 및 `TYPE_PARAMETER` 어노테이션 타겟 생성을 피할 수 있습니다.

### 최적화를 비활성화하는 새로운 컴파일러 옵션

Kotlin 1.8.0에는 향상된 디버깅 경험을 위해 최적화를 비활성화하는 새로운 `-Xdebug` 컴파일러 옵션이 추가되었습니다.
현재 이 옵션은 코루틴에 대한 "was optimized out" 기능을 비활성화합니다. 앞으로 더 많은 최적화를 추가하면 이 옵션도 해당 최적화를 비활성화할 것입니다.

"was optimized out" 기능은 중단 함수를 사용할 때 변수를 최적화합니다. 그러나 최적화된 변수는 값을 볼 수 없기 때문에 코드를 디버깅하기 어렵습니다.

> **프로덕션 환경에서는 이 옵션을 절대 사용하지 마세요**: `-Xdebug`를 통해 이 기능을 비활성화하면 [메모리 누수가 발생할 수 있습니다](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0).
>
{style="warning"}

### 이전 백엔드 제거

Kotlin 1.5.0에서 IR 기반 백엔드가 [안정화(Stable)](components-stability.md)되었음을 [발표](whatsnew15.md#stable-jvm-ir-backend)했습니다.
이는 Kotlin 1.4.*의 이전 백엔드가 사용 중단(deprecated)되었음을 의미합니다. Kotlin 1.8.0에서는 이전 백엔드를 완전히 제거했습니다. 이에 따라 컴파일러 옵션 `-Xuse-old-backend`와 Gradle `useOldBackend` 옵션도 제거되었습니다.

### Lombok의 @Builder 어노테이션 지원

커뮤니티에서 [Kotlin Lombok: 생성된 빌더 지원 (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) YouTrack 이슈에 많은 표를 주셨기 때문에, [@Builder 어노테이션](https://projectlombok.org/features/Builder)을 지원할 수밖에 없었습니다.

아직 `@SuperBuilder` 또는 `@Tolerate` 어노테이션을 지원할 계획은 없지만, 충분한 인원이 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 및 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 이슈에 투표한다면 재고할 예정입니다.

[Lombok 컴파일러 플러그인을 설정하는 방법 알아보기](lombok.md#gradle).

## Kotlin/Native

Kotlin 1.8.0에는 Objective-C 및 Swift 상호 운용성 변경 사항, Xcode 14.1 지원, CocoaPods Gradle 플러그인 개선 사항이 포함되어 있습니다:

*   [Xcode 14.1 지원](#support-for-xcode-14-1)
*   [향상된 Objective-C/Swift 상호 운용성](#improved-objective-c-swift-interoperability)
*   [CocoaPods Gradle 플러그인에서 동적 프레임워크 기본값](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Xcode 14.1 지원

Kotlin/Native 컴파일러가 이제 최신 안정화된 Xcode 버전 14.1을 지원합니다. 호환성 개선 사항에는 다음 변경 사항이 포함됩니다:

*   ARM64 플랫폼에서 Apple watchOS를 지원하는 watchOS 타겟을 위한 새로운 `watchosDeviceArm64` 프리셋이 추가되었습니다.
*   Kotlin CocoaPods Gradle 플러그인은 더 이상 Apple 프레임워크에 대해 비트코드 임베딩을 기본값으로 사용하지 않습니다.
*   플랫폼 라이브러리가 Apple 타겟의 Objective-C 프레임워크 변경 사항을 반영하도록 업데이트되었습니다.

### 향상된 Objective-C/Swift 상호 운용성

Kotlin과 Objective-C 및 Swift 간의 상호 운용성을 높이기 위해 세 가지 새로운 어노테이션이 추가되었습니다:

*   [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/)을 사용하면 Kotlin 선언의 이름을 변경하는 대신 Swift 또는 Objective-C에서 더 관용적인 이름을 지정할 수 있습니다.

    이 어노테이션은 Kotlin 컴파일러에게 이 클래스, 속성, 파라미터 또는 함수에 대해 사용자 지정 Objective-C 및 Swift 이름을 사용하도록 지시합니다:

    ```kotlin
    @ObjCName(swiftName = "MySwiftArray")
    class MyKotlinArray {
        @ObjCName("index")
        fun indexOf(@ObjCName("of") element: String): Int = TODO()
    }

    // Usage with the ObjCName annotations
    let array = MySwiftArray()
    let index = array.index(of: "element")
    ```

*   [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/)을 사용하면 Objective-C에서 Kotlin 선언을 숨길 수 있습니다.

    이 어노테이션은 Kotlin 컴파일러에게 함수나 속성을 Objective-C로, 그리고 결과적으로 Swift로 내보내지 않도록 지시합니다. 이는 Kotlin 코드를 Objective-C/Swift 친화적으로 만들 수 있습니다.

*   [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/)는 Kotlin 선언을 Swift로 작성된 래퍼(wrapper)로 대체하는 데 유용합니다.

    이 어노테이션은 Kotlin 컴파일러에게 생성된 Objective-C API에서 함수나 속성을 `swift_private`로 표시하도록 지시합니다. 이러한 선언에는 `__` 접두사가 붙어 Swift 코드에서 보이지 않게 됩니다.

    여전히 Swift 코드에서 이러한 선언을 사용하여 Swift 친화적인 API를 생성할 수 있지만, 예를 들어 Xcode의 자동 완성 기능에서 제안되지 않습니다.

    Swift에서 Objective-C 선언을 개선하는 방법에 대한 자세한 내용은 [공식 Apple 문서](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)를 참조하세요.

> 새로운 어노테이션은 [옵트인(opt-in)](opt-in-requirements.md)이 필요합니다.
>
{style="note"}

Kotlin 팀은 이 어노테이션들을 구현해 주신 [Rick Clephas](https://github.com/rickclephas)에게 깊이 감사합니다.

### CocoaPods Gradle 플러그인에서 동적 프레임워크 기본값

Kotlin 1.8.0부터 CocoaPods Gradle 플러그인에 의해 등록된 Kotlin 프레임워크는 기본적으로 동적으로 링크됩니다.
이전의 정적 구현은 Kotlin Gradle 플러그인의 동작과 일치하지 않았습니다.

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // Now dynamic by default
        }
    }
}
```

정적 링크 유형을 사용하는 기존 프로젝트가 있고 Kotlin 1.8.0으로 업그레이드하거나(또는 링크 유형을 명시적으로 변경하는 경우) 프로젝트 실행 시 오류가 발생할 수 있습니다. 이 문제를 해결하려면 Xcode 프로젝트를 닫고 Podfile 디렉토리에서 `pod install`을 실행하세요.

자세한 내용은 [CocoaPods Gradle 플러그인 DSL 레퍼런스](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)를 참조하세요.

## Kotlin 멀티플랫폼: 새로운 Android 소스 세트 레이아웃

Kotlin 1.8.0은 기존 디렉토리 명명 체계를 대체하는 새로운 Android 소스 세트 레이아웃을 도입합니다. 이전 명명 체계는 여러 면에서 혼란을 야기했습니다.

현재 레이아웃에서 생성된 두 개의 `androidTest` 디렉토리 예를 살펴보세요. 하나는 `KotlinSourceSets`용이고 다른 하나는 `AndroidSourceSets`용입니다:

*   이들은 의미가 다릅니다: Kotlin의 `androidTest`는 `unitTest` 유형에 속하는 반면, Android의 `androidTest`는 `integrationTest` 유형에 속합니다.
*   `src/androidTest/kotlin`이 `UnitTest`를 가지고 있고 `src/androidTest/java`가 `InstrumentedTest`를 가지고 있어 혼란스러운 `SourceDirectories` 레이아웃을 생성합니다.
*   `KotlinSourceSets`와 `AndroidSourceSets` 모두 Gradle 구성에 유사한 명명 체계를 사용하므로, Kotlin과 Android 소스 세트 모두에 대한 `androidTest`의 결과 구성은 `androidTestImplementation`, `androidTestApi`, `androidTestRuntimeOnly`, `androidTestCompileOnly`로 동일합니다.

이러한 문제 및 기타 기존 문제를 해결하기 위해 새로운 Android 소스 세트 레이아웃을 도입했습니다.
두 레이아웃 간의 주요 차이점은 다음과 같습니다:

#### KotlinSourceSet 명명 체계

|             | 현재 소스 세트 레이아웃   | 새로운 소스 세트 레이아웃    |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android**Unit**Test            |
| androidTest | android**Android**Test     | android**Instrumented**Test    |

`{AndroidSourceSet.name}`은 다음과 같이 `{KotlinSourceSet.name}`에 매핑됩니다:

|             | 현재 소스 세트 레이아웃 | 새로운 소스 세트 레이아웃 |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android**Unit**Test            |
| androidTest | android**Android**Test     | android**Instrumented**Test    |

#### SourceDirectories

|             | 현재 소스 세트 레이아웃                                  | 새로운 소스 세트 레이아웃                                                                           |
|-------------|------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                          |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android**Unit**Test/kotlin, src/test/kotlin, src/test/java                                  |
| androidTest | src/android**Android**Test/kotlin, src/androidTest/java | src/android**Instrumented**Test/kotlin, src/androidTest/java, **src/androidTest/kotlin** |

`{AndroidSourceSet.name}`은 다음과 같이 `{SourceDirectories included}`에 매핑됩니다:

|             | 현재 소스 세트 레이아웃                                  | 새로운 소스 세트 레이아웃                                                                           |
|-------------|------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                          |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android**Unit**Test/kotlin, src/test/kotlin, src/test/java                                  |
| androidTest | src/android**Android**Test/kotlin, src/androidTest/java | src/android**Instrumented**Test/kotlin, src/androidTest/java, **src/androidTest/kotlin** |

#### AndroidManifest.xml 파일의 위치

|       | 현재 소스 세트 레이아웃          | 새로운 소스 세트 레이아웃           |
|-------|------------------------------------|---------------------------------------|
| main  | src/main/AndroidManifest.xml       | src/**android**Main/AndroidManifest.xml |
| debug | src/debug/AndroidManifest.xml      | src/**android**Debug/AndroidManifest.xml |

`{AndroidSourceSet.name}`은 다음과 같이 `{AndroidManifest.xml location}`에 매핑됩니다:

|       | 현재 소스 세트 레이아웃          | 새로운 소스 세트 레이아웃           |
|-------|------------------------------------|---------------------------------------|
| main  | src/main/AndroidManifest.xml       | src/**android**Main/AndroidManifest.xml |
| debug | src/debug/AndroidManifest.xml      | src/**android**Debug/AndroidManifest.xml |

#### Android와 공통 테스트 간의 관계

새로운 Android 소스 세트 레이아웃은 Android-instrumented 테스트(새로운 레이아웃에서 `androidInstrumentedTest`로 이름 변경)와 공통 테스트 간의 관계를 변경합니다.

이전에는 `androidAndroidTest`와 `commonTest` 사이에 기본 `dependsOn` 관계가 있었습니다. 실제로 이는 다음을 의미했습니다:

*   `commonTest`의 코드는 `androidAndroidTest`에서 사용할 수 있었습니다.
*   `commonTest`의 `expect` 선언은 `androidAndroidTest`에 해당 `actual` 구현을 가져야 했습니다.
*   `commonTest`에 선언된 테스트도 Android instrumented 테스트로 실행되었습니다.

새로운 Android 소스 세트 레이아웃에서는 `dependsOn` 관계가 기본적으로 추가되지 않습니다. 이전 동작을 선호하는 경우 `build.gradle.kts` 파일에 이 관계를 수동으로 선언하세요:

```kotlin
kotlin {
    // ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

#### Android 플레이버(Flavor) 지원

이전에는 Kotlin Gradle 플러그인이 `debug` 및 `release` 빌드 타입 또는 `demo` 및 `full`과 같은 사용자 지정 플레이버를 가진 Android 소스 세트에 해당하는 소스 세트를 즉시 생성했습니다. 이는 `val androidDebug by getting { ... }`와 같은 구문을 통해 접근할 수 있었습니다.

새로운 Android 소스 세트 레이아웃에서는 해당 소스 세트가 `afterEvaluate` 단계에서 생성됩니다. 이로 인해 이러한 표현식이 유효하지 않게 되어 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`와 같은 오류가 발생합니다.

이를 해결하려면 `build.gradle.kts` 파일에서 새로운 `invokeWhenCreated()` API를 사용하세요:

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 구성 및 설정

새로운 레이아웃은 향후 릴리스에서 기본값이 될 것입니다. 지금 다음 Gradle 옵션으로 활성화할 수 있습니다:

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 새로운 레이아웃은 Android Gradle 플러그인 7.0 이상을 필요로 하며, Android Studio 2022.3 이상에서 지원됩니다.
>
{style="note"}

이전 Android 스타일 디렉토리 사용은 이제 권장되지 않습니다. Kotlin 1.8.0은 현재 레이아웃에 대한 경고를 도입하며 사용 중단 주기의 시작을 알립니다. 다음 Gradle 속성으로 경고를 비활성화할 수 있습니다:

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0은 JS IR 컴파일러 백엔드를 안정화하고 JavaScript 관련 Gradle 빌드 스크립트에 새로운 기능을 제공합니다:
*   [안정화된 JS IR 컴파일러 백엔드](#stable-js-ir-compiler-backend)
*   [yarn.lock 업데이트 보고를 위한 새로운 설정](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
*   [Gradle 속성을 통한 브라우저 테스트 타겟 추가](#add-test-targets-for-browsers-via-gradle-properties)
*   [프로젝트에 CSS 지원을 추가하는 새로운 접근 방식](#new-approach-to-adding-css-support-to-your-project)

### 안정화된 JS IR 컴파일러 백엔드

이번 릴리스부터 [Kotlin/JS 중간 표현(IR 기반) 컴파일러](js-ir-compiler.md) 백엔드가 안정화되었습니다.
세 가지 백엔드의 인프라를 통합하는 데 시간이 걸렸지만, 이제 Kotlin 코드에 동일한 IR로 작동합니다.

안정화된 JS IR 컴파일러 백엔드의 결과로, 이전 백엔드는 이제부터 사용 중단됩니다.

안정화된 JS IR 컴파일러와 함께 증분 컴파일이 기본적으로 활성화됩니다.

이전 컴파일러를 계속 사용 중이라면, [마이그레이션 가이드](js-ir-migration.md)의 도움을 받아 프로젝트를 새로운 백엔드로 전환하세요.

### yarn.lock 업데이트 보고를 위한 새로운 설정

`yarn` 패키지 관리자를 사용하는 경우, `yarn.lock` 파일이 업데이트되었음을 알릴 수 있는 세 가지 새로운 특별한 Gradle 설정이 있습니다. CI 빌드 프로세스 중에 `yarn.lock`이 자동으로 변경되었는지 알림을 받고 싶을 때 이 설정을 사용할 수 있습니다.

이 세 가지 새로운 Gradle 속성은 다음과 같습니다:

*   `YarnLockMismatchReport`: `yarn.lock` 파일 변경 사항이 보고되는 방식을 지정합니다. 다음 값 중 하나를 사용할 수 있습니다:
    *   `FAIL`: 해당 Gradle 작업을 실패시킵니다. 이것이 기본값입니다.
    *   `WARNING`: 변경 사항에 대한 정보를 경고 로그에 기록합니다.
    *   `NONE`: 보고 기능을 비활성화합니다.
*   `reportNewYarnLock`: 최근 생성된 `yarn.lock` 파일에 대해 명시적으로 보고합니다. 기본적으로 이 옵션은 비활성화되어 있습니다. 이는 첫 시작 시 새로운 `yarn.lock` 파일을 생성하는 일반적인 관행이기 때문입니다. 이 옵션을 사용하여 파일이 리포지토리에 커밋되었는지 확인할 수 있습니다.
*   `yarnLockAutoReplace`: Gradle 작업이 실행될 때마다 `yarn.lock`을 자동으로 대체합니다.

이 옵션들을 사용하려면 `build.gradle.kts` 빌드 스크립트 파일을 다음과 같이 업데이트하세요:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

### Gradle 속성을 통한 브라우저 테스트 타겟 추가

Kotlin 1.8.0부터 Gradle 속성 파일에서 다양한 브라우저에 대한 테스트 타겟을 바로 설정할 수 있습니다. 이렇게 하면 모든 타겟을 `build.gradle.kts`에 작성할 필요가 없어 빌드 스크립트 파일의 크기가 줄어듭니다.

이 속성을 사용하여 모든 모듈에 대한 브라우저 목록을 정의한 다음, 특정 모듈의 빌드 스크립트에서 특정 브라우저를 추가할 수 있습니다.

예를 들어, Gradle 속성 파일의 다음 줄은 모든 모듈에 대해 Firefox 및 Safari에서 테스트를 실행할 것입니다:

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

[GitHub에서 해당 속성에 사용할 수 있는 전체 값 목록](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)을 참조하세요.

Kotlin 팀은 이 기능을 구현해 주신 [Martynas Petuška](https://github.com/mpetuska)에게 깊이 감사합니다.

### 프로젝트에 CSS 지원을 추가하는 새로운 접근 방식

이번 릴리스는 프로젝트에 CSS 지원을 추가하는 새로운 접근 방식을 제공합니다. 이는 많은 프로젝트에 영향을 미칠 것으로 예상되므로, 아래 설명된 대로 Gradle 빌드 스크립트 파일을 업데이트하는 것을 잊지 마세요.

Kotlin 1.8.0 이전에는 `cssSupport.enabled` 속성을 사용하여 CSS 지원을 추가했습니다:

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

이제 `cssSupport {}` 블록에서 `enabled.set()` 메서드를 사용해야 합니다:

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

## Gradle

Kotlin 1.8.0은 Gradle 버전 7.2 및 7.3을 **완전히** 지원합니다. 최신 Gradle 릴리스까지 Gradle 버전을 사용할 수도 있지만, 그렇게 할 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있다는 점을 유의하세요.

이번 버전에는 많은 변경 사항이 있습니다:
*   [Kotlin 컴파일러 옵션을 Gradle 지연 속성으로 노출](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
*   [최소 지원 버전 상향](#bumping-the-minimum-supported-versions)
*   [Kotlin 데몬 대체 전략 비활성화 기능](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
*   [전이 종속성에서 최신 kotlin-stdlib 버전 사용](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
*   [관련 Kotlin 및 Java 컴파일 작업의 JVM 타겟 호환성 동일성 의무적 확인](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
*   [Kotlin Gradle 플러그인의 전이 종속성 해결](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
*   [사용 중단 및 제거](#deprecations-and-removals)

### Kotlin 컴파일러 옵션을 Gradle 지연 속성으로 노출

사용 가능한 Kotlin 컴파일러 옵션을 [Gradle 지연 속성](https://docs.gradle.org/current/userguide/lazy_configuration.html)으로 노출하고 Kotlin 작업에 더 잘 통합하기 위해 많은 변경 사항을 적용했습니다:

*   컴파일 작업에는 기존 `kotlinOptions`와 유사하지만 반환 타입으로 Gradle Properties API의 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html)를 사용하는 새로운 `compilerOptions` 입력이 있습니다:

    ```kotlin
    tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
        compilerOptions {
            useK2.set(true)
        }
    }
    ```

*   Kotlin 툴 작업인 `KotlinJsDce` 및 `KotlinNativeLink`에는 기존 `kotlinOptions` 입력과 유사한 새로운 `toolOptions` 입력이 있습니다.
*   새로운 입력은 [`@Nested` Gradle 어노테이션](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)을 가집니다. 입력 내부의 모든 속성에는 [`@Input` 또는 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)과 같은 관련 Gradle 어노테이션이 있습니다.
*   Kotlin Gradle 플러그인 API 아티팩트에는 두 가지 새로운 인터페이스가 있습니다:
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`: `compilerOptions` 입력과 `compileOptions()` 메서드를 가집니다. 모든 Kotlin 컴파일 작업이 이 인터페이스를 구현합니다.
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`: `toolOptions` 입력과 `toolOptions()` 메서드를 가집니다. 모든 Kotlin 툴 작업(`KotlinJsDce`, `KotlinNativeLink`, `KotlinNativeLinkArtifactTask`)이 이 인터페이스를 구현합니다.
*   일부 `compilerOptions`는 `String` 타입 대신 새로운 타입을 사용합니다:
    *   [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    *   [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) (`apiVersion` 및 `languageVersion` 입력용)
    *   [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    *   [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    *   [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

    예를 들어, `kotlinOptions.jvmTarget = "11"` 대신 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`을 사용할 수 있습니다.

    `kotlinOptions` 타입은 변경되지 않았으며, 내부적으로 `compilerOptions` 타입으로 변환됩니다.
*   `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션은 사용 중단되었습니다. 대신 `Kotlin2JsCompile.outputFileProperty` 작업 입력을 사용하세요.

> Kotlin Gradle 플러그인은 여전히 Android 확장 기능에 `KotlinJvmOptions` DSL을 추가합니다:
>
> ```kotlin
> android {
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 이는 `compilerOptions` DSL이 모듈 수준에 추가될 때 [이 이슈](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options)의 범위 내에서 변경될 예정입니다.
>
{style="note"}

#### 제한 사항

> `kotlinOptions` 작업 입력과 `kotlinOptions{...}` 작업 DSL은 지원 모드이며 향후 릴리스에서 사용 중단될 예정입니다. `compilerOptions`와 `toolOptions`에만 개선이 이루어질 것입니다.
>
{style="warning"}

`kotlinOptions`에 대한 모든 setter 또는 getter 호출은 `compilerOptions`의 관련 속성에 위임됩니다. 이는 다음과 같은 제한 사항을 발생시킵니다:
*   `compilerOptions`와 `kotlinOptions`는 작업 실행 단계에서 변경할 수 없습니다 (아래 단락에서 한 가지 예외 참조).
*   `freeCompilerArgs`는 변경 불가능한 `List<String>`을 반환합니다. 이는 예를 들어 `kotlinOptions.freeCompilerArgs.remove("something")`이 실패한다는 의미입니다.

`kotlin-dsl` 및 [Jetpack Compose](https://developer.android.com/jetpack/compose)가 활성화된 Android Gradle 플러그인(AGP)을 포함한 여러 플러그인이 작업 실행 단계에서 `freeCompilerArgs` 속성을 수정하려고 시도합니다. Kotlin 1.8.0에서는 이를 위한 임시 해결책을 추가했습니다. 이 해결책은 모든 빌드 스크립트 또는 플러그인이 실행 단계에서 `kotlinOptions.freeCompilerArgs`를 수정할 수 있도록 하지만, 빌드 로그에 경고를 생성합니다. 이 경고를 비활성화하려면 새로운 Gradle 속성 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`를 사용하세요. Gradle은 [`kotlin-dsl` 플러그인](https://github.com/gradle/gradle/issues/22091)과 [Jetpack Compose가 활성화된 AGP](https://issuetracker.google.com/u/1/issues/247544167)에 대한 수정 사항을 추가할 예정입니다.

### 최소 지원 버전 상향

Kotlin 1.8.0부터 최소 지원 Gradle 버전은 6.8.3이며, 최소 지원 Android Gradle 플러그인 버전은 4.1.3입니다.

[문서에서 사용 가능한 Gradle 버전과의 Kotlin Gradle 플러그인 호환성](gradle-configure-project.md#apply-the-plugin)을 참조하세요.

### Kotlin 데몬 대체 전략 비활성화 기능

새로운 Gradle 속성 `kotlin.daemon.useFallbackStrategy`가 있으며, 기본값은 `true`입니다. 값이 `false`이면 데몬 시작 또는 통신 문제 시 빌드가 실패합니다. Kotlin 컴파일 작업에는 새로운 `useDaemonFallbackStrategy` 속성도 있으며, 둘 다 사용할 경우 Gradle 속성보다 우선합니다. 컴파일을 실행하기에 메모리가 부족하면 로그에서 관련 메시지를 확인할 수 있습니다.

Kotlin 컴파일러의 대체 전략은 데몬이 어떤 식으로든 실패할 경우 Kotlin 데몬 외부에서 컴파일을 실행하는 것입니다. Gradle 데몬이 켜져 있으면 컴파일러는 "In process" 전략을 사용하고, Gradle 데몬이 꺼져 있으면 "Out of process" 전략을 사용합니다. [문서에서 이러한 실행 전략](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)에 대해 자세히 알아보세요. 다른 전략으로 자동 대체되는 것은 많은 시스템 리소스를 소모하거나 비결정적인 빌드로 이어질 수 있다는 점에 유의하세요. 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)를 참조하세요.

### 전이 종속성에서 최신 kotlin-stdlib 버전 사용

종속성에 Kotlin 버전 1.8.0 이상을 명시적으로 작성하는 경우(예: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`), Kotlin Gradle 플러그인은 전이 종속성인 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`에 해당 Kotlin 버전을 사용합니다. 이는 서로 다른 stdlib 버전으로 인한 클래스 중복을 피하기 위함입니다([`kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`이 `kotlin-stdlib`로 통합](#updated-jvm-compilation-target)에 대해 자세히 알아보세요). 이 동작은 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 속성을 사용하여 비활성화할 수 있습니다:

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

버전 정렬에 문제가 발생하는 경우, 빌드 스크립트에서 `kotlin-bom`에 대한 플랫폼 종속성을 선언하여 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)을 통해 모든 버전을 정렬하세요:

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

다른 경우와 제안된 해결책에 대해서는 [문서](gradle-configure-project.md#other-ways-to-align-versions)를 참조하세요.

### 관련 Kotlin 및 Java 컴파일 작업의 JVM 타겟 의무적 확인

> 이 섹션은 소스 파일이 Kotlin으로만 작성되어 있고 Java를 사용하지 않는 JVM 프로젝트에도 적용됩니다.
>
{style="note"}

[이번 릴리스부터](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8), Gradle 8.0 이상 프로젝트(이 버전의 Gradle은 아직 출시되지 않음)에서 [`kotlin.jvm.target.validation.mode` 속성](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)의 기본값이 `error`로 변경되며, JVM 타겟 비호환성이 발생할 경우 플러그인이 빌드를 실패시킬 것입니다.

`warning`에서 `error`로 기본값이 변경된 것은 Gradle 8.0으로의 원활한 마이그레이션을 위한 준비 단계입니다. **이 속성을 `error`로 설정하고** [툴체인(toolchain)을 구성](gradle-configure-project.md#gradle-java-toolchains-support)하거나 JVM 버전을 수동으로 정렬하는 것을 권장합니다.

[타겟 호환성을 확인하지 않을 경우 발생할 수 있는 문제](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)에 대해 자세히 알아보세요.

### Kotlin Gradle 플러그인의 전이 종속성 해결

Kotlin 1.7.0에서 [Gradle 플러그인 변형(variants) 지원](whatsnew17.md#support-for-gradle-plugin-variants)을 도입했습니다.
이러한 플러그인 변형으로 인해 빌드 클래스패스에는 다른 버전의 종속성, 일반적으로 `kotlin-gradle-plugin-api`에 의존하는 다른 버전의 [Kotlin Gradle 플러그인](https://plugins.gradle.org/u/kotlin)이 포함될 수 있습니다. 이로 인해 해결 문제가 발생할 수 있으며, `kotlin-dsl` 플러그인을 예시로 다음 해결 방법을 제안하고자 합니다.

Gradle 7.6의 `kotlin-dsl` 플러그인은 `kotlin-gradle-plugin-api:1.7.10`에 의존하는 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 플러그인에 의존합니다. 만약 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 플러그인을 추가하면, 이 `kotlin-gradle-plugin-api:1.7.10` 전이 종속성은 버전(`1.8.0`과 `1.7.10`)과 변형 속성의 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 값 간의 불일치로 인해 종속성 해결 오류를 일으킬 수 있습니다. 임시 해결책으로, 버전을 정렬하기 위해 이 [제약 조건](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)을 추가하세요. 이 해결책은 [Kotlin Gradle Plugin 라이브러리 정렬 플랫폼](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform) 구현 시까지 필요할 수 있으며, 이는 계획 중입니다:

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

이 제약 조건은 전이 종속성에 대해 빌드 클래스패스에서 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 버전을 사용하도록 강제합니다. [Gradle 이슈 트래커](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)에서 유사한 사례에 대해 자세히 알아보세요.

### 사용 중단 및 제거

Kotlin 1.8.0에서는 다음 속성 및 메서드에 대한 사용 중단 주기가 계속됩니다:

*   [Kotlin 1.7.0 노트](whatsnew17.md#changes-in-compile-tasks)에서 `KotlinCompile` 작업이 여전히 사용 중단된 Kotlin 속성 `classpath`를 가지고 있으며, 이는 향후 릴리스에서 제거될 것이라고 언급했습니다. 이제 `KotlinCompile` 작업의 `classpath` 속성에 대한 사용 중단 수준을 `error`로 변경했습니다. 모든 컴파일 작업은 컴파일에 필요한 라이브러리 목록에 대해 `libraries` 입력을 사용합니다.
*   Gradle Workers API를 통해 [kapt](kapt.md) 실행을 허용했던 `kapt.use.worker.api` 속성을 제거했습니다. 기본적으로 [kapt는 Kotlin 1.3.70부터 Gradle 워커를 사용하고](kapt.md#run-kapt-tasks-in-parallel) 있으며, 이 방법을 고수하는 것을 권장합니다.
*   Kotlin 1.7.0에서 [`kotlin.compiler.execution.strategy` 속성](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)에 대한 사용 중단 주기의 시작을 [발표](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)했습니다. 이번 릴리스에서는 이 속성을 제거했습니다. 다른 방법으로 [Kotlin 컴파일러 실행 전략을 정의하는 방법](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)을 알아보세요.

## 표준 라이브러리

Kotlin 1.8.0은 다음을 포함합니다:
*   [JVM 컴파일 타겟](#updated-jvm-compilation-target)을 업데이트합니다.
*   여러 함수를 안정화합니다 – [Java와 Kotlin 간의 TimeUnit 변환](#timeunit-conversion-between-java-and-kotlin), [`cbrt()`](#cbrt), [Java `Optionals` 확장 함수](#java-optionals-extension-functions).
*   비교 가능하고 뺄셈 가능한 [`TimeMarks`](#comparable-and-subtractable-timemarks)의 [미리보기]를 제공합니다.
*   `java.nio.file.path`를 위한 [실험적 확장 함수](#recursive-copying-or-deletion-of-directories)를 포함합니다.
*   [향상된 kotlin-reflect 성능](#improved-kotlin-reflect-performance)을 선보입니다.

### 업데이트된 JVM 컴파일 타겟

Kotlin 1.8.0에서 표준 라이브러리(`kotlin-stdlib`, `kotlin-reflect`, `kotlin-script-*`)는 JVM 타겟 1.8로 컴파일됩니다.
이전에는 표준 라이브러리가 JVM 타겟 1.6으로 컴파일되었습니다.

Kotlin 1.8.0은 더 이상 JVM 타겟 1.6 및 1.7을 지원하지 않습니다. 결과적으로, 이들 아티팩트의 내용이 `kotlin-stdlib`로 통합되었기 때문에 빌드 스크립트에서 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`을 개별적으로 선언할 필요가 없습니다.

> 빌드 스크립트에 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`을 종속성으로 명시적으로 선언한 경우, `kotlin-stdlib`로 대체해야 합니다.
>
{style="note"}

서로 다른 버전의 stdlib 아티팩트를 혼합하면 클래스 중복 또는 클래스 누락이 발생할 수 있습니다.
이를 방지하기 위해 Kotlin Gradle 플러그인이 [stdlib 버전을 정렬](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)하는 데 도움을 줄 수 있습니다.

### cbrt()

`double` 또는 `float`의 실제 세제곱근을 계산할 수 있는 `cbrt()` 함수가 이제 안정화(Stable)되었습니다.

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("The cube root of ${num.toDouble()} is: " +
            cbrt(num.toDouble()))
    println("The cube root of ${negNum.toDouble()} is: " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### Java와 Kotlin 간의 TimeUnit 변환

`kotlin.time`의 `toTimeUnit()` 및 `toDurationUnit()` 함수가 이제 안정화(Stable)되었습니다. Kotlin 1.6.0에서 실험적(Experimental)으로 도입된 이 함수들은 Kotlin과 Java 간의 상호 운용성을 향상시킵니다. 이제 Java의 `java.util.concurrent.TimeUnit`과 Kotlin의 `kotlin.time.DurationUnit` 간에 쉽게 변환할 수 있습니다. 이 함수들은 JVM에서만 지원됩니다.

```kotlin
import kotlin.time.*

// For use from Java
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 비교 가능하고 뺄셈 가능한 TimeMarks

> `TimeMarks`의 새로운 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)이며, 이를 사용하려면 `@OptIn(ExperimentalTime::class)` 또는 `@ExperimentalTime`를 사용하여 옵트인(opt-in)해야 합니다.
>
{style="warning"}

Kotlin 1.8.0 이전에는 여러 `TimeMarks`와 **현재** 시간 사이의 시간 차이를 계산하려면 한 번에 하나의 `TimeMark`에 대해서만 `elapsedNow()`를 호출할 수 있었습니다. 이는 두 `elapsedNow()` 함수 호출이 정확히 동시에 실행될 수 없었기 때문에 결과를 비교하기 어렵게 만들었습니다.

이를 해결하기 위해 Kotlin 1.8.0에서는 동일한 시간 소스에서 `TimeMarks`를 빼고 비교할 수 있습니다. 이제 **현재**를 나타내는 새로운 `TimeMark` 인스턴스를 생성하고 다른 `TimeMarks`를 이 인스턴스에서 뺄 수 있습니다. 이렇게 하면 이러한 계산에서 수집한 결과가 서로 상대적이라는 것이 보장됩니다.

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds
    val mark2 = timeSource.markNow()

    // Before 1.8.0
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // Difference between elapsed1 and elapsed2 can vary depending
        // on how much time passes between the two elapsedNow() calls
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // Since 1.8.0
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // Now the elapsed times are calculated relative to mark3,
        // which is a fixed value
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other
    // This is true, as mark2 was captured later than mark1
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

이 새로운 기능은 다양한 프레임을 나타내는 여러 `TimeMarks` 간의 차이를 계산하거나 비교하려는 애니메이션 계산에서 특히 유용합니다.

### 디렉토리 내용 재귀적 복사 또는 삭제

> `java.nio.file.Path`를 위한 이 새로운 함수들은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 사용하려면 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 또는 `@kotlin.io.path.ExperimentalPathApi`를 사용하여 옵트인(opt-in)해야 합니다. 또는 컴파일러 옵션 `-opt-in=kotlin.io.path.ExperimentalPathApi`를 사용할 수 있습니다.
>
{style="warning"}

`java.nio.file.Path`를 위한 두 가지 새로운 확장 함수인 `copyToRecursively()` 및 `deleteRecursively()`를 도입했습니다. 이 함수들을 사용하면 다음을 재귀적으로 수행할 수 있습니다:

*   디렉토리와 그 내용을 다른 대상에 복사합니다.
*   디렉토리와 그 내용을 삭제합니다.

이 함수들은 백업 프로세스의 일부로 매우 유용하게 사용될 수 있습니다.

#### 오류 처리

`copyToRecursively()`를 사용하여 복사 중 예외가 발생할 경우 어떻게 처리할지 `onError` 람다 함수를 오버로드하여 정의할 수 있습니다:

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "Failed to copy $source to $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

`deleteRecursively()`를 사용할 때 파일 또는 폴더를 삭제하는 동안 예외가 발생하면 해당 파일 또는 폴더는 건너뛰어집니다. 삭제가 완료되면 `deleteRecursively()`는 발생한 모든 예외를 억제된(suppressed) 예외로 포함하는 `IOException`을 던집니다.

#### 파일 덮어쓰기

`copyToRecursively()`가 대상 디렉토리에 파일이 이미 존재함을 발견하면 예외가 발생합니다.
대신 파일을 덮어쓰려면 `overwrite`를 인수로 가지고 `true`로 설정하는 오버로드를 사용하세요:

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // patches the common fixture
}
```
{validate="false"}

#### 사용자 지정 복사 작업

자신만의 사용자 지정 복사 로직을 정의하려면 `copyAction`을 추가 인수로 가지는 오버로드를 사용하세요.
`copyAction`을 사용하면 원하는 작업을 포함하는 람다 함수를 제공할 수 있습니다:

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false) { source, target ->
    if (source.name.startsWith(".")) {
        CopyActionResult.SKIP_SUBTREE
    } else {
        source.copyToIgnoringExistingDirectory(target, followLinks = false)
        CopyActionResult.CONTINUE
    }
}
```
{validate="false"}

이러한 확장 함수에 대한 자세한 내용은 [API 레퍼런스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)를 참조하세요.

### Java Optionals 확장 함수

[Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)에서 도입된 확장 함수들이 이제 안정화(Stable)되었습니다. 이 함수들은 Java의 Optional 클래스와의 작업을 단순화합니다. JVM에서 `Optional` 객체를 언랩(unwrap)하고 변환하는 데 사용될 수 있으며, Java API와의 작업을 더 간결하게 만듭니다. 자세한 내용은 [Kotlin 1.7.0의 새로운 기능](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)을 참조하세요.

### 향상된 kotlin-reflect 성능

`kotlin-reflect`가 이제 JVM 타겟 1.8로 컴파일된다는 이점을 활용하여, 내부 캐시 메커니즘을 Java의 `ClassValue`로 마이그레이션했습니다. 이전에는 `KClass`만 캐싱했지만, 이제 `KType`과 `KDeclarationContainer`도 캐싱합니다. 이러한 변경 사항은 `typeOf()`를 호출할 때 상당한 성능 향상을 가져왔습니다.

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있습니다:

### 개편된 페이지 및 새로운 페이지

*   [Gradle 개요](gradle.md) – Kotlin Gradle 플러그인에서 Gradle 빌드 시스템을 사용하여 Kotlin 프로젝트를 구성하고 빌드하는 방법, 사용 가능한 컴파일러 옵션, 컴파일 및 캐시에 대해 알아보세요.
*   [Java 및 Kotlin의 Nullability](java-to-kotlin-nullability-guide.md) – null 가능성이 있는 변수를 처리하는 Java와 Kotlin의 접근 방식 간의 차이점을 확인하세요.
*   [Lincheck 가이드](lincheck-guide.md) – JVM에서 동시성 알고리즘을 테스트하기 위한 Lincheck 프레임워크를 설정하고 사용하는 방법을 알아보세요.

### 새로운 튜토리얼 및 업데이트된 튜토리얼

*   [Gradle 및 Kotlin/JVM 시작하기](get-started-with-jvm-gradle-project.md) – IntelliJ IDEA와 Gradle을 사용하여 콘솔 애플리케이션을 생성합니다.
*   [Ktor 및 SQLDelight를 사용한 멀티플랫폼 앱 생성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – Kotlin Multiplatform Mobile을 사용하여 iOS 및 Android용 모바일 애플리케이션을 생성합니다.
*   [Kotlin Multiplatform 시작하기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlin을 사용한 크로스 플랫폼 모바일 개발에 대해 알아보고 Android 및 iOS에서 모두 작동하는 앱을 생성합니다.

## Kotlin 1.8.0 설치

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3, 2022.1, 2022.2는 Kotlin 플러그인을 버전 1.8.0으로 업데이트하도록 자동으로 제안합니다. IntelliJ IDEA 2022.3은 향후 마이너 업데이트에서 Kotlin 플러그인 1.8.0 버전이 번들로 제공될 예정입니다.

> IntelliJ IDEA 2022.3에서 기존 프로젝트를 Kotlin 1.8.0으로 마이그레이션하려면, Kotlin 버전을 `1.8.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하세요.
>
{style="note"}

Android Studio Electric Eel (221) 및 Flamingo (222)의 경우, Kotlin 플러그인 1.8.0 버전은 향후 Android Studio 업데이트와 함께 제공될 예정입니다. 새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0)에서 다운로드할 수 있습니다.

## Kotlin 1.8.0 호환성 가이드

Kotlin 1.8.0은 [기능 릴리스](kotlin-evolution-principles.md#language-and-tooling-releases)이므로, 이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항을 가져올 수 있습니다. 이러한 변경 사항에 대한 자세한 목록은 [Kotlin 1.8.0 호환성 가이드](compatibility-guide-18.md)에서 확인할 수 있습니다.