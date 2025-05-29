[//]: # (title: Kotlin 1.1 新特性)

_Released: 15 February 2016_

## 目录

* [协程 (实验性)](#coroutines-experimental)
* [其他语言特性](#other-language-features)
* [标准库](#standard-library)
* [JVM 后端](#jvm-backend)
* [JavaScript 后端](#javascript-backend)

## JavaScript

从 Kotlin 1.1 开始，JavaScript 目标不再被视为实验性功能。所有语言特性均受支持，并且有许多新工具用于与前端开发环境集成。有关更详细的更改列表，请参阅[下文](#javascript-backend)。

## 协程 (实验性)

Kotlin 1.1 中的关键新特性是 *协程*，它带来了对 `async`/`await`、`yield` 和类似编程模式的支持。Kotlin 设计的关键特性是协程执行的实现是库的一部分，而不是语言的一部分，因此您不受任何特定编程范式或并发库的限制。

协程实际上是一种轻量级线程，可以稍后暂停和恢复。协程通过_[挂起函数](coroutines-basics.md#extract-function-refactoring)_支持：对这类函数的调用可能会挂起协程，并且要启动新的协程，我们通常使用匿名挂起函数（即挂起 lambda）。

让我们看看 `async`/`await`，它是在外部库 [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines) 中实现的：

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

在这里，`async { ... }` 启动一个协程，当我们使用 `await()` 时，协程的执行会被挂起，直到被等待的操作执行完毕，并在操作完成时恢复（可能在不同的线程上）。

标准库使用协程通过 `yield` 和 `yieldAll` 函数支持*惰性生成序列*。在这样的序列中，返回序列元素的代码块会在每个元素被检索后挂起，并在请求下一个元素时恢复。下面是一个例子：

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

运行上面的代码查看结果。随意编辑并再次运行！

欲了解更多信息，请参阅[协程文档](coroutines-overview.md)和[教程](coroutines-and-channels.md)。

请注意，协程目前被视为**实验性功能**，这意味着 Kotlin 团队不承诺在 1.1 最终发布后支持此功能的向后兼容性。

## 其他语言特性

### 类型别名

类型别名允许您为现有类型定义一个替代名称。这对于泛型类型（如集合）以及函数类型最有用。下面是一个例子：

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

欲了解更多详情，请参阅[类型别名文档](type-aliases.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md)。

### 绑定可调用引用

您现在可以使用 `::` 运算符获取指向特定对象实例方法或属性的[成员引用](reflection.md#function-references)。以前这只能用 lambda 表达式来表示。下面是一个例子：

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

欲了解更多详情，请阅读[文档](reflection.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md)。

### 密封类和数据类

Kotlin 1.1 取消了 Kotlin 1.0 中对密封类和数据类的一些限制。现在您可以在同一个文件的顶层定义顶级密封类的子类，而不仅仅是作为密封类的嵌套类。数据类现在可以扩展其他类。这可以用于清晰简洁地定义表达式类层次结构：

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

欲了解更多详情，请阅读[密封类文档](sealed-classes.md)或[密封类](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md)和[数据类](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md)的 KEEPs。

### Lambda 中的解构

您现在可以使用[解构声明](destructuring-declarations.md)语法来解包传递给 lambda 的参数。下面是一个例子：

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

欲了解更多详情，请阅读[解构声明文档](destructuring-declarations.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md)。

### 未使用参数的下划线

对于具有多个参数的 lambda，您可以使用 `_` 字符来替换您不使用的参数名称：

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这也适用于[解构声明](destructuring-declarations.md)：

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

欲了解更多详情，请阅读 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md)。

### 数字字面量中的下划线

就像 Java 8 一样，Kotlin 现在允许在数字字面量中使用下划线来分隔数字组：

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

欲了解更多详情，请阅读 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md)。

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

如果属性没有支持字段，您现在可以用 `inline` 修饰符标记属性访问器。此类访问器的编译方式与[内联函数](inline-functions.md)相同。

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

您也可以将整个属性标记为 `inline`——然后修饰符将应用于两个访问器。

欲了解更多详情，请阅读[内联函数文档](inline-functions.md#inline-properties)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md)。

### 局部委托属性

您现在可以将[委托属性](delegated-properties.md)语法与局部变量一起使用。一个可能的用途是定义一个延迟求值的局部变量：

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

欲了解更多详情，请阅读 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md)。

### 委托属性绑定的拦截

对于[委托属性](delegated-properties.md)，现在可以使用 `provideDelegate` 运算符拦截委托到属性的绑定。例如，如果要在绑定之前检查属性名称，我们可以这样写：

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

在创建 `MyUI` 实例期间，将为每个属性调用 `provideDelegate` 方法，并且它可以立即执行必要的验证。

欲了解更多详情，请阅读[委托属性文档](delegated-properties.md)。

### 泛型枚举值访问

现在可以通过泛型方式枚举枚举类的值。

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

### DSL 中隐式接收器的作用域控制

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 注解允许在 DSL 上下文中限制外部作用域接收器的使用。考虑经典的 [HTML 构建器示例](type-safe-builders.md)：

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

在 Kotlin 1.0 中，传递给 `td` 的 lambda 中的代码可以访问三个隐式接收器：传递给 `table` 的、传递给 `tr` 的和传递给 `td` 的。这允许您调用在该上下文中毫无意义的方法——例如在 `td` 内部调用 `tr`，从而将 `<tr>` 标签放入 `<td>` 中。

在 Kotlin 1.1 中，您可以限制这一点，使得只有在 `td` 的隐式接收器上定义的方法才可以在传递给 `td` 的 lambda 内部可用。您可以通过定义一个用 `@DslMarker` 元注解标记的注解，并将其应用于标签类的基类来做到这一点。

欲了解更多详情，请阅读[类型安全构建器文档](type-safe-builders.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md)。

### `rem` 运算符

`mod` 运算符现已弃用，取而代之的是 `rem`。欲了解其动机，请参阅[此问题](https://youtrack.jetbrains.com/issue/KT-14650)。

## 标准库

### 字符串到数字的转换

`String` 类新增了一系列扩展函数，可以在无效数字时不抛出异常地将其转换为数字：`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?` 等。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

此外，整数转换函数，如 `Int.toString()`、`String.toInt()`、`String.toIntOrNull()`，都新增了一个带有 `radix` 参数的重载，允许指定转换的基数（2 到 36）。

### `onEach()`

`onEach` 是一个小型但有用的集合和序列扩展函数，它允许在操作链中对集合/序列的每个元素执行一些操作，可能带有副作用。在可迭代对象上，它的行为类似于 `forEach`，但也会进一步返回可迭代实例。而在序列上，它返回一个包装序列，该序列在元素被迭代时惰性地应用给定操作。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### `also()`、`takeIf()` 和 `takeUnless()`

这是三个适用于任何接收器的通用扩展函数。

`also` 类似于 `apply`：它接收接收器，对其执行一些操作，然后返回该接收器。区别在于，在 `apply` 内部的代码块中，接收器以 `this` 的形式可用，而在 `also` 内部的代码块中，它以 `it` 的形式可用（如果您愿意，可以给它另一个名称）。当您不想遮蔽外部作用域的 `this` 时，这很方便：

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

`takeIf` 类似于单个值的 `filter`。它检查接收器是否符合谓词，如果符合则返回接收器，否则返回 `null`。结合 Elvis 运算符 (?:) 和提前返回，它允许编写如下构造：

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

`takeUnless` 与 `takeIf` 相同，但它采用的是反向谓词。当接收器_不_符合谓词时，它返回接收器，否则返回 `null`。因此，上面的一个示例可以用 `takeUnless` 改写如下：

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

当您有可调用引用而不是 lambda 时，使用它也很方便：

```kotlin
private fun testTakeUnless(string: String) {
//sampleStart
    val result = string.takeUnless(String::isEmpty)
//End

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `groupingBy()`

此 API 可用于按键对集合进行分组并同时折叠每个组。例如，它可用于计算每个字母开头的单词数量：

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')
//sampleStart
    val frequencies = words.groupingBy { it.first() }.eachCount()
//End
    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) -> list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `Map.toMap()` 和 `Map.toMutableMap()`

这些函数可用于轻松复制 Map：

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### `Map.minus(key)`

`plus` 运算符提供了一种将键值对添加到只读 Map 并生成新 Map 的方法，但以前没有简单的方法可以执行相反的操作：要从 Map 中删除键，您必须采用不太直接的方法，例如 `Map.filter()` 或 `Map.filterKeys()`。现在 `minus` 运算符填补了这一空白。有 4 种重载可用：用于删除单个键、一组键、一个键序列和一个键数组。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    val emptyMap = map - "key"
//End
    
    println("map: $map")
    println("emptyMap: $emptyMap")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `minOf()` 和 `maxOf()`

这些函数可用于查找两个或三个给定值中的最小值和最大值，其中值可以是原始数字或 `Comparable` 对象。此外，每个函数还有一个重载，它接受一个额外的 `Comparator` 实例，如果您想比较本身不可比较的对象。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })
//End
    
    println("minSize = $minSize")
    println("longestList = $longestList")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 类似 Array 的 List 实例化函数

类似于 `Array` 构造函数，现在有创建 `List` 和 `MutableList` 实例并通过调用 lambda 初始化每个元素的函数：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val squares = List(10) { index -> index * index }
    val mutable = MutableList(10) { 0 }
//End

    println("squares: $squares")
    println("mutable: $mutable")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `Map.getValue()`

`Map` 上的此扩展返回与给定键对应的现有值，如果未找到键，则抛出异常并提及未找到的键。如果 Map 是使用 `withDefault` 生成的，此函数将返回默认值而不是抛出异常。

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
//End
    
    println("value is $value")
    println("value2 is $value2")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 抽象集合

在实现 Kotlin 集合类时，这些抽象类可以用作基类。对于实现只读集合，有 `AbstractCollection`、`AbstractList`、`AbstractSet` 和 `AbstractMap`，对于可变集合，有 `AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet` 和 `AbstractMutableMap`。在 JVM 上，这些抽象可变集合的大部分功能继承自 JDK 的抽象集合。

### 数组操作函数

标准库现在提供了一组用于对数组进行逐元素操作的函数：比较（`contentEquals` 和 `contentDeepEquals`）、哈希码计算（`contentHashCode` 和 `contentDeepHashCode`）以及转换为字符串（`contentToString` 和 `contentDeepToString`）。它们在 JVM（作为 `java.util.Arrays` 中相应函数的别名）和 JS（实现在 Kotlin 标准库中提供）上都受支持。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list
//End
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## JVM 后端

### Java 8 字节码支持

Kotlin 现在可以选择生成 Java 8 字节码（`-jvm-target 1.8` 命令行选项或 Ant/Maven/Gradle 中相应的选项）。目前这不会改变字节码的语义（特别是，接口中的默认方法和 lambda 的生成方式与 Kotlin 1.0 中完全相同），但我们计划稍后进一步利用这一点。

### Java 8 标准库支持

标准库现在有单独的版本支持 Java 7 和 8 中新增的 JDK API。如果需要访问新的 API，请使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8` Maven 工件，而不是标准的 `kotlin-stdlib`。这些工件是 `kotlin-stdlib` 之上的微小扩展，它们将其作为传递依赖项带入您的项目。

### 字节码中的参数名

Kotlin 现在支持将参数名存储在字节码中。这可以使用 `-java-parameters` 命令行选项启用。

### 常量内联

编译器现在将 `const val` 属性的值内联到它们被使用的地方。

### 可变闭包变量

用于捕获 lambda 中可变闭包变量的盒装类不再具有 volatile 字段。此更改提高了性能，但在某些罕见的使用场景中可能导致新的竞态条件。如果您受此影响，则需要为访问变量提供自己的同步机制。

### `javax.script` 支持

Kotlin 现在与 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223) 集成。该 API 允许在运行时评估代码片段：

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

有关使用该 API 的更大示例项目，请参阅[此处](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)。

### `kotlin.reflect.full`

为[准备 Java 9 支持](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)，`kotlin-reflect.jar` 库中的扩展函数和属性已移至 `kotlin.reflect.full` 包。旧包 (`kotlin.reflect`) 中的名称已弃用，并将在 Kotlin 1.2 中删除。请注意，核心反射接口（如 `KClass`）是 Kotlin 标准库的一部分，而不是 `kotlin-reflect`，并且不受此移动的影响。

## JavaScript 后端

### 统一标准库

现在，Kotlin 标准库的更多部分可以用于编译到 JavaScript 的代码。特别是，关键类如集合（`ArrayList`、`HashMap` 等）、异常（`IllegalArgumentException` 等）和少数其他类（`StringBuilder`、`Comparator`）现在都定义在 `kotlin` 包下。在 JVM 上，这些名称是相应 JDK 类的类型别名，而在 JS 上，这些类是在 Kotlin 标准库中实现的。

### 更好的代码生成

JavaScript 后端现在生成更多可静态检查的代码，这对于 JS 代码处理工具（如压缩器、优化器、linter 等）更加友好。

### `external` 修饰符

如果您需要以类型安全的方式从 Kotlin 访问 JavaScript 中实现的类，您可以使用 `external` 修饰符编写 Kotlin 声明。（在 Kotlin 1.0 中，使用的是 `@native` 注解。）与 JVM 目标不同，JS 目标允许将 `external` 修饰符与类和属性一起使用。例如，下面是声明 DOM `Node` 类的方法：

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### 改进的导入处理

您现在可以更精确地描述应从 JavaScript 模块导入的声明。如果您在外部声明上添加 `@JsModule("<module-name>")` 注解，它将在编译期间正确导入到模块系统（CommonJS 或 AMD）。例如，使用 CommonJS，声明将通过 `require(...)` 函数导入。此外，如果您想将声明作为模块或全局 JavaScript 对象导入，可以使用 `@JsNonModule` 注解。

例如，下面是如何将 JQuery 导入 Kotlin 模块：

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

在这种情况下，JQuery 将作为名为 `jquery` 的模块导入。另外，它可以作为 `$` 对象使用，具体取决于 Kotlin 编译器配置使用的模块系统。

您可以在应用程序中这样使用这些声明：

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}