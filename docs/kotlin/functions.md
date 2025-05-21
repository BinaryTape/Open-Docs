---
title: 函数
---
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

调用成员函数使用点号表示法：

```kotlin
Stream().read() // 创建 Stream 类的实例并调用 read()
```

### 参数

函数参数使用 Pascal 符号定义 - *name*: *type*。参数之间用逗号分隔，并且每个参数都必须显式指定类型：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

声明函数参数时，可以使用[尾随逗号](coding-conventions#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 尾随逗号
) { /*...*/ }
```

### 默认参数

函数参数可以有默认值，当您跳过相应的参数时，将使用这些默认值。这减少了重载的数量：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

通过将 `=` 附加到类型来设置默认值。

重写方法总是使用基方法的默认参数值。当重写具有默认参数值的方法时，必须从签名中省略默认参数值：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // 不允许使用默认值。
}
```

如果默认参数位于没有默认值的参数之前，则只能通过使用[命名参数](#named-arguments)调用函数来使用该默认值：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // 使用默认值 bar = 0
```

如果默认参数之后的最后一个参数是 [lambda](lambdas#lambda-expression-syntax)，则可以将其作为命名参数传递，也可以[在括号外传递](lambdas#passing-trailing-lambdas)：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () `->` Unit,
) { /*...*/ }

foo(1) { println("hello") }     // 使用默认值 baz = 1
foo(qux = { println("hello") }) // 同时使用默认值 bar = 0 和 baz = 1
foo { println("hello") }        // 同时使用默认值 bar = 0 和 baz = 1
```

### 命名参数

调用函数时，您可以命名函数的一个或多个参数。当函数有很多参数并且难以将值与参数关联时，这会很有帮助，尤其是当它是布尔值或 `null` 值时。

在函数调用中使用命名参数时，您可以自由更改它们在其中列出的顺序。 如果想使用它们的默认值，可以完全省略这些参数。

考虑 `reformat()` 函数，它有 4 个带有默认值的参数。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

调用此函数时，您不必命名其所有参数：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

您可以跳过所有具有默认值的参数：

```kotlin
reformat("This is a long String!")
```

您还可以跳过具有默认值的特定参数，而不是全部省略它们。但是，在第一个跳过的参数之后，您必须命名所有后续参数：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

您可以使用 `spread` 运算符传递带有名称的[可变数量的参数 (`vararg`)](#variable-number-of-arguments-varargs)：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

:::note
在 JVM 上调用 Java 函数时，您不能使用命名参数语法，因为 Java 字节码并不总是保留函数参数的名称。

:::

### Unit 返回函数

如果函数不返回有用的值，则其返回类型为 `Unit`。`Unit` 是一种只有唯一值 `Unit` 的类型。此值不必显式返回：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```

`Unit` 返回类型声明也是可选的。上面的代码等效于：

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

具有块主体的函数必须始终显式指定返回类型，除非它们旨在返回 `Unit`，[在这种情况下，指定返回类型是可选的](#unit-returning-functions)。

Kotlin 不会推断具有块主体的函数的返回类型，因为此类函数可能在主体中具有复杂的控制流，并且返回类型对于读者（有时甚至对于编译器）来说并不明显。

### 可变数量的参数 (varargs)

您可以使用 `vararg` 修饰符标记函数的参数（通常是最后一个）：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```

在这种情况下，您可以将可变数量的参数传递给函数：

```kotlin
val list = asList(1, 2, 3)
```

在函数内部，类型 `T` 的 `vararg` 参数可见为 `T` 类型的数组，如上面的示例所示，其中 `ts` 变量的类型为 `Array<out T>`。

只能将一个参数标记为 `vararg`。如果 `vararg` 参数不是列表中的最后一个，则可以使用命名参数语法传递后续参数的值，或者，如果该参数具有函数类型，则可以通过在括号外传递 lambda 来传递。

调用 `vararg` 函数时，您可以单独传递参数，例如 `asList(1, 2, 3)`。 如果您已经有一个数组并希望将其内容传递给函数，请使用 *spread* 运算符（用 `*` 前缀数组）：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

如果要将[原始类型数组](arrays#primitive-type-arrays)传递到 `vararg` 中，则需要使用 `toTypedArray()` 函数将其转换为常规（类型化）数组：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray 是原始类型数组
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中缀表示法 (Infix notation)

用 `infix` 关键字标记的函数也可以使用中缀表示法调用（省略调用的点和括号）。 中缀函数必须满足以下要求：

* 它们必须是成员函数或[扩展函数](extensions)。
* 它们必须只有一个参数。
* 该参数不能[接受可变数量的参数](#variable-number-of-arguments-varargs)并且不能有[默认值](#default-arguments)。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// 使用中缀表示法调用函数
1 shl 2

// 等同于
1.shl(2)
```

:::note
中缀函数调用比算术运算符、类型转换和 `rangeTo` 运算符的优先级低。
以下表达式是等效的：
* `1 shl 2 + 3` 等效于 `1 shl (2 + 3)`
* `0 until n * 2` 等效于 `0 until (n * 2)`
* `xs union ys as Set<*>` 等效于 `xs union (ys as Set<*>)`

另一方面，中缀函数调用的优先级高于布尔运算符 `&&` 和 `||`、`is`- 和 `in`-checks 以及其他一些运算符。 这些表达式也是等效的：
* `a && b xor c` 等效于 `a && (b xor c)`
* `a xor b in c` 等效于 `(a xor b) in c`

:::

请注意，中缀函数始终需要指定接收者和参数。 当您使用中缀表示法在当前接收者上调用方法时，请显式使用 `this`。 这是确保明确解析所必需的。

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

## 函数作用域 (Function scope)

Kotlin 函数可以在文件中顶级声明，这意味着您不需要创建一个类来保存函数，这在 Java、C# 和 Scala 等语言中是必需的（[自 Scala 3 起提供顶级定义](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）。 除了顶级函数之外，Kotlin 函数还可以本地声明为成员函数和扩展函数。

### 局部函数 (Local functions)

Kotlin 支持局部函数，即其他函数内部的函数：

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

局部函数可以访问外部函数的局部变量（闭包）。 在上面的例子中，`visited` 可以是一个局部变量：

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

### 成员函数 (Member functions)

成员函数是在类或对象内部定义的函数：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

成员函数使用点号表示法调用：

```kotlin
Sample().foo() // 创建 Sample 类的实例并调用 foo
```

有关类和重写成员的更多信息，请参见[类](classes)和[继承](classes#inheritance)。

## 泛型函数 (Generic functions)

函数可以具有泛型参数，这些参数使用尖括号在函数名称之前指定：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有关泛型函数的更多信息，请参见[泛型](generics)。

## 尾递归函数 (Tail recursive functions)

Kotlin 支持一种称为[尾递归](https://en.wikipedia.org/wiki/Tail_call)的函数式编程风格。 对于某些通常使用循环的算法，您可以改用递归函数，而不会有堆栈溢出的风险。 当一个函数用 `tailrec` 修饰符标记并满足所需的正式条件时，编译器会优化掉递归，从而留下一个快速有效的基于循环的版本：

```kotlin
val eps = 1E-10 // "足够好"，可以是 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

此代码计算余弦的 `fixpoint`，这是一个数学常数。 它只是从 `1.0` 开始重复调用 `Math.cos`，直到结果不再改变，从而为指定的 `eps` 精度产生 `0.7390851332151611` 的结果。 生成的代码等效于这种更传统的风格：

```kotlin
val eps = 1E-10 // "足够好"，可以是 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

要符合 `tailrec` 修饰符的条件，函数必须调用自身作为其执行的最后一个操作。 当递归调用之后有更多代码，在 `try`/`catch`/`finally` 块中，或者在开放函数上时，您不能使用尾递归。 目前，Kotlin 对 JVM 和 Kotlin/Native 支持尾递归。

**另请参见**:
* [内联函数](inline-functions)
* [扩展函数](extensions)
* [高阶函数和 lambda](lambdas)