[//]: # (title: 字符)
[//]: # (description: 了解如何在 Kotlin 中使用 Char 类型，包括语法、Unicode 支持、转义序列以及对字符的常用操作。)

[`Char`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) 类型将单个字符表示为一个 UTF-16 代码单元。

对于单个字符值使用 `Char`，例如字母、数字、标点符号或空格。对于字符序列，请使用 [`String`](strings.md)。

> `Char` 不是数字类型，但每个字符都有一个可以访问的 Unicode 数值。
> 请参阅 [字符转换](#character-conversion)。
> 
{style="tip"}

## 语法

要声明字符，请将值括在单引号 (`' '`) 中。你可以显式指定 `Char` 类型，也可以让 Kotlin 根据值进行推断：

```kotlin
val letter: Char = 'a'

// Kotlin 会推断其为 Char，因为这些值是写在单引号中的
val digit = '1'
val symbol = '!'
val space = ' '
val separator = ':'
```

字符字面量必须包含且仅包含一个字符。否则，Kotlin 编译器会报告错误：

```kotlin
val invalid = 'AB' // 错误
val invalidEmpty = '' // 错误
```
{validate="false"}

### 可为空值

要存储可为空的值，请使用 `Char?`：

```kotlin
val maybeAbsent: Char? = null
```

> 在 JVM 上，当需要时，可为空的 `Char` 值会被装箱。这同样适用于[数字类型](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)。
>
{style="note"}

## Unicode 支持

Kotlin 将 `Char` 值表示为 UTF-16 代码单元。这意味着单个 `Char` 存储的是一个 UTF-16 代码单元，而不一定是一个完整的 Unicode 字符。

### 基本多语言平面

单个 `Char` 可以存储从 `\u0000` 到 `\uFFFF` 范围内的值。这个范围涵盖了基本多语言平面 (BMP)，其中包括几乎所有现代语言的字符以及大量的符号。

要通过 Unicode 值指定字符，请使用 `\u` 后跟来自 [Unicode 表](https://www.unicode.org/charts/) 的四位十六进制值：

```kotlin
val unicodeNumber = '\u0031' // 等于 '1'
```

### 增补字符

BMP 之外的 Unicode 字符（如表情符号和某些历史脚本）无法用单个 `Char` 表示。在 UTF-16 中，它们被编码为*代理对* (surrogate pair)，其中两个 `Char` 值共同在 `String` 中表示一个 Unicode 字符：

```kotlin
fun main() {
//sampleStart
    val emoji = "🥦"
    
    println(emoji.length) // 2
    println(emoji[0])     // 第一个代理项
    println(emoji[1])     // 第二个代理项
//sampleEnd
}
```

> 要单独处理 32 位符号，请使用存储为 `Int` 值的 Unicode 代码点 (code point)。
>
{style="tip"}

## 转义序列

对于难以直接在源代码中编写或具有特殊含义的特殊字符，请使用转义序列。

每个转义序列都以反斜杠 (`\`) 开头。

| **支持的序列** | **描述**         | 
|----------------|------------------|
| `\t`           | 制表符           | 
| `\b`           | 退格符           | 
| `
`           | 换行符 (LF)      | 
| `\r`           | 回车符 (CR)      | 
| `\'`           | 单引号           | 
| `\"`           | 双引号           |
| `\\`           | 反斜杠           | 
| `\$`           | 美元符号         | 

例如：

```kotlin
val newLine = '
'
val dollar = '\$'
val backslash = '\\'
```

## 操作

`Char` 支持比较、检查、大小写转换以及显式数字转换。

### 字符比较

要比较 `Char` 值，请使用标准[运算符](keyword-reference.md#operators-and-special-symbols)，如 `==`、`!=`、`<`、`>`、`<=` 和 `>=`。

Kotlin 根据字符的 Unicode 数值进行比较，并返回一个 `Boolean` 值：

```kotlin
val before = 'a' < 'b' // true
val after = 'c' > 'd' // false
val different = 'A' == 'a' // false 
val equal = 'A' == 'A' // true
```

### 字符处理

Kotlin 提供了用于检查字符值和进行大小写转换的函数。例如：

```kotlin
fun main() {
//sampleStart
    val myChar = 'A'
    // 检查字符是否表示数字
    println(myChar.isDigit()) // false
    // 检查字符是否表示大写字母
    println(myChar.isUpperCase()) // true
    // 返回小写形式
    println(myChar.lowercaseChar()) // 'a'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 在 [API 参考文档](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) 中可以详细了解更多可用函数。
>
{style="note"}

### 字符算术

你可以通过加上或减去一个整数来创建另一个字符值：

```kotlin
fun main() {
//sampleStart
    val a = 'a'

    println(a + 1)  // b
    println(a + 2)  // c
    println(a - 32) // A
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 这些操作遵循 Unicode 值，而不是特定语言的字母表规则。
>
{style="note"}

你还可以对可变变量使用前缀和后缀形式的自增 (`++`) 和自减 (`--`) 运算符：

```kotlin
fun main() {
//sampleStart
    var a = 'A'
    
    a += 10
    println(a)   // 'K'
    
    println(++a) // 'L'  前缀自增
    println(a++) // 'L'  后缀自增
    println(a)   // 'M'
    
    println(--a) // 'L'  前缀自减
    println(a--) // 'L'  后缀自减
    println(a)   // 'K'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 字符转换

要将 `Char` 转换为数字类型，请使用显式转换：

* 使用 `.code` 获取字符的 Unicode 数值：

  ```kotlin
  fun main() { 
  //sampleStart
      val letter = 'A'
      println(letter.code) // 65
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* 如果字符表示十进制数字，请使用 `digitToInt()`：
  ```kotlin
  fun main() { 
  //sampleStart
      val digit = '7'
      println(digit.digitToInt()) // 7
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

  > 如果字符可能不是有效的数字，请使用 `digitToIntOrNull()`。
  >
  {style="tip"}