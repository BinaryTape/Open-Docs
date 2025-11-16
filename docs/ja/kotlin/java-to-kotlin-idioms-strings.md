[//]: # (title: JavaとKotlinの文字列)

<web-summary>Javaの`String`からKotlinの`String`への移行方法を学びましょう。このガイドでは、Javaの`StringBuilder`、文字列の連結と分割、複数行文字列、ストリーム、その他トピックについて解説します。</web-summary>

このガイドでは、JavaとKotlinで文字列の一般的なタスクを実行する方法の例を説明します。JavaからKotlinへの移行を支援し、Kotlinらしいコードを書くのに役立ちます。

## 文字列を連結する

Javaでは、次のように実行できます。

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

Kotlinでは、変数名の前にドル記号 (` を使用して、その変数の値を文字列に埋め込みます。

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

`${name.length}` のように、複雑な式の値を中括弧で囲むことで埋め込むことができます。
詳細については、[文字列テンプレート](strings.md#string-templates)を参照してください。

## 文字列を構築する

Javaでは、[`StringBuilder`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html)を使用できます。

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

Kotlinでは、[`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) を使用します。これは、文字列を構築するロジックをラムダ引数として受け取る[インライン関数](inline-functions.md)です。

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

内部的には、`buildString` はJavaと同じ `StringBuilder` クラスを使用しており、[ラムダ](lambdas.md#function-literals-with-receiver)内部の暗黙的な `this` を介してそれにアクセスします。

[ラムダのコーディング規約](coding-conventions.md#lambdas)について詳しく学ぶ。

## コレクションアイテムから文字列を作成する

Javaでは、[Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)を使用して、アイテムをフィルタリングし、マップし、その後収集します。

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

Kotlinでは、KotlinがすべてのListに対して定義している[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html)関数を使用します。

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

> Javaでは、区切り文字とそれに続く項目の間にスペースを入れたい場合、区切り文字に明示的にスペースを追加する必要があります。
>
{style="note"}

[`joinToString()`](collection-transformations.md#string-representation)の使用法について詳しく学ぶ。

## 文字列が空白の場合にデフォルト値を設定する

Javaでは、[三項演算子](https://en.wikipedia.org/wiki/%3F:)を使用できます。

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

Kotlinは、デフォルト値を引数として受け取るインライン関数[`ifBlank()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)を提供します。

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

## 文字列の先頭と末尾の文字を置換する

Javaでは、[`replaceAll()`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String))関数を使用できます。
この場合の`replaceAll()`関数は、正規表現`^##`と`##$`を受け入れ、それぞれ`##`で始まり`##`で終わる文字列を定義します。

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

Kotlinでは、文字列の区切り文字`##`を指定して[`removeSurrounding()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html)関数を使用します。

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

## 出現箇所を置換する

Javaでは、[`Pattern`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)および[`Matcher`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html)クラスを使用して、例えば一部のデータを難読化することができます。

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

Kotlinでは、正規表現の操作を簡素化する[`Regex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)クラスを使用します。
さらに、[複数行文字列](strings.md#multiline-strings)を使用して、バックスラッシュの数を減らすことで正規表現パターンを簡素化できます。

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

## 文字列を分割する

Javaでピリオド文字 (`.`) で文字列を分割するには、エスケープ (`\\`) を使用する必要があります。
これは、`String`クラスの[`split()`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String))関数が正規表現を引数として受け入れるために発生します。

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

Kotlinでは、入力パラメータとしてデリミタの可変引数を受け入れるKotlin関数[`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)を使用します。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

正規表現で分割する必要がある場合は、`Regex`をパラメータとして受け入れるオーバーロードされた`split()`バージョンを使用します。

## 部分文字列を取得する

Javaでは、[`substring()`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int))関数を使用できます。これは、部分文字列を開始する文字の包含的な開始インデックスを受け入れます。
この文字の後に部分文字列を取得するには、インデックスをインクリメントする必要があります。

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

Kotlinでは、[`substringAfter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html)関数を使用するため、部分文字列を取得したい文字のインデックスを計算する必要はありません。

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

さらに、文字の最後の出現箇所の後に部分文字列を取得することもできます。

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

## 複数行文字列を使用する

Java 15より前では、複数行文字列を作成する方法がいくつかありました。例えば、`String`クラスの[`join()`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))関数を使用する方法です。

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

Java 15では、[テキストブロック](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)が登場しました。覚えておくべきことの1つは、複数行文字列を出力する際に、トリプルクォートが次の行にあると、余分な空行が追加されることです。

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```
{id="join-strings-15-java"}

出力:

![Java 15 multiline output](java-15-multiline-output.png){width=700}

トリプルクォートを最後の単語と同じ行に配置すると、この動作の違いはなくなります。

Kotlinでは、引用符を改行して行をフォーマットできますが、出力に余分な空行は追加されません。
行の最も左にある文字が行の開始を識別します。Javaとの違いは、Javaが自動的にインデントをトリムするのに対し、Kotlinでは明示的に行う必要があることです。

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

出力:

![Kotlin multiline output](kotlin-multiline-output.png){width=700}

余分な空行を含めるには、この空行を複数行文字列に明示的に追加する必要があります。

Kotlinでは、[`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html)関数を使用してインデントをカスタマイズすることもできます。

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

[複数行文字列](coding-conventions.md#strings)について詳しく学ぶ。

## 次のステップ

* その他の[Kotlinイディオム](idioms.md)を確認してください。
* [Java to Kotlin変換ツール](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)を使用して、既存のJavaコードをKotlinに変換する方法を学びます。

お気に入りのイディオムがあれば、プルリクエストを送って共有してください。