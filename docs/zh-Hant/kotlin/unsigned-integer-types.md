[//]: # (title: 無符號整數類型)

除了[整數類型](numbers.md#integer-types)之外，Kotlin 還提供了以下無符號整數類型：

| Type     | Size (bits) | Min value | Max value                                       |
|----------|-------------|-----------|-------------------------------------------------|
| `UByte`  | 8           | 0         | 255                                             |
| `UShort` | 16          | 0         | 65,535                                          |
| `UInt`   | 32          | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

無符號類型支援其對應帶符號類型的大部分操作。

> 無符號數字實作為[內聯類](inline-classes.md)，只有一個儲存屬性，其中包含相同寬度的對應帶符號類型。如果您想在無符號和帶符號整數類型之間轉換，請確保您更新程式碼，以使任何函數呼叫和操作支援新類型。
>
{style="note"}

## 無符號陣列與範圍

> 無符號陣列及其操作處於 [Beta](components-stability.md) 階段。它們可能隨時發生不相容的變更。
> 需要選擇啟用（詳情請見下文）。
>
{style="warning"}

與基本類型一樣，每個無符號類型都有一個對應的類型，用於表示該類型的陣列：

*   `UByteArray`: 無符號位元組的陣列。
*   `UShortArray`: 無符號 short 的陣列。
*   `UIntArray`: 無符號 int 的陣列。
*   `ULongArray`: 無符號 long 的陣列。

與帶符號整數陣列一樣，它們提供了與 `Array` 類別相似的 API，且沒有裝箱開銷。

當您使用無符號陣列時，會收到一個警告，指示此功能尚未穩定。
若要移除警告，請使用 `@ExperimentalUnsignedTypes` 註解選擇啟用。
由您決定您的客戶是否必須明確選擇啟用您的 API 使用，但請記住，無符號陣列並非穩定功能，因此使用它們的 API 可能會因語言變更而中斷。
[深入了解選擇啟用要求](opt-in-requirements.md)。

`UInt` 和 `ULong` 支援[範圍與進度](ranges.md)，透過 `UIntRange`、`UIntProgression`、`ULongRange` 和 `ULongProgression` 類別實現。這些類別與無符號整數類型一同處於穩定狀態。

## 無符號整數字面值

為了使無符號整數更易於使用，您可以為整數字面值附加字尾，以指定特定的無符號類型（類似於 `F` 用於 `Float` 或 `L` 用於 `Long`）：

*   `u` 和 `U` 字元表示無符號字面值，但未指定確切類型。
    如果未提供預期類型，編譯器會根據字面值的大小使用 `UInt` 或 `ULong`：

    ```kotlin
    val b: UByte = 1u  // UByte, expected type provided
    val s: UShort = 1u // UShort, expected type provided
    val l: ULong = 1u  // ULong, expected type provided
  
    val a1 = 42u // UInt: no expected type provided, constant fits in UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong: no expected type provided, constant doesn't fit in UInt
    ```

*   `uL` 和 `UL` 明確指定字面值應為無符號 long：

    ```kotlin
    val a = 1UL // ULong, even though no expected type provided and the constant fits into UInt
    ```

## 使用案例

無符號數字的主要使用案例是利用整數的完整位元範圍來表示正數值。
例如，表示不符合帶符號類型的十六進位常數，如 32 位元 `AARRGGBB` 格式的顏色：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

您可以使用無符號數字初始化位元組陣列，而無需明確的 `toByte()` 字面值型別轉換：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一個使用案例是與原生 API 的互操作性。Kotlin 允許表示簽名中包含無符號類型的原生宣告。映射不會用帶符號整數替代無符號整數，從而保持語義不變。

### 非目標

雖然無符號整數只能表示正數和零，但將其用於應用程式領域需要非負整數的場景並非目標。例如，作為集合大小或集合索引值的類型。

有幾個原因：

*   使用帶符號整數可以幫助檢測意外溢位並指示錯誤條件，例如空列表的 [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html) 為 -1。
*   無符號整數不能被視為帶符號整數的範圍受限版本，因為它們的值範圍不是帶符號整數範圍的子集。帶符號和無符號整數彼此都不是子類型。
    ```