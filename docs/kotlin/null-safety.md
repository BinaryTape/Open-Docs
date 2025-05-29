[//]: # (title: 空安全)

空安全 (Null safety) 是 Kotlin 的一项特性，旨在显著降低空引用（也称为 [十亿美元的错误](https://en.wikipedia.org/wiki/Null_pointer#History)）的风险。

在许多编程语言（包括 Java）中，最常见的陷阱之一是访问空引用的成员会导致空引用异常。在 Java 中，这相当于 `NullPointerException`，简称 _NPE_。

Kotlin 明确支持空性作为其类型系统的一部分，这意味着您可以明确声明哪些变量或属性允许为 `null`。此外，当您声明非空变量时，编译器会强制这些变量不能持有 `null` 值，从而防止 NPE。

Kotlin 的空安全通过在编译时而非运行时捕获潜在的空相关问题，确保了更安全的代码。此特性通过明确表达 `null` 值，提高了代码的健壮性、可读性和可维护性，使代码更易于理解和管理。

在 Kotlin 中，导致 NPE 的唯一可能原因有：

*   显式调用 [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)。
*   使用了 [非空断言运算符 `!!`](#not-null-assertion-operator)。
*   初始化期间的数据不一致，例如：
    *   构造函数中可用的未初始化的 `this` 被用于其他地方（[“泄露的 `this`”](https://youtrack.jetbrains.com/issue/KTIJ-9751)）。
    *   [超类构造函数调用开放成员](inheritance.md#derived-class-initialization-order)，其在派生类中的实现使用了未初始化的状态。
*   Java 互操作：
    *   尝试访问 [平台类型](java-interop.md#null-safety-and-platform-types) 的 `null` 引用的成员。
    *   泛型 (generic types) 的空性问题。例如，一段 Java 代码将 `null` 添加到 Kotlin 的 `MutableList<String>` 中，而这需要 `MutableList<String?>` 才能正确处理。
    *   由外部 Java 代码引起的其他问题。

> 除了 NPE 之外，另一个与空安全相关的异常是 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)。当您尝试访问尚未初始化的属性时，Kotlin 会抛出此异常，确保非空属性在使用前已准备就绪。这通常发生在 [`lateinit` 属性](properties.md#late-initialized-properties-and-variables) 上。
>
{style="tip"}

## 可空类型和非空类型

在 Kotlin 中，类型系统区分可以持有 `null` 的类型（可空类型）和不能持有 `null` 的类型（非空类型）。例如，一个普通的 `String` 类型的变量不能持有 `null`：

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    var a: String = "abc"
    // Attempts to re-assign null to the non-nullable variable
    a = null
    print(a)
    // Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

您可以安全地调用 `a` 上的方法或访问其属性。它保证不会导致 NPE，因为 `a` 是一个非空变量。编译器确保 `a` 始终持有有效的 `String` 值，因此在 `a` 为 `null` 时访问其属性或方法不会有风险：

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    val a: String = "abc"
    // Returns the length of a non-nullable variable
    val l = a.length
    print(l)
    // 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

要允许 `null` 值，请在变量类型后面紧跟一个 `?` 符号来声明变量。例如，您可以通过写入 `String?` 来声明一个可空字符串。此表达式使 `String` 成为可以接受 `null` 的类型：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Successfully re-assigns null to the nullable variable
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

如果您尝试直接在 `b` 上访问 `length`，编译器会报告错误。这是因为 `b` 被声明为可空变量，并且可以持有 `null` 值。尝试直接访问可空类型上的属性会导致 NPE：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Re-assigns null to the nullable variable
    b = null
    // Tries to directly return the length of a nullable variable
    val l = b.length
    print(l)
    // Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String? 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

在上面的示例中，编译器要求您使用安全调用来检查空性，然后再访问属性或执行操作。有几种方法可以处理可空类型：

*   [使用 `if` 条件检查 `null`](#check-for-null-with-the-if-conditional)
*   [安全调用运算符 `?.`](#safe-call-operator)
*   [Elvis 运算符 `?:`](#elvis-operator)
*   [非空断言运算符 `!!`](#not-null-assertion-operator)
*   [可空接收者](#nullable-receiver)
*   [`let` 函数](#let-function)
*   [安全类型转换 `as?`](#safe-casts)
*   [可空类型的集合](#collections-of-a-nullable-type)

阅读以下部分以获取 `null` 处理工具和技术的详细信息和示例。

## 使用 `if` 条件检查 `null`

处理可空类型时，您需要安全地处理空性以避免 NPE。一种处理方法是使用 `if` 条件表达式显式检查空性。

例如，检查 `b` 是否为 `null`，然后访问 `b.length`：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable
    val b: String? = null
    // Checks for nullability first and then accesses length
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

在上面的示例中，编译器执行了[智能类型转换](typecasts.md#smart-casts)，将类型从可空 `String?` 更改为非空 `String`。它还会跟踪您执行的检查信息，并允许在 `if` 条件内部调用 `length`。

更复杂的条件也受支持：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"

    // Checks for nullability first and then accesses length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // String of length 6
    } else {
        // Provides alternative if the condition is not met
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

请注意，上面的示例仅在编译器能够保证 `b` 在检查和使用之间没有更改时才有效，这与[智能类型转换的先决条件](typecasts.md#smart-cast-prerequisites)相同。

## 安全调用运算符

安全调用运算符 `?.` 允许您以更短的形式安全地处理空性。如果对象为 `null`，`?.` 运算符将简单地返回 `null`，而不是抛出 NPE：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val a: String? = "Kotlin"
    // Assigns null to a nullable variable
    val b: String? = null
    
    // Checks for nullability and returns length or null
    println(a?.length)
    // 6
    println(b?.length)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

表达式 `b?.length` 检查空性，如果 `b` 非空则返回 `b.length`，否则返回 `null`。此表达式的类型是 `Int?`。

您可以在 Kotlin 中将 `?.` 运算符与 [`var` 和 `val` 变量](basic-syntax.md#variables)一起使用：

*   可空的 `var` 可以持有 `null`（例如，`var nullableValue: String? = null`）或非空值（例如，`var nullableValue: String? = "Kotlin"`）。如果它是一个非空值，您可以随时将其更改为 `null`。
*   可空的 `val` 可以持有 `null`（例如，`val nullableValue: String? = null`）或非空值（例如，`val nullableValue: String? = "Kotlin"`）。如果它是一个非空值，您不能随后将其更改为 `null`。

安全调用在链式调用中很有用。例如，Bob 是一名员工，他可能被分配到某个部门（或不分配）。该部门反过来可能有一位员工作为部门负责人。要获取 Bob 部门负责人的姓名（如果存在），您可以编写以下内容：

```kotlin
bob?.department?.head?.name
```

如果其中任何属性为 `null`，此链将返回 `null`。

您也可以将安全调用放在赋值的左侧：

```kotlin
person?.department?.head = managersPool.getManager()
```

在上面的示例中，如果安全调用链中的任何接收者为 `null`，则跳过赋值，并且根本不会评估右侧的表达式。例如，如果 `person` 或 `person.department` 为 `null`，则不会调用该函数。以下是相同安全调用但使用 `if` 条件的等效代码：

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## Elvis 运算符

在使用可空类型时，您可以检查 `null` 并提供备用值。例如，如果 `b` 不为 `null`，则访问 `b.length`。否则，返回一个备用值：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

您可以使用 Elvis 运算符 `?:` 以更简洁的方式处理此问题，而不是编写完整的 `if` 表达式：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns a non-null value
    val l = b?.length ?: 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

如果 `?:` 左侧的表达式不为 `null`，则 Elvis 运算符返回它。否则，Elvis 运算符返回右侧的表达式。右侧的表达式仅在左侧为 `null` 时才会被评估。

由于 `throw` 和 `return` 在 Kotlin 中是表达式，您也可以将它们用在 Elvis 运算符的右侧。这会很方便，例如在检查函数参数时：

```kotlin
fun foo(node: Node): String? {
    // Checks for getParent(). If not null, it's assigned to parent. If null, returns null
    val parent = node.getParent() ?: return null
    // Checks for getName(). If not null, it's assigned to name. If null, throws exception
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非空断言运算符

非空断言运算符 `!!` 将任何值转换为非空类型。

当您对一个值为非 `null` 的变量应用 `!!` 运算符时，它会被安全地作为非空类型处理，并且代码正常执行。但是，如果值为 `null`，`!!` 运算符会强制将其视为非空，这会导致 NPE。

当 `b` 不为 `null` 且 `!!` 运算符使其返回其非空值（在此示例中为 `String`）时，它会正确访问 `length`：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"
    // Treats b as non-null and accesses its length
    val l = b!!.length
    println(l)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true"}

当 `b` 为 `null` 且 `!!` 运算符使其返回其非空值时，就会发生 NPE：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Treats b as non-null and tries to access its length
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

`!!` 运算符特别有用，当您确信某个值不为 `null` 且没有发生 NPE 的可能性，但由于某些规则编译器无法保证这一点时。在这种情况下，您可以使用 `!!` 运算符显式告知编译器该值不为 `null`。

## 可空接收者

您可以将扩展函数与[可空接收者类型](extensions.md#nullable-receiver)一起使用，允许这些函数在可能为 `null` 的变量上调用。

通过在可空接收者类型上定义扩展函数，您可以在函数内部处理 `null` 值，而不是在每次调用函数的地方都检查 `null`。

例如，[`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 扩展函数可以在可空接收者上调用。当在 `null` 值上调用时，它会安全地返回字符串 `"null"` 而不会抛出异常：

```kotlin
//sampleStart
fun main() {
    // Assigns null to a nullable Person object stored in the person variable
    val person: Person? = null

    // Applies .toString to the nullable person variable and prints a string
    println(person.toString())
    // null
}

// Defines a simple Person class
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

在上面的示例中，即使 `person` 为 `null`，`.toString()` 函数也安全地返回字符串 `"null"`。这对于调试和日志记录很有帮助。

如果您期望 `.toString()` 函数返回一个可空字符串（要么是字符串表示形式，要么是 `null`），请使用[安全调用运算符 `?.`](#safe-call-operator)。`?.` 运算符仅在对象不为 `null` 时才调用 `.toString()`，否则返回 `null`：

```kotlin
//sampleStart
fun main() {
    // Assigns a nullable Person object to a variable
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // Prints "null" if person is null; otherwise prints the result of person.toString()
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Defines a Person class
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

`?.` 运算符允许您安全地处理潜在的 `null` 值，同时仍然访问可能为 `null` 的对象的属性或函数。

## Let 函数

为了处理 `null` 值并仅对非空类型执行操作，您可以将安全调用运算符 `?.` 与 [`let` 函数](scope-functions.md#let)结合使用。

这种组合对于评估表达式、检查结果是否为 `null` 以及仅在不为 `null` 时才执行代码非常有用，从而避免了手动空检查：

```kotlin
fun main() {
//sampleStart
    // Declares a list of nullable strings
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // Iterates over each item in the list
    for (item in listWithNulls) {
        // Checks if the item is null and only prints non-null values
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 安全类型转换

Kotlin 中[类型转换](typecasts.md#unsafe-cast-operator)的常规运算符是 `as` 运算符。但是，如果对象不是目标类型，常规类型转换可能会导致异常。

您可以使用 `as?` 运算符进行安全类型转换。它尝试将值转换为指定类型，如果值不是该类型，则返回 `null`：

```kotlin
fun main() {
//sampleStart
    // Declares a variable of type Any, which can hold any type of value
    val a: Any = "Hello, Kotlin!"

    // Safe casts to Int using the 'as?' operator
    val aInt: Int? = a as? Int
    // Safe casts to String using the 'as?' operator
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

上面的代码打印 `null`，因为 `a` 不是 `Int` 类型，所以类型转换安全地失败了。它还打印 `"Hello, Kotlin!"`，因为它与 `String?` 类型匹配，所以安全类型转换成功。

## 可空类型的集合

如果您有一个可空元素的集合，并且只想保留非空元素，请使用 `filterNotNull()` 函数：

```kotlin
fun main() {
//sampleStart
    // Declares a list containing some null and non-null integer values
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // Filters out null values, resulting in a list of non-null integers
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 接下来？

*   了解如何[在 Java 和 Kotlin 中处理空性](java-to-kotlin-nullability-guide.md)。
*   了解[绝对非空类型](generics.md#definitely-non-nullable-types)的泛型。