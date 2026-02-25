[//]: # (title: 運算子多載)

Kotlin 允許你為型別上預定義的一組運算子提供自訂實作。這些運算子具有預定義的符號表示（如 `+` 或 `*`）和優先級。要實作一個運算子，請為對應型別提供一個具備特定名稱的[成員函數](functions.md#member-functions)或[擴充方法](extensions.md)。該型別會成為二元運算的左側型別，以及一元運算的引數型別。

要多載運算子，請使用 `operator` 修飾詞標記對應的函數：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
當[覆寫](inheritance.md#overriding-methods)你的運算子多載時，可以省略 `operator`：

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 一元運算

### 一元前置運算子

| 運算式 | 轉換為 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

此表說明當編譯器處理例如 `+a` 的運算式時，會執行以下步驟：

*   確定 `a` 的型別，假設為 `T`。
*   為接收者 `T` 尋找一個帶有 `operator` 修飾詞且無參數的 `unaryPlus()` 函數，這表示該函數可以是成員函數或擴充方法。
*   如果函數不存在或具有歧義，則會發生編譯錯誤。
*   如果函數存在且其傳回型別為 `R`，則運算式 `+a` 的型別為 `R`。

> 這些運算以及所有其他運算都已針對[基本型別](types-overview.md)進行優化，不會為它們引入函式呼叫的開銷。
>
{style="note"}

舉例來說，以下是你如何多載一元負號運算子：

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // 輸出 "Point(x=-10, y=-20)"
}
```
{kotlin-runnable="true"}

### 遞增與遞減

| 運算式 | 轉換為 |
|------------|---------------|
| `a++` | `a.inc()` + 參見下文 |
| `a--` | `a.dec()` + 參見下文 |

`inc()` 和 `dec()` 函數必須傳回一個值，該值將被指派給使用 `++` 或 `--` 運算的變數。它們不應該修改呼叫 `inc` 或 `dec` 的物件。

編譯器執行以下步驟來解析「後置」形式的運算子，例如 `a++`：

*   確定 `a` 的型別，假設為 `T`。
*   尋找一個適用於 `T` 型別接收者，且帶有 `operator` 修飾詞與無參數的 `inc()` 函數。
*   檢查該函數的傳回型別是否為 `T` 的子型別。

計算該運算式的效果為：

*   將 `a` 的初始值儲存到暫時儲存空間 `a0`。
*   將 `a0.inc()` 的結果指派給 `a`。
*   傳回 `a0` 作為運算式的結果。

對於 `a--`，其步驟完全類推。

對於「前置」形式 `++a` 和 `--a`，解析方式相同，其效果為：

*   將 `a.inc()` 的結果指派給 `a`。
*   傳回 `a` 的新值作為運算式的結果。

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

對於此表中的運算，編譯器僅解析「轉換為」欄位中的運算式。

以下是一個 `Counter` 類別範例，它從給定值開始，並可以使用多載的 `+` 運算子進行遞增：

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

對於 `in` 和 `!in`，程序相同，但引數的順序是反過來的。

### 索引存取運算子

| 運算式 | 轉換為 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括號會轉換為帶有相應數量引數的 `get` 和 `set` 呼叫。

### invoke 運算子

| 運算式 | 轉換為 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圓括號會轉換為帶有相應數量引數的 `invoke` 呼叫。

### 複合指派

| 運算式 | 轉換為 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

對於指派運算，例如 `a += b`，編譯器執行以下步驟：

*   如果右側欄位的函數可用：
    *   如果對應的二元函數（例如 `plusAssign()` 對應的 `plus()`）也可用，且 `a` 是可變變數，且 `plus` 的傳回型別是 `a` 型別的子型別，則回報錯誤（歧義）。
    *   確保其傳回型別為 `Unit`，否則回報錯誤。
    *   為 `a.plusAssign(b)` 產生程式碼。
*   否則，嘗試為 `a = a + b` 產生程式碼（這包含型別檢查：`a + b` 的型別必須是 `a` 的子型別）。

> 在 Kotlin 中，指派（Assignment）*不是*運算式。
>
{style="note"}

### 相等與不等運算子

| 運算式 | 轉換為 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

這些運算子僅適用於 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函數，你可以覆寫該函數以提供自訂的相等檢查實作。任何其他同名函數（如 `equals(other: Foo)`）都會被忽略。

當 `==` 運算式中的兩個運算元都不直接與 `null` 比較，且該比較不是在兩個浮點型別之間進行時，Kotlin 會呼叫 `.equals()`。否則，Kotlin 會使用 `===` 進行直接的 `null` 比較，並按數值比較非 null 的浮點值。

> `===` 和 `!==`（身分檢查）是不可多載的，因此不存在針對它們的慣例。
>
{style="note"}

### 比較運算子

| 運算式 | 轉換為 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比較都會轉換為對 `compareTo` 的呼叫，該函數必須回傳 `Int`。

### 屬性委託運算子

`provideDelegate`、`getValue` 和 `setValue` 運算子函數在[委託屬性](delegated-properties.md)中有所描述。

## 具名函數的中置呼叫

你可以透過使用[中置函數呼叫](functions.md#infix-notation)來模擬自訂的中置運算。