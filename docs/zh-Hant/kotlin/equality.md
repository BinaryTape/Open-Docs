[//]: # (title: 相等)

在 Kotlin 中，有兩種類型的相等：

* 結構化相等 (`==`) - 檢查 `equals()` 函式
* 參照相等 (`===`) - 檢查兩個參照是否指向同一個物件

## 結構化相等

結構化相等驗證兩個物件是否具有相同的內容或結構。結構化相等透過 `==` 操作及其否定對應項 `!=` 進行檢查。
按照慣例，像 `a == b` 這樣的運算式會被轉換為：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不為 `null`，它會呼叫 `equals(Any?)` 函式。否則（`a` 為 `null`），它會檢查 `b` 是否在參照上等於 `null`：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

請注意，當明確與 `null` 進行比較時，優化程式碼是沒有意義的：
`a == null` 會被自動轉換為 `a === null`。

在 Kotlin 中，`equals()` 函式由所有類別繼承自 `Any` 類別。預設情況下，`equals()` 函式實作[參照相等](#referential-equality)。然而，Kotlin 中的類別可以覆寫 `equals()` 函式以提供自訂相等邏輯，並以此方式實作結構化相等。

Value 類別與資料類別是兩種特殊的 Kotlin 型別，會自動覆寫 `equals()` 函式。這就是為什麼它們預設實作結構化相等的原因。

然而，對於資料類別，如果 `equals()` 函式在父類別中被標記為 `final`，其行為將保持不變。

不同的是，非資料類別（未宣告 `data` 修飾詞的類別）預設不會覆寫 `equals()` 函式。相反地，非資料類別會實作繼承自 `Any` 類別的參照相等行為。若要實作結構化相等，非資料類別需要自訂相等邏輯來覆寫 `equals()` 函式。

若要提供自訂的相等檢查實作，請覆寫
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函式：

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 比較屬性的結構化相等
        return this.x == other.x && this.y == other.y
    }
}
```
> 當覆寫 equals() 函式時，您也應該覆寫 [hashCode() 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)，以保持相等性與雜湊之間的一致性，並確保這些函式的正確行為。
>
{style="note"}

具有相同名稱但不同簽章的函式（例如 `equals(other: Foo)`）不會影響使用 `==` 與 `!=` 運算子進行的相等檢查。

結構化相等與 `Comparable<...>` 介面定義的比較無關，因此只有自訂的 `equals(Any?)` 實作可能會影響該運算子的行為。 

## 參照相等

參照相等會驗證兩個物件的記憶體位址，以判斷它們是否為同一個執行個體。

參照相等透過 `===` 操作及其否定對應項 `!==` 進行檢查。當且僅當 `a` 與 `b` 指向同一個物件時，`a === b` 的結果為 true： 

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

對於在執行階段由內建型別表示的值（例如 `Int`），`===` 相等檢查等同於 `==` 檢查。

> 參照相等在 Kotlin/JS 中的實作方式不同。如需更多關於相等的資訊，請參閱 [Kotlin/JS](js-interop.md#equality) 文件。
>
{style="tip"}

## 浮點數相等

當相等檢查的運算元在靜態上已知為 `Float` 或 `Double`（無論是否可為 null）時，該檢查遵循 [IEEE 754 浮點數算術標準](https://en.wikipedia.org/wiki/IEEE_754)。

對於並非靜態型別化為浮點數的運算元，其行為會有所不同。在這些情況下，會實作結構化相等。因此，運算元未靜態型別化為浮點數的檢查會與 IEEE 標準不同。在這種情況下：

* `NaN` 等於其自身
* `NaN` 大於任何其他元素（包括 `POSITIVE_INFINITY`） 
* `-0.0` 不等於 `0.0`

如需更多資訊，請參閱[浮點數比較](numbers.md#floating-point-number-comparison)。

## 陣列相等

若要比較兩個陣列是否在相同順序下擁有相同的元素，請使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

如需更多資訊，請參閱[比較陣列](arrays.md#compare-arrays)。