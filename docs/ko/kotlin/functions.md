[//]: # (title: 함수)

코틀린에서 함수를 선언하려면:
* `fun` 키워드를 사용합니다.
* 괄호 `()` 안에 매개변수를 지정합니다.
* 필요한 경우 [반환 타입](#return-types)을 포함합니다.

예시:

```kotlin
//sampleStart
// 'double'은 함수의 이름입니다.
// 'x'는 Int 타입의 매개변수입니다.
// 예상되는 반환 값 또한 Int 타입입니다.
fun double(x: Int): Int {
return 2 * x
}
//sampleEnd

fun main() {
    println(double(5))
    // 10
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="kotlin-function-double"}

## 함수 사용법

함수는 표준 방식을 사용하여 호출됩니다:

```kotlin
val result = double(2)
```

[멤버](classes.md) 또는 [확장 함수](extensions.md#extension-functions)를 호출하려면 점 `.`을 사용합니다:

```kotlin
// Stream 클래스의 인스턴스를 생성하고 read()를 호출합니다.
Stream().read()
```

### 매개변수

함수 매개변수는 파스칼 표기법(Pascal notation): `name: Type`을 사용하여 선언합니다.
매개변수는 쉼표로 구분해야 하며 각 매개변수에 타입을 명시적으로 지정해야 합니다:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

함수 본문 내부에서, 받은 인자들은 읽기 전용입니다 (묵시적으로 `val`로 선언됨):

```kotlin
fun powerOf (number: Int, exponent: Int): Int {
    number = 2 // 오류: 'val'은 재할당될 수 없습니다.
}
```

함수 매개변수를 선언할 때 [후행 쉼표](coding-conventions.md#trailing-commas)를 사용할 수 있습니다:

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 후행 쉼표
) { /*...*/ }
```

후행 쉼표는 리팩토링 및 코드 유지보수에 도움이 됩니다: 선언 내에서 매개변수를 이동시킬 때 어떤 매개변수가 마지막이 될지에 대해 걱정할 필요가 없습니다.

> 코틀린 함수는 다른 함수를 매개변수로 받을 수 있으며 — 인자로 전달될 수도 있습니다. 더 자세한 내용은 [](lambdas.md)를 참조하십시오.
> 
{style="note"}

### 기본값을 가진 매개변수 {id="parameters-with-default-values"}

함수 매개변수에 기본값을 지정하여 선택 사항으로 만들 수 있습니다.
코틀린은 해당 매개변수에 해당하는 인자를 제공하지 않고 함수를 호출할 때 기본값을 사용합니다.
기본값을 가진 매개변수들은 _선택적 매개변수(optional parameters)_라고도 알려져 있습니다.

선택적 매개변수는 합리적인 기본값으로 매개변수를 생략할 수 있도록 하기 위해 여러 버전의 함수를 선언할 필요가 없으므로, 오버로드(overloads)의 필요성을 줄여줍니다.

매개변수 선언에 `=`를 추가하여 기본값을 설정합니다:

```kotlin
fun read(
    b: ByteArray,
    // 'off'의 기본값은 0입니다.
    off: Int = 0,
    // 'len'의 기본값은 'b' 배열의 크기로서 계산됩니다.
    len: Int = b.size,
) { /*...*/ }
```

기본값을 **가진** 매개변수를 기본값이 **없는** 매개변수보다 먼저 선언하는 경우, [이름 붙은 인자](#named-arguments)를 통해서만 기본값을 사용할 수 있습니다:

```kotlin
fun greeting(
    userId: Int = 0,
    message: String,
) { /*...*/ }

fun main () {
    // 'userId'의 기본값으로 0을 사용합니다.
    greeting(message = "Hello!")
    
    // 오류: 매개변수 'userId'에 값이 전달되지 않았습니다.
    // greeting("Hello!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="default-before-ordinary"}

[후행 람다(Trailing lambdas)](lambdas.md#passing-trailing-lambdas)는 이 규칙의 예외입니다. 마지막 매개변수가 전달된 함수에 해당해야 하기 때문입니다:

```kotlin
fun main () {
//sampleStart    
fun greeting(
    userId: Int = 0,
    message: () -> Unit,
)
{ println(userId)
  message() }
    
// 'userId'의 기본값을 사용합니다.
greeting() { println ("Hello!") }
// 0
// Hello!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="default-before-trailing-lambda"}

[메서드를 오버라이드할 때](inheritance.md#overriding-methods)는 항상 기본 메서드의 기본 매개변수 값을 사용합니다.
기본 매개변수 값을 가진 메서드를 오버라이드할 때는 시그니처에서 기본 매개변수 값을 생략해야 합니다:

```kotlin
open class Shape {
    open fun draw(width: Int = 10, height: Int = 5) { /*...*/ }
}

class Rectangle : Shape() {
    // 여기에서 기본값을 지정하는 것은 허용되지 않지만
    // 이 함수도 기본적으로 'width'에 10, 'height'에 5를 사용합니다.
    override fun draw(width: Int, height: Int) { /*...*/ }
}
```

#### 상수가 아닌 표현식을 기본값으로 사용하기

매개변수에 상수가 아닌 기본값을 할당할 수 있습니다.
예를 들어, 기본값은 함수 호출의 결과이거나, 이 예시의 `len` 매개변수처럼 다른 인자들의 값을 사용하는 계산 결과일 수 있습니다:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

다른 매개변수의 값을 참조하는 매개변수는 순서상 나중에 선언되어야 합니다.
이 예시에서 `len`은 `b` 다음에 선언되어야 합니다.

일반적으로, 어떤 표현식이든 매개변수의 기본값으로 할당할 수 있습니다.
하지만, 기본값은 해당 매개변수 **없이** 함수가 호출되고 기본값이 할당되어야 할 때만 평가됩니다.
예를 들어, 이 함수는 `print` 매개변수 없이 호출될 때만 한 줄을 출력합니다:

```kotlin
fun main() {
//sampleStart
fun read(
    b: Int,
    print: Unit? = println("No argument passed for 'print'")
) { println(b) }

// "No argument passed for 'print'"를 출력한 다음 "1"을 출력합니다.
read (1)
// "1"만 출력합니다.
read (1, null)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="non-constant-default"}

함수 선언의 마지막 매개변수가 함수형 타입인 경우, 해당 [람다](lambdas.md#lambda-expression-syntax) 인자를 이름 붙은 인자(named argument)로 전달하거나 [괄호 바깥(outside the parentheses)](lambdas.md#passing-trailing-lambdas)으로 전달할 수 있습니다:

```kotlin
fun main() {
//sampleStart
fun log(
    level: Int = 0,
    code:  Int = 1,
    action: () -> Unit,
) { println (level)
    println (code)
    action() }

// 'level'에 1을 전달하고 'code'에 기본값 1을 사용합니다.
log(1) { println("Connection established") }

// 'level'에 0, 'code'에 1, 두 기본값을 모두 사용합니다.
log(action = { println("Connection established") })

// 이전 호출과 동일하며, 두 기본값을 모두 사용합니다.
log { println("Connection established") }
//sampleEnd   
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="lambda-outside-parentheses"}

### 이름 붙은 인자

함수를 호출할 때 하나 이상의 인자에 이름을 붙일 수 있습니다.
이는 함수 호출에 많은 인자가 있을 때 유용할 수 있습니다.
이러한 경우, 값과 인자를 연결하기 어려우며, 특히 값이 `null`이거나 불리언(boolean) 값인 경우 더욱 그렇습니다.

함수 호출에서 이름 붙은 인자를 사용할 때, 순서를 자유롭게 변경할 수 있습니다.

기본값을 가진 4개의 인자를 가진 `reformat()` 함수를 고려해 봅시다:

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

이 함수를 호출할 때, 일부 인자의 이름을 지정할 수 있습니다:

```kotlin
reformat(
    "String!",
    normalizeCase = false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

기본값을 가진 모든 인자를 생략할 수 있습니다:

```kotlin
reformat("This is a long String!")
```

모든 인자를 생략하는 대신 기본값을 가진 _일부_ 인자만 생략할 수도 있습니다.
하지만 첫 번째 생략된 인자 이후에는 모든 후속 인자에 이름을 붙여야 합니다:

```kotlin
reformat(
    "This is a short String!",
    upperCaseFirstLetter = false,
    wordSeparator = '_'
)
```

해당 인자에 이름을 붙여 [가변 인자](#variable-number-of-arguments-varargs) (`vararg`)를 전달할 수 있습니다.
이 예시에서는 배열입니다:

```kotlin
fun mergeStrings(vararg strings: String) { /*...*/ }

mergeStrings(strings = arrayOf("a", "b", "c"))
```

<!-- Rationale for named arguments interaction with varargs is here https://youtrack.jetbrains.com/issue/KT-52505#focus=Comments-27-6147916.0-0 -->

> JVM에서 자바 함수를 호출할 때는 자바 바이트코드가 함수 매개변수의 이름을 항상 보존하지 않기 때문에 이름 붙은 인자 문법을 사용할 수 없습니다.
> 
{style="note"}

### 반환 타입

블록 본문(중괄호 `{}` 안에 명령을 넣는 방식)으로 함수를 선언할 때는 항상 반환 타입을 명시적으로 지정해야 합니다.
유일한 예외는 `Unit`을 반환하는 경우이며, [이 경우에는 반환 타입 지정이 선택 사항입니다](#unit-returning-functions).

코틀린은 블록 본문을 가진 함수의 반환 타입을 추론하지 않습니다.
이러한 함수의 제어 흐름은 복잡할 수 있어 독자(때로는 컴파일러에게도)에게 반환 타입이 명확하지 않을 수 있습니다.
하지만 코틀린은 [단일 표현식 함수](#single-expression-functions)의 경우 반환 타입을 지정하지 않아도 추론할 수 있습니다.

### 단일 표현식 함수

함수 본문이 단일 표현식으로 구성된 경우, 중괄호는 생략할 수 있으며 본문은 `=` 기호 뒤에 지정됩니다:

```kotlin
fun double(x: Int): Int = x * 2
```

대부분의 경우 [반환 타입](#return-types)을 명시적으로 선언할 필요는 없습니다:

```kotlin
// 컴파일러는 이 함수가 Int를 반환한다고 추론합니다.
fun double(x: Int) = x * 2
```

컴파일러는 단일 표현식에서 반환 타입을 추론할 때 때때로 문제에 직면할 수 있습니다.
이러한 경우, 반환 타입을 명시적으로 추가해야 합니다.
예를 들어, 재귀 함수(recursive functions) 또는 상호 재귀 함수(mutually recursive functions)(서로 호출하는)와 `fun empty() = null`과 같은 타입 없는 표현식을 가진 함수는 항상 반환 타입을 요구합니다.

추론된 반환 타입을 사용하는 경우, 컴파일러가 사용자에게 덜 유용한 타입을 추론할 수 있으므로 실제 결과를 확인해야 합니다.
위 예시에서 `double()` 함수가 `Int` 대신 `Number`를 반환하도록 하려면, 이를 명시적으로 선언해야 합니다.

### Unit을 반환하는 함수

함수가 블록 본문(중괄호 `{}` 내의 명령)을 가지고 있고 유용한 값을 반환하지 않는 경우, 컴파일러는 해당 반환 타입을 `Unit`으로 가정합니다.
`Unit`은 오직 하나의 값(`Unit`)만을 가진 타입입니다.

함수형 타입 매개변수를 제외하고는 `Unit`을 반환 타입으로 지정할 필요가 없습니다.
`Unit`을 명시적으로 반환할 필요는 없습니다.

예를 들어, `Unit`을 반환하지 않는 `printHello()` 함수를 선언할 수 있습니다:

```kotlin
// 함수형 타입 매개변수('action')의 선언은 여전히
// 명시적 반환 타입이 필요합니다.
fun printHello(name: String?, action: () -> Unit) {
  if (name != null)
    println("Hello $name")
  else
    println("Hi there!")

  action()
}

fun main() {
  printHello("Kodee") {
    println("This runs after the greeting.")
  }
  // Hello Kodee
  // This runs after the greeting.

  printHello(null) {
    println("No name provided, but action still runs.")
  }
  // Hi there!
  // No name provided, but action still runs.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-implicit"}

이는 다음의 장황한 선언과 동일합니다:

```kotlin
//sample Start
fun printHello(name: String?, action: () -> Unit): Unit {
  if (name != null)
    println("Hello $name")
  else
    println("Hi there!")

  action()
  return Unit
}
// sampleEnd
fun main() {
  printHello("Kodee") {
    println("This runs after the greeting.")
  }
  // Hello Kodee
  // This runs after the greeting.

  printHello(null) {
    println("No name provided, but action still runs.")
  }
  // Hi there!
  // No name provided, but action still runs.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-explicit"}

### 가변 인자 (varargs)

함수에 가변 개수의 인자를 전달하려면, 매개변수 중 하나(일반적으로 마지막 매개변수)를 `vararg` 한정자로 표시할 수 있습니다.
함수 내부에서 `T` 타입의 `vararg` 매개변수를 `T` 배열로 사용할 수 있습니다:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts는 Array입니다.
        result.add(t)
    return result
}
```

그러면 함수에 가변 개수의 인자를 전달할 수 있습니다:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts는 Array입니다.
    result.add(t)
  return result
}

fun main() {
  //sampleStart
  val list = asList(1, 2, 3)
  println(list)
  // [1, 2, 3]
  //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist"}

하나의 매개변수만 `vararg`로 표시될 수 있습니다.
`vararg` 매개변수를 매개변수 목록의 마지막이 아닌 다른 위치에 선언하는 경우, 후속 매개변수의 값은 이름 붙은 인자(named arguments)를 사용하여 전달해야 합니다.
매개변수가 함수 타입인 경우, 람다를 괄호 바깥에 배치하여 해당 값을 전달할 수도 있습니다.

`vararg` 함수를 호출할 때, `asList(1, 2, 3)`의 예시처럼 인자를 개별적으로 전달할 수 있습니다.
이미 배열이 있고 그 내용을 함수에 `vararg` 매개변수나 그 일부로 전달하고 싶다면, 배열 이름 앞에 `*`를 붙여 [스프레드 연산자](arrays.md#pass-variable-number-of-arguments-to-a-function)를 사용하세요:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts)
    result.add(t)
  return result
}

fun main() {
  //sampleStart
  val a = arrayOf(1, 2, 3)

  // 함수는 배열 [-1, 0, 1, 2, 3, 4]를 받습니다.
  val list = asList(-1, 0, *a, 4)

  println(list)
  // [-1, 0, 1, 2, 3, 4]

  //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist-with-array"}

[원시 타입 배열](arrays.md#primitive-type-arrays)을 `vararg`로 전달하려면, [`.toTypedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-typed-array.html) 함수를 사용하여 일반 (타입이 지정된) 배열로 변환해야 합니다:

```kotlin
// 'a'는 IntArray이며, 이는 원시 타입 배열입니다.
val a = intArrayOf(1, 2, 3)
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 중위 표기법

`infix` 키워드를 사용하여 괄호나 점 없이 호출할 수 있는 함수를 선언할 수 있습니다.
이는 코드에서 간단한 함수 호출을 더 읽기 쉽게 만드는 데 도움이 될 수 있습니다.

```kotlin
infix fun Int.shl(x: Int): Int { /*...*/ }

// 일반 표기법을 사용하여 함수를 호출합니다. 
1.shl(2)

// 중위 표기법을 사용하여 함수를 호출합니다.
1 shl 2
```

중위 함수는 다음 요구 사항을 충족해야 합니다:

*   클래스의 멤버 함수이거나 [확장 함수](extensions.md)여야 합니다.
*   단일 매개변수를 가져야 합니다.
*   매개변수는 [가변 인자](#variable-number-of-arguments-varargs) (`vararg`)를 허용하지 않아야 하며 [기본값](#parameters-with-default-values)을 가져서는 안 됩니다.

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

중위 함수는 항상 수신자(receiver)와 매개변수(parameter) 모두가 명시되어야 합니다.
현재 수신자에서 중위 표기법을 사용하여 메서드를 호출할 때는 `this`를 명시적으로 사용하십시오.
이는 모호하지 않은 파싱을 보장하기 위함입니다.

```kotlin
class MyStringCollection {
  val items = mutableListOf<String>()

  infix fun add(s: String) {
    println("Adding: $s")
    items += s
  }

  fun build() {
      add("first")       // 올바름: 일반 함수 호출
      this add "second"  // 올바름: 명시적 수신자를 사용한 중위 호출
      // add "third"     // 컴파일러 오류: 명시적 수신자가 필요합니다.
  }

  fun printAll() = println("Items = $items")
}

fun main() {
  val myStrings = MyStringCollection()
  // "first"와 "second"를 목록에 추가합니다.
  myStrings.build()
  
  myStrings.printAll()
  // Adding: first
  // Adding: second
  // Items = [first, second]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="infix-notation-example"}

## 함수 스코프

코틀린 함수는 파일의 최상위(top level)에 선언될 수 있습니다. 이는 함수를 담을 클래스를 생성할 필요가 없음을 의미합니다.
함수는 또한 _멤버 함수_ 또는 _확장 함수_로 로컬하게 선언될 수 있습니다.

### 지역 함수

코틀린은 다른 함수 내부에 선언되는 함수인 지역 함수(local functions)를 지원합니다.
예를 들어, 다음 코드는 주어진 그래프에 대한 깊이 우선 탐색(Depth-first search) 알고리즘을 구현합니다.
외부 `dfs()` 함수 내의 지역 `dfs()` 함수는 구현을 숨기고 재귀 호출을 처리합니다:

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    fun dfs(current: Person, visited: MutableSet<Person>) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend, visited)
    }
    dfs(graph.people[0], HashSet())
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs"}

지역 함수는 외부 함수의 지역 변수(클로저(closure))에 접근할 수 있습니다.
위 경우에서, `visited` 함수 매개변수는 지역 변수일 수 있습니다:

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    val visited = HashSet<Person>()
    fun dfs(current: Person) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend)
    }
    dfs(graph.people[0])
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs-with-local-variable"}

### 멤버 함수

멤버 함수는 클래스 또는 객체 내부에 정의된 함수입니다:

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

멤버 함수를 호출하려면 인스턴스 또는 객체 이름을 작성한 다음 `.`을 추가하고 함수 이름을 작성합니다:

```kotlin
// Stream 클래스의 인스턴스를 생성하고 read()를 호출합니다.
Stream().read()
```

클래스 및 멤버 오버라이드에 대한 자세한 내용은 [클래스(Classes)](classes.md) 및 [상속(Inheritance)](classes.md#inheritance)을 참조하십시오.

## 제네릭 함수

함수 이름 앞에 꺾쇠괄호(angle brackets) `<>`를 사용하여 함수의 제네릭 매개변수를 지정할 수 있습니다:

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

제네릭 함수에 대한 자세한 내용은 [제네릭(Generics)](generics.md)을 참조하십시오.

## 꼬리 재귀 함수

코틀린은 [꼬리 재귀(tail recursion)](https://en.wikipedia.org/wiki/Tail_call)라고 알려진 함수형 프로그래밍 스타일을 지원합니다.
일반적으로 루프를 사용하는 일부 알고리즘의 경우, 스택 오버플로우 위험 없이 대신 재귀 함수를 사용할 수 있습니다.
함수가 `tailrec` 한정자로 표시되고 필요한 형식 조건을 충족하면, 컴파일러는 재귀를 최적화하여 제거하고, 대신 빠르고 효율적인 루프 기반 버전으로 대체합니다:

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 임의의 "충분히 좋은" 정밀도
val eps = 1E-10

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (abs(x - cos(x)) < eps) x else findFixPoint(cos(x))
```

이 코드는 코사인 함수의 고정점(fixpoint)(수학 상수)을 계산합니다.
이 함수는 `1.0`부터 시작하여 결과가 더 이상 변하지 않을 때까지 `cos()`를 반복적으로 호출하여, 지정된 `eps` 정밀도에 대해 `0.7390851332151611`의 결과를 산출합니다.
이 코드는 다음의 더 전통적인 스타일과 동일합니다:

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 임의의 "충분히 좋은" 정밀도
val eps = 1E-10

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = cos(x)
        if (abs(x - y) < eps) return x
        x = cos(x)
    }
}
```

함수가 마지막 연산으로 자기 자신을 호출할 때만 `tailrec` 한정자를 적용할 수 있습니다.
재귀 호출 뒤에 더 많은 코드가 있거나, [`try`/`catch`/`finally` 블록](exceptions.md#handle-exceptions-using-try-catch-blocks) 내부에 있거나, 함수가 [열려(open)](inheritance.md) 있을 때는 꼬리 재귀를 사용할 수 없습니다.

**같이 보기**:
*   [인라인 함수(Inline functions)](inline-functions.md)
*   [확장 함수(Extension functions)](extensions.md)
*   [고차 함수 및 람다(Higher-order functions and lambdas)](lambdas.md)