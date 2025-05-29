[//]: # (title: Java 和 Kotlin 中的字符串)
[//]: # (description: 了解如何从 Java String 迁移到 Kotlin String。本指南涵盖了 Java StringBuilder、字符串拼接和分割、多行字符串、Stream 以及其他主题。)

本指南包含如何在 Java 和 Kotlin 中执行典型字符串任务的示例。它将帮助您从 Java 迁移到 Kotlin，并以地道的 Kotlin 方式编写代码。

## 拼接字符串

在 Java 中，您可以通过以下方式进行：

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

在 Kotlin 中，在变量名前使用美元符号 (`$`) 来将此变量的值插入到字符串中：

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

您可以通过将其用花括号 `{}` 括起来来插入复杂表达式的值，例如 `${name.length}`。
欲了解更多信息，请参阅[字符串模板](strings.md#string-templates)。

## 构建字符串

在 Java 中，您可以使用 [StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html)：

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

在 Kotlin 中，使用 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) – 一个将构建字符串的逻辑作为 lambda 参数的[内联函数](inline-functions.md)：

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

在底层，`buildString` 使用与 Java 相同的 `StringBuilder` 类，您可以通过 [lambda](lambdas.md#function-literals-with-receiver) 内部的隐式 `this` 来访问它。

了解更多关于 [lambda 编码规范](coding-conventions.md#lambdas) 的信息。

## 从集合项创建字符串

在 Java 中，您可以使用 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html) 来过滤、映射然后收集各项：

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

在 Kotlin 中，使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数，Kotlin 为每个 List 定义了该函数：

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

> 在 Java 中，如果您希望分隔符和后续项之间有空格，则需要显式地向分隔符添加空格。
>
{style="note"}

了解更多关于 [joinToString()](collection-transformations.md#string-representation) 的用法。

## 如果字符串为空白，则设置默认值

在 Java 中，您可以使用[三元运算符](https://en.wikipedia.org/wiki/%3F:)：

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

Kotlin 提供了[内联函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html) `ifBlank()`，它接受默认值作为参数：

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

在 Java 中，您可以使用 [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String)) 函数。
在这种情况下，`replaceAll()` 函数接受正则表达式 `^##` 和 `##$`，它们分别定义了以 `##` 开头和结尾的字符串：

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

在 Kotlin 中，使用 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html) 函数，并以字符串分隔符 `##` 作为参数：

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

## 替换出现项

在 Java 中，您可以使用 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html) 和 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 类，例如，用于混淆某些数据：

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

在 Kotlin 中，您可以使用 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 类，它简化了正则表达式的操作。
此外，使用[多行字符串](strings.md#multiline-strings)可以减少反斜杠的数量，从而简化正则表达式模式：

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

## 分割字符串

在 Java 中，要用句点字符 (`.`) 分割字符串，您需要使用转义 (`\\`)。
发生这种情况是因为 `String` 类的 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String)) 函数接受正则表达式作为参数：

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

在 Kotlin 中，使用 Kotlin 函数 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)，它接受可变参数的分隔符作为输入参数：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

如果您需要使用正则表达式进行分割，请使用接受 `Regex` 作为参数的重载 `split()` 版本。

## 获取子字符串

在 Java 中，您可以使用 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 函数，它接受一个包含起始字符索引的参数，从该索引开始获取子字符串。
要获取此字符之后的子字符串，您需要递增索引：

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

在 Kotlin 中，您使用 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 函数，并且无需计算要获取其后子字符串的字符索引：

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

此外，您可以获取字符最后一次出现后的子字符串：

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

在 Java 15 之前，有几种方法可以创建多行字符串。例如，使用 `String` 类的 [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...)) 函数：

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

在 Java 15 中，出现了[文本块](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)。
有一点需要记住：如果您打印一个多行字符串，并且三引号在下一行，则会有一个额外的空行：

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

如果您将三引号放在与最后一个单词同一行，这种行为差异就会消失。

在 Kotlin 中，您可以将引号放在新行上格式化您的行，并且输出中不会有额外的空行。
任何行的最左边字符标识了行的开始。
与 Java 的区别在于，Java 会自动修剪缩进，而在 Kotlin 中您应该显式地执行此操作：

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

要拥有一个额外的空行，您应该显式地将此空行添加到您的多行字符串中。

在 Kotlin 中，您还可以使用 [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数来自定义缩进：

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

了解更多关于[多行字符串](coding-conventions.md#strings)的信息。

## 接下来是什么？

* 查阅其他 [Kotlin 惯用法](idioms.md)。
* 了解如何使用 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有 Java 代码转换为 Kotlin。

如果您有喜欢的惯用法，欢迎您通过发送 pull request 来分享。