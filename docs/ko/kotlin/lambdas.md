[//]: # (title: 고차 함수와 람다)

Kotlin 함수는 [일급 객체](https://en.wikipedia.org/wiki/First-class_function)입니다. 이는 함수가 변수와 데이터 구조에 저장될 수 있으며, 다른 [고차 함수](#higher-order-functions)에 인수로 전달되거나 반환될 수 있음을 의미합니다. 함수가 아닌 다른 값에 대해 가능한 모든 연산을 함수에 수행할 수 있습니다.

이를 용이하게 하기 위해 Kotlin은 정적 타입 지정 프로그래밍 언어로서 함수를 표현하는 데 [함수 타입](#function-types) 계열을 사용하며, [람다 표현식](#lambda-expressions-and-anonymous-functions)과 같은 특수 언어 구성 요소를 제공합니다.

## 고차 함수

고차 함수는 함수를 파라미터로 받거나 함수를 반환하는 함수입니다.

고차 함수의 좋은 예시는 컬렉션을 위한 [함수형 프로그래밍 관용구 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))입니다. 이 함수는 초기 누산기(accumulator) 값과 결합 함수를 받아서, 현재 누산기 값을 각 컬렉션 요소와 연속적으로 결합하고 매번 누산기 값을 교체함으로써 반환 값을 만듭니다:

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) -> R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

위 코드에서 `combine` 파라미터는 `(R, T) -> R` [함수 타입](#function-types)을 가지므로, `R` 타입과 `T` 타입의 두 인수를 받고 `R` 타입 값을 반환하는 함수를 받습니다. 이 함수는 `for` 루프 내에서 [호출](#invoking-a-function-type-instance)되며, 그 반환 값은 `accumulator`에 할당됩니다.

`fold`를 호출하려면 [함수 타입 인스턴스](#instantiating-a-function-type)를 인수로 전달해야 하며, 람다 표현식([아래에서 더 자세히 설명](#lambda-expressions-and-anonymous-functions))은 고차 함수 호출 지점에서 이 목적으로 널리 사용됩니다:

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambdas are code blocks enclosed in curly braces.
    items.fold(0, { 
        // When a lambda has parameters, they go first, followed by '->'
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // The last expression in a lambda is considered the return value:
        result
    })
    
    // Parameter types in a lambda are optional if they can be inferred:
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })
    
    // Function references can also be used for higher-order function calls:
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
```
{kotlin-runnable="true"}

## 함수 타입

Kotlin은 함수를 다루는 선언에 `(Int) -> String`과 같은 함수 타입을 사용합니다: `val onClick: () -> Unit = ...`.

이러한 타입은 함수의 시그니처, 즉 파라미터와 반환 값에 해당하는 특별한 표기법을 가집니다:

*   모든 함수 타입은 괄호로 묶인 파라미터 타입 목록과 반환 타입을 가집니다: `(A, B) -> C`는 `A` 타입과 `B` 타입의 두 인수를 받고 `C` 타입 값을 반환하는 함수를 나타내는 타입입니다. 파라미터 타입 목록은 `() -> A`와 같이 비어 있을 수 있습니다. [`Unit` 반환 타입](functions.md#unit-returning-functions)은 생략될 수 없습니다.

*   함수 타입은 선택적으로 추가적인 *리시버(receiver)* 타입을 가질 수 있으며, 이는 표기법에서 점 앞에 지정됩니다. `A.(B) -> C` 타입은 리시버 객체 `A`에 파라미터 `B`와 함께 호출될 수 있고 `C` 값을 반환하는 함수를 나타냅니다. [리시버를 가진 함수 리터럴](#function-literals-with-receiver)은 이러한 타입과 함께 자주 사용됩니다.

*   [정지 함수](coroutines-basics.md#extract-function-refactoring)는 `suspend () -> Unit` 또는 `suspend A.(B) -> C`와 같이 표기법에 *suspend* 한정자(modifier)를 가지는 특별한 종류의 함수 타입에 속합니다.

함수 타입 표기법은 함수 파라미터에 대한 이름을 선택적으로 포함할 수 있습니다: `(x: Int, y: Int) -> Point`. 이 이름들은 파라미터의 의미를 문서화하는 데 사용될 수 있습니다.

함수 타입이 [널 허용(nullable)](null-safety.md#nullable-types-and-non-nullable-types)임을 지정하려면 다음과 같이 괄호를 사용합니다: `((Int, Int) -> Int)?`.

함수 타입은 괄호를 사용하여 결합될 수도 있습니다: `(Int) -> ((Int) -> Unit)`.

> 화살표 표기법은 오른쪽 결합적입니다. `(Int) -> (Int) -> Unit`은 이전 예시와 동일하지만, `((Int) -> (Int)) -> Unit`과는 다릅니다.
>
{style="note"}

[타입 별칭(type alias)](type-aliases.md)을 사용하여 함수 타입에 대체 이름을 부여할 수도 있습니다:

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 함수 타입 인스턴스화

함수 타입의 인스턴스를 얻는 여러 가지 방법이 있습니다:

*   함수 리터럴 내의 코드 블록을 다음 형식 중 하나로 사용합니다:
    *   [람다 표현식](#lambda-expressions-and-anonymous-functions): `{ a, b -> a + b }`,
    *   [익명 함수](#anonymous-functions): `fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [리시버를 가진 함수 리터럴](#function-literals-with-receiver)은 리시버를 가진 함수 타입의 값으로 사용될 수 있습니다.

*   기존 선언에 대한 호출 가능 참조를 사용합니다:
    *   최상위, 지역, 멤버 또는 확장 [함수](reflection.md#function-references): `::isOdd`, `String::toInt`,
    *   최상위, 멤버 또는 확장 [프로퍼티](reflection.md#property-references): `List<Int>::size`,
    *   [생성자](reflection.md#constructor-references): `::Regex`

  여기에는 특정 인스턴스의 멤버를 가리키는 [바인딩된 호출 가능 참조](reflection.md#bound-function-and-property-references)가 포함됩니다: `foo::toString`.

*   인터페이스로 함수 타입을 구현하는 사용자 정의 클래스의 인스턴스를 사용합니다:

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

컴파일러는 충분한 정보가 있다면 변수에 대한 함수 타입을 추론할 수 있습니다:

```kotlin
val a = { i: Int -> i + 1 } // 추론된 타입은 (Int) -> Int 입니다
```

리시버를 가진 함수 타입과 리시버를 가지지 않은 함수 타입의 *비-리터럴* 값은 서로 교환 가능합니다. 따라서 리시버가 첫 번째 파라미터를 대신할 수 있으며, 그 반대도 마찬가지입니다. 예를 들어, `A.(B) -> C` 타입의 값이 예상되는 곳에 `(A, B) -> C` 타입의 값을 전달하거나 할당할 수 있으며, 그 반대도 가능합니다:

```kotlin
fun main() {
    //sampleStart
    val repeatFun: String.(Int) -> String = { times -> this.repeat(times) }
    val twoParameters: (String, Int) -> String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) -> String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK
    //sampleEnd
    println("result = $result")
}
```
{kotlin-runnable="true"}

> 기본적으로 리시버가 없는 함수 타입이 추론됩니다. 변수가 확장 함수에 대한 참조로 초기화된 경우에도 마찬가지입니다.
> 이를 변경하려면 변수 타입을 명시적으로 지정하십시오.
>
{style="note"}

### 함수 타입 인스턴스 호출하기

함수 타입의 값은 [`invoke(...)` 연산자](operator-overloading.md#invoke-operator)를 사용하여 호출될 수 있습니다: `f.invoke(x)` 또는 단순히 `f(x)`.

값이 리시버 타입을 가질 경우, 리시버 객체를 첫 번째 인수로 전달해야 합니다. 리시버를 가진 함수 타입의 값을 호출하는 또 다른 방법은 마치 그 값이 [확장 함수](extensions.md)인 것처럼 리시버 객체를 앞에 붙이는 것입니다: `1.foo(2)`.

예시:

```kotlin
fun main() {
    //sampleStart
    val stringPlus: (String, String) -> String = String::plus
    val intPlus: Int.(Int) -> Int = Int::plus
    
    println(stringPlus.invoke("<-", "->"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // extension-like call
    //sampleEnd
}
```
{kotlin-runnable="true"}

### 인라인 함수

때때로 고차 함수를 위해 유연한 제어 흐름을 제공하는 [인라인 함수](inline-functions.md)를 사용하는 것이 유리할 수 있습니다.

## 람다 표현식과 익명 함수

람다 표현식과 익명 함수는 *함수 리터럴*입니다. 함수 리터럴은 선언되지 않고 표현식으로 즉시 전달되는 함수입니다. 다음 예시를 고려해 보세요:

```kotlin
max(strings, { a, b -> a.length < b.length })
```

`max` 함수는 두 번째 인수로 함수 값을 받기 때문에 고차 함수입니다. 이 두 번째 인수는 그 자체가 함수이며 함수 리터럴이라고 불리는 표현식으로, 다음 이름 있는 함수와 동일합니다:

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### 람다 표현식 문법

람다 표현식의 전체 문법 형식은 다음과 같습니다:

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

*   람다 표현식은 항상 중괄호로 둘러싸여 있습니다.
*   전체 문법 형식에서 파라미터 선언은 중괄호 안에 위치하며 선택적 타입 주석을 가집니다.
*   본문은 `->` 뒤에 위치합니다.
*   람다의 추론된 반환 타입이 `Unit`이 아닌 경우, 람다 본문 내의 마지막 (또는 유일한) 표현식이 반환 값으로 처리됩니다.

모든 선택적 주석을 생략하면 남은 것은 다음과 같습니다:

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 후행 람다 전달하기

Kotlin 관례에 따라, 함수의 마지막 파라미터가 함수인 경우 해당 인수로 전달되는 람다 표현식은 괄호 밖에 위치할 수 있습니다:

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

이러한 문법은 *후행 람다*라고도 알려져 있습니다.

람다가 해당 호출에서 유일한 인수인 경우, 괄호는 완전히 생략될 수 있습니다:

```kotlin
run { println("...") }
```

### it: 단일 파라미터의 암시적 이름

람다 표현식이 하나의 파라미터만 가지는 것이 매우 흔합니다.

컴파일러가 파라미터 없이 시그니처를 파싱할 수 있다면, 파라미터를 선언할 필요가 없으며 `->`는 생략될 수 있습니다. 파라미터는 `it`이라는 이름으로 암시적으로 선언됩니다:

```kotlin
ints.filter { it > 0 } // 이 리터럴의 타입은 '(it: Int) -> Boolean' 입니다
```

### 람다 표현식에서 값 반환하기

[한정된 반환(qualified return)](returns.md#return-to-labels) 문법을 사용하여 람다에서 명시적으로 값을 반환할 수 있습니다. 그렇지 않으면 마지막 표현식의 값이 암시적으로 반환됩니다.

따라서 다음 두 코드 조각은 동일합니다:

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

이 관례는 [괄호 밖에 람다 표현식 전달하기](#passing-trailing-lambdas)와 함께 [LINQ 스타일](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/) 코드를 가능하게 합니다:

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 사용되지 않는 변수에 밑줄 사용하기

람다 파라미터가 사용되지 않는 경우, 이름 대신 밑줄을 넣을 수 있습니다:

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### 람다에서 구조 분해하기

람다에서 구조 분해는 [구조 분해 선언](destructuring-declarations.md#destructuring-in-lambdas)의 일부로 설명됩니다.

### 익명 함수

위 람다 표현식 문법에는 한 가지 빠진 점이 있습니다. 바로 함수의 반환 타입을 지정하는 기능입니다. 대부분의 경우 반환 타입이 자동으로 추론될 수 있으므로 이는 불필요합니다. 하지만 명시적으로 지정해야 하는 경우 대체 문법인 *익명 함수*를 사용할 수 있습니다.

```kotlin
fun(x: Int, y: Int): Int = x + y
```

익명 함수는 이름이 생략된다는 점만 제외하면 일반 함수 선언과 매우 비슷하게 생겼습니다. 본문은 (위에서 보듯이) 표현식이거나 블록일 수 있습니다:

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

파라미터와 반환 타입은 일반 함수와 동일하게 지정되지만, 컨텍스트에서 추론될 수 있다면 파라미터 타입은 생략될 수 있습니다:

```kotlin
ints.filter(fun(item) = item > 0)
```

익명 함수의 반환 타입 추론은 일반 함수와 동일하게 작동합니다. 표현식 본문을 가진 익명 함수는 반환 타입이 자동으로 추론되지만, 블록 본문을 가진 익명 함수는 명시적으로 지정되어야 합니다 (또는 `Unit`으로 가정됩니다).

> 익명 함수를 파라미터로 전달할 때, 괄호 안에 넣으십시오. 함수를 괄호 밖에 둘 수 있는 약식 문법은 람다 표현식에만 적용됩니다.
>
{style="note"}

람다 표현식과 익명 함수의 또 다른 차이점은 [비지역 반환(non-local returns)](inline-functions.md#returns)의 동작입니다. 레이블 없는 `return` 문은 항상 `fun` 키워드로 선언된 함수에서 반환합니다. 이는 람다 표현식 내부의 `return`이 감싸는 함수에서 반환한다는 것을 의미하며, 반면 익명 함수 내부의 `return`은 익명 함수 자체에서 반환합니다.

### 클로저

람다 표현식이나 익명 함수([지역 함수](functions.md#local-functions) 및 [객체 표현식](object-declarations.md#object-expressions)도 마찬가지)는 외부 스코프에서 선언된 변수를 포함하는 *클로저(closure)*에 접근할 수 있습니다. 클로저에 캡처된 변수는 람다에서 수정될 수 있습니다:

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 리시버를 가진 함수 리터럴

`A.(B) -> C`와 같은 리시버를 가진 [함수 타입](#function-types)은 특별한 형태의 함수 리터럴, 즉 리시버를 가진 함수 리터럴로 인스턴스화될 수 있습니다.

위에서 언급했듯이, Kotlin은 *리시버 객체*를 제공하면서 리시버를 가진 함수 타입의 [인스턴스를 호출](#invoking-a-function-type-instance)하는 기능을 제공합니다.

함수 리터럴 본문 안에서 호출에 전달된 리시버 객체는 *암시적인* `this`가 됩니다. 따라서 추가적인 한정자(qualifier) 없이 해당 리시버 객체의 멤버에 접근할 수 있으며, [`this` 표현식](this-expressions.md)을 사용하여 리시버 객체에 접근할 수도 있습니다.

이 동작은 함수 본문 내에서 리시버 객체의 멤버에 접근할 수 있도록 하는 [확장 함수](extensions.md)의 동작과 유사합니다.

다음은 `plus`가 리시버 객체에서 호출되는, 리시버를 가진 함수 리터럴과 해당 타입의 예시입니다:

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

익명 함수 문법을 사용하면 함수 리터럴의 리시버 타입을 직접 지정할 수 있습니다. 이는 리시버를 가진 함수 타입의 변수를 선언한 다음 나중에 사용해야 할 경우 유용할 수 있습니다.

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

람다 표현식은 리시버 타입이 컨텍스트에서 추론될 수 있을 때 리시버를 가진 함수 리터럴로 사용될 수 있습니다. 이들의 사용의 가장 중요한 예시 중 하나는 [타입 안전 빌더(type-safe builders)](type-safe-builders.md)입니다:

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // create the receiver object
    html.init()        // pass the receiver object to the lambda
    return html
}

html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```