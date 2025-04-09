---
title: 无符号整型
---
除了[整型](numbers#integer-types)之外，Kotlin 还为无符号整数数字提供了以下类型：

| 类型      | 大小 (位) | 最小值 | 最大值                                            |
|-----------|-----------|--------|--------------------------------------------------|
| `UByte`   | 8         | 0      | 255                                              |
| `UShort`  | 16        | 0      | 65,535                                           |
| `UInt`    | 32        | 0      | 4,294,967,295 (2<sup>32</sup> - 1)               |
| `ULong`   | 64        | 0      | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1)  |

无符号类型支持与其有符号对应类型的大多数操作。

:::note
无符号数是作为[内联类](inline-classes)实现的，该类具有一个包含相同宽度的相应有符号对应类型（signed counterpart type）的单个存储属性。 如果要在无符号和有符号整数类型之间进行转换，请确保更新代码，以使任何函数调用和操作都支持新类型。

:::

## 无符号数组和区间

:::caution
无符号数组及其上的操作处于 [Beta](components-stability) 阶段。 它们可能随时发生不兼容的更改。 需要选择加入（请参见下面的详细信息）。

:::

与基本类型一样，每种无符号类型都有一个对应的类型，表示该类型的数组：

* `UByteArray`: 无符号字节数组。
* `UShortArray`: 无符号短整型数组。
* `UIntArray`: 无符号整型数组。
* `ULongArray`: 无符号长整型数组。

与有符号整型数组一样，它们提供与 `Array` 类类似的 API，而没有装箱开销。

当你使用无符号数组时，你会收到一个警告，表明此功能尚不稳定。
要消除该警告，请使用 `@ExperimentalUnsignedTypes` 注解选择加入。
是否需要你的客户端显式选择加入你的 API 由你决定，但请记住，无符号数组不是一个稳定的功能，因此使用它们的 API 可能会因语言的更改而中断。
[了解更多关于选择加入的要求](opt-in-requirements)。

`UInt` 和 `ULong` 的[区间和数列](ranges)由类 `UIntRange`,`UIntProgression`、 `ULongRange` 和 `ULongProgression` 支持。 连同无符号整数类型一起，这些类是稳定的。

## 无符号整数的字面值

为了更容易地使用无符号整数，你可以在整数的字面值后附加一个后缀，指示特定的无符号类型（类似于 `Float` 的 `F` 或 `Long` 的 `L`）：

* 字母 `u` 和 `U` 表示无符号字面值，而不指定确切的类型。
    如果没有提供预期的类型，编译器将根据字面值的大小使用 `UInt` 或 `ULong`：

    ```kotlin
    val b: UByte = 1u  // UByte，提供了预期的类型
    val s: UShort = 1u // UShort，提供了预期的类型
    val l: ULong = 1u  // ULong，提供了预期的类型
  
    val a1 = 42u // UInt：没有提供预期的类型，常量适合 UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong：没有提供预期的类型，常量不适合 UInt
    ```

* `uL` 和 `UL` 明确指定字面值应为无符号长整型：

    ```kotlin
    val a = 1UL // ULong，即使没有提供预期的类型并且常量适合 UInt
    ```

## 使用场景

无符号数的主要用例是利用整数的完整位范围来表示正值。
例如，表示不适合有符号类型的十六进制常量，例如 32 位 `AARRGGBB` 格式的颜色：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

你可以使用无符号数来初始化字节数组，而无需显式 `toByte()` 字面值转换：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一个用例是与 Native API 的互操作性。 Kotlin 允许表示签名中包含无符号类型的 Native 声明。 映射不会用有符号整数替换无符号整数，从而保持语义不变。

### 非目标

虽然无符号整数只能表示正数和零，但在应用程序域需要非负整数的地方使用它们不是目标。 例如，作为集合大小或集合索引值的类型。

原因有几个：

* 使用有符号整数可以帮助检测意外的溢出并发出错误情况信号，例如空列表的 [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html) 为 -1。
* 无符号整数不能被视为有符号整数的范围限制版本，因为它们的值范围不是有符号整数范围的子集。 有符号整数和无符号整数都不是彼此的子类型。
  ```