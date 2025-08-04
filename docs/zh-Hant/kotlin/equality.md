[//]: # (title: 相等性)

在 Kotlin 中，有兩種相等性：

* _結構相等性_ (`==`) - 檢查 `equals()` 函數
* _參照相等性_ (`===`) - 檢查兩個參照是否指向同一個物件

## 結構相等性

結構相等性驗證兩個物件是否具有相同的內容或結構。結構相等性由 `==` 運算及其反向運算 `!=` 檢查。
依照慣例，像 `a == b` 這樣的表達式會轉換為：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 非 `null`，它會呼叫 `equals(Any?)` 函數。否則（即 `a` 是 `null`），它會檢查 `b`
是否參照上等同於 `null`：

```kotlin
fun main() {
    var a = "hello"
    var b = "hello"
    var c = null
    var d = null
    var e = d

    println(a == b)
    // true
    println(a == c)
    // false
    println(c == e)
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

請注意，當明確地與 `null` 比較時，無需最佳化您的程式碼：
`a == null` 會自動轉換為 `a === null`。

在 Kotlin 中，`equals()` 函數由所有類別從 `Any` 類別繼承而來。預設情況下，`equals()` 函數
實作了[參照相等性](#referential-equality)。然而，Kotlin 中的類別可以覆寫 `equals()`
函數以提供自訂的相等性邏輯，並透過這種方式實作結構相等性。

值類別 (value classes) 和資料類別 (data classes) 是兩種特定的 Kotlin 型別，它們會自動覆寫 `equals()` 函數。
這就是為什麼它們預設實作結構相等性的原因。

然而，在資料類別的情況下，如果 `equals()` 函數在父類別中被標記為 `final`，則其行為保持不變。

相比之下，非資料類別（那些未使用 `data` 修飾符宣告的類別）預設不覆寫 `equals()` 函數。相反，非資料類別實作從 `Any` 類別繼承而來的參照相等性行為。
要實作結構相等性，非資料類別需要自訂的相等性邏輯來覆寫 `equals()` 函數。

若要提供自訂的 `equals` 檢查實作，請覆寫
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函數：

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 比較屬性以判斷結構相等性
        return this.x == other.x && this.y == other.y
    }
}
```
> 覆寫 `equals()` 函數時，您也應該覆寫 [`hashCode()` 函數](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)，
> 以保持相等性與雜湊之間的一致性，並確保這些函數的正確行為。
>
{style="note"}

具有相同名稱及其他簽章的函數（例如 `equals(other: Foo)`）不會影響使用
`==` 和 `!=` 運算符的相等性檢查。

結構相等性與 `Comparable<...>` 介面定義的比較無關，因此只有自訂的 `equals(Any?)` 實作可能會影響該運算符的行為。

## 參照相等性

參照相等性驗證兩個物件的記憶體位址，以判斷它們是否為同一個實例。

參照相等性由 `===` 運算及其反向運算 `!==` 檢查。當且僅當 `a` 和 `b` 指向同一個物件時，`a === b` 評估為 `true`：

```kotlin
fun main() {
    var a = "Hello"
    var b = a
    var c = "world"
    var d = "world"

    println(a === b)
    // true
    println(a === c)
    // false
    println(c === d)
    // true

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於在執行時由基本型別表示的值
（例如 `Int`），`===` 相等性檢查等同於 `==` 檢查。

> 參照相等性在 Kotlin/JS 中實作方式不同。有關相等性的更多資訊，請參閱 [Kotlin/JS](js-interop.md#equality) 文件。
>
{style="tip"}

## 浮點數相等性

當相等性檢查的運算元靜態地已知為 `Float` 或 `Double`（可為 `null` 或不可為 `null`）時，檢查遵循 [IEEE 754 浮點數算術標準](https://en.wikipedia.org/wiki/IEEE_754)。

對於未靜態鍵入為浮點數的運算元，其行為有所不同。在這些情況下，
實作結構相等性。因此，對於未靜態鍵入為浮點數的運算元的檢查，與 IEEE 標準有所不同。在此情境中：

* `NaN` 等於它自身
* `NaN` 大於任何其他元素（包括 `POSITIVE_INFINITY`）
* `-0.0` 不等於 `0.0`

有關更多資訊，請參閱[浮點數比較](numbers.md#floating-point-numbers-comparison)。

## 陣列相等性

要比較兩個陣列是否具有相同元素且順序相同，請使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

有關更多資訊，請參閱[比較陣列](arrays.md#compare-arrays)。