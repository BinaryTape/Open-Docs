[//]: # (title: 字符串)

Kotlin 中的字符串由 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 类型表示。

> JVM 上，`String` 类型的对象使用 UTF-16 编码时，每个字符大约占用 2 字节。
> 
{style="note"}

通常，字符串值是双引号 (`"`) 中包含的字符序列：

```kotlin
val str = "abcd 123"
```

字符串的元素是字符，你可以通过索引操作 `s[i]` 访问它们。
你可以使用 `for` 循环迭代这些字符：

```kotlin
fun main() {
    val str = "abcd" 
//sampleStart
    for (c in str) {
        println(c)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

字符串是不可变的。一旦初始化了字符串，就不能更改其值或为其赋值新值。
所有转换字符串的操作都会在新 `String` 对象中返回其结果，而原始字符串保持不变：

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
   
    // Creates and prints a new String object
    println(str.uppercase())
    // ABCD
   
    // The original string remains the same
    println(str) 
    // abcd
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要连接字符串，请使用 `+` 操作符。只要表达式中的第一个元素是字符串，此操作符也适用于连接字符串与其他类型的值：

```kotlin
fun main() {
//sampleStart
    val s = "abc" + 1
    println(s + "def")
    // abc1def    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 在大多数情况下，使用[字符串模板](#string-templates)或[多行字符串](#multiline-strings)优于字符串连接。
> 
{style="note"}

## 字符串字面值

Kotlin 有两种类型的字符串字面值：

* [转义字符串](#escaped-strings)
* [多行字符串](#multiline-strings)

### 转义字符串

*转义字符串*可以包含转义字符。
这是一个转义字符串的例如：

```kotlin
val s = "Hello, world!
"
```

转义以常规方式进行，使用反斜杠 (`\`)。
关于支持的转义序列列表，请参见 [Characters](characters.md) 页面。

### 多行字符串

*多行字符串*可以包含换行符和任意文本。它由三引号 (`"""`) 分隔，不包含转义，并且可以包含换行符和任何其他字符：

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

要移除多行字符串中的前导空白，请使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数：

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

默认情况下，管道符号 `|` 用作边距前缀，但你可以选择另一个字符并将其作为形参传入，例如 `trimMargin(">")`。

## 字符串模板

字符串字面值可以包含*模板表达式*——一些被求值并将其结果连接到字符串中的代码片段。
当处理模板表达式时，Kotlin 会自动调用表达式结果上的 `.toString()` 函数，将其转换为字符串。模板表达式以美元符号 (`$`) 开头，并由变量名组成：

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或花括号中的表达式：

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你可以在多行字符串和转义字符串中使用模板。但是，多行字符串不支持反斜杠转义。
要在多行字符串中，在 [标识符](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 开头允许的任何符号之前插入美元符号 (`$`) 作为字面字符，
请使用以下语法：

```kotlin
val price = """
${'$'}9.99
"""
```

> 为了避免字符串中出现 `${'$'}` 序列，你可以使用实验性的[多美元符号字符串内插特性](#multi-dollar-string-interpolation)。
>
{style="note"}

### 多美元符号字符串内插

多美元符号字符串内插允许你指定需要多少个连续的美元符号来触发内插。
内插是将变量或表达式直接嵌入字符串的过程。

虽然你可以为单行字符串[转义字面值](#escaped-strings)，
但 Kotlin 中的多行字符串不支持反斜杠转义。
要在字符串中包含美元符号 (`$`) 和 (`$$`) 作为字面字符，
你必须使用 `${'$'}` 结构来阻止字符串内插。
这种方法会使代码更难阅读，尤其是在字符串包含多个美元符号时。

多美元符号字符串内插通过让你在单行字符串和多行字符串中都将美元符号视为字面字符来简化这一点。
例如：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta",
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

这里，`$$` 前缀指定需要两个连续的美元符号来触发字符串内插。
单个美元符号保留为字面字符。

你可以调整多少个美元符号会触发内插。
例如，使用三个连续美元符号 (`$$$`) 允许 `$$` 和 `$` 保留为字面值，
同时通过 `$$$` 启用内插：

```kotlin
val productName = "carrot"
val requestedData =
    $$$"""{
      "currency": "$",
      "enteredAmount": "42.45 $",
      "$$serviceField": "none",
      "product": "$$$productName"
    }
    """

println(requestedData)
//{
//    "currency": "$",
//    "enteredAmount": "42.45 $",
//    "$$serviceField": "none",
//    "product": "carrot"
//}
```

这里，`$$$` 前缀允许字符串包含 `$` 和 `$$`，
而无需使用 `${'$'}` 结构进行转义。

多美元符号字符串内插不影响使用单美元符号字符串内插的现有代码。
你可以像以前一样继续使用单个 `$`，并在需要处理字符串中的字面美元符号时应用多美元符号。

## 字符串格式化

> 使用 `String.format()` 函数进行字符串格式化仅在 Kotlin/JVM 中可用。
>
{style="note"}

要根据你的特定要求格式化字符串，请使用 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 函数。

`String.format()` 函数接受一个格式字符串和一个或多个实参。格式字符串包含一个给定实参的占位符（由 `%` 指示），后跟格式说明符。
格式说明符是相应实参的格式化指令，由标志、宽度、精度和转换类型组成。总的来说，格式说明符决定了输出的格式。常见的格式说明符包括用于整数的 `%d`、用于浮点数的 `%f` 和用于字符串的 `%s`。你还可以使用 `argument_index$` 语法
在格式字符串中以不同格式多次引用同一个实参。

> 关于详细理解和格式说明符的详尽列表，请参见 [Java 的 `Formatter` 类文档](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)。
>
{style="note"}

让我们看一个例如：

```kotlin
fun main() { 
//sampleStart
    // Formats an integer, adding leading zeroes to reach a length of seven characters
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // Formats a floating-point number to display with a + sign and four decimal places
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // Formats two strings to uppercase, each taking one placeholder
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // Formats a negative number to be enclosed in parentheses, then repeats the same number in a different format (without parentheses) using `argument_index$` syntax.
    val negativeNumberInParentheses = String.format("%(d means %1$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()` 函数提供了与字符串模板类似的功能。然而，`String.format()` 函数更通用，因为它提供了更多的格式化选项。

此外，你可以从变量赋值格式字符串。当格式字符串发生变化时，例如在取决于用户区域设置的本地化场景中，这会很有用。

使用 `String.format()` 函数时请注意，因为它很容易出现实参的数量或位置与对应的占位符不匹配的情况。