---
title: "Java 和 Kotlin 中的字符串"
description: "了解如何从 Java String 迁移到 Kotlin String。本指南涵盖 Java StringBuilder、字符串连接和拆分字符串、多行字符串、流以及其他主题。"
---
本指南包含如何在 Java 和 Kotlin 中使用字符串执行典型任务的示例。
它将帮助你从 Java 迁移到 Kotlin，并以地道的 Kotlin 方式编写代码。

## 连接字符串

在 Java 中，你可以通过以下方式执行此操作：

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```

在 Kotlin 中，在变量名称前使用美元符号 (`$`) 将此变量的值插入到你的字符串中：

```kotlin
fun main() {

    // Kotlin
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")

}
```

你可以通过用花括号将复杂表达式括起来来插入其值，例如 `${name.length}`。
有关更多信息，请参见[字符串模板](strings#string-templates)。

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

在 Kotlin 中，使用 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) ——
一个[内联函数](inline-functions)，它接受构建字符串的逻辑作为 lambda 参数：

```kotlin
fun main() {

       // Kotlin
       val countDown = buildString {
           for (i in 5 downTo 1) {
               append(i)
               appendLine()
           }
       }
       println(countDown)

}
```

在底层，`buildString` 使用与 Java 中相同的 `StringBuilder` 类，你可以通过隐式的 `this` 访问它
在 [lambda](lambdas#function-literals-with-receiver) 内部。

了解更多关于 [lambda 编码规范](coding-conventions#lambdas)的信息。

## 从集合项创建字符串

在 Java 中，你可以使用 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)
来过滤、映射，然后收集这些项：

```java
// Java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
String invertedOddNumbers = numbers
        .stream()
        .filter(it `->` it % 2 != 0)
        .map(it `->` -it)
        .map(Object::toString)
        .collect(Collectors.joining("; "));
System.out.println(invertedOddNumbers);
```

在 Kotlin 中，使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数，
Kotlin 为每个 List 定义了该函数：

```kotlin
fun main() {

    // Kotlin
    val numbers = listOf(1, 2, 3, 4, 5, 6)
    val invertedOddNumbers = numbers
        .filter { it % 2 != 0 }
        .joinToString(separator = ";") {"${-it}"}
    println(invertedOddNumbers)

}
```

:::note
在 Java 中，如果你想要分隔符和后面的项目之间有空格，你需要显式地向分隔符添加空格。

:::

了解更多关于 [joinToString()](collection-transformations#string-representation) 的用法。

## 如果字符串为空，则设置默认值

在 Java 中，你可以使用 [三元运算符](https://en.wikipedia.org/wiki/%3F:)：

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

Kotlin 提供了内联函数 [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)，
它接受默认值作为参数：

```kotlin
// Kotlin
import kotlin.random.Random

fun main() {
    val name = getName().ifBlank { "John Doe" }
    println(name)
}

fun getName(): String =
    if (Random.nextBoolean()) "" else "David"

```

## 替换字符串开头和结尾的字符

在 Java 中，你可以使用 [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String))
函数。
在这种情况下，`replaceAll()` 函数接受正则表达式 `^##` 和 `##$`，它们分别定义了以 `##` 开头和结尾的字符串：

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```

在 Kotlin 中，使用带有字符串分隔符 `##` 的 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html)
函数：

```kotlin
fun main() {

    // Kotlin
    val input = "##place##holder##"
    val result = input.removeSurrounding("##")
    println(result)

}
```

## 替换出现的内容

在 Java 中，你可以使用 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)
和 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 类，
例如，混淆某些数据：

```java
// Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it `->` "xxx");
System.out.println("Initial input: '" + input + "'");
System.out.println("Anonymized input: '" + replacementResult + "'");
```

在 Kotlin 中，你使用 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 类，
它简化了正则表达式的使用。
此外，使用 [多行字符串](strings#multiline-strings) 通过减少反斜杠的数量来简化正则表达式模式：

```kotlin
fun main() {

    // Kotlin
    val regex = Regex("""\w*\d+\w*""") // multiline string
    val input = "login: Pokemon5, password: 1q2w3e4r5t"
    val replacementResult = regex.replace(input, replacement = "xxx")
    println("Initial input: '$input'")
    println("Anonymized input: '$replacementResult'")

}
```

## 分割字符串

在 Java 中，要使用句点字符 (`.`) 分割字符串，你需要使用转义 (`\\`)。
发生这种情况是因为 `String` 类的 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String))
函数接受一个正则表达式作为参数：

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```

在 Kotlin 中，使用 Kotlin 函数 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)，
它接受分隔符的可变参数作为输入参数：

```kotlin
fun main() {

    // Kotlin
    println("Sometimes.text.should.be.split".split("."))

}
```

如果需要使用正则表达式进行分割，请使用接受 `Regex` 作为参数的重载 `split()` 版本。

## 获取子字符串

在 Java 中，你可以使用 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 函数，
它接受一个包含的起始字符索引，以开始获取子字符串。
要在此字符之后获取子字符串，你需要递增索引：

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```

在 Kotlin 中，你使用 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 函数，
并且不需要计算要获取其后子字符串的字符的索引：

```kotlin
fun main() {

    // Kotlin
    val input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
    val answer = input.substringAfter("?")
    println(answer)

}
```

此外，你可以在字符最后一次出现后获取子字符串：

```kotlin
fun main() {

    // Kotlin
    val input = "To be, or not to be, that is the question."
    val question = input.substringAfterLast(",")
    println(question)

}
```

## 使用多行字符串

在 Java 15 之前，有几种创建多行字符串的方法。例如，使用
`String` 类的 [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))
函数：

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```

在 Java 15 中，出现了 [文本块](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)。
有一件事要记住：如果你打印一个多行字符串，并且三引号在下一行，
则会有一个额外的空行：

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```

输出：

<img src="/img/java-15-multiline-output.png" alt="Java 15 multiline output" width="700" style={{verticalAlign: 'middle'}}/>

如果你将三引号放在与最后一个单词相同的行上，则这种行为差异就会消失。

在 Kotlin 中，你可以使用新行上的引号格式化你的行，并且输出中不会有额外的空行。
任何行的最左边的字符标识行的开头。与 Java 的不同之处在于，Java 会自动
修剪缩进，而在 Kotlin 中，你应该显式地这样做：

```kotlin
fun main() {

    // Kotlin   
    val result = """
        Kotlin
           Java 
    """.trimIndent()
    println(result)

}
```

输出：

<img src="/img/kotlin-multiline-output.png" alt="Kotlin multiline output" width="700" style={{verticalAlign: 'middle'}}/>

要获得额外的空行，你应该显式地将此空行添加到你的多行字符串中。

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

了解更多关于 [多行字符串](coding-conventions#strings)的信息。

## 接下来是什么？

* 查看其他 [Kotlin 习语](idioms)。
* 了解如何使用
  [Java to Kotlin 转换器](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有的 Java 代码转换为 Kotlin。

如果你有喜欢的习语，我们邀请你通过发送 pull request 来分享它。