[//]: # (title: Kotlin 1.9.0의 새로운 기능)

_[출시일: 2023년 7월 6일](releases.md#release-details)_

Kotlin 1.9.0 릴리스가 출시되었으며, JVM용 K2 컴파일러는 이제 **베타** 단계에 있습니다. 또한, 주요 변경 사항은 다음과 같습니다:

* [새로운 Kotlin K2 컴파일러 업데이트](#new-kotlin-k2-compiler-updates)
* [enum 클래스 `values` 함수의 안정적인 대체](#stable-replacement-of-the-enum-class-values-function)
* [열린 범위(open-ended ranges)를 위한 안정적인 `..<` 연산자](#stable-operator-for-open-ended-ranges)
* [정규식 캡처 그룹을 이름으로 가져오는 새로운 공통 함수](#new-common-function-to-get-regex-capture-group-by-name)
* [상위 디렉터리를 생성하는 새로운 경로 유틸리티](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform에서 Gradle 설정 캐시 미리 보기](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform의 Android 대상 지원 변경 사항](#changes-to-android-target-support)
* [Kotlin/Native의 사용자 지정 메모리 할당기 미리 보기](#preview-of-custom-memory-allocator)
* [Kotlin/Native의 라이브러리 연결](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm의 크기 관련 최적화](#size-related-optimizations)

업데이트에 대한 간략한 개요는 다음 비디오에서도 확인할 수 있습니다:

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="Kotlin 1.9.0의 새로운 기능"/>

## IDE 지원

1.9.0을 지원하는 Kotlin 플러그인은 다음 IDE에서 사용할 수 있습니다:

| IDE | 지원 버전 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 플러그인은 Android Studio Giraffe (223) 및 Hedgehog (231)의 향후 릴리스에 포함될 예정입니다.

Kotlin 1.9.0 플러그인은 향후 릴리스에서 IntelliJ IDEA 2023.2에 포함될 예정입니다.

> Kotlin 아티팩트 및 종속성을 다운로드하려면 Maven Central Repository를 사용하도록 [Gradle 설정을 구성](#configure-gradle-settings)하세요.
>
{style="warning"}

## 새로운 Kotlin K2 컴파일러 업데이트

JetBrains의 Kotlin 팀은 K2 컴파일러를 계속 안정화하고 있으며, 1.9.0 릴리스에서는 추가적인 개선 사항을 도입합니다.
JVM용 K2 컴파일러는 이제 **베타** 단계에 있습니다.

이제 Kotlin/Native 및 멀티플랫폼 프로젝트에 대한 기본 지원도 제공됩니다.

### kapt 컴파일러 플러그인과 K2 컴파일러의 호환성

프로젝트에서 [kapt 플러그인](kapt.md)을 K2 컴파일러와 함께 사용할 수 있지만, 몇 가지 제한 사항이 있습니다.
`languageVersion`을 `2.0`으로 설정했음에도 불구하고 kapt 컴파일러 플러그인은 여전히 이전 컴파일러를 사용합니다.

`languageVersion`이 `2.0`으로 설정된 프로젝트에서 kapt 컴파일러 플러그인을 실행하면 kapt는 자동으로
`1.9`로 전환하고 특정 버전 호환성 검사를 비활성화합니다. 이 동작은 다음 명령 인수를 포함하는 것과 동일합니다:
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

이러한 검사는 kapt 작업에만 비활성화됩니다. 다른 모든 컴파일 작업은 계속해서 새로운 K2 컴파일러를 사용합니다.

K2 컴파일러와 함께 kapt를 사용할 때 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### 프로젝트에서 K2 컴파일러 사용해 보기

1.9.0부터 Kotlin 2.0 릴리스까지, `gradle.properties` 파일에 `kotlin.experimental.tryK2=true`
Gradle 속성을 추가하여 K2 컴파일러를 쉽게 테스트할 수 있습니다. 다음 명령을 실행할 수도 있습니다:

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

이 Gradle 속성은 자동으로 언어 버전을 2.0으로 설정하고, 현재 컴파일러와 비교하여 K2 컴파일러를 사용하여 컴파일된 Kotlin
작업 수를 빌드 리포트에 업데이트합니다:

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 빌드 리포트

[Gradle 빌드 리포트](gradle-compilation-and-caches.md#build-reports)는 코드를 컴파일하는 데 현재 컴파일러 또는 K2 컴파일러가
사용되었는지 보여줍니다. Kotlin 1.9.0에서는 [Gradle 빌드 스캔](https://scans.gradle.com/)에서 이 정보를 확인할 수 있습니다:

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

프로젝트에서 사용된 Kotlin 버전도 빌드 리포트에서 바로 확인할 수 있습니다:

```none
Task info:
  Kotlin language version: 1.9
```

> Gradle 8.0을 사용하는 경우, 빌드 리포트, 특히 Gradle 설정 캐싱이 활성화되었을 때 일부 문제가 발생할 수 있습니다.
> 이는 Gradle 8.1 이상에서 해결된 알려진 문제입니다.
>
{style="note"}

### 현재 K2 컴파일러 제한 사항

Gradle 프로젝트에서 K2를 활성화하면 다음과 같은 경우 Gradle 버전 8.3 미만을 사용하는 프로젝트에 영향을 미칠 수 있는 특정 제한 사항이 따릅니다:

* `buildSrc`의 소스 코드 컴파일.
* 포함된 빌드(included builds)의 Gradle 플러그인 컴파일.
* Gradle 버전 8.3 미만인 프로젝트에서 사용되는 다른 Gradle 플러그인 컴파일.
* Gradle 플러그인 종속성 빌드.

위에 언급된 문제 중 하나라도 발생하는 경우, 다음과 같은 조치를 취하여 해결할 수 있습니다:

* `buildSrc`, 모든 Gradle 플러그인 및 해당 종속성에 대한 언어 버전을 설정합니다:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 프로젝트의 Gradle 버전을 8.3으로 업데이트합니다 (사용 가능해지면).

### 새로운 K2 컴파일러에 대한 피드백 남기기

여러분의 모든 피드백을 환영합니다!

* Kotlin Slack의 K2 개발자에게 직접 피드백을 제공하세요 – [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  및 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널 참여.
* 새로운 K2 컴파일러에서 발생한 모든 문제는 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.
* JetBrains가 K2 사용에 대한 익명 데이터를 수집하도록 [**사용 통계 보내기** 옵션](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)을
  활성화하세요.

## 언어

Kotlin 1.9.0에서는 이전에 도입된 새로운 언어 기능 중 일부를 안정화하고 있습니다:
* [enum 클래스 `values` 함수의 대체](#stable-replacement-of-the-enum-class-values-function)
* [데이터 클래스와 대칭을 이루는 데이터 객체](#stable-data-objects-for-symmetry-with-data-classes)
* [인라인 값 클래스(inline value classes)의 본문이 있는 보조 생성자 지원](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum 클래스 values 함수의 안정적인 대체

1.8.20에서 enum 클래스의 `entries` 속성이 실험적 기능으로 도입되었습니다. `entries` 속성은
합성 `values()` 함수의 현대적이고 성능이 뛰어난 대체품입니다. 1.9.0에서 `entries` 속성은 안정화되었습니다.

> `values()` 함수는 여전히 지원되지만, `entries`
> 속성을 대신 사용할 것을 권장합니다.
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

enum 클래스의 `entries` 속성에 대한 자세한 내용은 [What's new in Kotlin 1.8.20](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)를 참조하세요.

### 데이터 클래스와 대칭을 이루는 데이터 객체

[Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)에서 도입된 데이터 객체 선언은
이제 안정화되었습니다. 여기에는 데이터 클래스와 대칭을 이루기 위해 추가된 `toString()`, `equals()`, `hashCode()` 함수가 포함됩니다.

이 기능은 `sealed` 계층 구조(예: `sealed class` 또는 `sealed interface` 계층 구조)와 함께 특히 유용합니다.
`data object` 선언은 `data class` 선언과 함께 편리하게 사용될 수 있기 때문입니다. 이 예에서
`EndOfFile`을 일반 `object` 대신 `data object`로 선언하면 수동으로 오버라이드할 필요 없이 자동으로 `toString()` 함수를 갖게 됩니다. 이는
함께 제공되는 데이터 클래스 정의와 대칭을 유지합니다.

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

자세한 내용은 [What's new in Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)를 참조하세요.

### 인라인 값 클래스(inline value classes)의 본문이 있는 보조 생성자 지원

Kotlin 1.9.0부터 [인라인 값 클래스(inline value classes)](inline-classes.md)에서 본문이 있는 보조 생성자를 사용하는 것이
기본적으로 가능합니다:

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

이전에는 Kotlin이 인라인 클래스에서 공개 기본 생성자만 허용했습니다. 결과적으로, 기본 값을 캡슐화하거나 특정 제약 조건을
나타내는 인라인 클래스를 생성하는 것이 불가능했습니다.

Kotlin이 발전함에 따라 이러한 문제는 해결되었습니다. Kotlin 1.4.30에서는 `init` 블록에 대한 제한을 해제했고, Kotlin 1.8.20에서는
본문이 있는 보조 생성자의 미리 보기를 제공했습니다. 이제 이 기능은 기본적으로 사용할 수 있습니다. Kotlin 인라인 클래스의
개발에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)을 참조하세요.

## Kotlin/JVM

버전 1.9.0부터 컴파일러는 JVM 20에 해당하는 바이트코드 버전으로 클래스를 생성할 수 있습니다. 또한,
`JvmDefault` 어노테이션과 레거시 `-Xjvm-default` 모드에 대한 사용 중단이 계속됩니다.

### JvmDefault 어노테이션 및 레거시 -Xjvm-default 모드 사용 중단

Kotlin 1.5부터 `JvmDefault` 어노테이션의 사용은 새로운 `-Xjvm-default`
모드인 `all` 및 `all-compatibility`를 선호하여 사용 중단되었습니다. Kotlin 1.4에서 `JvmDefaultWithoutCompatibility`가,
Kotlin 1.6에서 `JvmDefaultWithCompatibility`가 도입되면서, 이 모드들은 `DefaultImpls`
클래스 생성에 대한 포괄적인 제어를 제공하여 이전 Kotlin 코드와의 완벽한 호환성을 보장합니다.

결과적으로 Kotlin 1.9.0에서는 `JvmDefault` 어노테이션이 더 이상 중요성을 갖지 않으며
사용 중단으로 표시되어 오류가 발생합니다. 이 어노테이션은 결국 Kotlin에서 제거될 예정입니다.

## Kotlin/Native

다른 개선 사항 외에도 이번 릴리스에서는 [Kotlin/Native 메모리 관리자](native-memory-manager.md)에
대한 추가적인 개선 사항이 제공되어 견고성과 성능이 향상될 것입니다:

* [사용자 지정 메모리 할당기 미리 보기](#preview-of-custom-memory-allocator)
* [메인 스레드에서 Objective-C 또는 Swift 객체 할당 해제 후크](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [Kotlin/Native에서 상수 값에 접근할 때 객체 초기화 없음](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [Kotlin/Native에서 iOS 시뮬레이터 테스트를 위한 독립 실행 모드 구성 기능](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native의 라이브러리 연결](#library-linkage-in-kotlin-native)

### 사용자 지정 메모리 할당기 미리 보기

Kotlin 1.9.0은 사용자 지정 메모리 할당기 미리 보기를 도입합니다. 이 할당 시스템은
[Kotlin/Native 메모리 관리자](native-memory-manager.md)의 런타임 성능을 향상시킵니다.

Kotlin/Native의 현재 객체 할당 시스템은 효율적인 가비지 컬렉션(GC) 기능을 갖추지 않은 범용 할당기를 사용합니다.
이를 보완하기 위해, 가비지 컬렉터(GC)가 할당된 모든 객체의 스레드 로컬 연결 목록을 단일 목록으로 병합하기 전까지 유지하며,
이 목록은 스위핑(sweeping) 중에 반복될 수 있습니다. 이 접근 방식에는 몇 가지 성능 단점이 있습니다:

* 스위핑 순서에 메모리 지역성(memory locality)이 부족하여 종종 흩어진 메모리 접근 패턴을 유발하며, 이는 잠재적인 성능 문제로 이어질 수 있습니다.
* 연결 목록은 각 객체에 대해 추가 메모리를 필요로 하여, 특히 작은 객체가 많은 경우 메모리 사용량을 증가시킵니다.
* 할당된 객체의 단일 목록은 스위핑을 병렬화하기 어렵게 만들어, 뮤테이터 스레드(mutator threads)가 GC 스레드보다 빠르게 객체를 할당할 때 메모리 사용 문제를 유발할 수 있습니다.

이러한 문제를 해결하기 위해 Kotlin 1.9.0은 사용자 지정 할당기의 미리 보기를 도입합니다. 이 할당기는 시스템 메모리를 페이지로
분할하여 연속적인 순서로 독립적인 스위핑을 허용합니다. 각 할당은 페이지 내의 메모리 블록이 되며, 페이지는 블록 크기를 추적합니다.
다양한 페이지 유형은 다양한 할당 크기에 최적화되어 있습니다. 메모리 블록의 연속적인 배열은 할당된 모든 블록을 효율적으로
반복할 수 있도록 합니다.

스레드가 메모리를 할당할 때, 할당 크기를 기반으로 적합한 페이지를 검색합니다. 스레드는 다양한 크기 범주에 대한
페이지 집합을 유지합니다. 일반적으로 주어진 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다. 그렇지 않은 경우,
스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나, 스위핑이 필요하거나, 먼저 생성되어야 할 수 있습니다.

새로운 할당기는 동시에 여러 독립적인 할당 공간을 가질 수 있게 하여, Kotlin 팀이
성능을 더욱 향상시키기 위해 다양한 페이지 레이아웃을 실험할 수 있도록 할 것입니다.

새로운 할당기의 설계에 대한 자세한 내용은 [이 README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)를 참조하세요.

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

사용자 지정 할당기를 개선하기 위해 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)에 피드백을 주시면 감사하겠습니다.

### 메인 스레드에서 Objective-C 또는 Swift 객체 할당 해제 후크

Kotlin 1.9.0부터 Objective-C 또는 Swift 객체 할당 해제 후크는 객체가 메인 스레드에서 Kotlin으로 전달된 경우 메인 스레드에서
호출됩니다. [Kotlin/Native 메모리 관리자](native-memory-manager.md)가 이전에 Objective-C 객체에 대한
참조를 처리하는 방식은 메모리 누수로 이어질 수 있었습니다. 새로운 동작은 메모리 관리자의 견고성을 향상시킬 것으로 믿습니다.

Kotlin 코드에서 참조되는 Objective-C 객체(예: 인수로 전달되거나, 함수에 의해 반환되거나, 컬렉션에서 검색되는 경우)를 고려해 보세요.
이 경우 Kotlin은 Objective-C 객체에 대한 참조를 보유하는 자체 객체를 생성합니다. Kotlin 객체가 할당 해제될 때,
Kotlin/Native 런타임은 Objective-C 참조를 해제하는 `objc_release` 함수를 호출합니다.

이전에는 Kotlin/Native 메모리 관리자가 특별한 GC 스레드에서 `objc_release`를 실행했습니다. 이것이 마지막 객체 참조인 경우,
객체는 할당 해제됩니다. Objective-C 객체가 Objective-C의 `dealloc` 메서드 또는 Swift의 `deinit` 블록과 같은
사용자 지정 할당 해제 후크를 가지고 있고, 이러한 후크가 특정 스레드에서 호출될 것으로 예상하는 경우 문제가 발생할 수 있었습니다.

메인 스레드의 객체에 대한 후크는 일반적으로 거기서 호출될 것으로 예상하기 때문에, Kotlin/Native 런타임은 이제
`objc_release`를 메인 스레드에서도 호출합니다. 이는 Objective-C 객체가 메인 스레드에서 Kotlin으로 전달되어
Kotlin 피어 객체가 생성된 경우를 처리해야 합니다. 이는 메인 디스패치 큐가 처리되는 경우에만 작동하며, 이는 일반 UI 애플리케이션의 경우입니다.
메인 큐가 아니거나 객체가 메인이 아닌 다른 스레드에서 Kotlin으로 전달된 경우, `objc_release`는 이전과 같이 특별한 GC 스레드에서 호출됩니다.

#### 옵트아웃(Opt out) 방법

문제가 발생하는 경우, `gradle.properties` 파일에서 다음 옵션으로 이 동작을 비활성화할 수 있습니다:

```none
kotlin.native.binary.objcDisposeOnMain=false
```

이러한 사례는 [이슈 트래커](https://kotl.in/issue)에 주저하지 말고 보고해 주세요.

### Kotlin/Native에서 상수 값에 접근할 때 객체 초기화 없음

Kotlin 1.9.0부터 Kotlin/Native 백엔드는 `const val` 필드에 접근할 때 객체를 초기화하지 않습니다:

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

이 동작은 이제 Kotlin/JVM과 통합되었으며, Kotlin/JVM의 구현은 Java와 일관되며 이 경우 객체는 절대 초기화되지 않습니다.
이 변경 덕분에 Kotlin/Native 프로젝트에서 일부 성능 향상을 기대할 수 있습니다.

### Kotlin/Native에서 iOS 시뮬레이터 테스트를 위한 독립 실행 모드 구성 기능

기본적으로 Kotlin/Native용 iOS 시뮬레이터 테스트를 실행할 때, 수동 시뮬레이터 부팅 및 종료를 피하기 위해 `--standalone` 플래그가 사용됩니다.
1.9.0에서는 `standalone` 속성을 통해 Gradle 작업에서 이 플래그 사용 여부를 구성할 수 있습니다. 기본적으로 `--standalone` 플래그가 사용되므로 독립 실행 모드가 활성화됩니다.

`build.gradle.kts` 파일에서 독립 실행 모드를 비활성화하는 예시는 다음과 같습니다:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> 독립 실행 모드를 비활성화하면 시뮬레이터를 수동으로 부팅해야 합니다.
> CLI에서 시뮬레이터를 부팅하려면 다음 명령을 사용할 수 있습니다:
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Native의 라이브러리 연결

Kotlin 1.9.0부터 Kotlin/Native 컴파일러는 Kotlin 라이브러리의 연결 문제(linkage issues)를 Kotlin/JVM과 동일하게 처리합니다.
이러한 문제는 한 타사 Kotlin 라이브러리 작성자가 다른 타사 Kotlin 라이브러리가 사용하는 실험적 API에 호환되지 않는 변경을 가했을 때 발생할 수 있습니다.

이제 타사 Kotlin 라이브러리 간의 연결 문제가 발생해도 컴파일 중 빌드가 실패하지 않습니다. 대신, JVM에서와 마찬가지로
런타임에만 이러한 오류가 발생합니다.

Kotlin/Native 컴파일러는 라이브러리 연결 문제를 감지할 때마다 경고를 보고합니다. 예를 들어, 컴파일 로그에서
다음과 같은 경고를 찾을 수 있습니다:

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

프로젝트에서 이 동작을 추가로 구성하거나 비활성화할 수 있습니다:

* 컴파일 로그에서 이러한 경고를 보고 싶지 않다면 `-Xpartial-linkage-loglevel=INFO` 컴파일러 옵션으로 경고를 억제하세요.
* 보고된 경고의 심각도를 `-Xpartial-linkage-loglevel=ERROR`로 설정하여 컴파일 오류로 높일 수도 있습니다. 이 경우 컴파일이 실패하고 컴파일 로그에서 모든 오류를 볼 수 있습니다. 이 옵션을 사용하여 연결 문제를 더 자세히 조사하세요.
* 이 기능에 예기치 않은 문제가 발생하는 경우, 언제든지
  `-Xpartial-linkage=disable` 컴파일러 옵션으로 옵트아웃할 수 있습니다. 이러한 사례는 [이슈
  트래커](https://kotl.in/issue)에 주저하지 말고 보고해 주세요.

```kotlin
// Gradle 빌드 파일을 통해 컴파일러 옵션을 전달하는 예시.
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 연결 경고를 억제하려면:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 연결 경고를 오류로 높이려면:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 기능을 완전히 비활성화하려면:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C interop 암시적 정수 변환을 위한 컴파일러 옵션

C interop을 위한 컴파일러 옵션을 도입하여 암시적 정수 변환을 사용할 수 있도록 했습니다. 신중한 고려 끝에, 이 기능은
여전히 개선의 여지가 있으며 최고 품질의 API를 목표로 하므로 의도치 않은 사용을 방지하기 위해 이 컴파일러 옵션을 도입했습니다.

이 코드 샘플에서 암시적 정수 변환은 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)가
부호 없는 타입 `UInt`이고 `0`이 부호 있는 타입임에도 불구하고 `options = 0`을 허용합니다.

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

네이티브 interop 라이브러리에서 암시적 변환을 사용하려면 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`
컴파일러 옵션을 사용합니다.

Gradle `build.gradle.kts` 파일에서 다음과 같이 구성할 수 있습니다:
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatform은 1.9.0에서 개발자 경험을 향상시키기 위해 몇 가지 주목할 만한 업데이트를 받았습니다:

* [Android 대상 지원 변경 사항](#changes-to-android-target-support)
* [새로운 Android 소스 세트 레이아웃이 기본으로 활성화](#new-android-source-set-layout-enabled-by-default)
* [멀티플랫폼 프로젝트에서 Gradle 설정 캐시 미리 보기](#preview-of-the-gradle-configuration-cache)

### Android 대상 지원 변경 사항

Kotlin Multiplatform을 안정화하기 위한 노력을 계속하고 있습니다. 필수적인 단계는 Android 대상에 대한
일류 지원을 제공하는 것입니다. 앞으로 Google의 Android 팀이 Kotlin Multiplatform에서 Android를 지원하기 위한
자체 Gradle 플러그인을 제공할 것이라고 발표하게 되어 기쁩니다.

Google의 이 새로운 솔루션의 길을 열기 위해, 1.9.0에서는 현재 Kotlin DSL의 `android` 블록 이름을 변경하고 있습니다.
모든 `android` 블록을 빌드 스크립트에서 `androidTarget`으로 변경해 주세요. 이는 Google의 다가오는 DSL을 위해
`android` 이름을 비워두기 위한 일시적인 변경입니다.

Google 플러그인은 멀티플랫폼 프로젝트에서 Android를 사용하는 선호하는 방법이 될 것입니다. 준비가 되면,
이전과 같이 짧은 `android` 이름을 사용할 수 있도록 필요한 마이그레이션 지침을 제공할 것입니다.

### 새로운 Android 소스 세트 레이아웃이 기본으로 활성화

Kotlin 1.9.0부터 새로운 Android 소스 세트 레이아웃이 기본으로 활성화됩니다. 이는 여러 면에서 혼란스러웠던 이전 디렉토리
명명 스키마를 대체했습니다. 새로운 레이아웃은 여러 가지 장점을 가지고 있습니다:

* 단순화된 타입 의미론 – 새로운 Android 소스 레이아웃은 다양한 타입의 소스 세트를 구별하는 데 도움이 되는 명확하고 일관된 명명 규칙을 제공합니다.
* 개선된 소스 디렉토리 레이아웃 – 새로운 레이아웃을 통해 `SourceDirectories` 배열이 더욱 일관성 있게 되어 코드 구성 및 소스 파일 찾기가 쉬워집니다.
* Gradle 구성에 대한 명확한 명명 스키마 – 이제 `KotlinSourceSets` 및 `AndroidSourceSets` 모두에서 스키마가 더욱 일관되고 예측 가능해졌습니다.

새로운 레이아웃은 Android Gradle 플러그인 버전 7.0 이상을 필요로 하며 Android Studio 2022.3 이상에서 지원됩니다. `build.gradle(.kts)` 파일에
필요한 변경 사항을 적용하려면 [마이그레이션 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)를 참조하세요.

### 멀티플랫폼 프로젝트에서 Gradle 설정 캐시 미리 보기

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0은 멀티플랫폼 라이브러리에서 [Gradle 설정 캐시(Gradle configuration cache)](https://docs.gradle.org/current/userguide/configuration_cache.html)
지원과 함께 제공됩니다. 라이브러리 작성자라면 이미 향상된 빌드 성능의 이점을 누릴 수 있습니다.

Gradle 설정 캐시는 설정 단계의 결과를 후속 빌드에서 재사용하여 빌드 프로세스 속도를 높입니다. 이 기능은 Gradle 8.1부터
안정화되었습니다. 이를 활성화하려면 [Gradle 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)의 지침을 따르세요.

> Kotlin Multiplatform 플러그인은 Xcode 통합 작업 또는
> [Kotlin CocoaPods Gradle 플러그인](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)과 함께 Gradle 설정 캐시를 아직 지원하지 않습니다.
> 이 기능은 향후 Kotlin 릴리스에서 추가될 예정입니다.
>
{style="note"}

## Kotlin/Wasm

Kotlin 팀은 새로운 Kotlin/Wasm 타겟을 계속 실험하고 있습니다. 이번 릴리스에서는 몇 가지 성능 및
[크기 관련 최적화](#size-related-optimizations)와 [JavaScript 상호 운용성(interop) 업데이트](#updates-in-javascript-interop)가 도입되었습니다.

### 크기 관련 최적화

Kotlin 1.9.0은 WebAssembly (Wasm) 프로젝트에 상당한 크기 개선을 도입합니다. 두 개의 "Hello World" 프로젝트를 비교했을 때,
Kotlin 1.9.0의 Wasm 코드 크기는 Kotlin 1.8.20보다 10배 이상 작아졌습니다.

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

이러한 크기 최적화는 Wasm 플랫폼을 Kotlin 코드로 타겟팅할 때 더 효율적인 리소스 활용과 향상된 성능을 가져옵니다.

### JavaScript 상호 운용성(interop) 업데이트

이번 Kotlin 업데이트는 Kotlin/Wasm용 Kotlin과 JavaScript 간의 상호 운용성에 대한 변경 사항을 도입합니다. Kotlin/Wasm은
[실험적 기능](components-stability.md#stability-levels-explained)이므로, 상호 운용성에 특정 제한이 적용됩니다.

#### Dynamic 타입 제한

버전 1.9.0부터 Kotlin은 Kotlin/Wasm에서 `Dynamic` 타입의 사용을 더 이상 지원하지 않습니다. 이 타입은 JavaScript 상호 운용성을
용이하게 하는 새로운 범용 `JsAny` 타입으로 대체되어 현재 사용 중단되었습니다.

자세한 내용은 [Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md) 문서를 참조하세요.

#### 비외부(non-external) 타입 제한

Kotlin/Wasm은 값을 JavaScript로 전달하거나 JavaScript에서 가져올 때 특정 Kotlin 정적 타입에 대한 변환을 지원합니다.
지원되는 타입은 다음과 같습니다:

* 부호 있는 숫자, `Boolean`, `Char`와 같은 기본 타입.
* `String`.
* 함수 타입.

다른 타입은 변환 없이 불투명한 참조(opaque references)로 전달되어 JavaScript와 Kotlin 하위 타입 간의 불일치를 초래했습니다.

이를 해결하기 위해 Kotlin은 JavaScript 상호 운용성을 잘 지원되는 타입 집합으로 제한합니다. Kotlin 1.9.0부터
Kotlin/Wasm JavaScript 상호 운용에서는 외부(external) 타입, 기본 타입, 문자열 타입, 함수 타입만 지원됩니다.
또한, JavaScript 상호 운용에서 사용할 수 있는 Kotlin/Wasm 객체에 대한 핸들을 나타내기 위해 `JsReference`라는 별도의 명시적 타입이 도입되었습니다.

자세한 내용은 [Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md) 문서를 참조하세요.

### Kotlin Playground의 Kotlin/Wasm

Kotlin Playground는 Kotlin/Wasm 타겟을 지원합니다.
Kotlin/Wasm을 타겟팅하는 Kotlin 코드를 작성, 실행 및 공유할 수 있습니다. [확인해 보세요!](https://pl.kotl.in/HDFAvimga)

> Kotlin/Wasm을 사용하려면 브라우저에서 실험적 기능을 활성화해야 합니다.
>
> [이러한 기능을 활성화하는 방법에 대해 자세히 알아보세요](wasm-configuration.md).
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

이번 릴리스에서는 Kotlin/JS에 대한 업데이트가 도입되었으며, 여기에는 이전 Kotlin/JS 컴파일러 제거, Kotlin/JS Gradle 플러그인 사용 중단,
그리고 ES2015에 대한 실험적 지원이 포함됩니다:

* [이전 Kotlin/JS 컴파일러 제거](#removal-of-the-old-kotlin-js-compiler)
* [Kotlin/JS Gradle 플러그인 사용 중단](#deprecation-of-the-kotlin-js-gradle-plugin)
* [외부 enum 사용 중단](#deprecation-of-external-enum)
* [ES2015 클래스 및 모듈에 대한 실험적 지원](#experimental-support-for-es2015-classes-and-modules)
* [JS 프로덕션 배포의 기본 대상 변경](#changed-default-destination-of-js-production-distribution)
* [stdlib-js에서 org.w3c 선언 추출](#extract-org.w3c-declarations-from-stdlib-js)

> 버전 1.9.0부터 [부분 라이브러리 연결(partial library linkage)](#library-linkage-in-kotlin-native)도 Kotlin/JS에 대해 활성화됩니다.
>
{style="note"}

### 이전 Kotlin/JS 컴파일러 제거

Kotlin 1.8.0에서는 IR 기반 백엔드가 [안정화](whatsnew18.md#stable-js-ir-compiler-backend)되었음을
발표했습니다. 그 이후로 컴파일러를 지정하지 않는 것이 오류가 되었고, 이전 컴파일러를 사용하면 경고가 발생했습니다.

Kotlin 1.9.0에서는 이전 백엔드를 사용하면 오류가 발생합니다. [마이그레이션 가이드](js-ir-migration.md)를
따라 IR 컴파일러로 마이그레이션해 주세요.

### Kotlin/JS Gradle 플러그인 사용 중단

Kotlin 1.9.0부터 `kotlin-js` Gradle 플러그인은
사용 중단되었습니다. 대신 `js()` 대상을 사용하는 `kotlin-multiplatform` Gradle 플러그인을 사용할 것을 권장합니다.

Kotlin/JS Gradle 플러그인의 기능은 본질적으로 `kotlin-multiplatform` 플러그인과 중복되었으며 내부적으로 동일한
구현을 공유했습니다. 이러한 중복은 혼란을 야기하고 Kotlin 팀의 유지 보수 부담을 증가시켰습니다.

마이그레이션 지침은 [Kotlin Multiplatform 호환성 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)를
참조하세요. 가이드에 포함되지 않은 문제가 발견되면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### 외부 enum 사용 중단

Kotlin 1.9.0에서 외부 enum은 Kotlin 외부에 존재할 수 없는 `entries`와 같은 정적 enum 멤버에 대한 문제로 인해 사용 중단될 예정입니다.
대신 객체 하위 클래스를 가진 외부 봉인 클래스(external sealed class)를 사용할 것을 권장합니다:

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

객체 하위 클래스를 가진 외부 봉인 클래스로 전환하면 외부 enum과 유사한 기능을 달성하면서 기본 메서드와 관련된
문제를 피할 수 있습니다.

Kotlin 1.9.0부터 외부 enum의 사용은 사용 중단으로 표시됩니다. 호환성과 향후 유지를 위해 코드를
제안된 외부 봉인 클래스 구현으로 업데이트하는 것을 권장합니다.

### ES2015 클래스 및 모듈에 대한 실험적 지원

이번 릴리스에서는 ES2015 모듈 및 ES2015 클래스 생성에 대한 [실험적](components-stability.md#stability-levels-explained) 지원을 도입합니다:
* 모듈은 코드베이스를 단순화하고 유지 보수성을 향상시키는 방법을 제공합니다.
* 클래스를 통해 객체 지향 프로그래밍(OOP) 원칙을 통합하여 더 깔끔하고 직관적인 코드를 작성할 수 있습니다.

이러한 기능을 활성화하려면 `build.gradle.kts` 파일을 그에 따라 업데이트하세요:

```kotlin
// build.gradle.kts
kotlin {
    js(IR) {
        useEsModules() // ES2015 모듈 활성화
        browser()
    }
}

// ES2015 클래스 생성 활성화
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[공식 문서에서 ES2015 (ECMAScript 2015, ES6)에 대해 자세히 알아보세요](https://262.ecma-international.org/6.0/).

### JS 프로덕션 배포의 기본 대상 변경

Kotlin 1.9.0 이전에는 배포 대상 디렉토리가 `build/distributions`였습니다. 그러나 이는 Gradle 아카이브의
공통 디렉토리입니다. 이 문제를 해결하기 위해 Kotlin 1.9.0에서는 기본 배포 대상 디렉토리를
`build/dist/<targetName>/<binaryName>`으로 변경했습니다.

예를 들어, `productionExecutable`은 `build/distributions`에 있었습니다. Kotlin 1.9.0에서는 `build/dist/js/productionExecutable`에 있습니다.

> 이러한 빌드 결과를 사용하는 파이프라인이 있는 경우, 디렉토리를 업데이트해야 합니다.
>
{style="warning"}

### stdlib-js에서 org.w3c 선언 추출

Kotlin 1.9.0부터 `stdlib-js`에는 더 이상 `org.w3c` 선언이 포함되지 않습니다. 대신, 이러한 선언은
별도의 Gradle 종속성으로 이동되었습니다. `build.gradle.kts` 파일에 Kotlin Multiplatform Gradle 플러그인을 추가하면,
이러한 선언은 표준 라이브러리와 유사하게 프로젝트에 자동으로 포함됩니다.

수동으로 작업하거나 마이그레이션할 필요가 없습니다. 필요한 조정은 자동으로 처리됩니다.

## Gradle

Kotlin 1.9.0은 새로운 Gradle 컴파일러 옵션과 더 많은 기능을 제공합니다:

* [classpath 속성 제거](#removed-classpath-property)
* [새로운 Gradle 컴파일러 옵션](#new-compiler-options)
* [Kotlin/JVM에 대한 프로젝트 수준 컴파일러 옵션](#project-level-compiler-options-for-kotlin-jvm)
* [Kotlin/Native 모듈 이름을 위한 컴파일러 옵션](#compiler-option-for-kotlin-native-module-name)
* [공식 Kotlin 라이브러리를 위한 별도 컴파일러 플러그인](#separate-compiler-plugins-for-official-kotlin-libraries)
* [최소 지원 버전 증가](#incremented-minimum-supported-version)
* [kapt는 Gradle에서 즉시(eager) 작업 생성을 유발하지 않음](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [JVM 대상 유효성 검사 모드의 프로그래밍 방식 구성](#programmatic-configuration-of-the-jvm-target-validation-mode)

### classpath 속성 제거

Kotlin 1.7.0에서 `KotlinCompile` 작업의 `classpath` 속성에 대한 사용 중단 주기가 시작되었음을 발표했습니다.
사용 중단 수준은 Kotlin 1.8.0에서 `ERROR`로 상향되었습니다. 이번 릴리스에서는 마침내 `classpath` 속성을 제거했습니다.
모든 컴파일 작업은 이제 컴파일에 필요한 라이브러리 목록에 대해 `libraries` 입력을 사용해야 합니다.

### 새로운 컴파일러 옵션

Kotlin Gradle 플러그인은 이제 옵트인(opt-in) 및 컴파일러의 프로그레시브 모드(progressive mode)를 위한 새로운 속성을 제공합니다.

* 새로운 API를 옵트인하려면 이제 `optIn` 속성을 사용하고 `optIn.set(listOf(a, b, c))`와 같은 문자열 목록을 전달할 수 있습니다.
* 프로그레시브 모드를 활성화하려면 `progressiveMode.set(true)`를 사용합니다.

### Kotlin/JVM에 대한 프로젝트 수준 컴파일러 옵션

Kotlin 1.9.0부터 `kotlin` 설정 블록 내부에 새로운 `compilerOptions` 블록이 사용 가능합니다:

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

이는 컴파일러 옵션 구성을 훨씬 쉽게 만듭니다. 그러나 몇 가지 중요한 세부 사항에 유의하는 것이 중요합니다:

* 이 설정은 프로젝트 수준에서만 작동합니다.
* Android 플러그인의 경우 이 블록은 다음 객체와 동일하게 구성합니다:

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

* `android.kotlinOptions`와 `kotlin.compilerOptions` 설정 블록은 서로를 재정의합니다. 빌드 파일에서 마지막 (가장 낮은) 블록이 항상 적용됩니다.
* `moduleName`이 프로젝트 수준에서 구성된 경우, 컴파일러에 전달될 때 해당 값이 변경될 수 있습니다. `main` 컴파일의 경우는 그렇지 않지만,
  예를 들어 테스트 소스와 같은 다른 타입의 경우 Kotlin Gradle 플러그인은 `_test` 접미사를 추가합니다.
* `tasks.withType<KotlinJvmCompile>().configureEach {}` (또는 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`) 내부의 설정은
  `kotlin.compilerOptions`와 `android.kotlinOptions`를 모두 재정의합니다.

### Kotlin/Native 모듈 이름을 위한 컴파일러 옵션

Kotlin/Native [`module-name`](compiler-reference.md#module-name-name-native) 컴파일러 옵션은 이제 Kotlin Gradle 플러그인에서 쉽게 사용할 수 있습니다.

이 옵션은 컴파일 모듈의 이름을 지정하며, Objective-C로 내보내진 선언에 대한 이름 접두사를 추가하는 데도 사용될 수 있습니다.

이제 Gradle 빌드 파일의 `compilerOptions` 블록에서 모듈 이름을 직접 설정할 수 있습니다:

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

### 공식 Kotlin 라이브러리를 위한 별도 컴파일러 플러그인

Kotlin 1.9.0은 공식 라이브러리를 위한 별도 컴파일러 플러그인을 도입합니다. 이전에는 컴파일러 플러그인이 해당 Gradle 플러그인에
내장되어 있었습니다. 이로 인해 컴파일러 플러그인이 Gradle 빌드의 Kotlin 런타임 버전보다 높은 Kotlin 버전으로 컴파일된 경우 호환성 문제가 발생할 수 있었습니다.

이제 컴파일러 플러그인은 별도의 종속성으로 추가되므로 더 이상 이전 Gradle 버전과의 호환성 문제가 발생하지 않습니다.
새로운 접근 방식의 또 다른 주요 장점은 새로운 컴파일러 플러그인을 [Bazel](https://bazel.build/)과 같은 다른 빌드 시스템과 함께 사용할 수 있다는 것입니다.

다음은 Maven Central에 게시하고 있는 새로운 컴파일러 플러그인 목록입니다:

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

모든 플러그인에는 `-embeddable` 대응 플러그인(예: `kotlin-allopen-compiler-plugin-embeddable`)이 있으며, 이는 스크립팅 아티팩트의 기본 옵션인
`kotlin-compiler-embeddable` 아티팩트와 함께 작동하도록 설계되었습니다.

Gradle은 이러한 플러그인을 컴파일러 인수로 추가합니다. 기존 프로젝트를 변경할 필요는 없습니다.

### 최소 지원 버전 증가

Kotlin 1.9.0부터 최소 지원 Android Gradle 플러그인 버전은 4.2.2입니다.

[문서에서 사용 가능한 Gradle 버전과의 Kotlin Gradle 플러그인 호환성](gradle-configure-project.md#apply-the-plugin)을 참조하세요.

### kapt는 Gradle에서 즉시(eager) 작업 생성을 유발하지 않음

1.9.0 이전에는 [kapt 컴파일러 플러그인](kapt.md)이 Kotlin 컴파일 작업의 구성된 인스턴스를 요청하여 즉시(eager) 작업을 생성했습니다.
이 동작은 Kotlin 1.9.0에서 수정되었습니다. `build.gradle.kts` 파일에 대한 기본 구성을 사용하는 경우 설정은 이 변경의 영향을 받지 않습니다.

> 사용자 지정 구성을 사용하는 경우, 설정이 부정적인 영향을 받습니다.
> 예를 들어, Gradle의 tasks API를 사용하여 `KotlinJvmCompile` 작업을 수정했다면,
> 빌드 스크립트에서 `KaptGenerateStubs` 작업도 비슷하게 수정해야 합니다.
>
> 예를 들어, 스크립트에 `KotlinJvmCompile` 작업에 대한 다음 설정이 있는 경우:
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // Your custom configuration }
> ```
> {validate="false"}
>
> 이 경우, `KaptGenerateStubs` 작업의 일부로 동일한 수정이 포함되어 있는지 확인해야 합니다:
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // Your custom configuration }
> ```
> {validate="false"}
>
{style="warning"}

자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)을 참조하세요.

### JVM 대상 유효성 검사 모드의 프로그래밍 방식 구성

Kotlin 1.9.0 이전에는 Kotlin과 Java 간의 JVM 대상 비호환성 감지를 조정하는 방법이 단 하나뿐이었습니다.
전체 프로젝트에 대해 `gradle.properties`에 `kotlin.jvm.target.validation.mode=ERROR`를 설정해야 했습니다.

이제 `build.gradle.kts` 파일의 작업 수준에서도 구성할 수 있습니다:

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 표준 라이브러리

Kotlin 1.9.0에는 표준 라이브러리에 대한 몇 가지 큰 개선 사항이 있습니다:
* [`..<` 연산자](#stable-operator-for-open-ended-ranges)와 [시간 API](#stable-time-api)가 안정화되었습니다.
* [Kotlin/Native 표준 라이브러리가 철저히 검토되고 업데이트](#the-kotlin-native-standard-library-s-journey-towards-stabilization)되었습니다.
* [`@Volatile` 어노테이션을 더 많은 플랫폼에서 사용할 수 있습니다](#stable-volatile-annotation).
* [이름으로 정규식 캡처 그룹을 가져오는 **공통** 함수가 있습니다](#new-common-function-to-get-regex-capture-group-by-name).
* [16진수를 서식 지정하고 파싱하는 새로운 `HexFormat` 클래스가 도입되었습니다](#new-hexformat-class-to-format-and-parse-hexadecimals).

### 열린 범위(open-ended ranges)를 위한 안정적인 ..< 연산자

[Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)에서 도입되었고
1.8.0에서 안정화된 열린 범위(open-ended ranges)를 위한 새로운 `..<` 연산자는 1.9.0에서 열린 범위를
다루는 표준 라이브러리 API도 안정화되었습니다.

우리의 연구에 따르면 새로운 `..<` 연산자는 열린 범위가 선언되었을 때 이해하기 더 쉽게 만듭니다.
`until` 중위 함수를 사용하면 상한(upper bound)이 포함된다고 가정하는 실수를 쉽게 할 수 있습니다.

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

> IntelliJ IDEA 버전 2023.1.1부터 `..<` 연산자를 사용할 수 있는 경우를 강조하는 새로운 코드 검사가 제공됩니다.
>
{style="note"}

이 연산자로 할 수 있는 작업에 대한 자세한 내용은 [What's new in Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)를 참조하세요.

### 안정적인 시간 API

1.3.50부터 새로운 시간 측정 API를 미리 보았습니다. 이 API의 기간(duration) 부분은 1.6.0에서 안정화되었습니다.
1.9.0에서는 나머지 시간 측정 API가 안정화되었습니다.

이전 시간 API는 `measureTimeMillis` 및 `measureNanoTime` 함수를 제공했으며, 이는 직관적으로 사용하기 어려웠습니다.
이 둘이 서로 다른 단위로 시간을 측정한다는 것은 명확하지만, `measureTimeMillis`는 [벽시계(wall clock)](https://en.wikipedia.org/wiki/Elapsed_real_time)를
사용하여 시간을 측정하는 반면, `measureNanoTime`은 단조 시간 소스(monotonic time source)를 사용한다는 점은 명확하지 않습니다.
새로운 시간 API는 이러한 문제 및 기타 문제를 해결하여 API를 더 사용자 친화적으로 만듭니다.

새로운 시간 API를 사용하면 쉽게 다음을 수행할 수 있습니다:
* 원하는 시간 단위로 단조 시간 소스를 사용하여 코드 실행에 걸린 시간을 측정합니다.
* 특정 시간을 표시합니다.
* 두 시간 간의 차이를 비교하고 찾습니다.
* 특정 시간 이후로 얼마나 시간이 지났는지 확인합니다.
* 현재 시간이 특정 시간을 지났는지 확인합니다.

#### 코드 실행 시간 측정

코드 블록 실행에 걸린 시간을 측정하려면 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)
인라인 함수를 사용하세요.

코드 블록 실행에 걸린 시간을 측정 **하고** 코드 블록의 결과를 반환하려면
[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 인라인 함수를 사용하세요.

기본적으로 두 함수 모두 단조 시간 소스를 사용합니다. 그러나 경과 실제 시간 소스를 사용하려면 그렇게 할 수 있습니다.
예를 들어, Android에서는 기본 시간 소스 `System.nanoTime()`이
장치가 활성화되어 있는 동안에만 시간을 계산합니다. 장치가 딥 슬립에 들어가면 시간을 추적하지 못합니다.
장치가 딥 슬립 상태일 때도 시간을 추적하려면 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())를
사용하는 시간 소스를 대신 생성할 수 있습니다:

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 시간 표시 및 차이 측정

특정 시간을 표시하려면 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
인터페이스와 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 함수를 사용하여
[`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)를 생성하세요.
동일한 시간 소스의 `TimeMark` 간의 차이를 측정하려면 뺄셈 연산자(`-`)를 사용하세요:

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 0.5초 대기.
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // TimeMark끼리 비교하는 것도 가능합니다.
    println(mark2 > mark1) // mark2가 mark1보다 나중에 캡처되었으므로 true입니다.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

마감 기한이 지났는지 또는 시간 초과에 도달했는지 확인하려면 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
및 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)
확장 함수를 사용하세요:

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // 아직 5초가 지나지 않음
    println(mark2.hasPassedNow())
    // false

    // 6초 대기
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 표준 라이브러리의 안정화 여정

Kotlin/Native용 표준 라이브러리가 계속 성장함에 따라, 우리의 높은 기준을 충족하는지 확인하기 위해 전체적으로 검토할 때라고 판단했습니다.
이 과정에서 우리는 **모든** 기존 공개 시그니처를 신중하게 검토했습니다. 각 시그니처에 대해 다음을 고려했습니다:

* 고유한 목적을 가지고 있는가.
* 다른 Kotlin API와 일관성이 있는가.
* JVM용 대응 API와 유사한 동작을 하는가.
* 미래에도 사용할 수 있는가.

이러한 고려 사항을 바탕으로 다음 결정 중 하나를 내렸습니다:
* 안정화됨.
* 실험적 기능으로 지정됨.
* `private`으로 표시됨.
* 동작이 수정됨.
* 다른 위치로 이동됨.
* 사용 중단됨.
* 더 이상 사용되지 않는 것으로 표시됨.

> 기존 시그니처가 다음의 경우:
> * 다른 패키지로 이동된 경우, 원래 패키지에도 시그니처가 여전히 존재하지만, 이제 사용 중단 수준 `WARNING`으로 사용 중단되었습니다. IntelliJ IDEA는 코드 검사 시 자동으로 대체 기능을 제안할 것입니다.
> * 사용 중단된 경우, 사용 중단 수준 `WARNING`으로 사용 중단되었습니다.
> * 더 이상 사용되지 않는 것으로 표시된 경우, 계속 사용할 수 있지만 향후 대체될 것입니다.
>
{style="note"}

여기서 검토 결과를 모두 나열하지는 않겠지만, 주요 내용은 다음과 같습니다:
* Atomics API를 안정화했습니다.
* [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)을 실험적 기능으로 만들었으며, 이제 패키지를 사용하려면 다른 옵트인(opt-in)이 필요합니다. 자세한 내용은 [명시적인 C-상호 운용성 안정성 보장](#explicit-c-interoperability-stability-guarantees)을 참조하세요.
* [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 클래스 및 관련 API를 더 이상 사용되지 않는 것으로 표시했습니다.
* [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 클래스를 더 이상 사용되지 않는 것으로 표시했습니다.
* `kotlin.native.internal` 패키지의 모든 `public` API를 `private`으로 표시하거나 다른 패키지로 이동했습니다.

#### 명시적인 C-상호 운용성 안정성 보장

API의 높은 품질을 유지하기 위해 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)를
실험적 기능으로 만들기로 결정했습니다. `kotlinx.cinterop`는 철저히 테스트되었지만, 우리가 만족할 만큼 안정화되기 전까지는
아직 개선의 여지가 있습니다. 이 API를 상호 운용성에 사용하는 것을 권장하지만, 프로젝트의 특정 영역으로 사용을 제한하는 것이 좋습니다.
이렇게 하면 이 API를 안정화하기 위해 발전시키기 시작할 때 마이그레이션이 더 쉬워질 것입니다.

포인터와 같은 C-형 외래 API를 사용하려면 `@OptIn(ExperimentalForeignApi)`로 옵트인해야 하며, 그렇지 않으면 코드가 컴파일되지 않습니다.

Objective-C/Swift 상호 운용성을 다루는 `kotlinx.cinterop`의 나머지 부분을 사용하려면
`@OptIn(BetaInteropApi)`로 옵트인해야 합니다. 옵트인 없이 이 API를 사용하려고 하면 코드는 컴파일되지만 컴파일러는
예상할 수 있는 동작에 대한 명확한 설명을 제공하는 경고를 발생시킵니다.

이러한 어노테이션에 대한 자세한 내용은 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt)의 소스 코드를 참조하세요.

이 검토의 **모든** 변경 사항에 대한 자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-55765)을 참조하세요.

어떤 피드백이든 주시면 감사하겠습니다! [티켓](https://youtrack.jetbrains.com/issue/KT-57728)에 직접 댓글을 달아 피드백을 제공할 수 있습니다.

### 안정적인 @Volatile 어노테이션

`var` 속성에 `@Volatile` 어노테이션을 지정하면, 해당 backing field가 읽기 또는 쓰기가 원자적으로(atomic) 수행되며,
쓰기 작업은 항상 다른 스레드에 가시화되도록 표시됩니다.

1.8.20 이전에는 [`kotlin.jvm.Volatile` 어노테이션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)이
공통 표준 라이브러리에서 사용할 수 있었습니다. 그러나 이 어노테이션은 JVM에서만 유효했습니다. 다른 플랫폼에서 사용하면
무시되어 오류가 발생했습니다.

1.8.20에서는 JVM과 Kotlin/Native 모두에서 미리 볼 수 있는 실험적인 공통 어노테이션 `kotlin.concurrent.Volatile`을 도입했습니다.

1.9.0에서 `kotlin.concurrent.Volatile`은 안정화되었습니다. 멀티플랫폼 프로젝트에서 `kotlin.jvm.Volatile`을 사용하는 경우,
`kotlin.concurrent.Volatile`로 마이그레이션하는 것을 권장합니다.

### 정규식 캡처 그룹을 이름으로 가져오는 새로운 공통 함수

1.9.0 이전에는 모든 플랫폼에 정규식 매치에서 이름으로 정규식 캡처 그룹을 가져오는 자체 확장이 있었습니다.
그러나 공통 함수는 없었습니다. 표준 라이브러리가 JVM 대상 1.6 및 1.7을 여전히 지원했기 때문에
Kotlin 1.8.0 이전에는 공통 함수를 가질 수 없었습니다.

Kotlin 1.8.0부터 표준 라이브러리는 JVM 대상 1.8로 컴파일됩니다. 따라서 1.9.0에서는 이제 정규식 매치에 대한
그룹의 내용을 이름으로 검색하는 데 사용할 수 있는 **공통** [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)
함수가 있습니다. 이는 특정 캡처 그룹에 속하는 정규식 매치 결과를 접근하려는 경우 유용합니다.

다음은 세 개의 캡처 그룹(`city`, `state`, `areaCode`)을 포함하는 정규식의 예입니다. 이 그룹 이름을 사용하여 일치하는
값에 접근할 수 있습니다:

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

1.9.0에는 필요한 모든 상위 디렉터리와 함께 새 파일을 생성하는 데 사용할 수 있는 새로운 `createParentDirectories()` 확장 함수가 있습니다.
파일 경로를 `createParentDirectories()`에 제공하면 상위 디렉터리가 이미 존재하는지 확인합니다. 존재하면 아무것도 하지 않습니다.
그러나 존재하지 않으면 디렉터리를 생성합니다.

`createParentDirectories()`는 파일을 복사할 때 특히 유용합니다. 예를 들어, `copyToRecursively()` 함수와 함께 사용할 수 있습니다:

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 16진수를 서식 지정하고 파싱하는 새로운 HexFormat 클래스

> 새로운 `HexFormat` 클래스와 관련 확장 함수는 [실험적](components-stability.md#stability-levels-explained) 기능이며,
> 이를 사용하려면 `@OptIn(ExperimentalStdlibApi::class)` 또는 컴파일러 인수
> `-opt-in=kotlin.ExperimentalStdlibApi`로 옵트인(opt-in)해야 합니다.
>
{style="warning"}

1.9.0에서는 [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 클래스 및 관련
확장 함수가 실험적 기능으로 제공되어 숫자 값과 16진수 문자열 간에 변환할 수 있습니다. 특히, 확장 함수를 사용하여
16진수 문자열과 `ByteArray` 또는 다른 숫자 타입(`Int`, `Short`, `Long`) 간에 변환할 수 있습니다.

예시:

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 클래스에는 `HexFormat{}` 빌더로 구성할 수 있는 서식 지정 옵션이 포함되어 있습니다.

`ByteArray`를 사용하는 경우, 속성으로 구성할 수 있는 다음과 같은 옵션이 있습니다:

| 옵션 | 설명 |
|--|--|
| `upperCase` | 16진수 숫자의 대소문자 여부. 기본적으로 소문자로 가정합니다. `upperCase = false`. |
| `bytes.bytesPerLine` | 한 줄당 최대 바이트 수. |
| `bytes.bytesPerGroup` | 그룹당 최대 바이트 수. |
| `bytes.bytesSeparator` | 바이트 사이의 구분 기호. 기본적으로 없습니다. |
| `bytes.bytesPrefix` | 각 바이트의 두 자리 16진수 표현 앞에 바로 오는 문자열. 기본적으로 없습니다. |
| `bytes.bytesSuffix` | 각 바이트의 두 자리 16진수 표현 뒤에 바로 오는 문자열. 기본적으로 없습니다. |

예시:

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// HexFormat{} 빌더를 사용하여 16진수 문자열을 콜론으로 구분합니다.
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// HexFormat{} 빌더를 사용하여 다음을 수행합니다:
// * 16진수 문자열을 대문자로 만듭니다.
// * 바이트를 쌍으로 그룹화합니다.
// * 점으로 구분합니다.
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

숫자 타입을 사용하는 경우, 속성으로 구성할 수 있는 다음과 같은 옵션이 있습니다:

| 옵션 | 설명 |
|--|--|
| `number.prefix` | 16진수 문자열의 접두사. 기본적으로 없습니다. |
| `number.suffix` | 16진수 문자열의 접미사. 기본적으로 없습니다. |
| `number.removeLeadingZeros` | 16진수 문자열의 선행 0을 제거할지 여부. 기본적으로 선행 0은 제거되지 않습니다. `number.removeLeadingZeros = false` |

예시:

```kotlin
// HexFormat{} 빌더를 사용하여 접두사 "0x"를 가진 16진수를 파싱합니다.
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 문서 업데이트

Kotlin 문서는 몇 가지 주목할 만한 변경 사항을 받았습니다:
* [Kotlin 둘러보기(tour of Kotlin)](kotlin-tour-welcome.md) – 이론과 실습을 포함한 챕터로 Kotlin 프로그래밍 언어의 기본을 배웁니다.
* [Android 소스 세트 레이아웃](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 새로운 Android 소스 세트 레이아웃에 대해 배웁니다.
* [Kotlin Multiplatform 호환성 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – Kotlin Multiplatform으로 프로젝트를 개발할 때 발생할 수 있는 호환되지 않는 변경 사항에 대해 배웁니다.
* [Kotlin Wasm](wasm-overview.md) – Kotlin/Wasm과 Kotlin Multiplatform 프로젝트에서 이를 사용하는 방법에 대해 배웁니다.

## Kotlin 1.9.0 설치

### IDE 버전 확인

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 및 2023.1.1은 Kotlin
플러그인을 1.9.0 버전으로 업데이트하도록 자동으로 제안합니다. IntelliJ IDEA 2023.2에는 Kotlin 1.9.0 플러그인이 포함될 것입니다.

Android Studio Giraffe (223) 및 Hedgehog (231)는 향후 릴리스에서 Kotlin 1.9.0을 지원할 것입니다.

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)에서 다운로드할 수 있습니다.

### Gradle 설정 구성

Kotlin 아티팩트 및 종속성을 다운로드하려면 `settings.gradle(.kts)` 파일을 업데이트하여 Maven Central 저장소를 사용하세요:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

저장소가 지정되지 않으면 Gradle은 사용 중단된 JCenter 저장소를 사용하며, 이는 Kotlin 아티팩트와 관련된 문제를 일으킬 수 있습니다.

## Kotlin 1.9.0 호환성 가이드

Kotlin 1.9.0은 [기능 릴리스(feature release)](kotlin-evolution-principles.md#language-and-tooling-releases)이므로,
이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항을 가져올 수 있습니다. 이러한 변경 사항에 대한 자세한 목록은
[Kotlin 1.9.0 호환성 가이드](compatibility-guide-19.md)에서 확인할 수 있습니다.