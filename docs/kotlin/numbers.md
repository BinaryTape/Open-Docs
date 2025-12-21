[//]: # (title: 数字)

## 整数类型

Kotlin 提供了一组内置类型来表示数字。
对于整数，有四种不同大小和值区间的类型：

| 类型       | 大小 (位) | 最小值                                     | 最大值                                       |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`     | 8           | -128                                         | 127                                            |
| `Short`    | 16          | -32768                                       | 32767                                          |
| `Int`      | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`     | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 除了有符号整数类型之外，Kotlin 还提供了无符号整数类型。
> 由于无符号整数面向一组不同的用例，因此它们将在单独的部分中介绍。
> 关于无符号整数类型，请参见 [](unsigned-integer-types.md)。
>
{style="tip"}

当你初始化一个变量时，如果没有显式类型指定，编译器会自动推断出从 `Int` 开始足以表示该值的最小区间类型。如果该值未超出 `Int` 的区间，则类型为 `Int`。如果超出该区间，则类型为 `Long`。要显式指定 `Long` 值，请在值后面附加后缀 `L`。要使用 `Byte` 或 `Short` 类型，请在声明中显式指定。显式类型指定会触发编译器检测值是否超出了指定类型的区间。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮点类型

对于实数，Kotlin 提供了浮点类型 `Float` 和 `Double`，它们符合 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754)。`Float` 反映了 IEEE 754 的 _单精度_，而 `Double` 则反映了 _双精度_。

这些类型在大小上有所不同，并为不同精度的浮点数提供存储：

| 类型       | 大小 (位) | 有效位 | 指数位 | 十进制位数 |
|----------|-------------|------------------|---------------|----------------|
| `Float`    | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |

你只能用带小数部分的数字来初始化 `Double` 和 `Float` 变量。用句点（`.`）将小数部分与整数部分分隔开。

对于用小数初始化的变量，编译器会推断为 `Double` 类型：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

要为值显式指定 `Float` 类型，请添加后缀 `f` 或 `F`。如果以这种方式提供的值包含超过 7 位小数，则会被四舍五入：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

与某些其他语言不同，Kotlin 中没有数字的隐式加宽转换。例如，带有 `Double` 形参的函数只能对 `Double` 值调用，而不能对 `Float`、`Int` 或其他数值类型调用：

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

