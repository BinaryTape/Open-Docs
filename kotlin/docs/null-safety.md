---
title: "Null 安全"
---
空安全是 Kotlin 的一项特性，旨在显著降低空引用（也称为[价值十亿美元的错误](https://en.wikipedia.org/wiki/Null_pointer#History)）的风险。

包括 Java 在内的许多编程语言中最常见的陷阱之一是，访问空引用的成员会导致空引用异常。在 Java 中，这相当于 `NullPointerException`，或简称为 _NPE_。

Kotlin 显式支持将可空性作为其类型系统的一部分，这意味着您可以显式声明哪些变量或属性可以为 `null`。此外，当您声明不可为空的变量时，编译器会强制这些变量不能保存 `null` 值，从而防止 NPE。

Kotlin 的空安全通过在编译时而不是运行时捕获潜在的与 null 相关的问题，从而确保更安全的代码。此特性通过显式表达 `null` 值来提高代码的健壮性、可读性和可维护性，使代码更易于理解和管理。

Kotlin 中 NPE 的唯一可能原因有：

* 显式调用 [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)。
* 使用 [非空断言运算符 `!!`](#not-null-assertion-operator)。
* 初始化期间的数据不一致，例如：
  * 在构造函数中可用的未初始化的 `this` 在其他地方使用（[“泄漏的 `this`”](https://youtrack.jetbrains.com/issue/KTIJ-9751)）。
  * [超类构造函数调用开放成员](inheritance#derived-class-initialization-order)，其在派生类中的实现使用未初始化的状态。
* Java 互操作：
  * 尝试访问 [平台类型](java-interop#null-safety-and-platform-types)的 `null` 引用的成员。
  * 泛型类型的可空性问题。例如，一段 Java 代码将 `null` 添加到 Kotlin 的 `MutableList<String>` 中，这需要 `MutableList<String?>` 才能正确处理。
  * 由外部 Java 代码引起的其他问题。

:::tip
除了 NPE 之外，另一个与空安全相关的异常是 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)。当您尝试访问尚未初始化的属性时，Kotlin 会抛出此异常，从而确保在非空属性准备就绪之前不会使用它们。这通常发生在 [`lateinit` 属性](properties#late-initialized-properties-and-variables)中。

:::

## 可空类型和非可空类型 (Nullable types and non-nullable types)

在 Kotlin 中，类型系统区分可以保存 `null` 的类型（可空类型）和不能保存 `null` 的类型（非可空类型）。例如，类型为 `String` 的常规变量不能保存 `null`：

```kotlin
fun main() {

    // 将非空字符串赋值给变量
    var a: String = "abc"
    // 尝试将 null 重新赋值给不可为空的变量
    a = null
    print(a)
    // Null 不能作为非空类型 String 的值

}
```

您可以安全地调用 `a` 上的方法或访问其属性。保证不会导致 NPE，因为 `a` 是一个不可为空的变量。编译器确保 `a` 始终保存有效的 `String` 值，因此不存在在其为 `null` 时访问其属性或方法的风险：

```kotlin
fun main() {

    // 将非空字符串赋值给变量
    val a: String = "abc"
    // 返回一个非空变量的长度
    val l = a.length
    print(l)
    // 3

}
```

要允许 `null` 值，请在变量类型之后立即使用 `?` 符号声明变量。例如，您可以通过编写 `String?` 来声明一个可为空的字符串。此表达式使 `String` 成为可以接受 `null` 的类型：

```kotlin
fun main() {

    // 将可为空的字符串赋值给变量
    var b: String? = "abc"
    // 成功将 null 重新赋值给可为空的变量
    b = null
    print(b)
    // null

}
```

如果您尝试直接在 `b` 上访问 `length`，编译器会报告一个错误。这是因为 `b` 被声明为一个可为空的变量，并且可以保存 `null` 值。尝试直接访问可空类型的属性会导致 NPE：

```kotlin
fun main() {

    // 将可为空的字符串赋值给变量
    var b: String? = "abc"
    // 将 null 重新赋值给可为空的变量
    b = null
    // 尝试直接返回可为空的变量的长度
    val l = b.length
    print(l)
    // 只有安全调用 (?.) 或非空断言 (!!.) 才允许在 String? 类型的可空接收器上使用

}
```

在上面的示例中，编译器要求您使用安全调用来检查可空性，然后再访问属性或执行操作。有几种方法可以处理可空类型：

* [使用 `if` 条件语句检查 `null`](#check-for-null-with-the-if-conditional)
* [安全调用运算符 `?.`](#safe-call-operator)
* [Elvis 运算符 `?:`](#elvis-operator)
* [非空断言运算符 `!!`](#not-null-assertion-operator)
* [可空接收器 (Nullable receiver)](#nullable-receiver)
* [`let` 函数](#let-function)
* [安全转换 `as?`](#safe-casts)
* [可空类型集合 (Collections of a nullable type)](#collections-of-a-nullable-type)

阅读以下部分，了解有关 `null` 处理工具和技术的详细信息和示例。

## 使用 if 条件语句检查 null (Check for null with the if conditional)

使用可空类型时，您需要安全地处理可空性，以避免 NPE。一种处理方法是使用 `if` 条件表达式显式检查可空性。

例如，检查 `b` 是否为 `null`，然后访问 `b.length`：

```kotlin
fun main() {

    // 将 null 赋值给可为空的变量
    val b: String? = null
    // 首先检查可空性，然后访问 length
    val l = if (b != null) b.length else -1
    print(l)
    // -1

}
```

在上面的示例中，编译器执行[智能类型转换](typecasts#smart-casts)，将类型从可为空的 `String?` 更改为不可为空的 `String`。它还会跟踪有关您执行的检查的信息，并允许在 `if` 条件语句中调用 `length`。

也支持更复杂的条件：

```kotlin
fun main() {

    // 将可为空的字符串赋值给变量
    val b: String? = "Kotlin"

    // 首先检查可空性，然后访问 length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
    // 如果不满足条件，则提供替代方案
    } else {
        print("Empty string")
        // String of length 6
    }

}
```

请注意，只有当编译器可以保证 `b` 在检查和使用之间没有更改时，上面的示例才有效，与[智能类型转换的先决条件](typecasts#smart-cast-prerequisites)相同。

## 安全调用运算符 (Safe call operator)

安全调用运算符 `?.` 允许您以更短的形式安全地处理可空性。如果对象为 `null`，`?.` 运算符不会抛出 NPE，而是简单地返回 `null`：

```kotlin
fun main() {

    // 将可为空的字符串赋值给变量
    val a: String? = "Kotlin"
    // 将 null 赋值给可为空的变量
    val b: String? = null
    
    // 检查可空性，然后返回长度或 null
    println(a?.length)
    // 6
    println(b?.length)
    // null

}
```

`b?.length` 表达式检查可空性，如果 `b` 不为 null，则返回 `b.length`，否则返回 `null`。此表达式的类型为 `Int?`。

您可以在 Kotlin 中将 `?.` 运算符与 [`var` 和 `val` 变量](basic-syntax#variables)一起使用：

* 可为空的 `var` 可以保存 `null`（例如，`var nullableValue: String? = null`）或非空值（例如，`var nullableValue: String? = "Kotlin"`）。如果它是一个非空值，您可以随时将其更改为 `null`。
* 可为空的 `val` 可以保存 `null`（例如，`val nullableValue: String? = null`）或非空值（例如，`val nullableValue: String? = "Kotlin"`）。如果它是一个非空值，您不能随后将其更改为 `null`。

安全调用在链中很有用。例如，Bob 是一名员工，可能会（也可能不会）被分配到一个部门。该部门反过来可能有另一名员工作为部门负责人。要获取 Bob 的部门负责人的姓名（如果有），您可以编写以下内容：

```kotlin
bob?.department?.head?.name
```

如果其任何属性为 `null`，则此链将返回 `null`。以下是与同一安全调用等效的 `if` 条件语句：

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

您也可以将安全调用放在赋值的左侧：

```kotlin
person?.department?.head = managersPool.getManager()
```

在上面的示例中，如果安全调用链中的一个接收器为 `null`，则会跳过赋值，并且根本不会评估右侧的表达式。例如，如果 `person` 或 `person.department` 为 `null`，则不会调用该函数。

## Elvis 运算符 (Elvis operator)

使用可空类型时，您可以检查 `null` 并提供替代值。例如，如果 `b` 不为 `null`，则访问 `b.length`。否则，返回一个替代值：

```kotlin
fun main() {

    // 将 null 赋值给可为空的变量
    val b: String? = null
    // 检查可空性。如果不为 null，则返回长度。如果为 null，则返回 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0

}
```

您可以使用 Elvis 运算符 `?:` 以更简洁的方式处理此问题，而不是编写完整的 `if` 表达式：

```kotlin
fun main() {

    // 将 null 赋值给可为空的变量
    val b: String? = null
    // 检查可空性。如果不为 null，则返回长度。如果为 null，则返回一个非空值
    val l = b?.length ?: 0
    println(l)
    // 0

}
```

如果 `?:` 左侧的表达式不为 `null`，则 Elvis 运算符会返回它。否则，Elvis 运算符会返回右侧的表达式。仅当左侧为 `null` 时，才会评估右侧的表达式。

由于 `throw` 和 `return` 是 Kotlin 中的表达式，因此您也可以在 Elvis 运算符的右侧使用它们。例如，在检查函数参数时，这可能很方便：

```kotlin
fun foo(node: Node): String? {
    // 检查 getParent()。如果不为 null，则将其分配给 parent。如果为 null，则返回 null
    val parent = node.getParent() ?: return null
    // 检查 getName()。如果不为 null，则将其分配给 name。如果为 null，则抛出异常
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非空断言运算符 (Not-null assertion operator)

非空断言运算符 `!!` 将任何值转换为非可空类型。

当您将 `!!` 运算符应用于值不为 `null` 的变量时，它会被安全地处理为非可空类型，并且代码正常执行。但是，如果值为 `null`，则 `!!` 运算符会强制将其视为非可空类型，从而导致 NPE。

当 `b` 不为 `null` 并且 `!!` 运算符使其返回其非空值（在本例中为 `String`）时，它会正确访问 `length`：

```kotlin
fun main() {

    // 将可为空的字符串赋值给变量
    val b: String? = "Kotlin"
    // 将 b 视为非空值并访问其长度
    val l = b!!.length
    println(l)
    // 6

}
```

当 `b` 为 `null` 并且 `!!` 运算符使其返回其非空值时，会发生 NPE：

```kotlin
fun main() {

    // 将 null 赋值给可为空的变量
    val b: String? = null
    // 将 b 视为非空值并尝试访问其长度
    val l = b!!.length
    println(l) 
    // 线程 "main" java.lang.NullPointerException 中的异常

}
```

当您确信某个值不为 `null` 并且没有机会获得 NPE 时，`!!` 运算符特别有用，但由于某些规则，编译器无法保证这一点。在这种情况下，您可以使用 `!!` 运算符显式告诉编译器该值不为 `null`。

## 可空接收器 (Nullable receiver)

您可以将扩展函数与[可空接收器类型](extensions#nullable-receiver)一起使用，从而允许在可能为 `null` 的变量上调用这些函数。

通过在可空接收器类型上定义扩展函数，您可以在函数本身中处理 `null` 值，而不是在调用函数的每个位置检查 `null`。

例如，[`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 扩展函数可以在可空接收器上调用。在 `null` 值上调用时，它会安全地返回字符串 `"null"`，而不会抛出异常：

```kotlin

fun main() {
    // 将 null 赋值给存储在 person 变量中的可为空的 Person 对象
    val person: Person? = null

    // 将 .toString 应用于可为空的 person 变量并打印字符串
    println(person.toString())
    // null
}

// 定义一个简单的 Person 类
data class Person(val name: String)

```

在上面的示例中，即使 `person` 为 `null`，`.toString()` 函数也会安全地返回字符串 `"null"`。这有助于调试和日志记录。

如果您希望 `.toString()` 函数返回一个可为空的字符串（字符串表示形式或 `null`），请使用[安全调用运算符 `?.`](#safe-call-operator)。
`?.` 运算符仅在对象不为 `null` 时才调用 `.toString()`，否则返回 `null`：

```kotlin

fun main() {
    // 将可为空的 Person 对象赋值给变量
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // 如果 person 为 null，则打印“null”；否则，打印 person.toString() 的结果
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// 定义一个 Person 类
data class Person(val name: String)

```

`?.` 运算符允许您安全地处理潜在的 `null` 值，同时仍然访问可能为 `null` 的对象的属性或函数。

## Let 函数 (Let function)

要处理 `null` 值并仅对非空类型执行操作，您可以将安全调用运算符 `?.` 与
[`let` 函数](scope-functions#let)一起使用。

此组合对于评估表达式、检查结果是否为 `null` 以及仅在结果不为 `null` 时才执行代码非常有用，从而避免了手动 null 检查：

```kotlin
fun main() {

    // 声明一个可为空的字符串列表
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // 迭代列表中的每个项目
    for (item in listWithNulls) {
        // 检查该项是否为 null，并且只打印非空值
        item?.let { println(it) }
        //Kotlin 
    }

}
```

## 安全转换 (Safe casts)

用于[类型转换](typecasts#unsafe-cast-operator)的常规 Kotlin 运算符是 `as` 运算符。但是，如果对象不是目标类型，则常规类型转换可能会导致异常。

您可以使用 `as?` 运算符进行安全转换。它尝试将值转换为指定的类型，如果该值不是该类型，则返回 `null`：

```kotlin
fun main() {

    // 声明一个类型为 Any 的变量，该变量可以保存任何类型的值
    val a: Any = "Hello, Kotlin!"

    // 使用“as?”运算符安全地转换为 Int
    val aInt: Int? = a as? Int
    // 使用“as?”运算符安全地转换为 String
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"

}
```

上面的代码打印 `null`，因为 `a` 不是 `Int`，因此转换安全地失败。它还打印
`"Hello, Kotlin!"`，因为它与 `String?` 类型匹配，因此安全转换成功。

## 可空类型集合 (Collections of a nullable type)

如果您有一个可空元素的集合，并且只想保留非空元素，请使用
`filterNotNull()` 函数：

```kotlin
fun main() {

    // 声明一个包含一些 null 和非 null 整数值的列表
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // 过滤掉 null 值，从而得到一个非 null 整数列表
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]

}
```

## 下一步是什么？ (What's next?)

* 了解如何在 [Java 和 Kotlin 中处理可空性](java-to-kotlin-nullability-guide)。
* 了解[明确的非空](generics#definitely-non-nullable-types)泛型类型。