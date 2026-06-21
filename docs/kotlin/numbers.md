[//]: # (title: 数字)
[//]: # (description: 了解如何在 Kotlin 中使用数字，包括数值类型、字面量、转换、算术操作、数据溢出以及 JVM 特定行为。)

Kotlin 的数字类型表示：
* 整数值（[Byte](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-byte/)、
  [Short](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-short/)、
  [Int](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-int/)
  和 [Long](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-long/)）
* 浮点值（[Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/)
  和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/)）

使用数字类型来存储和处理数值数据，例如在算术、计数器、测量和其他计算中。

## 选择数字类型

在大多数情况下，你可以参考以下规则来为你的任务确定正确的数字类型：

* 使用 `Int` 表示整数。
* 使用 `Long` 表示超出 `Int` 范围的整数。
* 使用 `Double` 表示十进制数字。
* 当可以接受或需要较低精度时，使用 `Float`。
* 当 API 或数据格式有要求时，使用 `Byte` 和 `Short`。

> Kotlin 还提供 [](unsigned-integer-types.md) 作为 Beta 功能。 
>
{style="tip"}

## 整数类型

Kotlin 提供了四种具有不同大小和值范围的整数类型：

| 类型	    | 大小（位） | 最小值                                    | 最大值                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

### 声明整数值

Kotlin 支持以下整数值的字面量形式：

* 十进制：`123`
* 十六进制：`0x0F`
* 二进制：`0b00001011`

> Kotlin 不支持八进制字面量。
>
{style="note"}

要声明数值，请显式指定类型： 

```kotlin
val one: Int = 1

// 使用下划线提高可读性
val oneBillion: Long = 1_000_000_000
val hexBytes: Int = 0x7F_EC_DE_5E
val bytes: Int = 0b01010010_01101001_10010100_10010010

val oneByte: Byte = 1
val oneShort: Short = 1
```

你也可以添加 `L` 后缀来声明 `Long` 值：

```kotlin
val oneLong = 1L
```

当你显式声明数值类型时，编译器会检查该值是否符合该类型的范围：

```kotlin
// 值符合 Byte 范围
val oneByte: Byte = 1

// 错误：该值不符合 Byte 范围
val tooBig: Byte = 128
```

当你未指定数值类型时，如果该值符合 `Int` 范围，Kotlin 会推断为 `Int`。否则，Kotlin 会推断为 `Long`：

```kotlin
val million = 1_000_000 // Int
val threeBillion = 3_000_000_000 // Long
```

如果某个值可能缺失，请使用可空类型：

```kotlin
val maybeAbsent: Int? = null
```

## 浮点类型

对于带有小数部分的数字，Kotlin 提供了 `Float` 和 `Double`。

浮点类型遵循 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754)。
`Float` 反映了*单精度*。`Double` 反映了*双精度*。

这些浮点类型的大小和精度不同：

| 类型	    | 大小（位） | 有效位数 | 指数位数 | 十进制位数 |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    

### 声明浮点值

要声明浮点字面量，请包含小数点 (`.`) 或使用指数表示法：

```kotlin
val pi = 3.14
val avogadro = 6.02214076e23
```

默认情况下，Kotlin 将浮点字面量推断为 `Double`。 
要声明 `Float`，请添加 `f` 或 `F` 后缀：

```kotlin
val pi = 3.14 // Double
val eFloat = 2.7182817f // Float
```

> Kotlin 会对包含超过 `Float` 所能存储精度的 `Float` 字面量进行舍入。
>
{style="note"}

如果某个值可能缺失，请使用可空类型：

```kotlin
val maybeAbsent: Double? = null
```

## 算术操作

Kotlin 支持对数字的标准算术操作：`+`、`-`、`*`、`/` 和 `%`。

使用这些运算符执行常用计算：

