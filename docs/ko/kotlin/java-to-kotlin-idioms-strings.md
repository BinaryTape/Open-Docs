---
title: "Java와 Kotlin의 문자열"
description: "Java String에서 Kotlin String으로 마이그레이션하는 방법을 알아봅니다. 이 가이드에서는 Java StringBuilder, 문자열 연결 및 문자열 분할, 여러 줄 문자열, 스트림 및 기타 주제를 다룹니다."
---
이 가이드에서는 Java 및 Kotlin에서 문자열로 일반적인 작업을 수행하는 방법에 대한 예제를 제공합니다.
Java에서 Kotlin으로 마이그레이션하고 Kotlin 방식에 맞게 코드를 작성하는 데 도움이 될 것입니다.

## 문자열 연결

Java에서는 다음과 같은 방식으로 수행할 수 있습니다.

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```

Kotlin에서는 달러 기호(`$`)를 변수 이름 앞에 사용하여 해당 변수의 값을 문자열에 삽입할 수 있습니다.

```kotlin
fun main() {

    // Kotlin
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")

}
```

`${name.length}`와 같이 중괄호로 묶어 복잡한 표현식의 값을 삽입할 수 있습니다.
자세한 내용은 [문자열 템플릿](strings#string-templates)을 참조하십시오.

## 문자열 빌드

Java에서는 [StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html)를 사용할 수 있습니다.

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

Kotlin에서는 문자열을 구성하는 로직을 람다 인수로 사용하는 [inline function](inline-functions)인 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html)을 사용합니다.

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

내부적으로 `buildString`은 Java와 동일한 `StringBuilder` 클래스를 사용하며 [lambda](lambdas#function-literals-with-receiver) 내에서 암시적 `this`를 통해 액세스합니다.

자세한 내용은 [람다 코딩 규칙](coding-conventions#lambdas)을 참조하십시오.

## 컬렉션 항목에서 문자열 만들기

Java에서는 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)를 사용하여 항목을 필터링, 매핑한 다음 수집합니다.

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

Kotlin에서는 Kotlin이 모든 List에 대해 정의하는 함수인 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 함수를 사용합니다.

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
Java에서는 구분 기호와 다음 항목 사이에 공백을 넣으려면 구분 기호에 명시적으로 공백을 추가해야 합니다.

:::

자세한 내용은 [joinToString()](collection-transformations#string-representation) 사용법을 참조하십시오.

## 문자열이 비어 있는 경우 기본값 설정

Java에서는 [삼항 연산자](https://en.wikipedia.org/wiki/%3F:)를 사용할 수 있습니다.

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

Kotlin은 기본값을 인수로 받는 inline function [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)를 제공합니다.

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

## 문자열의 시작과 끝에 있는 문자 바꾸기

Java에서는 [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String)) 함수를 사용할 수 있습니다.
이 경우 `replaceAll()` 함수는 각각 `##`로 시작하고 끝나는 문자열을 정의하는 정규식 `^##` 및 `##`를 허용합니다.

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```

Kotlin에서는 문자열 구분 기호 `##`와 함께 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html) 함수를 사용합니다.

```kotlin
fun main() {

    // Kotlin
    val input = "##place##holder##"
    val result = input.removeSurrounding("##")
    println(result)

}
```

## occurrences 바꾸기

Java에서는 일부 데이터를 난독화하기 위해 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html) 및 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 클래스를 사용할 수 있습니다.

```java
// Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it `->` "xxx");
System.out.println("Initial input: '" + input + "'");
System.out.println("Anonymized input: '" + replacementResult + "'");
```

Kotlin에서는 정규식 작업을 간소화하는 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 클래스를 사용합니다.
또한 백슬래시 수를 줄여 정규식 패턴을 간소화하기 위해 [multiline strings](strings#multiline-strings)를 사용합니다.

```kotlin
fun main() {

    // Kotlin
    val regex = Regex("""\w*\d+\\w*""") // multiline string
    val input = "login: Pokemon5, password: 1q2w3e4r5t"
    val replacementResult = regex.replace(input, replacement = "xxx")
    println("Initial input: '$input'")
    println("Anonymized input: '$replacementResult'")

}
```

## 문자열 분할

Java에서 마침표 문자(`.`)로 문자열을 분할하려면 쉴딩(`\\`)을 사용해야 합니다.
이는 `String` 클래스의 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String)) 함수가 정규식을 인수로 허용하기 때문에 발생합니다.

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```

Kotlin에서는 입력 매개변수로 구분 기호의 varargs를 허용하는 Kotlin 함수 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)을 사용합니다.

```kotlin
fun main() {

    // Kotlin
    println("Sometimes.text.should.be.split".split("."))

}
```

정규식으로 분할해야 하는 경우 `Regex`를 매개변수로 허용하는 오버로드된 `split()` 버전을 사용합니다.

## 부분 문자열 가져오기

Java에서는 부분 문자열을 가져오기 시작할 문자의 포함 시작 인덱스를 허용하는 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 함수를 사용할 수 있습니다.
이 문자 뒤에 부분 문자열을 가져오려면 인덱스를 증가시켜야 합니다.

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```

Kotlin에서는 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 함수를 사용하며 부분 문자열을 가져올 문자 인덱스를 계산할 필요가 없습니다.

```kotlin
fun main() {

    // Kotlin
    val input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
    val answer = input.substringAfter("?")
    println(answer)

}
```

또한 문자의 마지막 occurrence 뒤에 부분 문자열을 가져올 수 있습니다.

```kotlin
fun main() {

    // Kotlin
    val input = "To be, or not to be, that is the question."
    val question = input.substringAfterLast(",")
    println(question)

}
```

## multiline strings 사용

Java 15 이전에는 여러 줄 문자열을 만드는 방법이 여러 가지 있었습니다. 예를 들어 `String` 클래스의 [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...)) 함수를 사용하는 것입니다.

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```

Java 15에서는 [text blocks](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)가 나타났습니다.
기억해야 할 사항이 한 가지 있습니다. 여러 줄 문자열을 인쇄하고 삼중 따옴표가 다음 줄에 있으면 추가 빈 줄이 표시됩니다.

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```

출력:

<img src="/img/java-15-multiline-output.png" alt="Java 15 multiline output" width="700" style={{verticalAlign: 'middle'}}/>

마지막 단어와 같은 줄에 삼중 따옴표를 넣으면 이러한 동작 차이가 사라집니다.

Kotlin에서는 새 줄에 따옴표를 사용하여 줄 서식을 지정할 수 있으며 출력에 추가 빈 줄이 표시되지 않습니다.
줄의 가장 왼쪽 문자는 줄의 시작을 식별합니다. Java와의 차이점은 Java가 자동으로 들여쓰기를 트리밍하고 Kotlin에서는 명시적으로 수행해야 한다는 것입니다.

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

출력:

<img src="/img/kotlin-multiline-output.png" alt="Kotlin multiline output" width="700" style={{verticalAlign: 'middle'}}/>

추가 빈 줄을 표시하려면 이 빈 줄을 여러 줄 문자열에 명시적으로 추가해야 합니다.

Kotlin에서는 [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 함수를 사용하여 들여쓰기를 사용자 지정할 수도 있습니다.

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

자세한 내용은 [multiline strings](coding-conventions#strings)를 참조하십시오.

## 다음 단계

* 다른 [Kotlin idioms](idioms)를 살펴보십시오.
* [Java to Kotlin converter](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)를 사용하여 기존 Java 코드를 Kotlin으로 변환하는 방법을 알아보십시오.

좋아하는 idiom이 있는 경우 풀 리퀘스트를 보내 공유해 주시기 바랍니다.