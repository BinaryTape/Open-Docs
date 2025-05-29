[//]: # (title: 布林值)

`Boolean` 類型代表布林物件，它可以有兩個值：`true` 和 `false`。
`Boolean` 有一個 [可為 null](null-safety.md) 的對應物，宣告為 `Boolean?`。

> 在 JVM 上，儲存為原始 `boolean` 類型的布林值通常會使用 8 位元。
>
{style="note"}

針對布林值的內建運算包含：

* `||` – 析取 (邏輯 _OR_)
* `&&` – 合取 (邏輯 _AND_)
* `!` – 否定 (邏輯 _NOT_)

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

`||` 和 `&&` 運算子會惰性求值，這表示：

* 如果第一個運算元是 `true`，`||` 運算子不會評估第二個運算元。
* 如果第一個運算元是 `false`，`&&` 運算子不會評估第二個運算元。

> 在 JVM 上，布林物件的可為 null 參考會像 [數字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 一樣，在 Java 類別中被裝箱 (boxing)。
>
{style="note"}