---
title: "제어 흐름"
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">기본 타입(Basic types)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">컬렉션(Collections)</a><br />
        <img src="/img/icon-4.svg" width="20" alt="Fourth step" /> <strong>제어 흐름(Control flow)</strong><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">함수(Functions)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">클래스(Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null-safety</a>
</p>

:::

다른 프로그래밍 언어와 마찬가지로 Kotlin은 코드 조각이 `true`로 평가되는지 여부에 따라 결정을 내릴 수 있습니다. 이러한 코드 조각을 **조건식**이라고 합니다. 또한 Kotlin은 루프를 생성하고 반복할 수 있습니다.

## 조건식

Kotlin은 조건식을 확인하기 위해 `if` 및 `when`을 제공합니다.

:::note
`if`와 `when` 중에서 선택해야 한다면 `when`을 사용하는 것이 좋습니다. 왜냐하면:

* 코드를 더 쉽게 읽을 수 있습니다.
* 다른 분기를 더 쉽게 추가할 수 있습니다.
* 코드에서 실수를 줄일 수 있습니다.

:::

### If

`if`를 사용하려면 괄호 `()` 안에 조건식을 추가하고 결과가 true인 경우 실행할 작업을 중괄호 `{}` 안에 추가합니다.

```kotlin
fun main() {

    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1

}
```

Kotlin에는 삼항 연산자 `condition ? then : else`가 없습니다. 대신 `if`를 식으로 사용할 수 있습니다. 작업당 코드 줄이 하나만 있는 경우 중괄호 `{}`는 선택 사항입니다.

```kotlin
fun main() { 

    val a = 1
    val b = 2

    println(if (a > b) a else b) // 값 반환: 2

}
```

### When

분기가 여러 개인 조건식을 사용할 때는 `when`을 사용합니다.

`when`을 사용하는 방법:

* 평가할 값을 괄호 `()` 안에 넣습니다.
* 중괄호 `{}` 안에 분기를 넣습니다.
* 각 분기에서 `->`를 사용하여 각 검사를 검사가 성공한 경우 수행할 작업과 분리합니다.

`when`은 명령문 또는 식으로 사용할 수 있습니다. **명령문**은 아무것도 반환하지 않지만 대신 작업을 수행합니다.

다음은 `when`을 명령문으로 사용하는 예입니다.

```kotlin
fun main() {

    val obj = "Hello"

    when (obj) {
        // obj가 "1"과 같은지 확인
        "1" `->` println("One")
        // obj가 "Hello"와 같은지 확인
        "Hello" `->` println("Greeting")
        // 기본 명령문
        else `->` println("Unknown")     
    }
    // Greeting

}
```

:::note
분기 조건은 그 중 하나가 충족될 때까지 순차적으로 확인됩니다. 따라서 첫 번째로 적합한 분기만 실행됩니다.
:::

**식**은 코드에서 나중에 사용할 수 있는 값을 반환합니다.

다음은 `when`을 식으로 사용하는 예입니다. `when` 식은 변수에 즉시 할당되고 나중에 `println()` 함수와 함께 사용됩니다.

```kotlin
fun main() {

    val obj = "Hello"    
    
    val result = when (obj) {
        // obj가 "1"과 같으면 result를 "one"으로 설정
        "1" `->` "One"
        // obj가 "Hello"와 같으면 result를 "Greeting"으로 설정
        "Hello" `->` "Greeting"
        // 이전 조건이 충족되지 않으면 result를 "Unknown"으로 설정
        else `->` "Unknown"
    }
    println(result)
    // Greeting

}
```

지금까지 본 `when` 예제에는 모두 주체(`obj`)가 있었습니다. 그러나 `when`은 주체 없이도 사용할 수 있습니다.

이 예제에서는 주체 **없이** `when` 식을 사용하여 부울 식 체인을 확인합니다.

```kotlin
fun main() {
    val trafficLightState = "Red" // "Green", "Yellow" 또는 "Red"일 수 있음

    val trafficAction = when {
        trafficLightState == "Green" `->` "Go"
        trafficLightState == "Yellow" `->` "Slow down"
        trafficLightState == "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```

그러나 `trafficLightState`를 주체로 사용하여 동일한 코드를 가질 수 있습니다.

```kotlin
fun main() {
    val trafficLightState = "Red" // "Green", "Yellow" 또는 "Red"일 수 있음

    val trafficAction = when (trafficLightState) {
        "Green" `->` "Go"
        "Yellow" `->` "Slow down"
        "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```

주체를 사용하여 `when`을 사용하면 코드를 더 쉽게 읽고 유지 관리할 수 있습니다. 주체를 사용하여 `when` 식을 사용하면 Kotlin이 가능한 모든 사례가 처리되었는지 확인하는 데 도움이 됩니다. 그렇지 않으면 주체 없이 `when` 식을 사용하는 경우 else 분기를 제공해야 합니다.

## 조건식 연습

### 연습 문제 1

주사위 두 개를 던져서 같은 숫자가 나오면 이기는 간단한 게임을 만드세요. 주사위가 일치하면 `You win :)`을 출력하고 그렇지 않으면 `You lose :(`을 출력하려면 `if`를 사용합니다.

:::tip
이 연습에서는 `Random.nextInt()` 함수를 사용하여 임의의 `Int`를 제공할 수 있도록 패키지를 가져옵니다. 패키지 가져오기에 대한 자세한 내용은 [패키지 및 가져오기](packages)를 참조하세요.

:::
<h3>힌트</h3>
        주사위 결과를 비교하려면 <a href="operator-overloading#equality-and-inequality-operators">동등 연산자</a> (`==`)를 사용하세요. 
    

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // 여기에 코드를 작성하세요
}
```

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

### 연습 문제 2

`when` 식을 사용하여 게임 콘솔 버튼의 이름을 입력할 때 해당 작업을 출력하도록 다음 프로그램을 업데이트하세요.

| **버튼** | **작업**             |
|------------|------------------------|
| A          | 예                     |
| B          | 아니요                   |
| X          | 메뉴                   |
| Y          | 없음                   |
| 기타       | 해당 버튼이 없습니다. |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // 여기에 코드를 작성하세요
    )
}
```

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" `->` "Yes"
            "B" `->` "No"
            "X" `->` "Menu"
            "Y" `->` "Nothing"
            else `->` "There is no such button"
        }
    )
}
```

## 범위

루프에 대해 이야기하기 전에 루프가 반복할 범위를 구성하는 방법을 알아두면 유용합니다.

Kotlin에서 범위를 만드는 가장 일반적인 방법은 `..` 연산자를 사용하는 것입니다. 예를 들어 `1..4`는 `1, 2, 3, 4`와 같습니다.

끝 값을 포함하지 않는 범위를 선언하려면 `..<` 연산자를 사용합니다. 예를 들어 `1..&lt;4`는 `1, 2, 3`과 같습니다.

역순으로 범위를 선언하려면 `downTo`를 사용합니다. 예를 들어 `4 downTo 1`은 `4, 3, 2, 1`과 같습니다.

증분이 1이 아닌 단계로 증가하는 범위를 선언하려면 `step`과 원하는 증분 값을 사용합니다.
예를 들어 `1..5 step 2`는 `1, 3, 5`와 같습니다.

`Char` 범위에서도 동일하게 수행할 수 있습니다.

* `'a'..'d'`는 `'a', 'b', 'c', 'd'`와 같습니다.
* `'z' downTo 's' step 2`는 `'z', 'x', 'v', 't'`와 같습니다.

## 루프

프로그래밍에서 가장 일반적인 두 가지 루프 구조는 `for`와 `while`입니다. `for`를 사용하여 값 범위를 반복하고 작업을 수행합니다. `while`을 사용하여 특정 조건이 충족될 때까지 작업을 계속합니다.

### For

범위에 대한 새로운 지식을 사용하여 1에서 5까지의 숫자를 반복하고 매번 숫자를 출력하는 `for` 루프를 만들 수 있습니다.

반복기와 범위를 괄호 `()` 안에 키워드 `in`과 함께 넣습니다. 완료할 작업을 중괄호 `{}` 안에 추가합니다.

```kotlin
fun main() {

    for (number in 1..5) { 
        // number는 반복기이고 1..5는 범위입니다.
        print(number)
    }
    // 12345

}
```

컬렉션은 루프를 통해 반복할 수도 있습니다.

```kotlin
fun main() { 

    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("맛있네요, $cake 케이크입니다!")
    }
    // 맛있네요, carrot 케이크입니다!
    // 맛있네요, cheese 케이크입니다!
    // 맛있네요, chocolate 케이크입니다!

}
```

### While

`while`은 두 가지 방법으로 사용할 수 있습니다.

  * 조건식이 true인 동안 코드 블록을 실행합니다. (`while`)
  * 먼저 코드 블록을 실행한 다음 조건식을 확인합니다. (`do-while`)

첫 번째 사용 사례(`while`)에서:

* while 루프를 계속할 조건식을 괄호 `()` 안에 선언합니다.
* 완료할 작업을 중괄호 `{}` 안에 추가합니다.

다음 예제에서는 [증가 연산자](operator-overloading#increments-and-decrements) `++`를 사용하여 `cakesEaten` 변수의 값을 증가시킵니다.

:::

```kotlin
fun main() {

    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("케이크 먹기")
        cakesEaten++
    }
    // 케이크 먹기
    // 케이크 먹기
    // 케이크 먹기

}
```

두 번째 사용 사례(`do-while`)에서:

* while 루프를 계속할 조건식을 괄호 `()` 안에 선언합니다.
* 키워드 `do`와 함께 완료할 작업을 중괄호 `{}`로 정의합니다.

```kotlin
fun main() {

    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("케이크 먹기")
        cakesEaten++
    }
    do {
        println("케이크 굽기")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // 케이크 먹기
    // 케이크 먹기
    // 케이크 먹기
    // 케이크 굽기
    // 케이크 굽기
    // 케이크 굽기

}
```

조건식 및 루프에 대한 자세한 내용과 예제는 [조건 및 루프](control-flow)를 참조하세요.

이제 Kotlin 제어 흐름의 기본 사항을 알았으므로 자신만의 [함수](kotlin-tour-functions)를 작성하는 방법을 배울 차례입니다.

## 루프 연습

### 연습 문제 1

피자 조각이 8개인 온전한 피자가 될 때까지 피자 조각을 세는 프로그램이 있습니다. 이 프로그램을 두 가지 방법으로 리팩터링합니다.

* `while` 루프를 사용합니다.
* `do-while` 루프를 사용합니다.

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // 여기에서 리팩터링을 시작하세요
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    pizzaSlices++
    // 여기에서 리팩터링을 종료하세요
    println("피자 조각이 $pizzaSlices 조각 있습니다. 만세! 온전한 피자가 생겼어요! :D")
}
```

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
    }
    pizzaSlices++
    println("피자 조각이 $pizzaSlices 조각 있습니다. 만세! 온전한 피자가 생겼어요! :D")
}
```

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("피자 조각이 $pizzaSlices 조각밖에 없어요 :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("피자 조각이 $pizzaSlices 조각 있습니다. 만세! 온전한 피자가 생겼어요! :D")
}

```

