[//]: # (title: 運算子多載)

Kotlin 允許您為預定義的一組型別運算子提供自訂實作。這些運算子具有預定義的符號表示法 (例如 `+` 或 `*`) 和優先順序。要實作一個運算子，需為對應型別提供一個 [成員函式](functions.md#member-functions) 或 [擴充函式](extensions.md) 並指定其名稱。此型別會成為二元運算式的左側型別，以及一元運算式的引數型別。

若要多載運算子，請使用 `operator` 修飾詞標記對應的函式：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
在 [覆寫](inheritance.md#overriding-methods) 您的運算子多載時，您可以省略 `operator`：

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 一元運算

### 一元前綴運算子

| 運算式 | 轉換為 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

此表格表示，當編譯器處理例如 `+a` 的運算式時，它會執行以下步驟：

*   確定 `a` 的型別，假設為 `T`。
*   尋找針對接收者 `T`、帶有 `operator` 修飾詞且無參數的 `unaryPlus()` 函式，這表示一個成員函式或擴充函式。
*   如果函式不存在或有歧義，則會產生編譯錯誤。
*   如果函式存在且其回傳型別為 `R`，則運算式 `+a` 的型別為 `R`。

> 這些運算，以及所有其他運算，都針對 [基本型別](basic-types.md) 進行了最佳化，並不會為它們引入函式呼叫的額外開銷。
>
{style="note"}

舉例來說，以下是您可以如何多載一元減號運算子：

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

| 運算式 | 轉換為 |
|------------|---------------|
| `a++` | `a.inc()` + 見下文 |
| `a--` | `a.dec()` + 見下文 |

`inc()` 和 `dec()` 函式必須回傳一個值，該值將被指派給使用了 `++` 或 `--` 運算的變數。它們不應修改被呼叫 `inc` 或 `dec` 的物件。

編譯器會執行以下步驟來解析 *後綴* 形式的運算子，例如 `a++`：

*   確定 `a` 的型別，假設為 `T`。
*   尋找帶有 `operator` 修飾詞且無參數、適用於型別 `T` 的接收者的 `inc()` 函式。
*   檢查函式回傳型別是否為 `T` 的子型別。

計算此運算式的效果為：

*   將 `a` 的初始值儲存到一個暫存區 `a0`。
*   將 `a0.inc()` 的結果指派給 `a`。
*   回傳 `a0` 作為運算式的結果。

對於 `a--`，步驟完全類似。

對於 *前綴* 形式 `++a` 和 `--a`，解析方式相同，其效果為：

*   將 `a.inc()` 的結果指派給 `a`。
*   回傳 `a` 的新值作為運算式的結果。

## 二元運算

### 算術運算子

| 運算式 | 轉換為 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

對於此表中的運算，編譯器僅解析 *轉換為* 欄中的運算式。

以下是一個 `Counter` 類別的範例，它從給定值開始，並可以使用多載的 `+` 運算子進行遞增：

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 運算子

| 運算式 | 轉換為 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

對於 `in` 和 `!in`，過程相同，但引數順序相反。

### 索引存取運算子

| 運算式 | 轉換為 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括號會轉換為呼叫 `get` 和 `set`，並帶有適當數量的引數。

### invoke 運算子

| 運算式 | 轉換為 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

括號會轉換為呼叫 `invoke`，並帶有適當數量的引數。

### 複合指派

| 運算式 | 轉換為 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

對於指派運算，例如 `a += b`，編譯器執行以下步驟：

*   如果右欄中的函式可用：
    *   如果對應的二元函式 (例如 `plusAssign()` 對應 `plus()`) 也可用，且 `a` 是可變變數，並且 `plus` 的回傳型別是 `a` 的型別的子型別，則回報錯誤 (歧義)。
    *   確保其回傳型別為 `Unit`，否則回報錯誤。
    *   生成 `a.plusAssign(b)` 的程式碼。
*   否則，嘗試生成 `a = a + b` 的程式碼 (這包括型別檢查：`a + b` 的型別必須是 `a` 的子型別)。

> 指派在 Kotlin 中 *不是* 運算式。
>
{style="note"}

### 相等與不相等運算子

| 運算式 | 轉換為 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

這些運算子僅適用於函式 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html)，它可以被覆寫以提供自訂的相等性檢查實作。任何其他同名函式 (如 `equals(other: Foo)`) 都將不會被呼叫。

> `===` 和 `!==` (識別檢查) 無法多載，因此它們沒有約定。
>
{style="note"}

`==` 運算是一項特殊情況：它被轉換為一個複雜的運算式，用於篩選 `null` 值。
`null == null` 總是為真，而非 `null` 的 `x` 的 `x == null` 總是為假，且不會呼叫 `x.equals()`。

### 比較運算子

| 運算式 | 轉換為 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比較都轉換為對 `compareTo` 的呼叫，該函式要求回傳 `Int`。

### 屬性委託運算子

`provideDelegate`、`getValue` 和 `setValue` 運算子函式在 [委託屬性](delegated-properties.md) 中有描述。

## 具名函式中綴呼叫

您可以透過使用 [中綴函式呼叫](functions.md#infix-notation) 來模擬自訂的中綴運算。