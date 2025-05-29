[//]: # (title: 高阶函数和 Lambda 表达式)

Kotlin 函数是[一等公民](https://en.wikipedia.org/wiki/First-class_function)，这意味着它们可以被存储在变量和数据结构中，并可以作为参数传递给其他[高阶函数](#higher-order-functions)或从其返回。你可以对函数执行其他非函数值所能进行的任何操作。

为了实现这一点，Kotlin 作为一种静态类型编程语言，使用一系列[函数类型](#function-types)来表示函数，并提供了一组专门的语言构造，例如[Lambda 表达式](#lambda-expressions-and-anonymous-functions)和匿名函数。

## 高阶函数

高阶函数是接受函数作为参数或返回函数的函数。

高阶函数的一个很好的例子是集合的[函数式编程范式 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))。它接受一个初始累加器值和一个组合函数，并通过连续将当前累加器值与每个集合元素组合来构建其返回值，每次都替换累加器值：

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) -> R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

在上面的代码中，`combine` 参数具有[函数类型](#function-types) `(R, T) -> R`，因此它接受一个函数，该函数接收类型为 `R` 和 `T` 的两个参数并返回一个类型为 `R` 的值。它在 `for` 循环内部被[调用](#invoking-a-function-type-instance)，然后返回值被赋值给 `accumulator`。

要调用 `fold`，你需要将[函数类型实例](#instantiating-a-function-type)作为参数传递给它，而 Lambda 表达式（[下文有更详细的描述](#lambda-expressions-and-anonymous-functions)）则广泛用于高阶函数调用点：

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambda 表达式是包含在花括号中的代码块。
    items.fold(0, { 
        // 当 Lambda 表达式有参数时，参数先列出，后跟 '->'
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // Lambda 表达式中的最后一个表达式被视为返回值：
        result
    })
    
    // 如果可以推断出参数类型，Lambda 表达式中的参数类型是可选的：
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })
    
    // 函数引用也可以用于高阶函数调用：
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
```
{kotlin-runnable="true"}

## 函数类型

Kotlin 使用函数类型，例如 `(Int) -> String`，来处理函数的声明：`val onClick: () -> Unit = ...`。

这些类型有一个特殊的表示法，对应于函数的签名——它们的参数和返回值：

*   所有函数类型都具有一个用括号括起来的参数类型列表和一个返回类型：`(A, B) -> C` 表示一个函数类型，该函数接受类型为 `A` 和 `B` 的两个参数并返回类型为 `C` 的值。参数类型列表可以为空，如 `() -> A`。[`Unit` 返回类型](functions.md#unit-returning-functions)不能省略。

*   函数类型可以选择性地具有一个额外的*接收者*类型，该类型在表示法中点号之前指定：类型 `A.(B) -> C` 表示可以在接收者对象 `A` 上调用并带参数 `B` 并返回类型 `C` 的函数。[带接收者的函数字面量](#function-literals-with-receiver)通常与这些类型一起使用。

*   [挂起函数](coroutines-basics.md#extract-function-refactoring)属于一种特殊类型的函数，它们的表示法中带有一个 `suspend` 修饰符，例如 `suspend () -> Unit` 或 `suspend A.(B) -> C`。

函数类型表示法可以可选地包含函数参数的名称：`(x: Int, y: Int) -> Point`。这些名称可用于记录参数的含义。

要指定函数类型为[可空](null-safety.md#nullable-types-and-non-nullable-types)，请按如下方式使用括号：`((Int, Int) -> Int)?`。

函数类型也可以使用括号组合：`(Int) -> ((Int) -> Unit)`。

> 箭头表示法是右结合的，`(Int) -> (Int) -> Unit` 等价于上一个示例，但不等价于 `((Int) -> (Int)) -> Unit`。
>
{style="note"}

你还可以通过使用[类型别名](type-aliases.md)来给函数类型一个替代名称：

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 实例化函数类型

有几种方法可以获取函数类型实例：

*   在函数字面量中，使用代码块，以下列形式之一：
    *   [Lambda 表达式](#lambda-expressions-and-anonymous-functions)：`{ a, b -> a + b }`，
    *   [匿名函数](#anonymous-functions)：`fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

    [带接收者的函数字面量](#function-literals-with-receiver)可以作为带接收者的函数类型的值使用。

*   使用对现有声明的[可调用引用](reflection.md#function-references)：
    *   顶层、局部、成员或扩展[函数](reflection.md#function-references)：`::isOdd`、`String::toInt`，
    *   顶层、成员或扩展[属性](reflection.md#property-references)：`List<Int>::size`，
    *   [构造函数](reflection.md#constructor-references)：`::Regex`

    这些包括[绑定可调用引用](reflection.md#bound-function-and-property-references)，它们指向特定实例的成员：`foo::toString`。

*   使用实现函数类型接口的自定义类实例：

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

如果信息足够，编译器可以推断变量的函数类型：

```kotlin
val a = { i: Int -> i + 1 } // 推断的类型是 (Int) -> Int
```

带接收者和不带接收者的*非字面量*函数类型值可以互换，因此接收者可以代替第一个参数，反之亦然。例如，类型为 `(A, B) -> C` 的值可以在预期类型为 `A.(B) -> C` 的地方传递或赋值，反之亦然：

```kotlin
fun main() {
    //sampleStart
    val repeatFun: String.(Int) -> String = { times -> this.repeat(times) }
    val twoParameters: (String, Int) -> String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) -> String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK
    //sampleEnd
    println("result = $result")
}
```
{kotlin-runnable="true"}

> 即使变量使用对扩展函数的引用进行了初始化，默认情况下也会推断出不带接收者的函数类型。
> 要改变这一点，请显式指定变量类型。
>
{style="note"}

### 调用函数类型实例

函数类型的值可以通过使用其 [`invoke(...)` 运算符](operator-overloading.md#invoke-operator)来调用：`f.invoke(x)` 或简写 `f(x)`。

如果值具有接收者类型，则应将接收者对象作为第一个参数传递。调用带接收者的函数类型值的另一种方法是将其作为接收者对象的前缀，就好像该值是[扩展函数](extensions.md)一样：`1.foo(2)`。

示例：

```kotlin
fun main() {
    //sampleStart
    val stringPlus: (String, String) -> String = String::plus
    val intPlus: Int.(Int) -> Int = Int::plus
    
    println(stringPlus.invoke("<-", "->"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // 类似扩展函数的调用
    //sampleEnd
}
```
{kotlin-runnable="true"}

### 内联函数

有时，对于高阶函数，使用[内联函数](inline-functions.md)（它们提供了灵活的控制流）是有益的。

## Lambda 表达式和匿名函数

Lambda 表达式和匿名函数是*函数字面量*。函数字面量是未声明但立即作为表达式传递的函数。考虑以下示例：

```kotlin
max(strings, { a, b -> a.length < b.length })
```

`max` 函数是一个高阶函数，因为它将函数值作为其第二个参数。第二个参数本身是一个函数，称为函数字面量，它等效于以下命名函数：

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### Lambda 表达式语法

Lambda 表达式的完整语法形式如下：

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

*   Lambda 表达式总是被花括号包围。
*   完整语法形式中的参数声明位于花括号内，并具有可选的类型注解。
*   函数体在 `->` 之后。
*   如果推断出的 Lambda 表达式的返回类型不是 `Unit`，则 Lambda 函数体内的最后一个（或可能是唯一的）表达式被视为返回值。

如果你省略所有可选注解，剩下的看起来像这样：

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 传递尾随 Lambda

根据 Kotlin 约定，如果函数的最后一个参数是函数，则作为相应参数传递的 Lambda 表达式可以放在括号之外：

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

这种语法也称为*尾随 Lambda*。

如果 Lambda 表达式是该调用中唯一的参数，则可以完全省略括号：

```kotlin
run { println("...") }
```

### it：单个参数的隐式名称

Lambda 表达式只有一个参数的情况非常常见。

如果编译器可以在不带任何参数的情况下解析签名，则不需要声明参数，并且可以省略 `->`。参数将以 `it` 为名称隐式声明：

```kotlin
ints.filter { it > 0 } // 此字面量的类型为 '(it: Int) -> Boolean'
```

### 从 Lambda 表达式返回值

你可以使用[限定返回](returns.md#return-to-labels)语法显式地从 Lambda 表达式返回值。否则，最后一个表达式的值将隐式返回。

因此，以下两个代码片段是等效的：

```kotlin
ints.filter {
    val shouldFilter = it > 0
    shouldFilter
}

ints.filter {
    val shouldFilter = it > 0
    return@filter shouldFilter
}
```

此约定，以及[将 Lambda 表达式放在括号之外传递](#passing-trailing-lambdas)，允许[LINQ 风格](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)的代码：

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 未使用变量的下划线

如果 Lambda 参数未使用，可以用下划线代替其名称：

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### Lambda 中的解构

Lambda 中的解构被描述为[解构声明](destructuring-declarations.md#destructuring-in-lambdas)的一部分。

### 匿名函数

上面的 Lambda 表达式语法缺少一件事——指定函数返回类型的能力。在大多数情况下，这是不必要的，因为返回类型可以自动推断。但是，如果你确实需要显式指定它，可以使用替代语法：*匿名函数*。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函数看起来非常像常规函数声明，只是它的名称被省略了。它的函数体可以是表达式（如上所示）或代码块：

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

参数和返回类型与常规函数相同的方式指定，但如果可以从上下文中推断出参数类型，则可以省略：

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名函数的返回类型推断与普通函数的工作方式相同：对于带表达式函数体的匿名函数，返回类型会自动推断，但对于带代码块函数体的匿名函数，必须显式指定（或假定为 `Unit`）。

> 将匿名函数作为参数传递时，将其放在括号内。允许将函数留在括号外部的简写语法仅适用于 Lambda 表达式。
>
{style="note"}

Lambda 表达式和匿名函数之间的另一个区别是[非局部返回](inline-functions.md#returns)的行为。不带标签的 `return` 语句总是从使用 `fun` 关键字声明的函数返回。这意味着 Lambda 表达式内部的 `return` 将从封闭函数返回，而匿名函数内部的 `return` 将从匿名函数本身返回。

### 闭包

Lambda 表达式或匿名函数（以及[局部函数](functions.md#local-functions)和[对象表达式](object-declarations.md#object-expressions)）可以访问其*闭包*，其中包括在外部作用域中声明的变量。闭包中捕获的变量可以在 Lambda 表达式中修改：

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 带接收者的函数字面量

带接收者的[函数类型](#function-types)，例如 `A.(B) -> C`，可以使用特殊形式的函数字面量——带接收者的函数字面量——来实例化。

如前所述，Kotlin 提供了[调用带接收者的函数类型实例](#invoking-a-function-type-instance)同时提供*接收者对象*的能力。

在函数字面量的函数体内部，传递给调用的接收者对象会成为一个*隐式* `this`，这样你就可以访问该接收者对象的成员而无需任何额外的限定符，或者使用[`this` 表达式](this-expressions.md)访问接收者对象。

此行为类似于[扩展函数](extensions.md)的行为，扩展函数也允许你在函数体内部访问接收者对象的成员。

这是一个带接收者的函数字面量及其类型的示例，其中 `plus` 在接收者对象上调用：

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

匿名函数语法允许你直接指定函数字面量的接收者类型。如果需要声明带接收者的函数类型的变量，然后稍后使用它，这会很有用。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

当可以从上下文中推断出接收者类型时，Lambda 表达式可以用作带接收者的函数字面量。它们最重要的用例之一是[类型安全的构建器](type-safe-builders.md)：

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // 创建接收者对象
    html.init()        // 将接收者对象传递给 Lambda 表达式
    return html
}

html {       // 带接收者的 Lambda 表达式从这里开始
    body()   // 调用接收者对象上的方法
}