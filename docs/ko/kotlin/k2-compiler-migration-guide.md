[//]: # (title: K2 컴파일러 마이그레이션 가이드)

Kotlin 언어와 생태계가 계속 발전함에 따라 Kotlin 컴파일러도 함께 발전했습니다. 첫 번째 단계는 JVM 및 JS IR(중간 표현) 백엔드의 도입으로, 이들은 로직을 공유하여 여러 플랫폼을 위한 코드 생성을 단순화했습니다. 이제 다음 진화 단계에서는 K2로 알려진 새로운 프런트엔드가 도입됩니다.

![Kotlin K2 compiler architecture](k2-compiler-architecture.svg){width=700}

K2 컴파일러의 등장으로 Kotlin 프런트엔드는 완전히 재작성되었으며, 새롭고 더욱 효율적인 아키텍처를 특징으로 합니다. 새 컴파일러가 가져오는 근본적인 변화는 더 많은 의미론적 정보(semantic information)를 포함하는 하나의 통합된 데이터 구조를 사용한다는 것입니다. 이 프런트엔드는 의미 분석(semantic analysis), 호출 분석(call resolution) 및 타입 추론(type inference)을 수행하는 역할을 합니다.

새로운 아키텍처와 풍부한 데이터 구조는 K2 컴파일러가 다음과 같은 이점을 제공하도록 합니다.

*   **향상된 호출 분석 및 타입 추론**. 컴파일러가 더욱 일관성 있게 동작하며 코드를 더 잘 이해합니다.
*   **새로운 언어 기능을 위한 문법 설탕(syntactic sugar) 도입 용이**. 앞으로 새로운 기능이 도입될 때 더 간결하고 읽기 쉬운 코드를 사용할 수 있게 될 것입니다.
*   **더 빨라진 컴파일 시간**. 컴파일 시간이 [상당히 빨라질](#performance-improvements) 수 있습니다.
*   **향상된 IDE 성능**. 2025.1부터 IntelliJ IDEA는 K2 모드를 사용하여 Kotlin 코드를 분석하며, 안정성을 높이고 성능을 향상시킵니다. 자세한 내용은 [IDE 지원](#support-in-ides)을 참조하세요.

이 가이드에서는:

*   새로운 K2 컴파일러의 이점을 설명합니다.
*   마이그레이션 중 발생할 수 있는 변경 사항과 그에 따라 코드를 조정하는 방법을 강조합니다.
*   이전 버전으로 롤백하는 방법을 설명합니다.

> 새로운 K2 컴파일러는 2.0.0부터 기본적으로 활성화됩니다. Kotlin 2.0.0에서 제공되는 새로운 기능과 새로운 K2 컴파일러에 대한 자세한 내용은 [Kotlin 2.0.0의 새로운 기능](whatsnew20.md)을 참조하세요.
>
{style="note"}

## 성능 향상

K2 컴파일러의 성능을 평가하기 위해 두 개의 오픈 소스 프로젝트인 [Anki-Android](https://github.com/ankidroid/Anki-Android)와 [Exposed](https://github.com/JetBrains/Exposed)에서 성능 테스트를 실행했습니다. 다음은 발견된 주요 성능 향상입니다.

*   K2 컴파일러는 컴파일 속도를 최대 94% 향상시킵니다. 예를 들어, Anki-Android 프로젝트에서 클린 빌드(clean build) 시간은 Kotlin 1.9.23의 57.7초에서 Kotlin 2.0.0의 29.7초로 단축되었습니다.
*   K2 컴파일러를 사용하면 초기화 단계가 최대 488% 더 빨라집니다. 예를 들어, Anki-Android 프로젝트에서 증분 빌드(incremental build)의 초기화 단계는 Kotlin 1.9.23의 0.126초에서 Kotlin 2.0.0의 0.022초로 단축되었습니다.
*   Kotlin K2 컴파일러는 이전 컴파일러에 비해 분석 단계에서 최대 376% 더 빠릅니다. 예를 들어, Anki-Android 프로젝트에서 증분 빌드의 분석 시간은 Kotlin 1.9.23의 0.581초에서 Kotlin 2.0.0의 0.122초로 대폭 단축되었습니다.

이러한 개선 사항에 대한 자세한 내용과 K2 컴파일러의 성능을 분석한 방법에 대해 자세히 알아보려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)을 참조하세요.

## 언어 기능 개선

Kotlin K2 컴파일러는 [스마트 캐스팅](#smart-casts) 및 [Kotlin Multiplatform](#kotlin-multiplatform)과 관련된 언어 기능을 개선합니다.

### 스마트 캐스트

Kotlin 컴파일러는 특정 경우에 객체를 자동으로 타입으로 캐스팅하여 개발자가 명시적으로 지정할 필요를 줄여줍니다. 이를 [스마트 캐스팅](typecasts.md#smart-casts)이라고 합니다. Kotlin K2 컴파일러는 이제 이전보다 더 많은 시나리오에서 스마트 캐스트를 수행합니다.

Kotlin 2.0.0에서는 다음과 같은 영역에서 스마트 캐스트와 관련된 개선이 이루어졌습니다.

*   [지역 변수 및 추가 스코프](#local-variables-and-further-scopes)
*   [논리 `or` 연산자를 사용한 타입 검사](#type-checks-with-the-logical-or-operator)
*   [인라인 함수](#inline-functions)
*   [함수 타입 속성](#properties-with-function-types)
*   [예외 처리](#exception-handling)
*   [증가 및 감소 연산자](#increment-and-decrement-operators)

#### 지역 변수 및 추가 스코프

이전에는 변수가 `if` 조건 내에서 `null`이 아니라고 평가되면 변수는 스마트 캐스팅되었습니다. 이 변수에 대한 정보는 `if` 블록의 스코프 내에서 추가로 공유되었습니다.

그러나 변수를 `if` 조건 **외부**에 선언하면 `if` 조건 내에서 변수에 대한 정보를 사용할 수 없었으므로 스마트 캐스팅될 수 없었습니다. 이러한 동작은 `when` 표현식 및 `while` 루프에서도 나타났습니다.

Kotlin 2.0.0부터 `if`, `when` 또는 `while` 조건에서 변수를 사용하기 전에 선언하면 컴파일러가 변수에 대해 수집한 모든 정보가 스마트 캐스팅을 위해 해당 블록에서 접근 가능해집니다.

이는 불리언 조건을 변수로 추출하는 등의 작업을 수행할 때 유용할 수 있습니다. 그런 다음 변수에 의미 있는 이름을 지정하여 코드 가독성을 높이고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들어:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // In Kotlin 2.0.0, the compiler can access
        // information about isCat, so it knows that
        // animal was smart-cast to the type Cat.
        // Therefore, the purr() function can be called.
        // In Kotlin 1.9.20, the compiler doesn't know
        // about the smart cast, so calling the purr()
        // function triggers an error.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 논리 `or` 연산자를 사용한 타입 검사

Kotlin 2.0.0에서는 `or` 연산자(`||`)를 사용하여 객체에 대한 타입 검사를 결합하면 가장 가까운 공통 상위 타입(common supertype)으로 스마트 캐스트가 이루어집니다. 이 변경 전에는 항상 `Any` 타입으로 스마트 캐스트가 이루어졌습니다.

이 경우, 속성에 접근하거나 함수를 호출하기 전에 여전히 객체 타입을 수동으로 확인해야 했습니다. 예를 들어:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
        // Prior to Kotlin 2.0.0, signalStatus is smart cast 
        // to type Any, so calling the signal() function triggered an
        // Unresolved reference error. The signal() function can only 
        // be called successfully after another type check:
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 공통 상위 타입은 [유니온 타입](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은 [현재 Kotlin에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

#### 인라인 함수

Kotlin 2.0.0에서는 K2 컴파일러가 인라인 함수를 다르게 처리하여, 다른 컴파일러 분석과 함께 스마트 캐스트가 안전한지 여부를 결정할 수 있도록 합니다.

특히, 인라인 함수는 이제 암시적인 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 갖는 것으로 처리됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 그 자리에서(in place) 호출됨을 의미합니다. 람다 함수가 그 자리에서 호출되므로, 컴파일러는 람다 함수가 함수 본문에 포함된 변수에 대한 참조를 유출할 수 없다는 것을 알게 됩니다.

컴파일러는 이 지식을 다른 컴파일러 분석과 함께 사용하여 캡처된 변수 중 스마트 캐스팅이 안전한지 여부를 결정합니다. 예를 들어:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // In Kotlin 2.0.0, the compiler knows that processor 
        // is a local variable and inlineAction() is an inline function, so 
        // references to processor can't be leaked. Therefore, it's safe 
        // to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()

            // In Kotlin 1.9.20, you have to perform a safe call:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 함수 타입 속성

이전 Kotlin 버전에서는 함수 타입을 가진 클래스 속성이 스마트 캐스팅되지 않는 버그가 있었습니다. Kotlin 2.0.0과 K2 컴파일러에서 이 동작이 수정되었습니다. 예를 들어:

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // In Kotlin 2.0.0, if provider isn't null,
        // it is smart-cast
        if (provider != null) {
            // The compiler knows that provider isn't null
            provider()

            // In 1.9.20, the compiler doesn't know that provider isn't 
            // null, so it triggers an error:
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
            // In 1.9.20, the compiler triggers an error: 
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 예외 처리

Kotlin 2.0.0에서는 예외 처리 기능이 개선되어 스마트 캐스트 정보가 `catch` 및 `finally` 블록으로 전달될 수 있습니다. 이 변경 사항은 컴파일러가 객체가 널 가능 타입인지 여부를 추적하므로 코드를 더 안전하게 만듭니다. 예를 들어:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // In Kotlin 2.0.0, the compiler knows stringInput 
        // can be null, so stringInput stays nullable.
        println(stringInput?.length)
        // null

        // In Kotlin 1.9.20, the compiler says that a safe call isn't
        // needed, but this is incorrect.
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 증가 및 감소 연산자

Kotlin 2.0.0 이전에는 컴파일러가 증가 또는 감소 연산자를 사용한 후 객체의 타입이 변경될 수 있다는 것을 이해하지 못했습니다. 컴파일러가 객체 타입을 정확하게 추적할 수 없었기 때문에 코드에서 미해결 참조 오류가 발생할 수 있었습니다. Kotlin 2.0.0에서는 이 문제가 해결되었습니다:

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

    // Check if unknownObject inherits from the Tau interface
    // Note, it's possible that unknownObject inherits from both
    // Rho and Tau interfaces.
    if (unknownObject is Tau) {

        // Use the overloaded inc() operator from interface Rho.
        // In Kotlin 2.0.0, the type of unknownObject is smart-cast to
        // Sigma.
        ++unknownObject

        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so the sigma() function can be called successfully.
        unknownObject.sigma()

        // In Kotlin 1.9.20, the compiler doesn't perform a smart cast
        // when inc() is called so the compiler still thinks that 
        // unknownObject has type Tau. Calling the sigma() function 
        // throws a compile-time error.
        
        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so calling the tau() function throws a compile-time 
        // error.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // In Kotlin 1.9.20, since the compiler mistakenly thinks that 
        // unknownObject has type Tau, the tau() function can be called,
        // but it throws a ClassCastException.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform

K2 컴파일러에는 Kotlin Multiplatform과 관련된 다음과 같은 영역의 개선 사항이 있습니다.

*   [컴파일 중 common 및 platform 소스 분리](#separation-of-common-and-platform-sources-during-compilation)
*   [expected 및 actual 선언의 다른 가시성 수준](#different-visibility-levels-of-expected-and-actual-declarations)

#### 컴파일 중 common 및 platform 소스 분리

이전에는 Kotlin 컴파일러의 설계가 컴파일 시점에 common 및 platform 소스 세트를 분리하는 것을 방해했습니다. 결과적으로 common 코드가 platform 코드에 접근할 수 있었고, 이는 플랫폼 간의 다른 동작을 야기했습니다. 또한, common 코드의 일부 컴파일러 설정 및 의존성이 platform 코드로 유출되곤 했습니다.

Kotlin 2.0.0에서 새로운 Kotlin K2 컴파일러 구현에는 common 및 platform 소스 세트 간의 엄격한 분리를 보장하기 위한 컴파일 스키마 재설계가 포함되었습니다. 이 변경 사항은 [expected 및 actual 함수](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)를 사용할 때 가장 두드러집니다. 이전에는 common 코드의 함수 호출이 platform 코드의 함수로 분석되는 것이 가능했습니다. 예를 들어:

<table>
   <tr>
       <td>Common 코드</td>
       <td>Platform 코드</td>
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
// There is no foo() function overload on the JavaScript platform
```

</td>
</tr>
</table>

이 예시에서 common 코드는 실행되는 플랫폼에 따라 다른 동작을 보입니다.

*   JVM 플랫폼에서 common 코드의 `foo()` 함수를 호출하면 platform 코드의 `foo()` 함수가 `platform foo`로 호출됩니다.
*   JavaScript 플랫폼에서 common 코드의 `foo()` 함수를 호출하면 platform 코드에 해당 함수가 없으므로 common 코드의 `foo()` 함수가 `common foo`로 호출됩니다.

Kotlin 2.0.0에서는 common 코드가 platform 코드에 접근할 수 없으므로, 두 플랫폼 모두 `foo()` 함수를 common 코드의 `foo()` 함수인 `common foo`로 성공적으로 분석합니다.

플랫폼 간의 일관성 향상 외에도, IntelliJ IDEA 또는 Android Studio와 컴파일러 간에 충돌하는 동작이 있는 경우를 수정하기 위해 노력했습니다. 예를 들어, [expected 및 actual 클래스](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)를 사용했을 때 다음과 같은 상황이 발생했습니다.

<table>
   <tr>
       <td>Common 코드</td>
       <td>Platform 코드</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // Before 2.0.0, it triggers an IDE-only error
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class Identity has no default constructor.
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

이 예시에서 expected 클래스 `Identity`에는 기본 생성자가 없으므로 common 코드에서 성공적으로 호출될 수 없습니다. 이전에는 IDE에서만 오류가 보고되었지만, JVM에서는 코드가 성공적으로 컴파일되었습니다. 그러나 이제 컴파일러는 다음 오류를 올바르게 보고합니다.

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 분석 동작이 변경되지 않는 경우

새로운 컴파일 스키마로 마이그레이션하는 과정에 있으므로, 동일한 소스 세트 내에 있지 않은 함수를 호출할 때의 분석 동작은 여전히 동일합니다. 이 차이는 주로 common 코드에서 멀티플랫폼 라이브러리의 오버로드(overload)를 사용할 때 나타납니다.

두 개의 `whichFun()` 함수가 다른 시그니처를 가진 라이브러리가 있다고 가정해 봅시다.

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

common 코드에서 `whichFun()` 함수를 호출하면 라이브러리에서 가장 적합한 인자 타입을 가진 함수가 분석됩니다.

```kotlin
// A project that uses the example library for the JVM target

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

이에 비해, 동일한 소스 세트 내에서 `whichFun()`에 대한 오버로드를 선언하면 common 코드의 함수가 분석됩니다. 이는 코드에 플랫폼별 버전에 대한 접근 권한이 없기 때문입니다.

```kotlin
// Example library isn't used

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

멀티플랫폼 라이브러리와 유사하게, `commonTest` 모듈은 별도의 소스 세트에 있으므로 여전히 플랫폼별 코드에 접근할 수 있습니다. 따라서 `commonTest` 모듈의 함수 호출에 대한 분석은 이전 컴파일 스키마와 동일한 동작을 보입니다.

향후 이러한 나머지 경우도 새로운 컴파일 스키마와 더욱 일관될 것입니다.

#### expected 및 actual 선언의 다른 가시성 수준

Kotlin 2.0.0 이전에는 Kotlin Multiplatform 프로젝트에서 [expected 및 actual 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)을 사용하면 동일한 [가시성 수준](visibility-modifiers.md)을 가져야 했습니다. Kotlin 2.0.0은 이제 다른 가시성 수준도 지원하지만, 실제 선언이 expected 선언보다 _더_ 허용적인 경우에 **만** 가능합니다. 예를 들어:

```kotlin
expect internal class Attribute // Visibility is internal
actual class Attribute          // Visibility is public by default,
                                // which is more permissive
```

마찬가지로, actual 선언에서 [타입 별칭](type-aliases.md)을 사용하는 경우, **기본 타입(underlying type)**의 가시성이 expected 선언과 같거나 더 허용적이어야 합니다. 예를 들어:

```kotlin
expect internal class Attribute                 // Visibility is internal
internal actual typealias Attribute = Expanded

class Expanded                                  // Visibility is public by default,
                                                // which is more permissive
```

## Kotlin K2 컴파일러 활성화 방법

Kotlin 2.0.0부터 Kotlin K2 컴파일러가 기본적으로 활성화됩니다.

Kotlin 버전을 업그레이드하려면 [Gradle](gradle-configure-project.md#apply-the-plugin) 및 [Maven](maven.md#configure-and-enable-the-plugin) 빌드 스크립트에서 2.0.0 또는 그 이후 버전으로 변경하세요.

IntelliJ IDEA 또는 Android Studio에서 최상의 경험을 하려면 IDE에서 [K2 모드를 활성화](#support-in-ides)하는 것을 고려하세요.

### Gradle과 함께 Kotlin 빌드 리포트 사용

Kotlin [빌드 리포트](gradle-compilation-and-caches.md#build-reports)는 Kotlin 컴파일러 작업의 다양한 컴파일 단계에 소요된 시간뿐만 아니라 사용된 컴파일러 및 Kotlin 버전, 그리고 증분 컴파일 여부에 대한 정보를 제공합니다. 이러한 빌드 리포트는 빌드 성능을 평가하는 데 유용합니다. 이는 [Gradle 빌드 스캔](https://scans.gradle.com/)보다 Kotlin 컴파일 파이프라인에 대한 더 많은 통찰력을 제공합니다. 모든 Gradle 작업의 성능 개요를 제공하기 때문입니다.

#### 빌드 리포트 활성화 방법

빌드 리포트를 활성화하려면 `gradle.properties` 파일에 빌드 리포트 출력을 저장할 위치를 선언하세요.

```none
kotlin.build.report.output=file
```

다음 값과 그 조합을 출력에 사용할 수 있습니다.

| 옵션       | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`     | 사람이 읽을 수 있는 형식으로 빌드 리포트를 로컬 파일에 저장합니다. 기본적으로 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`입니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `single_file` | 객체 형식으로 빌드 리포트를 지정된 로컬 파일에 저장합니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `build_scan` | [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 빌드 리포트를 저장합니다. Gradle Enterprise 플러그인은 커스텀 값의 수와 길이를 제한합니다. 대규모 프로젝트에서는 일부 값이 손실될 수 있습니다.                                                                                                                                                                                                                                                                                                                                                                                |
| `http`     | HTTP(S)를 사용하여 빌드 리포트를 게시합니다. POST 메서드는 JSON 형식으로 메트릭을 보냅니다. 전송되는 데이터의 현재 버전은 [Kotlin 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 확인할 수 있습니다. HTTP 엔드포인트의 샘플은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)에서 찾을 수 있습니다. |
| `json`     | JSON 형식으로 빌드 리포트를 로컬 파일에 저장합니다. `kotlin.build.report.json.directory`에서 빌드 리포트의 위치를 설정합니다. 기본적으로 이름은 `${project_name}-build-<date-time>-<index>.json`입니다.                                                                                                                                                                                                                                                                                                                                                                                                                         |

빌드 리포트로 가능한 내용에 대한 자세한 정보는 [빌드 리포트](gradle-compilation-and-caches.md#build-reports)를 참조하세요.

## IDE 지원

IntelliJ IDEA 및 Android Studio의 K2 모드는 K2 컴파일러를 사용하여 코드 분석, 코드 자동 완성 및 하이라이팅을 개선합니다.

IntelliJ IDEA 2025.1부터 K2 모드는 [기본적으로 활성화됩니다](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/).

Android Studio 2024.1부터는 다음 단계를 따라 K2 모드를 활성화할 수 있습니다.

1.  **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동합니다.
2.  **Enable K2 mode** 옵션을 선택합니다.

### 이전 IDE 동작 {initial-collapse-state="collapsed" collapsible="true"}

이전 IDE 동작으로 돌아가려면 K2 모드를 비활성화할 수 있습니다.

1.  **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동합니다.
2.  **Enable K2 mode** 옵션 선택을 해제합니다.

> Kotlin 2.1.0 이후에 [안정(Stable) 단계](components-stability.md#stability-levels-explained)의 언어 기능을 도입할 계획입니다. 그때까지는 코드 분석을 위해 이전 IDE 기능을 계속 사용할 수 있으며, 인식되지 않는 언어 기능으로 인한 코드 하이라이팅 문제는 발생하지 않을 것입니다.
>
{style="note"}

## Kotlin Playground에서 Kotlin K2 컴파일러 사용해보기

Kotlin Playground는 Kotlin 2.0.0 및 이후 릴리스를 지원합니다. [지금 확인해보세요!](https://pl.kotl.in/czuoQprce)

## 이전 컴파일러로 롤백하는 방법

Kotlin 2.0.0 및 이후 릴리스에서 이전 컴파일러를 사용하려면 다음 중 하나를 수행하세요.

*   `build.gradle.kts` 파일에서 [언어 버전을 `1.9`로 설정](gradle-compiler-options.md#example-of-setting-languageversion)합니다.

    또는
*   다음 컴파일러 옵션을 사용합니다: `-language-version 1.9`.

## 변경 사항

새로운 프런트엔드가 도입되면서 Kotlin 컴파일러는 여러 가지 변경을 거쳤습니다. 먼저 코드에 영향을 미치는 가장 중요한 수정 사항들을 강조하고, 무엇이 변경되었는지 설명하며, 앞으로의 모범 사례를 자세히 설명합니다. 더 자세히 알아보려면, 이러한 변경 사항을 [주제 영역별로](#per-subject-area) 정리하여 추가적인 읽기를 용이하게 했습니다.

이 섹션에서는 다음 수정 사항을 강조합니다.

*   [백킹 필드를 가진 open 속성의 즉시 초기화](#immediate-initialization-of-open-properties-with-backing-fields)
*   [프로젝션된 리시버의 합성 세터 Deprecate](#deprecated-synthetics-setter-on-a-projected-receiver)
*   [접근 불가능한 제네릭 타입 사용 금지](#forbidden-use-of-inaccessible-generic-types)
*   [동일한 이름을 가진 Kotlin 속성 및 Java 필드의 일관된 분석 순서](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
*   [Java 원시 타입 배열에 대한 향상된 널 안전성](#improved-null-safety-for-java-primitive-arrays)
*   [expected 클래스의 추상 멤버에 대한 더 엄격한 규칙](#stricter-rules-for-abstract-members-in-expected-classes)

### 백킹 필드를 가진 open 속성의 즉시 초기화

**무엇이 변경되었나요?**

Kotlin 2.0에서는 백킹 필드를 가진 모든 `open` 속성이 즉시 초기화되어야 합니다. 그렇지 않으면 컴파일 오류가 발생합니다. 이전에는 `open var` 속성만 즉시 초기화되어야 했지만, 이제는 백킹 필드를 가진 `open val` 속성으로도 확장됩니다.

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // Error starting with Kotlin 2.0 that earlier compiled successfully 
        this.a = 1 //Error: open val must have initializer
        // Always an error
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

이 변경 사항은 컴파일러의 동작을 더욱 예측 가능하게 만듭니다. `var` 속성이 사용자 정의 세터로 `open val` 속성을 오버라이드하는 예시를 고려해 봅시다.

사용자 정의 세터가 사용되는 경우, 지연 초기화는 백킹 필드를 초기화하려는 것인지 또는 세터를 호출하려는 것인지 불분명하여 혼란을 야기할 수 있습니다. 과거에는 세터를 호출하려 했을 때, 이전 컴파일러는 세터가 백킹 필드를 초기화할 것임을 보장할 수 없었습니다.

**이제 무엇이 모범 사례인가요?**

백킹 필드를 가진 open 속성을 항상 초기화하는 것을 권장합니다. 이는 더 효율적이고 오류 발생 가능성이 적은 방식이라고 생각하기 때문입니다.

그러나 속성을 즉시 초기화하고 싶지 않다면 다음을 수행할 수 있습니다.

*   속성을 `final`로 만듭니다.
*   지연 초기화를 허용하는 private 백킹 속성을 사용합니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-57555)를 참조하세요.

### 프로젝션된 리시버의 합성 세터 Deprecate

**무엇이 변경되었나요?**

Java 클래스의 합성 세터(synthetic setter)를 사용하여 클래스의 프로젝션된 타입과 충돌하는 타입을 할당하면 오류가 발생합니다.

`getFoo()` 및 `setFoo()` 메서드를 포함하는 `Container`라는 Java 클래스가 있다고 가정해 봅시다.

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

`Container` 클래스의 인스턴스가 프로젝션된 타입(projected type)을 가지는 다음 Kotlin 코드가 있는 경우, `setFoo()` 메서드를 사용하면 항상 오류가 발생합니다. 그러나 Kotlin 2.0.0부터는 합성 `foo` 속성도 오류를 발생시킵니다.

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // Error since Kotlin 1.0

    // Synthetic setter `foo` is resolved to the `setFoo()` method
    starProjected.foo = sampleString
    // Error since Kotlin 2.0.0

    inProjected.setFoo(sampleString)
    // Error since Kotlin 1.0

    // Synthetic setter `foo` is resolved to the `setFoo()` method
    inProjected.foo = sampleString
    // Error since Kotlin 2.0.0
}
```

**이제 무엇이 모범 사례인가요?**

이 변경 사항으로 인해 코드에 오류가 발생한다면, 타입 선언 방식을 재고해 볼 수 있습니다. 타입 프로젝션을 사용할 필요가 없거나 코드에서 할당을 제거해야 할 수도 있습니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-54309)를 참조하세요.

### 접근 불가능한 제네릭 타입 사용 금지

**무엇이 변경되었나요?**

K2 컴파일러의 새로운 아키텍처로 인해 접근 불가능한 제네릭 타입(inaccessible generic types)을 처리하는 방식이 변경되었습니다. 일반적으로 접근 불가능한 제네릭 타입을 코드에서 의존해서는 안 됩니다. 이는 프로젝트의 빌드 구성에 오류가 있어 컴파일러가 컴파일에 필요한 정보에 접근할 수 없음을 나타내기 때문입니다. Kotlin 2.0.0에서는 접근 불가능한 제네릭 타입으로 함수 리터럴을 선언하거나 호출할 수 없으며, 접근 불가능한 제네릭 타입 인수를 가진 제네릭 타입을 사용할 수 없습니다. 이 제한은 코드에서 나중에 발생할 수 있는 컴파일러 오류를 방지하는 데 도움이 됩니다.

예를 들어, 하나의 모듈에 제네릭 클래스를 선언했다고 가정해 봅시다.

```kotlin
// Module one
class Node<V>(val value: V)
```

모듈 1에 의존성이 구성된 다른 모듈(모듈 2)이 있는 경우, 코드는 `Node<V>` 클래스에 접근하여 함수 타입에서 타입으로 사용할 수 있습니다.

```kotlin
// Module two
fun execute(func: (Node<Int>) -> Unit) {}
// Function compiles successfully
```

그러나 프로젝트가 모듈 2에만 의존하는 세 번째 모듈(모듈 3)을 갖도록 잘못 구성된 경우, Kotlin 컴파일러는 세 번째 모듈을 컴파일할 때 **모듈 1**의 `Node<V>` 클래스에 접근할 수 없습니다. 이제 모듈 3에서 `Node<V>` 타입을 사용하는 모든 람다 또는 익명 함수는 Kotlin 2.0.0에서 오류를 발생시켜, 코드에서 나중에 피할 수 있는 컴파일러 오류, 크래시 및 런타임 예외를 방지합니다.

```kotlin
// Module three
fun test() {
    // Triggers an error in Kotlin 2.0.0, as the type of the implicit 
    // lambda parameter (it) resolves to Node, which is inaccessible
    execute {}

    // Triggers an error in Kotlin 2.0.0, as the type of the unused 
    // lambda parameter (_) resolves to Node, which is inaccessible
    execute { _ -> }

    // Triggers an error in Kotlin 2.0.0, as the type of the unused
    // anonymous function parameter (_) resolves to Node, which is inaccessible
    execute(fun (_) {})
}
```

접근 불가능한 제네릭 타입의 값 파라미터를 포함하는 함수 리터럴에서 오류가 발생하는 것 외에도, 타입이 접근 불가능한 제네릭 타입 인수를 가질 때도 오류가 발생합니다.

예를 들어, 모듈 1에 동일한 제네릭 클래스 선언이 있습니다. 모듈 2에서는 또 다른 제네릭 클래스인 `Container<C>`를 선언합니다. 또한, 모듈 2에서 제네릭 클래스 `Node<V>`를 타입 인수로 사용하여 `Container<C>`를 사용하는 함수를 선언합니다.

<table>
   <tr>
       <td>모듈 1</td>
       <td>모듈 2</td>
   </tr>
   <tr>
<td>

```kotlin
// Module one
class Node<V>(val value: V)
```

</td>
<td>

```kotlin
// Module two
class Container<C>(vararg val content: C)

// Functions with generic class type that
// also have a generic class type argument
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

모듈 3에서 이 함수들을 호출하려고 하면 Kotlin 2.0.0에서 오류가 발생합니다. 이는 제네릭 클래스 `Node<V>`가 모듈 3에서 접근 불가능하기 때문입니다.

```kotlin
// Module three
fun test() {
    // Triggers an error in Kotlin 2.0.0, as generic class Node<V> is 
    // inaccessible
    consume(produce())
}
```

향후 릴리스에서는 접근 불가능한 타입의 사용을 계속해서 deprecate할 것입니다. Kotlin 2.0.0부터 이미 비제네릭 타입을 포함하여 접근 불가능한 타입이 사용되는 일부 시나리오에 대해 경고를 추가하기 시작했습니다.

예를 들어, 이전 예제와 동일한 모듈 설정을 사용하지만, 제네릭 클래스 `Node<V>`를 비제네릭 클래스 `IntNode`로 변경하고 모든 함수를 모듈 2에 선언해 봅시다.

<table>
   <tr>
       <td>모듈 1</td>
       <td>모듈 2</td>
   </tr>
   <tr>
<td>

```kotlin
// Module one
class IntNode(val value: Int)
```

</td>
<td>

```kotlin
// Module two
// A function that contains a lambda 
// parameter with `IntNode` type
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// Functions with generic class type
// that has `IntNode` as a type argument
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

모듈 3에서 이 함수들을 호출하면 몇 가지 경고가 발생합니다.

```kotlin
// Module three
fun test() {
    // Triggers warnings in Kotlin 2.0.0, as class IntNode is 
    // inaccessible.

    execute {}
    // Class 'IntNode' of the parameter 'it' is inaccessible.

    execute { _ -> }
    execute(fun (_) {})
    // Class 'IntNode' of the parameter '_' is inaccessible.

    // Will trigger a warning in future Kotlin releases, as IntNode is
    // inaccessible.
    consume(produce())
}
```

**이제 무엇이 모범 사례인가요?**

접근 불가능한 제네릭 타입에 대한 새로운 경고가 발생하면 빌드 시스템 구성에 문제가 있을 가능성이 높습니다. 빌드 스크립트와 구성을 확인하는 것이 좋습니다.

최후의 수단으로 모듈 3에 모듈 1에 대한 직접적인 의존성을 구성할 수 있습니다. 또는 동일한 모듈 내에서 타입에 접근할 수 있도록 코드를 수정할 수 있습니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-64474)를 참조하세요.

### 동일한 이름을 가진 Kotlin 속성 및 Java 필드의 일관된 분석 순서

**무엇이 변경되었나요?**

Kotlin 2.0.0 이전에는 서로 상속하고 동일한 이름을 가진 Kotlin 속성과 Java 필드를 포함하는 Java 및 Kotlin 클래스로 작업할 경우, 중복된 이름의 분석 동작이 일관되지 않았습니다. IntelliJ IDEA와 컴파일러 간에도 충돌하는 동작이 있었습니다. Kotlin 2.0.0의 새로운 분석 동작을 개발할 때 사용자에게 미치는 영향을 최소화하는 것을 목표로 했습니다.

예를 들어, `Base`라는 Java 클래스가 있다고 가정해 봅시다.

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

앞서 언급한 `Base` 클래스를 상속하는 `Derived`라는 Kotlin 클래스도 있다고 가정해 봅시다.

```kotlin
class Derived : Base() {
    val a = "aa"

    // Declares custom get() function
    val b get() = "bb"
}

fun main() {
    // Resolves Derived.a
    println(a)
    // aa

    // Resolves Base.b
    println(b)
    // b
}
```

Kotlin 2.0.0 이전에는 `a`가 `Derived` Kotlin 클래스 내의 Kotlin 속성으로 분석되는 반면, `b`는 `Base` Java 클래스의 Java 필드로 분석되었습니다.

Kotlin 2.0.0에서는 예시의 분석 동작이 일관성 있게 바뀌어, Kotlin 속성이 동일한 이름의 Java 필드를 대체하도록 보장합니다. 이제 `b`는 `Derived.b`로 분석됩니다.

> Kotlin 2.0.0 이전에는 IntelliJ IDEA를 사용하여 `a`의 선언이나 사용처로 이동하려고 하면, Kotlin 속성으로 이동해야 하는데도 Java 필드로 잘못 이동했습니다.
>
> Kotlin 2.0.0부터 IntelliJ IDEA는 컴파일러와 동일한 위치로 올바르게 이동합니다.
>
{style="note"}

일반적인 규칙은 서브클래스가 우선순위를 가진다는 것입니다. 이전 예시는 `Derived` 클래스의 Kotlin 속성 `a`가 분석되는 것을 보여주는데, 이는 `Derived`가 `Base` Java 클래스의 서브클래스이기 때문입니다.

상속 관계가 반전되어 Java 클래스가 Kotlin 클래스를 상속하는 경우, 서브클래스의 Java 필드가 동일한 이름의 Kotlin 속성보다 우선순위를 가집니다.

이 예시를 고려해 봅시다.

<table>
   <tr>
       <td>Kotlin</td>
       <td>Java</td>
   </tr>
   <tr>
<td>

```kotlin
open class Base {
    val a = "aa"
}
```

</td>
<td>

```java
public class Derived extends Base {
    public String a = "a";
}
```

</td>
</tr>
</table>

이제 다음 코드에서:

```kotlin
fun main() {
    // Resolves Derived.a
    println(a)
    // a
}
```

**이제 무엇이 모범 사례인가요?**

이 변경 사항이 코드에 영향을 미친다면, 중복된 이름을 정말로 사용해야 하는지 고려해 보세요. 각기 필드나 속성이 동일한 이름을 가지고 서로를 상속하는 Java 또는 Kotlin 클래스를 사용하고 싶다면, 서브클래스의 필드나 속성이 우선순위를 가진다는 점을 명심하세요.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-55017)를 참조하세요.

### Java 원시 타입 배열에 대한 향상된 널 안전성

**무엇이 변경되었나요?**

Kotlin 2.0.0부터 컴파일러는 Kotlin으로 임포트된 Java 원시 타입 배열(primitive arrays)의 널 가능성(nullability)을 올바르게 추론합니다. 이제 Java 원시 타입 배열에 사용된 `TYPE_USE` 어노테이션에서 고유 널 가능성을 유지하며, 어노테이션에 따라 값이 사용되지 않을 경우 오류를 발생시킵니다.

일반적으로 `@Nullable` 및 `@NotNull` 어노테이션이 있는 Java 타입이 Kotlin에서 호출될 때 적절한 고유 널 가능성을 받습니다.

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

그러나 이전에는 Java 원시 타입 배열이 Kotlin으로 임포트될 때 모든 `TYPE_USE` 어노테이션이 손실되어 플랫폼 널 가능성(platform nullability)으로 이어지고 잠재적으로 안전하지 않은 코드가 발생했습니다.

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// No error, even though `dataService.fetchData()` might be `null` according to annotations
// This might result in a NullPointerException
dataService.fetchData()[0]
```
이 문제는 선언 자체의 널 가능성 어노테이션에는 영향을 미치지 않았으며, `TYPE_USE` 어노테이션에만 영향을 미쳤다는 점에 유의하세요.

**이제 무엇이 모범 사례인가요?**

Kotlin 2.0.0에서는 Java 원시 타입 배열에 대한 널 안전성이 이제 Kotlin에서 표준이므로, 이를 사용하는 경우 코드에서 새로운 경고 및 오류를 확인하세요.

*   명시적인 널 가능성 검사 없이 `@Nullable` Java 원시 타입 배열을 사용하거나, 널을 허용하지 않는 원시 타입 배열을 기대하는 Java 메서드에 널을 전달하려고 시도하는 모든 코드는 이제 컴파일에 실패합니다.
*   널 가능성 검사와 함께 `@NotNull` 원시 타입 배열을 사용하면 이제 "Unnecessary safe call" 또는 "Comparison with null always false" 경고가 발생합니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-54521)를 참조하세요.

### expected 클래스의 추상 멤버에 대한 더 엄격한 규칙

> expected 및 actual 클래스는 [베타(Beta) 단계](components-stability.md#stability-levels-explained)입니다. 거의 안정적이지만, 향후 마이그레이션 단계를 수행해야 할 수도 있습니다. 추가 변경 사항을 최소화하기 위해 최선을 다할 것입니다.
>
{style="warning"}

**무엇이 변경되었나요?**

K2 컴파일러를 사용한 컴파일 시 common 및 platform 소스의 분리로 인해 expected 클래스의 추상 멤버에 대한 더 엄격한 규칙을 구현했습니다.

이전 컴파일러에서는 expected 비추상 클래스가 [함수를 오버라이드하지 않고](inheritance.md#overriding-rules) 추상 함수를 상속하는 것이 가능했습니다. 컴파일러가 common 및 platform 코드에 동시에 접근할 수 있었기 때문에 컴파일러는 추상 함수에 상응하는 오버라이드 및 정의가 실제 클래스에 있는지 확인할 수 있었습니다.

이제 common 및 platform 소스가 개별적으로 컴파일되므로, 상속된 함수는 expected 클래스에서 명시적으로 오버라이드되어야 컴파일러가 해당 함수가 추상 함수가 아니라는 것을 알 수 있습니다. 그렇지 않으면 컴파일러는 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 오류를 보고합니다.

예를 들어, 추상 함수 `listFiles()`를 가진 `FileSystem`이라는 추상 클래스를 선언하는 common 소스 세트가 있다고 가정해 봅시다. 플랫폼 소스 세트에서는 실제 선언의 일부로 `listFiles()` 함수를 정의합니다.

common 코드에서 `FileSystem` 클래스를 상속하는 `PlatformFileSystem`이라는 expected 비추상 클래스가 있는 경우, `PlatformFileSystem` 클래스는 추상 함수 `listFiles()`를 상속합니다. 그러나 Kotlin에서는 비추상 클래스에 추상 함수를 가질 수 없습니다. `listFiles()` 함수를 비추상 함수로 만들려면 `abstract` 키워드 없이 오버라이드로 선언해야 합니다.

<table>
   <tr>
       <td>Common 코드</td>
       <td>Platform 코드</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // In Kotlin 2.0.0, an explicit override is needed
    expect override fun listFiles()
    // Before Kotlin 2.0.0, an override wasn't needed
}
```

</td>
<td>

```kotlin
actual open class PlatformFileSystem : FileSystem {
    actual override fun listFiles() {}
}
```

</td>
</tr>
</table>

**이제 무엇이 모범 사례인가요?**

expected 비추상 클래스에서 추상 함수를 상속하는 경우, 비추상 오버라이드를 추가하세요.

자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual)의 해당 이슈를 참조하세요.

### 주제 영역별

이 주제 영역들은 코드에 영향을 미칠 가능성이 낮지만, 더 자세한 내용을 위해 관련 YouTrack 이슈 링크를 제공합니다. 이슈 ID 옆에 별표(*)가 있는 변경 사항은 섹션 시작 부분에 설명되어 있습니다.

#### 타입 추론 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                         |
|:----------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 타입이 명시적으로 Normal인 경우 컴파일된 함수 시그니처의 속성 참조에 잘못된 타입이 포함됨                      |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 빌더 추론 컨텍스트에서 상위 바운드로 타입 변수를 암시적으로 추론하는 것을 금지                             |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2: 배열 리터럴에서 제네릭 어노테이션 호출에 명시적 타입 인자 요구                                   |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 교차 타입에 대한 서브타이핑 검사 누락                                                                |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | Kotlin에서 Java 타입 파라미터 기반 타입의 기본 표현 변경                                         |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 접두사 증가의 추론된 타입을 `inc()` 연산자의 반환 타입 대신 게터의 반환 타입으로 변경             |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2: 공변 파라미터에 `@UnsafeVariance` 사용 여부에 의존하는 것을 중단                                |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2: raw 타입에 대해 하위 멤버로의 분석 금지                                                         |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2: 확장 함수 파라미터가 있는 호출 가능 항목에 대한 호출 가능 참조의 타입 올바르게 추론                |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 분해 변수의 실제 타입을 지정된 경우 명시적 타입과 일관성 있게 유지                               |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2: 정수 리터럴 오버플로와 관련된 일관성 없는 동작 수정                                          |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 익명 함수에서 타입 인수를 통해 익명 타입을 노출할 수 있음                                         |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | `break`가 있는 `while` 루프의 조건이 불안정한 스마트 캐스트를 생성할 수 있음                     |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2: expect/actual 최상위 속성에 대한 common 코드의 스마트 캐스트 금지                         |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 반환 타입을 변경하는 증가 및 더하기 연산자는 스마트 캐스트에 영향을 미쳐야 함                       |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2: 변수 타입을 명시적으로 지정하면 K1에서 작동했던 일부 바운드 스마트 캐스트가 깨짐      |

#### 제네릭 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                    | 제목                                                                                                                                              |
|:-----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [프로젝션된 리시버의 합성 세터 사용 Deprecate](#deprecated-synthetics-setter-on-a-projected-receiver)                                          |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)  | raw 타입 파라미터가 있는 Java 메서드를 제네릭 타입 파라미터로 오버라이드하는 것을 금지                                             |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)  | 널 가능성이 있는 타입 파라미터를 `in` 프로젝션된 DNN 파라미터로 전달하는 것을 금지                                              |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)  | 타입 별칭 생성자에서 상위 바운드 위반 Deprecate                                                                             |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)  | Java 클래스 기반의 공변 캡처 타입에 대한 타입 불건전성 수정                                                                   |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)  | 자기 상위 바운드 및 캡처 타입이 있는 불건전한 코드 금지                                                                     |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)  | 제네릭 외부 클래스의 제네릭 내부 클래스에서 불건전한 바운드 위반 금지                                                     |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923)  | K2: 내부 클래스의 외부 상위 타입 프로젝션에 대해 `PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE` 도입                        |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243)  | 다른 상위 타입의 추가 특수화된 구현이 있는 원시 타입 컬렉션에서 상속할 때 `MANY_IMPL_MEMBER_NOT_IMPLEMENTED` 보고              |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305)  | K2: 확장 타입에 분산(variance) 수정자가 있는 타입 별칭에 대한 생성자 호출 및 상속 금지                               |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965)  | 자기 상위 바운드를 가진 캡처 타입의 부적절한 처리로 인한 타입 홀(type hole) 수정                                          |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966)  | 제네릭 파라미터에 대해 잘못된 타입을 가진 제네릭 위임 생성자 호출 금지                                                 |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712)  | 상위 바운드가 캡처된 타입일 때 누락된 상위 바운드 위반 보고                                                         |

#### 분석 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                    | 제목                                                                                                                                                                  |
|:-----------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [오버로드 분석 시 기본 클래스의 Java 필드보다 파생 클래스의 Kotlin 속성 선택](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)  | invoke 컨벤션이 예상된 desugaring과 일관성 있게 작동하도록 함                                                                                        |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866)  | K2: 컴패니언 객체가 static 스코프보다 선호될 때 한정자 분석 동작 변경                                                                             |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)  | 타입 분석 시 동일한 이름의 클래스가 스타 임포트(star imported)될 때 모호성 오류 보고                                                         |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558)  | K2: `COMPATIBILITY_WARNING` 주변 분석 마이그레이션                                                                                              |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)  | 동일한 의존성의 두 가지 다른 버전에 의존성 클래스가 포함될 때 `CONFLICTING_INHERITED_MEMBERS` 오류 보고 누락                                   |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)  | 리시버가 있는 함수 타입의 속성 호출이 확장 함수 호출보다 선호됨                                                                                 |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666)  | 한정된 `this`: 타입 케이스로 한정된 `this` 도입/우선순위 부여                                                                                 |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166)  | 클래스패스에서 FQ 이름 충돌 시 지정되지 않은 동작 확인                                                                                       |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431)  | K2: import에서 타입 별칭을 한정자로 사용하는 것을 금지                                                                                      |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520)  | K1/K2: 하위 수준에서 모호성이 있는 타입 참조에 대한 분석 타워의 잘못된 작동                                                                 |

#### 가시성 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                     | 제목                                                                                                                                           |
|:------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474)*  | [접근 불가능한 타입의 사용을 지정되지 않은 동작으로 선언](#forbidden-use-of-inaccessible-generic-types)                                         |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)   | 내부 인라인 함수에서 private 클래스 컴패니언 객체 멤버를 호출할 때 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 오류 보고 누락                      |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042)   | 동등한 게터가 보이지 않더라도(override된 선언이 보이더라도) 합성 속성을 보이지 않게 함                                               |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255)   | 다른 모듈의 파생 클래스에서 내부 세터에 접근하는 것을 금지                                                                         |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)   | private 인라인 함수에서 익명 타입을 노출하는 것을 금지                                                                           |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)   | public API 인라인 함수에서 암시적인 비공개 API 접근을 금지                                                                       |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310)   | 스마트 캐스트는 protected 멤버의 가시성에 영향을 미치지 않아야 함                                                                  |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494)   | public 인라인 함수에서 간과된 private 연산자 함수에 대한 접근을 금지                                                       |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004)   | K1: protected val을 오버라이드하는 var의 세터가 public으로 생성됨                                                          |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972)   | Kotlin/Native의 링크 타임에서 private 멤버에 의한 오버라이딩을 금지                                                          |

#### 어노테이션 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                        |
|:----------------------------------------------------------|:------------------------------------------------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | `EXPRESSION` 타겟이 없는 어노테이션으로 구문(statement)에 어노테이션을 다는 것을 금지                      |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | `REPEATED_ANNOTATION` 검사 시 괄호 표현식 무시                                                     |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2: 속성 게터에 대한 사용 지점(use-site) 'get' 타겟 어노테이션 사용 금지                                     |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | `where` 절의 타입 파라미터에 어노테이션을 다는 것을 금지                                                |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 컴패니언 객체의 어노테이션 분석 시 컴패니언 스코프가 무시됨                                                 |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2: 사용자 정의 어노테이션과 컴파일러 필수 어노테이션 간의 모호성 발생                                     |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | enum 값의 어노테이션은 enum 값 클래스로 복사되지 않아야 함                                                 |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2: `WRONG_ANNOTATION_TARGET`이 `()`?로 래핑된 타입의 호환되지 않는 어노테이션에 대해 보고됨        |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2: `WRONG_ANNOTATION_TARGET`이 catch 파라미터 타입의 어노테이션에 대해 보고됨                     |

#### 널 안전성 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                    | 제목                                                                                                                |
|:-----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [Java에서 Nullable로 어노테이션된 배열 타입의 안전하지 않은 사용 Deprecate](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)  | K2: 안전 호출과 컨벤션 연산자의 조합에 대한 평가 의미론 변경                                                         |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850)  | 상위 타입 순서가 상속된 함수의 널 가능성 파라미터를 정의함                                                           |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)  | public 시그니처에서 지역 타입을 근사화할 때 널 가능성 유지                                                       |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)  | 널이 될 수 있는 값을 널이 아닌 Java 필드에 안전하지 않은 할당의 선택자로 할당하는 것을 금지                             |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209)  | 경고 수준 Java 타입의 오류 수준 널 가능 인수에 대한 누락된 오류 보고                                                   |

#### Java 상호 운용성 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                |
|:----------------------------------------------------------|:------------------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 소스에서 동일한 FQ 이름을 가진 Java 및 Kotlin 클래스 금지                            |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | Java 컬렉션을 상속한 클래스가 상위 타입의 순서에 따라 일관성 없는 동작을 보임        |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2: Kotlin private 클래스를 상속한 Java 클래스의 경우 지정되지 않은 동작            |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | Java vararg 메서드를 인라인 함수로 전달하면 런타임에 배열 대신 배열의 배열이 됨      |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | K-J-K 계층 구조에서 내부 멤버 오버라이딩 허용                                       |

#### 속성 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                    | 제목                                                                                                                    |
|:-----------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 백킹 필드를 가진 open 속성의 지연 초기화 금지](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | 기본 생성자가 없거나 클래스가 로컬인 경우 누락된 `MUST_BE_INITIALIZED` Deprecate             |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | 속성에 대한 잠재적 호출 시 재귀적 분석 금지                                                                  |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 기본 클래스가 다른 모듈에서 온 경우 보이지 않는 파생 클래스의 기본 클래스 속성에 대한 스마트 캐스트 Deprecate    |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2: 데이터 클래스 속성에 대한 `OPT_IN_USAGE_ERROR` 누락                                              |

#### 제어 흐름 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                               |
|:----------------------------------------------------------|:-------------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1과 K2 간의 클래스 초기화 블록에서 CFA의 일관성 없는 규칙         |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | 괄호 안의 `else` 분기가 없는 `if` 조건문의 K1/K2 불일치          |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 스코프 함수에서 초기화가 있는 try/catch 블록에서 잘못된 `VAL_REASSIGNMENT` |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | try 블록에서 catch 및 finally 블록으로 데이터 흐름 정보 전파     |

#### Enum 클래스 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                        |
|:----------------------------------------------------------|:----------------------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | enum 엔트리 초기화 중 enum 클래스의 컴패니언 객체 접근 금지                 |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | enum 클래스의 가상 인라인 메서드에 대한 누락된 오류 보고                    |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 속성/필드와 enum 엔트리 간의 모호성 분석 보고                               |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 컴패니언 속성이 enum 엔트리보다 선호될 때 한정자 분석 동작 변경             |

#### 함수형(SAM) 인터페이스 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                   |
|:----------------------------------------------------------|:---------------------------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 어노테이션 없이 OptIn이 필요한 SAM 생성자 사용 Deprecate                               |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | JDK 함수 인터페이스의 SAM 생성자에 대한 람다에서 잘못된 널 가능성을 가진 값 반환 금지 |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 호출 가능 참조의 파라미터 타입 SAM 변환이 CCE로 이어짐                                 |

#### 컴패니언 객체 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                 |
|:----------------------------------------------------------|:---------------------------------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 컴패니언 객체 멤버에 대한 호출 외부 참조가 잘못된 시그니처를 가짐    |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | V에 컴패니언이 있을 때 `(V)::foo` 참조 분석 변경                   |

#### 기타 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                    | 제목                                                                                                                                              |
|:-----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | K2/MPP: 구현이 actual counterpart에 있을 때 common 코드의 상속자에 대해 `ABSTRACT_MEMBER_NOT_IMPLEMENTED`를 보고함                             |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | 한정된 `this`: 잠재적 레이블 충돌 시 동작 변경                                                                                             |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | Java 서브클래스에서 의도치 않은 충돌 오버로드의 경우 JVM 백엔드에서 잘못된 함수 맹글링 수정                                                 |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LC 이슈] 구문 위치에서 suspend로 표시된 익명 함수 선언 금지                                                                                 |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn: 마커 아래에서 기본 인수를 가진 생성자 호출 금지                                                                                     |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | 변수에 대한 표현식 + invoke 분석에 대해 Unit 변환이 우연히 허용됨                                                                        |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199)  | KFunction으로의 적응이 있는 호출 가능 참조 승격 금지                                                                                    |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2가 `false && ...` 및 `false \|\| ...`을 깨뜨림                                                                             |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] `header`/`impl` 키워드 Deprecate                                                                                                  |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | 기본적으로 invokedynamic + LambdaMetafactory를 통해 모든 Kotlin 람다 생성                                                               |

