---
title: 作用域函数
---
Kotlin 标准库包含几个函数，它们的唯一目的是在对象的上下文中执行代码块。当你使用提供的 [lambda 表达式](lambdas) 在对象上调用此类函数时，它会形成一个临时作用域。在此作用域中，你可以访问该对象而无需使用其名称。这些函数称为_作用域函数_。有五个这样的函数：[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 和 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)。

基本上，这些函数都执行相同的操作：在对象上执行代码块。不同之处在于此对象如何在代码块内可用，以及整个表达式的结果是什么。

以下是使用作用域函数的典型示例：

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }

}
```

如果不使用 `let` 编写相同的代码，则必须引入一个新变量，并在每次使用它时重复其名称。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)

}
```

作用域函数不会引入任何新的技术功能，但它们可以使你的代码更简洁和易读。

由于作用域函数之间存在许多相似之处，因此为你的用例选择正确的作用域函数可能会很棘手。选择主要取决于你的意图以及项目中用法的一致性。下面，我们提供了作用域函数之间的差异及其约定的详细描述。

## 函数选择

为了帮助你为你的目的选择正确的作用域函数，我们提供了此表，其中总结了它们之间的主要区别。

| 函数 | 对象引用 | 返回值 | 是否为扩展函数 |
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) | `it` | Lambda 结果 | 是 |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | `this` | Lambda 结果 | 是 |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | - | Lambda 结果 | 否：在没有上下文对象的情况下调用 |
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) | `this` | Lambda 结果 | 否：将上下文对象作为参数。 |
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) | `this` | 上下文对象 | 是 |
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) | `it` | 上下文对象 | 是 |

有关这些函数的详细信息，请参见下面的专用章节。

这是一个根据预期用途选择作用域函数的简短指南：

* 在不可为空的对象上执行 lambda：`let`
* 将表达式作为局部范围中的变量引入：`let`
* 对象配置：`apply`
* 对象配置和计算结果：`run`
* 运行需要表达式的语句：非扩展 `run`
* 附加效果：`also`
* 对对象进行分组函数调用：`with`

不同作用域函数的使用场景重叠，因此你可以根据项目中或团队中使用的特定约定来选择要使用的函数。

尽管作用域函数可以使你的代码更简洁，但请避免过度使用它们：这可能会使你的代码难以阅读并导致错误。我们还建议你避免嵌套作用域函数，并在链接它们时要小心，因为很容易对当前上下文对象和 `this` 或 `it` 的值感到困惑。

## 区别

由于作用域函数本质上相似，因此了解它们之间的区别很重要。每个作用域函数之间有两个主要区别：
* 它们引用上下文对象的方式。
* 它们的返回值。

### 上下文对象：this 或 it

在传递给作用域函数的 lambda 内部，上下文对象通过简短的引用而不是其实际名称来访问。每个作用域函数使用两种方式之一来引用上下文对象：作为 lambda [接收者](lambdas#function-literals-with-receiver) (`this`) 或作为 lambda 参数 (`it`)。两者都提供相同的功能，因此我们描述了每种方式在不同用例中的优缺点，并提供了使用建议。

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

#### this

`run`、`with` 和 `apply` 将上下文对象引用为 lambda [接收者](lambdas#function-literals-with-receiver) - 通过关键字 `this`。因此，在它们的 lambda 中，该对象就像在普通的类函数中一样可用。

在大多数情况下，你可以在访问接收者对象的成员时省略 `this`，从而使代码更短。另一方面，如果省略 `this`，则可能难以区分接收者成员和外部对象或函数。因此，建议将上下文对象作为接收者 (`this`) 用于主要通过调用其函数或将值分配给属性来操作对象成员的 lambda。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)

}
```

#### it

反过来，`let` 和 `also` 将上下文对象引用为 lambda [参数](lambdas#lambda-expression-syntax)。如果未指定参数名称，则通过隐式默认名称 `it` 访问该对象。 `it` 比 `this` 短，并且带有 `it` 的表达式通常更容易阅读。

但是，在调用对象的函数或属性时，你没有像 `this` 那样隐式可用的对象。因此，当对象主要用作函数调用中的参数时，最好通过 `it` 访问上下文对象。如果你在代码块中使用多个变量，`it` 也会更好。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

下面的示例演示了使用参数名称 `value` 将上下文对象作为 lambda 参数引用。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value `->`
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

### 返回值

作用域函数因其返回的结果而异：
* `apply` 和 `also` 返回上下文对象。
* `let`、`run` 和 `with` 返回 lambda 结果。

你应该根据你接下来要在代码中执行的操作仔细考虑你想要的返回值。这有助于你选择要使用的最佳作用域函数。

#### 上下文对象

`apply` 和 `also` 的返回值是上下文对象本身。因此，可以将它们作为_副作用_包含到调用链中：你可以继续在同一对象上一个接一个地链接函数调用。

```kotlin
fun main() {

    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()

    println(numberList)
}
```

它们也可以用于返回上下文对象的函数的 `return` 语句中。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()

}
```

#### Lambda 结果

