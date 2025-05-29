[//]: # (title: 作用域函数)

Kotlin 标准库包含一些函数，它们唯一目的是在对象的**上下文**中执行代码块。当你对一个对象调用这类函数并提供一个 [lambda 表达式](lambdas.md)时，它会形成一个临时作用域。在这个作用域中，你可以不通过对象的名称来访问它。这类函数被称为 _作用域函数_。它们有五种：[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 和 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)。

基本上，这些函数都执行相同的操作：在对象上执行一个代码块。不同之处在于该对象在块内部如何变得可用，以及整个表达式的结果是什么。

以下是使用作用域函数的典型示例：

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果不用 `let` 来编写相同的代码，你将不得不引入一个新变量，并在每次使用它时重复其名称。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

作用域函数不引入任何新的技术能力，但它们可以使你的代码更简洁、更具可读性。

由于作用域函数之间有许多相似之处，为你的用例选择正确的函数可能很棘手。选择主要取决于你的意图以及在项目中的使用一致性。下面，我们将详细描述作用域函数之间的差异及其约定。

## 函数选择

为了帮助你选择适合你目的的作用域函数，我们提供了此表，其中总结了它们之间的主要区别。

| 函数 |对象引用|返回值|是否为扩展函数|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda 结果|是|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda 结果|是|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda 结果|否：在没有上下文对象的情况下调用|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda 结果|否：将上下文对象作为参数。|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|上下文对象|是|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|上下文对象|是|

有关这些函数的详细信息将在下面的专门章节中提供。

以下是根据预期目的选择作用域函数的简要指南：

*   在非空对象上执行 lambda：`let`
*   在局部作用域中将表达式作为变量引入：`let`
*   对象配置：`apply`
*   对象配置并计算结果：`run`
*   在需要表达式的地方运行语句：非扩展 `run`
*   附加效果：`also`
*   对一个对象进行函数调用分组：`with`

不同作用域函数的使用场景重叠，因此你可以根据项目中或团队中使用的具体约定来选择使用哪些函数。

尽管作用域函数可以使你的代码更简洁，但请避免过度使用它们：这会使你的代码难以阅读并导致错误。我们还建议你避免嵌套作用域函数，并在链式调用它们时要小心，因为很容易混淆当前的上下文对象以及 `this` 或 `it` 的值。

## 区别

由于作用域函数的性质相似，因此理解它们之间的区别非常重要。
每个作用域函数之间有两个主要区别：
*   它们引用上下文对象的方式。
*   它们的返回值。

### 上下文对象：this 或 it

在传递给作用域函数的 lambda 内部，上下文对象可以通过一个简短的引用而不是其实际名称来访问。每个作用域函数使用两种方式之一来引用上下文对象：作为 lambda [接收者](lambdas.md#function-literals-with-receiver)（`this`）或作为 lambda 参数（`it`）。两者都提供相同的功能，因此我们描述了它们在不同用例中的优缺点，并提供了使用建议。

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The string's length: $length")
        //println("The string's length: ${this.length}") // does the same
    }

    // it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### this

`run`、`with` 和 `apply` 将上下文对象作为 lambda [接收者](lambdas.md#function-literals-with-receiver)（通过关键字 `this`）引用。因此，在它们的 lambda 中，对象就像在普通类函数中一样可用。

在大多数情况下，访问接收者对象的成员时可以省略 `this`，从而使代码更短。另一方面，如果省略 `this`，则可能难以区分接收者成员和外部对象或函数。因此，建议将上下文对象作为接收者（`this`）用于主要通过调用其函数或为属性赋值来操作对象成员的 lambda。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

反过来，`let` 和 `also` 将上下文对象作为 lambda [参数](lambdas.md#lambda-expression-syntax)引用。如果未指定参数名称，则通过隐式默认名称 `it` 访问对象。`it` 比 `this` 短，并且带有 `it` 的表达式通常更容易阅读。

但是，在调用对象的函数或属性时，你不能像 `this` 那样隐式地获取对象。因此，当对象主要用作函数调用的参数时，通过 `it` 访问上下文对象会更好。如果你在代码块中使用多个变量，`it` 也更好。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

以下示例演示了将上下文对象作为具有参数名 `value` 的 lambda 参数引用。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 返回值

作用域函数根据它们返回的结果而有所不同：
*   `apply` 和 `also` 返回上下文对象。
*   `let`、`run` 和 `with` 返回 lambda 结果。

你应该根据代码中接下来要执行的操作，仔细考虑你想要的返回值。这有助于你选择最佳的作用域函数。

#### 上下文对象

`apply` 和 `also` 的返回值是上下文对象本身。因此，它们可以作为_辅助步骤_（side steps）包含在调用链中：你可以继续对同一对象进行函数调用，一个接一个地链式操作。

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

它们也可以用于返回上下文对象的函数的 `return` 语句中。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Lambda 结果

`let`、`run` 和 `with` 返回 lambda 结果。因此，你可以在将结果赋值给变量、对结果进行链式操作等方面使用它们。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，你可以忽略返回值，并使用作用域函数为局部变量创建临时作用域。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 函数介绍

为了帮助你选择适合你用例的作用域函数，我们将详细描述它们并提供使用建议。从技术上讲，作用域函数在许多情况下是可以互换的，因此示例展示了它们的使用约定。

### let

-   **上下文对象**作为参数（`it`）可用。
-   **返回值为** lambda 结果。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) 可用于对调用链的结果调用一个或多个函数。例如，以下代码打印集合上两次操作的结果：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

使用 `let`，你可以重写上面的示例，这样你就不需要将列表操作的结果赋值给变量：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果传递给 `let` 的代码块包含一个以 `it` 为参数的单个函数，你可以使用方法引用（`::`）而不是 lambda 参数：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` 通常用于执行包含非空值的代码块。要对非空对象执行操作，请在其上使用[安全调用操作符 `?.`](null-safety.md#safe-call-operator)，并使用 lambda 中的操作调用 `let`。

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以使用 `let` 引入具有有限作用域的局部变量，以使你的代码更容易阅读。
要为上下文对象定义新变量，请将其名称作为 lambda 参数提供，以便可以使用它而不是默认的 `it`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### with

-   **上下文对象**作为接收者（`this`）可用。
-   **返回值为** lambda 结果。

由于 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) 不是扩展函数：上下文对象作为参数传递，但在 lambda 内部，它作为接收者（`this`）可用。

我们建议当你不需要使用返回结果时，使用 `with` 对上下文对象进行函数调用。
在代码中，`with` 可以读作 "_用这个对象，做以下事情。_"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以使用 `with` 引入一个辅助对象，其属性或函数用于计算值。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### run

-   **上下文对象**作为接收者（`this`）可用。
-   **返回值为** lambda 结果。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 的功能与 `with` 相同，但它作为扩展函数实现。因此，像 `let` 一样，你可以使用点符号在上下文对象上调用它。

当你的 lambda 既初始化对象又计算返回值时，`run` 会很有用。

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }
    
    // the same code written with let() function:
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " to port ${it.port}")
    }
//sampleEnd
    println(result)
    println(letResult)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以将 `run` 作为非扩展函数调用。`run` 的非扩展变体没有上下文对象，但它仍然返回 lambda 结果。非扩展 `run` 允许你在需要表达式的地方执行一个包含多个语句的代码块。在代码中，非扩展 `run` 可以读作 "_运行此代码块并计算结果。_"

```kotlin
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### apply

-   **上下文对象**作为接收者（`this`）可用。
-   **返回值为**对象本身。

由于 [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 返回上下文对象本身，我们建议你将其用于不返回值的代码块，并且主要操作接收者对象的成员。`apply` 最常见的用例是对象配置。此类调用可以读作 "_将以下赋值应用于对象。_"

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`apply` 的另一个用例是将 `apply` 包含在多个调用链中，以进行更复杂的处理。

### also

-   **上下文对象**作为参数（`it`）可用。
-   **返回值为**对象本身。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) 对于执行一些将上下文对象作为参数的操作很有用。当操作需要引用对象而不是其属性和函数时，或者当你不想遮蔽外部作用域的 `this` 引用时，请使用 `also`。

当你在代码中看到 `also` 时，你可以将其读作 "_并且也对该对象执行以下操作。_"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## takeIf 和 takeUnless

除了作用域函数之外，标准库还包含 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 和 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html) 函数。这些函数允许你在调用链中嵌入对对象状态的检查。

当对一个对象调用 `takeIf` 并附带一个谓词时，如果该对象满足给定谓词，则 `takeIf` 返回此对象。否则，它返回 `null`。因此，`takeIf` 是针对单个对象的过滤函数。

`takeUnless` 的逻辑与 `takeIf` 相反。当对一个对象调用 `takeUnless` 并附带一个谓词时，如果该对象满足给定谓词，则 `takeUnless` 返回 `null`。否则，它返回对象。

使用 `takeIf` 或 `takeUnless` 时，对象作为 lambda 参数（`it`）可用。

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 当在 `takeIf` 和 `takeUnless` 之后链式调用其他函数时，不要忘记执行空检查或使用安全调用（`?.`），因为它们的返回值是可空的。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 和 `takeUnless` 与作用域函数结合使用时特别有用。例如，你可以将 `takeIf` 和 `takeUnless` 与 `let` 链式调用，以在匹配给定谓词的对象上运行代码块。为此，在对象上调用 `takeIf`，然后使用安全调用（`?`）调用 `let`。对于不匹配谓词的对象，`takeIf` 返回 `null`，并且 `let` 不会被调用。

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

作为比较，下面是一个不使用 `takeIf` 或作用域函数编写相同函数的示例：

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}