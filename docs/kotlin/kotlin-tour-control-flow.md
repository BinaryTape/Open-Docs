[//]: # (title: 控制流)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4.svg" width="20" alt="第四步" /> <strong>控制流</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最后一步" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

与其他编程语言一样，Kotlin 能够根据代码求值结果是否为 true 来做出决策。这类代码称为**条件表达式**。Kotlin 也能够创建循环并进行迭代。

## 条件表达式

Kotlin 提供 `if` 和 `when` 用于检测条件表达式。

> 如果在 `if` 和 `when` 之间选择，我们推荐使用 `when`，因为它：
>
> *   让你的代码更易读。
> *   更容易添加新的分支。
> *   能减少代码中的错误。
>
{style="note"}

### If

使用 `if` 时，将条件表达式放在圆括号 `()` 中，将结果为 true 时要执行的动作放在花括号 `{}` 中：

```kotlin
fun main() {
//sampleStart
    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if"}

Kotlin 中没有三元操作符 `condition ? then : else`。相反，`if` 可以用作表达式。如果每个动作只有一行代码，花括号 `{}` 是可选的：

```kotlin
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // 返回值：2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

当条件表达式有多个分支时，请使用 `when`。

使用 `when`：

*   将要求值的值放在圆括号 `()` 中。
*   将分支放在花括号 `{}` 中。
*   在每个分支中使用 `->` 将每个检测与检测成功时要执行的动作分开。

`when` 可以用作语句或表达式。**语句**不返回任何值，而是执行动作。

以下是 `when` 用作语句的示例：

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // 检测 obj 是否等于 "1"
        "1" -> println("One")
        // 检测 obj 是否等于 "Hello"
        "Hello" -> println("Greeting")
        // 默认语句
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> 请注意，所有分支条件都会按顺序检测，直到其中一个满足为止。因此，只有第一个合适的（满足条件的）分支会被执行。
>
{style="note"}

**表达式**返回一个值，该值可以在代码中稍后使用。

以下是 `when` 用作表达式的示例。`when` 表达式会立即赋值给一个变量，该变量稍后与 `println()` 函数一起使用：

```kotlin
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // 如果 obj 等于 "1"，则将 result 设置为 "one"
        "1" -> "One"
        // 如果 obj 等于 "Hello"，则将 result 设置为 "Greeting"
        "Hello" -> "Greeting"
        // 如果没有条件满足，则将 result 设置为 "Unknown"
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

你目前看到的 `when` 示例都有一个主题：`obj`。但是 `when` 也可以不带主题使用。

此示例使用**不带**主题的 `when` 表达式来检测一系列布尔表达式：

```kotlin
fun main() {
    val trafficLightState = "Red" // 这可以是 "Green"、"Yellow" 或 "Red"

    val trafficAction = when {
        trafficLightState == "Green" -> "Go"
        trafficLightState == "Yellow" -> "Slow down"
        trafficLightState == "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean"}

但是，你也可以使用相同代码，但将 `trafficLightState` 作为主题：

```kotlin
fun main() {
    val trafficLightState = "Red" // 这可以是 "Green"、"Yellow" 或 "Red"

    val trafficAction = when (trafficLightState) {
        "Green" -> "Go"
        "Yellow" -> "Slow down"
        "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean-subject"}

使用带主题的 `when` 能让你的代码更易读和维护。当你在 `when` 表达式中使用主题时，它也有助于 Kotlin 检测是否涵盖了所有可能的情况。否则，如果你在 `when` 表达式中不使用主题，就需要提供一个 else 分支。

## 条件表达式练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

创建一个简单的游戏，如果掷出两个骰子结果相同则获胜。使用 `if` 打印 `You win :)`（如果骰子匹配），否则打印 `You lose :(`。

> 在此练习中，你将导入一个包，以便使用 `Random.nextInt()` 函数获取随机的 `Int` 类型整数。关于导入包的更多信息，请参见 [包与导入](packages.md)。
>
{style="tip"}

<deflist collapsible="true">
    <def title="提示">
        使用 <a href="operator-overloading.md#equality-and-inequality-operators">相等操作符</a> (<code>==</code>) 比较骰子结果。
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // 在这里编写你的代码
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-control-flow-conditional-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-2"}

使用 `when` 表达式，更新以下程序，使其在输入游戏机按钮名称时打印出对应的动作。

| **按钮** | **动作**             |
|------------|------------------------|
| A          | 是                    |
| B          | 否                     |
| X          | 菜单                   |
| Y          | 无                |
| 其他      | 没有这个按钮 |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // 在这里编写你的代码
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-2"}

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "There is no such button"
        }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-control-flow-conditional-solution-2"}

## 区间

在讨论循环之前，了解如何构造用于循环迭代的区间会很有用。

在 Kotlin 中创建区间最常见的方式是使用 `..` 操作符。例如，`1..4` 等同于 `1, 2, 3, 4`。

要声明一个不包含结束值的区间，请使用 `..<` 操作符。例如，`1..<4` 等同于 `1, 2, 3`。

要声明一个倒序区间，请使用 `downTo`。例如，`4 downTo 1` 等同于 `4, 3, 2, 1`。

要声明一个以不为 1 的步长递增的区间，请使用 `step` 和你想要的递增值。
例如，`1..5 step 2` 等同于 `1, 3, 5`。

你也可以对 `Char` 区间执行相同的操作：

*   `'a'..'d'` 等同于 `'a', 'b', 'c', 'd'`
*   `'z' downTo 's' step 2` 等同于 `'z', 'x', 'v', 't'`

## 循环

编程中最常见的两种循环结构是 `for` 和 `while`。使用 `for` 来迭代值区间并执行一个动作。使用 `while` 来持续执行一个动作，直到某个特定条件满足为止。

### For

利用你关于区间的知识，你可以创建一个 `for` 循环，该循环迭代 1 到 5 的数字，并每次打印该数字。

将迭代器和区间放在圆括号 `()` 中，并使用关键词 `in`。将你想要完成的动作放在花括号 `{}` 中：

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) { 
        // number 是迭代器，1..5 是区间
        print(number)
    }
    // 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

集合也可以通过循环迭代：

```kotlin
fun main() { 
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // 美味，这是一个胡萝卜蛋糕！
    // 美味，这是一个芝士蛋糕！
    // 美味，这是一个巧克力蛋糕！
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### While

`while` 可以用两种方式使用：

*   在条件表达式为 true 时执行代码块。(`while`)
*   先执行代码块，然后检测条件表达式。(`do-while`)

在第一种用法 (`while`) 中：

*   将 `while` 循环要继续执行的条件表达式声明在圆括号 `()` 中。
*   将你想要完成的动作放在花括号 `{}` 中。

> 以下示例使用[递增操作符](operator-overloading.md#increments-and-decrements) `++` 来递增 `cakesEaten` 变量的值。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-loop"}

在第二种用法 (`do-while`) 中：

*   将 `while` 循环要继续执行的条件表达式声明在圆括号 `()` 中。
*   使用关键词 `do` 在花括号 `{}` 中定义你想要完成的动作。

```kotlin
fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-do-loop"}

关于条件表达式和循环的更多信息和示例，请参见 [条件与循环](control-flow.md)。

既然你已经了解了 Kotlin 控制流的基础知识，现在是时候学习如何编写自己的[函数](kotlin-tour-functions.md)了。

## 循环练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

你有一个程序，它计算披萨片数，直到有一个完整的 8 片披萨。用两种方式重构这个程序：

*   使用 `while` 循环。
*   使用 `do-while` 循环。

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // 在这里开始重构
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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 1" id="kotlin-tour-control-flow-loops-exercise-1-solution-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 2" id="kotlin-tour-control-flow-loops-exercise-1-solution-2"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-2"}

编写一个程序来模拟 [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 游戏。你的任务是递增地打印从 1 到 100 的数字，将任何可被三整除的数字替换为单词 "fizz"，将任何可被五整除的数字替换为单词 "buzz"。任何同时可被 3 和 5 整除的数字都必须替换为单词 "fizzbuzz"。

<deflist collapsible="true">
    <def title="提示 1">
        使用 <code>for</code> 循环来计数，并使用 <code>when</code> 表达式来决定每一步要打印什么。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        使用取模操作符 (<code>%</code>) 返回数字除法后的余数。使用 <a href="operator-overloading.md#equality-and-inequality-operators">相等操作符</a> (<code>==</code>) 来检测余数是否为零。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // 在这里编写你的代码
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-2"}

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> "$number"
            }
        )
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-control-flow-loops-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-3"}

你有一个单词列表。使用 `for` 和 `if` 只打印以字母 `l` 开头的单词。

<deflist collapsible="true">
    <def title="提示">
        使用 <code>String</code> 类型的 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code></a> 函数。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // 在这里编写你的代码
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-3"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-control-flow-loops-solution-3"}

## 下一步

[函数](kotlin-tour-functions.md)