---
title: "Kotlin 1.8.0의 새로운 기능"
---
_[배포일: 2022년 12월 28일](releases#release-details)_

Kotlin 1.8.0 릴리스가 완료되었습니다. 주요 내용은 다음과 같습니다.

* [JVM용 새로운 실험적 기능: 디렉터리 콘텐츠를 재귀적으로 복사 또는 삭제합니다.](#recursive-copying-or-deletion-of-directories)
* [kotlin-reflect 성능 향상](#improved-kotlin-reflect-performance)
* [더 나은 디버깅 환경을 위한 새로운 -Xdebug 컴파일러 옵션](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`이 `kotlin-stdlib`로 병합됨](#updated-jvm-compilation-target)
* [Objective-C/Swift 상호 운용성 개선](#improved-objective-c-swift-interoperability)
* [Gradle 7.3과의 호환성](#gradle)

## IDE 지원

1.8.0을 지원하는 Kotlin 플러그인은 다음에서 사용할 수 있습니다.

| IDE            | 지원 버전                       |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |
:::note
IDE 플러그인을 업데이트하지 않고도 IntelliJ IDEA 2022.3에서 프로젝트를 Kotlin 1.8.0으로 업데이트할 수 있습니다.

IntelliJ IDEA 2022.3에서 기존 프로젝트를 Kotlin 1.8.0으로 마이그레이션하려면 Kotlin 버전을 `1.8.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 가져오세요.

:::

## Kotlin/JVM

버전 1.8.0부터 컴파일러는 JVM 19에 해당하는 바이트코드 버전으로 클래스를 생성할 수 있습니다.
새 언어 버전에는 다음도 포함됩니다.

* [JVM 어노테이션 대상 생성을 끄는 컴파일러 옵션](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [최적화를 비활성화하는 새로운 `-Xdebug` 컴파일러 옵션](#a-new-compiler-option-for-disabling-optimizations)
* [이전 백엔드 제거](#removal-of-the-old-backend)
* [Lombok의 @Builder 어노테이션 지원](#support-for-lombok-s-builder-annotation)

### TYPE_USE 및 TYPE_PARAMETER 어노테이션 대상 생성 기능

Kotlin 어노테이션에 Kotlin 대상에 `TYPE`이 있는 경우, 어노테이션은 Java 어노테이션 대상 목록에서 `java.lang.annotation.ElementType.TYPE_USE`에 매핑됩니다. 이는 `TYPE_PARAMETER` Kotlin 대상이 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 대상에 매핑되는 방식과 같습니다. 이는 API 수준이 26 미만인 Android 클라이언트에게는 API에 이러한 대상이 없으므로 문제가 됩니다.

Kotlin 1.8.0부터 새로운 컴파일러 옵션 `-Xno-new-java-annotation-targets`를 사용하여 `TYPE_USE` 및 `TYPE_PARAMETER` 어노테이션 대상 생성을 피할 수 있습니다.

### 최적화를 비활성화하는 새로운 컴파일러 옵션

Kotlin 1.8.0은 더 나은 디버깅 환경을 위해 최적화를 비활성화하는 새로운 `-Xdebug` 컴파일러 옵션을 추가합니다.
현재 이 옵션은 코루틴에 대한 "최적화됨" 기능을 비활성화합니다. 앞으로 더 많은 최적화를 추가한 후에는 이 옵션으로도 비활성화할 수 있습니다.

"최적화됨" 기능은 일시 중단 함수를 사용할 때 변수를 최적화합니다. 그러나 최적화된 변수가 있는 코드는 값을 볼 수 없으므로 디버깅하기 어렵습니다.

:::note
**프로덕션 환경에서는 이 옵션을 사용하지 마세요**. `-Xdebug`를 통해 이 기능을 비활성화하면 [메모리 누수가 발생할 수 있습니다](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0).

### 이전 백엔드 제거

Kotlin 1.5.0에서 IR 기반 백엔드가 [안정화되었다고](whatsnew15#stable-jvm-ir-backend) [발표](components-stability)했습니다.
이는 Kotlin 1.4.*의 이전 백엔드가 더 이상 사용되지 않음을 의미합니다. Kotlin 1.8.0에서는 이전 백엔드를 완전히 제거했습니다.
확장하여 컴파일러 옵션 `-Xuse-old-backend` 및 Gradle `useOldBackend` 옵션을 제거했습니다.

### Lombok의 @Builder 어노테이션 지원

커뮤니티에서 [Kotlin Lombok: 생성된 빌더 지원(@Builder)](https://youtrack.jetbrains.com/issue/KT-46959)
YouTrack 이슈에 너무 많은 표를 추가하여 [@Builder 어노테이션](https://projectlombok.org/features/Builder)을 지원해야 했습니다.

아직 `@SuperBuilder` 또는 `@Tolerate` 어노테이션을 지원할 계획은 없지만, 충분한 사람이 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 및
[@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 이슈에 투표하면 다시 고려할 것입니다.

[Lombok 컴파일러 플러그인을 구성하는 방법을 알아보세요](lombok#gradle).

## Kotlin/Native

Kotlin 1.8.0에는 Objective-C 및 Swift 상호 운용성, Xcode 14.1 지원 및 CocoaPods Gradle 플러그인 개선 사항에 대한 변경 사항이 포함되어 있습니다.

* [Xcode 14.1 지원](#support-for-xcode-14-1)
* [Objective-C/Swift 상호 운용성 개선](#improved-objective-c-swift-interoperability)
* [CocoaPods Gradle 플러그인의 기본 동적 프레임워크](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Xcode 14.1 지원

Kotlin/Native 컴파일러는 이제 최신 안정적인 Xcode 버전인 14.1을 지원합니다. 호환성 개선 사항에는 다음 변경 사항이 포함됩니다.

* ARM64 플랫폼에서 Apple watchOS를 지원하는 watchOS 대상에 대한 새로운 `watchosDeviceArm64` 프리셋이 있습니다.
* Kotlin CocoaPods Gradle 플러그인에는 기본적으로 Apple 프레임워크에 대한 비트코드 임베딩이 더 이상 없습니다.
* 플랫폼 라이브러리가 업데이트되어 Apple 대상에 대한 Objective-C 프레임워크의 변경 사항을 반영합니다.

### Objective-C/Swift 상호 운용성 개선

Kotlin과 Objective-C 및 Swift 간의 상호 운용성을 높이기 위해 세 가지 새로운 어노테이션이 추가되었습니다.

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/)을 사용하면 Kotlin 선언 이름을 바꾸는 대신 Swift 또는 Objective-C에서 더 관용적인 이름을 지정할 수 있습니다.

  어노테이션은 Kotlin 컴파일러에 이 클래스, 속성, 매개변수 또는 함수에 대한 사용자 지정 Objective-C 및 Swift 이름을 사용하도록 지시합니다.

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // ObjCName 어노테이션과 함께 사용
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/)를 사용하면 Objective-C에서 Kotlin 선언을 숨길 수 있습니다.

  어노테이션은 Kotlin 컴파일러에 함수 또는 속성을 Objective-C 및 결과적으로 Swift로 내보내지 않도록 지시합니다.
  이렇게 하면 Kotlin 코드를 더욱 Objective-C/Swift 친화적으로 만들 수 있습니다.

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/)는 Kotlin 선언을 Swift로 작성된 래퍼로 대체하는 데 유용합니다.

  어노테이션은 Kotlin 컴파일러에 함수 또는 속성을 생성된 Objective-C API에서 `swift_private`로 표시하도록 지시합니다. 이러한 선언에는 `__` 접두사가 붙어 Swift 코드에서 보이지 않게 됩니다.

  Swift 코드에서 이러한 선언을 사용하여 Swift 친화적인 API를 만들 수 있지만, 예를 들어 Xcode의 자동 완성에서 제안하지 않습니다.

  Swift에서 Objective-C 선언을 구체화하는 방법에 대한 자세한 내용은 [공식 Apple 설명서](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)를 참조하세요.

새로운 어노테이션에는 [옵트인](opt-in-requirements)이 필요합니다.

:::

Kotlin 팀은 이러한 어노테이션을 구현해 주신 [Rick Clephas](https://github.com/rickclephas)에게 매우 감사드립니다.

### CocoaPods Gradle 플러그인의 기본 동적 프레임워크

Kotlin 1.8.0부터 CocoaPods Gradle 플러그인에 등록된 Kotlin 프레임워크는 기본적으로 동적으로 연결됩니다.
이전 정적 구현은 Kotlin Gradle 플러그인의 동작과 일치하지 않았습니다.

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // 이제 기본적으로 동적
        }
    }
}
```

정적 연결 유형이 있는 기존 프로젝트가 있고 Kotlin 1.8.0으로 업그레이드하거나 연결 유형을 명시적으로 변경하는 경우 프로젝트 실행에 오류가 발생할 수 있습니다. 이를 해결하려면 Xcode 프로젝트를 닫고 Podfile 디렉터리에서 `pod install`을 실행하세요.

자세한 내용은 [CocoaPods Gradle 플러그인 DSL 참조](native-cocoapods-dsl-reference)를 참조하세요.

## Kotlin Multiplatform: 새로운 Android 소스 세트 레이아웃

Kotlin 1.8.0은 여러 가지 혼란스러운 방식으로 디렉터리의 이전 명명 스키마를 대체하는 새로운 Android 소스 세트 레이아웃을 도입합니다.

현재 레이아웃에서 생성된 두 개의 `androidTest` 디렉터리 예제를 고려해 보겠습니다. 하나는 `KotlinSourceSets`용이고 다른 하나는 `AndroidSourceSets`용입니다.

* 의미 체계가 다릅니다. Kotlin의 `androidTest`는 `unitTest` 유형에 속하고 Android의 `androidTest`는 `integrationTest` 유형에 속합니다.
* `src/androidTest/kotlin`에는 `UnitTest`가 있고 `src/androidTest/java`에는 `InstrumentedTest`가 있으므로 혼란스러운 `SourceDirectories` 레이아웃을 만듭니다.
* `KotlinSourceSets`와 `AndroidSourceSets` 모두 Gradle 구성에 대해 유사한 명명 스키마를 사용하므로 Kotlin 및 Android 소스 세트 모두에 대한 `androidTest`의 결과 구성은 동일합니다. `androidTestImplementation`, `androidTestApi`, `androidTestRuntimeOnly` 및 `androidTestCompileOnly`.

이러한 문제와 기존 문제를 해결하기 위해 새로운 Android 소스 세트 레이아웃을 도입했습니다.
다음은 두 레이아웃 간의 주요 차이점입니다.

#### KotlinSourceSet 명명 스키마

| 현재 소스 세트 레이아웃               | 새로운 소스 세트 레이아웃                |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}`은 다음과 같이 `{KotlinSourceSet.name}`에 매핑됩니다.

|             | 현재 소스 세트 레이아웃 | 새로운 소스 세트 레이아웃           |
|-------------|---------------------------|---------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 현재 소스 세트 레이아웃                               | 새로운 소스 세트 레이아웃                                                    |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| 레이아웃에 추가 `/kotlin` SourceDirectories 추가됨  | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}`은 다음과 같이 `{SourceDirectories included}`에 매핑됩니다.

|             | 현재 소스 세트 레이아웃                                  | 새로운 소스 세트 레이아웃                                                                          |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 파일의 위치

| 현재 소스 세트 레이아웃                              | 새로운 소스 세트 레이아웃                                |
|--------------------------------------------------------|------------------------------------------------------|
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}`은 다음과 같이`{AndroidManifest.xml location}`에 매핑됩니다.

|       | 현재 소스 세트 레이아웃     | 새로운 소스 세트 레이아웃                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android와 공통 테스트 간의 관계

새로운 Android 소스 세트 레이아웃은 Android 계측 테스트(새 레이아웃에서 `androidInstrumentedTest`로 이름이 변경됨)와 공통 테스트 간의 관계를 변경합니다.

이전에는 `androidAndroidTest`와 `commonTest` 사이에 기본 `dependsOn` 관계가 있었습니다. 실제로 다음을 의미했습니다.

* `commonTest`의 코드는 `androidAndroidTest`에서 사용할 수 있었습니다.
* `commonTest`의 `expect` 선언은 `androidAndroidTest`에 해당하는 `actual` 구현이 있어야 했습니다.
* `commonTest`에 선언된 테스트도 Android 계측 테스트로 실행되었습니다.

새로운 Android 소스 세트 레이아웃에서는 `dependsOn` 관계가 기본적으로 추가되지 않습니다. 이전 동작을 선호하는 경우 `build.gradle.kts` 파일에서 이 관계를 수동으로 선언하세요.

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

#### Android flavor 지원

이전에는 Kotlin Gradle 플러그인이 `debug` 및 `release` 빌드 유형 또는 `demo` 및 `full`과 같은 사용자 지정 flavor를 사용하여 Android 소스 세트에 해당하는 소스 세트를 적극적으로 생성했습니다.
`val androidDebug by getting { ... }`과 같은 구성으로 액세스할 수 있게 되었습니다.

새로운 Android 소스 세트 레이아웃에서는 이러한 소스 세트가 `afterEvaluate` 단계에서 생성됩니다. 이렇게 하면 이러한 표현식이 유효하지 않아 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`와 같은 오류가 발생합니다.

이를 해결하려면 `build.gradle.kts` 파일에서 새로운 `invokeWhenCreated()` API를 사용하세요.

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 구성 및 설정

새로운 레이아웃은 향후 릴리스에서 기본값이 됩니다. 다음 Gradle 옵션을 사용하여 지금 활성화할 수 있습니다.

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

:::note
새로운 레이아웃에는 Android Gradle 플러그인 7.0 이상이 필요하며 Android Studio 2022.3 이상에서 지원됩니다.

:::

이전 Android 스타일 디렉터리의 사용은 이제 권장되지 않습니다. Kotlin 1.8.0은 현재 레이아웃에 대한 경고를 도입하여 더 이상 사용되지 않는 주기를 시작합니다. 다음 Gradle 속성을 사용하여 경고를 표시하지 않을 수 있습니다.

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0은 JS IR 컴파일러 백엔드를 안정화하고 JavaScript 관련 Gradle 빌드 스크립트에 새로운 기능을 제공합니다.
* [안정적인 JS IR 컴파일러 백엔드](#stable-js-ir-compiler-backend)
* [yarn.lock이 업데이트되었음을 보고하기 위한 새로운 설정](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [Gradle 속성을 통해 브라우저에 대한 테스트 대상 추가](#add-test-targets-for-browsers-via-gradle-properties)
* [프로젝트에 CSS 지원을 추가하는 새로운 접근 방식](#new-approach-to-adding-css-support-to-your-project)

### 안정적인 JS IR 컴파일러 백엔드

이 릴리스부터 [Kotlin/JS 중간 표현(IR 기반) 컴파일러](js-ir-compiler) 백엔드가 안정화되었습니다. 세 가지 백엔드 모두에 대한 인프라를 통합하는 데 시간이 걸렸지만 이제 Kotlin 코드에 대해 동일한 IR을 사용합니다.

안정적인 JS IR 컴파일러 백엔드의 결과로 이전 백엔드는 지금부터 더 이상 사용되지 않습니다.

증분 컴파일은 안정적인 JS IR 컴파일러와 함께 기본적으로 활성화됩니다.

여전히 이전 컴파일러를 사용하는 경우 [마이그레이션 가이드](js-ir-migration)를 사용하여 프로젝트를 새로운 백엔드로 전환하세요.

### yarn.lock이 업데이트되었음을 보고하기 위한 새로운 설정

`yarn` 패키지 관리자를 사용하는 경우 `yarn.lock` 파일이 업데이트되었음을 알릴 수 있는 세 가지 새로운 특수 Gradle 설정이 있습니다. CI 빌드 프로세스 중에 `yarn.lock`이 자동으로 변경된 경우 알림을 받으려면 이러한 설정을 사용할 수 있습니다.

이러한 세 가지 새로운 Gradle 속성은 다음과 같습니다.

* `YarnLockMismatchReport`: `yarn.lock` 파일에 대한 변경 사항이 보고되는 방식을 지정합니다. 다음 값 중 하나를 사용할 수 있습니다.
    * `FAIL`은 해당 Gradle 작업을 실패합니다. 이것이 기본값입니다.
    * `WARNING`은 경고 로그에 변경 사항에 대한 정보를 기록합니다.
    * `NONE`은 보고를 비활성화합니다.
* `reportNewYarnLock`: 최근에 생성된 `yarn.lock` 파일에 대해 명시적으로 보고합니다. 기본적으로 이 옵션은 비활성화되어 있습니다. 새 `yarn.lock` 파일을 처음 시작할 때 생성하는 것이 일반적인 방법입니다. 이 옵션을 사용하여 파일이 리포지토리에 커밋되었는지 확인할 수 있습니다.
* `yarnLockAutoReplace`: Gradle 작업이 실행될 때마다 `yarn.lock`을 자동으로 바꿉니다.

이러한 옵션을 사용하려면 빌드 스크립트 파일 `build.gradle.kts`를 다음과 같이 업데이트하세요.

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) \{
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
\}
```

### Gradle 속성을 통해 브라우저에 대한 테스트 대상 추가

Kotlin 1.8.0부터 Gradle 속성 파일에서 직접 다른 브라우저에 대한 테스트 대상을 설정할 수 있습니다. 이렇게 하면 `build.gradle.kts`에 모든 대상을 쓸 필요가 없으므로 빌드 스크립트 파일의 크기가 줄어듭니다.

이 속성을 사용하여 모든 모듈에 대한 브라우저 목록을 정의한 다음 특정 모듈의 빌드 스크립트에 특정 브라우저를 추가할 수 있습니다.

예를 들어 Gradle 속성 파일의 다음 줄은 모든 모듈에 대해 Firefox 및 Safari에서 테스트를 실행합니다.

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

[GitHub에서 속성에 사용할 수 있는 전체 값 목록](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)을 참조하세요.

Kotlin 팀은 이 기능을 구현해 주신 [Martynas Petuška](https://github.com/mpetuska)에게 매우 감사드립니다.

### 프로젝트에 CSS 지원을 추가하는 새로운 접근 방식

이 릴리스는 프로젝트에 CSS 지원을 추가하는 새로운 접근 방식을 제공합니다. 이는 많은 프로젝트에 영향을 미칠 것으로 예상되므로 아래 설명된 대로 Gradle 빌드 스크립트 파일을 업데이트하는 것을 잊지 마세요.

Kotlin 1.8.0 이전에는 `cssSupport.enabled` 속성을 사용하여 CSS 지원을 추가했습니다.

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

이제 `cssSupport {}` 블록에서 `enabled.set()` 메서드를 사용해야 합니다.

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

Kotlin 1.8.0은 Gradle 버전 7.2 및 7.3을 **완전히** 지원합니다. 최신 Gradle 릴리스까지 Gradle 버전을 사용할 수도 있지만 이 경우 더 이상 사용되지 않는 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

이 버전은 많은 변경 사항을 제공합니다.
* [Kotlin 컴파일러 옵션을 Gradle Lazy Properties로 노출](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [최소 지원 버전 늘림](#bumping-the-minimum-supported-versions)
* [Kotlin 데몬 폴백 전략을 비활성화하는 기능](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [전이 종속성에서 최신 kotlin-stdlib 버전 사용](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [관련 Kotlin 및 Java 컴파일 작업의 JVM 대상 호환성 동일성에 대한 의무적 검사](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Kotlin Gradle 플러그인의 전이 종속성 확인](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [더 이상 사용되지 않는 항목 및 제거](#deprecations-and-removals)

### Kotlin 컴파일러 옵션을 Gradle Lazy Properties로 노출

사용 가능한 Kotlin 컴파일러 옵션을 [Gradle Lazy Properties](https://docs.gradle.org/current/userguide/lazy_configuration.html)로 노출하고 Kotlin 작업에 더 잘 통합하기 위해 많은 변경 사항을 만들었습니다.

* 컴파일 작업에는 기존 `kotlinOptions`와 유사하지만 Gradle Properties API의 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html)를 반환 유형으로 사용하는 새로운 `compilerOptions` 입력이 있습니다.

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin 도구 작업 `KotlinJsDce` 및 `KotlinNativeLink`에는 기존 `kotlinOptions` 입력과 유사한 새로운 `toolOptions` 입력이 있습니다.
* 새로운 입력에는 [`@Nested` Gradle 어노테이션](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)이 있습니다. 입력 내부의 모든 속성에는 [`@Input` 또는 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)과 같은 관련 Gradle 어노테이션이 있습니다.
* Kotlin Gradle 플러그인 API 아티팩트에는 두 개의 새로운 인터페이스가 있습니다.
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`: `compilerOptions` 입력 및 `compileOptions()` 메서드가 있습니다. 모든 Kotlin 컴파일 작업은 이 인터페이스를 구현합니다.
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`: `toolOptions` 입력 및 `toolOptions()` 메서드가 있습니다. 모든 Kotlin 도구 작업(`KotlinJsDce`, `KotlinNativeLink` 및 `KotlinNativeLinkArtifactTask`)은 이 인터페이스를 구현합니다.
* 일부 `compilerOptions`는 `String` 유형 대신 새로운 유형을 사용합니다.
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
      ( `apiVersion` 및 `languageVersion` 입력용)
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  예를 들어 `kotlinOptions.jvmTarget = "11"` 대신 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`을 사용할 수 있습니다.

  `kotlinOptions` 유형은 변경되지 않았으며 내부적으로 `compilerOptions` 유형으로 변환됩니다.
* Kotlin Gradle 플러그인 API는 이전 릴리스와 이진 호환됩니다. 그러나 `kotlin-gradle-plugin` 아티팩트에는 일부 소스 및 ABI 호환성이 깨지는 변경 사항이 있습니다. 이러한 변경 사항의 대부분은 일부 내부 유형에 대한 추가 일반 매개변수와 관련됩니다. 한 가지 중요한 변경 사항은 `KotlinNativeLink` 작업이 더 이상 `AbstractKotlinNativeCompile` 작업을 상속하지 않는다는 것입니다.
* `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션은 더 이상 사용되지 않습니다. 대신 `Kotlin2JsCompile.outputFileProperty` 작업 입력을 사용하세요.

:::note
Kotlin Gradle 플러그인은 여전히 Android 확장에 `KotlinJvmOptions` DSL을 추가합니다.

```kotlin
android { 
    kotlinOptions {
        jvmTarget = "11"
    }
}
```

이는 모듈 수준에 `compilerOptions` DSL이 추가될 때 [이 문제](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) 범위 내에서 변경될 것입니다.

:::

#### 제한 사항

:::note
`kotlinOptions` 작업 입력과 `kotlinOptions{...}` 작업 DSL은 지원 모드에 있으며 향후 릴리스에서 더 이상 사용되지 않습니다. 개선 사항은 `compilerOptions` 및 `toolOptions`에만 적용됩니다.

`kotlinOptions`에서 setter 또는 getter를 호출하면 `compilerOptions`의 관련 속성으로 위임됩니다.
이렇게 하면 다음과 같은 제한 사항이 발생합니다.
* `compilerOptions` 및 `kotlinOptions`는 작업 실행 단계에서 변경할 수 없습니다(아래 단락에서 한 가지 예외 참조).
* `freeCompilerArgs`는 변경할 수 없는 `List<String>`을 반환합니다. 즉, 예를 들어 `kotlinOptions.freeCompilerArgs.remove("something")`은 실패합니다.

[Jetpack Compose](https://developer.android.com/jetpack/compose)를 활성화한 `kotlin-dsl` 및 Android Gradle 플러그인(AGP)을 포함한 여러 플러그인이 작업 실행 단계에서 `freeCompilerArgs` 속성을 수정하려고 합니다. Kotlin 1.8.0에서 이에 대한 해결 방법을 추가했습니다. 이 해결 방법을 사용하면 모든 빌드 스크립트 또는 플러그인이 실행 단계에서 `kotlinOptions.freeCompilerArgs`를 수정할 수 있지만 빌드 로그에 경고가 표시됩니다. 이 경고를 비활성화하려면 새로운 Gradle 속성 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`를 사용하세요. Gradle은 [`kotlin-dsl` 플러그인](https://github.com/gradle/gradle/issues/22091) 및 [Jetpack Compose를 활성화한 AGP](https://issuetracker.google.com/u/1/issues/247544167)에 대한 수정 사항을 추가할 예정입니다.

### 최소 지원 버전 늘림

Kotlin 1.8.0부터 최소 지원 Gradle 버전은 6.8.3이고 최소 지원 Android Gradle 플러그인 버전은 4.1.3입니다.

[문서에서 사용 가능한 Gradle 버전과의 Kotlin Gradle 플러그인 호환성](gradle-configure-project#apply-the-plugin)을 참조하세요.

### Kotlin 데몬 폴백 전략을 비활성화하는 기능

기본값이 `true`인 새로운 Gradle 속성 `kotlin.daemon.useFallbackStrategy`가 있습니다. 값이 `false`이면 데몬의 시작 또는 통신에 문제가 있는 경우 빌드가 실패합니다. Kotlin 컴파일 작업에도 새로운 `useDaemonFallbackStrategy` 속성이 있으며, 둘 다 사용하는 경우 Gradle 속성보다 우선 순위가 높습니다. 컴파일을 실행할 메모리가 부족하면 로그에 메시지가 표시될 수 있습니다.

Kotlin 컴파일러의 폴백 전략은 데몬이 어떤 이유로든 실패하는 경우 Kotlin 데몬 외부에서 컴파일을 실행하는 것입니다. Gradle 데몬이 켜져 있으면 컴파일러는 "In process" 전략을 사용합니다. Gradle 데몬이 꺼져 있으면 컴파일러는 "Out of process" 전략을 사용합니다. 이러한 [실행 전략에 대해 자세히 알아보려면 설명서](gradle-compilation-and-caches#defining-kotlin-compiler-execution-strategy)를 참조하세요. 다른 전략으로 자동 폴백하면 많은 시스템 리소스를 소비하거나 비결정적 빌드로 이어질 수 있습니다. 자세한 내용은 이 [YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)를 참조하세요.

### 전이 종속성에서 최신 kotlin-stdlib 버전 사용

종속성에서 Kotlin 버전 1.8.0 이상을 명시적으로 작성하는 경우(예:
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`), Kotlin Gradle 플러그인은 전이 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8` 종속성에 대해 해당 Kotlin 버전을 사용합니다. 이는 서로 다른 stdlib 버전에서 클래스 중복을 방지하기 위해 수행됩니다([`kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8`을 `kotlin-stdlib`로 병합하는 방법에 대해 자세히 알아보세요](#updated-jvm-compilation-target)).
`kotlin.stdlib.jdk.variants.version.alignment` Gradle 속성을 사용하여 이 동작을 비활성화할 수 있습니다.

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

버전 정렬에 문제가 있는 경우 빌드 스크립트에서 `kotlin-bom`에 대한 플랫폼 종속성을 선언하여 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)을 통해 모든 버전을 정렬하세요.

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

다른 사례와 제안된 해결 방법은 [설명서](gradle-configure-project#other-ways-to-align-versions)에서 알아보세요.

### 관련 Kotlin 및 Java 컴파일 작업의 JVM 대상에 대한 의무적 검사

이 섹션은 소스 파일이 Kotlin에만 있고 Java를 사용하지 않더라도 JVM 프로젝트에 적용됩니다.

[이 릴리스부터](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8), Gradle 8.0+ 프로젝트에 대한 [`kotlin.jvm.target.validation.mode` 속성](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)의 기본값은 `error`이며(이 버전의 Gradle은 아직 릴리스되지 않음) JVM 대상 호환성이 없는 경우 플러그인이 빌드를 실패합니다.

기본값을 `warning`에서 `error`로 변경하는 것은 Gradle 8.0으로의 원활한 마이그레이션을 위한 준비 단계입니다.
**이 속성을 `error`로 설정**하고 [도구 모음을 구성하거나](gradle-configure-project#gradle-java-toolchains-support) JVM 버전을 수동으로 정렬하는 것이 좋습니다.

[대상의 호환성을 확인하지 않으면 발생할 수 있는 문제](gradle-configure-project#what-can-go-wrong-if-targets-are-incompatible)에 대해 자세히 알아보세요.

### Kotlin Gradle 플러그인의 전이 종속성 확인

Kotlin 1.7.0에서는 [Gradle 플러그인 변형에 대한 지원](whatsnew17#support-for-gradle-plugin-variants)을 도입했습니다.
이러한 플러그인 변형 때문에 빌드 클래스 경로에는 일부 종속성의 서로 다른 버전에 따라 달라지는 [Kotlin Gradle 플러그인](https://plugins.gradle.org/u/kotlin)의 서로 다른 버전이 있을 수 있습니다(일반적으로 `kotlin-gradle-plugin-api`). 이는 해결 문제로 이어질 수 있으며, `kotlin-dsl` 플러그인을 예로 들어 다음 해결 방법을 제