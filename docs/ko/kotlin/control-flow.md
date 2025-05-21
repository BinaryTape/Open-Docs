---
title: "조건문과 반복문"
---
## If 식

Kotlin에서 `if`는 값을 반환하는 식입니다.
따라서 삼항 연산자(`condition ? then : else`)는 없는데, 일반적인 `if`가 이 역할을 잘 수행하기 때문입니다.

```kotlin
fun main() {
    val a = 2
    val b = 3

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

}
```

`if` 식의 분기는 블록이 될 수 있습니다. 이 경우 마지막 식이 블록의 값이 됩니다.

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

`if`를 식으로 사용하는 경우(예: 값을 반환하거나 변수에 할당하는 경우) `else` 분기는 필수입니다.

## When 식과 구문

`when`은 여러 가능한 값 또는 조건에 따라 코드를 실행하는 조건식입니다. 이는 Java, C 및 유사한 언어의 `switch` 구문과 유사합니다. 예를 들어:

```kotlin
fun main() {

    val x = 2
    when (x) {
        1 `->` print("x == 1")
        2 `->` print("x == 2")
        else `->` print("x is neither 1 nor 2")
    }
    // x == 2

}
```

`when`은 일부 분기 조건이 충족될 때까지 모든 분기에 대해 순차적으로 인수를 일치시킵니다.

`when`은 몇 가지 다른 방법으로 사용할 수 있습니다. 첫째, `when`을 **식** 또는 **구문**으로 사용할 수 있습니다.
식으로서 `when`은 코드에서 나중에 사용할 값을 반환합니다. 구문으로서 `when`은 추가로 사용할 값을 반환하지 않고 작업을 완료합니다.
<table>
<tr>
<td>
Expression
</td>
<td>
Statement
</td>
</tr>
<tr>
<td>

```kotlin
// Returns a string assigned to the 
// text variable
val text = when (x) {
    1 `->` "x == 1"
    2 `->` "x == 2"
    else `->` "x is neither 1 nor 2"
}
```
</td>
<td>

```kotlin
// Returns nothing but triggers a 
// print statement
when (x) {
    1 `->` print("x == 1")
    2 `->` print("x == 2")
    else `->` print("x is neither 1 nor 2")
}
```
</td>
</tr>
</table>

둘째, 주어가 있거나 없이 `when`을 사용할 수 있습니다. `when`과 함께 주어를 사용하든 사용하지 않든, 식이나
구문은 동일하게 동작합니다. 코드를 더 쉽게 읽을 수 있게 하고 확인하는 내용을 명확하게 보여주므로 가능한 경우 주어와 함께 `when`을 사용하는 것이 좋습니다.
<table>
<tr>
<td>
With subject `x`
</td>
<td>
Without subject
</td>
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

`when`을 사용하는 방법에 따라 분기에서 가능한 모든 사례를 다루어야 하는지에 대한 요구 사항이 다릅니다.

`when`을 구문으로 사용하는 경우 가능한 모든 사례를 다룰 필요는 없습니다. 이 예에서는 일부 사례가 다루어지지 않아 아무 일도 일어나지 않습니다. 그러나 오류는 발생하지 않습니다.

```kotlin
fun main() {

    val x = 3
    when (x) {
        // Not all cases are covered
        1 `->` print("x == 1")
        2 `->` print("x == 2")
    }

}
```

`when` 구문에서 개별 분기의 값은 무시됩니다. `if`와 마찬가지로 각 분기는 블록이 될 수 있으며
해당 값은 블록의 마지막 식의 값입니다.

`when`을 식으로 사용하는 경우 가능한 모든 사례를 다루어야 합니다. 즉, _exhaustive_해야 합니다.
첫 번째로 일치하는 분기의 값이 전체 식의 값이 됩니다. 모든 사례를 다루지 않으면
컴파일러에서 오류가 발생합니다.

