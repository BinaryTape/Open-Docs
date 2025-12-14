[//]: # (title: 函数)

在 Kotlin 中声明函数：
* 使用 `fun` 关键字。
* 在圆括号 `()` 中指定形参。
* 如有需要，包含[返回类型](#return-types)。

例如：

```kotlin
//sampleStart
// 'double' 是函数的名称
// 'x' 是 Int 类型的形参
// 期望的返回值也是 Int 类型
fun double(x: Int): Int {
return 2 * x
}
//sampleEnd

fun main() {
    println(double(5))
    // 10
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="kotlin-function-double"}

## 函数用法

函数使用标准方式调用：

```kotlin
val result = double(2)
```

要调用[成员](classes.md)或[扩展函数](extensions.md#extension-functions)，请使用点号 `.`：

```kotlin
// 创建 Stream 类的实例并调用 read()
Stream().read()
```

### 形参

使用帕斯卡表示法声明函数形参：`name: Type`。
你必须使用逗号分隔形参，并显式指定每个形参的类型：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

在函数体内部，接收到的实参是只读的（隐式声明为 `val`）：

```kotlin
fun powerOf (number: Int, exponent: Int): Int {
    number = 2 // 错误：'val' 不能重新赋值。
}
```

声明函数形参时，你可以使用[尾部逗号](coding-conventions.md#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 尾部逗号
) { /*...*/ }
```

尾部逗号有助于重构和代码维护：你可以在声明中移动形参，而不必担心哪个会是最后一个。

> Kotlin 函数可以接收其他函数作为形参——并作为实参传递。
> 有关更多信息，请参见 [](lambdas.md)。
>
{style="note"}

### 带有默认值的形参 {id="parameters-with-default-values"}

你可以通过为函数形参指定默认值来使其成为可选的。
当你调用函数时没有提供与该形参对应的实参，Kotlin 会使用其默认值。
带有默认值的形参也称为 _可选形参_。

可选形参减少了重载的需要，因为你无需仅仅为了允许跳过带有合理默认值的形参而声明函数的不同版本。

通过在形参声明后追加 `=` 来设置默认值：

```kotlin
fun read(
    b: ByteArray,
    // 'off' 的默认值为 0
    off: Int = 0,
    // 'len' 的默认值是通过计算得到的
    // 作为 'b' 数组的大小
    len: Int = b.size,
) { /*...*/ }
```

当你声明一个**带**默认值的形参在**没有**默认值的形参之前时，你只能通过[具名实参](#named-arguments)来使用其默认值：

```kotlin
fun greeting(
    userId: Int = 0,
    message: String,
) { /*...*/ }

fun main () {
    // 使用 0 作为 'userId' 的默认值
    greeting(message = "Hello!")

    // 错误：未为形参 'userId' 传递值
    greeting("Hello!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="default-before-ordinary"}

[尾部 lambda 表达式](lambdas.md#passing-trailing-lambdas)是此规则的一个例外，因为最后一个形参必须对应于传递的函数：

```kotlin
fun main () {
//sampleStart    
fun greeting(
    userId: Int = 0,
    message: () -> Unit,
)
{ println(userId)
  message() }

// 使用 'userId' 的默认值
greeting() { println ("Hello!") }
// 0
// Hello!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="default-before-trailing-lambda"}

[覆盖方法](inheritance.md#overriding-methods)总是使用基方法的默认形参值。
当你覆盖一个具有默认形参值的方法时，你必须从签名中省略默认形参值：

```kotlin
open class Shape {
    open fun draw(width: Int = 10, height: Int = 5) { /*...*/ }
}

class Rectangle : Shape() {
    // 这里不允许指定默认值
    // 但此函数默认也使用 10 作为 'width' 和 5 作为 'height'
    // 的值。
    override fun draw(width: Int, height: Int) { /*...*/ }
}
```

#### 作为默认值的非常量表达式

你可以为形参指定一个非常量默认值。
例如，默认值可以是函数调用的结果，或者是使用其他实参值进行计算的结果，就像本例中的 `len` 形参一样：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

引用其他形参值的形参必须在声明顺序中靠后声明。
在本例中，`len` 必须在 `b` 之后声明。

通常，你可以将任何表达式作为形参的默认值。
然而，默认值仅在调用函数时**未**提供相应形参且需要赋值默认值时才会被求值。
例如，此函数仅在调用时不带 `print` 形参时才会打印一行内容：

```kotlin
fun main() {
//sampleStart
fun read(
    b: Int,
    print: Unit? = println("No argument passed for 'print'")
) { println(b) }

// 打印 "No argument passed for 'print'"，然后是 "1"
read (1)
// 仅打印 "1"
read (1, null)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="non-constant-default"}

如果函数声明中的最后一个形参是函数类型，你可以将对应的 [lambda 表达式](lambdas.md#lambda-expression-syntax)实参作为具名实参传递，或者[在圆括号外](lambdas.md#passing-trailing-lambdas)传递：

```kotlin
fun main() {
//sampleStart
fun log(
    level: Int = 0,
    code:  Int = 1,
    action: () -> Unit,
) { println (level)
    println (code)
    action() }

// 为 'level' 传递 1，并使用 1 作为 'code' 的默认值
log(1) { println("Connection established") }

// 使用两个默认值，'level' 为 0，'code' 为 1
log(action = { println("Connection established") })

// 等同于上一个调用，使用两个默认值
log { println("Connection established") }
//sampleEnd   
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="lambda-outside-parentheses"}

### 具名实参

调用函数时，你可以为函数的一个或多个实参命名。
当函数调用有许多实参时，这会很有帮助。
在这种情况下，将值与实参关联起来很困难，尤其是当它是 `null` 或布尔值时。

当你使用具名实参调用函数时，你可以自由更改它们的顺序。

考虑 `reformat()` 函数，它有 4 个带默认值的实参：

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

调用此函数时，你可以命名部分实参：

```kotlin
reformat(
    "String!",
    normalizeCase = false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

你可以跳过所有带有默认值的实参：

```kotlin
reformat("This is a long String!")
```

你也可以跳过_部分_带默认值的实参，而不是全部省略。
但是，在第一个被跳过的实参之后，你必须命名所有后续实参：

```kotlin
reformat(
    "This is a short String!",
    upperCaseFirstLetter = false,
    wordSeparator = '_'
)
```

你可以通过命名相应的实参来传递[可变数量实参](#variable-number-of-arguments-varargs) (`vararg`)。
在本例中，它是一个数组：

```kotlin
fun mergeStrings(vararg strings: String) { /*...*/ }

mergeStrings(strings = arrayOf("a", "b", "c"))
```

> 在 JVM 上调用 Java 函数时，你不能使用具名实参语法，因为 Java 字节码并不总是保留函数形参的名称。
>
{style="note"}

### 返回类型

当你声明一个带代码块体（通过将指令放入花括号 `{}` 中）的函数时，你必须始终显式指定返回类型。
唯一的例外是当它们返回 `Unit` 时，[在这种情况下，指定返回类型是可选的](#unit-returning-functions)。

Kotlin 不会推断带代码块体函数的返回类型。
它们的控制流可能很复杂，这使得返回类型对读者（有时甚至对编译器）来说都不明确。
然而，如果你不指定返回类型，Kotlin 可以为[单表达式函数](#single-expression-functions)推断返回类型。

### 单表达式函数

当函数体由单个表达式组成时，可以省略花括号，并在 `=` 符号后指定函数体：

```kotlin
fun double(x: Int): Int = x * 2
```

大多数情况下，你无需显式声明[返回类型](#return-types)：

```kotlin
// 编译器推断该函数返回 Int
fun double(x: Int) = x * 2
```

编译器有时在从单表达式推断返回类型时会遇到问题。
在这种情况下，你应该显式添加返回类型。
例如，递归或相互递归（互相调用）的函数以及带有无类型表达式（如 `fun empty() = null`）的函数总是需要返回类型。

当你确实使用推断的返回类型时，请务必检查实际结果，因为编译器推断的类型可能对你来说不太有用。
在上面的例子中，如果你希望 `double()` 函数返回 `Number` 而不是 `Int`，你必须显式声明这一点。

### 返回 Unit 的函数

如果一个函数有一个代码块体（花括号 `{}` 中的指令）并且不返回任何有用的值，编译器会假定它的返回类型是 `Unit`。
`Unit` 是一种只有一个值 `Unit` 的类型。

你不需要将 `Unit` 指定为返回类型，函数类型形参除外。
你从不需要显式返回 `Unit`。

例如，你可以声明一个 `printHello()` 函数而不返回 `Unit`：

```kotlin
// 函数类型形参 ('action') 的声明仍然
// 需要显式返回类型
fun printHello(name: String?, action: () -> Unit) {
  if (name != null)
    println("Hello $name")
  else
    println("Hi there!")

  action()
}

fun main() {
  printHello("Kodee") {
    println("This runs after the greeting.")
  }
  // Hello Kodee
  // This runs after the greeting.

  printHello(null) {
    println("No name provided, but action still runs.")
  }
  // No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-implicit"}

这等同于以下冗长的声明：

```kotlin
//sample Start
fun printHello(name: String?, action: () -> Unit): Unit {
  if (name != null)
    println("Hello $name")
  else
    println("Hi there!")

  action()
  return Unit
}
// sampleEnd
fun main() {
  printHello("Kodee") {
    println("This runs after the greeting.")
  }
  // Hello Kodee
  // This runs after the greeting.

  printHello(null) {
    println("No name provided, but action still runs.")
  }
  // No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-explicit"}

### 可变数量实参 (vararg)

要将可变数量的实参传递给函数，你可以使用 `vararg` 修饰符标记其形参之一（通常是最后一个）。
在函数内部，你可以将 `T` 类型的 `vararg` 形参用作 `T` 的数组：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts 是一个 Array
        result.add(t)
    return result
}
```

然后你可以向函数传递可变数量的实参：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts 是一个 Array
    result.add(t)
  return result
}

fun main() {
  //sampleStart
  val list = asList(1, 2, 3)
  println(list)
  // [1, 2, 3]
  //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist"}

只能有一个形参标记为 `vararg`。
如果你在形参列表中的非最后位置声明 `vararg` 形参，则必须使用具名实参传递后续形参的值。
如果形参是函数类型，你也可以通过将 lambda 表达式放在圆括号之外来传递其值。

当你调用 `vararg` 函数时，你可以单独传递实参，例如 `asList(1, 2, 3)`。
如果你已经有一个数组并想将其内容作为 `vararg` 形参或其一部分传递给函数，请使用[展开操作符](arrays.md#pass-variable-number-of-arguments-to-a-function)，在数组名前加上 `*`：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts)
    result.add(t)
  return result
}

fun main() {
  //sampleStart
  val a = arrayOf(1, 2, 3)

  // 函数接收数组 [-1, 0, 1, 2, 3, 4]
  val list = asList(-1, 0, *a, 4)

  println(list)
  // [-1, 0, 1, 2, 3, 4]

  //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist-with-array"}

如果你想将[原生类型数组](arrays.md#primitive-type-arrays)作为 `vararg` 传递，你需要使用 [`.toTypedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-typed-array.html) 函数将其转换为常规（类型化）数组：

```kotlin
// 'a' 是一个 IntArray，它是一个原生类型数组
val a = intArrayOf(1, 2, 3)
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中缀表示法

你可以使用 `infix` 关键字声明可以不带圆括号或点号调用的函数。
这有助于使代码中的简单函数调用更易读。

```kotlin
infix fun Int.shl(x: Int): Int { /*...*/ }

// 使用通用表示法调用函数
1.shl(2)

// 使用中缀表示法调用函数
1 shl 2
```

中缀函数必须满足以下要求：

* 它们必须是类的成员函数或[扩展函数](extensions.md)。
* 它们必须只有一个形参。
* 该形参不得[接受可变数量实参](#variable-number-of-arguments-varargs) (`vararg`)，并且不得有[默认值](#parameters-with-default-values)。

> 中缀函数调用的优先级低于算术操作符、类型转换和 `rangeTo` 操作符。
> 以下表达式是等价的：
> * `1 shl 2 + 3` 等价于 `1 shl (2 + 3)`
> * `0 until n * 2` 等价于 `0 until (n * 2)`
> * `xs union ys as Set<*>` 等价于 `xs union (ys as Set<*>)`
>
> 另一方面，中缀函数调用的优先级高于布尔操作符 `&&` 和 `||`、`is`- 和 `in`-检测以及其他一些操作符。这些表达式也是等价的：
> * `a && b xor c` 等价于 `a && (b xor c)`
> * `a xor b in c` 等价于 `(a xor b) in c`
>
{style="note"}

请注意，中缀函数总是要求显式指定接收者和形参。
当你使用中缀表示法调用当前接收者上的方法时，请显式使用 `this`。
这确保了清晰的解析。

```kotlin
class MyStringCollection {
  val items = mutableListOf<String>()

  infix fun add(s: String) {
    println("Adding: $s")
    items += s
  }

  fun build() {
      add("first")       // 正确：普通函数调用
      this add "second"  // 正确：带显式接收者的中缀调用
      // add "third"     // 编译器错误：需要显式接收者
  }

  fun printAll() = println("Items = $items")
}

fun main() {
  val myStrings = MyStringCollection()
  // 将 "first" 和 "second" 添加到列表中两次
  myStrings.build()

  myStrings.printAll()
  // Adding: first
  // Adding: second
  // Items = [first, second]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="infix-notation-example"}

## 函数作用域

Kotlin 函数可以在文件的顶层声明，这意味着你不需要像 Java、C# 和 Scala 等语言那样创建类来包含函数。
函数也可以作为 _局部函数_、_成员函数_ 或 _扩展函数_ 在本地声明。

### 局部函数

Kotlin 支持局部函数，它们是函数内部的函数。
例如，以下代码为给定图实现了深度优先搜索算法。
外部 `dfs()` 函数内部的局部 `dfs()` 函数用于隐藏实现并处理递归调用：

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    fun dfs(current: Person, visited: MutableSet<Person>) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend, visited)
    }
    dfs(graph.people[0], HashSet())
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs"}

局部函数可以访问外部函数的局部变量（闭包）。
在上面的例子中，`visited` 函数形参可以是局部变量：

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    val visited = HashSet<Person>()
    fun dfs(current: Person) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend)
    }
    dfs(graph.people[0])
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs-with-local-variable"}

### 成员函数

成员函数是定义在类或对象内部的函数：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

要调用成员函数，请写入实例或对象名称，然后添加一个 `.` 并写入函数名称：

```kotlin
// 创建 Stream 类的实例并调用 read()
Stream().read()
```

有关类和覆盖成员的更多信息，请参见[类](classes.md)和[继承](classes.md#inheritance)。

## 泛型函数

你可以通过在函数名之前使用尖括号 `<>` 来指定函数的泛型形参：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有关泛型函数的更多信息，请参见[泛型](generics.md)。

## 尾递归函数

Kotlin 支持一种称为[尾递归](https://en.wikipedia.org/wiki/Tail_call)的函数式编程风格。
对于某些通常使用循环的算法，你可以改用递归函数，而没有栈溢出的风险。
当函数标记有 `tailrec` 修饰符并满足所需的正式条件时，编译器会优化掉递归，转而生成一个快速高效的基于循环的版本：

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 一个任意的“足够好”的精度
val eps = 1E-10

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (abs(x - cos(x)) < eps) x else findFixPoint(cos(x))
```

此代码计算余弦函数的*不动点*（一个数学常数）。
该函数从 `1.0` 开始重复调用 `cos()`，直到结果不再变化，为指定的 `eps` 精度产生 `0.7390851332151611` 的结果。
结果代码等同于这种更传统的风格：

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 一个任意的“足够好”的精度
val eps = 1E-10

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = cos(x)
        if (abs(x - y) < eps) return x
        x = cos(x)
    }
}
```

你只能在函数将其自身作为执行的最后操作来调用时，才能对其应用 `tailrec` 修饰符。
当递归调用之后还有更多代码、在 [`try`/`catch`/`finally` 块](exceptions.md#handle-exceptions-using-try-catch-blocks)内，或在开放函数上时，你不能使用尾递归。

**另请参阅**：
* [内联函数](inline-functions.md)
* [扩展函数](extensions.md)
* [高阶函数与 lambda 表达式](lambdas.md)