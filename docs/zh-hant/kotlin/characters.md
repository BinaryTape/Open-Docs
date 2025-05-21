---
title: "字元 (Characters)"
---
字元由 `Char` 類型表示。
字元字面值使用單引號：`'1'`。

:::note
在 Java 虛擬機器（JVM）上，儲存為基本類型（primitive type）的字元：`char`，代表一個 16 位元的 Unicode 字元。

:::

特殊字元以跳脫反斜線 `\` 開頭。
支援以下跳脫序列：

* `\t` – tab（制表符）
* `\b` – backspace（退格）
* `
` – new line (LF)（換行）
* `\r` – carriage return (CR)（歸位）
* `\'` – single quotation mark（單引號）
* `\"` – double quotation mark（雙引號）
* `\\` – backslash（反斜線）
* `\$` – dollar sign（錢字號）

要編碼任何其他字元，請使用 Unicode 跳脫序列語法：`'\uFF00'`。

```kotlin
fun main() {

    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // Prints an extra newline character
    println('\uFF00')

}
```

如果字元變數的值是數字，你可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 函數將其顯式轉換為 `Int` 數字。

:::note
在 JVM 上，當需要可空參考（nullable reference）時，字元會被封箱（boxed）到 Java 類別中，就像 [numbers](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine) 一樣。
恆等性（Identity）不會被封箱操作保留。

:::