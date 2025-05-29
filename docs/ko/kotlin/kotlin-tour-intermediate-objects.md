[//]: # (title: 중급: 객체)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">수신자 지정 람다 표현식</a><br /> 
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스와 인터페이스</a><br /> 
        <img src="icon-5.svg" width="20" alt="Fourth step" /> <strong>객체</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">공개 및 특별 클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안전성</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

이 챕터에서는 객체 선언을 탐색하여 클래스에 대한 이해를 넓힐 것입니다. 이 지식은 프로젝트 전반에 걸쳐 동작을 효율적으로 관리하는 데 도움이 될 것입니다.

## 객체 선언

코틀린에서는 **객체 선언**을 사용하여 단일 인스턴스를 가진 클래스를 선언할 수 있습니다. 즉, 클래스를 선언하는 동시에 단일 인스턴스를 생성합니다. 객체 선언은 프로그램을 위한 단일 참조 지점으로 사용할 클래스를 만들거나 시스템 전반에 걸쳐 동작을 조정하려는 경우에 유용합니다.

> 쉽게 접근할 수 있는 단 하나의 인스턴스만 있는 클래스를 **싱글톤**이라고 합니다.
>
{style="tip"}

코틀린의 객체는 **지연 초기화(lazy)**되므로, 접근될 때만 생성됩니다. 또한 코틀린은 모든 객체가 스레드로부터 안전한 방식으로 생성되도록 보장하므로, 이를 수동으로 확인할 필요가 없습니다.

객체 선언을 생성하려면 `object` 키워드를 사용합니다:

```kotlin
object DoAuth {}
```

`object` 이름 뒤에 중괄호 `{}`로 정의된 객체 본문 내에 모든 프로퍼티 또는 멤버 함수를 추가합니다.

> 객체는 생성자를 가질 수 없으므로, 클래스처럼 헤더를 가지지 않습니다.
>
{style="note"}

예를 들어, 인증을 담당하는 `DoAuth`라는 객체를 만들고 싶다고 가정해 봅시다:

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // The object is created when the takeParams() function is called
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // input Auth parameters = coding_ninja:N1njaC0ding!
}
```
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

객체에는 `takeParams`라는 멤버 함수가 있으며, 이 함수는 `username`과 `password` 변수를 매개변수로 받아 콘솔에 문자열을 반환합니다. `DoAuth` 객체는 이 함수가 처음 호출될 때만 생성됩니다.

> 객체는 클래스와 인터페이스를 상속할 수 있습니다. 예시:
> 
> ```kotlin
> interface Auth {
>     fun takeParams(username: String, password: String)
> }
>
> object DoAuth : Auth {
>     override fun takeParams(username: String, password: String) {
>         println("input Auth parameters = $username:$password")
>     }
> }
> ```
>
{style="note"}

#### 데이터 객체

객체 선언의 내용을 더 쉽게 출력할 수 있도록 코틀린에는 **데이터** 객체가 있습니다. 초급 가이드에서 배운 데이터 클래스와 유사하게, 데이터 객체는 `toString()` 및 `equals()`와 같은 추가 멤버 함수를 자동으로 제공합니다.

> 데이터 클래스와 달리 데이터 객체는 단일 인스턴스만 가지며 복사할 수 없으므로, `copy()` 멤버 함수를 자동으로 제공하지 않습니다.
>
{type ="note"}

데이터 객체를 생성하려면 객체 선언과 동일한 구문을 사용하지만 `data` 키워드를 접두사로 붙입니다:

```kotlin
data object AppConfig {}
```

예시:

```kotlin
data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    // AppConfig
    
    println(AppConfig.appName)
    // My Application
}
```
{kotlin-runnable="true" id="kotlin-tour-data-objects"}

데이터 객체에 대한 자세한 내용은 [](object-declarations.md#data-objects)를 참조하세요.

#### 동반 객체

코틀린에서 클래스는 객체, 즉 **동반 객체**를 가질 수 있습니다. 클래스당 **하나의** 동반 객체만 가질 수 있습니다. 동반 객체는 클래스가 처음 참조될 때만 생성됩니다.

동반 객체 내에 선언된 모든 프로퍼티나 함수는 모든 클래스 인스턴스에서 공유됩니다.

클래스 내에 동반 객체를 생성하려면 객체 선언과 동일한 구문을 사용하지만 `companion` 키워드를 접두사로 붙입니다:

```kotlin
companion object Bonger {}
```

> 동반 객체는 이름을 가질 필요가 없습니다. 이름을 정의하지 않으면 기본값은 `Companion`입니다.
> 
{style="note"}

동반 객체의 프로퍼티나 함수에 접근하려면 클래스 이름을 참조하세요. 예시:

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // Companion object is created when the class is referenced for the
    // first time.
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

이 예시는 `Bonger`라는 동반 객체를 포함하는 `BigBen`이라는 클래스를 생성합니다. 동반 객체는 정수를 받아 해당 정수만큼 "BONG"을 콘솔에 출력하는 `getBongs()`라는 멤버 함수를 가집니다.

`main()` 함수에서 `getBongs()` 함수는 클래스 이름을 참조하여 호출됩니다. 이 시점에 동반 객체가 생성됩니다. `getBongs()` 함수는 매개변수 `12`와 함께 호출됩니다.

자세한 내용은 [](object-declarations.md#companion-objects)를 참조하세요.

## 연습

### 연습 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

커피숍을 운영하며 고객 주문을 추적하는 시스템이 있습니다. 아래 코드를 참고하여 `main()` 함수에 있는 다음 코드가 성공적으로 실행되도록 두 번째 데이터 객체 선언을 완성하세요:

|---|---|

```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // Write your code here

fun main() {
    // Print the name of each data object
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // Check if the orders are identical
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-1"}

|---|---|
```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo: Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 12.75
}

fun main() {
    // 각 데이터 객체의 이름 출력
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // 두 주문이 동일한지 확인
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-objects-solution-1"}

### 연습 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

`Vehicle` 인터페이스를 상속하는 객체 선언을 생성하여 고유한 차량 유형인 `FlyingSkateboard`를 만드세요. `main()` 함수에 있는 다음 코드가 성공적으로 실행되도록 객체에 `name` 프로퍼티와 `move()` 함수를 구현하세요:

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // Write your code here

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-2"}

|---|---|
```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"

   fun fly(): String = "Woooooooo"
}

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // 플라잉 스케이트보드: 호버 엔진으로 공중을 활공합니다
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // 플라잉 스케이트보드: 우워어어어어
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-objects-solution-2"}

### 연습 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

온도를 기록하고 싶은 앱이 있습니다. 클래스 자체는 정보를 섭씨로 저장하지만, 화씨로 인스턴스를 쉽게 생성할 수 있는 방법을 제공하고 싶습니다. `main()` 함수에 있는 다음 코드가 성공적으로 실행되도록 데이터 클래스를 완성하세요:

<deflist collapsible="true">
    <def title="힌트">
        동반 객체를 사용하세요.
    </def>
</deflist>

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // Write your code here
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C is 90.0 °F
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    companion object {
        fun fromFahrenheit(fahrenheit: Double): Temperature = Temperature((fahrenheit - 32) * 5 / 9)
    }
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C는 90.0°F입니다
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-objects-solution-3"}

## 다음 단계

[중급: 공개 및 특별 클래스](kotlin-tour-intermediate-open-special-classes.md)