[//]: # (title: 惯用法)

Kotlin 中随机且常用的惯用法集合。如果您有自己偏爱的惯用法，可以通过发送 pull request 来贡献。

## 创建 DTO（POJO/POCO）

```kotlin
data class Customer(val name: String, val email: String)
```

提供一个 `Customer` 类，具备以下功能：

*   所有属性的 `getter`（以及 `var` 变量的 `setter`）
*   `equals()`
*   `hashCode()`
*   `toString()`
*   `copy()`
*   所有属性的 `component1()`、`component2()` 等（请参见 [数据类](data-classes.md)）

## 函数形参的默认值

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 过滤 `list`

```kotlin
val positives = list.filter { x -> x > 0 }
```

或者，更简洁的写法：

```kotlin
val positives = list.filter { it > 0 }
```

了解 [Java 和 Kotlin 过滤](java-to-kotlin-collections-guide.md#filter-elements) 之间的差异。

## 检测集合中元素的存在性

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 字符串内插

```kotlin
println("Name $name")
```

了解 [Java 和 Kotlin 字符串连接](java-to-kotlin-idioms-strings.md#concatenate-strings) 之间的差异。

## 安全地读取标准输入

```kotlin
// 读取一个字符串，如果输入无法转换为整数则返回 null。例如：Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 读取一个可以转换为整数的字符串并返回一个整数。例如：13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

更多信息，请参见 [读取标准输入](read-standard-input.md)。

## 实例检测

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

## 只读 `list`

```kotlin
val list = listOf("a", "b", "c")
```
## 只读 `map`

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 访问 `map` 条目

```kotlin
println(map["key"])
map["key"] = value
```

## 遍历 `map` 或 `pair` `list`

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k` 和 `v` 可以是任何方便的名称，例如 `name` 和 `age`。

## 迭代区间

```kotlin
for (i in 1..100) { ... }  // 闭合区间：包含 100
for (i in 1..<100) { ... } // 半开区间：不包含 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 惰性属性

```kotlin
val p: String by lazy { // 该值仅在首次访问时计算
    // 计算字符串
}
```

## 扩展函数

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## 创建单例

```kotlin
object Resource {
    val name = "Name"
}
```

## 使用内联值类实现类型安全的值

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

如果您不小心混淆了 `EmployeeId` 和 `CustomerId`，将触发编译错误。

> `@JvmInline` 注解仅在 JVM 后端需要。
>
{style="note"}

## 实例化抽象类

```kotlin
abstract class MyAbstractClass {
    abstract fun doSomething()
    abstract fun sleep()
}

fun main() {
    val myObject = object : MyAbstractClass() {
        override fun doSomething() {
            // ...
        }

        override fun sleep() { // ...
        }
    }
    myObject.doSomething()
}
```

## 非空简写

```kotlin
val files = File("Test").listFiles()

println(files?.size) // 如果 files 非空，则打印 size
```

## 非空或否则简写

```kotlin
val files = File("Test").listFiles()

// 对于简单的备用值：
println(files?.size ?: "empty") // 如果 files 为 null，则打印 “empty”

// 若要在代码块中计算更复杂的备用值，请使用 `run`
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## 若为 null 则执行表达式

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 获取可能为空的集合中的第一个元素

```kotlin
val emails = ... // 可能为空
val mainEmail = emails.firstOrNull() ?: ""
```

了解 [Java 和 Kotlin 获取第一个元素](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection) 之间的差异。

## 若非 null 则执行

```kotlin
val value = ...

value?.let {
    // 如果非 null，则执行此代码块
}
```

## 如果非 null 则映射可空值

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 如果该值或转换结果为 null，则返回 defaultValue。
```

## when 语句的返回

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

## try-catch 表达式

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // 处理 result
}
```

## if 表达式

```kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

## 返回 Unit 的方法的构建器风格用法

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 单表达式函数

```kotlin
fun theAnswer() = 42
```

这等同于

```kotlin
fun theAnswer(): Int {
    return 42
}
```

这可以与其他惯用法有效结合，从而使代码更短。例如，与 `when` 表达式结合使用：

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 调用对象实例的多个方法（`with`）

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //绘制一个 100 像素的正方形
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 配置对象的属性（`apply`）

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

这对于配置对象构造函数中不存在的属性非常有用。

## Java 7 的 try-with-resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

## 需要泛型类型信息的泛型函数

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```

## 交换两个变量

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## 标记代码为不完整（TODO）
 
Kotlin 的标准库提供一个 `TODO()` 函数，它总是会抛出 `NotImplementedError`。
其返回类型是 `Nothing`，因此无论期望何种类型，它都可以使用。
还有一个接受原因形参的重载：

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA 的 Kotlin 插件理解 `TODO()` 的语义，并自动在 TODO 工具窗口中添加一个代码指针。 

## 接下来？

*   使用惯用的 Kotlin 风格解决 [Advent of Code 谜题](advent-of-code.md)。
*   了解如何在 [Java 和 Kotlin 中执行常见的字符串任务](java-to-kotlin-idioms-strings.md)。
*   了解如何在 [Java 和 Kotlin 中执行常见的集合任务](java-to-kotlin-collections-guide.md)。
*   了解如何在 [Java 和 Kotlin 中处理可空性](java-to-kotlin-nullability-guide.md)。