---
title: 控制流
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections</a><br />
        <img src="/img/icon-4.svg" width="20" alt="Fourth step" /> <strong>Control flow (控制流)</strong><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions (函数)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes (类)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety (空安全)</a>
</p>

:::

和其他编程语言一样，Kotlin 能够根据一段代码的求值结果是否为真来做出决策。这样的代码段被称为 **条件表达式**。Kotlin 也能创建和迭代循环。

## Conditional expressions (条件表达式)

Kotlin 提供了 `if` 和 `when` 来检查条件表达式。

:::note
如果在 `if` 和 `when` 之间进行选择，我们建议使用 `when`，因为它：

* 使你的代码更易于阅读。
* 使添加另一个分支更容易。
* 减少代码中的错误。

:::

### If

要使用 `if`，请将条件表达式放在圆括号 `()` 内，如果结果为真，则将要执行的操作放在花括号 `{}` 内：

```kotlin
fun main() {

    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1

}
```

Kotlin 中没有三元运算符 `condition ? then : else`。 而是可以将 `if` 用作表达式。 如果每个操作只有一行代码，则花括号 `{}` 是可选的：

```kotlin
fun main() { 

    val a = 1
    val b = 2

    println(if (a > b) a else b) // 返回一个值: 2

}
```

### When

当你的条件表达式有多个分支时，使用 `when`。

要使用 `when`：

* 将要计算的值放在圆括号 `()` 内。
* 将分支放在花括号 `{}` 内。
* 在每个分支中使用 `->` 将每个检查与检查成功时要执行的操作分开。

`when` 可以用作语句或表达式。**语句**不返回任何内容，而是执行操作。

以下是将 `when` 用作语句的示例：

```kotlin
fun main() {

    val obj = "Hello"

    when (obj) {
        // 检查 obj 是否等于 "1"
        "1" `->` println("One")
        // 检查 obj 是否等于 "Hello"
        "Hello" `->` println("Greeting")
        // 默认语句
        else `->` println("Unknown")     
    }
    // Greeting

}
```

:::note
请注意，所有分支条件都会按顺序检查，直到满足其中一个条件。 因此，只会执行第一个合适的分支。

:::

**表达式**返回一个值，该值稍后可在你的代码中使用。

以下是将 `when` 用作表达式的示例。 `when` 表达式会立即分配给一个变量，该变量稍后与 `println()` 函数一起使用：

```kotlin
fun main() {

    val obj = "Hello"    
    
    val result = when (obj) {
        // 如果 obj 等于 "1"，则将 result 设置为 "one"
        "1" `->` "One"
        // 如果 obj 等于 "Hello"，则将 result 设置为 "Greeting"
        "Hello" `->` "Greeting"
        // 如果没有满足之前的条件，则将 result 设置为 "Unknown"
        else `->` "Unknown"
    }
    println(result)
    // Greeting

}
```

到目前为止，你所看到的 `when` 示例都有一个主题：`obj`。 但是，`when` 也可以在没有主题的情况下使用。

此示例使用**没有**主题的 `when` 表达式来检查 Boolean 表达式链：

```kotlin
fun main() {
    val trafficLightState = "Red" // 这可以是 "Green"、"Yellow" 或 "Red"

    val trafficAction = when {
        trafficLightState == "Green" `->` "Go"
        trafficLightState == "Yellow" `->` "Slow down"
        trafficLightState == "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```

但是，你可以使用 `trafficLightState` 作为主题来获得相同的代码：

```kotlin
fun main() {
    val trafficLightState = "Red" // 这可以是 "Green"、"Yellow" 或 "Red"

    val trafficAction = when (trafficLightState) {
        "Green" `->` "Go"
        "Yellow" `->` "Slow down"
        "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```

使用带有主题的 `when` 可以使你的代码更易于阅读和维护。 当你将主题与 `when` 表达式一起使用时，它还有助于 Kotlin 检查是否涵盖了所有可能的案例。 否则，如果你不将主题与 `when` 表达式一起使用，则需要提供一个 else 分支。

## Conditional expressions practice (条件表达式练习)

### Exercise 1

创建一个简单的游戏，如果掷两个骰子得到相同的数字，你就会赢。 使用 `if` 打印 `You win :)`，否则打印 `You lose :(`。

:::tip
在本练习中，你需要导入一个包，以便可以使用 `Random.nextInt()` 函数来为你提供一个随机的 `Int`。有关导入包的更多信息，请参见 [Packages and imports (包和导入)](packages)。

:::
<h3>Hint</h3>
        使用 <a href="operator-overloading#equality-and-inequality-operators">equality operator (相等运算符)</a> (`==`) 来比较骰子的结果。 
    

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // 在这里写你的代码
}
```

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    if (firstResult == secondResult)
        println("You win :)")
    else
        println("You lose :(")
}
```

### Exercise 2

使用 `when` 表达式，更新以下程序，以便在输入游戏机按钮的名称时，它会打印相应的操作。

