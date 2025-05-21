---
title: "고차 함수와 람다"
---
Kotlin의 함수는 [일급](https://en.wikipedia.org/wiki/First-class_function)입니다. 즉, 변수 및 데이터 구조에 저장될 수 있고 다른 [고차 함수](#higher-order-functions)에 인수로 전달되거나 반환될 수 있습니다. 함수가 아닌 다른 값에 대해 가능한 모든 작업을 함수에 대해 수행할 수 있습니다.

이를 용이하게 하기 위해 정적 타입 프로그래밍 언어인 Kotlin은 함수의 표현을 위해 [함수 타입](#function-types)의 모음을 사용하고 [람다식](#lambda-expressions-and-anonymous-functions)과 같은 특화된 언어 구문을 제공합니다.

## 고차 함수

고차 함수는 함수를 매개변수로 사용하거나 함수를 반환하는 함수입니다.

고차 함수의 좋은 예는 컬렉션에 대한 [함수형 프로그래밍 관용구 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))입니다. 이 함수는 초기 누산기 값과 결합 함수를 사용하고 현재 누산기 값을 각 컬렉션 요소와 연속적으로 결합하여 반환 값을 빌드하고 매번 누산기 값을 대체합니다.

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) `->` R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

위의 코드에서 `combine` 매개변수는 [함수 타입](#function-types) `(R, T) `->` R`을 가지므로 타입 `R`과 `T`의 두 인수를 사용하고 타입 `R`의 값을 반환하는 함수를 허용합니다. 이는 `for` 루프 내부에서 [호출](#invoking-a-function-type-instance)되고 반환 값은 `accumulator`에 할당됩니다.

`fold`를 호출하려면 [함수 타입의 인스턴스](#instantiating-a-function-type)를 인수로 전달해야 하며 람다식(아래에 자세히 [설명됨](#lambda-expressions-and-anonymous-functions))은 고차 함수 호출 사이트에서 널리 사용됩니다.

```kotlin
fun main() {

    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambdas are code blocks enclosed in curly braces.
    items.fold(0, { 
        // When a lambda has parameters, they go first, followed by '`->`'
        acc: Int, i: Int `->` 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // The last expression in a lambda is considered the return value:
        result
    })
    
    // Parameter types in a lambda are optional if they can be inferred:
    val joinedToString = items.fold("Elements:", { acc, i `->` acc + " " + i })
    
    // Function references can also be used for higher-order function calls:
    val product = items.fold(1, Int::times)

    println("joinedToString = $joinedToString")
    println("product = $product")
}
```

## 함수 타입

Kotlin은 함수를 다루는 선언에 `(Int) `->` String`과 같은 함수 타입을 사용합니다. 예: `val onClick: () `->` Unit = ...`.

이러한 타입은 함수의 시그니처(매개변수 및 반환 값)에 해당하는 특별한 표기법을 갖습니다.

* 모든 함수 타입은 괄호로 묶인 매개변수 타입 목록과 반환 타입을 갖습니다. `(A, B) `->` C`는 타입 `A`와 `B`의 두 인수를 사용하고 타입 `C`의 값을 반환하는 함수를 나타내는 타입입니다. 매개변수 타입 목록은 `() `->` A`와 같이 비어 있을 수 있습니다. [`Unit` 반환 타입](functions#unit-returning-functions)은 생략할 수 없습니다.

* 함수 타입은 선택적으로 추가적인 *수신자* 타입을 가질 수 있으며, 이는 표기법에서 점 앞에 지정됩니다. 타입 `A.(B) `->` C`는 수신 객체 `A`에서 매개변수 `B`로 호출할 수 있고 값 `C`를 반환하는 함수를 나타냅니다. [수신자가 있는 함수 리터럴](#function-literals-with-receiver)은 이러한 타입과 함께 자주 사용됩니다.

* [일시 중단 함수](coroutines-basics#extract-function-refactoring)는 표기법에 *suspend* 수정자가 있는 특별한 종류의 함수 타입에 속합니다. 예: `suspend () `->` Unit` 또는 `suspend A.(B) `->` C`.

함수 타입 표기법에는 선택적으로 함수 매개변수의 이름을 포함할 수 있습니다. 예: `(x: Int, y: Int) `->` Point`. 이러한 이름은 매개변수의 의미를 문서화하는 데 사용할 수 있습니다.

함수 타입이 [nullable](null-safety#nullable-types-and-non-nullable-types)임을 지정하려면 다음과 같이 괄호를 사용합니다. `((Int, Int) `->` Int)?`.

함수 타입은 괄호를 사용하여 결합할 수도 있습니다. 예: `(Int) `->` ((Int) `->` Unit)`.

:::note
화살표 표기법은 오른쪽 결합 법칙을 따릅니다. `(Int) `->` (Int) `->` Unit`은 이전 예제와 동일하지만 `((Int) `->` (Int)) `->` Unit`과는 다릅니다.

:::

[타입 별칭](type-aliases)을 사용하여 함수 타입에 대체 이름을 지정할 수도 있습니다.

```kotlin
typealias ClickHandler = (Button, ClickEvent) `->` Unit
```

### 함수 타입 인스턴스화

함수 타입의 인스턴스를 얻는 방법에는 여러 가지가 있습니다.

* 다음 형식 중 하나로 함수 리터럴 내에서 코드 블록을 사용합니다.
    * [람다식](#lambda-expressions-and-anonymous-functions): `{ a, b `->` a + b }`
    * [익명 함수](#anonymous-functions): `fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [수신자가 있는 함수 리터럴](#function-literals-with-receiver)은 수신자가 있는 함수 타입의 값으로 사용할 수 있습니다.

* 기존 선언에 대한 호출 가능 참조를 사용합니다.
    * 최상위, 로컬, 멤버 또는 확장 [함수](reflection#function-references): `::isOdd`, `String::toInt`
    * 최상위, 멤버 또는 확장 [속성](reflection#property-references): `List<Int>::size`
    * [생성자](reflection#constructor-references): `::Regex`

  여기에는 특정 인스턴스의 멤버를 가리키는 [바운드 호출 가능 참조](reflection#bound-function-and-property-references)가 포함됩니다. 예: `foo::toString`.

* 함수 타입을 인터페이스로 구현하는 사용자 지정 클래스의 인스턴스를 사용합니다.

```kotlin
class IntTransformer: (Int) `->` Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) `->` Int = IntTransformer()
```

컴파일러는 충분한 정보가 있는 경우 변수에 대한 함수 타입을 추론할 수 있습니다.

```kotlin
val a = { i: Int `->` i + 1 } // The inferred type is (Int) `->` Int
```

수신자가 있거나 없는 함수 타입의 *비 리터럴* 값은 상호 교환 가능하므로 수신자는 첫 번째 매개변수를 대신할 수 있고 그 반대도 가능합니다. 예를 들어 타입 `(A, B) `->` C`의 값은 타입 `A.(B) `->` C`의 값이 예상되는 곳에 전달되거나 할당될 수 있고 그 반대의 경우도 마찬가지입니다.

```kotlin
fun main() {

    val repeatFun: String.(Int) `->` String = { times `->` this.repeat(times) }
    val twoParameters: (String, Int) `->` String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) `->` String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK

    println("result = $result")
}
```

:::note
변수가 확장 함수에 대한 참조로 초기화된 경우에도 수신자가 없는 함수 타입이 기본적으로 추론됩니다. 이를 변경하려면 변수 타입을 명시적으로 지정하십시오.

:::

### 함수 타입 인스턴스 호출

함수 타입의 값은 [`invoke(...)` 연산자](operator-overloading#invoke-operator)를 사용하여 호출할 수 있습니다. 즉, `f.invoke(x)` 또는 단순히 `f(x)`로 호출할 수 있습니다.

값이 수신자 타입을 갖는 경우 수신 객체를 첫 번째 인수로 전달해야 합니다. 수신자가 있는 함수 타입의 값을 호출하는 또 다른 방법은 값을 수신 객체로 시작하는 것입니다. 마치 값이 [확장 함수](extensions)인 것처럼 말입니다. 예: `1.foo(2)`.

예시:

```kotlin
fun main() {

    val stringPlus: (String, String) `->` String = String::plus
    val intPlus: Int.(Int) `->` Int = Int::plus
    
    println(stringPlus.invoke("`<-`", "`->`"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // extension-like call

}
```

### 인라인 함수

경우에 따라서는 고차 함수에 대해 유연한 제어 흐름을 제공하는 [인라인 함수](inline-functions)를 사용하는 것이 유익합니다.

## 람다식과 익명 함수

람다식과 익명 함수는 *함수 리터럴*입니다. 함수 리터럴은 선언되지 않았지만 즉시 식으로 전달되는 함수입니다. 다음 예를 고려하십시오.

```kotlin
max(strings, { a, b `->` a.length < b.length })
```

함수 `max`는 두 번째 인수로 함수 값을 취하므로 고차 함수입니다. 이 두 번째 인수는 함수 리터럴이라고 하는 함수인 식이며, 이는 다음 명명된 함수와 동일합니다.

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### 람다식 구문

람다식의 전체 구문 형식은 다음과 같습니다.

```kotlin
val sum: (Int, Int) `->` Int = { x: Int, y: Int `->` x + y }
```

* 람다식은 항상 중괄호로 묶입니다.
* 전체 구문 형식의 매개변수 선언은 중괄호 안에 들어가고 선택적 타입 주석을 갖습니다.
* 본문은 `->` 뒤에 옵니다.
* 람다의 추론된 반환 타입이 `Unit`이 아니면 람다 본문 내부의 마지막(또는 단일) 식이 반환 값으로 처리됩니다.

선택적 주석을 모두 생략하면 다음과 같은 모양이 됩니다.

```kotlin
val sum = { x: Int, y: Int `->` x + y }
```

### 후행 람다 전달

Kotlin 규칙에 따르면 함수의 마지막 매개변수가 함수인 경우 해당 인수로 전달된 람다식을 괄호 바깥쪽에 배치할 수 있습니다.

```kotlin
val product = items.fold(1) { acc, e `->` acc * e }
```

이러한 구문을 *후행 람다*라고도 합니다.

람다가 해당 호출의 유일한 인수이면 괄호를 완전히 생략할 수 있습니다.

```kotlin
run { println("...") }
```

### it: 단일 매개변수의 암시적 이름

람다식이 하나의 매개변수만 갖는 것은 매우 일반적입니다.

컴파일러가 매개변수 없이 시그니처를 구문 분석할 수 있는 경우 매개변수를 선언할 필요가 없으며 `->`를 생략할 수 있습니다. 매개변수는 `it`이라는 이름으로 암시적으로 선언됩니다.

```kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) `->` Boolean'
```

### 람다식에서 값 반환

[정규화된 반환](returns#return-to-labels) 구문을 사용하여 람다에서 명시적으로 값을 반환할 수 있습니다. 그렇지 않으면 마지막 식의 값이 암시적으로 반환됩니다.

따라서 다음 두 스니펫은 동일합니다.

```kotlin
ints.filter {
    val shouldFilter = it > 0
    shouldFilter
}

ints.filter {
    val shouldFilter = it > 0
    return@filter shouldFilter
}
```

이 규칙은 [괄호 바깥쪽에 람다식을 전달하는 것](#passing-trailing-lambdas)과 함께 [LINQ 스타일](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/) 코드를 허용합니다.

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 사용하지 않는 변수에 대한 밑줄

람다 매개변수가 사용되지 않으면 해당 이름 대신 밑줄을 배치할 수 있습니다.

```kotlin
map.forEach { (_, value) `->` println("$value!") }
```

### 람다의 구조 분해

람다의 구조 분해는 [구조 분해 선언](destructuring-declarations#destructuring-in-lambdas)의 일부로 설명됩니다.

### 익명 함수

위의 람다식 구문에는 한 가지 누락된 기능이 있습니다. 즉, 함수의 반환 타입을 지정하는 기능입니다. 대부분의 경우 반환 타입이 자동으로 추론될 수 있기 때문에 이는 불필요합니다. 그러나 명시적으로 지정해야 하는 경우 대체 구문인 *익명 함수*를 사용할 수 있습니다.

```kotlin
fun(x: Int, y: Int): Int = x + y
```

익명 함수는 이름이 생략된 것을 제외하고 일반 함수 선언과 매우 유사합니다. 해당 본문은 식(위에 표시된 대로) 또는 블록일 수 있습니다.

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

매개변수 및 반환 타입은 일반 함수와 동일한 방식으로 지정됩니다. 단, 컨텍스트에서 추론할 수 있는 경우 매개변수 타입을 생략할 수 있습니다.

```kotlin
ints.filter(fun(item) = item > 0)
```

익명 함수에 대한 반환 타입 추론은 일반 함수와 마찬가지로 작동합니다. 반환 타입은 식 본문이 있는 익명 함수의 경우 자동으로 추론되지만 블록 본문이 있는 익명 함수의 경우 명시적으로 지정해야 합니다(또는 `Unit`으로 간주됨).

:::note
익명 함수를 매개변수로 전달할 때는 괄호 안에 넣으십시오. 함수를 괄호 바깥쪽으로 내보낼 수 있는 약식 구문은 람다식에만 작동합니다.

:::

람다식과 익명 함수의 또 다른 차이점은 [비 로컬 반환](inline-functions#returns)의 동작입니다. 레이블이 없는 `return` 문은 항상 `fun` 키워드로 선언된 함수에서 반환됩니다. 즉, 람다식 내부의 `return`은 둘러싸는 함수에서 반환되는 반면 익명 함수 내부의 `return`은 익명 함수 자체에서 반환됩니다.

### 클로저

람다식 또는 익명 함수(뿐만 아니라 [로컬 함수](functions#local-functions) 및 [객체 식](object-declarations#object-expressions))는 외부 범위에서 선언된 변수를 포함하는 *클로저*에 접근할 수 있습니다. 클로저에서 캡처된 변수는 람다에서 수정할 수 있습니다.

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 수신자가 있는 함수 리터럴

`A.(B) `->` C`와 같은 수신자가 있는 [함수 타입](#function-types)은 수신자가 있는 함수 리터럴이라는 특별한 형식의 함수 리터럴로 인스턴스화할 수 있습니다.

위에서 언급했듯이 Kotlin은 *수신 객체*를 제공하면서 수신자가 있는 함수 타입의 [인스턴스를 호출](invoking-a-function-type-instance)하는 기능을 제공합니다.

함수 리터럴의 본문 내부에서 호출에 전달된 수신 객체는 *암시적* `this`가 되므로 추가적인 한정자 없이 해당 수신 객체의 멤버에 접근하거나 [`this` 식](this-expressions)을 사용하여 수신 객체에 접근할 수 있습니다.

이 동작은 [확장 함수](extensions)와 유사하며, 확장 함수도 함수 본문 내부에서 수신 객체의 멤버에 접근할 수 있도록 합니다.

다음은 수신 객체에서 `plus`가 호출되는 해당 타입과 함께 수신자가 있는 함수 리터럴의 예입니다.

```kotlin
val sum: Int.(Int) `->` Int = { other `->` plus(other) }
```

익명 함수 구문을 사용하면 함수 리터럴의 수신자 타입을 직접 지정할 수 있습니다. 이는 수신자가 있는 함수 타입의 변수를 선언한 다음 나중에 사용해야 하는 경우에 유용할 수 있습니다.

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

람다식은 컨텍스트에서 수신자 타입을 추론할 수 있는 경우 수신자가 있는 함수 리터럴로 사용할 수 있습니다. 이러한 사용의 가장 중요한 예 중 하나는 [타입 안전 빌더](type-safe-builders)입니다.

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() `->` Unit): HTML {
    val html = HTML()  // create the receiver object
    html.init()        // pass the receiver object to the lambda
    return html
}

html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```