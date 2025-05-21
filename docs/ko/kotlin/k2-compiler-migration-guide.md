---
title: "K2 컴파일러 마이그레이션 가이드"
---
Kotlin 언어와 생태계가 계속 발전함에 따라 Kotlin 컴파일러도 발전해 왔습니다. 첫 번째 단계는 논리를 공유하는 새로운 JVM 및 JS IR (Intermediate Representation) 백엔드를 도입하여 서로 다른 플랫폼의 대상에 대한 코드 생성을 단순화하는 것이었습니다. 이제 진화의 다음 단계에서는 K2라고 하는 새로운 프런트엔드를 제공합니다.

<img src="/img/k2-compiler-architecture.svg" alt="Kotlin K2 compiler architecture" width="700" style={{verticalAlign: 'middle'}}/>

K2 컴파일러의 등장으로 Kotlin 프런트엔드가 완전히 재작성되었으며 새로운, 더욱 효율적인 아키텍처를 특징으로 합니다. 새로운 컴파일러가 가져오는 근본적인 변화는 더 많은 의미 정보를 포함하는 하나의 통합된 데이터 구조를 사용하는 것입니다. 이 프런트엔드는 의미 분석, 호출 확인 및 타입 추론을 수행합니다.

새로운 아키텍처와 풍부해진 데이터 구조를 통해 K2 컴파일러는 다음과 같은 이점을 제공할 수 있습니다.

