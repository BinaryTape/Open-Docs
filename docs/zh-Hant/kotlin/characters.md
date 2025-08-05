[//]: # (title: 字元)

字元由 `Char` 型別表示。
字元字面值使用單引號：`'1'`。

> 在 JVM 上，儲存為基本型別 `char` 的字元代表一個 16 位元的 Unicode 字元。
>
{style="note"}

特殊字元以逸出反斜線 `\` 開頭。
支援以下逸出序列：

*   `\t` – 索引標籤
*   `\b` – 倒退鍵
*   `
` – 換行 (LF)
*   `\r` – 歸位 (CR)
*   `\'` – 單引號
*   `\"` – 雙引號
*   `\\` – 反斜線
*   `\#` – 錢號

要編碼任何其他字元，請使用 Unicode 逸出序列語法：`'\uFF00'`。

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // Prints an extra newline character
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果字元變數的值是數字，您可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 函數將其明確地轉換為 `Int` 數字。

> 在 JVM 上，當需要可為空（nullable）的參考時，字元會被裝箱（boxed）到 Java 類別中，就像數字一樣（請參閱[數字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)中的裝箱和快取數字）。
> 身分不會透過裝箱操作保留。
>
{style="note"}