[//]: # (title: 字符串)

Kotlin 中的字符串由类型 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 表示。

> 在 JVM 上，UTF-16 编码的 `String` 类型对象每个字符大约占用 2 字节。
>
{style="note"}

通常，字符串值是包含在双引号 (`"`) 中的字符序列：

```kotlin
val str = "abcd 123"
```

字符串的元素是字符，你可以通过索引操作 `s[i]` 访问它们。
你可以使用 `for` 循环遍历这些字符：

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

字符串是不可变的 (immutable)。一旦初始化字符串，你就不能改变它的值或给它赋一个新值。
所有转换字符串的操作都会在一个新的 `String` 对象中返回结果，而不改变原始字符串：

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

要连接字符串，请使用 `+` 运算符。这同样适用于连接字符串与其他类型的值，只要表达式中的第一个元素是字符串即可：

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

> 在大多数情况下，使用 [字符串模板](#string-templates) 或 [多行字符串](#multiline-strings) 比字符串连接更可取。
>
{style="note"}

## 字符串字面值

Kotlin 有两种类型的字符串字面值 (string literal)：

* [转义字符串](#escaped-strings)
* [多行字符串](#multiline-strings)

### 转义字符串

_转义字符串_ 可以包含转义字符。
以下是一个转义字符串的示例：

```kotlin
val s = "Hello, world!
"
```

转义是通过传统方式完成的，使用反斜杠 (`\`)。
有关支持的转义序列列表，请参阅 [字符](characters.md) 页面。

### 多行字符串

_多行字符串_ 可以包含换行符和任意文本。它由三引号 (`"""`) 分隔，不包含转义，并且可以包含换行符和任何其他字符：

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

要从多行字符串中移除前导空格，请使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数：

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

默认情况下，管道符号 `|` 用作边距前缀 (margin prefix)，但你可以选择另一个字符并将其作为参数传递，例如 `trimMargin(">")`。

## 字符串模板

字符串字面值可以包含 _模板表达式_ (template expression) —— 它们是求值并将结果连接到字符串中的代码片段。
当处理模板表达式时，Kotlin 会自动调用表达式结果的 `.toString()` 函数将其转换为字符串。模板表达式以美元符号 (`$`) 开头，由变量名组成：

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

或花括号中的表达式 (expression)：

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
要在多行字符串中、在 [标识符](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 开头允许的任何符号之前插入美元符号 `$`，请使用以下语法：

```kotlin
val price = """
${'$'}9.99
"""
```

> 为了避免字符串中出现 `${'$'}` 序列，你可以使用实验性的 [多美元符号字符串插值功能](#multi-dollar-string-interpolation)。
>
{style="note"}

### 多美元符号字符串插值

> 多美元符号字符串插值是 [实验性](components-stability.md#stability-levels-explained) 功能，且需要显式启用（详见下文）。
>
> 它可能随时更改。我们希望您能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 提供反馈。
>
{style="warning"}

多美元符号字符串插值允许你指定需要多少个连续的美元符号来触发插值 (interpolation)。
插值是将变量或表达式直接嵌入字符串的过程。

虽然你可以为单行字符串 [转义字面值](#escaped-strings)，但 Kotlin 中的多行字符串不支持反斜杠转义。
要将美元符号 (`$`) 作为字面字符 (literal character) 包含在内，你必须使用 `${'$'}` 结构以防止字符串插值。
这种方法会使代码更难阅读，尤其当字符串包含多个美元符号时。

多美元符号字符串插值简化了这一点，允许你将美元符号视为字面字符，无论是在单行还是多行字符串中。
例如：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

在这里，`$` 前缀指定需要两个连续的美元符号才能触发字符串插值。
单个美元符号仍作为字面字符。

你可以调整触发插值所需的美元符号数量。
例如，使用三个连续的美元符号 (`$$$`) 允许 `$` 和 `$$` 保持为字面值，同时启用 `$$$` 进行插值：

```kotlin
val productName = "carrot"
val requestedData =
    $$"""{
      "currency": "$",
      "enteredAmount": "42.45 $",
      "$serviceField": "none",
      "product": "$$productName"
    }
    """

println(requestedData)
//{
//    "currency": "$",
//    "enteredAmount": "42.45 $",
//    "$serviceField": "none",
//    "product": "carrot"
//}
```

在这里，`$$` 前缀允许字符串包含 `$` 和 `$$`，而无需使用 `${'$'}` 结构进行转义。

要启用此功能，请在命令行中使用以下编译器选项：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新你的 Gradle 构建文件中的 `compilerOptions {}` 块：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

此功能不影响使用单美元符号字符串插值的现有代码。
你可以像以前一样继续使用单个 `$`，并在需要处理字符串中的字面美元符号时应用多美元符号。

## 字符串格式化

> 使用 `String.format()` 函数进行字符串格式化仅在 Kotlin/JVM 中可用。
>
{style="note"}

要根据你的特定要求格式化字符串，请使用 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 函数。

`String.format()` 函数接受一个格式字符串 (format string) 和一个或多个参数。格式字符串包含一个占位符 (placeholder)（由 `%` 表示），用于给定参数，后面跟着格式说明符 (format specifier)。
格式说明符是针对相应参数的格式化指令，由标志 (flags)、宽度 (width)、精度 (precision) 和转换类型 (conversion type) 组成。总而言之，格式说明符决定了输出的格式。常见的格式说明符包括 `%d` 用于整数、`%f` 用于浮点数和 `%s` 用于字符串。你还可以使用 `argument_index$` 语法，在格式字符串中以不同格式多次引用同一个参数。

> 如需详细了解以及完整的格式说明符列表，请参阅 [Java 的 `Class Formatter` 文档](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)。
>
{style="note"}

让我们看一个示例：

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
    
    // Formats a negative number to be enclosed in parentheses, then repeats the same number in a different format (without parentheses) using `argument_index`.
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()` 函数提供与字符串模板 (string template) 类似的功能。然而，`String.format()` 函数更具通用性 (versatile)，因为它提供了更多的格式化选项。

此外，你可以将格式字符串从变量中赋值。当格式字符串发生变化时，这会很有用，例如，在依赖于用户区域设置 (user locale) 的本地化 (localization) 场景中。

使用 `String.format()` 函数时要小心，因为很容易使参数的数量或位置与其对应的占位符不匹配。