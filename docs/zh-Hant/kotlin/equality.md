[//]: # (title: 相等性)

在 Kotlin 中，存在兩種型別的相等性：

*   _結構性相等性_ (`==`) - 對 `equals()` 函式的檢查
*   _參照相等性_ (`===`) - 檢查兩個參照是否指向同一個物件

## 結構性相等性

結構性相等性驗證兩個物件是否具有相同的內容或結構。結構性相等性透過 `==` 運算符及其反向運算符 `!=` 進行檢查。
按照慣例，像 `a == b` 這樣的表達式會被轉換為：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不是 `null`，它會呼叫 `equals(Any?)` 函式。否則（即 `a` 是 `null`），它會檢查 `b` 是否與 `null` 參照相等：

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

請注意，當明確地與 `null` 比較時，最佳化程式碼沒有意義：`a == null` 會自動轉換為 `a === null`。

在 Kotlin 中，所有類別都從 `Any` 類別繼承 `equals()` 函式。預設情況下，`equals()` 函式實作了 [參照相等性](#referential-equality)。然而，Kotlin 中的類別可以覆寫 `equals()` 函式以提供自訂的相等性邏輯，並以這種方式實作結構性相等性。

值類別 (Value classes) 和資料類別 (Data classes) 是兩種特定的 Kotlin 型別，它們會自動覆寫 `equals()` 函式。這就是為什麼它們預設實作結構性相等性的原因。

然而，對於資料類別而言，如果 `equals()` 函式在其父類別中被標記為 `final`，則其行為保持不變。

明顯地，非資料類別 (non-data classes)（那些未以 `data` 修飾符聲明的類別）預設不會覆寫 `equals()` 函式。相反地，非資料類別實作了從 `Any` 類別繼承的參照相等性行為。要實作結構性相等性，非資料類別需要自訂的相等性邏輯來覆寫 `equals()` 函式。

要提供自訂的相等檢查實作，請覆寫 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函式：

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // Compares properties for structural equality
        return this.x == other.x && this.y == other.y
    }
}
```
> 當覆寫 equals() 函式時，您也應該覆寫 [hashCode() 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)，以保持相等性與雜湊之間的一致性，並確保這些函式的正確行為。
>
{style="note"}

名稱相同但簽名不同（例如 `equals(other: Foo)`）的函式不會影響使用運算符 `==` 和 `!=` 進行的相等檢查。

結構性相等性與由 `Comparable<...>` 介面定義的比較無關，因此只有自訂的 `equals(Any?)` 實作可能會影響運算符的行為。

## 參照相等性

參照相等性驗證兩個物件的記憶體位址，以確定它們是否為同一個實例。

參照相等性透過 `===` 運算符及其反向運算符 `!==` 進行檢查。`a === b` 當且僅當 `a` 和 `b` 指向同一個物件時，求值為 true：

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

對於在執行時由原始型別 (primitive types) 表示的值（例如 `Int`），`===` 相等檢查等同於 `==` 檢查。

> 參照相等性在 Kotlin/JS 中實作方式不同。有關相等性的更多資訊，請參閱 [Kotlin/JS](js-interop.md#equality) 文件。
>
{style="tip"}

## 浮點數相等性

當相等檢查的運算元在靜態上已知為 `Float` 或 `Double`（可為 null 或不可為 null）時，該檢查遵循 [IEEE 754 浮點算術標準](https://en.wikipedia.org/wiki/IEEE_754)。

對於未被靜態型別化為浮點數的運算元，其行為有所不同。在這些情況下，實作的是結構性相等性。因此，使用未被靜態型別化為浮點數的運算元進行的檢查與 IEEE 標準不同。在此情境下：

*   `NaN` 等於自身
*   `NaN` 大於任何其他元素（包括 `POSITIVE_INFINITY`）
*   `-0.0` 不等於 `0.0`

更多資訊請參閱 [浮點數比較](numbers.md#floating-point-numbers-comparison)。

## 陣列相等性

要比較兩個陣列是否具有相同順序的相同元素，請使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

更多資訊請參閱 [比較陣列](arrays.md#compare-arrays)。