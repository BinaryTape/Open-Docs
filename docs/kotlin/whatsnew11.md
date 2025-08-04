[//]: # (title: Kotlin 1.1 新特性)

发布日期：2016 年 2 月 15 日

## 目录

* [协程](#coroutines-experimental)
* [其他语言特性](#other-language-features)
* [标准库](#standard-library)
* [JVM 后端](#jvm-backend)
* [JavaScript 后端](#javascript-backend)

## JavaScript

从 Kotlin 1.1 开始，JavaScript 目标平台不再被视为实验性的。所有语言特性都已支持，并且提供了许多新工具用于与前端开发环境集成。关于更详细的变更列表，请参见[下文](#javascript-backend)。

## 协程 (实验性的)

Kotlin 1.1 中的关键新特性是 *协程*，它带来了 `async`/`await`、`yield` 以及类似编程模式的支持。Kotlin 设计的一个关键特性是协程执行的实现是库的一部分，而不是语言的一部分，因此您不受任何特定编程范式或并发库的约束。

协程本质上是一种轻量级线程，可以被挂起并在稍后恢复。协程通过 _[挂起函数](coroutines-basics.md#extract-function-refactoring)_ 提供支持：调用此类函数可能会挂起协程，并且要启动一个新协程，我们通常使用匿名挂起函数（即挂起 lambda 表达式）。

让我们看看在外部库 [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines) 中实现的 `async`/`await`：

```kotlin
// runs the code in the background thread pool
fun asyncOverlay() = async(CommonPool) {
    // start two async operations
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // and then apply overlay to both results
    applyOverlay(original.await(), overlay.await())
}

// launches new coroutine in UI context
launch(UI) {
    // wait for async overlay to complete
    val image = asyncOverlay().await()
    // and then show it in UI
    showImage(image)
}
```

这里，`async { ... }` 启动一个协程，当我们使用 `await()` 时，协程的执行会被挂起，直到等待的操作执行完毕，然后在等待的操作完成时恢复（可能在不同的线程上）。

标准库使用协程通过 `yield` 和 `yieldAll` 函数支持 *惰性生成序列*。在这样的序列中，返回序列元素的代码块在每个元素被检索后挂起，并在请求下一个元素时恢复。例如：

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
    val seq = buildSequence {
      for (i in 1..5) {
          // yield a square of i
          yield(i * i)
      }
      // yield a range
      yieldAll(26..28)
    }

    // print the sequence
    println(seq.toList())
}
```

运行上述代码即可查看结果。随意编辑并再次运行！

关于更多信息，请参考 [协程文档](coroutines-overview.md) 和 [教程](coroutines-and-channels.md)。

请注意，协程目前被视为**实验性的特性**，这意味着 Kotlin 团队不承诺在 1.1 最终发布后支持此特性的向后兼容性。

## 其他语言特性

### 类型别名

类型别名允许您为现有类型定义一个替代名称。这对于泛型（例如集合）以及函数类型最有用。例如：

```kotlin
//sampleStart
typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// Note that the type names (initial and the type alias) are interchangeable:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"
//sampleEnd

fun oscarWinners(): OscarWinners {
    return mapOf(
            "Best song" to "City of Stars (La La Land)",
            "Best actress" to "Emma Stone (La La Land)",
            "Best picture" to "Moonlight" /* ... */)
}

fun main(args: Array<String>) {
    val oscarWinners = oscarWinners()

    val laLaLandAwards = countLaLaLand(oscarWinners)
    println("LaLaLandAwards = $laLaLandAwards (in our small example), but actually it's 6.")

    val laLaLandIsTheBestMovie = checkLaLaLandIsTheBestMovie(oscarWinners)
    println("LaLaLandIsTheBestMovie = $laLaLandIsTheBestMovie")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于更多细节，请参见 [类型别名文档](type-aliases.md) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md)。

### 绑定可调用引用

您现在可以使用 `::` 操作符获取指向特定对象实例的方法或属性的[成员引用](reflection.md#function-references)。以前，这只能通过 lambda 表达式来表达。例如：

```kotlin
//sampleStart
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
//sampleEnd

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于更多细节，请参阅 [文档](reflection.md) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md)。

### 密封类与数据类

Kotlin 1.1 移除了一些 Kotlin 1.0 中存在的对密封类和数据类的限制。现在，您可以在同一文件中的顶层定义顶层密封类的子类，而不仅仅是将其作为密封类的嵌套类。数据类现在可以扩展其他类。这可以用来优雅地定义表达式类的层次结构：

```kotlin
//sampleStart
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))
//sampleEnd

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于更多细节，请参阅 [密封类文档](sealed-classes.md) 或 [密封类](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md) 和 [数据类](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md) 的 KEEPs。

### lambda 表达式中的解构

您现在可以使用 [解构声明](destructuring-declarations.md) 语法来解包传递给 lambda 表达式的实参。例如：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf(1 to "one", 2 to "two")
    // before
    println(map.mapValues { entry ->
      val (key, value) = entry
      "$key -> $value!"
    })
    // now
    println(map.mapValues { (key, value) -> "$key -> $value!" })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于更多细节，请参阅 [解构声明文档](destructuring-declarations.md) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md)。

### 用于未使用形参的下划线

对于具有多个形参的 lambda 表达式，您可以使用 `_` 字符来替换您不使用的形参名称：

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这也适用于 [解构声明](destructuring-declarations.md)：

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {
//sampleStart
    val (_, status) = getResult()
//sampleEnd
    println("status is '$status'")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于更多细节，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md)。

### 数值字面量中的下划线

正如在 Java 8 中一样，Kotlin 现在允许在数值字面量中使用下划线来分隔数字组：

```kotlin
//sampleStart
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
//sampleEnd

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于更多细节，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md)。

### 属性的更短语法

对于 getter 定义为表达式体的属性，现在可以省略属性类型：

```kotlin
//sampleStart
    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // Property type inferred to be 'Boolean'
}
//sampleEnd
fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 内联属性访问器

如果属性没有幕后字段，您现在可以使用 `inline` 修饰符标记属性访问器。此类访问器的编译方式与 [内联函数](inline-functions.md) 相同。

```kotlin
//sampleStart
public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1
//sampleEnd

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // the getter will be inlined
    println("Last index of $list is ${list.lastIndex}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以将整个属性标记为 `inline` —— 这样修饰符将应用于两个访问器。

关于更多细节，请参阅 [内联函数文档](inline-functions.md#inline-properties) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md)。

### 局部委托属性

您现在可以将 [委托属性](delegated-properties.md) 语法与局部变量一起使用。一种可能的用途是定义惰性求值的局部变量：

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {
//sampleStart
    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // returns the random value
        println("The answer is $answer.")   // answer is calculated at this point
    }
    else {
        println("Sometimes no answer is the answer...")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于更多细节，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md)。

### 委托属性绑定的拦截

对于 [委托属性](delegated-properties.md)，现在可以使用 `provideDelegate` 操作符拦截委托到属性的绑定。例如，如果要在绑定前检测属性名称，可以这样编写：

```kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        ... // property creation
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

在创建 `MyUI` 实例期间，`provideDelegate` 方法将为每个属性调用，并且可以立即执行必要的验证。

关于更多细节，请参阅 [委托属性文档](delegated-properties.md)。

### 泛型枚举值访问

现在可以以泛型方式枚举枚举类的所有值。

```kotlin
//sampleStart
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}
//sampleEnd

fun main(args: Array<String>) {
    printAllValues<RGB>() // prints RED, GREEN, BLUE
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### DSL 中隐式接收者的作用域控制

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 注解允许在 DSL 上下文中限制外部作用域接收者的使用。考虑经典的 [HTML 构建器示例](type-safe-builders.md)：

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

在 Kotlin 1.0 中，传递给 `td` 的 lambda 表达式中的代码可以访问三个隐式接收者：传递给 `table` 的、传递给 `tr` 的和传递给 `td` 的。这允许您调用在当前上下文中无意义的方法——例如，在 `td` 内部调用 `tr`，从而将 `<tr>` 标签放入 `<td>` 中。

在 Kotlin 1.1 中，您可以限制这一点，使得只有在 `td` 的隐式接收者上定义的方法才可在传递给 `td` 的 lambda 表达式内部可用。您可以通过定义带有 `@DslMarker` 元注解标记的注解并将其应用于标签类的基类来完成此操作。

关于更多细节，请参阅 [类型安全构建器文档](type-safe-builders.md) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md)。

### rem 操作符

`mod` 操作符现在已废弃，取而代之的是使用 `rem`。关于动机，请参见 [此问题](https://youtrack.jetbrains.com/issue/KT-14650)。

## 标准库

### 字符串到数字转换

String 类上有一系列新的扩展函数，用于将其转换为数字而不会在数字无效时抛出异常：`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?` 等。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

此外，整数转换函数，如 `Int.toString()`、`String.toInt()`、`String.toIntOrNull()`，每个都获得了带有 `radix` 形参的重载，允许指定转换的基数（2 到 36）。

### onEach()

`onEach` 是一个小型但有用的集合和序列扩展函数，它允许在操作链中对集合/序列的每个元素执行一些操作，可能伴随副作用。在可迭代对象上，它的行为类似于 `forEach`，但也会进一步返回可迭代实例。在序列上，它返回一个包装序列，该序列在元素被迭代时惰性地应用给定操作。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also()、takeIf() 和 takeUnless()

这些是适用于任何接收者的三个通用扩展函数。

`also` 类似于 `apply`：它接收者，对其执行一些操作，然后返回该接收者。区别在于，在 `apply` 内部的代码块中，接收者以 `this` 形式可用，而在 `also` 内部的代码块中，它以 `it` 形式可用（如果您愿意，可以给它起另一个名称）。当您不希望遮蔽外部作用域的 `this` 时，这会很方便：

```kotlin
class Block {
    lateinit var content: String
}

//sampleStart
fun Block.copy() = Block().also {
    it.content = this.content
}
//sampleEnd

// using 'apply' instead
fun Block.copy1() = Block().apply {
    this.content = this@copy1.content
}

fun main(args: Array<String>) {
    val block = Block().apply { content = "content" }
    val copy = block.copy()
    println("Testing the content was copied:")
    println(block.content == copy.content)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 类似于单值的 `filter`。它检测接收者是否符合谓词，如果符合则返回接收者，否则返回 `null`。结合 elvis 操作符 (?:) 和提前返回，它允许编写如下构造：

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

//sampleStart
    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // do something with index of keyword in input string, given that it's found
//sampleEnd

    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeUnless` 与 `takeIf` 相同，但它接受反向谓词。当接收者不符合谓词时它返回接收者，否则返回 `null`。因此，上述其中一个示例可以用 `takeUnless` 重写如下：

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

当您拥有可调用引用而不是 lambda 表达式时，使用起来也很方便：

```kotlin
private fun testTakeUnless(string: String) {
//sampleStart
    val result = string.takeUnless(String::isEmpty)
//sampleEnd

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### groupingBy()

此 API 可用于按键对集合进行分组并同时折叠每个组。例如，它可用于统计以每个字母开头的单词数量：

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')
//sampleStart
    val frequencies = words.groupingBy { it.first() }.eachCount()
//sampleEnd
    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) -> list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.toMap() 和 Map.toMutableMap()

这些函数可用于轻松复制 map：

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 操作符提供了一种向只读 map 添加键值对以生成新 map 的方法，但以前没有一种简单的方法可以做相反的事情：要从 map 中移除键，您必须求助于不太直接的方法，例如 `Map.filter()` 或 `Map.filterKeys()`。现在 `minus` 操作符填补了这个空白。有 4 个重载可用：用于移除单个键、键集合、键序列和键数组。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    val emptyMap = map - "key"
//sampleEnd

    println("map: $map")
    println("emptyMap: $emptyMap")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### minOf() 和 maxOf()

这些函数可用于查找两个或三个给定值中的最小值和最大值，其中这些值是基本数字或 `Comparable` 对象。每个函数还有一个重载，它接受一个额外的 `Comparator` 实例，如果您想比较本身不可比较的对象。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })
//sampleEnd

    println("minSize = $minSize")
    println("longestList = $longestList")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 类似数组的 List 实例化函数

类似于 `Array` 构造函数，现在有函数可以创建 `List` 和 `MutableList` 实例，并通过调用 lambda 表达式来初始化每个元素：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val squares = List(10) { index -> index * index }
    val mutable = MutableList(10) { 0 }
//sampleEnd

    println("squares: $squares")
    println("mutable: $mutable")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.getValue()

`Map` 上的这个扩展函数返回与给定键对应的现有值，否则抛出异常，并指出哪个键未找到。如果 map 是用 `withDefault` 生成的，此函数将返回默认值而不是抛出异常。

```kotlin
fun main(args: Array<String>) {
//sampleStart    
    val map = mapOf("key" to 42)
    // returns non-nullable Int value 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k -> k.length }
    // returns 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // <- this will throw NoSuchElementException
//sampleEnd

    println("value is $value")
    println("value2 is $value2")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 抽象集合

这些抽象类可以在实现 Kotlin 集合类时用作基类。对于实现只读集合，有 `AbstractCollection`、`AbstractList`、`AbstractSet` 和 `AbstractMap`，对于可变集合，有 `AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet` 和 `AbstractMutableMap`。在 JVM 上，这些抽象可变集合从 JDK 的抽象集合继承了大部分功能。

### 数组操作函数

标准库现在提供了一组用于对数组进行逐元素操作的函数：比较（`contentEquals` 和 `contentDeepEquals`）、哈希码计算（`contentHashCode` 和 `contentDeepHashCode`）以及转换为字符串（`contentToString` 和 `contentDeepToString`）。它们既支持 JVM（在其中它们充当 `java.util.Arrays` 中相应函数的别名）也支持 JS（在其中实现由 Kotlin 标准库提供）。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## JVM 后端

### Java 8 字节码支持

Kotlin 现在可以选择生成 Java 8 字节码（`-jvm-target 1.8` 命令行选项或 Ant/Maven/Gradle 中对应的选项）。目前，这不会改变字节码的语义（特别是，接口中的默认方法和 lambda 表达式的生成方式与 Kotlin 1.0 中完全相同），但我们计划稍后进一步利用此特性。

### Java 8 标准库支持

现在有独立版本的标准库支持 Java 7 和 8 中添加的新 JDK API。如果需要访问新的 API，请使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8` Maven 构件而不是标准 `kotlin-stdlib`。这些构件是 `kotlin-stdlib` 之上的微小扩展，它们将其作为传递性依赖项引入您的项目。

### 字节码中的形参名称

Kotlin 现在支持在字节码中存储形参名称。可以使用 `-java-parameters` 命令行选项启用此功能。

### 常量内联

编译器现在将 `const val` 属性的值内联到它们被使用的地方。

### 可变闭包变量

用于捕获 lambda 表达式中可变闭包变量的装箱类不再具有 volatile 字段。此更改提高了性能，但在某些罕见的使用场景中可能导致新的竞态条件。如果受此影响，您需要为访问变量提供您自己的同步机制。

### javax.script 支持

Kotlin 现在与 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223) 集成。该 API 允许在运行时求值代码片段：

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

关于使用该 API 的更大示例项目，请参见 [此处](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)。

### kotlin.reflect.full

为了 [为 Java 9 支持做准备](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)，`kotlin-reflect.jar` 库中的扩展函数和属性已移至 `kotlin.reflect.full` 包。旧包 (`kotlin.reflect`) 中的名称已废弃，并将在 Kotlin 1.2 中移除。请注意，核心反射接口（例如 `KClass`）是 Kotlin 标准库的一部分，而非 `kotlin-reflect`，不受此移动的影响。

## JavaScript 后端

### 统一标准库

Kotlin 标准库的更大一部分现在可以从编译为 JavaScript 的代码中使用。特别是，诸如集合 (`ArrayList`、`HashMap` 等)、异常 (`IllegalArgumentException` 等) 以及其他一些 (`StringBuilder`、`Comparator`) 关键类现在定义在 `kotlin` 包下。在 JVM 上，这些名称是对应 JDK 类的类型别名，而在 JS 上，这些类在 Kotlin 标准库中实现。

### 更好的代码生成

JavaScript 后端现在生成更多可静态检测的代码，这对于 JS 代码处理工具（如代码压缩器、优化器、linter 等）更友好。

### external 修饰符

如果需要以类型安全的方式从 Kotlin 访问在 JavaScript 中实现的类，可以使用 `external` 修饰符编写 Kotlin 声明。（在 Kotlin 1.0 中，使用 `@native` 注解代替。）与 JVM 目标平台不同，JS 目标平台允许对类和属性使用 external 修饰符。例如，以下是如何声明 DOM `Node` 类：

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### 改进的导入处理

您现在可以更精确地描述应从 JavaScript 模块导入的声明。如果您在外部声明上添加 `@JsModule("<module-name>")` 注解，它将在编译期间正确导入到模块系统（无论是 CommonJS 还是 AMD）。例如，对于 CommonJS，该声明将通过 `require(...)` 函数导入。此外，如果您想将声明导入为模块或全局 JavaScript 对象，可以使用 `@JsNonModule` 注解。

例如，以下是如何将 JQuery 导入 Kotlin 模块：

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

在此示例中，JQuery 将作为名为 `jquery` 的模块导入。或者，它可以用作 `$`-对象，具体取决于 Kotlin 编译器配置使用的模块系统。

您可以在应用程序中这样使用这些声明：

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```