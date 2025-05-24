---
title: "Kotlin 2.0.0의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[배포일: 2024년 5월 21일](releases#release-details)_

Kotlin 2.0.0이 출시되었으며 [새로운 Kotlin K2 컴파일러](#kotlin-k2-compiler)가 안정화되었습니다! 추가적으로 다음과 같은 주요 사항이 있습니다.

* [새로운 Compose 컴파일러 Gradle 플러그인](#new-compose-compiler-gradle-plugin)
* [`invokedynamic`을 사용한 람다 함수 생성](#generation-of-lambda-functions-using-invokedynamic)
* [`kotlinx-metadata-jvm` 라이브러리 안정화](#the-kotlinx-metadata-jvm-library-is-stable)
* [Apple 플랫폼에서 Signpost를 사용한 Kotlin/Native의 GC 성능 모니터링](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [Objective-C 메서드를 사용한 Kotlin/Native의 충돌 해결](#resolving-conflicts-with-objective-c-methods)
* [Kotlin/Wasm에서 명명된 내보내기 지원](#support-for-named-export)
* [Kotlin/Wasm의 `@JsExport`를 사용하는 함수에서 부호 없는 기본 타입 지원](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [Binaryen을 사용하여 기본적으로 프로덕션 빌드 최적화](#optimized-production-builds-by-default-using-binaryen)
* [멀티플랫폼 프로젝트의 컴파일러 옵션을 위한 새로운 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [enum class values 제네릭 함수에 대한 안정적인 대체](#stable-replacement-of-the-enum-class-values-generic-function)
* [안정적인 AutoCloseable 인터페이스](#stable-autocloseable-interface)

Kotlin 2.0은 JetBrains 팀에게 매우 중요한 이정표입니다. 이번 릴리스는 KotlinConf 2024의 중심 주제였습니다. Kotlin 언어에 대한 최신 업데이트와 최근 작업을 다룬 오프닝
기조 연설을 확인해 보세요.

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 지원

Kotlin 2.0.0을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 Kotlin 2.0.0으로 [변경](releases#update-to-a-new-kotlin-version)하기만 하면 됩니다.

* Kotlin K2 컴파일러에 대한 IntelliJ IDEA 지원에 대한 자세한 내용은 [IDE 지원](#support-in-ides)을 참조하세요.
* Kotlin에 대한 IntelliJ IDEA 지원에 대한 자세한 내용은 [Kotlin 릴리스](releases#ide-support)를 참조하세요.

## Kotlin K2 컴파일러

K2 컴파일러로 가는 길은 멀었지만, 이제 JetBrains 팀은 마침내 안정화를 발표할 준비가 되었습니다.
Kotlin 2.0.0에서는 새로운 Kotlin K2 컴파일러가 기본적으로 사용되며 모든 대상 플랫폼(JVM, Native, Wasm 및 JS)에 대해 [안정적](components-stability)입니다. 새 컴파일러는 주요 성능 향상을 제공하고, 새로운 언어 기능 개발 속도를 높이며, Kotlin이 지원하는 모든 플랫폼을 통합하고, 멀티플랫폼 프로젝트를 위한 더 나은 아키텍처를 제공합니다.

JetBrains 팀은 사용자 및 내부 프로젝트에서 1천만 줄의 코드를 성공적으로 컴파일하여 새 컴파일러의 품질을 보장했습니다. 18,000명의 개발자가 안정화 프로세스에 참여하여 총 80,000개의 프로젝트에서 새로운 K2 컴파일러를 테스트하고 발견한 문제를 보고했습니다.

새 컴파일러로의 마이그레이션 프로세스를 최대한 원활하게 만들기 위해 [K2 컴파일러 마이그레이션 가이드](k2-compiler-migration-guide)를 만들었습니다.
이 가이드는 컴파일러의 많은 이점을 설명하고, 발생할 수 있는 변경 사항을 강조하며, 필요한 경우 이전 버전으로 롤백하는 방법을 설명합니다.

[블로그 게시물](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)에서는
다양한 프로젝트에서 K2 컴파일러의 성능을 살펴보았습니다. K2 컴파일러의 실제 성능에 대한 데이터를 보고 싶거나 자신의 프로젝트에서 성능 벤치마크를 수집하는 방법에 대한 지침을 보고 싶다면 확인해 보세요.

KotlinConf 2024의 이 강연에서도 Michail Zarečenskij 수석 언어 설계자가 Kotlin의 기능 진화와 K2 컴파일러에 대해 논의하는 것을 시청할 수 있습니다.

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 현재 K2 컴파일러 제한 사항

Gradle 프로젝트에서 K2를 활성화하면 Gradle 8.3 미만의 버전을 사용하는 프로젝트에 다음과 같은 경우에 영향을 줄 수 있는 특정 제한 사항이 있습니다.

* `buildSrc`의 소스 코드 컴파일.
* 포함된 빌드의 Gradle 플러그인 컴파일.
* Gradle 8.3 미만의 버전으로 프로젝트에서 사용되는 경우 다른 Gradle 플러그인 컴파일.
* Gradle 플러그인 종속성 빌드.

위에 언급된 문제가 발생하는 경우 다음 단계를 수행하여 해결할 수 있습니다.

* `buildSrc`, Gradle 플러그인 및 해당 종속성에 대한 언어 버전을 설정합니다.

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 특정 작업에 대한 언어 및 API 버전을 구성하는 경우 이러한 값이 `compilerOptions` 확장으로 설정된 값을 재정의합니다. 이 경우 언어 및 API 버전은 1.9보다 높아서는 안 됩니다.
  >
  

* 프로젝트의 Gradle 버전을 8.3 이상으로 업데이트합니다.

### 스마트 캐스트 개선 사항

Kotlin 컴파일러는 특정 경우에 자동으로 객체를 타입으로 캐스팅하여 명시적으로 캐스팅해야 하는 번거로움을 덜어줍니다. 이를 [스마트 캐스팅](typecasts#smart-casts)이라고 합니다.
Kotlin K2 컴파일러는 이제 이전보다 훨씬 더 많은 시나리오에서 스마트 캐스트를 수행합니다.

Kotlin 2.0.0에서는 다음 영역에서 스마트 캐스트와 관련된 개선 사항이 있었습니다.

* [지역 변수 및 추가 범위](#local-variables-and-further-scopes)
* [논리 `or` 연산자를 사용한 타입 검사](#type-checks-with-logical-or-operator)
* [인라인 함수](#inline-functions)
* [함수 타입이 있는 속성](#properties-with-function-types)
* [예외 처리](#exception-handling)
* [증가 및 감소 연산자](#increment-and-decrement-operators)

#### 지역 변수 및 추가 범위

이전에는 변수가 `if` 조건 내에서 `null`이 아닌 것으로 평가된 경우 변수가 스마트 캐스트되었습니다.
이 변수에 대한 정보는 `if` 블록 범위 내에서 추가로 공유됩니다.

그러나 변수를 `if` 조건 **외부**에 선언한 경우 변수에 대한 정보는 `if` 조건 내에서 사용할 수 없으므로 스마트 캐스트할 수 없습니다. 이 동작은 `when` 식과 `while` 루프에서도 나타났습니다.

Kotlin 2.0.0부터는 `if`, `when` 또는 `while` 조건에서 변수를 사용하기 전에 선언하는 경우 컴파일러가 변수에 대해 수집한 정보는 해당 블록에서 스마트 캐스팅을 위해 액세스할 수 있습니다.

이는 부울 조건을 변수로 추출하는 것과 같은 작업을 수행하려는 경우에 유용할 수 있습니다. 그런 다음 변수에 의미 있는 이름을 지정하여 코드 가독성을 향상시키고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들면 다음과 같습니다.

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0.0에서 컴파일러는 isCat에 대한 정보에 액세스할 수 있으므로
        // animal이 Cat 타입으로 스마트 캐스트되었음을 알 수 있습니다.
        // 따라서 purr() 함수를 호출할 수 있습니다.
        // Kotlin 1.9.20에서 컴파일러는 스마트 캐스트에 대해 알지 못하므로
        // purr() 함수를 호출하면 오류가 발생합니다.
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 논리 or 연산자를 사용한 타입 검사

Kotlin 2.0.0에서는 객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면 스마트 캐스트가 가장 가까운 공통 슈퍼타입으로 수행됩니다. 이 변경 이전에는 스마트 캐스트가 항상 `Any` 타입으로 수행되었습니다.

이 경우에도 속성에 액세스하거나 함수를 호출하기 전에 객체 타입을 수동으로 확인해야 했습니다. 예를 들면 다음과 같습니다.

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus는 공통 슈퍼타입 Status로 스마트 캐스트됩니다.
        signalStatus.signal()
        // Kotlin 2.0.0 이전에는 signalStatus가 타입 Any로 스마트 캐스트되므로
        // signal() 함수를 호출하면
        // Unresolved reference 오류가 발생했습니다. signal() 함수는 다른 타입 검사 후에만
        // 성공적으로 호출할 수 있습니다.

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
공통 슈퍼타입은 유니온 타입의 **근사치**입니다. [유니온 타입](https://en.wikipedia.org/wiki/Union_type)은
Kotlin에서 지원되지 않습니다.

:::

#### 인라인 함수

Kotlin 2.0.0에서는 K2 컴파일러가 인라인 함수를 다르게 처리하여 다른 컴파일러 분석과 함께 스마트 캐스트가 안전한지 여부를 판단할 수 있습니다.

특히 인라인 함수는 이제 암시적 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
계약을 갖는 것으로 처리됩니다. 이는 인라인 함수에 전달된 람다 함수가 제자리에서 호출됨을 의미합니다. 람다 함수는 제자리에서 호출되므로 컴파일러는 람다 함수가 함수 본문에 포함된 변수에 대한 참조를 유출할 수 없음을 알고 있습니다.

컴파일러는 이 지식과 다른 컴파일러 분석을 사용하여 캡처된 변수를 스마트 캐스트하는 것이 안전한지 여부를 결정합니다. 예를 들면 다음과 같습니다.

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // Kotlin 2.0.0에서 컴파일러는 processor가
        // 지역 변수이고 inlineAction()이 인라인 함수이므로
        // processor에 대한 참조가 유출될 수 없음을 알고 있습니다. 따라서 스마트 캐스트하는 것이 안전합니다.

        // processor가 null이 아닌 경우 processor는 스마트 캐스트됩니다.
        if (processor != null) {
            // 컴파일러는 processor가 null이 아님을 알고 있으므로 안전한 호출이
            // 필요하지 않습니다.
            processor.process()

            // Kotlin 1.9.20에서는 안전한 호출을 수행해야 합니다.
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 함수 타입이 있는 속성

이전 버전의 Kotlin에서는 함수 타입이 있는 클래스 속성이 스마트 캐스트되지 않는 버그가 있었습니다.
Kotlin 2.0.0 및 K2 컴파일러에서 이 동작을 수정했습니다. 예를 들면 다음과 같습니다.

```kotlin
class Holder(val provider: (() `->` Unit)?) {
    fun process() {
        // Kotlin 2.0.0에서 provider가 null이 아니면
        // provider가 스마트 캐스트됩니다.
        if (provider != null) {
            // 컴파일러는 provider가 null이 아님을 알고 있습니다.
            provider()

            // 1.9.20에서 컴파일러는 provider가 null이 아님을 알지 못하므로
            // 오류를 발생시킵니다.
            // Reference has a nullable type '(() `->` Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

이 변경 사항은 `invoke` 연산자를 오버로드하는 경우에도 적용됩니다. 예를 들면 다음과 같습니다.

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () `->` String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 1.9.20에서 컴파일러는 오류를 발생시킵니다.
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 예외 처리

Kotlin 2.0.0에서는 예외 처리를 개선하여 스마트 캐스트 정보를 `catch` 및 `finally` 블록으로 전달할 수 있도록 했습니다. 이 변경 사항은 컴파일러가 객체에 nullable 타입이 있는지 추적하므로 코드를 더 안전하게 만듭니다. 예를 들면 다음과 같습니다.

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput은 String 타입으로 스마트 캐스트됩니다.
    stringInput = ""
    try {
        // 컴파일러는 stringInput이 null이 아님을 알고 있습니다.
        println(stringInput.length)
        // 0

        // 컴파일러는 stringInput에 대한 이전 스마트 캐스트 정보를 거부합니다.
        // 이제 stringInput은 String? 타입을 갖습니다.
        stringInput = null

        // 예외 발생
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0에서 컴파일러는 stringInput이
        // null이 될 수 있음을 알고 있으므로 stringInput은 nullable 상태를 유지합니다.
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20에서 컴파일러는 안전한 호출이
        // 필요하지 않다고 말하지만 이는 잘못되었습니다.
    }
}

fun main() {
    testString()
}
```

#### 증가 및 감소 연산자

Kotlin 2.0.0 이전에는 컴파일러가 증가 또는 감소 연산자를 사용한 후 객체 타입이 변경될 수 있음을 이해하지 못했습니다. 컴파일러가 객체 타입을 정확하게 추적할 수 없으므로 코드로 인해 확인되지 않은 참조 오류가 발생할 수 있습니다. Kotlin 2.0.0에서는 이 문제가 수정되었습니다.

```kotlin
interface Rho {
    operator fun inc(): Sigma = TODO()
}

interface Sigma : Rho {
    fun sigma() = Unit
}

interface Tau {
    fun tau() = Unit
}

fun main(input: Rho) {
    var unknownObject: Rho = input

    // unknownObject가 Tau 인터페이스에서 상속되는지 확인합니다.
    // unknownObject가 Rho 및 Tau 인터페이스 모두에서 상속될 수 있습니다.
    if (unknownObject is Tau) {

        // 인터페이스 Rho에서 오버로드된 inc() 연산자를 사용합니다.
        // Kotlin 2.0.0에서 unknownObject의 타입은 Sigma로 스마트 캐스트됩니다.
        ++unknownObject

        // Kotlin 2.0.0에서 컴파일러는 unknownObject의 타입이
        // Sigma임을 알고 있으므로 sigma() 함수를 성공적으로 호출할 수 있습니다.
        unknownObject.sigma()

        // Kotlin 1.9.20에서 컴파일러는 스마트 캐스트를 수행하지 않습니다.
        // inc()가 호출되면 컴파일러는 여전히
        // unknownObject의 타입이 Tau라고 생각합니다. sigma() 함수를 호출하면
        // 컴파일 시간 오류가 발생합니다.
        
        // Kotlin 2.0.0에서 컴파일러는 unknownObject의 타입이
        // Sigma임을 알고 있으므로 tau() 함수를 호출하면 컴파일 시간
        // 오류가 발생합니다.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // Kotlin 1.9.20에서는 컴파일러가 실수로
        // unknownObject의 타입이 Tau라고 생각하므로 tau() 함수를 호출할 수 있지만
        // ClassCastException이 발생합니다.
    }
}
```

### Kotlin 멀티플랫폼 개선 사항

Kotlin 2.0.0에서는 다음과 같은 영역에서 Kotlin 멀티플랫폼과 관련된 K2 컴파일러에 대한 개선 사항이 있었습니다.

* [컴파일 중 공통 및 플랫폼 소스 분리](#separation-of-common-and-platform-sources-during-compilation)
* [예상 및 실제 선언의 다른 가시성 수준](#different-visibility-levels-of-expected-and-actual-declarations)

#### 컴파일 중 공통 및 플랫폼 소스 분리

이전에는 Kotlin 컴파일러의 설계로 인해 컴파일 시 공통 및 플랫폼 소스 세트를 분리할 수 없었습니다.
결과적으로 공통 코드가 플랫폼 코드에 액세스할 수 있었고, 이로 인해 플랫폼 간에 동작이 달라졌습니다. 또한 공통 코드의 일부 컴파일러 설정 및 종속성이 플랫폼 코드로 유출되었습니다.

Kotlin 2.0.0에서는 새로운 Kotlin K2 컴파일러의 구현에 공통 및 플랫폼 소스 세트 간의 엄격한 분리를 보장하기 위해 컴파일 방식 재설계가 포함되었습니다. 이 변경 사항은 [예상 및 실제 함수](multiplatform-expect-actual#expected-and-actual-functions)를 사용하는 경우 가장 두드러집니다.
이전에는 공통 코드의 함수 호출이 플랫폼 코드의 함수로 확인될 수 있었습니다. 예를 들면 다음과 같습니다.
<table>
<tr>
<td>
공통 코드
</td>
<td>
플랫폼 코드
</td>
</tr>
<tr>
<td>

```kotlin
fun foo(x: Any) = println("common foo")

fun exampleFunction() {
    foo(42)
}
```
</td>
<td>

```kotlin
// JVM
fun foo(x: Int) = println("platform foo")

// JavaScript
// JavaScript 플랫폼에는 foo() 함수 오버로드가 없습니다.
// JavaScript 플랫폼에는 foo() 함수 오버로드가 없습니다.
```
</td>
</tr>
</table>

이 예에서 공통 코드는 실행되는 플랫폼에 따라 동작이 다릅니다.

* JVM 플랫폼에서는 공통 코드에서 `foo()` 함수를 호출하면 플랫폼 코드의 `foo()` 함수가 `platform foo`로 호출됩니다.
* JavaScript 플랫폼에서는 공통 코드에서 `foo()` 함수를 호출하면 플랫폼 코드에서 사용할 수 있는 함수가 없으므로 공통 코드의 `foo()` 함수가 `common foo`로 호출됩니다.

Kotlin 2.0.0에서는 공통 코드가 플랫폼 코드에 액세스할 수 없으므로 두 플랫폼 모두 `foo()` 함수를 공통 코드의 `foo()` 함수인 `common foo`로 성공적으로 확인합니다.

플랫폼 간의 동작 일관성이 향상된 것 외에도 IntelliJ IDEA 또는 Android Studio와 컴파일러 간에 충돌하는 동작이 있는 경우를 수정하기 위해 열심히 노력했습니다. 예를 들어 [예상 및 실제 클래스](multiplatform-expect-actual#expected-and-actual-classes)를 사용하는 경우 다음과 같은 일이 발생합니다.
<table>
<tr>
<td>
공통 코드
</td>
<td>
플랫폼 코드
</td>
</tr>
<tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0 이전에는
    // IDE 전용 오류를 발생시킵니다.
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : 예상 클래스
    // Identity에는 기본 생성자가 없습니다.
}
```
</td>
<td>

```kotlin
actual class Identity {
    actual fun confirmIdentity() = "expect class fun: jvm"
}
```
</td>
</tr>
</table>

이 예에서 예상 클래스 `Identity`에는 기본 생성자가 없으므로 공통 코드에서 성공적으로 호출할 수 없습니다.
이전에는 오류가 IDE에서만 보고되었지만 코드는 여전히 JVM에서 성공적으로 컴파일되었습니다. 그러나 이제
컴파일러는 다음과 같이 올바르게 오류를 보고합니다.

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 확인 동작이 변경되지 않는 경우

새로운 컴파일 방식으로 마이그레이션하는 과정에 있으므로 동일한 소스 세트 내에 있지 않은 함수를 호출할 때는 확인 동작이 여전히 동일합니다. 이 차이점은 주로 공통 코드에서 멀티플랫폼 라이브러리의 오버로드를 사용하는 경우에 알 수 있습니다.

서로 다른 서명을 가진 두 개의 `whichFun()` 함수가 있는 라이브러리가 있다고 가정해 보겠습니다.

```kotlin
// 예제 라이브러리

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

공통 코드에서 `whichFun()` 함수를 호출하면 라이브러리에서 가장 관련성이 높은 인수 타입의 함수가 확인됩니다.

```kotlin
// JVM 타겟에 대한 예제 라이브러리를 사용하는 프로젝트

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

비교하자면, 동일한 소스 세트 내에서 `whichFun()`에 대한 오버로드를 선언하는 경우 코드가 플랫폼 특정 버전에 액세스할 수 없으므로 공통 코드의 함수가 확인됩니다.

```kotlin
// 예제 라이브러리가 사용되지 않음

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

멀티플랫폼 라이브러리와 마찬가지로 `commonTest` 모듈은 별도의 소스 세트에 있으므로 플랫폼 특정 코드에 계속 액세스할 수 있습니다. 따라서 `commonTest` 모듈의 함수 호출 확인은 이전 컴파일 방식과 동일한 동작을 나타냅니다.

향후 이러한 나머지 경우는 새로운 컴파일 방식과 더 일관될 것입니다.

#### 예상 및 실제 선언의 다른 가시성 수준

Kotlin 2.0.0 이전에는 Kotlin 멀티플랫폼 프로젝트에서 [예상 및 실제 선언](multiplatform-expect-actual)을 사용하는 경우 동일한 [가시성 수준](visibility-modifiers)을 가져야 했습니다.
Kotlin 2.0.0은 이제 **실제** 선언이 예상 선언보다 _더_ 허용적인 경우에만 다른 가시성 수준을 지원합니다. 예를 들면 다음과 같습니다.

```kotlin
expect internal class Attribute // 가시성은 internal입니다.
actual class Attribute          // 가시성은 기본적으로 public이며,
                                // 더 허용적입니다.
```

마찬가지로 실제 선언에서 [타입 별칭](type-aliases)을 사용하는 경우 **기본 타입**의 가시성은 예상 선언보다 동일하거나 더 허용적이어야 합니다. 예를 들면 다음과 같습니다.

```kotlin
expect internal class Attribute                 // 가시성은 internal입니다.
internal actual typealias Attribute = Expanded

class Expanded                                  // 가시성은 기본적으로 public이며,
                                                // 더 허용적입니다.
```

### 컴파일러 플러그인 지원

현재 Kotlin K2 컴파일러는 다음 Kotlin 컴파일러 플러그인을 지원합니다.

* [`all-open`](all-open-plugin)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok)
* [`no-arg`](no-arg-plugin)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [SAM with receiver](sam-with-receiver-plugin)
* [serialization](serialization)
* [Power-assert](power-assert)

또한 Kotlin K2 컴파일러는 다음을 지원합니다.

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 컴파일러 플러그인 2.0.0은 [Kotlin 리포지토리로 이동](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)했습니다.
* [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 이후의 [Kotlin Symbol Processing (KSP) 플러그인](ksp-overview).

:::note
추가 컴파일러 플러그인을 사용하는 경우 K2와 호환되는지 해당 문서를 확인하세요.

### 실험적인 Kotlin Power-assert 컴파일러 플러그인

Kotlin Power-assert 플러그인은 [실험적](components-stability#stability-levels-explained)입니다.
언제든지 변경될 수 있습니다.

Kotlin 2.0.0은 실험적인 Power-assert 컴파일러 플러그인을 도입했습니다. 이 플러그인은 실패 메시지에 컨텍스트 정보를 포함하여 테스트 작성 경험을 개선하여 디버깅을 더 쉽고 효율적으로 만듭니다.

개발자는 효과적인 테스트를 작성하기 위해 복잡한 어설션 라이브러리를 사용해야 하는 경우가 많습니다. Power-assert 플러그인은 어설션 식의 중간 값을 포함하는 실패 메시지를 자동으로 생성하여 이 프로세스를 단순화합니다.
이를 통해 개발자는 테스트가 실패한 이유를 빠르게 이해할 수 있습니다.

테스트에서 어설션이 실패하면 개선된 오류 메시지는 어설션 내의 모든 변수와 하위 식의 값을 보여 주므로 조건의 어느 부분이 실패를 일으켰는지 명확하게 알 수 있습니다. 이는 여러 조건을 확인하는 복잡한 어설션에 특히 유용합니다.

프로젝트에서 플러그인을 활성화하려면 `build.gradle(.kts)` 파일에서 구성합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</TabItem>
</Tabs>

[Kotlin Power-assert 플러그인에 대한 자세한 내용은 설명서](power-assert)를 참조하세요.

### Kotlin K2 컴파일러 활성화 방법

Kotlin 2.0.0부터는 Kotlin K2 컴파일러가 기본적으로 활성화됩니다. 추가 작업이 필요하지 않습니다.

### Kotlin Playground에서 Kotlin K2 컴파일러 사용해 보기

Kotlin Playground는 2.0.0 릴리스를 지원합니다. [확인해 보세요!](https://pl.kotl.in/czuoQprce)

### IDE 지원

기본적으로 IntelliJ IDEA 및 Android Studio는 여전히 코드 분석, 코드 완성, 강조 표시 및 기타 IDE 관련 기능에 이전 컴파일러를 사용합니다. IDE에서 Kotlin 2.0의 모든 기능을 사용하려면 K2 모드를 활성화하세요.

IDE에서 **Settings**(설정) | **Languages & Frameworks**(언어 및 프레임워크) | **Kotlin**으로 이동하여 **Enable K2 mode**(K2 모드 활성화) 옵션을 선택합니다. IDE는 K2 모드를 사용하여 코드를 분석합니다.

<img src="/img/k2-mode.png" alt="K2 모드 활성화" width="200" style={{verticalAlign: 'middle'}}/>

K2 모드를 활성화한 후 컴파일러 동작 변경으로 인해 IDE 분석에 차이가 있을 수 있습니다.
새로운 K2 컴파일러가 이전 컴파일러와 어떻게 다른지 알아보려면 [마이그레이션 가이드](k2-compiler-migration-guide)를 참조하세요.

* [블로그](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)에서 K2 모드에 대해 자세히 알아보세요.
* K2 모드에 대한 피드백을 적극적으로 수집하고 있으므로 [공개 Slack 채널](https://kotlinlang.slack.com/archives/C0B8H786P)에서 의견을 공유해 주세요.

### 새로운 K2 컴파일러에 대한 피드백을 남겨주세요.

여러분의 피드백을 환영합니다!

* 새로운 K2 컴파일러에 직면한 문제를 [이슈 트래커](https://kotl.in/issue)에 보고하세요.
* [ "사용 통계 보내기" 옵션 활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)하여
  JetBrains에서 K2 사용에 대한 익명 데이터를 수집할 수 있도록 허용합니다.

## Kotlin/JVM

2.0.0 버전부터 컴파일러는 Java 22 바이트코드를 포함하는 클래스를 생성할 수 있습니다.
이 버전에는 다음과 같은 변경 사항도 있습니다.

* [`invokedynamic`을 사용한 람다 함수 생성](#generation-of-lambda-functions-using-invokedynamic)
* [`kotlinx-metadata-jvm` 라이브러리 안정화](#the-kotlinx-metadata-jvm-library-is-stable)

### `invokedynamic`을 사용한 람다 함수 생성

Kotlin 2.0.0은 `invokedynamic`을 사용하여 람다 함수를 생성하는 새로운 기본 메서드를 도입했습니다. 이 변경 사항은 기존의 익명 클래스 생성에 비해 애플리케이션의 바이너리 크기를 줄입니다.

첫 번째 버전부터 Kotlin은 람다를 익명 클래스로 생성했습니다. 그러나 [Kotlin 1.5.0](whatsnew15#lambdas-via-invokedynamic)부터 `-Xlambdas=indy` 컴파일러 옵션을 사용하여 `invokedynamic` 생성 옵션을 사용할 수 있었습니다. Kotlin 2.0.0에서는 `invokedynamic`이 람다 생성의 기본 메서드가 되었습니다. 이 메서드는 더 가벼운 바이너리를 생성하고 Kotlin을 JVM 최적화와 정렬하여 애플리케이션이 JVM 성능의 지속적인 및 미래 개선의 이점을 누릴 수 있도록 합니다.

현재 일반 람다 컴파일에 비해 다음과 같은 세 가지 제한 사항이 있습니다.

* `invokedynamic`으로 컴파일된 람다는 직렬화할 수 없습니다.
* 실험적 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API는
  `invokedynamic`으로 생성된 람다를 지원하지 않습니다.
* 이러한 람다에서 `.toString()`을 호출하면 덜 읽기 쉬운 문자열 표현이 생성됩니다.

```kotlin
fun main() {
    println({})

    // Kotlin 1.9.24 및 리플렉션에서 반환
    // () `->` kotlin.Unit
    
    // Kotlin 2.0.0에서 반환
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

람다 함수 생성의 레거시 동작을 유지하려면 다음 중 하나를 수행하면 됩니다.

* `@JvmSerializableLambda`로 특정 람다에 주석을 추가합니다.
* `-Xlambdas=class` 컴파일러 옵션을 사용하여 레거시 메서드를 사용하여 모듈의 모든 람다를 생성합니다.

### `kotlinx-metadata-jvm` 라이브러리 안정화

Kotlin 2.0.0에서는 `kotlinx-metadata-jvm` 라이브러리가 [안정화](components-stability#stability-levels-explained)되었습니다.
이제 라이브러리가 `kotlin` 패키지 및 좌표로 변경되었으므로 `kotlin-metadata-jvm`("x" 제외)으로 찾을 수 있습니다.

이전에는 `kotlinx-metadata-jvm` 라이브러리에 자체 게시 방식과 버전이 있었습니다. 이제 Kotlin 표준 라이브러리와 동일한 이전 버전과의 호환성 보장으로 Kotlin 릴리스 주기의 일부로 `kotlin-metadata-jvm` 업데이트를 빌드하고 게시합니다.

`kotlin-metadata-jvm` 라이브러리는 Kotlin/JVM 컴파일러에서 생성된 바이너리 파일의 메타데이터를 읽고 수정하는 API를 제공합니다.

<!-- `kotlinx-metadata-jvm` 라이브러리에 대한 자세한 내용은 [설명서](kotlin-metadata-jvm.md)를 참조하세요. -->

## Kotlin/Native

이 버전에는 다음과 같은 변경 사항이 있습니다.

* [Apple 플랫폼에서 Signpost를 사용한 GC 성능 모니터링](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [Objective-C 메서드를 사용한 충돌 해결](#resolving-conflicts-with-objective-c-methods)
* [Kotlin/Native의 컴파일러 인수에 대한 로그 수준 변경](#changed-log-level-for-compiler-arguments-in-kotlin-native)
* [Kotlin/Native에 표준 라이브러리 및 플랫폼 종속성을 명시적으로 추가](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
* [Gradle 구성 캐시의 작업 오류](#tasks-error-in-gradle-configuration-cache)

### Apple 플랫폼에서 Signpost를 사용한 GC 성능 모니터링

이전에는 로그를 확인하여 Kotlin/Native의 가비지 컬렉터(GC) 성능만 모니터링할 수 있었습니다.
그러나 이러한 로그는 iOS
앱 성능 문제를 조사하는 데 널리 사용되는 툴킷인 Xcode Instruments와 통합되지 않았습니다.

Kotlin 2.0.0부터 GC는 Instruments에서 사용할 수 있는 Signpost를 사용하여 일시 중지를 보고합니다. Signpost를 사용하면 앱 내