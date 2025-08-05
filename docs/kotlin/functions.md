[//]: # (title: 函数)

Kotlin 函数使用 `fun` 关键字声明：

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 函数用法

函数使用标准方式调用：

```kotlin
val result = double(2)
```

调用成员函数使用点表示法：

```kotlin
Stream().read() // create instance of class Stream and call read()
```

### 形参

函数形参使用帕斯卡表示法定义 - *名称*: *类型*。形参之间用逗号分隔，每个形参都必须显式指定类型：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

声明函数形参时，你可以使用[尾部逗号](coding-conventions.md#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```

### 带有默认值的形参

函数形参可以有默认值，当你省略对应的实参时会使用这些默认值。这减少了重载的数量：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

这类形参也称为 _可选形参_。

通过在类型后追加 `=` 来设置默认值。

覆盖方法总是使用基方法的默认形参值。当覆盖一个具有默认形参值的方法时，必须从签名中省略默认形参值：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // No default value is allowed.
}
```

如果一个带有默认值的形参出现在一个没有默认值的形参之前，那么该默认值只能通过[具名实参](#named-arguments)调用函数来使用：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // The default value bar = 0 is used
```

如果所有带默认值的形参后的最后一个形参是函数类型，那么你可以将对应的 [lambda 表达式](lambdas.md#lambda-expression-syntax)实参作为具名实参传递，或者[在圆括号外](lambdas.md#passing-trailing-lambdas)传递：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // Uses the default value baz = 1
foo(qux = { println("hello") }) // Uses both default values bar = 0 and baz = 1
foo { println("hello") }        // Uses both default values bar = 0 and baz = 1
```

### 具名实参

调用函数时，你可以为函数的一个或多个实参命名。当函数有许多实参并且难以将值与实参关联时，这会很有帮助，尤其当它是布尔值或 `null` 值时。

当你使用具名实参调用函数时，你可以自由更改它们的顺序。如果你想使用它们的默认值，你可以完全省略这些实参。

考虑 `reformat()` 函数，它有 4 个带默认值的实参。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

调用此函数时，你不必命名所有实参：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

你可以跳过所有带有默认值的实参：

```kotlin
reformat("This is a long String!")
```

你也可以跳过特定的带有默认值的实参，而不是全部省略。但是，在第一个被跳过的实参之后，你必须命名所有后续实参：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

你可以使用_展开操作符_（在数组前加上 `*`）传递[可变数量实参 (`vararg`)](#variable-number-of-arguments-varargs)并命名：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> 在 JVM 上调用 Java 函数时，你不能使用具名实参语法，因为 Java 字节码并不总是保留函数形参的名称。
>
{style="note"}

### 返回 Unit 的函数

如果函数不返回任何有用的值，其返回类型为 `Unit`。`Unit` 是一种只有一个值 `Unit` 的类型。此值不必显式返回：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```

`Unit` 返回类型声明也是可选的。上面的代码等同于：

```kotlin
fun printHello(name: String?) { ... }
```

### 单表达式函数

当函数体由单个表达式组成时，可以省略花括号，并在 `=` 符号后指定函数体：

```kotlin
fun double(x: Int): Int = x * 2
```

当编译器可以推断出返回类型时，显式声明返回类型是[可选的](#explicit-return-types)：

```kotlin
fun double(x: Int) = x * 2
```

### 显式返回类型

带有代码块体的函数必须始终显式指定返回类型，除非它们旨在返回 `Unit`，[在这种情况下指定返回类型是可选的](#unit-returning-functions)。

Kotlin 不会推断带有代码块体的函数的返回类型，因为这类函数在函数体中可能具有复杂的控制流，返回类型对读者（有时甚至对编译器）来说并非显而易见。

### 可变数量实参 (vararg)

你可以用 `vararg` 修饰符标记函数的形参（通常是最后一个）：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```

在这种情况下，你可以向函数传递可变数量的实参：

```kotlin
val list = asList(1, 2, 3)
```

在函数内部，`T` 类型的 `vararg` 形参表现为 `T` 的数组，如上例所示，其中 `ts` 变量的类型为 `Array<out T>`。

只能有一个形参标记为 `vararg`。如果 `vararg` 形参不是列表中的最后一个，则后续形参的值必须使用具名实参语法传递，或者，如果形参是函数类型，则通过在圆括号外传递 lambda 表达式。

当你调用 `vararg` 函数时，你可以单独传递实参，例如 `asList(1, 2, 3)`。如果你已经有一个数组并想将其内容传递给函数，请使用展开操作符（在数组前加上 `*`）：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

如果你想将[原生类型数组](arrays.md#primitive-type-arrays)传递到 `vararg` 中，你需要使用 `toTypedArray()` 函数将其转换为常规（类型化）数组：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray is a primitive type array
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中缀表示法

标记有 `infix` 关键字的函数也可以使用中缀表示法调用（省略点和调用圆括号）。中缀函数必须满足以下要求：

*   它们必须是成员函数或[扩展函数](extensions.md)。
*   它们必须只有一个形参。
*   该形参不得[接受可变数量实参](#variable-number-of-arguments-varargs)，并且不得有[默认值](#parameters-with-default-values)。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// calling the function using the infix notation
1 shl 2

// is the same as
1.shl(2)
```

> 中缀函数调用的优先级低于算术操作符、类型转换和 `rangeTo` 操作符。以下表达式是等价的：
> *   `1 shl 2 + 3` 等价于 `1 shl (2 + 3)`
> *   `0 until n * 2` 等价于 `0 until (n * 2)`
> *   `xs union ys as Set<*>` 等价于 `xs union (ys as Set<*>)`
>
> 另一方面，中缀函数调用的优先级高于布尔操作符 `&&` 和 `||`、`is`- 和 `in`-检测，以及其他一些操作符。这些表达式也是等价的：
> *   `a && b xor c` 等价于 `a && (b xor c)`
> *   `a xor b in c` 等价于 `(a xor b) in c`
>
{style="note"}

请注意，中缀函数总是要求显式指定接收者和形参。当你使用中缀表示法调用当前接收者上的方法时，请显式使用 `this`。这是为了确保清晰的解析。

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // Correct
        add("abc")       // Correct
        //add "abc"        // Incorrect: the receiver must be specified
    }
}
```

## 函数作用域

Kotlin 函数可以在文件的[顶层](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)声明，这意味着你不需要像 Java、C# 和 Scala 等语言那样创建类来包含函数（Scala 3 以后支持顶层定义）。除了顶层函数，Kotlin 函数还可以声明为局部函数、成员函数和扩展函数。

### 局部函数

Kotlin 支持局部函数，它们是函数内部的函数：

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

局部函数可以访问外部函数的局部变量（闭包）。在上面的例子中，`visited` 可以是局部变量：

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

成员函数使用点表示法调用：

```kotlin
Sample().foo() // creates instance of class Sample and calls foo
```

有关类和覆盖成员的更多信息，请参阅[类](classes.md)和[继承](classes.md#inheritance)。

## 泛型函数

函数可以有泛型形参，它们在函数名之前使用尖括号指定：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有关泛型函数的更多信息，请参阅[泛型](generics.md)。

## 尾递归函数

Kotlin 支持一种称为[尾递归](https://en.wikipedia.org/wiki/Tail_call)的函数式编程风格。对于某些通常使用循环的算法，你可以改用递归函数，而没有栈溢出的风险。当函数标记有 `tailrec` 修饰符并满足所需的正式条件时，编译器会优化掉递归，转而生成一个快速高效的基于循环的版本：

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

此代码计算余弦函数的*不动点*，这是一个数学常数。它简单地从 `1.0` 开始重复调用 `Math.cos`，直到结果不再变化，为指定的 `eps` 精度产生 `0.7390851332151611` 的结果。结果代码等同于这种更传统的风格：

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

为了符合 `tailrec` 修饰符的条件，函数必须将其自身作为执行的最后操作来调用。当递归调用之后还有更多代码、在 `try`/`catch`/`finally` 块内或在开放函数上时，你不能使用尾递归。目前，Kotlin for JVM 和 Kotlin/Native 支持尾递归。

**另请参阅**：
*   [内联函数](inline-functions.md)
*   [扩展函数](extensions.md)
*   [高阶函数与 lambda 表达式](lambdas.md)