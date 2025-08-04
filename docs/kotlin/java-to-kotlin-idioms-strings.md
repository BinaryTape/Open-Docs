[//]: # (title: Java 和 Kotlin 中的字符串)

<web-summary>了解如何从 Java String 迁移到 Kotlin String。本指南涵盖 Java StringBuilder、字符串拼接和拆分、多行字符串、Stream 以及其他主题。</web-summary>

本指南包含如何在 Java 和 Kotlin 中执行典型字符串任务的示例。它将帮助您从 Java 迁移到 Kotlin，并以地道的 Kotlin 风格编写代码。

## 字符串拼接

在 Java 中，你可以通过以下方式实现：

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

在 Kotlin 中，在变量名之前使用美元符号 (`$`) 来将该变量的值内插到字符串中：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")
//sampleEnd
}
```
{kotlin-runnable="true" id="concatenate-strings-kotlin"}

你可以通过用花括号包围复杂表达式来内插其值，例如 `${name.length}`。
关于字符串内插的更多信息，请参见[字符串模板](strings.md#string-templates)。

## 构建字符串

在 Java 中，你可以使用 [StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html)：

```java
// Java
StringBuilder countDown = new StringBuilder();
for (int i = 5; i > 0; i--) {
    countDown.append(i);
    countDown.append("
");
}
System.out.println(countDown);
```
{id="build-string-java"}

在 Kotlin 中，使用 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) –
这是一个接受用于构造字符串的逻辑作为 lambda 实参的[内联函数](inline-functions.md)：

```kotlin
fun main() {
//sampleStart
       // Kotlin
       val countDown = buildString {
           for (i in 5 downTo 1) {
               append(i)
               appendLine()
           }
       }
       println(countDown)
//sampleEnd
}
```
{kotlin-runnable="true" id="build-string-kotlin"}

在底层，`buildString` 使用与 Java 中相同的 `StringBuilder` 类，并且你可以通过 [lambda](lambdas.md#function-literals-with-receiver) 内部的隐式 `this` 访问它。

了解更多关于 [lambda 编码约定](coding-conventions.md#lambdas)。

## 从集合项创建字符串

在 Java 中，你使用 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html) 来过滤、映射然后收集项：

```java
// Java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
String invertedOddNumbers = numbers
        .stream()
        .filter(it -> it % 2 != 0)
        .map(it -> -it)
        .map(Object::toString)
        .collect(Collectors.joining("; "));
System.out.println(invertedOddNumbers);
```
{id="create-string-from-collection-java"}

在 Kotlin 中，使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数，
Kotlin 为每个 List 都定义了此函数：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(1, 2, 3, 4, 5, 6)
    val invertedOddNumbers = numbers
        .filter { it % 2 != 0 }
        .joinToString(separator = ";") {"${-it}"}
    println(invertedOddNumbers)
//sampleEnd
}
```
{kotlin-runnable="true"  id="create-string-from-collection-kotlin"}

> 在 Java 中，如果你希望分隔符和后面的项之间有空格，你需要显式地给分隔符添加空格。
>
{style="note"}

了解更多关于 [joinToString()](collection-transformations.md#string-representation) 的用法。

## 如果字符串为空，则设置默认值

在 Java 中，你可以使用[三元操作符](https://en.wikipedia.org/wiki/%3F:)：

```java
// Java
public void defaultValueIfStringIsBlank() {
    String nameValue = getName();
    String name = nameValue.isBlank() ? "John Doe" : nameValue;
    System.out.println(name);
}

public String getName() {
    Random rand = new Random();
    return rand.nextBoolean() ? "" : "David";
}
```
{id="set-default-value-if-blank-java"}

Kotlin 提供了内联函数 [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)，
它接受默认值作为实参：

```kotlin
// Kotlin
import kotlin.random.Random

//sampleStart
fun main() {
    val name = getName().ifBlank { "John Doe" }
    println(name)
}

fun getName(): String =
    if (Random.nextBoolean()) "" else "David"
//sampleEnd
```
{kotlin-runnable="true" id="set-default-value-if-blank-kotlin"}

## 替换字符串开头和结尾的字符

在 Java 中，你可以使用 [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String)) 函数。
在这种情况下，`replaceAll()` 函数接受正则表达式 `^##` 和 `##$`，它们分别定义以 `##` 开头和结尾的字符串：

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

在 Kotlin 中，使用 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html) 
函数，并传入字符串分隔符 `##`：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "##place##holder##"
    val result = input.removeSurrounding("##")
    println(result)
//sampleEnd
}
```
{kotlin-runnable="true" id="replace-characters-kotlin"}

## 替换匹配项

在 Java 中，你可以使用 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)
和 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 类，
例如，用于混淆一些数据：

```java
// Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it -> "xxx");
System.out.println("Initial input: '" + input + "'");
System.out.println("Anonymized input: '" + replacementResult + "'");
```
{id="replace-occurrences-java"}

在 Kotlin 中，你使用 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 类，
它简化了正则表达式的使用。
此外，使用[多行字符串](strings.md#multiline-strings)可以通过减少反斜杠的数量来简化正则表达式模式：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val regex = Regex("""\w*\d+\w*""") // multiline string
    val input = "login: Pokemon5, password: 1q2w3e4r5t"
    val replacementResult = regex.replace(input, replacement = "xxx")
    println("Initial input: '$input'")
    println("Anonymized input: '$replacementResult'")
//sampleEnd
}
```
{kotlin-runnable="true" id="replace-occurrences-kotlin"}

