---
title: "Kotlin 1.1 的新特性"
---
_发布时间：2016 年 2 月 15 日_

## 目录

* [协程 (实验性)](#coroutines-experimental)
* [其他语言特性](#other-language-features)
* [标准库](#standard-library)
* [JVM 后端](#jvm-backend)
* [JavaScript 后端](#javascript-backend)

## JavaScript

从 Kotlin 1.1 开始，JavaScript 目标不再被认为是实验性的。所有语言特性都得到了支持，并且有许多新的工具可以与前端开发环境集成。有关更改的更详细列表，请参见[下文](#javascript-backend)。

## 协程 (实验性)

Kotlin 1.1 的主要新特性是 *协程*，它带来了对 `async`/`await`、`yield` 和类似编程模式的支持。Kotlin 设计的关键特性是协程执行的实现是库的一部分，而不是语言的一部分，因此你不会受到任何特定编程范式或并发库的约束。

协程实际上是一个轻量级的线程，可以被挂起并在以后恢复。协程通过_[挂起函数](coroutines-basics#extract-function-refactoring)_支持：调用这样的函数可能会挂起一个协程，并且要启动一个新的协程，我们通常使用匿名挂起函数（即挂起 lambda 表达式）。

让我们看一下在外部库 [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines) 中实现的 `async`/`await`：

```kotlin
// 在后台线程池中运行代码
fun asyncOverlay() = async(CommonPool) {
    // 启动两个异步操作
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // 然后将 overlay 应用到两个结果
    applyOverlay(original.await(), overlay.await())
}

// 在 UI 上下文中启动新的协程
launch(UI) {
    // 等待异步 overlay 完成
    val image = asyncOverlay().await()
    // 然后在 UI 中显示它
    showImage(image)
}
```

这里，`async { ... }` 启动一个协程，当我们使用 `await()` 时，协程的执行会被挂起，同时等待执行的操作，并在等待的操作完成时恢复执行（可能在不同的线程上）。

标准库使用协程来支持使用 `yield` 和 `yieldAll` 函数的 *惰性生成序列*。在这样的序列中，返回序列元素的代码块在检索到每个元素后被挂起，并在请求下一个元素时恢复。这是一个例子：

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
    val seq = buildSequence {
      for (i in 1..5) {
          // yield i 的平方
          yield(i * i)
      }
      // yield 一个范围
      yieldAll(26..28)
    }

    // 打印序列
    println(seq.toList())
}
```

运行上面的代码查看结果。 随意编辑并再次运行！

有关更多信息，请参阅[协程文档](coroutines-overview)和[教程](coroutines-and-channels)。

请注意，协程目前被认为是**实验性功能**，这意味着 Kotlin 团队不承诺在最终的 1.1 版本之后支持此功能的向后兼容性。

## 其他语言特性

### 类型别名

类型别名允许你为现有类型定义备用名称。这对于泛型类型（如集合）以及函数类型最有用。这是一个例子：

```kotlin

typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// 请注意，类型名称（初始名称和类型别名）是可以互换的：
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"

fun oscarWinners(): OscarWinners {
    return mapOf(
            "Best song" to "City of Stars (La La Land)",
            "Best actress" to "Emma Stone (La La Land)",
            "Best picture" to "Moonlight" /* ... */)
}

fun main(args: Array<String>) {
    val oscarWinners = oscarWinners()

    val laLaLandAwards = countLaLaLand(oscarWinners)
    println("LaLaLandAwards = $laLaLandAwards (在我们的示例中), 但实际上是 6.")

    val laLaLandIsTheBestMovie = checkLaLaLandIsTheBestMovie(oscarWinners)
    println("LaLaLandIsTheBestMovie = $laLaLandIsTheBestMovie")
}
```

有关更多详细信息，请参见[类型别名文档](type-aliases)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases)。

### 绑定的可调用引用

现在，你可以使用 `::` 运算符来获取指向特定对象实例的方法或属性的 [成员引用](reflection#function-references)。以前，这只能用 lambda 表达式来表示。这是一个例子：

```kotlin

val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```

阅读 [文档](reflection) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references) 了解更多详情。

### 密封类和数据类

Kotlin 1.1 删除了 Kotlin 1.0 中存在的对密封类和数据类的一些限制。现在，你可以在同一文件中的顶层定义顶级密封类的子类，而不仅仅是作为密封类的嵌套类。数据类现在可以扩展其他类。这可以用来很好地、干净地定义表达式类的层次结构：

```kotlin

sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const `->` expr.number
    is Sum `->` eval(expr.e1) + eval(expr.e2)
    NotANumber `->` Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```

阅读 [密封类文档](sealed-classes) 或 [密封类](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance) 和 [数据类](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance) 的 KEEP 了解更多详情。

### Lambda 表达式中的解构

现在，你可以使用 [解构声明](destructuring-declarations) 语法来解包传递给 lambda 表达式的参数。这是一个例子：

```kotlin
fun main(args: Array<String>) {

    val map = mapOf(1 to "one", 2 to "two")
    // 之前
    println(map.mapValues { entry `->`
      val (key, value) = entry
      "$key `->` $value!"
    })
    // 现在
    println(map.mapValues { (key, value) `->` "$key `->` $value!" })

}
```

阅读 [解构声明文档](destructuring-declarations) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters) 了解更多详情。

### 未使用参数的下划线

对于具有多个参数的 lambda 表达式，你可以使用 `_` 字符来替换你不使用的参数的名称：

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

    map.forEach { _, value `->` println("$value!") }

}
```

这在 [解构声明](destructuring-declarations) 中也有效：

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {

    val (_, status) = getResult()

    println("status is '$status'")
}
```

阅读 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters) 了解更多详情。

### 数字字面量中的下划线

与 Java 8 中一样，Kotlin 现在允许在数字字面量中使用下划线来分隔数字组：

```kotlin

val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```

阅读 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals) 了解更多详情。

### 属性的较短语法

对于 getter 定义为表达式主体的属性，现在可以省略属性类型：

```kotlin

    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // 属性类型推断为 'Boolean'
}

fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```

### 内联属性访问器

如果属性没有 backing field （幕后字段），你现在可以使用 `inline` 修饰符标记属性访问器。此类访问器的编译方式与 [内联函数](inline-functions) 相同。

```kotlin

public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // getter 将被内联
    println("$list 的最后一个索引是 ${list.lastIndex}")
}
```

你还可以将整个属性标记为 `inline` - 然后修饰符将应用于两个访问器。

阅读 [内联函数文档](inline-functions#inline-properties) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties) 了解更多详情。

### 局部委托属性

你现在可以将 [委托属性](delegated-properties) 语法与局部变量一起使用。一种可能的用途是定义一个惰性计算的局部变量：

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {

    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // 返回随机值
        println("The answer is $answer.")   // 答案在此处计算
    }
    else {
        println("Sometimes no answer is the answer...")
    }

}
```

阅读 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties) 了解更多详情。

### 拦截委托属性绑定

对于[委托属性](delegated-properties)，现在可以使用 `provideDelegate` 运算符拦截委托到属性的绑定。例如，如果我们想在绑定之前检查属性名称，我们可以这样写：

```kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        ... // 属性创建
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

阅读 [委托属性文档](delegated-properties) 了解更多详情。

### 泛型枚举值访问

现在可以以泛型方式枚举枚举类的取值。

```kotlin

enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

fun main(args: Array<String>) {
    printAllValues<RGB>() // 打印 RED, GREEN, BLUE
}
```

### DSL 中隐式接收者的作用域控制

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 注解允许限制在 DSL 上下文中从外部作用域使用接收者。考虑典型的 [HTML 构建器示例](type-safe-builders)：

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

在 Kotlin 1.0 中，传递给 `td` 的 lambda 表达式中的代码可以访问三个隐式接收者：传递给 `table` 的、传递给 `tr` 的和传递给 `td` 的。这允许你调用在该上下文中没有意义的方法 - 例如在 `td` 中调用 `tr`，从而将 `<tr>` 标签放在 `<td>` 中。

在 Kotlin 1.1 中，你可以限制这一点，以便只有在 `td` 的隐式接收者上定义的方法才能在传递给 `td` 的 lambda 表达式中可用。你可以通过定义用 `@DslMarker` 元注解标记的注解并将其应用于标签类的基类来实现这一点。

阅读 [类型安全构建器文档](type-safe-builders) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers) 了解更多详情。

### rem 运算符

`mod` 运算符现在已弃用，而是使用 `rem`。有关动机，请参见 [此 issue](https://youtrack.jetbrains.com/issue/KT-14650)。

## 标准库

### 字符串到数字的转换

String 类上有一堆新的扩展函数，用于将其转换为数字，而不会在无效数字上抛出异常：`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?` 等。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

此外，整数转换函数（如 `Int.toString()`、`String.toInt()`、`String.toIntOrNull()`）都获得了一个带有 `radix` 参数的重载，该参数允许指定转换的基数（2 到 36）。

### onEach()

`onEach` 是集合和序列的一个小而有用的扩展函数，它允许在操作链中对集合/序列的每个元素执行某些操作，可能具有副作用。在 iterables 上，它的行为类似于 `forEach`，但也进一步返回 iterable 实例。在序列上，它返回一个包装序列，该序列在元素被迭代时延迟地应用给定的操作。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also()、takeIf() 和 takeUnless()

这些是适用于任何接收者的三个通用扩展函数。

`also` 类似于 `apply`：它获取接收者，对其执行某些操作，并返回该接收者。区别在于 `apply` 内部的代码块中，接收者以 `this` 的形式存在，而在 `also` 内部的代码块中，接收者以 `it` 的形式存在（如果需要，你可以给它另一个名称）。当你不想隐藏来自外部作用域的 `this` 时，这会派上用场：

```kotlin
class Block {
    lateinit var content: String
}

fun Block.copy() = Block().also {
    it.content = this.content
}

// 使用 'apply' 代替
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

`takeIf` 类似于单个值的 `filter`。它检查接收者是否满足谓词，如果满足则返回接收者，如果不满足则返回 `null`。与 elvis 运算符 (?:) 和提前返回结合使用，它允许编写如下结构：

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// 对现有的 outDirFile 做一些事情
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // 对输入字符串中关键字的索引做一些事情，假设已找到

    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```

`takeUnless` 与 `takeIf` 相同，但它采用反转的谓词。当它_不_满足谓词时，它返回接收者，否则返回 `null`。因此，上面的一个示例可以用 `takeUnless` 重写如下：

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

当你有可调用引用而不是 lambda 表达式时，使用它也很方便：

```kotlin
private fun testTakeUnless(string: String) {

    val result = string.takeUnless(String::isEmpty)

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```

### groupingBy()

此 API 可用于按键对集合进行分组并同时折叠每个组。例如，它可以用于计算以每个字母开头的单词数：

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')

    val frequencies = words.groupingBy { it.first() }.eachCount()

    println("Counting first letters: $frequencies.")

    // 使用 'groupBy' 和 'mapValues' 的替代方法会创建一个中间映射，
    // 而 'groupingBy' 方法会动态计数。
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) `->` list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```

### Map.toMap() 和 Map.toMutableMap()

这些函数可用于轻松复制映射：

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 运算符提供了一种向只读映射添加键值对以生成新映射的方法，但是没有一种简单的方法来做相反的事情：要从映射中删除键，你必须求助于不太直接的方法，如 `Map.filter()` 或 `Map.filterKeys()`。现在，`minus` 运算符填补了这一空白。有 4 个重载可用：用于删除单个键、键的集合、键的序列和键的数组。

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    val emptyMap = map - "key"

    println("map: $map")
    println("emptyMap: $emptyMap")
}
```

### minOf() 和 maxOf()

这些函数可用于查找两个或三个给定值的最低和最大值，其中值是原始数字或 `Comparable` 对象。如果你想比较本身不可比较的对象，则每个函数还有一个采用附加 `Comparator` 实例的重载。

```kotlin
fun main(args: Array<String>) {

    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })

    println("minSize = $minSize")
    println("longestList = $longestList")
}
```

### 类数组的 List 实例化函数

与 `Array` 构造函数类似，现在有一些函数可以创建 `List` 和 `MutableList` 实例，并通过调用 lambda 表达式来初始化每个元素：

```kotlin
fun main(args: Array<String>) {

    val squares = List(10) { index `->` index * index }
    val mutable = MutableList(10) { 0 }

    println("squares: $squares")
    println("mutable: $mutable")
}
```

### Map.getValue()

Map 上的此扩展返回与给定键对应的现有值或抛出异常，并提及未找到哪个键。如果使用 `withDefault` 生成了映射，则此函数将返回默认值而不是抛出异常。

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    // 返回不可为空的 Int 值 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k `->` k.length }
    // 返回 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // `<-` 这将抛出 NoSuchElementException

    println("value is $value")
    println("value2 is $value2")
}
```

### 抽象集合

当实现 Kotlin 集合类时，这些抽象类可以用作基类。对于实现只读集合，有 `AbstractCollection`、`AbstractList`、`AbstractSet` 和 `AbstractMap`，对于可变集合，有 `AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet` 和 `AbstractMutableMap`。在 JVM 上，这些抽象可变集合从 JDK 的抽象集合继承了大部分功能。

### 数组操作函数

标准库现在提供了一组用于对数组进行逐元素操作的函数：比较（`contentEquals` 和 `contentDeepEquals`）、哈希码计算（`contentHashCode` 和 `contentDeepHashCode`）以及转换为字符串（`contentToString` 和 `contentDeepToString`）。它们同时支持 JVM（其中它们充当 `java.util.Arrays` 中相应函数的别名）和 JS（其中在 Kotlin 标准库中提供了实现）。

```kotlin
fun main(args: Array<String>) {

    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM 实现：类型和哈希乱码
    println(array.contentToString())  // 格式化为列表
}
```

## JVM 后端

### Java 8 字节码支持

Kotlin 现在可以选择生成 Java 8 字节码（`-jvm-target 1.8` 命令行选项或 Ant/Maven/Gradle 中的相应选项）。目前，这不会改变字节码的语义（特别是，接口中的默认方法和 lambda 表达式的生成方式与 Kotlin 1.0 中完全相同），但我们计划稍后进一步利用这一点。

### Java 8 标准库支持

现在有单独版本的标准库支持 Java 7 和 8 中添加的新 JDK API。如果需要访问新的 API，请使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8` maven artifacts 而不是标准的 `kotlin-stdlib`。这些 artifacts 是 `kotlin-stdlib` 之上的微小扩展，它们将其作为传递依赖项引入你的项目。

### 字节码中的参数名称

Kotlin 现在支持将参数名称存储在字节码中。可以使用 `-java-parameters` 命令行选项启用此功能。

### 常量内联

编译器现在将 `const val` 属性的值内联到它们被使用的位置。

### 可变闭包变量

用于捕获 lambda 表达式中可变闭包变量的 box 类不再具有 volatile 字段。此更改提高了性能，但可能在某些罕见的使用场景中导致新的竞争条件。如果你受到此影响，则需要为访问变量提供你自己的同步。

### javax.script 支持

Kotlin 现在与 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223) 集成。该 API 允许在运行时评估代码片段：

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // 打印 5
```

参见 [此处](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example) 以获取使用该 API 的更大的示例项目。

### kotlin.reflect.full

为了 [为 Java 9 支持做准备](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)，`kotlin-reflect.jar` 库中的扩展函数和属性已移动到包 `kotlin.reflect.full`。旧包（`kotlin.reflect`）中的名称已弃用，将在 Kotlin 1.2 中删除。请注意，核心反射接口（例如 `KClass`）是 Kotlin 标准库的一部分，而不是 `kotlin-reflect` 的一部分，并且不受此移动的影响。

## JavaScript 后端

### 统一的标准库

现在可以从编译为 JavaScript 的代码中使用更大一部分 Kotlin 标准库。特别是，集合（`ArrayList`、`HashMap` 等）、异常（`IllegalArgumentException` 等）和一些其他（`StringBuilder`、`Comparator`）等关键类现在都在 `kotlin` 包下定义。在 JVM 上，这些名称是相应 JDK 类的类型别名，而在 JS 上，这些类在 Kotlin 标准库中实现。

### 更好的代码生成

JavaScript 后端现在生成更多可静态检查的代码，这些代码对 JS 代码处理工具（如 minifier、优化器、linter 等）更友好。

### external 修饰符

如果你需要从 Kotlin 以类型安全的方式访问在 JavaScript 中实现的类，你可以使用 `external` 修饰符编写 Kotlin 声明。（在 Kotlin 1.0 中，使用 `@native` 注解代替。）与 JVM 目标不同，JS 目标允许将 external 修饰符与类和属性一起使用。例如，你可以按如下方式声明 DOM `Node` 类：

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // 等等
}
```

### 改进的导入处理

现在可以更精确地描述应从 JavaScript 模块导入的声明。如果在 external 声明中添加 `@JsModule("<module-name>")` 注解，它将在编译期间正确导入到模块系统（CommonJS 或 AMD）。例如，对于 CommonJS，该声明将通过 `require(...)` 函数导入。此外，如果你想将声明作为模块或作为全局 JavaScript 对象导入，则可以使用 `@JsNonModule` 注解。

例如，你可以按如下方式将 JQuery 导入到 Kotlin 模块：

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) `->` Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

在这种情况下，JQuery 将作为名为 `jquery` 的模块导入。或者，它可以用作 $-object，具体取决于配置 Kotlin 编译器使用的模块系统。

你可以像这样在你的应用程序中使用这些声明：

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```