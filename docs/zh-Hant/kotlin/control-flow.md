[//]: # (title: 條件與迴圈)

Kotlin 為你提供了彈性工具來控制程式流程。使用 `if`、`when` 和迴圈來定義清晰、富有表達力的條件邏輯。

## If 表達式

要在 Kotlin 中使用 `if`，請將要檢查的條件放在圓括號 `()` 內，並將如果結果為 true 時要執行的動作放在花括號 `{}` 內。你可以使用 `else` 和 `else if` 來添加額外的分支和檢查。

你也可以將 `if` 作為表達式來撰寫，這讓你可以直接將其回傳值賦予變數。在這種形式下，`else` 分支是強制性的。`if` 表達式的作用與其他語言中的三元運算子 (`condition ? then : else`) 相同。

例如：

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

`if` 表達式的每個分支都可以是區塊，其中最後一個表達式的值就是結果：

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

## When 表達式與語句

`when` 是一個條件表達式，它根據多個可能的值或條件來執行程式碼。它類似於 Java、C 及其他語言中的 `switch` 語句。`when` 會評估其引數，並依序將結果與每個分支進行比對，直到某個分支條件滿足為止。例如：

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

你可以將 `when` 作為 **表達式** 或 **語句** 使用。作為表達式，`when` 會回傳一個值以供後續在程式碼中使用。作為語句，`when` 會完成一個動作而不回傳任何結果：

<table>
   <tr>
       <td>表達式</td>
       <td>語句</td>
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
// Returns no result but triggers a 
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

其次，你可以使用帶有或不帶有主題的 `when`。無論你是否在 `when` 中使用主題，其行為都相同。建議在可能的情況下使用帶有主題的 `when`，因為它能清楚地顯示你正在檢查的內容，使你的程式碼更易於閱讀和維護。

<table>
   <tr>
       <td>帶有主題 <code>x</code></td>
       <td>不帶主題</td>
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

你使用 `when` 的方式決定了你是否需要在分支中涵蓋所有可能的情況。涵蓋所有可能情況稱為 _詳盡的_。

### 語句

如果你將 `when` 作為語句使用，你不需要涵蓋所有可能的情況。在此範例中，有些情況未被涵蓋，因此沒有分支被觸發。然而，不會發生錯誤：

```kotlin
fun main() {
    //sampleStart
    val deliveryStatus = "OutForDelivery"
    when (deliveryStatus) {
        // Not all cases are covered
        "Pending" -> print("Your order is being prepared")
        "Shipped" -> print("Your order is on the way")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

就像 `if` 一樣，每個分支都可以是一個區塊，其值是區塊中最後一個表達式的值。

### 表達式

如果你將 `when` 作為表達式使用，你 **必須** 涵蓋所有可能的情況。第一個匹配分支的值會成為整個表達式的值。如果你沒有涵蓋所有情況，編譯器會拋出錯誤。

如果你的 `when` 表達式有主題，你可以使用 `else` 分支來確保所有可能的情況都被涵蓋，但這並非強制性的。例如，如果你的主題是 `Boolean`、[`enum` 類別](enum-classes.md)、[`sealed` 類別](sealed-classes.md)，或它們的可空對應類型之一，你可以在沒有 `else` 分支的情況下涵蓋所有情況：

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
        // No else branch is needed because all cases are covered
        Bit.ZERO -> 0
        Bit.ONE -> 1
    }

    println("Random bit as number: $numericValue")
    // Random bit as number: 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-expression-subject"}

> 為了簡化 `when` 表達式並減少重複，請嘗試上下文相關解析 (目前為預覽版)。
> 如果已知預期的類型，此功能允許你在 `when` 表達式中使用 enum 條目或 sealed class 成員時省略類型名稱。
> 
> 欲了解更多資訊，請參閱 [上下文相關解析的預覽](whatsnew22.md#preview-of-context-sensitive-resolution) 或相關的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
> 
{style="tip"}

如果你的 `when` 表達式 **沒有** 主題，你 **必須** 有一個 `else` 分支，否則編譯器會拋出錯誤。當所有其他分支條件都不滿足時，`else` 分支會被求值：

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

### 使用 when 的其他方式

`when` 表達式和語句提供了不同的方式來簡化你的程式碼、處理多個條件並執行類型檢查。

透過用逗號將多個情況的條件組合在一行中，來為它們定義共同的行為： 

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

你可以使用任意表達式 (不僅是常數) 作為分支條件：

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

你可以透過 `in` 或 `!in` 關鍵字檢查一個值是否包含在 [範圍](ranges.md) 或集合中：

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

你還可以透過 `is` 或 `!is` 關鍵字檢查一個值是否為特定類型。請注意，由於 [智慧型轉型](typecasts.md#smart-casts)，你可以無需任何額外檢查即可存取該類型的成員函式和屬性。

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

你可以使用 `when` 來取代傳統的 `if`-`else if` 鏈。
如果沒有主題，分支條件就只是布林表達式。第一個條件為 `true` 的分支會執行：

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

最後，你可以使用以下語法將主題捕獲到一個變數中：

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

作為主題引入的變數其作用域僅限於 `when` 表達式或語句的本體。

### 防護條件 {id="guard-conditions-in-when-expressions"}

防護條件允許你在 `when` 表達式或語句的分支中包含一個以上的條件，使複雜的控制流更加明確和簡潔。只要有主題，你就可以使用 `when` 的防護條件。

要在分支中包含防護條件，請將其放置在主要條件之後，並以 `if` 分隔：

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
        // 僅包含主要條件的分支。
        // 當 animal 為 Dog 時呼叫 feedDog()。
        is Animal.Dog -> feedDog()
        // 包含主要條件和防護條件的分支。
        // 當 animal 為 Cat 且不是 mouseHunter 時呼叫 feedCat()。
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 如果以上條件都不匹配，則印出 "Unknown animal"
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

當有多個條件以逗號分隔時，你不能使用防護條件。例如：

```kotlin
0, 1 -> print("x == 0 or x == 1")
```

在單個 `when` 表達式或語句中，你可以組合帶有和不帶防護條件的分支。帶有防護條件的分支中的程式碼只有在主要條件和防護條件都評估為 `true` 時才會執行。如果主要條件不匹配，則防護條件不會被求值。

由於 `when` 語句不需要涵蓋所有情況，因此在不帶 `else` 分支的 `when` 語句中使用防護條件意味著如果沒有任何條件匹配，則沒有任何程式碼會被執行。

與語句不同的是，`when` 表達式必須涵蓋所有情況。如果你在不帶 `else` 分支的 `when` 表達式中使用防護條件，編譯器會要求你處理所有可能的情況，以避免執行時錯誤。

你可以在單一分支內使用布林運算子 `&&` (AND) 或 `||` (OR) 組合多個防護條件。使用圓括號將布林表達式括起來，以 [避免混淆](coding-conventions.md#guard-conditions-in-when-expression)：

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

防護條件也支援 `else if`：

```kotlin
when (animal) {
    // 檢查 `animal` 是否為 `Dog`
    is Animal.Dog -> feedDog()
    // 防護條件，檢查 `animal` 是否為 `Cat` 且不是 `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 如果以上條件都不匹配且 animal.eatsPlants 為 true，則呼叫 giveLettuce()
    else if animal.eatsPlants -> giveLettuce()
    // 如果以上條件都不匹配，則印出 "Unknown animal"
    else -> println("Unknown animal")
}
```

## For 迴圈

使用 `for` 迴圈來迭代 [集合](collections-overview.md)、[陣列](arrays.md) 或 [範圍](ranges.md)：

```kotlin
for (item in collection) print(item)
```

`for` 迴圈的本體可以是帶有花括號 `{}` 的區塊。

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

### 範圍

要迭代一個數字範圍，請使用帶有 `..` 和 `..<` 運算子的 [範圍表達式](ranges.md)：

```kotlin
fun main() {
//sampleStart
    println("閉區間範圍:")
    for (i in 1..6) {
        print(i)
    }
    // 閉區間範圍:
    // 123456
  
    println("
半開區間範圍:")
    for (i in 1..<6) {
        print(i)
    }
    // 半開區間範圍:
    // 12345
  
    println("
倒序，步長為 2:")
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 倒序，步長為 2:
    // 6420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-range"}

### 陣列

如果你想透過索引迭代陣列或列表，你可以使用 `indices` 屬性：

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

或者，你可以使用標準函式庫中的 [`.withIndex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/with-index.html) 函式：

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

### 迭代器

`for` 迴圈會迭代任何提供 [迭代器](iterators.md) 的東西。集合預設提供迭代器，而範圍和陣列會被編譯成基於索引的迴圈。

你可以透過提供一個成員或擴充函式 `iterator()` 來建立自己的迭代器，它會回傳 `Iterator<>`。`iterator()` 函式必須有一個 `next()` 函式和一個回傳 `Boolean` 的 `hasNext()` 函式。

建立類別自己的迭代器最簡單的方法是繼承 [`Iterable<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-iterable/) 介面，並覆寫已經存在的 `iterator()`、`next()` 和 `hasNext()` 函式。例如：

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

> 深入了解 [介面](interfaces.md) 和 [繼承](inheritance.md)。
> 
{style="tip"}

或者，你可以從頭建立函式。在這種情況下，在函式中加入 `operator` 關鍵字：

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

## While 迴圈

`while` 和 `do-while` 迴圈會在條件滿足時持續處理其本體。
它們之間的區別在於條件檢查的時間：

*   `while` 會檢查條件，如果條件滿足，則處理本體，然後返回到條件檢查。
*   `do-while` 會處理本體，然後檢查條件。如果條件滿足，則迴圈重複。因此，無論條件如何，`do-while` 的本體至少會執行一次。

對於 `while` 迴圈，將要檢查的條件放在圓括號 `()` 中，並將本體放在花括號 `{}` 內：

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

對於 `do-while` 迴圈，將本體放在花括號 `{}` 內，然後再將要檢查的條件放在圓括號 `()` 中：

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

## 迴圈中的 Break 和 Continue

Kotlin 支援迴圈中的傳統 `break` 和 `continue` 運算子。參閱 [回傳與跳轉](returns.md)。