```kotlin
fun main() {
//sampleStart
    println(1 + 2) // 3
    println(2_500_000_000L - 1L) // 2499999999
    println(3.14 * 2.71) // 8.5094
    println(10.0 / 3) // 3.3333333333333335
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

结果类型取决于操作数的类型。详细了解请参阅 [](#mixed-numeric-expressions)。

> 你可以在自定义数字类中重写这些运算符。
> 有关更多信息，请参阅[运算符重载](operator-overloading.md)。
>
{style="tip"}

### 整数除法

整数值之间的除法始终返回整数结果。编译器会丢弃小数部分：

```kotlin
fun main() {
//sampleStart
    val intValue = 5 / 2
    println(intValue) // 2
    
    val longValue = 5L / 2
    println(longValue) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要返回浮点结果，请使至少一个操作数为 `Float` 或 `Double`：

```kotlin
fun main() {
//sampleStart
    val a = 5 / 2.0
    println(a) // 2.5
    
    val b = 5 / 2.toDouble()
    println(b) // 2.5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 类型转换

数值类型不是彼此的子类型。Kotlin 要求进行显式转换，以避免静默数据丢失和意外行为。

例如，一个期望 `Double` 的函数不能在不转换的情况下接受 `Int` 或 `Float` 值：

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { 
        print(x) 
    }

    val x = 1.0
    val xInt = 1
    val xFloat = 1.0f
    val one: Double = 1 // 错误：初始值设定项类型不匹配

    printDouble(x) // 成功
    printDouble(xInt) // 错误：实参类型不匹配
    printDouble(xFloat) // 错误：实参类型不匹配
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

所有数字类型都支持转换为其他数字类型。
要将数字转换为另一种类型，请使用显式转换函数：

* `toByte()`
* `toShort()`
* `toInt()`
* `toLong()`
* `toFloat()`
* `toDouble()`

例如，以下代码将 `Int` 值转换为 `Double`：

```kotlin
fun main() {
//sampleStart
    val intValue: Int = 1
    val doubleValue = intValue.toDouble()
    
    println(doubleValue) // 1.0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

当你将浮点值转换为整数类型时，编译器会丢弃小数部分：

```kotlin
fun main() {
//sampleStart
    val d: Double = 1.5
    val l: Long = d.toLong()
    
    println(l) // 1
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 混合数值表达式

Kotlin 不支持赋值或函数实参的隐式转换。 
但是，你可以在算术表达式中组合不同的数字类型。在这种情况下， 
Kotlin 会根据操作数类型确定结果类型， 
且算术运算符会自动处理转换：

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result = intNumber + longNumber // 1001, Long
```

如果你尝试将结果赋值给较小的类型，编译器会报错：

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result: Int = intNumber + longNumber 
// 错误：初始值设定项类型不匹配
```

### 整数字面量类型

在类型推断期间，Kotlin 将不带后缀的整数字面量视为特殊的[整数字面量类型 (ILT)](https://kotlinlang.org/spec/type-system.html#integer-literal-types)，直到周围的上下文确定具体类型：

```kotlin
//sampleStart
fun List<Any>.log() {
    println(joinToString(" | ") { it::class.simpleName ?: "Unknown" })
}

fun main() {
    listOf(1, 2).log()
    // Int | Int
    
    listOf(1L, 2L).log()
    // Long | Long
    
    // 编译器将 1 解释为 ILT 并将其解析为 Long
    listOf(1, 2L).log()
    // Long | Long
    
    // .toInt() 将字面量转换为 Int
    listOf(1.toInt(), 2L).log()
    // Int | Long
}
//sampleEnd
```
{kotlin-runnable="true"}

对于 `Int` 和 `Long` 值，这种情况特别容易被忽视，因为它们在运行时具有相同的字符串表示。为了避免这种情况，请指定预期类型或显式转换值：

```kotlin
//sampleStart
fun List<Any>.log() {
    println(joinToString(" | ") { it::class.simpleName ?: "Unknown" })
}

fun main() {
    val longValues: List<Long> = listOf(1, 2L)
    longValues.log()
    // Long | Long

    val numberValues: List<Number> = listOf(1.toInt(), 2L)
    numberValues.log()
    // Int | Long
}
//sampleEnd
```
{kotlin-runnable="true"}

你还可以使用显式类型来捕捉意外的类型推断：

```kotlin
fun main() {
//sampleStart
    val intValues: List<Int> = listOf(1, 2L)
    // 错误：初始值设定项类型不匹配
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

> 详细了解 [整数字面量类型](https://kotlinlang.org/spec/type-system.html#integer-literal-types)。
> 
{style="tip"}

## 数据溢出

数字类型只能表示其定义范围内的值。

如果操作结果超出该范围，则会发生溢出。 
如果你将一个值转换为较小的数字类型，转换后的值可能无法保留 
原始数值。

即使编译器接受了这种行为，它也可能影响你的代码结果。

### 操作中的溢出

每种整数类型只能存储其定义范围内的值。当算术操作的结果超过该范围时， 
会发生*数据溢出*：

```kotlin
fun main(){
//sampleStart
    val intNumber: Int = 2147483647
    // Int 的最大值是 2147483647
    println(intNumber + 1) // -2147483648
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在这里，结果发生了回绕，因为该值不再能容纳在 `Int` 中。

> 发生整数溢出时，编译器不会自动报错。
>
{style="note"}

### 取负中的溢出

在取负期间也可能发生溢出。 
例如，你无法将 `Int.MIN_VALUE` 的正数对应值表示为 `Int`。

```kotlin
fun main(){
//sampleStart
    val min = Int.MIN_VALUE
    println(-min) // -2147483648
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 缩窄转换

当你将一个值转换为较小的整数类型时， 
结果可能无法保留原始数值：

```kotlin
fun main() {
//sampleStart
    val large: Int = 130
    val narrowed: Byte = large.toByte()

    println(narrowed) // -126
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

然而，由于浮点类型遵循 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754)，非常大的结果可能会变成 `Infinity`（无穷大）：

```kotlin
fun main() {
//sampleStart
    println(Double.MAX_VALUE * 2) // Infinity
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 按位操作

Kotlin 为 `Int` 和 `Long` 提供了*按位操作*。这些操作由一组[中缀函数](functions.md#infix-notation)和 `inv()` 表示。

```kotlin
fun main() {
//sampleStart
    val x = 1
    
    println(x shl 2) // 4
    println(x and 0x000FF000) // 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

按位操作包括：

* `shl()` – 有符号左移
* `shr()` – 有符号右移
* `ushr()` – 无符号右移
* `and()` – 按位**与**
* `or()` – 按位**或**
* `xor()` – 按位**异或**
* `inv()` – 按位取反

## 浮点数比较

在 Kotlin 中，浮点数比较取决于操作数的静态类型。

当操作数被静态已知为 `Float` 或 `Double` 时， 
对数字及其形成的区间的操作 
遵循 [IEEE 754 浮点算术标准](https://en.wikipedia.org/wiki/IEEE_754)。

然而，在泛型用例中（例如 `Any`、`Comparable<...>` 或 `Collection<T>`），对于非静态类型为浮点数的操作数，其行为会有所不同。在这些情况下，Kotlin 使用 `Float` 和 `Double` 的 `equals()` 和 `compareTo()` 实现。 

因此：

* `NaN` 被认为等于其自身
* `NaN` 被认为大于包括 `POSITIVE_INFINITY` 在内的任何其他元素
* `-0.0` 被认为小于 `0.0`

以下示例显示了静态类型为浮点数的操作数与通过泛型类型使用的操作数之间的区别：

```kotlin
//sampleStart  
fun generalizedEquals(a: Any, b: Any): Boolean {
    return a == b
}

fun main() {
    // 静态类型为浮点数的操作数
    println(Double.NaN == Double.NaN) // false
    println(0.0 == -0.0) // true

    // 通过非浮点静态类型使用的操作数
    println(generalizedEquals(Double.NaN, Double.NaN)) // true
    println(generalizedEquals(0.0, -0.0)) // false
}
//sampleEnd  
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}

## JVM 上的数字装箱与缓存

在 JVM 上，不可空数值通常使用基本类型存储，例如 `int`、`long` 或 `double`。 
然而，当你使用[泛型](generics.md)或像 `Int?` 这样的可空数值类型时，该值会被装箱并表示为一个对象。

JVM 通过缓存小数字的装箱表示形式来应用[内存优化技术](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)。因此，具有相同值的装箱数字可以是[引用相等](equality.md#referential-equality)的。

例如，JVM 缓存了 `-128` 到 `127` 范围内的装箱 `Integer` 值。因此，以下代码返回 `true`：

```kotlin
fun main() {
//sampleStart
    val score: Int = 100
    val savedScore: Int? = score
    val displayedScore: Int? = score
    
    println(savedScore === displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

对于缓存范围之外的值，装箱值是独立的对象。在这种情况下，即使它们的值是[结构相等](equality.md#structural-equality)的，它们也不是引用相等的。出于这个原因，请使用 `==` 来比较数值：

```kotlin
fun main() {
//sampleStart
    val score: Int = 10000
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore) // false
    println(savedScore == displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}