### 연습 문제 2

[Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 게임을 시뮬레이션하는 프로그램을 작성하세요. 3으로 나눌 수 있는 숫자를 "fizz"라는 단어로 바꾸고 5로 나눌 수 있는 숫자를 "buzz"라는 단어로 바꾸면서 1에서 100까지 숫자를 점진적으로 출력하는 것이 과제입니다. 3과 5로 모두 나눌 수 있는 숫자는 "fizzbuzz"라는 단어로 바꿔야 합니다.
<h3>힌트 1</h3>
        `for` 루프를 사용하여 숫자를 세고 `when` 식을 사용하여 각 단계에서 출력할 항목을 결정합니다. 
<h3>힌트 2</h3>
        나누어지는 숫자의 나머지를 반환하려면 모듈로 연산자(`%`)를 사용합니다. 나머지가 0과 같은지 확인하려면 <a href="operator-overloading#equality-and-inequality-operators">동등 연산자</a>(`==`)를 사용합니다.
    

|---|---|
```kotlin
fun main() {
    // 여기에 코드를 작성하세요
}
```

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 `->` "fizzbuzz"
                number % 3 == 0 `->` "fizz"
                number % 5 == 0 `->` "buzz"
                else `->` "$number"
            }
        )
    }
}
```

### 연습 문제 3

단어 목록이 있습니다. `for`와 `if`를 사용하여 문자 `l`로 시작하는 단어만 출력합니다.
<h3>힌트</h3>
        `String` 타입에 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> `.startsWith()`
        </a> 함수를 사용합니다. 
    

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // 여기에 코드를 작성하세요
}
```

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

## 다음 단계

[함수](kotlin-tour-functions)