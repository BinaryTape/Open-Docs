[//]: # (title: 함수)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="두 번째 단계" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3-done.svg" width="20" alt="세 번째 단계" /> <a href="kotlin-tour-collections.md">컬렉션</a><br />
        <img src="icon-4-done.svg" width="20" alt="네 번째 단계" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5.svg" width="20" alt="다섯 번째 단계" /> <strong>함수</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="여섯 번째 단계" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="마지막 단계" /> <a href="kotlin-tour-null-safety.md">널 안전성</a></p>
</tldr>

Kotlin에서는 `fun` 키워드를 사용하여 고유한 함수를 선언할 수 있습니다.

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

Kotlin에서는:

*   함수 파라미터는 괄호 `()` 안에 작성됩니다.
*   각 파라미터는 타입을 가져야 하며, 여러 파라미터는 쉼표 `,`로 구분해야 합니다.
*   반환 타입은 함수의 괄호 `()` 뒤에 콜론 `:`으로 구분하여 작성됩니다.
*   함수의 본문은 중괄호 `{}` 안에 작성됩니다.
*   `return` 키워드는 함수를 종료하거나 함수에서 무언가를 반환할 때 사용됩니다.

> 함수가 유용한 값을 반환하지 않는 경우, 반환 타입과 `return` 키워드는 생략될 수 있습니다. 이에 대한 자세한 내용은
> [반환 값이 없는 함수](#functions-without-return)에서 확인할 수 있습니다.
>
{style="note"}

다음 예시에서:

*   `x`와 `y`는 함수 파라미터입니다.
*   `x`와 `y`는 `Int` 타입입니다.
*   함수의 반환 타입은 `Int`입니다.
*   함수가 호출되면 `x`와 `y`의 합을 반환합니다.

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

> [코딩 컨벤션](coding-conventions.md#function-names)에서 함수 이름을 소문자로 시작하고
> 언더스코어 없이 카멜 케이스를 사용할 것을 권장합니다.
>
{style="note"}

## 명명된 인자

간결한 코드를 위해 함수를 호출할 때 파라미터 이름을 포함할 필요는 없습니다. 하지만 파라미터 이름을 포함하면 코드를 더 읽기 쉽게 만들 수 있습니다. 이를 **명명된 인자** 사용이라고 합니다. 파라미터 이름을 포함하는 경우, 파라미터를 어떤 순서로든 작성할 수 있습니다.

> 다음 예시에서는 [문자열 템플릿](strings.md#string-templates)(` `)을 사용하여
> 파라미터 값에 접근하고, 이를 `String` 타입으로 변환한 다음, 인쇄를 위한 문자열로 연결합니다.
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

## 기본 파라미터 값

함수 파라미터에 기본 값을 정의할 수 있습니다. 기본 값이 있는 파라미터는 함수를 호출할 때 생략할 수 있습니다. 기본 값을 선언하려면 타입 뒤에 할당 연산자 `=`를 사용합니다:

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // 두 파라미터와 함께 호출된 함수
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // 메시지 파라미터만으로 호출된 함수
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> 모든 파라미터를 생략하는 대신, 기본 값을 가진 특정 파라미터를 건너뛸 수 있습니다. 하지만
> 첫 번째로 건너뛴 파라미터 이후에는 모든 후속 파라미터에 이름을 명시해야 합니다.
>
{style="note"}

## 반환 값이 없는 함수

함수가 유용한 값을 반환하지 않는 경우 반환 타입은 `Unit`입니다. `Unit`은 단 하나의 값인 `Unit`을 가진 타입입니다. 함수 본문에서 `Unit`이 명시적으로 반환된다고 선언할 필요는 없습니다. 이는 `return` 키워드를 사용하거나 반환 타입을 선언할 필요가 없음을 의미합니다:

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` 또는 `return`은 선택 사항입니다.
}

fun main() {
    printMessage("Hello")
    // Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## 단일 표현식 함수

코드를 더 간결하게 만들기 위해 단일 표현식 함수를 사용할 수 있습니다. 예를 들어, `sum()` 함수는 다음과 같이 단축될 수 있습니다:

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

중괄호 `{}`를 제거하고 할당 연산자 `=`를 사용하여 함수 본문을 선언할 수 있습니다. 할당 연산자 `=`를 사용할 때 Kotlin은 타입 추론을 사용하므로 반환 타입도 생략할 수 있습니다. 그러면 `sum()` 함수는 한 줄이 됩니다:

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

하지만 다른 개발자들이 코드를 빠르게 이해할 수 있도록 하려면, 할당 연산자 `=`를 사용할 때도 반환 타입을 명시적으로 정의하는 것이 좋습니다.

> 함수 본문을 선언하기 위해 `{}` 중괄호를 사용하는 경우, `Unit` 타입이 아닌 이상 반환 타입을 선언해야 합니다.
>
{style="note"}

## 함수에서의 조기 반환

함수 내의 코드가 특정 지점 이상으로 처리되는 것을 막으려면 `return` 키워드를 사용합니다. 이 예시는 조건부 표현식이 참으로 판명되면 `if`를 사용하여 함수에서 조기 반환하는 방법을 보여줍니다:

```kotlin
// 등록된 사용자 이름 목록
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// 등록된 이메일 목록
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // 사용자 이름이 이미 사용 중인 경우 조기 반환
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // 이메일이 이미 등록된 경우 조기 반환
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // 사용자 이름과 이메일이 사용 중이 아닌 경우 등록 진행
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

## 함수 실습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

`circleArea`라는 함수를 작성하여 원의 반지름을 정수 형식으로 파라미터로 받고 해당 원의 면적을 출력하세요.

> 이 연습에서는 `PI`를 통해 원주율 값에 접근할 수 있도록 패키지를 임포트합니다. 임포팅에 대한 자세한 내용은
> [패키지 및 임포트](packages.md)를 참조하세요.
>
{style="tip"}

<deflist collapsible="true" id="kotlin-tour-functions-exercise-1-hint">
    <def title="힌트">
        원의 면적을 계산하는 공식은 <math>πr^2</math>이며, 여기서 <math>r</math>은 반지름입니다.
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.math.PI

// 여기에 코드를 작성하세요

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해결책" id="kotlin-tour-functions-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

이전 연습의 `circleArea` 함수를 단일 표현식 함수로 다시 작성하세요.

|---|---|
```kotlin
import kotlin.math.PI

// 여기에 코드를 작성하세요

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해결책" id="kotlin-tour-functions-solution-2"}

### 연습 문제 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

시, 분, 초로 주어진 시간 간격을 초 단위로 변환하는 함수가 있습니다. 대부분의 경우, 나머지 파라미터는 0으로 같게 두고 함수 파라미터 중 하나 또는 두 개만 전달하면 됩니다. 코드를 더 읽기 쉽게 만들도록 기본 파라미터 값과 명명된 인자를 사용하여 함수와 이를 호출하는 코드를 개선하세요.

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해결책" id="kotlin-tour-functions-solution-3"}

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

또한 람다 표현식으로 작성할 수 있습니다:

```kotlin
fun main() {
    val upperCaseString = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

람다 표현식은 언뜻 보기에 이해하기 어려울 수 있으므로 자세히 살펴보겠습니다. 람다 표현식은 중괄호 `{}` 안에 작성됩니다.

람다 표현식 안에는 다음을 작성합니다:

*   `->` 뒤에 오는 파라미터.
*   `->` 뒤에 오는 함수 본문.

이전 예시에서:

*   `text`는 함수 파라미터입니다.
*   `text`는 `String` 타입입니다.
*   함수는 `text`에서 호출된 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 함수의 결과를 반환합니다.
*   전체 람다 표현식은 할당 연산자 `=`를 사용하여 `upperCaseString` 변수에 할당됩니다.
*   람다 표현식은 `upperCaseString` 변수를 함수처럼 사용하고 문자열 `"hello"`를 파라미터로 전달하여 호출됩니다.
*   `println()` 함수는 결과를 출력합니다.

> 파라미터 없이 람다를 선언하는 경우, `->`를 사용할 필요가 없습니다. 예를 들어:
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

람다 표현식은 여러 가지 방식으로 사용될 수 있습니다. 다음을 수행할 수 있습니다:

*   [다른 함수에 람다 표현식을 파라미터로 전달](#pass-to-another-function)
*   [함수에서 람다 표현식 반환](#return-from-a-function)
*   [람다 표현식을 단독으로 호출](#invoke-separately)

### 다른 함수에 전달

람다 표현식을 함수에 전달하는 것이 유용한 좋은 예시는 컬렉션에서 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 함수를 사용하는 것입니다:

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

`.filter()` 함수는 람다 표현식을 술어(predicate)로 받아들이고 리스트의 각 요소에 적용합니다. 함수는 술어가 `true`를 반환하는 경우에만 요소를 유지합니다:

*   `{ x -> x > 0 }`는 요소가 양수인 경우 `true`를 반환합니다.
*   `{ x -> x < 0 }`는 요소가 음수인 경우 `true`를 반환합니다.

이 예시는 람다 표현식을 함수에 전달하는 두 가지 방법을 보여줍니다:

*   양수에 대해, 예시는 `.filter()` 함수에 람다 표현식을 직접 추가합니다.
*   음수에 대해, 예시는 람다 표현식을 `isNegative` 변수에 할당합니다. 그런 다음 `isNegative` 변수는 `.filter()` 함수의 함수 파라미터로 사용됩니다. 이 경우 람다 표현식에서 함수 파라미터(`x`)의 타입을 명시해야 합니다.

> 람다 표현식이 유일한 함수 파라미터인 경우, 함수 괄호 `()`를 생략할 수 있습니다:
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> 이는 [후행 람다](#trailing-lambdas)의 예시로, 이 챕터의 끝 부분에서 더 자세히 설명됩니다.
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

`.map()` 함수는 람다 표현식을 변환 함수로 받아들입니다:

*   `{ x -> x * 2 }`는 리스트의 각 요소를 가져와서 그 요소에 2를 곱한 값을 반환합니다.
*   `{ x -> x * 3 }`는 리스트의 각 요소를 가져와서 그 요소에 3을 곱한 값을 반환합니다.

### 함수 타입

함수에서 람다 표현식을 반환하려면 먼저 **함수 타입**을 이해해야 합니다.

기본 타입에 대해서는 이미 학습했지만, 함수 자체도 타입을 가집니다. Kotlin의 타입 추론은 파라미터 타입으로부터 함수의 타입을 추론할 수 있습니다. 하지만 함수 타입을 명시적으로 지정해야 할 때도 있습니다. 컴파일러는 해당 함수에 무엇이 허용되고 무엇이 허용되지 않는지 알기 위해 함수 타입이 필요합니다.

함수 타입의 문법은 다음과 같습니다:

*   각 파라미터의 타입은 괄호 `()` 안에 작성되며 쉼표 `,`로 구분됩니다.
*   `->` 뒤에 작성되는 반환 타입.

예를 들어: `(String) -> String` 또는 `(Int, Int) -> Int`.

`upperCaseString()`에 대한 함수 타입이 정의된 경우 람다 표현식은 다음과 같습니다:

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

람다 표현식에 파라미터가 없는 경우 괄호 `()`는 비워둡니다. 예를 들어: `() -> Unit`

> 람다 표현식에서 파라미터와 반환 타입을 선언하거나 함수 타입으로 선언해야 합니다. 그렇지 않으면
> 컴파일러가 람다 표현식의 타입을 알 수 없습니다.
>
> 예를 들어, 다음은 작동하지 않습니다:
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 함수에서 반환

람다 표현식은 함수에서 반환될 수 있습니다. 컴파일러가 반환된 람다 표현식의 타입을 이해하도록 하려면 함수 타입을 선언해야 합니다.

다음 예시에서 `toSeconds()` 함수는 항상 `Int` 타입의 파라미터를 받고 `Int` 값을 반환하는 람다 표현식을 반환하므로 함수 타입이 `(Int) -> Int`입니다.

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

### 단독으로 호출

람다 표현식은 중괄호 `{}` 뒤에 괄호 `()`를 추가하고 괄호 안에 파라미터를 포함하여 단독으로 호출할 수 있습니다:

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

이미 보셨듯이, 람다 표현식이 유일한 함수 파라미터인 경우 함수 괄호 `()`를 생략할 수 있습니다. 람다 표현식이 함수의 마지막 파라미터로 전달되는 경우, 그 표현식은 함수 괄호 `()` 밖에 작성될 수 있습니다. 두 경우 모두 이 문법을 **후행 람다**라고 합니다.

예를 들어, [`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 함수는 초기 값과 연산을 받습니다:

```kotlin
fun main() {
    //sampleStart
    // 초기 값은 0입니다. 
    // 이 연산은 초기 값에 리스트의 모든 항목을 누적하여 더합니다.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // 또는 후행 람다 형태로
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

람다 표현식에 대한 더 자세한 내용은 [람다 표현식과 익명 함수](lambdas.md#lambda-expressions-and-anonymous-functions)를 참조하세요.

다음 단계는 Kotlin의 [클래스](kotlin-tour-classes.md)에 대해 학습하는 것입니다.

## 람다 표현식 실습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

웹 서비스에서 지원하는 작업 목록, 모든 요청에 대한 공통 접두사, 그리고 특정 리소스의 ID가 있습니다. ID가 5인 리소스에 대해 `title` 작업을 요청하려면 다음 URL: `https://example.com/book-info/5/title`을 생성해야 합니다. 작업 목록에서 URL 목록을 생성하기 위해 람다 표현식을 사용하세요.

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해결책" id="kotlin-tour-lambdas-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

`Int` 값과 작업(`() -> Unit` 타입의 함수)을 받아 해당 작업을 주어진 횟수만큼 반복하는 함수를 작성하세요. 그런 다음 이 함수를 사용하여 "Hello"를 5번 출력하세요.

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // 여기에 코드를 작성하세요
}

fun main() {
    // 여기에 코드를 작성하세요
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해결책" id="kotlin-tour-lambdas-solution-2"}

## 다음 단계

[클래스](kotlin-tour-classes.md)