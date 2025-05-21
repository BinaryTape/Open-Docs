---
title: 함수
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types (기본 타입)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections (컬렉션)</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow (제어 흐름)</a><br />
        <img src="/img/icon-5.svg" width="20" alt="Fifth step" /> <strong>Functions (함수)</strong><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes (클래스)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety (Null 안정성)</a>
</p>

:::

Kotlin에서는 `fun` 키워드를 사용하여 함수를 직접 선언할 수 있습니다.

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```

Kotlin에서:

* 함수 파라미터는 괄호 `()` 안에 작성합니다.
* 각 파라미터는 타입을 가져야 하며, 여러 파라미터는 쉼표 `,`로 구분해야 합니다.
* 반환 타입은 함수 괄호 `()` 뒤에 콜론 `:`으로 구분하여 작성합니다.
* 함수 본문은 중괄호 `{}` 안에 작성합니다.
* `return` 키워드는 함수에서 종료하거나 값을 반환하는 데 사용됩니다.

:::note
함수가 유용한 값을 반환하지 않으면 반환 타입과 `return` 키워드를 생략할 수 있습니다. 이에 대한 자세한 내용은 [반환 값이 없는 함수](#functions-without-return)에서 확인하세요.

:::

다음 예제에서:

* `x`와 `y`는 함수 파라미터입니다.
* `x`와 `y`는 `Int` 타입입니다.
* 함수의 반환 타입은 `Int`입니다.
* 함수는 호출될 때 `x`와 `y`의 합계를 반환합니다.

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

:::note
[코딩 컨벤션](coding-conventions#function-names)에서는 함수 이름을 소문자로 시작하고 밑줄 없이 카멜 케이스를 사용하는 것을 권장합니다.

:::

## Named arguments (이름 지정 인자)

간결한 코드를 위해 함수를 호출할 때 파라미터 이름을 포함할 필요는 없습니다. 그러나 파라미터 이름을 포함하면 코드를 더 읽기 쉽게 만들 수 있습니다. 이를 **named arguments (이름 지정 인자)** 사용이라고 합니다. 파라미터 이름을 포함하는 경우 파라미터를 임의의 순서로 작성할 수 있습니다.

:::note
다음 예제에서는 [문자열 템플릿](strings#string-templates)(`문자열 템플릿`)을 사용하여 파라미터 값에 접근하고, `String` 타입으로 변환한 다음, 문자열로 연결하여 출력합니다.

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // Uses named arguments with swapped parameter order (이름 지정 인자를 사용하여 파라미터 순서를 바꿈)
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```

## Default parameter values (기본 파라미터 값)

함수 파라미터에 대한 기본값을 정의할 수 있습니다. 기본값이 있는 모든 파라미터는 함수를 호출할 때 생략할 수 있습니다. 기본값을 선언하려면 타입 뒤에 할당 연산자 `=`를 사용합니다.

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // Function called with both parameters (두 파라미터 모두 사용하여 함수 호출)
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // Function called only with message parameter (message 파라미터만 사용하여 함수 호출)
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```

모든 파라미터를 생략하는 대신 기본값이 있는 특정 파라미터를 건너뛸 수 있습니다. 그러나 첫 번째 건너뛴 파라미터 이후에는 후속 파라미터의 이름을 모두 지정해야 합니다.

:::

## Functions without return (반환 값이 없는 함수)

함수가 유용한 값을 반환하지 않으면 반환 타입은 `Unit`입니다. `Unit`은 단 하나의 값 `Unit`을 갖는 타입입니다. 함수 본문에서 `Unit`이 명시적으로 반환된다고 선언할 필요는 없습니다. 즉, `return` 키워드를 사용하거나 반환 타입을 선언할 필요가 없습니다.

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` or `return` is optional (`return Unit` 또는 `return`은 선택 사항)
}

