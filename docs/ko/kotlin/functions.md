---
title: 함수
---
Kotlin 함수는 `fun` 키워드를 사용하여 선언합니다:

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 함수 사용법

함수는 표준적인 방법으로 호출됩니다:

```kotlin
val result = double(2)
```

멤버 함수를 호출할 때는 점 표기법을 사용합니다:

```kotlin
Stream().read() // Stream 클래스의 인스턴스를 생성하고 read()를 호출합니다
```

### 파라미터

함수 파라미터는 Pascal 표기법인 *name*: *type*을 사용하여 정의합니다. 파라미터는 쉼표로 구분하며, 각
파라미터는 명시적으로 타입을 지정해야 합니다:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

함수 파라미터를 선언할 때 [후행 쉼표](coding-conventions#trailing-commas)를 사용할 수 있습니다:

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 후행 쉼표
) { /*...*/ }
```

### 기본 인자

함수 파라미터는 기본값을 가질 수 있으며, 이는 해당 인자를 생략할 때 사용됩니다. 이를 통해 오버로드 수를 줄일 수
있습니다:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

기본값은 타입에 `=`를 추가하여 설정합니다.

메서드를 오버라이드할 때는 항상 기본 메서드의 기본 파라미터 값을 사용합니다.
기본 파라미터 값을 갖는 메서드를 오버라이드할 때는 시그니처에서 기본 파라미터 값을 생략해야 합니다:

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // 기본값은 허용되지 않습니다.
}
```

