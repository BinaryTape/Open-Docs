[//]: # (title: 作用域函数)

Kotlin 标准库包含几个函数，其唯一目的是在对象的上下文中执行代码块。当你在提供了 [lambda表达式](lambdas.md) 的对象上调用此类函数时，它会形成一个临时作用域。在此作用域内，无需名称即可访问该对象。此类函数称为*作用域函数*。共有五个：[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 和 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)。

基本上，这些函数都执行相同的操作：在对象上执行代码块。不同之处在于该对象在块内的可用方式以及整个表达式的结果。

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

如果不使用 `let` 编写相同的代码，则必须引入一个新变量，并在每次使用该变量时重复其名称。

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

作用域函数没有引入任何新的技术能力，但它们可以使你的代码更加简洁且易读。

由于作用域函数之间存在许多相似之处，为你的用例选择正确的函数可能会比较棘手。选择主要取决于你的意图以及项目中用法的一致性。下面，我们将详细说明作用域函数之间的差异及其约定。

## 函数选择

为了帮助你根据目的选择正确的作用域函数，我们提供了下表，总结了它们之间的关键差异。

| 函数 | 对象引用 | 返回值 | 是否为扩展函数 |
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) | `it` | Lambda 结果 | 是 |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | `this` | Lambda 结果 | 是 |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | - | Lambda 结果 | 否：不带上下文对象调用 |
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) | `this` | Lambda 结果 | 否：将上下文对象作为实参接收 |
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) | `this` | 上下文对象 | 是 |
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) | `it` | 上下文对象 | 是 |

有关这些函数的详细信息，请参阅下文的专门章节。

以下是根据预期用途选择作用域函数的简短指南：

* 在非空对象上执行 lambda：`let`
* 将表达式作为局部作用域中的变量引入：`let`
* 对象配置：`apply`
* 对象配置并计算结果：`run`
* 在需要表达式的地方运行语句：非扩展 `run`
* 附加效果：`also`
* 对一个对象上的函数调用进行分组：`with`

不同作用域函数的用例有所重叠，因此你可以根据项目或团队中使用的特定约定来选择使用哪些函数。

虽然作用域函数可以让你的代码更加简洁，但请避免过度使用：这可能会使代码难以阅读并导致错误。我们还建议你避免嵌套作用域函数，并在链式调用时保持谨慎，因为很容易混淆当前的上下文对象以及 `this` 或 `it` 的值。

## 区别

由于作用域函数在性质上非常相似，理解它们之间的区别至关重要。每个作用域函数之间主要有两个区别：
* 引用上下文对象的方式。
* 它们的返回值。

### 上下文对象：this 或 it

