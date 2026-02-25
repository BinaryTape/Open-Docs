[//]: # (title: 字元)

字元由型別 `Char` 表示。字元常值以單引號括起來：`'1'`。

> 在 JVM 上，以原始型別 `char` 儲存的字元代表一個 16 位元的 Unicode 字元。
>
{style="note"}

特殊字元以轉義反斜線 `\` 開頭。支援以下轉義序列： 

* `\t` – tab
* `\b` – backspace
* `
` – 換行 (LF)
* `\r` – 歸位 (CR)
* `\'` – 單引號
* `\"` – 雙引號
* `\\` – 反斜線
* `\$` – 美元符號

若要編碼任何其他字元，請使用 Unicode 轉義序列語法：`'\uFF00'`。

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 印出一個額外的換行字元
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果字元變數的值是一個數字，你可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 函式明確地將其轉換為 `Int` 數字。

> 在 JVM 上，當需要可 null 的參考時，字元會被裝箱 (boxed) 在 Java 類別中，就像[數字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)一樣。
> 裝箱作業不會保留同一性 (Identity)。
>
{style="note"}