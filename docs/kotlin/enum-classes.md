---
title: 枚举类
---
enum class 最基本的用例是实现类型安全的 enum（枚举）：

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
每个 enum 常量都是一个对象。Enum 常量之间用逗号分隔。

由于每个 enum 都是 enum class 的一个实例，因此可以像这样进行初始化：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名类

Enum 常量可以声明它们自己的匿名类，包含它们对应的方法，以及重写基类方法。

```kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

如果 enum class 定义了任何成员，请用分号将常量定义与成员定义分隔开。

## 在 enum class 中实现接口

Enum class 可以实现接口（但不能继承类），可以为所有条目提供接口成员的通用实现，也可以为每个条目在其匿名类中提供单独的实现。
这可以通过将要实现的接口添加到 enum class 声明中来完成，如下所示：

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```

默认情况下，所有 enum class 都实现 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
接口。enum class 中的常量按自然顺序定义。有关更多信息，请参见 [排序](collection-ordering)。

## 使用 enum 常量

Kotlin 中的 enum class 具有合成属性和方法，用于列出定义的 enum 常量以及按名称获取 enum 常量。
这些方法的签名如下（假设 enum class 的名称为 `EnumClass`）：

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

以下是它们在实际应用中的示例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```

如果指定的名称与类中定义的任何 enum 常量都不匹配，则 `valueOf()` 方法会抛出 `IllegalArgumentException`。

在 Kotlin 1.9.0 中引入 `entries` 之前，`values()` 函数用于检索 enum 常量的数组。

每个 enum 常量还具有属性：[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)
和 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)，用于获取其名称和
在 enum class 声明中的位置（从 0 开始）：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {

    println(RGB.RED.name)    // prints RED
    println(RGB.RED.ordinal) // prints 0

}
```

你可以使用
[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 和 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 函数以通用方式访问 enum class 中的常量。
在 Kotlin 2.0.0 中，引入了 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 函数来替代 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)
函数。`enumEntries<T>()` 函数返回给定 enum 类型 `T` 的所有 enum 条目的列表。

`enumValues<T>()` 函数仍然受支持，但我们建议你使用 `enumEntries<T>()` 函数，
因为它对性能的影响较小。每次调用 `enumValues<T>()` 都会创建一个新数组，而每次
调用 `enumEntries<T>()` 都会返回相同的列表，这效率更高。

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 有关内联函数和具体化类型参数的更多信息，请参见 [内联函数](inline-functions)。
>
>