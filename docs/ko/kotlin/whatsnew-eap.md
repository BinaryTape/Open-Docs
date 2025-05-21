---
title: "Kotlin 2.1.20-RC3의 새로운 기능"
---
_[릴리스 날짜: 2025년 3월 14일](eap#build-details)_

:::note
이 문서는 얼리 액세스 미리 보기(Early Access Preview, EAP) 릴리스의 모든 기능을 다루지는 않지만, 몇 가지 주요 개선 사항을 중점적으로 설명합니다.

전체 변경 사항 목록은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20-RC3)를 참조하세요.

:::

Kotlin 2.1.20-RC3 릴리스가 출시되었습니다!
이번 EAP 릴리스에 대한 몇 가지 세부 정보는 다음과 같습니다.

* [](#kotlin-k2-compiler-new-default-kapt-plugin)
* [](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* [](#kotlin-native-new-inlining-optimization)
* [Kotlin/Wasm: 기본 사용자 정의 포맷터 및 Provider API로 마이그레이션](#kotlin-wasm)
* [Gradle: Gradle 8.11 지원, Isolated Projects와 호환성 및 사용자 정의 publication variants](#support-for-adding-custom-gradle-publication-variants)
* [표준 라이브러리: common atomic types, 향상된 UUID 지원 및 새로운 시간 추적 기능](#standard-library)
* [](#compose-compiler-source-information-included-by-default)

## IDE 지원

2.1.20-RC3을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.1.20-RC3으로 [변경](configure-build-for-eap)하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases#update-to-a-new-kotlin-version)를 참조하세요.

## Kotlin K2 compiler: 새로운 기본 kapt plugin

Kotlin 2.1.20-RC3부터 Kapt compiler plugin의 K2 구현이 모든 프로젝트에 대해 기본적으로 활성화됩니다.

JetBrains 팀은 Kotlin 1.9.20에서 K2 compiler를 사용하여 kapt plugin의 새로운 구현을 시작했습니다.
그 이후로 K2 kapt의 내부 구현을 추가로 개발하여 K1 버전과 유사하게 동작하도록 만들면서 성능도 크게 향상시켰습니다.

K2 compiler로 kapt를 사용할 때 문제가 발생하는 경우 이전 plugin 구현으로 일시적으로 되돌릴 수 있습니다.

이를 위해 프로젝트의 `gradle.properties` 파일에 다음 옵션을 추가하세요.

```kotlin
kapt.use.k2=false
```

문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)에 보고해 주세요.

## Kotlin Multiplatform: Gradle의 Application plugin을 대체하는 새로운 DSL

Gradle 8.7부터 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) plugin은 더 이상 Kotlin Multiplatform Gradle plugin과 호환되지 않습니다. Kotlin 2.1.20-RC3은 유사한 기능을 달성하기 위해 Experimental DSL을 도입했습니다. 새로운 `executable {}` 블록은 JVM targets에 대한 실행 작업 및 Gradle [distributions](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)을 구성합니다.

DSL을 사용하기 전에 빌드 스크립트에 다음을 추가하세요.

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

그런 다음 새 `executable {}` 블록을 추가합니다. 예:

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // "runJvm"이라는 JavaExec 작업과 이 target의 "main" 컴파일에 대한 Gradle 배포를 구성합니다.
            executable {
                mainClass.set("foo.MainKt")
            }

            // "runJvmAnother"라는 JavaExec 작업과 "main" 컴파일에 대한 Gradle 배포를 구성합니다.
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // 다른 클래스 설정
                mainClass.set("foo.MainAnotherKt")
            }

            // "runJvmTest"라는 JavaExec 작업과 "test" 컴파일에 대한 Gradle 배포를 구성합니다.
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // "runJvmTestAnother"라는 JavaExec 작업과 "test" 컴파일에 대한 Gradle 배포를 구성합니다.
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

이 예제에서 Gradle의 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) plugin은 첫 번째 `executable {}` 블록에 적용됩니다.

문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고하거나 [공개 Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)에 알려주세요.

## Kotlin/Native: 새로운 인라인 최적화

Kotlin 2.1.20-RC3은 실제 코드 생성 단계 이전에 수행되는 새로운 인라인 최적화 단계를 도입했습니다.

Kotlin/Native compiler의 새로운 인라인 단계는 표준 LLVM 인라이너보다 더 나은 성능을 제공하고 생성된 코드의 런타임 성능을 향상시켜야 합니다.

새로운 인라인 단계는 현재 [Experimental](components-stability#stability-levels-explained)입니다. 사용해 보려면 다음 compiler 옵션을 사용하세요.

```none
-Xbinary=preCodegenInlineThreshold=40
```

JetBrains의 실험에 따르면 40은 최적화에 적합한 절충 임계값입니다. JetBrains의 벤치마크에 따르면 이는 전체 성능이 9.5% 향상됩니다. 물론 다른 값도 시도해 볼 수 있습니다.

바이너리 크기 또는 컴파일 시간이 늘어나는 경우 [YouTrack](https://kotl.in/issue)에 해당 문제를 보고해 주세요.

## Kotlin/Wasm

### 기본적으로 활성화된 사용자 정의 포맷터

이전에는 Kotlin/Wasm 코드를 사용할 때 웹 브라우저에서 디버깅을 개선하기 위해 사용자 정의 포맷터를 [수동으로 구성](whatsnew21#improved-debugging-experience-for-kotlin-wasm)해야 했습니다.

이번 릴리스에서는 개발 빌드에서 사용자 정의 포맷터가 기본적으로 활성화되어 있으므로 추가 Gradle 구성이 필요하지 않습니다.

이 기능을 사용하려면 브라우저의 개발자 도구에서 사용자 정의 포맷터가 활성화되어 있는지 확인하기만 하면 됩니다.

* Chrome DevTools에서는 **설정 | 환경 설정 | 콘솔**을 통해 사용할 수 있습니다.

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Chrome에서 사용자 정의 포맷터 활성화" width="400" style={{verticalAlign: 'middle'}}/>

* Firefox DevTools에서는 **설정 | 고급 설정**을 통해 사용할 수 있습니다.

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Firefox에서 사용자 정의 포맷터 활성화" width="400" style={{verticalAlign: 'middle'}}/>

이 변경 사항은 주로 개발 빌드에 영향을 미칩니다. 프로덕션 빌드에 대한 특정 요구 사항이 있는 경우 Gradle 구성을 적절히 조정해야 합니다. `wasmJs {}` 블록에 다음 compiler 옵션을 추가하세요.

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

### Kotlin/Wasm 및 Kotlin/JS 속성에 대한 Provider API로 마이그레이션

이전에는 Kotlin/Wasm 및 Kotlin/JS 확장의 속성이 가변적(`var`)이었고 빌드 스크립트에서 직접 할당되었습니다.

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

이제 속성은 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html)를 통해 노출되며 값을 할당하려면 `.set()` 함수를 사용해야 합니다.

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API는 값이 지연 계산되고 작업 종속성과 적절하게 통합되어 빌드 성능을 향상시키도록 합니다.

이 변경으로 인해 직접 속성 할당은 `NodeJsEnvSpec` 및 `YarnRootEnvSpec`과 같은 `*EnvSpec` 클래스에 대해 더 이상 사용되지 않습니다.

또한 혼동을 피하기 위해 몇 가지 별칭 작업이 제거되었습니다.

| 더 이상 사용되지 않는 작업        | 대체                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` or `jsBrowserDistribution`         |

빌드 스크립트에서 Kotlin/JS 또는 Kotlin/Wasm만 사용하는 경우 Gradle이 할당을 자동으로 처리하므로 아무런 조치가 필요하지 않습니다.

그러나 Kotlin Gradle Plugin을 기반으로 하는 plugin을 유지 관리하고 plugin이 `kotlin-dsl`을 적용하지 않는 경우 `.set()` 함수를 사용하도록 속성 할당을 업데이트해야 합니다.

## Gradle

### 버전 8.11 지원
Kotlin %kotlinEapVersion%은 이제 최신 안정적인 Gradle 버전인 8.11과 호환되며 해당 기능을 지원합니다.

### Kotlin Gradle plugin은 Gradle의 Isolated Projects와 호환됩니다.

:::note
이 기능은 현재 Gradle에서 알파 이전 상태입니다.
평가 목적으로만 Gradle 버전 8.10 이상에서 사용하세요.

Kotlin 2.1.0부터 프로젝트에서 [Gradle의 Isolated Projects 기능 미리 보기](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)를 사용할 수 있습니다.

이전에는 Isolated Projects 기능과 호환되도록 프로젝트를 만들려면 Kotlin Gradle plugin을 구성해야 했습니다. Kotlin %kotlinEapVersion%에서는 이 추가 단계가 더 이상 필요하지 않습니다.

이제 Isolated Projects 기능을 활성화하려면 [시스템 속성을 설정](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)하기만 하면 됩니다.

Gradle의 Isolated Projects 기능은 멀티 플랫폼 프로젝트와 JVM 또는 Android target만 포함하는 프로젝트 모두에 대한 Kotlin Gradle plugin에서 지원됩니다.

특히 멀티 플랫폼 프로젝트의 경우 업그레이드 후 Gradle 빌드에 문제가 발생하면 다음을 설정하여 새로운 Kotlin Gradle plugin 동작을 옵트아웃할 수 있습니다.

```none
kotlin.kmp.isolated-projects.support=disable
```

그러나 멀티 플랫폼 프로젝트에서 이 Gradle 속성을 사용하는 경우 Isolated Projects 기능을 사용할 수 없습니다.

이 기능에 대한 의견을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에 보내주시면 감사하겠습니다.

### 사용자 정의 Gradle publication variants 지원

Kotlin %kotlinEapVersion%은 사용자 정의 [Gradle publication variants](https://docs.gradle.org/current/userguide/variant_attributes.html) 추가를 지원합니다.
이 기능은 멀티 플랫폼 프로젝트와 JVM을 대상으로 하는 프로젝트에서 사용할 수 있습니다.

이 기능을 사용하여 기존 Gradle variants를 수정할 수 없습니다.

:::

이 기능은 [Experimental](components-stability#stability-levels-explained)입니다.
옵트인하려면 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 주석을 사용하세요.

사용자 정의 Gradle publication variant를 추가하려면 `adhocSoftwareComponent()` 함수를 호출합니다. 이 함수는 Kotlin DSL에서 구성할 수 있는 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html)의 인스턴스를 반환합니다.

```kotlin
plugins {
    // JVM 및 Multiplatform만 지원됩니다.
    kotlin("jvm")
    // 또는
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // AdhocSoftwareComponent의 인스턴스를 반환합니다.
        adhocSoftwareComponent()
        // 또는 다음과 같이 DSL 블록에서 AdhocSoftwareComponent를 구성할 수 있습니다.
        adhocSoftwareComponent {
            // AdhocSoftwareComponent API를 사용하여 사용자 정의 variants를 여기에 추가합니다.
        }
    }
}
```

:::tip
variants에 대한 자세한 내용은 Gradle의 [게시 사용자 지정 가이드](https://docs.gradle.org/current/userguide/publishing_customization.html)를 참조하세요.

:::

## 표준 라이브러리

### Common atomic types

Kotlin %kotlinEapVersion%에서는 표준 라이브러리의 `kotlin.concurrent.atomics` 패키지에 common atomic types를 도입하여 스레드로부터 안전한 작업을 위한 공유된 플랫폼 독립적 코드를 사용할 수 있습니다. 이를 통해 소스 세트에서 atomic 종속 로직을 복제할 필요가 없어 Kotlin Multiplatform 프로젝트 개발이 간소화됩니다.

`kotlin.concurrent.atomics` 패키지 및 해당 속성은 [Experimental](components-stability#stability-levels-explained)입니다.
옵트인하려면 `@OptIn(ExperimentalAtomicApi::class)` 주석 또는 컴파일러 옵션 `-opt-in=kotlin.ExperimentalAtomicApi`를 사용하세요.

다음은 `AtomicInt`를 사용하여 여러 스레드에서 처리된 항목을 안전하게 계산하는 방법을 보여주는 예입니다.

```kotlin
// 필요한 라이브러리 가져오기
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 처리된 항목에 대한 atomic counter 초기화
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 여러 코루틴에서 처리할 수 있도록 항목을 청크로 분할
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("스레드 ${Thread.currentThread()}에서 $item 처리 중")
                    processedItems += 1 // counter를 atomic하게 증가
                }
            }
         }
    }

    // 처리된 총 항목 수 출력
    println("총 처리된 항목 수: ${processedItems.load()}")
}
```

Kotlin의 atomic types와 Java의 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) atomic types 간의 원활한 상호 운용성을 지원하기 위해 API는 `.asJavaAtomic()` 및 `.asKotlinAtomic()` 확장 함수를 제공합니다. JVM에서 Kotlin atomics와 Java atomics는 런타임에 동일한 유형이므로 오버헤드 없이 Java atomics를 Kotlin atomics로 변환하고 그 반대로 변환할 수 있습니다.

다음은 Kotlin 및 Java atomic types가 함께 작동하는 방법을 보여주는 예입니다.

```kotlin
// 필요한 라이브러리 가져오기
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Kotlin AtomicInt를 Java의 AtomicInteger로 변환
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic 값: ${javaAtomic.get()}")
    // Java atomic 값: 42

    // Java의 AtomicInteger를 다시 Kotlin의 AtomicInt로 변환
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic 값: ${kotlinAgain.load()}")
    // Kotlin atomic 값: 42
}
```

### UUID 구문 분석, 서식 지정 및 비교 가능성 변경 사항

JetBrains 팀은 [2.0.20에서 표준 라이브러리에 도입된 UUID에 대한 지원](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library)을 계속 개선하고 있습니다.

이전에는 `parse()` 함수가 16진수-대시 형식의 UUID만 허용했습니다. Kotlin %kotlinEapVersion%에서는 16진수-대시 형식과 일반 16진수 형식(대시 없음) 모두에 대해 `parse()`를 사용할 수 있습니다.

또한 이번 릴리스에서는 16진수-대시 형식으로 작업하기 위한 특정 함수가 도입되었습니다.

* `parseHexDash()`는 16진수-대시 형식에서 UUID를 구문 분석합니다.
* `toHexDashString()`은 `Uuid`를 16진수-대시 형식의 `String`으로 변환합니다(`toString()`의 기능을 미러링).

이러한 함수는 이전에 16진수 형식에 대해 도입된 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 및 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)와 유사하게 작동합니다. 구문 분석 및 서식 지정 기능에 대한 명시적 이름 지정은 코드 명확성과 UUID 사용 경험을 전반적으로 개선해야 합니다.

Kotlin의 UUID는 이제 `Comparable`입니다. Kotlin %kotlinEapVersion%부터 `Uuid` 유형의 값을 직접 비교하고 정렬할 수 있습니다. 이를 통해 `<` 및 `>` 연산자, `Comparable` 유형 또는 해당 컬렉션(예: `sorted()`)에만 사용할 수 있는 표준 라이브러리 확장을 사용할 수 있으며 `Comparable` 인터페이스가 필요한 모든 함수 또는 API에 UUID를 전달할 수 있습니다.

표준 라이브러리의 UUID 지원은 아직 [Experimental](components-stability#stability-levels-explained)입니다.
옵트인하려면 `@OptIn(ExperimentalUuidApi::class)` 주석 또는 컴파일러 옵션 `-opt-in=kotlin.uuid.ExperimentalUuidApi`를 사용하세요.

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse()는 일반 16진수 형식으로 UUID를 허용합니다.
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 16진수-대시 형식으로 변환합니다.
    val hexDashFormat = uuid.toHexDashString()

    // 16진수-대시 형식으로 UUID를 출력합니다.
    println(hexDashFormat)

    // UUID를 오름차순으로 출력합니다.
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
}
```

