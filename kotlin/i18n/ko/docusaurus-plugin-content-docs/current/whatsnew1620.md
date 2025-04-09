---
title: "Kotlin 1.6.20의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[출시일: 2022년 4월 4일](releases#release-details)_

Kotlin 1.6.20에서는 미래 언어 기능의 미리 보기를 공개하고, 멀티플랫폼 프로젝트의 기본 계층 구조를 만들고, 다른 구성 요소에 대한 진화적 개선을 제공합니다.

다음 비디오에서 변경 사항에 대한 간단한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 언어

Kotlin 1.6.20에서는 두 가지 새로운 언어 기능을 사용해 볼 수 있습니다.

* [Kotlin/JVM용 컨텍스트 수신기 프로토타입](#prototype-of-context-receivers-for-kotlin-jvm)
* [Definitely non-nullable types](#definitely-non-nullable-types)

### Kotlin/JVM용 컨텍스트 수신기 프로토타입

:::note
이 기능은 Kotlin/JVM에서만 사용할 수 있는 프로토타입입니다. `-Xcontext-receivers`가 활성화되면 컴파일러는 프로덕션 코드에서 사용할 수 없는 시험판 바이너리를 생성합니다.
컨텍스트 수신기는 토이 프로젝트에서만 사용하십시오.
[YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 의견을 보내주시면 감사하겠습니다.

Kotlin 1.6.20에서는 더 이상 수신기를 하나만 가질 수 있는 것에 국한되지 않습니다. 더 필요한 경우 컨텍스트 수신기를 선언에 추가하여 함수, 속성 및 클래스를 컨텍스트 종속(또는 _문맥_)으로 만들 수 있습니다. 문맥 선언은 다음을 수행합니다.

* 선언된 모든 컨텍스트 수신기가 호출자의 범위에 암시적 수신기로 존재해야 합니다.
* 선언된 컨텍스트 수신기를 암시적 수신기로 본문 범위에 가져옵니다.

```kotlin
interface LoggingContext {
    val log: Logger // This context provides a reference to a logger 
}

context(LoggingContext)
fun startBusinessOperation() {
    // You can access the log property since LoggingContext is an implicit receiver
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // You need to have LoggingContext in a scope as an implicit receiver
        // to call startBusinessOperation()
        startBusinessOperation()
    }
}
```

프로젝트에서 컨텍스트 수신기를 활성화하려면 `-Xcontext-receivers` 컴파일러 옵션을 사용합니다.
이 기능 및 해당 구문에 대한 자세한 설명은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers#detailed-design)에서 확인할 수 있습니다.

구현은 프로토타입입니다.

* `-Xcontext-receivers`가 활성화되면 컴파일러는 프로덕션 코드에서 사용할 수 없는 시험판 바이너리를 생성합니다.
* 컨텍스트 수신기에 대한 IDE 지원은 현재 최소 수준입니다.

토이 프로젝트에서 이 기능을 사용해 보고 [이 YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-42435)에서 여러분의 생각과 경험을 공유해 주세요.
문제가 발생하면 [새 문제 파일](https://kotl.in/issue)을 만드십시오.

### Definitely non-nullable types

Definitely non-nullable types는 [베타](components-stability)에 있습니다. 거의 안정적이지만
향후 마이그레이션 단계가 필요할 수 있습니다.
변경해야 하는 사항을 최소화하도록 최선을 다하겠습니다.

일반 Java 클래스 및 인터페이스를 확장할 때 더 나은 상호 운용성을 제공하기 위해 Kotlin 1.6.20에서는 새 구문 `T & Any`를 사용하여 사용 사이트에서 일반 형식 매개변수를 definitely non-nullable로 표시할 수 있습니다.
구문 형식은 [intersection types](https://en.wikipedia.org/wiki/Intersection_type)의 표기법에서 가져온 것이며 이제 `&`의 왼쪽에 nullable upper bounds가 있는 형식 매개변수와 오른쪽에 non-nullable `Any`로 제한됩니다.

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

이 기능을 활성화하려면 언어 버전을 `1.7`로 설정합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</TabItem>
</Tabs>

[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types)에서 definitely non-nullable types에 대해 자세히 알아보세요.

## Kotlin/JVM

Kotlin 1.6.20에서는 다음을 소개합니다.

* JVM 인터페이스에서 기본 메서드의 호환성 개선: [인터페이스에 대한 새로운 `@JvmDefaultWithCompatibility` 어노테이션](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 및 [`-Xjvm-default` 모드의 호환성 변경](#compatibility-changes-in-the-xjvm-default-modes)
* [JVM 백엔드에서 단일 모듈의 병렬 컴파일 지원](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [함수형 인터페이스 생성자에 대한 호출 가능 참조 지원](#support-for-callable-references-to-functional-interface-constructors)

### 인터페이스에 대한 새로운 @JvmDefaultWithCompatibility 어노테이션

Kotlin 1.6.20에서는 새로운 어노테이션 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)를 소개합니다. `-Xjvm-default=all` 컴파일러 옵션과 함께 사용하여 모든 Kotlin 인터페이스의 모든 비추상 멤버에 대해 [JVM 인터페이스에서 기본 메서드를 생성](java-to-kotlin-interop#default-methods-in-interfaces)합니다.

`-Xjvm-default=all` 옵션 없이 컴파일된 Kotlin 인터페이스를 사용하는 클라이언트가 있는 경우 이 옵션으로 컴파일된 코드와 이진 호환되지 않을 수 있습니다.
Kotlin 1.6.20 이전에는 이 호환성 문제를 방지하기 위해 [`JvmDefaultWithoutCompatibility`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)는 `-Xjvm-default=all-compatibility` 모드와 이러한 유형의 호환성이 필요하지 않은 인터페이스에 대한 `@JvmDefaultWithoutCompatibility` 어노테이션을 사용하는 것이 좋습니다.

이 접근 방식에는 몇 가지 단점이 있었습니다.

* 새 인터페이스가 추가될 때 어노테이션을 추가하는 것을 잊기 쉬웠습니다.
* 일반적으로 공용 API보다 공용이 아닌 부분에 더 많은 인터페이스가 있으므로 코드의 여러 위치에서 이 어노테이션을 사용하게 됩니다.

이제 `-Xjvm-default=all` 모드를 사용하고 `@JvmDefaultWithCompatibility` 어노테이션으로 인터페이스를 표시할 수 있습니다.
이를 통해 공용 API의 모든 인터페이스에 이 어노테이션을 한 번 추가할 수 있으며 새 공용이 아닌 코드에 어노테이션을 사용할 필요가 없습니다.

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-48217)에서 이 새 어노테이션에 대한 피드백을 남겨주세요.

### -Xjvm-default 모드의 호환성 변경

Kotlin 1.6.20에서는 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 모드로 컴파일된 모듈에 대해 기본 모드( `-Xjvm-default=disable` 컴파일러 옵션)에서 모듈을 컴파일하는 옵션을 추가합니다.
이전과 마찬가지로 모든 모듈에 `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 모드가 있는 경우에도 컴파일이 성공합니다.
이 [YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-47000)에 피드백을 남길 수 있습니다.

Kotlin 1.6.20에서는 컴파일러 옵션 `-Xjvm-default`의 `compatibility` 및 `enable` 모드를 더 이상 사용하지 않습니다.
호환성과 관련하여 다른 모드 설명에 변경 사항이 있지만 전체 논리는 동일하게 유지됩니다.
[업데이트된 설명](java-to-kotlin-interop#compatibility-modes-for-default-methods)을 확인할 수 있습니다.

Java interop의 기본 메서드에 대한 자세한 내용은 [상호 운용성 문서](java-to-kotlin-interop#default-methods-in-interfaces) 및
[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 참조하십시오.

### JVM 백엔드에서 단일 모듈의 병렬 컴파일 지원

JVM 백엔드에서 단일 모듈의 병렬 컴파일 지원은 [Experimental](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-46085)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

[새 JVM IR 백엔드 컴파일 시간](https://youtrack.jetbrains.com/issue/KT-46768)을 개선하기 위한 작업을 계속하고 있습니다.
Kotlin 1.6.20에서는 모듈의 모든 파일을 병렬로 컴파일하는 실험적 JVM IR 백엔드 모드를 추가했습니다.
병렬 컴파일은 총 컴파일 시간을 최대 15%까지 줄일 수 있습니다.

[컴파일러 옵션](compiler-reference#compiler-options) `-Xbackend-threads`로 실험적 병렬 백엔드 모드를 활성화합니다.
이 옵션에 대해 다음 인수를 사용합니다.

* `N`은 사용하려는 스레드 수입니다. CPU 코어 수보다 크지 않아야 합니다. 그렇지 않으면 스레드 간의 컨텍스트 전환으로 인해 병렬화가 효과적이지 않습니다.
* 각 CPU 코어에 대해 별도의 스레드를 사용하려면 `0`을 사용합니다.

[Gradle](gradle)은 작업을 병렬로 실행할 수 있지만 프로젝트(또는 프로젝트의 주요 부분)가 Gradle 관점에서 하나의 큰 작업일 뿐인 경우 이러한 유형의 병렬화는 크게 도움이 되지 않습니다.
매우 큰 모놀리식 모듈이 있는 경우 병렬 컴파일을 사용하여 더 빠르게 컴파일합니다.
프로젝트가 작은 모듈로 구성되어 있고 Gradle에서 빌드가 병렬화된 경우 컨텍스트 전환으로 인해 또 다른 계층의 병렬화를 추가하면 성능이 저하될 수 있습니다.

병렬 컴파일에는 몇 가지 제약 조건이 있습니다.
* [kapt](kapt)가 IR 백엔드를 비활성화하므로 작동하지 않습니다.
* 설계상 더 많은 JVM 힙이 필요합니다. 힙의 양은 스레드 수에 비례합니다.

:::

### 함수형 인터페이스 생성자에 대한 호출 가능 참조 지원

:::note
함수형 인터페이스 생성자에 대한 호출 가능 참조 지원은 [Experimental](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-47939)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

[호출 가능 참조](reflection#callable-references)에 대한 지원을 함수형 인터페이스 생성자에 추가하면 생성자 함수가 있는 인터페이스에서 [함수형 인터페이스](fun-interfaces)로 마이그레이션하는 소스 호환 가능한 방법이 추가됩니다.

다음 코드를 고려해 보세요.

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

함수형 인터페이스 생성자에 대한 호출 가능 참조가 활성화되면 이 코드를 함수형 인터페이스 선언으로 대체할 수 있습니다.

```kotlin
fun interface Printer {
    fun print()
}
```

생성자는 암시적으로 생성되며 `::Printer` 함수 참조를 사용하는 모든 코드가 컴파일됩니다. 예:

```kotlin
documentsStorage.addPrinter(::Printer)
```

레거시 함수 `Printer`를 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 어노테이션으로 `DeprecationLevel.HIDDEN`으로 표시하여 이진 호환성을 유지합니다.

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

이 기능을 활성화하려면 컴파일러 옵션 `-XXLanguage:+KotlinFunInterfaceConstructorReference`를 사용합니다.

## Kotlin/Native

Kotlin/Native 1.6.20은 새로운 구성 요소의 지속적인 개발을 나타냅니다. 다른 플랫폼에서 Kotlin과 일관된 경험을 제공하기 위해 또 다른 단계를 밟았습니다.

* [새로운 메모리 관리자에 대한 업데이트](#an-update-on-the-new-memory-manager)
* [새로운 메모리 관리자에서 스윕 단계를 위한 동시 구현](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [어노테이션 클래스의 인스턴스화](#instantiation-of-annotation-classes)
* [Swift async/await와의 Interop: KotlinUnit 대신 Swift의 Void 반환](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [libbacktrace를 사용하여 더 나은 스택 추적](#better-stack-traces-with-libbacktrace)
* [독립 실행형 Android 실행 파일 지원](#support-for-standalone-android-executables)
* [성능 개선](#performance-improvements)
* [cinterop 모듈 가져오기 중 향상된 오류 처리](#improved-error-handling-during-cinterop-modules-import)
* [Xcode 13 라이브러리 지원](#support-for-xcode-13-libraries)

### 새로운 메모리 관리자에 대한 업데이트

새로운 Kotlin/Native 메모리 관리자는 [알파](components-stability)에 있습니다.
호환되지 않게 변경될 수 있으며 향후 수동 마이그레이션이 필요할 수 있습니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

:::

Kotlin 1.6.20에서는 새로운 Kotlin/Native 메모리 관리자의 알파 버전을 사용해 볼 수 있습니다.
JVM과 Native 플랫폼 간의 차이점을 없애 멀티플랫폼 프로젝트에서 일관된 개발자 경험을 제공합니다.
예를 들어 Android와 iOS 모두에서 작동하는 새로운 크로스 플랫폼 모바일 애플리케이션을 훨씬 쉽게 만들 수 있습니다.

새로운 Kotlin/Native 메모리 관리자는 스레드 간의 객체 공유에 대한 제한을 해제합니다.
또한 안전하고 특별한 관리나 어노테이션이 필요 없는 누출 없는 동시 프로그래밍 기본 요소를 제공합니다.

새로운 메모리 관리자는 향후 버전에서 기본값이 되므로 지금 사용해 보시기 바랍니다.
새로운 메모리 관리자에 대해 자세히 알아보고 데모 프로젝트를 살펴보려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)을 확인하거나 [마이그레이션 지침](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM)으로 바로 이동하여 직접 사용해 보십시오.

새로운 메모리 관리자를 프로젝트에서 사용하여 작동 방식을 확인하고 문제 추적기인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에서 피드백을 공유하십시오.

### 새로운 메모리 관리자에서 스윕 단계를 위한 동시 구현

[Kotlin 1.6에서 발표된](whatsnew16#preview-of-the-new-memory-manager) 새로운 메모리 관리자로 이미 전환한 경우 실행 시간 개선이 매우 클 수 있습니다. 당사 벤치마크는 평균 35% 개선된 것으로 나타났습니다.
1.6.20부터는 새로운 메모리 관리자를 위한 스윕 단계를 위한 동시 구현도 사용할 수 있습니다.
이렇게 하면 성능이 향상되고 가비지 수집기 일시 중지 시간이 줄어듭니다.

새로운 Kotlin/Native 메모리 관리자에 대해 이 기능을 활성화하려면 다음 컴파일러 옵션을 전달합니다.

```bash
-Xgc=cms 
```

[이 YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-48526)에서 새로운 메모리 관리자 성능에 대한 피드백을 자유롭게 공유하십시오.

### 어노테이션 클래스의 인스턴스화

Kotlin 1.6.0에서는 어노테이션 클래스의 인스턴스화가 Kotlin/JVM 및 Kotlin/JS에서 [안정화](components-stability)되었습니다.
1.6.20 버전은 Kotlin/Native에 대한 지원을 제공합니다.

[어노테이션 클래스의 인스턴스화](annotations#instantiation)에 대해 자세히 알아보세요.

### Swift async/await와의 Interop: KotlinUnit 대신 Swift의 Void 반환

:::note
Swift async/await와의 동시성 상호 운용성은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

[Swift의 async/await와의 실험적 interop](whatsnew1530#experimental-interoperability-with-swift-5-5-async-await)에 대한 작업을 계속했습니다(Swift 5.5 이후 사용 가능).
Kotlin 1.6.20은 `Unit` 반환 형식이 있는 `suspend` 함수와 작동하는 방식이 이전 버전과 다릅니다.

이전에는 이러한 함수가 Swift에서 `KotlinUnit`을 반환하는 `async` 함수로 표시되었습니다. 그러나 이에 대한 적절한 반환 형식은 일시 중단되지 않는 함수와 마찬가지로 `Void`입니다.

기존 코드를 손상시키지 않기 위해 컴파일러가 `Unit`을 반환하는 일시 중단 함수를 `Void` 반환 형식이 있는 `async` Swift로 변환하도록 하는 Gradle 속성을 도입합니다.

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

향후 Kotlin 릴리스에서는 이 동작을 기본값으로 만들 계획입니다.

### libbacktrace를 사용하여 더 나은 스택 추적

소스 위치를 확인하기 위해 libbacktrace를 사용하는 것은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

Kotlin/Native는 이제 파일 위치와 줄 번호가 있는 자세한 스택 추적을 생성할 수 있습니다.
`linux*`( `linuxMips32` 및 `linuxMipsel32` 제외) 및 `androidNative*` 대상의 더 나은 디버깅을 위해.

이 기능은 내부적으로 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 라이브러리를 사용합니다.
다음 코드를 보고 차이점의 예를 확인하십시오.

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

* **1.6.20 이전:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```

* **libbacktrace를 사용한 1.6.20:**

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

이미 스택 추적에 파일 위치와 줄 번호가 있는 Apple 대상에서 libbacktrace는 인라인 함수 호출에 대한 자세한 정보를 제공합니다.

* **1.6.20 이전:**

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

* **libbacktrace를 사용한 1.6.20:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)  
:::caution
at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```

libbacktrace를 사용하여 더 나은 스택 추적을 생성하려면 다음 줄을 `gradle.properties`에 추가합니다.

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

[이 YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-48424)에서 libbacktrace를 사용한 Kotlin/Native 디버깅이 어떻게 작동하는지 알려주십시오.

### 독립 실행형 Android 실행 파일 지원

이전에는 Kotlin/Native의 Android Native 실행 파일이 실제로 실행 파일이 아니라 NativeActivity로 사용할 수 있는 공유 라이브러리였습니다. 이제 Android Native 대상에 대한 표준 실행 파일을 생성하는 옵션이 있습니다.

이를 위해 프로젝트의 `build.gradle(.kts)` 부분에서 `androidNative` 대상의 실행 파일 블록을 구성합니다.
다음 이진 옵션을 추가합니다.

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

이 기능은 Kotlin 1.7.0에서 기본값이 됩니다.
현재 동작을 유지하려면 다음 설정을 사용하십시오.

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

[구현](https://github.com/jetbrains/kotlin/pull/4624)해 주신 Mattia Iavarone님께 감사드립니다!

### 성능 개선

[컴파일 프로세스 속도를 높이고](https://youtrack.jetbrains.com/issue/KT-42294) 개발 경험을 개선하기 위해 Kotlin/Native에 대한 노력을 아끼지 않고 있습니다.

Kotlin 1.6.20은 Kotlin이 생성하는 LLVM IR에 영향을 미치는 몇 가지 성능 업데이트 및 버그 수정 사항을 제공합니다.
내부 프로젝트에 대한 벤치마크에 따르면 평균적으로 다음과 같은 성능 향상을 달성했습니다.

* 실행 시간 15% 감소
* 릴리스 및 디버그 바이너리의 코드 크기 20% 감소
* 릴리스 바이너리의 컴파일 시간 26% 감소

또한 이러한 변경 사항은 대규모 내부 프로젝트에서 디버그 바이너리의 컴파일 시간을 10% 단축합니다.

이를 위해 컴파일러에서 생성된 일부 합성 객체에 대한 정적 초기화를 구현하고 모든 함수에 대한 LLVM IR을 구성하는 방식을 개선하고 컴파일러 캐시를 최적화했습니다.

### cinterop 모듈 가져오기 중 향상된 오류 처리

이 릴리스에서는 `cinterop` 도구를 사용하여 Objective-C 모듈을 가져오는 경우(일반적으로 CocoaPods 포드의 경우)에 대한 향상된 오류 처리를 도입했습니다.
이전에는 Objective-C 모듈 작업을 시도하는 동안 오류가 발생한 경우(예: 헤더의 컴파일 오류 처리) `fatal error: could not build module $name`과 같은 정보가 없는 오류 메시지가 표시되었습니다.
이 `cinterop` 도구의 이 부분을 확장하여 확장된 설명과 함께 오류 메시지가 표시됩니다.

### Xcode 13 라이브러리 지원

Xcode 13과 함께 제공되는 라이브러리는 이 릴리스부터 완전히 지원됩니다.
Kotlin 코드의 어디에서나 자유롭게 액세스할 수 있습니다.

## Kotlin 멀티플랫폼

1.6.20에서는 Kotlin 멀티플랫폼에 다음과 같은 주목할 만한 업데이트가 제공됩니다.

* [이제 모든 새로운 멀티플랫폼 프로젝트에서 계층 구조 지원이 기본값입니다.](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle 플러그인이 CocoaPods 통합을 위한 몇 가지 유용한 기능을 받았습니다.](#kotlin-cocoapods-gradle-plugin)

### 멀티플랫폼 프로젝트에 대한 계층 구조 지원

Kotlin 1.6.20은 기본적으로 계층 구조 지원이 활성화된 상태로 제공됩니다.
[Kotlin 1.4.0에서 도입한 이후](whatsnew14#sharing-code-in-several-targets-with-the-hierarchical-project-structure) 프런트엔드를 크게 개선하고 IDE 가져오기를 안정화했습니다.

이전에는 멀티플랫폼 프로젝트에 코드를 추가하는 방법이 두 가지 있었습니다. 첫 번째는 플랫폼별 소스 세트에 삽입하는 것이었고, 이는 하나의 대상으로 제한되고 다른 플랫폼에서 재사용할 수 없습니다.
두 번째는 현재 Kotlin에서 지원하는 모든 플랫폼에서 공유되는 공통 소스 세트를 사용하는 것입니다.

이제 공통 논리 및 타사 API를 많이 재사용하는 여러 유사한 네이티브 대상 간에 [소스 코드](#better-code-sharing-in-your-project)를 공유할 수 있습니다.
이 기술은 올바른 기본 종속성을 제공하고 공유 코드에서 사용할 수 있는 정확한 API를 찾습니다.
이렇게 하면 복잡한 빌드 설정이 필요 없고 네이티브 대상 간에 소스 세트를 공유하기 위해 해결 방법을 사용할 필요가 없습니다.
또한 다른 대상을 위한 안전하지 않은 API 사용을 방지하는 데 도움이 됩니다.

이 기술은 [라이브러리 작성자](#more-opportunities-for-library-authors)에게도 유용합니다. 계층 구조 프로젝트 구조를 통해 대상 하위 집합에 대한 공통 API를 사용하여 라이브러리를 게시하고 사용할 수 있기 때문입니다.

기본적으로 계층 구조 프로젝트 구조로 게시된 라이브러리는 계층 구조 프로젝트 구조와만 호환됩니다.

#### 프로젝트에서 더 나은 코드 공유

계층 구조 지원이 없으면 _일부_ [Kotlin 대상](multiplatform-dsl-reference#targets)에서는 코드를 공유할 수 있지만 _전체_ 에서는 코드를 공유할 수 있는 간단한 방법이 없습니다.
가장 일반적인 예 중 하나는 모든 iOS 대상에서 코드를 공유하고 Foundation과 같은 iOS 특정 [종속성](multiplatform-share-on-