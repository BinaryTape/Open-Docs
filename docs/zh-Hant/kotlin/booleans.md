[//]: # (title: 布林值)

`Boolean` 型別表示布林物件，其值可以為 `true` 與 `false`。
`Boolean` 有個對應的[可為 null](null-safety.md) 形式，宣告為 `Boolean?`。

> 在 JVM 上，以基本 `boolean` 型別儲存的布林值通常使用 8 位元。
>
{style="note"}

布林值的內建運算包括：

* `||` – 析取（邏輯 *OR*）
* `&&` – 合取（邏輯 *AND*）
* `!` – 否定（邏輯 *NOT*）

例如：

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

`||` 與 `&&` 運算子以延遲方式運作，這意味著：

* 如果第一個運算元為 `true`，`||` 運算子就不會評估第二個運算元。
* 如果第一個運算元為 `false`，`&&` 運算子就不會評估第二個運算元。

> 在 JVM 上，布林物件的可為 null 參照會被裝箱 (boxed) 在 Java 類別中，就像[數字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)一樣。
>
{style="note"}