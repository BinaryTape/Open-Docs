[//]: # (title: 타입 검사 및 캐스트)

코틀린에서는 런타임에 타입과 관련하여 두 가지 작업을 수행할 수 있습니다. 객체가 특정 타입인지 확인하거나, 다른 타입으로 변환하는 것입니다. 타입 **검사**는 다루는 객체의 종류를 확인하는 데 도움을 주며, 타입 **캐스트**는 객체를 다른 타입으로 변환하려고 시도합니다.

> **제네릭** 타입 검사 및 캐스트(예: `List<T>`, `Map<K,V>`)에 대해 자세히 알아보려면 [제네릭 타입 검사 및 캐스트](generics.md#generics-type-checks-and-casts)를 참조하세요.
>
{style="tip"}

## `is` 및 `!is` 연산자를 사용한 검사 {id="is-and-is-operators"}

`is` 연산자(또는 그 부정 형태인 `!is`)를 사용하여 런타임에 객체가 특정 타입과 일치하는지 확인합니다.

```kotlin
fun main() {
    val input: Any = "Hello, Kotlin"

    if (input is String) {
        println("Message length: ${input.length}")
        // Message length: 13
    }

    if (input !is String) { // Same as !(input is String)
        println("Input is not a valid message")
    } else {
        println("Processing message: ${input.length} characters")
        // Processing message: 13 characters
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator"}

`is` 및 `!is` 연산자를 사용하여 객체가 하위 타입과 일치하는지 확인할 수도 있습니다.

```kotlin
interface Animal {
    val name: String
    fun speak()
}

class Dog(override val name: String) : Animal {
    override fun speak() = println("$name says: Woof!")
}

class Cat(override val name: String) : Animal {
    override fun speak() = println("$name says: Meow!")
}
//sampleStart
fun handleAnimal(animal: Animal) {
    println("Handling animal: ${animal.name}")
    animal.speak()
    
    // Use is operator to check for subtypes
    if (animal is Dog) {
        println("Special care instructions: This is a dog.")
    } else if (animal is Cat) {
        println("Special care instructions: This is a cat.")
    }
}
//sampleEnd
fun main() {
    val pets: List<Animal> = listOf(
        Dog("Buddy"),
        Cat("Whiskers"),
        Dog("Rex")
    )

    for (pet in pets) {
        handleAnimal(pet)
        println("---")
    }
    // Handling animal: Buddy
    // Buddy says: Woof!
    // Special care instructions: This is a dog.
    // ---
    // Handling animal: Whiskers
    // Whiskers says: Meow!
    // Special care instructions: This is a cat.
    // ---
    // Handling animal: Rex
    // Rex says: Woof!
    // Special care instructions: This is a dog.
    // ---
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator-subtype"}

이 예시는 `is` 연산자를 사용하여 `Animal` 클래스 인스턴스가 `Dog` 또는 `Cat` 하위 타입을 가지는지 확인하고 관련 관리 지침을 출력합니다.

객체가 선언된 타입의 상위 타입인지 확인할 수 있지만, 그 답은 항상 참이므로 그렇게 할 가치는 없습니다. 모든 클래스 인스턴스는 이미 해당 상위 타입의 인스턴스입니다.

> 런타임에 객체의 타입을 식별하려면 [리플렉션](reflection.md)을 참조하세요.
> 
{type="tip"}

## 타입 캐스트

코틀린에서 객체의 타입을 다른 타입으로 변환하는 것을 **캐스팅(casting)**이라고 합니다.

어떤 경우에는 컴파일러가 객체를 자동으로 캐스트합니다. 이를 **스마트 캐스팅(smart-casting)**이라고 합니다.

타입을 명시적으로 캐스트해야 하는 경우, `as?` 또는 `as` [캐스트 연산자](#unsafe-cast-operator)를 사용하세요.

## 스마트 캐스트

컴파일러는 변경 불가능한 값에 대한 타입 검사 및 [명시적 캐스트](#unsafe-cast-operator)를 추적하고 암시적(안전한) 캐스트를 자동으로 삽입합니다.

```kotlin
fun logMessage(data: Any) {
    // data is automatically cast to String
    if (data is String) {
        println("Received text: ${data.length} characters")
    }
}

fun main() {
    logMessage("Server started")
    // Received text: 14 characters
    logMessage(404)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast"}

컴파일러는 부정 검사 결과로 반환이 이루어지는 경우에도 캐스트가 안전하다는 것을 알 만큼 충분히 똑똑합니다.

```kotlin
fun logMessage(data: Any) {
    // data is automatically cast to String
    if (data !is String) return

    println("Received text: ${data.length} characters")
}

fun main() {
    logMessage("User signed in")
    // Received text: 14 characters
    logMessage(true)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-negative"}

### 제어 흐름

스마트 캐스트는 `if` 조건식뿐만 아니라 [`when` 식](control-flow.md#when-expressions-and-statements)에서도 작동합니다.

```kotlin
fun processInput(data: Any) {
    when (data) {
        // data is automatically cast to Int
        is Int -> println("Log: Assigned new ID ${data + 1}")
        // data is automatically cast to String
        is String -> println("Log: Received message \"$data\"")
        // data is automatically cast to IntArray
        is IntArray -> println("Log: Processed scores, total = ${data.sum()}")
    }
}

fun main() {
    processInput(1001)
    // Log: Assigned new ID 1002
    processInput("System rebooted")
    // Log: Received message "System rebooted"
    processInput(intArrayOf(10, 20, 30))
    // Log: Processed scores, total = 60
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-when"}

그리고 [`while` 루프](control-flow.md#while-loops)에서도 작동합니다.

```kotlin
sealed interface Status
data class Ok(val currentRoom: String) : Status
data object Error : Status

class RobotVacuum(val rooms: List<String>) {
    var index = 0

    fun status(): Status =
        if (index < rooms.size) Ok(rooms[index])
        else Error

    fun clean(): Status {
        println("Finished cleaning ${rooms[index]}")
        index++
        return status()
    }
}

fun main() {
    //sampleStart
    val robo = RobotVacuum(listOf("Living Room", "Kitchen", "Hallway"))

    var status: Status = robo.status()
    while (status is Ok) {
        // The compiler smart casts status to OK type, so the currentRoom
        // property is accessible.
        println("Cleaning ${status.currentRoom}...")
        status = robo.clean()
    }
    // Cleaning Living Room...
    // Finished cleaning Living Room
    // Cleaning Kitchen...
    // Finished cleaning Kitchen
    // Cleaning Hallway...
    // Finished cleaning Hallway
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-while"}

이 예시에서 봉인된 인터페이스 `Status`는 두 가지 구현을 가집니다. 데이터 클래스 `Ok`와 데이터 객체 `Error`입니다. `Ok` 데이터 클래스만이 `currentRoom` 프로퍼티를 가집니다. `while` 루프 조건이 `true`로 평가될 때, 컴파일러는 `status` 변수를 `Ok` 타입으로 스마트 캐스트하여 `currentRoom` 프로퍼티를 루프 본문 내에서 접근 가능하게 합니다.

`if`, `when` 또는 `while` 조건에서 사용하기 전에 `Boolean` 타입의 변수를 선언하면, 컴파일러가 해당 변수에 대해 수집한 모든 정보가 스마트 캐스팅을 위한 해당 블록에서 접근 가능합니다.

이는 불리언 조건을 변수로 추출하는 등의 작업을 수행할 때 유용합니다. 이렇게 하면 변수에 의미 있는 이름을 부여하여 코드 가독성을 높이고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들면 다음과 같습니다.

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}
//sampleStart
fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // The compiler can access information about
        // isCat, so it knows that animal was smart-cast
        // to the type Cat.
        // Therefore, the purr() function can be called.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 논리 연산자

컴파일러는 `&&` 또는 `||` 연산자의 왼쪽에 타입 검사(일반 또는 부정)가 있는 경우, 오른쪽에 스마트 캐스트를 수행할 수 있습니다.

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면, 가장 가까운 공통 상위 타입으로 스마트 캐스트가 이루어집니다.

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
    }
}
```

> 공통 상위 타입은 [유니온 타입](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은 [현재 코틀린에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

### 인라인 함수

컴파일러는 [인라인 함수](inline-functions.md)에 전달된 람다 함수 내에 캡처된 변수를 스마트 캐스트할 수 있습니다.

인라인 함수는 암시적인 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 갖는 것으로 취급됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 그 자리에서 호출됨을 의미합니다. 람다 함수가 그 자리에서 호출되므로 컴파일러는 람다 함수가 함수 본문에 포함된 변수에 대한 참조를 누출할 수 없다는 것을 압니다.

컴파일러는 이 지식과 다른 분석을 사용하여 캡처된 변수 중 어느 것을 스마트 캐스트하는 것이 안전한지 결정합니다. 예를 들면 다음과 같습니다.

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // The compiler knows that processor is a local variable and inlineAction()
        // is an inline function, so references to processor can't be leaked.
        // Therefore, it's safe to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 예외 처리

스마트 캐스트 정보는 `catch` 및 `finally` 블록으로 전달됩니다. 이는 컴파일러가 객체가 널 허용 타입인지 여부를 추적하므로 코드를 더 안전하게 만듭니다. 예를 들면 다음과 같습니다.

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // The compiler knows stringInput can be null
        // so stringInput stays nullable.
        println(stringInput?.length)
        // null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### 스마트 캐스트 전제 조건

스마트 캐스트는 컴파일러가 변수가 검사와 사용 사이에 변경되지 않을 것을 보장할 수 있는 경우에만 작동합니다. 다음 조건에서 사용할 수 있습니다.

<table style="none">
    <tr>
        <td>
            <code>val</code> 로컬 변수
        </td>
        <td>
            항상, 단 <a href="delegated-properties.md">로컬 위임 속성</a>은 제외합니다.
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 프로퍼티
        </td>
        <td>
            프로퍼티가 <code>private</code>, <code>internal</code>이거나, 해당 프로퍼티가 선언된 동일한 <a href="visibility-modifiers.md#modules">모듈</a>에서 검사가 수행되는 경우. <code>open</code> 프로퍼티 또는 사용자 지정 getter가 있는 프로퍼티에는 스마트 캐스트를 사용할 수 없습니다.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 로컬 변수
        </td>
        <td>
            변수가 검사와 사용 사이에 수정되지 않고, 변수를 수정하는 람다에 캡처되지 않았으며, 로컬 위임 속성이 아닌 경우.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 프로퍼티
        </td>
        <td>
            항상 불가능합니다. 변수가 다른 코드에 의해 언제든지 수정될 수 있기 때문입니다.
        </td>
    </tr>
</table>

## `as` 및 `as?` 캐스트 연산자 {id="unsafe-cast-operator"}

코틀린에는 두 가지 캐스트 연산자 `as`와 `as?`가 있습니다. 둘 다 캐스트에 사용할 수 있지만 동작이 다릅니다.

`as` 연산자를 사용한 캐스트가 실패하면 런타임에 `ClassCastException`이 발생합니다. 이것이 바로 **안전하지 않은(unsafe)** 연산자라고 불리는 이유입니다.
널이 아닌 타입으로 캐스팅할 때 `as`를 사용할 수 있습니다.

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // Casts to String successfully
    val userId = rawInput as String
    println("Logging in user with ID: $userId")
    // Logging in user with ID: user-1234

    // Triggers ClassCastException
    val wrongCast = rawInput as Int
    println("wrongCast contains: $wrongCast")
    // Exception in thread "main" java.lang.ClassCastException
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-unsafe-cast-operator" validate="false"}

대신 `as?` 연산자를 사용하고 캐스트가 실패하면 해당 연산자는 `null`을 반환합니다. 이것이 바로 **안전한(safe)** 연산자라고 불리는 이유입니다.

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // Casts to String successfully
    val userId = rawInput as? String
    println("Logging in user with ID: $userId")
    // Logging in user with ID: user-1234

    // Assigns a null value to wrongCast
    val wrongCast = rawInput as? Int
    println("wrongCast contains: $wrongCast")
    // wrongCast contains: null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-safe-cast-operator"}

널 허용 타입을 안전하게 캐스트하려면, 캐스트 실패 시 `ClassCastException` 발생을 방지하기 위해 `as?` 연산자를 사용하세요.

널 허용 타입과 함께 `as`를 사용할 _수도_ 있습니다. 이 경우 결과가 `null`이 될 수 있지만, 캐스트가 성공적이지 않으면 여전히 `ClassCastException`을 발생시킵니다. 이러한 이유로 `as?`가 더 안전한 옵션입니다.

```kotlin
fun main() {
    val config: Map<String, Any?> = mapOf(
        "username" to "kodee",
        "alias" to null,
        "loginAttempts" to 3
    )

    // Unsafely casts to a nullable String
    val username: String? = config["username"] as String?
    println("Username: $username")
    // Username: kodee

    // Unsafely casts a null value to a nullable String
    val alias: String? = config["alias"] as String?
    println("Alias: $alias")
    // Alias: null

    // Fails to cast to nullable String and throws ClassCastException
    // val unsafeAttempts: String? = config["loginAttempts"] as String?
    // println("Login attempts (unsafe): $unsafeAttempts")
    // Exception in thread "main" java.lang.ClassCastException

    // Fails to cast to nullable String and returns null
    val safeAttempts: String? = config["loginAttempts"] as? String
    println("Login attempts (safe): $safeAttempts")
    // Login attempts (safe): null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-cast-nullable-types"}

### 업캐스팅 및 다운캐스팅

코틀린에서는 객체를 상위 타입과 하위 타입으로 캐스트할 수 있습니다.

객체를 상위 클래스의 인스턴스로 캐스트하는 것을 **업캐스팅(upcasting)**이라고 합니다. 업캐스팅은 특별한 구문이나 캐스트 연산자가 필요하지 않습니다. 예를 들면 다음과 같습니다.

```kotlin
interface Animal {
    fun makeSound()
}

class Dog : Animal {
    // Implements behavior for makeSound()
    override fun makeSound() {
        println("Dog says woof!")
    }
}

fun printAnimalInfo(animal: Animal) {
    animal.makeSound()
}

fun main() {
    val dog = Dog()
    // Upcasts Dog instance to Animal
    printAnimalInfo(dog)  
    // Dog says woof!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-upcast"}

이 예시에서 `printAnimalInfo()` 함수가 `Dog` 인스턴스로 호출될 때, 컴파일러는 예상되는 매개변수 타입이 `Animal`이므로 `Dog` 인스턴스를 `Animal`로 업캐스트합니다. 실제 객체는 여전히 `Dog` 인스턴스이므로, 컴파일러는 `Dog` 클래스의 `makeSound()` 함수를 동적으로 해결하여 `"Dog says woof!"`를 출력합니다.

추상 타입에 따라 동작이 달라지는 코틀린 API에서 명시적인 업캐스팅을 흔히 볼 수 있습니다. 또한 모든 UI 요소를 상위 타입으로 취급하고 나중에 특정 하위 클래스에서 작동하는 Jetpack Compose 및 UI 툴킷에서도 일반적입니다.

```kotlin
    val textView = TextView(this)
    textView.text = "Hello, View!"

    // Upcasts from TextView to View
    val view: View = textView  

    // Use View functions
    view.setPadding(20, 20, 20, 20)
    // Activity expects a View type
    setContentView(view)
```

객체를 하위 클래스의 인스턴스로 캐스트하는 것을 **다운캐스팅(downcasting)**이라고 합니다. 다운캐스팅은 안전하지 않을 수 있으므로 명시적인 캐스트 연산자를 사용해야 합니다. 캐스트 실패 시 예외 발생을 피하려면, 캐스트가 실패할 경우 `null`을 반환하는 안전한 캐스트 연산자 `as?`를 사용하는 것이 좋습니다.

```kotlin
interface Animal {
    fun makeSound()
}

class Dog : Animal {
    override fun makeSound() {
        println("Dog says woof!")
    }

    fun bark() {
        println("BARK!")
    }
}

fun main() {
    // Creates animal as a Dog instance with Animal
    // type
    val animal: Animal = Dog()
    
    // Safely downcasts animal to Dog type
    val dog: Dog? = animal as? Dog

    // Uses a safe call to call bark() if dog isn't null
    dog?.bark()
    // "BARK!"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-downcast"}

이 예시에서 `animal`은 `Animal` 타입으로 선언되었지만, `Dog` 인스턴스를 가지고 있습니다. 코드는 `animal`을 `Dog` 타입으로 안전하게 캐스트하고 [안전 호출](null-safety.md#safe-call-operator) (`?.`)을 사용하여 `bark()` 함수에 접근합니다.

다운캐스팅은 직렬화 시 기본 클래스를 특정 하위 타입으로 역직렬화할 때 사용됩니다. 또한 상위 타입 객체를 반환하는 Java 라이브러리와 작업할 때도 흔히 사용되며, 이때 코틀린에서 다운캐스팅해야 할 수 있습니다.