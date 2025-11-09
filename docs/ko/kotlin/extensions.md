[//]: # (title: 확장)

코틀린의 _확장(extensions)_은 상속이나 _데코레이터(Decorator)_와 같은 디자인 패턴을 사용하지 않고도 클래스나 인터페이스에 새로운 기능을 추가할 수 있도록 해줍니다. 이는 직접 수정할 수 없는 서드파티 라이브러리를 다룰 때 유용합니다. 일단 생성되면, 이 확장들을 마치 원래 클래스나 인터페이스의 멤버인 것처럼 호출할 수 있습니다.

가장 일반적인 형태의 확장은 [확장 함수(extension functions)](#extension-functions)와 [확장 프로퍼티(extension properties)](#extension-properties)입니다.

중요한 점은 확장이 확장하는 클래스나 인터페이스를 실제로 수정하지 않는다는 것입니다. 확장을 정의할 때, 새 멤버를 추가하는 것이 아닙니다. 단지 동일한 구문을 사용하여 새로운 함수를 호출하거나 새로운 프로퍼티에 접근할 수 있도록 만드는 것입니다.

## 리시버

확장은 항상 리시버(receiver)에서 호출됩니다. 리시버는 확장되는 클래스나 인터페이스와 동일한 타입을 가져야 합니다. 확장을 사용하려면 리시버 뒤에 `.`과 함수 또는 프로퍼티 이름을 붙여 호출합니다.

예를 들어, 표준 라이브러리의 [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html) 확장 함수는 `StringBuilder` 클래스를 확장합니다. 따라서 이 경우 리시버는 `StringBuilder` 인스턴스이며, _리시버 타입(receiver type)_은 `StringBuilder`입니다.

```kotlin
fun main() { 
//sampleStart
    // builder는 StringBuilder의 인스턴스입니다.
    val builder = StringBuilder()
        // builder에서 .appendLine() 확장 함수를 호출합니다.
        .appendLine("Hello")
        .appendLine()
        .appendLine("World")
    println(builder.toString())
    // Hello
    //
    // World
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-stringbuilder"}

## 확장 함수

자신만의 확장 함수를 만들기 전에, Kotlin [표준 라이브러리](https://kotlinlang.org/api/core/kotlin-stdlib/)에 이미 원하는 기능이 있는지 확인하세요. 표준 라이브러리는 다음과 같은 많은 유용한 확장 함수를 제공합니다.

*   컬렉션 연산: [`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html), [`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html), [`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html), [`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html), [`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html).
*   문자열로 변환: [`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html).
*   null 값 처리: [`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html).

자신만의 확장 함수를 만들려면, 함수 이름 앞에 리시버 타입을 `.`으로 붙여 접두사로 사용합니다. 이 예제에서 `.truncate()` 함수는 `String` 클래스를 확장하므로 리시버 타입은 `String`입니다.

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}") 
    // KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")
    // JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

`.truncate()` 함수는 호출된 모든 문자열을 `maxLength` 인수에 있는 숫자로 잘라내고 생략 부호 `...`를 추가합니다. 문자열이 `maxLength`보다 짧으면 함수는 원래 문자열을 반환합니다.

이 예제에서 `.displayInfo()` 함수는 `User` 인터페이스를 확장합니다.

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// User 인터페이스의 프로퍼티를 상속하고 구현합니다.
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo()) 
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()` 함수는 `RegularUser` 인스턴스의 `name`과 `email`을 포함하는 문자열을 반환합니다. 이처럼 인터페이스에 확장을 정의하는 것은 인터페이스를 구현하는 모든 타입에 한 번에 기능을 추가하고자 할 때 유용합니다.

이 예제에서 `.mostVoted()` 함수는 `Map<String, Int>` 클래스를 확장합니다.

```kotlin
fun Map<String, Int>.mostVoted(): String? {
    return maxByOrNull { (key, value) -> value }?.key
}

