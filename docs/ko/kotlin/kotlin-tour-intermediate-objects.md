[//]: # (title: 중급: 객체)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">리시버를 가진 람다 표현식</a><br /> 
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스와 인터페이스</a><br /> 
        <img src="icon-5.svg" width="20" alt="Fourth step" /> <strong>객체</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">open 클래스 및 특수 클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안전성</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

이 장에서는 객체 선언을 살펴보면서 클래스에 대한 이해를 넓힐 것입니다. 이 지식은 프로젝트 전체에서 동작을 효율적으로 관리하는 데 도움이 될 것입니다.

## 객체 선언

코틀린에서는 **객체 선언**을 사용하여 단일 인스턴스를 가진 클래스를 선언할 수 있습니다. 어떤 의미에서는 클래스를 선언하고 단일 인스턴스를 _동시에_ 생성하는 것입니다. 객체 선언은 프로그램의 단일 참조 지점으로 사용하거나 시스템 전체에서 동작을 조정하기 위한 클래스를 생성하려는 경우에 유용합니다.

> 쉽게 접근할 수 있는 단일 인스턴스만 가지는 클래스를 **싱글톤**이라고 합니다.
>
{style="tip"}

코틀린의 객체는 **지연 초기화**되며, 이는 객체가 접근할 때만 생성된다는 의미입니다. 코틀린은 또한 모든 객체가 스레드 안전한 방식으로 생성되도록 보장하므로, 이를 수동으로 확인할 필요가 없습니다.

객체 선언을 생성하려면 `object` 키워드를 사용하세요.

```kotlin
object DoAuth {}
```

`object` 이름 뒤에 중괄호 `{}`로 정의된 객체 본문 안에 프로퍼티나 멤버 함수를 추가하세요.

> 객체는 생성자를 가질 수 없으므로 클래스처럼 헤더를 가지지 않습니다.
>
{style="note"}

예를 들어, 인증을 담당하는 `DoAuth`라는 객체를 생성한다고 가정해 봅시다.

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // takeParams() 함수가 호출될 때 객체가 생성됩니다.
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // input Auth parameters = coding_ninja:N1njaC0ding!
}
```
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

이 객체는 `username`과 `password` 변수를 매개변수로 받아 콘솔에 문자열을 출력하는 `takeParams`라는 멤버 함수를 가지고 있습니다. `DoAuth` 객체는 함수가 처음 호출될 때만 생성됩니다.

> 객체는 클래스와 인터페이스를 상속할 수 있습니다. 예를 들어:
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

객체 선언의 내용을 더 쉽게 출력하기 위해 코틀린은 **데이터** 객체를 제공합니다. 초급 투어에서 배운 데이터 클래스와 유사하게, 데이터 객체는 `toString()`과 `equals()`와 같은 추가 멤버 함수가 자동으로 제공됩니다.

> 데이터 클래스와 달리, 데이터 객체는 복사할 수 없는 단일 인스턴스만 가지기 때문에 `copy()` 멤버 함수가 자동으로 제공되지 않습니다.
>
{type ="note"}

데이터 객체를 생성하려면 객체 선언과 동일한 구문을 사용하되 `data` 키워드를 접두사로 붙이세요.

```kotlin
data object AppConfig {}
```

예를 들어:

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

#### 컴패니언 객체

코틀린에서 클래스는 객체, 즉 **컴패니언** 객체를 가질 수 있습니다. 클래스당 **하나**의 컴패니언 객체만 가질 수 있습니다. 컴패니언 객체는 해당 클래스가 처음 참조될 때만 생성됩니다.

컴패니언 객체 내부에 선언된 모든 프로퍼티나 함수는 모든 클래스 인스턴스에서 공유됩니다.

클래스 내부에 컴패니언 객체를 생성하려면 객체 선언과 동일한 구문을 사용하되 `companion` 키워드를 접두사로 붙이세요.

```kotlin
companion object Bonger {}
```

> 컴패니언 객체는 이름을 가질 필요가 없습니다. 이름을 정의하지 않으면 기본값은 `Companion`입니다.
> 
{style="note"}

컴패니언 객체의 프로퍼티나 함수에 접근하려면 클래스 이름을 참조하세요. 예를 들어:

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // 컴패니언 객체는 클래스가
    // 처음 참조될 때 생성됩니다.
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

이 예시는 `Bonger`라는 컴패니언 객체를 포함하는 `BigBen`이라는 클래스를 생성합니다. 컴패니언 객체는 정수를 받아 그 정수만큼 `"BONG"`을 콘솔에 출력하는 `getBongs()`라는 멤버 함수를 가지고 있습니다.

`main()` 함수에서 `getBongs()` 함수는 클래스 이름을 참조하여 호출됩니다. 이 시점에서 컴패니언 객체가 생성됩니다. `getBongs()` 함수는 매개변수 `12`로 호출됩니다.

자세한 내용은 [](object-declarations.md#companion-objects)를 참조하세요.

## 연습 문제

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

당신은 커피숍을 운영하며 고객 주문을 추적하는 시스템을 가지고 있습니다. 아래 코드를 보고, `main()` 함수에 있는 다음 코드가 성공적으로 실행되도록 두 번째 데이터 객체의 선언을 완성하세요.

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

data object // 여기에 코드를 작성하세요

fun main() {
    // 각 데이터 객체의 이름을 출력
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
    // 각 데이터 객체의 이름을 출력
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

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

`Vehicle` 인터페이스를 상속받는 객체 선언을 만들어 `FlyingSkateboard`라는 고유한 차량 타입을 생성하세요. 다음 `main()` 함수에 있는 코드가 성공적으로 실행되도록 객체에서 `name` 프로퍼티와 `move()` 함수를 구현하세요.

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // 여기에 코드를 작성하세요

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
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-objects-solution-2"}

### 연습 문제 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

온도를 기록하는 앱이 있다고 가정해 봅시다. 클래스 자체는 정보를 섭씨로 저장하지만, 화씨로 인스턴스를 쉽게 생성하는 방법도 제공하고 싶습니다. 다음 `main()` 함수에 있는 코드가 성공적으로 실행되도록 데이터 클래스를 완성하세요.

<deflist collapsible="true">
    <def title="힌트">
        컴패니언 객체를 사용하세요.
    </def>
</deflist>

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // 여기에 코드를 작성하세요
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
    // 32.22222222222222°C is 90.0 °F
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-objects-solution-3"}

## 다음 단계

[중급: open 클래스 및 특수 클래스](kotlin-tour-intermediate-open-special-classes.md)