## Kotlin 릴리스와의 호환성

다음 Kotlin 릴리스는 새로운 K2 컴파일러를 지원합니다.

| Kotlin 릴리스        | 안정성 수준 |
|--------------------|-------------|
| 2.0.0–%kotlinVersion% | Stable      |
| 1.9.20–1.9.25      | Beta        |
| 1.9.0–1.9.10       | JVM is Beta |
| 1.7.0–1.8.22       | Alpha       |

## Kotlin 라이브러리와의 호환성

Kotlin/JVM으로 작업하는 경우 K2 컴파일러는 모든 버전의 Kotlin으로 컴파일된 라이브러리와 호환됩니다.

Kotlin Multiplatform으로 작업하는 경우 K2 컴파일러는 Kotlin 버전 1.9.20 이상으로 컴파일된 라이브러리와 호환됨이 보장됩니다.

## 컴파일러 플러그인 지원

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
*   [Serialization](serialization.md)

또한 Kotlin K2 컴파일러는 다음을 지원합니다.

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 컴파일러 플러그인 및 이후 버전.
*   [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 이후의 [Kotlin Symbol Processing (KSP)](ksp-overview.md).

> 추가 컴파일러 플러그인을 사용하는 경우, 해당 문서를 확인하여 K2와 호환되는지 확인하세요.
>
{style="tip"}

### 사용자 정의 컴파일러 플러그인 업그레이드

> 사용자 정의 컴파일러 플러그인은 [실험 단계(Experimental)](components-stability.md#stability-levels-explained)인 플러그인 API를 사용합니다. 결과적으로 API는 언제든지 변경될 수 있으므로, 하위 호환성을 보장할 수 없습니다.
>
{style="warning"}

업그레이드 프로세스는 사용자 정의 플러그인의 유형에 따라 두 가지 경로가 있습니다.

#### 백엔드 전용 컴파일러 플러그인

플러그인이 `IrGenerationExtension` 확장 지점만 구현하는 경우, 프로세스는 다른 새 컴파일러 릴리스와 동일합니다. 사용하는 API에 변경 사항이 있는지 확인하고 필요한 경우 변경하세요.

#### 백엔드 및 프런트엔드 컴파일러 플러그인

플러그인이 프런트엔드 관련 확장 지점을 사용하는 경우, 새로운 K2 컴파일러 API를 사용하여 플러그인을 재작성해야 합니다. 새로운 API에 대한 소개는 [FIR 플러그인 API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)를 참조하세요.

> 사용자 정의 컴파일러 플러그인 업그레이드에 대한 질문이 있는 경우, [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slack 채널에 참여해 주시면 최선을 다해 도와드리겠습니다.
>
{style="note"}

## 새로운 K2 컴파일러에 대한 피드백 공유

모든 피드백을 환영합니다!

*   새로운 K2 컴파일러로 마이그레이션하면서 겪는 문제점은 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)에 보고해주세요.
*   [사용 통계 전송 옵션](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)을 활성화하여 JetBrains가 K2 사용에 대한 익명 데이터를 수집하도록 허용해주세요.