`let`、`run` 和 `with` 返回 lambda 结果。因此，你可以在将结果分配给变量、链接对结果的操作等情况下使用它们。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")

}
```

此外，你可以忽略返回值，并使用作用域函数为局部变量创建临时作用域。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }

}
```

## 函数

为了帮助你为你的用例选择正确的作用域函数，我们详细描述了它们并提供了使用建议。从技术上讲，作用域函数在许多情况下是可互换的，因此这些示例显示了使用它们的约定。

### let

- **上下文对象**作为参数 (`it`) 可用。
- **返回值**是 lambda 结果。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) 可用于在调用链的结果上调用一个或多个函数。例如，以下代码打印对集合的两个操作的结果：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    

}
```

使用 `let`，你可以重写上面的示例，这样你就不会将列表操作的结果分配给变量：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 

}
```

如果传递给 `let` 的代码块包含一个以 `it` 作为参数的函数，则可以使用方法引用 (`::`) 代替 lambda 参数：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)

}
```

`let` 通常用于执行包含非空值的代码块。要在非空对象上执行操作，请对其使用 [安全调用运算符 `?.`](null-safety#safe-call-operator) 并在其 lambda 中调用带有操作的 `let`。

```kotlin
fun processNonNullString(str: String) {}

fun main() {

    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }

}
```

你还可以使用 `let` 引入范围有限的局部变量，以使你的代码更易于阅读。要为上下文对象定义一个新变量，请将其名称作为 lambda 参数提供，以便可以使用它代替默认的 `it`。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem `->`
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")

}
```

### with

- **上下文对象**作为接收者 (`this`) 可用。
- **返回值**是 lambda 结果。

由于 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) 不是扩展函数：上下文对象作为参数传递，但在 lambda 内部，它作为接收者 (`this`) 可用。

我们建议你使用 `with` 在上下文对象上调用函数，而无需使用返回的结果。
在代码中，`with` 可以理解为“_对于此对象，执行以下操作_”。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }

}
```

你还可以使用 `with` 引入一个辅助对象，其属性或函数用于计算值。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)

}
```

### run

- **上下文对象**作为接收者 (`this`) 可用。
- **返回值**是 lambda 结果。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 的作用与 `with` 相同，但它作为扩展函数实现。因此，与 `let` 类似，你可以使用点表示法在上下文对象上调用它。

当你的 lambda 初始化对象并计算返回值时，`run` 非常有用。

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {

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

    println(result)
    println(letResult)
}
```

你还可以将 `run` 作为非扩展函数调用。 `run` 的非扩展变体没有上下文对象，但它仍然返回 lambda 结果。非扩展 `run` 允许你执行需要表达式的多个语句块。在代码中，非扩展 `run` 可以理解为“_运行代码块并计算结果_”。

```kotlin
fun main() {

    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }

}
```

### apply

- **上下文对象**作为接收者 (`this`) 可用。
- **返回值**是对象本身。

由于 [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 返回上下文对象本身，因此我们建议你将其用于不返回值并且主要对接收者对象的成员进行操作的代码块。 `apply` 最常见的用例是对象配置。这样的调用可以理解为“_将以下赋值应用于对象_”。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)

}
```

`apply` 的另一个用例是在多个调用链中包含 `apply` 以进行更复杂的处理。

### also

- **上下文对象**作为参数 (`it`) 可用。
- **返回值**是对象本身。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) 对于执行一些将上下文对象作为参数的操作很有用。对于需要引用对象而不是其属性和函数的操作，或者当你不想从外部范围隐藏 `this` 引用时，请使用 `also`。

当你在代码中看到 `also` 时，你可以将其理解为“_并且还对该对象执行以下操作_”。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")

}
```

## takeIf 和 takeUnless

除了作用域函数之外，标准库还包含函数 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 和 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)。这些函数允许你在调用链中嵌入对对象状态的检查。

当与谓词一起在对象上调用时，如果 `takeIf` 满足给定的谓词，则返回该对象。
否则，它返回 `null`。因此，`takeIf` 是单个对象的过滤函数。

`takeUnless` 具有与 `takeIf` 相反的逻辑。当与谓词一起在对象上调用时，如果 `takeUnless` 满足给定的谓词，则返回 `null`。否则，它返回该对象。

使用 `takeIf` 或 `takeUnless` 时，该对象作为 lambda 参数 (`it`) 可用。

```kotlin
import kotlin.random.*

fun main() {

    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")

}
```

:::tip
在 `takeIf` 和 `takeUnless` 之后链接其他函数时，不要忘记执行空检查或使用安全调用 (`?.`)，因为它们的返回值是可空的。

:::

```kotlin
fun main() {

    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)

}
```

`takeIf` 和 `takeUnless` 与作用域函数结合使用特别有用。例如，你可以将 `takeIf` 和 `takeUnless` 与 `let` 链接起来，以在与给定谓词匹配的对象上运行代码块。为此，请在对象上调用 `takeIf`，然后使用安全调用 (`?`) 调用 `let`。对于与谓词不匹配的对象，`takeIf` 返回 `null` 并且不调用 `let`。

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```

为了进行比较，下面是一个如何在不使用 `takeIf` 或作用域函数的情况下编写相同函数的示例：

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```