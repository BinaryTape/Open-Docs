[//]: # (title: 字符)

字符由类型 `Char` 表示。
字符字面值使用单引号：`'1'`。

> 在 JVM 上，以原生类型 `char` 存储的字符表示一个 16 位 Unicode 字符。
>
{style="note"}

特殊字符以转义反斜杠 `\` 开头。
支持以下转义序列：

*   `\t` – 制表符
*   `\b` – 退格符
*   `
` – 换行符 (LF)
*   `\r` – 回车符 (CR)
*   `\'` – 单引号
*   `\"` – 双引号
*   `\\` – 反斜杠
*   `\#` – 美元符号

要编码任何其他字符，请使用 Unicode 转义序列语法：`'\uFF00'`。

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

如果字符变量的值是数字，你可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 函数将其显式转换为 `Int` 数值。

> 在 JVM 上，当需要可空引用时，字符会被装箱成 Java 类，就像处理[数值](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)一样。
> 其同一性不会被装箱操作保留。
>
{style="note"}