fun main() {
    printMessage("Hello")
    // Hello
}
```

## Single-expression functions (단일 표현식 함수)

코드를 더 간결하게 만들기 위해 단일 표현식 함수를 사용할 수 있습니다. 예를 들어 `sum()` 함수를 단축할 수 있습니다.

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

중괄호 `{}`를 제거하고 할당 연산자 `=`를 사용하여 함수 본문을 선언할 수 있습니다. 할당 연산자 `=`를 사용하면 Kotlin은 타입 추론을 사용하므로 반환 타입도 생략할 수 있습니다. 그러면 `sum()` 함수는 한 줄이 됩니다.

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```

그러나 다른 개발자가 코드를 빠르게 이해할 수 있도록 하려면 할당 연산자 `=`를 사용하더라도 반환 타입을 명시적으로 정의하는 것이 좋습니다.

:::note
함수 본문을 선언하기 위해 `{}` 중괄호를 사용하는 경우 `Unit` 타입이 아닌 한 반환 타입을 선언해야 합니다.

:::

## Early returns in functions (함수에서의 조기 반환)

함수 내의 코드가 특정 지점 이상으로 처리되지 않도록 하려면 `return` 키워드를 사용합니다. 이 예제에서는 조건식이 참으로 판명되면 함수에서 조기에 반환하기 위해 `if`를 사용합니다.

```kotlin
// A list of registered usernames (등록된 사용자 이름 목록)
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// A list of registered emails (등록된 이메일 목록)
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // Early return if the username is already taken (사용자 이름이 이미 사용 중인 경우 조기 반환)
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // Early return if the email is already registered (이메일이 이미 등록된 경우 조기 반환)
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // Proceed with the registration if the username and email are not taken (사용자 이름과 이메일이 사용되지 않은 경우 등록 진행)
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

## Functions practice (함수 연습)

### Exercise 1 

정수 형식으로 원의 반지름을 파라미터로 받고 해당 원의 면적을 출력하는 `circleArea`라는 함수를 작성하세요.

:::note
이 연습에서는 `PI`를 통해 pi 값에 접근할 수 있도록 패키지를 가져옵니다. 패키지 가져오기에 대한 자세한 내용은 [패키지 및 가져오기](packages)를 참조하세요.

:::

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here (여기에 코드 작성)

fun main() {
    println(circleArea(2))
}
```

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

### Exercise 2 

이전 연습에서 `circleArea` 함수를 단일 표현식 함수로 다시 작성하세요.

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here (여기에 코드 작성)

fun main() {
    println(circleArea(2))
}
```

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```

### Exercise 3 

시간, 분, 초 단위로 주어진 시간 간격을 초 단위로 변환하는 함수가 있습니다. 대부분의 경우 하나 또는 두 개의 함수 파라미터만 전달해야 하고 나머지는 0과 같습니다. 기본 파라미터 값과 이름 지정 인자를 사용하여 함수와 함수를 호출하는 코드를 개선하여 코드를 더 읽기 쉽게 만드세요.

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

## Lambda expressions (람다 표현식)

Kotlin을 사용하면 람다 표현식을 사용하여 함수에 대한 코드를 훨씬 더 간결하게 작성할 수 있습니다.

