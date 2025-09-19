[//]: # (title: 함수)

코틀린 함수는 `fun` 키워드를 사용하여 선언됩니다:

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 함수 사용법

함수는 표준 방식을 사용하여 호출됩니다:

```kotlin
val result = double(2)
```

멤버 함수를 호출할 때는 점 표기법(dot notation)을 사용합니다:

```kotlin
Stream().read() // Stream 클래스의 인스턴스를 생성하고 read()를 호출합니다.
```

### 매개변수

함수 매개변수는 파스칼 표기법(Pascal notation) - *이름*: *타입* - 을 사용하여 정의됩니다. 매개변수는 쉼표로 구분되며, 각 매개변수는 명시적으로 타입을 지정해야 합니다:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

함수 매개변수를 선언할 때 [후행 쉼표 (trailing comma)](coding-conventions.md#trailing-commas)를 사용할 수 있습니다:

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 후행 쉼표
) { /*...*/ }
```

### 기본값을 가진 매개변수

함수 매개변수는 기본값(default values)을 가질 수 있으며, 이는 해당 인자(argument)를 생략할 때 사용됩니다.
이는 오버로드(overloads)의 수를 줄여줍니다:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

이러한 매개변수들은 *선택적 매개변수(optional parameters)*라고도 불립니다.

기본값은 타입 뒤에 `=`를 붙여 설정합니다.

오버라이드하는 메서드는 항상 기본 메서드의 기본 매개변수 값을 사용합니다.
기본 매개변수 값을 가진 메서드를 오버라이드할 때는 시그니처에서 기본 매개변수 값을 생략해야 합니다:

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // 기본값을 사용할 수 없습니다.
}
```

기본값을 가진 매개변수가 기본값이 없는 매개변수보다 선행하는 경우, 기본값은 [이름 붙은 인자(named arguments)](#named-arguments)로 함수를 호출함으로써만 사용할 수 있습니다:

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // 기본값 bar = 0이 사용됩니다.
```

모든 기본값을 가진 매개변수 뒤의 마지막 매개변수가 함수형 타입인 경우,
해당 [람다(lambda) 인자](lambdas.md#lambda-expression-syntax)를 이름 붙은 인자로 전달하거나 [괄호 바깥(outside the parentheses)](lambdas.md#passing-trailing-lambdas)으로 전달할 수 있습니다:

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // baz = 1 기본값을 사용합니다.
foo(qux = { println("hello") }) // bar = 0과 baz = 1 두 기본값을 모두 사용합니다.
foo { println("hello") }        // bar = 0과 baz = 1 두 기본값을 모두 사용합니다.
```

### 이름 붙은 인자

함수를 호출할 때 하나 이상의 인자에 이름을 붙일 수 있습니다. 이는 함수가 많은 인자를 가지고 있고, 특히 불리언(boolean)이나 `null` 값일 경우 값과 인자를 연관 짓기 어려울 때 유용합니다.

함수 호출에서 이름 붙은 인자를 사용할 때, 나열된 순서를 자유롭게 변경할 수 있습니다. 기본값을 사용하고 싶다면, 해당 인자들을 완전히 생략할 수 있습니다.

기본값을 가진 4개의 인자가 있는 `reformat()` 함수를 고려해 봅시다.

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

이 함수를 호출할 때, 모든 인자에 이름을 붙일 필요는 없습니다:

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

기본값을 가진 모든 인자를 생략할 수 있습니다:

```kotlin
reformat("This is a long String!")
```

또한 모든 인자를 생략하는 대신 특정 인자만 생략할 수도 있습니다. 그러나 첫 번째 생략된 인자 이후에는 모든 후속 인자에 이름을 붙여야 합니다:

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

[가변 인자(`vararg`)](#variable-number-of-arguments-varargs)를 가진 인자를 _스프레드(spread)_ 연산자(배열 앞에 `*`를 붙임)를 사용하여 이름과 함께 전달할 수 있습니다:

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> JVM에서 자바 함수를 호출할 때는 자바 바이트코드가 함수 매개변수의 이름을 항상 보존하지 않기 때문에 이름 붙은 인자 문법을 사용할 수 없습니다.
>
{style="note"}

### Unit을 반환하는 함수

함수가 유용한 값을 반환하지 않는 경우, 반환 타입은 `Unit`입니다. `Unit`은 오직 하나의 값(`Unit`)을 가진 타입입니다.
이 값은 명시적으로 반환할 필요가 없습니다:

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` 또는 `return`은 선택 사항입니다.
}
```

`Unit` 반환 타입 선언 또한 선택 사항입니다. 위 코드는 다음 코드와 동일합니다:

```kotlin
fun printHello(name: String?) { ... }
```

### 단일 표현식 함수

함수 본문이 단일 표현식으로 구성된 경우, 중괄호는 생략할 수 있으며 본문은 `=` 기호 뒤에 지정됩니다:

```kotlin
fun double(x: Int): Int = x * 2
```

컴파일러가 반환 타입을 추론할 수 있는 경우, 반환 타입을 명시적으로 선언하는 것은 [선택 사항](#explicit-return-types)입니다:

```kotlin
fun double(x: Int) = x * 2
```

### 명시적 반환 타입

블록 본문을 가진 함수는 항상 반환 타입을 명시적으로 지정해야 합니다. 단, `Unit`을 반환하려는 의도인 경우를 제외하고는 [이 경우 반환 타입 지정은 선택 사항입니다](#unit-returning-functions).

코틀린은 블록 본문을 가진 함수의 반환 타입을 추론하지 않습니다. 왜냐하면 이러한 함수는 본문에 복잡한 제어 흐름을 가질 수 있으며, 반환 타입이 독자(때로는 컴파일러에게도)에게 명확하지 않을 수 있기 때문입니다.

### 가변 인자 (varargs)

함수의 매개변수(일반적으로 마지막 매개변수)를 `vararg` 한정자로 표시할 수 있습니다:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts는 배열입니다.
        result.add(t)
    return result
}
```

이 경우, 함수에 가변 개수의 인자를 전달할 수 있습니다:

```kotlin
val list = asList(1, 2, 3)
```

함수 내부에서 `T` 타입의 `vararg` 매개변수는 위 예시에서 `ts` 변수가 `Array<out T>` 타입인 것처럼 `T`의 배열로 보입니다.

하나의 매개변수만 `vararg`로 표시될 수 있습니다. `vararg` 매개변수가 목록의 마지막이 아닌 경우, 후속 매개변수의 값은 이름 붙은 인자 구문을 사용하여 전달해야 하거나, 매개변수가 함수 타입인 경우 괄호 바깥에 람다를 전달해야 합니다.

`vararg` 함수를 호출할 때, `asList(1, 2, 3)`처럼 인자를 개별적으로 전달할 수 있습니다. 이미 배열이 있고 그 내용을 함수에 전달하고 싶다면, 스프레드 연산자(배열 앞에 `*`를 붙임)를 사용하세요:

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

[원시 타입 배열(primitive type array)](arrays.md#primitive-type-arrays)을 `vararg`에 전달하려면, `toTypedArray()` 함수를 사용하여 일반 (타입이 지정된) 배열로 변환해야 합니다:

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray는 원시 타입 배열입니다.
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 중위 표기법

`infix` 키워드로 표시된 함수는 중위 표기법(점과 괄호를 생략하여 호출)을 사용해서도 호출할 수 있습니다. 중위 함수는 다음 요구 사항을 충족해야 합니다:

*   멤버 함수이거나 [확장 함수(extension functions)](extensions.md)여야 합니다.
*   단일 매개변수를 가져야 합니다.
*   매개변수는 [가변 인자(variable number of arguments)](#variable-number-of-arguments-varargs)를 허용하지 않아야 하며 [기본값(default value)](#parameters-with-default-values)을 가져서는 안 됩니다.

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// 중위 표기법을 사용하여 함수 호출
1 shl 2

// 다음 코드와 동일합니다.
1.shl(2)
```

> 중위 함수 호출은 산술 연산자, 타입 캐스트, `rangeTo` 연산자보다 낮은 우선순위를 가집니다.
> 다음 표현식들은 동일합니다:
> *   `1 shl 2 + 3`은 `1 shl (2 + 3)`과 동일합니다.
> *   `0 until n * 2`는 `0 until (n * 2)`와 동일합니다.
> *   `xs union ys as Set<*>`는 `xs union (ys as Set<*>)`와 동일합니다.
>
> 반면에, 중위 함수 호출의 우선순위는 불리언 연산자 `&&` 및 `||`, `is`- 및 `in`-검사, 그리고 다른 몇몇 연산자들보다 높습니다. 이 표현식들도 동일합니다:
> *   `a && b xor c`는 `a && (b xor c)`와 동일합니다.
> *   `a xor b in c`는 `(a xor b) in c`와 동일합니다.
>
{style="note"}

중위 함수는 항상 수신자(receiver)와 매개변수 모두가 명시되어야 합니다. 현재 수신자에서 중위 표기법을 사용하여 메서드를 호출할 때는 `this`를 명시적으로 사용하십시오. 이는 모호하지 않은 파싱을 보장하기 위해 필요합니다.

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // 올바름
        add("abc")       // 올바름
        //add "abc"        // 잘못됨: 수신자를 지정해야 합니다.
    }
}
```

## 함수 스코프

코틀린 함수는 파일의 최상위(top level)에 선언될 수 있습니다. 이는 자바, C#, 스칼라와 같은 언어에서 함수를 담을 클래스를 생성해야 하는 것과 달리, 함수를 담을 클래스를 생성할 필요가 없음을 의미합니다([스칼라 3부터 최상위 정의가 지원됩니다](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)). 최상위 함수 외에도 코틀린 함수는 지역 함수(local functions), 멤버 함수(member functions), 확장 함수(extension functions)로도 선언될 수 있습니다.

### 지역 함수

코틀린은 다른 함수 내부에 함수를 정의하는 지역 함수를 지원합니다:

```kotlin
fun dfs(graph: Graph) {
    fun dfs(current: Vertex, visited: MutableSet<Vertex>) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v, visited)
    }

    dfs(graph.vertices[0], HashSet())
}
```

지역 함수는 외부 함수의 지역 변수(클로저(closure))에 접근할 수 있습니다. 위 경우에서, `visited`는 지역 변수일 수 있습니다:

```kotlin
fun dfs(graph: Graph) {
    val visited = HashSet<Vertex>()
    fun dfs(current: Vertex) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v)
    }

    dfs(graph.vertices[0])
}
```

### 멤버 함수

멤버 함수는 클래스 또는 객체 내부에 정의된 함수입니다:

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

멤버 함수는 점 표기법으로 호출됩니다:

```kotlin
Sample().foo() // Sample 클래스의 인스턴스를 생성하고 foo를 호출합니다.
```

클래스 및 멤버 오버라이드에 대한 자세한 내용은 [클래스(Classes)](classes.md) 및 [상속(Inheritance)](classes.md#inheritance)을 참조하십시오.

## 제네릭 함수

함수는 함수 이름 앞에 꺾쇠괄호(angle brackets)를 사용하여 지정하는 제네릭 매개변수를 가질 수 있습니다:

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

제네릭 함수에 대한 자세한 내용은 [제네릭(Generics)](generics.md)을 참조하십시오.

## 꼬리 재귀 함수

코틀린은 [꼬리 재귀(tail recursion)](https://en.wikipedia.org/wiki/Tail_call)라는 함수형 프로그래밍 스타일을 지원합니다.
일반적으로 루프를 사용하는 일부 알고리즘의 경우, 스택 오버플로우 위험 없이 대신 재귀 함수를 사용할 수 있습니다.
함수가 `tailrec` 한정자로 표시되고 필요한 형식 조건을 충족하면, 컴파일러는 재귀를 최적화하여 제거하고, 대신 빠르고 효율적인 루프 기반 버전으로 대체합니다:

```kotlin
val eps = 1E-10 // "충분히 좋다", 10^-15일 수 있습니다.

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

이 코드는 코사인 함수의 고정점(fixpoint)을 계산하는 수학 상수입니다. `1.0`부터 시작하여 결과가 더 이상 변하지 않을 때까지 `Math.cos`를 반복적으로 호출하여 지정된 `eps` 정밀도에 대해 `0.7390851332151611`의 결과를 산출합니다. 결과 코드는 이보다 더 전통적인 스타일과 동일합니다:

```kotlin
val eps = 1E-10 // "충분히 좋다", 10^-15일 수 있습니다.

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

`tailrec` 한정자를 사용하려면 함수가 수행하는 마지막 연산으로 자기 자신을 호출해야 합니다. 재귀 호출 뒤에 더 많은 코드가 있거나, `try`/`catch`/`finally` 블록 내부에 있거나, 열린 함수(open functions)에서는 꼬리 재귀를 사용할 수 없습니다.
현재, 꼬리 재귀는 JVM용 코틀린과 Kotlin/Native에서 지원됩니다.

**같이 보기**:
*   [인라인 함수(Inline functions)](inline-functions.md)
*   [확장 함수(Extension functions)](extensions.md)
*   [고차 함수 및 람다(Higher-order functions and lambdas)](lambdas.md)