## 拆分字符串

在 Java 中，要用句点字符 (`.`) 拆分字符串，你需要使用转义 (`\\`)。
这是因为 `String` 类的 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String))
函数接受一个正则表达式作为实参：

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

在 Kotlin 中，使用 Kotlin 函数 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)，
它接受可变数量的分隔符实参作为输入形参：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

如果你需要用正则表达式进行拆分，请使用接受 `Regex` 作为形参的重载 `split()` 版本。

## 截取子字符串

在 Java 中，你可以使用 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 函数，
它接受一个字符的包含起始索引，从该索引开始截取子字符串。
要在此字符之后截取子字符串，你需要递增索引：

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

在 Kotlin 中，你使用 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 函数，
无需计算要截取子字符串的字符索引：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
    val answer = input.substringAfter("?")
    println(answer)
//sampleEnd
}
```
{kotlin-runnable="true" id="take-substring-kotlin"}

此外，你可以在字符的最后一次出现之后截取子字符串：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "To be, or not to be, that is the question."
    val question = input.substringAfterLast(",")
    println(question)
//sampleEnd
}
```
{kotlin-runnable="true" id="take-substring-after-last-kotlin"}

## 使用多行字符串

在 Java 15 之前，有几种创建多行字符串的方法。例如，使用 `String` 类的 [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))
函数：

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

在 Java 15 中，[文本块](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)出现。
有一点需要记住：如果你打印一个多行字符串，并且三引号在下一行，那么会有一个额外的空行：

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```
{id="join-strings-15-java"}

输出：

![Java 15 multiline output](java-15-multiline-output.png){width=700}

如果将三引号放在与最后一个单词同一行，这种行为差异就会消失。

在 Kotlin 中，你可以这样格式化您的行：将引号放在新行上，输出中不会有额外的空行。
任何行的最左边字符都标识该行的起始位置。与 Java 的区别在于 Java 会自动修剪缩进，而在 Kotlin 中你需要显式地进行：

```kotlin
fun main() {
//sampleStart
    // Kotlin   
    val result = """
        Kotlin
           Java 
    """.trimIndent()
    println(result)
//sampleEnd
}
```
{kotlin-runnable="true" id="join-strings-kotlin"}

输出：

![Kotlin multiline output](kotlin-multiline-output.png){width=700}

要有一个额外的空行，你需要显式地将这个空行添加到你的多行字符串中。

在 Kotlin 中，你还可以使用 [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数来自定义缩进：

```kotlin
// Kotlin
fun main() {
    val result = """
       #  Kotlin
       #  Java
   """.trimMargin("#")
    println(result)
}
```
{kotlin-runnable="true" id="join-strings-trim-margin-kotlin"}

了解更多关于[多行字符串](coding-conventions.md#strings)。

## 下一步是什么？

* 浏览其他 [Kotlin 惯用法](idioms.md)。
* 了解如何使用 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有 Java 代码转换为 Kotlin。

如果你有最喜欢的惯用法，欢迎您通过发送 Pull Request 来分享它。