要将数值转换为不同类型，请使用[显式数字转换](#explicit-number-conversions)。

## 数字字面值常量

整数值有几种字面值常量：

*   十进制：`123`
*   长整型，以大写 `L` 结尾：`123L`
*   十六进制：`0x0F`
*   二进制：`0b00001011`

> Kotlin 不支持八进制字面值。
>
{style="note"}

Kotlin 还支持浮点数的常规表示法：

*   双精度浮点型（当小数部分不以字母结尾时的默认值）：`123.5`、`123.5e10`
*   单精度浮点型，以字母 `f` 或 `F` 结尾：`123.5f`

你可以使用下划线使数字常量更具可读性：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 无符号整数字面值也有特殊的后缀。
> 关于[无符号整数类型的字面值](unsigned-integer-types.md)的更多信息，请参阅该文档。
>
{style="tip"}

## Java 虚拟机上的数字装箱和缓存

JVM 存储数字的方式可能会让你的代码行为反直觉，因为 JVM 默认会对小（字节大小）数字使用缓存。

JVM 将数字存储为原生类型：`int`、`double` 等。当你使用[泛型](generics.md)或创建可空的数字引用（例如 `Int?`）时，数字会被装箱到 Java 类中，例如 `Integer` 或 `Double`。

JVM 对表示 `−128` 到 `127` 之间数字的 `Integer` 及其他对象应用了[内存优化技术](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)。所有对此类对象的可空引用都指向相同的缓存对象。例如，以下代码中的可空对象是[引用相等的](equality.md#referential-equality)：

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于超出此区间的数字，可空对象是不同的，但却是[结构相等的](equality.md#structural-equality)：

```kotlin
fun main() {
//sampleStart
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

因此，Kotlin 会在使用可装箱数字和字面值进行引用相等性比较时发出警告，并显示以下消息：“`Identity equality for arguments of types ... and ... is prohibited.`”在比较 `Int`、`Short`、`Long` 和 `Byte` 类型（以及 `Char` 和 `Boolean`）时，请使用结构相等性检测来获得一致的结果。

## 显式数字转换

由于表示方式不同，数字类型_不是彼此的子类型_。因此，较小类型_不会_隐式转换为较大类型，反之亦然。例如，将 `Byte` 类型的值赋值给 `Int` 变量需要显式转换：

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

所有数字类型都支持转换为其他类型：

*   `toByte(): Byte` （对于 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) 已弃用）
*   `toShort(): Short`
*   `toInt(): Int`
*   `toLong(): Long`
*   `toFloat(): Float`
*   `toDouble(): Double`

在许多情况下，不需要显式转换，因为类型是从上下文中推断出来的，并且算术操作符已重载以自动处理转换。例如：

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 反对隐式转换的理由

Kotlin 不支持隐式转换，因为它们可能导致意外行为。

如果不同类型的数字被隐式转换，我们有时可能会悄无声息地失去相等性和标识。例如，设想如果 `Int` 是 `Long` 的子类型：

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## 数字上的操作

Kotlin 支持对数字进行标准算术操作：`+`、`-`、`*`、`/`、`%`。它们被声明为相应类的成员：

```kotlin
fun main() {
//sampleStart
    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你可以在自定义数字类中覆盖这些操作符。关于详细信息，请参见[操作符重载](operator-overloading.md)。

### 整数除法

整数之间的除法总是返回一个整数。任何小数部分都会被丢弃。

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

这对于任意两个整数类型之间的除法都适用：

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)
    
    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

要返回带有小数部分的除法结果，请将其中一个实参显式转换为浮点类型：

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 位操作

Kotlin 提供了一组整数上的_位操作_。它们直接在二进制级别上操作数字表示的位。位操作通过可以中缀形式调用的函数来表示。它们只能应用于 `Int` 和 `Long`：

```kotlin
fun main() {
//sampleStart
    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

完整的位操作列表：

*   `shl(bits)` – 有符号左移
*   `shr(bits)` – 有符号右移
*   `ushr(bits)` – 无符号右移
*   `and(bits)` – 按位 **与**
*   `or(bits)` – 按位 **或**
*   `xor(bits)` – 按位 **异或**
*   `inv()` – 按位反转

### 浮点数比较

本节讨论的浮点数操作有：

*   相等性检测：`a == b` 和 `a != b`
*   比较操作符：`a < b`、`a > b`、`a <= b`、`a >= b`
*   区间实例化和区间检测：`a..b`、`x in a..b`、`x !in a..b`

当操作数 `a` 和 `b` 被静态地知晓为 `Float` 或 `Double` 或它们的可空对应物（类型已声明或推断，或为[智能转换](typecasts.md#smart-casts)的结果）时，对数字的操作以及它们形成的区间遵循 [IEEE 754 浮点运算标准](https://en.wikipedia.org/wiki/IEEE_754)。

然而，为了支持泛型用例并提供全序，对于**未**被静态类型化为浮点数的操作数，行为会有所不同。例如，`Any`、`Comparable<...>` 或 `Collection<T>` 类型。在这种情况下，操作会使用 `Float` 和 `Double` 的 `equals` 和 `compareTo` 实现。结果是：

*   `NaN` 被认为是与自身相等的
*   `NaN` 被认为大于任何其他元素，包括 `POSITIVE_INFINITY`
*   `-0.0` 被认为小于 `0.0`

以下示例显示了静态类型为浮点数的操作数（`Double.NaN`）与**未**静态类型化为浮点数的操作数（`listOf(T)`）之间的行为差异。

```kotlin
fun main() {
    //sampleStart
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
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}