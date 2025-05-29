[//]: # (title: 无符号整数类型)

除了[整数类型](numbers.md#integer-types)之外，Kotlin 还提供了以下无符号整数类型：

| 类型     | 大小（位） | 最小值 | 最大值                                       |
|----------|-------------|-----------|-------------------------------------------------|
| `UByte`  | 8           | 0         | 255                                             |
| `UShort` | 16          | 0         | 65,535                                          |
| `UInt`   | 32          | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

无符号类型支持其有符号对应物的大多数操作。

> 无符号数以[内联类](inline-classes.md)的形式实现，具有一个单一存储属性，该属性包含相同宽度的相应有符号对应类型。如果您想在无符号整数类型和有符号整数类型之间进行转换，请确保更新您的代码，以便任何函数调用和操作都支持新类型。
>
{style="note"}

## 无符号数组和范围

> 无符号数组及其上的操作处于 [Beta](components-stability.md) 阶段。它们可能随时发生不兼容的更改。
> 需要选择启用（详见下文）。
>
{style="warning"}

与基本类型相同，每种无符号类型都有一种对应的类型，用于表示该类型的数组：

* `UByteArray`：无符号字节数组。
* `UShortArray`：无符号短整数数组。
* `UIntArray`：无符号整数数组。
* `ULongArray`：无符号长整数数组。

与有符号整数数组相同，它们提供了类似于 `Array` 类的 API，且无装箱开销。

当您使用无符号数组时，您会收到一个警告，表明此功能尚不稳定。
要移除此警告，请通过 `@ExperimentalUnsignedTypes` 注解选择启用。
由您决定您的客户端是否必须明确选择启用您的 API 的使用，但请记住，无符号数组并非稳定功能，因此使用它们的 API 可能会因语言更改而中断。
[了解更多关于选择启用要求](opt-in-requirements.md)。

[范围和数列](ranges.md)由 `UIntRange`、`UIntProgression`、`ULongRange` 和 `ULongProgression` 类为 `UInt` 和 `ULong` 提供支持。连同无符号整数类型，这些类是稳定的。

## 无符号整数字面值

为了使无符号整数更易于使用，您可以在整数字面值后附加一个后缀，以指示特定的无符号类型（类似于 `F` 用于 `Float` 或 `L` 用于 `Long`）：

* `u` 和 `U` 字母表示无符号字面值，无需指定确切类型。
    如果未提供预期类型，编译器将根据字面值的大小使用 `UInt` 或 `ULong`：

    ```kotlin
    val b: UByte = 1u  // UByte，已提供预期类型
    val s: UShort = 1u // UShort，已提供预期类型
    val l: ULong = 1u  // ULong，已提供预期类型
  
    val a1 = 42u // UInt：未提供预期类型，常量适合 UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong：未提供预期类型，常量不适合 UInt
    ```

* `uL` 和 `UL` 明确指定字面值应为无符号长整数：

    ```kotlin
    val a = 1UL // ULong，即使未提供预期类型且常量适合 UInt
    ```

## 用例

无符号数的主要用例是利用整数的完整位范围来表示正值。
例如，表示不适合有符号类型的十六进制常量，例如 32 位 `AARRGGBB` 格式的颜色：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

您可以使用无符号数来初始化字节数组，而无需显式 `toByte()` 字面值类型转换：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一个用例是与原生 API 的互操作性。Kotlin 允许表示在签名中包含无符号类型的原生声明。这种映射不会用有符号整数替换无符号整数，从而保持语义不变。

### 非目标

尽管无符号整数只能表示正数和零，但当应用程序领域要求非负整数时，不将它们用作目标。例如，作为集合大小或集合索引值类型。

有几个原因：

* 使用有符号整数有助于检测意外溢出并发出错误条件信号，例如 `[List.lastIndex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html)` 对于空列表为 -1。
* 无符号整数不能被视为有符号整数的范围限制版本，因为它们的值范围不是有符号整数范围的子集。有符号整数和无符号整数都不是彼此的子类型。