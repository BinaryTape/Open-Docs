[//]: # (title: 控制流)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>控制流</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

与其他编程语言一样，Kotlin 能够根据一段代码的求值结果是否为真来做出决策。这类代码称为**条件表达式**。Kotlin 还能够创建和遍历循环。

## 条件表达式

Kotlin 提供了 `if` 和 `when` 来检查条件表达式。

> 如果你必须在 `if` 和 `when` 之间做出选择，我们推荐使用 `when`，因为它：
>
> *   使你的代码更易读。
> *   使其更容易添加另一个分支。
> *   减少代码中的错误。
>
{style="note"}

### if

要使用 `if`，请将条件表达式放在括号 `()` 内，并将当结果为真时要执行的操作放在大括号 `{}` 内：

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

Kotlin 中没有三元运算符 `condition ? then : else`。相反，`if` 可以用作表达式。如果每个操作只有一行代码，则大括号 `{}` 是可选的：

```kotlin
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // Returns a value: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### when

当你的条件表达式有多个分支时，使用 `when`。

要使用 `when`：

*   将你要评估的值放在括号 `()` 内。
*   将分支放在大括号 `{}` 内。
*   在每个分支中使用 `->` 来分隔每个检查和当检查成功时要执行的操作。

`when` 既可以用作语句，也可以用作表达式。**语句**不返回任何内容，而是执行操作。

以下是使用 `when` 作为语句的示例：

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // Checks whether obj equals to "1"
        "1" -> println("One")
        // Checks whether obj equals to "Hello"
        "Hello" -> println("Greeting")
        // Default statement
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> 请注意，所有分支条件都按顺序检查，直到其中一个被满足。因此，只有第一个合适的分支会被执行。
>
{style="note"}

**表达式**返回一个值，该值可以在你的代码中稍后使用。

以下是使用 `when` 作为表达式的示例。该 `when` 表达式会立即赋值给一个变量，该变量随后与 `println()` 函数一起使用：

```kotlin
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // If obj equals "1", sets result to "one"
        "1" -> "One"
        // If obj equals "Hello", sets result to "Greeting"
        "Hello" -> "Greeting"
        // Sets result to "Unknown" if no previous condition is satisfied
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

到目前为止你所看到的 `when` 示例都带有一个主题：`obj`。但 `when` 也可以不带主题使用。

此示例使用**不带**主题的 `when` 表达式来检查一系列布尔表达式：

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

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

但是，你可以编写相同的代码，只是将 `trafficLightState` 作为主题：

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

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

带主题使用 `when` 可以使你的代码更易读和维护。当你在 `when` 表达式中使用主题时，它还有助于 Kotlin 检查是否涵盖了所有可能的情况。否则，如果你在 `when` 表达式中不使用主题，你需要提供一个 else 分支。

## 条件表达式实践

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

创建一个简单的游戏，如果你掷两个骰子得到相同的数字，你就赢了。如果骰子匹配，使用 `if` 打印 `You win :)`，否则打印 `You lose :(`。

> 在本练习中，你将导入一个包，以便使用 `Random.nextInt()` 函数来获取一个随机的 `Int`。有关导入包的更多信息，请参阅[包和导入](packages.md)。
>
{style="tip"}

<deflist collapsible="true">
    <def title="提示">
        使用<a href="operator-overloading.md#equality-and-inequality-operators">相等运算符</a> (<code>==</code>) 来比较骰子结果。
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // Write your code here
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

使用 `when` 表达式，更新以下程序，使其在输入游戏机按钮名称时打印相应的操作。

| **按钮** | **操作** |
|------------|------------------------|
| A          | 是                     |
| B          | 否                     |
| X          | 菜单                   |
| Y          | 无                     |
| 其他      | 没有此按钮             |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // Write your code here
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

在讨论循环之前，了解如何构造供循环迭代的区间是很有用的。

在 Kotlin 中创建区间最常见的方式是使用 `..` 运算符。例如，`1..4` 等效于 `1, 2, 3, 4`。

要声明不包含结束值的区间，请使用 `..<` 运算符。例如，`1..<4` 等效于 `1, 2, 3`。

要声明倒序区间，请使用 `downTo`。例如，`4 downTo 1` 等效于 `4, 3, 2, 1`。

要声明以非 1 步长递增的区间，请使用 `step` 和你想要的递增值。例如，`1..5 step 2` 等效于 `1, 3, 5`。

你也可以对 `Char` 区间执行相同操作：

*   `'a'..'d'` 等效于 `'a', 'b', 'c', 'd'`
*   `'z' downTo 's' step 2` 等效于 `'z', 'x', 'v', 't'`

## 循环

编程中最常见的两种循环结构是 `for` 和 `while`。使用 `for` 来迭代一系列值并执行操作。使用 `while` 来持续执行一个操作直到满足特定条件。

### for

利用你新学到的区间知识，你可以创建一个 `for` 循环，该循环迭代数字 1 到 5 并每次打印该数字。

将迭代器和区间放在括号 `()` 内，并带上关键字 `in`。将你要完成的操作放在大括号 `{}` 内：

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

集合也可以通过循环进行迭代：

```kotlin
fun main() { 
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### while

`while` 可以通过两种方式使用：

*   在条件表达式为真时执行代码块。 (`while`)
*   先执行代码块，然后检查条件表达式。 (`do-while`)

在第一种用法 (`while`) 中：

*   将 `while` 循环继续执行的条件表达式声明在括号 `()` 内。
*   将你要完成的操作放在大括号 `{}` 内。

> 以下示例使用[递增运算符](operator-overloading.md#increments-and-decrements) `++` 来递增 `cakesEaten` 变量的值。
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

*   将 `while` 循环继续执行的条件表达式声明在括号 `()` 内。
*   使用关键字 `do` 在大括号 `{}` 内定义你要完成的操作。

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

有关条件表达式和循环的更多信息和示例，请参阅[条件和循环](control-flow.md)。

现在你已经了解了 Kotlin 控制流的基础知识，是时候学习如何编写自己的[函数](kotlin-tour-functions.md)了。

## 循环实践

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

你有一个程序，用于计算披萨片数，直到有 8 片的完整披萨。以两种方式重构此程序：

*   使用 `while` 循环。
*   使用 `do-while` 循环。

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // Start refactoring here
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
    // End refactoring here
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

编写一个程序来模拟 [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 游戏。你的任务是递增打印从 1 到 100 的数字，将任何能被三整除的数字替换为单词 "fizz"，将任何能被五整除的数字替换为单词 "buzz"。任何同时能被 3 和 5 整除的数字必须替换为单词 "fizzbuzz"。

<deflist collapsible="true">
    <def title="提示 1">
        使用 <code>for</code> 循环计数并使用 <code>when</code> 表达式来决定每一步打印什么。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        使用模运算符 (<code>%</code>) 返回数字相除的余数。使用<a href="operator-overloading.md#equality-and-inequality-operators">相等运算符</a> (<code>==</code>) 来检查余数是否为零。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // Write your code here
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
        对 <code>String</code> 类型使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code> </a> 函数。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // Write your code here
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