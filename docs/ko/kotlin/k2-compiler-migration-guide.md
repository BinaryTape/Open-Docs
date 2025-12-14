[//]: # (title: K2 컴파일러 마이그레이션 가이드)

Kotlin 언어와 생태계가 계속 발전해 왔듯이 Kotlin 컴파일러도 마찬가지였습니다. 첫 번째 단계는 논리를 공유하여 다양한 플랫폼의 대상에 대한 코드 생성을 단순화하는 새로운 JVM 및 JS IR(Intermediate Representation) 백엔드를 도입하는 것이었습니다. 이제 그 진화의 다음 단계는 K2라고 알려진 새로운 프런트엔드를 선보입니다.

![Kotlin K2 컴파일러 아키텍처](k2-compiler-architecture.svg){width=700}

K2 컴파일러의 등장으로 Kotlin 프런트엔드는 완전히 재작성되었으며, 새롭고 더욱 효율적인 아키텍처를 특징으로 합니다. 새 컴파일러가 가져오는 근본적인 변화는 더 많은 의미론적 정보(semantic information)를 포함하는 하나의 통합된 데이터 구조를 사용하는 것입니다. 이 프런트엔드는 의미론적 분석(semantic analysis), 호출 분석(call resolution), 타입 추론(type inference)을 수행하는 역할을 합니다.

새로운 아키텍처와 풍부해진 데이터 구조는 K2 컴파일러가 다음 이점을 제공할 수 있도록 합니다:

*   **향상된 호출 분석 및 타입 추론**. 컴파일러가 더욱 일관성 있게 동작하며 코드를 더 잘 이해합니다.
*   **새로운 언어 기능에 대한 구문 설탕(syntactic sugar) 도입 용이성**. 미래에는 새로운 기능이 도입될 때 더 간결하고 읽기 쉬운 코드를 사용할 수 있게 될 것입니다.
*   **더 빠른 컴파일 시간**. 컴파일 시간은 [상당히 빨라질 수 있습니다](#performance-improvements).
*   **향상된 IDE 성능**. 2025.1부터 IntelliJ IDEA는 K2 모드를 사용하여 Kotlin 코드를 분석하며, 안정성을 높이고 성능 개선을 제공합니다. 자세한 내용은 [IDE 지원](#support-in-ides)을 참조하세요.

이 가이드는 다음을 설명합니다:

*   새로운 K2 컴파일러의 이점을 설명합니다.
*   마이그레이션 중 발생할 수 있는 변경 사항과 그에 따라 코드를 조정하는 방법을 강조합니다.
*   이전 버전으로 롤백하는 방법을 설명합니다.

> 새로운 K2 컴파일러는 2.0.0부터 기본적으로 활성화됩니다. Kotlin 2.0.0에서 제공되는 새로운 기능과 새로운 K2 컴파일러에 대한 자세한 내용은 [Kotlin 2.0.0의 새로운 기능](whatsnew20.md)을 참조하세요.
>
{style="note"}

## 성능 개선

K2 컴파일러의 성능을 평가하기 위해, 우리는 두 개의 오픈소스 프로젝트인 [Anki-Android](https://github.com/ankidroid/Anki-Android)와 [Exposed](https://github.com/JetBrains/Exposed)에 대한 성능 테스트를 실행했습니다. 다음은 우리가 발견한 주요 성능 개선 사항입니다:

*   K2 컴파일러는 컴파일 속도를 최대 94% 향상시킵니다. 예를 들어, Anki-Android 프로젝트에서 클린 빌드 시간은 Kotlin 1.9.23의 57.7초에서 Kotlin 2.0.0의 29.7초로 단축되었습니다.
*   K2 컴파일러를 사용하면 초기화 단계가 최대 488% 더 빨라집니다. 예를 들어, Anki-Android 프로젝트에서 증분 빌드(incremental builds)의 초기화 단계는 Kotlin 1.9.23의 0.126초에서 Kotlin 2.0.0의 0.022초로 단축되었습니다.
*   Kotlin K2 컴파일러는 이전 컴파일러에 비해 분석 단계에서 최대 376% 더 빠릅니다. 예를 들어, Anki-Android 프로젝트에서 증분 빌드의 분석 시간은 Kotlin 1.9.23의 0.581초에서 Kotlin 2.0.0의 0.122초로 대폭 단축되었습니다.

이러한 개선 사항에 대한 자세한 내용과 K2 컴파일러의 성능을 분석한 방법에 대해 자세히 알아보려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)을 참조하세요.

## 언어 기능 개선

Kotlin K2 컴파일러는 [스마트 캐스팅](#smart-casts) 및 [Kotlin Multiplatform](#kotlin-multiplatform)과 관련된 언어 기능을 개선합니다.

### 스마트 캐스트

Kotlin 컴파일러는 특정 경우에 객체를 타입으로 자동 캐스트하여 명시적으로 지정할 필요를 덜어줍니다. 이를 [스마트 캐스팅](typecasts.md#smart-casts)이라고 합니다. Kotlin K2 컴파일러는 이제 이전보다 더 많은 시나리오에서 스마트 캐스트를 수행합니다.

Kotlin 2.0.0에서는 다음 영역에서 스마트 캐스트와 관련된 개선이 이루어졌습니다:

*   [지역 변수 및 추가 스코프](#local-variables-and-further-scopes)
*   [논리 `or` 연산자를 사용한 타입 검사](#type-checks-with-the-logical-or-operator)
*   [인라인 함수](#inline-functions)
*   [함수 타입 프로퍼티](#properties-with-function-types)
*   [예외 처리](#exception-handling)
*   [증가 및 감소 연산자](#increment-and-decrement-operators)

#### 지역 변수 및 추가 스코프

이전에는 변수가 `if` 조건 내에서 `null`이 아님으로 평가되면, 해당 변수는 스마트 캐스트되었습니다. 이 변수에 대한 정보는 `if` 블록의 스코프 내에서 추가로 공유되었습니다.

하지만 `if` 조건 **외부**에서 변수를 선언한 경우, `if` 조건 내에서 해당 변수에 대한 정보를 사용할 수 없었으므로 스마트 캐스트될 수 없었습니다. 이러한 동작은 `when` 표현식과 `while` 루프에서도 나타났습니다.

Kotlin 2.0.0부터는 `if`, `when`, `while` 조건에서 변수를 사용하기 전에 선언하면, 컴파일러가 해당 변수에 대해 수집한 모든 정보가 스마트 캐스팅을 위해 해당 블록에서 접근 가능해집니다.

이는 불리언 조건을 변수로 추출하는 등의 작업을 할 때 유용할 수 있습니다. 그렇게 하면 변수에 의미 있는 이름을 부여하여 코드 가독성을 높이고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들어:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0.0에서는 컴파일러가 isCat에 대한
        // 정보에 접근할 수 있으므로, animal이 Cat 타입으로
        // 스마트 캐스트되었음을 압니다.
        // 따라서 purr() 함수를 호출할 수 있습니다.
        // Kotlin 1.9.20에서는 컴파일러가 스마트 캐스트에 대해
        // 알지 못하므로, purr() 함수를 호출하면
        // 오류가 발생합니다.
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

Kotlin 2.0.0에서는 객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면, 가장 가까운 공통 슈퍼타입으로 스마트 캐스트가 수행됩니다. 이 변경 전에는 스마트 캐스트가 항상 `Any` 타입으로 수행되었습니다.

이 경우, 객체의 프로퍼티에 접근하거나 함수를 호출하기 전에 여전히 수동으로 객체 타입을 확인해야 했습니다. 예를 들어:

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
        // Kotlin 2.0.0 이전에는 signalStatus가 
        // Any 타입으로 스마트 캐스트되었으므로, signal() 함수를 호출하면
        // Unresolved reference 오류가 발생했습니다. signal() 함수는 
        // 다른 타입 검사 후에만 성공적으로 호출될 수 있었습니다:
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 공통 슈퍼타입은 [유니온 타입](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은 [현재 Kotlin에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

#### 인라인 함수

Kotlin 2.0.0에서는 K2 컴파일러가 인라인 함수를 다르게 처리하여, 다른 컴파일러 분석과 결합하여 스마트 캐스트를 안전하게 수행할 수 있는지 여부를 결정할 수 있도록 합니다.

구체적으로, 인라인 함수는 이제 암시적인 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 갖는 것으로 처리됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 그 자리에서(in place) 호출된다는 의미입니다. 람다 함수가 그 자리에서 호출되므로, 컴파일러는 람다 함수가 함수 본문에 포함된 어떤 변수에 대한 참조도 유출할 수 없다는 것을 압니다.

컴파일러는 이 지식을 다른 컴파일러 분석과 함께 사용하여 캡처된 변수(captured variables) 중 어느 것을 스마트 캐스트하는 것이 안전한지 결정합니다. 예를 들어:

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
        // 지역 변수이고 inlineAction()이 인라인 함수임을 알기 때문에, 
        // processor에 대한 참조가 유출될 수 없습니다. 따라서 
        // processor를 스마트 캐스트하는 것이 안전합니다.
      
        // processor가 null이 아니면, processor는 스마트 캐스트됩니다.
        if (processor != null) {
            // 컴파일러는 processor가 null이 아님을 알기 때문에 안전 호출이 필요하지 않습니다.
            processor.process()

            // Kotlin 1.9.20에서는 안전 호출을 수행해야 합니다:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 함수 타입 프로퍼티

이전 Kotlin 버전에서는 함수 타입을 가진 클래스 프로퍼티가 스마트 캐스트되지 않는 버그가 있었습니다. Kotlin 2.0.0과 K2 컴파일러에서 이 동작을 수정했습니다. 예를 들어:

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // Kotlin 2.0.0에서는 provider가 null이 아니면,
        // 스마트 캐스트됩니다.
        if (provider != null) {
            // 컴파일러는 provider가 null이 아님을 압니다.
            provider()

            // 1.9.20에서는 컴파일러가 provider가 null이 아님을 알지 못하므로, 
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
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 예외 처리

Kotlin 2.0.0에서는 예외 처리(exception handling)에 개선이 이루어져, 스마트 캐스트 정보가 `catch` 및 `finally` 블록으로 전달될 수 있습니다. 이 변경으로 인해 컴파일러가 객체가 nullable 타입인지 여부를 추적하므로 코드가 더 안전해집니다. 예를 들어:

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

        // 예외를 발생시킵니다.
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0에서는 컴파일러가 stringInput이 
        // null일 수 있음을 알기 때문에 stringInput은 nullable 상태를 유지합니다.
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling" validate="false"}

#### 증가 및 감소 연산자

Kotlin 2.0.0 이전에는 컴파일러가 증가 또는 감소 연산자를 사용한 후 객체의 타입이 변경될 수 있다는 것을 이해하지 못했습니다. 컴파일러가 객체 타입을 정확하게 추적할 수 없었기 때문에 코드에서 unresolved reference 오류가 발생할 수 있었습니다. Kotlin 2.0.0에서는 이 문제가 해결되었습니다:

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
    // 참고로, unknownObject는 Rho와 Tau 인터페이스를 모두 상속할 수 있습니다.
    if (unknownObject is Tau) {

        // Rho 인터페이스의 오버로드된 inc() 연산자를 사용합니다.
        // Kotlin 2.0.0에서는 unknownObject의 타입이 Sigma로 스마트 캐스트됩니다.
        ++unknownObject

        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입을 가짐을 알기 때문에,
        // sigma() 함수를 성공적으로 호출할 수 있습니다.
        unknownObject.sigma()

        // Kotlin 1.9.20에서는 inc()가 호출될 때 컴파일러가 스마트 캐스트를 수행하지 않으므로
        // 컴파일러는 여전히 unknownObject가 Tau 타입을 가진다고 생각합니다. sigma() 함수를 호출하면 
        // 컴파일 타임 오류가 발생합니다.
        
        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입을 가짐을 알기 때문에,
        // tau() 함수를 호출하면 컴파일 타임 오류가 발생합니다.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // Kotlin 1.9.20에서는 컴파일러가 unknownObject가 실수로 Tau 타입을 가진다고 생각하므로, 
        // tau() 함수를 호출할 수 있지만, ClassCastException이 발생합니다.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform

K2 컴파일러에는 Kotlin Multiplatform과 관련된 다음 영역에서 개선 사항이 있습니다:

*   [컴파일 시 공통 및 플랫폼 소스 분리](#separation-of-common-and-platform-sources-during-compilation)
*   [예상 및 실제 선언의 다른 가시성 수준](#different-visibility-levels-of-expected-and-actual-declarations)

#### 컴파일 시 공통 및 플랫폼 소스 분리

이전에는 Kotlin 컴파일러 설계상 공통 소스 세트와 플랫폼 소스 세트를 컴파일 시 분리할 수 없었습니다. 그 결과 공통 코드가 플랫폼 코드에 접근할 수 있었고, 이는 플랫폼 간의 다른 동작을 초래했습니다. 또한, 공통 코드의 일부 컴파일러 설정 및 종속성이 플랫폼 코드로 유출되기도 했습니다.

Kotlin 2.0.0에서는 새로운 Kotlin K2 컴파일러 구현에 컴파일 스키마 재설계가 포함되어 공통 소스 세트와 플랫폼 소스 세트 간의 엄격한 분리를 보장합니다. 이 변경은 [예상(expected) 및 실제(actual) 함수](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-functions)를 사용할 때 가장 두드러집니다. 이전에는 공통 코드의 함수 호출이 플랫폼 코드의 함수로 해석되는 것이 가능했습니다. 예를 들어:

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

이 예제에서 공통 코드는 실행되는 플랫폼에 따라 다른 동작을 보입니다:

*   JVM 플랫폼에서 공통 코드의 `foo()` 함수를 호출하면 플랫폼 코드의 `foo()` 함수가 `platform foo`로 호출됩니다.
*   JavaScript 플랫폼에서 공통 코드의 `foo()` 함수를 호출하면 플랫폼 코드에 해당 함수가 없으므로 공통 코드의 `foo()` 함수가 `common foo`로 호출됩니다.

Kotlin 2.0.0에서는 공통 코드가 플랫폼 코드에 접근할 수 없으므로, 두 플랫폼 모두 `foo()` 함수를 공통 코드의 `foo()` 함수(`common foo`)로 성공적으로 해석합니다.

플랫폼 간 동작 일관성 향상 외에도, IntelliJ IDEA 또는 Android Studio와 컴파일러 사이에 동작 충돌이 발생하는 경우를 해결하기 위해 노력했습니다. 예를 들어, [예상 및 실제 클래스](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-classes)를 사용할 때 다음이 발생했습니다:

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
    // 2.0.0 이전에는 IDE에서만 오류가 발생합니다.
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : 예상 클래스 Identity에는 기본 생성자가 없습니다.
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

이 예제에서 예상 클래스 `Identity`에는 기본 생성자가 없으므로 공통 코드에서 성공적으로 호출될 수 없습니다. 이전에는 IDE에서만 오류가 보고되었지만, JVM에서는 코드가 여전히 성공적으로 컴파일되었습니다. 그러나 이제 컴파일러는 다음 오류를 올바르게 보고합니다:

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 해석 동작이 변경되지 않는 경우

새로운 컴파일 스키마로 마이그레이션하는 과정에 있으므로, 동일한 소스 세트 내에 있지 않은 함수를 호출할 때 해석 동작은 여전히 동일합니다. 이 차이는 주로 공통 코드에서 멀티플랫폼 라이브러리의 오버로드(overloads)를 사용할 때 두드러집니다.

서로 다른 시그니처를 가진 두 개의 `whichFun()` 함수를 포함하는 라이브러리가 있다고 가정해 봅시다:

```kotlin
// 예제 라이브러리

// 모듈: 공통
fun whichFun(x: Any) = println("common function") 

// 모듈: JVM
fun whichFun(x: Int) = println("platform function")
```

공통 코드에서 `whichFun()` 함수를 호출하면, 라이브러리에서 가장 관련성 높은 인자 타입을 가진 함수가 해석됩니다:

```kotlin
// JVM 타겟용 예제 라이브러리를 사용하는 프로젝트

// 모듈: 공통
fun main(){
    whichFun(2) 
    // platform function
}
```

이에 비해, 동일한 소스 세트 내에서 `whichFun()`에 대한 오버로드를 선언하면, 코드가 플랫폼별 버전에 접근할 수 없기 때문에 공통 코드의 함수가 해석됩니다:

```kotlin
// 예제 라이브러리가 사용되지 않음

// 모듈: 공통
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// 모듈: JVM
fun whichFun(x: Int) = println("platform function")
```

멀티플랫폼 라이브러리와 유사하게, `commonTest` 모듈은 별도의 소스 세트에 있으므로 여전히 플랫폼별 코드에 접근할 수 있습니다. 따라서 `commonTest` 모듈의 함수 호출 해석은 이전 컴파일 스키마와 동일한 동작을 보입니다.

미래에는 이러한 나머지 경우들이 새로운 컴파일 스키마와 더 일관성을 갖게 될 것입니다.

#### 예상 및 실제 선언의 다른 가시성 수준

Kotlin 2.0.0 이전에는 Kotlin Multiplatform 프로젝트에서 [예상 및 실제 선언](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)을 사용할 경우 동일한 [가시성 수준](visibility-modifiers.md)을 가져야 했습니다. Kotlin 2.0.0은 이제 다른 가시성 수준도 지원하지만, 이는 실제 선언이 예상 선언보다 _더_ 관대(permissive)한 경우에 **만** 해당됩니다. 예를 들어:

```kotlin
expect internal class Attribute // 가시성은 internal
actual class Attribute          // 기본적으로 public 가시성,
                                // 더 관대함
```

마찬가지로, 실제 선언에서 [타입 별칭(type alias)](type-aliases.md)을 사용하는 경우, **기저 타입(underlying type)**의 가시성은 예상 선언과 같거나 더 관대해야 합니다. 예를 들어:

```kotlin
expect internal class Attribute                 // 가시성은 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 기본적으로 public 가시성,
                                                // 더 관대함
```

## Kotlin K2 컴파일러 활성화 방법

Kotlin 2.0.0부터 Kotlin K2 컴파일러는 기본적으로 활성화됩니다.

Kotlin 버전을 업그레이드하려면, [Gradle](gradle-configure-project.md#apply-the-plugin) 및 [Maven](maven.md#configure-and-enable-the-plugin) 빌드 스크립트에서 2.0.0 또는 그 이후 릴리스로 변경하세요.

Android Studio에서 최상의 경험을 위해 IDE에서 [K2 모드](#support-in-ides)를 사용하세요. IntelliJ IDEA는 K2 모드를 기본적으로 사용하므로 변경할 필요가 없습니다.

### Gradle과 함께 Kotlin 빌드 리포트 사용

Kotlin [빌드 리포트](gradle-compilation-and-caches.md#build-reports)는 Kotlin 컴파일러 작업의 다양한 컴파일 단계에 소요된 시간, 사용된 컴파일러 및 Kotlin 버전, 그리고 컴파일이 증분(incremental)이었는지 여부에 대한 정보를 제공합니다. 이러한 빌드 리포트는 빌드 성능을 평가하는 데 유용합니다. 모든 Gradle 작업의 성능 개요를 제공하기 때문에 [Gradle 빌드 스캔](https://scans.gradle.com/)보다 Kotlin 컴파일 파이프라인에 대한 더 많은 통찰력을 제공합니다.

#### 빌드 리포트 활성화 방법

빌드 리포트를 활성화하려면, `gradle.properties` 파일에 빌드 리포트 출력 저장 위치를 선언하세요:

```none
kotlin.build.report.output=file
```

다음 값과 그 조합을 출력에 사용할 수 있습니다:

| 옵션        | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`      | 빌드 리포트를 사람이 읽을 수 있는 형식으로 로컬 파일에 저장합니다. 기본적으로 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`에 저장됩니다.                                                                                                                                                                                                                                                                                                                                 |
| `single_file` | 빌드 리포트를 객체 형식으로 지정된 로컬 파일에 저장합니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `build_scan`| 빌드 리포트를 [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 저장합니다. Gradle Enterprise 플러그인은 커스텀 값의 개수와 길이를 제한한다는 점에 유의하세요. 대규모 프로젝트에서는 일부 값이 손실될 수 있습니다.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `http`      | HTTP(S)를 사용하여 빌드 리포트를 게시합니다. POST 메서드는 JSON 형식으로 메트릭을 전송합니다. 전송된 데이터의 현재 버전은 [Kotlin 리포지토리](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 확인할 수 있습니다. HTTP 엔드포인트 샘플은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)에서 찾을 수 있습니다. |
| `json`      | 빌드 리포트를 JSON 형식으로 로컬 파일에 저장합니다. `kotlin.build.report.json.directory`에서 빌드 리포트 위치를 설정하세요. 기본적으로 이름은 `${project_name}-build-<date-time>-<index>.json`입니다.                                                                                                                                                                                                                                                                                                                                                                                                                               |

빌드 리포트로 가능한 것에 대한 자세한 내용은 [빌드 리포트](gradle-compilation-and-caches.md#build-reports)를 참조하세요.

## IDE 지원

IntelliJ IDEA 및 Android Studio의 K2 모드는 K2 컴파일러를 사용하여 코드 분석, 코드 자동 완성 및 하이라이팅을 개선합니다.

IntelliJ IDEA 2025.3 이상 버전은 항상 K2 모드를 사용합니다.

Android Studio에서 2024.1부터 다음 단계에 따라 K2 모드를 활성화할 수 있습니다:

1.  **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동합니다.
2.  **Enable K2 mode** 옵션을 선택합니다.

## Kotlin Playground에서 Kotlin K2 컴파일러 사용해보기

Kotlin Playground는 Kotlin 2.0.0 및 이후 릴리스를 지원합니다. [지금 사용해보세요!](https://pl.kotl.in/czuoQprce)

## 이전 컴파일러로 롤백하는 방법

Kotlin 2.0.0 및 이후 릴리스에서 이전 컴파일러를 사용하려면 다음 중 하나를 수행합니다:

*   `build.gradle.kts` 파일에서 [언어 버전을](gradle-compiler-options.md#example-of-setting-languageversion) `1.9`로 설정합니다.

    또는
*   다음 컴파일러 옵션을 사용합니다: `-language-version 1.9`.

## 변경 사항

새로운 프런트엔드 도입으로 Kotlin 컴파일러는 여러 가지 변화를 겪었습니다. 코드에 영향을 미치는 가장 중요한 수정 사항을 강조하고, 무엇이 변경되었는지 설명하며, 앞으로의 모범 사례를 자세히 설명하는 것부터 시작하겠습니다. 더 자세히 알고 싶다면, 추가 독서를 용이하게 하기 위해 이러한 변경 사항을 [주제 영역](#per-subject-area)별로 정리했습니다.

이 섹션에서는 다음 수정 사항을 강조합니다:

*   [백킹 필드가 있는 open 프로퍼티의 즉시 초기화](#immediate-initialization-of-open-properties-with-backing-fields)
*   [예상 수신자(projected receiver)에 대한 사용 중단된 합성 세터](#deprecated-synthetics-setter-on-a-projected-receiver)
*   [접근 불가능한 제네릭 타입의 사용 금지](#forbidden-use-of-inaccessible-generic-types)
*   [동일한 이름을 가진 Kotlin 프로퍼티와 Java 필드의 일관된 해석 순서](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
*   [Java 프리미티브 배열에 대한 향상된 null 안전성](#improved-null-safety-for-java-primitive-arrays)
*   [예상 클래스의 추상 멤버에 대한 엄격한 규칙](#stricter-rules-for-abstract-members-in-expected-classes)

### 백킹 필드가 있는 open 프로퍼티의 즉시 초기화

**무엇이 변경되었나요?**

Kotlin 2.0에서는 백킹 필드(backing fields)를 가진 모든 `open` 프로퍼티는 즉시 초기화되어야 합니다; 그렇지 않으면 컴파일 오류가 발생합니다. 이전에는 `open var` 프로퍼티만 즉시 초기화해야 했지만, 이제는 백킹 필드를 가진 `open val` 프로퍼티에도 적용됩니다:

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // Kotlin 2.0부터 오류 발생, 이전에는 성공적으로 컴파일됨 
        this.a = 1 //Error: open val must have initializer
        // 항상 오류
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

이 변경은 컴파일러의 동작을 더 예측 가능하게 만듭니다. `open val` 프로퍼티가 커스텀 세터(custom setter)를 가진 `var` 프로퍼티에 의해 오버라이드되는 예시를 생각해 보세요.

커스텀 세터가 사용되는 경우, 지연 초기화(deferred initialization)는 백킹 필드를 초기화할지 아니면 세터를 호출할지 불분명하게 만들기 때문에 혼란을 초래할 수 있습니다. 과거에는 세터를 호출하려 할 때, 이전 컴파일러는 세터가 백킹 필드를 초기화할 것을 보장할 수 없었습니다.

**현재 모범 사례는 무엇인가요?**

저희는 이 관행이 더 효율적이고 오류 발생 가능성이 낮다고 믿으므로, 백킹 필드가 있는 open 프로퍼티를 항상 초기화하도록 권장합니다.

그러나 프로퍼티를 즉시 초기화하고 싶지 않다면 다음을 수행할 수 있습니다:

*   프로퍼티를 `final`로 만듭니다.
*   지연 초기화(deferred initialization)를 허용하는 private 백킹 프로퍼티를 사용합니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-57555)를 참조하세요.

### 예상 수신자(projected receiver)에 대한 사용 중단된 합성 세터

**무엇이 변경되었나요?**

Java 클래스의 합성 세터(synthetic setter)를 사용하여 클래스의 예상 타입(projected type)과 충돌하는 타입을 할당하면 오류가 발생합니다.

`getFoo()` 및 `setFoo()` 메서드를 포함하는 `Container`라는 Java 클래스가 있다고 가정해 봅시다:

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

`Container` 클래스의 인스턴스가 예상 타입(projected types)을 가지는 다음 Kotlin 코드가 있는 경우, `setFoo()` 메서드를 사용하면 항상 오류가 발생합니다. 그러나 Kotlin 2.0.0부터는 합성 프로퍼티(synthetic property) `foo`가 오류를 발생시킵니다:

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

**현재 모범 사례는 무엇인가요?**

이 변경으로 인해 코드에 오류가 발생하는 것을 확인했다면, 타입 선언 구조를 재고해 보는 것이 좋습니다. 타입 프로젝션(type projections)을 사용할 필요가 없거나, 코드에서 할당(assignments)을 제거해야 할 수도 있습니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-54309)를 참조하세요.

### 접근 불가능한 제네릭 타입의 사용 금지

**무엇이 변경되었나요?**

K2 컴파일러의 새로운 아키텍처로 인해, 접근 불가능한 제네릭 타입(inaccessible generic types)을 처리하는 방식이 변경되었습니다. 일반적으로 코드에서 접근 불가능한 제네릭 타입에 의존해서는 안 됩니다. 이는 프로젝트 빌드 구성의 잘못된 설정을 나타내며, 컴파일러가 컴파일에 필요한 정보에 접근하는 것을 막기 때문입니다. Kotlin 2.0.0에서는 접근 불가능한 제네릭 타입으로 함수 리터럴(function literal)을 선언하거나 호출할 수 없으며, 접근 불가능한 제네릭 타입 인자(generic type arguments)를 가진 제네릭 타입을 사용할 수도 없습니다. 이 제한은 코드에서 나중에 컴파일러 오류가 발생하는 것을 방지하는 데 도움이 됩니다.

예를 들어, 하나의 모듈에 제네릭 클래스를 선언했다고 가정해 봅시다:

```kotlin
// 모듈 1
class Node<V>(val value: V)
```

모듈 1에 종속성이 구성된 다른 모듈(모듈 2)이 있는 경우, 코드는 `Node<V>` 클래스에 접근하여 함수 타입에서 타입으로 사용할 수 있습니다:

```kotlin
// 모듈 2
fun execute(func: (Node<Int>) -> Unit) {}
// 함수가 성공적으로 컴파일됩니다.
```

그러나 프로젝트가 모듈 2에만 의존하는 세 번째 모듈(모듈 3)을 가지도록 잘못 구성된 경우, Kotlin 컴파일러는 세 번째 모듈을 컴파일할 때 **모듈 1**의 `Node<V>` 클래스에 접근할 수 없습니다. 이제 모듈 3에서 `Node<V>` 타입을 사용하는 모든 람다(lambdas) 또는 익명 함수(anonymous functions)는 Kotlin 2.0.0에서 오류를 발생시켜, 코드에서 나중에 발생할 수 있는 피할 수 있는 컴파일러 오류, 충돌 및 런타임 예외를 방지합니다:

```kotlin
// 모듈 3
fun test() {
    // Kotlin 2.0.0에서 오류 발생, 암시적 
    // 람다 매개변수(it)의 타입이 접근 불가능한 Node로 해석되기 때문
    execute {}

    // Kotlin 2.0.0에서 오류 발생, 사용되지 않는 
    // 람다 매개변수(_)의 타입이 접근 불가능한 Node로 해석되기 때문
    execute { _ -> }

    // Kotlin 2.0.0에서 오류 발생, 사용되지 않는
    // 익명 함수 매개변수(_)의 타입이 접근 불가능한 Node로 해석되기 때문
    execute(fun (_) {})
}
```

함수 리터럴이 접근 불가능한 제네릭 타입의 값 매개변수를 포함할 때 오류를 발생시키는 것 외에도, 타입이 접근 불가능한 제네릭 타입 인자를 가질 때도 오류가 발생합니다.

예를 들어, 모듈 1에 동일한 제네릭 클래스 선언이 있습니다. 모듈 2에서는 또 다른 제네릭 클래스인 `Container<C>`를 선언합니다. 또한, 모듈 2에서 제네릭 클래스 `Node<V>`를 타입 인자로 사용하여 `Container<C>`를 사용하는 함수를 선언합니다:

<table>
   <tr>
       <td>모듈 1</td>
       <td>모듈 2</td>
   </tr>
   <tr>
<td>

```kotlin
// 모듈 1
class Node<V>(val value: V)
```

</td>
<td>

```kotlin
// 모듈 2
class Container<C>(vararg val content: C)

// 제네릭 클래스 타입을 가진 함수
// 또한 제네릭 클래스 타입 인자를 가짐
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

모듈 3에서 이러한 함수를 호출하려고 하면, 제네릭 클래스 `Node<V>`가 모듈 3에서 접근 불가능하기 때문에 Kotlin 2.0.0에서 오류가 발생합니다:

```kotlin
// 모듈 3
fun test() {
    // Kotlin 2.0.0에서 오류 발생, 제네릭 클래스 Node<V>에 
    // 접근 불가능하기 때문
    consume(produce())
}
```

향후 릴리스에서는 접근 불가능한 타입의 사용을 계속해서 일반화하여 사용 중단(deprecate)할 것입니다. Kotlin 2.0.0에서는 이미 비제네릭 타입을 포함한 접근 불가능한 타입의 일부 시나리오에 대해 경고를 추가하기 시작했습니다.

예를 들어, 이전 예제와 동일한 모듈 설정을 사용하되, 제네릭 클래스 `Node<V>`를 비제네릭 클래스 `IntNode`로 변경하고, 모든 함수는 모듈 2에 선언한다고 가정해 봅시다:

<table>
   <tr>
       <td>모듈 1</td>
       <td>모듈 2</td>
   </tr>
   <tr>
<td>

```kotlin
// 모듈 1
class IntNode(val value: Int)
```

</td>
<td>

```kotlin
// 모듈 2
// 람다 매개변수를 포함하는 함수 
// `IntNode` 타입을 가짐
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// 제네릭 클래스 타입을 가진 함수
// `IntNode`를 타입 인자로 가짐
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

모듈 3에서 이러한 함수를 호출하면 일부 경고가 발생합니다:

```kotlin
// 모듈 3
fun test() {
    // Kotlin 2.0.0에서 경고 발생, 클래스 IntNode에 
    // 접근 불가능하기 때문.

    execute {}
    // Class 'IntNode' of the parameter 'it' is inaccessible.

    execute { _ -> }
    execute(fun (_) {})
    // Class 'IntNode' of the parameter '_' is inaccessible.

    // IntNode에 접근 불가능하므로 향후 Kotlin 릴리스에서 경고가 발생합니다.
    consume(produce())
}
```

**현재 모범 사례는 무엇인가요?**

접근 불가능한 제네릭 타입에 대한 새로운 경고가 발생하면, 빌드 시스템 구성에 문제가 있을 가능성이 매우 높습니다. 빌드 스크립트와 구성을 확인하는 것을 권장합니다.

최후의 수단으로, 모듈 3에 대해 모듈 1에 직접적인 종속성을 구성할 수 있습니다. 또는 동일한 모듈 내에서 타입에 접근 가능하도록 코드를 수정할 수 있습니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-64474)를 참조하세요.

### 동일한 이름을 가진 Kotlin 프로퍼티와 Java 필드의 일관된 해석 순서

**무엇이 변경되었나요?**

Kotlin 2.0.0 이전에는 서로 상속하고 동일한 이름을 가진 Kotlin 프로퍼티와 Java 필드를 포함하는 Java 및 Kotlin 클래스를 사용할 경우, 중복된 이름의 해석 동작이 일관되지 않았습니다. 또한 IntelliJ IDEA와 컴파일러 간에 충돌하는 동작도 있었습니다. Kotlin 2.0.0의 새로운 해석 동작을 개발할 때, 사용자에게 미치는 영향을 최소화하는 것을 목표로 했습니다.

예를 들어, `Base`라는 Java 클래스가 있다고 가정해 봅시다:

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

또한 앞서 언급한 `Base` 클래스를 상속하는 `Derived`라는 Kotlin 클래스가 있다고 가정해 봅시다:

```kotlin
class Derived : Base() {
    val a = "aa"

    // 커스텀 get() 함수 선언
    val b get() = "bb"
}

fun main() {
    // Derived.a로 해석
    println(a)
    // aa

    // Base.b로 해석
    println(b)
    // b
}
```

Kotlin 2.0.0 이전에는 `a`가 `Derived` Kotlin 클래스 내의 Kotlin 프로퍼티로 해석되었지만, `b`는 `Base` Java 클래스의 Java 필드로 해석되었습니다.

Kotlin 2.0.0에서는 예제의 해석 동작이 일관되어, Kotlin 프로퍼티가 동일한 이름의 Java 필드를 대체하도록 보장합니다. 이제 `b`는 `Derived.b`로 해석됩니다.

> Kotlin 2.0.0 이전에는 IntelliJ IDEA를 사용하여 `a`의 선언 또는 사용으로 이동할 경우, Kotlin 프로퍼티로 이동해야 할 때 Java 필드로 잘못 이동했습니다.
> 
> Kotlin 2.0.0부터 IntelliJ IDEA는 컴파일러와 동일한 위치로 올바르게 이동합니다.
>
{style="note"}

일반적인 규칙은 서브클래스(subclass)가 우선한다는 것입니다. 이전 예제에서 이를 보여줍니다. `Derived`가 `Base` Java 클래스의 서브클래스이므로 `Derived` 클래스의 Kotlin 프로퍼티 `a`가 해석됩니다.

상속이 역전되어 Java 클래스가 Kotlin 클래스를 상속하는 경우, 서브클래스의 Java 필드가 동일한 이름의 Kotlin 프로퍼티보다 우선합니다.

이 예제를 고려해 보세요:

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
    // Derived.a로 해석
    println(a)
    // a
}
```

**현재 모범 사례는 무엇인가요?**

이 변경이 코드에 영향을 미친다면, 중복된 이름을 정말 사용해야 하는지 고려해 보세요. 동일한 이름을 가진 필드 또는 프로퍼티를 포함하고 서로 상속하는 Java 또는 Kotlin 클래스를 만들고 싶다면, 서브클래스의 필드 또는 프로퍼티가 우선한다는 점을 명심하세요.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-55017)를 참조하세요.

### Java 프리미티브 배열에 대한 향상된 null 안전성

**무엇이 변경되었나요?**

Kotlin 2.0.0부터 컴파일러는 Kotlin으로 임포트된 Java 프리미티브 배열의 null 허용성(nullability)을 올바르게 추론합니다. 이제 Java 프리미티브 배열과 함께 사용된 `TYPE_USE` 어노테이션에서 네이티브 null 허용성을 유지하고, 어노테이션에 따라 값이 사용되지 않을 경우 오류를 발생시킵니다.

일반적으로 `@Nullable` 및 `@NotNull` 어노테이션이 있는 Java 타입이 Kotlin에서 호출되면, 적절한 네이티브 null 허용성을 받습니다:

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

하지만 이전에는 Java 프리미티브 배열이 Kotlin으로 임포트될 때 모든 `TYPE_USE` 어노테이션이 손실되어 플랫폼 null 허용성을 초래하고 잠재적으로 안전하지 않은 코드를 만들었습니다:

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// 어노테이션에 따라 `dataService.fetchData()`가 `null`일 수 있음에도 불구하고 오류가 없습니다.
// 이는 NullPointerException을 발생시킬 수 있습니다.
dataService.fetchData()[0]
```
이 문제는 선언 자체의 null 허용성 어노테이션에는 영향을 미치지 않았고, `TYPE_USE` 어노테이션에만 영향을 미쳤다는 점에 유의하세요.

**현재 모범 사례는 무엇인가요?**

Kotlin 2.0.0에서는 Java 프리미티브 배열에 대한 null 안전성이 이제 Kotlin의 표준이 되었으므로, 이를 사용하는 경우 코드에서 새로운 경고 및 오류를 확인하세요:

*   명시적인 null 허용성 검사 없이 `@Nullable` Java 프리미티브 배열을 사용하거나, non-nullable 프리미티브 배열을 예상하는 Java 메서드에 `null`을 전달하려고 시도하는 모든 코드는 이제 컴파일에 실패할 것입니다.
*   `@NotNull` 프리미티브 배열을 null 허용성 검사와 함께 사용하면 이제 "불필요한 안전 호출" 또는 "null과의 비교는 항상 거짓" 경고가 발생합니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-54521)를 참조하세요.

### 예상 클래스의 추상 멤버에 대한 엄격한 규칙

> 예상 및 실제 클래스는 [베타](components-stability.md#stability-levels-explained) 단계에 있습니다. 거의 안정적이지만, 향후 마이그레이션 단계를 수행해야 할 수도 있습니다. 추가적인 변경 사항을 최소화하기 위해 최선을 다할 것입니다.
>
{style="warning"}

**무엇이 변경되었나요?**

K2 컴파일러를 사용한 컴파일 시 공통 및 플랫폼 소스 분리로 인해, 예상 클래스의 추상 멤버에 대한 엄격한 규칙을 구현했습니다。

이전 컴파일러에서는 예상 비추상 클래스가 [함수를 오버라이드](inheritance.md#overriding-rules)하지 않고 추상 함수를 상속하는 것이 가능했습니다. 컴파일러가 공통 코드와 플랫폼 코드에 동시에 접근할 수 있었기 때문에, 컴파일러는 추상 함수가 실제 클래스에 해당하는 오버라이드와 정의를 가지고 있는지 확인할 수 있었습니다.

이제 공통 소스와 플랫폼 소스가 별도로 컴파일되므로, 상속된 함수는 예상 클래스에서 명시적으로 오버라이드되어야 컴파일러가 해당 함수가 추상적이지 않다는 것을 알 수 있습니다. 그렇지 않으면 컴파일러는 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 오류를 보고합니다.

예를 들어, `listFiles()`라는 추상 함수를 가진 `FileSystem`이라는 추상 클래스를 선언하는 공통 소스 세트가 있다고 가정해 봅시다. `listFiles()` 함수는 실제 선언의 일부로 플랫폼 소스 세트에서 정의합니다.

공통 코드에서 `FileSystem` 클래스를 상속하는 `PlatformFileSystem`이라는 예상 비추상 클래스가 있다면, `PlatformFileSystem` 클래스는 추상 함수 `listFiles()`를 상속합니다. 그러나 Kotlin에서는 비추상 클래스에 추상 함수를 가질 수 없습니다. `listFiles()` 함수를 비추상으로 만들려면, `abstract` 키워드 없이 오버라이드(override)로 선언해야 합니다:

<table>
   <tr>
       <td>공통 코드</td>
       <td>플랫폼 코드</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // Kotlin 2.0.0에서는 명시적인 오버라이드가 필요합니다.
    expect override fun listFiles()
    // Kotlin 2.0.0 이전에는 오버라이드가 필요 없었습니다.
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

**현재 모범 사례는 무엇인가요?**

예상 비추상 클래스에서 추상 함수를 상속하는 경우, 비추상 오버라이드를 추가하세요.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual)를 참조하세요.

### 주제 영역별

이러한 주제 영역은 코드에 영향을 미칠 가능성이 낮은 변경 사항을 나열하지만, 추가 독서를 위해 관련 YouTrack 이슈 링크를 제공합니다. 이슈 ID 옆에 별표(*)가 표시된 변경 사항은 섹션 시작 부분에 설명되어 있습니다.

#### 타입 추론 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                               |
|:----------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 타입이 명시적으로 Normal인 경우 프로퍼티 참조의 컴파일된 함수 시그니처에 잘못된 타입                                    |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 빌더 추론 컨텍스트에서 타입 변수가 상한으로 암묵적으로 추론되는 것을 금지                                              |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2: 배열 리터럴의 제네릭 어노테이션 호출에 명시적 타입 인자 요구                                                       |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 교차 타입에 대한 서브타이핑 검사 누락                                                                                   |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | Kotlin에서 Java 타입 매개변수 기반 타입의 기본 표현 변경                                                               |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 접두사 증가의 추론된 타입을 inc() 연산자의 반환 타입 대신 게터의 반환 타입으로 변경                                     |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2: 반공변 매개변수에 @UnsafeVariance 사용에 의존하지 않음                                                            |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2: 원시 타입에 대한 포함된 멤버로의 해석 금지                                                                          |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2: 확장 함수 매개변수를 가진 호출 가능 참조의 타입이 올바르게 추론됨                                                   |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 구조 분해 변수의 실제 타입을 지정된 경우 명시적 타입과 일관되게 만듭니다.                                                |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2: 정수 리터럴 오버플로에 대한 일관성 없는 동작 수정                                                                   |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 익명 타입이 타입 인자에서 익명 함수로부터 노출될 수 있음                                                               |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | break가 있는 while 루프의 조건이 잘못된 스마트 캐스트를 생성할 수 있음                                                 |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2: expect/actual 최상위 프로퍼티에 대한 공통 코드에서의 스마트 캐스트 금지                                           |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 반환 타입을 변경하는 증가 및 더하기 연산자는 스마트 캐스트에 영향을 주어야 합니다.                                        |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2: 변수 타입을 명시적으로 지정하면 K1에서 작동했던 일부 바운드 스마트 캐스트가 중단됩니다.                         |

#### 제네릭 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                                                  |
|:----------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [예상 수신자(projected receiver)에 대한 합성 세터 사용 중단](#deprecated-synthetics-setter-on-a-projected-receiver)                     |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)  | 제네릭 타입 매개변수를 가진 원시 타입 매개변수의 Java 메서드 오버라이드 금지                                                            |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)  | null 가능 타입 매개변수를 \`in\` 예상 DNN 매개변수에 전달하는 것을 금지                                                                 |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)  | 타입 별칭 생성자에서 상한 위반 사용 중단                                                                                                |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)  | Java 클래스 기반의 반공변 캡처 타입에 대한 타입 불건전성 수정                                                                           |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)  | 자체 상한과 캡처된 타입을 사용한 불건전한 코드 금지                                                                                     |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)  | 제네릭 외부 클래스의 제네릭 내부 클래스에서 잘못된 바운드 위반 금지                                                                   |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923)  | K2: 내부 클래스의 외부 슈퍼 타입 프로젝션에 PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE 도입                                      |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243)  | 다른 슈퍼타입의 추가 특수화된 구현을 가진 프리미티브 컬렉션으로부터 상속 시 MANY_IMPL_MEMBER_NOT_IMPLEMENTED 보고                     |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305)  | K2: 확장된 타입에 분산 한정자를 가진 타입 별칭에 대한 생성자 호출 및 상속 금지                                                        |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965)  | K2: 자체 상한을 가진 캡처된 타입의 부적절한 처리로 인한 타입 홀(type hole) 수정                                                       |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966)  | 제네릭 매개변수에 잘못된 타입을 가진 제네릭 위임 생성자 호출 금지                                                                     |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712)  | 상한이 캡처된 타입일 때 상한 위반 누락 보고                                                                                             |

#### 해석 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                                                                            |
|:----------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [기반 클래스의 Java 필드와 오버로드 해석 시 파생 클래스에서 Kotlin 프로퍼티 선택](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)  | invoke 컨벤션이 예상된 디슈가링(desugaring)과 일관되게 작동하도록 함                                                                                               |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866)  | K2: 컴패니언 객체가 정적 스코프보다 선호될 때 한정자 해석 동작 변경                                                                                             |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)  | 타입 해석 및 동일 이름 클래스가 스타 임포트될 때 모호성 오류 보고                                                                                             |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558)  | K2: COMPATIBILITY_WARNING 주변 해석 마이그레이션                                                                                                            |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)  | 동일한 종속성의 두 가지 다른 버전에 종속성 클래스가 포함될 때 CONFLICTING_INHERITED_MEMBERS의 잘못된 음성                                                      |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)  | 수신자를 가진 함수 타입의 프로퍼티 invoke가 확장 함수 invoke보다 선호됨                                                                                       |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666)  | 한정된 this: 타입 케이스로 한정된 this 도입/우선순위 부여                                                                                                     |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166)  | 클래스패스에서 FQ 이름 충돌 시 지정되지 않은 동작 확인                                                                                                   |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431)  | K2: 임포트에서 타입 별칭을 한정자로 사용하는 것을 금지                                                                                                   |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520)  | K1/K2: 하위 수준에서 모호성을 가진 타입 참조에 대한 해석 타워의 잘못된 작동                                                                                |

#### 가시성 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                     | 제목                                                                                                                           |
|:------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [접근 불가능한 타입의 사용을 지정되지 않은 동작으로 선언](#forbidden-use-of-inaccessible-generic-types)                          |
| [KT-55179](https://youtrack.com/issue/KT-55179)   | 내부 인라인 함수에서 private 클래스 컴패니언 객체 멤버 호출 시 PRIVATE_CLASS_MEMBER_FROM_INLINE의 잘못된 음성                  |
| [KT-58042](https://youtrack.com/issue/KT-58042)   | 오버라이드된 선언이 가시적일 때도 동등한 게터가 가시적이지 않으면 합성 프로퍼티를 비가시적으로 만듭니다.                         |
| [KT-64255](https://youtrack.com/issue/KT-64255)   | 다른 모듈의 파생 클래스에서 내부 세터에 접근하는 것을 금지                                                                     |
| [KT-33917](https://youtrack.com/issue/KT-33917)   | private 인라인 함수에서 익명 타입을 노출하는 것을 금지                                                                         |
| [KT-54997](https://youtrack.com/issue/KT-54997)   | public-API 인라인 함수에서 암시적 비공개-API 접근을 금지                                                                       |
| [KT-56310](https://youtrack.com/issue/KT-56310)   | 스마트 캐스트는 protected 멤버의 가시성에 영향을 미치지 않아야 합니다.                                                       |
| [KT-65494](https://youtrack.com/issue/KT-65494)   | public 인라인 함수에서 간과된 private 연산자 함수에 접근하는 것을 금지                                                       |
| [KT-65004](https://youtrack.com/issue/KT-65004)   | K1: protected val을 오버라이드하는 var의 세터가 public으로 생성됩니다.                                                       |
| [KT-64972](https://youtrack.com/issue/KT-64972)   | Kotlin/Native의 링크 타임에서 private 멤버에 의한 오버라이드 금지                                                          |

#### 어노테이션 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                         |
|:----------------------------------------------------------|:---------------------------------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | EXPRESSION 타겟이 없는 경우 어노테이션으로 문을 어노테이션하는 것을 금지                     |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | \`REPEATED_ANNOTATION\` 검사 중 괄호 표현식 무시                                           |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2: 프로퍼티 게터에 use-site 'get' 대상 어노테이션 금지                                    |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | where 절에서 타입 매개변수에 어노테이션을 다는 것을 금지                                     |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 컴패니언 객체의 어노테이션 해석을 위해 컴패니언 스코프가 무시됩니다.                           |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2: 사용자 정의 및 컴파일러 필수 어노테이션 간의 모호성 도입                               |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | enum 값에 대한 어노테이션은 enum 값 클래스로 복사되지 않아야 합니다.                         |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2: \`()?\`로 래핑된 타입의 호환되지 않는 어노테이션에 대해 \`WRONG_ANNOTATION_TARGET\`이 보고됩니다. |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2: catch 매개변수 타입의 어노테이션에 대해 \`WRONG_ANNOTATION_TARGET\`이 보고됩니다.        |

#### Null 안전성 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                        |
|:----------------------------------------------------------|:------------------------------------------------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [Java에서 Nullable로 어노테이션된 배열 타입의 안전하지 않은 사용 중단](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)  | K2: 안전 호출과 컨벤션 연산자의 조합에 대한 평가 의미론 변경                                                  |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850)  | 슈퍼타입의 순서가 상속된 함수의 null 허용성 매개변수를 정의합니다.                                            |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)  | public 시그니처에서 지역 타입을 근사화할 때 null 허용성 유지                                                   |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)  | 안전하지 않은 할당의 셀렉터로 null 허용 타입을 non-null Java 필드에 할당하는 것을 금지                         |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209)  | 경고 수준 Java 타입의 오류 수준 null 허용 인자에 대한 누락된 오류 보고                                           |

#### Java 상호 운용성 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                  | 제목                                                                                     |
|:----------------------------------------------------------|:-----------------------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 소스에서 동일한 FQ 이름(Fully Qualified Name)을 가진 Java 및 Kotlin 클래스 금지        |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | Java 컬렉션에서 상속된 클래스는 슈퍼타입의 순서에 따라 일관성 없는 동작을 보입니다.        |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2: Kotlin private 클래스에서 Java 클래스 상속 시 지정되지 않은 동작                   |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | Java vararg 메서드를 인라인 함수에 전달하면 런타임에 단순히 배열 대신 배열의 배열이 생성됩니다. |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | K-J-K 계층 구조에서 내부 멤버 오버라이드 허용                                          |

#### 프로퍼티 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                                |
|:----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 백킹 필드가 있는 open 프로퍼티의 지연 초기화 금지](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | 기본 생성자가 없거나 클래스가 로컬일 때 누락된 MUST_BE_INITIALIZED 사용 중단                 |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | 프로퍼티에 대한 잠재적인 invoke 호출의 경우 재귀적 해석 금지                                   |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 기반 클래스가 다른 모듈에서 온 경우 보이지 않는 파생 클래스에서 기반 클래스 프로퍼티에 대한 스마트 캐스트 사용 중단 |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2: 데이터 클래스 프로퍼티에 대한 OPT_IN_USAGE_ERROR 누락                                   |

#### 제어 흐름 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                   |
|:----------------------------------------------------------|:-----------------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1과 K2 간 클래스 초기화 블록에서 CFA의 불일치 규칙                    |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | 괄호 안의 else 분기가 없는 if 조건문에 대한 K1/K2 불일치             |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 스코프 함수 내 초기화를 가진 try/catch 블록에서 "VAL_REASSIGNMENT"의 잘못된 음성 |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | try 블록에서 catch 및 finally 블록으로 데이터 흐름 정보 전파           |

#### Enum 클래스 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                 |
|:----------------------------------------------------------|:---------------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | enum 엔트리 초기화 중 enum 클래스의 컴패니언 객체에 접근하는 것을 금지 |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | enum 클래스의 가상 인라인 메서드에 대한 누락된 오류 보고             |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 프로퍼티/필드와 enum 엔트리 간의 모호성 해석 보고                      |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 컴패니언 프로퍼티가 enum 엔트리보다 선호될 때 한정자 해석 동작 변경    |

#### 함수형 (SAM) 인터페이스 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                        |
|:----------------------------------------------------------|:----------------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 어노테이션 없이 OptIn을 요구하는 SAM 생성자 사용 중단                      |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | JDK 함수 인터페이스의 SAM 생성자에 대해 람다에서 잘못된 null 허용성을 가진 값 반환 금지 |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 호출 가능 참조의 매개변수 타입 SAM 변환은 CCE를 발생시킵니다.               |

#### 컴패니언 객체 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                  | 제목                                                                 |
|:----------------------------------------------------------|:---------------------------------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 컴패니언 객체 멤버에 대한 호출 외부 참조는 유효하지 않은 시그니처를 가집니다. |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | V가 컴패니언을 가질 때 (V)::foo 참조 해석 변경                         |

#### 기타 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID                                                   | 제목                                                                                                                              |
|:----------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | K2/MPP는 실제 구현이 있는 경우 공통 코드의 상속자에 대해 ABSTRACT_MEMBER_NOT_IMPLEMENTED를 보고합니다.                             |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | 한정된 this: 잠재적인 레이블 충돌 시 동작 변경                                                                                    |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | Java 서브클래스에서 우발적인 충돌 오버로드가 발생할 경우 JVM 백엔드에서 잘못된 함수 맹글링(mangling) 수정                         |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LC 이슈] 문 위치에서 suspend로 표시된 익명 함수 선언 금지                                                                        |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn: 마커 아래에서 기본 인자(기본값을 가진 매개변수)를 가진 생성자 호출 금지                                                      |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | 변수에 대한 표현식 + invoke 해석에 Unit 변환이 우발적으로 허용됩니다.                                                             |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199)  | 적응형 호출 가능 참조를 KFunction으로 승격하는 것을 금지                                                                         |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2는 \`false && ...\` 및 \`false \|\| ...\`를 깨뜨립니다.                                                             |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] \`header\`/\`impl\` 키워드 사용 중단                                                                                          |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | 기본적으로 invokedynamic + LambdaMetafactory를 통해 모든 Kotlin 람다 생성                                                         |

## Kotlin 릴리스와의 호환성

다음 Kotlin 릴리스는 새로운 K2 컴파일러를 지원합니다:

| Kotlin 릴리스     | 안정성 수준 |
|-------------------|-------------|
| 2.0.0–%kotlinVersion% | 안정적      |
| 1.9.20–1.9.25     | 베타        |
| 1.9.0–1.9.10      | JVM은 베타  |
| 1.7.0–1.8.22      | 알파        |

## Kotlin 라이브러리와의 호환성

Kotlin/JVM으로 작업하는 경우, K2 컴파일러는 모든 버전의 Kotlin으로 컴파일된 라이브러리와 함께 작동합니다.

Kotlin Multiplatform으로 작업하는 경우, K2 컴파일러는 Kotlin 버전 1.9.20 이상으로 컴파일된 라이브러리와 함께 작동하는 것이 보장됩니다.

## 컴파일러 플러그인 지원

현재 Kotlin K2 컴파일러는 다음 Kotlin 컴파일러 플러그인을 지원합니다:

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

또한 Kotlin K2 컴파일러는 다음을 지원합니다:

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 컴파일러 플러그인 및 이후 버전.
*   [Kotlin Symbol Processing (KSP)](ksp-overview.md)부터 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html).

> 추가 컴파일러 플러그인을 사용하는 경우, K2와 호환되는지 해당 문서를 확인하세요.
>
{style="tip"}

### 커스텀 컴파일러 플러그인 업그레이드

> 커스텀 컴파일러 플러그인은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계의 플러그인 API를 사용합니다. 결과적으로 API는 언제든지 변경될 수 있으므로, 하위 호환성을 보장할 수 없습니다.
>
{style="warning"}

업그레이드 프로세스는 가지고 있는 커스텀 플러그인 유형에 따라 두 가지 경로가 있습니다.

#### 백엔드 전용 컴파일러 플러그인

플러그인이 `IrGenerationExtension` 확장 포인트만 구현하는 경우, 다른 새 컴파일러 릴리스와 동일한 프로세스를 따릅니다. 사용하는 API에 변경 사항이 있는지 확인하고 필요한 경우 변경하세요.

#### 백엔드 및 프런트엔드 컴파일러 플러그인

플러그인이 프런트엔드 관련 확장 포인트(extension points)를 사용하는 경우, 새로운 K2 컴파일러 API를 사용하여 플러그인을 재작성해야 합니다. 새로운 API에 대한 소개는 [FIR Plugin API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)를 참조하세요.

> 커스텀 컴파일러 플러그인 업그레이드에 대해 질문이 있다면, [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slack 채널에 참여해 주세요. 최선을 다해 도와드리겠습니다.
>
{style="note"}

## 새로운 K2 컴파일러에 대한 피드백 공유

어떤 피드백이든 감사히 받겠습니다!

*   새로운 K2 컴파일러로 마이그레이션하는 동안 겪는 모든 문제를 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)에 보고해 주세요.
*   JetBrains가 K2 사용에 대한 익명 데이터를 수집할 수 있도록 [사용 통계 전송 옵션](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)을 활성화하세요.