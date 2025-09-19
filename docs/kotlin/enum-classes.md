[//]: # (title: 枚举类)

枚举类最基本的用例是实现类型安全的枚举：

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
每个枚举常量都是一个对象。枚举常量之间用逗号分隔。

由于每个枚举都是枚举类的实例，它可以被初始化为：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名类

枚举常量可以声明自己的匿名类，其中包含对应的方法，也可以覆盖基类方法。

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

如果枚举类定义了任何成员，则需要用分号将常量定义与成员定义分开。

## 在枚举类中实现接口

枚举类可以实现接口（但不能派生自类），为所有枚举条目提供接口成员的共同实现，或在每个条目的匿名类中提供单独的实现。这可以通过将你想要实现的接口添加到枚举类声明中来完成，如下所示：

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

所有枚举类默认都实现了 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 接口。枚举类中的常量按自然顺序定义。关于更多信息，请参见 [排序](collection-ordering.md)。

## 使用枚举常量

Kotlin 中的枚举类具有合成属性和方法，用于列出已定义的枚举常量以及根据名称获取枚举常量。这些方法的签名如下（假设枚举类的名称为 `EnumClass`）：

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

下面是它们实际运用中的一个示例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

`valueOf()` 方法会抛出 `IllegalArgumentException`，如果指定的名称与类中定义的任何枚举常量都不匹配。

在 Kotlin 1.9.0 引入 `entries` 之前，`values()` 函数用于检索枚举常量数组。

每个枚举常量还具有属性：[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) 和 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)，用于获取其在枚举类声明中的名称和位置（从 0 开始）：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // prints RED
    println(RGB.RED.ordinal) // prints 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

> 为了减少处理枚举条目时的重复，可以尝试上下文敏感解析（目前处于预览阶段）。
> 这项特性允许在预期类型已知时省略枚举类名称，例如在 `when` 表达式中或在赋值给类型化变量时。
>
> 关于更多信息，请参见 [上下文敏感解析预览](whatsnew22.md#preview-of-context-sensitive-resolution) 或相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
>
{style="tip"}

你可以使用 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 和 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 函数以泛型方式访问枚举类中的常量。在 Kotlin 2.0.0 中，引入了 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 函数，作为 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 函数的替代。`enumEntries<T>()` 函数返回给定枚举类型 `T` 的所有枚举条目的 `list`。

`enumValues<T>()` 函数仍然受支持，但我们推荐你使用 `enumEntries<T>()` 函数替代，因为它对性能的影响更小。每次调用 `enumValues<T>()` 都会创建一个新数组，而每次调用 `enumEntries<T>()` 都会返回相同的 `list`，这效率高得多。

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 关于内联函数和具体化类型形参的更多信息，请参见 [内联函数](inline-functions.md)。
>
> {style="tip"}