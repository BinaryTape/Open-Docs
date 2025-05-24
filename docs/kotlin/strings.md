---
title: 字符串
---
Kotlin 中的字符串由 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 类型表示。

:::note
在 JVM 上，UTF-16 编码的 `String` 类型的对象每个字符大约占用 2 个字节。

:::

通常，字符串值是由双引号（`"`）括起来的字符序列：

```kotlin
val str = "abcd 123"
```

字符串的元素是可以通过索引操作 `s[i]` 访问的字符。
你可以使用 `for` 循环遍历这些字符：

```kotlin
fun main() {
    val str = "abcd" 

    for (c in str) {
        println(c)
    }

}
```

字符串是不可变的（immutable）。一旦初始化字符串，就无法更改其值或为其分配新值。
所有转换字符串的操作都会在新的 `String` 对象中返回结果，而原始字符串保持不变：

```kotlin
fun main() {

    val str = "abcd"
   
    // 创建并打印一个新的 String 对象
    println(str.uppercase())
    // ABCD
   
    // 原始字符串保持不变
    println(str) 
    // abcd

}
```

要连接字符串，请使用 `+` 运算符。只要表达式中的第一个元素是字符串，它也适用于将字符串与其他类型的值连接起来：

```kotlin
fun main() {

    val s = "abc" + 1
    println(s + "def")
    // abc1def    

}
```

:::note
在大多数情况下，使用[字符串模板](#string-templates)或[多行字符串](#multiline-strings)比字符串连接更可取。

:::

## 字符串字面值（String literals）

Kotlin 有两种类型的字符串字面值：

* [转义字符串](#escaped-strings)
* [多行字符串](#multiline-strings)

### 转义字符串（Escaped strings）

_转义字符串_ 可以包含转义字符。
这是一个转义字符串的示例：

```kotlin
val s = "Hello, world!
"
```

转义以传统方式完成，使用反斜杠（`\`）。
有关支持的转义序列的列表，请参见[字符](characters)页面。

### 多行字符串（Multiline strings）

_多行字符串_ 可以包含换行符和任意文本。它由三引号（`"""`）分隔，
不包含转义，并且可以包含换行符和任何其他字符：

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

要从多行字符串中删除前导空格，请使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数：

```kotlin
val text = """
    |告诉我，我会忘记。
    |教我，我会记住。
    |让我参与，我会学习。
    |(本杰明·富兰克林)
    """.trimMargin()
```

默认情况下，管道符号 `|` 用作边距前缀，但是你可以选择另一个字符并将其作为参数传递，例如 `trimMargin(">")`。

## 字符串模板（String templates）

字符串字面值可能包含_模板表达式_——会被评估并将其结果连接到字符串中的代码片段。
当处理模板表达式时，Kotlin 会自动在表达式的结果上调用 `.toString()` 函数，
将其转换为字符串。模板表达式以美元符号（`$`）开头，由变量名组成：

```kotlin
fun main() {

    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

}
```

或者花括号中的表达式：

```kotlin
fun main() {

    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3

}
```

你可以在多行字符串和转义字符串中使用模板。但是，多行字符串不支持反斜杠转义。
要在多行字符串中插入美元符号 `$`
在[标识符](https://kotlinlang.org/docs/reference/grammar.html#identifiers)开头允许的任何符号之前，
使用以下语法：

```kotlin
val price = """
${'$'}_9.99
"""
```

:::note
为了避免字符串中出现 `${'$'}` 序列，你可以使用实验性的 [多美元字符串插值功能](#multi-dollar-string-interpolation)。

:::

### 多美元字符串插值（Multi-dollar string interpolation）

:::note
多美元字符串插值是[实验性的](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)
并且需要选择加入（opt-in）（请参见下面的详细信息）。

它可能随时更改。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中提供的反馈。

多美元字符串插值允许你指定需要多少个连续的美元符号才能触发插值。
插值是将变量或表达式直接嵌入到字符串中的过程。

虽然你可以[转义字面值](#escaped-strings)以用于单行字符串，
但 Kotlin 中的多行字符串不支持反斜杠转义。
要将美元符号（`$`）作为字面字符包含在内，你必须使用 `${'$'}` 构造来防止字符串插值。
这种方法会使代码更难阅读，尤其是在字符串包含多个美元符号时。

多美元字符串插值通过允许你将美元符号视为单行和多行字符串中的字面字符来简化此操作。
例如：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "$${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

在这里，`$$` 前缀指定需要两个连续的美元符号才能触发字符串插值。
单个美元符号保留为字面字符。

你可以调整触发插值的美元符号数量。
例如，使用三个连续的美元符号（`$$$`）允许 `$` 和 `$$` 保留为字面值，
同时允许使用 `$$$` 进行插值：

```kotlin
val productName = "carrot"
val requestedData =
    $$$"""{
      "currency": "$",
      "enteredAmount": "42.45 $$",
      "$$serviceField": "none",
      "product": "$$$productName"
    }
    """

println(requestedData)
//{
//    "currency": "$",
//    "enteredAmount": "42.45 $$",
//    "$$serviceField": "none",
//    "product": "carrot"
//}
```

在这里，`$$$` 前缀允许字符串包含 `$` 和 `$$`，而无需使用 `${'$'}` 构造进行转义。

要启用该功能，请在命令行中使用以下编译器选项：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新 Gradle 构建文件的 `compilerOptions {}` 块：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

此功能不会影响使用单美元字符串插值的现有代码。
你可以像以前一样继续使用单个 `$`，并在需要在字符串中处理字面美元符号时应用多美元符号。

## 字符串格式化（String formatting）

使用 `String.format()` 函数进行字符串格式化仅在 Kotlin/JVM 中可用。

:::

要根据你的特定要求格式化字符串，请使用 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html)
函数。

`String.format()` 函数接受格式字符串和一个或多个参数。格式字符串包含给定参数的一个占位符（由 `%` 指示），
后跟格式说明符（format specifiers）。
格式说明符是相应参数的格式化指令，由标志、宽度、精度和
转换类型组成。总的来说，格式说明符决定了输出的格式。常见的格式说明符包括
`%d` 用于整数，`%f` 用于浮点数，`%s` 用于字符串。你还可以使用 `argument_index$` 语法
在格式字符串中多次引用相同的参数，采用不同的格式。

:::note
有关格式说明符的详细理解和广泛列表，请参见 [Java 的 Class Formatter 文档](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)。

:::

让我们看一个例子：

```kotlin
fun main() { 

    // 格式化一个整数，添加前导零以达到七个字符的长度
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // 格式化一个浮点数以显示带有 + 符号和四个小数位
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 格式化两个字符串为大写，每个字符串占用一个占位符
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 格式化一个负数以括在括号中，然后使用 `argument_index$` 以不同的格式（不带括号）重复相同的数字。
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416

}
```

`String.format()` 函数提供与字符串模板类似的功能。但是，
`String.format()` 函数更加通用，因为有更多的格式化选项可用。

此外，你可以从变量中分配格式字符串。当格式字符串更改时，这可能很有用，
例如，在取决于用户区域设置的本地化案例中。

使用 `String.format()` 函数时要小心，因为它很容易将参数的数量或位置与其对应的占位符不匹配。
```