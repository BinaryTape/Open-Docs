[//]: # (title: Kotlin 2.1.20의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin 멀티플랫폼, JVM, Native, JS, Wasm의 업데이트, 그리고 Gradle 및 Maven 빌드 도구 지원을 포함한 Kotlin 2.1.20 릴리스 노트를 확인해 보세요.</web-summary>

_[릴리스 날짜: 2025년 3월 20일](releases.md#release-history)_

Kotlin 2.1.20이 출시되었습니다! 주요 하이라이트는 다음과 같습니다:

* **K2 컴파일러 업데이트**: [새로운 kapt 및 Lombok 플러그인 업데이트](#kotlin-k2-compiler)
* **Kotlin 멀티플랫폼(Multiplatform)**: [Gradle의 Application 플러그인을 대체하는 새로운 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**: [Xcode 16.3 지원 및 새로운 인라이닝(inlining) 최적화](#kotlin-native)
* **Kotlin/Wasm**: [기본 커스텀 포맷터, DWARF 지원 및 Provider API로의 마이그레이션](#kotlin-wasm)
* **Gradle 지원**: [Gradle의 Isolated Projects와의 호환성 및 커스텀 게시(publication) 변체 지원](#gradle)
* **표준 라이브러리**: [공통 원자(atomic) 타입, UUID 지원 개선 및 새로운 시간 추적 기능](#standard-library)
* **Compose 컴파일러**: [`@Composable` 함수에 대한 제한 완화 및 기타 업데이트](#compose-compiler)
* **문서**: [Kotlin 문서의 주목할 만한 개선 사항](#documentation-updates)

> Kotlin 릴리스 주기에 대한 정보는 [Kotlin 릴리스 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## IDE 지원

2.1.20을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 포함되어 있습니다.
IDE에서 Kotlin 플러그인을 별도로 업데이트할 필요는 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.1.20으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트하기](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

### OSGi 지원 프로젝트에서 Kotlin 아티팩트의 소스 다운로드

이제 `kotlin-osgi-bundle` 라이브러리의 모든 종속성 소스가 배포판에 포함됩니다. 이를 통해 IntelliJ IDEA가 이러한 소스를 다운로드하여 Kotlin 심볼에 대한 문서를 제공하고 디버깅 경험을 개선할 수 있습니다.

## Kotlin K2 컴파일러

새로운 Kotlin K2 컴파일러에 대한 플러그인 지원을 지속적으로 개선하고 있습니다. 이번 릴리스에는 새로운 kapt 및 Lombok 플러그인에 대한 업데이트가 포함되었습니다.

### 새로운 기본 kapt 플러그인
<primary-label ref="beta"/>

Kotlin 2.1.20부터 모든 프로젝트에서 kapt 컴파일러 플러그인의 K2 구현이 기본적으로 활성화됩니다.

JetBrains 팀은 Kotlin 1.9.20에서 K2 컴파일러와 함께 kapt 플러그인의 새로운 구현을 처음 선보였습니다. 그 이후로 K2 kapt의 내부 구현을 더욱 발전시켜 K1 버전과 유사하게 동작하도록 만드는 동시에 성능을 크게 개선했습니다.

K2 컴파일러와 함께 kapt를 사용할 때 문제가 발생하면 일시적으로 이전 플러그인 구현으로 되돌릴 수 있습니다.

이를 위해 프로젝트의 `gradle.properties` 파일에 다음 옵션을 추가하세요:

```kotlin
kapt.use.k2=false
```

문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)에 보고해 주세요.

### Lombok 컴파일러 플러그인: `@SuperBuilder` 지원 및 `@Builder` 업데이트
<primary-label ref="experimental-general"/>

[Kotlin Lombok 컴파일러 플러그인](lombok.md)이 이제 `@SuperBuilder` 어노테이션을 지원하여 클래스 계층 구조에 대한 빌더를 더 쉽게 만들 수 있습니다. 이전에는 Kotlin에서 Lombok을 사용하는 개발자가 상속을 다룰 때 빌더를 수동으로 정의해야 했습니다. `@SuperBuilder`를 사용하면 빌더가 슈퍼클래스 필드를 자동으로 상속하므로 객체를 생성할 때 이를 초기화할 수 있습니다.

또한, 이번 업데이트에는 여러 개선 사항 및 버그 수정이 포함되어 있습니다:

* 이제 생성자에서 `@Builder` 어노테이션을 사용할 수 있어 더욱 유연한 객체 생성이 가능합니다. 자세한 내용은 관련 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-71547)를 참조하세요.
* Kotlin의 Lombok 코드 생성과 관련된 여러 이슈가 해결되어 전반적인 호환성이 향상되었습니다. 자세한 내용은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)를 참조하세요.

`@SuperBuilder` 어노테이션에 대한 자세한 내용은 공식 [Lombok 문서](https://projectlombok.org/features/experimental/SuperBuilder)를 참조하세요.

## Kotlin 멀티플랫폼: Gradle의 Application 플러그인을 대체하는 새로운 DSL
<primary-label ref="experimental-opt-in"/>

Gradle 8.7부터 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 플러그인은 더 이상 Kotlin 멀티플랫폼 Gradle 플러그인과 호환되지 않습니다. Kotlin 2.1.20은 유사한 기능을 제공하기 위한 실험적(Experimental) DSL을 도입했습니다. 새로운 `executable {}` 블록은 JVM 타겟에 대한 실행 태스크 및 Gradle [배포판(distributions)](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)을 구성합니다.

빌드 스크립트에서 `executable {}` 블록을 사용하기 전에 다음 `@OptIn` 어노테이션을 추가하세요:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

예시:

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // 이 타겟의 "main" 컴파일을 위해 "runJvm"이라는 JavaExec 태스크와 Gradle 배포판을 구성합니다.
            executable {
                mainClass.set("foo.MainKt")
            }

            // "main" 컴파일을 위해 "runJvmAnother"라는 JavaExec 태스크와 Gradle 배포판을 구성합니다.
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // 다른 클래스 설정
                mainClass.set("foo.MainAnotherKt")
            }

            // "test" 컴파일을 위해 "runJvmTest"라는 JavaExec 태스크와 Gradle 배포판을 구성합니다.
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // "test" 컴파일을 위해 "runJvmTestAnother"라는 JavaExec 태스크와 Gradle 배포판을 구성합니다.
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

이 예제에서 Gradle의 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) 플러그인은 첫 번째 `executable {}` 블록에 적용됩니다.

문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고하거나 [공식 Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)을 통해 알려주세요.

## Kotlin/Native

### Xcode 16.3 지원

Kotlin **2.1.21**부터 Kotlin/Native 컴파일러는 최신 안정 버전인 Xcode 16.3을 지원합니다. Xcode를 업데이트하고 Apple 운영 체제용 Kotlin 프로젝트 작업을 계속 진행할 수 있습니다.

또한 2.1.21 릴리스는 Kotlin 멀티플랫폼 프로젝트에서 컴파일 실패를 일으켰던 관련 [cinterop 이슈](https://youtrack.jetbrains.com/issue/KT-75781/)를 해결했습니다.

### 새로운 인라이닝 최적화
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20은 실제 코드 생성 단계 이전에 수행되는 새로운 인라이닝 최적화 패스(pass)를 도입했습니다.

Kotlin/Native 컴파일러의 새로운 인라이닝 패스는 표준 LLVM 인라이너보다 더 나은 성능을 발휘하며 생성된 코드의 런타임 성능을 향상시킬 것으로 기대됩니다.

새로운 인라이닝 패스는 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 이를 사용해 보려면 다음 컴파일러 옵션을 사용하세요:

```none
-Xbinary=preCodegenInlineThreshold=40
```

테스트 결과, 임계값(threshold)을 40 토큰(컴파일러가 파싱하는 코드 단위)으로 설정하는 것이 컴파일 최적화의 합리적인 절충안이 되는 것으로 나타났습니다. 벤치마크에 따르면 이는 전체적으로 9.5%의 성능 향상을 제공합니다. 물론 다른 값을 시도해 볼 수도 있습니다.

바이너리 크기가 증가하거나 컴파일 시간이 늘어나는 경우 [YouTrack](https://kotl.in/issue)을 통해 보고해 주세요.

## Kotlin/Wasm

이번 릴리스는 Kotlin/Wasm 디버깅 및 프로퍼티 사용성을 개선합니다. 커스텀 포맷터는 이제 개발 빌드에서 기본적으로 작동하며, DWARF 디버깅은 코드 분석을 용이하게 합니다. 또한, Provider API는 Kotlin/Wasm 및 Kotlin/JS에서의 프로퍼티 사용을 단순화합니다.

### 기본적으로 활성화되는 커스텀 포맷터

이전에는 Kotlin/Wasm 코드로 작업할 때 웹 브라우저에서의 디버깅을 개선하기 위해 커스텀 포맷터를 [수동으로 구성](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm)해야 했습니다.

이번 릴리스부터 커스텀 포맷터는 개발 빌드에서 기본적으로 활성화되므로 추가적인 Gradle 구성이 필요하지 않습니다.

이 기능을 사용하려면 브라우저의 개발자 도구에서 커스텀 포맷터가 활성화되어 있는지 확인하기만 하면 됩니다:

* Chrome DevTools의 경우, **Settings | Preferences | Console**에서 커스텀 포맷터 체크박스를 찾으세요:

  ![Chrome에서 커스텀 포맷터 활성화](wasm-custom-formatters-chrome.png){width=400}

* Firefox DevTools의 경우, **Settings | Advanced settings**에서 커스텀 포맷터 체크박스를 찾으세요:

  ![Firefox에서 커스텀 포맷터 활성화](wasm-custom-formatters-firefox.png){width=400}

이 변경 사항은 주로 Kotlin/Wasm 개발 빌드에 영향을 미칩니다. 프로덕션 빌드에 대한 특정 요구 사항이 있는 경우 그에 따라 Gradle 구성을 조정해야 합니다. 이를 위해 `wasmJs {}` 블록에 다음 컴파일러 옵션을 추가하세요:

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

Kotlin 2.1.20은 Kotlin/Wasm에 DWARF(임의 레코드 형식을 사용한 디버깅) 지원을 도입했습니다.

이 변경을 통해 Kotlin/Wasm 컴파일러는 생성된 WebAssembly(Wasm) 바이너리에 DWARF 데이터를 포함할 수 있게 되었습니다. 많은 디버거와 가상 머신이 이 데이터를 읽어 컴파일된 코드에 대한 통찰력을 제공할 수 있습니다.

DWARF는 주로 독립형 Wasm 가상 머신(VM) 내에서 Kotlin/Wasm 애플리케이션을 디버깅하는 데 유용합니다. 이 기능을 사용하려면 Wasm VM과 디버거가 DWARF를 지원해야 합니다.

DWARF 지원을 통해 Kotlin/Wasm 애플리케이션을 한 단계씩 실행(step through)하고, 변수를 검사하며, 코드에 대한 통찰을 얻을 수 있습니다. 이 기능을 활성화하려면 다음 컴파일러 옵션을 사용하세요:

```bash
-Xwasm-generate-dwarf
```

### Kotlin/Wasm 및 Kotlin/JS 프로퍼티에 대한 Provider API 마이그레이션

이전에는 Kotlin/Wasm 및 Kotlin/JS 확장의 프로퍼티가 가변(`var`)이었으며 빌드 스크립트에서 직접 할당되었습니다:

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

이제 프로퍼티는 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html)를 통해 노출되며, 값을 할당하려면 `.set()` 함수를 사용해야 합니다:

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API는 값이 지연 계산되고 태스크 종속성과 적절하게 통합되도록 보장하여 빌드 성능을 향상시킵니다.

이 변경과 함께 직접적인 프로퍼티 할당은 `NodeJsEnvSpec` 및 `YarnRootEnvSpec`과 같은 `*EnvSpec` 클래스를 사용하는 방식으로 대체되어 사용 중단(deprecated)되었습니다.

또한, 혼란을 피하기 위해 여러 에일리어스(alias) 태스크가 제거되었습니다:

| 제거된 태스크 | 대체 태스크 |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 또는 `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` 또는 `jsBrowserDistribution`         |

빌드 스크립트에서 Kotlin/JS 또는 Kotlin/Wasm만 사용하는 경우 Gradle이 할당을 자동으로 처리하므로 별도의 조치가 필요하지 않습니다.

하지만 Kotlin Gradle 플러그인을 기반으로 하는 플러그인을 유지 관리하고 있고, 해당 플러그인이 `kotlin-dsl`을 적용하지 않는 경우 프로퍼티 할당을 `.set()` 함수를 사용하도록 업데이트해야 합니다.

## Gradle

Kotlin 2.1.20은 Gradle 7.6.3부터 8.11까지 완전한 호환성을 제공합니다. 최신 Gradle 릴리스 버전까지도 사용할 수 있습니다. 다만, 이 경우 사용 중단 경고가 발생할 수 있으며 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

이번 버전의 Kotlin에는 Kotlin Gradle 플러그인과 Gradle의 Isolated Projects 기능 간의 호환성뿐만 아니라 커스텀 Gradle 게시 변체(publication variants)에 대한 지원이 포함되어 있습니다.

### Gradle의 Isolated Projects와 호환되는 Kotlin Gradle 플러그인
<primary-label ref="experimental-opt-in"/>

> 이 기능은 현재 Gradle에서 프리 알파(pre-Alpha) 상태입니다. 현재 JS 및 Wasm 타겟은 지원되지 않습니다.
> Gradle 버전 8.10 이상에서만 평가 목적으로 사용하세요.
>
{style="warning"}

Kotlin 2.1.0부터 프로젝트에서 [Gradle의 Isolated Projects 기능을 미리 보기](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)로 사용해 볼 수 있었습니다.

이전에는 이 기능을 시도하기 전에 프로젝트가 Isolated Projects와 호환되도록 Kotlin Gradle 플러그인을 수동으로 구성해야 했습니다. Kotlin 2.1.20에서는 이러한 추가 단계가 더 이상 필요하지 않습니다.

이제 Isolated Projects 기능을 활성화하려면 [시스템 프로퍼티만 설정](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)하면 됩니다.

Gradle의 Isolated Projects 기능은 멀티플랫폼 프로젝트와 JVM 또는 Android 타겟만 포함하는 프로젝트 모두에 대해 Kotlin Gradle 플러그인에서 지원됩니다.

특히 멀티플랫폼 프로젝트의 경우, 업그레이드 후 Gradle 빌드에 문제가 발생하면 다음 설정을 추가하여 새로운 Kotlin Gradle 플러그인 동작을 거부(opt-out)할 수 있습니다:

```none
kotlin.kmp.isolated-projects.support=disable
```

하지만 멀티플랫폼 프로젝트에서 이 Gradle 프로퍼티를 사용하면 Isolated Projects 기능을 사용할 수 없습니다.

이 기능에 대한 의견을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)을 통해 공유해 주세요.

### 커스텀 Gradle 게시 변체 추가 지원
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20은 커스텀 [Gradle 게시(publication) 변체](https://docs.gradle.org/current/userguide/variant_attributes.html)를 추가하는 기능을 지원합니다. 이 기능은 멀티플랫폼 프로젝트와 JVM을 타겟으로 하는 프로젝트에서 사용할 수 있습니다.

> 이 기능을 사용하여 기존 Gradle 변체를 수정할 수는 없습니다.
>
{style="note"}

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 사용하려면 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 어노테이션을 사용하세요.

커스텀 Gradle 게시 변체를 추가하려면 `adhocSoftwareComponent()` 함수를 호출합니다. 이 함수는 Kotlin DSL에서 구성할 수 있는 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html)의 인스턴스를 반환합니다:

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
        // AdhocSoftwareComponent 인스턴스를 반환합니다.
        adhocSoftwareComponent()
        // 또는 다음과 같이 DSL 블록에서 AdhocSoftwareComponent를 구성할 수 있습니다.
        adhocSoftwareComponent {
            // AdhocSoftwareComponent API를 사용하여 여기에 커스텀 변체를 추가하세요.
        }
    }
}
```

> 변체에 대한 자세한 내용은 Gradle의 [게시 사용자 정의 가이드](https://docs.gradle.org/current/userguide/publishing_customization.html)를 참조하세요.
>
{style="tip"}

## 표준 라이브러리

이번 릴리스는 표준 라이브러리에 공통 원자(atomic) 타입, UUID 지원 개선, 새로운 시간 추적 기능 등 새로운 실험적 기능을 제공합니다.

### 공통 원자(atomic) 타입
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20에서는 표준 라이브러리의 `kotlin.concurrent.atomics` 패키지에 공통 원자 타입을 도입하여 스레드 안전한 연산을 위한 플랫폼 독립적인 공유 코드를 작성할 수 있게 되었습니다. 이를 통해 소스 세트 전반에 걸쳐 원자성에 의존하는 로직을 중복해서 작성할 필요가 없어져 Kotlin 멀티플랫폼 프로젝트의 개발이 단순해집니다.

`kotlin.concurrent.atomics` 패키지와 그 프로퍼티는 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 사용하려면 `@OptIn(ExperimentalAtomicApi::class)` 어노테이션을 사용하거나 컴파일러 옵션 `-opt-in=kotlin.ExperimentalAtomicApi`를 사용하세요.

다음은 `AtomicInt`를 사용하여 여러 스레드에서 처리된 항목을 안전하게 계산하는 예제입니다:

```kotlin
// 필요한 라이브러리 임포트
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 처리된 항목을 위한 원자적 카운터 초기화
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 여러 코루틴에서 처리하기 위해 항목을 청크(chunk)로 나눔
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("thread ${Thread.currentThread()}에서 $item 처리 중")
                    processedItems += 1 // 카운터를 원자적으로 증가
                }
            }
         }
    }
//sampleEnd
    // 처리된 총 항목 수 출력
    println("총 처리된 항목 수: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

Kotlin의 원자 타입과 Java의 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) 원자 타입 간의 원활한 상호운용성을 위해, API는 `.asJavaAtomic()` 및 `.asKotlinAtomic()` 확장 함수를 제공합니다. JVM에서 Kotlin 원자 타입과 Java 원자 타입은 런타임 시 동일한 타입이므로 오버헤드 없이 서로 변환할 수 있습니다.

다음은 Kotlin과 Java 원자 타입이 함께 작동하는 예제입니다:

```kotlin
// 필요한 라이브러리 임포트
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Kotlin의 AtomicInt를 Java의 AtomicInteger로 변환
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic 값: ${javaAtomic.get()}")
    // Java atomic 값: 42

    // Java의 AtomicInteger를 다시 Kotlin의 AtomicInt로 변환
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic 값: ${kotlinAgain.load()}")
    // Kotlin atomic 값: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 파싱, 포맷팅 및 비교의 변화
<primary-label ref="experimental-opt-in"/>

JetBrains 팀은 [2.0.20에서 표준 라이브러리에 도입된 UUID 지원](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library)을 지속적으로 개선하고 있습니다.

이전에는 `parse()` 함수가 하이픈이 포함된 16진수(hex-and-dash) 형식의 UUID만 허용했습니다. Kotlin 2.1.20부터는 하이픈이 있는 형식과 없는 일반 16진수 형식을 _모두_ `parse()`에서 사용할 수 있습니다.

또한 이번 릴리스에서는 하이픈 포함 형식과 관련된 명시적인 함수들이 도입되었습니다:

* `parseHexDash()`는 하이픈 포함 형식의 UUID를 파싱합니다.
* `toHexDashString()`은 `Uuid`를 하이픈 포함 형식의 `String`으로 변환합니다(`toString()`의 기능과 동일).

이러한 함수들은 이전에 16진수 형식을 위해 도입된 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 및 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)과 유사하게 작동합니다. 파싱 및 포맷팅 기능을 명시적으로 명명함으로써 코드의 명확성과 UUID 사용 환경이 향상될 것입니다.

이제 Kotlin의 UUID는 `Comparable`을 구현합니다. Kotlin 2.1.20부터 `Uuid` 타입의 값을 직접 비교하고 정렬할 수 있습니다. 이를 통해 `<` 및 `>` 연산자를 사용할 수 있고, `Comparable` 타입 또는 그 컬렉션에 대해서만 제공되는 표준 라이브러리 확장 함수(예: `sorted()`)를 사용할 수 있으며, `Comparable` 인터페이스가 필요한 모든 함수나 API에 UUID를 전달할 수 있게 됩니다.

표준 라이브러리의 UUID 지원은 여전히 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계임을 유의하세요. 사용하려면 `@OptIn(ExperimentalUuidApi::class)` 어노테이션이나 컴파일러 옵션 `-opt-in=kotlin.uuid.ExperimentalUuidApi`를 사용하세요:

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse()는 일반 16진수 형식의 UUID를 허용합니다.
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 하이픈 포함 형식으로 변환합니다.
    val hexDashFormat = uuid.toHexDashString()
 
    // 하이픈 포함 형식의 UUID를 출력합니다.
    println(hexDashFormat)

    // UUID를 오름차순으로 정렬하여 출력합니다.
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

Kotlin 2.1.20부터 표준 라이브러리는 시점(moment in time)을 표현하는 기능을 제공합니다. 이 기능은 이전까지 공식 Kotlin 라이브러리인 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)에서만 사용할 수 있었습니다.

`kotlinx.datetime.Clock` 인터페이스는 [`kotlin.time.Clock`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-clock/)으로, `kotlinx.datetime.Instant` 클래스는 [`kotlin.time.Instant`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-instant/)로 표준 라이브러리에 도입되었습니다. 이러한 개념은 `kotlinx-datetime`에 남아있는 더 복잡한 달력 및 시간대 기능에 비해 순수하게 시점만을 다루기 때문에 표준 라이브러리의 `time` 패키지와 자연스럽게 일치합니다.

`Instant`와 `Clock`은 시간대나 날짜를 고려하지 않고 정밀한 시간 추적이 필요할 때 유용합니다. 예를 들어 타임스탬프와 함께 이벤트를 기록하거나, 두 시점 사이의 기간을 측정하거나, 시스템 프로세스의 현재 시점을 얻는 데 사용할 수 있습니다.

다른 언어와의 상호운용성을 제공하기 위해 추가적인 변환 함수들을 사용할 수 있습니다:

* [`.toKotlinInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-kotlin-instant.html)는 시간 값을 `kotlin.time.Instant` 인스턴스로 변환합니다.
* [`.toJavaInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-java-instant.html)는 `kotlin.time.Instant` 값을 `java.time.Instant` 값으로 변환합니다.
* [`Instant.toJSDate()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-j-s-date.html)는 `kotlin.time.Instant` 값을 JS `Date` 클래스의 인스턴스로 변환합니다. 이 변환은 정밀도가 일치하지 않을 수 있습니다. JS는 날짜 표현에 밀리초 단위를 사용하지만, Kotlin은 나노초 분해능을 지원합니다.

