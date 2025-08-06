[//]: # (title: 객체 선언과 표현식)

Kotlin에서 객체는 클래스를 정의하고 그 인스턴스를 한 번에 생성할 수 있게 해줍니다. 이는 재사용 가능한 싱글톤 인스턴스 또는 일회성 객체가 필요할 때 유용합니다. 이러한 시나리오를 처리하기 위해 Kotlin은 싱글톤을 생성하는 _객체 선언(object declarations)_과 익명으로 한 번만 사용되는 객체를 생성하는 _객체 표현식(object expressions)_이라는 두 가지 핵심 접근 방식을 제공합니다.

> 싱글톤은 클래스가 단 하나의 인스턴스만 갖도록 보장하고, 해당 인스턴스에 대한 전역 접근 지점을 제공합니다.
>
{style="tip"}

객체 선언과 객체 표현식은 다음과 같은 시나리오에서 가장 효과적으로 사용됩니다.

*   **공유 리소스를 위한 싱글톤 사용:** 애플리케이션 전체에 걸쳐 클래스의 인스턴스가 하나만 존재하도록 보장해야 할 때. 예를 들어, 데이터베이스 연결 풀 관리.
*   **팩토리 메서드 생성:** 인스턴스를 효율적으로 생성하는 편리한 방법이 필요할 때. [컴패니언 객체](#companion-objects)를 사용하면 클래스에 묶인 클래스 수준 함수와 프로퍼티를 정의하여 이러한 인스턴스의 생성 및 관리를 간소화할 수 있습니다.
*   **기존 클래스 동작 임시 수정:** 새 서브클래스를 생성할 필요 없이 기존 클래스의 동작을 수정하고 싶을 때. 예를 들어, 특정 작업을 위해 객체에 임시 기능을 추가하는 경우.
*   **타입 안전 설계 필요:** 객체 표현식을 사용하여 인터페이스 또는 [추상 클래스](classes.md#abstract-classes)의 일회성 구현이 필요할 때. 이는 버튼 클릭 핸들러와 같은 시나리오에서 유용할 수 있습니다.

## 객체 선언
{id="object-declarations-overview"}

Kotlin에서는 `object` 키워드 뒤에 항상 이름이 오는 객체 선언(object declarations)을 사용하여 객체의 단일 인스턴스를 생성할 수 있습니다. 이는 클래스를 정의하고 그 인스턴스를 한 번에 생성할 수 있게 해주며, 싱글톤을 구현하는 데 유용합니다.

```kotlin
//sampleStart
// Declares a Singleton object to manage data providers
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // Registers a new data provider
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // Retrieves all registered data providers
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// Example data provider interface
interface DataProvider {
    fun provideData(): String
}

// Example data provider implementation
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // Creates an instance of ExampleDataProvider
    val exampleProvider = ExampleDataProvider()

    // To refer to the object, use its name directly
    DataProviderManager.registerDataProvider(exampleProvider)

    // Retrieves and prints all data providers
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 객체 선언의 초기화는 스레드 안전하며 첫 접근 시 이루어집니다.
>
{style="tip"}

`object`를 참조하려면 그 이름을 직접 사용합니다.

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

객체 선언은 [익명 객체가 기존 클래스를 상속하거나 인터페이스를 구현하는 방식](#inherit-anonymous-objects-from-supertypes)과 유사하게 슈퍼타입을 가질 수 있습니다.

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

변수 선언과 마찬가지로, 객체 선언은 표현식이 아니므로 대입문의 우측에 사용될 수 없습니다.

```kotlin
// Syntax error: An object expression cannot bind a name.
val myObject = object MySingleton {
    val name = "Singleton"
}
```
객체 선언은 로컬일 수 없습니다. 즉, 함수 내에 직접 중첩될 수 없습니다. 하지만 다른 객체 선언이나 비-내부(non-inner) 클래스 내에 중첩될 수 있습니다.

### 데이터 객체

Kotlin에서 일반 객체 선언을 출력할 때, 문자열 표현은 이름과 `object`의 해시값을 모두 포함합니다.

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

하지만 `data` 수식어로 객체 선언을 마킹하면, 컴파일러에게 [데이터 클래스](data-classes.md)와 동일하게 `toString()`을 호출할 때 객체의 실제 이름을 반환하도록 지시할 수 있습니다.

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject) 
    // MyDataObject
}
```
{kotlin-runnable="true" id="object-declaration-dataobject"}

또한 컴파일러는 `data object`를 위해 여러 함수를 생성합니다.

*   `toString()`은 데이터 객체의 이름을 반환합니다.
*   `equals()`/`hashCode()`는 동일성 검사 및 해시 기반 컬렉션을 가능하게 합니다.

    > `data object`에 대해 커스텀 `equals` 또는 `hashCode` 구현을 제공할 수 없습니다.
    >
    {style="note"}

`data object`의 `equals()` 함수는 `data object`의 타입을 가진 모든 객체가 동일하게 간주되도록 보장합니다. 대부분의 경우 `data object`는 싱글톤을 선언하기 때문에 런타임에 `data object`의 단일 인스턴스만 가지게 됩니다. 하지만 런타임에 동일한 타입의 다른 객체가 생성되는 예외적인 경우(예: `java.lang.reflect`를 사용한 플랫폼 리플렉션이나 이 API를 내부적으로 사용하는 JVM 직렬화 라이브러리를 통해)에도, 이는 객체들이 동일하게 처리되도록 보장합니다.

> `data object`는 구조적으로만 비교(`==` 연산자 사용)하고 참조적으로는 비교하지 않도록(`===` 연산자 사용 안 함) 하십시오.
> 이는 런타임에 `data object`의 인스턴스가 두 개 이상 존재할 때 발생할 수 있는 함정을 피하는 데 도움이 됩니다.
>
{style="warning"}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) 
    // MySingleton

    println(evilTwin) 
    // MySingleton

    // Even when a library forcefully creates a second instance of MySingleton, 
    // its equals() function returns true:
    println(MySingleton == evilTwin) 
    // true

    // Don't compare data objects using ===
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin reflection does not permit the instantiation of data objects.
    // This creates a new MySingleton instance "by force" (using Java platform reflection)
    // Don't do this yourself!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

생성된 `hashCode()` 함수는 `equals()` 함수와 일관된 동작을 가지므로, `data object`의 모든 런타임 인스턴스가 동일한 해시 코드를 가집니다.

#### 데이터 객체와 데이터 클래스의 차이점

`data object`와 `data class` 선언은 종종 함께 사용되며 일부 유사점이 있지만, `data object`에는 생성되지 않는 몇 가지 함수가 있습니다.

*   `copy()` 함수 없음. `data object` 선언은 싱글톤으로 사용되도록 의도되었으므로 `copy()` 함수가 생성되지 않습니다. 싱글톤은 클래스의 인스턴스화를 단일 인스턴스로 제한하는데, 인스턴스 복사본 생성을 허용하면 이 제한이 위반될 것입니다.
*   `componentN()` 함수 없음. `data class`와 달리 `data object`는 어떤 데이터 프로퍼티도 가지지 않습니다. 데이터 프로퍼티가 없는 객체를 구조 분해하려는 시도는 의미가 없으므로 `componentN()` 함수가 생성되지 않습니다.

#### 봉인된 계층 구조에서 데이터 객체 사용

데이터 객체 선언은 [봉인된 클래스 또는 봉인된 인터페이스](sealed-classes.md)와 같은 봉인된 계층 구조에 특히 유용합니다. 이는 객체와 함께 정의했을 수 있는 모든 데이터 클래스와 대칭성을 유지할 수 있게 해줍니다.

이 예시에서 `EndOfFile`을 일반 `object` 대신 `data object`로 선언하면, `toString()` 함수를 수동으로 오버라이드할 필요 없이 자동으로 갖게 됩니다.

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) 
    // Number(number=7)
    println(EndOfFile) 
    // EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### 컴패니언 객체

_컴패니언 객체(Companion objects)_는 클래스 수준 함수와 프로퍼티를 정의할 수 있게 해줍니다. 이를 통해 팩토리 메서드를 생성하고, 상수를 보유하며, 공유 유틸리티에 접근하기 쉬워집니다.

클래스 내부의 객체 선언은 `companion` 키워드로 마킹될 수 있습니다.

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object`의 멤버는 클래스 이름을 한정자로 사용하여 간단하게 호출할 수 있습니다.

```kotlin
class User(val name: String) {
    // Defines a companion object that acts as a factory for creating User instances
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // Calls the companion object's factory method using the class name as the qualifier. 
    // Creates a new User instance
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object`의 이름은 생략될 수 있으며, 이 경우 `Companion`이라는 이름이 사용됩니다.

```kotlin
class User(val name: String) {
    // Defines a companion object without a name
    companion object { }
}

// Accesses the companion object
val companionUser = User.Companion
```

클래스 멤버는 해당 `companion object`의 `private` 멤버에 접근할 수 있습니다.

```kotlin
class User(val name: String) {
    companion object {
        private val defaultGreeting = "Hello"
    }

    fun sayHi() {
        println(defaultGreeting)
    }
}
User("Nick").sayHi()
// Hello
```

클래스 이름이 단독으로 사용될 때, 컴패니언 객체의 이름 지정 여부와 관계없이 해당 클래스의 컴패니언 객체에 대한 참조 역할을 합니다.

```kotlin
//sampleStart
class User1 {
    // Defines a named companion object
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// References the companion object of User1 using the class name
val reference1 = User1

class User2 {
    // Defines an unnamed companion object
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// References the companion object of User2 using the class name
val reference2 = User2
//sampleEnd

fun main() {
    // Calls the show() function from the companion object of User1
    println(reference1.show()) 
    // User1's Named Companion Object

    // Calls the show() function from the companion object of User2
    println(reference2.show()) 
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

Kotlin의 컴패니언 객체 멤버는 다른 언어의 정적 멤버처럼 보이지만, 실제로는 컴패니언 객체의 인스턴스 멤버이며, 즉 객체 자체에 속합니다. 이를 통해 컴패니언 객체가 인터페이스를 구현할 수 있습니다.

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Defines a companion object that implements the Factory interface
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // Uses the companion object as a Factory
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

하지만 JVM에서는 `@JvmStatic` 어노테이션을 사용하면 컴패니언 객체의 멤버를 실제 정적 메서드 및 필드로 생성할 수 있습니다. 자세한 내용은 [Java 상호 운용성](java-to-kotlin-interop.md#static-fields) 섹션을 참조하십시오.

## 객체 표현식

객체 표현식은 클래스를 선언하고 해당 클래스의 인스턴스를 생성하지만, 클래스나 인스턴스에 이름을 부여하지 않습니다. 이러한 클래스는 일회성 사용에 유용합니다. 이들은 처음부터 생성되거나, 기존 클래스를 상속하거나, 인터페이스를 구현할 수 있습니다. 이러한 클래스의 인스턴스는 이름이 아닌 표현식으로 정의되기 때문에 _익명 객체(anonymous objects)_라고도 불립니다.

### 익명 객체 처음부터 생성

객체 표현식은 `object` 키워드로 시작합니다. 객체가 어떤 클래스도 확장하거나 인터페이스를 구현하지 않는 경우, `object` 키워드 뒤에 오는 중괄호 안에 객체의 멤버를 직접 정의할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // Object expressions extend the Any class, which already has a toString() function,
        // so it must be overridden
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### 슈퍼타입으로부터 익명 객체 상속

특정 타입(또는 타입들)을 상속하는 익명 객체를 생성하려면, `object` 뒤에 콜론 `:`과 함께 해당 타입을 지정합니다. 그런 다음 마치 해당 클래스를 [상속](inheritance.md)하는 것처럼 이 클래스의 멤버를 구현하거나 오버라이드합니다.

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

슈퍼타입에 생성자가 있다면, 적절한 생성자 매개변수를 전달합니다. 콜론 뒤에 쉼표로 구분하여 여러 슈퍼타입을 지정할 수 있습니다.

```kotlin
//sampleStart
// Creates an open class BankAccount with a balance property
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// Defines an interface Transaction with an execute() function
interface Transaction {
    fun execute()
}

// A function to perform a special transaction on a BankAccount
fun specialTransaction(account: BankAccount) {
    // Creates an anonymous object that inherits from the BankAccount class and implements the Transaction interface
    // The balance of the provided account is passed to the BankAccount superclass constructor
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // Temporary bonus

        // Implements the execute() function from the Transaction interface
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // Executes the transaction
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // Creates a BankAccount with an initial balance of 1000
    val myAccount = BankAccount(1000)
    // Performs a special transaction on the created account
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 반환 및 값 타입으로 익명 객체 사용

로컬 또는 [`private`](visibility-modifiers.md#packages) 함수나 프로퍼티에서 익명 객체를 반환할 때, 해당 익명 객체의 모든 멤버는 그 함수나 프로퍼티를 통해 접근할 수 있습니다.

```kotlin
//sampleStart
class UserPreferences {
    private fun getPreferences() = object {
        val theme: String = "Dark"
        val fontSize: Int = 14
    }

    fun printPreferences() {
        val preferences = getPreferences()
        println("Theme: ${preferences.theme}, Font Size: ${preferences.fontSize}")
    }
}
//sampleEnd

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // Theme: Dark, Font Size: 14
}
```
{kotlin-runnable="true" id="object-expression-object-return"}

이는 특정 프로퍼티를 가진 익명 객체를 반환할 수 있게 하여, 별도의 클래스를 생성할 필요 없이 데이터나 동작을 캡슐화하는 간단한 방법을 제공합니다.

익명 객체를 반환하는 함수나 프로퍼티가 `public`, `protected` 또는 `internal` 가시성을 가질 경우, 실제 타입은 다음과 같습니다.

*   익명 객체에 선언된 슈퍼타입이 없는 경우 `Any`.
*   익명 객체에 선언된 슈퍼타입이 정확히 하나만 있는 경우 해당 슈퍼타입.
*   선언된 슈퍼타입이 두 개 이상인 경우 명시적으로 선언된 타입.

이 모든 경우에 익명 객체에 추가된 멤버는 접근할 수 없습니다. 오버라이드된 멤버는 함수나 프로퍼티의 실제 타입에 선언된 경우 접근할 수 있습니다. 예를 들어:

```kotlin
//sampleStart
interface Notification {
    // Declares notifyUser() in the Notification interface
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // The return type is Any. The message property is not accessible.
    // When the return type is Any, only members of the Any class are accessible.
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // The return type is Notification because the anonymous object implements only one interface
    // The notifyUser() function is accessible because it is part of the Notification interface
    // The message property is not accessible because it is not declared in the Notification interface
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // The return type is DetailedNotification. The notifyUser() function and the message property are not accessible
    // Only members declared in the DetailedNotification interface are accessible
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // This produces no output
    val notificationManager = NotificationManager()

    // The message property is not accessible here because the return type is Any
    // This produces no output
    val notification = notificationManager.getNotification()

    // The notifyUser() function is accessible
    // The message property is not accessible here because the return type is Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // The notifyUser() function and message property are not accessible here because the return type is DetailedNotification
    // This produces no output
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 익명 객체에서 변수 접근

객체 표현식 본문 내의 코드는 둘러싸는 스코프의 변수에 접근할 수 있습니다.

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter provides default implementations for mouse event functions
    // Simulates MouseAdapter handling mouse events
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // The clickCount and enterCount variables are accessible within the object expression
}
```

## 객체 선언과 표현식 간의 동작 차이

객체 선언과 객체 표현식 간에는 초기화 동작에 차이가 있습니다.

*   객체 표현식은 사용되는 곳에서 _즉시_ 실행(및 초기화)됩니다.
*   객체 선언은 첫 접근 시 _지연(lazily)_ 초기화됩니다.
*   컴패니언 객체는 해당 클래스가 로드(해결)될 때 초기화되며, 이는 Java 정적 초기화 프로그램의 의미론과 일치합니다.