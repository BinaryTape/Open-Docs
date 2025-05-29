[//]: # (title: 空安全)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7.svg" width="20" alt="Final step" /> <strong>空安全</strong><br /></p>
</tldr>

在 Kotlin 中，可以有 `null` 值。当某些内容缺失或尚未设置时，Kotlin 会使用 `null` 值。你已经在 [集合](kotlin-tour-collections.md#kotlin-tour-map-no-key) 一章中看到了 Kotlin 返回 `null` 值的一个例子，当时你尝试访问映射中不存在的键值对。尽管以这种方式使用 `null` 值很有用，但如果你的代码没有准备好处理它们，你可能会遇到问题。

为了帮助防止程序中出现 `null` 值问题，Kotlin 引入了空安全。空安全在编译时而不是运行时检测 `null` 值的潜在问题。

空安全是一组功能的组合，它们允许你：

*   明确声明程序中何时允许 `null` 值。
*   检查 `null` 值。
*   使用安全调用来访问可能包含 `null` 值的属性或函数。
*   声明在检测到 `null` 值时要执行的操作。

## 可空类型

Kotlin 支持可空类型，这使得声明的类型可以包含 `null` 值。默认情况下，类型**不**允许接受 `null` 值。可空类型通过在类型声明后明确添加 `?` 来声明。

例如：

```kotlin
fun main() {
    // neverNull has String type
    var neverNull: String = "This can't be null"

    // Throws a compiler error
    neverNull = null

    // nullable has nullable String type
    var nullable: String? = "You can keep a null here"

    // This is OK
    nullable = null

    // By default, null values aren't accepted
    var inferredNonNull = "The compiler assumes non-nullable"

    // Throws a compiler error
    inferredNonNull = null

    // notNull doesn't accept null values
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // Throws a compiler error
}
```
{kotlin-runnable="true" validate="false" kotlin-min-compiler-version="1.3" id="kotlin-tour-nullable-type"}

> `length` 是 [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 类的一个属性，包含字符串中的字符数。
>
{style="tip"}

## 检查 null 值

你可以在条件表达式中检查 `null` 值的存在。在以下示例中，`describeString()` 函数有一个 `if` 语句，用于检查 `maybeString` 是否**非** `null` 并且其 `length` 是否大于零：

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}

fun main() {
    val nullString: String? = null
    println(describeString(nullString))
    // Empty or null string
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-check-nulls"}

## 使用安全调用

要安全地访问可能包含 `null` 值的对象的属性，请使用安全调用运算符 `?.`。如果对象或其任何被访问的属性为 `null`，安全调用运算符将返回 `null`。如果你想避免 `null` 值的出现触发代码中的错误，这会很有用。

在以下示例中，`lengthString()` 函数使用安全调用来返回字符串的长度或 `null`：

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-property"}

> 安全调用可以链式使用，这样如果对象的任何属性包含 `null` 值，则会返回 `null` 而不会抛出错误。例如：
>
> ```kotlin
>   person.company?.address?.country
> ```
>
{style="tip"}

安全调用运算符也可用于安全地调用扩展函数或成员函数。在这种情况下，在调用函数之前会执行 null 检查。如果检查检测到 `null` 值，则跳过调用并返回 `null`。

在以下示例中，`nullString` 为 `null`，因此对 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 的调用被跳过并返回 `null`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-function"}

## 使用 Elvis 运算符

你可以使用 **Elvis 运算符** `?:` 提供一个默认值，以便在检测到 `null` 值时返回。

在 Elvis 运算符的左侧写入要检查 `null` 值的内容。在 Elvis 运算符的右侧写入在检测到 `null` 值时应返回的内容。

在以下示例中，`nullString` 为 `null`，因此访问 `length` 属性的安全调用返回 `null` 值。结果，Elvis 运算符返回 `0`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-elvis-operator"}

有关 Kotlin 中空安全的更多信息，请参阅 [空安全](null-safety.md)。

## 练习

### 练习 {initial-collapse-state="collapsed" collapsible="true"}

你有一个 `employeeById` 函数，它允许你访问公司的员工数据库。不幸的是，此函数返回 `Employee?` 类型的值，因此结果可能为 `null`。你的目标是编写一个函数，在提供员工 `id` 时返回其薪水，如果员工在数据库中缺失则返回 `0`。

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise"}

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-null-safety-solution"}

## 下一步？

恭喜！现在你已经完成了初级教程，通过我们的中级教程将你对 Kotlin 的理解提升到新的水平：

<a href="kotlin-tour-intermediate-extension-functions.md"><img src="start-intermediate-tour.svg" width="700" alt="Start the intermediate Kotlin tour" style="block"/></a>