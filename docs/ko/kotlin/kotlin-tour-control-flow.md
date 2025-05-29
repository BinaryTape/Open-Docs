[//]: # (title: 제어 흐름)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="두 번째 단계" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3-done.svg" width="20" alt="세 번째 단계" /> <a href="kotlin-tour-collections.md">컬렉션</a><br />
        <img src="icon-4.svg" width="20" alt="네 번째 단계" /> <strong>제어 흐름</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="다섯 번째 단계" /> <a href="kotlin-tour-functions.md">함수</a><br />
        <img src="icon-6-todo.svg" width="20" alt="여섯 번째 단계" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="마지막 단계" /> <a href="kotlin-tour-null-safety.md">널 안정성</a></p>
</tldr>

다른 프로그래밍 언어와 마찬가지로, Kotlin은 특정 코드 조각이 참으로 평가되는지에 따라 결정을 내릴 수 있습니다. 이러한 코드 조각을 **조건식**이라고 합니다. Kotlin은 또한 반복문을 생성하고 순회할 수 있습니다.

## 조건식

Kotlin은 조건식을 확인하기 위해 `if`와 `when`을 제공합니다.

> `if`와 `when` 중 하나를 선택해야 한다면, 다음과 같은 이유로 `when`을 사용하는 것을 권장합니다:
>
> *   코드를 더 읽기 쉽게 만듭니다.
> *   다른 분기를 쉽게 추가할 수 있습니다.
> *   코드 실수를 줄여줍니다.
>
{style="note"}

### If

`if`를 사용하려면, 조건식을 괄호 `()` 안에, 결과가 참일 경우 수행할 동작을 중괄호 `{}` 안에 추가합니다:

```kotlin
fun main() {
//sampleStart
    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if"}

Kotlin에는 삼항 연산자 `condition ? then : else`가 없습니다. 대신 `if`는 식(expression)으로 사용될 수 있습니다. 각 동작당 한 줄의 코드만 있다면 중괄호 `{}`는 선택 사항입니다:

```kotlin
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // Returns a value: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

여러 분기가 있는 조건식을 다룰 때 `when`을 사용하세요.

`when` 사용법:

*   평가하려는 값을 괄호 `()` 안에 넣습니다.
*   분기들을 중괄호 `{}` 안에 넣습니다.
*   각 분기에서 `->`를 사용하여 각 검사(check)와 검사가 성공했을 때 수행할 동작을 구분합니다.

`when`은 문(statement) 또는 식(expression)으로 사용될 수 있습니다. **문**은 아무것도 반환하지 않지만 대신 동작을 수행합니다.

`when`을 문으로 사용하는 예시입니다:

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // obj가 "1"과 같은지 확인
        "1" -> println("One")
        // obj가 "Hello"와 같은지 확인
        "Hello" -> println("Greeting")
        // 기본 문
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> 모든 분기 조건은 그 중 하나가 만족될 때까지 순차적으로 검사됩니다. 따라서 첫 번째 적합한 분기만 실행됩니다.
>
{style="note"}

**식**은 코드에서 나중에 사용될 수 있는 값을 반환합니다.

`when`을 식으로 사용하는 예시입니다. `when` 식은 즉시 변수에 할당되며, 이 변수는 나중에 `println()` 함수와 함께 사용됩니다:

```kotlin
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // obj가 "1"과 같으면, result를 "one"으로 설정
        "1" -> "One"
        // obj가 "Hello"와 같으면, result를 "Greeting"으로 설정
        // 이전 조건이 만족되지 않으면, result를 "Unknown"으로 설정
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

지금까지 본 `when` 예시들은 모두 주체(`obj`)를 가지고 있었습니다. 하지만 `when`은 주체 없이도 사용될 수 있습니다.

이 예시는 **주체 없이** `when` 식을 사용하여 일련의 불리언(Boolean) 식을 확인합니다:

```kotlin
fun main() {
    val trafficLightState = "Red" // "Green", "Yellow", 또는 "Red"일 수 있습니다.

    val trafficAction = when {
        trafficLightState == "Green" -> "Go"
        trafficLightState == "Yellow" -> "Slow down"
        trafficLightState == "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean"}

하지만, `trafficLightState`를 주체로 사용하여 동일한 코드를 작성할 수도 있습니다:

```kotlin
fun main() {
    val trafficLightState = "Red" // "Green", "Yellow", 또는 "Red"일 수 있습니다.

    val trafficAction = when (trafficLightState) {
        "Green" -> "Go"
        "Yellow" -> "Slow down"
        "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean-subject"}

주체와 함께 `when`을 사용하면 코드를 더 읽고 유지 관리하기 쉽게 만듭니다. `when` 식에 주체를 사용하면 Kotlin이 모든 가능한 경우를 포함하는지 확인하는 데도 도움이 됩니다. 그렇지 않으면, `when` 식에 주체를 사용하지 않을 경우 `else` 분기를 제공해야 합니다.

## 조건식 실습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

두 주사위를 던져 같은 숫자가 나오면 이기는 간단한 게임을 만드세요. 주사위 숫자가 같으면 `You win :)`을, 그렇지 않으면 `You lose :(`를 출력하기 위해 `if`를 사용하세요.

> 이 연습 문제에서는 임의의 `Int` 값을 얻기 위해 `Random.nextInt()` 함수를 사용할 수 있도록 패키지를 임포트합니다. 패키지 임포트에 대한 자세한 내용은 [패키지 및 임포트](packages.md)를 참조하세요.
>
{style="tip"}

<deflist collapsible="true">
    <def title="힌트">
        주사위 결과를 비교하려면 <a href="operator-overloading.md#equality-and-inequality-operators">동등 연산자</a> (<code>==</code>)를 사용하세요. 
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // 여기에 코드를 작성하세요
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-1"}

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    if (firstResult == secondResult)
        println("You win :)")
    else
        println("You lose :(")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-control-flow-conditional-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-2"}

`when` 식을 사용하여, 다음 프로그램이 게임 콘솔 버튼 이름을 입력했을 때 해당 동작을 출력하도록 업데이트하세요.

| **버튼** | **동작**             |
|------------|------------------------|
| A          | Yes                    |
| B          | No                     |
| X          | Menu                   |
| Y          | Nothing                |
| 기타      | 해당 버튼이 없습니다 |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // 여기에 코드를 작성하세요
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-2"}

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "There is no such button"
        }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-control-flow-conditional-solution-2"}

## 범위

반복문에 대해 이야기하기 전에, 반복문이 순회할 범위를 구성하는 방법을 아는 것이 유용합니다.

Kotlin에서 범위를 생성하는 가장 일반적인 방법은 `..` 연산자를 사용하는 것입니다. 예를 들어, `1..4`는 `1, 2, 3, 4`와 동일합니다.

끝 값을 포함하지 않는 범위를 선언하려면 `..<` 연산자를 사용하세요. 예를 들어, `1..<4`는 `1, 2, 3`과 동일합니다.

역순으로 범위를 선언하려면 `downTo`를 사용하세요. 예를 들어, `4 downTo 1`은 `4, 3, 2, 1`과 동일합니다.

1이 아닌 단계(step)로 증가하는 범위를 선언하려면 `step`과 원하는 증가 값을 사용하세요. 예를 들어, `1..5 step 2`는 `1, 3, 5`와 동일합니다.

`Char` 범위에서도 동일하게 할 수 있습니다:

*   `'a'..'d'`는 `'a', 'b', 'c', 'd'`와 동일합니다.
*   `'z' downTo 's' step 2`는 `'z', 'x', 'v', 't'`와 동일합니다.

## 반복문

프로그래밍에서 가장 흔한 두 가지 반복 구조는 `for`와 `while`입니다. `for`는 값의 범위를 순회하며 동작을 수행할 때 사용합니다. `while`은 특정 조건이 만족될 때까지 동작을 계속할 때 사용합니다.

### For

범위에 대한 새로운 지식을 활용하여, 1부터 5까지 숫자를 순회하며 매번 숫자를 출력하는 `for` 반복문을 만들 수 있습니다.

반복자(iterator)와 범위를 `in` 키워드와 함께 괄호 `()` 안에 넣으세요. 완료하려는 동작은 중괄호 `{}` 안에 추가하세요:

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) { 
        // number는 반복자이고 1..5는 범위입니다
        print(number)
    }
    // 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

컬렉션 또한 반복문을 통해 순회할 수 있습니다:

```kotlin
fun main() { 
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### While

`while`은 두 가지 방식으로 사용될 수 있습니다:

*   조건식이 참인 동안 코드 블록을 실행합니다. (`while`)
*   코드 블록을 먼저 실행한 다음 조건식을 확인합니다. (`do-while`)

첫 번째 사용 사례 (`while`):

*   `while` 반복문이 계속될 조건식을 괄호 `()` 안에 선언하세요.
*   완료하려는 동작을 중괄호 `{}` 안에 추가하세요.

> 다음 예시에서는 `cakesEaten` 변수의 값을 증가시키기 위해 [증가 연산자](operator-overloading.md#increments-and-decrements) `++`를 사용합니다.
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-loop"}

두 번째 사용 사례 (`do-while`):

*   `while` 반복문이 계속될 조건식을 괄호 `()` 안에 선언하세요.
*   `do` 키워드와 함께 완료하려는 동작을 중괄호 `{}` 안에 정의하세요.

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    do {
        println("Bake a cake")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // Eat a cake
    // Eat a cake
    // Eat a cake
    // Bake a cake
    // Bake a cake
    // Bake a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-do-loop"}

조건식과 반복문에 대한 더 많은 정보와 예시는 [조건과 반복문](control-flow.md)을 참조하세요.

이제 Kotlin 제어 흐름의 기본을 알았으니, 자신만의 [함수](kotlin-tour-functions.md)를 작성하는 방법을 배울 시간입니다.

## 반복문 실습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

피자 조각을 8조각이 될 때까지 세는 프로그램이 있습니다. 이 프로그램을 두 가지 방식으로 리팩토링하세요:

*   `while` 반복문을 사용하세요.
*   `do-while` 반복문을 사용하세요.

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // 여기서부터 리팩토링 시작
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    // 여기까지 리팩토링 끝
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("There's only $pizzaSlices slice/s of pizza :(")
    }
    pizzaSlices++
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 1" id="kotlin-tour-control-flow-loops-exercise-1-solution-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("There's only $pizzaSlices slice/s of pizza :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}

```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 2" id="kotlin-tour-control-flow-loops-exercise-1-solution-2"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-2"}

[피즈버즈](https://en.wikipedia.org/wiki/Fizz_buzz) 게임을 시뮬레이션하는 프로그램을 작성하세요. 1부터 100까지 숫자를 증가시키며 출력하되, 3으로 나누어지는 숫자는 "fizz"로, 5로 나누어지는 숫자는 "buzz"로 대체해야 합니다. 3과 5 모두로 나누어지는 숫자는 "fizzbuzz"로 대체해야 합니다.

<deflist collapsible="true">
    <def title="힌트 1">
        숫자를 세기 위해 <code>for</code> 반복문을, 각 단계에서 무엇을 출력할지 결정하기 위해 <code>when</code> 식을 사용하세요. 
    </def>
</deflist>

<deflist collapsible="true">
    <def title="힌트 2">
        나눗셈의 나머지를 반환하려면 나머지 연산자 (<code>%</code>)를 사용하세요. 나머지가 0과 같은지 확인하려면 <a href="operator-overloading.md#equality-and-inequality-operators">동등 연산자</a> (<code>==</code>)를 사용하세요.
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // 여기에 코드를 작성하세요
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-2"}

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> "$number"
            }
        )
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-control-flow-loops-solution-2"}

### 연습 문제 3 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-3"}

단어 목록이 있습니다. `for`와 `if`를 사용하여 문자 `l`로 시작하는 단어만 출력하세요.

<deflist collapsible="true">
    <def title="힌트">
        <code>String</code> 타입의 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code> </a> 함수를 사용하세요. 
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // 여기에 코드를 작성하세요
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-3"}

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-control-flow-loops-solution-3"}

## 다음 단계

[함수](kotlin-tour-functions.md)