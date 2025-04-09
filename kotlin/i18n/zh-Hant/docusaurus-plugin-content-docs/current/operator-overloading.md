---
title: "運算符重載 (Operator overloading)"
---
Kotlin 允許你為類型上預定義的運算符提供自定義的實現。這些運算符具有預定義的符號表示（例如 `+` 或 `*`）和優先級。要實現一個運算符，需要為相應的類型提供一個具有特定名稱的[成員函數](functions#member-functions)或[擴展函數](extensions)。對於二元運算，此類型會變成左側的運算元類型 (left-hand side type)；對於一元運算，則會變成參數類型。

要重載一個運算符，請使用 `operator` 修飾符標記相應的函數：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
當[覆寫](inheritance#overriding-methods)你的運算符重載時，可以省略 `operator`：

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 一元運算 (Unary operations)

### 一元前綴運算符 (Unary prefix operators)

| Expression | Translated to |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

此表格說明了當編譯器處理例如 `+a` 表達式時，它會執行以下步驟：

* 確定 `a` 的類型，假設為 `T`。
* 查找接收者類型為 `T` 的、帶有 `operator` 修飾符且沒有參數的 `unaryPlus()` 函數，這表示一個成員函數或一個擴展函數。
* 如果該函數不存在或存在歧義，則會發生編譯錯誤。
* 如果該函數存在且其返回類型為 `R`，則表達式 `+a` 的類型為 `R`。

:::note
這些運算，以及所有其他運算，都針對[基本類型](basic-types)進行了優化，並且不會為它們引入函數調用的開銷 (overhead)。

:::

例如，以下是如何重載一元負號運算符：

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // prints "Point(x=-10, y=-20)"
}
```

### 遞增和遞減 (Increments and decrements)

| Expression | Translated to |
|------------|---------------|
| `a++` | `a.inc()` + see below |
| `a--` | `a.dec()` + see below |

`inc()` 和 `dec()` 函數必須返回一個值，該值將被賦值給使用 `++` 或 `--` 運算的變量。它們不應改變調用 `inc` 或 `dec` 的對象。

編譯器會執行以下步驟來解析*後綴*形式的運算符，例如 `a++`：

* 確定 `a` 的類型，假設為 `T`。
* 查找接收者類型為 `T` 的、帶有 `operator` 修飾符且沒有參數的 `inc()` 函數。
* 檢查函數的返回類型是否為 `T` 的子類型。

計算表達式的效果是：

* 將 `a` 的初始值存儲到臨時存儲 `a0`。
* 將 `a0.inc()` 的結果賦值給 `a`。
* 返回 `a0` 作為表達式的結果。

對於 `a--`，這些步驟完全類似。

對於*前綴*形式 `++a` 和 `--a`，解析方式相同，效果是：

* 將 `a.inc()` 的結果賦值給 `a`。
* 返回 `a` 的新值作為表達式的結果。

## 二元運算 (Binary operations)

### 算術運算符 (Arithmetic operators)

| Expression | Translated to |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

對於此表中的運算，編譯器只會解析*Translated to*列中的表達式。

下面是一個 `Counter` 類的例子，它從給定的值開始，並且可以使用重載的 `+` 運算符來遞增：

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 運算符 (in operator)

| Expression | Translated to |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

對於 `in` 和 `!in`，過程相同，但參數的順序相反。

### 索引訪問運算符 (Indexed access operator)

| Expression | Translated to |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括號會被翻譯成對 `get` 和 `set` 的調用，並帶有適當數量的參數。

### invoke 運算符 (invoke operator)

| Expression | Translated to |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圓括號會被翻譯成對 `invoke` 的調用，並帶有適當數量的參數。

### 增強賦值 (Augmented assignments)

| Expression | Translated to |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

對於賦值運算，例如 `a += b`，編譯器會執行以下步驟：

* 如果右欄中的函數可用：
  * 如果相應的二元函數（也就是 `plusAssign()` 對應的 `plus()`）也可用，`a` 是一個可變變量，並且 `plus` 的返回類型是 `a` 的類型的子類型，則報告錯誤（歧義）。
  * 確保其返回類型是 `Unit`，否則報告錯誤。
  * 為 `a.plusAssign(b)` 生成代碼。
* 否則，嘗試為 `a = a + b` 生成代碼（這包括類型檢查：`a + b` 的類型必須是 `a` 的子類型）。

:::note
在 Kotlin 中，賦值*不是*表達式。

:::

### 相等和不等運算符 (Equality and inequality operators)

| Expression | Translated to |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

這些運算符僅適用於函數 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html)，可以覆寫該函數以提供自定義的相等性檢查實現。任何其他具有相同名稱的函數（例如 `equals(other: Foo)`）都不會被調用。

:::note
`===` 和 `!==`（恆等檢查）是不可重載的，因此沒有適用於它們的約定。

:::

`==` 運算很特別：它會被翻譯成一個複雜的表達式，該表達式會篩選 `null`。`null == null` 始終為真，並且對於非空的 `x`，`x == null` 始終為假，並且不會調用 `x.equals()`。

### 比較運算符 (Comparison operators)

| Expression | Translated to |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比較都會被翻譯成對 `compareTo` 的調用，該函數需要返回 `Int`。

### 屬性委託運算符 (Property delegation operators)

`provideDelegate`、`getValue` 和 `setValue` 運算符函數在[委託屬性](delegated-properties)中進行了描述。

## 用於命名函數的中綴調用 (Infix calls for named functions)

你可以通過使用 [infix 函數調用](functions#infix-notation) 來模擬自定義的中綴運算。