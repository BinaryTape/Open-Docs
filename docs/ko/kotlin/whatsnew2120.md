[//]: # (title: Kotlin 2.1.20의 새로운 기능)

_[릴리스: 2025년 3월 20일](releases.md#release-details)_

Kotlin 2.1.20 릴리스가 출시되었습니다! 주요 특징은 다음과 같습니다.

*   **K2 컴파일러 업데이트**: [새로운 kapt 및 Lombok 플러그인 업데이트](#kotlin-k2-compiler)
*   **Kotlin 멀티플랫폼**: [Gradle의 Application 플러그인을 대체하는 새로운 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
*   **Kotlin/Native**: [Xcode 16.3 지원 및 새로운 인라이닝 최적화](#kotlin-native)
*   **Kotlin/Wasm**: [기본 사용자 정의 포맷터, DWARF 지원 및 Provider API로 마이그레이션](#kotlin-wasm)
*   **Gradle 지원**: [Gradle의 격리된 프로젝트 및 사용자 정의 배포 변형과의 호환성](#gradle)
*   **표준 라이브러리**: [공통 원자성 타입, 개선된 UUID 지원 및 새로운 시간 추적 기능](#standard-library)
*   **Compose 컴파일러**: [`@Composable` 함수에 대한 제약 완화 및 기타 업데이트](#compose-compiler)
*   **문서**: [Kotlin 문서의 주목할 만한 개선 사항](#documentation-updates).

## IDE 지원

2.1.20을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.1.20으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

### OSGi를 지원하는 프로젝트에서 Kotlin 아티팩트 소스 다운로드

`kotlin-osgi-bundle` 라이브러리의 모든 종속성 소스가 이제 배포판에 포함됩니다. 이를 통해
IntelliJ IDEA는 이러한 소스를 다운로드하여 Kotlin 심볼에 대한 문서를 제공하고 디버깅 경험을 개선할 수 있습니다.

## Kotlin K2 컴파일러

새로운 Kotlin K2 컴파일러에 대한 플러그인 지원을 지속적으로 개선하고 있습니다. 이번 릴리스에는 새로운 kapt
및 Lombok 플러그인에 대한 업데이트가 포함되어 있습니다.

### 새로운 기본 kapt 플러그인
<primary-label ref="beta"/>

Kotlin 2.1.20부터 kapt 컴파일러 플러그인의 K2 구현이 모든 프로젝트에 대해 기본적으로 활성화됩니다.

JetBrains 팀은 Kotlin 1.9.20에서 K2 컴파일러와 함께 kapt 플러그인의 새로운 구현을 출시했습니다.
그 이후로 K2 kapt의 내부 구현을 더욱 발전시켜 K1 버전과 유사한 동작을 제공하면서도
성능을 크게 향상시켰습니다.

K2 컴파일러와 함께 kapt를 사용할 때 문제가 발생하면
이전 플러그인 구현으로 일시적으로 되돌릴 수 있습니다.

이렇게 하려면 프로젝트의 `gradle.properties` 파일에 다음 옵션을 추가하세요.

```kotlin
kapt.use.k2=false
```

문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)에 보고해 주십시오.

### Lombok 컴파일러 플러그인: `@SuperBuilder` 지원 및 `@Builder` 업데이트
<primary-label ref="experimental-general"/>

[Kotlin Lombok 컴파일러 플러그인](lombok.md)은 이제 `@SuperBuilder` 어노테이션을 지원하여
클래스 계층에 대한 빌더 생성을 더 쉽게 만듭니다. 이전에는 Kotlin에서 Lombok을 사용하는 개발자는
상속과 함께 작업할 때 빌더를 수동으로 정의해야 했습니다. `@SuperBuilder`를 사용하면 빌더가 슈퍼클래스 필드를 자동으로 상속하여
객체를 구성할 때 해당 필드를 초기화할 수 있습니다.

또한 이번 업데이트에는 몇 가지 개선 사항 및 버그 수정이 포함되어 있습니다.

*   이제 `@Builder` 어노테이션이 생성자에서 작동하여 더욱 유연한 객체 생성을 가능하게 합니다. 자세한 내용은
    해당 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-71547)를 참조하십시오.
*   Kotlin에서 Lombok의 코드 생성과 관련된 몇 가지 문제가 해결되어 전반적인 호환성이 향상되었습니다.
    자세한 내용은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)를 참조하십시오.

`@SuperBuilder` 어노테이션에 대한 자세한 내용은 공식 [Lombok 문서](https://projectlombok.org/features/experimental/SuperBuilder)를 참조하십시오.

## Kotlin 멀티플랫폼: Gradle의 Application 플러그인을 대체하는 새로운 DSL
<primary-label ref="experimental-opt-in"/>

Gradle 8.7부터 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 플러그인은
Kotlin 멀티플랫폼 Gradle 플러그인과 더 이상 호환되지 않습니다. Kotlin 2.1.20은 유사한 기능을
구현하기 위한 Experimental DSL을 도입합니다. 새로운 `executable {}` 블록은 JVM 타겟을 위한 실행 작업과 Gradle
[배포(distributions)](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)를 구성합니다.

빌드 스크립트의 `executable {}` 블록 앞에 다음 `@OptIn` 어노테이션을 추가하세요.

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

예시:

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // Configures a JavaExec task named "runJvm" and a Gradle distribution for the "main" compilation in this target
            executable {
                mainClass.set("foo.MainKt")
            }

            // Configures a JavaExec task named "runJvmAnother" and a Gradle distribution for the "main" compilation
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // Set a different class
                mainClass.set("foo.MainAnotherKt")
            }

            // Configures a JavaExec task named "runJvmTest" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // Configures a JavaExec task named "runJvmTestAnother" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

이 예시에서는 Gradle의 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
플러그인이 첫 번째 `executable {}` 블록에 적용됩니다.

문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고하거나 [공개 Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)을 통해 알려주십시오.

## Kotlin/Native

### Xcode 16.3 지원

Kotlin **2.1.21**부터 Kotlin/Native 컴파일러는 Xcode 16.3(Xcode의 최신 안정 버전)을 지원합니다.
Xcode를 업데이트하고 Apple 운영 체제용 Kotlin 프로젝트를 계속 작업하십시오.

2.1.21 릴리스는 또한 Kotlin 멀티플랫폼 프로젝트에서 컴파일 실패를 야기했던 관련 [cinterop 이슈](https://youtrack.jetbrains.com/issue/KT-75781/)를 수정합니다.

### 새로운 인라이닝 최적화
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20은 실제 코드 생성 단계 이전에 발생하는 새로운 인라이닝 최적화 패스를 도입합니다.

Kotlin/Native 컴파일러의 새로운 인라이닝 패스는 표준 LLVM 인라이너보다 더 나은 성능을 보여야 하며
생성된 코드의 런타임 성능을 향상시켜야 합니다.

새로운 인라이닝 패스는 현재 [Experimental](components-stability.md#stability-levels-explained) 상태입니다. 시험 사용하려면 다음
컴파일러 옵션을 사용하십시오.

```none
-Xbinary=preCodegenInlineThreshold=40
```

저희 실험에 따르면 임계값을 40 토큰(컴파일러가 파싱하는 코드 단위)으로 설정하면 컴파일 최적화에 합리적인
절충점을 제공합니다. 저희 벤치마크에 따르면, 이는 전반적인 성능 향상 9.5%를 제공합니다. 물론 다른 값도 시도해 볼 수 있습니다.

바이너리 크기 또는 컴파일 시간이 증가하는 현상이 발생하면 [YouTrack](https://kotl.in/issue)을 통해 보고해 주십시오.

## Kotlin/Wasm

이번 릴리스는 Kotlin/Wasm 디버깅 및 속성 사용을 개선합니다. 사용자 정의 포맷터는 이제 개발 빌드에서 바로 작동하며,
DWARF 디버깅은 코드 검사를 용이하게 합니다. 또한 Provider API는 Kotlin/Wasm 및 Kotlin/JS에서 속성 사용을
간소화합니다.

### 사용자 정의 포맷터 기본 활성화

이전에는 Kotlin/Wasm 코드를 작업할 때 웹 브라우저에서 디버깅을 개선하려면 사용자 정의 포맷터를
[수동으로 구성](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm)해야 했습니다.

이번 릴리스에서는 사용자 정의 포맷터가 개발 빌드에서 기본적으로 활성화되므로 추가 Gradle
구성이 필요하지 않습니다.

이 기능을 사용하려면 브라우저 개발자 도구에서 사용자 정의 포맷터가 활성화되어 있는지 확인하기만 하면 됩니다.

*   Chrome DevTools에서 **Settings | Preferences | Console**에서 사용자 정의 포맷터 체크박스를 찾습니다.

    ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

*   Firefox DevTools에서 **Settings | Advanced settings**에서 사용자 정의 포맷터 체크박스를 찾습니다.

    ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

이 변경 사항은 주로 Kotlin/Wasm 개발 빌드에 영향을 미칩니다. 프로덕션 빌드에 대한 특정 요구 사항이 있는 경우,
그에 따라 Gradle 구성을 조정해야 합니다. 이를 위해 `wasmJs {}` 블록에 다음 컴파일러 옵션을 추가하십시오.

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

### Kotlin/Wasm 코드 디버깅을 위한 DWARF 지원

Kotlin 2.1.20은 Kotlin/Wasm에서 DWARF(debugging with arbitrary record format) 지원을 도입합니다.

이 변경 사항으로 인해 Kotlin/Wasm 컴파일러는 생성된 WebAssembly (Wasm) 바이너리에 DWARF 데이터를
임베드할 수 있습니다. 많은 디버거와 가상 머신이 이 데이터를 읽어 컴파일된 코드에 대한 통찰력을 제공할 수 있습니다.

DWARF는 주로 독립형 Wasm 가상 머신(VM) 내부에서 Kotlin/Wasm 애플리케이션을 디버깅하는 데 유용합니다. 이 기능을
사용하려면 Wasm VM 및 디버거가 DWARF를 지원해야 합니다.

DWARF 지원을 통해 Kotlin/Wasm 애플리케이션을 단계별로 실행하고 변수를 검사하며 코드 통찰력을 얻을 수 있습니다. 이 기능을
활성화하려면 다음 컴파일러 옵션을 사용하십시오.

```bash
-Xwasm-generate-dwarf
```
### Kotlin/Wasm 및 Kotlin/JS 속성을 위한 Provider API로 마이그레이션

이전에는 Kotlin/Wasm 및 Kotlin/JS 확장 속성이 가변(`var`)이었고 빌드 스크립트에서 직접 할당되었습니다.

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

이제 속성은 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html)를 통해 노출되며,
값을 할당하려면 `.set()` 함수를 사용해야 합니다.

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API는 값이 지연 계산되고 작업 종속성과 올바르게 통합되어 빌드
성능을 향상시킵니다.

이 변경 사항으로 인해 직접 속성 할당은 `NodeJsEnvSpec` 및 `YarnRootEnvSpec`과 같은
`*EnvSpec` 클래스 대신 사용하지 않도록 권장됩니다.

또한 혼동을 피하기 위해 여러 별칭(alias) 작업이 제거되었습니다.

| 더 이상 사용되지 않는 작업 | 대체                                                            |
|--------------------|-----------------------------------------------------------------|
| `wasmJsRun`        | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun` | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`    | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 또는 `wasmJsBrowserDistribution` |
| `jsRun`            | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`     | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`        | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack` | `jsBrowserProductionWebpack` 또는 `jsBrowserDistribution`         |

빌드 스크립트에서 Kotlin/JS 또는 Kotlin/Wasm만 사용하는 경우 Gradle이 할당을 자동으로 처리하므로 별다른 조치가 필요하지 않습니다.

그러나 Kotlin Gradle 플러그인을 기반으로 하는 플러그인을 유지 관리하고 플러그인이 `kotlin-dsl`을 적용하지 않는 경우,
`.set()` 함수를 사용하도록 속성 할당을 업데이트해야 합니다.

## Gradle

Kotlin 2.1.20은 Gradle 7.6.3부터 8.11까지 완벽하게 호환됩니다. 최신 Gradle
릴리스까지 Gradle 버전을 사용할 수도 있습니다. 그러나 이 경우 사용 중단 경고가 발생할 수 있으며 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

이 Kotlin 버전에는 Kotlin Gradle 플러그인과 Gradle의 격리된 프로젝트(Isolated Projects)와의 호환성뿐만 아니라
사용자 정의 Gradle 배포 변형에 대한 지원이 포함됩니다.

### Gradle의 격리된 프로젝트와 호환되는 Kotlin Gradle 플러그인
<primary-label ref="experimental-opt-in"/>

> 이 기능은 현재 Gradle에서 사전-알파(pre-Alpha) 상태입니다. JS 및 Wasm 타겟은 현재 지원되지 않습니다.
> Gradle 버전 8.10 이상에서만 평가 목적으로만 사용하십시오.
>
{style="warning"}

Kotlin 2.1.0부터 프로젝트에서 [Gradle의 격리된 프로젝트 기능을 미리 볼 수](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform) 있었습니다.

이전에는 격리된 프로젝트 기능과 프로젝트를 호환시키기 위해 Kotlin Gradle 플러그인을 구성해야 했습니다.
Kotlin 2.1.20에서는 이 추가 단계가 더 이상 필요하지 않습니다.

이제 격리된 프로젝트 기능을 활성화하려면 [시스템 속성을 설정](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)하기만 하면 됩니다.

Gradle의 격리된 프로젝트 기능은 멀티플랫폼 프로젝트와 JVM 또는 Android 타겟만 포함하는 프로젝트 모두에서 Kotlin Gradle 플러그인에서 지원됩니다.

특히 멀티플랫폼 프로젝트의 경우, 업그레이드 후 Gradle 빌드에 문제가 발생하는 경우 다음을 추가하여
새로운 Kotlin Gradle 플러그인 동작을 선택 해제할 수 있습니다.

```none
kotlin.kmp.isolated-projects.support=disable
```

그러나 멀티플랫폼 프로젝트에서 이 Gradle 속성을 사용하면 격리된 프로젝트 기능을 사용할 수 없습니다.

이 기능에 대한 경험을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에 알려주십시오.

### 사용자 정의 Gradle 배포 변형 추가 지원
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20은 사용자 정의 [Gradle 배포 변형](https://docs.gradle.org/current/userguide/variant_attributes.html) 추가 지원을 도입합니다.
이 기능은 멀티플랫폼 프로젝트 및 JVM을 타겟팅하는 프로젝트에서 사용할 수 있습니다.

> 이 기능을 사용하여 기존 Gradle 변형을 수정할 수는 없습니다.
>
{style="note"}

이 기능은 [Experimental](components-stability.md#stability-levels-explained) 상태입니다.
선택하려면 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 어노테이션을 사용하십시오.

사용자 정의 Gradle 배포 변형을 추가하려면 `adhocSoftwareComponent()` 함수를 호출하십시오. 이 함수는
Kotlin DSL에서 구성할 수 있는 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html)
인스턴스를 반환합니다.

```kotlin
plugins {
    // Only JVM and Multiplatform are supported
    kotlin("jvm")
    // or
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // Returns an instance of AdhocSoftwareComponent
        adhocSoftwareComponent()
        // Alternatively, you can configure AdhocSoftwareComponent in the DSL block as follows
        adhocSoftwareComponent {
            // Add your custom variants here using the AdhocSoftwareComponent API
        }
    }
}
```

> 변형에 대한 자세한 내용은 Gradle의 [배포 사용자 정의 가이드](https://docs.gradle.org/current/userguide/publishing_customization.html)를 참조하십시오.
>
{style="tip"}

## 표준 라이브러리

이번 릴리스에서는 표준 라이브러리에 새로운 Experimental 기능이 추가되었습니다. 공통 원자성 타입, 개선된 UUID 지원,
및 새로운 시간 추적 기능입니다.

### 공통 원자성 타입
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20에서는 표준 라이브러리의 `kotlin.concurrent.atomics`
패키지에 공통 원자성 타입을 도입하여 스레드 안전 작업을 위한 공유 가능한 플랫폼 독립적인 코드를 가능하게 합니다. 이는
소스 세트 전반에 걸쳐 원자성 의존 로직을 중복할 필요를 제거함으로써 Kotlin 멀티플랫폼 프로젝트 개발을 간소화합니다.

`kotlin.concurrent.atomics` 패키지 및 해당 속성은 [Experimental](components-stability.md#stability-levels-explained) 상태입니다.
선택하려면 `@OptIn(ExperimentalAtomicApi::class)` 어노테이션 또는 컴파일러 옵션 `-opt-in=kotlin.ExperimentalAtomicApi`를 사용하십시오.

다음은 `AtomicInt`를 사용하여 여러 스레드에서 처리된 항목을 안전하게 계산하는 방법을 보여주는 예시입니다.

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // Initializes the atomic counter for processed items
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // Splits the items into chunks for processing by multiple coroutines
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // Increment counter atomically
                }
            }
         }
    }
//sampleEnd
    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

Kotlin의 원자성 타입과 Java의 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
원자성 타입 간의 원활한 상호 운용성을 가능하게 하기 위해 API는 `.asJavaAtomic()` 및 `.asKotlinAtomic()` 확장 함수를 제공합니다. JVM에서 Kotlin
원자성과 Java 원자성은 런타임에 동일한 타입이므로 오버헤드 없이 Java 원자성을 Kotlin 원자성으로 변환하고
그 반대로 변환할 수 있습니다.

다음은 Kotlin 및 Java 원자성 타입이 함께 작동하는 방식을 보여주는 예시입니다.

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Converts Kotlin's AtomicInt to Java's AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // Converts Java's AtomicInteger back to Kotlin's AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 파싱, 포맷팅 및 비교 가능성 변경
<primary-label ref="experimental-opt-in"/>

JetBrains 팀은 [2.0.20에서 표준 라이브러리에 도입된](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) UUID 지원을
계속해서 개선하고 있습니다.

이전에는 `parse()` 함수가 하이픈으로 구분된 헥사(hex-and-dash) 형식의 UUID만 허용했습니다. Kotlin 2.1.20부터는
하이픈으로 구분된 헥사 형식과 일반 헥사(하이픈 없음) 형식 _모두_에 대해 `parse()`를 사용할 수 있습니다.

이번 릴리스에서는 하이픈으로 구분된 헥사 형식과의 작업에 특정한 함수도 도입했습니다.

*   `parseHexDash()`는 하이픈으로 구분된 헥사 형식에서 UUID를 파싱합니다.
*   `toHexDashString()`은 `Uuid`를 하이픈으로 구분된 헥사 형식의 `String`으로 변환합니다 (`toString()`의 기능 미러링).

이러한 함수는 이전에 헥사 형식으로 도입된 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
및 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)와 유사하게 작동합니다. 파싱 및 포맷팅 기능에 대한 명시적인 이름 지정은 코드 명확성과 UUID 사용 경험을 향상시켜야 합니다.

Kotlin의 UUID는 이제 `Comparable`입니다. Kotlin 2.1.20부터는 `Uuid`
타입의 값을 직접 비교하고 정렬할 수 있습니다. 이를 통해 `<` 및 `>` 연산자와 `Comparable` 타입 또는 해당 컬렉션(예: `sorted()`)에만 제공되는
표준 라이브러리 확장을 사용할 수 있으며, `Comparable` 인터페이스를 요구하는 모든 함수 또는 API에 UUID를 전달할 수도 있습니다.

표준 라이브러리의 UUID 지원은 여전히 [Experimental](components-stability.md#stability-levels-explained) 상태임을 기억하십시오.
선택하려면 `@OptIn(ExperimentalUuidApi::class)` 어노테이션 또는 컴파일러 옵션 `-opt-in=kotlin.uuid.ExperimentalUuidApi`를 사용하십시오.

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() accepts a UUID in a plain hexadecimal format
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // Converts it to the hex-and-dash format
    val hexDashFormat = uuid.toHexDashString()
 
    // Outputs the UUID in the hex-and-dash format
    println(hexDashFormat)

    // Outputs UUIDs in ascending order
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
   }
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### 새로운 시간 추적 기능
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20부터 표준 라이브러리는 특정 순간을 나타내는 기능을 제공합니다. 이 기능은
이전에는 공식 Kotlin 라이브러리인 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)에서만 사용할 수 있었습니다.

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-clock/) 인터페이스는
표준 라이브러리에 `kotlin.time.Clock`으로 도입되었고, [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-instant/)
클래스는 `kotlin.time.Instant`으로 도입되었습니다. 이 개념들은 표준 라이브러리의 `time` 패키지와 자연스럽게 일치합니다.
왜냐하면 `kotlinx-datetime`에 남아 있는 더 복잡한 달력 및 시간대 기능과 달리 시간의 특정 순간에만 관심이 있기 때문입니다.

`Instant`와 `Clock`은 시간대나 날짜를 고려하지 않고 정확한 시간 추적이 필요할 때 유용합니다. 예를 들어,
타임스탬프와 함께 이벤트를 기록하고, 두 시점 사이의 지속 시간을 측정하고, 시스템 프로세스의 현재 순간을 얻는 데 사용할 수 있습니다.

다른 언어와의 상호 운용성을 제공하기 위해 추가 변환 함수를 사용할 수 있습니다.

*   [`.toKotlinInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-kotlin-instant.html)는 시간 값을 `kotlin.time.Instant` 인스턴스로 변환합니다.
*   [`.toJavaInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-java-instant.html)는 `kotlin.time.Instant` 값을 `java.time.Instant` 값으로 변환합니다.
*   [`Instant.toJSDate()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-j-s-date.html)는 `kotlin.time.Instant` 값을 JS `Date` 클래스의 인스턴스로 변환합니다. 이 변환은
    정확하지 않습니다. JS는 날짜를 밀리초 정밀도로 나타내는 반면, Kotlin은 나노초 해상도를 허용합니다.

표준 라이브러리의 새로운 시간 기능은 여전히 [Experimental](components-stability.md#stability-levels-explained) 상태입니다.
선택하려면 `@OptIn(ExperimentalTime::class)` 어노테이션을 사용하십시오.

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // Get the current moment in time
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // Find the difference between two moments in time
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

구현에 대한 자세한 내용은 [이 KEEP 제안](https://github.com/Kotlin/KEEP/pull/387/files)을 참조하십시오.

## Compose 컴파일러

2.1.20에서 Compose 컴파일러는 이전 릴리스에서 도입된 `@Composable` 함수에 대한 일부 제약을 완화합니다.
또한 Compose 컴파일러 Gradle 플러그인은 기본적으로 소스 정보를 포함하도록 설정되어 Android를 비롯한 모든 플랫폼에서 동작을 일치시킵니다.

### open `@Composable` 함수에서 기본값을 가진 매개변수 지원

컴파일러는 이전 릴리스에서 잘못된 컴파일러 출력으로 인해 런타임에 충돌을 일으킬 수 있는 open `@Composable` 함수의 기본값을 가진 매개변수를 제한했습니다.
기본 문제는 이제 해결되었으며, Kotlin 2.1.20 이상 버전과 함께 사용할 경우 기본값을 가진 매개변수가 완전히 지원됩니다.

Compose 컴파일러는 [버전 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) 이전에는 open 함수에서 기본값을 가진 매개변수를 허용했으므로,
지원 여부는 프로젝트 구성에 따라 달라집니다.

*   open 컴포저블 함수가 Kotlin 버전 2.1.20 이상으로 컴파일되면 컴파일러는 기본값을 가진 매개변수에 대해 올바른 래퍼를 생성합니다.
    여기에는 1.5.8 이전 바이너리와 호환되는 래퍼가 포함되므로 다운스트림 라이브러리도 이 open 함수를 사용할 수 있습니다.
*   open 컴포저블 함수가 Kotlin 2.1.20 이전 버전으로 컴파일되면 Compose는 호환성 모드를 사용하며, 이는
    런타임 충돌을 초래할 수 있습니다. 호환성 모드를 사용할 때 컴파일러는 잠재적인 문제를 강조하기 위해 경고를 발생시킵니다.

### 최종 오버라이드 함수는 다시 시작 가능하도록 허용

가상 함수(`open` 및 `abstract`의 오버라이드, 인터페이스 포함)는 [2.1.0 릴리스에서 다시 시작 불가능하도록 강제](whatsnew21.md#changes-to-open-and-overridden-composable-functions)되었습니다.
이러한 제약은 이제 최종 클래스의 멤버이거나 자체가 `final`인 함수에 대해 완화되었습니다. 이들은
평소와 같이 다시 시작되거나 건너뛰게 됩니다.

Kotlin 2.1.20으로 업그레이드한 후 영향을 받는 함수에서 일부 동작 변경이 관찰될 수 있습니다. 이전 버전의 다시 시작 불가능 로직을 강제하려면,
함수에 `@NonRestartableComposable` 어노테이션을 적용하십시오.

### `ComposableSingletons`가 공개 API에서 제거됨

`ComposableSingletons`는 `@Composable` 람다를 최적화할 때 Compose 컴파일러에 의해 생성되는 클래스입니다.
매개변수를 캡처하지 않는 람다는 한 번 할당되어 클래스의 속성에 캐시되어 런타임 동안 할당을 절약합니다.
이 클래스는 내부 가시성으로 생성되며 컴파일 단위(일반적으로 파일) 내의 람다를 최적화하는 데만 사용됩니다.

그러나 이 최적화는 `inline` 함수 본문에도 적용되어 싱글턴 람다 인스턴스가
공개 API로 유출되는 결과를 초래했습니다. 이 문제를 해결하기 위해 2.1.20부터는 `@Composable` 람다가 더 이상 인라인 함수 내부에서
싱글턴으로 최적화되지 않습니다. 동시에 Compose 컴파일러는 이전 모델에서 컴파일된 모듈의 바이너리 호환성을 지원하기 위해
인라인 함수에 대한 싱글턴 클래스 및 람다를 계속 생성합니다.

### 소스 정보 기본 포함

Compose 컴파일러 Gradle 플러그인은 Android에서 [소스 정보 포함](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 기능이
이미 기본적으로 활성화되어 있습니다. Kotlin 2.1.20부터 이 기능은 모든 플랫폼에서 기본적으로 활성화됩니다.

`freeCompilerArgs`를 사용하여 이 옵션을 설정했는지 확인하십시오. 이 방법은
플러그인과 함께 사용될 경우 옵션이 사실상 두 번 설정되어 빌드가 실패할 수 있습니다.

## 호환성 파괴 변경 및 사용 중단

*   Kotlin 멀티플랫폼을 Gradle의 향후 변경 사항과 일치시키기 위해 `withJava()` 함수를 단계적으로 제거하고 있습니다.
    [Java 소스 세트는 이제 기본적으로 생성됩니다](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default). [Java 테스트 픽스처](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 플러그인을 사용하는 경우,
    호환성 문제를 피하기 위해 [Kotlin 2.1.21](releases.md#release-details)로 직접 업그레이드하십시오.
*   JetBrains 팀은 `kotlin-android-extensions` 플러그인의 사용 중단을 진행하고 있습니다. 프로젝트에서 이를 사용하려고 하면
    이제 구성 오류가 발생하며 플러그인 코드가 실행되지 않습니다.
*   레거시 `kotlin.incremental.classpath.snapshot.enabled` 속성이 Kotlin Gradle 플러그인에서 제거되었습니다.
    이 속성은 JVM에서 내장 ABI 스냅샷으로 폴백할 기회를 제공하는 데 사용되었습니다. 플러그인은 이제
    불필요한 재컴파일을 감지하고 피하기 위해 다른 방법을 사용하므로 이 속성은 더 이상 사용되지 않습니다.

## 문서 업데이트

Kotlin 문서는 몇 가지 주목할 만한 변경 사항이 있었습니다.

### 개편 및 새로운 페이지

*   [Kotlin 로드맵](roadmap.md) – Kotlin 언어 및 생태계 발전의 업데이트된 우선순위 목록을 참조하십시오.
*   [Gradle 모범 사례](gradle-best-practices.md) 페이지 – Gradle 빌드를 최적화하고 성능을
    향상시키는 필수 모범 사례를 배우십시오.
*   [Compose 멀티플랫폼 및 Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html)
    – 두 UI 프레임워크 간의 관계 개요.
*   [Kotlin 멀티플랫폼 및 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html)
    – 두 가지 인기 있는 크로스플랫폼 프레임워크의 비교를 참조하십시오.
*   [C 언어와의 상호 운용성](native-c-interop.md) – Kotlin과 C 언어 간의 상호 운용성에 대한 자세한 내용을 살펴보십시오.
*   [숫자](numbers.md) – 숫자를 나타내는 다양한 Kotlin 타입에 대해 알아보십시오.

### 새로운 튜토리얼 및 업데이트된 튜토리얼

*   [라이브러리를 Maven Central에 배포](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
    – 가장 인기 있는 Maven 저장소에 KMP 라이브러리 아티팩트를 배포하는 방법을 배우십시오.
*   [동적 라이브러리로서의 Kotlin/Native](native-dynamic-libraries.md) – 동적 Kotlin 라이브러리를 생성하십시오.
*   [Apple 프레임워크로서의 Kotlin/Native](apple-framework.md) – 자체 프레임워크를 생성하고 macOS 및 iOS에서 Swift/Objective-C 애플리케이션에서 Kotlin/Native 코드를 사용하십시오.

## Kotlin 2.1.20으로 업데이트하는 방법

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 포함된
번들 플러그인으로 배포됩니다. 즉, 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없습니다.

새 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 2.1.20으로 변경](releases.md#update-to-a-new-kotlin-version)하십시오.