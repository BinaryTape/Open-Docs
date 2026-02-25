[//]: # (title: 無號整數型別)

除了[整數型別](numbers.md#integer-types)之外，Kotlin 還為無號整數提供了以下型別：

| 型別      | 大小 (位元) | 最小值 | 最大值                                             |
|-----------|-------------|--------|----------------------------------------------------|
| `UByte`   | 8           | 0      | 255                                                |
| `UShort`  | 16          | 0      | 65,535                                             |
| `UInt`    | 32          | 0      | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`   | 64          | 0      | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

無號型別支援其對應有號型別的大部分操作。

> 無號數被實作為 [內嵌類別](inline-classes.md)，其中包含一個儲存屬性，該屬性包含相同寬度的對應有號型別。如果您想在無號與有號整數型別之間進行轉換，請確保更新您的程式碼，以便任何函式呼叫和操作都支援新型別。
>
{style="note"}

## 無號陣列與範圍

> 無號陣列及其相關操作目前處於 [Beta](components-stability.md) 階段。它們可能隨時發生不相容的變更。需要明確啟用（opt-in）（詳見下文）。
>
{style="warning"}

與基本型別相同，每個無號型別都有一個對應的型別來表示該型別的陣列：

* `UByteArray`：無號位元組陣列。
* `UShortArray`：無號短整數陣列。
* `UIntArray`：無號整數陣列。
* `ULongArray`：無號長整數陣列。

與有號整數陣列相同，它們提供了與 `Array` 類別類似的 API，且沒有裝箱（boxing）開銷。

當您使用無號陣列時，會收到一個警告，指出此功能尚未穩定。若要移除警告，請使用 `@ExperimentalUnsignedTypes` 註解進行啟用（opt-in）。您可以自行決定是否要求您的用戶端明確啟用您的 API，但請記住，無號陣列並非穩定功能，因此使用它們的 API 可能會因語言變更而損壞。[進一步了解啟用 (opt-in) 需求](opt-in-requirements.md)。

[範圍與級數](ranges.md)透過 `UIntRange`、`UIntProgression`、`ULongRange` 和 `ULongProgression` 類別支援 `UInt` 和 `ULong`。這些類別與無號整數型別一樣都是穩定的。

## 無號整數常值

為了讓無號整數更易於使用，您可以在整數常值後方加上後綴，以指示特定的無號型別（類似於 `Float` 的 `F` 或 `Long` 的 `L`）：

* `u` 和 `U` 字母表示無號常值，但不指定確切型別。如果未提供預期型別，編譯器將根據常值的大小使用 `UInt` 或 `ULong`：

    ```kotlin
    val b: UByte = 1u  // UByte，提供預期型別
    val s: UShort = 1u // UShort，提供預期型別
    val l: ULong = 1u  // ULong，提供預期型別
  
    val a1 = 42u // UInt：未提供預期型別，常值適合 UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong：未提供預期型別，常值不適合 UInt
    ```

* `uL` 和 `UL` 明確指定常值應為無號長整數：

    ```kotlin
    val a = 1UL // ULong，即使未提供預期型別且常值適合 UInt
    ```

## 使用案例

無號數的主要使用案例是利用整數的完整位元範圍來表示正值。例如，表示不適合有號型別的十六進位常數，例如 32 位元 `AARRGGBB` 格式的顏色：

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

您可以使用無號數來初始化位元組陣列，而不需要進行顯式的 `toByte()` 常值轉換：

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一個使用案例是與原生 API 的互通性。Kotlin 允許在簽章中表示包含無號型別的原生宣告。該對應不會將無號整數替換為有號整數，從而保持語意不變。

### 非目標

雖然無號整數只能表示正數和零，但將其用於應用程式領域需要非負整數的地方（例如作為集合大小或集合索引值的型別）並非其目標。

原因如下：

* 使用有號整數有助於偵測意外的溢位並發出錯誤狀況訊號，例如空清單的 [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html) 為 -1。
* 無號整數不能被視為有號整數的範圍受限版本，因為它們的值範圍並非有號整數範圍的子集。有號整數與無號整數兩者皆非對方的子型別。