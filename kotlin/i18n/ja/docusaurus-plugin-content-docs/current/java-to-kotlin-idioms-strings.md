---
title: JavaとKotlinの文字列
description: JavaのStringからKotlinのStringへの移行方法を学びます。このガイドでは、JavaのStringBuilder、文字列連結と分割、複数行文字列、ストリーム、およびその他のトピックについて説明します。
---
このガイドでは、JavaとKotlinで文字列を扱う一般的なタスクを実行する方法の例を紹介します。
これは、JavaからKotlinへの移行と、本格的なKotlinの方法でのコード作成に役立ちます。

## 文字列の連結

Javaでは、次の方法でこれを行うことができます。

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```

Kotlinでは、ドル記号（`$`）を変数名の前に使用して、この変数の値を文字列に[埋め込む](strings#string-templates)ことができます。

```kotlin
fun main() {

    // Kotlin
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")

}
```

`${name.length}`のように、複雑な式を波括弧で囲むことで、その値を埋め込むことができます。
詳細については、[文字列テンプレート](strings#string-templates)を参照してください。

## 文字列の構築

Javaでは、[StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html)を使用できます。

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

Kotlinでは、[buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html)を使用します。
これは、文字列を構築するロジックをラムダ引数として取る[インライン関数](inline-functions)です。

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

内部的には、`buildString`はJavaと同じ`StringBuilder`クラスを使用しており、[ラムダ](lambdas#function-literals-with-receiver)内の暗黙的な`this`を介してアクセスします。

[ラムダのコーディング規約](coding-conventions#lambdas)の詳細をご覧ください。

## コレクションアイテムから文字列を作成する

Javaでは、[Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)を使用して、アイテムをフィルタリング、マップ、および収集します。

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

Kotlinでは、[joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html)関数を使用します。
この関数は、Kotlinがすべての List に対して定義しています。

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
Javaでは、区切り文字とそれに続くアイテムの間にスペースが必要な場合は、区切り文字に明示的にスペースを追加する必要があります。

:::

[joinToString()](collection-transformations#string-representation)の使用方法の詳細をご覧ください。

## 文字列が空の場合のデフォルト値を設定する

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

Kotlinには、デフォルト値を引数として受け取るインライン関数[ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)があります。

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

## 文字列の先頭と末尾の文字を置換する

Javaでは、[replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String))関数を使用できます。
この場合の`replaceAll()`関数は、それぞれ`##`で始まる文字列と`##`で終わる文字列を定義する正規表現`^##`と`##`を受け入れます。

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```

Kotlinでは、文字列区切り文字`##`を持つ[removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html)関数を使用します。

```kotlin
fun main() {

    // Kotlin
    val input = "##place##holder##"
    val result = input.removeSurrounding("##")
    println(result)

}
```

## オカレンスの置換

Javaでは、[Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)クラスと[Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html)クラスを使用して、たとえば、一部のデータを難読化することができます。

```java
// Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it `->` "xxx");
System.out.println("Initial input: '" + input + "'");
System.out.println("Anonymized input: '" + replacementResult + "'");
```

Kotlinでは、正規表現の操作を簡素化する[Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)クラスを使用します。
さらに、バックスラッシュの数を減らすことによって正規表現パターンを簡素化するために、[複数行文字列](strings#multiline-strings)を使用します。

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

## 文字列の分割

Javaでは、ピリオド文字（`.`）で文字列を分割するには、シールド（`\\`）を使用する必要があります。
これは、`String`クラスの[split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String))関数が正規表現を引数として受け入れるために発生します。

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```

Kotlinでは、Kotlin関数[split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)を使用します。
この関数は、区切り文字の可変長引数 (varargs) を入力パラメータとして受け入れます。

```kotlin
fun main() {

    // Kotlin
    println("Sometimes.text.should.be.split".split("."))

}
```

正規表現で分割する必要がある場合は、`Regex`をパラメータとして受け入れるオーバーロードされた`split()`バージョンを使用します。

## 部分文字列を取得する

Javaでは、[substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int))関数を使用できます。
この関数は、部分文字列の取得を開始する文字の、包括的な開始インデックスを受け入れます。
この文字の後の部分文字列を取得するには、インデックスをインクリメントする必要があります。

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```

Kotlinでは、[substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html)関数を使用します。
部分文字列を取得する文字のインデックスを計算する必要はありません。

```kotlin
fun main() {

    // Kotlin
    val input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
    val answer = input.substringAfter("?")
    println(answer)

}
```

さらに、文字の最後のオカレンスの後に部分文字列を取得できます。

```kotlin
fun main() {

    // Kotlin
    val input = "To be, or not to be, that is the question."
    val question = input.substringAfterLast(",")
    println(question)

}
```

## 複数行文字列の使用

Java 15より前は、複数行文字列を作成する方法がいくつかありました。たとえば、`String`クラスの[join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))関数を使用します。

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```

Java 15では、[テキストブロック](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)が登場しました。
覚えておくべきことが1つあります。複数行文字列を出力し、三重引用符が次の行にある場合、余分な空行ができます。

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```

出力：

<img src="/img/java-15-multiline-output.png" alt="Java 15 multiline output" width="700" style={{verticalAlign: 'middle'}}/>

最後の単語と同じ行に三重引用符を記述すると、この動作の違いはなくなります。

Kotlinでは、新しい行に引用符を付けて行をフォーマットでき、出力に余分な空行はありません。
任意の行の左端の文字は、行の先頭を識別します。Javaとの違いは、Javaが自動的にインデントをトリムするのに対し、Kotlinでは明示的に行う必要があることです。

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

出力：

<img src="/img/kotlin-multiline-output.png" alt="Kotlin multiline output" width="700" style={{verticalAlign: 'middle'}}/>

余分な空行が必要な場合は、この空行を複数行文字列に明示的に追加する必要があります。

Kotlinでは、[trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html)関数を使用してインデントをカスタマイズすることもできます。

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

[複数行文字列](coding-conventions#strings)の詳細をご覧ください。

## 次は何をしますか？

* 他の[Kotlinのイディオム](idioms)をご覧ください。
* [JavaからKotlinへのコンバーター](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)を使用して、既存のJavaコードをKotlinに変換する方法を学びます。

お気に入りのイディオムがある場合は、プルリクエストを送信して共有してください。