[//]: # (title: 중급: 클래스와 인터페이스)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">리시버가 있는 람다 식</a><br />
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>클래스와 인터페이스</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">객체</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">열린(open) 클래스 및 특별한 클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안정성</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

초급 과정에서는 클래스와 데이터 클래스를 사용하여 데이터를 저장하고 코드에서 공유할 수 있는 특성 모음을 유지하는 방법을 배웠습니다. 결국 프로젝트 내에서 코드를 효율적으로 공유하기 위한 계층 구조를 만들고 싶을 것입니다. 이 장에서는 Kotlin이 코드를 공유하기 위해 제공하는 옵션과 이를 통해 코드를 더 안전하고 유지 관리하기 쉽게 만드는 방법을 설명합니다.

## 클래스 상속

이전 장에서는 원본 소스 코드를 수정하지 않고 클래스를 확장하는 데 확장 함수를 사용하는 방법을 다루었습니다. 하지만 클래스 **간에** 코드를 공유하는 것이 유용한 복잡한 작업을 하고 있다면 어떨까요? 이러한 경우 클래스 상속을 사용할 수 있습니다.

기본적으로 Kotlin의 클래스는 상속될 수 없습니다. Kotlin은 의도치 않은 상속을 방지하고 클래스를 더 쉽게 유지 관리할 수 있도록 이러한 방식으로 설계되었습니다.

Kotlin 클래스는 **단일 상속**만 지원합니다. 즉, **한 번에 하나의 클래스**에서만 상속할 수 있습니다. 이 클래스를 **부모**라고 부릅니다.

클래스의 부모는 다른 클래스(조상)에서 상속받아 계층 구조를 형성합니다. Kotlin 클래스 계층 구조의 최상위에는 공통 부모 클래스인 `Any`가 있습니다. 모든 클래스는 궁극적으로 `Any` 클래스에서 상속받습니다.

![An example of the class hierarchy with Any type](any-type-class.png){width="200"}

`Any` 클래스는 `toString()` 함수를 멤버 함수로 자동으로 제공합니다. 따라서 모든 클래스에서 이 상속된 함수를 사용할 수 있습니다. 예를 들어 다음과 같습니다.

```kotlin
class Car(val make: String, val model: String, val numberOfDoors: Int)

fun main() {
    //sampleStart
    val car1 = Car("Toyota", "Corolla", 4)

    // 문자열 템플릿을 통해 .toString() 함수를 사용하여 클래스 프로퍼티를 출력합니다.
    println("Car1: make=${car1.make}, model=${car1.model}, numberOfDoors=${car1.numberOfDoors}")
    // Car1: make=Toyota, model=Corolla, numberOfDoors=4
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-any-class"}

클래스 간에 코드를 공유하기 위해 상속을 사용하려면 먼저 추상 클래스를 사용하는 것을 고려해 보세요.

### 추상 클래스

추상 클래스는 기본적으로 상속될 수 있습니다. 추상 클래스의 목적은 다른 클래스가 상속하거나 구현할 멤버를 제공하는 것입니다. 결과적으로 추상 클래스는 생성자를 가지지만, 인스턴스를 생성할 수는 없습니다. 자식 클래스 내에서 `override` 키워드를 사용하여 부모의 프로퍼티와 함수의 동작을 정의합니다. 이러한 방식으로 자식 클래스가 부모 클래스의 멤버를 "오버라이드"한다고 말할 수 있습니다.

> 상속된 함수나 프로퍼티의 동작을 정의할 때, 이를 **구현(implementation)**이라고 합니다.
>
{style="tip"}

추상 클래스는 구현이 **있는** 함수와 프로퍼티, 그리고 구현이 **없는**(추상 함수 및 프로퍼티로 알려진) 함수와 프로퍼티를 모두 포함할 수 있습니다.

추상 클래스를 생성하려면 `abstract` 키워드를 사용합니다.

```kotlin
abstract class Animal
```

구현이 **없는** 함수나 프로퍼티를 선언하려면 `abstract` 키워드를 함께 사용합니다.

```kotlin
abstract fun makeSound()
abstract val sound: String
```

예를 들어, 다른 제품 카테고리를 정의하기 위해 자식 클래스를 생성할 수 있는 `Product`라는 추상 클래스를 만들고 싶다고 가정해 봅시다.

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 제품 카테고리를 위한 추상 프로퍼티
    abstract val category: String

    // 모든 제품이 공유할 수 있는 함수
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}
```

추상 클래스에서:

*   생성자는 제품의 `name`과 `price`에 대한 두 개의 매개변수를 가집니다.
*   제품 카테고리를 문자열로 포함하는 추상 프로퍼티가 있습니다.
*   제품에 대한 정보를 출력하는 함수가 있습니다.

전자제품을 위한 자식 클래스를 만들어 봅시다. 자식 클래스에서 `category` 프로퍼티에 대한 구현을 정의하기 전에 `override` 키워드를 사용해야 합니다.

```kotlin
class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}
```

`Electronic` 클래스는 다음을 수행합니다.

*   `Product` 추상 클래스를 상속합니다.
*   생성자에 `warranty`라는 추가 매개변수를 가지며, 이는 전자제품에 특화된 것입니다.
*   `category` 프로퍼티를 오버라이드하여 문자열 `"Electronic"`을 포함합니다.

이제 이 클래스들을 다음과 같이 사용할 수 있습니다.

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 제품 카테고리를 위한 추상 프로퍼티
    abstract val category: String

    // 모든 제품이 공유할 수 있는 함수
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

//sampleStart
fun main() {
    // Electronic 클래스의 인스턴스를 생성합니다.
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)

    println(laptop.productInfo())
    // Product: Laptop, Category: Electronic, Price: 1000.0
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-abstract-class"}

추상 클래스는 이러한 방식으로 코드를 공유하는 데 훌륭하지만, Kotlin의 클래스는 단일 상속만 지원하므로 제한적입니다. 여러 소스에서 상속받아야 한다면 인터페이스 사용을 고려해 보세요.

## 인터페이스

인터페이스는 클래스와 비슷하지만 몇 가지 차이점이 있습니다.

*   인터페이스의 인스턴스를 생성할 수 없습니다. 인터페이스에는 생성자나 헤더가 없습니다.
*   인터페이스의 함수와 프로퍼티는 기본적으로 암시적으로 상속 가능합니다. Kotlin에서는 이를 "open"이라고 말합니다.
*   함수에 구현을 제공하지 않는 경우 `abstract`로 표시할 필요가 없습니다.

추상 클래스와 유사하게 인터페이스는 클래스가 나중에 상속하고 구현할 수 있는 함수 및 프로퍼티 집합을 정의하는 데 사용됩니다. 이 접근 방식을 사용하면 특정 구현 세부 정보보다는 인터페이스가 설명하는 추상화에 집중할 수 있습니다. 인터페이스를 사용하면 코드가 다음처럼 됩니다.

*   모듈화됩니다. 다양한 부분을 분리하여 독립적으로 발전시킬 수 있습니다.
*   이해하기 쉬워집니다. 관련 함수를 응집력 있는 집합으로 그룹화하여 이해도를 높입니다.
*   테스트하기 쉬워집니다. 테스트를 위해 구현을 모의(mock)로 빠르게 교체할 수 있습니다.

인터페이스를 선언하려면 `interface` 키워드를 사용합니다.

```kotlin
interface PaymentMethod
```

### 인터페이스 구현

인터페이스는 다중 상속을 지원하므로 클래스가 한 번에 여러 인터페이스를 구현할 수 있습니다. 먼저 클래스가 **하나의** 인터페이스를 구현하는 시나리오를 고려해 봅시다.

인터페이스를 구현하는 클래스를 생성하려면 클래스 헤더 뒤에 콜론을 추가하고, 이어서 구현하려는 인터페이스 이름을 넣습니다. 인터페이스는 생성자가 없으므로 인터페이스 이름 뒤에 괄호 `()`를 사용하지 않습니다.

```kotlin
class CreditCardPayment : PaymentMethod
```

예를 들어:

```kotlin
interface PaymentMethod {
    // 함수는 기본적으로 상속 가능합니다.
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        // 신용 카드로 결제를 처리하는 것을 시뮬레이션합니다.
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-inheritance"}

이 예시에서:

*   `PaymentMethod`는 구현이 없는 `initiatePayment()` 함수를 가진 인터페이스입니다.
*   `CreditCardPayment`는 `PaymentMethod` 인터페이스를 구현하는 클래스입니다.
*   `CreditCardPayment` 클래스는 상속된 `initiatePayment()` 함수를 오버라이드합니다.
*   `paymentMethod`는 `CreditCardPayment` 클래스의 인스턴스입니다.
*   오버라이드된 `initiatePayment()` 함수가 `paymentMethod` 인스턴스에서 `100.0` 매개변수와 함께 호출됩니다.

**여러** 인터페이스를 구현하는 클래스를 생성하려면 클래스 헤더 뒤에 콜론을 추가하고, 이어서 구현하려는 인터페이스 이름을 쉼표로 구분하여 나열합니다.

```kotlin
class CreditCardPayment : PaymentMethod, PaymentType
```

예를 들어:

```kotlin
interface PaymentMethod {
    fun initiatePayment(amount: Double): String
}

interface PaymentType {
    val paymentType: String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod,
    PaymentType {
    override fun initiatePayment(amount: Double): String {
        // 신용 카드로 결제를 처리하는 것을 시뮬레이션합니다.
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }

    override val paymentType: String = "Credit Card"
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.

    println("Payment is by ${paymentMethod.paymentType}")
    // Payment is by Credit Card
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-multiple-inheritance"}

이 예시에서:

*   `PaymentMethod`는 구현이 없는 `initiatePayment()` 함수를 가진 인터페이스입니다.
*   `PaymentType`은 초기화되지 않은 `paymentType` 프로퍼티를 가진 인터페이스입니다.
*   `CreditCardPayment`는 `PaymentMethod` 및 `PaymentType` 인터페이스를 구현하는 클래스입니다.
*   `CreditCardPayment` 클래스는 상속된 `initiatePayment()` 함수와 `paymentType` 프로퍼티를 오버라이드합니다.
*   `paymentMethod`는 `CreditCardPayment` 클래스의 인스턴스입니다.
*   오버라이드된 `initiatePayment()` 함수가 `paymentMethod` 인스턴스에서 `100.0` 매개변수와 함께 호출됩니다.
*   오버라이드된 `paymentType` 프로퍼티는 `paymentMethod` 인스턴스에서 접근됩니다.

인터페이스 및 인터페이스 상속에 대한 자세한 내용은 [인터페이스](interfaces.md)를 참조하세요.

## 위임

인터페이스는 유용하지만, 인터페이스에 많은 함수가 포함되어 있으면 자식 클래스에 많은 상용구 코드(boilerplate code)가 생길 수 있습니다. 부모의 동작 중 작은 부분만 오버라이드하고 싶을 때도 반복되는 코드를 많이 작성해야 합니다.

> 상용구 코드(Boilerplate code)는 소프트웨어 프로젝트의 여러 부분에서 거의 또는 전혀 변경 없이 재사용되는 코드 조각을 말합니다.
>
{style="tip"}

예를 들어, 여러 함수와 `color`라는 하나의 프로퍼티를 포함하는 `Drawable`이라는 인터페이스가 있다고 가정해 봅시다.

```kotlin
interface Drawable {
    fun draw()
    fun resize()
    val color: String?
}
```

`Drawable` 인터페이스를 구현하고 모든 멤버에 대한 구현을 제공하는 `Circle`이라는 클래스를 생성합니다.

```kotlin
class Circle : Drawable {
    override fun draw() {
        TODO("예시 구현")
    }

    override fun resize() {
        TODO("예시 구현")
    }
   override val color = null
}
```

`color` 프로퍼티의 값 **을 제외하고** `Circle` 클래스와 동일한 동작을 가진 자식 클래스를 만들고 싶다면, 여전히 `Circle` 클래스의 각 멤버 함수에 대한 구현을 추가해야 합니다.

```kotlin
class RedCircle(val circle: Circle) : Circle {

    // 상용구 코드 시작
    override fun draw() {
        circle.draw()
    }

    override fun resize() {
        circle.resize()
    }

    // 상용구 코드 끝
    override val color = "red"
}
```

`Drawable` 인터페이스에 많은 멤버 함수가 있다면 `RedCircle` 클래스의 상용구 코드 양이 매우 많아질 수 있음을 알 수 있습니다. 하지만 대안이 있습니다.

Kotlin에서는 위임(delegation)을 사용하여 인터페이스 구현을 클래스 인스턴스에 위임할 수 있습니다. 예를 들어, `Circle` 클래스의 인스턴스를 생성하고 `Circle` 클래스의 멤버 함수 구현을 이 인스턴스에 위임할 수 있습니다. 이를 위해 `by` 키워드를 사용합니다. 예를 들어 다음과 같습니다.

```kotlin
class RedCircle(param: Circle) : Drawable by param
```

여기서 `param`은 멤버 함수 구현이 위임되는 `Circle` 클래스 인스턴스의 이름입니다.

이제 `RedCircle` 클래스에 멤버 함수에 대한 구현을 추가할 필요가 없습니다. 컴파일러가 `Circle` 클래스에서 이를 자동으로 처리해 줍니다. 이렇게 하면 많은 상용구 코드를 작성할 필요가 없습니다. 대신, 자식 클래스에서 변경하려는 동작에 대해서만 코드를 추가하면 됩니다.

예를 들어, `color` 프로퍼티의 값을 변경하려는 경우:

```kotlin
class RedCircle(param : Circle) : Drawable by param {
    // 상용구 코드 없음!
    override val color = "red"
}
```

원한다면 `RedCircle` 클래스에서 상속된 멤버 함수의 동작을 오버라이드할 수도 있지만, 이제 모든 상속된 멤버 함수에 대해 새로운 코드 라인을 추가할 필요는 없습니다.

자세한 내용은 [위임](delegation.md)을 참조하세요.

## 연습

### 연습 1 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-1"}

스마트 홈 시스템을 개발하고 있다고 상상해 보세요. 스마트 홈은 일반적으로 몇 가지 기본 기능과 함께 고유한 동작을 가진 다양한 유형의 장치를 가지고 있습니다. 아래 코드 샘플에서 자식 클래스인 `SmartLight`가 성공적으로 컴파일될 수 있도록 `SmartDevice`라는 `abstract` 클래스를 완성하세요.

다음으로, `SmartDevice` 클래스를 상속하고 `turnOn()` 및 `turnOff()` 함수를 구현하는 `SmartThermostat`라는 다른 자식 클래스를 생성하세요. 이 함수들은 어떤 온도 조절기가 가열 중이거나 꺼졌는지를 설명하는 출력문을 반환해야 합니다. 마지막으로, 온도를 입력으로 받아 `$name thermostat set to $temperature°C.`를 출력하는 `adjustTemperature()` 함수를 추가하세요.

<deflist collapsible="true">
    <def title="힌트">
        `SmartDevice` 클래스에 `turnOn()` 및 `turnOff()` 함수를 추가하여 나중에 `SmartThermostat` 클래스에서 해당 동작을 오버라이드할 수 있도록 하세요.
    </def>
</deflist>

|--|--|

```kotlin
abstract class // 여기에 코드를 작성하세요

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat // 여기에 코드를 작성하세요

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")

    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-1"}

|---|---|
```kotlin
abstract class SmartDevice(val name: String) {
    abstract fun turnOn()
    abstract fun turnOff()
}

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name thermostat is now heating.")
    }

    override fun turnOff() {
        println("$name thermostat is now off.")
    }

   fun adjustTemperature(temperature: Int) {
        println("$name thermostat set to $temperature°C.")
    }
}

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")

    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-1"}

### 연습 2 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-2"}

`Audio`, `Video`, `Podcast`와 같은 특정 미디어 클래스를 구현하는 데 사용할 수 있는 `Media`라는 인터페이스를 생성하세요. 이 인터페이스에는 다음이 포함되어야 합니다.

*   미디어의 제목을 나타내는 `title`이라는 프로퍼티.
*   미디어를 재생하는 `play()`라는 함수.

그런 다음, `Media` 인터페이스를 구현하는 `Audio`라는 클래스를 생성하세요. `Audio` 클래스는 생성자에서 `title` 프로퍼티를 사용해야 하며, `String` 타입의 `composer`라는 추가 프로퍼티도 가져야 합니다. 클래스에서 `play()` 함수를 구현하여 다음을 출력하도록 하세요: `"Playing audio: $title, composed by $composer"`

<deflist collapsible="true">
    <def title="힌트">
        클래스 헤더에서 `override` 키워드를 사용하여 생성자에서 인터페이스의 프로퍼티를 구현할 수 있습니다.
    </def>
</deflist>

|---|---|
```kotlin
interface // 여기에 코드를 작성하세요

class // 여기에 코드를 작성하세요

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-2"}

|---|---|
```kotlin
interface Media {
    val title: String
    fun play()
}

class Audio(override val title: String, val composer: String) : Media {
    override fun play() {
        println("Playing audio: $title, composed by $composer")
    }
}

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-2"}

### 연습 3 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-3"}

전자상거래 애플리케이션을 위한 결제 처리 시스템을 구축하고 있습니다. 각 결제 수단은 결제를 승인하고 거래를 처리할 수 있어야 합니다. 일부 결제는 환불도 처리할 수 있어야 합니다.

1. `Refundable` 인터페이스에 환불을 처리하는 `refund()` 함수를 추가하세요.

2. `PaymentMethod` 추상 클래스에서:
   * 금액을 입력으로 받아 해당 금액을 포함하는 메시지를 출력하는 `authorize()` 함수를 추가하세요.
   * 또한 금액을 입력으로 받는 추상 함수 `processPayment()`를 추가하세요.

3. `Refundable` 인터페이스와 `PaymentMethod` 추상 클래스를 구현하는 `CreditCard`라는 클래스를 생성하세요. 이 클래스에서 `refund()` 및 `processPayment()` 함수에 대한 구현을 추가하여 다음 문장을 출력하도록 하세요.
   * `"Refunding $amount to the credit card."`
   * `"Processing credit card payment of $amount."`

|---|---|
```kotlin
interface Refundable {
    // 여기에 코드를 작성하세요
}

abstract class PaymentMethod(val name: String) {
    // 여기에 코드를 작성하세요
}

class CreditCard // 여기에 코드를 작성하세요

fun main() {
    val visa = CreditCard("Visa")

    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-3"}

|---|---|
```kotlin
interface Refundable {
    fun refund(amount: Double)
}

abstract class PaymentMethod(val name: String) {
    fun authorize(amount: Double) {
        println("Authorizing payment of $amount.")
    }

    abstract fun processPayment(amount: Double)
}

class CreditCard(name: String) : PaymentMethod(name), Refundable {
    override fun processPayment(amount: Double) {
        println("Processing credit card payment of $amount.")
    }

    override fun refund(amount: Double) {
        println("Refunding $amount to the credit card.")
    }
}

fun main() {
    val visa = CreditCard("Visa")

    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-3"}

### 연습 4 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-4"}

기본 기능이 있는 간단한 메시징 앱이 있지만, 코드를 크게 중복시키지 않고 _스마트_ 메시징 기능을 추가하고 싶습니다.

아래 코드에서 `Messenger` 인터페이스를 상속하지만 구현을 `BasicMessenger` 클래스의 인스턴스에 위임하는 `SmartMessenger`라는 클래스를 정의하세요.

`SmartMessenger` 클래스에서 `sendMessage()` 함수를 오버라이드하여 스마트 메시지를 보내세요. 이 함수는 `message`를 입력으로 받아 `"Sending a smart message: $message"`라는 출력문을 반환해야 합니다. 또한, `BasicMessenger` 클래스의 `sendMessage()` 함수를 호출하고 메시지 앞에 `[smart]`를 붙이세요.

> `SmartMessenger` 클래스에서 `receiveMessage()` 함수를 다시 작성할 필요는 없습니다.
>
{style="note"}

|--|--|

```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger // 여기에 코드를 작성하세요

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)

    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-4"}

|---|---|
```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger(val basicMessenger: BasicMessenger) : Messenger by basicMessenger {
    override fun sendMessage(message: String) {
        println("Sending a smart message: $message")
        basicMessenger.sendMessage("[smart] $message")
    }
}

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)

    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-4"}

## 다음 단계

[중급: 객체](kotlin-tour-intermediate-objects.md)