---
title: 数字
---
## 整型

Kotlin 提供了一组内置类型来表示数字。对于整数，有四种类型，它们具有不同的大小和值范围：

| 类型     | 大小 (位) | 最小值                                    | 最大值                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`   | 8           | -128                                         | 127                                            |
| `Short`  | 16          | -32768                                       | 32767                                          |
| `Int`    | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`   | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |
:::note
除了有符号整型，Kotlin 还提供无符号整型。由于无符号整型针对不同的用例，因此将单独介绍。请参阅 [](unsigned-integer-types)。

当初始化一个没有显式类型说明的变量时，编译器会自动推断类型，从 `Int` 开始，选择能够表示该值的最小范围的类型。如果该值未超出 `Int` 的范围，则类型为 `Int`。如果超出该范围，则类型为 `Long`。要显式指定 `Long` 值，请在值后附加后缀 `L`。要使用 `Byte` 或 `Short` 类型，请在声明中显式指定它。显式类型说明会触发编译器检查该值是否超出指定类型的范围。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮点型

对于实数，Kotlin 提供了浮点类型 `Float` 和 `Double`，它们符合 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754)。`Float` 反映了 IEEE 754 的 _单精度_，而 `Double` 反映了 _双精度_。

这些类型的大小不同，并为具有不同精度的浮点数提供存储：

| 类型     | 大小 (位) | 有效位数 | 指数位数 | 十进制位数 |
|----------|-------------|------------------|---------------|----------------|
| `Float`  | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |

只能使用带有小数部分的数字初始化 `Double` 和 `Float` 变量。用句点 (`.`) 分隔小数部分和整数部分

