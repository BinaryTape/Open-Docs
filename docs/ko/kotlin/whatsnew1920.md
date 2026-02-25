[//]: # (title: Kotlin 1.9.20의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin 멀티플랫폼, JVM, Native, JS, Wasm 업데이트, Gradle 및 Maven 빌드 도구 지원을 포함한 Kotlin 1.9.20 릴리스 노트를 확인해 보세요.</web-summary>

_[출시일: 2023년 11월 1일](releases.md#release-history)_

Kotlin 1.9.20 버전이 출시되었습니다. [모든 타겟에 대한 K2 컴파일러가 이제 Beta 단계](#new-kotlin-k2-compiler-updates)에 진입했으며, [Kotlin 멀티플랫폼이 Stable 단계](#kotlin-multiplatform-is-stable)가 되었습니다. 또한, 이번 릴리스의 주요 하이라이트는 다음과 같습니다:

* [멀티플랫폼 프로젝트 설정을 위한 새로운 기본 계층 구조 템플릿](#template-for-configuring-multiplatform-projects)
* [Kotlin 멀티플랫폼에서 Gradle 구성 캐시 완전 지원](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Native에서 커스텀 메모리 할당자 기본 활성화](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native 가비지 컬렉터의 성능 향상](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm의 새로운 타겟 및 타겟 이름 변경](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 표준 라이브러리의 WASI API 지원](#support-for-the-wasi-api-in-the-standard-library)

아래 비디오에서 업데이트에 대한 짧은 요약을 확인하실 수 있습니다:

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20의 새로운 기능"/>

> Kotlin 출시 주기에 대한 정보는 [Kotlin 출시 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## IDE 지원

1.9.20을 지원하는 Kotlin 플러그인은 다음 IDE에서 사용할 수 있습니다:

| IDE            | 지원 버전                               |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> IntelliJ IDEA 2023.3.x 및 Android Studio Iguana (2023.2.1) Canary 15부터는 Kotlin 플러그인이 자동으로 포함되어 업데이트됩니다. 프로젝트의 Kotlin 버전만 업데이트하면 됩니다.
>
{style="note"}

## 새로운 Kotlin K2 컴파일러 업데이트

JetBrains의 Kotlin 팀은 새로운 K2 컴파일러의 안정화 작업을 계속 진행하고 있습니다. K2 컴파일러는 주요 성능 향상을 가져오고, 새로운 언어 기능 개발 속도를 높이며, Kotlin이 지원하는 모든 플랫폼을 통합하고 멀티플랫폼 프로젝트를 위한 더 나은 아키텍처를 제공할 것입니다.

K2는 현재 모든 타겟에 대해 **Beta** 단계입니다. [릴리스 블로그 포스트에서 더 자세히 읽어보세요](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasm 지원

이번 릴리스부터 Kotlin/Wasm은 새로운 K2 컴파일러를 지원합니다.
[프로젝트에서 활성화하는 방법](#how-to-enable-the-kotlin-k2-compiler)을 알아보세요.

### K2 기반 kapt 컴파일러 플러그인 미리보기

> kapt 컴파일러 플러그인의 K2 지원은 [Experimental](components-stability.md) 단계입니다.
> 옵트인(Opt-in)이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

1.9.20에서는 [kapt 컴파일러 플러그인](kapt.md)을 K2 컴파일러와 함께 사용해 볼 수 있습니다.
프로젝트에서 K2 컴파일러를 사용하려면 `gradle.properties` 파일에 다음 옵션을 추가하세요:

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

또는 다음 단계를 수행하여 kapt에 K2를 활성화할 수 있습니다:
1. `build.gradle.kts` 파일에서 [언어 버전(language version)을 `2.0`으로 설정](gradle-compiler-options.md#example-of-setting-languageversion)합니다.
2. `gradle.properties` 파일에 `kapt.use.k2=true`를 추가합니다.

K2 컴파일러와 함께 kapt를 사용하는 동안 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### Kotlin K2 컴파일러 활성화 방법

#### Gradle에서 K2 활성화

Kotlin K2 컴파일러를 활성화하고 테스트하려면 다음 컴파일러 옵션과 함께 새로운 언어 버전을 사용하세요:

```bash
-language-version 2.0
```

`build.gradle.kts` 파일에 다음과 같이 지정할 수 있습니다:

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
**Compiler** | **Kotlin Compiler**로 이동하여 **Language Version** 필드를 `2.0 (experimental)`으로 업데이트하세요.

### 새로운 K2 컴파일러에 대한 의견을 남겨주세요

여러분의 의견을 기다리고 있습니다!

* Kotlin Slack에서 K2 개발자에게 직접 의견을 전달해 주세요. [초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)를 통해 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* 새로운 K2 컴파일러에서 직면한 문제는 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.
* JetBrains가 K2 사용에 대한 익명 데이터를 수집할 수 있도록 [사용 통계 전송 옵션을 활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)해 주세요.

## Kotlin/JVM

1.9.20 버전부터 컴파일러는 Java 21 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

## Kotlin/Native

Kotlin 1.9.20에는 커스텀 메모리 할당자가 기본으로 활성화된 Stable 메모리 관리자, 가비지 컬렉터의 성능 향상 및 기타 업데이트가 포함되어 있습니다:

* [커스텀 메모리 할당자 기본 활성화](#custom-memory-allocator-enabled-by-default)
* [가비지 컬렉터의 성능 향상](#performance-improvements-for-the-garbage-collector)
* [`klib` 아티팩트의 증분 컴파일](#incremental-compilation-of-klib-artifacts)
* [라이브러리 연결(Linkage) 문제 관리](#managing-library-linkage-issues)
* [클래스 생성자 호출 시 컴패니언 객체 초기화](#companion-object-initialization-on-class-constructor-calls)
* [모든 cinterop 선언에 대한 옵트인 요구 사항](#opt-in-requirement-for-all-cinterop-declarations)
* [링커 오류에 대한 커스텀 메시지](#custom-message-for-linker-errors)
* [레거시 메모리 관리자 제거](#removal-of-the-legacy-memory-manager)
* [타겟 티어(target tiers) 정책 변경](#change-to-our-target-tiers-policy)

### 커스텀 메모리 할당자 기본 활성화

Kotlin 1.9.20에서는 새로운 메모리 할당자가 기본으로 활성화됩니다. 이는 가비지 컬렉션의 효율성을 높이고 [Kotlin/Native 메모리 관리자](native-memory-manager.md)의 런타임 성능을 개선하기 위해 이전의 기본 할당자인 `mimalloc`을 대체하도록 설계되었습니다.

새로운 커스텀 할당자는 시스템 메모리를 페이지로 나누어 연속적인 순서로 독립적인 스위핑(sweeping)이 가능하게 합니다. 각 할당은 페이지 내의 메모리 블록이 되며, 페이지는 블록 크기를 추적합니다. 다양한 할당 크기에 맞게 최적화된 여러 페이지 유형이 존재합니다. 메모리 블록의 연속적인 배치는 모든 할당된 블록을 효율적으로 순회할 수 있도록 보장합니다.

스레드가 메모리를 할당할 때, 할당 크기에 따라 적절한 페이지를 검색합니다. 스레드는 다양한 크기 카테고리에 대한 페이지 세트를 유지합니다. 일반적으로 해당 크기의 현재 페이지에서 할당을 처리할 수 있습니다. 그렇지 않은 경우 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나, 스위핑이 필요하거나, 새로 생성되어야 할 수도 있습니다.

새로운 할당자는 여러 개의 독립적인 할당 공간을 동시에 가질 수 있도록 허용하며, 이를 통해 Kotlin 팀은 성능을 더욱 개선하기 위해 다양한 페이지 레이아웃을 실험할 수 있게 됩니다.

#### 커스텀 메모리 할당자 활성화 방법

Kotlin 1.9.20부터 새로운 메모리 할당자가 기본값입니다. 추가 설정은 필요하지 않습니다.

메모리 소비가 많다고 느껴지면 Gradle 빌드 스크립트에서 `-Xallocator=mimalloc` 또는 `-Xallocator=std`를 사용하여 `mimalloc`이나 시스템 할당자로 되돌릴 수 있습니다. 새로운 메모리 할당자를 개선할 수 있도록 [YouTrack](https://kotl.in/issue)에 이러한 문제를 보고해 주세요.

새로운 할당자 설계의 기술적 세부 사항은 이 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)를 참조하세요.

### 가비지 컬렉터의 성능 향상

Kotlin 팀은 새로운 Kotlin/Native 메모리 관리자의 성능과 안정성을 지속적으로 개선하고 있습니다. 이번 릴리스에서는 다음의 1.9.20 하이라이트를 포함하여 가비지 컬렉터(GC)에 몇 가지 중요한 변화가 있었습니다:

* [GC 일시 중단 시간을 줄이기 위한 전체 병렬 마크(Full parallel mark)](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [할당 성능을 높이기 위한 큰 청크(Big chunk) 단위의 메모리 추적](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### GC 일시 중단 시간을 줄이기 위한 전체 병렬 마크

이전에는 기본 가비지 컬렉터가 부분 병렬 마크만 수행했습니다. 뮤테이터(mutator) 스레드가 일시 중단되면 스레드 로컬 변수나 콜 스택과 같은 자체 루트(root)에서 GC의 시작을 마킹했습니다. 한편, 별도의 GC 스레드는 전역 루트와 네이티브 코드를 활발하게 실행 중이어서 일시 중단되지 않은 모든 뮤테이터의 루트에서 마킹을 시작하는 역할을 담당했습니다.

이 방식은 전역 객체의 수가 제한적이고 뮤테이터 스레드가 Kotlin 코드를 실행하는 실행 가능(runnable) 상태에서 상당한 시간을 보낼 때는 잘 작동했습니다. 그러나 일반적인 iOS 애플리케이션의 경우는 그렇지 않았습니다.

이제 GC는 일시 중단된 뮤테이터, GC 스레드, 그리고 선택적인 마커(marker) 스레드를 결합하여 마크 큐를 처리하는 전체 병렬 마크(full parallel mark)를 사용합니다. 기본적으로 마킹 프로세스는 다음에 의해 수행됩니다:

* 일시 중단된 뮤테이터. 자신의 루트를 처리한 후 코드를 실행하지 않는 동안 대기하는 대신, 전체 마킹 프로세스에 기여합니다.
* GC 스레드. 최소한 하나의 스레드가 마킹을 수행하도록 보장합니다.

이 새로운 접근 방식은 마킹 프로세스를 더욱 효율적으로 만들어 GC의 일시 중단 시간을 단축합니다.

#### 할당 성능을 높이기 위한 큰 청크 단위의 메모리 추적

이전에는 GC 스케줄러가 각 객체의 할당을 개별적으로 추적했습니다. 그러나 새로운 기본 커스텀 할당자나 `mimalloc` 메모리 할당자 모두 각 객체에 대해 별도의 저장 공간을 할당하지 않고, 한 번에 여러 객체를 위한 넓은 영역을 할당합니다.

Kotlin 1.9.20에서 GC는 개별 객체 대신 영역(area)을 추적합니다. 이는 각 할당 시 수행되는 작업의 수를 줄여 작은 객체의 할당 속도를 높이고, 가비지 컬렉터의 메모리 사용량을 최소화하는 데 도움이 됩니다.

### klib 아티팩트의 증분 컴파일

> 이 기능은 [Experimental](components-stability.md#stability-levels-explained) 단계입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용하십시오.
> [YouTrack](https://kotl.in/issue)에 피드백을 남겨주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.9.20은 Kotlin/Native를 위한 새로운 컴파일 시간 최적화 기능을 도입했습니다. `klib` 아티팩트를 네이티브 코드로 컴파일하는 과정이 이제 부분적으로 증분(incremental) 처리됩니다.

디버그 모드에서 Kotlin 소스 코드를 네이티브 바이너리로 컴파일할 때, 컴파일은 두 단계를 거칩니다:

1. 소스 코드가 `klib` 아티팩트로 컴파일됩니다.
2. `klib` 아티팩트와 의존성들이 바이너리로 컴파일됩니다.

두 번째 단계의 컴파일 시간을 최적화하기 위해 팀은 이미 의존성에 대한 컴파일러 캐시를 구현했습니다. 의존성은 네이티브 코드로 한 번만 컴파일되고, 결과는 바이너리가 컴파일될 때마다 재사용됩니다. 하지만 프로젝트 소스에서 빌드된 `klib` 아티팩트는 프로젝트가 변경될 때마다 항상 네이티브 코드로 완전히 다시 컴파일되었습니다.

새로운 증분 컴파일을 사용하면, 프로젝트 모듈 변경으로 인해 소스 코드의 일부만 `klib` 아티팩트로 다시 컴파일되는 경우, `klib`의 일부만 바이너리로 다시 컴파일됩니다.

증분 컴파일을 활성화하려면 `gradle.properties` 파일에 다음 옵션을 추가하세요:

```none
kotlin.incremental.native=true
```

문제가 발생하면 [YouTrack](https://kotl.in/issue)에 해당 사례를 보고해 주세요.

### 라이브러리 연결(Linkage) 문제 관리

이번 릴리스는 Kotlin/Native 컴파일러가 Kotlin 라이브러리의 연결 문제를 처리하는 방식을 개선했습니다. 오류 메시지에 해시 대신 시그니처 이름이 포함되어 더 읽기 쉬운 선언이 제공되므로 문제를 더 쉽게 찾고 수정할 수 있습니다. 예시는 다음과 같습니다:

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 컴파일러는 서드파티 Kotlin 라이브러리 간의 연결 문제를 감지하고 런타임에 오류를 보고합니다. 서드파티 Kotlin 라이브러리의 작성자가 다른 서드파티 Kotlin 라이브러리가 사용하는 실험적 API에서 호환되지 않는 변경을 수행할 때 이러한 문제가 발생할 수 있습니다.

Kotlin 1.9.20부터 컴파일러는 기본적으로 자동(silent) 모드에서 연결 문제를 감지합니다. 프로젝트에서 이 설정을 조정할 수 있습니다:

* 이러한 문제를 컴파일 로그에 기록하려면 `-Xpartial-linkage-loglevel=WARNING` 컴파일러 옵션을 사용하여 경고를 활성화하세요.
* `-Xpartial-linkage-loglevel=ERROR`를 사용하여 보고된 경고의 심각도를 컴파일 오류로 높일 수도 있습니다. 이 경우 컴파일이 실패하고 컴파일 로그에 모든 오류가 표시됩니다. 연결 문제를 더 자세히 조사하려면 이 옵션을 사용하세요.

```kotlin
// Gradle 빌드 파일에서 컴파일러 옵션을 전달하는 예:
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 연결 문제를 경고로 보고하려면:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 연결 경고를 오류로 높이려면:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

이 기능에서 예기치 않은 문제가 발생하면 언제든지 `-Xpartial-linkage=disable` 컴파일러 옵션으로 옵트아웃할 수 있습니다. 그러한 사례를 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.

### 클래스 생성자 호출 시 컴패니언 객체 초기화

Kotlin 1.9.20부터 Kotlin/Native 백엔드는 클래스 생성자에서 컴패니언 객체(companion object)를 위한 정적 초기화 도구(static initializer)를 호출합니다:

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

이 동작은 Java 정적 초기화 도구의 시맨틱과 일치하는 해당 클래스가 로드(해석)될 때 컴패니언 객체가 초기화되는 Kotlin/JVM과 통합되었습니다.

이제 이 기능의 구현이 플랫폼 간에 더 일관되게 적용되므로 Kotlin 멀티플랫폼 프로젝트에서 코드를 공유하기가 더 쉬워졌습니다.

### 모든 cinterop 선언에 대한 옵트인 요구 사항

Kotlin 1.9.20부터 libcurl 및 libxml과 같은 C 및 Objective-C 라이브러리로부터 `cinterop` 도구가 생성한 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 마크가 표시됩니다. 옵트인 어노테이션이 없으면 코드가 컴파일되지 않습니다.

이 요구 사항은 C 및 Objective-C 라이브러리 임포트의 [실험적(Experimental)](components-stability.md#stability-levels-explained) 상태를 반영합니다. 프로젝트의 특정 영역으로 사용을 제한하는 것을 권장합니다. 이렇게 하면 나중에 임포트 기능이 안정화되었을 때 마이그레이션이 더 쉬워질 것입니다.

> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)의 경우, 일부 API에만 `@ExperimentalForeignApi` 옵트인이 필요합니다. 이러한 경우 옵트인 요구 사항과 함께 경고가 표시됩니다.
>
{style="note"}

### 링커 오류에 대한 커스텀 메시지

라이브러리 작성자라면 이제 커스텀 메시지를 통해 사용자가 링커 오류를 해결하도록 도울 수 있습니다.

Kotlin 라이브러리가 [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 등을 통해 C 또는 Objective-C 라이브러리에 의존하는 경우, 사용자는 이러한 의존 라이브러리를 로컬 시스템에 가지고 있거나 프로젝트 빌드 스크립트에서 명시적으로 구성해야 합니다. 그렇지 않은 경우 사용자는 모호한 "Framework not found" 메시지를 받게 되곤 했습니다.

이제 컴파일 실패 메시지에 특정 지침이나 링크를 제공할 수 있습니다. 이를 위해 `cinterop`에 `-Xuser-setup-hint` 컴파일러 옵션을 전달하거나 `.def` 파일에 `userSetupHint=message` 속성을 추가하세요.

### 레거시 메모리 관리자 제거

[새로운 메모리 관리자](native-memory-manager.md)는 Kotlin 1.6.20에서 도입되었고 1.7.20에서 기본값이 되었습니다. 그 이후로 계속해서 업데이트와 성능 향상이 이루어졌으며 이제 Stable 단계가 되었습니다.

이제 사용 중단(deprecation) 주기를 마치고 레거시 메모리 관리자를 제거할 때가 되었습니다. 아직 사용 중이라면 `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 제거하고 [마이그레이션 가이드](native-migration-guide.md)에 따라 필요한 변경을 수행하세요.

### 타겟 티어(target tiers) 정책 변경

우리는 [티어 1 지원(tier 1 support)](native-target-support.md#tier-1)에 대한 요구 사항을 업그레이드하기로 결정했습니다. Kotlin 팀은 이제 티어 1에 해당하는 타겟에 대해 컴파일러 릴리스 간 소스 및 바이너리 호환성을 제공하기 위해 최선을 다하고 있습니다. 또한 컴파일 및 실행이 가능하도록 CI 도구로 정기적으로 테스트되어야 합니다. 현재 티어 1에는 macOS 호스트를 위한 다음 타겟들이 포함됩니다:

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

Kotlin 1.9.20에서는 이전에 사용이 중단되었던 여러 타겟을 제거했습니다:

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

현재 [지원되는 타겟](native-target-support.md)의 전체 목록을 확인하세요.

## Kotlin 멀티플랫폼

Kotlin 1.9.20은 Kotlin 멀티플랫폼의 안정화에 중점을 두고 있으며, 새로운 프로젝트 위저드 및 기타 주목할 만한 기능을 통해 개발자 경험을 개선하는 새로운 단계를 밟고 있습니다:

* [Kotlin 멀티플랫폼 Stable 단계 진입](#kotlin-multiplatform-is-stable)
* [멀티플랫폼 프로젝트 구성을 위한 템플릿](#template-for-configuring-multiplatform-projects)
* [새로운 프로젝트 위저드](#new-project-wizard)
* [Gradle 구성 캐시 완전 지원](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Gradle에서 새로운 표준 라이브러리 버전 구성 간소화](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [서드파티 cinterop 라이브러리에 대한 기본 지원](#default-support-for-third-party-cinterop-libraries)
* [Compose 멀티플랫폼 프로젝트의 Kotlin/Native 컴파일 캐시 지원](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [호환성 가이드라인](#compatibility-guidelines)

### Kotlin 멀티플랫폼 Stable 단계 진입

1.9.20 릴리스는 Kotlin 진화의 중요한 이정표입니다. [Kotlin 멀티플랫폼](https://kotlinlang.org/docs/multiplatform/get-started.html)이 마침내 Stable 단계가 되었습니다. 이는 이 기술이 프로젝트에서 사용하기에 안전하며 프로덕션 환경에 100% 준비되었음을 의미합니다. 또한 Kotlin 멀티플랫폼의 향후 개발이 엄격한 [하위 호환성 규칙](https://kotlinfoundation.org/language-committee-guidelines/)에 따라 계속될 것임을 의미합니다.

Kotlin 멀티플랫폼의 일부 고급 기능은 여전히 진화 중입니다. 이러한 기능을 사용할 때는 현재 기능의 안정성 상태를 설명하는 경고가 표시됩니다. IntelliJ IDEA에서 실험적인 기능을 사용하기 전에 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform**에서 명시적으로 활성화해야 합니다.

* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)를 방문하여 Kotlin 멀티플랫폼 안정화와 향후 계획에 대해 자세히 알아보세요.
* [멀티플랫폼 호환성 가이드](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)를 확인하여 안정화 과정에서 어떤 중대한 변경이 있었는지 확인하세요.
* 이번 릴리스에서 부분적으로 안정화된 Kotlin 멀티플랫폼의 중요한 부분인 [expected 및 actual 선언 메커니즘](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)에 대해 읽어보세요.

### 멀티플랫폼 프로젝트 구성을 위한 템플릿

Kotlin 1.9.20부터 Kotlin Gradle 플러그인은 인기 있는 멀티플랫폼 시나리오를 위해 공유 소스 세트를 자동으로 생성합니다. 프로젝트 설정이 이들 중 하나라면 소스 세트 계층 구조를 수동으로 구성할 필요가 없습니다. 프로젝트에 필요한 타겟만 명시적으로 지정하면 됩니다.

Kotlin Gradle 플러그인의 새로운 기능인 기본 계층 구조 템플릿(default hierarchy template) 덕분에 설정이 더 쉬워졌습니다. 이는 플러그인에 내장된 사전 정의된 소스 세트 계층 구조 템플릿입니다. 여기에는 선언한 타겟에 대해 Kotlin이 자동으로 생성하는 중간 소스 세트가 포함됩니다. [전체 템플릿 보기](#see-the-full-hierarchy-template)를 확인하세요.

#### 더 쉬운 프로젝트 생성

Android와 iPhone 기기를 모두 타겟팅하고 Apple 실리콘 MacBook에서 개발되는 멀티플랫폼 프로젝트를 가정해 보겠습니다. 이 프로젝트의 설정이 Kotlin 버전에 따라 어떻게 달라지는지 비교해 보세요:

<table>
   <tr>
       <td>Kotlin 1.9.0 및 이전 버전 (표준 설정)</td>
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

    // iosMain 소스 세트가 자동으로 생성됨
}
```

</td>
</tr>
</table>

기본 계층 구조 템플릿을 사용하면 프로젝트를 설정하는 데 필요한 상용구(boilerplate) 코드의 양이 상당히 줄어드는 것을 알 수 있습니다.

코드에서 `androidTarget`, `iosArm64`, `iosSimulatorArm64` 타겟을 선언하면 Kotlin Gradle 플러그인은 템플릿에서 적합한 공유 소스 세트를 찾아 자동으로 생성해 줍니다. 결과적인 계층 구조는 다음과 같습니다:

![사용 중인 기본 타겟 계층 구조의 예시](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

초록색 소스 세트는 실제로 생성되어 프로젝트에 포함되며, 기본 템플릿의 회색 소스 세트는 무시됩니다.

#### 소스 세트 코드 완성 사용

생성된 프로젝트 구조에서 더 쉽게 작업할 수 있도록 IntelliJ IDEA는 이제 기본 계층 구조 템플릿으로 생성된 소스 세트에 대한 코드 완성을 제공합니다:

<img src="multiplatform-hierarchy-completion.animated.gif" alt="소스 세트 이름에 대한 IDE 코드 완성" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

또한 해당 타겟을 선언하지 않아 존재하지 않는 소스 세트에 접근하려고 하면 Kotlin에서 경고를 표시합니다. 아래 예시에는 JVM 타겟이 없습니다(`androidTarget`만 있으며 이는 동일하지 않습니다). 그러나 `jvmMain` 소스 세트를 사용하려고 하면 어떻게 되는지 봅시다:

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

이 경우 Kotlin은 빌드 로그에 경고를 보고합니다:

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- jvm 타겟을 등록하세요 */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 타겟 계층 구조 설정

Kotlin 1.9.20부터 기본 계층 구조 템플릿이 자동으로 활성화됩니다. 대부분의 경우 추가 설정이 필요하지 않습니다.

하지만 1.9.20 이전에 생성된 기존 프로젝트를 마이그레이션하는 경우, 이전에 `dependsOn()` 호출을 통해 중간 소스를 수동으로 도입했다면 경고가 발생할 수 있습니다. 이 문제를 해결하려면 다음을 수행하세요:

* 중간 소스 세트가 현재 기본 계층 구조 템플릿에 포함되어 있다면 모든 수동 `dependsOn()` 호출과 `by creating` 구문으로 생성된 소스 세트를 제거하세요.

  모든 기본 소스 세트 목록을 확인하려면 [전체 계층 구조 템플릿](#see-the-full-hierarchy-template)을 참조하세요.

* 기본 계층 구조 템플릿이 제공하지 않는 추가 소스 세트(예: macOS와 JVM 타겟 간에 코드를 공유하는 소스 세트)를 가지려면, `applyDefaultHierarchyTemplate()`을 사용하여 명시적으로 템플릿을 재적용하고 평소와 같이 `dependsOn()`으로 추가 소스 세트를 수동으로 구성하여 계층 구조를 조정하세요:

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 기본 계층 구조를 명시적으로 적용합니다. 예를 들어 iosMain 소스 세트가 생성됩니다:
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 추가적인 jvmAndMacos 소스 세트를 생성합니다
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* 프로젝트에 템플릿에 의해 생성된 것과 정확히 같은 이름을 가졌지만 다른 타겟 세트 간에 공유되는 소스 세트가 이미 있는 경우, 현재 템플릿 소스 세트 간의 기본 `dependsOn` 관계를 수정할 방법은 없습니다.

  이 경우 기본 계층 구조 템플릿이나 수동으로 생성된 소스 세트 중에서 용도에 맞는 다른 소스 세트를 찾는 것이 한 가지 방법입니다. 다른 방법은 템플릿을 완전히 옵트아웃하는 것입니다.

  옵트아웃하려면 `gradle.properties`에 `kotlin.mpp.applyDefaultHierarchyTemplate=false`를 추가하고 다른 모든 소스 세트를 수동으로 구성하세요.

  우리는 이러한 경우의 설정 프로세스를 단순화하기 위해 자신만의 계층 구조 템플릿을 만들 수 있는 API를 작업 중입니다.

#### 전체 계층 구조 템플릿 보기 {initial-collapse-state="collapsed" collapsible="true"}

프로젝트가 컴파일되는 타겟을 선언하면 플러그인이 템플릿에서 그에 따라 공유 소스 세트를 선택하여 프로젝트에 생성합니다.

![기본 계층 구조 템플릿](full-template-hierarchy.svg)

> 이 예시는 `Main` 접미사를 생략하고 프로젝트의 프로덕션 부분만 보여줍니다(예: `commonMain` 대신 `common` 사용). 그러나 `*Test` 소스에 대해서도 모든 것이 동일하게 적용됩니다.
>
{style="tip"}

### 새로운 프로젝트 위저드

JetBrains 팀은 크로스 플랫폼 프로젝트를 생성하는 새로운 방법인 [Kotlin 멀티플랫폼 웹 위저드](https://kmp.jetbrains.com)를 선보입니다.

이 새로운 Kotlin 멀티플랫폼 위저드의 첫 번째 구현은 가장 인기 있는 Kotlin 멀티플랫폼 사용 사례를 다룹니다. 이전 프로젝트 템플릿에 대한 모든 피드백을 통합하여 아키텍처를 최대한 견고하고 신뢰할 수 있도록 만들었습니다.

새로운 위저드는 통합된 백엔드와 다양한 프론트엔드를 가질 수 있는 분산형 아키텍처를 갖추고 있으며, 웹 버전이 그 첫 번째 단계입니다. 향후 IDE 버전 구현과 명령줄 도구 제작도 고려하고 있습니다. 웹에서는 항상 최신 버전의 위저드를 사용할 수 있지만, IDE에서는 다음 릴리스를 기다려야 합니다.

새로운 위저드를 사용하면 프로젝트 설정이 그 어느 때보다 쉬워집니다. 모바일, 서버 및 데스크톱 개발을 위한 타겟 플랫폼을 선택하여 필요에 맞게 프로젝트를 구성할 수 있습니다. 향후 릴리스에서는 웹 개발 기능도 추가할 계획입니다.

<img src="multiplatform-web-wizard.png" alt="멀티플랫폼 웹 위저드" width="400"/>

새로운 프로젝트 위저드는 이제 Kotlin으로 크로스 플랫폼 프로젝트를 생성하는 선호되는 방식입니다. 1.9.20부터 Kotlin 플러그인은 더 이상 IntelliJ IDEA 내에서 **Kotlin Multiplatform** 프로젝트 위저드를 제공하지 않습니다.

새로운 위저드는 초기 설정을 쉽게 안내하여 온보딩 프로세스를 훨씬 원활하게 만들어 줄 것입니다. 문제가 발생하면 [YouTrack](https://kotl.in/issue)에 보고하여 위저드 경험을 개선할 수 있도록 도와주세요.

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="프로젝트 생성하기" style="block"/>
</a>

### Kotlin 멀티플랫폼에서 Gradle 구성 캐시 완전 지원

이전에는 Kotlin 멀티플랫폼 라이브러리에 사용할 수 있는 Gradle 구성 캐시의 [미리보기](whatsnew19.md#preview-of-the-gradle-configuration-cache)를 도입했습니다. 1.9.20에서 Kotlin 멀티플랫폼 플러그인은 한 걸음 더 나아갔습니다.

이제 [Kotlin CocoaPods Gradle 플러그인](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)뿐만 아니라 Xcode 빌드에 필요한 `embedAndSignAppleFrameworkForXcode`와 같은 통합 작업에서도 Gradle 구성 캐시를 지원합니다.

이제 모든 멀티플랫폼 프로젝트에서 향상된 빌드 시간을 활용할 수 있습니다. Gradle 구성 캐시는 이후 빌드에서 구성 단계의 결과를 재사용하여 빌드 프로세스 속도를 높입니다. 자세한 내용과 설정 지침은 [Gradle 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)를 참조하세요.

### Gradle에서 새로운 표준 라이브러리 버전 구성 간소화

멀티플랫폼 프로젝트를 생성하면 표준 라이브러리(`stdlib`)에 대한 의존성이 각 소스 세트에 자동으로 추가됩니다. 이것이 멀티플랫폼 프로젝트를 시작하는 가장 쉬운 방법입니다.

이전에는 표준 라이브러리에 대한 의존성을 수동으로 구성하려면 각 소스 세트에 대해 개별적으로 구성해야 했습니다. `kotlin-stdlib:1.9.20`부터는 `commonMain` 루트 소스 세트에서 **한 번만** 의존성을 구성하면 됩니다:

<table>
   <tr>
       <td>표준 라이브러리 버전 1.9.10 및 이전 버전</td>
       <td>표준 라이브러리 버전 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 공통 소스 세트의 경우
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // JVM 소스 세트의 경우
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // JS 소스 세트의 경우
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

이 변경 사항은 표준 라이브러리의 Gradle 메타데이터에 새로운 정보를 포함함으로써 가능해졌습니다. 이를 통해 Gradle은 다른 소스 세트에 대해 올바른 표준 라이브러리 아티팩트를 자동으로 해석할 수 있습니다.

### 서드파티 cinterop 라이브러리에 대한 기본 지원

Kotlin 1.9.20은 [Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 플러그인이 적용된 프로젝트에서 모든 cinterop 의존성에 대해 (옵트인 방식이 아닌) 기본 지원을 추가합니다.

이는 이제 플랫폼별 의존성에 제한받지 않고 더 많은 네이티브 코드를 공유할 수 있음을 의미합니다. 예를 들어, `iosMain` 공유 소스 세트에 [Pod 라이브러리에 대한 의존성](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)을 추가할 수 있습니다.

이전에는 Kotlin/Native 배포판과 함께 제공되는 [플랫폼별 라이브러리](native-platform-libs.md)(Foundation, UIKit, POSIX 등)에서만 이 기능이 작동했습니다. 이제 모든 서드파티 Pod 라이브러리를 공유 소스 세트에서 기본적으로 사용할 수 있습니다. 이를 지원하기 위해 더 이상 별도의 Gradle 속성을 지정할 필요가 없습니다.

### Compose 멀티플랫폼 프로젝트의 Kotlin/Native 컴파일 캐시 지원

이번 릴리스는 주로 iOS용 Compose 멀티플랫폼 프로젝트에 영향을 미쳤던 Compose 멀티플랫폼 컴파일러 플러그인과의 호환성 문제를 해결했습니다.

이 문제를 해결하기 위해 `kotlin.native.cacheKind=none` Gradle 속성을 사용하여 캐싱을 비활성화해야 했습니다. 그러나 이 해결 방법은 성능 저하를 초래했습니다. Kotlin/Native 컴파일러에서 캐싱이 작동하지 않아 컴파일 시간이 느려졌기 때문입니다.

이제 문제가 해결되었으므로 `gradle.properties` 파일에서 `kotlin.native.cacheKind=none`을 제거하고 Compose 멀티플랫폼 프로젝트에서 향상된 컴파일 시간을 누릴 수 있습니다.

컴파일 시간 개선에 대한 더 많은 팁은 [Kotlin/Native 문서](native-improving-compilation-time.md)를 참조하세요.

### 호환성 가이드라인

프로젝트를 구성할 때 Kotlin 멀티플랫폼 Gradle 플러그인과 사용 가능한 Gradle, Xcode 및 Android Gradle 플러그인(AGP) 버전 간의 호환성을 확인하세요:

| Kotlin 멀티플랫폼 Gradle 플러그인 | Gradle | Android Gradle 플러그인 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 이상 | 7.4.2–8.2 | 15.0. 아래 세부 정보 참조 |

이번 릴리스 기준으로 권장되는 Xcode 버전은 15.0입니다. Xcode 15.0과 함께 제공되는 라이브러리는 완전히 지원되며 Kotlin 코드 어디에서나 접근할 수 있습니다.

하지만 Xcode 14.3도 대부분의 경우 여전히 작동할 것입니다. 로컬 시스템에서 14.3 버전을 사용하는 경우 Xcode 15와 함께 제공되는 라이브러리는 보이지만 접근할 수는 없다는 점에 유의하세요.

## Kotlin/Wasm

1.9.20에서 Kotlin Wasm은 [Alpha 단계](components-stability.md)의 안정성에 도달했습니다.

* [Wasm GC 4단계 및 최종 opcode와의 호환성](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [새로운 `wasm-wasi` 타겟 도입 및 `wasm` 타겟의 이름을 `wasm-js`로 변경](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [표준 라이브러리의 WASI API 지원](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm API 개선](#kotlin-wasm-api-improvements)

> Kotlin Wasm은 [Alpha](components-stability.md) 단계입니다.
> 언제든지 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
>
> [YouTrack](https://kotl.in/issue)에 피드백을 남겨주시면 감사하겠습니다.
>
{style="note"}

### Wasm GC 4단계 및 최종 opcode 호환성

Wasm GC가 최종 단계로 이동함에 따라 바이너리 표현에 사용되는 상수 번호인 opcode의 업데이트가 필요합니다. Kotlin 1.9.20은 최신 opcode를 지원하므로 Wasm 프로젝트를 최신 버전의 Kotlin으로 업데이트할 것을 강력히 권장합니다.
또한 Wasm 환경이 포함된 최신 버전의 브라우저 사용을 권장합니다:
* Chrome 및 Chromium 기반 브라우저의 경우 119 버전 이상.
* Firefox의 경우 119 버전 이상. Firefox 119에서는 [Wasm GC를 수동으로 켜야 함](wasm-configuration.md)에 유의하세요.

### 새로운 wasm-wasi 타겟 도입 및 wasm 타겟의 이름을 wasm-js로 변경

이번 릴리스에서는 Kotlin/Wasm을 위한 새로운 타겟인 `wasm-wasi`를 도입합니다. 또한 `wasm` 타겟의 이름을 `wasm-js`로 변경합니다. Gradle DSL에서 이러한 타겟은 각각 `wasmWasi {}` 및 `wasmJs {}`로 사용할 수 있습니다.

프로젝트에서 이러한 타겟을 사용하려면 `build.gradle.kts` 파일을 업데이트하세요:

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

이전에 도입된 `wasm {}` 블록은 `wasmJs {}`를 위해 사용이 중단되었습니다.

기존 Kotlin/Wasm 프로젝트를 마이그레이션하려면 다음을 수행하세요:
* `build.gradle.kts` 파일에서 `wasm {}` 블록의 이름을 `wasmJs {}`로 변경합니다.
* 프로젝트 구조에서 `wasmMain` 디렉토리의 이름을 `wasmJsMain`으로 변경합니다.

### 표준 라이브러리의 WASI API 지원

이번 릴리스에는 Wasm 플랫폼용 시스템 인터페이스인 [WASI](https://github.com/WebAssembly/WASI)에 대한 지원이 포함되었습니다. WASI 지원을 통해 시스템 리소스에 접근하기 위한 표준화된 API 세트를 제공함으로써 브라우저 외부(예: 서버 측 애플리케이션)에서 Kotlin/Wasm을 더 쉽게 사용할 수 있습니다. 또한 WASI는 외부 리소스에 접근할 때 또 다른 보안 레이어인 기능 기반 보안(capability-based security)을 제공합니다.

Kotlin/Wasm 애플리케이션을 실행하려면 Node.js나 Deno와 같이 Wasm 가비지 컬렉션(GC)을 지원하는 VM이 필요합니다. Wasmtime, WasmEdge 등은 여전히 완전한 Wasm GC 지원을 위해 작업 중입니다.

WASI 함수를 가져오려면 `@WasmImport` 어노테이션을 사용하세요:

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[GitHub 저장소에서 전체 예제를 확인할 수 있습니다](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example).

> `wasmWasi`를 타겟팅하는 동안에는 [JavaScript와의 상호 운용성](wasm-js-interop.md)을 사용할 수 없습니다.
>
{style="note"}

### Kotlin/Wasm API 개선

이번 릴리스에서는 Kotlin/Wasm API에 몇 가지 편의성 개선이 이루어졌습니다. 예를 들어, 더 이상 DOM 이벤트 리스너에 대해 값을 반환할 필요가 없습니다:

<table>
   <tr>
       <td>1.9.20 이전</td>
       <td>1.9.20 이후</td>
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

Kotlin 1.9.20은 Gradle 6.8.3부터 8.1까지 완벽하게 호환됩니다. 최신 Gradle 릴리스까지 사용할 수 있지만, 이 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 유의하세요.

이번 버전의 변경 사항은 다음과 같습니다:
* [internal 선언에 접근하기 위한 테스트 픽스처(test fixtures) 지원](#support-for-test-fixtures-to-access-internal-declarations)
* [Konan 디렉토리 경로 구성을 위한 새로운 속성](#new-property-to-configure-paths-to-konan-directories)
* [Kotlin/Native 작업을 위한 새로운 빌드 리포트 메트릭](#new-build-report-metrics-for-kotlin-native-tasks)

### internal 선언에 접근하기 위한 테스트 픽스처 지원

Kotlin 1.9.20에서 Gradle의 `java-test-fixtures` 플러그인을 사용하면, [테스트 픽스처(test fixtures)](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)가 이제 메인 소스 세트 클래스 내의 `internal` 선언에 접근할 수 있습니다. 또한 모든 테스트 소스에서 테스트 픽스처 클래스 내의 `internal` 선언을 볼 수 있습니다.

### Konan 디렉토리 경로 구성을 위한 새로운 속성

Kotlin 1.9.20에서는 환경 변수 `KONAN_DATA_DIR`을 통해 구성할 필요 없이 `~/.konan` 디렉토리 경로를 사용자 정의할 수 있는 `konan.data.dir` Gradle 속성을 사용할 수 있습니다.

또는 `cinterop` 및 `konanc` 도구를 통해 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `~/.konan` 디렉토리에 대한 커스텀 경로를 구성할 수 있습니다.

### Kotlin/Native 작업을 위한 새로운 빌드 리포트 메트릭

Kotlin 1.9.20에서 Gradle 빌드 리포트에는 이제 Kotlin/Native 작업을 위한 메트릭이 포함됩니다. 다음은 이러한 메트릭이 포함된 빌드 리포트의 예입니다:

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

또한 `kotlin.experimental.tryK2` 빌드 리포트에는 이제 컴파일된 모든 Kotlin/Native 작업과 사용된 언어 버전이 나열됩니다:

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

> Gradle 8.0을 사용하는 경우 특히 Gradle 구성 캐싱이 활성화되었을 때 빌드 리포트에 문제가 발생할 수 있습니다. 이는 알려진 문제이며, Gradle 8.1 이상에서 수정되었습니다.
>
{style="note"}

## 표준 라이브러리

Kotlin 1.9.20에서는 [Kotlin/Native 표준 라이브러리가 Stable 단계](#the-kotlin-native-standard-library-becomes-stable)가 되었으며, 다음과 같은 새로운 기능이 추가되었습니다:
* [Enum 클래스 values 제네릭 함수 교체](#replacement-of-the-enum-class-values-generic-function)
* [Kotlin/JS에서 HashMap 작업의 성능 향상](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enum 클래스 values 제네릭 함수 교체

> 이 기능은 [Experimental](components-stability.md#stability-levels-explained) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 옵트인이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용하십시오. [YouTrack](https://kotl.in/issue)에 피드백을 남겨주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.9.0에서 enum 클래스의 `entries` 속성이 Stable 단계가 되었습니다. `entries` 속성은 합성된 `values()` 함수를 대체하는 현대적이고 성능이 뛰어난 기능입니다. Kotlin 1.9.20의 일환으로 제네릭 `enumValues<T>()` 함수를 대체하는 `enumEntries<T>()`가 도입되었습니다.

> `enumValues<T>()` 함수는 여전히 지원되지만, 성능에 미치는 영향이 적은 `enumEntries<T>()` 함수를 사용할 것을 권장합니다. `enumValues<T>()`를 호출할 때마다 매번 새로운 배열이 생성되는 반면, `enumEntries<T>()`를 호출할 때는 매번 동일한 리스트가 반환되므로 훨씬 더 효율적입니다.
>
{style="tip"}

예시는 다음과 같습니다:

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

이 기능을 사용해 보려면 `@OptIn(ExperimentalStdlibApi)`로 옵트인하고 언어 버전을 1.9 이상으로 사용하세요. 최신 버전의 Kotlin Gradle 플러그인을 사용하는 경우 기능을 테스트하기 위해 언어 버전을 별도로 지정할 필요는 없습니다.

### Kotlin/Native 표준 라이브러리 Stable 단계 진입

Kotlin 1.9.0에서 우리는 Kotlin/Native 표준 라이브러리를 안정화 목표에 가깝게 만들기 위해 취한 조치들을 [설명](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)했습니다. Kotlin 1.9.20에서는 마침내 이 작업을 완료하고 Kotlin/Native 표준 라이브러리를 Stable 단계로 만들었습니다. 이번 릴리스의 주요 하이라이트는 다음과 같습니다:

* [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 클래스가 `kotlin.native` 패키지에서 `kotlinx.cinterop` 패키지로 이동되었습니다.
* Kotlin 1.9.0의 일부로 도입된 `ExperimentalNativeApi` 및 `NativeRuntimeApi` 어노테이션의 옵트인 요구 수준이 `WARNING`에서 `ERROR`로 상향되었습니다.
* Kotlin/Native 컬렉션(예: [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 및 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 컬렉션)이 이제 동시 수정을 감지합니다.
* `Throwable` 클래스의 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 함수가 이제 `STDOUT` 대신 `STDERR`에 출력합니다.
  > `printStackTrace()`의 출력 형식은 Stable 단계가 아니며 변경될 수 있습니다.
  >
  {style="warning"}

#### Atomics API 개선

Kotlin 1.9.0에서 우리는 Kotlin/Native 표준 라이브러리가 Stable 단계가 될 때 Atomics API도 Stable 단계가 될 준비가 될 것이라고 언급했습니다. Kotlin 1.9.20에는 다음과 같은 추가 변경 사항이 포함되어 있습니다:

* 실험적인 `AtomicIntArray`, `AtomicLongArray` 및 `AtomicArray<T>` 클래스가 도입되었습니다. 이러한 새로운 클래스는 Java의 원자적 배열(atomic arrays)과 일관되도록 특별히 설계되어 향후 공통 표준 라이브러리에 포함될 수 있습니다.
  > `AtomicIntArray`, `AtomicLongArray` 및 `AtomicArray<T>` 클래스는 [Experimental](components-stability.md#stability-levels-explained) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다. 이를 사용해 보려면 `@OptIn(ExperimentalStdlibApi)`로 옵트인하세요. 평가 목적으로만 사용하십시오. [YouTrack](https://kotl.in/issue)에 피드백을 남겨주시면 감사하겠습니다.
  >
  {style="warning"}
* `kotlin.native.concurrent` 패키지에서 Kotlin 1.9.0에 사용 중단 경고(`WARNING`) 수준으로 설정되었던 Atomics API의 사용 중단 수준이 오류(`ERROR`)로 상향되었습니다.
* `kotlin.concurrent` 패키지에서 사용 중단 수준이 `ERROR`였던 [`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 및 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 클래스의 멤버 함수들이 제거되었습니다.
* `AtomicReference` 클래스의 모든 [멤버 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)가 이제 atomic 인트린직(intrinsic) 함수를 사용합니다.

Kotlin 1.9.20의 모든 변경 사항에 대한 자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)을 참조하세요.

### Kotlin/JS에서 HashMap 작업의 성능 향상

Kotlin 1.9.20은 Kotlin/JS에서 `HashMap` 작업의 성능을 개선하고 메모리 점유 공간을 줄였습니다. 내부적으로 Kotlin/JS는 구현 방식을 개방 주소 지정(open addressing)으로 변경했습니다. 즉, 다음과 같은 경우에 성능 향상을 확인할 수 있습니다:
* `HashMap`에 새로운 요소를 삽입할 때.
* `HashMap`에서 기존 요소를 검색할 때.
* `HashMap`의 키나 값을 순회할 때.

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있었습니다:
* [JVM Metadata](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 레퍼런스 – Kotlin/JVM으로 메타데이터를 파싱하는 방법을 알아보세요.
* [시간 측정 가이드](time-measurement.md) – Kotlin에서 시간을 계산하고 측정하는 방법을 알아보세요.
* [Kotlin 투어](kotlin-tour-welcome.md)의 컬렉션 챕터 개선 – 이론과 실습이 포함된 챕터를 통해 Kotlin 프로그래밍 언어의 기초를 배우세요.
* [명확한 비 null 타입(Definitely non-nullable types)](generics.md#definitely-non-nullable-types) – 명확한 비 null 제네릭 타입에 대해 알아보세요.
* [배열(Arrays) 페이지](arrays.md) 개선 – 배열과 사용 시점에 대해 알아보세요.
* [Kotlin 멀티플랫폼의 expected 및 actual 선언](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) – Kotlin 멀티플랫폼에서 Kotlin의 expected 및 actual 선언 메커니즘에 대해 알아보세요.

## Kotlin 1.9.20 설치 방법

### IDE 버전 확인

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 및 2023.2.x는 Kotlin 플러그인을 1.9.20 버전으로 업데이트하도록 자동으로 제안합니다. IntelliJ IDEA 2023.3에는 Kotlin 1.9.20 플러그인이 포함됩니다.

Android Studio Hedgehog (231) 및 Iguana (232)는 향후 릴리스에서 Kotlin 1.9.20을 지원할 예정입니다.

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20)에서 다운로드할 수 있습니다.

### Gradle 설정 구성

Kotlin 아티팩트 및 의존성을 다운로드하려면 `settings.gradle(.kts)` 파일이 Maven Central 저장소를 사용하도록 업데이트하세요:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

저장소가 지정되지 않은 경우 Gradle은 서비스가 종료된 JCenter 저장소를 사용하며, 이로 인해 Kotlin 아티팩트에 문제가 발생할 수 있습니다.