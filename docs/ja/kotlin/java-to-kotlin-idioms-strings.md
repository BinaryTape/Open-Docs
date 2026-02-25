[//]: # (title: Java と Kotlin の文字列)

<web-summary>Java の String から Kotlin の String へ移行する方法を学びます。このガイドでは、Java の StringBuilder、文字列の結合と分割、マルチライン文字列、ストリーム、およびその他のトピックについて説明します。</web-summary>

このガイドには、Java と Kotlin で文字列に関する一般的なタスクを実行する方法の例が含まれています。
Java から Kotlin への移行や、Kotlin らしい方法でコードを記述するのに役立ちます。

## 文字列を結合する

Java では、次のように行います。

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

Kotlin では、変数名の前にドル記号 (`$`) を使用して、その変数の値を文字列に補完（補間）します。

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

`${name.length}` のように、複雑な式を波括弧で囲むことで、その式の値を補完することができます。
詳細は [文字列テンプレート](strings.md#string-templates) を参照してください。

## 文字列を構築する

Java では、[StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html) を使用できます。

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

Kotlin では、[buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) を使用します。これは、文字列を構築するためのロジックをラムダ引数として受け取る [インライン関数](inline-functions.md) です。

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

内部的には、`buildString` は Java と同じ `StringBuilder` クラスを使用しており、[ラムダ](lambdas.md#function-literals-with-receiver) 内部の暗黙的な `this` を介してアクセスします。

[ラムダのコーディング規約](coding-conventions.md#lambdas) について詳しく学ぶ。

## コレクションの要素から文字列を作成する

Java では、[Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html) を使用して、フィルタリング、マッピングを行い、その後要素を収集します。

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

Kotlin では、Kotlin がすべての List に対して定義している [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 関数を使用します。

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

> Java では、区切り文字とそれに続く要素の間にスペースを入れたい場合、区切り文字に明示的にスペースを追加する必要があります。
>
{style="note"}

[joinToString()](collection-transformations.md#string-representation) の使い方について詳しく学ぶ。

## 文字列が空白の場合にデフォルト値を設定する

Java では、[三項演算子](https://ja.wikipedia.org/wiki/%3F:) を使用できます。

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

Kotlin は、デフォルト値を引数として受け取るインライン関数 [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html) を提供しています。

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

Java では、[replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String)) 関数を使用できます。
この場合の `replaceAll()` 関数は、それぞれ `##` で始まる文字列と終わる文字列を定義する正規表現 `^##` と `##$` を受け取ります。

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

Kotlin では、文字列のデリミタ `##` を指定して [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html) 関数を使用します。

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

Java では、例えば一部のデータを難読化するために、[Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html) クラスと [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) クラスを使用できます。

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

Kotlin では、正規表現の扱いを簡素化する [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) クラスを使用します。
さらに、[マルチライン文字列](strings.md#multiline-strings) を使用すると、バックスラッシュの数を減らして正規表現パターンを簡素化できます。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val regex = Regex("""\w*\d+\w*""") // マルチライン文字列
    val input = "login: Pokemon5, password: 1q2w3e4r5t"
    val replacementResult = regex.replace(input, replacement = "xxx")
    println("Initial input: '$input'")
    println("Anonymized input: '$replacementResult'")
//sampleEnd
}
```
{kotlin-runnable="true" id="replace-occurrences-kotlin"}

## 文字列を分割する

Java で、ピリオド文字 (`.`) を使用して文字列を分割するには、エスケープ (`\\`) を使用する必要があります。
これは、`String` クラスの [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String)) 関数が引数として正規表現を受け取るためです。

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

Kotlin では、区切り文字の可変長引数を入力パラメータとして受け取る Kotlin の [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html) 関数を使用します。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

正規表現で分割する必要がある場合は、`Regex` をパラメータとして受け取るオーバーロードされた `split()` バージョンを使用してください。

## 部分文字列を取得する

Java では、[substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 関数を使用できます。これは、部分文字列の取得を開始する文字のインデックス（そのインデックスを含む）を受け取ります。
特定の文字の後の部分文字列を取得するには、インデックスをインクリメントする必要があります。

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

Kotlin では、[substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 関数を使用するため、部分文字列を取得したい文字のインデックスを計算する必要はありません。

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

さらに、文字が最後に出現した後の部分文字列を取得することもできます。

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

## マルチライン文字列を使用する

Java 15 より前は、マルチライン文字列を作成する方法がいくつかありました。例えば、`String` クラスの [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...)) 関数を使用する方法です。

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

Java 15 では、[テキストブロック](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html) が登場しました。
1 つ注意点があります。マルチライン文字列を出力し、三重引用符が次の行にある場合、余分な空行が含まれます。

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

三重引用符を最後の単語と同じ行に置くと、この動作の違いはなくなります。

Kotlin では、引用符を新しい行に置いて行をフォーマットしても、出力に余分な空行は含まれません。
各行の最も左側の文字が、その行の開始位置を特定します。Java との違いは、Java はインデントを自動的にトリミングしますが、Kotlin では明示的に行う必要がある点です。

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

余分な空行を入れたい場合は、マルチライン文字列にその空行を明示的に追加する必要があります。

Kotlin では、[trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 関数を使用してインデントをカスタマイズすることもできます。

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

[マルチライン文字列](coding-conventions.md#strings) について詳しく学ぶ。

## 次は？

* 他の [Kotlin の慣用句 (idioms)](idioms.md) を見る。
* [Java から Kotlin への変換ツール](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin) を使用して、既存の Java コードを Kotlin に変換する方法を学ぶ。

お気に入りの慣用句があれば、プルリクエストを送って共有してください。