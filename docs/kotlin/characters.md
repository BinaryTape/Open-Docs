[//]: # (title: 字符)

字符由 `Char` 类型表示。字符字面量使用单引号括起来：`'1'`。

> 在 JVM 上，以基本类型 `char` 存储的字符表示一个 16 位的 Unicode 字符。
>
{style="note"}

特殊字符以转义反斜杠 `\` 开头。支持以下转义序列： 

* `\t` – 制表符 (tab)
* `\b` – 退格符 (backspace)
* `
` – 换行符 (LF)
* `\r` – 回车符 (CR)
* `\'` – 单引号
* `\"` – 双引号
* `\\` – 反斜杠
* `\$` – 美元符号

要对任何其他字符进行编码，请使用 Unicode 转义序列语法：`'\uFF00'`。

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 打印一个额外的换行符
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果字符变量的值是一个数字，你可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 函数将其显式转换为 `Int` 数字。

> 在 JVM 上，当需要可为空引用时，字符会被装箱在 Java 类中，就像[数字](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)一样。装箱操作不会保留同一性。
>
{style="note"}