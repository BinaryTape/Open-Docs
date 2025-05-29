[//]: # (title: 조건과 루프)

## If 표현식

Kotlin에서 `if`는 표현식(expression)입니다. 즉, 값을 반환합니다.
따라서 일반적인 `if`가 이러한 역할을 잘 수행하므로 삼항 연산자(`condition ? then : else`)는 없습니다.

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // With else
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // As expression
    max = if (a > b) a else b

    // You can also use `else if` in expressions:
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if` 표현식의 분기(branch)는 블록이 될 수 있습니다. 이 경우, 마지막 표현식이 블록의 값이 됩니다.

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

만약 `if`를 표현식으로 사용하여 값을 반환하거나 변수에 할당하는 경우, `else` 분기는 필수입니다.

## When 표현식과 문(statement)

`when`은 여러 가능한 값이나 조건에 따라 코드를 실행하는 조건부 표현식입니다. 이는 Java, C 및 유사 언어의 `switch` 문과 유사합니다. 예를 들어:

```kotlin
fun main() {
    //sampleStart
    val x = 2
    when (x) {
        1 -> print("x == 1")
        2 -> print("x == 2")
        else -> print("x is neither 1 nor 2")
    }
    // x == 2
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when`은 인수를 모든 분기 조건과 순차적으로 일치시켜 일치하는 분기 조건이 만족될 때까지 실행합니다.

`when`은 몇 가지 다른 방식으로 사용할 수 있습니다. 첫째, `when`을 **표현식** 또는 **문(statement)**으로 사용할 수 있습니다. 표현식으로서 `when`은 코드에서 나중에 사용할 값을 반환합니다. 문(statement)으로서 `when`은 더 이상 사용되지 않는 것을 반환하지 않고 작업을 완료합니다.

<table>
   <tr>
       <td>Expression</td>
       <td>Statement</td>
   </tr>
   <tr>
<td>

```kotlin
// Returns a string assigned to the 
// text variable
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// Returns nothing but triggers a 
// print statement
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

둘째, `when`을 주어(subject)와 함께 사용하거나 주어 없이 사용할 수 있습니다. `when`에 주어를 사용하든 사용하지 않든, 표현식이나 문은 동일하게 작동합니다. 가능하면 주어와 함께 `when`을 사용하는 것을 권장합니다. 이렇게 하면 무엇을 확인하는지 명확하게 보여줌으로써 코드를 더 읽기 쉽고 유지보수하기 쉽게 만들 수 있습니다.

<table>
   <tr>
       <td>With subject <code>x</code></td>
       <td>Without subject</td>
   </tr>
   <tr>
<td>

```kotlin
when(x) { ... }
```

</td>
<td>

```kotlin
when { ... }
```

</td>
</tr>
</table>

`when`을 사용하는 방식에 따라 분기에서 가능한 모든 경우를 포함해야 하는지에 대한 요구 사항이 다릅니다.

`when`을 문(statement)으로 사용하는 경우, 가능한 모든 경우를 포함할 필요는 없습니다. 이 예시에서는 일부 경우가 포함되지 않았으므로 아무 일도 일어나지 않습니다. 그러나 오류가 발생하지는 않습니다.

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // Not all cases are covered
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

`when` 문에서는 개별 분기의 값이 무시됩니다. `if`와 마찬가지로 각 분기는 블록이 될 수 있으며, 그 값은 블록의 마지막 표현식의 값입니다.

`when`을 표현식으로 사용하는 경우, 가능한 모든 경우를 포함해야 합니다. 즉, _모든 경우를 망라해야(exhaustive)_ 합니다. 첫 번째로 일치하는 분기의 값이 전체 표현식의 값이 됩니다. 모든 경우를 포함하지 않으면 컴파일러가 오류를 발생시킵니다.

`when` 표현식에 주어가 있다면, 모든 가능한 경우를 포함하도록 `else` 분기를 사용할 수 있지만 필수는 아닙니다. 예를 들어, 주어가 `Boolean`, [`enum` 클래스](enum-classes.md), [`sealed` 클래스](sealed-classes.md) 또는 이들의 널러블(nullable) 대응(counterpart) 중 하나인 경우, `else` 분기 없이 모든 경우를 포함할 수 있습니다.

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // No else branch is needed because all cases are covered
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

`when` 표현식에 주어가 **없다면**, 반드시 `else` 분기가 있어야 합니다. 그렇지 않으면 컴파일러가 오류를 발생시킵니다. `else` 분기는 다른 분기 조건이 충족되지 않을 때 평가됩니다.

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when` 표현식과 문은 코드를 간소화하고, 여러 조건을 처리하며, 타입 검사를 수행하는 다양한 방법을 제공합니다.

쉼표로 조건을 한 줄에 결합하여 여러 경우에 대한 공통 동작을 정의할 수 있습니다.

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

분기 조건으로 (상수뿐만 아니라) 임의의 표현식을 사용할 수 있습니다.

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

또한 `in` 또는 `!in` 키워드를 통해 값이 [범위](ranges.md)나 컬렉션에 포함되어 있는지 또는 포함되어 있지 않은지 확인할 수 있습니다.

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

또한 `is` 또는 `!is` 키워드를 통해 값이 특정 타입인지 또는 아닌지 확인할 수 있습니다. [스마트 캐스트](typecasts.md#smart-casts) 덕분에 추가적인 검사 없이 해당 타입의 멤버 함수와 프로퍼티에 접근할 수 있습니다.

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

`when`을 `if`-`else` `if` 체인을 대체하는 용도로 사용할 수 있습니다. 주어가 없는 경우, 분기 조건은 단순히 불리언 표현식입니다. `true` 조건이 있는 첫 번째 분기가 실행됩니다.

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

다음 구문을 사용하여 주어를 변수로 캡처할 수 있습니다.

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

주어로 도입된 변수의 스코프(scope)는 `when` 표현식 또는 문(statement)의 본문으로 제한됩니다.

### when 표현식의 가드 조건(Guard conditions)

> 가드 조건(Guard conditions)은 언제든지 변경될 수 있는 [실험적인 기능](components-stability.md#stability-levels-explained)입니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback)을 통해 여러분의 피드백을 주시면 감사하겠습니다.
> {style="warning"}

가드 조건(Guard conditions)을 사용하면 `when` 표현식의 분기에 하나 이상의 조건을 포함할 수 있어 복잡한 제어 흐름을 더 명시적이고 간결하게 만들 수 있습니다.
주어가 있는 `when` 표현식이나 문(statement)에서 가드 조건(Guard conditions)을 사용할 수 있습니다.

분기에 가드 조건(Guard condition)을 포함하려면, 기본 조건 뒤에 `if`로 구분하여 배치합니다.

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only primary condition. Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `animal` is `Cat` and not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}
```

단일 `when` 표현식에서 가드 조건(Guard conditions)이 있는 분기와 없는 분기를 결합할 수 있습니다. 가드 조건(Guard condition)이 있는 분기의 코드는 기본 조건과 가드 조건이 모두 `true`로 평가될 때만 실행됩니다.
기본 조건이 일치하지 않으면 가드 조건(Guard condition)은 평가되지 않습니다.

`else` 분기가 없는 `when` 문에서 가드 조건(Guard conditions)을 사용하고 어떤 조건도 일치하지 않으면, 어떤 분기도 실행되지 않습니다.

그렇지 않고, `else` 분기가 없는 `when` 표현식에서 가드 조건(Guard conditions)을 사용하는 경우, 컴파일러는 런타임 오류를 피하기 위해 가능한 모든 경우를 선언하도록 요구합니다.

또한 가드 조건(Guard conditions)은 `else if`를 지원합니다.

```kotlin
when (animal) {
    // Checks if `animal` is `Dog`
    is Animal.Dog -> feedDog()
    // Guard condition that checks if `animal` is `Cat` and not `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // Calls giveLettuce() if none of the above conditions match and animal.eatsPlants is true
    else if animal.eatsPlants -> giveLettuce()
    // Prints "Unknown animal" if none of the above conditions match
    else -> println("Unknown animal")
}
```

불리언 연산자 `&&` (AND) 또는 `||` (OR)를 사용하여 단일 분기 내에서 여러 가드 조건(Guard conditions)을 결합할 수 있습니다. [혼동을 피하기 위해](coding-conventions.md#guard-conditions-in-when-expression) 불리언 표현식 주위에 괄호를 사용하세요.

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

쉼표로 구분된 여러 조건이 있는 경우를 제외하고, 주어가 있는 모든 `when` 표현식 또는 문(statement)에서 가드 조건(Guard conditions)을 사용할 수 있습니다.
예를 들어, `0, 1 -> print("x == 0 or x == 1")`과 같습니다.

> CLI에서 가드 조건(Guard conditions)을 활성화하려면 다음 명령을 실행합니다:
>
> `kotlinc -Xwhen-guards main.kt`
>
> Gradle에서 가드 조건(Guard conditions)을 활성화하려면 `build.gradle.kts` 파일에 다음 줄을 추가합니다:
>
> `kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`
> {style="note"}

## For 루프

`for` 루프는 이터레이터(iterator)를 제공하는 모든 것을 순회합니다. 이는 C#과 같은 언어의 `foreach` 루프와 동일합니다.
`for`의 구문(syntax)은 다음과 같습니다.

```kotlin
for (item in collection) print(item)
```

`for`의 본문(body)은 블록이 될 수 있습니다.

```kotlin
for (item: Int in ints) {
    // ...
}
```

앞에서 언급했듯이, `for`는 이터레이터(iterator)를 제공하는 모든 것을 순회합니다. 이는 다음을 의미합니다.

* `Iterator<>`를 반환하는 멤버 또는 확장 함수 `iterator()`를 가지고 있으며,
  이는:
  * 멤버 또는 확장 함수 `next()`를 가지고 있고
  * `Boolean`을 반환하는 멤버 또는 확장 함수 `hasNext()`를 가지고 있습니다.

이 세 함수는 모두 `operator`로 표시되어야 합니다.

숫자 범위를 순회하려면 [범위 표현식](ranges.md)을 사용합니다.

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

범위 또는 배열에 대한 `for` 루프는 이터레이터 객체를 생성하지 않는 인덱스 기반 루프로 컴파일됩니다.

인덱스를 사용하여 배열이나 리스트를 순회하려면 다음 방법을 사용할 수 있습니다.

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        print(array[i])
    }
    // abc
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

대안으로, `withIndex` 라이브러리 함수를 사용할 수 있습니다.

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## While 루프

`while` 및 `do-while` 루프는 조건이 만족되는 동안 본문을 계속해서 처리합니다.
둘의 차이점은 조건 확인 시점입니다.
* `while`은 조건을 확인하고, 만족하면 본문을 처리한 다음 다시 조건 확인으로 돌아갑니다.
* `do-while`은 본문을 처리한 다음 조건을 확인합니다. 조건이 만족되면 루프가 반복됩니다. 따라서 `do-while`의 본문은 조건과 관계없이 최소 한 번 실행됩니다.

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## 루프에서의 Break와 Continue

Kotlin은 루프에서 전통적인 `break` 및 `continue` 연산자를 지원합니다. [반환과 점프](returns.md)를 참조하세요.