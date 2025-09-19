[//]: # (title: Kotlin 1.8.0의 새로운 기능)

_[릴리스: 2022년 12월 28일](releases.md#release-details)_

Kotlin 1.8.0 릴리스가 공개되었으며, 다음은 주요 하이라이트입니다:

*   [JVM용 새로운 실험적 함수: 디렉터리 콘텐츠 재귀적으로 복사 또는 삭제](#recursive-copying-or-deletion-of-directories)
*   [향상된 `kotlin-reflect` 성능](#improved-kotlin-reflect-performance)
*   [더 나은 디버깅 경험을 위한 새로운 `-Xdebug` 컴파일러 옵션](#a-new-compiler-option-for-disabling-optimizations)
*   [`kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`이 `kotlin-stdlib`로 병합됨](#updated-jvm-compilation-target)
*   [향상된 Objective-C/Swift 상호 운용성](#improved-objective-c-swift-interoperability)
*   [Gradle 7.3과의 호환성](#gradle)

## IDE 지원

1.8.0을 지원하는 Kotlin 플러그인은 다음 IDE에서 사용할 수 있습니다:

| IDE            | 지원 버전                  |
|:---------------|:-------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2   |
| Android Studio | Electric Eel (221), Flamingo (222) |

> IntelliJ IDEA 2022.3에서 IDE 플러그인을 업데이트하지 않고도 프로젝트를 Kotlin 1.8.0으로 업데이트할 수 있습니다.
>
> IntelliJ IDEA 2022.3에서 기존 프로젝트를 Kotlin 1.8.0으로 마이그레이션하려면, Kotlin 버전을 `1.8.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 가져오세요.
>
{style="note"}

## Kotlin/JVM

버전 1.8.0부터 컴파일러는 JVM 19에 해당하는 바이트코드 버전으로 클래스를 생성할 수 있습니다. 새로운 언어 버전에는 다음이 포함됩니다:

*   [JVM 어노테이션 타겟 생성을 끄는 컴파일러 옵션](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
*   [최적화를 비활성화하는 새로운 `-Xdebug` 컴파일러 옵션](#a-new-compiler-option-for-disabling-optimizations)
*   [이전 백엔드 제거](#removal-of-the-old-backend)
*   [Lombok의 `@Builder` 어노테이션 지원](#support-for-lombok-s-builder-annotation)

### TYPE_USE 및 TYPE_PARAMETER 어노테이션 타겟을 생성하지 않는 기능

Kotlin 어노테이션이 Kotlin 타겟 중 `TYPE`을 가지고 있다면, 해당 어노테이션은 Java 어노테이션 타겟 목록에서 `java.lang.annotation.ElementType.TYPE_USE`에 매핑됩니다. 이는 `TYPE_PARAMETER` Kotlin 타겟이 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 타겟에 매핑되는 방식과 같습니다. 이는 API에 이러한 타겟이 없는 API 레벨 26 미만의 Android 클라이언트에게 문제가 됩니다.

Kotlin 1.8.0부터는 새로운 컴파일러 옵션인 `-Xno-new-java-annotation-targets`를 사용하여 `TYPE_USE` 및 `TYPE_PARAMETER` 어노테이션 타겟 생성을 피할 수 있습니다.

### 최적화를 비활성화하는 새로운 컴파일러 옵션

Kotlin 1.8.0에는 더 나은 디버깅 경험을 위해 최적화를 비활성화하는 새로운 컴파일러 옵션 `-Xdebug`가 추가되었습니다. 현재로서는 이 옵션이 코루틴의 "최적화 제거됨(was optimized out)" 기능을 비활성화합니다. 앞으로 더 많은 최적화를 추가하면 이 옵션도 해당 최적화를 비활성화할 것입니다.

"최적화 제거됨(was optimized out)" 기능은 `suspend` 함수를 사용할 때 변수를 최적화합니다. 하지만 최적화된 변수는 그 값을 볼 수 없기 때문에 코드를 디버깅하기 어렵습니다.

> **이 옵션을 프로덕션에서 절대 사용하지 마세요**: `-Xdebug`를 통해 이 기능을 비활성화하면 [메모리 누수](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)를 유발할 수 있습니다.
>
{style="warning"}

### 이전 백엔드 제거

Kotlin 1.5.0에서 우리는 IR 기반 백엔드가 [안정화(Stable)](components-stability.md)되었음을 [발표](whatsnew15.md#stable-jvm-ir-backend)했습니다. 이는 Kotlin 1.4.*의 이전 백엔드가 더 이상 사용되지 않음을 의미했습니다. Kotlin 1.8.0에서는 이전 백엔드를 완전히 제거했습니다. 따라서 컴파일러 옵션 `-Xuse-old-backend` 및 Gradle 옵션 `useOldBackend`도 제거되었습니다.

### Lombok의 @Builder 어노테이션 지원

커뮤니티에서 [Kotlin Lombok: 생성된 빌더 지원 (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) YouTrack 이슈에 너무나 많은 투표를 해주셔서 우리는 [@Builder 어노테이션](https://projectlombok.org/features/Builder)을 지원할 수밖에 없었습니다.

아직 `@SuperBuilder` 또는 `@Tolerate` 어노테이션을 지원할 계획은 없지만, [SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 및 [Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 이슈에 충분한 투표가 있다면 재고할 것입니다.

[Lombok 컴파일러 플러그인을 구성하는 방법 알아보기](lombok.md#gradle).

## Kotlin/Native

Kotlin 1.8.0에는 Objective-C 및 Swift 상호 운용성 변경 사항, Xcode 14.1 지원, CocoaPods Gradle 플러그인 개선 사항이 포함됩니다:

*   [Xcode 14.1 지원](#support-for-xcode-14-1)
*   [향상된 Objective-C/Swift 상호 운용성](#improved-objective-c-swift-interoperability)
*   [CocoaPods Gradle 플러그인에서 기본적으로 동적 프레임워크](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Xcode 14.1 지원

Kotlin/Native 컴파일러는 이제 최신 안정화된 Xcode 버전인 14.1을 지원합니다. 호환성 개선 사항에는 다음 변경 사항이 포함됩니다:

*   watchOS 타겟을 위한 새로운 `watchosDeviceArm64` 프리셋이 추가되어 ARM64 플랫폼의 Apple watchOS를 지원합니다.
*   Kotlin CocoaPods Gradle 플러그인은 기본적으로 Apple 프레임워크에 대한 비트코드(bitcode) 임베딩을 더 이상 포함하지 않습니다.
*   Apple 타겟의 Objective-C 프레임워크 변경 사항을 반영하여 플랫폼 라이브러리가 업데이트되었습니다.

### 향상된 Objective-C/Swift 상호 운용성

Kotlin을 Objective-C 및 Swift와 더욱 상호 운용 가능하게 만들기 위해 세 가지 새로운 어노테이션이 추가되었습니다:

*   [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/)은 Kotlin 선언의 이름을 변경하는 대신 Swift 또는 Objective-C에서 보다 관용적인 이름을 지정할 수 있도록 합니다.

    이 어노테이션은 Kotlin 컴파일러에게 이 클래스, 속성, 매개변수 또는 함수에 대해 사용자 정의 Objective-C 및 Swift 이름을 사용하도록 지시합니다:

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

*   [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/)는 Kotlin 선언을 Objective-C에서 숨길 수 있도록 합니다.

    이 어노테이션은 Kotlin 컴파일러에게 함수나 속성을 Objective-C, 그리고 결과적으로 Swift로 내보내지 않도록 지시합니다. 이는 Kotlin 코드를 Objective-C/Swift에 더 친화적으로 만들 수 있습니다.

*   [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/)는 Kotlin 선언을 Swift로 작성된 래퍼(wrapper)로 대체하는 데 유용합니다.

    이 어노테이션은 Kotlin 컴파일러에게 생성된 Objective-C API에서 함수나 속성을 `swift_private`로 표시하도록 지시합니다. 이러한 선언에는 `__` 접두사가 붙어 Swift 코드에서는 보이지 않게 됩니다.

    예를 들어, Swift 코드에서 이러한 선언을 사용하여 Swift 친화적인 API를 만들 수 있지만, Xcode의 자동 완성 기능에서는 제안되지 않습니다.

    Swift에서 Objective-C 선언을 개선하는 방법에 대한 자세한 내용은 [Apple 공식 문서](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)를 참조하세요.

> 새로운 어노테이션은 [옵트인](opt-in-requirements.md)이 필요합니다.
>
{style="note"}

Kotlin 팀은 이러한 어노테이션을 구현해준 [Rick Clephas](https://github.com/rickclephas)에게 매우 감사합니다.

### CocoaPods Gradle 플러그인에서 기본적으로 동적 프레임워크

Kotlin 1.8.0부터 CocoaPods Gradle 플러그인에 의해 등록된 Kotlin 프레임워크는 기본적으로 동적으로 링크됩니다. 이전의 정적 구현은 Kotlin Gradle 플러그인의 동작과 일치하지 않았습니다.

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

정적 링크 유형을 사용하는 기존 프로젝트가 있고 Kotlin 1.8.0으로 업그레이드(또는 링크 유형을 명시적으로 변경)하는 경우, 프로젝트 실행 시 오류가 발생할 수 있습니다. 이를 해결하려면 Xcode 프로젝트를 닫고 Podfile 디렉터리에서 `pod install`을 실행하세요.

자세한 내용은 [CocoaPods Gradle 플러그인 DSL 참조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)를 참조하세요.

## Kotlin 멀티플랫폼: 새로운 Android 소스 세트 레이아웃

Kotlin 1.8.0은 기존의 혼란스러운 디렉터리 명명 체계를 대체하는 새로운 Android 소스 세트 레이아웃을 도입합니다.

현재 레이아웃에서 생성된 두 개의 `androidTest` 디렉터리 예를 살펴보겠습니다. 하나는 `KotlinSourceSets`용이고 다른 하나는 `AndroidSourceSets`용입니다:

*   이들은 의미론적으로 다릅니다. Kotlin의 `androidTest`는 `unitTest` 유형에 속하고, Android의 `androidTest`는 `integrationTest` 유형에 속합니다.
*   `src/androidTest/kotlin`에는 `UnitTest`가 있고 `src/androidTest/java`에는 `InstrumentedTest`가 있어 `SourceDirectories` 레이아웃을 혼란스럽게 만듭니다.
*   `KotlinSourceSets`와 `AndroidSourceSets` 모두 Gradle 구성에 유사한 명명 체계를 사용하므로, Kotlin과 Android 소스 세트 모두에 대한 `androidTest`의 결과 구성은 `androidTestImplementation`, `androidTestApi`, `androidTestRuntimeOnly`, `androidTestCompileOnly`로 동일합니다.

이러한 문제 및 기타 기존 문제를 해결하기 위해 새로운 Android 소스 세트 레이아웃을 도입했습니다. 다음은 두 레이아웃 간의 주요 차이점입니다:

#### KotlinSourceSet 명명 체계

| 현재 소스 세트 레이아웃             | 새 소스 세트 레이아웃              |
|:-----------------------------------|:-----------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}`은 다음과 같이 `{KotlinSourceSet.name}`에 매핑됩니다:

|             | 현재 소스 세트 레이아웃 | 새 소스 세트 레이아웃              |
|:------------|:----------------------|:---------------------------------|
| main        | androidMain           | androidMain                      |
| test        | androidTest           | android**Unit**Test              |
| androidTest | android**Android**Test | android**Instrumented**Test      |

#### 소스 디렉터리

| 현재 소스 세트 레이아웃                                 | 새 소스 세트 레이아웃                                                                     |
|:--------------------------------------------------------|:------------------------------------------------------------------------------------------|
| 레이아웃은 추가 `/kotlin` 소스 디렉터리를 추가합니다.      | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin`                |

`{AndroidSourceSet.name}`은 다음과 같이 `{SourceDirectories included}`에 매핑됩니다:

|             | 현재 소스 세트 레이아웃                                  | 새 소스 세트 레이아웃                                                                                  |
|:------------|:---------------------------------------------------------|:-------------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                                 |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android**Unit**Test/kotlin, src/test/kotlin, src/test/java                                         |
| androidTest | src/android**Android**Test/kotlin, src/androidTest/java | src/android**Instrumented**Test/kotlin, src/androidTest/java, **src/androidTest/kotlin** |

#### AndroidManifest.xml 파일의 위치

| 현재 소스 세트 레이아웃                          | 새 소스 세트 레이아웃                                |
|:-----------------------------------------------|:-----------------------------------------------------|
| src/{**Android**SourceSet.name}/AndroidManifest.xml | src/{**Kotlin**SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}`은 다음과 같이 `{AndroidManifest.xml location}`에 매핑됩니다:

|       | 현재 소스 세트 레이아웃      | 새 소스 세트 레이아웃                      |
|:------|:-----------------------------|:-----------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/**android**Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/**android**Debug/AndroidManifest.xml |

#### Android와 공통 테스트 간의 관계

새로운 Android 소스 세트 레이아웃은 Android 계측 테스트(새 레이아웃에서는 `androidInstrumentedTest`로 이름 변경)와 공통 테스트 간의 관계를 변경합니다.

이전에는 `androidAndroidTest`와 `commonTest` 사이에 기본 `dependsOn` 관계가 있었습니다. 실제로는 다음을 의미했습니다:

*   `commonTest`의 코드를 `androidAndroidTest`에서 사용할 수 있었습니다.
*   `commonTest`의 `expect` 선언은 `androidAndroidTest`에 해당 `actual` 구현을 가져야 했습니다.
*   `commonTest`에 선언된 테스트도 Android 계측 테스트로 실행되었습니다.

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

#### Android 플레이버(flavor) 지원

이전에는 Kotlin Gradle 플러그인이 `debug` 및 `release` 빌드 타입 또는 `demo` 및 `full`과 같은 사용자 정의 플레이버를 가진 Android 소스 세트에 해당하는 소스 세트를 적극적으로 생성했습니다. 이는 `val androidDebug by getting { ... }`와 같은 구문을 통해 접근 가능하게 했습니다.

새로운 Android 소스 세트 레이아웃에서는 해당 소스 세트가 `afterEvaluate` 단계에서 생성됩니다. 이로 인해 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`와 같은 오류가 발생하여 이러한 표현식이 유효하지 않게 됩니다.

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

이전 Android 스타일 디렉터리 사용은 이제 권장되지 않습니다. Kotlin 1.8.0은 현재 레이아웃에 대한 경고를 도입하며 사용 중단 주기의 시작을 알립니다. 다음 Gradle 속성을 사용하여 경고를 억제할 수 있습니다:

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0은 JS IR 컴파일러 백엔드를 안정화하고 JavaScript 관련 Gradle 빌드 스크립트에 새로운 기능을 제공합니다:
*   [안정화된 JS IR 컴파일러 백엔드](#stable-js-ir-compiler-backend)
*   [`yarn.lock` 파일이 업데이트되었음을 보고하는 새로운 설정](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
*   [Gradle 속성을 통해 브라우저용 테스트 타겟 추가](#add-test-targets-for-browsers-via-gradle-properties)
*   [프로젝트에 CSS 지원을 추가하는 새로운 접근 방식](#new-approach-to-adding-css-support-to-your-project)

### 안정화된 JS IR 컴파일러 백엔드

이번 릴리스부터 [Kotlin/JS 중간 표현(IR 기반) 컴파일러](js-ir-compiler.md) 백엔드가 안정화되었습니다. 세 가지 백엔드 모두에 대한 인프라를 통합하는 데 시간이 걸렸지만, 이제 Kotlin 코드에 대해 동일한 IR로 작동합니다.

안정화된 JS IR 컴파일러 백엔드의 결과로, 이전 백엔드는 이제부터 사용이 중단됩니다.

안정화된 JS IR 컴파일러와 함께 증분 컴파일이 기본적으로 활성화됩니다.

이전 컴파일러를 계속 사용하는 경우, [마이그레이션 가이드](js-ir-migration.md)의 도움을 받아 프로젝트를 새 백엔드로 전환하세요.

### `yarn.lock` 파일이 업데이트되었음을 보고하는 새로운 설정

`yarn` 패키지 관리자를 사용하는 경우, `yarn.lock` 파일이 업데이트되었음을 알려줄 수 있는 세 가지 새로운 특별 Gradle 설정이 있습니다. CI 빌드 프로세스 중에 `yarn.lock`이 자동으로 변경되었는지 알림을 받고 싶을 때 이 설정을 사용할 수 있습니다.

이 세 가지 새로운 Gradle 속성은 다음과 같습니다:

*   `YarnLockMismatchReport`는 `yarn.lock` 파일의 변경 사항이 보고되는 방식을 지정합니다. 다음 값 중 하나를 사용할 수 있습니다:
    *   `FAIL`은 해당 Gradle 작업을 실패시킵니다. 이것이 기본값입니다.
    *   `WARNING`은 변경 사항에 대한 정보를 경고 로그에 기록합니다.
    *   `NONE`은 보고 기능을 비활성화합니다.
*   `reportNewYarnLock`은 최근에 생성된 `yarn.lock` 파일에 대해 명시적으로 보고합니다. 기본적으로 이 옵션은 비활성화되어 있습니다. 이는 첫 시작 시 새 `yarn.lock` 파일을 생성하는 것이 일반적인 관행이기 때문입니다. 이 옵션을 사용하여 파일이 리포지토리에 커밋되었는지 확인할 수 있습니다.
*   `yarnLockAutoReplace`는 Gradle 작업이 실행될 때마다 `yarn.lock`을 자동으로 대체합니다.

이 옵션을 사용하려면 `build.gradle.kts` 빌드 스크립트 파일을 다음과 같이 업데이트하세요:

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

### Gradle 속성을 통해 브라우저용 테스트 타겟 추가

Kotlin 1.8.0부터 Gradle 속성 파일에서 다양한 브라우저에 대한 테스트 타겟을 바로 설정할 수 있습니다. 이렇게 하면 `build.gradle.kts`에 모든 타겟을 작성할 필요가 없어 빌드 스크립트 파일의 크기가 줄어듭니다.

이 속성을 사용하여 모든 모듈에 대한 브라우저 목록을 정의한 다음, 특정 모듈의 빌드 스크립트에 특정 브라우저를 추가할 수 있습니다.

예를 들어, Gradle 속성 파일의 다음 줄은 모든 모듈에서 Firefox와 Safari로 테스트를 실행합니다:

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

속성에 사용 가능한 전체 값 목록은 [GitHub](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)에서 확인하세요.

Kotlin 팀은 이 기능을 구현해준 [Martynas Petuška](https://github.com/mpetuska)에게 매우 감사합니다.

### 프로젝트에 CSS 지원을 추가하는 새로운 접근 방식

이번 릴리스에서는 프로젝트에 CSS 지원을 추가하는 새로운 접근 방식을 제공합니다. 이는 많은 프로젝트에 영향을 미칠 것으로 예상되므로, 아래 설명된 대로 Gradle 빌드 스크립트 파일을 업데이트하는 것을 잊지 마세요.

Kotlin 1.8.0 이전에는 `cssSupport.enabled` 속성이 CSS 지원을 추가하는 데 사용되었습니다:

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

Kotlin 1.8.0은 Gradle 버전 7.2 및 7.3을 **완전히** 지원합니다. 최신 Gradle 릴리스까지도 사용할 수 있지만, 그럴 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 염두에 두세요.

이 버전에는 많은 변경 사항이 포함되어 있습니다:
*   [Gradle 지연 속성(lazy properties)으로 Kotlin 컴파일러 옵션 노출](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
*   [최소 지원 버전 상향 조정](#bumping-the-minimum-supported-versions)
*   [Kotlin 데몬 폴백(fallback) 전략 비활성화 기능](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
*   [전이적 종속성에서 최신 `kotlin-stdlib` 버전 사용](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
*   [관련 Kotlin 및 Java 컴파일 작업의 JVM 타겟 호환성 일치 여부 필수 확인](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
*   [Kotlin Gradle 플러그인의 전이적 종속성 해결](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
*   [사용 중단 및 제거](#deprecations-and-removals)

### Gradle 지연 속성(lazy properties)으로 Kotlin 컴파일러 옵션 노출

사용 가능한 Kotlin 컴파일러 옵션을 [Gradle 지연 속성(lazy properties)](https://docs.gradle.org/current/userguide/lazy_configuration.html)으로 노출하고 Kotlin 작업에 더 잘 통합하기 위해 많은 변경 사항을 적용했습니다:

*   컴파일 작업에는 기존 `kotlinOptions`와 유사하지만 반환 타입으로 Gradle Properties API의 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html)를 사용하는 새로운 `compilerOptions` 입력이 있습니다:

    ```kotlin
    tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
        compilerOptions {
            useK2.set(true)
        }
    }
    ```

*   Kotlin 도구 작업인 `KotlinJsDce` 및 `KotlinNativeLink`에는 기존 `kotlinOptions` 입력과 유사한 새로운 `toolOptions` 입력이 있습니다.
*   새로운 입력에는 [`@Nested` Gradle 어노테이션](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)이 있습니다. 입력 내부의 모든 속성에는 [`@Input` 또는 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)와 같은 관련 Gradle 어노테이션이 있습니다.
*   Kotlin Gradle 플러그인 API 아티팩트에는 두 가지 새로운 인터페이스가 있습니다:
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`는 `compilerOptions` 입력과 `compileOptions()` 메서드를 가집니다. 모든 Kotlin 컴파일 작업은 이 인터페이스를 구현합니다.
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`는 `toolOptions` 입력과 `toolOptions()` 메서드를 가집니다. 모든 Kotlin 도구 작업 — `KotlinJsDce`, `KotlinNativeLink`, `KotlinNativeLinkArtifactTask` —은 이 인터페이스를 구현합니다.
*   일부 `compilerOptions`는 `String` 타입 대신 새로운 타입을 사용합니다:
    *   [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    *   [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) (for the `apiVersion` and the `languageVersion` inputs)
    *   [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    *   [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    *   [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

    예를 들어, `kotlinOptions.jvmTarget = "11"` 대신 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`을 사용할 수 있습니다.

    `kotlinOptions` 타입은 변경되지 않았으며, 내부적으로 `compilerOptions` 타입으로 변환됩니다.
*   Kotlin Gradle 플러그인 API는 이전 릴리스와 바이너리 호환됩니다. 하지만 `kotlin-gradle-plugin` 아티팩트에는 일부 소스 및 ABI(Application Binary Interface) 호환성을 깨는 변경 사항이 있습니다. 이러한 변경 사항 대부분은 일부 내부 타입에 추가 제네릭 매개변수를 포함합니다. 한 가지 중요한 변경 사항은 `KotlinNativeLink` 작업이 더 이상 `AbstractKotlinNativeCompile` 작업을 상속하지 않는다는 것입니다.
*   `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션은 더 이상 사용되지 않습니다. 대신 `Kotlin2JsCompile.outputFileProperty` 작업 입력을 사용하세요.

> Kotlin Gradle 플러그인은 여전히 `KotlinJvmOptions` DSL을 Android 확장 기능에 추가합니다:
>
> ```kotlin
> android { 
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 이 문제는 `compilerOptions` DSL이 모듈 레벨로 추가될 때 [이 이슈](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) 범위 내에서 변경될 것입니다.
>
{style="note"}

#### 제한 사항

> `kotlinOptions` 작업 입력 및 `kotlinOptions{...}` 작업 DSL은 지원 모드이며 향후 릴리스에서 사용 중단될 예정입니다. 개선 사항은 `compilerOptions` 및 `toolOptions`에만 적용될 것입니다.
>
{style="warning"}

`kotlinOptions`에 대한 setter 또는 getter를 호출하는 것은 `compilerOptions`의 관련 속성에 위임합니다. 이는 다음과 같은 제한 사항을 도입합니다:
*   `compilerOptions`와 `kotlinOptions`는 작업 실행 단계에서 변경할 수 없습니다 (아래 단락의 한 가지 예외 참조).
*   `freeCompilerArgs`는 변경 불가능한 `List<String>`을 반환합니다. 이는 예를 들어 `kotlinOptions.freeCompilerArgs.remove("something")`이 실패한다는 것을 의미합니다.

[`kotlin-dsl`](https://github.com/gradle/gradle/issues/22091) 플러그인과 [Jetpack Compose](https://developer.android.com/jetpack/compose)가 활성화된 Android Gradle 플러그인(AGP)을 포함한 여러 플러그인이 작업 실행 단계에서 `freeCompilerArgs` 속성을 수정하려고 시도합니다. Kotlin 1.8.0에서는 이를 위한 해결책을 추가했습니다. 이 해결책을 통해 모든 빌드 스크립트 또는 플러그인이 실행 단계에서 `kotlinOptions.freeCompilerArgs`를 수정할 수 있지만, 빌드 로그에 경고가 생성됩니다. 이 경고를 비활성화하려면 새로운 Gradle 속성 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`를 사용하세요. Gradle은 [`kotlin-dsl` 플러그인](https://github.com/gradle/gradle/issues/22091)과 [Jetpack Compose가 활성화된 AGP](https://issuetracker.google.com/u/1/issues/247544167)에 대한 수정 사항을 추가할 예정입니다.

### 최소 지원 버전 상향 조정

Kotlin 1.8.0부터 최소 지원 Gradle 버전은 6.8.3이고, 최소 지원 Android Gradle 플러그인 버전은 4.1.3입니다.

[문서에서 Kotlin Gradle 플러그인과 사용 가능한 Gradle 버전 간의 호환성](gradle-configure-project.md#apply-the-plugin)을 확인하세요.

### Kotlin 데몬 폴백(fallback) 전략 비활성화 기능

새로운 Gradle 속성 `kotlin.daemon.useFallbackStrategy`가 있으며, 기본값은 `true`입니다. 이 값이 `false`이면, 데몬 시작 또는 통신 문제 발생 시 빌드가 실패합니다. Kotlin 컴파일 작업에는 새로운 `useDaemonFallbackStrategy` 속성도 있으며, 둘 다 사용하는 경우 이 속성이 Gradle 속성보다 우선합니다. 컴파일을 실행할 메모리가 부족한 경우 로그에서 관련 메시지를 확인할 수 있습니다.

Kotlin 컴파일러의 폴백(fallback) 전략은 데몬이 어떤 이유로든 실패할 경우 Kotlin 데몬 외부에서 컴파일을 실행하는 것입니다. Gradle 데몬이 켜져 있으면 컴파일러는 "In process" 전략을 사용합니다. Gradle 데몬이 꺼져 있으면 "Out of process" 전략을 사용합니다. 이 [실행 전략](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)에 대한 자세한 내용은 문서에서 확인하세요. 다른 전략으로 자동 전환되는 폴백은 많은 시스템 리소스를 소모하거나 비결정적인 빌드를 초래할 수 있습니다. 자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)를 참조하세요.

### 전이적 종속성에서 최신 kotlin-stdlib 버전 사용

종속성에 Kotlin 버전 1.8.0 이상을 명시적으로 작성하는 경우(예: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`), Kotlin Gradle 플러그인은 전이적 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8` 종속성에 해당 Kotlin 버전을 사용합니다. 이는 다른 stdlib 버전으로 인한 클래스 중복을 방지하기 위함입니다([`kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`이 `kotlin-stdlib`로 병합되는 내용](#updated-jvm-compilation-target)에 대해 자세히 알아보기).

`kotlin.stdlib.jdk.variants.version.alignment` Gradle 속성을 사용하여 이 동작을 비활성화할 수 있습니다:

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

버전 정렬에 문제가 발생하면, 빌드 스크립트에서 `kotlin-bom`에 대한 플랫폼 종속성을 선언하여 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)을 통해 모든 버전을 정렬하세요:

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

다른 경우 및 권장 해결책에 대해서는 [문서](gradle-configure-project.md#other-ways-to-align-versions)에서 확인하세요.

### 관련 Kotlin 및 Java 컴파일 작업의 JVM 타겟 호환성 일치 여부 필수 확인

> 이 섹션은 소스 파일이 Kotlin으로만 되어 있고 Java를 사용하지 않는 JVM 프로젝트에도 적용됩니다.
>
{style="note"}

[이번 릴리스부터](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8), Gradle 8.0 이상(이 Gradle 버전은 아직 릴리스되지 않음) 프로젝트의 경우 [`kotlin.jvm.target.validation.mode` 속성](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)의 기본값이 `error`로 변경되며, JVM 타겟 비호환성이 발생할 경우 플러그인이 빌드를 실패시킵니다.

기본값이 `warning`에서 `error`로 변경되는 것은 Gradle 8.0으로의 원활한 마이그레이션을 위한 준비 단계입니다. **이 속성을 `error`로 설정하고** [툴체인](gradle-configure-project.md#gradle-java-toolchains-support)을 구성하거나 JVM 버전을 수동으로 정렬할 것을 권장합니다.

[타겟 호환성을 확인하지 않으면 발생할 수 있는 문제](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)에 대해 자세히 알아보세요.

### Kotlin Gradle 플러그인의 전이적 종속성 해결

Kotlin 1.7.0에서는 [Gradle 플러그인 변형 지원](whatsnew17.md#support-for-gradle-plugin-variants)을 도입했습니다. 이러한 플러그인 변형으로 인해 빌드 클래스패스에 일반적으로 `kotlin-gradle-plugin-api`와 같은 일부 종속성의 다른 버전에 의존하는 [Kotlin Gradle 플러그인](https://plugins.gradle.org/u/kotlin)의 다른 버전이 포함될 수 있습니다. 이는 해결 문제로 이어질 수 있으며, `kotlin-dsl` 플러그인을 예로 들어 다음 해결책을 제안합니다.

Gradle 7.6의 `kotlin-dsl` 플러그인은 `kotlin-gradle-plugin-api:1.7.10`에 의존하는 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 플러그인에 의존합니다. `org.jetbrains.kotlin.gradle.jvm:1.8.0` 플러그인을 추가하면, 이 `kotlin-gradle-plugin-api:1.7.10` 전이적 종속성은 버전(`1.8.0`과 `1.7.10`)과 변형 속성의 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 값 간의 불일치로 인해 종속성 해결 오류를 유발할 수 있습니다. 해결책으로, 버전을 정렬하기 위해 이 [제약 조건](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)을 추가하세요. 이 해결책은 우리가 [Kotlin Gradle 플러그인 라이브러리 정렬 플랫폼](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform)을 구현할 때까지 필요할 수 있으며, 이는 계획 중입니다:

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

이 제약 조건은 전이적 종속성에 대해 빌드 클래스패스에서 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 버전을 강제 사용하도록 합니다. 유사한 [Gradle 이슈 트래커의 사례](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)에 대해 자세히 알아보세요.

### 사용 중단 및 제거

Kotlin 1.8.0에서는 다음 속성 및 메서드에 대한 사용 중단 주기가 계속됩니다:

*   [Kotlin 1.7.0 노트](whatsnew17.md#changes-in-compile-tasks)에서 `KotlinCompile` 작업이 여전히 더 이상 사용되지 않는 Kotlin 속성 `classpath`를 가지고 있으며, 이는 향후 릴리스에서 제거될 것이라고 언급했습니다. 이제 우리는 `KotlinCompile` 작업의 `classpath` 속성에 대한 사용 중단 수준을 `error`로 변경했습니다. 모든 컴파일 작업은 컴파일에 필요한 라이브러리 목록에 `libraries` 입력을 사용합니다.
*   Gradle Workers API를 통해 [kapt](kapt.md)를 실행할 수 있었던 `kapt.use.worker.api` 속성을 제거했습니다. 기본적으로 [kapt는 Kotlin 1.3.70부터 Gradle 워커를 사용하고](kapt.md#run-kapt-tasks-in-parallel) 있으며, 이 방법을 고수할 것을 권장합니다.
*   Kotlin 1.7.0에서 우리는 `kotlin.compiler.execution.strategy` 속성의 사용 중단 주기 시작을 [발표](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)했습니다. 이번 릴리스에서는 이 속성을 제거했습니다. [다른 방법으로 Kotlin 컴파일러 실행 전략을 정의하는 방법](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)을 알아보세요.

## 표준 라이브러리

Kotlin 1.8.0:
*   [JVM 컴파일 타겟](#updated-jvm-compilation-target) 업데이트.
*   여러 함수 안정화 – [Java와 Kotlin 간의 TimeUnit 변환](#timeunit-conversion-between-java-and-kotlin), [`cbrt()`](#cbrt), [Java `Optionals` 확장 함수](#java-optionals-extension-functions).
*   비교 및 빼기가 가능한 `TimeMarks`의 [프리뷰 제공](#comparable-and-subtractable-timemarks).
*   `java.nio.file.path`에 대한 [실험적 확장 함수](#recursive-copying-or-deletion-of-directories) 포함.
*   [향상된 `kotlin-reflect` 성능](#improved-kotlin-reflect-performance) 제공.

### 업데이트된 JVM 컴파일 타겟

Kotlin 1.8.0에서는 표준 라이브러리(`kotlin-stdlib`, `kotlin-reflect`, `kotlin-script-*`)가 JVM 타겟 1.8로 컴파일됩니다. 이전에는 표준 라이브러리가 JVM 타겟 1.6으로 컴파일되었습니다.

Kotlin 1.8.0은 더 이상 JVM 타겟 1.6 및 1.7을 지원하지 않습니다. 결과적으로 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8` 아티팩트의 내용이 `kotlin-stdlib`로 병합되었기 때문에 빌드 스크립트에서 이들을 별도로 선언할 필요가 없습니다.

> 빌드 스크립트에 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`을 종속성으로 명시적으로 선언했다면, 이를 `kotlin-stdlib`로 교체해야 합니다.
>
{style="note"}

다른 버전의 stdlib 아티팩트를 혼합하면 클래스 중복 또는 클래스 누락으로 이어질 수 있습니다. 이를 방지하기 위해 Kotlin Gradle 플러그인은 [stdlib 버전 정렬](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)을 도울 수 있습니다.

### cbrt()

`double` 또는 `float`의 실제 세제곱근을 계산할 수 있는 `cbrt()` 함수가 이제 안정화되었습니다.

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

`kotlin.time`의 `toTimeUnit()` 및 `toDurationUnit()` 함수가 이제 안정화되었습니다. Kotlin 1.6.0에서 실험적으로 도입된 이 함수들은 Kotlin과 Java 간의 상호 운용성을 향상시킵니다. 이제 Java `java.util.concurrent.TimeUnit`과 Kotlin `kotlin.time.DurationUnit` 간에 쉽게 변환할 수 있습니다. 이 함수들은 JVM에서만 지원됩니다.

```kotlin
import kotlin.time.*

// For use from Java
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 비교 및 빼기가 가능한 TimeMarks

> `TimeMarks`의 새로운 기능은 [실험적](components-stability.md#stability-levels-explained)이며, 이를 사용하려면 `@OptIn(ExperimentalTime::class)` 또는 `@ExperimentalTime`을 사용하여 옵트인해야 합니다.
>
{style="warning"}

Kotlin 1.8.0 이전에는 여러 `TimeMark`와 **현재 시간(now)** 사이의 시간 차이를 계산하려면 한 번에 하나의 `TimeMark`에 대해서만 `elapsedNow()`를 호출할 수 있었습니다. 이는 두 `elapsedNow()` 함수 호출이 정확히 같은 시간에 실행될 수 없었기 때문에 결과를 비교하기 어렵게 만들었습니다.

이 문제를 해결하기 위해 Kotlin 1.8.0에서는 동일한 시간 소스에서 `TimeMark`를 빼고 비교할 수 있습니다. 이제 **현재 시간(now)**을 나타내는 새로운 `TimeMark` 인스턴스를 생성하고 다른 `TimeMark`를 이로부터 뺄 수 있습니다. 이렇게 하면 이러한 계산에서 수집되는 결과가 서로 상대적임이 보장됩니다.

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

이 새로운 기능은 여러 프레임을 나타내는 여러 `TimeMark` 간의 차이를 계산하거나 비교하려는 애니메이션 계산에 특히 유용합니다.

### 디렉터리 재귀적 복사 또는 삭제

> `java.nio.file.Path`에 대한 이 새로운 함수들은 [실험적](components-stability.md#stability-levels-explained)입니다. 이를 사용하려면 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 또는 `@kotlin.io.path.ExperimentalPathApi`를 사용하여 옵트인해야 합니다. 또는 컴파일러 옵션 `-opt-in=kotlin.io.path.ExperimentalPathApi`를 사용할 수 있습니다.
>
{style="warning"}

`java.nio.file.Path`에 대해 `copyToRecursively()`와 `deleteRecursively()`라는 두 가지 새로운 확장 함수를 도입했으며, 이를 통해 다음 작업을 재귀적으로 수행할 수 있습니다:

*   디렉터리와 그 내용을 다른 목적지로 복사합니다.
*   디렉터리와 그 내용을 삭제합니다.

이 함수들은 백업 프로세스의 일부로 매우 유용할 수 있습니다.

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

`deleteRecursively()`를 사용할 때 파일 또는 폴더를 삭제하는 동안 예외가 발생하면 해당 파일 또는 폴더는 건너뛰어집니다. 삭제가 완료되면 `deleteRecursively()`는 발생한 모든 예외를 억제된 예외(suppressed exceptions)로 포함하는 `IOException`을 던집니다.

#### 파일 덮어쓰기

`copyToRecursively()`가 대상 디렉터리에 파일이 이미 존재하는 것을 발견하면 예외가 발생합니다. 대신 파일을 덮어쓰려면 `overwrite`를 인수로 가지고 `true`로 설정된 오버로드를 사용하세요:

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

#### 사용자 정의 복사 액션

자신만의 사용자 정의 복사 로직을 정의하려면, `copyAction`을 추가 인수로 가지는 오버로드를 사용하세요. `copyAction`을 사용하면 원하는 동작을 포함하는 람다 함수를 제공할 수 있습니다:

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

이 확장 함수에 대한 자세한 내용은 [API 참조](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)를 참조하세요.

### Java Optionals 확장 함수

[Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)에서 도입된 확장 함수들이 이제 안정화되었습니다. 이 함수들은 Java의 Optional 클래스 작업을 단순화합니다. 이 함수들은 JVM에서 `Optional` 객체를 언랩(unwrap)하고 변환하는 데 사용될 수 있으며, Java API 작업을 더 간결하게 만듭니다. 자세한 내용은 [Kotlin 1.7.0의 새로운 기능](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)을 참조하세요.

### 향상된 kotlin-reflect 성능

`kotlin-reflect`가 JVM 타겟 1.8로 컴파일된다는 이점을 활용하여, 내부 캐시 메커니즘을 Java의 `ClassValue`로 마이그레이션했습니다. 이전에는 `KClass`만 캐시했지만, 이제는 `KType`과 `KDeclarationContainer`도 캐시합니다. 이러한 변경 사항은 `typeOf()` 호출 시 상당한 성능 향상을 가져왔습니다.

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있었습니다:

### 개편된 페이지 및 새 페이지

*   [Gradle 개요](gradle.md) – Gradle 빌드 시스템으로 Kotlin 프로젝트를 구성하고 빌드하는 방법, 사용 가능한 컴파일러 옵션, Kotlin Gradle 플러그인의 컴파일 및 캐시에 대해 알아보세요.
*   [Java와 Kotlin의 Nullability](java-to-kotlin-nullability-guide.md) – null 가능성이 있는 변수를 처리하는 Java와 Kotlin의 접근 방식 간의 차이점을 확인하세요.
*   [Lincheck 가이드](lincheck-guide.md) – JVM에서 동시성 알고리즘을 테스트하기 위한 Lincheck 프레임워크를 설정하고 사용하는 방법을 알아보세요.

### 새로운 및 업데이트된 튜토리얼

*   [Gradle 및 Kotlin/JVM 시작하기](get-started-with-jvm-gradle-project.md) – IntelliJ IDEA 및 Gradle을 사용하여 콘솔 애플리케이션을 생성합니다.
*   [Ktor 및 SQLDelight를 사용하여 멀티플랫폼 앱 생성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – Kotlin Multiplatform Mobile을 사용하여 iOS 및 Android용 모바일 애플리케이션을 생성합니다.
*   [Kotlin 멀티플랫폼 시작하기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlin을 사용한 크로스 플랫폼 모바일 개발에 대해 알아보고 Android 및 iOS에서 모두 작동하는 앱을 생성합니다.

## Kotlin 1.8.0 설치

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3, 2022.1 및 2022.2는 Kotlin 플러그인을 버전 1.8.0으로 업데이트하도록 자동으로 제안합니다. IntelliJ IDEA 2022.3에는 다가오는 마이너 업데이트에서 Kotlin 플러그인 1.8.0 버전이 번들로 제공될 예정입니다.

> IntelliJ IDEA 2022.3에서 기존 프로젝트를 Kotlin 1.8.0으로 마이그레이션하려면, Kotlin 버전을 `1.8.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 가져오세요.
>
{style="note"}

Android Studio Electric Eel (221) 및 Flamingo (222)의 경우, Kotlin 플러그인 버전 1.8.0은 다가오는 Android Studio 업데이트와 함께 제공될 예정입니다. 새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0)에서 다운로드할 수 있습니다.

## Kotlin 1.8.0 호환성 가이드

Kotlin 1.8.0은 [기능 릴리스(feature release)](kotlin-evolution-principles.md#language-and-tooling-releases)이므로, 이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항을 포함할 수 있습니다. 이러한 변경 사항에 대한 자세한 목록은 [Kotlin 1.8.0 호환성 가이드](compatibility-guide-18.md)에서 확인할 수 있습니다.