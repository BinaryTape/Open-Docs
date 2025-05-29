[//]: # (title: Kotlin 1.6.20의 새로운 기능)

_[릴리스: 2022년 4월 4일](releases.md#release-details)_

Kotlin 1.6.20은 향후 언어 기능의 미리보기를 공개하고, 멀티플랫폼 프로젝트에 계층 구조를 기본으로 적용하며, 다른 구성 요소에도 점진적인 개선을 가져옵니다.

변경 사항에 대한 간략한 개요는 다음 비디오에서도 확인할 수 있습니다:

<video src="https://www.youtube.com/v/8F19ds109-o" title="Kotlin 1.6.20의 새로운 기능"/>

## 언어

Kotlin 1.6.20에서는 두 가지 새로운 언어 기능을 사용해 볼 수 있습니다:

*   [Kotlin/JVM용 컨텍스트 수신자 프로토타입](#prototype-of-context-receivers-for-kotlin-jvm)
*   [논-널(Definitely non-nullable) 확정 타입](#definitely-non-nullable-types)

### Kotlin/JVM용 컨텍스트 수신자 프로토타입

> 이 기능은 Kotlin/JVM에서만 사용할 수 있는 프로토타입입니다. `-Xcontext-receivers`를 활성화하면
> 컴파일러는 프로덕션 코드에 사용할 수 없는 사전 릴리스 바이너리를 생성합니다.
> 컨텍스트 수신자는 토이 프로젝트에서만 사용하십시오.
> [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.6.20에서는 더 이상 하나의 수신자만 가질 필요가 없습니다. 더 많은 수신자가 필요한 경우, 함수, 프로퍼티 및 클래스 선언에 컨텍스트 수신자를 추가하여 컨텍스트에 종속적으로(또는 _컨텍스트화_) 만들 수 있습니다. 컨텍스트 선언은 다음을 수행합니다:

*   호출자의 스코프에 모든 선언된 컨텍스트 수신자가 암시적 수신자로 존재하도록 요구합니다.
*   선언된 컨텍스트 수신자를 자체 본문 스코프에 암시적 수신자로 가져옵니다.

```kotlin
interface LoggingContext {
    val log: Logger // 이 컨텍스트는 로거에 대한 참조를 제공합니다.
}

context(LoggingContext)
fun startBusinessOperation() {
    // LoggingContext가 암시적 수신자이므로 log 프로퍼티에 접근할 수 있습니다.
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // startBusinessOperation()을 호출하려면 LoggingContext가 스코프에
        // 암시적 수신자로 존재해야 합니다.
        startBusinessOperation()
    }
}
```

프로젝트에서 컨텍스트 수신자를 활성화하려면 `-Xcontext-receivers` 컴파일러 옵션을 사용하십시오.
이 기능과 구문에 대한 자세한 설명은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design)에서 찾을 수 있습니다.

이 구현은 프로토타입임을 유의하십시오:

*   `-Xcontext-receivers`를 활성화하면 컴파일러는 프로덕션 코드에 사용할 수 없는 사전 릴리스 바이너리를 생성합니다.
*   현재 컨텍스트 수신자를 위한 IDE 지원은 최소한입니다.

토이 프로젝트에서 이 기능을 사용해보고 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-42435)에서 여러분의 생각과 경험을 공유해 주십시오.
문제가 발생하면 [새로운 이슈를 제출](https://kotl.in/issue)해 주십시오.

### 논-널(Definitely non-nullable) 확정 타입

> 논-널(Definitely non-nullable) 확정 타입은 [베타](components-stability.md) 상태입니다. 거의 안정적이지만,
> 향후 마이그레이션 단계가 필요할 수 있습니다.
> 여러분이 해야 할 변경 사항을 최소화하기 위해 최선을 다할 것입니다.
>
{style="warning"}

제네릭 Java 클래스 및 인터페이스를 확장할 때 더 나은 상호 운용성을 제공하기 위해, Kotlin 1.6.20에서는 새로운 구문 `T & Any`를 사용하여 사용 위치에서 제네릭 타입 파라미터를 논-널 확정으로 표시할 수 있습니다.
이 구문 형식은 [교차 타입](https://en.wikipedia.org/wiki/Intersection_type) 표기법에서 유래했으며, 현재는 `&`의 왼쪽에 널 허용 상위 경계를 가진 타입 파라미터와 오른쪽에 널 불가능(non-nullable) `Any`로 제한됩니다.

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // Error: 'null' cannot be a value of a non-null type
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

논-널 확정 타입에 대한 자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)에서 확인하십시오.

## Kotlin/JVM

Kotlin 1.6.20은 다음을 소개합니다:

*   JVM 인터페이스의 디폴트 메서드 호환성 개선: [인터페이스를 위한 새로운 `@JvmDefaultWithCompatibility` 어노테이션](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 및 [`-Xjvm-default` 모드의 호환성 변경 사항](#compatibility-changes-in-the-xjvm-default-modes)
*   [JVM 백엔드에서 단일 모듈의 병렬 컴파일 지원](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
*   [함수형 인터페이스 생성자에 대한 호출 가능 참조 지원](#support-for-callable-references-to-functional-interface-constructors)

### 인터페이스를 위한 새로운 @JvmDefaultWithCompatibility 어노테이션

Kotlin 1.6.20은 새로운 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) 어노테이션을 도입합니다. 이 어노테이션을 `-Xjvm-default=all` 컴파일러 옵션과 함께 사용하여 모든 Kotlin 인터페이스의 모든 비추상(non-abstract) 멤버에 대해 [JVM 인터페이스에 디폴트 메서드를 생성](java-to-kotlin-interop.md#default-methods-in-interfaces)합니다.

`-Xjvm-default=all` 옵션 없이 컴파일된 Kotlin 인터페이스를 사용하는 클라이언트가 있다면, 해당 코드는 이 옵션으로 컴파일된 코드와 바이너리 비호환성이 발생할 수 있습니다.
Kotlin 1.6.20 이전에는 이러한 호환성 문제를 피하기 위해 [권장되는 접근 방식](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)은 `-Xjvm-default=all-compatibility` 모드와 더불어 이러한 유형의 호환성이 필요 없는 인터페이스에 `@JvmDefaultWithoutCompatibility` 어노테이션을 사용하는 것이었습니다.

이 접근 방식에는 몇 가지 단점이 있었습니다:

*   새로운 인터페이스가 추가될 때 어노테이션 추가를 쉽게 잊을 수 있었습니다.
*   일반적으로 공개 API보다 비공개 부분에 더 많은 인터페이스가 있으므로, 코드의 여러 위치에 이 어노테이션을 추가해야 했습니다.

이제 `-Xjvm-default=all` 모드를 사용하고 `@JvmDefaultWithCompatibility` 어노테이션으로 인터페이스를 표시할 수 있습니다.
이를 통해 공개 API의 모든 인터페이스에 이 어노테이션을 한 번 추가할 수 있으며, 새로운 비공개 코드에는 어노테이션을 사용할 필요가 없습니다.

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-48217)에 이 새로운 어노테이션에 대한 피드백을 남겨주세요.

### -Xjvm-default 모드의 호환성 변경 사항

Kotlin 1.6.20은 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 모드로 컴파일된 모듈에 대해 기본 모드( `-Xjvm-default=disable` 컴파일러 옵션)에서 모듈을 컴파일하는 옵션을 추가합니다.
이전과 마찬가지로, 모든 모듈이 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 모드를 가지고 있다면 컴파일은 성공합니다.
[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47000)에 피드백을 남길 수 있습니다.

Kotlin 1.6.20은 컴파일러 옵션 `-Xjvm-default`의 `compatibility` 및 `enable` 모드를 사용 중단합니다.
다른 모드의 설명에는 호환성과 관련하여 변경 사항이 있지만, 전체적인 논리는 동일하게 유지됩니다.
[업데이트된 설명](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)을 확인해볼 수 있습니다.

Java 상호 운용성에서의 디폴트 메서드에 대한 자세한 내용은 [상호 운용성 문서](java-to-kotlin-interop.md#default-methods-in-interfaces) 및
[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 참조하십시오.

### JVM 백엔드에서 단일 모듈의 병렬 컴파일 지원

> JVM 백엔드에서 단일 모듈의 병렬 컴파일 지원은 [실험적](components-stability.md)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(자세한 내용은 아래 참조)이 필요하며, 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

새로운 JVM IR 백엔드의 컴파일 시간을 개선하기 위한 작업을 계속하고 있습니다.
Kotlin 1.6.20에서는 모듈의 모든 파일을 병렬로 컴파일하는 실험적인 JVM IR 백엔드 모드를 추가했습니다.
병렬 컴파일은 전체 컴파일 시간을 최대 15%까지 단축할 수 있습니다.

실험적 병렬 백엔드 모드를 활성화하려면 [컴파일러 옵션](compiler-reference.md#compiler-options) `-Xbackend-threads`를 사용하십시오.
이 옵션에 다음 인수를 사용하십시오:

*   `N`은 사용하려는 스레드 수입니다. CPU 코어 수보다 커서는 안 됩니다. 그렇지 않으면 스레드 간 컨텍스트 전환으로 인해 병렬화가 효과를 잃게 됩니다.
*   `0`은 각 CPU 코어에 별도의 스레드를 사용합니다.

[Gradle](gradle.md)은 태스크를 병렬로 실행할 수 있지만, 프로젝트(또는 프로젝트의 주요 부분)가 Gradle의 관점에서 하나의 큰 태스크일 경우 이러한 유형의 병렬화는 크게 도움이 되지 않습니다.
매우 큰 단일 모듈이 있다면 병렬 컴파일을 사용하여 더 빠르게 컴파일하십시오.
프로젝트가 많은 작은 모듈로 구성되어 있고 Gradle에 의해 빌드가 병렬화되어 있다면, 또 다른 병렬화 계층을 추가하는 것은 컨텍스트 전환으로 인해 성능을 저하시킬 수 있습니다.

> 병렬 컴파일에는 몇 가지 제약 사항이 있습니다:
> *   kapt는 IR 백엔드를 비활성화하므로 [kapt](kapt.md)와 함께 작동하지 않습니다.
> *   설계상 더 많은 JVM 힙을 요구합니다. 힙의 양은 스레드 수에 비례합니다.
>
{style="note"}

### 함수형 인터페이스 생성자에 대한 호출 가능 참조 지원

> 함수형 인터페이스 생성자에 대한 호출 가능 참조 지원은 [실험적](components-stability.md)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(자세한 내용은 아래 참조)이 필요하며, 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

함수형 인터페이스 생성자에 대한 [호출 가능 참조](reflection.md#callable-references) 지원은 생성자 함수가 있는 인터페이스에서 [함수형 인터페이스](fun-interfaces.md)로 마이그레이션할 수 있는 소스 호환 방식을 추가합니다.

다음 코드를 살펴보십시오:

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

생성자는 암시적으로 생성되며, `::Printer` 함수 참조를 사용하는 모든 코드는 컴파일됩니다. 예를 들면 다음과 같습니다:

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

레거시 함수 `Printer`에 `DeprecationLevel.HIDDEN`을 사용하여 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 어노테이션을 표시하여 바이너리 호환성을 유지하십시오:

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

이 기능을 활성화하려면 컴파일러 옵션 `-XXLanguage:+KotlinFunInterfaceConstructorReference`를 사용하십시오.

## Kotlin/Native

Kotlin/Native 1.6.20은 새로운 구성 요소의 지속적인 개발을 알립니다. Kotlin을 다른 플랫폼에서 일관된 경험을 제공하기 위한 또 다른 단계를 밟았습니다:

*   [새로운 메모리 관리자에 대한 업데이트](#an-update-on-the-new-memory-manager)
*   [새로운 메모리 관리자의 스윕(sweep) 단계에 대한 동시 구현](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
*   [어노테이션 클래스 인스턴스화](#instantiation-of-annotation-classes)
*   [Swift async/await와의 상호 운용성: KotlinUnit 대신 Swift의 Void 반환](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [libbacktrace를 사용한 더 나은 스택 트레이스](#better-stack-traces-with-libbacktrace)
*   [독립형 Android 실행 파일 지원](#support-for-standalone-android-executables)
*   [성능 향상](#performance-improvements)
*   [cinterop 모듈 가져오기 중 개선된 오류 처리](#improved-error-handling-during-cinterop-modules-import)
*   [Xcode 13 라이브러리 지원](#support-for-xcode-13-libraries)

### 새로운 메모리 관리자에 대한 업데이트

> 새로운 Kotlin/Native 메모리 관리자는 [알파](components-stability.md) 상태입니다.
> 호환되지 않게 변경될 수 있으며 향후 수동 마이그레이션이 필요할 수 있습니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="note"}

Kotlin 1.6.20에서는 새로운 Kotlin/Native 메모리 관리자의 알파 버전을 사용해 볼 수 있습니다.
이는 JVM과 Native 플랫폼 간의 차이를 없애 멀티플랫폼 프로젝트에서 일관된 개발자 경험을 제공합니다.
예를 들어, Android와 iOS 모두에서 작동하는 새로운 크로스 플랫폼 모바일 애플리케이션을 훨씬 쉽게 만들 수 있습니다.

새로운 Kotlin/Native 메모리 관리자는 스레드 간 객체 공유에 대한 제약을 해제합니다.
또한 안전하고 특별한 관리나 어노테이션이 필요 없는 누수 없는 동시성 프로그래밍 프리미티브를 제공합니다.

새로운 메모리 관리자는 향후 버전에서 기본값이 될 예정이므로, 지금 사용해 보시는 것을 권장합니다.
새로운 메모리 관리자에 대해 더 자세히 알아보고 데모 프로젝트를 탐색하려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)을 확인하거나, 직접 사용해 보려면 [마이그레이션 지침](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)으로 바로 이동하십시오.

프로젝트에서 새로운 메모리 관리자를 사용하여 어떻게 작동하는지 확인하고, 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 피드백을 공유해 주십시오.

### 새로운 메모리 관리자의 스윕(sweep) 단계에 대한 동시 구현

[Kotlin 1.6에서 발표된](whatsnew16.md#preview-of-the-new-memory-manager) 새로운 메모리 관리자로 이미 전환했다면, 엄청난 실행 시간 개선을 체감할 수 있을 것입니다. 저희 벤치마크에 따르면 평균 35%의 개선이 있었습니다.
1.6.20부터는 새로운 메모리 관리자를 위한 스윕(sweep) 단계에 대한 동시 구현도 제공됩니다.
이는 성능을 더욱 향상시키고 가비지 컬렉터 중지 시간을 줄이는 데 도움이 될 것입니다.

새로운 Kotlin/Native 메모리 관리자를 위한 이 기능을 활성화하려면 다음 컴파일러 옵션을 전달하십시오:

```bash
-Xgc=cms
```

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48526)에서 새로운 메모리 관리자 성능에 대한 피드백을 자유롭게 공유해 주십시오.

### 어노테이션 클래스 인스턴스화

Kotlin 1.6.0에서는 어노테이션 클래스 인스턴스화가 Kotlin/JVM 및 Kotlin/JS에서 [안정화](components-stability.md)되었습니다.
1.6.20 버전은 Kotlin/Native에 대한 지원을 제공합니다.

[어노테이션 클래스 인스턴스화](annotations.md#instantiation)에 대해 자세히 알아보십시오.

### Swift async/await와의 상호 운용성: KotlinUnit 대신 Swift의 Void 반환

> Swift async/await와의 동시성 상호 운용성은 [실험적](components-stability.md)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

[Swift의 async/await와의 실험적 상호 운용성](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)(Swift 5.5부터 사용 가능)에 대한 작업을 계속 진행하고 있습니다.
Kotlin 1.6.20은 `Unit` 반환 타입을 가진 `suspend` 함수를 처리하는 방식이 이전 버전과 다릅니다.

이전에는 이러한 함수가 Swift에서 `KotlinUnit`을 반환하는 `async` 함수로 표현되었습니다. 그러나 이들에 대한 올바른 반환 타입은 비-suspend 함수와 유사하게 `Void`입니다.

기존 코드를 깨뜨리지 않기 위해, 컴파일러가 `Unit`을 반환하는 suspend 함수를 `Void` 반환 타입을 가진 `async` Swift로 번역하도록 하는 Gradle 프로퍼티를 도입하고 있습니다:

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

향후 Kotlin 릴리스에서는 이 동작이 기본값이 되도록 할 계획입니다.

### libbacktrace를 사용한 더 나은 스택 트레이스

> 소스 위치를 확인하기 위해 libbacktrace를 사용하는 것은 [실험적](components-stability.md)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin/Native는 이제 `linux*` ( `linuxMips32` 및 `linuxMipsel32` 제외) 및 `androidNative*` 타겟에 대한 파일 위치 및 줄 번호가 포함된 상세한 스택 트레이스를 생성할 수 있어 디버깅을 개선합니다.

이 기능은 내부적으로 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 라이브러리를 사용합니다.
다음 코드를 보면 차이점의 예를 확인할 수 있습니다:

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

*   **libbacktrace를 사용한 1.6.20:**

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

이미 스택 트레이스에 파일 위치와 줄 번호가 있는 Apple 타겟의 경우, libbacktrace는 인라인 함수 호출에 대해 더 많은 세부 정보를 제공합니다:

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

*   **libbacktrace를 사용한 1.6.20:**

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

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48424)에서 libbacktrace를 사용하여 Kotlin/Native 디버깅이 어떻게 작동하는지 알려주십시오.

### 독립형 Android 실행 파일 지원

이전에는 Kotlin/Native의 Android Native 실행 파일이 실제 실행 파일이 아니라 NativeActivity로 사용할 수 있는 공유 라이브러리였습니다. 이제 Android Native 타겟용 표준 실행 파일을 생성하는 옵션이 있습니다.

이를 위해 프로젝트의 `build.gradle(.kts)` 부분에서 `androidNative` 타겟의 실행 가능 블록을 구성하십시오.
다음 바이너리 옵션을 추가하십시오:

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

이 기능은 Kotlin 1.7.0에서 기본값이 될 예정입니다.
현재 동작을 유지하려면 다음 설정을 사용하십시오:

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

구현에 기여해준 Mattia Iavarone에게 감사드립니다!

### 성능 향상

컴파일 프로세스 속도를 높이고 [https://youtrack.jetbrains.com/issue/KT-42294](https://youtrack.jetbrains.com/issue/KT-42294) 개발 경험을 개선하기 위해 Kotlin/Native에 많은 노력을 기울이고 있습니다.

Kotlin 1.6.20은 Kotlin이 생성하는 LLVM IR에 영향을 미치는 일부 성능 업데이트 및 버그 수정을 가져옵니다.
내부 프로젝트의 벤치마크에 따르면, 평균적으로 다음과 같은 성능 향상을 달성했습니다:

*   실행 시간 15% 단축
*   릴리스 및 디버그 바이너리의 코드 크기 20% 감소
*   릴리스 바이너리의 컴파일 시간 26% 단축

이러한 변경 사항은 또한 대규모 내부 프로젝트에서 디버그 바이너리의 컴파일 시간을 10% 단축시킵니다.

이를 달성하기 위해, 일부 컴파일러 생성 합성 객체에 대한 정적 초기화를 구현하고, 모든 함수에 대한 LLVM IR 구조 방식을 개선했으며, 컴파일러 캐시를 최적화했습니다.

### cinterop 모듈 가져오기 중 개선된 오류 처리

이번 릴리스에서는 `cinterop` 도구를 사용하여 Objective-C 모듈을 가져올 때(일반적으로 CocoaPods 포드의 경우와 같음) 발생하는 오류에 대한 개선된 오류 처리가 도입되었습니다.
이전에는 Objective-C 모듈 작업 중 오류가 발생하면(예: 헤더의 컴파일 오류 처리 시), `fatal error: could not build module $name`과 같은 정보 없는 오류 메시지를 받았습니다.
`cinterop` 도구의 이 부분을 확장하여, 확장된 설명과 함께 오류 메시지를 받게 됩니다.

### Xcode 13 라이브러리 지원

Xcode 13과 함께 제공되는 라이브러리는 이번 릴리스부터 완벽하게 지원됩니다.
Kotlin 코드 어디에서든 자유롭게 접근할 수 있습니다.

## Kotlin 멀티플랫폼

1.6.20은 Kotlin 멀티플랫폼에 다음과 같은 주요 업데이트를 제공합니다:

*   [계층 구조 지원이 이제 모든 새 멀티플랫폼 프로젝트의 기본값으로 설정](#hierarchical-structure-support-for-multiplatform-projects)
*   [Kotlin CocoaPods Gradle 플러그인에 CocoaPods 통합을 위한 몇 가지 유용한 기능 추가](#kotlin-cocoapods-gradle-plugin)

### 멀티플랫폼 프로젝트를 위한 계층 구조 지원

Kotlin 1.6.20은 계층 구조 지원이 기본적으로 활성화되어 있습니다.
[Kotlin 1.4.0에서 도입된](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure) 이후, 프론트엔드를 크게 개선하고 IDE 가져오기를 안정화했습니다.

이전에는 멀티플랫폼 프로젝트에 코드를 추가하는 두 가지 방법이 있었습니다. 첫 번째는 플랫폼별 소스 세트에 삽입하는 것으로, 이는 하나의 타겟으로 제한되며 다른 플랫폼에서 재사용할 수 없었습니다.
두 번째는 Kotlin이 현재 지원하는 모든 플랫폼에서 공유되는 공통 소스 세트를 사용하는 것이었습니다.

이제 공통 로직과 서드파티 API를 많이 재사용하는 몇몇 유사한 네이티브 타겟 간에 [소스 코드를 공유](#better-code-sharing-in-your-project)할 수 있습니다.
이 기술은 올바른 기본 종속성을 제공하고 공유 코드에서 사용 가능한 정확한 API를 찾아냅니다.
이는 복잡한 빌드 설정을 없애고 네이티브 타겟 간에 소스 세트를 공유하기 위한 IDE 지원을 얻기 위해 해결 방법을 사용해야 하는 필요성을 제거합니다.
또한 다른 타겟을 위한 안전하지 않은 API 사용을 방지하는 데 도움이 됩니다.

이 기술은 [라이브러리 작성자](#more-opportunities-for-library-authors)에게도 유용할 것입니다. 계층적 프로젝트 구조를 통해 타겟의 하위 집합에 대한 공통 API를 가진 라이브러리를 게시하고 사용할 수 있기 때문입니다.

기본적으로, 계층 구조로 게시된 라이브러리는 계층 구조 프로젝트와만 호환됩니다.

#### 프로젝트에서 더 나은 코드 공유

계층 구조 지원이 없으면, _일부_ [Kotlin 타겟](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets) 간에 코드를 공유할 수 있는 직접적인 방법이 없었지만, _모든_ 타겟에 걸쳐 코드를 공유하는 것은 가능했습니다.
인기 있는 예시 중 하나는 모든 iOS 타겟 간에 코드를 공유하고 Foundation과 같은 iOS 특정 [종속성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)에 접근하는 것입니다.

계층적 프로젝트 구조 지원 덕분에, 이제 이 작업을 기본으로 수행할 수 있습니다.
새로운 구조에서는 소스 세트가 계층을 형성합니다.
주어진 소스 세트가 컴파일되는 각 타겟에 사용할 수 있는 플랫폼별 언어 기능과 종속성을 사용할 수 있습니다.

예를 들어, iOS 기기 및 시뮬레이터용 `iosArm64` 및 `iosX64`라는 두 개의 타겟이 있는 일반적인 멀티플랫폼 프로젝트를 고려해 보십시오.
Kotlin 툴체인은 두 타겟이 동일한 함수를 가지고 있음을 이해하고, 중간 소스 세트인 `iosMain`에서 해당 함수에 접근할 수 있도록 허용합니다.

![iOS hierarchy example](ios-hierarchy-example.jpg){width=700}

Kotlin 툴체인은 Kotlin/Native stdlib 또는 네이티브 라이브러리와 같은 올바른 기본 종속성을 제공합니다.
또한 Kotlin 툴체인은 공유 코드에서 사용 가능한 정확한 API 표면 영역을 찾아내기 위해 최선을 다할 것입니다.
이는 예를 들어 Windows용으로 의도된 API를 JS 코드에서 사용하는 것과 같은 경우를 방지합니다.

#### 라이브러리 작성자를 위한 더 많은 기회

멀티플랫폼 라이브러리가 게시될 때, 해당 중간 소스 세트의 API도 이제 제대로 함께 게시되어 소비자에게 제공됩니다.
다시 말하지만, Kotlin 툴체인은 소비자 소스 세트에서 사용 가능한 API를 자동으로 파악하는 동시에, 예를 들어 JVM용 API를 JS 코드에서 사용하는 것과 같이 안전하지 않은 사용을 면밀히 주시합니다.
[라이브러리에서 코드 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)에 대해 자세히 알아보십시오.

#### 구성 및 설정

Kotlin 1.6.20부터 모든 새로운 멀티플랫폼 프로젝트는 계층 구조를 갖게 됩니다. 추가 설정은 필요하지 않습니다.

*   이미 [수동으로 활성화](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)했다면, `gradle.properties`에서 사용 중단된 옵션을 제거할 수 있습니다:

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // 또는 이전 설정에 따라 'true'
  ```

*   Kotlin 1.6.20의 경우, 최상의 경험을 위해 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 이상을 사용하는 것이 좋습니다.

*   또한 옵트아웃할 수도 있습니다. 계층 구조 지원을 비활성화하려면 `gradle.properties`에 다음 옵션을 설정하십시오:

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### 피드백 남기기

이것은 전체 생태계에 중요한 변화입니다. 더 나은 발전을 위해 여러분의 피드백을 주시면 감사하겠습니다.

지금 사용해보고 [이슈 트래커](https://kotl.in/issue)에 발생하는 모든 어려움을 보고해 주십시오.

### Kotlin CocoaPods Gradle 플러그인

CocoaPods 통합을 단순화하기 위해 Kotlin 1.6.20은 다음 기능을 제공합니다:

*   CocoaPods 플러그인에는 이제 등록된 모든 타겟으로 XCFramework를 빌드하고 Podspec 파일을 생성하는 태스크가 있습니다. 이는 Xcode와 직접 통합하고 싶지 않지만 아티팩트를 빌드하여 로컬 CocoaPods 저장소에 배포하고 싶을 때 유용할 수 있습니다.
  
    [XCFramework 빌드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)에 대해 자세히 알아보십시오.

*   프로젝트에서 [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)을 사용하는 경우, 전체 Gradle 프로젝트에 필요한 Pod 버전을 지정하는 데 익숙할 것입니다. 이제 더 많은 옵션이 있습니다:
    *   `cocoapods` 블록에 Pod 버전을 직접 지정합니다.
    *   계속해서 Gradle 프로젝트 버전을 사용합니다.
  
    이러한 속성 중 어느 것도 구성되지 않으면 오류가 발생합니다.

*   이제 전체 Gradle 프로젝트의 이름을 변경하는 대신 `cocoapods` 블록에서 CocoaPod 이름을 구성할 수 있습니다.

*   CocoaPods 플러그인은 새로운 `extraSpecAttributes` 속성을 도입했는데, 이 속성을 사용하여 이전에는 하드코딩되었던 `libraries` 또는 `vendored_frameworks`와 같은 Podspec 파일의 속성을 구성할 수 있습니다.

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

1.6.20의 Kotlin/JS 개선 사항은 주로 IR 컴파일러에 영향을 미칩니다:

*   [IR 컴파일러를 사용한 개발 바이너리용 증분 컴파일](#incremental-compilation-for-development-binaries-with-ir-compiler)
*   [IR 컴파일러를 통한 최상위 프로퍼티의 기본 지연 초기화](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
*   [IR 컴파일러를 통한 프로젝트 모듈의 기본 별도 JS 파일](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
*   [Char 클래스 최적화](#char-class-optimization)
*   [내보내기 개선 (IR 및 레거시 백엔드 모두)](#improvements-to-export-and-typescript-declaration-generation)
*   [비동기 테스트를 위한 @AfterTest 보장](#aftertest-guarantees-for-asynchronous-tests)

### IR 컴파일러를 사용한 개발 바이너리용 증분 컴파일

IR 컴파일러를 사용한 Kotlin/JS 개발을 더욱 효율적으로 만들기 위해, 새로운 _증분 컴파일_ 모드를 도입하고 있습니다.

이 모드에서 `compileDevelopmentExecutableKotlinJs` Gradle 태스크로 **개발 바이너리**를 빌드할 때, 컴파일러는 모듈 수준에서 이전 컴파일 결과를 캐시합니다.
이는 변경되지 않은 소스 파일에 대해 후속 컴파일 시 캐시된 컴파일 결과를 사용하여, 특히 작은 변경이 있을 때 컴파일이 더 빠르게 완료되도록 합니다.
이 개선 사항은 개발 프로세스(편집-빌드-디버그 주기 단축)만을 목표로 하며 프로덕션 아티팩트 빌드에는 영향을 미치지 않습니다.

개발 바이너리에 대한 증분 컴파일을 활성화하려면 프로젝트의 `gradle.properties`에 다음 줄을 추가하십시오:

```none
# gradle.properties
kotlin.incremental.js.ir=true // 기본값은 false
```

저희 테스트 프로젝트에서 새 모드는 증분 컴파일을 최대 30% 더 빠르게 만들었습니다. 그러나 이 모드에서 클린 빌드는 캐시를 생성하고 채워야 하므로 더 느려졌습니다.

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-50203)에서 Kotlin/JS 프로젝트와 증분 컴파일 사용에 대한 의견을 알려주십시오.

### IR 컴파일러를 통한 최상위 프로퍼티의 기본 지연 초기화

Kotlin 1.4.30에서 우리는 JS IR 컴파일러에서 [최상위 프로퍼티의 지연 초기화](whatsnew1430.md#lazy-initialization-of-top-level-properties) 프로토타입을 선보였습니다.
애플리케이션 시작 시 모든 프로퍼티를 초기화할 필요를 없앰으로써, 지연 초기화는 시작 시간을 단축합니다.
저희 측정 결과, 실제 Kotlin/JS 애플리케이션에서 약 10%의 속도 향상을 보였습니다.

이제 이 메커니즘을 다듬고 적절히 테스트한 후, IR 컴파일러에서 최상위 프로퍼티에 대한 지연 초기화를 기본값으로 만들고 있습니다.

```kotlin
// 지연 초기화
val a = run {
    val result = // 많은 계산
        println(result)
    result
} // run은 변수 첫 사용 시 실행됩니다.
```

어떤 이유로든 프로퍼티를 즉시(애플리케이션 시작 시) 초기화해야 하는 경우, [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 어노테이션으로 표시하십시오.

### IR 컴파일러를 통한 프로젝트 모듈의 기본 별도 JS 파일

이전에는 JS IR 컴파일러가 프로젝트 모듈에 대해 [별도의 `.js` 파일을 생성](https://youtrack.jetbrains.com/issue/KT-44319)하는 기능을 제공했습니다.
이는 전체 프로젝트에 대한 단일 `.js` 파일이라는 기본 옵션의 대안이었습니다.
이 파일은 너무 크고 사용하기 불편할 수 있습니다. 프로젝트의 함수를 사용할 때마다 전체 JS 파일을 종속성으로 포함해야 하기 때문입니다.
여러 파일을 가지면 유연성이 추가되고 이러한 종속성의 크기가 줄어듭니다. 이 기능은 `-Xir-per-module` 컴파일러 옵션으로 사용할 수 있었습니다.

1.6.20부터 JS IR 컴파일러는 기본적으로 프로젝트 모듈에 대해 별도의 `.js` 파일을 생성합니다.

프로젝트를 단일 `.js` 파일로 컴파일하는 것은 이제 다음 Gradle 프로퍼티로 사용할 수 있습니다:

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module`이 기본값
```

이전 릴리스에서 실험적인 모듈별 모드 (`-Xir-per-module=true` 플래그를 통해 사용 가능)는 각 모듈에서 `main()` 함수를 호출했습니다. 이는 일반적인 단일 `.js` 모드와 일관되지 않습니다. 1.6.20부터는 두 경우 모두 메인 모듈에서만 `main()` 함수가 호출됩니다. 모듈이 로드될 때 일부 코드를 실행해야 하는 경우 `@EagerInitialization` 어노테이션이 있는 최상위 프로퍼티를 사용할 수 있습니다. [IR 컴파일러를 통한 최상위 프로퍼티의 기본 지연 초기화](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)를 참조하십시오.

### Char 클래스 최적화

`Char` 클래스는 이제 Kotlin/JS 컴파일러에서 박싱을 도입하지 않고 처리됩니다([인라인 클래스](inline-classes.md)와 유사).
이는 Kotlin/JS 코드에서 Char에 대한 연산을 가속화합니다.

성능 향상 외에도, 이는 `Char`가 JavaScript로 내보내지는 방식을 변경합니다. 이제 `Number`로 번역됩니다.

### 내보내기 및 TypeScript 선언 생성 개선

Kotlin 1.6.20은 내보내기 메커니즘([`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 어노테이션)에 대한 여러 수정 및 개선 사항을 제공하며, 여기에는 [TypeScript 선언(`.d.ts`) 생성](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts)이 포함됩니다.
인터페이스와 열거형을 내보낼 수 있는 기능을 추가했으며, 이전에 보고된 일부 예외적인 경우(corner cases)의 내보내기 동작을 수정했습니다.
자세한 내용은 [YouTrack의 내보내기 개선 사항 목록](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)을 참조하십시오.

[JavaScript에서 Kotlin 코드 사용](js-to-kotlin-interop.md)에 대해 자세히 알아보십시오.

### 비동기 테스트를 위한 @AfterTest 보장

Kotlin 1.6.20은 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 함수가 Kotlin/JS의 비동기 테스트에서 제대로 작동하도록 합니다.
테스트 함수의 반환 타입이 정적으로 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)로 확인되는 경우, 컴파일러는 이제 해당 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 콜백으로 `@AfterTest` 함수의 실행을 예약합니다.

## 보안

Kotlin 1.6.20은 코드 보안을 개선하기 위한 몇 가지 기능을 도입합니다:

*   [klib에서 상대 경로 사용](#using-relative-paths-in-klibs)
*   [Kotlin/JS Gradle 프로젝트를 위한 yarn.lock 파일 유지](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
*   [기본적으로 `--ignore-scripts`로 npm 종속성 설치](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### klib에서 상대 경로 사용

`klib` 형식의 라이브러리에는 적절한 디버그 정보를 생성하기 위한 소스 파일의 경로를 포함하는 직렬화된 IR 표현이 포함됩니다.
Kotlin 1.6.20 이전에는 저장된 파일 경로가 절대 경로였습니다. 라이브러리 작성자가 절대 경로를 공유하고 싶지 않을 수 있으므로, 1.6.20 버전은 대체 옵션을 제공합니다.

`klib`를 게시하고 아티팩트에 소스 파일의 상대 경로만 사용하려는 경우, 이제 `-Xklib-relative-path-base` 컴파일러 옵션을 하나 이상의 소스 파일 기본 경로와 함께 전달할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base는 소스 파일의 기본 경로입니다.
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base는 소스 파일의 기본 경로입니다.
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
``` 

</tab>
</tabs>

### Kotlin/JS Gradle 프로젝트를 위한 yarn.lock 파일 유지

> 이 기능은 Kotlin 1.6.10으로 백포팅되었습니다.
>
{style="note"}

Kotlin/JS Gradle 플러그인은 이제 `yarn.lock` 파일을 유지할 수 있는 기능을 제공하여 추가 Gradle 구성 없이 프로젝트의 npm 종속성 버전을 고정할 수 있도록 합니다.
이 기능은 프로젝트 루트에 자동 생성된 `kotlin-js-store` 디렉토리를 추가하여 기본 프로젝트 구조를 변경합니다.
이 디렉토리 안에 `yarn.lock` 파일이 있습니다.

`kotlin-js-store` 디렉토리와 그 내용을 버전 관리 시스템에 커밋하는 것을 강력히 권장합니다.
잠금 파일을 버전 관리 시스템에 커밋하는 것은 [권장되는 방식](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)입니다. 이는 개발 환경이나 CI/CD 서비스와 같은 모든 머신에서 애플리케이션이 정확히 동일한 종속성 트리로 빌드되도록 보장하기 때문입니다.
또한 잠금 파일은 프로젝트가 새 머신에서 체크아웃될 때 npm 종속성이 자동으로 업데이트되는 것을 방지하여 보안 문제를 해소합니다.

[Dependabot](https://github.com/dependabot)와 같은 도구는 Kotlin/JS 프로젝트의 `yarn.lock` 파일을 파싱하여, 종속된 npm 패키지가 손상된 경우 경고를 제공할 수도 있습니다.

필요한 경우, 빌드 스크립트에서 디렉토리 및 잠금 파일 이름을 모두 변경할 수 있습니다:

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

> 잠금 파일의 이름을 변경하면 종속성 검사 도구가 해당 파일을 더 이상 인식하지 못할 수 있습니다.
> 
{style="warning"}

### 기본적으로 --ignore-scripts로 npm 종속성 설치

> 이 기능은 Kotlin 1.6.10으로 백포팅되었습니다.
>
{style="note"}

Kotlin/JS Gradle 플러그인은 이제 기본적으로 npm 종속성 설치 중에 [라이프사이클 스크립트](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts) 실행을 방지합니다.
이 변경은 손상된 npm 패키지에서 악성 코드가 실행될 가능성을 줄이는 것을 목표로 합니다.

이전 구성으로 되돌리려면, `build.gradle(.kts)`에 다음 줄을 추가하여 라이프사이클 스크립트 실행을 명시적으로 활성화할 수 있습니다:

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

Kotlin 1.6.20은 Kotlin Gradle 플러그인에 다음 변경 사항을 가져옵니다:

*   Kotlin 컴파일러 실행 전략 정의를 위한 새로운 [프로퍼티 `kotlin.compiler.execution.strategy` 및 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
*   [kapt 및 코루틴 빌드 옵션의 사용 중단](#deprecation-of-build-options-for-kapt-and-coroutines)
*   [`kotlin.parallel.tasks.in.project` 빌드 옵션 제거](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### Kotlin 컴파일러 실행 전략 정의를 위한 프로퍼티

Kotlin 1.6.20 이전에는 `-Dkotlin.compiler.execution.strategy` 시스템 프로퍼티를 사용하여 Kotlin 컴파일러 실행 전략을 정의했습니다.
이 프로퍼티는 어떤 경우에는 불편할 수 있었습니다.
Kotlin 1.6.20은 동일한 이름의 Gradle 프로퍼티 `kotlin.compiler.execution.strategy`와 컴파일 태스크 프로퍼티 `compilerExecutionStrategy`를 도입합니다.

시스템 프로퍼티는 여전히 작동하지만, 향후 릴리스에서 제거될 예정입니다.

현재 프로퍼티의 우선순위는 다음과 같습니다:

*   태스크 프로퍼티 `compilerExecutionStrategy`가 시스템 프로퍼티 및 Gradle 프로퍼티 `kotlin.compiler.execution.strategy`보다 우선합니다.
*   Gradle 프로퍼티가 시스템 프로퍼티보다 우선합니다.

이러한 프로퍼티에 할당할 수 있는 세 가지 컴파일러 실행 전략이 있습니다:

| 전략             | Kotlin 컴파일러가 실행되는 위치       | 증분 컴파일 | 기타 특성                                                |
|------------------|---------------------------------------|-------------|----------------------------------------------------------|
| Daemon           | 자체 데몬 프로세스 내부             | 예          | *기본 전략*. 다른 Gradle 데몬 간에 공유될 수 있음 |
| In process       | Gradle 데몬 프로세스 내부           | 아니요      | Gradle 데몬과 힙을 공유할 수 있음                    |
| Out of process   | 각 호출에 대해 별도의 프로세스       | 아니요      | —                                                        |

따라서 `kotlin.compiler.execution.strategy` 프로퍼티(시스템 및 Gradle 모두)에 사용 가능한 값은 다음과 같습니다:
1. `daemon` (기본값)
2. `in-process`
3. `out-of-process`

`gradle.properties`에서 Gradle 프로퍼티 `kotlin.compiler.execution.strategy`를 사용하십시오:

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 태스크 프로퍼티에 사용 가능한 값은 다음과 같습니다:

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (기본값)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

`build.gradle.kts` 빌드 스크립트에서 `compilerExecutionStrategy` 태스크 프로퍼티를 사용하십시오:

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

[이 YouTrack 태스크](https://youtrack.jetbrains.com/issue/KT-49299)에 피드백을 남겨주십시오.

### kapt 및 코루틴 빌드 옵션의 사용 중단

Kotlin 1.6.20에서는 프로퍼티의 사용 중단 수준을 변경했습니다:

*   `kapt.use.worker.api`를 통해 Kotlin 데몬을 통해 [kapt](kapt.md)를 실행하는 기능을 사용 중단했습니다. 이제 Gradle 출력에 경고가 표시됩니다.
    기본적으로, [kapt는 1.3.70 릴리스부터 Gradle 워커를 사용](kapt.md#run-kapt-tasks-in-parallel)해 왔으며, 이 방식을 고수하는 것을 권장합니다.

    향후 릴리스에서는 `kapt.use.worker.api` 옵션을 제거할 예정입니다.

*   `kotlin.experimental.coroutines` Gradle DSL 옵션과 `gradle.properties`에서 사용되는 `kotlin.coroutines` 프로퍼티를 사용 중단했습니다.
    단순히 _suspend 함수_를 사용하거나 `build.gradle(.kts)` 파일에 [`kotlinx.coroutines` 종속성](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)을 추가하십시오.
  
    코루틴에 대한 자세한 내용은 [코루틴 가이드](coroutines-guide.md)를 참조하십시오.

### kotlin.parallel.tasks.in.project 빌드 옵션 제거

Kotlin 1.5.20에서 우리는 [빌드 옵션 `kotlin.parallel.tasks.in.project`의 사용 중단](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)을 발표했습니다.
이 옵션은 Kotlin 1.6.20에서 제거되었습니다.

프로젝트에 따라 Kotlin 데몬의 병렬 컴파일은 더 많은 메모리를 요구할 수 있습니다.
메모리 소비를 줄이려면 [Kotlin 데몬의 힙 크기를 늘리십시오](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments).

Kotlin Gradle 플러그인에서 [현재 지원되는 컴파일러 옵션](gradle-compiler-options.md)에 대해 자세히 알아보십시오.