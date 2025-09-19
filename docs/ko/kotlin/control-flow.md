[//]: # (title: 조건문과 루프)

Kotlin은 프로그램 흐름을 제어할 수 있는 유연한 도구를 제공합니다. `if`, `when`, 그리고 루프를 사용하여 조건에 대한 명확하고 표현력 있는 로직을 정의할 수 있습니다.

## If 표현식

Kotlin에서 `if`를 사용하려면, 괄호 `()` 안에 확인할 조건을 추가하고, 결과가 true일 경우 수행할 동작을 중괄호 `{}` 안에 추가합니다. `else`와 `else if`를 사용하여 추가적인 브랜치와 검사를 수행할 수 있습니다.

`if`를 표현식으로 작성하여 반환된 값을 변수에 직접 할당할 수도 있습니다. 이 형태에서는 `else` 브랜치가 필수입니다. `if` 표현식은 다른 언어에서 찾아볼 수 있는 삼항 연산자(`condition ? then : else`)와 동일한 역할을 합니다.

예를 들어:

```kotlin
fun main() {
    val heightAlice = 160
    val heightBob = 175

    //sampleStart
    var taller = heightAlice
    if (heightAlice < heightBob) taller = heightBob

    // Uses an else branch
    if (heightAlice > heightBob) {
        taller = heightAlice
    } else {
        taller = heightBob
    }

    // Uses if as an expression
    taller = if (heightAlice > heightBob) heightAlice else heightBob

    // Uses else if as an expression:
    val heightLimit = 150
    val heightOrLimit = if (heightLimit > heightAlice) heightLimit else if (heightAlice > heightBob) heightAlice else heightBob

    println("Taller height is $taller")
    // Taller height is 175
    println("Height or limit is $heightOrLimit")
    // Height or limit is 175
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if` 표현식의 각 브랜치는 블록이 될 수 있으며, 블록의 마지막 표현식의 값이 결과가 됩니다.

```kotlin
fun main() {
    //sampleStart
    val heightAlice = 160
    val heightBob = 175

    val taller = if (heightAlice > heightBob) {
        print("Choose Alice
")
        heightAlice
    } else {
        print("Choose Bob
")
        heightBob
    }

    println("Taller height is $taller")
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-blocks-kotlin"}

## When 표현식과 문

`when`은 여러 가능한 값 또는 조건에 따라 코드를 실행하는 조건부 표현식입니다. 이는 Java, C 및 기타 언어의 `switch` 문과 유사합니다. `when`은 인수를 평가하고 그 결과를 각 브랜치와 순서대로 비교하여 하나의 브랜치 조건이 충족될 때까지 진행합니다. 예를 들어:

```kotlin
fun main() {
    //sampleStart
    val userRole = "Editor"
    when (userRole) {
        "Viewer" -> print("User has read-only access")
        "Editor" -> print("User can edit content")
        else -> print("User role is not recognized")
    }
    // User can edit content
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when`은 **표현식**으로 사용하거나 **문(statement)**으로 사용할 수 있습니다. 표현식으로서 `when`은 코드에서 나중에 사용할 값을 반환합니다. 문으로서 `when`은 결과를 반환하지 않고 동작을 완료합니다:

<table>
   <tr>
       <td>표현식</td>
       <td>문</td>
   </tr>
   <tr>
<td>

```kotlin
// text 변수에 할당될 문자열을 반환합니다.
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

둘째로, `when`을 주제와 함께 사용하거나 사용하지 않고 사용할 수 있습니다. `when`에 주제를 사용하든 안 하든, 동작은 동일합니다. 주제를 사용하는 것이 무엇을 확인하는지 명확하게 보여줌으로써 코드를 더 읽기 쉽고 유지보수하기 쉽게 만듭니다.

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

`when`을 어떻게 사용하느냐에 따라 브랜치에서 모든 가능한 경우를 커버해야 하는지에 대한 요구사항이 다릅니다. 모든 가능한 경우를 커버하는 것을 _모든 경우를 망라하는(exhaustive)_ 형태라고 합니다.

### 문

`when`을 문(statement)으로 사용하는 경우, 모든 가능한 경우를 커버할 필요는 없습니다. 이 예시에서는 일부 경우가 커버되지 않았으므로 어떤 브랜치도 트리거되지 않습니다. 그러나 오류도 발생하지 않습니다:

```kotlin
fun main() {
    //sampleStart
    val deliveryStatus = "OutForDelivery"
    when (deliveryStatus) {
        // 모든 경우가 커버되지 않음
        "Pending" -> print("Your order is being prepared")
        "Shipped" -> print("Your order is on the way")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

`if`와 마찬가지로, 각 브랜치는 블록이 될 수 있으며, 그 값은 블록의 마지막 표현식의 값입니다.

### 표현식

`when`을 표현식으로 사용하는 경우, 모든 가능한 경우를 **반드시** 커버해야 합니다. 첫 번째로 일치하는 브랜치의 값이 전체 표현식의 값이 됩니다. 모든 경우를 커버하지 않으면 컴파일러가 오류를 발생시킵니다.

`when` 표현식에 주제가 있는 경우, `else` 브랜치를 사용하여 모든 가능한 경우를 커버하도록 할 수 있지만 필수는 아닙니다. 예를 들어, 주제가 `Boolean`, [`enum` 클래스](enum-classes.md), [`sealed` 클래스](sealed-classes.md) 또는 이들의 널 허용(nullable) 대응자(counterpart)인 경우 `else` 브랜치 없이 모든 경우를 커버할 수 있습니다:

```kotlin
import kotlin.random.Random
//sampleStart
enum class Bit {
    ZERO, ONE
}

fun getRandomBit(): Bit {
    return if (Random.nextBoolean()) Bit.ONE else Bit.ZERO
}

fun main() {
    val numericValue = when (getRandomBit()) {
        // 모든 경우가 커버되므로 else 브랜치가 필요 없습니다.
        Bit.ZERO -> 0
        Bit.ONE -> 1
    }

    println("Random bit as number: $numericValue")
    // Random bit as number: 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-expression-subject"}

> `when` 표현식을 단순화하고 반복을 줄이려면 문맥 의존적 분석(context-sensitive resolution) (현재 프리뷰 중)을 시도해 보세요. 이 기능은 예상되는 타입이 알려져 있는 경우 `when` 표현식에서 enum 엔트리 또는 sealed 클래스 멤버를 사용할 때 타입 이름을 생략할 수 있게 해줍니다.
> 
> 더 자세한 내용은 [문맥 의존적 분석 프리뷰(Preview of context-sensitive resolution)](whatsnew22.md#preview-of-context-sensitive-resolution) 또는 관련 [KEEP 제안서(KEEP proposal)](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)를 참조하세요.
> 
{style="tip"}

`when` 표현식에 주제가 **없는** 경우, `else` 브랜치가 **반드시** 있어야 합니다. 그렇지 않으면 컴파일러가 오류를 발생시킵니다. `else` 브랜치는 다른 브랜치 조건이 충족되지 않을 때 평가됩니다:

```kotlin
fun main() {
    //sampleStart
    val localFileSize = 1200
    val remoteFileSize = 1200

    val message = when {
        localFileSize > remoteFileSize -> "Local file is larger than remote file"
        localFileSize < remoteFileSize -> "Local file is smaller than remote file"
        else -> "Local and remote files are the same size"
    }

    println(message)
    // Local and remote files are the same size
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-no-subject"}

### when을 사용하는 다른 방법

`when` 표현식과 문은 코드를 단순화하고, 여러 조건을 처리하며, 타입 검사를 수행하는 다양한 방법을 제공합니다.

쉼표로 조건을 한 줄에 결합하여 여러 경우에 대한 공통 동작을 정의할 수 있습니다:

```kotlin
fun main() {
    val ticketPriority = "High"
    //sampleStart
    when (ticketPriority) {
        "Low", "Medium" -> print("Standard response time")
        else -> print("High-priority handling")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-multiple-cases"}

`true` 또는 `false`로 평가되는 표현식을 브랜치 조건으로 사용할 수 있습니다:

```kotlin
fun main() {
    val storedPin = "1234"
    val enteredPin = 1234
  
    //sampleStart
    when (enteredPin) {
        // Expression
        storedPin.toInt() -> print("PIN is correct")
        else -> print("Incorrect PIN")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-branch-expression"}

`in` 또는 `!in` 키워드를 통해 값이 [범위](ranges.md) 또는 컬렉션에 포함되는지 또는 포함되지 않는지 확인할 수도 있습니다:

```kotlin
fun main() {
    val x = 7
    val validNumbers = setOf(15, 16, 17)

    //sampleStart
    when (x) {
        in 1..10 -> print("x is in the range")
        in validNumbers -> print("x is valid")
        !in 10..20 -> print("x is outside the range")
        else -> print("none of the above")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-ranges"}

`is` 또는 `!is` 키워드를 통해 값의 타입을 확인할 수 있습니다. [스마트 캐스트(smart casts)](typecasts.md#smart-casts) 덕분에 추가적인 검사 없이 타입의 멤버 함수와 프로퍼티에 직접 접근할 수 있습니다:

```kotlin
fun hasPrefix(input: Any): Boolean = when (input) {
    is String -> input.startsWith("ID-")
    else -> false
}

fun main() {
    val testInput = "ID-98345"
    println(hasPrefix(testInput))
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-type-checks"}

`when`을 전통적인 `if`-`else` `if` 체인 대신 사용할 수 있습니다. 주제가 없는 경우 브랜치 조건은 단순히 불리언 표현식입니다. `true` 조건을 가진 첫 번째 브랜치가 실행됩니다:

```kotlin
fun Int.isOdd() = this % 2 != 0
fun Int.isEven() = this % 2 == 0

fun main() {
    //sampleStart
    val x = 5
    val y = 8

    when {
        x.isOdd() -> print("x is odd")
        y.isEven() -> print("y is even")
        else -> print("x+y is odd")
    }
    // x is odd
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-replace-if"}

마지막으로, 다음 구문을 사용하여 주제를 변수에 캡처할 수 있습니다:

```kotlin
fun main() {
    val message = when (val input = "yes") {
        "yes" -> "You said yes"
        "no" -> "You said no"
        else -> "Unrecognized input: $input"
    }

    println(message)
    // You said yes
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-capture-subject"}

주제로 도입된 변수의 스코프는 `when` 표현식 또는 문의 본문으로 제한됩니다.

### 가드 조건 {id="guard-conditions-in-when-expressions"}

가드 조건(Guard conditions)을 사용하면 `when` 표현식 또는 문의 브랜치에 하나 이상의 조건을 포함할 수 있어 복잡한 제어 흐름을 더 명시적이고 간결하게 만듭니다. `when` 표현식 또는 문을 주제와 함께 사용할 때 가드 조건을 사용할 수 있습니다.

브랜치에 가드 조건을 포함하려면, 주요 조건 뒤에 `if`로 구분하여 배치합니다:

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedDog() = println("Feeding a dog")
fun feedCat() = println("Feeding a cat")

//sampleStart
fun feedAnimal(animal: Animal) {
    when (animal) {
        // 주요 조건만 있는 브랜치.
        // animal이 Dog일 때 feedDog()를 호출합니다.
        is Animal.Dog -> feedDog()
        // 주요 조건과 가드 조건이 모두 있는 브랜치.
        // animal이 Cat이고 mouseHunter가 아닐 때 feedCat()을 호출합니다.
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 위의 조건 중 어느 것도 일치하지 않으면 "Unknown animal"을 출력합니다.
        else -> println("Unknown animal")
    }
}

fun main() {
    val animals = listOf(
        Animal.Dog("Beagle"),
        Animal.Cat(mouseHunter = false),
        Animal.Cat(mouseHunter = true)
    )

    animals.forEach { feedAnimal(it) }
    // Feeding a dog
    // Feeding a cat
    // Unknown animal
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2" id="kotlin-when-guard-conditions"}

쉼표로 구분된 여러 조건이 있는 경우에는 가드 조건을 사용할 수 없습니다. 예를 들어:

```kotlin
0, 1 -> print("x == 0 or x == 1")
```

단일 `when` 표현식 또는 문에서 가드 조건이 있는 브랜치와 없는 브랜치를 결합할 수 있습니다. 가드 조건이 있는 브랜치의 코드는 주요 조건과 가드 조건이 모두 `true`로 평가될 때만 실행됩니다. 주요 조건이 일치하지 않으면 가드 조건은 평가되지 않습니다.

`when` 문은 모든 경우를 커버할 필요가 없으므로, `else` 브랜치 없이 `when` 문에서 가드 조건을 사용하는 경우 어떤 조건도 일치하지 않으면 어떤 코드도 실행되지 않습니다.

문과 달리 `when` 표현식은 모든 경우를 커버해야 합니다. `else` 브랜치 없이 `when` 표현식에서 가드 조건을 사용하는 경우, 컴파일러는 런타임 오류를 피하기 위해 모든 가능한 경우를 처리하도록 요구합니다.

불리언 연산자 `&&` (AND) 또는 `||` (OR)을 사용하여 단일 브랜치 내에서 여러 가드 조건을 결합할 수 있습니다. [혼동을 피하기 위해](coding-conventions.md#guard-conditions-in-when-expression) 불리언 표현식 주위에 괄호를 사용하세요:

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

가드 조건은 `else if`도 지원합니다:

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

## For 루프

[컬렉션](collections-overview.md), [배열](arrays.md) 또는 [범위](ranges.md)를 반복하려면 `for` 루프를 사용하세요:

```kotlin
for (item in collection) print(item)
```

`for` 루프의 본문은 중괄호 `{}`로 된 블록이 될 수 있습니다.

```kotlin
fun main() {
    val shoppingList = listOf("Milk", "Bananas", "Bread")
    //sampleStart
    println("Things to buy:")
    for (item in shoppingList) {
        println("- $item")
    }
    // Things to buy:
    // - Milk
    // - Bananas
    // - Bread
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop"}

### 범위

숫자 범위를 반복하려면 `..` 및 `..<` 연산자와 함께 [범위 표현식](ranges.md)을 사용하세요:

```kotlin
fun main() {
//sampleStart
    println("Closed-ended range:")
    for (i in 1..6) {
        print(i)
    }
    // Closed-ended range:
    // 123456
  
    println("
Open-ended range:")
    for (i in 1..<6) {
        print(i)
    }
    // Open-ended range:
    // 12345
  
    println("
Reverse order in steps of 2:")
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // Reverse order in steps of 2:
    // 6420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-range"}

### 배열

인덱스를 사용하여 배열 또는 리스트를 반복하려면 `indices` 프로퍼티를 사용할 수 있습니다:

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for (i in routineSteps.indices) {
        println(routineSteps[i])
    }
    // Wake up
    // Brush teeth
    // Make coffee
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array"}

또는 표준 라이브러리의 [`.withIndex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/with-index.html) 함수를 사용할 수 있습니다:

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for ((index, value) in routineSteps.withIndex()) {
        println("The step at $index is \"$value\"")
    }
    // The step at 0 is "Wake up"
    // The step at 1 is "Brush teeth"
    // The step at 2 is "Make coffee"
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array-index"}

### 이터레이터

`for` 루프는 [이터레이터](iterators.md)를 제공하는 모든 것을 반복합니다. 컬렉션은 기본적으로 이터레이터를 제공하지만, 범위와 배열은 인덱스 기반 루프로 컴파일됩니다.

`Iterator<>`를 반환하는 `iterator()`라는 멤버 또는 확장 함수를 제공하여 자신만의 이터레이터를 만들 수 있습니다. `iterator()` 함수는 `next()` 함수와 `Boolean`을 반환하는 `hasNext()` 함수를 가져야 합니다.

클래스에 대한 자신만의 이터레이터를 만드는 가장 쉬운 방법은 [`Iterable<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-iterable/) 인터페이스를 상속하고 이미 존재하는 `iterator()`, `next()`, `hasNext()` 함수를 오버라이드하는 것입니다. 예를 들어:

```kotlin
class Booklet(val totalPages: Int) : Iterable<Int> {
    override fun iterator(): Iterator<Int> {
        return object : Iterator<Int> {
            var current = 1
            override fun hasNext() = current <= totalPages
            override fun next() = current++
        }
    }
}

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-inherit-iterator"}

> [인터페이스](interfaces.md)와 [상속](inheritance.md)에 대해 자세히 알아보세요.
> 
{style="tip"}

또는 함수를 처음부터 만들 수 있습니다. 이 경우 함수에 `operator` 키워드를 추가하세요:

```kotlin
//sampleStart
class Booklet(val totalPages: Int) {
    operator fun iterator(): Iterator<Int> {
        return object {
            var current = 1

            operator fun hasNext() = current <= totalPages
            operator fun next() = current++
        }.let {
            object : Iterator<Int> {
                override fun hasNext() = it.hasNext()
                override fun next() = it.next()
            }
        }
    }
}
//sampleEnd

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-iterator-from-scratch"}

## While 루프

`while` 및 `do-while` 루프는 조건이 충족되는 동안 본문을 계속 처리합니다. 둘의 차이점은 조건 확인 시점입니다:

*   `while`은 조건을 확인하고, 충족되면 본문을 처리한 다음 다시 조건 확인으로 돌아갑니다.
*   `do-while`은 본문을 처리한 다음 조건을 확인합니다. 충족되면 루프가 반복됩니다. 따라서 `do-while`의 본문은 조건에 관계없이 최소 한 번 실행됩니다.

`while` 루프의 경우, 괄호 `()` 안에 확인할 조건을, 중괄호 `{}` 안에 본문을 배치합니다:

```kotlin
fun main() {
    var carsInGarage = 0
    val maxCapacity = 3
//sampleStart
    while (carsInGarage < maxCapacity) {
        println("Car entered. Cars now in garage: ${++carsInGarage}")
    }
    // Car entered. Cars now in garage: 1
    // Car entered. Cars now in garage: 2
    // Car entered. Cars now in garage: 3

    println("Garage is full!")
    // Garage is full!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-while-loop"}

`do-while` 루프의 경우, 괄호 `()` 안에 확인할 조건보다 먼저 중괄호 `{}` 안에 본문을 배치합니다:

```kotlin
import kotlin.random.Random

fun main() {
    var roll: Int
//sampleStart
    do {
        roll = Random.nextInt(1, 7)
        println("Rolled a $roll")
    } while (roll != 6)
    // Rolled a 2
    // Rolled a 6
    
    println("Got a 6! Game over.")
    // Got a 6! Game over.
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-do-while-loop"}

## 루프에서의 Break 및 Continue

Kotlin은 루프에서 전통적인 `break` 및 `continue` 연산자를 지원합니다. [반환과 점프(Returns and jumps)](returns.md)를 참조하세요.