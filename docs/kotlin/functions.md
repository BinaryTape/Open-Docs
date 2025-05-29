[//]: # (title: 函数)

Kotlin 函数使用 `fun` 关键字声明：

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 函数用法

函数通过标准方式调用：

```kotlin
val result = double(2)
```

调用成员函数使用点表示法：

```kotlin
Stream().read() // 创建 Stream 类的实例并调用 read()
```

### 参数

函数参数使用 Pascal 表示法定义 - *名称*: *类型*。参数之间用逗号分隔，每个参数都必须显式指定类型：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

声明函数参数时，可以使用[尾随逗号](coding-conventions.md#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 尾随逗号
) { /*...*/ }
```

### 默认参数

函数参数可以拥有默认值，当您省略相应参数时将使用这些默认值。这减少了重载的数量：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

默认值通过在类型后附加 `=` 来设置。

覆盖方法总是使用基方法的默认参数值。当覆盖具有默认参数值的方法时，必须从签名中省略默认参数值：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // 不允许有默认值。
}
```

如果默认参数位于没有默认值的参数之前，则只能通过使用[命名参数](#named-arguments)调用函数来使用默认值：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // 使用了默认值 bar = 0
```

如果默认参数后的最后一个参数是[lambda 表达式](lambdas.md#lambda-expression-syntax)，您可以将其作为命名参数传递，或者[放在圆括号外](lambdas.md#passing-trailing-lambdas)传递：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // 使用了默认值 baz = 1
foo(qux = { println("hello") }) // 使用了默认值 bar = 0 和 baz = 1
foo { println("hello") }        // 使用了默认值 bar = 0 和 baz = 1
```

### 命名参数

调用函数时，您可以命名函数的一个或多个参数。当函数有许多参数，并且难以将值与参数关联起来时，这会很有帮助，尤其是在参数是布尔值或 `null` 值的情况下。

在函数调用中使用命名参数时，您可以随意更改它们的排列顺序。如果您想使用它们的默认值，可以直接省略这些参数。

考虑 `reformat()` 函数，它有 4 个带默认值的参数。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

调用此函数时，您不必命名所有参数：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

您可以跳过所有带有默认值的参数：

```kotlin
reformat("This is a long String!")
```

您也可以跳过特定的带默认值的参数，而不是省略所有参数。但是，在跳过第一个参数之后，您必须命名所有后续参数：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

您可以使用 _展开_ 运算符（在数组前加上 `*`）传递带名称的[可变数量参数（`vararg`）](#variable-number-of-arguments-varargs)：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> 在 JVM 上调用 Java 函数时，您不能使用命名参数语法，因为 Java 字节码并不总是保留函数参数的名称。
>
{style="note"}

### Unit 返回函数

如果一个函数不返回有用的值，其返回类型为 `Unit`。`Unit` 是一种只有一个值——`Unit`——的类型。此值不必显式返回：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` 或 `return` 是可选的
}
```

`Unit` 返回类型声明也是可选的。上述代码等同于：

```kotlin
fun printHello(name: String?) { ... }
```

### 单表达式函数

当函数体由单个表达式组成时，可以省略花括号，并在 `=` 符号后指定函数体：

```kotlin
fun double(x: Int): Int = x * 2
```

当编译器可以推断出返回类型时，[显式声明返回类型是可选的](#explicit-return-types)：

```kotlin
fun double(x: Int) = x * 2
```

### 显式返回类型

具有块体（block body）的函数必须始终显式指定返回类型，除非它们旨在返回 `Unit`，[在这种情况下指定返回类型是可选的](#unit-returning-functions)。

Kotlin 不会推断具有块体函数的返回类型，因为这类函数在函数体内可能包含复杂的控制流，并且返回类型对读者（有时甚至是编译器）来说并不明显。

### 可变数量参数 (varargs)

您可以将函数的一个参数（通常是最后一个）标记为 `vararg` 修饰符：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts 是一个 Array
        result.add(t)
    return result
}
```

在这种情况下，您可以向函数传递可变数量的参数：

```kotlin
val list = asList(1, 2, 3)
```

在函数内部，类型 `T` 的 `vararg` 参数可见为 `T` 的数组，如上例所示，其中 `ts` 变量的类型为 `Array<out T>`。

只有一个参数可以被标记为 `vararg`。如果 `vararg` 参数不是列表中的最后一个，则后续参数的值必须使用命名参数语法传递，或者，如果参数是函数类型，则通过在圆括号外传递 lambda 表达式来传递。

调用 `vararg` 函数时，您可以单独传递参数，例如 `asList(1, 2, 3)`。如果您已经有一个数组并希望将其内容传递给函数，请使用展开运算符（在数组前加上 `*`）：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

如果您想将[基本类型数组](arrays.md#primitive-type-arrays)传递给 `vararg`，则需要使用 `toTypedArray()` 函数将其转换为常规（类型化）数组：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray 是一个基本类型数组
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中缀表示法

用 `infix` 关键字标记的函数也可以使用中缀表示法（省略点和调用时的括号）进行调用。中缀函数必须满足以下要求：

* 它们必须是成员函数或[扩展函数](extensions.md)。
* 它们必须只有一个参数。
* 参数不能[接受可变数量的参数](#variable-number-of-arguments-varargs)，并且不能有[默认值](#default-arguments)。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// 使用中缀表示法调用函数
1 shl 2

// 与以下代码相同
1.shl(2)
```

> 中缀函数调用的优先级低于算术运算符、类型转换和 `rangeTo` 运算符。以下表达式是等效的：
> * `1 shl 2 + 3` 等同于 `1 shl (2 + 3)`
> * `0 until n * 2` 等同于 `0 until (n * 2)`
> * `xs union ys as Set<*>` 等同于 `xs union (ys as Set<*>)`
>
> 另一方面，中缀函数调用的优先级高于布尔运算符 `&&` 和 `||`、`is`- 和 `in`-检查以及其他一些运算符。这些表达式也等效：
> * `a && b xor c` 等同于 `a && (b xor c)`
> * `a xor b in c` 等同于 `(a xor b) in c`
>
{style="note"}

请注意，中缀函数总是要求同时指定接收者和参数。当您使用中缀表示法在当前接收者上调用方法时，请显式使用 `this`。这是为了确保清晰的解析。

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // 正确
        add("abc")       // 正确
        //add "abc"        // 不正确：必须指定接收者
    }
}
```

## 函数作用域

Kotlin 函数可以在文件顶层声明，这意味着您不需要像 Java、C# 和 Scala 等语言那样创建类来包含函数（[Scala 3 起提供顶层定义](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）。除了顶层函数，Kotlin 函数也可以作为成员函数和扩展函数在本地声明。

### 局部函数

Kotlin 支持局部函数，即函数内部的函数：

```kotlin
fun dfs(graph: Graph) {
    fun dfs(current: Vertex, visited: MutableSet<Vertex>) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v, visited)
    }

    dfs(graph.vertices[0], HashSet())
}
```

局部函数可以访问外部函数的局部变量（闭包）。在上述情况下，`visited` 可以是一个局部变量：

```kotlin
fun dfs(graph: Graph) {
    val visited = HashSet<Vertex>()
    fun dfs(current: Vertex) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v)
    }

    dfs(graph.vertices[0])
}
```

### 成员函数

成员函数是定义在类或对象内部的函数：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

成员函数通过点表示法调用：

```kotlin
Sample().foo() // 创建 Sample 类的实例并调用 foo
```

有关类和覆盖成员的更多信息，请参阅[类](classes.md)和[继承](classes.md#inheritance)。

## 泛型函数

函数可以拥有泛型参数，这些参数在函数名称前使用尖括号指定：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有关泛型函数的更多信息，请参阅[泛型](generics.md)。

## 尾递归函数

Kotlin 支持一种称为[尾递归](https://en.wikipedia.org/wiki/Tail_call)的函数式编程风格。对于一些通常使用循环的算法，您可以改用递归函数，而没有栈溢出的风险。当函数被 `tailrec` 修饰符标记并满足所需的形式条件时，编译器会优化掉递归，转而生成一个快速高效的基于循环的版本：

```kotlin
val eps = 1E-10 // “足够好”，可以是 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

此代码计算余弦函数的`不动点`，这是一个数学常数。它只是从 `1.0` 开始重复调用 `Math.cos`，直到结果不再变化，对于指定的 `eps` 精度，得到的结果是 `0.7390851332151611`。生成的代码等同于这种更传统的风格：

```kotlin
val eps = 1E-10 // “足够好”，可以是 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

要符合 `tailrec` 修饰符的条件，函数必须将其自身调用作为其执行的最后一个操作。当递归调用后还有更多代码、在 `try`/`catch`/`finally` 块中或在开放函数上时，您不能使用尾递归。目前，Kotlin 在 JVM 和 Kotlin/Native 上支持尾递归。

**另请参阅**：
* [内联函数](inline-functions.md)
* [扩展函数](extensions.md)
* [高阶函数与 Lambda 表达式](lambdas.md)