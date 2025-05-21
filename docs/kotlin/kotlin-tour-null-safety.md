---
title: "Null 安全"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本类型 (Basic types)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合 (Collections)</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流 (Control flow)</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函数 (Functions)</a><br />
        <img src="/img/icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">类 (Classes)</a><br />
        <img src="/img/icon-7.svg" width="20" alt="Final step" /> <strong>空安全 (Null safety)</strong><br />
</p>

:::

在 Kotlin 中，可以存在 `null` 值。当某些内容缺失或尚未设置时，Kotlin 使用 `null` 值。
你已经在 [集合 (Collections)](kotlin-tour-collections#kotlin-tour-map-no-key) 章节中看到了 Kotlin 返回 `null` 值的示例，
当你尝试使用 map 中不存在的键访问键值对时。虽然以这种方式使用 `null` 值很有用，但如果你的代码没有准备好处理它们，你可能会遇到问题。

为了帮助防止程序中出现 `null` 值的问题，Kotlin 实现了空安全 (null safety) 机制。空安全 (null safety) 在编译时检测 `null` 值的潜在问题，而不是在运行时检测。

空安全 (null safety) 是多种功能的组合，这些功能使你能够：

* 显式声明何时允许在你的程序中使用 `null` 值。
* 检查 `null` 值。
* 使用安全调用来访问可能包含 `null` 值的属性或函数。
* 声明检测到 `null` 值时要采取的操作。

## 可空类型 (Nullable types)

Kotlin 支持可空类型 (nullable types)，允许声明的类型具有 `null` 值。默认情况下，类型**不**允许接受 `null` 值。通过在类型声明后显式添加 `?` 来声明可空类型 (nullable types)。

例如：

```kotlin
fun main() {
    // neverNull 的类型为 String
    var neverNull: String = "This can't be null"

    // 抛出编译器错误
    neverNull = null

    // nullable 的类型为可空 String
    var nullable: String? = "You can keep a null here"

    // 这样没问题
    nullable = null

    // 默认情况下，不接受 null 值
    var inferredNonNull = "The compiler assumes non-nullable"

    // 抛出编译器错误
    inferredNonNull = null

    // notNull 不接受 null 值
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // 抛出编译器错误
}
```

:::tip
`length` 是 [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 类的一个属性，
其中包含字符串中的字符数。

:::

## 检查 null 值

你可以在条件表达式中检查是否存在 `null` 值。在以下示例中，`describeString()` 函数有一个 `if` 语句，用于检查 `maybeString` 是否**不**是 `null` 且其 `length` 是否大于零：

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

## 使用安全调用 (safe calls)

要安全地访问可能包含 `null` 值的对象的属性，请使用安全调用运算符 `?.`。如果对象或其访问的属性之一为 `null`，则安全调用运算符返回 `null`。如果你想避免 `null` 值的存在触发代码中的错误，这将非常有用。

在以下示例中，`lengthString()` 函数使用安全调用来返回字符串的长度或 `null`：

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```

:::tip
可以链式使用安全调用，以便如果对象的任何属性包含 `null` 值，则返回 `null`，而不会引发错误。例如：

```kotlin
  person.company?.address?.country
```

:::

安全调用运算符还可以用于安全地调用扩展函数或成员函数。在这种情况下，在调用函数之前执行空值检查。如果检查检测到 `null` 值，则跳过调用并返回 `null`。

在以下示例中，`nullString` 是 `null`，因此跳过 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 的调用，并返回 `null`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```

## 使用 Elvis 运算符

如果检测到 `null` 值，你可以使用 **Elvis 运算符** `?:` 提供要返回的默认值。

在 Elvis 运算符的左侧写入应检查 `null` 值的内容。
在 Elvis 运算符的右侧写入如果检测到 `null` 值应返回的内容。

在以下示例中，`nullString` 是 `null`，因此访问 `length` 属性的安全调用返回 `null` 值。
因此，Elvis 运算符返回 `0`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```

有关 Kotlin 中空安全 (null safety) 的更多信息，请参见 [空安全 (Null safety)](null-safety)。

## 练习 (Practice)

### 练习 (Exercise)

你有一个 `employeeById` 函数，它使你可以访问公司的员工数据库。不幸的是，此函数返回 `Employee?` 类型的值，因此结果可能为 `null`。你的目标是编写一个函数，当提供员工的 `id` 时返回其工资，如果数据库中缺少该员工，则返回 `0`。

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = // 在这里写你的代码

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

## 接下来做什么？

恭喜！既然你已经完成了 Kotlin 之旅，请查看我们关于流行的 Kotlin 应用程序的教程：

* [创建一个后端应用程序](jvm-create-project-with-spring-boot)
* [创建一个用于 Android 和 iOS 的跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)