fun main() {
    val poll = mapOf(
        "Cats" to 37,
        "Dogs" to 58,
        "Birds" to 22
    )

    println("Top choice: ${poll.mostVoted()}") 
    // Dogs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-mostvoted"}

`.mostVoted()` 함수는 호출된 맵의 키-값 쌍을 반복하고 [`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html) 함수를 사용하여 가장 높은 값을 포함하는 쌍의 키를 반환합니다. 맵이 비어 있으면 `maxByOrNull()` 함수는 `null`을 반환합니다. `mostVoted()` 함수는 `maxByOrNull()` 함수가 null이 아닌 값을 반환할 때만 `key` 프로퍼티에 접근하기 위해 안전 호출 `?.`을 사용합니다.

### 제네릭 확장 함수

제네릭 확장 함수를 만들려면, 함수 이름 앞에 제네릭 타입 파라미터를 선언하여 리시버 타입 표현식에서 사용할 수 있도록 합니다. 이 예제에서 `.endpoints()` 함수는 `T`가 모든 타입이 될 수 있는 `List<T>`를 확장합니다.

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")
    // (Paris, Prague)
    println("First and last temperatures: $tempEndpoints") 
    // (21.0, 22.3)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-endpoints"}

`.endpoints()` 함수는 호출된 리스트의 첫 번째 요소와 마지막 요소를 포함하는 쌍을 반환합니다. 함수 본문 내부에서는 `first()` 및 `last()` 함수를 호출하고 중위 함수(infix function) `to`를 사용하여 반환된 값을 `Pair`로 결합합니다.

제네릭에 대한 자세한 내용은 [제네릭 함수](generics.md)를 참조하세요.

### 널러블 리시버

널러블 리시버 타입으로 확장 함수를 정의할 수 있습니다. 이를 통해 변수 값이 `null`이더라도 해당 함수를 호출할 수 있습니다. 리시버가 `null`이면 `this`도 `null`입니다. 함수 본문 내에서 `this == null` 검사를 사용하거나, [안전 호출 `?.`](null-safety.md#safe-call-operator) 또는 [엘비스 연산자 `?:`](null-safety.md#elvis-operator)를 사용하는 등, 함수 내에서 null 허용성을 올바르게 처리해야 합니다.

이 예제에서는 `null` 검사가 확장 함수 내부에서 이미 발생하므로, `null` 검사 없이 `.toString()` 함수를 호출할 수 있습니다.

```kotlin
fun main() {
    //sampleStart
    // 널러블 Any에 대한 확장 함수
    fun Any?.toString(): String {
        if (this == null) return "null"
        // 널 검사 후, `this`는 널 불가능 Any로 스마트 캐스트됩니다.
        // 따라서 이 호출은 일반적인 toString() 함수로 해결됩니다.
        return toString()
    }
    
    val number: Int? = 42
    val nothing: Any? = null
    
    println(number.toString())
    // 42
    println(nothing.toString()) 
    // null
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-nullable-receiver"}

### 확장 함수 또는 멤버 함수?

확장 함수와 멤버 함수의 호출 표기법이 동일하기 때문에, 컴파일러는 어떤 함수를 사용해야 하는지 어떻게 알까요? 확장 함수는 _정적으로_ 디스패치됩니다. 즉, 컴파일러는 컴파일 시점에 리시버 타입에 따라 호출할 함수를 결정합니다. 예를 들어:

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(shape: Shape) {
        println(shape.getName())
    }
    
    printClassName(Rectangle())
    // Shape
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-shape"}

이 예제에서 컴파일러는 `Shape.getName()` 확장 함수를 호출합니다. 왜냐하면 파라미터 `shape`가 `Shape` 타입으로 선언되었기 때문입니다. 확장 함수는 정적으로 해결되므로, 컴파일러는 실제 인스턴스가 아닌 선언된 타입에 따라 함수를 선택합니다.

따라서 예제에서 `Rectangle` 인스턴스를 전달하더라도, 변수가 `Shape` 타입으로 선언되었기 때문에 `.getName()` 함수는 `Shape.getName()`으로 해결됩니다.

클래스에 멤버 함수가 있고, 동일한 리시버 타입, 동일한 이름, 호환 가능한 인수를 가진 확장 함수가 있는 경우, 멤버 함수가 우선합니다. 예를 들어:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
    // Member function
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function"}

그러나 확장 함수는 이름은 같지만 _다른_ 시그니처를 가진 멤버 함수를 오버로드할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // 이름은 같지만 시그니처가 다릅니다.
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//endSample
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

이 예제에서 `Int`가 `.printFunctionType()` 함수로 전달되므로, 컴파일러는 시그니처와 일치하는 확장 함수를 선택합니다. 컴파일러는 인수를 받지 않는 멤버 함수를 무시합니다.

### 익명 확장 함수

확장 함수에 이름을 부여하지 않고 정의할 수 있습니다. 이는 전역 네임스페이스를 오염시키는 것을 피하거나 일부 확장 동작을 파라미터로 전달해야 할 때 유용합니다.

예를 들어, 데이터 클래스에 배송비를 계산하는 일회성 함수를 이름 없이 추가하고 싶다고 가정해 봅시다.

```kotlin
fun main() {
    //sampleStart
    data class Order(val weight: Double)
    val calculateShipping = fun Order.(rate: Double): Double = this.weight * rate
    
    val order = Order(2.5)
    val cost = order.calculateShipping(3.0)
    println("Shipping cost: $cost") 
    // Shipping cost: 7.5
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous"}

확장 동작을 파라미터로 전달하려면, 타입 주석이 있는 [람다 식(lambda expression)](lambdas.md#lambda-expression-syntax)을 사용합니다. 예를 들어, 명명된 함수를 정의하지 않고 숫자가 특정 범위 내에 있는지 확인하고 싶다고 가정해 봅시다.

```kotlin
fun main() {
    val isInRange: Int.(min: Int, max: Int) -> Boolean = { min, max -> this in min..max }

    println(5.isInRange(1, 10))
    // true
    println(20.isInRange(1, 10))
    // false
}
```
 {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous-lambda"}

이 예제에서 `isInRange` 변수는 `Int.(min: Int, max: Int) -> Boolean` 타입의 함수를 가집니다. 이 타입은 `Int` 클래스에 대한 확장 함수로, `min`과 `max` 파라미터를 받고 `Boolean`을 반환합니다.

람다 본문 `{ min, max -> this in min..max }`는 함수가 호출된 `Int` 값이 `min`과 `max` 파라미터 사이의 범위에 속하는지 확인합니다. 확인에 성공하면 람다는 `true`를 반환합니다.

자세한 내용은 [람다 식과 익명 함수](lambdas.md)를 참조하세요.

## 확장 프로퍼티

코틀린은 확장 프로퍼티도 지원하며, 이는 작업 중인 클래스를 복잡하게 만들지 않고 데이터 변환을 수행하거나 UI 표시 도우미를 만드는 데 유용합니다.

확장 프로퍼티를 만들려면 확장하려는 클래스의 이름을 쓰고 `.`과 프로퍼티 이름을 이어서 작성합니다.

예를 들어, 이름과 성을 가진 사용자를 나타내는 데이터 클래스가 있고, 접근 시 이메일 스타일의 사용자 이름을 반환하는 프로퍼티를 만들고 싶다고 가정해 봅시다. 코드는 다음과 같을 수 있습니다.

```kotlin
data class User(val firstName: String, val lastName: String)

// 사용자 이름 스타일의 이메일 핸들을 얻기 위한 확장 프로퍼티
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // 확장 프로퍼티를 호출합니다.
    println("Generated email username: ${user.emailUsername}")
    // Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

확장은 클래스에 실제로 멤버를 추가하지 않으므로, 확장 프로퍼티가 [배킹 필드(backing field)](properties.md#backing-fields)를 갖는 효율적인 방법이 없습니다. 이 때문에 확장 프로퍼티에는 초기화가 허용되지 않습니다. 명시적으로 게터와 세터를 제공함으로써만 동작을 정의할 수 있습니다. 예를 들어:

```kotlin
data class House(val streetName: String)

// 게터와 세터가 없으므로 컴파일되지 않습니다.
// var House.number = 1
// Error: Initializers are not allowed for extension properties

// 성공적으로 컴파일됩니다.
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // 기본값을 보여줍니다.
    println("Default number: ${house.number} ${house.streetName}") 
    // Default number: 1 Maple Street
    
    house.number = 99
    // Setting house number for Maple Street to 99

    // 업데이트된 번호를 보여줍니다.
    println("Updated number: ${house.number} ${house.streetName}") 
    // Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

이 예제에서 게터는 [엘비스 연산자(Elvis operator)](null-safety.md#elvis-operator)를 사용하여 `houseNumbers` 맵에 집 번호가 있으면 그 번호를 반환하고, 없으면 `1`을 반환합니다. 게터와 세터를 작성하는 방법에 대한 자세한 내용은 [커스텀 게터 및 세터](properties.md#custom-getters-and-setters)를 참조하세요.

## 동반 객체 확장

클래스가 [동반 객체(companion object)](object-declarations.md#companion-objects)를 정의하는 경우, 동반 객체에 대한 확장 함수 및 프로퍼티도 정의할 수 있습니다. 동반 객체의 일반 멤버와 마찬가지로, 클래스 이름만 한정자로 사용하여 호출할 수 있습니다. 컴파일러는 기본적으로 동반 객체를 `Companion`이라고 명명합니다.

```kotlin
class Logger {
    companion object { }
}

fun Logger.Companion.logStartupMessage() {
    println("Application started.")
}

fun main() {
    Logger.logStartupMessage()
    // Application started.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-companion-object"}

## 멤버로 확장 선언하기

다른 클래스 내부에 한 클래스에 대한 확장을 선언할 수 있습니다. 이러한 확장은 여러 _암시적 리시버(implicit receivers)_를 가집니다. 암시적 리시버는 [`this`](this-expressions.md#qualified-this)로 한정하지 않고도 멤버에 접근할 수 있는 객체입니다.

*   확장을 선언하는 클래스는 _디스패치 리시버(dispatch receiver)_입니다.
*   확장 함수의 리시버 타입은 _확장 리시버(extension receiver)_입니다.

`Connection` 클래스가 `Host` 클래스에 대한 `printConnectionString()`이라는 확장 함수를 가지는 이 예제를 고려해 봅시다.

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host는 확장 리시버입니다.
    fun Host.printConnectionString() {
        // Host.printHostname()을 호출합니다.
        printHostname() 
        print(":")
        // Connection.printPort()를 호출합니다.
        // Connection은 디스패치 리시버입니다.
        printPort()
    }

    fun connect() {
        /*...*/
        // 확장 함수를 호출합니다.
        host.printConnectionString() 
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443
    
    // Connection 외부에서는 확장 함수를 사용할 수 없으므로 오류가 발생합니다.
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

이 예제는 `printConnectionString()` 함수를 `Connection` 클래스 내부에 선언하므로, `Connection` 클래스가 디스패치 리시버입니다. 확장 함수의 리시버 타입은 `Host` 클래스이므로, `Host` 클래스는 확장 리시버입니다.

디스패치 리시버와 확장 리시버가 동일한 이름을 가진 멤버를 가지는 경우, 확장 리시버의 멤버가 우선합니다. 디스패치 리시버에 명시적으로 접근하려면 [한정된 `this` 구문(qualified `this` syntax)](this-expressions.md#qualified-this)을 사용합니다.

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // Host.toString()을 호출합니다.
        toString()
        // Connection.toString()을 호출합니다.
        this@Connection.toString()
    }
}
```

### 멤버 확장 오버라이딩

멤버 확장을 `open`으로 선언하고 서브클래스에서 오버라이드할 수 있습니다. 이는 각 서브클래스에 대한 확장 동작을 커스터마이징할 때 유용합니다. 컴파일러는 각 리시버 타입을 다르게 처리합니다.

| 리시버 타입      | 해결 시점 | 디스패치 타입 |
|--------------------|-----------------|---------------|
| 디스패치 리시버  | 런타임         | 가상       |
| 확장 리시버 | 컴파일 시점    | 정적       |

이 예제를 고려해 봅시다. `User` 클래스는 `open`이고 `Admin` 클래스는 이를 상속합니다. `NotificationSender` 클래스는 `User` 및 `Admin` 클래스 모두에 대한 `sendNotification()` 확장 함수를 정의하고, `SpecialNotificationSender` 클래스는 이들을 오버라이드합니다.

```kotlin
open class User

class Admin : User()

open class NotificationSender {
    open fun User.sendNotification() {
        println("Sending user notification from normal sender")
    }

    open fun Admin.sendNotification() {
        println("Sending admin notification from normal sender")
    }

    fun notify(user: User) {
        user.sendNotification()
    }
}

class SpecialNotificationSender : NotificationSender() {
    override fun User.sendNotification() {
        println("Sending user notification from special sender")
    }

    override fun Admin.sendNotification() {
        println("Sending admin notification from special sender")
    }
}

fun main() {
    // 디스패치 리시버는 NotificationSender입니다.
    // 확장 리시버는 User입니다.
    // NotificationSender의 User.sendNotification()으로 해결됩니다.
    NotificationSender().notify(User())
    // Sending user notification from normal sender
    
    // 디스패치 리시버는 SpecialNotificationSender입니다.
    // 확장 리시버는 User입니다.
    // SpecialNotificationSender의 User.sendNotification()으로 해결됩니다.
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender 
    
    // 디스패치 리시버는 SpecialNotificationSender입니다.
    // 확장 리시버는 Admin이 아닌 User입니다.
    // notify() 함수는 user를 User 타입으로 선언합니다.
    // SpecialNotificationSender의 User.sendNotification()으로 정적으로 해결됩니다.
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

디스패치 리시버는 가상 디스패치를 사용하여 런타임에 해결되며, 이는 `main()` 함수에서의 동작을 더 쉽게 이해할 수 있게 합니다. 놀라울 수 있는 점은 `Admin` 인스턴스에서 `notify()` 함수를 호출할 때, 컴파일러는 선언된 타입인 `user: User`를 기반으로 확장을 선택한다는 것입니다. 왜냐하면 확장 리시버는 정적으로 해결되기 때문입니다.

## 확장과 가시성 한정자

확장은 다른 클래스의 멤버로 선언된 확장을 포함하여, 동일한 스코프 내에 선언된 일반 함수와 동일한 [가시성 한정자(visibility modifiers)](visibility-modifiers.md)를 사용합니다.

예를 들어, 파일의 최상위 수준에 선언된 확장은 동일한 파일 내의 다른 `private` 최상위 선언에 접근할 수 있습니다.

```kotlin
// 파일: StringUtils.kt

private fun removeWhitespace(input: String): String {
    return input.replace("\\s".toRegex(), "")
}

fun String.cleaned(): String {
    return removeWhitespace(this)
}

fun main() {
    val rawEmail = "  user @example. com  "
    val cleaned = rawEmail.cleaned()
    println("Raw:     '$rawEmail'")
    // Raw:     '  user @example. com  '
    println("Cleaned: '$cleaned'")
    // Cleaned: 'user@example.com'
    println("Looks like an email: ${cleaned.contains("@") && cleaned.contains(".")}") 
    // Looks like an email: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-top-level"}

그리고 확장이 리시버 타입 외부에서 선언된 경우, 리시버의 `private` 또는 `protected` 멤버에 접근할 수 없습니다.

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// 클래스 외부에서 선언된 확장
fun User.isSecure(): Boolean {
    // password는 private이므로 접근할 수 없습니다.
    // return password.length >= 8

    // 대신 public 멤버에 의존합니다.
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}") 
    // Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

확장이 `internal`로 표시되면, 해당 [모듈(module)](visibility-modifiers.md#modules) 내에서만 접근 가능합니다.

```kotlin
// 네트워킹 모듈
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## 확장의 스코프

대부분의 경우 확장을 패키지 바로 아래 최상위 수준에서 정의합니다.

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

확장을 선언된 패키지 외부에서 사용하려면 호출 지점에서 임포트해야 합니다.

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

자세한 내용은 [임포트](packages.md#imports)를 참조하세요.