对于用小数值初始化的变量，编译器会推断 `Double` 类型：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```

要显式指定值的 `Float` 类型，请添加后缀 `f` 或 `F`。如果以这种方式提供的值包含超过 7 个十进制数字，则会对其进行舍入：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

与某些其他语言不同，Kotlin 中没有数字的隐式扩展转换。例如，具有 `Double` 参数的函数只能在 `Double` 值上调用，而不能在 `Float`、`Int` 或其他数值上调用：

```kotlin
fun main() {

    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch

}
```

要将数值转换为不同的类型，请使用[显式转换](#explicit-number-conversions)。

## 数字的字面常量

整型值有几种字面常量：

* 十进制：`123`
* Long 类型，以大写字母 `L` 结尾：`123L`
* 十六进制：`0x0F`
* 二进制：`0b00001011`

Kotlin 不支持八进制字面量。

:::

Kotlin 还支持浮点数的传统表示法：

* Double 类型（当小数部分不以字母结尾时，默认为 Double 类型）：`123.5`、`123.5e10`
* Float 类型，以字母 `f` 或 `F` 结尾：`123.5f`

可以使用下划线使数字常量更具可读性：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

:::tip
无符号整型字面量也有特殊的后缀。阅读更多关于 [无符号整型字面量](unsigned-integer-types) 的信息。

:::

## Java 虚拟机上的数字的装箱和缓存

JVM 存储数字的方式可能会使您的代码表现得与直觉相反，因为默认情况下小（字节大小）数字使用缓存。

JVM 将数字存储为原始类型：`int`、`double` 等。当使用 [泛型类型](generics) 或创建可空数字引用（例如 `Int?`）时，数字会被装箱到 Java 类中，例如 `Integer` 或 `Double`。

JVM 应用了一种 [内存优化技术](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7) 用于 `Integer` 和其他表示介于 `−128` 和 `127` 之间的数字的对象。对此类对象的所有可空引用都指向同一个缓存对象。例如，以下代码中的可空对象是 [引用相等](equality#referential-equality) 的：

```kotlin
fun main() {

    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true

}
```

对于此范围之外的数字，可空对象是不同的，但 [结构相等](equality#structural-equality)：

```kotlin
fun main() {

    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true

}
```

因此，Kotlin 警告不要对可装箱的数字和字面量使用引用相等，并显示以下消息：`"Identity equality for arguments of types ... and ... is prohibited."` 当比较 `Int`、`Short`、`Long` 和 `Byte` 类型（以及 `Char` 和 `Boolean`）时，使用结构相等性检查以获得一致的结果。

## 显式数字转换

由于不同的表示形式，数字类型_不是_彼此的子类型。因此，较小的类型_不会_隐式转换为较大的类型，反之亦然。例如，将 `Byte` 类型的值赋给 `Int` 变量需要显式转换：

```kotlin
fun main() {

    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)

}
```

所有数字类型都支持转换为其他类型：

* `toByte(): Byte`（对于 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) 已弃用）
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

在许多情况下，不需要显式转换，因为类型是从上下文中推断出来的，并且算术运算符会重载以自动处理转换。例如：

```kotlin
fun main() {

    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true

}
```

### 反对隐式转换的理由

Kotlin 不支持隐式转换，因为它们可能导致意外的行为。

如果不同类型的数字被隐式转换，我们有时可能会在不知不觉中失去相等性和同一性。例如，假设 `Int` 是 `Long` 的子类型：

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## 数字运算

Kotlin 支持对数字进行标准算术运算：`+`、`-`、`*`、`/`、`%`。它们被声明为相应类的成员：

```kotlin
fun main() {

    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)

}
```

可以在自定义数字类中重写这些运算符。有关详细信息，请参阅 [运算符重载](operator-overloading)。

### 整数除法

整数之间的除法总是返回一个整数。任何小数部分都会被丢弃。

```kotlin
fun main() {

    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true

}
```

对于任意两种整数类型之间的除法都是如此：

```kotlin
fun main() {

    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)
    
    println(x == 2L)
    // true

}
```

要返回带有小数部分的除法结果，请显式地将其中一个参数转换为浮点类型：

```kotlin
fun main() {

    val x = 5 / 2.toDouble()
    println(x == 2.5)

}
```

### 位运算

Kotlin 提供了一组整数的_位运算_。它们直接在二进制级别上对数字表示的位进行运算。位运算由可以以中缀形式调用的函数表示。它们只能应用于 `Int` 和 `Long`：

```kotlin
fun main() {

    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0

}
```

位运算的完整列表：

* `shl(bits)` – 有符号左移
* `shr(bits)` – 有符号右移
* `ushr(bits)` – 无符号右移
* `and(bits)` – 按位 **AND**
* `or(bits)` – 按位 **OR**
* `xor(bits)` – 按位 **XOR**
* `inv()` – 按位取反

### 浮点数比较

本节讨论的浮点数运算包括：

* 相等性检查：`a == b` 和 `a != b`
* 比较运算符：`a < b`、`a > b`、`a <= b`、`a >= b`
* 范围实例化和范围检查：`a..b`、`x in a..b`、`x !in a..b`

当操作数 `a` 和 `b` 静态地已知为 `Float` 或 `Double` 或它们的可空对应项（类型已声明或推断出，或者是 [智能转换](typecasts#smart-casts) 的结果）时，对数字及其形成的范围的运算遵循 [IEEE 754 浮点运算标准](https://en.wikipedia.org/wiki/IEEE_754)。

但是，为了支持通用用例并提供完全排序，对于**未**静态类型化为浮点数的操作数，行为是不同的。例如，`Any`、`Comparable<...>` 或 `Collection<T>` 类型。在这种情况下，这些操作使用 `Float` 和 `Double` 的 `equals` 和 `compareTo` 实现。因此：

* `NaN` 被认为等于自身
* `NaN` 被认为大于任何其他元素，包括 `POSITIVE_INFINITY`
* `-0.0` 被认为小于 `0.0`

以下示例显示了静态类型化为浮点数的操作数 (`Double.NaN`) 与**未**静态类型化为浮点数的操作数 (`listOf(T)`) 之间的行为差异。

```kotlin
fun main() {

    // Operand statically typed as floating-point number
    println(Double.NaN == Double.NaN)                 // false
    
    // Operand NOT statically typed as floating-point number
    // So NaN is equal to itself
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // Operand statically typed as floating-point number
    println(0.0 == -0.0)                              // true
    
    // Operand NOT statically typed as floating-point number
    // So -0.0 is less than 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]

}
```