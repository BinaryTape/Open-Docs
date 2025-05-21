---
title: "객체 선언과 식"
---
Kotlin에서 객체는 클래스를 정의하고 단일 단계로 해당 클래스의 인스턴스를 생성할 수 있도록 합니다.
이는 재사용 가능한 싱글턴 인스턴스 또는 일회성 객체가 필요할 때 유용합니다.
이러한 시나리오를 처리하기 위해 Kotlin은 싱글턴 생성을 위한 _객체 선언(object declarations)_과 익명의 일회성 객체 생성을 위한 _객체 표현식(object expressions)_이라는 두 가지 주요 접근 방식을 제공합니다.

:::tip
싱글턴은 클래스에 인스턴스가 하나만 있도록 보장하고 해당 인스턴스에 대한 전역 액세스 지점을 제공합니다.

:::

객체 선언 및 객체 표현식은 다음과 같은 시나리오에 가장 적합합니다.

* **공유 리소스에 대한 싱글턴 사용:** 애플리케이션 전체에서 클래스의 인스턴스가 하나만 존재하는지 확인해야 합니다.
예를 들어 데이터베이스 연결 풀을 관리합니다.
* **팩토리 메서드 생성:** 인스턴스를 효율적으로 생성하는 편리한 방법이 필요합니다.
[동반 객체](#companion-objects)를 사용하면 클래스에 연결된 클래스 수준 함수 및 속성을 정의하여 이러한 인스턴스의 생성 및 관리를 간소화할 수 있습니다.
* **기존 클래스 동작을 일시적으로 수정:** 새 하위 클래스를 만들 필요 없이 기존 클래스의 동작을 수정하려고 합니다.
예를 들어 특정 작업에 대한 객체에 임시 기능을 추가합니다.
* **타입 안전 설계가 필요함:** 객체 표현식을 사용하여 인터페이스 또는 [추상 클래스](classes#abstract-classes)의 일회성 구현이 필요합니다.
이는 버튼 클릭 처리기와 같은 시나리오에 유용할 수 있습니다.

## 객체 선언

Kotlin에서 객체 선언을 사용하여 객체의 단일 인스턴스를 만들 수 있으며, 객체 선언에는 항상 `object` 키워드 뒤에 이름이 붙습니다.
이를 통해 클래스를 정의하고 단일 단계로 해당 클래스의 인스턴스를 생성할 수 있으므로 싱글턴을 구현하는 데 유용합니다.

```kotlin

// 데이터 공급자를 관리하기 위해 싱글턴 객체를 선언합니다.
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 새 데이터 공급자를 등록합니다.
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 등록된 모든 데이터 공급자를 검색합니다.
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}

// 예제 데이터 공급자 인터페이스
interface DataProvider {
    fun provideData(): String
}

// 예제 데이터 공급자 구현
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "예제 데이터"
    }
}

fun main() {
    // ExampleDataProvider의 인스턴스를 만듭니다.
    val exampleProvider = ExampleDataProvider()

    // 객체를 참조하려면 이름을 직접 사용합니다.
    DataProviderManager.registerDataProvider(exampleProvider)

    // 모든 데이터 공급자를 검색하고 출력합니다.
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [예제 데이터]
}
```

:::tip
객체 선언의 초기화는 스레드로부터 안전하며 첫 번째 액세스 시 수행됩니다.

:::

`object`를 참조하려면 이름을 직접 사용합니다.

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

객체 선언은 또한 [익명 객체가 기존 클래스에서 상속하거나 인터페이스를 구현할 수 있는 방법과 유사하게](#inherit-anonymous-objects-from-supertypes) 슈퍼타입을 가질 수 있습니다.

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

변수 선언과 마찬가지로 객체 선언은 표현식이 아니므로 할당문의 오른쪽에 사용할 수 없습니다.

```kotlin
// 구문 오류: 객체 표현식은 이름을 바인딩할 수 없습니다.
val myObject = object MySingleton {
val name = "Singleton"
}
```
객체 선언은 로컬일 수 없으며, 이는 함수 내부에 직접 중첩할 수 없음을 의미합니다.
그러나 다른 객체 선언 또는 비 내부 클래스 내에 중첩할 수 있습니다.

### 데이터 객체

Kotlin에서 일반 객체 선언을 인쇄할 때 문자열 표현에는 이름과 `object`의 해시가 모두 포함됩니다.

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```

그러나 객체 선언을 `data` 수정자로 표시하면 컴파일러에게 `toString()`을 호출할 때 객체의 실제 이름을 반환하도록 지시할 수 있습니다. 이는 [데이터 클래스](data-classes)에서 작동하는 방식과 동일합니다.

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject) 
    // MyDataObject
}
```

또한 컴파일러는 `data object`에 대해 여러 함수를 생성합니다.

* `toString()`은 데이터 객체의 이름을 반환합니다.
* `equals()`/`hashCode()`는 동등성 검사 및 해시 기반 컬렉션을 활성화합니다.

  > `data object`에 대한 사용자 지정 `equals` 또는 `hashCode` 구현을 제공할 수 없습니다.
  >
  

`data object`에 대한 `equals()` 함수는 `data object` 유형을 가진 모든 객체가 동일한 것으로 간주되도록 합니다.
대부분의 경우 `data object`는 싱글턴을 선언하므로 런타임에 `data object`의 인스턴스가 하나만 있습니다.
그러나 런타임에 동일한 유형의 다른 객체가 생성되는 엣지 케이스(예: `java.lang.reflect`를 사용한 플랫폼
리플렉션 또는 이 API를 내부적으로 사용하는 JVM 직렬화 라이브러리 사용)에서는 객체가 동일한 것으로 처리됩니다.

:::caution
`data object`를 구조적으로만 비교하고(`==` 연산자 사용) 참조로 비교하지 마십시오(`===` 연산자 사용).
이렇게 하면 런타임에 둘 이상의 데이터 객체 인스턴스가 있는 경우 함정을 피할 수 있습니다.

:::

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) 
    // MySingleton

    println(evilTwin) 
    // MySingleton

    // 라이브러리가 MySingleton의 두 번째 인스턴스를 강제로 생성하더라도
    // equals() 함수는 true를 반환합니다.
    println(MySingleton == evilTwin) 
    // true

    // ===를 사용하여 데이터 객체를 비교하지 마십시오.
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 리플렉션은 데이터 객체의 인스턴스화를 허용하지 않습니다.
    // 이것은 "강제로"(Java 플랫폼 리플렉션 사용) 새 MySingleton 인스턴스를 생성합니다.
    // 직접 하지 마십시오!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

생성된 `hashCode()` 함수는 `equals()` 함수와 일관된 동작을 가지므로 `data object`의 모든 런타임
인스턴스는 동일한 해시 코드를 가집니다.

#### 데이터 객체와 데이터 클래스의 차이점

`data object` 및 `data class` 선언은 종종 함께 사용되고 몇 가지 유사점이 있지만 `data object`에 대해 생성되지 않는 몇 가지
함수가 있습니다.

* `copy()` 함수가 없습니다. `data object` 선언은 싱글턴으로 사용하기 위한 것이므로 `copy()`
  함수가 생성되지 않습니다. 싱글턴은 클래스의 인스턴스화를 단일 인스턴스로 제한하며, 이는 인스턴스 복사본을 생성하도록 허용하면
  위반됩니다.
* `componentN()` 함수가 없습니다. `data class`와 달리 `data object`에는 데이터 속성이 없습니다.
  데이터 속성이 없는 객체를 구조 분해하려고 시도하는 것은 의미가 없으므로 `componentN()` 함수가 생성되지 않습니다.

#### 봉인된 계층 구조와 함께 데이터 객체 사용

데이터 객체 선언은 [봉인된 클래스 또는 봉인된 인터페이스](sealed-classes)와 같은 봉인된 계층 구조에 특히 유용합니다.
이를 통해 객체와 함께 정의했을 수 있는 모든 데이터 클래스와 대칭을 유지할 수 있습니다.

이 예에서 `EndOfFile`을 일반 `object` 대신 `data object`로 선언하면
수동으로 재정의할 필요 없이 `toString()` 함수를 얻을 수 있습니다.

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

### 동반 객체

_동반 객체(companion objects)_를 사용하면 클래스 수준 함수 및 속성을 정의할 수 있습니다.
이렇게 하면 팩토리 메서드를 만들고, 상수를 보유하고, 공유 유틸리티에 액세스하는 것이 쉬워집니다.

클래스 내부의 객체 선언은 `companion` 키워드로 표시할 수 있습니다.

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object`의 멤버는 클래스 이름을 한정자로 사용하여 간단히 호출할 수 있습니다.

```kotlin
class User(val name: String) {
    // User 인스턴스 생성을 위한 팩토리 역할을 하는 동반 객체를 정의합니다.
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 클래스 이름을 한정자로 사용하여 동반 객체의 팩토리 메서드를 호출합니다.
    // 새 User 인스턴스를 만듭니다.
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```

`companion object`의 이름을 생략할 수 있으며, 이 경우 이름 `Companion`이 사용됩니다.

```kotlin
class User(val name: String) {
    // 이름 없이 동반 객체를 정의합니다.
    companion object { }
}

// 동반 객체에 액세스합니다.
val companionUser = User.Companion
```

클래스 멤버는 해당 `companion object`의 `private` 멤버에 액세스할 수 있습니다.

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

클래스 이름 자체가 사용되면 동반 객체의 이름 지정 여부에 관계없이 클래스의 동반 객체에 대한 참조 역할을 합니다.

```kotlin

class User1 {
    // 명명된 동반 객체를 정의합니다.
    companion object Named {
        fun show(): String = "User1의 명명된 동반 객체"
    }
}

// 클래스 이름을 사용하여 User1의 동반 객체를 참조합니다.
val reference1 = User1

class User2 {
    // 명명되지 않은 동반 객체를 정의합니다.
    companion object {
        fun show(): String = "User2의 동반 객체"
    }
}

// 클래스 이름을 사용하여 User2의 동반 객체를 참조합니다.
val reference2 = User2

fun main() {
    // User1의 동반 객체에서 show() 함수를 호출합니다.
    println(reference1.show()) 
    // User1의 명명된 동반 객체

    // User2의 동반 객체에서 show() 함수를 호출합니다.
    println(reference2.show()) 
    // User2의 동반 객체
}
```

Kotlin의 동반 객체 멤버는 다른 언어의 static 멤버처럼 보이지만
실제로는 동반 객체의 인스턴스 멤버입니다. 즉, 객체 자체에 속합니다.
따라서 동반 객체는 인터페이스를 구현할 수 있습니다.

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Factory 인터페이스를 구현하는 동반 객체를 정의합니다.
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // 동반 객체를 팩토리로 사용합니다.
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("예제 사용자")
    println(newUser.name)
    // 예제 사용자
}
```

그러나 JVM에서는 `@JvmStatic` 주석을 사용하면 동반 객체의 멤버를 실제 static 메서드 및 필드로 생성할 수 있습니다.
자세한 내용은 [Java 상호 운용성](java-to-kotlin-interop#static-fields) 섹션을 참조하십시오.

## 객체 표현식

객체 표현식은 클래스를 선언하고 해당 클래스의 인스턴스를 만들지만 클래스나 인스턴스 모두 이름을 지정하지 않습니다.
이러한 클래스는 일회성 사용에 유용합니다. 처음부터 만들거나 기존 클래스에서 상속하거나
인터페이스를 구현할 수 있습니다. 이러한 클래스의 인스턴스를 _익명 객체(anonymous objects)_라고도 합니다. 이름이 아닌
표현식으로 정의되기 때문입니다.

### 처음부터 익명 객체 만들기

객체 표현식은 `object` 키워드로 시작합니다.

객체가 클래스를 확장하거나 인터페이스를 구현하지 않으면 `object` 키워드 뒤에 중괄호 안에 객체의 멤버를 직접 정의할 수 있습니다.

```kotlin
fun main() {

    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 객체 표현식은 Any 클래스를 확장하며, Any 클래스에는 이미 toString() 함수가 있으므로
        // 재정의해야 합니다.
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World

}
```

### 슈퍼타입에서 익명 객체 상속

일부 타입(또는 타입)에서 상속하는 익명 객체를 만들려면 `object` 뒤에 콜론 `:`을 사용하여 이 타입을 지정합니다. 그런 다음 [상속](inheritance)하는 것처럼 이 클래스의 멤버를 구현하거나 재정의합니다.

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

슈퍼타입에 생성자가 있는 경우 적절한 생성자 매개변수를 전달합니다.
콜론 뒤에 쉼표로 구분하여 여러 슈퍼타입을 지정할 수 있습니다.

```kotlin

// balance 속성이 있는 open 클래스 BankAccount를 만듭니다.
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// execute() 함수가 있는 Transaction 인터페이스를 정의합니다.
interface Transaction {
    fun execute()
}

// BankAccount에서 특수 트랜잭션을 수행하는 함수
fun specialTransaction(account: BankAccount) {
    // BankAccount 클래스에서 상속하고 Transaction 인터페이스를 구현하는 익명 객체를 만듭니다.
    // 제공된 계정의 balance가 BankAccount 슈퍼클래스 생성자에 전달됩니다.
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 임시 보너스

        // Transaction 인터페이스에서 execute() 함수를 구현합니다.
        override fun execute() {
            println("특수 트랜잭션을 실행합니다. 새 잔액은 $balance입니다.")
        }
    }
    // 트랜잭션을 실행합니다.
    temporaryAccount.execute()
}

fun main() {
    // 초기 잔액이 1000인 BankAccount를 만듭니다.
    val myAccount = BankAccount(1000)
    // 만든 계정에서 특수 트랜잭션을 수행합니다.
    specialTransaction(myAccount)
    // 특수 트랜잭션을 실행합니다. 새 잔액은 1500입니다.
}
```

### 반환 및 값 타입으로 익명 객체 사용

로컬 또는 [`private`](visibility-modifiers#packages) 함수 또는 속성에서 익명 객체를 반환하면
해당 익명 객체의 모든 멤버는 해당 함수 또는 속성을 통해 액세스할 수 있습니다.

```kotlin

class UserPreferences {
    private fun getPreferences() = object {
        val theme: String = "Dark"
        val fontSize: Int = 14
    }

    fun printPreferences() {
        val preferences = getPreferences()
        println("테마: ${preferences.theme}, 글꼴 크기: ${preferences.fontSize}")
    }
}

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // 테마: Dark, 글꼴 크기: 14
}
```

이를 통해 특정 속성이 있는 익명 객체를 반환하여
별도의 클래스를 만들지 않고도 데이터를 캡슐화하는 간단한 방법을 제공할 수 있습니다.

익명 객체를 반환하는 함수 또는 속성에 `public`, `protected` 또는 `internal` 가시성이 있는 경우 실제 타입은 다음과 같습니다.

* 익명 객체에 선언된 슈퍼타입이 없으면 `Any`입니다.
* 익명 객체의 선언된 슈퍼타입이 정확히 하나인 경우 해당 슈퍼타입입니다.
* 선언된 슈퍼타입이 둘 이상인 경우 명시적으로 선언된 타입입니다.

이러한 모든 경우에서 익명 객체에 추가된 멤버는 액세스할 수 없습니다. 재정의된 멤버는 함수 또는 속성의 실제 타입에서 선언된 경우 액세스할 수 있습니다. 예를 들면 다음과 같습니다.

```kotlin

interface Notification {
    // Notification 인터페이스에서 notifyUser()를 선언합니다.
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 반환 타입은 Any입니다. message 속성은 액세스할 수 없습니다.
    // 반환 타입이 Any인 경우 Any 클래스의 멤버만 액세스할 수 있습니다.
    fun getNotification() = object {
        val message: String = "일반 알림"
    }

    // 익명 객체가 인터페이스를 하나만 구현하므로 반환 타입은 Notification입니다.
    // notifyUser() 함수는 Notification 인터페이스의 일부이므로 액세스할 수 있습니다.
    // message 속성은 Notification 인터페이스에서 선언되지 않았으므로 액세스할 수 없습니다.
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("이메일 알림을 보냅니다.")
        }
        val message: String = "메일이 도착했습니다!"
    }

    // 반환 타입은 DetailedNotification입니다. notifyUser() 함수와 message 속성은 액세스할 수 없습니다.
    // DetailedNotification 인터페이스에서 선언된 멤버만 액세스할 수 있습니다.
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("자세한 알림을 보냅니다.")
        }
        val message: String = "자세한 메시지 콘텐츠"
    }
}

fun main() {
    // 출력이 없습니다.
    val notificationManager = NotificationManager()

    // 반환 타입이 Any이므로 message 속성은 여기에서 액세스할 수 없습니다.
    // 출력이 없습니다.
    val notification = notificationManager.getNotification()

    // notifyUser() 함수는 액세스할 수 있습니다.
    // 반환 타입이 Notification이므로 message 속성은 여기에서 액세스할 수 없습니다.
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // 이메일 알림을 보냅니다.

    // 반환 타입이 DetailedNotification이므로 notifyUser() 함수와 message 속성은 여기에서 액세스할 수 없습니다.
    // 출력이 없습니다.
    val detailedNotification = notificationManager.getDetailedNotification()
}
```

### 익명 객체에서 변수 액세스

객체 표현식 본문 내의 코드는 둘러싸는 범위의 변수에 액세스할 수 있습니다.

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter는 마우스 이벤트 함수에 대한 기본 구현을 제공합니다.
    // 마우스 이벤트 처리를 시뮬레이션하는 MouseAdapter
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount 및 enterCount 변수는 객체 표현식 내에서 액세스할 수 있습니다.
}
```

## 객체 선언과 표현식 간의 동작 차이

객체 선언과 객체 표현식 간에는 초기화 동작에 차이가 있습니다.

* 객체 표현식은 사용되는 위치에서 _즉시_ 실행(및 초기화)됩니다.
* 객체 선언은 처음 액세스할 때 _지연_ 초기화됩니다.
* 동반 객체는 Java
  static 초기화 프로그램의 의미와 일치하는 해당 클래스가 로드(해결)될 때 초기화됩니다.

  ```