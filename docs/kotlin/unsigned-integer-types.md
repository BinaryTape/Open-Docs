[//]: # (title: 无符号整型)

除了[整型](numbers.md#integer-types)之外，Kotlin 还为无符号整数提供了以下类型：

| 类型 | 大小 (位) | 最小值 | 最大值 |
|----------|-------------|-----------|-------------------------------------------------|
| `UByte`  | 8           | 0         | 255                                             |
| `UShort` | 16          | 0         | 65,535                                          |
| `UInt`   | 32          | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

无符号类型支持其对应有符号类型的大多数操作。

> 无符号数作为[内联类](inline-classes.md)实现，其中包含一个存储属性，该属性中包含宽度相同的对应有符号类型。如果您想在无符号和有符号整型之间进行转换，请确保更新您的代码，以使所有函数调用和操作都支持新类型。
>
{style="note"}

## 无符号数组和区间

> 无符号数组及其相关操作处于 [Beta](components-stability.md) 阶段。它们可能随时发生不兼容的变更。需要启用（详见下文）。
>
{style="warning"}

与原生类型相同，每个无符号类型都有一个表示该类型数组的对应类型：

* `UByteArray`：无符号 byte 数组。
* `UShortArray`：无符号 short 数组。
* `UIntArray`：无符号 int 数组。
* `ULongArray`：无符号 long 数组。

与有符号整型数组一样，它们提供了与 `Array` 类相似的 API，且没有装箱开销。

当您使用无符号数组时，会收到一条警告，提示该功能尚未稳定。要消除该警告，请使用 `@ExperimentalUnsignedTypes` 注解进行启用。您可以自行决定是否要求客户端显式启用您的 API，但请记住，无符号数组不是稳定功能，因此使用它们的 API 可能会因语言的变更而损坏。
[详细了解启用要求](opt-in-requirements.md)。

`UInt` 和 `ULong` 通过类 `UIntRange`、`UIntProgression`、`ULongRange` 和 `ULongProgression` 支持[区间和数列](ranges.md)。这些类与无符号整型一起都是稳定的。

## 无符号整型文字

为了使无符号整数更易于使用，您可以在整型文字后添加后缀，以指示特定的无符号类型（类似于 `Float` 的 `F` 或 `Long` 的 `L`）：

* `u` 和 `U` 字母表示无符号文字，无需指定确切类型。如果没有提供预期类型，编译器将根据文字的大小使用 `UInt` 或 `ULong`：

    ```kotlin
    val b: UByte = 1u  // UByte，提供了预期类型
    val s: UShort = 1u // UShort，提供了预期类型
    val l: ULong = 1u  // ULong，提供了预期类型
  
    val a1 = 42u // UInt：未提供预期类型，常量适合 UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong：未提供预期类型，常量不适合 UInt
    ```

* `uL` 和 `UL` 显式指定文字应为无符号 long：

    ```kotlin
    val a = 1UL // ULong，即使未提供预期类型且常量适合 UInt
    ```

## 用例

无符号数的主要用例是利用整数的完整位范围来表示正值。例如，表示不适合有符号类型的十六进制常量，如 32 位 `AARRGGBB` 格式的颜色：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

您可以使用无符号数初始化 byte 数组，而无需进行显式的 `toByte()` 文字转换：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一个用例是与原生 API 的互操作性。Kotlin 允许表示签名中包含无符号类型的原生声明。映射不会将无符号整数替换为有符号整数，从而保持语义不变。

### 非目标

虽然无符号整数只能表示正数和零，但其目标并非是在应用领域需要非负整数时使用它们。例如，作为集合大小或集合索引值的类型。

原因有以下几点：

* 使用有符号整数可以帮助检测意外的溢出并发出错误条件信号，例如对于空列表，[`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html) 为 -1。
* 无符号整数不能被视为有符号整数的范围限制版本，因为它们的值范围并不是有符号整数范围的子集。有符号整数和无符号整数互不为子类型。