표준 라이브러리의 새로운 시간 기능은 여전히 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 사용하려면 `@OptIn(ExperimentalTime::class)` 어노테이션을 사용하세요:

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 현재 시점 얻기
    val currentInstant = Clock.System.now()
    println("현재 시간: $currentInstant")

    // 두 시점 사이의 차이 찾기
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("2023-01-01 이후 경과 시간: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

구현에 대한 자세한 내용은 [KEEP 제안서](https://github.com/Kotlin/KEEP/pull/387/files)를 참조하세요.

## Compose 컴파일러

2.1.20에서 Compose 컴파일러는 이전 릴리스에서 도입되었던 `@Composable` 함수에 대한 일부 제한을 완화했습니다. 또한, Compose 컴파일러 Gradle 플러그인이 모든 플랫폼에서 Android와 동일하게 동작하도록 기본적으로 소스 정보를 포함하도록 설정되었습니다.

### open `@Composable` 함수에서 기본값이 있는 파라미터 지원

이전에는 open `@Composable` 함수에서 기본값이 있는 파라미터를 사용하면 컴파일러 출력이 잘못되어 런타임에 크래시가 발생할 수 있었기 때문에 이를 제한했습니다. 이제 근본적인 문제가 해결되었으며, Kotlin 2.1.20 이상을 사용할 때 기본값이 있는 파라미터가 완전히 지원됩니다.

Compose 컴파일러는 [버전 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) 이전에도 open 함수의 기본값 파라미터를 허용했었으므로, 지원 여부는 프로젝트 구성에 따라 달라집니다:

* open composable 함수가 Kotlin 버전 2.1.20 이상으로 컴파일되는 경우, 컴파일러는 기본값 파라미터에 대해 올바른 래퍼를 생성합니다. 여기에는 1.5.8 이전 바이너리와 호환되는 래퍼가 포함되어, 하위 라이브러리에서도 이 open 함수를 사용할 수 있습니다.
* open composable 함수가 2.1.20 미만의 Kotlin 버전으로 컴파일되는 경우, Compose는 호환 모드를 사용하며 이로 인해 런타임 크래시가 발생할 수 있습니다. 호환 모드를 사용하는 경우 컴파일러는 잠재적인 문제를 강조하기 위해 경고를 표시합니다.

### Final 오버라이드 함수에 대한 재시작(restartable) 허용

가상 함수(`open` 및 `abstract`의 오버라이드, 인터페이스 포함)는 [2.1.0 릴리스에서 재시작 불가능하도록 강제되었습니다](whatsnew21.md#changes-to-open-and-overridden-composable-functions). 이 제한은 이제 final 클래스의 멤버이거나 함수 자체가 `final`인 경우 완화되어, 평소와 같이 재시작되거나 건너뛰기(skipping)가 가능해집니다.

Kotlin 2.1.20으로 업그레이드한 후 해당 함수들의 동작 변화를 관찰할 수 있습니다. 이전 버전의 재시작 불가능한 로직을 강제하려면 함수에 `@NonRestartableComposable` 어노테이션을 적용하세요.

### 공용 API에서 `ComposableSingletons` 제거

`ComposableSingletons`는 Compose 컴파일러가 `@Composable` 람다를 최적화할 때 생성하는 클래스입니다. 파라미터를 캡처하지 않는 람다는 한 번만 할당되어 클래스의 프로퍼티에 캐싱되므로 런타임 중 할당을 줄여줍니다. 이 클래스는 internal 가시성으로 생성되며 일반적으로 파일 내부의 람다 최적화만을 목적으로 합니다.

하지만 이 최적화가 `inline` 함수 바디에도 적용되어 싱글톤 람다 인스턴스가 공용 API로 유출되는 문제가 있었습니다. 이를 해결하기 위해 2.1.20부터 인라인 함수 내부의 `@Composable` 람다는 더 이상 싱글톤으로 최적화되지 않습니다. 동시에 Compose 컴파일러는 이전 모델로 컴파일된 모듈과의 바이너리 호환성을 지원하기 위해 인라인 함수에 대한 싱글톤 클래스와 람다를 계속 생성할 것입니다.

### 기본적으로 포함되는 소스 정보

Compose 컴파일러 Gradle 플러그인은 이미 Android에서 [소스 정보 포함](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 기능이 기본적으로 활성화되어 있습니다. Kotlin 2.1.20부터 이 기능은 모든 플랫폼에서 기본적으로 활성화됩니다.

`freeCompilerArgs`를 사용하여 이 옵션을 직접 설정했는지 확인하세요. 플러그인과 함께 이 방법을 사용하면 옵션이 중복으로 설정되어 빌드가 실패할 수 있습니다.

## 주요 변경 사항 및 사용 중단(Deprecations)

* 향후 예정된 Gradle의 변경 사항에 맞춰 Kotlin 멀티플랫폼의 `withJava()` 함수를 단계적으로 제거하고 있습니다. [Java 소스 세트는 이제 기본적으로 생성됩니다](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#java-source-sets-created-by-default). [Java test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 플러그인을 사용하는 경우, 호환성 문제를 피하기 위해 즉시 [Kotlin 2.1.21](releases.md#release-history)로 업그레이드하세요.
* JetBrains 팀은 `kotlin-android-extensions` 플러그인의 사용 중단이 진행 중입니다. 프로젝트에서 이 플러그인을 사용하려고 하면 이제 구성 오류가 발생하며 플러그인 코드가 실행되지 않습니다.
* 레거시 `kotlin.incremental.classpath.snapshot.enabled` 프로퍼티가 Kotlin Gradle 플러그인에서 제거되었습니다. 이 프로퍼티는 JVM에서 내장 ABI 스냅샷으로 되돌아갈 수 있는 기회를 제공했었습니다. 이제 플러그인은 불필요한 재컴파일을 감지하고 방지하기 위해 다른 방법을 사용하므로 이 프로퍼티는 더 이상 사용되지 않습니다.

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있었습니다:

### 개편 및 신규 페이지

* [Kotlin 로드맵](roadmap.md) – 언어 및 에코시스템 진화에 대한 Kotlin의 업데이트된 우선순위 목록을 확인하세요.
* [Gradle 모범 사례(Best practices)](gradle-best-practices.md) 페이지 – Gradle 빌드를 최적화하고 성능을 향상시키기 위한 필수 모범 사례를 배워보세요.
* [Compose Multiplatform과 Jetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html) – 두 UI 프레임워크 간의 관계에 대한 개요입니다.
* [Kotlin Multiplatform과 Flutter](https://kotlinlang.org/docs/multiplatform/kotlin-multiplatform-flutter.html) – 두 가지 인기 있는 크로스 플랫폼 프레임워크를 비교해 보세요.
* [C와의 상호운용성](native-c-interop.md) – Kotlin의 C 상호운용성에 대한 세부 정보를 살펴보세요.
* [숫자(Numbers)](numbers.md) – 숫자를 표현하기 위한 다양한 Kotlin 타입에 대해 알아보세요.

### 신규 및 업데이트된 튜토리얼

* [Maven Central에 라이브러리 게시](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-libraries.html) – 가장 인기 있는 Maven 저장소에 KMP 라이브러리 아티팩트를 게시하는 방법을 배워보세요.
* [동적 라이브러리로서의 Kotlin/Native](native-dynamic-libraries.md) – 동적 Kotlin 라이브러리를 생성해 보세요.
* [Apple 프레임워크로서의 Kotlin/Native](apple-framework.md) – 자신만의 프레임워크를 만들고 macOS 및 iOS의 Swift/Objective-C 애플리케이션에서 Kotlin/Native 코드를 사용해 보세요.

## Kotlin 2.1.20으로 업데이트하는 방법

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 포함된 번들 플러그인으로 제공됩니다. 즉, 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없습니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전](releases.md#update-to-a-new-kotlin-version)을 2.1.20으로 변경하세요.