기본 파라미터가 기본값이 없는 파라미터 앞에 오는 경우, [이름 지정된 인자](#named-arguments)를 사용하여 함수를 호출해야만
기본값을 사용할 수 있습니다:

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // 기본값 bar = 0이 사용됩니다
```

기본 파라미터 뒤에 오는 마지막 인자가 [람다](lambdas#lambda-expression-syntax)인 경우,
이름 지정된 인자 또는 [괄호 밖에서](lambdas#passing-trailing-lambdas) 전달할 수 있습니다:

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () `->` Unit,
) { /*...*/ }

foo(1) { println("hello") }     // 기본값 baz = 1을 사용합니다
foo(qux = { println("hello") }) // 기본값 bar = 0과 baz = 1을 모두 사용합니다
foo { println("hello") }        // 기본값 bar = 0과 baz = 1을 모두 사용합니다
```

### 이름 지정된 인자

함수를 호출할 때 하나 이상의 인자에 이름을 지정할 수 있습니다. 이는 함수에 많은
인자가 있고 값을 인자와 연결하기 어려울 때, 특히 boolean 또는 `null` 값인 경우에 유용할 수 있습니다.

함수 호출에서 이름 지정된 인자를 사용하는 경우, 나열된 순서를 자유롭게 변경할 수 있습니다. 기본값을 사용하려면 이러한 인자를 완전히 생략할 수 있습니다.

기본값을 갖는 4개의 인자를 가진 `reformat()` 함수를 생각해 봅시다.

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

이 함수를 호출할 때 모든 인자에 이름을 지정할 필요는 없습니다:

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

기본값이 있는 모든 인자를 생략할 수 있습니다:

```kotlin
reformat("This is a long String!")
```

또한 모든 인자를 생략하는 대신 기본값이 있는 특정 인자를 생략할 수도 있습니다. 그러나 첫 번째
생략된 인자 이후에는 모든 후속 인자에 이름을 지정해야 합니다:

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

`spread` 연산자를 사용하여 이름을 가진 [가변 길이 인자(`vararg`)](#variable-number-of-arguments-varargs)를 전달할 수
있습니다:

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

:::note
JVM에서 Java 함수를 호출할 때 이름 지정된 인자 구문을 사용할 수 없습니다. Java 바이트 코드는
함수 파라미터의 이름을 항상 보존하지 않기 때문입니다.

:::

### Unit 반환 함수

함수가 유용한 값을 반환하지 않으면 반환 타입은 `Unit`입니다. `Unit`은 단 하나의 값인 `Unit`을 갖는 타입입니다.
이 값은 명시적으로 반환할 필요가 없습니다:

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` 또는 `return`은 선택 사항입니다
}
```

`Unit` 반환 타입 선언은 선택 사항입니다. 위의 코드는 다음과 같습니다:

```kotlin
fun printHello(name: String?) { ... }
```

### 단일 표현식 함수

함수 본문이 단일 표현식으로 구성된 경우, 중괄호를 생략하고 `=` 기호 뒤에 본문을 지정할 수 있습니다:

```kotlin
fun double(x: Int): Int = x * 2
```

컴파일러가 이를 추론할 수 있는 경우 반환 타입을 명시적으로 선언하는 것은 [선택 사항](#explicit-return-types)입니다:

```kotlin
fun double(x: Int) = x * 2
```

### 명시적 반환 타입

블록 본문이 있는 함수는 항상 반환 타입을 명시적으로 지정해야 합니다. 단, `Unit`을 반환하도록 의도된 경우에는
[반환 타입 지정이 선택 사항입니다](#unit-returning-functions).

Kotlin은 블록 본문이 있는 함수에 대해 반환 타입을 추론하지 않습니다. 이러한 함수는 본문 내에 복잡한 제어 흐름을 가질 수
있으며, 반환 타입이 읽는 사람에게 (그리고 때로는 컴파일러에게도) 명확하지 않기 때문입니다.

### 가변 길이 인자 (varargs)

함수의 파라미터 (보통 마지막 파라미터)에 `vararg` 수정자를 표시할 수 있습니다:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts는 배열입니다
        result.add(t)
    return result
}
```

이 경우 함수에 가변 길이의 인자를 전달할 수 있습니다:

```kotlin
val list = asList(1, 2, 3)
```

함수 내부에서 타입 `T`의 `vararg`-파라미터는 위의 예에서처럼 `ts`
변수가 타입 `Array<out T>`를 갖는 `T`의 배열로 보입니다.

하나의 파라미터만 `vararg`로 표시할 수 있습니다. `vararg` 파라미터가 목록의 마지막 파라미터가 아닌 경우, 후속
파라미터에 대한 값은 이름 지정된 인자 구문을 사용하여 전달하거나, 파라미터가 함수 타입인 경우 괄호 밖에서
람다를 전달하여 전달할 수 있습니다.

`vararg`-함수를 호출할 때 인자를 개별적으로 전달할 수 있습니다 (예: `asList(1, 2, 3)`). 이미
배열이 있고 그 내용을 함수에 전달하려면 *spread* 연산자를 사용하십시오 (배열 앞에 `*`를 붙입니다):

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

[원시 타입 배열](arrays#primitive-type-arrays)을
`vararg`에 전달하려면 `toTypedArray()` 함수를 사용하여 일반 (타입화된) 배열로 변환해야 합니다:

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray는 원시 타입 배열입니다
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 중위 표기법

`infix` 키워드로 표시된 함수는 중위 표기법을 사용하여 호출할 수도 있습니다 (호출에 대한 점과 괄호 생략). 중위 함수는 다음 요구 사항을 충족해야 합니다:

* 멤버 함수 또는 [확장 함수](extensions)여야 합니다.
* 단일 파라미터를 가져야 합니다.
* 파라미터는 [가변 길이 인자를 허용하지 않아야](#variable-number-of-arguments-varargs) 하며 [기본값이 없어야](#default-arguments) 합니다.

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// 중위 표기법을 사용하여 함수 호출
1 shl 2

// 다음과 같습니다
1.shl(2)
```

:::note
중위 함수 호출은 산술 연산자, 타입 캐스트 및 `rangeTo` 연산자보다 우선 순위가 낮습니다.
다음 표현식은 동일합니다:
* `1 shl 2 + 3`은 `1 shl (2 + 3)`과 같습니다
* `0 until n * 2`는 `0 until (n * 2)`와 같습니다
* `xs union ys as Set<*>`은 `xs union (ys as Set<*>)`과 같습니다

반면에 중위 함수 호출의 우선 순위는 부울 연산자 `&&` 및 `||`, `is`-
및 `in`-체크, 그리고 일부 다른 연산자보다 높습니다. 이러한 표현식도 동일합니다:
* `a && b xor c`는 `a && (b xor c)`와 같습니다
* `a xor b in c`는 `(a xor b) in c`와 같습니다

:::

중위 함수는 항상 수신자와 파라미터를 모두 지정해야 합니다. 중위 표기법을 사용하여 현재 수신자에서 메서드를
호출하는 경우, `this`를 명시적으로 사용하십시오. 이는 명확한 구문 분석을 보장하는 데 필요합니다.

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // 올바름
        add("abc")       // 올바름
        //add "abc"        // 올바르지 않음: 수신자를 지정해야 합니다
    }
}
```

## 함수 스코프

Kotlin 함수는 파일의 최상위 수준에서 선언할 수 있습니다. 즉, Java, C# 및 Scala와 같은 언어에서처럼 함수를 보유하기 위해 클래스를 만들 필요가 없습니다 ([최상위 수준 정의는 Scala 3부터 사용 가능](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)). 최상위 수준 함수 외에도 Kotlin 함수는 멤버 함수 및 확장 함수로 로컬에서 선언할 수도 있습니다.

### 로컬 함수

Kotlin은 다른 함수 내부에 있는 로컬 함수를 지원합니다:

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

로컬 함수는 외부 함수의 로컬 변수 (클로저)에 접근할 수 있습니다. 위의 경우, `visited`는 로컬 변수일 수 있습니다:

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
Sample().foo() // Sample 클래스의 인스턴스를 생성하고 foo를 호출합니다
```

클래스 및 멤버 오버라이드에 대한 자세한 내용은 [클래스](classes) 및 [상속](classes#inheritance)을 참조하십시오.

## 제네릭 함수

함수는 제네릭 파라미터를 가질 수 있으며, 이는 함수 이름 앞에 꺾쇠 괄호를 사용하여 지정합니다:

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

제네릭 함수에 대한 자세한 내용은 [제네릭](generics)을 참조하십시오.

## 꼬리 재귀 함수

Kotlin은 [꼬리 재귀](https://en.wikipedia.org/wiki/Tail_call)로 알려진 함수형 프로그래밍 스타일을 지원합니다.
일반적으로 루프를 사용하는 일부 알고리즘의 경우, 스택 오버플로의 위험 없이 재귀 함수를 대신 사용할 수 있습니다.
함수가 `tailrec` 수정자로 표시되고 필요한 형식 조건을 충족하면 컴파일러는
재귀를 최적화하여 빠르고 효율적인 루프 기반 버전을 대신 남깁니다:

```kotlin
val eps = 1E-10 // "충분히 좋음", 10^-15일 수 있습니다

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

이 코드는 코사인의 `fixpoint`를 계산합니다. 이는 수학 상수입니다. 단순히 결과가 더 이상 변경되지 않을 때까지
`1.0`에서 시작하여 `Math.cos`를 반복적으로 호출하여 지정된
`eps` 정밀도에 대해 `0.7390851332151611`의 결과를 산출합니다. 결과 코드는 이보다 더 전통적인 스타일과 동일합니다:

```kotlin
val eps = 1E-10 // "충분히 좋음", 10^-15일 수 있습니다

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

`tailrec` 수정자를 사용할 수 있으려면 함수가 수행하는 마지막 연산으로 자신을 호출해야 합니다. `try`/`catch`/`finally` 블록 내에서 또는 열린 함수에서
재귀 호출 뒤에 더 많은 코드가 있는 경우에는 꼬리 재귀를 사용할 수 없습니다.
현재 꼬리 재귀는 JVM 및 Kotlin/Native용 Kotlin에서 지원됩니다.

**참고:**
* [인라인 함수](inline-functions)
* [확장 함수](extensions)
* [고차 함수 및 람다](lambdas)