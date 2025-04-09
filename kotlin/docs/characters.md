---
title: 字符
---
字符由 `Char` 类型表示。
字符字面量用单引号括起来：`'1'`。

:::note
在 JVM 上，存储为原始类型的字符：`char`，表示一个 16 位的 Unicode 字符。

:::

特殊字符以转义反斜杠 `\` 开头。
支持以下转义序列：

* `\t` – 制表符（tab）
* `\b` – 退格符（backspace）
* `
` – 换行符（new line，LF）
* `\r` – 回车符（carriage return，CR）
* `\'` – 单引号（single quotation mark）
* `\"` – 双引号（double quotation mark）
* `\\` – 反斜杠（backslash）
* `\$` – 美元符号（dollar sign）

要编码任何其他字符，请使用 Unicode 转义序列语法：`'\uFF00'`。

```kotlin
fun main() {

    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 打印一个额外的换行符
    println('\uFF00')

}
```

如果字符变量的值是一个数字，你可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 函数显式地将其转换为 `Int` 数字。

:::note
在 JVM 上，当需要可空引用时，字符会被装箱到 Java 类中，就像[数字](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)一样。
装箱操作不会保留标识。

:::