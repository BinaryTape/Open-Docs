[//]: # (title: 중급: 스코프 함수)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>스코프 함수</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">리시버를 사용하는 람다 표현식</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스와 인터페이스</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">객체</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">열린 클래스와 특수 클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안정성</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

이 장에서는 확장 함수에 대한 이해를 바탕으로, 스코프 함수를 사용하여 더욱 코틀린스러운(idiomatic) 코드를 작성하는 방법을 배웁니다.

## 스코프 함수

프로그래밍에서 스코프(scope)는 변수 또는 객체가 인식되는 영역을 의미합니다. 가장 일반적으로 언급되는 스코프는 전역 스코프와 지역 스코프입니다.

*   **전역 스코프** – 프로그램의 어디에서든 접근할 수 있는 변수 또는 객체입니다.
*   **지역 스코프** – 변수 또는 객체가 정의된 블록 또는 함수 내에서만 접근할 수 있습니다.

코틀린에는 객체 주변에 임시 스코프를 생성하고 일부 코드를 실행할 수 있도록 하는 스코프 함수(scope function)도 있습니다.

스코프 함수를 사용하면 임시 스코프 내에서 객체의 이름을 참조할 필요가 없으므로 코드가 더 간결해집니다. 스코프 함수에 따라 `this` 키워드를 통해 객체를 참조하거나 `it` 키워드를 통해 인자로 사용하여 객체에 접근할 수 있습니다.

코틀린에는 `let`, `apply`, `run`, `also`, `with`의 다섯 가지 스코프 함수가 있습니다.

각 스코프 함수는 람다 표현식을 받아들이고 객체 또는 람다 표현식의 결과를 반환합니다. 이 투어에서는 각 스코프 함수와 사용 방법을 설명합니다.

> Sebastian Aigner 코틀린 개발자 옹호자가 스코프 함수에 대해 강연한 [Back to the Stdlib: Making the Most of Kotlin's Standard Library](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511) 영상을 시청할 수도 있습니다.
> 
{style="tip"}

### Let

`let` 스코프 함수는 코드에서 널 검사를 수행하고 반환된 객체로 추가 작업을 수행하려는 경우에 사용합니다.

예시를 살펴보세요:

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    val address: String? = getNextAddress()
    sendNotification(address)
}
```
{validate = "false"}

이 예시에는 두 개의 함수가 있습니다:
*   함수 파라미터 `recipientAddress`를 가지며 문자열을 반환하는 `sendNotification()` 함수.
*   함수 파라미터가 없으며 문자열을 반환하는 `getNextAddress()` 함수.

이 예시는 널러블(nullable) `String` 타입을 갖는 `address` 변수를 생성합니다. 하지만 `sendNotification()` 함수를 호출할 때 문제가 발생합니다. 이 함수는 `address`가 `null` 값일 수 있다고 예상하지 않기 때문입니다. 그 결과 컴파일러는 오류를 보고합니다:

```text
Type mismatch: inferred type is String? but String was expected
```

초급 투어에서 이미 `if` 조건문을 사용하거나 [엘비스 연산자 `?:`](kotlin-tour-null-safety.md#use-elvis-operator)를 사용하여 널 검사를 수행할 수 있다는 것을 배웠습니다. 하지만 반환된 객체를 코드에서 나중에 사용하고 싶다면 어떨까요? `if` 조건문과 `else` 분기를 사용하여 이를 달성할 수 있습니다.

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() { 
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = if(address != null) {
        sendNotification(address)
    } else { null }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null-if"}

하지만 더 간결한 접근 방식은 `let` 스코프 함수를 사용하는 것입니다.

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = address?.let {
        sendNotification(it)
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null"}

이 예시는 다음과 같습니다:
*   `confirm`이라는 변수를 생성합니다.
*   `address` 변수에 대해 `let` 스코프 함수에 안전 호출을 사용합니다.
*   `let` 스코프 함수 내에 임시 스코프를 생성합니다.
*   `sendNotification()` 함수를 람다 표현식으로 `let` 스코프 함수에 전달합니다.
*   임시 스코프를 사용하여 `it`을 통해 `address` 변수를 참조합니다.
*   결과를 `confirm` 변수에 할당합니다.

이러한 접근 방식을 통해 코드는 `address` 변수가 잠재적으로 `null` 값일 수 있는 상황을 처리할 수 있으며, `confirm` 변수를 코드에서 나중에 사용할 수 있습니다.

### Apply

`apply` 스코프 함수는 코드의 나중에 객체를 초기화하는 대신, 생성 시점에 클래스 인스턴스처럼 객체를 초기화하는 데 사용합니다. 이 접근 방식은 코드를 더 읽기 쉽고 관리하기 쉽게 만듭니다.

예시를 살펴보세요:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

val client = Client()

fun main() {
    client.token = "asdf"
    client.connect()
    // connected!
    client.authenticate()
    // authenticated!
    client.getData()
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-before"}

이 예시는 `token`이라는 하나의 프로퍼티와 `connect()`, `authenticate()`, `getData()`의 세 가지 멤버 함수를 포함하는 `Client` 클래스를 가지고 있습니다.

이 예시는 `main()` 함수에서 `Client` 클래스의 인스턴스로 `client`를 생성한 후 `token` 프로퍼티를 초기화하고 멤버 함수를 호출합니다.

이 예시는 간결하지만, 실제 환경에서는 클래스 인스턴스(및 해당 멤버 함수)를 생성한 후 구성하고 사용하는 데 시간이 걸릴 수 있습니다. 하지만 `apply` 스코프 함수를 사용하면 클래스 인스턴스를 생성하고 구성하며 멤버 함수를 사용하는 모든 작업을 코드의 동일한 위치에서 할 수 있습니다:

```kotlin
class Client() {
  var token: String? = null
  fun connect() = println("connected!")
  fun authenticate() = println("authenticated!")
  fun getData(): String = "Mock data"
}
//sampleStart
val client = Client().apply {
  token = "asdf"
  connect()
  authenticate()
}

fun main() {
  client.getData()
  // connected!
  // authenticated!
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-after"}

이 예시는 다음과 같습니다:

*   `Client` 클래스의 인스턴스로 `client`를 생성합니다.
*   `client` 인스턴스에 `apply` 스코프 함수를 사용합니다.
*   `apply` 스코프 함수 내에 임시 스코프를 생성하여 `client` 인스턴스의 프로퍼티나 함수에 접근할 때 명시적으로 참조할 필요가 없도록 합니다.
*   `token` 프로퍼티를 업데이트하고 `connect()` 및 `authenticate()` 함수를 호출하는 람다 표현식을 `apply` 스코프 함수에 전달합니다.
*   `main()` 함수에서 `client` 인스턴스의 `getData()` 멤버 함수를 호출합니다.

보시다시피, 이 전략은 대규모 코드에서 작업할 때 유용합니다.

### Run

`apply`와 유사하게, `run` 스코프 함수를 사용하여 객체를 초기화할 수 있지만, `run`은 코드의 특정 시점에 객체를 초기화하고 **즉시** 결과를 계산하는 데 더 적합합니다.

`apply` 함수의 이전 예시를 이어서, 이번에는 `connect()` 및 `authenticate()` 함수를 그룹화하여 모든 요청에 대해 호출되도록 하고 싶습니다.

예를 들어:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

//sampleStart
val client: Client = Client().apply {
    token = "asdf"
}

fun main() {
    val result: String = client.run {
        connect()
        // connected!
        authenticate()
        // authenticated!
        getData()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-run"}

이 예시는 다음과 같습니다:

*   `Client` 클래스의 인스턴스로 `client`를 생성합니다.
*   `client` 인스턴스에 `apply` 스코프 함수를 사용합니다.
*   `apply` 스코프 함수 내에 임시 스코프를 생성하여 `client` 인스턴스의 프로퍼티나 함수에 접근할 때 명시적으로 참조할 필요가 없도록 합니다.
*   `token` 프로퍼티를 업데이트하는 람다 표현식을 `apply` 스코프 함수에 전달합니다.

`main()` 함수는 다음과 같습니다:

*   `String` 타입의 `result` 변수를 생성합니다.
*   `client` 인스턴스에 `run` 스코프 함수를 사용합니다.
*   `run` 스코프 함수 내에 임시 스코프를 생성하여 `client` 인스턴스의 프로퍼티나 함수에 접근할 때 명시적으로 참조할 필요가 없도록 합니다.
*   `connect()`, `authenticate()`, `getData()` 함수를 호출하는 람다 표현식을 `run` 스코프 함수에 전달합니다.
*   결과를 `result` 변수에 할당합니다.

이제 반환된 결과를 코드에서 추가로 사용할 수 있습니다.

### Also

`also` 스코프 함수는 객체에 대한 추가 작업을 완료한 다음, 로그 작성과 같이 코드에서 계속 객체를 사용하기 위해 해당 객체를 반환하는 데 사용합니다.

예시를 살펴보세요:

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .filter { it.length > 4 }
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-before"}

이 예시는 다음과 같습니다:

*   문자열 리스트를 포함하는 `medals` 변수를 생성합니다.
*   `List<String>` 타입을 갖는 `reversedLongUpperCaseMedals` 변수를 생성합니다.
*   `medals` 변수에 `.map()` 확장 함수를 사용합니다.
*   `it` 키워드를 통해 `medals`를 참조하고 `.uppercase()` 확장 함수를 호출하는 람다 표현식을 `.map()` 함수에 전달합니다.
*   `medals` 변수에 `.filter()` 확장 함수를 사용합니다.
*   `it` 키워드를 통해 `medals`를 참조하고 `medals` 변수에 포함된 리스트의 길이가 4개 항목보다 긴지 확인하는 람다 표현식을 프레디케이트(predicate)로 `.filter()` 함수에 전달합니다.
*   `medals` 변수에 `.reversed()` 확장 함수를 사용합니다.
*   결과를 `reversedLongUpperCaseMedals` 변수에 할당합니다.
*   `reversedLongUpperCaseMedals` 변수에 포함된 리스트를 출력합니다.

함수 호출 사이에 로깅을 추가하여 `medals` 변수에 어떤 일이 발생하는지 확인하면 유용할 것입니다. `also` 함수가 이를 돕습니다:

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .also { println(it) }
            // [GOLD, SILVER, BRONZE]
            .filter { it.length > 4 }
            .also { println(it) }
            // [SILVER, BRONZE]
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-after"}

이제 예시는 다음과 같습니다:

*   `medals` 변수에 `also` 스코프 함수를 사용합니다.
*   `also` 스코프 함수 내에 임시 스코프를 생성하여 `medals` 변수를 함수 파라미터로 사용할 때 명시적으로 참조할 필요가 없도록 합니다.
*   `it` 키워드를 통해 `medals` 변수를 함수 파라미터로 사용하여 `println()` 함수를 호출하는 람다 표현식을 `also` 스코프 함수에 전달합니다.

`also` 함수는 객체를 반환하므로 로깅뿐만 아니라 디버깅, 여러 작업 연결, 그리고 코드의 주요 흐름에 영향을 미치지 않는 다른 부수 효과(side-effect) 작업을 수행하는 데 유용합니다.

### With

다른 스코프 함수와 달리 `with`는 확장 함수가 아니므로 구문이 다릅니다. 리시버 객체를 `with`에 인자로 전달합니다.

객체에 대해 여러 함수를 호출하려는 경우 `with` 스코프 함수를 사용합니다.

이 예시를 살펴보세요:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    val mainMonitorPrimaryBufferBackedCanvas = Canvas()

    mainMonitorPrimaryBufferBackedCanvas.text(10, 10, "Foo")
    mainMonitorPrimaryBufferBackedCanvas.rect(20, 30, 100, 50)
    mainMonitorPrimaryBufferBackedCanvas.circ(40, 60, 25)
    mainMonitorPrimaryBufferBackedCanvas.text(15, 45, "Hello")
    mainMonitorPrimaryBufferBackedCanvas.rect(70, 80, 150, 100)
    mainMonitorPrimaryBufferBackedCanvas.circ(90, 110, 40)
    mainMonitorPrimaryBufferBackedCanvas.text(35, 55, "World")
    mainMonitorPrimaryBufferBackedCanvas.rect(120, 140, 200, 75)
    mainMonitorPrimaryBufferBackedCanvas.circ(160, 180, 55)
    mainMonitorPrimaryBufferBackedCanvas.text(50, 70, "Kotlin")
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-before"}

이 예시는 `rect()`, `circ()`, `text()`의 세 가지 멤버 함수를 갖는 `Canvas` 클래스를 생성합니다. 각 멤버 함수는 제공하는 함수 파라미터로 구성된 문장을 출력합니다.

이 예시는 `Canvas` 클래스의 인스턴스로 `mainMonitorPrimaryBufferBackedCanvas`를 생성한 후, 다른 함수 파라미터로 인스턴스에 대한 일련의 멤버 함수를 호출합니다.

이 코드가 읽기 어렵다는 것을 알 수 있습니다. `with` 함수를 사용하면 코드가 간소화됩니다:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    //sampleStart
    val mainMonitorSecondaryBufferBackedCanvas = Canvas()
    with(mainMonitorSecondaryBufferBackedCanvas) {
        text(10, 10, "Foo")
        rect(20, 30, 100, 50)
        circ(40, 60, 25)
        text(15, 45, "Hello")
        rect(70, 80, 150, 100)
        circ(90, 110, 40)
        text(35, 55, "World")
        rect(120, 140, 200, 75)
        circ(160, 180, 55)
        text(50, 70, "Kotlin")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-after"}

이 예시는 다음과 같습니다:
*   `mainMonitorSecondaryBufferBackedCanvas` 인스턴스를 리시버 객체로 사용하여 `with` 스코프 함수를 사용합니다.
*   `with` 스코프 함수 내에 임시 스코프를 생성하여 `mainMonitorSecondaryBufferBackedCanvas` 인스턴스의 멤버 함수를 호출할 때 명시적으로 참조할 필요가 없도록 합니다.
*   다른 함수 파라미터로 일련의 멤버 함수를 호출하는 람다 표현식을 `with` 스코프 함수에 전달합니다.

이제 코드가 훨씬 읽기 쉬워졌으므로 실수를 할 가능성이 줄어듭니다.

## 사용 사례 개요

이 섹션에서는 코틀린에서 사용할 수 있는 다양한 스코프 함수와 코드를 더욱 코틀린스럽게(idiomatic) 만들기 위한 주요 사용 사례를 다루었습니다. 이 표를 빠른 참조로 사용할 수 있습니다. 이 함수들을 코드에서 사용하기 위해 이 함수들이 어떻게 작동하는지에 대한 완벽한 이해가 필요하지 않다는 점을 알아두는 것이 중요합니다.

| 함수 | x 접근 방식 | 반환 값 | 사용 사례 |
|----------|-------------------|---------------|----------------------------------------------------------------------------------------------|
| `let` | `it` | 람다 결과 | 코드에서 널 검사를 수행하고 반환된 객체로 추가 작업을 수행합니다. |
| `apply` | `this` | `x` | 생성 시점에 객체를 초기화합니다. |
| `run` | `this` | 람다 결과 | 생성 시점에 객체를 초기화하고 **결과를 계산합니다.** |
| `also` | `it` | `x` | 객체를 반환하기 전에 추가 작업을 완료합니다. |
| `with` | `this` | 람다 결과 | 객체에 대해 여러 함수를 호출합니다. |

스코프 함수에 대한 자세한 내용은 [스코프 함수](scope-functions.md)를 참조하세요.

## 연습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

`.getPriceInEuros()` 함수를 안전 호출 연산자 `?.`와 `let` 스코프 함수를 사용하는 단일 표현식 함수로 다시 작성하세요.

<deflist collapsible="true">
    <def title="힌트">
        안전 호출 연산자 <code>?.</code>를 사용하여 <code>getProductInfo()</code> 함수에서 <code>priceInDollars</code> 프로퍼티에 안전하게 접근하세요. 그런 다음, <code>let</code> 스코프 함수를 사용하여 <code>priceInDollars</code> 값을 유로로 변환하세요.
    </def>
</deflist>

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

// Rewrite this function
fun Product.getPriceInEuros(): Double? {
    val info = getProductInfo()
    if (info == null) return null
    val price = info.priceInDollars
    if (price == null) return null
    return convertToEuros(price)
}

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-1"}

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

fun Product.getPriceInEuros() = getProductInfo()?.priceInDollars?.let { convertToEuros(it) }

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-scope-functions-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-2"}

사용자의 이메일 주소를 업데이트하는 `updateEmail()` 함수가 있습니다. `apply` 스코프 함수를 사용하여 이메일 주소를 업데이트하고, 그 다음 `also` 스코프 함수를 사용하여 "Updating email for user with ID: ${it.id}" 로그 메시지를 출력하세요.

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = // Write your code here

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-2"}

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = user.apply {
    this.email = newEmail
}.also { println("Updating email for user with ID: ${it.id}") }

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-scope-functions-solution-2"}

## 다음 단계

[중급: 리시버를 사용하는 람다 표현식](kotlin-tour-intermediate-lambdas-receiver.md)