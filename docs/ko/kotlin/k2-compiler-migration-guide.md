[//]: # (title: K2 컴파일러 마이그레이션 가이드)

코틀린 언어와 생태계가 계속 발전함에 따라 코틀린 컴파일러도 함께 진화해 왔습니다. 그 첫 번째 단계는 로직을 공유하여 여러 플랫폼 타겟에 대한 코드 생성을 단순화하는 새로운 JVM 및 JS IR(중간 표현, Intermediate Representation) 백엔드의 도입이었습니다. 이제 진화의 다음 단계로 K2라고 불리는 새로운 프런트엔드가 도입됩니다.

![코틀린 K2 컴파일러 아키텍처](k2-compiler-architecture.svg){width=700}

K2 컴파일러의 등장과 함께 코틀린 프런트엔드는 완전히 새로 작성되었으며, 더욱 효율적인 새로운 아키텍처를 특징으로 합니다. 새 컴파일러가 가져온 근본적인 변화는 더 많은 의미론적 정보(semantic information)를 포함하는 하나의 통합된 데이터 구조를 사용한다는 점입니다. 이 프런트엔드는 의미 분석(semantic analysis), 호출 분석(call resolution), 타입 추론(type inference)을 수행하는 역할을 담당합니다.

새로운 아키텍처와 풍부해진 데이터 구조 덕분에 K2 컴파일러는 다음과 같은 이점을 제공합니다.

* **호출 분석 및 타입 추론 개선**: 컴파일러가 더욱 일관되게 동작하며 코드를 더 잘 이해합니다.
* **새로운 언어 기능에 대한 구문 설탕(syntactic sugar) 도입 용이성**: 향후 새로운 기능이 도입될 때 더욱 간결하고 읽기 쉬운 코드를 사용할 수 있게 됩니다.
* **컴파일 시간 단축**: 컴파일 속도가 [상당히 빨라질 수 있습니다](#performance-improvements).
* **IDE 성능 향상**: 2025.1 버전부터 IntelliJ IDEA는 K2 모드를 사용하여 코틀린 코드를 분석하므로, 안정성이 높아지고 성능이 개선됩니다. 자세한 내용은 [IDE 지원](#support-in-ides) 섹션을 참조하세요.

이 가이드는 다음 내용을 다룹니다.

* 새로운 K2 컴파일러의 이점 설명.
* 마이그레이션 중 발생할 수 있는 변경 사항과 그에 따른 코드 수정 방법 안내.
* 이전 버전으로 되돌리는 방법 설명.

> 새로운 K2 컴파일러는 2.0.0 버전부터 기본으로 활성화됩니다. 코틀린 2.0.0에서 제공되는 새로운 기능과 K2 컴파일러에 대한 자세한 내용은 [Kotlin 2.0.0의 새로운 기능](whatsnew20.md)을 참조하세요.
>
{style="note"}

## 성능 개선 사항

K2 컴파일러의 성능을 평가하기 위해 [Anki-Android](https://github.com/ankidroid/Anki-Android)와 [Exposed](https://github.com/JetBrains/Exposed), 두 개의 오픈 소스 프로젝트에서 성능 테스트를 수행했습니다. 테스트를 통해 발견된 주요 성능 개선 사항은 다음과 같습니다.

* K2 컴파일러는 컴파일 속도를 최대 94%까지 향상시킵니다. 예를 들어, Anki-Android 프로젝트의 경우 클린 빌드 시간이 코틀린 1.9.23의 57.7초에서 코틀린 2.0.0의 29.7초로 단축되었습니다.
* 초기화 단계는 K2 컴파일러 사용 시 최대 488% 더 빠릅니다. 예를 들어, Anki-Android 프로젝트에서 증분 빌드(incremental build)의 초기화 단계는 코틀린 1.9.23의 0.126초에서 코틀린 2.0.0의 0.022초로 단축되었습니다.
* 코틀린 K2 컴파일러는 이전 컴파일러에 비해 분석 단계가 최대 376% 더 빠릅니다. 예를 들어, Anki-Android 프로젝트에서 증분 빌드 분석 시간은 코틀린 1.9.23의 0.581초에서 코틀린 2.0.0의 0.122초로 급감했습니다.

이러한 개선 사항에 대한 더 자세한 내용과 K2 컴파일러의 성능 분석 방법에 대해 알아보려면 [블로그 포스트](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)를 확인하세요.

## 언어 기능 개선 사항

코틀린 K2 컴파일러는 [스마트 캐스트](#smart-casts) 및 [코틀린 멀티플랫폼](#kotlin-multiplatform)과 관련된 언어 기능을 개선했습니다.

### 스마트 캐스트

코틀린 컴파일러는 특정 상황에서 객체를 특정 타입으로 자동으로 캐스팅하여, 개발자가 명시적으로 타입을 지정해야 하는 번거로움을 덜어줍니다. 이를 [스마트 캐스트(smart-casting)](typecasts.md#smart-casts)라고 합니다. 코틀린 K2 컴파일러는 이제 이전보다 더 많은 시나리오에서 스마트 캐스트를 수행합니다.

코틀린 2.0.0에서는 다음과 같은 영역에서 스마트 캐스트 관련 개선이 이루어졌습니다.

* [지역 변수 및 이후 스코프](#local-variables-and-further-scopes)
* [논리 연산자 or를 사용한 타입 검사](#type-checks-with-the-logical-or-operator)
* [인라인 함수](#inline-functions)
* [함수 타입 프로퍼티](#properties-with-function-types)
* [예외 처리](#exception-handling)
* [증감 연산자](#increment-and-decrement-operators)

#### 지역 변수 및 이후 스코프

이전에는 변수가 `if` 조건 내에서 `null`이 아닌 것으로 평가되면 해당 변수는 스마트 캐스트되었습니다. 이 변수에 대한 정보는 `if` 블록의 스코프 내에서 공유되었습니다.

하지만 변수를 `if` 조건 **외부**에서 선언한 경우, `if` 조건 내에서 변수에 대한 정보를 사용할 수 없어 스마트 캐스트가 불가능했습니다. 이러한 동작은 `when` 표현식과 `while` 루프에서도 동일하게 나타났습니다.

코틀린 2.0.0부터는 변수를 `if`, `when`, 또는 `while` 조건에서 사용하기 전에 선언하면, 컴파일러가 수집한 변수에 대한 모든 정보를 해당 블록에서 스마트 캐스트에 사용할 수 있습니다.

이는 불리언 조건을 변수로 추출하고 싶을 때 유용할 수 있습니다. 변수에 의미 있는 이름을 부여하면 코드 가독성이 향상되고 나중에 코드를 재사용할 수 있게 됩니다. 예시는 다음과 같습니다.

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 코틀린 2.0.0에서 컴파일러는 isCat에 대한 정보에 접근할 수 있어,
        // animal이 Cat 타입으로 스마트 캐스트되었음을 알 수 있습니다.
        // 따라서 purr() 함수를 호출할 수 있습니다.
        // 코틀린 1.9.20에서 컴파일러는 스마트 캐스트 정보를 알지 못하므로,
        // purr() 함수 호출 시 에러가 발생합니다.
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

#### 논리 연산자 or를 사용한 타입 검사

코틀린 2.0.0에서는 객체에 대한 타입 검사를 `or` 연산자(`||`)로 결합하면, 이들의 가장 가까운 공통 상위 타입(common supertype)으로 스마트 캐스트가 이루어집니다. 이 변경 이전에는 항상 `Any` 타입으로 스마트 캐스트되었습니다.

이전에는 스마트 캐스트된 후에도 속성에 접근하거나 함수를 호출하기 위해 객체 타입을 수동으로 다시 확인해야 했습니다. 예시는 다음과 같습니다.

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus가 공통 상위 타입인 Status로 스마트 캐스트됨
        signalStatus.signal()
        // 코틀린 2.0.0 이전에는 signalStatus가 Any 타입으로 스마트 캐스트되어,
        // signal() 함수 호출 시 Unresolved reference 에러가 발생했습니다.
        // signal() 함수는 다른 타입 검사 후에만 성공적으로 호출될 수 있었습니다.
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 공통 상위 타입은 [유니온 타입(union type)](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은 [현재 코틀린에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

#### 인라인 함수

코틀린 2.0.0에서 K2 컴파일러는 인라인 함수를 다르게 처리하여, 다른 컴파일러 분석과 결합하여 스마트 캐스트가 안전한지 여부를 결정할 수 있게 합니다.

구체적으로, 인라인 함수는 이제 암시적인 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약(contract)을 가진 것으로 취급됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 해당 위치에서 호출됨을 의미합니다. 람다 함수가 제자리에서 호출되기 때문에, 컴파일러는 람다 함수가 함수 바디 내에 포함된 변수에 대한 참조를 유출할 수 없음을 알 수 있습니다.

컴파일러는 이 지식과 다른 분석 내용을 바탕으로 캡처된 변수를 스마트 캐스트하는 것이 안전한지 결정합니다. 예시는 다음과 같습니다.

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 코틀린 2.0.0에서 컴파일러는 processor가 지역 변수이고 
        // inlineAction()이 인라인 함수임을 알기 때문에,
        // processor에 대한 참조가 유출될 수 없음을 압니다. 
        // 따라서 processor를 스마트 캐스트하는 것이 안전합니다.
      
        // processor가 null이 아니면 processor는 스마트 캐스트됨
        if (processor != null) {
            // 컴파일러는 processor가 null이 아님을 알기에 안전한 호출(safe call)이
            // 필요하지 않습니다.
            processor.process()

            // 코틀린 1.9.20에서는 안전한 호출을 수행해야 합니다:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 함수 타입 프로퍼티

이전 버전의 코틀린에서는 함수 타입을 가진 클래스 프로퍼티가 스마트 캐스트되지 않는 버그가 있었습니다. 코틀린 2.0.0과 K2 컴파일러에서 이 동작을 수정했습니다. 예시는 다음과 같습니다.

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 코틀린 2.0.0에서는 provider가 null이 아니면
        // 스마트 캐스트됩니다.
        if (provider != null) {
            // 컴파일러는 provider가 null이 아님을 압니다.
            provider()

            // 1.9.20에서 컴파일러는 provider가 null이 아님을 알지 못하므로
            // 다음과 같은 에러를 발생시킵니다:
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

이 변경 사항은 `invoke` 연산자를 오버로드한 경우에도 적용됩니다. 예시는 다음과 같습니다.

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // 1.9.20에서 컴파일러는 다음과 같은 에러를 발생시킵니다:
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 예외 처리

코틀린 2.0.0에서는 예외 처리를 개선하여 스마트 캐스트 정보가 `catch` 및 `finally` 블록으로 전달될 수 있도록 했습니다. 이 변경은 컴파일러가 객체가 널 허용 타입인지 여부를 추적하므로 코드를 더욱 안전하게 만듭니다. 예시는 다음과 같습니다.

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput이 String 타입으로 스마트 캐스트됨
    stringInput = ""
    try {
        // 컴파일러는 stringInput이 null이 아님을 압니다.
        println(stringInput.length)
        // 0

        // 컴파일러는 stringInput에 대한 이전 스마트 캐스트 정보를 무효화합니다.
        // 이제 stringInput은 String? 타입을 가집니다.
        stringInput = null

        // 예외 발생
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 코틀린 2.0.0에서 컴파일러는 stringInput이 null일 수 있음을 
        // 알기 때문에 stringInput은 널 허용 상태를 유지합니다.
        println(stringInput?.length)
        // null

        // 코틀린 1.9.20에서 컴파일러는 안전한 호출이 필요하지 않다고 
        // 판단하지만, 이는 잘못된 정보입니다.
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 증감 연산자

코틀린 2.0.0 이전에는 컴파일러가 증감 연산자를 사용한 후 객체의 타입이 변할 수 있음을 이해하지 못했습니다. 컴파일러가 객체 타입을 정확하게 추적할 수 없었기 때문에 해결되지 않은 참조(unresolved reference) 에러가 발생할 수 있었습니다. 코틀린 2.0.0에서 이 문제가 해결되었습니다.

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

    // unknownObject가 Tau 인터페이스를 상속하는지 확인
    // 참고: unknownObject는 Rho와 Tau 인터페이스를 모두 상속할 수도 있습니다.
    if (unknownObject is Tau) {

        // Rho 인터페이스의 오버로드된 inc() 연산자를 사용합니다.
        // 코틀린 2.0.0에서 unknownObject의 타입은 Sigma로
        // 스마트 캐스트됩니다.
        ++unknownObject

        // 코틀린 2.0.0에서 컴파일러는 unknownObject가 Sigma 타입을 
        // 가짐을 알기에 sigma() 함수를 성공적으로 호출할 수 있습니다.
        unknownObject.sigma()

        // 코틀린 1.9.20에서 컴파일러는 inc() 호출 시 스마트 캐스트를 
        // 수행하지 않으므로 여전히 unknownObject가 Tau 타입을 
        // 가진다고 생각합니다. sigma() 함수 호출 시 컴파일 에러가 발생합니다.
        
        // 코틀린 2.0.0에서 컴파일러는 unknownObject가 Sigma 타입을 
        // 가짐을 알기에 tau() 함수 호출 시 컴파일 에러가 발생합니다.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 코틀린 1.9.20에서는 컴파일러가 실수로 unknownObject를 Tau 타입으로 
        // 생각하기 때문에 tau() 함수를 호출할 수 있지만, 런타임에
        // ClassCastException이 발생합니다.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### 코틀린 멀티플랫폼

K2 컴파일러는 코틀린 멀티플랫폼과 관련된 다음 영역에서도 개선을 이루었습니다.

* [컴파일 중 공통 및 플랫폼 소스 분리](#separation-of-common-and-platform-sources-during-compilation)
* [expected 및 actual 선언의 가시성 수준 차이 허용](#different-visibility-levels-of-expected-and-actual-declarations)

#### 컴파일 중 공통 및 플랫폼 소스 분리

이전에는 코틀린 컴파일러 설계 구조상 컴파일 시점에 공통(common) 소스 세트와 플랫폼 소스 세트를 별도로 유지할 수 없었습니다. 그 결과, 공통 코드가 플랫폼 코드에 접근할 수 있게 되어 플랫폼 간에 서로 다른 동작이 발생하곤 했습니다. 또한 공통 코드의 일부 컴파일러 설정과 의존성이 플랫폼 코드로 유출되는 경우도 있었습니다.

코틀린 2.0.0에서는 새로운 K2 컴파일러 구현에 공통 소스 세트와 플랫폼 소스 세트 사이의 엄격한 분리를 보장하는 컴파일 체계 재설계가 포함되었습니다. 이 변화는 [expected 및 actual 함수](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-functions)를 사용할 때 가장 두드러집니다. 이전에는 공통 코드에서의 함수 호출이 플랫폼 코드의 함수로 분석되는 것이 가능했습니다. 예시는 다음과 같습니다.

<table>
   <tr>
       <td>공통 코드 (Common code)</td>
       <td>플랫폼 코드 (Platform code)</td>
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
// JavaScript 플랫폼에는 foo() 함수 오버로드가 없음
```

</td>
</tr>
</table>

이 예시에서 공통 코드는 실행되는 플랫폼에 따라 다르게 동작합니다.

* JVM 플랫폼에서는 공통 코드에서 `foo()` 함수를 호출하면 플랫폼 코드의 `foo()` 함수가 호출되어 `platform foo`가 출력됩니다.
* JavaScript 플랫폼에서는 플랫폼 코드에 해당 함수가 없으므로 공통 코드의 `foo()` 함수가 호출되어 `common foo`가 출력됩니다.

코틀린 2.0.0에서는 공통 코드가 플랫폼 코드에 접근할 수 없으므로, 두 플랫폼 모두 `foo()` 함수를 공통 코드의 `foo()` 함수로 분석하여 `common foo`를 출력합니다.

플랫폼 간 일관된 동작 개선 외에도, IntelliJ IDEA나 Android Studio와 컴파일러 간에 서로 다른 동작이 발생하는 사례를 수정하기 위해 노력했습니다. 예를 들어, [expected 및 actual 클래스](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-classes)를 사용할 때 다음과 같은 현상이 발생했습니다.

<table>
   <tr>
       <td>공통 코드 (Common code)</td>
       <td>플랫폼 코드 (Platform code)</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0 이전에는 IDE에서만 에러가 발생함
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

이 예시에서 예상 클래스(expected class) `Identity`는 기본 생성자가 없으므로 공통 코드에서 성공적으로 호출될 수 없습니다. 이전에는 IDE에서만 에러가 보고되었으나 JVM에서는 성공적으로 컴파일되었습니다. 하지만 이제 컴파일러가 정확하게 에러를 보고합니다.

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 분석 동작이 변하지 않는 경우

현재 새로운 컴파일 체계로 마이그레이션 중이므로, 동일한 소스 세트 내에 있지 않은 함수를 호출할 때는 분석 동작이 이전과 동일합니다. 주로 공통 코드에서 멀티플랫폼 라이브러리의 오버로드를 사용할 때 이러한 차이를 느낄 수 있습니다.

서로 다른 시그니처를 가진 두 개의 `whichFun()` 함수가 있는 라이브러리가 있다고 가정해 보겠습니다.

```kotlin
// 라이브러리 예시

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

공통 코드에서 `whichFun()` 함수를 호출하면, 라이브러리에서 가장 관련 있는 인수 타입을 가진 함수가 분석됩니다.

```kotlin
// JVM 타겟을 위해 예시 라이브러리를 사용하는 프로젝트

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

반면, 동일한 소스 세트 내에서 `whichFun()` 오버로드를 선언하면 공통 코드의 함수가 분석됩니다. 코드가 플랫폼 전용 버전에 접근할 수 없기 때문입니다.

```kotlin
// 예시 라이브러리를 사용하지 않는 경우

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

멀티플랫폼 라이브러리와 유사하게 `commonTest` 모듈은 별도의 소스 세트에 있으므로 여전히 플랫폼 전용 코드에 접근할 수 있습니다. 따라서 `commonTest` 모듈의 함수 호출 분석은 이전 컴파일 체계와 동일하게 동작합니다.

향후에는 이러한 잔여 사례들도 새로운 컴파일 체계와 더욱 일관되게 바뀔 예정입니다.

#### expected 및 actual 선언의 가시성 수준 차이 허용

코틀린 2.0.0 이전에는 코틀린 멀티플랫폼 프로젝트에서 [expected 및 actual 선언](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)을 사용할 때 동일한 [가시성 수준(visibility level)](visibility-modifiers.md)을 가져야 했습니다. 코틀린 2.0.0은 이제 서로 다른 가시성 수준을 지원하지만, actual 선언이 expected 선언보다 **더 허용적인(more permissive)** 경우에만 해당합니다. 예를 들어 다음과 같습니다.

```kotlin
expect internal class Attribute // 가시성이 internal임
actual class Attribute          // 기본 가시성이 public이므로 
                                // 더 허용적임
```

마찬가지로 actual 선언에서 [타입 별칭(type alias)](type-aliases.md)을 사용하는 경우, **기저 타입(underlying type)**의 가시성이 expected 선언과 동일하거나 더 허용적이어야 합니다. 예를 들어 다음과 같습니다.

```kotlin
expect internal class Attribute                 // 가시성이 internal임
internal actual typealias Attribute = Expanded

class Expanded                                  // 기본 가시성이 public이므로
                                                // 더 허용적임
```

## 코틀린 K2 컴파일러 활성화 방법

코틀린 2.0.0 버전부터 코틀린 K2 컴파일러가 기본적으로 활성화됩니다.

코틀린 버전을 업그레이드하려면 [Gradle](gradle-configure-project.md#apply-the-plugin) 또는 [Maven](maven-configure-project.md#enable-and-configure-the-plugin) 빌드 스크립트에서 버전을 2.0.0 이상으로 변경하세요.

Android Studio에서 최상의 환경을 경험하려면 IDE에서 [K2 모드](#support-in-ides)를 사용하세요. IntelliJ IDEA는 기본적으로 K2 모드를 사용하므로 별도로 변경할 필요가 없습니다.

### Gradle에서 코틀린 빌드 보고서 사용

코틀린 [빌드 보고서(build reports)](gradle-compilation-and-caches.md#build-reports)는 코틀린 컴파일러 작업의 다양한 컴파일 단계에서 소요된 시간 정보뿐만 아니라 사용된 컴파일러 및 코틀린 버전, 증분 컴파일 여부 등을 제공합니다. 이러한 빌드 보고서는 빌드 성능을 평가하는 데 유용합니다. 모든 Gradle 작업의 성능 개요를 제공하므로 [Gradle 빌드 스캔(build scans)](https://scans.gradle.com/)보다 코틀린 컴파일 파이프라인에 대해 더 많은 통찰력을 제공합니다.

#### 빌드 보고서 활성화 방법

빌드 보고서를 활성화하려면 `gradle.properties` 파일에 빌드 보고서 출력을 저장할 위치를 선언하세요.

```none
kotlin.build.report.output=file
```

출력에 대해 다음 값들과 그 조합을 사용할 수 있습니다.

| 옵션 | 설명 |
|---|---|
| `file` | 빌드 보고서를 사람이 읽을 수 있는 형식으로 로컬 파일에 저장합니다. 기본값은 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`입니다. |
| `single_file` | 빌드 보고서를 객체 형식으로 지정된 로컬 파일에 저장합니다. |
| `build_scan` | [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 빌드 보고서를 저장합니다. Gradle Enterprise 플러그인은 커스텀 값의 수와 길이를 제한하므로 대규모 프로젝트에서는 일부 값이 유실될 수 있습니다. |
| `http` | HTTP(S)를 사용하여 빌드 보고서를 게시합니다. POST 메서드는 지표를 JSON 형식으로 보냅니다. 전송되는 데이터의 현재 버전은 [Kotlin 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 볼 수 있습니다. HTTP 엔드포인트 샘플은 [이 블로그 포스트](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)에서 확인할 수 있습니다. |
| `json` | 빌드 보고서를 JSON 형식으로 로컬 파일에 저장합니다. `kotlin.build.report.json.directory`에서 빌드 보고서의 위치를 설정하세요. 기본 이름은 `${project_name}-build-<date-time>-<index>.json`입니다. |

빌드 보고서로 할 수 있는 작업에 대한 자세한 내용은 [빌드 보고서](gradle-compilation-and-caches.md#build-reports)를 참조하세요.

## IDE 지원

IntelliJ IDEA 및 Android Studio의 K2 모드는 K2 컴파일러를 사용하여 코드 분석, 코드 완성 및 하이라이팅을 개선합니다.

IntelliJ IDEA 2025.3 버전 이후부터는 항상 K2 모드를 사용합니다.

Android Studio에서는 2024.1 버전부터 다음 단계에 따라 K2 모드를 활성화할 수 있습니다.

1. **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동합니다.
2. **Enable K2 mode** 옵션을 선택합니다.

## Kotlin Playground에서 K2 컴파일러 사용해 보기

Kotlin Playground는 코틀린 2.0.0 이상 버전을 지원합니다. [지금 확인해 보세요!](https://pl.kotl.in/czuoQprce)

## 이전 컴파일러로 되돌리는 방법

코틀린 2.0.0 이상 버전에서 이전 컴파일러를 사용하려면 다음 중 하나를 수행하세요.

* `build.gradle.kts` 파일에서 [언어 버전(language version)](gradle-compiler-options.md#example-of-setting-languageversion)을 `1.9`로 설정합니다.

  또는
* 다음 컴파일러 옵션을 사용합니다: `-language-version 1.9`.

## 변경 사항

새로운 프런트엔드 도입과 함께 코틀린 컴파일러는 여러 가지 변화를 겪었습니다. 먼저 코드에 영향을 미치는 가장 중요한 변경 사항들을 살펴보고, 무엇이 바뀌었는지와 앞으로의 권장 사례를 자세히 설명하겠습니다. 더 자세한 내용을 원하시면 주제별로 정리된 [주제 영역별](#per-subject-area) 섹션을 읽어보시기 바랍니다.

이 섹션에서는 다음 변경 사항들을 다룹니다.

* [보조 필드가 있는 open 프로퍼티의 즉시 초기화](#immediate-initialization-of-open-properties-with-backing-fields)
* [프로젝션된 수신객체에 대한 합성 세터 사용 중단(Deprecated)](#deprecated-synthetics-setter-on-a-projected-receiver)
* [접근 불가능한 제네릭 타입 사용 금지](#forbidden-use-of-inaccessible-generic-types)
* [동일한 이름을 가진 코틀린 프로퍼티와 자바 필드의 일관된 분석 순서](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
* [자바 기본 타입 배열에 대한 널 안전성 개선](#improved-null-safety-for-java-primitive-arrays)
* [expected 클래스의 추상 멤버에 대한 더 엄격한 규칙](#stricter-rules-for-abstract-members-in-expected-classes)

### 보조 필드가 있는 open 프로퍼티의 즉시 초기화

**무엇이 바뀌었나요?**

코틀린 2.0에서는 보조 필드(backing field)가 있는 모든 `open` 프로퍼티를 즉시 초기화해야 하며, 그렇지 않으면 컴파일 에러가 발생합니다. 이전에는 `open var` 프로퍼티만 즉시 초기화가 필요했지만, 이제는 보조 필드가 있는 `open val` 프로퍼티로 확장되었습니다.

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // 코틀린 2.0부터는 에러가 발생하지만 이전에는 성공적으로 컴파일됨
        this.a = 1 // 에러: open val must have initializer
        // 항상 에러임
        this.b = 1 // 에러: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

이 변경을 통해 컴파일러의 동작이 더 예측 가능해졌습니다. `open val` 프로퍼티를 커스텀 세터가 있는 `var` 프로퍼티로 재정의(override)하는 경우를 생각해 보세요.

커스텀 세터가 사용되는 경우 지연 초기화(deferred initialization)는 보조 필드를 초기화하려는 것인지 세터를 호출하려는 것인지 불분명하여 혼란을 줄 수 있습니다. 과거에는 세터를 호출하려고 하더라도 이전 컴파일러가 세터가 나중에 보조 필드를 초기화할 것임을 보장할 수 없었습니다.

**현재의 권장 사례는 무엇인가요?**

보조 필드가 있는 open 프로퍼티는 항상 초기화할 것을 권장합니다. 이 방식이 더 효율적이고 에러가 발생할 가능성도 적기 때문입니다.

하지만 프로퍼티를 즉시 초기화하고 싶지 않다면 다음 방법을 사용할 수 있습니다.

* 프로퍼티를 `final`로 만듭니다.
* 지연 초기화가 가능한 private 보조 프로퍼티를 사용합니다.

자세한 내용은 [YouTrack의 관련 이슈](https://youtrack.jetbrains.com/issue/KT-57555)를 참조하세요.

### 프로젝션된 수신객체에 대한 합성 세터 사용 중단(Deprecated)

**무엇이 바뀌었나요?**

클래스의 프로젝션된 타입과 충돌하는 타입을 할당하기 위해 자바 클래스의 합성 세터(synthetic setter)를 사용하면 에러가 발생합니다.

`getFoo()`와 `setFoo()` 메서드가 포함된 `Container`라는 자바 클래스가 있다고 가정해 보겠습니다.

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

`Container` 클래스의 인스턴스가 프로젝션된 타입을 가질 때 `setFoo()` 메서드를 사용하면 항상 에러가 발생합니다. 하지만 코틀린 2.0.0부터는 합성 프로퍼티인 `foo`를 사용할 때도 에러가 발생하게 됩니다.

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // 코틀린 1.0부터 에러

    // 합성 세터 `foo`가 `setFoo()` 메서드로 분석됨
    starProjected.foo = sampleString
    // 코틀린 2.0.0부터 에러

    inProjected.setFoo(sampleString)
    // 코틀린 1.0부터 에러

    // 합성 세터 `foo`가 `setFoo()` 메서드로 분석됨
    inProjected.foo = sampleString
    // 코틀린 2.0.0부터 에러
}
```

**현재의 권장 사례는 무엇인가요?**

이 변경으로 인해 코드에 에러가 발생한다면 타입 선언 구조를 재검토해 보는 것이 좋습니다. 타입 프로젝션을 사용할 필요가 없거나, 코드에서 할당 부분을 제거해야 할 수도 있습니다.

자세한 내용은 [YouTrack의 관련 이슈](https://youtrack.jetbrains.com/issue/KT-54309)를 참조하세요.

### 접근 불가능한 제네릭 타입 사용 금지

**무엇이 바뀌었나요?**

K2 컴파일러의 새로운 아키텍처로 인해 접근 불가능한 제네릭 타입을 처리하는 방식이 변경되었습니다. 일반적으로 접근 불가능한 제네릭 타입에 의존해서는 안 됩니다. 이는 프로젝트 빌드 구성에 오류가 있어 컴파일러가 컴파일에 필요한 정보에 접근하지 못하고 있음을 의미하기 때문입니다. 코틀린 2.0.0에서는 접근 불가능한 제네릭 타입을 포함하는 함수 리터럴을 선언하거나 호출할 수 없으며, 접근 불가능한 제네릭 타입 인수를 가진 제네릭 타입을 사용할 수도 없습니다. 이 제한사항은 나중에 발생할 수 있는 컴파일러 에러를 사전에 방지하는 데 도움이 됩니다.

예를 들어, 한 모듈에서 제네릭 클래스를 선언했다고 가정해 보겠습니다.

```kotlin
// 모듈 1
class Node<V>(val value: V)
```

모듈 1에 의존성이 설정된 다른 모듈(모듈 2)이 있다면, 해당 코드는 `Node<V>` 클래스에 접근하여 함수 타입에서 타입으로 사용할 수 있습니다.

```kotlin
// 모듈 2
fun execute(func: (Node<Int>) -> Unit) {}
// 함수가 성공적으로 컴파일됨
```

하지만 모듈 2에만 의존하고 모듈 1에는 의존하지 않도록 프로젝트가 잘못 구성된 세 번째 모듈(모듈 3)이 있다면, 코틀린 컴파일러는 모듈 3을 컴파일할 때 **모듈 1**의 `Node<V>` 클래스에 접근할 수 없습니다. 이제 모듈 3에서 `Node<V>` 타입을 사용하는 람다나 익명 함수는 코틀린 2.0.0에서 에러를 발생시키며, 이를 통해 나중에 발생할 수 있는 컴파일러 에러, 크래시 및 런타임 예외를 방지할 수 있습니다.

```kotlin
// 모듈 3
fun test() {
    // 코틀린 2.0.0에서 에러 발생. 암시적 람다 파라미터(it)의 타입이 
    // 접근 불가능한 Node로 분석되기 때문입니다.
    execute {}

    // 코틀린 2.0.0에서 에러 발생. 사용되지 않는 람다 파라미터(_)의 타입이
    // 접근 불가능한 Node로 분석되기 때문입니다.
    execute { _ -> }

    // 코틀린 2.0.0에서 에러 발생. 사용되지 않는 익명 함수 파라미터(_)의 타입이
    // 접근 불가능한 Node로 분석되기 때문입니다.
    execute(fun (_) {})
}
```

접근 불가능한 제네릭 타입의 값 파라미터를 포함하는 함수 리터럴 외에도, 접근 불가능한 제네릭 타입 인수를 가진 타입에서도 에러가 발생합니다.

예를 들어, 모듈 1에 동일한 제네릭 클래스 선언이 있고 모듈 2에서 또 다른 제네릭 클래스 `Container<C>`를 선언했다고 가정해 보겠습니다. 또한 제네릭 클래스 `Node<V>`를 타입 인수로 사용하여 `Container<C>`를 활용하는 함수들을 모듈 2에 선언했습니다.

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

// 제네릭 클래스 타입을 가지며 동시에
// 제네릭 클래스 타입 인수를 가지는 함수들
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

모듈 3에서 이러한 함수들을 호출하려고 하면, 모듈 3에서는 제네릭 클래스 `Node<V>`에 접근할 수 없으므로 코틀린 2.0.0에서 에러가 발생합니다.

```kotlin
// 모듈 3
fun test() {
    // 코틀린 2.0.0에서 에러 발생. 제네릭 클래스 Node<V>에 
    // 접근할 수 없기 때문입니다.
    consume(produce())
}
```

향후 릴리스에서는 접근 불가능한 타입 전반에 대한 사용을 계속 금지해 나갈 예정입니다. 이미 코틀린 2.0.0에서는 비제네릭 타입을 포함한 접근 불가능한 타입의 일부 시나리오에 대해 경고를 추가하기 시작했습니다.

예를 들어 위와 동일한 모듈 구성에서 제네릭 클래스 `Node<V>`를 비제네릭 클래스 `IntNode`로 바꾸고 모든 함수를 모듈 2에 선언했다고 가정해 보겠습니다.

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
// `IntNode` 타입을 파라미터로 가지는 
// 람다를 포함하는 함수
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// `IntNode`를 타입 인수로 가지는 
// 제네릭 클래스 타입을 사용하는 함수들
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

모듈 3에서 이러한 함수를 호출하면 일부 경고가 발생합니다.

```kotlin
// 모듈 3
fun test() {
    // 코틀린 2.0.0에서 경고 발생. IntNode 클래스에 
    // 접근할 수 없기 때문입니다.

    execute {}
    // Class 'IntNode' of the parameter 'it' is inaccessible.

    execute { _ -> }
    execute(fun (_) {})
    // Class 'IntNode' of the parameter '_' is inaccessible.

    // 향후 코틀린 릴리스에서는 IntNode에 접근할 수 없으므로
    // 경고를 발생시킬 예정입니다.
    consume(produce())
}
```

**현재의 권장 사례는 무엇인가요?**

접근 불가능한 제네릭 타입과 관련된 새로운 경고가 나타나면 빌드 시스템 구성에 문제가 있을 가능성이 매우 높습니다. 빌드 스크립트와 구성을 확인해 볼 것을 권장합니다.

최후의 수단으로 모듈 3에서 모듈 1로의 직접적인 의존성을 설정할 수도 있습니다. 또는 동일한 모듈 내에서 타입에 접근할 수 있도록 코드를 수정할 수도 있습니다.

자세한 내용은 [YouTrack의 관련 이슈](https://youtrack.jetbrains.com/issue/KT-64474)를 참조하세요.

### 동일한 이름을 가진 코틀린 프로퍼티와 자바 필드의 일관된 분석 순서

**무엇이 바뀌었나요?**

코틀린 2.0.0 이전에는 서로 상속 관계에 있는 자바와 코틀린 클래스에서 동일한 이름을 가진 코틀린 프로퍼티와 자바 필드가 있을 때, 해당 이름에 대한 분석 동작이 일관되지 않았습니다. 또한 IntelliJ IDEA와 컴파일러 간에도 서로 다른 동작이 있었습니다. 코틀린 2.0.0을 위한 새로운 분석 동작을 개발하면서 사용자에게 미치는 영향을 최소화하는 것을 목표로 했습니다.

예를 들어, 자바 클래스 `Base`가 있다고 가정해 보겠습니다.

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

위의 `Base` 클래스를 상속하는 코틀린 클래스 `Derived`가 있다고 가정해 보겠습니다.

```kotlin
class Derived : Base() {
    val a = "aa"

    // 커스텀 get() 함수 선언
    val b get() = "bb"
}

fun main() {
    // Derived.a로 분석됨
    println(a)
    // aa

    // Base.b로 분석됨
    println(b)
    // b
}
```

코틀린 2.0.0 이전에는 `a`가 `Derived` 코틀린 클래스 내의 코틀린 프로퍼티로 분석되는 반면, `b`는 `Base` 자바 클래스의 자바 필드로 분석되었습니다.

코틀린 2.0.0에서는 이 예시의 분석 동작이 일관되게 적용되어, 코틀린 프로퍼티가 동일한 이름의 자바 필드보다 우선순위를 갖습니다. 이제 `b`는 `Derived.b`로 분석됩니다.

> 코틀린 2.0.0 이전에는 IntelliJ IDEA에서 `a`의 선언이나 사용 위치로 이동하려고 하면, 코틀린 프로퍼티로 이동해야 함에도 불구하고 잘못해서 자바 필드로 이동하곤 했습니다.
> 
> 코틀린 2.0.0부터 IntelliJ IDEA는 컴파일러와 동일하게 정확한 위치로 이동합니다.
>
{style="note"}

일반적인 규칙은 하위 클래스(subclass)가 우선순위를 갖는다는 것입니다. 위 예시는 `Derived`가 `Base` 자바 클래스의 하위 클래스이므로 `Derived` 클래스의 코틀린 프로퍼티 `a`가 분석되는 것을 보여줍니다.

상속 관계가 반대여서 자바 클래스가 코틀린 클래스를 상속하는 경우에는 하위 클래스의 자바 필드가 동일한 이름의 코틀린 프로퍼티보다 우선순위를 갖습니다.

다음 예시를 살펴보세요.

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

이 경우 다음 코드에서의 결과는 다음과 같습니다.

```kotlin
fun main() {
    // Derived.a로 분석됨
    println(a)
    // a
}
```

**현재의 권장 사례는 무엇인가요?**

이 변경 사항이 코드에 영향을 미친다면 중복된 이름을 정말로 사용해야 하는지 고려해 보세요. 서로를 상속하는 자바 또는 코틀린 클래스들이 각각 동일한 이름의 필드나 프로퍼티를 포함하고 싶다면, 하위 클래스의 필드나 프로퍼티가 우선순위를 갖는다는 점을 유념하시기 바랍니다.

자세한 내용은 [YouTrack의 관련 이슈](https://youtrack.jetbrains.com/issue/KT-55017)를 참조하세요.

### 자바 기본 타입 배열에 대한 널 안전성 개선

**무엇이 바뀌었나요?**

코틀린 2.0.0부터 컴파일러는 코틀린으로 임포트된 자바 기본 타입 배열의 널 허용 여부(nullability)를 정확하게 추론합니다. 이제 자바 기본 타입 배열과 함께 사용된 `TYPE_USE` 어노테이션에서 네이티브 널 허용 여부를 유지하며, 어노테이션에 따라 값이 사용되지 않을 때 에러를 발생시킵니다.

일반적으로 `@Nullable` 및 `@NotNull` 어노테이션이 있는 자바 타입을 코틀린에서 호출하면 적절한 네이티브 널 허용 여부를 부여받습니다.

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

하지만 이전에는 자바 기본 타입 배열을 코틀린으로 임포트할 때 모든 `TYPE_USE` 어노테이션이 유실되어 플랫폼 널 허용 여부(platform nullability)로 취급되었고, 결과적으로 안전하지 않은 코드가 생성될 가능성이 있었습니다.

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// 어노테이션에 따르면 `dataService.fetchData()`가 `null`일 수 있음에도 에러가 발생하지 않음
// 이는 NullPointerException을 유발할 수 있음
dataService.fetchData()[0]
```
참고로 이 문제는 선언 자체의 널 허용 여부 어노테이션에는 영향을 미치지 않았으며 오직 `TYPE_USE` 어노테이션에만 영향을 미쳤습니다.

**현재의 권장 사례는 무엇인가요?**

코틀린 2.0.0에서 자바 기본 타입 배열의 널 안전성은 이제 표준 사양입니다. 이러한 배열을 사용한다면 새로운 경고나 에러가 발생하는지 확인해 보세요.

* 명시적인 null 체크 없이 `@Nullable` 자바 기본 타입 배열을 사용하거나, null을 허용하지 않는 기본 타입 배열을 기대하는 자바 메서드에 `null`을 전달하려는 코드는 이제 컴파일되지 않습니다.
* `@NotNull` 기본 타입 배열에 대해 null 체크를 수행하면 이제 "Unnecessary safe call" 또는 "Comparison with null always false" 경고가 발생합니다.

자세한 내용은 [YouTrack의 관련 이슈](https://youtrack.jetbrains.com/issue/KT-54521)를 참조하세요.

### expected 클래스의 추상 멤버에 대한 더 엄격한 규칙

> expected 및 actual 클래스는 [베타(Beta)](components-stability.md#stability-levels-explained) 단계입니다.
> 거의 안정화되었으나 향후 마이그레이션 단계가 필요할 수 있습니다. 
> 변경 사항을 최소화하기 위해 최선을 다하겠습니다.
>
{style="warning"}

**무엇이 바뀌었나요?**

K2 컴파일러에서 컴파일 중 공통 소스와 플랫폼 소스가 분리됨에 따라, expected 클래스의 추상 멤버에 대해 더 엄격한 규칙을 구현했습니다.

이전 컴파일러에서는 예상 비추상 클래스(expected non-abstract class)가 [함수를 재정의(overriding)](inheritance.md#overriding-rules)하지 않고도 추상 함수를 상속받는 것이 가능했습니다. 컴파일러가 공통 코드와 플랫폼 코드에 동시에 접근할 수 있었기 때문에, 추상 함수가 실제 클래스(actual class)에서 대응되는 재정의 및 정의를 가지고 있는지 확인할 수 있었기 때문입니다.

이제 공통 소스와 플랫폼 소스가 별도로 컴파일되므로, 컴파일러가 해당 함수가 추상이 아님을 알 수 있도록 expected 클래스에서 상속된 함수를 명시적으로 재정의해야 합니다. 그렇지 않으면 컴파일러는 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 에러를 보고합니다.

예를 들어, 공통 소스 세트에 추상 함수 `listFiles()`를 가진 `FileSystem`이라는 추상 클래스를 선언했다고 가정해 보겠습니다. 그리고 플랫폼 소스 세트의 actual 선언의 일부로 `listFiles()` 함수를 정의합니다.

공통 코드에서 `FileSystem` 클래스를 상속하는 `PlatformFileSystem`이라는 예상 비추상 클래스가 있다면, `PlatformFileSystem` 클래스는 추상 함수 `listFiles()`를 상속받습니다. 그러나 코틀린의 비추상 클래스에는 추상 함수를 포함할 수 없습니다. `listFiles()` 함수를 비추상 함수로 만들려면 `abstract` 키워드 없이 재정의(override)로 선언해야 합니다.

<table>
   <tr>
       <td>공통 코드 (Common code)</td>
       <td>플랫폼 코드 (Platform code)</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // 코틀린 2.0.0에서는 명시적인 재정의가 필요함
    expect override fun listFiles()
    // 코틀린 2.0.0 이전에는 재정의가 필요하지 않았음
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

**현재의 권장 사례는 무엇인가요?**

예상 비추상 클래스에서 추상 함수를 상속받는 경우, 비추상 재정의를 추가하세요.

자세한 내용은 [YouTrack의 관련 이슈](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual)를 참조하세요.

### 주제 영역별

다음 주제 영역에는 코드에 영향을 줄 가능성은 낮지만, 추가 정보를 위해 관련 YouTrack 이슈 링크가 포함되어 있습니다. 이슈 ID 옆에 별표(*)가 표시된 변경 사항은 이 섹션의 시작 부분에서 설명된 내용입니다.

#### 타입 추론 (Type inference) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 타입이 명시적으로 Normal인 경우 프로퍼티 참조의 컴파일된 함수 시그니처에 잘못된 타입이 표시됨 |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 빌더 추론 컨텍스트에서 타입 변수가 상한(upper bound)으로 암시적으로 추론되는 것을 금지 |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2: 배열 리터럴의 제네릭 어노테이션 호출에 명시적 타입 인수를 요구 |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 교차 타입(intersection type)에 대한 누락된 하위 타입 체크 |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | 코틀린에서 자바 타입 파라미터 기반 타입의 기본 표현 방식 변경 |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 전위 증가 연산자의 추론된 타입을 inc() 연산자의 반환 타입 대신 게터의 반환 타입으로 변경 |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2: 반공변(contravariant) 파라미터에 대한 @UnsafeVariance 존재 여부에 대한 의존 중단 |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2: 원시 타입(raw types)에 대해 포괄된(subsumed) 멤버로의 분석 금지 |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2: 확장 함수 파라미터를 가진 호출 가능 객체에 대한 호출 가능 참조 타입의 올바른 추론 |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 구조 분해 변수의 실제 타입을 지정된 경우 명시적 타입과 일관되게 유지 |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2: 정수 리터럴 오버플로우와 관련된 일관되지 않은 동작 수정 |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 익명 함수에서 타입 인수를 통해 익명 타입이 노출될 수 있음 |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | break를 포함한 while 루프의 조건이 안전하지 않은 스마트 캐스트를 생성할 수 있음 |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2: expect/actual 최상위 프로퍼티에 대해 공통 코드에서의 스마트 캐스트 금지 |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 반환 타입을 변경하는 증가 및 더하기 연산자가 스마트 캐스트에 영향을 미쳐야 함 |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2: 변수 타입을 명시적으로 지정하면 K1에서 작동하던 일부 상황에서 바운드 스마트 캐스트가 깨짐 |

#### 제네릭 (Generics) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [프로젝션된 수신객체에 대한 합성 세터 사용 중단](#deprecated-synthetics-setter-on-a-projected-receiver) |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600) | 원시 타입 파라미터를 가진 자바 메서드를 제네릭 타입 파라미터로 재정의하는 것을 금지 |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663) | 널 허용 가능성이 있는 타입 파라미터를 `in` 프로젝션된 DNN 파라미터에 전달하는 것을 금지 |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066) | 타입 별칭(typealias) 생성자에서의 상한(upper bound) 위반을 사용 중단(Deprecate) |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404) | 자바 클래스 기반의 반공변 캡처 타입에 대한 타입 불완전성 수정 |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718) | 셀프 상한(self upper bounds) 및 캡처 타입을 사용한 안전하지 않은 코드 금지 |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749) | 제네릭 외부 클래스의 제네릭 내부 클래스에서 안전하지 않은 상한 위반 금지 |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923) | K2: 내부 클래스의 외부 상위 타입 프로젝션에 대해 PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE 도입 |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243) | 다른 상위 타입으로부터 추가적으로 전문화된 구현을 가진 기본 타입 컬렉션을 상속받을 때 MANY_IMPL_MEMBER_NOT_IMPLEMENTED 보고 |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305) | K2: 확장된 타입에 변성 수정자(variance modifiers)가 있는 타입 별칭에 대한 생성자 호출 및 상속 금지 |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965) | 셀프 상한을 가진 캡처 타입의 부적절한 처리로 인한 타입 홀(type hole) 수정 |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966) | 제네릭 파라미터에 잘못된 타입을 사용한 제네릭 위임 생성자 호출 금지 |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712) | 상한이 캡처 타입일 때 누락된 상한 위반 보고 |

#### 분석 (Resolution) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [자바 필드가 포함된 상위 클래스의 오버로드 분석 중 하위 클래스의 코틀린 프로퍼티를 선택](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260) | invoke 관례가 기대되는 디슈가링(desugaring)과 일관되게 동작하도록 수정 |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866) | K2: 정적 스코프보다 컴패니언 객체가 우선되는 경우의 한정자(qualifier) 분석 동작 변경 |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750) | 타입을 분석할 때 동일한 이름의 클래스가 스타 임포트된 경우 모호성 에러 보고 |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558) | K2: COMPATIBILITY_WARNING 관련 분석 마이그레이션 |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194) | 동일한 의존성의 두 가지 다른 버전에 포함된 의존성 클래스에서 발생하는 가짜 음성(False negative) CONFLICTING_INHERITED_MEMBERS |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592) | 수신객체가 있는 함수형 타입의 프로퍼티 호출이 확장 함수 호출보다 우선됨 |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666) | 한정된 this: 타입으로 한정된 this 사례 도입 및 우선순위 지정 |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166) | 클래스패스에서 완전 한정 이름(FQ name) 충돌 시의 명시되지 않은 동작 확인 |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431) | K2: 임포트에서 타입 별칭을 한정자로 사용하는 것을 금지 |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520) | K1/K2: 하위 레벨에서 모호성이 있는 타입 참조에 대한 분석 타워의 잘못된 동작 |

#### 가시성 (Visibility) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [접근 불가능한 타입의 사용을 명시되지 않은 동작으로 선언](#forbidden-use-of-inaccessible-generic-types) |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179) | internal 인라인 함수에서 private 클래스 컴패니언 객체 멤버를 호출할 때 발생하는 가짜 음성 PRIVATE_CLASS_MEMBER_FROM_INLINE |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042) | 재정의된 선언이 가시적이더라도 동등한 게터가 비가시적인 경우 합성 프로퍼티를 비가시적으로 설정 |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255) | 다른 모듈의 파생 클래스에서 internal 세터에 접근하는 것을 금지 |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917) | private 인라인 함수에서 익명 타입을 노출하는 것을 금지 |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997) | public-API 인라인 함수에서 암시적인 non-public-API 접근을 금지 |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310) | 스마트 캐스트가 protected 멤버의 가시성에 영향을 주지 않아야 함 |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494) | public 인라인 함수에서 간과된 private 연산자 함수에 접근하는 것을 금지 |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004) | K1: protected val을 재정의하는 var의 세터가 public으로 생성됨 |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972) | Kotlin/Native의 링크 타임에서 private 멤버로 재정의하는 것을 금지 |

#### 어노테이션 (Annotations) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | 어노테이션에 EXPRESSION 타겟이 없는 경우 해당 어노테이션을 문(statement)에 사용하는 것을 금지 |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | `REPEATED_ANNOTATION` 검사 중 괄호 표현식을 무시 |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2: 프로퍼티 게터에 사용 지점(use-site) 'get' 타겟 어노테이션 사용 금지 |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | where 절의 타입 파라미터에 어노테이션 사용 금지 |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 컴패니언 객체의 어노테이션 분석 시 컴패니언 스코프가 무시됨 |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2: 사용자 지정 어노테이션과 컴파일러 요구 어노테이션 간의 모호성 발생 |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | 열거형 값의 어노테이션이 열거형 값 클래스로 복사되지 않아야 함 |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2: `()?`로 감싸진 타입의 호환되지 않는 어노테이션에 대해 `WRONG_ANNOTATION_TARGET` 보고 |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2: catch 파라미터 타입의 어노테이션에 대해 `WRONG_ANNOTATION_TARGET` 보고 |

#### 널 안전성 (Null safety) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [자바에서 Nullable로 어노테이션된 배열 타입의 안전하지 않은 사용 중단](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034) | K2: 안전한 호출(safe calls)과 관례 연산자(convention operators) 조합에 대한 평가 시맨틱 변경 |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850) | 상위 타입의 순서가 상속된 함수의 널 허용 여부 파라미터를 정의함 |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982) | public 시그니처에서 지역 타입을 근사화할 때 널 허용 여부 유지 |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998) | 안전하지 않은 할당의 선택자로서 nullable을 not-null 자바 필드에 할당하는 것을 금지 |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209) | 경고 수준 자바 타입의 에러 수준 널 허용 인수에 대해 누락된 에러 보고 |

#### 자바 상호운용성 (Java interoperability) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 소스에서 동일한 완전 한정 이름(FQ name)을 가진 자바 및 코틀린 클래스 금지 |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | 자바 컬렉션에서 상속된 클래스가 상위 타입 순서에 따라 일관되지 않게 동작함 |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2: 자바 클래스가 코틀린 private 클래스를 상속하는 경우의 명시되지 않은 동작 |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | 자바 가변 인자(vararg) 메서드를 인라인 함수에 전달하면 런타임에 단순 배열 대신 배열의 배열이 생성됨 |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | K-J-K 계층 구조에서 internal 멤버를 재정의할 수 있도록 허용 |

#### 프로퍼티 (Properties) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 보조 필드가 있는 open 프로퍼티의 지연 초기화 금지](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589) | 기본 생성자가 없거나 클래스가 지역적인 경우 누락된 MUST_BE_INITIALIZED를 사용 중단 |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295) | 프로퍼티에 대한 잠재적인 invoke 호출의 경우 재귀적 분석 금지 |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290) | 상위 클래스가 다른 모듈에 있는 경우 비가시적인 파생 클래스로부터 상위 클래스 프로퍼티에 대한 스마트 캐스트 사용 중단 |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661) | K2: 데이터 클래스 프로퍼티에 대한 OPT_IN_USAGE_ERROR 누락 |

#### 제어 흐름 (Control flow) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | 클래스 초기화 블록 내의 CFA 규칙이 K1과 K2 사이에 일관되지 않음 |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | 괄호 안의 else 분기 없는 if 조건문에 대한 K1/K2 불일치 |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 스코프 함수 내에서 초기화가 이루어지는 try/catch 블록에서의 가짜 음성 "VAL_REASSIGNMENT" |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | try 블록에서 catch 및 finally 블록으로 데이터 흐름 정보 전파 |

#### 열거형 클래스 (Enum classes) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | 열거형 항목(enum entry) 초기화 중 열거형 클래스의 컴패니언 객체에 접근하는 것을 금지 |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | 열거형 클래스의 가상(virtual) 인라인 메서드에 대해 누락된 에러 보고 |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 프로퍼티/필드와 열거형 항목 간의 분석 모호성 보고 |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 컴패니언 프로퍼티가 열거형 항목보다 우선되는 경우의 한정자 분석 동작 변경 |

#### 함수형 (SAM) 인터페이스 {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 어노테이션 없이 OptIn을 요구하는 SAM 생성자 사용을 사용 중단 |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | JDK 함수형 인터페이스의 SAM 생성자를 위한 람다에서 잘못된 널 허용 여부를 가진 값 반환 금지 |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 호출 가능 참조의 파라미터 타입에 대한 SAM 변환이 CCE(ClassCastException)를 유발함 |

#### 컴패니언 객체 (Companion object) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|-----------------------------------------------------------|--------------------------------------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 컴패니언 객체 멤버에 대한 out-of-call 참조가 유효하지 않은 시그니처를 가짐 |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | V에 컴패니언이 있을 때 (V)::foo 참조 분석 방식 변경 |

#### 기타 (Miscellaneous) {initial-collapse-state="collapsed" collapsible="true"}

| 이슈 ID | 제목 |
|------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | [구현부가 actual 대응부에 위치할 때 K2/MPP가 공통 코드의 상속자에 대해 [ABSTRACT_MEMBER_NOT_IMPLEMENTED]를 보고함](#stricter-rules-for-abstract-members-in-expected-classes) |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015) | 한정된 this: 잠재적인 레이블 충돌 시의 동작 변경 |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545) | 자바 하위 클래스에서 우연히 오버로드가 충돌하는 경우 JVM 백엔드에서의 잘못된 함수 맹글링(mangling) 수정 |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019) | [LC 이슈] 문(statement) 위치에서 suspend 마크가 된 익명 함수 선언을 금지 |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111) | OptIn: 마커 아래에서 기본 인수(기본값을 가진 파라미터)를 사용한 생성자 호출 금지 |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182) | 변수 위의 표현식 + invoke 분석 시 Unit 변환이 실수로 허용됨 |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199) | 적응(adaptations)이 포함된 호출 가능 참조를 KFunction으로 승격하는 것을 금지 |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776) | [LC] K2에서 `false && ...` 및 `false || ...`가 깨지는 문제 |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682) | [LC] `header`/`impl` 키워드 사용 중단 |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375) | 기본적으로 invokedynamic + LambdaMetafactory를 통해 모든 코틀린 람다 생성 |

## 코틀린 릴리스와의 호환성

다음 코틀린 릴리스들은 새로운 K2 컴파일러를 지원합니다.

| 코틀린 릴리스 | 안정성 수준 |
|-----------------------|-----------------|
| 2.0.0–%kotlinVersion% | 안정(Stable) |
| 1.9.20–1.9.25         | 베타(Beta) |
| 1.9.0–1.9.10          | JVM은 베타 |
| 1.7.0–1.8.22          | 알파(Alpha) |

## 코틀린 라이브러리와의 호환성

Kotlin/JVM을 사용하는 경우 K2 컴파일러는 모든 버전의 코틀린으로 컴파일된 라이브러리와 호환됩니다.

코틀린 멀티플랫폼을 사용하는 경우 K2 컴파일러는 코틀린 1.9.20 이상 버전으로 컴파일된 라이브러리와의 작동이 보장됩니다.

## 컴파일러 플러그인 지원

현재 코틀린 K2 컴파일러는 다음 코틀린 컴파일러 플러그인을 지원합니다.

* [`all-open`](all-open-plugin.md)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok.md)
* [`no-arg`](no-arg-plugin.md)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [Power-assert](power-assert.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Serialization](serialization.md)

또한 코틀린 K2 컴파일러는 다음을 지원합니다.

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 컴파일러 플러그인 및 이후 버전.
* [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 이후의 [Kotlin Symbol Processing (KSP)](ksp-overview.md).

> 추가적인 컴파일러 플러그인을 사용하는 경우 해당 플러그인의 문서를 확인하여 K2와 호환되는지 확인하세요.
>
{style="tip"}

### 커스텀 컴파일러 플러그인 업그레이드

> 커스텀 컴파일러 플러그인은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계인 플러그인 API를 사용합니다. 
> 결과적으로 API는 언제든지 변경될 수 있으므로 하위 호환성을 보장할 수 없습니다.
>
{style="warning"}

업그레이드 프로세스는 커스텀 플러그인의 유형에 따라 두 가지 경로가 있습니다.

#### 백엔드 전용 컴파일러 플러그인

플러그인이 `IrGenerationExtension` 확장 지점만 구현한다면, 프로세스는 다른 새로운 컴파일러 릴리스와 동일합니다. 사용하는 API에 변경 사항이 있는지 확인하고 필요한 경우 수정하세요.

#### 백엔드 및 프런트엔드 컴파일러 플러그인

플러그인이 프런트엔드 관련 확장 지점을 사용하는 경우 새로운 K2 컴파일러 API를 사용하여 플러그인을 다시 작성해야 합니다. 새로운 API에 대한 입문은 [FIR Plugin API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)를 참조하세요.

> 커스텀 컴파일러 플러그인 업그레이드에 대해 질문이 있는 경우 Slack의 [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) 채널에 참여해 주세요. 최선을 다해 도와드리겠습니다.
>
{style="note"}

## 새로운 K2 컴파일러에 대한 피드백 공유

여러분의 소중한 피드백을 기다립니다!

* 새로운 K2 컴파일러로 마이그레이션하는 과정에서 직면한 모든 문제는 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)에 보고해 주세요.
* [사용 통계 전송 옵션을 활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)하여 JetBrains가 K2 사용에 대한 익명 데이터를 수집할 수 있도록 허용해 주세요.