| **Button (按钮)** | **Action (动作)**             |
|------------|------------------------|
| A          | Yes                    |
| B          | No                     |
| X          | Menu                   |
| Y          | Nothing                |
| Other      | There is no such button (没有这个按钮) |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // 在这里写你的代码
    )
}
```

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" `->` "Yes"
            "B" `->` "No"
            "X" `->` "Menu"
            "Y" `->` "Nothing"
            else `->` "There is no such button"
        }
    )
}
```

## Ranges (区间)

在讨论循环之前，了解如何构造循环迭代的区间很有用。

在 Kotlin 中创建区间最常见的方法是使用 `..` 运算符。 例如，`1..4` 等效于 `1, 2, 3, 4`。

要声明不包含结束值的区间，请使用 `..<` 运算符。 例如，`1..&lt;4` 等效于 `1, 2, 3`。

要以相反的顺序声明区间，请使用 `downTo`。 例如，`4 downTo 1` 等效于 `4, 3, 2, 1`。

要声明以非 1 的步长递增的区间，请使用 `step` 和所需的增量值。
例如，`1..5 step 2` 等效于 `1, 3, 5`。

你也可以对 `Char` 区间执行相同的操作：

* `'a'..'d'` 等效于 `'a', 'b', 'c', 'd'`
* `'z' downTo 's' step 2` 等效于 `'z', 'x', 'v', 't'`

## Loops (循环)

编程中最常见的两种循环结构是 `for` 和 `while`。 使用 `for` 迭代一系列值并执行操作。 使用 `while` 继续执行操作，直到满足特定条件。

### For

利用你新掌握的区间知识，你可以创建一个 `for` 循环来迭代数字 1 到 5，并每次打印数字。

将迭代器和区间放在带关键字 `in` 的圆括号 `()` 内。 将要完成的操作添加到花括号 `{}` 中：

```kotlin
fun main() {

    for (number in 1..5) { 
        // number 是迭代器，1..5 是区间
        print(number)
    }
    // 12345

}
```

循环也可以迭代集合：

```kotlin
fun main() { 

    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!

}
```

### While

`while` 可以通过两种方式使用：

  * 当条件表达式为真时，执行代码块。 (`while`)
  * 首先执行代码块，然后检查条件表达式。 (`do-while`)

在第一种用例中 (`while`)：

* 在圆括号 `()` 内声明 while 循环继续的条件表达式。
* 将要完成的操作添加到花括号 `{}` 中。

以下示例使用 [increment operator (递增运算符)](operator-overloading#increments-and-decrements) `++` 来递增 `cakesEaten` 变量的值。

:::

```kotlin
fun main() {

    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake

}
```

在第二种用例中 (`do-while`)：

* 在圆括号 `()` 内声明 while 循环继续的条件表达式。
* 使用关键字 `do` 定义要在花括号 `{}` 中完成的操作。

```kotlin
fun main() {

    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    do {
        println("Bake a cake")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // Eat a cake
    // Eat a cake
    // Eat a cake
    // Bake a cake
    // Bake a cake
    // Bake a cake

}
```

有关条件表达式和循环的更多信息和示例，请参见 [Conditions and loops (条件和循环)](control-flow)。

现在你已经了解了 Kotlin 控制流的基础知识，是时候学习如何编写自己的 [functions (函数)](kotlin-tour-functions)了。

## Loops practice (循环练习)

### Exercise 1

你有一个程序，用于计算披萨片，直到有 8 片的完整披萨。 通过以下两种方式重构此程序：

* 使用 `while` 循环。
* 使用 `do-while` 循环。

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // 从这里开始重构
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    // 在这里结束重构
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("There's only $pizzaSlices slice/s of pizza :(")
    }
    pizzaSlices++
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("There's only $pizzaSlices slice/s of pizza :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}

```

### Exercise 2

编写一个模拟 [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 游戏。 你的任务是以递增的方式打印从 1 到 100 的数字，将任何能被 3 整除的数字替换为单词 "fizz"，并将任何能被 5 整除的数字替换为单词 "buzz"。 任何能同时被 3 和 5 整除的数字都必须替换为单词 "fizzbuzz"。
<h3>Hint 1</h3>
        使用 `for` 循环来计数数字，并使用 `when` 表达式来决定每一步要打印的内容。
<h3>Hint 2</h3>
        使用取模运算符 (`%`) 返回数字被除后的余数。 使用 <a href="operator-overloading#equality-and-inequality-operators">equality operator (相等运算符)</a> 
        (`==`) 检查余数是否等于零。
    

|---|---|
```kotlin
fun main() {
    // 在这里写你的代码
}
```

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 `->` "fizzbuzz"
                number % 3 == 0 `->` "fizz"
                number % 5 == 0 `->` "buzz"
                else `->` "$number"
            }
        )
    }
}
```

### Exercise 3

你有一个单词列表。 使用 `for` 和 `if` 仅打印以字母 `l` 开头的单词。
<h3>Hint</h3>
        使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> `.startsWith()`
        </a> 函数用于 `String` 类型。
    

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // 在这里写你的代码
}
```

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}
```

## Next step (下一步)

[Functions (函数)](kotlin-tour-functions)