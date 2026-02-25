[//]: # (title: 枚举类)

枚举类最基本的用法是实现类型安全的枚举：

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
每个枚举常量都是一个对象。枚举常量之间用逗号分隔。

由于每个枚举都是枚举类的一个实例，因此可以如下初始化：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名类

枚举常量可以声明自己的匿名类，其中包含相应的方法，以及重写的基类方法。

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

如果枚举类定义了任何成员，请使用分号将常量定义与成员定义分开。

## 在枚举类中实现接口

枚举类可以实现接口（但不能继承类），既可以为所有条目提供接口成员的通用实现，也可以在其匿名类中为每个条目提供单独的实现。通过在枚举类声明中添加要实现的接口来实现，如下所示：

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

//sampleStart
enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}
//sampleEnd

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

所有枚举类默认都实现了 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 接口。枚举类中的常量按自然顺序定义。更多信息请参阅[排序](collection-ordering.md)。

## 使用枚举常量

Kotlin 中的枚举类具有合成属性和方法，用于列出定义的枚举常量以及通过名称获取枚举常量。这些方法的签名如下（假设枚举类的名称为 `EnumClass`）：

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // 专门的 List<EnumClass>
```

下面是它们的使用示例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // 打印 RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // 打印 "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

如果指定的名称与类中定义的任何枚举常量都不匹配，`valueOf()` 方法将抛出 `IllegalArgumentException`。

在 Kotlin 1.9.0 引入 `entries` 之前，使用的是 `values()` 函数来检索枚举常量数组。

每个枚举常量还具有属性：[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) 和 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)，用于获取其在枚举类声明中的名称和位置（从 0 开始）：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // 打印 RED
    println(RGB.RED.ordinal) // 打印 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

> 为了在处理枚举条目时减少重复，请尝试使用上下文相关解析（目前处于预览阶段）。此功能允许在已知预期类型时省略枚举类名称，例如在 `when` 表达式中或赋值给类型化变量时。
>
> 更多信息请参阅[上下文相关解析预览](whatsnew22.md#preview-of-context-sensitive-resolution)或相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
>
{style="tip"}

你可以使用 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 和 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 函数以泛型方式访问枚举类中的常量。在 Kotlin 2.0.0 中，引入了 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 函数作为 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 函数的替代。`enumEntries<T>()` 函数返回给定枚举类型 `T` 的所有枚举条目列表。

`enumValues<T>()` 函数仍然受支持，但我们建议你改用 `enumEntries<T>()` 函数，因为它的性能影响更小。每次调用 `enumValues<T>()` 都会创建一个新数组，而每次调用 `enumEntries<T>()` 都会返回同一个列表，这样效率更高。

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 有关内联函数和具体化类型参数的更多信息，请参阅[内联函数](inline-functions.md)。
>
> {style="tip"}