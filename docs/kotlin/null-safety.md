[//]: # (title: 空安全)

空安全是 Kotlin 的一项特性，旨在显著降低空引用的风险，空引用也被称作[价值亿万美元的错误](https://en.wikipedia.org/wiki/Null_pointer#History)。

在许多编程语言（包括 Java）中，最常见的陷阱之一是访问空引用的成员会导致空引用异常。在 Java 中，这等同于 `NullPointerException`，简称 _NPE_。

Kotlin 在其类型系统中显式支持可空性，这意味着你可以显式声明哪些变量或属性允许为 `null`。此外，当你声明非空变量时，编译器会强制这些变量不能持有 `null` 值，从而防止 NPE 的发生。

Kotlin 的空安全通过在编译期而不是运行时捕获潜在的空值相关问题，确保了更安全的代码。此特性通过显式表达 `null` 值，提高了代码的健壮性、可读性和可维护性，使代码更易于理解和管理。

在 Kotlin 中，NPE 唯一可能的原因是：

*   显式调用 [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)。
*   使用[非空断言操作符 `!!`](#not-null-assertion-operator)。
*   初始化期间的数据不一致，例如：
    *   构造函数中可用的未初始化 `this` 在其他地方被使用（[“this 泄漏”](https://youtrack.jetbrains.com/issue/KTIJ-9751)）。
    *   超类构造函数调用[开放成员](inheritance.md#derived-class-initialization-order)，而该成员在派生类中的实现使用了未初始化状态。
*   Java 互操作：
    *   尝试访问[平台类型](java-interop.md#null-safety-and-platform-types)的 `null` 引用的成员。
    *   泛型方面可空性问题。例如，一段 Java 代码将 `null` 添加到 Kotlin 的 `MutableList<String>` 中，而这需要 `MutableList<String?>` 才能正确处理。
    *   外部 Java 代码引起的其他问题。

> 除了 NPE，另一个与空安全相关的异常是 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)。当你尝试访问尚未初始化的属性时，Kotlin 会抛出此异常，确保非空属性在使用前已准备就绪。这通常发生在 [`lateinit` 属性](properties.md#late-initialized-properties-and-variables)中。
>
{style="tip"}

## 可空类型与非空类型

在 Kotlin 中，类型系统区分可以持有 `null` 的类型（可空类型）和不能持有 `null` 的类型（非空类型）。例如，`String` 类型的常规变量不能持有 `null`：

```kotlin
fun main() {
//sampleStart
    // 将非空字符串赋值给变量
    var a: String = "abc"
    // 尝试将 null 重新赋值给非空变量
    a = null
    print(a)
    // Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

你可以安全地调用 `a` 上的方法或访问其属性。由于 `a` 是一个非空变量，因此保证不会导致 NPE。编译器确保 `a` 始终持有有效的 `String` 值，因此当 `a` 为 `null` 时，没有访问其属性或方法的风险：

```kotlin
fun main() {
//sampleStart
    // 将非空字符串赋值给变量
    val a: String = "abc"
    // 返回非空变量的长度
    val l = a.length
    print(l)
    // 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

若要允许 `null` 值，请在变量类型后紧跟 `?` 符号来声明变量。例如，你可以通过编写 `String?` 来声明一个可空字符串。此表达式使 `String` 成为可以接受 `null` 的类型：

```kotlin
fun main() {
//sampleStart
    // 将可空字符串赋值给变量
    var b: String? = "abc"
    // 成功将 null 重新赋值给可空变量
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

如果你尝试直接访问 `b` 上的 `length`，编译器会报告错误。这是因为 `b` 被声明为可空变量，可以持有 `null` 值。直接尝试访问可空变量的属性会导致 NPE：

```kotlin
fun main() {
//sampleStart
    // 将可空字符串赋值给变量
    var b: String? = "abc"
    // 将 null 重新赋值给可空变量
    b = null
    // 尝试直接返回可空变量的长度
    val l = b.length
    print(l)
    // Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String? 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

在上面的例子中，编译器要求你在访问属性或执行操作之前，使用安全调用来检测可空性。有几种处理可空类型的方法：

*   [使用 `if` 条件语句检测 `null`](#check-for-null-with-the-if-conditional)
*   [安全调用操作符 `?.`](#safe-call-operator)
*   [Elvis 操作符 `?:`](#elvis-operator)
*   [非空断言操作符 `!!`](#not-null-assertion-operator)
*   [可空接收者](#nullable-receiver)
*   [`let` 函数](#let-function)
*   [安全转换 `as?`](#safe-casts)
*   [可空类型集合](#collections-of-a-nullable-type)

关于 `null` 处理工具和技术的详细信息和示例，请参阅后续章节。

## 使用 `if` 条件语句检测 `null`

在使用可空类型时，你需要安全地处理可空性以避免 NPE。一种方法是使用 `if` 条件表达式显式检测可空性。

例如，检测 `b` 是否为 `null`，然后访问 `b.length`：

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给可空变量
    val b: String? = null
    // 首先检测可空性，然后访问长度
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

在上面的例子中，编译器执行[智能转换](typecasts.md#smart-casts)，将类型从可空 `String?` 更改为非空 `String`。它还会跟踪你所执行检测的信息，并允许在 `if` 条件语句内部调用 `length`。

也支持更复杂的条件：

```kotlin
fun main() {
//sampleStart
    // 将可空字符串赋值给变量
    val b: String? = "Kotlin"

    // 首先检测可空性，然后访问长度
    if (b != null && b.length > 0) {
        print("长度为 ${b.length} 的字符串")
        // String of length 6
    } else {
        // 如果条件不满足，则提供替代方案
        print("空字符串")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

请注意，上面的示例仅在编译器可以保证 `b` 在检测和使用之间不会改变时才有效，这与[智能转换的先决条件](typecasts.md#smart-cast-prerequisites)相同。

## 安全调用操作符

安全调用操作符 `?.` 允许你以更简洁的形式安全地处理可空性。如果对象为 `null`，`?.` 操作符不会抛出 NPE，而是直接返回 `null`：

```kotlin
fun main() {
//sampleStart
    // 将可空字符串赋值给变量
    val a: String? = "Kotlin"
    // 将 null 赋值给可空变量
    val b: String? = null
    
    // 检测可空性并返回长度或 null
    println(a?.length)
    // 6
    println(b?.length)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b?.length` 表达式会检测可空性，如果 `b` 非空，则返回 `b.length`，否则返回 `null`。此表达式的类型为 `Int?`。

在 Kotlin 中，你可以将 `?.` 操作符与 [`var` 和 `val` 变量](basic-syntax.md#variables)一起使用：

*   可空 `var` 可以持有 `null`（例如，`var nullableValue: String? = null`）或非空值（例如，`var nullableValue: String? = "Kotlin"`）。如果它是一个非空值，你可以在任何时候将其更改为 `null`。
*   可空 `val` 可以持有 `null`（例如，`val nullableValue: String? = null`）或非空值（例如，`val nullableValue: String? = "Kotlin"`）。如果它是一个非空值，你之后不能将其更改为 `null`。

安全调用在链式调用中很有用。例如，Bob 是一名员工，他可能被分配到某个部门（也可能没有）。该部门反过来可能有一位员工作为部门主管。若要获取 Bob 的部门主管的姓名（如果存在），你可以这样编写：

```kotlin
bob?.department?.head?.name
```

如果链中的任何属性为 `null`，此链将返回 `null`。

你也可以将安全调用放在赋值语句的左侧：

```kotlin
person?.department?.head = managersPool.getManager()
```

在上面的例子中，如果安全调用链中的某个接收者为 `null`，赋值操作就会被跳过，并且右侧的表达式根本不会被求值。例如，如果 `person` 或 `person.department` 为 `null`，则该函数不会被调用。下面是与上述安全调用等价的 `if` 条件语句：

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## Elvis 操作符

当处理可空类型时，你可以检测 `null` 并提供一个替代值。例如，如果 `b` 非空，则访问 `b.length`。否则，返回一个替代值：

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给可空变量  
    val b: String? = null
    // 检测可空性。如果非空，则返回长度。如果为 null，则返回 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

你可以使用 Elvis 操作符 `?:` 以更简洁的方式处理这种情况，而无需编写完整的 `if` 表达式：

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给可空变量  
    val b: String? = null
    // 检测可空性。如果非空，则返回长度。如果为 null，则返回一个非空值
    val l = b?.length ?: 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

如果 `?:` 左侧的表达式非空，Elvis 操作符会返回该表达式。否则，Elvis 操作符会返回右侧的表达式。右侧的表达式仅当左侧为 `null` 时才会被求值。

由于 `throw` 和 `return` 在 Kotlin 中是表达式，你也可以在 Elvis 操作符的右侧使用它们。这在例如检测函数实参时会很方便：

```kotlin
fun foo(node: Node): String? {
    // 检测 getParent()。如果非空，则赋值给 parent。如果为 null，则返回 null
    val parent = node.getParent() ?: return null
    // 检测 getName()。如果非空，则赋值给 name。如果为 null，则抛出异常
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非空断言操作符

非空断言操作符 `!!` 将任何值转换为非空类型。

当你将 `!!` 操作符应用于一个值非 `null` 的变量时，它会安全地作为非空类型处理，并且代码正常执行。然而，如果值为 `null`，`!!` 操作符会强制将其视为非空，从而导致 NPE。

当 `b` 非空且 `!!` 操作符使其返回其非空值（在本例中为 `String`）时，它会正确访问 `length`：

```kotlin
fun main() {
//sampleStart
    // 将可空字符串赋值给变量
    val b: String? = "Kotlin"
    // 将 b 视为非空并访问其长度
    val l = b!!.length
    println(l)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true"}

当 `b` 为 `null` 且 `!!` 操作符使其返回其非空值时，就会发生 NPE：

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给可空变量  
    val b: String? = null
    // 将 b 视为非空并尝试访问其长度
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

`!!` 操作符在以下情况特别有用：你确信某个值非 `null` 且不会发生 NPE，但由于某些规则，编译器无法保证这一点。在这种情况下，你可以使用 `!!` 操作符显式告知编译器该值非 `null`。

## 可空接收者

你可以对[可空接收者类型](extensions.md#nullable-receiver)使用扩展函数，这允许在可能为 `null` 的变量上调用这些函数。

通过在可空接收者类型上定义扩展函数，你可以在函数本身内部处理 `null` 值，而无需在每个调用函数的地方检测 `null`。

例如，可以在可空接收者上调用 [`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 扩展函数。当在 `null` 值上调用时，它会安全地返回字符串 `"null"` 而不抛出异常：

```kotlin
//sampleStart
fun main() {
    // 将 null 赋值给存储在 person 变量中的可空 Person 对象
    val person: Person? = null

    // 对可空 person 变量应用 .toString 并打印字符串
    println(person.toString())
    // null
}

// 定义一个简单的 Person 类
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

在上面的示例中，即使 `person` 为 `null`，`.toString()` 函数也会安全地返回字符串 `"null"`。这有助于调试和日志记录。

如果你期望 `.toString()` 函数返回一个可空字符串（无论是字符串表示还是 `null`），请使用[安全调用操作符 `?.`](#safe-call-operator)。`?.` 操作符仅在对象非 `null` 时才调用 `.toString()`，否则返回 `null`：

```kotlin
//sampleStart
fun main() {
    // 将可空 Person 对象赋值给变量
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // 如果 person 为 null 则打印 “null”；否则打印 person.toString() 的结果
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// 定义一个 Person 类
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

`?.` 操作符允许你安全地处理潜在的 `null` 值，同时仍然可以访问可能为 `null` 的对象的属性或函数。

## Let 函数

若要处理 `null` 值并仅在非空类型上执行操作，你可以将安全调用操作符 `?.` 与 [`let` 函数](scope-functions.md#let)结合使用。

这种组合对于求值一个表达式、检测结果是否为 `null`，并仅当非 `null` 时才执行代码非常有用，从而避免手动 `null` 检测：

```kotlin
fun main() {
//sampleStart
    // 声明一个包含可空字符串的 list
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // 遍历 list 中的每个项
    for (item in listWithNulls) {
        // 检测项是否为 null，并且只打印非空值
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 安全转换

Kotlin 中用于[类型转换](typecasts.md#unsafe-cast-operator)的常规操作符是 `as` 操作符。然而，如果对象不是目标类型，常规转换可能会导致异常。

你可以使用 `as?` 操作符进行安全转换。它尝试将值转换为指定类型，如果值不是该类型，则返回 `null`：

```kotlin
fun main() {
//sampleStart
    // 声明一个 Any 类型的变量，它可以持有任何类型的值
    val a: Any = "Hello, Kotlin!"

    // 使用 'as?' 操作符安全转换为 Int
    val aInt: Int? = a as? Int
    // 使用 'as?' 操作符安全转换为 String
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

上述代码打印 `null`，因为 `a` 不是 `Int` 类型，所以转换安全失败。它也打印 `"Hello, Kotlin!"`，因为它匹配 `String?` 类型，所以安全转换成功。

## 可空类型集合

如果你有一个包含可空元素的集合，并且只想保留非空元素，请使用 `filterNotNull()` 函数：

```kotlin
fun main() {
//sampleStart
    // 声明一个包含一些 null 和非空整数值的 List
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // 过滤掉 null 值，得到一个非空整数的 List
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 下一步？

*   了解如何[在 Java 和 Kotlin 中处理可空性](java-to-kotlin-nullability-guide.md)。
*   了解[确定非空的](generics.md#definitely-non-nullable-types)泛型。