在传递给作用域函数的 lambda 内，可以通过简短的引用而不是其实际名称来访问上下文对象。每个作用域函数都使用两种方式之一来引用上下文对象：作为 lambda [接收者](lambdas.md#function-literals-with-receiver) (`this`) 或作为 lambda 实参 (`it`)。两者都提供相同的功能，因此我们描述了每种方式在不同用例下的优缺点，并提供了使用建议。

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("字符串长度：$length")
        //println("字符串长度：${this.length}") // 效果相同
    }

    // it
    str.let {
        println("字符串长度是 ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### this

`run`、`with` 和 `apply` 将上下文对象引用为 lambda [接收者](lambdas.md#function-literals-with-receiver) —— 通过关键字 `this`。因此，在它们的 lambda 中，该对象可以像在普通类函数中一样使用。

在大多数情况下，访问接收者对象的成员时可以省略 `this`，从而使代码更短。另一方面，如果省略了 `this`，可能难以区分接收者成员与外部对象或函数。因此，对于主要通过调用对象函数或为属性赋值来操作对象成员的 lambda，建议将上下文对象作为接收者 (`this`)。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // 与 this.age = 20 相同
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

反过来，`let` 和 `also` 将上下文对象引用为 lambda [实参](lambdas.md#lambda-expression-syntax)。如果未指定实参名称，则通过隐式默认名称 `it` 访问该对象。`it` 比 `this` 更短，带有 `it` 的表达式通常更容易阅读。

但是，在调用对象的函数或属性时，你不能像使用 `this` 那样隐式地访问该对象。因此，当对象主要在函数调用中作为实参使用时，通过 `it` 访问上下文对象会更好。如果你在代码块中使用多个变量，使用 `it` 也会更好。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() 生成了值 $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

下面的示例演示了通过实参名称 `value` 将上下文对象引用为 lambda 实参。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() 生成了值 $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 返回值

作用域函数的不同之处还在于它们返回的结果：
* `apply` 和 `also` 返回上下文对象。
* `let`、`run` 和 `with` 返回 lambda 结果。

你应该根据代码中接下来的操作仔细考虑需要哪种返回值。这有助于你选择最合适的作用域函数。

#### 上下文对象 

`apply` 和 `also` 的返回值是上下文对象本身。因此，它们可以作为*辅助步骤*包含在调用链中：你可以继续链式调用同一个对象的函数，一个接一个。

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("正在填充列表") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("正在排序列表") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

它们也可以用于返回上下文对象的函数的 return 语句中。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() 生成了值 $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Lambda 结果

`let`、`run` 和 `with` 返回 lambda 结果。因此，你可以在将结果赋值给变量、对结果链式执行操作等场景中使用它们。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("有 $countEndsWithE 个以 e 结尾的元素。")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，你还可以忽略返回值，并使用作用域函数为局部变量创建一个临时作用域。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("第一个元素：$firstItem，最后一个元素：$lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 函数

为了帮助你为用例选择正确的作用域函数，我们对它们进行了详细说明，并提供了使用建议。从技术上讲，作用域函数在许多情况下是可以互换的，因此这些示例展示了使用它们的约定。

### let

- **上下文对象**作为实参 (`it`) 可用。
- **返回值**是 lambda 结果。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) 可用于对调用链的结果调用一个或多个函数。例如，以下代码打印了对一个集合进行两次操作的结果：

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

使用 `let`，你可以重写上述示例，从而无需将列表操作的结果赋值给变量：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // 如果需要，还可以调用更多函数
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果传递给 `let` 的代码块包含单个以 `it` 为实参的函数，则可以使用方法引用 (`::`) 代替 lambda 实参：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` 经常用于执行包含非空值的代码块。要对可空对象执行操作，请在其上使用[安全调用运算符 `?.`](null-safety.md#safe-call-operator) 并在其 lambda 中调用 `let` 以执行操作。

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // 编译错误：str 可能为 null
    val length = str?.let { 
        println("在 $it 上调用了 let()")        
        processNonNullString(it)      // 正常：在 '?.let { }' 内部 'it' 不为 null
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以使用 `let` 引入作用域受限的局部变量，以使代码更易读。要为上下文对象定义一个新变量，请提供其名称作为 lambda 实参，以便可以使用该名称代替默认的 `it`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("列表的第一个元素是 '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("修改后的第一个元素：'$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### with

- **上下文对象**作为接收者 (`this`) 可用。
- **返回值**是 lambda 结果。

由于 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) 不是扩展函数：上下文对象作为实参传递，但在 lambda 内部，它可以作为接收者 (`this`) 使用。

我们建议在不需要使用返回结果时，使用 `with` 调用上下文对象上的函数。在代码中，`with` 可以理解为“*使用这个对象，执行以下操作。*”

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' 调用时带有实参 $this")
        println("它包含 $size 个元素")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以使用 `with` 引入一个辅助对象，其属性或函数将用于计算一个值。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "第一个元素是 ${first()}," +
        " 最后一个元素是 ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### run

- **上下文对象**作为接收者 (`this`) 可用。 
- **返回值**是 lambda 结果。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 的作用与 `with` 相同，但它是作为扩展函数实现的。因此，与 `let` 类似，你可以使用点表示法在上下文对象上调用它。

当你的 lambda 既初始化对象又计算返回值时，`run` 非常有用。

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
    
    // 使用 let() 函数编写的相同代码：
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

你还可以将 `run` 作为非扩展函数调用。非扩展变体的 `run` 没有上下文对象，但它仍然返回 lambda 结果。非扩展 `run` 允许你在需要表达式的地方执行包含多个语句的代码块。在代码中，非扩展 `run` 可以理解为“*运行该代码块并计算结果。*”

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

- **上下文对象**作为接收者 (`this`) 可用。 
- **返回值**是对象本身。

由于 [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 返回上下文对象本身，我们建议将其用于不返回值且主要操作接收者对象成员的代码块。`apply` 最常见的用例是进行对象配置。此类调用可以理解为“*将以下赋值操作应用于该对象。*”

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

- **上下文对象**作为实参 (`it`) 可用。 
- **返回值**是对象本身。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) 对于执行一些将上下文对象作为实参的操作非常有用。对于需要引用对象本身而不是其属性和函数，或者当你不想遮蔽外部作用域的 `this` 引用时，请使用 `also`。

当你在代码中看到 `also` 时，可以将其理解为“*并且还对该对象执行以下操作。*”

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("添加新元素前的列表元素：$it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## takeIf 和 takeUnless

除了作用域函数外，标准库还包含 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 和 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html) 函数。这些函数允许你在调用链中嵌入对对象状态的检查。

当在对象上调用并配合谓词使用时，如果对象满足给定的谓词，则 `takeIf` 返回该对象。否则，它返回 `null`。因此，`takeIf` 是针对单个对象的过滤函数。

`takeUnless` 的逻辑与 `takeIf` 相反。当在对象上调用并配合谓词使用时，如果对象满足给定的谓词，则 `takeUnless` 返回 `null`。否则，它返回该对象。

使用 `takeIf` 或 `takeUnless` 时，对象作为 lambda 实参 (`it`) 可用。

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

> 在 `takeIf` 和 `takeUnless` 之后链接其他函数时，不要忘记执行 null 检查或使用安全调用 (`?.`)，因为它们的返回值是可空的。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //编译错误
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 和 `takeUnless` 与作用域函数结合使用时特别有用。例如，你可以将 `takeIf` 和 `takeUnless` 与 `let` 链式调用，以便在符合给定谓词的对象上运行代码块。为此，请在对象上调用 `takeIf`，然后通过安全调用 (`?`) 调用 `let`。对于不符合谓词的对象，`takeIf` 返回 `null`，而 `let` 不会被调用。

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("在 $input 中找到了子字符串 $sub。")
            println("它的起始位置是 $it。")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

作为对比，以下是不使用 `takeIf` 或作用域函数编写相同函数的示例：

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("在 $input 中找到了子字符串 $sub。")
            println("它的起始位置是 $index。")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}