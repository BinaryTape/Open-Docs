[//]: # (title: Kotlin 1.9.0의 새로운 기능)

_[출시일: 2023년 7월 6일](releases.md#release-details)_

Kotlin 1.9.0 릴리스가 출시되었으며 JVM용 K2 컴파일러가 이제 **베타** 단계에 진입했습니다. 또한, 주요 내용은 다음과 같습니다:

* [새로운 Kotlin K2 컴파일러 업데이트](#new-kotlin-k2-compiler-updates)
* [enum class values 함수의 안정적인 대체](#stable-replacement-of-the-enum-class-values-function)
* [열린 범위(open-ended range)를 위한 안정적인 `..<` 연산자](#stable-operator-for-open-ended-ranges)
* [이름으로 regex 캡처 그룹을 가져오는 새로운 공통 함수](#new-common-function-to-get-regex-capture-group-by-name)
* [상위 디렉터리를 생성하는 새로운 경로 유틸리티](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform의 Gradle 설정 캐시 미리 보기](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform의 Android 타겟 지원 변경 사항](#changes-to-android-target-support)
* [Kotlin/Native의 커스텀 메모리 할당자 미리 보기](#preview-of-custom-memory-allocator)
* [Kotlin/Native의 라이브러리 연결](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm의 크기 관련 최적화](#size-related-optimizations)

업데이트에 대한 간략한 개요는 다음 비디오에서도 확인할 수 있습니다:

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE 지원

1.9.0을 지원하는 Kotlin 플러그인은 다음 IDE에서 사용할 수 있습니다:

| IDE | 지원 버전 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 플러그인은 곧 출시될 Android Studio Giraffe (223) 및 Hedgehog (231)에 포함될 예정입니다.

Kotlin 1.9.0 플러그인은 곧 출시될 IntelliJ IDEA 2023.2에 포함될 예정입니다.

> Kotlin 아티팩트 및 의존성을 다운로드하려면, [Gradle 설정](#configure-gradle-settings)을 Maven Central Repository를 사용하도록 구성하세요.
>
{style="warning"}

## 새로운 Kotlin K2 컴파일러 업데이트

JetBrains의 Kotlin 팀은 K2 컴파일러의 안정화를 지속하고 있으며, 1.9.0 릴리스는 추가적인 발전을 선보입니다.
JVM용 K2 컴파일러는 이제 **베타** 단계에 있습니다.

이제 Kotlin/Native 및 멀티플랫폼 프로젝트에 대한 기본 지원도 제공됩니다.

### K2 컴파일러와 kapt 컴파일러 플러그인의 호환성

프로젝트에서 K2 컴파일러와 함께 [kapt 플러그인](kapt.md)을 사용할 수 있지만, 일부 제약이 있습니다.
`languageVersion`을 `2.0`으로 설정하더라도 kapt 컴파일러 플러그인은 여전히 이전 컴파일러를 사용합니다.

`languageVersion`이 `2.0`으로 설정된 프로젝트에서 kapt 컴파일러 플러그인을 실행하면, kapt는 자동으로
`1.9`로 전환되고 특정 버전 호환성 검사를 비활성화합니다. 이 동작은 다음 명령 인수를 포함하는 것과 동일합니다:
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

이러한 검사는 kapt 작업에만 비활성화됩니다. 다른 모든 컴파일 작업은 새로운 K2 컴파일러를 계속 사용합니다.

K2 컴파일러와 kapt를 사용하는 동안 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### 프로젝트에서 K2 컴파일러 사용해보기

1.9.0부터 Kotlin 2.0 출시 전까지, `kotlin.experimental.tryK2=true`
Gradle 속성을 `gradle.properties` 파일에 추가하여 K2 컴파일러를 쉽게 테스트할 수 있습니다. 다음 명령을 실행할 수도 있습니다:

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

이 Gradle 속성은 자동으로 언어 버전을 2.0으로 설정하고, 현재 컴파일러와 비교하여 K2 컴파일러를 사용하여 컴파일된 Kotlin
작업 수를 빌드 보고서에 업데이트합니다:

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 빌드 보고서

[Gradle 빌드 보고서](gradle-compilation-and-caches.md#build-reports)는 현재 컴파일러 또는 K2 컴파일러 중 어느 것이
코드를 컴파일하는 데 사용되었는지 보여줍니다. Kotlin 1.9.0에서는 [Gradle 빌드 스캔](https://scans.gradle.com/)에서 이 정보를 확인할 수 있습니다:

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

프로젝트에서 사용된 Kotlin 버전도 빌드 보고서에서 바로 확인할 수 있습니다:

```none
Task info:
  Kotlin language version: 1.9
```

> Gradle 8.0을 사용하는 경우, 특히 Gradle 설정 캐싱이 활성화된 경우 빌드 보고서에 문제가 발생할 수 있습니다.
> 이는 Gradle 8.1 이상에서 수정된 알려진 문제입니다.
>
{style="note"}

### 현재 K2 컴파일러 제약 사항

Gradle 프로젝트에서 K2를 활성화하면 다음과 같은 경우 Gradle 8.3 미만 버전을 사용하는 프로젝트에 영향을 미칠 수 있는 특정 제약 사항이 있습니다:

* `buildSrc`의 소스 코드 컴파일.
* 포함된 빌드에서의 Gradle 플러그인 컴파일.
* Gradle 8.3 미만 버전의 프로젝트에서 사용되는 다른 Gradle 플러그인 컴파일.
* Gradle 플러그인 의존성 빌드.

위에 언급된 문제에 직면하는 경우, 다음 단계를 통해 해결할 수 있습니다:

* `buildSrc`, 모든 Gradle 플러그인, 그리고 그 의존성에 대한 언어 버전을 설정합니다:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 프로젝트의 Gradle 버전을 8.3으로 업데이트합니다 (사용 가능할 때).

### 새로운 K2 컴파일러에 대한 피드백 남기기

모든 피드백을 환영합니다!

* K2 개발자에게 직접 피드백을 제공하세요. Kotlin Slack – [초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  후 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* 새로운 K2 컴파일러에서 발생한 모든 문제를 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.
* JetBrains가 K2 사용에 대한 익명 데이터를 수집할 수 있도록 **사용 통계 전송** 옵션을 [활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)하세요.

## 언어

Kotlin 1.9.0에서는 이전에 도입된 일부 새로운 언어 기능을 안정화하고 있습니다:
* [enum class values 함수의 대체](#stable-replacement-of-the-enum-class-values-function)
* [데이터 클래스와 대칭을 이루는 데이터 오브젝트](#stable-data-objects-for-symmetry-with-data-classes)
* [인라인 값 클래스에서 본문(body)이 있는 보조 생성자 지원](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum class values 함수의 안정적인 대체

1.8.20에서 enum 클래스의 `entries` 프로퍼티는 실험적 기능으로 도입되었습니다. `entries` 프로퍼티는
합성 `values()` 함수를 대체하는 현대적이고 성능이 우수한 기능입니다. 1.9.0에서는 `entries` 프로퍼티가 안정화되었습니다.

> `values()` 함수는 여전히 지원되지만, 대신 `entries`
> 프로퍼티를 사용하는 것을 권장합니다.
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

enum 클래스의 `entries` 프로퍼티에 대한 자세한 내용은 [Kotlin 1.8.20의 새로운 기능](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)을 참조하세요.

### 데이터 클래스와 대칭을 이루는 안정적인 데이터 오브젝트

[Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)에 도입된 데이터 오브젝트(data object) 선언은
이제 안정화되었습니다. 여기에는 데이터 클래스와의 대칭을 위해 추가된 함수인 `toString()`, `equals()`, `hashCode()`가 포함됩니다.

이 기능은 `sealed` 계층(예: `sealed class` 또는 `sealed interface` 계층)에 특히 유용합니다.
`data object` 선언은 `data class` 선언과 함께 편리하게 사용될 수 있기 때문입니다. 이 예시에서
`EndOfFile`을 일반 `object` 대신 `data object`로 선언하면, 수동으로 오버라이드할 필요 없이 자동으로 `toString()` 함수를 갖게 됩니다. 이는
함께 제공되는 데이터 클래스 정의와의 대칭을 유지합니다.

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```
{validate="false"}

자세한 내용은 [Kotlin 1.8.20의 새로운 기능](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)을 참조하세요.

### 인라인 값 클래스에서 본문(body)이 있는 보조 생성자 지원

Kotlin 1.9.0부터 [인라인 값 클래스](inline-classes.md)에서 본문이 있는 보조 생성자를 기본적으로 사용할 수 있습니다:

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30부터 허용:
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // Kotlin 1.9.0부터 기본적으로 허용:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

이전에는 Kotlin이 인라인 클래스에서 public 기본 생성자만 허용했습니다. 그 결과, 내부 값을 캡슐화하거나 특정 제약이 있는 값을 나타내는 인라인 클래스를 생성하는 것이 불가능했습니다.

Kotlin이 발전하면서 이러한 문제들은 해결되었습니다. Kotlin 1.4.30에서 `init` 블록에 대한 제약이 해제되었고, 이어서 Kotlin 1.8.20에서는 본문이 있는 보조 생성자의 미리보기가 제공되었습니다. 이제 이 기능들은 기본적으로 사용할 수 있습니다. Kotlin 인라인 클래스의 발전에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)에서 확인할 수 있습니다.

## Kotlin/JVM

버전 1.9.0부터 컴파일러는 JVM 20에 해당하는 바이트코드 버전으로 클래스를 생성할 수 있습니다. 또한, `JvmDefault` 어노테이션과 레거시 `-Xjvm-default` 모드의 지원 중단이 계속됩니다.

### JvmDefault 어노테이션 및 레거시 -Xjvm-default 모드의 지원 중단

Kotlin 1.5부터는 `JvmDefault` 어노테이션의 사용이 새로운 `-Xjvm-default` 모드인 `all` 및 `all-compatibility`를 선호하여 지원 중단되었습니다. Kotlin 1.4에 `JvmDefaultWithoutCompatibility`가 도입되고 Kotlin 1.6에 `JvmDefaultWithCompatibility`가 도입되면서, 이 모드들은 `DefaultImpls` 클래스 생성에 대한 포괄적인 제어를 제공하여 이전 Kotlin 코드와의 원활한 호환성을 보장합니다.

따라서 Kotlin 1.9.0에서는 `JvmDefault` 어노테이션이 더 이상 의미가 없어져 지원 중단으로 표시되며 오류를 발생시킵니다. 이 어노테이션은 결국 Kotlin에서 제거될 예정입니다.

## Kotlin/Native

이 릴리스는 다른 개선 사항과 함께 [Kotlin/Native 메모리 관리자](native-memory-manager.md)에 대한 추가적인 발전을 제공하여 견고성과 성능을 향상시켜야 합니다:

* [커스텀 메모리 할당자 미리 보기](#preview-of-custom-memory-allocator)
* [메인 스레드에서 Objective-C 또는 Swift 객체 할당 해제 훅](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [Kotlin/Native에서 상수 값 접근 시 객체 초기화 없음](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [Kotlin/Native에서 iOS 시뮬레이터 테스트를 위한 독립 실행형 모드 구성 기능](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native의 라이브러리 연결](#library-linkage-in-kotlin-native)

### 커스텀 메모리 할당자 미리 보기

Kotlin 1.9.0은 커스텀 메모리 할당자의 미리보기를 도입합니다. 이 할당 시스템은 [Kotlin/Native 메모리 관리자](native-memory-manager.md)의 런타임 성능을 향상시킵니다.

Kotlin/Native의 현재 객체 할당 시스템은 효율적인 가비지 컬렉션 기능을 갖지 않는 범용 할당자를 사용합니다. 이를 보완하기 위해 가비지 컬렉터(GC)가 모든 할당된 객체를 단일 목록으로 병합하기 전까지 스레드 로컬 연결 목록을 유지하며, 이는 스위핑(sweeping) 중에 순회될 수 있습니다. 이 접근 방식에는 몇 가지 성능적 단점이 있습니다:

* 스위핑 순서에 메모리 지역성(locality)이 부족하여 종종 흩어진 메모리 접근 패턴을 유발하고 잠재적인 성능 문제를 초래합니다.
* 연결 목록은 각 객체에 대해 추가 메모리를 필요로 하여 특히 작은 객체가 많은 경우 메모리 사용량을 증가시킵니다.
* 할당된 객체의 단일 목록은 스위핑을 병렬화하기 어렵게 만들어, 뮤테이터(mutator) 스레드가 GC 스레드보다 객체를 더 빠르게 할당하는 경우 메모리 사용 문제가 발생할 수 있습니다.

이러한 문제를 해결하기 위해 Kotlin 1.9.0은 커스텀 할당자의 미리보기를 도입합니다. 이 할당자는 시스템 메모리를 페이지로 나누어 순차적인 순서로 독립적인 스위핑을 허용합니다. 각 할당은 페이지 내의 메모리 블록이 되며, 페이지는 블록 크기를 추적합니다. 다양한 페이지 유형은 다양한 할당 크기에 최적화되어 있습니다. 메모리 블록의 연속적인 배열은 모든 할당된 블록을 효율적으로 순회할 수 있도록 보장합니다.

스레드가 메모리를 할당할 때, 할당 크기를 기반으로 적합한 페이지를 검색합니다. 스레드는 다양한 크기 범주에 대한 페이지 세트를 유지합니다. 일반적으로 주어진 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다. 그렇지 않은 경우, 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나, 스위핑이 필요하거나, 먼저 생성되어야 할 수 있습니다.

새로운 할당자는 여러 개의 독립적인 할당 공간을 동시에 가질 수 있도록 하여, Kotlin 팀이 성능을 더욱 향상시키기 위해 다양한 페이지 레이아웃을 실험할 수 있도록 합니다.

새로운 할당자의 설계에 대한 자세한 내용은 [이 README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)를 참조하세요.

#### 활성화 방법

`-Xallocator=custom` 컴파일러 옵션을 추가합니다:

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```
{validate="false"}

#### 피드백 남기기

커스텀 할당자를 개선하기 위해 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)에 피드백을 주시면 감사하겠습니다.

### 메인 스레드에서 Objective-C 또는 Swift 객체 할당 해제 훅

Kotlin 1.9.0부터, Objective-C 또는 Swift 객체 할당 해제 훅은 객체가 Kotlin으로 메인 스레드에서 전달될 경우 메인 스레드에서 호출됩니다. 이전 [Kotlin/Native 메모리 관리자](native-memory-manager.md)가 Objective-C 객체에 대한 참조를 처리하는 방식은 메모리 누수로 이어질 수 있었습니다. 우리는 새로운 동작이 메모리 관리자의 견고성을 향상시킬 것이라고 믿습니다.

Objective-C 객체가 Kotlin 코드에서 참조되는 경우를 생각해 봅시다. 예를 들어, 인수로 전달되거나, 함수에 의해 반환되거나, 컬렉션에서 검색될 때입니다. 이 경우 Kotlin은 Objective-C 객체에 대한 참조를 보유하는 자체 객체를 생성합니다. Kotlin 객체가 할당 해제될 때, Kotlin/Native 런타임은 `objc_release` 함수를 호출하여 Objective-C 참조를 해제합니다.

이전에는 Kotlin/Native 메모리 관리자가 특별한 GC 스레드에서 `objc_release`를 실행했습니다. 이것이 마지막 객체 참조인 경우, 객체는 할당 해제됩니다. Objective-C 객체가 Objective-C의 `dealloc` 메서드 또는 Swift의 `deinit` 블록과 같은 사용자 정의 할당 해제 훅을 가지고 있고, 이러한 훅이 특정 스레드에서 호출되기를 기대하는 경우 문제가 발생할 수 있습니다.

메인 스레드의 객체에 대한 훅은 일반적으로 해당 스레드에서 호출될 것을 기대하므로, Kotlin/Native 런타임은 이제
`objc_release`도 메인 스레드에서 호출합니다. 이는 Objective-C 객체가 메인 스레드에서 Kotlin으로 전달되어 Kotlin 피어 객체를 생성한 경우를 처리해야 합니다. 이는 메인 디스패치 큐가 처리되는 경우에만 작동하며, 이는 일반 UI 애플리케이션의 경우입니다. 메인 큐가 아니거나 객체가 메인 스레드 이외의 스레드에서 Kotlin으로 전달된 경우, `objc_release`는 이전과 같이 특별한 GC 스레드에서 호출됩니다.

#### 옵트아웃(Opt out) 방법

문제가 발생하는 경우, `gradle.properties` 파일에서 다음 옵션을 사용하여 이 동작을 비활성화할 수 있습니다:

```none
kotlin.native.binary.objcDisposeOnMain=false
```

그러한 경우를 [이슈 트래커](https://kotl.in/issue)에 주저하지 말고 보고해 주세요.

### Kotlin/Native에서 상수 값 접근 시 객체 초기화 없음

Kotlin 1.9.0부터, Kotlin/Native 백엔드는 `const val` 필드에 접근할 때 객체를 초기화하지 않습니다:

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // No initialization at first
    val x = MyObject    // Initialization occurs
    println(x.y)
}
```
{validate="false"}

이 동작은 이제 Kotlin/JVM과 통합되었습니다. Kotlin/JVM에서는 Java와 일관되게 구현되어 이 경우 객체가 결코 초기화되지 않습니다. 이 변경 사항 덕분에 Kotlin/Native 프로젝트에서 일부 성능 향상을 기대할 수 있습니다.

### Kotlin/Native에서 iOS 시뮬레이터 테스트를 위한 독립 실행형 모드 구성 기능

기본적으로 Kotlin/Native용 iOS 시뮬레이터 테스트를 실행할 때, 수동 시뮬레이터 부팅 및 종료를 피하기 위해 `--standalone` 플래그가 사용됩니다. 1.9.0에서는 이제 `standalone` 프로퍼티를 통해 Gradle 작업에서 이 플래그를 사용할지 여부를 구성할 수 있습니다. 기본적으로 `--standalone` 플래그가 사용되므로 독립 실행형 모드가 활성화됩니다.

`build.gradle.kts` 파일에서 독립 실행형 모드를 비활성화하는 방법의 예시는 다음과 같습니다:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> 독립 실행형 모드를 비활성화하면 시뮬레이터를 수동으로 부팅해야 합니다. CLI에서 시뮬레이터를 부팅하려면,
> 다음 명령을 사용할 수 있습니다:
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Native의 라이브러리 연결

Kotlin 1.9.0부터 Kotlin/Native 컴파일러는 Kotlin 라이브러리의 연결(linkage) 문제를 Kotlin/JVM과 동일하게 처리합니다.
한 타사 Kotlin 라이브러리의 개발자가 다른 타사 Kotlin 라이브러리가 사용하는 실험적(experimental) API에서 호환되지 않는 변경 사항을 만들 경우 이러한 문제에 직면할 수 있습니다.

이제 타사 Kotlin 라이브러리 간의 연결 문제가 발생해도 컴파일 중 빌드가 실패하지 않습니다. 대신, JVM에서와 마찬가지로 런타임에만 이러한 오류가 발생합니다.

Kotlin/Native 컴파일러는 라이브러리 연결 문제를 감지할 때마다 경고를 보고합니다. 이러한 경고는 컴파일 로그에서 확인할 수 있습니다. 예를 들면 다음과 같습니다:

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

프로젝트에서 이 동작을 추가로 구성하거나 비활성화할 수 있습니다:

* 컴파일 로그에서 이 경고를 보고 싶지 않다면, `-Xpartial-linkage-loglevel=INFO` 컴파일러 옵션으로 경고를 억제할 수 있습니다.
* 보고된 경고의 심각도를 `-Xpartial-linkage-loglevel=ERROR`로 설정하여 컴파일 오류로 올릴 수도 있습니다. 이 경우 컴파일이 실패하고 모든 오류를 컴파일 로그에서 확인할 수 있습니다. 이 옵션을 사용하여 연결 문제를 더 자세히 조사하세요.
* 이 기능으로 예기치 않은 문제가 발생하면, 언제든지 `-Xpartial-linkage=disable` 컴파일러 옵션으로 옵트아웃(opt out)할 수 있습니다. 그러한 경우를 [이슈 트래커](https://kotl.in/issue)에 주저하지 말고 보고해 주세요.

```kotlin
// Gradle 빌드 파일을 통해 컴파일러 옵션을 전달하는 예시.
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 연결 경고 억제:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 연결 경고를 오류로 상승:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 기능을 완전히 비활성화:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C interop 암시적 정수 변환을 위한 컴파일러 옵션

C interop을 위한 컴파일러 옵션을 도입하여 암시적 정수 변환을 사용할 수 있도록 했습니다. 신중한 고려 끝에, 이 기능은 여전히 개선의 여지가 있으며 최고 품질의 API를 목표로 하므로 의도치 않은 사용을 방지하기 위해 이 컴파일러 옵션을 도입했습니다.

이 코드 예시에서 암시적 정수 변환은 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)가 부호 없는 타입 `UInt`이고 `0`이 부호 있는 타입임에도 불구하고 `options = 0`을 허용합니다.

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```
{validate="false"}

네이티브 상호 운용 라이브러리에서 암시적 변환을 사용하려면 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` 컴파일러 옵션을 사용하세요.

이것을 Gradle `build.gradle.kts` 파일에서 다음과 같이 구성할 수 있습니다:
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatform은 개발자 경험을 향상시키기 위해 1.9.0에서 몇 가지 주목할 만한 업데이트를 받았습니다:

* [Android 타겟 지원 변경 사항](#changes-to-android-target-support)
* [새로운 Android 소스 세트 레이아웃 기본 활성화](#new-android-source-set-layout-enabled-by-default)
* [멀티플랫폼 프로젝트에서 Gradle 설정 캐시 미리 보기](#preview-of-the-gradle-configuration-cache)

### Android 타겟 지원 변경 사항

우리는 Kotlin Multiplatform을 안정화하기 위한 노력을 계속하고 있습니다. 필수적인 단계는 Android 타겟에 대한 일류 지원을 제공하는 것입니다. 앞으로 Google의 Android 팀이 Kotlin Multiplatform에서 Android를 지원하기 위한 자체 Gradle 플러그인을 제공할 것이라고 발표하게 되어 기쁩니다.

Google의 이 새로운 솔루션을 위한 길을 열기 위해, 우리는 현재 Kotlin DSL의 `android` 블록 이름을 1.9.0에서 변경하고 있습니다. 빌드 스크립트에서 `android` 블록의 모든 occurrences를 `androidTarget`으로 변경해 주세요. 이는 Google의 곧 출시될 DSL을 위해 `android` 이름을 확보하기 위한 임시 변경입니다.

Google 플러그인은 멀티플랫폼 프로젝트에서 Android와 작업하는 선호되는 방식이 될 것입니다. 준비가 되면 필요한 마이그레이션 지침을 제공하여 이전과 같이 짧은 `android` 이름을 사용할 수 있도록 할 것입니다.

### 새로운 Android 소스 세트 레이아웃 기본 활성화

Kotlin 1.9.0부터 새로운 Android 소스 세트 레이아웃이 기본값입니다. 이는 여러 면에서 혼란스러웠던 이전 디렉토리 명명 체계를 대체했습니다. 새로운 레이아웃은 여러 장점을 가지고 있습니다:

* 간소화된 타입 의미론 – 새로운 Android 소스 레이아웃은 다양한 타입의 소스 세트를 구별하는 데 도움이 되는 명확하고 일관된 명명 규칙을 제공합니다.
* 향상된 소스 디렉토리 레이아웃 – 새로운 레이아웃을 통해 `SourceDirectories` 배열이 더욱 일관성 있게 되어 코드를 구성하고 소스 파일을 찾는 것이 더 쉬워집니다.
* Gradle 설정에 대한 명확한 명명 체계 – 이 체계는 이제 `KotlinSourceSets` 및 `AndroidSourceSets` 모두에서 더 일관되고 예측 가능합니다.

새로운 레이아웃은 Android Gradle 플러그인 버전 7.0 이상을 필요로 하며 Android Studio 2022.3 이상에서 지원됩니다. `build.gradle(.kts)` 파일에서 필요한 변경 사항을 적용하려면 [마이그레이션 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)를 참조하세요.

### Gradle 설정 캐시 미리 보기

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0은 멀티플랫폼 라이브러리에서 [Gradle 설정 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)에 대한 지원을 제공합니다. 라이브러리 작성자라면 이미 향상된 빌드 성능의 이점을 누릴 수 있습니다.

Gradle 설정 캐시는 설정 단계의 결과를 후속 빌드에서 재사용하여 빌드 프로세스 속도를 높입니다. 이 기능은 Gradle 8.1부터 안정화되었습니다. 활성화하려면 [Gradle 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)의 지침을 따르세요.

> Kotlin Multiplatform 플러그인은 Xcode 통합 작업이나 [Kotlin CocoaPods Gradle 플러그인](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)과 함께 Gradle 설정 캐시를 아직 지원하지 않습니다. 이 기능은 향후 Kotlin 릴리스에서 추가될 예정입니다.
>
{style="note"}

## Kotlin/Wasm

Kotlin 팀은 새로운 Kotlin/Wasm 타겟에 대한 실험을 계속하고 있습니다. 이 릴리스는 몇 가지 성능 및
[크기 관련 최적화](#size-related-optimizations)와 [JavaScript interop 업데이트](#updates-in-javascript-interop)를 도입합니다.

### 크기 관련 최적화

Kotlin 1.9.0은 WebAssembly (Wasm) 프로젝트에 상당한 크기 개선을 도입합니다. 두 개의 "Hello World" 프로젝트를 비교했을 때,
Kotlin 1.9.0의 Wasm 코드 크기는 Kotlin 1.8.20보다 10배 이상 작아졌습니다.

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

이러한 크기 최적화는 Kotlin 코드로 Wasm 플랫폼을 타겟팅할 때 더 효율적인 리소스 활용과 향상된 성능을 가져옵니다.

### JavaScript interop 업데이트

이 Kotlin 업데이트는 Kotlin/Wasm을 위한 Kotlin과 JavaScript 간의 상호 운용성(interoperability)에 대한 변경 사항을 도입합니다. Kotlin/Wasm은
[실험적(Experimental)](components-stability.md#stability-levels-explained) 기능이므로, 상호 운용성에 특정 제약 사항이 적용됩니다.

#### Dynamic 타입의 제한

버전 1.9.0부터 Kotlin은 Kotlin/Wasm에서 `Dynamic` 타입의 사용을 더 이상 지원하지 않습니다. 이는 JavaScript 상호 운용성을 용이하게 하는 새로운 범용 `JsAny` 타입으로 대체되어 이제 지원 중단되었습니다.

자세한 내용은 [Kotlin/Wasm과 JavaScript의 상호 운용성](wasm-js-interop.md) 문서를 참조하세요.

#### 비-외부(non-external) 타입의 제한

Kotlin/Wasm은 값을 JavaScript로 전달하거나 JavaScript로부터 값을 받을 때 특정 Kotlin 정적 타입에 대한 변환을 지원합니다. 지원되는 타입은 다음과 같습니다:

* 부호 있는 숫자, `Boolean`, `Char`와 같은 기본 타입.
* `String`.
* 함수 타입.

다른 타입은 불투명한 참조로 변환 없이 전달되어, JavaScript와 Kotlin 서브타이핑 간의 불일치를 초래했습니다.

이를 해결하기 위해 Kotlin은 JavaScript interop을 잘 지원되는 타입 집합으로 제한합니다. Kotlin 1.9.0부터는 external,
기본(primitive), 문자열, 함수 타입만 Kotlin/Wasm JavaScript interop에서 지원됩니다. 또한, JavaScript interop에서 사용될 수 있는 Kotlin/Wasm 객체에 대한 핸들을 나타내기 위해 `JsReference`라는 별도의 명시적 타입이 도입되었습니다.

자세한 내용은 [Kotlin/Wasm과 JavaScript의 상호 운용성](wasm-js-interop.md) 문서를 참조하세요.

### Kotlin Playground의 Kotlin/Wasm

Kotlin Playground는 Kotlin/Wasm 타겟을 지원합니다.
Kotlin/Wasm을 타겟팅하는 Kotlin 코드를 작성하고, 실행하고, 공유할 수 있습니다. [확인해 보세요!](https://pl.kotl.in/HDFAvimga)

> Kotlin/Wasm을 사용하려면 브라우저에서 실험적 기능을 활성화해야 합니다.
>
> [이러한 기능을 활성화하는 방법 알아보기](wasm-troubleshooting.md).
>
{style="note"}

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 -> n + 1
    n == 0 -> ack(m - 1, 1)
    else -> ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-1-9-0-kotlin-wasm-playground"}

## Kotlin/JS

이 릴리스는 Kotlin/JS에 대한 업데이트를 도입하며, 여기에는 오래된 Kotlin/JS 컴파일러 제거, Kotlin/JS Gradle 플러그인 지원 중단, 그리고 ES2015에 대한 실험적 지원이 포함됩니다:

* [오래된 Kotlin/JS 컴파일러 제거](#removal-of-the-old-kotlin-js-compiler)
* [Kotlin/JS Gradle 플러그인 지원 중단](#deprecation-of-the-kotlin-js-gradle-plugin)
* [external enum 지원 중단](#deprecation-of-external-enum)
* [ES2015 클래스 및 모듈에 대한 실험적 지원](#experimental-support-for-es2015-classes-and-modules)
* [JS 프로덕션 배포의 기본 대상 변경](#changed-default-destination-of-js-production-distribution)
* [stdlib-js에서 org.w3c 선언 추출](#extract-org-w3c-declarations-from-stdlib-js)

> 버전 1.9.0부터는 [부분 라이브러리 연결](#library-linkage-in-kotlin-native)도 Kotlin/JS에 대해 활성화됩니다.
>
{style="note"}

### 오래된 Kotlin/JS 컴파일러 제거

Kotlin 1.8.0에서 우리는 IR 기반 백엔드가 [안정화](whatsnew18.md#stable-js-ir-compiler-backend)되었음을 [발표](whatsnew18.md#stable-js-ir-compiler-backend)했습니다.
그 이후로 컴파일러를 지정하지 않는 것이 오류가 되었고, 이전 컴파일러를 사용하면 경고가 발생했습니다.

Kotlin 1.9.0에서는 이전 백엔드를 사용하면 오류가 발생합니다. [마이그레이션 가이드](js-ir-migration.md)에 따라 IR 컴파일러로 마이그레이션하세요.

### Kotlin/JS Gradle 플러그인 지원 중단

Kotlin 1.9.0부터 `kotlin-js` Gradle 플러그인은
지원 중단(deprecated)됩니다. 대신 `js()` 타겟과 함께 `kotlin-multiplatform` Gradle 플러그인을 사용하는 것을 권장합니다.

Kotlin/JS Gradle 플러그인의 기능은 본질적으로 `kotlin-multiplatform` 플러그인과 중복되었으며 내부적으로 동일한 구현을 공유했습니다. 이러한 중복은 혼란을 야기하고 Kotlin 팀의 유지 보수 부담을 증가시켰습니다.

마이그레이션 지침은 [Kotlin Multiplatform 호환성 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)를 참조하세요. 가이드에서 다루지 않는 문제가 발견되면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### external enum 지원 중단

Kotlin 1.9.0에서는 `entries`와 같은 정적 enum 멤버가 Kotlin 외부에서는 존재할 수 없다는 문제로 인해 external enum의 사용이 지원 중단됩니다. 대신 object 서브클래스가 있는 external sealed 클래스를 사용하는 것을 권장합니다:

```kotlin
// Before
external enum class ExternalEnum { A, B }

// After
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```
{validate="false"}

object 서브클래스가 있는 external sealed 클래스로 전환함으로써, external enum과 유사한 기능을 달성하면서도 기본 메서드와 관련된 문제를 피할 수 있습니다.

Kotlin 1.9.0부터 external enum의 사용은 지원 중단으로 표시됩니다. 호환성 및 향후 유지 보수를 위해 제안된 external sealed 클래스 구현을 사용하도록 코드를 업데이트하는 것을 권장합니다.

### ES2015 클래스 및 모듈에 대한 실험적 지원

이 릴리스는 ES2015 모듈 및 ES2015 클래스 생성을 위한 [실험적(Experimental)](components-stability.md#stability-levels-explained) 지원을 도입합니다:
* 모듈은 코드베이스를 간소화하고 유지 보수성을 향상시키는 방법을 제공합니다.
* 클래스는 객체 지향 프로그래밍(OOP) 원칙을 통합하여 더 깨끗하고 직관적인 코드를 만들 수 있도록 합니다.

이러한 기능을 활성화하려면 `build.gradle.kts` 파일을 다음과 같이 업데이트하세요:

```kotlin
// build.gradle.kts
kotlin {
    js(IR) {
        useEsModules() // Enables ES2015 modules
        browser()
    }
}

// Enables ES2015 classes generation
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[ES2015 (ECMAScript 2015, ES6)에 대한 자세한 내용은 공식 문서](https://262.ecma-international.org/6.0/)를 참조하세요.

### JS 프로덕션 배포의 기본 대상 변경

Kotlin 1.9.0 이전에는 배포 대상 디렉토리가 `build/distributions`였습니다. 그러나 이 디렉토리는 Gradle 아카이브에 대한 공통 디렉토리입니다. 이 문제를 해결하기 위해 Kotlin 1.9.0에서는 기본 배포 대상 디렉토리를 `build/dist/<targetName>/<binaryName>`으로 변경했습니다.

예를 들어, `productionExecutable`은 `build/distributions`에 있었지만, Kotlin 1.9.0에서는 `build/dist/js/productionExecutable`에 있습니다.

> 이러한 빌드 결과를 사용하는 파이프라인이 있다면, 디렉토리를 업데이트해야 합니다.
>
{style="warning"}

### stdlib-js에서 org.w3c 선언 추출

Kotlin 1.9.0부터 `stdlib-js`에는 더 이상 `org.w3c` 선언이 포함되지 않습니다. 대신, 이러한 선언은 별도의 Gradle 의존성으로 이동되었습니다. `build.gradle.kts` 파일에 Kotlin Multiplatform Gradle 플러그인을 추가하면, 표준 라이브러리와 유사하게 이러한 선언이 프로젝트에 자동으로 포함됩니다.

수동으로 조치하거나 마이그레이션할 필요가 없습니다. 필요한 조정은 자동으로 처리됩니다.

## Gradle

Kotlin 1.9.0에는 새로운 Gradle 컴파일러 옵션과 더 많은 기능이 제공됩니다:

* [classpath 프로퍼티 제거됨](#removed-classpath-property)
* [새로운 Gradle 컴파일러 옵션](#new-compiler-options)
* [Kotlin/JVM을 위한 프로젝트 수준 컴파일러 옵션](#project-level-compiler-options-for-kotlin-jvm)
* [Kotlin/Native 모듈 이름을 위한 컴파일러 옵션](#compiler-option-for-kotlin-native-module-name)
* [공식 Kotlin 라이브러리를 위한 별도의 컴파일러 플러그인](#separate-compiler-plugins-for-official-kotlin-libraries)
* [최소 지원 버전 증가](#incremented-minimum-supported-version)
* [kapt는 Gradle에서 조기 태스크 생성(eager task creation)을 유발하지 않음](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [JVM 타겟 유효성 검사 모드의 프로그래밍 방식 구성](#programmatic-configuration-of-the-jvm-target-validation-mode)

### classpath 프로퍼티 제거됨

Kotlin 1.7.0에서 우리는 `KotlinCompile` 태스크의 `classpath` 프로퍼티에 대한 지원 중단(deprecation) 주기 시작을 발표했습니다. 지원 중단 수준은 Kotlin 1.8.0에서 `ERROR`로 상향되었습니다. 이 릴리스에서는 마침내 `classpath` 프로퍼티를 제거했습니다. 이제 모든 컴파일 태스크는 컴파일에 필요한 라이브러리 목록에 대해 `libraries` 입력을 사용해야 합니다.

### 새로운 컴파일러 옵션

Kotlin Gradle 플러그인은 이제 옵트인(opt-ins) 및 컴파일러의 프로그레시브 모드를 위한 새로운 프로퍼티를 제공합니다.

* 새로운 API를 옵트인하려면, 이제 `optIn` 프로퍼티를 사용하고 `optIn.set(listOf(a, b, c))`와 같이 문자열 목록을 전달할 수 있습니다.
* 프로그레시브 모드를 활성화하려면, `progressiveMode.set(true)`를 사용하세요.

### Kotlin/JVM을 위한 프로젝트 수준 컴파일러 옵션

Kotlin 1.9.0부터 새로운 `compilerOptions` 블록이 `kotlin` 구성 블록 내부에 제공됩니다:

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

이는 컴파일러 옵션을 훨씬 쉽게 구성할 수 있도록 합니다. 그러나 몇 가지 중요한 세부 사항에 유의해야 합니다:

* 이 구성은 프로젝트 수준에서만 작동합니다.
* Android 플러그인의 경우, 이 블록은 다음 객체와 동일하게 구성합니다:

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

* `android.kotlinOptions`와 `kotlin.compilerOptions` 구성 블록은 서로 오버라이드합니다. 빌드 파일의 가장 마지막(가장 낮은) 블록이 항상 적용됩니다.
* `moduleName`이 프로젝트 수준에서 구성된 경우, 컴파일러에 전달될 때 그 값이 변경될 수 있습니다. `main` 컴파일에서는 그렇지 않지만, 예를 들어 테스트 소스와 같은 다른 타입에서는 Kotlin Gradle 플러그인이 `_test` 접미사를 추가할 것입니다.
* `tasks.withType<KotlinJvmCompile>().configureEach {}` (또는 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`) 내부의 구성은 `kotlin.compilerOptions`와 `android.kotlinOptions`를 모두 오버라이드합니다.

### Kotlin/Native 모듈 이름을 위한 컴파일러 옵션

Kotlin/Native [`module-name`](compiler-reference.md#module-name-name-native) 컴파일러 옵션은 이제 Kotlin Gradle 플러그인에서 쉽게 사용할 수 있습니다.

이 옵션은 컴파일 모듈의 이름을 지정하며, Objective-C로 내보내지는 선언에 이름 접두사를 추가하는 데도 사용될 수 있습니다.

이제 Gradle 빌드 파일의 `compilerOptions` 블록에서 직접 모듈 이름을 설정할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>("compileKotlinLinuxX64") {
    compilerOptions {
        moduleName.set("my-module-name")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlinLinuxX64", org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile.class) {
    compilerOptions {
        moduleName = "my-module-name"
    }
}
```

</tab>
</tabs>

### 공식 Kotlin 라이브러리를 위한 별도의 컴파일러 플러그인

Kotlin 1.9.0은 공식 라이브러리를 위한 별도의 컴파일러 플러그인을 도입합니다. 이전에는 컴파일러 플러그인이 해당 Gradle 플러그인에 내장되어 있었습니다. 이로 인해 컴파일러 플러그인이 Gradle 빌드의 Kotlin 런타임 버전보다 높은 Kotlin 버전으로 컴파일된 경우 호환성 문제가 발생할 수 있었습니다.

이제 컴파일러 플러그인은 별도의 의존성으로 추가되므로, 더 이상 이전 Gradle 버전과의 호환성 문제에 직면하지 않을 것입니다. 새로운 접근 방식의 또 다른 주요 장점은 새로운 컴파일러 플러그인이 [Bazel](https://bazel.build/)과 같은 다른 빌드 시스템에서도 사용될 수 있다는 것입니다.

다음은 Maven Central에 게시하고 있는 새로운 컴파일러 플러그인 목록입니다:

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

모든 플러그인에는 `-embeddable` 대응(counterpart)이 있습니다. 예를 들어, `kotlin-allopen-compiler-plugin-embeddable`은 스크립팅 아티팩트의 기본 옵션인 `kotlin-compiler-embeddable` 아티팩트와 함께 작동하도록 설계되었습니다.

Gradle은 이 플러그인들을 컴파일러 인수로 추가합니다. 기존 프로젝트를 변경할 필요가 없습니다.

### 최소 지원 버전 증가

Kotlin 1.9.0부터 최소 지원 Android Gradle 플러그인 버전은 4.2.2입니다.

[Kotlin Gradle 플러그인의 사용 가능한 Gradle 버전과의 호환성](gradle-configure-project.md#apply-the-plugin) 문서를 참조하세요.

### kapt는 Gradle에서 조기 태스크 생성(eager task creation)을 유발하지 않음

1.9.0 이전에는 [kapt 컴파일러 플러그인](kapt.md)이 Kotlin 컴파일 태스크의 구성된 인스턴스를 요청하여 조기 태스크 생성을 유발했습니다. 이 동작은 Kotlin 1.9.0에서 수정되었습니다. `build.gradle.kts` 파일의 기본 구성을 사용하는 경우, 이 변경 사항의 영향을 받지 않습니다.

> 사용자 정의 구성을 사용하는 경우, 설정에 부정적인 영향을 미칠 수 있습니다.
> 예를 들어, Gradle의 태스크 API를 사용하여 `KotlinJvmCompile` 태스크를 수정했다면, `KaptGenerateStubs`
> 태스크도 빌드 스크립트에서 유사하게 수정해야 합니다.
>
> 예를 들어, 스크립트가 `KotlinJvmCompile` 태스크에 대해 다음 구성을 가지고 있다면:
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // Your custom configuration }
> ```
> {validate="false"}
>
> 이 경우, `KaptGenerateStubs` 태스크에도 동일한 수정이 포함되어 있는지 확인해야 합니다:
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // Your custom configuration }
> ```
> {validate="false"}
>
{style="warning"}

자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)을 참조하세요.

### JVM 타겟 유효성 검사 모드의 프로그래밍 방식 구성

Kotlin 1.9.0 이전에는 Kotlin과 Java 간의 JVM 타겟 비호환성 감지를 조정하는 방법이 한 가지뿐이었습니다.
전체 프로젝트에 대해 `gradle.properties`에 `kotlin.jvm.target.validation.mode=ERROR`를 설정해야 했습니다.

이제 `build.gradle.kts` 파일에서 태스크 수준으로도 구성할 수 있습니다:

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 표준 라이브러리

Kotlin 1.9.0에는 표준 라이브러리에 대한 몇 가지 뛰어난 개선 사항이 있습니다:
* [`..<` 연산자](#stable-operator-for-open-ended-ranges)와 [time API](#stable-time-api)가 안정화되었습니다.
* [Kotlin/Native 표준 라이브러리가 철저히 검토되고 업데이트되었습니다](#the-kotlin-native-standard-library-s-journey-towards-stabilization).
* [`@Volatile` 어노테이션을 더 많은 플랫폼에서 사용할 수 있습니다](#stable-volatile-annotation).
* [이름으로 regex 캡처 그룹을 가져오는 **공통** 함수가 있습니다](#new-common-function-to-get-regex-capture-group-by-name).
* [16진수를 포맷하고 파싱하기 위한 `HexFormat` 클래스가 도입되었습니다](#new-hexformat-class-to-format-and-parse-hexadecimals).

### 열린 범위(open-ended range)를 위한 안정적인 `..<` 연산자

[Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)에 도입되어 1.8.0에 안정화된 새로운 `..<` 연산자가
1.9.0에서는 열린 범위와 관련된 표준 라이브러리 API도 안정화되었습니다.

우리의 연구에 따르면 새로운 `..<` 연산자는 열린 범위가 선언되었을 때 이해하기 쉽게 만듭니다. [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) infix 함수를 사용하는 경우, 상한이 포함된다고 오해하기 쉽습니다.

`until` 함수를 사용한 예시는 다음과 같습니다:

```kotlin
fun main() {
    for (number in 2 until 10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

새로운 `..<` 연산자를 사용한 예시는 다음과 같습니다:

```kotlin
fun main() {
    for (number in 2..<10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

> IntelliJ IDEA 버전 2023.1.1부터 `..<` 연산자를 사용할 수 있는 경우를 강조하는
> 새로운 코드 검사가 제공됩니다.
>
{style="note"}

이 연산자로 무엇을 할 수 있는지에 대한 자세한 내용은 [Kotlin 1.7.20의 새로운 기능](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)을 참조하세요.

### 안정적인 time API

1.3.50부터 새로운 시간 측정 API를 미리 보았습니다. API의 기간 부분은 1.6.0에 안정화되었습니다. 1.9.0에서는 나머지 시간 측정 API가 안정화되었습니다.

이전 시간 API는 `measureTimeMillis` 및 `measureNanoTime` 함수를 제공했는데, 이는 직관적으로 사용하기 어려웠습니다. 둘 다 다른 단위로 시간을 측정한다는 것은 명확하지만, `measureTimeMillis`가 [실제 경과 시간(wall clock)](https://en.wikipedia.org/wiki/Elapsed_real_time)을 사용하여 시간을 측정하는 반면 `measureNanoTime`은 단조로운 시간 출처(monotonic time source)를 사용한다는 것은 명확하지 않습니다. 새로운 시간 API는 이러한 문제 및 기타 문제를 해결하여 API를 더 사용자 친화적으로 만듭니다.

새로운 time API를 사용하면 쉽게 다음을 수행할 수 있습니다:
* 원하는 시간 단위로 단조로운 시간 출처를 사용하여 코드 실행에 걸린 시간을 측정합니다.
* 특정 순간을 표시합니다.
* 두 시간 순간 사이의 차이를 비교하고 찾습니다.
* 특정 시간 순간 이후 얼마나 시간이 지났는지 확인합니다.
* 현재 시간이 특정 시간 순간을 지났는지 확인합니다.

#### 코드 실행 시간 측정

코드 블록 실행에 걸린 시간을 측정하려면 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)
인라인 함수를 사용합니다.

코드 블록 실행에 걸린 시간을 측정하고 **동시에** 코드 블록의 결과를 반환하려면
[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 인라인 함수를 사용합니다.

기본적으로 두 함수 모두 단조로운 시간 출처를 사용합니다. 그러나 실제 경과 시간 출처를 사용하려면 사용할 수 있습니다.
예를 들어, Android에서는 기본 시간 출처인 `System.nanoTime()`이
기기가 활성화된 동안에만 시간을 측정합니다. 기기가 절전 모드에 진입하면 시간 추적을 잃습니다. 기기가 절전 모드인 동안에도 시간을 추적하려면
대신 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())를 사용하는 시간 출처를 생성할 수 있습니다:

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 시간의 차이 표시 및 측정

시간의 특정 순간을 표시하려면 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
인터페이스와 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 함수를 사용하여
[`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)를 생성합니다. 동일한 시간 출처의 `TimeMark` 간의 차이를 측정하려면
뺄셈 연산자(`-`)를 사용합니다:

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds.
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other.
    println(mark2 > mark1) // This is true, as mark2 was captured later than mark1.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

마감일이 지났는지 또는 시간 초과에 도달했는지 확인하려면 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
및 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)
확장 함수를 사용합니다:

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // It hasn't been 5 seconds yet
    println(mark2.hasPassedNow())
    // false

    // Wait six seconds
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 표준 라이브러리의 안정화 여정

Kotlin/Native용 표준 라이브러리가 계속 성장함에 따라, 높은 표준을 충족하는지 확인하기 위해 완전한 검토를 할 때가 되었다고 판단했습니다. 이의 일환으로, 우리는 **모든** 기존 public 시그니처를 신중하게 검토했습니다. 각 시그니처에 대해 우리는 다음을 고려했습니다:

* 고유한 목적을 가지고 있는지.
* 다른 Kotlin API와 일관성이 있는지.
* JVM용 대응 API와 유사한 동작을 하는지.
* 미래에도 사용할 수 있는지(future-proof) 여부.

이러한 고려 사항을 바탕으로, 우리는 다음 결정 중 하나를 내렸습니다:
* 안정화(Stable)했습니다.
* 실험적(Experimental)으로 만들었습니다.
* `private`으로 표시했습니다.
* 동작을 수정했습니다.
* 다른 위치로 이동했습니다.
* 지원 중단(Deprecated)했습니다.
* 더 이상 사용되지 않는 것으로 표시했습니다(Obsolete).

> 기존 시그니처가:
> * 다른 패키지로 이동된 경우, 시그니처는 여전히 원래 패키지에 존재하지만, `WARNING` 수준으로 지원 중단되었습니다. IntelliJ IDEA는 코드 검사 시 자동으로 대체를 제안합니다.
> * 지원 중단된 경우, `WARNING` 수준으로 지원 중단되었습니다.
> * 더 이상 사용되지 않는 것으로 표시된 경우, 계속 사용할 수 있지만, 향후 교체될 것입니다.
>
{style="note"}

여기서 검토 결과를 모두 나열하지는 않겠지만, 주요 내용은 다음과 같습니다:
* Atomics API를 안정화했습니다.
* [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)을 실험적으로 만들었으며 이제 패키지를 사용하기 위해 다른 옵트인(opt-in)이 필요합니다. 자세한 내용은 [명시적 C-상호 운용성 안정성 보장](#explicit-c-interoperability-stability-guarantees)을 참조하세요.
* [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 클래스 및 관련 API를 더 이상 사용되지 않는 것으로 표시했습니다.
* [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 클래스를 더 이상 사용되지 않는 것으로 표시했습니다.
* `kotlin.native.internal` 패키지의 모든 `public` API를 `private`으로 표시하거나 다른 패키지로 이동했습니다.

#### 명시적 C-상호 운용성 안정성 보장

API의 높은 품질을 유지하기 위해 우리는 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)을
실험적(Experimental)으로 만들기로 결정했습니다. `kotlinx.cinterop`은 철저히 테스트되고 검증되었지만, 안정화하기에 충분하다고 만족하기 전까지는 여전히 개선의 여지가 있습니다. 이 API를 상호 운용성을 위해 사용하되, 프로젝트의 특정 영역으로 사용을 제한하는 것을 권장합니다. 이는 이 API를 안정화하기 위해 발전시키기 시작할 때 마이그레이션을 더 쉽게 만들 것입니다.

포인터와 같은 C-스타일의 외부(foreign) API를 사용하려면 `@OptIn(ExperimentalForeignApi)`로 옵트인해야 합니다. 그렇지 않으면 코드가 컴파일되지 않습니다.

Objective-C/Swift 상호 운용성을 다루는 나머지 `kotlinx.cinterop`을 사용하려면
`@OptIn(BetaInteropApi)`로 옵트인해야 합니다. 이 API를 옵트인 없이 사용하려고 하면 코드는 컴파일되지만 컴파일러는 예상할 수 있는 동작에 대한 명확한 설명을 제공하는 경고를 발생시킵니다.

이러한 어노테이션에 대한 자세한 내용은 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 소스 코드를 참조하세요.

이 검토의 **모든** 변경 사항에 대한 자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-55765)을 참조하세요.

모든 피드백을 환영합니다! [티켓](https://youtrack.jetbrains.com/issue/KT-57728)에 직접 댓글을 달아 피드백을 제공할 수 있습니다.

### 안정적인 @Volatile 어노테이션

`var` 프로퍼티에 `@Volatile` 어노테이션을 달면, 백킹 필드가 읽기/쓰기가 원자적(atomic)이고 쓰기 작업이 항상 다른 스레드에 가시적이도록 표시됩니다.

1.8.20 이전에는 [`kotlin.jvm.Volatile` 어노테이션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)이
공통 표준 라이브러리에 제공되었습니다. 그러나 이 어노테이션은 JVM에서만 유효했습니다. 다른 플랫폼에서 사용하면 무시되어 오류가 발생했습니다.

1.8.20에서는 실험적인 공통 어노테이션인 `kotlin.concurrent.Volatile`을 도입했으며, JVM과 Kotlin/Native 모두에서 미리 볼 수 있었습니다.

1.9.0에서는 `kotlin.concurrent.Volatile`이 안정화되었습니다. 멀티플랫폼 프로젝트에서 `kotlin.jvm.Volatile`을 사용하는 경우
`kotlin.concurrent.Volatile`로 마이그레이션하는 것을 권장합니다.

### 이름으로 regex 캡처 그룹을 가져오는 새로운 공통 함수

1.9.0 이전에는 모든 플랫폼에 정규 표현식 매치에서 이름으로 정규 표현식 캡처 그룹을 가져오는 고유한 확장 기능이 있었습니다. 그러나 공통 함수는 없었습니다. Kotlin 1.8.0 이전에는 표준 라이브러리가 여전히 JVM 타겟 1.6 및 1.7을 지원했기 때문에 공통 함수를 가질 수 없었습니다.

Kotlin 1.8.0부터 표준 라이브러리는 JVM 타겟 1.8로 컴파일됩니다. 따라서 1.9.0에서는 이제 **공통**
[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 함수를 사용하여
정규 표현식 매치에 대해 이름으로 그룹의 내용을 검색할 수 있습니다. 이는 특정 캡처 그룹에 속하는 정규 표현식 매치의 결과에 접근하려는 경우에 유용합니다.

다음은 `city`, `state`, `areaCode` 세 개의 캡처 그룹을 포함하는 정규 표현식의 예시입니다. 이 그룹 이름을 사용하여 일치하는 값에 접근할 수 있습니다:

```kotlin
fun main() {
    val regex = """\b(?<city>[A-Za-z\s]+),\s(?<state>[A-Z]{2}):\s(?<areaCode>[0-9]{3})\b""".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    
    val match = regex.find(input)!!
    println(match.groups["city"]?.value)
    // Austin
    println(match.groups["state"]?.value)
    // TX
    println(match.groups["areaCode"]?.value)
    // 123
}
```
{validate="false"}

### 상위 디렉터리를 생성하는 새로운 경로 유틸리티

1.9.0에는 필요한 모든 상위 디렉터리와 함께 새 파일을 생성하는 데 사용할 수 있는 새로운 `createParentDirectories()` 확장 함수가 있습니다. `createParentDirectories()`에 파일 경로를 제공하면 상위 디렉터리가 이미 존재하는지 확인합니다. 존재한다면 아무 작업도 하지 않습니다. 그러나 존재하지 않는다면, 직접 생성해 줍니다.

`createParentDirectories()`는 파일을 복사할 때 특히 유용합니다. 예를 들어, `copyToRecursively()` 함수와 함께 사용할 수 있습니다:

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 16진수를 포맷하고 파싱하기 위한 새로운 HexFormat 클래스

> 새로운 `HexFormat` 클래스 및 관련 확장 함수는 [실험적(Experimental)](components-stability.md#stability-levels-explained) 기능이므로,
> 이를 사용하려면 `@OptIn(ExperimentalStdlibApi::class)` 또는 컴파일러 인수
> `-opt-in=kotlin.ExperimentalStdlibApi`로 옵트인해야 합니다.
>
{style="warning"}

1.9.0에서는 [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 클래스 및 관련
확장 함수가 숫자 값과 16진수 문자열 간의 변환을 허용하는 실험적 기능으로 제공됩니다. 특히, 확장 함수를 사용하여 16진수 문자열과
`ByteArrays` 또는 다른 숫자 타입(`Int`, `Short`, `Long`) 간에 변환할 수 있습니다.

예를 들어:

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 클래스는 `HexFormat{}` 빌더로 구성할 수 있는 포맷팅 옵션을 포함합니다.

`ByteArrays`로 작업하는 경우, 속성으로 구성할 수 있는 다음 옵션이 있습니다:

| 옵션 | 설명 |
|--|--|
| `upperCase` | 16진수 숫자가 대문자 또는 소문자인지 여부. 기본적으로 소문자로 간주됩니다. `upperCase = false`. |
| `bytes.bytesPerLine` | 한 줄당 최대 바이트 수. |
| `bytes.bytesPerGroup` | 한 그룹당 최대 바이트 수. |
| `bytes.bytesSeparator` | 바이트 간의 구분자. 기본적으로 없음. |
| `bytes.bytesPrefix` | 각 바이트의 두 자리 16진수 표현 바로 앞에 오는 문자열. 기본적으로 없음. |
| `bytes.bytesSuffix` | 각 바이트의 두 자리 16진수 표현 바로 뒤에 오는 문자열. 기본적으로 없음. |

예를 들어:

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// HexFormat{} 빌더를 사용하여 16진수 문자열을 콜론으로 구분합니다
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// HexFormat{} 빌더를 사용하여:
// * 16진수 문자열을 대문자로 만듭니다
// * 바이트를 쌍으로 그룹화합니다
// * 마침표로 구분합니다
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

숫자 타입으로 작업하는 경우, 속성으로 구성할 수 있는 다음 옵션이 있습니다:

| 옵션 | 설명 |
|--|--|
| `number.prefix` | 16진수 문자열의 접두사. 기본적으로 없음. |
| `number.suffix` | 16진수 문자열의 접미사. 기본적으로 없음. |
| `number.removeLeadingZeros` | 16진수 문자열에서 선행 0을 제거할지 여부. 기본적으로 선행 0은 제거되지 않습니다. `number.removeLeadingZeros = false` |

예를 들어:

```kotlin
// HexFormat{} 빌더를 사용하여 "0x" 접두사가 있는 16진수를 파싱합니다.
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 문서 업데이트

Kotlin 문서는 몇 가지 주목할 만한 변경 사항을 받았습니다:
* [Kotlin 둘러보기](kotlin-tour-welcome.md) – 이론과 실습을 포함한 챕터로 Kotlin 프로그래밍 언어의 기본을 배웁니다.
* [Android 소스 세트 레이아웃](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 새로운 Android 소스 세트 레이아웃에 대해 배웁니다.
* [Kotlin Multiplatform 호환성 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – Kotlin Multiplatform 프로젝트를 개발하는 동안 발생할 수 있는 호환되지 않는 변경 사항에 대해 배웁니다.
* [Kotlin Wasm](wasm-overview.md) – Kotlin/Wasm과 Kotlin Multiplatform 프로젝트에서 이를 사용하는 방법에 대해 배웁니다.

## Kotlin 1.9.0 설치

### IDE 버전 확인

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 및 2023.1.1은 Kotlin 플러그인을 버전 1.9.0으로 자동으로 업데이트할 것을 제안합니다. IntelliJ IDEA 2023.2에는 Kotlin 1.9.0 플러그인이 포함될 예정입니다.

Android Studio Giraffe (223) 및 Hedgehog (231)은 곧 출시될 릴리스에서 Kotlin 1.9.0을 지원할 예정입니다.

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)에서 다운로드할 수 있습니다.

### Gradle 설정 구성

Kotlin 아티팩트 및 의존성을 다운로드하려면, `settings.gradle(.kts)` 파일을 업데이트하여 Maven Central Repository를 사용하도록 합니다:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

저장소가 지정되지 않으면 Gradle은 지원이 종료된 JCenter 저장소를 사용하며, 이로 인해 Kotlin 아티팩트에 문제가 발생할 수 있습니다.

## Kotlin 1.9.0 호환성 가이드

Kotlin 1.9.0은 [기능 릴리스](kotlin-evolution-principles.md#language-and-tooling-releases)이므로, 이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항을 가져올 수 있습니다. 이러한 변경 사항의 자세한 목록은 [Kotlin 1.9.0 호환성 가이드](compatibility-guide-19.md)에서 확인할 수 있습니다.