---
title: "無符號整數類型 (Unsigned integer types)"
---
除了[整數類型](numbers#integer-types)之外，Kotlin 還為無符號整數數字提供以下類型：

| 類型     | 大小 (位元) | 最小值 | 最大值                                       |
|----------|-------------|-----------|-------------------------------------------------|
| `UByte`  | 8           | 0         | 255                                             |
| `UShort` | 16          | 0         | 65,535                                          |
| `UInt`   | 32          | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

無符號類型支援與其帶符號對應類型的大多數操作。

:::note
無符號數字以[inline classes](inline-classes)實現，inline classes具有單個儲存屬性，該屬性包含相同寬度的相應帶符號對應類型。 如果要在無符號和帶符號整數類型之間進行轉換，請確保更新程式碼，以使所有函式呼叫和操作都支援新類型。

:::

## 無符號陣列和範圍

:::caution
無符號陣列及其上的操作處於 [Beta](components-stability) 階段。 它們可以隨時以不相容的方式更改。
需要選擇加入 (opt-in) (請參閱下面的詳細資訊)。

:::

與基本類型一樣，每個無符號類型都有一個對應的類型，用於表示該類型的陣列：

* `UByteArray`: 無符號位元組的陣列。
* `UShortArray`: 無符號 short 的陣列。
* `UIntArray`: 無符號 int 的陣列。
* `ULongArray`: 無符號 long 的陣列。

與帶符號整數陣列相同，它們提供與 `Array` 類別類似的 API，而沒有 boxing 的開銷。

當您使用無符號陣列時，您會收到一條警告，指出此功能尚未穩定。
要移除警告，請使用 `@ExperimentalUnsignedTypes` 註解選擇加入 (opt-in)。
是否需要您的客戶端明確選擇加入 (opt-in) 以使用您的 API 由您決定，但請記住，無符號陣列不是一個穩定的功能，因此使用它們的 API 可能會因語言的變更而損壞。
[了解更多關於選擇加入 (opt-in) 要求的資訊](opt-in-requirements)。

`UInt` 和 `ULong` 的 [範圍和級數 (Ranges and progressions)](ranges) 由類別 `UIntRange`、`UIntProgression`、`ULongRange` 和 `ULongProgression` 支援。 這些類別與無符號整數類型一起是穩定的。

## 無符號整數的字面量 (Literals)

為了使無符號整數更易於使用，您可以將字尾附加到整數字面量 (literal)，以指示特定的無符號類型 (類似於 `F` 用於 `Float` 或 `L` 用於 `Long`)：

* 字母 `u` 和 `U` 表示不指定確切類型的無符號字面量 (literals)。
    如果未提供預期類型，則編譯器會根據字面量 (literal) 的大小使用 `UInt` 或 `ULong`：

    ```kotlin
    val b: UByte = 1u  // UByte，提供了預期類型
    val s: UShort = 1u // UShort，提供了預期類型
    val l: ULong = 1u  // ULong，提供了預期類型
  
    val a1 = 42u // UInt：未提供預期類型，常數適合 UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong：未提供預期類型，常數不適合 UInt
    ```

* `uL` 和 `UL` 明確指定字面量 (literal) 應為無符號 long：

    ```kotlin
    val a = 1UL // ULong，即使未提供預期類型且常數適合 UInt
    ```

## 使用案例 (Use cases)

無符號數字的主要使用案例是利用整數的完整位元範圍來表示正值。
例如，表示不適合帶符號類型的十六進位常數，例如 32 位 `AARRGGBB` 格式的顏色：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

您可以使用無符號數字來初始化位元組陣列，而無需顯式的 `toByte()` 字面量 (literal) 轉換：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一個用例是與本機 API 的互操作性。 Kotlin 允許表示在本機宣告中包含簽名中的無符號類型。 映射不會用帶符號整數替換無符號整數，從而保持語義不變。

### 非目標

雖然無符號整數只能表示正數和零，但在應用程式域需要非負整數的情況下使用它們並不是目標。 例如，作為集合大小或集合索引值的類型。

有幾個原因：

* 使用帶符號整數有助於檢測意外溢位並發出錯誤情況，例如空列表的 [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html) 為 -1。
* 無符號整數不能被視為帶符號整數的範圍限制版本，因為它們的值範圍不是帶符號整數範圍的子集。 帶符號整數和無符號整數都不是彼此的子類型。
  ```