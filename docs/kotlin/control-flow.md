[//]: # (title: 条件与循环)

Kotlin 为你提供了灵活的工具来控制程序的流程。使用 `if`、`when` 和循环来为你的条件定义清晰、富有表达力的逻辑。

## If 表达式

要在 Kotlin 中使用 `if`，请在圆括号 `()` 中添加要检测的条件，并在花括号 `{}` 中添加如果结果为 true 时要执行的动作。你可以使用 `else` 和 `else if` 来添加额外的分支和检测。

你也可以将 `if` 写成表达式，这允许你直接将其返回值赋值给一个变量。在这种形式下，`else` 分支是强制性的。`if` 表达式起到与在其他语言中找到的三元操作符（`condition ? then : else`）相同的目的。

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

`if` 表达式的每个分支都可以是一个代码块，在这种情况下，最后一个表达式的值将成为结果：

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

## When 表达式与语句

`when` 是一种条件表达式，它根据多个可能的值或条件来运行代码。它类似于 Java、C 及类似语言中的 `switch` 语句。`when` 会求值其实参，并按顺序将其结果与每个分支进行比较，直到某个分支条件得到满足。例如：

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

你可以将 `when` 既可以作为**表达式**使用，也可以作为**语句**使用。作为表达式，`when` 会返回一个值供你代码后续使用。作为语句，`when` 会完成一个动作，而不返回任何结果：

<table>
   <tr>
       <td>表达式</td>
       <td>语句</td>
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

其次，你可以带主题或不带主题使用 `when`。无论哪种方式，行为方式都相同。使用主题通常会使你的代码更具可读性和可维护性，因为它清晰地表明了你在检测什么。

<table>
   <tr>
       <td>带主题 <code>x</code></td>
       <td>不带主题</td>
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

你使用 `when` 的方式决定了你是否需要覆盖所有可能的分支情况。覆盖所有可能的情况被称为是 _穷尽的_。

### 语句

如果你将 `when` 用作语句，则不必覆盖所有可能的情况。在此示例中，有些情况没有被覆盖，因此任何分支都不会被触发。但是，不会发生错误：

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

就像 `if` 一样，每个分支都可以是一个代码块，并且其值是该代码块中最后一个表达式的值。

### 表达式

如果你将 `when` 用作表达式，则**必须**覆盖所有可能的情况。第一个匹配分支的值将成为整个表达式的值。如果你没有覆盖所有情况，编译器会抛出错误。

如果你的 `when` 表达式带有一个主题，你可以使用 `else` 分支来确保覆盖所有可能的情况，但这不是强制性的。例如，如果你的主题是 `Boolean`、[`enum` 类](enum-classes.md)、[`sealed` 类](sealed-classes.md)或其可空对应类型之一，你可以在没有 `else` 分支的情况下覆盖所有情况：

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

> 为了简化 `when` 表达式并减少重复，请尝试上下文敏感解析（目前处于预览阶段）。
> 此特性允许你在 `when` 表达式中，当已知预期类型时，在使用枚举条目或密封类成员时省略类型名称。
> 
> 关于更多信息，关于 [上下文敏感解析的预览](whatsnew22.md#preview-of-context-sensitive-resolution) 或相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md) 请参见。
> 
{style="tip"}

如果你的 `when` 表达式**没有**主题，你**必须**有一个 `else` 分支，否则编译器会抛出错误。当所有其他分支条件都不满足时，`else` 分支会被求值：

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

### 其他使用 when 的方式

`when` 表达式和语句提供了不同的方式来简化你的代码、处理多个条件并执行类型检测。

通过在单行中使用逗号组合多个条件：

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

使用求值为 `true` 或 `false` 的表达式作为分支条件：

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

通过 `in` 或 `!in` 关键字检测一个值是否包含在[区间](ranges.md)或集合中：

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

通过 `is` 或 `!is` 关键字检测一个值的类型。由于[智能类型转换](typecasts.md#smart-casts)，你可以直接访问该类型的成员函数和属性：

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

你可以使用 `when` 来替代传统的 `if`-`else` `if` 链。
如果没有主题，分支条件就只是布尔表达式。第一个条件为 `true` 的分支会运行：

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

最后，你可以使用以下语法将主题捕获到一个变量中：

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

作为主题引入的变量的作用域仅限于 `when` 表达式或语句的主体。

### 守卫条件 {id="guard-conditions-in-when-expressions"}

守卫条件允许你在 `when` 表达式或语句的分支中包含多个条件，从而使复杂的控制流更加显式和简洁。只要 `when` 带有主题，你就可以使用守卫条件。

要在分支中包含守卫条件，请将其放置在主条件之后，用 `if` 分隔：

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
        // 仅包含主条件的分支。
        // 当 `animal` 是 `Dog` 时调用 `feedDog()`。
        is Animal.Dog -> feedDog()
        // 同时包含主条件和守卫条件的分支。
        // 当 `animal` 是 `Cat` 且不是 `mouseHunter` 时调用 `feedCat()`。
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 如果以上条件均不匹配，则打印 "Unknown animal"
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

当你使用逗号分隔多个条件时，不能使用守卫条件。例如：

```kotlin
0, 1 -> print("x == 0 or x == 1")
```

在单个 `when` 表达式或语句中，你可以结合使用带守卫条件和不带守卫条件的分支。带守卫条件的分支中的代码只有当主条件和守卫条件都求值为 `true` 时才会运行。如果主条件不匹配，守卫条件将不会被求值。

由于 `when` 语句不必覆盖所有情况，因此在不带 `else` 分支的 `when` 语句中使用守卫条件意味着如果没有条件匹配，则任何代码都不会运行。

与语句不同，`when` 表达式必须覆盖所有情况。如果你在不带 `else` 分支的 `when` 表达式中使用守卫条件，编译器会要求你处理所有可能的情况，以避免运行时错误。

可以使用布尔操作符 `&&` (AND) 或 `||` (OR) 在单个分支中组合多个守卫条件。请使用圆括号将布尔表达式括起来以[避免混淆](coding-conventions.md#guard-conditions-in-when-expression)：

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

守卫条件也支持 `else if`：

```kotlin
when (animal) {
    // 检测 `animal` 是否为 `Dog`
    is Animal.Dog -> feedDog()
    // 守卫条件，检测 `animal` 是否为 `Cat` 且不是 `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 如果以上条件均不匹配且 animal.eatsPlants 为 true，则调用 giveLettuce()
    else if animal.eatsPlants -> giveLettuce()
    // 如果以上条件均不匹配，则打印 "Unknown animal"
    else -> println("Unknown animal")
}
```

## For 循环

使用 `for` 循环遍历[集合](collections-overview.md)、[数组](arrays.md)或[区间](ranges.md)：

```kotlin
for (item in collection) print(item)
```

`for` 循环的主体可以是一个带有花括号 `{}` 的代码块。

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

### 区间

要遍历数字[区间](ranges.md)，请使用带有 `..` 和 `..<` 操作符的[区间表达式](ranges.md)：

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

### 数组

如果你想通过索引遍历数组或 `list`，可以使用 `indices` 属性：

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

另外，你可以使用标准库中的 [`.withIndex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/with-index.html) 函数：

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

`for` 循环遍历任何提供[迭代器](iterators.md)的事物。集合默认提供迭代器，而区间和数组会被编译为基于索引的循环。

你可以通过提供一个名为 `iterator()` 的成员函数或扩展函数来创建你自己的迭代器，该函数返回一个 `Iterator<T>`。`iterator()` 函数必须拥有一个 `next()` 函数和一个返回 `Boolean` 的 `hasNext()` 函数。

为类创建自己的迭代器最简单的方法是继承 [`Iterable<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-iterable/) 接口并覆盖已有的 `iterator()`、`next()` 和 `hasNext()` 函数。例如：

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

> 了解更多关于[接口](interfaces.md)和[继承](inheritance.md)。
> 
{style="tip"}

另外，你可以从头开始创建这些函数。在这种情况下，将 `operator` 关键字添加到这些函数中：

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

## While 循环

`while` 和 `do-while` 循环在条件满足时持续处理其主体中的代码。
它们之间的区别在于条件检测的时机：

* `while` 会检测条件，如果条件满足，则处理其主体中的代码，然后返回条件检测。
* `do-while` 会处理其主体，然后检测条件。如果条件满足，循环将重复。因此，无论条件如何，`do-while` 的主体至少会运行一次。

对于 `while` 循环，将要检测的条件放置在圆括号 `()` 中，主体放置在花括号 `{}` 中：

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

对于 `do-while` 循环，首先将主体放置在花括号 `{}` 中，再放置要检测的条件在圆括号 `()` 中：

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

## 循环中的 Break 与 Continue

Kotlin 支持循环中传统的 `break` 和 `continue` 操作符。关于 [返回与跳转](returns.md) 请参见。