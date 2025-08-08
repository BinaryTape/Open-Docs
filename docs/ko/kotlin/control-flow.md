[//]: # (title: 조건문과 루프)

## `if` 표현식

Kotlin에서 `if`는 표현식(expression)으로, 값을 반환합니다. 따라서 일반적인 `if`가 삼항 연산자(`condition ? then : else`)의 역할을 잘 수행하기 때문에 별도의 삼항 연산자는 없습니다.

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // else와 함께 사용
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // 표현식으로 사용
    max = if (a > b) a else b

    // 표현식에서 `else if`도 사용할 수 있습니다.
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

`if` 표현식의 브랜치(branch)는 블록이 될 수 있습니다. 이 경우 블록의 마지막 표현식이 해당 블록의 값이 됩니다.

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

`if`를 표현식으로 사용하는 경우, 예를 들어 그 값을 반환하거나 변수에 할당하는 경우 `else` 브랜치는 필수입니다.

## `when` 표현식과 문

`when`은 여러 가능한 값 또는 조건에 따라 코드를 실행하는 조건부 표현식입니다. 이는 Java, C 및 유사 언어의 `switch` 문과 유사합니다. 예를 들어:

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

`when`은 어떤 브랜치 조건이 충족될 때까지 인수를 모든 브랜치와 순차적으로 비교합니다.

`when`은 몇 가지 다른 방식으로 사용할 수 있습니다. 첫째, `when`을 **표현식**으로 사용하거나 **문(statement)**으로 사용할 수 있습니다. 표현식으로서 `when`은 코드에서 나중에 사용할 값을 반환합니다. 문으로서 `when`은 더 이상 사용될 것을 반환하지 않고 동작을 완료합니다.

<table>
   <tr>
       <td>표현식</td>
       <td>문</td>
   </tr>
   <tr>
<td>

```kotlin
// x 변수에 할당될 문자열을 반환합니다.
// text 변수
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// 아무것도 반환하지 않지만 print 문을 트리거합니다.
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

둘째, `when`을 주제(subject)와 함께 사용하거나 사용하지 않고 사용할 수 있습니다. `when`에 주제를 사용하든 안 하든, 표현식 또는 문의 동작은 동일합니다. 가능한 한 `when`을 주제와 함께 사용하는 것을 권장합니다. 이는 무엇을 확인하는지 명확하게 보여줌으로써 코드를 더 읽기 쉽고 유지보수하기 쉽게 만듭니다.

<table>
   <tr>
       <td>주제 <code>x</code>와 함께 사용</td>
       <td>주제 없이 사용</td>
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

`when`을 어떻게 사용하느냐에 따라 브랜치에서 모든 가능한 경우를 커버해야 하는지에 대한 요구사항이 다릅니다.

`when`을 문(statement)으로 사용하는 경우, 모든 가능한 경우를 커버할 필요는 없습니다. 이 예시에서는 일부 경우가 커버되지 않았으므로 아무 일도 일어나지 않습니다. 그러나 오류도 발생하지 않습니다.

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // 모든 경우가 커버되지 않음
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

`when` 문에서 개별 브랜치의 값은 무시됩니다. `if`와 마찬가지로 각 브랜치는 블록이 될 수 있으며, 그 값은 블록의 마지막 표현식의 값입니다.

`when`을 표현식으로 사용하는 경우, 모든 가능한 경우를 커버해야 합니다. 다시 말해, _모든 경우를 망라하는(exhaustive)_ 형태여야 합니다. 첫 번째로 일치하는 브랜치의 값이 전체 표현식의 값이 됩니다. 모든 경우를 커버하지 않으면 컴파일러가 오류를 발생시킵니다.

`when` 표현식에 주제가 있는 경우, `else` 브랜치를 사용하여 모든 가능한 경우를 커버하도록 할 수 있지만 필수는 아닙니다. 예를 들어, 주제가 `Boolean`, [`enum` 클래스](enum-classes.md), [`sealed` 클래스](sealed-classes.md) 또는 이들의 널 허용(nullable) 대응자(counterpart)인 경우 `else` 브랜치 없이 모든 경우를 커버할 수 있습니다.

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // 모든 경우가 커버되므로 else 브랜치가 필요 없습니다.
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

> `when` 표현식을 단순화하고 반복을 줄이려면 문맥 의존적 분석(context-sensitive resolution) (현재 프리뷰 중)을 시도해 보세요. 이 기능은 예상되는 타입이 알려져 있는 경우 `when` 표현식에서 enum 엔트리 또는 sealed 클래스 멤버를 사용할 때 타입 이름을 생략할 수 있게 해줍니다.
> 
> 더 자세한 내용은 [문맥 의존적 분석 프리뷰(Preview of context-sensitive resolution)](whatsnew22.md#preview-of-context-sensitive-resolution) 또는 관련 [KEEP 제안서(KEEP proposal)](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)를 참조하세요.
> 
{style="tip"}

`when` 표현식에 주제가 **없는** 경우, `else` 브랜치가 **반드시** 있어야 합니다. 그렇지 않으면 컴파일러가 오류를 발생시킵니다. `else` 브랜치는 다른 브랜치 조건이 충족되지 않을 때 평가됩니다.

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when` 표현식과 문은 코드를 단순화하고, 여러 조건을 처리하며, 타입 검사를 수행하는 다양한 방법을 제공합니다.

쉼표로 조건을 한 줄에 결합하여 여러 경우에 대한 공통 동작을 정의할 수 있습니다.

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

상수뿐만 아니라 임의의 표현식을 브랜치 조건으로 사용할 수 있습니다.

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

`in` 또는 `!in` 키워드를 통해 값이 [범위](ranges.md) 또는 컬렉션에 포함되는지 또는 포함되지 않는지 확인할 수도 있습니다.

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

또한 `is` 또는 `!is` 키워드를 통해 값이 특정 타입인지 아닌지 확인할 수 있습니다. [스마트 캐스트(smart casts)](typecasts.md#smart-casts) 덕분에 추가적인 검사 없이 타입의 멤버 함수와 프로퍼티에 접근할 수 있습니다.

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

`when`을 `if`-`else` `if` 체인 대신 사용할 수 있습니다. 주제가 없는 경우 브랜치 조건은 단순히 불리언 표현식입니다. `true` 조건을 가진 첫 번째 브랜치가 실행됩니다.

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

다음 구문을 사용하여 주제를 변수에 캡처할 수 있습니다.

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

주제로 도입된 변수의 스코프는 `when` 표현식 또는 문의 본문으로 제한됩니다.

### `when` 표현식의 가드 조건

가드 조건(Guard conditions)을 사용하면 `when` 표현식의 브랜치에 하나 이상의 조건을 포함할 수 있어 복잡한 제어 흐름을 더 명시적이고 간결하게 만듭니다. `when` 표현식 또는 문을 주제와 함께 사용할 때 가드 조건을 사용할 수 있습니다.

브랜치에 가드 조건을 포함하려면, 주요 조건 뒤에 `if`로 구분하여 배치합니다.

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // 주요 조건만 있는 브랜치. `animal`이 `Dog`일 때 `feedDog()`를 호출합니다.
        is Animal.Dog -> feedDog()
        // 주요 조건과 가드 조건이 모두 있는 브랜치. `animal`이 `Cat`이고 `mouseHunter`가 아닐 때 `feedCat()`을 호출합니다.
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 위의 조건 중 어느 것도 일치하지 않으면 "Unknown animal"을 출력합니다.
        else -> println("Unknown animal")
    }
}
```

단일 `when` 표현식에서 가드 조건이 있는 브랜치와 없는 브랜치를 결합할 수 있습니다. 가드 조건이 있는 브랜치의 코드는 주요 조건과 가드 조건이 모두 true로 평가될 때만 실행됩니다. 주요 조건이 일치하지 않으면 가드 조건은 평가되지 않습니다.

`when` 문에서 `else` 브랜치 없이 가드 조건을 사용하는 경우, 어떤 조건도 일치하지 않으면 어떤 브랜치도 실행되지 않습니다.

그렇지 않고, `when` 표현식에서 `else` 브랜치 없이 가드 조건을 사용하는 경우, 컴파일러는 런타임 오류를 피하기 위해 모든 가능한 경우를 선언하도록 요구합니다.

또한, 가드 조건은 `else if`를 지원합니다.

```kotlin
when (animal) {
    // `animal`이 `Dog`인지 확인합니다.
    is Animal.Dog -> feedDog()
    // `animal`이 `Cat`이고 `mouseHunter`가 아닌지 확인하는 가드 조건입니다.
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 위의 조건 중 어느 것도 일치하지 않고 animal.eatsPlants가 true이면 giveLettuce()를 호출합니다.
    else if animal.eatsPlants -> giveLettuce()
    // 위의 조건 중 어느 것도 일치하지 않으면 "Unknown animal"을 출력합니다.
    else -> println("Unknown animal")
}
```

불리언 연산자 `&&` (AND) 또는 `||` (OR)을 사용하여 단일 브랜치 내에서 여러 가드 조건을 결합할 수 있습니다. [혼동을 피하기 위해](coding-conventions.md#guard-conditions-in-when-expression) 불리언 표현식 주위에 괄호를 사용하세요.

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

가드 조건은 주제를 가진 모든 `when` 표현식 또는 문에서 사용할 수 있으며, 쉼표로 구분된 여러 조건(`0, 1 -> print("x == 0 or x == 1")` 등)이 있는 경우는 예외입니다.

## `for` 루프

`for` 루프는 이터레이터(iterator)를 제공하는 모든 것을 반복합니다. 이는 C#과 같은 언어의 `foreach` 루프와 동일합니다. `for`의 구문은 다음과 같습니다.

```kotlin
for (item in collection) print(item)
```

`for`의 본문은 블록이 될 수 있습니다.

```kotlin
for (item: Int in ints) {
    // ...
}
```

앞서 언급했듯이 `for`는 이터레이터를 제공하는 모든 것을 반복합니다. 이는 다음을 의미합니다.

*   `Iterator<>`를 반환하는 멤버 또는 확장 함수 `iterator()`가 있어야 합니다. 이 `Iterator<>`는:
    *   멤버 또는 확장 함수 `next()`를 가져야 합니다.
    *   `Boolean`을 반환하는 멤버 또는 확장 함수 `hasNext()`를 가져야 합니다.

이 세 함수는 모두 `operator`로 표시되어야 합니다.

숫자 범위를 반복하려면 [범위 표현식(range expression)](ranges.md)을 사용하세요.

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

인덱스를 사용하여 배열 또는 리스트를 반복하려면 다음과 같이 할 수 있습니다.

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

또는 `withIndex` 라이브러리 함수를 사용할 수 있습니다.

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

## `while` 루프

`while` 및 `do-while` 루프는 조건이 충족되는 동안 본문을 계속 처리합니다. 둘의 차이점은 조건 확인 시점입니다.
*   `while`은 조건을 확인하고, 충족되면 본문을 처리한 다음 다시 조건 확인으로 돌아갑니다.
*   `do-while`은 본문을 처리한 다음 조건을 확인합니다. 충족되면 루프가 반복됩니다. 따라서 `do-while`의 본문은 조건에 관계없이 최소 한 번 실행됩니다.

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y는 여기서 볼 수 있습니다!
```

## 루프에서의 `break` 및 `continue`

Kotlin은 루프에서 전통적인 `break` 및 `continue` 연산자를 지원합니다. [반환과 점프(Returns and jumps)](returns.md)를 참조하세요.