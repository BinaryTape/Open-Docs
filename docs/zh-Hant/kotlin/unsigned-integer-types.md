[//]: # (title: 無符號整數類型)

除了 [整數類型](numbers.md#integer-types) 之外，Kotlin 還提供了以下類型來表示無符號整數：

| 類型     | 大小 (位元) | 最小值 | 最大值                                          |
|----------|-------------|---------|-------------------------------------------------|
| `UByte`  | 8           | 0       | 255                                             |
| `UShort` | 16          | 0       | 65,535                                          |
| `UInt`   | 32          | 0       | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0       | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

無符號類型支援其有符號對應類型的大部分操作。

> 無符號數字作為 [內聯類別 (inline classes)](inline-classes.md) 實現，其中包含一個單一儲存屬性，該屬性包含相同寬度的對應有符號對應類型。如果您想在無符號和有符號整數類型之間轉換，請確保更新您的程式碼，以便任何函數呼叫和操作都支援新類型。
>
{style="note"}

## 無符號陣列與範圍

> 無符號陣列及其操作處於 [Beta 階段](components-stability.md)。它們可能隨時發生不相容的變更。需要明確啟用 (opt-in)（詳情請見下文）。
>
{style="warning"}

與基本類型一樣，每個無符號類型都有一個對應的類型，用於表示該類型的陣列：

*   `UByteArray`: 無符號位元組陣列。
*   `UShortArray`: 無符號短整數陣列。
*   `UIntArray`: 無符號整數陣列。
*   `ULongArray`: 無符號長整數陣列。

與有符號整數陣列一樣，它們提供與 `Array` 類別相似的 API，且沒有裝箱 (boxing) 開銷。

當您使用無符號陣列時，會收到一個警告，表明此功能尚不穩定。要消除警告，請使用 `@ExperimentalUnsignedTypes` 註解選擇啟用 (opt-in)。您可以自行決定您的客戶是否必須明確選擇啟用您的 API 的使用，但請記住，無符號陣列不是穩定功能，因此使用它們的 API 可能會因語言變更而中斷。[了解更多關於選擇啟用要求](opt-in-requirements.md)。

[範圍和進程 (Ranges and progressions)](ranges.md) 透過 `UIntRange`、`UIntProgression`、`ULongRange` 和 `ULongProgression` 類別支援 `UInt` 和 `ULong`。這些類別與無符號整數類型一起是穩定的。

## 無符號整數常數

為了使無符號整數更容易使用，您可以將一個字尾附加到整數常數上，以指示特定的無符號類型（類似於 `F` 用於 `Float` 或 `L` 用於 `Long`）：

*   `u` 和 `U` 字母表示無符號常數，而無需指定確切類型。如果未提供預期類型，編譯器會根據常數的大小使用 `UInt` 或 `ULong`：

    ```kotlin
    val b: UByte = 1u  // UByte，已提供預期類型
    val s: UShort = 1u // UShort，已提供預期類型
    val l: ULong = 1u  // ULong，已提供預期類型
  
    val a1 = 42u // UInt：未提供預期類型，常數符合 UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong：未提供預期類型，常數不符合 UInt
    ```

*   `uL` 和 `UL` 明確指定常數應為無符號長整數：

    ```kotlin
    val a = 1UL // ULong，即使未提供預期類型且常數符合 UInt
    ```

## 使用案例

無符號數字的主要使用案例是利用整數的完整位元範圍來表示正值。例如，表示不符合有符號類型的十六進位常數，例如 32 位元 `AARRGGBB` 格式的顏色：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

您可以使用無符號數字來初始化位元組陣列，而無需明確的 `toByte()` 常數轉型 (literal casts)：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一個使用案例是與原生 API 的互通性。Kotlin 允許表示在簽名中包含無符號類型的原生宣告。這種映射不會用有符號整數替代無符號整數，從而保持語義不變。

### 非目標

儘管無符號整數只能表示正數和零，但將它們用於應用程式領域需要非負整數的情況並不是一個目標。例如，作為集合大小或集合索引值的類型。

有幾個原因：

*   使用有符號整數有助於檢測意外溢位 (overflows) 並發出錯誤條件信號，例如 [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html) 在空列表時為 -1。
*   無符號整數不能被視為有符號整數的範圍受限版本，因為它們的值範圍不是有符號整數範圍的子集。無論是有符號還是無符號整數都不是彼此的子類型。