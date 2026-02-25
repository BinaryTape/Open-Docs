[//]: # (title: Java 與 Kotlin 中的字串)

<web-summary>了解如何從 Java String 遷移到 Kotlin String。本指南涵蓋 Java StringBuilder、字串連接與分割字串、多行字串、串流（stream）以及其他主題。</web-summary>

本指南包含如何在 Java 和 Kotlin 中執行典型字串任務的範例。它將幫助您從 Java 遷移到 Kotlin，並以正統的 Kotlin 方式編寫程式碼。

## 連接字串

在 Java 中，您可以透過以下方式完成：

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

在 Kotlin 中，在變數名稱前使用錢字號 (`$`) 即可將此變數的值插值（interpolate）到字串中：

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

您可以透過用花括號將複雜的運算式括起來，來插值該運算式的值，例如 `${name.length}`。
若要了解更多資訊，請參閱[字串範本](strings.md#string-templates)。

## 組建字串

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

在 Kotlin 中，使用 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) – 
這是一個[內嵌函式](inline-functions.md)，它接受一個用來建構字串的邏輯作為 Lambda 引數：

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

在底層，`buildString` 使用與 Java 相同的 `StringBuilder` 類別，您可以在 [Lambda](lambdas.md#function-literals-with-receiver) 內部透過隱式的 `this` 存取它。

進一步了解 [Lambda 編碼慣例](coding-conventions.md#lambdas)。

## 從集合項目建立字串

在 Java 中，您使用 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html) 
來過濾、映射，然後收集項目：

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

在 Kotlin 中，使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函式，這是 Kotlin 為每個 List 定義的：

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

> 在 Java 中，如果您希望分隔符號與後續項目之間有空格，您需要在分隔符號中明確添加空格。
>
{style="note"}

進一步了解 [joinToString()](collection-transformations.md#string-representation) 的用法。

## 如果字串為空則設定預設值

在 Java 中，您可以使用[三元運算子](https://en.wikipedia.org/wiki/%3F:)：

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

Kotlin 提供了內嵌函式 [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)，它接受預設值作為引數：

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

## 替換字串開頭和結尾的字元

在 Java 中，您可以使用 [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String)) 函式。
在此案例中，`replaceAll()` 函式接受正規表示式 `^##` 和 `##$`，分別定義以 `##` 開頭和結尾的字串：

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

在 Kotlin 中，使用 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html) 函式並配合字串分隔符號 `##`：

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

## 替換出現之處

在 Java 中，您可以使用 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html) 和 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 類別，例如用來混淆某些資料：

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

在 Kotlin 中，您使用 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 類別，它簡化了正規表示式的工作。
此外，使用[多行字串](strings.md#multiline-strings)可以透過減少反斜線的數量來簡化正規表示式模式：

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

## 分割字串

在 Java 中，要使用點字元 (`.`) 分割字串，您需要使用轉義（`\\`）。
這是因為 `String` 類別的 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String)) 函式接受正規表示式作為引數：

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

在 Kotlin 中，使用 Kotlin 函式 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)，它接受分隔符號的可變參數作為輸入參數：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

如果您需要使用正規表示式進行分割，請使用接受 `Regex` 作為參數的 `split()` 多載版本。

## 取得子字串

在 Java 中，您可以使用 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 函式，它接受一個包含起始字元的起始索引，從該處開始取得子字串。
若要取得該字元之後的子字串，您需要增加索引值：

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

在 Kotlin 中，您使用 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 函式，且不需要計算您想要取得其後子字串的字元索引：

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

此外，您可以取得某個字元最後一次出現之後的子字串：

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

## 使用多行字串

在 Java 15 之前，有多種建立多行字串的方法。例如，使用 `String` 類別的 [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...)) 函式：

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

在 Java 15 中，出現了[文字區塊](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)。 
有一點需要記住：如果您列印一個多行字串，且三個引號位於下一行，則會多出一個空行：

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```
{id="join-strings-15-java"}

輸出結果：

![Java 15 多行輸出](java-15-multiline-output.png){width=700}

如果您將三個引號放在與最後一個單字相同的行，則此行為差異就會消失。

在 Kotlin 中，您可以將引號放在新行來格式化您的行，且輸出中不會有多餘的空行。
任何一行的最左側字元標識了該行的開始。與 Java 的區別在於 Java 會自動修剪縮排，而在 Kotlin 中您應該明確地執行此操作：

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

輸出結果：

![Kotlin 多行輸出](kotlin-multiline-output.png){width=700}

若要擁有額外的空行，您應該在多行字串中明確添加此空行。

在 Kotlin 中，您還可以使用 [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函式來定義縮排：

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

進一步了解[多行字串](coding-conventions.md#strings)。

## 下一步？

* 瀏覽其他 [Kotlin 慣用語](idioms.md)。
* 了解如何使用 [Java 到 Kotlin 轉換器](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)將現有的 Java 程式碼轉換為 Kotlin。

如果您有喜愛的慣用語，我們誠摯邀請您透過發送提取要求來分享它。