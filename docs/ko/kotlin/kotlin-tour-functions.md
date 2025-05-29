[//]: # (title: 함수)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">컬렉션</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5.svg" width="20" alt="Fifth step" /> <strong>함수</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">널 안정성</a></p>
</tldr>

Kotlin에서는 `fun` 키워드를 사용하여 자신만의 함수를 선언할 수 있습니다.

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-demo"}

Kotlin에서:

*   함수 매개변수는 괄호 `()` 안에 작성합니다.
*   각 매개변수는 타입을 명시해야 하며, 여러 매개변수는 쉼표 `,`로 구분해야 합니다.
*   반환 타입은 함수의 괄호 `()` 뒤에 콜론 `:`으로 구분하여 작성합니다.
*   함수의 본문은 중괄호 `{}` 안에 작성합니다.
*   `return` 키워드는 함수에서 빠져나가거나 값을 반환할 때 사용합니다.

> 함수가 유용한 값을 반환하지 않는 경우, 반환 타입과 `return` 키워드를 생략할 수 있습니다. 자세한 내용은 [반환 값이 없는 함수](#functions-without-return)에서 확인할 수 있습니다.
>
{style="note"}

다음 예시에서:

*   `x`와 `y`는 함수 매개변수입니다.
*   `x`와 `y`는 `Int` 타입입니다.
*   함수의 반환 타입은 `Int`입니다.
*   이 함수는 호출될 때 `x`와 `y`의 합을 반환합니다.

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function"}

> [코딩 컨벤션](coding-conventions.md#function-names)에서 함수 이름을 소문자로 시작하고 언더스코어 없이 카멜 케이스(camel case)를 사용할 것을 권장합니다.
>
{style="note"}

## 명명된 인수

간결한 코드를 위해 함수를 호출할 때 매개변수 이름을 포함할 필요는 없습니다. 하지만 매개변수 이름을 포함하면 코드를 더 쉽게 읽을 수 있습니다. 이를 **명명된 인수**를 사용한다고 합니다. 매개변수 이름을 포함하는 경우, 매개변수를 어떤 순서로든 작성할 수 있습니다.

> 다음 예시에서는 [문자열 템플릿](strings.md#string-templates)(`` ` ``)을 사용하여
> 매개변수 값에 접근하고, `String` 타입으로 변환한 다음, 문자열로 연결하여 출력하는 데 사용됩니다.
>
{style="tip"}

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // Uses named arguments with swapped parameter order
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-named-arguments-function"}

## 기본 매개변수 값

함수 매개변수에 기본값을 정의할 수 있습니다. 기본값이 있는 매개변수는 함수 호출 시 생략할 수 있습니다. 기본값을 선언하려면 타입 뒤에 할당 연산자 `=`를 사용합니다:

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // Function called with both parameters
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // Function called only with message parameter
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> 모든 매개변수를 생략하는 대신 기본값이 있는 특정 매개변수를 건너뛸 수 있습니다. 하지만 첫 번째 생략된 매개변수 다음부터는 모든 후속 매개변수의 이름을 명시해야 합니다.
>
{style="note"}

## 반환 값이 없는 함수

함수가 유용한 값을 반환하지 않는 경우 반환 타입은 `Unit`입니다. `Unit`은 `Unit`이라는 하나의 값만 가진 타입입니다. 함수 본문에서 `Unit`이 반환된다고 명시적으로 선언할 필요가 없습니다. 이는 `return` 키워드를 사용하거나 반환 타입을 선언할 필요가 없음을 의미합니다:

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` or `return` is optional
}

fun main() {
    printMessage("Hello")
    // Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## 단일 표현식 함수

코드를 더 간결하게 만들려면 단일 표현식 함수를 사용할 수 있습니다. 예를 들어, `sum()` 함수는 다음과 같이 단축될 수 있습니다:

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-before"}

중괄호 `{}`를 제거하고 할당 연산자 `=`를 사용하여 함수 본문을 선언할 수 있습니다. 할당 연산자 `=`를 사용하면 Kotlin은 타입 추론(type inference)을 사용하므로 반환 타입도 생략할 수 있습니다. 그러면 `sum()` 함수는 한 줄로 바뀝니다:

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

하지만 다른 개발자들이 코드를 빠르게 이해할 수 있도록 하려면, 할당 연산자 `=`를 사용할 때도 반환 타입을 명시적으로 정의하는 것이 좋습니다.

> 함수 본문을 선언하기 위해 `{}` 중괄호를 사용하는 경우, `Unit` 타입이 아닌 한 반환 타입을 선언해야 합니다.
>
{style="note"}

## 함수에서의 조기 반환

함수 내의 코드가 특정 지점 이상으로 처리되는 것을 막으려면 `return` 키워드를 사용합니다. 이 예시는 `if`를 사용하여 조건 표현식이 참으로 판명되면 함수에서 조기에 반환합니다:

```kotlin
// A list of registered usernames
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// A list of registered emails
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // Early return if the username is already taken
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // Early return if the email is already registered
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // Proceed with the registration if the username and email are not taken
    registeredUsernames.add(username)
    registeredEmails.add(email)

    return "User registered successfully: $username"
}

fun main() {
    println(registerUser("john_doe", "newjohn@example.com"))
    // Username already taken. Please choose a different username.
    println(registerUser("new_user", "newuser@example.com"))
    // User registered successfully: new_user
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-early-return"}

## 함수 연습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

원의 반지름을 정수 형식으로 매개변수로 받아 해당 원의 면적을 출력하는 `circleArea`라는 함수를 작성하세요.

> 이 연습 문제에서는 `PI`를 통해 원주율 값에 접근할 수 있도록 패키지를 임포트합니다. 패키지 임포트에 대한 자세한 내용은 [패키지와 임포트](packages.md)를 참조하세요.
>
{style="tip"}

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-1"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-functions-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

이전 연습 문제의 `circleArea` 함수를 단일 표현식 함수로 다시 작성하세요.

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-2"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-functions-solution-2"}

### 연습 문제 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

주어진 시간(시, 분, 초) 간격을 초로 변환하는 함수가 있습니다. 대부분의 경우, 나머지 매개변수가 0인 동안 함수 매개변수를 하나 또는 두 개만 전달하면 됩니다. 코드를 더 쉽게 읽을 수 있도록 기본 매개변수 값과 명명된 인수를 사용하여 함수와 해당 함수를 호출하는 코드를 개선하세요.

|---|---|
```kotlin
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-3"}

|---|---|
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-functions-solution-3"}

## 람다 표현식

Kotlin은 람다 표현식을 사용하여 함수에 대해 훨씬 더 간결한 코드를 작성할 수 있도록 합니다.

예를 들어, 다음 `uppercaseString()` 함수는:

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

람다 표현식으로도 작성할 수 있습니다:

```kotlin
fun main() {
    val upperCaseString = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

람다 표현식은 처음에는 이해하기 어려울 수 있으니 자세히 살펴보겠습니다. 람다 표현식은 중괄호 `{}` 안에 작성합니다.

람다 표현식 내에서는 다음을 작성합니다:

*   매개변수 뒤에 `->`를 작성합니다.
*   `->` 뒤에 함수 본문을 작성합니다.

이전 예시에서:

*   `text`는 함수 매개변수입니다.
*   `text`는 `String` 타입입니다.
*   이 함수는 `text`에 호출된 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 함수의 결과를 반환합니다.
*   전체 람다 표현식은 할당 연산자 `=`를 사용하여 `upperCaseString` 변수에 할당됩니다.
*   람다 표현식은 `upperCaseString` 변수를 함수처럼 사용하고 `"hello"` 문자열을 매개변수로 사용하여 호출됩니다.
*   `println()` 함수는 결과를 출력합니다.

> 매개변수 없이 람다를 선언하는 경우, `->`를 사용할 필요가 없습니다. 예를 들어:
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

람다 표현식은 여러 가지 방식으로 사용될 수 있습니다. 다음을 할 수 있습니다:

*   [람다 표현식을 다른 함수의 매개변수로 전달](#pass-to-another-function)
*   [함수에서 람다 표현식 반환](#return-from-a-function)
*   [람다 표현식을 독립적으로 호출](#invoke-separately)

### 다른 함수에 전달

함수에 람다 표현식을 전달하는 것이 유용한 좋은 예시는 컬렉션에 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 함수를 사용하는 것입니다:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    val positives = numbers.filter ({ x -> x > 0 })
    
    val isNegative = { x: Int -> x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

`.filter()` 함수는 람다 표현식을 술어(predicate)로 받습니다:

*   `{ x -> x > 0 }`는 리스트의 각 요소를 받아 양수인 요소만 반환합니다.
*   `{ x -> x < 0 }`는 리스트의 각 요소를 받아 음수인 요소만 반환합니다.

이 예시는 람다 표현식을 함수에 전달하는 두 가지 방법을 보여줍니다:

*   양수에 대해 예시는 `.filter()` 함수에 람다 표현식을 직접 추가합니다.
*   음수에 대해 예시는 람다 표현식을 `isNegative` 변수에 할당합니다. 그런 다음
    `isNegative` 변수는 `.filter()` 함수의 매개변수로 사용됩니다. 이 경우, 람다 표현식에서
    함수 매개변수(`x`)의 타입을 명시해야 합니다.

> 람다 표현식이 유일한 함수 매개변수라면, 함수 괄호 `()`를 생략할 수 있습니다:
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> 이것은 [후행 람다](#trailing-lambdas)의 한 예시이며, 이 장의 마지막 부분에서 더 자세히 설명합니다.
>
{style="note"}

또 다른 좋은 예시는 컬렉션의 항목을 변환하기 위해 [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 함수를 사용하는 것입니다:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }
    
    val isTripled = { x: Int -> x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

`.map()` 함수는 람다 표현식을 변환 함수로 받습니다:

*   `{ x -> x * 2 }`는 리스트의 각 요소를 받아 해당 요소를 2배로 곱한 값을 반환합니다.
*   `{ x -> x * 3 }`는 리스트의 각 요소를 받아 해당 요소를 3배로 곱한 값을 반환합니다.

### 함수 타입

함수에서 람다 표현식을 반환하기 전에 먼저 **함수 타입**을 이해해야 합니다.

기본 타입에 대해서는 이미 배웠지만, 함수 자체도 타입을 가집니다. Kotlin의 타입 추론은 매개변수 타입으로부터 함수의 타입을 추론할 수 있습니다. 하지만 함수 타입을 명시적으로 지정해야 하는 경우도 있습니다. 컴파일러는 해당 함수에 허용되거나 허용되지 않는 것이 무엇인지 알기 위해 함수 타입이 필요합니다.

함수 타입의 구문은 다음과 같습니다:

*   각 매개변수의 타입은 괄호 `()` 안에 쉼표 `,`로 구분하여 작성합니다.
*   반환 타입은 `->` 뒤에 작성합니다.

예: `(String) -> String` 또는 `(Int, Int) -> Int`.

`upperCaseString()`에 대한 함수 타입이 정의된 경우 람다 표현식은 다음과 같습니다:

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

람다 표현식에 매개변수가 없는 경우 괄호 `()`는 비워둡니다. 예를 들어: `() -> Unit`

> 매개변수 및 반환 타입은 람다 표현식 내부 또는 함수 타입으로 선언해야 합니다. 그렇지 않으면 컴파일러가 람다 표현식의 타입을 알 수 없습니다.
>
> 예를 들어, 다음은 작동하지 않습니다:
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 함수에서 반환

람다 표현식은 함수에서 반환될 수 있습니다. 컴파일러가 반환되는 람다 표현식의 타입을 이해하도록 하려면 함수 타입을 선언해야 합니다.

다음 예시에서 `toSeconds()` 함수는 항상 `Int` 타입의 매개변수를 받고 `Int` 값을 반환하는 람다 표현식을 반환하므로 함수 타입이 `(Int) -> Int`입니다.

이 예시는 `when` 표현식을 사용하여 `toSeconds()`가 호출될 때 어떤 람다 표현식이 반환될지 결정합니다:

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### 독립적으로 호출

람다 표현식은 중괄호 `{}` 뒤에 괄호 `()`를 추가하고 괄호 안에 모든 매개변수를 포함하여 독립적으로 호출할 수 있습니다:

```kotlin
fun main() {
    //sampleStart
    println({ text: String -> text.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### 후행 람다

이미 보았듯이, 람다 표현식이 유일한 함수 매개변수라면 함수 괄호 `()`를 생략할 수 있습니다. 람다 표현식이 함수의 마지막 매개변수로 전달되는 경우, 표현식은 함수 괄호 `()` 밖에 작성할 수 있습니다. 두 경우 모두 이 구문을 **후행 람다**라고 합니다.

예를 들어, [`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 함수는 초기 값과 연산을 받습니다:

```kotlin
fun main() {
    //sampleStart
    // The initial value is zero. 
    // The operation sums the initial value with every item in the list cumulatively.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // Alternatively, in the form of a trailing lambda
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

람다 표현식에 대한 자세한 내용은 [람다 표현식과 익명 함수](lambdas.md#lambda-expressions-and-anonymous-functions)를 참조하세요.

다음 단계는 Kotlin의 [클래스](kotlin-tour-classes.md)에 대해 학습하는 것입니다.

## 람다 표현식 연습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

웹 서비스에서 지원하는 작업 목록, 모든 요청의 공통 접두사, 그리고 특정 리소스의 ID가 있습니다. ID가 5인 리소스에 대해 `title` 작업을 요청하려면 다음 URL을 생성해야 합니다: `https://example.com/book-info/5/title`. 람다 표현식을 사용하여 작업 목록에서 URL 목록을 만드세요.

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here
    println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-lambdas-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

`Int` 값과 작업(`() -> Unit` 타입의 함수)을 받아 해당 작업을 주어진 횟수만큼 반복하는 함수를 작성하세요. 그런 다음 이 함수를 사용하여 “Hello”를 5번 출력하세요.

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // Write your code here
}

fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-lambdas-solution-2"}

## 다음 단계

[클래스](kotlin-tour-classes.md)