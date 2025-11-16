[//]: # (title: Kotlin 2.0.0의 새로운 기능)

_[릴리스: 2024년 5월 21일](releases.md#release-details)_

Kotlin 2.0.0 릴리스가 공개되었으며, [새로운 Kotlin K2 컴파일러](#kotlin-k2-compiler)가 안정화되었습니다! 또한 다음과 같은 주요 개선 사항들이 있습니다.

*   [새로운 Compose 컴파일러 Gradle 플러그인](#new-compose-compiler-gradle-plugin)
*   [invokedynamic을 사용한 람다 함수 생성](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 라이브러리가 이제 안정화되었습니다](#the-kotlinx-metadata-jvm-library-is-stable)
*   [Apple 플랫폼에서 사인포스트를 사용한 Kotlin/Native의 GC 성능 모니터링](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [Kotlin/Native에서 Objective-C 메서드와의 충돌 해결](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Wasm에서 명명된 내보내기(named export) 지원](#support-for-named-export)
*   [Kotlin/Wasm에서 `@JsExport`가 적용된 함수 내 부호 없는 기본형 타입 지원](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [Binaryen을 사용한 프로덕션 빌드 기본 최적화](#optimized-production-builds-by-default-using-binaryen)
*   [멀티플랫폼 프로젝트 컴파일러 옵션을 위한 새로운 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [enum class values 제네릭 함수의 안정화된 대체](#stable-replacement-of-the-enum-class-values-generic-function)
*   [안정화된 AutoCloseable 인터페이스](#stable-autocloseable-interface)

Kotlin 2.0은 JetBrains 팀에게 있어 거대한 이정표입니다. 이번 릴리스는 KotlinConf 2024의 중심 주제였습니다. Kotlin 언어에 대한 흥미로운 업데이트와 최근 작업을 발표한 오프닝 기조연설을 확인해 보세요.

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 지원

Kotlin 2.0.0을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다. IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다. 빌드 스크립트에서 [Kotlin 버전을 Kotlin 2.0.0으로 변경](releases.md#update-to-a-new-kotlin-version)하기만 하면 됩니다.

*   IntelliJ IDEA의 Kotlin K2 컴파일러 지원에 대한 자세한 내용은 [IDE 지원](#support-in-ides)을 참조하세요.
*   IntelliJ IDEA의 Kotlin 지원에 대한 자세한 내용은 [Kotlin 릴리스](releases.md#ide-support)를 참조하세요.

## Kotlin K2 컴파일러

K2 컴파일러로 향하는 길은 길었지만, 이제 JetBrains 팀은 마침내 K2 컴파일러의 안정화를 발표할 준비가 되었습니다. Kotlin 2.0.0에서는 새로운 Kotlin K2 컴파일러가 기본적으로 사용되며, 모든 대상 플랫폼(JVM, Native, Wasm, JS)에서 [안정적](components-stability.md)입니다. 새로운 컴파일러는 주요 성능 개선을 가져오고, 새로운 언어 기능 개발 속도를 높이며, Kotlin이 지원하는 모든 플랫폼을 통합하고, 멀티플랫폼 프로젝트를 위한 더 나은 아키텍처를 제공합니다.

JetBrains 팀은 선택된 사용자 및 내부 프로젝트에서 1천만 줄의 코드를 성공적으로 컴파일하여 새로운 컴파일러의 품질을 보증했습니다. 총 18,000명의 개발자가 안정화 과정에 참여하여 총 80,000개의 프로젝트에서 새로운 K2 컴파일러를 테스트하고 발견된 문제를 보고했습니다.

새로운 컴파일러로의 마이그레이션 과정을 최대한 원활하게 진행할 수 있도록, [K2 컴파일러 마이그레이션 가이드](k2-compiler-migration-guide.md)를 만들었습니다. 이 가이드는 컴파일러의 많은 이점을 설명하고, 발생할 수 있는 변경 사항을 강조하며, 필요한 경우 이전 버전으로 되돌리는 방법을 설명합니다.

[블로그 게시물](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)에서 다양한 프로젝트에서 K2 컴파일러의 성능을 탐구했습니다. K2 컴파일러의 실제 성능 데이터를 확인하고 자신의 프로젝트에서 성능 벤치마크를 수집하는 방법을 알아보려면 이 게시물을 확인하세요.

또한 KotlinConf 2024에서 언어 수석 디자이너인 Michail Zarečenskij가 Kotlin의 기능 발전과 K2 컴파일러에 대해 논의하는 강연을 시청할 수 있습니다.

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 현재 K2 컴파일러 제한 사항

Gradle 프로젝트에서 K2를 활성화하면 특정 제한 사항이 발생하며, 이는 다음 경우에 Gradle 8.3 미만 버전을 사용하는 프로젝트에 영향을 줄 수 있습니다.

*   `buildSrc`의 소스 코드 컴파일.
*   포함된 빌드(included builds) 내 Gradle 플러그인 컴파일.
*   Gradle 8.3 미만 버전을 사용하는 프로젝트에서 다른 Gradle 플러그인이 사용되는 경우 해당 플러그인 컴파일.
*   Gradle 플러그인 종속성 빌드.

위에 언급된 문제 중 하나라도 발생하는 경우, 다음 단계를 따라 해결할 수 있습니다.

*   `buildSrc`, 모든 Gradle 플러그인 및 해당 종속성에 대한 언어 버전을 설정합니다.

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 특정 태스크에 대해 언어 및 API 버전을 구성하는 경우, 이 값들은 `compilerOptions` 확장에 의해 설정된 값을 재정의합니다. 이 경우 언어 및 API 버전은 1.9보다 높아서는 안 됩니다.
  >
  {style="note"}

*   프로젝트의 Gradle 버전을 8.3 이상으로 업데이트합니다.

### 스마트 캐스트 개선 사항

Kotlin 컴파일러는 특정 경우에 객체를 타입으로 자동으로 캐스트하여, 직접 명시적으로 캐스트해야 하는 번거로움을 덜어줍니다. 이를 [스마트 캐스팅](typecasts.md#smart-casts)이라고 합니다. Kotlin K2 컴파일러는 이제 이전보다 훨씬 더 많은 시나리오에서 스마트 캐스트를 수행합니다.

Kotlin 2.0.0에서는 다음 영역에서 스마트 캐스트 관련 개선 사항을 적용했습니다.

*   [지역 변수 및 추가 범위](#local-variables-and-further-scopes)
*   [논리 `or` 연산자를 사용한 타입 검사](#type-checks-with-logical-or-operator)
*   [인라인 함수](#inline-functions)
*   [함수 타입을 가진 프로퍼티](#properties-with-function-types)
*   [예외 처리](#exception-handling)
*   [증감 연산자](#increment-and-decrement-operators)

#### 지역 변수 및 추가 범위

이전에는 변수가 `if` 조건 내에서 `null`이 아닌 것으로 평가되면, 해당 변수는 스마트 캐스트되었습니다. 이 변수에 대한 정보는 `if` 블록의 범위 내에서 추가로 공유되었습니다.

그러나 `if` 조건 **외부**에 변수를 선언한 경우, `if` 조건 내에서는 변수에 대한 정보가 없어 스마트 캐스트될 수 없었습니다. 이러한 동작은 `when` 표현식 및 `while` 루프에서도 동일하게 나타났습니다.

Kotlin 2.0.0부터는 `if`, `when` 또는 `while` 조건에서 변수를 사용하기 전에 선언하면, 컴파일러가 해당 변수에 대해 수집한 모든 정보가 스마트 캐스팅을 위해 해당 블록에서 접근 가능합니다.

이는 불리언 조건을 변수로 추출하는 것과 같은 작업을 수행할 때 유용할 수 있습니다. 이렇게 하면 변수에 의미 있는 이름을 부여하여 코드 가독성을 높이고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들어:

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
        // animal이 Cat 타입으로 스마트 캐스트되었음을 압니다.
        // 따라서 purr() 함수를 호출할 수 있습니다.
        // Kotlin 1.9.20에서는 컴파일러가
        // 스마트 캐스트를 알지 못하므로
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 논리 or 연산자를 사용한 타입 검사

Kotlin 2.0.0에서는 `or` 연산자 (`||`)를 사용하여 객체에 대한 타입 검사를 결합하면, 가장 가까운 공통 상위 타입으로 스마트 캐스트가 수행됩니다. 이 변경 이전에는 스마트 캐스트가 항상 `Any` 타입으로 수행되었습니다.

이 경우, 여전히 객체의 속성에 접근하거나 함수를 호출하기 전에 객체 타입을 수동으로 확인해야 했습니다. 예를 들어:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus는 공통 상위 타입 Status로 스마트 캐스트됩니다.
        signalStatus.signal()
        // Kotlin 2.0.0 이전에는 signalStatus가 
        // Any 타입으로 스마트 캐스트되어 signal() 함수 호출 시
        // Unresolved reference 오류가 발생했습니다. signal() 함수는
        // 다른 타입 검사 후에야 성공적으로 호출될 수 있었습니다.

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 공통 상위 타입은 유니온 타입의 **근사치**입니다. [유니온 타입](https://en.wikipedia.org/wiki/Union_type)은 Kotlin에서 지원되지 않습니다.
>
{style="note"}

#### 인라인 함수

Kotlin 2.0.0에서는 K2 컴파일러가 인라인 함수를 다르게 처리하여, 다른 컴파일러 분석과 결합하여 스마트 캐스트가 안전한지 여부를 결정할 수 있습니다.

특히, 인라인 함수는 이제 암시적 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 가진 것으로 처리됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 제자리에서 호출됨을 의미합니다. 람다 함수가 제자리에서 호출되므로, 컴파일러는 람다 함수가 해당 함수 본문에 포함된 변수에 대한 참조를 누출할 수 없음을 압니다.

컴파일러는 이 지식과 다른 컴파일러 분석을 사용하여 캡처된 변수 중 어떤 것이 스마트 캐스트하기에 안전한지 결정합니다. 예를 들어:

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
        // 지역 변수이며 inlineAction()이 인라인 함수임을 압니다.
        // 따라서 processor에 대한 참조가 누출될 수 없습니다.
        // 따라서 processor를 스마트 캐스트하는 것이 안전합니다.

        // processor가 null이 아니면 processor는 스마트 캐스트됩니다.
        if (processor != null) {
            // 컴파일러는 processor가 null이 아님을 알기 때문에
            // 안전 호출이 필요하지 않습니다.
            processor.process()

            // Kotlin 1.9.20에서는 안전 호출을 수행해야 했습니다.
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 함수 타입을 가진 프로퍼티

이전 Kotlin 버전에서는 함수 타입을 가진 클래스 프로퍼티가 스마트 캐스트되지 않는 버그가 있었습니다. Kotlin 2.0.0 및 K2 컴파일러에서는 이 동작을 수정했습니다. 예를 들어:

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // Kotlin 2.0.0에서는 provider가 null이 아니면
        // provider가 스마트 캐스트됩니다.
        if (provider != null) {
            // 컴파일러는 provider가 null이 아님을 압니다.
            provider()

            // 1.9.20에서는 컴파일러가 provider가 null이 아님을
            // 알지 못하므로 오류가 발생합니다.
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
            // 1.9.20에서는 컴파일러가 오류를 발생시켰습니다.
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 예외 처리

Kotlin 2.0.0에서는 예외 처리에 대한 개선 사항을 적용하여 스마트 캐스트 정보가 `catch` 및 `finally` 블록으로 전달될 수 있도록 했습니다. 이 변경 사항은 컴파일러가 객체가 nullable 타입인지 여부를 추적하므로 코드를 더 안전하게 만듭니다. 예를 들어:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput은 String 타입으로 스마트 캐스트됩니다.
    stringInput = ""
    try {
        // 컴파일러는 stringInput이 null이 아님을 압니다.
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
        // null일 수 있음을 알기 때문에 stringInput은 계속 nullable입니다.
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20에서는 컴파일러가 안전 호출이
        // 필요 없다고 말했지만, 이는 올바르지 않았습니다.
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 증감 연산자

Kotlin 2.0.0 이전에는 컴파일러가 증감 연산자를 사용한 후 객체 타입이 변경될 수 있음을 이해하지 못했습니다. 컴파일러가 객체 타입을 정확하게 추적할 수 없었기 때문에 코드에서 미해결 참조 오류가 발생할 수 있었습니다. Kotlin 2.0.0에서는 이 문제가 수정되었습니다.

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
    // 참고로, unknownObject가 Rho와 Tau 인터페이스를 모두 상속할 수도 있습니다.
    if (unknownObject is Tau) {

        // Rho 인터페이스의 오버로드된 inc() 연산자를 사용합니다.
        // Kotlin 2.0.0에서는 unknownObject의 타입이 Sigma로 스마트 캐스트됩니다.
        ++unknownObject

        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입임을
        // 알기 때문에 sigma() 함수를 성공적으로 호출할 수 있습니다.
        unknownObject.sigma()

        // Kotlin 1.9.20에서는 inc()가 호출될 때 컴파일러가 스마트 캐스트를
        // 수행하지 않아 컴파일러는 unknownObject가 여전히 Tau 타입이라고
        // 생각했습니다. sigma() 함수를 호출하면 컴파일 시간 오류가 발생했습니다.
        
        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입임을
        // 알기 때문에 tau() 함수를 호출하면 컴파일 시간 오류가 발생합니다.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // Kotlin 1.9.20에서는 컴파일러가 unknownObject가 Tau 타입이라고
        // 잘못 생각했기 때문에 tau() 함수를 호출할 수 있었지만,
        // ClassCastException이 발생했습니다.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform 개선 사항

Kotlin 2.0.0에서는 K2 컴파일러와 관련하여 Kotlin Multiplatform의 다음 영역에서 개선 사항을 적용했습니다.

*   [컴파일 중 공통 및 플랫폼 소스 분리](#separation-of-common-and-platform-sources-during-compilation)
*   [expected 및 actual 선언의 다른 가시성 수준](#different-visibility-levels-of-expected-and-actual-declarations)

#### 컴파일 중 공통 및 플랫폼 소스 분리

이전에는 Kotlin 컴파일러의 설계로 인해 컴파일 시점에 공통 및 플랫폼 소스 세트를 분리할 수 없었습니다. 그 결과, 공통 코드가 플랫폼 코드에 접근하여 플랫폼 간에 다른 동작을 초래했습니다. 또한, 공통 코드의 일부 컴파일러 설정 및 종속성이 플랫폼 코드로 누출되곤 했습니다.

Kotlin 2.0.0에서는 새로운 Kotlin K2 컴파일러 구현에 컴파일 스키마를 재설계하여 공통 및 플랫폼 소스 세트 간의 엄격한 분리를 보장했습니다. 이 변경 사항은 [expected 및 actual 함수](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-functions)를 사용할 때 가장 두드러집니다. 이전에는 공통 코드의 함수 호출이 플랫폼 코드의 함수로 해결될 수 있었습니다. 예를 들어:

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

이 예시에서 공통 코드는 실행되는 플랫폼에 따라 다른 동작을 보입니다.

*   JVM 플랫폼에서 공통 코드의 `foo()` 함수를 호출하면 플랫폼 코드의 `foo()` 함수가 `platform foo`로 호출됩니다.
*   JavaScript 플랫폼에서 공통 코드의 `foo()` 함수를 호출하면 플랫폼 코드에 해당 함수가 없으므로 공통 코드의 `foo()` 함수가 `common foo`로 호출됩니다.

Kotlin 2.0.0에서는 공통 코드가 플랫폼 코드에 접근할 수 없으므로, 두 플랫폼 모두 `foo()` 함수를 공통 코드의 `foo()` 함수(`common foo`)로 성공적으로 해결합니다.

플랫폼 전반에 걸친 동작의 일관성 향상 외에도, IntelliJ IDEA 또는 Android Studio와 컴파일러 간에 동작이 충돌하는 경우를 수정하기 위해 노력했습니다. 예를 들어, [expected 및 actual 클래스](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-classes)를 사용했을 때 다음과 같은 일이 발생했습니다.

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
    // IDE에서만 오류를 발생시켰습니다.
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

이 예시에서 expected 클래스 `Identity`에는 기본 생성자가 없어 공통 코드에서 성공적으로 호출될 수 없습니다. 이전에는 오류가 IDE에서만 보고되었지만, 코드는 JVM에서 여전히 성공적으로 컴파일되었습니다. 그러나 이제 컴파일러는 올바르게 오류를 보고합니다.

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 해상도 동작이 변경되지 않는 경우

새로운 컴파일 스키마로 마이그레이션하는 과정에 있으며, 동일한 소스 세트 내에 없는 함수를 호출할 때 해상도 동작은 여전히 동일합니다. 이 차이는 주로 공통 코드에서 멀티플랫폼 라이브러리의 오버로드를 사용할 때 두드러집니다.

서명이 다른 두 개의 `whichFun()` 함수를 가진 라이브러리가 있다고 가정해 봅시다.

```kotlin
// 예시 라이브러리

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

공통 코드에서 `whichFun()` 함수를 호출하면, 라이브러리에서 가장 관련성 높은 인자 타입을 가진 함수가 해결됩니다.

```kotlin
// JVM 타겟을 위한 예시 라이브러리를 사용하는 프로젝트

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

이에 비해, 동일한 소스 세트 내에서 `whichFun()`에 대한 오버로드를 선언하는 경우, 코드가 플랫폼별 버전에 접근할 수 없으므로 공통 코드의 함수가 해결됩니다.

```kotlin
// 예시 라이브러리가 사용되지 않음

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

멀티플랫폼 라이브러리와 유사하게, `commonTest` 모듈은 별도의 소스 세트에 있으므로 여전히 플랫폼별 코드에 접근할 수 있습니다. 따라서 `commonTest` 모듈의 함수 호출 해상도는 이전 컴파일 스키마와 동일한 동작을 보입니다.

향후에는 이러한 나머지 경우들이 새로운 컴파일 스키마와 더 일관되게 될 것입니다.

#### expected 및 actual 선언의 다른 가시성 수준

Kotlin 2.0.0 이전에는 Kotlin Multiplatform 프로젝트에서 [expected 및 actual 선언](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)을 사용하면 동일한 [가시성 수준](visibility-modifiers.md)을 가져야 했습니다. Kotlin 2.0.0은 이제 다른 가시성 수준도 지원하지만, 실제 선언이 예상 선언보다 _더_ 관대할 때만 가능합니다. 예를 들어:

```kotlin
expect internal class Attribute // 가시성은 internal
actual class Attribute          // 가시성은 기본적으로 public이며,
                                // 이는 더 관대합니다.
```

마찬가지로, 실제 선언에서 [타입 별칭](type-aliases.md)을 사용하는 경우, **기본 타입**의 가시성이 예상 선언과 같거나 더 관대해야 합니다. 예를 들어:

```kotlin
expect internal class Attribute                 // 가시성은 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 가시성은 기본적으로 public이며,
                                                // 이는 더 관대합니다.
```

### 컴파일러 플러그인 지원

현재 Kotlin K2 컴파일러는 다음 Kotlin 컴파일러 플러그인을 지원합니다.

*   [`all-open`](all-open-plugin.md)
*   [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
*   [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
*   [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
*   [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
*   [Lombok](lombok.md)
*   [`no-arg`](no-arg-plugin.md)
*   [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
*   [SAM with receiver](sam-with-receiver-plugin.md)
*   [serialization](serialization.md)
*   [Power-assert](power-assert.md)

또한 Kotlin K2 컴파일러는 다음을 지원합니다.

*   [Kotlin 리포지토리로 이전된](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html) Jetpack Compose 컴파일러 플러그인 2.0.0.
*   [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 이후의 [Kotlin Symbol Processing (KSP) 플러그인](ksp-overview.md).

> 추가 컴파일러 플러그인을 사용하는 경우, K2와 호환되는지 여부를 해당 문서에서 확인하세요.
>
{style="tip"}

### 실험 단계 Kotlin Power-assert 컴파일러 플러그인

> Kotlin Power-assert 플러그인은 [실험 단계](components-stability.md#stability-levels-explained)입니다. 언제든지 변경될 수 있습니다.
>
{style="warning"}

Kotlin 2.0.0은 실험 단계 Power-assert 컴파일러 플러그인을 도입합니다. 이 플러그인은 실패 메시지에 문맥 정보를 포함시켜 테스트 작성 경험을 향상시키며, 디버깅을 더 쉽고 효율적으로 만듭니다.

개발자는 효과적인 테스트를 작성하기 위해 종종 복잡한 어설션 라이브러리를 사용해야 합니다. Power-assert 플러그인은 어설션 표현식의 중간 값을 포함하는 실패 메시지를 자동으로 생성하여 이 과정을 간소화합니다. 이는 개발자가 테스트가 실패한 이유를 신속하게 이해하는 데 도움이 됩니다.

테스트에서 어설션이 실패하면 개선된 오류 메시지는 어설션 내의 모든 변수와 하위 표현식의 값을 보여주어, 조건의 어느 부분이 실패를 유발했는지 명확하게 해줍니다. 이는 여러 조건이 확인되는 복잡한 어설션에 특히 유용합니다.

프로젝트에서 플러그인을 활성화하려면 `build.gradle(.kts)` 파일에서 다음과 같이 구성하세요.

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

[문서에서 Kotlin Power-assert 플러그인에 대해 자세히 알아보세요](power-assert.md).

### Kotlin K2 컴파일러 활성화 방법

Kotlin 2.0.0부터 Kotlin K2 컴파일러는 기본적으로 활성화됩니다. 추가적인 조치는 필요하지 않습니다.

### Kotlin Playground에서 Kotlin K2 컴파일러 사용해보기

Kotlin Playground는 2.0.0 릴리스를 지원합니다. [지금 확인해 보세요!](https://pl.kotl.in/czuoQprce)

### IDE 지원

기본적으로 IntelliJ IDEA 및 Android Studio는 코드 분석, 코드 자동 완성, 하이라이팅 및 기타 IDE 관련 기능에 이전 컴파일러를 계속 사용합니다. IDE에서 완벽한 Kotlin 2.0 경험을 얻으려면 K2 모드를 활성화하세요.

IDE에서 **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동하여 **Enable K2 mode** 옵션을 선택하세요. IDE는 K2 모드를 사용하여 코드를 분석합니다.

![K2 모드 활성화](k2-mode.png){width=200}

K2 모드를 활성화한 후, 컴파일러 동작 변경으로 인해 IDE 분석에서 차이점을 발견할 수 있습니다. [마이그레이션 가이드](k2-compiler-migration-guide.md)에서 새로운 K2 컴파일러가 이전 컴파일러와 어떻게 다른지 알아보세요.

*   [블로그](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)에서 K2 모드에 대해 자세히 알아보세요.
*   K2 모드에 대한 피드백을 적극적으로 수집하고 있으니, [공개 Slack 채널](https://kotlinlang.slack.com/archives/C0B8H786P)에 의견을 공유해 주세요.

### 새로운 K2 컴파일러에 대한 피드백 남기기

모든 피드백을 환영합니다!

*   새로운 K2 컴파일러 사용 중 발생하는 모든 문제는 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.
*   JetBrains가 K2 사용에 대한 익명 데이터를 수집할 수 있도록 ["사용 통계 보내기" 옵션](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)을 활성화하세요.

## Kotlin/JVM

버전 2.0.0부터 컴파일러는 Java 22 바이트코드를 포함하는 클래스를 생성할 수 있습니다. 이 버전에는 다음 변경 사항도 포함됩니다.

*   [invokedynamic을 사용한 람다 함수 생성](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 라이브러리가 이제 안정화되었습니다](#the-kotlinx-metadata-jvm-library-is-stable)

### invokedynamic을 사용한 람다 함수 생성

Kotlin 2.0.0은 `invokedynamic`을 사용하여 람다 함수를 생성하는 새로운 기본 메서드를 도입합니다. 이 변경 사항은 기존 익명 클래스 생성에 비해 애플리케이션의 바이너리 크기를 줄여줍니다.

첫 버전부터 Kotlin은 람다를 익명 클래스로 생성했습니다. 그러나 [Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic)부터는 `-Xlambdas=indy` 컴파일러 옵션을 사용하여 `invokedynamic` 생성을 선택할 수 있었습니다. Kotlin 2.0.0에서는 `invokedynamic`이 람다 생성의 기본 메서드가 되었습니다. 이 메서드는 더 가벼운 바이너리를 생성하고, Kotlin을 JVM 최적화에 맞춰 애플리케이션이 현재 및 미래의 JVM 성능 개선으로부터 이점을 얻도록 보장합니다.

현재 일반 람다 컴파일과 비교하여 세 가지 제한 사항이 있습니다.

*   `invokedynamic`으로 컴파일된 람다는 직렬화할 수 없습니다.
*   실험 단계 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API는 `invokedynamic`으로 생성된 람다를 지원하지 않습니다.
*   이러한 람다에서 `.toString()`을 호출하면 덜 읽기 쉬운 문자열 표현이 생성됩니다.

```kotlin
fun main() {
    println({})

    // Kotlin 1.9.24 및 리플렉션 사용 시 반환:
    // () -> kotlin.Unit
    
    // Kotlin 2.0.0 사용 시 반환:
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

람다 함수 생성의 기존 동작을 유지하려면 다음 중 하나를 수행할 수 있습니다.

*   특정 람다에 `@JvmSerializableLambda` 어노테이션을 적용합니다.
*   `-Xlambdas=class` 컴파일러 옵션을 사용하여 모듈의 모든 람다를 기존 메서드로 생성합니다.

### kotlinx-metadata-jvm 라이브러리가 안정화되었습니다

Kotlin 2.0.0에서 `kotlinx-metadata-jvm` 라이브러리가 [안정화](components-stability.md#stability-levels-explained)되었습니다. 이제 이 라이브러리가 `kotlin` 패키지 및 코디네이트로 변경되었으므로 `kotlin-metadata-jvm` ( "x" 없음)으로 찾을 수 있습니다.

이전에는 `kotlinx-metadata-jvm` 라이브러리가 자체 게시 스키마와 버전을 가졌습니다. 이제 `kotlin-metadata-jvm` 업데이트는 Kotlin 릴리스 주기의 일부로 Kotlin 표준 라이브러리와 동일한 하위 호환성 보장과 함께 빌드 및 게시됩니다.

`kotlin-metadata-jvm` 라이브러리는 Kotlin/JVM 컴파일러가 생성한 바이너리 파일의 메타데이터를 읽고 수정하는 API를 제공합니다.

<!-- `kotlinx-metadata-jvm` 라이브러리에 대한 자세한 내용은 [문서](kotlin-metadata-jvm.md)를 참조하세요. -->

## Kotlin/Native

이번 버전에서는 다음 변경 사항이 적용되었습니다.

*   [사인포스트를 사용한 GC 성능 모니터링](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [Objective-C 메서드와의 충돌 해결](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Native 컴파일러 인자 로깅 레벨 변경](#changed-log-level-for-compiler-arguments)
*   [Kotlin/Native에 표준 라이브러리 및 플랫폼 종속성 명시적 추가](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
*   [Gradle 구성 캐시의 태스크 오류](#tasks-error-in-gradle-configuration-cache)

### Apple 플랫폼에서 사인포스트를 사용한 GC 성능 모니터링

이전에는 Kotlin/Native의 가비지 컬렉터(GC) 성능을 로그를 통해서만 모니터링할 수 있었습니다. 그러나 이러한 로그는 iOS 앱 성능 문제 조사를 위한 인기 있는 툴킷인 Xcode Instruments와 통합되지 않았습니다.

Kotlin 2.0.0부터 GC는 Instruments에서 사용 가능한 사인포스트와 함께 일시 중지(pauses)를 보고합니다. 사인포스트를 사용하면 앱 내에서 사용자 지정 로깅이 가능하므로, 이제 iOS 앱 성능을 디버깅할 때 GC 일시 중지가 애플리케이션 프리즈에 해당하는지 확인할 수 있습니다.

[문서](native-memory-manager.md#monitor-gc-performance)에서 GC 성능 분석에 대해 자세히 알아보세요.

### Objective-C 메서드와의 충돌 해결

Objective-C 메서드는 이름은 다르지만, 동일한 수와 타입의 파라미터를 가질 수 있습니다. 예를 들어, [`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)와 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)가 있습니다. Kotlin에서는 이러한 메서드가 동일한 시그니처를 가지므로, 이를 사용하려 하면 충돌하는 오버로드 오류가 발생합니다.

이전에는 이러한 컴파일 오류를 피하기 위해 충돌하는 오버로드를 수동으로 억제해야 했습니다. Objective-C와의 Kotlin 상호 운용성을 개선하기 위해 Kotlin 2.0.0은 새로운 `@ObjCSignatureOverride` 어노테이션을 도입합니다.

이 어노테이션은 동일한 인자 타입이지만 다른 인자 이름을 가진 여러 함수가 Objective-C 클래스에서 상속되는 경우, Kotlin 컴파일러가 충돌하는 오버로드를 무시하도록 지시합니다.

이 어노테이션을 적용하는 것은 일반적인 오류 억제보다 안전합니다. 이 어노테이션은 지원되고 테스트된 Objective-C 메서드를 오버라이딩하는 경우에만 사용할 수 있으며, 일반적인 억제는 중요한 오류를 숨기고 조용히 깨진 코드로 이어질 수 있습니다.

### Kotlin/Native 컴파일러 인자 로깅 레벨 변경

이번 릴리스에서는 `compile`, `link`, `cinterop`과 같은 Kotlin/Native Gradle 태스크의 컴파일러 인자에 대한 로깅 레벨이 `info`에서 `debug`로 변경되었습니다.

기본값이 `debug`로 설정됨에 따라, 로깅 레벨은 다른 Gradle 컴파일 태스크와 일관성을 가지며 모든 컴파일러 인자를 포함하여 상세한 디버깅 정보를 제공합니다.

### Kotlin/Native에 표준 라이브러리 및 플랫폼 종속성 명시적 추가

이전에는 Kotlin/Native 컴파일러가 표준 라이브러리 및 플랫폼 종속성을 암시적으로 해결하여 Kotlin Gradle 플러그인이 Kotlin 타겟 전반에 걸쳐 작동하는 방식에 불일치를 초래했습니다.

이제 각 Kotlin/Native Gradle 컴파일은 `compileDependencyFiles` [컴파일 파라미터](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#compilation-parameters)를 통해 표준 라이브러리 및 플랫폼 종속성을 컴파일 시간 라이브러리 경로에 명시적으로 포함합니다.

### Gradle 구성 캐시의 태스크 오류

Kotlin 2.0.0부터 `invocation of Task.project at execution time is unsupported`와 같은 메시지를 포함하는 구성 캐시 오류가 발생할 수 있습니다.

이 오류는 `NativeDistributionCommonizerTask` 및 `KotlinNativeCompile`과 같은 태스크에서 나타납니다.

그러나 이것은 오탐(false-positive) 오류입니다. 근본적인 문제는 `publish*` 태스크와 같이 Gradle 구성 캐시와 호환되지 않는 태스크의 존재입니다.

오류 메시지가 다른 근본 원인을 시사하므로 이러한 불일치가 즉시 명확하지 않을 수 있습니다.

정확한 원인이 오류 보고서에 명시적으로 언급되지 않았으므로, [Gradle 팀은 이미 보고서 수정을 위해 문제 해결 중입니다](https://github.com/gradle/gradle/issues/21290).

## Kotlin/Wasm

Kotlin 2.0.0은 성능과 JavaScript와의 상호 운용성을 개선합니다.

*   [Binaryen을 사용한 프로덕션 빌드 기본 최적화](#optimized-production-builds-by-default-using-binaryen)
*   [명명된 내보내기(named export) 지원](#support-for-named-export)
*   [`@JsExport`가 적용된 함수에서 부호 없는 기본형 타입 지원](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [Kotlin/Wasm에서 TypeScript 선언 파일 생성](#generation-of-typescript-declaration-files-in-kotlin-wasm)
*   [JavaScript 예외 처리 지원](#support-for-catching-javascript-exceptions)
*   [새로운 예외 처리 제안이 이제 옵션으로 지원됩니다](#new-exception-handling-proposal-is-now-supported-as-an-option)
*   [`withWasm()` 함수가 JS 및 WASI 변형으로 분할](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### Binaryen을 사용한 프로덕션 빌드 기본 최적화

Kotlin/Wasm 툴체인은 이제 이전의 수동 설정 방식과 달리 프로덕션 컴파일 중 모든 프로젝트에 [Binaryen](https://github.com/WebAssembly/binaryen) 툴을 적용합니다. 저희 추정으로는 이는 런타임 성능을 향상시키고 프로젝트의 바이너리 크기를 줄여줄 것입니다.

> 이 변경 사항은 프로덕션 컴파일에만 영향을 미칩니다. 개발 컴파일 프로세스는 동일하게 유지됩니다.
>
{style="note"}

### 명명된 내보내기(named export) 지원

이전에는 Kotlin/Wasm에서 내보내기된 모든 선언이 기본 내보내기(default export)를 사용하여 JavaScript로 가져와졌습니다.

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

이제 `@JsExport`로 표시된 각 Kotlin 선언을 이름으로 가져올 수 있습니다.

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

명명된 내보내기(named exports)는 Kotlin과 JavaScript 모듈 간에 코드를 공유하는 것을 더 쉽게 만듭니다. 이는 가독성을 향상시키고 모듈 간의 종속성을 관리하는 데 도움이 됩니다.

### @JsExport가 적용된 함수에서 부호 없는 기본형 타입 지원

Kotlin 2.0.0부터 외부 선언 및 `@JsExport` 어노테이션이 적용된 함수 내에서 [부호 없는 기본형 타입](unsigned-integer-types.md)을 사용할 수 있으며, 이 어노테이션은 Kotlin/Wasm 함수를 JavaScript 코드에서 사용 가능하게 만듭니다.

이는 [부호 없는 기본형](unsigned-integer-types.md)이 내보내기되거나 외부 선언 내에서 직접 사용되는 것을 막았던 이전 제한을 완화하는 데 도움이 됩니다. 이제 부호 없는 기본형을 반환 또는 파라미터 타입으로 사용하여 함수를 내보내거나, 부호 없는 기본형을 반환하거나 사용하는 외부 선언을 사용할 수 있습니다.

JavaScript와의 Kotlin/Wasm 상호 운용성에 대한 자세한 내용은 [문서](wasm-js-interop.md#use-javascript-code-in-kotlin)를 참조하세요.

### Kotlin/Wasm에서 TypeScript 선언 파일 생성

> Kotlin/Wasm에서 TypeScript 선언 파일 생성은 [실험 단계](components-stability.md#stability-levels-explained)입니다. 언제든지 중단되거나 변경될 수 있습니다.
>
{style="warning"}

Kotlin 2.0.0에서 Kotlin/Wasm 컴파일러는 이제 Kotlin 코드의 모든 `@JsExport` 선언에서 TypeScript 정의를 생성할 수 있습니다. 이러한 정의는 IDE 및 JavaScript 툴에서 코드 자동 완성, 타입 검사 지원, JavaScript에 Kotlin 코드를 더 쉽게 포함하는 데 사용될 수 있습니다.

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

이전에는 Kotlin/Wasm 코드가 JavaScript 예외를 포착할 수 없어, 프로그램의 JavaScript 측에서 발생하는 오류를 처리하기 어려웠습니다.

Kotlin 2.0.0에서는 Kotlin/Wasm 내에서 JavaScript 예외를 포착하는 기능을 구현했습니다. 이 구현을 통해 `try-catch` 블록을 `Throwable` 또는 `JsException`과 같은 특정 타입과 함께 사용하여 이러한 오류를 올바르게 처리할 수 있습니다.

또한, 예외 발생 여부와 관계없이 코드를 실행하는 데 도움이 되는 `finally` 블록도 올바르게 작동합니다. JavaScript 예외를 포착하는 기능을 도입했지만, JavaScript 예외(예: 호출 스택)가 발생할 때 추가 정보는 제공되지 않습니다. 그러나 [이러한 구현 작업을 진행 중입니다](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException).

### 새로운 예외 처리 제안이 이제 옵션으로 지원됩니다

이번 릴리스에서는 Kotlin/Wasm 내에서 WebAssembly의 [예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)의 새로운 버전 지원을 도입합니다.

이 업데이트는 새로운 제안이 Kotlin 요구 사항과 일치하도록 보장하여, 최신 버전의 제안만 지원하는 가상 머신에서 Kotlin/Wasm을 사용할 수 있도록 합니다.

기본적으로 꺼져 있는 `-Xwasm-use-new-exception-proposal` 컴파일러 옵션을 사용하여 새로운 예외 처리 제안을 활성화하세요.

### withWasm() 함수가 JS 및 WASI 변형으로 분할

계층 템플릿에 Wasm 타겟을 제공하던 `withWasm()` 함수는 더 이상 사용되지 않으며, 특화된 `withWasmJs()` 및 `withWasmWasi()` 함수를 사용하도록 변경되었습니다.

이제 트리 정의에서 WASI 및 JS 타겟을 다른 그룹으로 분리할 수 있습니다.

## Kotlin/JS

다른 변경 사항 외에도 이번 버전은 Kotlin에 최신 JS 컴파일을 제공하여 ES2015 표준의 더 많은 기능을 지원합니다.

*   [새로운 컴파일 타겟](#new-compilation-target)
*   [ES2015 제너레이터로서의 suspend 함수](#suspend-functions-as-es2015-generators)
*   [`main` 함수에 인자 전달](#passing-arguments-to-the-main-function)
*   [Kotlin/JS 프로젝트의 파일별 컴파일](#per-file-compilation-for-kotlin-js-projects)
*   [컬렉션 상호 운용성 개선](#improved-collection-interoperability)
*   [`createInstance()` 지원](#support-for-createinstance)
*   [타입 안전한 일반 JavaScript 객체 지원](#support-for-type-safe-plain-javascript-objects)
*   [npm 패키지 매니저 지원](#support-for-npm-package-manager)
*   [컴파일 태스크 변경 사항](#changes-to-compilation-tasks)
*   [레거시 Kotlin/JS JAR 아티팩트 중단](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 새로운 컴파일 타겟

Kotlin 2.0.0에서는 Kotlin/JS에 새로운 컴파일 타겟인 `es2015`를 추가합니다. 이는 Kotlin에서 지원되는 모든 ES2015 기능을 한 번에 활성화할 수 있는 새로운 방법입니다.

`build.gradle(.kts)` 파일에서 다음과 같이 설정할 수 있습니다.

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

새로운 타겟은 [ES 클래스 및 모듈](whatsnew19.md#experimental-support-for-es2015-classes-and-modules)과 새로 지원되는 [ES 제너레이터](#suspend-functions-as-es2015-generators)를 자동으로 활성화합니다.

### ES2015 제너레이터로서의 suspend 함수

이번 릴리스는 [suspend 함수](composing-suspending-functions.md) 컴파일을 위한 ES2015 제너레이터에 대한 [실험 단계](components-stability.md#stability-levels-explained) 지원을 도입합니다.

상태 머신 대신 제너레이터를 사용하면 프로젝트의 최종 번들 크기가 향상될 것입니다. 예를 들어, JetBrains 팀은 ES2015 제너레이터를 사용하여 Space 프로젝트의 번들 크기를 20% 줄였습니다.

[공식 문서에서 ES2015 (ECMAScript 2015, ES6)에 대해 자세히 알아보세요](https://262.ecma-international.org/6.0/).

### main 함수에 인자 전달

Kotlin 2.0.0부터 `main()` 함수의 `args` 소스를 지정할 수 있습니다. 이 기능은 명령줄 작업 및 인자 전달을 더 쉽게 만듭니다.

이를 위해 새 `passAsArgumentToMainFunction()` 함수(문자열 배열을 반환함)와 함께 `js {}` 블록을 정의합니다.

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

이 함수는 런타임에 실행됩니다. JavaScript 표현식을 가져와 `main()` 함수 호출 대신 `args: Array<String>` 인자로 사용합니다.

또한, Node.js 런타임을 사용하는 경우 특별한 별칭을 활용할 수 있습니다. 이를 통해 `process.argv`를 매번 수동으로 추가하는 대신 한 번에 `args` 파라미터로 전달할 수 있습니다.

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

### Kotlin/JS 프로젝트의 파일별 컴파일

Kotlin 2.0.0은 Kotlin/JS 프로젝트 출력에 대한 새로운 세분성 옵션을 도입합니다. 이제 각 Kotlin 파일에 대해 하나의 JavaScript 파일을 생성하는 파일별 컴파일을 설정할 수 있습니다. 이는 최종 번들 크기를 크게 최적화하고 프로그램 로딩 시간을 향상시키는 데 도움이 됩니다.

이전에는 두 가지 출력 옵션만 있었습니다. Kotlin/JS 컴파일러는 전체 프로젝트에 대한 단일 `.js` 파일을 생성할 수 있었습니다. 그러나 이 파일은 너무 크고 사용하기 불편할 수 있습니다. 프로젝트의 함수를 사용하려면 항상 전체 JavaScript 파일을 종속성으로 포함해야 했습니다. 또는 각 프로젝트 모듈에 대해 별도의 `.js` 파일 컴파일을 구성할 수 있었습니다. 이것은 여전히 기본 옵션입니다.

모듈 파일도 너무 클 수 있었기 때문에, Kotlin 2.0.0에서는 각 Kotlin 파일당 하나(또는 파일에 내보내기된 선언이 포함된 경우 두 개)의 JavaScript 파일을 생성하는 더 세분화된 출력을 추가합니다. 파일별 컴파일 모드를 활성화하려면:

1.  ECMAScript 모듈을 지원하기 위해 빌드 파일에 [`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 함수를 추가합니다.

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

2.  `-Xir-per-file` 컴파일러 옵션을 적용하거나 `gradle.properties` 파일을 다음과 같이 업데이트합니다.

    ```none
    # gradle.properties
    kotlin.js.ir.output.granularity=per-file // `per-module`이 기본값입니다.
    ```

### 컬렉션 상호 운용성 개선

Kotlin 2.0.0부터 시그니처 내부에 Kotlin 컬렉션 타입(`Set`, `Map`, `List` 및 그 변경 가능한 대응 타입)을 가진 선언을 JavaScript(및 TypeScript)로 내보낼 수 있습니다.

JavaScript에서 Kotlin 컬렉션을 사용하려면 먼저 필요한 선언을 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 어노테이션으로 표시합니다.

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

그런 다음 JavaScript에서 일반 JavaScript 배열로 사용할 수 있습니다.

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 불행히도 JavaScript에서 Kotlin 컬렉션을 생성하는 것은 아직 불가능합니다. Kotlin 2.0.20에서 이 기능을 추가할 계획입니다.
>
{style="note"}

### createInstance() 지원

Kotlin 2.0.0부터 Kotlin/JS 타겟에서 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 함수를 사용할 수 있습니다. 이전에는 JVM에서만 사용 가능했습니다.

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 인터페이스의 이 함수는 지정된 클래스의 새 인스턴스를 생성하며, Kotlin 클래스에 대한 런타임 참조를 얻는 데 유용합니다.

### 타입 안전한 일반 JavaScript 객체 지원

> `js-plain-objects` 플러그인은 [실험 단계](components-stability.md#stability-levels-explained)입니다. 언제든지 중단되거나 변경될 수 있습니다. `js-plain-objects` 플러그인은 K2 컴파일러**만** 지원합니다.
>
{style="warning"}

JavaScript API 작업을 더 쉽게 하기 위해 Kotlin 2.0.0에서는 타입 안전한 일반 JavaScript 객체를 생성하는 데 사용할 수 있는 새로운 플러그인인 [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)를 제공합니다. 이 플러그인은 `@JsPlainObject` 어노테이션이 있는 [외부 인터페이스](wasm-js-interop.md#external-interfaces)에 대해 코드를 검사하고 다음을 추가합니다.

*   생성자로 사용할 수 있는 동반 객체 내의 인라인 `invoke` 연산자 함수.
*   객체의 일부 속성을 조정하면서 사본을 만드는 데 사용할 수 있는 `.copy()` 함수.

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

이 접근 방식으로 생성된 JavaScript 객체는 런타임에만 오류를 보는 대신 컴파일 타임에 또는 IDE에서 강조 표시되는 것을 볼 수 있기 때문에 더 안전합니다.

JavaScript 객체의 형태를 설명하기 위해 외부 인터페이스를 사용하여 `fetch()` 함수로 JavaScript API와 상호 작용하는 이 예시를 고려해 보세요.

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// Window.fetch의 래퍼
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// "metod"가 메서드로 인식되지 않아 컴파일 시간 오류 발생
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// method가 필수이므로 컴파일 시간 오류 발생
fetch("https://google.com", options = FetchOptions(body = "SOME STRING")) 
```

이에 비해 `js()` 함수를 사용하여 JavaScript 객체를 생성하는 경우, 오류는 런타임에만 발견되거나 전혀 발생하지 않습니다.

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// "metod"가 인식되지 않아 오류가 발생하지 않고, 잘못된 메서드(GET)가 사용됩니다.
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

### npm 패키지 매니저 지원

이전에는 Kotlin Multiplatform Gradle 플러그인이 npm 종속성을 다운로드하고 설치하는 데 [Yarn](https://yarnpkg.com/lang/en/)만 사용할 수 있었습니다. Kotlin 2.0.0부터는 대신 [npm](https://www.npmjs.com/)을 패키지 매니저로 사용할 수 있습니다. npm을 패키지 매니저로 사용하면 설정 중에 관리해야 할 툴이 하나 줄어듭니다.

하위 호환성을 위해 Yarn은 여전히 기본 패키지 매니저입니다. npm을 패키지 매니저로 사용하려면 `gradle.properties` 파일에 다음 속성을 설정하세요.

```kotlin
kotlin.js.yarn = false
```

### 컴파일 태스크 변경 사항

이전에는 `webpack` 및 `distributeResources` 컴파일 태스크가 모두 동일한 디렉토리를 대상으로 했습니다. 게다가 `distribution` 태스크도 `dist`를 출력 디렉토리로 선언했습니다. 이로 인해 출력이 중복되어 컴파일 경고가 발생했습니다.

그래서 Kotlin 2.0.0부터 다음 변경 사항을 구현했습니다.

*   `webpack` 태스크는 이제 별도의 폴더를 대상으로 합니다.
*   `distributeResources` 태스크는 완전히 제거되었습니다.
*   `distribution` 태스크는 이제 `Copy` 타입을 가지며 `dist` 폴더를 대상으로 합니다.

### 레거시 Kotlin/JS JAR 아티팩트 중단

Kotlin 2.0.0부터 Kotlin 배포판에는 `.jar` 확장자를 가진 레거시 Kotlin/JS 아티팩트가 더 이상 포함되지 않습니다. 레거시 아티팩트는 지원되지 않는 이전 Kotlin/JS 컴파일러에서 사용되었으며, `klib` 형식을 사용하는 IR 컴파일러에는 불필요합니다.

## Gradle 개선 사항

Kotlin 2.0.0은 Gradle 6.8.3부터 8.5까지 완벽하게 호환됩니다. 최신 Gradle 버전까지 사용할 수도 있지만, 이 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 염두에 두세요.

이번 버전에서는 다음 변경 사항이 적용되었습니다.

*   [멀티플랫폼 프로젝트 컴파일러 옵션을 위한 새로운 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [새로운 Compose 컴파일러 Gradle 플러그인](#new-compose-compiler-gradle-plugin)
*   [JVM 및 Android 게시 라이브러리를 구별하는 새로운 속성](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
*   [Kotlin/Native의 CInteropProcess를 위한 Gradle 종속성 처리 개선](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
*   [Gradle의 가시성 변경 사항](#visibility-changes-in-gradle)
*   [Gradle 프로젝트의 Kotlin 데이터 새 디렉토리](#new-directory-for-kotlin-data-in-gradle-projects)
*   [필요할 때만 Kotlin/Native 컴파일러 다운로드](#kotlin-native-compiler-downloaded-when-needed)
*   [컴파일러 옵션 정의의 기존 방식 사용 중단](#deprecated-old-ways-of-defining-compiler-options)
*   [최소 지원 AGP 버전 상향 조정](#bumped-minimum-supported-agp-version)
*   [최신 언어 버전을 시험하기 위한 새로운 Gradle 속성](#new-gradle-property-for-trying-the-latest-language-version)
*   [빌드 보고서를 위한 새로운 JSON 출력 형식](#new-json-output-format-for-build-reports)
*   [kapt 구성이 상위 구성에서 어노테이션 프로세서를 상속](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
*   [Kotlin Gradle 플러그인이 더 이상 사용 중단된 Gradle 컨벤션을 사용하지 않음](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### 멀티플랫폼 프로젝트 컴파일러 옵션을 위한 새로운 Gradle DSL

> 이 기능은 [실험 단계](components-stability.md#stability-levels-explained)입니다. 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.0.0 이전에는 Gradle을 사용한 멀티플랫폼 프로젝트에서 컴파일러 옵션을 구성하는 것이 태스크별, 컴파일별 또는 소스 세트별과 같이 낮은 수준에서만 가능했습니다. 프로젝트에서 컴파일러 옵션을 더 일반적으로 구성하는 것을 쉽게 하기 위해 Kotlin 2.0.0에는 새로운 Gradle DSL이 함께 제공됩니다.

이 새로운 DSL을 사용하면 모든 타겟 및 `commonMain`과 같은 공유 소스 세트에 대한 확장 수준에서, 그리고 특정 타겟에 대한 타겟 수준에서 컴파일러 옵션을 구성할 수 있습니다.

```kotlin
kotlin {
    compilerOptions {
        // 모든 타겟 및 공유 소스 세트의 기본값으로 사용되는
        // 확장 수준 공통 컴파일러 옵션
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // 이 타겟의 모든 컴파일에 대한 기본값으로 사용되는
            // 타겟 수준 JVM 컴파일러 옵션
            noJdk.set(true)
        }
    }
}
```

전체 프로젝트 구성은 이제 세 개의 레이어를 가집니다. 가장 높은 것은 확장 수준이고, 다음은 타겟 수준이며, 가장 낮은 것은 컴파일 유닛(일반적으로 컴파일 태스크)입니다.

![Kotlin 컴파일러 옵션 수준](compiler-options-levels.svg){width=700}

상위 레벨의 설정은 하위 레벨의 관례(기본값)로 사용됩니다.

*   확장 컴파일러 옵션의 값은 `commonMain`, `nativeMain`, `commonTest`와 같은 공유 소스 세트를 포함한 타겟 컴파일러 옵션의 기본값입니다.
*   타겟 컴파일러 옵션의 값은 `compileKotlinJvm`, `compileTestKotlinJvm` 태스크와 같은 컴파일 유닛(태스크) 컴파일러 옵션의 기본값으로 사용됩니다.

결과적으로, 하위 레벨에서 이루어진 구성은 상위 레벨의 관련 설정을 재정의합니다.

*   태스크 수준 컴파일러 옵션은 타겟 또는 확장 수준의 관련 구성을 재정의합니다.
*   타겟 수준 컴파일러 옵션은 확장 수준의 관련 구성을 재정의합니다.

프로젝트를 구성할 때, 일부 기존의 컴파일러 옵션 설정 방식은 [더 이상 사용되지 않습니다](#deprecated-old-ways-of-defining-compiler-options).

이 새로운 DSL을 멀티플랫폼 프로젝트에서 시도해 보고 [YouTrack](https://kotl.in/issue)에 피드백을 남겨주시길 권장합니다. 저희는 이 DSL을 컴파일러 옵션 구성의 권장 접근 방식으로 만들 계획입니다.

### 새로운 Compose 컴파일러 Gradle 플러그인

컴포저블을 Kotlin 코드로 변환하는 Jetpack Compose 컴파일러가 이제 Kotlin 리포지토리로 병합되었습니다. 이는 Compose 컴파일러가 항상 Kotlin과 동시에 출시되므로 Compose 프로젝트를 Kotlin 2.0.0으로 전환하는 데 도움이 될 것입니다. 또한 Compose 컴파일러 버전이 2.0.0으로 상향 조정됩니다.

프로젝트에서 새로운 Compose 컴파일러를 사용하려면 `build.gradle(.kts)` 파일에 `org.jetbrains.kotlin.plugin.compose` Gradle 플러그인을 적용하고 버전을 Kotlin 2.0.0과 동일하게 설정하세요.

이 변경 사항에 대해 자세히 알아보고 마이그레이션 지침을 보려면 [Compose 컴파일러](https://kotlinlang.org/docs/multiplatform/compose-compiler.html) 문서를 참조하세요.

### JVM 및 Android 게시 라이브러리를 구별하는 새로운 속성

Kotlin 2.0.0부터 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) Gradle 속성은 모든 Kotlin 변형과 함께 기본적으로 게시됩니다.

이 속성은 Kotlin Multiplatform 라이브러리의 JVM 및 Android 변형을 구별하는 데 도움이 됩니다. 이는 특정 라이브러리 변형이 특정 JVM 환경에 더 적합하다는 것을 나타냅니다. 대상 환경은 "android", "standard-jvm" 또는 "no-jvm"일 수 있습니다.

이 속성을 게시하면 Kotlin Multiplatform 라이브러리를 JVM 및 Android 타겟과 함께 비멀티플랫폼 클라이언트(예: Java 전용 프로젝트)에서 사용하는 것이 더 견고해질 것입니다.

필요한 경우 속성 게시를 비활성화할 수 있습니다. 이를 위해 `gradle.properties` 파일에 다음 Gradle 옵션을 추가하세요.

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### Kotlin/Native의 CInteropProcess를 위한 Gradle 종속성 처리 개선

이번 릴리스에서는 Kotlin/Native 프로젝트에서 Gradle 태스크 종속성 관리를 개선하기 위해 `defFile` 속성 처리를 향상시켰습니다.

이 업데이트 이전에는 `defFile` 속성이 아직 실행되지 않은 다른 태스크의 출력으로 지정되면 Gradle 빌드가 실패할 수 있었습니다. 이 문제에 대한 해결책은 이 태스크에 종속성을 추가하는 것이었습니다.

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

이 문제를 해결하기 위해 `definitionFile`이라는 새로운 `RegularFileProperty` 속성이 있습니다. 이제 Gradle은 빌드 프로세스 후반에 연결된 태스크가 실행된 후 `definitionFile` 속성의 존재 여부를 지연 확인합니다. 이 새로운 접근 방식은 추가 종속성의 필요성을 제거합니다.

`CInteropProcess` 태스크와 `CInteropSettings` 클래스는 `defFile` 및 `defFileProperty` 대신 `definitionFile` 속성을 사용합니다.

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

> `defFile` 및 `defFileProperty` 파라미터는 사용 중단되었습니다.
>
{style="warning"}

### Gradle의 가시성 변경 사항

> 이 변경 사항은 Kotlin DSL 사용자에게만 영향을 미칩니다.
>
{style="note"}

Kotlin 2.0.0에서는 빌드 스크립트에서 더 나은 제어 및 안전성을 위해 Kotlin Gradle 플러그인을 수정했습니다. 이전에는 특정 DSL 컨텍스트를 위한 Kotlin DSL 함수 및 속성이 다른 DSL 컨텍스트로 의도치 않게 누출되곤 했습니다. 이 누출은 잘못된 컴파일러 옵션 사용, 설정이 여러 번 적용되는 문제 및 기타 잘못된 구성으로 이어질 수 있었습니다.

```kotlin
kotlin {
    // 타겟 DSL은
    // kotlin{} 확장 DSL에 정의된 메서드와 속성에 접근할 수 없었습니다.
    jvm {
        // 컴파일 DSL은
        // kotlin{} 확장 DSL 및 Kotlin jvm{} 타겟 DSL에 정의된
        // 메서드와 속성에 접근할 수 없었습니다.
        compilations.configureEach {
            // 컴파일 태스크 DSL은
            // kotlin{} 확장, Kotlin jvm{} 타겟 또는 Kotlin 컴파일 DSL에
            // 정의된 메서드와 속성에 접근할 수 없었습니다.
            compileTaskProvider.configure {
                // 예를 들어:
                explicitApi()
                // kotlin{} 확장 DSL에 정의되어 있어 오류
                mavenPublication {}
                // Kotlin jvm{} 타겟 DSL에 정의되어 있어 오류
                defaultSourceSet {}
                // Kotlin 컴파일 DSL에 정의되어 있어 오류
            }
        }
    }
}
```

이 문제를 해결하기 위해 `@KotlinGradlePluginDsl` 어노테이션을 추가하여 Kotlin Gradle 플러그인 DSL 함수 및 속성이 사용되도록 의도되지 않은 수준으로 노출되는 것을 방지했습니다. 다음 수준은 서로 분리됩니다.

*   Kotlin 확장
*   Kotlin 타겟
*   Kotlin 컴파일
*   Kotlin 컴파일 태스크

가장 일반적인 경우에 대해, 빌드 스크립트가 잘못 구성된 경우 수정 방법에 대한 제안이 포함된 컴파일러 경고를 추가했습니다. 예를 들어:

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

이 변경 사항에 대한 여러분의 피드백을 환영합니다! [Slack #gradle 채널](https://kotlinlang.slack.com/archives/C19FD9681)에 Kotlin 개발자에게 직접 의견을 공유해 주세요. [Slack 초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Gradle 프로젝트의 Kotlin 데이터 새 디렉토리

> `.kotlin` 디렉토리를 버전 제어에 커밋하지 마십시오. 예를 들어 Git을 사용하는 경우 프로젝트의 `.gitignore` 파일에 `.kotlin`을 추가하세요.
>
{style="warning"}

Kotlin 1.8.20에서 Kotlin Gradle 플러그인은 데이터를 Gradle 프로젝트 캐시 디렉토리인 `<project-root-directory>/.gradle/kotlin`에 저장하도록 변경되었습니다. 그러나 `.gradle` 디렉토리는 Gradle 전용이며, 그 결과 미래에 대비하지 못했습니다.

이 문제를 해결하기 위해 Kotlin 2.0.0부터는 Kotlin 데이터를 기본적으로 `<project-root-directory>/.kotlin`에 저장합니다. 하위 호환성을 위해 일부 데이터는 `.gradle/kotlin` 디렉토리에 계속 저장됩니다.

구성할 수 있는 새로운 Gradle 속성은 다음과 같습니다.

| Gradle 속성                                       | 설명                                                                                                             |
|:----------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 프로젝트 수준 데이터가 저장되는 위치를 구성합니다. 기본값: `<project-root-directory>/.kotlin`                        |
| `kotlin.project.persistent.dir.gradle.disableWrite` | `.gradle` 디렉토리에 Kotlin 데이터 쓰기 비활성화를 제어하는 불리언 값입니다. 기본값: `false` |

이러한 속성을 프로젝트의 `gradle.properties` 파일에 추가하면 적용됩니다.

### 필요할 때만 Kotlin/Native 컴파일러 다운로드

Kotlin 2.0.0 이전에는 멀티플랫폼 프로젝트의 Gradle 빌드 스크립트에 [Kotlin/Native 타겟](native-target-support.md)이 구성되어 있으면, Gradle은 항상 [구성 단계](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)에서 Kotlin/Native 컴파일러를 다운로드했습니다.

이는 [실행 단계](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)에서 실행될 Kotlin/Native 타겟용 코드를 컴파일할 태스크가 없더라도 발생했습니다. 이러한 방식으로 Kotlin/Native 컴파일러를 다운로드하는 것은 프로젝트의 JVM 또는 JavaScript 코드만 확인하려는 사용자에게 특히 비효율적이었습니다. 예를 들어, CI 프로세스의 일부로 Kotlin 프로젝트에 대한 테스트 또는 검사를 수행하는 경우입니다.

Kotlin 2.0.0에서는 Kotlin Gradle 플러그인에서 이 동작을 변경하여 Kotlin/Native 컴파일러가 [실행 단계](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)에서 **오직** Kotlin/Native 타겟에 대한 컴파일이 요청될 때만 다운로드되도록 했습니다.

결과적으로 Kotlin/Native 컴파일러의 종속성도 이제 컴파일러의 일부가 아닌 실행 단계에서 다운로드됩니다.

새로운 동작에 문제가 발생하는 경우, `gradle.properties` 파일에 다음 Gradle 속성을 추가하여 일시적으로 이전 동작으로 되돌릴 수 있습니다.

```none
kotlin.native.toolchain.enabled=false
```

Kotlin 1.9.20-Beta부터 Kotlin/Native 배포판은 CDN과 함께 [Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/)에 게시됩니다.

이를 통해 Kotlin이 필요한 아티팩트를 찾고 다운로드하는 방식을 변경할 수 있었습니다. 기본적으로 CDN 대신 프로젝트의 `repositories {}` 블록에 지정한 Maven 리포지토리를 사용합니다.

`gradle.properties` 파일에 다음 Gradle 속성을 설정하여 이 동작을 일시적으로 되돌릴 수 있습니다.

```none
kotlin.native.distribution.downloadFromMaven=false
```

문제가 있으면 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요. 기본 동작을 변경하는 이 두 가지 Gradle 속성은 임시이며 향후 릴리스에서 제거될 예정입니다.

### 컴파일러 옵션 정의의 기존 방식 사용 중단

이번 릴리스에서는 컴파일러 옵션 설정 방식을 계속해서 개선하고 있습니다. 이는 다양한 방식 간의 모호성을 해결하고 프로젝트 구성을 더 간단하게 만들어야 합니다.

Kotlin 2.0.0부터 컴파일러 옵션을 지정하는 다음 DSL은 사용 중단되었습니다.

*   모든 Kotlin 컴파일 태스크를 구현하는 `KotlinCompile` 인터페이스의 `kotlinOptions` DSL. 대신 `KotlinCompilationTask<CompilerOptions>`를 사용하세요.
*   `KotlinCompilation` 인터페이스의 `HasCompilerOptions` 타입 `compilerOptions` 속성. 이 DSL은 다른 DSL과 일관성이 없었으며, `KotlinCompilation.compileTaskProvider` 컴파일 태스크 내부의 `compilerOptions`와 동일한 `KotlinCommonCompilerOptions` 객체를 구성하여 혼란스러웠습니다.

    대신 Kotlin 컴파일 태스크의 `compilerOptions` 속성을 사용하는 것이 좋습니다.

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

*   `KotlinCompilation` 인터페이스의 `kotlinOptions` DSL.
*   `KotlinNativeArtifactConfig` 인터페이스, `KotlinNativeLink` 클래스 및 `KotlinNativeLinkArtifactTask` 클래스의 `kotlinOptions` DSL. 대신 `toolOptions` DSL을 사용하세요.
*   `KotlinJsDce` 인터페이스의 `dceOptions` DSL. 대신 `toolOptions` DSL을 사용하세요.

Kotlin Gradle 플러그인에서 컴파일러 옵션을 지정하는 방법에 대한 자세한 내용은 [옵션 정의 방법](gradle-compiler-options.md#how-to-define-options)을 참조하세요.

### 최소 지원 AGP 버전 상향 조정

Kotlin 2.0.0부터 최소 지원 Android Gradle 플러그인 버전은 7.1.3입니다.

### 최신 언어 버전을 시험하기 위한 새로운 Gradle 속성

Kotlin 2.0.0 이전에는 새로운 K2 컴파일러를 시험하기 위한 Gradle 속성인 `kotlin.experimental.tryK2`가 있었습니다. 이제 Kotlin 2.0.0에서 K2 컴파일러가 기본적으로 활성화되므로, 이 속성을 프로젝트에서 최신 언어 버전을 시험하는 데 사용할 수 있는 새로운 형태인 `kotlin.experimental.tryNext`로 발전시키기로 결정했습니다. `gradle.properties` 파일에서 이 속성을 사용하면 Kotlin Gradle 플러그인이 언어 버전을 현재 Kotlin 버전의 기본값보다 하나 높은 버전으로 증가시킵니다. 예를 들어 Kotlin 2.0.0에서는 기본 언어 버전이 2.0이므로 이 속성은 언어 버전 2.1을 구성합니다.

이 새로운 Gradle 속성은 이전 `kotlin.experimental.tryK2`와 동일한 [빌드 보고서](gradle-compilation-and-caches.md#build-reports) 메트릭을 생성합니다. 구성된 언어 버전은 출력에 포함됩니다. 예를 들어:

```none
##### 'kotlin.experimental.tryNext' 결과 #####
:app:compileKotlin: 2.1 언어 버전
:lib:compileKotlin: 2.1 언어 버전
##### 100% (2/2) 태스크가 Kotlin 2.1로 컴파일되었습니다 #####
```

빌드 보고서 활성화 및 내용에 대한 자세한 내용은 [빌드 보고서](gradle-compilation-and-caches.md#build-reports)를 참조하세요.

### 빌드 보고서를 위한 새로운 JSON 출력 형식

Kotlin 1.7.0에서는 컴파일러 성능 추적에 도움이 되는 빌드 보고서를 도입했습니다. 시간이 지남에 따라 성능 문제 조사 시 이러한 보고서를 더욱 상세하고 유용하게 만들기 위해 더 많은 메트릭을 추가했습니다. 이전에는 로컬 파일의 유일한 출력 형식이 `*.txt` 형식이었습니다. Kotlin 2.0.0에서는 다른 툴을 사용하여 분석하기 더 쉽게 하기 위해 JSON 출력 형식을 지원합니다.

빌드 보고서의 JSON 출력 형식을 구성하려면 `gradle.properties` 파일에 다음 속성을 선언하세요.

```none
kotlin.build.report.output=json

// 빌드 보고서를 저장할 디렉토리
kotlin.build.report.json.directory=my/directory/path
```

또는 다음 명령을 실행할 수 있습니다.

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
``` 

일단 구성되면, Gradle은 지정한 디렉토리에 `${project_name}-날짜-시간-<시퀀스_번호>.json` 이름으로 빌드 보고서를 생성합니다.

빌드 메트릭 및 집계 메트릭이 포함된 JSON 출력 형식 빌드 보고서의 예시 스니펫입니다.

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

### kapt 구성이 상위 구성에서 어노테이션 프로세서를 상속

Kotlin 2.0.0 이전에는 별도의 Gradle 구성에서 공통 어노테이션 프로세서 집합을 정의하고 하위 프로젝트의 kapt 특정 구성에서 이 구성을 확장하려고 할 때, kapt는 어노테이션 프로세서를 찾을 수 없어 어노테이션 처리를 건너뛰었습니다. Kotlin 2.0.0에서는 kapt가 어노테이션 프로세서에 대한 간접 종속성이 있음을 성공적으로 감지할 수 있습니다.

예를 들어, [Dagger](https://dagger.dev/)를 사용하는 하위 프로젝트의 경우, `build.gradle(.kts)` 파일에서 다음 구성을 사용하세요.

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

이 예시에서 `commonAnnotationProcessors` Gradle 구성은 모든 프로젝트에 사용되기를 원하는 어노테이션 처리를 위한 공통 구성입니다. `extendsFrom()` 메서드를 사용하여 `commonAnnotationProcessors`를 상위 구성으로 추가합니다. kapt는 `commonAnnotationProcessors` Gradle 구성이 Dagger 어노테이션 프로세서에 종속성을 가지고 있음을 확인합니다. 따라서 kapt는 Dagger 어노테이션 프로세서를 어노테이션 처리 구성에 포함합니다.

[구현에 도움을 주신 Christoph Loy님께 감사드립니다!](https://github.com/JetBrains/kotlin/pull/5198)

### Kotlin Gradle 플러그인이 더 이상 사용 중단된 Gradle 컨벤션을 사용하지 않음

Kotlin 2.0.0 이전에는 Gradle 8.2 이상을 사용하는 경우, Kotlin Gradle 플러그인이 Gradle 8.2에서 사용 중단된 Gradle 컨벤션을 잘못 사용했습니다. 이로 인해 Gradle은 빌드 사용 중단을 보고했습니다. Kotlin 2.0.0에서는 Kotlin Gradle 플러그인이 Gradle 8.2 이상을 사용할 때 이러한 사용 중단 경고를 더 이상 발생시키지 않도록 업데이트되었습니다.

## 표준 라이브러리

이번 릴리스는 Kotlin 표준 라이브러리에 추가적인 안정성을 제공하며, 더 많은 기존 함수를 모든 플랫폼에서 공통으로 사용 가능하게 만듭니다.

*   [enum class values 제네릭 함수의 안정화된 대체](#stable-replacement-of-the-enum-class-values-generic-function)
*   [안정화된 AutoCloseable 인터페이스](#stable-autocloseable-interface)
*   [AbstractMutableList.modCount 공통 protected 프로퍼티](#common-protected-property-abstractmutablelist-modcount)
*   [AbstractMutableList.removeRange 공통 protected 함수](#common-protected-function-abstractmutablelist-removerange)
*   [String.toCharArray(destination) 공통 함수](#common-string-tochararray-destination-function)

### enum class values 제네릭 함수의 안정화된 대체

Kotlin 2.0.0에서는 `enumEntries<T>()` 함수가 [안정화](components-stability.md#stability-levels-explained)되었습니다. `enumEntries<T>()` 함수는 제네릭 `enumValues<T>()` 함수의 대체 함수입니다. 이 새로운 함수는 주어진 열거형 타입 `T`의 모든 열거형 엔트리 리스트를 반환합니다. 열거형 클래스의 `entries` 프로퍼티는 이전에 도입되어 합성 `values()` 함수를 대체하기 위해 안정화되었습니다. `entries` 프로퍼티에 대한 자세한 내용은 [Kotlin 1.8.20의 새로운 기능](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)을 참조하세요.

> `enumValues<T>()` 함수는 여전히 지원되지만, 성능 영향이 적기 때문에 `enumEntries<T>()` 함수를 대신 사용하는 것이 좋습니다. `enumValues<T>()`를 호출할 때마다 새 배열이 생성되는 반면, `enumEntries<T>()`를 호출할 때는 매번 동일한 리스트가 반환되어 훨씬 더 효율적입니다.
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

### 안정화된 AutoCloseable 인터페이스

Kotlin 2.0.0에서 공통 [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 인터페이스가 [안정화](components-stability.md#stability-levels-explained)되었습니다. 이를 통해 리소스를 쉽게 닫을 수 있으며, 몇 가지 유용한 함수를 포함합니다.

*   `use()` 확장 함수: 선택된 리소스에 대해 주어진 블록 함수를 실행한 다음, 예외 발생 여부와 관계없이 올바르게 닫습니다.
*   `AutoCloseable()` 생성자 함수: `AutoCloseable` 인터페이스의 인스턴스를 생성합니다.

아래 예시에서는 `XMLWriter` 인터페이스를 정의하고, 이를 구현하는 리소스가 있다고 가정합니다. 예를 들어, 이 리소스는 파일을 열고, XML 콘텐츠를 작성한 다음 닫는 클래스일 수 있습니다.

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

### AbstractMutableList.modCount 공통 protected 프로퍼티

이번 릴리스에서 `AbstractMutableList` 인터페이스의 `protected` 프로퍼티인 [`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html)가 공통으로 사용 가능하게 되었습니다. 이전에는 `modCount` 프로퍼티가 각 플랫폼에서는 사용 가능했지만 공통 타겟에서는 사용할 수 없었습니다. 이제 `AbstractMutableList`의 사용자 지정 구현을 생성하고 공통 코드에서 프로퍼티에 접근할 수 있습니다.

이 프로퍼티는 컬렉션에 가해진 구조적 수정 횟수를 추적합니다. 여기에는 컬렉션 크기를 변경하거나 진행 중인 반복이 잘못된 결과를 반환할 수 있는 방식으로 리스트를 변경하는 작업이 포함됩니다.

`modCount` 프로퍼티를 사용하여 사용자 지정 리스트를 구현할 때 동시 수정을 등록하고 감지할 수 있습니다.

### AbstractMutableList.removeRange 공통 protected 함수

이번 릴리스에서 `AbstractMutableList` 인터페이스의 `protected` 함수인 [`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html)가 공통으로 사용 가능하게 되었습니다. 이전에는 각 플랫폼에서는 사용 가능했지만 공통 타겟에서는 사용할 수 없었습니다. 이제 `AbstractMutableList`의 사용자 지정 구현을 생성하고 공통 코드에서 함수를 재정의할 수 있습니다.

이 함수는 지정된 범위에 따라 이 리스트에서 요소를 제거합니다. 이 함수를 재정의하여 사용자 지정 구현을 활용하고 리스트 연산의 성능을 향상시킬 수 있습니다.

### String.toCharArray(destination) 공통 함수

이번 릴리스에서는 공통 [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 함수를 도입합니다. 이전에는 JVM에서만 사용 가능했습니다.

기존 [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 함수와 비교해 봅시다. 이 함수는 지정된 문자열의 문자를 포함하는 새 `CharArray`를 생성합니다. 그러나 새로운 공통 `String.toCharArray(destination)` 함수는 `String` 문자를 기존 대상 `CharArray`로 이동합니다. 이는 채우고 싶은 버퍼가 이미 있는 경우에 유용합니다.

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // 문자열을 변환하여 destinationArray에 저장합니다.
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e ! 
    }
}
```
{kotlin-runnable="true"}

## Kotlin 2.0.0 설치

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 포함된 번들 플러그인으로 배포됩니다. 이는 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없음을 의미합니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 2.0.0으로 변경](releases.md#update-to-a-new-kotlin-version)하세요.