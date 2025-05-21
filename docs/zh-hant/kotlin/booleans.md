---
title: "布林值 (Booleans)"
---
`Boolean`類型代表布林物件，其可以有兩個值：`true` 和 `false`。
`Boolean` 有一個宣告為 `Boolean?` 的 [可為空](null-safety)的對應類型。

:::note
在 JVM 上，儲存為原始 `boolean` 類型的布林值通常使用 8 位元。

:::

布林值的內建運算包括：

* `||` – 析取（邏輯 _OR_）
* `&&` – 合取（邏輯 _AND_）
* `!` – 否定（邏輯 _NOT_）

例如：

```kotlin
fun main() {

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

}
```

`||` 和 `&&` 運算符會以惰性方式運作，這表示：

* 如果第一個運算元是 `true`，則 `||` 運算符不會評估第二個運算元。
* 如果第一個運算元是 `false`，則 `&&` 運算符不會評估第二個運算元。

:::note
在 JVM 上，布林物件的可為空參考會像[數字](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)一樣，裝箱到 Java 類別中。

:::