`when` 식에 주어가 있는 경우 `else` 분기를 사용하여 가능한 모든 사례가 다루어지도록 할 수 있지만,
필수 사항은 아닙니다. 예를 들어 주어가 `Boolean`, [`enum` class](enum-classes), [`sealed` class](sealed-classes)이거나
nullable counterpart 중 하나인 경우 `else` 분기 없이 모든 사례를 다룰 수 있습니다.

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
  // No else branch is needed because all cases are covered
    Bit.ZERO `->` 0
    Bit.ONE `->` 1
}
```

`when` 식이 주어를 **갖지 않는** 경우 `else` 분기가 **있어야** 하거나 컴파일러에서 오류가 발생합니다.
`else` 분기는 다른 분기 조건이 충족되지 않을 때 평가됩니다.

```kotlin
when {
    a > b `->` "a is greater than b"
    a < b `->` "a is less than b"
    else `->` "a is equal to b"
}
```

`when` 식과 구문은 코드를 단순화하고, 여러 조건을 처리하고,
유형 검사를 수행하는 다양한 방법을 제공합니다.

쉼표를 사용하여 한 줄에 여러 사례의 조건을 결합하여 여러 사례에 대한 공통 동작을 정의할 수 있습니다.

```kotlin
when (x) {
    0, 1 `->` print("x == 0 or x == 1")
    else `->` print("otherwise")
}
```

분기 조건으로 임의의 식(상수뿐만 아니라)을 사용할 수 있습니다.

```kotlin
when (x) {
    s.toInt() `->` print("s encodes x")
    else `->` print("s does not encode x")
}
```

또한 `in` 또는 `!in` 키워드를 통해 값이 [range](ranges) 또는 컬렉션에 포함되어 있는지 여부를 확인할 수 있습니다.

```kotlin
when (x) {
    in 1..10 `->` print("x is in the range")
    in validNumbers `->` print("x is valid")
    !in 10..20 `->` print("x is outside the range")
    else `->` print("none of the above")
}
```

또한 `is` 또는 `!is` 키워드를 통해 값이 특정 유형인지 여부를 확인할 수 있습니다. [smart casts](typecasts#smart-casts)로 인해 추가 검사 없이 유형의 멤버 함수 및 속성에 액세스할 수 있습니다.

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String `->` x.startsWith("prefix")
    else `->` false
}
```

`when`을 `if`-`else` `if` 체인의 대체로 사용할 수 있습니다.
주어가 없으면 분기 조건은 단순히 부울 식입니다. `true` 조건이 있는 첫 번째 분기가 실행됩니다.

```kotlin
when {
    x.isOdd() `->` print("x is odd")
    y.isEven() `->` print("y is even")
    else `->` print("x+y is odd")
}
```

다음 구문을 사용하여 주어를 변수에 캡처할 수 있습니다.

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success `->` response.body
        is HttpError `->` throw HttpException(response.status)
    }
```

주어로 도입된 변수의 범위는 `when` 식 또는 구문의 본문으로 제한됩니다.

### When 식의 가드 조건

:::note
가드 조건은 언제든지 변경될 수 있는 [experimental feature](components-stability#stability-levels-explained)입니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

가드 조건을 사용하면 `when` 식의 분기에 둘 이상의 조건을 포함하여 복잡한 제어 흐름을 더 명시적이고 간결하게 만들 수 있습니다.
주어가 있는 `when` 식 또는 구문에서 가드 조건을 사용할 수 있습니다.

분기에 가드 조건을 포함하려면 기본 조건 뒤에 `if`로 구분하여 배치합니다.

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only primary condition. Calls `feedDog()` when `Animal` is `Dog`
        is Animal.Dog `->` feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `Animal` is `Cat` and is not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter `->` feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else `->` println("Unknown animal")
    }
}
```

단일 `when` 식에서 가드 조건이 있거나 없는 분기를 결합할 수 있습니다.
가드 조건이 있는 분기의 코드는 기본 조건과 가드 조건이 모두 true로 평가되는 경우에만 실행됩니다.
기본 조건이 일치하지 않으면 가드 조건은 평가되지 않습니다.

