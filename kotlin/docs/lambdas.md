---
title: "高阶函数与 Lambda 表达式"
---
Kotlin 函数是[头等函数](https://en.wikipedia.org/wiki/First-class_function)，这意味着它们可以存储在变量和数据结构中，并且可以作为参数传递给其他[高阶函数](#higher-order-functions)并从其中返回。 你可以对函数执行任何其他非函数值可能执行的操作。

为了方便这一点，Kotlin 作为一种静态类型编程语言，使用一系列[函数类型](#function-types)来表示函数，并提供一组专门的语言结构，例如[lambda 表达式](#lambda-expressions-and-anonymous-functions)。

## 高阶函数

高阶函数是将函数作为参数或返回函数的函数。

高阶函数的一个很好的例子是集合的[函数式编程习惯用法 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))。 它接受一个初始累加器值和一个组合函数，并通过连续地将当前累加器值与每个集合元素组合来构建其返回值，每次都替换累加器值：

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) `->` R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

在上面的代码中，`combine` 参数具有[函数类型](#function-types) `(R, T) `->` R`，因此它接受一个函数，该函数接受类型为 `R` 和 `T` 的两个参数，并返回类型为 `R` 的值。 它在 `for` 循环内被[调用](#invoking-a-function-type-instance)，然后返回值被分配给 `accumulator`。

要调用 `fold`，你需要将[函数类型的实例](#instantiating-a-function-type)作为参数传递给它，并且 lambda 表达式（[在下面更详细地描述](#lambda-expressions-and-anonymous-functions)）广泛用于高阶函数调用站点：

```kotlin
fun main() {

    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambdas are code blocks enclosed in curly braces.
    items.fold(0, { 
        // When a lambda has parameters, they go first, followed by '`->`'
        acc: Int, i: Int `->` 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // The last expression in a lambda is considered the return value:
        result
    })
    
    // Parameter types in a lambda are optional if they can be inferred:
    val joinedToString = items.fold("Elements:", { acc, i `->` acc + " " + i })
    
    // Function references can also be used for higher-order function calls:
    val product = items.fold(1, Int::times)

    println("joinedToString = $joinedToString")
    println("product = $product")
}
```

## 函数类型

Kotlin 使用函数类型，例如 `(Int) `->` String`，用于处理函数的声明：`val onClick: () `->` Unit = ...`。

这些类型具有一种特殊表示法，对应于函数的签名 - 它们的参数和返回值：

* 所有函数类型都有一个带括号的参数类型列表和一个返回类型：`(A, B) `->` C` 表示一种类型，该类型表示接受类型为 `A` 和 `B` 的两个参数并返回类型为 `C` 的值的函数。 参数类型列表可能为空，如 `() `->` A` 中所示。 [`Unit` 返回类型](functions#unit-returning-functions)不能省略。

* 函数类型可以选择具有一个额外的*接收者*类型，该类型在表示法中的点之前指定：类型 `A.(B) `->` C` 表示可以在接收者对象 `A` 上调用，参数为 `B` 并返回一个值 `C` 的函数。[带有接收者的函数字面量](#function-literals-with-receiver)通常与这些类型一起使用。

* [挂起函数](coroutines-basics#extract-function-refactoring)属于一种特殊的函数类型，其表示法中有一个 *suspend* 修饰符，例如 `suspend () `->` Unit` 或 `suspend A.(B) `->` C`。

函数类型表示法可以选择包含函数参数的名称：`(x: Int, y: Int) `->` Point`。 这些名称可用于记录参数的含义。

要指定函数类型是[可空的](null-safety#nullable-types-and-non-nullable-types)，请按如下方式使用括号：`((Int, Int) `->` Int)?`。

函数类型也可以使用括号组合：`(Int) `->` ((Int) `->` Unit)`。

:::note
箭头表示法是右结合的，`(Int) `->` (Int) `->` Unit` 等效于前面的示例，但不等效于 `((Int) `->` (Int)) `->` Unit`。

:::

你还可以通过使用[类型别名](type-aliases)为函数类型指定替代名称：

```kotlin
typealias ClickHandler = (Button, ClickEvent) `->` Unit
```

### 实例化函数类型

有几种方法可以获取函数类型的实例：

* 使用函数字面量中的代码块，采用以下形式之一：
    * [lambda 表达式](#lambda-expressions-and-anonymous-functions)：`{ a, b `->` a + b }`，
    * [匿名函数](#anonymous-functions)：`fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [带有接收者的函数字面量](#function-literals-with-receiver)可以用作带有接收者的函数类型的值。

* 使用对现有声明的可调用引用：
    * 顶层、局部、成员或扩展[函数](reflection#function-references)：`::isOdd`、`String::toInt`，
    * 顶层、成员或扩展[属性](reflection#property-references)：`List<Int>::size`，
    * [构造函数](reflection#constructor-references)：`::Regex`

  这些包括[绑定可调用引用](reflection#bound-function-and-property-references)，它们指向特定实例的成员：`foo::toString`。

* 使用实现作为接口的函数类型的自定义类的实例：

```kotlin
class IntTransformer: (Int) `->` Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) `->` Int = IntTransformer()
```

如果信息足够，编译器可以推断变量的函数类型：

```kotlin
val a = { i: Int `->` i + 1 } // 推断的类型是 (Int) `->` Int
```

具有和不具有接收者的函数类型的*非字面量*值是可互换的，因此接收者可以代替第一个参数，反之亦然。 例如，类型为 `(A, B) `->` C` 的值可以在期望类型为 `A.(B) `->` C` 的值的地方传递或赋值，反之亦然：

```kotlin
fun main() {

    val repeatFun: String.(Int) `->` String = { times `->` this.repeat(times) }
    val twoParameters: (String, Int) `->` String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) `->` String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK

    println("result = $result")
}
```

:::note
默认情况下，推断不带接收者的函数类型，即使变量是用对扩展函数的引用初始化的。
要更改该设置，请显式指定变量类型。

:::

### 调用函数类型实例

可以通过使用其 [`invoke(...)` 运算符](operator-overloading#invoke-operator)来调用函数类型的值：`f.invoke(x)` 或仅 `f(x)`。

如果该值具有接收者类型，则应将接收者对象作为第一个参数传递。 调用带有接收者的函数类型值的另一种方法是用接收者对象来前置它，就像该值是[扩展函数](extensions)一样：`1.foo(2)`。

示例：

```kotlin
fun main() {

    val stringPlus: (String, String) `->` String = String::plus
    val intPlus: Int.(Int) `->` Int = Int::plus
    
    println(stringPlus.invoke("`<-`", "`->`"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // 类似扩展的调用

}
```

### 内联函数

有时，使用[内联函数](inline-functions)对于高阶函数是有益的，它可以提供灵活的控制流。

## Lambda 表达式和匿名函数

Lambda 表达式和匿名函数是*函数字面量*。 函数字面量是未声明但立即作为表达式传递的函数。 考虑以下示例：

```kotlin
max(strings, { a, b `->` a.length < b.length })
```

函数 `max` 是一个高阶函数，因为它接受一个函数值作为其第二个参数。 第二个参数是一个表达式，它本身就是一个函数，称为函数字面量，它等效于以下命名函数：

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### Lambda 表达式语法

lambda 表达式的完整语法形式如下：

```kotlin
val sum: (Int, Int) `->` Int = { x: Int, y: Int `->` x + y }
```

* lambda 表达式始终用花括号括起来。
* 完整语法形式的参数声明位于花括号内，并具有可选的类型注释。
* 函数体在 `->` 之后。
* 如果 lambda 的推断返回类型不是 `Unit`，则 lambda 函数体内的最后一个（或可能是单个）表达式被视为返回值。

如果你省略所有可选的注释，剩下的内容如下所示：

```kotlin
val sum = { x: Int, y: Int `->` x + y }
```

### 传递尾随 lambda

根据 Kotlin 约定，如果函数的最后一个参数是一个函数，则作为相应参数传递的 lambda 表达式可以放在括号外面：

```kotlin
val product = items.fold(1) { acc, e `->` acc * e }
```

这种语法也称为*尾随 lambda*。

如果 lambda 是该调用中唯一的参数，则可以完全省略括号：

```kotlin
run { println("...") }
```

### it：单个参数的隐式名称

lambda 表达式只有一个参数是很常见的。

如果编译器可以在没有任何参数的情况下解析签名，则不需要声明参数，并且可以省略 `->`。 该参数将以名称 `it` 隐式声明：

```kotlin
ints.filter { it > 0 } // 此字面量的类型为 '(it: Int) `->` Boolean'
```

### 从 lambda 表达式返回值

你可以使用[限定返回](returns#return-to-labels)语法从 lambda 显式返回值。 否则，将隐式返回最后一个表达式的值。

因此，以下两个代码段是等效的：

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

此约定以及[在括号外传递 lambda 表达式](#passing-trailing-lambdas)允许使用 [LINQ 风格](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)的代码：

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 用于未使用变量的下划线

如果 lambda 参数未使用，则可以放置下划线而不是其名称：

```kotlin
map.forEach { (_, value) `->` println("$value!") }
```

### Lambda 中的解构

Lambda 中的解构被描述为[解构声明](destructuring-declarations#destructuring-in-lambdas)的一部分。

### 匿名函数

上面的 lambda 表达式语法缺少一件事 - 指定函数返回类型的能力。 在大多数情况下，这是不必要的，因为可以自动推断返回类型。 但是，如果确实需要显式指定它，则可以使用替代语法：*匿名函数*。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函数看起来很像常规函数声明，只是省略了它的名称。 它的主体可以是表达式（如上所示）或块：

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

参数和返回类型的指定方式与常规函数相同，除非可以从上下文中推断出参数类型，否则可以省略参数类型：

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名函数的返回类型推断与普通函数的工作方式相同：对于具有表达式主体的匿名函数，会自动推断返回类型，但对于具有块主体的匿名函数，必须显式指定返回类型（或假定为 `Unit`）。

:::note
将匿名函数作为参数传递时，请将它们放在括号内。 允许你将函数保留在括号外的简写语法仅适用于 lambda 表达式。

:::

lambda 表达式和匿名函数之间的另一个区别是[非局部返回](inline-functions#returns)的行为。 没有标签的 `return` 语句始终从使用 `fun` 关键字声明的函数返回。 这意味着 lambda 表达式中的 `return` 将从封闭函数返回，而匿名函数中的 `return` 将从匿名函数本身返回。

### 闭包

lambda 表达式或匿名函数（以及[局部函数](functions#local-functions)和[对象表达式](object-declarations#object-expressions)）可以访问其*闭包*，其中包括在外部作用域中声明的变量。 在闭包中捕获的变量可以在 lambda 中修改：

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 带有接收者的函数字面量

带有接收者的[函数类型](#function-types)，例如 `A.(B) `->` C`，可以使用特殊形式的函数字面量（带有接收者的函数字面量）实例化。

如上所述，Kotlin 提供了[调用](invoking-a-function-type-instance)带有接收者的函数类型的实例，同时提供*接收者对象*的能力。

在函数字面量的函数体内，传递给调用的接收者对象变为*隐式* `this`，因此你可以在没有任何其他限定符的情况下访问该接收者对象的成员，或者使用 [`this` 表达式](this-expressions)访问接收者对象。

此行为类似于[扩展函数](extensions)的行为，后者还允许你访问函数体内接收者对象的成员。

以下是带有接收者的函数字面量的示例及其类型，其中在接收者对象上调用 `plus`：

```kotlin
val sum: Int.(Int) `->` Int = { other `->` plus(other) }
```

匿名函数语法允许你直接指定函数字面量的接收者类型。 如果你需要声明具有接收者的函数类型的变量，然后在以后使用它，这将非常有用。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

当可以从上下文中推断出接收者类型时，lambda 表达式可以用作带有接收者的函数字面量。 它们用法最重要的例子之一是[类型安全构建器](type-safe-builders)：

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() `->` Unit): HTML {
    val html = HTML()  // 创建接收者对象
    html.init()        // 将接收者对象传递给 lambda
    return html
}

html {       // 带有接收者的 lambda 从此处开始
    body()   // 在接收者对象上调用方法
}
```