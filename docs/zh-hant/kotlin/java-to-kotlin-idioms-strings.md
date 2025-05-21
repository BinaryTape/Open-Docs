---
title: "Java 和 Kotlin 中的字串 (Strings)"
description: "學習如何從 Java 字串 (String) 遷移到 Kotlin 字串 (String)。本指南涵蓋 Java StringBuilder、字串串聯和分割 (Splitting) 字串、多行字串 (Multiline strings)、流 (Streams) 和其他主題。"
---
本指南包含如何在 Java 和 Kotlin 中使用字串執行典型任務的範例。
它將幫助您從 Java 遷移到 Kotlin，並以正宗的 Kotlin 方式編寫程式碼。

## 連接字串

在 Java 中，您可以透過以下方式執行此操作：

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```

在 Kotlin 中，在變數名稱前使用錢字符號 (`$`)，將此變數的值插入到字串中：

```kotlin
fun main() {

    // Kotlin
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")

}
```

您可以將複雜表達式的值用花括號括起來進行插值，例如 `${name.length}`。
有關更多資訊，請參閱 [字串模板 (string templates)](strings#string-templates)。

## 建立字串

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

在 Kotlin 中，使用 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) –
一個 [inline function (inline function)](inline-functions)，它接受一個建構字串的邏輯作為 lambda 參數：

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

在底層，`buildString` 使用與 Java 中相同的 `StringBuilder` 類別，您可以透過隱式的 `this` 在 [lambda (lambdas#function-literals-with-receiver)] 中存取它。

了解更多關於 [lambda coding conventions (lambda coding conventions)](coding-conventions#lambdas) 的資訊。

## 從集合項目建立字串

在 Java 中，您可以使用 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)
來過濾、映射，然後收集項目：

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

在 Kotlin 中，使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函數，
Kotlin 為每個 List 定義了該函數：

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
在 Java 中，如果您想要分隔符號和後續項目之間有空格，則需要顯式地向分隔符號添加空格。

:::

了解更多關於 [joinToString()](collection-transformations#string-representation) 的使用方式。

## 如果字串為空，則設定預設值

在 Java 中，您可以使用 [ternary operator](https://en.wikipedia.org/wiki/%3F:)：

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

Kotlin 提供了 inline function (inline function) [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)，
它接受預設值作為參數：

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

## 替換字串開頭和結尾的字元

在 Java 中，您可以使用 [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String))
函數。
在這種情況下，`replaceAll()` 函數接受正則表達式 `^##` 和 `##`，它們分別定義以 `##` 開頭和結尾的字串：

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```

在 Kotlin 中，使用帶有字串分隔符 `##` 的 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html)
函數：

```kotlin
fun main() {

    // Kotlin
    val input = "##place##holder##"
    val result = input.removeSurrounding("##")
    println(result)

}
```

## 替換事件

在 Java 中，您可以使用 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)
和 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 類別，
例如，混淆某些資料：

```java
// Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it `->` "xxx");
System.out.println("Initial input: '" + input + "'");
System.out.println("Anonymized input: '" + replacementResult + "'");
```

在 Kotlin 中，您可以使用 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 類別，
它簡化了使用正則表達式的工作。
此外，使用 [multiline strings (multiline strings)](strings#multiline-strings) 通過減少反斜線的數量來簡化正則表達式模式：

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

## 分割字串

在 Java 中，要使用句點字元 (`.`) 分割字串，您需要使用遮蔽 (`\\`)。
發生這種情況是因為 `String` 類別的 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String))
函數接受正則表達式作為參數：

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```

在 Kotlin 中，使用 Kotlin 函數 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)，
它接受分隔符號的 varargs 作為輸入參數：

```kotlin
fun main() {

    // Kotlin
    println("Sometimes.text.should.be.split".split("."))

}
```

如果您需要使用正則表達式分割，請使用接受 `Regex` 作為參數的重載 `split()` 版本。

## 取得子字串

在 Java 中，您可以使用 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 函數，
它接受一個包含的字元起始索引，從該字元開始取得子字串。
要在此字元之後取得子字串，您需要遞增索引：

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```

在 Kotlin 中，您可以使用 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 函數，
並且不需要計算要在其後取得子字串的字元的索引：

```kotlin
fun main() {

    // Kotlin
    val input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
    val answer = input.substringAfter("?")
    println(answer)

}
```

此外，您可以在字元的最後一次出現後取得子字串：

```kotlin
fun main() {

    // Kotlin
    val input = "To be, or not to be, that is the question."
    val question = input.substringAfterLast(",")
    println(question)

}
```

## 使用多行字串

在 Java 15 之前，有多種方法可以建立多行字串。 例如，使用
`String` 類別的 [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))
函數：

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```

在 Java 15 中，出現了 [text blocks](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)。
有一件事要記住：如果您列印多行字串並且三引號位於下一行，則會多出一個空行：

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```

輸出：

<img src="/img/java-15-multiline-output.png" alt="Java 15 multiline output" width="700" style={{verticalAlign: 'middle'}}/>

如果您將三引號放在與最後一個單詞相同的行上，則這種行為上的差異就會消失。

在 Kotlin 中，您可以使用新行上的引號格式化您的行，並且輸出中不會有多餘的空行。
任何行的最左側字元都標識該行的開頭。 與 Java 的不同之處在於 Java 自動
修剪縮進，而在 Kotlin 中，您應該明確地執行此操作：

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

輸出：

<img src="/img/kotlin-multiline-output.png" alt="Kotlin multiline output" width="700" style={{verticalAlign: 'middle'}}/>

要有多餘的空行，您應該明確地將此空行添加到您的多行字串中。

在 Kotlin 中，您還可以使用 [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函數來自定義縮進：

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

了解更多關於 [multiline strings (multiline strings)](coding-conventions#strings) 的資訊。

## 接下來是什麼？

* 瀏覽其他 [Kotlin idioms (Kotlin 慣用語)](idioms)。
* 了解如何使用以下方式將現有的 Java 程式碼轉換為 Kotlin
  [Java to Kotlin converter (Java to Kotlin 轉換器)](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)。

如果您有喜歡的慣用語，我們邀請您透過發送 pull request 來分享它。