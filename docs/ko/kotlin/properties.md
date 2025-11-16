[//]: # (title: 프로퍼티)

Kotlin에서 프로퍼티는 데이터에 접근하거나 데이터를 변경하는 함수를 작성하지 않고도 데이터를 저장하고 관리할 수 있도록 해줍니다.
[클래스](classes.md), [인터페이스](interfaces.md), [객체](object-declarations.md), [동반 객체](object-declarations.md#companion-objects) 내에서 프로퍼티를 사용할 수 있으며,
이러한 구조 외부에서 최상위 프로퍼티로도 사용할 수 있습니다.

모든 프로퍼티에는 이름, 타입, 그리고 게터라고 불리는 자동으로 생성된 `get()` 함수가 있습니다. 게터를 사용하여
프로퍼티의 값을 읽을 수 있습니다. 프로퍼티가 가변인 경우, 세터라고 불리는 `set()` 함수도 함께 가지며, 이를 통해
프로퍼티의 값을 변경할 수 있습니다.

> 게터와 세터는 _접근자_라고 불립니다.
>
{style="tip"}

## 프로퍼티 선언

프로퍼티는 가변(`var`)이거나 읽기 전용(`val`)일 수 있습니다.
`.kt` 파일에서 최상위 프로퍼티로 선언할 수 있습니다. 최상위 프로퍼티를 패키지에
속하는 전역 변수로 생각하십시오.

```kotlin
// File: Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

클래스, 인터페이스 또는 객체 내에서도 프로퍼티를 선언할 수 있습니다.

```kotlin
// 클래스에 프로퍼티
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// 인터페이스에 프로퍼티
interface ContactInfo {
    val email: String
}

// 객체에 프로퍼티
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// 인터페이스를 구현하는 클래스
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

프로퍼티를 사용하려면 해당 이름으로 참조하십시오.

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

interface ContactInfo {
    val email: String
}

object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}

//sampleStart
fun copyAddress(address: Address): Address {
    val result = Address()
    // 결과 인스턴스의 프로퍼티에 접근
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // 복사 인스턴스의 프로퍼티에 접근
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // Copied address: Holmes, Sherlock, Baker, London

    // Company 객체의 프로퍼티에 접근
    println("Company: ${Company.name} in ${Company.country}")
    // Company: Detective Inc. in UK
    
    val contact = PersonContact()
    // contact 인스턴스의 프로퍼티에 접근
    println("Email: ${contact.email}")
    // Email: sherlock@example.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

Kotlin에서는 코드를 안전하고 읽기 쉽게 유지하기 위해 프로퍼티를 선언할 때 초기화하는 것을 권장합니다. 하지만
특별한 경우에는 [나중에 초기화](#late-initialized-properties-and-variables)할 수도 있습니다.

컴파일러가 초기화자나 게터의 반환 타입에서 프로퍼티 타입을 추론할 수 있다면, 타입을 선언하는 것은 선택 사항입니다.

```kotlin
var initialized = 1 // The inferred type is Int
var allByDefault    // ERROR: Property must be initialized.
```
{validate="false"}

## 커스텀 게터와 세터

기본적으로 Kotlin은 게터와 세터를 자동으로 생성합니다. 유효성 검사, 서식 지정, 또는 다른 프로퍼티를 기반으로 한 계산과 같은
추가 로직이 필요할 때 자신만의 커스텀 접근자를 정의할 수 있습니다.

커스텀 게터는 프로퍼티에 접근할 때마다 실행됩니다.

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-getter"}

컴파일러가 게터에서 타입을 추론할 수 있다면 타입을 생략할 수 있습니다.

```kotlin
val area get() = this.width * this.height
```

커스텀 세터는 초기화 중을 제외하고 프로퍼티에 값을 할당할 때마다 실행됩니다.
관례적으로 세터 파라미터의 이름은 `value`이지만, 다른 이름을 선택할 수도 있습니다.

```kotlin
class Point(var x: Int, var y: Int) {
    var coordinates: String
        get() = "$x,$y"
        set(value) {
            val parts = value.split(",")
            x = parts[0].toInt()
            y = parts[1].toInt()
        }
}

fun main() {
    val location = Point(1, 2)
    println(location.coordinates) 
    // 1,2

    location.coordinates = "10,20"
    println("${location.x}, ${location.y}") 
    // 10, 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-setter"}

### 가시성 변경 또는 어노테이션 추가

Kotlin에서는 기본 구현을 대체하지 않고도 접근자 가시성을 변경하거나 [어노테이션](annotations.md)을 추가할 수 있습니다.
이러한 변경 사항을 본문 `{}` 내에서 수행할 필요는 없습니다.

접근자의 가시성을 변경하려면 `get` 또는 `set` 키워드 앞에 한정자를 사용하십시오.

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // 클래스만 잔액을 수정할 수 있음
        private set 

    fun deposit(amount: Int) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Int) {
        if (amount > 0 && amount <= balance) balance -= amount
    }
}

fun main() {
    val account = BankAccount(100)
    println("Initial balance: ${account.balance}") 
    // 100

    account.deposit(50)
    println("After deposit: ${account.balance}") 
    // 150

    account.withdraw(70)
    println("After withdrawal: ${account.balance}") 
    // 80

    // account.balance = 1000  
    // 오류: 세터가 private이므로 할당할 수 없음
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

접근자에 어노테이션을 달려면 `get` 또는 `set` 키워드 앞에 어노테이션을 사용하십시오.

```kotlin
// 게터에 적용할 수 있는 어노테이션을 정의
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // 게터에 어노테이션을 적용
        @Inject get 
}

fun main() {
    val service = Service()
    println(service.dependency)
    // Default service
    println(service::dependency.getter.annotations)
    // [@Inject()]
    println(service::dependency.setter.annotations)
    // []
}
```
{validate="false"}

이 예시는 [리플렉션](reflection.md)을 사용하여 게터와 세터에 어떤 어노테이션이 존재하는지 보여줍니다.

### 백킹 필드

Kotlin에서 접근자는 백킹 필드를 사용하여 프로퍼티의 값을 메모리에 저장합니다. 백킹 필드는
게터나 세터에 추가 로직을 넣거나, 프로퍼티가 변경될 때마다 추가 동작을 트리거하고 싶을 때 유용합니다.

백킹 필드를 직접 선언할 수는 없습니다. Kotlin은 필요할 때만 이를 생성합니다. `field` 키워드를 사용하여
접근자에서 백킹 필드를 참조할 수 있습니다.

Kotlin은 기본 게터나 세터를 사용하거나, 하나 이상의 커스텀 접근자에서 `field`를 사용하는 경우에만 백킹 필드를 생성합니다.

예를 들어, `isEmpty` 프로퍼티는 `field` 키워드 없이 커스텀 게터를 사용하므로 백킹 필드를 갖지 않습니다.

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

이 예시에서 `score` 프로퍼티는 세터가 `field` 키워드를 사용하므로 백킹 필드를 갖습니다.

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // 값을 업데이트할 때 로깅 추가
            println("Score updated to $field")
        }
}

fun main() {
    val board = Scoreboard()
    board.score = 10  
    // Score updated to 10
    board.score = 20  
    // Score updated to 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-field"}

### 백킹 프로퍼티

때로는 [백킹 필드](#backing-fields)를 사용하는 것보다 더 많은 유연성이 필요할 수 있습니다. 예를 들어, API가 있어
프로퍼티를 내부적으로는 수정할 수 있지만 외부에서는 수정할 수 없도록 하고 싶은 경우입니다. 이러한 경우,
_백킹 프로퍼티_라고 불리는 코딩 패턴을 사용할 수 있습니다.

다음 예시에서 `ShoppingCart` 클래스에는 장바구니에 있는 모든 것을 나타내는 `items` 프로퍼티가 있습니다.
`items` 프로퍼티를 클래스 외부에서는 읽기 전용으로 유지하면서도, 사용자가 `items` 프로퍼티를 직접 수정할 수 있는
"승인된" 한 가지 방법을 허용하고 싶습니다. 이를 위해 `_items`라는 private 백킹 프로퍼티와, 이 백킹 프로퍼티의 값에
위임하는 `items`라는 public 프로퍼티를 정의할 수 있습니다.

```kotlin
class ShoppingCart {
    // 백킹 프로퍼티
    private val _items = mutableListOf<String>()

    // public 읽기 전용 뷰
    val items: List<String>
        get() = _items

    fun addItem(item: String) {
        _items.add(item)
    }

    fun removeItem(item: String) {
        _items.remove(item)
    }
}

fun main() {
    val cart = ShoppingCart()
    cart.addItem("Apple")
    cart.addItem("Banana")

    println(cart.items) 
    // [Apple, Banana]
    
    cart.removeItem("Apple")
    println(cart.items) 
    // [Banana]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property"}

이 예시에서 사용자는 `addItem()` 함수를 통해서만 장바구니에 항목을 추가할 수 있지만, `items` 프로퍼티에 접근하여
무엇이 들어있는지 확인할 수는 있습니다.

> Kotlin [코딩 컨벤션](coding-conventions.md#names-for-backing-properties)을 따르려면 백킹 프로퍼티 이름에 선행 밑줄을 사용하십시오.
>
{style="tip"}

JVM에서 컴파일러는 함수 호출 오버헤드를 피하기 위해 기본 접근자를 가진 private 프로퍼티에 대한 접근을 최적화합니다.

백킹 프로퍼티는 하나 이상의 public 프로퍼티가 상태를 공유하도록 하고 싶을 때도 유용합니다. 예를 들어:

```kotlin
class Temperature {
    // 섭씨 온도를 저장하는 백킹 프로퍼티
    private var _celsius: Double = 0.0

    var celsius: Double
        get() = _celsius
        set(value) { _celsius = value }

    var fahrenheit: Double
        get() = _celsius * 9 / 5 + 32
        set(value) { _celsius = (value - 32) * 5 / 9 }
}

fun main() {
    val temp = Temperature()
    temp.celsius = 25.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 25.0°C = 77.0°F

    temp.fahrenheit = 212.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 100.0°C = 212.0°F
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-multiple-properties"}

이 예시에서 `_celsius` 백킹 프로퍼티는 `celsius`와 `fahrenheit` 프로퍼티 모두에서 접근됩니다. 이 설정은
두 개의 public 뷰를 가진 단일 진실의 원천을 제공합니다.

## 컴파일 시간 상수

읽기 전용 프로퍼티의 값이 컴파일 시점에 알려진 경우, `const` 한정자를 사용하여 이를 _컴파일 시간 상수_로 표시하십시오.
컴파일 시간 상수는 컴파일 시점에 인라인되므로, 각 참조는 실제 값으로 대체됩니다. 게터가 호출되지 않으므로
더 효율적으로 접근됩니다.

```kotlin
// 파일: AppConfig.kt
package com.example

// 컴파일 시간 상수
const val MAX_LOGIN_ATTEMPTS = 3
```

컴파일 시간 상수는 다음 요구 사항을 충족해야 합니다.

*   최상위 프로퍼티이거나, [`object` 선언](object-declarations.md#object-declarations-overview) 또는 [동반 객체](object-declarations.md#companion-objects)의 멤버여야 합니다.
*   `String` 타입 또는 [원시 타입](types-overview.md)의 값으로 초기화되어야 합니다.
*   커스텀 게터를 가질 수 없습니다.

컴파일 시간 상수는 여전히 백킹 필드를 가지므로, [리플렉션](reflection.md)을 사용하여 상호 작용할 수 있습니다.

이러한 프로퍼티는 어노테이션에서도 사용될 수 있습니다.

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 지연 초기화 프로퍼티와 변수

일반적으로 프로퍼티는 생성자에서 초기화해야 합니다.
하지만 이것이 항상 편리한 것은 아닙니다. 예를 들어, 의존성 주입을 통해 또는 유닛 테스트의 설정 메서드 내에서
프로퍼티를 초기화할 수 있습니다.

이러한 상황을 처리하려면 프로퍼티를 `lateinit` 한정자로 표시하십시오.

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // null 또는 초기화 여부 확인 없이 orderService를 직접 호출
        orderService.processOrder()  
    }
}
```

`lateinit` 한정자는 다음과 같이 선언된 `var` 프로퍼티에 사용할 수 있습니다.

*   최상위 프로퍼티.
*   지역 변수.
*   클래스 본문 내부의 프로퍼티.

클래스 프로퍼티의 경우:

*   주 생성자에서 선언할 수 없습니다.
*   커스텀 게터나 세터를 가질 수 없습니다.

모든 경우에 프로퍼티나 변수는 널 불가능해야 하며, [원시 타입](types-overview.md)이어서는 안 됩니다.

`lateinit` 프로퍼티에 초기화하기 전에 접근하면, Kotlin은 접근되는 초기화되지 않은 프로퍼티를 명확하게 식별하는
특정 예외를 발생시킵니다.

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // 초기화되기 전에 접근되었으므로 예외를 발생시킴
        println(report)
    }
}

fun main() {
    val generator = ReportGenerator()
    generator.printReport()
    // Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property report has not been initialized
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property" validate="false"}

`lateinit var`가 이미 초기화되었는지 확인하려면, 해당 프로퍼티에 대한 [참조](reflection.md#property-references)에
[`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html) 프로퍼티를 사용하십시오.

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // 프로퍼티가 초기화되었는지 확인
        if (this::latestReading.isInitialized) {
            println("Latest reading: $latestReading")
        } else {
            println("No reading available")
        }
    }
}

fun main() {
    val station = WeatherStation()

    station.printReading()
    // No reading available
    station.latestReading = "22°C, sunny"
    station.printReading()
    // Latest reading: 22°C, sunny
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property-check-initialization"}

`isInitialized`는 코드에서 해당 프로퍼티에 이미 접근할 수 있는 경우에만 사용할 수 있습니다. 프로퍼티는
같은 클래스, 외부 클래스, 또는 같은 파일의 최상위 프로퍼티로 선언되어야 합니다.

## 프로퍼티 오버라이딩

[프로퍼티 오버라이딩](inheritance.md#overriding-properties)을 참조하십시오.

## 위임된 프로퍼티

로직을 재사용하고 코드 중복을 줄이기 위해, 프로퍼티의 게터와 세터 책임을 별도의 객체에 위임할 수 있습니다.

접근자 동작을 위임하면 프로퍼티의 접근자 로직이 중앙 집중화되어 재사용하기가 더 쉬워집니다. 이 접근 방식은
다음과 같은 동작을 구현할 때 유용합니다.

*   값 지연 계산.
*   주어진 키로 맵에서 값 읽기.
*   데이터베이스 접근.
*   프로퍼티에 접근할 때 리스너에게 알림.

이러한 일반적인 동작은 라이브러리로 직접 구현하거나 외부 라이브러리에서 제공하는 기존 위임(delegates)을 사용할 수 있습니다.
자세한 내용은 [위임된 프로퍼티](delegated-properties.md)를 참조하십시오.