### 새로운 시간 추적 기능

Kotlin %kotlinEapVersion%부터 표준 라이브러리는 특정 시점을 나타내는 기능을 제공합니다.
이 기능은 이전에는 공식 Kotlin 라이브러리인 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)에서만 사용할 수 있었습니다.

[kotlinx.datetime.Clock](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 인터페이스가 표준 라이브러리에 `kotlin.time.Clock`으로 도입되고 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) 클래스가 `kotlin.time.Instant`로 도입됩니다. 이러한 개념은 `kotlinx-datetime`에 남아 있는 더 복잡한 달력 및 시간대 기능과 비교하여 시간대에 구애받지 않고 특정 시점에만 관심이 있으므로 표준 라이브러리의 `time` 패키지와 자연스럽게 일치합니다.

`Instant` 및 `Clock`은 시간대 또는 날짜를 고려하지 않고 정확한 시간 추적이 필요한 경우에 유용합니다.
예를 들어 타임스탬프가 있는 이벤트를 기록하고, 두 시점 사이의 기간을 측정하고, 시스템 프로세스에 대한 현재 시점을 얻는 데 사용할 수 있습니다.

다른 언어와의 상호 운용성을 제공하기 위해 추가 변환기 함수를 사용할 수 있습니다.

* `.toKotlinInstant()`는 시간 값을 `kotlin.time.Instant` 인스턴스로 변환합니다.
* `.toJavaInstant()`는 `kotlin.time.Instant` 값을 `java.time.Instant` 값으로 변환합니다.
* `Instant.toJSDate()`는 `kotlin.time.Instant` 값을 JS `Date` 클래스의 인스턴스로 변환합니다. 이 변환은 정확하지 않으며 JS는 밀리초 정밀도를 사용하여 날짜를 나타내는 반면 Kotlin은 나노초 해상도를 허용합니다.

