[//]: # (title: 字元)

字元由 `Char` 型別表示。
字元字面值使用單引號：`'1'`。

> 在 JVM 上，以原始型別 `char` 儲存的字元代表一個 16 位元的 Unicode 字元。
>
{style="note"}

特殊字元以跳脫反斜線 `\` 開頭。
支援以下跳脫序列：

*   `\t` – 定位字元 (tab)
*   `\b` – 倒退鍵 (backspace)
*   `
` – 換行 (LF)
*   `\r` – 歸位字元 (CR)
*   `\'` – 單引號
*   `\"` – 雙引號
*   `\\` – 反斜線
*   `\$` – 錢號 (dollar sign)

若要編碼任何其他字元，請使用 Unicode 跳脫序列語法：`'\uFF00'`。

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 印出額外的換行字元
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果字元變數的值是數字，您可以明確地使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 函式將其轉換為 `Int` 數字。

> 在 JVM 上，當需要可空引用時，字元會被裝箱 (boxed) 到 Java 類別中，就像處理[數字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)一樣。
> 裝箱操作不會保留身分。
>
{style="note"}