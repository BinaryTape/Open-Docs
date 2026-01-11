[//]: # (title: Kotlin 1.9.20의 새로운 기능)

_[릴리스: 2023년 11월 1일](releases.md#release-details)_

Kotlin 1.9.20 릴리스가 나왔습니다. [모든 타겟을 위한 K2 컴파일러가 이제 베타(Beta) 단계에 진입했습니다](#new-kotlin-k2-compiler-updates)하며, [Kotlin Multiplatform이 이제 안정화(Stable)되었습니다](#kotlin-multiplatform-is-stable). 이 외에도 주요 내용은 다음과 같습니다:

*   [멀티플랫폼 프로젝트 설정을 위한 새로운 기본 계층 템플릿](#template-for-configuring-multiplatform-projects)
*   [Kotlin Multiplatform에서 Gradle 설정 캐시(configuration cache) 완벽 지원](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [Kotlin/Native에서 커스텀 메모리 할당자(memory allocator) 기본 활성화](#custom-memory-allocator-enabled-by-default)
*   [Kotlin/Native에서 가비지 컬렉터(garbage collector) 성능 향상](#performance-improvements-for-the-garbage-collector)
*   [Kotlin/Wasm의 새로운 타겟 및 타겟 이름 변경](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [Kotlin/Wasm 표준 라이브러리의 WASI API 지원](#support-for-the-wasi-api-in-the-standard-library)

다음 영상에서 업데이트에 대한 간략한 개요를 확인할 수 있습니다:

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20의 새로운 기능"/>

## IDE 지원

1.9.20을 지원하는 Kotlin 플러그인은 다음에서 사용할 수 있습니다:

| IDE            | 지원 버전                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> IntelliJ IDEA 2023.3.x 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 자동으로 포함되고 업데이트됩니다. 프로젝트의 Kotlin 버전만 업데이트하면 됩니다.
>
{style="note"}

## 새로운 Kotlin K2 컴파일러 업데이트

JetBrains의 Kotlin 팀은 새로운 K2 컴파일러의 안정화 작업을 계속하고 있습니다. 이 컴파일러는 주요 성능 향상을 가져오고, 새로운 언어 기능 개발 속도를 높이며, Kotlin이 지원하는 모든 플랫폼을 통합하고, 멀티플랫폼 프로젝트를 위한 더 나은 아키텍처를 제공할 것입니다.

K2는 현재 모든 타겟에서 **베타(Beta)** 상태입니다. [릴리스 블로그 게시물에서 자세히 읽어보기](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasm 지원

이번 릴리스부터 Kotlin/Wasm은 새로운 K2 컴파일러를 지원합니다.
[프로젝트에서 활성화하는 방법을 알아보세요](#how-to-enable-the-kotlin-k2-compiler).

### K2와 함께 kapt 컴파일러 플러그인 미리보기

> kapt 컴파일러 플러그인의 K2 지원은 [Experimental](components-stability.md) (실험적 기능)입니다. 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

1.9.20에서는 K2 컴파일러와 함께 [kapt 컴파일러 플러그인](kapt.md)을 사용할 수 있습니다.
프로젝트에서 K2 컴파일러를 사용하려면 `gradle.properties` 파일에 다음 옵션을 추가하세요:

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

또는 다음 단계를 완료하여 kapt에 K2를 활성화할 수 있습니다:
1.  `build.gradle.kts` 파일에서 [언어 버전](gradle-compiler-options.md#example-of-setting-languageversion)을 `2.0`으로 설정하세요.
2.  `gradle.properties` 파일에 `kapt.use.k2=true`를 추가하세요.

K2 컴파일러와 함께 kapt를 사용할 때 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### Kotlin K2 컴파일러 활성화 방법

#### Gradle에서 K2 활성화

Kotlin K2 컴파일러를 활성화하고 테스트하려면 다음 컴파일러 옵션과 함께 새 언어 버전을 사용하세요:

```bash
-language-version 2.0
```

`build.gradle.kts` 파일에 지정할 수 있습니다:

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

#### Maven에서 K2 활성화

Kotlin K2 컴파일러를 활성화하고 테스트하려면 `pom.xml` 파일의 `<project/>` 섹션을 업데이트하세요:

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### IntelliJ IDEA에서 K2 활성화

IntelliJ IDEA에서 Kotlin K2 컴파일러를 활성화하고 테스트하려면 **Settings** | **Build, Execution, Deployment** |
**Compiler** | **Kotlin Compiler**로 이동하여 **언어 버전 (Language Version)** 필드를 `2.0 (experimental)`으로 업데이트하세요.

### 새로운 K2 컴파일러에 대한 피드백 남기기

어떤 피드백이라도 감사히 받겠습니다!

*   Kotlin Slack에서 K2 개발자에게 직접 피드백을 제공하세요. [초대받아](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
*   새로운 K2 컴파일러 사용 중 발생한 문제는 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.
*   JetBrains가 K2 사용에 대한 익명 데이터를 수집하도록 [사용 통계 전송 옵션](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)을 활성화하세요.

## Kotlin/JVM

버전 1.9.20부터 컴파일러는 Java 21 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

## Kotlin/Native

Kotlin 1.9.20에는 새로운 메모리 할당자 기본 활성화가 적용된 안정적인 메모리 관리자, 가비지 컬렉터 성능 향상 및 기타 업데이트가 포함되어 있습니다:

*   [커스텀 메모리 할당자 기본 활성화](#custom-memory-allocator-enabled-by-default)
*   [가비지 컬렉터 성능 향상](#performance-improvements-for-the-garbage-collector)
*   [`klib` 아티팩트의 점진적 컴파일](#incremental-compilation-of-klib-artifacts)
*   [라이브러리 연결(linkage) 문제 관리](#managing-library-linkage-issues)
*   [클래스 생성자 호출 시 컴패니언 객체 초기화](#companion-object-initialization-on-class-constructor-calls)
*   [모든 cinterop 선언에 대한 옵트인(opt-in) 요구 사항](#opt-in-requirement-for-all-cinterop-declarations)
*   [링커 오류에 대한 커스텀 메시지](#custom-message-for-linker-errors)
*   [레거시 메모리 관리자 제거](#removal-of-the-legacy-memory-manager)
*   [타겟 티어(tier) 정책 변경](#change-to-our-target-tiers-policy)

### 커스텀 메모리 할당자 기본 활성화

Kotlin 1.9.20에는 새로운 메모리 할당자가 기본으로 활성화되어 제공됩니다. 이 할당자는 이전 기본 할당자인 `mimalloc`을 대체하도록 설계되었으며, 가비지 컬렉션을 더 효율적으로 만들고 [Kotlin/Native 메모리 관리자](native-memory-manager.md)의 런타임 성능을 향상시킵니다.

새로운 커스텀 할당자는 시스템 메모리를 페이지로 나누어 순차적으로 독립적인 스위핑(sweeping)을 허용합니다. 각 할당은 페이지 내의 메모리 블록이 되며, 페이지는 블록 크기를 추적합니다. 다양한 페이지 유형은 여러 할당 크기에 최적화되어 있습니다. 메모리 블록의 순차적인 배열은 할당된 모든 블록을 효율적으로 반복할 수 있도록 합니다.

스레드가 메모리를 할당할 때, 할당 크기에 따라 적절한 페이지를 찾습니다. 스레드는 다양한 크기 범주에 대한 페이지 세트를 유지합니다. 일반적으로 주어진 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다. 그렇지 않으면 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나, 스위핑이 필요하거나, 먼저 생성해야 할 수 있습니다.

새로운 할당자는 여러 개의 독립적인 할당 공간을 동시에 허용하여, Kotlin 팀이 성능을 더욱 향상시키기 위해 다양한 페이지 레이아웃을 실험할 수 있도록 할 것입니다.

#### 커스텀 메모리 할당자 활성화 방법

Kotlin 1.9.20부터 새로운 메모리 할당자가 기본으로 설정됩니다. 추가 설정은 필요 없습니다.

메모리 소비가 높다고 판단되면, Gradle 빌드 스크립트에서 `-Xallocator=mimalloc` 또는 `-Xallocator=std` 옵션을 사용하여 `mimalloc` 또는 시스템 할당자로 다시 전환할 수 있습니다. 새로운 메모리 할당자 개선에 도움을 주시려면 [YouTrack](https://kotl.in/issue)에 해당 문제를 보고해 주세요.

새로운 할당자 설계에 대한 기술적인 내용은 이 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)를 참조하세요.

### 가비지 컬렉터 성능 향상

Kotlin 팀은 새로운 Kotlin/Native 메모리 관리자의 성능과 안정성을 지속적으로 개선하고 있습니다. 이번 릴리스에서는 가비지 컬렉터(GC)에 몇 가지 중요한 변경 사항이 적용되었으며, 1.9.20의 주요 내용은 다음과 같습니다:

*   [GC 일시 중지 시간 단축을 위한 완전 병렬 마크](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
*   [할당 성능 향상을 위해 메모리를 큰 청크로 추적](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### GC 일시 중지 시간 단축을 위한 완전 병렬 마크

이전에는 기본 가비지 컬렉터가 부분적인 병렬 마크만 수행했습니다. 뮤테이터(mutator) 스레드가 일시 중지되면, 스레드 로컬 변수 및 호출 스택과 같은 자체 루트에서 GC 시작을 마크했습니다. 그 동안 별도의 GC 스레드는 전역 루트와, 네이티브 코드를 활발히 실행 중이어서 일시 중지되지 않은 모든 뮤테이터의 루트를 마크하는 역할을 했습니다.

이러한 접근 방식은 전역 객체의 수가 제한적이고 뮤테이터 스레드가 Kotlin 코드를 실행하는 실행 가능 상태에서 상당한 시간을 보내는 경우에 잘 작동했습니다. 하지만 일반적인 iOS 애플리케이션의 경우는 그렇지 않습니다.

이제 GC는 일시 중지된 뮤테이터, GC 스레드 및 선택적 마커 스레드를 결합하여 마크 큐를 처리하는 완전 병렬 마크를 사용합니다. 기본적으로 마킹(marking) 프로세스는 다음을 통해 수행됩니다:

*   일시 중지된 뮤테이터. 자신의 루트를 처리한 후 코드를 활발히 실행하지 않을 때 유휴 상태로 있는 대신, 전체 마킹 프로세스에 기여합니다.
*   GC 스레드. 이는 최소한 하나의 스레드가 마킹을 수행하도록 보장합니다.

이 새로운 접근 방식은 마킹 프로세스를 더 효율적으로 만들어 GC의 일시 중지 시간을 단축합니다.

#### 할당 성능 향상을 위해 메모리를 큰 청크로 추적

이전에는 GC 스케줄러가 각 객체의 할당을 개별적으로 추적했습니다. 그러나 새로운 기본 커스텀 할당자나 `mimalloc` 메모리 할당자 모두 각 객체에 대해 별도의 저장 공간을 할당하지 않습니다. 이들은 여러 객체를 위해 한 번에 큰 영역을 할당합니다.

Kotlin 1.9.20에서는 GC가 개별 객체 대신 영역을 추적합니다. 이는 각 할당에서 수행되는 작업 수를 줄여 작은 객체 할당 속도를 높이고, 따라서 가비지 컬렉터의 메모리 사용량을 최소화하는 데 도움이 됩니다.

### `klib` 아티팩트의 점진적 컴파일

> 이 기능은 [Experimental](components-stability.md#stability-levels-explained) (실험적 기능)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용해야 합니다. [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.9.20은 Kotlin/Native를 위한 새로운 컴파일 시간 최적화를 도입합니다. `klib` 아티팩트의 네이티브 코드 컴파일은 이제 부분적으로 점진적입니다.

디버그 모드에서 Kotlin 소스 코드를 네이티브 바이너리로 컴파일할 때, 컴파일은 두 단계를 거칩니다:

1.  소스 코드는 `klib` 아티팩트로 컴파일됩니다.
2.  `klib` 아티팩트는 의존성과 함께 바이너리로 컴파일됩니다.

두 번째 단계의 컴파일 시간을 최적화하기 위해 팀은 이미 의존성에 대한 컴파일러 캐시를 구현했습니다. 이들은 네이티브 코드로 한 번만 컴파일되며, 그 결과는 바이너리가 컴파일될 때마다 재사용됩니다. 하지만 프로젝트 소스에서 빌드된 `klib` 아티팩트는 프로젝트 변경 시 항상 네이티브 코드로 완전히 재컴파일되었습니다.

새로운 점진적 컴파일을 사용하면, 프로젝트 모듈 변경이 소스 코드의 `klib` 아티팩트 부분 재컴파일만 유발하는 경우, `klib`의 일부만 바이너리로 다시 컴파일됩니다.

점진적 컴파일을 활성화하려면 `gradle.properties` 파일에 다음 옵션을 추가하세요:

```none
kotlin.incremental.native=true
```

문제가 발생하면 [YouTrack](https://kotl.in/issue)에 보고해 주세요.

### 라이브러리 연결(linkage) 문제 관리

이번 릴리스에서는 Kotlin/Native 컴파일러가 Kotlin 라이브러리 내의 연결(linkage) 문제를 처리하는 방식이 개선되었습니다. 오류 메시지에 이제 해시(hash) 대신 시그니처 이름(signature name)을 사용하여 더 읽기 쉬운 선언이 포함되어 문제를 더 쉽게 찾고 해결할 수 있습니다. 다음은 예시입니다:

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 컴파일러는 서드파티 Kotlin 라이브러리 간의 연결(linkage) 문제를 감지하고 런타임에 오류를 보고합니다. 한 서드파티 Kotlin 라이브러리의 작성자가 다른 서드파티 Kotlin 라이브러리가 사용하는 실험적 API에 호환되지 않는 변경을 가하는 경우 이러한 문제가 발생할 수 있습니다.

Kotlin 1.9.20부터 컴파일러는 기본적으로 연결 문제를 자동으로 감지합니다. 프로젝트에서 이 설정을 조정할 수 있습니다:

*   이러한 문제를 컴파일 로그에 기록하려면 `-Xpartial-linkage-loglevel=WARNING` 컴파일러 옵션을 사용하여 경고를 활성화하세요.
*   또한 `-Xpartial-linkage-loglevel=ERROR`를 사용하여 보고된 경고의 심각도를 컴파일 오류로 높일 수도 있습니다. 이 경우 컴파일이 실패하고 컴파일 로그에 모든 오류가 표시됩니다. 이 옵션을 사용하여 연결 문제를 더 자세히 검토하세요.

```kotlin
// An example of passing compiler options in a Gradle build file:
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // To report linkage issues as warnings:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // To raise linkage warnings to errors:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

이 기능에 예상치 못한 문제가 발생하면 언제든지 `-Xpartial-linkage=disable` 컴파일러 옵션을 사용하여 옵트아웃(opt out)할 수 있습니다. 이러한 경우 [이슈 트래커](https://kotl.in/issue)에 주저하지 말고 보고해 주세요.

### 클래스 생성자 호출 시 컴패니언 객체 초기화

Kotlin 1.9.20부터 Kotlin/Native 백엔드는 클래스 생성자에서 컴패니언 객체에 대한 정적 초기화자(static initializer)를 호출합니다:

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // "Hello, Kotlin!" 출력
}
```

이제 이 동작은 Kotlin/JVM과 통일되었습니다. Kotlin/JVM에서는 Java 정적 초기화자의 의미 체계와 일치하는 해당 클래스가 로드(해결)될 때 컴패니언 객체가 초기화됩니다.

이제 이 기능의 구현이 플랫폼 간에 더 일관성이 있어 Kotlin Multiplatform 프로젝트에서 코드를 공유하기가 더 쉬워졌습니다.

### 모든 cinterop 선언에 대한 옵트인(opt-in) 요구 사항

Kotlin 1.9.20부터 `cinterop` 도구가 C 및 Objective-C 라이브러리(예: libcurl, libxml)에서 생성한 모든 Kotlin 선언은 `@ExperimentalForeignApi`로 표시됩니다. 옵트인 어노테이션이 없으면 코드가 컴파일되지 않습니다.

이 요구 사항은 C 및 Objective-C 라이브러리 임포트의 [Experimental](components-stability.md#stability-levels-explained) (실험적 기능) 상태를 반영합니다. 프로젝트의 특정 영역으로 사용을 제한하는 것이 좋습니다. 이는 임포트 안정화 작업이 시작되면 마이그레이션을 더 쉽게 해줄 것입니다.

> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)의 경우, 일부 API에만 `@ExperimentalForeignApi`를 통한 옵트인(opt-in)이 필요합니다. 이 경우, 옵트인 요구 사항에 대한 경고가 표시됩니다.
>
{style="note"}

### 링커 오류에 대한 커스텀 메시지

라이브러리 작성자인 경우, 이제 커스텀 메시지를 통해 사용자가 링커 오류를 해결하도록 도울 수 있습니다.

Kotlin 라이브러리가 C 또는 Objective-C 라이브러리에 의존하는 경우(예: [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 사용), 해당 라이브러리 사용자는 이러한 종속 라이브러리를 로컬 머신에 가지고 있거나 프로젝트 빌드 스크립트에 명시적으로 구성해야 합니다. 그렇지 않은 경우, 사용자는 혼란스러운 "Framework not found" 메시지를 받곤 했습니다.

이제 컴파일 실패 메시지에 특정 지침이나 링크를 제공할 수 있습니다. 이를 위해 `-Xuser-setup-hint` 컴파일러 옵션을 `cinterop`에 전달하거나, `.def` 파일에 `userSetupHint=message` 속성을 추가하세요.

### 레거시 메모리 관리자 제거

[새로운 메모리 관리자](native-memory-manager.md)는 Kotlin 1.6.20에서 도입되어 1.7.20에서 기본값이 되었습니다. 그 이후로 추가 업데이트 및 성능 개선이 이루어졌으며, 이제 안정화되었습니다.

이제 사용 중단 주기를 완료하고 레거시 메모리 관리자를 제거할 때가 되었습니다. 아직 사용 중이라면, `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 제거하고 [마이그레이션 가이드](native-migration-guide.md)에 따라 필요한 변경 사항을 적용하세요.

### 타겟 티어(tier) 정책 변경

저희는 [티어 1 지원](native-target-support.md#tier-1)에 대한 요구 사항을 업그레이드하기로 결정했습니다. Kotlin 팀은 이제 티어 1에 해당하는 타겟에 대해 컴파일러 릴리스 간 소스 및 바이너리 호환성을 제공하는 데 전념하고 있습니다. 또한 컴파일 및 실행이 가능하도록 CI 도구로 정기적으로 테스트되어야 합니다. 현재 티어 1에는 macOS 호스트를 위한 다음 타겟이 포함됩니다:

*   `macosX64`
*   `macosArm64`
*   `iosSimulatorArm64`
*   `iosX64`

Kotlin 1.9.20에서는 이전에 사용이 중단된 여러 타겟도 제거했습니다. 즉,

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxMips32`
*   `linuxMipsel32`

현재 [지원되는 타겟](native-target-support.md)의 전체 목록을 참조하세요.

## Kotlin Multiplatform

Kotlin 1.9.20은 Kotlin Multiplatform의 안정화에 중점을 두고 있으며, 새로운 프로젝트 위자드 및 기타 주목할 만한 기능으로 개발자 경험을 개선하기 위한 새로운 단계를 밟고 있습니다:

*   [Kotlin Multiplatform 안정화(Stable)](#kotlin-multiplatform-is-stable)
*   [멀티플랫폼 프로젝트 구성을 위한 템플릿](#template-for-configuring-multiplatform-projects)
*   [새로운 프로젝트 위자드](#new-project-wizard)
*   [Gradle 설정 캐시(Configuration cache) 완벽 지원](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [Gradle에서 새로운 표준 라이브러리 버전 더 쉽게 구성](#easier-configuration-of-new-standard-library-versions-in-gradle)
*   [서드파티 cinterop 라이브러리 기본 지원](#default-support-for-third-party-cinterop-libraries)
*   [Compose Multiplatform 프로젝트에서 Kotlin/Native 컴파일 캐시 지원](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
*   [호환성 가이드라인](#compatibility-guidelines)

### Kotlin Multiplatform 안정화(Stable)

1.9.20 릴리스는 Kotlin의 발전에 있어 중요한 이정표를 세웠습니다: [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html)이 드디어 안정화(Stable)되었습니다. 이는 이 기술이 프로젝트에서 안전하게 사용될 수 있으며, 프로덕션 준비가 100% 완료되었음을 의미합니다. 또한 Kotlin Multiplatform의 향후 개발은 엄격한 [하위 호환성 규칙](https://kotlinfoundation.org/language-committee-guidelines/)에 따라 계속될 것임을 의미합니다.

Kotlin Multiplatform의 일부 고급 기능은 아직 발전 중임을 유의하세요. 이러한 기능을 사용할 때, 사용 중인 기능의 현재 안정화 상태를 설명하는 경고가 표시될 것입니다. IntelliJ IDEA에서 실험적 기능을 사용하기 전에, **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform**에서 명시적으로 활성화해야 합니다.

*   Kotlin Multiplatform 안정화 및 향후 계획에 대해 자세히 알아보려면 [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)를 방문하세요.
*   안정화 과정에서 어떤 중요한 변경 사항이 있었는지 확인하려면 [멀티플랫폼 호환성 가이드](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)를 참조하세요.
*   이번 릴리스에서 부분적으로 안정화된 Kotlin Multiplatform의 중요한 부분인 [expected 및 actual 선언 메커니즘](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)에 대해 읽어보세요.

### 멀티플랫폼 프로젝트 구성을 위한 템플릿

Kotlin 1.9.20부터 Kotlin Gradle 플러그인은 인기 있는 멀티플랫폼 시나리오를 위해 공유 소스 세트를 자동으로 생성합니다. 프로젝트 설정이 이러한 시나리오 중 하나인 경우, 소스 세트 계층을 수동으로 구성할 필요가 없습니다. 프로젝트에 필요한 타겟을 명시적으로 지정하기만 하면 됩니다.

이제 Kotlin Gradle 플러그인의 새로운 기능인 기본 계층 템플릿 덕분에 설정이 더 쉬워졌습니다. 이것은 플러그인에 내장된 사전 정의된 소스 세트 계층 템플릿입니다. 선언한 타겟에 대해 Kotlin이 자동으로 생성하는 중간 소스 세트를 포함합니다. [전체 템플릿을 참조하세요](#see-the-full-hierarchy-template).

#### 더 쉽게 프로젝트 생성

Android 및 iPhone 기기를 모두 타겟팅하고 Apple 실리콘 MacBook에서 개발되는 멀티플랫폼 프로젝트를 고려해 보세요. 다양한 Kotlin 버전 간에 이 프로젝트가 어떻게 설정되는지 비교해 보세요:

<table>
   <tr>
       <td>Kotlin 1.9.0 및 이전 (표준 설정)</td>
       <td>Kotlin 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting

        val iosMain by creating {
            dependsOn(commonMain)
        }

        val iosArm64Main by getting {
            dependsOn(iosMain)
        }

        val iosSimulatorArm64Main by getting {
            dependsOn(iosMain)
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    // The iosMain source set is created automatically
}
```

</td>
</tr>
</table>

기본 계층 템플릿을 사용하면 프로젝트를 설정하는 데 필요한 상용구 코드의 양이 상당히 줄어드는 것을 확인할 수 있습니다.

코드에서 `androidTarget`, `iosArm64`, `iosSimulatorArm64` 타겟을 선언하면 Kotlin Gradle 플러그인은 템플릿에서 적합한 공유 소스 세트를 찾아 자동으로 생성해 줍니다. 결과적인 계층 구조는 다음과 같습니다:

![An example of the default target hierarchy in use](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

녹색 소스 세트는 실제로 프로젝트에 생성되어 포함되며, 기본 템플릿의 회색 소스 세트는 무시됩니다.

#### 소스 세트에 대한 자동 완성 사용

생성된 프로젝트 구조로 작업하기 쉽게 하기 위해, IntelliJ IDEA는 이제 기본 계층 템플릿으로 생성된 소스 세트에 대해 자동 완성을 제공합니다:

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE completion for source set names" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

또한 Kotlin은 해당 타겟을 선언하지 않아 존재하지 않는 소스 세트에 접근하려고 하면 경고를 표시합니다. 아래 예시에는 JVM 타겟이 없습니다 (동일하지 않은 `androidTarget`만 있음). 하지만 `jvmMain` 소스 세트를 사용해보고 어떤 일이 발생하는지 확인해 봅시다:

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        jvmMain {
        }
    }
}
```

이 경우, Kotlin은 빌드 로그에 경고를 보고합니다:

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 타겟 계층 설정

Kotlin 1.9.20부터 기본 계층 템플릿이 자동으로 활성화됩니다. 대부분의 경우 추가 설정은 필요하지 않습니다.

그러나 1.9.20 이전에 생성된 기존 프로젝트를 마이그레이션하는 경우, 이전에 `dependsOn()` 호출을 사용하여 중간 소스를 수동으로 도입했다면 경고가 발생할 수 있습니다. 이 문제를 해결하려면 다음을 수행하세요:

*   중간 소스 세트가 현재 기본 계층 템플릿에 의해 커버되는 경우, 모든 수동 `dependsOn()` 호출과 `by creating` 구문으로 생성된 소스 세트를 제거하세요.

    모든 기본 소스 세트 목록을 확인하려면 [전체 계층 템플릿](#see-the-full-hierarchy-template)을 참조하세요.

*   기본 계층 템플릿이 제공하지 않는 추가 소스 세트(예: macOS와 JVM 타겟 간에 코드를 공유하는 소스 세트)를 사용하고 싶다면, `applyDefaultHierarchyTemplate()`을 사용하여 템플릿을 명시적으로 다시 적용하고 `dependsOn()`을 사용하여 평소와 같이 추가 소스 세트를 수동으로 구성하여 계층 구조를 조정하세요:

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()

        // Apply the default hierarchy explicitly. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()

        sourceSets {
            // Create an additional jvmAndMacos source set
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }

            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

*   프로젝트에 템플릿에서 생성된 것과 정확히 같은 이름을 가지지만 서로 다른 타겟 세트 간에 공유되는 소스 세트가 이미 있는 경우, 현재 템플릿의 소스 세트 간 기본 `dependsOn` 관계를 수정할 방법이 없습니다.

    이 경우, 기본 계층 템플릿이나 수동으로 생성된 소스 세트 중에서 목적에 맞는 다른 소스 세트를 찾는 방법이 있습니다. 다른 방법은 템플릿에서 완전히 옵트아웃(opt out)하는 것입니다.

    옵트아웃하려면 `gradle.properties`에 `kotlin.mpp.applyDefaultHierarchyTemplate=false`를 추가하고 다른 모든 소스 세트를 수동으로 구성하세요.

    저희는 현재 이러한 경우의 설정 프로세스를 간소화하기 위해 자신만의 계층 템플릿을 생성하기 위한 API를 개발 중입니다.

#### 전체 계층 템플릿 보기 {initial-collapse-state="collapsed" collapsible="true"}

프로젝트가 컴파일될 타겟을 선언하면, 플러그인은 템플릿에서 해당하는 공유 소스 세트를 선택하여 프로젝트에 생성합니다.

![Default hierarchy template](full-template-hierarchy.svg)

> 이 예시는 프로젝트의 프로덕션 부분만 보여주며, `Main` 접미사를 생략했습니다 (예: `commonMain` 대신 `common` 사용). 하지만 `*Test` 소스에서도 모든 것이 동일합니다.
>
{style="tip"}

### 새로운 프로젝트 위자드

JetBrains 팀은 크로스 플랫폼 프로젝트를 생성하는 새로운 방법인 [Kotlin Multiplatform 웹 위자드](https://kmp.jetbrains.com)를 소개합니다.

새로운 Kotlin Multiplatform 위자드의 첫 번째 구현은 가장 인기 있는 Kotlin Multiplatform 사용 사례를 다룹니다. 이전 프로젝트 템플릿에 대한 모든 피드백을 통합하여 아키텍처를 가능한 한 견고하고 신뢰할 수 있게 만들었습니다.

새로운 위자드는 통합된 백엔드와 다양한 프론트엔드를 가질 수 있는 분산 아키텍처를 가지고 있으며, 웹 버전이 첫 단계입니다. 저희는 향후 IDE 버전 구현과 명령줄 도구 생성을 모두 고려하고 있습니다. 웹에서는 항상 위자드의 최신 버전을 사용할 수 있지만, IDE에서는 다음 릴리스를 기다려야 합니다.

새로운 위자드를 사용하면 프로젝트 설정이 그 어느 때보다 쉬워집니다. 모바일, 서버, 데스크톱 개발을 위한 타겟 플랫폼을 선택하여 필요에 맞게 프로젝트를 맞춤 설정할 수 있습니다. 향후 릴리스에서는 웹 개발 지원도 추가할 계획입니다.

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

새로운 프로젝트 위자드는 이제 Kotlin으로 크로스 플랫폼 프로젝트를 생성하는 선호되는 방법입니다. 1.9.20부터 Kotlin 플러그인은 IntelliJ IDEA에서 더 이상 **Kotlin Multiplatform** 프로젝트 위자드를 제공하지 않습니다.

새로운 위자드는 초기 설정을 쉽게 안내하여 온보딩 프로세스를 훨씬 원활하게 만듭니다. 문제가 발생하면 [YouTrack](https://kotl.in/issue)에 보고하여 위자드 사용 경험을 개선하는 데 도움을 주세요.

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="프로젝트 생성" style="block"/>
</a>

### Kotlin Multiplatform에서 Gradle 설정 캐시(Configuration cache) 완벽 지원

이전에는 Kotlin 멀티플랫폼 라이브러리에서 사용할 수 있었던 Gradle 설정 캐시의 [미리보기](whatsnew19.md#preview-of-the-gradle-configuration-cache)를 도입했습니다. 1.9.20에서는 Kotlin Multiplatform 플러그인이 한 단계 더 나아갑니다.

이제 [Kotlin CocoaPods Gradle 플러그인](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)뿐만 아니라 `embedAndSignAppleFrameworkForXcode`와 같이 Xcode 빌드에 필요한 통합 작업에서도 Gradle 설정 캐시를 지원합니다.

이제 모든 멀티플랫폼 프로젝트에서 개선된 빌드 시간을 활용할 수 있습니다. Gradle 설정 캐시는 구성 단계의 결과를 후속 빌드에 재사용하여 빌드 프로세스를 가속화합니다. 자세한 내용과 설정 지침은 [Gradle 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)를 참조하세요.

### Gradle에서 새로운 표준 라이브러리 버전 더 쉽게 구성

멀티플랫폼 프로젝트를 생성하면 표준 라이브러리(`stdlib`)에 대한 의존성이 각 소스 세트에 자동으로 추가됩니다. 이는 멀티플랫폼 프로젝트를 시작하는 가장 쉬운 방법입니다.

이전에는 표준 라이브러리에 대한 의존성을 수동으로 구성하려면 각 소스 세트에 대해 개별적으로 구성해야 했습니다. `kotlin-stdlib:1.9.20`부터는 `commonMain` 루트 소스 세트에서 의존성을 **한 번만** 구성하면 됩니다:

<table>
   <tr>
       <td>표준 라이브러리 버전 1.9.10 및 이전</td>
       <td>표준 라이브러리 버전 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // For the common source set
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // For the JVM source set
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // For the JS source set
        val jsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-js:1.9.10")
            }
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.20")
            }
        }
    }
}
```

</td>
</tr>
</table>

이러한 변경은 표준 라이브러리의 Gradle 메타데이터에 새로운 정보가 포함됨으로써 가능해졌습니다. 이를 통해 Gradle은 다른 소스 세트에 대한 올바른 표준 라이브러리 아티팩트를 자동으로 해결할 수 있습니다.

### 서드파티 cinterop 라이브러리 기본 지원

Kotlin 1.9.20은 [Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 플러그인이 적용된 프로젝트에서 모든 cinterop 의존성에 대해 기본 지원(옵트인 지원 대신)을 추가합니다.

이는 이제 플랫폼별 의존성에 제한받지 않고 더 많은 네이티브 코드를 공유할 수 있음을 의미합니다. 예를 들어, `iosMain` 공유 소스 세트에 [Pod 라이브러리에 대한 의존성](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)을 추가할 수 있습니다.

이전에는 Kotlin/Native 배포판과 함께 제공되는 [플랫폼별 라이브러리](native-platform-libs.md)(예: Foundation, UIKit, POSIX)에서만 작동했습니다. 이제 모든 서드파티 Pod 라이브러리는 기본적으로 공유 소스 세트에서 사용할 수 있습니다. 더 이상 별도의 Gradle 속성을 지정하여 지원할 필요가 없습니다.

### Compose Multiplatform 프로젝트에서 Kotlin/Native 컴파일 캐시 지원

이번 릴리스는 Compose Multiplatform 컴파일러 플러그인과의 호환성 문제를 해결하며, 주로 iOS용 Compose Multiplatform 프로젝트에 영향을 미쳤습니다.

이 문제를 해결하기 위해 `kotlin.native.cacheKind=none` Gradle 속성을 사용하여 캐싱을 비활성화해야 했습니다. 그러나 이 해결 방법은 성능 저하를 초래했습니다: Kotlin/Native 컴파일러에서 캐싱이 작동하지 않아 컴파일 시간이 느려졌습니다.

이제 문제가 해결되었으므로, `gradle.properties` 파일에서 `kotlin.native.cacheKind=none`을 제거하고 Compose Multiplatform 프로젝트에서 개선된 컴파일 시간을 누릴 수 있습니다.

컴파일 시간 개선에 대한 더 많은 팁은 [Kotlin/Native 문서](native-improving-compilation-time.md)를 참조하세요.

### 호환성 가이드라인

프로젝트를 구성할 때, Kotlin Multiplatform Gradle 플러그인과 사용 가능한 Gradle, Xcode, Android Gradle 플러그인(AGP) 버전의 호환성을 확인하세요:

| Kotlin Multiplatform Gradle 플러그인 | Gradle | Android Gradle 플러그인 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 및 이후 | 7.4.2–8.2 | 15.0. 자세한 내용은 아래 참조 |

이번 릴리스부터 Xcode의 권장 버전은 15.0입니다. Xcode 15.0과 함께 제공되는 라이브러리는 완전히 지원되며, Kotlin 코드의 어느 곳에서든 접근할 수 있습니다.

그러나 Xcode 14.3은 대부분의 경우 여전히 작동해야 합니다. 로컬 머신에서 버전 14.3을 사용하는 경우, Xcode 15와 함께 제공되는 라이브러리는 보이지만 접근할 수 없다는 점을 명심하세요.

## Kotlin/Wasm

1.9.20에서 Kotlin Wasm은 안정화 [알파(Alpha) 수준](components-stability.md)에 도달했습니다.

*   [Wasm GC 4단계 및 최종 Opcode와의 호환성](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
*   [새로운 `wasm-wasi` 타겟 및 `wasm` 타겟의 `wasm-js`로 이름 변경](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [표준 라이브러리에서 WASI API 지원](#support-for-the-wasi-api-in-the-standard-library)
*   [Kotlin/Wasm API 개선](#kotlin-wasm-api-improvements)

> Kotlin Wasm은 [Alpha](components-stability.md) (알파 버전)입니다. 언제든지 변경될 수 있습니다. 평가 목적으로만 사용해야 합니다.
>
> [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="note"}

### Wasm GC 4단계 및 최종 Opcode와의 호환성

Wasm GC가 최종 단계로 진행되면서 바이너리 표현에 사용되는 상수 숫자(opcode)에 대한 업데이트가 필요합니다. Kotlin 1.9.20은 최신 opcode를 지원하므로, Wasm 프로젝트를 최신 Kotlin 버전으로 업데이트하는 것을 강력히 권장합니다.
또한 Wasm 환경을 갖춘 최신 버전의 브라우저를 사용하는 것을 권장합니다:
*   Chrome 및 Chromium 기반 브라우저의 경우 119 버전 이상.
*   Firefox의 경우 119 버전 이상. Firefox 119에서는 [Wasm GC를 수동으로 켜야 합니다](wasm-configuration.md).

### 새로운 `wasm-wasi` 타겟 및 `wasm` 타겟의 `wasm-js`로 이름 변경

이번 릴리스에서는 Kotlin/Wasm을 위한 새로운 타겟인 `wasm-wasi`를 소개합니다. 또한 `wasm` 타겟을 `wasm-js`로 변경합니다. Gradle DSL에서는 이 타겟들을 각각 `wasmWasi {}`와 `wasmJs {}`로 사용할 수 있습니다.

프로젝트에서 이 타겟들을 사용하려면 `build.gradle.kts` 파일을 업데이트하세요:

```kotlin
kotlin {
    wasmWasi {
        // ...
    }
    wasmJs {
        // ...
    }
}
```

이전에 도입된 `wasm {}` 블록은 `wasmJs {}` 블록으로 대체되어 사용이 중단되었습니다.

기존 Kotlin/Wasm 프로젝트를 마이그레이션하려면 다음을 수행하세요:
*   `build.gradle.kts` 파일에서 `wasm {}` 블록의 이름을 `wasmJs {}`로 변경하세요.
*   프로젝트 구조에서 `wasmMain` 디렉토리의 이름을 `wasmJsMain`으로 변경하세요.

### 표준 라이브러리에서 WASI API 지원

이번 릴리스에서는 Wasm 플랫폼을 위한 시스템 인터페이스인 [WASI](https://github.com/WebAssembly/WASI)를 지원합니다. WASI 지원은 Kotlin/Wasm을 브라우저 외부(예: 서버 측 애플리케이션)에서 사용하기 더 쉽게 만들어주며, 시스템 리소스에 접근하기 위한 표준화된 API 세트를 제공합니다. 또한 WASI는 외부 리소스 접근 시 또 다른 보안 계층인 역량 기반 보안(capability-based security)을 제공합니다.

Kotlin/Wasm 애플리케이션을 실행하려면 Wasm 가비지 컬렉션(GC)을 지원하는 VM(예: Node.js 또는 Deno)이 필요합니다. Wasmtime, WasmEdge 등은 아직 완전한 Wasm GC 지원을 위해 노력 중입니다.

WASI 함수를 임포트하려면 `@WasmImport` 어노테이션을 사용하세요:

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[전체 예시는 GitHub 리포지토리](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)에서 확인할 수 있습니다.

> `wasmWasi`를 타겟팅하는 동안에는 [JavaScript와의 상호 운용성](wasm-js-interop.md)을 사용할 수 없습니다.
>
{style="note"}

### Kotlin/Wasm API 개선

이번 릴리스는 Kotlin/Wasm API에 몇 가지 편의성 개선을 제공합니다. 예를 들어, DOM 이벤트 리스너에 값을 반환할 필요가 없습니다:

<table>
   <tr>
       <td>1.9.20 이전</td>
       <td>1.9.20에서</td>
   </tr>
   <tr>
<td>

```kotlin
fun main() {
    window.onload = {
        document.body?.sayHello()
        null
    }
}
```

</td>
<td>

```kotlin
fun main() {
    window.onload = { document.body?.sayHello() }
}
```

</td>
</tr>
</table>

## Gradle

Kotlin 1.9.20은 Gradle 6.8.3부터 8.1까지 완전히 호환됩니다. 최신 Gradle 릴리스까지의 Gradle 버전을 사용할 수도 있지만, 그렇게 할 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있다는 점을 유의하세요.

이 버전에는 다음과 같은 변경 사항이 있습니다:
*   [내부 선언에 접근하기 위한 테스트 픽스처(test fixtures) 지원](#support-for-test-fixtures-to-access-internal-declarations)
*   [Konan 디렉토리 경로 구성을 위한 새로운 속성](#new-property-to-configure-paths-to-konan-directories)
*   [Kotlin/Native 작업에 대한 새로운 빌드 보고서 메트릭](#new-build-report-metrics-for-kotlin-native-tasks)

### 내부 선언에 접근하기 위한 테스트 픽스처(test fixtures) 지원

Kotlin 1.9.20에서 Gradle의 `java-test-fixtures` 플러그인을 사용하는 경우, [테스트 픽스처](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)는 이제 주 소스 세트 클래스 내의 `internal` 선언에 접근할 수 있습니다. 또한 모든 테스트 소스는 테스트 픽스처 클래스 내의 `internal` 선언도 볼 수 있습니다.

### Konan 디렉토리 경로 구성을 위한 새로운 속성

Kotlin 1.9.20에서는 `konan.data.dir` Gradle 속성을 사용하여 `~/.konan` 디렉토리 경로를 사용자 지정할 수 있으므로, 환경 변수 `KONAN_DATA_DIR`을 통해 구성할 필요가 없습니다.

또는 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `cinterop` 및 `konanc` 도구를 통해 `~/.konan` 디렉토리에 대한 사용자 지정 경로를 구성할 수 있습니다.

### Kotlin/Native 작업에 대한 새로운 빌드 보고서 메트릭

Kotlin 1.9.20부터 Gradle 빌드 보고서에 Kotlin/Native 작업에 대한 메트릭이 포함됩니다. 다음은 이러한 메트릭을 포함하는 빌드 보고서의 예시입니다:

```none
Total time for Kotlin tasks: 20.81 s (93.1 % of all tasks time)
Time   |% of Kotlin time|Task                            
15.24 s|73.2 %          |:compileCommonMainKotlinMetadata
5.57 s |26.8 %          |:compileNativeMainKotlinMetadata

Task ':compileCommonMainKotlinMetadata' finished in 15.24 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 15.24 s
  Spent time before task action: 0.16 s
  Task action before worker execution: 0.21 s
  Run native in process: 2.70 s
    Run entry point: 2.64 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:17

Task ':compileNativeMainKotlinMetadata' finished in 5.57 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 5.57 s
  Spent time before task action: 0.04 s
  Task action before worker execution: 0.02 s
  Run native in process: 1.48 s
    Run entry point: 1.47 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:32
```

또한 `kotlin.experimental.tryK2` 빌드 보고서는 컴파일된 모든 Kotlin/Native 작업을 포함하고 사용된 언어 버전을 나열합니다:

```none
##### 'kotlin.experimental.tryK2' results #####
:lib:compileCommonMainKotlinMetadata: 2.0 language version
:lib:compileKotlinJvm: 2.0 language version
:lib:compileKotlinIosArm64: 2.0 language version
:lib:compileKotlinIosSimulatorArm64: 2.0 language version
:lib:compileKotlinLinuxX64: 2.0 language version
:lib:compileTestKotlinJvm: 2.0 language version
:lib:compileTestKotlinIosSimulatorArm64: 2.0 language version
:lib:compileTestKotlinLinuxX64: 2.0 language version
##### 100% (8/8) tasks have been compiled with Kotlin 2.0 #####
```

> Gradle 8.0을 사용하는 경우, 특히 Gradle 설정 캐싱이 활성화된 경우 빌드 보고서에 일부 문제가 발생할 수 있습니다. 이는 알려진 문제이며, Gradle 8.1 이상에서 수정되었습니다.
>
{style="note"}

## 표준 라이브러리

Kotlin 1.9.20에서는 [Kotlin/Native 표준 라이브러리가 안정화(Stable)되며](#the-kotlin-native-standard-library-becomes-stable), 몇 가지 새로운 기능이 있습니다:
*   [Enum 클래스 values 제네릭 함수 대체](#replacement-of-the-enum-class-values-generic-function)
*   [Kotlin/JS에서 HashMap 작업 성능 향상](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enum 클래스 values 제네릭 함수 대체

> 이 기능은 [Experimental](components-stability.md#stability-levels-explained) (실험적 기능)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용해야 합니다. [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.9.0에서 enum 클래스의 `entries` 속성이 안정화되었습니다. `entries` 속성은 합성 `values()` 함수를 대체하는 현대적이고 성능이 우수한 기능입니다. Kotlin 1.9.20의 일환으로 제네릭 `enumValues<T>()` 함수를 대체하는 `enumEntries<T>()`가 도입되었습니다.

> `enumValues<T>()` 함수는 여전히 지원되지만, 성능 영향이 적으므로 `enumEntries<T>()` 함수를 대신 사용하는 것이 좋습니다. `enumValues<T>()`를 호출할 때마다 새 배열이 생성되는 반면, `enumEntries<T>()`를 호출할 때마다 동일한 리스트가 반환되므로 훨씬 효율적입니다.
>
{style="tip"}

예시:

```kotlin
enum class RGB { RED, GREEN, BLUE }

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

#### enumEntries 함수 활성화 방법

이 기능을 사용하려면 `@OptIn(ExperimentalStdlibApi)`로 옵트인(opt-in)하고 언어 버전 1.9 이상을 사용하세요. 최신 버전의 Kotlin Gradle 플러그인을 사용하는 경우, 이 기능을 테스트하기 위해 언어 버전을 지정할 필요가 없습니다.

### Kotlin/Native 표준 라이브러리 안정화(Stable)

Kotlin 1.9.0에서 저희는 Kotlin/Native 표준 라이브러리를 안정화 목표에 더 가깝게 만들기 위해 취한 조치들을 [설명했습니다](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization). Kotlin 1.9.20에서는 마침내 이 작업을 완료하고 Kotlin/Native 표준 라이브러리를 안정화(Stable)합니다. 다음은 이번 릴리스의 주요 내용입니다:

*   [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 클래스가 `kotlin.native` 패키지에서 `kotlinx.cinterop` 패키지로 이동했습니다.
*   Kotlin 1.9.0의 일부로 도입된 `ExperimentalNativeApi` 및 `NativeRuntimeApi` 어노테이션에 대한 옵트인(opt-in) 요구 사항 수준이 `WARNING`에서 `ERROR`로 상향 조정되었습니다.
*   Kotlin/Native 컬렉션은 이제 동시 수정(concurrent modification)을 감지합니다. 예를 들어, [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 및 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 컬렉션에서 그렇습니다.
*   `Throwable` 클래스의 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 함수는 이제 `STDOUT` 대신 `STDERR`로 출력합니다.
  > `printStackTrace()`의 출력 형식은 안정화(Stable)되지 않았으며 변경될 수 있습니다.
  >
  {style="warning"}

#### Atomics API 개선

Kotlin 1.9.0에서 저희는 Atomics API가 Kotlin/Native 표준 라이브러리가 안정화될 때 안정화될 준비가 될 것이라고 말씀드렸습니다. Kotlin 1.9.20에는 다음과 같은 추가 변경 사항이 포함되어 있습니다:

*   실험적인 `AtomicIntArray`, `AtomicLongArray`, `AtomicArray<T>` 클래스가 도입되었습니다. 이 새로운 클래스들은 Java의 아토믹 배열(atomic array)과 일관성을 유지하도록 특별히 설계되어, 향후 공통 표준 라이브러리에 포함될 수 있습니다.
  > `AtomicIntArray`, `AtomicLongArray`, `AtomicArray<T>` 클래스는
  > [Experimental](components-stability.md#stability-levels-explained) (실험적 기능)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 사용하려면 `@OptIn(ExperimentalStdlibApi)`로 옵트인(opt-in)하세요. 평가 목적으로만 사용해야 합니다. [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
  >
  {style="warning"}
*   `kotlin.native.concurrent` 패키지에서 Kotlin 1.9.0에서 `WARNING` 사용 중단 수준으로 사용 중단되었던 Atomics API의 사용 중단 수준이 `ERROR`로 상향 조정되었습니다.
*   `kotlin.concurrent` 패키지에서 사용 중단 수준이 `ERROR`였던 [`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 및 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 클래스의 멤버 함수가 제거되었습니다.
*   `AtomicReference` 클래스의 모든 [멤버 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)는 이제 아토믹 내장 함수(atomic intrinsic function)를 사용합니다.

Kotlin 1.9.20의 모든 변경 사항에 대한 자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)을 참조하세요.

### Kotlin/JS에서 HashMap 작업 성능 향상

Kotlin 1.9.20은 Kotlin/JS에서 `HashMap` 작업의 성능을 향상시키고 메모리 사용량을 줄입니다. 내부적으로 Kotlin/JS는 내부 구현을 오픈 어드레싱(open addressing)으로 변경했습니다. 이는 다음과 같은 경우 성능 향상을 확인할 수 있음을 의미합니다:
*   `HashMap`에 새 요소를 삽입할 때.
*   `HashMap`에서 기존 요소를 검색할 때.
*   `HashMap`의 키 또는 값을 반복할 때.

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있었습니다:
*   [JVM Metadata](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 참조 – Kotlin/JVM으로 메타데이터를 파싱하는 방법을 살펴보세요.
*   [시간 측정 가이드](time-measurement.md) – Kotlin에서 시간을 계산하고 측정하는 방법을 알아보세요.
*   [Kotlin 둘러보기](kotlin-tour-welcome.md)의 개선된 컬렉션(Collections) 챕터 – 이론과 실습이 모두 포함된 챕터를 통해 Kotlin 프로그래밍 언어의 기본을 배우세요.
*   [확정적으로 non-nullable한 타입](generics.md#definitely-non-nullable-types) – 확정적으로 non-nullable한 제네릭 타입에 대해 알아보세요.
*   개선된 [배열(Arrays) 페이지](arrays.md) – 배열과 배열을 사용해야 할 때를 알아보세요.
*   [Kotlin Multiplatform의 expected 및 actual 선언](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) – Kotlin Multiplatform의 expected 및 actual 선언 메커니즘에 대해 알아보세요.

## Kotlin 1.9.20 설치

### IDE 버전 확인

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 및 2023.2.x는 Kotlin 플러그인을 1.9.20 버전으로 업데이트하도록 자동으로 제안합니다. IntelliJ IDEA 2023.3에는 Kotlin 1.9.20 플러그인이 포함될 예정입니다.

Android Studio Hedgehog (231) 및 Iguana (232)는 다가오는 릴리스에서 Kotlin 1.9.20을 지원할 예정입니다.

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20)에서 다운로드할 수 있습니다.

### Gradle 설정 구성

Kotlin 아티팩트 및 의존성을 다운로드하려면 `settings.gradle(.kts)` 파일을 업데이트하여 Maven Central 저장소를 사용하도록 하세요:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

저장소가 지정되지 않으면 Gradle은 사용 중단된 JCenter 저장소를 사용하므로 Kotlin 아티팩트에 문제가 발생할 수 있습니다.