예를 들어, 다음 `uppercaseString()` 함수는 다음과 같습니다.

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```

다음과 같이 람다 표현식으로 작성할 수도 있습니다.

```kotlin
fun main() {
    val upperCaseString = { text: String -
:::note
 text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```

람다 표현식은 처음에는 이해하기 어려울 수 있으므로 분석해 보겠습니다. 람다 표현식은 중괄호 `{}` 안에 작성됩니다.

람다 표현식 내에서 다음을 작성합니다.

* 파라미터 뒤에 `->`가 옵니다.
* `->` 뒤에 함수 본문이 옵니다.

이전 예제에서:

* `text`는 함수 파라미터입니다.
* `text`는 `String` 타입입니다.
* 함수는 `text`에서 호출된 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 함수의 결과를 반환합니다.
* 전체 람다 표현식은 할당 연산자 `=`를 사용하여 `upperCaseString` 변수에 할당됩니다.
* 람다 표현식은 `upperCaseString` 변수를 함수처럼 사용하고 문자열 `"hello"`를 파라미터로 사용하여 호출됩니다.
* `println()` 함수는 결과를 출력합니다.

파라미터 없이 람다를 선언하면 `->`를 사용할 필요가 없습니다. 예를 들어:
```kotlin
{ println("Log message") }
```

:::

람다 표현식은 여러 가지 방법으로 사용할 수 있습니다. 다음을 수행할 수 있습니다.

* [람다 표현식을 다른 함수에 파라미터로 전달](#pass-to-another-function)
* [함수에서 람다 표현식을 반환](#return-from-a-function)
* [람다 표현식을 자체적으로 호출](#invoke-separately)

### Pass to another function (다른 함수에 전달)

람다 표현식을 함수에 전달하는 것이 유용한 좋은 예는 컬렉션에서 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 함수를 사용하는 것입니다.

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    
    val positives = numbers.filter ({ x `->` x > 0 })
    
    val isNegative = { x: Int `->` x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]

}
```

`.filter()` 함수는 람다 표현식을 술어로 받아들입니다.

* `{ x `->` x > 0 }`는 목록의 각 요소를 가져와서 양수인 요소만 반환합니다.
* `{ x `->` x < 0 }`는 목록의 각 요소를 가져와서 음수인 요소만 반환합니다.

이 예제에서는 람다 표현식을 함수에 전달하는 두 가지 방법을 보여줍니다.

* 양수의 경우 예제에서는 람다 표현식을 `.filter()` 함수에 직접 추가합니다.
* 음수의 경우 예제에서는 람다 표현식을 `isNegative` 변수에 할당합니다. 그런 다음 `isNegative` 변수는 `.filter()` 함수에서 함수 파라미터로 사용됩니다. 이 경우 람다 표현식에서 함수 파라미터(`x`)의 타입을 지정해야 합니다.

:::note
람다 표현식이 유일한 함수 파라미터인 경우 함수 괄호 `()`를 삭제할 수 있습니다.

```kotlin
val positives = numbers.filter { x `->` x > 0 }
```

이것은 [후행 람다](#trailing-lambdas)의 예이며, 이 장의 뒷부분에서 자세히 설명합니다.

:::

또 다른 좋은 예는 [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 함수를 사용하여 컬렉션의 항목을 변환하는 것입니다.

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x `->` x * 2 }
    
    val isTripled = { x: Int `->` x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]

}
```

`.map()` 함수는 람다 표현식을 변환 함수로 받아들입니다.

* `{ x `->` x * 2 }`는 목록의 각 요소를 가져와서 해당 요소에 2를 곱한 값을 반환합니다.
* `{ x `->` x * 3 }`는 목록의 각 요소를 가져와서 해당 요소에 3을 곱한 값을 반환합니다.

### Function types (함수 타입)

함수에서 람다 표현식을 반환하기 전에 먼저 **함수 타입**을 이해해야 합니다.

이미 기본 타입에 대해 배웠지만 함수 자체도 타입을 갖습니다. Kotlin의 타입 추론은 파라미터 타입에서 함수의 타입을 추론할 수 있습니다. 그러나 함수 타입을 명시적으로 지정해야 할 때가 있을 수 있습니다. 컴파일러는 함수 타입이 있어야 해당 함수에 대해 허용되는 것과 허용되지 않는 것을 알 수 있습니다.

함수 타입에 대한 구문은 다음과 같습니다.

* 각 파라미터의 타입은 괄호 `()` 안에 작성하고 쉼표 `,`로 구분합니다.
* 반환 타입은 `->` 뒤에 작성합니다.

예를 들어: `(String) `->` String` 또는 `(Int, Int) `->` Int`.

다음은 `upperCaseString()`에 대한 함수 타입이 정의된 경우의 람다 표현식입니다.

```kotlin
val upperCaseString: (String) `->` String = { text `->` text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```

람다 표현식에 파라미터가 없으면 괄호 `()`를 비워 둡니다. 예를 들어: `() `->` Unit`

람다 표현식 또는 함수 타입에서 파라미터와 반환 타입을 선언해야 합니다. 그렇지 않으면 컴파일러는 람다 표현식의 타입을 알 수 없습니다.

예를 들어, 다음은 작동하지 않습니다.

`val upperCaseString = { str `->` str.uppercase() }`

:::

### Return from a function (함수에서 반환)

람다 표현식은 함수에서 반환될 수 있습니다. 컴파일러가 반환된 람다 표현식의 타입을 이해할 수 있도록 하려면 함수 타입을 선언해야 합니다.

다음 예제에서 `toSeconds()` 함수는 `Int` 타입의 파라미터를 가져와 `Int` 값을 반환하는 람다 표현식을 항상 반환하므로 함수 타입이 `(Int) `->` Int`입니다.

이 예제에서는 `when` 표현식을 사용하여 `toSeconds()`가 호출될 때 반환되는 람다 표현식을 결정합니다.

```kotlin
fun toSeconds(time: String): (Int) `->` Int = when (time) {
    "hour" `->` { value `->` value * 60 * 60 }
    "minute" `->` { value `->` value * 60 }
    "second" `->` { value `->` value }
    else `->` { value `->` value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```

### Invoke separately (개별적으로 호출)

중괄호 `{}` 뒤에 괄호 `()`를 추가하고 괄호 안에 파라미터를 포함하여 람다 표현식을 자체적으로 호출할 수 있습니다.

```kotlin
fun main() {

    println({ text: String `->` text.uppercase() }("hello"))
    // HELLO

}
```

### Trailing lambdas (후행 람다)

이미 보았듯이 람다 표현식이 유일한 함수 파라미터인 경우 함수 괄호 `()`를 삭제할 수 있습니다. 람다 표현식이 함수의 마지막 파라미터로 전달되면 표현식을 함수 괄호 `()` 외부에 작성할 수 있습니다. 두 경우 모두 이 구문을 **trailing lambda (후행 람다)**라고 합니다.

예를 들어 [`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 함수는 초기 값과 연산을 받아들입니다.

```kotlin
fun main() {

    // The initial value is zero. (초기 값은 0입니다.)
    // The operation sums the initial value with every item in the list cumulatively. (이 연산은 초기 값을 목록의 모든 항목과 누적적으로 합산합니다.)
    println(listOf(1, 2, 3).fold(0, { x, item `->` x + item })) // 6

    // Alternatively, in the form of a trailing lambda (또는, 후행 람다 형식으로)
    println(listOf(1, 2, 3).fold(0) { x, item `->` x + item })  // 6

}
```

람다 표현식에 대한 자세한 내용은 [람다 표현식 및 익명 함수](lambdas#lambda-expressions-and-anonymous-functions)를 참조하세요.

저희 투어의 다음 단계는 Kotlin의 [클래스](kotlin-tour-classes)에 대해 배우는 것입니다.

## Lambda expressions practice (람다 표현식 연습)

### Exercise 1 

웹 서비스에서 지원하는 작업 목록, 모든 요청에 대한 공통 접두사 및 특정 리소스의 ID가 있습니다. ID가 5인 리소스에 대한 작업 `title`을 요청하려면 다음 URL을 만들어야 합니다. `https://example.com/book-info/5/title`. 람다 표현식을 사용하여 작업 목록에서 URL 목록을 만드세요.

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here (여기에 코드 작성)
    println(urls)
}
```

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action `->` "$prefix/$id/$action" }
    println(urls)
}
```

### Exercise 2 

`Int` 값과 작업(타입 `() `->` Unit`의 함수)을 가져와서 지정된 횟수만큼 작업을 반복하는 함수를 작성하세요. 그런 다음 이 함수를 사용하여 "Hello"를 5번 출력하세요.

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
    // Write your code here (여기에 코드 작성)
}

fun main() {
    // Write your code here (여기에 코드 작성)
}
```

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
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

## Next step (다음 단계)

[Classes (클래스)](kotlin-tour-classes)