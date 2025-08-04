[//]: # (title: 高阶函数与 lambda 表达式)

Kotlin 函数是[一等公民](https://en.wikipedia.org/wiki/First-class_function)，这意味着它们可以
存储在变量和数据结构中，并可以作为实参传递给其他[高阶函数](#higher-order-functions)或从其他高阶函数返回。你可以对函数执行其他
非函数值可能执行的任何操作。

为实现这一点，Kotlin 作为一种静态类型编程语言，使用一系列[函数类型](#function-types)来表示函数，并提供了一组专门的语言构造，例如
[lambda 表达式和匿名函数](#lambda-expressions-and-anonymous-functions)。

## 高阶函数

高阶函数是接受函数作为形参或返回函数的函数。

高阶函数的一个很好的例子是集合的[函数式编程惯用法 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))。
它接受一个初始累加器值和一个组合函数，并通过连续地将当前累加器值与每个集合元素组合来构建其返回值，每次替换累加器值：

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

在上面的代码中，`combine` 形参具有[函数类型](#function-types) `(R, T) -> R`，因此它接受一个函数，该函数接受两个 `R` 和 `T` 类型的实参并返回 `R` 类型的值。
它在 `for` 循环内部被[调用](#invoking-a-function-type-instance)，返回值随后被赋值给 `accumulator`。

要调用 `fold`，你需要将[函数类型的实例](#instantiating-a-function-type)作为实参传递给它，
lambda 表达式（[下文详细描述](#lambda-expressions-and-anonymous-functions)）在高阶函数调用处被广泛用于此目的：

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // lambda 表达式是花括号包裹的代码块。
    items.fold(0, { 
        // 当 lambda 表达式有参数时，参数在前，后跟 '->'
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // lambda 表达式中的最后一个表达式被认为是返回值：
        result
    })
    
    // 如果 lambda 参数类型可以被推断，则参数类型是可选的：
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

这些类型有一个特殊的表示法，对应于函数的签名——它们的形参和返回值：

*   所有函数类型都具有一个圆括号列表的形参类型和一个返回类型：`(A, B) -> C` 表示一个函数类型，它接受两个 `A` 和 `B` 类型的实参并返回 `C` 类型的值。
    形参类型列表可以为空，如 `() -> A`。[`Unit` 返回类型](functions.md#unit-returning-functions)不能省略。

*   函数类型可以选择性地具有一个额外的*接收者*类型，该类型在表示法中点号前指定：
    类型 `A.(B) -> C` 表示可以对接收者对象 `A` 调用、带一个形参 `B` 并返回 `C` 值
    的函数。[带接收者的函数字面量](#function-literals-with-receiver)通常与这些类型一起使用。

*   [挂起函数](coroutines-basics.md#extract-function-refactoring)属于一种特殊类型的函数类型，其表示法中具有一个 `suspend` 修饰符，例如 `suspend () -> Unit` 或 `suspend A.(B) -> C`。

函数类型表示法可以可选地包含函数形参的名称：`(x: Int, y: Int) -> Point`。
这些名称可以用于记录形参的含义。

要指定函数类型是[可空的](null-safety.md#nullable-types-and-non-nullable-types)，请使用如下圆括号：
`((Int, Int) -> Int)?`。

函数类型也可以使用圆括号组合：`(Int) -> ((Int) -> Unit)`。

> 箭头表示法是右结合的，`(Int) -> (Int) -> Unit` 等价于上一个示例，但不等价于 `((Int) -> (Int)) -> Unit`。
>
{style="note"}

你还可以通过使用[类型别名](type-aliases.md)为函数类型指定一个替代名称：

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 实例化函数类型

有几种方法可以获取函数类型的实例：

*   使用函数字面量中的代码块，以下列形式之一：
    *   [lambda 表达式](#lambda-expressions-and-anonymous-functions)：`{ a, b -> a + b }`，
    *   [匿名函数](#anonymous-functions)：`fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

    [带接收者的函数字面量](#function-literals-with-receiver)可以用作带接收者的函数类型的值。

*   使用对现有声明的可调用引用：
    *   顶层函数、局部函数、成员函数或扩展[函数](reflection.md#function-references)：`::isOdd`、`String::toInt`，
    *   顶层属性、成员属性或扩展[属性](reflection.md#property-references)：`List<Int>::size`，
    *   [构造函数](reflection.md#constructor-references)：`::Regex`

    这些包括指向特定实例成员的[绑定可调用引用](reflection.md#bound-function-and-property-references)：`foo::toString`。

*   使用实现函数类型作为接口的自定义类的实例：

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

如果存在足够的信息，编译器可以推断变量的函数类型：

```kotlin
val a = { i: Int -> i + 1 } // 推断类型为 (Int) -> Int
```

带接收者和不带接收者的*非字面量*函数类型值是可互换的，因此接收者可以代替第一个形参，反之亦然。例如，类型为 `(A, B) -> C` 的值可以
在期望 `A.(B) -> C` 类型值的位置传递或赋值，反之亦然：

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

> 即使变量使用对扩展函数的引用进行初始化，函数类型也默认推断为不带接收者的类型。
> 要改变这种行为，请显式指定变量类型。
>
{style="note"}

### 调用函数类型实例

函数类型的值可以通过使用其 [`invoke(...)` 操作符](operator-overloading.md#invoke-operator)来调用：
`f.invoke(x)` 或简写为 `f(x)`。

如果该值具有接收者类型，则接收者对象应作为第一个实参传递。
另一种调用带接收者的函数类型值的方式是在其前面加上接收者对象，
就像该值是一个[扩展函数](extensions.md)一样：`1.foo(2)`。

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

有时，使用提供灵活控制流的[内联函数](inline-functions.md)来处理高阶函数会很有益。

## lambda 表达式和匿名函数

lambda 表达式和匿名函数是*函数字面量*。函数字面量是未声明但作为表达式立即传递的函数。请看以下示例：

```kotlin
max(strings, { a, b -> a.length < b.length })
```

函数 `max` 是一个高阶函数，因为它接受一个函数值作为其第二个实参。这第二个实参本身是一个函数表达式，称为函数字面量，它等价于以下具名函数：

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### lambda 表达式语法

lambda 表达式的完整语法形式如下：

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

*   lambda 表达式总是被花括号包裹。
*   完整语法形式中的参数声明位于花括号内部，并带有可选的类型注解。
*   函数体位于 `->` 之后。
*   如果 lambda 的推断返回类型不是 `Unit`，则 lambda 函数体内部的最后一个（或可能是单个）表达式被视为返回值。

如果你省略所有可选注解，剩下的看起来像这样：

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 传递尾随 lambda

根据 Kotlin 约定，如果函数的最后一个形参是函数，那么作为相应实参传递的 lambda 表达式可以放在圆括号外部：

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

这种语法也被称为*尾随 lambda*。

如果 lambda 是该调用中唯一的实参，则可以完全省略圆括号：

```kotlin
run { println("...") }
```

### it：单个形参的隐式名称

lambda 表达式只有一个形参的情况非常常见。

如果编译器可以在没有任何形参的情况下解析签名，则不需要声明该形参，并且可以省略 `->`。该形参将被隐式声明为 `it`：

```kotlin
ints.filter { it > 0 } // 此字面量类型为 '(it: Int) -> Boolean'
```

### 从 lambda 表达式返回值

你可以使用[限定返回](returns.md#return-to-labels)语法从 lambda 显式返回值。
否则，最后一个表达式的值将隐式返回。

因此，以下两个代码片段是等价的：

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

此约定，连同[将 lambda 表达式放在圆括号外部传递](#passing-trailing-lambdas)的能力，允许编写 [LINQ 风格](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)的代码：

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 未使用的变量的下划线

如果 lambda 形参未使用，你可以在其名称位置放置下划线：

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### lambda 中的解构

lambda 中的解构被描述为[解构声明](destructuring-declarations.md#destructuring-in-lambdas)的一部分。

### 匿名函数

上述 lambda 表达式语法缺少一件事——指定函数返回类型的能力。在大多数情况下，
这没有必要，因为返回类型可以自动推断。但是，如果你确实需要显式指定它，
你可以使用另一种语法：*匿名函数*。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函数看起来非常像常规函数声明，只是其名称被省略了。其函数体可以是
一个表达式（如上所示）或一个代码块：

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

形参和返回类型的指定方式与常规函数相同，只是如果可以从上下文中推断出形参类型，则可以省略：

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名函数的返回类型推断与普通函数的工作方式相同：对于带表达式体的匿名函数，返回类型会自动推断，但对于带代码块体的匿名函数，则必须显式指定（或假定为 `Unit`）。

> 当将匿名函数作为实参传递时，请将其放在圆括号内部。允许将
> 函数放在圆括号外部的简写语法仅适用于 lambda 表达式。
>
{style="note"}

lambda 表达式和匿名函数之间的另一个区别是[非局部返回](inline-functions.md#returns)的行为。
不带标签的 `return` 语句总是从用 `fun` 关键字声明的函数返回。这意味着
lambda 表达式中的 `return` 将从外层函数返回，而匿名
函数中的 `return` 将从匿名函数自身返回。

### 闭包

lambda 表达式或匿名函数（以及[局部函数](functions.md#local-functions)和[对象表达式](object-declarations.md#object-expressions)）
可以访问其*闭包*，闭包包括在外部作用域中声明的变量。在闭包中捕获的变量可以在 lambda 中被修改：

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 带接收者的函数字面量

带接收者的[函数类型](#function-types)，例如 `A.(B) -> C`，可以使用一种特殊形式的函数
字面量——带接收者的函数字面量来实例化。

如上所述，Kotlin 提供了[调用](#invoking-a-function-type-instance)带接收者的函数类型实例的能力，同时提供*接收者对象*。

在函数字面量的函数体内部，传递给调用的接收者对象会成为一个*隐式* `this`，
这样你就可以无需任何额外限定符地访问该接收者对象的成员，或者使用
[`this` 表达式](this-expressions.md)访问接收者对象。

此行为类似于[扩展函数](extensions.md)，扩展函数也允许你在函数体内部访问接收者对象的成员。

这是一个带接收者的函数字面量及其类型的示例，其中 `plus` 在接收者对象上调用：

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

匿名函数语法允许你直接指定函数字面量的接收者类型。
如果你需要声明一个带接收者的函数类型变量，然后稍后使用它，这会很有用。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

当接收者类型可以从上下文中推断时，lambda 表达式可以用作带接收者的函数字面量。
其最重要的用法示例之一是[类型安全构建器](type-safe-builders.md)：

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // 创建接收者对象
    html.init()        // 将接收者对象传递给 lambda
    return html
}

html {       // 带接收者的 lambda 从此处开始
    body()   // 在接收者对象上调用方法
}