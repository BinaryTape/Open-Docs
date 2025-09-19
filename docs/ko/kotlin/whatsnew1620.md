[//]: # (title: Kotlin 1.6.20의 새로운 기능)

_[출시일: 2022년 4월 4일](releases.md#release-details)_

Kotlin 1.6.20은 향후 언어 기능의 미리 보기를 제공하며, 계층적 구조를 멀티플랫폼 프로젝트의 기본값으로 설정하고, 다른 구성 요소에 대한 진화적 개선 사항을 가져옵니다.

이 비디오에서 변경 사항에 대한 간략한 개요를 확인할 수도 있습니다:

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 언어

Kotlin 1.6.20에서는 두 가지 새로운 언어 기능을 사용해 볼 수 있습니다:

*   [Kotlin/JVM용 컨텍스트 리시버 프로토타입](#prototype-of-context-receivers-for-kotlin-jvm)
*   [확정적 non-nullable 타입](#definitely-non-nullable-types)

### Kotlin/JVM용 컨텍스트 리시버 프로토타입

> 이 기능은 Kotlin/JVM에서만 사용할 수 있는 프로토타입입니다. `-Xcontext-receivers`를 활성화하면 컴파일러는 프로덕션 코드에 사용할 수 없는 사전 출시 바이너리를 생성합니다. 컨텍스트 리시버는 시험용 프로젝트에서만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.6.20부터는 하나의 리시버(receiver)만 가질 수 있다는 제약이 사라졌습니다. 더 많은 리시버가 필요한 경우, 선언에 컨텍스트 리시버(context receiver)를 추가하여 함수, 프로퍼티, 클래스를 컨텍스트 의존적(_contextual_)으로 만들 수 있습니다. 컨텍스트 선언은 다음을 수행합니다:

*   선언된 모든 컨텍스트 리시버가 호출자(caller)의 스코프에 암시적 리시버로 존재해야 합니다.
*   선언된 컨텍스트 리시버를 자신의 본문 스코프(body scope)로 암시적 리시버로 가져옵니다.

```kotlin
interface LoggingContext {
    val log: Logger // 이 컨텍스트는 로거에 대한 참조를 제공합니다.
}

context(LoggingContext)
fun startBusinessOperation() {
    // LoggingContext가 암시적 리시버이므로 log 프로퍼티에 접근할 수 있습니다.
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // startBusinessOperation()을 호출하려면 스코프에 LoggingContext가 암시적 리시버로 있어야 합니다.
        startBusinessOperation()
    }
}
```

프로젝트에서 컨텍스트 리시버를 활성화하려면 `-Xcontext-receivers` 컴파일러 옵션을 사용하십시오. 기능 및 구문에 대한 자세한 설명은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design)에서 확인할 수 있습니다.

구현은 프로토타입이며 다음 사항에 유의하십시오:

*   `-Xcontext-receivers`가 활성화되면 컴파일러는 프로덕션 코드에 사용할 수 없는 사전 출시 바이너리를 생성합니다.
*   현재 컨텍스트 리시버에 대한 IDE 지원은 미미합니다.

이 기능을 시험용 프로젝트에서 사용해보고 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-42435)에 여러분의 생각과 경험을 공유해 주십시오. 문제가 발생하면 [새 이슈를 제출](https://kotl.in/issue)해 주십시오.

### 확정적 non-nullable 타입

> 확정적 non-nullable 타입은 [베타](components-stability.md) 단계에 있습니다. 거의 안정적이지만, 향후 마이그레이션 단계가 필요할 수 있습니다. 변경 사항을 최소화하기 위해 최선을 다할 것입니다.
>
{style="warning"}

제네릭 Java 클래스 및 인터페이스를 확장할 때 더 나은 상호 운용성을 제공하기 위해, Kotlin 1.6.20에서는 새로운 구문 `T & Any`를 사용하여 사용 지점(use site)에서 제네릭 타입 파라미터를 확정적 non-nullable로 표시할 수 있습니다.
이 구문 형식은 [교차 타입(intersection types)](https://en.wikipedia.org/wiki/Intersection_type) 표기법에서 유래했으며, 현재는 `&`의 왼쪽에 nullable 상위 바운드(upper bound)를 가진 타입 파라미터와 오른쪽에 non-nullable `Any`로 제한됩니다:

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // 에러: 'null'은 non-null 타입의 값이 될 수 없습니다.
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // 에러: 'null'은 non-null 타입의 값이 될 수 없습니다.
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

이 기능을 활성화하려면 언어 버전을 `1.7`로 설정하십시오:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</tab>
</tabs>

[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)에서 확정적 non-nullable 타입에 대해 자세히 알아보십시오.

## Kotlin/JVM

Kotlin 1.6.20은 다음을 소개합니다:

*   JVM 인터페이스의 기본 메서드 호환성 개선: [인터페이스를 위한 새로운 `@JvmDefaultWithCompatibility` 어노테이션](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 및 [`-Xjvm-default` 모드의 호환성 변경 사항](#compatibility-changes-in-the-xjvm-default-modes)
*   [JVM 백엔드에서 단일 모듈 병렬 컴파일 지원](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
*   [함수형 인터페이스 생성자에 대한 호출 가능 참조 지원](#support-for-callable-references-to-functional-interface-constructors)

### 인터페이스를 위한 새로운 @JvmDefaultWithCompatibility 어노테이션

Kotlin 1.6.20은 새로운 어노테이션 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)를 소개합니다. 이를 `-Xjvm-default=all` 컴파일러 옵션과 함께 사용하여 모든 Kotlin 인터페이스의 non-abstract 멤버에 대해 [JVM 인터페이스에 기본 메서드를 생성](java-to-kotlin-interop.md#default-methods-in-interfaces)할 수 있습니다.

`-Xjvm-default=all` 옵션 없이 컴파일된 Kotlin 인터페이스를 사용하는 클라이언트가 있는 경우, 이 옵션으로 컴파일된 코드와 이진(binary) 호환성이 없을 수 있습니다.
Kotlin 1.6.20 이전에는 이러한 호환성 문제를 피하기 위해, [권장되는 접근 방식](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)은 `-Xjvm-default=all-compatibility` 모드를 사용하고, 이러한 유형의 호환성이 필요 없는 인터페이스에는 `@JvmDefaultWithoutCompatibility` 어노테이션을 사용하는 것이었습니다.

이 접근 방식에는 몇 가지 단점이 있었습니다:

*   새로운 인터페이스가 추가될 때 어노테이션 추가를 쉽게 잊을 수 있었습니다.
*   일반적으로 public API보다 비공개 부분에 더 많은 인터페이스가 있으므로, 코드의 여러 곳에 이 어노테이션을 두게 됩니다.

이제 `-Xjvm-default=all` 모드를 사용하고 `@JvmDefaultWithCompatibility` 어노테이션으로 인터페이스를 표시할 수 있습니다.
이를 통해 public API의 모든 인터페이스에 이 어노테이션을 한 번만 추가할 수 있으며, 새로운 비공개 코드에는 어노테이션을 사용할 필요가 없습니다.

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-48217)에 이 새로운 어노테이션에 대한 피드백을 남겨주십시오.

### -Xjvm-default 모드의 호환성 변경 사항

Kotlin 1.6.20은 기본 모드(`-Xjvm-default=disable` 컴파일러 옵션)의 모듈을 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 모드로 컴파일된 모듈에 대해 컴파일하는 옵션을 추가합니다.
이전과 마찬가지로, 모든 모듈이 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 모드를 가지고 있다면 컴파일은 성공적으로 이루어질 것입니다.
[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47000)에 피드백을 남길 수 있습니다.

Kotlin 1.6.20은 컴파일러 옵션 `-Xjvm-default`의 `compatibility` 및 `enable` 모드를 사용 중단(deprecate)합니다.
호환성과 관련하여 다른 모드의 설명에 변경 사항이 있지만, 전체적인 로직은 동일하게 유지됩니다.
[업데이트된 설명](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)을 확인하십시오.

Java 상호 운용성의 기본 메서드에 대한 자세한 내용은 [상호 운용성 문서](java-to-kotlin-interop.md#default-methods-in-interfaces) 및
[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 참조하십시오.

### JVM 백엔드에서 단일 모듈 병렬 컴파일 지원

> JVM 백엔드에서 단일 모듈 병렬 컴파일 지원은 [실험적](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다. (아래 세부 정보 참조) 옵트인(Opt-in)이 필요하며, 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085)에 대한 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

[새로운 JVM IR 백엔드 컴파일 시간 개선](https://youtrack.jetbrains.com/issue/KT-46768) 작업을 계속하고 있습니다.
Kotlin 1.6.20에서는 모듈의 모든 파일을 병렬로 컴파일하는 실험적인 JVM IR 백엔드 모드를 추가했습니다.
병렬 컴파일은 전체 컴파일 시간을 최대 15%까지 단축할 수 있습니다.

[컴파일러 옵션](compiler-reference.md#compiler-options) `-Xbackend-threads`를 사용하여 실험적인 병렬 백엔드 모드를 활성화하십시오.
이 옵션에 대해 다음 인수를 사용하십시오:

*   `N`은 사용하려는 스레드 수입니다. CPU 코어 수보다 커서는 안 됩니다. 그렇지 않으면 스레드 간 컨텍스트 전환으로 인해 병렬화가 효과적이지 않게 됩니다.
*   `0`은 각 CPU 코어에 대해 별도의 스레드를 사용합니다.

[Gradle](gradle.md)은 작업을 병렬로 실행할 수 있지만, 프로젝트(또는 프로젝트의 주요 부분)가 Gradle 관점에서 하나의 큰 작업일 경우 이러한 유형의 병렬화는 크게 도움이 되지 않습니다.
매우 큰 모놀리식 모듈이 있는 경우, 병렬 컴파일을 사용하여 더 빠르게 컴파일하십시오.
프로젝트가 많은 작은 모듈로 구성되어 있고 Gradle에 의해 빌드가 병렬화되어 있다면, 컨텍스트 전환으로 인해 또 다른 병렬화 계층을 추가하는 것이 성능에 악영향을 미칠 수 있습니다.

> 병렬 컴파일에는 몇 가지 제약이 있습니다:
> *   [kapt](kapt.md)는 IR 백엔드를 비활성화하므로 kapt와 함께 작동하지 않습니다.
> *   설계상 더 많은 JVM 힙(heap)이 필요합니다. 힙의 양은 스레드 수에 비례합니다.
>
{style="note"}

### 함수형 인터페이스 생성자에 대한 호출 가능 참조 지원

> 함수형 인터페이스 생성자에 대한 호출 가능 참조 지원은 [실험적](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다. (아래 세부 정보 참조) 옵트인(Opt-in)이 필요하며, 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939)에 대한 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

함수형 인터페이스 생성자에 대한 [호출 가능 참조](reflection.md#callable-references) 지원은 생성자 함수를 가진 인터페이스에서 [함수형 인터페이스](fun-interfaces.md)로 마이그레이션하는 소스 호환 방법을 추가합니다.

다음 코드를 고려하십시오:

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

함수형 인터페이스 생성자에 대한 호출 가능 참조가 활성화되면, 이 코드는 단순히 함수형 인터페이스 선언으로 대체될 수 있습니다:

```kotlin
fun interface Printer {
    fun print()
}
```

해당 생성자는 암시적으로 생성되며, `::Printer` 함수 참조를 사용하는 모든 코드는 컴파일됩니다. 예를 들어:

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

레거시 함수 `Printer`에 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 어노테이션을 `DeprecationLevel.HIDDEN`과 함께 표시하여 이진 호환성을 유지하십시오:

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

이 기능을 활성화하려면 컴파일러 옵션 `-XXLanguage:+KotlinFunInterfaceConstructorReference`를 사용하십시오.

## Kotlin/Native

Kotlin/Native 1.6.20은 새로운 구성 요소의 지속적인 개발을 의미합니다. 다른 플랫폼에서 Kotlin과의 일관된 경험을 향한 또 다른 발걸음을 내디뎠습니다:

*   [새로운 메모리 관리자 업데이트](#an-update-on-the-new-memory-manager)
*   [새로운 메모리 관리자의 sweep 단계 동시 구현](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
*   [어노테이션 클래스 인스턴스화](#instantiation-of-annotation-classes)
*   [Swift async/await와의 상호 운용: KotlinUnit 대신 Swift의 Void 반환](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [libbacktrace를 사용한 더 나은 스택 트레이스](#better-stack-traces-with-libbacktrace)
*   [독립형 Android 실행 파일 지원](#support-for-standalone-android-executables)
*   [성능 개선](#performance-improvements)
*   [cinterop 모듈 임포트 시 개선된 오류 처리](#improved-error-handling-during-cinterop-modules-import)
*   [Xcode 13 라이브러리 지원](#support-for-xcode-13-libraries)

### 새로운 메모리 관리자 업데이트

> 새로운 Kotlin/Native 메모리 관리자는 [알파](components-stability.md) 단계에 있습니다. 호환되지 않게 변경될 수 있으며 향후 수동 마이그레이션이 필요할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 대한 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="note"}

Kotlin 1.6.20에서는 새로운 Kotlin/Native 메모리 관리자의 알파 버전을 사용해 볼 수 있습니다.
이는 JVM과 Native 플랫폼 간의 차이를 없애 멀티플랫폼 프로젝트에서 일관된 개발자 경험을 제공합니다.
예를 들어, Android와 iOS 모두에서 작동하는 새로운 크로스 플랫폼 모바일 애플리케이션을 훨씬 쉽게 만들 수 있습니다.

새로운 Kotlin/Native 메모리 관리자는 스레드 간 객체 공유에 대한 제한을 해제합니다.
또한 안전하고 특별한 관리나 어노테이션이 필요 없는 메모리 누수 없는 동시 프로그래밍 프리미티브를 제공합니다.

새로운 메모리 관리자는 향후 버전에서 기본값이 될 예정이므로, 지금 바로 사용해 보시기를 권장합니다.
새로운 메모리 관리자에 대해 자세히 알아보고 데모 프로젝트를 살펴보려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)을 확인하거나, 직접 사용해 보려면 바로 [마이그레이션 지침](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)으로 이동하십시오.

프로젝트에서 새로운 메모리 관리자를 사용해보고 작동 방식을 확인한 다음, [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 이슈 트래커에 피드백을 공유해 주십시오.

### 새로운 메모리 관리자의 sweep 단계 동시 구현

[Kotlin 1.6에서 발표된](whatsnew16.md#preview-of-the-new-memory-manager) 새로운 메모리 관리자로 이미 전환했다면, 엄청난 실행 시간 개선을 확인할 수 있을 것입니다. 저희 벤치마크에서는 평균 35%의 개선을 보여줍니다.
1.6.20부터는 새로운 메모리 관리자를 위한 sweep 단계의 동시 구현도 제공됩니다.
이는 또한 성능을 향상시키고 가비지 컬렉터 일시 중지(pause) 시간을 단축시켜야 합니다.

새로운 Kotlin/Native 메모리 관리자를 위한 기능을 활성화하려면 다음 컴파일러 옵션을 전달하십시오:

```bash
-Xgc=cms
```

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48526)에 새로운 메모리 관리자 성능에 대한 피드백을 자유롭게 공유해 주십시오.

### 어노테이션 클래스 인스턴스화

Kotlin 1.6.0에서는 어노테이션 클래스 인스턴스화가 Kotlin/JVM 및 Kotlin/JS에서 [안정적](components-stability.md)이 되었습니다.
1.6.20 버전은 Kotlin/Native에 대한 지원을 제공합니다.

[어노테이션 클래스 인스턴스화](annotations.md#instantiation)에 대해 자세히 알아보십시오.

### Swift async/await와의 상호 운용: KotlinUnit 대신 Swift의 Void 반환

> Swift async/await와의 동시성 상호 운용성은 [실험적](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)에 대한 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Swift 5.5부터 제공되는 [Swift의 async/await와의 실험적 상호 운용](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)에 대한 작업을 계속했습니다.
Kotlin 1.6.20은 `Unit` 반환 타입을 가진 `suspend` 함수와 작동하는 방식에서 이전 버전과 다릅니다.

이전에는 이러한 함수가 Swift에서 `KotlinUnit`을 반환하는 `async` 함수로 표현되었습니다. 그러나 이들에 대한 적절한 반환 타입은 non-suspending 함수와 유사하게 `Void`입니다.

기존 코드의 호환성 파괴를 방지하기 위해, 컴파일러가 `Unit`을 반환하는 suspend 함수를 `async` Swift의 `Void` 반환 타입으로 번역하도록 하는 Gradle 프로퍼티를 도입하고 있습니다:

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

향후 Kotlin 릴리스에서는 이 동작을 기본값으로 설정할 계획입니다.

### libbacktrace를 사용한 더 나은 스택 트레이스

> 소스 위치 해결에 libbacktrace를 사용하는 것은 [실험적](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424)에 대한 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin/Native는 이제 `linux*` (단, `linuxMips32` 및 `linuxMipsel32` 제외) 및 `androidNative*` 타겟의 더 나은 디버깅을 위해 파일 위치 및 줄 번호가 포함된 상세 스택 트레이스를 생성할 수 있습니다.

이 기능은 내부적으로 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 라이브러리를 사용합니다.
다음 코드를 통해 차이점의 예를 살펴보십시오:

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

*   **1.6.20 이전:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```
{initial-collapse-state="collapsed" collapsible="true"}

*   **libbacktrace가 적용된 1.6.20:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x229550    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe        0x22420c    kfun:kotlin.Exception#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe        0x22430c    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe        0x22470c    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
   at 5   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe        0x25fac8    kfun:#bar(){} + 104 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe        0x25fa4c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
```
{initial-collapse-state="collapsed" collapsible="true"}

스택 트레이스에 이미 파일 위치와 줄 번호가 있던 Apple 타겟에서는 libbacktrace가 인라인 함수 호출에 대해 더 자세한 정보를 제공합니다:

*   **1.6.20 이전:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10a85a8f8    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x10a855846    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x10a855936    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x10a855c86    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x10a8489a5    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:1)
   at 5   example.kexe    0x10a84891c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

*   **libbacktrace가 적용된 1.6.20:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
>>  at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

libbacktrace를 사용하여 더 나은 스택 트레이스를 생성하려면 `gradle.properties`에 다음 줄을 추가하십시오:

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48424)에 libbacktrace를 사용한 Kotlin/Native 디버깅이 어떻게 작동하는지 알려주십시오.

### 독립형 Android 실행 파일 지원

이전에는 Kotlin/Native의 Android Native 실행 파일은 실제 실행 파일이 아니라 NativeActivity로 사용할 수 있는 공유 라이브러리였습니다. 이제 Android Native 타겟을 위한 표준 실행 파일을 생성하는 옵션이 있습니다.

이를 위해 프로젝트의 `build.gradle(.kts)` 부분에서 `androidNative` 타겟의 실행 파일 블록을 구성하십시오. 다음 바이너리 옵션을 추가하십시오:

```kotlin
kotlin {
    androidNativeX64("android") {
        binaries {
            executable {
                binaryOptions["androidProgramType"] = "standalone"
            }
        }
    }
}
```

이 기능은 Kotlin 1.7.0에서 기본값이 될 예정입니다. 현재 동작을 유지하려면 다음 설정을 사용하십시오:

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

Mattia Iavarone의 [구현](https://github.com/jetbrains/kotlin/pull/4624)에 감사드립니다!

### 성능 개선

[컴파일 프로세스 속도 향상](https://youtrack.jetbrains.com/issue/KT-42294) 및 개발 경험 개선을 위해 Kotlin/Native에 열심히 노력하고 있습니다.

Kotlin 1.6.20은 Kotlin이 생성하는 LLVM IR에 영향을 미치는 일부 성능 업데이트 및 버그 수정을 포함합니다.
내부 프로젝트 벤치마크에 따르면, 평균적으로 다음과 같은 성능 향상을 달성했습니다:

*   실행 시간 15% 단축
*   릴리스 및 디버그 바이너리 모두에서 코드 크기 20% 단축
*   릴리스 바이너리 컴파일 시간 26% 단축

이러한 변경 사항은 또한 대규모 내부 프로젝트에서 디버그 바이너리의 컴파일 시간을 10% 단축합니다.

이를 달성하기 위해 컴파일러가 생성하는 일부 합성(synthetic) 객체에 대한 정적 초기화를 구현하고, 모든 함수에 대한 LLVM IR 구조 방식을 개선했으며, 컴파일러 캐시를 최적화했습니다.

### cinterop 모듈 임포트 시 개선된 오류 처리

이번 릴리스는 `cinterop` 도구를 사용하여 Objective-C 모듈을 임포트하는 경우(CocoaPods pod에 일반적인 경우) 개선된 오류 처리를 도입합니다.
이전에는 Objective-C 모듈 작업 중 오류가 발생하면(예: 헤더에서 컴파일 오류 처리 시), `fatal error: could not build module $name`과 같이 정보가 부족한 오류 메시지를 받았습니다.
`cinterop` 도구의 이 부분을 확장하여, 이제 확장된 설명과 함께 오류 메시지를 받을 수 있습니다.

### Xcode 13 라이브러리 지원

Xcode 13과 함께 제공되는 라이브러리는 이번 릴리스부터 완벽하게 지원됩니다. Kotlin 코드 어디에서든 자유롭게 접근할 수 있습니다.

## Kotlin Multiplatform

1.6.20은 Kotlin Multiplatform에 다음과 같은 주목할 만한 업데이트를 제공합니다:

*   [모든 새로운 멀티플랫폼 프로젝트에 계층적 구조 지원이 기본으로 적용됨](#hierarchical-structure-support-for-multiplatform-projects)
*   [Kotlin CocoaPods Gradle 플러그인이 CocoaPods 통합을 위한 몇 가지 유용한 기능 수신](#kotlin-cocoapods-gradle-plugin)

### 멀티플랫폼 프로젝트를 위한 계층적 구조 지원

Kotlin 1.6.20에는 계층적 구조 지원이 기본으로 활성화되어 있습니다.
[Kotlin 1.4.0에서 이를 도입](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)한 이래로, 프론트엔드를 크게 개선하고 IDE 임포트를 안정화했습니다.

이전에는 멀티플랫폼 프로젝트에 코드를 추가하는 두 가지 방법이 있었습니다. 첫 번째는 플랫폼별 소스 세트에 코드를 삽입하는 것으로, 이는 하나의 타겟으로 제한되며 다른 플랫폼에서 재사용할 수 없습니다.
두 번째는 현재 Kotlin이 지원하는 모든 플랫폼에서 공유되는 공통 소스 세트를 사용하는 것입니다.

이제 많은 공통 로직과 서드파티 API를 재사용하는 여러 유사한 네이티브 타겟 간에 [소스 코드를 공유](#better-code-sharing-in-your-project)할 수 있습니다.
이 기술은 올바른 기본 종속성을 제공하고 공유 코드에서 사용 가능한 정확한 API를 찾아줍니다.
이는 복잡한 빌드 설정을 없애고 네이티브 타겟 간의 소스 세트 공유를 위한 IDE 지원을 얻기 위해 해결 방법을 사용할 필요를 줄여줍니다. 또한 다른 타겟을 위한 API가 안전하지 않게 사용되는 것을 방지하는 데 도움이 됩니다.

계층적 프로젝트 구조는 [라이브러리 작성자](#more-opportunities-for-library-authors)에게도 유용할 것입니다. 공통 API를 가진 라이브러리를 특정 타겟의 하위 집합에 대해 게시하고 소비할 수 있기 때문입니다.

기본적으로 계층적 프로젝트 구조로 게시된 라이브러리는 계층적 구조 프로젝트와만 호환됩니다.

#### 프로젝트에서 더 나은 코드 공유

계층적 구조 지원이 없으면, [Kotlin 타겟](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets) 중 _일부_에만 코드를 공유하고 _전체_에는 공유하지 않는 직접적인 방법이 없습니다.
인기 있는 예시 중 하나는 모든 iOS 타겟 간에 코드를 공유하고 Foundation과 같은 iOS 특정 [종속성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)에 접근하는 것입니다.

계층적 프로젝트 구조 지원 덕분에, 이제 기본적으로 이를 달성할 수 있습니다.
새로운 구조에서는 소스 세트가 계층을 형성합니다.
주어진 소스 세트가 컴파일되는 각 타겟에 사용 가능한 플랫폼별 언어 기능 및 종속성을 사용할 수 있습니다.

예를 들어, iOS 장치 및 시뮬레이터를 위한 두 가지 타겟 — `iosArm64` 및 `iosX64` — 을 가진 일반적인 멀티플랫폼 프로젝트를 고려해 보십시오.
Kotlin 툴링은 두 타겟이 동일한 함수를 가지고 있음을 이해하고 중간 소스 세트인 `iosMain`에서 해당 함수에 접근할 수 있도록 허용합니다.

![iOS hierarchy example](ios-hierarchy-example.jpg){width=700}

Kotlin 툴체인은 Kotlin/Native stdlib 또는 네이티브 라이브러리와 같은 올바른 기본 종속성을 제공합니다.
또한 Kotlin 툴링은 공유 코드에서 사용 가능한 정확한 API 표면 영역을 찾기 위해 최선을 다할 것입니다.
이는 예를 들어, Windows용으로 공유된 코드에서 macOS 특정 함수를 사용하는 경우와 같은 상황을 방지합니다.

#### 라이브러리 작성자를 위한 더 많은 기회

멀티플랫폼 라이브러리가 게시될 때, 중간 소스 세트의 API는 이제 함께 제대로 게시되어 소비자에게 제공됩니다.
다시 말해, Kotlin 툴체인은 소비자 소스 세트에서 사용 가능한 API를 자동으로 파악하는 동시에, 예를 들어 JVM을 위한 API를 JS 코드에서 사용하는 것과 같이 안전하지 않은 사용을 신중하게 감시할 것입니다.
[라이브러리에서 코드 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)에 대해 자세히 알아보십시오.

#### 구성 및 설정

Kotlin 1.6.20부터 모든 새로운 멀티플랫폼 프로젝트는 계층적 프로젝트 구조를 가집니다. 추가 설정은 필요하지 않습니다.

*   이미 [수동으로 활성화](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)했다면, `gradle.properties`에서 사용 중단된 옵션을 제거할 수 있습니다:

    ```none
    # gradle.properties
    kotlin.mpp.enableGranularSourceSetsMetadata=true
    kotlin.native.enableDependencyPropagation=false // 또는 'true', 이전 설정에 따라 다름
    ```

*   Kotlin 1.6.20에서는 최상의 경험을 위해 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 이상을 사용하는 것을 권장합니다.

*   선택 해제할 수도 있습니다. 계층적 구조 지원을 비활성화하려면 `gradle.properties`에서 다음 옵션을 설정하십시오:

    ```none
    # gradle.properties
    kotlin.mpp.hierarchicalStructureSupport=false
    ```

#### 피드백 남기기

이는 전체 생태계에 중요한 변화입니다. 더욱 개선하는 데 도움이 될 여러분의 피드백을 주시면 감사하겠습니다.

지금 바로 사용해보고 발생하는 모든 어려움을 [이슈 트래커](https://kotl.in/issue)에 보고해 주십시오.

### Kotlin CocoaPods Gradle 플러그인

CocoaPods 통합을 단순화하기 위해 Kotlin 1.6.20은 다음 기능을 제공합니다:

*   CocoaPods 플러그인은 이제 등록된 모든 타겟으로 XCFramework를 빌드하고 Podspec 파일을 생성하는 작업을 제공합니다. 이는 Xcode와 직접 통합하고 싶지 않지만 아티팩트를 빌드하여 로컬 CocoaPods 저장소에 배포하려는 경우에 유용할 수 있습니다.
    
    [XCFramework 빌드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)에 대해 자세히 알아보십시오.

*   프로젝트에서 [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)을 사용하는 경우, 전체 Gradle 프로젝트에 필요한 Pod 버전을 지정하는 데 익숙할 것입니다. 이제 더 많은 옵션이 있습니다:
    *   `cocoapods` 블록에 Pod 버전을 직접 지정
    *   Gradle 프로젝트 버전 계속 사용
    
    이러한 속성 중 어느 것도 구성되지 않으면 오류가 발생합니다.

*   이제 전체 Gradle 프로젝트의 이름을 변경하는 대신 `cocoapods` 블록에서 CocoaPod 이름을 구성할 수 있습니다.

*   CocoaPods 플러그인은 새로운 `extraSpecAttributes` 속성을 도입합니다. 이 속성을 사용하여 이전에 `libraries` 또는 `vendored_frameworks`와 같이 하드코딩되었던 Podspec 파일의 속성을 구성할 수 있습니다.

```kotlin
kotlin {
    cocoapods {
        version = "1.0"
        name = "MyCocoaPod"
        extraSpecAttributes["social_media_url"] = 'https://twitter.com/kotlin'
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        extraSpecAttributes["libraries"] = 'xml'
    }
}
```

전체 Kotlin CocoaPods Gradle 플러그인 [DSL 참조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)를 참조하십시오.

## Kotlin/JS

Kotlin/JS 1.6.20의 개선 사항은 주로 IR 컴파일러에 영향을 미칩니다:

*   [개발 바이너리용 증분 컴파일 (IR)](#incremental-compilation-for-development-binaries-with-ir-compiler)
*   [기본적으로 최상위 프로퍼티 지연 초기화 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
*   [기본적으로 프로젝트 모듈에 대한 별도의 JS 파일 (IR)](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
*   [Char 클래스 최적화 (IR)](#char-class-optimization)
*   [내보내기 개선 (IR 및 레거시 백엔드 모두)](#improvements-to-export-and-typescript-declaration-generation)
*   [비동기 테스트를 위한 @AfterTest 보장](#aftertest-guarantees-for-asynchronous-tests)

### IR 컴파일러를 사용한 개발 바이너리용 증분 컴파일

IR 컴파일러를 사용한 Kotlin/JS 개발을 더욱 효율적으로 만들기 위해, 새로운 _증분 컴파일_ 모드를 도입하고 있습니다.

이 모드에서 `compileDevelopmentExecutableKotlinJs` Gradle 작업을 사용하여 **개발 바이너리**를 빌드할 때, 컴파일러는 모듈 수준에서 이전 컴파일 결과를 캐시합니다.
이는 변경되지 않은 소스 파일에 대해 캐시된 컴파일 결과를 후속 컴파일에 사용하여, 특히 작은 변경 사항이 있을 때 더 빠르게 완료되도록 합니다.
이 개선 사항은 개발 프로세스(편집-빌드-디버그 주기 단축)만을 대상으로 하며, 프로덕션 아티팩트 빌드에는 영향을 미치지 않습니다.

개발 바이너리에 대한 증분 컴파일을 활성화하려면 프로젝트의 `gradle.properties`에 다음 줄을 추가하십시오:

```none
# gradle.properties
kotlin.incremental.js.ir=true // 기본값은 false
```

저희 테스트 프로젝트에서는 새로운 모드가 증분 컴파일을 최대 30% 더 빠르게 만들었습니다. 그러나 이 모드에서의 클린 빌드(clean build)는 캐시를 생성하고 채워야 하므로 더 느려졌습니다.

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-50203)에 Kotlin/JS 프로젝트에서 증분 컴파일을 사용하는 것에 대한 의견을 알려주십시오.

### IR 컴파일러를 사용한 기본 최상위 프로퍼티 지연 초기화

Kotlin 1.4.30에서는 JS IR 컴파일러에서 [최상위 프로퍼티 지연 초기화](whatsnew1430.md#lazy-initialization-of-top-level-properties)의 프로토타입을 선보였습니다.
애플리케이션 시작 시 모든 프로퍼티를 초기화할 필요를 없앰으로써, 지연 초기화는 시작 시간을 단축합니다. 저희 측정 결과 실제 Kotlin/JS 애플리케이션에서 약 10%의 속도 향상을 보였습니다.

이제 이 메커니즘을 다듬고 제대로 테스트한 후, IR 컴파일러에서 최상위 프로퍼티에 대한 지연 초기화를 기본값으로 설정하고 있습니다.

```kotlin
// 지연 초기화
val a = run {
    val result = // 집중적인 계산
        println(result)
    result
} // run은 변수가 처음 사용될 때 실행됩니다.
```

어떤 이유로든 프로퍼티를 즉시(애플리케이션 시작 시) 초기화해야 하는 경우, [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 어노테이션으로 표시하십시오.

### IR 컴파일러를 사용한 기본 프로젝트 모듈용 별도 JS 파일

이전에는 JS IR 컴파일러가 프로젝트 모듈에 대한 [별도의 `.js` 파일 생성]( https://youtrack.jetbrains.com/issue/KT-44319) 기능을 제공했습니다. 이는 전체 프로젝트에 대한 단일 `.js` 파일이라는 기본 옵션의 대안이었습니다.
이 파일은 너무 크고 사용하기 불편할 수 있습니다. 프로젝트의 함수를 사용하려면 전체 JS 파일을 종속성으로 포함해야 하기 때문입니다. 여러 파일을 가지면 유연성이 추가되고 이러한 종속성의 크기가 줄어듭니다. 이 기능은 `-Xir-per-module` 컴파일러 옵션과 함께 사용할 수 있었습니다.

1.6.20부터 JS IR 컴파일러는 기본적으로 프로젝트 모듈에 대한 별도의 `.js` 파일을 생성합니다.

단일 `.js` 파일로 프로젝트를 컴파일하는 것은 이제 다음 Gradle 속성으로 사용할 수 있습니다:

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module`이 기본값입니다.
```

이전 릴리스에서는 실험적인 모듈별 모드(`-Xir-per-module=true` 플래그를 통해 사용 가능)가 각 모듈에서 `main()` 함수를 호출했습니다. 이는 일반적인 단일 `.js` 모드와 일치하지 않습니다. 1.6.20부터는 `main()` 함수가 두 경우 모두 메인 모듈에서만 호출됩니다. 모듈이 로드될 때 특정 코드를 실행해야 하는 경우, `@EagerInitialization` 어노테이션이 붙은 최상위 프로퍼티를 사용할 수 있습니다. [IR 컴파일러를 사용한 기본 최상위 프로퍼티 지연 초기화](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)를 참조하십시오.

### Char 클래스 최적화

`Char` 클래스는 이제 Kotlin/JS 컴파일러에 의해 박싱(boxing) 없이 처리됩니다([인라인 클래스](inline-classes.md)와 유사).
이는 Kotlin/JS 코드에서 문자(char)에 대한 연산 속도를 높입니다.

성능 향상 외에도, 이는 `Char`가 JavaScript로 내보내지는 방식을 변경합니다: 이제 `Number`로 변환됩니다.

### 내보내기 및 TypeScript 선언 생성 개선

Kotlin 1.6.20은 내보내기 메커니즘([`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 어노테이션)에 대한 여러 수정 및 개선 사항을 제공하며, 여기에는 [TypeScript 선언(`.d.ts`) 생성](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)이 포함됩니다.
인터페이스와 enum을 내보내는 기능을 추가했으며, 이전에 보고된 일부 예외적인 경우에서 내보내기 동작을 수정했습니다.
자세한 내용은 [YouTrack의 내보내기 개선 목록](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)을 참조하십시오.

[JavaScript에서 Kotlin 코드 사용](js-to-kotlin-interop.md)에 대해 자세히 알아보십시오.

### 비동기 테스트를 위한 @AfterTest 보장

Kotlin 1.6.20은 Kotlin/JS에서 비동기 테스트와 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 함수가 올바르게 작동하도록 합니다.
테스트 함수의 반환 타입이 정적으로 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)로 확인되는 경우, 컴파일러는 이제 `@AfterTest` 함수의 실행을 해당 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 콜백으로 스케줄링합니다.

## 보안

Kotlin 1.6.20은 코드의 보안을 향상시키기 위한 몇 가지 기능을 소개합니다:

*   [klib에서 상대 경로 사용](#using-relative-paths-in-klibs)
*   [Kotlin/JS Gradle 프로젝트를 위한 yarn.lock 지속](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
*   [기본적으로 `--ignore-scripts`로 npm 종속성 설치](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### klib에서 상대 경로 사용

`klib` 형식의 라이브러리는 [소스 파일의 직렬화된 IR 표현을 포함](native-libraries.md#library-format)하며, 이는 적절한 디버그 정보 생성을 위한 경로도 포함합니다.
Kotlin 1.6.20 이전에는 저장된 파일 경로가 절대 경로였습니다. 라이브러리 작성자가 절대 경로를 공유하고 싶지 않을 수 있으므로, 1.6.20 버전은 대안 옵션을 제공합니다.

`klib`를 게시하고 아티팩트에서 소스 파일의 상대 경로만 사용하려는 경우, 이제 하나 이상의 소스 파일 기준 경로와 함께 `-Xklib-relative-path-base` 컴파일러 옵션을 전달할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base는 소스 파일의 기준 경로입니다.
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base는 소스 파일의 기준 경로입니다.
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
```

</tab>
</tabs>

### Kotlin/JS Gradle 프로젝트를 위한 yarn.lock 지속

> 이 기능은 Kotlin 1.6.10으로 백포트되었습니다.
>
{style="note"}

The Kotlin/JS Gradle 플러그인은 이제 `yarn.lock` 파일을 지속시키는 기능을 제공하여, 추가 Gradle 구성 없이 프로젝트의 npm 종속성 버전을 고정할 수 있게 합니다.
이 기능은 프로젝트 루트에 자동 생성되는 `kotlin-js-store` 디렉터리를 추가하여 기본 프로젝트 구조에 변경 사항을 가져옵니다. `kotlin-js-store` 디렉터리 안에 `yarn.lock` 파일이 있습니다.
`kotlin-js-store` 디렉터리와 그 내용을 버전 관리 시스템에 커밋하는 것을 강력히 권장합니다.
록 파일을 버전 관리 시스템에 커밋하는 것은 [권장되는 관행](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)입니다. 이는 개발 환경이든 CI/CD 서비스든 관계없이 모든 머신에서 애플리케이션이 정확히 동일한 종속성 트리를 사용하여 빌드되도록 보장하기 때문입니다.
또한 록 파일은 새 머신에서 프로젝트를 체크아웃할 때 npm 종속성이 자동으로 업데이트되는 것을 방지합니다. 이는 보안 문제입니다.

[Dependabot](https://github.com/dependabot)와 같은 도구는 Kotlin/JS 프로젝트의 `yarn.lock` 파일을 구문 분석할 수도 있으며, 의존하는 npm 패키지가 손상된 경우 경고를 제공합니다.

필요한 경우 빌드 스크립트에서 디렉터리 및 록 파일 이름을 모두 변경할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> 록 파일 이름을 변경하면 종속성 검사 도구가 더 이상 해당 파일을 인식하지 못할 수 있습니다.
>
{style="warning"}

### 기본적으로 --ignore-scripts로 npm 종속성 설치

> 이 기능은 Kotlin 1.6.10으로 백포트되었습니다.
>
{style="note"}

Kotlin/JS Gradle 플러그인은 이제 기본적으로 npm 종속성 설치 중 [수명 주기 스크립트](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts) 실행을 방지합니다.
이 변경 사항은 손상된 npm 패키지에서 악성 코드가 실행될 가능성을 줄이는 것을 목표로 합니다.

이전 구성으로 되돌리려면 `build.gradle(.kts)`에 다음 줄을 추가하여 수명 주기 스크립트 실행을 명시적으로 활성화할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

[Kotlin/JS Gradle 프로젝트의 npm 종속성](js-project-setup.md#npm-dependencies)에 대해 자세히 알아보십시오.

## Gradle

Kotlin 1.6.20은 Kotlin Gradle 플러그인에 다음과 같은 변경 사항을 제공합니다:

*   Kotlin 컴파일러 실행 전략 정의를 위한 새로운 [속성 `kotlin.compiler.execution.strategy` 및 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
*   [`kapt.use.worker.api`, `kotlin.experimental.coroutines`, 및 `kotlin.coroutines` 빌드 옵션 사용 중단](#deprecation-of-build-options-for-kapt-and-coroutines)
*   [`kotlin.parallel.tasks.in.project` 빌드 옵션 제거](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### Kotlin 컴파일러 실행 전략 정의를 위한 속성

Kotlin 1.6.20 이전에는 시스템 속성 `-Dkotlin.compiler.execution.strategy`를 사용하여 Kotlin 컴파일러 실행 전략을 정의했습니다.
이 속성은 경우에 따라 불편할 수 있었습니다.
Kotlin 1.6.20은 동일한 이름의 Gradle 속성 `kotlin.compiler.execution.strategy`와 컴파일 작업 속성 `compilerExecutionStrategy`를 도입합니다.

시스템 속성은 여전히 작동하지만, 향후 릴리스에서는 제거될 예정입니다.

현재 속성 우선순위는 다음과 같습니다:

*   작업 속성 `compilerExecutionStrategy`는 시스템 속성 및 Gradle 속성 `kotlin.compiler.execution.strategy`보다 우선합니다.
*   Gradle 속성은 시스템 속성보다 우선합니다.

이러한 속성에 할당할 수 있는 세 가지 컴파일러 실행 전략이 있습니다:

| 전략             | Kotlin 컴파일러가 실행되는 위치       | 증분 컴파일 | 기타 특성                                                |
| :--------------- | :---------------------------------- | :---------- | :------------------------------------------------------- |
| 데몬             | 자체 데몬 프로세스 내부             | 예          | *기본 전략*. 다른 Gradle 데몬 간에 공유될 수 있음     |
| 인-프로세스      | Gradle 데몬 프로세스 내부           | 아니요      | Gradle 데몬과 힙 공유 가능                             |
| 아웃-오브-프로세스 | 각 호출에 대해 별도의 프로세스      | 아니요      | —                                                        |

따라서 `kotlin.compiler.execution.strategy` 속성(시스템 및 Gradle 모두)에 사용할 수 있는 값은 다음과 같습니다:
1.  `daemon` (기본값)
2.  `in-process`
3.  `out-of-process`

`gradle.properties`에서 Gradle 속성 `kotlin.compiler.execution.strategy`를 사용하십시오:

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 작업 속성에 사용할 수 있는 값은 다음과 같습니다:

1.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (기본값)
2.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

`build.gradle.kts` 빌드 스크립트에서 `compilerExecutionStrategy` 작업 속성을 사용하십시오:

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

[이 YouTrack 작업](https://youtrack.jetbrains.com/issue/KT-49299)에 피드백을 남겨주십시오.

### kapt 및 코루틴 빌드 옵션 사용 중단

Kotlin 1.6.20에서는 속성의 사용 중단 수준을 변경했습니다:

*   Kotlin 데몬을 통해 [kapt](kapt.md)를 실행하는 기능인 `kapt.use.worker.api`를 사용 중단했습니다. 이제 Gradle 출력에 경고가 표시됩니다.
    기본적으로 [kapt는 1.3.70 릴리스부터 Gradle 워커를 사용](kapt.md#run-kapt-tasks-in-parallel)하고 있으며, 이 방법을 고수하는 것을 권장합니다.

    향후 릴리스에서는 `kapt.use.worker.api` 옵션을 제거할 예정입니다.

*   `kotlin.experimental.coroutines` Gradle DSL 옵션과 `gradle.properties`에 사용되는 `kotlin.coroutines` 속성을 사용 중단했습니다.
    단순히 _suspend 함수_를 사용하거나 `build.gradle(.kts)` 파일에 [`kotlinx.coroutines` 종속성을 추가](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)하십시오.
    
    [코루틴 가이드](coroutines-guide.md)에서 코루틴에 대해 자세히 알아보십시오.

### kotlin.parallel.tasks.in.project 빌드 옵션 제거

Kotlin 1.5.20에서 [빌드 옵션 `kotlin.parallel.tasks.in.project`의 사용 중단](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)을 발표했습니다.
이 옵션은 Kotlin 1.6.20에서 제거되었습니다.

프로젝트에 따라 Kotlin 데몬의 병렬 컴파일은 더 많은 메모리를 필요로 할 수 있습니다.
메모리 소비를 줄이려면 [Kotlin 데몬의 힙 크기를 늘리십시오](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments).

Kotlin Gradle 플러그인의 [현재 지원되는 컴파일러 옵션](gradle-compiler-options.md)에 대해 자세히 알아보십시오.