---
title: "Kotlin 1.9.20의 새로운 기능"
---
_[배포일: 2023년 11월 1일](releases#release-details)_

Kotlin 1.9.20이 출시되었습니다. 모든 타겟에 대한 [K2 컴파일러가 이제 베타 단계에 있으며](#new-kotlin-k2-compiler-updates), [Kotlin Multiplatform이 이제 안정화되었습니다](#kotlin-multiplatform-is-stable). 또한 주요 특징은 다음과 같습니다.

* [멀티플랫폼 프로젝트 설정을 위한 새로운 기본 계층 구조 템플릿](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform에서 Gradle 구성 캐시를 완벽하게 지원](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Native에서 기본적으로 활성화되는 사용자 지정 메모리 할당자](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native에서 가비지 컬렉터 성능 개선](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm의 새로운 타겟 및 타겟 이름 변경](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 표준 라이브러리에서 WASI API 지원](#support-for-the-wasi-api-in-the-standard-library)

다음 영상에서 업데이트에 대한 간략한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE 지원

1.9.20을 지원하는 Kotlin 플러그인은 다음 IDE에서 사용할 수 있습니다.

| IDE            | 지원 버전                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |
:::note
IntelliJ IDEA 2023.3.x 및 Android Studio Iguana (2023.2.1) Canary 15부터는 Kotlin 플러그인이 자동으로 포함되어 업데이트됩니다. 프로젝트에서 Kotlin 버전을 업데이트하기만 하면 됩니다.

:::

## 새로운 Kotlin K2 컴파일러 업데이트

JetBrains의 Kotlin 팀은 주요 성능 개선을 가져오고, 새로운 언어 기능 개발 속도를 높이고, Kotlin이 지원하는 모든 플랫폼을 통합하고, 멀티플랫폼 프로젝트를 위한 더 나은 아키텍처를 제공할 새로운 K2 컴파일러를 계속 안정화하고 있습니다.

K2는 현재 모든 타겟에 대해 **베타** 단계에 있습니다. [릴리스 블로그 게시물에서 자세히 알아보세요](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasm 지원

이번 릴리스부터 Kotlin/Wasm은 새로운 K2 컴파일러를 지원합니다. [프로젝트에서 활성화하는 방법을 알아보세요](#how-to-enable-the-kotlin-k2-compiler).

### K2로 kapt 컴파일러 플러그인 미리 보기

:::note
kapt 컴파일러 플러그인의 K2 지원은 [실험적](components-stability)입니다.
옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.

1.  9.20에서는 K2 컴파일러로 [kapt 컴파일러 플러그인](kapt)을 사용할 수 있습니다.
프로젝트에서 K2 컴파일러를 사용하려면 다음 옵션을 `gradle.properties` 파일에 추가하세요.

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

또는 다음 단계를 완료하여 kapt에 대해 K2를 활성화할 수 있습니다.
1.  `build.gradle.kts` 파일에서 [언어 버전 설정](gradle-compiler-options#example-of-setting-languageversion)을 `2.0`으로 설정합니다.
2.  `gradle.properties` 파일에서 `kapt.use.k2=true`를 추가합니다.

K2 컴파일러로 kapt를 사용하는 동안 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### Kotlin K2 컴파일러를 활성화하는 방법

#### Gradle에서 K2 활성화

Kotlin K2 컴파일러를 활성화하고 테스트하려면 다음 컴파일러 옵션으로 새 언어 버전을 사용하세요.

```bash
-language-version 2.0
```

`build.gradle.kts` 파일에서 지정할 수 있습니다.

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

Kotlin K2 컴파일러를 활성화하고 테스트하려면 `pom.xml` 파일의 `<project/>` 섹션을 업데이트하세요.

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### IntelliJ IDEA에서 K2 활성화

IntelliJ IDEA에서 Kotlin K2 컴파일러를 활성화하고 테스트하려면 **Settings**(설정) | **Build, Execution, Deployment**(빌드, 실행, 배포) | **Compiler**(컴파일러) | **Kotlin Compiler**(Kotlin 컴파일러)로 이동하여 **Language Version**(언어 버전) 필드를 `2.0 (experimental)`(2.0 (실험적))으로 업데이트합니다.

### 새로운 K2 컴파일러에 대한 피드백을 남겨 주세요

피드백을 보내주시면 감사하겠습니다!

* Kotlin Slack에서 K2 개발자에게 직접 피드백을 제공하세요.
  - [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  - [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* 새로운 K2 컴파일러에서 발생한 문제점을
  [이슈 트래커](https://kotl.in/issue)에 보고하세요.
* [사용 통계 전송 옵션 활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)를 통해
  JetBrains가 K2 사용량에 대한 익명 데이터를 수집할 수 있도록 허용하세요.

## Kotlin/JVM

1.  9.20 버전부터 컴파일러는 Java 21 바이트코드가 포함된 클래스를 생성할 수 있습니다.

## Kotlin/Native

Kotlin 1.9.20에는 기본적으로 활성화된 새로운 메모리 할당자를 사용하는 안정적인 메모리 관리자, 가비지 컬렉터 성능 개선 및 기타 업데이트가 포함되어 있습니다.

* [기본적으로 활성화되는 사용자 지정 메모리 할당자](#custom-memory-allocator-enabled-by-default)
* [가비지 컬렉터 성능 개선](#performance-improvements-for-the-garbage-collector)
* [`klib` 아티팩트의 점진적 컴파일](#incremental-compilation-of-klib-artifacts)
* [라이브러리 연결 문제 관리](#managing-library-linkage-issues)
* 클래스 생성자 호출 시 [컴패니언 객체 초기화](#companion-object-initialization-on-class-constructor-calls)
* 모든 cinterop 선언에 대한 [옵트인 요구 사항](#opt-in-requirement-for-all-cinterop-declarations)
* [링커 오류에 대한 사용자 지정 메시지](#custom-message-for-linker-errors)
* [레거시 메모리 관리자 제거](#removal-of-the-legacy-memory-manager)
* [타겟 티어 정책 변경](#change-to-our-target-tiers-policy)

### 기본적으로 활성화되는 사용자 지정 메모리 할당자

Kotlin 1.9.20은 새로운 메모리 할당자가 기본적으로 활성화되어 제공됩니다. 이전 기본 할당자인
`mimaloc`을 대체하여 가비지 컬렉션을 보다 효율적으로 만들고 [Kotlin/Native 메모리 관리자](native-memory-manager)의 런타임 성능을 개선하도록 설계되었습니다.

새로운 사용자 지정 할당자는 시스템 메모리를 페이지로 나누어 연속 순서로 독립적인 스위핑을 허용합니다.
각 할당은 페이지 내의 메모리 블록이 되고 페이지는 블록 크기를 추적합니다.
다양한 페이지 유형은 다양한 할당 크기에 맞게 최적화되어 있습니다.
메모리 블록의 연속적인 배열은 할당된 모든 블록을 효율적으로 반복할 수 있도록 합니다.

스레드가 메모리를 할당할 때 할당 크기에 따라 적합한 페이지를 검색합니다.
스레드는 다양한 크기 범주에 대한 페이지 집합을 유지 관리합니다.
일반적으로 지정된 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다.
그렇지 않은 경우 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다.
이 페이지는 이미 사용 가능하거나 스위핑이 필요하거나 먼저 생성해야 할 수 있습니다.

새로운 할당자를 사용하면 여러 독립적인 할당 공간을 동시에 사용할 수 있으므로
Kotlin 팀은 성능을 더욱 향상시키기 위해 다양한 페이지 레이아웃을 실험할 수 있습니다.

#### 사용자 지정 메모리 할당자를 활성화하는 방법

Kotlin 1.9.20부터 새로운 메모리 할당자가 기본값입니다. 추가 설정이 필요하지 않습니다.

메모리 소비가 많은 경우 Gradle 빌드 스크립트에서 `-Xallocator=mimalloc` 또는 `-Xallocator=std`를 사용하여 `mimaloc` 또는 시스템 할당자로 다시 전환할 수 있습니다. 새로운 메모리 할당자를 개선할 수 있도록 [YouTrack](https://kotl.in/issue)에 이러한 문제를 보고해 주세요.

새로운 할당자 설계에 대한 기술적인 자세한 내용은 이 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)를 참조하세요.

### 가비지 컬렉터 성능 개선

Kotlin 팀은 새로운 Kotlin/Native 메모리 관리자의 성능과 안정성을 지속적으로 개선하고 있습니다.
이번 릴리스에서는 다음 1.9.20 하이라이트를 포함하여 가비지 컬렉터(GC)에 대한 여러 가지 중요한 변경 사항이 제공됩니다.

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### GC 일시 중지 시간을 줄이기 위한 완전 병렬 마크

이전에는 기본 가비지 컬렉터가 부분 병렬 마크만 수행했습니다. mutator 스레드가 일시 중지되면
스레드 로컬 변수 및 호출 스택과 같은 자체 루트에서 GC를 시작합니다.
한편 별도의 GC 스레드는 전역 루트와 기본 코드를 활발하게 실행하고 따라서 일시 중지되지 않은 모든 mutator의 루트에서 시작하는 역할을 담당했습니다.

이 접근 방식은 제한된 수의 전역 객체가 있고 mutator 스레드가 많은 시간을 실행 가능한 상태에서 Kotlin 코드를 실행하는 데 사용되는 경우에 효과적이었습니다. 그러나 이는 일반적인 iOS 애플리케이션에는 해당되지 않습니다.

이제 GC는 일시 중지된 mutator, GC 스레드 및 선택적 마커 스레드를 결합하여 마크 큐를 처리하는 완전 병렬 마크를 사용합니다. 기본적으로 마킹 프로세스는 다음을 통해 수행됩니다.

* 일시 중지된 mutator. 자체 루트를 처리한 다음 활발하게 코드를 실행하지 않는 동안 유휴 상태를 유지하는 대신 전체 마킹 프로세스에 기여합니다.
* GC 스레드. 이렇게 하면 최소한 하나의 스레드가 마킹을 수행합니다.

이 새로운 접근 방식을 사용하면 마킹 프로세스가 보다 효율적으로 수행되어 GC의 일시 중지 시간이 줄어듭니다.

#### 할당 성능을 개선하기 위해 큰 청크로 메모리 추적

이전에는 GC 스케줄러가 각 객체의 할당을 개별적으로 추적했습니다. 그러나 새로운 기본 사용자 지정 할당자나 `mimalloc` 메모리 할당자는 각 객체에 대해 별도의 스토리지를 할당하지 않습니다. 한 번에 여러 객체에 대해 넓은 영역을 할당합니다.

Kotlin 1.9.20에서는 GC가 개별 객체 대신 영역을 추적합니다. 이렇게 하면 각 할당에서 수행되는 작업 수를 줄여 작은 객체의 할당 속도가 빨라지고 따라서 가비지 컬렉터의 메모리 사용량을 최소화하는 데 도움이 됩니다.

### klib 아티팩트의 점진적 컴파일

이 기능은 [실험적](components-stability#stability-levels-explained)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요합니다(자세한 내용은 아래 참조).
평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)에서 피드백을 보내주시면 감사하겠습니다.

1.  9.20에서는 Kotlin/Native에 대한 새로운 컴파일 시간 최적화가 도입되었습니다.
`klib` 아티팩트를 기본 코드로 컴파일하는 것이 이제 부분적으로 점진적입니다.

Kotlin 소스 코드를 디버그 모드에서 기본 바이너리로 컴파일할 때 컴파일은 다음 두 단계를 거칩니다.

1.  소스 코드가 `klib` 아티팩트로 컴파일됩니다.
2.  `klib` 아티팩트는 종속성과 함께 바이너리로 컴파일됩니다.

두 번째 단계에서 컴파일 시간을 최적화하기 위해 팀은 이미 종속성에 대한 컴파일러 캐시를 구현했습니다.
기본 코드로 한 번만 컴파일되고 바이너리가 컴파일될 때마다 결과가 재사용됩니다.
그러나 프로젝트 소스에서 빌드된 `klib` 아티팩트는 프로젝트가 변경될 때마다 항상 기본 코드로 완전히 다시 컴파일되었습니다.

새로운 점진적 컴파일을 사용하면 프로젝트 모듈 변경으로 인해 소스 코드가 `klib` 아티팩트로 부분적으로만 다시 컴파일되는 경우 `klib`의 일부만 바이너리로 추가로 다시 컴파일됩니다.

점진적 컴파일을 활성화하려면 다음 옵션을 `gradle.properties` 파일에 추가하세요.

```none
kotlin.incremental.native=true
```

문제가 발생하면 [YouTrack](https://kotl.in/issue)에 해당 사례를 보고해 주세요.

### 라이브러리 연결 문제 관리

이번 릴리스에서는 Kotlin/Native 컴파일러가 Kotlin 라이브러리의 연결 문제를 처리하는 방식이 개선되었습니다. 이제 오류 메시지에는 해시 대신 서명 이름을 사용하므로 문제를 보다 쉽게 찾고 해결할 수 있도록 보다 읽기 쉬운 선언이 포함됩니다. 다음은 그 예입니다.

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```

Kotlin/Native 컴파일러는 타사 Kotlin 라이브러리 간의 연결 문제를 감지하고 런타임 시 오류를 보고합니다.
한 타사 Kotlin 라이브러리의 작성자가 다른 타사 Kotlin 라이브러리가 사용하는 실험적 API에서 호환되지 않는 변경을 수행하는 경우 이러한 문제가 발생할 수 있습니다.

Kotlin 1.9.20부터 컴파일러는 기본적으로 자동 모드에서 연결 문제를 감지합니다. 프로젝트에서 이 설정을 조정할 수 있습니다.

* 이러한 문제를 컴파일 로그에 기록하려면 `-Xpartial-linkage-loglevel=WARNING` 컴파일러 옵션을 사용하여 경고를 활성화합니다.
* `-Xpartial-linkage-loglevel=ERROR`를 사용하여 보고된 경고의 심각도를 컴파일 오류로 높일 수도 있습니다.
  이 경우 컴파일이 실패하고 컴파일 로그에 모든 오류가 표시됩니다. 이 옵션을 사용하여 연결 문제를 자세히 검사합니다.

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

이 기능에 예기치 않은 문제가 발생하면 언제든지 `-Xpartial-linkage=disable` 컴파일러 옵션을 사용하여 옵트아웃할 수 있습니다. [이슈 트래커](https://kotl.in/issue)에 해당 사례를 보고하는 것을 주저하지 마세요.

### 클래스 생성자 호출 시 컴패니언 객체 초기화

Kotlin 1.9.20부터 Kotlin/Native 백엔드는 클래스 생성자에서 컴패니언 객체에 대한 정적 초기화 프로그램을 호출합니다.

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

동작은 이제 Java 정적 초기화 프로그램의 의미 체계와 일치하는 해당 클래스가 로드(확인)될 때 컴패니언 객체가 초기화되는 Kotlin/JVM과 통합되었습니다.

이제 이 기능의 구현이 플랫폼 간에 보다 일관성이 있으므로 Kotlin Multiplatform 프로젝트에서 코드를 공유하는 것이 더 쉽습니다.

### 모든 cinterop 선언에 대한 옵트인 요구 사항

Kotlin 1.9.20부터 `cinterop` 도구에서 C 및 Objective-C 라이브러리(예:
libcurl 및 libxml)에서 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi`가 표시됩니다. 옵트인 주석이 없으면 코드가 컴파일되지 않습니다.

이 요구 사항은 C 및 Objective-C 라이브러리 가져오기의 [실험적](components-stability#stability-levels-explained) 상태를 반영합니다. 프로젝트의 특정 영역에서만 사용하는 것이 좋습니다. 이렇게 하면 가져오기 안정화가 시작되면 마이그레이션이 더 쉬워집니다.

Kotlin/Native와 함께 제공되는 기본 플랫폼 라이브러리(예:
Foundation, UIKit, POSIX)의 경우 일부 API에만 `@ExperimentalForeignApi`를 사용하여 옵트인이 필요합니다. 이러한 경우 옵트인 요구 사항이 있는 경고가 표시됩니다.

:::

### 링커 오류에 대한 사용자 지정 메시지

라이브러리 작성자인 경우 사용자에게 사용자 지정 메시지로 링커 오류를 해결하는 데 도움을 줄 수 있습니다.

Kotlin 라이브러리가 [CocoaPods 통합](native-cocoapods)을 사용하여 C 또는 Objective-C 라이브러리에 종속된 경우 사용자는 이러한 종속 라이브러리를 머신에 로컬로 가지고 있거나 프로젝트 빌드 스크립트에서 명시적으로 구성해야 합니다.
그렇지 않은 경우 사용자는 혼란스러운 "프레임워크를 찾을 수 없음" 메시지를 받았습니다.

이제 컴파일 실패 메시지에 특정 지침이나 링크를 제공할 수 있습니다. 이렇게 하려면 `-Xuser-setup-hint`
컴파일러 옵션을 `cinterop`에 전달하거나 `.def` 파일에 `userSetupHint=message` 속성을 추가합니다.

### 레거시 메모리 관리자 제거

[새로운 메모리 관리자](native-memory-manager)는 Kotlin 1.6.20에 도입되었고 1.7.20에서 기본값이 되었습니다.
그 이후로 추가 업데이트와 성능 개선이 이루어졌으며 안정화되었습니다.

더 이상 사용되지 않는 주기를 완료하고 레거시 메모리 관리자를 제거할 때가 왔습니다. 아직 사용 중인 경우 `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 제거하고 필요한 변경을 수행하려면 [마이그레이션 가이드](native-migration-guide)를 따르세요.

### 타겟 티어 정책 변경

[티어 1 지원](native-target-support#tier-1)에 대한 요구 사항을 업그레이드하기로 결정했습니다. Kotlin 팀은 이제 티어 1에 적합한 타겟에 대한 컴파일러 릴리스 간의 소스 및 바이너리 호환성을 제공하기 위해 노력하고 있습니다. 또한 컴파일하고 실행할 수 있도록 CI 도구를 사용하여 정기적으로 테스트해야 합니다. 현재 티어 1에는 macOS 호스트에 대한 다음 타겟이 포함됩니다.

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

Kotlin 1.9.20에서는 이전에 더 이상 사용되지 않던 여러 타겟도 제거했습니다. 즉 다음과 같습니다.

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

현재 [지원되는 타겟](native-target-support)의 전체 목록을 참조하세요.

## Kotlin Multiplatform

Kotlin 1.9.20은 Kotlin Multiplatform의 안정화에 중점을 두고 있으며 새로운 프로젝트 마법사 및 기타 주목할 만한 기능을 통해 개발자 경험을 개선하기 위한 새로운 단계를 수행합니다.

* [Kotlin Multiplatform 안정화](#kotlin-multiplatform-is-stable)
* [멀티플랫폼 프로젝트 구성을 위한 템플릿](#template-for-configuring-multiplatform-projects)
* [새로운 프로젝트 마법사](#new-project-wizard)
* [Gradle 구성 캐시 완벽 지원](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* Gradle에서 새로운 표준 라이브러리 버전의 [더 쉬운 구성](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [타사 cinterop 라이브러리에 대한 기본 지원](#default-support-for-third-party-cinterop-libraries)
* Compose Multiplatform 프로젝트에서 [Kotlin/Native 컴파일 캐시 지원](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [호환성 지침](#compatibility-guidelines)

### Kotlin Multiplatform 안정화

1.  9.20 릴리스는 Kotlin 진화의 중요한 이정표를 나타냅니다. [Kotlin Multiplatform](multiplatform-intro)이 마침내
안정화되었습니다. 즉, 기술을 프로젝트에서 안전하게 사용할 수 있으며 프로덕션에 100% 사용할 수 있습니다. 또한 Kotlin Multiplatform의 추가 개발은 당사의 엄격한 [역방향 호환성 규칙](https://kotlinfoundation.org/language-committee-guidelines/)에 따라 계속됩니다.

Kotlin Multiplatform의 일부 고급 기능은 여전히 진화하고 있습니다. 이러한 기능을 사용하는 경우 사용 중인 기능의 현재 안정성 상태를 설명하는 경고가 표시됩니다. IntelliJ IDEA에서 실험적 기능을 사용하기 전에 **Settings**(설정) | **Advanced Settings**(고급 설정) | **Kotlin** | **Experimental Multiplatform**(실험적 멀티플랫폼)에서 명시적으로 활성화해야 합니다.

* [Kotlin 블로그](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)를 방문하여 Kotlin Multiplatform 안정화 및 향후 계획에 대해 자세히 알아보세요.
* [Multiplatform 호환성 가이드](multiplatform-compatibility-guide)를 확인하여 안정화 과정에서 이루어진 중요한 변경 사항을 확인하세요.
* 이 릴리스에서 부분적으로 안정화된 Kotlin Multiplatform의 중요한 부분인 [예상 선언 및 실제 선언 메커니즘](multiplatform-expect-actual)에 대해 읽어보세요.

### 멀티플랫폼 프로젝트 구성을 위한 템플릿

Kotlin 1.9.20부터 Kotlin Gradle 플러그인은 인기 있는 멀티플랫폼 시나리오에 대한 공유 소스 세트를 자동으로 만듭니다.
프로젝트 설정이 이러한 시나리오 중 하나인 경우 소스 세트 계층 구조를 수동으로 구성할 필요가 없습니다.
프로젝트에 필요한 타겟을 명시적으로 지정하기만 하면 됩니다.

Kotlin Gradle 플러그인의 새로운 기능인 기본 계층 구조 템플릿 덕분에 설정이 더 쉬워졌습니다.
플러그인에 내장된 소스 세트 계층 구조의 미리 정의된 템플릿입니다.
여기에는 선언한 타겟에 대해 Kotlin이 자동으로 만드는 중간 소스 세트가 포함됩니다.
[전체 템플릿을 참조하세요](#see-the-full-hierarchy-template).

#### 프로젝트를 더 쉽게 만들기

Android 및 iPhone 장치를 모두 대상으로 하고 Apple 실리콘 MacBook에서 개발되는 멀티플랫폼 프로젝트를 고려해 보겠습니다.
이 프로젝트가 Kotlin의 다른 버전 간에 어떻게 설정되어 있는지 비교해 보세요.
<table>
<tr>
<td>
Kotlin 1.9.0 및 이전 버전(표준 설정)
</td>
<td>
Kotlin 1.9.20
</td>
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

    // iosMain 소스 세트가 자동으로 생성됩니다.
}
```
</td>
</tr>
</table>

기본 계층 구조 템플릿을 사용하면 프로젝트 설정을 위해 필요한 상용구 코드의 양이 상당히 줄어듭니다.

코드에서 `androidTarget`, `iosArm64` 및 `iosSimulatorArm64` 타겟을 선언하면 Kotlin Gradle 플러그인이
템플릿에서 적합한 공유 소스 세트를 찾아 생성합니다. 결과 계층 구조는 다음과 같습니다.

<img src="/img/default-hierarchy-example.svg" alt="사용 중인 기본 타겟 계층 구조의 예" width="350" style={{verticalAlign: 'middle'}}/>

녹색 소스 세트는 실제로 프로젝트에서 생성되어 포함되고 기본 템플릿의 회색 소스 세트는 무시됩니다.

#### 소스 세트에 대한 완성 사용

생성된 프로젝트 구조로 더 쉽게 작업할 수 있도록 IntelliJ IDEA는 이제 기본 계층 구조 템플릿으로 생성된 소스 세트에 대한 완성을 제공합니다.

<img src="/img/multiplatform-hierarchy-completion.animated.gif" alt="소스 세트 이름에 대한 IDE 완성" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

Kotlin은 또한 해당 타겟을 선언하지 않았기 때문에 존재하지 않는 소스 세트에 액세스하려고 하면 경고합니다.
아래 예제에는 JVM 타겟이 없습니다(`androidTarget`만 해당되며 동일하지 않음). 그러나 `jvmMain` 소스 세트를 사용해 보겠습니다.
어떻게 되는지 확인해 보겠습니다.

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

이 경우 Kotlin은 빌드 로그에 경고를 보고합니다.

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* `<-` register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 타겟 계층 구조 설정

Kotlin 1.9.20부터 기본 계층 구조 템플릿이 자동으로 활성화됩니다. 대부분의 경우 추가 설정이 필요하지 않습니다.

그러나 1.9.20 이전에 생성된 기존 프로젝트를 마이그레이션하는 경우 이전에 `dependsOn()` 호출을 사용하여 중간 소스를 수동으로 도입한 경우 경고가 발생할 수 있습니다. 이 문제를 해결하려면 다음을 수행하세요.

* 중간 소스 세트가 현재 기본 계층 구조 템플릿으로 덮여 있는 경우 모든 수동 `dependsOn()`
  호출 및 `by creating` 구문으로 생성된 소스 세트를 제거합니다.

  모든 기본 소스 세트 목록을 확인하려면 [전체 계층 구조 템플릿](#see-the-full-hierarchy-template)을 참조하세요.

* 기본 계층 구조 템플릿이 제공하지 않는 추가 소스 세트(예:
  macOS와 JVM 타겟 간에 코드를 공유하는 소스 세트)를 사용하려면 `applyDefaultHierarchyTemplate()`을 사용하여 템플릿을 명시적으로 다시 적용하고 평소와 같이 `dependsOn()`을 사용하여 추가 소스 세트를 수동으로 구성하여 계층 구조를 조정합니다.

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 기본 계층 구조를 명시적으로 적용합니다. 예를 들어 iosMain 소스 세트가 생성됩니다.
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 추가 jvmAndMacos 소스 세트 생성
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* 프로젝트에 이미 템플릿에서 생성된 것과 정확히 동일한 이름을 가진 소스 세트가 있지만
  서로 다른 타겟 세트 간에 공유되는 경우 현재 템플릿의 소스 세트 간의 기본 `dependsOn` 관계를 수정할 방법이 없습니다.

  여기서 사용할 수 있는 한 가지 옵션은 기본 계층 구조 템플릿에서 또는 수동으로 생성된 템플릿에서 목적에 맞는 다른 소스 세트를 찾는 것입니다. 다른 옵션은 템플릿을 완전히 옵트아웃하는 것입니다.

  옵트아웃하려면 `gradle.properties`에 `kotlin.mpp.applyDefaultHierarchyTemplate=false`를 추가하고 다른 모든
  소스 세트를 수동으로 구성합니다.

  이러한 경우 설정 프로세스를 단순화하기 위해 고유한 계층 구조 템플릿을 만들기 위한 API를 현재 개발 중입니다.

#### 전체 계층 구조 템플릿 보기

프로젝트가 컴파일될 타겟을 선언하면
플러그인은 템플릿에서 공유 소스 세트를 선택하고 프로젝트에서 생성합니다.

<img src="/img/full-template-hierarchy.svg" alt="기본 계층 구조 템플릿" style={{verticalAlign: 'middle'}}/>
:::note
이 예제에서는 `Main` 접미사를 생략하고 프로젝트의 프로덕션 부분만 보여줍니다.
(예: `commonMain` 대신 `common` 사용). 그러나 `*Test` 소스에도 모든 것이 동일합니다.

### 새로운 프로젝트 마법사

JetBrains 팀은 플랫폼 간 프로젝트를 만드는 새로운 방법인 [Kotlin Multiplatform 웹 마법사](https://kmp.jetbrains.com)를 소개합니다.

이 새로운 Kotlin Multiplatform 마법사의 첫 번째 구현에서는 가장 인기 있는 Kotlin Multiplatform을 다룹니다.
사용 사례. 이전 프로젝트 템플릿에 대한 모든 피드백을 통합하고 아키텍처를 최대한 강력하고
신뢰할 수 있도록 만듭니다.

새로운 마법사는 통합 백엔드와
다양한 프런트 엔드를 가질 수 있는 분산 아키텍처를 가지고 있으며 웹 버전이 첫 번째 단계입니다. IDE 버전 구현과
향후 명령줄 도구 생성을 모두 고려하고 있습니다. 웹에서는 항상 최신 버전의 마법사를 사용할 수 있지만
IDE에서는 다음 릴리스를 기다려야 합니다.

새로운 마법사를 사용하면 프로젝트 설정이 그 어느 때보다 쉬워졌습니다.
모바일, 서버 및 데스크톱 개발을 위한 타겟 플랫폼을 선택하여 프로젝트를 필요에 맞게 조정할 수 있습니다. 또한 향후 릴리스에서 웹 개발을 추가할 계획입니다.

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform 웹 마법사" width="400"/>

새로운 프로젝트 마법사는 이제 Kotlin으로 플랫폼 간 프로젝트를 만드는 데 선호되는 방법입니다. 1.9.20부터 Kotlin
플러그인은 더 이상 IntelliJ IDEA에서 **Kotlin Multiplatform** 프로젝트 마법사를 제공하지 않습니다.

새로운 마법사는 초기 설정을 쉽게 안내하여 온보딩 프로세스를 훨씬 원활하게 만듭니다.
문제가 발생하면 [YouTrack](https://kotl.in/issue)에 보고하여 마법사 사용 경험을 개선하는 데 도움을 주세요.

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="프로젝트 만들기" />
</a>

### Kotlin Multiplatform에서 Gradle 구성 캐시 완벽 지원

이전에 Kotlin 멀티플랫폼 라이브러리에서 사용할 수 있는 Gradle 구성 캐시의 [미리 보기](whatsnew19#preview-of-the-gradle-configuration-cache)를 소개했습니다. 1.9.20에서는 Kotlin Multiplatform 플러그인이 한 걸음 더 나아갑니다.

이제 [Kotlin CocoaPods Gradle 플러그인](native-cocoapods-dsl-reference)뿐만 아니라
`embedAndSignAppleFrameworkForXcode`와 같은 Xcode 빌드에 필요한 통합 작업에서도 Gradle 구성 캐시를 지원합니다.

이제 모든 멀티플랫폼 프로젝트에서 향상된 빌드 시간을 활용할 수 있습니다.
Gradle 구성 캐시는 후속 빌드를 위해 구성 단계의 결과를 재사용하여 빌드 프로세스 속도를 높입니다.
자세한 내용과 설정 지침은 [Gradle 설명서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)를 참조하세요.

### Gradle에서 새로운 표준 라이브러리 버전의 더 쉬운 구성

멀티플랫폼 프로젝트를 만들 때 표준 라이브러리(`stdlib`)에 대한 종속성이 자동으로 각
소스 세트에 추가됩니다. 이것이 멀티플랫폼 프로젝트를 시작하는 가장 쉬운 방법입니다.

이전에는 표준 라이브러리에 대한 종속성을 수동으로 구성하려면 각
소스 세트에 대해 개별적으로 구성해야 했습니다. `kotlin-stdlib:1.9.20`부터는 `commonMain` 루트 소스 세트에서 **한 번만** 종속성을 구성하면 됩니다.
<table>
<tr>
<td>
표준 라이브러리 버전 1.9.10 및 이전 버전
</td>
<td>
표준 라이브러리 버전 1.9.20
</td>
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
</tr>
</table>