[//]: # (title: 数字)

## 整数类型

Kotlin 提供了一组代表数字的内置类型。
对于整数，有四种具有不同大小和值范围的类型：

| 类型 | 大小（位） | 最小值 | 最大值 |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte` | 8 | -128 | 127 |
| `Short` | 16 | -32768 | 32767 |
| `Int` | 32 | -2,147,483,648 (-2<sup>31</sup>) | 2,147,483,647 (2<sup>31</sup> - 1) |
| `Long` | 64 | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 除了有符号整数类型外，Kotlin 还提供无符号整数类型。
> 由于无符号整数针对的是另一类用例，因此会单独介绍。
> 参见 [](unsigned-integer-types.md)。
> 
{style="tip"}

在不指定显式类型的情况下初始化变量时，编译器会自动从 `Int` 开始推断出足以表示该值的最小范围类型。如果没有超过 `Int` 的范围，则类型为 `Int`。如果超过了该范围，则类型为 `Long`。要显式指定 `Long` 值，请在值后添加 `L` 后缀。要使用 `Byte` 或 `Short` 类型，请在声明中显式指定。
显式类型指定会触发编译器检查该值是否超过了指定类型的范围。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮点类型

对于实数，Kotlin 提供了符合 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754)的浮点类型 `Float` 和 `Double`。
`Float` 反映了 IEEE 754 *单精度*，而 `Double` 反映了*双精度*。

这些类型的大小不同，并为具有不同精度的浮点数提供存储：

| 类型 | 大小（位） | 有效位数 | 指数位数 | 十进制位数 |
|----------|-------------|------------------|---------------|----------------|
| `Float` | 32 | 24 | 8 | 6-7 |
| `Double` | 64 | 53 | 11 | 15-16 |    

只能使用带有小数部分的数字来初始化 `Double` 和 `Float` 变量。
使用句点（`.`）将小数部分与整数部分分隔开。

对于使用小数初始化的变量，编译器会推断为 `Double` 类型：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // 推断为 Int
// Initializer type mismatch（初始值设定项类型不匹配）

val oneDouble = 1.0    // Double
```
{validate="false"}

要为某个值显式指定 `Float` 类型，请添加 `f` 或 `F` 后缀。
如果以这种方式提供的值包含超过 7 位十进制数字，它将被舍入：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float，实际值为 2.7182817
```

与其他一些语言不同，Kotlin 中的数字没有隐式的拓宽转换。
例如，具有 `Double` 形参的函数只能对 `Double` 值调用，而不能对 `Float`、`Int` 或其他数值调用：

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch（实参类型不匹配）
    
    printDouble(xFloat)
    // Argument type mismatch（实参类型不匹配）
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

要将数值转换为不同的类型，请使用[显式转换](#explicit-number-conversions)。

## 数字字面量常量

整数值有以下几种字面量常量：

* 十进制：`123`
* Long 类型，以大写字母 `L` 结尾：`123L`
* 十六进制：`0x0F`
* 二进制：`0b00001011`

> Kotlin 不支持八进制字面量。
>
{style="note"}

Kotlin 还支持浮点数的常规表示法：

* Double 类型（默认，当小数部分不以字母结尾时）：`123.5`、`123.5e10`
* Float 类型，以字母 `f` 或 `F` 结尾：`123.5f`

你可以使用下划线使数字常量更具可读性：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 无符号整数字面量也有特殊的后缀。
> 详细了解[无符号整数类型的字面量](unsigned-integer-types.md)。
> 
{style="tip"}

## Java 虚拟机上的数字装箱与缓存

由于默认情况下对较小（Byte 大小）的数字使用缓存，JVM 存储数字的方式可能会导致代码的行为违反直觉。

JVM 将数字存储为基本类型：`int`、`double` 等。
当你使用[泛型](generics.md)或创建可空数字引用（如 `Int?`）时，数字会被装箱到 Java 类（如 `Integer` 或 `Double`）中。

JVM 对代表 `-128` 到 `127` 之间数字的 `Integer` 和其他对象应用了[内存优化技术](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)。
指向此类对象的所有可空引用都引用同一个缓存对象。
例如，以下代码中的可空对象是[引用相等](equality.md#referential-equality)的：

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

对于此范围之外的数字，可空对象是不同的，但[结构相等](equality.md#structural-equality)：

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

因此，Kotlin 会警告对可装箱数字和字面量使用引用相等比较，并显示以下消息：`"Identity equality for arguments of types ... and ... is prohibited."`（禁止对 ... 和 ... 类型参数进行身份相等性比较）。
在比较 `Int`、`Short`、`Long` 和 `Byte` 类型（以及 `Char` 和 `Boolean`）时，请使用结构相等检查以获得一致的结果。

## 显式数字转换

由于表示方式不同，数字类型**不**是彼此的子类型。
因此，较小的类型**不会**隐式转换为较大的类型，反之亦然。
例如，将 `Byte` 类型的值赋值给 `Int` 变量需要显式转换：

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // 成功，字面量会进行静态检查
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch（初始值设定项类型不匹配）
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

所有数字类型都支持转换为其他类型：

* `toByte(): Byte`（针对 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) 已弃用）
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

在许多情况下，不需要显式转换，因为类型会从上下文中推断出来，并且算术运算符经过重载，可以自动处理转换。例如：

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 反对隐式转换的原因

Kotlin 不支持隐式转换，因为它们可能导致意外行为。

如果不同类型的数字可以隐式转换，我们有时会在无意中失去相等性和身份一致性。
例如，假设 `Int` 是 `Long` 的子类型：

```kotlin
// 假设的代码，实际上无法编译：
val a: Int? = 1    // 一个装箱的 Int (java.lang.Integer)
val b: Long? = a   // 隐式转换产生一个装箱的 Long (java.lang.Long)
print(b == a)      // 打印 "false"，因为 Long.equals() 不仅检查值，还检查另一个数字是否也是 Long
```

## 数字操作

Kotlin 支持对数字的标准算术操作集：`+`、`-`、`*`、`/`、`%`。它们被声明为相应类的成员：

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

你可以在自定义数字类中重写这些运算符。
详情请参阅[运算符重载](operator-overloading.md)。

### 整数除法

整数之间的除法始终返回整数。任何小数部分都会被丢弃。

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // 运算符 '==' 不能应用于 'Int' 和 'Double'
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

对于任何两个整数类型之间的除法都是如此：

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // 错误，因为 Long (x) 无法与 Int (2) 进行比较
    
    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

要返回带有小数部分的除法结果，请显式将其中一个实参转换为浮点类型：

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 按位操作

Kotlin 提供了一组对整数执行的*按位操作*。它们直接在数字表示的二进制位级别上运行。
按位操作由可以通过中缀形式调用的函数表示。它们只能应用于 `Int` 和 `Long`：

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

完整的按位操作列表：

* `shl(bits)` – 有符号左移
* `shr(bits)` – 有符号右移
* `ushr(bits)` – 无符号右移
* `and(bits)` – 按位**与 (AND)**
* `or(bits)` – 按位**或 (OR)**
* `xor(bits)` – 按位**异或 (XOR)**
* `inv()` – 按位取反

### 浮点数比较

本节讨论的浮点数操作包括：

* 相等性检查：`a == b` 和 `a != b`
* 比较运算符：`a < b`、`a > b`、`a <= b`、`a >= b`
* 区间实例化和区间检查：`a..b`、`x in a..b`、`x !in a..b`

当操作数 `a` 和 `b` 静态已知为 `Float` 或 `Double` 或它们的可空对应物（类型已声明、被推断或者是[智能转换](typecasts.md#smart-casts)的结果）时，对数字及其形成的区间的操作遵循 [IEEE 754 浮点算术标准](https://en.wikipedia.org/wiki/IEEE_754)。

然而，为了支持泛型用例并提供全序，对于**不**静态类型为浮点数的运算数，其行为会有所不同。例如 `Any`、`Comparable<...>` 或 `Collection<T>` 类型。在这种情况下，操作会使用 `Float` 和 `Double` 的 `equals` 和 `compareTo` 实现。其结果如下：

* `NaN` 被认为等于其自身
* `NaN` 被认为大于包括 `POSITIVE_INFINITY` 在内的任何其他元素
* `-0.0` 被认为小于 `0.0`

下面是一个示例，展示了静态类型为浮点数的操作数 (`Double.NaN`) 与**非**静态类型为浮点数的操作数 (`listOf(T)`) 之间的行为差异。

```kotlin
fun main() {
    //sampleStart
    // 静态类型为浮点数的操作数
    println(Double.NaN == Double.NaN)                 // false
    
    // 非静态类型为浮点数的操作数
    // 因此 NaN 等于其自身
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // 静态类型为浮点数的操作数
    println(0.0 == -0.0)                              // true
    
    // 非静态类型为浮点数的操作数
    // 因此 -0.0 小于 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}