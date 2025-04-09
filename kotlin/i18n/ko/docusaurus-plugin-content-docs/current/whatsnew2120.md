---
title: "Kotlin 2.1.20의 새로운 기능"
---
_[릴리스 날짜: 2025년 3월 20일](releases#release-details)_

Kotlin 2.1.20 릴리스가 출시되었습니다! 주요 특징은 다음과 같습니다.

* **K2 컴파일러 업데이트**: [새로운 kapt 및 Lombok 플러그인 업데이트](#kotlin-k2-compiler)
* **Kotlin Multiplatform**: [Gradle의 Application 플러그인을 대체하는 새로운 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**: [새로운 인라인 최적화](#kotlin-native-new-inlining-optimization)
* **Kotlin/Wasm**: [기본 사용자 정의 포맷터, DWARF 지원 및 Provider API로의 마이그레이션](#kotlin-wasm)
* **Gradle 지원**: [Gradle의 Isolated Projects 및 사용자 정의 게시 변형과의 호환성](#gradle)
* **표준 라이브러리**: [공통 atomic 타입, 향상된 UUID 지원 및 새로운 시간 추적 기능](#standard-library)
* **Compose 컴파일러**: [`@Composable` 함수에 대한 완화된 제한 및 기타 업데이트](#compose-compiler)
* **문서**: [Kotlin 문서의 주목할 만한 개선 사항](#documentation-updates).

## IDE 지원

2.1.20을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.1.20으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases#update-to-a-new-kotlin-version)를 참조하세요.

### OSGi 지원이 있는 프로젝트에서 Kotlin 아티팩트에 대한 소스 다운로드

`kotlin-osgi-bundle` 라이브러리의 모든 종속성 소스가 이제 배포에 포함됩니다. 이를 통해
IntelliJ IDEA는 이러한 소스를 다운로드하여 Kotlin 심볼에 대한 문서를 제공하고 디버깅 환경을 개선할 수 있습니다.

## Kotlin K2 컴파일러

새로운 Kotlin K2 컴파일러에 대한 플러그인 지원을 계속 개선하고 있습니다. 이번 릴리스에서는 새로운 kapt
및 Lombok 플러그인에 대한 업데이트가 제공됩니다.

### 새로운 기본 kapt 플러그인

Kotlin 2.1.20부터 kapt 컴파일러 플러그인의 K2 구현이 모든 프로젝트에 대해 기본적으로 활성화됩니다.

JetBrains 팀은 Kotlin 1.9.20에서 K2 컴파일러를 사용하여 kapt 플러그인의 새로운 구현을 시작했습니다.
그 이후로 K2 kapt의 내부 구현을 추가로 개발하여 K1 버전과 유사하게 동작하도록 만들면서
성능도 크게 향상시켰습니다.

K2 컴파일러와 함께 kapt를 사용할 때 문제가 발생하면
이전 플러그인 구현으로 일시적으로 되돌릴 수 있습니다.

이렇게 하려면 프로젝트의 `gradle.properties` 파일에 다음 옵션을 추가하세요.

```kotlin
kapt.use.k2=false
```

문제가 있으면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)에 보고해 주세요.

### Lombok 컴파일러 플러그인: `@SuperBuilder` 지원 및 `@Builder` 업데이트

[Kotlin Lombok 컴파일러 플러그인](lombok)은 이제 `@SuperBuilder` 어노테이션을 지원하여 클래스 계층 구조에 대한
빌더를 더 쉽게 만들 수 있습니다. 이전에는 Kotlin에서 Lombok을 사용하는 개발자는 상속을 사용할 때 빌더를 수동으로
정의해야 했습니다. `@SuperBuilder`를 사용하면 빌더가 자동으로 슈퍼클래스 필드를 상속하므로 객체를 생성할 때
초기화할 수 있습니다.

또한 이 업데이트에는 다음과 같은 여러 개선 사항과 버그 수정 사항이 포함되어 있습니다.

* 이제 `@Builder` 어노테이션이 생성자에서 작동하므로 객체를 더 유연하게 생성할 수 있습니다. 자세한 내용은
  해당 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-71547)를 참조하세요.
* Kotlin에서 Lombok의 코드 생성과 관련된 여러 문제가 해결되어 전반적인 호환성이 향상되었습니다.
  자세한 내용은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)를 참조하세요.

`@SuperBuilder` 어노테이션에 대한 자세한 내용은 공식 [Lombok 문서](https://projectlombok.org/features/experimental/SuperBuilder)를 참조하세요.

## Kotlin Multiplatform: Gradle의 Application 플러그인을 대체하는 새로운 DSL

Gradle 8.7부터 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 플러그인은
Kotlin Multiplatform Gradle 플러그인과 더 이상 호환되지 않습니다. Kotlin 2.1.20에서는 유사한 기능을 달성하기 위해 Experimental
DSL을 도입했습니다. 새로운 `executable {}` 블록은 실행 작업과 JVM 타겟에 대한 Gradle
[배포](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)를 구성합니다.

빌드 스크립트의 `executable {}` 블록 앞에 다음 `@OptIn` 어노테이션을 추가합니다.

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

예를 들어:

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // 이 타겟의 "main" 컴파일에서 "runJvm"이라는 JavaExec 작업과 Gradle 배포를 구성합니다.
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

이 예에서는 Gradle의 [배포](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
플러그인이 첫 번째 `executable {}` 블록에 적용됩니다.

문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고하거나 [공용 Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)에 알려주세요.

## Kotlin/Native: 새로운 인라인 최적화

Kotlin 2.1.20에서는 실제 코드 생성 단계 앞에 오는 새로운 인라인 최적화 패스를 도입했습니다.

Kotlin/Native 컴파일러의 새로운 인라인 패스는 표준 LLVM 인라이너보다 더 나은 성능을 제공하고 생성된 코드의
런타임 성능을 향상시켜야 합니다.

새로운 인라인 패스는 현재 [Experimental](components-stability#stability-levels-explained) 상태입니다. 사용해 보려면
다음 컴파일러 옵션을 사용하세요.

```none
-Xbinary=preCodegenInlineThreshold=40
```

실험 결과 임계값을 40 토큰(컴파일러에서 구문 분석한 코드 단위)으로 설정하면 컴파일 최적화에 적절한 절충안이
제공됩니다. 벤치마크에 따르면 전체 성능이 9.5% 향상됩니다. 물론 다른 값도 사용해 볼 수 있습니다.

바이너리 크기 또는 컴파일 시간이 증가하면 [YouTrack](https://kotl.in/issue)을 통해 이러한 문제를 보고해 주세요.

## Kotlin/Wasm

이번 릴리스에서는 Kotlin/Wasm 디버깅 및 속성 사용이 개선되었습니다. 이제 개발 빌드에서 사용자 정의 포맷터가
바로 작동하고, DWARF 디버깅을 통해 코드 검사가 용이해집니다. 또한 Provider API는 Kotlin/Wasm 및 Kotlin/JS에서
속성 사용을 간소화합니다.

### 기본적으로 활성화된 사용자 정의 포맷터

이전에는 Kotlin/Wasm 코드로 작업할 때 웹 브라우저에서 디버깅을 개선하기 위해 사용자 정의 포맷터를 [수동으로 구성](whatsnew21#improved-debugging-experience-for-kotlin-wasm)해야 했습니다.

이번 릴리스에서는 사용자 정의 포맷터가 개발 빌드에서 기본적으로 활성화되므로 추가 Gradle
구성이 필요하지 않습니다.

이 기능을 사용하려면 브라우저의 개발자 도구에서 사용자 정의 포맷터가 활성화되어 있는지 확인하기만 하면 됩니다.

* Chrome DevTools에서는 **Settings | Preferences | Console**에서 사용자 정의 포맷터 확인란을 찾으세요.

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Chrome에서 사용자 정의 포맷터 활성화" width="400" style={{verticalAlign: 'middle'}}/>

* Firefox DevTools에서는 **Settings | Advanced settings**에서 사용자 정의 포맷터 확인란을 찾으세요.

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Firefox에서 사용자 정의 포맷터 활성화" width="400" style={{verticalAlign: 'middle'}}/>

이 변경 사항은 주로 Kotlin/Wasm 개발 빌드에 영향을 미칩니다. 프로덕션 빌드에 대한 특정 요구 사항이 있는 경우
Gradle 구성을 적절히 조정해야 합니다. 이렇게 하려면 `wasmJs {}` 블록에 다음 컴파일러 옵션을 추가하세요.

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

Kotlin 2.1.20에서는 Kotlin/Wasm에서 DWARF(임의 레코드 형식으로 디버깅)에 대한 지원을 도입했습니다.

이 변경 사항을 통해 Kotlin/Wasm 컴파일러는 생성된 WebAssembly(Wasm) 바이너리에 DWARF 데이터를 포함할 수 있습니다.
많은 디버거와 가상 머신이 이 데이터를 읽어 컴파일된 코드에 대한 통찰력을 제공할 수 있습니다.

DWARF는 주로 독립 실행형 Wasm 가상 머신(VM) 내부에서 Kotlin/Wasm 애플리케이션을 디버깅하는 데 유용합니다. 이
기능을 사용하려면 Wasm VM과 디버거가 DWARF를 지원해야 합니다.

DWARF 지원을 통해 Kotlin/Wasm 애플리케이션을 단계별로 실행하고, 변수를 검사하고, 코드 통찰력을 얻을 수 있습니다. 이
기능을 활성화하려면 다음 컴파일러 옵션을 사용하세요.

```bash
-Xwasm-generate-dwarf
```
### Kotlin/Wasm 및 Kotlin/JS 속성에 대한 Provider API로의 마이그레이션

이전에는 Kotlin/Wasm 및 Kotlin/JS 확장 기능의 속성이 가변적(`var`)이었고 빌드 스크립트에서 직접 할당되었습니다.

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

이제 속성이 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html)를 통해 노출되므로
`.set()` 함수를 사용하여 값을 할당해야 합니다.

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API는 값이 지연 계산되고 작업 종속성과 적절하게 통합되어 빌드 성능을 향상시킵니다.

이 변경 사항으로 인해 직접 속성 할당은 `NodeJsEnvSpec` 및 `YarnRootEnvSpec`과 같은 `*EnvSpec` 클래스 대신 더 이상 사용되지 않습니다.

또한 혼동을 피하기 위해 여러 별칭 작업이 제거되었습니다.

| 더 이상 사용되지 않는 작업        | 대체                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 또는 `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` 또는 `jsBrowserDistribution`         |

빌드 스크립트에서 Kotlin/JS 또는 Kotlin/Wasm만 사용하는 경우 Gradle이 할당을 자동으로 처리하므로 작업이 필요하지 않습니다.

그러나 Kotlin Gradle Plugin을 기반으로 하는 플러그인을 유지 관리하고 플러그인이 `kotlin-dsl`을 적용하지 않는 경우
`.set()` 함수를 사용하도록 속성 할당을 업데이트해야 합니다.

## Gradle

Kotlin 2.1.20은 Gradle 7.6.3부터 8.11까지 완전히 호환됩니다. 최신 Gradle
릴리스까지 Gradle 버전을 사용할 수도 있습니다. 그러나 이렇게 하면 더 이상 사용되지 않는 경고가 발생할 수 있고
일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

이 버전의 Kotlin에는 Gradle의 Isolated Projects와의 Kotlin Gradle 플러그인 호환성뿐만 아니라 사용자 정의 Gradle
게시 변형에 대한 지원도 포함되어 있습니다.

### Gradle의 Isolated Projects와 호환되는 Kotlin Gradle 플러그인

:::note
이 기능은 현재 Gradle에서 사전 알파 상태입니다. JS 및 Wasm 타겟은 현재 지원되지 않습니다.
Gradle 버전 8.10 이상에서 평가 목적으로만 사용하세요.

Kotlin 2.1.0부터 프로젝트에서 [Gradle의 Isolated Projects 기능 미리보기](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)를 사용할 수 있습니다.

이전에는 Isolated Projects 기능과 호환되도록 프로젝트를 만들려면 Kotlin Gradle 플러그인을 구성해야 했습니다. Kotlin 2.1.20에서는 이 추가 단계가 더 이상 필요하지 않습니다.

이제 Isolated Projects 기능을 활성화하려면 [시스템 속성을 설정](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)하기만 하면 됩니다.

Gradle의 Isolated Projects 기능은 멀티플랫폼 프로젝트와 JVM 또는 Android 타겟만 포함하는 프로젝트 모두에 대한 Kotlin Gradle 플러그인에서 지원됩니다.

특히 멀티플랫폼 프로젝트의 경우 업그레이드 후 Gradle 빌드에 문제가 발생하면 다음을 추가하여 새로운 Kotlin Gradle 플러그인 동작을 옵트아웃할 수 있습니다.

```none
kotlin.kmp.isolated-projects.support=disable
```

그러나 멀티플랫폼 프로젝트에서 이 Gradle 속성을 사용하는 경우 Isolated Projects 기능을 사용할 수 없습니다.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에서 이 기능에 대한 경험을 알려주세요.

### 사용자 정의 Gradle 게시 변형 추가에 대한 지원

Kotlin 2.1.20에서는 사용자 정의 [Gradle 게시 변형](https://docs.gradle.org/current/userguide/variant_attributes.html) 추가에 대한 지원을 도입했습니다.
이 기능은 멀티플랫폼 프로젝트와 JVM을 타겟팅하는 프로젝트에서 사용할 수 있습니다.

이 기능으로 기존 Gradle 변형을 수정할 수 없습니다.

:::

이 기능은 [Experimental](components-stability#stability-levels-explained) 상태입니다.
옵트인하려면 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 어노테이션을 사용하세요.

사용자 정의 Gradle 게시 변형을 추가하려면 `adhocSoftwareComponent()` 함수를 호출하세요. 이 함수는 Kotlin DSL에서 구성할 수 있는 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html)의 인스턴스를 반환합니다.

```kotlin
plugins {
    // JVM 및 멀티플랫폼만 지원됩니다.
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
            // AdhocSoftwareComponent API를 사용하여 사용자 정의 변형을 여기에 추가합니다.
        }
    }
}
```

:::tip
변형에 대한 자세한 내용은 Gradle의 [게시 사용자 지정 가이드](https://docs.gradle.org/current/userguide/publishing_customization.html)를 참조하세요.

:::

## 표준 라이브러리

이번 릴리스에서는 표준 라이브러리에 새로운 Experimental 기능인 공통 atomic 타입, 향상된 UUID 지원 및 새로운 시간 추적 기능을 제공합니다.

### 공통 atomic 타입

Kotlin 2.1.20에서는 스레드 안전 작업을 위한 공유된 플랫폼 독립적인 코드를 활성화하여 표준 라이브러리의 `kotlin.concurrent.atomics`
패키지에 공통 atomic 타입을 도입하고 있습니다. 이를 통해 소스 세트에서 atomic 종속 논리를 복제할 필요 없이 Kotlin
Multiplatform 프로젝트에 대한 개발이 간소화됩니다.

`kotlin.concurrent.atomics` 패키지 및 해당 속성은 [Experimental](components-stability#stability-levels-explained) 상태입니다.
옵트인하려면 `@OptIn(ExperimentalAtomicApi::class)` 어노테이션 또는 컴파일러 옵션 `-opt-in=kotlin.ExperimentalAtomicApi`를 사용하세요.

다음은 여러 스레드에서 처리된 항목을 안전하게 계산하기 위해 `AtomicInt`를 사용하는 방법을 보여주는 예입니다.

```kotlin
// 필요한 라이브러리 가져오기
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 처리된 항목에 대한 atomic 카운터 초기화
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 여러 코루틴에서 처리하기 위해 항목을 청크로 분할
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("스레드 ${Thread.currentThread()}에서 $item 처리")
                    processedItems += 1 // atomic으로 카운터 증가
                }
            }
         }
    }

    // 총 처리된 항목 수 인쇄
    println("총 처리된 항목: ${processedItems.load()}")
}
```

Kotlin의 atomic 타입과 Java의 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
atomic 타입 간의 원활한 상호 운용성을 활성화하기 위해 API는 `.asJavaAtomic()` 및 `.asKotlinAtomic()` 확장 함수를 제공합니다. JVM에서 Kotlin
atomics와 Java atomics는 런타임에 동일한 타입이므로 오버헤드 없이 Java atomics를 Kotlin atomics로 변환하거나 그 반대로 변환할 수 있습니다.

다음은 Kotlin과 Java atomic 타입이 함께 작동하는 방식을 보여주는 예입니다.

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

### UUID 구문 분석, 포맷팅 및 비교 가능성 변경 사항

JetBrains 팀은 [2.0.20에서 표준 라이브러리에 도입된](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library) UUID에 대한 지원을 계속 개선하고 있습니다.

이전에는 `parse()` 함수가 16진수-대시 형식의 UUID만 허용했습니다. Kotlin 2.1.20에서는
`parse()`를 사용하여 16진수-대시 및 일반 16진수(대시 없음) 형식 _모두_에 사용할 수 있습니다.

또한 이번 릴리스에서는 16진수-대시 형식으로 작업하는 데 특정한 함수를 도입했습니다.

* `parseHexDash()`는 16진수-대시 형식에서 UUID를 구문 분석합니다.
* `toHexDashString()`은 `Uuid`를 16진수-대시 형식의 `String`으로 변환합니다(`toString()`의 기능을 반영).

이러한 함수는 이전에 16진수 형식으로 도입된 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
및 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)와 유사하게 작동합니다. 구문 분석 및 포맷팅 기능에 대한 명시적 이름 지정은
코드 명확성과 UUID에 대한 전반적인 경험을 향상시켜야 합니다.

Kotlin의 UUID는 이제 `Comparable`입니다. Kotlin 2.1.20부터 `Uuid`
타입의 값을 직접 비교하고 정렬할 수 있습니다. 이를 통해 `<` 및 `>` 연산자와 `Comparable` 타입 또는 해당 컬렉션에만 사용할 수 있는 표준 라이브러리 확장 기능(예: `sorted()`)을 사용할 수 있으며 `Comparable`
인터페이스가 필요한 모든 함수 또는 API에 UUID를 전달할 수도 있습니다.

표준 라이브러리의 UUID 지원은 여전히 [Experimental](components-stability#stability-levels-explained) 상태입니다.
옵트인하려면 `@OptIn(ExperimentalUuidApi::class)` 어노테이션 또는 컴파일러 옵션 `-opt-in=kotlin.uuid.ExperimentalUuidApi`를 사용하세요.

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse()는 일반 16진수 형식의 UUID를 허용합니다.
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 16진수-대시 형식으로 변환합니다.
    val hexDashFormat = uuid.toHexDashString()
 
    // 16진수-대시 형식으로 UUID 출력
    println(hexDashFormat)

    // UUID를 오름차순으로 출력
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

Kotlin 2.1.20부터 표준 라이브러리는 특정 시점을 나타내는 기능을 제공합니다. 이 기능은
이전에 공식 Kotlin 라이브러리인 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)에서만 사용할 수 있었습니다.

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 인터페이스가
`kotlin.time.Clock`으로 표준 라이브러리에 도입되었고 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/)
클래스가 `kotlin.time.Instant`로 도입되었습니다. 이러한 개념은 보다 복잡한 달력 및 시간대 기능과 비교하여 특정 시점에만 관련되어 있으므로 표준 라이브러리의 `time` 패키지와 자연스럽게 일치합니다. 이러한 복잡한 기능은 `kotlinx-datetime`에 남아 있습니다.

`Instant`와 `Clock`은 시간대 또는 날짜를 고려하지 않고 정확한 시간 추적이 필요한 경우에 유용합니다. 예를 들어
타임스탬프가 있는 이벤트를 기록하고, 두 시점 간의 기간을 측정하고, 시스템 프로세스의 현재 시점을 얻기 위해 사용할 수 있습니다.

다른 언어와의 상호 운용성을 제공하기 위해 추가 변환기 함수를 사용할 수 있습니다.

* `.toKotlinInstant()`는 시간 값을 `kotlin.time.Instant` 인스턴스로 변환합니다.
* `.toJavaInstant()`는 `kotlin.time.Instant` 값을 `java.time.Instant` 값으로 변환합니다.
* `Instant.toJSDate()`는 `kotlin.time.Instant` 값을 JS `Date` 클래스의 인스턴스로 변환합니다. 이 변환은
  정확하지 않습니다. JS는 날짜를 나타내기 위해 밀리초 정밀도를 사용하는 반면 Kotlin은 나노초 해상도를 허용합니다.

표준 라이브러리의 새로운 시간 기능은 여전히 [Experimental](components-stability#stability-levels-explained) 상태입니다.
옵트인하려면 `@OptIn(ExperimentalTime::class)` 어노테이션을 사용하세요.

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

## Compose 컴파일러

2.1.20에서 Compose 컴파일러는 이전 릴리스에서 도입된 `@Composable` 함수에 대한 일부 제한 사항을 완화합니다.
또한 Compose 컴파일러 Gradle 플러그인은 기본적으로 소스 정보를 포함하도록 설정되어 모든 플랫폼에서 Android와 동작을 일치시킵니다.

### open `@Composable` 함수에서 기본 인수에 대한 지원

컴파일러는 이전에 open `@Composable` 함수의 기본 인수를 잘못된 컴파일러 출력으로 인해 런타임에 충돌이 발생할 수 있으므로 제한했습니다. 기본 문제가 해결되었으며 Kotlin 2.1.20 이상과 함께 사용하는 경우 기본 인수가 완전히 지원됩니다.

Compose 컴파일러는 [버전 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) 이전에 open 함수에서 기본 인수를 허용했으므로 지원은 프로젝트 구성에 따라 달라집니다.

* open composable 함수가 Kotlin 버전 2.1.20 이상으로 컴파일되면 컴파일러는 기본 인수에 대한 올바른 래퍼를 생성합니다. 여기에는 1.5.8 이전 바이너리와 호환되는 래퍼가 포함되어 있어 다운스트림 라이브러리도 이 open 함수를 사용할 수 있습니다.
* open composable 함수가 2.1.20 이전의 Kotlin으로 컴파일되면 Compose는 호환성 모드를 사용합니다. 이로 인해 런타임 충돌이 발생할 수 있습니다. 호환성 모드를 사용하는 경우 컴파일러는 잠재적인 문제를 강조 표시하기 위해 경고를 발생시킵니다.

### 최종 재정의된 함수를 다시 시작할 수 있습니다.

가상 함수(`open` 및 `abstract`의 재정의, 인터페이스 포함)는 [2.1.0 릴리스에서 다시 시작할 수 없도록 강제되었습니다](whatsnew21#changes-to-open-and-overridden-composable-functions).
이 제한은 이제 최종 클래스의 멤버이거나 `final` 자체인 함수에 대해 완화되었습니다. 이러한 함수는 평소와 같이 다시 시작되거나 건너뜁니다.

Kotlin 2.1.20으로 업그레이드한 후 영향을 받는 함수에서 일부 동작 변경 사항이 관찰될 수 있습니다. 이전 버전에서 다시 시작할 수 없는 논리를 강제하려면 `@NonRestartableComposable` 어노테이션을 함수에 적용하세요.

### `ComposableSingletons`가 공용 API에서 제거되었습니다.

`ComposableSingletons`는 `@Composable` 람다를 최적화할 때 Compose 컴파일러에서 생성하는 클래스입니다. 매개변수를 캡처하지 않는 람다는 한 번 할당되고 클래스의 속성에 캐시되어 런타임 중에 할당이 저장됩니다. 클래스는 내부 표시 유형으로 생성되며 컴파일 단위(일반적으로 파일) 내에서 람다를 최적화하기 위한 것입니다.

그러나 이 최적화는 `inline` 함수 본문에도 적용되어 싱글톤 람다 인스턴스가 공용 API로 유출되었습니다. 이 문제를 해결하기 위해 2.1.20부터 `@Composable` 람다는 더 이상 인라인 함수 내에서 싱글톤으로 최적화되지 않습니다. 동시에 Compose 컴파일러는 이전 모델에서 컴파일된 모듈에 대한 바이너리 호환성을 지원하기 위해 인라인 함수에 대한 싱글톤 클래스 및 람다를 계속 생성합니다.

### 기본적으로 포함된 소스 정보

Compose 컴파일러 Gradle 플러그인은 이미 Android에서 [소스 정보 포함](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)
기능이 기본적으로 활성화되어 있습니다. Kotlin 2.1.20부터 이 기능은 모든 플랫폼에서 기본적으로 활성화됩니다.

`freeCompilerArgs`를 사용하여 이 옵션을 설정했는지 확인하세요. 이 메서드는 플러그인과 함께 사용하면 빌드가 실패할 수 있습니다. 옵션이 효과적으로 두 번 설정되기 때문입니다.

## 주요 변경 사항 및 더 이상 사용되지 않는 기능

* Kotlin Multiplatform을 Gradle의 향후 변경 사항과 맞추기 위해 `withJava()` 함수를 단계적으로 폐지하고 있습니다.
  [Java 소스 세트는 이제 기본적으로 생성됩니다](multiplatform-compatibility-guide#java-source-sets-created-by-default).

* JetBrains 팀은 `kotlin-android-extensions` 플러그인 폐지를 진행하고 있습니다. 프로젝트에서 사용하려고 하면 이제 구성 오류가 발생하고 플러그인 코드가 실행되지 않습니다.

* 레거시 `kotlin.incremental.classpath.snapshot.enabled` 속성이 Kotlin Gradle 플러그인에서 제거되었습니다.
  이 속성은 JVM에서 기본 제공 ABI 스냅샷으로 대체할 수 있는 기회를 제공하는 데 사용되었습니다. 이제 플러그인은
  불필요한 재컴파일을 감지하고 방지하기 위해 다른 방법을 사용하므로 속성이 더 이상 사용되지 않습니다.

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 적용되었습니다.

### 개편 및 새로운 페이지

* [Kotlin 로드맵](roadmap) – 언어 및 생태계 발전에 대한 Kotlin의 우선 순위가 업데이트된 목록을 참조하세요.
* [Gradle 모범 사례](gradle-best-practices) 페이지 – Gradle을 최적화하기 위한 필수 모범 사례를 배우세요.
  빌드를 수행하고 성능을 향상시킵니다.
* [Compose Multiplatform 및 Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html)
  – 두 UI 프레임워크 간의 관계에 대한 개요입니다.
* [Kotlin Multiplatform 및 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html)
  – 두 가지 인기 있는 크로스 플랫폼 프레임워크의 비교를 참조하세요.
* [C와의 상호 운용성](native-c-interop) – C와의 Kotlin 상호 운용성에 대한 자세한 내용을 살펴보세요.
* [숫자](numbers) – 숫자를 나타내기 위한 다양한 Kotlin 타입에 대해 알아보세요.

### 새롭고 업데이트된 튜토리얼

* [Maven Central에 라이브러리 게시](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
  – 가장 인기 있는 Maven 리포지토리에 KMP 라이브러리 아티팩트를 게시하는 방법을 알아보세요.
* [동적 라이브러리로서의 Kotlin/Native](native-dynamic-libraries) – 동적 Kotlin 라이브러리를 만드세요.
* [Apple 프레임워크로서의 Kotlin/Native](apple-framework) – macOS 및 iOS에서 Swift/Objective-C 애플리케이션에서 Kotlin/Native 코드를 사용하는 자체 프레임워크를 만드세요.

## Kotlin 2.1.20으로 업데이트하는 방법

IntelliJ IDEA 2023.3 및 Android Studio Iguana(2023.2.1) Canary 15부터 Kotlin 플러그인은
IDE에 포함된 번들 플러그인으로 배포됩니다. 즉, JetBrains Marketplace에서 더 이상 플러그인을 설치할 수 없습니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전 변경](releases#update-to-a-new-kotlin-version)
을 2.1.20으로 변경하세요.