`else` 분기가 없는 `when` 구문에서 가드 조건을 사용하고 조건이 일치하지 않으면 분기가 실행되지 않습니다.

그렇지 않고 `else` 분기가 없는 `when` 식에서 가드 조건을 사용하는 경우 런타임 오류를 방지하기 위해 가능한 모든 사례를 선언해야 합니다.

또한 가드 조건은 `else if`를 지원합니다.

```kotlin
when (animal) {
    // Checks if `animal` is `Dog`
    is Animal.Dog `->` feedDog()
    // Guard condition that checks if `animal` is `Cat` and not `mouseHunter`
    is Animal.Cat if !animal.mouseHunter `->` feedCat()
    // Calls giveLettuce() if none of the above conditions match and animal.eatsPlants is true
    else if animal.eatsPlants `->` giveLettuce()
    // Prints "Unknown animal" if none of the above conditions match
    else `->` println("Unknown animal")
}
```

부울 연산자 `&&`(AND) 또는 `||`(OR)를 사용하여 단일 분기 내에서 여러 가드 조건을 결합합니다.
[혼동을 피하기 위해](coding-conventions#guard-conditions-in-when-expression) 부울 식 주위에 괄호를 사용하십시오.

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) `->` feedCat()
}
```

쉼표로 구분된 여러 조건이 있는 경우를 제외하고는 주어가 있는 모든 `when` 식 또는 구문에서 가드 조건을 사용할 수 있습니다.
예를 들어 `0, 1 `->` print("x == 0 or x == 1")`입니다.

CLI에서 가드 조건을 활성화하려면 다음 명령을 실행합니다.

`kotlinc -Xwhen-guards main.kt`

Gradle에서 가드 조건을 활성화하려면 `build.gradle.kts` 파일에 다음 줄을 추가합니다.

`kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`

:::

## For 루프

`for` 루프는 iterator를 제공하는 모든 항목을 반복합니다. 이것은 C#과 같은 언어의 `foreach` 루프와 동일합니다.
`for`의 구문은 다음과 같습니다.

```kotlin
for (item in collection) print(item)
```

`for`의 본문은 블록이 될 수 있습니다.

```kotlin
for (item: Int in ints) {
    // ...
}
```

앞에서 언급했듯이 `for`는 iterator를 제공하는 모든 항목을 반복합니다. 즉, 다음을 의미합니다.

* `Iterator<>`를 반환하는 멤버 또는 확장 함수 `iterator()`가 있습니다.
  * 멤버 또는 확장 함수 `next()`가 있습니다.
  * `Boolean`을 반환하는 멤버 또는 확장 함수 `hasNext()`가 있습니다.

이러한 세 가지 함수는 모두 `operator`로 표시되어야 합니다.

숫자 범위를 반복하려면 [range expression](ranges)을 사용하십시오.

```kotlin
fun main() {

    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420

}
```

범위 또는 배열에 대한 `for` 루프는 iterator 객체를 생성하지 않는 인덱스 기반 루프로 컴파일됩니다.

인덱스가 있는 배열 또는 목록을 반복하려면 다음과 같이 할 수 있습니다.

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")

    for (i in array.indices) {
        print(array[i])
    }
    // abc

}
```

또는 `withIndex` 라이브러리 함수를 사용할 수 있습니다.

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")

    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c

}
```

## While 루프

`while` 및 `do-while` 루프는 조건이 충족되는 동안 본문을 계속 처리합니다.
그들 사이의 차이점은 조건 확인 시간입니다.
* `while`은 조건을 확인하고, 충족되면 본문을 처리한 다음 조건 확인으로 돌아갑니다.
* `do-while`은 본문을 처리한 다음 조건을 확인합니다. 충족되면 루프가 반복됩니다. 따라서 `do-while`의 본문은
조건에 관계없이 적어도 한 번 실행됩니다.

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## 루프의 Break 및 continue

Kotlin은 루프에서 기존의 `break` 및 `continue` 연산자를 지원합니다. [Returns and jumps](returns)를 참조하십시오.