표준 라이브러리의 새로운 시간 기능은 아직 [Experimental](components-stability#stability-levels-explained)입니다.
옵트인하려면 `@OptIn(ExperimentalTime::class)` 주석을 사용하세요.

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 현재 시점 가져오기
    val currentInstant = Clock.System.now()
    println("현재 시간: $currentInstant")

    // 두 시점 간의 차이 찾기
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("2023-01-01 이후 경과 시간: $duration")
}
```

구현에 대한 자세한 내용은 이 [KEEP 제안](https://github.com/Kotlin/KEEP/pull/387/files)을 참조하세요.

## Compose compiler: 기본적으로 포함된 소스 정보

Compose compiler Gradle plugin은 모든 플랫폼에서 기본적으로 [소스 정보 포함](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)을 활성화합니다. `includeSourceInformation` 옵션은 이미 Android에 대해 활성화되었으며 이 변경 사항은 플랫폼 간에 plugin 동작을 정렬하고 새로운 런타임 기능에 대한 지원을 허용합니다.

`freeCompilerArgs`를 사용하여 이 옵션을 설정했는지 확인하세요. plugin과 함께 사용하면 옵션이 두 번 설정되어 빌드가 실패할 수 있습니다.

## 주요 변경 사항 및 더 이상 사용되지 않는 사항

Kotlin Multiplatform을 Gradle의 향후 변경 사항에 맞추기 위해 `withJava()` 함수를 단계적으로 폐지하고 있습니다.
[이제 Java 소스 세트가 기본적으로 생성됩니다](multiplatform-compatibility-guide#java-source-sets-created-by-default).

## Kotlin %kotlinEapVersion%으로 업데이트하는 방법

IntelliJ IDEA 2023.3 및 Android Studio Iguana(2023.2.1) Canary 15부터 Kotlin plugin은 IDE에 포함된 번들 plugin으로 배포됩니다. 즉, 더 이상 JetBrains Marketplace에서 plugin을 설치할 수 없습니다. 번들 plugin은 향후 Kotlin EAP 릴리스를 지원합니다.

새로운 Kotlin EAP 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 %kotlinEapVersion%으로 변경](configure-build-for-eap#adjust-the-kotlin-version)하세요.