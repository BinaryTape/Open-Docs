[//]: # (title: 布林型別)

類型 `Boolean` 代表可以有兩個值的布林物件：`true` 和 `false`。
`Boolean` 有一個宣告為 `Boolean?` 的[可空](null-safety.md)對應型別。

> 在 JVM 上，儲存為原始 `boolean` 型別的布林值通常使用 8 位元。
>
{style="note"}

針對布林值的內建操作包含：

*   ``||`` – 析取 (邏輯 _或_)
*   ``&&`` – 合取 (邏輯 _且_)
*   ``!`` – 否定 (邏輯 _非_)

範例：

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    // true
    println(myTrue && myFalse)
    // false
    println(!myTrue)
    // false
    println(boolNull)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

``||`` 和 ``&&`` 運算子以惰性方式運作，這表示：

*   如果第一個運算元是 `true`，``||`` 運算子不會評估第二個運算元。
*   如果第一個運算元是 `false`，``&&`` 運算子不會評估第二個運算元。

> 在 JVM 上，布林物件的可空參照會被裝箱到 Java 類別中，就像[數字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)一樣。
>
{style="note"}