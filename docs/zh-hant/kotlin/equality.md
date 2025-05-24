---
title: "相等性 (Equality)"
---
在 Kotlin 中，有兩種相等性：

* _結構性_ 相等 (`==`) - 檢查 `equals()` 函式
* _參照性_ 相等 (`===`) - 檢查兩個參照是否指向同一個物件

## 結構性相等 (Structural equality)

結構性相等驗證兩個物件是否具有相同的內容或結構。結構性相等由 `==` 運算及其否定形式 `!=` 檢查。
按照慣例，像是 `a == b` 這樣的表達式會被翻譯成：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不是 `null`，它會呼叫 `equals(Any?)` 函式。否則（`a` 是 `null`），它會檢查 `b` 是否
與 `null` 具有參照性相等：

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

請注意，當明確與 `null` 比較時，優化程式碼是沒有意義的：
`a == null` 將自動翻譯為 `a === null`。

在 Kotlin 中，`equals()` 函式由所有類別從 `Any` 類別繼承。預設情況下，`equals()` 函式
實作[參照性相等](#referential-equality)。但是，Kotlin 中的類別可以覆寫 `equals()`
函式以提供自定義的相等邏輯，並以這種方式實作結構性相等。

值類別 (Value classes) 和資料類別 (data classes) 是兩種特定的 Kotlin 類型，它們會自動覆寫 `equals()` 函式。
這就是為什麼它們預設情況下實作結構性相等。

但是，在資料類別的情況下，如果 `equals()` 函式在父類別中被標記為 `final`，則其行為保持不變。

明顯地，非資料類別（那些未使用 `data` 修飾符聲明的類別）預設情況下不會覆寫
`equals()` 函式。相反，非資料類別實作從 `Any` 類別繼承的參照性相等行為。
要實作結構性相等，非資料類別需要自定義的相等邏輯來覆寫 `equals()` 函式。

要提供自定義的相等檢查實作，請覆寫
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函式：

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
:::note
當覆寫 equals() 函式時，您還應該覆寫 [hashCode() 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)
以保持相等性和雜湊之間的一致性，並確保這些函式的正確行為。

:::

具有相同名稱和其他簽名的函式（例如 `equals(other: Foo)`）不會影響使用
運算符 `==` 和 `!=` 進行的相等性檢查。

結構性相等與 `Comparable<...>` 介面定義的比較無關，因此只有自定義的
`equals(Any?)` 實作可能會影響運算符的行為。

## 參照性相等 (Referential equality)

參照性相等驗證兩個物件的記憶體位址，以確定它們是否為同一個實例。

參照性相等由 `===` 運算及其否定形式 `!==` 檢查。當且僅當 `a` 和 `b` 指向同一個物件時，`a === b` 的計算結果才為 true：

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

對於在運行時由基本類型表示的值
（例如，`Int`），`===` 相等性檢查等效於 `==` 檢查。

:::tip
參照性相等在 Kotlin/JS 中以不同的方式實作。有關相等性的更多訊息，請參閱 [Kotlin/JS](js-interop#equality) 文件。

:::

## 浮點數相等 (Floating-point numbers equality)

當相等性檢查的運算元在靜態上已知為 `Float` 或 `Double`（可為 null 或不可為 null）時，該檢查遵循
[IEEE 754 浮點算術標準](https://en.wikipedia.org/wiki/IEEE_754)。

對於未靜態鍵入為浮點數的運算元，行為有所不同。在這些情況下，
實作了結構性相等。因此，未靜態鍵入為浮點數的運算元的檢查與
IEEE 標準不同。在這種情況下：

* `NaN` 等於自身
* `NaN` 大於任何其他元素（包括 `POSITIVE_INFINITY`）
* `-0.0` 不等於 `0.0`

有關更多訊息，請參閱 [浮點數比較](numbers#floating-point-numbers-comparison)。

## 陣列相等 (Array equality)

要比較兩個陣列是否具有相同順序的相同元素，請使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

有關更多訊息，請參閱 [比較陣列](arrays#compare-arrays)。