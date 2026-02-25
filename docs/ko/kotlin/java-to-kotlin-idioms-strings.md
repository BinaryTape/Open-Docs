[//]: # (title: Java와 Kotlin의 문자열)

<web-summary>Java String에서 Kotlin String으로 마이그레이션하는 방법을 배워보세요. 이 가이드는 Java StringBuilder, 문자열 결합 및 분리, 멀티라인 문자열, 스트림 및 기타 주제를 다룹니다.</web-summary>

이 가이드는 Java와 Kotlin에서 문자열을 사용하는 일반적인 작업들에 대한 예제를 포함하고 있습니다.
이 가이드를 통해 Java에서 Kotlin으로 마이그레이션하고, Kotlin다운 방식(authentically Kotlin way)으로 코드를 작성하는 데 도움을 얻을 수 있습니다.

## 문자열 결합 (Concatenate strings)

Java에서는 다음과 같은 방식으로 문자열을 결합할 수 있습니다:

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

Kotlin에서는 변수 이름 앞에 달러 기호(`$`)를 사용하여 변수의 값을 문자열에 보간(interpolate)합니다:

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

`${name.length}`와 같이 복잡한 식의 값을 보간하려면 중괄호로 감싸면 됩니다.
자세한 내용은 [문자열 템플릿(string templates)](strings.md#string-templates)을 참조하세요.

## 문자열 빌드 (Build a string)

Java에서는 [StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html)를 사용할 수 있습니다:

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

Kotlin에서는 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html)을 사용하세요. 이 함수는 문자열을 구성하는 로직을 람다 인자로 받는 [인라인 함수(inline function)](inline-functions.md)입니다:

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

내부적으로 `buildString`은 Java와 동일한 `StringBuilder` 클래스를 사용하며, [람다(lambda)](lambdas.md#function-literals-with-receiver) 내부에서 암시적인 `this`를 통해 이에 접근할 수 있습니다.

[람다 코딩 컨벤션](coding-conventions.md#lambdas)에 대해 더 자세히 알아보세요.

## 컬렉션 항목으로 문자열 생성 (Create a string from collection items)

Java에서는 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)를 사용하여 필터링, 매핑한 다음 항목들을 수집합니다:

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

Kotlin에서는 모든 List에 정의되어 있는 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 함수를 사용합니다:

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

> Java에서는 구분자(delimiter)와 다음 항목 사이에 공백을 넣으려면 구분자에 공백을 명시적으로 추가해야 합니다.
>
{style="note"}

[joinToString()](collection-transformations.md#string-representation) 사용법에 대해 더 자세히 알아보세요.

## 문자열이 비어있는 경우 기본값 설정 (Set default value if the string is blank)

Java에서는 [삼항 연산자(ternary operator)](https://en.wikipedia.org/wiki/%3F:)를 사용할 수 있습니다:

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

Kotlin은 기본값을 인자로 받는 [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html) 인라인 함수를 제공합니다:

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

## 문자열의 시작과 끝에서 문자 교체 (Replace characters at the beginning and end of a string)

Java에서는 [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String)) 함수를 사용할 수 있습니다.
이 경우 `replaceAll()` 함수는 각각 `##`로 시작하고 끝나는 문자열을 정의하는 정규식 `^##`와 `##$`를 인자로 받습니다.

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

Kotlin에서는 문자열 구분자 `##`와 함께 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html) 함수를 사용합니다:

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

## 일치하는 항목 교체 (Replace occurrences)

Java에서는 예를 들어 일부 데이터를 난독화하기 위해 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)과 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 클래스를 사용할 수 있습니다:

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

Kotlin에서는 정규식 작업을 간소화해 주는 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 클래스를 사용합니다.
또한, [멀티라인 문자열(multiline strings)](strings.md#multiline-strings)을 사용하면 백슬래시 개수를 줄여 정규식 패턴을 더 간단하게 작성할 수 있습니다:

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

## 문자열 분리 (Split a string)

Java에서 마침표 문자(`.`)를 기준으로 문자열을 분리하려면 이스케이프 처리(`\\`)를 해야 합니다.
이는 `String` 클래스의 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String)) 함수가 정규식을 인자로 받기 때문입니다:

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

Kotlin에서는 구분자를 가변 인자(varargs)로 받는 Kotlin 함수 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html)을 사용합니다:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

정규식으로 분리해야 하는 경우, `Regex`를 매개변수로 받는 오버로드된 `split()` 버전을 사용하세요.

## 부분 문자열 추출 (Take a substring)

Java에서는 부분 문자열을 추출하기 시작할 문자의 인덱스(포함)를 인자로 받는 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 함수를 사용할 수 있습니다.
특정 문자 이후의 부분 문자열을 가져오려면 해당 인덱스를 1 증가시켜야 합니다:

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

Kotlin에서는 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 함수를 사용하므로, 부분 문자열을 추출하려는 기준 문자의 인덱스를 직접 계산할 필요가 없습니다:

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

또한, 문자의 마지막 일치 항목 이후의 부분 문자열을 추출할 수도 있습니다:

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

## 멀티라인 문자열 사용 (Use multiline strings)

Java 15 이전에는 멀티라인 문자열을 만드는 몇 가지 방법이 있었습니다. 예를 들어 `String` 클래스의 [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...)) 함수를 사용하는 방식입니다:

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

Java 15에서는 [텍스트 블록(text blocks)](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)이 도입되었습니다.
한 가지 유의할 점은, 멀티라인 문자열을 출력할 때 닫는 삼중 따옴표가 다음 줄에 있으면 빈 줄이 추가로 생성된다는 것입니다:

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```
{id="join-strings-15-java"}

출력 결과:

![Java 15 multiline output](java-15-multiline-output.png){width=700}

마지막 단어와 같은 줄에 삼중 따옴표를 두면 이러한 동작 차이가 사라집니다.

Kotlin에서는 닫는 따옴표를 새 줄에 두어 줄을 맞출 수 있으며, 출력 시 빈 줄이 추가로 생성되지 않습니다.
모든 줄의 가장 왼쪽 문자가 줄의 시작을 식별합니다. Java와의 차이점은 Java는 자동으로 들여쓰기를 제거(trim)하지만, Kotlin에서는 명시적으로 제거해야 한다는 점입니다:

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

출력 결과:

![Kotlin multiline output](kotlin-multiline-output.png){width=700}

빈 줄을 추가하려면 멀티라인 문자열에 해당 빈 줄을 명시적으로 추가해야 합니다.

Kotlin에서는 [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 함수를 사용하여 들여쓰기를 커스텀할 수도 있습니다:

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

[멀티라인 문자열](coding-conventions.md#strings)에 대해 더 자세히 알아보세요.

## 다음 단계

* 다른 [Kotlin 관용구(idioms)](idioms.md)를 살펴보세요.
* [Java to Kotlin 변환기(converter)](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)를 사용하여 기존 Java 코드를 Kotlin으로 변환하는 방법을 배워보세요.

좋아하는 관용구가 있다면 풀 리퀘스트(pull request)를 보내 공유해 주세요.