* **향상된 호출 확인 및 타입 추론**. 컴파일러는 더 일관되게 동작하고 코드를 더 잘 이해합니다.
* **새로운 언어 기능에 대한 더 쉬운 syntactic sugar 도입**. 앞으로 새로운 기능이 도입되면 더 간결하고 읽기 쉬운 코드를 사용할 수 있습니다.
* **더 빠른 컴파일 시간**. 컴파일 시간이 [상당히 빨라질](#performance-improvements) 수 있습니다.
* **향상된 IDE 성능**. IntelliJ IDEA에서 K2 모드를 활성화하면 IntelliJ IDEA가 K2 컴파일러 프런트엔드를 사용하여 Kotlin 코드를 분석하므로 안정성과 성능이 향상됩니다. 자세한 내용은 [IDE 지원](#support-in-ides)을 참조하십시오.

본 가이드:

* 새로운 K2 컴파일러의 이점을 설명합니다.
* 마이그레이션 중에 발생할 수 있는 변경 사항과 그에 따라 코드를 조정하는 방법을 강조 표시합니다.
* 이전 버전으로 롤백하는 방법을 설명합니다.

:::note
새로운 K2 컴파일러는 2.0.0부터 기본적으로 활성화됩니다. Kotlin 2.0.0에서 제공되는 새로운 기능과 새로운 K2 컴파일러에 대한 자세한 내용은 [Kotlin 2.0.0의 새로운 기능](whatsnew20)을 참조하십시오.

:::

## 성능 향상

K2 컴파일러의 성능을 평가하기 위해 두 개의 오픈 소스 프로젝트인 [Anki-Android](https://github.com/ankidroid/Anki-Android)와 [Exposed](https://JetBrains/Exposed)에서 성능 테스트를 실행했습니다. 주요 성능 향상 사항은 다음과 같습니다.

* K2 컴파일러는 최대 94%의 컴파일 속도 향상을 제공합니다. 예를 들어 Anki-Android 프로젝트에서 클린 빌드 시간은 Kotlin 1.9.23에서 57.7초에서 Kotlin 2.0.0에서 29.7초로 단축되었습니다.
* 초기화 단계는 K2 컴파일러에서 최대 488% 더 빠릅니다. 예를 들어 Anki-Android 프로젝트에서 증분 빌드의 초기화 단계는 Kotlin 1.9.23에서 0.126초에서 Kotlin 2.0.0에서 0.022초로 단축되었습니다.
* Kotlin K2 컴파일러는 이전 컴파일러에 비해 분석 단계에서 최대 376% 더 빠릅니다. 예를 들어 Anki-Android 프로젝트에서 증분 빌드의 분석 시간은 Kotlin 1.9.23에서 0.581초에서 Kotlin 2.0.0에서 0.122초로 단축되었습니다.

이러한 개선 사항에 대한 자세한 내용과 K2 컴파일러의 성능을 분석한 방법에 대한 자세한 내용은 [블로그 게시물](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)을 참조하십시오.

## 언어 기능 향상

Kotlin K2 컴파일러는 [스마트 캐스팅](#smart-casts) 및 [Kotlin Multiplatform](#kotlin-multiplatform)과 관련된 언어 기능을 개선합니다.

### 스마트 캐스트

Kotlin 컴파일러는 특정 경우에 객체를 자동으로 타입으로 캐스팅하여 명시적으로 지정해야 하는 번거로움을 줄여줍니다. 이를 [스마트 캐스팅](typecasts#smart-casts)이라고 합니다. Kotlin K2 컴파일러는 이전보다 더 많은 시나리오에서 스마트 캐스트를 수행합니다.

Kotlin 2.0.0에서는 다음 영역에서 스마트 캐스트와 관련된 개선이 이루어졌습니다.

* [지역 변수 및 추가 범위](#local-variables-and-further-scopes)
* [논리적 `or` 연산자를 사용한 타입 검사](#type-checks-with-the-logical-or-operator)
* [인라인 함수](#inline-functions)
* [함수 타입의 프로퍼티](#properties-with-function-types)
* [예외 처리](#exception-handling)
* [증가 및 감소 연산자](#increment-and-decrement-operators)

#### 지역 변수 및 추가 범위

이전에는 변수가 `if` 조건 내에서 `null`이 아닌 것으로 평가되면 변수가 스마트 캐스트되었습니다. 그런 다음 이 변수에 대한 정보가 `if` 블록 범위 내에서 추가로 공유됩니다.

그러나 변수를 `if` 조건 **외부**에서 선언하면 변수에 대한 정보를 `if` 조건 내에서 사용할 수 없으므로 스마트 캐스트할 수 없습니다. 이러한 동작은 `when` 표현식과 `while` 루프에서도 볼 수 있었습니다.

Kotlin 2.0.0부터 `if`, `when` 또는 `while` 조건에서 변수를 사용하기 전에 선언하면 변수에 대해 컴파일러가 수집한 모든 정보는 스마트 캐스팅을 위해 해당 블록에서 액세스할 수 있습니다.

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
        // Kotlin 2.0.0에서는 컴파일러가 isCat에 대한 정보에 액세스할 수 있으므로
        // animal이 Cat 타입으로 스마트 캐스트되었다는 것을 알고 있습니다.
        // 따라서 purr() 함수를 호출할 수 있습니다.
        // Kotlin 1.9.20에서는 컴파일러가 스마트 캐스트에 대해 알지 못하므로
        // purr() 함수를 호출하면 오류가 발생합니다.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 논리적 or 연산자를 사용한 타입 검사

Kotlin 2.0.0에서는 객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면 스마트 캐스트가 가장 가까운 공통 슈퍼타입으로 이루어집니다. 이 변경 사항 이전에는 스마트 캐스트가 항상 `Any` 타입으로 이루어졌습니다.

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
        // Kotlin 2.0.0 이전에는 signalStatus가 Any 타입으로 스마트 캐스트되었으므로
        // signal() 함수를 호출하면
        // Unresolved reference 오류가 발생했습니다. signal() 함수는
        // 다른 타입 검사 후에만 성공적으로 호출할 수 있습니다.
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
공통 슈퍼타입은 [유니온 타입](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은
[현재 Kotlin에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).

:::

#### 인라인 함수

Kotlin 2.0.0에서는 K2 컴파일러가 인라인 함수를 다르게 처리하여 다른 컴파일러 분석과 함께 스마트 캐스트가 안전한지 여부를 판단할 수 있습니다.

특히 인라인 함수는 이제 암시적 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 갖는 것으로 처리됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 제자리에서 호출됨을 의미합니다. 람다 함수가 제자리에서 호출되기 때문에 컴파일러는 람다 함수가 함수 본문 내에 포함된 변수에 대한 참조를 누출할 수 없다는 것을 알고 있습니다.

컴파일러는 이 지식과 다른 컴파일러 분석을 함께 사용하여 캡처된 변수를 스마트 캐스트하는 것이 안전한지 결정합니다. 예를 들면 다음과 같습니다.

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -
:::note
 Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // Kotlin 2.0.0에서는 컴파일러가 processor가
        // 지역 변수이고 inlineAction()이 인라인 함수라는 것을 알고 있으므로
        // processor에 대한 참조가 누출될 수 없습니다. 따라서 스마트 캐스트하는 것이 안전합니다.
      
        // processor가 null이 아니면 processor가 스마트 캐스트됩니다.
        if (processor != null) {
            // 컴파일러는 processor가 null이 아니라는 것을 알고 있으므로 안전한 호출이 필요하지 않습니다.
            processor.process()

            // Kotlin 1.9.20에서는 안전한 호출을 수행해야 합니다.
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 함수 타입의 프로퍼티

이전 버전의 Kotlin에서는 함수 타입을 가진 클래스 프로퍼티가 스마트 캐스트되지 않는 버그가 있었습니다. Kotlin 2.0.0 및 K2 컴파일러에서 이 동작을 수정했습니다. 예를 들면 다음과 같습니다.

```kotlin
class Holder(val provider: (() `->` Unit)?) {
    fun process() {
        // Kotlin 2.0.0에서는 provider가 null이 아니면
        // 스마트 캐스트됩니다.
        if (provider != null) {
            // 컴파일러는 provider가 null이 아니라는 것을 알고 있습니다.
            provider()

            // 1.9.20에서는 컴파일러가 provider가 null이 아니라는 것을 알지 못하므로
            // 오류가 발생합니다.
            // Reference has a nullable type '(() `->` Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

`invoke` 연산자를 오버로드하는 경우에도 이 변경 사항이 적용됩니다. 예를 들면 다음과 같습니다.

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () `->` String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // 1.9.20에서는 컴파일러가 오류를 발생시킵니다.
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 예외 처리

Kotlin 2.0.0에서는 예외 처리를 개선하여 스마트 캐스트 정보를 `catch` 및 `finally` 블록으로 전달할 수 있도록 했습니다. 이 변경 사항은 컴파일러가 객체의 nullable 타입을 추적하므로 코드를 더 안전하게 만듭니다. 예를 들면 다음과 같습니다.

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput이 String 타입으로 스마트 캐스트됩니다.
    stringInput = ""
    try {
        // 컴파일러는 stringInput이 null이 아니라는 것을 알고 있습니다.
        println(stringInput.length)
        // 0

        // 컴파일러는 stringInput에 대한 이전 스마트 캐스트 정보를 거부합니다.
        // 이제 stringInput은 String? 타입을 갖습니다.
        stringInput = null

        // 예외 발생
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0에서는 컴파일러가 stringInput이
        // null일 수 있다는 것을 알고 있으므로 stringInput은 nullable로 유지됩니다.
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20에서는 컴파일러가 안전한 호출이 필요하지 않다고 말하지만
        // 이는 잘못되었습니다.
    }
}

fun main() {
    testString()
}
```

#### 증가 및 감소 연산자

Kotlin 2.0.0 이전에는 컴파일러가 증가 또는 감소 연산자를 사용한 후 객체의 타입이 변경될 수 있다는 것을 이해하지 못했습니다. 컴파일러가 객체 타입을 정확하게 추적할 수 없었기 때문에 코드가 해결되지 않은 참조 오류로 이어질 수 있었습니다. Kotlin 2.0.0에서는 이 문제가 수정되었습니다.

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

        // Rho 인터페이스에서 오버로드된 inc() 연산자를 사용합니다.
        // Kotlin 2.0.0에서는 unknownObject 타입이 Sigma로 스마트 캐스트됩니다.
        ++unknownObject

        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입을 갖는다는 것을 알고 있으므로
        // sigma() 함수를 성공적으로 호출할 수 있습니다.
        unknownObject.sigma()

        // Kotlin 1.9.20에서는 inc()가 호출될 때 컴파일러가 스마트 캐스트를 수행하지 않으므로
        // 컴파일러는 여전히 unknownObject가 Tau 타입을 갖는다고 생각합니다. sigma() 함수를 호출하면
        // 컴파일 시간 오류가 발생합니다.
        
        // Kotlin 2.0.0에서는 컴파일러가 unknownObject가 Sigma 타입을 갖는다는 것을 알고 있으므로
        // tau() 함수를 호출하면 컴파일 시간 오류가 발생합니다.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // Kotlin 1.9.20에서는 컴파일러가 실수로 unknownObject가 Tau 타입을 갖는다고 생각하므로
        // tau() 함수를 호출할 수 있지만 ClassCastException이 발생합니다.
    }
}
```

### Kotlin Multiplatform

다음 영역에서 Kotlin Multiplatform과 관련된 K2 컴파일러의 개선 사항이 있습니다.

* [컴파일 중 공통 소스와 플랫폼 소스의 분리](#separation-of-common-and-platform-sources-during-compilation)
* [expected 및 actual 선언의 다른 가시성 수준](#different-visibility-levels-of-expected-and-actual-declarations)

#### 컴파일 중 공통 소스와 플랫폼 소스의 분리

이전에는 Kotlin 컴파일러의 설계로 인해 컴파일 시 공통 소스 세트와 플랫폼 소스 세트를 분리할 수 없었습니다. 결과적으로 공통 코드가 플랫폼 코드에 액세스할 수 있었고, 이로 인해 플랫폼 간에 다른 동작이 발생했습니다. 또한 공통 코드의 일부 컴파일러 설정 및 종속성이 플랫폼 코드로 유출되었습니다.

Kotlin 2.0.0에서는 새로운 Kotlin K2 컴파일러의 구현에 공통 소스 세트와 플랫폼 소스 세트 간의 엄격한 분리를 보장하기 위해 컴파일 체계를 재설계했습니다. 이 변경 사항은 [expected 및 actual 함수](multiplatform-expect-actual#expected-and-actual-functions)를 사용할 때 가장 두드러집니다. 이전에는 공통 코드의 함수 호출이 플랫폼 코드의 함수로 확인될 수 있었습니다. 예를 들면 다음과 같습니다.
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
```
</td>
</tr>
</table>

이 예제에서 공통 코드는 실행되는 플랫폼에 따라 다른 동작을 갖습니다.

* JVM 플랫폼에서 공통 코드에서 `foo()` 함수를 호출하면 플랫폼 코드의 `foo()` 함수가 `platform foo`로 호출됩니다.
* JavaScript 플랫폼에서 공통 코드에서 `foo()` 함수를 호출하면 플랫폼 코드에 해당 함수가 없으므로 공통 코드의 `foo()` 함수가 `common foo`로 호출됩니다.

Kotlin 2.0.0에서는 공통 코드가 플랫폼 코드에 액세스할 수 없으므로 두 플랫폼 모두 `foo()` 함수를 공통 코드의 `foo()` 함수인 `common foo`로 성공적으로 확인합니다.

플랫폼 간 동작의 일관성이 향상된 것 외에도 IntelliJ IDEA 또는 Android Studio와 컴파일러 간에 충돌하는 동작이 있는 경우를 수정하기 위해 노력했습니다. 예를 들어 [expected 및 actual 클래스](multiplatform-expect-actual#expected-and-actual-classes)를 사용하는 경우 다음과 같은 일이 발생합니다.
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
    // 2.0.0 이전에는 IDE 전용 오류가 발생했습니다.
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

이 예제에서 expected 클래스 `Identity`에는 기본 생성자가 없으므로 공통 코드에서 성공적으로 호출할 수 없습니다. 이전에는 IDE에서만 오류가 보고되었지만 코드는 여전히 JVM에서 성공적으로 컴파일되었습니다. 그러나 이제 컴파일러는 올바르게 오류를 보고합니다.

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 확인 동작이 변경되지 않는 경우

새로운 컴파일 체계로 마이그레이션하는 과정에 있으므로 함수를 호출할 때 확인 동작은 여전히 동일한 소스 세트 내에 있지 않습니다. 공통 코드에서 멀티 플랫폼 라이브러리의 오버로드를 사용할 때 주로 이러한 차이점을 알 수 있습니다.

서로 다른 시그니처를 가진 두 개의 `whichFun()` 함수가 있는 라이브러리가 있다고 가정합니다.

```kotlin
// 예제 라이브러리

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

공통 코드에서 `whichFun()` 함수를 호출하는 경우 라이브러리에서 가장 관련성이 높은 인수 타입을 가진 함수가 확인됩니다.

```kotlin
// JVM 대상을 위한 예제 라이브러리를 사용하는 프로젝트

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

이에 비해 동일한 소스 세트 내에서 `whichFun()`에 대한 오버로드를 선언하는 경우 코드가 플랫폼별 버전에 액세스할 수 없으므로 공통 코드의 함수가 확인됩니다.

```kotlin
// 예제 라이브러리가 사용되지 않습니다.

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

멀티 플랫폼 라이브러리와 유사하게 `commonTest` 모듈도 별도의 소스 세트에 있으므로 플랫폼별 코드에 계속 액세스할 수 있습니다. 따라서 `commonTest` 모듈에서 함수 호출의 확인은 이전 컴파일 체계와 동일한 동작을 나타냅니다.

향후 이러한 나머지 경우는 새로운 컴파일 체계와 더 일관될 것입니다.

#### expected 및 actual 선언의 다른 가시성 수준

Kotlin 2.0.0 이전에는 Kotlin Multiplatform 프로젝트에서 [expected 및 actual 선언](multiplatform-expect-actual)을 사용하는 경우 동일한 [가시성 수준](visibility-modifiers)을 가져야 했습니다. Kotlin 2.0.0은 이제 서로 다른 가시성 수준도 지원하지만 actual 선언이 expected 선언보다 _더_ 허용적인 경우**에만** 지원합니다. 예를 들면 다음과 같습니다.

```kotlin
expect internal class Attribute // 가시성이 internal입니다.
actual class Attribute          // 가시성은 기본적으로 public이며
                                // 더 허용적입니다.
```

마찬가지로 actual 선언에서 [타입 별칭](type-aliases)을 사용하는 경우 **기본 타입**의 가시성은 expected 선언과 동일하거나 더 허용적이어야 합니다. 예를 들면 다음과 같습니다.

```kotlin
expect internal class Attribute                 // 가시성이 internal입니다.
internal actual typealias Attribute = Expanded

class Expanded                                  // 가시성은 기본적으로 public이며
                                                // 더 허용적입니다.
```

## Kotlin K2 컴파일러를 활성화하는 방법

Kotlin 2.0.0부터 Kotlin K2 컴파일러는 기본적으로 활성화됩니다.

Kotlin 버전을 업그레이드하려면 [Gradle](gradle-configure-project#apply-the-plugin) 및 [Maven](maven#configure-and-enable-the-plugin) 빌드 스크립트에서 2.0.0 또는 이후 릴리스로 변경합니다.

IntelliJ IDEA 또는 Android Studio에서 최상의 경험을 얻으려면 IDE에서 [K2 모드를 활성화](#support-in-ides)하는 것이 좋습니다.

### Gradle과 함께 Kotlin 빌드 보고서 사용

Kotlin [빌드 보고서](gradle-compilation-and-caches#build-reports)는 Kotlin 컴파일러 작업에 대한 다양한 컴파일 단계에서 소요된 시간, 사용된 컴파일러 및 Kotlin 버전, 증분 컴파일 여부에 대한 정보를 제공합니다. 이러한 빌드 보고서는 빌드 성능을 평가하는 데 유용합니다. 이는 모든 Gradle 작업의 성능에 대한 개요를 제공하므로 [Gradle 빌드 스캔](https://scans.gradle.com/)보다 Kotlin 컴파일 파이프라인에 대한 더 많은 통찰력을 제공합니다.

#### 빌드 보고서를 활성화하는 방법

빌드 보고서를 활성화하려면 빌드 보고서 출력을 저장할 위치를 `gradle.properties` 파일에서 선언합니다.

```none
kotlin.build.report.output=file
```

다음 값과 해당 조합을 출력에 사용할 수 있습니다.

| 옵션 | 설명 |
|---|---|
| `file` | 빌드 보고서를 사람이 읽을 수 있는 형식으로 로컬 파일에 저장합니다. 기본적으로 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`입니다. |
| `single_file` | 빌드 보고서를 객체 형식으로 지정된 로컬 파일에 저장합니다. |
| `build_scan` | 빌드 보고서를 [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 저장합니다. Gradle Enterprise 플러그인은 사용자 정의 값의 수와 길이를 제한합니다. 큰 프로젝트에서는 일부 값이 손실될 수 있습니다. |
| `http` | HTTP(S)를 사용하여 빌드 보고서를 게시합니다. POST 메서드는 JSON 형식으로 메트릭을 보냅니다. [Kotlin 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 전송된 데이터의 현재 버전을 볼 수 있습니다. HTTP 엔드포인트 샘플은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)에서 확인할 수 있습니다. |
| `json` | 빌드 보고서를 JSON 형식으로 로컬 파일에 저장합니다. `kotlin.build.report.json.directory`에서 빌드 보고서의 위치를 설정합니다. 기본적으로 이름은 `${project_name}-build-<date-time>-<index>.json`입니다. |

빌드 보고서로 가능한 작업에 대한 자세한 내용은 [빌드 보고서](gradle-compilation-and-caches#build-reports)를 참조하십시오.

## IDE 지원

기본적으로 IntelliJ IDEA 및 Android Studio 2024.1은 코드 분석, 코드 완성, 강조 표시 및 기타 IDE 관련 기능에 이전 컴파일러를 사용합니다. 이는 새로운 Kotlin K2 컴파일러를 통합하는 동안 성능과 안정성을 보장하기 위한 것입니다.

새로운 Kotlin K2 컴파일러로 동일한 기능을 사용해 보려면 IntelliJ IDEA 및 Android Studio 2024.1에서 지원됩니다. K2 모드를 활성화하려면:

1. IDE에서 **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동합니다.
2. **Enable K2 mode** 옵션을 선택합니다.

[블로그](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)에서 K2 모드에 대해 자세히 알아보십시오.

:::note
Kotlin 2.1.0 이후에 [Stable](components-stability#stability-levels-explained) 언어 기능을 도입할 계획입니다. 그때까지는 코드 분석에 이전 컴파일러를 계속 사용할 수 있으며 인식되지 않은 언어 기능으로 인해 코드 강조 표시 문제가 발생하지 않습니다.

:::

IDE에서 코드 분석에 사용하는 컴파일러에 관계없이 빌드 시스템에서 사용하는 컴파일러는 **독립적**이며 빌드 스크립트에서 별도로 구성됩니다. [빌드 스크립트에서 Kotlin 버전을 Kotlin 2.0.0으로 업그레이드](#how-to-enable-the-kotlin-k2-compiler)하면 새 K2 컴파일러가 빌드 시스템에서 기본적으로 사용됩니다.

## Kotlin Playground에서 Kotlin K2 컴파일러 사용해 보기

Kotlin Playground는 Kotlin 2.0.0 이상 릴리스를 지원합니다. [확인해 보세요!](https://pl.kotl.in/czuoQprce)

## 이전 컴파일러로 롤백하는 방법

Kotlin 2.0.0 이상 릴리스에서 이전 컴파일러를 사용하려면 다음 중 하나를 수행합니다.

* `build.gradle.kts` 파일에서 [언어 버전을 설정](gradle-compiler-options#example-of-setting-languageversion)을 `1.9`로 설정합니다.

  또는
* 다음 컴파일러 옵션을 사용합니다. `-language-version 1.9`.

## 변경 사항

새로운 프런트엔드의 도입으로 Kotlin 컴파일러에 몇 가지 변경 사항이 있었습니다. 먼저 코드에 영향을 미치는 가장 중요한 수정 사항을 강조 표시하고 변경된 내용을 설명하고 향후 모범 사례를 자세히 설명해 보겠습니다. 자세히 알아보려면 추가 읽기를 용이하게 하기 위해 이러한 변경 사항을 [주제 영역](#per-subject-area)으로 구성했습니다.

이 섹션에서는 다음 수정 사항을 강조 표시합니다.

* [backing 필드가 있는 open 프로퍼티의 즉시 초기화](#immediate-initialization-of-open-properties-with-backing-fields)
* [투영된 수신기에서 더 이상 사용되지 않는 합성 setter](#deprecated-synthetics-setter-on-a-projected-receiver)
* [접근할 수 없는 제네릭 타입의 사용 금지](#forbidden-use-of-inaccessible-generic-types)
* [동일한 이름을 가진 Kotlin 프로퍼티와 Java 필드의 일관된 확인 순서](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
* [Java 기본 타입 배열에 대한 향상된 null 안전성](#improved-null-safety-for-java-primitive-arrays)
* [expected 클래스에서 추상 멤버에 대한 더 엄격한 규칙](#stricter-rules-for-abstract-members-in-expected-classes)

### backing 필드가 있는 open 프로퍼티의 즉시 초기화

**변경 사항은 무엇입니까?**

Kotlin 2.0에서는 backing 필드가 있는 모든 `open` 프로퍼티를 즉시 초기화해야 합니다. 그렇지 않으면 컴파일 오류가 발생합니다. 이전에는 `open var` 프로퍼티만 즉시 초기화해야 했지만 이제 backing 필드가 있는 `open val` 프로퍼티에도 적용됩니다.

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // Kotlin 2.0부터 오류가 발생하며 이전에는 성공적으로 컴파일되었습니다.
        this.a = 1 // 오류: open val에는 초기화기가 있어야 합니다.
        // 항상 오류가 발생합니다.
        this.b = 1 // 오류: open var에는 초기화기가 있어야 합니다.
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

이 변경 사항은 컴파일러의 동작을 더 예측 가능하게 만듭니다. `open val` 프로퍼티가 커스텀 setter가 있는 `var` 프로퍼티로 재정의되는 예제를 생각해 보겠습니다.

커스텀 setter가 사용되는 경우 지연 초기화는 backing 필드를 초기화할지 setter를 호출할지 명확하지 않기 때문에 혼란을 야기할 수 있습니다. 과거에는 setter를 호출하려는 경우 이전 컴파일러가 setter가 backing 필드를 초기화한다는 보장을 할 수 없었습니다.

**이제 가장 좋은 방법은 무엇입니까?**

backing 필드가 있는 open 프로퍼티를 항상 초기화하는 것이 좋습니다. 이는 더 효율적이고 오류가 발생하기 쉽지 않다고 생각합니다.

그러나 프로퍼티를 즉시 초기화하지 않으려면 다음을 수행할 수 있습니다.

* 프로퍼티를 `final`로 만듭니다.
* 지연 초기화가 가능한 private backing 프로퍼티를 사용합니다.

자세한 내용은 [YouTrack의 해당 문제](https://youtrack.jetbrains.com/issue/KT-57555)를 참조하십시오.

### 투영된 수신기에서 더 이상 사용되지 않는 합성 setter

**변경 사항은 무엇입니까?**

Java 클래스의 합성 setter를 사용하여 클래스의 투영된 타입과 충돌하는 타입을 할당하면 오류가 발생합니다.

`getFoo()` 및 `setFoo()` 메서드를 포함하는 `Container`라는 Java 클래스가 있다고 가정합니다.

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

`Container` 클래스의 인스턴스가 투영된 타입을 갖고 있는 다음 Kotlin 코드가 있는 경우 `setFoo()` 메서드를 사용하면 항상 오류가 발생합니다. 그러나 Kotlin 2.0.0부터는 합성 `foo` 프로퍼티만 오류를 발생시킵니다.

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // Kotlin 1.0부터 오류가 발생합니다.

    // 합성 setter `foo`는 `setFoo()` 메서드로 확인됩니다.
    starProjected.foo = sampleString
    // Kotlin 2.0.0부터 오류가 발생합니다.

    inProjected.setFoo(sampleString)
    // Kotlin 1.0부터 오류가 발생합니다.

    // 합성 setter `foo`는 `setFoo()` 메서드로 확인됩니다.
    inProjected.foo = sampleString
    // Kotlin 2.0.0부터 오류가 발생합니다.
}
```

**이제 가장 좋은 방법은 무엇입니까?**

이 변경 사항으로 인해 코드에 오류가 발생하는 것을 확인하면 타입 선언을 구성하는 방법을 다시 고려할 수 있습니다. 타입 투영을 사용할 필요가 없거나 코드에서 할당을 제거해야 할 수도 있습니다.

자세한 내용은 [YouTrack의 해당 문제](https://youtrack.jetbrains.com/issue/KT-54309)를 참조하십시오.

### 접근할 수 없는 제네릭 타입의 사용 금지

**변경 사항은 무엇입니까?**

K2 컴파일러의 새로운 아키텍처로 인해 접근할 수 없는 제네릭 타입을 처리하는 방법을 변경했습니다. 일반적으로 코드에서 접근할 수 없는 제네릭 타입에 의존해서는 안 됩니다. 이는 프로젝트의 빌드 구성에 오류가 있음을 나타내고 컴파일러가 컴파일에 필요한 정보에 액세스하지 못하게 하기 때문입니다. Kotlin 2.0.0에서는 접근할 수 없는 제네릭 타입을 가진 함수 리터럴을 선언하거나 호출할 수 없으며, 접근할 수 없는 제네릭 타입 인수를 가진 제네릭 타입을 사용할 수 없습니다. 이 제한은 나중에 코드에서 컴파일러 오류를 방지하는 데 도움이 됩니다.

예를 들어 한 모듈에서 제네릭 클래스를 선언했다고 가정해 보겠습니다.

```kotlin
// 모듈 1
class Node<V>(val value: V)
```

모듈 1에 구성된 종속성을 가진 다른 모듈 (모듈 2)이 있는 경우 코드는 `Node<V>` 클래스에 액세스하여 함수 타입에서 타입으로 사용할 수 있습니다.

```kotlin
// 모듈 2
fun execute(func: (Node<Int>) `->` Unit) {}
// 함수가 성공적으로 컴파일됩니다.
```

그러나 프로젝트가 잘못 구성되어 모듈 2에만 의존하는 세 번째 모듈 (모듈 3)이 있는 경우 Kotlin 컴파일러는 세 번째 모듈을 컴파일할 때 **모듈 1**에서 `Node<V>` 클래스에 액세스할 수 없습니다. 이제 `Node<V>` 타입을 사용하는 모듈 3의 람다 또는 익명 함수는 Kotlin 2.0.0에서 오류를 발생시키므로 코드를 실행할 때 피할 수 있는 컴파일러 오류, 충돌 및 런타임 예외를 방지합니다.

```kotlin
// 모듈 3
fun test() {
    // 암시적 람다 파라미터 (it)의 타입이 접근할 수 없는 Node로 확인되기 때문에
    // Kotlin 2.0.0에서 오류가 발생합니다.
    execute {}

    // 사용되지 않은