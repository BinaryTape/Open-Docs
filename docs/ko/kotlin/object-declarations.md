[//]: # (title: 객체 선언 및 표현식)

Kotlin에서 객체(object)를 사용하면 클래스를 정의하고 그 인스턴스를 생성하는 과정을 한 단계로 처리할 수 있습니다.
이는 재사용 가능한 싱글톤 인스턴스나 일회성 객체가 필요할 때 유용합니다.
이러한 시나리오를 처리하기 위해 Kotlin은 두 가지 주요 접근 방식을 제공합니다. 싱글톤을 생성하기 위한 _객체 선언(object declarations)_과 익명의 일회성 객체를 생성하기 위한 _객체 표현식(object expressions)_입니다.

> 싱글톤(singleton)은 클래스에 인스턴스가 하나만 존재하도록 보장하며, 해당 인스턴스에 대한 전역적인 접근 지점을 제공합니다.
> 
{style="tip"}

객체 선언과 객체 표현식은 다음과 같은 상황에서 가장 잘 사용됩니다:

* **공유 리소스를 위한 싱글톤 사용:** 애플리케이션 전체에서 클래스의 인스턴스가 하나만 존재해야 하는 경우입니다. 예를 들어, 데이터베이스 커넥션 풀을 관리하는 경우가 이에 해당합니다.
* **팩토리 메서드(Factory method) 생성:** 인스턴스를 효율적으로 생성하는 편리한 방법이 필요한 경우입니다. [동반 객체(Companion objects)](#companion-objects)를 사용하면 클래스에 묶인 클래스 수준의 함수와 프로퍼티를 정의할 수 있어, 이러한 인스턴스의 생성과 관리를 간소화할 수 있습니다.
* **기존 클래스 동작을 일시적으로 수정:** 새로운 서브클래스를 만들 필요 없이 기존 클래스의 동작을 수정하고 싶은 경우입니다. 예를 들어, 특정 작업을 위해 객체에 일시적인 기능을 추가하는 경우가 있습니다.
* **타입 안전(Type-safe) 설계가 필요한 경우:** 객체 표현식을 사용하여 인터페이스나 [추상 클래스(abstract classes)](classes.md#abstract-classes)의 일회성 구현이 필요한 경우입니다. 이는 버튼 클릭 핸들러와 같은 시나리오에서 유용할 수 있습니다.

## 객체 선언
{id="object-declarations-overview"}

Kotlin에서는 `object` 키워드 뒤에 이름을 붙이는 객체 선언을 통해 객체의 단일 인스턴스를 생성할 수 있습니다.
이를 통해 클래스 정의와 인스턴스 생성을 한 단계로 수행할 수 있으며, 이는 싱글톤을 구현하는 데 유용합니다.

```kotlin
//sampleStart
// 데이터 프로바이더를 관리하기 위한 싱글톤 객체를 선언합니다
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 새로운 데이터 프로바이더를 등록합니다
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 등록된 모든 데이터 프로바이더를 가져옵니다
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// 데이터 프로바이더 인터페이스 예시
interface DataProvider {
    fun provideData(): String
}

// 데이터 프로바이더 구현 예시
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // ExampleDataProvider의 인스턴스를 생성합니다
    val exampleProvider = ExampleDataProvider()

    // 객체를 참조하려면 이름을 직접 사용합니다
    DataProviderManager.registerDataProvider(exampleProvider)

    // 모든 데이터 프로바이더를 가져와서 출력합니다
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 객체 선언의 초기화는 스레드 안전(Thread-safe)하며, 처음 접근할 때 이루어집니다.
>
{style="tip"}

`object`를 참조하려면 해당 이름을 직접 사용하세요:

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

객체 선언은 [익명 객체가 기존 클래스를 상속하거나 인터페이스를 구현하는 방식](#inherit-anonymous-objects-from-supertypes)과 마찬가지로 상위 타입을 가질 수 있습니다:

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

변수 선언과 달리 객체 선언은 표현식이 아니므로 대입문의 우변에 사용할 수 없습니다:

```kotlin
// 구문 오류: 객체 표현식은 이름을 바인딩할 수 없습니다.
val myObject = object MySingleton {
    val name = "Singleton"
}
```
객체 선언은 로컬(local)일 수 없습니다. 즉, 함수 내부에 직접 중첩될 수 없습니다. 하지만 다른 객체 선언이나 내부(inner) 클래스가 아닌 클래스에는 중첩될 수 있습니다.

### 데이터 객체

Kotlin에서 일반적인 객체 선언을 출력하면, 문자열 표현에는 `object`의 이름과 해시값이 모두 포함됩니다:

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

하지만 객체 선언에 `data` 수정자를 붙이면, [데이터 클래스(data classes)](data-classes.md)와 동일한 방식으로 `toString()`을 호출할 때 객체의 실제 이름을 반환하도록 컴파일러에 지시할 수 있습니다:

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

또한 컴파일러는 `data object`를 위해 다음과 같은 몇 가지 함수를 생성합니다:

* `toString()`: 데이터 객체의 이름을 반환합니다.
* `equals()`/`hashCode()`: 동등성 체크 및 해시 기반 컬렉션을 사용할 수 있게 합니다.

  > `data object`에 대해서는 커스텀 `equals` 또는 `hashCode` 구현을 제공할 수 없습니다.
  >
  {style="note"}

`data object`의 `equals()` 함수는 `data object` 타입을 가진 모든 객체가 동일한 것으로 간주되도록 보장합니다.
대부분의 경우 `data object`는 싱글톤을 선언하므로 런타임에 단 하나의 인스턴스만 갖게 됩니다.
그러나 런타임에 동일한 타입의 다른 객체가 생성되는 예외적인 경우(예: `java.lang.reflect`를 사용하는 플랫폼 리플렉션이나 내부적으로 이 API를 사용하는 JVM 직렬화 라이브러리를 사용하는 경우), 이 함수는 해당 객체들이 동일하게 취급되도록 보장합니다.

> `data object`를 비교할 때는 항상 구조적으로(`==` 연산자 사용) 비교하고, 절대로 참조로(`===` 연산자 사용) 비교하지 마세요.
> 이는 런타임에 데이터 객체의 인스턴스가 둘 이상 존재할 때 발생할 수 있는 함정을 피하는 데 도움이 됩니다.
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

    // 라이브러리가 강제로 MySingleton의 두 번째 인스턴스를 생성하더라도,
    // equals() 함수는 true를 반환합니다:
    println(MySingleton == evilTwin) 
    // true

    // data object를 ===를 사용하여 비교하지 마세요
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 리플렉션은 데이터 객체의 인스턴스화를 허용하지 않습니다.
    // 여기서는 Java 플랫폼 리플렉션을 사용하여 "강제로" 새로운 MySingleton 인스턴스를 생성합니다.
    // 직접 이렇게 하지 마세요!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

생성된 `hashCode()` 함수는 `equals()` 함수와 일관되게 동작하므로, `data object`의 모든 런타임 인스턴스는 동일한 해시 코드를 갖습니다.

#### 데이터 객체와 데이터 클래스의 차이점

`data object`와 `data class` 선언은 종종 함께 사용되며 몇 가지 유사점이 있지만, `data object`를 위해서는 생성되지 않는 함수들이 있습니다:

* `copy()` 함수가 없습니다. `data object` 선언은 싱글톤으로 사용되도록 설계되었기 때문에 `copy()` 함수가 생성되지 않습니다. 싱글톤은 클래스의 인스턴스화를 단일 인스턴스로 제한하는데, 복사본 생성을 허용하면 이 원칙이 깨지게 됩니다.
* `componentN()` 함수가 없습니다. 데이터 클래스와 달리 `data object`에는 데이터 프로퍼티가 없습니다. 데이터 프로퍼티가 없는 객체를 구조 분해(destructure)하려는 시도는 의미가 없으므로 `componentN()` 함수가 생성되지 않습니다.

#### 봉인된 계층 구조에서 데이터 객체 사용하기

데이터 객체 선언은 [봉인된 클래스 또는 봉인된 인터페이스(sealed classes or sealed interfaces)](sealed-classes.md)와 같은 봉인된 계층 구조에서 특히 유용합니다.
이를 통해 객체와 함께 정의했을 수 있는 다른 데이터 클래스들과 대칭성을 유지할 수 있습니다.

이 예시에서 `EndOfFile`을 일반적인 `object` 대신 `data object`로 선언하면, `toString()` 함수를 수동으로 오버라이드할 필요 없이 이름을 출력할 수 있습니다:

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

### 동반 객체

_동반 객체(Companion objects)_를 사용하면 클래스 수준의 함수와 프로퍼티를 정의할 수 있습니다.
이를 통해 팩토리 메서드를 만들거나, 상수를 보유하거나, 공유 유틸리티에 접근하는 것이 쉬워집니다.

클래스 내부의 객체 선언에 `companion` 키워드를 붙일 수 있습니다:

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object`의 멤버는 클래스 이름을 수식어로 사용하여 간단히 호출할 수 있습니다:

```kotlin
class User(val name: String) {
    // User 인스턴스 생성을 위한 팩토리 역할을 하는 동반 객체를 정의합니다
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 클래스 이름을 수식어로 사용하여 동반 객체의 팩토리 메서드를 호출합니다.
    // 새로운 User 인스턴스를 생성합니다
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

동반 객체의 이름은 생략할 수 있으며, 이 경우 `Companion`이라는 이름이 사용됩니다:

```kotlin
class User(val name: String) {
    // 이름 없이 동반 객체를 정의합니다
    companion object { }
}

// 동반 객체에 접근합니다
val companionUser = User.Companion
```

클래스 멤버는 대응하는 동반 객체의 `private` 멤버에 접근할 수 있습니다:

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

클래스 이름이 단독으로 사용될 때, 해당 클래스 이름은 동반 객체의 이름 유무에 관계없이 클래스의 동반 객체에 대한 참조로 작동합니다:

```kotlin
//sampleStart
class User1 {
    // 이름이 있는 동반 객체를 정의합니다
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// 클래스 이름을 사용하여 User1의 동반 객체를 참조합니다
val reference1 = User1

class User2 {
    // 이름이 없는 동반 객체를 정의합니다
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// 클래스 이름을 사용하여 User2의 동반 객체를 참조합니다
val reference2 = User2
//sampleEnd

fun main() {
    // User1의 동반 객체에서 show() 함수를 호출합니다
    println(reference1.show()) 
    // User1's Named Companion Object

    // User2의 동반 객체에서 show() 함수를 호출합니다
    println(reference2.show()) 
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

Kotlin의 동반 객체 멤버가 다른 언어의 정적(static) 멤버처럼 보일 수 있지만, 실제로는 동반 객체의 인스턴스 멤버입니다. 즉, 멤버는 객체 자체에 속합니다.
이 덕분에 동반 객체도 인터페이스를 구현할 수 있습니다:

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Factory 인터페이스를 구현하는 동반 객체를 정의합니다
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // 동반 객체를 Factory로 사용합니다
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

다만 JVM에서는 `@JvmStatic` 어노테이션을 사용하여 동반 객체의 멤버를 실제 정적 메서드 및 필드로 생성할 수 있습니다. 자세한 내용은 [Java 상호운용성](java-to-kotlin-interop.md#static-fields) 섹션을 참고하세요.

## 객체 표현식

객체 표현식은 클래스를 선언하고 그 클래스의 인스턴스를 생성하지만, 둘 다에 이름을 붙이지는 않습니다.
이러한 클래스는 일회성 사용에 유용합니다. 처음부터 새로 만들 수도 있고, 기존 클래스를 상속하거나 인터페이스를 구현할 수도 있습니다. 이러한 클래스의 인스턴스는 이름이 아닌 표현식으로 정의되기 때문에 _익명 객체(anonymous objects)_라고도 부릅니다.

### 처음부터 익명 객체 생성하기

객체 표현식은 `object` 키워드로 시작합니다.

객체가 어떤 클래스도 확장하지 않고 인터페이스도 구현하지 않는 경우, `object` 키워드 뒤의 중괄호 안에 객체의 멤버를 직접 정의할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 객체 표현식은 Any 클래스를 확장하며, Any에는 이미 toString() 함수가 있으므로
        // 이를 오버라이드해야 합니다
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### 상위 타입으로부터 익명 객체 상속받기

특정 타입(들)을 상속받는 익명 객체를 생성하려면, `object`와 콜론 `:` 뒤에 해당 타입을 지정하세요.
그런 다음 해당 클래스를 [상속](inheritance.md)하는 것처럼 이 클래스의 멤버를 구현하거나 오버라이드합니다:

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

상위 타입에 생성자가 있는 경우, 적절한 생성자 파라미터를 전달하세요.
콜론 뒤에 쉼표로 구분하여 여러 상위 타입을 지정할 수 있습니다:

```kotlin
//sampleStart
// balance 프로퍼티를 가진 open 클래스 BankAccount를 생성합니다
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// execute() 함수를 가진 Transaction 인터페이스를 정의합니다
interface Transaction {
    fun execute()
}

// BankAccount에서 특수 트랜잭션을 수행하는 함수입니다
fun specialTransaction(account: BankAccount) {
    // BankAccount 클래스를 상속하고 Transaction 인터페이스를 구현하는 익명 객체를 생성합니다.
    // 제공된 계좌의 balance가 BankAccount 상위 클래스 생성자로 전달됩니다.
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 임시 보너스

        // Transaction 인터페이스의 execute() 함수를 구현합니다
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // 트랜잭션을 실행합니다
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // 초기 잔액이 1000인 BankAccount를 생성합니다
    val myAccount = BankAccount(1000)
    // 생성된 계좌에 대해 특수 트랜잭션을 수행합니다
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 익명 객체를 반환 및 값 타입으로 사용하기

로컬 함수나 [`private`](visibility-modifiers.md#packages) 함수 또는 프로퍼티에서 익명 객체를 반환할 때, 해당 함수나 프로퍼티를 통해 익명 객체의 모든 멤버에 접근할 수 있습니다:

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

이를 통해 특정 프로퍼티를 가진 익명 객체를 반환할 수 있으며, 별도의 클래스를 생성하지 않고도 데이터나 동작을 캡슐화하는 간단한 방법을 제공합니다.

익명 객체를 반환하는 함수나 프로퍼티의 가시성이 `public`, `protected` 또는 `internal`인 경우, 실제 타입은 다음과 같습니다:

* 익명 객체에 선언된 상위 타입이 없는 경우 `Any`입니다.
* 익명 객체에 선언된 상위 타입이 정확히 하나인 경우 해당 상위 타입입니다.
* 선언된 상위 타입이 둘 이상인 경우 명시적으로 선언된 타입입니다.

이 모든 경우에서 익명 객체에 추가된 멤버에는 접근할 수 없습니다. 오버라이드된 멤버는 함수나 프로퍼티의 실제 타입에 선언되어 있는 경우에만 접근 가능합니다. 예를 들면 다음과 같습니다:

```kotlin
//sampleStart
interface Notification {
    // Notification 인터페이스에 notifyUser()를 선언합니다
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 반환 타입은 Any입니다. message 프로퍼티에 접근할 수 없습니다.
    // 반환 타입이 Any인 경우 Any 클래스의 멤버에만 접근할 수 있습니다.
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 익명 객체가 하나의 인터페이스만 구현하므로 반환 타입은 Notification입니다
    // notifyUser() 함수는 Notification 인터페이스의 일부이므로 접근 가능합니다
    // message 프로퍼티는 Notification 인터페이스에 선언되지 않았으므로 접근할 수 없습니다
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 반환 타입은 DetailedNotification입니다. notifyUser() 함수와 message 프로퍼티에 접근할 수 없습니다
    // DetailedNotification 인터페이스에 선언된 멤버만 접근 가능합니다
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // 이 부분은 출력을 생성하지 않습니다
    val notificationManager = NotificationManager()

    // 반환 타입이 Any이므로 여기서 message 프로퍼티에 접근할 수 없습니다
    // 이 부분은 출력을 생성하지 않습니다
    val notification = notificationManager.getNotification()

    // notifyUser() 함수에 접근 가능합니다
    // 반환 타입이 Notification이므로 여기서 message 프로퍼티에 접근할 수 없습니다
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // 반환 타입이 DetailedNotification이므로 여기서 notifyUser() 함수와 message 프로퍼티에 접근할 수 없습니다
    // 이 부분은 출력을 생성하지 않습니다
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 익명 객체에서 변수 접근하기

객체 표현식 내부의 코드는 해당 표현식을 감싸는 스코프(enclosing scope)의 변수에 접근할 수 있습니다:

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter는 마우스 이벤트 함수에 대한 기본 구현을 제공합니다
    // MouseAdapter가 마우스 이벤트를 처리하는 것을 시뮬레이션합니다
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount와 enterCount 변수는 객체 표현식 내에서 접근 가능합니다
}
```

## 객체 선언과 표현식의 동작 차이

객체 선언과 객체 표현식 사이에는 초기화 동작의 차이가 있습니다:

* 객체 표현식은 사용되는 위치에서 _즉시(immediately)_ 실행(및 초기화)됩니다.
* 객체 선언은 처음 접근할 때 _지연(lazily)_ 초기화됩니다.
* 동반 객체는 해당 클래스가 로드(해석)될 때 초기화되며, 이는 Java의 정적 초기화 블록(static initializer)의 시맨틱과 일치합니다.