[//]: # (title: 運算子多載)

Kotlin 允許您為預定義的運算子集提供自訂實作。這些運算子具有預定義的符號表示法（例如 `+` 或 `*`）和優先順序。若要實作運算子，請為對應的型別提供一個[成員函數](functions.md#member-functions)或一個[擴充函數](extensions.md)，並指定其名稱。此型別會成為二元運算的左側型別，以及一元運算的引數型別。

若要多載運算子，請使用 `operator` 修飾符標記對應的函數：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
[覆寫](inheritance.md#overriding-methods)您的運算子多載時，您可以省略 `operator`：

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 一元運算

### 一元前綴運算子

| 表達式 | 轉換為 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

此表格表示，當編譯器處理例如表達式 `+a` 時，它會執行以下步驟：

*   決定 `a` 的型別，假設為 `T`。
*   尋找一個帶有 `operator` 修飾符且沒有參數的 `unaryPlus()` 函數，適用於接收者 `T`，這表示一個成員函數或一個擴充函數。
*   如果函數不存在或模稜兩可，則為編譯錯誤。
*   如果函數存在且其回傳型別為 `R`，則表達式 `+a` 的型別為 `R`。

> 這些運算，以及所有其他運算，都針對[基本型別](types-overview.md)進行了優化，並且不會引入函數呼叫的額外開銷。
>
{style="note"}

作為範例，以下說明如何多載一元負號運算子：

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // prints "Point(x=-10, y=-20)"
}
```
{kotlin-runnable="true"}

### 遞增與遞減

| 表達式 | 轉換為 |
|------------|---------------|
| `a++` | `a.inc()` + 見下方 |
| `a--` | `a.dec()` + 見下方 |

`inc()` 和 `dec()` 函數必須回傳一個值，該值將被指派給使用 `++` 或 `--` 運算的變數。它們不應修改被呼叫 `inc` 或 `dec` 的物件。

編譯器執行以下步驟來解析*後綴*形式的運算子，例如 `a++`：

*   決定 `a` 的型別，假設為 `T`。
*   尋找一個帶有 `operator` 修飾符且沒有參數的 `inc()` 函數，適用於型別 `T` 的接收者。
*   檢查函數的回傳型別是否為 `T` 的子型別。

計算表達式的效果是：

*   將 `a` 的初始值儲存到暫存儲存區 `a0`。
*   將 `a0.inc()` 的結果指派給 `a`。
*   回傳 `a0` 作為表達式的結果。

對於 `a--`，步驟完全相似。

對於*前綴*形式 `++a` 和 `--a`，解析方式相同，其效果是：

*   將 `a.inc()` 的結果指派給 `a`。
*   回傳 `a` 的新值作為表達式的結果。

## 二元運算

### 算術運算子

| 表達式 | 轉換為 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

對於此表格中的運算，編譯器僅解析*轉換為*欄位中的表達式。

以下是 `Counter` 類別的範例，它以給定值開始，並可以使用多載的 `+` 運算子進行遞增：

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### `in` 運算子

| 表達式 | 轉換為 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

對於 `in` 和 `!in`，過程相同，但引數順序相反。

### 索引存取運算子

| 表達式 | 轉換為 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括號會轉換為對 `get` 和 `set` 的呼叫，並帶有適當數量的引數。

### `invoke` 運算子

| 表達式 | 轉換為 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圓括號會轉換為對 `invoke` 的呼叫，並帶有適當數量的引數。

### 複合指派運算

| 表達式 | 轉換為 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

對於指派運算，例如 `a += b`，編譯器執行以下步驟：

*   如果右欄中的函數可用：
    *   如果對應的二元函數（即 `plusAssign()` 對應 `plus()`）也可用，`a` 是一個可變變數，並且 `plus` 的回傳型別是 `a` 型別的子型別，則回報錯誤（歧義）。
    *   確保其回傳型別為 `Unit`，否則回報錯誤。
    *   為 `a.plusAssign(b)` 產生程式碼。
*   否則，嘗試為 `a = a + b` 產生程式碼（這包括型別檢查：`a + b` 的型別必須是 `a` 的子型別）。

> 在 Kotlin 中，指派*不是*表達式。
>
{style="note"}

### 等式與不等式運算子

| 表達式 | 轉換為 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

這些運算子僅適用於函數 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html)，該函數可以被覆寫以提供自訂等式檢查實作。任何其他同名函數（例如 `equals(other: Foo)`）將不會被呼叫。

當 `==` 表達式中兩個運算元都沒有直接與 `null` 比較，且比較對象不是兩個浮點型別時，Kotlin 會呼叫 `.equals()`。否則，Kotlin 會使用 `===` 進行直接的 `null` 比較，並透過數值比較非 `null` 的浮點值。

> `===` 和 `!==` (身份檢查) 無法多載，因此沒有為它們定義慣例。
>
{style="note"}

### 比較運算子

| 表達式 | 轉換為 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比較都會轉換為對 `compareTo` 的呼叫，該函數必須回傳 `Int`。

### 屬性委託運算子

`provideDelegate`、`getValue` 和 `setValue` 運算子函數在[委託屬性](delegated-properties.md)中進行了描述。

## 具名函數的中綴呼叫

您可以透過使用[中綴函數呼叫](functions.md#infix-notation)來模擬自訂中綴運算。