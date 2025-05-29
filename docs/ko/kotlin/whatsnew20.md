[//]: # (title: Kotlin 2.0.0의 새로운 기능)

_[출시일: 2024년 5월 21일](releases.md#release-details)_

Kotlin 2.0.0 릴리스가 공개되었으며, [새로운 Kotlin K2 컴파일러](#kotlin-k2-compiler)가 안정화되었습니다! 또한, 다음은 몇 가지 주요 개선 사항입니다:

* [새로운 Compose 컴파일러 Gradle 플러그인](#new-compose-compiler-gradle-plugin)
* [`invokedynamic`를 사용한 람다 함수 생성](#generation-of-lambda-functions-using-invokedynamic)
* [`kotlinx-metadata-jvm` 라이브러리 안정화](#the-kotlinx-metadata-jvm-library-is-stable)
* [Apple 플랫폼에서 `signpost`를 통한 Kotlin/Native의 GC 성능 모니터링](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [Objective-C 메서드와의 Kotlin/Native 충돌 해결](#resolving-conflicts-with-objective-c-methods)
* [Kotlin/Wasm에서 명명된 내보내기 지원](#support-for-named-export)
* [Kotlin/Wasm의 `@JsExport` 함수에서 부호 없는 프리미티브 타입 지원](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [`Binaryen`을 사용하여 기본적으로 프로덕션 빌드 최적화](#optimized-production-builds-by-default-using-binaryen)
* [멀티플랫폼 프로젝트 컴파일러 옵션을 위한 새로운 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [enum 클래스 `values` 제네릭 함수에 대한 안정적인 대체 기능](#stable-replacement-of-the-enum-class-values-generic-function)
* [안정적인 `AutoCloseable` 인터페이스](#stable-autocloseable-interface)

Kotlin 2.0은 JetBrains 팀에게 중요한 이정표입니다. 이 릴리스는 KotlinConf 2024의 핵심이었습니다. 개막 기조연설에서 흥미로운 업데이트를 발표하고 Kotlin 언어에 대한 최근 작업에 대해 다루었습니다.

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 지원

Kotlin 2.0.0을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다. IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다. 빌드 스크립트에서 [Kotlin 버전을 Kotlin 2.0.0으로 변경하기만 하면 됩니다](releases.md#update-to-a-new-kotlin-version).

* IntelliJ IDEA의 Kotlin K2 컴파일러 지원에 대한 자세한 내용은 [IDE 지원](#support-in-ides)을 참조하세요.
* IntelliJ IDEA의 Kotlin 지원에 대한 자세한 내용은 [Kotlin 릴리스](releases.md#ide-support)를 참조하세요.

## Kotlin K2 컴파일러

K2 컴파일러 개발은 오랜 여정이었지만, 이제 JetBrains 팀은 마침내 안정화를 발표할 준비가 되었습니다. Kotlin 2.0.0에서는 새로운 Kotlin K2 컴파일러가 기본적으로 사용되며, 모든 타겟 플랫폼(JVM, Native, Wasm, JS)에서 [안정화](components-stability.md)되었습니다. 새로운 컴파일러는 주요 성능 개선을 가져오고, 새로운 언어 기능 개발 속도를 향상시키며, Kotlin이 지원하는 모든 플랫폼을 통합하고, 멀티플랫폼 프로젝트를 위한 더 나은 아키텍처를 제공합니다.

JetBrains 팀은 선택된 사용자 및 내부 프로젝트의 코드 1천만 줄을 성공적으로 컴파일하여 새로운 컴파일러의 품질을 보장했습니다. 1만 8천 명의 개발자가 안정화 과정에 참여하여 총 8만 개 프로젝트에서 새로운 K2 컴파일러를 테스트하고 발견된 모든 문제를 보고했습니다.

새 컴파일러로의 마이그레이션 프로세스를 최대한 원활하게 진행할 수 있도록 [K2 컴파일러 마이그레이션 가이드](k2-compiler-migration-guide.md)를 만들었습니다. 이 가이드는 컴파일러의 다양한 이점을 설명하고, 발생할 수 있는 변경 사항을 강조하며, 필요한 경우 이전 버전으로 되돌리는 방법을 설명합니다.

[블로그 게시물](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)에서 K2 컴파일러의 다양한 프로젝트에서의 성능을 탐색했습니다. K2 컴파일러의 실제 성능 데이터를 확인하고 자신만의 프로젝트에서 성능 벤치마크를 수집하는 방법에 대한 지침을 찾고 싶다면 이 게시물을 확인해 보세요.

KotlinConf 2024에서 언어 수석 디자이너인 Michail Zarečenskij가 Kotlin의 기능 발전과 K2 컴파일러에 대해 논의하는 이 강연을 시청할 수도 있습니다:

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 현재 K2 컴파일러 제한 사항

Gradle 프로젝트에서 K2를 활성화하면 다음과 같은 경우 Gradle 8.3 미만 버전을 사용하는 프로젝트에 영향을 미칠 수 있는 특정 제한 사항이 있습니다.

* `buildSrc`의 소스 코드 컴파일.
* 포함된 빌드에서 Gradle 플러그인 컴파일.
* Gradle 8.3 미만 버전의 프로젝트에서 다른 Gradle 플러그인이 사용되는 경우 해당 플러그인 컴파일.
* Gradle 플러그인 종속성 빌드.

위에서 언급된 문제 중 하나를 발견하면 다음 단계를 통해 해결할 수 있습니다.

* `buildSrc`, 모든 Gradle 플러그인 및 해당 종속성에 대한 언어 버전을 설정하세요:

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 특정 태스크에 대해 언어 및 API 버전을 구성하는 경우, 이러한 값은 `compilerOptions` 확장으로 설정된 값을 재정의합니다. 이 경우 언어 및 API 버전은 1.9보다 높아서는 안 됩니다.
  >
  {style="note"}

* 프로젝트의 Gradle 버전을 8.3 이상으로 업데이트하세요.

### 스마트 캐스트 개선 사항

Kotlin 컴파일러는 특정 경우에 객체를 타입으로 자동으로 캐스팅하여 수동으로 명시적 캐스팅을 수행할 필요를 줄여줍니다. 이를 [스마트 캐스팅](typecasts.md#smart-casts)이라고 합니다. Kotlin K2 컴파일러는 이제 이전보다 더 많은 시나리오에서 스마트 캐스트를 수행합니다.

Kotlin 2.0.0에서는 다음과 같은 영역에서 스마트 캐스트와 관련된 개선 사항을 적용했습니다.

* [지역 변수 및 추가 범위](#local-variables-and-further-scopes)
* [논리적 `or` 연산자를 사용한 타입 검사](#type-checks-with-logical-or-operator)
* [인라인 함수](#inline-functions)
* [함수 타입을 가진 프로퍼티](#properties-with-function-types)
* [예외 처리](#exception-handling)
* [증가 및 감소 연산자](#increment-and-decrement-operators)

#### 지역 변수 및 추가 범위

이전에는 변수가 `if` 조건 내에서 `null`이 아닌 것으로 평가되면 변수는 스마트 캐스트되었습니다. 이 변수에 대한 정보는 `if` 블록 범위 내에서 추가로 공유되었습니다.

그러나 `if` 조건 **외부**에 변수를 선언한 경우 `if` 조건 내에서 해당 변수에 대한 정보를 사용할 수 없어 스마트 캐스트될 수 없었습니다. `when` 표현식과 `while` 루프에서도 이러한 동작이 나타났습니다.

Kotlin 2.0.0부터, `if`, `when`, 또는 `while` 조건에서 변수를 사용하기 전에 변수를 선언하면, 컴파일러가 해당 변수에 대해 수집한 모든 정보는 스마트 캐스팅을 위해 해당 블록에서 접근할 수 있습니다.

이것은 부울 조건을 변수로 추출하는 것과 같은 작업을 수행하려는 경우 유용합니다. 그런 다음 변수에 의미 있는 이름을 부여하여 코드 가독성을 향상하고 코드에서 나중에 변수를 재사용할 수 있도록 합니다. 예를 들어:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0.0에서는 컴파일러가
        // isCat에 대한 정보에 접근할 수 있으므로
        // animal이 Cat 타입으로 스마트 캐스트되었음을 알 수 있습니다.
        // 따라서 purr() 함수를 호출할 수 있습니다.
        // Kotlin 1.9.20에서는 컴파일러가
        // 스마트 캐스트에 대해 알지 못하므로 purr() 함수를 호출하면
        // 오류가 발생합니다.
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 논리적 `or` 연산자를 사용한 타입 검사

Kotlin 2.0.0에서는 객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면 가장 가까운 공통 상위 타입으로 스마트 캐스트됩니다. 이 변경 전에는 스마트 캐스트가 항상 `Any` 타입으로 이루어졌습니다.

이 경우, 객체의 프로퍼티에 접근하거나 함수를 호출하기 전에 이후에 객체 타입을 수동으로 다시 확인해야 했습니다. 예를 들어:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus가 공통 상위 타입 Status로 스마트 캐스트됩니다.
        signalStatus.signal()
        // Kotlin 2.0.0 이전에는 signalStatus가
        // Any 타입으로 스마트 캐스트되어 signal() 함수를 호출하면
        // 'Unresolved reference' 오류가 발생했습니다. signal() 함수는 다음의
        // 추가 타입 검사 후에만 성공적으로 호출할 수 있었습니다:

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 공통 상위 타입은 유니온 타입(Union type)의 **근사치**입니다. [유니온 타입](https://en.wikipedia.org/wiki/Union_type)은 Kotlin에서 지원되지 않습니다.
>
{style="note"}

#### 인라인 함수

Kotlin 2.0.0에서는 K2 컴파일러가 인라인 함수를 다르게 처리하여, 다른 컴파일러 분석과 결합하여 스마트 캐스트를 안전하게 수행할 수 있는지 판단할 수 있습니다.

특히, 인라인 함수는 이제 암시적인 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 가진 것으로 처리됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 제자리에서 호출됨을 의미합니다. 람다 함수가 제자리에서 호출되므로, 컴파일러는 람다 함수가 함수 본문에 포함된 어떤 변수에 대한 참조도 누출할 수 없다는 것을 압니다.

컴파일러는 이 지식을 다른 컴파일러 분석과 함께 사용하여 캡처된 변수 중 일부를 스마트 캐스트하는 것이 안전한지 결정합니다. 예를 들어:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // Kotlin 2.0.0에서는 컴파일러가 processor가
        // 지역 변수이고 inlineAction()이 인라인 함수라는 것을 알고 있으므로
        // processor에 대한 참조가 유출될 수 없습니다. 따라서
        // processor를 스마트 캐스트하는 것이 안전합니다.

        // processor가 null이 아니면, processor는 스마트 캐스트됩니다.
        if (processor != null) {
            // 컴파일러는 processor가 null이 아니라는 것을 알기 때문에 안전 호출이
            // 필요하지 않습니다.
            processor.process()

            // Kotlin 1.9.20에서는 안전 호출을 수행해야 합니다:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 함수 타입을 가진 프로퍼티

이전 Kotlin 버전에서는 함수 타입을 가진 클래스 프로퍼티가 스마트 캐스트되지 않는 버그가 있었습니다. Kotlin 2.0.0 및 K2 컴파일러에서 이 동작을 수정했습니다. 예를 들어:

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // Kotlin 2.0.0에서는 provider가 null이 아니면
        // provider는 스마트 캐스트됩니다.
        if (provider != null) {
            // 컴파일러는 provider가 null이 아니라는 것을 압니다.
            provider()

            // 1.9.20에서는 컴파일러가 provider가 null이 아니라는 것을 알지 못하므로
            // 오류가 발생합니다:
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

이 변경 사항은 `invoke` 연산자를 오버로드하는 경우에도 적용됩니다. 예를 들어:

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 1.9.20에서는 컴파일러가 오류를 발생시킵니다:
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 예외 처리

Kotlin 2.0.0에서는 예외 처리 기능을 개선하여 스마트 캐스트 정보가 `catch` 및 `finally` 블록으로 전달될 수 있도록 했습니다. 이 변경 사항은 컴파일러가 객체의 nullable 타입 여부를 추적하므로 코드를 더 안전하게 만듭니다. 예를 들어:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput은 String 타입으로 스마트 캐스트됩니다.
    stringInput = ""
    try {
        // 컴파일러는 stringInput이 null이 아니라는 것을 압니다.
        println(stringInput.length)
        // 0

        // 컴파일러는 stringInput에 대한 이전 스마트 캐스트 정보를 거부합니다.
        // 이제 stringInput은 String? 타입을 가집니다.
        stringInput = null

        // 예외 발생
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0에서는 컴파일러가 stringInput이
        // null일 수 있다는 것을 알고 있으므로 stringInput은 계속 nullable 상태를 유지합니다.
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20에서는 컴파일러가 안전 호출이 필요 없다고 말하지만,
        // 이는 올바르지 않습니다.
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 증가 및 감소 연산자

Kotlin 2.0.0 이전에는 컴파일러가 증가 또는 감소 연산자를 사용한 후 객체의 타입이 변경될 수 있다는 것을 이해하지 못했습니다. 컴파일러가 객체 타입을 정확하게 추적할 수 없었으므로 `unresolved reference` 오류로 이어질 수 있었습니다. Kotlin 2.0.0에서는 이것이 수정되었습니다.

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

    // unknownObject가 Tau 인터페이스를 상속하는지 확인합니다.
    // 참고로, unknownObject가 Rho와 Tau 인터페이스를
    // 모두 상속할 수 있습니다.
    if (unknownObject is Tau) {

        // Rho 인터페이스의 오버로드된 inc() 연산자를 사용합니다.
        // Kotlin 2.0.0에서는 unknownObject의 타입이
        // Sigma로 스마트 캐스트됩니다.
        ++unknownObject

        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입을 가진다는 것을 알기 때문에
        // sigma() 함수를 성공적으로 호출할 수 있습니다.
        unknownObject.sigma()

        // Kotlin 1.9.20에서는 inc()가 호출될 때 컴파일러가 스마트 캐스트를
        // 수행하지 않아 컴파일러는 여전히 unknownObject가 Tau 타입이라고 생각합니다.
        // sigma() 함수를 호출하면 컴파일 타임 오류가 발생합니다.
        
        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입을 가진다는 것을 알기 때문에
        // tau() 함수를 호출하면 컴파일 타임 오류가 발생합니다.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // Kotlin 1.9.20에서는 컴파일러가 실수로 unknownObject가 Tau 타입이라고 생각하므로
        // tau() 함수를 호출할 수 있지만 ClassCastException이 발생합니다.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform 개선 사항

Kotlin 2.0.0에서는 Kotlin Multiplatform과 관련된 K2 컴파일러 개선 사항을 다음 영역에서 적용했습니다.

* [컴파일 시 공통 소스와 플랫폼 소스 분리](#separation-of-common-and-platform-sources-during-compilation)
* [expect 및 actual 선언의 서로 다른 가시성 수준](#different-visibility-levels-of-expected-and-actual-declarations)

#### 컴파일 시 공통 소스와 플랫폼 소스 분리

이전에는 Kotlin 컴파일러의 설계가 컴파일 시 공통 소스 세트와 플랫폼 소스 세트를 분리하는 것을 방해했습니다. 결과적으로 공통 코드가 플랫폼 코드에 접근할 수 있었고, 이는 플랫폼 간의 다른 동작으로 이어졌습니다. 또한, 일부 컴파일러 설정과 공통 코드의 종속성이 플랫폼 코드로 유출되곤 했습니다.

Kotlin 2.0.0에서 새로운 Kotlin K2 컴파일러 구현은 공통 소스 세트와 플랫폼 소스 세트 간의 엄격한 분리를 보장하기 위한 컴파일 스키마의 재설계가 포함되었습니다. 이 변경 사항은 [expect 및 actual 함수](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)를 사용할 때 가장 두드러집니다. 이전에는 공통 코드의 함수 호출이 플랫폼 코드의 함수로 해석되는 것이 가능했습니다. 예를 들어:

<table>
   <tr>
       <td>공통 코드</td>
       <td>플랫폼 코드</td>
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
```

</td>
</tr>
</table>

이 예에서 공통 코드는 실행되는 플랫폼에 따라 다른 동작을 보입니다.

* JVM 플랫폼에서는 공통 코드에서 `foo()` 함수를 호출하면 플랫폼 코드의 `foo()` 함수가 `platform foo`로 호출됩니다.
* JavaScript 플랫폼에서는 공통 코드에서 `foo()` 함수를 호출하면 플랫폼 코드에 그러한 함수가 없으므로 공통 코드의 `foo()` 함수가 `common foo`로 호출됩니다.

Kotlin 2.0.0에서는 공통 코드가 플랫폼 코드에 접근할 수 없으므로, 양쪽 플랫폼 모두 공통 코드의 `foo()` 함수로 성공적으로 해석됩니다: `common foo`.

플랫폼 간 동작 일관성 향상 외에도, IntelliJ IDEA 또는 Android Studio와 컴파일러 간에 충돌하는 동작이 있는 경우를 수정하기 위해 노력했습니다. 예를 들어, [expect 및 actual 클래스](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)를 사용하면 다음이 발생했습니다.

<table>
   <tr>
       <td>공통 코드</td>
       <td>플랫폼 코드</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0 이전에는
    // IDE 전용 오류가 발생했습니다.
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity has no default constructor.
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

이 예에서 expected 클래스 `Identity`에는 기본 생성자가 없으므로 공통 코드에서 성공적으로 호출될 수 없습니다. 이전에는 IDE에서만 오류가 보고되었지만, JVM에서는 코드가 여전히 성공적으로 컴파일되었습니다. 그러나 이제 컴파일러는 올바르게 오류를 보고합니다.

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 해석 동작이 변경되지 않는 경우

저희는 여전히 새로운 컴파일 스키마로 마이그레이션하는 과정에 있으므로, 동일한 소스 세트 내에 있지 않은 함수를 호출할 때 해석 동작은 여전히 동일합니다. 주로 공통 코드에서 멀티플랫폼 라이브러리의 오버로드를 사용할 때 이러한 차이를 알 수 있습니다.

서로 다른 시그니처를 가진 두 개의 `whichFun()` 함수가 있는 라이브러리가 있다고 가정해 봅시다.

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

공통 코드에서 `whichFun()` 함수를 호출하면 라이브러리에서 가장 적절한 인자 타입을 가진 함수가 해석됩니다.

```kotlin
// A project that uses the example library for the JVM target

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

이에 비해, `whichFun()`에 대한 오버로드를 동일한 소스 세트 내에 선언하면, 코드에 플랫폼별 버전에 대한 접근 권한이 없으므로 공통 코드의 함수가 해석됩니다.

```kotlin
// Example library isn't used

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

멀티플랫폼 라이브러리와 유사하게, `commonTest` 모듈이 별도의 소스 세트에 있으므로 플랫폼별 코드에 여전히 접근할 수 있습니다. 따라서 `commonTest` 모듈의 함수 호출 해석은 이전 컴파일 스키마와 동일한 동작을 보입니다.

앞으로는 이러한 나머지 경우들이 새로운 컴파일 스키마와 더욱 일관성을 갖게 될 것입니다.

#### expect 및 actual 선언의 서로 다른 가시성 수준

Kotlin 2.0.0 이전에는 Kotlin Multiplatform 프로젝트에서 [expect 및 actual 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)을 사용하는 경우 동일한 [가시성 수준](visibility-modifiers.md)을 가져야 했습니다. Kotlin 2.0.0은 이제 다른 가시성 수준도 지원하지만, 실제 선언이 예상 선언보다 _더_ 허용적이어야 **만** 합니다. 예를 들어:

```kotlin
expect internal class Attribute // 가시성: internal
actual class Attribute          // 가시성: 기본적으로 public,
                                // (더 허용적)
```

마찬가지로, actual 선언에서 [타입 별칭](type-aliases.md)을 사용하는 경우 **기저 타입**의 가시성은 예상 선언과 동일하거나 더 허용적이어야 합니다. 예를 들어:

```kotlin
expect internal class Attribute                 // 가시성: internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 가시성: 기본적으로 public,
                                                // (더 허용적)
```

### 컴파일러 플러그인 지원

현재 Kotlin K2 컴파일러는 다음 Kotlin 컴파일러 플러그인을 지원합니다.

* [`all-open`](all-open-plugin.md)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok.md)
* [`no-arg`](no-arg-plugin.md)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [serialization](serialization.md)
* [Power-assert](power-assert.md)

또한 Kotlin K2 컴파일러는 다음을 지원합니다.

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 컴파일러 플러그인 2.0.0 (Kotlin 저장소로 [이동됨](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)).
* [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 이후 [Kotlin Symbol Processing (KSP) 플러그인](ksp-overview.md).

> 추가 컴파일러 플러그인을 사용하는 경우, K2와 호환되는지 해당 문서에서 확인하세요.
>
{style="tip"}

### 실험적인 Kotlin Power-assert 컴파일러 플러그인

> Kotlin Power-assert 플러그인은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 변경될 수 있습니다.
>
{style="warning"}

Kotlin 2.0.0은 실험적인 Power-assert 컴파일러 플러그인을 도입합니다. 이 플러그인은 실패 메시지에 문맥 정보를 포함하여 테스트 작성 경험을 향상시키고 디버깅을 더 쉽고 효율적으로 만듭니다.

개발자는 효과적인 테스트를 작성하기 위해 복잡한 어설션 라이브러리를 사용해야 하는 경우가 많습니다. Power-assert 플러그인은 어설션 표현식의 중간 값을 포함하는 실패 메시지를 자동으로 생성하여 이 프로세스를 단순화합니다. 이는 개발자가 테스트가 실패한 이유를 빠르게 이해하는 데 도움이 됩니다.

테스트에서 어설션이 실패하면 개선된 오류 메시지는 어설션 내의 모든 변수와 하위 표현식의 값을 보여주므로, 조건의 어떤 부분이 실패를 유발했는지 명확하게 알 수 있습니다. 이는 여러 조건이 검사되는 복잡한 어설션에 특히 유용합니다.

프로젝트에서 플러그인을 활성화하려면 `build.gradle(.kts)` 파일에 구성하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</tab>
</tabs>

[문서에서 Kotlin Power-assert 플러그인](power-assert.md)에 대해 자세히 알아보세요.

### Kotlin K2 컴파일러 활성화 방법

Kotlin 2.0.0부터 Kotlin K2 컴파일러는 기본적으로 활성화됩니다. 추가 조치는 필요하지 않습니다.

### Kotlin Playground에서 Kotlin K2 컴파일러 사용해보기

Kotlin Playground는 2.0.0 릴리스를 지원합니다. [지금 확인해 보세요!](https://pl.kotl.in/czuoQprce)

### IDE 지원

기본적으로 IntelliJ IDEA 및 Android Studio는 코드 분석, 코드 완성, 하이라이팅 및 기타 IDE 관련 기능에 여전히 이전 컴파일러를 사용합니다. IDE에서 완벽한 Kotlin 2.0 경험을 얻으려면 K2 모드를 활성화하세요.

IDE에서 **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동하여 **Enable K2 mode** 옵션을 선택하세요. IDE는 K2 모드를 사용하여 코드를 분석합니다.

![Enable K2 mode](k2-mode.png){width=200}

K2 모드를 활성화한 후 컴파일러 동작 변경으로 인해 IDE 분석에서 차이점을 발견할 수 있습니다. 새로운 K2 컴파일러가 이전 컴파일러와 어떻게 다른지 [마이그레이션 가이드](k2-compiler-migration-guide.md)에서 알아보세요.

* [블로그](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)에서 K2 모드에 대해 자세히 알아보세요.
* 저희는 K2 모드에 대한 피드백을 적극적으로 수집하고 있으니, [공개 Slack 채널](https://kotlinlang.slack.com/archives/C0B8H786P)에서 의견을 공유해주세요.

### 새로운 K2 컴파일러에 대한 피드백 남기기

어떤 피드백이든 감사히 받겠습니다!

* 새로운 K2 컴파일러 사용 중 발생하는 모든 문제를 [이슈 트래커](https://kotl.in/issue)에 보고해주세요.
* [사용량 통계 보내기 옵션](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)을 활성화하여 JetBrains가 K2 사용에 대한 익명 데이터를 수집할 수 있도록 허용하세요.

## Kotlin/JVM

버전 2.0.0부터 컴파일러는 Java 22 바이트코드를 포함하는 클래스를 생성할 수 있습니다. 이 버전에는 다음 변경 사항도 포함됩니다.

* [`invokedynamic`를 사용한 람다 함수 생성](#generation-of-lambda-functions-using-invokedynamic)
* [`kotlinx-metadata-jvm` 라이브러리 안정화](#the-kotlinx-metadata-jvm-library-is-stable)

### `invokedynamic`를 사용한 람다 함수 생성

Kotlin 2.0.0은 `invokedynamic`를 사용하여 람다 함수를 생성하는 새로운 기본 메서드를 도입합니다. 이 변경 사항은 기존 익명 클래스 생성 방식에 비해 애플리케이션의 바이너리 크기를 줄여줍니다.

첫 번째 버전부터 Kotlin은 람다를 익명 클래스로 생성했습니다. 그러나 [Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic)부터는 `-Xlambdas=indy` 컴파일러 옵션을 사용하여 `invokedynamic` 생성을 위한 옵션을 사용할 수 있었습니다. Kotlin 2.0.0에서는 `invokedynamic`가 기본 람다 생성 메서드가 되었습니다. 이 메서드는 더 가벼운 바이너리를 생성하고 Kotlin을 JVM 최적화와 일치시키며, 애플리케이션이 현재 및 미래의 JVM 성능 개선으로부터 이점을 얻도록 보장합니다.

현재, 일반적인 람다 컴파일에 비해 세 가지 제한 사항이 있습니다.

* `invokedynamic`로 컴파일된 람다는 직렬화할 수 없습니다.
* 실험적인 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API는 `invokedynamic`로 생성된 람다를 지원하지 않습니다.
* 이러한 람다에 `.toString()`을 호출하면 가독성이 떨어지는 문자열 표현이 생성됩니다.

```kotlin
fun main() {
    println({})

    // Kotlin 1.9.24 및 리플렉션과 함께 반환:
    // () -> kotlin.Unit
    
    // Kotlin 2.0.0과 함께 반환:
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

람다 함수 생성의 레거시 동작을 유지하려면 다음 중 하나를 수행할 수 있습니다.

* 특정 람다에 `@JvmSerializableLambda`를 어노테이션합니다.
* `compiler option -Xlambdas=class`를 사용하여 모듈의 모든 람다를 레거시 방식으로 생성합니다.

### `kotlinx-metadata-jvm` 라이브러리 안정화

Kotlin 2.0.0에서 `kotlinx-metadata-jvm` 라이브러리는 [안정화](components-stability.md#stability-levels-explained)되었습니다. 이제 라이브러리가 `kotlin` 패키지 및 코디네이트로 변경되었으므로, `kotlin-metadata-jvm` ("x" 없음)으로 찾을 수 있습니다.

이전에는 `kotlinx-metadata-jvm` 라이브러리가 고유한 게시 스키마와 버전을 가졌습니다. 이제 Kotlin 릴리스 주기(" + `kotlin-metadata-jvm` + " 업데이트를 빌드하고 게시할 것입니다. Kotlin 표준 라이브러리와 동일한 하위 호환성 보장을 제공합니다.

`kotlin-metadata-jvm` 라이브러리는 Kotlin/JVM 컴파일러가 생성한 바이너리 파일의 메타데이터를 읽고 수정하는 API를 제공합니다.

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

이 버전에는 다음 변경 사항이 포함됩니다.

* [`signpost`를 사용한 GC 성능 모니터링](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [Objective-C 메서드와의 충돌 해결](#resolving-conflicts-with-objective-c-methods)
* [Kotlin/Native 컴파일러 인자에 대한 로그 레벨 변경](#changed-log-level-for-compiler-arguments)
* [Kotlin/Native에 표준 라이브러리 및 플랫폼 종속성 명시적 추가](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
* [Gradle 설정 캐시의 태스크 오류](#tasks-error-in-gradle-configuration-cache)

### Apple 플랫폼에서 `signpost`를 통한 GC 성능 모니터링

이전에는 로그를 통해 Kotlin/Native의 가비지 컬렉터(GC) 성능을 모니터링하는 것만 가능했습니다. 그러나 이러한 로그는 iOS 앱 성능 문제를 조사하는 데 널리 사용되는 툴킷인 Xcode Instruments와 통합되지 않았습니다.

Kotlin 2.0.0부터, GC는 Instruments에서 사용할 수 있는 `signpost`를 통해 일시 정지(pause)를 보고합니다. `signpost`는 앱 내에서 사용자 지정 로깅을 허용하므로, 이제 iOS 앱 성능을 디버깅할 때 GC 일시 정지가 애플리케이션 정지와 일치하는지 확인할 수 있습니다.

[문서](native-memory-manager.md#monitor-gc-performance)에서 GC 성능 분석에 대해 자세히 알아보세요.

### Objective-C 메서드와의 충돌 해결

Objective-C 메서드는 이름은 다르지만, 동일한 수와 타입의 매개변수를 가질 수 있습니다. 예를 들어, [`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc) 및 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)가 있습니다. Kotlin에서는 이러한 메서드가 동일한 시그니처를 가지므로, 이를 사용하려 하면 충돌하는 오버로드 오류를 발생시킵니다.

이전에는 이 컴파일 오류를 피하기 위해 수동으로 충돌하는 오버로드를 억제해야 했습니다. Objective-C와의 Kotlin 상호운용성을 개선하기 위해, Kotlin 2.0.0은 새로운 `@ObjCSignatureOverride` 어노테이션을 도입합니다.

이 어노테이션은 Objective-C 클래스에서 동일한 인자 타입이지만 다른 인자 이름을 가진 여러 함수가 상속되는 경우, Kotlin 컴파일러에게 충돌하는 오버로드를 무시하도록 지시합니다.

이 어노테이션을 적용하는 것은 일반적인 오류 억제보다 더 안전합니다. 이 어노테이션은 지원되고 테스트된 Objective-C 메서드를 오버라이드하는 경우에만 사용할 수 있으며, 일반적인 억제는 중요한 오류를 숨기고 조용히 손상된 코드로 이어질 수 있습니다.

### 컴파일러 인자에 대한 로그 레벨 변경

이 릴리스에서는 Kotlin/Native Gradle 태스크(예: `compile`, `link`, `cinterop`)의 컴파일러 인자에 대한 로그 레벨이 `info`에서 `debug`로 변경되었습니다.

`debug`를 기본값으로 사용하면 로그 레벨이 다른 Gradle 컴파일 태스크와 일관되며, 모든 컴파일러 인자를 포함하여 상세한 디버깅 정보를 제공합니다.

### Kotlin/Native에 표준 라이브러리 및 플랫폼 종속성 명시적 추가

이전에는 Kotlin/Native 컴파일러가 표준 라이브러리 및 플랫폼 종속성을 암시적으로 해석했으며, 이는 Kotlin Gradle 플러그인이 Kotlin 타겟 전반에서 작동하는 방식에 불일치를 야기했습니다.

이제 각 Kotlin/Native Gradle 컴파일은 `compileDependencyFiles` [컴파일 매개변수](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compilation-parameters)를 통해 컴파일 타임 라이브러리 경로에 표준 라이브러리 및 플랫폼 종속성을 명시적으로 포함합니다.

### Gradle 설정 캐시의 태스크 오류

Kotlin 2.0.0부터 `invocation of Task.project at execution time is unsupported`와 같은 메시지를 포함하는 설정 캐시 오류가 발생할 수 있습니다.

이 오류는 `NativeDistributionCommonizerTask` 및 `KotlinNativeCompile`과 같은 태스크에서 나타납니다.

그러나 이것은 오탐(false-positive) 오류입니다. 기저 문제는 `publish*` 태스크와 같이 Gradle 설정 캐시와 호환되지 않는 태스크의 존재입니다.

오류 메시지가 다른 근본 원인을 시사하므로, 이 불일치가 즉시 명확하지 않을 수 있습니다. 오류 보고서에 정확한 원인이 명시적으로 언급되지 않았기 때문에, [Gradle 팀은 이미 보고서 수정 문제](https://github.com/gradle/gradle/issues/21290)를 해결하고 있습니다.

## Kotlin/Wasm

Kotlin 2.0.0은 JavaScript와의 성능 및 상호운용성을 개선합니다.

* [`Binaryen`을 사용하여 기본적으로 프로덕션 빌드 최적화](#optimized-production-builds-by-default-using-binaryen)
* [명명된 내보내기 지원](#support-for-named-export)
* [`@JsExport` 함수에서 부호 없는 프리미티브 타입 지원](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [Kotlin/Wasm에서 TypeScript 선언 파일 생성](#generation-of-typescript-declaration-files-in-kotlin-wasm)
* [JavaScript 예외 처리 지원](#support-for-catching-javascript-exceptions)
* [새로운 예외 처리 제안이 이제 옵션으로 지원됩니다.](#new-exception-handling-proposal-is-now-supported-as-an-option)
* [`withWasm()` 함수가 JS 및 WASI 변형으로 분리됨](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### `Binaryen`을 사용하여 기본적으로 프로덕션 빌드 최적화

Kotlin/Wasm 툴체인은 이제 이전의 수동 설정 방식과는 대조적으로 프로덕션 컴파일 중에 모든 프로젝트에 [Binaryen](https://github.com/WebAssembly/binaryen) 도구를 적용합니다. 저희의 추정치에 따르면, 이는 런타임 성능을 향상시키고 프로젝트의 바이너리 크기를 줄여야 합니다.

> 이 변경 사항은 프로덕션 컴파일에만 영향을 미칩니다. 개발 컴파일 프로세스는 동일하게 유지됩니다.
>
{style="note"}

### 명명된 내보내기 지원

이전에는 Kotlin/Wasm에서 내보내진 모든 선언이 기본 내보내기를 사용하여 JavaScript로 임포트되었습니다.

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

이제 `@JsExport`로 표시된 각 Kotlin 선언을 이름으로 임포트할 수 있습니다.

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

명명된 내보내기는 Kotlin과 JavaScript 모듈 간의 코드 공유를 더 쉽게 만듭니다. 가독성을 향상시키고 모듈 간 종속성을 관리하는 데 도움이 됩니다.

### `@JsExport` 함수에서 부호 없는 프리미티브 타입 지원

Kotlin 2.0.0부터, Kotlin/Wasm 함수를 JavaScript 코드에서 사용할 수 있게 하는 `@JsExport` 어노테이션이 있는 외부 선언 및 함수 내에서 [부호 없는 프리미티브 타입](unsigned-integer-types.md)을 사용할 수 있습니다.

이는 이전의 제한 사항인 내보내진 및 외부 선언 내에서 [부호 없는 프리미티브](unsigned-integer-types.md)를 직접 사용할 수 없었던 문제를 완화하는 데 도움이 됩니다. 이제 부호 없는 프리미티브를 반환 또는 매개변수 타입으로 사용하여 함수를 내보내고, 부호 없는 프리미티브를 반환하거나 소비하는 외부 선언을 사용할 수 있습니다.

Kotlin/Wasm과 JavaScript의 상호운용성에 대한 자세한 내용은 [문서](wasm-js-interop.md#use-javascript-code-in-kotlin)를 참조하세요.

### Kotlin/Wasm에서 TypeScript 선언 파일 생성

> Kotlin/Wasm에서 TypeScript 선언 파일을 생성하는 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 중단되거나 변경될 수 있습니다.
>
{style="warning"}

Kotlin 2.0.0에서 Kotlin/Wasm 컴파일러는 이제 Kotlin 코드의 모든 `@JsExport` 선언으로부터 TypeScript 정의를 생성할 수 있습니다. 이러한 정의는 IDE 및 JavaScript 도구에서 코드 자동 완성, 타입 검사를 돕고 JavaScript에 Kotlin 코드를 포함하는 것을 더 쉽게 만드는 데 사용될 수 있습니다.

Kotlin/Wasm 컴파일러는 `@JsExport`로 표시된 모든 [최상위 함수](wasm-js-interop.md#functions-with-the-jsexport-annotation)를 수집하고 `.d.ts` 파일에 TypeScript 정의를 자동으로 생성합니다.

TypeScript 정의를 생성하려면 `build.gradle(.kts)` 파일의 `wasmJs {}` 블록에 `generateTypeScriptDefinitions()` 함수를 추가하세요.

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

### JavaScript 예외 처리 지원

이전에는 Kotlin/Wasm 코드가 JavaScript 예외를 catch할 수 없어서 프로그램의 JavaScript 측에서 발생하는 오류를 처리하기 어려웠습니다.

Kotlin 2.0.0에서는 Kotlin/Wasm 내에서 JavaScript 예외를 catch하는 지원을 구현했습니다. 이 구현은 `Throwable` 또는 `JsException`과 같은 특정 타입을 사용하여 `try-catch` 블록을 활용해 이러한 오류를 적절히 처리할 수 있게 합니다.

또한, 예외 발생 여부와 관계없이 코드를 실행하는 데 도움이 되는 `finally` 블록도 올바르게 작동합니다. JavaScript 예외 catch에 대한 지원을 도입하는 동시에, 호출 스택과 같은 JavaScript 예외가 발생할 때 추가 정보가 제공되지 않습니다. 그러나 [저희는 이러한 구현을 진행 중입니다](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException).

### 새로운 예외 처리 제안이 이제 옵션으로 지원됩니다.

이 릴리스에서는 Kotlin/Wasm 내에서 WebAssembly의 새로운 버전 [예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)에 대한 지원을 도입합니다.

이 업데이트는 새로운 제안이 Kotlin 요구 사항과 일치하도록 보장하며, 최신 버전의 제안만 지원하는 가상 머신에서 Kotlin/Wasm을 사용할 수 있도록 합니다.

기본적으로 비활성화된 `-Xwasm-use-new-exception-proposal` 컴파일러 옵션을 사용하여 새로운 예외 처리 제안을 활성화하세요.

### `withWasm()` 함수가 JS 및 WASI 변형으로 분리됨

계층 템플릿에 대한 Wasm 타겟을 제공하던 `withWasm()` 함수는 이제 특수화된 `withWasmJs()` 및 `withWasmWasi()` 함수를 대신하여 사용하지 않도록 권장됩니다.

이제 트리 정의에서 WASI 및 JS 타겟을 서로 다른 그룹으로 분리할 수 있습니다.

## Kotlin/JS

다른 변경 사항 외에도 이 버전은 Kotlin에 최신 JS 컴파일을 제공하여 ES2015 표준의 더 많은 기능을 지원합니다.

* [새로운 컴파일 타겟](#new-compilation-target)
* [ES2015 제너레이터로서의 중단 함수](#suspend-functions-as-es2015-generators)
* [main 함수에 인자 전달](#passing-arguments-to-the-main-function)
* [Kotlin/JS 프로젝트를 위한 파일별 컴파일](#per-file-compilation-for-kotlin-js-projects)
* [개선된 컬렉션 상호운용성](#improved-collection-interoperability)
* [`createInstance()` 지원](#support-for-createinstance)
* [타입 안전한 일반 JavaScript 객체 지원](#support-for-type-safe-plain-javascript-objects)
* [`npm` 패키지 관리자 지원](#support-for-npm-package-manager)
* [컴파일 태스크 변경 사항](#changes-to-compilation-tasks)
* [레거시 Kotlin/JS JAR 아티팩트 중단](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 새로운 컴파일 타겟

Kotlin 2.0.0에서는 Kotlin/JS에 새로운 컴파일 타겟인 `es2015`를 추가합니다. 이는 Kotlin에서 지원되는 모든 ES2015 기능을 한 번에 활성화할 수 있는 새로운 방법입니다.

`build.gradle(.kts)` 파일에 다음과 같이 설정할 수 있습니다.

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

새로운 타겟은 [ES 클래스 및 모듈](whatsnew19.md#experimental-support-for-es2015-classes-and-modules)과 새롭게 지원되는 [ES 제너레이터](#suspend-functions-as-es2015-generators)를 자동으로 활성화합니다.

### ES2015 제너레이터로서의 중단 함수

이 릴리스는 [중단 함수](composing-suspending-functions.md)를 컴파일하기 위한 ES2015 제너레이터에 대한 [실험적](components-stability.md#stability-levels-explained) 지원을 도입합니다.

상태 머신 대신 제너레이터를 사용하면 프로젝트의 최종 번들 크기를 개선해야 합니다. 예를 들어, JetBrains 팀은 ES2015 제너레이터를 사용하여 Space 프로젝트의 번들 크기를 20% 줄이는 데 성공했습니다.

[공식 문서](https://262.ecma-international.org/6.0/)에서 ES2015(ECMAScript 2015, ES6)에 대해 자세히 알아보세요.

### main 함수에 인자 전달

Kotlin 2.0.0부터 `main()` 함수에 대한 `args`의 소스를 지정할 수 있습니다. 이 기능은 명령줄 작업 및 인자 전달을 더 쉽게 만듭니다.

이를 위해 `js {}` 블록을 새로운 `passAsArgumentToMainFunction()` 함수와 함께 정의해야 합니다. 이 함수는 문자열 배열을 반환합니다.

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

이 함수는 런타임에 실행됩니다. JavaScript 표현식을 가져와 `main()` 함수 호출 대신 `args: Array<String>` 인자로 사용합니다.

또한, Node.js 런타임을 사용하는 경우 특별한 별칭을 활용할 수 있습니다. 매번 수동으로 추가하는 대신 `process.argv`를 `args` 매개변수에 한 번 전달할 수 있습니다.

```kotlin
kotlin {
    js {
        binary.executable()
        nodejs {
            passProcessArgvToMainFunction()
        }
    }
}
```

### Kotlin/JS 프로젝트를 위한 파일별 컴파일

Kotlin 2.0.0은 Kotlin/JS 프로젝트 출력에 대한 새로운 세분화 옵션을 도입합니다. 이제 각 Kotlin 파일에 대해 하나의 JavaScript 파일을 생성하는 파일별 컴파일을 설정할 수 있습니다. 이는 최종 번들의 크기를 크게 최적화하고 프로그램의 로딩 시간을 개선하는 데 도움이 됩니다.

이전에는 두 가지 출력 옵션만 있었습니다. Kotlin/JS 컴파일러는 전체 프로젝트에 대해 단일 `.js` 파일을 생성할 수 있었습니다. 그러나 이 파일은 너무 크고 사용하기 불편할 수 있었습니다. 프로젝트에서 함수를 사용하려면 전체 JavaScript 파일을 종속성으로 포함해야 했습니다. 또는 각 프로젝트 모듈에 대해 별도의 `.js` 파일 컴파일을 구성할 수 있었습니다. 이것은 여전히 기본 옵션입니다.

모듈 파일도 너무 클 수 있었기 때문에, Kotlin 2.0.0에서는 각 Kotlin 파일당 하나(또는 파일에 내보내진 선언이 포함된 경우 두 개)의 JavaScript 파일을 생성하는 더 세분화된 출력을 추가합니다. 파일별 컴파일 모드를 활성화하려면:

1. ECMAScript 모듈을 지원하도록 빌드 파일에 [`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 함수를 추가하세요.

   ```kotlin
   // build.gradle.kts
   kotlin {
       js(IR) {
           useEsModules() // ES2015 모듈 활성화
           browser()
       }
   }
   ```

   이를 위해 새로운 `es2015` [컴파일 타겟](#new-compilation-target)을 사용할 수도 있습니다.

2. `-Xir-per-file` 컴파일러 옵션을 적용하거나 `gradle.properties` 파일을 다음으로 업데이트하세요.

   ```none
   # gradle.properties
   kotlin.js.ir.output.granularity=per-file // `per-module`이 기본값입니다.
   ```

### 개선된 컬렉션 상호운용성

Kotlin 2.0.0부터 시그니처 내에 Kotlin 컬렉션 타입을 가진 선언을 JavaScript(및 TypeScript)로 내보낼 수 있습니다. 이는 `Set`, `Map`, `List` 컬렉션 타입 및 해당 가변 타입에 적용됩니다.

JavaScript에서 Kotlin 컬렉션을 사용하려면 먼저 필요한 선언에 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 어노테이션을 표시하세요.

```kotlin
// Kotlin
@JsExport
data class User(
    val name: String,
    val friends: List<User> = emptyList()
)

@JsExport
val me = User(
    name = "Me",
    friends = listOf(User(name = "Kodee"))
)
```

그런 다음 JavaScript에서 일반적인 JavaScript 배열로 사용할 수 있습니다.

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 아쉽게도 JavaScript에서 Kotlin 컬렉션을 생성하는 기능은 아직 사용할 수 없습니다. Kotlin 2.0.20에서 이 기능을 추가할 계획입니다.
>
{style="note"}

### `createInstance()` 지원

Kotlin 2.0.0부터 Kotlin/JS 타겟에서 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 함수를 사용할 수 있습니다. 이전에는 JVM에서만 사용할 수 있었습니다.

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 인터페이스의 이 함수는 지정된 클래스의 새 인스턴스를 생성하며, Kotlin 클래스에 대한 런타임 참조를 얻는 데 유용합니다.

### 타입 안전한 일반 JavaScript 객체 지원

> `js-plain-objects` 플러그인은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 중단되거나 변경될 수 있습니다. `js-plain-objects` 플러그인은 **오직** K2 컴파일러만 지원합니다.
>
{style="warning"}

JavaScript API와의 작업을 더 쉽게 하기 위해 Kotlin 2.0.0에서는 타입 안전한 일반 JavaScript 객체를 생성하는 데 사용할 수 있는 새로운 플러그인인 [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)를 제공합니다. 이 플러그인은 `@JsPlainObject` 어노테이션을 가진 모든 [외부 인터페이스](wasm-js-interop.md#external-interfaces)에 대해 코드를 검사하고 다음을 추가합니다.

* 생성자로 사용할 수 있는 `companion object` 내의 인라인 `invoke` 연산자 함수.
* 객체의 일부 프로퍼티를 조정하면서 객체 복사본을 생성하는 데 사용할 수 있는 `.copy()` 함수.

예를 들어:

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface User {
    var name: String
    val age: Int
    val email: String?
}

fun main() {
    // JavaScript 객체 생성
    val user = User(name = "Name", age = 10)
    // 객체를 복사하고 이메일 추가
    val copy = user.copy(age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

이 접근 방식으로 생성된 모든 JavaScript 객체는 런타임에만 오류를 보는 대신 컴파일 타임에 또는 IDE에서 강조 표시되어 볼 수 있으므로 더 안전합니다.

JavaScript 객체의 형태를 설명하기 위해 외부 인터페이스를 사용하여 JavaScript API와 상호 작용하는 `fetch()` 함수를 사용하는 이 예시를 고려해 보세요.

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// Window.fetch의 래퍼
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// "metod"는 메서드로 인식되지 않으므로 컴파일 타임 오류가 발생합니다.
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// method가 필요하므로 컴파일 타임 오류가 발생합니다.
fetch("https://google.com", options = FetchOptions(body = "SOME STRING")) 
```

이에 비해 `js()` 함수를 대신 사용하여 JavaScript 객체를 생성하면 오류가 런타임에만 발견되거나 전혀 발생하지 않습니다.

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 오류가 발생하지 않습니다. "metod"가 인식되지 않아 잘못된 메서드
// (GET)가 사용됩니다.
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// 기본적으로 GET 메서드가 사용됩니다. body가 없어야 하므로 런타임 오류가 발생합니다.
fetch("https://google.com", options = js("{ body: 'SOME STRING' }"))
// TypeError: Window.fetch: HEAD or GET Request cannot have a body
```

`js-plain-objects` 플러그인을 사용하려면 `build.gradle(.kts)` 파일에 다음을 추가하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.js-plain-objects") version "2.0.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.js-plain-objects" version "2.0.0"
}
```

</tab>
</tabs>

### `npm` 패키지 관리자 지원

이전에는 Kotlin Multiplatform Gradle 플러그인이 `npm` 종속성을 다운로드하고 설치하기 위해 패키지 관리자로 [Yarn](https://yarnpkg.com/lang/en/)만 사용할 수 있었습니다. Kotlin 2.0.0부터는 [npm](https://www.npmjs.com/)을 패키지 관리자로 사용할 수 있습니다. `npm`을 패키지 관리자로 사용한다는 것은 설정 시 관리할 도구가 하나 줄어든다는 의미입니다.

하위 호환성을 위해 Yarn은 여전히 기본 패키지 관리자입니다. `npm`을 패키지 관리자로 사용하려면 `gradle.properties` 파일에 다음 속성을 설정하세요.

```kotlin
kotlin.js.yarn = false
```

### 컴파일 태스크 변경 사항

이전에는 `webpack` 및 `distributeResources` 컴파일 태스크 모두 동일한 디렉토리를 대상으로 했습니다. 또한 `distribution` 태스크도 `dist`를 출력 디렉토리로 선언했습니다. 이는 출력 중복을 야기하고 컴파일 경고를 발생시켰습니다.

따라서 Kotlin 2.0.0부터 다음 변경 사항을 구현했습니다.

* `webpack` 태스크가 이제 별도의 폴더를 대상으로 합니다.
* `distributeResources` 태스크가 완전히 제거되었습니다.
* `distribution` 태스크가 이제 `Copy` 타입을 가지며 `dist` 폴더를 대상으로 합니다.

### 레거시 Kotlin/JS JAR 아티팩트 중단

Kotlin 2.0.0부터 Kotlin 배포는 더 이상 `.jar` 확장자를 가진 레거시 Kotlin/JS 아티팩트를 포함하지 않습니다. 레거시 아티팩트는 지원되지 않는 이전 Kotlin/JS 컴파일러에서 사용되었으며 `klib` 형식을 사용하는 IR 컴파일러에는 불필요합니다.

## Gradle 개선 사항

Kotlin 2.0.0은 Gradle 6.8.3부터 8.5까지 완벽하게 호환됩니다. 최신 Gradle 릴리스 버전까지 사용할 수 있지만, 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 유념하세요.

이 버전에는 다음 변경 사항이 포함됩니다.

* [멀티플랫폼 프로젝트 컴파일러 옵션을 위한 새로운 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [새로운 Compose 컴파일러 Gradle 플러그인](#new-compose-compiler-gradle-plugin)
* [JVM 및 Android 게시 라이브러리를 구분하기 위한 새로운 속성](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
* [Kotlin/Native의 CInteropProcess에 대한 Gradle 종속성 처리 개선](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
* [Gradle의 가시성 변경 사항](#visibility-changes-in-gradle)
* [Gradle 프로젝트의 Kotlin 데이터 새 디렉토리](#new-directory-for-kotlin-data-in-gradle-projects)
* [필요할 때 다운로드되는 Kotlin/Native 컴파일러](#kotlin-native-compiler-downloaded-when-needed)
* [컴파일러 옵션 정의의 이전 방식 사용 중단](#deprecated-old-ways-of-defining-compiler-options)
* [최소 지원 AGP 버전 상향](#bumped-minimum-supported-agp-version)
* [최신 언어 버전을 시도하기 위한 새로운 Gradle 속성](#new-gradle-property-for-trying-the-latest-language-version)
* [빌드 보고서를 위한 새로운 JSON 출력 형식](#new-json-output-format-for-build-reports)
* [`kapt` 설정이 상위 설정으로부터 어노테이션 프로세서를 상속](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
* [Kotlin Gradle 플러그인이 더 이상 사용되지 않는 Gradle 컨벤션 사용 안 함](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### 멀티플랫폼 프로젝트 컴파일러 옵션을 위한 새로운 Gradle DSL

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.0.0 이전에는 Gradle을 사용하는 멀티플랫폼 프로젝트에서 컴파일러 옵션을 구성하는 것이 태스크, 컴파일 또는 소스 세트별과 같은 낮은 수준에서만 가능했습니다. 프로젝트에서 컴파일러 옵션을 더 일반적으로 구성하기 쉽게 하기 위해 Kotlin 2.0.0은 새로운 Gradle DSL과 함께 제공됩니다.

이 새로운 DSL을 사용하면 모든 타겟과 `commonMain`과 같은 공유 소스 세트에 대해 확장 수준에서 컴파일러 옵션을 구성하고, 특정 타겟에 대해 타겟 수준에서 구성할 수 있습니다.

```kotlin
kotlin {
    compilerOptions {
        // 모든 타겟 및 공유 소스 세트의 기본값으로 사용되는 확장 수준의 공통 컴파일러 옵션
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // 이 타겟의 모든 컴파일에 대한 기본값으로 사용되는 타겟 수준 JVM 컴파일러 옵션
            noJdk.set(true)
        }
    }
}
```

전반적인 프로젝트 구성은 이제 세 가지 계층을 가집니다. 가장 높은 계층은 확장 수준이며, 다음은 타겟 수준이고 가장 낮은 계층은 컴파일 단위(일반적으로 컴파일 태스크)입니다.

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

더 높은 수준의 설정은 낮은 수준에 대한 관례(기본값)로 사용됩니다.

* 확장 컴파일러 옵션의 값은 `commonMain`, `nativeMain`, `commonTest`와 같은 공유 소스 세트를 포함한 타겟 컴파일러 옵션의 기본값입니다.
* 타겟 컴파일러 옵션의 값은 `compileKotlinJvm` 및 `compileTestKotlinJvm` 태스크와 같은 컴파일 단위(태스크) 컴파일러 옵션의 기본값으로 사용됩니다.

반대로, 낮은 수준에서 이루어진 구성은 높은 수준의 관련 설정을 재정의합니다.

* 태스크 수준 컴파일러 옵션은 타겟 또는 확장 수준의 관련 구성을 재정의합니다.
* 타겟 수준 컴파일러 옵션은 확장 수준의 관련 구성을 재정의합니다.

프로젝트를 구성할 때 컴파일러 옵션을 설정하는 일부 이전 방식이 [사용 중단](#deprecated-old-ways-of-defining-compiler-options)되었음을 명심하세요.

저희는 이 DSL을 컴파일러 옵션 구성의 권장 접근 방식으로 만들 계획이므로, 새로운 DSL을 멀티플랫폼 프로젝트에서 사용해 보고 [YouTrack](https://kotl.in/issue)에 피드백을 남겨주시면 감사하겠습니다.

### 새로운 Compose 컴파일러 Gradle 플러그인

컴포저블을 Kotlin 코드로 변환하는 Jetpack Compose 컴파일러는 이제 Kotlin 저장소로 병합되었습니다. 이는 Compose 컴파일러가 항상 Kotlin과 동시에 출시될 것이기 때문에 Compose 프로젝트를 Kotlin 2.0.0으로 전환하는 데 도움이 될 것입니다. 또한 Compose 컴파일러 버전을 2.0.0으로 상향 조정합니다.

프로젝트에서 새로운 Compose 컴파일러를 사용하려면 `build.gradle(.kts)` 파일에 `org.jetbrains.kotlin.plugin.compose` Gradle 플러그인을 적용하고 버전을 Kotlin 2.0.0과 동일하게 설정하세요.

이 변경 사항에 대해 자세히 알아보고 마이그레이션 지침을 보려면 [Compose 컴파일러](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html) 문서를 참조하세요.

### JVM 및 Android 게시 라이브러리를 구분하기 위한 새로운 속성

Kotlin 2.0.0부터 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) Gradle 속성이 모든 Kotlin 변형과 함께 기본적으로 게시됩니다.

이 속성은 Kotlin Multiplatform 라이브러리의 JVM 및 Android 변형을 구분하는 데 도움이 됩니다. 특정 라이브러리 변형이 특정 JVM 환경에 더 적합하다는 것을 나타냅니다. 대상 환경은 "android", "standard-jvm", 또는 "no-jvm"일 수 있습니다.

이 속성을 게시하면 JVM 및 Android 타겟을 가진 Kotlin Multiplatform 라이브러리를 Java 전용 프로젝트와 같은 비멀티플랫폼 클라이언트에서도 더 강력하게 사용할 수 있도록 해야 합니다.

필요한 경우 속성 게시를 비활성화할 수 있습니다. 이를 위해 `gradle.properties` 파일에 다음 Gradle 옵션을 추가하세요.

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### Kotlin/Native의 CInteropProcess에 대한 Gradle 종속성 처리 개선

이 릴리스에서는 Kotlin/Native 프로젝트에서 더 나은 Gradle 태스크 종속성 관리를 보장하기 위해 `defFile` 프로퍼티 처리를 개선했습니다.

이 업데이트 전에는 `defFile` 프로퍼티가 아직 실행되지 않은 다른 태스크의 출력으로 지정된 경우 Gradle 빌드가 실패할 수 있었습니다. 이 문제에 대한 해결책은 이 태스크에 종속성을 추가하는 것이었습니다.

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    defFileProperty.set(createDefFileTask.flatMap { it.defFile.asFile })
                    project.tasks.named(interopProcessingTaskName).configure {
                        dependsOn(createDefFileTask)
                    }
                }
            }
        }
    }
}
```

이를 해결하기 위해 `definitionFile`이라는 새로운 `RegularFileProperty` 프로퍼티가 있습니다. 이제 Gradle은 빌드 프로세스에서 연결된 태스크가 실행된 후에 `definitionFile` 프로퍼티의 존재 여부를 지연하여 검증합니다. 이 새로운 접근 방식은 추가 종속성의 필요성을 없애줍니다.

`CInteropProcess` 태스크와 `CInteropSettings` 클래스는 `defFile` 및 `defFileProperty` 대신 `definitionFile` 프로퍼티를 사용합니다.

<tabs group ="build-script">
<tab id="kotlin" title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
<tab id="groovy" title="Groovy" group-key="groovy">

```groovy
kotlin {
    macosArm64("native") {
        compilations.main {
            cinterops {
                cinterop {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
</tabs>

> `defFile` 및 `defFileProperty` 매개변수는 더 이상 사용되지 않습니다.
>
{style="warning"}

### Gradle의 가시성 변경 사항

> 이 변경 사항은 Kotlin DSL 사용자에게만 영향을 미칩니다.
>
{style="note"}

Kotlin 2.0.0에서 저희는 빌드 스크립트에서 더 나은 제어 및 안전성을 위해 Kotlin Gradle 플러그인을 수정했습니다. 이전에는 특정 DSL 컨텍스트를 위한 특정 Kotlin DSL 함수 및 프로퍼티가 의도치 않게 다른 DSL 컨텍스트로 유출되곤 했습니다. 이러한 유출은 잘못된 컴파일러 옵션 사용, 설정이 여러 번 적용되는 문제, 기타 잘못된 구성을 초래할 수 있었습니다.

```kotlin
kotlin {
    // 타겟 DSL은 kotlin{} 확장 DSL에 정의된 메서드 및 프로퍼티에 접근할 수 없었습니다.
    jvm {
        // 컴파일 DSL은 kotlin{} 확장 DSL 및 Kotlin jvm{} 타겟 DSL에 정의된 메서드 및 프로퍼티에 접근할 수 없었습니다.
        compilations.configureEach {
            // 컴파일 태스크 DSL은 kotlin{} 확장, Kotlin jvm{} 타겟 또는 Kotlin 컴파일 DSL에 정의된 메서드 및 프로퍼티에 접근할 수 없었습니다.
            compileTaskProvider.configure {
                // 예를 들어:
                explicitApi()
                // kotlin{} 확장 DSL에 정의되어 있으므로 오류 발생
                mavenPublication {}
                // Kotlin jvm{} 타겟 DSL에 정의되어 있으므로 오류 발생
                defaultSourceSet {}
                // Kotlin 컴파일 DSL에 정의되어 있으므로 오류 발생
            }
        }
    }
}
```

이 문제를 해결하기 위해 `@KotlinGradlePluginDsl` 어노테이션을 추가하여 Kotlin Gradle 플러그인 DSL 함수 및 프로퍼티가 의도되지 않은 수준으로 노출되는 것을 방지했습니다. 다음 수준들이 서로 분리됩니다.

* Kotlin 확장
* Kotlin 타겟
* Kotlin 컴파일
* Kotlin 컴파일 태스크

가장 일반적인 경우에 대해, 빌드 스크립트가 잘못 구성된 경우 수정 방법에 대한 제안과 함께 컴파일러 경고를 추가했습니다. 예를 들어:

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

이 경우 `sourceSets`에 대한 경고 메시지는 다음과 같습니다.

```none
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated. Consider configuring 'sourceSets' on the Kotlin extension level.
```

이 변경 사항에 대한 피드백을 주시면 감사하겠습니다! [#gradle Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)에서 Kotlin 개발자에게 직접 의견을 공유해주세요. [Slack 초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Gradle 프로젝트의 Kotlin 데이터 새 디렉토리

> `.kotlin` 디렉토리를 버전 관리에 커밋하지 마세요. 예를 들어, Git을 사용하는 경우 `.kotlin`을 프로젝트의 `.gitignore` 파일에 추가하세요.
>
{style="warning"}

Kotlin 1.8.20에서 Kotlin Gradle 플러그인은 Gradle 프로젝트 캐시 디렉토리인 `<project-root-directory>/.gradle/kotlin`에 데이터를 저장하도록 전환했습니다. 그러나 `.gradle` 디렉토리는 Gradle 전용으로 예약되어 있으므로 미래에 대비할 수 없습니다.

이 문제를 해결하기 위해 Kotlin 2.0.0부터는 기본적으로 `<project-root-directory>/.kotlin`에 Kotlin 데이터를 저장할 것입니다. 하위 호환성을 위해 `.gradle/kotlin` 디렉토리에 일부 데이터를 계속 저장할 것입니다.

구성할 수 있는 새로운 Gradle 속성은 다음과 같습니다.

| Gradle 속성                                     | 설명                                                                                                        |
|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 프로젝트 수준 데이터가 저장되는 위치를 구성합니다. 기본값: `<project-root-directory>/.kotlin`       |
| `kotlin.project.persistent.dir.gradle.disableWrite` | `.gradle` 디렉토리에 Kotlin 데이터를 쓰는 것을 비활성화할지 여부를 제어하는 부울 값입니다. 기본값: `false` |

이 속성들이 적용되도록 프로젝트의 `gradle.properties` 파일에 추가하세요.

### 필요할 때 다운로드되는 Kotlin/Native 컴파일러

Kotlin 2.0.0 이전에는 멀티플랫폼 프로젝트의 Gradle 빌드 스크립트에 [Kotlin/Native 타겟](native-target-support.md)이 구성되어 있었다면, Gradle은 항상 [구성 단계](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)에서 Kotlin/Native 컴파일러를 다운로드했습니다.

이는 [실행 단계](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)에서 실행될 Kotlin/Native 타겟을 위한 코드 컴파일 태스크가 없더라도 발생했습니다. 이러한 방식으로 Kotlin/Native 컴파일러를 다운로드하는 것은 프로젝트에서 JVM 또는 JavaScript 코드만 확인하려는 사용자에게는 특히 비효율적이었습니다. 예를 들어, CI 프로세스의 일부로 Kotlin 프로젝트로 테스트나 검사를 수행할 때.

Kotlin 2.0.0에서 저희는 Kotlin Gradle 플러그인의 이 동작을 변경하여 Kotlin/Native 컴파일러가 [실행 단계](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)에서 다운로드되고 Kotlin/Native 타겟에 대한 컴파일이 요청될 때에 **만** 다운로드되도록 했습니다.

결과적으로 Kotlin/Native 컴파일러의 종속성도 이제 컴파일러의 일부가 아닌 실행 단계에서 다운로드됩니다.

새로운 동작에 문제가 발생하면 `gradle.properties` 파일에 다음 Gradle 속성을 추가하여 일시적으로 이전 동작으로 되돌릴 수 있습니다.

```none
kotlin.native.toolchain.enabled=false
```

Kotlin 1.9.20-Beta부터 Kotlin/Native 배포는 CDN과 함께 [Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/)에 게시됩니다.

이를 통해 Kotlin이 필요한 아티팩트를 찾고 다운로드하는 방식을 변경할 수 있었습니다. CDN 대신 기본적으로 프로젝트의 `repositories {}` 블록에 지정한 Maven 리포지토리를 사용합니다.

`gradle.properties` 파일에 다음 Gradle 속성을 설정하여 이 동작을 일시적으로 되돌릴 수 있습니다.

```none
kotlin.native.distribution.downloadFromMaven=false
```

[YouTrack](https://kotl.in/issue) 이슈 트래커에 문제점을 보고해주세요. 기본 동작을 변경하는 이 두 Gradle 속성은 임시적이며 향후 릴리스에서 제거될 것입니다.

### 컴파일러 옵션 정의의 이전 방식 사용 중단

이 릴리스에서는 컴파일러 옵션을 설정하는 방법을 계속해서 개선하고 있습니다. 이는 다양한 방식 간의 모호성을 해결하고 프로젝트 구성을 더 간단하게 만들 것입니다.

Kotlin 2.0.0부터 컴파일러 옵션을 지정하기 위한 다음 DSL은 더 이상 사용되지 않습니다.

* 모든 Kotlin 컴파일 태스크를 구현하는 `KotlinCompile` 인터페이스의 `kotlinOptions` DSL. 대신 `KotlinCompilationTask<CompilerOptions>`를 사용하세요.
* `KotlinCompilation` 인터페이스의 `HasCompilerOptions` 타입 `compilerOptions` 프로퍼티. 이 DSL은 다른 DSL과 일관성이 없었고 `KotlinCompilation.compileTaskProvider` 컴파일 태스크 내부의 `compilerOptions`와 동일한 `KotlinCommonCompilerOptions` 객체를 구성하여 혼란스러웠습니다.

  대신 Kotlin 컴파일 태스크의 `compilerOptions` 프로퍼티를 사용하는 것을 권장합니다.

  ```kotlin
  kotlinCompilation.compileTaskProvider.configure {
      compilerOptions { ... }
  }
  ```

  예를 들어:

  ```kotlin
  kotlin {
      js(IR) {
          compilations.all {
              compileTaskProvider.configure {
                  compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
              }
          }
      }
  }
  ```

* `KotlinCompilation` 인터페이스의 `kotlinOptions` DSL.
* `KotlinNativeArtifactConfig` 인터페이스, `KotlinNativeLink` 클래스 및 `KotlinNativeLinkArtifactTask` 클래스의 `kotlinOptions` DSL. 대신 `toolOptions` DSL을 사용하세요.
* `KotlinJsDce` 인터페이스의 `dceOptions` DSL. 대신 `toolOptions` DSL을 사용하세요.

Kotlin Gradle 플러그인에서 컴파일러 옵션을 지정하는 방법에 대한 자세한 내용은 [옵션 정의 방법](gradle-compiler-options.md#how-to-define-options)을 참조하세요.

### 최소 지원 AGP 버전 상향

Kotlin 2.0.0부터 최소 지원 Android Gradle 플러그인 버전은 7.1.3입니다.

### 최신 언어 버전을 시도하기 위한 새로운 Gradle 속성

Kotlin 2.0.0 이전에는 새로운 K2 컴파일러를 시도하기 위한 다음 Gradle 속성인 `kotlin.experimental.tryK2`가 있었습니다. 이제 K2 컴파일러가 Kotlin 2.0.0에서 기본적으로 활성화되었으므로, 최신 언어 버전을 시도하는 데 사용할 수 있는 새로운 형태로 이 속성을 발전시키기로 결정했습니다: `kotlin.experimental.tryNext`. `gradle.properties` 파일에 이 속성을 사용하면 Kotlin Gradle 플러그인은 언어 버전을 Kotlin 버전의 기본값보다 하나 높은 값으로 증가시킵니다. 예를 들어, Kotlin 2.0.0에서 기본 언어 버전은 2.0이므로, 이 속성은 언어 버전 2.1을 구성합니다.

이 새로운 Gradle 속성은 `kotlin.experimental.tryK2`를 사용했을 때와 동일한 [빌드 보고서](gradle-compilation-and-caches.md#build-reports)의 메트릭을 생성합니다. 구성된 언어 버전이 출력에 포함됩니다. 예를 들어:

```none
##### 'kotlin.experimental.tryNext' results #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.1 #####
```

빌드 보고서를 활성화하는 방법과 내용에 대해 자세히 알아보려면 [빌드 보고서](gradle-compilation-and-caches.md#build-reports)를 참조하세요.

### 빌드 보고서를 위한 새로운 JSON 출력 형식

Kotlin 1.7.0에서 저희는 컴파일러 성능을 추적하는 데 도움이 되는 빌드 보고서를 도입했습니다. 시간이 지남에 따라 성능 문제를 조사할 때 이 보고서들을 훨씬 더 상세하고 유용하게 만들기 위해 더 많은 메트릭을 추가했습니다. 이전에는 로컬 파일의 유일한 출력 형식은 `*.txt` 형식이었습니다. Kotlin 2.0.0에서는 다른 도구를 사용하여 분석하기 더 쉽도록 JSON 출력 형식을 지원합니다.

빌드 보고서의 JSON 출력 형식을 구성하려면 `gradle.properties` 파일에 다음 속성을 선언하세요.

```none
kotlin.build.report.output=json

// 빌드 보고서를 저장할 디렉토리
kotlin.build.report.json.directory=my/directory/path
```

또는 다음 명령어를 실행할 수 있습니다.

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
``` 

다음은 빌드 메트릭과 집계된 메트릭을 포함하는 JSON 출력 형식의 빌드 보고서 예시 스니펫입니다.

```json
"buildOperationRecord": [
    {
     "path": ":lib:compileKotlin",
      "classFqName": "org.jetbrains.kotlin.gradle.tasks.KotlinCompile_Decorated",
      "startTimeMs": 1714730820601,
      "totalTimeMs": 2724,
      "buildMetrics": {
        "buildTimes": {
          "buildTimesNs": {
            "CLEAR_OUTPUT": 713417,
            "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 19699333,
            "IR_TRANSLATION": 281000000,
            "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14088042,
            "CALCULATE_OUTPUT_SIZE": 1301500,
            "GRADLE_TASK": 2724000000,
            "COMPILER_INITIALIZATION": 263000000,
            "IR_GENERATION": 74000000,
...
          }
        }
...
 "aggregatedMetrics": {
    "buildTimes": {
      "buildTimesNs": {
        "CLEAR_OUTPUT": 782667,
        "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 22031833,
        "IR_TRANSLATION": 333000000,
        "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14890292,
        "CALCULATE_OUTPUT_SIZE": 2370750,
        "GRADLE_TASK": 3234000000,
        "COMPILER_INITIALIZATION": 292000000,
        "IR_GENERATION": 89000000,
...
      }
    }
```

### `kapt` 설정이 상위 설정으로부터 어노테이션 프로세서를 상속

Kotlin 2.0.0 이전에는 별도의 Gradle 설정에서 공통 어노테이션 프로세서 세트를 정의하고 이를 하위 프로젝트의 `kapt`별 설정에서 확장하고 싶다면, `kapt`는 어노테이션 프로세서를 찾을 수 없어 어노테이션 처리를 건너뛰었습니다. Kotlin 2.0.0에서는 `kapt`는 어노테이션 프로세서에 대한 간접 종속성이 있음을 성공적으로 감지할 수 있습니다.

예를 들어, [Dagger](https://dagger.dev/)를 사용하는 하위 프로젝트의 경우 `build.gradle(.kts)` 파일에 다음 구성을 사용하세요.

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

이 예에서 `commonAnnotationProcessors` Gradle 설정은 모든 프로젝트에 사용하려는 어노테이션 처리를 위한 공통 설정입니다. [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 메서드를 사용하여 `commonAnnotationProcessors`를 상위 설정으로 추가합니다. `kapt`는 `commonAnnotationProcessors` Gradle 설정이 Dagger 어노테이션 프로세서에 대한 종속성을 가지고 있음을 확인합니다. 따라서 `kapt`는 Dagger 어노테이션 프로세서를 어노테이션 처리를 위한 설정에 포함합니다.

[구현](https://github.com/JetBrains/kotlin/pull/5198)을 제공해 주신 Christoph Loy께 감사드립니다!

### Kotlin Gradle 플러그인이 더 이상 사용되지 않는 Gradle 컨벤션 사용 안 함

Kotlin 2.0.0 이전에는 Gradle 8.2 이상을 사용했다면, Kotlin Gradle 플러그인은 Gradle 8.2에서 사용 중단된 Gradle 컨벤션을 잘못 사용했습니다. 이로 인해 Gradle이 빌드 사용 중단 경고를 보고했습니다. Kotlin 2.0.0에서는 Kotlin Gradle 플러그인이 Gradle 8.2 이상을 사용할 때 이러한 사용 중단 경고가 더 이상 발생하지 않도록 업데이트되었습니다.

## 표준 라이브러리

이 릴리스는 Kotlin 표준 라이브러리에 추가적인 안정성을 제공하며, 기존 함수 중 더 많은 함수를 모든 플랫폼에서 공통으로 사용할 수 있도록 합니다.

* [enum 클래스 `values` 제네릭 함수에 대한 안정적인 대체 기능](#stable-replacement-of-the-enum-class-values-generic-function)
* [안정적인 `AutoCloseable` 인터페이스](#stable-autocloseable-interface)
* [공통 protected 프로퍼티 `AbstractMutableList.modCount`](#common-protected-property-abstractmutablelist-modcount)
* [공통 protected 함수 `AbstractMutableList.removeRange`](#common-protected-function-abstractmutablelist-removerange)
* [공통 `String.toCharArray(destination)` 함수](#common-string-tochararray-destination-function)

### enum 클래스 `values` 제네릭 함수에 대한 안정적인 대체 기능

Kotlin 2.0.0에서 `enumEntries<T>()` 함수는 [안정화](components-stability.md#stability-levels-explained)되었습니다. `enumEntries<T>()` 함수는 제네릭 `enumValues<T>()` 함수를 대체하는 기능입니다. 이 새로운 함수는 주어진 enum 타입 `T`에 대한 모든 enum 엔트리 목록을 반환합니다. enum 클래스의 `entries` 프로퍼티는 이전에 도입되었으며, 합성 `values()` 함수를 대체하기 위해 안정화되었습니다. `entries` 프로퍼티에 대한 자세한 내용은 [Kotlin 1.8.20의 새로운 기능](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)을 참조하세요.

> `enumValues<T>()` 함수는 여전히 지원되지만, 성능에 미치는 영향이 적으므로 `enumEntries<T>()` 함수를 대신 사용하는 것을 권장합니다. `enumValues<T>()`를 호출할 때마다 새 배열이 생성되는 반면, `enumEntries<T>()`를 호출할 때마다 동일한 목록이 반환되므로 훨씬 효율적입니다.
>
{style="tip"}

예를 들어:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

### 안정적인 `AutoCloseable` 인터페이스

Kotlin 2.0.0에서 공통 [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 인터페이스는 [안정화](components-stability.md#stability-levels-explained)되었습니다. 이는 리소스를 쉽게 닫을 수 있게 해주며 몇 가지 유용한 함수를 포함합니다.

* 선택된 리소스에 대해 주어진 블록 함수를 실행한 다음, 예외 발생 여부와 관계없이 올바르게 닫는 `use()` 확장 함수.
* `AutoCloseable` 인터페이스의 인스턴스를 생성하는 `AutoCloseable()` 생성자 함수.

아래 예에서는 `XMLWriter` 인터페이스를 정의하고 이를 구현하는 리소스가 있다고 가정합니다. 예를 들어, 이 리소스는 파일을 열고, XML 콘텐츠를 작성한 다음, 파일을 닫는 클래스일 수 있습니다.

```kotlin
interface XMLWriter {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)

    fun flushAndClose()
}

fun writeBooksTo(writer: XMLWriter) {
    val autoCloseable = AutoCloseable { writer.flushAndClose() }
    autoCloseable.use {
        writer.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```

### 공통 protected 프로퍼티 `AbstractMutableList.modCount`

이 릴리스에서 `AbstractMutableList` 인터페이스의 [`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html) `protected` 프로퍼티가 공통(`common`)이 되었습니다. 이전에는 `modCount` 프로퍼티는 각 플랫폼에서 사용할 수 있었지만 공통 타겟에서는 사용할 수 없었습니다. 이제 `AbstractMutableList`의 사용자 지정 구현을 생성하고 공통 코드에서 해당 프로퍼티에 접근할 수 있습니다.

이 프로퍼티는 컬렉션에 가해진 구조적 수정 횟수를 추적합니다. 이는 컬렉션 크기를 변경하거나 진행 중인 반복이 잘못된 결과를 반환할 수 있는 방식으로 목록을 변경하는 작업을 포함합니다.

`modCount` 속성을 사용하여 사용자 지정 목록을 구현할 때 동시 수정을 등록하고 감지할 수 있습니다.

### 공통 protected 함수 `AbstractMutableList.removeRange`

이 릴리스에서 `AbstractMutableList` 인터페이스의 [`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html) `protected` 함수가 공통(`common`)이 되었습니다. 이전에는 각 플랫폼에서 사용할 수 있었지만 공통 타겟에서는 사용할 수 없었습니다. 이제 `AbstractMutableList`의 사용자 지정 구현을 생성하고 공통 코드에서 해당 함수를 오버라이드할 수 있습니다.

이 함수는 지정된 범위에 따라 이 목록에서 요소를 제거합니다. 이 함수를 오버라이드함으로써 사용자 지정 구현을 활용하고 목록 작업의 성능을 향상시킬 수 있습니다.

### 공통 `String.toCharArray(destination)` 함수

이 릴리스는 공통 [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 함수를 도입합니다. 이전에는 JVM에서만 사용할 수 있었습니다.

기존 [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 함수와 비교해 봅시다. 기존 함수는 지정된 문자열의 문자를 포함하는 새로운 `CharArray`를 생성합니다. 그러나 새로운 공통 `String.toCharArray(destination)` 함수는 문자열 문자를 기존 대상 `CharArray`로 이동시킵니다. 이는 채우려는 버퍼가 이미 있는 경우 유용합니다.

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // 문자열을 변환하여 destinationArray에 저장합니다:
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e ! 
    }
}
```
{kotlin-runnable="true"}

## Kotlin 2.0.0 설치

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 번들로 포함된 플러그인으로 배포됩니다. 이는 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없음을 의미합니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전](releases.md#update-to-a-new-kotlin-version)을 2.0.0으로 변경하세요.